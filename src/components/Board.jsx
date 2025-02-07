import { useState, useEffect } from 'react';
import Note from './Note';
import ColorPicker from './ColorPicker';
import { getNotes, createNote, updateNote, deleteNote } from '../services/noteService';
import { PlusIcon } from '@heroicons/react/24/outline';

const Board = () => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  // Fetch notes when component mounts
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const fetchedNotes = await getNotes();
        setNotes(fetchedNotes);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching notes:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleAddNote = async (color) => {
    const newNoteData = {
      content: 'New Note',
      title: '',
      emoji: '📝',
      position: {
        x: window.innerWidth / 2 - 150,
        y: window.innerHeight / 2 - 150
      },
      size: {
        width: 300,
        height: 300
      },
      backgroundColor: color,
      zIndex: 0
    };

    try {
      const createdNote = await createNote(newNoteData);
      setNotes(prevNotes => [...prevNotes, createdNote]);
    } catch (err) {
      console.error('Error creating note:', err);
    }
  };

  const updateNoteContent = async (id, updates) => {
    try {
      console.log('Sending update to server:', updates);
      const updatedNote = await updateNote(id, updates);
      
      if (!updatedNote) {
        console.error('No response received from server');
        return;
      }
      
      console.log('Received response from server:', updatedNote);
      
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note._id === id ? { ...note, ...updatedNote } : note
        )
      );
    } catch (err) {
      console.error('Error updating note:', err);
    }
  };

  const updateNotePosition = async (id, position) => {
    try {
      const noteUpdate = { position };
      
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note._id === id ? { ...note, ...noteUpdate } : note
        )
      );
      await updateNote(id, noteUpdate);
    } catch (err) {
      console.error('Error updating note position:', err);
    }
  };

  const updateNoteSize = async (id, size) => {
    try {
      const noteUpdate = { size };
      
      await updateNote(id, noteUpdate);
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note._id === id ? { ...note, ...noteUpdate } : note
        )
      );
    } catch (err) {
      console.error('Error updating note size:', err);
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
      <div className="board-grid" />
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50 flex items-center justify-center w-12 h-12 relative"
        >
          <PlusIcon className="h-6 w-6" />
        </button>
        <ColorPicker
          isOpen={isColorPickerOpen}
          onClose={() => setIsColorPickerOpen(false)}
          onSelectColor={handleAddNote}
        />
      </div>

      <div className="absolute inset-0">
        {notes.map(note => (
          <Note
            key={note._id}
            id={note._id}
            content={note.content}
            title={note.title}
            emoji={note.emoji}
            position={note.position}
            size={note.size}
            backgroundColor={note.backgroundColor}
            onDelete={handleDeleteNote}
            onUpdate={updateNoteContent}
            onUpdatePosition={updateNotePosition}
            onUpdateSize={updateNoteSize}
          />
        ))}
      </div>
    </div>
  );
};

export default Board; 
