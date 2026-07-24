'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Volume2, VolumeX, Maximize, SkipForward, RotateCcw } from 'lucide-react';
import { Movie } from '@/lib/data';
import { useVideoAssets } from '@/lib/useVideoAssets';

interface VideoPlayerProps {
  movie: Movie | null;
  onClose: () => void;
}

const CREDITS = [
  { role: 'The Most Beautiful Girl', name: 'Her' },
  { role: 'The Luckiest Boy', name: 'Me' },
  { role: 'Director', name: 'Destiny' },
  { role: 'Music', name: 'Our Playlist' },
  { role: 'Story', name: 'Us' },
  { role: 'Special Thanks', name: 'The Universe' },
  { role: 'Produced by', name: 'Love' },
  { role: 'Executive Producer', name: 'Every Moment Together' },
];

function formatSeconds(secs: number) {
  if (!isFinite(secs) || secs < 0) secs = 0;
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = Math.floor(secs % 60);
  const mm = h > 0 ? m.toString().padStart(2, '0') : m.toString();
  const ss = s.toString().padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export default function VideoPlayer({ movie, onClose }: VideoPlayerProps) {
  const { assets } = useVideoAssets();
  const realVideoUrl = movie ? assets[movie.id] || movie.videoUrl : undefined;

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimer = useRef<ReturnType<typeof setTimeout>>();

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0); // percentage 0-100
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showCredits, setShowCredits] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [videoError, setVideoError] = useState(false);

  // Reset state whenever a new movie opens
  useEffect(() => {
    if (!movie) return;
    setPlaying(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    setShowCredits(false);
    setShowIntro(true);
    setVideoError(false);

    const introTimer = setTimeout(() => {
      setShowIntro(false);
      setPlaying(true);
      if (videoRef.current) {
        videoRef.current.play().catch(() => setPlaying(false));
      }
    }, 2500);

    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(introTimer);
      document.body.style.overflow = '';
    };
  }, [movie]);

  // Simulated progress (only when there is NO real video)
  useEffect(() => {
    if (realVideoUrl || videoError) return;
    if (!playing) return;
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setShowCredits(true);
          setPlaying(false);
          return 100;
        }
        return p + 0.2;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [playing, realVideoUrl, videoError]);

  // Keep the real <video> element in sync with UI state
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = muted ? 0 : volume / 100;
    v.muted = muted;
  }, [volume, muted, realVideoUrl]);

  const hasRealVideo = Boolean(realVideoUrl) && !videoError;

  const togglePlay = () => {
    const v = videoRef.current;
    if (hasRealVideo && v) {
      if (v.paused) {
        v.play().catch(() => {});
        setPlaying(true);
      } else {
        v.pause();
        setPlaying(false);
      }
    } else {
      setPlaying(p => !p);
    }
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setCurrentTime(v.currentTime);
    setProgress((v.currentTime / v.duration) * 100);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    if (hasRealVideo && videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = pct * videoRef.current.duration;
      setProgress(pct * 100);
    } else {
      setProgress(pct * 100);
    }
  };

  const skipForward = () => {
    const v = videoRef.current;
    if (hasRealVideo && v && v.duration) {
      v.currentTime = Math.min(v.duration, v.currentTime + 10);
    } else {
      setProgress(p => Math.min(100, p + 10));
    }
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 3000);
  };

  const displayDuration = hasRealVideo ? duration : 90 * 60;
  const displayCurrent = hasRealVideo ? currentTime : (progress / 100) * displayDuration;

  return (
    <AnimatePresence>
      {movie && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseMove={handleMouseMove}
        >
          {/* TanyaTV intro */}
          <AnimatePresence>
            {showIntro && (
              <motion.div
                className="absolute inset-0 bg-black flex items-center justify-center z-20"
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                >
                  <span
                    className="text-6xl md:text-8xl font-black text-[#E50914]"
                    style={{
                      fontFamily: 'Georgia, serif',
                      textShadow: '0 0 60px rgba(229,9,20,1), 0 0 120px rgba(229,9,20,0.5)',
                    }}
                  >
                    TanyaTV
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Media layer */}
          <div className="absolute inset-0">
            {hasRealVideo ? (
              <video
                ref={videoRef}
                src={realVideoUrl}
                className="w-full h-full object-contain bg-black"
                playsInline
                onClick={togglePlay}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => {
                  setPlaying(false);
                  setShowCredits(true);
                }}
                onError={() => setVideoError(true)}
              />
            ) : (
              <>
                <img
                  src={movie.heroImage || movie.image}
                  alt={movie.title}
                  className="w-full h-full object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </>
            )}
          </div>

          {/* Credits overlay */}
          <AnimatePresence>
            {showCredits && (
              <motion.div
                className="absolute inset-0 bg-black/90 z-10 flex flex-col items-center justify-center overflow-y-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <div className="text-center py-20 space-y-2">
                  <motion.p
                    className="text-[#E50914] text-sm tracking-widest uppercase mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    A TanyaTV Original
                  </motion.p>
                  {CREDITS.map((credit, i) => (
                    <motion.div
                      key={credit.role}
                      className="mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + i * 0.3 }}
                    >
                      <p className="text-[#808080] text-sm tracking-wide">{credit.role}</p>
                      <p className="text-white text-lg font-semibold">{credit.name}</p>
                    </motion.div>
                  ))}
                  <motion.div
                    className="mt-12 flex flex-col items-center gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + CREDITS.length * 0.3 }}
                  >
                    <p className="text-2xl font-bold text-white mb-2">The Best Chapter Is Yet To Come ❤️</p>
                    {hasRealVideo && (
                      <button
                        onClick={() => {
                          setShowCredits(false);
                          if (videoRef.current) {
                            videoRef.current.currentTime = 0;
                            videoRef.current.play().catch(() => {});
                          }
                        }}
                        className="flex items-center gap-2 border border-white/60 text-white px-6 py-2.5 rounded hover:bg-white/10 transition-colors"
                      >
                        <RotateCcw size={16} /> Watch Again
                      </button>
                    )}
                    <button
                      onClick={onClose}
                      className="netflix-btn-red px-8 py-3 rounded"
                    >
                      Continue Watching
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <AnimatePresence>
            {showControls && !showIntro && !showCredits && (
              <motion.div
                className="absolute inset-0 z-10 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Top bar */}
                <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent pointer-events-auto">
                  <div>
                    <p className="text-[#808080] text-sm">Now Playing</p>
                    <h3 className="text-white font-semibold text-lg">{movie.title}</h3>
                  </div>
                  <motion.button
                    onClick={onClose}
                    className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={20} className="text-white" />
                  </motion.button>
                </div>

                {/* Center play button */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.button
                    onClick={togglePlay}
                    className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors pointer-events-auto"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {playing ? (
                      <Pause size={24} className="text-white" />
                    ) : (
                      <Play size={24} fill="white" className="text-white ml-1" />
                    )}
                  </motion.button>
                </div>

                {/* Bottom controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/90 to-transparent pointer-events-auto">
                  {/* Progress bar */}
                  <div className="mb-4 relative">
                    <div
                      className="h-1 bg-white/30 rounded-full cursor-pointer hover:h-1.5 transition-all"
                      onClick={handleSeek}
                    >
                      <div
                        className="h-full bg-[#E50914] rounded-full relative progress-bar"
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full -translate-x-1/2 shadow-lg" />
                      </div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[#808080] text-xs">{formatSeconds(displayCurrent)}</span>
                      <span className="text-[#808080] text-xs">{formatSeconds(displayDuration)}</span>
                    </div>
                  </div>

                  {/* Controls row */}
                  <div className="flex items-center gap-4">
                    <motion.button
                      onClick={togglePlay}
                      className="text-white hover:text-[#E50914] transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {playing ? <Pause size={22} /> : <Play size={22} fill="white" />}
                    </motion.button>

                    <motion.button
                      onClick={skipForward}
                      className="text-white hover:text-[#E50914] transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Skip 10s"
                    >
                      <SkipForward size={20} />
                    </motion.button>

                    {/* Volume */}
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => setMuted(m => !m)}
                        className="text-white hover:text-[#E50914] transition-colors"
                        whileHover={{ scale: 1.1 }}
                      >
                        {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </motion.button>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={muted ? 0 : volume}
                        onChange={e => { setVolume(Number(e.target.value)); setMuted(false); }}
                        className="w-20 accent-white hidden md:block"
                      />
                    </div>

                    <div className="ml-auto flex items-center gap-4">
                      <span className="text-[#b3b3b3] text-xs border border-[#808080] px-2 py-0.5 rounded">
                        {hasRealVideo ? 'HD' : 'Preview'}
                      </span>
                      <motion.button
                        onClick={toggleFullscreen}
                        className="text-white hover:text-[#E50914] transition-colors"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Maximize size={20} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Click to play/pause on poster (simulated mode only) */}
          {!hasRealVideo && !showIntro && !showCredits && (
            <div
              className="absolute inset-0 z-[5] cursor-pointer"
              onClick={togglePlay}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
