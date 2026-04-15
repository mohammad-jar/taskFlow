'use client'
import { CalendarDays, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { TaskActions } from "./TaskActions";
import { PaginationTasks } from "../Pagination";
import {  useSearchParams } from "next/navigation";

type TasksTableProps = {
  tasks: Task[];
  totalPages: number;
};

const statusStyles = {
  PENDING: "bg-red-50 text-red-600",
  IN_PROGRESS: "bg-yellow-50 text-yellow-700",
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
  COMPLETED: "Completed",
};

const priorityLabels = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

const TasksTable = ({ tasks , totalPages}: TasksTableProps) => {
  const searchParams = useSearchParams();
  
  const currentPage= Number(searchParams.get('page'));
  return (
    <div className="overflow-hidden rounded-2xl  bg-white shadow-sm px-4 py-2">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className=" bg-slate-100 ">
            <tr className="text-left text-sm text-slate-500 ">
              <th className="px-6 py-4 font-medium">Task</th>
              <th className="px-6 py-4 font-medium">Priority</th>
              <th className="px-6 py-4 font-medium">Due Date</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-500">
                  No tasks found.
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task.id} className="border-b border-gray-100 hover:bg-slate-50 last:border-b-0">
                  <td className="px-6 py-4 ">
                    <Link href={`/`} className="space-y-1">
                      <p className="font-semibold text-slate-900">{task.title}</p>
                      <p className="text-sm text-slate-500">
                        {task.description || "No description"}
                      </p>
                    </Link>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-md font-medium ${
                        priorityStyles[task.priority]
                      }`}
                    >
                      {priorityLabels[task.priority]}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <CalendarDays size={16} />
                      {task.dueDate ? format(task.dueDate, "MMM dd, yyyy") : "No due date"}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-md font-medium ${
                        statusStyles[task.status]
                      }`}
                    >
                      {statusLabels[task.status]}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    
                      {/* <MoreVertical size={18} /> */}
                      <TaskActions task={task} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t px-6 py-4">
        <p className="text-sm text-slate-500">
          Showing 1 to {tasks.length} tasks
        </p>

        <PaginationTasks totalPages={totalPages} currentPage={currentPage} />

      </div>
    </div>
    
  );
};

export default TasksTable;