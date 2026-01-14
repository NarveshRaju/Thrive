import React from 'react';
import { HeroSection } from '../components/sections/Hero';
import { AIMentorSection } from '../components/sections/AIMentorSection';
import { CareerPathSection } from '../components/sections/CareerPathSection';
import { ResumeOptimizerSection } from '../components/sections/ResumeOptimizerSection';
import { LearningRoadmapSection } from '../components/sections/LearningRoadmapSection';
import { InterviewPrepSection } from '../components/sections/InterviewPrepSection';
import { GamificationSection } from '../components/sections/GamificationSection';
import { FinalCTASection } from '../components/sections/CTASection';

export const Home = () => (
  <div className="pt-16">
    {/* Hero: Your AI Career Twin */}
    <HeroSection />
    
    {/* AI Mentor Explanation */}
    <AIMentorSection />
    
    {/* Career Path Explorer */}
    <CareerPathSection />
    
    {/* Resume & ATS Optimizer */}
    <ResumeOptimizerSection />
    
    {/* Learning Roadmap */}
    <LearningRoadmapSection />
    
    {/* Interview Prep */}
    <InterviewPrepSection />
    
    {/* Gamification & Community */}
    <GamificationSection />
    
    {/* Final CTA */}
    <FinalCTASection />
  </div>
);