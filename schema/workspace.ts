import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(4, "At least 3 chr").max(50, "At most 50 chr"),
  description: z
    .string()
    .max(500, "At most 500 chr")
    .optional()
    .or(z.literal("")),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;