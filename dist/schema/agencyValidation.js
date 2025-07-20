"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agencyUpdateSchema = exports.agencySchema = void 0;
const zod_1 = require("zod");
exports.agencySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Agency name is required"),
    logo: zod_1.z.string().optional(), // path to file or URL, adjust if you need file validation
    address: zod_1.z.string().min(1, "Address is required"),
    city: zod_1.z.string().min(1, "City is required"),
    country: zod_1.z.string().default("Morocco"),
    postalCode: zod_1.z.string().optional(),
    phone: zod_1.z.string().min(1, "Phone is required"),
    email: zod_1.z.string().email("Invalid email address"),
    website: zod_1.z.string().url("Invalid URL").optional(),
    // Business identifiers
    rc: zod_1.z.string().optional(),
    patente: zod_1.z.string().optional(),
    if: zod_1.z.string().optional(),
    cnss: zod_1.z.string().optional(),
    ice: zod_1.z.string().optional(),
    // Banking information
    bankName: zod_1.z.string().optional(),
    bankAccount: zod_1.z.string().optional(),
    rib: zod_1.z.string().optional(),
    iban: zod_1.z.string().optional(),
    swift: zod_1.z.string().optional(),
});
exports.agencyUpdateSchema = exports.agencySchema.partial();
