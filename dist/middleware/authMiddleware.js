"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secrets_1 = require("../secrets");
const app_1 = require("../app");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    const token = (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith('Bearer '))
        ? authHeader.split(' ')[1]
        : undefined;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, secrets_1.JWT_SECRET);
        // console.log('Payload:', payload);
        const user = yield app_1.prismaClient.user.findUnique({
            where: { id: payload.userId }, // if payload.userId is undefined, it fails silently
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = user;
        // console.log('Authenticated user:', user);
        next();
    }
    catch (error) {
        console.error('Auth error:', error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
});
exports.authMiddleware = authMiddleware;
