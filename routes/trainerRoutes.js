const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');
const { requireAuth, requireRole } = require('../middleware/auth');

// Δημιουργία, επεξεργασία, διαγραφή: μόνο admin
router.post('/', requireAuth, requireRole('admin'), trainerController.createTrainer);
router.put('/:id', requireAuth, requireRole('admin'), trainerController.updateTrainer);
router.delete('/:id', requireAuth, requireRole('admin'), trainerController.deleteTrainer);

// Λήψη όλων και μεμονωμένου γυμναστή (public)
router.get('/', trainerController.getAllTrainers);
router.get('/:id', trainerController.getTrainerById);

module.exports = router;