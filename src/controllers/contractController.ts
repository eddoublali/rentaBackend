import { Request, Response } from "express";
import { z } from "zod";
import { prismaClient } from "..";
import { contractSchema, contractUpdateSchema } from "../schema/contractValidation";

interface CreateContractResponse {
  success: boolean;
  message: string;
  data?: any;
  errors?: any;
  updatedReservation?: boolean;
}

/**
 * Create a new contract
 * @route POST /api/contract
 * @access protected
 */
export const createContract = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const validatedData = contractSchema.parse(req.body);

    // Verify vehicle exists
    const vehicle = await prismaClient.vehicle.findUnique({
      where: { id: validatedData.vehicleId },
    });
    if (!vehicle) {
      res.status(404).json({ success: false, message: "Vehicle not found" });
      return;
    }

    // Verify reservation exists
    const reservation = await prismaClient.reservation.findUnique({
      where: { id: validatedData.reservationId },
    });
    if (!reservation) {
      res.status(404).json({ success: false, message: "Reservation not found" });
      return;
    }

    // Verify primary client exists
    const client = await prismaClient.client.findUnique({
      where: { id: validatedData.clientId },
    });
    if (!client) {
      res.status(404).json({ success: false, message: "Client not found" });
      return;
    }

    // Verify second driver client if provided
    if (validatedData.secondDriver && validatedData.clientSeconId) {
      const secondClient = await prismaClient.client.findUnique({
        where: { id: validatedData.clientSeconId },
      });
      if (!secondClient) {
        res.status(404).json({ success: false, message: "Second driver client not found" });
        return;
      }
      if (validatedData.clientSeconId === validatedData.clientId) {
        res.status(400).json({ success: false, message: "Second driver cannot be the same as primary client" });
        return;
      }
    }

    // Create contract
    const newContract = await prismaClient.contract.create({
      data: {
        ...validatedData,
        accessories: validatedData.accessories || [],
        documents: validatedData.documents || [],
        
      },
    });
    const revenue = await prismaClient.revenue.create({
      data: {
        clientId: validatedData.clientId,
        contractId: newContract.id,
        vehicleId: validatedData.vehicleId,
        amount: validatedData.totalAmount,
        source: "Contract",
        date: new Date(), // Or you could use validatedData.startDate 
      }
    });

    // Update related records
    const [_, updatedReservation] = await Promise.all([
      prismaClient.vehicle.update({
        where: { id: validatedData.vehicleId },
        data: { status: "RENTED" },
      }),
      prismaClient.reservation.updateMany({
        where: { id: validatedData.reservationId },
        data: { status: "CONFIRMED" },
      }),
    ]);
    

    const response: CreateContractResponse = {
      success: true,
      message: "Contract created successfully",
      data: newContract,
      updatedReservation: updatedReservation.count > 0,
    };

    res.status(201).json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
      return;
    }

    console.error("Error creating contract:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create contract",
      errors: (error as Error).message,
    });
  }
};
/**
 * @desc Get all contracts
 * @route GET /api/contract
 * @method GET
 * @access protected
 */
export const getAllContracts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const contracts = await prismaClient.contract.findMany({
        include: {
            vehicle: true,
            client: true,
          },
    }
        
    );

    res.status(200).json({
      success: true,
      count: contracts.length,
      data: contracts,
    });
  } catch (error) {
    console.error("Error fetching contracts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve contracts",
      error: (error as Error).message,
    });
  }
};

/**
 * @desc Get contract by ID
 * @route GET /api/contract/:id
 * @method GET
 * @access protected
 */
export const getContractById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const contract = await prismaClient.contract.findUnique({
      where: { id: Number(id) },
      include:{
        client:true,
        secondClient:true,
        vehicle:true,
        
      }
    });

    if (!contract) {
      res.status(404).json({
        success: false,
        message: "Contract not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: contract,
    });
  } catch (error) {
    console.error("Error fetching contract:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve contract",
      error: (error as Error).message,
    });
  }
};

/**
 * @desc Update contract
 * @route PUT /api/contract/:id
 * @method PUT
 * @access protected
 */
/**
 * @desc Update contract with comprehensive validation
 * @route PUT /api/contract/:id
 * @method PUT
 * @access protected
 */
export const updateContract = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      
      // Check if contract exists before attempting update
      const existingContract = await prismaClient.contract.findUnique({
        where: { id: Number(id) },
      });
  
      if (!existingContract) {
        res.status(404).json({
          success: false,
          message: "Contract not found",
        });
        return;
      }
  
      // Validate request body against update schema
      const validatedData = contractUpdateSchema.parse(req.body);
  
      // If vehicle is being updated, verify it exists
      if (validatedData.vehicleId) {
        const vehicle = await prismaClient.vehicle.findUnique({
          where: { id: validatedData.vehicleId },
        });
        if (!vehicle) {
          res.status(404).json({ success: false, message: "Vehicle not found" });
          return;
        }
      }
  
      // If reservation is being updated, verify it exists
      if (validatedData.reservationId) {
        const reservation = await prismaClient.reservation.findUnique({
          where: { id: validatedData.reservationId },
        });
        if (!reservation) {
          res.status(404).json({ success: false, message: "Reservation not found" });
          return;
        }
      }
  
      // If client is being updated, verify it exists
      if (validatedData.clientId) {
        const client = await prismaClient.client.findUnique({
          where: { id: validatedData.clientId },
        });
        if (!client) {
          res.status(404).json({ success: false, message: "Client not found" });
          return;
        }
      }
  
      // Verify second driver client if provided in update
      if (validatedData.secondDriver && validatedData.clientSeconId) {
        // Check if the second driver exists
        const secondClient = await prismaClient.client.findUnique({
          where: { id: validatedData.clientSeconId },
        });
        if (!secondClient) {
          res.status(404).json({ success: false, message: "Second driver client not found" });
          return;
        }
        
        // Check if second driver is the same as primary driver
        const primaryClientId = validatedData.clientId || existingContract.clientId;
        if (validatedData.clientSeconId === primaryClientId) {
          res.status(400).json({ 
            success: false, 
            message: "Second driver cannot be the same as primary client" 
          });
          return;
        }
      }
  
      // Update the contract
      const updatedContract = await prismaClient.contract.update({
        where: { id: Number(id) },
        data: {
          ...validatedData,
          // Ensure arrays are handled correctly
          accessories: validatedData.accessories || existingContract.accessories || undefined,
          documents: validatedData.documents || existingContract.documents|| undefined,
        },
        include: {
          vehicle: true,
          client: true,
        }
      });
  
      // Handle related record updates if needed
      if (validatedData.vehicleId && validatedData.vehicleId !== existingContract.vehicleId) {
        // Update old vehicle status if applicable
        await prismaClient.vehicle.update({
          where: { id: existingContract.vehicleId },
          data: { status: "AVAILABLE" },
        });
        
        // Update new vehicle status
        await prismaClient.vehicle.update({
          where: { id: validatedData.vehicleId },
          data: { status: "RENTED" },
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Contract updated successfully",
        data: updatedContract,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
        return;
      }
  
      console.error("Error updating contract:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update contract",
        error: (error as Error).message,
      });
    }
  };

/**
 * @desc Delete contract
 * @route DELETE /api/contract/:id
 * @method DELETE
 * @access protected
 */
export const deleteContract = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if contract exists
    const contract = await prismaClient.contract.findUnique({
      where: { id: Number(id) },
    });

    if (!contract) {
      res.status(404).json({
        success: false,
        message: "Contract not found",
      });
      return;
    }

    // Delete the contract
    await prismaClient.contract.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({
      success: true,
      message: "Contract deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting contract:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete contract",
      error: (error as Error).message,
    });
  }
};


