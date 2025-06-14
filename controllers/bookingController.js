const Booking = require('../models/Booking');
const Program = require('../models/Program');

// Βοηθητική για έλεγχο αν απέχουμε λιγότερο από 2 ώρες
function isWithinTwoHours(date) {
  return (new Date(date) - new Date()) < 2 * 60 * 60 * 1000;
}

// Δημιουργία κράτησης
exports.createBooking = async (req, res) => {
  try {
    const { programId, scheduleDate, day, time } = req.body;
    const userId = req.user._id; // αν δεν έχεις authentication, πάρε το userId από το body

    // Βρες το πρόγραμμα
    const program = await Program.findById(programId);
    if (!program) return res.status(404).json({ message: 'Program not found' });

    // Βρες maxCapacity για το συγκεκριμένο schedule
    const schedule = program.schedule.find(
      s => s.day === day && s.time === time
    );
    if (!schedule) return res.status(400).json({ message: 'Schedule not found' });

    // Πόσες κρατήσεις υπάρχουν ήδη για αυτό το πρόγραμμα/ημερομηνία/ώρα;
    const sameBookings = await Booking.countDocuments({
      program: programId,
      'schedule.day': day,
      'schedule.time': time,
      'schedule.date': new Date(scheduleDate),
      cancelled: false
    });
    if (sameBookings >= schedule.maxCapacity) {
      return res.status(400).json({ message: 'No seats available' });
    }

    // Έλεγξε αν ο χρήστης έχει ήδη κράτηση σε αυτή τη μέρα/ώρα/πρόγραμμα (προαιρετικό)
    const existing = await Booking.findOne({
      user: userId,
      program: programId,
      'schedule.day': day,
      'schedule.time': time,
      'schedule.date': new Date(scheduleDate),
      cancelled: false
    });
    if (existing) {
      return res.status(400).json({ message: 'Already booked' });
    }

    // Δημιούργησε την κράτηση
    const booking = await Booking.create({
      user: userId,
      program: programId,
      schedule: { day, time, date: scheduleDate }
    });

    res.status(201).json({ message: 'Booking created', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

// Ιστορικό κρατήσεων του χρήστη
exports.getMyBookings = async (req, res) => {
  try {
    const userId = req.user._id; // αν δεν έχεις auth βάζεις req.body.userId
    const bookings = await Booking.find({ user: userId })
      .populate('program')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

// Ακύρωση κράτησης
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Μόνο ο χρήστης που έκανε την κράτηση μπορεί να ακυρώσει
    if (String(booking.user) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    // Έλεγχος 2 ωρών
    if (isWithinTwoHours(booking.schedule.date)) {
      return res.status(400).json({ message: 'Cannot cancel less than 2 hours before start' });
    }

    // Περιορισμός ακυρώσεων (μέγιστο 2 ακυρώσεις ανά πρόγραμμα)
    const cancellations = await Booking.countDocuments({
      user: req.user._id,
      program: booking.program,
      cancelled: true
    });
    if (cancellations >= 2) {
      return res.status(400).json({ message: 'Cancellation limit reached for this program' });
    }

    booking.cancelled = true;
    booking.cancelledAt = new Date();
    await booking.save();

    res.json({ message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking' });
  }
};