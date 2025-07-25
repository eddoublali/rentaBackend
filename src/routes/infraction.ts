import { Router, RequestHandler } from "express";
import { authMiddleware } from "../middleware/authMiddleware"; // assuming it's a named export

import {
  adminMiddleware,
  isAdminOrAdministrateur,
} from "../middleware/adminMiddleware";
import { createInfraction, deleteAllInfractions, deleteInfraction, getAllInfractions, getInfractionsByClient, getOneInfraction, updateInfraction } from "../controllers/infractionController";


const infractionRouter: Router = Router();

// protecter routes
infractionRouter.post(
  "/",
  authMiddleware as RequestHandler,
  isAdminOrAdministrateur,
  createInfraction
);
infractionRouter.put(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
  updateInfraction
);
infractionRouter.get(
  "/",
  authMiddleware as RequestHandler,
 
  getAllInfractions
);
infractionRouter.get(
  "/:id",
  authMiddleware as RequestHandler,
  isAdminOrAdministrateur,
  getOneInfraction
);
infractionRouter.get(
  "/client/:clientId",
  authMiddleware as RequestHandler,
  isAdminOrAdministrateur,
  getInfractionsByClient
);
infractionRouter.delete(
  "/",
  authMiddleware as RequestHandler,
  adminMiddleware,
  deleteAllInfractions
);
infractionRouter.delete(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
  deleteInfraction
);

export default infractionRouter;
