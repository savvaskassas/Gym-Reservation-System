const mongoose = require('mongoose');

/**
 * Σχήμα προγράμματος για το σύστημα κρατήσεων γυμναστηρίου.
 * - Το schedule είναι array με τα slots του προγράμματος.
 * - Κάθε slot έχει μέρα, ώρα, γυμναστή και χωρητικότητα.
 */
const ProgramSchema = new mongoose.Schema({
  name: { type: String, required: true },             // Όνομα προγράμματος
  type: { type: String },                             // Τύπος (π.χ. pilates, pool)
  schedule: [{
    day: { type: String, required: true },            // Ημέρα
    time: { type: String, required: true },           // Ώρα
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true }, // Γυμναστής (ref)
    maxCapacity: { type: Number, required: true }     // Χωρητικότητα
  }]
}, { timestamps: true });

module.exports = mongoose.model('Program', ProgramSchema);