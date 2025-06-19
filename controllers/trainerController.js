const Trainer = require('../models/Trainer');

// Δημιουργία γυμναστή
exports.createTrainer = async (req, res) => {
  try {
    const trainer = new Trainer(req.body);
    await trainer.save();
    res.status(201).json(trainer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating trainer.' });
  }
};

// Λήψη όλων των γυμναστών
exports.getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.find();
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trainers.' });
  }
};

// Λήψη γυμναστή βάση id
exports.getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found.' });
    res.json(trainer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trainer.' });
  }
};

// Ενημέρωση γυμναστή
exports.updateTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!trainer) return res.status(404).json({ message: 'Trainer not found.' });
    res.json(trainer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating trainer.' });
  }
};

// Διαγραφή γυμναστή
exports.deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByIdAndDelete(req.params.id);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found.' });
    res.json({ message: 'Trainer deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting trainer.' });
  }
};