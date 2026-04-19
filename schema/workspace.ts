import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(4, "At least 3 chr").max(50, "At most 50 chr"),
  description: z
    .string()
    .max(500, "At most 500 chr")
    .optional()
    .or(z.literal("")),
});

export const inviteMembersSchema = z.object({
  email: z
      .string()
      .email("unvalid email")
      .toLowerCase()
      .min(10, "email must be at least 10 chr.")
      .max(50, "email must be at most 50 chr")
      .trim(),
  role: z.enum(["ADMIN", "MEMBER"]),
  message: z
    .string()
    .trim()
    .max(500, "Message is too long.")
    .optional()
    .or(z.literal("")),
})

export type InviteMembersInput = z.infer<typeof inviteMembersSchema>;
export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;