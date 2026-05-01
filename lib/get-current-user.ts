import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";

type CurrentUser = NonNullable<Session["user"]>;

export async function getCurrentUser(): Promise<CurrentUser> {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user) {
    redirect("/login");
  }

  return user;
}
