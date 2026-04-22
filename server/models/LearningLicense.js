import mongoose from 'mongoose';

const llSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  aadhaarNumber: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  address: { type: String, required: true },
  vehicleType: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  testScore: { type: Number, default: 0 },
  attemptCount: { type: Number, default: 1 },
  applicationDate: { type: Date, default: Date.now },
  deliveryStatus: { type: String, enum: ['Processing', 'Printed', 'Dispatched', 'Delivered'], default: 'Processing' },
  expectedDeliveryDate: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
}, { timestamps: true });

const LearningLicense = mongoose.model('LearningLicense', llSchema);
export default LearningLicense;
