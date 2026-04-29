"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Check, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { updateTaskStatus } from "@/actions/tasks/updateTaskAcrtion";
import { TaskStatus } from "@/generated/prisma/enums";
import DeleteTaskDialog from "./deleteTaskDialog";
import { EditTaskSheet } from "./edit-task/EditTaskSheet";
import type { Task } from "@/generated/prisma/client";

const statuses = [
  { label: "Pending", value: TaskStatus.PENDING },
  { label: "In Progress", value: TaskStatus.IN_PROGRESS },
  { label: "Completed", value: TaskStatus.COMPLETED },
];

export function TaskActions({ task }: { task: Task }) {
  const [currentStatus, setCurrentStatus] = useState(task.status);

  const handleChangeStatus = async (value: TaskStatus) => {
    const res = await updateTaskStatus(task.id, value);
    if (res.success) {
      setCurrentStatus(value);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
        >
          <MoreVertical size={18} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="mr-4">
        <EditTaskSheet task={task} />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="text-md">
            Change Status
          </DropdownMenuSubTrigger>

          <DropdownMenuSubContent>
            {statuses.map((status) => (
              <DropdownMenuItem
                key={status.value}
                onClick={() => handleChangeStatus(status.value)}
                className="text-md"
              >
                <span className="">{status.label}</span>
                {currentStatus === status.value && (
                  <Check className="h-6 w-6 bg-blue-600 flex items-center justify-center rounded-full  text-white" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DeleteTaskDialog taskId={task.id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
