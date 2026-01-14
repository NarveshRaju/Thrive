import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Play } from 'lucide-react';
import { Container } from '../layout/Container';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const Hero = () => (
  <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-transparent" />
    <div className="absolute inset-0" style={{
      backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)'
    }} />
    
    <Container className="relative z-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Badge color="purple" className="mb-6">
          <Sparkles className="w-3 h-3 mr-1" />
          Now in Beta
        </Badge>
        
        <h1 className="text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
          CREATE WITH
          <br />
          <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-transparent bg-clip-text">
            MOTION
          </span>
        </h1>
        
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Design, code, and animate — then ship anywhere. The future of creative technology starts here.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button className="flex items-center space-x-2">
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="secondary" className="flex items-center space-x-2">
            <Play className="w-4 h-4" />
            <span>Watch Demo</span>
          </Button>
        </div>

        <div className="mt-16 text-sm text-gray-500">
          Trusted by teams at leading companies
        </div>
      </motion.div>
    </Container>
  </section>
);