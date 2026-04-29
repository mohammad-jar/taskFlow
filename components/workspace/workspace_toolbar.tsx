'use client'
import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const WorkspaceToolbar = ({ workspace_id }: { workspace_id: string }) => {
  const pathname = usePathname();
const lastSegment = pathname.split("/").pop();

  const toolbarLinks = [
    { label: "Overview", href: "/" },
    { label: "Members", href: `/workspaces/${workspace_id}/members` },
    { label: "Tasks", href: `/workspaces/${workspace_id}/tasks` },
    { label: "Board", href: `/workspaces/${workspace_id}/board` },
    { label: "Activity", href: `/workspaces/${workspace_id}/activity`},
    { label: "Settings", href: "/" },
  ];

  return (
    <div className="flex items-center justify-between gap-4 border-b p-2">
  <div className="flex gap-6">
    {toolbarLinks.map((link) => {
      const isActive =
        lastSegment === link.label.toLowerCase() ||
        (link.label === "Overview" && lastSegment === workspace_id);

      return (
        <Link
          href={link.href}
          key={link.label}
          className={`relative  text-sm font-medium ${
            isActive ? "text-blue-500" : "text-slate-600"
          }`}
        >
          {link.label}

          {/* الخط السفلي */}
          {isActive && (
            <span className="absolute left-0 -bottom-2 h-0.5 w-full bg-blue-500"></span>
          )}
        </Link>
      );
    })}
  </div>

  {/* <div className="relative w-50 md:w-80">
    <Search
      size={14}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
    />
    <input
      type="text"
      placeholder="search members..."
      className="w-full h-10 pl-10 pr-2 rounded-xl bg-slate-100 border border-transparent 
      focus:outline-none focus:border-blue-300 focus:ring-blue-100 
      transition text-sm"
    />
  </div> */}
</div>
  );
};

export default WorkspaceToolbar;
