'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import CursorEffect from '@/components/CursorEffect';
import { LOVE_STATS } from '@/lib/data';
import { Heart, MessageCircle, Camera, Film, Laugh, Trophy, Infinity } from 'lucide-react';

function AnimatedCounter({ target, duration = 2, suffix = '', prefix = '' }: { target: number; duration?: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(interval); }
      else setCount(Math.floor(current));
    }, (duration * 1000) / steps);
    return () => clearInterval(interval);
  }, [started, target, duration]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-black text-white">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
}

const stats = [
  { key: 'daysTogether', label: 'Days Together', icon: Heart, value: LOVE_STATS.daysTogether, suffix: '+', color: '#E50914', gradient: 'from-red-900/40 to-red-800/20' },
  { key: 'hoursTalking', label: 'Hours Talking', icon: MessageCircle, value: LOVE_STATS.hoursTalking, suffix: '+', color: '#007AFF', gradient: 'from-blue-900/40 to-blue-800/20' },
  { key: 'photosTaken', label: 'Photos Taken', icon: Camera, value: LOVE_STATS.photosTaken, suffix: '+', color: '#FF9500', gradient: 'from-orange-900/40 to-orange-800/20' },
  { key: 'videosEdited', label: 'Videos Edited', icon: Film, value: LOVE_STATS.videosEdited, suffix: '', color: '#9B59B6', gradient: 'from-purple-900/40 to-purple-800/20' },
  { key: 'laughsShared', label: 'Laughs Shared', icon: Laugh, value: LOVE_STATS.laughsShared, suffix: '+', color: '#34C759', gradient: 'from-green-900/40 to-green-800/20' },
  { key: 'argumentsWon', label: 'Arguments Won by Me 😂', icon: Trophy, value: LOVE_STATS.argumentsWon, suffix: ' (approximately)', color: '#FF3B30', gradient: 'from-red-900/30 to-transparent' },
];

export default function LoveStatsPage() {
  const [meterStarted, setMeterStarted] = useState(false);

  return (
    <div className="min-h-screen bg-[#141414]">
      <CursorEffect />
      <Navbar />

      <div className="pt-24 pb-20 px-4 md:px-12 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#E50914] text-xs font-semibold uppercase tracking-widest">TanyaTV Analytics</span>
          <h1 className="text-4xl md:text-6xl font-black text-white mt-2 mb-4">Love Stats</h1>
          <p className="text-[#808080] text-lg">Because love deserves to be measured — even when no number is big enough.</p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.key}
              className={`relative rounded-2xl p-6 border border-white/5 bg-gradient-to-br ${stat.gradient} overflow-hidden`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02, borderColor: `${stat.color}40` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `${stat.color}20` }}
                >
                  <stat.icon size={22} style={{ color: stat.color }} />
                </div>
                <span className="text-xs text-[#808080] uppercase tracking-widest">Live</span>
              </div>

              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              <p className="text-[#808080] text-sm mt-2">{stat.label}</p>

              {/* Decorative glow */}
              <div
                className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full opacity-10 blur-xl"
                style={{ background: stat.color }}
              />
            </motion.div>
          ))}
        </div>

        {/* Love Percentage */}
        <motion.div
          className="rounded-2xl p-8 md:p-12 border border-[#E50914]/20 bg-gradient-to-br from-red-950/30 to-transparent text-center mb-16"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[#808080] text-sm uppercase tracking-widest mb-4">Overall Love Percentage</p>
          <motion.div
            className="text-5xl md:text-8xl font-black text-[#E50914] mb-4"
            style={{ textShadow: '0 0 40px rgba(229,9,20,0.4)' }}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            {LOVE_STATS.lovePercentage}
          </motion.div>
          <p className="text-[#b3b3b3] text-lg">And growing every single second. ❤️</p>
        </motion.div>

        {/* Watch Party section */}
        <motion.div
          className="rounded-2xl p-6 md:p-8 border border-white/10 glassmorphism mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm font-semibold">WATCH PARTY — LIVE</span>
          </div>
          <h3 className="text-white text-2xl font-bold mb-1">Watching Together ❤️</h3>
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#E50914]">
                <img src="https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=80" alt="Her" className="w-full h-full object-cover" />
              </div>
              <span className="text-white font-medium">My Love ❤️</span>
            </div>
            <div className="text-[#E50914] text-xl font-bold">+</div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E50914] flex items-center justify-center text-white font-bold">M</div>
              <span className="text-white font-medium">Me</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <span className="text-[#808080] text-sm">Distance: </span>
            <span className="text-white font-semibold">Doesn&apos;t Matter 💫</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
