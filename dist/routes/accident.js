"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const upload_1 = require("../middleware/upload");
const accidentController_1 = require("../controllers/accidentController");
const AccidentRouter = (0, express_1.Router)();
AccidentRouter.post("/", authMiddleware_1.authMiddleware, adminMiddleware_1.isAdminOrAdministrateur, upload_1.upload.fields([
    { name: 'damagePhotos', maxCount: 1 },
]), accidentController_1.createAccident);
AccidentRouter.put("/:id", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, upload_1.upload.fields([
    { name: 'damagePhotos', maxCount: 1 },
]), accidentController_1.updateAccident);
AccidentRouter.get("/", authMiddleware_1.authMiddleware, accidentController_1.getAllAccidents);
AccidentRouter.get("/:id", authMiddleware_1.authMiddleware, accidentController_1.getOneAccident);
AccidentRouter.delete("/", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, accidentController_1.deleteAllAccidents);
AccidentRouter.delete("/:id", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, accidentController_1.deleteAccidentById);
exports.default = AccidentRouter;
