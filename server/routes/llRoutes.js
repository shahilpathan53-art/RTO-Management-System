import express from 'express';
const router = express.Router();
import { applyLL, getMyLL, getAllLL, approveLL, updateDeliveryStatus } from '../controllers/llController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

router.route('/').post(protect, applyLL);
router.route('/my').get(protect, getMyLL);
router.route('/all').get(protect, authorize('officer', 'admin'), getAllLL);
router.route('/approve/:id').put(protect, authorize('officer', 'admin'), approveLL);
router.route('/delivery/:id').put(protect, authorize('officer', 'admin'), updateDeliveryStatus);

export default router;
