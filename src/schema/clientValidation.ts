import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  Lastname: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(1, 'Phone number is required'),
  gender: z.enum(['Male', 'Female'], { message: 'Invalid gender' }),
  address: z.string().min(1, 'Address is required'),
  cin: z.string().min(1, 'CIN is required'),
  cinExpiry: z
    .string()
    .datetime()
    .transform(str => new Date(str)),
  license: z.string().min(1, 'License is required'),
  licenseExpiry: z
    .string()
    .datetime()
    .transform(str => new Date(str)),
  blacklisted: z.coerce.boolean().default(false),
  nationality: z.enum([
    'Moroccan',
    'Algerian',
    'Tunisian',
    'French',
    'Spanish',
    'Italian',
    'German',
    'American',
    'British',
    'Canadian',
  ]).default('Moroccan'),
  passportNumber: z.string().optional(),
  passportExpiry: z
    .string()
    .datetime()
    .optional()
    .nullable()
    .transform(str => (str ? new Date(str) : null)),
  birthDate: z
    .string()
    .datetime()
    .transform(str => new Date(str))
    .refine(date => date <= new Date(), { message: 'Birth date must be in the past' }),
  cinimage: z.string().optional(), // Expect URL after server processing
  licenseimage: z.string().optional(), // Expect URL after server processing
  companyName: z.string().optional(),
  registrationNumber: z.string().optional(),
  clientType: z.enum(['PERSONAL', 'ENTERPRISE']).default('PERSONAL'),
});

export const clientUpdateSchema = clientSchema.partial();