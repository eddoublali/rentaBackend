import { z } from 'zod';

// Reusable date validation
const dateString = z.string().refine(str => !isNaN(Date.parse(str)), { message: "Invalid date" }).transform(str => new Date(str));
// Define the allowed values for each array
const ALLOWED_ACCESSORIES = [
  "Climatisation", 
  "Gilet", 
  "Triangle", 
  "Roue de secours", 
  "Post radio", 
  "Siege bebe", 
  "Extincteur"
] as const;

const ALLOWED_DOCUMENTS = [
  "Carte grise", 
  "Assurance", 
  "Vignette", 
  "Visite technique", 
  "Autorisation", 
  "Contrat"
] as const;

export const contractSchema = z.object({
  reservationId:  z.coerce.number().int(),
  vehicleId:  z.coerce.number().int(),
  clientId:  z.coerce.number().int(),
  startDate: dateString,
  endDate: dateString,
  deliveryDate: dateString,
  returnDate: dateString,
  totalAmount:  z.coerce.number().min(0),
  dailyPrice:  z.coerce.number().min(0),
  deliveryLocation: z.string().min(1),
  returnLocation: z.string().min(1),
  additionalCharge:  z.coerce.number().min(0).optional(),
  fuelLevel:  z.coerce.number().int().min(0),
  departureKm:  z.coerce.number().int().min(0),
  secondDriver: z.boolean().default(false),
  clientSeconId:  z.coerce.number().int().optional(),
  paymentMethod: z.enum(['CASH', 'TRANSFER', 'CHECK']),
  accessories: z.array(z.enum(ALLOWED_ACCESSORIES))
  .max(7, { message: "Maximum 7 accessories allowed" })
  .optional()
  .default([]),
  documents: z.array(z.enum(ALLOWED_DOCUMENTS))
  .optional()
  .default([]),
  note: z.string()
    .max(10000, { message: "Note too long" })
    .optional()
});

// // For updates, make all fields optional
export const contractUpdateSchema = contractSchema.partial();
