import React, { useRef, useEffect, useState } from 'react';

const PeripheralDefender = ({ isPlaying, onScore, onMiss, config }) => {
  const canvasRef = useRef(null);
  
  // Config
  const speed = config?.speed || 5;
  const stimulusSize = (config?.stimulusSize || 5) * 2;
  const fov = config?.fieldOfView || 40; // Simulated degrees
  
  const [stimulus, setStimulus] = useState(null); // {x, y, active}
  const requestRef = useRef();

  // Logic Loop
  const animate = (time) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Clear
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Central Fixation (The Anchor)
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444'; // Red dot to hold focus
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Stimulus
    if (stimulus && stimulus.active) {
       ctx.beginPath();
       ctx.arc(stimulus.x, stimulus.y, stimulusSize, 0, Math.PI * 2);
       ctx.fillStyle = '#22d3ee'; // Cyan target
       ctx.fill();
       ctx.shadowBlur = 15;
       ctx.shadowColor = '#22d3ee';
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  // Stimulus Spawner
  useEffect(() => {
    if (!isPlaying) return;
    
    const spawnTimer = setInterval(() => {
        if (Math.random() > 0.3) { // 70% chance to spawn
            const canvas = canvasRef.current;
            if(!canvas) return;
            
            const angle = Math.random() * Math.PI * 2;
            const radius = 100 + (Math.random() * (fov * 5)); // Map FOV to pixels loosely
            
            setStimulus({
                x: (canvas.width / 2) + Math.cos(angle) * radius,
                y: (canvas.height / 2) + Math.sin(angle) * radius,
                active: true,
                born: Date.now()
            });

            // Auto-hide after short duration (Reaction time check)
            setTimeout(() => setStimulus(null), 2000 / speed); 
        }
    }, 2000);

    requestRef.current = requestAnimationFrame(animate);
    return () => {
        clearInterval(spawnTimer);
        cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, speed, fov]);

  const handleClick = (e) => {
      if (!stimulus) { onMiss(); return; }

      const rect = canvasRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      // Distance check
      const dist = Math.sqrt(Math.pow(clickX - stimulus.x, 2) + Math.pow(clickY - stimulus.y, 2));
      
      if (dist < stimulusSize * 3) { // Generous hit box
          onScore(50);
          setStimulus(null); // Remove immediately
      } else {
          onMiss();
      }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
        <canvas 
            ref={canvasRef}
            width={window.innerWidth}
            height={window.innerHeight}
            onClick={handleClick}
            className="cursor-crosshair"
        />
        <div className="absolute top-10 text-slate-500 font-mono text-sm pointer-events-none">
            KEEP EYES ON RED DOT. CLICK BLUE DOTS.
        </div>
    </div>
  );
};

export default PeripheralDefender;