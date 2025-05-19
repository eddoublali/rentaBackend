import {
  reservationSchema,
  reservationUpdateSchema,
} from "./../schema/reservationValidation";
import { Request, Response } from "express";
import { prismaClient } from "../app";
import { z } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

/**
 * @desc Create a new Reservation
 * @route POST /api/reservations
 * @method POST
 * @access protected
 */
export const createReservation = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Validate the request body using the reservationSchema
    const validatedReservation = reservationSchema.parse(req.body);

    // Check if the vehicle exists
    const vehicle = await prismaClient.vehicle.findUnique({
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
    const client = await prismaClient.client.findUnique({
      where: { id: validatedReservation.clientId },
    });

    if (!client) {
      res.status(400).json({ message: "Client not found." });
      return;
    }

    // Check if the vehicle is already reserved during the requested period
    const existingReservation = await prismaClient.reservation.findFirst({
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
    const newReservation = await prismaClient.reservation.create({
      data: {
        ...validatedReservation,
        startDate: new Date(validatedReservation.startDate),
        endDate: new Date(validatedReservation.endDate),
      },
    });

    // Update vehicle status if reservation status is CONFIRMED
    if (newReservation.status === "CONFIRMED") {
      await prismaClient.vehicle.update({
        where: { id: validatedReservation.vehicleId },
        data: { status: "RENTED" },
      });
    }

    res.status(201).json({
      message: "Reservation created successfully",
      reservation: newReservation,
    });
  } catch (error: unknown) {
    console.error("Create reservation error:", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation failed",
        errors: error.errors.map((err) => ({
          field: err.path[0],
          message: err.message,
        })),
      });
      return;
    }

    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      res.status(400).json({ message: "Foreign key constraint failed" });
      return;
    }

    res.status(500).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * @desc Update a Reservation
 * @route PUT /api/reservations/:id
 * @method PUT
 * @access protected
 */
export const updateReservation = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid reservation ID" });
    return;
  }

  try {
    const validatedData = reservationUpdateSchema.parse(req.body);

    // Check if reservation exists
    const existingReservation = await prismaClient.reservation.findUnique({
      where: { id },
    });

    if (!existingReservation) {
      res.status(404).json({ message: "Reservation not found." });
      return;
    }

    // Check if vehicle exists (if vehicleId is provided)
    if (
      validatedData.vehicleId &&
      validatedData.vehicleId !== existingReservation.vehicleId
    ) {
      const vehicle = await prismaClient.vehicle.findUnique({
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
      const client = await prismaClient.client.findUnique({
        where: { id: validatedData.clientId },
      });
      if (!client) {
        res.status(400).json({ message: "Client not found." });
        return;
      }
    }

    // Check for reservation conflicts (if dates or vehicleId are updated)
    if (
      validatedData.startDate ||
      validatedData.endDate ||
      validatedData.vehicleId
    ) {
      const conflict = await prismaClient.reservation.findFirst({
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
    const updatedReservation = await prismaClient.reservation.update({
      where: { id },
      data: {
        ...validatedData,
        startDate: validatedData.startDate
          ? new Date(validatedData.startDate)
          : undefined,
        endDate: validatedData.endDate
          ? new Date(validatedData.endDate)
          : undefined,
      },
      include: { vehicle: true },
    });

    // Handle vehicle status update based on reservation status
    const currentVehicleId = validatedData.vehicleId || existingReservation.vehicleId;
    const newStatus = validatedData.status || existingReservation.status;
    
    // If status is CANCELED or PENDING, check if we need to update vehicle status
    if (newStatus === "CANCELED" || newStatus === "PENDING") {
      // First, check if there are any other active reservations for this vehicle
      const otherActiveReservations = await prismaClient.reservation.findFirst({
        where: {
          vehicleId: currentVehicleId,
          id: { not: id }, // Exclude the current reservation
          status: "CONFIRMED", // Look for CONFIRMED status
        },
      });

      // If no other active reservations, set vehicle to AVAILABLE
      if (!otherActiveReservations) {
        console.log(`Updating vehicle ${currentVehicleId} to AVAILABLE status`);
        await prismaClient.vehicle.update({
          where: { id: currentVehicleId },
          data: { status: "AVAILABLE" },
        });
      }
    } 
    // If status is CONFIRMED, set vehicle to RENTED
    else if (newStatus === "CONFIRMED") {
      console.log(`Updating vehicle ${currentVehicleId} to RENTED status`);
      await prismaClient.vehicle.update({
        where: { id: currentVehicleId },
        data: { status: "RENTED" },
      });
    }

    res.status(200).json({
      message: "Reservation updated successfully",
      reservation: updatedReservation,
    });
  } catch (error: unknown) {
    console.error("Update reservation error:", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation failed",
        errors: error.errors.map((err) => ({
          field: err.path[0],
          message: err.message,
        })),
      });
      return;
    }

    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      res.status(400).json({ message: "Foreign key constraint failed" });
      return;
    }

    res.status(500).json({
      message: "Something went wrong",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * @desc Get all Reservations
 * @route GET /api/reservations
 * @method GET
 * @access protected
 */
export const getAllReservations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const reservations = await prismaClient.reservation.findMany({
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
  } catch (error) {
    console.error("Get all reservations error:", error);
    res.status(500).json({
      message: "Failed to fetch reservations",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * @desc Get a single Reservation
 * @route GET /api/reservations/:id
 * @method GET
 * @access protected
 */
export const getOneReservation = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid reservation ID" });
    return;
  }

  try {
    const reservation = await prismaClient.reservation.findUnique({
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
  } catch (error) {
    console.error("Get one reservation error:", error);
    res.status(500).json({
      message: "Failed to fetch reservation",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * @desc Delete a Reservation
 * @route DELETE /api/reservations/:id
 * @method DELETE
 * @access protected
 */
export const deleteReservation = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid reservation ID" });
    return;
  }

  try {
    const existing = await prismaClient.reservation.findUnique({
      where: { id },
    });

    if (!existing) {
      res.status(404).json({ message: "Reservation not found" });
      return;
    }

    // Delete the reservation
    await prismaClient.reservation.delete({
      where: { id },
    });

    // Check if there are any other active reservations for this vehicle
    const activeReservations = await prismaClient.reservation.findFirst({
      where: {
        vehicleId: existing.vehicleId,
        status: { in: ["CONFIRMED"] },
      },
    });

    // If no other active reservations, update vehicle status to AVAILABLE
    if (!activeReservations) {
      await prismaClient.vehicle.update({
        where: { id: existing.vehicleId },
        data: { status: "AVAILABLE" },
      });
    }

    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    console.error("Delete reservation error:", error);
    res.status(500).json({
      message: "Failed to delete reservation",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * @desc Delete all Reservations
 * @route DELETE /api/reservations
 * @method DELETE
 * @access protected
 */
export const deleteAllReservations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await prismaClient.reservation.deleteMany();

    // Reset all vehicle statuses to AVAILABLE
    await prismaClient.vehicle.updateMany({
      data: { status: "AVAILABLE" },
    });

    res.status(200).json({
      message: "All reservations deleted successfully",
    });
  } catch (error) {
    console.error("Delete all reservations error:", error);
    res.status(500).json({
      message: "Failed to delete all reservations",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};