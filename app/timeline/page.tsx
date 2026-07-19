'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Navbar from '@/components/Navbar';
import CursorEffect from '@/components/CursorEffect';
import { TIMELINE_EVENTS } from '@/lib/data';

export default function TimelinePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div className="min-h-screen bg-[#141414]">
      <CursorEffect />
      <Navbar />

      <div className="pt-24 pb-20 px-4 md:px-12 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#E50914] text-xs font-semibold uppercase tracking-widest">Our Journey</span>
          <h1 className="text-4xl md:text-6xl font-black text-white mt-2 mb-4">Memory Timeline</h1>
          <p className="text-[#808080] text-lg">Every chapter of our story, in the order they happened. Scroll down to relive it all.</p>
        </motion.div>

        {/* Timeline */}
        <div ref={containerRef} className="relative">
          {/* Center line */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-[#333]" />
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-0 w-0.5 bg-gradient-to-b from-[#E50914] to-[#ff6b6b] origin-top"
            style={{ height: lineHeight }}
          />

          {/* Events */}
          <div className="space-y-16 pb-8">
            {TIMELINE_EVENTS.map((event, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={event.id}
                  className={`flex items-center gap-6 md:gap-12 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  {/* Content card */}
                  <div className={`flex-1 ${isLeft ? 'text-right' : 'text-left'}`}>
                    <motion.div
                      className="inline-block bg-[#1a1a1a] border border-white/10 rounded-2xl p-5 md:p-6 hover:border-[#E50914]/30 transition-colors cursor-default"
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      {event.image && (
                        <div className="w-full h-32 rounded-xl overflow-hidden mb-4">
                          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <span className="text-2xl mb-2 block">{event.emoji}</span>
                      <span className="text-[#E50914] text-xs font-semibold uppercase tracking-widest">{event.year}</span>
                      <h3 className="text-white text-xl font-bold mt-1 mb-2">{event.title}</h3>
                      <p className="text-[#b3b3b3] text-sm leading-relaxed">{event.description}</p>
                    </motion.div>
                  </div>

                  {/* Center dot */}
                  <motion.div
                    className="flex-shrink-0 w-5 h-5 bg-[#E50914] rounded-full border-4 border-[#141414] z-10 relative"
                    whileInView={{ scale: [0, 1.3, 1] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    style={{ boxShadow: '0 0 12px rgba(229,9,20,0.6)' }}
                  />

                  {/* Empty side */}
                  <div className="flex-1" />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* End card */}
        <motion.div
          className="text-center mt-16 p-8 rounded-2xl border border-[#E50914]/30 bg-gradient-to-br from-red-950/20 to-transparent"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-4xl mb-4 block">♾️</span>
          <h3 className="text-white text-2xl font-bold mb-3">The story continues...</h3>
          <p className="text-[#b3b3b3]">Every day is a new chapter. And every chapter with you is my favorite.</p>
        </motion.div>
      </div>
    </div>
  );
}
