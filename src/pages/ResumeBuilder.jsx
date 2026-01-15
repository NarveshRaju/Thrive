import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/DashboardNavbar';
import {
  Send, Sparkles, Download, Upload, Zap, Loader2, 
  X, Eye, Save, Target, CheckCircle, AlertCircle, RefreshCw
} from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  
  const [resumeData, setResumeData] = useState({
    fullName: '',
    headline: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    locationText: '',
    summary: '',
    skills: '',
    experience: '',
    projects: '',
    education: ''
  });

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Hi! I'm your AI resume consultant. I can auto-generate your resume from your profile, or help you customize any section. What would you like to do?",
      timestamp: new Date()
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [atsAnalysis, setAtsAnalysis] = useState(null);
  const [isJDModalOpen, setIsJDModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [enhancingSection, setEnhancingSection] = useState(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ===== AUTO-GENERATE FROM PROFILE =====
  const generateFromProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/profile/generate-resume-from-profile`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (data.success) {
        setResumeData(data.resumeData);
        
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `✨ **Resume auto-generated from your profile!**\n\nI've pulled data from:\n• Your LinkedIn profile\n• Uploaded resume\n• Learning achievements\n• Interview performance\n\nReview the fields and let me know what to improve!`,
          timestamp: new Date()
        }]);
      }

    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to auto-generate resume');
    } finally {
      setLoading(false);
    }
  };

  // ===== ENHANCE SECTION WITH AI =====
  const enhanceSection = async (section, currentContent) => {
    try {
      setEnhancingSection(section);
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/profile/enhance-resume-section`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          section,
          currentContent,
          targetRole: resumeData.headline || 'Software Engineer'
        })
      });

      const data = await response.json();

      if (data.success) {
        setResumeData(prev => ({
          ...prev,
          [section]: data.enhancedContent
        }));

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `✅ Enhanced your **${section}** section with:\n• ATS keywords\n• Quantified metrics\n• Strong action verbs\n\nCheck it out!`,
          timestamp: new Date()
        }]);
      }

    } catch (error) {
      console.error('Enhancement error:', error);
    } finally {
      setEnhancingSection(null);
    }
  };

  // ===== ANALYZE JOB DESCRIPTION =====
  const analyzeJobDescription = async () => {
    if (!jobDescription.trim()) {
      alert('Please add a job description first');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/profile/analyze-job-description`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobDescription,
          currentResume: resumeData
        })
      });

      const data = await response.json();

      if (data.success) {
        setAtsAnalysis(data);
        setIsJDModalOpen(false);

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `📊 **ATS Analysis Complete!**\n\n**Score:** ${data.estimatedAtsScore}/100 - ${data.verdict}\n\n**Matched Skills (${data.matchedSkills?.length}):** ${data.matchedSkills?.slice(0, 5).join(', ')}\n\n**Missing Skills (${data.missingSkills?.length}):** ${data.missingSkills?.slice(0, 5).join(', ')}\n\n**Top Suggestions:**\n${data.suggestedImprovements?.slice(0, 3).map(s => `• ${s}`).join('\n')}\n\nWant me to auto-add these keywords?`,
          timestamp: new Date()
        }]);
      }

    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ===== CHAT WITH AI =====
  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input.trim();
    setInput('');
    setIsTyping(true);

    try {
      const token = localStorage.getItem('token');
      
      // Smart command detection
      if (userInput.toLowerCase().includes('generate') || userInput.toLowerCase().includes('auto')) {
        await generateFromProfile();
        setIsTyping(false);
        return;
      }

      const response = await fetch(`${API_URL}/resume/ai-chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userInput,
          resumeData,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      const data = await response.json();

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      }]);

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // ===== SAVE & DOWNLOAD =====
  const saveResume = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');

      await fetch(`${API_URL}/resume/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resumeData,
          atsAnalysis,
          jobDescription,
          conversationHistory: messages
        })
      });

      alert('✅ Resume saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setSaving(false);
    }
  };

  const downloadPDF = async () => {
    try {
      setDownloading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/resume/export`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resumeData)
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeData.fullName || 'resume'}_resume.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to generate PDF');
    } finally {
      setDownloading(false);
    }
  };

  const inputClass = "w-full rounded-xl bg-[#080b12] border border-[#1F242D] px-4 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/40 transition";

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <Navbar />

      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                AI Resume Builder
              </h1>
              <p className="text-gray-400">Powered by Gemini AI • Auto-generates from your profile</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={generateFromProfile}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 font-bold"
              >
                <Sparkles className="w-5 h-5" />
                {loading ? 'Generating...' : 'Auto-Generate'}
              </button>

              <button
                onClick={() => setIsPreviewOpen(true)}
                className="px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center gap-2"
              >
                <Eye className="w-5 h-5" />
                Preview
              </button>

              <button
                onClick={downloadPDF}
                disabled={downloading || !resumeData.fullName}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center gap-2 hover:shadow-lg disabled:opacity-50 font-bold"
              >
                <Download className="w-5 h-5" />
                {downloading ? 'Generating...' : 'Download PDF'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: AI Chat + Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Chat */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                AI Resume Consultant
              </h3>

              <div className="bg-[#080b12] rounded-2xl p-4 h-80 overflow-y-auto mb-4 space-y-3">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                        : 'bg-white/5 border border-white/10'
                    }`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type 'auto-generate' or ask me anything..."
                  className={inputClass}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isTyping}
                  className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => setInput('Auto-generate my resume from profile')}
                  className="px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-xl text-purple-400 text-xs font-bold hover:bg-purple-500/30 transition-all"
                >
                  💫 Auto-Generate
                </button>
                <button
                  onClick={() => setInput('Enhance my summary for ATS')}
                  className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-xl text-cyan-400 text-xs font-bold hover:bg-cyan-500/30 transition-all"
                >
                  ✨ Enhance Summary
                </button>
                <button
                  onClick={() => setInput('Add more technical skills')}
                  className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 text-xs font-bold hover:bg-green-500/30 transition-all"
                >
                  🎯 Add Skills
                </button>
              </div>
            </div>

            {/* Resume Form */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Resume Details</h3>

              <div className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Full Name *</label>
                    <input
                      type="text"
                      value={resumeData.fullName}
                      onChange={(e) => setResumeData(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="John Doe"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block flex items-center justify-between">
                      <span>Professional Headline</span>
                      <button
                        onClick={() => enhanceSection('headline', resumeData.headline)}
                        disabled={enhancingSection === 'headline'}
                        className="text-amber-400 hover:text-amber-300 transition-colors disabled:opacity-50"
                      >
                        {enhancingSection === 'headline' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                      </button>
                    </label>
                    <input
                      type="text"
                      value={resumeData.headline}
                      onChange={(e) => setResumeData(prev => ({ ...prev, headline: e.target.value }))}
                      placeholder="Full Stack Developer | React Expert"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Contact */}
                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="email"
                    value={resumeData.email}
                    onChange={(e) => setResumeData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Email"
                    className={inputClass}
                  />
                  <input
                    type="tel"
                    value={resumeData.phone}
                    onChange={(e) => setResumeData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Phone"
                    className={inputClass}
                  />
                  <input
                    type="text"
                    value={resumeData.locationText}
                    onChange={(e) => setResumeData(prev => ({ ...prev, locationText: e.target.value }))}
                    placeholder="Location"
                    className={inputClass}
                  />
                </div>

                {/* Links */}
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={resumeData.linkedin}
                    onChange={(e) => setResumeData(prev => ({ ...prev, linkedin: e.target.value }))}
                    placeholder="LinkedIn URL"
                    className={inputClass}
                  />
                  <input
                    type="text"
                    value={resumeData.github}
                    onChange={(e) => setResumeData(prev => ({ ...prev, github: e.target.value }))}
                    placeholder="GitHub URL"
                    className={inputClass}
                  />
                </div>

                {/* Summary */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block flex items-center justify-between">
                    <span>Professional Summary</span>
                    <button
                      onClick={() => enhanceSection('summary', resumeData.summary)}
                      disabled={enhancingSection === 'summary'}
                      className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-xs font-bold"
                    >
                      {enhancingSection === 'summary' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                      AI Enhance
                    </button>
                  </label>
                  <textarea
                    value={resumeData.summary}
                    onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                    placeholder="Compelling 3-4 sentence summary..."
                    className={`${inputClass} h-24 resize-none`}
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block flex items-center justify-between">
                    <span>Skills (comma separated)</span>
                    <button
                      onClick={() => enhanceSection('skills', resumeData.skills)}
                      disabled={enhancingSection === 'skills'}
                      className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-xs font-bold"
                    >
                      {enhancingSection === 'skills' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                      AI Enhance
                    </button>
                  </label>
                  <textarea
                    value={resumeData.skills}
                    onChange={(e) => setResumeData(prev => ({ ...prev, skills: e.target.value }))}
                    placeholder="JavaScript, React, Node.js, MongoDB..."
                    className={`${inputClass} h-20 resize-none`}
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block flex items-center justify-between">
                    <span>Work Experience</span>
                    <button
                      onClick={() => enhanceSection('experience', resumeData.experience)}
                      disabled={enhancingSection === 'experience'}
                      className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-xs font-bold"
                    >
                      {enhancingSection === 'experience' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                      AI Enhance
                    </button>
                  </label>
                  <textarea
                    value={resumeData.experience}
                    onChange={(e) => setResumeData(prev => ({ ...prev, experience: e.target.value }))}
                    placeholder="• Software Engineer at Company (2020-2023)&#10;• Built scalable apps serving 1M+ users..."
                    className={`${inputClass} h-32 resize-none`}
                  />
                </div>

                {/* Projects */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block flex items-center justify-between">
                    <span>Projects</span>
                    <button
                      onClick={() => enhanceSection('projects', resumeData.projects)}
                      disabled={enhancingSection === 'projects'}
                      className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-xs font-bold"
                    >
                      {enhancingSection === 'projects' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                      AI Enhance
                    </button>
                  </label>
                  <textarea
                    value={resumeData.projects}
                    onChange={(e) => setResumeData(prev => ({ ...prev, projects: e.target.value }))}
                    placeholder="• Project Name - Description&#10;• Tech: React, Node.js..."
                    className={`${inputClass} h-32 resize-none`}
                  />
                </div>

                {/* Education */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Education</label>
                  <textarea
                    value={resumeData.education}
                    onChange={(e) => setResumeData(prev => ({ ...prev, education: e.target.value }))}
                    placeholder="• B.Tech CS, University (2016-2020)..."
                    className={`${inputClass} h-20 resize-none`}
                  />
                </div>

                <button
                  onClick={saveResume}
                  disabled={saving}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  <Save className="w-5 h-5 inline mr-2" />
                  {saving ? 'Saving...' : 'Save Resume'}
                </button>
              </div>
            </div>
          </div>

          {/* Right: ATS Analysis */}
          <div className="space-y-6">
            {/* Job Description */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-400" />
                ATS Analyzer
              </h3>

              <button
                onClick={() => setIsJDModalOpen(true)}
                className="w-full py-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 rounded-xl transition-colors text-amber-400 font-bold"
              >
                {jobDescription ? '📝 Edit Job Description' : '+ Add Job Description'}
              </button>

              {jobDescription && (
                <div className="mt-3 p-3 bg-white/5 rounded-xl text-xs text-gray-400 max-h-24 overflow-y-auto">
                  {jobDescription.substring(0, 150)}...
                </div>
              )}
            </div>

            {/* ATS Score */}
            {atsAnalysis ? (
              <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  ATS Score
                </h3>

                <div className="text-center mb-6">
                  <div className={`text-7xl font-bold mb-2 ${
                    atsAnalysis.estimatedAtsScore >= 80 ? 'text-emerald-400' :
                    atsAnalysis.estimatedAtsScore >= 60 ? 'text-amber-300' : 'text-red-400'
                  }`}>
                    {atsAnalysis.estimatedAtsScore}
                  </div>
                  <p className="text-sm text-gray-400 font-bold">{atsAnalysis.verdict}</p>
                </div>

                <div className="space-y-4">
                  {atsAnalysis.matchedSkills?.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        Matched Skills ({atsAnalysis.matchedSkills.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {atsAnalysis.matchedSkills.slice(0, 8).map((kw, i) => (
                          <span key={i} className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-lg font-medium">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {atsAnalysis.missingSkills?.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-red-400" />
                        Missing Skills ({atsAnalysis.missingSkills.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {atsAnalysis.missingSkills.slice(0, 8).map((kw, i) => (
                          <span key={i} className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-lg font-medium">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {atsAnalysis.suggestedImprovements?.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">💡 AI Suggestions</p>
                      <ul className="space-y-2">
                        {atsAnalysis.suggestedImprovements.slice(0, 5).map((sug, i) => (
                          <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                            <span className="text-cyan-400 mt-0.5">•</span>
                            <span>{sug}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-black/40 border border-white/10 rounded-2xl p-6 text-center">
                <Target className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-400 mb-4">
                  Add a job description to get AI-powered ATS insights
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Job Description Modal */}
      {isJDModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#080b12] border border-white/10 rounded-2xl p-6 max-w-2xl w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Job Description</h3>
              <button onClick={() => setIsJDModalOpen(false)} className="p-2 hover:bg-white/5 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste full job description here..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 h-80 resize-none focus:outline-none focus:border-amber-500"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setIsJDModalOpen(false)}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                onClick={analyzeJobDescription}
                className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl hover:shadow-lg font-bold"
              >
                🎯 Analyze with AI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal - (Keep your existing preview code) */}
    </div>
  );
};

export default ResumeBuilder;
