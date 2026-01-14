import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Map, Target, TrendingUp, CheckCircle } from 'lucide-react';
import { Container } from '../layout/Container';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const CareerPathSection = () => {
  const pathFeatures = [
    'Visual career roadmaps with clear milestones',
    'Interactive skill trees showing required competencies',
    'Real-time salary & demand insights',
    'Market trend analysis and growth projections'
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0E1116] via-transparent to-transparent" />
      
      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Badge color="cyan" className="mb-6">
              <Compass className="w-3 h-3 mr-1" />
              Career Path Explorer
            </Badge>
            
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6">
              Career Path Explorer
              <br />
              <span className="text-cyan-400">Visual Roadmaps</span>
            </h2>
            
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              See your career journey mapped out visually. Explore skill trees, understand salary ranges, and get demand insights—all powered by real market data to help you make informed decisions.
            </p>

            {/* Feature List */}
            <div className="space-y-4 mb-8">
              {pathFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Stat */}
            <div className="flex items-center gap-4 text-sm">
              <div className="text-3xl font-bold text-cyan-400">250+</div>
              <div className="text-gray-400">Career paths mapped and analyzed</div>
            </div>
          </motion.div>

          {/* Right: Visual Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Card glowColor="cyan">
              <div className="space-y-6">
                {/* Mock Career Cards */}
                {[
                  { title: 'UX Designer', match: '94%', salary: '$85k-120k', icon: Target, color: 'cyan' },
                  { title: 'Product Manager', match: '89%', salary: '$95k-140k', icon: Map, color: 'purple' },
                  { title: 'Data Analyst', match: '86%', salary: '$70k-105k', icon: TrendingUp, color: 'amber' }
                ].map((career, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="bg-[#0E1116] rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
                          career.color === 'cyan' ? 'from-cyan-500 to-blue-600' :
                          career.color === 'purple' ? 'from-purple-500 to-pink-600' :
                          'from-amber-500 to-orange-600'
                        } flex items-center justify-center`}>
                          <career.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold">{career.title}</h4>
                          <p className="text-sm text-gray-500">{career.salary}</p>
                        </div>
                      </div>
                      <Badge color={career.color}>
                        {career.match} Match
                      </Badge>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: career.match }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        className={`h-full bg-gradient-to-r ${
                          career.color === 'cyan' ? 'from-cyan-500 to-blue-600' :
                          career.color === 'purple' ? 'from-purple-500 to-pink-600' :
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