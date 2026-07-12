import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { dbService, isSupabaseEnabled, isAppwriteEnabled } from '../lib/dbService';
import { Announcement } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Megaphone, X, Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

export default function AnnouncementBar() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [closedIds, setClosedIds] = useState<string[]>([]);

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

  const visibleAnnouncements = announcements.filter(a => !closedIds.includes(a.id));

  if (visibleAnnouncements.length === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-6">
      <AnimatePresence>
        {visibleAnnouncements.map((ann, index) => (
          <motion.div
            key={ann.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`mb-4 p-6 rounded-[32px] border-2 shadow-2xl flex items-start gap-4 overflow-hidden relative group backdrop-blur-xl ${
              ann.type === 'danger' ? 'bg-red-50/90 border-red-200 text-red-900' :
              ann.type === 'warning' ? 'bg-orange-50/90 border-orange-200 text-orange-900' :
              ann.type === 'success' ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900' :
              'bg-blue-50/90 border-blue-200 text-blue-900'
            }`}
            style={{ 
              zIndex: visibleAnnouncements.length - index,
              transformOrigin: 'bottom center'
            }}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              ann.type === 'danger' ? 'bg-red-100' :
              ann.type === 'warning' ? 'bg-orange-100' :
              ann.type === 'success' ? 'bg-emerald-100' :
              'bg-blue-100'
            }`}>
              {ann.type === 'danger' && <AlertCircle size={24} />}
              {ann.type === 'warning' && <AlertTriangle size={24} />}
              {ann.type === 'success' && <CheckCircle size={24} />}
              {ann.type === 'info' && <Megaphone size={24} />}
            </div>

            <div className="flex-grow pr-8">
              <h4 className="font-black text-sm uppercase tracking-tighter mb-1">{ann.title}</h4>
              <p className="text-[13px] font-medium leading-relaxed opacity-90">{ann.content}</p>
            </div>

            <button 
              onClick={() => setClosedIds([...closedIds, ann.id])}
              className="absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center hover:bg-black/5 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Decorative background element */}
            <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
              <Megaphone size={100} strokeWidth={3} />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
