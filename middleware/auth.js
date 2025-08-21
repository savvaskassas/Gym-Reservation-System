const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Ενημερωμένο requireAuth με έλεγχο blockedUntil
exports.requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Invalid token' });

  jwt.verify(token, process.env.JWT_SECRET || 'secretkey', async (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token not valid' });
    req.user = decoded;

    // Έλεγχος αν ο χρήστης είναι μπλοκαρισμένος λόγω ακυρώσεων
    try {
      const user = await User.findById(decoded.id);
      if (user && user.blockedUntil && new Date() < user.blockedUntil) {
        return res.status(403).json({ message: 'Your account is temporarily blocked due to excessive cancellations.' });
      }
    } catch (err) {
      return res.status(500).json({ message: 'Error checking blocked status.' });
    }

    next();
  });
};

// Για έλεγχο ρόλου:
exports.requireRole = (role) => (req, res, next) => {
  if (req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
  next();
};