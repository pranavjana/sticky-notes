import { useState, useRef, useEffect } from 'react';

const EMOJIS = {
  "Smileys & People": ["😀", "😃", "😄", "😁", "😅", "😂", "🤣", "🥲", "☺️", "😊"],
  "Animals & Nature": ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯"],
  "Food & Drink": ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈"],
  "Activities": ["⚽️", "🏀", "🏈", "⚾️", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱"],
  "Objects": ["⌚️", "📱", "📲", "💻", "⌨️", "🖥️", "🖨️", "🖱️", "🖲️", "🕹️"],
  "Symbols": ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔"]
};

const EmojiPicker = ({ onEmojiSelect, currentEmoji }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="emoji-picker-btn text-2xl hover:scale-110 transition-transform focus:outline-none bg-transparent"
        style={{ outline: 'none', boxShadow: 'none' }}
      >
        {currentEmoji || "📝"}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 w-64 z-50">
          <div className="max-h-64 overflow-y-auto p-2 emoji-picker-scrollbar">
            {Object.entries(EMOJIS).map(([category, emojis]) => (
              <div key={category} className="mb-2">
                <h3 className="text-xs text-gray-500 font-medium mb-1 px-2">{category}</h3>
                <div className="grid grid-cols-8 gap-1">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        onEmojiSelect(emoji);
                        setIsOpen(false);
                      }}
                      className="p-1 text-xl transition-colors bg-transparent focus:outline-none"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiPicker; 