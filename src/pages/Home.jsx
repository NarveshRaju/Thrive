import React from 'react';
import { Hero } from '../components/sections/Hero';
import { FeatureCards } from '../components/sections/FeatureCards';
import { DashboardPreview } from '../components/sections/DashboardPreview';
import { IntegrationsGrid } from '../components/sections/IntegrationsGrid';
import { PhilosophySection } from '../components/sections/PhilosophySection';
import { CTASection } from '../components/sections/CTASection';

export const Home = () => (
  <div className="pt-16">
    <Hero />
    <FeatureCards />
    <DashboardPreview />
    <IntegrationsGrid />
    <PhilosophySection />
    <CTASection />
  </div>
);