import { Router } from 'express';
import { protect, authorize } from '../middlewares/auth.middleware';
import validate from '../middlewares/validateResource';
import { assignTherapySchema, logSessionSchema } from '../schemas/therapy.schema';
import { assignTherapyHandler, getHistoryHandler, getMyTherapyPlanHandler, logSessionHandler } from '../controllers/therapy.controller';

const router = Router();

router.use(protect);

// 2. Doctor Routes
router.post(
  '/assign',
  authorize('doctor'),      
  validate(assignTherapySchema), 
  assignTherapyHandler           
);

// 3. Patient Routes
router.get(
  '/my-plan',
  authorize('patient'),     
  getMyTherapyPlanHandler        
);

// Patient logs a game result
router.post('/log', protect, validate(logSessionSchema), logSessionHandler);

// Patient gets their progress graph
router.get('/history', protect, getHistoryHandler);

export default router;