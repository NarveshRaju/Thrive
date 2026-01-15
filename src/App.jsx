// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { Home } from "./pages/Home";
import About from "./pages/About";
import { Features } from "./pages/Features";
import { Projects } from "./pages/Projects";
import { Contact } from "./pages/Contact";
import { LoginPage } from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ResumeEntryPage from "./pages/ResumeEntryPage";
import ResumeLabShell from "./pages/ResumeLabShell";
import CareerPersona from './pages/CareerPersona';

function App() {
  return (
    <Router>
      <div className="bg-[#0B0D10] text-white min-h-screen font-sans antialiased">
        {/* Show marketing navbar on public pages; 
           hide it on dashboard-style pages if you want */}
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/career-persona" element={<CareerPersona />} />
          {/* Dashboard home */}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* AI Resume Builder page */}
          <Route path="/resume-builder" element={<ResumeEntryPage />} />
          <Route
            path="/resume-builder/editor"
            element={<ResumeLabShell />}
          />{" "}
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
