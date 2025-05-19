import { Request, Response } from 'express';
import { prismaClient } from '../app';
import { agencySchema, agencyUpdateSchema } from '../schema/agencyValidation';
import { ZodError } from 'zod';

/**
 * @desc Create a new agency (singleton with ID 1)
 * @route POST /api/agencies
 * @access Protected
 */
export const createAgency = async (req: Request, res: Response): Promise<void> => {
  try {
    const existingAgency = await prismaClient.agency.findUnique({ where: { id: 1 } });

    if (existingAgency) {
       res.status(400).json({
        message: "Agency already exists. Use the update endpoint instead.",
      });
    }

    const validated = agencySchema.parse(req.body);
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const logo = files?.logo?.[0]?.filename ? `/uploads/${files.logo[0].filename}` : null;

    const agency = await prismaClient.agency.create({
      data: { id: 1, ...validated, logo },
    });

    res.status(201).json({ data: agency });
  } catch (error) {
    if (error instanceof ZodError) {
       res.status(400).json({ message: error.errors.map(e => e.message).join(", ") });
    }
    console.error("Error creating agency:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc Update agency (always ID 1)
 * @route PUT /api/agencies/1
 * @access Protected
 */
export const updateAgency = async (req: Request, res: Response): Promise<void> => {
  try {
    const agency = await prismaClient.agency.findUnique({ where: { id: 1 } });

    if (!agency) {
       res.status(404).json({ message: "Agency not found" });
    }

    const validated = agencyUpdateSchema.parse(req.body);
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const logo = files?.logo?.[0]?.filename ? `/uploads/${files.logo[0].filename}` : agency?.logo || null;

    const updatedAgency = await prismaClient.agency.update({
      where: { id: 1 },
      data: { ...validated, logo },
    });

    res.status(200).json({ data: updatedAgency });
  } catch (error) {
    if (error instanceof ZodError) {
       res.status(400).json({ message: error.errors.map(e => e.message).join(", ") });
    }
    console.error("Error updating agency:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc Get agency by ID (always 1)
 * @route GET /api/agencies
 * @access Protected
 */
export const getAgency = async (req: Request, res: Response): Promise<void> => {
  try {
    const agency = await prismaClient.agency.findUnique({ where: { id: 1 } });

    if (!agency) {
       res.status(404).json({ message: "Agency not found" });
    }

    res.status(200).json({ data: agency });
  } catch (error) {
    console.error("Error fetching agency:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @desc Delete agency (only ID 1)
 * @route DELETE /api/agencies/1
 * @access Protected
 */
export const deleteAgency = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (id !== '1') {
       res.status(400).json({ message: "Only agency with ID 1 can be deleted" });
    }

    const agency = await prismaClient.agency.findUnique({ where: { id: 1 } });
    if (!agency) {
       res.status(404).json({ message: "Agency not found" });
    }

    await prismaClient.agency.delete({ where: { id: 1 } });
    res.status(200).json({ message: "Agency deleted successfully" });
  } catch (error) {
    console.error("Error deleting agency:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
