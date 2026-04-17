import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import {
  Loader2, Send, Mic, ArrowLeft, Clock, BarChart3,
  CheckCircle2, AlertCircle, Trophy, Brain, MessageCircle,
  TrendingUp, Target, Star, ChevronRight, X
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://thrive-3r8o.onrender.com/api';

function InterviewRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  // State
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [report, setReport] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const MAX_QUESTIONS = 8;

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load interview room
  useEffect(() => {
    loadInterview();
  }, [roomId]);

  const loadInterview = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/interview/room/${roomId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setInterview(data.interview);
      } else {
        console.error('Interview not found');
      }
    } catch (err) {
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Start interview - get first AI question
  const startInterview = async () => {
    setStarted(true);
    setStartTime(Date.now());
    setSending(true);

    try {
      const token = localStorage.getItem('token');

      // Mark as started in backend
      await fetch(`${API_URL}/interview/start/${roomId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

      // Get first question from AI
      const res = await fetch(`${API_URL}/interview/chat/${roomId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: '__START_INTERVIEW__',
          history: [],
          interviewType: interview?.interviewType,
          difficulty: interview?.difficulty,
          targetRole: interview?.targetRole,
          industry: interview?.industry,
          focusAreas: interview?.focusAreas,
          candidateName: interview?.candidateName
        })
      });

      const data = await res.json();
      if (data.success) {
        setMessages([{ role: 'interviewer', content: data.response, timestamp: new Date() }]);
        setQuestionCount(1);
      }
    } catch (err) {
      console.error('Start error:', err);
      setMessages([{ role: 'interviewer', content: "Hello! Let's begin your interview. Could you start by telling me about yourself and your background?", timestamp: new Date() }]);
      setQuestionCount(1);
    } finally {
      setSending(false);
    }
  };

  // Send user response
  const sendMessage = async () => {
    if (!input.trim() || sending) return;

    const userMsg = { role: 'user', content: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    const userInput = input.trim();
    setInput('');
    setSending(true);

    try {
      const token = localStorage.getItem('token');

      const history = [...messages, userMsg].map(m => ({
        role: m.role === 'interviewer' ? 'assistant' : 'user',
        content: m.content
      }));

      const res = await fetch(`${API_URL}/interview/chat/${roomId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userInput,
          history,
          interviewType: interview?.interviewType,
          difficulty: interview?.difficulty,
          targetRole: interview?.targetRole,
          industry: interview?.industry,
          focusAreas: interview?.focusAreas,
          candidateName: interview?.candidateName,
          questionNumber: questionCount + 1,
          maxQuestions: MAX_QUESTIONS
        })
      });

      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'interviewer', content: data.response, timestamp: new Date() }]);
        setQuestionCount(prev => prev + 1);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { role: 'interviewer', content: 'I appreciate your response. Let me ask you another question...', timestamp: new Date() }]);
    } finally {
      setSending(false);
    }
  };

  // End interview & generate report
  const endInterview = async () => {
    setEnded(true);
    setGeneratingReport(true);

    try {
      const token = localStorage.getItem('token');
      const duration = startTime ? Math.round((Date.now() - startTime) / 1000) : 300;

      const transcript = messages.map(m => ({
        role: m.role === 'interviewer' ? 'agent' : 'user',
        content: m.content,
        timestamp: m.timestamp
      }));

      const res = await fetch(`${API_URL}/interview/end/${roomId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          scores: {
            communication: 0,
            problemSolving: 0,
            technicalKnowledge: 0,
            overall: 0
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        setReport(data.interview);
      } else {
        setReport({ scores: { overall: 0 }, aiAnalysis: { overallFeedback: 'Report generation failed.' } });
      }
    } catch (err) {
      console.error('End error:', err);
      setReport({ scores: { overall: 0 }, aiAnalysis: { overallFeedback: 'Could not generate report.' } });
    } finally {
      setGeneratingReport(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
      </div>
    );
  }

  // Not found
  if (!interview) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-white text-lg font-bold mb-2">Interview not found</p>
          <button onClick={() => navigate('/interview-prep')} className="px-6 py-3 bg-amber-500 text-black rounded-xl font-bold">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Report view
  if (ended && report) {
    const analysis = report.aiAnalysis || {};
    const scores = report.scores || {};

    return (
      <div className="min-h-screen bg-[#030303] text-white">
        <DashboardNavbar />
        <main className="pt-24 pb-16 px-4 md:px-8 max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Score Header */}
            <div className="text-center mb-8">
              <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${
                scores.overall >= 70 ? 'bg-emerald-500/20 border-2 border-emerald-400' : 'bg-amber-500/20 border-2 border-amber-400'
              }`}>
                <Trophy className={`w-12 h-12 ${scores.overall >= 70 ? 'text-emerald-400' : 'text-amber-400'}`} />
              </div>
              <h1 className="text-4xl font-bold mb-1">{scores.overall || '—'}%</h1>
              <p className="text-gray-400 text-sm">Overall Performance</p>
              <p className="text-gray-600 text-xs mt-1 capitalize">
                {interview.interviewType?.replace('-', ' ')} • {interview.targetRole || 'General'}
              </p>
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {[
                { label: 'Communication', score: scores.communication, icon: MessageCircle },
                { label: 'Problem Solving', score: scores.problemSolving, icon: Brain },
                { label: 'Domain Knowledge', score: scores.technicalKnowledge, icon: Target },
                { label: 'Confidence', score: scores.confidence, icon: Star },
              ].map(({ label, score, icon: Icon }) => (
                <div key={label} className="bg-white/[0.03] border border-white/10 rounded-xl p-4 text-center">
                  <Icon className="w-5 h-5 text-amber-400 mx-auto mb-2" />
                  <p className="text-xl font-bold">{score || 0}%</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">{label}</p>
                </div>
              ))}
            </div>

            {/* Strengths */}
            {analysis.strengths?.length > 0 && (
              <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-5 mb-4">
                <h3 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Strengths
                </h3>
                <ul className="space-y-2">
                  {analysis.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                      <ChevronRight className="w-3 h-3 text-emerald-400 mt-1 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Areas for Improvement */}
            {analysis.weaknesses?.length > 0 && (
              <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-5 mb-4">
                <h3 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" /> Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {analysis.weaknesses.map((w, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                      <ChevronRight className="w-3 h-3 text-amber-400 mt-1 flex-shrink-0" />
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations?.length > 0 && (
              <div className="bg-violet-500/5 border border-violet-500/15 rounded-xl p-5 mb-4">
                <h3 className="text-sm font-bold text-violet-400 mb-3 flex items-center gap-2">
                  <Brain className="w-4 h-4" /> Recommendations
                </h3>
                <ul className="space-y-2">
                  {analysis.recommendations.map((r, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                      <ChevronRight className="w-3 h-3 text-violet-400 mt-1 flex-shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Overall Feedback */}
            {analysis.overallFeedback && (
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 mb-8">
                <h3 className="text-sm font-bold text-white mb-2">Overall Feedback</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{analysis.overallFeedback}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-center">
              <button onClick={() => navigate('/interview-history')} className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-sm">
                View History
              </button>
              <button onClick={() => navigate('/interview-prep')} className="px-5 py-3 bg-amber-500 text-black rounded-xl font-bold text-sm">
                New Interview
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // Generating report
  if (ended && generatingReport) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
            <Brain className="w-12 h-12 text-amber-500 mx-auto" />
          </motion.div>
          <p className="text-white text-lg font-bold mt-4">AI is analyzing your interview...</p>
          <p className="text-gray-500 text-sm mt-1">Generating your personalized report</p>
        </div>
      </div>
    );
  }

  // Main interview room
  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Mic className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h1 className="text-sm font-bold">AI Interview</h1>
              <p className="text-[10px] text-gray-500 capitalize">
                {interview?.interviewType?.replace('-', ' ')} • {interview?.targetRole || interview?.difficulty}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {started && (
              <span className="text-[10px] text-gray-500 flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                {questionCount}/{MAX_QUESTIONS} questions
              </span>
            )}

            {started && !ended ? (
              <button
                onClick={endInterview}
                className="px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all"
              >
                End Interview
              </button>
            ) : (
              <button
                onClick={() => navigate('/interview-prep')}
                className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-gray-400 text-xs font-bold hover:bg-white/10 transition-all"
              >
                Exit
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 overflow-y-auto">
        {!started ? (
          /* Pre-start screen */
          <div className="flex items-center justify-center h-full min-h-[60vh]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-md"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Ready, <span className="text-amber-400">{interview?.candidateName}</span>?
              </h2>
              <p className="text-gray-400 text-sm mb-2 capitalize">
                {interview?.interviewType?.replace('-', ' ')} Interview
                {interview?.targetRole && ` • ${interview.targetRole}`}
              </p>
              <p className="text-gray-500 text-xs mb-6">
                {interview?.difficulty === 'easy' ? 'Fresher Level' : interview?.difficulty === 'hard' ? 'Senior Level' : 'Mid-Level'} • {MAX_QUESTIONS} questions • Text-based
              </p>

              <div className="text-left bg-white/[0.03] border border-white/10 rounded-xl p-4 mb-6 space-y-2">
                {[
                  'AI asks personalized questions for your role',
                  'Type your answers naturally',
                  'Get detailed AI feedback after',
                  'No mic needed — fully text-based'
                ].map((tip, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                    <CheckCircle2 className="w-3 h-3 text-amber-400 flex-shrink-0" />
                    {tip}
                  </div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startInterview}
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl font-bold text-black transition-all"
              >
                Start Interview
              </motion.button>
            </motion.div>
          </div>
        ) : (
          /* Chat messages */
          <div className="space-y-4 pb-4">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${
                  msg.role === 'user'
                    ? 'bg-amber-500/10 border border-amber-500/20 rounded-2xl rounded-br-md'
                    : 'bg-white/[0.03] border border-white/10 rounded-2xl rounded-bl-md'
                } px-4 py-3`}>
                  <p className="text-[10px] text-gray-500 mb-1">
                    {msg.role === 'user' ? interview?.candidateName || 'You' : '🤖 AI Interviewer'}
                  </p>
                  <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ))}

            {sending && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    AI is thinking...
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      {started && !ended && (
        <div className="border-t border-white/5 bg-black/50 backdrop-blur-xl sticky bottom-0">
          <div className="max-w-4xl mx-auto px-4 py-3">
            {questionCount >= MAX_QUESTIONS ? (
              <div className="text-center py-2">
                <p className="text-gray-400 text-sm mb-2">Interview complete! ({MAX_QUESTIONS} questions answered)</p>
                <button
                  onClick={endInterview}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl font-bold text-black text-sm"
                >
                  Get AI Report
                </button>
              </div>
            ) : (
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Type your answer... (Shift+Enter for new line)"
                  rows={2}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-amber-500/50 outline-none resize-none"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || sending}
                  className="p-3 bg-amber-500 hover:bg-amber-600 rounded-xl transition-all disabled:opacity-30"
                >
                  <Send className="w-4 h-4 text-black" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default InterviewRoom;
