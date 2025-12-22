import React, { useState, useEffect, useCallback, useRef } from 'react';

const MemoryMatrix = ({ isPlaying, onScore }) => {
  const [grid, setGrid] = useState(Array(9).fill(null)); // null, 'active', 'success', 'error'
  const [pattern, setPattern] = useState([]);
  const [userStep, setUserStep] = useState(0); // Track which step of the pattern user is on
  const [gameState, setGameState] = useState('idle'); // 'idle', 'showing', 'input', 'feedback'
  const [message, setMessage] = useState("Get Ready...");
  
  // Refs to handle clearing timeouts/intervals safely
  const timers = useRef([]);

  // --- Helper to clear all timers ---
  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  // --- 1. Start a New Round ---
  const startRound = useCallback(() => {
    clearTimers();
    setGrid(Array(9).fill(null));
    setUserStep(0);
    setMessage("Watch Pattern...");
    setGameState('showing');

    // Generate Pattern (3 unique tiles)
    const newPattern = [];
    while (newPattern.length < 3) {
      const r = Math.floor(Math.random() * 9);
      if (!newPattern.includes(r)) newPattern.push(r);
    }
    setPattern(newPattern);

    // Show Pattern Sequence
    let i = 0;
    const showNext = () => {
      if (i < newPattern.length) {
        // Turn ON
        setGrid(prev => {
          const next = Array(9).fill(null);
          next[newPattern[i]] = 'active'; // Blue
          return next;
        });

        // Turn OFF after 600ms
        const t1 = setTimeout(() => {
          setGrid(Array(9).fill(null));
          i++;
          // Slight pause before next one
          const t2 = setTimeout(showNext, 200);
          timers.current.push(t2);
        }, 600);
        timers.current.push(t1);
      } else {
        // Pattern Done
        setGameState('input');
        setMessage("Your Turn!");
      }
    };

    // Start the sequence after a brief delay
    const tStart = setTimeout(showNext, 1000);
    timers.current.push(tStart);

  }, []);

  // --- 2. Initialization ---
  useEffect(() => {
    if (isPlaying) {
      startRound();
    } else {
      clearTimers();
      setGrid(Array(9).fill(null));
      setMessage("Press Start");
    }
    return () => clearTimers(); // Cleanup on unmount
  }, [isPlaying, startRound]);

  // --- 3. Handle Click ---
  const handleTileClick = (index) => {
    if (gameState !== 'input') return;

    // --- Correct Click ---
    if (index === pattern[userStep]) {
      // Visual Feedback (Green Flash)
      const newGrid = [...grid];
      newGrid[index] = 'success'; 
      setGrid(newGrid);

      // Check if round complete
      if (userStep + 1 === pattern.length) {
        setGameState('feedback');
        setMessage("Perfect!");
        onScore(); // Score Up
        
        const t = setTimeout(() => {
            startRound(); // Next Level
        }, 1000);
        timers.current.push(t);
      } else {
        // Continue to next step
        setUserStep(prev => prev + 1);
        // Turn off green after 200ms to allow re-clicking same tile if pattern allows (future proofing)
        const t = setTimeout(() => {
            setGrid(g => {
                const reset = [...g];
                reset[index] = null;
                return reset;
            });
        }, 300);
        timers.current.push(t);
      }
    } 
    
    // --- Wrong Click ---
    else {
      setGameState('feedback');
      setMessage("Wrong! Try Again.");
      
      const newGrid = [...grid];
      newGrid[index] = 'error'; // Red
      setGrid(newGrid);

      const t = setTimeout(() => {
        startRound(); // Restart
      }, 1000);
      timers.current.push(t);
    }
  };

  // --- 4. Styles Helper ---
  const getTileClass = (status) => {
    const base = "w-24 h-24 rounded-xl transition-all duration-200 shadow-lg transform ";
    switch (status) {
      case 'active': return base + "bg-cyan-400 shadow-[0_0_20px_cyan] scale-105";
      case 'success': return base + "bg-green-500 shadow-[0_0_20px_#22c55e] scale-105"; // Green
      case 'error': return base + "bg-red-500 shadow-[0_0_20px_#ef4444] animate-shake"; // Red
      default: return base + "bg-gray-800 hover:bg-gray-700 border border-gray-700";
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-cyan-900/10 rounded-3xl border border-cyan-800/30">
      
      {/* Message HUD */}
      <h3 className={`text-2xl font-bold mb-8 transition-colors duration-300 ${
          gameState === 'input' ? 'text-white' : 'text-cyan-400 animate-pulse'
      }`}>
        {message}
      </h3>

      {/* The Grid */}
      <div className="grid grid-cols-3 gap-4">
        {grid.map((status, idx) => (
          <button
            key={idx}
            onClick={() => handleTileClick(idx)}
            className={getTileClass(status)}
            disabled={gameState !== 'input'} // Disable clicks when showing pattern
          />
        ))}
      </div>

      {/* Shake Animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default MemoryMatrix;