const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { requireAuth, requireRole } = require('../middleware/auth');

// Όλα τα endpoints για bookings προστατεύονται με authentication
router.post('/', requireAuth, bookingController.createBooking);
router.get('/my', requireAuth, bookingController.getMyBookings);
router.patch('/:id', requireAuth, bookingController.cancelBooking);

// ΝΕΟ: Αναφορές/Εποπτεία - όλες οι κρατήσεις (admin only)
router.get('/all', requireAuth, requireRole('admin'), bookingController.getAllBookings);

module.exports = router;