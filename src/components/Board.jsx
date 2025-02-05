import { useState, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import Note from './Note';
import { AnimatePresence } from 'framer-motion';

const COLORS = [
  'rgb(255, 242, 179)', // yellow
  'rgb(255, 204, 204)', // pink
  'rgb(204, 255, 204)', // green
  'rgb(204, 229, 255)', // blue
  'rgb(255, 204, 255)', // purple
  'rgb(255, 218, 179)', // orange
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
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('sticky-notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [activeGridLines, setActiveGridLines] = useState({ horizontal: null, vertical: null });

  useEffect(() => {
    localStorage.setItem('sticky-notes', JSON.stringify(notes));
  }, [notes]);

  const checkGridAlignment = useCallback((position, size) => {
    const gridLines = { horizontal: null, vertical: null };
    const edges = {
      left: position.x,
      right: position.x + size.width,
      top: position.y,
      bottom: position.y + size.height
    };

    // Check horizontal alignment
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

  const handleDragEnd = (id, info) => {
    setNotes(notes.map(note => {
      if (note.id !== id) return note;

      const newX = note.position.x + info.offset.x;
      const newY = note.position.y + info.offset.y;

      // Snap to grid
      const snappedX = Math.round(newX / GRID_SIZE) * GRID_SIZE;
      const snappedY = Math.round(newY / GRID_SIZE) * GRID_SIZE;

      return {
        ...note,
        position: { x: snappedX, y: snappedY }
      };
    }));
    
    // Clean up CSS variables
    document.documentElement.style.removeProperty('--mouse-x');
    document.documentElement.style.removeProperty('--mouse-y');
    setActiveGridLines({ horizontal: null, vertical: null });
  };

  const handleDrag = (id, info, size) => {
    const note = notes.find(n => n.id === id);
    if (!note) return;

    const position = {
      x: note.position.x + info.offset.x,
      y: note.position.y + info.offset.y
    };

    const gridLines = checkGridAlignment(position, size);
    
    // Update CSS variables for the glow position
    if (gridLines.horizontal !== null) {
      document.documentElement.style.setProperty('--mouse-y', `${position.y + size.height / 2}px`);
    }
    if (gridLines.vertical !== null) {
      document.documentElement.style.setProperty('--mouse-x', `${position.x + size.width / 2}px`);
    }
    
    setActiveGridLines(gridLines);
  };

  const addNote = () => {
    const newNote = {
      id: nanoid(),
      content: 'Note...',
      position: getRandomPosition(),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
    setNotes([...notes, newNote]);
  };

  const updateNote = (id, content) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, content: content.trim() || 'Note...' } : note
    ));
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

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
            key={note.id}
            {...note}
            onDelete={deleteNote}
            onUpdate={updateNote}
            onDragEnd={handleDragEnd}
            onDrag={handleDrag}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Board; 