const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const { requireAuth, requireRole } = require('../middleware/auth');

// Μόνο admin μπορεί να δημιουργήσει, επεξεργαστεί, διαγράψει announcement
router.post('/', requireAuth, requireRole('admin'), announcementController.createAnnouncement);
router.put('/:id', requireAuth, requireRole('admin'), announcementController.updateAnnouncement);
router.delete('/:id', requireAuth, requireRole('admin'), announcementController.deleteAnnouncement);

// Μόνο authenticated χρήστες μπορούν να δουν ανακοινώσεις
router.get('/', requireAuth, announcementController.getAllAnnouncements);
router.get('/:id', requireAuth, announcementController.getAnnouncementById);

module.exports = router;