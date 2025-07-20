"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accidentUpdateSchema = exports.accidentSchema = exports.AccidentStatusEnum = exports.FaultTypeEnum = void 0;
const zod_1 = require("zod");
exports.FaultTypeEnum = zod_1.z.enum(["CLIENT", "THIRD_PARTY", "UNKNOWN"]);
exports.AccidentStatusEnum = zod_1.z.enum(["REPORTED", "IN_PROGRESS", "REPAIRED", "CLOSED"]);
exports.accidentSchema = zod_1.z.object({
    vehicleId: zod_1.z.coerce.number().int().positive("Vehicle ID must be a positive integer"),
    clientId: zod_1.z.coerce.number().int().positive("Client ID must be a positive integer").nullable().optional(),
    accidentDate: zod_1.z
        .string()
        .datetime()
        .transform(str => new Date(str)),
    location: zod_1.z.string().min(1, "Location is required"),
    description: zod_1.z.string().optional(),
    repairCost: zod_1.z.coerce.number().nonnegative("Repair cost must be zero or positive").optional(),
    fault: exports.FaultTypeEnum.default("UNKNOWN"),
    // This can be a JSON string of photo paths or an array that will be stringified
    damagePhotos: zod_1.z.union([
        zod_1.z.string(),
        zod_1.z.array(zod_1.z.string())
    ]).optional().nullable(),
    status: exports.AccidentStatusEnum.default("REPORTED"),
});
// For updates, all fields are optional
exports.accidentUpdateSchema = exports.accidentSchema.partial();
