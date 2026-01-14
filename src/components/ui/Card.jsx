import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', glowColor = 'cyan' }) => {
  const glowColors = {
    cyan: 'hover:shadow-cyan-500/10',
    amber: 'hover:shadow-amber-500/10',
    purple: 'hover:shadow-purple-500/10'
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`bg-[#1A1D24] rounded-3xl border border-white/5 p-8 transition-all hover:border-white/10 hover:shadow-2xl ${glowColors[glowColor]} ${className}`}
    >
      {children}
    </motion.div>
  );
};