import express, { Express} from 'express';
import { PrismaClient } from '@prisma/client';
import { PORT } from './secrets';
import rootRouter from './routes';
const {notFound,errorsHanlder}=require("./middleware/errors")


const app:Express = express();
export const prismaClient = new PrismaClient();

app.use(express.json());

//root router
app.use('/api',rootRouter)


// not fund Handler middleware
app.use(notFound);
// Error Handler middleware
app.use(errorsHanlder);



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
