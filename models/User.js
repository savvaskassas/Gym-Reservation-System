const mongoose = require('mongoose');

/**
 * Σχήμα χρήστη για το σύστημα κρατήσεων γυμναστηρίου.
 *
 * Τροποποιήσεις για πλήρη κάλυψη απαιτήσεων διαχειριστικού (ADMIN):
 * - Προσθήκη πεδίου 'status' για την παρακολούθηση της κατάστασης εγγραφής (pending, approved, rejected)
 * - Διατήρηση του 'approved' για συμβατότητα, αλλά προτείνεται η χρήση του 'status' στη λογική.
 * - Ελληνικά σχόλια για κάθε πεδίο και λειτουργία.
 */

const UserSchema = new mongoose.Schema({
  // Όνομα χρήστη (υποχρεωτικό)
  firstName: { type: String, required: true },
  // Επώνυμο χρήστη (υποχρεωτικό)
  lastName: { type: String, required: true },
  // Χώρα διαμονής (υποχρεωτικό)
  country: { type: String, required: true },
  // Πόλη διαμονής (υποχρεωτικό)
  city: { type: String, required: true },
  // Διεύθυνση (υποχρεωτικό)
  address: { type: String, required: true },
  // Email χρήστη (υποχρεωτικό & μοναδικό)
  email: { type: String, required: true, unique: true },
  // Όνομα χρήστη για login (υποχρεωτικό & μοναδικό)
  username: { type: String, required: true, unique: true },
  // Κωδικός πρόσβασης (υποχρεωτικό)
  password: { type: String, required: true },

  // Ρόλος χρήστη ('user' ή 'admin', προεπιλογή 'user')
  role: { type: String, enum: ['user', 'admin'], default: 'user' },

  /**
   * Κατάσταση αιτήματος εγγραφής:
   * - 'pending': Εκκρεμεί έγκριση από διαχειριστή
   * - 'approved': Εγκρίθηκε (ενεργός χρήστης)
   * - 'rejected': Απορρίφθηκε από διαχειριστή
   * Χρησιμοποίησε αυτό το πεδίο για όλη τη λογική διαχείρισης αιτημάτων.
   */
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },

    approved: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);