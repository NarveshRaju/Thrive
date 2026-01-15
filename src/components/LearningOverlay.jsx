// src/components/LearningOverlay.jsx
const LearningOverlay = ({ mission, onProceed, onBack }) => {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[150] bg-black p-8 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-brand text-white">{mission.name} ARCHIVES</h2>
          <button onClick={onBack} className="text-slate-500 hover:text-white uppercase text-xs font-bold tracking-widest">Abort Mission</button>
        </div>
  
        <div className="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden">
          {/* Video Side (70%) */}
          <div className="flex-[7] rounded-[2.5rem] overflow-hidden border border-white/10 bg-black relative shadow-2xl">
            <iframe 
              width="100%" height="100%" 
              src={`https://www.youtube.com/embed/${mission.video}?autoplay=1`} 
              frameBorder="0" allowFullScreen
            />
          </div>
  
          {/* Info Side (30%) - Personalized Experience */}
          <div className="flex-[3] bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 overflow-y-auto">
            <h4 className="text-cyan-400 font-black text-xs uppercase tracking-widest mb-6">Mission Intelligence</h4>
            <div className="space-y-6">
              <section>
                <p className="text-white font-bold text-sm mb-2 underline decoration-cyan-500/50">Current Focus</p>
                <p className="text-slate-400 text-xs leading-relaxed">{mission.topic}</p>
              </section>
              <section>
                <p className="text-white font-bold text-sm mb-2 underline decoration-cyan-500/50">Key Objectives</p>
                <ul className="space-y-3">
                  {mission.tasks.map((task, i) => (
                    <li key={i} className="text-[11px] text-slate-300 flex items-center gap-2">
                      <div className="w-1 h-1 bg-cyan-500 rounded-full" /> {task}
                    </li>
                  ))}
                </ul>
              </section>
              <div className="pt-8">
                <button onClick={onProceed} className="w-full py-4 bg-cyan-500 text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-cyan-400 transition-all">
                  Start Final Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };