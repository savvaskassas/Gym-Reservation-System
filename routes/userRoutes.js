const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth, requireRole } = require('../middleware/auth');

// Εγγραφή χρήστη
router.post('/register', userController.registerUser);

// Λίστα εκκρεμών χρηστών (μόνο για admin)
router.get('/pending', requireAuth, requireRole('admin'), userController.getPendingUsers);

// Έγκριση χρήστη (admin)
router.put('/approve/:id', requireAuth, requireRole('admin'), userController.approveUser);

// Απόρριψη χρήστη (admin)
router.delete('/reject/:id', requireAuth, requireRole('admin'), userController.rejectUser);

// Λίστα όλων των χρηστών (μόνο για admin) 
router.get('/', requireAuth, requireRole('admin'), userController.getAllUsers);

// Σύνδεση χρήστη
router.post('/login', userController.loginUser);

// Ενημέρωση χρήστη (admin)
router.put('/:id', requireAuth, requireRole('admin'), userController.updateUser);

// Διαγραφή χρήστη (admin)
router.delete('/:id', requireAuth, requireRole('admin'), userController.deleteUser);

module.exports = router;