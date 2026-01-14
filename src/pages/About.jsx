import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import { Target, ShieldCheck, Zap, Globe } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Target className="w-6 h-6 text-orange-500" />,
      title: "Visionary Intent",
      desc: "We don't just build tools; we build career-defining infrastructure for the digital age."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
      title: "Radical Trust",
      desc: "Your data and career path are treated with the highest level of security and integrity."
    }
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-slate-200 selection:bg-orange-500/30">
      <Navbar />
      
      {/* 1. HERO SECTION: "What is Thrive?" */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-orange-600/10 to-transparent blur-[120px] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-orange-500 font-black tracking-[0.3em] uppercase text-xs mb-4 block"
          >
            Our Mission
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tighter mb-8"
          >
            <span className="font-brand text-3xl md:text-4xl block mb-4">Career Intelligence</span>
            <span className="text-slate-500 italic font-light">Redefined.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 leading-relaxed font-medium"
          >
            Thrive is the world's first cinematic career OS. We bridge the gap between 
            ambition and achievement through high-fidelity data and intuitive motion design.
          </motion.p>
        </div>
      </section>

      {/* 2. CORE PHILOSOPHY: "Why does it exist?" */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-white tracking-tight">Built for the <br/> 1% of Hustlers.</h2>
              <p className="text-slate-400 leading-relaxed">
                The traditional professional landscape is cluttered with noise. Thrive exists 
                to filter the chaos into clarity. We believe that professional tools should 
                be as beautiful as the work you create.
              </p>
              <div className="h-[1px] w-24 bg-orange-600" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white/[0.03] border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl relative"
            >
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-600/20 blur-2xl rounded-full" />
              <blockquote className="text-xl text-white italic leading-snug">
                "Thrive isn't just a platform; it's a silent partner in your pursuit of excellence."
              </blockquote>
              <div className="mt-6 flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-800 rounded-full" />
                <div>
                  <p className="text-sm font-bold text-white">Chief Visionary</p>
                  <p className="text-xs text-slate-500 uppercase tracking-widest">Thrive Core</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. TRUST PILLARS: "Why trust Thrive?" */}
      <section className="py-20 px-6 bg-white/[0.01]">
        <div className="max-w-5xl mx-auto text-center mb-16">
          <h2 className="font-brand text-3xl md:text-4xl text-white mb-4">Foundation of Trust</h2>
          <p className="text-slate-500">Stability and transparency in every line of code.</p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((v, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="bg-[#0D0D0D] border border-white/5 p-10 rounded-3xl group transition-all hover:border-white/20"
            >
              <div className="mb-6 p-4 bg-white/5 w-fit rounded-2xl group-hover:bg-orange-600/10 transition-colors">
                {v.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{v.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {v.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. FINAL CTA */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-8 tracking-tighter">Ready to evolve?</h2>
          <button className="bg-white text-black px-10 py-4 rounded-full font-black hover:bg-orange-500 hover:text-white transition-all transform active:scale-95 shadow-2xl shadow-white/5">
            Join the Ecosystem
          </button>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 text-center text-[10px] text-slate-600 tracking-[0.4em] uppercase">
        Thrive Systems • 2026 Protocol
      </footer>
    </div>
  );
};

export default About;