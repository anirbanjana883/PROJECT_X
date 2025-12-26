import { Request, Response, NextFunction } from 'express';
import * as sessionService from '../services/session.service';
import { SaveSessionInput } from '../schemas/session.schema';

// @desc    Save a game session result
// @route   POST /api/v1/sessions/save
// @access  Patient Only
export const saveSessionHandler = async (
    req: Request<{}, {}, SaveSessionInput>, 
    res: Response, 
    next: NextFunction
) => {
    try {
        // 1. Get User ID safely (from our strict auth middleware)
        const patientId = req.user!._id.toString();

        // 2. Call Service
        const session = await sessionService.createSession(patientId, req.body);

        // 3. Send Response
        res.status(201).json({
            success: true,
            message: "Session saved successfully",
            data: session
        });

    } catch (error) {
        next(error);
    }
};

// @desc    Get history of played sessions
// @route   GET /api/v1/sessions/history
// @access  Patient Only
export const getSessionHistoryHandler = async (
    req: Request, 
    res: Response, 
    next: NextFunction
) => {
    try {
        const patientId = req.user!._id.toString();

        // Call Service
        const sessions = await sessionService.getPatientHistory(patientId);

        res.status(200).json({
            success: true,
            count: sessions.length,
            data: sessions
        });
    } catch (error) {
        next(error);
    }
};