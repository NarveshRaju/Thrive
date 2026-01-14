// src/pages/LearningGuide.jsx
import React from 'react';
import { motion } from 'framer-motion';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import { Sparkles, BookOpen, ChevronRight } from 'lucide-react';

const LearningGuide = () => {
  return (
    <div className="min-h-screen bg-[#030303] text-slate-200">
      <DashboardNavbar />

      <main className="pt-32 pb-20 px-4 md:px-8 max-w-5xl mx-auto">
        {/* Mentor Hero Section */}
        <section className="flex flex-col items-center text-center mb-16">
          <div className="w-48 h-48 mb-6 relative">
             {/* 3D Bird Animation Wrapper */}
             <motion.div 
               animate={{ y: [0, -10, 0] }} 
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="w-full h-full bg-cyan-500/5 rounded-full flex items-center justify-center border border-cyan-500/10 shadow-[0_0_50px_rgba(34,211,238,0.1)]"
             >
               <Sparkles className="w-12 h-12 text-cyan-400 opacity-50" />
             </motion.div>
             
             {/* Mentor Speech Bubble */}
             <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               className="absolute -right-20 top-4 bg-white text-black px-4 py-2 rounded-2xl rounded-bl-none text-[11px] font-bold shadow-2xl"
             >
               "Ready to level up, Alex?"
             </motion.div>
          </div>

          <h1 className="font-brand text-3xl md:text-5xl text-white mb-4 tracking-[0.2em]">
            LEARNING GUIDE
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto font-medium">
            I've mapped out a path to help you master <span className="text-cyan-400">Distributed Systems</span> based on your current skill gaps.
          </p>
        </section>

        {/* Skill Gap & Roadmap Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Skill Gaps */}
          <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 h-fit">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Growth Areas</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-300">System Design</span>
                  <span className="text-cyan-400">High Priority</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 w-1/3" />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Roadmap */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white/[0.03] border border-cyan-500/20 rounded-3xl p-6 flex items-center justify-between group cursor-pointer hover:bg-white/[0.05] transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold">01</div>
                <div>
                  <h4 className="text-white font-bold">Microservices Architecture</h4>
                  <p className="text-xs text-slate-500">Core principles and communication patterns.</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LearningGuide;