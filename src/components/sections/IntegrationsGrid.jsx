import React from 'react';
import { motion } from 'framer-motion';
import { Users, Github, Palette, Layout, Layers, Code } from 'lucide-react';
import { Container } from '../layout/Container';

export const IntegrationsGrid = () => {
  const integrations = [
    { name: 'Slack', icon: Users },
    { name: 'GitHub', icon: Github },
    { name: 'Figma', icon: Palette },
    { name: 'Linear', icon: Layout },
    { name: 'Notion', icon: Layers },
    { name: 'VS Code', icon: Code }
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
            Integrates with your
            <br />
            <span className="text-purple-400">favorite tools</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Connect your workflow seamlessly
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {integrations.map((integration, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="bg-[#1A1D24] rounded-2xl border border-white/5 p-6 flex flex-col items-center justify-center space-y-3 hover:border-white/10 transition-all cursor-pointer"
            >
              <integration.icon className="w-8 h-8 text-gray-400" />
              <span className="text-sm font-medium">{integration.name}</span>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};