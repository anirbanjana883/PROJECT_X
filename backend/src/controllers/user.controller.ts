// src/controllers/user.controller.ts
import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';

export const updateTriageHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user._id; // The logged-in patient
        const { medicalCondition, severity } = req.body;

        // Update the user's profile with their self-reported condition
        const user = await User.findByIdAndUpdate(
            userId, 
            { medicalCondition, severity }, 
            { new: true } // Return the updated user
        );

        res.status(200).json({
            success: true,
            message: "Medical profile updated. Waiting for doctor assignment.",
            data: user 
        });

    } catch (error) {
        next(error);
    }
};