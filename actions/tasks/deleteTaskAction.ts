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
    await prisma.task.delete({
      where: {
        userId: session.user.id,
        id: taskId,
      },
    });
    revalidatePath('/tasks')

    return { success: true, message: "Task Deleted Successfully." };
  } catch (error) {
    return { success: false, message: "Task colud't Delete." };
  }
}
