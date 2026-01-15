import React, { Suspense, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Stars, useGLTF, PerspectiveCamera } from '@react-three/drei';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import MentorCharacter from '../components/ui/MentorCharacter';
import { 
  Search, Sparkles, ChevronRight, 
  Terminal, BarChart3, Globe, Clock, BarChart 
} from 'lucide-react';

// --- 1. DEDICATED ROCKET MODEL (Internal logic) ---
// src/pages/LearningGuide.jsx

const RocketModel = () => {
  const { scene } = useGLTF('/src/assets/images/cosmonaut_on_a_rocket.glb'); 
  const rocketRef = useRef();

  useFrame((state) => {
    if (rocketRef.current) {
      // 🚀 SLOWER ASCENT: Keeps the small model in view longer
      rocketRef.current.position.y += 0.05; 
      
      // 🎥 CENTER LOCK: Maintains focus on the rocket's center point
      state.camera.lookAt(0, rocketRef.current.position.y, 0); 
    }
  });

  return (
    <primitive 
      object={scene} 
      ref={rocketRef}
      /* SCALE: 0.2 - Drastically smaller to ensure it fits any screen size.
         POSITION: [0, -4, 0] - Starts at the bottom-center.
      */
      scale={0.2} 
      position={[0, -4, 0]} 
    />
  );
};

// --- 2. ROCKET LAUNCH SCENE ---
// src/pages/LearningGuide.jsx (RocketLaunch Section)

const RocketLaunch = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 5000); 
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#010101]">
      <Canvas shadows>
        {/* Z: 28 - Pulled back significantly to prevent clipping.
            FOV: 30 - Narrower field of view to keep the rocket centered and sharp.
        */}
        <PerspectiveCamera makeDefault position={[0, 0, 80]} fov={70} /> 
        
        <Stars radius={150} depth={50} count={8000} factor={6} fade speed={0.5} /> 
        <ambientLight intensity={0.8} /> 
        
        {/* Exhaust Glow adjusted for smaller scale */}
        <pointLight position={[0, -4, 1]} intensity={5} color="#ff8c00" /> 
        
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

// --- 3. UPSKILLING COURSES PAGE ---
const UpskillingCourses = () => {
  const courses = [
    { id: 1, title: "System Design for Engineers", platform: "Coursera", tags: ["Architecture"], time: "4 Weeks", level: "Advanced", best: true },
    { id: 2, title: "React Advanced Patterns", platform: "Frontend Masters", tags: ["React"], time: "2 Weeks", level: "Intermediate", best: false },
    { id: 3, title: "DSA Mastery: A-Z", platform: "Udemy", tags: ["Algorithms"], time: "8 Weeks", level: "All Levels", best: true }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
       <header className="mb-12">
        <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Expand your <span className="text-cyan-400 font-brand">INTELLIGENCE</span></h2>
        <p className="text-slate-400 max-w-2xl font-medium tracking-tight">Based on your career momentum, we recommend these curated paths.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {courses.map(course => (
          <div key={course.id} className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl relative">
            {course.best && <span className="absolute -top-3 left-6 px-3 py-1 bg-cyan-500 text-black text-[10px] font-black uppercase rounded-full">Top Match</span>}
            <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">{course.platform}</p>
            <h3 className="text-xl font-bold text-white mb-6 leading-tight">{course.title}</h3>
            <div className="flex justify-between text-xs text-slate-500 font-bold uppercase tracking-tighter">
              <span className="flex items-center gap-1"><Clock size={12}/> {course.time}</span>
              <span className="flex items-center gap-1"><BarChart size={12}/> {course.level}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// --- 4. MAIN COMPONENT ---
const LearningGuide = () => {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Skills");
  const [view, setView] = useState('guide'); 

  if (view === 'launch') return <RocketLaunch onComplete={() => setView('courses')} />;

  return (
    <div className="min-h-screen bg-[#030303] text-slate-200">
      <DashboardNavbar />
      
      {view === 'courses' ? (
        <UpskillingCourses />
      ) : (
        <main className="pt-32 pb-40 px-4 md:px-8 max-w-5xl mx-auto relative">
           <header className="text-center mb-16">
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.4em] mb-4 block">AI Learning Guide</motion.span>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">Not sure what to learn next?</h1>
            <p className="text-slate-500 max-w-xl mx-auto font-medium">Ask Thrive anything. your learning path updates as you grow.</p>
          </header>

          <section className="relative z-20 max-w-3xl mx-auto">
            <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-2 shadow-2xl">
              <div className="relative flex items-center p-4">
                <Search className="absolute left-8 w-5 h-5 text-slate-500" />
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search skills, courses..." className="w-full bg-white/[0.05] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white outline-none focus:border-cyan-500/30 transition-all"/>
              </div>
              <div className="px-6 pb-8">
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex items-start gap-4 hover:bg-white/[0.05] transition-all cursor-pointer">
                  <div className="p-3 bg-purple-500/10 rounded-xl"><Sparkles className="w-5 h-5 text-purple-400" /></div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">Recommended Skill focus</h4>
                    <p className="text-xs text-slate-500 leading-relaxed italic">"Improving **System Design** will unlock senior roles."</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* MENTOR CHARACTER: Properly Centered for Dark Astronaut  */}
          <div className="fixed bottom-0 right-0 w-[450px] h-[550px] pointer-events-none z-10">
            <Canvas camera={{ position: [0, 0, 10], fov: 35 }}>
              <ambientLight intensity={0.7} />
              <Suspense fallback={null}>
                <MentorCharacter />
                <ContactShadows position={[0, -2.8, 0]} opacity={0.4} scale={10} blur={2.5} far={4.5} />
                <Environment preset="city" />
              </Suspense>
            </Canvas>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }} className="absolute top-1/3 left-0 bg-white text-black px-6 py-4 rounded-[2rem] rounded-bl-none shadow-2xl max-w-[200px] border-l-4 border-cyan-500">
              <p className="text-[11px] font-black leading-tight tracking-tight uppercase">"The stars align with your progress, Alex."</p>
            </motion.div>
          </div>

          <div className="mt-20 flex justify-center">
            <button onClick={() => setView('launch')} className="bg-cyan-500 hover:bg-cyan-400 text-black px-12 py-5 rounded-full font-black text-sm tracking-widest uppercase transition-all shadow-[0_0_40px_rgba(34,211,238,0.4)] transform active:scale-95">
              Apply Learning Plan
            </button>
          </div>
        </main>
      )}
    </div>
  );
};

export default LearningGuide;