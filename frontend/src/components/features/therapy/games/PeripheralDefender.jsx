import React, { useState, useEffect, useRef } from 'react';

const PeripheralDefender = ({ isPlaying, onScore }) => {
  const [threats, setThreats] = useState([]);
  // UI State for visual feedback
  const [isFocusedUI, setIsFocusedUI] = useState(false); 
  
  // Logic Refs (To avoid re-rendering loops)
  const isFocusedRef = useRef(false);
  const gameLoopRef = useRef(null);

  // --- 1. Handle Mouse Events ---
  const handleMouseEnter = () => {
    isFocusedRef.current = true;
    setIsFocusedUI(true);
  };

  const handleMouseLeave = () => {
    isFocusedRef.current = false;
    setIsFocusedUI(false);
  };

  // --- 2. The Game Loop ---
  useEffect(() => {
    if (!isPlaying) {
        setThreats([]);
        return;
    }

    const spawnThreat = () => {
      // Only spawn if user is focused
      if (!isFocusedRef.current) return;

      const side = Math.floor(Math.random() * 4); // 0:top, 1:right, 2:bottom, 3:left
      let style = {};
      
      // Random position on the edges (5% padding)
      const randomPos = 10 + Math.random() * 80; 

      switch(side) {
        case 0: style = { top: '5%', left: `${randomPos}%` }; break;
        case 1: style = { top: `${randomPos}%`, right: '5%' }; break;
        case 2: style = { bottom: '5%', left: `${randomPos}%` }; break;
        case 3: style = { top: `${randomPos}%`, left: '5%' }; break;
        default: break;
      }

      const newThreat = { id: Date.now(), style };
      
      setThreats(prev => [...prev, newThreat]);

      // Auto-remove threat after 2 seconds (missed it)
      setTimeout(() => {
        setThreats(prev => prev.filter(t => t.id !== newThreat.id));
      }, 2000);
    };

    // Spawn logic loop (every 1.2s)
    // We use setInterval here, but because isFocused is a Ref, 
    // this interval DOES NOT reset when mouse moves.
    gameLoopRef.current = setInterval(spawnThreat, 1200);

    return () => clearInterval(gameLoopRef.current);
  }, [isPlaying]);

  return (
    <div className="relative w-full h-full bg-purple-900/20 rounded-3xl overflow-hidden border border-purple-500/30 shadow-inner">
      
      {/* --- Background Radar Effect --- */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
         <div className="w-[80%] h-[80%] border border-purple-500/30 rounded-full"></div>
         <div className="w-[60%] h-[60%] border border-purple-500/30 rounded-full absolute"></div>
         <div className="w-[40%] h-[40%] border border-purple-500/30 rounded-full absolute"></div>
      </div>

      {/* --- Center Fixation Point --- */}
      <div 
        className={`
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            w-32 h-32 rounded-full border-4 flex items-center justify-center cursor-crosshair transition-all duration-300
            ${isFocusedUI 
                ? 'bg-purple-600/20 border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.4)]' 
                : 'bg-gray-800/50 border-gray-600'
            }
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Core Dot */}
        <div className={`w-4 h-4 bg-white rounded-full transition-all duration-500 ${isFocusedUI ? 'animate-pulse scale-110' : 'opacity-50'}`} />
        
        {/* Scanning Ring */}
        {isFocusedUI && (
            <div className="absolute w-full h-full rounded-full border-t-2 border-purple-300 animate-spin"></div>
        )}

        {/* Instruction Tooltip */}
        {!isFocusedUI && isPlaying && (
            <span className="absolute -bottom-10 text-xs font-bold text-purple-300 bg-black/50 px-3 py-1 rounded-full whitespace-nowrap">
                Keep Mouse Here
            </span>
        )}
      </div>

      {/* --- Threats --- */}
      {threats.map(threat => (
        <div
          key={threat.id}
          style={threat.style}
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering other clicks
            onScore();
            setThreats(prev => prev.filter(t => t.id !== threat.id));
          }}
          className="absolute w-12 h-12 bg-red-500 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.8)] cursor-pointer animate-ping-slow hover:scale-110 hover:bg-red-400 transition-transform border-2 border-white/50"
        >
            {/* Inner dot to make it look like a target */}
            <div className="w-full h-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
        </div>
      ))}

      <style>{`
        @keyframes ping-slow {
            0% { transform: scale(0.8); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(0.8); opacity: 0.8; }
        }
        .animate-ping-slow {
            animation: ping-slow 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default PeripheralDefender;