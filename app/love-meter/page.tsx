'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import CursorEffect from '@/components/CursorEffect';
import { Heart } from 'lucide-react';

export default function LoveMeterPage() {
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'calculating' | 'done' | 'explosion'>('idle');
  const [currentLabel, setCurrentLabel] = useState('Calculating Love...');

  const phases = [
    'Calculating Love...',
    'Measuring Heartbeats...',
    'Counting Smiles...',
    'Analyzing Butterflies...',
    'Measuring Depth of Feelings...',
    'Quantifying Happiness...',
    'Processing Cuddles...',
    'Almost there...',
    'Love Cannot Be Fully Measured...',
    '1000000000%',
  ];

  const start = () => {
    setStarted(true);
    setPhase('calculating');
    setProgress(0);

    let i = 0;
    const labelInterval = setInterval(() => {
      setCurrentLabel(phases[i] || 'Calculating...');
      i++;
      if (i >= phases.length) clearInterval(labelInterval);
    }, 400);

    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setPhase('done');
            setTimeout(() => setPhase('explosion'), 1000);
          }, 300);
          return 100;
        }
        return p + 0.8;
      });
    }, 40);
  };

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col">
      <CursorEffect />
      <Navbar />

      <div className="flex-1 flex items-center justify-center pt-24 pb-20 px-4">
        <AnimatePresence mode="wait">
          {phase === 'idle' && (
            <motion.div
              key="idle"
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-8xl mb-8">💘</div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4">Love Meter</h1>
              <p className="text-[#808080] text-lg mb-10">How much do I love you? Let&apos;s find out.</p>
              <motion.button
                onClick={start}
                className="bg-[#E50914] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#F40612] transition-colors"
                style={{ boxShadow: '0 0 30px rgba(229,9,20,0.4)' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Measure Love ❤️
              </motion.button>
            </motion.div>
          )}

          {phase === 'calculating' && (
            <motion.div
              key="calculating"
              className="text-center max-w-lg w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Animated heart */}
              <motion.div
                className="text-8xl mb-8"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              >
                💓
              </motion.div>

              {/* Label */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentLabel}
                  className="text-[#E50914] text-lg font-semibold mb-6 h-7"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentLabel}
                </motion.p>
              </AnimatePresence>

              {/* Progress bar */}
              <div className="h-4 bg-[#333] rounded-full overflow-hidden mb-4 mx-auto">
                <motion.div
                  className="h-full rounded-full love-meter-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-[#808080] text-4xl font-black">{Math.round(progress)}%</p>
            </motion.div>
          )}

          {(phase === 'done' || phase === 'explosion') && (
            <motion.div
              key="done"
              className="text-center relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Explosion hearts */}
              {phase === 'explosion' && [...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl pointer-events-none"
                  style={{ left: '50%', top: '50%' }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                  animate={{
                    x: (Math.random() - 0.5) * 500,
                    y: (Math.random() - 0.5) * 400,
                    opacity: 0,
                    scale: 1,
                    rotate: Math.random() * 360,
                  }}
                  transition={{ duration: 1.5, delay: Math.random() * 0.5, ease: 'easeOut' }}
                >
                  {['❤️', '💕', '💖', '💗', '💝'][Math.floor(Math.random() * 5)]}
                </motion.div>
              ))}

              <motion.div
                className="text-8xl mb-4"
                animate={{ scale: [1, 1.3, 1], rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              >
                💗
              </motion.div>

              <motion.p
                className="text-[#E50914] text-sm font-semibold uppercase tracking-widest mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Result
              </motion.p>

              <motion.div
                className="text-5xl md:text-8xl font-black text-white mb-4"
                style={{ textShadow: '0 0 40px rgba(229,9,20,0.6)' }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              >
                1,000,000,000%
              </motion.div>

              <motion.p
                className="text-xl text-[#b3b3b3] mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                The meter broke. Numbers aren&apos;t big enough. ❤️
              </motion.p>

              <motion.button
                onClick={() => { setPhase('idle'); setStarted(false); setProgress(0); }}
                className="border border-white/30 text-white px-8 py-3 rounded-full hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Measure Again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
