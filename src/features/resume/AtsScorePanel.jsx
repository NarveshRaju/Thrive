import React from "react";

const AtsScorePanel = ({ atsResult, hasJobDescription }) => {
  const { score, verdict, keywordMatches, missingKeywords } = atsResult;

  const scoreColor =
    score >= 80 ? "text-emerald-400" : score >= 60 ? "text-amber-300" : "text-red-400";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <span className="inline-flex rounded-full bg-zinc-800/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
            ATS Score (Static)
          </span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className={`text-3xl font-bold ${scoreColor}`}>
              {score}
            </span>
            <span className="text-sm text-zinc-500">/ 100</span>
          </div>
          <p className="mt-2 text-sm text-zinc-300">{verdict}</p>
        </div>
        <div className="max-w-xs rounded-lg border border-[#1F242D] bg-[#0E1116] p-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Insight</span>
          <p className="mt-2 text-xs text-zinc-400">
            This is a static preview of future ATS analysis. With backend logic,
            the score and keywords will update as you edit your resume.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Matched keywords</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {keywordMatches.map((k) => (
              <span key={k} className="inline-flex rounded-full bg-emerald-500/20 px-3 py-1 text-xs text-emerald-300 border border-emerald-500/40">
                {k}
              </span>
            ))}
          </div>
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Missing keywords</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {missingKeywords.map((k) => (
              <span key={k} className="inline-flex rounded-full bg-red-500/20 px-3 py-1 text-xs text-red-300 border border-red-500/40">
                {k}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-[#1F242D] bg-[#0E1116] p-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Job description status</span>
        {hasJobDescription ? (
          <p className="mt-2 text-xs text-emerald-300">
            A JD is attached. In the full version, ATS will align your resume to
            this role.
          </p>
        ) : (
          <p className="mt-2 text-xs text-zinc-500">
            Paste a job description to unlock targeted ATS suggestions.
          </p>
        )}
      </div>
    </div>
  );
};

export default AtsScorePanel;
