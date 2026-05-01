"use server";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createWorkspaceSchema } from "@/schema/workspace";
import { getServerSession } from "next-auth";

export async function createWorkspaceAction(
  prevData: TCreateState,
  formData: FormData,
): Promise<TCreateState> {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user) {
    return {
      success: false,
      message: "You must be logged in to create a workspace.",
      errors: {},
    };
  }

  const data = {
    name: formData.get("name"),
    description: formData.get("description"),
  };

  const parsedData = createWorkspaceSchema.safeParse(data);
  if (!parsedData.success) {
    const fieldErrors = parsedData.error.flatten().fieldErrors;
    return {
      success: false,
      message: "Validation failed",
      errors: {
        name: fieldErrors.name?.[0],
        description: fieldErrors.description?.[0],
      },
    };
  }

  const { name, description } = parsedData.data;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({
        data: {
          name,
          description: description || null,
          ownerId: session.user.id,
        },
      });

      await tx.workspaceMember.create({
        data: {
          workspaceId: workspace.id,
          userId: session.user.id,
          role: "OWNER",
        },
      });

      return {
        workspace_id: workspace.id,
        success: true,
        message: "Workspace created successfully",
      };
    });

    return result;
  } catch {
    return {
      success: false,
      message: "Something went wrong while creating workspace",
    };
  }
}
