import mongoose from 'mongoose';

const salarySchema = mongoose.Schema({
  officerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  officerName: { type: String, required: true },
  month: { type: String, required: true }, // e.g. "March 2026"
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' },
  paidDate: { type: Date },
  notes: { type: String },
}, { timestamps: true });

const Salary = mongoose.model('Salary', salarySchema);
export default Salary;
