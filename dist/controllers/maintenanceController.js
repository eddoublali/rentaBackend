"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMaintenance = exports.getOneMaintenance = exports.getAllMaintenances = exports.updateMaintenance = exports.createMaintenance = void 0;
const maintenanceSchema_1 = require("./../schema/maintenanceSchema");
const app_1 = require("../app");
const zod_1 = require("zod");
/**
 * @desc Create a new Maintenance
 * @route POST /api/Maintenance
 * @method POST
 * @access protected
 */
const createMaintenance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body using Zod
        const validatedData = maintenanceSchema_1.maintenanceSchema.parse(req.body);
        // Create the maintenance record in the database using Prisma
        const newMaintenance = yield app_1.prismaClient.maintenance.create({
            data: validatedData,
        });
        res.status(201).json({
            message: "Maintenance created successfully.",
            data: newMaintenance,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            // If Zod validation fails,  the errors
            res.status(400).json({
                message: "Validation failed",
                errors: error.errors,
            });
        }
        res.status(500).json({
            message: "Server error.",
            error: error,
        });
    }
});
exports.createMaintenance = createMaintenance;
/**
 * @desc Update an existing Maintenance
 * @route PUT /api/Maintenance/:id
 * @method PUT
 * @access protected
 */
const updateMaintenance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Validate request body using Zod
        const validatedData = maintenanceSchema_1.maintenanceUpdateSchema.parse(req.body);
        // Check if maintenance exists in the database
        const existingMaintenance = yield app_1.prismaClient.maintenance.findUnique({
            where: { id: Number(id) },
        });
        if (!existingMaintenance) {
            res.status(404).json({ message: "Maintenance not found." });
        }
        // Update the maintenance record in the database using Prisma
        const updatedMaintenance = yield app_1.prismaClient.maintenance.update({
            where: { id: Number(id) },
            data: validatedData,
        });
        res.status(200).json({
            message: "Maintenance updated successfully.",
            data: updatedMaintenance,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            // If Zod validation fails,  the errors
            res.status(400).json({
                message: "Validation failed",
                errors: error.errors,
            });
        }
        res.status(500).json({
            message: "Server error.",
            error: error,
        });
    }
});
exports.updateMaintenance = updateMaintenance;
/**
 * @desc Get all Maintenances
 * @route GET /api/Maintenance
 * @method GET
 * @access protected
 */
const getAllMaintenances = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const maintenances = yield app_1.prismaClient.maintenance.findMany();
        res.status(200).json({
            message: "Maintenances retrieved successfully.",
            data: maintenances,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Server error.",
            error: error,
        });
    }
});
exports.getAllMaintenances = getAllMaintenances;
/**
 * @desc Get a single Maintenance by ID
 * @route GET /api/Maintenance/:id
 * @method GET
 * @access protected
 */
const getOneMaintenance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const maintenance = yield app_1.prismaClient.maintenance.findUnique({
            where: { id: Number(id) },
        });
        console.log("Fetching maintenance ID:", id);
        console.log("Found maintenance:", maintenance);
        if (!maintenance) {
            res.status(404).json({ message: "Maintenance not found." });
        }
        res.status(200).json({
            message: "Maintenance retrieved successfully.",
            data: maintenance,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Server error.",
            error: error,
        });
    }
});
exports.getOneMaintenance = getOneMaintenance;
/**
 * @desc Delete a single Maintenance by ID
 * @route DELETE /api/Maintenance/:id
 * @method DELETE
 * @access protected
 */
const deleteMaintenance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedMaintenance = yield app_1.prismaClient.maintenance.delete({
            where: { id: Number(id) },
        });
        res.status(200).json({
            message: "Maintenance deleted successfully.",
            data: deletedMaintenance,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Server error.",
            error: error,
        });
    }
});
exports.deleteMaintenance = deleteMaintenance;
