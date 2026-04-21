import { getCurrentUser } from "../get-current-user";
import { prisma } from "../prisma";

const limit = 10;
export async function getUserNotifications() {
  try {
    const user = await getCurrentUser();

    return prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        workspace: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      
    });
  } catch (error) {
    return { success: false, message: "error while fetching notifications..." };
  }
}

export async function getUnreadNotificationsCount() {
  try {
    const user = await getCurrentUser();

    return prisma.notification.count({
      where: {
        userId: user.id,
        isRead: false,
      },
    });
  } catch (error) {
    return {
      success: false,
      message: "error while fetching unread notifications...",
    };
  }
}
