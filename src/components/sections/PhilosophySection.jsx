import React from 'react';
import { motion } from 'framer-motion';
import { Star, Users, Shield } from 'lucide-react';
import { Container } from '../layout/Container';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const PhilosophySection = () => {
  const values = [
    { icon: Star, title: 'Innovation First', description: 'Pushing boundaries in everything we build' },
    { icon: Users, title: 'User Focused', description: 'Designed for humans, powered by technology' },
    { icon: Shield, title: 'Trust & Security', description: 'Your data safety is our top priority' }
  ];

  return (
    <section className="py-32 relative">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Badge color="cyan" className="mb-6">Our Philosophy</Badge>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Built for creators,
              <br />
              <span className="text-cyan-400">by creators</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              We believe the best tools are invisible. They empower you to focus on what matters most—bringing your ideas to life.
            </p>
            <Button>Learn Our Story</Button>
          </motion.div>

          <div className="space-y-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <value.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                      <p className="text-gray-400">{value.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};