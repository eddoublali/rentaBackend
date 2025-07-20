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
exports.deleteAllAccidents = exports.deleteAccidentById = exports.getOneAccident = exports.getAllAccidents = exports.updateAccident = exports.createAccident = void 0;
const app_1 = require("../app");
const accidentValidation_1 = require("../schema/accidentValidation");
const zod_1 = require("zod");
// Helper functions to reduce code duplication
const sendResponse = (res, status, response) => {
    res.status(status).json(response);
};
const handleError = (res, error) => {
    console.error('Accident operation error:', error);
    if (error instanceof zod_1.ZodError) {
        sendResponse(res, 400, {
            success: false,
            message: 'Validation error',
            errors: error.errors,
        });
        return;
    }
    sendResponse(res, 500, {
        success: false,
        message: 'Operation failed',
        errors: error instanceof Error ? error.message : 'Unknown error',
    });
};
const processDamagePhotos = (files, inputPhotos) => {
    // Case 1: New photos uploaded
    if ((files === null || files === void 0 ? void 0 : files.damagePhotos) && files.damagePhotos.length > 0) {
        const photosPaths = files.damagePhotos.map(file => `/uploads/${file.filename}`);
        return JSON.stringify(photosPaths);
    }
    // Case 2: Photos passed in request body
    if (inputPhotos) {
        if (typeof inputPhotos === 'string') {
            // Either already JSON string or single photo path
            try {
                // Check if it's a valid JSON
                JSON.parse(inputPhotos);
                return inputPhotos;
            }
            catch (_a) {
                // Not valid JSON, treat as single photo path
                return JSON.stringify([inputPhotos]);
            }
        }
        // Array of photos
        return JSON.stringify(inputPhotos);
    }
    // Case 3: No photos
    return null;
};
/**
 * @desc Create a new accident
 * @route POST /api/accidents
 * @access protected
 */
const createAccident = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const validatedData = accidentValidation_1.accidentSchema.parse(req.body);
        const photosJson = processDamagePhotos(req.files, validatedData.damagePhotos);
        const accident = yield app_1.prismaClient.accident.create({
            data: {
                vehicleId: validatedData.vehicleId,
                clientId: (_a = validatedData.clientId) !== null && _a !== void 0 ? _a : null,
                accidentDate: new Date(validatedData.accidentDate),
                location: validatedData.location,
                description: validatedData.description,
                repairCost: validatedData.repairCost,
                fault: validatedData.fault || 'UNKNOWN',
                damagePhotos: photosJson,
                status: validatedData.status || 'REPORTED',
            },
        });
        sendResponse(res, 201, {
            success: true,
            message: 'Accident created successfully',
            data: accident,
        });
    }
    catch (error) {
        handleError(res, error);
    }
});
exports.createAccident = createAccident;
/**
 * @desc Update an accident by ID
 * @route PUT /api/accidents/:id
 * @access protected
 */
const updateAccident = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const accidentId = parseInt(req.params.id);
        if (isNaN(accidentId)) {
            sendResponse(res, 400, { success: false, message: 'Invalid accident ID' });
            return;
        }
        // Check if accident exists
        const existingAccident = yield app_1.prismaClient.accident.findUnique({
            where: { id: accidentId },
        });
        if (!existingAccident) {
            sendResponse(res, 404, { success: false, message: 'Accident not found' });
            return;
        }
        const validatedData = accidentValidation_1.accidentUpdateSchema.parse(req.body);
        const photosJson = processDamagePhotos(req.files, (_a = validatedData.damagePhotos) !== null && _a !== void 0 ? _a : existingAccident.damagePhotos);
        const updatedAccident = yield app_1.prismaClient.accident.update({
            where: { id: accidentId },
            data: {
                vehicleId: validatedData.vehicleId,
                clientId: validatedData.clientId,
                accidentDate: validatedData.accidentDate ? new Date(validatedData.accidentDate) : undefined,
                location: validatedData.location,
                description: validatedData.description,
                repairCost: validatedData.repairCost,
                fault: validatedData.fault,
                damagePhotos: photosJson,
                status: validatedData.status,
            },
        });
        sendResponse(res, 200, {
            success: true,
            message: 'Accident updated successfully',
            data: updatedAccident,
        });
    }
    catch (error) {
        handleError(res, error);
    }
});
exports.updateAccident = updateAccident;
/**
 * @desc Get all accidents
 * @route GET /api/accidents
 * @access protected
 */
const getAllAccidents = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accidents = yield app_1.prismaClient.accident.findMany({
            include: {
                vehicle: true,
                client: true,
            },
        });
        // Parse damage photos JSON strings to arrays for frontend use
        const formattedAccidents = accidents.map(accident => (Object.assign(Object.assign({}, accident), { damagePhotos: accident.damagePhotos ? JSON.parse(accident.damagePhotos) : null })));
        sendResponse(res, 200, {
            success: true,
            count: accidents.length,
            data: formattedAccidents,
            message: ''
        });
    }
    catch (error) {
        handleError(res, error);
    }
});
exports.getAllAccidents = getAllAccidents;
/**
 * @desc Get a single accident by ID
 * @route GET /api/accidents/:id
 * @access protected
 */
const getOneAccident = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accidentId = parseInt(req.params.id);
        if (isNaN(accidentId)) {
            sendResponse(res, 400, { success: false, message: 'Invalid accident ID' });
            return;
        }
        const accident = yield app_1.prismaClient.accident.findUnique({
            where: { id: accidentId },
            include: {
                vehicle: true,
                client: true,
            },
        });
        if (!accident) {
            sendResponse(res, 404, { success: false, message: 'Accident not found' });
            return;
        }
        // Parse damage photos JSON string to array for frontend use
        const formattedAccident = Object.assign(Object.assign({}, accident), { damagePhotos: accident.damagePhotos ? JSON.parse(accident.damagePhotos) : null });
        sendResponse(res, 200, {
            success: true,
            data: formattedAccident,
            message: ''
        });
    }
    catch (error) {
        handleError(res, error);
    }
});
exports.getOneAccident = getOneAccident;
/**
 * @desc Delete an accident by ID
 * @route DELETE /api/accidents/:id
 * @access protected
 */
const deleteAccidentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accidentId = parseInt(req.params.id);
        if (isNaN(accidentId)) {
            sendResponse(res, 400, { success: false, message: 'Invalid accident ID' });
            return;
        }
        // Check if accident exists
        const existingAccident = yield app_1.prismaClient.accident.findUnique({
            where: { id: accidentId },
        });
        if (!existingAccident) {
            sendResponse(res, 404, { success: false, message: 'Accident not found' });
            return;
        }
        yield app_1.prismaClient.accident.delete({
            where: { id: accidentId },
        });
        sendResponse(res, 200, {
            success: true,
            message: 'Accident deleted successfully',
        });
    }
    catch (error) {
        handleError(res, error);
    }
});
exports.deleteAccidentById = deleteAccidentById;
/**
 * @desc Delete all accidents
 * @route DELETE /api/accidents
 * @access protected - Requires admin permissions
 */
const deleteAllAccidents = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield app_1.prismaClient.accident.deleteMany({});
        sendResponse(res, 200, {
            success: true,
            message: 'All accidents deleted successfully',
        });
    }
    catch (error) {
        handleError(res, error);
    }
});
exports.deleteAllAccidents = deleteAllAccidents;
