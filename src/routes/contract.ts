import { createContract, getAllContracts, deleteContract, getContractById, updateContract, } from '../controllers/contractController';

import { Router, RequestHandler } from "express";
import { authMiddleware } from "../middleware/authMiddleware"; // assuming it's a named export

import {
  adminMiddleware,
  isAdminOrAdministrateur,
} from "../middleware/adminMiddleware";


const contracRouter: Router = Router();

// protecter routes
contracRouter.post(
  "/",
  authMiddleware as RequestHandler,
  isAdminOrAdministrateur,
  createContract
);
contracRouter.put(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
  updateContract
);
contracRouter.get(
  "/",
  authMiddleware as RequestHandler,
  getAllContracts
);
contracRouter.get(
  "/:id",
  authMiddleware as RequestHandler,
  isAdminOrAdministrateur,
  getContractById
);

contracRouter.delete(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
  deleteContract
);

export default contracRouter;
