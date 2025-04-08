import { Router, RequestHandler } from "express";
import { authMiddleware } from "../middleware/authMiddleware"; // assuming it's a named export
import {
  createVehicle,
  deleteVehicle,
  getAllVehicles,
  getVehicle,
  updateVehicle,
} from "../controllers/vehicleController";
import {
  adminMiddleware,
  isAdminOrAdministrateur,
} from "../middleware/adminMiddleware";

const vehicleRouter: Router = Router();

// protecter routes
vehicleRouter.post(
  "/",
  authMiddleware as RequestHandler,
  adminMiddleware,
  createVehicle
);
vehicleRouter.get(
  "/",
  authMiddleware as RequestHandler,
  isAdminOrAdministrateur,
  getAllVehicles
);
vehicleRouter.get(
  "/:id",
  authMiddleware as RequestHandler,
  isAdminOrAdministrateur,
  getVehicle
);
vehicleRouter.put(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
  updateVehicle
);
vehicleRouter.delete(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
  deleteVehicle
);

export default vehicleRouter;
