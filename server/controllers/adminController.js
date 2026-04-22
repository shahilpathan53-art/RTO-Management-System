import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import LL from '../models/LearningLicense.js';
import DL from '../models/DrivingLicense.js';
import Vehicle from '../models/Vehicle.js';
import Payment from '../models/Payment.js';
import Salary from '../models/Salary.js';
import Feedback from '../models/Feedback.js';
import ActivityLog from '../models/ActivityLog.js';
import Appointment from '../models/Appointment.js';

// ─── STATS ───────────────────────────────────────────────────────────────────
export const getStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ role: 'user' });
  const totalOfficers = await User.countDocuments({ role: 'officer' });
  const totalLL = await LL.countDocuments({ status: 'Approved' });
  const totalDL = await DL.countDocuments({ status: 'Issued' });
  const totalVehicles = await Vehicle.countDocuments({ registrationStatus: 'Approved' });
  const payments = await Payment.find({});
  const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);
  const pendingLL = await LL.countDocuments({ status: 'Pending' });
  const pendingDL = await DL.countDocuments({ status: 'Pending' });

  res.json({ totalUsers, totalOfficers, totalLL, totalDL, totalVehicles, totalRevenue, pendingLL, pendingDL });
});

// ─── USERS ────────────────────────────────────────────────────────────────────
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
  res.json(users);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    const role = user.role;
    const name = user.name;
    await user.deleteOne();
    // Log activity
    await ActivityLog.create({
      text: `${role === 'officer' ? 'Officer' : 'User'} account "${name}" was deleted by Admin.`,
      type: 'danger',
      actor: 'Admin',
    });
    res.json({ message: role === 'officer' ? 'officer a/c deleted' : 'user a/c deleted' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) { res.status(404); throw new Error('User not found'); }
  res.json(user);
});

// ─── OFFICERS ─────────────────────────────────────────────────────────────────
export const createOfficer = asyncHandler(async (req, res) => {
  const { name, email, password, aadhaarNumber, phone, address } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) { res.status(400); throw new Error('Officer already exists'); }
  const user = await User.create({ name, email, password, role: 'officer', aadhaarNumber, phone, address });
  await ActivityLog.create({ text: `New officer account created for "${name}".`, type: 'info', actor: 'Admin' });
  res.status(201).json(user);
});

// ─── SALARY ───────────────────────────────────────────────────────────────────
export const getSalaries = asyncHandler(async (req, res) => {
  const salaries = await Salary.find({}).sort({ createdAt: -1 });
  res.json(salaries);
});

export const createSalary = asyncHandler(async (req, res) => {
  const { officerId, officerName, month, amount, notes } = req.body;
  const salary = await Salary.create({ officerId, officerName, month, amount, notes, status: 'Pending' });
  res.status(201).json(salary);
});

export const updateSalaryStatus = asyncHandler(async (req, res) => {
  const salary = await Salary.findById(req.params.id);
  if (!salary) { res.status(404); throw new Error('Salary record not found'); }
  salary.status = req.body.status;
  if (req.body.status === 'Paid') salary.paidDate = new Date();
  const updated = await salary.save();
  await ActivityLog.create({
    text: `Salary of ₹${salary.amount} marked as Paid for officer "${salary.officerName}" (${salary.month}).`,
    type: 'success', actor: 'Admin',
  });
  res.json(updated);
});

export const deleteSalary = asyncHandler(async (req, res) => {
  await Salary.findByIdAndDelete(req.params.id);
  res.json({ message: 'Salary record deleted' });
});

// ─── FEEDBACK ─────────────────────────────────────────────────────────────────
export const getAllFeedback = asyncHandler(async (req, res) => {
  const feedbacks = await Feedback.find({}).sort({ createdAt: -1 });
  res.json(feedbacks);
});

export const markFeedbackRead = asyncHandler(async (req, res) => {
  const fb = await Feedback.findById(req.params.id);
  if (!fb) { res.status(404); throw new Error('Feedback not found'); }
  fb.isRead = true;
  await fb.save();
  res.json(fb);
});

export const deleteFeedback = asyncHandler(async (req, res) => {
  await Feedback.findByIdAndDelete(req.params.id);
  res.json({ message: 'Feedback deleted' });
});

// ─── ACTIVITY LOG ─────────────────────────────────────────────────────────────
export const getActivityLogs = asyncHandler(async (req, res) => {
  const logs = await ActivityLog.find({}).sort({ createdAt: -1 }).limit(20);
  res.json(logs);
});

// ─── ENQUIRY / APPOINTMENTS ───────────────────────────────────────────────────
export const getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({}).populate('userId', 'name email phone').sort({ createdAt: -1 });
  res.json(appointments);
});

export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const apt = await Appointment.findById(req.params.id);
  if (!apt) { res.status(404); throw new Error('Appointment not found'); }
  apt.status = req.body.status;
  if (req.body.notes) apt.notes = req.body.notes;
  const updated = await apt.save();
  await ActivityLog.create({
    text: `Appointment for "${apt.purpose || 'visit'}" was ${req.body.status} by Admin.`,
    type: req.body.status === 'Approved' ? 'success' : 'danger',
    actor: 'Admin',
  });
  res.json(updated);
});

// ─── ADMIN PROFILE ────────────────────────────────────────────────────────────
export const getAdminProfile = asyncHandler(async (req, res) => {
  const admin = await User.findById(req.user._id).select('-password');
  res.json(admin);
});

export const changeAdminPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const admin = await User.findById(req.user._id);
  const match = await admin.matchPassword(currentPassword);
  if (!match) { res.status(400); throw new Error('Current password is incorrect'); }
  admin.password = newPassword;
  await admin.save();
  await ActivityLog.create({ text: 'Admin password was changed.', type: 'warn', actor: 'Admin' });
  res.json({ message: 'Password updated successfully' });
});

// ─── CITY-WISE VEHICLE STATS ──────────────────────────────────────────────────
export const getVehiclesByCity = asyncHandler(async (req, res) => {
  const city = req.query.city;
  const query = city ? { city, registrationStatus: 'Approved' } : { registrationStatus: 'Approved' };
  const vehicles = await Vehicle.find(query).sort({ createdAt: -1 });
  res.json(vehicles);
});

// ─── REPORTS ──────────────────────────────────────────────────────────────────
export const getReports = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password');
  const officers = await User.find({ role: 'officer' }).select('-password');
  const llList = await LL.find({}).populate('userId', 'name email');
  const dlList = await DL.find({}).populate('userId', 'name email');
  const vehicleList = await Vehicle.find({});
  const payments = await Payment.find({});
  res.json({ users, officers, llList, dlList, vehicleList, payments });
});
