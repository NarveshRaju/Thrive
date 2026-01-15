// src/components/UpskillingCourses.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, BarChart, ExternalLink, BookmarkPlus } from 'lucide-react';

const mockCourses = [
  {
    id: 1,
    title: "System Design for Engineers",
    platform: "Coursera",
    skills: ["Architecture", "Scalability"],
    duration: "4 Weeks",
    level: "Advanced",
    recommended: true
  },
  {
    id: 2,
    title: "React Advanced Patterns",
    platform: "Frontend Masters",
    skills: ["React", "Performance"],
    duration: "2 Weeks",
    level: "Intermediate",
    recommended: false
  },
  {
    id: 3,
    title: "DSA Mastery: A-Z",
    platform: "Udemy",
    skills: ["Algorithms", "Logic"],
    duration: "8 Weeks",
    level: "All Levels",
    recommended: true
  },
  {
    id: 4,
    title: "Tech Interview Communication",
    platform: "LinkedIn Learning",
    skills: ["Soft Skills", "Interviews"],
    duration: "1 Week",
    level: "Beginner",
    recommended: false
  }
];

const CourseCard = ({ course }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.02 }}
    className="relative p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl group transition-all"
  >
    {course.recommended && (
      <span className="absolute -top-3 left-6 px-3 py-1 bg-cyan-500 text-black text-[10px] font-black uppercase rounded-full shadow-lg shadow-cyan-500/20">
        Recommended for you
      </span>
    )}
    
    <div className="mb-4">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{course.platform}</p>
      <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">{course.title}</h3>
    </div>

    <div className="flex flex-wrap gap-2 mb-6">
      {course.skills.map(skill => (
        <span key={skill} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] text-slate-300">
          {skill}
        </span>
      ))}
    </div>

    <div className="flex items-center justify-between text-xs text-slate-400 mb-6">
      <div className="flex items-center gap-2"><Clock size={14} /> {course.duration}</div>
      <div className="flex items-center gap-2"><BarChart size={14} /> {course.level}</div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <button className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all">
        <ExternalLink size={14} /> Preview
      </button>
      <button className="flex items-center justify-center gap-2 py-3 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl text-xs font-bold transition-all shadow-lg shadow-cyan-500/10">
        <BookmarkPlus size={14} /> Add Path
      </button>
    </div>
  </motion.div>
);

const UpskillingCourses = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-[#030303] pt-32 pb-20 px-4 md:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Expand your <span className="text-cyan-400">Intelligence</span></h2>
          <p className="text-slate-400 max-w-2xl font-medium">We've identified these courses to bridge your current skill gaps and accelerate your path to Senior Engineer.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default UpskillingCourses;