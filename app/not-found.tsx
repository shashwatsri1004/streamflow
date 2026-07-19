'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="text-8xl mb-8"
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        >
          😕
        </motion.div>

        <p className="text-[#E50914] text-sm font-semibold uppercase tracking-widest mb-3">Error 404</p>
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4">Oops.</h1>
        <p className="text-[#808080] text-xl mb-2">This memory doesn&apos;t exist.</p>
        <p className="text-[#555] text-sm mb-10">
          Unlike our love, which is very much real and very much infinite.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Link href="/home">
            <motion.button
              className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded font-bold hover:bg-white/90 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home size={18} /> Take Me Home ❤️
            </motion.button>
          </Link>
          <Link href="/">
            <motion.button
              className="flex items-center gap-2 bg-white/10 text-white px-8 py-3 rounded font-bold hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Switch Profile
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Floating elements */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-[#E50914] opacity-10 text-3xl pointer-events-none"
          style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 25}%` }}
          animate={{ y: [0, -15, 0], opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          ❤️
        </motion.div>
      ))}
    </div>
  );
}
