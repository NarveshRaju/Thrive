import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import InterviewModal from '../pages/InterviewModal';
import { 
  Mic2, 
  Code, 
  MessageCircle, 
  Users, 
  Award,
  TrendingUp,
  Clock,
  Target,
  Zap,
  CheckCircle2
} from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

const InterviewPrep = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState(null);
  const [recentInterviews, setRecentInterviews] = useState([]);

  useEffect(() => {
    fetchInterviewData();
  }, []);

  const fetchInterviewData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/interview/history?limit=3`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
        setRecentInterviews(data.interviews);
      }
    } catch (error) {
      console.error('Error fetching interview data:', error);
    }
  };

  const interviewTypes = [
    {
      id: 'technical',
      title: 'Technical Interview',
      icon: Code,
      color: 'purple',
      description: 'Practice coding problems and technical questions with real-time AI feedback',
      features: [
        'Live code editor with syntax highlighting',
        'Real-time code quality analysis',
        'AI-powered interviewer conversation',
        'Detailed performance report'
      ]
    },
    {
      id: 'behavioral',
      title: 'Behavioral Interview',
      icon: MessageCircle,
      color: 'blue',
      description: 'Master behavioral questions and improve your storytelling skills',
      features: [
        'STAR method coaching',
        'Communication skills analysis',
        'Body language tips',
        'Confidence scoring'
      ]
    },
    {
      id: 'system-design',
      title: 'System Design',
      icon: Users,
      color: 'green',
      description: 'Learn to design scalable systems and articulate your architecture decisions',
      features: [
        'Whiteboard-style problem solving',
        'Scalability discussion',
        'Trade-off analysis',
        'Best practices guidance'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <DashboardNavbar />

      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2 mb-4"
          >
            <Zap className="w-4 h-4 text-white-400" />
            <span className="text-sm font-bold text-white-400">AI-Powered Interview Preparation</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-white via-white to-orange-400 bg-clip-text text-transparent"
          >
            Master Your Interviews with AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto"
          >
            Practice with our advanced AI interviewer and get instant, personalized feedback on your performance
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => setShowModal(true)}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
          >
             Start Practice Interview
          </motion.button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <StatsCard
            icon={Award}
            label="Interviews Completed"
            value={stats?.totalInterviews || 0}
            color="purple"
          />
          <StatsCard
            icon={TrendingUp}
            label="Average Score"
            value={`${stats?.averageScore || 0}%`}
            color="blue"
          />
          <StatsCard
            icon={Target}
            label="Best Score"
            value={`${stats?.bestScore || 0}%`}
            color="green"
          />
          <StatsCard
            icon={Clock}
            label="Practice Time"
            value={`${Math.round((stats?.totalDuration || 0) / 60)}m`}
            color="amber"
          />
        </div>

        {/* Interview Types */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Choose Your Interview Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {interviewTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`bg-gradient-to-br from-${type.color}-900/20 to-${type.color}-900/5 border border-${type.color}-500/30 rounded-2xl p-6 hover:border-${type.color}-500/50 transition-all group cursor-pointer`}
                  onClick={() => setShowModal(true)}
                >
                  <div className={`p-3 bg-${type.color}-500/20 rounded-xl w-fit mb-4`}>
                    <Icon className={`w-6 h-6 text-${type.color}-400`} />
                  </div>

                  <h3 className="text-xl font-bold mb-2">{type.title}</h3>
                  <p className="text-sm text-slate-400 mb-4">{type.description}</p>

                  <ul className="space-y-2">
                    {type.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-500">
                        <CheckCircle2 className={`w-4 h-4 text-${type.color}-400 mt-0.5 flex-shrink-0`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full mt-6 py-3 bg-${type.color}-500/20 hover:bg-${type.color}-500/30 rounded-xl font-semibold text-${type.color}-400 transition-all`}>
                    Start Practice
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Recent Interviews */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Practice Sessions</h2>
            <button
              onClick={() => navigate('/interview-history')}
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              View All →
            </button>
          </div>

          {recentInterviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentInterviews.map((interview) => (
                <div
                  key={interview._id}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.05] transition-all cursor-pointer"
                  onClick={() => navigate(`/interview-history`)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm font-semibold text-slate-300">
                      {interview.interviewType?.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className={`text-lg font-bold ${
                      interview.scores?.overall >= 75 ? 'text-green-400' :
                      interview.scores?.overall >= 50 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {interview.scores?.overall || 0}%
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    {Math.round((interview.duration || 0) / 60)} min
                    <span>•</span>
                    {new Date(interview.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/[0.03] border border-white/10 rounded-2xl">
              <Mic2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500">No practice sessions yet. Start your first interview!</p>
            </div>
          )}
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-br from-purple-900/10 to-pink-900/10 border border-purple-500/20 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Choose Type', desc: 'Select interview type and difficulty' },
              { step: '2', title: 'Start Interview', desc: 'Talk with AI interviewer via voice' },
              { step: '3', title: 'Code & Explain', desc: 'Write code while explaining your logic' },
              { step: '4', title: 'Get Feedback', desc: 'Receive detailed AI analysis' }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 font-bold text-xl mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-bold mb-1">{item.title}</h3>
                <p className="text-sm text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Interview Modal */}
      {showModal && (
        <InterviewModal
          onClose={() => setShowModal(false)}
          userData={{ basic: { username: 'User' } }}
        />
      )}
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
    <div className={`p-3 bg-${color}-500/20 rounded-xl w-fit mb-3`}>
      <Icon className={`w-5 h-5 text-${color}-400`} />
    </div>
    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

export default InterviewPrep;
