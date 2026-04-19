"use server";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { inviteMembersSchema } from "@/schema/workspace";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function inviteMembersAction(
  prevData: TCreateState,
  formData: FormData,
  workspaceId: string,
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
  // 1- member in this workspace and just adimn or owner can invite another one
  // 2- invited one have account
  // 3- check invited one dosent exisit
  // 4- if invited is pending before
  const memberShip = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId,
      userId: session.user.id,
      role: {
        in: ["ADMIN", "OWNER"],
      },
    },
  });

  if (!memberShip) {
    return {
      success: false,
      message:
        "must be admin or owner for this workspace to able to invite others",
      errors: {},
    };
  }

  const data = {
    email: formData.get("email"),
    role: formData.get("role")?.toString().toUpperCase(),
    message: formData.get("message"),
  };

  const parsedData = inviteMembersSchema.safeParse(data);
  if (!parsedData.success) {
    const fieldErrors = parsedData.error.flatten().fieldErrors;
    return {
      success: false,
      message: "Validation failed",
      errors: {
        email: fieldErrors.email?.[0],
        role: fieldErrors.role?.[0],
        message: fieldErrors.message?.[0],
      },
    };
  }
  const { email, role, message } = parsedData.data;

  const haveAccount = await prisma.user.findFirst({
    where: { email },
  });
  if (!haveAccount) {
    return {
      success: false,
      message: "email dosent have an account in our website...",
      errors: {},
    };
  }

  const alreadyMember = await prisma.workspaceMember.findFirst({
    where: {
      userId: haveAccount.id,
      workspaceId
    }
  })
  if (alreadyMember) {
     return {
      success: false,
      message: "Already founded in this workspace",
      errors: {},
    };
  }

  const invitedBefore = await prisma.workspaceInvite.findFirst({
    where: {
      workspaceId,
      email,
    },
  });
  if (invitedBefore) {
    return {
      success: false,
      message: "member was invited already",
      errors: {},
    };
  }

  

  await prisma.workspaceInvite.create({
    data: {
      email,
      role,
      message,
      workspaceId,
      invitedById: session.user.id,
    },
  });

  revalidatePath(`/workspaces/${workspaceId}`);
  return {
    success: true,
    message: "Workspace created successfully",
  };
}







export async function updateMemberAndInvite(
  inviteId: string,
  inviteStatus: string,
) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const invite = await tx.workspaceInvite.findUnique({
        where: { id: inviteId },
        select: {
          id: true,
          email: true,
          workspaceId: true,
          role: true,
        },
      });

      if (!invite) {
        throw new Error("Invite not found");
      }

      const updatedInvite = await tx.workspaceInvite.update({
        where: { id: inviteId },
        data: {
          status: inviteStatus,
        },
      });

      if (inviteStatus === "ACCEPTED") {
        const user = await tx.user.findUnique({
          where: { email: invite.email },
          select: { id: true },
        });

        if (!user) {
          throw new Error("User not found");
        }

        const existingMember = await tx.workspaceMember.findUnique({
          where: {
            workspaceId_userId: {
              workspaceId: invite.workspaceId,
              userId: user.id,
            },
          },
        });

        if (!existingMember) {
          await tx.workspaceMember.create({
            data: {
              workspaceId: invite.workspaceId,
              userId: user.id,
              role: invite.role,
            },
          });
        }
      }

      return updatedInvite;
    });

    return {
      success: true,
      message: "Invite updated successfully",
      data: result,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to update invite",
    };
  }
}
