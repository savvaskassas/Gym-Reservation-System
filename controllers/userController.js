const User = require('../models/User');
const bcrypt = require('bcrypt');

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
    res.status(500).json({ message: 'Server error during registration.' });
  }
};