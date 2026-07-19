'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import CursorEffect from '@/components/CursorEffect';
import { REASONS_I_LOVE_YOU } from '@/lib/data';
import { Heart, RotateCcw } from 'lucide-react';

export default function ReasonsPage() {
  const [revealed, setRevealed] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const revealNext = () => {
    if (flipped) {
      setRevealed(prev => [...prev, current]);
      if (current < REASONS_I_LOVE_YOU.length - 1) {
        setCurrent(c => c + 1);
        setFlipped(false);
      }
    } else {
      setFlipped(true);
    }
  };

  const progress = (revealed.length / REASONS_I_LOVE_YOU.length) * 100;

  return (
    <div className="min-h-screen bg-[#141414]">
      <CursorEffect />
      <Navbar />

      <div className="pt-24 pb-20 px-4 md:px-12 max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#E50914] text-xs font-semibold uppercase tracking-widest">Interactive Experience</span>
          <h1 className="text-4xl md:text-6xl font-black text-white mt-2 mb-4">100 Reasons</h1>
          <p className="text-[#808080] text-lg">Why I love you. Click the card to reveal each one.</p>
        </motion.div>

        {/* Progress */}
        <div className="mb-10">
          <div className="flex justify-between text-sm text-[#808080] mb-2">
            <span>Reasons Revealed</span>
            <span>{revealed.length} / {REASONS_I_LOVE_YOU.length}</span>
          </div>
          <div className="h-1.5 bg-[#333] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#E50914] to-[#ff6b6b] rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="flex justify-center mb-12">
          <motion.div
            className="reason-card w-full max-w-md cursor-pointer"
            onClick={revealNext}
          >
            <div className="relative" style={{ height: 280 }}>
              {/* Front */}
              <motion.div
                className={`absolute inset-0 rounded-2xl flex items-center justify-center ${
                  flipped ? '[backface-visibility:hidden]' : ''
                }`}
                style={{
                  background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  rotateY: flipped ? 180 : 0,
                  backfaceVisibility: 'hidden',
                }}
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                <div className="text-center p-8">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Heart size={48} className="text-[#E50914] fill-[#E50914] mx-auto mb-4" />
                  </motion.div>
                  <p className="text-[#E50914] text-lg font-bold mb-2">Reason #{current + 1}</p>
                  <p className="text-[#808080] text-sm">Click to reveal</p>
                </div>
              </motion.div>

              {/* Back */}
              <motion.div
                className="absolute inset-0 rounded-2xl flex items-center justify-center p-8"
                style={{
                  background: 'linear-gradient(135deg, #1a0505, #2a0808)',
                  border: '1px solid rgba(229,9,20,0.3)',
                  rotateY: flipped ? 0 : -180,
                  backfaceVisibility: 'hidden',
                }}
                animate={{ rotateY: flipped ? 0 : -180 }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                <div className="text-center">
                  <p className="text-[#E50914] text-sm font-semibold uppercase tracking-widest mb-4">Reason #{current + 1}</p>
                  <p className="text-white text-lg md:text-xl font-medium leading-relaxed">
                    &quot;{REASONS_I_LOVE_YOU[current]}&quot;
                  </p>
                  {current < REASONS_I_LOVE_YOU.length - 1 && (
                    <p className="text-[#808080] text-xs mt-4">Click to continue</p>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <motion.button
            onClick={() => { if (current > 0) { setCurrent(c => c - 1); setFlipped(false); } }}
            disabled={current === 0}
            className="px-5 py-2.5 rounded-full border border-white/20 text-[#b3b3b3] text-sm disabled:opacity-30 hover:border-white hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ← Previous
          </motion.button>
          <span className="text-[#808080] text-sm">{current + 1} of {REASONS_I_LOVE_YOU.length}</span>
          <motion.button
            onClick={revealNext}
            className="px-5 py-2.5 rounded-full bg-[#E50914] text-white text-sm font-semibold hover:bg-[#F40612] transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {flipped ? 'Next Reason →' : 'Reveal ❤️'}
          </motion.button>
        </div>

        {/* Already revealed */}
        {revealed.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <Heart size={18} className="text-[#E50914] fill-[#E50914]" />
              Revealed Reasons ({revealed.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
              <AnimatePresence>
                {revealed.map(i => (
                  <motion.div
                    key={i}
                    className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <span className="text-[#E50914] text-xs font-semibold block mb-1">#{i + 1}</span>
                    <p className="text-[#b3b3b3] text-sm">{REASONS_I_LOVE_YOU[i]}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Completion */}
        <AnimatePresence>
          {revealed.length === REASONS_I_LOVE_YOU.length && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center text-center p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="text-7xl mb-6">❤️</div>
                <h2 className="text-4xl font-black text-white mb-4">All 100 Reasons!</h2>
                <p className="text-[#b3b3b3] text-lg mb-2">And the list never actually ends.</p>
                <p className="text-[#E50914] text-xl font-semibold mb-8">Every day you give me more. ❤️</p>
                <motion.button
                  onClick={() => { setRevealed([]); setCurrent(0); setFlipped(false); }}
                  className="flex items-center gap-2 mx-auto bg-[#E50914] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#F40612] transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RotateCcw size={16} /> Start Over
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
