'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, Volume2, VolumeX, Maximize, Minimize, SkipForward, RotateCcw } from 'lucide-react';
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
  const controlsTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  // Set when the browser won't let us rotate the device: we tilt the player ourselves.
  const [forceLandscape, setForceLandscape] = useState(false);

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
    setShowControls(true);

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

  const unlockOrientation = useCallback(() => {
    const orientation = window.screen?.orientation as (ScreenOrientation & { unlock?: () => void }) | undefined;
    try {
      orientation?.unlock?.();
    } catch {
      /* not supported — nothing to undo */
    }
  }, []);

  // Track native fullscreen changes (including the user pressing Esc / back)
  useEffect(() => {
    const handleChange = () => {
      const active = Boolean(document.fullscreenElement || (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement);
      setIsFullscreen(active);
      if (!active) {
        setForceLandscape(false);
        unlockOrientation();
      }
    };
    document.addEventListener('fullscreenchange', handleChange);
    document.addEventListener('webkitfullscreenchange', handleChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleChange);
      document.removeEventListener('webkitfullscreenchange', handleChange);
    };
  }, [unlockOrientation]);

  // If the phone is physically rotated to landscape, drop our manual tilt.
  useEffect(() => {
    if (!forceLandscape) return;
    const handleResize = () => {
      if (window.innerWidth > window.innerHeight) setForceLandscape(false);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [forceLandscape]);

  // Leave fullscreen when the player unmounts
  useEffect(() => {
    if (movie) return;
    if (document.fullscreenElement) document.exitFullscreen?.();
    setForceLandscape(false);
    unlockOrientation();
  }, [movie, unlockOrientation]);

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

  // Works for mouse AND touch, and stays correct while the player is tilted.
  const seekFromPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = forceLandscape
      ? Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height))
      : Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    if (hasRealVideo && videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = pct * videoRef.current.duration;
    }
    setProgress(pct * 100);
  };

  const skipForward = () => {
    const v = videoRef.current;
    if (hasRealVideo && v && v.duration) {
      v.currentTime = Math.min(v.duration, v.currentTime + 10);
    } else {
      setProgress(p => Math.min(100, p + 10));
    }
  };

  const toggleFullscreen = async () => {
    const el = containerRef.current;
    const video = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (!el) return;

    // Exit
    if (document.fullscreenElement || forceLandscape) {
      if (document.fullscreenElement) {
        await document.exitFullscreen?.();
      }
      setForceLandscape(false);
      unlockOrientation();
      return;
    }

    // Enter native fullscreen where possible
    try {
      const withWebkit = el as HTMLDivElement & { webkitRequestFullscreen?: () => void };
      if (el.requestFullscreen) {
        await el.requestFullscreen({ navigationUI: 'hide' });
      } else if (withWebkit.webkitRequestFullscreen) {
        withWebkit.webkitRequestFullscreen();
      } else if (video?.webkitEnterFullscreen) {
        // iOS Safari on iPhone: only the <video> can go fullscreen, and it
        // handles the landscape rotation itself.
        video.webkitEnterFullscreen();
        return;
      }
    } catch {
      /* fullscreen refused — we can still rotate below */
    }

    // Now try to actually turn the phone sideways.
    const orientation = window.screen?.orientation as
      | (ScreenOrientation & { lock?: (o: string) => Promise<void> })
      | undefined;
    let locked = false;
    if (orientation?.lock) {
      try {
        await orientation.lock('landscape');
        locked = true;
      } catch {
        locked = false;
      }
    }
    // Fallback: tilt the player ourselves so the video fills the long edge.
    if (!locked && window.innerHeight > window.innerWidth) {
      setForceLandscape(true);
    }
  };

  // Reveal controls, then fade them out again.
  const bumpControls = useCallback(() => {
    setShowControls(true);
    clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setShowControls(false), 3500);
  }, []);

  // Tapping the video toggles the controls instead of relying on hover.
  const handleSurfaceTap = () => {
    if (showControls) {
      setShowControls(false);
      clearTimeout(controlsTimer.current);
    } else {
      bumpControls();
    }
  };

  useEffect(() => () => clearTimeout(controlsTimer.current), []);

  const displayDuration = hasRealVideo ? duration : 90 * 60;
  const displayCurrent = hasRealVideo ? currentTime : (progress / 100) * displayDuration;
  const tilted = forceLandscape;

  return (
    <AnimatePresence>
      {movie && (
        <motion.div
          ref={containerRef}
          className={`fixed inset-0 z-[100] bg-black flex items-center justify-center ${
            tilted ? 'force-landscape' : ''
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseMove={bumpControls}
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
                    className="text-5xl sm:text-6xl md:text-8xl font-black text-[#E50914]"
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
                webkit-playsinline="true"
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

          {/* Tap surface: shows/hides the controls (kept below them) */}
          {!showIntro && !showCredits && (
            <button
              type="button"
              aria-label={showControls ? 'Hide player controls' : 'Show player controls'}
              className="absolute inset-0 z-[5] cursor-pointer"
              onClick={handleSurfaceTap}
            />
          )}

          {/* Credits overlay */}
          <AnimatePresence>
            {showCredits && (
              <motion.div
                className="absolute inset-0 bg-black/90 z-10 flex flex-col items-center justify-center overflow-y-auto px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                <div className="text-center py-16 space-y-2">
                  <motion.p
                    className="text-[#E50914] text-xs sm:text-sm tracking-widest uppercase mb-8"
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
                      <p className="text-[#808080] text-xs sm:text-sm tracking-wide">{credit.role}</p>
                      <p className="text-white text-base sm:text-lg font-semibold">{credit.name}</p>
                    </motion.div>
                  ))}
                  <motion.div
                    className="mt-12 flex flex-col items-center gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + CREDITS.length * 0.3 }}
                  >
                    <p className="text-xl sm:text-2xl font-bold text-white mb-2 text-balance">
                      The Best Chapter Is Yet To Come ❤️
                    </p>
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
                    <button onClick={onClose} className="netflix-btn-red px-8 py-3 rounded">
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
                <div className="absolute top-0 left-0 right-0 px-3 py-3 sm:px-6 sm:py-5 flex items-start justify-between gap-3 bg-gradient-to-b from-black/80 to-transparent pointer-events-auto">
                  <div className="min-w-0">
                    <p className="text-[#808080] text-[11px] sm:text-sm">Now Playing</p>
                    <h3 className="text-white font-semibold text-sm sm:text-lg truncate">{movie.title}</h3>
                  </div>
                  <motion.button
                    onClick={onClose}
                    className="w-10 h-10 shrink-0 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
                    whileTap={{ scale: 0.9 }}
                    aria-label="Close player"
                  >
                    <X size={20} className="text-white" />
                  </motion.button>
                </div>

                {/* Center play button */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.button
                    onClick={togglePlay}
                    className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors pointer-events-auto"
                    whileTap={{ scale: 0.9 }}
                    aria-label={playing ? 'Pause' : 'Play'}
                  >
                    {playing ? (
                      <Pause size={24} className="text-white" />
                    ) : (
                      <Play size={24} fill="white" className="text-white ml-1" />
                    )}
                  </motion.button>
                </div>

                {/* Bottom controls */}
                <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 pt-8 sm:px-6 sm:pb-5 bg-gradient-to-t from-black/90 to-transparent pointer-events-auto safe-b">
                  {/* Progress bar — generous touch target */}
                  <div className="mb-3">
                    <div
                      className="group/seek -my-2 py-2 cursor-pointer touch-none"
                      onPointerDown={seekFromPointer}
                      role="slider"
                      aria-label="Seek"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(progress)}
                      tabIndex={0}
                    >
                      <div className="h-1 bg-white/30 rounded-full group-hover/seek:h-1.5 transition-all">
                        <div
                          className="h-full bg-[#E50914] rounded-full relative progress-bar"
                          style={{ width: `${progress}%` }}
                        >
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full translate-x-1/2 shadow-lg" />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between mt-1.5">
                      <span className="text-[#b3b3b3] text-[11px] tabular-nums">{formatSeconds(displayCurrent)}</span>
                      <span className="text-[#b3b3b3] text-[11px] tabular-nums">{formatSeconds(displayDuration)}</span>
                    </div>
                  </div>

                  {/* Controls row */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <button
                      onClick={togglePlay}
                      className="text-white hover:text-[#E50914] transition-colors p-1 -m-1"
                      aria-label={playing ? 'Pause' : 'Play'}
                    >
                      {playing ? <Pause size={22} /> : <Play size={22} fill="white" />}
                    </button>

                    <button
                      onClick={skipForward}
                      className="text-white hover:text-[#E50914] transition-colors p-1 -m-1"
                      aria-label="Skip forward 10 seconds"
                    >
                      <SkipForward size={20} />
                    </button>

                    {/* Volume */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setMuted(m => !m)}
                        className="text-white hover:text-[#E50914] transition-colors p-1 -m-1"
                        aria-label={muted ? 'Unmute' : 'Mute'}
                      >
                        {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={muted ? 0 : volume}
                        onChange={e => {
                          setVolume(Number(e.target.value));
                          setMuted(false);
                        }}
                        className="w-20 accent-white hidden md:block"
                        aria-label="Volume"
                      />
                    </div>

                    <div className="ml-auto flex items-center gap-3 sm:gap-4">
                      <span className="text-[#b3b3b3] text-[10px] sm:text-xs border border-[#808080] px-1.5 py-0.5 rounded">
                        {hasRealVideo ? 'HD' : 'Preview'}
                      </span>
                      <button
                        onClick={toggleFullscreen}
                        className="text-white hover:text-[#E50914] transition-colors p-1 -m-1"
                        aria-label={isFullscreen || tilted ? 'Exit fullscreen' : 'Enter fullscreen'}
                      >
                        {isFullscreen || tilted ? <Minimize size={20} /> : <Maximize size={20} />}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
