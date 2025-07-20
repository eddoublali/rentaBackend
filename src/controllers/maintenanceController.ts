import {
  maintenanceSchema,
  maintenanceUpdateSchema,
} from "./../schema/maintenanceSchema";
import { Request, Response } from "express";
import { prismaClient } from "..";
import { z } from "zod";

/**
 * @desc Create a new Maintenance
 * @route POST /api/Maintenance
 * @method POST
 * @access protected
 */
export const createMaintenance = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Validate request body using Zod
    const validatedData = maintenanceSchema.parse(req.body);

    // Create the maintenance record in the database using Prisma
    const newMaintenance = await prismaClient.maintenance.create({
      data: validatedData,
    });

    res.status(201).json({
      message: "Maintenance created successfully.",
      data: newMaintenance,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // If Zod validation fails,  the errors
      res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      });
    }
    res.status(500).json({
      message: "Server error.",
      error: error,
    });
  }
};

/**
 * @desc Update an existing Maintenance
 * @route PUT /api/Maintenance/:id
 * @method PUT
 * @access protected
 */
export const updateMaintenance = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Validate request body using Zod
    const validatedData = maintenanceUpdateSchema.parse(req.body);

    // Check if maintenance exists in the database
    const existingMaintenance = await prismaClient.maintenance.findUnique({
      where: { id: Number(id) },
    });

    if (!existingMaintenance) {
      res.status(404).json({ message: "Maintenance not found." });
    }

    // Update the maintenance record in the database using Prisma
    const updatedMaintenance = await prismaClient.maintenance.update({
      where: { id: Number(id) },
      data: validatedData,
    });

    res.status(200).json({
      message: "Maintenance updated successfully.",
      data: updatedMaintenance,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // If Zod validation fails,  the errors
      res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
      });
    }
    res.status(500).json({
      message: "Server error.",
      error: error,
    });
  }
};

/**
 * @desc Get all Maintenances
 * @route GET /api/Maintenance
 * @method GET
 * @access protected
 */
export const getAllMaintenances = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const maintenances = await prismaClient.maintenance.findMany();
    res.status(200).json({
      message: "Maintenances retrieved successfully.",
      data: maintenances,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error.",
      error: error,
    });
  }
};

/**
 * @desc Get a single Maintenance by ID
 * @route GET /api/Maintenance/:id
 * @method GET
 * @access protected
 */
export const getOneMaintenance = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    
    const maintenance = await prismaClient.maintenance.findUnique({
      where: { id: Number(id) },
    });
    console.log("Fetching maintenance ID:", id);
    console.log("Found maintenance:", maintenance);
    
    if (!maintenance) {
       res.status(404).json({ message: "Maintenance not found." });
    }
    
    res.status(200).json({
      message: "Maintenance retrieved successfully.",
      data: maintenance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error.",
      error: error,
    });
  }
};

/**
 * @desc Delete a single Maintenance by ID
 * @route DELETE /api/Maintenance/:id
 * @method DELETE
 * @access protected
 */
export const deleteMaintenance = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedMaintenance = await prismaClient.maintenance.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({
      message: "Maintenance deleted successfully.",
      data: deletedMaintenance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error.",
      error: error,
    });
  }
};
