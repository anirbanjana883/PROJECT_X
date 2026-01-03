import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Trail, Text } from '@react-three/drei';
import * as THREE from 'three';
import { AnaglyphEffect } from 'three/examples/jsm/effects/AnaglyphEffect';

// --- HELPER: Get Color Config based on Settings ---
const getColorConfig = (combo) => {
  switch (combo) {
    case 'red-blue': return { left: '#ff0000', right: '#0000ff' }; // Red / Blue
    case 'red-green': return { left: '#ff0000', right: '#00ff00' }; // Red / Green
    default: return { left: '#ff0000', right: '#00ffff' }; // Standard Red / Cyan (best for Anaglyph)
  }
};

// --- 1. ANAGLYPH RENDERER ---
const Anaglyph = () => {
  const { gl, scene, camera, size } = useThree();
  const effect = useMemo(() => new AnaglyphEffect(gl), [gl]);

  useEffect(() => {
    effect.setSize(size.width, size.height);
    return () => effect.dispose();
  }, [effect, size]);

  useFrame(() => {
    effect.render(scene, camera);
  }, 1);
  return null;
};

// --- 2. PLAYER SHIP (Right Eye / Dominant Eye) ---
const PlayerShip = ({ position, color }) => {
  const mesh = useRef();
  
  useFrame(({ mouse, viewport }, delta) => {
    if (!mesh.current) return;
    const targetX = (mouse.x * viewport.width) / 2;
    const targetY = (mouse.y * viewport.height) / 2;
    const smoothing = 15 * delta;
    
    mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, targetX, smoothing);
    mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, targetY, smoothing);
    
    // Dynamic Tilt
    mesh.current.rotation.z = (targetX - mesh.current.position.x) * -2.0;
    mesh.current.rotation.x = (targetY - mesh.current.position.y) * 2.0;
  });

  return (
    <group ref={mesh} position={position}>
      <Trail width={2} length={5} color={color} attenuation={(t) => t * t}>
         <mesh rotation={[0, Math.PI / 2, 0]}>
            <coneGeometry args={[0.6, 1.8, 8]} />
            <meshBasicMaterial color={color} toneMapped={false} />
         </mesh>
      </Trail>
    </group>
  );
};

// --- 3. TARGET FIELD (The Enemies/Targets) ---
const TargetField = ({ count = 40, config, onHit, onScore, colors }) => {
  const mesh = useRef();
  const { viewport, mouse } = useThree();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // -- CONFIG MAPPING --
  const speedVal = config?.speed || 5;
  const sizeVal = config?.size || 5;       // 1-10 Scale
  const contrastVal = config?.contrast || 100; // 10-100%
  const targetType = config?.targetType || 'dot'; 

  // Calculate Base Scale (normalizing 1-10 to a usable 3D scale)
  const baseScale = 0.5 + (sizeVal * 0.15); 
  
  // Calculate Opacity based on Contrast
  const opacity = contrastVal / 100;

  const targets = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        t: Math.random() * 100,
        speedFactor: 0.5 + Math.random(),
        x: (Math.random() - 0.5) * 35,
        y: (Math.random() - 0.5) * 20,
        z: -50 - Math.random() * 100,
        hit: false
      });
    }
    return temp;
  }, [count]);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    const playerX = (mouse.x * viewport.width) / 2;
    const playerY = (mouse.y * viewport.height) / 2;
    const hitRadiusSq = (baseScale * 1.2) ** 2; // Hitbox scales with size

    targets.forEach((data, i) => {
      // Move Forward
      data.z += (speedVal * 0.5) * data.speedFactor * 25 * delta; 
      
      // Collision
      if (data.z > -2 && data.z < 2) {
          const dx = data.x - playerX;
          const dy = data.y - playerY;
          if ((dx*dx + dy*dy) < hitRadiusSq && !data.hit) {
              data.hit = true;
              if(onHit) onHit(); 
          }
      }

      // Respawn
      if (data.z > 10) {
         if (!data.hit && onScore) onScore(10);
         data.z = -100 - Math.random() * 50; 
         data.x = (Math.random() - 0.5) * 35;
         data.y = (Math.random() - 0.5) * 20;
         data.hit = false;
      }

      // Render
      dummy.position.set(data.x, data.y, data.z);
      
      // Animation (Spin if it's not a dot)
      if (targetType !== 'dot') {
          dummy.rotation.set(data.t, data.t, data.t);
      }
      
      // Apply Scale from Settings
      dummy.scale.setScalar(baseScale); 
      
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  // Select Geometry based on 'targetType'
  let geometry;
  switch (targetType) {
      case 'dot': geometry = <sphereGeometry args={[1, 16, 16]} />; break;
      case 'letter': geometry = <boxGeometry args={[1.5, 1.5, 1.5]} />; break; // Placeholder for letters
      default: geometry = <dodecahedronGeometry args={[1, 0]} />; break;
  }

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      {geometry}
      <meshBasicMaterial 
        color={colors.left} 
        transparent={true} 
        opacity={opacity} // Controlled by Contrast Slider
        toneMapped={false} 
      />
    </instancedMesh>
  );
};

// --- 4. MAIN GAME COMPONENT ---
const SpacePursuits = ({ isPlaying, onScore, onMiss, config }) => {
  // Extract Settings with Defaults
  const settings = config || {};
  const isDichoptic = settings.dichopticEnabled || false;
  const bgColor = settings.backgroundColor || 'black';
  const colorConfig = getColorConfig(settings.colorCombination);

  // Map Background string to Hex
  const bgHex = {
      'black': '#050505',
      'white': '#f0f0f0',
      'green': '#001100' // Dark green to allow contrast
  }[bgColor] || '#050505';

  return (
    <div className="w-full h-full relative" style={{ cursor: 'none' }}>
      <Canvas 
         camera={{ position: [0, 0, 8], fov: 60 }}
         gl={{ antialias: true, preserveDrawingBuffer: true }}
         dpr={[1, 2]} 
      >
        {/* Enable Anaglyph only if doctor selected it */}
        {isDichoptic && <Anaglyph />}
        
        {/* Dynamic Background Color */}
        <color attach="background" args={[bgHex]} />
        
        {/* Only show stars if background is black (medical clean mode otherwise) */}
        {bgColor === 'black' && (
             <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />
        )}

        <ambientLight intensity={1.5} />
        
        {isPlaying && (
           <>
               <PlayerShip color={colorConfig.right} />
               <TargetField 
                   count={40} 
                   config={settings} 
                   onHit={onMiss} 
                   onScore={onScore} 
                   colors={colorConfig}
               />
           </>
        )}
        
        {/* Grid is helpful for depth perception training */}
        <gridHelper 
            args={[60, 60, 0x333333, bgColor === 'white' ? 0xdddddd : 0x111111]} 
            rotation={[Math.PI/2, 0, 0]} 
            position={[0,0,-20]} 
        />
      </Canvas>
    </div>
  );
};

export default SpacePursuits;