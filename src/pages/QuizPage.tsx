import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc, limit } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { dbService, isSupabaseEnabled } from '../lib/dbService';
import { Quiz, Topic } from '../types';
import { getCuratedQuizzesForTopic } from '../data/topicQuizzesData';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, ChevronRight, RotateCcw, Award, Lock, Clock, Sparkles, Languages } from 'lucide-react';
import PaymentModal from '../components/PaymentModal';
import { useSettings } from '../hooks/useSettings';
import { useLanguage } from '../hooks/useLanguage';
import { parseDate } from '../lib/dateUtils';
import SEO from '../components/SEO';

function Countdown({ createdAt }: { createdAt: any }) {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const calculateTime = () => {
      const waitTime = 24 * 60 * 60 * 1000;
      const createdDate = parseDate(createdAt);
      const deadline = createdDate.getTime() + waitTime;
      const now = Date.now();
      const diff = deadline - now;

      if (diff <= 0) {
        const lang = localStorage.getItem('systemLanguage') || 'uz';
        setTimeLeft(lang === 'uz' ? 'Tez orada...' : lang === 'ru' ? 'Скоро...' : 'Soon...');
        return;
      }

      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${h}h ${m}m ${s}s`);
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [createdAt]);

  return <span>{timeLeft}</span>;
}

export default function QuizPage({ isAdmin: isAdminProp, user }: { isAdmin?: boolean, user?: any }) {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { language, t, getLocalized } = useLanguage();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [paymentCreatedAt, setPaymentCreatedAt] = useState<Date | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const isAdmin = isAdminProp ?? !!localStorage.getItem('adminToken');

  // Dynamic AI Quiz Translation States
  const [translatedQuizzes, setTranslatedQuizzes] = useState<Quiz[]>([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [transError, setTransError] = useState<string | null>(null);

  useEffect(() => {
    const handleQuizTranslation = async () => {
      if (quizzes.length === 0) {
        setTranslatedQuizzes([]);
        setTransError(null);
        return;
      }

      // Check if the current quizzes need translation:
      // Either because the selected language is not Uzbek,
      // Or because the selected language is Uzbek but the quizzes contain Cyrillic characters or are in English.
      const needsTranslation = language !== 'uz' || quizzes.some(q => q.question && (/[а-яА-ЯёЁ]/.test(q.question) || q.question.toLowerCase().includes('the ') || q.question.toLowerCase().includes(' of ')));

      if (!needsTranslation) {
        setTranslatedQuizzes([]);
        setTransError(null);
        return;
      }

      const cacheKey = `translated_quizzes_${topicId}_${language}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length === quizzes.length) {
            setTranslatedQuizzes(parsed);
            setTransError(null);
            return;
          }
        } catch (e) {
          console.error("Error parsing cached translated quizzes", e);
        }
      }

      setIsTranslating(true);
      setTransError(null);
      try {
        const response = await fetch('/api/translate-quizzes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            quizzes,
            language
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to translate quizzes via AI');
        }

        const data = await response.json();
        if (data.translatedQuizzes && Array.isArray(data.translatedQuizzes)) {
          setTranslatedQuizzes(data.translatedQuizzes);
          localStorage.setItem(cacheKey, JSON.stringify(data.translatedQuizzes));
        } else {
          throw new Error('Invalid translation format returned from AI');
        }
      } catch (err: any) {
        console.error("AI Quiz Translation error:", err);
        setTransError(
          language === 'uz'
            ? 'Testni o\'zbek tiliga tarjima qilishda xatolik. Original versiya ko\'rsatilmoqda.'
            : language === 'ru' 
              ? 'Не удалось перевести тест с помощью ИИ. Отображается оригинальная версия.' 
              : 'AI translation for quizzes failed. Showing original version.'
        );
      } finally {
        setIsTranslating(false);
      }
    };

    handleQuizTranslation();
  }, [quizzes, language, topicId]);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const fetchDataAndCheckPayment = async () => {
      if (!topicId) return;
      setLoading(true);

      // Reset states
      setIsPaid(false);
      setIsPending(false);
      setQuizzes([]);

      try {
        // Fetch topic first to know the semester
        const topicData = await dbService.getTopicDetail(topicId);
        if (topicData) {
          setTopic(topicData);

          // Check payment for this semester
          let unlocked = false;
          if (isAdmin) {
            unlocked = true;
            setIsPaid(true);
          } else if (user) {
            // 1. Check User/Profile document for semester access
            try {
              const uProfile = await dbService.getProfile(user.uid);
              if (uProfile) {
                const purchased = (uProfile.purchasedSemesters || []).map(Number);
                if (purchased.includes(Number(topicData.semester))) {
                  unlocked = true;
                  setIsPaid(true);
                  setIsPending(false);
                }
              }
            } catch (err) {
              console.error("User check error:", err);
            }

            if (!unlocked) {
              const pData = await dbService.getPayment(user.uid, topicData.semester);
              if (pData) {
                if (pData.status === 'completed' || pData.status === 'approved') {
                  unlocked = true;
                  setIsPaid(true);
                  setIsPending(false);
                } else if (pData.status === 'pending') {
                  setIsPending(true);
                  setIsPaid(false);
                  setPaymentCreatedAt(parseDate(pData.createdAt));
                }
              }
            }
          }

          if (unlocked) {
            let data = await dbService.getQuizzes(topicId);
            if (!data || data.length === 0) {
              data = getCuratedQuizzesForTopic(topicData);
            }
            setQuizzes(data);
          }
        }
      } catch (error) {
        console.error("Error fetching quizzes/payment:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDataAndCheckPayment();
  }, [topicId, user, isAdmin]);

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null || isAnswered) return;
    
    setIsAnswered(true);
    if (selectedOption === quizzes[currentIndex].correctAnswerIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < quizzes.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
  };

  useEffect(() => {
    if (showResult && topic && user && quizzes.length > 0) {
      const historyKey = `anatomy_quiz_history_${user.uid}`;
      let historyList = [];
      try {
        historyList = JSON.parse(localStorage.getItem(historyKey) || '[]');
      } catch (e) {
        console.error("Error parsing quiz history:", e);
      }

      const rawTitle = topic.title || 'Mavzu Testi';
      const isDuplicated = historyList.some((item: any) => 
        item.topicId === topic.id && 
        item.score === score && 
        new Date().getTime() - new Date(item.date).getTime() < 10000
      );

      if (!isDuplicated) {
        const topicNameUz = typeof topic.title === 'object' ? (topic.title['uz'] || topic.title['uz-UZ'] || topic.title['en'] || 'Mavzu') : (topic.title || 'Mavzu');
        const topicNameRu = typeof topic.title === 'object' ? (topic.title['ru'] || topic.title['ru-RU'] || topicNameUz) : topicNameUz;
        const topicNameEn = typeof topic.title === 'object' ? (topic.title['en'] || topic.title['en-US'] || topicNameUz) : topicNameUz;

        historyList.push({
          topicId: topic.id,
          topicNameUz,
          topicNameRu,
          topicNameEn,
          score,
          total: quizzes.length,
          percentageVal: Math.round((score / quizzes.length) * 100),
          date: new Date().toISOString(),
          semester: topic.semester || 1
        });
        
        if (historyList.length > 40) {
          historyList = historyList.slice(-40);
        }
        localStorage.setItem(historyKey, JSON.stringify(historyList));
      }
    }
  }, [showResult, topic, score, quizzes.length, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-accent"></div>
      </div>
    );
  }

  const isUnlocked = isPaid;

  if (!isUnlocked && topic) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center mt-12 bg-white rounded-[48px] border border-brand-border shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-brand-accent"></div>
        <div className="w-24 h-24 bg-brand-bg rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-xl border border-brand-border group">
          {isPending ? (
            <Clock className="w-12 h-12 text-orange-500 animate-pulse" />
          ) : (
            <Lock className="w-12 h-12 text-brand-accent group-hover:scale-110 transition-transform" />
          )}
        </div>
        <h1 className="text-4xl font-black text-brand-primary mb-6 tracking-tighter uppercase">
          { { uz: "Test bloklangan", ru: "Тест заблокирован", en: "Quiz Locked" }[language] }
        </h1>
        {isPending && paymentCreatedAt && (
          <div className="mb-6 inline-block px-6 py-2 bg-orange-100/50 border border-orange-200 rounded-2xl text-orange-600 font-black tracking-[0.2em] text-[10px]">
            { { uz: "TASDIQLASHGA: ", ru: "НА ПРОВЕРКЕ: ", en: "PENDING VERIFICATION: " }[language] }<Countdown createdAt={paymentCreatedAt} />
          </div>
        )}
        <p className="text-brand-muted text-lg mb-12 font-medium leading-relaxed max-w-sm mx-auto">
          {isPending 
            ? { uz: "Ushbu semestr testi hozirda yuborgan to'lovingiz tekshirilayotganligi sababli yopiq. Tez orada ochiladi.", ru: "Этот тест закрыт, так как ваш платеж за семестр проверяется администратором. Скоро он будет доступен.", en: "This semester's quiz is locked because your payment is currently being reviewed. It will unlock shortly." }[language]
            : { uz: "Bilimingizni sinash uchun mo'ljallangan ushbu testlardan o'tish uchun semestr obunasini xarid qilishingiz lozim.", ru: "Для доступа к тестам, пожалуйста, приобретите подписку на выбранный семестр.", en: "To test your anatomical knowledge, you must unlock this semester's subscription." }[language]}
        </p>
        <div className="flex flex-col gap-4 max-w-xs mx-auto">
          {!isPending && (
            <button 
              onClick={() => setShowPaymentModal(true)}
              className="py-5 bg-brand-accent text-brand-primary font-black rounded-2xl shadow-xl shadow-brand-accent/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-xs"
            >
              { { uz: "OBUNANI SOTIB OLISH", ru: "КУПИТЬ ПОДПИСКУ", en: "BUY SUBSCRIPTION" }[language] } — {settings?.priceUZS?.toLocaleString()} UZS
            </button>
          )}
          <Link to={`/topic/${topicId}`} className="py-5 bg-brand-bg text-brand-primary font-bold rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs">
            { { uz: "Mavzuga qaytish", ru: "Назад к теме", en: "Back to Topic" }[language] }
          </Link>
        </div>

        {showPaymentModal && (
          <PaymentModal 
            semesterId={topic.semester} 
            user={user}
            onClose={() => setShowPaymentModal(false)}
            onSuccess={async () => {
              setShowPaymentModal(false);
              if (user && topic) {
                try {
                  const uProfile = await dbService.getProfile(user.uid);
                  const pData = await dbService.getPayment(user.uid, topic.semester);
                  const purchased = (uProfile?.purchasedSemesters || []).map(Number);
                  if (purchased.includes(Number(topic.semester)) || pData?.status === 'completed' || pData?.status === 'approved') {
                    setIsPaid(true);
                    setIsPending(false);
                  } else if (pData?.status === 'pending') {
                    setIsPending(true);
                    setIsPaid(false);
                    if (pData.createdAt) setPaymentCreatedAt(parseDate(pData.createdAt));
                  }
                } catch (e) {
                  console.error("Quiz payment refresh error:", e);
                }
              }
            }}
          />
        )}
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center bg-white rounded-[40px] border border-brand-border mt-12 shadow-xl shadow-slate-200/50">
        <Award className="w-20 h-20 text-brand-bg mx-auto mb-8 p-4 bg-brand-primary rounded-2xl" />
        <h1 className="text-3xl font-black text-brand-primary uppercase tracking-tight">
          { { uz: "Mavzu testi kutilmoqda", ru: "Тест готовится к выпуску", en: "Quiz Coming Soon" }[language] }
        </h1>
        <p className="text-brand-muted mt-4 text-lg">
          { { uz: "Hozircha savollar bazasi shakllantirilmoqda.", ru: "В настоящее время база вопросов формируется.", en: "Questions are currently being prepared for this topic." }[language] }
        </p>
        <Link to={`/topic/${topicId}`} className="mt-12 inline-block px-12 py-4 bg-brand-primary text-white font-black rounded-xl uppercase tracking-widest text-sm hover:bg-slate-800 transition-all">
          { { uz: "MAVZUGA QAYTISH", ru: "НАЗАД К ТЕМЕ", en: "BACK TO TOPIC" }[language] }
        </Link>
      </div>
    );
  }

  const currentQuiz = quizzes[currentIndex];
  const isOral = currentQuiz && (!currentQuiz.options || currentQuiz.options.length === 0);

  if (showResult) {
    const percentage = Math.round((score / quizzes.length) * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-16 rounded-[48px] border border-brand-border shadow-2xl text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-brand-accent"></div>
          <div className="w-28 h-28 bg-brand-bg rounded-3xl flex items-center justify-center mx-auto mb-10 border border-brand-border group">
            <Award className="text-brand-accent w-16 h-16 group-hover:scale-110 transition-transform" />
          </div>
          <h1 className="text-4xl font-black text-brand-primary mb-3 tracking-tighter uppercase">
            { { uz: "Natijangiz", ru: "Ваш результат", en: "Your Result" }[language] }
          </h1>
          {quizzes.some(q => q.options && q.options.length > 0) ? (
            <>
              <p className="text-brand-muted mb-12 text-lg font-medium">
                { { uz: `${quizzes.length} tadan ${score} ta to'g'ri javob berdingiz.`, ru: `Вы правильно ответили на ${score} из ${quizzes.length} вопросов.`, en: `You correctly answered ${score} out of ${quizzes.length} questions.` }[language] }
              </p>
              <div className="relative inline-block mb-12">
                <div className="text-8xl font-black text-brand-primary tabular-nums tracking-tighter">{percentage}%</div>
                <div className="absolute -bottom-2 left-0 w-full h-1.5 bg-brand-accent rounded-full scale-x-50"></div>
              </div>
            </>
          ) : (
            <p className="text-brand-muted mb-12 text-lg font-medium">
              { { uz: "Barcha savollar bilan tanishib chiqdingiz. Imtihonga tayyorgarlikda omad tilaymiz!", ru: "Вы ознакомились со всеми вопросами. Удачи в подготовке к экзаменам!", en: "You have reviewed all standard questions. Best of luck on your exams!" }[language] }
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <button 
              onClick={handleRestart}
              className="px-10 py-5 bg-brand-bg text-brand-primary font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-200 transition-all text-xs uppercase tracking-widest"
            >
              <RotateCcw className="w-5 h-5" /> {isOral ? (language === 'uz' ? 'BOSHIDAN KO\'RISH' : language === 'ru' ? 'ПОВТОРИТЬ' : 'RESET') : { uz: 'QAYTA BOSHLASH', ru: 'НАЧАТЬ ЗАНОВО', en: 'RESTART' }[language]}
            </button>
            <Link 
              to={`/topic/${topicId}`}
              className="px-10 py-5 bg-brand-primary text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all text-xs uppercase tracking-widest shadow-xl shadow-brand-primary/20"
            >
              { { uz: "MAVZUGA QAYTISH", ru: "НАЗАД К ТЕМЕ", en: "BACK TO TOPIC" }[language] }
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const translatedQuiz = translatedQuizzes[currentIndex] || null;

  const displayQuestion = translatedQuiz ? translatedQuiz.question : currentQuiz.question;
  const displayOptions = (translatedQuiz && translatedQuiz.options && translatedQuiz.options.length > 0) ? translatedQuiz.options : currentQuiz.options;
  const displayExplanation = translatedQuiz ? translatedQuiz.explanation : currentQuiz.explanation;

  const quizTitle = getLocalized(topic?.title) || (topic?.title ? (typeof topic.title === 'object' ? (topic.title.uz || topic.title.en || topic.title.ru || '') : topic.title) : '') || (topicId?.includes('midterm') ? (topicId === 'midterm_1' ? '1-Oraliq Nazorati Testi' : '2-Oraliq Nazorati Testi') : 'Anatomiya Testi');

  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <SEO 
        title={`${quizTitle} - Test Sinovi | BSMI Anatomy`}
        description={`BSMI Odam anatomiyasi fanidan ${quizTitle} mavzusi bo'yicha interaktiv test sinovi, bilimlarni baholash va tahlil qilish.`}
        keywords={`anatomiya testi, ${quizTitle}, tibbiy testlar, oraliq nazorat, bsmi`}
      />
      <div className="mb-12 flex items-center justify-between border-l-4 border-brand-accent pl-6">
        <div>
          <h2 className="text-[10px] font-black text-brand-accent uppercase tracking-[0.3em] mb-2 leading-none">
            {isOral 
              ? { uz: 'Og\'zaki Savollar', ru: 'Устные Вопросы', en: 'Oral Questions' }[language]
              : { uz: 'Anatomik Bilim Testi', ru: 'Анатомический Тест', en: 'Anatomy Practice Quiz' }[language]}
          </h2>
          <h1 className="text-2xl font-black text-brand-primary tracking-tight leading-tight line-clamp-1 max-w-[400px]">
            {getLocalized(topic?.title) || (topic?.title ? (typeof topic.title === 'object' ? (topic.title.uz || topic.title.en || topic.title.ru || '') : topic.title) : '') || (topicId?.includes('midterm') ? (topicId === 'midterm_1' ? '1-ORALIQ' : '2-ORALIQ') : 'TEST JARAYONI')}
          </h1>
        </div>
        <div className="text-right">
          <div className="text-xs font-black text-brand-primary tracking-widest uppercase mb-3">
            { { uz: 'SAVOL', ru: 'ВОПРОС', en: 'QUESTION' }[language] } {currentIndex + 1} / {quizzes.length}
          </div>
          <div className="w-40 h-3 bg-brand-bg rounded-full overflow-hidden border border-brand-border">
            <motion.div 
              className="h-full bg-brand-accent" 
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / quizzes.length) * 100}%` }}
              transition={{ duration: 0.8, ease: "circOut" }}
            ></motion.div>
          </div>
        </div>
      </div>

      {/* AI Translation Status Banner */}
      {(translatedQuizzes.length > 0 || isTranslating) && (
        <div className="mb-6 p-4 bg-brand-bg border border-brand-border rounded-[20px] flex items-center justify-between gap-3 text-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            {isTranslating ? (
              <div className="relative shrink-0 flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-brand-accent/50 opacity-75"></span>
                <Sparkles className="w-4 h-4 text-brand-accent shrink-0 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
            ) : (
              <Sparkles className="w-4 h-4 text-brand-accent shrink-0" />
            )}
            <span className="font-semibold text-brand-muted">
              {isTranslating 
                ? (language === 'ru' ? 'ИИ Gemini переводит вопросы теста...' : language === 'uz' ? 'AI Gemini test savollarini o\'zbekchaga tarjima qilmoqda...' : 'Gemini AI is translating quiz questions...')
                : transError 
                  ? transError
                  : (language === 'ru' ? 'Тест автоматически переведен ИИ Gemini' : language === 'uz' ? 'Test savollari Gemini AI yordamida o\'zbek tiliga tarjima qilindi' : 'Quiz questions auto-translated by Gemini AI')}
            </span>
          </div>
          {transError && (
            <button 
              onClick={() => window.location.reload()} 
              className="text-brand-accent hover:underline font-black uppercase tracking-wider text-[10px]"
            >
              {language === 'uz' ? 'Qayta urinish' : language === 'ru' ? 'Повторить' : 'Retry'}
            </button>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white p-10 md:p-14 rounded-[40px] border border-brand-border shadow-2xl shadow-slate-200/40 relative overflow-hidden"
        >
          {isTranslating && (
            <div className="absolute inset-0 bg-white/85 backdrop-blur-md z-20 flex flex-col items-center justify-center p-10 transition-all duration-300">
              <div className="relative mb-6">
                <div className="absolute -inset-4 bg-brand-accent/20 rounded-full blur-xl animate-pulse"></div>
                <div className="w-16 h-16 rounded-2xl bg-brand-bg border border-brand-border flex items-center justify-center shadow-lg relative overflow-hidden">
                  <Languages className="w-8 h-8 text-brand-accent animate-spin" style={{ animationDuration: '3.5s' }} />
                </div>
              </div>
              <h3 className="text-lg font-black text-brand-primary mb-2 tracking-tight">
                { { uz: "Tarjima qilinmoqda...", ru: "Перевод...", en: "Translating..." }[language] || "Translating..." }
              </h3>
              <p className="text-xs text-brand-muted font-bold tracking-wider uppercase text-center max-w-sm leading-relaxed animate-pulse">
                { { uz: "Gemini AI eng aniq tibbiy-anatomik terminlarni tayyorlamoqda", ru: "Gemini AI готовит точные медицинские термины", en: "Gemini AI is preparing accurate medical terms" }[language] || "Gemini AI is preparing accurate terms" }
              </p>
              
              {/* Beautiful animated loader dots */}
              <div className="flex gap-2 mt-6">
                <span className="w-3 h-3 bg-brand-accent rounded-full animate-bounce" style={{ animationDelay: '-0.3s' }}></span>
                <span className="w-3 h-3 bg-brand-accent rounded-full animate-bounce" style={{ animationDelay: '-0.15s' }}></span>
                <span className="w-3 h-3 bg-brand-accent rounded-full animate-bounce"></span>
              </div>
            </div>
          )}

          <p className="text-xl md:text-2xl font-black text-brand-primary mb-12 leading-[1.4] tracking-tight text-left">
            {displayQuestion}
          </p>

          {!isOral ? (
            <div className="space-y-4">
              {displayOptions.map((option, i) => {
                let stateClass = 'bg-brand-bg border-brand-border text-brand-primary hover:border-brand-accent hover:bg-white hover:shadow-lg transition-all';
                if (selectedOption === i) stateClass = 'border-brand-accent bg-brand-accent/5 text-brand-primary ring-4 ring-brand-accent/10 shadow-lg';
                
                if (isAnswered) {
                  if (i === currentQuiz.correctAnswerIndex) {
                    stateClass = 'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-lg';
                  } else if (selectedOption === i) {
                    stateClass = 'border-red-500 bg-red-50 text-red-950 shadow-lg';
                  } else {
                    stateClass = 'border-brand-border bg-slate-50 text-brand-muted opacity-40';
                  }
                }

                return (
                  <motion.button
                    key={i}
                    disabled={isAnswered}
                    whileHover={!isAnswered ? { scale: 1.015, x: 8, transition: { duration: 0.2 } } : {}}
                    whileTap={!isAnswered ? { scale: 0.99 } : {}}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, type: "spring", stiffness: 260, damping: 20 }}
                    onClick={() => handleSelect(i)}
                    className={`w-full text-left p-6 rounded-[20px] border-2 font-black transition-all flex items-center justify-between group cursor-pointer ${stateClass}`}
                  >
                    <div className="flex items-center gap-5">
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-all ${
                        selectedOption === i ? 'bg-brand-accent text-brand-primary scale-110' : 'bg-white text-brand-muted group-hover:bg-brand-accent group-hover:text-brand-primary border border-brand-border group-hover:scale-105'
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-base tracking-tight">{option}</span>
                    </div>
                    <div className="flex-shrink-0">
                      {isAnswered && i === currentQuiz.correctAnswerIndex && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
                          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                        </motion.div>
                      )}
                      {isAnswered && selectedOption === i && i !== currentQuiz.correctAnswerIndex && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
                          <XCircle className="w-8 h-8 text-red-600" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col items-center justify-center text-center">
              <Award size={48} className="text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                { { uz: "Og'zaki imtihon uchun savol", ru: "Вопрос для устного экзамена", en: "Question for oral exam" }[language] }
              </p>
            </div>
          )}

          {isAnswered && !isOral && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-10 p-8 rounded-3xl border ${selectedOption === currentQuiz.correctAnswerIndex ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}
            >
              <h4 className={`font-black text-xs uppercase tracking-widest mb-3 flex items-center gap-2 ${selectedOption === currentQuiz.correctAnswerIndex ? 'text-emerald-990' : 'text-red-990'}`}>
                {selectedOption === currentQuiz.correctAnswerIndex 
                  ? { uz: "MUKAMMAL JAVOB!", ru: "ПОТРЯСАЮЩИЙ ОТВЕТ!", en: "PERFECT ANSWER!" }[language]
                  : { uz: "TAHLIL QILISH KERAK.", ru: "ТРЕБУЕТСЯ АНАЛИЗ", en: "REQUIRES ANALYSIS / REVIEW" }[language]}
              </h4>
              <p className={`text-base font-medium leading-relaxed text-left ${selectedOption === currentQuiz.correctAnswerIndex ? 'text-emerald-700' : 'text-red-700'}`}>
                {displayExplanation}
              </p>
            </motion.div>
          )}

          <div className="mt-12 flex justify-end">
            {isOral ? (
              <button
                onClick={handleNext}
                className="px-12 py-5 bg-brand-primary text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center gap-3 uppercase tracking-widest text-xs shadow-xl shadow-brand-primary/20"
              >
                {currentIndex < quizzes.length - 1 
                  ? { uz: 'KEYINGI SAVOL', ru: 'СЛЕДУЮЩИЙ ВОПРОС', en: 'NEXT QUESTION' }[language]
                  : { uz: 'YAKUNLASH', ru: 'ЗАВЕРШИТЬ', en: 'FINISH' }[language]} <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <>
                {!isAnswered ? (
                  <button
                    disabled={selectedOption === null}
                    onClick={handleSubmit}
                    className="px-12 py-5 bg-brand-primary text-white font-black rounded-2xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all uppercase tracking-widest text-xs shadow-xl shadow-brand-primary/20"
                  >
                    { { uz: "TASDIQLASH", ru: "ПОДТВЕРДИТЬ", en: "SUBMIT" }[language] }
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-12 py-5 bg-brand-accent text-brand-primary font-black rounded-2xl hover:bg-brand-accent/90 transition-all flex items-center gap-3 uppercase tracking-widest text-xs shadow-xl shadow-brand-accent/20"
                  >
                    {currentIndex < quizzes.length - 1 
                      ? { uz: 'KEYINGI SAVOL', ru: 'СЛЕДУЮЩИЙ ВОПРОС', en: 'NEXT QUESTION' }[language]
                      : { uz: 'NATIJANI KO‘RISH', ru: 'РЕЗУЛЬТАТЫ', en: 'VIEW SCORE' }[language]} <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
