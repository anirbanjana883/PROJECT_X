import { Router } from 'express';
import passport from 'passport';
import { 
    registerHandler, 
    loginHandler, 
    logoutHandler, 
    getMeHandler,
    getMyPatientsHandler, 
    getIntakeQueueHandler,
    claimPatientHandler,
    googleCallbackHandler // <--- Imported
} from '../controllers/auth.controller';
import validate from '../middlewares/validateResource';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { protect, authorize } from '../middlewares/auth.middleware';

const router = Router();

// --- GOOGLE AUTH ROUTES ---
router.get('/google', passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false 
}));

router.get('/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    googleCallbackHandler // Uses the controller we just made
);

// --- TRADITIONAL AUTH ---
router.post('/register', validate(registerSchema), registerHandler);
router.post('/login', validate(loginSchema), loginHandler);
router.get('/logout', logoutHandler);

// --- PROTECTED ROUTES ---
router.get('/me', protect, getMeHandler);
router.get('/my-patients', protect, authorize('doctor'), getMyPatientsHandler);
router.get('/intake-queue', protect, authorize('doctor'), getIntakeQueueHandler);
router.post('/claim-patient', protect, authorize('doctor'), claimPatientHandler);

export default router;