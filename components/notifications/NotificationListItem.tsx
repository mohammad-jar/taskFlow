"use client";

import { markAsReadNotif } from "@/lib/notifications/mark-as-read";
import { timeAgo } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const NotificationListItem = ({
  notification,
  onMarkAsRead,
  onClose,
}: {
  notification: TNotificationItem;
  onMarkAsRead: () => void;
  onClose: () => void;
}) => {
  const handleMark = async () => {
    await markAsReadNotif(notification.id);
    onMarkAsRead();
    onClose();
  };

  const content = (
    <div
      className={`flex items-start gap-3 px-3 py-3 border-b border-slate-200 transition hover:bg-slate-50 ${
        !notification.isRead ? "bg-blue-50/40" : "bg-white"
      }`}
    >
      {/* Avatar */}
      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-100">
        <Image
          src={notification.sender?.image || "/profile.png"}
          alt="sender"
          width={40}
          height={40}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          {/* Title */}
          <p className="text-sm font-semibold text-slate-900 truncate">
            {notification.title}
          </p>

          {/* unread dot */}
          {!notification.isRead && (
            <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
          )}
        </div>

        {/* Message */}
        <p className="mt-1 text-sm text-slate-600 line-clamp-2 wrap-break-word">
          {notification.message}
        </p>

        {/* Time */}
        <p className="mt-2 text-xs text-slate-400">
          {timeAgo(notification.createdAt)}
        </p>
      </div>
    </div>
  );

  if (notification.link) {
    return (
      <Link href={notification.link} onClick={handleMark} className="block">
        {content}
      </Link>
    );
  }

  return content;
};

export default NotificationListItem;
