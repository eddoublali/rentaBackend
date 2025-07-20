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
exports.deleteClient = exports.getClientById = exports.getAllClients = exports.updateClient = exports.createClient = void 0;
const clientValidation_1 = require("./../schema/clientValidation");
const app_1 = require("..");
const zod_1 = require("zod");
/**
 * @desc Create a new client
 * @route POST /api/clients
 * @method POST
 * @access protected
 */
const createClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedClient = clientValidation_1.clientSchema.parse(req.body);
        console.log(validatedClient);
        if (req.body.blacklisted) {
            // Parse the string to boolean
            req.body.blacklisted = req.body.blacklisted === 'true' || req.body.blacklisted === '1';
        }
        const existingClient = yield app_1.prismaClient.client.findUnique({
            where: { email: validatedClient.email },
        });
        if (existingClient) {
            res.status(400).json({ message: 'Client with this email already exists' });
            return;
        }
        const files = req.files;
        const cinimage = (files === null || files === void 0 ? void 0 : files.cinimage) ? `/uploads/${files.cinimage[0].filename}` : '';
        const licenseimage = (files === null || files === void 0 ? void 0 : files.licenseimage) ? `/uploads/${files.licenseimage[0].filename}` : '';
        const client = yield app_1.prismaClient.client.create({
            data: Object.assign(Object.assign({}, validatedClient), { cinimage,
                licenseimage }),
        });
        console.log(client);
        res.status(201).json({ message: 'Client created successfully', client });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ message: 'Validation failed', errors: error.errors });
            return;
        }
        res.status(500).json({ message: 'Something went wrong', error });
    }
});
exports.createClient = createClient;
/**
 * @desc Update an existing client
 * @route PUT /api/clients/:id
 * @method PUT
 * @access protected
 */
const updateClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userId = Number(id);
        if (isNaN(userId)) {
            res.status(400).json({ message: 'Invalid Client ID' });
            return;
        }
        if (req.body.blacklisted) {
            // Parse the string to boolean
            req.body.blacklisted = req.body.blacklisted === 'true' || req.body.blacklisted === '1';
        }
        const validatedClient = clientValidation_1.clientUpdateSchema.parse(req.body);
        const existingClient = yield app_1.prismaClient.client.findUnique({
            where: { id: userId },
        });
        if (!existingClient) {
            res.status(404).json({ message: 'Client not found' });
            return;
        }
        if (existingClient.email !== validatedClient.email) {
            const clientWithEmail = yield app_1.prismaClient.client.findUnique({
                where: { email: validatedClient.email },
            });
            if (clientWithEmail) {
                res.status(400).json({ message: 'Client with this email already exists' });
                return;
            }
        }
        const files = req.files;
        const cinimage = (files === null || files === void 0 ? void 0 : files.cinimage) ? `/uploads/${files.cinimage[0].filename}` : existingClient.cinimage;
        const licenseimage = (files === null || files === void 0 ? void 0 : files.licenseimage) ? `/uploads/${files.licenseimage[0].filename}` : existingClient.licenseimage;
        const updatedClient = yield app_1.prismaClient.client.update({
            where: { id: userId },
            data: Object.assign(Object.assign({}, validatedClient), { cinimage,
                licenseimage, blacklisted: validatedClient.blacklisted }),
        });
        res.status(200).json({ message: 'Client updated successfully', updatedClient });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({ message: 'Validation failed', errors: error.errors });
            return;
        }
        res.status(500).json({ message: 'Something went wrong', error });
    }
});
exports.updateClient = updateClient;
/**
 * @desc Get all clients
 * @route GET /api/clients
 * @method GET
 * @access protected
 */
const getAllClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clients = yield app_1.prismaClient.client.findMany({
            include: {
                infractions: true,
                reservations: true,
                secondaryReservations: true,
                contracts: true,
                invoices: true,
                accidents: true,
            },
        });
        res.status(200).json({ message: 'Clients fetched successfully', clients });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getAllClients = getAllClients;
/**
 * @desc Get client by ID
 * @route GET /api/clients/:id
 * @method GET
 * @access protected
 */
const getClientById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userId = Number(id);
        if (isNaN(userId)) {
            res.status(400).json({ message: 'Invalid Client ID' });
        }
        const client = yield app_1.prismaClient.client.findUnique({
            where: { id: userId },
            include: {
                infractions: true,
                reservations: true,
                secondaryReservations: true,
                contracts: true,
                invoices: true,
                accidents: true,
            },
        });
        if (!client) {
            res.status(404).json({ message: 'Client not found' });
            return;
        }
        res.status(200).json({ message: 'Client fetched successfully', client });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getClientById = getClientById;
/**
* @desc Delete client by ID
* @route DELETE /api/clients/:id
* @method DELETE
* @access protected
*/
const deleteClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userId = Number(id);
        if (isNaN(userId)) {
            res.status(400).json({ message: 'Invalid Client ID' });
        }
        const existingClient = yield app_1.prismaClient.client.findUnique({
            where: { id: userId },
        });
        if (!existingClient) {
            res.status(404).json({ message: 'Client not found' });
            return;
        }
        yield app_1.prismaClient.client.delete({
            where: { id: userId },
        });
        res.status(200).json({ message: 'Client deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.deleteClient = deleteClient;
