import React, { useEffect, useRef, useState } from "react";
import {
  Send,
  Sparkles,
  FileText,
  Loader2,
  Zap,
  Copy,
  Check,
  Download,
} from "lucide-react";

const CareerPersonaLab = () => {
  const [coverLetter, setCoverLetter] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "sys-1",
      role: "assistant",
      text:
        "Hi! I have your resume context. I will keep updating this cover letter on the right. " +
        "Tell me what you want to emphasize (roles, projects, tone, length, etc.).",
    },
  ]);
  const [tone, setTone] = useState("professional");
  const [isUploading, setIsUploading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [resumeContext, setResumeContext] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(scrollToBottom, [messages]);

  const buildInitialCoverLetter = (data) => {
    const name = data.fullName || "Candidate";
    const role = "Flutter & MERN Developer";
    const location = data.location || "your location";
    const skills = (data.skills || "")
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 6)
      .join(", ");

    const firstExpLine = (data.experience || "")
      .split("\n")
      .find((l) => l.trim());
    const firstProjectLine = (data.projects || "")
      .split("\n")
      .find((l) => l.trim());

    // Build cover letter WITHOUT final signature
    const letterBody =
      `Dear Hiring Manager,\n\n` +
      `My name is ${name}, a ${role} based in ${location}. I am excited to apply for product-focused roles where I can combine clean engineering practices with thoughtful user experience.\n\n` +
      (firstExpLine ? `Most recently, ${firstExpLine.trim()}\n\n` : "") +
      (firstProjectLine
        ? `I have also built projects such as ${firstProjectLine.trim()}\n\n`
        : "") +
      (skills
        ? `Across these experiences, I have worked extensively with ${skills}, and I am comfortable owning features from idea to deployment.\n\n`
        : "") +
      `I would love the opportunity to bring this mix of execution, collaboration, and ownership mindset to your team.`;

    return letterBody;
  };

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
      setResumeContext(data);
      const initial = buildInitialCoverLetter(data);
      setCoverLetter(initial);

      setMessages((prev) => [
        ...prev,
        {
          id: "sys-2",
          role: "assistant",
          text:
            "I generated a first version of your cover letter from the uploaded resume. " +
            "Ask me to shorten it, make it more confident, tailor it to a role, or highlight specific projects.",
        },
      ]);
    } catch (e) {
      console.error(e);
      alert("Error talking to backend. Is it running on port 4000?");
    } finally {
      setIsUploading(false);
    }
  };

  const callAiAgent = async (userMessage) => {
    const resp = await fetch("http://localhost:4000/api/persona/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userMessage,
        resumeContext,
        coverLetter,
        tone,
      }),
    });

    if (!resp.ok) {
      throw new Error("Gemini backend failed");
    }

    const data = await resp.json();
    return {
      reply: data.reply || "Updated your cover letter.",
      newCoverLetter: data.newCoverLetter || coverLetter,
    };
  };

  const handleSend = async () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;
    if (!resumeContext && !coverLetter) {
      alert("Upload a resume first so I have context.");
      return;
    }

    const newUserMsg = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setChatInput("");
    setIsThinking(true);

    try {
      const { reply, newCoverLetter } = await callAiAgent(trimmed);
      setCoverLetter(newCoverLetter);
      setMessages((prev) => [
        ...prev,
        { id: `assistant-${Date.now()}`, role: "assistant", text: reply },
      ]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          text: "Something went wrong while updating the persona. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = async () => {
    if (coverLetter) {
      await navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadCoverLetter = async () => {
    if (!coverLetter.trim()) {
      alert("Generate a cover letter first.");
      return;
    }
    try {
      setIsDownloading(true);

      const payload = {
        coverLetter,
        resumeContext,
      };

      const resp = await fetch(
        "http://localhost:4000/api/cover-letter/export",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!resp.ok) {
        alert("Failed to generate cover letter PDF");
        return;
      }

      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cover-letter.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Error generating cover letter PDF. Check backend logs.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-16 pb-10 px-4 md:px-8">
      {/* soft orange glow in background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[260px] bg-[#f97316]/18 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[420px] h-[220px] bg-[#f97316]/12 blur-[90px]" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-[#f97316]" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#f97316]">
                AI Persona & Cover Letter
              </p>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Shape your story with <span className="text-[#f97316]">AI</span>
            </h1>
            <p className="mt-2 text-sm text-neutral-300 max-w-xl">
              Upload your resume once. Chat with the AI on the left, and watch
              your cover letter evolve live on the right.
            </p>
          </div>

          <label className="inline-flex items-center gap-2 cursor-pointer">
            <div className="rounded-full border border-neutral-600 bg-black px-5 py-2.5 flex items-center gap-2 text-sm font-medium text-neutral-50 hover:border-[#f97316] hover:text-[#f97316] transition">
              <FileText className="w-4 h-4" />
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <span>Upload Resume (PDF)</span>
              )}
            </div>
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handlePdfUpload}
              disabled={isUploading}
            />
          </label>
        </header>

        {/* Two main cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT: chat card */}
          <section className="relative rounded-[32px] bg-[#050505] border border-neutral-800 shadow-[0_0_50px_rgba(249,115,22,0.25)]">
            <div className="pointer-events-none absolute inset-[1px] rounded-[31px] border border-[#f97316]/35" />

            {/* header row */}
            <div className="relative flex items-center justify-between px-6 pt-5 pb-4 border-b border-neutral-800">
              <div>
                <div className="inline-flex items-center rounded-full border border-neutral-600 px-4 py-1 text-[11px] uppercase tracking-[0.18em]">
                  Persona Chat
                </div>
                <p className="mt-2 text-xs text-neutral-400">
                  Ask for rewrites, different tones, or highlight specific
                  projects.
                </p>
              </div>
              <div className="inline-flex items-center rounded-full border border-[#f97316] bg-black px-4 py-1 text-[11px] uppercase tracking-[0.18em] text-[#f97316]">
                <Sparkles className="w-3.5 h-3.5 mr-2" />
                Thrive AI
              </div>
            </div>

            {/* messages */}
            <div className="relative px-6 pt-4 pb-3 h-[280px] overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[90%] text-sm leading-relaxed mb-3 ${
                    msg.role === "user" ? "ml-auto" : "mr-auto"
                  }`}
                >
                  <div className="rounded-[18px] px-4 py-3 bg-black border border-neutral-700 text-neutral-50">
                    {msg.text}
                  </div>
                </div>
              ))}
              {isThinking && (
                <div className="mr-auto mt-3 text-sm text-neutral-300">
                  <div className="inline-flex items-center gap-2 rounded-[18px] px-4 py-3 bg-black border border-neutral-700">
                    <Loader2 className="w-4 h-4 animate-spin text-[#f97316]" />
                    Updating your persona...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* input + tone */}
            <div className="relative border-t border-neutral-800 px-6 pt-4 pb-5 space-y-4">
              {/* input row */}
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <div className="rounded-[22px] border border-neutral-700 bg-black px-4 py-2.5">
                    <textarea
                      rows={1}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Upload your resume first to get started..."
                      className="w-full resize-none bg-transparent text-sm text-neutral-100 placeholder:text-neutral-500 outline-none"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={!chatInput.trim()}
                  className="p-2.5 rounded-[18px] bg-[#f97316] text-black hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* tone */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.18em] text-neutral-400">
                  Tone
                </span>
                <div className="inline-flex rounded-full bg-black border border-neutral-700 px-2 py-1">
                  {[
                    { id: "professional", label: "Professional" },
                    { id: "friendly", label: "Friendly" },
                    { id: "impact", label: "Impact" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setTone(opt.id)}
                      className={`px-3 py-1 rounded-full text-[11px] font-medium ${
                        tone === opt.id
                          ? "bg-[#f97316] text-black"
                          : "text-neutral-200 hover:bg-white/5"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-[11px] text-neutral-500">
                Enter to send · Shift+Enter for new line
              </p>
            </div>
          </section>

          {/* RIGHT: preview card */}
          <section className="relative rounded-[32px] bg-[#050505] border border-neutral-800 shadow-[0_0_50px_rgba(249,115,22,0.25)]">
            <div className="pointer-events-none absolute inset-[1px] rounded-[31px] border border-[#f97316]/35" />
            {/* header */}
            <div className="relative flex items-center justify-between px-6 pt-5 pb-4 border-b border-neutral-800">
              <div>
                <div className="inline-flex items-center rounded-full border border-neutral-600 px-4 py-1 text-[11px] uppercase tracking-[0.18em]">
                  Cover Letter Preview
                </div>
                <p className="mt-2 text-xs text-neutral-400">
                  Ready to paste into applications or export.
                </p>
              </div>
              {coverLetter && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-600 px-3 py-1.5 text-[11px] text-neutral-100 hover:border-[#f97316] hover:text-[#f97316] transition"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownloadCoverLetter}
                    className="inline-flex items-center gap-2 rounded-full border border-[#f97316] bg-[#f97316] px-3 py-1.5 text-[11px] text-black hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={isDownloading}
                  >
                    <Download className="w-3.5 h-3.5" />
                    {isDownloading ? "Downloading..." : "Download"}
                  </button>
                </div>
              )}
            </div>
            {/* content – WHITE background with proper header styling */}
            <div className="relative px-6 py-6 h-[360px] overflow-y-auto bg-white">
              {coverLetter ? (
                <div className="max-w-full">
                  {/* Header bar with contact info */}
                  <div className="bg-gray-300 text-black px-4 py-3 mb-4 -mx-6 -mt-6">
                    <div className="text-center">
                      <h2 className="text-lg font-bold tracking-wider mb-2">
                        {resumeContext?.fullName || "APPLICANT NAME"}
                      </h2>
                      <div className="text-[9px] leading-tight space-y-0.5">
                        {resumeContext?.email && (
                          <div>{resumeContext.email}</div>
                        )}
                        {resumeContext?.linkedin && (
                          <div>{resumeContext.linkedin}</div>
                        )}
                        {resumeContext?.phone && (
                          <div>{resumeContext.phone}</div>
                        )}
                        {resumeContext?.location && (
                          <div>{resumeContext.location}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Letter body */}
                  <article className="font-serif text-[10.5px] leading-[1.6] text-black">
                    {(() => {
                      // Clean up the cover letter - remove "Best regards," lines that appear in the middle
                      let cleanedLetter = coverLetter;

                      // Remove any "Best regards, NAME" pattern that appears before the final closing
                      cleanedLetter = cleanedLetter.replace(
                        /Best regards,\s*\n?\s*\n?/gi,
                        ""
                      );

                      // Split by double newlines to get paragraphs
                      const paragraphs = cleanedLetter
                        .split("\n\n")
                        .map((p) => p.trim())
                        .filter((p) => p.length > 0);

                      return paragraphs.map((paragraph, idx) => (
                        <p key={idx} className="mb-3 text-justify">
                          {paragraph}
                        </p>
                      ));
                    })()}

                    {/* Closing */}
                    <div className="mt-6">
                      <p className="mb-10 text-sm">Best regards,</p>
                      <div className="mb-2">
                        <p className="font-bold text-sm">
                          {resumeContext?.fullName || "APPLICANT NAME"}
                        </p>
                      </div>
                    </div>
                  </article>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center mb-4">
                    <FileText className="w-7 h-7 text-gray-500" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-800 mb-2">
                    No cover letter yet
                  </h3>
                  <p className="text-xs text-gray-600 max-w-xs leading-relaxed">
                    Upload your resume to generate a first cover letter. Then
                    use the AI chat to refine tone, length, and focus.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CareerPersonaLab;
