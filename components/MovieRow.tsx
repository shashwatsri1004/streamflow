'use client';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Row, Movie } from '@/lib/data';
import MovieCard from './MovieCard';

interface MovieRowProps {
  row: Row;
  onMovieSelect: (movie: Movie) => void;
}

export default function MovieRow({ row, onMovieSelect }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 20);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 20);
  };

  return (
    <motion.div
      className="mb-8 group/row"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
    >
      {/* Row title */}
      <div className="px-4 md:px-12 mb-3 flex items-center gap-3">
        <h2 className="text-white text-lg md:text-xl font-semibold hover:text-[#E50914] transition-colors cursor-default">
          {row.emoji && <span className="mr-2">{row.emoji}</span>}
          {row.title}
        </h2>
        <motion.span
          className="text-[#E50914] text-sm font-medium hidden group-hover/row:inline-flex items-center gap-1"
          initial={{ opacity: 0, x: -5 }}
          whileInView={{ opacity: 1, x: 0 }}
        >
          Explore All <ChevronRight size={14} />
        </motion.span>
      </div>

      {/* Scrollable row */}
      <div className="relative">
        {/* Left chevron */}
        {canScrollLeft && (
          <motion.button
            className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-r from-black/80 to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
            onClick={() => scroll('left')}
            initial={{ opacity: 0 }}
            whileHover={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          >
            <ChevronLeft size={28} className="text-white drop-shadow-lg" />
          </motion.button>
        )}

        {/* Right chevron */}
        {canScrollRight && (
          <motion.button
            className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-l from-black/80 to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
            onClick={() => scroll('right')}
          >
            <ChevronRight size={28} className="text-white drop-shadow-lg" />
          </motion.button>
        )}

        {/* Cards container */}
        <div
          ref={scrollRef}
          className="row-container flex gap-2 px-4 md:px-12"
          onScroll={handleScroll}
        >
          {row.movies.map((movie, i) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelect={onMovieSelect}
              index={i}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
