import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, TrendingUp, MessageSquare } from 'lucide-react';
import { Container } from '../layout/Container';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const AIMentorSection = () => {
  const mentorFeatures = [
    {
      icon: Brain,
      title: 'Context-Aware AI Mentor',
      description: 'Your AI mentor understands your background, skills, and career goals. It learns from every interaction to provide personalized guidance that evolves with you.',
      stat: '95% accuracy',
      color: 'purple'
    },
    {
      icon: TrendingUp,
      title: 'Career Readiness Score',
      description: 'Get a real-time score that tracks your career readiness across skills, experience, and market fit. Know exactly where you stand and what to improve.',
      stat: 'Real-time tracking',
      color: 'cyan'
    },
    {
      icon: MessageSquare,
      title: 'Proactive Guidance & Nudges',
      description: 'Receive timely reminders, skill recommendations, and career opportunities. Your mentor doesn\'t wait—it actively helps you stay on track.',
      stat: 'Always available',
      color: 'purple'
    }
  ];

  return (
    <section className="py-32 bg-[#000000] relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent" />
      
      <Container className="relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <Badge color="purple" className="mb-6">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Mentor Powered
          </Badge>
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6">
            Your AI Career Twin
            <br />
            <span className="text-purple-400">Knows You Better</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Thrive's AI mentor is context-aware, tracks your Career Readiness Score, and provides proactive guidance—helping you make smarter career decisions every step of the way.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mentorFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <Card glowColor={feature.color} className="h-full">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${
                  feature.color === 'purple' 
                    ? 'from-purple-500 to-pink-600' 
                    : 'from-cyan-500 to-blue-600'
                } flex items-center justify-center mb-6`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Stat Badge */}
                <Badge color={feature.color}>
                  {feature.stat}
                </Badge>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-400">
            Your mentor remembers every conversation, tracks every milestone, and celebrates every win.
          </p>
        </motion.div>
      </Container>
    </section>
  );
};