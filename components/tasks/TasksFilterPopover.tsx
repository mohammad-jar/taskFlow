import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const priorityOptions = [
  { value: "all", label: "All" },
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
];

const dueOptions = [
  { value: "all", label: "All" },
  { value: "overdue", label: "Overdue" },
  { value: "today", label: "Today" },
  { value: "thisWeek", label: "This Week" },
  { value: "noDueDate", label: "No Due Date" },
] as const;

export function TasksFilterPopover() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPriority = searchParams.get("priority") || "all";
  const currentDue = searchParams.get("due") || "all";

  const [open, setOpen] = useState(false);

  const activeFiltersCount =
    (currentPriority !== "all" ? 1 : 0) + (currentDue !== "all" ? 1 : 0);

  const updateParam = (key: "priority" | "due", value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };
  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("priority");
    params.delete("due");
    router.replace(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-11 px-3"
        >
          <SlidersHorizontal size={18} />
          Filter
          {activeFiltersCount > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-400 px-1.5 text-xs text-white">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 rounded-3xl border-white/80 bg-white/95 p-4 shadow-xl shadow-blue-100/70 backdrop-blur">
        <div className="space-y-2">
          <h4 className="text-lg font-semibold leading-none text-slate-950">
            Filter tasks
          </h4>
          <p className="text-sm text-slate-500">
            Narrow the task list by priority or due date.
          </p>
          <div className="mt-4 h-px bg-slate-200" />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <RadioGroup
            value={currentPriority}
            onValueChange={(value) => updateParam("priority", value)}
          >
            <h4 className="mb-3 text-sm font-semibold leading-none text-slate-800">
              Priority
            </h4>

            {priorityOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2 py-1">
                <RadioGroupItem
                  value={option.value}
                  id={`priority-${option.value}`}
                />
                <Label
                  htmlFor={`priority-${option.value}`}
                  className="cursor-pointer text-sm font-medium text-slate-600"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <RadioGroup
            value={currentDue}
            onValueChange={(value) => updateParam("due", value)}
          >
            <h4 className="mb-3 text-sm font-semibold leading-none text-slate-800">
              Due Date
            </h4>
            {dueOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2 py-1">
                <RadioGroupItem
                  value={option.value}
                  id={`due-${option.value}`}
                />
                <Label
                  htmlFor={`due-${option.value}`}
                  className="cursor-pointer text-sm font-medium text-slate-600"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <Button
          type="button"
          variant="destructive"
          className="mx-auto mt-5 w-1/2 cursor-pointer text-sm"
          onClick={clearFilters}
        >
          Clear filters
        </Button>
      </PopoverContent>
    </Popover>
  );
}
