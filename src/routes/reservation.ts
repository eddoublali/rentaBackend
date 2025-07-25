import { Router, RequestHandler } from "express";
import { authMiddleware } from "../middleware/authMiddleware"; // assuming it's a named export
import {
  adminMiddleware,
  isAdminOrAdministrateur,
} from "../middleware/adminMiddleware";
import {
  createReservation,
  deleteAllReservations,
  deleteReservation,
  getAllReservations,
  getOneReservation,
  updateReservation,
} from "../controllers/reservationController";

const reservationRouter: Router = Router();

// Public routes
reservationRouter.post(
  "/",
  authMiddleware as RequestHandler,
  isAdminOrAdministrateur,
  createReservation
);
reservationRouter.put(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
  updateReservation
);

reservationRouter.get(
  "/",
  authMiddleware as RequestHandler,
  
  getAllReservations
);
reservationRouter.delete(
  "/",
  authMiddleware as RequestHandler,
  adminMiddleware,
  deleteAllReservations
);

reservationRouter.get(
  "/:id",
  authMiddleware as RequestHandler,
  isAdminOrAdministrateur,
  getOneReservation
);
reservationRouter.delete(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
  deleteReservation
);

export default reservationRouter;
