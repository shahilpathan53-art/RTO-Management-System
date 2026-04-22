import asyncHandler from 'express-async-handler';
import Payment from '../models/Payment.js';

export const createPayment = asyncHandler(async (req, res) => {
  const { applicationId, serviceType, amount } = req.body;
  const transactionId = 'TXN' + Date.now() + Math.floor(Math.random() * 1000);
  const payment = await Payment.create({
    userId: req.user._id,
    applicationId, serviceType, amount, transactionId
  });
  res.status(201).json(payment);
});

export const getMyPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(payments);
});
