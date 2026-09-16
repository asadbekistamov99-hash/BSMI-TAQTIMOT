import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { dbService, isSupabaseEnabled, isAppwriteEnabled } from '../lib/dbService';
import { Announcement } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Megaphone, X, AlertTriangle, CheckCircle, AlertCircle, Check } from 'lucide-react';

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [closedIds, setClosedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('anatomy_dismissed_announcements');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (isAppwriteEnabled() || isSupabaseEnabled()) {
      const fetchCloudAnnouncements = async () => {
        try {
          const list = await dbService.getAnnouncements();
          setAnnouncements(list);
        } catch (e) {
          console.error("Cloud announcements fetch error:", e);
        }
      };
      fetchCloudAnnouncements();
      return;
    }

    const q = query(
      collection(db, 'announcements'),
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement));
      setAnnouncements(data);
    });

    return () => unsub();
  }, []);

  const handleDismiss = (id: string) => {
    const next = [...closedIds, id];
    setClosedIds(next);
    try {
      localStorage.setItem('anatomy_dismissed_announcements', JSON.stringify(next));
    } catch (e) {
      console.warn("Could not persist dismissed announcement:", e);
    }
  };

  const visibleAnnouncements = announcements.filter(a => !closedIds.includes(a.id));

  if (visibleAnnouncements.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[90] w-full max-w-lg px-4 sm:px-0 pointer-events-none">
      <AnimatePresence>
        {visibleAnnouncements.map((ann, index) => (
          <motion.div
            key={ann.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`pointer-events-auto mb-3 p-5 rounded-2xl border shadow-2xl flex items-start gap-3.5 overflow-hidden relative backdrop-blur-xl transition-all ${
              ann.type === 'danger'
                ? 'bg-red-50/95 border-red-200 text-red-900 dark:bg-slate-900/95 dark:border-red-500/30 dark:text-red-100'
                : ann.type === 'warning'
                ? 'bg-amber-50/95 border-amber-200 text-amber-900 dark:bg-slate-900/95 dark:border-amber-500/30 dark:text-amber-100'
                : ann.type === 'success'
                ? 'bg-emerald-50/95 border-emerald-200 text-emerald-900 dark:bg-slate-900/95 dark:border-emerald-500/30 dark:text-emerald-100'
                : 'bg-indigo-50/95 border-indigo-200 text-indigo-950 dark:bg-slate-900/95 dark:border-cyan-500/30 dark:text-cyan-100'
            }`}
            style={{ 
              zIndex: visibleAnnouncements.length - index,
            }}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              ann.type === 'danger' ? 'bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400' :
              ann.type === 'warning' ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400' :
              ann.type === 'success' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' :
              'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-cyan-400'
            }`}>
              {ann.type === 'danger' && <AlertCircle size={20} />}
              {ann.type === 'warning' && <AlertTriangle size={20} />}
              {ann.type === 'success' && <CheckCircle size={20} />}
              {ann.type === 'info' && <Megaphone size={20} />}
            </div>

            <div className="flex-grow pr-6">
              <h4 className="font-black text-xs uppercase tracking-tight mb-1">{ann.title}</h4>
              <p className="text-xs font-medium leading-relaxed opacity-90">{ann.content}</p>
              
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDismiss(ann.id)}
                  className="px-3 py-1 bg-slate-900/10 hover:bg-slate-900/20 dark:bg-white/10 dark:hover:bg-white/20 rounded-lg text-[11px] font-black uppercase tracking-wider transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <Check size={12} />
                  <span>Tushundim</span>
                </button>
              </div>
            </div>

            <button 
              type="button"
              onClick={() => handleDismiss(ann.id)}
              className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-black/10 dark:hover:bg-white/10 transition-colors opacity-70 hover:opacity-100 cursor-pointer"
              title="Yopish"
            >
              <X size={15} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

