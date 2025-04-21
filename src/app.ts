import express, { Express} from 'express';
import { PrismaClient } from '@prisma/client';
import { PORT } from './secrets';
import path from "path";
import cors from 'cors';
import rootRouter from './routes';
const {notFound,errorsHanlder}=require("./middleware/errors")


const app:Express = express();
export const prismaClient = new PrismaClient();

// Serve static files
// app.use("/uploads", express.static(path.resolve(__dirname, "../../uploads")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());


app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true // If you're using cookies or auth headers
}));
//root router
app.use('/api',rootRouter)


// not fund Handler middleware
app.use(notFound);
// Error Handler middleware
app.use(errorsHanlder);



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
