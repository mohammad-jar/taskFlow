"use client";

import dynamic from "next/dynamic";

const TasksStatusChartClient = dynamic(
  () => import("./TasksStatusChartClient"),
  {
    ssr: false,
    loading: () => <div className="h-full w-full" />,
  },
);

interface Props {
  tasksCount: {
    totalTasks?: number;
    pendingTasks?: number;
    inProgressTasks?: number;
    reviewTasks?: number;
    completedTasks?: number;
  };
}

const TasksStatusChart = ({ tasksCount }: Props) => {
  return (
    <div className="mt-5 w-full rounded-3xl border border-white/80 bg-white/90 p-6 shadow-sm shadow-blue-100/60">
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">
          Tasks by Status
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Overview of task distribution by current status
        </p>
      </div>

      <div className="h-72 w-full">
        <TasksStatusChartClient tasksCount={tasksCount} />
      </div>
    </div>
  );
};

export default TasksStatusChart;
