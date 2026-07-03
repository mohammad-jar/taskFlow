import { getWorkspaceOverviewData } from "@/lib/workspaces/getWorkspaceOverviewData";
import { format } from "date-fns";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileSearch,
  FolderKanban,
  ListTodo,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

const statusStyles = {
  PENDING: "bg-red-50 text-red-600",
  IN_PROGRESS: "bg-yellow-50 text-yellow-700",
  REVIEW: "bg-blue-50 text-blue-600",
  COMPLETED: "bg-green-50 text-green-600",
};

const priorityStyles = {
  LOW: "bg-green-50 text-green-600",
  MEDIUM: "bg-yellow-50 text-yellow-700",
  HIGH: "bg-red-50 text-red-600",
};

const workspaceStatCards = [
  {
    key: "totalTasks",
    label: "Total tasks",
    icon: ClipboardList,
    className: "bg-slate-100 text-slate-700",
  },
  {
    key: "inProgressTasks",
    label: "In progress",
    icon: Clock3,
    className: "bg-yellow-50 text-yellow-700",
  },
  {
    key: "reviewTasks",
    label: "Review",
    icon: FileSearch,
    className: "bg-blue-50 text-blue-600",
  },
  {
    key: "completedTasks",
    label: "Completed",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700",
  },
  {
    key: "overdueTasks",
    label: "Overdue",
    icon: AlertCircle,
    className: "bg-red-50 text-red-600",
  },
] as const;

type WorkspaceDetailsPageProps = {
  params: Promise<{ id: string }>;
};

const WorkspaceDetailsPage = async ({ params }: WorkspaceDetailsPageProps) => {
  const { id } = await params;
  const data = await getWorkspaceOverviewData(id);

  if (!data) return null;

  const canManageTasks =
    data.currentUserRole === "OWNER" || data.currentUserRole === "ADMIN";

  return (
    <section className="space-y-5">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="overflow-hidden rounded-3xl border border-white/80 bg-gradient-to-br from-blue-50 via-white to-slate-50 p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">
                Workspace overview
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                {data.workspace.name}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                {data.workspace.description ||
                  "Track workspace progress, recent task movement, and team activity from one place."}
              </p>
            </div>

            <span className="inline-flex w-fit rounded-full bg-white px-3 py-1 text-sm font-medium text-slate-600 shadow-sm">
              {data.currentUserRole.toLowerCase()}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-5">
            {workspaceStatCards.map((item) => {
              const Icon = item.icon;
              const value = data.stats[item.key];

              return (
                <div
                  key={item.key}
                  className="rounded-2xl border border-white bg-white/90 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div
                    className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${item.className}`}
                  >
                    <Icon size={18} />
                  </div>
                  <p className="text-2xl font-semibold text-slate-950">
                    {value}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl border border-white/80 bg-white/90 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-900">
            Quick actions
          </h3>
          <div className="mt-4 grid gap-2">
            {canManageTasks && (
              <Link
                href={`/workspaces/${id}/create_task`}
                className="flex items-center justify-between rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:-translate-y-0.5 hover:bg-blue-100"
              >
                Create task
                <ArrowRight size={16} />
              </Link>
            )}
            <Link
              href={`/workspaces/${id}/tasks`}
              className="flex items-center justify-between rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
            >
              View tasks
              <ArrowRight size={16} />
            </Link>
            <Link
              href={`/workspaces/${id}/board`}
              className="flex items-center justify-between rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
            >
              Open board
              <ArrowRight size={16} />
            </Link>
            <Link
              href={`/workspaces/${id}/members`}
              className="flex items-center justify-between rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
            >
              View members
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
            <div>
              <p className="text-xl font-semibold text-slate-950">
                {data.stats.membersCount}
              </p>
              <p className="text-xs text-slate-500">Members</p>
            </div>
            <div>
              <p className="text-xl font-semibold text-slate-950">
                {data.stats.pendingInvites}
              </p>
              <p className="text-xs text-slate-500">Pending invites</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/90 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <ListTodo size={18} className="text-blue-600" />
              <h3 className="text-sm font-semibold text-slate-900">
                Recent tasks
              </h3>
            </div>
            <Link
              href={`/workspaces/${id}/tasks`}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View all
            </Link>
          </div>

          <div>
            {data.recentTasks.length > 0 ? (
              data.recentTasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/workspaces/${id}/tasks/${task.id}`}
                  className="grid gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 md:grid-cols-[1fr_auto]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {task.title}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                          statusStyles[task.status]
                        }`}
                      >
                        {task.status.replaceAll("_", " ").toLowerCase()}
                      </span>
                      <span
                        className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                          priorityStyles[task.priority]
                        }`}
                      >
                        {task.priority.toLowerCase()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-slate-500 md:justify-end">
                    <span>{task.assignee?.name || "Unassigned"}</span>
                    <span>
                      {task.dueDate
                        ? format(task.dueDate, "MMM dd")
                        : "No due date"}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex min-h-48 flex-col items-center justify-center px-4 py-10 text-center">
                <FolderKanban size={28} className="text-slate-400" />
                <p className="mt-3 text-sm font-medium text-slate-900">
                  No tasks yet
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  New workspace tasks will appear here.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/90 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
            <UsersRound size={18} className="text-blue-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              Recent members
            </h3>
          </div>

          <div>
            {data.recentMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {member.user.name || member.user.email}
                  </p>
                  <p className="mt-1 truncate text-xs text-slate-500">
                    Joined {format(member.joinedAt, "MMM dd, yyyy")}
                  </p>
                </div>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {member.role.toLowerCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkspaceDetailsPage;
