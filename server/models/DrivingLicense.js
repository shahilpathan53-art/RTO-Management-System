import mongoose from 'mongoose';

const dlSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  llId: { type: mongoose.Schema.Types.ObjectId, ref: 'LearningLicense', required: true },
  fullName: { type: String, required: true },
  vehicleType: { type: String, required: true },
  testDate: { type: Date, required: true },
  scheduledDate: { type: Date },          // officer assigns exam date
  dlScheduleMsg: { type: String },        // message shown to user
  testResult: { type: String, enum: ['Pass', 'Fail', 'Pending'], default: 'Pending' },
  status: { type: String, enum: ['Pending', 'Issued', 'Rejected'], default: 'Pending' },
  dlNumber: { type: String },
  officerNotes: { type: String }
}, { timestamps: true });

const DrivingLicense = mongoose.model('DrivingLicense', dlSchema);
export default DrivingLicense;
