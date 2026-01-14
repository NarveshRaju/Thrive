import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../layout/Container';
import { Badge } from '../ui/Badge';

export const DashboardPreview = () => (
  <section className="py-32 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-t from-[#0E1116] via-transparent to-transparent" />
    
    <Container className="relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
          Unleash the power of
          <br />
          <span className="text-amber-400">intuitive finance</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-3xl mx-auto">
          Say goodbye to outdated financial tools. Every business owner can now manage like a pro. Simple. Intuitive. Never boring.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        <div className="bg-gradient-to-br from-[#1A1D24] to-[#0E1116] rounded-3xl border border-white/5 p-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#0E1116] rounded-2xl p-6 border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">Total Today</span>
                <Badge color="amber">+23%</Badge>
              </div>
              <div className="text-3xl font-bold">$1,036<span className="text-gray-500 text-xl">.62</span></div>
            </div>
            
            <div className="bg-[#0E1116] rounded-2xl p-6 border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">Total spend</span>
                <Badge color="cyan">+8%</Badge>
              </div>
              <div className="text-3xl font-bold">$244<span className="text-gray-500 text-xl">.32</span></div>
            </div>

            <div className="bg-[#0E1116] rounded-2xl p-6 border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">Profit margin</span>
                <Badge color="purple">72%</Badge>
              </div>
              <div className="text-3xl font-bold">$1,870<span className="text-gray-500 text-xl">.00</span></div>
            </div>
          </div>

          <div className="bg-[#0E1116] rounded-2xl p-6 border border-white/5 h-64 flex items-end">
            <div className="w-full h-full relative">
              <svg className="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,150 Q100,120 200,130 T400,100 T600,90 T800,80"
                  stroke="#06B6D4"
                  strokeWidth="3"
                  fill="none"
                />
                <path
                  d="M0,150 Q100,120 200,130 T400,100 T600,90 T800,80 L800,200 L0,200 Z"
                  fill="url(#chartGradient)"
                />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>
    </Container>
  </section>
);