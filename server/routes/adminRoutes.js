import express from 'express';
const router = express.Router();
import {
  getStats, getAllUsers, deleteUser, getUserProfile, createOfficer,
  getSalaries, createSalary, updateSalaryStatus, deleteSalary,
  getAllFeedback, markFeedbackRead, deleteFeedback,
  getActivityLogs, getAllAppointments, updateAppointmentStatus,
  getAdminProfile, changeAdminPassword,
  getVehiclesByCity, getReports
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

router.use(protect, authorize('admin'));

// Stats & reports
router.get('/stats', getStats);
router.get('/reports', getReports);

// Users
router.get('/users', getAllUsers);
router.get('/user/:id', getUserProfile);
router.delete('/user/:id', deleteUser);
router.post('/officer', createOfficer);

// Salary
router.get('/salaries', getSalaries);
router.post('/salary', createSalary);
router.put('/salary/:id', updateSalaryStatus);
router.delete('/salary/:id', deleteSalary);

// Feedback
router.get('/feedback', getAllFeedback);
router.put('/feedback/:id/read', markFeedbackRead);
router.delete('/feedback/:id', deleteFeedback);

// Activity log
router.get('/activity', getActivityLogs);

// Enquiry / Appointments
router.get('/appointments', getAllAppointments);
router.put('/appointment/:id', updateAppointmentStatus);

// Admin profile
router.get('/profile', getAdminProfile);
router.put('/change-password', changeAdminPassword);

// City-wise vehicles
router.get('/vehicles/city', getVehiclesByCity);

export default router;
