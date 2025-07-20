"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware"); // assuming it's a named export
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const maintenanceController_1 = require("../controllers/maintenanceController");
const maintenanceRouter = (0, express_1.Router)();
// protecter routes
maintenanceRouter.post("/", authMiddleware_1.authMiddleware, adminMiddleware_1.isAdminOrAdministrateur, maintenanceController_1.createMaintenance);
maintenanceRouter.put("/:id", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, maintenanceController_1.updateMaintenance);
maintenanceRouter.get("/", authMiddleware_1.authMiddleware, maintenanceController_1.getAllMaintenances);
maintenanceRouter.get("/:id", authMiddleware_1.authMiddleware, maintenanceController_1.getOneMaintenance);
maintenanceRouter.delete("/:id", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, maintenanceController_1.deleteMaintenance);
exports.default = maintenanceRouter;
