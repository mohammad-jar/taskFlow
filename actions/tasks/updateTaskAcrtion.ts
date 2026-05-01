"use server";
import { NotificationType, TaskStatus } from "@/generated/prisma/enums";
import { getCurrentUser } from "@/lib/get-current-user";
import { createNotification } from "@/lib/notifications/create-user-notifications";
import { prisma } from "@/lib/prisma";
import { emitNotificationToUser } from "@/lib/socket-server";
import { revalidatePath } from "next/cache";

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }
    const updated_task = await prisma.task.update({
      where: { id: taskId },
      data: { status },
    });
    // send notification to admin
    let newNotification;
    if (status === "IN_PROGRESS") {
      const notification = await createNotification({
        userId: updated_task.createdById,
        senderId: user.id,
        workspaceId: updated_task.workspaceId,
        taskId: updated_task.id,
        type: NotificationType.TASK_STATUS_UPDATED,
        title: "start working on task",
        message: `${user.name} start working on his task (${updated_task.title}) for this workspace ${updated_task.workspaceId}`,
        link: `/workspaces/${updated_task.workspaceId}/board`,
      });
      newNotification = notification;
    } else {
      const notification = await createNotification({
        userId: updated_task.createdById,
        senderId: user.id,
        workspaceId: updated_task.workspaceId,
        taskId: updated_task.id,
        type: NotificationType.TASK_STATUS_UPDATED,
        title: "finsihing task",
        message: `${user.name} finished his (${updated_task.title}) Task for this workspace ${updated_task.workspaceId}`,
        link: `/workspaces/${updated_task.workspaceId}/board`,
      });
      newNotification = notification;
    }

    emitNotificationToUser(updated_task.createdById, newNotification);

    revalidatePath(`/workspaces/${updated_task.workspaceId}/board`);
    return { success: true, message: "Status Updated Successfully" };
  } catch {
    return { success: false, message: "Status could't Updated Successfully" };
  }
}
