// src/components/ui/MentorCharacter.jsx
import React, { useRef } from 'react';
import { useGLTF, Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export default function MentorCharacter() {
  const { scene } = useGLTF('/src/assets/images/astronaut.glb');
  const characterRef = useRef();

  useFrame((state) => {
    if (characterRef.current) {
      // Very slow cinematic tilt
      characterRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      characterRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <Float 
      speed={1.5} 
      rotationIntensity={0.2} 
      floatIntensity={0.5}
      floatingRange={[-0.1, 0.1]}
    >
      <primitive 
        ref={characterRef}
        object={scene} 
        scale={2.2} 
        position={[0, -2.8, 0]} 
      />
    </Float>
  );
}

useGLTF.preload('/src/assets/images/astronaut.glb');