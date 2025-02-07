import { motion, AnimatePresence } from 'framer-motion';

const COLORS = [
  '#fef3c7', // yellow
  '#fee2e2', // pink
  '#dcfce7', // green
  '#dbeafe', // blue
  '#f5d0fe', // purple
  '#ffedd5', // orange
];

const ColorPicker = ({ isOpen, onClose, onSelectColor }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed bottom-24 right-8 flex flex-col-reverse gap-3 items-center">
          {COLORS.map((color, index) => (
            <motion.button
              key={color}
              onClick={() => {
                onSelectColor(color);
                onClose();
              }}
              initial={{ 
                opacity: 0, 
                y: 0,
                scale: 0.5
              }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: 1
              }}
              exit={{ 
                opacity: 0,
                y: 20,
                scale: 0.5
              }}
              transition={{
                duration: 0.2,
                delay: index * 0.05,
                ease: "easeOut"
              }}
              className="w-10 h-10 rounded-full shadow-lg hover:scale-110 transition-transform"
              style={{ 
                backgroundColor: color,
                border: '2px solid rgba(0,0,0,0.1)'
              }}
              whileHover={{
                y: -2,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default ColorPicker; 