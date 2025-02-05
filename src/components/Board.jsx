import { useState, useEffect } from 'react';
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

const getRandomPosition = () => {
  const padding = 50; // Reduced padding since notes are smaller
  return {
    x: padding + Math.random() * (window.innerWidth - 200 - padding * 2), // Adjusted for smaller note width
    y: padding + Math.random() * (window.innerHeight - 200 - padding * 2) // Adjusted for smaller note height
  };
};

const Board = () => {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('sticky-notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  useEffect(() => {
    localStorage.setItem('sticky-notes', JSON.stringify(notes));
  }, [notes]);

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

  const handleDragEnd = (id, info) => {
    setNotes(notes.map(note =>
      note.id === id
        ? { ...note, position: { x: note.position.x + info.offset.x, y: note.position.y + info.offset.y } }
        : note
    ));
  };

  return (
    <div className="fixed inset-0 overflow-hidden bg-gray-900">
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
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Board; 