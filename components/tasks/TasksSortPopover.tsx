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
  { value: "due_asc", label: "Due Date ↑" },
  { value: "due_desc", label: "Due Date ↓" },
  { value: "priority_desc", label: "Priority High ↓" },
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
        <Button
          variant="outline"
          className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-md bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          <ArrowUpDown size={18} />
          Sort
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {sortOptions.map((option) => (
            <DropdownMenuItem
              onClick={() => handleSort(option.value)}
              className="flex cursor-pointer items-center gap-4"
              key={option.value}
            >
              <span>{option.label}</span>
              {currentSort === option.value && <Check className="h-6 w-6 bg-blue-600 flex items-center justify-center rounded-full  text-white" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
