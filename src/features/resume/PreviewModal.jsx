/* eslint-disable no-unused-vars */
// src/pages/ResumeLab/PreviewModal.jsx
import React from "react";

const PreviewModal = ({ onClose, resumeData }) => {
  if (!resumeData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-white rounded-lg shadow-2xl px-6 py-4">
          <p className="text-sm text-gray-800">Loading resume preview...</p>
          <button
            onClick={onClose}
            className="mt-3 px-4 py-1.5 rounded bg-gray-200 text-gray-900 text-xs font-semibold hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const {
    fullName = "",
    email = "",
    linkedin = "",
    phone = "",
    github = "",
    location = "",
    education = "",
    skills = "",
    experience = "",
    projects = "",
    achievements = "",
  } = resumeData;

  const initials = fullName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const renderBullets = (text) => {
    if (!text) return "";
    return text
      .split("\n")
      .filter((line) => line.trim().length > 0)
      .map((line) => {
        const t = line.trim();
        return t.startsWith("•") ? t : "• " + t;
      })
      .join("\n");
  };

  const renderSkillBadges = (text) => {
    if (!text) return [];
    return text
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  };

  const contactLine = [location, phone, email].filter(Boolean).join(" | ");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal header */}
        <div className="bg-gray-100 border-b border-gray-300 px-6 py-3 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Resume Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-light"
          >
            ×
          </button>
        </div>

        {/* A4 paper preview */}
        <div className="overflow-y-auto flex-1 bg-gray-100 p-4">
          <div
            className="bg-white w-full max-w-3xl mx-auto shadow-sm"
            style={{ aspectRatio: "8.5/11" }}
          >
            {/* Dark header with avatar */}
            <div className="bg-gray-700 h-12 flex items-end justify-center relative">
              <div className="w-16 h-16 rounded-full border-4 border-white bg-white flex items-center justify-center absolute bottom-0 text-lg font-bold text-gray-700">
                {initials}
              </div>
            </div>

            {/* Body */}
            <div className="px-10 pt-12 pb-10 text-xs text-gray-800">
              {/* Name */}
              <div className="text-center text-lg font-bold mb-2 tracking-wide">
                {fullName}
              </div>

              {/* Contact */}
              <div className="text-center text-xs text-gray-600 mb-4 pb-3 border-b border-gray-300">
                {contactLine}
              </div>

              {/* Summary (achievements) */}
              {achievements && (
                <div className="mb-4">
                  <div className="text-xs font-bold uppercase bg-gray-200 px-3 py-2 mb-2">
                    Summary
                  </div>
                  <div className="leading-snug whitespace-pre-wrap">
                    {renderBullets(achievements)}
                  </div>
                </div>
              )}

              {/* Skills */}
              {skills && (
                <div className="mb-4">
                  <div className="text-xs font-bold uppercase bg-gray-200 px-3 py-2 mb-2">
                    Skills
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {renderSkillBadges(skills).map((skill, idx) => (
                      <span
                        key={idx}
                        className="border border-gray-500 px-2 py-1 rounded-full text-xs bg-white"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {experience && (
                <div className="mb-4">
                  <div className="text-xs font-bold uppercase bg-gray-200 px-3 py-2 mb-2">
                    Experience
                  </div>
                  <div className="leading-snug whitespace-pre-wrap">
                    {renderBullets(experience)}
                  </div>
                </div>
              )}

              {/* Projects */}
              {projects && (
                <div className="mb-4">
                  <div className="text-xs font-bold uppercase bg-gray-200 px-3 py-2 mb-2">
                    Projects
                  </div>
                  <div className="leading-snug whitespace-pre-wrap">
                    {renderBullets(projects)}
                  </div>
                </div>
              )}

              {/* Education */}
              {education && (
                <div className="mb-4">
                  <div className="text-xs font-bold uppercase bg-gray-200 px-3 py-2 mb-2">
                    Education
                  </div>
                  <div className="leading-snug whitespace-pre-wrap">
                    {renderBullets(education)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div className="bg-gray-100 border-t border-gray-300 px-6 py-3 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 text-gray-900 text-sm font-semibold hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              const response = await fetch("http://localhost:4000/api/resume/export", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(resumeData),
              });
              const blob = await response.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "resume.pdf";
              a.click();
              window.URL.revokeObjectURL(url);
            }}
            className="px-4 py-2 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
