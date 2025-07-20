import express, { Express } from "express";
import { PrismaClient } from "@prisma/client";
import { PORT } from "./secrets";
import path from "path";
import cors from "cors";
import rootRouter from "./routes";
const { notFound, errorsHanlder } = require("./middleware/errors");
import { setupPrismaMiddleware } from "./middleware/prismaMiddleware";

const app: Express = express();

// Initialize Prisma client and apply middleware
const prismaBase = new PrismaClient();
export const prismaClient = setupPrismaMiddleware(prismaBase);

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());

// Update your CORS configuration in src/app.ts
app.use(cors({
    origin: [
        "https://rentamanager.ma",
        "http://localhost:3000", // for local development
        "http://localhost:5173", // if using Vite
        "https://your-hostinger-domain.com" // replace with your actual domain
    ],
    credentials: true,
}));
// root router
app.use("/api", rootRouter);
console.log("Maintenance routes mounted at /api/maintenance");

// not found Handler middleware
app.use(notFound);
// Error Handler middleware
app.use(errorsHanlder);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
