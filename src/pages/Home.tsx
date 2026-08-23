import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  GraduationCap, 
  Microscope, 
  ClipboardList, 
  ChevronRight, 
  Lock, 
  Clock, 
  Sparkles, 
  Award, 
  CheckCircle, 
  TrendingUp,
  ShieldCheck,
  Target,
  Trophy,
  FileText,
  Layers,
  Box
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { dbService } from '../lib/dbService';
import { useSettings } from '../hooks/useSettings';
import { useLanguage } from '../hooks/useLanguage';
import { Semester } from '../types';
import { parseDate } from '../lib/dateUtils';
import ResumeLastViewedBanner from '../components/ResumeLastViewedBanner';
import UserProgressSection from '../components/UserProgressSection';
import WeeklyStudyGoals from '../components/WeeklyStudyGoals';
import SEO from '../components/SEO';

export default function Home({ isAdmin: isAdminProp, user }: { isAdmin?: boolean, user?: any }) {
  const { settings } = useSettings();
  const { t, language, getLocalized } = useLanguage();
  const [userPayments, setUserPayments] = useState<Record<number, { status: string, createdAt: any }>>({});
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [topicsCounts, setTopicsCounts] = useState<Record<number, number>>({ 1: 13, 2: 13, 3: 13 });
  const [completedTopics, setCompletedTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = isAdminProp ?? !!localStorage.getItem('adminToken');

  const sem1Total = topicsCounts[1] || 13;
  const sem2Total = topicsCounts[2] || 13;
  const sem3Total = topicsCounts[3] || 13;
  const totalTopics = sem1Total + sem2Total + sem3Total;

  const sem1Completed = completedTopics.filter((item: any) => Number(item.semester) === 1).length;
  const sem2Completed = completedTopics.filter((item: any) => Number(item.semester) === 2).length;
  const sem3Completed = completedTopics.filter((item: any) => Number(item.semester) === 3).length;
  const totalCompleted = sem1Completed + sem2Completed + sem3Completed;

  const totalPercentage = totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 0;

  const getRankInfo = (count: number) => {
    if (count === 0) {
      return {
        name: language === 'uz' ? 'Boshlovchi talaba' : language === 'ru' ? 'Начинающий студент' : 'Novice Student',
        bg: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
        desc: language === 'uz' ? 'O‘rganishni boshlash vaqti keldi!' : language === 'ru' ? 'Пришло время начать обучение!' : 'Time to start learning!'
      };
    } else if (count < 5) {
      return {
        name: language === 'uz' ? 'Izlanuvchi talaba' : language === 'ru' ? 'Студент-исследователь' : 'Explorer Student',
        bg: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
        desc: language === 'uz' ? 'Dastlabki anatomik bilimlarni egallamoqdasiz.' : language === 'ru' ? 'Вы получаете базовые знания по анатомии.' : 'You are acquiring basic anatomical knowledge.'
      };
    } else if (count < 12) {
      return {
        name: language === 'uz' ? 'Anatomist Shogird' : language === 'ru' ? 'Подмастерье анатомии' : 'Anatomy Apprentice',
        bg: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800',
        desc: language === 'uz' ? 'Murakkab a’zolar tuzilishini o‘rganishga muvaffaq bo‘ldingiz.' : language === 'ru' ? 'Вы уже освоили строение сложных органов.' : 'You have mastered the structure of complex organs.'
      };
    } else if (count < 20) {
      return {
        name: language === 'uz' ? 'Kichik Shifokor' : language === 'ru' ? 'Младший врач' : 'Junior Physician',
        bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800',
        desc: language === 'uz' ? 'Ajoyib natija! Organlar tizimini mukammal o‘zlashtirmoqdasiz.' : language === 'ru' ? 'Отличный результат! Вы прекрасно осваиваете системы органов.' : 'Excellent! You are mastering the organ systems.'
      };
    } else {
      return {
        name: language === 'uz' ? 'Ibn Sino Izdoshi' : language === 'ru' ? 'Последователь Ибн Сины' : 'Disciple of Ibn Sina',
        bg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
        desc: language === 'uz' ? 'Siz professional anatomiyani to‘liq zabt etdingiz!' : language === 'ru' ? 'Вы полностью освоили профессиональную анатомию!' : 'You have completely conquered professional anatomy!'
      };
    }
  };

  const rank = getRankInfo(totalCompleted);

  useEffect(() => {
    const fetchCompletions = () => {
      const userId = user?.uid || 'anonymous';
      const completionKey = `anatomy_completed_topics_${userId}`;
      const saved = localStorage.getItem(completionKey);
      if (saved) {
        try {
          setCompletedTopics(JSON.parse(saved));
        } catch (e) {
          console.error("Error parsing completed topics on Home:", e);
        }
      } else {
        setCompletedTopics([]);
      }
    };
    fetchCompletions();
  }, [user]);

  useEffect(() => {
    const fetchSemesters = async () => {
      const defaultSemesters = [
        { 
          id: 'sem_1',
          number: 1, 
          title: { uz: '1-Semester: Tayanch-harakat tizimi', en: '1-Semester: Musculoskeletal system', ru: '1-Семестр: Опорно-двигательная система' }, 
          description: { uz: 'Osteologiya, sindesmologiya va miologiya bo‘limlarini qamrab olgan fundamental kurs.', en: 'A fundamental course covering osteology, syndesmology and myology.', ru: 'Фундаментальный курс, охватывающий остеологию, синдесмологию и миологию.' },
          isActive: true,
          order: 1
        },
        { 
          id: 'sem_2',
          number: 2, 
          title: { uz: '2-Semester: Ichki a’zolar va tizimlar', en: '2-Semester: Internal organs and systems', ru: '2-Семестр: Внутренние органы и системы' }, 
          description: { uz: 'Splanxnologiya, angiologya, nevrologiya va endokrin tizim bo‘limlarini o‘z ichiga oladi.', en: 'Includes splanchnology, angiology, neurology and endocrine system.', ru: 'Включает спланхнологию, ангиологию, неврологию и эндокринную систему.' },
          isActive: true,
          order: 2
        },
        { 
          id: 'sem_3',
          number: 3, 
          title: { uz: '3-Semester: Markaziy asab tizimi va sezgi a’zolari', en: '3-Semester: Central Nervous System and Sensory Organs', ru: '3-Семестр: Центральная нервная система и органы чувств' }, 
          description: { uz: 'Nevrologiya, estiziologiya va klinik topografik anatomiya bo‘limlarini o‘z ichiga olgan chuqurlashtirilgan kurs.', en: 'Advanced course covering neurology, esthesiology and clinical topographical anatomy.', ru: 'Углубленный курс, охватывающий неврологию, эстезиологию и клиническую топографическую анатомию.' },
          isActive: true,
          order: 3
        }
      ];

      try {
        const data = await dbService.getSemesters();
        
        const semMap = new Map<number, Semester>();
        defaultSemesters.forEach(s => semMap.set(Number(s.number), s));
        
        if (data && data.length > 0) {
          data.forEach((s: any) => {
            const num = Number(s.number || s.id?.replace?.(/\D/g, '') || 1);
            if (num >= 1 && num <= 3) {
              semMap.set(num, { ...semMap.get(num), ...s, number: num, id: `sem_${num}` });
            }
          });
        }
        
        const merged = Array.from(semMap.values()).sort((a, b) => a.number - b.number);
        setSemesters(merged);
      } catch (error) {
        console.error("Error loaded semesters:", error);
        setSemesters(defaultSemesters);
      }
    };

    const fetchPayments = async () => {
      setUserPayments({});
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const payments: Record<number, { status: string, createdAt: any }> = {};
        const profile = await dbService.getProfile(user.uid);
        const purchasedList = (profile?.purchasedSemesters || []).map(Number);

        const semesterIds = [1, 2, 3];
        for (const semId of semesterIds) {
          if (purchasedList.includes(Number(semId))) {
            payments[semId] = {
              status: 'completed',
              createdAt: profile?.createdAt || new Date().toISOString()
            };
          } else {
            const payData = await dbService.getPayment(user.uid, semId);
            if (payData) {
              payments[semId] = { 
                status: payData.status, 
                createdAt: payData.createdAt 
              };
            }
          }
        }
        setUserPayments(payments);
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTopicsCounts = async () => {
      try {
        const topics = await dbService.getTopics();
        const counts: Record<number, number> = { 1: 13, 2: 13, 3: 13 };
        
        let hasData = false;
        topics.forEach(t => {
          const semNum = Number(t.semester);
          if (semNum) {
            const title = t.title?.uz || t.title;
            if (title && title.trim().length > 2) {
              if (!hasData) {
                counts[1] = 0;
                counts[2] = 0;
                counts[3] = 0;
                hasData = true;
              }
              counts[semNum] = (counts[semNum] || 0) + 1;
            }
          }
        });
        
        if (!counts[1]) counts[1] = 13;
        if (!counts[2]) counts[2] = 13;
        if (!counts[3]) counts[3] = 13;
        
        setTopicsCounts(counts);
      } catch (error) {
        console.warn("Could not fetch topic counts dynamically", error);
      }
    };

    const init = async () => {
      setLoading(true);
      await fetchSemesters();
      await fetchPayments();
      await fetchTopicsCounts();
    };

    init();
  }, [user, isAdmin]);


  return (
    <div className="flex flex-col">
      <SEO 
        title={settings?.siteName ? `${settings.siteName} - Odam Anatomiyasi Platformasi` : "BSMI Anatomy - Odam Anatomiyasi Bo'yicha Interaktiv Ta'lim Portali"}
        description={settings?.tagline || "Buxoro Davlat Tibbiyot Instituti Odam anatomiyasi kafedrasi elektron ta'lim portali. 1, 2, 3-semestr to'liq fan dasturi, 1200+ testlar, 3D modellar va klinik keyslar."}
        keywords="odam anatomiyasi, tibbiyot instituti, bsmi anatomiya, anatomiya testlari, 3d anatomiya, osteologiya, miologiya, splanxnologiya, nevrologiya"
      />
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden bg-brand-primary border-b border-slate-800">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,_var(--tw-gradient-stops))] from-brand-accent/20 via-transparent to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-8 leading-tight">
                {(() => {
                  const title = settings.homeHeroTitle || t('home.hero_title');
                  if (title.includes('professional')) {
                    return (
                      <>
                        {title.split('professional')[0]} <br /><span className="text-brand-accent">professional</span> {title.split('professional')[1]}
                      </>
                    );
                  }
                  return title;
                })()}
              </h1>
              <p className="text-xl text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
                {settings.homeHeroDesc || t('home.hero_desc')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Link to="/semester/1" className="w-full sm:w-auto px-10 py-5 bg-brand-accent hover:bg-brand-accent/90 text-brand-primary font-bold rounded-xl transition-all shadow-xl shadow-brand-accent/20 flex items-center justify-center gap-2 text-base">
                  {settings.homeHeroBtnStart || t('home.start_sem1')} <ChevronRight className="w-5 h-5" />
                </Link>
                <Link to="/atlas" className="w-full sm:w-auto px-10 py-5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-2 text-base">
                  <Microscope className="w-5 h-5" /> {settings.homeHeroBtnAtlas || t('home.view_atlas')}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-brand-primary mb-5 tracking-tight uppercase">{settings.homeFeaturesTitle || t('home.features_title')}</h2>
            <div className="w-24 h-1.5 bg-brand-accent mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <FeatureCard 
              icon={<BookOpen className="w-10 h-10 text-brand-accent" />}
              title={settings.homeFeatTheoryTitle || t('home.feat_theory')}
              description={settings.homeFeatTheoryDesc || t('home.feat_theory_desc')}
            />
            <Link to="/latin-glossary" className="block">
              <FeatureCard 
                icon={<Layers className="w-10 h-10 text-brand-accent" />}
                title={settings.homeFeatLatinTitle || t('home.feat_latin')}
                description={settings.homeFeatLatinDesc || t('home.feat_latin_desc')}
              />
            </Link>
            <FeatureCard 
              icon={<ClipboardList className="w-10 h-10 text-brand-accent" />}
              title={settings.homeFeatQuizzesTitle || t('home.feat_quizzes')}
              description={settings.homeFeatQuizzesDesc || t('home.feat_quizzes_desc')}
            />
            <FeatureCard 
              icon={<Microscope className="w-10 h-10 text-brand-accent" />}
              title={settings.homeFeatAtlasTitle || t('home.feat_atlas')}
              description={settings.homeFeatAtlasDesc || t('home.feat_atlas_desc')}
            />
          </div>
        </div>
      </section>

      {/* Semesters Section */}
      <section className="py-24 bg-brand-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ResumeLastViewedBanner user={user} />
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-brand-primary uppercase tracking-tight">{settings.homeCurriculumTitle || t('home.curriculum')}</h2>
            <p className="text-brand-muted mt-2 font-medium italic uppercase tracking-widest text-[10px]">{settings.homeCurriculumDesc || t('home.curriculum_desc')}</p>
          </div>

          {/* Progress Dashboard Panel with Interactive Charts */}
          <UserProgressSection
            user={user}
            completedTopics={completedTopics}
            sem1Total={sem1Total}
            sem2Total={sem2Total}
            sem3Total={sem3Total}
            totalPercentage={totalPercentage}
            rank={rank}
          />

          {/* Weekly Study Goals Dashboard */}
          <div className="mb-12">
            <WeeklyStudyGoals user={user} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {semesters.map((sem) => (
              <SemesterCard 
                key={sem.id}
                semester={sem.number}
                title={getLocalized(sem.title)}
                description={getLocalized(sem.description)}
                topicsCount={topicsCounts[sem.number] || 13}
                completedCount={completedTopics.filter((item: any) => Number(item.semester) === sem.number).length}
                status={userPayments[sem.number]?.status}
                paymentData={userPayments[sem.number]}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-10 bg-white rounded-3xl border border-brand-border hover:border-brand-accent hover:shadow-2xl hover:shadow-brand-accent/5 transition-all duration-300 group">
      <div className="mb-8 p-5 bg-brand-bg rounded-2xl inline-block group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-bold text-brand-primary mb-4 tracking-tight uppercase">{title}</h3>
      <p className="text-brand-muted text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function Countdown({ createdAt }: { createdAt: any }) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const calculateTime = () => {
      const waitTime = 24 * 60 * 60 * 1000; // 24 hours
      const createdDate = parseDate(createdAt);
      const deadline = createdDate.getTime() + waitTime;
      const now = Date.now();
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeLeft('Tez orada...');
        return;
      }

      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${h}s ${m}m ${s}s`);
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [createdAt]);

  return <span>{timeLeft}</span>;
}

function SemesterCard({ 
  semester, 
  title, 
  description, 
  topicsCount, 
  completedCount, 
  status, 
  paymentData 
}: { 
  semester: number, 
  title: string, 
  description: string, 
  topicsCount: number, 
  completedCount: number, 
  status?: string, 
  paymentData?: any 
}) {
  const isPaid = status === 'completed';
  const isPending = status === 'pending';
  const isLocked = !isPaid;
  const { t } = useLanguage();

  const completionPercentage = topicsCount > 0 ? Math.round((completedCount / topicsCount) * 100) : 0;

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className={`bg-white p-10 rounded-[32px] border shadow-sm overflow-hidden relative group transition-all duration-300 ${isLocked ? 'border-brand-border' : 'border-brand-accent shadow-xl shadow-brand-accent/5'}`}
    >
      <div className={`absolute top-0 right-0 w-40 h-40 rounded-bl-[100px] -mr-16 -mt-16 transition-colors ${isLocked ? 'bg-brand-accent/5 group-hover:bg-brand-accent/10' : 'bg-brand-accent/20'}`}></div>
      
      {isLocked && (
        <div className="absolute top-8 right-8">
          {isPending ? (
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-xl text-orange-600 font-black text-[10px] tracking-widest uppercase">
                <Clock className="w-3.5 h-3.5 animate-pulse" /> {t('study.pending')}
              </div>
              {paymentData?.createdAt && (
                <div className="text-[9px] font-black text-orange-400 uppercase tracking-widest bg-orange-50/50 px-2 py-1 rounded-lg">
                  <Countdown createdAt={paymentData.createdAt} />
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 font-black text-[10px] tracking-widest uppercase">
              <Lock className="w-3.5 h-3.5" /> {t('study.locked')}
            </div>
          )}
        </div>
      )}

      {!isLocked && (
        <div className="absolute top-8 right-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 font-black text-[10px] tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" /> {t('study.unlocked')}
          </div>
        </div>
      )}

      <div className="relative z-10">
        <span className={`inline-block px-5 py-2 text-xs font-extrabold rounded-lg mb-8 uppercase tracking-widest ${isLocked ? 'bg-slate-100 text-slate-500' : 'bg-brand-accent text-brand-primary'}`}>
          SEMESTR {semester}
        </span>
        <h3 className="text-2xl font-bold text-brand-primary mb-5 tracking-tight">{title}</h3>
        <p className="text-brand-muted mb-6 max-w-md text-base leading-relaxed">{description}</p>
        
        {/* Progress Bar inside Semester Card */}
        <div className="mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-100/80">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              {t('progress.percentage')}:
            </span>
            <span className="text-xs font-black text-brand-primary">
              {completedCount} / {topicsCount} ({completionPercentage}%)
            </span>
          </div>
          <div className="w-full bg-slate-200/60 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-brand-accent h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, completionPercentage)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-brand-border pt-8">
          <div className="flex items-center gap-3 text-brand-muted text-sm font-bold">
            <div className="p-2 bg-brand-bg rounded-lg">
              <ClipboardList className="w-5 h-5 text-brand-accent" />
            </div>
            {topicsCount} {t('study.topics').toUpperCase()}
          </div>
          <Link 
            to={`/semester/${semester}`} 
            className={`px-8 py-4 text-sm font-bold rounded-xl transition-all flex items-center gap-2 shadow-xl ${
              isLocked 
                ? (isPending ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-brand-primary text-white hover:bg-slate-800')
                : 'bg-brand-accent text-brand-primary hover:bg-brand-accent/90'
            }`}
          >
            {isLocked ? (isPending ? t('quiz.explanation').toUpperCase() : t('quiz.finish').toUpperCase()) : t('study.unlocked').toUpperCase()} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
