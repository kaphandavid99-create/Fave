'use client';

import { Bell, X, Check, ArrowRight, Sparkles, Tag, Calendar, Scissors, Info, AlertCircle, Heart, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const iconMap: Record<string, any> = {
  Sparkles,
  Tag,
  Calendar,
  Scissors,
  Info,
  AlertCircle,
  Heart,
  Star,
};

export default function NotificationBell() {
  const router = useRouter();
  const [count, setCount] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<
    Array<{ id: string; message: string; created_at: string; read: boolean; link?: string; type?: string; icon?: string }>
  >([]);

  useEffect(() => {
    const tick = async () => {
      try {
        const res = await fetch('/api/notifications');
        if (!res.ok) return;
        const json = await res.json();
        const unread = json?.data?.unreadCount;
        setCount(typeof unread === 'number' ? unread : 0);
        setNotifications(Array.isArray(json?.data?.notifications) ? json.data.notifications : []);
      } catch {
        // ignore
      }
    };

    tick();
    const id = window.setInterval(tick, 30000);
    return () => window.clearInterval(id);
  }, []);

  const markAllRead = async () => {
    try {
      await fetch('/api/notifications', { method: 'POST' });
    } finally {
      // Re-sync quickly
      try {
        const res = await fetch('/api/notifications');
        if (res.ok) {
          const json = await res.json();
          setCount(typeof json?.data?.unreadCount === 'number' ? json.data.unreadCount : 0);
          setNotifications(Array.isArray(json?.data?.notifications) ? json.data.notifications : []);
        }
      } catch {
        // ignore
      }
    }
  };

  const markAsRead = async (id: string) => {
    try {
      // Mark individual notification as read if not already read
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      setCount(prev => Math.max(0, prev - 1));
    } catch {
      // ignore
    }
  };

  const handleNotificationClick = (id: string, link?: string) => {
    // Mark as read if not already read
    if (!notifications.find(n => n.id === id)?.read) {
      markAsRead(id);
    }

    // Navigate to link if provided
    if (link) {
      router.push(link);
      setOpen(false);
    }
  };

  const getIcon = (iconName?: string) => {
    const IconComponent = iconMap[iconName || 'Info'];
    if (IconComponent) {
      return <IconComponent size={18} className="text-[#8A4A32]" />;
    }
    return <Info size={18} className="text-[#8A4A32]" />;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((v) => !v)}
        className="relative cursor-pointer p-2 rounded-full hover:bg-[#F3D5D8] transition-colors"
        aria-label="Notifications"
        data-testid="notification-bell"
      >
        <Bell className="text-[#5A3A2C]" size={20} />
        {count > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[#8A4A32] text-white text-[11px] font-bold flex items-center justify-center border-2 border-[#F7F1EC]"
          >
            {count > 99 ? '99+' : count}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99]"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="fixed left-4 right-4 top-20 md:absolute md:left-auto md:right-0 md:top-auto md:mt-2 w-auto md:w-[360px] max-w-[calc(100vw-2rem)] bg-white border border-[#5A3A2C]/30 shadow-2xl rounded-2xl overflow-hidden z-[100]"
            >
              <div className="bg-gradient-to-r from-[#8A4A32] to-[#5A3A2C] text-white px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell size={18} />
                  <div className="text-sm font-semibold">Notifications</div>
                  {count > 0 && (
                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                      {count} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {count > 0 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={markAllRead}
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded-full hover:bg-white/20 transition cursor-pointer"
                    >
                      <Check size={12} />
                      Mark all read
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setOpen(false)}
                    className="p-1 rounded-full hover:bg-white/20 transition cursor-pointer"
                  >
                    <X size={16} />
                  </motion.button>
                </div>
              </div>

              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <Bell className="mx-auto text-[#5A3A2C]/30 size-12 mb-3" />
                  <div className="text-sm text-[#5A3A2C]/80">No notifications yet</div>
                  <div className="text-xs text-[#5A3A2C]/50 mt-1">You're all caught up!</div>
                </div>
              ) : (
                <ul className="max-h-[400px] overflow-y-auto bg-[#F7F1EC]">
                  {notifications.slice(0, 20).map((n, index) => (
                    <motion.li
                      key={n.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`px-4 py-3 border-b border-[#5A3A2C]/10 last:border-b-0 cursor-pointer hover:bg-[#F3D5D8]/50 transition-colors ${n.read ? 'bg-transparent' : 'bg-[#F3D5D8]/30'}`}
                      onClick={() => handleNotificationClick(n.id, n.link)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex-shrink-0">
                          {getIcon(n.icon)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-[#3A241C] break-words">{n.message}</div>
                          <div className="text-[11px] mt-1 text-[#5A3A2C]/60 flex items-center gap-1">
                            {formatTime(n.created_at)}
                            {n.link && (
                              <span className="flex items-center gap-1 text-[#8A4A32] ml-2">
                                <ArrowRight size={10} />
                                View details
                              </span>
                            )}
                          </div>
                        </div>
                        {!n.read && (
                          <div className="mt-1 w-2 h-2 rounded-full bg-[#8A4A32] flex-shrink-0" />
                        )}
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
