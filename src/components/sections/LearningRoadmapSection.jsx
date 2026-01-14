import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Target, TrendingUp, CheckCircle2, Award } from 'lucide-react';
import { Container } from '../layout/Container';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const LearningRoadmapSection = () => {
  const roadmapFeatures = [
    'Personalized 12-week skill-building plans',
    'Automated skill gap analysis',
    'XP & progress tracking with milestones',
    'Adaptive learning paths that adjust to your pace'
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0E1116] via-transparent to-transparent" />
      
      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <Badge color="purple" className="mb-6">
              <BookOpen className="w-3 h-3 mr-1" />
              Learning Roadmap
            </Badge>
            
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6">
              Personalized Learning
              <br />
              <span className="text-purple-400">12-Week Plans</span>
            </h2>
            
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              No more guessing what to learn next. Thrive creates personalized 12-week learning roadmaps based on your career goals, tracks your XP progress, and identifies skill gaps automatically.
            </p>

            {/* Feature List */}
            <div className="space-y-4 mb-8">
              {roadmapFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Stat */}
            <div className="flex items-center gap-4 text-sm">
              <div className="text-3xl font-bold text-purple-400">12 weeks</div>
              <div className="text-gray-400">Average time to career readiness</div>
            </div>
          </motion.div>

          {/* Right: Visual Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 relative"
          >
            <Card glowColor="purple">
              <div className="space-y-6">
                {/* Week Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-400">Week 4 of 12</span>
                    <span className="text-sm font-bold text-purple-400">1,250 XP</span>
                  </div>
                  <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '33%' }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-600"
                    />
                  </div>
                </div>

                {/* Skill Milestones */}
                {[
                  { skill: 'React Fundamentals', progress: 85, icon: Target, color: 'purple' },
                  { skill: 'API Integration', progress: 60, icon: TrendingUp, color: 'cyan' },
                  { skill: 'System Design', progress: 40, icon: Award, color: 'amber' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="bg-[#0E1116] rounded-2xl p-4 border border-white/5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${
                          item.color === 'purple' ? 'from-purple-500 to-pink-600' :
                          item.color === 'cyan' ? 'from-cyan-500 to-blue-600' :
                          'from-amber-500 to-orange-600'
                        } flex items-center justify-center`}>
                          <item.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-sm">{item.skill}</span>
                      </div>
                      <span className="text-xs font-bold text-gray-400">{item.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        className={`h-full bg-gradient-to-r ${
                          item.color === 'purple' ? 'from-purple-500 to-pink-600' :
                          item.color === 'cyan' ? 'from-cyan-500 to-blue-600' :
                          'from-amber-500 to-orange-600'
                        }`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

        </div>
      </Container>
    </section>
  );
};

