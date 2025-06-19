const mongoose = require('mongoose');

const ProgramSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String },
  schedule: [{
    day: { type: String, required: true },
    time: { type: String, required: true },
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
    maxCapacity: { type: Number, required: true }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Program', ProgramSchema);