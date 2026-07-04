import { getDashboardData } from "@/lib/dashboard/getDashboardData";
import TasksStatusChart from "@/components/charts/TasksStatusChart";
import PageHeader from "@/components/page-header";
import { formatName } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  ClipboardList,
  FileSearch,
  LayoutDashboard,
  Plus,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

const priorityStyles = {
  LOW: "bg-emerald-50 text-emerald-700",
  MEDIUM: "bg-amber-50 text-amber-700",
  HIGH: "bg-red-50 text-red-600",
};

const statusStyles = {
  PENDING: "bg-red-50 text-red-600",
  IN_PROGRESS: "bg-amber-50 text-amber-700",
  REVIEW: "bg-blue-50 text-blue-600",
  COMPLETED: "bg-emerald-50 text-emerald-700",
};

const DashboardPage = async () => {
  const data = await getDashboardData();
  const { stats } = data;
  const userName = data.user.name || "there";

  const chartCounts = {
    totalTasks: stats.totalTasks,
    pendingTasks: stats.pendingTasks,
    inProgressTasks: stats.inProgressTasks,
    reviewTasks: stats.reviewTasks,
    completedTasks: stats.completedTasks,
  };

  return (
    <div className="page-shell">
      <PageHeader
        title1="dashboard overview"
        title2={`Welcome back, ${userName}`}
        desc="A clear snapshot of your workspaces, active tasks, urgent deadlines, and the next actions worth taking."
        right_link="Create Workspace"
        href="/workspaces/create"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <MetricCard
          title="Workspaces"
          value={stats.totalWorkspaces}
          description="Spaces you can access"
          icon={<BriefcaseBusiness size={22} />}
          tone="blue"
        />
        <MetricCard
          title="Total tasks"
          value={stats.totalTasks}
          description="Across your workspaces"
          icon={<ClipboardList size={22} />}
          tone="slate"
        />
        <MetricCard
          title="Assigned to me"
          value={stats.assignedToMeTasks}
          description="Tasks with you as assignee"
          icon={<UserCheck size={22} />}
          tone="blue"
        />
        <MetricCard
          title="Completed"
          value={stats.completedTasks}
          description="Finished and shipped"
          icon={<CheckCircle2 size={22} />}
          tone="emerald"
        />
        <MetricCard
          title="In review"
          value={stats.reviewTasks}
          description="Waiting for final checks"
          icon={<FileSearch size={22} />}
          tone="sky"
        />
        <MetricCard
          title="Overdue"
          value={stats.overdueTasks}
          description="Need attention now"
          icon={<AlertCircle size={22} />}
          tone="red"
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="surface-panel overflow-hidden">
          <SectionHeader
            icon={<Clock3 size={18} />}
            title="Upcoming work"
            description="The nearest active tasks with due dates."
            actionHref={
              data.workspaceSummaries[0]
                ? `/workspaces/${data.workspaceSummaries[0].id}/tasks`
                : "/workspaces"
            }
            actionLabel="View tasks"
          />

          {data.upcomingTasks.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {data.upcomingTasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/workspaces/${task.workspace.id}/tasks/${task.id}`}
                  className="grid gap-3 px-5 py-4 transition hover:bg-blue-50/40 md:grid-cols-[1fr_auto]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950">
                      {task.title}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-600">
                        {task.workspace.name}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 font-semibold ${
                          priorityStyles[task.priority]
                        }`}
                      >
                        {task.priority.toLowerCase()}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 font-semibold ${
                          statusStyles[task.status]
                        }`}
                      >
                        {task.status.replaceAll("_", " ").toLowerCase()}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm text-slate-500 md:text-right">
                    <p className="font-semibold text-slate-800">
                      {task.dueDate
                        ? format(task.dueDate, "MMM dd, yyyy")
                        : "No due date"}
                    </p>
                    <p className="mt-1 text-xs">
                      {task.assignee?.name ||
                        task.assignee?.email ||
                        "Unassigned"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No upcoming due dates"
              description="Active tasks with future due dates will appear here."
            />
          )}
        </section>

        <section className="surface-panel overflow-hidden">
          <SectionHeader
            icon={<Bell size={18} />}
            title="Latest updates"
            description="Recent notifications and task movement."
            actionHref="/notifications"
            actionLabel="Open notifications"
          />

          {data.updates.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {data.updates.map((update) => {
                const content = (
                  <div className="flex gap-3 px-5 py-4 transition hover:bg-blue-50/40">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      {update.type === "notification" ? (
                        <Bell size={17} />
                      ) : (
                        <ClipboardList size={17} />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="line-clamp-1 text-sm font-semibold text-slate-950">
                          {update.title}
                        </p>
                        <span className="shrink-0 text-xs font-medium text-slate-400">
                          {formatDistanceToNow(update.createdAt, {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">
                        {update.description}
                      </p>
                      {update.badge && (
                        <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                          {update.badge}
                        </span>
                      )}
                    </div>
                  </div>
                );

                if (update.href) {
                  return (
                    <Link href={update.href} key={update.id} className="block">
                      {content}
                    </Link>
                  );
                }

                return <div key={update.id}>{content}</div>;
              })}
            </div>
          ) : (
            <EmptyState
              title="No recent updates"
              description="Workspace notifications and task movement will show up here."
            />
          )}
        </section>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="surface-panel overflow-hidden">
          <SectionHeader
            icon={<LayoutDashboard size={18} />}
            title="Workspace summaries"
            description="A quick read on the spaces moving most recently."
            actionHref="/workspaces"
            actionLabel="All workspaces"
          />

          {data.workspaceSummaries.length > 0 ? (
            <div className="grid gap-3 p-5 sm:grid-cols-2">
              {data.workspaceSummaries.map((workspace) => {
                const completedPercent =
                  workspace.total > 0
                    ? Math.round((workspace.completed / workspace.total) * 100)
                    : 0;

                return (
                  <Link
                    key={workspace.id}
                    href={`/workspaces/${workspace.id}`}
                    className="interactive-card rounded-3xl border border-slate-100 bg-white/80 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-sm font-semibold text-white shadow-sm shadow-blue-200">
                          {formatName(workspace.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-950">
                            {workspace.name}
                          </p>
                          <p className="mt-1 text-xs capitalize text-slate-500">
                            {workspace.role.toLowerCase()} -{" "}
                            {workspace.membersCount} member
                            {workspace.membersCount === 1 ? "" : "s"}
                          </p>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-slate-400" />
                    </div>

                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
                        <span>Completion</span>
                        <span>{completedPercent}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${completedPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                      <MiniStat label="Tasks" value={workspace.total} />
                      <MiniStat label="Review" value={workspace.review} />
                      <MiniStat label="Overdue" value={workspace.overdueTasks} />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No workspaces yet"
              description="Create your first workspace to start tracking tasks and team movement."
              href="/workspaces/create"
              actionLabel="Create workspace"
            />
          )}
        </section>

        <div>
          <TasksStatusChart tasksCount={chartCounts} />
        </div>
      </div>

      <section className="surface-panel mt-5 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
              Quick actions
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
              Keep momentum without hunting through menus
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/workspaces/create" className="primary-action">
              <Plus size={16} />
              New workspace
            </Link>
            <Link href="/workspaces" className="secondary-action">
              View workspaces
            </Link>
            {data.workspaceSummaries[0] && (
              <Link
                href={`/workspaces/${data.workspaceSummaries[0].id}/create_task`}
                className="secondary-action"
              >
                Create task
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

function MetricCard({
  title,
  value,
  description,
  icon,
  tone,
}: {
  title: string;
  value: number;
  description: string;
  icon: ReactNode;
  tone: "blue" | "slate" | "emerald" | "sky" | "red";
}) {
  const toneClasses = {
    blue: "bg-blue-50 text-blue-600",
    slate: "bg-slate-100 text-slate-700",
    emerald: "bg-emerald-50 text-emerald-700",
    sky: "bg-sky-50 text-sky-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="interactive-card surface-panel group relative overflow-hidden p-5">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-100/50 transition group-hover:scale-125" />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            {value}
          </p>
        </div>
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${toneClasses[tone]}`}
        >
          {icon}
        </span>
      </div>
      <p className="relative mt-4 text-sm leading-5 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  description,
  actionHref,
  actionLabel,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          {icon}
        </span>
        <div>
          <h2 className="text-base font-semibold text-slate-950">{title}</h2>
          <p className="mt-1 text-sm leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>
      <Link
        href={actionHref}
        className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
      >
        {actionLabel}
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-3 py-2">
      <p className="text-sm font-semibold text-slate-950">{value}</p>
      <p className="mt-0.5 text-[11px] font-medium text-slate-500">{label}</p>
    </div>
  );
}

function EmptyState({
  title,
  description,
  href,
  actionLabel,
}: {
  title: string;
  description: string;
  href?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center px-5 py-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-3xl bg-blue-50 text-blue-600">
        <ClipboardList size={22} />
      </span>
      <h3 className="mt-4 text-base font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {description}
      </p>
      {href && actionLabel && (
        <Link href={href} className="primary-action mt-4">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export default DashboardPage;
