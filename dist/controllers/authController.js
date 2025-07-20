"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const userValidation_1 = require("../schema/userValidation");
const zod_1 = require("zod");
const __1 = require("..");
const bcrypt_1 = require("bcrypt");
const jwt = __importStar(require("jsonwebtoken"));
const secrets_1 = require("../secrets");
// POST signup new user
/**
 *  @desc POST signup new user
 *  @route POST /api/auth/signup
 *  @method POST
 *  @access public
 */
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate request body
        const validatedData = userValidation_1.signupSchema.parse(req.body);
        const { email, password, name, role } = validatedData;
        let user = yield __1.prismaClient.user.findUnique({ where: { email } });
        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        }
        user = yield __1.prismaClient.user.create({
            data: {
                email,
                name,
                password: (0, bcrypt_1.hashSync)(password, 10),
                role,
            },
        });
        res.status(201).json({ message: "User created successfully", user });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: "Validation failed", errors: error.errors });
        }
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.signup = signup;
// POST login existing user
/**
 *  @desc POST login new user
 *  @route POST /api/auth/login
 *  @method POST
 *  @access public
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    let user = yield __1.prismaClient.user.findFirst({ where: { email } });
    if (!user) {
        return res.status(400).json({ message: "Invalid password Or email" });
    }
    if (!(0, bcrypt_1.compareSync)(password, user.password)) {
        return res.status(400).json({ message: "Invalid password Or email" });
    }
    // Create JWT token with expiration
    const token = jwt.sign({ userId: user.id }, secrets_1.JWT_SECRET);
    res.status(200).json({ message: "User logged in successfully", token, user });
});
exports.login = login;
