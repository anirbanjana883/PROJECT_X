import { Request, Response, NextFunction } from 'express';
import * as therapyService from '../services/therapy.service'; // Import the Service
import { AssignTherapyInput } from '../schemas/therapy.schema';
import { LogSessionInput } from '../schemas/therapy.schema';

export const assignTherapyHandler = async (
  req: Request<{}, {}, AssignTherapyInput>, 
  res: Response, 
  next: NextFunction
) => {
    try {
        const doctorId = (req as any).user._id;

        const assignment = await therapyService.assignTherapy(doctorId, req.body);

        res.status(201).json({
            success: true,
            message: `Therapy assigned successfully for ${assignment.gameName}`,
            data: assignment
        });

    } catch (error) {
        next(error);
    }
};

export const getMyTherapyPlanHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const patientId = (req as any).user._id;

        const plan = await therapyService.getActiveTherapyPlan(patientId);
        
        res.status(200).json({ 
            success: true, 
            count: plan.length,
            data: plan 
        });

    } catch (error) {
        next(error);
    }
};

export const logSessionHandler = async (
  req: Request<{}, {}, LogSessionInput>, 
  res: Response, 
  next: NextFunction
) => {
    try {
        const patientId = (req as any).user._id; // From Auth Middleware

        const sessionLog = await therapyService.logSessionResult(patientId, req.body);

        res.status(201).json({
            success: true,
            message: "Session logged successfully",
            data: sessionLog
        });

    } catch (error) {
        next(error);
    }
};

export const getHistoryHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const patientId = (req as any).user._id;
        
        const history = await therapyService.getPatientHistory(patientId);
        
        res.status(200).json({ 
            success: true, 
            count: history.length, 
            data: history 
        });

    } catch (error) {
        next(error);
    }
};