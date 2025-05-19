import { z } from 'zod'

export const agencySchema = z.object({
  name: z.string().min(1, "Agency name is required"),
  logo: z.string().optional(), // path to file or URL, adjust if you need file validation
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().default("Morocco"),
  postalCode: z.string().optional(),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email address"),
  website: z.string().url("Invalid URL").optional(),

  // Business identifiers
  rc: z.string().optional(),
  patente: z.string().optional(),
  if: z.string().optional(),
  cnss: z.string().optional(),
  ice: z.string().optional(),

  // Banking information
  bankName: z.string().optional(),
  bankAccount: z.string().optional(),
  rib: z.string().optional(),
  iban: z.string().optional(),
  swift: z.string().optional(),
})
export const agencyUpdateSchema = agencySchema.partial();