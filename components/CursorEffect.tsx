'use client';
import { useEffect, useState, useCallback } from 'react';

interface Heart {
  id: number;
  x: number;
  y: number;
}

export default function CursorEffect() {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [counter, setCounter] = useState(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (Math.random() > 0.85) {
      const newHeart: Heart = { id: counter + Date.now(), x: e.clientX, y: e.clientY };
      setHearts(prev => [...prev.slice(-8), newHeart]);
      setCounter(c => c + 1);
    }
  }, [counter]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    const timer = setInterval(() => {
      setHearts(prev => prev.slice(1));
    }, 800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="heart-trail absolute select-none"
          style={{ left: heart.x - 7, top: heart.y - 7 }}
        >
          <span style={{ fontSize: 14, opacity: 0.7 }}>♥</span>
        </div>
      ))}
    </div>
  );
}
