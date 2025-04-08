import { z } from 'zod';

export const vehicleSchema = z.object({
  brand: z.string(),
  model: z.string(),
  category: z.string().optional(),
  plateNumber: z.string(),
  chassisNumber: z.string(),
  year: z.number(),
  color: z.string(),
  doors: z.number(),
  fuelType: z.string(),
  gearbox: z.string(),
  mileage: z.number(),
  status: z.enum(['AVAILABLE', 'RENTED', 'MAINTENANCE']).default('AVAILABLE'),
  type: z.enum(['CAR', 'TRUCK', 'MOTORCYCLE', 'OTHER']).default('CAR'),
  dailyPrice: z.number(),
  image: z.string().optional(),
  // Accept ISO date strings and transform them to Date objects
  oilChange: z.string().datetime().transform(str => new Date(str)).optional(),
  timingBelt: z.string().datetime().transform(str => new Date(str)).optional(),
  purchaseDate: z.string().datetime().transform(str => new Date(str)).optional(),
  purchasePrice: z.number().optional(),
  advancePayment: z.number().optional(),
  remainingMonths: z.number().optional(),
  monthlyPayment: z.number().optional(),
  paymentDay: z.number().optional(),
  registrationCard: z.string().optional(),
  insurance: z.string().optional(),
  technicalVisit: z.string().optional(),
  authorization: z.string().optional(),
  taxSticker: z.string().optional(),
});

export const vehicleUpdateSchema = vehicleSchema.partial(); // All fields are optional for updates
