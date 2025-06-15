const express = require('express');
const router = express.Router();
const programController = require('../controllers/programController');
const { requireAuth, requireRole } = require('../middleware/auth');

// Δημιουργία, τροποποίηση, διαγραφή: μόνο admin
router.post('/', requireAuth, requireRole('admin'), programController.createProgram);
router.put('/:id', requireAuth, requireRole('admin'), programController.updateProgram);
router.delete('/:id', requireAuth, requireRole('admin'), programController.deleteProgram);

// Εμφάνιση όλων & μεμονωμένου προγράμματος: public
router.get('/', programController.getAllPrograms);
router.get('/:id', programController.getProgramById);

module.exports = router;