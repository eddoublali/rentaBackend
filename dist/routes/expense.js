"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// import { authMiddleware } from "../middleware/authMiddleware"; // assuming it's a named export
// import {
//   adminMiddleware,
//   isAdminOrAdministrateur,
// } from "../middleware/adminMiddleware";
// import { createExpense, deleteAllExpenses, deleteOneExpense, getAllExpenses, getOneExpense, updateExpense } from "../controllers/expenseController";
const expenseRouter = (0, express_1.Router)();
// // protecter routes
// expenseRouter.post(
//   "/",
//   authMiddleware as RequestHandler,
//   adminMiddleware,
//   createExpense
// );
// expenseRouter.put(
//   "/:id",
//   authMiddleware as RequestHandler,
//   adminMiddleware,
//   updateExpense
// );
// expenseRouter.get(
//   "/",
//   authMiddleware as RequestHandler,
//   adminMiddleware,
//   getAllExpenses
// );
// expenseRouter.get(
//   "/:id",
//   authMiddleware as RequestHandler,
//   adminMiddleware,
//   getOneExpense
// );
// expenseRouter.delete(
//   "/",
//   authMiddleware as RequestHandler,
//   adminMiddleware,
//   deleteAllExpenses
// );
// expenseRouter.delete(
//   "/:id",
//   authMiddleware as RequestHandler,
//   adminMiddleware,
//   deleteOneExpense
// );
exports.default = expenseRouter;
