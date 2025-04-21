import { z } from 'zod';

// Define the Infraction Schema for validation
export const infractionSchema = z.object({
  vehicleId: z.number().int(), 
  clientId: z.number().int(), 
  infractionType: z.string().min(1), 
  fineAmount: z.number().min(0), 
  infractionDate:z.coerce.date(), 
  status: z.enum(['PENDING', 'PAID', 'UNPAID']).default('PENDING'), 
});

// Partial schema for updates (optional fields)
export const infractionUpdateSchema = infractionSchema.partial();
