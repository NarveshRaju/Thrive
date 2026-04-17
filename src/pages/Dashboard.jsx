import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/DashboardNavbar";
import InterviewModal from '../pages/InterviewModal';
import {
  Target,
  Award,
  Zap,
  Sparkles,
  ChevronRight,
  Code,
  Loader2,
  FileText,
  AlertCircle,
  Mic,
  Clock,
  Rocket,
  Star,
  Compass,
  TrendingUp,
  BookOpen,
  MapPin,
  ArrowUpRight,
  BarChart3,
  GraduationCap,
  Brain,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || 'https://thrive-3r8o.onrender.com/api';

// Animated gradient background
const GradientBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-[#030303]" />
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[120px] animate-pulse" />
    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px]" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-900/3 rounded-full blur-[150px]" />
  </div>
);

// Stat Card with accent color
const StatCard = ({ title, value, subtitle, icon: Icon, color, delay }) => {
  const colorMap = {
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', glow: 'shadow-amber-500/10' },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', glow: 'shadow-emerald-500/10' },
    violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400', glow: 'shadow-violet-500/10' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400', glow: 'shadow-cyan-500/10' },
  };
  const c = colorMap[color] || colorMap.amber;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      className={`relative group ${c.bg} backdrop-blur-sm border ${c.border} rounded-2xl p-6 hover:shadow-lg ${c.glow} transition-all duration-300`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 ${c.bg} rounded-xl`}>
          <Icon className={`w-5 h-5 ${c.text}`} />
        </div>
        <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors" />
      </div>
      <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
      <p className="text-xs text-gray-400 uppercase tracking-widest">{title}</p>
      {subtitle && (
        <p className="text-[10px] text-gray-500 mt-2">{subtitle}</p>
      )}
    </motion.div>
  );
};

// Feature Card for main actions
const FeatureCard = ({ title, description, icon: Icon, color, tag, onClick, delay }) => {
  const colorMap = {
    amber: { bg: 'from-amber-500/20 to-orange-500/10', border: 'border-amber-500/20', text: 'text-amber-400', iconBg: 'bg-amber-500/20', tag: 'bg-amber-500/20 text-amber-400' },
    violet: { bg: 'from-violet-500/20 to-purple-500/10', border: 'border-violet-500/20', text: 'text-violet-400', iconBg: 'bg-violet-500/20', tag: 'bg-violet-500/20 text-violet-400' },
    cyan: { bg: 'from-cyan-500/20 to-blue-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400', iconBg: 'bg-cyan-500/20', tag: 'bg-cyan-500/20 text-cyan-400' },
    emerald: { bg: 'from-emerald-500/20 to-green-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', iconBg: 'bg-emerald-500/20', tag: 'bg-emerald-500/20 text-emerald-400' },
    rose: { bg: 'from-rose-500/20 to-pink-500/10', border: 'border-rose-500/20', text: 'text-rose-400', iconBg: 'bg-rose-500/20', tag: 'bg-rose-500/20 text-rose-400' },
  };
  const c = colorMap[color] || colorMap.amber;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 80 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`relative bg-gradient-to-br ${c.bg} backdrop-blur-sm border ${c.border} rounded-2xl p-6 cursor-pointer group overflow-hidden transition-all duration-300 hover:shadow-xl`}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/5 to-transparent" />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 ${c.iconBg} rounded-xl`}>
            <Icon className={`w-6 h-6 ${c.text}`} />
          </div>
          {tag && (
            <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${c.tag}`}>{tag}</span>
          )}
        </div>

        <h4 className="text-white font-bold text-lg mb-2">{title}</h4>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">{description}</p>

        <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest group-hover:gap-2 transition-all">
          <span className={c.text}>Explore</span>
          <ChevronRight className={`w-3.5 h-3.5 ${c.text}`} />
        </div>
      </div>
    </motion.div>
  );
};

// Progress Ring
const ProgressRing = ({ score, size = 140 }) => {
  const radius = (size / 2) - 8;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const getColor = (s) => {
    if (s >= 75) return { stroke: '#22c55e', text: 'text-emerald-400', label: 'Excellent' };
    if (s >= 50) return { stroke: '#f59e0b', text: 'text-amber-400', label: 'Good' };
    return { stroke: '#f97316', text: 'text-orange-400', label: 'Building' };
  };
  const c = getColor(score);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={c.stroke}
          strokeWidth="6"
          fill="none"
          strokeDasharray={circumference}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 6px ${c.stroke}40)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="text-3xl font-bold text-white"
        >
          {score}
        </motion.span>
        <span className={`text-[10px] font-bold tracking-widest ${c.text}`}>{c.label}</span>
      </div>
    </div>
  );
};

// Main Dashboard
const Dashboard = () => {
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

      if (!verifyData.user.onboardingComplete) {
        navigate('/onboarding');
        return;
      }

      await fetchUserProfile(token);

    } catch (error) {
      console.error('Auth check error:', error);
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
      console.error('Error fetching profile:', error);
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
      console.error('Error generating insights:', error);
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
    if (userData?.linkedinData?.firstName) return userData.linkedinData.firstName;
    if (userData?.resumeData?.name) return userData.resumeData.name.split(' ')[0];
    return userData?.basic?.username || 'Explorer';
  };

  const getCareerStatus = () => {
    const status = userData?.careerProfile?.status;
    switch (status) {
      case 'student': return 'Student';
      case 'graduate': return 'Graduate';
      case 'career_switcher': return 'Switcher';
      default: return 'Pioneer';
    }
  };

  const getProfileCompleteness = () => {
    let completed = 0;
    const total = 4;
    if (userData?.dataAvailability?.hasOnboarding) completed++;
    if (userData?.dataAvailability?.hasResume) completed++;
    if (userData?.dataAvailability?.hasLinkedIn) completed++;
    if (userData?.dataAvailability?.hasInsights) completed++;
    return Math.round((completed / total) * 100);
  };

  // Loading state
  if (loading || generatingInsights) {
    return (
      <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center">
        <GradientBackground />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-6"
        >
          <Loader2 className="w-12 h-12 text-amber-500" />
        </motion.div>
        <p className="text-white text-lg font-semibold mb-2">
          {generatingInsights ? 'Analyzing your profile...' : 'Loading dashboard...'}
        </p>
        <p className="text-gray-500 text-sm">Powered by AI</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center">
        <GradientBackground />
        <AlertCircle className="w-14 h-14 text-red-500 mb-4" />
        <p className="text-white text-xl font-bold mb-2">Something went wrong</p>
        <p className="text-gray-400 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-amber-500 hover:bg-amber-600 text-black px-8 py-3 rounded-xl transition-colors font-bold"
        >
          Try Again
        </button>
      </div>
    );
  }

  const readinessScore = calculateReadinessScore();
  const skillCount = calculateSkillCount();
  const activeGoals = getActiveGoalsCount();
  const profileCompleteness = getProfileCompleteness();

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <GradientBackground />
      <Navbar />

      <main className="relative z-10 pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-sm text-amber-400 font-semibold mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Welcome back
              </p>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                {getUserName()}
                <span className="text-amber-500">.</span>
              </h1>
              <p className="text-gray-400 mt-2 max-w-lg">
                {userData?.careerProfile?.passion
                  ? userData.careerProfile.passion.substring(0, 100) + (userData.careerProfile.passion.length > 100 ? '...' : '')
                  : 'Your personalized career dashboard. Explore, learn, and grow.'}
              </p>
            </div>

            {/* Quick Stats Badge */}
            <div className="flex items-center gap-3">
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold">{getCareerStatus()}</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold">{profileCompleteness}% Complete</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid + Readiness Ring */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">
          {/* Readiness Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center"
          >
            <ProgressRing score={readinessScore} />
            <p className="text-xs text-gray-400 mt-3 tracking-widest uppercase">Job Readiness</p>
          </motion.div>

          {/* Stat Cards */}
          <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Skills" value={skillCount} subtitle="Identified" icon={Award} color="amber" delay={0.1} />
            <StatCard title="Goals" value={activeGoals} subtitle="Active" icon={Target} color="violet" delay={0.15} />
            <StatCard title="Interviews" value={userData?.interviewStats?.totalInterviews || 0} subtitle="Completed" icon={Mic} color="cyan" delay={0.2} />
            <StatCard title="Avg Score" value={`${userData?.interviewStats?.averageScore || 0}%`} subtitle="Performance" icon={TrendingUp} color="emerald" delay={0.25} />
          </div>
        </div>

        {/* Main Feature Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-amber-400" />
            Your AI-Powered Toolkit
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              title="AI Career Path Explorer"
              description="Discover your personalized career paths based on your skills, experience, and passions."
              icon={Compass}
              color="amber"
              tag="AI Powered"
              onClick={() => navigate('/career-path')}
              delay={0.35}
            />
            <FeatureCard
              title="AI Mock Interview"
              description="Practice with our voice-based AI interviewer and get real-time performance analysis."
              icon={Mic}
              color="violet"
              tag="Voice AI"
              onClick={() => setShowInterviewModal(true)}
              delay={0.4}
            />
            <FeatureCard
              title="AI Learning Guide"
              description="Follow a gamified learning journey with missions, assessments, and badges."
              icon={BookOpen}
              color="cyan"
              tag="Gamified"
              onClick={() => navigate('/learning-guide')}
              delay={0.45}
            />
            <FeatureCard
              title="AI Resume Builder"
              description="Auto-generate and enhance your resume with AI. Get ATS optimization scores."
              icon={FileText}
              color="emerald"
              tag="ATS Ready"
              onClick={() => navigate('/resume-builder')}
              delay={0.5}
            />
            <FeatureCard
              title="Career Persona"
              description="Calibrate your professional identity and align your trajectory with goals."
              icon={Brain}
              color="rose"
              onClick={() => navigate('/career-persona')}
              delay={0.55}
            />
            <FeatureCard
              title="Interview History"
              description="Review past interview sessions, scores, and AI-generated improvement tips."
              icon={Clock}
              color="amber"
              onClick={() => navigate('/interview-history')}
              delay={0.6}
            />
          </div>
        </motion.div>

        {/* Bottom Section: AI Insights + Profile Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-2 bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/10 rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              AI Career Insights
            </h3>

            {aiInsights ? (
              <div className="space-y-4">
                {aiInsights.topCareerPaths && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Recommended Careers</p>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(aiInsights.topCareerPaths)
                        ? aiInsights.topCareerPaths
                        : [aiInsights.topCareerPaths]
                      ).slice(0, 5).map((path, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm text-amber-300 cursor-pointer hover:bg-amber-500/20 transition-colors"
                          onClick={() => navigate('/career-path')}
                        >
                          {typeof path === 'string' ? path : path.title || path.name || 'Career Path'}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {aiInsights.strengthAreas && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Your Strengths</p>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(aiInsights.strengthAreas)
                        ? aiInsights.strengthAreas
                        : [aiInsights.strengthAreas]
                      ).slice(0, 6).map((s, i) => (
                        <span key={i} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-sm text-emerald-300">
                          {typeof s === 'string' ? s : s.name || s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {aiInsights.improvementAreas && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Areas to Develop</p>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(aiInsights.improvementAreas)
                        ? aiInsights.improvementAreas
                        : [aiInsights.improvementAreas]
                      ).slice(0, 6).map((s, i) => (
                        <span key={i} className="px-3 py-1.5 bg-violet-500/10 border border-violet-500/20 rounded-lg text-sm text-violet-300">
                          {typeof s === 'string' ? s : s.name || s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => navigate('/career-path')}
                  className="mt-2 text-sm text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition-colors"
                >
                  Explore full career paths <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Brain className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 text-sm mb-4">AI insights will appear after you complete more activities.</p>
                <button
                  onClick={() => navigate('/career-path')}
                  className="text-amber-400 hover:text-amber-300 text-sm font-bold"
                >
                  Generate Career Paths →
                </button>
              </div>
            )}
          </motion.div>

          {/* Profile Completion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white/[0.03] border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-400" />
              Profile Status
            </h3>

            <div className="space-y-4">
              {[
                { label: 'Onboarding', done: userData?.dataAvailability?.hasOnboarding, icon: Star },
                { label: 'Resume', done: userData?.dataAvailability?.hasResume, icon: FileText },
                { label: 'LinkedIn', done: userData?.dataAvailability?.hasLinkedIn, icon: Code },
                { label: 'AI Insights', done: userData?.dataAvailability?.hasInsights, icon: Sparkles },
              ].map((item, i) => {
                const CheckIcon = item.icon;
                return (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${item.done ? 'bg-emerald-500/20' : 'bg-white/5'}`}>
                        <CheckIcon className={`w-3.5 h-3.5 ${item.done ? 'text-emerald-400' : 'text-gray-600'}`} />
                      </div>
                      <span className={`text-sm font-medium ${item.done ? 'text-white' : 'text-gray-500'}`}>
                        {item.label}
                      </span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.done
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-white/5 text-gray-500'
                      }`}>
                      {item.done ? '✓ Done' : 'Pending'}
                    </span>
                  </div>
                );
              })}
            </div>

            {profileCompleteness < 100 && (
              <button
                onClick={() => navigate('/onboarding')}
                className="mt-6 w-full py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-xl text-amber-400 font-bold text-sm transition-colors"
              >
                Complete Your Profile →
              </button>
            )}

            {/* Recent activity */}
            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Recent Sessions</p>
              {userData?.interviewHistory?.length > 0 ? (
                <div className="space-y-2">
                  {userData.interviewHistory.slice(0, 2).map((log, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-white/5 rounded-lg p-3 cursor-pointer hover:bg-white/10 transition-colors"
                      onClick={() => navigate('/interview-history')}
                    >
                      <div className="flex items-center gap-2">
                        <Mic className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-xs text-gray-300 capitalize">{log.interviewType}</span>
                      </div>
                      <span className={`text-xs font-bold ${log.overallScore >= 75 ? 'text-emerald-400' :
                        log.overallScore >= 50 ? 'text-amber-400' : 'text-red-400'
                        }`}>
                        {log.overallScore}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500">No sessions yet</p>
              )}
            </div>
          </motion.div>
        </div>
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

export default Dashboard;
