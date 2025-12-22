import React, { useState, useEffect, useCallback } from 'react';

const EagleEye = ({ isPlaying, onScore }) => {
  const [items, setItems] = useState([]);
  const [targetIndex, setTargetIndex] = useState(null);
  const [targetChar, setTargetChar] = useState('');
  const [distractorChar, setDistractorChar] = useState('');
  const [wrongIndex, setWrongIndex] = useState(null); // For shake effect

  // --- Configuration: Confusing Pairs ---
  const pairs = [
    { target: 'Q', distractor: 'O' },
    { target: '6', distractor: '9' },
    { target: 'E', distractor: 'F' },
    { target: 'B', distractor: '8' },
    { target: 'X', distractor: 'K' },
    { target: '5', distractor: 'S' },
    { target: '1', distractor: 'I' },
  ];

  const gridSize = 36; // 6x6 grid

  // --- Generator Logic ---
  const generateGrid = useCallback(() => {
    // 1. Pick a random pair
    const pair = pairs[Math.floor(Math.random() * pairs.length)];
    setTargetChar(pair.target);
    setDistractorChar(pair.distractor);

    // 2. Create Grid
    const newItems = Array(gridSize).fill(pair.distractor);
    const winner = Math.floor(Math.random() * gridSize);
    newItems[winner] = pair.target;
    
    setItems(newItems);
    setTargetIndex(winner);
    setWrongIndex(null); // Reset errors
  }, []);

  // --- Initialization ---
  useEffect(() => {
    if (isPlaying) {
        generateGrid();
    } else {
        setItems([]); // Clear grid when not playing
    }
  }, [isPlaying, generateGrid]);

  // --- Click Handler ---
  const handleItemClick = (index) => {
    if (!isPlaying) return;

    if (index === targetIndex) {
      // Correct!
      onScore();
      generateGrid(); // Immediate Next Level
    } else {
      // Wrong! Trigger Shake Effect
      setWrongIndex(index);
      setTimeout(() => setWrongIndex(null), 500); // Reset shake after 500ms
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900/50 rounded-3xl border border-gray-700 p-4 relative overflow-hidden">
      
      {/* Hint Text */}
      {isPlaying && (
        <div className="absolute top-4 text-gray-400 text-sm font-mono tracking-widest uppercase">
          Find the <span className="text-white font-bold text-xl mx-1 text-orange-500">{targetChar}</span>
        </div>
      )}

      {/* The Grid */}
      <div className="grid grid-cols-6 gap-3 mt-8">
        {items.map((char, idx) => (
          <button
            key={idx}
            onClick={() => handleItemClick(idx)}
            className={`
              w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center text-2xl sm:text-3xl font-bold rounded-xl transition-all duration-200
              ${
                idx === wrongIndex
                  ? 'bg-red-500/20 text-red-500 border-red-500 animate-shake' // Wrong State
                  : 'bg-gray-800 text-gray-500 hover:bg-gray-700 hover:text-gray-300 border border-transparent' // Default State
              }
            `}
          >
            {char}
          </button>
        ))}
      </div>

      {/* Shake Animation Style (Inline for simplicity) */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
          border: 1px solid;
        }
      `}</style>
    </div>
  );
};

export default EagleEye;