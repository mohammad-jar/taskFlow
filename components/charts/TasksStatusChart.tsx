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

const data = [
  { status: "Completed", count: 8 },
  { status: "In Progress", count: 6 },
  { status: "Pending", count: 10 },
];

const TasksStatusChart = () => {
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
      </div>
    </div>
  );
};

export default TasksStatusChart;
