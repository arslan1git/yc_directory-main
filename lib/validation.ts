import { z } from "zod";

export const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  image: z.string().url("Please provide a valid image URL"),
  pitch: z.string().optional()
});