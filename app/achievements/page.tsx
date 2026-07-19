'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import CursorEffect from '@/components/CursorEffect';
import { ACHIEVEMENTS } from '@/lib/data';
import { ALL_MOVIES } from '@/lib/data';
import MovieDetail from '@/components/MovieDetail';
import VideoPlayer from '@/components/VideoPlayer';
import type { Movie } from '@/lib/data';

const RARITY_COLORS: Record<string, string> = {
  'Legendary': '#FFD700',
  'Epic': '#9B59B6',
  'Rare': '#007AFF',
  'Common': '#808080',
};

export default function AchievementsPage() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);
  const [unlocked, setUnlocked] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    return JSON.parse(localStorage.getItem('memflix-achievements') || '[]');
  });
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleAchievementClick = (achievement: typeof ACHIEVEMENTS[0]) => {
    if (!unlocked.includes(achievement.id)) {
      const newUnlocked = [...unlocked, achievement.id];
      setUnlocked(newUnlocked);
      if (typeof window !== 'undefined') {
        localStorage.setItem('memflix-achievements', JSON.stringify(newUnlocked));
      }
    }
    const movie = ALL_MOVIES.find(m => m.id === achievement.movieId);
    if (movie) setSelectedMovie(movie);
  };

  return (
    <div className="min-h-screen bg-[#141414]">
      <CursorEffect />
      <Navbar />

      <div className="pt-24 pb-20 px-4 md:px-12 max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#E50914] text-xs font-semibold uppercase tracking-widest">Unlocked by Being You</span>
          <h1 className="text-4xl md:text-6xl font-black text-white mt-2 mb-4">Achievements</h1>
          <p className="text-[#808080] text-lg">All unlocked. All earned. All real.</p>
          <div className="mt-4 text-[#808080] text-sm">
            {unlocked.length} / {ACHIEVEMENTS.length} clicked
          </div>
        </motion.div>

        {/* Achievements grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ACHIEVEMENTS.map((achievement, i) => {
            const isUnlocked = unlocked.includes(achievement.id);
            const rarityColor = RARITY_COLORS[achievement.rarity];

            return (
              <motion.div
                key={achievement.id}
                className="relative rounded-2xl p-6 border cursor-pointer overflow-hidden"
                style={{
                  background: isUnlocked ? `${rarityColor}10` : '#1a1a1a',
                  borderColor: isUnlocked ? `${rarityColor}40` : 'rgba(255,255,255,0.05)',
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02, y: -2 }}
                onMouseEnter={() => setHoveredId(achievement.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleAchievementClick(achievement)}
              >
                {/* Glow effect on hover */}
                {hoveredId === achievement.id && (
                  <motion.div
                    className="absolute inset-0 opacity-10"
                    style={{ background: rarityColor }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.1 }}
                  />
                )}

                <div className="flex items-start gap-5 relative z-10">
                  {/* Trophy icon */}
                  <motion.div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ background: `${rarityColor}20` }}
                    animate={isUnlocked ? { rotate: [0, -5, 5, 0] } : {}}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    {achievement.icon}
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-white font-bold text-lg">{achievement.title}</h3>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ color: rarityColor, background: `${rarityColor}20` }}
                      >
                        {achievement.rarity}
                      </span>
                    </div>
                    <p className="text-[#808080] text-sm leading-relaxed">{achievement.description}</p>

                    <div className="flex items-center gap-2 mt-3">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="text-green-400 text-xs font-semibold">ACHIEVED</span>
                      <span className="text-[#555] text-xs ml-auto">Click to see memory ›</span>
                    </div>
                  </div>
                </div>

                {/* Animated border on unlock */}
                {isUnlocked && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ border: `1px solid ${rarityColor}` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* All achievements unlocked message */}
        {unlocked.length === ACHIEVEMENTS.length && (
          <motion.div
            className="text-center mt-12 p-8 rounded-2xl bg-gradient-to-br from-yellow-950/20 to-transparent border border-yellow-500/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-white text-2xl font-bold mb-2">100% Achievement Hunter!</h3>
            <p className="text-[#b3b3b3]">You&apos;ve clicked every achievement. All of them are real. All of them are you. ❤️</p>
          </motion.div>
        )}
      </div>

      <MovieDetail movie={selectedMovie} onClose={() => setSelectedMovie(null)} onPlay={m => { setSelectedMovie(null); setPlayingMovie(m); }} />
      <VideoPlayer movie={playingMovie} onClose={() => setPlayingMovie(null)} />
    </div>
  );
}
