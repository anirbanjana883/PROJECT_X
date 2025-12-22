import express from 'express';
import { 
    saveSession, 
    getMyHistory,       
    assignTherapy,      
    getPatientAssignments, 
    getMyTherapyPlan    
} from '../controllers/therapyController.js';
import { protect } from '../middleware/authMiddleWare.js';
import { doctor } from '../middleware/doctorMiddleWare.js'; 

const therapyRouter = express.Router();

// ==========================================
//  PATIENT ROUTES
// ==========================================
// Save game result
therapyRouter.post('/save-session', protect, saveSession);

// Get my past sessions
therapyRouter.get('/history', protect, getMyHistory); 

// Get my active game settings (The "Digital Prescription")
therapyRouter.get('/plan', protect, getMyTherapyPlan); 


// ==========================================
//  DOCTOR ROUTES
// ==========================================
// Assign specific settings to a patient
therapyRouter.post('/assign', protect, doctor, assignTherapy);

// View assignments for a specific patient
therapyRouter.get('/patient/:patientId/assignments', protect, doctor, getPatientAssignments);

export default therapyRouter;