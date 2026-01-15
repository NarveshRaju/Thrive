// src/components/RocketModel.jsx
const RocketModel = () => {
    const { scene } = useGLTF('/src/assets/images/cosmonaut_on_a_rocket.glb');
    const rocketRef = useRef();
  
    useFrame((state) => {
      if (rocketRef.current) {
        // 🚀 VERY SLOW ASCENT: Keeps the small rocket in focus
        rocketRef.current.position.y += 0.03; 
        
        // 🎥 CENTER LOCK: Keeps the camera centered on the small model
        state.camera.lookAt(0, rocketRef.current.position.y, 0);
      }
    });
  
    return (
      <primitive 
        object={scene} 
        ref={rocketRef}
        /* SCALE: 0.3 - Significantly smaller to prevent out-of-bounds clipping.
           POSITION: [0, -2, 0] - Starts slightly below center for a full launch view.
        */
        scale={0.3} 
        position={[0, -2, 0]} 
      />
    );
  };