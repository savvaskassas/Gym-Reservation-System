const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { requireAuth } = require('../middleware/auth');

// Όλα τα endpoints για bookings προστατεύονται με authentication
router.post('/', requireAuth, bookingController.createBooking);
router.get('/my', requireAuth, bookingController.getMyBookings);
router.patch('/:id', requireAuth, bookingController.cancelBooking);

module.exports = router;