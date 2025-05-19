import { Router, RequestHandler } from "express";
import { authMiddleware } from "../middleware/authMiddleware"; // assuming it's a named export

import {
  adminMiddleware,
  isAdminOrAdministrateur,
} from "../middleware/adminMiddleware";
import { createMaintenance, deleteMaintenance, getAllMaintenances, updateMaintenance,getOneMaintenance } from "../controllers/maintenanceController";


const maintenanceRouter: Router = Router();

// protecter routes
maintenanceRouter.post(
  "/",
  authMiddleware as RequestHandler,
  isAdminOrAdministrateur,
  createMaintenance
);
maintenanceRouter.put(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
  updateMaintenance
);
maintenanceRouter.get(
  "/",
  authMiddleware as RequestHandler,
  getAllMaintenances
);
maintenanceRouter.get(
  "/:id",
  authMiddleware as RequestHandler,
  
  getOneMaintenance
);


maintenanceRouter.delete(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
  deleteMaintenance
);

export default maintenanceRouter;
