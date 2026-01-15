// src/pages/SpaceLearningMap.jsx
import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { learningLevels, assessmentQuestions } from '../data/mockData'; // Import your provided data
import PlanetLevel from '../components/learning/PlanetLevel';
import LearningOverlay from '../components/learning/LearningOverlay';
import AssessmentModal from '../components/learning/AssessmentModal';
import PerformanceReport from '../components/learning/PerformanceReport';

const SpaceLearningMap = () => {
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [activeMission, setActiveMission] = useState(null);
  const [viewState, setViewState] = useState('map'); // 'map' | 'learning' | 'quiz' | 'report'
  const [lastScore, setLastScore] = useState(null);

  const handleAssessmentComplete = (score) => {
    setLastScore(score);
    // Logic: Pass with 70% or more to unlock the next planet
    if (score >= 70 && activeMission.id === unlockedLevel && unlockedLevel < 4) {
      setUnlockedLevel(prev => prev + 1);
    }
    setViewState('report');
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white overflow-hidden relative font-sans">
      <AnimatePresence mode="wait">
        {viewState === 'map' && (
          <motion.div key="map" className="relative z-10 pt-32 flex flex-col items-center">
            <h1 className="font-brand text-5xl tracking-[0.2em] mb-12 uppercase">Starpath Academy</h1>
            
            <div className="flex justify-around items-center w-full max-w-7xl relative h-96">
              {learningLevels.map((level) => (
                <PlanetLevel 
                  key={level.id}
                  data={level}
                  isLocked={level.id > unlockedLevel}
                  isCompleted={level.id < unlockedLevel}
                  isActive={level.id === unlockedLevel}
                  onBegin={() => { setActiveMission(level); setViewState('learning'); }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {viewState === 'learning' && (
          <LearningOverlay 
            mission={activeMission} 
            onProceed={() => setViewState('quiz')} 
          />
        )}

        {viewState === 'quiz' && (
          <AssessmentModal 
            mission={activeMission}
            questions={assessmentQuestions[activeMission.id]} // Pass current level's questions
            onComplete={handleAssessmentComplete} 
          />
        )}

        {viewState === 'report' && (
          <PerformanceReport 
            mission={activeMission} 
            score={lastScore} 
            onClose={() => setViewState('map')} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};