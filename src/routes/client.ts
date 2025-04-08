import { Router, RequestHandler } from "express";
import { authMiddleware } from "../middleware/authMiddleware"; // assuming it's a named export

import {
  adminMiddleware,
  isAdminOrAdministrateur,
} from "../middleware/adminMiddleware";
import { createClient, deleteClient, getAllClients, getClientById, updateClient } from "../controllers/clientController";

const clientRouter: Router = Router();

// protecter routes
clientRouter.post(
  "/",
  authMiddleware as RequestHandler,
  adminMiddleware,
  createClient
);
clientRouter.put(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
  updateClient
);
clientRouter.get(
  "/",
  authMiddleware as RequestHandler,
  adminMiddleware,
  getAllClients
);
clientRouter.get(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
  getClientById
);
clientRouter.delete(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
  deleteClient
);

export default clientRouter;
