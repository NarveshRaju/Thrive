import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import GlassCard from "../../components/ui/GlassCard";
import PrimaryButton from "../../components/ui/PrimaryButton";
import SecondaryButton from "../../components/ui/SecondaryButton";
import RichTextEditor from "../../components/ui/RichTextEditor";
import AiEditChat from "./AiEditChat";
import JobDescriptionModal from "./JobDescriptionModal";
import AtsScorePanel from "./AtsScorePanel";
import PreviewModal from "./PreviewModal";

const defaultResumeHtml = `...your previous initial HTML...`;

const ResumeLabPage = () => {
  const location = useLocation();
  const mode = location.state?.mode || "new"; // "new" or "upload"

  const [resumeHtml, setResumeHtml] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isJDModalOpen, setIsJDModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [atsResult] = useState({
    score: 72,
    verdict: "Good starting point",
    keywordMatches: ["React", "JavaScript", "REST APIs"],
    missingKeywords: ["TypeScript", "Testing", "CI/CD"],
  });

  // initialize editor based on mode
  useEffect(() => {
    if (mode === "new") {
      setResumeHtml(""); // completely empty document
    } else if (mode === "upload") {
      // wait for user to upload; keep empty until parsed
      setResumeHtml("");
    }
  }, [mode]);

  // simple text extraction from uploaded file (PDF / DOCX):
  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const ext = file.name.toLowerCase();

    if (ext.endsWith(".txt")) {
      const text = await file.text();
      setResumeHtml(`<p>${text.replace(/\n/g, "<br/>")}</p>`);
    } else if (
      ext.endsWith(".pdf") ||
      ext.endsWith(".doc") ||
      ext.endsWith(".docx")
    ) {
      alert(
        "PDF / Word upload is supported in the UI, but parsing is not wired yet. For the demo, please upload a .txt version of your resume."
      );
    } else {
      alert("Unsupported file type. Please upload .txt, .pdf, .doc, or .docx.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* header */}
      <header className="flex items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-[0.12em] text-white">
            Resume Lab
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            {mode === "new"
              ? "Start with a blank canvas and build your resume with AI."
              : "Upload your resume and let AI help you refine it."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SecondaryButton onClick={() => setIsJDModalOpen(true)}>
            Paste Job Description
          </SecondaryButton>
          <PrimaryButton variant="amber" onClick={() => alert("Wire AI later")}>
            AI Optimize (Static)
          </PrimaryButton>
        </div>
      </header>

      {/* layout */}
      <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-5 max-xl:grid-cols-1">
        {/* LEFT */}
        <GlassCard className="p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <span className="inline-flex rounded-full bg-zinc-800/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                Resume Document
              </span>
              <span className="text-xs text-zinc-500">
                Format text with bold, italics, bullet points and headings.
              </span>
            </div>
            <SecondaryButton onClick={() => setIsPreviewOpen(true)}>
              Preview
            </SecondaryButton>
          </div>

          {mode === "upload" && (
            <div className="mt-2 mb-2 rounded-xl border border-dashed border-[#1F242D] bg-[#0B0D10] px-4 py-3 text-xs text-zinc-400">
              <p className="mb-2">
                Upload your existing resume. For now, text files (.txt) will be
                loaded directly. PDF/DOCX support will be added in the full
                version.
              </p>
              <input
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="text-xs"
              />
            </div>
          )}

          <div className="mt-2 pr-1 max-h-[70vh] overflow-y-auto">
            <RichTextEditor
              value={resumeHtml}
              onChange={setResumeHtml}
              placeholder="Start writing or paste your resume here..."
            />
          </div>
        </GlassCard>

        {/* RIGHT */}
        <GlassCard className="p-5 flex flex-col gap-4">
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

      {isPreviewOpen && (
        <PreviewModal
          resumeHtml={resumeHtml}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </div>
  );
};

export default ResumeLabPage;
