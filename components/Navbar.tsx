"use client";
import { Bell, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import NotificationsBell from "./notifications/NotificationsBell";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <nav className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
      
      {/* 🔍 Search */}
      <div className="flex items-center gap-2 w-full max-w-xs md:max-w-sm">
        
        {/* Mobile search icon */}
        <button className="md:hidden flex items-center justify-center h-10 w-10 rounded-xl bg-slate-100">
          <Search size={18} className="text-gray-600" />
        </button>

        {/* Desktop input */}
        <div className="relative hidden md:block w-full">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Search tasks, project..."
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-100 border border-transparent 
            focus:outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100 
            transition text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        
        {/* Notifications */}
        {user && <NotificationsBell userId={user.id} />}

        {/* Divider (desktop only) */}
        <div className="hidden md:block h-6 w-px bg-gray-300" />

        {/* User */}
        {user ? (
          <div className="flex items-center gap-2">
            
            {/* name hidden on mobile */}
            <h1 className="hidden sm:block text-sm font-medium text-slate-700">
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
            className="rounded-lg bg-[#DCE8FF] text-[#175CD3] px-3 py-1.5 text-sm
            transition hover:bg-[#c7dbff] hover:text-[#1149a6]"
          >
            Sign in
          </Link>
        )}
      </div>
    </nav>
  );
}
