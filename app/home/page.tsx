'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import HeroBanner from '@/components/HeroBanner';
import MovieRow from '@/components/MovieRow';
import MovieDetail from '@/components/MovieDetail';
import VideoPlayer from '@/components/VideoPlayer';
import CursorEffect from '@/components/CursorEffect';
import BackgroundMusic from '@/components/BackgroundMusic';
import { MOVIE_ROWS, ALL_MOVIES, Movie } from '@/lib/data';

export default function HomePage() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);
  const [konamiCode, setKonamiCode] = useState<string[]>([]);
  const [showBlooper, setShowBlooper] = useState(false);
  const [birthdayFireworks, setBirthdayFireworks] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [showDevMessage, setShowDevMessage] = useState(false);

  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    setKonamiCode(prev => {
      const next = [...prev, e.key].slice(-10);
      if (JSON.stringify(next) === JSON.stringify(KONAMI)) {
        setShowBlooper(true);
        setTimeout(() => setShowBlooper(false), 5000);
        return [];
      }

      // Type "Happy Birthday"
      const typed = next.map(k => k.length === 1 ? k : '').join('').toLowerCase();
      if (typed.includes('happybirthday')) {
        setBirthdayFireworks(true);
        setTimeout(() => setBirthdayFireworks(false), 4000);
        return [];
      }
      return next;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const heroMovie = ALL_MOVIES.find(m => m.id === 'birthday-surprise')!;

  const handlePlay = (movie: Movie) => {
    setSelectedMovie(null);
    setPlayingMovie(movie);
    if (movie.id) {
      const progress = JSON.parse(localStorage.getItem('memflix-progress') || '{}');
      progress[movie.id] = { progress: 0, timestamp: Date.now() };
      localStorage.setItem('memflix-progress', JSON.stringify(progress));
    }
  };

  return (
    <div className="min-h-screen bg-[#141414]">
      <CursorEffect />
      <Navbar />

      {/* Hero */}
      <HeroBanner
        onPlay={() => handlePlay(heroMovie)}
        onInfo={() => setSelectedMovie(heroMovie)}
      />

      {/* Content rows */}
      <div className="relative z-10 -mt-8 pb-20">
        {MOVIE_ROWS.map(row => (
          <MovieRow
            key={row.id}
            row={row}
            onMovieSelect={movie => setSelectedMovie(movie)}
          />
        ))}

        {/* Bottom section */}
        <motion.div
          className="px-4 md:px-12 mt-12 pb-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-[#808080] text-sm">
            Made with ❤️ exclusively for you. No subscription required. Free forever.
          </p>
          <p className="text-[#555] text-xs mt-2">TanyaTV © {new Date().getFullYear()} — Our Love Story Deserves Its Own Streaming Service</p>
        </motion.div>
      </div>

      {/* Movie detail modal */}
      <MovieDetail
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
        onPlay={handlePlay}
      />

      {/* Video player */}
      <VideoPlayer
        movie={playingMovie}
        onClose={() => setPlayingMovie(null)}
      />

      {/* Background music */}
      <BackgroundMusic />

      {/* Konami code easter egg */}
      <AnimatePresence>
        {showBlooper && (
          <motion.div
            className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowBlooper(false)}
          >
            <motion.div
              className="text-center max-w-lg"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="text-7xl mb-6">🎬</div>
              <h2 className="text-3xl font-bold text-white mb-3">Konami Code Unlocked!</h2>
              <p className="text-[#E50914] text-xl font-semibold mb-4">BLOOPER REEL UNLOCKED 🎭</p>
              <p className="text-[#b3b3b3] mb-6">You found the secret Blooper Folder! Every embarrassing moment, every plan that went wrong — now fully available for your viewing pleasure. 😂</p>
              <img
                src="https://images.pexels.com/photos/2253879/pexels-photo-2253879.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Bloopers"
                className="w-64 h-40 object-cover rounded-xl mx-auto mb-4 opacity-60"
              />
              <p className="text-[#808080] text-sm">Click anywhere to close</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Birthday fireworks */}
      <AnimatePresence>
        {birthdayFireworks && (
          <motion.div
            className="fixed inset-0 z-[200] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                style={{
                  left: `${10 + Math.random() * 80}%`,
                  top: `${10 + Math.random() * 80}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], y: [-20, -60] }}
                transition={{ duration: 1.5, delay: Math.random() * 2, repeat: 2 }}
              >
                {['🎉', '🎊', '✨', '💥', '🌟', '❤️', '🎂'][Math.floor(Math.random() * 7)]}
              </motion.div>
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.p
                className="text-4xl md:text-6xl font-black text-white text-center"
                style={{ textShadow: '0 0 30px rgba(255,255,255,0.8)' }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', delay: 0.3 }}
              >
                HAPPY BIRTHDAY! 🎂
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
