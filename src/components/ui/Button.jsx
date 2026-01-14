import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-[#EA580C] text-white hover:bg-[#EA580C]/90 hover:shadow-lg hover:shadow-[#EA580C]/20',
    secondary: 'bg-white/5 text-white border border-white/10 hover:bg-white/10',
    ghost: 'text-gray-400 hover:text-white'
  };

  return (
    <button 
      className={`px-6 py-3 rounded-full font-semibold text-sm transition-all ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};