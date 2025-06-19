const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Εγγραφή χρήστη
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, country, city, address, email, username, password } = req.body;

    // Έλεγχος αν υπάρχει ήδη χρήστης με ίδιο email ή username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Υπάρχει ήδη χρήστης με αυτό το email ή username.' });
    }

    // Κρυπτογράφηση κωδικού
    const hashedPassword = await bcrypt.hash(password, 10);

    // Δημιουργία νέου χρήστη με status: 'pending' (εκκρεμεί έγκριση)
    const user = new User({
      firstName,
      lastName,
      country,
      city,
      address,
      email,
      username,
      password: hashedPassword,
      // role παίρνει το default value ('user') από το schema
      status: 'pending' // Δηλώνει ότι το αίτημα είναι σε αναμονή
    });

    await user.save();
    res.status(201).json({ message: 'Το αίτημα εγγραφής καταχωρήθηκε. Αναμείνατε έγκριση από διαχειριστή.' });
  } catch (error) {
    console.error('Σφάλμα εγγραφής:', error);
    res.status(500).json({ message: 'Σφάλμα διακομιστή κατά την εγγραφή.' });
  }
};

// Λήψη λίστας χρηστών που περιμένουν έγκριση (status: 'pending')
exports.getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ status: 'pending' });
    res.json(users);
  } catch (error) {
    console.error('Σφάλμα λήψης εκκρεμών χρηστών:', error);
    res.status(500).json({ message: 'Σφάλμα κατά τη λήψη των εκκρεμών χρηστών.' });
  }
};

// Έγκριση χρήστη (status: 'approved', επιλογή ρόλου)
exports.approveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', role: req.body.role || 'user' },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'Ο χρήστης δεν βρέθηκε.' });
    res.json({ message: 'Ο χρήστης εγκρίθηκε.', user });
  } catch (error) {
    console.error('Σφάλμα έγκρισης χρήστη:', error);
    res.status(500).json({ message: 'Σφάλμα κατά την έγκριση χρήστη.' });
  }
};

// Απόρριψη χρήστη (status: 'rejected')
// Εδώ προτείνεται να ΜΗΝ διαγράφεις τον χρήστη, αλλά να ενημερώνεις το status.
// Αν θες να διαγράφεις, χρησιμοποίησε findByIdAndDelete.
// Παρακάτω γίνεται ενημέρωση του status:
exports.rejectUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'Ο χρήστης δεν βρέθηκε.' });
    res.json({ message: 'Ο χρήστης απορρίφθηκε.', user });
  } catch (error) {
    console.error('Σφάλμα απόρριψης χρήστη:', error);
    res.status(500).json({ message: 'Σφάλμα κατά την απόρριψη χρήστη.' });
  }
};

// Είσοδος χρήστη (login) — επιτρέπεται μόνο αν status === 'approved'
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Βρες τον χρήστη
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Λάθος στοιχεία σύνδεσης.' });

    // Έλεγχος αν είναι εγκεκριμένος
    if (user.status !== 'approved') {
      return res.status(403).json({ message: 'Ο λογαριασμός σας δεν έχει εγκριθεί ακόμα.' });
    }

    // Έλεγχος password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Λάθος στοιχεία σύνδεσης.' });

    // Δημιουργία JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1d' }
    );

    res.json({ message: 'Επιτυχής σύνδεση', token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Σφάλμα κατά τη σύνδεση.' });
  }
};

// Ενημέρωση χρήστη (μόνο admin)
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'Ο χρήστης δεν βρέθηκε.' });
    res.json({ message: 'Ο χρήστης ενημερώθηκε.', user });
  } catch (error) {
    res.status(500).json({ message: 'Σφάλμα κατά την ενημέρωση χρήστη.' });
  }
};

// Διαγραφή χρήστη (μόνο admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Ο χρήστης δεν βρέθηκε.' });
    res.json({ message: 'Ο χρήστης διαγράφηκε.' });
  } catch (error) {
    res.status(500).json({ message: 'Σφάλμα κατά τη διαγραφή χρήστη.' });
  }
};