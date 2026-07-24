'use client';
import { useRef, useState } from 'react';
import { upload } from '@vercel/blob/client';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Upload, Trash2, Loader2, GalleryVertical } from 'lucide-react';
import { usePhotos } from '@/lib/useMediaAssets';

interface PhotoUploaderProps {
  kind: 'gallery' | 'polaroid';
}

const LABELS = {
  gallery: {
    title: 'Gallery Photo',
    hint: 'Add a photo to the Photo Gallery page',
  },
  polaroid: {
    title: 'Polaroid Photo',
    hint: 'Pin a captioned photo to the Polaroid Wall',
  },
} as const;

export default function PhotoUploader({ kind }: PhotoUploaderProps) {
  const { photos, mutate, isLoading } = usePhotos(kind);
  const fileRef = useRef<HTMLInputElement>(null);
  const [caption, setCaption] = useState('');
  const [tall, setTall] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  const labels = LABELS[kind];

  const handleUpload = async (file: File) => {
    setUploading(true);
    setProgress(0);
    setMessage(null);
    try {
      const blob = await upload(`photos/${kind}/${file.name}`, file, {
        access: 'private',
        handleUploadUrl: '/api/upload-image',
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      });

      // Private blobs aren't directly viewable — serve them via the image proxy.
      const proxyUrl = `/api/image?path=${encodeURIComponent(blob.pathname)}`;

      const res = await fetch('/api/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind,
          url: proxyUrl,
          pathname: blob.pathname,
          caption: caption.trim() || null,
          tall,
        }),
      });
      if (!res.ok) throw new Error('Failed to save the photo.');

      await mutate();
      setMessage({ type: 'ok', text: 'Photo added and live now.' });
      setCaption('');
      setTall(false);
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message || 'Upload failed.' });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleRemove = async (id: string) => {
    setMessage(null);
    try {
      const res = await fetch('/api/photos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to remove photo.');
      await mutate();
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message });
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 bg-[#E50914]/20 rounded-lg flex items-center justify-center">
          {kind === 'gallery' ? (
            <ImageIcon size={16} className="text-[#E50914]" />
          ) : (
            <GalleryVertical size={16} className="text-[#E50914]" />
          )}
        </div>
        <div>
          <span className="text-white text-sm font-medium">{labels.title}</span>
          <p className="text-[#808080] text-xs">{labels.hint}</p>
        </div>
      </div>

      {/* Caption (used as polaroid caption, optional gallery alt) */}
      <label className="text-[#808080] text-xs mt-4 mb-1 block">
        Caption {kind === 'gallery' ? '(optional)' : ''}
      </label>
      <input
        type="text"
        value={caption}
        onChange={e => setCaption(e.target.value)}
        disabled={uploading}
        placeholder={kind === 'polaroid' ? 'e.g. First Date' : 'Optional caption…'}
        className="w-full bg-[#2a2a2a] text-white text-sm px-3 py-2 rounded-lg border border-transparent focus:border-[#E50914] focus:outline-none transition-colors mb-3"
      />

      {kind === 'gallery' && (
        <label className="flex items-center gap-2 text-[#808080] text-xs mb-3 cursor-pointer">
          <input
            type="checkbox"
            checked={tall}
            onChange={e => setTall(e.target.checked)}
            disabled={uploading}
            className="accent-[#E50914]"
          />
          Tall photo (spans more vertical space in the grid)
        </label>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => {
          const f = e.target.files?.[0];
          if (f) handleUpload(f);
        }}
      />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="w-full border border-dashed border-white/20 rounded-lg py-4 text-center text-[#808080] text-xs hover:border-[#E50914]/40 hover:text-white transition-colors flex flex-col items-center gap-2 disabled:opacity-60"
      >
        {uploading ? (
          <>
            <Loader2 size={18} className="animate-spin text-[#E50914]" />
            Uploading… {progress}%
          </>
        ) : (
          <>
            <Upload size={18} />
            Click to choose an image (JPG, PNG, WebP)
          </>
        )}
      </button>

      {uploading && (
        <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-[#E50914] transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}

      {message && (
        <p className={`mt-3 text-xs ${message.type === 'ok' ? 'text-green-400' : 'text-[#E50914]'}`}>
          {message.text}
        </p>
      )}

      <div className="mt-5 pt-4 border-t border-white/5">
        <h4 className="text-white text-xs font-semibold mb-3">
          Live photos ({photos.length})
        </h4>
        {isLoading ? (
          <p className="text-[#555] text-xs">Loading…</p>
        ) : photos.length === 0 ? (
          <p className="text-[#555] text-xs">No photos uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {photos.map(p => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative group rounded-lg overflow-hidden"
              >
                <img src={p.url || "/placeholder.svg"} alt={p.caption ?? 'Photo'} className="w-full h-20 object-cover" />
                <button
                  onClick={() => handleRemove(p.id)}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#E50914]"
                  title="Remove photo"
                >
                  <Trash2 size={12} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
