// src/components/learning/AssessmentModal.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AssessmentModal = ({ mission, questions, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(300); // 5-minute mission clock

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAnswer = (selectedIdx) => {
    const isCorrect = selectedIdx === questions[currentIdx].correctAnswer;
    if (isCorrect) setScore(s => s + 1);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      const finalPercentage = ((score + (isCorrect ? 1 : 0)) / questions.length) * 100;
      onComplete(finalPercentage);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-2xl">
      <div className="w-full max-w-2xl bg-white/[0.03] border border-white/10 p-10 rounded-[3rem] shadow-2xl">
        <div className="flex justify-between mb-8 text-[10px] font-black uppercase tracking-widest">
          <span className="text-cyan-500">Mission: {mission.name}</span>
          <span className="text-orange-500">Time: {Math.floor(timer/60)}:{(timer%60).toString().padStart(2,'0')}</span>
        </div>

        <h3 className="text-2xl font-bold mb-8">{questions[currentIdx].question}</h3>

        <div className="grid gap-4">
          {questions[currentIdx].options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className="p-5 text-left bg-white/5 border border-white/5 rounded-2xl hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};