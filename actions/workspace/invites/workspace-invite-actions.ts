"use server";
import { getCurrentUser } from "@/lib/get-current-user";
import { prisma } from "@/lib/prisma";
import { inviteMembersSchema } from "@/schema/workspace";
import { revalidatePath } from "next/cache";
import { NotificationType, InviteStatus } from "@/generated/prisma/enums";
import { createNotification } from "@/lib/notifications/create-user-notifications";
import { emitNotificationToUser } from "@/lib/socket-server";

export async function createInviteAction(
  prevData: TCreateState,
  formData: FormData,
  workspaceId: string,
  workspace_name: string,
): Promise<TCreateState> {
   const user = await getCurrentUser();
    if (!user) {
      return { success: false, message: "Unauthorized" };
    }
  // 1- member in this workspace and only admin or owner can invite another one
  // 2- invited one have account
  // 3- check invited one does not exist
  // 4- if invited is pending before
  // 5- create invite
  // 6- create notification
  // 7- call the socket.io to handle event
  const memberShip = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId,
      userId: user.id,
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
      message: "This email does not have an account in our app.",
      errors: {},
    };
  }

  const alreadyMember = await prisma.workspaceMember.findFirst({
    where: {
      userId: haveAccount.id,
      workspaceId,
    },
  });
  if (alreadyMember) {
    return {
      success: false,
      message: "This user is already in this workspace.",
      errors: {},
    };
  }

  const invitedBefore = await prisma.workspaceInvite.findFirst({
    where: {
      workspaceId,
      email,
      status: {
        in: ["PENDING", "ACCEPTED"],
      },
    },
  });
  if (invitedBefore) {
    return {
      success: false,
      message: "member was invited already",
      errors: {},
    };
  }

  const invite = await prisma.workspaceInvite.create({
    data: {
      email,
      role,
      message,
      workspaceId,
      invitedById: user.id,
    },
  });
  const invitedUser = await prisma.user.findFirst({
    where: { email },
    select: { id: true },
  });

  if (invitedUser?.id) {
    const notification = await createNotification({
      userId: invitedUser.id,
      senderId: user.id,
      workspaceId,
      inviteId: invite.id,
      type: NotificationType.WORKSPACE_INVITE_RECEIVED,
      title: "Workspace invite",
      message: `You were invited to join ${workspace_name} as ${role}`,
      link: "/workspaces/invitations",
    });

    emitNotificationToUser(invitedUser.id, notification);
  }

  revalidatePath(`/workspaces/${workspaceId}`);
  return {
    workspace_id: workspaceId,
    success: true,
    message: "Invitation sent successfully",
  };
}

export async function acceptrejectInvitationAction(
  inviteId: string,
  inviteStatus: InviteStatus,
) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.email) {
      return { success: false, message: "Unauthorized" };
    }

    if (inviteStatus !== "ACCEPTED" && inviteStatus !== "REJECTED") {
      return { success: false, message: "Invalid invitation status" };
    }

    let receiverUserId: string | null = null;
    let realtimeNotification: unknown = null;
    let workspaceId: string | null = null;
    let expiredInvite = false;

    await prisma.$transaction(async (tx) => {
      const invite = await tx.workspaceInvite.findUnique({
        where: { id: inviteId },
        include: {
          invitedBy: true,
          workspace: true,
        },
      });
      if (!invite) {
        throw new Error("Invite not found");
      }

      if (invite.email.toLowerCase() !== user.email!.toLowerCase()) {
        throw new Error("You are not allowed to update this invitation");
      }

      if (invite.status !== "PENDING") {
        throw new Error("This invitation is no longer pending");
      }

      if (invite.expiresAt && invite.expiresAt < new Date()) {
        workspaceId = invite.workspaceId;
        expiredInvite = true;

        await tx.workspaceInvite.update({
          where: { id: inviteId },
          data: { status: "EXPIRED" },
        });

        await tx.notification.updateMany({
          where: { inviteId, userId: user.id },
          data: {
            isRead: true,
          },
        });

        return null;
      }

      workspaceId = invite.workspaceId;

      const updatedInvite = await tx.workspaceInvite.update({
        where: { id: inviteId },
        data: {
          status: inviteStatus,
        },
      });

      if (inviteStatus === "REJECTED") {
        // update notification isRead to be true
        await tx.notification.updateMany({
          where: { inviteId, userId: user.id },
          data: {
            isRead: true,
          },
        });

        const notification = await createNotification(
          {
            userId: invite.invitedById,
            type: NotificationType.WORKSPACE_INVITE_REJECTED,
            title: "Invitation rejected",
            message: `${user.name} rejected your invitation to ${invite.workspace.name}`,
            // link: `/workspaces/${invite.workspaceId}` || null,
            link: `/workspaces/${invite.workspaceId}`,
            senderId: user.id || null,
            workspaceId: null,
            inviteId: null,
          },
          tx,
        );
        receiverUserId = invite.invitedById;
        realtimeNotification = notification;
      }

      if (inviteStatus === "ACCEPTED") {
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

        if (existingMember && existingMember.role !== invite.role) {
          await tx.workspaceMember.update({
            where: {
              workspaceId_userId: {
                workspaceId: invite.workspaceId,
                userId: user.id,
              },
            },
            data: {
              role: invite.role,
            },
          });
        }

        // update notification isRead to be true
        await tx.notification.updateMany({
          where: { inviteId, userId: user.id },
          data: {
            isRead: true,
          },
        });

        // create notification as accepted invite
        const notification = await createNotification(
          {
            userId: invite.invitedById,
            type: NotificationType.WORKSPACE_INVITE_ACCEPTED,
            title: "Invitation accepted",
            message: `${user.name} accepted your invitation to ${invite.workspace.name}`,
            link: `/workspaces/${invite.workspaceId}`,
            senderId: user.id || null,
            workspaceId: invite.workspaceId,
            inviteId: inviteId || null,
          },
          tx,
        );
        receiverUserId = invite.invitedById;
        realtimeNotification = notification;
      }
      return updatedInvite;
    });

    if (receiverUserId && realtimeNotification) {
      emitNotificationToUser(receiverUserId, realtimeNotification);
    }

    revalidatePath("/workspaces/invitations");
    if (workspaceId) {
      revalidatePath(`/workspaces/${workspaceId}`);
      revalidatePath(`/workspaces/${workspaceId}/members`);
    }

    if (expiredInvite) {
      return { success: false, message: "This invitation has expired" };
    }

    return {
      success: true,
      message:
        inviteStatus === "ACCEPTED"
          ? "Invitation accepted successfully"
          : "Invitation rejected successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update invite",
    };
  }
}
