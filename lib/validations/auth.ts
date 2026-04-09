import z from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "name at least 2 chr.")
      .max(40, "at most 40 chr")
      .regex(/^[a-zA-Z\s]+$/, "name  must be contain just a Letters."),
    email: z
      .string()
      .email("unvalid email")
      .toLowerCase()
      .min(10, "email must be at least 10 chr.")
      .max(50, "email must be at most 50 chr")
      .trim(),
    password: z
      .string()
      .min(8, "password must be at least 8 chr")
      .max(100, "password must beat most 100 chr.")
      .regex(/[0-9]/, "password must contain numbers")
      .regex(/[a-z]/, "password must contain small letters")
      .regex(/[A-Z]/, "password must contain capital letters")
      .trim(),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("unvalid email").toLowerCase().trim(),
  password: z.string().min(8, "password must be at least 8 chr").trim(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type TLoginInput = z.infer<typeof loginSchema>;
