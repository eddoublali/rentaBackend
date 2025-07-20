"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientUpdateSchema = exports.clientSchema = void 0;
const zod_1 = require("zod");
exports.clientSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required'),
    Lastname: zod_1.z.string().min(1, 'Name is required'),
    email: zod_1.z.string().email('Invalid email format'),
    phone: zod_1.z.string().min(1, 'Phone number is required'),
    gender: zod_1.z.enum(['Male', 'Female'], { message: 'Invalid gender' }),
    address: zod_1.z.string().min(1, 'Address is required'),
    cin: zod_1.z.string().min(1, 'CIN is required'),
    cinExpiry: zod_1.z
        .string()
        .datetime()
        .transform(str => new Date(str)),
    license: zod_1.z.string().min(1, 'License is required'),
    licenseExpiry: zod_1.z
        .string()
        .datetime()
        .transform(str => new Date(str)),
    blacklisted: zod_1.z.coerce.boolean().default(false),
    nationality: zod_1.z.enum([
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
    passportNumber: zod_1.z.string().optional(),
    passportExpiry: zod_1.z
        .string()
        .datetime()
        .optional()
        .nullable()
        .transform(str => (str ? new Date(str) : null)),
    birthDate: zod_1.z
        .string()
        .datetime()
        .transform(str => new Date(str))
        .refine(date => date <= new Date(), { message: 'Birth date must be in the past' }),
    cinimage: zod_1.z.string().optional(), // Expect URL after server processing
    licenseimage: zod_1.z.string().optional(), // Expect URL after server processing
    companyName: zod_1.z.string().optional(),
    registrationNumber: zod_1.z.string().optional(),
    clientType: zod_1.z.enum(['PERSONAL', 'ENTERPRISE']).default('PERSONAL'),
});
exports.clientUpdateSchema = exports.clientSchema.partial();
