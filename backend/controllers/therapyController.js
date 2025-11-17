import TherapySession from '../models/therapySessionModel.js';
import { StatusCodes } from 'http-status-codes';

// --- SAVE SESSION ---
export const saveSession = async (req, res) => {
    try {
        const { gameId, gameName, score, durationPlayed, status } = req.body;
        
        // req.user comes from the 'protect' middleware
        const patientId = req.user.userId;

        const session = await TherapySession.create({
            patientId,
            gameId,
            gameName,
            score,
            durationPlayed,
            status
        });

        res.status(StatusCodes.CREATED).json({ 
            message: 'Session saved successfully', 
            session 
        });

    } catch (error) {
        console.error("Error saving session:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to save progress' });
    }
};

// --- GET PATIENT HISTORY ---
export const getPatientHistory = async (req, res) => {
    try {
        const patientId = req.user.userId;
        
        // Get last 20 sessions, sorted by newest
        const history = await TherapySession.find({ patientId })
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(StatusCodes.OK).json({ history });

    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch history' });
    }
};