import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Container } from '../layout/Container';
import { Button } from '../ui/Button';

export const CTASection = () => (
  <section className="py-32 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-cyan-500/10" />
    
    <Container className="relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h2 className="text-5xl lg:text-6xl font-bold mb-6">
          Ready to get started?
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
          Join thousands of teams building the future with Nebula
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button className="flex items-center space-x-2">
            <span>Start Free Trial</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="secondary">Schedule Demo</Button>
        </div>
      </motion.div>
    </Container>
  </section>
);