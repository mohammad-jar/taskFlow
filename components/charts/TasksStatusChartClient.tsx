"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

interface Props {
  tasksCount: {
    totalTasks?: number;
    pendingTasks?: number;
    inProgressTasks?: number;
    completedTasks?: number;
  };
}

const TasksStatusChartClient = ({ tasksCount }: Props) => {
  const data = [
    { status: "Completed", count: tasksCount.completedTasks ?? 0 },
    { status: "In Progress", count: tasksCount.inProgressTasks ?? 0 },
    { status: "Pending", count: tasksCount.pendingTasks ?? 0 },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid
          vertical={false}
          stroke="#e5e7eb"
          strokeDasharray="4 4"
        />

        <XAxis
          dataKey="status"
          tick={{ fontSize: 12, fill: "#64748b" }}
          axisLine={false}
          tickLine={false}
        />

        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 12, fill: "#64748b" }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip
          cursor={{ fill: "rgba(148, 163, 184, 0.08)" }}
          contentStyle={{
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        />

        <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={60}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry.status === "Completed"
                  ? "#22c55e"
                  : entry.status === "In Progress"
                    ? "#f59e0b"
                    : "#ef4444"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TasksStatusChartClient;
