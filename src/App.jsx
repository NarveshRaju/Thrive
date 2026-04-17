import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import CareerPathRecommender from './pages/CareerPathRecommender';
import LearningGuide from './pages/LearningGuide';

// Pages that use the DashboardNavbar instead of the main Navbar
const dashboardRoutes = [
  '/dashboard', '/career-path', '/career-persona', '/resume-builder',
  '/learning-guide', '/interview-prep', '/interview-history', '/onboarding'
];

function AppLayout() {
  const location = useLocation();
  const isDashboardPage = dashboardRoutes.some(route => location.pathname.startsWith(route))
    || location.pathname.startsWith('/interview/');

  return (
    <div className="bg-[#0B0D10] text-white min-h-screen font-sans antialiased">
      {!isDashboardPage && <Navbar />}
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

        {/* Dashboard & Career */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/career-persona" element={<CareerPersona />} />
        <Route path="/career-path" element={<CareerPathRecommender />} />
        <Route path="/learning-guide" element={<LearningGuide />} />

        {/* Resume Builder */}
        <Route path="/resume-builder" element={<ResumeEntryPage />} />
        <Route path="/resume-builder/editor" element={<ResumeLabShell />} />

        {/* Interview System */}
        <Route path="/interview-prep" element={<InterviewPrep />} />
        <Route path="/interview/:roomId" element={<InterviewRoom />} />
        <Route path="/interview-history" element={<InterviewHistory />} />
      </Routes>
      {!isDashboardPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
