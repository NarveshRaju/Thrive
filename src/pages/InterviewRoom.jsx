import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RetellWebClient } from 'retell-client-js-sdk';
import Editor from '@monaco-editor/react';
import { useInterview } from '../hooks/useInterview';
import { X, Loader2 } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

function InterviewRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { interview, loading } = useInterview(roomId);
  
  // Interview state
  const [isCallActive, setIsCallActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callId, setCallId] = useState(null);
  const [showReport, setShowReport] = useState(false);
  
  // Transcript & Analysis
  const [conversation, setConversation] = useState([]);
  const [liveAnalysis, setLiveAnalysis] = useState({
    codeQuality: 0,
    communication: 0,
    problemSolving: 0,
    technicalKnowledge: 0,
    overall: 0
  });
  
  // Code editor
  const [code, setCode] = useState('// Start coding here...\n\nfunction solution() {\n  // Your code here\n}\n');
  const [language, setLanguage] = useState('javascript');
  
  // Retell client refs
  const retellClientRef = useRef(null);
  const codeAnalysisTimerRef = useRef(null);
  const transcriptUpdateTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (retellClientRef.current) {
        retellClientRef.current.stopCall();
      }
      if (codeAnalysisTimerRef.current) {
        clearTimeout(codeAnalysisTimerRef.current);
      }
      if (transcriptUpdateTimerRef.current) {
        clearInterval(transcriptUpdateTimerRef.current);
      }
    };
  }, []);

  // Analyze code with Groq while interviewing
  const analyzeCodeWithGroq = async (currentCode) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/ai/analyze-code`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          code: currentCode,
          language,
          context: `Live ${interview?.interviewType} interview - ${interview?.difficulty} difficulty`
        })
      });

      const data = await response.json();
      
      if (data.scores) {
        setLiveAnalysis(prev => ({
          ...prev,
          codeQuality: data.scores.quality || prev.codeQuality,
          problemSolving: data.scores.correctness || prev.problemSolving,
          technicalKnowledge: data.scores.efficiency || prev.technicalKnowledge
        }));

        // Save analysis to backend
        await fetch(`${API_URL}/interview/add-code-analysis/${roomId}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            code: currentCode,
            analysis: data.feedback,
            scores: data.scores
          })
        });
      }
    } catch (error) {
      console.error('Code analysis error:', error);
    }
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    
    // Debounced analysis - analyze after 3 seconds of no typing
    if (codeAnalysisTimerRef.current) {
      clearTimeout(codeAnalysisTimerRef.current);
    }
    
    codeAnalysisTimerRef.current = setTimeout(() => {
      if (isCallActive && newCode.length > 50) {
        analyzeCodeWithGroq(newCode);
        submitCodeToBackend(newCode);
      }
    }, 3000);
  };

  const submitCodeToBackend = async (currentCode) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/interview/submit-code/${roomId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: currentCode, language })
      });
    } catch (error) {
      console.error('Error submitting code:', error);
    }
  };

  // Update transcript in database periodically
  const updateTranscriptInDB = async (messages) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/interview/update-transcript/${roomId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ transcript: messages })
      });
    } catch (error) {
      console.error('Error updating transcript:', error);
    }
  };

  const startInterview = async () => {
    try {
      setIsConnecting(true);
      const token = localStorage.getItem('token');

      // Start interview in backend
      await fetch(`${API_URL}/interview/start/${roomId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Create Retell call
      const response = await fetch(`${API_URL}/retell/create-call`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          candidateName: interview.candidateName,
          roomId,
          interviewType: interview.interviewType
        })
      });

      const data = await response.json();
      
      if (!data.accessToken || !data.callId) {
        throw new Error('Failed to get call credentials');
      }

      const { accessToken, callId: newCallId } = data;
      setCallId(newCallId);

      // Update with Retell call ID
      await fetch(`${API_URL}/interview/start/${roomId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ retellCallId: newCallId })
      });

      // Initialize Retell client
      retellClientRef.current = new RetellWebClient();

      retellClientRef.current.on('call_started', () => {
        console.log('✅ Call started');
        setIsCallActive(true);
        setIsConnecting(false);
        
        // Start periodic transcript updates
        transcriptUpdateTimerRef.current = setInterval(() => {
          if (conversation.length > 0) {
            updateTranscriptInDB(conversation);
          }
        }, 10000); // Every 10 seconds
      });

      retellClientRef.current.on('call_ended', () => {
        console.log('📞 Call ended');
        setIsCallActive(false);
        if (transcriptUpdateTimerRef.current) {
          clearInterval(transcriptUpdateTimerRef.current);
        }
        handleCallEnded(newCallId);
      });

      retellClientRef.current.on('agent_start_talking', () => {
        setIsSpeaking(true);
      });

      retellClientRef.current.on('agent_stop_talking', () => {
        setIsSpeaking(false);
      });

      retellClientRef.current.on('update', (update) => {
        if (update.transcript) {
          const messages = update.transcript.map(t => ({
            role: t.role,
            content: t.content,
            timestamp: new Date()
          }));
          setConversation(messages);
          
          // Calculate communication score based on responses
          const userMessages = messages.filter(m => m.role === 'user');
          if (userMessages.length > 0) {
            const avgLength = userMessages.reduce((sum, m) => sum + m.content.length, 0) / userMessages.length;
            const commScore = Math.min(100, Math.round((avgLength / 50) * 100));
            setLiveAnalysis(prev => ({ ...prev, communication: commScore }));
          }
        }
      });

      retellClientRef.current.on('error', (error) => {
        console.error('❌ Retell error:', error);
        setIsConnecting(false);
        alert('Error connecting to voice system. Please try again.');
      });

      await retellClientRef.current.startCall({
        accessToken,
        sampleRate: 24000,
        captureDeviceId: 'default'
      });

    } catch (error) {
      console.error('Failed to start interview:', error);
      setIsConnecting(false);
      alert('Could not start interview. Please check your microphone and try again.');
    }
  };

  const endInterview = () => {
    if (retellClientRef.current) {
      retellClientRef.current.stopCall();
    }
  };

  const handleCallEnded = async (endedCallId) => {
    try {
      const token = localStorage.getItem('token');

      // Calculate overall score
      const overall = Math.round(
        (liveAnalysis.codeQuality + liveAnalysis.communication + 
         liveAnalysis.problemSolving + liveAnalysis.technicalKnowledge) / 4
      );
      
      const finalScores = { ...liveAnalysis, overall };

      // Get recording URL from Retell
      let recordingUrl = null;
      try {
        const callResponse = await fetch(`${API_URL}/retell/call/${endedCallId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const callData = await callResponse.json();
        recordingUrl = callData.call?.recording_url;
      } catch (err) {
        console.warn('Could not fetch recording:', err);
      }

      // End interview in backend with full data
      const endResponse = await fetch(`${API_URL}/interview/end/${roomId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          scores: finalScores,
          transcript: conversation,
          code,
          language,
          recordingUrl
        })
      });

      const endData = await endResponse.json();
      
      if (endData.success) {
        console.log('✅ Interview completed and saved');
        setLiveAnalysis(finalScores);
        setShowReport(true);
      } else {
        console.error('Failed to save interview:', endData.message);
        setShowReport(true); // Show report anyway
      }
      
    } catch (error) {
      console.error('Failed to end interview:', error);
      setShowReport(true); // Show report anyway
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading interview room...</p>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Interview room not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 rounded-xl transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (showReport) {
    return <FinalReport 
      roomId={roomId}
      scores={liveAnalysis} 
      conversation={conversation}
      code={code}
      language={language}
      candidateName={interview?.candidateName || 'Candidate'}
      onClose={() => navigate('/dashboard')} 
    />;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center">
                  <span className="text-sm font-bold">AI</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold">AI Interview Room</h1>
                  <p className="text-xs text-gray-500">
                    {interview?.interviewType?.toUpperCase()} • {interview?.difficulty?.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {isCallActive && (
                <div className="flex items-center gap-3 text-sm">
                  <ScoreBadge label="Code" value={liveAnalysis.codeQuality} />
                  <ScoreBadge label="Comm" value={liveAnalysis.communication} />
                </div>
              )}
              
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
                    if (retellClientRef.current) {
                      retellClientRef.current.stopCall();
                    }
                    navigate('/dashboard');
                  }
                }}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6" style={{ height: 'calc(100vh - 88px)' }}>
        <div className="grid grid-cols-12 gap-6 h-full">

          {/* Left: AI Interviewer */}
          <div className="col-span-12 lg:col-span-5 flex flex-col">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden flex-1 flex flex-col">
              {/* AI Avatar & Status */}
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center gap-4">
                  <motion.div
                    animate={{
                      scale: isSpeaking ? [1, 1.1, 1] : 1,
                      boxShadow: isSpeaking
                        ? ['0 0 0 0 rgba(251,191,36,0.7)', '0 0 0 20px rgba(251,191,36,0)']
                        : '0 0 0 0 rgba(251,191,36,0)'
                    }}
                    transition={{ repeat: isSpeaking ? Infinity : 0, duration: 1.5 }}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center text-3xl"
                  >
                    👩‍💼
                  </motion.div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">AI Interviewer</h3>
                    <p className="text-sm text-gray-400">Technical Interview Expert</p>
                    
                    <div className="mt-2">
                      <AnimatePresence mode="wait">
                        {isConnecting && (
                          <motion.div key="connecting" className="flex items-center gap-2 text-amber-500 text-sm">
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                            Connecting...
                          </motion.div>
                        )}
                        {isCallActive && isSpeaking && (
                          <motion.div key="speaking" className="flex items-center gap-2 text-amber-500 text-sm">
                            <div className="flex gap-1">
                              {[0, 1, 2].map(i => (
                                <motion.div
                                  key={i}
                                  className="w-1 bg-amber-500 rounded-full"
                                  animate={{ height: [10, 20, 10] }}
                                  transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                                />
                              ))}
                            </div>
                            Speaking...
                          </motion.div>
                        )}
                        {isCallActive && !isSpeaking && (
                          <motion.div key="listening" className="flex items-center gap-2 text-emerald-500 text-sm">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            Listening...
                          </motion.div>
                        )}
                        {!isCallActive && !isConnecting && (
                          <div key="ready" className="text-gray-500 text-sm">Ready to start</div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>

              {/* Conversation Transcript */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {!isCallActive && !isConnecting && (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <div className="mb-6">
                      <h3 className="text-xl font-bold mb-2">
                        Ready for your interview, <span className="text-amber-500">{interview?.candidateName}</span>?
                      </h3>
                      <p className="text-gray-400 text-sm mb-6">
                        {interview?.interviewType?.charAt(0).toUpperCase() + interview?.interviewType?.slice(1)} interview • {interview?.difficulty} difficulty
                      </p>
                      <ul className="text-sm text-gray-500 space-y-2">
                        <li>✓ AI-powered voice interview</li>
                        <li>✓ Real-time code analysis</li>
                        <li>✓ Live conversation & feedback</li>
                        <li>✓ Detailed performance report</li>
                      </ul>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={startInterview}
                      className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl font-semibold text-white shadow-lg shadow-amber-500/50"
                    >
                      🎤 Start Interview
                    </motion.button>
                  </div>
                )}

                {isConnecting && (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
                      <p className="text-gray-400">Connecting to AI interviewer...</p>
                      <p className="text-xs text-gray-600 mt-2">Please allow microphone access</p>
                    </div>
                  </div>
                )}

                {isCallActive && (
                  <AnimatePresence>
                    {conversation.map((msg, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'agent' ? 'justify-start' : 'justify-end'}`}
                      >
                        <div className={`max-w-[85%] p-4 rounded-2xl ${
                          msg.role === 'agent'
                            ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30'
                            : 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Controls */}
              {isCallActive && (
                <div className="p-6 border-t border-gray-800">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={endInterview}
                    className="w-full py-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl font-semibold"
                  >
                    📊 End Interview & Get Report
                  </motion.button>
                  <p className="text-xs text-center text-gray-500 mt-3">
                    Speak clearly • AI is analyzing your code in real-time
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Code Editor */}
          <div className="col-span-12 lg:col-span-7 flex flex-col">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden flex-1 flex flex-col">
              {/* Editor Header */}
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-sm text-gray-400">Code Editor</span>
                </div>
                
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:border-amber-500 focus:outline-none"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
              </div>

              {/* Monaco Editor */}
              <div className="flex-1">
                <Editor
                  height="100%"
                  language={language}
                  value={code}
                  onChange={handleCodeChange}
                  theme="vs-dark"
                  options={{
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    minimap: { enabled: false },
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: 'on',
                    padding: { top: 16, bottom: 16 },
                    cursorBlinking: 'smooth',
                    smoothScrolling: true
                  }}
                />
              </div>

              {/* AI Analysis Indicator */}
              {isCallActive && (
                <div className="p-4 border-t border-gray-800 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-amber-500">AI is analyzing your code...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Score Badge Component
function ScoreBadge({ label, value }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-400">{label}:</span>
      <div className="flex items-center gap-1">
        <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-600"
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-xs font-bold tabular-nums">{value}</span>
      </div>
    </div>
  );
}

// Final Report Component
function FinalReport({ roomId, scores, conversation, code, language, candidateName, onClose }) {
  const navigate = useNavigate();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFullReport();
  }, []);

  const fetchFullReport = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Get interview by roomId first
      const roomResponse = await fetch(`${API_URL}/interview/room/${roomId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const roomData = await roomResponse.json();
      
      if (roomData.success) {
        const interviewId = roomData.interview._id;
        
        // Now get full details
        const detailsResponse = await fetch(`${API_URL}/interview/details/${interviewId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const detailsData = await detailsResponse.json();
        
        if (detailsData.success) {
          setReportData(detailsData.interview);
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching report:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
      </div>
    );
  }

  const aiAnalysis = reportData?.aiAnalysis || {};

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 mb-6"
        >
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Interview Report: <span className="text-amber-500">{candidateName}</span>
              </h1>
              <p className="text-gray-400">
                {reportData?.interviewType?.replace('-', ' ').toUpperCase()} Interview Assessment
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Completed: {new Date(reportData?.completedAt || Date.now()).toLocaleString()}
              </p>
            </div>
            
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              🏠 Dashboard
            </button>
          </div>

          <div className="text-center py-8 border-y border-gray-800">
            <div className="text-6xl font-bold text-amber-500 mb-2">{scores.overall}%</div>
            <p className="text-gray-400">Overall Performance</p>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-6">
            <ScoreCard label="Code Quality" score={scores.codeQuality} />
            <ScoreCard label="Communication" score={scores.communication} />
            <ScoreCard label="Problem Solving" score={scores.problemSolving} />
            <ScoreCard label="Technical" score={scores.technicalKnowledge} />
          </div>
        </motion.div>

        {/* AI Analysis */}
        {aiAnalysis.overallFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 mb-6"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              AI Analysis
            </h2>

            {aiAnalysis.strengths?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-green-400 font-bold mb-2">✅ Strengths</h3>
                <ul className="space-y-2">
                  {aiAnalysis.strengths.map((strength, i) => (
                    <li key={i} className="text-sm text-gray-300 pl-4">• {strength}</li>
                  ))}
                </ul>
              </div>
            )}

            {aiAnalysis.weaknesses?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-amber-400 font-bold mb-2">📈 Areas for Improvement</h3>
                <ul className="space-y-2">
                  {aiAnalysis.weaknesses.map((weakness, i) => (
                    <li key={i} className="text-sm text-gray-300 pl-4">• {weakness}</li>
                  ))}
                </ul>
              </div>
            )}

            {aiAnalysis.recommendations?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-purple-400 font-bold mb-2">💡 Recommendations</h3>
                <ul className="space-y-2">
                  {aiAnalysis.recommendations.map((rec, i) => (
                    <li key={i} className="text-sm text-gray-300 pl-4">• {rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {aiAnalysis.overallFeedback && (
              <div className="bg-white/5 rounded-xl p-4">
                <h3 className="text-white font-bold mb-2">Overall Feedback</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{aiAnalysis.overallFeedback}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Interview Transcript */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8 mb-6"
        >
          <h2 className="text-xl font-bold mb-4">Interview Transcript</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {conversation.length > 0 ? conversation.map((msg, idx) => (
              <div key={idx} className="p-3 bg-gray-800/50 rounded-lg">
                <div className="text-xs text-gray-500 mb-1">
                  {msg.role === 'agent' ? 'AI Interviewer' : candidateName}
                </div>
                <p className="text-sm">{msg.content}</p>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-4">No transcript available</p>
            )}
          </div>
        </motion.div>

        {/* Code Submitted */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-8"
        >
          <h2 className="text-xl font-bold mb-4">Code Submitted</h2>
          <div className="bg-black rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm">
              <code className="text-gray-300">{code || '// No code submitted'}</code>
            </pre>
          </div>
          <p className="text-xs text-gray-500 mt-2">Language: {language}</p>
        </motion.div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4 justify-center">
          <button 
            onClick={() => navigate('/interview-history')}
            className="px-6 py-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition"
          >
            📋 View All Interviews
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl hover:shadow-lg transition"
          >
            🎤 Start New Interview
          </button>
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ label, score }) {
  const getColor = () => {
    if (score >= 75) return 'from-green-500 to-emerald-600';
    if (score >= 50) return 'from-amber-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  return (
    <div className="bg-gray-800/50 p-4 rounded-xl">
      <p className="text-sm text-gray-400 mb-2">{label}</p>
      <div className="text-3xl font-bold mb-2">{score}%</div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${getColor()}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay: 0.3 }}
        />
      </div>
    </div>
  );
}

export default InterviewRoom;
