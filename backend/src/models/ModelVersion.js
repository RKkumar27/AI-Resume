const mongoose = require('mongoose');

const ModelVersionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  version: { type: String, required: true },
  type: { type: String, enum: ['TF-IDF Baseline', 'Transformer Embedding', 'Rule Based'], default: 'Transformer Embedding' },
  metrics: {
    precision: { type: Number, default: 0.91 },
    recall: { type: Number, default: 0.88 },
    f1Score: { type: Number, default: 0.89 },
    avgLatencyMs: { type: Number, default: 420 }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ModelVersion', ModelVersionSchema);
