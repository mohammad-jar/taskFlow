"use client";
import { updateTaskStatus } from "@/actions/tasks/updateTaskAction";
import { TaskStatus } from "@/generated/prisma/enums";
import { CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type BoardColumnProps = {
  title: string;
  tasks: TBoardTask[];
  workspaceId: string;
  actionLabel?: string;
  actionClassName?: string;
  nextStatus?: TaskStatus;
};

const priorityStyle = {
  LOW: "bg-green-50 text-green-600",
  MEDIUM: "bg-yellow-50 text-yellow-600",
  HIGH: "bg-red-50 text-red-600",
};

const columnStyle: Record<string, string> = {
  Todo: "from-rose-50 to-white",
  "In Progress": "from-amber-50 to-white",
  Review: "from-blue-50 to-white",
  Done: "from-emerald-50 to-white",
};

const BoardColumn = ({
  title,
  tasks,
  workspaceId,
  actionLabel,
  actionClassName,
  nextStatus,
}: BoardColumnProps) => {
  const updateStatus = async (taskId: string, newStatus: TaskStatus) => {
    await updateTaskStatus(taskId, newStatus);
  };

  return (
    <div
      className={`flex min-h-125 flex-col rounded-3xl border border-white/80 bg-gradient-to-b ${
        columnStyle[title] ?? "from-slate-50 to-white"
      } shadow-sm`}
    >
      <div className="flex items-center justify-between border-b border-white/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        </div>

        <span className="rounded-full bg-white px-2.5 py-1 text-sm font-semibold text-slate-600 shadow-sm">
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3">
        {tasks.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/80 px-5 text-center text-sm text-slate-400">
            <span className="text-2xl">+</span>
            <span className="mt-1">No tasks in {title.toLowerCase()}</span>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-2xl border border-white bg-white/95 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-100/60"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <Link
                  href={`/workspaces/${workspaceId}/tasks/${task.id}`}
                  className="min-w-0"
                >
                  <h4 className="line-clamp-2 text-sm font-semibold leading-5 text-slate-900 transition hover:text-blue-600">
                    {task.title}
                  </h4>
                </Link>

                {actionLabel && nextStatus && (
                  <button
                    onClick={() => updateStatus(task.id, nextStatus)}
                    className={`cursor-pointer rounded-md px-2 py-1 text-sm transition ${
                      actionClassName ?? "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {actionLabel}
                  </button>
                )}
              </div>

              <div className="mb-3 flex items-start justify-between gap-3">
                {task.description ? (
                  <p className="line-clamp-2 text-xs leading-5 text-slate-500">
                    {task.description}
                  </p>
                ) : (
                  <p className="text-xs leading-5 text-slate-400">
                    No description
                  </p>
                )}
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    priorityStyle[task.priority]
                  }`}
                >
                  {task.priority}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  {task.assignee?.image ? (
                    <Image
                      src={task.assignee.image}
                      alt={task.assignee.name || "User"}
                      width={28}
                      height={28}
                      className="h-7 w-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-xs font-semibold text-blue-500">
                      {task.assignee?.name?.[0] || "U"}
                    </div>
                  )}

                  <span className="text-xs text-slate-500">
                    {task.assignee?.name || "Unassigned"}
                  </span>
                </div>

                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <CalendarDays size={13} />
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "No date"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BoardColumn;
