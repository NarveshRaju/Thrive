import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { Container } from '../layout/Container';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const ResumeOptimizerSection = () => {
  return (
    <section className="py-32 bg-[#0E1116] relative overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Visual Mock */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <Card glowColor="amber">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold">Resume Analysis</h4>
                      <p className="text-sm text-gray-500">ATS Score: 87/100</p>
                    </div>
                  </div>
                  <Badge color="amber">Optimizing...</Badge>
                </div>

                {/* Analysis Items */}
                <div className="space-y-3">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 p-4 bg-[#0E1116] rounded-xl border border-green-500/20"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-400">Strong action verbs</p>
                      <p className="text-xs text-gray-500 mt-1">"Led", "Optimized", "Developed" - Great choices!</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="flex items-start gap-3 p-4 bg-[#0E1116] rounded-xl border border-amber-500/20"
                  >
                    <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-400">Add quantifiable results</p>
                      <p className="text-xs text-gray-500 mt-1">Include numbers: "Increased revenue by 25%"</p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex items-start gap-3 p-4 bg-[#0E1116] rounded-xl border border-green-500/20"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-400">Keywords optimized</p>
                      <p className="text-xs text-gray-500 mt-1">7/10 job posting keywords detected</p>
                    </div>
                  </motion.div>
                </div>

                {/* Progress */}
                <div className="pt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">ATS Compatibility</span>
                    <span className="text-amber-400 font-bold">87%</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '87%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2 }}
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-600"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <Badge color="amber" className="mb-6">
              <Zap className="w-3 h-3 mr-1" />
              Resume & ATS Optimizer
            </Badge>
            
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6">
              Resume & ATS Optimizer
              <br />
              <span className="text-amber-400">Get Past the Bots</span>
            </h2>
            
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              Beat applicant tracking systems with AI-powered optimization. Get real-time ATS scoring, job-specific keyword matching, and AI-rewritten bullet points that highlight your achievements.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {[
                'Real-time ATS scoring (0-100)',
                'Job-specific resume optimization',
                'AI bullet-point rewriting',
                'Keyword density analysis',
                'Format compatibility checks'
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  </div>
                  <span className="text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Stat */}
            <div className="bg-[#1A1D24] rounded-2xl p-6 border border-white/5">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-amber-400">3.2x</div>
                <div className="text-gray-400">
                  <p className="font-semibold text-white">Higher callback rate</p>
                  <p className="text-sm">for optimized resumes</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </Container>
    </section>
  );
};