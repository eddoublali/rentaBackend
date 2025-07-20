"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware"); // assuming it's a named export
const userController_1 = require("../controllers/userController");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const userRouter = (0, express_1.Router)();
// Public routes
userRouter.get('/', authMiddleware_1.authMiddleware, userController_1.getAllUsers);
userRouter.get('/:id', authMiddleware_1.authMiddleware, userController_1.getOneUser);
userRouter.put('/:id', authMiddleware_1.authMiddleware, userController_1.updateUser);
userRouter.delete('/:id', authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, userController_1.deleteUser);
exports.default = userRouter;
