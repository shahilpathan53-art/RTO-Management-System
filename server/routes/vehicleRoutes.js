import express from 'express';
const router = express.Router();
import { registerVehicle, getMyVehicles, getAllVehicles, approveVehicle } from '../controllers/vehicleController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

router.route('/register').post(protect, registerVehicle);
router.route('/my').get(protect, getMyVehicles);
router.route('/all').get(protect, authorize('officer', 'admin'), getAllVehicles);
router.route('/approve/:id').put(protect, authorize('officer', 'admin'), approveVehicle);

export default router;
