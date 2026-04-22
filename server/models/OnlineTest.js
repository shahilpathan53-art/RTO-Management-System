import mongoose from 'mongoose';

const testSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  llId: { type: mongoose.Schema.Types.ObjectId, ref: 'LearningLicense', required: true },
  score: { type: Number, required: true },
  attemptNumber: { type: Number, required: true },
  result: { type: String, enum: ['Pass', 'Fail'], required: true },
}, { timestamps: true });

const OnlineTest = mongoose.model('OnlineTest', testSchema);
export default OnlineTest;
