import PageHeader from "@/components/page-header";
import {
  getUnreadNotificationsCount,
  getUserNotifications,
} from "@/lib/notifications/get-user-notifications";
import { timeAgo } from "@/lib/utils";
import { Bell, CheckCircle2, Inbox } from "lucide-react";
import Link from "next/link";

const NotificationsPage = async () => {
  const [notificationsResult, unreadResult] = await Promise.all([
    getUserNotifications(),
    getUnreadNotificationsCount(),
  ]);

  const notifications = Array.isArray(notificationsResult)
    ? notificationsResult
    : [];
  const unreadCount = typeof unreadResult === "number" ? unreadResult : 0;

  return (
    <section className="page-shell">
      <PageHeader
        title1="Notifications"
        title2="Notifications"
        desc="Review recent workspace invitations and task updates."
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="interactive-card surface-panel p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Unread</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {unreadCount}
              </p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Bell size={20} />
            </span>
          </div>
        </div>

        <div className="interactive-card surface-panel p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Recent</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {notifications.length}
              </p>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={20} />
            </span>
          </div>
        </div>
      </div>

      <div className="surface-panel overflow-hidden">
        {notifications.length > 0 ? (
          notifications.map((notification) => {
            const content = (
              <div
                className={`flex gap-3 border-b border-slate-100 p-4 transition hover:bg-blue-50/40 last:border-b-0 ${
                  notification.isRead ? "bg-white/70" : "bg-blue-50/60"
                }`}
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-sm font-semibold text-white shadow-sm">
                  {(notification.sender?.name || "TF")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {notification.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {notification.message}
                      </p>
                    </div>

                    {!notification.isRead && (
                      <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span>{timeAgo(notification.createdAt)}</span>
                    {notification.workspace?.name && (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-500">
                        {notification.workspace.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );

            if (notification.link) {
              return (
                <Link
                  key={notification.id}
                  href={notification.link}
                  className="block"
                >
                  {content}
                </Link>
              );
            }

            return <div key={notification.id}>{content}</div>;
          })
        ) : (
          <div className="flex min-h-60 flex-col items-center justify-center px-4 py-10 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
              <Inbox size={24} />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No notifications yet
            </h2>
            <p className="mt-1 max-w-md text-sm text-slate-500">
              Workspace invites and task updates will appear here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default NotificationsPage;
