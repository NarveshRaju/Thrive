import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Globe, TrendingUp } from 'lucide-react';
import { Container } from '../layout/Container';
import { Card } from '../ui/Card';

export const FeatureCards = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built for speed with optimized performance and instant feedback.',
      color: 'amber'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and compliance with industry standards.',
      color: 'cyan'
    },
    {
      icon: Globe,
      title: 'Global Scale',
      description: 'Deploy worldwide with our distributed infrastructure.',
      color: 'purple'
    },
    {
      icon: TrendingUp,
      title: 'Analytics Dashboard',
      description: 'Real-time insights and comprehensive reporting tools.',
      color: 'cyan'
    }
  ];

  return (
    <section className="py-32 bg-[#0E1116]">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Everything you need to
            <br />
            <span className="text-cyan-400">build at scale</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Powerful features designed for modern teams who ship fast
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card glowColor={feature.color}>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${
                  feature.color === 'amber' ? 'from-amber-500 to-orange-600' :
                  feature.color === 'cyan' ? 'from-cyan-500 to-blue-600' :
                  'from-purple-500 to-pink-600'
                } flex items-center justify-center mb-6`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
