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
exports.deleteAllReservations = exports.deleteReservation = exports.getOneReservation = exports.getAllReservations = exports.updateReservation = exports.createReservation = void 0;
const reservationValidation_1 = require("./../schema/reservationValidation");
const app_1 = require("..");
const zod_1 = require("zod");
const library_1 = require("@prisma/client/runtime/library");
/**
 * @desc Create a new Reservation
 * @route POST /api/reservations
 * @method POST
 * @access protected
 */
const createReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the request body using the reservationSchema
        const validatedReservation = reservationValidation_1.reservationSchema.parse(req.body);
        // Check if the vehicle exists
        const vehicle = yield app_1.prismaClient.vehicle.findUnique({
            where: { id: validatedReservation.vehicleId },
        });
        if (!vehicle) {
            res.status(400).json({ message: "Vehicle not found." });
            return;
        }
        // Check if the vehicle is available
        if (vehicle.status !== "AVAILABLE") {
            res.status(400).json({ message: "Vehicle is not available." });
            return;
        }
        // Check if the client exists
        const client = yield app_1.prismaClient.client.findUnique({
            where: { id: validatedReservation.clientId },
        });
        if (!client) {
            res.status(400).json({ message: "Client not found." });
            return;
        }
        // Check if the vehicle is already reserved during the requested period
        const existingReservation = yield app_1.prismaClient.reservation.findFirst({
            where: {
                vehicleId: validatedReservation.vehicleId,
                OR: [
                    {
                        startDate: { lte: validatedReservation.endDate },
                        endDate: { gte: validatedReservation.startDate },
                    },
                ],
                status: { in: ["PENDING", "CONFIRMED"] },
            },
        });
        if (existingReservation) {
            res.status(400).json({
                message: "The vehicle is already reserved for the requested period.",
            });
            return;
        }
        // Create the reservation
        const newReservation = yield app_1.prismaClient.reservation.create({
            data: Object.assign(Object.assign({}, validatedReservation), { startDate: new Date(validatedReservation.startDate), endDate: new Date(validatedReservation.endDate) }),
        });
        // Update vehicle status if reservation status is CONFIRMED
        if (newReservation.status === "CONFIRMED") {
            yield app_1.prismaClient.vehicle.update({
                where: { id: validatedReservation.vehicleId },
                data: { status: "RENTED" },
            });
        }
        res.status(201).json({
            message: "Reservation created successfully",
            reservation: newReservation,
        });
    }
    catch (error) {
        console.error("Create reservation error:", error);
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                message: "Validation failed",
                errors: error.errors.map((err) => ({
                    field: err.path[0],
                    message: err.message,
                })),
            });
            return;
        }
        if (error instanceof library_1.PrismaClientKnownRequestError &&
            error.code === "P2003") {
            res.status(400).json({ message: "Foreign key constraint failed" });
            return;
        }
        res.status(500).json({
            message: "Something went wrong",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.createReservation = createReservation;
/**
 * @desc Update a Reservation
 * @route PUT /api/reservations/:id
 * @method PUT
 * @access protected
 */
const updateReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ message: "Invalid reservation ID" });
        return;
    }
    try {
        const validatedData = reservationValidation_1.reservationUpdateSchema.parse(req.body);
        // Check if reservation exists
        const existingReservation = yield app_1.prismaClient.reservation.findUnique({
            where: { id },
        });
        if (!existingReservation) {
            res.status(404).json({ message: "Reservation not found." });
            return;
        }
        // Check if vehicle exists (if vehicleId is provided)
        if (validatedData.vehicleId &&
            validatedData.vehicleId !== existingReservation.vehicleId) {
            const vehicle = yield app_1.prismaClient.vehicle.findUnique({
                where: { id: validatedData.vehicleId },
            });
            if (!vehicle) {
                res.status(400).json({ message: "Vehicle not found." });
                return;
            }
            if (vehicle.status !== "AVAILABLE") {
                res.status(400).json({ message: "Vehicle is not available." });
                return;
            }
        }
        // Check if client exists (if clientId is provided)
        if (validatedData.clientId) {
            const client = yield app_1.prismaClient.client.findUnique({
                where: { id: validatedData.clientId },
            });
            if (!client) {
                res.status(400).json({ message: "Client not found." });
                return;
            }
        }
        // Check for reservation conflicts (if dates or vehicleId are updated)
        if (validatedData.startDate ||
            validatedData.endDate ||
            validatedData.vehicleId) {
            const conflict = yield app_1.prismaClient.reservation.findFirst({
                where: {
                    id: { not: id },
                    vehicleId: validatedData.vehicleId || existingReservation.vehicleId,
                    OR: [
                        {
                            startDate: {
                                lte: validatedData.endDate || existingReservation.endDate,
                            },
                            endDate: {
                                gte: validatedData.startDate || existingReservation.startDate,
                            },
                        },
                    ],
                    status: { in: ["PENDING", "CONFIRMED"] },
                },
            });
            if (conflict) {
                res.status(400).json({
                    message: "The vehicle is already reserved for the requested period.",
                });
                return;
            }
        }
        // Update reservation
        const updatedReservation = yield app_1.prismaClient.reservation.update({
            where: { id },
            data: Object.assign(Object.assign({}, validatedData), { startDate: validatedData.startDate
                    ? new Date(validatedData.startDate)
                    : undefined, endDate: validatedData.endDate
                    ? new Date(validatedData.endDate)
                    : undefined }),
            include: { vehicle: true },
        });
        // Handle vehicle status update based on reservation status
        const currentVehicleId = validatedData.vehicleId || existingReservation.vehicleId;
        const newStatus = validatedData.status || existingReservation.status;
        // If status is CANCELED or PENDING, check if we need to update vehicle status
        if (newStatus === "CANCELED" || newStatus === "PENDING") {
            // First, check if there are any other active reservations for this vehicle
            const otherActiveReservations = yield app_1.prismaClient.reservation.findFirst({
                where: {
                    vehicleId: currentVehicleId,
                    id: { not: id }, // Exclude the current reservation
                    status: "CONFIRMED", // Look for CONFIRMED status
                },
            });
            // If no other active reservations, set vehicle to AVAILABLE
            if (!otherActiveReservations) {
                console.log(`Updating vehicle ${currentVehicleId} to AVAILABLE status`);
                yield app_1.prismaClient.vehicle.update({
                    where: { id: currentVehicleId },
                    data: { status: "AVAILABLE" },
                });
            }
        }
        // If status is CONFIRMED, set vehicle to RENTED
        else if (newStatus === "CONFIRMED") {
            console.log(`Updating vehicle ${currentVehicleId} to RENTED status`);
            yield app_1.prismaClient.vehicle.update({
                where: { id: currentVehicleId },
                data: { status: "RENTED" },
            });
        }
        res.status(200).json({
            message: "Reservation updated successfully",
            reservation: updatedReservation,
        });
    }
    catch (error) {
        console.error("Update reservation error:", error);
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                message: "Validation failed",
                errors: error.errors.map((err) => ({
                    field: err.path[0],
                    message: err.message,
                })),
            });
            return;
        }
        if (error instanceof library_1.PrismaClientKnownRequestError &&
            error.code === "P2003") {
            res.status(400).json({ message: "Foreign key constraint failed" });
            return;
        }
        res.status(500).json({
            message: "Something went wrong",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.updateReservation = updateReservation;
/**
 * @desc Get all Reservations
 * @route GET /api/reservations
 * @method GET
 * @access protected
 */
const getAllReservations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reservations = yield app_1.prismaClient.reservation.findMany({
            include: {
                vehicle: true,
                client: true,
                invoices: true,
            },
        });
        res.status(200).json({
            message: "Reservations fetched successfully",
            reservations,
        });
    }
    catch (error) {
        console.error("Get all reservations error:", error);
        res.status(500).json({
            message: "Failed to fetch reservations",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getAllReservations = getAllReservations;
/**
 * @desc Get a single Reservation
 * @route GET /api/reservations/:id
 * @method GET
 * @access protected
 */
const getOneReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ message: "Invalid reservation ID" });
        return;
    }
    try {
        const reservation = yield app_1.prismaClient.reservation.findUnique({
            where: { id },
            include: {
                vehicle: true,
                client: true,
                invoices: true,
            },
        });
        if (!reservation) {
            res.status(404).json({ message: "Reservation not found" });
            return;
        }
        res.status(200).json({
            message: "Reservation fetched successfully",
            reservation,
        });
    }
    catch (error) {
        console.error("Get one reservation error:", error);
        res.status(500).json({
            message: "Failed to fetch reservation",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getOneReservation = getOneReservation;
/**
 * @desc Delete a Reservation
 * @route DELETE /api/reservations/:id
 * @method DELETE
 * @access protected
 */
const deleteReservation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.status(400).json({ message: "Invalid reservation ID" });
        return;
    }
    try {
        const existing = yield app_1.prismaClient.reservation.findUnique({
            where: { id },
        });
        if (!existing) {
            res.status(404).json({ message: "Reservation not found" });
            return;
        }
        // Delete the reservation
        yield app_1.prismaClient.reservation.delete({
            where: { id },
        });
        // Check if there are any other active reservations for this vehicle
        const activeReservations = yield app_1.prismaClient.reservation.findFirst({
            where: {
                vehicleId: existing.vehicleId,
                status: { in: ["CONFIRMED"] },
            },
        });
        // If no other active reservations, update vehicle status to AVAILABLE
        if (!activeReservations) {
            yield app_1.prismaClient.vehicle.update({
                where: { id: existing.vehicleId },
                data: { status: "AVAILABLE" },
            });
        }
        res.status(200).json({ message: "Reservation deleted successfully" });
    }
    catch (error) {
        console.error("Delete reservation error:", error);
        res.status(500).json({
            message: "Failed to delete reservation",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.deleteReservation = deleteReservation;
/**
 * @desc Delete all Reservations
 * @route DELETE /api/reservations
 * @method DELETE
 * @access protected
 */
const deleteAllReservations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield app_1.prismaClient.reservation.deleteMany();
        // Reset all vehicle statuses to AVAILABLE
        yield app_1.prismaClient.vehicle.updateMany({
            data: { status: "AVAILABLE" },
        });
        res.status(200).json({
            message: "All reservations deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete all reservations error:", error);
        res.status(500).json({
            message: "Failed to delete all reservations",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.deleteAllReservations = deleteAllReservations;
