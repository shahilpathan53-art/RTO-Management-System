import express from 'express';
const router = express.Router();
import { submitTest, getTestHistory } from '../controllers/testController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/submit').post(protect, submitTest);
router.route('/history').get(protect, getTestHistory);

export default router;
