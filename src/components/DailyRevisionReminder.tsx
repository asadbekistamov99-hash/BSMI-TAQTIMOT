import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Sparkles, 
  X, 
  ArrowRight, 
  Brain, 
  Clock, 
  CheckCircle2, 
  RotateCcw, 
  Zap,
  Volume2,
  BellOff
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface DailyRevisionReminderProps {
  user?: any;
}

export default function DailyRevisionReminder({ user }: DailyRevisionReminderProps) {
  const [visible, setVisible] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [targetPage, setTargetPage] = useState<{ path: string; title: string; updatedAt?: string } | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const { language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if dismissed today
    const todayStr = new Date().toISOString().split('T')[0];
    const dismissKey = `daily_revision_dismissed_${user?.uid || 'guest'}_${todayStr}`;
    const isDismissed = localStorage.getItem(dismissKey) === 'true';

    // Retrieve last viewed page & history
    try {
      const storageKey = user?.uid ? `last_viewed_${user.uid}` : 'last_viewed_guest';
      const historyKey = user?.uid ? `recent_topics_history_${user.uid}` : 'recent_topics_history_guest';
      
      const lastSaved = localStorage.getItem(storageKey) || sessionStorage.getItem(storageKey);
      const savedHistory = localStorage.getItem(historyKey);

      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }

      let parsed = lastSaved ? JSON.parse(lastSaved) : null;

      // Fallback if lastSaved is home '/'
      if (!parsed || parsed.path === '/') {
        parsed = {
          path: '/semester/1',
          title: language === 'uz' ? '1-Semestr: Tayanch-harakat tizimi' : '1-Semester: Locomotor System',
          updatedAt: new Date().toISOString()
        };
      }

      setTargetPage(parsed);

      // Show reminder if not dismissed today after a short delay (e.g. 1.5 seconds)
      if (!isDismissed) {
        const timer = setTimeout(() => {
          setVisible(true);
          // Try sending native web notification if granted
          triggerNativeNotification(parsed.title);
        }, 1800);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn('DailyRevisionReminder error:', e);
    }
  }, [user, language]);

  const triggerNativeNotification = (topicTitle: string) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('🧠 Kunlik Anatomiya Takrorlashi', {
          body: `Bugun "${topicTitle}" mavzusini 3 daqiqada takrorlab bilimingizni mustahkamlang!`,
          icon: '/favicon.ico',
          tag: 'daily-anatomy-revision'
        });
      } catch (e) {
        console.warn('Native notification failed:', e);
      }
    }
  };

  const requestNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Brauzeringizda xabarnomalar qo‘llab-quvvatlanmaydi.');
      return;
    }

    try {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
      if (perm === 'granted') {
        triggerNativeNotification(targetPage?.title || 'Anatomiya Darsi');
      }
    } catch (e) {
      console.warn('Error requesting notification permission:', e);
    }
  };

  const handleDismiss = () => {
    setVisible(false);
    const todayStr = new Date().toISOString().split('T')[0];
    const dismissKey = `daily_revision_dismissed_${user?.uid || 'guest'}_${todayStr}`;
    localStorage.setItem(dismissKey, 'true');
  };

  const handleStartRevision = () => {
    setVisible(false);
    if (targetPage?.path) {
      // If path is a topic, offer quiz or direct navigation
      if (targetPage.path.startsWith('/topic/')) {
        const topicId = targetPage.path.replace('/topic/', '');
        navigate(`/quiz/${topicId}`);
      } else {
        navigate(targetPage.path);
      }
    } else {
      navigate('/semester/1');
    }
  };

  if (!visible || !targetPage) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed bottom-5 right-5 z-50 w-full max-w-sm font-sans"
      >
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-indigo-500/40 p-5 shadow-2xl shadow-indigo-950/50 text-white backdrop-blur-xl">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 rounded-full bg-cyan-500/20 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
            title="Keyinroq"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Top Badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-cyan-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-cyan-400 animate-pulse" />
              Kunlik Takrorlash Esdaligi
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> 3 daqiqa
            </span>
          </div>

          {/* Title & Description */}
          <h4 className="text-base font-extrabold text-white leading-snug pr-6">
            Bugungi o‘quv mavzusini takrorlaysizmi?
          </h4>
          <p className="text-xs text-slate-300 font-medium mt-1 line-clamp-2">
            O‘zingiz so‘nggi ko‘rgan <strong className="text-cyan-300 font-bold">"{targetPage.title}"</strong> darsini eslab qolish darajangizni 3 daqiqalik test bilan sinang!
          </p>

          {/* Notification Permission Toggle */}
          {notificationPermission !== 'granted' && (
            <div className="mt-3.5 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between gap-2">
              <span className="text-[10px] font-medium text-slate-300 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                Brauzer xabarnomasini yoqish
              </span>
              <button
                onClick={requestNotificationPermission}
                className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-lg text-[9px] font-black uppercase tracking-wider transition"
              >
                Ruxsat berish
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={handleStartRevision}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 group active:scale-95 cursor-pointer"
            >
              <span>Takrorlashni boshlash</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={handleDismiss}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Ertaga
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
