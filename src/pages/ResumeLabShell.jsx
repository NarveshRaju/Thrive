import React from "react";
import DashboardNavbar from "../components/layout/DashboardNavbar";
import {Footer} from "../components/layout/Footer";
import ResumeLabPage from "../features/resume/ResumeLabPage";

const ResumeLabShell= () => {
  return (
    <div className="bg-[#0B0D10] text-white min-h-screen font-sans antialiased">
      {/* fixed navbar */}
      <DashboardNavbar />

      {/* add top padding so content is not under navbar */}
      <main className="pt-16 pb-10 px-4 md:px-8">
        <ResumeLabPage />
      </main>

      {/* <Footer /> */}
    </div>
  );
};

export default ResumeLabShell;
