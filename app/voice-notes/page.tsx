'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import CursorEffect from '@/components/CursorEffect';
import { VOICE_NOTES } from '@/lib/data';
import { Play, Pause, Volume2 } from 'lucide-react';

function WaveAnimation({ playing }: { playing: boolean }) {
  const bars = 20;
  return (
    <div className="flex items-center gap-0.5 h-8">
      {[...Array(bars)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-current"
          animate={playing ? {
            height: [4, Math.random() * 20 + 8, 4],
          } : { height: 4 }}
          transition={playing ? {
            duration: 0.5 + Math.random() * 0.3,
            repeat: Infinity,
            delay: i * 0.05,
            ease: 'easeInOut',
          } : { duration: 0.3 }}
        />
      ))}
    </div>
  );
}

export default function VoiceNotesPage() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const timerRef = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  const togglePlay = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
      clearInterval(timerRef.current[id]);
    } else {
      if (playingId) clearInterval(timerRef.current[playingId]);
      setPlayingId(id);
      timerRef.current[id] = setInterval(() => {
        setProgress(p => {
          const current = p[id] || 0;
          if (current >= 100) {
            clearInterval(timerRef.current[id]);
            setPlayingId(null);
            return { ...p, [id]: 0 };
          }
          return { ...p, [id]: current + 1 };
        });
      }, 200);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414]">
      <CursorEffect />
      <Navbar />

      <div className="pt-24 pb-20 px-4 md:px-12 max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#E50914] text-xs font-semibold uppercase tracking-widest">Recorded With Love</span>
          <h1 className="text-4xl md:text-6xl font-black text-white mt-2 mb-4">Voice Notes</h1>
          <p className="text-[#808080] text-lg">When words didn&apos;t feel like enough — I used my voice instead.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {VOICE_NOTES.map((note, i) => {
            const isPlaying = playingId === note.id;
            const pct = progress[note.id] || 0;

            return (
              <motion.div
                key={note.id}
                className="rounded-2xl p-6 border border-white/5 bg-[#1a1a1a] hover:border-white/10 transition-colors"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: `${note.color}20`, border: `2px solid ${note.color}40` }}
                  >
                    {note.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-lg">{note.title}</h3>
                    <p className="text-[#808080] text-sm">{note.duration}</p>
                  </div>
                </div>

                <p className="text-[#b3b3b3] text-sm mb-5 leading-relaxed">{note.description}</p>

                {/* Wave animation */}
                <div
                  className="mb-4"
                  style={{ color: isPlaying ? note.color : '#555' }}
                >
                  <WaveAnimation playing={isPlaying} />
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-[#333] rounded-full mb-4 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: note.color }}
                    transition={{ ease: 'linear' }}
                  />
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={() => togglePlay(note.id)}
                    className="w-11 h-11 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: isPlaying ? note.color : `${note.color}20`,
                      border: `2px solid ${note.color}`,
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isPlaying ? (
                      <Pause size={16} className="text-white" />
                    ) : (
                      <Play size={16} className="ml-0.5" style={{ color: note.color }} />
                    )}
                  </motion.button>
                  <span className="text-[#808080] text-xs">{note.duration}</span>
                  <Volume2 size={14} className="text-[#555] ml-auto" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom note */}
        <motion.div
          className="text-center mt-12 p-6 rounded-2xl border border-white/5 bg-[#1a1a1a]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-[#808080] text-sm">
            These voice notes were recorded because some feelings are too big for text. 
            I wanted you to hear my voice say the things my heart can&apos;t stop thinking. ❤️
          </p>
        </motion.div>
      </div>
    </div>
  );
}
