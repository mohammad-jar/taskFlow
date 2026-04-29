"use server";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function deleteTaskAction(taskId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { success: false, message: "login first to be able delete" };
    }
    const deletedTask = await prisma.task.deleteMany({
      where: {
        id: taskId,
        createdById: session.user.id,
      },
    });
    if (deletedTask.count === 0) {
      return { success: false, message: "Task not found or not allowed." };
    }
    revalidatePath('/tasks')

    return { success: true, message: "Task Deleted Successfully." };
  } catch (error) {
    return { success: false, message: "Task colud't Delete." };
  }
}
