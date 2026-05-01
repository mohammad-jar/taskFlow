"use server";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";
import { RegisterInput, registerSchema } from "@/lib/validations/auth";

type RegisterValues = Pick<RegisterInput, "name" | "email">;

export type RegisterState = {
  error?: string;
  success?: string;
  values: RegisterValues;
};

export async function registerUser(
  prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const values = {
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
  };

  const data = {
    ...values,
    password: String(formData.get("password") || ""),
    confirmPassword: String(formData.get("confirmPassword") || ""),
  };

  const parsed = registerSchema.safeParse(data);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0].message,
      values,
    };
  }
  const { name, email, password } = parsed.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return {
      error: "Email is already registered.",
      values,
    };
  }

  const hashedPassword = await hashPassword(password);
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return {
    success: "Account created successfully.",
    values: {
      name,
      email,
    },
  };
}
