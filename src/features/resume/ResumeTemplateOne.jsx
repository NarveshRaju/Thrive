import React from "react";

const ResumeTemplateOne = ({
  fullName,
  headline,
  email,
  phone,
  locationText,
  summary,
  skills,
  experience,
  projects,
  education,
}) => {
  return (
    <div className="bg-white text-slate-900 p-8 max-w-[800px] mx-auto text-xs print:text-[11px]">
      {/* Header */}
      <header className="border-b border-slate-300 pb-3 mb-4">
        <h1 className="text-2xl font-bold tracking-tight">{fullName}</h1>
        <p className="text-sm font-medium text-slate-700">{headline}</p>
        <p className="text-[11px] text-slate-500 mt-1">
          {email}
          {phone && ` • ${phone}`}
          {locationText && ` • ${locationText}`}
        </p>
      </header>

      {/* Two-column layout like a LaTeX CV */}
      <main className="grid grid-cols-[1fr_2fr] gap-6">
        {/* Left column */}
        <div className="space-y-4">
          {summary && (
            <section>
              <h2 className="text-[11px] font-semibold tracking-[0.25em] uppercase text-slate-500">
                Summary
              </h2>
              <p className="mt-1 whitespace-pre-line">{summary}</p>
            </section>
          )}

          {skills && (
            <section>
              <h2 className="text-[11px] font-semibold tracking-[0.25em] uppercase text-slate-500">
                Skills
              </h2>
              <p className="mt-1">{skills}</p>
            </section>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {experience && (
            <section>
              <h2 className="text-[11px] font-semibold tracking-[0.25em] uppercase text-slate-500">
                Experience
              </h2>
              <p className="mt-1 whitespace-pre-line">{experience}</p>
            </section>
          )}

          {projects && (
            <section>
              <h2 className="text-[11px] font-semibold tracking-[0.25em] uppercase text-slate-500">
                Projects
              </h2>
              <p className="mt-1 whitespace-pre-line">{projects}</p>
            </section>
          )}

          {education && (
            <section>
              <h2 className="text-[11px] font-semibold tracking-[0.25em] uppercase text-slate-500">
                Education
              </h2>
              <p className="mt-1 whitespace-pre-line">{education}</p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default ResumeTemplateOne;