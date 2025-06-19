const mongoose = require('mongoose');

/**
 * Σχήμα γυμναστή για το σύστημα κρατήσεων γυμναστηρίου.
 */
const TrainerSchema = new mongoose.Schema({
  name: { type: String, required: true },              // Όνομα
  specialization: { type: String },                    // Ειδίκευση (προαιρετικό)
}, { timestamps: true });

module.exports = mongoose.model('Trainer', TrainerSchema);