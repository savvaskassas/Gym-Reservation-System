const Program = require('../models/Program');

// Create Program
exports.createProgram = async (req, res) => {
  try {
    const program = new Program(req.body);
    await program.save();
    res.status(201).json(program);
  } catch (error) {
    res.status(500).json({ message: 'Error creating program.' });
  }
};

// Get all Programs
exports.getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find().populate('trainer');
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching programs.' });
  }
};

// Get Program by ID
exports.getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id).populate('trainer');
    if (!program) return res.status(404).json({ message: 'Program not found.' });
    res.json(program);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching program.' });
  }
};

// Update Program
exports.updateProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!program) return res.status(404).json({ message: 'Program not found.' });
    res.json(program);
  } catch (error) {
    res.status(500).json({ message: 'Error updating program.' });
  }
};

// Delete Program
exports.deleteProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);
    if (!program) return res.status(404).json({ message: 'Program not found.' });
    res.json({ message: 'Program deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting program.' });
  }
};