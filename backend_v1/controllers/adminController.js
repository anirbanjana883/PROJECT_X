import User from '../models/userModel.js';
import { StatusCodes } from 'http-status-codes';

// --- GET ALL USERS ---
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.status(StatusCodes.OK).json({ users });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Server Error' });
    }
};

// --- UPDATE USER ROLE ---
export const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body; // Expecting { role: 'doctor' } or 'patient'

        const user = await User.findById(userId);

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();

        res.status(StatusCodes.OK).json({ message: `User promoted to ${role}`, user });

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Update failed' });
    }
};