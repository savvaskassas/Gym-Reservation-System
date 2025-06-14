const mongoose = require('mongoose');

const ProgramSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String }, // π.χ. pilates, ενδυνάμωση, πισίνα
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
  schedule: [{
    day: { type: String, required: true },
    time: { type: String, required: true },
    maxCapacity: { type: Number, required: true }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Program', ProgramSchema);