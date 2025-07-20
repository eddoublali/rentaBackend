import { invoiceUpdateSchema, invoiceSchema } from './../schema/invoiceValidation';
import { Request, Response } from 'express';
import { prismaClient } from '..';
import { z } from 'zod';

/**
 * @desc Create a new invoice // Factures
 * @route POST /api/invoice // Factures
 * @method POST
 * @access protected
 */
export const createInvoice = async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate the request body with Zod
      const validatedInvoice = invoiceSchema.parse(req.body);
  
      // Check if the related reservation exists
      const reservationExists = await prismaClient.reservation.findUnique({
        where: { id: validatedInvoice.reservationId },
      });
  
      if (!reservationExists) {
        res.status(404).json({ message: 'Reservation not found' });
        return;
      }
  
      // Check if the related client exists
      const clientExists = await prismaClient.client.findUnique({
        where: { id: validatedInvoice.clientId },
      });
  
      if (!clientExists) {
        res.status(404).json({ message: 'Client not found' });
        return;
      }
  
      // Create the new invoice in the database
      const newInvoice = await prismaClient.invoice.create({
        data: validatedInvoice,
      });
  
      res.status(201).json({
        message: 'Invoice created successfully',
        data: newInvoice,
      });
  
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Validation failed', errors: error.errors });
        return;
      }
  
      // Handle other errors
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
        return;
      }
  
      res.status(500).json({
        message: 'Something went wrong',
      });
    }
  };


/**
 * @desc Update an existing invoice
 * @route PUT /api/invoice/:id
 * @method PUT
 * @access protected
 */
export const updateInvoice = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const invoiceId=Number(id)
      if(!invoiceId){
        res.status(400).json({ message: 'Invalid invoice id' });
      }
      
    
      // Validate the request body with Zod
      const validatedInvoice = invoiceUpdateSchema.parse(req.body);
  
      // Check if the reservationId and clientId are provided in the request body
      const reservationId = validatedInvoice.reservationId || req.body.reservationId;
      const clientId = validatedInvoice.clientId || req.body.clientId;
  
      if (!reservationId || !clientId) {
        res.status(400).json({ message: 'reservationId and clientId are required' });
        return;
      }
  
      // Check if the reservation exists
      const reservationExists = await prismaClient.reservation.findUnique({
        where: { id: reservationId },
      });
  
      if (!reservationExists) {
        res.status(404).json({ message: 'Reservation not found' });
        return;
      }
  
      // Check if the client exists
      const clientExists = await prismaClient.client.findUnique({
        where: { id: clientId },
      });
  
      if (!clientExists) {
        res.status(404).json({ message: 'Client not found' });
        return;
      }
  
      // Check if the invoice exists
      const invoiceExists = await prismaClient.invoice.findUnique({
        where: { id: Number(id) },
      });
  
      if (!invoiceExists) {
        res.status(404).json({ message: 'Invoice not found' });
        return;
      }
  
      // Update the invoice in the database
      const updatedInvoice = await prismaClient.invoice.update({
        where: { id: Number(id) },
        data: validatedInvoice,
      });
  
      res.status(200).json({
        message: 'Invoice updated successfully',
        data: updatedInvoice,
      });
  
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Validation failed', errors: error.errors });
        return;
      }
  
      // Handle other errors
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
        return;
      }
  
      res.status(500).json({
        message: 'Something went wrong',
      });
    }
  };

  /**
 * @desc Get all invoices
 * @route GET /api/invoice
 * @method GET
 * @access protected
 */
export const getAllInvoices = async (req: Request, res: Response): Promise<void> => {
    try {
      // Fetch all invoices from the database
      const invoices = await prismaClient.invoice.findMany({
        include: {
          reservation: true, // You can include related fields like reservation
          client: true, // Include client if needed
        },
      });
  
      if (invoices.length === 0) {
        res.status(404).json({ message: 'No invoices found' });
        return;
      }
  
      res.status(200).json({
        message: 'Invoices retrieved successfully',
        data: invoices,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Something went wrong',
      });
    }
  };

  /**
 * @desc Get a single invoice by ID
 * @route GET /api/invoice/:id
 * @method GET
 * @access protected
 */
export const getOneInvoice = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params; // Get the invoice ID from the request parameters
      const invoiceId=Number(id)
      if(!invoiceId){
        res.status(400).json({ message: 'Invalid invoice id' });
      }
      
      // Fetch the invoice with the given ID
      const invoice = await prismaClient.invoice.findUnique({
        where: { id: Number(id) },
        include: {
          reservation: true, // Include related reservation details
          client: true,      // Include related client details
        },
      });
  
      if (!invoice) {
        res.status(404).json({ message: `Invoice with ID ${id} not found` });
        return;
      }
  
      res.status(200).json({
        message: 'Invoice retrieved successfully',
        data: invoice,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Something went wrong',
      });
    }
  };

  /**
 * @desc Delete a single invoice by ID
 * @route DELETE /api/invoice/:id
 * @method DELETE
 * @access protected
 */

export const deleteOneInvoice = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params; // Get the invoice ID from the request parameters
      const invoiceId = Number(id);
  
      if (!invoiceId) {
        res.status(400).json({ message: 'Invalid invoice ID' });
        return;
      }
  
      // Check if the invoice exists
      const invoiceExists = await prismaClient.invoice.findUnique({
        where: { id: invoiceId },
      });
  
      if (!invoiceExists) {
        res.status(404).json({ message: `Invoice with ID ${invoiceId} not found` });
        return;
      }
  
      // Delete the invoice with the given ID
      const deletedInvoice = await prismaClient.invoice.delete({
        where: { id: invoiceId },
      });
  
      res.status(200).json({
        message: `Invoice with ID ${invoiceId} deleted successfully`,
        data: deletedInvoice,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Something went wrong',
      });
    }
  };

  
/**
 * @desc Delete all invoices
 * @route DELETE /api/invoices
 * @method DELETE
 * @access protected
 */
export const deleteAllInvoices = async (req: Request, res: Response): Promise<void> => {
    try {
      // Delete all invoices from the database
      const deletedInvoices = await prismaClient.invoice.deleteMany();
  
      res.status(200).json({
        message: `${deletedInvoices.count} invoices deleted successfully`,
        data: deletedInvoices,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Something went wrong',
      });
    }
  };