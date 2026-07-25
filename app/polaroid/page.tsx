'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import CursorEffect from '@/components/CursorEffect';
import { usePhotos } from '@/lib/useMediaAssets';

const POLAROIDS = [
  { id: 1, src: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400', caption: 'First Date ❤️', rotate: -3, x: 0, y: 0 },
  { id: 2, src: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=400', caption: 'Goa 2023 🏖️', rotate: 2, x: 40, y: 20 },
  { id: 3, src: 'https://images.pexels.com/photos/1415131/pexels-photo-1415131.jpeg?auto=compress&cs=tinysrgb&w=400', caption: 'Us always 💕', rotate: -1.5, x: -20, y: 10 },
  { id: 4, src: 'https://images.pexels.com/photos/1024975/pexels-photo-1024975.jpeg?auto=compress&cs=tinysrgb&w=400', caption: 'My favorite 📸', rotate: 3.5, x: 10, y: -5 },
  { id: 5, src: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=400', caption: 'Late nights 🌙', rotate: -2, x: -30, y: 15 },
  { id: 6, src: 'https://images.pexels.com/photos/346804/pexels-photo-346804.jpeg?auto=compress&cs=tinysrgb&w=400', caption: 'Sunshine ☀️', rotate: 1.5, x: 25, y: -10 },
  { id: 7, src: 'https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg?auto=compress&cs=tinysrgb&w=400', caption: 'Forever 🥰', rotate: -4, x: 5, y: 5 },
  { id: 8, src: 'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=400', caption: 'Adventure 🌍', rotate: 2.5, x: -15, y: -8 },
];

// Deterministic "scattered" offsets so uploaded polaroids look hand-pinned.
const ROTATIONS = [-3, 2, -1.5, 3.5, -2, 1.5, -4, 2.5];
const OFFSETS = [
  { x: 0, y: 0 }, { x: 40, y: 20 }, { x: -20, y: 10 }, { x: 10, y: -5 },
  { x: -30, y: 15 }, { x: 25, y: -10 }, { x: 5, y: 5 }, { x: -15, y: -8 },
];

interface PolaroidItem {
  key: string;
  src: string;
  caption: string;
  rotate: number;
  x: number;
  y: number;
}

export default function PolaroidPage() {
  const { photos } = usePhotos('polaroid');
  const [expanded, setExpanded] = useState<string | null>(null);
  // The hand-pinned scatter offsets push photos off a phone screen, so drop them there.
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setCompact(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Uploaded polaroids first; fall back to the built-in set when there are none yet.
  const uploaded: PolaroidItem[] = photos.map((p, i) => ({
    key: `db-${p.id}`,
    src: p.url,
    caption: p.caption ?? '',
    rotate: ROTATIONS[i % ROTATIONS.length],
    x: OFFSETS[i % OFFSETS.length].x,
    y: OFFSETS[i % OFFSETS.length].y,
  }));
  const defaults: PolaroidItem[] = POLAROIDS.map(p => ({
    key: `default-${p.id}`,
    src: p.src,
    caption: p.caption,
    rotate: p.rotate,
    x: p.x,
    y: p.y,
  }));
  const items: PolaroidItem[] = uploaded.length > 0 ? uploaded : defaults;

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      <CursorEffect />
      <Navbar />

      {/* String lights decoration */}
      <div className="absolute top-20 left-0 right-0 h-8 pointer-events-none z-20">
        <svg width="100%" height="32" viewBox="0 0 1200 32" preserveAspectRatio="none">
          <path
            d="M 0 8 Q 150 28 300 8 Q 450 -12 600 8 Q 750 28 900 8 Q 1050 -12 1200 8"
            fill="none"
            stroke="#555"
            strokeWidth="1.5"
          />
          {[0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100].map(x => (
            <circle key={x} cx={x + 50} cy={8 + Math.sin((x / 200) * Math.PI) * 10} r="4" fill="#FFD60A" opacity="0.8" />
          ))}
        </svg>
      </div>

      <div className="pt-32 pb-20 px-4 md:px-12 max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#E50914] text-xs font-semibold uppercase tracking-widest">Hanging Memories</span>
          <h1 className="text-4xl md:text-6xl font-black text-white mt-2 mb-4">Polaroid Wall</h1>
          <p className="text-[#808080] text-lg">Hover over a photo to hold it. Click to zoom in. ❤️</p>
        </motion.div>

        {/* Polaroid grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
          {items.map((photo, i) => {
            const isExpanded = expanded === photo.key;
            return (
              <motion.div
                key={photo.key}
                className="cursor-pointer relative"
                initial={{ opacity: 0, scale: 0.8, rotate: photo.rotate }}
                whileInView={{ opacity: 1, scale: 1, rotate: photo.rotate }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, type: 'spring' }}
                whileHover={{ rotate: 0, scale: 1.1, zIndex: 30, y: -10 }}
                animate={isExpanded ? { scale: compact ? 1.7 : 2.5, rotate: 0, zIndex: 50 } : {}}
                onClick={() => setExpanded(isExpanded ? null : photo.key)}
                style={{ zIndex: isExpanded ? 50 : 'auto' }}
              >
                {/* Polaroid frame */}
                <div
                  className="polaroid shadow-2xl"
                  style={{
                    transform: compact
                      ? 'none'
                      : `translateX(${photo.x}px) translateY(${photo.y}px)`,
                  }}
                >
                  {/* Photo area */}
                  <div className="w-full aspect-square overflow-hidden bg-[#eee]">
                    <img
                      src={photo.src}
                      alt={photo.caption}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Caption */}
                  <div className="pt-2 pb-1 text-center">
                    <span
                      className="text-[#333] text-xs font-medium"
                      style={{ fontFamily: "'Caveat', cursive, sans-serif" }}
                    >
                      {photo.caption}
                    </span>
                  </div>
                </div>

                {/* String */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-[#888]" />
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#888] rounded-full" />
              </motion.div>
            );
          })}
        </div>

        {/* Overlay for expanded */}
        {expanded && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setExpanded(null)}
          />
        )}
      </div>
    </div>
  );
}
