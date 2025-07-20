"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAgency = exports.getAgency = exports.updateAgency = exports.createAgency = void 0;
const app_1 = require("..");
const agencyValidation_1 = require("../schema/agencyValidation");
const zod_1 = require("zod");
/**
 * @desc Create a new agency (singleton with ID 1)
 * @route POST /api/agencies
 * @access Protected
 */
const createAgency = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const existingAgency = yield app_1.prismaClient.agency.findUnique({ where: { id: 1 } });
        if (existingAgency) {
            res.status(400).json({
                message: "Agency already exists. Use the update endpoint instead.",
            });
        }
        const validated = agencyValidation_1.agencySchema.parse(req.body);
        const files = req.files;
        const logo = ((_b = (_a = files === null || files === void 0 ? void 0 : files.logo) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.filename) ? `/uploads/${files.logo[0].filename}` : null;
        const agency = yield app_1.prismaClient.agency.create({
            data: Object.assign(Object.assign({ id: 1 }, validated), { logo }),
        });
        res.status(201).json({ data: agency });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ message: error.errors.map(e => e.message).join(", ") });
        }
        console.error("Error creating agency:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createAgency = createAgency;
/**
 * @desc Update agency (always ID 1)
 * @route PUT /api/agencies/1
 * @access Protected
 */
const updateAgency = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const agency = yield app_1.prismaClient.agency.findUnique({ where: { id: 1 } });
        if (!agency) {
            res.status(404).json({ message: "Agency not found" });
        }
        const validated = agencyValidation_1.agencyUpdateSchema.parse(req.body);
        const files = req.files;
        const logo = ((_b = (_a = files === null || files === void 0 ? void 0 : files.logo) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.filename) ? `/uploads/${files.logo[0].filename}` : (agency === null || agency === void 0 ? void 0 : agency.logo) || null;
        const updatedAgency = yield app_1.prismaClient.agency.update({
            where: { id: 1 },
            data: Object.assign(Object.assign({}, validated), { logo }),
        });
        res.status(200).json({ data: updatedAgency });
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ message: error.errors.map(e => e.message).join(", ") });
        }
        console.error("Error updating agency:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateAgency = updateAgency;
/**
 * @desc Get agency by ID (always 1)
 * @route GET /api/agencies
 * @access Protected
 */
const getAgency = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agency = yield app_1.prismaClient.agency.findUnique({ where: { id: 1 } });
        if (!agency) {
            res.status(404).json({ message: "Agency not found" });
        }
        res.status(200).json({ data: agency });
    }
    catch (error) {
        console.error("Error fetching agency:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAgency = getAgency;
/**
 * @desc Delete agency (only ID 1)
 * @route DELETE /api/agencies/1
 * @access Protected
 */
const deleteAgency = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (id !== '1') {
            res.status(400).json({ message: "Only agency with ID 1 can be deleted" });
        }
        const agency = yield app_1.prismaClient.agency.findUnique({ where: { id: 1 } });
        if (!agency) {
            res.status(404).json({ message: "Agency not found" });
        }
        yield app_1.prismaClient.agency.delete({ where: { id: 1 } });
        res.status(200).json({ message: "Agency deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting agency:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteAgency = deleteAgency;
