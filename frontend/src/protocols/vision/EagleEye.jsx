import React, { useState, useEffect, useCallback } from 'react';
import { FaEye } from 'react-icons/fa';

const EagleEye = ({ isPlaying, onScore, onMiss, config }) => {
  // Config Defaults
  const targetSize = config?.targetSize || 40; // px
  const density = config?.fieldDensity === 'high' ? 60 : config?.fieldDensity === 'low' ? 15 : 30;
  const timeLimit = config?.timeLimit || 60;
  const contrast = (config?.contrast || 100) / 100;

  const [items, setItems] = useState([]);
  const [level, setLevel] = useState(1);
  const [targetId, setTargetId] = useState(null);

  // Generate Items
  const spawnLevel = useCallback(() => {
    const newItems = [];
    const count = density + (level * 2); // Increase difficulty
    
    // Generate Target
    const tId = Math.random().toString(36).substr(2, 9);
    setTargetId(tId);

    newItems.push({
      id: tId,
      x: Math.random() * 90 + 5, // 5-95%
      y: Math.random() * 90 + 5,
      isTarget: true,
      rotation: 0
    });

    // Generate Distractors
    for (let i = 0; i < count; i++) {
      newItems.push({
        id: `d-${i}`,
        x: Math.random() * 90 + 5,
        y: Math.random() * 90 + 5,
        isTarget: false,
        rotation: Math.random() * 360
      });
    }
    setItems(newItems);
  }, [density, level]);

  useEffect(() => {
    if (isPlaying) spawnLevel();
  }, [isPlaying, spawnLevel]);

  const handleClick = (item) => {
    if (item.isTarget) {
      onScore(100 + (level * 10));
      setLevel(l => l + 1);
      spawnLevel(); // Next level
    } else {
      onMiss();
    }
  };

  if (!isPlaying) return <div className="text-white text-center mt-20 font-mono">WAITING TO START...</div>;

  return (
    <div className="w-full h-full relative bg-gray-900 overflow-hidden cursor-crosshair">
      {/* HUD */}
      <div className="absolute top-4 left-4 text-cyan-500 font-mono text-xs">
        LEVEL: {level} | TARGET: <span className="text-white font-bold">CIRCLE</span>
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          onClick={(e) => { e.stopPropagation(); handleClick(item); }}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-110 active:scale-95 flex items-center justify-center"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            width: `${targetSize}px`,
            height: `${targetSize}px`,
            opacity: contrast
          }}
        >
          {item.isTarget ? (
             // Target: Circle
             <div className="w-full h-full rounded-full border-4 border-cyan-400 bg-cyan-900/50 shadow-[0_0_10px_#22d3ee]" />
          ) : (
             // Distractor: Square/Rotated
             <div 
                className="w-full h-full border-4 border-slate-600 bg-slate-800/50" 
                style={{ transform: `rotate(${item.rotation}deg)` }} 
             />
          )}
        </div>
      ))}
    </div>
  );
};

export default EagleEye;