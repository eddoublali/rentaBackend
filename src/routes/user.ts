import { Router, RequestHandler } from "express";
import { authMiddleware } from "../middleware/authMiddleware";// assuming it's a named export
import { deleteUser, getAllUsers, getOneUser, updateUser } from "../controllers/userController";
import { adminMiddleware } from "../middleware/adminMiddleware";

const userRouter: Router = Router();

// Public routes
userRouter.get('/',  authMiddleware as RequestHandler,adminMiddleware,getAllUsers);
userRouter.get('/:id',  authMiddleware as RequestHandler,getOneUser);
userRouter.put('/:id',  authMiddleware as RequestHandler,adminMiddleware,updateUser);
userRouter.delete('/:id',  authMiddleware as RequestHandler,adminMiddleware,deleteUser);




export default userRouter;
