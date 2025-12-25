import TherapySession from '../models/therapySessionModel.js'; // Your History Model
import TherapyAssignment from '../models/TherapyAssignment.js'; // Your Settings Model
import { StatusCodes } from 'http-status-codes';

// ==========================================
//  PART 1: DOCTOR ACTIONS (Prescriptions)
// ==========================================

// --- ASSIGN or UPDATE Game Settings ---
export const assignTherapy = async (req, res) => {
    try {
        const { patientId, gameId, settings, clinicalNote } = req.body;
        const doctorId = req.user.userId;

        // 1. Check if an active assignment already exists for this game/patient
        let assignment = await TherapyAssignment.findOne({
            patientId,
            gameId,
            isActive: true
        });

        if (assignment) {
            // UPDATE existing assignment
            assignment.settings = settings;
            assignment.clinicalNote = clinicalNote;
            assignment.doctorId = doctorId; // Update who modified it last
            await assignment.save();
            
            return res.status(StatusCodes.OK).json({ 
                message: 'Therapy settings updated', 
                assignment 
            });
        }

        // CREATE new assignment
        assignment = await TherapyAssignment.create({
            patientId,
            doctorId,
            gameId,
            settings,
            clinicalNote
        });

        res.status(StatusCodes.CREATED).json({ 
            message: 'Therapy assigned successfully', 
            assignment 
        });

    } catch (error) {
        console.error("Assign Error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to assign therapy' });
    }
};

// --- GET ASSIGNMENTS FOR A PATIENT (For Doctor View) ---
export const getPatientAssignments = async (req, res) => {
    try {
        const { patientId } = req.params;
        
        const assignments = await TherapyAssignment.find({ 
            patientId, 
            isActive: true 
        });

        res.status(StatusCodes.OK).json({ assignments });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch assignments' });
    }
};


// ==========================================
//  PART 2: PATIENT ACTIONS (Game Logic)
// ==========================================

// --- GET MY ASSIGNED GAMES (With Settings) ---
// This is what the Game Engine calls before starting
export const getMyTherapyPlan = async (req, res) => {
    try {
        const patientId = req.user.userId;

        // Fetch all active assignments
        const assignments = await TherapyAssignment.find({ 
            patientId, 
            isActive: true 
        });

        res.status(StatusCodes.OK).json({ assignments });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch therapy plan' });
    }
};

// --- SAVE SESSION RESULT (Game Over) ---
export const saveSession = async (req, res) => {
    try {
        const { gameId, gameName, score, durationPlayed, status } = req.body;
        const patientId = req.user.userId;

        // Optional: Link to the active assignment ID for data tracking
        const activeAssignment = await TherapyAssignment.findOne({
            patientId,
            gameId,
            isActive: true
        });

        const session = await TherapySession.create({
            patientId,
            assignmentId: activeAssignment ? activeAssignment._id : null,
            gameId,
            gameName,
            score,
            durationPlayed,
            status
        });

        res.status(StatusCodes.CREATED).json({ 
            message: 'Progress saved', 
            session 
        });

    } catch (error) {
        console.error("Save Session Error:", error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to save progress' });
    }
};

// --- GET MY HISTORY (Profile Page) ---
export const getMyHistory = async (req, res) => {
    try {
        const patientId = req.user.userId;
        const history = await TherapySession.find({ patientId })
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(StatusCodes.OK).json({ history });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Failed to fetch history' });
    }
};