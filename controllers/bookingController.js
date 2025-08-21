const Booking = require('../models/Booking');
const Program = require('../models/Program');
const User = require('../models/User'); // Για ελέγχους admin/blocked

// Βοηθητική για έλεγχο αν απέχουμε λιγότερο από 2 ώρες
function isWithinTwoHours(date) {
  return (new Date(date) - new Date()) < 2 * 60 * 60 * 1000;
}

// Βοηθητική για εύ εύρος εβδομάδας (Δευτέρα-Κυριακή)
function getWeekRange(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0: Κυριακή, 1: Δευτέρα, ..., 6: Σάββατο
  const diffToMonday = d.getDate() - ((day + 6) % 7);
  const monday = new Date(d.setDate(diffToMonday));
  monday.setHours(0,0,0,0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23,59,59,999);
  return { start: monday, end: sunday };
}

// Δημιουργία κράτησης
exports.createBooking = async (req, res) => {
  try {
    const { programId, scheduleDate, day, time } = req.body;
    const userId = req.user.id;

    // Έλεγχος αν ο χρήστης είναι μπλοκαρισμένος λόγω ακυρώσεων
    const user = await User.findById(userId);
    if (user.blockedUntil && new Date() < user.blockedUntil) {
      return res.status(403).json({ message: 'Your account is temporarily blocked due to excessive cancellations.' });
    }

    // Υπολόγισε την εβδομάδα της ζητούμενης κράτησης
    const { start, end } = getWeekRange(scheduleDate);

    // Μέτρα ακυρώσεις του χρήστη αυτή την εβδομάδα
    const cancellations = await Booking.countDocuments({
      user: userId,
      cancelled: true,
      cancelledAt: { $gte: start, $lte: end }
    });
    if (cancellations >= 2) {
      // Μπλοκάρισμα για το υπόλοιπο της εβδομάδας
      await User.findByIdAndUpdate(userId, { blockedUntil: end });
      return res.status(400).json({ message: 'You have reached the cancellation limit (2 per week). You cannot make a new booking for this week.' });
    }

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

    // Έλεγξε αν ο χρήστης έχει ήδη κράτηση σε αυτή τη μέρα/ώρα/πρόγραμμα
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
    const userId = req.user.id;
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
    if (String(booking.user) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    // Έλεγχος αν ο χρήστης είναι μπλοκαρισμένος λόγω ακυρώσεων
    const user = await User.findById(req.user.id);
    if (user.blockedUntil && new Date() < user.blockedUntil) {
      return res.status(403).json({ message: 'Your account is temporarily blocked due to excessive cancellations.' });
    }

    // Έλεγχος 2 ωρών
    if (isWithinTwoHours(booking.schedule.date)) {
      return res.status(400).json({ message: 'Cannot cancel less than 2 hours before start' });
    }

    // Υπολόγισε την εβδομάδα της κράτησης
    const { start, end } = getWeekRange(booking.schedule.date);

    // Μέτρα ακυρώσεις του χρήστη αυτή την εβδομάδα 
    const cancellations = await Booking.countDocuments({
      user: req.user._id,
      cancelled: true,
      cancelledAt: { $gte: start, $lte: end }
    });
    if (cancellations >= 2) {
      // Μπλοκάρισμα για το υπόλοιπο της εβδομάδας
      await User.findByIdAndUpdate(req.user.id, { blockedUntil: end });
      return res.status(400).json({ message: 'You have reached the cancellation limit (2 per week) for this week.' });
    }

    booking.cancelled = true;
    booking.cancelledAt = new Date();
    await booking.save();

    res.json({ message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking' });
  }
};

// ΝΕΟ: Εποπτεία/Αναφορές - όλες οι κρατήσεις (admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'firstName lastName username email')
      .populate('program', 'name')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all bookings' });
  }
};