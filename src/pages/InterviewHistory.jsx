import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/DashboardNavbar';
import { 
  Calendar, 
  Clock, 
  Award, 
  TrendingUp, 
  Code,
  MessageCircle,
  Users,
  Eye,
  Trash2,
  Loader2
} from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

const InterviewHistory = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  useEffect(() => {
    fetchInterviewHistory();
  }, [pagination.page]);

  const fetchInterviewHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_URL}/interview/history?page=${pagination.page}&limit=${pagination.limit}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      const data = await response.json();
      
      if (data.success) {
        setInterviews(data.interviews);
        setStats(data.stats);
        setPagination({ ...pagination, ...data.pagination });
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching history:', error);
      setLoading(false);
    }
  };

  const handleViewDetails = (interviewId) => {
    navigate(`/interview-report/${interviewId}`);
  };

  const handleDeleteInterview = async (interviewId) => {
    if (!confirm('Are you sure you want to delete this interview?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/interview/${interviewId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchInterviewHistory();
      }
    } catch (error) {
      console.error('Error deleting interview:', error);
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'technical': case 'coding': return Code;
      case 'behavioral': return MessageCircle;
      case 'system-design': return Users;
      default: return Code;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-slate-200">
      <Navbar />

      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-slate-500 hover:text-white mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white">Interview History</h1>
          <p className="text-slate-500 mt-2">Review your past interview performances</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icon={Award}
            label="Total Interviews"
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
            icon={Award}
            label="Best Score"
            value={`${stats?.bestScore || 0}%`}
            color="green"
          />
          <StatsCard
            icon={Clock}
            label="Total Time"
            value={`${Math.round((stats?.totalDuration || 0) / 60)}m`}
            color="amber"
          />
        </div>

        {/* Interviews List */}
        <div className="space-y-4">
          {interviews.length > 0 ? (
            interviews.map((interview, index) => {
              const TypeIcon = getTypeIcon(interview.interviewType);
              
              return (
                <motion.div
                  key={interview._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.05] transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Icon */}
                      <div className="p-3 bg-purple-500/20 rounded-xl">
                        <TypeIcon className="w-6 h-6 text-purple-400" />
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-white">
                            {interview.interviewType?.replace('-', ' ').charAt(0).toUpperCase() + 
                             interview.interviewType?.replace('-', ' ').slice(1)} Interview
                          </h3>
                          <span className="px-2 py-1 bg-white/10 rounded-lg text-xs text-slate-400">
                            {interview.difficulty}
                          </span>
                          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                            interview.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            interview.status === 'in-progress' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-slate-500/20 text-slate-400'
                          }`}>
                            {interview.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(interview.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {Math.round((interview.duration || 0) / 60)} min
                          </span>
                          {interview.scores?.overall > 0 && (
                            <span className={`flex items-center gap-1 font-bold ${getScoreColor(interview.scores.overall)}`}>
                              <Award className="w-4 h-4" />
                              {interview.scores.overall}%
                            </span>
                          )}
                        </div>

                        {/* Score Breakdown */}
                        {interview.status === 'completed' && interview.scores && (
                          <div className="mt-3 flex gap-3">
                            <ScorePill label="Code" value={interview.scores.codeQuality} />
                            <ScorePill label="Comm" value={interview.scores.communication} />
                            <ScorePill label="Problem" value={interview.scores.problemSolving} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {interview.status === 'completed' && (
                        <button
                          onClick={() => handleViewDetails(interview._id)}
                          className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-xl transition-colors group"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteInterview(interview._id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-colors group"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5 text-red-400 group-hover:text-red-300" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Interviews Yet</h3>
              <p className="text-slate-500 mb-6">Start your first AI mock interview to see it here</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-semibold"
              >
                Start Interview
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setPagination({ ...pagination, page })}
                className={`w-10 h-10 rounded-xl font-semibold transition-all ${
                  pagination.page === page
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// Helper Components
const StatsCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
    <div className={`p-3 bg-${color}-500/20 rounded-xl w-fit mb-3`}>
      <Icon className={`w-5 h-5 text-${color}-400`} />
    </div>
    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

const ScorePill = ({ label, value }) => (
  <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg">
    <span className="text-xs text-slate-500">{label}:</span>
    <span className="text-xs font-bold text-white">{value}</span>
  </div>
);

export default InterviewHistory;
