import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import  About  from './pages/About';
import { Features } from './pages/Features';
import { Projects } from './pages/Projects';
import { Contact } from './pages/Contact';
import { LoginPage } from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import LearningGuide from './pages/LearningGuide';

function App() {
  return (
    <Router>
      <div className="bg-[#0B0D10] text-white min-h-screen font-sans antialiased">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/learning-guide" element={<LearningGuide />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;