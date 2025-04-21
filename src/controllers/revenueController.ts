import { Request, Response } from 'express';
import { prismaClient } from '../app';

/**
 * @desc Get one revenue
 * @route GET /api/revenue/
 */
export const getAllRevenues = async (req: Request, res: Response): Promise<void> => {
    try {
      const revenues = await prismaClient.revenue.findMany({
        include: {
          client: true,
          reservation: true,
          vehicle: true
        }
      });
  
      res.status(200).json({
        message: 'All revenues fetched successfully',
        data: revenues
      });
    } catch (error) {
      console.error('Error fetching revenues:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
/**
 * @desc Get one revenue
 * @route GET /api/revenue/:id
 */
export const getOneRevenue = async (req: Request, res: Response): Promise<void> => {
    try {
      const revenueId = Number(req.params.id);
      if (isNaN(revenueId)) {
        res.status(400).json({ message: 'Invalid revenue ID' });
        return;
      }
  
      const revenue = await prismaClient.revenue.findUnique({
        where: { id: revenueId },
        include: {
          client: true,
          reservation: true,
          vehicle: true
        }
      });
  
      if (!revenue) {
        res.status(404).json({ message: 'Revenue not found' });
        return;
      }
  
      res.status(200).json({
        message: 'Revenue fetched successfully',
        data: revenue
      });
    } catch (error) {
      console.error('Error fetching revenue:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
