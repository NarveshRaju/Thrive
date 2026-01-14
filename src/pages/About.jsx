import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../components/layout/Container';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { GradientDivider } from '../components/ui/GradientDivider';

export const About = () => (
  <div className="pt-32 pb-20">
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <Badge color="purple" className="mb-6">About Us</Badge>
        <h1 className="text-5xl lg:text-6xl font-bold mb-6">
          Building the future of
          <br />
          <span className="text-amber-400">creative technology</span>
        </h1>
        <p className="text-xl text-gray-400 mb-12">
          Founded in 2024, Nebula was born from a simple belief: the best creative tools should be powerful yet invisible, enabling creators to focus on what truly matters.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card>
            <div className="text-4xl font-bold text-cyan-400 mb-2">50K+</div>
            <div className="text-gray-400">Active Users</div>
          </Card>
          <Card>
            <div className="text-4xl font-bold text-purple-400 mb-2">120+</div>
            <div className="text-gray-400">Countries</div>
          </Card>
          <Card>
            <div className="text-4xl font-bold text-amber-400 mb-2">99.9%</div>
            <div className="text-gray-400">Uptime</div>
          </Card>
        </div>

        <GradientDivider />

        <div className="py-16 space-y-8">
          <h2 className="text-3xl font-bold">Our Mission</h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            We're on a mission to democratize creative technology. By combining intuitive design with powerful functionality, we enable teams of all sizes to bring their boldest ideas to life.
          </p>
        </div>
      </motion.div>
    </Container>
  </div>
);