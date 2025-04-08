import { documentSchema,documentUpdateSchema } from './../schema/documentValidation';
import { Request, Response } from 'express';
import { prismaClient } from '../app';
import { z } from 'zod';

/**
 * @desc Create a new document 
 * @route POST /api/document
 * @method POST
 * @access protected
 */
export const createDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = documentSchema.parse(req.body);

    const client = await prismaClient.client.findUnique({
      where: { id: data.clientId }
    });

    if (!client) {
      res.status(404).json({ message: 'Client not found' });
      return;
    }

    const document = await prismaClient.document.create({ data });

    res.status(201).json({
      message: 'Document created',
      data: document
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
 * @desc Update an existing document
 * @route PUT /api/document/:id
 * @method PUT
 * @access protected
 */
export const updateDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const documentId = Number(req.params.id);
    if(!documentId){
      res.status(400).json({ message: 'Invalid document id' });
    }
    const data = documentUpdateSchema.parse(req.body);

    // Check if the document exists
    const existingDocument = await prismaClient.document.findUnique({
      where: { id: documentId }
    });

    if (!existingDocument) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    //  Check if the client exists (if clientId is updatable)
    const client = await prismaClient.client.findUnique({
      where: { id: data.clientId }
    });

    if (!client) {
      res.status(404).json({ message: 'Client not found' });
      return;
    }

    const updatedDocument = await prismaClient.document.update({
      where: { id: documentId },
      data,
    });

    res.status(200).json({
      message: 'Document updated',
      data: updatedDocument,
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
 * @desc Get all documents
 * @route GET /api/document
 * @method GET
 * @access protected
 */
export const getAllDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    const documents = await prismaClient.document.findMany({
      include: {
        client: true, // Remove this if you don't want to include client details
      }
    });

    res.status(200).json({
      message: 'Documents fetched successfully',
      data: documents,
    });

  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

/**
 * @desc Get a single document by ID
 * @route GET /api/document/:id
 * @method GET
 * @access protected
 */
export const getDocumentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const documentId = Number(req.params.id);
    if(!documentId){
      res.status(400).json({ message: 'Invalid document id' });
    }
    const document = await prismaClient.document.findUnique({
      where: { id: documentId },
      include: {
        client: true, // Include client details if needed
      },
    });

    if (!document) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    res.status(200).json({
      message: 'Document fetched successfully',
      data: document,
    });

  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

/**
 * @desc Delete all documents
 * @route DELETE /api/document
 * @method DELETE
 * @access protected
 */
export const deleteAllDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    await prismaClient.document.deleteMany();

    res.status(200).json({
      message: 'All documents deleted successfully',
    });

  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};

/**
 * @desc Delete a single document by ID
 * @route DELETE /api/document/:id
 * @method DELETE
 * @access protected
 */
export const deleteOneDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const documentId = Number(req.params.id);
    if(!documentId){
      res.status(400).json({ message: 'Invalid document id' });
    }
    const existingDocument = await prismaClient.document.findUnique({
      where: { id: documentId },
    });

    if (!existingDocument) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    await prismaClient.document.delete({
      where: { id: documentId },
    });

    res.status(200).json({
      message: 'Document deleted successfully',
    });

  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
    });
  }
};