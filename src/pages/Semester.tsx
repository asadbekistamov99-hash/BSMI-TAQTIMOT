import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Topic, MidtermFile, Semester as SemesterType } from '../types';
import { dbService, isSupabaseEnabled } from '../lib/dbService';
import { SEMESTER_1_TOPICS, SEMESTER_2_TOPICS, SEMESTER_3_TOPICS } from '../constants';
import { SEMESTER_1_DETAILED_TOPICS } from '../data/semester1TopicsData';
import { SEMESTER_2_DETAILED_TOPICS } from '../data/semester2TopicsData';
import { SEMESTER_3_DETAILED_TOPICS } from '../data/semester3TopicsData';
import { ChevronRight, PlayCircle, FileText, CheckCircle2, Lock, Sparkles, Clock, Award, Download, X, Loader2, CreditCard, ShieldCheck, AlertCircle } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';
import { useSettings } from '../hooks/useSettings';
import { useLanguage } from '../hooks/useLanguage';
import SEO from '../components/SEO';

function MidtermDownloader({ fileUrl, fileName }: { fileUrl: string, fileName: string }) {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const startDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (downloading) return;

    setDownloading(true);
    setProgress(0);
    setError(null);

    try {
      console.log("Downloader: Fetching file contents...");

      // Fast direct download for Data URLs
      if (fileUrl.startsWith('data:')) {
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setProgress(100);
        setDownloading(false);
        return;
      }

      let finalUrl = fileUrl;
      if (fileUrl && fileUrl.startsWith('http') && !fileUrl.includes(window.location.host)) {
        finalUrl = `/api/proxy?url=${encodeURIComponent(fileUrl)}`;
      }
      const response = await fetch(finalUrl);
      if (!response.ok) throw new Error("Faylni yuklab olishda xatolik");

      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      
      if (!response.body) throw new Error("Fayl oqimi mavjud emas");
      
      const reader = response.body.getReader();
      let loaded = 0;
      const chunks = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        chunks.push(value);
        loaded += value.length;

        if (total > 0) {
          setProgress(Math.round((loaded / total) * 100));
        }
      }

      const blob = new Blob(chunks);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setDownloading(false);
    } catch (err: any) {
      console.warn("Downloader: Fetch failed (likely CORS), switching to direct browser download:", err);
      // Fallback: Just open the link in a new tab if JS fetch is blocked
      window.open(fileUrl, '_blank');
      setDownloading(false);
    }
  };

  return (
    <div className="relative group">
      <div 
        onClick={startDownload}
        className="block bg-[#0E1624] text-white p-8 rounded-[32px] border-4 border-brand-accent shadow-2xl hover:scale-[1.02] transition-all cursor-pointer overflow-hidden relative"
      >
        <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:opacity-20 transition-opacity">
          <Award size={200} />
        </div>
        
        {downloading && (
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: `${progress}%` }}
             className="absolute bottom-0 left-0 h-2 bg-brand-accent z-20 shadow-[0_0_15px_rgba(255,215,0,0.8)]"
           />
        )}

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-brand-accent text-brand-primary rounded-full text-[9px] font-black uppercase tracking-widest">
                {downloading ? `YUKLANMOQDA: ${progress}%` : t('study.unlocked').toUpperCase()}
              </span>
              <span className="px-3 py-1 bg-white/10 text-white/60 rounded-full text-[9px] font-black uppercase tracking-widest">
                Hujjat (PDF/DOCX)
              </span>
              {error && <span className="px-3 py-1 bg-red-500/20 text-red-300 rounded-full text-[9px] font-black uppercase tracking-widest">{error}</span>}
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">
              {fileName}
            </h3>
            <p className="text-white/50 text-sm font-medium italic">
              {downloading ? "Fayl qurilmangizga saqlanmoqda..." : t('topic.video_desc')}
            </p>
          </div>
          <div className={`w-16 h-16 bg-brand-accent rounded-2xl flex items-center justify-center text-brand-primary shadow-lg shadow-brand-accent/30 ${downloading ? 'animate-pulse' : 'group-hover:rotate-12 transition-transform'}`}>
            {downloading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Download size={32} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Semester({ isAdmin: isAdminProp, user }: { isAdmin?: boolean, user?: any }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const semesterId = Number(id);
  const { settings } = useSettings();
  const { t, getLocalized } = useLanguage();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [semesterInfo, setSemesterInfo] = useState<SemesterType | null>(null);
  const [midtermFile, setMidtermFile] = useState<MidtermFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const isAdmin = isAdminProp ?? !!localStorage.getItem('adminToken');

  useEffect(() => {
    const fetchSemesterInfo = async () => {
      try {
        const sems = await dbService.getSemesters();
        const sem = sems.find((s: any) => s.number === semesterId);
        if (sem) {
          setSemesterInfo(sem);
        }
      } catch (err) {
        console.error("Error fetching semester info:", err);
      }
    };

    const checkPayment = async () => {
      setIsPaid(false);
      setIsPending(false);

      if (!user) {
        return;
      }
      
      try {
        // 1. Check Profile for access list
        const profile = await dbService.getProfile(user.uid);
        if (profile) {
          const purchased = (profile.purchasedSemesters || []).map(Number);
          if (purchased.includes(Number(semesterId))) {
            setIsPaid(true);
            setIsPending(false);
            return;
          }
        }

        // 2. Check individual payment record for THIS semesterId
        const payment = await dbService.getPayment(user.uid, semesterId);
        if (payment) {
          if (payment.status === 'completed' || payment.status === 'approved') {
            setIsPaid(true);
            setIsPending(false);
            return;
          } else if (payment.status === 'pending') {
            setIsPending(true);
            setIsPaid(false);
            return;
          }
        }
      } catch (e) {
        console.error("Error checking user access:", e);
      }
    };

    const getFallbackTopics = (sem: number): Topic[] => {
      if (sem === 1) return SEMESTER_1_DETAILED_TOPICS;
      if (sem === 2) return SEMESTER_2_DETAILED_TOPICS;
      if (sem === 3) return SEMESTER_3_DETAILED_TOPICS;
      return [];
    };

    const fetchTopics = async () => {
      setLoading(true);
      try {
        const realTopics = await dbService.getTopics(semesterId);
        const detailedList = getFallbackTopics(semesterId);
        
        if (realTopics.length === 0) {
          if (isAdmin && (semesterId === 1 || semesterId === 2 || semesterId === 3)) {
            await seedTopics(semesterId);
            const freshTopics = await dbService.getTopics(semesterId);
            setTopics(freshTopics.length > 0 ? freshTopics : detailedList);
          } else {
            setTopics(detailedList);
          }
        } else {
          // Merge with detailed medical curriculum if real topic has sparse/placeholder theory
          const enrichedRealTopics = realTopics.map(t => {
            const match = detailedList.find(d => d.order === t.order);
            if (match && (!t.theory?.uz || t.theory.uz.length < 150)) {
              return {
                ...t,
                theory: match.theory,
                title: t.title?.uz ? t.title : match.title
              };
            }
            return t;
          });
          setTopics(enrichedRealTopics);
        }
      } catch (error) {
        console.error("Error loading topics:", error);
        setTopics(getFallbackTopics(semesterId));
      } finally {
        setLoading(false);
      }
    };

    const fetchMidtermFile = async () => {
      try {
        if (!isSupabaseEnabled()) {
          const { doc, getDoc } = await import('firebase/firestore');
          const { db } = await import('../lib/firebase');
          const docRef = doc(db, 'midterms', `midterm_${semesterId}`);
          const snapshot = await getDoc(docRef);
          if (snapshot.exists()) {
            setMidtermFile({ id: snapshot.id, ...snapshot.data() } as MidtermFile);
          } else {
            setMidtermFile(null);
          }
        } else {
          setMidtermFile(null);
        }
      } catch (error) {
        console.error("Error fetching midterm file:", error);
      }
    };

    const init = async () => {
      await fetchSemesterInfo();
      await checkPayment();
      await fetchTopics();
      await fetchMidtermFile();
    };

    init();
  }, [semesterId, user, isAdmin]);

  const seedTopics = async (sem: number) => {
    const list = sem === 1 ? SEMESTER_1_DETAILED_TOPICS : sem === 2 ? SEMESTER_2_DETAILED_TOPICS : sem === 3 ? SEMESTER_3_DETAILED_TOPICS : [];
    if (!list || list.length === 0) return;

    for (const t of list) {
      try {
        await dbService.saveTopic(null, {
          semester: sem,
          order: t.order,
          title: t.title,
          theory: t.theory,
          latinTerms: t.latinTerms || [],
          image: t.image || "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=2670&auto=format&fit=crop",
          videos: t.videos || []
        });
      } catch (err) {
        console.warn(`Topic seeding failed for sem ${sem} index`, t.order, err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent"></div>
      </div>
    );
  }

  const isUnlocked = isPaid;

  return (
    <div className="py-16 bg-brand-bg min-h-screen">
      <SEO 
        title={`${getLocalized(semesterInfo?.title) || `${semesterId}-Semestr: Odam Anatomiyasi`} | BSMI Anatomy`}
        description={getLocalized(semesterInfo?.description) || `BSMI ${semesterId}-semestr bo'yicha to'liq nazariy darsliklar, mavzular va interaktiv testlar.`}
        keywords={`semestr ${semesterId}, anatomiya ${semesterId}-semestr, bsmi anatomiya, osteologiya, splanxnologiya, nevrologiya`}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 border-l-8 border-brand-accent pl-8 py-2 relative">
          <Link to="/" className="text-xs font-black text-brand-accent hover:text-brand-primary transition-all flex items-center gap-1 mb-6 uppercase tracking-[0.2em]">
            ← {t('quiz.home').toUpperCase()}
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-brand-primary tracking-tight uppercase">
                {getLocalized(semesterInfo?.title) || `${semesterId}-${t('nav.semester1').split('1')[1] || 'SEMESTER'}`}
              </h1>
              <p className="text-brand-muted mt-3 text-lg font-medium">
                {getLocalized(semesterInfo?.description) || t('home.hero_desc')}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {isPaid ? (
                <div className="flex items-center gap-2">
                  <div className="px-5 py-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 font-black rounded-2xl text-xs uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Obuna faollashtirilgan
                  </div>
                  <button 
                    onClick={() => setShowPaymentModal(true)} 
                    className="px-4 py-3 bg-white border border-brand-border text-brand-primary font-bold rounded-2xl text-xs hover:bg-slate-50 transition-all flex items-center gap-2"
                  >
                    <CreditCard className="w-3.5 h-3.5" /> To'lov cheki
                  </button>
                </div>
              ) : isPending ? (
                <button 
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-7 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-orange-500/20 flex items-center gap-2 animate-pulse"
                >
                  <Clock className="w-4 h-4" /> To'lov kutilmoqda (Admin tasdiqlashi)
                </button>
              ) : (
                <button 
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-brand-accent text-brand-primary px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-accent/20 flex items-center gap-3"
                >
                  <CreditCard className="w-4 h-4" /> Sotib olish — {settings.priceUZS.toLocaleString()} UZS
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Prominent Purchase / Subscription Callout Card */}
        {!isPaid && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 sm:p-8 rounded-[32px] bg-gradient-to-br from-slate-900 via-[#0E1624] to-slate-950 text-white border-2 border-brand-accent/40 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 bg-brand-accent text-brand-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                    {semesterId}-Semestr to'liq kursi
                  </span>
                  {isPending ? (
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-500/40 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                      <Clock className="w-3 h-3 animate-pulse" /> To'lov kutilmoqda
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-brand-accent" /> Sotib olish talab etiladi
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
                  {semesterId === 3 
                    ? "Markaziy asab tizimi va sezgi a'zolari" 
                    : semesterId === 2 
                    ? "Ichki a'zolar va tizimlar" 
                    : "Tayanch-harakat tizimi"} to'liq darslik va testlari
                </h3>
                <p className="text-white/70 text-xs sm:text-sm max-w-2xl leading-relaxed">
                  Barcha 13 ta chuqurlashtirilgan mavzu konspektlari, lotin terminologiyasi, video darslar, interaktiv test savollari va yakuniy imtihon sinovlaridan to'liq foydalanish uchun obunani faollashtiring.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
                <div className="text-left md:text-right">
                  <span className="text-[10px] uppercase font-black tracking-widest text-white/50 block">Kurs narxi</span>
                  <span className="text-2xl sm:text-3xl font-black text-brand-accent tracking-tight">{settings.priceUZS.toLocaleString()} UZS</span>
                </div>
                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full sm:w-auto px-8 py-4 bg-brand-accent hover:bg-amber-400 text-brand-primary font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-brand-accent/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5"
                >
                  <CreditCard className="w-4 h-4" />
                  {isPending ? "To'lov arizasini ko'rish" : "Hoziroq sotib olish"}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 gap-4 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4"
          >
            {midtermFile ? (
              <MidtermDownloader 
                fileUrl={midtermFile.fileUrl} 
                fileName={midtermFile.fileName || "midterm_file"} 
              />
            ) : (
              <Link 
                to={isUnlocked ? `/quiz/midterm_${semesterId}` : "#"}
                onClick={(e) => {
                  if (!isUnlocked) {
                    e.preventDefault();
                    setShowPaymentModal(true);
                  }
                }}
                className="block bg-[#0E1624] text-white p-6 sm:p-8 rounded-[32px] border-4 border-brand-accent shadow-2xl hover:scale-[1.02] transition-all group overflow-hidden relative cursor-pointer"
              >
                <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Award size={200} />
                </div>
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-brand-accent text-brand-primary rounded-full text-[9px] font-black uppercase tracking-widest">
                        {t('study.topics_list')}
                      </span>
                      <span className="px-3 py-1 bg-white/10 text-white/60 rounded-full text-[9px] font-black uppercase tracking-widest">
                        {semesterId}-Semester
                      </span>
                      {!isUnlocked && (
                        <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Qulflangan
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter mb-2">
                      {semesterId === 2 
                        ? 'OG\'ZAKI IMTIHON SAVOLLARI / EXAM QUESTIONS' 
                        : semesterId === 3 
                        ? 'MARKAZIY ASAB TIZIMI VA SEZGI A’ZOLARI — YAKUNIY IMTIHON TESTI' 
                        : 'IMTIHON TEST SINAGI / FINAL EXAM QUIZ'}
                    </h3>
                    <p className="text-white/50 text-sm font-medium">
                      {!isUnlocked ? "Testni topshirish uchun 3-semestr obunasini faollashtiring (Bosing)" : t('study.pay_desc')}
                    </p>
                  </div>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-accent rounded-2xl flex items-center justify-center text-brand-primary shrink-0">
                    {!isUnlocked ? <Lock size={28} /> : <Award size={32} />}
                  </div>
                </div>
              </Link>
            )}
          </motion.div>

          {topics.map((topic, idx) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.01, y: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: idx * 0.02 }}
            >
              <div 
                onClick={() => {
                  if (!isUnlocked) {
                    setShowPaymentModal(true);
                  } else {
                    navigate(`/topic/${topic.id}`);
                  }
                }}
                className={`block p-5 rounded-2xl border transition-all cursor-pointer ${
                  !isUnlocked 
                    ? "bg-slate-50/80 border-slate-200 hover:border-brand-accent hover:bg-white hover:shadow-lg" 
                    : "bg-white border-brand-border shadow-sm hover:border-brand-accent hover:shadow-xl hover:shadow-brand-accent/5"
                } group`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg transition-all border ${
                      !isUnlocked 
                        ? "bg-slate-100 text-slate-400 border-slate-200 group-hover:bg-brand-accent group-hover:text-brand-primary group-hover:border-brand-accent" 
                        : "bg-slate-50 text-brand-primary border-brand-border group-hover:bg-brand-accent group-hover:text-brand-primary group-hover:border-brand-accent"
                    }`}>
                      {topic.order}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base sm:text-lg font-bold text-brand-primary tracking-tight group-hover:text-brand-accent transition-colors">
                          {getLocalized(topic.title)}
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-[10px] text-brand-muted font-black tracking-widest uppercase">
                        <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-brand-accent" /> {t('topic.theory').toUpperCase()}</span>
                        <span className="flex items-center gap-1.5"><PlayCircle className="w-3.5 h-3.5 text-brand-accent" /> {t('topic.video').toUpperCase()}</span>
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {t('quiz.questions').toUpperCase()}</span>
                        {!isUnlocked && (
                          <span className="flex items-center gap-1 text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full font-bold">
                            <Lock className="w-3 h-3" /> Sotib olish uchun bosing
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-brand-accent transition-all shrink-0">
                    {isUnlocked ? (
                      <ChevronRight className="w-5 h-5 text-brand-muted group-hover:text-brand-primary transition-all" />
                    ) : (
                      <Lock className="w-4 h-4 text-amber-600 group-hover:text-brand-primary" />
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal 
          semesterId={semesterId} 
          user={user}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={async () => {
            setShowPaymentModal(false);
            if (user) {
              try {
                const profile = await dbService.getProfile(user.uid);
                const payment = await dbService.getPayment(user.uid, semesterId);
                const purchased = (profile?.purchasedSemesters || []).map(Number);
                if (purchased.includes(Number(semesterId)) || payment?.status === 'completed' || payment?.status === 'approved') {
                  setIsPaid(true);
                  setIsPending(false);
                } else if (payment?.status === 'pending') {
                  setIsPending(true);
                  setIsPaid(false);
                }
              } catch (e) {
                console.error("Error refreshing payment status:", e);
              }
            }
          }}
        />
      )}
    </div>
  );
}
