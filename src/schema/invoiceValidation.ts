import { z } from 'zod';

// Enum for PaymentStatus 
// Factures
export const paymentStatusEnum = z.enum(['PENDING', 'PAID', 'FAILED']); 

// Full schema for creating an invoice
export const invoiceSchema = z.object({
  reservationId: z.number(),
  clientId: z.number(),
  amount: z.number(),
  dueDate: z.string().datetime(), // or z.coerce.date() if sending ISO strings
  paymentStatus: paymentStatusEnum,
});

// Partial schema for updating an invoice
export const invoiceUpdateSchema = invoiceSchema.partial();
