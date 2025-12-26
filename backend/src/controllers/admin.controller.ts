import { Request, Response, NextFunction } from 'express';
import { applyForDoctor, approveDoctorAccess, getAllUsers } from '../services/admin.service';
import { DoctorRequestInput } from '../schemas/auth.schema';

// 1. USER: Request Access
export const requestAccessHandler = async (
    req: Request<{}, {}, DoctorRequestInput>, 
    res: Response, 
    next: NextFunction
) => {
    try {
        const userId = (req as any).user._id;
        
        await applyForDoctor(userId, req.body);

        res.status(200).json({
            success: true,
            message: 'Application submitted successfully. Waiting for Admin approval.'
        });
    } catch (error) {
        next(error);
    }
};

// 2. ADMIN: Approve Doctor
export const approveHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        
        const user = await approveDoctorAccess(userId);

        res.status(200).json({
            success: true,
            message: `User ${user.name} promoted to Doctor`,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// 3. ADMIN: Get All Users
export const getAllUsersHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await getAllUsers();
        res.status(200).json({ success: true, users });
    } catch (error) {
        next(error);
    }
};