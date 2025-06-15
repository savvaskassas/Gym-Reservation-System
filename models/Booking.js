const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  program: { type: mongoose.Schema.Types.ObjectId, ref: 'Program', required: true },
  schedule: {
    day: { type: String, required: true },
    time: { type: String, required: true },
    date: { type: Date, required: true }
  },
  cancelled: { type: Boolean, default: false },
  cancelledAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);