import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { AnaglyphEffect } from 'three/examples/jsm/effects/AnaglyphEffect';

// --- 1. CONFIG HELPER (Derived from Backend Props) ---
// We simply read the props. No defaults here needed if Backend is strict.
const resolveConfig = (config) => {
    return {
        // Fallbacks only for safety, logic comes from Backend
        speed: config?.speed || 5,
        size: config?.size || 5,
        contrast: config?.contrast || 100,
        count: config?.asteroidCount || 40,
        isDichoptic: config?.dichopticEnabled || false,
        bgColor: config?.backgroundColor || 'black',
        
        // Color Logic
        colors: config?.dichopticEnabled 
            ? (config.colorCombination === 'red-blue' ? { l: '#f00', r: '#00f' } : { l: '#f00', r: '#0ff' }) // Medical
            : { l: '#ff4444', r: '#44ffff' } // Aesthetic
    };
};

// --- 2. ANAGLYPH EFFECT (Medical Mode) ---
const Anaglyph = () => {
    const { gl, scene, camera, size } = useThree();
    const effect = useMemo(() => new AnaglyphEffect(gl), [gl]);
    useEffect(() => {
        effect.setSize(size.width, size.height);
        return () => effect.dispose();
    }, [effect, size]);
    useFrame(() => effect.render(scene, camera), 1);
    return null;
};

// --- 3. GAME ENTITIES ---
const PlayerShip = ({ color, speed }) => {
    const mesh = useRef();
    useFrame(({ mouse, viewport }, delta) => {
        if (!mesh.current) return;
        const x = (mouse.x * viewport.width) / 2;
        const y = (mouse.y * viewport.height) / 2;
        // Smooth movement based on Delta Time
        mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, x, 10 * delta);
        mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, y, 10 * delta);
        // Tilt Effect
        mesh.current.rotation.z = (x - mesh.current.position.x) * -2.0;
        mesh.current.rotation.x = (y - mesh.current.position.y) * 2.0;
    });
    return (
        <group ref={mesh}>
            <Trail width={1.5} length={4} color={color} attenuation={(t) => t * t}>
                <mesh rotation={[0, Math.PI / 2, 0]}>
                    <coneGeometry args={[0.5, 1.5, 8]} />
                    <meshBasicMaterial color={color} toneMapped={false} />
                </mesh>
            </Trail>
        </group>
    );
};

const AsteroidField = ({ gameSettings, onHit, onScore }) => {
    const { count, speed, size, contrast, colors } = gameSettings;
    const mesh = useRef();
    const { viewport, mouse } = useThree();
    const dummy = useMemo(() => new THREE.Object3D(), []);
    
    // Generate Initial Positions
    const asteroids = useMemo(() => new Array(count).fill(0).map(() => ({
        x: (Math.random() - 0.5) * 40,
        y: (Math.random() - 0.5) * 25,
        z: -50 - Math.random() * 100,
        hit: false
    })), [count]);

    useFrame((state, delta) => {
        if(!mesh.current) return;
        const playerX = (mouse.x * viewport.width) / 2;
        const playerY = (mouse.y * viewport.height) / 2;
        const hitRadiusSq = (1.5 * (0.5 + size * 0.1)) ** 2;

        asteroids.forEach((data, i) => {
            // Move Logic
            data.z += (speed * 0.5) * 20 * delta; 

            // Collision Logic
            if(Math.abs(data.z) < 2) {
                const dx = data.x - playerX;
                const dy = data.y - playerY;
                if((dx*dx + dy*dy) < hitRadiusSq && !data.hit) {
                    data.hit = true;
                    onHit && onHit();
                }
            }
            
            // Reset Logic
            if(data.z > 10) {
                if(!data.hit) onScore && onScore(10);
                data.z = -80 - Math.random() * 50;
                data.x = (Math.random() - 0.5) * 40;
                data.y = (Math.random() - 0.5) * 25;
                data.hit = false;
            }

            // Update Instance
            dummy.position.set(data.x, data.y, data.z);
            dummy.scale.setScalar(0.5 + size * 0.1);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[null, null, count]}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshBasicMaterial 
                color={colors.l} 
                transparent 
                opacity={contrast / 100} 
                toneMapped={false} 
            />
        </instancedMesh>
    );
};

// --- 4. MAIN EXPORT ---
const SpacePursuits = ({ isPlaying, onScore, onMiss, config }) => {
    // Resolve props into usable settings
    const gameSettings = resolveConfig(config || {}); 
    
    return (
        <div className="w-full h-full relative bg-black cursor-none">
            <Canvas camera={{ position: [0, 0, 8], fov: 60 }} dpr={[1, 2]}>
                {gameSettings.isDichoptic && <Anaglyph />}
                
                <color attach="background" args={[gameSettings.bgColor === 'white' ? '#f0f0f0' : '#050505']} />
                {gameSettings.bgColor === 'black' && <Stars radius={100} depth={50} count={5000} factor={4} fade />}
                
                <ambientLight intensity={1.5} />
                
                {isPlaying && (
                    <>
                        <PlayerShip color={gameSettings.colors.r} />
                        <AsteroidField 
                            gameSettings={gameSettings} 
                            onHit={onMiss} 
                            onScore={onScore} 
                        />
                    </>
                )}
            </Canvas>
        </div>
    );
};

export default SpacePursuits;