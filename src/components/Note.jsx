import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { Resizable } from 're-resizable';

const Note = ({ 
  id, 
  content, 
  position,
  backgroundColor,
  size: initialSize,
  onDelete,
  onUpdate,
  onUpdatePosition,
  onUpdateSize,
  transform,
  screenToWorld,
  worldToScreen
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [noteContent, setNoteContent] = useState(content);
  const [size, setSize] = useState(initialSize || { width: 200, height: 200 });
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    setNoteContent(content);
  }, [content]);

  useEffect(() => {
    setSize(initialSize || { width: 200, height: 200 });
  }, [initialSize]);

  const handleDragEnd = (event, info) => {
    // info.point is already in screen coordinates
    const finalWorldPos = screenToWorld(info.point.x, info.point.y);
    
    // Snap to grid
    const snappedPos = {
      x: Math.round(finalWorldPos.x / 40) * 40,
      y: Math.round(finalWorldPos.y / 40) * 40
    };

    onUpdatePosition(id, snappedPos);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
    if (noteContent === 'New Note') {
      setNoteContent('');
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (!noteContent.trim()) {
      setNoteContent('New Note');
    }
    onUpdate(id, noteContent);
  };

  const handleResize = (e, direction, ref, d) => {
    const newSize = {
      width: initialSize.width + d.width,
      height: initialSize.height + d.height,
    };
    setSize(newSize);
  };

  const handleResizeStop = (e, direction, ref, d) => {
    const finalSize = {
      width: initialSize.width + d.width,
      height: initialSize.height + d.height,
    };
    setSize(finalSize);
    setIsResizing(false);
    onUpdateSize(id, finalSize);
  };

  // Convert hex to rgba for gradient
  const getGradientColors = (hexColor) => {
    // Default to a light yellow if no color is provided
    const defaultColor = '#fef3c7';
    const color = hexColor || defaultColor;
    
    // Function to convert hex to rgba
    const hexToRgba = (hex, alpha = 1) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    return {
      start: color,
      end: hexToRgba(color, 0.8)
    };
  };

  const colors = getGradientColors(backgroundColor);

  return (
    <motion.div
      drag={!isEditing && !isResizing}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={handleDragEnd}
      initial={false}
      style={{ 
        position: 'absolute',
        width: size.width,
        height: size.height,
        cursor: isEditing ? 'text' : 'move',
        touchAction: 'none',
        x: position.x + transform.x,
        y: position.y + transform.y
      }}
    >
      <Resizable
        size={size}
        onResizeStart={() => setIsResizing(true)}
        onResize={handleResize}
        onResizeStop={handleResizeStop}
        minWidth={150}
        minHeight={150}
        maxWidth={400}
        maxHeight={400}
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
        handleClasses={{
          bottomRight: 'resize-handle-corner',
          right: 'resize-handle-edge',
          bottom: 'resize-handle-edge'
        }}
        handleStyles={{
          right: { right: -6 },
          bottom: { bottom: -6 },
          bottomRight: { bottom: -6, right: -6 }
        }}
      >
        <div 
          className={`note ${isResizing ? 'resizing' : ''}`} 
          style={{ 
            width: '100%', 
            height: '100%', 
            background: `linear-gradient(135deg, ${colors.start} 0%, ${colors.end} 100%)`,
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
        >
          <div className="w-full h-full select-none relative">
            <div className="resize-frame">
              <div className="resize-corner resize-corner-tl"></div>
              <div className="resize-corner resize-corner-tr"></div>
              <div className="resize-corner resize-corner-bl"></div>
              <div className="resize-corner resize-corner-br"></div>
            </div>
            <XMarkIcon
              className="absolute top-2 right-2 h-4 w-4 text-gray-500 hover:text-red-600 transition-colors cursor-pointer z-10"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
            />
            <div className="w-full h-full p-2">
              {isEditing ? (
                <textarea
                  autoFocus
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  onBlur={handleBlur}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full h-full bg-transparent resize-none outline-none text-gray-800 placeholder-gray-500 text-sm font-handwritten whitespace-pre-wrap"
                  placeholder="Write your note..."
                  style={{ minHeight: '80%' }}
                />
              ) : (
                <div
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    handleDoubleClick();
                  }}
                  className="w-full h-full break-words text-gray-800 font-handwritten text-sm overflow-auto whitespace-pre-wrap"
                >
                  {noteContent}
                </div>
              )}
            </div>
          </div>
        </div>
      </Resizable>
    </motion.div>
  );
};

export default Note;
