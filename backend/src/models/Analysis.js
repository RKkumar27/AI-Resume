const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
  atsScore: { type: Number, required: true },
  skillScore: { type: Number, default: 0 },
  experienceScore: { type: Number, default: 0 },
  keywordScore: { type: Number, default: 0 },
  formattingScore: { type: Number, default: 0 },
  matchedSkills: [{ type: String }],
  missingSkills: [{ type: String }],
  recommendations: [{ type: String }],
  modelVersion: { type: String, default: 'v1.2.0' },
  processingTimeMs: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

AnalysisSchema.index({ resumeId: 1 });

module.exports = mongoose.model('Analysis', AnalysisSchema);
