// src/middleware/prismaMiddleware.ts

import { PrismaClient } from '@prisma/client';

// We'll extend the PrismaClient to add middleware
export function setupPrismaMiddleware(prisma: PrismaClient): PrismaClient {
  // This middleware runs before every query to check and update expired reservations
  prisma.$use(async (params, next) => {
    // Check expired reservations before any operation on reservations or vehicles
    if (
      ['reservation', 'vehicle'].includes(params.model as string) && 
      ['findMany', 'findUnique', 'findFirst'].includes(params.action)
    ) {
      // Update vehicle statuses for expired reservations
      await updateVehicleStatusForExpiredReservations(prisma);
    }
    
    return next(params);
  });
  
  return prisma;
}

/**
 * Updates the status of vehicles with expired reservations to AVAILABLE
 */
async function updateVehicleStatusForExpiredReservations(prisma: PrismaClient): Promise<void> {
  try {
    const now = new Date();
    
    // Find all confirmed reservations that have ended (endDate < now)
    const expiredReservations = await prisma.reservation.findMany({
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
    await prisma.reservation.updateMany({
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
      const activeReservations = await prisma.reservation.findFirst({
        where: {
          vehicleId: reservation.vehicleId,
          id: { not: reservation.id },
          status: "CONFIRMED",
          endDate: { gt: now }
        }
      });
      
      // If no other active reservations, set vehicle to AVAILABLE
      if (!activeReservations) {
        await prisma.vehicle.update({
          where: { id: reservation.vehicleId },
          data: { status: "AVAILABLE" }
        });
        console.log(`Vehicle ${reservation.vehicleId} marked as AVAILABLE after reservation ended`);
      }
    }
  } catch (error) {
    console.error("Error in prisma middleware updating vehicle statuses:", error);
  }
}