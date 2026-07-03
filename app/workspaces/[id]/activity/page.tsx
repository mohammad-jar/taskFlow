import { getWorkspaceActivityData } from "@/lib/workspaces/getWorkspaceActivityData";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  CalendarClock,
  ClipboardList,
  MailPlus,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

const activityIcons = {
  task: ClipboardList,
  invite: MailPlus,
  member: UsersRound,
  notification: Bell,
};

const activityStyles = {
  task: "bg-blue-50 text-blue-600",
  invite: "bg-amber-50 text-amber-700",
  member: "bg-emerald-50 text-emerald-700",
  notification: "bg-slate-100 text-slate-700",
};

type WorkspaceActivityPageProps = {
  params: Promise<{ id: string }>;
};

const WorkspaceActivityPage = async ({
  params,
}: WorkspaceActivityPageProps) => {
  const { id } = await params;
  const data = await getWorkspaceActivityData(id);

  if (!data) return null;

  return (
    <section className="space-y-5">
      <div className="rounded-md border border-slate-200 bg-slate-50 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Workspace activity
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              Recent movement in {data.workspace.name}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Track recent task creation, invite changes, member joins, and
              workspace notifications.
            </p>
          </div>

          <span className="inline-flex w-fit items-center gap-2 rounded-md bg-white px-3 py-1 text-sm font-medium text-slate-600 shadow-sm">
            <CalendarClock size={15} />
            Latest 30 events
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <ActivityCount label="Tasks" value={data.counts.tasks} />
          <ActivityCount label="Invites" value={data.counts.invites} />
          <ActivityCount label="Members" value={data.counts.members} />
          <ActivityCount
            label="Notifications"
            value={data.counts.notifications}
          />
        </div>
      </div>

      <div className="rounded-md border border-slate-200 bg-white shadow-sm">
        {data.activity.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {data.activity.map((item) => {
              const Icon = activityIcons[item.type];
              const content = (
                <div className="grid gap-3 p-4 transition hover:bg-slate-50 md:grid-cols-[auto_1fr_auto] md:items-start">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-md ${
                      activityStyles[item.type]
                    }`}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-slate-900">
                        {item.title}
                      </p>
                      {item.badge && (
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>
                    {item.actor && (
                      <p className="mt-2 text-xs text-slate-400">
                        By {item.actor}
                      </p>
                    )}
                  </div>

                  <p className="text-xs font-medium text-slate-400 md:text-right">
                    {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                  </p>
                </div>
              );

              if (item.href) {
                return (
                  <Link href={item.href} key={item.id} className="block">
                    {content}
                  </Link>
                );
              }

              return <div key={item.id}>{content}</div>;
            })}
          </div>
        ) : (
          <div className="flex min-h-72 flex-col items-center justify-center px-4 py-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-100 text-slate-500">
              <CalendarClock size={24} />
            </span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No activity yet
            </h3>
            <p className="mt-1 max-w-md text-sm text-slate-500">
              Task, invite, member, and notification activity will appear here
              once the workspace starts moving.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

const ActivityCount = ({ label, value }: { label: string; value: number }) => {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      <p className="text-2xl font-semibold text-slate-950">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{label}</p>
    </div>
  );
};

export default WorkspaceActivityPage;
