"use client";
import { Bell, Search } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;

  const handleNotifications = () => {};

  return (
    <nav className="flex items-center justify-between px-6 py-3  border-b">
      <div className="relative w-80">
        {/* icon */}
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        {/* input */}
        <input
          type="text"
          placeholder="Search..."
          className="w-full h-10 pl-10 pr-3 rounded-xl bg-[#F9FAFB] border border-transparent 
          focus:outline-none focus:border-blue-300  focus:ring-blue-100 
          transition text-sm"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* notifications */}
        <button onClick={handleNotifications}>
          <Bell size={18} className="text-gray-600" />
        </button>

        <div className="h-6 w-px bg-gray-400" />

        {/* user info */}
        <div className="flex items-center gap-2">
          <h1> {user?.name}</h1>
          <img
            src={user?.image || "/vercel.svg"}
            alt=""
            width={30}
            className="rounded-full"
          />
        </div>
      </div>
    </nav>
  );
}
