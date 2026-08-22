const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  provider: { type: String, default: 'ArbeitNow' },
  externalJobId: { type: String, required: true, index: true },
  originalUrl: { type: String, required: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, default: 'Remote' },
  jobType: { type: String, default: 'Remote' },
  salary: { type: String, default: 'Competitive' },
  description: { type: String, required: true },
  requiredSkills: [{ type: String }],
  postedAt: { type: Date, default: Date.now },
  fetchedAt: { type: Date, default: Date.now }
});

JobSchema.index({ provider: 1, externalJobId: 1 }, { unique: true });

module.exports = mongoose.model('Job', JobSchema);
