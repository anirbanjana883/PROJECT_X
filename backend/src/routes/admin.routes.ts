import { Router } from 'express';
import { requestAccessHandler, approveHandler, getAllUsersHandler } from '../controllers/admin.controller';
import { protect, authorize } from '../middlewares/auth.middleware'; 
import validate from '../middlewares/validateResource';
import { doctorRequestSchema } from '../schemas/auth.schema'; 

const router = Router();

// Route for Users to APPLY (Protected)
router.post(
    '/request-access', 
    protect, 
    validate(doctorRequestSchema), 
    requestAccessHandler 
);

// Route for Admin to APPROVE (Protected + AdminOnly)
router.put(
    '/approve/:userId', 
    protect, 
    authorize('admin'), 
    approveHandler 
);

// Route to get all users 
router.get(
    '/users',
    protect,
    authorize('admin'),
    getAllUsersHandler
);

export default router;