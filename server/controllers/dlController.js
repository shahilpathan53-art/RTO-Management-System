import asyncHandler from 'express-async-handler';
import DrivingLicense from '../models/DrivingLicense.js';
import LearningLicense from '../models/LearningLicense.js';
import ActivityLog from '../models/ActivityLog.js';

export const applyDL = asyncHandler(async (req, res) => {
  const { vehicleType, testDate } = req.body;
  const approvedLL = await LearningLicense.findOne({ userId: req.user._id, vehicleType, status: 'Approved' });
  if (!approvedLL) {
    res.status(400);
    throw new Error('Approved LL required for this vehicle type');
  }
  const dl = await DrivingLicense.create({
    userId: req.user._id,
    llId: approvedLL._id,
    fullName: req.user.name,
    vehicleType,
    testDate,
  });
  res.status(201).json(dl);
});

export const getMyDL = asyncHandler(async (req, res) => {
  const dl = await DrivingLicense.find({ userId: req.user._id });
  res.json(dl);
});

export const getAllDL = asyncHandler(async (req, res) => {
  const dl = await DrivingLicense.find({}).populate('userId', 'name email phone');
  res.json(dl);
});

export const recordTestResult = asyncHandler(async (req, res) => {
  const { testResult, notes } = req.body;
  const dl = await DrivingLicense.findById(req.params.id);
  if (dl) {
    dl.testResult = testResult;
    dl.officerNotes = notes;
    if (testResult === 'Pass') {
      dl.status = 'Issued';
      dl.dlNumber = 'DL-GJ-' + Math.random().toString(36).toUpperCase().substring(2, 10);
    } else {
      dl.status = 'Rejected';
    }
    const updatedDL = await dl.save();
    await ActivityLog.create({
      text: `DL test result recorded for "${dl.fullName}": ${testResult}.`,
      type: testResult === 'Pass' ? 'success' : 'danger',
      actor: 'Officer',
    });
    res.json(updatedDL);
  } else {
    res.status(404);
    throw new Error('Application not found');
  }
});

// Officer assigns DL exam date → user gets scheduled date message
export const scheduleDLDate = asyncHandler(async (req, res) => {
  const { scheduledDate } = req.body;
  const dl = await DrivingLicense.findById(req.params.id);
  if (!dl) { res.status(404); throw new Error('DL application not found'); }
  dl.scheduledDate = scheduledDate;
  dl.dlScheduleMsg = `Your DL Exam has been scheduled on ${new Date(scheduledDate).toDateString()}. Please be present at the RTO office.`;
  const updated = await dl.save();
  await ActivityLog.create({
    text: `DL Exam date scheduled for "${dl.fullName}" on ${new Date(scheduledDate).toDateString()}.`,
    type: 'info',
    actor: 'Officer',
  });
  res.json(updated);
});
