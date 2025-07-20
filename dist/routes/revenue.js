"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware"); // assuming it's a named export
const revenueController_1 = require("../controllers/revenueController");
const revenueRouter = (0, express_1.Router)();
// protecter routes
revenueRouter.get("/", authMiddleware_1.authMiddleware, revenueController_1.getAllRevenues);
revenueRouter.get("/monthly", authMiddleware_1.authMiddleware, revenueController_1.getMonthlyRevenue);
revenueRouter.get("/:id", authMiddleware_1.authMiddleware, revenueController_1.getOneRevenue);
exports.default = revenueRouter;
