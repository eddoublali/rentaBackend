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
    origin: "https://rentamanager.ma/", // Replace with your frontend URL
    credentials: true, // If you're using cookies or auth headers
}));
// root router
app.use("/api", routes_1.default);
console.log("Maintenance routes mounted at /api/maintenance");
// not found Handler middleware
app.use(notFound);
// Error Handler middleware
app.use(errorsHanlder);
app.listen(secrets_1.PORT, () => {
    console.log(`Server is running on http://localhost:${secrets_1.PORT}`);
});
