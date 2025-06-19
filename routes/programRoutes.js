const express = require('express');
const router = express.Router();
const programController = require('../controllers/programController');
const { requireAuth, requireRole } = require('../middleware/auth');

// Δημιουργία, επεξεργασία, διαγραφή προγράμματος: μόνο admin
router.post('/', requireAuth, requireRole('admin'), programController.createProgram);
router.put('/:id', requireAuth, requireRole('admin'), programController.updateProgram);
router.delete('/:id', requireAuth, requireRole('admin'), programController.deleteProgram);

// CRUD για slots (μόνο admin)
router.post('/:id/slots', requireAuth, requireRole('admin'), programController.addSlot);
router.put('/:programId/slots/:slotId', requireAuth, requireRole('admin'), programController.updateSlot);
router.delete('/:programId/slots/:slotId', requireAuth, requireRole('admin'), programController.deleteSlot);

// Λήψη όλων και μεμονωμένου προγράμματος (public)
router.get('/', programController.getAllPrograms);
router.get('/:id', programController.getProgramById);

module.exports = router;