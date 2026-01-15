import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IndianRupee } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Map, Book, DollarSign, Users, Code, Database, 
  Palette, LineChart, Shield, X, ChevronRight, Star, Award, 
  Clock, Target, Briefcase, ArrowLeft, Sparkles, Zap, CheckCircle,
  AlertCircle, Loader2
} from 'lucide-react';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import '../styles/CareerPathRecommender.css';

const API_URL = 'http://localhost:3001/api';

const iconComponents = {
  Code, Database, Palette, Shield, Briefcase, LineChart
};

const CareerPathRecommender = () => {
  const navigate = useNavigate();
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [careerData, setCareerData] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAICareerPaths();
  }, []);

  const loadAICareerPaths = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Get user profile first
      const profileResponse = await fetch(`${API_URL}/profile/complete-profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const profileData = await profileResponse.json();
      setUserProfile(profileData);

      // Check if we have cached career paths
      if (profileData.aiInsights?.completeCareerPaths?.careers?.length > 0) {
        const cached = profileData.aiInsights.completeCareerPaths;
        const cacheAge = new Date() - new Date(profileData.aiInsights.careerPathsGeneratedAt);
        
        // Use cache if less than 24 hours old
        if (cacheAge < 24 * 60 * 60 * 1000) {
          console.log('✅ Using cached career paths');
          setCareerData(cached);
          setLoading(false);
          return;
        }
      }

      // Generate new AI career paths
      console.log('🤖 Generating new AI career paths...');
      const careerResponse = await fetch(`${API_URL}/profile/generate-complete-career-paths`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const careerResult = await careerResponse.json();

      if (careerResult.success) {
        setCareerData(careerResult);
      } else {
        throw new Error(careerResult.message || 'Failed to generate career paths');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading career paths:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-amber-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg mb-2">Analyzing your profile with AI...</p>
          <p className="text-gray-400 text-sm">Generating personalized career paths</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-white text-2xl font-bold mb-2">Unable to Load Career Paths</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 rounded-xl font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!careerData?.careers) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <p className="text-white">No career data available</p>
      </div>
    );
  }

  const userSkills = [
    ...(userProfile?.resumeData?.skills || []),
    ...(userProfile?.linkedinData?.skills || [])
  ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 12);

  return (
    <div className="solar-career-container">
      <DashboardNavbar />
      
      {/* Back Button */}
      <motion.button
        onClick={() => navigate('/dashboard')}
        className="fixed top-24 left-8 z-50 flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl text-white hover:bg-white/5 transition-all"
        whileHover={{ x: -5 }}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </motion.button>

      {/* Header */}
      <motion.div 
        className="solar-header"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="hero-title">Your Career Solar System</h1>
        
        {/* AI Personalized Message */}
        {careerData.personalizedMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto mb-6"
          >
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-amber-300 font-bold mb-2 flex items-center gap-2">
                    AI-Powered Recommendations
                    {careerData.topRecommendation && (
                      <span className="text-xs bg-amber-500/20 px-2 py-1 rounded-full">
                        Top Pick: {careerData.topRecommendation}
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {careerData.personalizedMessage}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <p className="hero-subtitle">
          Based on your profile, here are your top 5 personalized career paths
        </p>
        
        {/* User Skills Display */}
        {userSkills.length > 0 && (
          <motion.div 
            className="flex flex-wrap gap-2 justify-center mt-4 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {userSkills.map((skill, idx) => (
              <span 
                key={idx} 
                className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-xs text-amber-300"
              >
                {typeof skill === 'string' ? skill : skill.name || skill}
              </span>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Solar System */}
      <div className="solar-system">
        {/* Sun */}
        <motion.div
          className="sun"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div className="sun-sphere">
            <div className="sun-surface"></div>
          </div>
          <div className="sun-label">
            {userProfile?.careerProfile?.passion?.substring(0, 40) || 'Your Potential'}
          </div>
        </motion.div>

        {/* Horizontal Orbit Line */}
        <div className="orbit-line"></div>

        {/* Planets */}
        <div className="planets-orbit">
          {careerData.careers.map((career, index) => {
            const isAbove = index % 2 === 0;
            const IconComponent = iconComponents[career.icon] || Code;
            const isTopPick = career.title === careerData.topRecommendation;

            return (
              <motion.div
                key={career.id}
                className={`planet-group ${isAbove ? 'above' : 'below'}`}
                initial={{ opacity: 0, scale: 0, x: -100 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.3 + index * 0.15,
                  type: "spring",
                  stiffness: 80
                }}
              >
                {/* Vertical Connector */}
                <div className="planet-connector"></div>

                {/* Planet */}
                <motion.div
                  className={`planet-sphere ${career.planet} ${isTopPick ? 'top-pick-glow' : ''}`}
                  style={{
                    width: career.size,
                    height: career.size
                  }}
                  onClick={() => setSelectedCareer(career)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="planet-surface"></div>
                  <div className="planet-atmosphere"></div>
                  
                  {/* Match Score Badge */}
                  <div className={`absolute -top-2 -right-2 text-white text-[10px] font-bold px-2 py-1 rounded-full ${
                    career.matchScore >= 85 ? 'bg-green-500' :
                    career.matchScore >= 70 ? 'bg-amber-500' : 'bg-blue-500'
                  }`}>
                    {career.matchScore}%
                  </div>
                  
                  {/* Top Pick Star */}
                  {isTopPick && (
                    <motion.div
                      className="absolute -top-3 -left-3"
                      animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
                    </motion.div>
                  )}
                </motion.div>

                {/* Career Title */}
                <div className="career-title-label">
                  <h3 className="flex items-center gap-2">
                    {career.title}
                    {isTopPick && <Zap className="w-4 h-4 text-amber-400" />}
                  </h3>
                  <div className="mini-stats">
                    <span className="salary-badge">
  <IndianRupee size={12} />
  {career.salary ? 
    (career.salary.includes('LPA') ? 
      career.salary.split('-')[1]?.trim() : 
      career.salary.split(' - ')[1] || career.salary) 
    : 'N/A'}
</span>

                    <span className="growth-badge">
                      <TrendingUp size={12} />
                      {career.growth || 'N/A'}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Career Detail Modal */}
      <AnimatePresence>
        {selectedCareer && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCareer(null)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="modal-header">
                <div className="modal-title-section">
                  {React.createElement(iconComponents[selectedCareer.icon] || Code, { size: 40, color: "#f97316" })}
                  <div>
                    <div className="flex items-center gap-3">
                      <h2>{selectedCareer.title}</h2>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                        selectedCareer.matchScore >= 85 ? 'bg-green-500/20 text-green-400' :
                        selectedCareer.matchScore >= 70 ? 'bg-amber-500/20 text-amber-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {selectedCareer.matchScore}% Match
                      </span>
                      {selectedCareer.title === careerData.topRecommendation && (
                        <span className="bg-amber-500/20 text-amber-400 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" /> Top Pick
                        </span>
                      )}
                    </div>
                    <p className="modal-description">{selectedCareer.description}</p>
                  </div>
                </div>
                <button
                  className="close-btn"
                  onClick={() => setSelectedCareer(null)}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="modal-body">
                {/* Why This Matches You */}
                {selectedCareer.whyMatch && (
                  <div className="modal-section">
                    <h3>
                      <Sparkles color="#f97316" />
                      Why This Career Matches You
                    </h3>
                    <ul className="trends-list">
                      {selectedCareer.whyMatch.map((reason, idx) => (
                        <li key={idx}>
                          <CheckCircle size={18} color="#10b981" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Stats Section */}
                <div className="stats-grid">
                  <div className="stat-card">
                    <DollarSign size={24} color="#f97316" />
                    <h4>Salary Range</h4>
                    <p>{selectedCareer.salary}</p>
                  </div>
                  <div className="stat-card">
                    <TrendingUp size={24} color="#f97316" />
                    <h4>Job Growth</h4>
                    <p>{selectedCareer.growth}</p>
                  </div>
                  <div className="stat-card">
                    <Users size={24} color="#f97316" />
                    <h4>Market Demand</h4>
                    <p>{selectedCareer.demand}</p>
                  </div>
                  <div className="stat-card">
                    <Clock size={24} color="#f97316" />
                    <h4>Time to Job</h4>
                    <p>{selectedCareer.estimatedTimeToJob}</p>
                  </div>
                </div>

                {/* Skills Analysis */}
                <div className="modal-section">
                  <h3>
                    <Star color="#f97316" />
                    Skills Analysis
                  </h3>
                  
                  {selectedCareer.skillsYouHave && selectedCareer.skillsYouHave.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-400 mb-2">✅ Skills You Already Have:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCareer.skillsYouHave.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs border border-green-500/30">
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCareer.skillsToLearn && selectedCareer.skillsToLearn.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-400 mb-2">📚 Skills to Develop:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCareer.skillsToLearn.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-xs border border-amber-500/30">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Industry Trends */}
                {selectedCareer.industryTrends && (
                  <div className="modal-section">
                    <h3>
                      <TrendingUp color="#f97316" />
                      Industry Trends 2026
                    </h3>
                    <ul className="trends-list">
                      {selectedCareer.industryTrends.map((trend, idx) => (
                        <li key={idx}>
                          <ChevronRight size={18} color="#f97316" />
                          {trend}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Learning Roadmap */}
                {selectedCareer.roadmap && (
                  <div className="modal-section">
                    <h3>
                      <Map color="#f97316" />
                      Your Personalized Learning Roadmap
                    </h3>
                    <div className="roadmap">
                      {selectedCareer.roadmap.map((phase, idx) => (
                        <div key={idx} className="roadmap-phase">
                          <div className="phase-number">{idx + 1}</div>
                          <div className="phase-content">
                            <div className="phase-header">
                              <div>
                                <h4>{phase.phase}</h4>
                                <p className="text-xs text-gray-400 mt-1">{phase.description}</p>
                              </div>
                              <span className="phase-duration">
                                <Clock size={14} />
                                {phase.duration}
                              </span>
                            </div>
                            <div className="phase-topics">
                              {phase.topics.map((topic, topicIdx) => (
                                <span key={topicIdx} className="topic-tag">{topic}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Learning Resources */}
                {selectedCareer.learningResources && (
                  <div className="modal-section">
                    <h3>
                      <Book color="#f97316" />
                      Recommended Learning Resources
                    </h3>
                    <ul className="resources-list">
                      {selectedCareer.learningResources.map((resource, idx) => (
                        <li key={idx}>
                          <Award size={16} color="#f97316" />
                          {resource}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Next Steps */}
                {selectedCareer.nextSteps && (
                  <div className="modal-section">
                    <h3>
                      <Target color="#f97316" />
                      Your Next Steps
                    </h3>
                    <ul className="trends-list">
                      {selectedCareer.nextSteps.map((step, idx) => (
                        <li key={idx}>
                          <ChevronRight size={18} color="#10b981" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA Button */}
                <div className="modal-cta">
                  <motion.button
                    className="start-learning-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/learning-guide', { 
                      state: { 
                        careerPath: selectedCareer.title,
                        roadmap: selectedCareer.roadmap,
                        resources: selectedCareer.learningResources
                      }
                    })}
                  >
                    <Zap size={20} />
                    Start Learning Journey
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CareerPathRecommender;
