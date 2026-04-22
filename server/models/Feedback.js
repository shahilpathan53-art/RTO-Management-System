import mongoose from 'mongoose';

const feedbackSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  type: { type: String, enum: ['contact', 'feedback'], default: 'contact' },
  isRead: { type: Boolean, default: false },
}, { timestamps: true });

const Feedback = mongoose.model('Feedback', feedbackSchema);
export default Feedback;
