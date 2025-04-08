import { reservationSchema, reservationUpdateSchema } from './../schema/reservationValidation'; // Adjust path if necessary
import { Request, Response } from 'express';
import { prismaClient } from '../app';
import { z } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

/**
 * @desc Create a new Reservation
 * @route POST /api/reservation
 * @method POST
 * @access protected
 */
export const createReservation = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate the request body using the reservationSchema
    const validatedReservation = reservationSchema.parse(req.body);

    // Check if the vehicle exists
    const vehicle = await prismaClient.vehicle.findUnique({
      where: { id: validatedReservation.vehicleId },
    });

    if (!vehicle) {
       res.status(400).json({ message: 'Vehicle not found.' });
    }

    // Check if the client exists
    const client = await prismaClient.client.findUnique({
      where: { id: validatedReservation.clientId },
    });

    if (!client) {
       res.status(400).json({ message: 'Client not found.' });
    }


    // Check if the vehicle is already reserved during the requested period
    const existingReservation = await prismaClient.reservation.findFirst({
      where: {
        vehicleId: validatedReservation.vehicleId,
        OR: [
          {
            startDate: { lt: validatedReservation.endDate },
            endDate: { gt: validatedReservation.startDate },
          },
        ],
      },
    });

    if (existingReservation) {
       res.status(400).json({
        message: 'The vehicle is already reserved for the requested period.',
      });
    }

    // Create the reservation in the database
    const newReservation = await prismaClient.reservation.create({
        data: { ...validatedReservation },
    });

    // Send response with the created reservation data
    res.status(201).json({
      message: 'Reservation created successfully',
      reservation: newReservation,
    });

  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      // Return validation errors to the user
      res.status(400).json({
        message: 'Validation failed',
        errors: error.errors.map((err) => ({
          field: err.path[0], // The field causing the error (e.g., "vehicleId")
          message: err.message, // The validation error message (e.g., "Expected number, received string")
        })),
      });
      return;
    }
  
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2003') {
      res.status(400).json({ message: 'Foreign key constraint failed', error });
      return;
    }
  
    // General error handler
    res.status(500).json({ message: 'Something went wrong', error: error instanceof Error ? error.message : 'Unknown error' });
  }
  
};


/**
 * @desc Update a Reservation
 * @route PUT /api/reservation/:id
 * @method PUT
 * @access protected
 */
export const updateReservation = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  const userId = Number(id);

  if (isNaN(userId)) {
    res.status(400).json({ message: 'Invalid reservation ID' });
    return;
  }

  try {
    // Validate request body
    const validatedData = reservationUpdateSchema.parse(req.body);

    // Check if reservation exists
    const existingReservation = await prismaClient.reservation.findUnique({
      where: { id: userId },
    });

    if (!existingReservation) {
      res.status(404).json({ message: 'Reservation not found.' });
      return;
    }

    // Check if vehicle exists (if updated)
    if (validatedData.vehicleId) {
      const vehicle = await prismaClient.vehicle.findUnique({
        where: { id: validatedData.vehicleId },
      });
      if (!vehicle) {
        res.status(400).json({ message: 'Vehicle not found.' });
        return;
      }
    }

    // Check if client exists (if updated)
    if (validatedData.clientId) {
      const client = await prismaClient.client.findUnique({
        where: { id: validatedData.clientId },
      });
      if (!client) {
        res.status(400).json({ message: 'Client not found.' });
        return;
      }
    }

    // Check for reservation conflict
    if (validatedData.startDate && validatedData.endDate && validatedData.vehicleId) {
      const conflict = await prismaClient.reservation.findFirst({
        where: {
          id: { not: userId }, // exclude current
          vehicleId: validatedData.vehicleId,
          OR: [
            {
              startDate: { lt: validatedData.endDate },
              endDate: { gt: validatedData.startDate },
            },
          ],
        },
      });

      if (conflict) {
        res.status(400).json({
          message: 'The vehicle is already reserved for the requested period.',
        });
        return;
      }
    }

    // Update reservation
    const updatedReservation = await prismaClient.reservation.update({
      where: { id: userId },
      data: validatedData,
    });

    res.status(200).json({
      message: 'Reservation updated successfully',
      reservation: updatedReservation,
    });

  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      // Return validation errors to the user
      res.status(400).json({
        message: 'Validation failed',
        errors: error.errors.map((err) => ({
          field: err.path[0], // The field causing the error (e.g., "vehicleId")
          message: err.message, // The validation error message (e.g., "Expected number, received string")
        })),
      });
      return;
    }
  
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2003') {
      res.status(400).json({ message: 'Foreign key constraint failed', error });
      return;
    }
  
    // General error handler
    res.status(500).json({ message: 'Something went wrong', error: error instanceof Error ? error.message : 'Unknown error' });
  }
};


export const getAllReservations = async (req: Request, res: Response): Promise<void> => {
    try {
      const reservations = await prismaClient.reservation.findMany({
        include: {
          vehicle: true,
          client: true,
          secondClient: true,
          payment: true,
          invoices: true,
        },
      });
  
      res.status(200).json({
        message: 'Reservations fetched successfully',
        reservations,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to fetch reservations',
        error,
      });
    }
  };


  export const getOneReservation = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
  
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid reservation ID' });
      return;
    }
  
    try {
      const reservation = await prismaClient.reservation.findUnique({
        where: { id },
        include: {
          vehicle: true,
          client: true,
          secondClient: true,
          payment: true,
          invoices: true,
        },
      });
  
      if (!reservation) {
        res.status(404).json({ message: 'Reservation not found' });
        return;
      }
  
      res.status(200).json({
        message: 'Reservation fetched successfully',
        reservation,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to fetch reservation',
        error,
      });
    }
  };
  export const deleteReservation = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
  
    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid reservation ID' });
      return;
    }
  
    try {
      const existing = await prismaClient.reservation.findUnique({ where: { id } });
  
      if (!existing) {
        res.status(404).json({ message: 'Reservation not found' });
        return;
      }
  
      await prismaClient.reservation.delete({
        where: { id },
      });
  
      res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to delete reservation',
        error,
      });
    }
  };
  export const deleteAllReservations = async (req: Request, res: Response): Promise<void> => {
    try {
      await prismaClient.reservation.deleteMany();
  
      res.status(200).json({
        message: 'All reservations deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to delete all reservations',
        error,
      });
    }
  };    
