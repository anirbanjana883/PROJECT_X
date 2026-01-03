import { Router } from 'express';
import { 
    registerHandler, 
    loginHandler, 
    logoutHandler, 
    getMeHandler,
    getMyPatientsHandler, 
    getIntakeQueueHandler,
    claimPatientHandler
} from '../controllers/auth.controller';
import validate from '../middlewares/validateResource';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// Public Routes
router.post('/register', validate(registerSchema), registerHandler);
router.post('/login', validate(loginSchema), loginHandler);
router.get('/logout', logoutHandler);

// Protected Routes
router.get('/me', protect, getMeHandler);

// Add the Patient Fetch Route
router.get('/my-patients', protect, authorize('doctor'), getMyPatientsHandler);

//  QUEUE ROUTES (Doctor Only)
router.get('/intake-queue', protect, authorize('doctor'), getIntakeQueueHandler);
router.post('/claim-patient', protect, authorize('doctor'), claimPatientHandler);

export default router;