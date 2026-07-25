'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LOADING_QUOTES } from '@/lib/data';

interface LoadingScreenProps {
  onComplete: () => void;
}

interface Particle {
  x0: string; y0: string; x1: string; y1: string; duration: number;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [quote, setQuote] = useState(LOADING_QUOTES[0]);
  const [progress, setProgress] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);
  // Generated on the client only, so the randomized positions never cause a
  // server/client hydration mismatch.
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, () => ({
        x0: Math.random() * 100 + '%',
        y0: Math.random() * 100 + '%',
        x1: Math.random() * 100 + '%',
        y1: Math.random() * 100 + '%',
        duration: 3 + Math.random() * 4,
      })),
    );
  }, []);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setQuoteIndex(i => {
        const next = (i + 1) % LOADING_QUOTES.length;
        setQuote(LOADING_QUOTES[next]);
        return next;
      });
    }, 600);

    const progressInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(progressInterval);
          clearInterval(quoteInterval);
          setTimeout(onComplete, 400);
          return 100;
        }
        return p + 2;
      });
    }, 60);

    return () => {
      clearInterval(quoteInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated background particles (client-only to avoid hydration mismatch) */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#E50914] rounded-full opacity-30"
            initial={{ x: p.x0, y: p.y0 }}
            animate={{
              y: [p.y0, p.y1],
              x: [p.x0, p.x1],
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Logo */}
      <motion.div
        className="mb-12 relative flex flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <div className="relative text-center">
          <span
            className="text-7xl md:text-9xl font-black tracking-tight text-[#E50914] inline-block"
            style={{
              textShadow: '0 0 40px rgba(229,9,20,0.8), 0 0 80px rgba(229,9,20,0.4)',
              fontFamily: 'Georgia, serif',
              letterSpacing: '-2px',
            }}
          >
            TanyaTV
          </span>
          <motion.div
            className="absolute inset-0 text-7xl md:text-9xl font-black tracking-tight text-[#E50914] opacity-20 flex items-center justify-center"
            style={{
              filter: 'blur(20px)',
              fontFamily: 'Georgia, serif',
              letterSpacing: '-2px',
            }}
            animate={{ opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            TanyaTV
          </motion.div>
        </div>
        <motion.p
          className="text-center text-[#b3b3b3] text-sm tracking-widest mt-2 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Every Love Story Deserves Its Own Streaming Service
        </motion.p>
      </motion.div>

      {/* Loading bar */}
      <div className="w-64 md:w-96">
        <div className="h-1 bg-[#333] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#E50914] rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>
      </div>

      {/* Quote */}
      <AnimatePresence mode="wait">
        <motion.p
          key={quote}
          className="mt-6 text-[#808080] text-sm"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.3 }}
        >
          {quote}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}
