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
    <div className="surface-panel mt-5 w-full p-6">
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
