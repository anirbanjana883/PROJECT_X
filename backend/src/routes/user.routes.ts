// src/routes/user.routes.ts
import { Router } from 'express';
import { protect } from '../middlewares/auth.middleware';
import { updateTriageHandler } from '../controllers/user.controller';

const router = Router();


router.put('/update-triage', protect, updateTriageHandler);

export default router;