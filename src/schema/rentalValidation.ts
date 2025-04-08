import { z } from 'zod';

export const rentalSchema = z.object({
  vehicleId: z.number(),
  clientId: z.number(),
  startDate: z.coerce.date(), // Accepts ISO strings and converts to Date
  endDate: z.coerce.date(),   // Accepts ISO strings and converts to Date
});

// Partial schema for updates
export const rentalUpdateSchema = rentalSchema.partial();
