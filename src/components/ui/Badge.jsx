import React from 'react';

export const Badge = ({ children, color = 'purple', className = '' }) => {
  const colors = {
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${colors[color]} ${className}`}>
      {children}
    </span>
  );
};