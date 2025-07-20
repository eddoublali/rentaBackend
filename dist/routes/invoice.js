"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware"); // assuming it's a named export
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const invoiceController_1 = require("../controllers/invoiceController");
const invoiceRouter = (0, express_1.Router)();
// protecter routes
invoiceRouter.post("/", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, invoiceController_1.createInvoice);
invoiceRouter.put("/:id", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, invoiceController_1.updateInvoice);
invoiceRouter.get("/", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, invoiceController_1.getAllInvoices);
invoiceRouter.get("/:id", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, invoiceController_1.getOneInvoice);
invoiceRouter.delete("/", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, invoiceController_1.deleteAllInvoices);
invoiceRouter.delete("/:id", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, invoiceController_1.deleteOneInvoice);
exports.default = invoiceRouter;
