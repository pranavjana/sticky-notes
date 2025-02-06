import { useState, useEffect, useCallback, useRef } from 'react';
import Note from './Note';
import ColorPicker from './ColorPicker';
import Canvas from './Canvas';
import { AnimatePresence } from 'framer-motion';
import { getNotes, createNote, updateNote, deleteNote } from '../services/noteService';
import { PlusIcon } from '@heroicons/react/24/outline';

const GRID_SIZE = 40;
const SNAP_THRESHOLD = 15;
const ZOOM_SPEED = 0.03;

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

    const handleWheelEvent = (e) => {
      e.preventDefault(); // Prevent any default scrolling
      
      if (e.ctrlKey || e.metaKey) {
        const direction = e.deltaY > 0 ? -1 : 1;
        const factor = ZOOM_SPEED * direction;
        
        setTransform(prev => {
          const newScale = Math.max(0.1, Math.min(5, prev.scale * (1 + factor)));
          
          // Calculate how much the content will change in size
          const dx = (e.clientX - prev.x) * (1 - newScale / prev.scale);
          const dy = (e.clientY - prev.y) * (1 - newScale / prev.scale);
          
          return {
            scale: newScale,
            x: prev.x + dx,
            y: prev.y + dy
          };
        });
      }
    };

    board.addEventListener('wheel', handleWheelEvent, { passive: false });
    return () => {
      board.removeEventListener('wheel', handleWheelEvent);
    };
  }, [transform]);

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
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    setTransform(prev => ({
      ...prev,
      x: newX,
      y: newY
    }));
  }, [isDragging, dragStart]);

  const screenToWorld = useCallback((screenX, screenY) => {
    // Convert screen coordinates to world coordinates
    const x = (screenX - transform.x) / transform.scale;
    const y = (screenY - transform.y) / transform.scale;
    return { x, y };
  }, [transform]);

  const worldToScreen = useCallback((worldX, worldY) => {
    return {
      x: worldX * transform.scale + transform.x,
      y: worldY * transform.scale + transform.y
    };
  }, [transform]);

  const handleAddNote = async (color) => {
    // Get the viewport center in screen coordinates
    const viewportCenterX = window.innerWidth / 2;
    const viewportCenterY = window.innerHeight / 2;
    
    // Convert to world coordinates taking into account current transform
    const worldPos = {
      x: (viewportCenterX - transform.x) / transform.scale,
      y: (viewportCenterY - transform.y) / transform.scale
    };
    
    // Snap to grid
    const snappedPos = {
      x: Math.round(worldPos.x / GRID_SIZE) * GRID_SIZE,
      y: Math.round(worldPos.y / GRID_SIZE) * GRID_SIZE
    };
    
    const newNoteData = {
      content: 'New Note',
      position: snappedPos,
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
        className="notes-container"
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
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
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Board; 