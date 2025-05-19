import { RequestHandler, Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware"; 
import {
  adminMiddleware
} from "../middleware/adminMiddleware";
import { upload } from "../middleware/upload";

import {
  createAgency,
  updateAgency,
  getAgency,
  deleteAgency
} from "../controllers/AgencyController";

const AgencyRouter: Router = Router();

AgencyRouter.post(
  "/",
  authMiddleware as RequestHandler,
  adminMiddleware,
  upload.fields([
    { name: 'logo', maxCount: 1 },
  ]),
  createAgency
);

AgencyRouter.put(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
  upload.fields([
    { name: 'logo', maxCount: 1 },
  ]),
  updateAgency
);

AgencyRouter.get(
  "/:id",
  authMiddleware as RequestHandler,
  adminMiddleware,
  getAgency // Consider renaming this to getAgencyById for clarity
);

AgencyRouter.delete(
  "/:id",
  authMiddleware as RequestHandler,
    adminMiddleware,
  deleteAgency
);

export default AgencyRouter;
