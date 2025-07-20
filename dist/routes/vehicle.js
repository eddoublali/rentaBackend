"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware"); // assuming it's a named export
const vehicleController_1 = require("../controllers/vehicleController");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const upload_1 = require("../middleware/upload");
const vehicleRouter = (0, express_1.Router)();
// protecter routes
vehicleRouter.post("/", authMiddleware_1.authMiddleware, adminMiddleware_1.isAdminOrAdministrateur, upload_1.upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'registrationCard', maxCount: 1 },
    { name: 'insurance', maxCount: 1 },
    { name: 'technicalVisit', maxCount: 1 },
    { name: 'authorization', maxCount: 1 },
    { name: 'taxSticker', maxCount: 1 },
]), vehicleController_1.createVehicle);
vehicleRouter.get("/", authMiddleware_1.authMiddleware, vehicleController_1.getAllVehicles);
vehicleRouter.get("/available", authMiddleware_1.authMiddleware, adminMiddleware_1.isAdminOrAdministrateur, vehicleController_1.getAvailableVehicles);
vehicleRouter.get("/:id", authMiddleware_1.authMiddleware, vehicleController_1.getVehicle);
vehicleRouter.put("/:id", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, upload_1.upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'registrationCard', maxCount: 1 },
    { name: 'insurance', maxCount: 1 },
    { name: 'technicalVisit', maxCount: 1 },
    { name: 'authorization', maxCount: 1 },
    { name: 'taxSticker', maxCount: 1 },
]), vehicleController_1.updateVehicle);
vehicleRouter.delete("/:id", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, vehicleController_1.deleteVehicle);
exports.default = vehicleRouter;
