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
exports.deleteContract = exports.updateContract = exports.getContractById = exports.getAllContracts = exports.createContract = void 0;
const zod_1 = require("zod");
const app_1 = require("../app");
const contractValidation_1 = require("../schema/contractValidation");
/**
 * Create a new contract
 * @route POST /api/contract
 * @access protected
 */
const createContract = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body
        const validatedData = contractValidation_1.contractSchema.parse(req.body);
        // Verify vehicle exists
        const vehicle = yield app_1.prismaClient.vehicle.findUnique({
            where: { id: validatedData.vehicleId },
        });
        if (!vehicle) {
            res.status(404).json({ success: false, message: "Vehicle not found" });
            return;
        }
        // Verify reservation exists
        const reservation = yield app_1.prismaClient.reservation.findUnique({
            where: { id: validatedData.reservationId },
        });
        if (!reservation) {
            res.status(404).json({ success: false, message: "Reservation not found" });
            return;
        }
        // Verify primary client exists
        const client = yield app_1.prismaClient.client.findUnique({
            where: { id: validatedData.clientId },
        });
        if (!client) {
            res.status(404).json({ success: false, message: "Client not found" });
            return;
        }
        // Verify second driver client if provided
        if (validatedData.secondDriver && validatedData.clientSeconId) {
            const secondClient = yield app_1.prismaClient.client.findUnique({
                where: { id: validatedData.clientSeconId },
            });
            if (!secondClient) {
                res.status(404).json({ success: false, message: "Second driver client not found" });
                return;
            }
            if (validatedData.clientSeconId === validatedData.clientId) {
                res.status(400).json({ success: false, message: "Second driver cannot be the same as primary client" });
                return;
            }
        }
        // Create contract
        const newContract = yield app_1.prismaClient.contract.create({
            data: Object.assign(Object.assign({}, validatedData), { accessories: validatedData.accessories || [], documents: validatedData.documents || [] }),
        });
        const revenue = yield app_1.prismaClient.revenue.create({
            data: {
                clientId: validatedData.clientId,
                contractId: newContract.id,
                vehicleId: validatedData.vehicleId,
                amount: validatedData.totalAmount,
                source: "Contract",
                date: new Date(), // Or you could use validatedData.startDate 
            }
        });
        // Update related records
        const [_, updatedReservation] = yield Promise.all([
            app_1.prismaClient.vehicle.update({
                where: { id: validatedData.vehicleId },
                data: { status: "RENTED" },
            }),
            app_1.prismaClient.reservation.updateMany({
                where: { id: validatedData.reservationId },
                data: { status: "CONFIRMED" },
            }),
        ]);
        const response = {
            success: true,
            message: "Contract created successfully",
            data: newContract,
            updatedReservation: updatedReservation.count > 0,
        };
        res.status(201).json(response);
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                success: false,
                message: "Validation error",
                errors: error.errors,
            });
            return;
        }
        console.error("Error creating contract:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create contract",
            errors: error.message,
        });
    }
});
exports.createContract = createContract;
/**
 * @desc Get all contracts
 * @route GET /api/contract
 * @method GET
 * @access protected
 */
const getAllContracts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contracts = yield app_1.prismaClient.contract.findMany({
            include: {
                vehicle: true,
                client: true,
            },
        });
        res.status(200).json({
            success: true,
            count: contracts.length,
            data: contracts,
        });
    }
    catch (error) {
        console.error("Error fetching contracts:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve contracts",
            error: error.message,
        });
    }
});
exports.getAllContracts = getAllContracts;
/**
 * @desc Get contract by ID
 * @route GET /api/contract/:id
 * @method GET
 * @access protected
 */
const getContractById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const contract = yield app_1.prismaClient.contract.findUnique({
            where: { id: Number(id) },
            include: {
                client: true,
                secondClient: true,
                vehicle: true,
            }
        });
        if (!contract) {
            res.status(404).json({
                success: false,
                message: "Contract not found",
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: contract,
        });
    }
    catch (error) {
        console.error("Error fetching contract:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve contract",
            error: error.message,
        });
    }
});
exports.getContractById = getContractById;
/**
 * @desc Update contract
 * @route PUT /api/contract/:id
 * @method PUT
 * @access protected
 */
/**
 * @desc Update contract with comprehensive validation
 * @route PUT /api/contract/:id
 * @method PUT
 * @access protected
 */
const updateContract = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Check if contract exists before attempting update
        const existingContract = yield app_1.prismaClient.contract.findUnique({
            where: { id: Number(id) },
        });
        if (!existingContract) {
            res.status(404).json({
                success: false,
                message: "Contract not found",
            });
            return;
        }
        // Validate request body against update schema
        const validatedData = contractValidation_1.contractUpdateSchema.parse(req.body);
        // If vehicle is being updated, verify it exists
        if (validatedData.vehicleId) {
            const vehicle = yield app_1.prismaClient.vehicle.findUnique({
                where: { id: validatedData.vehicleId },
            });
            if (!vehicle) {
                res.status(404).json({ success: false, message: "Vehicle not found" });
                return;
            }
        }
        // If reservation is being updated, verify it exists
        if (validatedData.reservationId) {
            const reservation = yield app_1.prismaClient.reservation.findUnique({
                where: { id: validatedData.reservationId },
            });
            if (!reservation) {
                res.status(404).json({ success: false, message: "Reservation not found" });
                return;
            }
        }
        // If client is being updated, verify it exists
        if (validatedData.clientId) {
            const client = yield app_1.prismaClient.client.findUnique({
                where: { id: validatedData.clientId },
            });
            if (!client) {
                res.status(404).json({ success: false, message: "Client not found" });
                return;
            }
        }
        // Verify second driver client if provided in update
        if (validatedData.secondDriver && validatedData.clientSeconId) {
            // Check if the second driver exists
            const secondClient = yield app_1.prismaClient.client.findUnique({
                where: { id: validatedData.clientSeconId },
            });
            if (!secondClient) {
                res.status(404).json({ success: false, message: "Second driver client not found" });
                return;
            }
            // Check if second driver is the same as primary driver
            const primaryClientId = validatedData.clientId || existingContract.clientId;
            if (validatedData.clientSeconId === primaryClientId) {
                res.status(400).json({
                    success: false,
                    message: "Second driver cannot be the same as primary client"
                });
                return;
            }
        }
        // Update the contract
        const updatedContract = yield app_1.prismaClient.contract.update({
            where: { id: Number(id) },
            data: Object.assign(Object.assign({}, validatedData), { 
                // Ensure arrays are handled correctly
                accessories: validatedData.accessories || existingContract.accessories || undefined, documents: validatedData.documents || existingContract.documents || undefined }),
            include: {
                vehicle: true,
                client: true,
            }
        });
        // Handle related record updates if needed
        if (validatedData.vehicleId && validatedData.vehicleId !== existingContract.vehicleId) {
            // Update old vehicle status if applicable
            yield app_1.prismaClient.vehicle.update({
                where: { id: existingContract.vehicleId },
                data: { status: "AVAILABLE" },
            });
            // Update new vehicle status
            yield app_1.prismaClient.vehicle.update({
                where: { id: validatedData.vehicleId },
                data: { status: "RENTED" },
            });
        }
        res.status(200).json({
            success: true,
            message: "Contract updated successfully",
            data: updatedContract,
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                success: false,
                message: "Validation error",
                errors: error.errors,
            });
            return;
        }
        console.error("Error updating contract:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update contract",
            error: error.message,
        });
    }
});
exports.updateContract = updateContract;
/**
 * @desc Delete contract
 * @route DELETE /api/contract/:id
 * @method DELETE
 * @access protected
 */
const deleteContract = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Check if contract exists
        const contract = yield app_1.prismaClient.contract.findUnique({
            where: { id: Number(id) },
        });
        if (!contract) {
            res.status(404).json({
                success: false,
                message: "Contract not found",
            });
            return;
        }
        // Delete the contract
        yield app_1.prismaClient.contract.delete({
            where: { id: Number(id) },
        });
        res.status(200).json({
            success: true,
            message: "Contract deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting contract:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete contract",
            error: error.message,
        });
    }
});
exports.deleteContract = deleteContract;
