"use client";
import { Bell, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();
  const user = session?.user;
  

  const handleNotifications = () => {};

  return (
    <nav className="flex items-center bg-white justify-between  p-3  border-b border-blue-200">
      <div className="relative w-80">
        {/* icon */}
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />

        {/* input */}
        <input
          type="text"
          placeholder="Search tasks, project..."
          className="w-full h-10 pl-10 pr-3 rounded-xl bg-gray-100 border border-transparent 
          focus:outline-none focus:border-blue-300  focus:ring-blue-100 
          transition text-sm"
        />
      </div>

      <div className="flex items-center gap-4">
        {/* notifications */}
        <button onClick={handleNotifications} className="cursor-pointer">
          <Bell size={18} className="text-gray-600" />
        </button>
        <div className="h-6 w-px bg-gray-400" />
        {user ? (
          <div className="flex items-center gap-2">
            <h1 className="font-medium"> {user?.name}</h1>
            <Image
              src={user?.image || "/profile.png"}
              alt=""
              width={30}
              height={30}
              className="rounded-full"
            />
          </div>
        ) : (
          <div>
            <Link
              href="/login"
              className="rounded-lg bg-[#DCE8FF] text-[#175CD3] px-4 py-2 
  transition duration-200 hover:bg-[#c7dbff] hover:text-[#1149a6] hover:-translate-y-0.5"
            >
              sign in
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
