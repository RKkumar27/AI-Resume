const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  normalizedName: { type: String, required: true },
  category: { type: String, default: 'General' }
});

module.exports = mongoose.model('Skill', SkillSchema);
