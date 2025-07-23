import { Request, Response, NextFunction, RequestHandler } from 'express';
import { prismaClient } from '..';
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
    
    const validatedData = vehicleSchema.parse(req.body);

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
      return;
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const image = files?.image ? `/uploads/${files.image[0].filename}` : null;
    const registrationCard = files?.registrationCard ? `/uploads/${files.registrationCard[0].filename}` : null;
    const insurance = files?.insurance ? `/uploads/${files.insurance[0].filename}` : null;
    const technicalVisit = files?.technicalVisit ? `/uploads/${files.technicalVisit[0].filename}` : null;
    const authorization = files?.authorization ? `/uploads/${files.authorization[0].filename}` : null;
    const taxSticker = files?.taxSticker ? `/uploads/${files.taxSticker[0].filename}` : null;

    const vehicle = await prismaClient.vehicle.create({
      data: {
        ...validatedData,
        image,
        registrationCard,
        insurance,
        technicalVisit,
        authorization,
        taxSticker,
      },
     
    });
  
    if(!vehicle){
      res.status(404).json({message: 'Failed to create vehicle'});
    }

    res.status(201).json({ message: 'Vehicle created successfully', vehicle });

  } catch (error:any) {
    console.error('Error creating vehicle:', error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        status: 'error',
        message: 'Invalid vehicle data',
        errors: error.errors
      });
    } else if (error.response) {
      res.status(error.response.status).json({
        status: 'error',
        message: error.response.data.message,
        errors: error.response.data.errors || ['Unknown server error']
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error.message
      });
    }
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
    const { id } = req.params;
    const vehicleId = Number(id);

    if (isNaN(vehicleId)) {
      res.status(400).json({ message: 'Invalid Vehicle ID' });
      return;
    }

    const validatedData = vehicleUpdateSchema.parse(req.body);

    const existingVehicle = await prismaClient.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!existingVehicle) {
      res.status(404).json({ message: 'Vehicle not found' });
      return;
    }

    if (
      existingVehicle.chassisNumber !== validatedData.chassisNumber ||
      existingVehicle.plateNumber !== validatedData.plateNumber
    ) {
      const duplicateVehicle = await prismaClient.vehicle.findFirst({
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

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const image = files?.image?.[0]?.filename ? `/uploads/${files.image[0].filename}` : existingVehicle.image;
    const registrationCard = files?.registrationCard?.[0]?.filename
      ? `/uploads/${files.registrationCard[0].filename}`
      : existingVehicle.registrationCard;
    const insurance = files?.insurance?.[0]?.filename
      ? `/uploads/${files.insurance[0].filename}`
      : existingVehicle.insurance;
    const technicalVisit = files?.technicalVisit?.[0]?.filename
      ? `/uploads/${files.technicalVisit[0].filename}`
      : existingVehicle.technicalVisit;
    const authorization = files?.authorization?.[0]?.filename
      ? `/uploads/${files.authorization[0].filename}`
      : existingVehicle.authorization;
    const taxSticker = files?.taxSticker?.[0]?.filename
      ? `/uploads/${files.taxSticker[0].filename}`
      : existingVehicle.taxSticker;

    const updatedVehicle = await prismaClient.vehicle.update({
      where: { id: vehicleId },
      data: {
        ...validatedData,
        image,
        registrationCard,
        insurance,
        technicalVisit,
        authorization,
        taxSticker,
      },
    });

    res.status(200).json({ message: 'Vehicle updated successfully', vehicle: updatedVehicle });

  } catch (error) {
    console.error('Update vehicle error:', error);

    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: 'Invalid vehicle data',
        errors: error.errors,
      });
    } else {
      res.status(500).json({
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
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
    const vehicles = await prismaClient.vehicle.findMany({
      include: {
        reservations: true, 
        contracts: true,    
        infractions: true, 
        accidents:true, 
      },
    });

    res.status(200).json({ message: 'Vehicles retrieved successfully', vehicles });
  } catch (error) {
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
    const { id } = req.params; 
    const userId = Number(id);
    if (isNaN(userId)) {
       res.status(400).json({ message: 'Invalid Vehicle ID' });
    }
    
    const vehicle = await prismaClient.vehicle.findUnique({
      where: {
        id: userId, 
      },
      include: {
        reservations: true,
        contracts: true,  
        infractions: true,
        accidents:true, 
      },
    });

    if (!vehicle) {
    
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

/**
 * @desc Get available vehicles for a given date range
 * @route GET /api/vehicles/available
 * @method GET
 * @access protected
 */
export const getAvailableVehicles = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    // Validate query parameters
    if (!startDate || !endDate) {
      res.status(400).json({ message: 'startDate and endDate are required' });
      return;
    }

    // Parse and validate dates
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({ message: 'Invalid date format' });
      return;
    }

    if (start >= end) {
      res.status(400).json({ message: 'startDate must be before endDate' });
      return;
    }

    // Fetch vehicles with status AVAILABLE and no conflicting reservations
    const availableVehicles = await prismaClient.vehicle.findMany({
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
  } catch (error) {
    console.error('Error fetching available vehicles:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// controllers/vehicleController.ts

export const getRentedVehiclesWithContracts = async (req: Request, res: Response) => {
  try {
    const rentals = await prismaClient.contract.findMany({
      where: {
        // Optional: filter active contracts only
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      },
      include: {
        vehicle: true,
        client: true,
      },
    });

    const calendarEvents = rentals.map(rental => ({
      id: rental.id,
      title: `${rental.vehicle.brand} ${rental.vehicle.model}`,
      start: rental.startDate,
      end: rental.endDate,
      location: rental.deliveryLocation,
      vehicleId: rental.vehicleId,
      clientName: `${rental.client.name} ${rental.client.Lastname}`,
    }));

    res.status(200).json({ events: calendarEvents });
  } catch (error) {
    console.error("Error fetching rentals:", error);
    res.status(500).json({ message: "Failed to fetch rental data" });
  }
};



// For the router setup, use this approach
export const createVehicleHandler: RequestHandler = (req, res, next) => {
  createVehicle(req, res).catch(next);
};


