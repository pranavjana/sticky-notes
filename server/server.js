import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Note from './models/Note.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Auth middleware
const requireAuth = ClerkExpressRequireAuth({
  secretKey: process.env.CLERK_SECRET_KEY
});

// Routes
// Get all notes for a user
app.get('/api/notes', requireAuth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.auth.userId });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new note
app.post('/api/notes', requireAuth, async (req, res) => {
  try {
    const { content, position, size, backgroundColor } = req.body;
    const note = new Note({
      content: content || 'New Note',
      position: position || { x: 0, y: 0 },
      size: size || { width: 200, height: 200 },
      backgroundColor: backgroundColor || '#fef3c7',
      userId: req.auth.userId
    });
    const newNote = await note.save();
    res.status(201).json(newNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a note
app.put('/api/notes/:id', requireAuth, async (req, res) => {
  try {
    const { content, position, size, backgroundColor, zIndex } = req.body;
    const note = await Note.findOne({ _id: req.params.id, userId: req.auth.userId });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Update only the provided fields
    if (content !== undefined) note.content = content;
    if (position !== undefined) note.position = position;
    if (size !== undefined) note.size = size;
    if (backgroundColor !== undefined) note.backgroundColor = backgroundColor;
    if (zIndex !== undefined) note.zIndex = zIndex;
    
    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Batch update notes positions and sizes
app.put('/api/notes/batch-update', requireAuth, async (req, res) => {
  try {
    const { updates } = req.body; // Array of {id, position, size}
    const results = await Promise.all(
      updates.map(async (update) => {
        const note = await Note.findOne({ 
          _id: update.id, 
          userId: req.auth.userId 
        });
        
        if (!note) return null;
        
        if (update.position) note.position = update.position;
        if (update.size) note.size = update.size;
        if (update.zIndex) note.zIndex = update.zIndex;
        
        return note.save();
      })
    );
    
    res.json(results.filter(Boolean));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a note
app.delete('/api/notes/:id', requireAuth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.auth.userId 
    });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Debug route to check data (remove in production)
app.get('/api/debug/notes', async (req, res) => {
  try {
    const notes = await Note.find({}).select('-__v');
    const stats = {
      totalNotes: notes.length,
      notesByUser: {},
      averageContentLength: 0,
    };

    notes.forEach(note => {
      // Count notes per user
      if (!stats.notesByUser[note.userId]) {
        stats.notesByUser[note.userId] = 0;
      }
      stats.notesByUser[note.userId]++;

      // Calculate average content length
      if (note.content) {
        stats.averageContentLength += note.content.length;
      }
    });

    if (notes.length > 0) {
      stats.averageContentLength = Math.round(stats.averageContentLength / notes.length);
    }

    res.json({
      stats,
      notes
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 