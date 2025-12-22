import React, { useState, useEffect, useRef } from 'react';

const SpacePursuits = ({ isPlaying, onScore }) => {
  // Position is stored as percentages (0-100)
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [targetSpeed, setTargetSpeed] = useState(0.5); // Speed multiplier
  const [clickEffect, setClickEffect] = useState(null); // { x, y, id }

  // Refs for animation loop
  const requestRef = useRef();
  const directionRef = useRef({ dx: 1, dy: 1 }); // Direction vector
  const positionRef = useRef({ x: 50, y: 50 }); // Mutable ref for smooth updates without re-renders

  // --- 1. The Physics Loop ---
  const animate = () => {
    if (!isPlaying) return;

    // Update position based on direction and speed
    let { x, y } = positionRef.current;
    let { dx, dy } = directionRef.current;

    // Move
    x += dx * targetSpeed;
    y += dy * targetSpeed;

    // Bounce off walls (0-95% to keep inside box)
    if (x <= 0 || x >= 92) {
        directionRef.current.dx *= -1; // Reverse X direction
        // Add slight randomness to bounce angle
        directionRef.current.dy += (Math.random() - 0.5) * 0.2;
    }
    if (y <= 0 || y >= 90) {
        directionRef.current.dy *= -1; // Reverse Y direction
        directionRef.current.dx += (Math.random() - 0.5) * 0.2;
    }

    // Clamp values to keep safe
    x = Math.max(0, Math.min(92, x));
    y = Math.max(0, Math.min(90, y));

    // Normalize vector speed (prevent it from getting too fast/slow randomly)
    const magnitude = Math.sqrt(directionRef.current.dx**2 + directionRef.current.dy**2);
    if (magnitude > 0) {
        directionRef.current.dx /= magnitude;
        directionRef.current.dy /= magnitude;
    }

    // Save and Render
    positionRef.current = { x, y };
    setPosition({ x, y });

    requestRef.current = requestAnimationFrame(animate);
  };

  // --- 2. Start/Stop Loop ---
  useEffect(() => {
    if (isPlaying) {
        requestRef.current = requestAnimationFrame(animate);
    } else {
        cancelAnimationFrame(requestRef.current);
        // Reset to center
        positionRef.current = { x: 50, y: 50 };
        setPosition({ x: 50, y: 50 });
        setTargetSpeed(0.5);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying, targetSpeed]); // Re-run if speed changes

  // --- 3. Interaction ---
  const handleClick = (e) => {
    e.stopPropagation(); // Prevent parent clicks
    onScore();
    
    // Increase difficulty slightly
    setTargetSpeed(prev => Math.min(prev + 0.1, 2.5)); // Cap speed at 2.5x

    // Show explosion effect at click coordinates (relative to container)
    // We use the current target position for the effect origin
    setClickEffect({ x: position.x, y: position.y, id: Date.now() });
    
    // Remove effect after animation
    setTimeout(() => setClickEffect(null), 500);
  };

  return (
    <div className="relative w-full h-full bg-gray-900/80 rounded-3xl overflow-hidden border border-gray-700 shadow-inner cursor-crosshair">
      
      {/* --- Background Grid (Starfield hint) --- */}
      <div className="absolute inset-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      {/* --- The Moving Target --- */}
      {isPlaying && (
        <div
          onClick={handleClick}
          style={{ 
            left: `${position.x}%`, 
            top: `${position.y}%`,
            // Use 'transform' for smoother GPU animation than top/left
            transform: 'translate3d(0,0,0)' 
          }}
          className="absolute w-16 h-16 flex items-center justify-center cursor-pointer group"
        >
          {/* Outer Glow Ring */}
          <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-md group-hover:bg-cyan-400/50 transition-colors"></div>
          
          {/* Core Planet */}
          <div className="relative w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full shadow-lg border-2 border-white/20 z-10 group-active:scale-90 transition-transform">
            {/* Crater Detail */}
            <div className="absolute top-2 right-3 w-3 h-3 bg-blue-700/30 rounded-full"></div>
          </div>

          {/* Trail Effect (Simple) */}
          <div className="absolute top-1/2 left-1/2 w-24 h-1 bg-gradient-to-l from-transparent to-blue-500/50 blur-sm -z-10 origin-left"
               style={{ transform: `rotate(${Math.atan2(directionRef.current.dy, directionRef.current.dx) * 180 / Math.PI + 180}deg)` }}>
          </div>
        </div>
      )}

      {/* --- Click Explosion Effect --- */}
      {clickEffect && (
        <div 
            className="absolute w-20 h-20 pointer-events-none"
            style={{ left: `${clickEffect.x}%`, top: `${clickEffect.y}%` }}
        >
            <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-50"></div>
            <div className="absolute inset-0 border-2 border-cyan-400 rounded-full animate-ping animation-delay-100"></div>
        </div>
      )}

    </div>
  );
};

export default SpacePursuits;