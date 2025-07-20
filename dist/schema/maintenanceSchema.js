"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maintenanceUpdateSchema = exports.maintenanceSchema = exports.StatusMaintenanceEnum = exports.MaintenanceTypeEnum = void 0;
const zod_1 = require("zod");
exports.MaintenanceTypeEnum = zod_1.z.enum([
    'OIL_CHANGE',
    'TIMING_CHAIN',
    'WASHING',
    'BRAKE_CHANGE',
    'BATTERY_CHECK',
    'GENERAL_SERVICE',
    'OTHER',
]);
exports.StatusMaintenanceEnum = zod_1.z.enum([
    'PENDING',
    'COMPLETED',
]);
exports.maintenanceSchema = zod_1.z.object({
    vehicleId: zod_1.z.number().int().positive({ message: "Vehicle ID is required" }),
    currentMileage: zod_1.z.number().int().nonnegative().optional(),
    nextOilChange: zod_1.z.number().int().nonnegative().optional(),
    status: exports.StatusMaintenanceEnum,
    amount: zod_1.z.number().positive({ message: "Amount must be a positive number" }),
    maintenance: exports.MaintenanceTypeEnum,
    date: zod_1.z.coerce.date(), // Accepts string or Date
});
// Partial version for updates
exports.maintenanceUpdateSchema = exports.maintenanceSchema.partial();
