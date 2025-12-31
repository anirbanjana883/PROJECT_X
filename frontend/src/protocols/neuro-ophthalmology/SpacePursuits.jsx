import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, Line, Plane } from '@react-three/drei';
import * as THREE from 'three';

// --- 1. Clinical Grid Tunnel (The "Measurement Chamber") ---
const ClinicalTunnel = () => {
  // Creates a sterile, infinite grid tunnel effect
  const count = 20;
  const spacing = 4;
  
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <group key={i} position={[0, 0, -i * spacing]}>
           {/* The Ring */}
           <mesh rotation={[0, 0, 0]}>
             <ringGeometry args={[4, 4.05, 64]} />
             <meshBasicMaterial color="#334155" transparent opacity={0.3} />
           </mesh>
           {/* Tick Marks (North/South/East/West) */}
           <mesh position={[0, 4, 0]}>
             <planeGeometry args={[0.1, 0.5]} />
             <meshBasicMaterial color="#06b6d4" opacity={0.5} transparent />
           </mesh>
           <mesh position={[0, -4, 0]}>
             <planeGeometry args={[0.1, 0.5]} />
             <meshBasicMaterial color="#06b6d4" opacity={0.5} transparent />
           </mesh>
           <mesh position={[4, 0, 0]}>
             <planeGeometry args={[0.5, 0.1]} />
             <meshBasicMaterial color="#06b6d4" opacity={0.5} transparent />
           </mesh>
           <mesh position={[-4, 0, 0]}>
             <planeGeometry args={[0.5, 0.1]} />
             <meshBasicMaterial color="#06b6d4" opacity={0.5} transparent />
           </mesh>
        </group>
      ))}
      {/* Connecting Longitudinal Lines for speed reference */}
      {[0, 90, 180, 270].map((rot, i) => (
        <mesh key={`line-${i}`} rotation={[0, 0, (rot * Math.PI) / 180]}>
             <planeGeometry args={[0.02, 100]} />
             <meshBasicMaterial color="#1e293b" />
        </mesh>
      ))}
    </>
  );
};

// --- 2. The Focal Stimulus (Not an Orb, a "Node") ---
const FocalPoint = ({ positionRef, isLocked }) => {
  const group = useRef();
  
  // Real-time data display Refs
  const textRef = useRef();

  useFrame(() => {
    if (group.current && positionRef.current) {
        // Force Position Update
        group.current.position.copy(positionRef.current);
        
        // Medical Scaling: Maintain specific visual angle size regardless of depth? 
        // No, for depth training we WANT size change.
        const depthScale = 1 + (positionRef.current.z + 10) * 0.05; 
        const finalScale = Math.max(0.4, Math.min(1.5, depthScale)); 
        group.current.scale.setScalar(finalScale);

        // Update Coordinate Text
        if (textRef.current) {
            textRef.current.text = `X:${positionRef.current.x.toFixed(1)}\nY:${positionRef.current.y.toFixed(1)}\nZ:${positionRef.current.z.toFixed(1)}`;
        }
    }
  });

  return (
    <group ref={group}>
      {/* The Stimulus Core - High Contrast */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color={isLocked ? "#00ffcc" : "#ff3333"} />
      </mesh>
      
      {/* Outer Data Ring */}
      <mesh>
        <ringGeometry args={[0.6, 0.65, 32]} />
        <meshBasicMaterial color={isLocked ? "#00ffcc" : "#444"} side={THREE.DoubleSide} />
      </mesh>

      {/* Floating Metrics (Crucial for "Medical" feel) */}
      <Text 
        ref={textRef}
        position={[1.2, 0.5, 0]} 
        fontSize={0.3} 
        color={isLocked ? "#00ffcc" : "#555"}
        font="https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxM.woff" // Standard clean font
        anchorX="left"
      >
        INIT...
      </Text>
    </group>
  );
};

// --- 3. The Scope (Reticle) ---
const ClinicalScope = ({ mousePos, isLocked }) => {
  const group = useRef();
  
  useFrame(() => {
    if (group.current) {
        // Instant response (Medical instruments don't lag unless simulated)
        // We add slight damping for smoothness, but keep it tight.
        group.current.position.x += (mousePos.current.x - group.current.position.x) * 0.3;
        group.current.position.y += (mousePos.current.y - group.current.position.y) * 0.3;
        
        if (isLocked) {
           group.current.rotation.z -= 0.05;
           group.current.children[0].material.color.set("#00ffcc");
        } else {
           group.current.rotation.z = 0;
           group.current.children[0].material.color.set("#ffffff");
        }
    }
  });

  return (
    <group ref={group}>
      {/* The Bracket (Not a ring, looks more like a camera focus) */}
      <Line 
        points={[[-0.5, 0.5, 0], [-0.2, 0.5, 0]]} // Top Left
        color="white" lineWidth={2}
      />
      <Line 
        points={[[0.5, 0.5, 0], [0.2, 0.5, 0]]} // Top Right
        color="white" lineWidth={2}
      />
      <Line 
        points={[[-0.5, -0.5, 0], [-0.2, -0.5, 0]]} // Bottom Left
        color="white" lineWidth={2}
      />
      <Line 
        points={[[0.5, -0.5, 0], [0.2, -0.5, 0]]} // Bottom Right
        color="white" lineWidth={2}
      />
      
      {/* Corners vertical */}
      <Line points={[[-0.5, 0.5, 0], [-0.5, 0.2, 0]]} color="white" lineWidth={2} />
      <Line points={[[0.5, 0.5, 0], [0.5, 0.2, 0]]} color="white" lineWidth={2} />
      <Line points={[[-0.5, -0.5, 0], [-0.5, -0.2, 0]]} color="white" lineWidth={2} />
      <Line points={[[0.5, -0.5, 0], [0.5, -0.2, 0]]} color="white" lineWidth={2} />
    </group>
  );
};

// --- 4. Logic Core ---
const SimulationCore = ({ onScore, onMiss, difficulty }) => {
  const { camera, mouse, viewport } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, -5));
  const reticlePos = useRef(new THREE.Vector3(0, 0, 0)); 
  const time = useRef(0);
  const [isLocked, setIsLocked] = useState(false);

  useFrame((state, delta) => {
    time.current += delta;

    // A. RETICLE
    reticlePos.current.x = (mouse.x * viewport.width) / 2;
    reticlePos.current.y = (mouse.y * viewport.height) / 2;

    // B. TARGET PATH (Clinical Sine Wave)
    const speed = 0.4 + (difficulty * 0.1);
    targetPos.current.z = Math.sin(time.current * 0.2) * 10 - 12; // Z: -2 to -22
    const depthScale = Math.abs(targetPos.current.z) * 0.5; 
    
    // Precise, predictable medical path (Figure 8)
    targetPos.current.x = Math.sin(time.current * speed) * (2.5 + depthScale * 0.4);
    targetPos.current.y = Math.cos(time.current * speed * 0.8) * (1.5 + depthScale * 0.3);

    // C. METRICS (Hit Detection)
    const projected = targetPos.current.clone().project(camera);
    const dx = mouse.x - projected.x;
    const dy = mouse.y - projected.y;
    const distance = Math.sqrt(dx*dx + dy*dy);
    
    // Deviation Threshold (0.1 = 10% deviation allowed)
    const tolerance = 0.12; 

    if (distance < tolerance) {
        if (!isLocked) setIsLocked(true);
        onScore(1); 
    } else {
        if (isLocked) setIsLocked(false);
        onMiss();
    }
    
    // Move Camera slightly to simulate "Head Stabilization" (Subtle effect)
    camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 0.5 - camera.position.y) * 0.05;
  });

  return (
    <>
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 5, 30]} /> {/* Hides the grid end */}

      <ClinicalTunnel />
      
      <FocalPoint positionRef={targetPos} isLocked={isLocked} />
      <ClinicalScope mousePos={reticlePos} isLocked={isLocked} />
    </>
  );
};

const SpacePursuits = ({ onScore, onMiss, difficulty }) => {
  return (
    <div className="w-full h-full relative cursor-none bg-black font-mono">
        <Canvas 
            camera={{ position: [0, 0, 5], fov: 50 }} // Narrower FOV for medical focus
            dpr={[1, 2]} 
            gl={{ antialias: true }}
        >
            <SimulationCore onScore={onScore} onMiss={onMiss} difficulty={difficulty} />
        </Canvas>
        
        {/* CLINICAL OVERLAYS (Static HUD) */}
        <div className="absolute top-4 left-4 pointer-events-none opacity-60">
            <h3 className="text-cyan-500 text-xs font-bold uppercase tracking-widest border-b border-cyan-900 pb-1 mb-1">
                Oculomotor Calibration
            </h3>
            <div className="text-[10px] text-gray-400 space-y-1">
                <p>PROTOCOL: SACCADE_V3</p>
                <p>LATENCY: 12ms</p>
                <p>STABILIZER: ACTIVE</p>
            </div>
        </div>
        
        {/* Crosshair Grid Overlay (The "Camera Lens" feel) */}
        <div className="absolute inset-0 pointer-events-none opacity-20" 
             style={{
                 backgroundImage: `
                    linear-gradient(to right, #06b6d4 1px, transparent 1px),
                    linear-gradient(to bottom, #06b6d4 1px, transparent 1px)
                 `,
                 backgroundSize: '100px 100px'
             }}>
        </div>
    </div>
  );
};

export default SpacePursuits;