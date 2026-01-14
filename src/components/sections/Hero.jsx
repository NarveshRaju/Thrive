import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Brain, Target, Zap } from 'lucide-react';
import { Container } from '../layout/Container';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const HeroSection = () => {
  // Generate stars for galaxy effect
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 3,
  }));

  return (
    <section id="hero-section" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#030303]">
      {/* Haze Purple Overlay */}
      <div className="absolute inset-0 bg-[#6B46C1]/10" />
      
      {/* Galaxy Stars */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: star.delay,
            }}
          />
        ))}
      </div>

      {/* Meteors */}
      {Array.from({ length: 3 }, (_, i) => (
        <motion.div
          key={`meteor-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${20 + i * 30}%`,
            top: `${10 + i * 15}%`,
          }}
          animate={{
            y: ['0vh', '100vh'],
            x: [0, 100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 2,
            ease: 'linear',
          }}
        />
      ))}
      
      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Product Name - Thrive */}
          <h1 className="flex flex-col items-center mb-6">
            <span className="font-brand text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-white mb-2">
              THRIVE
            </span>
            <span className="text-2xl md:text-3xl font-light text-slate-500 tracking-tight ">
              Your AI Career Twin. Built to Get You Hired
            </span>
          </h1>
          
          {/* Main Tagline */}
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-8 leading-[1.1] text-gray-200 hidden">
            Your AI Career Twin.
            <br />
            <span className="text-white">Built to Get You Hired</span>
          </h2>
        
          {/* Subheadline */}
          <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Thrive is an intelligent career companion that helps you plan, build, and accelerate your career using AI-powered mentorship.
          </p>

        {/* Value Props - Quick Scan */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-12 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-400" />
            <span>Discover Your Path</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Build Better Resumes</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Ace Interviews</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/login">
            <Button className="flex items-center space-x-2 px-8 py-4 text-base">
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Button variant="secondary" className="px-8 py-4 text-base">
            See How It Works
          </Button>
        </div>

        {/* Social Proof */}
        <div className="mt-16 text-sm text-gray-500">
          Trusted by 10,000+ career seekers worldwide
        </div>
      </motion.div>
    </Container>
  </section>
  );
};