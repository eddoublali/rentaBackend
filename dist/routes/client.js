"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware"); // assuming it's a named export
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const clientController_1 = require("../controllers/clientController");
const upload_1 = require("../middleware/upload");
const clientRouter = (0, express_1.Router)();
// protecter routes
clientRouter.post("/", authMiddleware_1.authMiddleware, adminMiddleware_1.isAdminOrAdministrateur, upload_1.upload.fields([
    { name: 'cinimage', maxCount: 1 },
    { name: 'licenseimage', maxCount: 1 },
]), clientController_1.createClient);
clientRouter.put("/:id", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, upload_1.upload.fields([
    { name: 'cinimage', maxCount: 1 },
    { name: 'licenseimage', maxCount: 1 },
]), clientController_1.updateClient);
clientRouter.get("/", authMiddleware_1.authMiddleware, adminMiddleware_1.isAdminOrAdministrateur, clientController_1.getAllClients);
clientRouter.get("/:id", authMiddleware_1.authMiddleware, adminMiddleware_1.isAdminOrAdministrateur, clientController_1.getClientById);
clientRouter.delete("/:id", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, clientController_1.deleteClient);
exports.default = clientRouter;
