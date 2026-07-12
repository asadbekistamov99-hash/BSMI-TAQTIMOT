import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  RotateCw, 
  Volume2, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  Calendar, 
  Flame, 
  Award, 
  Play, 
  Bookmark, 
  Check, 
  AlertCircle,
  TrendingUp,
  RotateCcw,
  Languages
} from 'lucide-react';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useLanguage } from '../hooks/useLanguage';

interface LatinTerm {
  id: string;
  latin: string;
  uzbek: string;
}

interface FlashcardState {
  termId: string;
  isFavorite: boolean;
  interval: number;      // Days
  repetitions: number;   // Consecutive correct reviews
  easeFactor: number;    // SM-2 parameter (default 2.5)
  nextReview: string;    // ISO string for when it should be reviewed
  lastReviewed?: string; // ISO string 
}

interface FlashcardStudyProps {
  user: any;
  terms: LatinTerm[];
  getLocalizedTermStr: (uzb: string) => string;
}

export default function FlashcardStudy({ user, terms, getLocalizedTermStr }: FlashcardStudyProps) {
  const { language, t } = useLanguage();
  
  // Custom Dictionary for Localized Texts inside Flashcard component
  const getLocalText = (key: string) => {
    const texts: Record<string, Record<string, string>> = {
      title: {
        uz: "Yodlash Kartalari",
        ru: "Карточки для Запоминания",
        en: "Anatomy Flashcards"
      },
      subtitle: {
        uz: "Spaced-repetition (oraliqli takrorlash) tizimi yordamida terminlarni samarali o'rganing.",
        ru: "Изучайте анатомические термины эффективно по системе интервальных повторений.",
        en: "Learn anatomy terms efficiently using the scientifically-proven spaced repetition system."
      },
      notLoggedIn: {
        uz: "Tizimga kirish tavsiya etiladi. Mehmon rejimida natijalar brauzerda saqlanadi.",
        ru: "Рекомендуется авторизоваться. В гостевом режиме прогресс сохраняется в браузере.",
        en: "Logging in is recommended. In guest mode, your progress is saved in this browser."
      },
      statsAll: {
        uz: "Sevimli terminlar",
        ru: "Избранные термины",
        en: "Favorite Terms"
      },
      statsDue: {
        uz: "Bugun takrorlash kerak",
        ru: "Повторить сегодня",
        en: "Due for Review"
      },
      statsStreak: {
        uz: "Kunlik faollik",
        ru: "Дней подряд",
        en: "Daily Streak"
      },
      reviewNowBtn: {
        uz: "Takrorlashni boshlash",
        ru: "Начать повторение",
        en: "Start Review Now"
      },
      emptyFavoritesTitle: {
        uz: "Hozircha sevimli terminlar yo'q",
        ru: "Пока нет избранных терминов",
        en: "No favorite terms yet"
      },
      emptyFavoritesDesc: {
        uz: "Yodlashni boshlash uchun dastlab Lug'at bo'limidan biron-bir terminni sevimli (yurakcha belgisi) qilib belgilang.",
        ru: "Чтобы начать изучение, сначала отметьте любой термин сердечком в разделе Словаря.",
        en: "To start learning, first mark any term as favorite (heart icon) in the Glossary section."
      },
      allDoneTitle: {
        uz: "Bugungi takrorlash yakunlandi!",
        ru: "Все повторения на сегодня завершены!",
        en: "All reviews for today are complete!"
      },
      allDoneDesc: {
        uz: "Ajoyib natija! Bugungi barcha kartalarni takrorlab bo'ldingiz. Yangi takrorlashlar rejalashtirilgan vaqtda keladi.",
        ru: "Отличный результат! Вы повторили все сегодняшние карточки. Новые появятся по расписанию.",
        en: "Fantastic work! You have finished all of today's review cards. Next reviews will appear on schedule."
      },
      backToDesk: {
        uz: "Doskaga qaytish",
        ru: "Вернуться в меню",
        en: "Back to Dashboard"
      },
      tapToFlip: {
        uz: "Farkini ko'rish uchun kartaga bosing",
        ru: "Нажмите на карточку, чтобы перевернуть ее",
        en: "Tap the card to reveal translation"
      },
      pronounceBtn: {
        uz: "Ovozli eshitish",
        ru: "Прослушать латынь",
        en: "Speak Out Loud"
      },
      hard: {
        uz: "Qiyin (Tezda takrorlash)",
        ru: "Сложно (Повторить вскоре)",
        en: "Hard (Repeat soon)"
      },
      good: {
        uz: "Yaxshi (Normal oraliq)",
        ru: "Хорошо (Средний интервал)",
        en: "Good (Normal interval)"
      },
      easy: {
        uz: "Oson (Uzoq oraliq)",
        ru: "Легко (Долгий интервал)",
        en: "Easy (Long interval)"
      },
      frontSide: {
        uz: "LATINCHA",
        ru: "ЛАТЫНЬ",
        en: "LATIN"
      },
      backSide: {
        uz: "TARJIMASI",
        ru: "ПЕРЕВОД",
        en: "TRANSLATION"
      },
      addAllTerms: {
        uz: "Barcha terminlarni sevimli qilish",
        ru: "Добавить все термины",
        en: "Add All Terms to Favorites"
      },
      clearFavorites: {
        uz: "Barchasini o'chirish",
        ru: "Очистить список",
        en: "Clear All Favorites"
      },
      quickStartTitle: {
        uz: "Yodlashni osonlashtiring",
        ru: "Сделайте запоминание проще",
        en: "Supercharge Anatomy Study"
      },
      cardCount: {
        uz: "{count} ta o'rganilayotgan terminlar",
        ru: "{count} изученных терминов",
        en: "{count} terms in study deck"
      }
    };

    if (texts[key]) {
      return texts[key][language] || texts[key]['uz'];
    }
    return key;
  };

  const [favorites, setFavorites] = useState<Record<string, FlashcardState>>({});
  const [loading, setLoading] = useState(true);
  const [isStudying, setIsStudying] = useState(false);
  const [activeQueue, setActiveQueue] = useState<LatinTerm[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showFinishedCeleb, setShowFinishedCeleb] = useState(false);

  // Initialize and load user data
  useEffect(() => {
    loadFlashcardsState();
    loadStreak();
  }, [user, terms]);

  // Load streak from localStorage for simplicity
  const loadStreak = () => {
    const saved = localStorage.getItem(`flashcards_streak_${user?.uid || 'guest'}`);
    const lastDate = localStorage.getItem(`flashcards_last_review_${user?.uid || 'guest'}`);
    if (saved) {
      const currentStreak = parseInt(saved, 10);
      if (lastDate) {
        const diff = Date.now() - new Date(lastDate).getTime();
        const diffDays = diff / (1000 * 60 * 60 * 24);
        if (diffDays > 2) {
          // Streak broken
          setStreak(0);
          localStorage.setItem(`flashcards_streak_${user?.uid || 'guest'}`, '0');
        } else {
          setStreak(currentStreak);
        }
      } else {
        setStreak(currentStreak);
      }
    }
  };

  const updateReviewStreak = () => {
    const saved = localStorage.getItem(`flashcards_streak_${user?.uid || 'guest'}`);
    const lastDate = localStorage.getItem(`flashcards_last_review_${user?.uid || 'guest'}`);
    const todayStr = new Date().toDateString();
    
    if (lastDate === todayStr) return; // Already reviewed today

    let newStreak = 1;
    if (saved && lastDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (new Date(lastDate).toDateString() === yesterday.toDateString()) {
        newStreak = parseInt(saved, 10) + 1;
      }
    }
    setStreak(newStreak);
    localStorage.setItem(`flashcards_streak_${user?.uid || 'guest'}`, newStreak.toString());
    localStorage.setItem(`flashcards_last_review_${user?.uid || 'guest'}`, todayStr);
  };

  const loadFlashcardsState = async () => {
    setLoading(true);
    try {
      if (user) {
        // Load from firestore
        const qRef = collection(db, 'users', user.uid, 'flashcards');
        const snap = await getDocs(qRef);
        const fetched: Record<string, FlashcardState> = {};
        snap.forEach(doc => {
          fetched[doc.id] = doc.data() as FlashcardState;
        });

        // Sync missing from/to local and complete state
        setFavorites(fetched);
      } else {
        // Load from local storage
        const localData = localStorage.getItem('flashcards_data_guest');
        if (localData) {
          setFavorites(JSON.parse(localData));
        }
      }
    } catch (e) {
      console.error("Error loading flashcards: ", e);
    } finally {
      setLoading(false);
    }
  };

  const saveTermState = async (termId: string, updatedState: FlashcardState) => {
    try {
      const newFavorites = { ...favorites, [termId]: updatedState };
      setFavorites(newFavorites);

      if (user) {
        // Save to Firestore for durable syncing across devices
        const docRef = doc(db, 'users', user.uid, 'flashcards', termId);
        await setDoc(docRef, updatedState, { merge: true });
      } else {
        // Save to local storage for guest
        localStorage.setItem('flashcards_data_guest', JSON.stringify(newFavorites));
      }

      // Also dispatch standard event so LatinGlossary knows
      window.dispatchEvent(new CustomEvent('favorites_updated', { detail: { termId, state: updatedState } }));
    } catch (e) {
      console.error("Error saving flashcard term: ", e);
    }
  };

  const handleToggleFavorite = async (termId: string) => {
    const existing = favorites[termId];
    if (existing && existing.isFavorite) {
      // Remove from favorite
      const updated: FlashcardState = {
        ...existing,
        isFavorite: false
      };
      await saveTermState(termId, updated);
    } else {
      // Create new or add back
      const updated: FlashcardState = {
        termId,
        isFavorite: true,
        interval: 0,
        repetitions: 0,
        easeFactor: 2.5,
        nextReview: new Date().toISOString()
      };
      await saveTermState(termId, updated);
    }
  };

  const handleAddAllTerms = async () => {
    if (window.confirm(getLocalText('addAllTerms') + "?")) {
      const freshFavorites = { ...favorites };
      for (const t of terms) {
        if (!freshFavorites[t.id] || !freshFavorites[t.id].isFavorite) {
          freshFavorites[t.id] = {
            termId: t.id,
            isFavorite: true,
            interval: 0,
            repetitions: 0,
            easeFactor: 2.5,
            nextReview: new Date().toISOString()
          };
          if (user) {
            const docRef = doc(db, 'users', user.uid, 'flashcards', t.id);
            await setDoc(docRef, freshFavorites[t.id], { merge: true });
          }
        }
      }
      setFavorites(freshFavorites);
      if (!user) {
        localStorage.setItem('flashcards_data_guest', JSON.stringify(freshFavorites));
      }
      window.dispatchEvent(new CustomEvent('favorites_updated', { detail: { all: true } }));
    }
  };

  const handleClearFavorites = async () => {
    if (window.confirm(getLocalText('clearFavorites') + "?")) {
      const freshFavorites: Record<string, FlashcardState> = {};
      // Delete/set isFavorite to false for all
      for (const id in favorites) {
        freshFavorites[id] = {
          ...favorites[id],
          isFavorite: false
        };
        if (user) {
          const docRef = doc(db, 'users', user.uid, 'flashcards', id);
          await setDoc(docRef, freshFavorites[id], { merge: true });
        }
      }
      setFavorites(freshFavorites);
      if (!user) {
        localStorage.setItem('flashcards_data_guest', JSON.stringify(freshFavorites));
      }
      window.dispatchEvent(new CustomEvent('favorites_updated', { detail: { all: true } }));
    }
  };

  // Filter which terms are in the review queue
  // A card is in queue if `isFavorite` is true AND (`nextReview` <= now or repetitions === 0)
  const getReviewQueue = (): LatinTerm[] => {
    const now = new Date();
    return terms.filter(t => {
      const fState = favorites[t.id];
      if (!fState || !fState.isFavorite) return false;
      if (fState.repetitions === 0) return true; // never studied
      const nextDate = new Date(fState.nextReview);
      return nextDate <= now;
    });
  };

  const handleStartReview = () => {
    const queue = getReviewQueue();
    if (queue.length === 0) {
      alert(language === 'uz' ? "Sizda bugun takrorlash uchun kartalar yo'q. Avval terminlar qo'shing yoki keyinroq qayting." : "У вас нет доступных карточек для повторения на сегодня.");
      return;
    }
    setActiveQueue(queue);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsStudying(true);
    setShowFinishedCeleb(false);
  };

  // Text-To-Speech Pronunciation
  const handleTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'la'; // Latin language code
      utterance.rate = 0.85; // slower speed for medical students
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Bu qurilmada ovozli sintezator ishlamaydi.");
    }
  };

  // Spaced Repetition logic (SM-2 Variant)
  // score: 1 = Hard, 3 = Good, 5 = Easy
  const submitReview = async (score: number) => {
    const currentTerm = activeQueue[currentIndex];
    const previousState = favorites[currentTerm.id] || {
      termId: currentTerm.id,
      isFavorite: true,
      interval: 0,
      repetitions: 0,
      easeFactor: 2.5,
      nextReview: new Date().toISOString()
    };

    let interval = 1;
    let repetitions = previousState.repetitions;
    let easeFactor = previousState.easeFactor;

    if (score === 1) {
      // Hard: reset repetitions, interval is 1 day, decrease easeFactor slightly
      repetitions = 0;
      interval = 1;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
    } else if (score === 3) {
      // Good
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 4; // 4 days later
      } else {
        interval = Math.round(previousState.interval * easeFactor);
      }
      repetitions += 1;
    } else {
      // Easy (score === 5)
      if (repetitions === 0) {
        interval = 3; // start from 3 days
      } else if (repetitions === 1) {
        interval = 7;
      } else {
        interval = Math.round(previousState.interval * easeFactor * 1.4);
      }
      repetitions += 1;
      easeFactor = Math.min(3.0, easeFactor + 0.15); // increase ease factor
    }

    // Schedule next review date
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + interval);

    const updatedState: FlashcardState = {
      ...previousState,
      repetitions,
      interval,
      easeFactor,
      nextReview: nextDate.toISOString(),
      lastReviewed: new Date().toISOString()
    };

    // Save state
    await saveTermState(currentTerm.id, updatedState);

    // Slide to next card
    setIsFlipped(false);
    
    // Delayed animation move
    setTimeout(() => {
      if (currentIndex + 1 < activeQueue.length) {
        setCurrentIndex(v => v + 1);
      } else {
        // Queue finished! celebrate!
        updateReviewStreak();
        setIsStudying(false);
        setShowFinishedCeleb(true);
      }
    }, 250);
  };

  const favoriteTermsList = terms.filter(t => favorites[t.id]?.isFavorite);
  const dueQueue = getReviewQueue();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-brand-muted text-xs font-black uppercase tracking-widest">{language === 'uz' ? "Yuklanmoqda..." : "Загрузка..."}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="flashcards-study-dashboard">
      <AnimatePresence mode="wait">
        
        {/* CELEBRATION CONGRATS CARD */}
        {showFinishedCeleb && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-2xl mx-auto bg-[#0F172A] p-12 rounded-[48px] border-2 border-brand-accent/30 text-center shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-brand-accent/20 rounded-full blur-[80px] -z-10 animate-pulse"></div>
            <div className="w-24 h-24 bg-brand-accent/10 border border-brand-accent/20 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
              <Award className="text-brand-accent w-12 h-12" />
            </div>
            
            <h2 className="text-4xl font-black text-white tracking-tight uppercase mb-4">
              {getLocalText("allDoneTitle")}
            </h2>
            <p className="text-slate-300 font-bold mb-8 max-w-md mx-auto leading-relaxed">
              {getLocalText("allDoneDesc")}
            </p>

            {/* Streak & Info */}
            <div className="flex justify-center gap-10 mb-10 bg-slate-800/50 p-6 rounded-3xl max-w-sm mx-auto border border-slate-700/50">
              <div className="text-left">
                <span className="text-xs text-slate-400 font-black tracking-widest uppercase block">{getLocalText("statsStreak")}</span>
                <span className="text-2xl font-black text-amber-400 flex items-center gap-1.5 mt-1">
                  <Flame className="w-6 h-6 fill-current animate-pulse" /> {streak} XP
                </span>
              </div>
              <div className="w-px bg-slate-700"></div>
              <div className="text-left">
                <span className="text-xs text-slate-400 font-black tracking-widest uppercase block">Takrorlangan</span>
                <span className="text-2xl font-black text-brand-accent flex items-center gap-1.5 mt-1">
                  <CheckCircle2 className="w-6 h-6" /> {activeQueue.length} ta
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowFinishedCeleb(false)}
              className="px-10 py-5 bg-gradient-to-r from-brand-accent to-blue-500 text-brand-primary rounded-[24px] text-sm font-black uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-brand-accent/20"
            >
              {getLocalText("backToDesk")}
            </button>
          </motion.div>
        )}

        {/* ACTIVE STUDY INTERFACE */}
        {!showFinishedCeleb && isStudying && activeQueue.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-2xl mx-auto"
          >
            {/* Queue progress */}
            <div className="flex items-center justify-between mb-8 px-2">
              <button 
                onClick={() => setIsStudying(false)}
                className="text-xs font-black text-brand-muted hover:text-brand-primary uppercase tracking-widest transition-colors flex items-center gap-1.5"
              >
                <ChevronRight className="w-4 h-4 rotate-180" /> {getLocalText("backToDesk")}
              </button>
              <div className="bg-white px-4 py-2 border border-brand-border rounded-full shadow-sm text-xs font-black text-brand-muted">
                <span className="text-brand-accent">{currentIndex + 1}</span> / {activeQueue.length}
              </div>
            </div>

            {/* FLIP CARD CONTAINER */}
            <div className="perspective-1000 w-full min-h-[360px] cursor-pointer mb-8" onClick={() => setIsFlipped(!isFlipped)}>
              <div className={`relative w-full min-h-[360px] duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                
                {/* CARD FRONT (LATIN) */}
                <div className="absolute inset-0 w-full h-full backface-hidden bg-[#0A0F1D] border-2 border-slate-800 rounded-[44px] p-10 flex flex-col justify-between shadow-2xl transition-all hover:border-brand-accent/40">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase px-3 py-1 bg-slate-800/40 border border-slate-700/50 rounded-full">{getLocalText('frontSide')}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTTS(activeQueue[currentIndex].latin);
                      }}
                      className="w-11 h-11 bg-slate-800 hover:bg-brand-accent hover:text-brand-primary text-brand-accent rounded-full flex items-center justify-center transition-all border border-slate-700/40 shadow-md group"
                      title={getLocalText('pronounceBtn')}
                    >
                      <Volume2 className="w-5 h-5 group-hover:scale-110" />
                    </button>
                  </div>

                  <div className="text-center py-8">
                    <p className="text-4xl md:text-5xl font-black italic tracking-tight text-white mb-4 leading-tight">
                      {activeQueue[currentIndex].latin}
                    </p>
                    <span className="text-[11px] font-bold text-slate-500 italic flex items-center justify-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-brand-accent animate-pulse" /> {getLocalText('tapToFlip')}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-500 font-bold border-t border-slate-800/80 pt-4">
                    <span>Anatomy System Flashcards</span>
                    <span>SM-2 Algoritm</span>
                  </div>
                </div>

                {/* CARD BACK (TRANSLATION) */}
                <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-white border border-brand-accent/20 rounded-[44px] p-10 flex flex-col justify-between shadow-2xl">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black tracking-widest text-brand-muted uppercase px-3 py-1 bg-slate-50 border border-brand-border rounded-full">{getLocalText('backSide')}</span>
                    <span className="text-[10px] font-black text-brand-accent uppercase tracking-wider bg-brand-bg px-3 py-1 rounded-full">Sevimli</span>
                  </div>

                  <div className="text-center py-6">
                    <p className="text-3xl md:text-4xl font-extrabold text-brand-primary mb-4 tracking-tight leading-tight">
                      {getLocalizedTermStr(activeQueue[currentIndex].uzbek)}
                    </p>
                    <p className="text-sm font-black uppercase text-brand-muted/70 tracking-widest mb-2">Original: {activeQueue[currentIndex].uzbek}</p>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-brand-muted font-black uppercase tracking-widest border-t border-slate-100 pt-4">
                    <span>O'zlashtirish darajasi: {(favorites[activeQueue[currentIndex].id]?.repetitions || 0) + 1}</span>
                    <span>Interval: {favorites[activeQueue[currentIndex].id]?.interval || 0} kun</span>
                  </div>
                </div>

              </div>
            </div>

            {/* GRADES AND ACTION BUTTONS */}
            <AnimatePresence>
              {isFlipped && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-3 gap-4"
                >
                  {/* RED / HARD */}
                  <button
                    onClick={() => submitReview(1)}
                    className="flex flex-col items-center justify-center p-5 bg-red-50 hover:bg-red-100/80 border border-red-200 rounded-3xl transition-all shadow-md active:scale-95 group text-center"
                  >
                    <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition-transform shadow-lg shadow-red-200">
                      🔴
                    </div>
                    <span className="text-xs font-black text-red-700 tracking-tight uppercase leading-none">{getLocalText('hard')}</span>
                  </button>

                  {/* YELLOW / GOOD */}
                  <button
                    onClick={() => submitReview(3)}
                    className="flex flex-col items-center justify-center p-5 bg-amber-50 hover:bg-amber-100/80 border border-amber-200 rounded-3xl transition-all shadow-md active:scale-95 group text-center"
                  >
                    <div className="w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition-transform shadow-lg shadow-amber-200">
                      🟡
                    </div>
                    <span className="text-xs font-black text-amber-700 tracking-tight uppercase leading-none">{getLocalText('good')}</span>
                  </button>

                  {/* GREEN / EASY */}
                  <button
                    onClick={() => submitReview(5)}
                    className="flex flex-col items-center justify-center p-5 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-3xl transition-all shadow-md active:scale-95 group text-center"
                  >
                    <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold mb-2 group-hover:scale-105 transition-transform shadow-lg shadow-emerald-200">
                      🟢
                    </div>
                    <span className="text-xs font-black text-emerald-700 tracking-tight uppercase leading-none">{getLocalText('easy')}</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* DEFAULT DASHBOARD MODE */}
        {!showFinishedCeleb && !isStudying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-10"
          >
            {/* Upper study banner / motivation dashboard */}
            <div className="bg-white p-8 sm:p-12 rounded-[48px] border border-brand-border shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8">
              
              <div className="space-y-4 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-black border border-amber-100 uppercase tracking-widest mb-2">
                  <Flame className="w-3.5 h-3.5 fill-current animate-pulse" /> {streak} XP {getLocalText('statsStreak')}
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-brand-primary uppercase tracking-tight leading-tight">
                  {getLocalText('quickStartTitle')}
                </h2>
                <p className="text-brand-muted text-sm font-medium leading-relaxed">
                  {getLocalText('subtitle')}
                </p>
                
                {!user && (
                  <p className="text-xs font-black text-orange-500 bg-orange-50 border border-orange-100 p-3 rounded-2xl flex items-center gap-2">
                    <AlertCircle size={16} /> {getLocalText('notLoggedIn')}
                  </p>
                )}
              </div>

              {/* STATS BENTO BARS */}
              <div className="grid grid-cols-2 gap-4 shrink-0 w-full md:w-auto">
                <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl text-center">
                  <Bookmark className="w-6 h-6 text-brand-accent mx-auto mb-2" />
                  <span className="text-[10px] font-black text-brand-muted uppercase tracking-wider block leading-none">{getLocalText('statsAll')}</span>
                  <span className="text-2xl font-black text-brand-primary mt-1 block">{favoriteTermsList.length}</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl text-center relative overflow-hidden">
                  {dueQueue.length > 0 && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>}
                  <Calendar className="w-6 h-6 text-red-400 mx-auto mb-2" />
                  <span className="text-[10px] font-black text-brand-muted uppercase tracking-wider block leading-none">{getLocalText('statsDue')}</span>
                  <span className="text-2xl font-black text-slate-800 mt-1 block">{dueQueue.length}</span>
                </div>
              </div>

            </div>

            {/* ACTION TRIGGERS & CARD GRID */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
                <div>
                  <h3 className="text-xl font-black text-brand-primary uppercase tracking-tight">takrorlash navbati</h3>
                  <p className="text-xs font-black text-brand-muted uppercase tracking-widest mt-1">
                    {getLocalText('cardCount').replace('{count}', favoriteTermsList.length.toString())}
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleAddAllTerms}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-brand-primary rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                  >
                    {getLocalText('addAllTerms')}
                  </button>
                  <button
                    onClick={handleClearFavorites}
                    className="px-5 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                  >
                    {getLocalText('clearFavorites')}
                  </button>
                  
                  {dueQueue.length > 0 && (
                    <button
                      onClick={handleStartReview}
                      className="px-7 py-3.5 bg-[#0B0F17] hover:bg-[#1A2333] text-brand-accent border border-brand-accent/20 rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-lg transition-all flex items-center gap-2 hover:scale-102 active:scale-98"
                    >
                      <Play className="w-3.5 h-3.5 fill-current animate-pulse" /> {getLocalText('reviewNowBtn')}
                    </button>
                  )}
                </div>
              </div>

              {favoriteTermsList.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-[40px] border border-brand-border border-dashed">
                  <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart size={30} />
                  </div>
                  <h4 className="text-lg font-black text-brand-primary uppercase tracking-tight">{getLocalText('emptyFavoritesTitle')}</h4>
                  <p className="text-brand-muted font-medium text-xs mt-1.5 max-w-sm mx-auto leading-relaxed">
                    {getLocalText('emptyFavoritesDesc')}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {favoriteTermsList.map(term => {
                    const progress = favorites[term.id];
                    const now = new Date();
                    const isDue = !progress || progress.repetitions === 0 || new Date(progress.nextReview) <= now;

                    return (
                      <div 
                        key={term.id}
                        className="bg-white p-6 rounded-[28px] border border-brand-border hover:border-brand-accent/30 hover:shadow-xl transition-all relative overflow-hidden group flex flex-col justify-between min-h-[160px]"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black text-brand-muted uppercase tracking-widest">takrorlash</span>
                            <button
                              onClick={() => handleToggleFavorite(term.id)}
                              className="text-red-500 hover:scale-110 active:scale-90 transition-all"
                              title="Sevimli ro'yxatdan o'chirish"
                            >
                              <Heart className="w-4 h-4 fill-current text-red-500" />
                            </button>
                          </div>
                          <h4 className="text-lg font-black text-brand-primary italic group-hover:text-brand-accent transition-colors truncate">
                            {term.latin}
                          </h4>
                          <p className="text-xs font-bold text-slate-500 leading-tight">
                            {getLocalizedTermStr(term.uzbek)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-4 text-[9px] font-black uppercase tracking-widest">
                          <span className={`px-2 py-0.5 rounded-full ${isDue ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                            {isDue ? "O'rganish kerak" : "Ertaroq xotirada"}
                          </span>
                          <span className="text-slate-400">takrorlash: {progress?.repetitions || 0}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
