"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceUpdateSchema = exports.invoiceSchema = void 0;
const zod_1 = require("zod");
// Full schema for creating an invoice
exports.invoiceSchema = zod_1.z.object({
    reservationId: zod_1.z.number(),
    clientId: zod_1.z.number(),
    amount: zod_1.z.number(),
    dueDate: zod_1.z.string().datetime(), // or z.coerce.date() if sending ISO strings
});
// Partial schema for updating an invoice
exports.invoiceUpdateSchema = exports.invoiceSchema.partial();
