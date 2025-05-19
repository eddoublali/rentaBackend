import { Router } from "express";
import authRouter from "./auth";
import vehicleRouter from "./vehicle";
import clientRouter from "./client";
import userRouter from "./user";
import reservationRouter from "./reservation";
import contracRouter from "./contract";
import invoiceRouter from "./invoice";
import infractionRouter from "./infraction";
import expenseRouter from "./expense";
import revenueRouter from "./revenue";
import AccidentRouter from "./accident";
import maintenanceRouter from "./maintenance";
import AgencyRouter from "./agency";


// craete root router to combine all the routes
const rootRouter:Router=Router();


rootRouter.use('/auth',authRouter)
rootRouter.use('/vehicle',vehicleRouter)
rootRouter.use('/client',clientRouter)
rootRouter.use('/user',userRouter)
rootRouter.use('/reservations',reservationRouter)
rootRouter.use('/contracts',contracRouter)
rootRouter.use('/invoice',invoiceRouter)
rootRouter.use('/infraction',infractionRouter)
rootRouter.use('/expense',expenseRouter)
rootRouter.use('/revenue',revenueRouter)
rootRouter.use('/accidents',AccidentRouter)
rootRouter.use('/maintenance',maintenanceRouter)
rootRouter.use('/agencies',AgencyRouter)

export default rootRouter;