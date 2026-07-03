"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const WorkspaceToolbar = ({ workspace_id }: { workspace_id: string }) => {
  const pathname = usePathname();
  const lastSegment = pathname.split("/").pop();

  const toolbarLinks = [
    { label: "Overview", href: `/workspaces/${workspace_id}` },
    { label: "Members", href: `/workspaces/${workspace_id}/members` },
    { label: "Tasks", href: `/workspaces/${workspace_id}/tasks` },
    { label: "Board", href: `/workspaces/${workspace_id}/board` },
    { label: "Activity", href: `/workspaces/${workspace_id}/activity` },
  ];

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-1">
      <div className="flex gap-1 overflow-x-auto">
        {toolbarLinks.map((link) => {
          const isActive =
            lastSegment === link.label.toLowerCase() ||
            (link.label === "Overview" && lastSegment === workspace_id);

          return (
            <Link
              href={link.href}
              key={link.label}
              className={`relative shrink-0 rounded-xl px-3 py-2 text-sm font-medium transition ${
                isActive
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:bg-white/70 hover:text-slate-900"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default WorkspaceToolbar;
