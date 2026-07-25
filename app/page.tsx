'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingScreen from '@/components/LoadingScreen';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [doubleClickUnlock, setDoubleClickUnlock] = useState(false);

  const handleProfileClick = () => {
    if (selecting) return;
    setSelecting(true);
    setClicked(true);
    setTimeout(() => {
      router.push('/home');
    }, 1200);
  };

  const handleDoubleClick = () => {
    setDoubleClickUnlock(true);
    setTimeout(() => setDoubleClickUnlock(false), 3000);
  };

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <LoadingScreen key="loading" onComplete={() => setLoading(false)} />
      ) : (
        <motion.div
          key="profile"
          className="min-h-screen bg-[#141414] flex flex-col items-center justify-center relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Background subtle gradient */}
          <div className="absolute inset-0 bg-gradient-radial from-[#1a0a0a] via-[#141414] to-black" />

          {/* Floating particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: i % 3 === 0 ? '#E50914' : '#ffffff',
                left: `${10 + i * 6}%`,
                top: `${15 + (i % 5) * 15}%`,
                opacity: 0.2,
              }}
              animate={{ y: [0, -20, 0], opacity: [0.1, 0.4, 0.1] }}
              transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}

          <div className="relative z-10 text-center">
            {/* TanyaTV logo */}
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              <span
                className="text-5xl md:text-7xl font-black text-[#E50914] tracking-tight"
                style={{
                  fontFamily: 'Georgia, serif',
                  textShadow: '0 0 30px rgba(229,9,20,0.6)',
                }}
              >
                TanyaTV
              </span>
            </motion.div>

            {/* Who's Watching */}
            <motion.h1
              className="text-3xl md:text-4xl font-light text-white mb-12 tracking-wide"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Who&apos;s Watching?
            </motion.h1>

            {/* Profile card */}
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <motion.button
                onClick={handleProfileClick}
                onDoubleClick={handleDoubleClick}
                className="profile-card group flex flex-col items-center gap-3 p-2 rounded"
                whileHover={{ scale: selecting ? 1 : 1.08 }}
                whileTap={{ scale: 0.97 }}
                disabled={selecting}
              >
                {/* Avatar */}
                <div className={`relative w-28 h-28 md:w-36 md:h-36 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  clicked ? 'border-white scale-95' : 'border-transparent group-hover:border-white'
                }`}>
                  <img
                    src="https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=300"
                    alt="Your profile"
                    className="w-full h-full object-cover"
                  />
                  {clicked && (
                    <motion.div
                      className="absolute inset-0 bg-white/20 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        className="w-8 h-8 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      />
                    </motion.div>
                  )}
                </div>

                {/* Name */}
                <span className={`text-base profile-name transition-colors duration-200 ${
                  clicked ? 'text-white' : 'text-[#808080] group-hover:text-white'
                }`}>
                  My Love ❤️
                </span>
              </motion.button>
            </motion.div>

            {/* Tagline */}
            <motion.p
              className="mt-16 text-[#808080] text-sm tracking-widest italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              &quot;Our Love Story Deserves Its Own Streaming Service.&quot;
            </motion.p>
          </div>

          {/* Double click hidden selfie easter egg */}
          <AnimatePresence>
            {doubleClickUnlock && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDoubleClickUnlock(false)}
              >
                <motion.div
                  className="text-center"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="w-48 h-48 rounded-full overflow-hidden mx-auto mb-4 border-4 border-[#E50914]" style={{ boxShadow: '0 0 30px rgba(229,9,20,0.6)' }}>
                    <img
                      src="https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=400"
                      alt="Hidden selfie"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-white text-xl font-semibold">Found the hidden selfie! 😍</p>
                  <p className="text-[#b3b3b3] text-sm mt-2">You unlocked: Double Click Easter Egg ✨</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Selecting overlay */}
          <AnimatePresence>
            {selecting && (
              <motion.div
                className="fixed inset-0 bg-black z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
