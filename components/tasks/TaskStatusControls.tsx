"use client";

import { updateTaskStatus } from "@/actions/tasks/updateTaskAction";
import { TaskStatus } from "@/generated/prisma/enums";
import { useState } from "react";
import toast from "react-hot-toast";

const statusOptions = [
  { label: "Pending", value: TaskStatus.PENDING },
  { label: "In Progress", value: TaskStatus.IN_PROGRESS },
  { label: "Review", value: TaskStatus.REVIEW },
  { label: "Completed", value: TaskStatus.COMPLETED },
];

const statusStyles = {
  PENDING: "border-red-200 bg-red-50 text-red-600",
  IN_PROGRESS: "border-yellow-200 bg-yellow-50 text-yellow-700",
  REVIEW: "border-blue-200 bg-blue-50 text-blue-600",
  COMPLETED: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

type TaskStatusControlsProps = {
  taskId: string;
  currentStatus: TaskStatus;
  disabled?: boolean;
};

const TaskStatusControls = ({
  taskId,
  currentStatus,
  disabled,
}: TaskStatusControlsProps) => {
  const [status, setStatus] = useState(currentStatus);
  const [pendingStatus, setPendingStatus] = useState<TaskStatus | null>(null);

  const handleStatusChange = async (nextStatus: TaskStatus) => {
    if (disabled || nextStatus === status || pendingStatus) return;

    setPendingStatus(nextStatus);
    const result = await updateTaskStatus(taskId, nextStatus);
    setPendingStatus(null);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    setStatus(nextStatus);
    toast.success(result.message);
  };

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {statusOptions.map((option) => {
        const isActive = status === option.value;
        const isPending = pendingStatus === option.value;

        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled || Boolean(pendingStatus)}
            onClick={() => handleStatusChange(option.value)}
            className={`h-9 rounded-md border px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
              isActive
                ? statusStyles[option.value]
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {isPending ? "Updating..." : option.label}
          </button>
        );
      })}
    </div>
  );
};

export default TaskStatusControls;
