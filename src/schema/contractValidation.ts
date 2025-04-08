import { z } from 'zod';

// Enum for PaymentStatus
export const paymentStatusEnum = z.enum(['PENDING', 'PAID', 'FAILED']); // Adjust if you have more statuses

// Full schema for creating a contract
export const contractSchema = z.object({
  clientId: z.number(),
  vehicleId: z.number(),
  startDate: z.string().datetime(), // or z.coerce.date() if sending ISO strings
  endDate: z.string().datetime(),
  totalAmount: z.number(),
  paymentStatus: paymentStatusEnum, // optional if you want to use default
});

// Partial schema for updating
export const contractUpdateSchema = contractSchema.partial();
 