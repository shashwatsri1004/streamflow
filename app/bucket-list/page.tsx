'use client';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import CursorEffect from '@/components/CursorEffect';
import { BUCKET_LIST } from '@/lib/data';
import { MapPin, Clock, CheckCircle2 } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  'In Progress': '#007AFF',
  'Planned': '#FF9500',
  'Dreaming': '#9B59B6',
  'Ongoing': '#34C759',
  'Coming Soon': '#E50914',
  'Someday': '#FF6B35',
  'Forever': '#E50914',
};

export default function BucketListPage() {
  return (
    <div className="min-h-screen bg-[#141414]">
      <CursorEffect />
      <Navbar />

      <div className="pt-24 pb-20 px-4 md:px-12 max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#E50914] text-xs font-semibold uppercase tracking-widest">Coming Soon</span>
          <h1 className="text-4xl md:text-6xl font-black text-white mt-2 mb-4">Future Bucket List</h1>
          <p className="text-[#808080] text-lg">All the adventures that are still ahead of us. The best is yet to come. ✈️</p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BUCKET_LIST.map((item, i) => (
            <motion.div
              key={item.id}
              className="group rounded-2xl overflow-hidden bg-[#1a1a1a] border border-white/5 hover:border-white/10 transition-all cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              {/* Image */}
              <div className="h-40 overflow-hidden relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />

                {/* Status badge */}
                <div
                  className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ background: `${STATUS_COLORS[item.status] || '#555'}CC`, backdropFilter: 'blur(8px)' }}
                >
                  {item.status}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#E50914] transition-colors">
                  {item.title}
                </h3>
                <p className="text-[#808080] text-sm leading-relaxed mb-4">{item.description}</p>

                {/* Progress */}
                <div className="mb-1">
                  <div className="flex justify-between text-xs text-[#808080] mb-1.5">
                    <span>Progress</span>
                    <span style={{ color: STATUS_COLORS[item.status] }}>{item.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-[#333] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: STATUS_COLORS[item.status] || '#555' }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.1 + 0.3, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {item.progress === 100 && (
                  <div className="flex items-center gap-1.5 mt-3 text-green-400 text-xs">
                    <CheckCircle2 size={14} />
                    <span>Always ongoing ❤️</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom message */}
        <motion.div
          className="text-center mt-16 p-8 rounded-2xl border border-[#E50914]/20 bg-gradient-to-br from-red-950/20 to-transparent"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-4xl mb-4 block">✈️</span>
          <h3 className="text-white text-2xl font-bold mb-3">Every adventure is better with you.</h3>
          <p className="text-[#808080]">The destination doesn&apos;t matter. The company does. And the company is always perfect. ❤️</p>
        </motion.div>
      </div>
    </div>
  );
}
