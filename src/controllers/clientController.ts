import { clientSchema,clientUpdateSchema} from './../schema/clientValidation'; 
import { Request, Response } from 'express';
import { prismaClient } from '../app';
import { z } from 'zod';

/**
 * @desc Create a new client
 * @route POST /api/clients
 * @method POST
 * @access protected
 */
export const createClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedClient = clientSchema.parse(req.body);

    const existingClient = await prismaClient.client.findUnique({
      where: { email: validatedClient.email },
    });

    if (existingClient) {
      res.status(400).json({ message: 'Client with this email already exists' });
      return;
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const cinimage = files?.cinimage ? `/uploads/${files.cinimage[0].filename}` : '';
    const licenseimage = files?.licenseimage ? `/uploads/${files.licenseimage[0].filename}` : '';

    const client = await prismaClient.client.create({
      data: {
        ...validatedClient,
        cinimage,
        licenseimage,
      },
    });

    res.status(201).json({ message: 'Client created successfully', client });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation failed', errors: error.errors });
      return;
    }

    res.status(500).json({ message: 'Something went wrong', error });
  }
};


/**
 * @desc Update an existing client
 * @route PUT /api/clients/:id
 * @method PUT
 * @access protected
 */
export const updateClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = Number(id);
    if (isNaN(userId)) {
      res.status(400).json({ message: 'Invalid Client ID' });
      return;
    }
    if (req.body.blacklisted) {
      // Parse the string to boolean
      req.body.blacklisted = req.body.blacklisted === 'true' || req.body.blacklisted === '1';
    }

    const validatedClient = clientUpdateSchema.parse(req.body);

    const existingClient = await prismaClient.client.findUnique({
      where: { id: userId },
    });

    if (!existingClient) {
      res.status(404).json({ message: 'Client not found' });
      return;
    }

    if (existingClient.email !== validatedClient.email) {
      const clientWithEmail = await prismaClient.client.findUnique({
        where: { email: validatedClient.email },
      });

      if (clientWithEmail) {
        res.status(400).json({ message: 'Client with this email already exists' });
        return;
      }
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const cinimage = files?.cinimage ? `/uploads/${files.cinimage[0].filename}` : existingClient.cinimage;
    const licenseimage = files?.licenseimage ? `/uploads/${files.licenseimage[0].filename}` : existingClient.licenseimage;

    const updatedClient = await prismaClient.client.update({
      where: { id: userId },
      data: {
        ...validatedClient,
        cinimage,
        licenseimage,
        blacklisted: validatedClient.blacklisted
      },
    });
   

    res.status(200).json({ message: 'Client updated successfully', updatedClient });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation failed', errors: error.errors });
      return;
    }

    res.status(500).json({ message: 'Something went wrong', error });
  }
};

/**
 * @desc Get all clients
 * @route GET /api/clients
 * @method GET
 * @access protected
 */
export const getAllClients = async (req: Request, res: Response): Promise<void> => {
    try {
      const clients = await prismaClient.client.findMany({
        include: {
          documents: true, 
          infractions:true,
          reservations: true, 
          secondaryReservations: true, 
          contracts: true, 
          invoices: true, 
          accidents:true,
        },
      });
  
      res.status(200).json({ message: 'Clients fetched successfully', clients });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
/**
 * @desc Get client by ID
 * @route GET /api/clients/:id
 * @method GET
 * @access protected
 */
export const getClientById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = Number(id);
      if (isNaN(userId)) {
         res.status(400).json({ message: 'Invalid Client ID' });
      }
  
      
      const client = await prismaClient.client.findUnique({
        where: { id: userId },
        include: {
          documents: true, 
          infractions:true,
          reservations: true, 
          secondaryReservations: true,        
          contracts: true, 
          invoices: true, 
          accidents:true,
        },
      });
  
      if (!client) {
        res.status(404).json({ message: 'Client not found' });
        return;
      }
  
      res.status(200).json({ message: 'Client fetched successfully', client });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  /**
 * @desc Delete client by ID
 * @route DELETE /api/clients/:id
 * @method DELETE
 * @access protected
 */
export const deleteClient = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params; 
      const userId = Number(id);
      if (isNaN(userId)) {
         res.status(400).json({ message: 'Invalid Client ID' });
      }
  
      const existingClient = await prismaClient.client.findUnique({
        where: { id: userId },
      });
  
      if (!existingClient) {
        res.status(404).json({ message: 'Client not found' });
        return;
      }
  
      await prismaClient.client.delete({
        where: { id: userId },
      });
  
      res.status(200).json({ message: 'Client deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  