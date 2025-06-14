const jwt = require('jsonwebtoken');

exports.requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Invalid token' });

  jwt.verify(token, process.env.JWT_SECRET || 'secretkey', (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token not valid' });
    req.user = decoded;
    next();
  });
};

// Για έλεγχο ρόλου:
exports.requireRole = (role) => (req, res, next) => {
  if (req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
  next();
};