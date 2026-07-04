"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, LogOut, Settings, UserRound } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

type UserMenuProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

const UserMenu = ({ user }: UserMenuProps) => {
  const displayName = user.name || "Profile";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group flex items-center gap-2 rounded-2xl border border-white bg-white/80 p-1.5 pr-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <span className="relative flex h-9 w-9 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-100 to-slate-100 ring-2 ring-white">
            {user.image ? (
              <Image
                src={user.image}
                alt={displayName}
                width={36}
                height={36}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-blue-600">
                {initials}
              </span>
            )}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block max-w-34 truncate text-sm font-semibold text-slate-900">
              {displayName}
            </span>
            <span className="block max-w-34 truncate text-xs text-slate-500">
              {user.email || "TaskFlow user"}
            </span>
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-72 rounded-3xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-200/80"
      >
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="flex h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-blue-50">
            {user.image ? (
              <Image
                src={user.image}
                alt={displayName}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-blue-600">
                {initials}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-950">
              {displayName}
            </p>
            <p className="truncate text-xs text-slate-500">
              {user.email || "No email on file"}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator className="my-2 bg-slate-100" />

        <DropdownMenuItem asChild className="rounded-2xl px-3 py-2.5">
          <Link href="/settings" className="flex items-center gap-3">
            <UserRound size={16} className="text-blue-600" />
            Profile settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-2xl px-3 py-2.5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <LayoutDashboard size={16} className="text-emerald-600" />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-2xl px-3 py-2.5">
          <Link href="/settings" className="flex items-center gap-3">
            <Settings size={16} className="text-slate-500" />
            Account settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-2 bg-slate-100" />

        <DropdownMenuItem
          className="rounded-2xl px-3 py-2.5 text-red-600 focus:bg-red-50 focus:text-red-700"
          onSelect={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut size={16} />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
