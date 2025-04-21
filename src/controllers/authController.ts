import { signupSchema } from '../schema/userValidation';
import { z } from 'zod';
import { Request, Response } from 'express';
import { prismaClient } from '../app';
import { hashSync, compareSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';

// POST signup new user
/**
 *  @desc POST signup new user
 *  @route POST /api/auth/signup
 *  @method POST
 *  @access public
 */
export const signup = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = signupSchema.parse(req.body);
    const { email, password, name,role } = validatedData;

    let user = await prismaClient.user.findUnique({ where: { email } });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }

    user = await prismaClient.user.create({
      data: {
        email,
        name,
        password: hashSync(password, 10),
        role,

      },
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Validation failed", errors: error.errors });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST login existing user
/**
 *  @desc POST login new user
 *  @route POST /api/auth/login
 *  @method POST
 *  @access public
 */
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email } });
  if (!user) {
    return res.status(400).json({ message: "Invalid password Or email" });
  }

  if (!compareSync(password, user.password)) {
    return res.status(400).json({ message: "Invalid password Or email" });
  }

  // Create JWT token with expiration
  const token = jwt.sign(
    { userId: user.id },
    JWT_SECRET,
  );

  res.status(200).json({ message: "User logged in successfully", token, user });
};


