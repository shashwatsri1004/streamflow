'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import CursorEffect from '@/components/CursorEffect';
import { SPIN_WHEEL_REWARDS } from '@/lib/data';
import { RotateCcw } from 'lucide-react';

export default function SpinWheelPage() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<typeof SPIN_WHEEL_REWARDS[0] | null>(null);
  const [showWinner, setShowWinner] = useState(false);
  const totalRotationRef = useRef(0);

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setShowWinner(false);
    setWinner(null);

    const extraSpins = 5 + Math.floor(Math.random() * 5);
    const winnerIndex = Math.floor(Math.random() * SPIN_WHEEL_REWARDS.length);
    const segmentAngle = 360 / SPIN_WHEEL_REWARDS.length;
    const targetAngle = 360 - (winnerIndex * segmentAngle + segmentAngle / 2);
    const totalRotation = extraSpins * 360 + targetAngle;

    totalRotationRef.current += totalRotation;
    setRotation(totalRotationRef.current);

    setTimeout(() => {
      setSpinning(false);
      setWinner(SPIN_WHEEL_REWARDS[winnerIndex]);
      setShowWinner(true);
    }, 4200);
  };

  const segments = SPIN_WHEEL_REWARDS.length;
  const segmentAngle = 360 / segments;

  return (
    <div className="min-h-screen bg-[#141414]">
      <CursorEffect />
      <Navbar />

      <div className="pt-24 pb-20 px-4 md:px-12 max-w-3xl mx-auto text-center">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#E50914] text-xs font-semibold uppercase tracking-widest">Spin to Win</span>
          <h1 className="text-4xl md:text-6xl font-black text-white mt-2 mb-4">Spin the Wheel</h1>
          <p className="text-[#808080] text-lg">Every spin is a winner. Because you are. 😍</p>
        </motion.div>

        {/* Wheel container */}
        <div className="flex justify-center mb-10 relative">
          {/* Pointer */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
            <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[24px] border-l-transparent border-r-transparent border-t-[#E50914]" style={{ filter: 'drop-shadow(0 2px 4px rgba(229,9,20,0.5))' }} />
          </div>

          {/* Wheel */}
          <motion.div
            className="relative w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden shadow-2xl"
            style={{ rotate: rotation }}
            animate={{ rotate: rotation }}
            transition={{ duration: 4, ease: [0.17, 0.67, 0.12, 0.99] }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {SPIN_WHEEL_REWARDS.map((reward, i) => {
                const startAngle = (i * segmentAngle - 90) * (Math.PI / 180);
                const endAngle = ((i + 1) * segmentAngle - 90) * (Math.PI / 180);
                const x1 = 100 + 100 * Math.cos(startAngle);
                const y1 = 100 + 100 * Math.sin(startAngle);
                const x2 = 100 + 100 * Math.cos(endAngle);
                const y2 = 100 + 100 * Math.sin(endAngle);

                const textAngle = ((i + 0.5) * segmentAngle - 90) * (Math.PI / 180);
                const tx = 100 + 65 * Math.cos(textAngle);
                const ty = 100 + 65 * Math.sin(textAngle);
                const textRotation = (i + 0.5) * segmentAngle;

                return (
                  <g key={reward.id}>
                    <path
                      d={`M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z`}
                      fill={reward.color}
                      stroke="rgba(0,0,0,0.3)"
                      strokeWidth="1"
                    />
                    <text
                      x={tx}
                      y={ty}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="6"
                      fontWeight="bold"
                      transform={`rotate(${textRotation}, ${tx}, ${ty})`}
                    >
                      {reward.label.replace(/\s+\S+$/, '')}
                    </text>
                  </g>
                );
              })}
              {/* Center circle */}
              <circle cx="100" cy="100" r="15" fill="#141414" stroke="white" strokeWidth="2" />
              <circle cx="100" cy="100" r="8" fill="#E50914" />
            </svg>
          </motion.div>
        </div>

        {/* Spin button */}
        <motion.button
          onClick={spinWheel}
          disabled={spinning}
          className={`px-10 py-4 rounded-full font-bold text-lg transition-all ${
            spinning
              ? 'bg-[#333] text-[#808080] cursor-not-allowed'
              : 'bg-[#E50914] text-white hover:bg-[#F40612] shadow-lg'
          }`}
          whileHover={!spinning ? { scale: 1.05 } : {}}
          whileTap={!spinning ? { scale: 0.95 } : {}}
          style={!spinning ? { boxShadow: '0 0 30px rgba(229,9,20,0.4)' } : {}}
        >
          {spinning ? 'Spinning...' : 'SPIN! 🎡'}
        </motion.button>

        {/* Rewards list */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
          {SPIN_WHEEL_REWARDS.map(reward => (
            <motion.div
              key={reward.id}
              className="py-2.5 px-3 rounded-xl text-xs font-medium text-white text-center"
              style={{ background: `${reward.color}30`, border: `1px solid ${reward.color}40` }}
              whileHover={{ scale: 1.05 }}
            >
              {reward.label}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Winner modal */}
      <AnimatePresence>
        {showWinner && winner && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/80 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWinner(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative bg-[#181818] rounded-3xl p-10 text-center max-w-sm w-full pointer-events-auto shadow-2xl"
                initial={{ scale: 0.5, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                style={{ border: `2px solid ${winner.color}`, boxShadow: `0 0 40px ${winner.color}40` }}
              >
                {/* Confetti */}
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-sm pointer-events-none"
                    style={{ background: winner.color, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                    animate={{ y: [-10, -60], opacity: [1, 0], rotate: Math.random() * 360, x: (Math.random() - 0.5) * 100 }}
                    transition={{ duration: 1.5, delay: Math.random() * 0.5 }}
                  />
                ))}

                <motion.div
                  className="text-6xl mb-4"
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                >
                  🎉
                </motion.div>
                <p className="text-[#808080] text-sm uppercase tracking-widest mb-2">You Won!</p>
                <h2 className="text-white text-2xl md:text-3xl font-black mb-2">{winner.label}</h2>
                <p className="text-[#b3b3b3] text-sm mb-6">Redeem whenever you want. Valid forever. No expiry date. ❤️</p>
                <button
                  onClick={() => setShowWinner(false)}
                  className="netflix-btn-red px-8 py-3 rounded-full w-full justify-center"
                >
                  Claim Prize 🎁
                </button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
