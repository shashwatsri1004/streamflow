'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import CursorEffect from '@/components/CursorEffect';
import { SEARCH_RESULTS, ALL_MOVIES, Movie } from '@/lib/data';
import MovieDetail from '@/components/MovieDetail';
import VideoPlayer from '@/components/VideoPlayer';

const SECRET_CODES: Record<string, { type: string; title: string; message: string; emoji: string }> = {
  '143': { type: 'folder', title: 'Hidden Folder Unlocked 🔐', message: 'You found the secret "143" folder! These are the private memories — the ones too precious to share, kept just for us.', emoji: '💝' },
  'ily': { type: 'letter', title: 'Secret Love Letter 💌', message: 'I love you. Three words that will never be enough, but they\'re the truest thing I know. I love you yesterday, today, and every tomorrow.', emoji: '💌' },
  'forever': { type: 'video', title: 'Hidden Video Unlocked ✨', message: 'This is the video I made when I was thinking about forever. About us growing old. About how lucky I am. About how I never want it to end.', emoji: '♾️' },
  'missyou': { type: 'voice', title: 'Voice Note Unlocked 🎙️', message: '(Press play to hear) "Hey... I just really miss you right now and I wanted to record this so you know: no matter where you are or what time it is, I\'m always thinking about you."', emoji: '🎙️' },
  'cutie': { type: 'confetti', title: 'CONFETTI TIME! 🎊', message: 'You searched "cutie" and the system agreed 100000%. Deploying emergency confetti...', emoji: '🎊' },
};

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [secret, setSecret] = useState<typeof SECRET_CODES[string] | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const lower = query.toLowerCase().trim();
    if (SECRET_CODES[lower]) {
      const code = SECRET_CODES[lower];
      if (code.type === 'confetti') {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
      setSecret(code);
    } else {
      setSecret(null);
    }
  }, [query]);

  const lowerQuery = query.toLowerCase().trim();
  const customResults = SEARCH_RESULTS[lowerQuery];

  const movieResults = query.length > 1
    ? ALL_MOVIES.filter(m =>
        m.title.toLowerCase().includes(lowerQuery) ||
        m.description.toLowerCase().includes(lowerQuery) ||
        m.genre.some(g => g.toLowerCase().includes(lowerQuery))
      )
    : [];

  const popularSearches = ['love', 'beautiful', 'hug', 'happy', 'home', 'perfect', 'funny'];

  return (
    <div className="min-h-screen bg-[#141414]">
      <CursorEffect />
      <Navbar />

      <div className="pt-24 pb-20 px-4 md:px-12 max-w-4xl mx-auto">
        {/* Search input */}
        <motion.div
          className="relative mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#808080]" size={22} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search memories, moments, feelings..."
            className="w-full bg-[#2a2a2a] text-white text-lg pl-12 pr-10 py-4 rounded-lg border border-transparent focus:border-[#E50914] focus:outline-none transition-colors placeholder-[#808080]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#808080] hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </motion.div>

        {/* Secret code unlocked */}
        <AnimatePresence>
          {secret && (
            <motion.div
              className="mb-8 p-6 rounded-xl border border-[#E50914]/30 bg-[#E50914]/5"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{secret.emoji}</span>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={16} className="text-[#E50914]" />
                    <span className="text-[#E50914] text-xs font-semibold uppercase tracking-widest">Secret Unlocked</span>
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2">{secret.title}</h3>
                  <p className="text-[#b3b3b3] leading-relaxed">{secret.message}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No query — popular searches */}
        {!query && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-white font-semibold text-lg mb-4">Popular Searches</h3>
            <div className="flex flex-wrap gap-3 mb-10">
              {popularSearches.map(s => (
                <motion.button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-[#b3b3b3] hover:text-white px-4 py-2 rounded-full text-sm transition-colors capitalize"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {s}
                </motion.button>
              ))}
            </div>

            <h3 className="text-white font-semibold text-lg mb-3">Secret Codes</h3>
            <p className="text-[#808080] text-sm mb-4">Try typing these to unlock hidden memories...</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['143 ❤️', 'ily 💌', 'forever ♾️', 'missyou 🎙️', 'cutie 🎊'].map(hint => (
                <div key={hint} className="bg-[#1a1a1a] border border-white/5 rounded-lg p-3 text-center">
                  <span className="text-[#808080] text-sm font-mono">{hint}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Custom results for known queries */}
        {query && customResults && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-[#808080] text-sm mb-4 uppercase tracking-widest">Results for &quot;{query}&quot;</h3>
            <div className="space-y-4">
              {customResults.map((result, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-4 p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#2a2a2a] transition-colors cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 4 }}
                >
                  <span className="text-3xl">{result.emoji}</span>
                  <div>
                    <p className="text-white font-semibold">{result.title}</p>
                    <p className="text-[#808080] text-sm">{result.subtitle}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Movie results */}
        {query && movieResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-[#808080] text-sm mb-4 uppercase tracking-widest">
              {customResults ? 'Also Found' : `Results for "${query}"`}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {movieResults.map((movie, i) => (
                <motion.div
                  key={movie.id}
                  className="cursor-pointer group"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedMovie(movie)}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="aspect-[16/9] rounded-lg overflow-hidden mb-2">
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <p className="text-white text-sm font-medium truncate">{movie.title}</p>
                  <p className="text-[#808080] text-xs">{movie.year}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* No results */}
        {query && !customResults && movieResults.length === 0 && !secret && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-white text-2xl font-semibold mb-2">No results found</h3>
            <p className="text-[#808080]">Try searching for: love, hug, me, funny, home, happy, beautiful</p>
          </motion.div>
        )}
      </div>

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div className="fixed inset-0 z-[200] pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                  background: ['#E50914', '#FF9500', '#34C759', '#007AFF', '#FFD60A'][Math.floor(Math.random() * 5)],
                }}
                initial={{ y: -20, opacity: 1, rotate: 0, x: 0 }}
                animate={{ y: '110vh', opacity: [1, 1, 0], rotate: Math.random() * 720, x: (Math.random() - 0.5) * 200 }}
                transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 1 }}
              />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="text-center glassmorphism rounded-2xl p-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <p className="text-6xl mb-3">🥳</p>
                <p className="text-white text-2xl font-bold">YES, YOU ARE A CUTIE!</p>
                <p className="text-[#b3b3b3] mt-2">The system has confirmed it.</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MovieDetail movie={selectedMovie} onClose={() => setSelectedMovie(null)} onPlay={(m) => { setSelectedMovie(null); setPlayingMovie(m); }} />
      <VideoPlayer movie={playingMovie} onClose={() => setPlayingMovie(null)} />
    </div>
  );
}
