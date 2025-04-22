import { Request, Response } from 'express';
import { prismaClient } from '../app';
import { accidentSchema, accidentUpdateSchema } from './../schema/accidentValidation';
import { ZodError } from 'zod';

/**
 * @desc Create a new accident
 * @route POST /api/accidents
 * @method POST
 * @access protected
 */
export const createAccident = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = accidentSchema.parse(req.body);
    
    // Handle damage photo uploads
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    // Convert array of photo paths to JSON string to store in database
    let photosJson: string | null = null;
    if (files?.damagePhotos && files.damagePhotos.length > 0) {
      const photosPaths = files.damagePhotos.map(file => `/uploads/${file.filename}`);
      photosJson = JSON.stringify(photosPaths);
    } else if (validatedData.damagePhotos) {
      // If client sent photos as string, use that
      photosJson = typeof validatedData.damagePhotos === 'string' 
        ? validatedData.damagePhotos 
        : JSON.stringify(validatedData.damagePhotos);
    }

    const accident = await prismaClient.accident.create({
      data: {
        vehicleId: validatedData.vehicleId,
        clientId: validatedData.clientId,
        accidentDate: new Date(validatedData.accidentDate),
        location: validatedData.location,
        description: validatedData.description,
        repairCost: validatedData.repairCost,
        fault: validatedData.fault,
        damagePhotos: photosJson,
        status: validatedData.status,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Accident created successfully',
      data: accident,
    });
  } catch (error) {
    if (error instanceof ZodError) {
       res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
      return;
    }
    
    console.error('Create accident error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create accident',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * @desc Update an accident by ID
 * @route PUT /api/accidents/:id
 * @method PUT
 * @access protected
 */
export const updateAccident = async (req: Request, res: Response): Promise<void> => {
  try {
    const accidentId = parseInt(req.params.id);
    if (isNaN(accidentId)) {
       res.status(400).json({
        success: false,
        message: 'Invalid accident ID',
      });
      return;
    }

    // Check if accident exists
    const existingAccident = await prismaClient.accident.findUnique({
      where: { id: accidentId },
    });

    if (!existingAccident) {
       res.status(404).json({
        success: false,
        message: 'Accident not found',
      });
      return;
    }

    const validatedData = accidentUpdateSchema.parse(req.body);
    
    // Handle damage photo uploads
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    // Determine what damagePhotos to use - Fix: Add null check
    let photosJson: string | null = existingAccident?.damagePhotos || null;
    
    if (files?.damagePhotos && files.damagePhotos.length > 0) {
      // New photos were uploaded, use these
      const photosPaths = files.damagePhotos.map(file => `/uploads/${file.filename}`);
      photosJson = JSON.stringify(photosPaths);
    } else if (validatedData.damagePhotos !== undefined) {
      // Client sent photos in request body
      photosJson = typeof validatedData.damagePhotos === 'string'
        ? validatedData.damagePhotos
        : validatedData.damagePhotos ? JSON.stringify(validatedData.damagePhotos) : null;
    }

    const updatedAccident = await prismaClient.accident.update({
      where: { id: accidentId },
      data: {
        vehicleId: validatedData.vehicleId,
        clientId: validatedData.clientId,
        accidentDate: validatedData.accidentDate ? new Date(validatedData.accidentDate) : undefined,
        location: validatedData.location,
        description: validatedData.description,
        repairCost: validatedData.repairCost,
        fault: validatedData.fault,
        damagePhotos: photosJson,
        status: validatedData.status,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Accident updated successfully',
      data: updatedAccident,
    });
  } catch (error) {
    if (error instanceof ZodError) {
       res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors,
      });
      return;
    }
    
    console.error('Update accident error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update accident',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * @desc Get all accidents
 * @route GET /api/accidents
 * @method GET
 * @access protected
 */
export const getAllAccidents = async (_req: Request, res: Response): Promise<void> => {
  try {
    const accidents = await prismaClient.accident.findMany({
      include: {
        vehicle: true,
        client: true,
      },
    });

    // Parse damage photos JSON strings to arrays for frontend use
    const formattedAccidents = accidents.map(accident => ({
      ...accident,
      damagePhotos: accident.damagePhotos ? JSON.parse(accident.damagePhotos) : null
    }));

    res.status(200).json({
      success: true,
      count: accidents.length,
      data: formattedAccidents,
    });
  } catch (error) {
    console.error('Get all accidents error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve accidents',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * @desc Get a single accident by ID
 * @route GET /api/accidents/:id
 * @method GET
 * @access protected
 */
export const getOneAccident = async (req: Request, res: Response): Promise<void> => {
  try {
    const accidentId = parseInt(req.params.id);
    if (isNaN(accidentId)) {
       res.status(400).json({
        success: false,
        message: 'Invalid accident ID',
      });
      return;
    }

    const accident = await prismaClient.accident.findUnique({
      where: { id: accidentId },
      include: {
        vehicle: true,
        client: true,
      },
    });

    if (!accident) {
       res.status(404).json({
        success: false,
        message: 'Accident not found',
      });
      return;
    }

    // Parse damage photos JSON string to array for frontend use
    // Fix: Only access properties after confirming accident is not null
    const formattedAccident = {
      ...accident,
      damagePhotos: accident?.damagePhotos ? JSON.parse(accident.damagePhotos) : null
    };

    res.status(200).json({
      success: true,
      data: formattedAccident,
    });
  } catch (error) {
    console.error('Get accident error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve accident',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * @desc Delete all accidents
 * @route DELETE /api/accidents
 * @method DELETE
 * @access protected
 */
export const deleteAllAccidents = async (_req: Request, res: Response): Promise<void> => {
  try {
    await prismaClient.accident.deleteMany({});

    res.status(200).json({
      success: true,
      message: 'All accidents deleted successfully',
    });
  } catch (error) {
    console.error('Delete all accidents error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete accidents',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * @desc Delete an accident by ID
 * @route DELETE /api/accidents/:id
 * @method DELETE
 * @access protected
 */
export const deleteAccidentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const accidentId = parseInt(req.params.id);
    if (isNaN(accidentId)) {
       res.status(400).json({
        success: false,
        message: 'Invalid accident ID',
      });
      return;
    }

    // Check if accident exists
    const existingAccident = await prismaClient.accident.findUnique({
      where: { id: accidentId },
    });

    if (!existingAccident) {
       res.status(404).json({
        success: false,
        message: 'Accident not found',
      });
      return;
    }

    await prismaClient.accident.delete({
      where: { id: accidentId },
    });

    res.status(200).json({
      success: true,
      message: 'Accident deleted successfully',
    });
  } catch (error) {
    console.error('Delete accident error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete accident',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};