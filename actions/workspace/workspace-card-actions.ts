"use server";

import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createWorkspaceSchema } from "@/schema/workspace";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";

export type WorkspaceEditState = {
  success: boolean;
  message: string;
  resultId?: string;
  errors?: {
    name?: string;
    description?: string;
  };
};

async function getCurrentMembership(workspaceId: string) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) {
    return null;
  }

  return prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId,
      },
    },
    select: {
      role: true,
      userId: true,
    },
  });
}

export async function updateWorkspaceAction(
  _prevState: WorkspaceEditState,
  formData: FormData,
): Promise<WorkspaceEditState> {
  const workspaceId = String(formData.get("workspaceId") || "");
  const data = {
    name: formData.get("name"),
    description: formData.get("description"),
  };

  if (!workspaceId) {
    return {
      success: false,
      message: "Workspace is missing.",
      resultId: crypto.randomUUID(),
    };
  }

  const membership = await getCurrentMembership(workspaceId);
  if (!membership || !["OWNER", "ADMIN"].includes(membership.role)) {
    return {
      success: false,
      message: "You do not have permission to update this workspace.",
      resultId: crypto.randomUUID(),
    };
  }

  const parsedData = createWorkspaceSchema.safeParse(data);
  if (!parsedData.success) {
    const fieldErrors = parsedData.error.flatten().fieldErrors;

    return {
      success: false,
      message: "Please fix the highlighted fields.",
      resultId: crypto.randomUUID(),
      errors: {
        name: fieldErrors.name?.[0],
        description: fieldErrors.description?.[0],
      },
    };
  }

  const { name, description } = parsedData.data;

  try {
    await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        name,
        description: description || null,
      },
    });

    revalidatePath("/workspaces");
    revalidatePath(`/workspaces/${workspaceId}`);
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Workspace updated successfully.",
      resultId: crypto.randomUUID(),
    };
  } catch {
    return {
      success: false,
      message: "Something went wrong while updating the workspace.",
      resultId: crypto.randomUUID(),
    };
  }
}

export async function deleteWorkspaceAction(workspaceId: string) {
  if (!workspaceId) {
    return {
      success: false,
      message: "Workspace is missing.",
    };
  }

  const membership = await getCurrentMembership(workspaceId);
  if (!membership || membership.role !== "OWNER") {
    return {
      success: false,
      message: "Only the workspace owner can delete this workspace.",
    };
  }

  try {
    await prisma.workspace.delete({
      where: { id: workspaceId },
    });

    revalidatePath("/workspaces");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Workspace deleted successfully.",
    };
  } catch {
    return {
      success: false,
      message: "Something went wrong while deleting the workspace.",
    };
  }
}
