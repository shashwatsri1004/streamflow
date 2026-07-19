'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import CursorEffect from '@/components/CursorEffect';

const QUESTIONS = [
  {
    q: 'Tea vs Coffee',
    a: 'Tea ☕',
    b: 'Coffee ☕',
    memory: { emoji: '☕', title: 'Cafe Dates', text: 'That first cafe we went to — you ordered your usual, I ordered mine, and we talked for three hours without noticing the time. Magic.' },
  },
  {
    q: 'Beach vs Mountains',
    a: 'Beach 🏖️',
    b: 'Mountains 🏔️',
    memory: { emoji: '🌅', title: 'Both Are Perfect With You', text: 'The beach trip where you laughed at the waves. The mountains we drove through with the windows down. Both perfect. Both because you were there.' },
  },
  {
    q: 'Morning vs Night',
    a: 'Morning ☀️',
    b: 'Night 🌙',
    memory: { emoji: '🌙', title: 'Late Nights', text: 'The 2AM conversations that became the most meaningful ones we ever had. Night always wins.' },
  },
  {
    q: 'Movies vs Series',
    a: 'Movies 🎬',
    b: 'Series 📺',
    memory: { emoji: '🍿', title: 'Our Watchlist', text: 'The series we watched episode after episode, always saying "just one more." Every time was the right choice.' },
  },
  {
    q: 'Staying In vs Going Out',
    a: 'Staying In 🏠',
    b: 'Going Out 🌆',
    memory: { emoji: '🏠', title: 'Home Days', text: 'The days we did absolutely nothing and they somehow became the best days. The best kind of nothing.' },
  },
  {
    q: 'Cuddles vs Personal Space 😂',
    a: 'Cuddles 🤗',
    b: 'Space 🚀',
    memory: { emoji: '🤗', title: 'Unlimited Cuddles', text: 'We both know how this one ends. Every time. Cuddles always win. Always.' },
  },
];

export default function ThisOrThatPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [showMemory, setShowMemory] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const handleChoice = (choice: 'a' | 'b') => {
    const answer = choice === 'a' ? QUESTIONS[currentQ].a : QUESTIONS[currentQ].b;
    setChosen(answer);
    setAnswers(prev => [...prev, answer]);
    setTimeout(() => setShowMemory(true), 400);
  };

  const next = () => {
    setShowMemory(false);
    setChosen(null);
    if (currentQ + 1 >= QUESTIONS.length) {
      setDone(true);
    } else {
      setCurrentQ(c => c + 1);
    }
  };

  const question = QUESTIONS[currentQ];

  return (
    <div className="min-h-screen bg-[#141414]">
      <CursorEffect />
      <Navbar />

      <div className="pt-24 pb-20 px-4 md:px-12 max-w-2xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#E50914] text-xs font-semibold uppercase tracking-widest">Quick Quiz</span>
          <h1 className="text-4xl md:text-6xl font-black text-white mt-2 mb-4">This or That</h1>
          <p className="text-[#808080]">Pick one. Each answer unlocks a hidden memory. 💭</p>
        </motion.div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-[#808080] mb-2">
            <span>Question {Math.min(currentQ + 1, QUESTIONS.length)} of {QUESTIONS.length}</span>
            <span>{answers.length} answered</span>
          </div>
          <div className="h-1 bg-[#333] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#E50914] rounded-full"
              animate={{ width: `${(answers.length / QUESTIONS.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              {/* Question */}
              <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">{question.q}</h2>

              {/* Choices */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {(['a', 'b'] as const).map(choice => {
                  const label = choice === 'a' ? question.a : question.b;
                  const isChosen = chosen === label;
                  return (
                    <motion.button
                      key={choice}
                      onClick={() => !chosen && handleChoice(choice)}
                      disabled={!!chosen}
                      className={`py-8 px-4 rounded-2xl text-lg font-bold text-center transition-all ${
                        isChosen
                          ? 'bg-[#E50914] text-white border-2 border-[#E50914]'
                          : chosen
                          ? 'bg-[#1a1a1a] text-[#555] border-2 border-white/5'
                          : 'bg-[#1a1a1a] text-white border-2 border-white/10 hover:border-[#E50914]/50 hover:bg-[#2a2a2a]'
                      }`}
                      whileHover={!chosen ? { scale: 1.03, y: -2 } : {}}
                      whileTap={!chosen ? { scale: 0.97 } : {}}
                    >
                      {label}
                      {isChosen && (
                        <motion.span
                          className="block text-sm font-normal mt-1 opacity-80"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.8 }}
                        >
                          Your choice ✓
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Memory reveal */}
              <AnimatePresence>
                {showMemory && (
                  <motion.div
                    className="rounded-2xl p-6 bg-gradient-to-br from-red-950/30 to-transparent border border-[#E50914]/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{question.memory.emoji}</span>
                      <div>
                        <p className="text-[#E50914] text-xs font-semibold uppercase tracking-widest">Memory Unlocked</p>
                        <h3 className="text-white font-bold text-lg">{question.memory.title}</h3>
                      </div>
                    </div>
                    <p className="text-[#b3b3b3] text-sm leading-relaxed mb-4">{question.memory.text}</p>
                    <motion.button
                      onClick={next}
                      className="bg-[#E50914] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-[#F40612] transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {currentQ + 1 < QUESTIONS.length ? 'Next Question →' : 'See Results ❤️'}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="done"
              className="text-center py-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <div className="text-7xl mb-6">🥰</div>
              <h2 className="text-3xl font-black text-white mb-4">Quiz Complete!</h2>
              <p className="text-[#b3b3b3] mb-4">Your answers revealed {QUESTIONS.length} memories. Every single one is real. ❤️</p>
              <div className="space-y-2 mb-8">
                {answers.map((ans, i) => (
                  <div key={i} className="flex items-center justify-between bg-[#1a1a1a] rounded-xl px-4 py-3">
                    <span className="text-[#808080] text-sm">{QUESTIONS[i].q}</span>
                    <span className="text-white text-sm font-semibold">{ans}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setCurrentQ(0); setChosen(null); setShowMemory(false); setAnswers([]); setDone(false); }}
                className="border border-white/30 text-white px-8 py-3 rounded-full hover:bg-white/10 transition-colors"
              >
                Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
