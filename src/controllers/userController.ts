
import { Request, Response } from 'express';
import { prismaClient } from '../app';
import { hashSync } from 'bcrypt';

/**
 * @desc Get all users
 * @route GET /api/users
 * @method GET
 * @access protected
 */
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      // Fetch all users from the database
      const users = await prismaClient.user.findMany();
      
      res.status(200).json({ message: 'Users fetched successfully', users });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  /**
 * @desc Get a single user by ID
 * @route GET /api/users/:id
 * @method GET
 * @access protected
 */
export const getOneUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params; // Get the user ID from the URL parameters
      const userId = Number(id);
      if (isNaN(userId)) {
         res.status(400).json({ message: 'Invalid user ID' });
      }
  
      // Fetch the user from the database by ID
      const user = await prismaClient.user.findUnique({
        where: { id: userId },  // Ensure the id is a number
      });
  
      if (!user) {
         res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'User fetched successfully', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  /**
 * @desc Update an existing user
 * @route PUT /api/users/:id
 * @method PUT
 * @access protected
 */
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params; // Get the user ID from the URL parameters
      const userId = Number(id);
      if (isNaN(userId)) {
         res.status(400).json({ message: 'Invalid user ID' });
      }
      const { email, name, password } = req.body; // Get updated data
      
  
      // Validate the user data
      const userExists = await prismaClient.user.findUnique({
        where: { id: userId },
      });
  
      if (!userExists) {
         res.status(404).json({ message: 'User not found' });
      }
  
      // Hash the new password if provided
      let updatedData: any = { email, name };
      if (password) {
        updatedData.password = hashSync(password, 10);
      }
  
      // Update the user in the database
      const updatedUser = await prismaClient.user.update({
        where: { id: Number(id) },
        data: updatedData,
      });
  
      res.status(200).json({ message: 'User updated successfully', updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  /**
 * @desc Delete a user by ID
 * @route DELETE /api/users/:id
 * @method DELETE
 * @access protected
 */
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params; // Get the user ID from the URL parameters
      const userId = Number(id);
      if (isNaN(userId)) {
         res.status(400).json({ message: 'Invalid user ID' });
      }
      // Check if the user exists
      const userExists = await prismaClient.user.findUnique({
        where: { id: userId },
      });
  
      if (!userExists) {
         res.status(404).json({ message: 'User not found' });
      }
  
      // Delete the user from the database
      await prismaClient.user.delete({
        where: { id: Number(id) },
      });
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  
  