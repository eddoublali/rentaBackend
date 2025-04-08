import { z } from 'zod';

export const paymentSchema = z.object({
  reservationId: z.number().int(),
  amount: z.number().min(0),
  paymentMethod: z.enum(['CASH', 'CREDIT_CARD', 'BANK_TRANSFER']),
  status: z.enum(['PENDING', 'PAID', 'FAILED']).optional(), // default is PENDING
});

// Partial schema for updates
export const paymentUpdateSchema = paymentSchema.partial();

