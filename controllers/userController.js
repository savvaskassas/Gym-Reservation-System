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
      return res.status(400).json({ message: 'User already exists with this email or username.' });
    }

    // Κρυπτογράφηση κωδικού
    const hashedPassword = await bcrypt.hash(password, 10);

    // Δημιουργία νέου χρήστη με approved: false (περιμένει έγκριση)
    const user = new User({
      firstName,
      lastName,
      country,
      city,
      address,
      email,
      username,
      password: hashedPassword
      // role και approved παίρνουν τα default values
    });

    await user.save();
    res.status(201).json({ message: 'Registration request submitted. Awaiting admin approval.' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// Λήψη λίστας χρηστών που περιμένουν έγκριση (approved: false)
exports.getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ approved: false });
    res.json(users);
  } catch (error) {
    console.error('Get pending users error:', error);
    res.status(500).json({ message: 'Error fetching pending users.' });
  }
};

// Έγκριση χρήστη (approved: true, επιλογή ρόλου)
exports.approveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { approved: true, role: req.body.role || 'user' },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User approved.', user });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({ message: 'Error approving user.' });
  }
};

// Απόρριψη ή διαγραφή χρήστη (π.χ. αν δεν εγκριθεί)
exports.rejectUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User rejected and deleted.' });
  } catch (error) {
    console.error('Reject user error:', error);
    res.status(500).json({ message: 'Error rejecting user.' });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Βρες τον χρήστη
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Έλεγξε αν είναι εγκεκριμένος
    if (!user.approved) return res.status(403).json({ message: 'User not approved yet' });

    // Έλεγχος password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Δημιουργία JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1d' }
    );

    res.json({ message: 'Login successful', token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Login error' });
  }
};

// Ενημέρωση χρήστη (admin only)
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

// Διαγραφή χρήστη (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user.' });
  }
};