import { z } from 'zod';

export const reservationSchema = z.object({
    vehicleId: z.number().int(),
    clientId: z.number().int(),
    startDate: z.string().refine(str => !isNaN(Date.parse(str)), { message: "Invalid start date" }).transform(str => new Date(str)), // Converts to Date object
    endDate: z.string().refine(str => !isNaN(Date.parse(str)), { message: "Invalid end date" }).transform(str => new Date(str)), // Converts to Date object
    totalAmount: z.number().min(0),
    deliveryLocation: z.string().min(1),
    returnLocation: z.string().min(1),
    additionalCharge: z.number().min(0).optional(),
    fuelLevel: z.number().int().min(0),
    departureKm: z.number().int().min(0),
    secondDriver: z.boolean(),
    status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED']),
    clientSeconId: z.number().int().optional(),
  });
  
// Partial schema for updates (not all fields are required)
export const reservationUpdateSchema = reservationSchema.partial();
