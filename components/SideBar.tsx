"use client";

import {
  Check,
  FilePlus,
  LayoutDashboard,
  LogOut,
  Menu,
  Notebook,
  Settings,
  UserRoundPlus,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type SidebarLink = {
  name: string;
  ref: string;
  description: string;
  icon: React.ReactNode;
};

const sidebarLinks: SidebarLink[] = [
  {
    name: "Dashboard",
    ref: "/dashboard",
    description: "Your daily overview",
    icon: <LayoutDashboard size={17} />,
  },
];

const workspaceLinks: SidebarLink[] = [
  {
    name: "Workspaces",
    ref: "/workspaces",
    description: "Teams and projects",
    icon: <Notebook size={17} />,
  },
  {
    name: "Create Workspace",
    ref: "/workspaces/create",
    description: "Start a new space",
    icon: <FilePlus size={17} />,
  },
  {
    name: "Invitations",
    ref: "/workspaces/invitations",
    description: "Pending invites",
    icon: <UserRoundPlus size={17} />,
  },
];

type SidebarContentProps = {
  onLinkClick?: () => void;
};

const SideBar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-2xl border border-white bg-white/90 text-slate-700 shadow-lg shadow-slate-200/70 backdrop-blur transition hover:-translate-y-0.5 hover:text-blue-600 lg:hidden"
        aria-label="Open navigation menu"
      >
        <Menu size={22} />
      </button>

      <aside className="hidden h-dvh w-72 shrink-0 border-r border-white/80 bg-white/78 p-4 shadow-sm shadow-blue-100/40 backdrop-blur-xl lg:block">
        <SidebarContent />
      </aside>

      <div
        className={`fixed inset-0 z-50 transition lg:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        <aside
          className={`relative h-full w-80 max-w-[86vw] bg-white/95 p-4 shadow-2xl shadow-slate-950/20 backdrop-blur-xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-900"
            aria-label="Close navigation menu"
          >
            <X size={20} />
          </button>

          <SidebarContent onLinkClick={() => setOpen(false)} />
        </aside>
      </div>
    </>
  );
};

const SidebarContent = ({ onLinkClick }: SidebarContentProps) => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;
  const displayName = user?.name || "TaskFlow user";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="flex h-full flex-col">
      <header className="mb-5">
        <Link
          href="/dashboard"
          onClick={onLinkClick}
          className="group flex items-center gap-3 rounded-3xl p-2 transition hover:bg-blue-50/70"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-400 text-white shadow-lg shadow-blue-200/70 transition group-hover:-rotate-3 group-hover:scale-105">
            <Check size={24} />
          </div>

          <div>
            <h1 className="text-[23px] font-semibold leading-none tracking-tight text-slate-950">
              Task<span className="text-blue-600">Flow</span>
            </h1>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Workspace command center
            </p>
          </div>
        </Link>
      </header>

      <nav className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
        <NavSection
          title="Command"
          links={sidebarLinks}
          pathname={pathname}
          onLinkClick={onLinkClick}
        />
        <NavSection
          title="Workspace"
          links={workspaceLinks}
          pathname={pathname}
          onLinkClick={onLinkClick}
        />

        {user && (
          <NavSection
            title="Account"
            links={[
              {
                name: "Settings",
                ref: "/settings",
                description: "Profile and avatar",
                icon: <Settings size={17} />,
              },
            ]}
            pathname={pathname}
            onLinkClick={onLinkClick}
          />
        )}
      </nav>

      {user && (
        <footer className="mt-5 rounded-3xl border border-white bg-gradient-to-br from-slate-50 to-blue-50/70 p-3 shadow-sm">
          <Link
            href="/settings"
            onClick={onLinkClick}
            className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-white/80"
          >
            <div className="flex h-11 w-11 shrink-0 overflow-hidden rounded-2xl bg-blue-100 ring-2 ring-white">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={displayName}
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-blue-600">
                  {initials}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-950">
                {displayName}
              </p>
              <p className="truncate text-xs text-slate-500">
                {user.email || "Manage profile"}
              </p>
            </div>
          </Link>

          <button
            onClick={() => {
              onLinkClick?.();
              signOut({ callbackUrl: "/login" });
            }}
            className="mt-2 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-red-600"
          >
            <LogOut size={16} />
            Logout
          </button>
        </footer>
      )}
    </div>
  );
};

const NavSection = ({
  title,
  links,
  pathname,
  onLinkClick,
}: {
  title: string;
  links: SidebarLink[];
  pathname: string;
  onLinkClick?: () => void;
}) => (
  <section>
    <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
      {title}
    </p>

    <div className="space-y-1.5">
      {links.map((link) => (
        <SidebarNavLink
          key={link.ref}
          link={link}
          active={isActivePath(pathname, link.ref)}
          onLinkClick={onLinkClick}
        />
      ))}
    </div>
  </section>
);

const SidebarNavLink = ({
  link,
  active,
  onLinkClick,
}: {
  link: SidebarLink;
  active: boolean;
  onLinkClick?: () => void;
}) => (
  <Link
    href={link.ref}
    onClick={onLinkClick}
    className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl px-3 py-3 text-sm transition duration-200 ${
      active
        ? "bg-blue-600 text-white shadow-lg shadow-blue-200/70"
        : "text-slate-600 hover:-translate-y-0.5 hover:bg-white hover:text-slate-950 hover:shadow-sm"
    }`}
  >
    <span
      className={`absolute inset-y-3 left-0 w-1 rounded-r-full transition ${
        active ? "bg-white" : "bg-transparent group-hover:bg-blue-200"
      }`}
    />

    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition ${
        active
          ? "bg-white/20 text-white"
          : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600"
      }`}
    >
      {link.icon}
    </span>

    <span className="min-w-0">
      <span className="block font-semibold leading-tight">{link.name}</span>
      <span
        className={`mt-0.5 block truncate text-xs ${
          active ? "text-blue-100" : "text-slate-400"
        }`}
      >
        {link.description}
      </span>
    </span>
  </Link>
);

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard" || href === "/settings") {
    return pathname === href;
  }

  if (href === "/workspaces") {
    return pathname === href || /^\/workspaces\/[^/]+$/.test(pathname);
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default SideBar;
