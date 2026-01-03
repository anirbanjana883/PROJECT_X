import { Request, Response, NextFunction } from 'express';
import * as therapyService from '../services/therapy.service';
import { AssignTherapyInput, LogSessionInput } from '../schemas/therapy.schema';

// --- Doctor: Assign Therapy ---
export const assignTherapyHandler = async (
  req: Request<{}, {}, AssignTherapyInput>, 
  res: Response, 
  next: NextFunction
) => {
    try {
        // Assuming your auth middleware populates user
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

// --- Patient: Get My Plan ---
export const getMyTherapyPlanHandler = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
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

// --- Patient: Save Game Result ---
export const logSessionHandler = async (
  req: Request<{}, {}, LogSessionInput>, 
  res: Response, 
  next: NextFunction
) => {
    try {
        const patientId = (req as any).user._id;

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

// --- Patient: Get History ---
export const getHistoryHandler = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
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