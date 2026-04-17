import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import {
  Sparkles, X, Trophy, Loader2, AlertCircle, ArrowLeft,
  Lock, CheckCircle2, Clock, Target, Award, ChevronRight,
  BookOpen, Play, Zap, Star, Brain, Rocket, MapPin
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://thrive-3r8o.onrender.com/api';

// Color map for planets
const PLANET_COLORS = {
  Mercury: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', accent: '#3b82f6', glow: 'shadow-blue-500/20' },
  Venus: { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', accent: '#f59e0b', glow: 'shadow-amber-500/20' },
  Earth: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', accent: '#22c55e', glow: 'shadow-emerald-500/20' },
  Mars: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', accent: '#ef4444', glow: 'shadow-red-500/20' },
  Jupiter: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', accent: '#f97316', glow: 'shadow-orange-500/20' },
  Saturn: { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', accent: '#a855f7', glow: 'shadow-purple-500/20' },
  Uranus: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400', accent: '#06b6d4', glow: 'shadow-cyan-500/20' },
  Neptune: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400', accent: '#6366f1', glow: 'shadow-indigo-500/20' },
};

const getColors = (planetName) => PLANET_COLORS[planetName] || PLANET_COLORS.Mercury;

const DIFFICULTY_COLORS = {
  Easy: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Hard: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  Expert: 'bg-red-500/15 text-red-400 border-red-500/30',
};

// ===== LEVEL CARD =====
const LevelCard = ({ level, index, onClick, progress }) => {
  const isLocked = level.id > (progress?.unlockedLevel || 1);
  const isCompleted = progress?.completedLevels?.includes(level.id);
  const c = getColors(level.planetName);
  const score = progress?.levelScores?.find(s => s.levelId === level.id)?.score;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 100 }}
      onClick={isLocked ? undefined : onClick}
      className={`relative group ${isLocked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className={`${c.bg} border ${c.border} rounded-2xl p-5 transition-all duration-300 ${
        !isLocked ? `hover:shadow-lg ${c.glow} hover:scale-[1.02]` : ''
      }`}>
        {/* Top row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
              {isLocked ? (
                <Lock className="w-4 h-4 text-gray-500" />
              ) : isCompleted ? (
                <CheckCircle2 className={`w-5 h-5 ${c.text}`} />
              ) : (
                <span className={`text-sm font-bold ${c.text}`}>{level.id}</span>
              )}
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">{level.name}</h3>
              <p className="text-gray-500 text-[10px] uppercase tracking-widest">{level.planetName}</p>
            </div>
          </div>

          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${DIFFICULTY_COLORS[level.difficulty] || DIFFICULTY_COLORS.Easy}`}>
            {level.difficulty}
          </span>
        </div>

        {/* Subtitle */}
        <p className="text-xs text-gray-400 mb-3">{level.subtitle || level.description}</p>

        {/* Topics */}
        <div className="flex flex-wrap gap-1 mb-3">
          {(level.topics || []).slice(0, 4).map((topic, i) => (
            <span key={i} className={`text-[10px] px-2 py-0.5 rounded-lg ${c.bg} ${c.text} font-medium`}>
              {topic}
            </span>
          ))}
          {(level.topics || []).length > 4 && (
            <span className="text-[10px] text-gray-500">+{level.topics.length - 4} more</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[10px] text-gray-500">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{level.estimatedTime}</span>
            <span className="flex items-center gap-1"><Award className="w-3 h-3 text-amber-400" />{level.badge}</span>
          </div>

          {isCompleted && score !== undefined && (
            <span className={`text-xs font-bold ${score >= 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {score}%
            </span>
          )}

          {!isLocked && !isCompleted && (
            <ChevronRight className={`w-4 h-4 ${c.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
          )}
        </div>
      </div>

      {/* Connection line to next */}
      {index < 7 && (
        <div className="hidden lg:block absolute -bottom-6 left-1/2 -translate-x-1/2 w-px h-6 bg-gradient-to-b from-white/10 to-transparent" />
      )}
    </motion.div>
  );
};

// ===== ASSESSMENT =====
const Assessment = ({ mission, questions, onComplete, onBack }) => {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

  if (!questions || questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-[#030303] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <p className="text-white text-lg font-bold mb-2">No questions available</p>
          <p className="text-gray-400 mb-6">This level's assessment isn't ready yet</p>
          <button onClick={onBack} className="px-6 py-3 bg-amber-500 text-black rounded-xl font-bold">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[idx];

  const handleAnswer = (selectedIdx) => {
    setSelected(selectedIdx);
    setShowResult(true);

    const isCorrect = selectedIdx === currentQ.correctAnswer;
    const newScore = isCorrect ? score + 1 : score;
    const newMistakes = isCorrect ? mistakes : [...mistakes, {
      question: currentQ.question,
      userAnswer: currentQ.options?.[selectedIdx] || 'N/A',
      correctAnswer: currentQ.options?.[currentQ.correctAnswer] || 'N/A',
      tip: currentQ.tip
    }];

    setTimeout(() => {
      if (idx < questions.length - 1) {
        setScore(newScore);
        setMistakes(newMistakes);
        setIdx(idx + 1);
        setSelected(null);
        setShowResult(false);
      } else {
        const finalScore = Math.round((newScore / questions.length) * 100);
        onComplete(finalScore, newMistakes);
      }
    }, 1200);
  };

  const progress = ((idx) / questions.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-[#030303] flex flex-col">
      <DashboardNavbar />
      <div className="flex-1 flex items-center justify-center p-6 pt-24">
        <div className="w-full max-w-2xl">
          {/* Progress bar */}
          <div className="flex items-center justify-between mb-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <span>{mission.name}</span>
            <span>Question {idx + 1} / {questions.length}</span>
          </div>
          <div className="w-full h-1 bg-white/5 rounded-full mb-8 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Question */}
          <motion.h2
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-white mb-8 leading-relaxed"
          >
            {currentQ.question}
          </motion.h2>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options?.map((option, i) => {
              let optionClass = 'bg-white/[0.03] border-white/10 hover:border-amber-500/40 hover:bg-amber-500/5';
              if (showResult) {
                if (i === currentQ.correctAnswer) {
                  optionClass = 'bg-emerald-500/10 border-emerald-500/40';
                } else if (i === selected && i !== currentQ.correctAnswer) {
                  optionClass = 'bg-red-500/10 border-red-500/40';
                } else {
                  optionClass = 'bg-white/[0.02] border-white/5 opacity-40';
                }
              }

              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => !showResult && handleAnswer(i)}
                  disabled={showResult}
                  className={`w-full text-left p-4 border rounded-xl transition-all ${optionClass}`}
                >
                  <span className="text-amber-400 font-bold mr-3">{String.fromCharCode(65 + i)}.</span>
                  <span className="text-white text-sm">{option}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Tip on wrong answer */}
          <AnimatePresence>
            {showResult && selected !== currentQ.correctAnswer && currentQ.tip && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl"
              >
                <p className="text-xs text-amber-400 font-bold mb-1">💡 Tip</p>
                <p className="text-sm text-gray-300">{currentQ.tip}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Score tracker */}
          <div className="flex items-center gap-2 mt-6">
            {questions.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${
                i < idx ? 'bg-amber-400' : i === idx ? 'bg-white' : 'bg-gray-700'
              }`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== REPORT =====
const Report = ({ score, mistakes, mission, onRetry, onContinue }) => {
  const passed = score >= 70;

  return (
    <div className="fixed inset-0 z-50 bg-[#030303] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full bg-white/[0.03] border border-white/10 rounded-2xl p-8 text-center"
      >
        <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
          passed ? 'bg-emerald-500/20 border-2 border-emerald-400' : 'bg-red-500/20 border-2 border-red-400'
        }`}>
          <Trophy className={`w-12 h-12 ${passed ? 'text-emerald-400' : 'text-red-400'}`} />
        </div>

        <h3 className="text-5xl font-bold text-white mb-2">{score}%</h3>
        <p className={`text-sm font-bold uppercase tracking-widest mb-1 ${passed ? 'text-emerald-400' : 'text-red-400'}`}>
          {passed ? '✅ Mission Complete' : '❌ Mission Failed'}
        </p>
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-8">{mission.name}</p>

        {passed && mission.badge && (
          <div className="p-5 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-6">
            <Award className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <p className="text-xs text-gray-400 mb-1">Badge Earned</p>
            <p className="text-white font-bold text-lg">{mission.badge}</p>
          </div>
        )}

        {mistakes.length > 0 && (
          <div className="text-left space-y-3 mb-6 max-h-48 overflow-y-auto">
            <p className="text-[10px] text-red-400 uppercase tracking-widest font-bold">
              Areas for Improvement ({mistakes.length})
            </p>
            {mistakes.map((m, i) => (
              <div key={i} className="p-3 bg-red-500/5 border border-red-500/15 rounded-lg">
                <p className="text-white text-xs font-bold mb-1">❌ {m.question}</p>
                <p className="text-[10px] text-gray-400">
                  Your answer: <span className="text-red-400">{m.userAnswer}</span>
                  {' → '}<span className="text-emerald-400">{m.correctAnswer}</span>
                </p>
                {m.tip && <p className="text-[10px] text-amber-400 mt-1">💡 {m.tip}</p>}
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold text-sm transition-all"
          >
            🔄 Retry
          </button>
          <button
            onClick={onContinue}
            className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-black rounded-xl font-bold text-sm transition-all"
          >
            {passed ? '🚀 Continue' : '🗺️ Back to Map'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ===== MISSION BRIEFING =====
const MissionBriefing = ({ mission, onStart, onBack }) => {
  const c = getColors(mission.planetName);

  return (
    <div className="fixed inset-0 z-50 bg-[#030303] overflow-y-auto">
      <DashboardNavbar />
      <div className="pt-24 pb-16 px-4 md:px-8 max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-3 h-3" /> Back to Map
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center`}>
            <span className={`font-bold ${c.text}`}>{mission.id}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{mission.name}</h1>
            <p className="text-xs text-gray-400 uppercase tracking-widest">{mission.planetName} • {mission.difficulty}</p>
          </div>
        </div>

        <p className="text-gray-400 mt-4 mb-8 leading-relaxed">{mission.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Video */}
          {mission.videoId && (
            <div className="md:col-span-2 bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${mission.videoId}?rel=0&modestbranding=1`}
                title="Mission Briefing"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* Topics */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" /> Topics Covered
            </h3>
            <div className="space-y-2">
              {(mission.topics || []).map((topic, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${c.text.replace('text-', 'bg-')}`} />
                  <span className="text-sm text-gray-300">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 space-y-4">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Estimated Time</p>
              <p className="text-sm text-white font-bold flex items-center gap-2"><Clock className="w-4 h-4 text-amber-400" />{mission.estimatedTime}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Badge Reward</p>
              <p className="text-sm text-white font-bold flex items-center gap-2"><Award className="w-4 h-4 text-amber-400" />{mission.badge}</p>
            </div>
            {mission.project && (
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Project Challenge</p>
                <p className="text-sm text-amber-300">{mission.project}</p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
        >
          <Zap className="w-5 h-5" /> Start Assessment ({mission.assessment?.length || 0} Questions)
        </button>
      </div>
    </div>
  );
};

// ===== MAIN COMPONENT =====
const LearningGuide = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('loading');
  const [learningPath, setLearningPath] = useState(null);
  const [progress, setProgress] = useState(null);
  const [activeMission, setActiveMission] = useState(null);
  const [error, setError] = useState(null);
  const [lastScore, setLastScore] = useState(0);
  const [lastMistakes, setLastMistakes] = useState([]);

  useEffect(() => { loadLearningPath(); }, []);

  const loadLearningPath = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }

      // Try to get existing path
      const res = await fetch(`${API_URL}/profile/learning-path`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.levels?.length > 0) {
          setLearningPath(data);
          setProgress(data.progress || { unlockedLevel: 1, completedLevels: [], levelScores: [] });
          setView('map');
          return;
        }
      }

      // Generate new path
      setView('generating');
      const genRes = await fetch(`${API_URL}/profile/generate-learning-path`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const genData = await genRes.json();
      if (genData.success && genData.levels?.length > 0) {
        setLearningPath(genData);
        setProgress(genData.progress || { unlockedLevel: 1, completedLevels: [], levelScores: [] });
        setView('map');
      } else {
        throw new Error(genData.message || 'Failed to generate learning path');
      }
    } catch (err) {
      console.error('Learning path error:', err);
      setError(err.message);
      setView('error');
    }
  };

  const handleCompleteAssessment = async (finalScore, mistakes) => {
    setLastScore(finalScore);
    setLastMistakes(mistakes);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/profile/update-learning-progress`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          levelId: activeMission.id,
          score: finalScore,
          mistakes,
          timeSpent: 5
        })
      });

      const data = await res.json();
      if (data.success) {
        setProgress(data.progress);
      }
    } catch (err) {
      console.error('Progress update error:', err);
    }

    setView('report');
  };

  // LOADING
  if (view === 'loading' || view === 'generating') {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
            <Loader2 className="w-12 h-12 text-amber-500 mx-auto" />
          </motion.div>
          <p className="text-white text-lg font-bold mt-4">
            {view === 'generating' ? 'AI is building your learning path...' : 'Loading...'}
          </p>
          <p className="text-gray-500 text-sm mt-1">This may take a moment</p>
        </div>
      </div>
    );
  }

  // ERROR
  if (view === 'error') {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <AlertCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-sm">
              Dashboard
            </button>
            <button onClick={() => { setView('loading'); loadLearningPath(); }} className="px-6 py-3 bg-amber-500 text-black rounded-xl font-bold text-sm">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calc stats
  const totalLevels = learningPath?.levels?.length || 0;
  const completedCount = progress?.completedLevels?.length || 0;
  const progressPercent = totalLevels > 0 ? Math.round((completedCount / totalLevels) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/2 w-[600px] h-[600px] bg-amber-600/3 rounded-full blur-[150px] -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/3 rounded-full blur-[120px]" />
      </div>

      <DashboardNavbar />

      {/* MAP VIEW */}
      <AnimatePresence>
        {view === 'map' && (
          <main className="relative z-10 pt-24 pb-16 px-4 md:px-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-10">
              <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white mb-4 transition-colors">
                <ArrowLeft className="w-3 h-3" /> Back to Dashboard
              </button>

              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <p className="text-xs text-amber-400 font-bold mb-1 flex items-center gap-2">
                    <Rocket className="w-4 h-4" /> AI Learning Path
                  </p>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    {learningPath?.pathName || 'Your Learning Journey'}
                  </h1>
                  <p className="text-gray-400 mt-2 max-w-xl text-sm">
                    {learningPath?.personalizedMessage || 'A personalized path to your dream career'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-bold">{completedCount}/{totalLevels}</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-bold">{learningPath?.estimatedTotalTime || '8-12 months'}</span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>

            {/* Level Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(learningPath?.levels || []).map((level, index) => (
                <LevelCard
                  key={level.id}
                  level={level}
                  index={index}
                  progress={progress}
                  onClick={() => {
                    setActiveMission(level);
                    setView('mission');
                  }}
                />
              ))}
            </div>
          </main>
        )}

        {/* MISSION BRIEFING */}
        {view === 'mission' && activeMission && (
          <MissionBriefing
            mission={activeMission}
            onBack={() => setView('map')}
            onStart={() => setView('assessment')}
          />
        )}

        {/* ASSESSMENT */}
        {view === 'assessment' && activeMission && (
          <Assessment
            mission={activeMission}
            questions={activeMission.assessment}
            onComplete={handleCompleteAssessment}
            onBack={() => setView('mission')}
          />
        )}

        {/* REPORT */}
        {view === 'report' && activeMission && (
          <Report
            score={lastScore}
            mistakes={lastMistakes}
            mission={activeMission}
            onRetry={() => setView('assessment')}
            onContinue={() => setView('map')}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LearningGuide;
