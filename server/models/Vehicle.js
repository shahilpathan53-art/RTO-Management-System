import mongoose from 'mongoose';

const vehicleSchema = mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerName: { type: String, required: true },
  vehicleType: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  color: { type: String, required: true },
  engineNumber: { type: String, required: true, unique: true },
  chassisNumber: { type: String, required: true, unique: true },
  fuelType: { type: String, required: true },
  insuranceCompany: { type: String, required: true },
  insuranceExpiry: { type: Date, required: true },
  city: { type: String }, // e.g. Surat, Vadodara etc.
  gjCode: { type: String }, // e.g. GJ 05 AB 4523
  registrationStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  rcNumber: { type: String },
  notes: { type: String }
}, { timestamps: true });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;
