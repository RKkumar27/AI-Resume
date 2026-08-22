const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  company: { type: String, required: true },
  role: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Saved', 'Applied', 'Assessment', 'Interview', 'Selected', 'Rejected'], 
    default: 'Applied' 
  },
  notes: { type: String, default: '' },
  appliedAt: { type: Date, default: Date.now }
});

ApplicationSchema.index({ userId: 1 });

module.exports = mongoose.model('Application', ApplicationSchema);
