"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import EditTaskForm from "./EditTaskForm";
import type { Task } from "@/generated/prisma/client";


export function EditTaskSheet({ task }: {task:Task}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="flex w-full cursor-pointer items-center px-2 py-1.5 text-sm hover:bg-slate-50">
          Edit
        </button>
      </SheetTrigger>

      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader className="">
          <SheetTitle>Edit Task</SheetTitle>
          
        </SheetHeader>

        <EditTaskForm task={task} onClose={() => setOpen(false)} />
        
      </SheetContent>
    </Sheet>
  );
}
