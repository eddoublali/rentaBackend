import { Router, RequestHandler } from "express";
import { authMiddleware } from "../middleware/authMiddleware";// assuming it's a named export
import { adminMiddleware } from "../middleware/adminMiddleware";
import { createPayment, deleteManyPayments, deletePaymentById, getAllPayments, getPaymentById, updatePayment } from "../controllers/paymentController";
import { updateClient } from "../controllers/clientController";

const paymentRouter: Router = Router();

// Public routes
paymentRouter.post('/',authMiddleware as RequestHandler,adminMiddleware,createPayment);
 paymentRouter.put('/:id',authMiddleware as RequestHandler,adminMiddleware,updatePayment);

 paymentRouter.get('/',authMiddleware as RequestHandler,adminMiddleware,getAllPayments);

 paymentRouter.get('/:id',authMiddleware as RequestHandler,adminMiddleware,getPaymentById);
paymentRouter.delete('/:id',authMiddleware as RequestHandler,adminMiddleware,deletePaymentById);
paymentRouter.delete('/',authMiddleware as RequestHandler,adminMiddleware,deleteManyPayments);




export default paymentRouter;