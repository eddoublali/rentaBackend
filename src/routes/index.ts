import { Router } from "express";
import authRouter from "./auth";
import vehicleRouter from "./vehicle";
import clientRouter from "./client";
import userRouter from "./user";
import reservationRouter from "./reservation";
import paymentRouter from "./payment";
import documentRouter from "./document";
import contracRouter from "./contract";
import invoiceRouter from "./invoice";
import infractionRouter from "./infraction";


// craete root router to combine all the routes
const rootRouter:Router=Router();


rootRouter.use('/auth',authRouter)
rootRouter.use('/vehicle',vehicleRouter)
rootRouter.use('/client',clientRouter)
rootRouter.use('/user',userRouter)
rootRouter.use('/reservation',reservationRouter)
rootRouter.use('/payment',paymentRouter)
rootRouter.use('/document',documentRouter)
rootRouter.use('/contrac',contracRouter)
rootRouter.use('/invoice',invoiceRouter)
rootRouter.use('/infraction',infractionRouter)

export default rootRouter;