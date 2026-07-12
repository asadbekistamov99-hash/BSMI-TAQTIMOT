import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Topic, MidtermFile, Semester as SemesterType } from '../types';
import { dbService, isSupabaseEnabled } from '../lib/dbService';
import { SEMESTER_1_TOPICS, SEMESTER_2_TOPICS } from '../constants';
import { ChevronRight, PlayCircle, FileText, CheckCircle2, Lock, Sparkles, Clock, Award, Download, X, Loader2 } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';
import { useSettings } from '../hooks/useSettings';
import { useLanguage } from '../hooks/useLanguage';

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
          // If the student has any active subscription whose duration has not expired, grant full access
          if (profile.expiryDate) {
            let expiryDate: Date | null = null;
            if (typeof profile.expiryDate.toDate === 'function') {
              expiryDate = profile.expiryDate.toDate();
            } else if (profile.expiryDate.seconds !== undefined) {
              expiryDate = new Date(profile.expiryDate.seconds * 1000);
            } else {
              expiryDate = new Date(profile.expiryDate);
            }
            if (expiryDate && expiryDate > new Date()) {
              setIsPaid(true);
              setIsPending(false);
              return;
            }
          }

          if (profile.purchasedSemesters && profile.purchasedSemesters.includes(semesterId)) {
            setIsPaid(true);
            setIsPending(false);
            return;
          }
        }

        // 2. Check individual payment record
        const payment = await dbService.getPayment(user.uid, semesterId);
        if (payment) {
          if (payment.status === 'completed' || payment.status === 'approved') {
            setIsPaid(true);
            setIsPending(false);
          } else if (payment.status === 'pending') {
            setIsPending(true);
            setIsPaid(false);
          }
        }
      } catch (e) {
        console.error("Error checking user access:", e);
      }
    };

    const fetchTopics = async () => {
      setLoading(true);
      try {
        const realTopics = await dbService.getTopics(semesterId);
        
        if (realTopics.length === 0 && isAdmin && (semesterId === 1 || semesterId === 2)) {
          await seedTopics(semesterId);
          const freshTopics = await dbService.getTopics(semesterId);
          setTopics(freshTopics);
        } else {
          setTopics(realTopics);
        }
      } catch (error) {
        console.error("Error loading topics:", error);
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
    const topicsToSeed = sem === 1 ? SEMESTER_1_TOPICS : SEMESTER_2_TOPICS;
    
    for (let index = 0; index < topicsToSeed.length; index++) {
      const title = topicsToSeed[index];
      try {
        await dbService.saveTopic(null, {
          semester: sem,
          order: index + 1,
          title: { uz: title, ru: title, en: title },
          theory: {
            uz: `Bu mavzu bo‘yicha nazariy ma'lumotlar tez orada yuklanadi. ${title} haqida batafsil o'rganish uchun darslikdan foydalaning.`,
            en: `Theoretical contents for ${title} will be uploaded soon. Please consult textbooks for further details.`,
            ru: `Теоретические материалы к разделу ${title} будут добавлены в ближайшее время. Сверяйтесь с атласом.`
          },
          latinTerms: [],
          image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2670&auto=format&fit=crop",
          videos: []
        });
      } catch (err) {
        console.warn("Topic seeding failed for index", index, err);
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

  const isUnlocked = isAdmin || isPaid;

  return (
    <div className="py-16 bg-brand-bg min-h-screen">
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
            {!isUnlocked && (
              <button 
                onClick={() => setShowPaymentModal(true)}
                className="bg-brand-accent text-brand-primary px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-brand-accent/20 flex items-center gap-3"
              >
                <Sparkles className="w-5 h-5" /> {t('study.subscribe').toUpperCase()}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 relative">
          {!isUnlocked && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-8 text-center bg-white/40 backdrop-blur-[2px] rounded-[40px] border-4 border-dashed border-brand-border">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
                {isPending ? (
                  <Clock className="w-10 h-10 text-orange-500 animate-pulse" />
                ) : (
                  <Lock className="w-10 h-10 text-brand-accent" />
                )}
              </div>
              <h3 className="text-2xl font-black text-brand-primary tracking-tighter uppercase mb-4">
                {isPending ? t('study.pending') : t('quiz.locked_title')}
              </h3>
              <p className="text-brand-muted font-medium max-w-sm mb-8">
                {isPending 
                  ? t('study.status_pending_desc')
                  : t('topic.locked_alert')}
              </p>
              {!isPending && (
                <button 
                  onClick={() => setShowPaymentModal(true)}
                  className="bg-brand-primary text-white px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-[0.2em] shadow-2xl hover:bg-slate-800 transition-all"
                >
                  {t('study.verify_btn')} — {settings.priceUZS.toLocaleString()} UZS
                </button>
              )}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={!isUnlocked ? "opacity-20 grayscale pointer-events-none" : "mb-8"}
          >
            {midtermFile ? (
              <MidtermDownloader 
                fileUrl={midtermFile.fileUrl} 
                fileName={midtermFile.fileName || "midterm_file"} 
              />
            ) : (
              <Link 
                to={isUnlocked ? `/quiz/midterm_${semesterId}` : "#"}
                className="block bg-[#0E1624] text-white p-8 rounded-[32px] border-4 border-brand-accent shadow-2xl hover:scale-[1.02] transition-all group overflow-hidden relative"
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
                        {semesterId === 1 ? '1-Semester' : '2-Semester'}
                      </span>
                    </div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">
                      {semesterId === 2 ? 'OG\'ZAKI IMTIHON SAVOLLARI / EXAM QUESTIONS' : 'IMTIHON TEST SINAGI / FINAL EXAM QUIZ'}
                    </h3>
                    <p className="text-white/50 text-sm font-medium">{t('study.pay_desc')}</p>
                  </div>
                  <div className="w-16 h-16 bg-brand-accent rounded-2xl flex items-center justify-center text-brand-primary">
                    <Award size={32} />
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
              whileHover={isUnlocked ? { scale: 1.01, y: -2 } : {}}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: idx * 0.03 }}
              className={!isUnlocked ? "opacity-40 grayscale pointer-events-none" : ""}
            >
              <Link 
                to={isUnlocked ? `/topic/${topic.id}` : "#"}
                className="block bg-white p-5 rounded-2xl border border-brand-border shadow-sm hover:border-brand-accent hover:shadow-xl hover:shadow-brand-accent/5 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-brand-primary font-black text-lg group-hover:bg-brand-accent group-hover:text-brand-primary transition-all border border-brand-border group-hover:border-brand-accent">
                      {topic.order}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-brand-primary tracking-tight group-hover:text-brand-accent transition-colors">
                        {getLocalized(topic.title)}
                      </h3>
                      <div className="flex items-center gap-6 mt-2 text-[10px] text-brand-muted font-black tracking-widest uppercase">
                        <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-brand-accent" /> {t('topic.theory').toUpperCase()}</span>
                        <span className="flex items-center gap-1.5"><PlayCircle className="w-3.5 h-3.5 text-brand-accent" /> {t('topic.video').toUpperCase()}</span>
                        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {t('quiz.questions').toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-brand-accent transition-all">
                    {isUnlocked ? (
                      <ChevronRight className="w-5 h-5 text-brand-muted group-hover:text-brand-primary transition-all" />
                    ) : (
                      <Lock className="w-4 h-4 text-brand-muted" />
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {showPaymentModal && (
        <PaymentModal 
          semesterId={semesterId} 
          user={user}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
