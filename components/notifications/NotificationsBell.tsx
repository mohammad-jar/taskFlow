"use client";

import Link from "next/link";
import { Bell, Inbox, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationListItem from "./NotificationListItem";
import { useCallback, useEffect, useState } from "react";
import { getSocket } from "@/lib/socket-client";

const NotificationsBell = ({ userId }: { userId: string }) => {
  const [notifications, setNotifications] = useState<TNotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

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
      console.error(error);
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
      <DropdownMenuTrigger asChild>
        <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white bg-white/80 text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md">
          <Bell size={20} />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-blue-600 px-1 text-[10px] font-bold leading-none text-white shadow-sm">
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
          max-w-100
          overflow-hidden
          rounded-3xl
          border border-slate-200
          bg-white
          p-0
          shadow-2xl
          shadow-slate-200/80
          sm:w-100
        "
      >
        <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-50 to-white px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Inbox
            </p>
            <h3 className="mt-1 text-base font-semibold text-slate-950">
              Notifications
            </h3>
          </div>

          {unreadCount > 0 && (
            <span className="rounded-full bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white">
              {unreadCount} unread
            </span>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto bg-white sm:max-h-90">
          {loading ? (
            <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-sm text-slate-500">
              <Loader2 size={22} className="animate-spin text-blue-600" />
              Loading notifications...
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
            <div className="flex min-h-40 flex-col items-center justify-center px-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                <Inbox size={22} />
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-950">
                No notifications yet
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Updates about invites and tasks will appear here.
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 p-3 text-center">
          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className="inline-flex h-10 w-full items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            View all notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsBell;
