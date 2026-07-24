'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, ThumbsUp, ChevronDown, Heart } from 'lucide-react';
import { Movie } from '@/lib/data';
import { useThumbnails } from '@/lib/useMediaAssets';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
  index: number;
}

export default function MovieCard({ movie, onSelect, index }: MovieCardProps) {
  const { thumbnails } = useThumbnails();
  const thumbnail = thumbnails[movie.id] || movie.image;
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(() => {
    if (typeof window === 'undefined') return false;
    const list = JSON.parse(localStorage.getItem('memflix-mylist') || '[]');
    return list.includes(movie.id);
  });

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const list = JSON.parse(localStorage.getItem('memflix-mylist') || '[]');
    let newList;
    if (liked) {
      newList = list.filter((id: string) => id !== movie.id);
    } else {
      newList = [...list, movie.id];
    }
    localStorage.setItem('memflix-mylist', JSON.stringify(newList));
    setLiked(!liked);
  };

  return (
    <motion.div
      className="relative flex-shrink-0 w-36 md:w-44 lg:w-52 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card */}
      <motion.div
        className="relative overflow-hidden rounded-md"
        animate={{
          scale: hovered ? 1.08 : 1,
          zIndex: hovered ? 20 : 1,
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        {/* Thumbnail */}
        <div className="aspect-[16/9] bg-[#2a2a2a] overflow-hidden">
          <img
            src={thumbnail || "/placeholder.svg"}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300"
            style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          {movie.emoji && (
            <div className="absolute top-2 right-2 text-lg opacity-80">{movie.emoji}</div>
          )}
        </div>

        {/* Hover panel */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-[#181818] rounded-b-md p-3 shadow-2xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Action buttons */}
              <div className="flex items-center gap-2 mb-2">
                <motion.button
                  onClick={() => onSelect(movie)}
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-white/90 transition-colors flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Play size={14} fill="black" className="text-black ml-0.5" />
                </motion.button>

                <motion.button
                  onClick={toggleLike}
                  className={`w-8 h-8 border-2 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
                    liked ? 'border-[#E50914] bg-[#E50914]/20' : 'border-white/60 hover:border-white'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart size={14} className={liked ? 'text-[#E50914] fill-[#E50914]' : 'text-white'} />
                </motion.button>

                <motion.button
                  onClick={() => onSelect(movie)}
                  className="w-8 h-8 border-2 border-white/60 rounded-full flex items-center justify-center hover:border-white transition-colors ml-auto flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronDown size={14} className="text-white" />
                </motion.button>
              </div>

              {/* Title */}
              <p className="text-white text-xs font-semibold truncate">{movie.title}</p>

              {/* Meta */}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-green-400 text-xs font-semibold">10/10</span>
                <span className="text-[#808080] text-[10px]">{movie.year}</span>
                <span className="text-[#808080] text-[10px]">{movie.duration}</span>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-1 mt-1">
                {movie.genre.slice(0, 2).map(g => (
                  <span key={g} className="text-[#b3b3b3] text-[10px]">
                    {g}{movie.genre.indexOf(g) < Math.min(movie.genre.length, 2) - 1 ? ' •' : ''}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Title below card (when not hovered) */}
      {!hovered && (
        <p className="text-[#808080] text-xs mt-2 truncate px-0.5 hover:text-white transition-colors">{movie.title}</p>
      )}
    </motion.div>
  );
}
