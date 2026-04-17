import { getElementClassName } from "@/lib/utils";
import { Search } from "lucide-react";
import Link from "next/link";

const WorkspaceToolbar = ({ workspace_id }: { workspace_id: string }) => {
  const toolbarLinks = [
    { label: "Overview", href: "/" },
    { label: "Members", href: `/workspaces/${workspace_id}` },
    { label: "Projects", href: "/" },
    { label: "Settings", href: "/" },
  ];
  return (
    <div className="bg-gray-100  flex items-center justify-between gap-4 p-2">
      <div className="flex  gap-4">
        {toolbarLinks.map((link) => (
          <Link href={link.href} key={link.label} className="text-slate-400">
            {link.label}
          </Link>
        ))}
      </div>
      <div className="relative w-50 md:w-80 ">
        <Search
          size={14}
          className="absolute left-3 right-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        {/* <input type="text" placeholder="search members" className={`${getElementClassName("input")}`} /> */}
        <input
          type="text"
          placeholder="search members..."
          className="w-full h-10 pl-10 pr-2 rounded-xl bg-white border border-transparent 
          focus:outline-none focus:border-blue-300  focus:ring-blue-100 
          transition text-sm"
        />
      </div>
    </div>
  );
};

export default WorkspaceToolbar;
