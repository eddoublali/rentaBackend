import { Router, RequestHandler } from "express";
import { authMiddleware } from "../middleware/authMiddleware"; // assuming it's a named export

import {
  adminMiddleware,
  isAdminOrAdministrateur,
} from "../middleware/adminMiddleware";
import {
  getAllRevenues,
  getMonthlyRevenue,
  getOneRevenue,
} from "../controllers/revenueController";

const revenueRouter: Router = Router();

// protecter routes

revenueRouter.get(
  "/",
  authMiddleware as RequestHandler,

  getAllRevenues
);
revenueRouter.get(
  "/monthly",
  authMiddleware as RequestHandler,

  getMonthlyRevenue
);
revenueRouter.get("/:id", authMiddleware as RequestHandler, getOneRevenue);

export default revenueRouter;
