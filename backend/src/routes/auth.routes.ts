import { Router } from 'express';
import { 
    registerHandler, 
    loginHandler, 
    logoutHandler, 
    getMeHandler 
} from '../controllers/auth.controller';
import validate from '../middlewares/validateResource';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Public Routes
router.post('/register', validate(registerSchema), registerHandler);
router.post('/login', validate(loginSchema), loginHandler);
router.get('/logout', logoutHandler);

// Protected Routes
router.get('/me', protect, getMeHandler);

export default router;