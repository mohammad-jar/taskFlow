"use server";
import { prisma } from "@/lib/prisma";
import { RegisterInput, registerSchema } from "@/lib/validations/auth";
import bcrypt from "bcryptjs";

type RegisterState = {
  error?: string;
  success?: string;
};

export async function registerUser(
  prevState: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };
  console.log(data);
  
  const parsed = registerSchema.safeParse(data);  
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const {name, email, password} = parsed.data as RegisterInput; 

 const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if(existingUser){
    return {error: 'email is already exisit...'}
  }

  const hashed_password = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashed_password,
    },
  })
  
  return { success: "account created successfully " };
}
