'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Upload, Settings, Film, Image, Music, ToggleLeft, ToggleRight, ChevronDown, ChevronUp } from 'lucide-react';
import VideoUploader from '@/components/admin/VideoUploader';

const ADMIN_PASSWORD = 'memflix2024';

const SECTIONS = [
  { id: 'videos', label: 'Video Library', icon: Film, enabled: true },
  { id: 'photos', label: 'Photo Gallery', icon: Image, enabled: true },
  { id: 'voice', label: 'Voice Notes', icon: Music, enabled: true },
  { id: 'reasons', label: '100 Reasons', icon: Settings, enabled: true },
  { id: 'timeline', label: 'Timeline', icon: Settings, enabled: true },
  { id: 'achievements', label: 'Achievements', icon: Settings, enabled: true },
  { id: 'spinwheel', label: 'Spin Wheel', icon: Settings, enabled: true },
  { id: 'lovemeter', label: 'Love Meter', icon: Settings, enabled: true },
];

export default function AdminPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [sections, setSections] = useState(SECTIONS);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Try again.');
    }
  };

  const toggleSection = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#141414] flex items-center justify-center px-4">
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#E50914]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock size={28} className="text-[#E50914]" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">Admin Panel</h1>
            <p className="text-[#808080] text-sm">MEMFLIX — For authorized personnel only 🔐</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full bg-[#2a2a2a] text-white px-4 py-3 rounded-xl border border-transparent focus:border-[#E50914] focus:outline-none transition-colors placeholder-[#808080]"
            />
            {error && (
              <motion.p
                className="text-[#E50914] text-sm text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.p>
            )}
            <motion.button
              type="submit"
              className="w-full bg-[#E50914] text-white py-3 rounded-xl font-semibold hover:bg-[#F40612] transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Enter
            </motion.button>
          </form>

          <p className="text-center text-[#555] text-xs mt-6">
            Access restricted. This page is for managing MEMFLIX content.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      <div className="border-b border-white/10">
        <div className="px-4 md:px-12 py-4 flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-[#E50914] text-xl font-black" style={{ fontFamily: 'Georgia, serif' }}>MEMFLIX</span>
            <span className="text-[#808080] text-sm">Admin Panel</span>
          </div>
          <button
            onClick={() => router.push('/home')}
            className="text-sm text-[#808080] hover:text-white transition-colors"
          >
            ← Back to MEMFLIX
          </button>
        </div>
      </div>

      <div className="px-4 md:px-12 py-10 max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-8">Content Management</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — Sections */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <Settings size={18} className="text-[#E50914]" /> Sections
            </h2>

            {sections.map(section => (
              <motion.div
                key={section.id}
                className="bg-[#1a1a1a] border border-white/5 rounded-xl overflow-hidden"
                whileHover={{ borderColor: 'rgba(255,255,255,0.1)' }}
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <section.icon size={18} className="text-[#808080]" />
                    <span className="text-white text-sm font-medium">{section.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className={`flex items-center gap-2 text-xs font-semibold transition-colors ${section.enabled ? 'text-green-400' : 'text-[#808080]'}`}
                    >
                      {section.enabled ? (
                        <><ToggleRight size={20} className="text-green-400" /> Enabled</>
                      ) : (
                        <><ToggleLeft size={20} /> Disabled</>
                      )}
                    </button>
                    <button
                      onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                      className="text-[#808080] hover:text-white transition-colors"
                    >
                      {expandedSection === section.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedSection === section.id && (
                    <motion.div
                      className="border-t border-white/5 p-4 space-y-3"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div>
                        <label className="text-[#808080] text-xs mb-1 block">Title</label>
                        <input
                          type="text"
                          defaultValue={section.label}
                          className="w-full bg-[#2a2a2a] text-white text-sm px-3 py-2 rounded-lg border border-transparent focus:border-[#E50914] focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[#808080] text-xs mb-1 block">Description</label>
                        <textarea
                          rows={2}
                          placeholder="Optional description..."
                          className="w-full bg-[#2a2a2a] text-white text-sm px-3 py-2 rounded-lg border border-transparent focus:border-[#E50914] focus:outline-none transition-colors resize-none"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Right — Quick actions */}
          <div className="space-y-5">
            <h2 className="text-white font-semibold text-lg flex items-center gap-2">
              <Upload size={18} className="text-[#E50914]" /> Quick Actions
            </h2>

            <VideoUploader />

            {[
              { label: 'Upload Photo', icon: Image, hint: 'Add to gallery or polaroid wall' },
              { label: 'Add Voice Note', icon: Music, hint: 'Record or upload audio' },
            ].map(action => (
              <motion.div
                key={action.label}
                className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5 cursor-pointer hover:border-[#E50914]/30 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-[#E50914]/20 rounded-lg flex items-center justify-center">
                    <action.icon size={16} className="text-[#E50914]" />
                  </div>
                  <span className="text-white text-sm font-medium">{action.label}</span>
                </div>
                <p className="text-[#808080] text-xs">{action.hint}</p>
                <div className="mt-3 w-full border border-dashed border-white/20 rounded-lg py-3 text-center text-[#555] text-xs hover:border-[#E50914]/40 transition-colors">
                  Drop file or click to upload
                </div>
              </motion.div>
            ))}

            {/* Stats */}
            <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-5">
              <h3 className="text-white text-sm font-semibold mb-4">Site Stats</h3>
              {[
                { label: 'Total Memories', value: '26' },
                { label: 'Voice Notes', value: '6' },
                { label: 'Photos', value: '12' },
                { label: 'Reasons Listed', value: '100' },
              ].map(stat => (
                <div key={stat.label} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-[#808080] text-xs">{stat.label}</span>
                  <span className="text-white text-xs font-semibold">{stat.value}</span>
                </div>
              ))}
            </div>

            <motion.button
              onClick={handleSave}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${saved ? 'bg-green-600 text-white' : 'bg-[#E50914] text-white hover:bg-[#F40612]'}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {saved ? '✓ Saved!' : 'Save Changes'}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
