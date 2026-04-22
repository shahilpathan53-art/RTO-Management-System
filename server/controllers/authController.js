import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import nodemailer from 'nodemailer';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    console.log("Sending email to:", email);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 🔥 TEST connection
    await transporter.verify();
    console.log("SMTP Ready ✅");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Recovery',
      text: 'Reset link: http://localhost:5173/reset-password',
    };

    await transporter.sendMail(mailOptions);

    console.log("Email sent ✅");

    res.json({ message: 'Email sent successfully' });

  } catch (error) {
    console.error("❌ EMAIL ERROR FULL:", error);
    res.status(500).json({ message: 'Email sending failed' });
  }
};

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, aadhaarNumber, phone, address } = req.body;
  const userExists = await User.findOne({ $or: [{ email }, { aadhaarNumber }] });
  if (userExists) { res.status(400); throw new Error('User already exists with this email or Aadhaar'); }
  const user = await User.create({ name, email, password, role, aadhaarNumber, phone, address });
  if (user) {
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
  } else { res.status(400); throw new Error('Invalid user data'); }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    if (user.role !== role) { res.status(401); throw new Error('Unauthorized role selection'); }
    res.json({
      _id: user._id, name: user.name, email: user.email, role: user.role,
      token: generateToken(user._id), aadhaarNumber: user.aadhaarNumber,
      phone: user.phone, address: user.address, dob: user.dob,
    });
  } else { res.status(401); throw new Error('Invalid email or password'); }
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  const match = await user.matchPassword(currentPassword);
  if (!match) { res.status(400); throw new Error('Current password is incorrect'); }
  user.password = newPassword;
  await user.save();
  res.json({ message: 'Password updated successfully' });
});
