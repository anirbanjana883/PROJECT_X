import { Router } from 'express';
import { protect, authorizeRoles } from '../middlewares/auth.middleware';
import validate from '../middlewares/validateResource';
import { saveSessionSchema } from '../schemas/session.schema';
import { saveSessionHandler, getSessionHistoryHandler } from '../controllers/session.controller';

const router = Router();


router.use(protect);

//  Save Session 
router.post(
    '/save', 
    authorizeRoles('patient'), 
    validate(saveSessionSchema), 
    saveSessionHandler
);

// Get History
router.get(
    '/history',
    authorizeRoles('patient'),
    getSessionHistoryHandler
);

export default router;