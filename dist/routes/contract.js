"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const contractController_1 = require("../controllers/contractController");
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware"); // assuming it's a named export
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const contracRouter = (0, express_1.Router)();
// protecter routes
contracRouter.post("/", authMiddleware_1.authMiddleware, adminMiddleware_1.isAdminOrAdministrateur, contractController_1.createContract);
contracRouter.put("/:id", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, contractController_1.updateContract);
contracRouter.get("/", authMiddleware_1.authMiddleware, contractController_1.getAllContracts);
contracRouter.get("/:id", authMiddleware_1.authMiddleware, adminMiddleware_1.isAdminOrAdministrateur, contractController_1.getContractById);
contracRouter.delete("/:id", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, contractController_1.deleteContract);
exports.default = contracRouter;
