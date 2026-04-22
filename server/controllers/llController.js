import asyncHandler from 'express-async-handler';
import LearningLicense from '../models/LearningLicense.js';

export const applyLL = asyncHandler(async (req, res) => {
  const { fullName, aadhaarNumber, dateOfBirth, gender, bloodGroup, address, vehicleType } = req.body;
  const existingLL = await LearningLicense.findOne({ userId: req.user._id, vehicleType });
  if (existingLL && (existingLL.status === 'Pending' || existingLL.status === 'Approved')) {
    res.status(400);
    throw new Error('Already have an active LL application for this vehicle type');
  }
  const ll = await LearningLicense.create({
    userId: req.user._id,
    fullName,
    aadhaarNumber,
    dateOfBirth,
    gender,
    bloodGroup,
    address,
    vehicleType,
  });
  res.status(201).json(ll);
});

export const getMyLL = asyncHandler(async (req, res) => {
  const ll = await LearningLicense.find({ userId: req.user._id });
  res.json(ll);
});

export const getAllLL = asyncHandler(async (req, res) => {
  const ll = await LearningLicense.find({});
  res.json(ll);
});

export const approveLL = asyncHandler(async (req, res) => {
  const ll = await LearningLicense.findById(req.params.id);
  if (ll) {
    ll.status = req.body.status || ll.status;
    const updatedLL = await ll.save();
    res.json(updatedLL);
  } else {
    res.status(404);
    throw new Error('Application not found');
  }
});

export const updateDeliveryStatus = asyncHandler(async (req, res) => {
  const ll = await LearningLicense.findById(req.params.id);
  if (ll) {
    ll.deliveryStatus = req.body.deliveryStatus || ll.deliveryStatus;
    const updatedLL = await ll.save();
    res.json(updatedLL);
  } else {
    res.status(404);
    throw new Error('Application not found');
  }
});
