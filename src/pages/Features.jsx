import React from 'react';
import { motion } from 'framer-motion';
import { Zap, BarChart3, Shield, Globe, Code, Users, ArrowRight } from 'lucide-react';
import { Container } from '../components/layout/Container';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

export const Features = () => {
  const features = [
    {
      icon: Zap,
      title: 'Blazing Fast Performance',
      description: 'Optimized for speed with sub-100ms response times',
      color: 'amber'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Real-time insights and customizable dashboards',
      color: 'cyan'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'SOC 2 compliant with end-to-end encryption',
      color: 'purple'
    },
    {
      icon: Globe,
      title: 'Global CDN',
      description: 'Lightning-fast delivery across 150+ locations',
      color: 'cyan'
    },
    {
      icon: Code,
      title: 'Developer Friendly',
      description: 'RESTful APIs and comprehensive documentation',
      color: 'amber'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Built for modern distributed teams',
      color: 'purple'
    }
  ];

  return (
    <div className="pt-32 pb-20">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <Badge color="cyan" className="mb-6">Features</Badge>
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            Everything you need to
            <br />
            <span className="text-cyan-400">build faster</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A comprehensive suite of tools designed for modern product teams
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card glowColor={feature.color}>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${
                  feature.color === 'amber' ? 'from-amber-500 to-orange-600' :
                  feature.color === 'cyan' ? 'from-cyan-500 to-blue-600' :
                  'from-purple-500 to-pink-600'
                } flex items-center justify-center mb-6`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                <div className="mt-6">
                  <a href="#" className="text-sm font-medium text-cyan-400 hover:text-cyan-300 inline-flex items-center">
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </div>
  );
};