import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Features } from './pages/Features';
import { Projects } from './pages/Projects';
import { Contact } from './pages/Contact';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import OnboardingPage from './pages/OnboardingPage';
import Dashboard from './pages/Dashboard';
import ResumeEntryPage from "./pages/ResumeEntryPage";
import ResumeLabShell from "./pages/ResumeLabShell";
import CareerPersona from './pages/CareerPersona';
import InterviewRoom from './pages/InterviewRoom';
import InterviewHistory from './pages/InterviewHistory';
import InterviewPrep from './pages/InterviewPrep';

function App() {
  return (
    <Router>
      <div className="bg-[#0B0D10] text-white min-h-screen font-sans antialiased">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Onboarding */}
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/interview-prep" element={<InterviewPrep />} />

          {/* Dashboard & Career */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/career-persona" element={<CareerPersona />} />
          
          {/* Resume Builder */}
          <Route path="/resume-builder" element={<ResumeEntryPage />} />
          <Route path="/resume-builder/editor" element={<ResumeLabShell />} />
          
          {/* Interview System */}
          <Route path="/interview/:roomId" element={<InterviewRoom />} />
          <Route path="/interview-history" element={<InterviewHistory />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
