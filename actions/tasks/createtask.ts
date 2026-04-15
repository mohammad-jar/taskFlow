"use server";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatTaskZodErrors } from "@/lib/utils";
import { createTaskSchema } from "@/schema/taskSchema";
import { getServerSession } from "next-auth";





export async function createTaskAction(
  prevState: CreateTaskState,
  formData: FormData,
): Promise<CreateTaskState> {
  const rawData = {
    title: formData.get("title")?.toString() || "",
    description: formData.get("description")?.toString() || "",
    priority: formData.get("priority")?.toString() || "",
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

  const validationData = {
    ...rawData,
    priority: rawData.priority.toUpperCase(),
  };

  const validatedFields = createTaskSchema.safeParse(validationData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Please fix the form errors.",
      values: rawData,
      errors: formatTaskZodErrors(validatedFields.error.flatten().fieldErrors),
    };
  }

  const { title, description, priority, dueDate } = validatedFields.data;
  


  const isTaskExists = await prisma.task.findFirst({
    where: {
      title,
      description,
    },
    select: {
      id: true,
    },
  });
  // make a dialog to ensure the user want to create a task with the same title and description
  // if (isTaskExists ) {
  //   return {
  //     success: false,
  //     message:
  //       "A task with the same title and description already exists. Do you want to create a duplicate task?",
  //     values: rawData,
  //     errors: {},
  //   };
  // }

  await prisma.task.create({
    data: {
      title,
      description,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      userId: user.id,
    },
  });

  return {
    success: true,
    message:"Task created successfully.",
    values: {
      title: "",
      description: "",
      priority: "",
      dueDate: "",

    },
    errors: {},
  };
}
