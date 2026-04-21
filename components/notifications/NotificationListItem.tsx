import { markAsReadNotif } from "@/lib/notifications/mark-as-read";
import { timeAgo } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const NotificationListItem = ({ notification }: { notification : TNotificationItem}) => {

  const handleMark = async() => {
    const res = await markAsReadNotif(notification.id)
  }
  const content = (
    <div
      className={`flex items-start gap-3 px-1 py-3 border border-b-amber-100 transition hover:bg-slate-50 ${
        !notification.isRead ? "bg-blue-50/40" : "bg-white"
      }`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold text-slate-700">
        {/* {notification.workspace?.name?.slice(0, 2).toUpperCase() || "NT"} */}
        <Image src={notification.sender?.image || '/profile.png'} alt="sender_ph" width={0} height={0} className="object-cover w-full rounded-full" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-slate-900">
            {notification.title}
          </p>

          {!notification.isRead && (
            <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
          )}
        </div>

        <p className="mt-1 text-sm text-slate-600 line-clamp-2">
          {notification.message}
        </p>

        <p className="mt-2 text-xs text-slate-400">
          {timeAgo(notification.createdAt)}
        </p>
      </div>
    </div>
  );

  if (notification.link) {
    return <Link href={notification.link} onClick={handleMark}>{content}</Link>;
  }

  return content;
};

export default NotificationListItem;
