import { createContract, deleteAllContracts, deleteContractById, getAllContracts, getOneContract, updateContract } from '../controllers/contractController';

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
  adminMiddleware,
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
  adminMiddleware,
  getAllContracts
);
contracRouter.get(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
  getOneContract
);
contracRouter.delete(
  "/",
  authMiddleware as RequestHandler,
  adminMiddleware,
  deleteAllContracts
);
contracRouter.delete(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
  deleteContractById
);

export default contracRouter;
