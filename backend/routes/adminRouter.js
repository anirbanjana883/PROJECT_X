import express from 'express';
import { getAllUsers, updateUserRole } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleWare.js';
import { admin } from '../middleware/adminMiddleWare.js';

const adminRouter = express.Router();


adminRouter.use(protect, admin);

adminRouter.get('/users', getAllUsers);
adminRouter.put('/users/:userId/role', updateUserRole);

export default adminRouter;