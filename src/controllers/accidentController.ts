import { Request, Response } from 'express';
import { prismaClient } from '../app';
import { accidentSchema, accidentUpdateSchema, AccidentStatusEnum, FaultTypeEnum } from '../schema/accidentValidation';
import { ZodError } from 'zod';

// Types for better type safety
type AccidentRequestFiles = { damagePhotos?: Express.Multer.File[] };
type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
  count?: number;
};

// Helper functions to reduce code duplication
const sendResponse = <T>(res: Response, status: number, response: ApiResponse<T>): void => {
  res.status(status).json(response);
};

const handleError = (res: Response, error: unknown): void => {
  console.error('Accident operation error:', error);
  
  if (error instanceof ZodError) {
    sendResponse(res, 400, {
      success: false,
      message: 'Validation error',
      errors: error.errors,
    });
    return;
  }
  
  sendResponse(res, 500, {
    success: false,
    message: 'Operation failed',
    errors: error instanceof Error ? error.message : 'Unknown error',
  });
};

const processDamagePhotos = (files: AccidentRequestFiles | undefined, inputPhotos?: string | string[] | null): string | null => {
  // Case 1: New photos uploaded
  if (files?.damagePhotos && files.damagePhotos.length > 0) {
    const photosPaths = files.damagePhotos.map(file => `/uploads/${file.filename}`);
    return JSON.stringify(photosPaths);
  }
  
  // Case 2: Photos passed in request body
  if (inputPhotos) {
    if (typeof inputPhotos === 'string') {
      // Either already JSON string or single photo path
      try {
        // Check if it's a valid JSON
        JSON.parse(inputPhotos);
        return inputPhotos;
      } catch {
        // Not valid JSON, treat as single photo path
        return JSON.stringify([inputPhotos]);
      }
    }
    // Array of photos
    return JSON.stringify(inputPhotos);
  }
  
  // Case 3: No photos
  return null;
};

/**
 * @desc Create a new accident
 * @route POST /api/accidents
 * @access protected
 */
export const createAccident = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = accidentSchema.parse(req.body);
    const photosJson = processDamagePhotos(req.files as AccidentRequestFiles, validatedData.damagePhotos);

    const accident = await prismaClient.accident.create({
      data: {
        vehicleId: validatedData.vehicleId,
        clientId: validatedData.clientId ?? null,
        accidentDate: new Date(validatedData.accidentDate),
        location: validatedData.location,
        description: validatedData.description,
        repairCost: validatedData.repairCost,
        fault: validatedData.fault || 'UNKNOWN',
        damagePhotos: photosJson,
        status: validatedData.status || 'REPORTED',
      },
    });

    sendResponse(res, 201, {
      success: true,
      message: 'Accident created successfully',
      data: accident,
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * @desc Update an accident by ID
 * @route PUT /api/accidents/:id
 * @access protected
 */
export const updateAccident = async (req: Request, res: Response): Promise<void> => {
  try {
    const accidentId = parseInt(req.params.id);
    if (isNaN(accidentId)) {
      sendResponse(res, 400, { success: false, message: 'Invalid accident ID' });
      return;
    }

    // Check if accident exists
    const existingAccident = await prismaClient.accident.findUnique({
      where: { id: accidentId },
    });

    if (!existingAccident) {
      sendResponse(res, 404, { success: false, message: 'Accident not found' });
      return;
    }

    const validatedData = accidentUpdateSchema.parse(req.body);
    const photosJson = processDamagePhotos(
      req.files as AccidentRequestFiles, 
      validatedData.damagePhotos ?? existingAccident.damagePhotos
    );

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

    sendResponse(res, 200, {
      success: true,
      message: 'Accident updated successfully',
      data: updatedAccident,
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * @desc Get all accidents
 * @route GET /api/accidents
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

    sendResponse(res, 200, {
        success: true,
        count: accidents.length,
        data: formattedAccidents,
        message: ''
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * @desc Get a single accident by ID
 * @route GET /api/accidents/:id
 * @access protected
 */
export const getOneAccident = async (req: Request, res: Response): Promise<void> => {
  try {
    const accidentId = parseInt(req.params.id);
    if (isNaN(accidentId)) {
      sendResponse(res, 400, { success: false, message: 'Invalid accident ID' });
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
      sendResponse(res, 404, { success: false, message: 'Accident not found' });
      return;
    }

    // Parse damage photos JSON string to array for frontend use
    const formattedAccident = {
      ...accident,
      damagePhotos: accident.damagePhotos ? JSON.parse(accident.damagePhotos) : null
    };

    sendResponse(res, 200, {
        success: true,
        data: formattedAccident,
        message: ''
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * @desc Delete an accident by ID
 * @route DELETE /api/accidents/:id
 * @access protected
 */
export const deleteAccidentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const accidentId = parseInt(req.params.id);
    if (isNaN(accidentId)) {
      sendResponse(res, 400, { success: false, message: 'Invalid accident ID' });
      return;
    }

    // Check if accident exists
    const existingAccident = await prismaClient.accident.findUnique({
      where: { id: accidentId },
    });

    if (!existingAccident) {
      sendResponse(res, 404, { success: false, message: 'Accident not found' });
      return;
    }

    await prismaClient.accident.delete({
      where: { id: accidentId },
    });

    sendResponse(res, 200, {
      success: true,
      message: 'Accident deleted successfully',
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * @desc Delete all accidents
 * @route DELETE /api/accidents
 * @access protected - Requires admin permissions
 */
export const deleteAllAccidents = async (_req: Request, res: Response): Promise<void> => {
  try {
    await prismaClient.accident.deleteMany({});
    sendResponse(res, 200, {
      success: true,
      message: 'All accidents deleted successfully',
    });
  } catch (error) {
    handleError(res, error);
  }
};