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
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdminOrAdministrateur = exports.adminMiddleware = void 0;
const adminMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user.role == 'ADMIN') {
        next();
    }
    else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});
exports.adminMiddleware = adminMiddleware;
const isAdminOrAdministrateur = (req, res, next) => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    if (user.role === "ADMIN" || user.role === "ADMINISTRATEUR") {
        next();
        return;
    }
    res.status(403).json({ message: "Access forbidden: Admins only" });
};
exports.isAdminOrAdministrateur = isAdminOrAdministrateur;
