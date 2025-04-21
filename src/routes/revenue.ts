import { Router, RequestHandler } from "express";
import { authMiddleware } from "../middleware/authMiddleware"; // assuming it's a named export

import {
  adminMiddleware,
  isAdminOrAdministrateur,
} from "../middleware/adminMiddleware";
import { getAllRevenues, getOneRevenue } from "../controllers/revenueController";


const revenueRouter: Router = Router();

// protecter routes


revenueRouter.get(
  "/",
  authMiddleware as RequestHandler,
  adminMiddleware,
  getAllRevenues
);
revenueRouter.get(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
  getOneRevenue
);

export default revenueRouter;
