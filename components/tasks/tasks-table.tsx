"use client";

import { CalendarDays, ClipboardList } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { TaskActions } from "./TaskActions";
import { PaginationTasks } from "../Pagination";
import { useSearchParams } from "next/navigation";
import type { Task } from "@/generated/prisma/client";

type TasksTableProps = {
  tasks: Task[];
  totalPages: number;
  workspaceId: string;
};

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

const statusLabels = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  REVIEW: "Review",
  COMPLETED: "Completed",
};

const priorityLabels = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const TasksTable = ({ tasks, totalPages, workspaceId }: TasksTableProps) => {
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);

  return (
    <div className="surface-panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50/90">
            <tr className="text-left text-xs uppercase tracking-[0.16em] text-slate-400">
              <th className="min-w-72 px-6 py-4 font-semibold">Task</th>
              <th className="px-6 py-4 font-semibold">Priority</th>
              <th className="px-6 py-4 font-semibold">Due Date</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16">
                  <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-10 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                      <ClipboardList size={22} />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-slate-950">
                      No tasks match this view
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Try changing the search or filters. When tasks are
                      created, they will appear here with status and due date
                      context.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-b border-slate-100 transition-colors hover:bg-blue-50/40 last:border-b-0"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/workspaces/${workspaceId}/tasks/${task.id}`}
                      className="block max-w-xl space-y-1"
                    >
                      <p className="font-semibold text-slate-950 transition hover:text-blue-600">
                        {task.title}
                      </p>
                      <p className="line-clamp-2 text-sm leading-5 text-slate-500">
                        {task.description || "No description"}
                      </p>
                    </Link>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`status-pill ${
                        priorityStyles[task.priority]
                      }`}
                    >
                      {priorityLabels[task.priority]}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CalendarDays size={16} />
                      {task.dueDate
                        ? format(task.dueDate, "MMM dd, yyyy")
                        : "No due date"}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`status-pill ${
                        statusStyles[task.status]
                      }`}
                    >
                      {statusLabels[task.status]}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <TaskActions task={task} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Showing {tasks.length} task{tasks.length === 1 ? "" : "s"}
        </p>

        <PaginationTasks
          workspaceId={workspaceId}
          totalPages={totalPages}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};

export default TasksTable;
