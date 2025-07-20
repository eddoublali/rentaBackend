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
exports.getOneRevenue = exports.getSpecificMonthRevenue = exports.getMonthlyRevenue = exports.getAllRevenues = void 0;
const app_1 = require("../app");
/**
 * @desc Get all revenues with monthly breakdown
 * @route GET /api/revenue/
 */
const getAllRevenues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const revenues = yield app_1.prismaClient.revenue.findMany({
            include: {
                client: true,
                contract: true,
                vehicle: true
            }
        });
        res.status(200).json({
            message: 'All revenues fetched successfully',
            data: revenues
        });
    }
    catch (error) {
        console.error('Error fetching revenues:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getAllRevenues = getAllRevenues;
/**
 * @desc Get monthly revenue breakdown
 * @route GET /api/revenue/monthly
 */
const getMonthlyRevenue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get year from query param or use current year
        const year = req.query.year ? Number(req.query.year) : new Date().getFullYear();
        // Get all revenues for the specified year
        const revenues = yield app_1.prismaClient.revenue.findMany({
            where: {
                createdAt: {
                    gte: new Date(`${year}-01-01`),
                    lt: new Date(`${year + 1}-01-01`)
                }
            },
            select: {
                amount: true,
                createdAt: true
            }
        });
        // Initialize monthly totals with type
        const monthlyRevenue = {
            Jan: 0,
            Feb: 0,
            Mar: 0,
            Apr: 0,
            May: 0,
            Jun: 0,
            Jul: 0,
            Aug: 0,
            Sep: 0,
            Oct: 0,
            Nov: 0,
            Dec: 0
        };
        // Define month names array
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        // Calculate monthly totals
        revenues.forEach((revenue) => {
            const month = revenue.createdAt.getMonth(); // 0-11 (Jan-Dec)
            const monthName = monthNames[month];
            monthlyRevenue[monthName] += Number(revenue.amount);
        });
        res.status(200).json({
            message: 'Monthly revenue fetched successfully',
            year: year,
            data: monthlyRevenue
        });
    }
    catch (error) {
        console.error('Error fetching monthly revenue:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getMonthlyRevenue = getMonthlyRevenue;
/**
 * @desc Get revenue for specific month and year
 * @route GET /api/revenue/monthly/:year/:month
 */
const getSpecificMonthRevenue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const year = Number(req.params.year);
        const month = Number(req.params.month);
        if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
            res.status(400).json({ message: 'Invalid year or month' });
            return;
        }
        // Get revenues for the specified month and year
        const revenues = yield app_1.prismaClient.revenue.findMany({
            where: {
                createdAt: {
                    gte: new Date(`${year}-${month.toString().padStart(2, '0')}-01`),
                    lt: new Date(month === 12 ? `${year + 1}-01-01` : `${year}-${(month + 1).toString().padStart(2, '0')}-01`)
                }
            },
            include: {
                client: true,
                contract: true,
                vehicle: true
            }
        });
        // Calculate total revenue for this month
        const totalAmount = revenues.reduce((total, rev) => total + Number(rev.amount), 0);
        res.status(200).json({
            message: `Revenue for ${month}/${year} fetched successfully`,
            total: totalAmount,
            count: revenues.length,
            data: revenues
        });
    }
    catch (error) {
        console.error('Error fetching specific month revenue:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getSpecificMonthRevenue = getSpecificMonthRevenue;
/**
 * @desc Get one revenue
 * @route GET /api/revenue/:id
 */
const getOneRevenue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const revenueId = Number(req.params.id);
        if (isNaN(revenueId)) {
            res.status(400).json({ message: 'Invalid revenue ID' });
            return;
        }
        const revenue = yield app_1.prismaClient.revenue.findUnique({
            where: { id: revenueId },
            include: {
                client: true,
                contract: true,
                vehicle: true
            }
        });
        if (!revenue) {
            res.status(404).json({ message: 'Revenue not found' });
            return;
        }
        res.status(200).json({
            message: 'Revenue fetched successfully',
            data: revenue
        });
    }
    catch (error) {
        console.error('Error fetching revenue:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getOneRevenue = getOneRevenue;
