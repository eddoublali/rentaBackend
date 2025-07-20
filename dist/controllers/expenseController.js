"use strict";
// import { expenseSchema, expenseUpdateSchema } from './../schema/expenseValidation';
// import { Request, Response } from 'express';
// import { prismaClient } from '../app';
// import { z } from 'zod';
// /**
//  * @desc Create a new expense
//  * @route POST /api/expense
//  * @method POST
//  * @access protected
//  */
// export const createExpense = async (req: Request, res: Response) : Promise<void>=> {
//   try {
//     const validatedData = expenseSchema.parse(req.body);
//     const newExpense = await prismaClient.expense.create({
//       data: validatedData,
//     });
//     res.status(201).json({
//       message: 'Expense created successfully',
//       data: newExpense,
//     });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//        res.status(400).json({
//         message: 'Validation failed',
//         errors: error.errors,
//       });
//     }
//     res.status(500).json({
//       message: 'Something went wrong',
//       error: error instanceof Error ? error.message : error,
//     });
//   }
// };
// /**
//  * @desc Update an existing expense
//  * @route PUT /api/expense/:id
//  * @method PUT
//  * @access protected
//  */
// export const updateExpense = async (req: Request, res: Response): Promise<void> => {
//     const expenseId = Number(req.params.id);
//     // Check if ID is a valid number
//     if (isNaN(expenseId)) {
//        res.status(400).json({ message: 'Invalid expense ID' });
//     }
//     try {
//       // Validate request body
//       const validatedData = expenseUpdateSchema.parse(req.body);
//       // Check if the expense exists
//       const existingExpense = await prismaClient.expense.findUnique({
//         where: { id: expenseId },
//       });
//       if (!existingExpense) {
//          res.status(404).json({ message: 'Expense not found' });
//       }
//       // Update the expense
//       const updatedExpense = await prismaClient.expense.update({
//         where: { id: expenseId },
//         data: validatedData,
//       });
//        res.status(200).json(updatedExpense);
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//          res.status(400).json({ message: error.errors });
//       }
//       console.error('Error updating expense:', error);
//        res.status(500).json({ message: 'Internal server error' });
//     }
//   };
//   /**
//  * @desc Get all expenses
//  * @route GET /api/expense
//  * @method GET
//  * @access protected
//  */
// export const getAllExpenses = async (req: Request, res: Response): Promise<void> => {
//     try {
//       const expenses = await prismaClient.expense.findMany({
//         orderBy: { date: 'desc' }, // Optional: sort by date descending
//       });
//       res.status(200).json(expenses);
//     } catch (error) {
//       console.error('Error fetching expenses:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   };
// /**
//  * @desc Get a single expense by ID
//  * @route GET /api/expense/:id
//  * @method GET
//  * @access protected
//  */
// export const getOneExpense = async (req: Request, res: Response): Promise<void> => {
//     const { id } = req.params;
//     // Validate that id is a valid number
//     const expenseId = Number(id);
//     if (isNaN(expenseId)) {
//       res.status(400).json({ message: 'Invalid expense ID' });
//       return;
//     }
//     try {
//       const expense = await prismaClient.expense.findUnique({
//         where: { id: expenseId },
//       });
//       if (!expense) {
//         res.status(404).json({ message: 'Expense not found' });
//         return;
//       }
//       res.status(200).json(expense);
//     } catch (error) {
//       console.error('Error fetching expense:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   };
// /**
//  * @desc Delete a single expense by ID
//  * @route DELETE /api/expense/:id
//  * @method DELETE
//  * @access protected
//  */
// export const deleteOneExpense = async (req: Request, res: Response): Promise<void> => {
//     const { id } = req.params;
//     const expenseId = Number(id);
//     if (isNaN(expenseId)) {
//       res.status(400).json({ message: 'Invalid expense ID' });
//       return;
//     }
//     try {
//       const existingExpense = await prismaClient.expense.findUnique({
//         where: { id: expenseId },
//       });
//       if (!existingExpense) {
//         res.status(404).json({ message: 'Expense not found' });
//         return;
//       }
//       await prismaClient.expense.delete({
//         where: { id: expenseId },
//       });
//       res.status(200).json({ message: 'Expense deleted successfully' });
//     } catch (error) {
//       console.error('Error deleting expense:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   };
//   /**
//  * @desc Delete all expenses
//  * @route DELETE /api/expense
//  * @method DELETE
//  * @access protected
//  */
// export const deleteAllExpenses = async (_req: Request, res: Response): Promise<void> => {
//     try {
//       await prismaClient.expense.deleteMany();
//       res.status(200).json({ message: 'All expenses deleted successfully' });
//     } catch (error) {
//       console.error('Error deleting all expenses:', error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   };
