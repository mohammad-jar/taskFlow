"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import NotificationsBell from "./notifications/NotificationsBell";
import GlobalSearch from "./navbar/GlobalSearch";
import UserMenu from "./navbar/UserMenu";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <nav className="sticky top-0 z-30 border-b border-white/70 bg-white/85 px-4 py-3 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div className="hidden min-w-44 lg:block">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
            TaskFlow
          </p>
          <p className="mt-0.5 text-sm text-slate-500">
            Search and move fast
          </p>
        </div>

        <GlobalSearch />

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          {user && <NotificationsBell userId={user.id} />}

          <div className="hidden h-8 w-px bg-slate-200 md:block" />

          {user ? (
            <UserMenu user={user} />
          ) : (
            <Link
              href="/login"
              className="rounded-2xl bg-[#DCE8FF] px-3 py-2 text-sm font-semibold text-[#175CD3] transition hover:bg-[#c7dbff] hover:text-[#1149a6]"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
