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
    completedTasks?: number;
  };
}

const TasksStatusChart = ({ tasksCount }: Props) => {
  return (
    <div className="w-full mt-5 md:w-1/2 bg-white rounded-2xl p-6 shadow-md border border-gray-100">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-slate-800">
          Tasks by Status
        </h2>
        <p className="text-sm text-slate-500">
          Overview of task distribution by current status
        </p>
      </div>

      <div className="h-60 w-full">
        <TasksStatusChartClient tasksCount={tasksCount} />
      </div>
    </div>
  );
};

export default TasksStatusChart;
