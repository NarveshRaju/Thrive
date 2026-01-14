import React, { useState } from "react";
import GlassCard from "../../components/ui/GlassCard";
import PrimaryButton from "../../components/ui/PrimaryButton";
import SecondaryButton from "../../components/ui/SecondaryButton";

const JobDescriptionModal = ({ initialValue = "", onClose, onSave }) => {
  const [text, setText] = useState(initialValue);

  const handleSave = () => {
    onSave(text);
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/60 px-6 py-6">
      <GlassCard className="w-full max-w-2xl space-y-4 p-6">
        {/* Header */}
        <div className="border-b border-[#1F242D] pb-4">
          <h2 className="text-xl font-semibold text-white">Paste Job Description</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Paste the full job description here. AI will analyze it to optimize your resume.
          </p>
        </div>

        {/* Text area */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste job description here..."
          className="w-full rounded-lg border border-[#1F242D] bg-[#0E1116] px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none transition focus:border-zinc-500 focus:bg-[#131722]"
          rows={10}
        />

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-[#1F242D] pt-4">
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton onClick={handleSave}>Save & Analyze</PrimaryButton>
        </div>
      </GlassCard>
    </div>
  );
};

export default JobDescriptionModal;
