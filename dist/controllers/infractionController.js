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
exports.getInfractionsByClient = exports.deleteAllInfractions = exports.deleteInfraction = exports.getOneInfraction = exports.getAllInfractions = exports.updateInfraction = exports.createInfraction = void 0;
const infractiontValidation_1 = require("./../schema/infractiontValidation");
const __1 = require("..");
const zod_1 = require("zod");
/**
 * @desc Create a new infraction
 * @route POST /api/infraction
 * @method POST
 * @access protected
 */
const createInfraction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the request body
        const validatedInfraction = infractiontValidation_1.infractionSchema.parse(req.body);
        // Check if the related vehicle exists
        const vehicleExists = yield __1.prismaClient.vehicle.findUnique({
            where: { id: validatedInfraction.vehicleId },
        });
        if (!vehicleExists) {
            res.status(404).json({ message: 'Vehicle not found' });
            return;
        }
        // Create the new infraction
        const newInfraction = yield __1.prismaClient.infraction.create({
            data: validatedInfraction,
        });
        res.status(201).json({
            message: 'Infraction created successfully',
            data: newInfraction,
        });
    }
    catch (error) {
        // Handle validation errors
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ message: 'Validation failed', errors: error.errors });
            return;
        }
        res.status(500).json({
            message: 'Something went wrong',
        });
    }
});
exports.createInfraction = createInfraction;
/**
 * @desc Update an infraction
 * @route PUT /api/infraction/:id
 * @method PUT
 * @access protected
 */
const updateInfraction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Get the infraction ID from the request parameters
        const documentId = Number(req.params.id);
        if (!documentId) {
            res.status(400).json({ message: 'Invalid Infraction id' });
            return;
        }
        const validatedInfraction = infractiontValidation_1.infractionUpdateSchema.parse(req.body);
        // Check if the infraction exists
        const infractionExists = yield __1.prismaClient.infraction.findUnique({
            where: { id: Number(id) },
        });
        if (!infractionExists) {
            res.status(404).json({ message: `Infraction with ID ${id} not found` });
            return;
        }
        // Check if the related vehicle exists for update
        if (validatedInfraction.vehicleId) {
            const vehicleExists = yield __1.prismaClient.vehicle.findUnique({
                where: { id: validatedInfraction.vehicleId },
            });
            if (!vehicleExists) {
                res.status(404).json({ message: 'Vehicle not found for update' });
                return;
            }
        }
        // Update the infraction in the database
        const updatedInfraction = yield __1.prismaClient.infraction.update({
            where: { id: Number(id) },
            data: validatedInfraction,
        });
        res.status(200).json({
            message: 'Infraction updated successfully',
            data: updatedInfraction,
        });
    }
    catch (error) {
        // Handle validation errors
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ message: 'Validation failed', errors: error.errors });
            return;
        }
        res.status(500).json({
            message: 'Something went wrong',
        });
    }
});
exports.updateInfraction = updateInfraction;
/**
 * @desc Get all infractions
 * @route GET /api/infraction
 * @method GET
 * @access public
 */
const getAllInfractions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const infractions = yield __1.prismaClient.infraction.findMany({
            include: {
                client: true,
                vehicle: true
            }
        });
        res.status(200).json({
            message: 'Infractions retrieved successfully',
            infractions,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Something went wrong',
        });
    }
});
exports.getAllInfractions = getAllInfractions;
/**
 * @desc Get a single infraction by ID
 * @route GET /api/infraction/:id
 * @method GET
 * @access public
 */
const getOneInfraction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Get the infraction ID from the request parameters
        const documentId = Number(req.params.id);
        if (!documentId) {
            res.status(400).json({ message: 'Invalid Infraction id' });
            return;
        }
        const infraction = yield __1.prismaClient.infraction.findUnique({
            where: { id: Number(id) },
            include: {
                client: true,
                vehicle: true
            }
        });
        if (!infraction) {
            res.status(404).json({ message: `Infraction with ID ${id} not found` });
            return;
        }
        res.status(200).json({
            message: 'Infraction retrieved successfully',
            data: infraction,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Something went wrong',
        });
    }
});
exports.getOneInfraction = getOneInfraction;
/**
 * @desc Delete an infraction by ID
 * @route DELETE /api/infraction/:id
 * @method DELETE
 * @access protected
 */
const deleteInfraction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Get the infraction ID from the request parameters
        const documentId = Number(req.params.id);
        if (!documentId) {
            res.status(400).json({ message: 'Invalid Infraction id' });
            return;
        }
        // Check if the infraction exists
        const infractionExists = yield __1.prismaClient.infraction.findUnique({
            where: { id: Number(id) },
        });
        if (!infractionExists) {
            res.status(404).json({ message: `Infraction with ID ${id} not found` });
            return;
        }
        // Delete the infraction
        const deletedInfraction = yield __1.prismaClient.infraction.delete({
            where: { id: Number(id) },
        });
        res.status(200).json({
            message: `Infraction with ID ${id} deleted successfully`,
            data: deletedInfraction,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Something went wrong',
        });
    }
});
exports.deleteInfraction = deleteInfraction;
/**
 * @desc Delete all infractions
 * @route DELETE /api/infraction
 * @method DELETE
 * @access protected
 */
const deleteAllInfractions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Delete all infractions from the database
        const deletedInfractions = yield __1.prismaClient.infraction.deleteMany();
        res.status(200).json({
            message: `All infractions deleted successfully`,
            data: deletedInfractions,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Something went wrong',
        });
    }
});
exports.deleteAllInfractions = deleteAllInfractions;
/**
 * @desc Get all infractions related to a specific client
 * @route GET /api/infraction/client/:clientId
 * @method GET
 * @access public
 */
const getInfractionsByClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { clientId } = req.params;
        const id = Number(clientId);
        if (!id) {
            res.status(400).json({ message: 'Invalid client ID' });
            return;
        }
        const infractions = yield __1.prismaClient.infraction.findMany({
            where: { clientId: id },
            include: {
                client: true,
                vehicle: true,
            },
        });
        res.status(200).json({
            message: `Infractions for client ${id} retrieved successfully`,
            data: infractions,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Something went wrong',
        });
    }
});
exports.getInfractionsByClient = getInfractionsByClient;
