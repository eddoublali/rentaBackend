import { contractSchema, contractUpdateSchema } from '../schema/contractValidation';

import { Request, Response } from 'express';
import { prismaClient } from '../app';
import { z } from 'zod';

/**
 * @desc Create a new contract
 * @route POST /api/contract
 * @method POST
 * @access protected
 */
export const createContract = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = contractSchema.parse(req.body);

    // Optional: check if client exists
    const client = await prismaClient.client.findUnique({
      where: { id: data.clientId },
    });

    if (!client) {
      res.status(404).json({ message: 'Client not found' });
      return;
    }

    // Optional: check if vehicle exists
    const vehicle = await prismaClient.vehicle.findUnique({
      where: { id: data.vehicleId },
    });

    if (!vehicle) {
      res.status(404).json({ message: 'Vehicle not found' });
      return;
    }

    const contract = await prismaClient.contract.create({
      data,
    });

    res.status(201).json({
      message: 'Contract created successfully',
      data: contract,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Validation failed', errors: error.errors });
    } else if (error instanceof Error) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Something went wrong' });
    }
  }
};

/**
 * @desc Update a contract
 * @route PUT /api/contract/:id
 * @method PUT
 * @access protected
 */
export const updateContract = async (req: Request, res: Response): Promise<void> => {
    try {
      const contractId = Number(req.params.id);
      if(!contractId){
        res.status(400).json({ message: 'Invalid contract id' });
      }
      const data = contractUpdateSchema.parse(req.body);
  
      const existingContract = await prismaClient.contract.findUnique({
        where: { id: contractId },
      });
  
      if (!existingContract) {
        res.status(404).json({ message: 'Contract not found' });
        return;
      }
  
      // Optional: validate client and vehicle IDs if included
      if (data.clientId) {
        const client = await prismaClient.client.findUnique({
          where: { id: data.clientId },
        });
        if (!client) {
          res.status(404).json({ message: 'Client not found' });
          return;
        }
      }
  
      if (data.vehicleId) {
        const vehicle = await prismaClient.vehicle.findUnique({
          where: { id: data.vehicleId },
        });
        if (!vehicle) {
          res.status(404).json({ message: 'Vehicle not found' });
          return;
        }
      }
  
      const updatedContract = await prismaClient.contract.update({
        where: { id: contractId },
        data,
      });
  
      res.status(200).json({
        message: 'Contract updated successfully',
        data: updatedContract,
      });
  
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Validation failed', errors: error.errors });
      } else if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Something went wrong' });
      }
    }
  };


  /**
 * @desc Get all contracts
 * @route GET /api/contract
 * @method GET
 * @access protected
 */
export const getAllContracts = async (req: Request, res: Response): Promise<void> => {
    try {
      const contracts = await prismaClient.contract.findMany({
        include: {
          client: true,  // Optional: Include client details
          vehicle: true, // Optional: Include vehicle details
        },
      });
  
      res.status(200).json({
        message: 'Contracts fetched successfully',
        data: contracts,
      });
  
    } catch (error) {
      res.status(500).json({
        message: 'Something went wrong',
      });
    }
  };

  /**
 * @desc Get a single contract by ID
 * @route GET /api/contract/:id
 * @method GET
 * @access protected
 */
export const getOneContract = async (req: Request, res: Response): Promise<void> => {
    try {
      const contractId = parseInt(req.params.id);
  
      const contract = await prismaClient.contract.findUnique({
        where: { id: contractId },
        include: {
          client: true,  // Optional: Include client details
          vehicle: true, // Optional: Include vehicle details
        },
      });
  
      if (!contract) {
        res.status(404).json({ message: 'Contract not found' });
        return;
      }
  
      res.status(200).json({
        message: 'Contract fetched successfully',
        data: contract,
      });
  
    } catch (error) {
      res.status(500).json({
        message: 'Something went wrong',
      });
    }
  };

  /**
 * @desc Delete a contract by ID
 * @route DELETE /api/contract/:id
 * @method DELETE
 * @access protected
 */
export const deleteContractById = async (req: Request, res: Response): Promise<void> => {
    try {
      const contractId = Number(req.params.id);
      if(!contractId){
        res.status(400).json({ message: 'Invalid contract ID' });
      }
  
      // Check if the contract exists
      const existingContract = await prismaClient.contract.findUnique({
        where: { id: contractId },
      });
  
      if (!existingContract) {
        res.status(404).json({ message: 'Contract not found' });
        return;
      }
  
      // Delete the contract
      await prismaClient.contract.delete({
        where: { id: contractId },
      });
  
      res.status(200).json({
        message: 'Contract deleted successfully',
      });
  
    } catch (error) {
      res.status(500).json({
        message: 'Something went wrong',
      });
    }
  };

  /**
 * @desc Delete all contracts
 * @route DELETE /api/contract
 * @method DELETE
 * @access protected
 */
export const deleteAllContracts = async (req: Request, res: Response): Promise<void> => {
    try {
      await prismaClient.contract.deleteMany();
  
      res.status(200).json({
        message: 'All contracts deleted successfully',
      });
  
    } catch (error) {
      res.status(500).json({
        message: 'Something went wrong',
      });
    }
  };