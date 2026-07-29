'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import { HERO_IMAGE } from '@/lib/data';

interface HeroBannerProps {
  onPlay: () => void;
  onInfo: () => void;
}

export default function HeroBanner({ onPlay, onInfo }: HeroBannerProps) {
  const [muted, setMuted] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full min-h-[560px] h-[80svh] md:h-[80vh] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMAGE}
          alt="Hero"
          className="w-full h-full object-cover"
          style={{ transform: 'scale(1.05)' }}
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-20 px-3 sm:px-4 md:px-16">
        {/* Badge */}
        <motion.div
          className="flex items-center gap-2 mb-4"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: loaded ? 1 : 0, x: loaded ? 0 : -30 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <span
            className="text-[#E50914] text-xs font-black tracking-widest uppercase"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            TanyaTV
          </span>
          <span className="w-1 h-1 bg-[#808080] rounded-full" />
          <span className="text-[#b3b3b3] text-xs tracking-widest uppercase">Original</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white mb-3 md:mb-4 leading-tight text-balance text-shadow-lg pr-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 30 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          Happy Girlfriend's Day
          <br />
          <span className="text-[#E50914]">My Love</span>{' '}
          <span className="animate-heartbeat inline-block">❤️</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-sm sm:text-base md:text-lg text-[#d2d2d2] mb-5 md:mb-6 max-w-xl text-pretty text-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Featuring the most beautiful girl I&apos;ve ever met.
        </motion.p>

        {/* Meta */}
        <motion.div
          className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-5 md:mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <span className="text-green-400 font-semibold text-xs sm:text-sm">100% Love Score</span>
          <span className="text-[#b3b3b3] text-xs sm:text-sm">2024</span>
          <span className="border border-[#808080] text-[#808080] text-xs px-1 rounded">∞</span>
          <span className="text-[#b3b3b3] text-xs sm:text-sm">Romance • Heartfelt • Epic</span>
        </motion.div>

        {/* Buttons */}
        <motion.div
          className="flex items-center gap-3 sm:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <motion.button
            onClick={onPlay}
            className="flex items-center gap-2 bg-white text-black px-5 sm:px-6 md:px-8 py-2.5 md:py-3 rounded font-bold text-sm md:text-base hover:bg-white/90 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Play size={18} fill="black" /> Play
          </motion.button>

          <motion.button
            onClick={onInfo}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-5 sm:px-6 md:px-8 py-2.5 md:py-3 rounded font-bold text-sm md:text-base hover:bg-white/30 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Info size={18} /> More Info
          </motion.button>

          {/* Mobile: keep the sound toggle in the flow so it can never sit on top of the buttons */}
          <motion.button
            className="md:hidden ml-auto w-10 h-10 shrink-0 border-2 border-white/60 rounded-full flex items-center justify-center"
            onClick={() => setMuted(m => !m)}
            whileTap={{ scale: 0.9 }}
            aria-label={muted ? 'Unmute preview' : 'Mute preview'}
          >
            {muted ? <VolumeX size={16} className="text-white" /> : <Volume2 size={16} className="text-white" />}
          </motion.button>
        </motion.div>
      </div>

      {/* Mute button (desktop / tablet only — mobile uses the inline one above) */}
      <motion.button
        className="hidden md:flex absolute bottom-20 right-16 w-10 h-10 border-2 border-white/60 rounded-full items-center justify-center hover:border-white transition-colors z-10"
        onClick={() => setMuted(m => !m)}
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {muted ? <VolumeX size={16} className="text-white" /> : <Volume2 size={16} className="text-white" />}
      </motion.button>

      {/* Maturity rating */}
      <motion.div
        className="hidden md:block absolute bottom-24 right-32 border-l-4 border-[#b3b3b3] pl-2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ delay: 1.1 }}
      >
        <span className="text-[#b3b3b3] text-xs">Rated ❤️</span>
      </motion.div>
    </div>
  );
}
