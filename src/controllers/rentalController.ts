import { rentalSchema, rentalUpdateSchema } from './../schema/rentalValidation';
import { Request, Response } from 'express';
import { prismaClient } from '../app';
import { z } from 'zod';

/**
 * @desc Create a new rental
 * @route POST /api/rental
 */
export const createRental = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedRental = rentalSchema.parse(req.body);

    // Check if vehicle and client exist
    const [vehicle, client] = await Promise.all([
      prismaClient.vehicle.findUnique({ where: { id: validatedRental.vehicleId } }),
      prismaClient.client.findUnique({ where: { id: validatedRental.clientId } }),
    ]);

    if (!vehicle || !client) {
      res.status(404).json({ message: 'Vehicle or Client not found' });
      return;
    }

    const newRental = await prismaClient.rental.create({
      data: validatedRental,
    });

    res.status(201).json({ message: 'Rental created successfully', data: newRental });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation failed', errors: error.errors });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
};

/**
 * @desc Get all rentals
 * @route GET /api/rental
 */
export const getAllRentals = async (_req: Request, res: Response): Promise<void> => {
  try {
    const rentals = await prismaClient.rental.findMany({
      include: { vehicle: true, client: true },
    });
    res.status(200).json({ message: 'Rentals retrieved successfully', data: rentals });
  } catch {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

/**
 * @desc Get one rental
 * @route GET /api/rental/:id
 */
export const getOneRental = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (!id) {
    res.status(400).json({ message: 'Invalid rental ID' });
    return;
  }

  try {
    const rental = await prismaClient.rental.findUnique({
      where: { id },
      include: { vehicle: true, client: true },
    });

    if (!rental) {
      res.status(404).json({ message: 'Rental not found' });
      return;
    }

    res.status(200).json({ message: 'Rental retrieved successfully', data: rental });
  } catch {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

/**
 * @desc Update a rental
 * @route PUT /api/rental/:id
 */
export const updateRental = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (!id) {
    res.status(400).json({ message: 'Invalid rental ID' });
    return;
  }

  try {
    const validatedRental = rentalUpdateSchema.parse(req.body);

    const rentalExists = await prismaClient.rental.findUnique({ where: { id } });
    if (!rentalExists) {
      res.status(404).json({ message: 'Rental not found' });
      return;
    }

    const updatedRental = await prismaClient.rental.update({
      where: { id },
      data: validatedRental,
    });

    res.status(200).json({ message: 'Rental updated successfully', data: updatedRental });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation failed', errors: error.errors });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
};

/**
 * @desc Delete one rental
 * @route DELETE /api/rental/:id
 */
export const deleteRental = async (req: Request, res: Response): Promise<void> => {
  const id = Number(req.params.id);
  if (!id) {
    res.status(400).json({ message: 'Invalid rental ID' });
    return;
  }

  try {
    const rentalExists = await prismaClient.rental.findUnique({ where: { id } });
    if (!rentalExists) {
      res.status(404).json({ message: 'Rental not found' });
      return;
    }

    const deletedRental = await prismaClient.rental.delete({ where: { id } });
    res.status(200).json({ message: 'Rental deleted successfully', data: deletedRental });
  } catch {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

/**
 * @desc Delete all rentals
 * @route DELETE /api/rental
 */
export const deleteAllRentals = async (_req: Request, res: Response): Promise<void> => {
  try {
    await prismaClient.rental.deleteMany();
    res.status(200).json({ message: 'All rentals deleted successfully' });
  } catch {
    res.status(500).json({ message: 'Something went wrong' });
  }
};
