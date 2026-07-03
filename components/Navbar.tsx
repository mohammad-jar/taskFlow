"use client";

import { Search } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import NotificationsBell from "./notifications/NotificationsBell";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <nav className="sticky top-0 z-30 flex items-center justify-between border-b border-white/70 bg-white/85 px-4 py-3 backdrop-blur">
      <div className="flex w-full max-w-xs items-center gap-2 md:max-w-sm">
        <div className="relative hidden w-full lg:block">
          <Search
            size={16}
            display="none"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Search tasks..."
            className="h-10 w-full rounded-2xl border border-transparent bg-slate-100 pl-9 pr-3 text-sm transition focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {user && <NotificationsBell userId={user.id} />}

        <div className="hidden h-6 w-px bg-slate-200 md:block" />

        {user ? (
          <div className="flex items-center gap-2">
            <h1 className="hidden text-sm font-medium text-slate-700 sm:block">
              {user.name}
            </h1>

            <Image
              src={user.image || "/profile.png"}
              alt="user"
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded-lg bg-[#DCE8FF] px-3 py-1.5 text-sm text-[#175CD3] transition hover:bg-[#c7dbff] hover:text-[#1149a6]"
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}
