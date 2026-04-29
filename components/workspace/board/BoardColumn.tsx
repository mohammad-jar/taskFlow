"use client";
import { updateTaskStatus } from "@/actions/tasks/updateTaskAcrtion";
import { TaskStatus } from "@/generated/prisma/enums";

type BoardColumnProps = {
  title: string;
  tasks: TBoardTask[];
};

const priorityStyle = {
  LOW: "bg-green-50 text-green-600",
  MEDIUM: "bg-yellow-50 text-yellow-600",
  HIGH: "bg-red-50 text-red-600",
};

const BoardColumn =  ({ title, tasks }: BoardColumnProps) => {
  // console.log('image is : ', tasks[0].assignee?.image);
  
  const updateStatus = async(taskId : string, newStatus: TaskStatus) => {
     await updateTaskStatus(taskId, newStatus);

  };

  return (
    <div className="flex min-h-125 flex-col rounded-2xl border border-slate-200 bg-slate-50">
      {/* Column Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        </div>

        <span className="rounded-full bg-white px-2 py-0.5 text-sm font-medium text-slate-500">
          {tasks.length}
        </span>
      </div>

      {/* Tasks */}
      <div className="flex flex-1 flex-col gap-3 p-3">
        {tasks.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-sm text-slate-400">
            No tasks
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <h4 className="line-clamp-2 text-sm font-semibold text-slate-800">
                  {task.title}
                </h4>

                {title === 'Todo' ?  <button
                  onClick={()=> updateStatus(task.id, 'IN_PROGRESS')}
                  className="bg-blue-50 text-sm text-blue-400 px-2 py-1 cursor-pointer rounded-md"
                >
                  Start 
                </button> : ''}
                {title === 'In Progress' ?  <button
                  onClick={()=> updateStatus(task.id, 'COMPLETED')}
                  className="bg-red-50 text-sm text-red-400 px-2 py-1 cursor-pointer rounded-md"
                >
                  Finish
                </button> : ''}
              </div>

              {task.description && (
                <div className="flex items-center justify-between mb-2">
                  <p className=" line-clamp-2 text-xs leading-5 text-slate-500">
                    {task.description}
                  </p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      priorityStyle[task.priority]
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  {task.assignee?.image ? (
                    <img
                      src={task.assignee.image}
                      alt={task.assignee.name || "User"}
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

                <span className="text-xs text-slate-400">
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
