// src/pages/ResumeLabPage.jsx

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import GlassCard from "../../components/ui/GlassCard";
import PrimaryButton from "../../components/ui/PrimaryButton";
import SecondaryButton from "../../components/ui/SecondaryButton";
import AiEditChat from "./AiEditChat";
import JobDescriptionModal from "./JobDescriptionModal";
import AtsScorePanel from "./AtsScorePanel";
import PreviewModal from "./PreviewModal";

const ResumeLabPage = () => {
  const location = useLocation();
  const mode = location.state?.mode || "new"; // "new" or "upload"

  // structured resume fields
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [locationText, setLocationText] = useState("");

  const [summary, setSummary] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [projects, setProjects] = useState("");
  const [education, setEducation] = useState("");

  const [jobDescription, setJobDescription] = useState("");
  const [isJDModalOpen, setIsJDModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const [atsResult] = useState({
    score: 72,
    verdict: "Good starting point",
    keywordMatches: ["React", "JavaScript", "REST APIs"],
    missingKeywords: ["TypeScript", "Testing", "CI/CD"],
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const inputClass =
    "w-full rounded-2xl bg-[#080b12] border border-[#1F242D] px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/40 transition";

  // helper: turn each non-empty line into a bullet to improve readability
  const formatForTextarea = (value) =>
    (value || "")
      .split("\n")
      .map((line) => {
        const trimmed = line.trim();
        if (!trimmed) return "";
        if (trimmed.startsWith("•")) return trimmed;
        return "• " + trimmed;
      })
      .join("\n");

  useEffect(() => {
    const reset = () => {
      setFullName("");
      setHeadline("");
      setEmail("");
      setPhone("");
      setLocationText("");
      setSummary("");
      setSkills("");
      setExperience("");
      setProjects("");
      setEducation("");
    };
    reset();
  }, [mode]);

  // PDF upload -> backend extract -> prefill fields
  const handlePdfUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      const resp = await fetch("http://localhost:4000/api/resume/extract", {
        method: "POST",
        body: formData,
      });

      if (!resp.ok) {
        alert("Failed to extract resume from PDF");
        return;
      }

      const data = await resp.json();

      setFullName(data.fullName || "");
      setHeadline(data.headline || "");
      setEmail(data.email || "");
      setPhone(data.phone || "");
      setLocationText(data.locationText || "");
      setSummary(data.summary || "");
      setSkills(data.skills || "");
      setExperience(formatForTextarea(data.experience || ""));
      setProjects(formatForTextarea(data.projects || ""));
      setEducation(formatForTextarea(data.education || ""));
    } catch (e) {
      alert("Error talking to backend. Is it running on port 4000?");
    } finally {
      setIsUploading(false);
    }
  };

  // Download clean resume PDF from backend
  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);

      const payload = {
        fullName,
        email,
        phone,
        location: locationText,
        linkedin: "", // add later in UI
        github: "",
        education,
        skills,
        experience,
        projects,
        achievements: summary,
      };

      const resp = await fetch("http://localhost:4000/api/resume/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        alert("Failed to generate PDF");
        return;
      }

      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert("Error generating PDF. Check backend logs.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-slate-100 pt-24 pb-10 px-4 md:px-8">
      {/* header */}
      <header className="max-w-6xl mx-auto flex items-center justify-between gap-6 mb-8">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-amber-400 mb-1">
            AI Resume Lab
          </p>
          <h1 className="text-3xl font-semibold tracking-[0.16em] text-white">
            Build a strong resume, calmly
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {mode === "new"
              ? "Fill simple fields and let AI help with wording and structure."
              : "Upload your resume and map it into clean, structured fields."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SecondaryButton
            onClick={() => setIsJDModalOpen(true)}
            className="border border-slate-700 bg-transparent text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200 hover:border-slate-500"
          >
            Paste Job Description
          </SecondaryButton>
          <PrimaryButton
            variant="amber"
            onClick={() => alert("AI optimization will be wired later")}
            className="bg-amber-400 hover:bg-amber-300 text-[11px] font-semibold uppercase tracking-[0.16em] text-black shadow-lg shadow-amber-900/50"
          >
            AI Optimize (Static)
          </PrimaryButton>
        </div>
      </header>

      {/* layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-5 max-xl:grid-cols-1">
        {/* LEFT – structured form */}
        <GlassCard className="p-5 md:p-6 flex flex-col gap-4 bg-[#050509] border border-[#101320]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <span className="inline-flex rounded-full bg-[#111827] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Resume fields
              </span>
              <span className="text-xs text-slate-500">
                Enter your details section by section. No formatting stress.
              </span>
            </div>
            <div className="flex gap-2">
              <SecondaryButton
                onClick={() => {
                  const data = {
                    fullName,
                    email,
                    phone,
                    location: locationText,
                    linkedin: "",
                    github: "",
                    education,
                    skills,
                    experience,
                    projects,
                    achievements: summary,
                  };
                  setPreviewData(data);
                  setIsPreviewOpen(true);
                }}
                className="border border-slate-700 bg-transparent text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200 hover:border-slate-500"
              >
                Preview
              </SecondaryButton>

              <PrimaryButton
                variant="amber"
                onClick={handleDownloadPdf}
                className="bg-amber-400 hover:bg-amber-300 text-[11px] font-semibold uppercase tracking-[0.16em] text-black shadow-md shadow-amber-900/40"
              >
                {isDownloading ? "Generating…" : "Download PDF"}
              </PrimaryButton>
            </div>
          </div>

          {/* upload area (PDF extract) */}
          {mode === "upload" && (
            <div className="mt-2 mb-2 rounded-xl border border-dashed border-[#1F242D] bg-[#050509] px-4 py-3 text-xs text-slate-400">
              <p className="mb-2">
                Upload your existing resume PDF. We extract key details so you
                can tweak them and regenerate a clean template.
              </p>
              <input
                type="file"
                accept=".pdf"
                onChange={handlePdfUpload}
                className="text-xs"
              />
              {isUploading && (
                <p className="mt-1 text-[11px] text-amber-400">
                  Extracting from PDF…
                </p>
              )}
            </div>
          )}

          {/* identity row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 mb-1">
                Full name
              </label>
              <input
                className={inputClass}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Geetanjali …"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 mb-1">
                Headline / role
              </label>
              <input
                className={inputClass}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Flutter & MERN Developer"
              />
            </div>
          </div>

          {/* contact row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 mb-1">
                Email
              </label>
              <input
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 mb-1">
                Phone
              </label>
              <input
                className={inputClass}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91‑…"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 mb-1">
                Location
              </label>
              <input
                className={inputClass}
                value={locationText}
                onChange={(e) => setLocationText(e.target.value)}
                placeholder="Mumbai, India"
              />
            </div>
          </div>

          {/* summary */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 mb-1">
              Summary
            </label>
            <textarea
              rows={3}
              className={`${inputClass} resize-none`}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="2–3 lines about you, your tech stack and the kind of work you want."
            />
          </div>

          {/* skills */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 mb-1">
              Skills (comma‑separated)
            </label>
            <input
              className={inputClass}
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Flutter, Dart, React, Node.js, MongoDB…"
            />
          </div>

          {/* experience */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 mb-1">
              Experience (lines or bullets)
            </label>
            <textarea
              rows={6}
              className={`${inputClass} resize-none`}
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder={`• Flutter Developer – Company\n• Another role…`}
            />
          </div>

          {/* projects */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 mb-1">
              Projects
            </label>
            <textarea
              rows={6}
              className={`${inputClass} resize-none`}
              value={projects}
              onChange={(e) => setProjects(e.target.value)}
              placeholder={`• SwasthOne – AI powered health platform…\n• TechFinix – Employee management app…`}
            />
          </div>

          {/* education */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 mb-1">
              Education
            </label>
            <textarea
              rows={4}
              className={`${inputClass} resize-none`}
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              placeholder="B.E in Computer Engineering, College name, Year…"
            />
          </div>
        </GlassCard>

        {/* RIGHT – ATS + AI chat */}
        <GlassCard className="p-5 flex flex-col gap-4 bg-[#050509] border border-[#101320]">
          <div className="border-b border-[#1F242D] pb-3">
            <AtsScorePanel
              atsResult={atsResult}
              hasJobDescription={!!jobDescription}
            />
          </div>
          <div className="pt-2">
            <AiEditChat />
          </div>
        </GlassCard>
      </div>

      {isJDModalOpen && (
        <JobDescriptionModal
          initialValue={jobDescription}
          onClose={() => setIsJDModalOpen(false)}
          onSave={(text) => {
            setJobDescription(text);
            setIsJDModalOpen(false);
          }}
        />
      )}

      {isPreviewOpen && previewData && (
        <PreviewModal
          onClose={() => setIsPreviewOpen(false)}
          resumeData={previewData}
        />
      )}
    </div>
  );
};

export default ResumeLabPage;
