import express from 'express';
const router = express.Router();
import { createPayment, getMyPayments } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/create').post(protect, createPayment);
router.route('/my').get(protect, getMyPayments);

export default router;
