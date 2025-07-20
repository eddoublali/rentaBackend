import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';
import { prismaClient } from '..';


export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const user=req.user
    if (user.role=='ADMIN'){
        next()
    }else{
        res.status(401).json({ message: 'Unauthorized' })
    }
};



export const isAdminOrAdministrateur = (req: Request, res: Response, next: NextFunction): void => {
  const user = req.user;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (user.role === "ADMIN" || user.role === "ADMINISTRATEUR") {
    next();
    return;
  }

  res.status(403).json({ message: "Access forbidden: Admins only" });
};