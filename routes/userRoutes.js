const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route για εγγραφή χρήστη
router.post('/register', userController.registerUser);

// Route για λίστα χρηστών που περιμένουν έγκριση
router.get('/pending', userController.getPendingUsers);

// Route για έγκριση χρήστη
router.put('/approve/:id', userController.approveUser);

// Route για απόρριψη/διαγραφή χρήστη
router.delete('/reject/:id', userController.rejectUser);

// Route για login χρήστη
router.post('/login', userController.loginUser);

module.exports = router;