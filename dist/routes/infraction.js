"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware"); // assuming it's a named export
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const infractionController_1 = require("../controllers/infractionController");
const infractionRouter = (0, express_1.Router)();
// protecter routes
infractionRouter.post("/", authMiddleware_1.authMiddleware, adminMiddleware_1.isAdminOrAdministrateur, infractionController_1.createInfraction);
infractionRouter.put("/:id", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, infractionController_1.updateInfraction);
infractionRouter.get("/", authMiddleware_1.authMiddleware, infractionController_1.getAllInfractions);
infractionRouter.get("/:id", authMiddleware_1.authMiddleware, adminMiddleware_1.isAdminOrAdministrateur, infractionController_1.getOneInfraction);
infractionRouter.get("/client/:clientId", authMiddleware_1.authMiddleware, adminMiddleware_1.isAdminOrAdministrateur, infractionController_1.getInfractionsByClient);
infractionRouter.delete("/", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, infractionController_1.deleteAllInfractions);
infractionRouter.delete("/:id", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, infractionController_1.deleteInfraction);
exports.default = infractionRouter;
