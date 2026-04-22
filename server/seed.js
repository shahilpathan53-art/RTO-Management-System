import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Create Admin
    const adminExists = await User.findOne({ email: 'admin@rto.gov.in' });
    if (!adminExists) {
      await User.create({
        name: 'System Admin',
        email: 'admin@rto.gov.in',
        password: 'Admin@123',
        role: 'admin',
        aadhaarNumber: '111122223333',
        phone: '9988776655',
        address: 'RTO Headquarters, New Delhi'
      });
      console.log('✅ Admin user created');
    }

    // Create Officer
    const officerExists = await User.findOne({ email: 'officer@rto.gov.in' });
    if (!officerExists) {
      await User.create({
        name: 'Zonal Officer',
        email: 'officer@rto.gov.in',
        password: 'Officer@123',
        role: 'officer',
        aadhaarNumber: '444455556666',
        phone: '1122334455',
        address: 'Zonal RTO Office, Sector 12'
      });
      console.log('✅ Officer user created');
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();
