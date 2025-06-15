const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainerController');
const { requireAuth, requireRole } = require('../middleware/auth');

// Μόνο admin μπορεί να δημιουργήσει, επεξεργαστεί, διαγράψει trainer
router.post('/', requireAuth, requireRole('admin'), trainerController.createTrainer);
router.put('/:id', requireAuth, requireRole('admin'), trainerController.updateTrainer);
router.delete('/:id', requireAuth, requireRole('admin'), trainerController.deleteTrainer);

// Διαθέσιμο σε όλους 
router.get('/', trainerController.getAllTrainers);
router.get('/:id', trainerController.getTrainerById);

module.exports = router;