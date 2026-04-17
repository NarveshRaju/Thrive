import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Mic, ChevronRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'https://thrive-3r8o.onrender.com/api';

// Interview categories for ALL fields, not just tech
const INTERVIEW_CATEGORIES = [
  {
    id: 'role-specific',
    name: 'Role-Specific Interview',
    emoji: '🎯',
    description: 'Questions tailored to your target role and domain',
    color: 'amber'
  },
  {
    id: 'behavioral',
    name: 'Behavioral Interview',
    emoji: '💬',
    description: 'STAR method, leadership, teamwork, and conflict resolution',
    color: 'violet'
  },
  {
    id: 'technical',
    name: 'Technical / Domain',
    emoji: '⚙️',
    description: 'Domain-specific technical knowledge and problem solving',
    color: 'cyan'
  },
  {
    id: 'case-study',
    name: 'Case Study & Problem Solving',
    emoji: '🧩',
    description: 'Real-world scenarios, analytical thinking, case analysis',
    color: 'emerald'
  },
  {
    id: 'hr-cultural',
    name: 'HR & Culture Fit',
    emoji: '🤝',
    description: 'Salary negotiation, motivations, culture fit, career goals',
    color: 'rose'
  }
];

const DIFFICULTIES = [
  { id: 'easy', label: 'Fresher', desc: '0-1 years' },
  { id: 'medium', label: 'Mid-Level', desc: '2-5 years' },
  { id: 'hard', label: 'Senior', desc: '5+ years' }
];

const COLOR_MAP = {
  amber: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', active: 'border-amber-500 bg-amber-500/15' },
  violet: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400', active: 'border-violet-500 bg-violet-500/15' },
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', active: 'border-cyan-500 bg-cyan-500/15' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', active: 'border-emerald-500 bg-emerald-500/15' },
  rose: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', active: 'border-rose-500 bg-rose-500/15' },
};

const InterviewModal = ({ onClose, userData }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // Pull user's career profile for personalization
  const userPassion = userData?.careerProfile?.passion || '';
  const userSkills = [
    ...(userData?.resumeData?.skills || []),
    ...(userData?.linkedinData?.skills || [])
  ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 10);
  const topCareer = userData?.aiInsights?.topCareerRecommendation || '';

  const [formData, setFormData] = useState({
    candidateName: userData?.basic?.username || userData?.linkedinData?.firstName || '',
    interviewType: 'role-specific',
    difficulty: 'medium',
    targetRole: topCareer || '',
    focusAreas: '',
    industry: userPassion || ''
  });

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
        body: JSON.stringify({
          ...formData,
          userSkills,
          userPassion,
          topCareer
        })
      });

      const data = await response.json();

      if (data.success) {
        navigate(`/interview/${data.roomId}`);
      } else {
        alert('Failed to create interview: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to start interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={e => e.stopPropagation()}
          className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 max-w-xl w-full max-h-[85vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Mic className="w-5 h-5 text-amber-400" />
                AI Mock Interview
              </h2>
              <p className="text-gray-400 text-sm mt-1">
                {step === 1 ? 'Personalize your interview' : 'Choose your interview type'}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Step 1: Personalization */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Name */}
              <div className="mb-4">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Your Name</label>
                <input
                  type="text"
                  value={formData.candidateName}
                  onChange={e => setFormData({ ...formData, candidateName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-amber-500/50 outline-none"
                  placeholder="Enter your name"
                />
              </div>

              {/* Target Role */}
              <div className="mb-4">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">
                  Target Role / Position
                  {topCareer && <span className="text-amber-400 ml-1">(from your profile)</span>}
                </label>
                <input
                  type="text"
                  value={formData.targetRole}
                  onChange={e => setFormData({ ...formData, targetRole: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-amber-500/50 outline-none"
                  placeholder="e.g. Product Manager, Data Analyst, Marketing Lead, UX Designer..."
                />
              </div>

              {/* Industry/Domain */}
              <div className="mb-4">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Industry / Domain</label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={e => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-amber-500/50 outline-none"
                  placeholder="e.g. Healthcare, Finance, E-commerce, Education, AI..."
                />
              </div>

              {/* Focus Areas */}
              <div className="mb-6">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Specific Focus Areas (optional)</label>
                <input
                  type="text"
                  value={formData.focusAreas}
                  onChange={e => setFormData({ ...formData, focusAreas: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:border-amber-500/50 outline-none"
                  placeholder="e.g. Leadership, SQL, Market research, User testing..."
                />
              </div>

              {/* Skills Preview */}
              {userSkills.length > 0 && (
                <div className="mb-6 bg-amber-500/5 border border-amber-500/15 rounded-xl p-3">
                  <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest mb-2">
                    <Sparkles className="w-3 h-3 inline mr-1" />
                    Your Skills (from profile)
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {userSkills.map((skill, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-amber-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setStep(2)}
                disabled={!formData.candidateName?.trim()}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl font-bold text-black text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* Step 2: Type & Difficulty */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Interview Type */}
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Interview Type</label>
              <div className="space-y-2 mb-6">
                {INTERVIEW_CATEGORIES.map(type => {
                  const c = COLOR_MAP[type.color];
                  const isSelected = formData.interviewType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setFormData({ ...formData, interviewType: type.id })}
                      className={`w-full p-3 rounded-xl border text-left transition-all ${
                        isSelected ? c.active : `${c.bg} ${c.border} hover:bg-white/5`
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{type.emoji}</span>
                        <div className="flex-1">
                          <h3 className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-gray-300'}`}>{type.name}</h3>
                          <p className="text-[10px] text-gray-500">{type.description}</p>
                        </div>
                        {isSelected && (
                          <div className={`w-5 h-5 rounded-full ${c.text.replace('text-', 'bg-')} flex items-center justify-center`}>
                            <span className="text-white text-[10px]">✓</span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Difficulty */}
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Experience Level</label>
              <div className="grid grid-cols-3 gap-2 mb-6">
                {DIFFICULTIES.map(d => (
                  <button
                    key={d.id}
                    onClick={() => setFormData({ ...formData, difficulty: d.id })}
                    className={`py-3 rounded-xl font-bold text-sm transition-all ${
                      formData.difficulty === d.id
                        ? 'bg-amber-500 text-black'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <div>{d.label}</div>
                    <div className="text-[10px] font-normal opacity-70">{d.desc}</div>
                  </button>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 mb-6">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Interview Summary</p>
                <div className="space-y-1 text-xs text-gray-300">
                  <p><span className="text-gray-500">Candidate:</span> {formData.candidateName}</p>
                  <p><span className="text-gray-500">Target Role:</span> {formData.targetRole || 'General'}</p>
                  <p><span className="text-gray-500">Type:</span> {INTERVIEW_CATEGORIES.find(t => t.id === formData.interviewType)?.name}</p>
                  <p><span className="text-gray-500">Level:</span> {DIFFICULTIES.find(d => d.id === formData.difficulty)?.label}</p>
                  {formData.industry && <p><span className="text-gray-500">Industry:</span> {formData.industry}</p>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-sm transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleStartInterview}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl font-bold text-black text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating Room...</> : <><Mic className="w-4 h-4" /> Start Interview</>}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InterviewModal;
