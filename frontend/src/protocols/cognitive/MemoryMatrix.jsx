import React, { useState, useEffect, useCallback } from 'react';

const MemoryMatrix = ({ isPlaying, onScore, onMiss, config }) => {
  // --- CONFIG ---
  const gridSize = config?.gridSize || 4;
  const tileCount = config?.numberOfTiles || 5;
  const displayTime = (config?.displayTime || 2) * 1000;

  // --- STATE ---
  const [pattern, setPattern] = useState([]);
  const [userPattern, setUserPattern] = useState([]);
  // Using 'phase' instead of 'gameState' for a clearer state machine
  const [phase, setPhase] = useState('idle'); // idle -> showing -> recall -> success -> fail

  // --- LOGIC ---
  const generateLevel = useCallback(() => {
    const newSet = new Set();
    // Generate unique random tiles
    while (newSet.size < tileCount) {
        newSet.add(Math.floor(Math.random() * (gridSize * gridSize)));
    }
    setPattern(Array.from(newSet));
    setUserPattern([]);
    setPhase('showing');
  }, [gridSize, tileCount]);

  // Start Trigger
  useEffect(() => {
    if (isPlaying && phase === 'idle') {
        generateLevel();
    }
  }, [isPlaying, phase, generateLevel]);

  // Show Timer
  useEffect(() => {
    if (phase === 'showing') {
        const timer = setTimeout(() => {
            setPhase('recall');
        }, displayTime);
        return () => clearTimeout(timer);
    }
  }, [phase, displayTime]);

  // Click Handler
  const handleTileClick = (index) => {
    // 1. STRICT LOCK: Ignore clicks unless we are in the recall phase
    if (phase !== 'recall') return; 

    if (pattern.includes(index)) {
        // Correct Click
        if (!userPattern.includes(index)) {
            const newHistory = [...userPattern, index];
            setUserPattern(newHistory);
            
            // Win Condition
            if (newHistory.length === pattern.length) {
                setPhase('success');
                onScore(100 + (tileCount * 10)); // Dynamic Score
                setTimeout(() => setPhase('idle'), 1000); // Next Level
            }
        }
    } else {
        // Wrong Click
        setPhase('fail');
        onMiss();
        // Retry logic: Show pattern again after 1s
        setTimeout(() => { 
            setUserPattern([]); 
            setPhase('showing'); 
        }, 1000);
    }
  };

  if (!isPlaying) return (
    <div className="w-full h-full flex items-center justify-center text-cyan-500 font-mono animate-pulse">
        PRESS START
    </div>
  );

  return (
    <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center select-none">
        {/* HUD Text */}
        <h2 className={`font-mono mb-6 text-xl tracking-widest font-bold ${
            phase === 'showing' ? 'text-cyan-400 animate-pulse' :
            phase === 'success' ? 'text-green-400' :
            phase === 'fail' ? 'text-red-500' : 'text-white'
        }`}>
            {phase === 'showing' && 'MEMORIZE'}
            {phase === 'recall' && 'RECALL PATTERN'}
            {phase === 'success' && 'COMPLETE'}
            {phase === 'fail' && 'WRONG TILE'}
        </h2>
        
        {/* Grid Container */}
        <div 
            className="grid gap-2 bg-slate-800 p-4 rounded-xl shadow-2xl border border-slate-700"
            style={{ 
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                width: 'min(80vw, 500px)',
                height: 'min(80vw, 500px)'
            }}
        >
            {Array.from({ length: gridSize * gridSize }).map((_, i) => {
                const isCorrect = pattern.includes(i);
                const isSelected = userPattern.includes(i);
                
                // Advanced Visual Logic
                let bgClass = 'bg-slate-700 hover:bg-slate-600 border-slate-700'; // Default
                
                // 1. Showing: Glow cyan
                if (phase === 'showing' && isCorrect) {
                    bgClass = 'bg-cyan-500 shadow-[0_0_20px_#22d3ee] border-cyan-400 scale-105 z-10';
                }
                
                // 2. Recall: User selected correct
                if (isSelected && isCorrect) {
                    bgClass = 'bg-cyan-600 border-cyan-500 shadow-inner';
                }

                // 3. Success: All turn green
                if (phase === 'success' && isCorrect) {
                    bgClass = 'bg-green-500 shadow-[0_0_20px_#22c55e] border-green-400 scale-105 z-10';
                }

                // 4. Fail: The specific wrong tile shakes and turns red
                if (phase === 'fail' && !isCorrect && isSelected) {
                    bgClass = 'bg-red-500 shadow-[0_0_20px_#ef4444] border-red-400 shake';
                }

                return (
                    <div 
                        key={i} 
                        onClick={() => handleTileClick(i)}
                        className={`rounded-lg border-2 transition-all duration-300 cursor-pointer relative ${bgClass}`}
                    >
                         {/* Optional: Add a subtle inner dot for style */}
                         <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none rounded-lg" />
                    </div>
                );
            })}
        </div>
    </div>
  );
};

export default MemoryMatrix;