import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import llRoutes from './routes/llRoutes.js';
import dlRoutes from './routes/dlRoutes.js';
import testRoutes from './routes/testRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import salaryRoutes from './routes/salaryRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ All routes
app.use('/api/auth', authRoutes);
app.use('/api/ll', llRoutes);
app.use('/api/dl', dlRoutes);
app.use('/api/test', testRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/payment', paymentRoutes);

// 🔥 IMPORTANT CHANGE HERE
app.use('/api', appointmentRoutes);  // ✅ changed from /api/appointment

app.use('/api/admin', adminRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/salary', salaryRoutes);

// ✅ Test route
app.get('/', (req, res) => res.send('🚀 RTO Server running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 RTO Server running on port ${PORT}`));