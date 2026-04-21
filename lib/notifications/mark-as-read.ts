"use server";

import { prisma } from "../prisma";

export async function markAsReadNotif(noitfi_id: string) {
  await prisma.notification.update({
    where: { id: noitfi_id },
    data: { isRead: true },
  });
}