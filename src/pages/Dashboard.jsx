import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/DashboardNavbar";
import {
  TrendingUp,
  Target,
  Award,
  Zap,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Search,
} from "lucide-react";

const MetricCard = ({ title, value, delta, icon: Icon, colorClass, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-3xl hover:bg-white/[0.05] transition-all group"
  >
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl bg-white/5 ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span
        className={`text-xs font-bold flex items-center gap-1 ${
          delta.includes("+") ? "text-cyan-400" : "text-slate-500"
        }`}
      >
        {delta} <TrendingUp className="w-3 h-3" />
      </span>
    </div>
    <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">
      {title}
    </p>
    <h3 className="text-2xl font-bold text-white">{value}</h3>
  </motion.div>
);

const Dashboard = () => {
  const navigate = useNavigate();

  const goToPersona = () => {
    navigate("/career-persona");
  };

  return (
    <div className="min-h-screen bg-[#030303] text-slate-200">
      <Navbar />

      <main className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Welcome back, Alex
            </h1>
            <p className="text-slate-500 font-medium">
              Your career momentum is up 12% this week.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-2xl flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-bold text-amber-500">
                7 Day Streak
              </span>
            </div>
          </div>
        </header>

        {/* 1. PRIMARY METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Readiness Score"
            value="84/100"
            delta="+4%"
            icon={Target}
            colorClass="text-amber-500"
            delay={0.1}
          />
          <MetricCard
            title="Skill Level"
            value="Lvl 14"
            delta="Next: 240xp"
            icon={Award}
            colorClass="text-purple-500"
            delay={0.2}
          />
          <MetricCard
            title="Active Goals"
            value="6"
            delta="2 Completed"
            icon={CheckCircle2}
            colorClass="text-cyan-400"
            delay={0.3}
          />
          <MetricCard
            title="Thrive Index"
            value="Premium"
            delta="Top 5%"
            icon={Sparkles}
            colorClass="text-white"
            delay={0.4}
          />
        </div>

        {/* 2. MAIN PROGRESS VISUAL (CENTERPIECE) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 bg-[#080808] border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-white font-bold">Career Momentum</h3>
              <select className="bg-white/5 border border-white/10 rounded-xl px-3 py-1 text-xs outline-none">
                <option>Last 30 Days</option>
                <option>Last 6 Months</option>
              </select>
            </div>

            {/* SVG Graph Placeholder - Cinematic Style */}
            <div className="h-64 w-full relative">
              <svg viewBox="0 0 400 100" className="w-full h-full">
                <defs>
                  <linearGradient
                    id="gradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,80 Q50,70 100,40 T200,50 T300,20 T400,30"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="2"
                />
                <path
                  d="M0,80 Q50,70 100,40 T200,50 T300,20 T400,30 L400,100 L0,100 Z"
                  fill="url(#gradient)"
                />
              </svg>
              {/* Tooltip Simulation */}
              <div className="absolute top-10 left-3/4 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_#22d3ee]" />
            </div>
          </motion.div>

          {/* 3. INSIGHT & ACTION CARDS */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-600 uppercase tracking-widest px-2">
              Next Actions
            </h3>

            {/* Growth Opportunity (existing) */}
            <div className="bg-purple-500/5 border border-purple-500/20 rounded-3xl p-5 group cursor-pointer hover:bg-purple-500/10 transition-all">
              <div className="flex gap-4">
                <div className="p-3 bg-purple-500/20 rounded-2xl h-fit">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-1">
                    Growth Opportunity
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Your data visualization skills match a high-demand lead role
                    at Stripe.
                  </p>
                  <button className="mt-3 text-[10px] font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Match <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* NEW: Career Persona card */}
            <div
              onClick={goToPersona}
              className="bg-white/[0.03] border border-cyan-400/30 rounded-3xl p-5 group cursor-pointer hover:bg-cyan-500/5 transition-all"
            >
              <div className="flex gap-4">
                <div className="p-3 bg-cyan-500/15 rounded-2xl h-fit">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-1">
                    Define your Career Persona
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Turn your skills, goals, and resume into a clear
                    professional identity you can reuse across resume, LinkedIn,
                    and portfolio.
                  </p>
                  <button className="mt-3 text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                    Open Persona Generator <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Strongest Skill (existing) */}
            <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-5 hover:bg-white/[0.06] transition-all">
              <h4 className="text-slate-300 font-bold text-sm mb-3">
                Strongest Skill This Week
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  System Architecture
                </span>
                <span className="text-xs font-bold text-cyan-400">+18%</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full mt-2">
                <div className="bg-cyan-400 h-full w-[70%] rounded-full shadow-[0_0_8px_#22d3ee]" />
              </div>
            </div>
          </div>
        </div>

        {/* 4. USER ACTIVITY & GOALS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
          <div className="bg-[#080808] border border-white/5 rounded-[2.5rem] p-8">
            <h3 className="text-white font-bold mb-6">Recent Milestones</h3>
            <div className="space-y-6">
              {[
                {
                  label: "Completed Node.js Advanced Course",
                  date: "2h ago",
                  icon: <CheckCircle2 className="w-4 h-4 text-cyan-400" />,
                },
                {
                  label: 'Earned "Visual Thinking" Badge',
                  date: "Yesterday",
                  icon: <Award className="w-4 h-4 text-amber-500" />,
                },
                {
                  label: "Updated Portfolio Architecture",
                  date: "3 days ago",
                  icon: <ArrowUpRight className="w-4 h-4 text-slate-400" />,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between group cursor-default"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-white/5 p-2 rounded-xl group-hover:bg-white/10 transition-colors">
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium text-slate-300">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-600 font-bold uppercase">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
