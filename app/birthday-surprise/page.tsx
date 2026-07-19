'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import CursorEffect from '@/components/CursorEffect';

const BIRTHDAY_LETTER = `My love,

You made it to the end.

Which means you've been watching, clicking, smiling, maybe crying a little (no judgment — I may have too when I was building this for you), and spending time in this little world I made just for you.

This whole thing — every row, every card, every reason, every voice note, every polaroid — exists because of one simple fact: you are the most extraordinary person I have ever known, and you deserve a whole streaming platform dedicated entirely to you.

I made this because I wanted you to feel, for just a moment, what it feels like to be seen through my eyes. To see yourself the way I see you — as the lead of every story, the star of every scene, the reason every moment becomes worth remembering.

You are my favorite memory and my best dream at the same time.

Happy Birthday, my love. I hope this year is as wonderful as you make mine feel every day.

I love you.
Always.
Completely.
Forever.

— Me 💌`;

const SLIDESHOW = [
  'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1415131/pexels-photo-1415131.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1024975/pexels-photo-1024975.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/346804/pexels-photo-346804.jpeg?auto=compress&cs=tinysrgb&w=800',
  'https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg?auto=compress&cs=tinysrgb&w=800',
];

function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {[...Array(60)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            top: -20,
            background: ['#E50914', '#FF9500', '#34C759', '#007AFF', '#FFD60A', '#FF6B35', '#9B59B6'][Math.floor(Math.random() * 7)],
          }}
          animate={{
            y: '105vh',
            rotate: Math.random() * 720 - 360,
            x: (Math.random() - 0.5) * 300,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            delay: Math.random() * 4,
            repeat: Infinity,
            repeatDelay: Math.random() * 5,
          }}
        />
      ))}
      {/* Emoji bursts */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`emoji-${i}`}
          className="absolute text-2xl"
          style={{ left: `${Math.random() * 100}%`, top: -30 }}
          animate={{ y: '105vh', x: (Math.random() - 0.5) * 200, opacity: [1, 1, 0], rotate: Math.random() * 360 }}
          transition={{ duration: 4 + Math.random() * 3, delay: Math.random() * 5, repeat: Infinity, repeatDelay: Math.random() * 6 }}
        >
          {['❤️', '💕', '💖', '✨', '🎉', '🎊'][Math.floor(Math.random() * 6)]}
        </motion.div>
      ))}
    </div>
  );
}

function Fireworks() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 20}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2, delay: i * 0.6, repeat: Infinity, repeatDelay: 3 }}
        >
          {[...Array(12)].map((_, j) => (
            <motion.div
              key={j}
              className="absolute w-1.5 h-1.5 rounded-full"
              style={{ background: ['#E50914', '#FFD60A', '#FF9500', '#FF6B35', '#007AFF'][j % 5] }}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: Math.cos((j / 12) * 2 * Math.PI) * 60,
                y: Math.sin((j / 12) * 2 * Math.PI) * 60,
                opacity: 0,
              }}
              transition={{ duration: 1.5, delay: i * 0.6, repeat: Infinity, repeatDelay: 3 }}
            />
          ))}
        </motion.div>
      ))}
    </div>
  );
}

export default function BirthdaySurprisePage() {
  const [phase, setPhase] = useState<'fade-in' | 'title' | 'slideshow' | 'letter' | 'finale'>('fade-in');
  const [slideIndex, setSlideIndex] = useState(0);
  const [letterText, setLetterText] = useState('');
  const [letterDone, setLetterDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setPhase('title'), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (phase !== 'slideshow') return;
    const interval = setInterval(() => {
      setSlideIndex(i => (i + 1) % SLIDESHOW.length);
    }, 2500);
    const timer = setTimeout(() => {
      clearInterval(interval);
      setPhase('letter');
    }, 16000);
    return () => { clearInterval(interval); clearTimeout(timer); };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'letter') return;
    let i = 0;
    const interval = setInterval(() => {
      i += 4;
      setLetterText(BIRTHDAY_LETTER.slice(0, i));
      if (i >= BIRTHDAY_LETTER.length) {
        clearInterval(interval);
        setLetterDone(true);
        setTimeout(() => setPhase('finale'), 2000);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      <CursorEffect />

      {/* Phase: Title */}
      <AnimatePresence>
        {phase === 'title' && (
          <motion.div
            className="fixed inset-0 z-20 flex flex-col items-center justify-center text-center px-4"
            style={{ background: 'linear-gradient(135deg, #0a0000, #1a0505, #000000)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
            >
              <p className="text-[#E50914] text-sm font-semibold uppercase tracking-widest mb-4">MEMFLIX Presents</p>
              <h1
                className="text-5xl md:text-8xl font-black text-white mb-6"
                style={{ textShadow: '0 0 60px rgba(229,9,20,0.6), 0 0 120px rgba(229,9,20,0.3)' }}
              >
                The Best Chapter
                <br />
                <span className="text-[#E50914]">Is Yet To Come</span>
              </h1>
              <motion.p
                className="text-[#b3b3b3] text-xl mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                A MEMFLIX Original — For You, Always.
              </motion.p>
              <motion.button
                onClick={() => setPhase('slideshow')}
                className="bg-white text-black px-12 py-4 rounded font-bold text-lg hover:bg-white/90 transition-colors"
                style={{ boxShadow: '0 0 30px rgba(255,255,255,0.2)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ▶ Play
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase: Slideshow */}
      <AnimatePresence>
        {phase === 'slideshow' && (
          <motion.div
            className="fixed inset-0 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Confetti />
            <AnimatePresence mode="wait">
              <motion.img
                key={slideIndex}
                src={SLIDESHOW[slideIndex]}
                alt="Memory"
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-end justify-center pb-20">
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-white text-2xl font-bold text-shadow-lg">Our Story 💕</p>
                <p className="text-white/70 text-sm mt-2">Every moment worth keeping forever</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase: Letter */}
      <AnimatePresence>
        {phase === 'letter' && (
          <motion.div
            className="fixed inset-0 z-20 flex items-start justify-center overflow-y-auto"
            style={{ background: 'linear-gradient(135deg, #0a0000, #100000)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="max-w-2xl w-full px-4 py-16">
              <div
                className="rounded-2xl p-8 md:p-12 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #1a0808, #0f0f0f)',
                  border: '1px solid rgba(229,9,20,0.2)',
                }}
              >
                <div
                  className="text-[#d4c5c5] text-sm md:text-base leading-8 whitespace-pre-line"
                  style={{ fontFamily: 'Georgia, serif', minHeight: 300 }}
                >
                  {letterText}
                  {!letterDone && (
                    <motion.span
                      className="inline-block w-0.5 h-4 bg-[#E50914] ml-0.5"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase: Finale */}
      <AnimatePresence>
        {phase === 'finale' && (
          <motion.div
            className="fixed inset-0 z-20 flex flex-col items-center justify-center text-center px-4"
            style={{ background: 'radial-gradient(ellipse at center, #1a0505 0%, #000000 70%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Confetti />
            <Fireworks />

            {/* Floating hearts */}
            <div className="fixed inset-0 pointer-events-none z-10">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-[#E50914]"
                  style={{
                    left: `${Math.random() * 100}%`,
                    fontSize: `${20 + Math.random() * 30}px`,
                    opacity: 0.3,
                  }}
                  animate={{ y: [100, -100], opacity: [0, 0.4, 0] }}
                  transition={{ duration: 4 + Math.random() * 4, delay: Math.random() * 4, repeat: Infinity }}
                >
                  ❤️
                </motion.div>
              ))}
            </div>

            <div className="relative z-30">
              <motion.div
                className="text-6xl md:text-9xl font-black text-white mb-8"
                style={{ textShadow: '0 0 60px rgba(229,9,20,0.8), 0 0 120px rgba(229,9,20,0.4)' }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}
              >
                I Love You
              </motion.div>

              <motion.p
                className="text-[#b3b3b3] text-xl mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Always. Completely. Forever. ❤️
              </motion.p>

              <motion.p
                className="text-[#E50914] text-3xl md:text-4xl font-black mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                style={{ textShadow: '0 0 30px rgba(229,9,20,0.6)' }}
              >
                Happy Birthday, My Love! 🎂
              </motion.p>

              <motion.div
                className="flex flex-col md:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
              >
                <Link href="/home">
                  <motion.button
                    className="bg-[#E50914] text-white px-10 py-4 rounded font-bold text-lg hover:bg-[#F40612] transition-colors"
                    style={{ boxShadow: '0 0 30px rgba(229,9,20,0.5)' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ↺ Replay Our Story
                  </motion.button>
                </Link>
                <Link href="/">
                  <motion.button
                    className="border-2 border-white/40 text-white px-10 py-4 rounded font-bold text-lg hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Back to MEMFLIX
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fade in overlay */}
      <AnimatePresence>
        {phase === 'fade-in' && (
          <motion.div
            className="fixed inset-0 z-30 bg-black"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
