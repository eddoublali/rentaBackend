import { infractionSchema, infractionUpdateSchema } from './../schema/infractiontValidation';
import { Request, Response } from 'express';
import { prismaClient } from '../app';
import { z } from 'zod';

/**
 * @desc Create a new infraction
 * @route POST /api/infraction
 * @method POST
 * @access protected
 */
export const createInfraction = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate the request body
    const validatedInfraction = infractionSchema.parse(req.body);

    // Check if the related vehicle exists
    const vehicleExists = await prismaClient.vehicle.findUnique({
      where: { id: validatedInfraction.vehicleId },
    });

    if (!vehicleExists) {
      res.status(404).json({ message: 'Vehicle not found' });
      return;
    }

    // Create the new infraction
    const newInfraction = await prismaClient.infraction.create({
      data: validatedInfraction,
    });

    res.status(201).json({
      message: 'Infraction created successfully',
      data: newInfraction,
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation failed', errors: error.errors });
      return;
    }

    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

/**
 * @desc Update an infraction
 * @route PUT /api/infraction/:id
 * @method PUT
 * @access protected
 */
export const updateInfraction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Get the infraction ID from the request parameters
    const documentId = Number(req.params.id);
    if (!documentId) {
      res.status(400).json({ message: 'Invalid Infraction id' });
      return;
    }

    const validatedInfraction = infractionUpdateSchema.parse(req.body);

    // Check if the infraction exists
    const infractionExists = await prismaClient.infraction.findUnique({
      where: { id: Number(id) },
    });

    if (!infractionExists) {
      res.status(404).json({ message: `Infraction with ID ${id} not found` });
      return;
    }

    // Check if the related vehicle exists for update
    if (validatedInfraction.vehicleId) {
      const vehicleExists = await prismaClient.vehicle.findUnique({
        where: { id: validatedInfraction.vehicleId },
      });

      if (!vehicleExists) {
        res.status(404).json({ message: 'Vehicle not found for update' });
        return;
      }
    }

    // Update the infraction in the database
    const updatedInfraction = await prismaClient.infraction.update({
      where: { id: Number(id) },
      data: validatedInfraction,
    });

    res.status(200).json({
      message: 'Infraction updated successfully',
      data: updatedInfraction,
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation failed', errors: error.errors });
      return;
    }

    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

/**
 * @desc Get all infractions
 * @route GET /api/infraction
 * @method GET
 * @access public
 */
export const getAllInfractions = async (req: Request, res: Response): Promise<void> => {
  try {
    const infractions = await prismaClient.infraction.findMany();
    res.status(200).json({
      message: 'Infractions retrieved successfully',
      data: infractions,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

/**
 * @desc Get a single infraction by ID
 * @route GET /api/infraction/:id
 * @method GET
 * @access public
 */
export const getOneInfraction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Get the infraction ID from the request parameters
    const documentId = Number(req.params.id);
    if (!documentId) {
      res.status(400).json({ message: 'Invalid Infraction id' });
      return;
    }

    const infraction = await prismaClient.infraction.findUnique({
      where: { id: Number(id) },
    });

    if (!infraction) {
      res.status(404).json({ message: `Infraction with ID ${id} not found` });
      return;
    }

    res.status(200).json({
      message: 'Infraction retrieved successfully',
      data: infraction,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

/**
 * @desc Delete an infraction by ID
 * @route DELETE /api/infraction/:id
 * @method DELETE
 * @access protected
 */
export const deleteInfraction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Get the infraction ID from the request parameters
    const documentId = Number(req.params.id);
    if (!documentId) {
      res.status(400).json({ message: 'Invalid Infraction id' });
      return;
    }

    // Check if the infraction exists
    const infractionExists = await prismaClient.infraction.findUnique({
      where: { id: Number(id) },
    });

    if (!infractionExists) {
      res.status(404).json({ message: `Infraction with ID ${id} not found` });
      return;
    }

    // Delete the infraction
    const deletedInfraction = await prismaClient.infraction.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({
      message: `Infraction with ID ${id} deleted successfully`,
      data: deletedInfraction,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};
/**
 * @desc Delete all infractions
 * @route DELETE /api/infraction
 * @method DELETE
 * @access protected
 */
export const deleteAllInfractions = async (req: Request, res: Response): Promise<void> => {
    try {
      // Delete all infractions from the database
      const deletedInfractions = await prismaClient.infraction.deleteMany();
  
      res.status(200).json({
        message: `All infractions deleted successfully`,
        data: deletedInfractions,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Something went wrong',
      });
    }
  };
