const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  fileUrl: { type: String, default: '' },
  extractedText: { type: String, default: '' },
  skills: [{ type: String }],
  score: { type: Number, default: 0 },
  isPrimary: { type: Boolean, default: false },
  modelVersion: { type: String, default: 'v1.0.0' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

ResumeSchema.index({ userId: 1 });

module.exports = mongoose.model('Resume', ResumeSchema);
