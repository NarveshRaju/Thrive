import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Users, Zap, Target } from 'lucide-react';
import { Container } from '../layout/Container';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const GamificationSection = () => {
  const achievements = [
    { icon: Trophy, title: 'Career Explorer', description: 'Discovered 5+ career paths', color: 'amber' },
    { icon: Award, title: 'Resume Master', description: 'Achieved 90+ ATS score', color: 'purple' },
    { icon: Target, title: 'Interview Ready', description: 'Completed 10 mock interviews', color: 'cyan' },
    { icon: Zap, title: 'Skill Builder', description: 'Completed a 12-week roadmap', color: 'purple' }
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0E1116] via-transparent to-transparent" />
      
      <Container className="relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge color="amber" className="mb-6">
            <Trophy className="w-3 h-3 mr-1" />
            Gamification & Community
          </Badge>
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6">
            Level Up Your Career
            <br />
            <span className="text-amber-400">With XP & Achievements</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Turn your career journey into an engaging experience. Earn XP, unlock achievements, and connect with a community of career seekers.
          </p>
        </motion.div>

        {/* Achievement Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card glowColor={achievement.color} className="h-full text-center">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${
                  achievement.color === 'amber' ? 'from-amber-500 to-orange-600' :
                  achievement.color === 'purple' ? 'from-purple-500 to-pink-600' :
                  'from-cyan-500 to-blue-600'
                } flex items-center justify-center mx-auto mb-4`}>
                  <achievement.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold mb-2">{achievement.title}</h3>
                <p className="text-sm text-gray-400">{achievement.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Community Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            { icon: Users, value: '10,000+', label: 'Active Career Seekers', color: 'cyan' },
            { icon: Trophy, value: '50,000+', label: 'Achievements Unlocked', color: 'amber' },
            { icon: Zap, value: '2M+', label: 'XP Points Earned', color: 'purple' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card glowColor={stat.color}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                    stat.color === 'amber' ? 'from-amber-500 to-orange-600' :
                    stat.color === 'purple' ? 'from-purple-500 to-pink-600' :
                    'from-cyan-500 to-blue-600'
                  } flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

