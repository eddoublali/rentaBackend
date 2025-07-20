"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expenseUpdateSchema = exports.expenseSchema = void 0;
const zod_1 = require("zod");
exports.expenseSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    amount: zod_1.z.number().positive("Amount must be a positive number"),
    category: zod_1.z.string().min(1, "Category is required"),
    date: zod_1.z.coerce.date(), // Accepts string or Date
    notes: zod_1.z.string().optional(),
});
// Partial schema for updates
exports.expenseUpdateSchema = exports.expenseSchema.partial();
