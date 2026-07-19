'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import CursorEffect from '@/components/CursorEffect';
import { Heart, X, ZoomIn } from 'lucide-react';

const GALLERY_PHOTOS = [
  { id: 1, src: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=600', tall: true },
  { id: 2, src: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=600', tall: false },
  { id: 3, src: 'https://images.pexels.com/photos/1415131/pexels-photo-1415131.jpeg?auto=compress&cs=tinysrgb&w=600', tall: false },
  { id: 4, src: 'https://images.pexels.com/photos/1024975/pexels-photo-1024975.jpeg?auto=compress&cs=tinysrgb&w=600', tall: true },
  { id: 5, src: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=600', tall: false },
  { id: 6, src: 'https://images.pexels.com/photos/1024984/pexels-photo-1024984.jpeg?auto=compress&cs=tinysrgb&w=600', tall: false },
  { id: 7, src: 'https://images.pexels.com/photos/346804/pexels-photo-346804.jpeg?auto=compress&cs=tinysrgb&w=600', tall: true },
  { id: 8, src: 'https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg?auto=compress&cs=tinysrgb&w=600', tall: false },
  { id: 9, src: 'https://images.pexels.com/photos/2526105/pexels-photo-2526105.jpeg?auto=compress&cs=tinysrgb&w=600', tall: false },
  { id: 10, src: 'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=600', tall: true },
  { id: 11, src: 'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=600', tall: false },
  { id: 12, src: 'https://images.pexels.com/photos/1805053/pexels-photo-1805053.jpeg?auto=compress&cs=tinysrgb&w=600', tall: false },
];

export default function GalleryPage() {
  const [lightbox, setLightbox] = useState<typeof GALLERY_PHOTOS[0] | null>(null);
  const [liked, setLiked] = useState<number[]>([]);

  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-[#141414]">
      <CursorEffect />
      <Navbar />

      <div className="pt-24 pb-20 px-4 md:px-12 max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#E50914] text-xs font-semibold uppercase tracking-widest">Our Moments</span>
          <h1 className="text-4xl md:text-6xl font-black text-white mt-2 mb-4">Photo Gallery</h1>
          <p className="text-[#808080] text-lg">Every picture tells a story. Every story is ours.</p>
        </motion.div>

        {/* Masonry grid */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {GALLERY_PHOTOS.map((photo, i) => (
            <motion.div
              key={photo.id}
              className="break-inside-avoid relative group cursor-pointer rounded-xl overflow-hidden mb-3"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              onClick={() => setLightbox(photo)}
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={photo.src}
                alt={`Memory ${photo.id}`}
                className={`w-full object-cover rounded-xl transition-transform duration-300 group-hover:scale-105 ${photo.tall ? 'h-64 md:h-80' : 'h-36 md:h-48'}`}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 rounded-xl" />

              {/* Actions */}
              <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.button
                  onClick={e => toggleLike(photo.id, e)}
                  className="w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart
                    size={14}
                    className={liked.includes(photo.id) ? 'text-[#E50914] fill-[#E50914]' : 'text-white'}
                  />
                </motion.button>
                <motion.button
                  className="w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.2 }}
                >
                  <ZoomIn size={14} className="text-white" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/95 z-50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightbox(null)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="relative max-w-3xl w-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                onClick={e => e.stopPropagation()}
              >
                <img
                  src={lightbox.src}
                  alt="Memory"
                  className="w-full rounded-2xl shadow-2xl"
                />
                <motion.button
                  onClick={() => setLightbox(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={18} />
                </motion.button>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-[#808080] text-sm">Memory #{lightbox.id}</p>
                  <motion.button
                    onClick={e => toggleLike(lightbox.id, e as any)}
                    className="flex items-center gap-2 text-sm"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Heart
                      size={18}
                      className={liked.includes(lightbox.id) ? 'text-[#E50914] fill-[#E50914]' : 'text-white'}
                    />
                    <span className={liked.includes(lightbox.id) ? 'text-[#E50914]' : 'text-white'}>
                      {liked.includes(lightbox.id) ? 'Loved ❤️' : 'Love this'}
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
