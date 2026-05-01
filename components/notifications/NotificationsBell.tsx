"use client";

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

const NotificationsBell = ({ userId }: { userId: string }) => {
  const [notifications, setNotifications] = useState<TNotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open , setOpen] = useState(false);

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
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger  asChild>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white transition hover:bg-slate-100 md:h-10 md:w-10">
          <Bell size={20} className="text-slate-600 md:size-5.5" />

          {unreadCount > 0 && (
            <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-semibold leading-none text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="
          w-[calc(100vw-24px)]
          max-w-95
          rounded-2xl
          border border-slate-200
          bg-white
          p-0
          shadow-xl
          sm:w-95
        "
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-900">
            Notifications
          </h3>

          {unreadCount > 0 && (
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
              {unreadCount} unread
            </span>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto sm:max-h-90">
          {loading ? (
            <div className="flex min-h-32 items-center justify-center">
              <SpinnerElement />
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationListItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={fetchUnreadNotif}
                onClose={() => setOpen(false)}
              />
            ))
          ) : (
            <div className="px-4 py-8 text-center text-sm text-slate-500">
              No notifications yet
            </div>
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