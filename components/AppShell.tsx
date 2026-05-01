"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import SideBar from "@/components/SideBar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) {
    return <main className="min-h-screen bg-blue-50">{children}</main>;
  }

 return (
  <main className="flex h-dvh w-full overflow-hidden bg-blue-50">
    <SideBar />

    <div className="flex min-w-0 flex-1 flex-col">
      <Navbar />

      <div className="min-h-0 flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  </main>
);
}
