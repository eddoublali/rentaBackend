import { createDocument, deleteAllDocuments, deleteOneDocument, getAllDocuments, getDocumentById, updateDocument } from './../controllers/documentController';
import { Router, RequestHandler } from "express";
import { authMiddleware } from "../middleware/authMiddleware"; // assuming it's a named export

import {
  adminMiddleware,
  isAdminOrAdministrateur,
} from "../middleware/adminMiddleware";


const documentRouter: Router = Router();

// protecter routes
documentRouter.post(
  "/",
  authMiddleware as RequestHandler,
  adminMiddleware,
createDocument
);
documentRouter.put(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
  updateDocument
);
documentRouter.get(
  "/",
  authMiddleware as RequestHandler,
  adminMiddleware,
  getAllDocuments
);
documentRouter.get(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
  getDocumentById
);
documentRouter.delete(
  "/",
  authMiddleware as RequestHandler,
  adminMiddleware,
  deleteAllDocuments
);
documentRouter.delete(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
  deleteOneDocument
);

export default documentRouter;
