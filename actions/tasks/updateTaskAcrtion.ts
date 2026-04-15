"use server";

import { authOptions } from "@/auth";
import { TaskStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function updateTaskStatus(taskId: string, status: TaskStatus) {
  try {
    const session = await getServerSession(authOptions);
    if(!session) {
    return { success: false, message: "login first" };

    }
    await prisma.task.update({
       where: { id: taskId, userId: session.user.id },
       data: {status},
      });
    revalidatePath("/tasks");
    return { success: true, message: "Status Updated Successfully" };
  } catch (error) {
    return { success: false, message: "Status could't Updated Successfully" };
    
  }
}
