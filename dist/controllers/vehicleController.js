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
exports.createVehicleHandler = exports.getAvailableVehicles = exports.deleteVehicle = exports.getVehicle = exports.getAllVehicles = exports.updateVehicle = exports.createVehicle = void 0;
const app_1 = require("..");
const vehicleValidation_1 = require("../schema/vehicleValidation");
const zod_1 = require("zod");
/**
 * @desc Create a new vehicle
 * @route POST /api/vehicles
 * @method POST
 * @access protected
 */
const createVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = vehicleValidation_1.vehicleSchema.parse(req.body);
        const existingVehicle = yield app_1.prismaClient.vehicle.findFirst({
            where: {
                OR: [
                    { chassisNumber: validatedData.chassisNumber },
                    { plateNumber: validatedData.plateNumber }
                ]
            }
        });
        if (existingVehicle) {
            res.status(400).json({
                message: 'A vehicle with the same chassis number or plate number already exists',
            });
            return;
        }
        const files = req.files;
        const image = (files === null || files === void 0 ? void 0 : files.image) ? `/uploads/${files.image[0].filename}` : null;
        const registrationCard = (files === null || files === void 0 ? void 0 : files.registrationCard) ? `/uploads/${files.registrationCard[0].filename}` : null;
        const insurance = (files === null || files === void 0 ? void 0 : files.insurance) ? `/uploads/${files.insurance[0].filename}` : null;
        const technicalVisit = (files === null || files === void 0 ? void 0 : files.technicalVisit) ? `/uploads/${files.technicalVisit[0].filename}` : null;
        const authorization = (files === null || files === void 0 ? void 0 : files.authorization) ? `/uploads/${files.authorization[0].filename}` : null;
        const taxSticker = (files === null || files === void 0 ? void 0 : files.taxSticker) ? `/uploads/${files.taxSticker[0].filename}` : null;
        const vehicle = yield app_1.prismaClient.vehicle.create({
            data: Object.assign(Object.assign({}, validatedData), { image,
                registrationCard,
                insurance,
                technicalVisit,
                authorization,
                taxSticker }),
        });
        if (!vehicle) {
            res.status(404).json({ message: 'Failed to create vehicle' });
        }
        res.status(201).json({ message: 'Vehicle created successfully', vehicle });
    }
    catch (error) {
        console.error('Error creating vehicle:', error);
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                status: 'error',
                message: 'Invalid vehicle data',
                errors: error.errors
            });
        }
        else if (error.response) {
            res.status(error.response.status).json({
                status: 'error',
                message: error.response.data.message,
                errors: error.response.data.errors || ['Unknown server error']
            });
        }
        else {
            res.status(500).json({
                status: 'error',
                message: 'Internal server error',
                error: error.message
            });
        }
    }
});
exports.createVehicle = createVehicle;
/**
 * @desc Update an existing vehicle
 * @route PUT /api/vehicles/:id
 * @method PUT
 * @access protected
 */
const updateVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    try {
        const { id } = req.params;
        const vehicleId = Number(id);
        if (isNaN(vehicleId)) {
            res.status(400).json({ message: 'Invalid Vehicle ID' });
            return;
        }
        const validatedData = vehicleValidation_1.vehicleUpdateSchema.parse(req.body);
        const existingVehicle = yield app_1.prismaClient.vehicle.findUnique({
            where: { id: vehicleId },
        });
        if (!existingVehicle) {
            res.status(404).json({ message: 'Vehicle not found' });
            return;
        }
        if (existingVehicle.chassisNumber !== validatedData.chassisNumber ||
            existingVehicle.plateNumber !== validatedData.plateNumber) {
            const duplicateVehicle = yield app_1.prismaClient.vehicle.findFirst({
                where: {
                    OR: [
                        { chassisNumber: validatedData.chassisNumber },
                        { plateNumber: validatedData.plateNumber },
                    ],
                    NOT: { id: vehicleId },
                },
            });
            if (duplicateVehicle) {
                res.status(400).json({
                    message: 'A vehicle with the same chassis number or plate number already exists',
                });
                return;
            }
        }
        const files = req.files;
        const image = ((_b = (_a = files === null || files === void 0 ? void 0 : files.image) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.filename) ? `/uploads/${files.image[0].filename}` : existingVehicle.image;
        const registrationCard = ((_d = (_c = files === null || files === void 0 ? void 0 : files.registrationCard) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.filename)
            ? `/uploads/${files.registrationCard[0].filename}`
            : existingVehicle.registrationCard;
        const insurance = ((_f = (_e = files === null || files === void 0 ? void 0 : files.insurance) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.filename)
            ? `/uploads/${files.insurance[0].filename}`
            : existingVehicle.insurance;
        const technicalVisit = ((_h = (_g = files === null || files === void 0 ? void 0 : files.technicalVisit) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.filename)
            ? `/uploads/${files.technicalVisit[0].filename}`
            : existingVehicle.technicalVisit;
        const authorization = ((_k = (_j = files === null || files === void 0 ? void 0 : files.authorization) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.filename)
            ? `/uploads/${files.authorization[0].filename}`
            : existingVehicle.authorization;
        const taxSticker = ((_m = (_l = files === null || files === void 0 ? void 0 : files.taxSticker) === null || _l === void 0 ? void 0 : _l[0]) === null || _m === void 0 ? void 0 : _m.filename)
            ? `/uploads/${files.taxSticker[0].filename}`
            : existingVehicle.taxSticker;
        const updatedVehicle = yield app_1.prismaClient.vehicle.update({
            where: { id: vehicleId },
            data: Object.assign(Object.assign({}, validatedData), { image,
                registrationCard,
                insurance,
                technicalVisit,
                authorization,
                taxSticker }),
        });
        res.status(200).json({ message: 'Vehicle updated successfully', vehicle: updatedVehicle });
    }
    catch (error) {
        console.error('Update vehicle error:', error);
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                message: 'Invalid vehicle data',
                errors: error.errors,
            });
        }
        else {
            res.status(500).json({
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
});
exports.updateVehicle = updateVehicle;
/**
 * @desc GET all vehicles with related data
 * @route GET /api/vehicles
 * @method GET
 * @access protected
 */
const getAllVehicles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicles = yield app_1.prismaClient.vehicle.findMany({
            include: {
                reservations: true,
                contracts: true,
                infractions: true,
                accidents: true,
            },
        });
        res.status(200).json({ message: 'Vehicles retrieved successfully', vehicles });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getAllVehicles = getAllVehicles;
/**
 * @desc Get a vehicle by ID with related data
 * @route GET /api/vehicles/:id
 * @method GET
 * @access protected
 */
const getVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userId = Number(id);
        if (isNaN(userId)) {
            res.status(400).json({ message: 'Invalid Vehicle ID' });
        }
        const vehicle = yield app_1.prismaClient.vehicle.findUnique({
            where: {
                id: userId,
            },
            include: {
                reservations: true,
                contracts: true,
                infractions: true,
                accidents: true,
            },
        });
        if (!vehicle) {
            res.status(404).json({ message: 'Vehicle not found' });
        }
        // Send the found vehicle with its related data as the response
        res.status(200).json({ message: 'Vehicle found', vehicle });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getVehicle = getVehicle;
/**
 * @desc Delete a vehicle by ID with related data
 * @route DELETE /api/vehicles/:id
 * @method DELETE
 * @access protected
 */
const deleteVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Get the vehicle ID from the URL parameters
        const userId = Number(id);
        if (isNaN(userId)) {
            res.status(400).json({ message: 'Invalid Vehicle ID' });
        }
        // Find the vehicle with the provided ID
        const vehicle = yield app_1.prismaClient.vehicle.findUnique({
            where: {
                id: userId, // Convert the ID to a number
            },
        });
        if (!vehicle) {
            // If no vehicle is found, return a 404 error
            res.status(404).json({ message: 'Vehicle not found' });
        }
        // Delete related data first, if necessary
        // Example: Delete related rentals, reservations, contracts, infractions, etc.
        yield app_1.prismaClient.reservation.deleteMany({
            where: { vehicleId: vehicle === null || vehicle === void 0 ? void 0 : vehicle.id },
        });
        yield app_1.prismaClient.contract.deleteMany({
            where: { vehicleId: vehicle === null || vehicle === void 0 ? void 0 : vehicle.id },
        });
        yield app_1.prismaClient.infraction.deleteMany({
            where: { vehicleId: vehicle === null || vehicle === void 0 ? void 0 : vehicle.id },
        });
        // Delete the vehicle
        yield app_1.prismaClient.vehicle.delete({
            where: {
                id: userId,
            },
        });
        // Send a success message
        res.status(200).json({ message: 'Vehicle deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.deleteVehicle = deleteVehicle;
/**
 * @desc Get available vehicles for a given date range
 * @route GET /api/vehicles/available
 * @method GET
 * @access protected
 */
const getAvailableVehicles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { startDate, endDate } = req.query;
        // Validate query parameters
        if (!startDate || !endDate) {
            res.status(400).json({ message: 'startDate and endDate are required' });
            return;
        }
        // Parse and validate dates
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            res.status(400).json({ message: 'Invalid date format' });
            return;
        }
        if (start >= end) {
            res.status(400).json({ message: 'startDate must be before endDate' });
            return;
        }
        // Fetch vehicles with status AVAILABLE and no conflicting reservations
        const availableVehicles = yield app_1.prismaClient.vehicle.findMany({
            where: {
                status: 'AVAILABLE',
                reservations: {
                    none: {
                        OR: [
                            {
                                startDate: { lte: end },
                                endDate: { gte: start },
                            },
                        ],
                        status: { in: ['PENDING', 'CONFIRMED'] },
                    },
                },
            },
        });
        res.status(200).json({
            message: 'Available vehicles retrieved successfully',
            vehicles: availableVehicles,
        });
    }
    catch (error) {
        console.error('Error fetching available vehicles:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
exports.getAvailableVehicles = getAvailableVehicles;
// For the router setup, use this approach
const createVehicleHandler = (req, res, next) => {
    (0, exports.createVehicle)(req, res).catch(next);
};
exports.createVehicleHandler = createVehicleHandler;
