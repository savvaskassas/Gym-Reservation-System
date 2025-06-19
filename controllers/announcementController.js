const Announcement = require('../models/Announcement');

// Δημιουργία ανακοίνωσης
exports.createAnnouncement = async (req, res) => {
  try {
    const announcement = new Announcement(req.body);
    await announcement.save();
    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Error creating announcement.' });
  }
};

// Λήψη όλων των ανακοινώσεων
exports.getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching announcements.' });
  }
};

// Λήψη ανακοίνωσης με id
exports.getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found.' });
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching announcement.' });
  }
};

// Ενημέρωση ανακοίνωσης
exports.updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!announcement) return res.status(404).json({ message: 'Announcement not found.' });
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Error updating announcement.' });
  }
};

// Διαγραφή ανακοίνωσης
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found.' });
    res.json({ message: 'Announcement deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting announcement.' });
  }
};