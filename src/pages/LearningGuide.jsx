import React, { Suspense, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Stars, useGLTF, PerspectiveCamera, Float } from '@react-three/drei';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import MentorCharacter from '../components/ui/MentorCharacter';
import { 
  Search, Sparkles, ChevronRight, Terminal, BarChart3, 
  Lock, CheckCircle2, Trophy, Timer, ArrowRight, X, Info
} from 'lucide-react';

// --- MOCK DATA & CONSTANTS ---
const MISSIONS = [
  { id: 1, name: 'LEVEL 0', topic: 'Java Basics', difficulty: 'Easy', color: '#3b82f6', video: 'eIrMbAQSU34', time: '2h', badge: 'Java Initiate', tasks: ['Variables & Data Types', 'Control Flow (Loops)', 'Syntax Fundamentals'], details: "Earth is the foundation of your journey. Here we establish the fundamental syntax that governs the Java ecosystem." },
  { id: 2, name: 'LEVEL 1', topic: 'OOP Concepts', difficulty: 'Medium', color: '#94a3b8', video: 'xk4_1vDrzzo', time: '3h', badge: 'OOP Explorer', tasks: ['Classes & Objects', 'Inheritance', 'Polymorphism'], details: "The Moon serves as our testing ground for Object-Oriented principles, focusing on modularity and reusability." },
  { id: 3, name: 'LEVEL 2', topic: 'Data Structures', difficulty: 'Hard', color: '#ef4444', video: 'RBSGKlAvoiM', time: '5h', badge: 'Algorithm Master', tasks: ['Arrays & Collections', 'Linked Lists', 'Sorting Algorithms'], details: "Mars requires high-efficiency logic. We optimize data storage and retrieval through advanced algorithmic patterns." },
  { id: 4, name: 'LEVEL 3', topic: 'Mobile Dev', difficulty: 'Expert', color: '#a855f7', video: 'fis26HvvDII', time: '8h', badge: 'Mobile Architect', tasks: ['Android UI', 'Intents & Navigation', 'Lifecycle Management'], details: "In Deep Space, we build expansive mobile environments, mastering the complex lifecycle of modern applications." },
];

const ASSESSMENT_DATA = {
  1: [
    { id: 1, q: "Which keyword defines a constant in Java?", o: ["var", "final", "static", "const"], a: 1, tip: "Review the 'final' keyword used for immutable variables." },
    { id: 2, q: "Which of these is NOT a primitive type?", o: ["int", "double", "String", "boolean"], a: 2, tip: "Strings are Objects in Java, not primitives." }
  ],
  // ... other levels follow same structure
};

// --- 3D COMPONENTS ---

const RocketModel = () => {
  const { scene } = useGLTF('/src/assets/images/cosmonaut_on_a_rocket.glb'); 
  const rocketRef = useRef();
  useFrame(() => { if (rocketRef.current) rocketRef.current.position.y += 0.08; });
  return <primitive object={scene} ref={rocketRef} scale={0.2} position={[0, -4, 0]} />;
};

const PlanetHologram = ({ color, active, locked }) => {
  const mesh = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.rotation.y = t * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={mesh}>
        <sphereGeometry args={[1.6, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={active ? 1.5 : 0.3} 
          wireframe={true} // Holographic 2D/3D Hybrid look
          transparent 
          opacity={active ? 0.8 : 0.4}
        />
        {active && <pointLight color={color} intensity={2} distance={5} />}
      </mesh>
    </Float>
  );
};

// --- MAIN PAGE COMPONENT ---

const LearningGuide = () => {
  const [view, setView] = useState('guide'); 
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [activeMission, setActiveMission] = useState(null);
  const [diagnosticReport, setDiagnosticReport] = useState([]);
  const [lastScore, setLastScore] = useState(0);

  const handleLaunch = () => setView('launch');
  const onLaunchComplete = () => setView('map');
  
  const onCompleteAssessment = (finalScore, mistakes) => {
    setLastScore(finalScore);
    setDiagnosticReport(mistakes);
    if (finalScore >= 70 && activeMission.id === unlockedLevel) setUnlockedLevel(v => v + 1);
    setView('report');
  };

  return (
    <div className="min-h-screen bg-[#030303] text-slate-200 overflow-x-hidden">
      <DashboardNavbar />

      <AnimatePresence mode="wait">
        {/* 1. AI GUIDE */}
        {view === 'guide' && (
          <motion.main exit={{ opacity: 0 }} className="pt-32 pb-40 px-4 md:px-8 max-w-5xl mx-auto relative">
            <header className="text-center mb-16">
              <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] mb-4 block">Personalized Syllabus</span>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">Jump into your learning path.</h1>
            </header>
            
            <div className="max-w-3xl mx-auto bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
                <div className="flex items-start gap-4 p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl mb-8">
                    <Sparkles className="text-cyan-400 mt-1" />
                    <p className="text-sm text-slate-400 leading-relaxed">Flight coordinates are locked. We've optimized your path through 4 primary sectors of Java development.</p>
                </div>
                <button onClick={handleLaunch} className="w-full bg-cyan-500 text-black py-5 rounded-2xl font-black uppercase tracking-widest">
                    Initialize Jump Sequence
                </button>
            </div>

            <div className="fixed bottom-0 right-0 w-[450px] h-[550px] pointer-events-none z-10">
              <Canvas camera={{ position: [0, 0, 10], fov: 35 }}>
                <ambientLight intensity={0.7} /><Suspense fallback={null}><MentorCharacter /><Environment preset="city" /></Suspense>
              </Canvas>
            </div>
          </motion.main>
        )}

        {/* 2. BASIC ROCKET LAUNCH */}
        {view === 'launch' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onAnimationComplete={() => {setTimeout(onLaunchComplete, 4000)}} className="fixed inset-0 z-[100] bg-black">
            <Canvas>
              <PerspectiveCamera makeDefault position={[0, 0, 80]} fov={70} />
              <Stars radius={150} count={8000} factor={6} fade speed={1} />
              <ambientLight intensity={1} /><Suspense fallback={null}><RocketModel /><Environment preset="night" /></Suspense>
            </Canvas>
          </motion.div>
        )}

        {/* 3. ENLARGED HOLOGRAPHIC MAP */}
        {view === 'map' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 px-8 min-h-screen relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold font-brand text-white tracking-[0.2em]">NAVIGATION DECK</h2>
            </div>

            <div className="flex flex-wrap justify-center gap-12 max-w-7xl mx-auto">
              {MISSIONS.map((m) => {
                const locked = m.id > unlockedLevel;
                const active = m.id === (activeMission?.id || unlockedLevel);
                return (
                  <div key={m.id} className="relative flex flex-col items-center">
                    <div 
                      onClick={() => !locked && setActiveMission(m)}
                      className={`w-64 h-64 cursor-pointer relative transition-all duration-500 ${locked ? 'opacity-20' : 'hover:scale-105'}`}
                    >
                      <Canvas>
                        <ambientLight intensity={1} />
                        <PlanetHologram color={m.color} active={active} locked={locked} />
                      </Canvas>
                      {locked && <div className="absolute inset-0 flex items-center justify-center text-white/40"><Lock size={48} /></div>}
                      {m.id < unlockedLevel && <div className="absolute top-0 right-0 text-cyan-400 bg-black/50 p-2 rounded-full"><CheckCircle2 size={32} /></div>}
                    </div>

                    <h3 className="text-2xl font-bold text-white tracking-widest mt-4 uppercase">{m.name}</h3>

                    {activeMission?.id === m.id && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] w-72 text-center shadow-2xl">
                             <p className="text-xs text-cyan-400 uppercase font-black mb-4 tracking-widest">{m.topic}</p>
                             <button onClick={() => setView('mission')} className="w-full bg-cyan-500 text-black py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                Enter Archives
                             </button>
                        </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="fixed inset-0 -z-10"><Canvas><Stars radius={100} depth={50} count={5000} factor={4} fade speed={0.5} /></Canvas></div>
          </motion.div>
        )}

        {/* 4. SPLIT-SCREEN MISSION ARCHIVES */}
        {view === 'mission' && activeMission && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[150] bg-black flex flex-col p-6">
            <div className="flex justify-between items-center mb-4 px-4">
              <h2 className="text-2xl font-bold text-white tracking-widest font-brand">{activeMission.name} SECTOR ARCHIVES</h2>
              <button onClick={() => setView('map')} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-white"><X /></button>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-6 flex-1 h-full overflow-hidden">
                {/* 70% VIDEO PLAYER */}
                <div className="flex-[7] rounded-[3rem] overflow-hidden border border-white/10 bg-black shadow-2xl relative">
                    <iframe 
                        width="100%" height="100%" 
                        src={`https://www.youtube.com/embed/${activeMission.video}?autoplay=1`} 
                        title="Mission Briefing" frameBorder="0" allowFullScreen
                    />
                </div>

                {/* 30% PERSONALIZED INTELLIGENCE PANEL */}
                <div className="flex-[3] bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 flex flex-col">
                    <div className="flex items-center gap-3 mb-8 text-cyan-400">
                        <Info size={24} />
                        <h4 className="font-bold uppercase tracking-widest text-sm">Mission Intelligence</h4>
                    </div>
                    
                    <div className="flex-1 space-y-8 overflow-y-auto pr-2">
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-bold mb-3 tracking-widest">Current Sector Details</p>
                            <p className="text-sm leading-relaxed text-slate-300 italic">"{activeMission.details}"</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-bold mb-4 tracking-widest">Sector Objectives</p>
                            <div className="space-y-4">
                                {activeMission.tasks.map((t, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-white text-xs font-bold">
                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> {t}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button onClick={() => setView('assessment')} className="mt-8 bg-cyan-500 text-black py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] transition-all">
                        Initiate Assessment
                    </button>
                </div>
            </div>
          </motion.div>
        )}

        {/* 5. ASSESSMENT MODAL (Simplified logic) */}
        {view === 'assessment' && (
          <Assessment mission={activeMission} onComplete={onCompleteAssessment} />
        )}

        {/* 6. DIAGNOSTIC REPORT */}
        {view === 'report' && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-6">
             <div className="max-w-2xl w-full p-12 rounded-[4rem] border border-white/10 bg-white/[0.02] backdrop-blur-3xl text-center">
                <div className="w-24 h-24 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-8">
                    <Trophy size={48} className={lastScore >= 70 ? "text-cyan-400" : "text-slate-600"} />
                </div>
                <h3 className="text-5xl font-brand font-bold text-white mb-2">{lastScore}% SYNC</h3>
                <p className="text-slate-500 mb-10 tracking-widest uppercase text-[10px] font-black">Mission Diagnostic Report</p>
                
                <div className="text-left space-y-4 mb-10 max-h-60 overflow-y-auto pr-4 custom-scrollbar">
                    {diagnosticReport.length > 0 ? (
                        <>
                            <p className="text-red-400 text-[10px] font-black uppercase tracking-widest">Anomalies Detected / Improvements Needed:</p>
                            {diagnosticReport.map((m, i) => (
                                <div key={i} className="p-5 bg-red-500/5 border border-red-500/10 rounded-2xl">
                                    <p className="text-white text-xs font-bold mb-2">Issue in Question: "{m.q}"</p>
                                    <p className="text-slate-400 text-[11px] leading-relaxed italic">Intelligence Tip: {m.tip}</p>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div className="p-8 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-center">
                            <p className="text-cyan-400 font-bold tracking-widest uppercase">Synchronization Perfect. All objectives met.</p>
                        </div>
                    )}
                </div>
                
                <div className="flex gap-4">
                    <button onClick={() => setView('mission')} className="flex-1 bg-white/5 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest">Retry Prep</button>
                    <button onClick={() => setView('map')} className="flex-1 bg-cyan-500 text-black py-5 rounded-2xl font-black uppercase text-xs tracking-widest">Return to Deck</button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Internal Assessment Component for logic separation
const Assessment = ({ mission, onComplete }) => {
  const [idx, setIdx] = useState(0);
  const [mistakes, setMistakes] = useState([]);
  const [score, setScore] = useState(0);
  const questions = ASSESSMENT_DATA[mission.id] || ASSESSMENT_DATA[1];

  const handle = (opt) => {
    const isCorrect = opt === questions[idx].a;
    if (!isCorrect) setMistakes([...mistakes, questions[idx]]);
    const newScore = isCorrect ? score + 1 : score;

    if (idx < questions.length - 1) {
      setScore(newScore);
      setIdx(idx + 1);
    } else {
      onComplete(Math.round(((isCorrect ? newScore : score) / questions.length) * 100), isCorrect ? mistakes : [...mistakes, questions[idx]]);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95">
      <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 max-w-xl w-full">
        <h3 className="text-2xl font-bold text-white mb-10">{questions[idx].q}</h3>
        <div className="grid gap-4">
          {questions[idx].o.map((o, i) => (
            <button key={i} onClick={() => handle(i)} className="p-6 text-left rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/50 text-white transition-all uppercase text-[11px] font-black tracking-widest">
              {o}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningGuide;