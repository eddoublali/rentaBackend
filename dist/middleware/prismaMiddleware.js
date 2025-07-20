"use strict";
// src/middleware/prismaMiddleware.ts
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
exports.setupPrismaMiddleware = setupPrismaMiddleware;
// We'll extend the PrismaClient to add middleware
function setupPrismaMiddleware(prisma) {
    // This middleware runs before every query to check and update expired reservations
    prisma.$use((params, next) => __awaiter(this, void 0, void 0, function* () {
        // Check expired reservations before any operation on reservations or vehicles
        if (['reservation', 'vehicle'].includes(params.model) &&
            ['findMany', 'findUnique', 'findFirst'].includes(params.action)) {
            // Update vehicle statuses for expired reservations
            yield updateVehicleStatusForExpiredReservations(prisma);
        }
        return next(params);
    }));
    return prisma;
}
/**
 * Updates the status of vehicles with expired reservations to AVAILABLE
 */
function updateVehicleStatusForExpiredReservations(prisma) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const now = new Date();
            // Find all confirmed reservations that have ended (endDate < now)
            const expiredReservations = yield prisma.reservation.findMany({
                where: {
                    status: "CONFIRMED",
                    endDate: { lt: now }
                },
                select: {
                    id: true,
                    vehicleId: true
                }
            });
            if (expiredReservations.length === 0) {
                return; // No expired reservations to process
            }
            // For expired reservations, change status to CANCELED
            // (since we don't have a COMPLETED status in the enum)
            yield prisma.reservation.updateMany({
                where: {
                    id: { in: expiredReservations.map(r => r.id) },
                    status: "CONFIRMED"
                },
                data: {
                    status: "CANCELED" // Using CANCELED instead of COMPLETED since it's not in your enum
                }
            });
            // For each expired reservation's vehicle, check if there are other active reservations
            for (const reservation of expiredReservations) {
                // Check if vehicle has any other active reservations
                const activeReservations = yield prisma.reservation.findFirst({
                    where: {
                        vehicleId: reservation.vehicleId,
                        id: { not: reservation.id },
                        status: "CONFIRMED",
                        endDate: { gt: now }
                    }
                });
                // If no other active reservations, set vehicle to AVAILABLE
                if (!activeReservations) {
                    yield prisma.vehicle.update({
                        where: { id: reservation.vehicleId },
                        data: { status: "AVAILABLE" }
                    });
                    console.log(`Vehicle ${reservation.vehicleId} marked as AVAILABLE after reservation ended`);
                }
            }
        }
        catch (error) {
            console.error("Error in prisma middleware updating vehicle statuses:", error);
        }
    });
}
