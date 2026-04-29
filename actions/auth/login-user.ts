"use server";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";
import bcrypt from "bcryptjs";

type TLoginState = {
  error?: string;
  success?: string;
};
export async function loginUser(
  prevState: TLoginState,
  formData: FormData,
): Promise<TLoginState> {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = loginSchema.safeParse(data);
  if (parsed.error) {
    return { error: parsed.error.issues[0].message };
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    return { error: "email not exisit..." };
  }
  if (!user.password) {
    return { error: "This account does not have a password login." };
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return { error: "password not correct" };
  }

  return { success: "login done" };
}
