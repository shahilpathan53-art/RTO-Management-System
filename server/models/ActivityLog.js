import mongoose from 'mongoose';

const activityLogSchema = mongoose.Schema({
  text: { type: String, required: true },
  type: { type: String, enum: ['info', 'warn', 'success', 'danger'], default: 'info' },
  actor: { type: String }, // e.g. "Admin", "Officer", "System"
}, { timestamps: true });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;
