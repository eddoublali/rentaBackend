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
    // Validate and parse the request body using the clientSchema
    const validatedClient = clientSchema.parse(req.body);

    // Check if the email already exists in the database
    const existingClient = await prismaClient.client.findUnique({
      where: { email: validatedClient.email },
      
    });

    if (existingClient) {
       res.status(400).json({
        message: 'Client with this email already exists',
      });
    }

    // Create the client in the database using Prisma
    const client = await prismaClient.client.create({
      data: {
        ...validatedClient,
      },
    });

    // Respond with the created client data
    res.status(201).json({ message: 'Client created successfully', client });
  } catch (error) {
    // If validation fails, send a response with validation errors
    if (error instanceof z.ZodError) {
       res.status(400).json({ message: 'Validation failed', errors: error.errors });
    }

    // Handle other unexpected errors
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
      const { id } = req.params; // Get the client ID from the URL parameters
      const userId = Number(id);
      if (isNaN(userId)) {
         res.status(400).json({ message: 'Invalid Client ID' });
      }
  
      // Validate and parse the request body using the clientSchema
      const validatedClient = clientUpdateSchema.parse(req.body);
  
      // Check if the client exists in the database
      const existingClient = await prismaClient.client.findUnique({
        where: { id: userId  },
      });
  
      if (!existingClient) {
        res.status(404).json({
          message: 'Client not found',
        });
        return;
      }
  
      // Check if the email has been changed and is already in use by another client
      if (existingClient.email !== validatedClient.email) {
        const clientWithEmail = await prismaClient.client.findUnique({
          where: { email: validatedClient.email },
        });
  
        if (clientWithEmail) {
          res.status(400).json({
            message: 'Client with this email already exists',
          });
          return;
        }
      }
  
      // Update the client in the database using Prisma
      const updatedClient = await prismaClient.client.update({
        where: { id: userId  },
        data: {
          ...validatedClient,
        },
      });
  
      // Respond with the updated client data
      res.status(200).json({ message: 'Client updated successfully', updatedClient });
    } catch (error) {
      // If validation fails, send a response with validation errors
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Validation failed', errors: error.errors });
        return;
      }
  
      // Handle other unexpected errors
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
      // Fetch all clients from the database with related data
      const clients = await prismaClient.client.findMany({
        include: {
          documents: true, // Include related documents
          reservations: true, // Include main reservations
          secondaryReservations: true, // Include secondary reservations
          rentals: true, // Include rentals
          contracts: true, // Include contracts
          invoices: true, // Include invoices
        },
      });
  
      // Respond with the list of clients
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
      const { id } = req.params; // Get the client ID from the URL parameters
      const userId = Number(id);
      if (isNaN(userId)) {
         res.status(400).json({ message: 'Invalid Client ID' });
      }
  
      // Fetch the client from the database by ID with related data
      const client = await prismaClient.client.findUnique({
        where: { id: userId },
        include: {
          documents: true, // Include related documents
          reservations: true, // Include main reservations
          secondaryReservations: true, // Include secondary reservations
          rentals: true, // Include rentals
          contracts: true, // Include contracts
          invoices: true, // Include invoices
        },
      });
  
      if (!client) {
        res.status(404).json({ message: 'Client not found' });
        return;
      }
  
      // Respond with the client data
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
      const { id } = req.params; // Get the client ID from the URL parameters
      const userId = Number(id);
      if (isNaN(userId)) {
         res.status(400).json({ message: 'Invalid Client ID' });
      }
  
      // Check if the client exists in the database
      const existingClient = await prismaClient.client.findUnique({
        where: { id: userId },
      });
  
      if (!existingClient) {
        res.status(404).json({ message: 'Client not found' });
        return;
      }
  
      // Delete the client from the database
      await prismaClient.client.delete({
        where: { id: userId },
      });
  
      // Respond with a success message
      res.status(200).json({ message: 'Client deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  