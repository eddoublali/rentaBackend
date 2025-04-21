import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';
import { prismaClient } from '../app';

declare global {
  namespace Express {
    interface Request {
      user?: any;  // You can define a custom User type if you need more structure
    }
  }
}

interface JwtPayload {
  userId: number;  // Ensure this matches the JWT payload structure
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : undefined;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    
    const payload = jwt.verify(token, JWT_SECRET as string) as JwtPayload;
    // console.log('Payload:', payload);

    const user = await prismaClient.user.findUnique({
      where: { id: payload.userId }, // if payload.userId is undefined, it fails silently
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    // console.log('Authenticated user:', user);
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
