import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/DashboardNavbar";
import InterviewModal from '../pages/InterviewModal';
import {
  Target,
  Award,
  Zap,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Briefcase,
  GraduationCap,
  Code,
  Loader2,
  FileText,
  Linkedin,
  AlertCircle,
  Mic,
  Calendar,
  History,
  Clock,
  Rocket,
  Star,
  Globe,
  Compass,
  TrendingUp,
} from "lucide-react";

const API_URL = 'http://localhost:3001/api';

// Starfield Background Component
const StarfieldBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const stars = [];
    const numStars = 200;
    
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }
    
    let animationId;
    const animate = () => {
      ctx.fillStyle = 'rgba(3, 3, 3, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229, 229, 229, ${star.opacity})`;
        ctx.fill();
        
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};

// Orbital Ring Component
const OrbitalRing = ({ score, size = 180 }) => {
  const circumference = 2 * Math.PI * (size / 2 - 10);
  const progress = (score / 100) * circumference;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 10}
          stroke="rgba(229, 229, 229, 0.1)"
          strokeWidth="3"
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 10}
          stroke="rgba(229, 229, 229, 0.8)"
          strokeWidth="3"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{
            filter: "drop-shadow(0 0 8px rgba(229, 229, 229, 0.6))"
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="text-4xl font-bold text-white"
          >
            {score}
          </motion.div>
          <div className="text-xs text-stone-400 tracking-widest mt-1">READINESS</div>
        </div>
      </div>
      {/* Orbiting satellite */}
      <motion.div
        className="absolute w-3 h-3 bg-stone-200 rounded-full shadow-[0_0_12px_rgba(229,229,229,0.8)]"
        style={{
          left: '50%',
          top: '50%',
        }}
        animate={{
          x: [0, (size / 2 - 10) * Math.cos(0), (size / 2 - 10) * Math.cos(Math.PI / 2), (size / 2 - 10) * Math.cos(Math.PI), (size / 2 - 10) * Math.cos(3 * Math.PI / 2), 0],
          y: [-(size / 2 - 10), (size / 2 - 10) * Math.sin(0), (size / 2 - 10) * Math.sin(Math.PI / 2), (size / 2 - 10) * Math.sin(Math.PI), (size / 2 - 10) * Math.sin(3 * Math.PI / 2), -(size / 2 - 10)],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
};

// Planet Card Component
const PlanetCard = ({ title, value, subtitle, icon: Icon, delay, status = "complete" }) => {
  const planetColors = {
    complete: "rgba(229, 229, 229, 0.15)",
    active: "rgba(245, 245, 220, 0.15)",
    locked: "rgba(120, 120, 120, 0.1)",
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative group cursor-pointer"
    >
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity"
        style={{ background: planetColors[status] }}
      />
      
      {/* Planet body */}
      <div className="relative bg-black/40 backdrop-blur-sm border border-white/10 rounded-full aspect-square p-6 flex flex-col items-center justify-center text-center">
        <div className="mb-3 p-3 bg-white/5 rounded-full">
          <Icon className="w-6 h-6 text-stone-200" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
        <p className="text-xs text-stone-400 uppercase tracking-widest">{title}</p>
        {subtitle && (
          <p className="text-[10px] text-stone-500 mt-2">{subtitle}</p>
        )}
      </div>
      
      {/* Orbital rings */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
        <ellipse
          cx="50%"
          cy="50%"
          rx="48%"
          ry="20%"
          fill="none"
          stroke="rgba(229, 229, 229, 0.3)"
          strokeWidth="1"
        />
      </svg>
    </motion.div>
  );
};

// Mission Card Component
const MissionCard = ({ title, description, progress, icon: Icon, onClick }) => {
  return (
    <motion.div
      whileHover={{ x: 5 }}
      onClick={onClick}
      className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-5 cursor-pointer hover:border-white/20 transition-all group relative overflow-hidden"
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-10"
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, rgba(229,229,229,0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 100% 100%, rgba(229,229,229,0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 0% 0%, rgba(229,229,229,0.1) 0%, transparent 50%)',
          ]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      <div className="relative flex gap-4">
        <div className="p-3 bg-white/5 rounded-xl h-fit group-hover:bg-white/10 transition-colors">
          <Icon className="w-5 h-5 text-stone-200" />
        </div>
        <div className="flex-1">
          <h4 className="text-white font-bold text-sm mb-2">{title}</h4>
          <p className="text-stone-400 text-xs leading-relaxed mb-3">{description}</p>
          
          {progress !== undefined && (
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white/10 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  className="bg-stone-200 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  style={{
                    boxShadow: '0 0 8px rgba(229, 229, 229, 0.5)'
                  }}
                />
              </div>
              <span className="text-xs text-stone-400">{progress}%</span>
            </div>
          )}
          
          <div className="mt-3 flex items-center gap-1 text-[10px] font-bold text-stone-300 uppercase tracking-widest group-hover:gap-2 transition-all">
            Launch Mission <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Dashboard
const SpaceDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [error, setError] = useState(null);
  const [generatingInsights, setGeneratingInsights] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);

  useEffect(() => {
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const verifyResponse = await fetch(`${API_URL}/auth/verify`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!verifyResponse.ok) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      const verifyData = await verifyResponse.json();
      console.log('✅ User verified:', verifyData.user);

      if (!verifyData.user.onboardingComplete) {
        console.log('⚠️ Onboarding not complete, redirecting...');
        navigate('/onboarding');
        return;
      }

      await fetchUserProfile(token);

    } catch (error) {
      console.error('❌ Auth check error:', error);
      setError('Failed to load user data');
      setLoading(false);
    }
  };

  const fetchUserProfile = async (token) => {
    try {
      const profileResponse = await fetch(`${API_URL}/profile/complete-profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!profileResponse.ok) throw new Error('Failed to fetch profile');

      const profileData = await profileResponse.json();
      setUserData(profileData);

      if (profileData.aiInsights) {
        setAiInsights(profileData.aiInsights);
        setLoading(false);
      } else {
        await generateAIInsights(token);
      }

    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const generateAIInsights = async (token) => {
    try {
      setGeneratingInsights(true);

      const insightsResponse = await fetch(`${API_URL}/profile/generate-insights`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!insightsResponse.ok) throw new Error('Failed to generate insights');

      const insightsData = await insightsResponse.json();

      if (insightsData.success) {
        setAiInsights(insightsData.insights);
      }

      setGeneratingInsights(false);
      setLoading(false);

    } catch (error) {
      console.error('❌ Error generating insights:', error);
      setGeneratingInsights(false);
      setLoading(false);
    }
  };

  // Calculate metrics
  const calculateReadinessScore = () => {
    if (aiInsights?.jobReadinessScore) return aiInsights.jobReadinessScore;
    
    let score = 0;
    if (userData?.dataAvailability?.hasOnboarding) score += 30;
    if (userData?.dataAvailability?.hasResume) score += 25;
    if (userData?.dataAvailability?.hasLinkedIn) score += 25;
    if (userData?.linkedinData?.positions?.length > 0) score += 10;
    if (userData?.linkedinData?.skills?.length >= 5) score += 10;
    
    return score;
  };

  const calculateSkillCount = () => {
    const resumeSkills = userData?.resumeData?.skills?.length || 0;
    const linkedinSkills = userData?.linkedinData?.skills?.length || 0;
    return Math.max(resumeSkills, linkedinSkills);
  };

  const getActiveGoalsCount = () => {
    if (aiInsights?.learningPath) {
      const shortTerm = aiInsights.learningPath.shortTerm?.length || 0;
      const mediumTerm = aiInsights.learningPath.mediumTerm?.length || 0;
      return shortTerm + mediumTerm;
    }
    return 3;
  };

  const getUserName = () => {
    if (userData?.linkedinData?.firstName) {
      return userData.linkedinData.firstName;
    }
    if (userData?.resumeData?.name) {
      return userData.resumeData.name.split(' ')[0];
    }
    return userData?.basic?.username || 'Commander';
  };

  const getCareerStatus = () => {
    const status = userData?.careerProfile?.status;
    switch(status) {
      case 'student': return 'CADET';
      case 'graduate': return 'EXPLORER';
      case 'career_switcher': return 'NAVIGATOR';
      default: return 'PIONEER';
    }
  };

  const getProfileCompleteness = () => {
    let completed = 0;
    let total = 4;
    
    if (userData?.dataAvailability?.hasOnboarding) completed++;
    if (userData?.dataAvailability?.hasResume) completed++;
    if (userData?.dataAvailability?.hasLinkedIn) completed++;
    if (userData?.dataAvailability?.hasInsights) completed++;
    
    return Math.round((completed / total) * 100);
  };

  if (loading || generatingInsights) {
    return (
      <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center relative">
        <StarfieldBackground />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Rocket className="w-16 h-16 text-stone-200 mb-4" />
        </motion.div>
        <p className="text-stone-400 tracking-widest text-sm">
          {generatingInsights ? 'ANALYZING MISSION DATA...' : 'INITIALIZING MISSION CONTROL...'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center relative">
        <StarfieldBackground />
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-white text-xl mb-2">SYSTEM ERROR</p>
        <p className="text-stone-400 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-stone-200 hover:bg-stone-300 text-black px-6 py-3 rounded-xl transition-colors font-bold"
        >
          RETRY MISSION
        </button>
      </div>
    );
  }

  const readinessScore = calculateReadinessScore();
  const skillCount = calculateSkillCount();
  const activeGoals = getActiveGoalsCount();
  
  return (
    <div className="min-h-screen bg-[#030303] text-stone-200 relative">
      <StarfieldBackground />
      <Navbar />
      
      <main className="relative z-10 pt-28 pb-12 px-4 md:px-8 max-w-7xl mx-auto space-y-12">
        {/* Header Mission Brief */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Welcome back, {getUserName()}
          </h2>
          <p className="text-stone-400 text-sm tracking-wide">
            {userData?.careerProfile?.passion 
              ? `Mission Focus: ${userData.careerProfile.passion.substring(0, 80)}${userData.careerProfile.passion.length > 80 ? '...' : ''}`
              : 'Your career trajectory is on course. Continue your missions below.'}
          </p>
        </motion.div>
        
        {/* Central Command: Readiness Score */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center mb-16"
        >
          <div className="relative">
            <OrbitalRing score={readinessScore} size={200} />
            <div className="absolute -inset-8 bg-gradient-radial from-white/5 to-transparent rounded-full blur-2xl -z-10" />
          </div>
        </motion.div>
        
        {/* Planet Grid - Core Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <PlanetCard
            title="Skills"
            value={skillCount}
            subtitle="Mastered"
            icon={Award}
            delay={0.1}
            status="complete"
          />
          <PlanetCard
            title="Missions"
            value={activeGoals}
            subtitle="Active"
            icon={Target}
            delay={0.2}
            status="active"
          />
          <PlanetCard
            title="Interviews"
            value={userData?.interviewStats?.totalInterviews || 0}
            subtitle="Completed"
            icon={Mic}
            delay={0.3}
            status="complete"
          />
          <PlanetCard
            title="Status"
            value={getCareerStatus()}
            subtitle="Rank"
            icon={Compass}
            delay={0.4}
            status="complete"
          />
        </div>
        
        {/* Mission Control Center */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Missions */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-lg tracking-wide flex items-center gap-2">
                <Globe className="w-5 h-5" />
                ACTIVE MISSIONS
              </h3>
              <div className="text-xs text-stone-500 tracking-widest">{activeGoals} ONGOING</div>
            </div>
            
            <MissionCard
              title="AI Mock Interview Training"
              description="Practice with our AI interviewer and receive instant tactical feedback on your performance"
              progress={getProfileCompleteness()}
              icon={Mic}
              onClick={() => setShowInterviewModal(true)}
            />
            
            <MissionCard
              title="Career Persona Calibration"
              description="Define your professional identity and align your trajectory with optimal career pathways"
              progress={userData?.dataAvailability?.hasInsights ? 100 : 40}
              icon={Sparkles}
              onClick={() => navigate('/career-persona')}
            />
            
            <MissionCard
              title="Resume Enhancement Protocol"
              description="Upload and optimize your career documentation for maximum impact"
              progress={userData?.dataAvailability?.hasResume ? 100 : 0}
              icon={FileText}
              onClick={() => navigate('/resume-builder')}
            />

            {getProfileCompleteness() < 100 && (
              <MissionCard
                title="Complete Profile Integration"
                description="Connect all data sources to unlock full AI-powered career guidance capabilities"
                progress={getProfileCompleteness()}
                icon={AlertCircle}
                onClick={() => navigate('/onboarding')}
              />
            )}
          </div>
          
          {/* Mission Log */}
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold flex items-center gap-2">
                <History className="w-5 h-5" />
                MISSION LOG
              </h3>
              <button
                onClick={() => navigate('/interview-history')}
                className="text-xs text-stone-400 hover:text-stone-200 transition-colors"
              >
                VIEW ALL →
              </button>
            </div>
            
            <div className="space-y-3">
              {userData?.interviewHistory?.length > 0 ? (
                userData.interviewHistory.slice(0, 3).map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer border border-white/5"
                    onClick={() => navigate('/interview-history')}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-stone-300 capitalize">
                        {log.interviewType} Protocol
                      </span>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        log.overallScore >= 75 ? 'bg-green-500/20 text-green-400' :
                        log.overallScore >= 50 ? 'bg-amber-500/20 text-amber-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {log.overallScore}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <Clock className="w-3 h-3" />
                      {Math.round((log.duration || 0) / 60)}m
                      <span>•</span>
                      <Calendar className="w-3 h-3" />
                      {new Date(log.completedAt).toLocaleDateString()}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Mic className="w-10 h-10 text-stone-600 mx-auto mb-3" />
                  <p className="text-sm text-stone-500 mb-3">No missions logged</p>
                  <button
                    onClick={() => setShowInterviewModal(true)}
                    className="text-xs text-stone-300 hover:text-white font-bold"
                  >
                    START FIRST MISSION →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
        >
          <h3 className="text-white font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            SYSTEM STATUS
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-stone-400 tracking-widest">ONBOARDING</span>
                <span className="text-xs font-bold text-stone-300">
                  {userData?.dataAvailability?.hasOnboarding ? 'COMPLETE' : 'PENDING'}
                </span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  className="bg-stone-200 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: userData?.dataAvailability?.hasOnboarding ? '100%' : '0%' }}
                  style={{ boxShadow: '0 0 8px rgba(229, 229, 229, 0.5)' }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-stone-400 tracking-widest">RESUME</span>
                <span className="text-xs font-bold text-stone-300">
                  {userData?.dataAvailability?.hasResume ? 'COMPLETE' : 'PENDING'}
                </span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  className="bg-stone-200 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: userData?.dataAvailability?.hasResume ? '100%' : '0%' }}
                  style={{ boxShadow: '0 0 8px rgba(229, 229, 229, 0.5)' }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-stone-400 tracking-widest">LINKEDIN</span>
                <span className="text-xs font-bold text-stone-300">
                  {userData?.dataAvailability?.hasLinkedIn ? 'COMPLETE' : 'PENDING'}
                </span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  className="bg-stone-200 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: userData?.dataAvailability?.hasLinkedIn ? '100%' : '0%' }}
                  style={{ boxShadow: '0 0 8px rgba(229, 229, 229, 0.5)' }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-stone-400 tracking-widest">AI INSIGHTS</span>
                <span className="text-xs font-bold text-stone-300">
                  {userData?.dataAvailability?.hasInsights ? 'COMPLETE' : 'PENDING'}
                </span>
              </div>
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                <motion.div
                  className="bg-stone-200 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: userData?.dataAvailability?.hasInsights ? '100%' : '0%' }}
                  style={{ boxShadow: '0 0 8px rgba(229, 229, 229, 0.5)' }}
                />
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Footer Status Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-xs text-stone-600 tracking-widest pt-8"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-2 h-2 bg-stone-400 rounded-full animate-pulse" />
            ALL SYSTEMS OPERATIONAL
          </div>
          <p>CAREER NAVIGATION SYSTEM v2.1.0 • PROFILE: {getProfileCompleteness()}% COMPLETE</p>
        </motion.div>
      </main>

      {/* Interview Modal */}
      {showInterviewModal && (
        <InterviewModal 
          onClose={() => setShowInterviewModal(false)}
          userData={userData}
        />
      )}
    </div>
  );
};

export default SpaceDashboard;
