import { Router } from 'express';
import { protect, authorizeRoles } from '../middlewares/auth.middleware';
import validate from '../middlewares/validateResource';
import { assignTherapySchema } from '../schemas/therapy.schema';
import { assignTherapyHandler, getMyTherapyPlanHandler } from '../controllers/therapy.controller';

const router = Router();

router.use(protect);

// 2. Doctor Routes
router.post(
  '/assign',
  authorizeRoles('doctor'),      
  validate(assignTherapySchema), 
  assignTherapyHandler           
);

// 3. Patient Routes
router.get(
  '/my-plan',
  authorizeRoles('patient'),     
  getMyTherapyPlanHandler        
);

export default router;