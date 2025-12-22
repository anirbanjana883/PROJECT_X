import React, { useState, useEffect } from 'react';

const JungleJump = ({ isPlaying, onScore }) => {
  const [target, setTarget] = useState(null);

  useEffect(() => {
    if (!isPlaying) {
        setTarget(null);
        return;
    }

    // Targets appear and disappear faster (Jumps)
    const interval = setInterval(() => {
      const x = Math.random() * 90;
      const y = Math.random() * 90;
      setTarget({ top: `${y}%`, left: `${x}%`, id: Date.now() });
    }, 800); // New target every 0.8s

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleClick = () => {
    onScore();
    setTarget(null); // Disappear immediately on click
  };

  return (
    <div className="relative w-full h-full bg-green-900/20 rounded-3xl overflow-hidden border border-green-800/50">
      {target && (
        <div
          key={target.id}
          onClick={handleClick}
          style={{ top: target.top, left: target.left }}
          className="absolute w-14 h-14 bg-green-500 rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.8)] cursor-pointer animate-bounce"
        >
             <div className="w-full h-full flex items-center justify-center text-2xl">🐸</div>
        </div>
      )}
    </div>
  );
};

export default JungleJump;