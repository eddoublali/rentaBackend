"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaClient = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const secrets_1 = require("./secrets");
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const { notFound, errorsHanlder } = require("./middleware/errors");
const prismaMiddleware_1 = require("./middleware/prismaMiddleware");
const app = (0, express_1.default)();
// Initialize Prisma client and apply middleware
const prismaBase = new client_1.PrismaClient();
exports.prismaClient = (0, prismaMiddleware_1.setupPrismaMiddleware)(prismaBase);
// Serve static files
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "uploads")));
app.use(express_1.default.json());
app.use((0, cors_1.default)({
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
app.use("/api", routes_1.default);
// Not found Handler middleware
app.use(notFound);
// Error Handler middleware
app.use(errorsHanlder);
// For local development
if (process.env.NODE_ENV !== 'production') {
    const port = secrets_1.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}
// Export for Vercel
exports.default = app;
