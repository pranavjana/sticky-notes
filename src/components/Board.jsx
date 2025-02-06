import { useState, useEffect, useCallback } from 'react';
import Note from './Note';
import { AnimatePresence } from 'framer-motion';
import { getNotes, createNote, updateNote, deleteNote, batchUpdateNotes } from '../services/noteService';

const COLORS = [
  '#fef3c7', // yellow
  '#fee2e2', // pink
  '#dcfce7', // green
  '#dbeafe', // blue
  '#f5d0fe', // purple
  '#ffedd5', // orange
];

const GRID_SIZE = 40;
const SNAP_THRESHOLD = 15;

const getRandomPosition = () => {
  const padding = 50;
  const x = padding + Math.random() * (window.innerWidth - 200 - padding * 2);
  const y = padding + Math.random() * (window.innerHeight - 200 - padding * 2);
  return {
    x: Math.round(x / GRID_SIZE) * GRID_SIZE,
    y: Math.round(y / GRID_SIZE) * GRID_SIZE
  };
};

const Board = () => {
  const [notes, setNotes] = useState([]);
  const [activeGridLines, setActiveGridLines] = useState({ horizontal: null, vertical: null });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notes from MongoDB when component mounts
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const fetchedNotes = await getNotes();
        setNotes(fetchedNotes);
      } catch (err) {
        setError('Failed to load notes');
        console.error('Error fetching notes:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const checkGridAlignment = useCallback((position, size) => {
    const gridLines = { horizontal: null, vertical: null };
    const edges = {
      left: position.x,
      right: position.x + size.width,
      top: position.y,
      bottom: position.y + size.height
    };

    Object.entries(edges).forEach(([edge, value]) => {
      const nearestGridLine = Math.round(value / GRID_SIZE) * GRID_SIZE;
      const distance = Math.abs(value - nearestGridLine);

      if (distance < SNAP_THRESHOLD) {
        if (edge === 'top' || edge === 'bottom') {
          gridLines.horizontal = nearestGridLine;
        } else {
          gridLines.vertical = nearestGridLine;
        }
      }
    });

    return gridLines;
  }, []);

  const handleDragEnd = async (id, info, size) => {
    const note = notes.find(n => n._id === id);
    if (!note) return;

    const newX = note.position.x + info.offset.x;
    const newY = note.position.y + info.offset.y;

    // Snap to grid
    const snappedX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
    const snappedY = Math.round(newY / GRID_SIZE) * GRID_SIZE;

    try {
      await updateNote(id, {
        position: { x: snappedX, y: snappedY },
        size: size
      });

      setNotes(notes.map(note => 
        note._id === id 
          ? { ...note, position: { x: snappedX, y: snappedY }, size }
          : note
      ));
    } catch (err) {
      console.error('Error updating note position:', err);
    }
    
    document.documentElement.style.removeProperty('--mouse-x');
    document.documentElement.style.removeProperty('--mouse-y');
    setActiveGridLines({ horizontal: null, vertical: null });
  };

  const handleDrag = (id, info, size) => {
    const note = notes.find(n => n._id === id);
    if (!note) return;

    const position = {
      x: note.position.x + info.offset.x,
      y: note.position.y + info.offset.y
    };

    const gridLines = checkGridAlignment(position, size);
    
    if (gridLines.horizontal !== null) {
      document.documentElement.style.setProperty('--mouse-y', `${position.y + size.height / 2}px`);
    }
    if (gridLines.vertical !== null) {
      document.documentElement.style.setProperty('--mouse-x', `${position.x + size.width / 2}px`);
    }
    
    setActiveGridLines(gridLines);
  };

  const addNote = async () => {
    const newNoteData = {
      content: 'New Note',
      position: getRandomPosition(),
      size: { width: 200, height: 200 },
      backgroundColor: COLORS[Math.floor(Math.random() * COLORS.length)],
    };

    try {
      const createdNote = await createNote(newNoteData);
      setNotes([...notes, createdNote]);
    } catch (err) {
      console.error('Error creating note:', err);
    }
  };

  const updateNoteContent = async (id, content) => {
    try {
      await updateNote(id, { content: content.trim() || 'New Note' });
      setNotes(notes.map(note => 
        note._id === id ? { ...note, content: content.trim() || 'New Note' } : note
      ));
    } catch (err) {
      console.error('Error updating note content:', err);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await deleteNote(id);
      setNotes(notes.filter(note => note._id !== id));
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-neutral-900">
        <div className="text-neutral-100 text-xl">Loading notes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-neutral-900">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-neutral-900">
      <div className="board-grid" style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none'
      }} />
      {activeGridLines.horizontal !== null && (
        <div
          className="grid-line grid-line-horizontal active"
          style={{ top: activeGridLines.horizontal }}
        />
      )}
      {activeGridLines.vertical !== null && (
        <div
          className="grid-line grid-line-vertical active"
          style={{ left: activeGridLines.vertical }}
        />
      )}
      <button
        onClick={addNote}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50 flex items-center justify-center w-12 h-12"
      >
        <span className="text-2xl">+</span>
      </button>
      <AnimatePresence>
        {notes.map(note => (
          <Note
            key={note._id}
            id={note._id}
            content={note.content}
            position={note.position}
            size={note.size}
            backgroundColor={note.backgroundColor}
            onDelete={handleDeleteNote}
            onUpdate={updateNoteContent}
            onDragEnd={handleDragEnd}
            onDrag={handleDrag}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Board; 