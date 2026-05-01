import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
 const user = session?.user;
  if (!session?.user) {
    redirect("/login");
  }

  return user;
}