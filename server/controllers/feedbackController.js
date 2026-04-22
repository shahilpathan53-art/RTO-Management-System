import asyncHandler from 'express-async-handler';
import Feedback from '../models/Feedback.js';

// Public: submit contact/feedback
export const submitFeedback = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message, rating, type } = req.body;
  const fb = await Feedback.create({ name, email, phone, subject, message, rating, type: type || 'contact' });
  res.status(201).json({ message: 'Feedback submitted successfully', id: fb._id });
});
