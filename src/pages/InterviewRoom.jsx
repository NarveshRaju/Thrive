import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import {
  Loader2, Send, Mic, MicOff, ArrowLeft, Clock, BarChart3,
  CheckCircle2, AlertCircle, Trophy, Brain, MessageCircle,
  TrendingUp, Target, Star, ChevronRight, X, Volume2, VolumeX,
  Code, Maximize2, Minimize2
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://thrive-3r8o.onrender.com/api';

// ===== SPEECH HELPERS (Browser APIs — free, no deps) =====
const getSpeechRecognition = () => {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  const recognition = new SR();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  return recognition;
};

const speak = (text, onEnd) => {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  // Try to pick a natural voice
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha'));
  if (preferred) utterance.voice = preferred;
  if (onEnd) utterance.onend = onEnd;
  window.speechSynthesis.speak(utterance);
};

// ===== SIMPLE CODE EDITOR =====
const CodeEditor = ({ code, setCode, language, setLanguage, expanded, setExpanded }) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: expanded ? '50vh' : '200px' }}
    className="border border-white/10 rounded-xl overflow-hidden bg-[#0d0d0d] flex flex-col"
  >
    <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-white/[0.02]">
      <div className="flex items-center gap-2">
        <Code className="w-3.5 h-3.5 text-amber-400" />
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Code Editor</span>
      </div>
      <div className="flex items-center gap-2">
        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          className="text-[10px] bg-white/5 border border-white/10 rounded px-2 py-1 text-gray-300 outline-none"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="sql">SQL</option>
          <option value="other">Other</option>
        </select>
        <button onClick={() => setExpanded(!expanded)} className="p-1 hover:bg-white/10 rounded transition-colors">
          {expanded ? <Minimize2 className="w-3 h-3 text-gray-400" /> : <Maximize2 className="w-3 h-3 text-gray-400" />}
        </button>
      </div>
    </div>
    <textarea
      value={code}
      onChange={e => setCode(e.target.value)}
      placeholder="// Write your code here..."
      spellCheck={false}
      className="flex-1 w-full bg-transparent text-sm text-emerald-300 font-mono p-4 outline-none resize-none leading-relaxed placeholder-gray-700"
      style={{ tabSize: 2 }}
      onKeyDown={e => {
        if (e.key === 'Tab') {
          e.preventDefault();
          const start = e.target.selectionStart;
          const end = e.target.selectionEnd;
          setCode(code.substring(0, start) + '  ' + code.substring(end));
          setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = start + 2; }, 0);
        }
      }}
    />
  </motion.div>
);

// ===== MAIN COMPONENT =====
function InterviewRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

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

  // Voice
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Code
  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [codeExpanded, setCodeExpanded] = useState(false);

  const MAX_QUESTIONS = 8;

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (recognitionRef.current) recognitionRef.current.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Load voices
  useEffect(() => {
    window.speechSynthesis?.getVoices();
  }, []);

  // Load interview
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
      if (data.success) setInterview(data.interview);
    } catch (err) {
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Speak AI response
  const speakResponse = (text) => {
    if (!voiceEnabled) return;
    setIsSpeaking(true);
    speak(text, () => setIsSpeaking(false));
  };

  // Toggle listening
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = getSpeechRecognition();
    if (!recognition) {
      alert('Speech recognition not supported in this browser. Please use Chrome.');
      return;
    }

    recognitionRef.current = recognition;
    let finalTranscript = input;

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setInput(finalTranscript + interim);
    };

    recognition.onerror = (event) => {
      console.error('Speech error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    setIsListening(true);
  };

  // Start interview
  const startInterview = async () => {
    setStarted(true);
    setStartTime(Date.now());
    setSending(true);

    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/interview/start/${roomId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });

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
        const aiMsg = { role: 'interviewer', content: data.response, timestamp: new Date() };
        setMessages([aiMsg]);
        setQuestionCount(1);
        speakResponse(data.response);
      }
    } catch (err) {
      const fallback = "Hello! Let's begin your interview. Tell me about yourself.";
      setMessages([{ role: 'interviewer', content: fallback, timestamp: new Date() }]);
      setQuestionCount(1);
      speakResponse(fallback);
    } finally {
      setSending(false);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!input.trim() || sending) return;

    // Stop listening if active
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    window.speechSynthesis?.cancel();

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

      // Include code context if code editor is open
      let messageWithCode = userInput;
      if (showCode && code.trim()) {
        messageWithCode += `\n\n[Code submitted (${language}):\n${code}\n]`;
      }

      const res = await fetch(`${API_URL}/interview/chat/${roomId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageWithCode,
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
        const aiMsg = { role: 'interviewer', content: data.response, timestamp: new Date() };
        setMessages(prev => [...prev, aiMsg]);
        setQuestionCount(prev => prev + 1);
        speakResponse(data.response);
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setSending(false);
    }
  };

  // End interview
  const endInterview = async () => {
    setEnded(true);
    setGeneratingReport(true);
    window.speechSynthesis?.cancel();
    if (recognitionRef.current) recognitionRef.current.abort();

    try {
      const token = localStorage.getItem('token');
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
          code: code || undefined,
          language,
          scores: { communication: 0, problemSolving: 0, technicalKnowledge: 0, overall: 0 }
        })
      });

      const data = await res.json();
      setReport(data.success ? data.interview : { scores: { overall: 0 }, aiAnalysis: { overallFeedback: 'Report generation failed.' } });
    } catch (err) {
      setReport({ scores: { overall: 0 }, aiAnalysis: { overallFeedback: 'Could not generate report.' } });
    } finally {
      setGeneratingReport(false);
    }
  };

  // ===== RENDERS =====

  if (loading) {
    return <div className="min-h-screen bg-[#030303] flex items-center justify-center"><Loader2 className="w-10 h-10 text-amber-500 animate-spin" /></div>;
  }

  if (!interview) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-white text-lg font-bold mb-2">Interview not found</p>
          <button onClick={() => navigate('/interview-prep')} className="px-6 py-3 bg-amber-500 text-black rounded-xl font-bold">Go Back</button>
        </div>
      </div>
    );
  }

  // REPORT
  if (ended && report) {
    const analysis = report.aiAnalysis || {};
    const scores = report.scores || {};
    return (
      <div className="min-h-screen bg-[#030303] text-white">
        <DashboardNavbar />
        <main className="pt-24 pb-16 px-4 md:px-8 max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-8">
              <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-4 ${scores.overall >= 70 ? 'bg-emerald-500/20 border-2 border-emerald-400' : 'bg-amber-500/20 border-2 border-amber-400'}`}>
                <Trophy className={`w-12 h-12 ${scores.overall >= 70 ? 'text-emerald-400' : 'text-amber-400'}`} />
              </div>
              <h1 className="text-4xl font-bold mb-1">{scores.overall || '—'}%</h1>
              <p className="text-gray-400 text-sm">Overall Performance</p>
              <p className="text-gray-600 text-xs mt-1 capitalize">{interview.interviewType?.replace('-', ' ')} • {interview.targetRole || 'General'}</p>
            </div>

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

            {analysis.strengths?.length > 0 && (
              <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-5 mb-4">
                <h3 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Strengths</h3>
                <ul className="space-y-2">{analysis.strengths.map((s, i) => <li key={i} className="text-sm text-gray-300 flex items-start gap-2"><ChevronRight className="w-3 h-3 text-emerald-400 mt-1 flex-shrink-0" />{s}</li>)}</ul>
              </div>
            )}

            {analysis.weaknesses?.length > 0 && (
              <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-5 mb-4">
                <h3 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Areas for Improvement</h3>
                <ul className="space-y-2">{analysis.weaknesses.map((w, i) => <li key={i} className="text-sm text-gray-300 flex items-start gap-2"><ChevronRight className="w-3 h-3 text-amber-400 mt-1 flex-shrink-0" />{w}</li>)}</ul>
              </div>
            )}

            {analysis.recommendations?.length > 0 && (
              <div className="bg-violet-500/5 border border-violet-500/15 rounded-xl p-5 mb-4">
                <h3 className="text-sm font-bold text-violet-400 mb-3 flex items-center gap-2"><Brain className="w-4 h-4" /> Recommendations</h3>
                <ul className="space-y-2">{analysis.recommendations.map((r, i) => <li key={i} className="text-sm text-gray-300 flex items-start gap-2"><ChevronRight className="w-3 h-3 text-violet-400 mt-1 flex-shrink-0" />{r}</li>)}</ul>
              </div>
            )}

            {analysis.overallFeedback && (
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 mb-8">
                <h3 className="text-sm font-bold text-white mb-2">Overall Feedback</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{analysis.overallFeedback}</p>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button onClick={() => navigate('/interview-history')} className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl font-bold text-sm">View History</button>
              <button onClick={() => navigate('/interview-prep')} className="px-5 py-3 bg-amber-500 text-black rounded-xl font-bold text-sm">New Interview</button>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  // GENERATING REPORT
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

  // ===== MAIN INTERVIEW ROOM =====
  return (
    <div className="min-h-screen bg-[#030303] text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Mic className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h1 className="text-sm font-bold">AI Interview Room</h1>
              <p className="text-[10px] text-gray-500 capitalize">
                {interview?.interviewType?.replace('-', ' ')} • {interview?.targetRole || interview?.difficulty}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {started && (
              <>
                <span className="text-[10px] text-gray-500 flex items-center gap-1 mr-2">
                  <MessageCircle className="w-3 h-3" /> {questionCount}/{MAX_QUESTIONS}
                </span>

                {/* Voice toggle */}
                <button
                  onClick={() => { setVoiceEnabled(!voiceEnabled); if (voiceEnabled) window.speechSynthesis?.cancel(); }}
                  className={`p-2 rounded-lg transition-all ${voiceEnabled ? 'bg-amber-500/10 text-amber-400' : 'bg-white/5 text-gray-500'}`}
                  title={voiceEnabled ? 'AI voice on' : 'AI voice off'}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Code toggle */}
                <button
                  onClick={() => setShowCode(!showCode)}
                  className={`p-2 rounded-lg transition-all ${showCode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-gray-500'}`}
                  title="Toggle code editor"
                >
                  <Code className="w-4 h-4" />
                </button>
              </>
            )}

            {started && !ended ? (
              <button onClick={endInterview} className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all ml-1">
                End
              </button>
            ) : !started && (
              <button onClick={() => navigate('/interview-prep')} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-gray-400 text-xs font-bold">
                Exit
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Chat + Code Layout */}
      <div className={`flex-1 flex ${showCode ? 'flex-col lg:flex-row' : ''} overflow-hidden`}>
        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${showCode ? 'lg:w-1/2' : 'max-w-4xl mx-auto w-full'}`}>
          <div className="flex-1 px-4 py-6 overflow-y-auto">
            {!started ? (
              /* Pre-start */
              <div className="flex items-center justify-center h-full min-h-[60vh]">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-amber-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Ready, <span className="text-amber-400">{interview?.candidateName}</span>?</h2>
                  <p className="text-gray-400 text-sm mb-1 capitalize">{interview?.interviewType?.replace('-', ' ')} Interview{interview?.targetRole && ` • ${interview.targetRole}`}</p>
                  <p className="text-gray-500 text-xs mb-6">{interview?.difficulty === 'easy' ? 'Fresher' : interview?.difficulty === 'hard' ? 'Senior' : 'Mid-Level'} • {MAX_QUESTIONS} questions</p>

                  <div className="text-left bg-white/[0.03] border border-white/10 rounded-xl p-4 mb-6 space-y-2">
                    {[
                      '🎤 Voice input — click mic and speak',
                      '🔊 AI speaks back — fully conversational',
                      '💻 Code editor — toggle anytime',
                      '⌨️ Type answers if you prefer',
                    ].map((tip, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>

                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={startInterview}
                    className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl font-bold text-black transition-all">
                    🎤 Start Interview
                  </motion.button>
                </motion.div>
              </div>
            ) : (
              /* Messages */
              <div className="space-y-4 pb-4">
                {messages.map((msg, idx) => (
                  <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] ${
                      msg.role === 'user'
                        ? 'bg-amber-500/10 border border-amber-500/20 rounded-2xl rounded-br-md'
                        : 'bg-white/[0.03] border border-white/10 rounded-2xl rounded-bl-md'
                    } px-4 py-3`}>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[10px] text-gray-500">
                          {msg.role === 'user' ? '🧑 You' : '🤖 AI Interviewer'}
                        </p>
                        {msg.role === 'interviewer' && voiceEnabled && (
                          <button onClick={() => speakResponse(msg.content)} className="text-gray-600 hover:text-amber-400 transition-colors">
                            <Volume2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}

                {sending && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" /> AI is thinking...
                      </div>
                    </div>
                  </motion.div>
                )}

                {isSpeaking && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
                      <div className="flex gap-0.5">
                        {[0, 1, 2, 3].map(i => (
                          <motion.div key={i} className="w-1 bg-amber-400 rounded-full"
                            animate={{ height: [4, 14, 4] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }} />
                        ))}
                      </div>
                      <span className="text-[10px] text-amber-400 font-bold">Speaking...</span>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          {started && !ended && (
            <div className="border-t border-white/5 bg-black/50 backdrop-blur-xl sticky bottom-0">
              <div className="px-4 py-3">
                {questionCount >= MAX_QUESTIONS ? (
                  <div className="text-center py-2">
                    <p className="text-gray-400 text-sm mb-2">Interview complete!</p>
                    <button onClick={endInterview} className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl font-bold text-black text-sm">
                      Get AI Report
                    </button>
                  </div>
                ) : (
                  <div className="flex items-end gap-2">
                    {/* Mic button */}
                    <button
                      onClick={toggleListening}
                      className={`p-3 rounded-xl transition-all flex-shrink-0 ${
                        isListening
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                      title={isListening ? 'Stop listening' : 'Start voice input'}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>

                    <textarea
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                      placeholder={isListening ? '🎤 Listening... speak now' : 'Type or use mic...'}
                      rows={2}
                      className={`flex-1 bg-white/5 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none resize-none ${
                        isListening ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 focus:border-amber-500/50'
                      }`}
                    />

                    <button onClick={sendMessage} disabled={!input.trim() || sending}
                      className="p-3 bg-amber-500 hover:bg-amber-600 rounded-xl transition-all disabled:opacity-30 flex-shrink-0">
                      <Send className="w-4 h-4 text-black" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Code Editor Panel */}
        <AnimatePresence>
          {showCode && started && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '100%' }}
              exit={{ opacity: 0, width: 0 }}
              className="lg:w-1/2 border-l border-white/5 p-4"
            >
              <CodeEditor
                code={code}
                setCode={setCode}
                language={language}
                setLanguage={setLanguage}
                expanded={codeExpanded}
                setExpanded={setCodeExpanded}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default InterviewRoom;
