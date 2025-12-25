import express from 'express';
import { getMyPatients, getPatientHistory } from '../controllers/doctorController.js';
import { protect } from '../middleware/authMiddleWare.js';
import { doctor } from '../middleware/doctorMiddleWare.js';

const doctorRouter = express.Router();

doctorRouter.get('/my-patients', protect, doctor, getMyPatients);
doctorRouter.get('/patient/:patientId/history', protect, doctor, getPatientHistory);

export default doctorRouter;