import { useState, useEffect, useCallback, useRef } from 'react';
import Note from './Note';
import ColorPicker from './ColorPicker';
import Canvas from './Canvas';
import { AnimatePresence } from 'framer-motion';
import { getNotes, createNote, updateNote, deleteNote } from '../services/noteService';
import { PlusIcon } from '@heroicons/react/24/outline';

const GRID_SIZE = 40;
const SNAP_THRESHOLD = 15;
const ZOOM_SPEED = 0.1;

const Board = () => {
  const [notes, setNotes] = useState([]);
  const [activeGridLines, setActiveGridLines] = useState({ horizontal: null, vertical: null });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [transform, setTransform] = useState({ scale: 1, x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const boardRef = useRef(null);

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

  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const preventDefaultWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    board.addEventListener('wheel', preventDefaultWheel, { passive: false });
    return () => {
      board.removeEventListener('wheel', preventDefaultWheel);
    };
  }, []);

  const handleWheel = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      const direction = e.deltaY > 0 ? -1 : 1;
      const factor = ZOOM_SPEED * direction;
      
      setTransform(prev => {
        const newScale = Math.max(0.1, Math.min(5, prev.scale * (1 + factor)));
        const scaleDiff = newScale - prev.scale;
        
        return {
          scale: newScale,
          x: prev.x - (e.clientX - prev.x) * (scaleDiff / prev.scale),
          y: prev.y - (e.clientY - prev.y) * (scaleDiff / prev.scale)
        };
      });
    } else {
      setTransform(prev => ({
        ...prev,
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY
      }));
    }
  }, []);

  const startDragging = useCallback((e) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    }
  }, [transform]);

  const stopDragging = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrag = useCallback((e) => {
    if (!isDragging) return;
    
    setTransform(prev => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    }));
  }, [isDragging, dragStart]);

  const screenToWorld = useCallback((screenX, screenY) => {
    return {
      x: screenX / transform.scale,
      y: screenY / transform.scale
    };
  }, [transform]);

  const worldToScreen = useCallback((worldX, worldY) => {
    return {
      x: worldX * transform.scale,
      y: worldY * transform.scale
    };
  }, [transform]);

  const handleAddNote = async (color) => {
    const worldPos = screenToWorld(
      window.innerWidth / 2,
      window.innerHeight / 2
    );
    
    const newNoteData = {
      content: 'New Note',
      position: {
        x: Math.round(worldPos.x / GRID_SIZE) * GRID_SIZE,
        y: Math.round(worldPos.y / GRID_SIZE) * GRID_SIZE
      },
      size: { width: 200, height: 200 },
      backgroundColor: color,
    };

    try {
      const createdNote = await createNote(newNoteData);
      setNotes([...notes, createdNote]);
    } catch (err) {
      console.error('Error creating note:', err);
    }
  };

  const updateNoteContent = async (id, content) => {
    if (typeof content !== 'string') return; // Guard against non-string content
    
    try {
      await updateNote(id, { content: content.trim() || 'New Note' });
      setNotes(notes.map(note => 
        note._id === id ? { ...note, content: content.trim() || 'New Note' } : note
      ));
    } catch (err) {
      console.error('Error updating note content:', err);
    }
  };

  const updateNotePosition = async (id, position) => {
    try {
      // Update local state immediately for smooth UI
      setNotes(notes.map(note => 
        note._id === id ? { ...note, position } : note
      ));
      
      // Then update the database
      await updateNote(id, { position });
    } catch (err) {
      console.error('Error updating note position:', err);
      // Revert to original position on error
      const originalNote = notes.find(n => n._id === id);
      if (originalNote) {
        setNotes(notes.map(note => 
          note._id === id ? originalNote : note
        ));
      }
    }
  };

  const updateNoteSize = async (id, size) => {
    try {
      await updateNote(id, { size });
      setNotes(notes.map(note => 
        note._id === id ? { ...note, size } : note
      ));
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
    <div 
      ref={boardRef}
      className="fixed inset-0 overflow-hidden bg-neutral-900 board-container"
      onWheel={handleWheel}
      onMouseDown={startDragging}
      onMouseUp={stopDragging}
      onMouseLeave={stopDragging}
      onMouseMove={handleDrag}
    >
      <Canvas transform={transform} />
      
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

      <div
        style={{
          transform: `scale(${transform.scale})`,
          transformOrigin: '0 0'
        }}
      >
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
              onUpdatePosition={updateNotePosition}
              onUpdateSize={updateNoteSize}
              transform={transform}
              screenToWorld={screenToWorld}
              worldToScreen={worldToScreen}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Board; 