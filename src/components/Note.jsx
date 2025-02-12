import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect, useRef } from 'react';
import { Resizable } from 're-resizable';
import EmojiPicker from './EmojiPicker';

const MIN_NOTE_SIZE = 300;
const MAX_NOTE_SIZE = 800;

const Note = ({ 
  id, 
  content,
  title: initialTitle = '',
  emoji: initialEmoji = "📝",
  position,
  backgroundColor,
  size: initialSize,
  onDelete,
  onUpdate,
  onUpdatePosition,
  onUpdateSize
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [noteContent, setNoteContent] = useState(content);
  const [size, setSize] = useState(initialSize || { width: MIN_NOTE_SIZE, height: MIN_NOTE_SIZE });
  const [isResizing, setIsResizing] = useState(false);
  const [emoji, setEmoji] = useState(initialEmoji);
  const [noteTitle, setNoteTitle] = useState(initialTitle);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const contentEditableRef = useRef(null);

  useEffect(() => {
    setNoteContent(content);
  }, [content]);

  useEffect(() => {
    setEmoji(initialEmoji);
  }, [initialEmoji]);

  useEffect(() => {
    setNoteTitle(initialTitle);
  }, [initialTitle]);

  useEffect(() => {
    const width = Math.max(MIN_NOTE_SIZE, initialSize?.width || MIN_NOTE_SIZE);
    const height = Math.max(MIN_NOTE_SIZE, initialSize?.height || MIN_NOTE_SIZE);
    setSize({ width, height });
  }, [initialSize]);

  const createNoteUpdate = (overrides = {}) => ({
    title: noteTitle.trim(),
    content: noteContent.trim() || 'New Note',
    emoji: overrides.emoji || emoji,
    position,
    size,
    backgroundColor,
    zIndex: overrides.zIndex || 0
  });

  const handleContentChange = (e) => {
    setNoteContent(e.target.textContent);
  };

  const handleBlur = () => {
    setIsEditing(false);
    const updatedContent = noteContent.trim() || 'New Note';
    setNoteContent(updatedContent);
    onUpdate(id, createNoteUpdate());
  };

  const handleTitleBlur = () => {
    setIsTitleFocused(false);
    onUpdate(id, createNoteUpdate());
  };

  const handleEmojiSelect = (newEmoji) => {
    setEmoji(newEmoji);
    onUpdate(id, createNoteUpdate({ emoji: newEmoji }));
  };

  const handleResize = (e, direction, ref, d) => {
    const newWidth = Math.min(MAX_NOTE_SIZE, Math.max(MIN_NOTE_SIZE, size.width + d.width));
    const newHeight = Math.min(MAX_NOTE_SIZE, Math.max(MIN_NOTE_SIZE, size.height + d.height));
    
    setSize({
      width: newWidth,
      height: newHeight
    });
  };

  const handleResizeStop = (e, direction, ref, d) => {
    const finalSize = {
      width: Math.min(MAX_NOTE_SIZE, Math.max(MIN_NOTE_SIZE, ref.offsetWidth)),
      height: Math.min(MAX_NOTE_SIZE, Math.max(MIN_NOTE_SIZE, ref.offsetHeight))
    };
    
    setSize(finalSize);
    setIsResizing(false);
    onUpdateSize(id, finalSize);
  };

  const getRandomColor = () => {
    const colors = [
      '#fef3c7', // yellow
      '#fee2e2', // pink
      '#dcfce7', // green
      '#dbeafe', // blue
      '#f5d0fe', // purple
      '#ffedd5', // orange
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <motion.div
      drag={!isEditing && !isResizing && !isTitleFocused}
      dragMomentum={false}
      dragElastic={0}
      initial={{ x: position.x, y: position.y }}
      animate={{ x: position.x, y: position.y }}
      onDragEnd={(event, info) => {
        if (isResizing) return;
        onUpdatePosition(id, { x: info.offset.x + position.x, y: info.offset.y + position.y });
      }}
      style={{ 
        position: 'absolute',
        width: size.width,
        height: size.height,
        cursor: (isEditing || isTitleFocused) ? 'text' : isResizing ? 'se-resize' : 'move',
        touchAction: (isEditing || isTitleFocused) ? 'auto' : 'none',
        pointerEvents: (isEditing || isTitleFocused) ? 'auto' : 'inherit',
        x: 0,
        y: 0
      }}
      whileHover={{
        scale: isResizing ? 1 : 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <Resizable
        size={size}
        minWidth={MIN_NOTE_SIZE}
        minHeight={MIN_NOTE_SIZE}
        maxWidth={MAX_NOTE_SIZE}
        maxHeight={MAX_NOTE_SIZE}
        onResizeStart={() => setIsResizing(true)}
        onResize={handleResize}
        onResizeStop={handleResizeStop}
        enable={{
          top: false,
          right: !isEditing,
          bottom: !isEditing,
          left: false,
          topRight: false,
          bottomRight: !isEditing,
          bottomLeft: false,
          topLeft: false
        }}
        handleStyles={{
          bottomRight: { cursor: 'se-resize' }
        }}
      >
        <div 
          className="h-full w-full rounded-2xl p-6 shadow-lg transition-shadow group/note"
          style={{ 
            background: `linear-gradient(135deg, ${backgroundColor || getRandomColor()} 0%, ${backgroundColor ? backgroundColor + 'cc' : getRandomColor() + 'cc'} 100%)`,
          }}
        >
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex justify-start items-center mb-4 w-full">
              <EmojiPicker onEmojiSelect={handleEmojiSelect} currentEmoji={emoji} className="emoji-picker-btn text-2xl" />
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                onFocus={() => setIsTitleFocused(true)}
                onBlur={handleTitleBlur}
                className="text-2xl font-bold bg-transparent outline-none w-full text-left ml-2 text-neutral-700 placeholder-neutral-400"
                placeholder="Enter a title..."
              />
              <XMarkIcon 
                className="h-4 w-4 text-neutral-600/70 hover:text-red-600 transition-colors cursor-pointer" 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
              />
            </div>
            <div className="flex-1 w-full">
              {isEditing ? (
                <textarea
                  ref={contentEditableRef}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  onBlur={handleBlur}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full h-full bg-transparent outline-none text-neutral-800 text-sm font-medium resize-none p-0 border-0"
                  style={{ direction: 'ltr' }}
                />
              ) : (
                <div
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setIsEditing(true);
                    if (noteContent === 'New Note') {
                      setNoteContent('');
                    }
                  }}
                  className="w-full h-full text-neutral-800 text-sm font-medium whitespace-pre-wrap break-words cursor-text"
                  style={{ direction: 'ltr' }}
                >
                  {noteContent}
                </div>
              )}
            </div>
          </div>
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover/note:opacity-100 bg-black/10 transition-opacity pointer-events-none" />
        </div>
      </Resizable>
    </motion.div>
  );
};

export default Note;
