"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authRouter = (0, express_1.Router)();
// Public routes
authRouter.post('/signup', authController_1.signup);
authRouter.post('/login', authController_1.login);
exports.default = authRouter;
