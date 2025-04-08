import { z } from 'zod';

export const documentSchema = z.object({
  clientId: z.number({
    required_error: 'Client ID is required',
    invalid_type_error: 'Client ID must be a number',
    
  }),
  documentType: z.enum(['CIN', 'PERMIT', 'PASSPORT', 'INSURANCE', 'BUSINESS_LICENSE', 'OTHERS'], {
    required_error: 'Document type is required',
  }),
  image: z.string().url().optional(),
});

// Partial schema for updates
export const documentUpdateSchema = documentSchema.partial();

