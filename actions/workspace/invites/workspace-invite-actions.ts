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
  // 1- member in this workspace and just adimn or owner can invite another one
  // 2- invited one have account
  // 3- check invited one dosent exisit
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
      message: "email dosent have an account in our website...",
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
      message: "Already founded in this workspace",
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
    success: true,
    message: "Workspace created successfully",
  };
}

export async function acceptrejectInvitationAction(
  inviteId: string,
  inviteStatus: InviteStatus,
) {
  try {
    const user = await getCurrentUser();
    let receiverUserId: string | null = null;
    let realtimeNotification: unknown = null;

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
        // add the user to workspace members
        await tx.workspaceMember.create({
          data: {
            workspaceId: invite.workspaceId,
            userId: user.id,
            role: invite.role,
          },
        });
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
            // link: `/workspaces/${invite.workspaceId}` || null,
            link: "/workspaces/invitations",
            senderId: user.id || null,
            workspaceId: invite.workspaceId || null,
            inviteId: inviteId || null,
          },
          tx,
        );
        receiverUserId = invite.invitedById;
        realtimeNotification = notification;
      }
      if (receiverUserId && realtimeNotification) {
        emitNotificationToUser(receiverUserId, realtimeNotification);
      }

      return updatedInvite;
    });
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to update invite",
    };
  }
}
