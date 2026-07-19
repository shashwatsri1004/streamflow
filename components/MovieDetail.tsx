'use client';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Plus, ThumbsUp, Download, Share2, Heart, Star } from 'lucide-react';
import { Movie } from '@/lib/data';

interface MovieDetailProps {
  movie: Movie | null;
  onClose: () => void;
  onPlay: (movie: Movie) => void;
}

export default function MovieDetail({ movie, onClose, onPlay }: MovieDetailProps) {
  useEffect(() => {
    if (movie) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [movie]);

  return (
    <AnimatePresence>
      {movie && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/75 z-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative bg-[#181818] rounded-xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Hero image */}
              <div className="relative h-56 md:h-72 overflow-hidden">
                <img
                  src={movie.heroImage || movie.image}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/20 to-transparent" />

                {/* Close button */}
                <motion.button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-9 h-9 bg-[#181818] rounded-full flex items-center justify-center hover:bg-[#333] transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={18} className="text-white" />
                </motion.button>

                {/* Title overlay */}
                <div className="absolute bottom-4 left-6 right-6">
                  {movie.emoji && <span className="text-3xl mb-1 block">{movie.emoji}</span>}
                  <h2 className="text-2xl md:text-3xl font-bold text-white text-shadow-lg">{movie.title}</h2>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-8 pt-2">
                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <motion.button
                    onClick={() => onPlay(movie)}
                    className="netflix-btn-primary gap-2 px-6 py-2.5 text-sm font-bold rounded"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Play size={16} fill="black" /> Play
                  </motion.button>

                  <motion.button
                    className="w-10 h-10 border-2 border-white/60 rounded-full flex items-center justify-center hover:border-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Add to My List"
                  >
                    <Plus size={18} className="text-white" />
                  </motion.button>

                  <motion.button
                    className="w-10 h-10 border-2 border-white/60 rounded-full flex items-center justify-center hover:border-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Rate"
                  >
                    <Heart size={16} className="text-[#E50914] fill-[#E50914]" />
                  </motion.button>

                  <motion.button
                    className="w-10 h-10 border-2 border-white/60 rounded-full flex items-center justify-center hover:border-white transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Share"
                  >
                    <Share2 size={16} className="text-white" />
                  </motion.button>

                  <motion.button
                    className="w-10 h-10 border-2 border-white/60 rounded-full flex items-center justify-center hover:border-white transition-colors ml-auto"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Download (not available in this universe)"
                  >
                    <Download size={16} className="text-white" />
                  </motion.button>
                </div>

                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-green-400 font-semibold text-sm">{movie.rating}</span>
                  <span className="text-[#b3b3b3] text-sm">{movie.year}</span>
                  <span className="border border-[#808080] text-[#808080] text-xs px-1 rounded">{movie.duration}</span>
                  <span className="border border-[#808080] text-[#808080] text-xs px-1 rounded">HD</span>
                </div>

                {/* Description */}
                <p className="text-[#d2d2d2] text-sm leading-relaxed mb-5">{movie.description}</p>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-[#808080] text-xs">Genre:</span>
                  {movie.genre.map((g, i) => (
                    <span key={g} className="text-[#b3b3b3] text-xs">
                      {g}{i < movie.genre.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </div>

                {/* Cast section */}
                <div className="mt-5 pt-5 border-t border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-[#808080]">Cast: </span>
                      <span className="text-[#b3b3b3]">Her, Me, The Universe</span>
                    </div>
                    <div>
                      <span className="text-[#808080]">Director: </span>
                      <span className="text-[#b3b3b3]">Destiny</span>
                    </div>
                    <div>
                      <span className="text-[#808080]">Music: </span>
                      <span className="text-[#b3b3b3]">Our Playlist</span>
                    </div>
                    <div>
                      <span className="text-[#808080]">Story: </span>
                      <span className="text-[#b3b3b3]">Us</span>
                    </div>
                  </div>
                </div>

                {/* Ratings row */}
                <div className="mt-5 pt-5 border-t border-white/10 flex items-center gap-6">
                  <div className="text-center">
                    <div className="flex items-center gap-1 text-yellow-400">
                      {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                    </div>
                    <p className="text-[#808080] text-xs mt-1">Emotional Rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-green-400 font-bold text-lg">100%</p>
                    <p className="text-[#808080] text-xs">Love Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[#E50914] font-bold text-lg">∞</p>
                    <p className="text-[#808080] text-xs">Rewatchability</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
