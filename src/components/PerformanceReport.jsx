// src/components/PerformanceReport.jsx
const PerformanceReport = ({ score, mission, incorrectAnswers, onRetry, onClose }) => {
    return (
      <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white/[0.02] border border-white/10 rounded-[3rem] p-10 backdrop-blur-3xl">
          <div className="text-center mb-10">
            <h3 className="text-4xl font-brand text-white mb-2">{score}% SYNC</h3>
            <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Mission Diagnostic Report</p>
          </div>
  
          <div className="space-y-4 mb-10 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            <h4 className="text-xs font-bold text-red-400 uppercase mb-4">Improvement Areas:</h4>
            {incorrectAnswers.map((item, i) => (
              <div key={i} className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
                <p className="text-white text-xs font-bold mb-1">Q: {item.question}</p>
                <p className="text-slate-400 text-[11px]">Tip: {item.improvementTip}</p>
              </div>
            ))}
          </div>
  
          <div className="grid grid-cols-2 gap-4">
            <button onClick={onRetry} className="py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase text-white hover:bg-white/10 transition-all">
              Re-initiate Mission
            </button>
            <button onClick={onClose} className="py-4 bg-cyan-500 rounded-2xl text-[10px] font-black uppercase text-black hover:bg-cyan-400 shadow-lg shadow-cyan-500/20">
              Back to Star Map
            </button>
          </div>
        </div>
      </div>
    );
  };