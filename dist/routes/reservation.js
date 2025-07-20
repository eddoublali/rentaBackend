"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware"); // assuming it's a named export
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const reservationController_1 = require("../controllers/reservationController");
const reservationRouter = (0, express_1.Router)();
// Public routes
reservationRouter.post("/", authMiddleware_1.authMiddleware, adminMiddleware_1.isAdminOrAdministrateur, reservationController_1.createReservation);
reservationRouter.put("/:id", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, reservationController_1.updateReservation);
reservationRouter.get("/", authMiddleware_1.authMiddleware, reservationController_1.getAllReservations);
reservationRouter.delete("/", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, reservationController_1.deleteAllReservations);
reservationRouter.get("/:id", authMiddleware_1.authMiddleware, adminMiddleware_1.isAdminOrAdministrateur, reservationController_1.getOneReservation);
reservationRouter.delete("/:id", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, reservationController_1.deleteReservation);
exports.default = reservationRouter;
