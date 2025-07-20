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
exports.deleteAllInvoices = exports.deleteOneInvoice = exports.getOneInvoice = exports.getAllInvoices = exports.updateInvoice = exports.createInvoice = void 0;
const invoiceValidation_1 = require("./../schema/invoiceValidation");
const app_1 = require("..");
const zod_1 = require("zod");
/**
 * @desc Create a new invoice // Factures
 * @route POST /api/invoice // Factures
 * @method POST
 * @access protected
 */
const createInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the request body with Zod
        const validatedInvoice = invoiceValidation_1.invoiceSchema.parse(req.body);
        // Check if the related reservation exists
        const reservationExists = yield app_1.prismaClient.reservation.findUnique({
            where: { id: validatedInvoice.reservationId },
        });
        if (!reservationExists) {
            res.status(404).json({ message: 'Reservation not found' });
            return;
        }
        // Check if the related client exists
        const clientExists = yield app_1.prismaClient.client.findUnique({
            where: { id: validatedInvoice.clientId },
        });
        if (!clientExists) {
            res.status(404).json({ message: 'Client not found' });
            return;
        }
        // Create the new invoice in the database
        const newInvoice = yield app_1.prismaClient.invoice.create({
            data: validatedInvoice,
        });
        res.status(201).json({
            message: 'Invoice created successfully',
            data: newInvoice,
        });
    }
    catch (error) {
        // Handle Zod validation errors
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ message: 'Validation failed', errors: error.errors });
            return;
        }
        // Handle other errors
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
            return;
        }
        res.status(500).json({
            message: 'Something went wrong',
        });
    }
});
exports.createInvoice = createInvoice;
/**
 * @desc Update an existing invoice
 * @route PUT /api/invoice/:id
 * @method PUT
 * @access protected
 */
const updateInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const invoiceId = Number(id);
        if (!invoiceId) {
            res.status(400).json({ message: 'Invalid invoice id' });
        }
        // Validate the request body with Zod
        const validatedInvoice = invoiceValidation_1.invoiceUpdateSchema.parse(req.body);
        // Check if the reservationId and clientId are provided in the request body
        const reservationId = validatedInvoice.reservationId || req.body.reservationId;
        const clientId = validatedInvoice.clientId || req.body.clientId;
        if (!reservationId || !clientId) {
            res.status(400).json({ message: 'reservationId and clientId are required' });
            return;
        }
        // Check if the reservation exists
        const reservationExists = yield app_1.prismaClient.reservation.findUnique({
            where: { id: reservationId },
        });
        if (!reservationExists) {
            res.status(404).json({ message: 'Reservation not found' });
            return;
        }
        // Check if the client exists
        const clientExists = yield app_1.prismaClient.client.findUnique({
            where: { id: clientId },
        });
        if (!clientExists) {
            res.status(404).json({ message: 'Client not found' });
            return;
        }
        // Check if the invoice exists
        const invoiceExists = yield app_1.prismaClient.invoice.findUnique({
            where: { id: Number(id) },
        });
        if (!invoiceExists) {
            res.status(404).json({ message: 'Invoice not found' });
            return;
        }
        // Update the invoice in the database
        const updatedInvoice = yield app_1.prismaClient.invoice.update({
            where: { id: Number(id) },
            data: validatedInvoice,
        });
        res.status(200).json({
            message: 'Invoice updated successfully',
            data: updatedInvoice,
        });
    }
    catch (error) {
        // Handle Zod validation errors
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ message: 'Validation failed', errors: error.errors });
            return;
        }
        // Handle other errors
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
            return;
        }
        res.status(500).json({
            message: 'Something went wrong',
        });
    }
});
exports.updateInvoice = updateInvoice;
/**
* @desc Get all invoices
* @route GET /api/invoice
* @method GET
* @access protected
*/
const getAllInvoices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all invoices from the database
        const invoices = yield app_1.prismaClient.invoice.findMany({
            include: {
                reservation: true, // You can include related fields like reservation
                client: true, // Include client if needed
            },
        });
        if (invoices.length === 0) {
            res.status(404).json({ message: 'No invoices found' });
            return;
        }
        res.status(200).json({
            message: 'Invoices retrieved successfully',
            data: invoices,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Something went wrong',
        });
    }
});
exports.getAllInvoices = getAllInvoices;
/**
* @desc Get a single invoice by ID
* @route GET /api/invoice/:id
* @method GET
* @access protected
*/
const getOneInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Get the invoice ID from the request parameters
        const invoiceId = Number(id);
        if (!invoiceId) {
            res.status(400).json({ message: 'Invalid invoice id' });
        }
        // Fetch the invoice with the given ID
        const invoice = yield app_1.prismaClient.invoice.findUnique({
            where: { id: Number(id) },
            include: {
                reservation: true, // Include related reservation details
                client: true, // Include related client details
            },
        });
        if (!invoice) {
            res.status(404).json({ message: `Invoice with ID ${id} not found` });
            return;
        }
        res.status(200).json({
            message: 'Invoice retrieved successfully',
            data: invoice,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Something went wrong',
        });
    }
});
exports.getOneInvoice = getOneInvoice;
/**
* @desc Delete a single invoice by ID
* @route DELETE /api/invoice/:id
* @method DELETE
* @access protected
*/
const deleteOneInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Get the invoice ID from the request parameters
        const invoiceId = Number(id);
        if (!invoiceId) {
            res.status(400).json({ message: 'Invalid invoice ID' });
            return;
        }
        // Check if the invoice exists
        const invoiceExists = yield app_1.prismaClient.invoice.findUnique({
            where: { id: invoiceId },
        });
        if (!invoiceExists) {
            res.status(404).json({ message: `Invoice with ID ${invoiceId} not found` });
            return;
        }
        // Delete the invoice with the given ID
        const deletedInvoice = yield app_1.prismaClient.invoice.delete({
            where: { id: invoiceId },
        });
        res.status(200).json({
            message: `Invoice with ID ${invoiceId} deleted successfully`,
            data: deletedInvoice,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Something went wrong',
        });
    }
});
exports.deleteOneInvoice = deleteOneInvoice;
/**
 * @desc Delete all invoices
 * @route DELETE /api/invoices
 * @method DELETE
 * @access protected
 */
const deleteAllInvoices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Delete all invoices from the database
        const deletedInvoices = yield app_1.prismaClient.invoice.deleteMany();
        res.status(200).json({
            message: `${deletedInvoices.count} invoices deleted successfully`,
            data: deletedInvoices,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Something went wrong',
        });
    }
});
exports.deleteAllInvoices = deleteAllInvoices;
