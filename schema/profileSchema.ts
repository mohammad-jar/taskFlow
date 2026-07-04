import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Display name must be at least 2 characters.")
    .max(60, "Display name must be 60 characters or less."),
});
