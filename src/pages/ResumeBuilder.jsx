import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '../components/layout/DashboardNavbar';
import {
  Sparkles, Download, Loader2, X, Eye, Save, Target, CheckCircle,
  AlertCircle, RefreshCw, FileText, Zap, ChevronRight, ArrowLeft,
  Upload, Briefcase, GraduationCap, Code, User, Mail, Phone,
  MapPin, Linkedin, Github, Brain, BarChart3, TrendingUp, Star
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://thrive-3r8o.onrender.com/api';

// Section config
const SECTIONS = [
  { key: 'summary', label: 'Professional Summary', icon: User, placeholder: 'Write a compelling 3-4 sentence summary of your career, skills, and goals...', type: 'textarea' },
  { key: 'skills', label: 'Technical Skills', icon: Code, placeholder: 'React, Node.js, Python, MongoDB, AWS, Docker...', type: 'textarea' },
  { key: 'experience', label: 'Work Experience', icon: Briefcase, placeholder: '• Software Engineer at TechCorp (2022-Present)\n• Built microservices handling 10K+ requests/sec\n• Led a team of 4 developers...', type: 'textarea' },
  { key: 'projects', label: 'Projects', icon: Star, placeholder: '• E-commerce Platform - Full-stack React + Node.js app\n  Tech: React, Redux, Node.js, MongoDB\n  Impact: 500+ daily users...', type: 'textarea' },
  { key: 'education', label: 'Education', icon: GraduationCap, placeholder: '• B.Tech in Computer Science, XYZ University (2020-2024)\n  GPA: 8.5/10...', type: 'textarea' },
];

// Editable field component
const EditableField = ({ label, value, onChange, placeholder, icon: Icon, small }) => (
  <div className={small ? '' : 'mb-3'}>
    <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
      {Icon && <Icon className="w-3 h-3" />}
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 outline-none transition-all"
    />
  </div>
);

// Section editor with AI enhance
const SectionEditor = ({ section, value, onChange, onEnhance, enhancing }) => {
  const Icon = section.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.02] border border-white/10 rounded-xl p-4 mb-4 hover:border-white/15 transition-all group"
    >
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center gap-2 text-xs font-bold text-gray-300 uppercase tracking-widest">
          <Icon className="w-4 h-4 text-amber-400" />
          {section.label}
        </label>
        <button
          onClick={() => onEnhance(section.key, value)}
          disabled={enhancing === section.key || !value?.trim()}
          className="flex items-center gap-1 px-3 py-1 text-[10px] font-bold bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-lg text-amber-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {enhancing === section.key ? (
            <><Loader2 className="w-3 h-3 animate-spin" /> Enhancing...</>
          ) : (
            <><Sparkles className="w-3 h-3" /> AI Enhance</>
          )}
        </button>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={section.placeholder}
        rows={section.key === 'summary' ? 3 : 5}
        className="w-full bg-black/30 border border-white/5 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-amber-500/30 outline-none transition-all resize-none leading-relaxed font-mono"
      />
    </motion.div>
  );
};

// Live Resume Preview
const ResumePreview = ({ data }) => {
  const renderBullets = (text) => {
    if (!text) return null;
    return text.split('\n').filter(l => l.trim()).map((line, i) => (
      <p key={i} className="text-[10px] leading-relaxed text-gray-700 mb-0.5">
        {line.trim().startsWith('•') ? line.trim() : `• ${line.trim()}`}
      </p>
    ));
  };

  const renderSkills = (text) => {
    if (!text) return null;
    return text.split(/[,\n]/).map(s => s.trim()).filter(Boolean).map((skill, i) => (
      <span key={i} className="inline-block bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-[8px] font-medium mr-1 mb-1">
        {skill}
      </span>
    ));
  };

  return (
    <div className="bg-white text-black rounded-lg shadow-2xl overflow-hidden" style={{ fontSize: '11px', lineHeight: '1.4' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-5 py-4">
        <h1 className="text-lg font-bold tracking-tight">{data.fullName || 'Your Name'}</h1>
        {data.headline && <p className="text-amber-400 text-[10px] font-medium mt-0.5">{data.headline}</p>}
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5 text-[8px] text-gray-300">
          {data.email && <span>{data.email}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.locationText && <span>{data.locationText}</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
          {data.github && <span>{data.github}</span>}
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-3 space-y-3">
        {data.summary && (
          <div>
            <h2 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest border-b border-amber-200 pb-0.5 mb-1">Summary</h2>
            <p className="text-[10px] text-gray-600 leading-relaxed">{data.summary}</p>
          </div>
        )}
        {data.skills && (
          <div>
            <h2 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest border-b border-amber-200 pb-0.5 mb-1">Skills</h2>
            <div className="flex flex-wrap">{renderSkills(data.skills)}</div>
          </div>
        )}
        {data.experience && (
          <div>
            <h2 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest border-b border-amber-200 pb-0.5 mb-1">Experience</h2>
            {renderBullets(data.experience)}
          </div>
        )}
        {data.projects && (
          <div>
            <h2 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest border-b border-amber-200 pb-0.5 mb-1">Projects</h2>
            {renderBullets(data.projects)}
          </div>
        )}
        {data.education && (
          <div>
            <h2 className="text-[10px] font-bold text-amber-600 uppercase tracking-widest border-b border-amber-200 pb-0.5 mb-1">Education</h2>
            {renderBullets(data.education)}
          </div>
        )}
      </div>
    </div>
  );
};

// ATS Score display
const ATSScoreDisplay = ({ analysis }) => {
  if (!analysis) return null;
  const score = analysis.estimatedAtsScore || 0;
  const color = score >= 75 ? 'emerald' : score >= 50 ? 'amber' : 'red';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/[0.03] border border-white/10 rounded-xl p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-amber-400" /> ATS Score
        </h3>
        <span className={`text-2xl font-bold text-${color}-400`}>{score}%</span>
      </div>
      <p className={`text-xs font-semibold text-${color}-400`}>{analysis.verdict}</p>

      {analysis.matchedSkills?.length > 0 && (
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Matched Skills</p>
          <div className="flex flex-wrap gap-1">
            {analysis.matchedSkills.slice(0, 8).map((s, i) => (
              <span key={i} className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] text-emerald-400">{s}</span>
            ))}
          </div>
        </div>
      )}

      {analysis.missingSkills?.length > 0 && (
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Missing Skills</p>
          <div className="flex flex-wrap gap-1">
            {analysis.missingSkills.slice(0, 8).map((s, i) => (
              <span key={i} className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded text-[10px] text-red-400">{s}</span>
            ))}
          </div>
        </div>
      )}

      {analysis.suggestedImprovements?.length > 0 && (
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Suggestions</p>
          <ul className="space-y-1">
            {analysis.suggestedImprovements.slice(0, 4).map((s, i) => (
              <li key={i} className="text-[11px] text-gray-300 flex items-start gap-1.5">
                <ChevronRight className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

// ====== MAIN COMPONENT ======
const ResumeBuilder = () => {
  const navigate = useNavigate();
  const printRef = useRef(null);

  const [resumeData, setResumeData] = useState({
    fullName: '', headline: '', email: '', phone: '',
    linkedin: '', github: '', locationText: '',
    summary: '', skills: '', experience: '', projects: '', education: ''
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [enhancing, setEnhancing] = useState(null);
  const [atsAnalysis, setAtsAnalysis] = useState(null);
  const [showJDModal, setShowJDModal] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [analyzingJD, setAnalyzingJD] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [loadingExisting, setLoadingExisting] = useState(true);

  // Load existing resume on mount
  useEffect(() => {
    loadExistingResume();
  }, []);

  const showStatus = (message, type = 'success') => {
    setStatusMessage({ message, type });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const loadExistingResume = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { setLoadingExisting(false); return; }

      const response = await fetch(`${API_URL}/resume/get`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.success && data.resume) {
        setResumeData({
          fullName: data.resume.fullName || '',
          headline: data.resume.headline || '',
          email: data.resume.email || '',
          phone: data.resume.phone || '',
          linkedin: data.resume.linkedin || '',
          github: data.resume.github || '',
          locationText: data.resume.locationText || '',
          summary: data.resume.summary || '',
          skills: data.resume.skills || '',
          experience: data.resume.experience || '',
          projects: data.resume.projects || '',
          education: data.resume.education || ''
        });
        showStatus('Loaded your saved resume');
      }
    } catch (err) {
      console.error('Load error:', err);
    } finally {
      setLoadingExisting(false);
    }
  };

  const updateField = (key, value) => {
    setResumeData(prev => ({ ...prev, [key]: value }));
  };

  // AI Auto-generate
  const generateFromProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_URL}/profile/generate-resume-from-profile`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (data.success && data.resumeData) {
        setResumeData(prev => ({
          ...prev,
          ...data.resumeData
        }));
        showStatus('Resume auto-generated from your profile!');
      } else {
        showStatus(data.message || 'Failed to generate', 'error');
      }
    } catch (error) {
      console.error('Generation error:', error);
      showStatus('Failed to generate resume', 'error');
    } finally {
      setLoading(false);
    }
  };

  // AI Enhance section
  const enhanceSection = async (section, currentContent) => {
    if (!currentContent?.trim()) return;
    try {
      setEnhancing(section);
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
        updateField(section, data.enhancedContent);
        showStatus(`${section} enhanced with AI!`);
      }
    } catch (error) {
      console.error('Enhancement error:', error);
      showStatus('Enhancement failed', 'error');
    } finally {
      setEnhancing(null);
    }
  };

  // ATS Analysis
  const analyzeJD = async () => {
    if (!jobDescription.trim()) return;
    try {
      setAnalyzingJD(true);
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
        setShowJDModal(false);
        showStatus(`ATS Score: ${data.estimatedAtsScore}%`);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      showStatus('Analysis failed', 'error');
    } finally {
      setAnalyzingJD(false);
    }
  };

  // Save
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
        body: JSON.stringify({ resumeData, atsScore: atsAnalysis?.estimatedAtsScore, jobDescription })
      });

      showStatus('Resume saved!');
    } catch (error) {
      showStatus('Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  // PDF Download - client side
  const downloadPDF = () => {
    const printWindow = window.open('', '_blank');
    const { fullName, headline, email, phone, locationText, linkedin, github, summary, skills, experience, projects, education } = resumeData;

    const contactParts = [locationText, phone, email, linkedin, github].filter(Boolean).join(' | ');

    const renderBullets = (text) => {
      if (!text) return '';
      return text.split('\n').filter(l => l.trim()).map(line => {
        const t = line.trim();
        return `<p style="margin:3px 0;font-size:12px;color:#333;">${t.startsWith('•') ? t : '• ' + t}</p>`;
      }).join('');
    };

    const renderSkills = (text) => {
      if (!text) return '';
      return text.split(/[,\n]/).map(s => s.trim()).filter(Boolean)
        .map(s => `<span style="display:inline-block;background:#f3f4f6;color:#374151;padding:3px 10px;border-radius:10px;margin:2px;font-size:11px;font-weight:500;">${s}</span>`)
        .join('');
    };

    const sectionHtml = (title, content, renderer = 'bullets') => {
      if (!content) return '';
      const rendered = renderer === 'skills' ? renderSkills(content) : renderer === 'text' ? `<p style="font-size:12px;color:#333;line-height:1.6;">${content}</p>` : renderBullets(content);
      return `<div style="margin-bottom:18px;">
        <h2 style="font-size:13px;font-weight:bold;color:#d97706;text-transform:uppercase;letter-spacing:2px;border-bottom:2px solid #fbbf24;padding-bottom:4px;margin-bottom:8px;">${title}</h2>
        ${rendered}
      </div>`;
    };

    printWindow.document.write(`<!DOCTYPE html><html><head><title>${fullName || 'Resume'}</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif; background:white; color:#1a1a1a; }
        @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
      </style></head><body>
      <div style="background:linear-gradient(135deg,#1a1a1a,#2d2d2d);color:white;padding:32px 40px;text-align:center;">
        <h1 style="font-size:28px;font-weight:bold;margin-bottom:6px;">${fullName || 'Your Name'}</h1>
        ${headline ? `<p style="color:#fbbf24;font-size:14px;margin-bottom:8px;">${headline}</p>` : ''}
        <p style="font-size:11px;color:#ccc;">${contactParts}</p>
      </div>
      <div style="padding:30px 40px;">
        ${sectionHtml('Summary', summary, 'text')}
        ${sectionHtml('Skills', skills, 'skills')}
        ${sectionHtml('Experience', experience)}
        ${sectionHtml('Projects', projects)}
        ${sectionHtml('Education', education)}
      </div>
    </body></html>`);

    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  // Loading state
  if (loadingExisting) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  const hasContent = Object.values(resumeData).some(v => v?.trim());

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[120px]" />
      </div>

      <DashboardNavbar />

      {/* Status Toast */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-xl text-sm font-bold shadow-xl ${
              statusMessage.type === 'error' ? 'bg-red-500/90 text-white' : 'bg-emerald-500/90 text-white'
            }`}
          >
            {statusMessage.message}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white mb-3 transition-colors">
              <ArrowLeft className="w-3 h-3" /> Back to Dashboard
            </button>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
              <FileText className="w-8 h-8 text-amber-400" />
              AI Resume Builder
            </h1>
            <p className="text-gray-400 mt-1">Build, enhance, and optimize your resume with AI</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={generateFromProfile}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl text-sm font-bold text-black transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
              {loading ? 'Generating...' : 'AI Auto-Generate'}
            </button>
            <button
              onClick={() => setShowJDModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-all"
            >
              <Target className="w-4 h-4 text-amber-400" /> ATS Analyzer
            </button>
            <button
              onClick={saveResume}
              disabled={saving || !hasContent}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-all disabled:opacity-30"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save
            </button>
            <button
              onClick={downloadPDF}
              disabled={!hasContent}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition-all disabled:opacity-30"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>
        </div>

        {/* Main 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Editor */}
          <div className="lg:col-span-3 space-y-0">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.02] border border-white/10 rounded-xl p-4 mb-4"
            >
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-amber-400" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-0">
                <EditableField label="Full Name" value={resumeData.fullName} onChange={v => updateField('fullName', v)} placeholder="John Doe" icon={User} />
                <EditableField label="Headline" value={resumeData.headline} onChange={v => updateField('headline', v)} placeholder="Full Stack Developer | React & Node.js" icon={Briefcase} />
                <EditableField label="Email" value={resumeData.email} onChange={v => updateField('email', v)} placeholder="john@example.com" icon={Mail} />
                <EditableField label="Phone" value={resumeData.phone} onChange={v => updateField('phone', v)} placeholder="+91 9876543210" icon={Phone} />
                <EditableField label="Location" value={resumeData.locationText} onChange={v => updateField('locationText', v)} placeholder="Bangalore, India" icon={MapPin} />
                <EditableField label="LinkedIn" value={resumeData.linkedin} onChange={v => updateField('linkedin', v)} placeholder="linkedin.com/in/johndoe" icon={Linkedin} />
                <EditableField label="GitHub" value={resumeData.github} onChange={v => updateField('github', v)} placeholder="github.com/johndoe" icon={Github} />
              </div>
            </motion.div>

            {/* Sections */}
            {SECTIONS.map((section) => (
              <SectionEditor
                key={section.key}
                section={section}
                value={resumeData[section.key]}
                onChange={(v) => updateField(section.key, v)}
                onEnhance={enhanceSection}
                enhancing={enhancing}
              />
            ))}
          </div>

          {/* Right: Preview + ATS */}
          <div className="lg:col-span-2 space-y-4">
            {/* Sticky preview */}
            <div className="lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest flex items-center gap-2">
                  <Eye className="w-4 h-4 text-amber-400" /> Live Preview
                </h3>
                <button
                  onClick={() => setShowPreview(true)}
                  className="text-[10px] text-amber-400 hover:text-amber-300 font-bold"
                >
                  Full Screen →
                </button>
              </div>

              <div className="transform scale-[0.85] origin-top-left" style={{ width: '117.6%' }}>
                <ResumePreview data={resumeData} />
              </div>

              {/* ATS Score */}
              {atsAnalysis && (
                <div className="mt-4">
                  <ATSScoreDisplay analysis={atsAnalysis} />
                </div>
              )}

              {!atsAnalysis && (
                <div className="mt-4 bg-white/[0.02] border border-white/10 rounded-xl p-4 text-center">
                  <Target className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 mb-2">No ATS analysis yet</p>
                  <button
                    onClick={() => setShowJDModal(true)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-bold"
                  >
                    Paste a Job Description →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Job Description Modal */}
      <AnimatePresence>
        {showJDModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowJDModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-400" />
                  ATS Analyzer
                </h3>
                <button onClick={() => setShowJDModal(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-400 mb-4">Paste a job description to get AI-powered ATS compatibility analysis</p>
              <textarea
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={10}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-amber-500/50 outline-none resize-none mb-4"
              />
              <button
                onClick={analyzeJD}
                disabled={analyzingJD || !jobDescription.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-xl text-sm font-bold text-black transition-all disabled:opacity-50"
              >
                {analyzingJD ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Zap className="w-4 h-4" /> Analyze with AI</>}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Preview */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-8"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl"
            >
              <button
                onClick={() => setShowPreview(false)}
                className="fixed top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <ResumePreview data={resumeData} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResumeBuilder;
