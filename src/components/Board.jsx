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

  const checkGridAlignment = useCallback((info, size) => {
    const gridLines = { horizontal: null, vertical: null };
    
    // Use the size from the info object if available (during resize) or fallback to provided size
    const currentSize = info.size || size;
    const position = info.position;
    
    // Calculate bottom-right corner position
    const bottomRightX = position.x + currentSize.width;
    const bottomRightY = position.y + currentSize.height;

    // Check horizontal alignment for bottom edge
    const nearestHorizontalLine = Math.round(bottomRightY / GRID_SIZE) * GRID_SIZE;
    const horizontalDistance = Math.abs(bottomRightY - nearestHorizontalLine);

    // Check vertical alignment for right edge
    const nearestVerticalLine = Math.round(bottomRightX / GRID_SIZE) * GRID_SIZE;
    const verticalDistance = Math.abs(bottomRightX - nearestVerticalLine);

    if (horizontalDistance < SNAP_THRESHOLD) {
      gridLines.horizontal = nearestHorizontalLine;
    }

    if (verticalDistance < SNAP_THRESHOLD) {
      gridLines.vertical = nearestVerticalLine;
    }

    // Update CSS variables for grid lines
    if (gridLines.horizontal !== null) {
      document.documentElement.style.setProperty('--mouse-y', `${gridLines.horizontal}px`);
    } else {
      document.documentElement.style.removeProperty('--mouse-y');
    }

    if (gridLines.vertical !== null) {
      document.documentElement.style.setProperty('--mouse-x', `${gridLines.vertical}px`);
    } else {
      document.documentElement.style.removeProperty('--mouse-x');
    }

    return gridLines;
  }, []);

  const handleDrag = (id, info, size) => {
    const note = notes.find(n => n._id === id);
    if (!note) return;

    const gridLines = checkGridAlignment(info, size);
    setActiveGridLines(gridLines);
  };

  const handleDragEnd = async (id, info, size) => {
    const note = notes.find(n => n._id === id);
    if (!note) return;

    // Clean up grid lines
    document.documentElement.style.removeProperty('--mouse-x');
    document.documentElement.style.removeProperty('--mouse-y');
    setActiveGridLines({ horizontal: null, vertical: null });

    // Get the final position and size
    const position = info.position;
    const finalSize = info.size || size;

    // Snap the position to grid
    const snappedPosition = {
      x: Math.round(position.x / GRID_SIZE) * GRID_SIZE,
      y: Math.round(position.y / GRID_SIZE) * GRID_SIZE
    };

    try {
      await updateNote(id, {
        position: snappedPosition,
        size: finalSize
      });

      setNotes(notes.map(note => 
        note._id === id 
          ? { ...note, position: snappedPosition, size: finalSize }
          : note
      ));
    } catch (err) {
      console.error('Error updating note position:', err);
    }
  };

  const addNote = async () => {
    const defaultSize = { width: 200, height: 200 };
    const newNoteData = {
      content: 'New Note',
      position: getRandomPosition(),
      size: defaultSize,
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