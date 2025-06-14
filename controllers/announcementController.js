const Announcement = require('../models/Announcement');

// Create Announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const announcement = new Announcement(req.body);
    await announcement.save();
    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Error creating announcement.' });
  }
};

// Get all Announcements
exports.getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching announcements.' });
  }
};

// Get Announcement by ID
exports.getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found.' });
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching announcement.' });
  }
};

// Update Announcement
exports.updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!announcement) return res.status(404).json({ message: 'Announcement not found.' });
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Error updating announcement.' });
  }
};

// Delete Announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) return res.status(404).json({ message: 'Announcement not found.' });
    res.json({ message: 'Announcement deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting announcement.' });
  }
};