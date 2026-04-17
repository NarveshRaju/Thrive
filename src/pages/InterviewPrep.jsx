import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import InterviewModal from '../pages/InterviewModal';
import {
  Mic, Award, TrendingUp, Clock, Target, Zap, CheckCircle2,
  ArrowLeft, BarChart3, Sparkles, MessageCircle, Brain,
  BookOpen, Users, Briefcase, Loader2
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://thrive-3r8o.onrender.com/api';

const InterviewPrep = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState(null);
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }

      // Fetch profile + interview history in parallel
      const [profileRes, historyRes] = await Promise.allSettled([
        fetch(`${API_URL}/profile/complete-profile`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/interview/history?limit=5`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (profileRes.status === 'fulfilled' && profileRes.value.ok) {
        const profileData = await profileRes.value.json();
        setUserData(profileData);
      }

      if (historyRes.status === 'fulfilled' && historyRes.value.ok) {
        const historyData = await historyRes.value.json();
        if (historyData.success) {
          setStats(historyData.stats);
          setRecentInterviews(historyData.interviews || []);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const interviewTypes = [
    {
      id: 'role-specific',
      title: 'Role-Specific',
      emoji: '🎯',
      color: 'amber',
      description: 'Questions personalized to your target role and career path',
      features: ['Personalized to your profile', 'Industry-relevant scenarios', 'Role-specific competencies', 'AI-adapted difficulty']
    },
    {
      id: 'behavioral',
      title: 'Behavioral',
      emoji: '💬',
      color: 'violet',
      description: 'Master STAR method, leadership, teamwork, and conflict stories',
      features: ['STAR method coaching', 'Communication analysis', 'Leadership scenarios', 'Conflict resolution']
    },
    {
      id: 'technical',
      title: 'Technical / Domain',
      emoji: '⚙️',
      color: 'cyan',
      description: 'Domain-specific knowledge — not just coding, any field',
      features: ['Domain knowledge check', 'Problem-solving ability', 'Critical thinking', 'Industry best practices']
    },
    {
      id: 'case-study',
      title: 'Case Study',
      emoji: '🧩',
      color: 'emerald',
      description: 'Real-world scenarios for consulting, product, business roles',
      features: ['Analytical thinking', 'Business reasoning', 'Data interpretation', 'Strategic decisions']
    },
    {
      id: 'hr-cultural',
      title: 'HR & Culture Fit',
      emoji: '🤝',
      color: 'rose',
      description: 'Salary negotiation, motivations, culture fit questions',
      features: ['Salary negotiation', 'Career motivation', 'Cultural alignment', 'Values discussion']
    }
  ];

  const COLOR_MAP = {
    amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', btnBg: 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-400' },
    violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400', btnBg: 'bg-violet-500/15 hover:bg-violet-500/25 text-violet-400' },
    cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400', btnBg: 'bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400' },
    emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', btnBg: 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400' },
    rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400', btnBg: 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-400' },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[120px]" />
      </div>

      <DashboardNavbar />

      <main className="relative z-10 pt-24 pb-16 px-4 md:px-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Dashboard
          </button>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-xs text-amber-400 font-bold mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> AI-Powered Practice
              </p>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Mock Interview
              </h1>
              <p className="text-gray-400 mt-1">
                Practice with AI — personalized to your role, not just tech
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl font-bold text-black text-sm flex items-center gap-2"
            >
              <Mic className="w-4 h-4" /> Start Interview
            </motion.button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[
            { icon: Award, label: 'Completed', value: stats?.totalInterviews || 0, color: 'amber' },
            { icon: TrendingUp, label: 'Avg Score', value: `${stats?.averageScore || 0}%`, color: 'emerald' },
            { icon: Target, label: 'Best Score', value: `${stats?.bestScore || 0}%`, color: 'violet' },
            { icon: Clock, label: 'Practice Time', value: `${Math.round((stats?.totalDuration || 0) / 60)}m`, color: 'cyan' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className={`${COLOR_MAP[color].bg} border ${COLOR_MAP[color].border} rounded-xl p-4`}>
              <Icon className={`w-5 h-5 ${COLOR_MAP[color].text} mb-2`} />
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>

        {/* Interview Types */}
        <div className="mb-10">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-amber-400" /> Interview Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {interviewTypes.map((type, index) => {
              const c = COLOR_MAP[type.color];
              return (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -3 }}
                  onClick={() => setShowModal(true)}
                  className={`${c.bg} border ${c.border} rounded-xl p-5 cursor-pointer group hover:shadow-lg transition-all`}
                >
                  <div className="text-2xl mb-3">{type.emoji}</div>
                  <h3 className="text-white font-bold mb-1">{type.title}</h3>
                  <p className="text-xs text-gray-400 mb-4">{type.description}</p>
                  <ul className="space-y-1.5 mb-4">
                    {type.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-[11px] text-gray-500">
                        <CheckCircle2 className={`w-3 h-3 ${c.text} flex-shrink-0`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-2 rounded-lg font-bold text-xs transition-all ${c.btnBg}`}>
                    Start Practice
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" /> Recent Sessions
            </h2>
            {recentInterviews.length > 0 && (
              <button onClick={() => navigate('/interview-history')} className="text-xs text-amber-400 hover:text-amber-300 font-bold">
                View All →
              </button>
            )}
          </div>

          {recentInterviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {recentInterviews.slice(0, 3).map(interview => (
                <div
                  key={interview._id}
                  className="bg-white/[0.03] border border-white/10 rounded-xl p-4 hover:bg-white/[0.05] transition-all cursor-pointer"
                  onClick={() => navigate('/interview-history')}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-300 capitalize">
                      {interview.interviewType?.replace('-', ' ')}
                    </span>
                    <span className={`text-lg font-bold ${
                      (interview.scores?.overall || 0) >= 75 ? 'text-emerald-400' :
                      (interview.scores?.overall || 0) >= 50 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {interview.scores?.overall || 0}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500">
                    <Clock className="w-3 h-3" />
                    {Math.round((interview.duration || 0) / 60)} min
                    <span>•</span>
                    {new Date(interview.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white/[0.02] border border-white/10 rounded-xl">
              <Mic className="w-10 h-10 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 text-sm mb-1">No practice sessions yet</p>
              <p className="text-gray-600 text-xs">Start your first AI interview!</p>
            </div>
          )}
        </div>

        {/* How It Works */}
        <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6">
          <h2 className="text-lg font-bold mb-5 text-center flex items-center justify-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" /> How It Works
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { step: '1', title: 'Personalize', desc: 'Enter your role, industry, and focus areas', icon: Target },
              { step: '2', title: 'Choose Type', desc: 'Pick interview type and experience level', icon: Brain },
              { step: '3', title: 'Practice', desc: 'Chat with AI interviewer in real-time', icon: MessageCircle },
              { step: '4', title: 'Get Feedback', desc: 'Receive detailed AI performance analysis', icon: BarChart3 },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="text-center">
                  <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="font-bold text-sm mb-0.5">{item.title}</h3>
                  <p className="text-[10px] text-gray-500">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Interview Modal */}
      {showModal && (
        <InterviewModal
          onClose={() => setShowModal(false)}
          userData={userData}
        />
      )}
    </div>
  );
};

export default InterviewPrep;
