'use client';
import { useRef, useState } from 'react';
import { upload } from '@vercel/blob/client';
import { motion } from 'framer-motion';
import { Film, Upload, Trash2, CheckCircle2, Loader2, PlayCircle } from 'lucide-react';
import { ALL_MOVIES } from '@/lib/data';
import { useVideoAssets } from '@/lib/useVideoAssets';

export default function VideoUploader() {
  const { assets, mutate, isLoading } = useVideoAssets();
  const fileRef = useRef<HTMLInputElement>(null);
  const [movieId, setMovieId] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  const assignedCount = Object.keys(assets).length;

  const handleUpload = async (file: File) => {
    if (!movieId) {
      setMessage({ type: 'error', text: 'Pick a memory tile to assign this video to first.' });
      return;
    }
    setUploading(true);
    setProgress(0);
    setMessage(null);
    try {
      const blob = await upload(`videos/${movieId}-${file.name}`, file, {
        access: 'private',
        handleUploadUrl: '/api/upload',
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      });

      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId, pathname: blob.pathname, fileName: file.name }),
      });
      if (!res.ok) throw new Error('Failed to save the video mapping.');

      await mutate();
      const title = ALL_MOVIES.find(m => m.id === movieId)?.title ?? movieId;
      setMessage({ type: 'ok', text: `Video attached to "${title}". Press Play on that tile to watch it.` });
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
      const res = await fetch('/api/videos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movieId: id }),
      });
      if (!res.ok) throw new Error('Failed to remove video.');
      await mutate();
    } catch (err) {
      setMessage({ type: 'error', text: (err as Error).message });
    }
  };

  return (
    <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 bg-[#E50914]/20 rounded-lg flex items-center justify-center">
          <Film size={16} className="text-[#E50914]" />
        </div>
        <div>
          <span className="text-white text-sm font-medium">Upload Video</span>
          <p className="text-[#808080] text-xs">Attach a real video to a memory tile</p>
        </div>
      </div>

      {/* Tile selector */}
      <label className="text-[#808080] text-xs mt-4 mb-1 block">Assign to tile</label>
      <select
        value={movieId}
        onChange={e => setMovieId(e.target.value)}
        disabled={uploading}
        className="w-full bg-[#2a2a2a] text-white text-sm px-3 py-2 rounded-lg border border-transparent focus:border-[#E50914] focus:outline-none transition-colors mb-3"
      >
        <option value="">Select a memory…</option>
        {ALL_MOVIES.map(m => (
          <option key={m.id} value={m.id}>
            {assets[m.id] ? '✓ ' : ''}{m.emoji ? `${m.emoji} ` : ''}{m.title}
          </option>
        ))}
      </select>

      {/* Drop zone / file input */}
      <input
        ref={fileRef}
        type="file"
        accept="video/*"
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
            Click to choose a video file (MP4, MOV, WebM)
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

      {/* Assigned videos list */}
      <div className="mt-5 pt-4 border-t border-white/5">
        <h4 className="text-white text-xs font-semibold mb-3 flex items-center gap-2">
          <PlayCircle size={14} className="text-[#E50914]" />
          Videos live now ({assignedCount})
        </h4>
        {isLoading ? (
          <p className="text-[#555] text-xs">Loading…</p>
        ) : assignedCount === 0 ? (
          <p className="text-[#555] text-xs">No videos uploaded yet. Assign one above.</p>
        ) : (
          <div className="space-y-2">
            {ALL_MOVIES.filter(m => assets[m.id]).map(m => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between bg-[#2a2a2a] rounded-lg px-3 py-2"
              >
                <span className="text-white text-xs flex items-center gap-2 truncate">
                  <CheckCircle2 size={13} className="text-green-400 shrink-0" />
                  <span className="truncate">{m.emoji ? `${m.emoji} ` : ''}{m.title}</span>
                </span>
                <button
                  onClick={() => handleRemove(m.id)}
                  className="text-[#808080] hover:text-[#E50914] transition-colors shrink-0 ml-2"
                  title="Remove video"
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
