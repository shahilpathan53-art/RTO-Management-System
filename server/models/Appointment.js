import mongoose from 'mongoose';

const appointmentSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceType: { type: String, required: true },
  preferredDate: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  status: { type: String, enum: ['Booked', 'Approved','Completed', 'Cancelled'], default: 'Booked' },
  appointmentId: { type: String, unique: true, default: () => 'APT' + Math.floor(Math.random() * 900000 + 100000) },
  notes: { type: String }
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
