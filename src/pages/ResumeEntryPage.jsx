import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardNavbar from "../components/layout/DashboardNavbar";
import { Footer } from "../components/layout/Footer";
import PrimaryButton from "../components/ui/PrimaryButton";
import SecondaryButton from "../components/ui/SecondaryButton";

const ResumeEntryPage = () => {
  const navigate = useNavigate();

  const handleCreateNew = () => {
    navigate("/resume-builder/editor", {
      state: { mode: "new" },
    });
  };

  const handleUploadExisting = () => {
    navigate("/resume-builder/editor", {
      state: { mode: "upload" },
    });
  };

  return (
    <div className="bg-[#0B0D10] text-white min-h-screen font-sans antialiased">
      <DashboardNavbar />
      <main className="pt-16 pb-10 px-4 md:px-8 flex justify-center">
        <div className="w-full max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-[0.12em] mb-2">
            AI Resume Builder
          </h1>
          <p className="text-sm text-zinc-400 mb-6">
            Start fresh or let AI upgrade your existing resume.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Create new card */}
            <div className="rounded-2xl bg-[#0E1116] border border-[#1F242D] p-5 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-2">Create new resume</h2>
                <p className="text-xs text-zinc-400 mb-4">
                  Start with a clean document and let AI help you craft every section.
                </p>
              </div>
              <PrimaryButton variant="amber" onClick={handleCreateNew}>
                Start from scratch
              </PrimaryButton>
            </div>

            {/* Upload existing card */}
            <div className="rounded-2xl bg-[#0E1116] border border-[#1F242D] p-5 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-2">Upload existing resume</h2>
                <p className="text-xs text-zinc-400 mb-4">
                  Import your current resume (PDF / DOCX) and let AI optimize it.
                </p>
              </div>
              <SecondaryButton onClick={handleUploadExisting}>
                Upload & continue
              </SecondaryButton>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResumeEntryPage;
