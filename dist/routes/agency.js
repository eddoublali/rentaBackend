"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const upload_1 = require("../middleware/upload");
const AgencyController_1 = require("../controllers/AgencyController");
const AgencyRouter = (0, express_1.Router)();
AgencyRouter.post("/", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, upload_1.upload.fields([
    { name: 'logo', maxCount: 1 },
]), AgencyController_1.createAgency);
AgencyRouter.put("/:id", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, upload_1.upload.fields([
    { name: 'logo', maxCount: 1 },
]), AgencyController_1.updateAgency);
AgencyRouter.get("/:id", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, AgencyController_1.getAgency // Consider renaming this to getAgencyById for clarity
);
AgencyRouter.delete("/:id", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, AgencyController_1.deleteAgency);
exports.default = AgencyRouter;
