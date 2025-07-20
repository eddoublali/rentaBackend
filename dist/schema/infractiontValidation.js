"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.infractionUpdateSchema = exports.infractionSchema = void 0;
const zod_1 = require("zod");
// Define the Infraction Schema for validation
exports.infractionSchema = zod_1.z.object({
    vehicleId: zod_1.z.coerce.number().int(),
    clientId: zod_1.z.coerce.number().int(),
    infractionType: zod_1.z.string().min(1),
    fineAmount: zod_1.z.coerce.number().min(0),
    infractionDate: zod_1.z.coerce.date(),
    status: zod_1.z.enum(['PENDING', 'PAID', 'UNPAID']).default('PENDING'),
});
// Partial schema for updates (optional fields)
exports.infractionUpdateSchema = exports.infractionSchema.partial();
