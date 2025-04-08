import { Router, RequestHandler } from "express";
import { authMiddleware } from "../middleware/authMiddleware"; // assuming it's a named export

import {
  adminMiddleware,
  isAdminOrAdministrateur,
} from "../middleware/adminMiddleware";
import { createRental, deleteAllRentals, deleteRental, getAllRentals, getOneRental, updateRental } from "../controllers/rentalController";


const RentalRouter: Router = Router();

// protecter routes
RentalRouter.post(
  "/",
  authMiddleware as RequestHandler,
  adminMiddleware,
  createRental
);
RentalRouter.put(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
  updateRental
);
RentalRouter.get(
  "/",
  authMiddleware as RequestHandler,
  adminMiddleware,
  getAllRentals
);
RentalRouter.get(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
  getOneRental
);
RentalRouter.delete(
  "/",
  authMiddleware as RequestHandler,
  adminMiddleware,
  deleteAllRentals
);
RentalRouter.delete(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
  deleteRental
);

export default RentalRouter;
