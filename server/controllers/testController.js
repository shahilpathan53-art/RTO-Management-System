import asyncHandler from 'express-async-handler';
import OnlineTest from '../models/OnlineTest.js';
import LearningLicense from '../models/LearningLicense.js';

export const submitTest = asyncHandler(async (req, res) => {
  const { llId, score } = req.body;
  const ll = await LearningLicense.findById(llId);
  if (!ll) {
    res.status(404);
    throw new Error('LL Application not found');
  }
  const result = score >= 11 ? 'Pass' : 'Fail';
  const test = await OnlineTest.create({
    userId: req.user._id,
    llId,
    score,
    attemptNumber: ll.attemptCount,
    result,
  });
  ll.testScore = score;
  if (result === 'Fail') {
    ll.attemptCount += 1;
  }
  await ll.save();
  res.status(201).json(test);
});

export const getTestHistory = asyncHandler(async (req, res) => {
  const history = await OnlineTest.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(history);
});
