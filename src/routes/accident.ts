// import { createAccident, deleteAllAccidents, deleteAccidentById, getAllAccidents, getOneAccident, updateAccident } from '../controllers/accidentController';

import { Router, RequestHandler } from "express";
import { authMiddleware } from "../middleware/authMiddleware"; 

import {
  adminMiddleware,
  isAdminOrAdministrateur,
} from "../middleware/adminMiddleware";
import { createAccident, deleteAccidentById, deleteAllAccidents, getAllAccidents, getOneAccident, updateAccident } from "../controllers/AccidentController";
import { upload } from "../middleware/upload";


const AccidentRouter: Router = Router();

AccidentRouter.post(
  "/",
  authMiddleware as RequestHandler,
  adminMiddleware,
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
  adminMiddleware,
  getAllAccidents 
);
AccidentRouter.get(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
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
