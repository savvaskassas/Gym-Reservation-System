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
      return res.status(400).json({ message: 'A user with this email or username already exists.' });
    }

    // Κρυπτογράφηση κωδικού
    const hashedPassword = await bcrypt.hash(password, 10);

    // Δημιουργία νέου χρήστη με status: 'pending'
    const user = new User({
      firstName,
      lastName,
      country,
      city,
      address,
      email,
      username,
      password: hashedPassword,
      status: 'pending'
    });

    await user.save();
    res.status(201).json({ message: 'Your registration request has been submitted. Please wait for admin approval.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// Λήψη χρηστών με status 'pending'
exports.getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ status: 'pending' });
    res.json(users);
  } catch (error) {
    console.error('Error fetching pending users:', error);
    res.status(500).json({ message: 'Error fetching pending users.' });
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
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User approved.', user });
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({ message: 'Error approving user.' });
  }
};

// Απόρριψη χρήστη (status: 'rejected')
exports.rejectUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User rejected.', user });
  } catch (error) {
    console.error('Error rejecting user:', error);
    res.status(500).json({ message: 'Error rejecting user.' });
  }
};

// Σύνδεση χρήστη (επιτρέπεται μόνο αν είναι εγκεκριμένος)
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Εύρεση χρήστη
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid login credentials.' });

    // Έλεγχος αν είναι εγκεκριμένος
    if (user.status !== 'approved') {
      return res.status(403).json({ message: 'Your account has not been approved yet.' });
    }

    // Έλεγχος κωδικού
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid login credentials.' });

    // Δημιουργία JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1d' }
    );

    res.json({ message: 'Login successful.', token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Login error.' });
  }
};

// Ενημέρωση στοιχείων χρήστη (admin μόνο)
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User updated.', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user.' });
  }
};

// Διαγραφή χρήστη (admin μόνο)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user.' });
  }
};