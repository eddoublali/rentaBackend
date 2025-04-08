import { Router, RequestHandler } from "express";
import { authMiddleware } from "../middleware/authMiddleware"; // assuming it's a named export

import {
  adminMiddleware,
  isAdminOrAdministrateur,
} from "../middleware/adminMiddleware";
import { createInvoice, deleteAllInvoices, deleteOneInvoice, getAllInvoices, getOneInvoice, updateInvoice } from "../controllers/invoiceController";


const invoiceRouter: Router = Router();

// protecter routes
invoiceRouter.post(
  "/",
  authMiddleware as RequestHandler,
  adminMiddleware,
  createInvoice
);
invoiceRouter.put(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
  updateInvoice
);
invoiceRouter.get(
  "/",
  authMiddleware as RequestHandler,
  adminMiddleware,
  getAllInvoices
);
invoiceRouter.get(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
  getOneInvoice
);
invoiceRouter.delete(
  "/",
  authMiddleware as RequestHandler,
  adminMiddleware,
  deleteAllInvoices
);
invoiceRouter.delete(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
  deleteOneInvoice
);

export default invoiceRouter;
