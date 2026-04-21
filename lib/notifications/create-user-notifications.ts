import { prisma } from "../prisma";

export async function createNotification({
  userId,
  type,
  title,
  message,
  link,
  senderId,
  workspaceId,
  inviteId,
}: TCreateNotification) {
  return prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      link: link || null,
      senderId: senderId || null,
      workspaceId: workspaceId || null,
      inviteId: inviteId || null,
    },
  });
}