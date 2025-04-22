import { z } from 'zod';

// Define the Infraction Schema for validation
export const infractionSchema = z.object({
  vehicleId: z.coerce.number().int(), 
  clientId: z.coerce.number().int(), 
  infractionType: z.string().min(1), 
  fineAmount: z.coerce.number().min(0), 
  infractionDate:z.coerce.date(), 
  status: z.enum(['PENDING', 'PAID', 'UNPAID']).default('PENDING'), 
});

// Partial schema for updates (optional fields)
export const infractionUpdateSchema = infractionSchema.partial();
