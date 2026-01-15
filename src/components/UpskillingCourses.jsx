// src/components/UpskillingCourses.jsx
import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars, PerspectiveCamera, Environment, Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import DashboardNavbar from '../components/layout/DashboardNavbar';

// Sub-components for the gamified flow
import PlanetLevel from './learning/PlanetLevel';
import LearningOverlay from './learning/LearningOverlay';
import AssessmentModal from './learning/AssessmentModal';
import PerformanceReport from './learning/PerformanceReport';

const MISSION_DATA = [
  { id: 1, name: 'Earth', topic: 'Java Basics', difficulty: 'Easy', time: '45m', videoId: 'eIrMbAQSU34', color: '#2563eb', badge: 'Java Initiate' },
  { id: 2, name: 'Moon', topic: 'OOP in Java', difficulty: 'Medium', time: '60m', videoId: 'pTB0EiLXUC8', color: '#94a3b8', badge: 'OOP Explorer' },
  { id: 3, name: 'Mars', topic: 'Data Structures', difficulty: 'Hard', time: '90m', videoId: 'B31LgI4Y4Is', color: '#dc2626', badge: 'Mars Architect' },
  { id: 4, name: 'Saturn', topic: 'Mobile Dev', difficulty: 'Difficult', time: '120m', videoId: 'fis26HvvDII', color: '#7c3aed', badge: 'Space Developer' },
];

const UpskillingCourses = () => {
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [activeMission, setActiveMission] = useState(null);
  const [viewState, setViewState] = useState('map');

  return (
    <div className="min-h-screen bg-[#020202] text-white overflow-hidden relative">
      <DashboardNavbar />
      
      {/* Cinematic Starfield Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 15]} />
          <Stars radius={100} depth={50} count={6000} factor={4} fade speed={1} />
          <Suspense fallback={null}><Environment preset="night" /></Suspense>
        </Canvas>
      </div>

      <AnimatePresence mode="wait">
        {viewState === 'map' && (
          <motion.div 
            key="map"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(20px)' }}
            className="relative z-10 pt-32 px-4 h-screen flex flex-col items-center"
          >
            <div className="text-center mb-12">
              <h1 className="font-brand text-4xl md:text-6xl tracking-[0.2em] mb-4 uppercase">STARPATH ACADEMY</h1>
              <p className="text-cyan-400 tracking-[0.3em] text-[10px] font-black uppercase">Mission: Navigate the Java Galaxy</p>
            </div>

            {/* 3D PLANETARY MAP - Replacing all card layouts */}
            <div className="flex flex-wrap justify-center items-center w-full max-w-7xl mt-8 gap-4 md:gap-0">
              {MISSION_DATA.map((mission) => (
                <PlanetLevel 
                  key={mission.id}
                  data={mission}
                  isLocked={mission.id > unlockedLevel}
                  isCompleted={mission.id < unlockedLevel}
                  isActive={mission.id === unlockedLevel}
                  onBegin={() => { setActiveMission(mission); setViewState('learning'); }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Gamified Mission Transitions */}
        {viewState === 'learning' && (
          <LearningOverlay mission={activeMission} onProceed={() => setViewState('quiz')} />
        )}
        {viewState === 'quiz' && (
          <AssessmentModal mission={activeMission} onComplete={(score) => {
             if (score >= 70 && activeMission.id === unlockedLevel && unlockedLevel < 4) setUnlockedLevel(prev => prev + 1);
             setViewState('report');
          }} />
        )}
        {viewState === 'report' && (
          <PerformanceReport mission={activeMission} onClose={() => setViewState('map')} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default UpskillingCourses;