import express from 'express';
const router = express.Router();
import { applyDL, getMyDL, getAllDL, recordTestResult, scheduleDLDate } from '../controllers/dlController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

router.route('/apply').post(protect, applyDL);
router.route('/my').get(protect, getMyDL);
router.route('/all').get(protect, authorize('officer', 'admin'), getAllDL);
router.route('/result/:id').put(protect, authorize('officer', 'admin'), recordTestResult);
router.route('/schedule/:id').put(protect, authorize('officer', 'admin'), scheduleDLDate);

export default router;
