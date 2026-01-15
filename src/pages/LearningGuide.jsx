import React, { Suspense, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, PerspectiveCamera, Environment } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import { 
  Sparkles, X, Info, Trophy, Loader2, AlertCircle, ArrowLeft,
  Lock, CheckCircle2, Clock, Target
} from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

// ===== 3D PLANET HOLOGRAM COMPONENT =====
const PlanetHologram = ({ color, active, locked, completed }) => {
  const mesh = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.rotation.y = t * 0.3;
      mesh.current.rotation.x = Math.sin(t * 0.5) * 0.1;
    }
  });

  // Parse color - convert "from-blue-500 to-blue-700" to hex
  const colorMap = {
    'from-blue-500': '#3b82f6',
    'from-gray-500': '#6b7280',
    'from-green-500': '#22c55e',
    'from-red-500': '#ef4444',
    'from-orange-500': '#f97316',
    'from-purple-500': '#a855f7',
    'from-yellow-500': '#eab308',
    'from-cyan-500': '#06b6d4'
  };

  const planetColor = colorMap[color?.split(' ')[0]] || '#3b82f6';

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group>
        {/* Main Planet Sphere */}
        <mesh ref={mesh}>
          <sphereGeometry args={[1.6, 32, 32]} />
          <meshStandardMaterial 
            color={planetColor}
            emissive={planetColor}
            emissiveIntensity={active ? 1.5 : locked ? 0.1 : 0.6}
            wireframe={true}
            transparent
            opacity={locked ? 0.2 : active ? 0.9 : 0.6}
          />
        </mesh>

        {/* Glow Effect */}
        {!locked && (
          <mesh>
            <sphereGeometry args={[1.8, 32, 32]} />
            <meshBasicMaterial
              color={planetColor}
              transparent
              opacity={active ? 0.3 : 0.1}
              side={2}
            />
          </mesh>
        )}

        {/* Active Planet Light */}
        {active && <pointLight color={planetColor} intensity={3} distance={8} />}

        {/* Completed Ring */}
        {completed && (
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[2, 0.05, 16, 100]} />
            <meshStandardMaterial
              color="#06b6d4"
              emissive="#06b6d4"
              emissiveIntensity={1}
            />
          </mesh>
        )}
      </group>
    </Float>
  );
};

// ===== 3D ROCKET FOR LAUNCH =====
const RocketModel = () => {
  const rocketRef = useRef();
  
  useFrame(() => { 
    if (rocketRef.current) {
      rocketRef.current.position.y += 0.08;
      rocketRef.current.rotation.y += 0.02;
    }
  });
  
  return (
    <group ref={rocketRef} position={[0, -4, 0]}>
      {/* Rocket Body */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[0.5, 2, 8]} />
        <meshStandardMaterial 
          color="#ff6b35" 
          emissive="#ff6b35" 
          emissiveIntensity={1.5} 
        />
      </mesh>
      
      {/* Rocket Fins */}
      <mesh position={[0.3, -0.8, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.4, 0.1, 0.8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[-0.3, -0.8, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.4, 0.1, 0.8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      
      {/* Flame */}
      <pointLight position={[0, -1.5, 0]} color="#ff6b35" intensity={5} distance={3} />
    </group>
  );
};

// ===== PLANET CARD WITH 3D HOLOGRAM =====
const PlanetCard = ({ level, index, onClick, isActive }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.15, type: 'spring' }}
      className="relative flex flex-col items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Planet Canvas */}
      <div 
        onClick={level.locked ? undefined : onClick}
        className={`w-64 h-64 ${level.locked ? 'cursor-not-allowed' : 'cursor-pointer'} relative`}
      >
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Suspense fallback={null}>
            <PlanetHologram 
              color={level.color}
              active={isActive}
              locked={level.locked}
              completed={level.completed}
            />
          </Suspense>
        </Canvas>

        {/* Lock Icon Overlay */}
        {level.locked && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/70 backdrop-blur-sm rounded-full p-4">
              <Lock className="w-12 h-12 text-gray-400" />
            </div>
          </div>
        )}

        {/* Completion Badge */}
        {level.completed && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-4 right-4 bg-cyan-500 rounded-full p-2 shadow-lg"
          >
            <CheckCircle2 className="w-8 h-8 text-white" />
          </motion.div>
        )}
      </div>

      {/* Level Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.15 + 0.2 }}
        className="mt-4 text-center"
      >
        <h3 className="text-2xl font-bold text-white mb-1 uppercase tracking-wider">
          {level.name}
        </h3>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">
          {level.subtitle}
        </p>
        
        {/* Difficulty Badge */}
        <div className={`
          inline-block px-4 py-1 rounded-full text-xs font-black uppercase tracking-wide
          ${level.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
            level.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
            level.difficulty === 'Hard' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
            'bg-red-500/20 text-red-400 border border-red-500/30'
          }
        `}>
          {level.difficulty}
        </div>
      </motion.div>

      {/* Hover Info Panel */}
      <AnimatePresence>
        {isHovered && !level.locked && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute top-full mt-4 w-96 bg-black/80 backdrop-blur-3xl rounded-3xl p-6 border border-white/20 shadow-2xl z-50 pointer-events-none"
          >
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-cyan-400" />
              Mission Briefing
            </h4>
            
            <div className="mb-4">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Topics Covered</p>
              <div className="space-y-2">
                {level.topics?.map((topic, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_cyan]" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Meta Stats */}
            <div className="flex items-center gap-4 mb-4 text-xs text-gray-400 font-bold">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>{level.estimatedTime}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span>{level.badge}</span>
              </div>
            </div>

            {/* Project Info */}
            {level.project && (
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 mb-4">
                <p className="text-xs text-cyan-400 font-bold mb-1">Project Challenge</p>
                <p className="text-xs text-gray-300">{level.project}</p>
              </div>
            )}

            <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-black text-sm uppercase tracking-wide hover:shadow-lg hover:shadow-cyan-500/50 transition-all active:scale-95">
              {level.completed ? '🎯 Review Mission' : '🚀 Start Mission'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Mission Indicator */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 bg-cyan-500/20 border border-cyan-500/50 rounded-2xl px-6 py-3"
        >
          <button 
            onClick={onClick}
            className="text-cyan-400 font-black uppercase text-sm tracking-wider hover:text-cyan-300 transition-colors"
          >
            📡 Enter Archives →
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

// ===== MAIN LEARNING GUIDE COMPONENT =====
const LearningGuide = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('loading');
  const [learningPath, setLearningPath] = useState(null);
  const [progress, setProgress] = useState(null);
  const [activeMission, setActiveMission] = useState(null);
  const [selectedMissionId, setSelectedMissionId] = useState(null);
  const [error, setError] = useState(null);
  const [assessmentStartTime, setAssessmentStartTime] = useState(null);

  useEffect(() => {
    loadLearningPath();
  }, []);

  const loadLearningPath = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${API_URL}/profile/learning-path`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        setLearningPath(data);
        setProgress(data.progress);
        setView('guide');
      } else {
        console.log('🤖 Generating learning path...');
        const genRes = await fetch(`${API_URL}/profile/generate-learning-path`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const genData = await genRes.json();
        if (genData.success) {
          setLearningPath(genData);
          setProgress(genData.progress);
          setView('guide');
        } else {
          throw new Error(genData.message);
        }
      }
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message);
      setView('error');
    }
  };

  const handleCompleteAssessment = async (finalScore, mistakes) => {
    const timeSpent = assessmentStartTime ? Math.floor((Date.now() - assessmentStartTime) / 60000) : 5;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/profile/update-learning-progress`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          levelId: activeMission.id,
          score: finalScore,
          mistakes,
          timeSpent
        })
      });

      const data = await res.json();
      if (data.success) {
        setProgress(data.progress);
      }
    } catch (err) {
      console.error('Error updating progress:', err);
    }

    setView('report');
  };

  if (view === 'loading') {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Initializing Mission Control...</p>
        </div>
      </div>
    );
  }

  if (view === 'error') {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-white text-2xl font-bold mb-2">System Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-cyan-500 rounded-xl font-bold"
          >
            Restart System
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white overflow-x-hidden">
      <DashboardNavbar />

      <AnimatePresence mode="wait">
        {/* GUIDE VIEW */}
        {view === 'guide' && (
          <motion.main exit={{ opacity: 0 }} className="pt-32 pb-20 px-4 max-w-6xl mx-auto">
            <header className="text-center mb-16">
              <span className="text-xs font-black text-cyan-500 uppercase tracking-[0.3em] mb-4 block">
                AI-Powered Learning System
              </span>
              <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {learningPath.pathName}
              </h1>
              <p className="text-gray-400 max-w-2xl mx-auto mb-8 text-lg leading-relaxed">
                {learningPath.personalizedMessage}
              </p>
              <div className="flex items-center justify-center gap-8 text-sm">
                <span className="flex items-center gap-2 text-cyan-400 font-bold">
                  <Clock className="w-5 h-5" />
                  {learningPath.estimatedTotalTime}
                </span>
                <span className="flex items-center gap-2 text-purple-400 font-bold">
                  <Target className="w-5 h-5" />
                  {learningPath.levels.length} Missions
                </span>
                <span className="flex items-center gap-2 text-green-400 font-bold">
                  <Trophy className="w-5 h-5" />
                  {progress.completedLevels.length} Completed
                </span>
              </div>
            </header>

            <button
              onClick={() => setView('launch')}
              className="mx-auto block bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-16 py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-lg hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50 transition-all"
            >
              🚀 Launch Mission Control
            </button>
          </motion.main>
        )}

        {/* LAUNCH ANIMATION */}
        {view === 'launch' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onAnimationComplete={() => setTimeout(() => setView('map'), 3500)}
            className="fixed inset-0 z-[100] bg-black"
          >
            <Canvas>
              <PerspectiveCamera makeDefault position={[0, 0, 80]} fov={70} />
              <Stars radius={150} count={10000} factor={8} fade speed={2} />
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={2} />
              <Suspense fallback={null}>
                <RocketModel />
              </Suspense>
            </Canvas>
            
            <div className="absolute bottom-20 left-0 right-0 text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="text-4xl font-bold text-white mb-2"
              >
                LAUNCHING...
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-cyan-400 text-sm uppercase tracking-widest"
              >
                Entering Mission Space
              </motion.p>
            </div>
          </motion.div>
        )}

        {/* 3D PLANET MAP */}
        {view === 'map' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-32 px-8 min-h-screen relative pb-20"
          >
            <div className="text-center mb-20">
              <h2 className="text-5xl font-bold tracking-[0.2em] mb-4 text-white">
                MISSION CONTROL
              </h2>
              <p className="text-gray-400 text-lg">Select your next destination</p>
            </div>

            {/* 3D PLANET GRID */}
            <div className="flex flex-wrap justify-center gap-24 max-w-7xl mx-auto">
              {learningPath.levels.map((level, index) => (
                <PlanetCard
                  key={level.id}
                  level={{
                    ...level,
                    locked: level.id > progress.unlockedLevel,
                    completed: progress.completedLevels.includes(level.id)
                  }}
                  index={index}
                  isActive={selectedMissionId === level.id}
                  onClick={() => {
                    if (level.id <= progress.unlockedLevel) {
                      setSelectedMissionId(level.id);
                      setActiveMission(level);
                      setView('mission');
                    }
                  }}
                />
              ))}
            </div>

            {/* Starfield Background */}
            <div className="fixed inset-0 -z-10">
              <Canvas>
                <Stars radius={100} depth={50} count={7000} factor={5} fade speed={0.5} />
              </Canvas>
            </div>

            {/* Back Button */}
            <button
              onClick={() => navigate('/dashboard')}
              className="fixed top-24 left-8 flex items-center gap-2 px-6 py-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl hover:bg-white/5 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-bold">Dashboard</span>
            </button>
          </motion.div>
        )}

        {/* MISSION BRIEFING... (keep your existing mission view) */}
      </AnimatePresence>
    </div>
  );
};

export default LearningGuide;
