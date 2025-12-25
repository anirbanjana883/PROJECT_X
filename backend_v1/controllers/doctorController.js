import User from '../models/userModel.js';
import { StatusCodes } from 'http-status-codes';
import TherapySession from '../models/therapySessionModel.js';

// --- GET A DOCTOR'S ASSIGNED PATIENTS ---
export const getMyPatients = async (req, res) => {
    try {
        // 1. Get ID from the user object attached by middleware
        // We check for both _id (Mongoose) and userId (Legacy) to be safe
        const doctorId = req.user._id || req.user.userId;

        // 2. Fetch Doctor & Populate Patients
        const doctor = await User.findById(doctorId)
            .populate({
                path: 'assignedPatients',
                select: 'name email username createdAt'
            });

        if (!doctor) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: 'Doctor not found' });
        }

        res.status(StatusCodes.OK).json({ patients: doctor.assignedPatients || [] });

    } catch (error) {
        console.error("Get Patients Error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch patients' });
    }
};



export const getPatientHistory = async (req, res) => {
    try {
        const { patientId } = req.params;
        const doctorId = req.user._id || req.user.userId; // <-- FIX HERE TOO

        const doctor = await User.findById(doctorId);
        
        // Safety check if assignedPatients is undefined
        const assignedList = doctor.assignedPatients || [];
        
        const isAssigned = assignedList.some(
            id => id.toString() === patientId
        );

        if (!isAssigned) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'You are not assigned to this patient' });
        }

        const patient = await User.findById(patientId).select('name email createdAt');
        const history = await TherapySession.find({ patientId: patientId })
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(StatusCodes.OK).json({ patient, history });

    } catch (error) {
        console.error("Get Patient History Error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch patient history' });
    }
};