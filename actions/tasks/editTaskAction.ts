"use server";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatTaskZodErrors } from "@/lib/utils";
import { createTaskSchema } from "@/schema/taskSchema";
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

  const validatedFields = createTaskSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please fix the form errors.",
      values: rawData,
      errors: formatTaskZodErrors(validatedFields.error.flatten().fieldErrors),
    };
  }

  const { title, description, priority, dueDate } = validatedFields.data;
  
  await prisma.task.update({
    where: {
      id: rawData.id.toString()
    },
    data: {
      title: title,
      description: description,
      priority: priority,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });
  revalidatePath('/tasks')
  return {
    success: true,
    message: "Task created successfully.",
    values: {
      title: "",
      description: "",
      priority: "",
      dueDate: "",
    },
    errors: {},
  };
}
