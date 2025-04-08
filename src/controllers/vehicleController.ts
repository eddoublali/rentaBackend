import { Request, Response, NextFunction, RequestHandler } from 'express';
import { prismaClient } from '../app';
import { vehicleSchema, vehicleUpdateSchema } from '../schema/vehicleValidation';
import { z } from 'zod';

/**
 * @desc Create a new vehicle
 * @route POST /api/vehicles
 * @method POST
 * @access protected
 */
export const createVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate the request body using Zod
    const validatedData = vehicleSchema.parse(req.body);

    // Check if a vehicle with the same chassis number or plate number already exists
    const existingVehicle = await prismaClient.vehicle.findFirst({
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
    }

    // Create the vehicle in the database
    const vehicle = await prismaClient.vehicle.create({
      data: validatedData,
    });

    // Send the created vehicle as the response
    res.status(201).json({ message: 'Vehicle created successfully', vehicle });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Invalid vehicle data', errors: error.errors });
      return;
    }

    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
/**
 * @desc Update an existing vehicle
 * @route PUT /api/vehicles/:id
 * @method PUT
 * @access protected
 */
export const updateVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Get the vehicle ID from the URL parameters
    const userId = Number(id);
    if (isNaN(userId)) {
       res.status(400).json({ message: 'Invalid Vehicle ID' });
    }
    // Validate the request body using Zod
    const validatedData = vehicleUpdateSchema.parse(req.body);

    // Find the existing vehicle by ID
    const existingVehicle = await prismaClient.vehicle.findUnique({
      where: { id: userId },
    });

    if (!existingVehicle) {
      res.status(404).json({ message: 'Vehicle not found' });
      return;
    }

    // If chassis number or plate number is changed, check for duplicates
    if (
      existingVehicle.chassisNumber !== validatedData.chassisNumber ||
      existingVehicle.plateNumber !== validatedData.plateNumber
    ) {
      const vehicleWithSameChassisOrPlate = await prismaClient.vehicle.findFirst({
        where: {
          OR: [
            { chassisNumber: validatedData.chassisNumber },
            { plateNumber: validatedData.plateNumber },
          ],
          NOT: {
            id: userId, // Ignore the current vehicle from this check
          },
        },
      });

      if (vehicleWithSameChassisOrPlate) {
        res.status(400).json({
          message: 'A vehicle with the same chassis number or plate number already exists',
        });
        return;
      }
    }

    // Update the vehicle in the database
    const updatedVehicle = await prismaClient.vehicle.update({
      where: { id: userId },
      data: validatedData, // Use validated data for updating
    });

    // Send the updated vehicle as the response
    res.status(200).json({ message: 'Vehicle updated successfully', updatedVehicle });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Handle Zod validation errors
      res.status(400).json({ message: 'Invalid vehicle data', errors: error.errors });
      return;
    }

    // Handle other errors
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
/**
 * @desc GET all vehicles with related data
 * @route GET /api/vehicles
 * @method GET
 * @access protected
 */
export const getAllVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all vehicles with related data
    const vehicles = await prismaClient.vehicle.findMany({
      include: {
        reservations: true, // Include related reservations
        rentals: true,      // Include related rentals
        contracts: true,    // Include related contracts
        infractions: true,  // Include related infractions
      },
    });

    // Send the vehicles as the response
    res.status(200).json({ message: 'Vehicles retrieved successfully', vehicles });
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * @desc Get a vehicle by ID with related data
 * @route GET /api/vehicles/:id
 * @method GET
 * @access protected
 */
export const getVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Get the vehicle ID from the URL parameters
    const userId = Number(id);
    if (isNaN(userId)) {
       res.status(400).json({ message: 'Invalid Vehicle ID' });
    }
    // Find the vehicle with the provided ID and include related data
    const vehicle = await prismaClient.vehicle.findUnique({
      where: {
        id: userId, // Convert the ID to a number
      },
      include: {
        reservations: true, // Include related reservations
        rentals: true,      // Include related rentals
        contracts: true,    // Include related contracts
        infractions: true,  // Include related infractions
      },
    });

    if (!vehicle) {
      // If no vehicle is found, return a 404 error
       res.status(404).json({ message: 'Vehicle not found' });
    }

    // Send the found vehicle with its related data as the response
    res.status(200).json({ message: 'Vehicle found', vehicle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



/**
 * @desc Delete a vehicle by ID with related data
 * @route DELETE /api/vehicles/:id
 * @method DELETE
 * @access protected
 */
export const deleteVehicle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Get the vehicle ID from the URL parameters
    const userId = Number(id);
    if (isNaN(userId)) {
       res.status(400).json({ message: 'Invalid Vehicle ID' });
    }
    // Find the vehicle with the provided ID
    const vehicle = await prismaClient.vehicle.findUnique({
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
    await prismaClient.reservation.deleteMany({
      where: { vehicleId: vehicle?.id },
    });
    await prismaClient.rental.deleteMany({
      where: { vehicleId: vehicle?.id },
    });
    await prismaClient.contract.deleteMany({
      where: { vehicleId: vehicle?.id },
    });
    await prismaClient.infraction.deleteMany({
      where: { vehicleId: vehicle?.id },
    });

    // Delete the vehicle
    await prismaClient.vehicle.delete({
      where: {
        id: userId,
      },
    });

    // Send a success message
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// For the router setup, use this approach
export const createVehicleHandler: RequestHandler = (req, res, next) => {
  createVehicle(req, res).catch(next);
};
