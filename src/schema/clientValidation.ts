import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(1, 'Phone number is required'),
  address: z.string().min(1, 'Address is required'),
  cin: z.string().min(1, 'CIN is required'),
  cinExpiry: z.string().datetime().optional(), // optional field
  license: z.string().min(1, 'License is required'),
  blacklisted: z.boolean().default(false),
  nationality: z.string().min(1, 'Nationality is required'),
  passportNumber: z.string().optional(),
  passportExpiry: z.string().datetime().optional(), // optional field
  birthDate: z.string().datetime().optional(),
  companyName: z.string().optional(),
  registrationNumber: z.string().optional(),
  clientType: z.enum(['PERSONAL', 'ENTERPRISE']).default('PERSONAL'), // default to 'PERSONAL'
});

export const clientUpdateSchema = clientSchema.partial();