import { prisma } from "../prisma";
import type { Prisma } from "../../generated/prisma/client";

type TCreateNotification = Pick<
  Prisma.NotificationUncheckedCreateInput,
  | "userId"
  | "type"
  | "title"
  | "message"
  | "link"
  | "senderId"
  | "workspaceId"
  | "inviteId"
  | "taskId"
>;
type DBClient = typeof prisma | Prisma.TransactionClient;

export async function createNotification({
  userId,
  type,
  title,
  message,
  link,
  senderId,
  workspaceId,
  inviteId,
  taskId,
}: TCreateNotification, db: DBClient = prisma,) {
  return db.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      link: link || null,
      senderId: senderId || null,
      workspaceId: workspaceId || null,
      inviteId: inviteId || null,
      taskId: taskId || null,
    },
  });
}
