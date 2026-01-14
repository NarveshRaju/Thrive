import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import MentorCharacter from '../components/ui/MentorCharacter';
import { motion } from 'framer-motion';

const LearningGuide = () => {
  return (
    <div className="min-h-screen bg-[#030303] text-slate-200">
      <DashboardNavbar />

      <main className="pt-24 pb-20 px-4 md:px-8 max-w-5xl mx-auto">
        <section className="flex flex-col items-center text-center mb-16 relative">
          <div className="absolute top-0 w-80 h-80 bg-orange-600/5 blur-[120px] rounded-full -z-10" />
          
          <div className="w-full h-[800px] mb-6 relative">
            <Canvas 
              shadows 
              camera={{ position: [0, 0, 10], fov: 35 }}
            >
              <ambientLight intensity={0.7} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
              
              <Suspense fallback={null}>
                <MentorCharacter />
                {/* Soft shadow to anchor the character to the floor */}
                <ContactShadows position={[0, -2.8, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />
                <Environment preset="city" />
              </Suspense>

              <OrbitControls 
                enableZoom={false} 
                maxPolarAngle={Math.PI / 2} 
                minPolarAngle={Math.PI / 2} 
              />
            </Canvas>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-3 rounded-2xl font-bold shadow-2xl z-20"
            >
              "The stars align with your progress, Alex."
            </motion.div>
          </div>

          <h1 className="font-brand text-4xl text-white tracking-[0.25em] mb-4 uppercase">
            Career Navigator
          </h1>
        </section>
      </main>
    </div>
  );
};

export default LearningGuide;