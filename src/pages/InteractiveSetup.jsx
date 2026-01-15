import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Briefcase, 
  RefreshCw, 
  Upload, 
  CheckCircle, 
  Linkedin,
  Sparkles,
  MessageCircle,
  Loader2
} from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

const InteractiveSetup = () => {
  const [step, setStep] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [passion, setPassion] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const [acknowledgment, setAcknowledgment] = useState('');
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const navigate = useNavigate();

  const statuses = [
    { 
      id: 'student', 
      label: 'Student', 
      icon: GraduationCap,
      description: 'Currently pursuing education'
    },
    { 
      id: 'graduate', 
      label: 'Graduate', 
      icon: Briefcase,
      description: 'Recently graduated, seeking first role'
    },
    { 
      id: 'career_switcher', 
      label: 'Career Switcher', 
      icon: RefreshCw,
      description: 'Transitioning to a new field'
    }
  ];

  const handleStatusSelect = async (status) => {
    setSelectedStatus(status);
    setTimeout(() => setStep(2), 600);
  };

  const handlePassionSubmit = async () => {
    if (!passion.trim()) return;
    
    setStep(3);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/onboarding/generate-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: selectedStatus, passion })
      });

      const data = await response.json();
      setQuestions(data.questions);
      setLoading(false);
    } catch (error) {
      console.error('Error generating questions:', error);
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (questionId, answer) => {
    if (!answer.trim()) return;

    setAiTyping(true);
    const updatedAnswers = { ...answers, [questionId]: answer };
    setAnswers(updatedAnswers);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/onboarding/conversational-followup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentQuestion: questions[currentQuestionIndex].question,
          userAnswer: answer,
          conversationHistory
        })
      });

      const followup = await response.json();
      setAcknowledgment(followup.acknowledgment);
      
      setConversationHistory([
        ...conversationHistory,
        { question: questions[currentQuestionIndex].question, answer, acknowledgment: followup.acknowledgment }
      ]);

      setAiTyping(false);

      // Move to next question after brief pause
      setTimeout(() => {
        setAcknowledgment('');
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          setStep(4); // Move to profile completion
        }
      }, 2000);
    } catch (error) {
      console.error('Error processing answer:', error);
      setAiTyping(false);
    }
  };

  const handleProfileComplete = async () => {
    if (!resumeUploaded || !linkedinConnected) return;

    setAnalyzing(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/onboarding/analyze-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: selectedStatus,
          passion,
          answers,
          resume: resumeUploaded,
          linkedinData: linkedinConnected
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Store AI analysis in localStorage for dashboard
        localStorage.setItem('careerAnalysis', result.analysis);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error analyzing profile:', error);
      setAnalyzing(false);
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In production, upload to backend
      setResumeUploaded(true);
    }
  };

  const handleLinkedinConnect = () => {
    // In production, OAuth flow
    setLinkedinConnected(true);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Progress Bar */}
      <motion.div className="fixed top-0 left-0 w-full h-1 bg-white/10 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-orange-600 to-amber-400"
          initial={{ width: '0%' }}
          animate={{ width: `${(step / 4) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>

      <div className="w-full max-w-3xl">
        <AnimatePresence mode="wait">
          {/* Step 1: Status Selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                <Sparkles className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <h1 className="text-5xl font-bold text-white mb-3">Welcome to SKILLSPHERE</h1>
                <p className="text-xl text-gray-400">Let's build your AI-powered career journey</p>
              </motion.div>

              <h2 className="text-3xl font-bold text-white mb-8">What's your current status?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statuses.map((status, idx) => (
                  <motion.button
                    key={status.id}
                    onClick={() => handleStatusSelect(status.id)}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-orange-500/50 transition-all"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <status.icon className="w-16 h-16 mx-auto mb-4 text-orange-500" />
                    <h3 className="text-xl font-bold text-white mb-2">{status.label}</h3>
                    <p className="text-sm text-gray-400">{status.description}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Passion Input */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12"
            >
              <MessageCircle className="w-12 h-12 text-orange-500 mb-6" />
              <h2 className="text-4xl font-bold text-white mb-4">What excites you in tech?</h2>
              <p className="text-gray-400 mb-8">This helps our AI personalize your journey</p>
              
              <textarea
                value={passion}
                onChange={(e) => setPassion(e.target.value)}
                placeholder="e.g., I'm passionate about AI/ML and want to build intelligent systems that solve real-world problems..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder:text-gray-600 outline-none focus:border-orange-500/50 resize-none"
                rows="5"
              />

              <motion.button
                onClick={handlePassionSubmit}
                disabled={!passion.trim()}
                className="w-full mt-6 bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Generate My Personalized Assessment
                <Sparkles className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}

          {/* Step 3: AI-Generated Questions */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12"
            >
              {loading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-12 h-12 text-orange-500 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-400">AI is crafting personalized questions for you...</p>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">SKILLSPHERE AI</p>
                        <p className="text-xs text-gray-500">Question {currentQuestionIndex + 1} of {questions.length}</p>
                      </div>
                    </div>
                    
                    {questions[currentQuestionIndex] && (
                      <motion.div
                        key={currentQuestionIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {questions[currentQuestionIndex].question}
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                          {questions[currentQuestionIndex].purpose}
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {acknowledgment && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6"
                    >
                      <p className="text-green-400 text-sm flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {acknowledgment}
                      </p>
                    </motion.div>
                  )}

                  {!answers[questions[currentQuestionIndex]?.id] ? (
                    <div>
                      <textarea
                        id={`answer-${currentQuestionIndex}`}
                        placeholder={questions[currentQuestionIndex]?.placeholder}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white placeholder:text-gray-600 outline-none focus:border-orange-500/50 resize-none"
                        rows="4"
                      />
                      <motion.button
                        onClick={() => {
                          const textarea = document.getElementById(`answer-${currentQuestionIndex}`);
                          handleAnswerSubmit(questions[currentQuestionIndex].id, textarea.value);
                        }}
                        className="w-full mt-4 bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {aiTyping ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            AI is thinking...
                          </>
                        ) : (
                          'Submit Answer →'
                        )}
                      </motion.button>
                    </div>
                  ) : null}
                </>
              )}
            </motion.div>
          )}

          {/* Step 4: Profile Completion */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12"
            >
              <h2 className="text-4xl font-bold text-white mb-8">Complete Your Profile</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Resume Upload */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Upload Resume</h3>
                  <label className={`block w-full border-2 border-dashed ${resumeUploaded ? 'border-green-500' : 'border-white/20'} rounded-xl p-8 cursor-pointer hover:border-orange-500 transition-all`}>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="hidden"
                    />
                    {resumeUploaded ? (
                      <div className="text-center">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                        <p className="text-green-400">Resume uploaded!</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400">Click to upload</p>
                        <p className="text-xs text-gray-600 mt-1">PDF, DOC up to 10MB</p>
                      </div>
                    )}
                  </label>
                </div>

                {/* LinkedIn Connect */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Connect LinkedIn</h3>
                  <button
                    onClick={handleLinkedinConnect}
                    disabled={linkedinConnected}
                    className={`w-full ${linkedinConnected ? 'bg-green-500/20 border-green-500' : 'bg-blue-600 hover:bg-blue-500'} border border-transparent text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all`}
                  >
                    {linkedinConnected ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Connected!
                      </>
                    ) : (
                      <>
                        <Linkedin className="w-5 h-5" />
                        Connect LinkedIn
                      </>
                    )}
                  </button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    We'll import your experience
                  </p>
                </div>
              </div>

              <motion.button
                onClick={handleProfileComplete}
                disabled={!resumeUploaded || !linkedinConnected || analyzing}
                className="w-full bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold py-5 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    AI is analyzing your profile...
                  </>
                ) : (
                  <>
                    Launch My AI Career Dashboard
                    <Sparkles className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InteractiveSetup;
