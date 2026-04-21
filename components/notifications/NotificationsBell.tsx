import Link from "next/link";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationListItem from "./NotificationListItem";
import { useCallback, useEffect, useState } from "react";
import SpinnerElement from "../SpinnerElement";
import { getSocket } from "@/lib/socket-client";

const NotificationsBell = ({ userId }: {userId : string}) => {
  const [notifications, setNotifications] = useState<TNotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadNotif = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/notifications");

      if (!res.ok) {
        throw new Error("Failed to fetch notifications");
      }

      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadNotificationsCount || 0);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnreadNotif();
  }, [fetchUnreadNotif]);

  useEffect(() => {
    if (!userId) return;

    const socket = getSocket();

    socket.connect();
    socket.emit("join-notifications", userId);

    const handleNewNotification = (notification: TNotificationItem) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + (notification.isRead ? 0 : 1));
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
      socket.emit("leave-notifications", userId);
      socket.disconnect();
    };
  }, [userId]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative flex h-10 w-10 items-center justify-center bg-white">
          <Bell size={22} className=" text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[12px] font-semibold text-white">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-95 rounded-2xl border border-slate-200 bg-white p-0 shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-900">
            Notifications
          </h3>
          {/* <MarkAllNotificationsButton /> */}
        </div>

        <div className="max-h-90 overflow-y-auto">
          {loading ? (
            <span className="flex justify-center items-center">
              <SpinnerElement />
            </span>
          ) : (
            <>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <NotificationListItem
                    key={notification.id}
                    notification={notification}
                  />
                ))
              ) : (
                <div className="px-4 py-8 text-center text-sm text-slate-500">
                  No notifications yet
                </div>
              )}
            </>
          )}
        </div>

        <div className="border-t border-slate-100 p-3 text-center">
          <Link
            href="/notifications"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View all notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsBell;
