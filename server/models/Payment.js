import mongoose from 'mongoose';

const paymentSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicationId: { type: String, required: true },
  serviceType: { type: String, required: true },
  amount: { type: Number, required: true },
  transactionId: { type: String, required: true, unique: true },
  paymentStatus: { type: String, default: 'Success' },
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
