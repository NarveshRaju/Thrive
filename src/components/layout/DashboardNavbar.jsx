import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, Bell, User, Sparkles, 
  FileText, BookOpen, Mic2, ChevronDown 
} from 'lucide-react';

const DashboardNavbar = () => {
  const location = useLocation();

  // Helper for active link styling
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'AI Career Path', path: '/career-path', icon: <Sparkles className="w-4 h-4" /> },
    { name: 'AI Resume Builder', path: '/resume-builder', icon: <FileText className="w-4 h-4" /> },
    { name: 'AI Learning Guide', path: '/learning-guide', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'AI Interview Prep', path: '/interview-prep', icon: <Mic2 className="w-4 h-4" /> },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl px-4 md:px-8 py-2.5 flex justify-between items-center">
      {/* 1. BRAND WORDMARK */}
      <div className="flex items-center gap-8">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <span className="font-brand text-lg text-white tracking-[0.25em] group-hover:text-orange-500 transition-colors">
            THRIVE
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-orange-600 shadow-[0_0_10px_rgba(234,88,12,0.5)]" />
        </Link>

        {/* 2. AI MODULE NAVIGATION */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all ${
                isActive(link.path)
                  ? 'bg-orange-600/10 text-orange-500 border border-orange-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {/* 3. SEARCH & USER UTILITIES */}
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-orange-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search cockpit..." 
            className="bg-white/5 border border-white/10 rounded-xl py-1.5 pl-10 pr-4 text-xs text-slate-200 focus:border-white/20 outline-none w-48 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 pl-4 border-l border-white/10">
          <button className="p-2 text-slate-400 hover:text-white relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-orange-500 rounded-full border border-black" />
          </button>
          
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full pl-1.5 pr-3 py-1 hover:bg-white/10 transition-all cursor-pointer group">
            <div className="w-7 h-7 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-black font-black text-[10px]">
              A
            </div>
            <span className="text-[11px] font-bold text-slate-200">Alex</span>
            <ChevronDown className="w-3 h-3 text-slate-500 group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;