import { z } from 'zod';

// Reusable date validation
const dateString = z.string().refine(str => !isNaN(Date.parse(str)), { message: "Invalid date" }).transform(str => new Date(str));

export const reservationSchema = z.object({
  vehicleId: z.number().int(),
  clientId: z.number().int(),
  startDate: dateString,
  endDate: dateString,
  totalAmount: z.number().min(0),
  deliveryLocation: z.string().min(1),
  returnLocation: z.string().min(1),
  additionalCharge: z.number().min(0).optional(),
  fuelLevel: z.number().int().min(0),
  departureKm: z.number().int().min(0),
  secondDriver: z.boolean().default(false),
  clientSeconId: z.number().int().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELED']),
  paymentMethod: z.enum(['CASH', 'CREDIT_CARD', 'BANK_TRANSFER']),
  paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED']).default('PENDING'),
  // secondClient: z.number().optional(),
  // Optional: You can add validation for createdAt and updatedAt if needed
});

// For updates, make all fields optional
export const reservationUpdateSchema = reservationSchema.partial();
