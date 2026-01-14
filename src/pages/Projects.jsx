import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Container } from '../components/layout/Container';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

export const Projects = () => {
  const projects = [
    {
      title: 'HYBRID STATE OF MIND',
      tags: ['Community', 'Web Design', 'Visual Identity', 'Creative Direction'],
      color: 'purple'
    },
    {
      title: 'ZUDOL & ITS MICROBRANDS',
      tags: ['B2B SaaS', 'Web Design', 'Design Systems', 'Creative Direction', 'Branding'],
      color: 'purple'
    },
    {
      title: 'FINMILL',
      tags: ['Event', 'Web Design', 'Creative Direction', 'Brand Strategy'],
      color: 'purple',
      featured: true
    },
    {
      title: 'AETHER',
      tags: ['AI/ML', 'Visual Design', 'Brand Identity'],
      color: 'purple'
    }
  ];

  return (
    <div className="pt-32 pb-20">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <Badge color="amber" className="mb-6">Projects</Badge>
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">
            Helping brands thrive in
            <br />
            <span className="text-amber-400">the digital world</span>
          </h1>
        </motion.div>

        <div className="space-y-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={project.featured ? 'border-amber-500/20' : ''}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, i) => (
                        <Badge key={i} color={project.color}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </div>
  );
};