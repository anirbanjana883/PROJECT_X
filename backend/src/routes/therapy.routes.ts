import { Router } from 'express';
// Check your auth middleware exports. Assuming 'protect' and 'authorize' are named exports.
import { protect, authorize } from '../middlewares/auth.middleware';
// Check if validateResource is a 'default' export or 'named' export in your file. 
// If named, use: import { validateResource } from ...
import validateResource from '../middlewares/validateResource'; 
import { assignTherapySchema, logSessionSchema } from '../schemas/therapy.schema';
import { 
    assignTherapyHandler, 
    getHistoryHandler, 
    getMyTherapyPlanHandler, 
    logSessionHandler 
} from '../controllers/therapy.controller';

const router = Router();

// Apply authentication to ALL routes in this file
router.use(protect);

// ============================
// 1. DOCTOR ROUTES
// ============================
router.post(
  '/assign',
  authorize('doctor'),      // Only Doctors can assign
  validateResource(assignTherapySchema), 
  assignTherapyHandler          
);

// ============================
// 2. PATIENT ROUTES
// ============================

// Get the active therapy plan (Settings for the game)
router.get(
  '/my-plan',
  authorize('patient'),     // Enforce Patient role
  getMyTherapyPlanHandler        
);

// Log a game result (Win/Loss/Score)
router.post(
  '/log', 
  authorize('patient'),     // Enforce Patient role
  validateResource(logSessionSchema), 
  logSessionHandler
);

// Get past performance graph
router.get(
  '/history', 
  authorize('patient'),     // Enforce Patient role
  getHistoryHandler
);

export default router;