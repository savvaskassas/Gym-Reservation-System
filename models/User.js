const mongoose = require('mongoose');

/**
 * Σχήμα χρήστη για το σύστημα κρατήσεων γυμναστηρίου.
 * - Το πεδίο 'status' δείχνει αν ο χρήστης είναι pending, approved ή rejected.
 * - Το πεδίο 'role' είναι είτε 'user' είτε 'admin'.
 * - Το πεδίο 'blockedUntil' δηλώνει έως πότε είναι μπλοκαρισμένος λόγω ακυρώσεων.
 */

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },      // Όνομα
  lastName: { type: String, required: true },       // Επώνυμο
  country: { type: String, required: true },        // Χώρα
  city: { type: String, required: true },           // Πόλη
  address: { type: String, required: true },        // Διεύθυνση
  email: { type: String, required: true, unique: true }, // Email
  username: { type: String, required: true, unique: true }, // Όνομα χρήστη για login
  password: { type: String, required: true },       // Κωδικός

  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Ρόλος

  /**
   * Κατάσταση εγγραφής:
   * - 'pending': Εκκρεμεί έγκριση διαχειριστή
   * - 'approved': Εγκρίθηκε (ενεργός χρήστης)
   * - 'rejected': Απορρίφθηκε από διαχειριστή
   */
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },

  //μπλοκάρισμα λόγω ακυρώσεων (μέχρι πότε;)
  blockedUntil: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);