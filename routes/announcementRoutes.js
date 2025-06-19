const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { requireAuth, requireRole } = require('../middleware/auth');

// Δημιουργία, επεξεργασία, διαγραφή ανακοίνωσης: μόνο admin
router.post('/', requireAuth, requireRole('admin'), announcementController.createAnnouncement);
router.put('/:id', requireAuth, requireRole('admin'), announcementController.updateAnnouncement);
router.delete('/:id', requireAuth, requireRole('admin'), announcementController.deleteAnnouncement);

// Προβολή ανακοινώσεων (μόνο authenticated)
router.get('/', requireAuth, announcementController.getAllAnnouncements);
router.get('/:id', requireAuth, announcementController.getAnnouncementById);

module.exports = router;