'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Music } from 'lucide-react';

export default function BackgroundMusic() {
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const [volume, setVolume] = useState(0.3);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const toggleMusic = () => setPlaying(p => !p);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <motion.button
            onClick={toggleMusic}
            className="glassmorphism rounded-full p-3 text-white hover:bg-white/10 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={playing ? 'Mute background music' : 'Play background music'}
          >
            {playing ? (
              <div className="flex items-center gap-1">
                <Music size={16} className="text-[#E50914]" />
                {[1, 2, 3, 4].map(i => (
                  <motion.div
                    key={i}
                    className="w-0.5 bg-[#E50914] rounded-full"
                    animate={{ height: [4, 12, 4] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
                  />
                ))}
              </div>
            ) : (
              <VolumeX size={16} className="text-[#808080]" />
            )}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
