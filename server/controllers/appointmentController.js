import asyncHandler from 'express-async-handler';
import Appointment from '../models/Appointment.js';

// ✅ Book Appointment
export const bookAppointment = asyncHandler(async (req, res) => {
  const { serviceType, preferredDate, timeSlot, notes } = req.body;

  const date = new Date(preferredDate);
  if (date.getDay() === 0) {
    res.status(400);
    throw new Error('RTO is closed on Sundays');
  }

  const appointment = await Appointment.create({
    userId: req.user._id,
    serviceType,
    preferredDate,
    timeSlot,
    notes,
    status: 'Booked' // ✅ default status add
  });

  res.status(201).json(appointment);
});

// ✅ User appointments
export const getMyAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ userId: req.user._id })
    .sort({ createdAt: -1 });

  res.json(appointments);
});

// 🔥 Officer: ALL appointments (WITH USER DATA)
export const getAllAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find()
    .populate('userId', 'name email phone') // ✅ VERY IMPORTANT FIX
    .sort({ createdAt: -1 });

  res.json(appointments);
});

// 🔥 UPDATE appointment status (Approve / Reject)
export const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;

  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  appointment.status = status;
  appointment.notes = notes || appointment.notes;

  const updated = await appointment.save();

  res.json(updated);
});