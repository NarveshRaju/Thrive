import React, { useState } from "react";
import { ClipboardCopy, Wand2, Target } from "lucide-react";

const samplePersona = {
  title: "Flutter Dev",
  summary:
    "Geetanjali is a Flutter Dev who consistently ships outcomes, not just features. Key strengths include Flutter.",
  strengths: ["Flutter", "Ownership mindset", "Problem‑solving"],
  tagline: "Obsessed with measurable outcomes and compound career growth.",
};

const CareerPersonaLab = () => {
  const [name, setName] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [experience, setExperience] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [skills, setSkills] = useState("");
  const [strengths, setStrengths] = useState("");
  const [goals, setGoals] = useState("");

  const [tone, setTone] = useState("professional");
  const [persona, setPersona] = useState(samplePersona);
  const [isGenerating, setIsGenerating] = useState(false);

  const baseInput =
    "w-full rounded-2xl border border-slate-700/80 bg-slate-100 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition";

  const handleGenerate = () => {
    setIsGenerating(true);

    const safeName = name || "This candidate";
    const safeRole = targetRole || currentRole || "software engineer";

    const summaryBase =
      tone === "friendly"
        ? `${safeName} is a ${safeRole} who enjoys turning ideas into polished, user‑friendly experiences.`
        : tone === "impact"
        ? `${safeName} is a ${safeRole} focused on shipping meaningful outcomes, not just closing tickets.`
        : `${safeName} is a ${safeRole} with a balanced focus on user experience, code quality, and business impact.`;

    const skillsText = skills ? `They work across ${skills.trim()}.` : "";
    const strengthsText = strengths
      ? `Key strengths include ${strengths.trim()}.`
      : "";
    const goalsText = goals
      ? `Currently focused on ${goals.trim()} in the ${
          industry || "tech"
        } space.`
      : industry
      ? `Motivated by impactful work in the ${industry} domain.`
      : "";

    const summary = [summaryBase, skillsText, strengthsText, goalsText]
      .filter(Boolean)
      .join(" ");

    const title = targetRole || currentRole || "Career‑focused professional";

    const tagline =
      tone === "friendly"
        ? "Curious, collaborative, and always learning on the job."
        : tone === "impact"
        ? "Obsessed with measurable impact and long‑term growth."
        : "Building reliable products with thoughtful, calm execution.";

    const strengthsArr =
      strengths.trim().length > 0
        ? strengths
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : ["Ownership mindset", "Communication", "Problem‑solving"];

    // small delay just for UX, then update persona and reset loading
    setTimeout(() => {
      setPersona({
        title,
        summary,
        strengths: strengthsArr,
        tagline,
      });
      setIsGenerating(false);
    }, 400);
  };

  const copyToClipboard = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pt-20 pb-10 px-4 md:px-8">
      {/* header */}
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-cyan-300 mb-1">
            AI Career Persona
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-[0.16em] uppercase">
            Define your professional identity
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-xl">
            Capture a clear, reusable persona you can use across your resume,
            LinkedIn, and portfolio.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-100 hover:border-cyan-400 hover:text-cyan-300 transition">
          <Target className="w-4 h-4" />
          Use for Resume Lab
        </button>
      </header>

      {/* layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.5fr_minmax(0,1.1fr)] gap-6">
        {/* left form */}
        <section className="rounded-[1.75rem] bg-slate-900/80 border border-slate-800/80 p-6 md:p-7 shadow-xl shadow-black/60">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="inline-flex rounded-full border border-slate-700/80 bg-slate-900/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Your inputs
              </span>
              <p className="mt-2 text-xs text-slate-500">
                A few details are enough. You can refine this anytime as your
                career evolves.
              </p>
            </div>
          </div>

          {/* identity row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 mb-1">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Geetanjali"
                className={baseInput}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 mb-1">
                Current role / stage
              </label>
              <input
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                placeholder="Flutter developer · Student"
                className={baseInput}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 mb-1">
                Experience
              </label>
              <input
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="2 yrs"
                className={baseInput}
              />
            </div>
          </div>

          {/* direction */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 mb-1">
                Target role
              </label>
              <input
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Flutter Dev · Mobile Engineer"
                className={baseInput}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 mb-1">
                Preferred industry
              </label>
              <input
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Healthtech · SaaS · Fintech"
                className={baseInput}
              />
            </div>
          </div>

          {/* details */}
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 mb-1">
                Skills & domains
              </label>
              <textarea
                rows={2}
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Flutter, Firebase, clean architecture, dashboards, data viz..."
                className={`${baseInput} resize-none min-h-[72px]`}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 mb-1">
                Strengths (comma‑separated)
              </label>
              <input
                value={strengths}
                onChange={(e) => setStrengths(e.target.value)}
                placeholder="Flutter, MERN, Mongo"
                className={baseInput}
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 mb-1">
                Current focus / goals
              </label>
              <textarea
                rows={2}
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="Ship 2–3 real apps, crack a Flutter role at a product‑first startup..."
                className={`${baseInput} resize-none min-h-[80px]`}
              />
            </div>
          </div>

          {/* tone + CTA */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 uppercase tracking-[0.16em]">
                Tone
              </span>
              <div className="inline-flex rounded-full bg-slate-900/80 border border-slate-700/80 p-1">
                {[
                  { id: "professional", label: "Professional" },
                  { id: "friendly", label: "Friendly" },
                  { id: "impact", label: "Impact‑focused" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setTone(opt.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors ${
                      tone === opt.id
                        ? "bg-cyan-400 text-slate-900"
                        : "text-slate-400 hover:text-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* PUT THE GENERATE BUTTON HERE */}
            <button
              type="button"
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 self-start md:self-auto rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-900 shadow-lg shadow-emerald-900/60 hover:brightness-105 transition"
            >
              <Wand2 className="w-4 h-4" />
              {isGenerating ? "Shaping persona..." : "Generate persona"}
            </button>
          </div>
        </section>

        {/* right preview */}
        <section className="rounded-[1.75rem] bg-slate-900/80 border border-slate-800/80 p-6 md:p-7 shadow-xl shadow-black/60 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="inline-flex rounded-full border border-slate-700/80 bg-slate-900/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Persona snapshot
              </span>
              <h2 className="mt-3 text-lg font-semibold tracking-[0.12em] uppercase">
                {persona.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={() =>
                copyToClipboard(
                  `${persona.title}\n\n${persona.summary}\n\nTagline: ${persona.tagline}`
                )
              }
              className="inline-flex items-center gap-1 rounded-full border border-slate-700/80 bg-slate-900/90 px-3 py-1 text-[11px] text-slate-100 hover:border-cyan-400 hover:text-cyan-300 transition"
            >
              <ClipboardCopy className="w-3 h-3" />
              Copy all
            </button>
          </div>

          <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
            {persona.summary}
          </p>

          <div className="mt-2 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              Strength highlights
            </p>
            <div className="flex flex-wrap gap-2">
              {persona.strengths.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-slate-600 bg-slate-900/80 px-3 py-1 text-[11px] text-slate-100"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 mb-1">
                Tagline
              </p>
              <p className="text-xs md:text-sm text-slate-200">
                {persona.tagline}
              </p>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(persona.tagline)}
              className="p-1.5 rounded-full border border-slate-700/80 bg-slate-900/90 hover:border-cyan-400 hover:text-cyan-300 transition"
            >
              <ClipboardCopy className="w-3 h-3" />
            </button>
          </div>

          <div className="mt-4 border-t border-slate-800 pt-3 text-[11px] text-slate-500">
            Use this persona to keep your resume summary, LinkedIn about
            section, and side projects aligned with the same story.
          </div>
        </section>
      </div>
    </div>
  );
};

export default CareerPersonaLab;
