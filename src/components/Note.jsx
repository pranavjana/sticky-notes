import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { Resizable } from 're-resizable';

const Note = ({ id, content, position, color, onDelete, onUpdate, onDragEnd, onDrag }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [noteContent, setNoteContent] = useState(content);
  const [size, setSize] = useState({ width: 200, height: 200 });
  const [isResizing, setIsResizing] = useState(false);
  const [localPosition, setLocalPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setLocalPosition({ x: position.x, y: position.y });
  }, [position]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    if (noteContent === 'Note...') {
      setNoteContent('');
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (!noteContent.trim()) {
      setNoteContent('Note...');
    }
    onUpdate(id, noteContent);
  };

  const handleDragEnd = (event, info) => {
    if (!isResizing) {
      const newPosition = {
        x: localPosition.x + info.offset.x,
        y: localPosition.y + info.offset.y
      };
      setLocalPosition(newPosition);
      onDragEnd(id, { offset: { x: info.offset.x, y: info.offset.y } });
    }
  };

  const handleDrag = (event, info) => {
    if (!isResizing) {
      onDrag(id, info, size);
    }
  };

  return (
    <motion.div
      drag={!isEditing && !isResizing}
      dragMomentum={false}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      initial={{ x: position.x, y: position.y }}
      animate={{ x: localPosition.x, y: localPosition.y }}
      style={{ 
        position: 'absolute',
        width: size.width,
        height: size.height,
        left: 0,
        top: 0
      }}
    >
      <Resizable
        size={size}
        onResizeStart={() => setIsResizing(true)}
        onResize={(e, direction, ref, d) => {
          setSize({
            width: size.width + d.width,
            height: size.height + d.height,
          });
        }}
        onResizeStop={() => {
          setIsResizing(false);
        }}
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
        <div className={`note ${isResizing ? 'resizing' : ''}`} style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, ${color} 0%, ${color.replace(')', ', 0.8)').replace('rgb', 'rgba')} 100%)` }}>
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
