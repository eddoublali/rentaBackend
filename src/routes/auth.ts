import { Router, RequestHandler } from "express";
import { login, signup } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";// assuming it's a named export

const authRouter: Router = Router();

// Public routes
authRouter.post('/signup', signup as RequestHandler);
authRouter.post('/login', login as RequestHandler);


export default authRouter;
