'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import CursorEffect from '@/components/CursorEffect';

const LETTER_TEXT = `My Love,

I've tried to write this letter a hundred times. Each time, the words feel too small for what I feel. But here I am, trying again — because you deserve every attempt, even the imperfect ones.

When I think about the day we met, I realize how close I came to missing it. To missing you. And that thought genuinely terrifies me, because you are the best thing that has ever happened to me.

You make ordinary days feel like movies. You make difficult days feel survivable. You make good days feel like the best days of my life. And somehow, miraculously, you do this just by being you — by existing, by smiling, by saying my name, by choosing to be here.

I want you to know: I see you. All of you. The version of you that's confident and laughing, and the version that's scared and quiet. The version that's excited and bright, and the version that's tired and uncertain. I love every single version. There isn't one I would trade.

I love you for your laugh — the kind that comes from somewhere real. I love you for your kindness, which you give away so freely. I love you for how fiercely you care, even when caring is hard. I love you for the way you see the world, which is always a little more beautiful through your eyes.

On this Girlfriend's Day, I don't just want to celebrate the day you were born. I want to celebrate every day since — every moment you've given me the privilege of knowing you. Every conversation that ran too long. Every memory we made without planning to. Every version of "us" that has slowly, quietly, become the most important thing in my life.

Happy Girlfriend's Day, my love. May this year bring you everything you deserve — which is everything. All of it. More than you could ever ask for.

I love you.

Always and absolutely,
Yours.`;

interface AmbientHeart {
  left: string; top: string; duration: number; delay: number;
}

export default function LoveLetterPage() {
  const [opened, setOpened] = useState(false);
  const [letterVisible, setLetterVisible] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [typewriterDone, setTypewriterDone] = useState(false);
  // Generated on the client only so randomized positions don't cause a
  // server/client hydration mismatch.
  const [hearts, setHearts] = useState<AmbientHeart[]>([]);

  useEffect(() => {
    setHearts(
      Array.from({ length: 12 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 4 + Math.random() * 4,
        delay: Math.random() * 3,
      })),
    );
  }, []);

  const handleEnvelope = () => {
    setOpened(true);
    setTimeout(() => setLetterVisible(true), 800);
  };

  useEffect(() => {
    if (!letterVisible) return;
    let i = 0;
    const interval = setInterval(() => {
      i += 3;
      setDisplayedText(LETTER_TEXT.slice(0, i));
      if (i >= LETTER_TEXT.length) {
        clearInterval(interval);
        setTypewriterDone(true);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [letterVisible]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative">
      <CursorEffect />
      <Navbar />

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        {hearts.map((h, i) => (
          <motion.div
            key={i}
            className="absolute text-[#E50914] opacity-5 text-4xl"
            style={{ left: h.left, top: h.top }}
            animate={{ y: [0, -20, 0], opacity: [0.03, 0.08, 0.03], scale: [1, 1.2, 1] }}
            transition={{ duration: h.duration, repeat: Infinity, delay: h.delay }}
          >
            ❤️
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 pt-24 pb-20 px-4 md:px-12 max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#E50914] text-xs font-semibold uppercase tracking-widest">Written From The Heart</span>
          <h1 className="text-4xl md:text-6xl font-black text-white mt-2 mb-4">Love Letter</h1>
          {!opened && <p className="text-[#808080] text-lg">Click the envelope to open your letter. 💌</p>}
        </motion.div>

        {/* Envelope */}
        <AnimatePresence>
          {!opened && (
            <motion.div
              className="flex justify-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="cursor-pointer group"
                onClick={handleEnvelope}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Envelope */}
                <div
                  className="relative w-72 h-48 rounded-lg shadow-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #2a0a0a, #3a1010)' }}
                >
                  {/* Envelope flap */}
                  <div
                    className="absolute top-0 left-0 right-0"
                    style={{
                      height: 0,
                      borderLeft: '144px solid transparent',
                      borderRight: '144px solid transparent',
                      borderTop: '96px solid rgba(229,9,20,0.3)',
                    }}
                  />
                  {/* Body lines */}
                  <div className="absolute bottom-0 left-0 w-full" style={{
                    height: 0,
                    borderLeft: '144px solid transparent',
                    borderRight: '144px solid transparent',
                    borderBottom: '80px solid rgba(229,9,20,0.15)',
                  }} />
                  <div className="absolute top-0 bottom-0 left-0 w-1/2" style={{
                    height: 0,
                    borderTop: '192px solid transparent',
                    borderLeft: '144px solid rgba(229,9,20,0.15)',
                  }} />

                  {/* Center seal */}
                  <div className="relative z-10 text-center">
                    <motion.div
                      className="w-14 h-14 bg-[#E50914] rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg"
                      style={{ boxShadow: '0 0 20px rgba(229,9,20,0.5)' }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <span className="text-2xl">💌</span>
                    </motion.div>
                    <p className="text-white/60 text-sm">Click to open</p>
                  </div>
                </div>

                <motion.p
                  className="text-center text-[#E50914] text-sm mt-4 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Open me ❤️
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Letter */}
        <AnimatePresence>
          {letterVisible && (
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              {/* Paper texture */}
              <div
                className="rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #1a0a0a 0%, #0f0f0f 50%, #1a0808 100%)',
                  border: '1px solid rgba(229,9,20,0.2)',
                }}
              >
                {/* Decorative border */}
                <div className="absolute inset-3 border border-[#E50914]/10 rounded-xl pointer-events-none" />

                {/* Letter content */}
                <div
                  className="relative z-10 text-[#d4c5c5] text-sm md:text-base leading-8 whitespace-pre-line"
                  style={{ fontFamily: "'Georgia', serif", minHeight: 300 }}
                >
                  {displayedText}
                  {!typewriterDone && (
                    <motion.span
                      className="inline-block w-0.5 h-4 bg-[#E50914] ml-0.5"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Decorative hearts */}
                <div className="absolute top-4 right-4 text-[#E50914] opacity-20 text-3xl">❤️</div>
                <div className="absolute bottom-4 left-4 text-[#E50914] opacity-20 text-2xl">💕</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
