"use client";

import {
  FolderDot,
  LayoutDashboard,
  Check,
  LogOut,
  Settings,
  Notebook,
  FilePlus,
  UserRoundPlus,
  Menu,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const sidebar_links = [
  { name: "Dashboard", ref: "/dashboard", icon: <LayoutDashboard size={16} /> },
  { name: "Project", ref: "/project", icon: <FolderDot size={16} /> },
];

const workspaces_links = [
  { name: "Workspaces", ref: "/workspaces", icon: <Notebook size={16} /> },
  {
    name: "Create Workspace",
    ref: "/workspaces/create",
    icon: <FilePlus size={16} />,
  },
  {
    name: "Invitations",
    ref: "/workspaces/invitations",
    icon: <UserRoundPlus size={16} />,
  },
];

type SidebarContentProps = {
  onLinkClick?: () => void;
};

const SidebarContent = ({ onLinkClick }: SidebarContentProps) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  const renderLinks = (
    links: {
      name: string;
      ref: string;
      icon: React.ReactNode;
    }[],
  ) =>
    links.map((link) => {
      const isActive = pathname === link.ref;

      return (
        <Link
          key={link.ref}
          href={link.ref}
          onClick={onLinkClick}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
            isActive
              ? "bg-[#DCE8FF] text-[#175CD3]"
              : "text-[#344054] hover:bg-[#F2F4F7]"
          }`}
        >
          <span className={isActive ? "text-[#175CD3]" : "text-[#667085]"}>
            {link.icon}
          </span>
          <span>{link.name}</span>
        </Link>
      );
    });

  return (
    <>
      <header>
        <Link
          href="/"
          onClick={onLinkClick}
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-400 text-white">
            <Check />
          </div>

          <h1 className="text-[22px] font-semibold text-[#101828]">
            Task<span className="text-blue-500">Flow</span>
          </h1>
        </Link>

        <div className="my-6 h-px bg-[#EAECF0]" />
      </header>

      <div>
        <p className="mb-3 text-md font-semibold text-[#667085]">Channel</p>

        <div className="flex flex-col gap-1.5">
          {renderLinks(sidebar_links)}
        </div>
      </div>

      <div className="my-6 h-px bg-[#EAECF0]" />

      <div>
        <p className="mb-3 text-md font-semibold text-[#667085]">Workspace</p>

        <div className="flex flex-col gap-1.5">
          {renderLinks(workspaces_links)}
        </div>
      </div>

      <div className="my-6 h-px bg-[#EAECF0]" />

      {user && (
        <div>
          <p className="mb-3 text-md font-semibold text-[#667085]">Others</p>

          <div className="flex flex-col gap-1.5">
            <button className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-[#F2F4F7]">
              <Settings size={16} className="text-[#667085]" />
              <span className="text-[#344054]">Settings</span>
            </button>

            <button
              onClick={() => {
                onLinkClick?.();
                signOut({ callbackUrl: "/login" });
              }}
              className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-[#F2F4F7]"
            >
              <LogOut size={16} className="text-[#667085]" />
              <span className="text-[#344054]">Logout</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const SideBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm md:hidden"
      >
        <Menu size={22} />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden min-h-screen w-64 shrink-0 border-r border-[#EAECF0] bg-[#FCFCFD] px-5 py-6 lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          {/* Drawer */}
          <aside className="relative h-full w-72 bg-[#FCFCFD] px-5 py-6 shadow-xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-100"
            >
              <X size={20} />
            </button>

            <SidebarContent onLinkClick={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
};

export default SideBar;
