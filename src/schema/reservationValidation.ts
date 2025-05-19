import { z } from "zod";

export const reservationSchema = z.object({
  vehicleId: z.coerce.number().int(),
  clientId: z.coerce.number().int(),
  startDate: z
    .string()
    .datetime()
    .transform((str) => new Date(str)),
  endDate: z
    .string()
    .datetime()
    .transform((str) => new Date(str)),
  dailyPrice: z.coerce.number().min(0),
  totalAmount: z.coerce.number().min(0),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELED"]).default("PENDING"),
});


export const reservationUpdateSchema = reservationSchema.partial();
