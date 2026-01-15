import React, { Suspense, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, PerspectiveCamera } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import { 
  Sparkles, X, Info, Trophy, Loader2, AlertCircle, ArrowLeft,
  Lock, CheckCircle2, Clock, Target, Award, ChevronRight
} from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

// ===== 3D COMPONENTS =====
const PlanetHologram = ({ color, active, locked, completed }) => {
  const mesh = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.rotation.y = t * 0.3;
      mesh.current.rotation.x = Math.sin(t * 0.5) * 0.1;
    }
  });

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
        {active && <pointLight color={planetColor} intensity={3} distance={8} />}
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
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[0.5, 2, 8]} />
        <meshStandardMaterial color="#ff6b35" emissive="#ff6b35" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[0.3, -0.8, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.4, 0.1, 0.8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[-0.3, -0.8, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.4, 0.1, 0.8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <pointLight position={[0, -1.5, 0]} color="#ff6b35" intensity={5} distance={3} />
    </group>
  );
};

// ===== PLANET CARD =====
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

        {level.locked && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/70 backdrop-blur-sm rounded-full p-4">
              <Lock className="w-12 h-12 text-gray-400" />
            </div>
          </div>
        )}

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

            {level.project && (
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3">
                <p className="text-xs text-cyan-400 font-bold mb-1">Project Challenge</p>
                <p className="text-xs text-gray-300">{level.project}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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

// ===== ASSESSMENT COMPONENT =====
const Assessment = ({ mission, questions, onComplete }) => {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState([]);
  const [timer, setTimer] = useState(300); // 5 minutes

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAnswer = (selectedIdx) => {
    const isCorrect = selectedIdx === questions[idx].correctAnswer;
    
    if (!isCorrect) {
      setMistakes([...mistakes, {
        question: questions[idx].question,
        userAnswer: selectedIdx,
        correctAnswer: questions[idx].correctAnswer,
        tip: questions[idx].tip
      }]);
    }

    const newScore = isCorrect ? score + 1 : score;

    if (idx < questions.length - 1) {
      setScore(newScore);
      setIdx(idx + 1);
    } else {
      const finalScore = Math.round(((isCorrect ? newScore + 1 : newScore) / questions.length) * 100);
      onComplete(finalScore, isCorrect ? mistakes : [...mistakes, {
        question: questions[idx].question,
        userAnswer: selectedIdx,
        correctAnswer: questions[idx].correctAnswer,
        tip: questions[idx].tip
      }]);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-2xl">
      <div className="w-full max-w-3xl bg-white/[0.03] border border-white/10 p-12 rounded-[3rem] shadow-2xl">
        <div className="flex justify-between mb-8 text-xs font-black uppercase tracking-widest">
          <span className="text-cyan-500">Mission: {mission.name}</span>
          <span className="text-gray-400">Question {idx + 1}/{questions.length}</span>
          <span className="text-orange-500">
            Time: {Math.floor(timer/60)}:{(timer%60).toString().padStart(2,'0')}
          </span>
        </div>

        <h3 className="text-3xl font-bold mb-10 text-white leading-tight">
          {questions[idx].question}
        </h3>

        <div className="grid gap-4">
          {questions[idx].options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              className="p-6 text-left bg-white/5 border border-white/10 rounded-2xl hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all text-white font-medium"
            >
              <span className="text-cyan-400 font-black mr-3">{String.fromCharCode(65 + i)}.</span>
              {option}
            </button>
          ))}
        </div>

        <div className="mt-8 flex justify-between items-center">
          <div className="flex gap-2">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < idx ? 'bg-cyan-400' : i === idx ? 'bg-white' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
          <p className="text-gray-400 text-sm">Score: {score}/{questions.length}</p>
        </div>
      </div>
    </div>
  );
};

// ===== REPORT COMPONENT =====
const Report = ({ score, mistakes, mission, onRetry, onContinue }) => {
  const passed = score >= 70;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-6"
    >
      <div className="max-w-3xl w-full p-12 rounded-[4rem] border border-white/10 bg-white/[0.02] backdrop-blur-3xl text-center">
        <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-8 ${
          passed ? 'bg-cyan-500/20 border-4 border-cyan-400' : 'bg-red-500/20 border-4 border-red-400'
        }`}>
          <Trophy size={64} className={passed ? "text-cyan-400" : "text-red-400"} />
        </div>

        <h3 className="text-6xl font-bold text-white mb-2">{score}%</h3>
        <p className="text-gray-400 mb-4 tracking-widest uppercase text-sm font-black">
          {passed ? '✅ Mission Complete' : '❌ Mission Failed'}
        </p>
        <p className="text-gray-500 mb-10 text-xs uppercase tracking-widest">
          Diagnostic Report: {mission.name}
        </p>

        {mistakes.length > 0 && (
          <div className="text-left space-y-4 mb-10 max-h-80 overflow-y-auto pr-4">
            <p className="text-red-400 text-xs font-black uppercase tracking-widest mb-4">
              🔍 Areas for Improvement ({mistakes.length} mistakes)
            </p>
            {mistakes.map((m, i) => (
              <div key={i} className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl">
                <p className="text-white text-sm font-bold mb-2">❌ {m.question}</p>
                <p className="text-gray-400 text-xs mb-2">
                  Your answer: <span className="text-red-400">{m.options?.[m.userAnswer] || 'N/A'}</span>
                </p>
                <p className="text-cyan-400 text-xs italic">💡 {m.tip}</p>
              </div>
            ))}
          </div>
        )}

        {passed && (
          <div className="p-8 bg-cyan-500/10 border border-cyan-500/20 rounded-3xl mb-10">
            <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <p className="text-cyan-400 font-bold text-lg mb-2">🎉 Badge Earned!</p>
            <p className="text-white text-2xl font-black uppercase tracking-wide">{mission.badge}</p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={onRetry}
            className="flex-1 bg-white/5 text-white py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-white/10 transition-all"
          >
            🔄 Retry Mission
          </button>
          <button
            onClick={onContinue}
            className="flex-1 bg-cyan-500 text-black py-5 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-cyan-400 transition-all"
          >
            {passed ? '🚀 Next Mission' : '🗺️ Mission Map'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ===== MAIN COMPONENT =====
const LearningGuide = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('loading');
  const [learningPath, setLearningPath] = useState(null);
  const [progress, setProgress] = useState(null);
  const [activeMission, setActiveMission] = useState(null);
  const [selectedMissionId, setSelectedMissionId] = useState(null);
  const [error, setError] = useState(null);
  const [assessmentStartTime, setAssessmentStartTime] = useState(null);
  const [lastScore, setLastScore] = useState(0);
  const [lastMistakes, setLastMistakes] = useState([]);

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
    
    setLastScore(finalScore);
    setLastMistakes(mistakes);

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
        {/* GUIDE */}
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

        {/* LAUNCH */}
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

        {/* MAP */}
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

            <div className="fixed inset-0 -z-10">
              <Canvas>
                <Stars radius={100} depth={50} count={7000} factor={5} fade speed={0.5} />
              </Canvas>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="fixed top-24 left-8 flex items-center gap-2 px-6 py-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl hover:bg-white/5 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-bold">Dashboard</span>
            </button>
          </motion.div>
        )}

        {/* MISSION BRIEFING */}
        {view === 'mission' && activeMission && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[150] bg-black flex flex-col p-6"
          >
            <div className="flex justify-between items-center mb-4 px-4">
              <h2 className="text-3xl font-bold tracking-widest text-white uppercase">
                {activeMission.name} ARCHIVES
              </h2>
              <button 
                onClick={() => setView('map')} 
                className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-white transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
              {/* Video Player */}
              <div className="flex-[7] rounded-[3rem] overflow-hidden border border-white/10 bg-black shadow-2xl">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${activeMission.videoId}?rel=0&modestbranding=1`}
                  title="Mission Briefing"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Mission Intel Panel */}
              <div className="flex-[3] bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 flex flex-col">
                <div className="flex items-center gap-3 mb-8 text-cyan-400">
                  <Info size={24} />
                  <h4 className="font-bold uppercase tracking-widest text-sm">Mission Intel</h4>
                </div>

                <div className="flex-1 space-y-8 overflow-y-auto pr-2">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-3 tracking-widest">Objective</p>
                    <p className="text-sm leading-relaxed text-gray-300 italic">
                      "{activeMission.description}"
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-4 tracking-widest">Sector Objectives</p>
                    <div className="space-y-4">
                      {activeMission.topics?.map((topic, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-white text-xs font-bold">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                          {topic}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-2 tracking-widest">Project Mission</p>
                    <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl">
                      <p className="text-sm text-cyan-400">{activeMission.project}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-xs font-bold">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4 text-cyan-400" />
                      {activeMission.estimatedTime}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Trophy className="w-4 h-4 text-yellow-400" />
                      {activeMission.badge}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setAssessmentStartTime(Date.now());
                    setView('assessment');
                  }}
                  className="mt-8 bg-cyan-500 text-black py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg"
                >
                  ⚡ Initiate Assessment
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ASSESSMENT */}
        {view === 'assessment' && activeMission && (
          <Assessment
            mission={activeMission}
            questions={activeMission.assessment}
            onComplete={handleCompleteAssessment}
          />
        )}

        {/* REPORT */}
        {view === 'report' && activeMission && (
          <Report
            score={lastScore}
            mistakes={lastMistakes}
            mission={activeMission}
            onRetry={() => setView('mission')}
            onContinue={() => setView('map')}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LearningGuide;
