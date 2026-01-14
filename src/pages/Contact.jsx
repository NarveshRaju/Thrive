import React from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { Container } from '../components/layout/Container';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Contact = () => (
  <div className="pt-32 pb-20">
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <Badge color="cyan" className="mb-6">Contact</Badge>
        <h1 className="text-5xl lg:text-6xl font-bold mb-6">
          Let's build something
          <br />
          <span className="text-cyan-400">amazing together</span>
        </h1>
        <p className="text-xl text-gray-400 mb-12">
          Have a project in mind? We'd love to hear about it.
        </p>

        <Card>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-[#0E1116] border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-[#0E1116] border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                rows="6"
                className="w-full px-4 py-3 bg-[#0E1116] border border-white/10 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                placeholder="Tell us about your project..."
              />
            </div>

            <Button className="w-full flex items-center justify-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Send Message</span>
            </Button>
          </form>
        </Card>

        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">Or reach us directly</p>
          <a href="mailto:hello@nebula.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            hello@nebula.com
          </a>
        </div>
      </motion.div>
    </Container>
  </div>
);