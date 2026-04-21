// lib/auth/get-current-user.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
 const user = session?.user;
  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}