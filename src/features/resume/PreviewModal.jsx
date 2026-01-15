import React, { useRef } from "react";
import GlassCard from "../../components/ui/GlassCard";
import SecondaryButton from "../../components/ui/SecondaryButton";
import PrimaryButton from "../../components/ui/PrimaryButton";
import html2pdf from "html2pdf.js";
import "./PreviewModal.css";

const PreviewModal = ({ resumeHtml, onClose }) => {
  const printRef = useRef(null);

  const handleDownload = () => {
    if (!printRef.current) return;

    const opt = {
      margin: 10,
      filename: "resume.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(printRef.current).set(opt).save();
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/60 px-6 py-6">
      <GlassCard className="w-full max-w-4xl space-y-4 p-6">
        <div className="flex items-center justify-between gap-4 border-b border-[#1F242D] pb-4">
          <h2 className="text-xl font-semibold text-white">Resume Preview</h2>
          <div className="flex gap-3">
            <SecondaryButton onClick={onClose}>Close</SecondaryButton>
            <PrimaryButton variant="cyan" onClick={handleDownload}>
              Download PDF
            </PrimaryButton>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto rounded-lg border border-[#1F242D] bg-white p-8">
          <div className="paper" ref={printRef}>
            <div
              className="paperInner"
              dangerouslySetInnerHTML={{ __html: resumeHtml }}
            />
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default PreviewModal;
