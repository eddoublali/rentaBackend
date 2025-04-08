import { paymentUpdateSchema, paymentSchema } from './../schema/paymentValidation';
import { Request, Response } from 'express';
import { prismaClient } from '../app';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

/**
 * @desc Create a new payment
 * @route POST /api/payments
 * @method POST
 * @access protected
 */
export const createPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedPayment = paymentSchema.parse(req.body);
  
      // Check if reservation exists
      const reservation = await prismaClient.reservation.findUnique({
        where: { id: validatedPayment.reservationId },
      });
  
      if (!reservation) {
        res.status(400).json({ message: 'Reservation not found.' });
        return;
      }
  
      // Check if a payment already exists for this reservation
      const existingPayment = await prismaClient.payment.findUnique({
        where: { reservationId: validatedPayment.reservationId },
      });
  
      if (existingPayment) {
        res.status(400).json({ message: 'A payment already exists for this reservation.' });
        return;
      }
  
      // Create the payment
      const newPayment = await prismaClient.payment.create({
        data: {
          reservationId: validatedPayment.reservationId,
          amount: validatedPayment.amount,
          paymentMethod: validatedPayment.paymentMethod,
          status: validatedPayment.status ?? 'PENDING',
        },
      });
  
      res.status(201).json({ message: 'Payment created successfully', payment: newPayment });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Validation failed', errors: error.errors });
        return;
      }
  
      res.status(500).json({ message: 'Something went wrong', error });
    }
  };
  

/**
* @desc Update an existing payment
* @route PUT /api/payments/:id
* @method PUT
* @access protected
*/
export const updatePayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const paymentId = Number(req.params.id);
      if (isNaN(paymentId)) {
         res.status(400).json({ message: 'Invalid payment ID' });
      }
  
      const validatedPayment = paymentUpdateSchema.parse(req.body);
  
      const existingPayment = await prismaClient.payment.findUnique({
        where: { id: paymentId },
      });
  
      if (!existingPayment) {
         res.status(404).json({ message: 'Payment not found' });
      }
  
      if (validatedPayment.reservationId && validatedPayment.reservationId !== existingPayment?.reservationId) {
        const reservation = await prismaClient.reservation.findUnique({
          where: { id: validatedPayment.reservationId },
        });
  
        if (!reservation) {
           res.status(400).json({ message: 'Reservation not found' });
        }
  
        const paymentForReservation = await prismaClient.payment.findUnique({
          where: { reservationId: validatedPayment.reservationId },
        });
  
        if (paymentForReservation) {
           res.status(400).json({ message: 'A payment already exists for this reservation' });
        }
      }
  
      const updatedPayment = await prismaClient.payment.update({
        where: { id: paymentId },
        data: validatedPayment,
      });
  
      res.status(200).json({ message: 'Payment updated successfully', payment: updatedPayment });
    } catch (error) {
      if (error instanceof z.ZodError) {
         res.status(400).json({ message: 'Validation failed', errors: error.errors });
      }
  
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
         res.status(400).json({ message: 'A payment already exists for this reservation' });
      }
  
      res.status(500).json({ message: 'Something went wrong', error });
    }
  };
  /**
* @desc get an existing payment
* @route get /api/payments
* @method get
* @access protected
*/
  export const getAllPayments = async (req: Request, res: Response): Promise<void> => {
    try {
      const payments = await prismaClient.payment.findMany({
        include: { reservation: true },
      });
      res.status(200).json(payments);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch payments', error });
    }
  };
   
  /**
* @desc get oen  existing payment
* @route get /api/payments/:id
* @method get
* @access protected
*/
  export const getPaymentById = async (req: Request, res: Response): Promise<void> => {
    try {
      const paymentId = Number(req.params.id);
      if (isNaN(paymentId)) {
        res.status(400).json({ message: 'Invalid payment ID' });
        return;
      }
  
      const payment = await prismaClient.payment.findUnique({
        where: { id: paymentId },
        include: { reservation: true },
      });
  
      if (!payment) {
        res.status(404).json({ message: 'Payment not found' });
        return;
      }
  
      res.status(200).json(payment);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch payment', error });
    }
  };

/**
 * @desc Delete a payment by ID
 * @route DELETE /api/payments/:id
 * @method DELETE
 * @access protected
 */
export const deletePaymentById = async (req: Request, res: Response): Promise<void> => {
    try {
      const paymentId = Number(req.params.id);
      if (isNaN(paymentId)) {
        res.status(400).json({ message: 'Invalid payment ID' });
        return;
      }
  
      const existingPayment = await prismaClient.payment.findUnique({
        where: { id: paymentId },
      });
  
      if (!existingPayment) {
        res.status(404).json({ message: 'Payment not found' });
        return;
      }
  
      await prismaClient.payment.delete({
        where: { id: paymentId },
      });
  
      res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete payment', error });
    }
  };
  
 /**
 * @desc Delete all payments
 * @route DELETE /api/payments
 * @method DELETE
 * @access protected
 */
export const deleteManyPayments = async (req: Request, res: Response): Promise<void> => {
    try {
      const deleted = await prismaClient.payment.deleteMany({});
  
      res.status(200).json({ 
        message: `Deleted ${deleted.count} payment(s) successfully` 
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Failed to delete payments', 
        error 
      });
    }
  };
  