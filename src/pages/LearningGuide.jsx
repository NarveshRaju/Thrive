// src/pages/LearningGuide.jsx
import React, { Suspense, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import MentorCharacter from '../components/ui/MentorCharacter';
import { 
  Search, Sparkles, BookOpen, 
  Target, Zap, ChevronRight, 
  Terminal, BarChart3, Globe 
} from 'lucide-react';

const LearningGuide = () => {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Skills");

  const filters = ["Skills", "Courses", "Certifications", "Career Paths"];
  
  const quickActions = [
    { icon: <Terminal className="w-4 h-4" />, label: "Generate learning plan" },
    { icon: <BarChart3 className="w-4 h-4" />, label: "Compare certifications" },
    { icon: <Globe className="w-4 h-4" />, label: "Update skill progress" }
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-slate-200 overflow-x-hidden">
      <DashboardNavbar />

      <main className="pt-32 pb-20 px-4 md:px-8 max-w-5xl mx-auto relative">
        
        {/* 1. HEADER SECTION */}
        <header className="text-center mb-12">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.3em] mb-4 block"
          >
            AI Learning Guide
          </motion.span>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Not sure what to learn next — or why?
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto font-medium">
            Ask Thrive anything. From skill gaps to course recommendations, 
            your learning path updates as you grow.
          </p>
        </header>

        {/* 2. CENTRAL AI INPUT PANEL */}
        <section className="relative z-20 max-w-3xl mx-auto">
          <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-2 shadow-2xl">
            {/* Command Input */}
            <div className="relative flex items-center p-4">
              <Search className="absolute left-8 w-5 h-5 text-slate-500" />
              <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about skills, courses, certifications, or career goals..."
                className="w-full bg-white/[0.05] border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-white placeholder:text-slate-600 outline-none focus:border-cyan-500/30 focus:bg-white/10 transition-all shadow-inner"
              />
            </div>

            {/* Filter / Context Row */}
            <div className="flex flex-wrap gap-2 px-6 pb-6 pt-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
                    activeFilter === filter 
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
                    : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Contextual Results Area (Mocked for Interaction) */}
            <div className="px-6 pb-8 space-y-4">
              <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-start gap-4 hover:bg-white/[0.05] transition-colors cursor-pointer group">
                <div className="p-3 bg-purple-500/10 rounded-xl">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Recommended Skill focus</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    "You’re strong in fundamentals, but improving **system design** will unlock senior roles."
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-700 ml-auto group-hover:text-cyan-400 transition-colors" />
              </div>
            </div>
          </div>

          {/* Quick Actions Row */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, idx) => (
              <motion.button
                key={idx}
                whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.05)" }}
                className="flex items-center gap-3 px-5 py-4 bg-white/[0.02] border border-white/5 rounded-2xl text-[11px] font-bold text-slate-400 uppercase tracking-widest transition-all"
              >
                <span className="text-cyan-500">{action.icon}</span>
                {action.label}
              </motion.button>
            ))}
          </div>
        </section>

        {/* 3. ASTRONAUT MENTOR (Corner Floating) */}
        <div className="fixed bottom-0 right-0 w-[400px] h-[500px] pointer-events-none z-10">
          <Canvas camera={{ position: [0, 0, 10], fov: 35 }}>
            <ambientLight intensity={0.7} />
            <spotLight position={[10, 10, 10]} intensity={1} />
            <Suspense fallback={null}>
              <MentorCharacter />
              <ContactShadows position={[0, -2.8, 0]} opacity={0.4} scale={10} blur={2.5} far={4.5} />
              <Environment preset="city" />
            </Suspense>
          </Canvas>
          
          {/* Astronaut Quote Bubble */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="absolute top-1/4 left-0 bg-white text-black px-5 py-3 rounded-2xl rounded-bl-none shadow-2xl max-w-[180px]"
          >
            <p className="text-[11px] font-black leading-tight">
              "The stars align with your progress, Alex."
            </p>
          </motion.div>
        </div>

        {/* Primary CTA */}
        <div className="mt-20 flex justify-center pb-20">
          <button className="bg-cyan-500 hover:bg-cyan-400 text-black px-10 py-4 rounded-full font-black text-sm tracking-widest uppercase transition-all shadow-[0_0_30px_rgba(34,211,238,0.3)] transform active:scale-95">
            Apply Learning Plan
          </button>
        </div>
      </main>
    </div>
  );
};

export default LearningGuide;