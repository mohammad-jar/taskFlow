"use client";

import {
  BookOpenCheck,
  FilePlusCorner,
  FolderDot,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebar_links = [
  { name: "Dashboard", ref: "/dashboard", icon: <LayoutDashboard size={16} /> },
  { name: "Project", ref: "/project", icon: <FolderDot size={16} /> },
  { name: "My Tasks", ref: "/my_tasks", icon: <BookOpenCheck size={16} /> },
  { name: "Create Task", ref: "/", icon: <FilePlusCorner size={16} /> },
];

const SideBar = () => {
  const pathname = usePathname();

  return (
    <aside className="min-h-screen rounded-md w-64 bg-[#FCFCFD] border-r border-[#EAECF0] px-5 py-6">
      <header>
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <ListChecks size={18} />
          </div>
          <h1 className="text-[22px] font-semibold text-[#101828]">TaskFlow</h1>
        </Link>

        <div className="my-6 h-px bg-[#EAECF0]" />
      </header>

      <div>
        <p className="mb-3 text-md font-semibold text-[#667085]">Channel</p>

        <div className="flex flex-col gap-1.5">
          {sidebar_links.map((link, i) => {
            const isActive = pathname === link.ref;

            return (
              <Link
                key={i}
                href={link.ref}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#DCE8FF] text-[#175CD3]"
                    : "text-[#344054] hover:bg-[#F2F4F7]"
                }`}
              >
                <span
                  className={isActive ? "text-[#175CD3]" : "text-[#667085]"}
                >
                  {link.icon}
                </span>
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="my-6 h-px bg-[#EAECF0]" />

      <div>
        <p className="mb-3 text-md font-semibold text-[#667085]">Others</p>
        <div className="flex flex-col gap-1.5">
            <button className="flex hover:bg-[#F2F4F7] cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition">
                <Settings size={16} className="text-[#667085]" />
                <span className="text-[#344054]">Settings</span>
            </button>

            <button className="flex hover:bg-[#F2F4F7] cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition">
                <LogOut size={16} className="text-[#667085]" />
                <span className="text-[#344054]">Logout</span>
            </button>
        </div>

      </div>
    </aside>
  );
};

export default SideBar;
