import { Router, RequestHandler } from "express";
import { authMiddleware } from "../middleware/authMiddleware"; // assuming it's a named export
import {
  createVehicle,
  deleteVehicle,
  getAllVehicles,
  getAvailableVehicles,
  getRentedVehiclesWithContracts,
  getVehicle,
  updateVehicle,
} from "../controllers/vehicleController";
import {
  adminMiddleware,
  isAdminOrAdministrateur,
} from "../middleware/adminMiddleware";
import { upload } from "../middleware/upload";

const vehicleRouter: Router = Router();

// protecter routes
vehicleRouter.post(
  "/",
  authMiddleware as RequestHandler,
  isAdminOrAdministrateur,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'registrationCard', maxCount: 1 },
    { name: 'insurance', maxCount: 1 },
    { name: 'technicalVisit', maxCount: 1 },
    { name: 'authorization', maxCount: 1 },
    { name: 'taxSticker', maxCount: 1 },
  ]),
  createVehicle
);
vehicleRouter.get(
  "/",
  authMiddleware as RequestHandler,


  getAllVehicles
);
vehicleRouter.get(
  "/available",
  authMiddleware as RequestHandler,
  isAdminOrAdministrateur,

  getAvailableVehicles

);
vehicleRouter.get(
  "/:id",
  authMiddleware as RequestHandler,

  getVehicle
);
vehicleRouter.put(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'registrationCard', maxCount: 1 },
    { name: 'insurance', maxCount: 1 },
    { name: 'technicalVisit', maxCount: 1 },
    { name: 'authorization', maxCount: 1 },
    { name: 'taxSticker', maxCount: 1 },
  ]),
  updateVehicle
);
vehicleRouter.delete(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
  deleteVehicle
);

vehicleRouter.get(
  "/calendar/rentals",
  authMiddleware as RequestHandler,
  getRentedVehiclesWithContracts
);


export default vehicleRouter;
