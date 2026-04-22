import express from 'express';
const router = express.Router();

import {
  bookAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus
} from '../controllers/appointmentController.js';

import { protect } from '../middleware/authMiddleware.js';

// User
router.post('/book', protect, bookAppointment);
router.get('/my', protect, getMyAppointments);

// Officer
router.get('/officer/appointments', protect, getAllAppointments);
router.put('/officer/appointment/:id', protect, updateAppointmentStatus); // ✅ NEW

export default router;