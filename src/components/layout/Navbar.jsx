import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Zap, Menu, X, Search, Bell, User } from 'lucide-react';
import { Container } from './Container';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  const { scrollY } = useScroll();

  // Detect scroll position to show/hide logo
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero-section');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const scrollPosition = window.scrollY + window.innerHeight * 0.2;
        setShowLogo(scrollPosition > heroBottom);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Features', path: '/features' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' },
  ];

  // Dashboard Navbar - No background, glassmorphism on elements only
  if (isDashboard) {
    return (
      <nav className="fixed top-0 w-full z-50 px-4 md:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="font-brand text-xl text-white tracking-[0.3em] group-hover:text-orange-500 transition-colors hidden sm:block">
              THRIVE
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-orange-600 shadow-[0_0_10px_rgba(234,88,12,0.5)]" />
          </Link>
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl py-1.5 pl-10 pr-4 text-sm text-slate-200 focus:border-orange-500/50 outline-none w-64 transition-all"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-400 hover:text-white bg-white/5 backdrop-blur-md border border-white/10 rounded-lg hover:bg-white/10 transition-all">
            <Bell className="w-5 h-5" />
          </button>
          <div className="h-8 w-[1px] bg-white/10 mx-2" />
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full pl-2 pr-4 py-1 hover:bg-white/10 transition-all cursor-pointer">
            <div className="w-7 h-7 bg-orange-600 rounded-full flex items-center justify-center text-black font-bold text-xs">A</div>
            <span className="text-sm font-medium text-slate-200">Alex</span>
          </div>
        </div>
      </nav>
    );
  }

  // Landing Page Navbar - Completely transparent with glassmorphism buttons
  return (
    <nav className="fixed top-0 w-full z-50">
      <Container>
        <div className="flex items-center h-16">
          {/* Logo - Slides in on scroll */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ 
              x: showLogo ? 0 : -100, 
              opacity: showLogo ? 1 : 0 
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
            className="overflow-hidden"
          >
            <Link to="/" className="flex items-center gap-3 group">
              <span className="font-brand text-xl text-white tracking-[0.3em] group-hover:text-[#EA580C] transition-colors whitespace-nowrap">
                THRIVE
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#EA580C] shadow-[0_0_10px_rgba(234,88,12,0.5)]" />
            </Link>
          </motion.div>

          {/* Navigation Links with glassmorphism effect */}
          <div className={`hidden md:flex items-center space-x-3 flex-1 ${showLogo ? 'ml-8' : 'justify-center'}`}>
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all backdrop-blur-md border ${
                  location.pathname === link.path
                    ? 'text-white bg-white/10 border-white/20 shadow-lg'
                    : 'text-[#94A3B8] bg-white/5 border-white/10 hover:text-white hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4 ml-auto">
            <Link
              to="/login"
              className="px-5 py-2 text-sm font-medium text-gray-300 bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
            >
              Sign In
            </Link>
            <button className="px-5 py-2 bg-[#EA580C] backdrop-blur-md text-white text-sm font-semibold rounded-full hover:bg-[#EA580C]/90 hover:shadow-lg hover:shadow-[#EA580C]/20 border border-[#EA580C]/20 transition-all">
              Get Started
            </button>
          </div>

          <button
            className="md:hidden text-gray-400 p-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg hover:bg-white/10 transition-all"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 space-y-3 animate-fade-in">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-lg backdrop-blur-md border transition-all ${
                  location.pathname === link.path
                    ? 'text-white bg-white/10 border-white/20'
                    : 'text-gray-400 bg-white/5 border-white/10 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-gray-400 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg hover:text-white hover:bg-white/10 transition-all"
            >
              Sign In
            </Link>
          </div>
        )}
      </Container>
    </nav>
  );
};

export default Navbar;
