"use server";
import { NotificationType } from "@/generated/prisma/enums";
import { getCurrentUser } from "@/lib/get-current-user";
import { createNotification } from "@/lib/notifications/create-user-notifications";
import { prisma } from "@/lib/prisma";
import { emitNotificationToUser } from "@/lib/socket-server";
import { formatTaskZodErrors } from "@/lib/utils";
import { createTaskSchema } from "@/schema/taskSchema";

export async function createTaskAction(
  prevState: CreateTaskState,
  formData: FormData,
): Promise<CreateTaskState> {
  try {
    const rawData = {
      title: formData.get("title")?.toString() || "",
      description: formData.get("description")?.toString() || "",
      priority: formData.get("priority")?.toString() || "",
      dueDate: formData.get("dueDate")?.toString() || "",
      assigneeId: formData.get("assigneeId")?.toString() || "",
      workspaceId: formData.get("workspaceId")?.toString() || "",
    };

    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        message: "You must be logged in.",
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

    const { title, description, priority, dueDate, assigneeId, workspaceId } =
      validatedFields.data;

    const workspaceMember = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: user.id,
      },
      select: {
        role: true,
      },
    });

    if (!workspaceMember) {
      return {
        success: false,
        message: "You are not a member of this workspace.",
        values: rawData,
        errors: {},
      };
    }

    const canCreateTask =
      workspaceMember.role === "ADMIN" || workspaceMember.role === "OWNER";

    if (!canCreateTask) {
      return {
        success: false,
        message: "Only admins can create tasks.",
        values: rawData,
        errors: {},
      };
    }

    const assigneeExists = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId,
        userId: assigneeId,
      },
      select: {
        id: true,
      },
    });

    if (!assigneeExists) {
      return {
        success: false,
        message: "Selected assignee is not a member of this workspace.",
        values: rawData,
        errors: {
          assigneeId: "Invalid assignee",
        },
      };
    }

    await prisma.task.create({
      data: {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        createdById: user.id,
        assigneeId,
        workspaceId,
      },
    });

    const notification = await createNotification({
          userId: assigneeId,
          senderId: user.id,
          workspaceId,
          type: NotificationType.WORKSPACE_INVITE_RECEIVED,
          title: "assigned to task",
          message: `you have assigned to task : ${title} in workspace ${workspaceId}`,
          link: `/workspaces/${workspaceId}/board`,
        });
    
        emitNotificationToUser(assigneeId, notification);

    return {
      success: true,
      message: "Task created successfully.",
      values: {
        title: "",
        description: "",
        priority: "",
        dueDate: "",
        assigneeId: "",
        workspaceId: "",
      },
      errors: {},
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Something went wrong while creating the task.",
      values: {
        title: formData.get("title")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        priority: formData.get("priority")?.toString() || "",
        dueDate: formData.get("dueDate")?.toString() || "",
        assigneeId: formData.get("assigneeId")?.toString() || "",
        workspaceId: formData.get("workspaceId")?.toString() || "",
      },
      errors: {},
    };
  }
}
