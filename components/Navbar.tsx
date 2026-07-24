'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, ChevronDown, Heart, Clock, Star, Gift, Music, List } from 'lucide-react';

interface Notification {
  id: number;
  text: string;
  time: string;
  icon: string;
  unread: boolean;
}

const NOTIFICATIONS: Notification[] = [
  { id: 1, text: 'New Memory Added ❤️', time: 'Just now', icon: '💝', unread: true },
  { id: 2, text: 'You smiled today. Achievement unlocked!', time: '2m ago', icon: '🏆', unread: true },
  { id: 3, text: 'Missing You — New voice note available', time: '1h ago', icon: '🎙️', unread: true },
  { id: 4, text: 'New Episode Available: Birthday Surprise', time: '2h ago', icon: '🎂', unread: false },
  { id: 5, text: 'Achievement Unlocked: World\'s Cutest Human', time: '1d ago', icon: '🏆', unread: false },
];

const NAV_LINKS = [
  { href: '/home', label: 'Home' },
  { href: '/love-stats', label: 'Love Stats' },
  { href: '/timeline', label: 'Our Story' },
  { href: '/reasons', label: '100 Reasons' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/voice-notes', label: 'Voice Notes' },
  { href: '/love-letter', label: 'Love Letter' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [unreadCount] = useState(NOTIFICATIONS.filter(n => n.unread).length);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? 'bg-[#141414] shadow-2xl' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="px-4 md:px-12 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-2 flex-shrink-0">
          <span
            className="text-2xl md:text-3xl font-black text-[#E50914] tracking-tight"
            style={{ fontFamily: 'Georgia, serif', textShadow: '0 0 20px rgba(229,9,20,0.5)' }}
          >
            TanyaTV
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-6 ml-8">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors duration-200 ${
                pathname === link.href ? 'text-white font-semibold' : 'text-[#b3b3b3] hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="relative group">
            <button className="text-sm text-[#b3b3b3] hover:text-white flex items-center gap-1">
              More <ChevronDown size={14} />
            </button>
            <div className="absolute top-full left-0 mt-2 w-48 glassmorphism rounded-lg py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
              <Link href="/bucket-list" className="block px-4 py-2 text-sm text-[#b3b3b3] hover:text-white hover:bg-white/5 transition-colors">Bucket List</Link>
              <Link href="/achievements" className="block px-4 py-2 text-sm text-[#b3b3b3] hover:text-white hover:bg-white/5 transition-colors">Achievements</Link>
              <Link href="/spin-wheel" className="block px-4 py-2 text-sm text-[#b3b3b3] hover:text-white hover:bg-white/5 transition-colors">Spin the Wheel</Link>
              <Link href="/love-meter" className="block px-4 py-2 text-sm text-[#b3b3b3] hover:text-white hover:bg-white/5 transition-colors">Love Meter</Link>
              <Link href="/polaroid" className="block px-4 py-2 text-sm text-[#b3b3b3] hover:text-white hover:bg-white/5 transition-colors">Polaroid Wall</Link>
              <Link href="/this-or-that" className="block px-4 py-2 text-sm text-[#b3b3b3] hover:text-white hover:bg-white/5 transition-colors">This or That</Link>
              <Link href="/birthday-surprise" className="block px-4 py-2 text-sm text-[#E50914] hover:text-[#F40612] hover:bg-white/5 transition-colors font-semibold">Birthday Surprise ❤️</Link>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 md:gap-5 ml-auto">
          <Link href="/search">
            <motion.button
              className="text-white hover:text-[#E50914] transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Search size={20} />
            </motion.button>
          </Link>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <motion.button
              className="text-white hover:text-[#E50914] transition-colors relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowNotifications(v => !v)}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E50914] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center notification-dot">
                  {unreadCount}
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  className="absolute right-0 top-10 w-80 glassmorphism rounded-xl overflow-hidden shadow-2xl"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="px-4 py-3 border-b border-white/10">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                  </div>
                  {NOTIFICATIONS.map(n => (
                    <div
                      key={n.id}
                      className={`flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer ${n.unread ? 'bg-white/3' : ''}`}
                    >
                      <span className="text-xl flex-shrink-0">{n.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs ${n.unread ? 'text-white font-medium' : 'text-[#b3b3b3]'}`}>{n.text}</p>
                        <p className="text-[10px] text-[#808080] mt-0.5">{n.time}</p>
                      </div>
                      {n.unread && <div className="w-2 h-2 bg-[#E50914] rounded-full flex-shrink-0 mt-1" />}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile avatar */}
          <Link href="/">
            <motion.div
              className="w-8 h-8 rounded bg-[#E50914] flex items-center justify-center cursor-pointer overflow-hidden"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <img
                src="https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=80"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden text-white ml-2"
            onClick={() => setShowMobileMenu(v => !v)}
          >
            <div className="space-y-1">
              <span className={`block w-5 h-0.5 bg-white transition-transform ${showMobileMenu ? 'translate-y-1.5 rotate-45' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white transition-opacity ${showMobileMenu ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-white transition-transform ${showMobileMenu ? '-translate-y-1.5 -rotate-45' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            className="lg:hidden glassmorphism border-t border-white/10"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-4 space-y-2">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-2 text-sm text-[#b3b3b3] hover:text-white transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/bucket-list" className="block py-2 text-sm text-[#b3b3b3] hover:text-white" onClick={() => setShowMobileMenu(false)}>Bucket List</Link>
              <Link href="/achievements" className="block py-2 text-sm text-[#b3b3b3] hover:text-white" onClick={() => setShowMobileMenu(false)}>Achievements</Link>
              <Link href="/spin-wheel" className="block py-2 text-sm text-[#b3b3b3] hover:text-white" onClick={() => setShowMobileMenu(false)}>Spin the Wheel</Link>
              <Link href="/love-meter" className="block py-2 text-sm text-[#b3b3b3] hover:text-white" onClick={() => setShowMobileMenu(false)}>Love Meter</Link>
              <Link href="/this-or-that" className="block py-2 text-sm text-[#b3b3b3] hover:text-white" onClick={() => setShowMobileMenu(false)}>This or That</Link>
              <Link href="/birthday-surprise" className="block py-2 text-sm text-[#E50914] font-semibold" onClick={() => setShowMobileMenu(false)}>Birthday Surprise ❤️</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
