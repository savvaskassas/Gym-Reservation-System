const Program = require('../models/Program');

// Δημιουργία προγράμματος
exports.createProgram = async (req, res) => {
  try {
    const program = new Program(req.body);
    await program.save();
    res.status(201).json(program);
  } catch (error) {
    res.status(500).json({ message: 'Error creating program.' });
  }
};

// Λήψη όλων των προγραμμάτων
exports.getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find().populate('schedule.trainer');
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching programs.' });
  }
};

// Λήψη προγράμματος με id
exports.getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id).populate('schedule.trainer');
    if (!program) return res.status(404).json({ message: 'Program not found.' });
    res.json(program);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching program.' });
  }
};

// Ενημέρωση προγράμματος
exports.updateProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!program) return res.status(404).json({ message: 'Program not found.' });
    res.json(program);
  } catch (error) {
    res.status(500).json({ message: 'Error updating program.' });
  }
};

// Διαγραφή προγράμματος
exports.deleteProgram = async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);
    if (!program) return res.status(404).json({ message: 'Program not found.' });
    res.json({ message: 'Program deleted.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting program.' });
  }
};

// -------------------- SLOTS CRUD --------------------

// Προσθήκη slot σε πρόγραμμα
exports.addSlot = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (!program) return res.status(404).json({ message: 'Program not found.' });
    program.schedule.push(req.body);
    await program.save();
    res.status(201).json(program);
  } catch (error) {
    res.status(500).json({ message: 'Error adding slot.' });
  }
};

// Ενημέρωση slot σε πρόγραμμα
exports.updateSlot = async (req, res) => {
  try {
    const { programId, slotId } = req.params;
    const program = await Program.findById(programId);
    if (!program) return res.status(404).json({ message: 'Program not found.' });
    const slot = program.schedule.id(slotId);
    if (!slot) return res.status(404).json({ message: 'Slot not found.' });

    slot.set(req.body);
    await program.save();
    res.json(program);
  } catch (error) {
    res.status(500).json({ message: 'Error updating slot.' });
  }
};

// Διαγραφή slot από πρόγραμμα
exports.deleteSlot = async (req, res) => {
  try {
    const { programId, slotId } = req.params;
    const program = await Program.findById(programId);
    if (!program) return res.status(404).json({ message: 'Program not found.' });
    const slot = program.schedule.id(slotId);
    if (!slot) return res.status(404).json({ message: 'Slot not found.' });

    slot.remove();
    await program.save();
    res.json(program);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting slot.' });
  }
};