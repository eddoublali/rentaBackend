import { z } from 'zod';

export const expenseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  amount: z.number().positive("Amount must be a positive number"),
  category: z.string().min(1, "Category is required"),
  date: z.coerce.date(), // Accepts string or Date
  notes: z.string().optional(),
});

// Partial schema for updates
export const expenseUpdateSchema = expenseSchema.partial();
