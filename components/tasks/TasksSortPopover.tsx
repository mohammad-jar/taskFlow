import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, Check } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "due_asc", label: "Due Date Up" },
  { value: "due_desc", label: "Due Date Down" },
  { value: "priority_desc", label: "Priority High" },
] as const;

export function TasksSortPopover() {
  const searchparams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const currentSort = searchparams.get("sort") || "";

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchparams.toString());
    params.set("sort", value);
    router.replace(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-11 px-3">
          <ArrowUpDown size={18} />
          Sort
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-3xl border-white/80 bg-white/95 p-2 shadow-xl shadow-blue-100/70 backdrop-blur">
        <DropdownMenuGroup>
          {sortOptions.map((option) => (
            <DropdownMenuItem
              onClick={() => handleSort(option.value)}
              className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
              key={option.value}
            >
              <span>{option.label}</span>
              {currentSort === option.value && (
                <Check className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 p-1 text-white" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
