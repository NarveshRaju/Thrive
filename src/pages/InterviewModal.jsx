import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Code, MessageCircle, Users, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:3001/api';

const InterviewModal = ({ onClose, userData }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    candidateName: userData?.basic?.username || userData?.linkedinData?.firstName || '',
    interviewType: 'technical',
    difficulty: 'medium'
  });

  const interviewTypes = [
    {
      id: 'technical',
      name: 'Technical Interview',
      icon: Code,
      description: 'Coding problems and technical questions',
      color: 'purple'
    },
    {
      id: 'behavioral',
      name: 'Behavioral Interview',
      icon: MessageCircle,
      description: 'Situational and behavioral questions',
      color: 'blue'
    },
    {
      id: 'system-design',
      name: 'System Design',
      icon: Users,
      description: 'Architecture and design problems',
      color: 'green'
    }
  ];

  const difficulties = ['easy', 'medium', 'hard'];

  const handleStartInterview = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/interview/create-room`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Interview room created:', data.roomId);
        // Navigate to interview room
        navigate(`/interview/${data.roomId}`);
      } else {
        alert('Failed to create interview room: ' + (data.message || 'Unknown error'));
      }

    } catch (error) {
      console.error('Error creating interview:', error);
      alert('Failed to start interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Start AI Mock Interview
              </h2>
              <p className="text-slate-400 text-sm">
                Choose your interview type and difficulty level
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Candidate Name */}
          <div className="mb-6">
            <label className="text-sm font-bold text-slate-400 mb-2 block">
              Your Name
            </label>
            <input
              type="text"
              value={formData.candidateName}
              onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
              placeholder="Enter your name"
            />
          </div>

          {/* Interview Type */}
          <div className="mb-6">
            <label className="text-sm font-bold text-slate-400 mb-3 block">
              Interview Type
            </label>
            <div className="grid grid-cols-1 gap-3">
              {interviewTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.interviewType === type.id;
                
                return (
                  <button
                    key={type.id}
                    onClick={() => setFormData({ ...formData, interviewType: type.id })}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        isSelected ? 'bg-purple-500/20' : 'bg-white/5'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          isSelected ? 'text-purple-400' : 'text-slate-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold mb-1 ${
                          isSelected ? 'text-white' : 'text-slate-300'
                        }`}>
                          {type.name}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {type.description}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty */}
          <div className="mb-8">
            <label className="text-sm font-bold text-slate-400 mb-3 block">
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              {difficulties.map((level) => (
                <button
                  key={level}
                  onClick={() => setFormData({ ...formData, difficulty: level })}
                  className={`py-3 rounded-xl font-semibold transition-all ${
                    formData.difficulty === level
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStartInterview}
            disabled={loading || !formData.candidateName}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl font-bold text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Interview Room...
              </>
            ) : (
              <>
                🎤 Start Interview
              </>
            )}
          </button>

          {/* Info */}
          <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
            <p className="text-xs text-purple-300">
              <strong>What to expect:</strong> You'll have a real-time conversation with our AI interviewer. 
              Write code in the editor while explaining your thought process. Get instant AI feedback on your performance.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InterviewModal;
