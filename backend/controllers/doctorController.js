import User from '../models/userModel.js'; // Use your userModel.js path
import { StatusCodes } from 'http-status-codes';

// --- GET A DOCTOR'S ASSIGNED PATIENTS ---
export const getMyPatients = async (req, res) => {
    try {
        const doctorId = req.user.userId;

        // Find the doctor and 'populate' the assignedPatients field.
        // This replaces the patient IDs with the actual patient documents.
        const doctor = await User.findById(doctorId)
            .populate({
                path: 'assignedPatients',
                select: 'name email username createdAt' // Only send these fields
            });

        if (!doctor) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Doctor not found' });
        }

        res.status(StatusCodes.OK).json({ patients: doctor.assignedPatients });

    } catch (error) {
        console.error("Get Patients Error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch patients' });
    }
};

// --- GET A SPECIFIC PATIENT'S FULL HISTORY (for Doctor) ---
export const getPatientHistory = async (req, res) => {
    try {
        const { patientId } = req.params;
        const doctorId = req.user.userId;

        // --- Security Check ---
        // 1. Find the doctor
        const doctor = await User.findById(doctorId);
        // 2. Check if the patientId is in the doctor's 'assignedPatients' array
        const isAssigned = doctor.assignedPatients.some(
            id => id.toString() === patientId
        );

        if (!isAssigned) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'You are not assigned to this patient' });
        }

        // --- Fetch Data ---
        // 1. Get Patient's Info
        const patient = await User.findById(patientId).select('name email createdAt');
        
        // 2. Get Patient's Session History
        const history = await TherapySession.find({ patientId: patientId })
            .sort({ createdAt: -1 })
            .limit(50); // Get last 50 sessions

        res.status(StatusCodes.OK).json({ patient, history });

    } catch (error) {
        console.error("Get Patient History Error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch patient history' });
    }
};

