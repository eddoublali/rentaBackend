"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationUpdateSchema = exports.reservationSchema = void 0;
const zod_1 = require("zod");
exports.reservationSchema = zod_1.z.object({
    vehicleId: zod_1.z.coerce.number().int(),
    clientId: zod_1.z.coerce.number().int(),
    startDate: zod_1.z
        .string()
        .datetime()
        .transform((str) => new Date(str)),
    endDate: zod_1.z
        .string()
        .datetime()
        .transform((str) => new Date(str)),
    dailyPrice: zod_1.z.coerce.number().min(0),
    totalAmount: zod_1.z.coerce.number().min(0),
    status: zod_1.z.enum(["PENDING", "CONFIRMED", "CANCELED"]).default("PENDING"),
});
exports.reservationUpdateSchema = exports.reservationSchema.partial();
