import express from 'express';
import { getOfficerSalary } from '../controllers/salaryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 🔥 Officer salary
router.get('/officer/:id', protect, getOfficerSalary);

export default router;