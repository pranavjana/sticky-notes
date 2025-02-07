import express from 'express';
import Note from '../models/Note.js';
import requireAuth from '../middleware/requireAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(requireAuth);

// Get all notes for the authenticated user
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.auth.userId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new note
router.post('/', async (req, res) => {
  try {
    const note = new Note({
      ...req.body,
      userId: req.auth.userId
    });
    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a note
router.patch('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.auth.userId },
      req.body,
      { new: true }
    );
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.auth.userId
    });
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router; 
