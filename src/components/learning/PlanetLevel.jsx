import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CheckCircle2, Clock, Trophy } from 'lucide-react';

export const PlanetLevel = ({ level, index, onClick }) => {
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
      {/* Planet Sphere with Ambient Animations */}
      <motion.div
        whileHover={{ scale: level.locked ? 1 : 1.1 }}
        whileTap={{ scale: level.locked ? 1 : 0.95 }}
        onClick={onClick}
        className={`
          relative w-32 h-32 rounded-full cursor-pointer transition-opacity duration-500
          ${level.locked ? 'opacity-40 grayscale' : 'opacity-100'}
          ${level.completed ? 'ring-4 ring-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)]' : ''}
        `}
        animate={level.completed ? {} : level.locked ? {} : {
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 3,
          repeat: level.locked ? 0 : Infinity,
          ease: 'easeInOut'
        }}
      >
        {/* Cinematic Atmospheric Glow */}
        {!level.locked && (
          <motion.div
            className={`absolute inset-0 rounded-full bg-gradient-to-r ${level.color} blur-2xl opacity-50`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          />
        )}

        {/* High-Contrast Planet Body */}
        <div className={`
          relative w-full h-full rounded-full bg-gradient-to-br ${level.color}
          flex items-center justify-center text-4xl font-bold shadow-inner
          border-4 ${level.locked ? 'border-gray-700 bg-slate-900' : 'border-white/20'}
        `}>
          {level.locked ? (
            <Lock className="w-12 h-12 text-gray-400" />
          ) : level.completed ? (
            <CheckCircle2 className="w-12 h-12 text-white" />
          ) : (
            <span className="text-white opacity-80 font-brand uppercase">{level.name[0]}</span>
          )}
        </div>

        {/* SATURN-SPECIFIC: Orbital Ring System */}
        {!level.locked && level.name === 'SATURN' && (
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-12 border-4 border-purple-400/30 rounded-full transform -rotate-12 blur-[1px]" />
          </div>
        )}
      </motion.div>

      {/* Narrative Labels */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.15 + 0.2 }}
        className="mt-6 text-center"
      >
        <h3 className="text-xl font-bold text-white mb-1 uppercase tracking-tighter">{level.name}</h3>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">{level.subtitle}</p>
        
        {/* Difficulty Badge */}
        <div className={`
          inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase mt-3 tracking-tighter
          ${level.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
            level.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
            level.difficulty === 'Hard' ? 'bg-orange-500/20 text-orange-400' :
            'bg-red-500/20 text-red-400'
          }
        `}>
          {level.difficulty}
        </div>
      </motion.div>

      {/* Immersive Glass Info Panel */}
      <AnimatePresence>
        {isHovered && !level.locked && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute top-full mt-4 w-80 bg-black/60 backdrop-blur-3xl rounded-[2rem] p-6 border border-white/10 shadow-2xl z-50 pointer-events-none"
          >
            <h4 className="text-lg font-bold text-white mb-3">Mission Briefing</h4>
            
            <div className="mb-4">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-3">Topics Covered</p>
              <div className="space-y-2">
                {level.topics.map((topic, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_cyan]" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Meta Stats */}
            <div className="flex items-center gap-4 mb-6 text-xs text-gray-400 font-bold uppercase">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>{level.estimatedTime}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                <span>{level.badge}</span>
              </div>
            </div>

            <button className="w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase hover:bg-cyan-400 transition-all shadow-lg active:scale-95">
              {level.completed ? 'Review Archive' : 'Initiate Mission'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};