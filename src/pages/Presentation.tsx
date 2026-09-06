import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Presentation as PresentationIcon, 
  Search, 
  CheckCircle2, 
  Clock, 
  Lock, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  ShieldAlert, 
  ShieldCheck, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  BookOpen,
  Info,
  Check,
  Eye,
  Play,
  CreditCard,
  Unlock,
  AlertCircle
} from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import SEO from '../components/SEO';
import { ALL_39_TOPICS, CurriculumTopic } from '../data/allSemesterTopics';
import { dbService } from '../lib/dbService';
import { formatDocumentUrl } from '../components/TopicLectureEditor';
import { formatPresentationUrl, getPresentationEmbedUrl } from '../lib/uploadHelper';
import { PresentationViewer } from '../components/PresentationViewer';
import PaymentModal from '../components/PaymentModal';

interface PresentationProps {
  user?: any;
  isAdmin?: boolean;
}

export default function Presentation({ user, isAdmin = false }: PresentationProps) {
  const [searchParams] = useSearchParams();
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'has_file' | 'pending'>('all');

  // Active Presentation for Viewer
  const [activeTopic, setActiveTopic] = useState<any | null>(null);
  const [isViewerFullscreen, setIsViewerFullscreen] = useState(false);
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);
  const [securityAlert, setSecurityAlert] = useState<string | null>(null);
  const cinemaContainerRef = useRef<HTMLDivElement | null>(null);

  // Access and purchased semesters state
  const [purchasedSemesters, setPurchasedSemesters] = useState<number[]>([]);
  const [pendingSemesters, setPendingSemesters] = useState<number[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSemesterId, setPaymentSemesterId] = useState<number>(1);
  const [accessLoading, setAccessLoading] = useState(true);

  // Check user access permissions for semesters 1, 2, 3
  const checkAccess = async () => {
    if (isAdmin || user?.isAdmin) {
      setPurchasedSemesters([1, 2, 3]);
      setPendingSemesters([]);
      setAccessLoading(false);
      return;
    }

    if (!user) {
      setPurchasedSemesters([]);
      setPendingSemesters([]);
      setAccessLoading(false);
      return;
    }

    try {
      const unlocked: number[] = [];
      const pending: number[] = [];

      // 1. Direct user object
      const userPurchased = (user.purchasedSemesters || []).map(Number);
      userPurchased.forEach((s: number) => {
        if (!unlocked.includes(s)) unlocked.push(s);
      });

      // 2. Profile check
      try {
        const profile = await dbService.getProfile(user.uid);
        if (profile?.purchasedSemesters) {
          (profile.purchasedSemesters as any[]).map(Number).forEach(s => {
            if (!unlocked.includes(s)) unlocked.push(s);
          });
        }
      } catch (err) {
        console.warn("Error fetching profile access:", err);
      }

      // 3. Payment checks for semesters 1, 2, 3
      for (const sem of [1, 2, 3]) {
        try {
          const p = await dbService.getPayment(user.uid, sem);
          if (p) {
            if (p.status === 'completed' || p.status === 'approved') {
              if (!unlocked.includes(sem)) unlocked.push(sem);
            } else if (p.status === 'pending') {
              if (!unlocked.includes(sem) && !pending.includes(sem)) {
                pending.push(sem);
              }
            }
          }
        } catch (pErr) {
          console.warn(`Error checking payment for semester ${sem}:`, pErr);
        }
      }

      setPurchasedSemesters(unlocked);
      setPendingSemesters(pending);
    } catch (e) {
      console.error("Access verification error:", e);
    } finally {
      setAccessLoading(false);
    }
  };

  useEffect(() => {
    checkAccess();
  }, [user, isAdmin]);

  // Real-time listener on Firestore user doc to immediately unlock upon admin approval
  useEffect(() => {
    if (!user?.uid || isAdmin) return;

    try {
      const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          const list = (data.purchasedSemesters || []).map(Number);
          setPurchasedSemesters(prev => Array.from(new Set([...prev, ...list])));
        }
      }, (err) => {
        console.warn("User onSnapshot error in Presentation:", err);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn("onSnapshot setup error in Presentation:", e);
    }
  }, [user?.uid, isAdmin]);

  const isSemesterUnlocked = (semesterNumber: number): boolean => {
    if (isAdmin || user?.isAdmin) return true;
    if (!user) return false;
    return purchasedSemesters.includes(Number(semesterNumber));
  };

  const handleSelectTopic = (topic: any) => {
    const sem = Number(topic.semester);
    if (!isSemesterUnlocked(sem)) {
      setPaymentSemesterId(sem);
      setShowPaymentModal(true);
      return;
    }
    if (!topic.hasPresentation) return;
    setActiveTopic(topic);
  };

  // Fullscreen API toggle
  const handleToggleFullscreen = () => {
    const isFs = Boolean(document.fullscreenElement || (document as any).webkitFullscreenElement);
    if (!isFs) {
      const el = cinemaContainerRef.current || document.documentElement;
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(err => {
          console.warn("Fullscreen request error:", err);
          setIsViewerFullscreen(true);
        });
      } else if ((el as any).webkitRequestFullscreen) {
        (el as any).webkitRequestFullscreen();
        setIsViewerFullscreen(true);
      } else {
        setIsViewerFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(console.warn);
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
      setIsViewerFullscreen(false);
    }
  };

  const handleClosePresentation = () => {
    if (document.fullscreenElement || (document as any).webkitFullscreenElement) {
      try {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
        }
      } catch (_) {}
    }
    setActiveTopic(null);
    setIsViewerFullscreen(false);
  };

  // Sync fullscreen state
  useEffect(() => {
    const onFsChange = () => {
      const isFs = Boolean(document.fullscreenElement || (document as any).webkitFullscreenElement);
      setIsViewerFullscreen(isFs);
    };

    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);

    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
    };
  }, []);

  // Load existing topics from dbService / Firestore and merge with curriculum
  const loadTopics = async () => {
    try {
      setLoading(true);
      const dbTopics = await dbService.getTopics();
      
      // Merge official 39 topics with Firestore data
      const merged = ALL_39_TOPICS.map(base => {
        const found = dbTopics.find(
          t => Number(t.semester) === Number(base.semester) && Number(t.order) === Number(base.order)
        );
        return {
          ...base,
          ...(found || {}),
          id: found?.id || base.id,
          hasPresentation: Boolean(
            found?.pptxUrl || 
            found?.pdfUrl || 
            found?.customLectureFile?.fileUrl || 
            (found?.lectureType && found.lectureType !== 'text')
          ),
          effectiveLectureType: found?.lectureType || (found?.pptxUrl ? 'pptx' : (found?.pdfUrl ? 'pdf' : 'pptx')),
          effectiveFileUrl: found?.pptxUrl || found?.pdfUrl || found?.customLectureFile?.fileUrl || ''
        };
      });

      setTopics(merged);
    } catch (err) {
      console.error("Failed to load topics for presentations:", err);
      // Fallback to static 39 topics
      setTopics(ALL_39_TOPICS.map(t => ({
        ...t,
        hasPresentation: false,
        effectiveLectureType: 'pptx',
        effectiveFileUrl: ''
      })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopics();
  }, []);

  // Auto-select and open topic from URL query (from Topic lecture page)
  useEffect(() => {
    const topicId = searchParams.get('topicId');
    const semester = searchParams.get('semester');
    const order = searchParams.get('order');

    if (!topicId && !(semester && order)) return;
    if (loading || accessLoading || topics.length === 0) return;

    const matched = topics.find(t => {
      if (topicId && (String(t.id) === String(topicId) || String(t.topicId) === String(topicId))) {
        return true;
      }
      if (semester && order && Number(t.semester) === Number(semester) && Number(t.order) === Number(order)) {
        return true;
      }
      return false;
    });

    if (matched) {
      const sem = Number(matched.semester);
      setSelectedSemester(sem);

      if (!isSemesterUnlocked(sem)) {
        setPaymentSemesterId(sem);
        setShowPaymentModal(true);
        setSecurityAlert(`${sem}-Semestr taqdimotlari qulflangan. Ko'rish uchun obunani faollashtiring.`);
      } else if (matched.hasPresentation) {
        setActiveTopic(matched);
      } else {
        setSecurityAlert(`"${matched.title?.uz || matched.title}" mavzusiga hali taqdimot yuklanmagan.`);
      }
    }
  }, [topics, loading, accessLoading, searchParams]);

  // Global anti-screenshot and shortcut security listener for the presentation viewer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If viewer is open, strictly enforce protections
      if (activeTopic) {
        if (e.key === 'PrintScreen') {
          e.preventDefault();
          try {
            navigator.clipboard.writeText('BSMI ANATOMY - Himoyalangan mualliflik kontenti!');
          } catch (_) {}
          setSecurityAlert("Diqqat: Skrinshot olish cheklangan! Ushbu material mualliflik huquqi bilan himoyalangan.");
          setTimeout(() => setSecurityAlert(null), 4000);
        }

        if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's' || e.key === 'u')) {
          e.preventDefault();
          setSecurityAlert("Taqdimotni saqlash yoki chop etish cheklangan.");
          setTimeout(() => setSecurityAlert(null), 3000);
        }
      }
    };

    const handleWindowBlur = () => {
      if (activeTopic) {
        setIsWindowBlurred(true);
      }
    };

    const handleWindowFocus = () => {
      setIsWindowBlurred(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [activeTopic]);

  // Filtered topics computation
  const filteredTopics = useMemo(() => {
    return topics.filter(t => {
      // Semester filter
      if (selectedSemester !== 'all' && Number(t.semester) !== Number(selectedSemester)) {
        return false;
      }

      // Status filter
      if (statusFilter === 'has_file' && !t.hasPresentation) return false;
      if (statusFilter === 'pending' && t.hasPresentation) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const uz = (t.title?.uz || t.title || '').toLowerCase();
        const section = (t.section || '').toLowerCase();
        const orderStr = String(t.order);
        return uz.includes(query) || section.includes(query) || orderStr === query;
      }

      return true;
    });
  }, [topics, selectedSemester, statusFilter, searchQuery]);

  // Statistics counters
  const totalCount = topics.length;
  const uploadedCount = topics.filter(t => t.hasPresentation).length;
  const pendingCount = totalCount - uploadedCount;

  // Active topic embed URL generator
  const getActiveEmbedUrl = () => {
    if (!activeTopic || !activeTopic.effectiveFileUrl) return '';
    return getPresentationEmbedUrl(activeTopic.effectiveFileUrl, activeTopic.effectiveLectureType);
  };

  return (
    <div className="min-h-screen bg-brand-bg py-12 px-4 sm:px-6 lg:px-8 select-none">
      <SEO 
        title="Odam Anatomiyasi — Taqdimotlar & Ma'ruzalar | BSMI Anatomy"
        description="Barcha 3 semestr bo'yicha 39 ta anatomik mavzularning rasmiy PowerPoint taqdimotlari va ma'ruza konspektlari bazasi."
        keywords="anatomiya taqdimot, odam anatomiyasi pptx, bsmi pptx, tibbiyot taqdimotlar, anatomiya ma'ruza slaydlari"
      />

      {/* Floating Security Alert Toast */}
      {securityAlert && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-rose-600 text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-rose-400 animate-in fade-in slide-in-from-top-4 duration-200">
          <ShieldAlert className="w-5 h-5 shrink-0 animate-bounce" />
          <span className="text-xs font-black tracking-wide uppercase">{securityAlert}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header & Admin Toggle */}
        <div className="bg-gradient-to-br from-slate-900 via-[#0F172A] to-slate-950 rounded-[36px] p-6 sm:p-10 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1.5 bg-brand-accent text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-full shadow-md">
                  Rasmiy Taqdimotlar Bazasi
                </span>
                <span className="px-3.5 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Himoyalangan: Skrinshot & Yuklash Cheklangan
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-sans">
                Odam Anatomiyasi <span className="text-brand-accent">Taqdimotlari</span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Barcha 3 ta semestr bo'yicha 39 ta chuqurlashtirilgan mavzularning PowerPoint (.PPTX) taqdimotlari va ma'ruza slaydlari. Har bir mavzuga mos ravishda rasmiy o'quv materiallari kiritiladi.
              </p>

              {/* Progress and quick stats */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-300">
                <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/10 flex items-center gap-2">
                  <span className="text-slate-400 font-semibold">Jami mavzular:</span>
                  <span className="text-white font-black">{totalCount} ta</span>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Yuklangan taqdimotlar:</span>
                  <span className="text-white font-black">{uploadedCount} ta</span>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Kutilayotganlar:</span>
                  <span className="text-white font-black">{pendingCount} ta</span>
                </div>

                {/* Real-time Access Status Badge */}
                <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/15 flex items-center gap-2">
                  {isAdmin || user?.isAdmin ? (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300 font-bold">Admin: Barcha 3 semestr ochiq</span>
                    </>
                  ) : purchasedSemesters.length > 0 ? (
                    <>
                      <Unlock className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300 font-bold">
                        Ochiq: {purchasedSemesters.sort((a, b) => a - b).map(s => `${s}-Semestr`).join(', ')}
                      </span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-300 font-bold">Semestrlar qulflangan</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-6 rounded-[32px] border border-brand-border shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Semester Tabs with Lock/Unlock Indicators */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setSelectedSemester('all')}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  selectedSemester === 'all'
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Barchasi (39)
              </button>
              {[1, 2, 3].map((sem) => {
                const unlocked = isSemesterUnlocked(sem);
                return (
                  <button
                    key={sem}
                    type="button"
                    onClick={() => setSelectedSemester(sem)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                      selectedSemester === sem
                        ? 'bg-brand-primary text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{sem}-Semestr (13)</span>
                    {unlocked ? (
                      <CheckCircle2 className={`w-3.5 h-3.5 ${selectedSemester === sem ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    ) : (
                      <Lock className={`w-3.5 h-3.5 ${selectedSemester === sem ? 'text-amber-400' : 'text-amber-600'}`} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={statusFilter}
                onChange={(e: any) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-brand-accent cursor-pointer"
              >
                <option value="all">Barcha holatdagi mavzular</option>
                <option value="has_file">Faqat taqdimoti yuklanganlar</option>
                <option value="pending">Faqat kutilayotganlar</option>
              </select>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Mavzu nomi yoki raqami bo'yicha qidirish (masalan: 12, Orqa miya, Kalla, Suyaklar...)"
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-accent focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 hover:text-slate-600"
              >
                Tozalash
              </button>
            )}
          </div>
        </div>

        {/* Topics Presentation Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-bold text-slate-500">Mavzular va taqdimotlar yuklanmoqda...</p>
          </div>
        ) : filteredTopics.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[32px] border border-brand-border p-8">
            <PresentationIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Mavzular topilmadi</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Qidiruv so'zini o'zgartirib ko'ring yoki boshqa semestr bo'limiga o'ting.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTopics.map((topic, index) => {
              const hasFile = topic.hasPresentation;
              const isPptx = topic.effectiveLectureType === 'pptx';
              const semNum = Number(topic.semester);
              const isUnlocked = isSemesterUnlocked(semNum);
              const isPending = pendingSemesters.includes(semNum);

              return (
                <motion.div
                  key={`${topic.semester}_${topic.order}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`rounded-[30px] p-6 border transition-all flex flex-col justify-between group relative overflow-hidden ${
                    !isUnlocked
                      ? 'bg-slate-50/90 border-slate-200/90 hover:border-amber-400/80 hover:shadow-lg'
                      : hasFile 
                      ? 'bg-white border-brand-border shadow-sm hover:border-brand-accent/60 hover:shadow-xl' 
                      : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white">
                        {topic.semester}-Semestr • {topic.order}-Mavzu
                      </span>

                      {!isUnlocked ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-300/80 flex items-center gap-1 shadow-sm">
                          <Lock className="w-3 h-3 text-amber-600" />
                          <span>Qulflangan</span>
                        </span>
                      ) : hasFile ? (
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                          isPptx ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          <CheckCircle2 className="w-3 h-3" />
                          {isPptx ? 'PowerPoint (.pptx)' : 'PDF Taqdimot'}
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider bg-slate-200 text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Kutilmoqda
                        </span>
                      )}
                    </div>

                    {/* Module / Section */}
                    <p className="text-[11px] font-bold text-brand-accent uppercase tracking-wider mb-1 line-clamp-1">
                      {topic.section}
                    </p>

                    {/* Topic Title */}
                    <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug line-clamp-3 mb-4 group-hover:text-brand-accent transition-colors">
                      {topic.title?.uz || topic.title}
                    </h3>
                  </div>

                  {/* Actions Bottom Bar */}
                  <div className="pt-4 border-t border-slate-100 flex items-center">
                    {!isUnlocked ? (
                      isPending ? (
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentSemesterId(semNum);
                            setShowPaymentModal(true);
                          }}
                          className="w-full py-3.5 px-4 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md bg-orange-500 hover:bg-orange-600 text-white animate-pulse"
                        >
                          <Clock className="w-4 h-4" />
                          <span>To'lov kutilmoqda</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setPaymentSemesterId(semNum);
                            setShowPaymentModal(true);
                          }}
                          className="w-full py-3.5 px-4 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md bg-slate-900 hover:bg-black text-amber-400 hover:text-amber-300 border border-amber-400/30 group/lockbtn"
                        >
                          <Lock className="w-4 h-4 text-amber-400 group-hover/lockbtn:scale-110 transition-transform" />
                          <span>{topic.semester}-Semestrni Ochish</span>
                        </button>
                      )
                    ) : hasFile ? (
                      <button
                        type="button"
                        onClick={() => handleSelectTopic(topic)}
                        className={`w-full py-3.5 px-4 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                          isPptx 
                            ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20' 
                            : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Namoyish Qilish</span>
                      </button>
                    ) : (
                      <div className="w-full py-3 px-4 rounded-2xl bg-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-not-allowed">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Tez kunda kiritiladi</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* PROTECTED PRESENTATION CINEMA VIEWER (FULLSCREEN / THEATER) */}
      {/* ========================================================================= */}
      {activeTopic && (
        <div 
          ref={cinemaContainerRef}
          className={`fixed inset-0 ${isViewerFullscreen ? 'z-[999999]' : 'z-50'} bg-slate-950 flex flex-col protected-presentation`}
          onContextMenu={(e) => {
            e.preventDefault();
            setSecurityAlert("Sichqonchaning o'ng tugmasi taqdimot xavfsizligi sababli cheklangan.");
            setTimeout(() => setSecurityAlert(null), 3000);
          }}
          onDragStart={(e) => e.preventDefault()}
        >
          {/* Anti-Screen Capture Blur Shield */}
          {isWindowBlurred && (
            <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center text-white">
              <Lock className="w-14 h-14 text-amber-400 mb-4 animate-bounce" />
              <h3 className="text-xl font-black uppercase tracking-tight">Xavfsizlik Himoyasi Faol</h3>
              <p className="text-xs text-slate-400 max-w-md mt-2 leading-relaxed">
                Oyna faol bo'lmaganda yoki skrinshot vositasi ishga tushganda taqdimot kontenti avtomatik ravishda yashiriladi. Taqdimotni davom ettirish uchun ekranga bosing.
              </p>
              <button
                type="button"
                onClick={() => setIsWindowBlurred(false)}
                className="mt-6 px-6 py-3 bg-brand-accent text-brand-primary rounded-2xl text-xs font-black uppercase tracking-wider cursor-pointer"
              >
                Davom etish
              </button>
            </div>
          )}

          {/* Dynamic Watermark Overlay */}
          <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden flex flex-wrap items-center justify-center gap-24 opacity-[0.04] text-white font-black text-sm uppercase rotate-[-25deg] select-none">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className="whitespace-nowrap tracking-widest">
                BSMI ANATOMY • RASMIY TAQDIMOT • SKRINSHOT VA YUKLASH TAQIQLANGAN
              </span>
            ))}
          </div>

          {/* Native High-Performance Presentation & PDF Cinema Viewer */}
          {(() => {
            const currentIdx = filteredTopics.findIndex(
              t => Number(t.semester) === Number(activeTopic.semester) && Number(t.order) === Number(activeTopic.order)
            );
            return (
              <PresentationViewer
                fileUrl={activeTopic.effectiveFileUrl}
                fileType={activeTopic.effectiveLectureType}
                title={activeTopic.title?.uz || activeTopic.title}
                semester={Number(activeTopic.semester)}
                order={Number(activeTopic.order)}
                isFullscreen={isViewerFullscreen}
                onToggleFullscreen={handleToggleFullscreen}
                onClose={handleClosePresentation}
                onPrevTopic={currentIdx > 0 ? () => {
                  const prevTopic = filteredTopics[currentIdx - 1];
                  if (prevTopic) {
                    if (!isSemesterUnlocked(Number(prevTopic.semester))) {
                      setSecurityAlert(`${prevTopic.semester}-Semestr taqdimotlari qulflangan. Obunani faollashtiring.`);
                      setPaymentSemesterId(Number(prevTopic.semester));
                      setShowPaymentModal(true);
                      handleClosePresentation();
                      return;
                    }
                    setActiveTopic(prevTopic);
                  }
                } : undefined}
                hasPrevTopic={currentIdx > 0}
                onNextTopic={currentIdx >= 0 && currentIdx < filteredTopics.length - 1 ? () => {
                  const nextTopic = filteredTopics[currentIdx + 1];
                  if (nextTopic) {
                    if (!isSemesterUnlocked(Number(nextTopic.semester))) {
                      setSecurityAlert(`${nextTopic.semester}-Semestr taqdimotlari qulflangan. Obunani faollashtiring.`);
                      setPaymentSemesterId(Number(nextTopic.semester));
                      setShowPaymentModal(true);
                      handleClosePresentation();
                      return;
                    }
                    setActiveTopic(nextTopic);
                  }
                } : undefined}
                hasNextTopic={currentIdx >= 0 && currentIdx < filteredTopics.length - 1}
                canAnnotate={isAdmin}
              />
            );
          })()}
        </div>
      )}

      {/* Semester Subscription & Payment Modal */}
      {showPaymentModal && (
        <PaymentModal 
          semesterId={paymentSemesterId} 
          user={user}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={async () => {
            setShowPaymentModal(false);
            await checkAccess();
          }}
        />
      )}
    </div>
  );
}
