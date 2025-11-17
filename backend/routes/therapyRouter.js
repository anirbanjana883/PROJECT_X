import express from 'express';
import { saveSession, getPatientHistory } from '../controllers/therapyController.js';
import { protect } from '../middleware/authMiddleWare.js';

const therapyRouter = express.Router();

// Both routes are protected (must be logged in)
therapyRouter.post('/save-session', protect, saveSession);
therapyRouter.get('/history', protect, getPatientHistory);

export default therapyRouter;