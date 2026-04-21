import {
  getUnreadNotificationsCount,
  getUserNotifications,
} from "@/lib/notifications/get-user-notifications";
import { getCurrentUser } from "@/lib/get-current-user";

export async function GET() {
  const user = await getCurrentUser();

  const notifications = await getUserNotifications();
  const unreadNotificationsCount = await getUnreadNotificationsCount();

  return Response.json({
    notifications,
    unreadNotificationsCount,
  });
}
