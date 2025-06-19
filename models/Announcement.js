const mongoose = require('mongoose');

/**
 * Σχήμα ανακοίνωσης για το σύστημα.
 */
const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true },          // Τίτλος
  content: { type: String, required: true },        // Περιεχόμενο
  date: { type: Date, default: Date.now }           // Ημερομηνία
}, { timestamps: true });

module.exports = mongoose.model('Announcement', AnnouncementSchema);