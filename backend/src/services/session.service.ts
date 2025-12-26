import TherapySession from '../models/therapySession.model';
import { SaveSessionInput } from '../schemas/session.schema';

/**
 * Service: Create a new game session record
 */
export const createSession = async (patientId: string, data: SaveSessionInput) => {
    // We strictly spread the data to ensure we only save what was validated by Zod
    const session = await TherapySession.create({
        patientId,
        ...data
    });
    return session;
};

/**
 * Service: Fetch session history for a patient
 */
export const getPatientHistory = async (patientId: string, limit: number = 20) => {
    // Returns the most recent sessions first
    return await TherapySession.find({ patientId })
        .sort({ createdAt: -1 })
        .limit(limit);
};