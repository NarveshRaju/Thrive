import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/DashboardNavbar';
import {
  Send, Sparkles, Download, Upload, FileText, CheckCircle,
  AlertCircle, Loader2, MessageSquare, Target, Zap, User, 
  Mail, Phone, MapPin, Linkedin, Github, Briefcase, Award,
  X, Eye, Save
} from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

const ResumeBuilder = () => {
  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  
  // Resume data
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

  // Chat state
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your AI resume consultant. Upload your resume PDF to extract data, or tell me about yourself and I'll help you build one from scratch!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // ATS state
  const [jobDescription, setJobDescription] = useState('');
  const [atsScore, setAtsScore] = useState(null);
  const [isJDModalOpen, setIsJDModalOpen] = useState(false);

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    loadExistingResume();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadExistingResume = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/resume/get`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (data.success && data.resume) {
        setResumeData(data.resume);
        setJobDescription(data.resume.jobDescription || '');
        setAtsScore(data.resume.atsScore);
        
        if (data.resume.conversationHistory?.length > 0) {
          setMessages(data.resume.conversationHistory);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Load resume error:', error);
      setLoading(false);
    }
  };

  const updateField = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatForTextarea = (value) => {
    return (value || '')
      .split('\n')
      .map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        if (trimmed.startsWith('•')) return trimmed;
        return '• ' + trimmed;
      })
      .join('\n');
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/resume/ai-chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: input.trim(),
          resumeData,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      const data = await response.json();

      const aiMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      await saveResume([...messages, userMessage, aiMessage]);

    } catch (error) {
      console.error('AI chat error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handlePdfUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/resume/extract`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setResumeData(prev => ({
          ...prev,
          fullName: data.fullName || prev.fullName,
          headline: data.headline || prev.headline,
          email: data.email || prev.email,
          phone: data.phone || prev.phone,
          linkedin: data.linkedin || prev.linkedin,
          github: data.github || prev.github,
          locationText: data.locationText || prev.locationText,
          summary: data.summary || prev.summary,
          skills: data.skills || prev.skills,
          experience: formatForTextarea(data.experience || prev.experience),
          projects: formatForTextarea(data.projects || prev.projects),
          education: formatForTextarea(data.education || prev.education)
        }));

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `✅ Successfully extracted your resume! I found:\n\n• Name: ${data.fullName || 'Not found'}\n• Email: ${data.email || 'Not found'}\n• Skills: ${data.skills ? 'Found' : 'Not found'}\n\nWhat would you like to improve?`,
          timestamp: new Date()
        }]);

        await saveResume();
      }

    } catch (error) {
      console.error('PDF upload error:', error);
      alert('Failed to extract resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const calculateATS = async () => {
    if (!jobDescription.trim()) {
      alert('Please add a job description first');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/resume/ats-score`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resumeData,
          jobDescription
        })
      });

      const data = await response.json();

      if (data.success) {
        setAtsScore(data);
        setIsJDModalOpen(false);
        
        // Add AI message about ATS score
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `📊 ATS Score calculated: **${data.score}/100** - ${data.verdict}\n\n✅ Matched keywords: ${data.keywordMatches?.slice(0, 5).join(', ')}\n\n❌ Missing keywords: ${data.missingKeywords?.slice(0, 5).join(', ')}\n\nWould you like me to help you add these missing keywords?`,
          timestamp: new Date()
        }]);

        await saveResume(messages, data);
      }

    } catch (error) {
      console.error('ATS calculation error:', error);
    }
  };

  const saveResume = async (conversationHistory = messages, ats = atsScore) => {
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
          atsScore: ats,
          jobDescription,
          conversationHistory
        })
      });

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
      </div>
    );
  }

  const inputClass = "w-full rounded-2xl bg-[#080b12] border border-[#1F242D] px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/40 transition";

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <Navbar />

      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                AI Resume Builder
              </h1>
              <p className="text-gray-400">Build, optimize, and perfect your resume with AI</p>
            </div>

            <div className="flex gap-3">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                />
                <div className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center gap-2 transition-colors">
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Upload PDF'}
                </div>
              </label>

              <button
                onClick={() => setIsPreviewOpen(true)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center gap-2 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>

              <button
                onClick={downloadPDF}
                disabled={downloading || !resumeData.fullName}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center gap-2 hover:shadow-lg transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {downloading ? 'Generating...' : 'Download'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Resume Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Chat Card */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                Chat with AI to refine your resume
              </h3>

              <div className="bg-[#080b12] rounded-2xl p-4 h-64 overflow-y-auto mb-4 space-y-3">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] p-3 rounded-xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                        : 'bg-white/5 border border-white/10'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
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
                  placeholder="Ask AI to improve your resume..."
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
            </div>

            {/* Resume Form */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Resume Details
              </h3>

              <div className="space-y-4">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={resumeData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    placeholder="Full Name *"
                    className={inputClass}
                  />
                  <input
                    type="text"
                    value={resumeData.headline}
                    onChange={(e) => updateField('headline', e.target.value)}
                    placeholder="Professional Headline"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="email"
                    value={resumeData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="Email *"
                    className={inputClass}
                  />
                  <input
                    type="tel"
                    value={resumeData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="Phone"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={resumeData.locationText}
                    onChange={(e) => updateField('locationText', e.target.value)}
                    placeholder="Location"
                    className={inputClass}
                  />
                  <input
                    type="text"
                    value={resumeData.linkedin}
                    onChange={(e) => updateField('linkedin', e.target.value)}
                    placeholder="LinkedIn URL"
                    className={inputClass}
                  />
                  <input
                    type="text"
                    value={resumeData.github}
                    onChange={(e) => updateField('github', e.target.value)}
                    placeholder="GitHub URL"
                    className={inputClass}
                  />
                </div>

                {/* Summary */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Professional Summary</label>
                  <textarea
                    value={resumeData.summary}
                    onChange={(e) => updateField('summary', e.target.value)}
                    placeholder="A compelling summary of your experience and goals..."
                    className={`${inputClass} h-20 resize-none`}
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Skills (comma separated)</label>
                  <textarea
                    value={resumeData.skills}
                    onChange={(e) => updateField('skills', e.target.value)}
                    placeholder="JavaScript, React, Node.js, MongoDB, TypeScript..."
                    className={`${inputClass} h-16 resize-none`}
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Work Experience (one bullet per line)</label>
                  <textarea
                    value={resumeData.experience}
                    onChange={(e) => updateField('experience', e.target.value)}
                    placeholder="• Software Engineer at Company (2020-2023)&#10;• Built scalable web apps serving 1M+ users&#10;• Led team of 5 developers..."
                    className={`${inputClass} h-32 resize-none`}
                  />
                </div>

                {/* Projects */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Projects</label>
                  <textarea
                    value={resumeData.projects}
                    onChange={(e) => updateField('projects', e.target.value)}
                    placeholder="• Project Name - Brief description&#10;• Tech stack: React, Node.js, MongoDB&#10;• Impact: 50% performance improvement..."
                    className={`${inputClass} h-32 resize-none`}
                  />
                </div>

                {/* Education */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Education</label>
                  <textarea
                    value={resumeData.education}
                    onChange={(e) => updateField('education', e.target.value)}
                    placeholder="• B.Tech Computer Science, University Name (2016-2020)&#10;• GPA: 8.5/10&#10;• Relevant coursework: Data Structures, Algorithms..."
                    className={`${inputClass} h-24 resize-none`}
                  />
                </div>

                <button
                  onClick={() => saveResume()}
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Saving...' : 'Save Progress'}
                </button>
              </div>
            </div>
          </div>

          {/* Right: ATS Panel */}
          <div className="space-y-6">
            {/* Job Description */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-400" />
                Job Description
              </h3>

              <p className="text-xs text-gray-500 mb-3">
                Paste the job description to get AI-powered ATS insights
              </p>

              <button
                onClick={() => setIsJDModalOpen(true)}
                className="w-full py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 rounded-xl transition-colors text-amber-400 font-medium"
              >
                {jobDescription ? 'Edit Job Description' : '+ Add Job Description'}
              </button>

              {jobDescription && (
                <div className="mt-3 p-3 bg-white/5 rounded-xl text-xs text-gray-400 max-h-32 overflow-y-auto">
                  {jobDescription.substring(0, 200)}...
                </div>
              )}
            </div>

            {/* ATS Score */}
            {atsScore ? (
              <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-green-400" />
                  ATS Score
                </h3>

                <div className="text-center mb-4">
                  <div className={`text-6xl font-bold mb-2 ${
                    atsScore.score >= 80 ? 'text-emerald-400' :
                    atsScore.score >= 60 ? 'text-amber-300' : 'text-red-400'
                  }`}>
                    {atsScore.score}
                  </div>
                  <p className="text-sm text-gray-400">{atsScore.verdict}</p>
                </div>

                <div className="space-y-4">
                  {atsScore.keywordMatches?.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        Matched Keywords
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {atsScore.keywordMatches.map((kw, i) => (
                          <span key={i} className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-lg">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {atsScore.missingKeywords?.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-red-400" />
                        Missing Keywords
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {atsScore.missingKeywords.slice(0, 8).map((kw, i) => (
                          <span key={i} className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-lg">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {atsScore.suggestions?.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">💡 Suggestions</p>
                      <ul className="space-y-1">
                        {atsScore.suggestions.map((sug, i) => (
                          <li key={i} className="text-xs text-gray-400">• {sug}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-black/40 border border-white/10 rounded-2xl p-6 text-center">
                <Target className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-400">
                  Add a job description to unlock ATS scoring
                </p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Quick Actions</h3>
              <div className="space-y-2 text-sm">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  ← Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Job Description Modal */}
      {isJDModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#080b12] border border-white/10 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Job Description</h3>
              <button
                onClick={() => setIsJDModalOpen(false)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-400 mb-4">
              Paste the full job description here. AI will analyze it to optimize your resume for ATS.
            </p>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job description here..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 h-64 resize-none focus:outline-none focus:border-amber-500"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setIsJDModalOpen(false)}
                className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={calculateATS}
                className="flex-1 py-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl hover:shadow-lg transition-all"
              >
                Calculate ATS Score
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Resume Preview</h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Resume Template Preview */}
            <div className="p-8 bg-white text-gray-900">
              {/* Header */}
              <div className="text-center mb-6 pb-6 border-b-2 border-amber-500">
                <h1 className="text-4xl font-bold mb-2">{resumeData.fullName || 'Your Name'}</h1>
                {resumeData.headline && <p className="text-lg text-amber-600 mb-3">{resumeData.headline}</p>}
                <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-600">
                  {resumeData.email && <span>📧 {resumeData.email}</span>}
                  {resumeData.phone && <span>📱 {resumeData.phone}</span>}
                  {resumeData.locationText && <span>📍 {resumeData.locationText}</span>}
                  {resumeData.linkedin && <span>🔗 LinkedIn</span>}
                  {resumeData.github && <span>💻 GitHub</span>}
                </div>
              </div>

              {/* Summary */}
              {resumeData.summary && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-amber-600 mb-2 border-b border-gray-300 pb-1">SUMMARY</h2>
                  <p className="text-sm leading-relaxed">{resumeData.summary}</p>
                </div>
              )}

              {/* Skills */}
              {resumeData.skills && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-amber-600 mb-2 border-b border-gray-300 pb-1">SKILLS</h2>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.split(',').map((skill, i) => (
                      <span key={i} className="bg-gray-900 text-amber-400 px-3 py-1 rounded-full text-xs font-medium">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {resumeData.experience && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-amber-600 mb-2 border-b border-gray-300 pb-1">EXPERIENCE</h2>
                  <div className="text-sm space-y-1">
                    {resumeData.experience.split('\n').filter(l => l.trim()).map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {resumeData.projects && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-amber-600 mb-2 border-b border-gray-300 pb-1">PROJECTS</h2>
                  <div className="text-sm space-y-1">
                    {resumeData.projects.split('\n').filter(l => l.trim()).map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {resumeData.education && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-amber-600 mb-2 border-b border-gray-300 pb-1">EDUCATION</h2>
                  <div className="text-sm space-y-1">
                    {resumeData.education.split('\n').filter(l => l.trim()).map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;
