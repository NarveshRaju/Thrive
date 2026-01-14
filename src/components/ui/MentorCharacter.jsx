import React, { useRef } from 'react';
import { useGLTF, Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export default function MentorCharacter() {
  // Path to your uploaded dark_astronaut.glb 
  const { scene } = useGLTF('/src/assets/images/astronaut.glb');
  const characterRef = useRef();

  // Gentle floating and rotation animation
  useFrame((state) => {
    if (characterRef.current) {
      // Slow rotation for cinematic feel
      characterRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
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
        /* ADJUSTMENTS:
           [cite_start]Scale: Reduced to 1.2 to fit the frame[cite: 130].
           Position: [X, Y, Z]. Setting Y to -2.5 drops the model 
           [cite_start]so the head/torso align with the camera center[cite: 130].
        */
        scale={1.2} 
        position={[0, -2.5, 0]} 
      />
    </Float>
  );
}

// Preload for performance
useGLTF.preload('/src/assets/images/astronaut.glb');