"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATABASE_URL = exports.JWT_SECRET = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
exports.PORT = process.env.PORT || 3000;
exports.JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
exports.DATABASE_URL = process.env.DATABASE_URL;
// Validate required environment variables
if (!exports.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}
if (!exports.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
}
