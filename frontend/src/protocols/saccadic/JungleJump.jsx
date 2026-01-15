import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Box, Cylinder, Stars } from '@react-three/drei';
import * as THREE from 'three';

// --- 1. Player Logic ---
const Player = ({ isJumping, onLand }) => {
    const mesh = useRef();
    const velocity = useRef(0);
    const y = useRef(0);
    const { camera } = useThree();

    useFrame((state, delta) => {
        if(!mesh.current) return;
        
        // Jump Physics
        if (isJumping && y.current === 0) {
            velocity.current = 8; 
            camera.position.y += 0.2; // Camera Shake
        }

        // Gravity
        velocity.current -= 20 * delta; 
        y.current += velocity.current * delta;

        // Ground Collision
        if (y.current < 0) {
            if (y.current < -0.1) camera.position.y -= 0.05; // Land Shake
            y.current = 0;
            velocity.current = 0;
            if (isJumping) onLand(); // Reset State
        }

        // Camera Follow Smoothing
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, 2, 0.1);

        // Apply
        mesh.current.position.y = y.current + 0.5;
        mesh.current.rotation.x = y.current > 0 ? mesh.current.rotation.x - 5 * delta : 0;
    });

    return (
        <Box ref={mesh} position={[-2, 0.5, 0]} args={[1, 1, 1]}>
            <meshStandardMaterial color="#22d3ee" emissive="#004444" roughness={0.2} metalness={0.8} />
        </Box>
    );
};

// --- 2. Obstacles ---
const ObstacleManager = ({ isPlaying, speed, onScore, onCollide }) => {
    const obstacles = useRef([]);
    const group = useRef();
    const lastSpawn = useRef(0);

    useFrame((state) => {
        if (!isPlaying) return;
        const time = state.clock.getElapsedTime();
        const spawnRate = Math.max(0.8, 2.5 - (speed * 0.2));
        
        // Spawn
        if (time - lastSpawn.current > spawnRate) {
            obstacles.current.push({ x: 20, scored: false, id: Math.random() }); 
            lastSpawn.current = time;
        }

        // Move
        group.current.children.forEach((mesh, i) => {
            const data = obstacles.current[i];
            if(!data) return;

            data.x -= (speed * 0.15); 
            mesh.position.x = data.x;

            // Collision
            if (Math.abs(data.x - (-2)) < 0.6) onCollide(data);

            // Score
            if (data.x < -3 && !data.scored) {
                data.scored = true;
                onScore(20);
            }
        });

        if (obstacles.current.length > 10) obstacles.current.shift();
    });

    return (
        <group ref={group}>
            {Array.from({length: 10}).map((_, i) => (
                <group key={i} position={[100, 0, 0]}>
                    <Cylinder args={[0, 0.5, 1, 4]} position={[0, 0.5, 0]}>
                       <meshStandardMaterial color="#ef4444" emissive="#550000" emissiveIntensity={2} />
                    </Cylinder>
                </group>
            ))}
        </group>
    );
};

// --- 3. Main Game Component ---
const JungleJump = ({ isPlaying, onScore, onMiss, config }) => {
    const [jumping, setJumping] = useState(false);
    
    // ACTION HANDLER
    const handleJump = (e) => {
        // Prevent default browser scrolling when hitting space
        if (e && e.type === 'keydown' && e.code === 'Space') e.preventDefault();
        
        if (isPlaying && !jumping) {
            setJumping(true);
        }
    };

    // Keyboard Listener
    useEffect(() => {
        const handleKey = (e) => { if (e.code === 'Space') handleJump(e); };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isPlaying, jumping]);

    return (
        <div 
            className="w-full h-full bg-slate-900 select-none outline-none cursor-pointer" 
            // 1. ATTACH EVENTS DIRECTLY HERE
            onMouseDown={handleJump} 
            onTouchStart={handleJump}
            // 2. Allow div to receive focus for keyboard events just in case
            tabIndex={0}
        >
            <Canvas shadows camera={{ position: [0, 2, 8], fov: 50 }} dpr={[1, 2]}>
                <ambientLight intensity={0.4} />
                <spotLight position={[5, 10, 5]} angle={0.3} penumbra={1} intensity={2} castShadow />
                <pointLight position={[-2, 2, 0]} intensity={1} color="#22d3ee" distance={5} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                
                <Player isJumping={jumping} onLand={() => setJumping(false)} />
                
                <ObstacleManager 
                    isPlaying={isPlaying} 
                    speed={config?.gameSpeed || 5} 
                    onScore={onScore}
                    onCollide={() => { if (!jumping) onMiss(); }}
                />

                <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                    <planeGeometry args={[100, 20]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
                </mesh>
                <gridHelper args={[100, 20, 0x22d3ee, 0x334155]} position={[0, 0.01, 0]} />
                <fog attach="fog" args={['#0f172a', 5, 25]} />
            </Canvas>
            
            <div className="absolute bottom-12 w-full text-center pointer-events-none">
                 <p className="text-cyan-500 font-mono text-xs animate-pulse tracking-[0.5em]">SYSTEM READY</p>
                 <h2 className="text-white font-bold text-2xl drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">JUMP PROTOCOL</h2>
            </div>
        </div>
    );
};

export default JungleJump;