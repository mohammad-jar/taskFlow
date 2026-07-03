"use server";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function deleteTaskAction(taskId: string) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!user) {
      return { success: false, message: "Log in first to delete this task." };
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: {
        id: true,
        createdById: true,
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
      return { success: false, message: "Task not found or not allowed." };
    }

    const currentMember = task.workspace.members[0];
    const canDeleteTask =
      task.createdById === user.id ||
      currentMember?.role === "OWNER" ||
      currentMember?.role === "ADMIN";

    if (!canDeleteTask) {
      return { success: false, message: "Task not found or not allowed." };
    }

    await prisma.task.delete({
      where: { id: task.id },
    });

    revalidatePath(`/workspaces/${task.workspaceId}/tasks`);
    revalidatePath(`/workspaces/${task.workspaceId}/tasks/${task.id}`);
    revalidatePath(`/workspaces/${task.workspaceId}/board`);

    return { success: true, message: "Task deleted successfully." };
  } catch {
    return { success: false, message: "Task could not be deleted." };
  }
}
