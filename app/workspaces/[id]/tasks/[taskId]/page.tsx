import TaskStatusControls from "@/components/tasks/TaskStatusControls";
import { EditTaskSheet } from "@/components/tasks/edit-task/EditTaskSheet";
import { getWorkspaceTaskDetailsData } from "@/lib/workspaces/getWorkspaceTaskDetailsData";
import { format } from "date-fns";
import {
  ArrowLeft,
  CalendarDays,
  ClipboardList,
  Flag,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const statusStyles = {
  PENDING: "bg-red-50 text-red-600",
  IN_PROGRESS: "bg-yellow-50 text-yellow-700",
  REVIEW: "bg-blue-50 text-blue-600",
  COMPLETED: "bg-emerald-50 text-emerald-700",
};

const priorityStyles = {
  LOW: "bg-green-50 text-green-600",
  MEDIUM: "bg-yellow-50 text-yellow-700",
  HIGH: "bg-red-50 text-red-600",
};

type TaskDetailsPageProps = {
  params: Promise<{ id: string; taskId: string }>;
};

const TaskDetailsPage = async ({ params }: TaskDetailsPageProps) => {
  const { id, taskId } = await params;
  const data = await getWorkspaceTaskDetailsData(id, taskId);

  if (!data) {
    notFound();
  }

  const { task, canManageTask } = data;

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Link
          href={`/workspaces/${id}/tasks`}
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to tasks
        </Link>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/workspaces/${id}/board`}
            className="inline-flex h-9 items-center rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Open board
          </Link>
          {canManageTask && <EditTaskSheet task={task} />}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
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
                  {task.priority.toLowerCase()} priority
                </span>
              </div>

              <h2 className="text-2xl font-semibold text-slate-950">
                {task.title}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Created in {task.workspace.name}
              </p>
            </div>

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600">
              <ClipboardList size={22} />
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <h3 className="text-sm font-semibold text-slate-900">
              Description
            </h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {task.description || "No description provided."}
            </p>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Lifecycle
              </h3>
              {!canManageTask && (
                <span className="text-xs text-slate-400">View only</span>
              )}
            </div>
            <TaskStatusControls
              taskId={task.id}
              currentStatus={task.status}
              disabled={!canManageTask}
            />
          </div>
        </div>

        <aside className="space-y-4">
          <DetailPanel title="People">
            <PersonRow
              icon={<UserRound size={17} />}
              label="Created by"
              value={task.createdBy.name || task.createdBy.email || "Unknown"}
            />
            <PersonRow
              icon={<UserRound size={17} />}
              label="Assignee"
              value={task.assignee?.name || task.assignee?.email || "Unassigned"}
            />
          </DetailPanel>

          <DetailPanel title="Dates">
            <PersonRow
              icon={<CalendarDays size={17} />}
              label="Created"
              value={format(task.createdAt, "MMM dd, yyyy")}
            />
            <PersonRow
              icon={<CalendarDays size={17} />}
              label="Updated"
              value={format(task.updatedAt, "MMM dd, yyyy")}
            />
            <PersonRow
              icon={<CalendarDays size={17} />}
              label="Due date"
              value={
                task.dueDate ? format(task.dueDate, "MMM dd, yyyy") : "No due date"
              }
            />
          </DetailPanel>

          <DetailPanel title="Priority">
            <PersonRow
              icon={<Flag size={17} />}
              label="Current priority"
              value={task.priority.toLowerCase()}
            />
          </DetailPanel>
        </aside>
      </div>
    </section>
  );
};

const DetailPanel = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
    <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
    <div className="mt-4 space-y-3">{children}</div>
  </div>
);

const PersonRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3">
    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
      {icon}
    </span>
    <div className="min-w-0">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className="mt-0.5 truncate text-sm font-medium text-slate-700">
        {value}
      </p>
    </div>
  </div>
);

export default TaskDetailsPage;
