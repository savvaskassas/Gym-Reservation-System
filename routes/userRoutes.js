const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { requireAuth, requireRole } = require('../middleware/auth');

// Route για εγγραφή χρήστη
router.post('/register', userController.registerUser);

// Route για λίστα χρηστών που περιμένουν έγκριση
router.get('/pending', requireAuth, requireRole('admin'), userController.getPendingUsers);

// Route για έγκριση χρήστη
router.put('/approve/:id', requireAuth, requireRole('admin'), userController.approveUser);

// Route για απόρριψη/διαγραφή χρήστη
router.delete('/reject/:id', requireAuth, requireRole('admin'), userController.rejectUser);

// Route για login χρήστη
router.post('/login', userController.loginUser);

// Update user (admin only)
router.put('/:id', requireAuth, requireRole('admin'), userController.updateUser);

// Delete user (admin only)
router.delete('/:id', requireAuth, requireRole('admin'), userController.deleteUser);

module.exports = router;