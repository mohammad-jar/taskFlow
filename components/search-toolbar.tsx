"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { TasksFilterPopover } from "./tasks/TasksFilterPopover";
import { TasksSortPopover } from "./tasks/TasksSortPopover";

const SearchToolbar = ({ pageName }: { pageName: string }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchUrlParams = searchParams.get("search") || "";
  const [searchValue, setSearchValue] = useState(searchUrlParams);

  useEffect(() => {
    setSearchValue(searchUrlParams);
  }, [searchUrlParams]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchValue.trim()) {
        params.set("search", searchValue.trim());
      } else {
        params.delete("search");
      }

      const newQuery = params.toString();
      const currentQuery = searchParams.toString();

      if (newQuery === currentQuery) return;

      const url = newQuery ? `${pathname}?${newQuery}` : pathname;
      router.replace(url);
    }, 200);

    return () => clearTimeout(timeout);
  }, [searchValue, pathname, router, searchParams]);

  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search tasks..."
          className="h-11 w-full rounded-md bg-white pl-10 pr-4 text-sm outline-none transition focus:border-blue-500"
        />
      </div>

      {pageName === "tasks" && (
        <div className="flex items-center gap-2">
          <TasksFilterPopover />
          <TasksSortPopover />
        </div>
      )}
    </div>
  );
};

export default SearchToolbar;
