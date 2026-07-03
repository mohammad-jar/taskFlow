"use server";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatTaskZodErrors } from "@/lib/utils";
import { editTaskSchema } from "@/schema/taskSchema";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function editTaskAction(
  prevState: CreateTaskState,
  formData: FormData,
): Promise<CreateTaskState> {
  const rawData = {
    id: formData.get("taskId")?.toString() || "",
    title: formData.get("title")?.toString() || "",
    description: formData.get("description")?.toString() || "",
    priority: formData.get("priority")?.toString().toUpperCase() || "",
    dueDate: formData.get("dueDate")?.toString() || "",
  };


  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user) {
    return {
      success: false,
      message: "You must be logged in to create a task.",
      values: rawData,
      errors: {},
    };
  }

  const validatedFields = editTaskSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please fix the form errors.",
      values: rawData,
      errors: formatTaskZodErrors(validatedFields.error.flatten().fieldErrors),
    };
  }

  const { title, description, priority, dueDate } = validatedFields.data;

  try {
    const task = await prisma.task.findUnique({
      where: { id: rawData.id },
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
      return {
        success: false,
        message: "Task not found.",
        values: rawData,
        errors: {},
      };
    }

    const currentMember = task.workspace.members[0];
    const canEditTask =
      task.createdById === user.id ||
      currentMember?.role === "OWNER" ||
      currentMember?.role === "ADMIN";

    if (!canEditTask) {
      return {
        success: false,
        message: "You are not allowed to edit this task.",
        values: rawData,
        errors: {},
      };
    }

    await prisma.task.update({
      where: {
        id: task.id,
      },
      data: {
        title: title,
        description: description,
        priority: priority,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    revalidatePath(`/workspaces/${task.workspaceId}/tasks`);
    revalidatePath(`/workspaces/${task.workspaceId}/tasks/${task.id}`);
    revalidatePath(`/workspaces/${task.workspaceId}/board`);
  } catch {
    return {
      success: false,
      message: "Something went wrong while updating the task.",
      values: rawData,
      errors: {},
    };
  }

  return {
    success: true,
    message: "Task updated successfully.",
    values: {
      title: "",
      description: "",
      priority: "",
      dueDate: "",
    },
    errors: {},
  };
}
