import { prisma } from "@/lib/prisma";
import type { InviteStatus } from "@/generated/prisma/enums";

const INVITE_STATUSES: InviteStatus[] = [
  "PENDING",
  "ACCEPTED",
  "REJECTED",
  "EXPIRED",
];

const isInviteStatus = (value: string): value is InviteStatus =>
  INVITE_STATUSES.includes(value as InviteStatus);

export async function getInviteStatus(email: string) {
  const [pending, rejected, accepted, expired] = await Promise.all([
    prisma.workspaceInvite.count({
      where: { email, status: "PENDING" },
    }),
    prisma.workspaceInvite.count({
      where: { email, status: "REJECTED" },
    }),
    prisma.workspaceInvite.count({
      where: { email, status: "ACCEPTED" },
    }),
    prisma.workspaceInvite.count({
      where: { email, status: "EXPIRED" },
    }),
  ]);

  return {
    pending,
    rejected,
    accepted,
    expired,
  };
}

export async function getUserInvites(email: string, status?: string) {
  try {
    const normalizedStatus = status?.toUpperCase();
    const isValidStatus = !normalizedStatus || isInviteStatus(normalizedStatus);

    if (!isValidStatus) {
      return { invites: [] };
    }
    const inviteStatus: InviteStatus | undefined =
      normalizedStatus && isInviteStatus(normalizedStatus)
        ? normalizedStatus
        : undefined;

    const invites = await prisma.workspaceInvite.findMany({
      where: {
        email,
        ...(inviteStatus ? { status: inviteStatus } : {}),
      },
      select: {
        id: true,
        role: true,
        status: true,
        createdAt: true,

        workspace: {
          select: {
            name: true,
            id: true,
          },
        },

        invitedBy: {
          select: {
            name: true,
          },
        },
      },
    });

    return { invites };
  } catch {
    return { success: false, message: "error while geting user invites..." };
  }
}
