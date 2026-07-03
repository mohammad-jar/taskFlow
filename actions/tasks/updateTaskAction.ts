"use server";
import { NotificationType, TaskStatus } from "@/generated/prisma/enums";
import { getCurrentUser } from "@/lib/get-current-user";
import { createNotification } from "@/lib/notifications/create-user-notifications";
import { prisma } from "@/lib/prisma";
import { emitNotificationToUser } from "@/lib/socket-server";
import { revalidatePath } from "next/cache";

const TASK_STATUSES = Object.values(TaskStatus);

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }

    if (!TASK_STATUSES.includes(status)) {
      return { success: false, message: "Invalid task status." };
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: {
        id: true,
        title: true,
        createdById: true,
        assigneeId: true,
        workspaceId: true,
        workspace: {
          select: {
            members: {
              where: { userId: user.id },
              select: { role: true },
            },
          },
        },
      },
    });

    if (!task) {
      return { success: false, message: "Task not found." };
    }

    const currentMember = task.workspace.members[0];
    const canUpdateStatus =
      task.assigneeId === user.id ||
      task.createdById === user.id ||
      currentMember?.role === "OWNER" ||
      currentMember?.role === "ADMIN";

    if (!canUpdateStatus) {
      return { success: false, message: "You are not allowed to update this task." };
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status },
    });

    if (updatedTask.createdById !== user.id) {
      const newNotification = await createNotification({
        userId: updatedTask.createdById,
        senderId: user.id,
        workspaceId: updatedTask.workspaceId,
        taskId: updatedTask.id,
        type: NotificationType.TASK_STATUS_UPDATED,
        title: "Task status updated",
        message: `${user.name} changed "${updatedTask.title}" to ${status.replaceAll("_", " ").toLowerCase()}.`,
        link: `/workspaces/${updatedTask.workspaceId}/tasks/${updatedTask.id}`,
      });

      emitNotificationToUser(updatedTask.createdById, newNotification);
    }

    revalidatePath(`/workspaces/${updatedTask.workspaceId}/board`);
    revalidatePath(`/workspaces/${updatedTask.workspaceId}/tasks`);
    revalidatePath(`/workspaces/${updatedTask.workspaceId}/tasks/${updatedTask.id}`);
    return { success: true, message: "Status updated successfully." };
  } catch {
    return { success: false, message: "Status could not be updated." };
  }
}
