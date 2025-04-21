import { z } from 'zod';

const validateFile = (file: any) => {
  // If no file is provided, it's undefined, or it's the string "undefined", consider it valid
  if (!file || file === "undefined") return true;
  
  // If it's a string (URL or path), consider it valid (for existing files)
  if (typeof file === 'string') return true;
  
  // If it's a File object, consider it valid (we'll handle file validation in the controller)
  if (file instanceof File || (file && file.name && file.size)) return true;
  
  // If it's neither a string nor a File, it's invalid
  return false;
};
// Vehicle Schema for backend validation
export const vehicleSchema = z.object({
  brand:  z.enum(["TOYOTA","HONDA","FORD","MERCEDES","BMW","AUDI","VOLKSWAGEN", "HYUNDAI","KIA","NISSAN","PEUGEOT",
    "RENAULT",
    "FIAT",
    "VOLVO",
    "MAZDA",
    "JEEP",
    "TESLA",
    "SUZUKI",
    "SKODA",
  ]),
  
  model: z.string().min(6, "Model name must be at least 6 characters"),
  category:z.enum([
    "CITADINE",
    "BERLINE",
    "SUV",
    "UTILITAIRE",
  ]),
  plateNumber: z.string().min(6, "Plate number must be at least 6 characters"),
  chassisNumber: z.string().min(6, "Chassis number must be at least 6 characters"),
  year: z.coerce.number().min(1900, "Year must be 1900 or later").max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  color: z.enum([
    "BLACK", "WHITE", "GREY", "BLUE", "RED",
    "GREEN", "YELLOW", "GOLD",
  ]),
  doors: z.coerce.number().min(0, "Doors must be 0 or more"),
  fuelType: z.enum(['GASOLINE', 'DIESEL', 'ELECTRIC', 'HYBRID'], { message: "Invalid fuel type" }),
  gearbox: z.enum(["MANUAL", "AUTOMATIC"]),
  mileage: z.coerce.number().min(0, "Mileage must be 0 or more"),
  status: z.enum(['AVAILABLE', 'RENTED', 'MAINTENANCE']).default('AVAILABLE'),
  dailyPrice: z.coerce.number().min(0, "Daily price must be 0 or more"),
  image: z.string().optional(),

  // Date fields
  oilChange: z.string().datetime().transform(str => new Date(str)),
  timingBelt: z.string().datetime().transform(str => new Date(str)),
  purchaseDate: z.string().datetime().transform(str => new Date(str)),

  // Financial fields
  purchasePrice: z.coerce.number().min(0, "Purchase price must be 0 or more"),
  advancePayment: z.coerce.number().min(0, "Advance payment must be 0 or more"),
  remainingMonths: z.coerce.number().min(0, "Remaining months must be 0 or more"),
  monthlyPayment: z.coerce.number().min(0, "Monthly payment must be 0 or more"),
  paymentDay: z.coerce.number().min(1, "Payment day must be between 1 and 31").max(31, "Payment day must be between 1 and 31"),

  registrationCard: z.any().refine(validateFile, "Invalid registration card file").optional(),
  insurance: z.any().refine(validateFile, "Invalid insurance file").optional(),
  technicalVisit: z.any().refine(validateFile, "Invalid technical visit file").optional(),
  authorization: z.any().refine(validateFile, "Invalid authorization file").optional(),
  taxSticker: z.any().refine(validateFile, "Invalid tax sticker file").optional(),
});

// Schema for updating a vehicle
export const vehicleUpdateSchema = vehicleSchema.partial();
