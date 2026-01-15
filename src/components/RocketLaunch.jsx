// src/components/RocketLaunch.jsx
const RocketLaunch = ({ onComplete }) => {
    useEffect(() => {
      // ⏱️ Extended time to 4s to let the small rocket travel further
      const timer = setTimeout(onComplete, 4000); 
      return () => clearTimeout(timer);
    }, [onComplete]);
  
    return (
      <div className="fixed inset-0 z-[100] bg-[#010101]">
        <Canvas shadows>
          {/* Z: 25 - Significant zoom-out to keep everything in bounds.
              FOV: 30 - Narrower field of view to compress the space and feel cinematic.
          */}
          <PerspectiveCamera makeDefault position={[0, 0, 25]} fov={30} />
          
          <Stars radius={150} depth={50} count={4000} factor={6} fade speed={0.5} />
          <ambientLight intensity={0.8} />
          
          {/* Bright exhaust glow adjusted for smaller scale */}
          <pointLight position={[0, -2, 1]} intensity={5} color="#ff8c00" /> 
          
          <Suspense fallback={null}>
            <RocketModel />
            <Environment preset="night" />
          </Suspense>
        </Canvas>
  
        {/* Deep Space Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,transparent_5%,black_100%)] opacity-90" />
      </div>
    );
  };