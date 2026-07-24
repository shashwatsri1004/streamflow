'use client';
import { useRef, useState } from 'react';
import { upload } from '@vercel/blob/client';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Upload, Trash2, CheckCircle2, Loader2 } from 'lucide-react';
import { ALL_MOVIES } from '@/lib/data';
import { useThumbnails } from '@/lib/useMediaAssets';

export default function ThumbnailUploader() {
  const { thumbnails, mutate, isLoading } = useThumbnails();
  const fileRef = useRef<HTMLInputElement>(null);
  const [movieId, setMovieId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  const count = Object.keys(thumbnails).length;

  const handleUpload = async (file: File) => {
    if (!movieId) {
      setMessage({ type: 'error', text: 'Pick a tile to set this thumbnail for first.' });
      return;
    }
    setUploading(true);
    setProgress(0);
    setMessage(null);
    try {
      const blob = await upload(`thumbnails/${movieId}-${file.name}`, file, {
        access: 'private',
        handleUploadUrl: '/api/upload-image',
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      });

      // Private blobs aren't directly viewable — serve them via the image proxy.
      const proxyUrl = `/api/image?path=${encodeURIComponent(blob.pathname)}`;

      const res = await fetch('/api/thumbnails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId, url: proxyUrl, pathname: blob.pathname, fileName: file.name }),
      });
      if (!res.ok) throw new Error('Failed to save the thumbnail.');

      await mutate();
      const title = ALL_MOVIES.find(m => m.id === movieId)?.title ?? movieId;
      setMessage({ type: 'ok', text: `Thumbnail updated for "${title}".` });
      setMovieId('');
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
      const res = await fetch('/api/thumbnails', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId: id }),
      });
      if (!res.ok) throw new Error('Failed to remove thumbnail.');
      await mutate();
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message });
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 bg-[#E50914]/20 rounded-lg flex items-center justify-center">
          <ImageIcon size={16} className="text-[#E50914]" />
        </div>
        <div>
          <span className="text-white text-sm font-medium">Tile Thumbnail</span>
          <p className="text-[#808080] text-xs">Replace the artwork on any memory tile</p>
        </div>
      </div>

      <label className="text-[#808080] text-xs mt-4 mb-1 block">Choose tile</label>
      <select
        value={movieId}
        onChange={e => setMovieId(e.target.value)}
        disabled={uploading}
        className="w-full bg-[#2a2a2a] text-white text-sm px-3 py-2 rounded-lg border border-transparent focus:border-[#E50914] focus:outline-none transition-colors mb-3"
      >
        <option value="">Select a memory…</option>
        {ALL_MOVIES.map(m => (
          <option key={m.id} value={m.id}>
            {thumbnails[m.id] ? '✓ ' : ''}{m.emoji ? `${m.emoji} ` : ''}{m.title}
          </option>
        ))}
      </select>

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
        <h4 className="text-white text-xs font-semibold mb-3 flex items-center gap-2">
          <CheckCircle2 size={14} className="text-[#E50914]" />
          Custom thumbnails ({count})
        </h4>
        {isLoading ? (
          <p className="text-[#555] text-xs">Loading…</p>
        ) : count === 0 ? (
          <p className="text-[#555] text-xs">No custom thumbnails yet. Tiles use their default art.</p>
        ) : (
          <div className="space-y-2">
            {ALL_MOVIES.filter(m => thumbnails[m.id]).map(m => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between bg-[#2a2a2a] rounded-lg px-3 py-2"
              >
                <span className="text-white text-xs flex items-center gap-2 truncate">
                  <img src={thumbnails[m.id] || "/placeholder.svg"} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
                  <span className="truncate">{m.emoji ? `${m.emoji} ` : ''}{m.title}</span>
                </span>
                <button
                  onClick={() => handleRemove(m.id)}
                  className="text-[#808080] hover:text-[#E50914] transition-colors shrink-0 ml-2"
                  title="Remove thumbnail"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
