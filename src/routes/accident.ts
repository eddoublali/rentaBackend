import { Router, RequestHandler } from "express";
import { authMiddleware } from "../middleware/authMiddleware"; 

import {
  adminMiddleware,
  isAdminOrAdministrateur,
} from "../middleware/adminMiddleware";
import { upload } from "../middleware/upload";
import { createAccident, deleteAccidentById, deleteAllAccidents, getAllAccidents, getOneAccident, updateAccident } from "../controllers/accidentController";


const AccidentRouter: Router = Router();

AccidentRouter.post(
  "/",
  authMiddleware as RequestHandler,
  isAdminOrAdministrateur,
  upload.fields([
      { name: 'damagePhotos', maxCount: 1 },
    ]),
    createAccident 
);
AccidentRouter.put(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
  upload.fields([
    { name: 'damagePhotos', maxCount: 1 },
  ]),
  updateAccident 
);
AccidentRouter.get(
  "/",
  authMiddleware as RequestHandler,
  getAllAccidents 
);
AccidentRouter.get(
  "/:id",
  authMiddleware as RequestHandler,
  getOneAccident 
);
AccidentRouter.delete(
  "/",
  authMiddleware as RequestHandler,
  adminMiddleware,
  deleteAllAccidents
  

);
AccidentRouter.delete(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
deleteAccidentById
);

export default AccidentRouter;
