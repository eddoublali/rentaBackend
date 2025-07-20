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
exports.deleteUser = exports.updateUser = exports.getOneUser = exports.getAllUsers = void 0;
const app_1 = require("../app");
const bcrypt_1 = require("bcrypt");
/**
 * @desc Get all users
 * @route GET /api/users
 * @method GET
 * @access protected
 */
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all users from the database
        const users = yield app_1.prismaClient.user.findMany();
        res.status(200).json({ message: 'Users fetched successfully', users });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getAllUsers = getAllUsers;
/**
* @desc Get a single user by ID
* @route GET /api/users/:id
* @method GET
* @access protected
*/
const getOneUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Get the user ID from the URL parameters
        const userId = Number(id);
        if (isNaN(userId)) {
            res.status(400).json({ message: 'Invalid user ID' });
        }
        // Fetch the user from the database by ID
        const user = yield app_1.prismaClient.user.findUnique({
            where: { id: userId }, // Ensure the id is a number
        });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User fetched successfully', user: Object.assign(Object.assign({}, user), { password: user === null || user === void 0 ? void 0 : user.password // Send the password as it is, unencrypted
             }) });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getOneUser = getOneUser;
/**
 * @desc Update an existing user
 * @route PUT /api/users/:id
 * @method PUT
 * @access protected
 */
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { id } = req.params; // Get the user ID from the URL parameters
        const userId = Number(id);
        if (isNaN(userId)) {
            res.status(400).json({ message: 'Invalid user ID' });
        }
        const { email, name, password, role } = req.body; // Get updated data
        // Validate the user data
        const userExists = yield app_1.prismaClient.user.findUnique({
            where: { id: userId },
        });
        if (!userExists) {
            res.status(404).json({ message: 'User not found' });
        }
        // Check if the email is being changed and if it already exists
        if (email !== (userExists === null || userExists === void 0 ? void 0 : userExists.email)) {
            const emailExists = yield app_1.prismaClient.user.findUnique({
                where: { email },
            });
            if (emailExists) {
                res.status(400).json({ message: 'Email already exists' });
            }
        }
        // Hash the new password if provided
        let updatedData = { email, name, role };
        if (password) {
            updatedData.password = (0, bcrypt_1.hashSync)(password, 10);
        }
        // Update the user in the database
        const updatedUser = yield app_1.prismaClient.user.update({
            where: { id: Number(id) },
            data: updatedData,
        });
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    }
    catch (error) {
        console.error(error);
        // Handle the Prisma unique constraint error
        if (error.code === 'P2002' && ((_b = (_a = error.meta) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.includes('email'))) {
            res.status(400).json({ message: 'Email already exists' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.updateUser = updateUser;
/**
* @desc Delete a user by ID
* @route DELETE /api/users/:id
* @method DELETE
* @access protected
*/
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Get the user ID from the URL parameters
        const userId = Number(id);
        if (isNaN(userId)) {
            res.status(400).json({ message: 'Invalid user ID' });
        }
        // Check if the user exists
        const userExists = yield app_1.prismaClient.user.findUnique({
            where: { id: userId },
        });
        if (!userExists) {
            res.status(404).json({ message: 'User not found' });
        }
        // Delete the user from the database
        yield app_1.prismaClient.user.delete({
            where: { id: Number(id) },
        });
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.deleteUser = deleteUser;
