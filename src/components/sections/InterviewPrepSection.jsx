import React from 'react';
import { motion } from 'framer-motion';
import { Mic, MessageSquare, CheckCircle2, AlertCircle, Star } from 'lucide-react';
import { Container } from '../layout/Container';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const InterviewPrepSection = () => {
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
            <Card glowColor="cyan">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                      <Mic className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold">Mock Interview Session</h4>
                      <p className="text-sm text-gray-500">Technical + Behavioral</p>
                    </div>
                  </div>
                  <Badge color="cyan">Live</Badge>
                </div>

                {/* Interview Feedback */}
                <div className="space-y-3">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 p-4 bg-[#0E1116] rounded-xl border border-green-500/20"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-400">Strong technical explanation</p>
                      <p className="text-xs text-gray-500 mt-1">You clearly explained the algorithm complexity</p>
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
                      <p className="text-sm font-medium text-amber-400">Improve STAR method usage</p>
                      <p className="text-xs text-gray-500 mt-1">Add more specific examples in behavioral answers</p>
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
                      <p className="text-sm font-medium text-green-400">Excellent body language</p>
                      <p className="text-xs text-gray-500 mt-1">Maintained eye contact and confident posture</p>
                    </div>
                  </motion.div>
                </div>

                {/* Score */}
                <div className="pt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-400">Overall Score</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className={`w-4 h-4 ${i <= 4 ? 'text-cyan-400 fill-cyan-400' : 'text-gray-600'}`} />
                      ))}
                      <span className="text-cyan-400 font-bold ml-2">4.2/5</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '84%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2 }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
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
            <Badge color="cyan" className="mb-6">
              <Mic className="w-3 h-3 mr-1" />
              Interview Prep
            </Badge>
            
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6">
              AI Mock Interviews
              <br />
              <span className="text-cyan-400">Practice Makes Perfect</span>
            </h2>
            
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              Practice with AI-powered mock interviews covering both technical and behavioral questions. Get instant feedback, scoring, and personalized tips to improve your performance.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {[
                'AI-powered mock interviews (technical + behavioral)',
                'Real-time feedback and scoring',
                'Personalized improvement suggestions',
                'Industry-specific question banks',
                'Video analysis and body language tips'
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Stat */}
            <div className="bg-[#1A1D24] rounded-2xl p-6 border border-white/5">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-cyan-400">2.5x</div>
                <div className="text-gray-400">
                  <p className="font-semibold text-white">Higher interview success rate</p>
                  <p className="text-sm">for users who practice regularly</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </Container>
    </section>
  );
};

