import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(50, "Title is too long."),

  description: z
    .string()
    .trim()
    .max(500, "Description is too long.")
    .optional()
    .or(z.literal("")),

  priority: z.enum(["LOW", "MEDIUM", "HIGH"], {
    error: "Please select a valid priority.",
  }),

  dueDate: z
    .string()
    .trim()
    .min(1, "Due date is required."),
});