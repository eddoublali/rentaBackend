import express from "express";
import { PrismaClient } from "@prisma/client";
import { PORT } from "./secrets";
import path from "path";
import cors from "cors";
import routes from "./routes";
const { notFound, errorsHanlder } = require("./middleware/errors");
import { setupPrismaMiddleware } from "./middleware/prismaMiddleware";

const app = express();

// Initialize Prisma client and apply middleware
const prismaBase = new PrismaClient();
export const prismaClient = setupPrismaMiddleware(prismaBase);

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());

app.use(cors({
    origin: [
        "https://rentamanager.ma",
        "https://rentamanager.ma/",
        "http://localhost:3000",
        "http://localhost:5173"
    ],
    credentials: true,
}));

// Health check route for debugging
app.get("/", (req, res) => {
    res.json({ message: "API is working!", timestamp: new Date().toISOString() });
});

// Root router
app.use("/api", routes);

// Not found Handler middleware
app.use(notFound);

// Error Handler middleware
app.use(errorsHanlder);

// For local development
if (process.env.NODE_ENV !== 'production') {
    const port = PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}

// Export for Vercel
export default app;