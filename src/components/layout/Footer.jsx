import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Twitter, Github, Linkedin } from 'lucide-react';
import { Container } from './Container';

export const Footer = () => (
  <footer className="bg-[#0E1116] border-t border-white/5 py-12">
    <Container>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">NEBULA</span>
          </div>
          <p className="text-sm text-gray-400">
            Building the future of creative technology
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold mb-4">Product</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Connect</h4>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-white/5 text-center text-sm text-gray-500">
        © 2026 Nebula. All rights reserved.
      </div>
    </Container>
  </footer>
);