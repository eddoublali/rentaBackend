"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleUpdateSchema = exports.vehicleSchema = void 0;
const zod_1 = require("zod");
const validateFile = (file) => {
    // If no file is provided, it's undefined, or it's the string "undefined", consider it valid
    if (!file || file === "undefined")
        return true;
    // If it's a string (URL or path), consider it valid (for existing files)
    if (typeof file === 'string')
        return true;
    // If it's a File object, consider it valid (we'll handle file validation in the controller)
    if (file instanceof File || (file && file.name && file.size))
        return true;
    // If it's neither a string nor a File, it's invalid
    return false;
};
// Vehicle Schema for backend validation
exports.vehicleSchema = zod_1.z.object({
    brand: zod_1.z.enum(["TOYOTA", "HONDA", "FORD", "MERCEDES", "BMW", "AUDI", "VOLKSWAGEN", "HYUNDAI", "KIA", "NISSAN", "PEUGEOT",
        "RENAULT",
        "FIAT",
        "VOLVO",
        "MAZDA",
        "JEEP",
        "TESLA",
        "SUZUKI",
        "SKODA",
    ]),
    model: zod_1.z.string().min(6, "Model name must be at least 6 characters"),
    category: zod_1.z.enum([
        "CITADINE",
        "BERLINE",
        "SUV",
        "UTILITAIRE",
    ]),
    plateNumber: zod_1.z.string().min(6, "Plate number must be at least 6 characters"),
    chassisNumber: zod_1.z.string().min(6, "Chassis number must be at least 6 characters"),
    year: zod_1.z.coerce.number().min(1900, "Year must be 1900 or later").max(new Date().getFullYear() + 1, "Year cannot be in the future"),
    color: zod_1.z.enum([
        "BLACK", "WHITE", "GREY", "BLUE", "RED",
        "GREEN", "YELLOW", "GOLD",
    ]),
    doors: zod_1.z.coerce.number().min(0, "Doors must be 0 or more"),
    fuelType: zod_1.z.enum(['GASOLINE', 'DIESEL', 'ELECTRIC', 'HYBRID'], { message: "Invalid fuel type" }),
    gearbox: zod_1.z.enum(["MANUAL", "AUTOMATIC"]),
    mileage: zod_1.z.coerce.number().min(0, "Mileage must be 0 or more"),
    status: zod_1.z.enum(['AVAILABLE', 'RENTED', 'MAINTENANCE']).default('AVAILABLE'),
    dailyPrice: zod_1.z.coerce.number().min(0, "Daily price must be 0 or more"),
    image: zod_1.z.string().optional(),
    // Date fields
    oilChange: zod_1.z.string().datetime().transform(str => new Date(str)),
    timingBelt: zod_1.z.string().datetime().transform(str => new Date(str)),
    purchaseDate: zod_1.z.string().datetime().transform(str => new Date(str)),
    // Financial fields
    purchasePrice: zod_1.z.coerce.number().min(0, "Purchase price must be 0 or more"),
    advancePayment: zod_1.z.coerce.number().min(0, "Advance payment must be 0 or more"),
    remainingMonths: zod_1.z.coerce.number().min(0, "Remaining months must be 0 or more"),
    monthlyPayment: zod_1.z.coerce.number().min(0, "Monthly payment must be 0 or more"),
    paymentDay: zod_1.z.coerce.number().min(1, "Payment day must be between 1 and 31").max(31, "Payment day must be between 1 and 31"),
    registrationCard: zod_1.z.any().refine(validateFile, "Invalid registration card file").optional(),
    insurance: zod_1.z.any().refine(validateFile, "Invalid insurance file").optional(),
    technicalVisit: zod_1.z.any().refine(validateFile, "Invalid technical visit file").optional(),
    authorization: zod_1.z.any().refine(validateFile, "Invalid authorization file").optional(),
    taxSticker: zod_1.z.any().refine(validateFile, "Invalid tax sticker file").optional(),
});
// Schema for updating a vehicle
exports.vehicleUpdateSchema = exports.vehicleSchema.partial();
