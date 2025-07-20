"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contractUpdateSchema = exports.contractSchema = void 0;
const zod_1 = require("zod");
// Reusable date validation
const dateString = zod_1.z.string().refine(str => !isNaN(Date.parse(str)), { message: "Invalid date" }).transform(str => new Date(str));
// Define the allowed values for each array
const ALLOWED_ACCESSORIES = [
    "Climatisation",
    "Gilet",
    "Triangle",
    "Roue de secours",
    "Post radio",
    "Siege bebe",
    "Extincteur"
];
const ALLOWED_DOCUMENTS = [
    "Carte grise",
    "Assurance",
    "Vignette",
    "Visite technique",
    "Autorisation",
    "Contrat"
];
exports.contractSchema = zod_1.z.object({
    reservationId: zod_1.z.coerce.number().int(),
    vehicleId: zod_1.z.coerce.number().int(),
    clientId: zod_1.z.coerce.number().int(),
    startDate: dateString,
    endDate: dateString,
    deliveryDate: dateString,
    returnDate: dateString,
    totalAmount: zod_1.z.coerce.number().min(0),
    dailyPrice: zod_1.z.coerce.number().min(0),
    deliveryLocation: zod_1.z.string().min(1),
    returnLocation: zod_1.z.string().min(1),
    additionalCharge: zod_1.z.coerce.number().min(0).optional(),
    fuelLevel: zod_1.z.coerce.number().int().min(0),
    departureKm: zod_1.z.coerce.number().int().min(0),
    secondDriver: zod_1.z.boolean().default(false),
    clientSeconId: zod_1.z.coerce.number().int().optional(),
    paymentMethod: zod_1.z.enum(['CASH', 'TRANSFER', 'CHECK']),
    accessories: zod_1.z.array(zod_1.z.enum(ALLOWED_ACCESSORIES))
        .max(7, { message: "Maximum 7 accessories allowed" })
        .optional()
        .default([]),
    documents: zod_1.z.array(zod_1.z.enum(ALLOWED_DOCUMENTS))
        .optional()
        .default([]),
    note: zod_1.z.string()
        .max(10000, { message: "Note too long" })
        .optional()
});
// // For updates, make all fields optional
exports.contractUpdateSchema = exports.contractSchema.partial();
