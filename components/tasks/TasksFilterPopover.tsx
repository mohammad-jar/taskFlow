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
    setOpen(false)
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-md bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
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
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <h4 className="leading-none text-lg font-medium">Filter tasks</h4>
          <div className="h-px bg-gray-300 mt-4" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <RadioGroup
            value={currentPriority}
            onValueChange={(value) => updateParam("priority", value)}
          >
            <h4 className="leading-none text-lg font-medium">Priority</h4>

            {priorityOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={`priority-${option.value}`}
                />
                <Label
                  htmlFor={`priority-${option.value}`}
                  className="cursor-pointerfont-normal text-lg"
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
            <h4 className="leading-none text-lg font-medium">Due Date</h4>
            {dueOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option.value}
                  id={`due-${option.value}`}
                />
                <Label
                  htmlFor={`due-${option.value}`}
                  className="cursor-pointer text-lg"
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
          className="w-1/2 text-md mx-auto mt-4 cursor-pointer"
          onClick={clearFilters}
        >
          Clear filters
        </Button>
      </PopoverContent>
    </Popover>
  );
}
