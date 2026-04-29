import {
  getUnreadNotificationsCount,
  getUserNotifications,
} from "@/lib/notifications/get-user-notifications";

export async function GET() {
  const notifications = await getUserNotifications();
  const unreadNotificationsCount = await getUnreadNotificationsCount();

  return Response.json({
    notifications,
    unreadNotificationsCount,
  });
}
