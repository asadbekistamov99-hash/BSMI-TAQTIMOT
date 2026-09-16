import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Check, 
  X, 
  HelpCircle, 
  Volume2, 
  Award, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  Trophy,
  History,
  Activity,
  CheckCircle2,
  BookOpen,
  Filter,
  GraduationCap,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { 
  ALL_TOPIC_GLOSSARY_TERMS, 
  TOPIC_GLOSSARY_METADATA, 
  TopicGlossaryTerm 
} from '../data/topicGlossaryData';

export interface DictationTerm {
  id: string;
  latin: string;
  uzbek: string;
  russian?: string;
  english?: string;
  semester?: number;
  topicOrder?: number;
}

interface AnatomicalDictationProps {
  user?: any;
  terms?: DictationTerm[];
  allAvailableTerms?: DictationTerm[];
  initialSemester?: number;
  initialTopic?: number;
  onSelectTopic?: (sem: number, top: number) => void;
  getLocalizedTermStr: (uzb: string) => string;
}

export default function AnatomicalDictation({ 
  user, 
  terms = [], 
  allAvailableTerms = [], 
  initialSemester = 1,
  initialTopic = 1,
  onSelectTopic,
  getLocalizedTermStr 
}: AnatomicalDictationProps) {
  const { language } = useLanguage();

  // Active topic filters for dictation
  const [selectedSemester, setSelectedSemester] = useState<number>(() => {
    return initialSemester && initialSemester > 0 ? initialSemester : 1;
  });
  const [selectedTopicOrder, setSelectedTopicOrder] = useState<number>(() => {
    return initialTopic && initialTopic > 0 ? initialTopic : 1;
  });
  const [questionCount, setQuestionCount] = useState<number | 'all'>(10);

  // Synchronize when initial props change
  useEffect(() => {
    if (initialSemester && initialSemester > 0) {
      setSelectedSemester(initialSemester);
    }
  }, [initialSemester]);

  useEffect(() => {
    if (initialTopic && initialTopic > 0) {
      setSelectedTopicOrder(initialTopic);
    }
  }, [initialTopic]);

  // Master term pool filtered STRICTLY by selected semester & topic
  const topicSpecificTerms = useMemo(() => {
    const sem = selectedSemester > 0 ? selectedSemester : 1;
    const order = selectedTopicOrder > 0 ? selectedTopicOrder : 1;

    // 1. If specific terms prop is passed and has matching terms:
    if (terms && terms.length > 0) {
      const propMatches = terms.filter(t => {
        const tSem = t.semester !== undefined ? Number(t.semester) : sem;
        const tOrder = t.topicOrder !== undefined ? Number(t.topicOrder) : order;
        return tSem === sem && tOrder === order;
      });
      if (propMatches.length > 0) return propMatches;
    }

    // 2. Check allAvailableTerms from parent (including Firestore overrides)
    if (allAvailableTerms && allAvailableTerms.length > 0) {
      const matched = allAvailableTerms.filter(t => {
        return Number(t.semester) === sem && Number(t.topicOrder) === order;
      });
      if (matched.length > 0) return matched;
    }

    // 3. Fallback: direct lookup in static curriculum terms
    return ALL_TOPIC_GLOSSARY_TERMS.filter(t => {
      return Number(t.semester) === sem && Number(t.topicOrder) === order;
    });
  }, [terms, allAvailableTerms, selectedSemester, selectedTopicOrder]);

  // Current topic title helper
  const topicMetaKey = `sem${selectedSemester}_top${selectedTopicOrder}`;
  const topicMeta = TOPIC_GLOSSARY_METADATA[topicMetaKey];
  const topicTitle = topicMeta 
    ? (topicMeta.title[language as 'uz' | 'ru' | 'en'] || topicMeta.title.uz)
    : `${selectedSemester}-Semestr ${selectedTopicOrder}-Mavzu`;

  // Game state
  const [activeTerms, setActiveTerms] = useState<DictationTerm[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [gameState, setGameState] = useState<'pending' | 'playing' | 'checking' | 'completed'>('pending');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; matchedExactly: boolean } | null>(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [historyLog, setHistoryLog] = useState<{ term: DictationTerm; input: string; isCorrect: boolean }[]>([]);

  const dictationText: Record<string, Record<string, string>> = {
    uz: {
      title: "Anatomik Diktant Shouloti",
      subtitle: "Faqat tanlangan mavzuga oid lotincha terminlarning to'g'ri imlosi va talaffuzini mashq qiling.",
      selectTopicPrompt: "Diktant uchun mavzuni tanlang:",
      startBtn: "Diktantni Boshlash",
      nextBtn: "Keyingi termin",
      checkBtn: "Tekshirish",
      inputPlaceholder: "Lotincha nomini yozing...",
      hintBtn: "Bosh harfini ko'rish",
      correct: "To'g'ri!",
      incorrect: "Noto'g'ri!",
      exactMatch: "Imlo qoidasiga to'liq rioya qilindi!",
      correctWas: "To'g'ri javob:",
      yourAnswer: "Sizning javobingiz:",
      completedTitle: "Mavzu Diktanti Yakunlandi!",
      scoreLabel: "To'plangan Ball:",
      accuracy: "Anliqlik Darajasi:",
      streakLabel: "Faollik Davomiyligi:",
      restartBtn: "Ushbu mavzuni qayta topshirish",
      nextTopicBtn: "Keyingi mavzu diktanti",
      changeTopicBtn: "Boshqa mavzuni tanlash",
      emptyTerms: "Ushbu mavzuga oid terminlar tayyorlanmoqda.",
      tip: "Lotin tilidagi qo'shimchalar (-alis, -aris, -icus) va unlilarning to'g'ri yozilishiga e'tibor bering.",
      availableTerms: "ta termin mavjud"
    },
    ru: {
      title: "Анатомический Диктант",
      subtitle: "Тренируйте правильное написание и произношение терминов строго по выбранной теме.",
      selectTopicPrompt: "Выберите тему для диктанта:",
      startBtn: "Начать диктант",
      nextBtn: "Следующий термин",
      checkBtn: "Проверить",
      inputPlaceholder: "Введите латинское название...",
      hintBtn: "Подсказка",
      correct: "Правильно!",
      incorrect: "Неправильно!",
      exactMatch: "Орфография соблюдена идеально!",
      correctWas: "Правильный ответ:",
      yourAnswer: "Ваш ответ:",
      completedTitle: "Диктант по теме завершен!",
      scoreLabel: "Набранные Баллы:",
      accuracy: "Точность ответов:",
      streakLabel: "Серия ответов:",
      restartBtn: "Пройти эту тему заново",
      nextTopicBtn: "Диктант по следующей теме",
      changeTopicBtn: "Выбрать другую тему",
      emptyTerms: "Термины для этой темы загружаются.",
      tip: "Обращайте внимание на латинские окончания и орфографические особенности.",
      availableTerms: "терминов доступно"
    },
    en: {
      title: "Topic Anatomy Dictation",
      subtitle: "Practice accurate Latin spelling and pronunciation exclusively tailored to your chosen topic.",
      selectTopicPrompt: "Select curriculum topic for dictation:",
      startBtn: "Start Topic Dictation",
      nextBtn: "Next Term",
      checkBtn: "Check Spelling",
      inputPlaceholder: "Type the Latin term...",
      hintBtn: "Reveal Hint",
      correct: "Correct Spell!",
      incorrect: "Incorrect Spell!",
      exactMatch: "Pristine spelling match!",
      correctWas: "Correct term:",
      yourAnswer: "Your spelling:",
      completedTitle: "Topic Dictation Complete!",
      scoreLabel: "Final Score:",
      accuracy: "Spelling Accuracy:",
      streakLabel: "Current Streak:",
      restartBtn: "Retake this Topic",
      nextTopicBtn: "Next Topic Dictation",
      changeTopicBtn: "Change Topic",
      emptyTerms: "Terms for this topic are being loaded.",
      tip: "Pay close attention to Latin anatomical declensions and vowel pairs.",
      availableTerms: "terms available"
    }
  };

  const getT = (key: string): string => {
    const lang = language === 'uz' || language === 'ru' || language === 'en' ? language : 'uz';
    return dictationText[lang]?.[key] || dictationText['uz']?.[key] || '';
  };

  const speakLatin = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'la';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startNewGame = () => {
    if (topicSpecificTerms.length === 0) return;
    
    // Shuffle strictly topic-specific terms
    const shuffled = [...topicSpecificTerms].sort(() => 0.5 - Math.random());
    const count = questionCount === 'all' 
      ? shuffled.length 
      : Math.min(questionCount, shuffled.length);
    
    const selectedBatch = shuffled.slice(0, count);
    setActiveTerms(selectedBatch);
    setCurrentIndex(0);
    setScore(0);
    setUserInput('');
    setStreak(0);
    setHistoryLog([]);
    setFeedback(null);
    setShowHint(false);
    setGameState('playing');
    
    // Auto-pronounce the first term
    setTimeout(() => {
      if (selectedBatch[0]) {
        speakLatin(selectedBatch[0].latin);
      }
    }, 400);
  };

  const currentTerm = activeTerms[currentIndex];

  const handleCheck = () => {
    if (gameState !== 'playing' || !currentTerm) return;

    const cleanedInput = userInput.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    const cleanedTarget = currentTerm.latin.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

    const isMatch = cleanedInput === cleanedTarget;
    const isExact = userInput.trim() === currentTerm.latin.trim();

    if (isMatch) {
      setScore(prev => prev + 1);
      setStreak(prev => {
        const next = prev + 1;
        if (next > bestStreak) setBestStreak(next);
        return next;
      });
      setFeedback({ isCorrect: true, matchedExactly: isExact });
    } else {
      setStreak(0);
      setFeedback({ isCorrect: false, matchedExactly: false });
    }

    setHistoryLog(prev => [
      ...prev,
      {
        term: currentTerm,
        input: userInput,
        isCorrect: isMatch
      }
    ]);

    setGameState('checking');
    speakLatin(currentTerm.latin);
  };

  const handleNext = () => {
    if (currentIndex + 1 < activeTerms.length) {
      setCurrentIndex(prev => prev + 1);
      setUserInput('');
      setFeedback(null);
      setShowHint(false);
      setGameState('playing');
      
      setTimeout(() => {
        if (activeTerms[currentIndex + 1]) {
          speakLatin(activeTerms[currentIndex + 1].latin);
        }
      }, 300);
    } else {
      setGameState('completed');
    }
  };

  const handleTopicSelection = (sem: number, top: number) => {
    setSelectedSemester(sem);
    setSelectedTopicOrder(top);
    setGameState('pending');
    if (onSelectTopic) {
      onSelectTopic(sem, top);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-1">
      {/* 1. TOPIC SELECTION & START SCREEN */}
      {gameState === 'pending' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 sm:p-10 rounded-[36px] shadow-2xl shadow-slate-200/60 border border-slate-200/80 text-center flex flex-col gap-6 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-brand-accent via-indigo-500 to-sky-400" />
          
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-50 to-sky-50 rounded-2xl flex items-center justify-center text-brand-primary border border-indigo-100 mx-auto shadow-sm">
            <GraduationCap className="w-9 h-9 text-brand-primary" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              {getT('title')}
            </h2>
            <p className="text-slate-500 font-medium max-w-lg mx-auto text-xs sm:text-sm leading-relaxed">
              {getT('subtitle')}
            </p>
          </div>

          {/* Topic Picker Controls */}
          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200/80 text-left space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-brand-accent" />
                {getT('selectTopicPrompt')}
              </span>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {topicSpecificTerms.length} {getT('availableTerms')}
              </span>
            </div>

            {/* Semester Selector Tabs */}
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map(sem => (
                <button
                  key={sem}
                  onClick={() => handleTopicSelection(sem, selectedTopicOrder)}
                  className={`py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    selectedSemester === sem
                      ? 'bg-brand-primary text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {sem}-Semestr
                </button>
              ))}
            </div>

            {/* Topic Dropdown / Selector */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                Mavzuni tanlang (1 dan 13 gacha):
              </label>
              <select
                value={selectedTopicOrder}
                onChange={(e) => handleTopicSelection(selectedSemester, Number(e.target.value))}
                className="w-full bg-white border-2 border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-slate-800 focus:border-brand-accent focus:outline-none transition-colors"
              >
                {Array.from({ length: 13 }, (_, i) => i + 1).map(order => {
                  const key = `sem${selectedSemester}_top${order}`;
                  const meta = TOPIC_GLOSSARY_METADATA[key];
                  const title = meta 
                    ? (meta.title[language as 'uz' | 'ru' | 'en'] || meta.title.uz) 
                    : `${order}-Mavzu`;
                  
                  // Count words for this topic
                  const count = ALL_TOPIC_GLOSSARY_TERMS.filter(
                    t => t.semester === selectedSemester && t.topicOrder === order
                  ).length;

                  return (
                    <option key={order} value={order}>
                      {order}-Mavzu: {title.length > 55 ? title.substring(0, 52) + '...' : title} ({count} termin)
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Active Topic Banner */}
            <div className="p-3.5 bg-white rounded-2xl border border-indigo-100 shadow-sm flex items-center justify-between gap-3">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500 block">
                  Tanlangan Mavzu
                </span>
                <p className="text-xs font-black text-slate-800 line-clamp-1 mt-0.5">
                  {topicTitle}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <span className="text-[10px] font-bold text-slate-400 block">
                  Savollar soni:
                </span>
                <div className="flex gap-1 mt-1">
                  {[5, 10, 'all'].map((opt) => (
                    <button
                      key={String(opt)}
                      onClick={() => setQuestionCount(opt as any)}
                      className={`px-2 py-0.5 rounded text-[10px] font-black uppercase transition-all ${
                        questionCount === opt
                          ? 'bg-brand-accent text-slate-900 shadow-sm'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {opt === 'all' ? 'Hammasi' : opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/60 flex items-start gap-3 text-left max-w-md mx-auto">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 font-medium leading-relaxed">
              <strong>💡 {getT('tip')}</strong>
            </p>
          </div>

          <button
            onClick={startNewGame}
            disabled={topicSpecificTerms.length === 0}
            className="px-10 py-4.5 bg-brand-primary hover:bg-slate-900 text-brand-accent hover:text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-brand-primary/10 self-center flex items-center gap-2.5 cursor-pointer border border-brand-accent/30 disabled:opacity-40"
          >
            <Play className="w-4 h-4 fill-brand-accent" />
            {getT('startBtn')} ({topicSpecificTerms.length} termin)
          </button>
        </motion.div>
      )}

      {/* 2. ACTIVE DICTATION DRILL SCREEN */}
      {(gameState === 'playing' || gameState === 'checking') && (
        <div className="grid grid-cols-1 gap-5">
          {/* Header & Topic Banner */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  {selectedSemester}-Semestr • {selectedTopicOrder}-Mavzu
                </span>
                <p className="text-xs font-black text-slate-800 line-clamp-1">
                  {topicTitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-1.5 bg-slate-50 py-1.5 px-3 border border-slate-100 rounded-full text-[10px] font-black text-slate-500 tracking-wider uppercase">
                <Activity className="w-3.5 h-3.5 text-brand-accent" />
                {currentIndex + 1} / {activeTerms.length}
              </div>

              <div className="flex items-center gap-1 bg-amber-50 text-amber-700 py-1.5 px-3 border border-amber-200 rounded-full text-[10px] font-black tracking-wider uppercase">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                {score}
              </div>

              {streak > 0 && (
                <div className="flex items-center gap-1 bg-orange-50 text-orange-600 py-1.5 px-3 border border-orange-200 rounded-full text-[10px] font-black tracking-wider uppercase animate-bounce">
                  🔥 {streak}
                </div>
              )}

              <button
                onClick={() => setGameState('pending')}
                className="text-[10px] font-bold text-slate-400 hover:text-slate-700 underline shrink-0 cursor-pointer ml-1"
              >
                Mavzuni o'zgartirish
              </button>
            </div>
          </div>

          {/* Question / Spelling Card */}
          <motion.div 
            layout
            className="bg-white p-6 sm:p-10 rounded-[36px] border border-slate-200 shadow-2xl shadow-slate-200/40 relative overflow-hidden flex flex-col gap-6 text-center"
          >
            <div className="absolute top-0 left-0 w-2.5 h-full bg-brand-accent" />
            
            <div className="space-y-2">
              <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase block bg-slate-50 py-1 px-3.5 rounded-xl max-w-max mx-auto border border-slate-100">
                {language === 'uz' ? "TARJIMASI (O'ZBEKCHA)" : language === 'ru' ? 'РУССКИЙ ПЕРЕВОД' : 'MEANING CUE'}
              </span>
              <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-800 tracking-tight leading-tight">
                {getLocalizedTermStr(currentTerm?.uzbek)}
              </h3>
              {currentTerm?.russian && (
                <p className="text-xs sm:text-sm font-semibold text-slate-400 italic">
                  RU: {currentTerm.russian}
                </p>
              )}
            </div>

            {/* Audio pronunciation button */}
            <div className="flex justify-center gap-3">
              <button
                onClick={() => speakLatin(currentTerm?.latin)}
                className="w-14 h-14 bg-sky-50 hover:bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center transition-all cursor-pointer group shadow-sm border border-sky-100"
                title="Qayta talaffuz qilish"
              >
                <Volume2 className="w-6 h-6 group-hover:scale-110 active:scale-95 transition-transform" />
              </button>
            </div>

            {/* Input field */}
            <div className="space-y-3 max-w-md mx-auto w-full">
              <div className="relative">
                <input 
                  type="text"
                  value={userInput}
                  disabled={gameState === 'checking'}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && userInput.trim() && handleCheck()}
                  placeholder={getT('inputPlaceholder')}
                  autoFocus
                  className={`w-full p-4.5 bg-slate-50 border-2 font-black italic text-lg sm:text-xl tracking-tight text-center rounded-2xl outline-none transition-all placeholder:text-slate-400 placeholder:not-italic ${
                    gameState === 'checking'
                      ? feedback?.isCorrect
                        ? 'border-emerald-500 bg-emerald-50/30 text-emerald-700'
                        : 'border-red-500 bg-red-50/30 text-red-600'
                      : 'border-slate-200 focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-sky-100'
                  }`}
                />
              </div>

              {/* Reveal hint */}
              {gameState === 'playing' && (
                <div className="text-right">
                  {showHint ? (
                    <span className="text-xs font-mono text-amber-600 font-bold tracking-widest uppercase animate-pulse">
                      HINT: {currentTerm?.latin.substring(0, 2) + '*'.repeat(Math.max(2, currentTerm?.latin.length - 2))}
                    </span>
                  ) : (
                    <button
                      onClick={() => setShowHint(true)}
                      className="text-[10px] font-black text-slate-400 hover:text-brand-primary uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      💡 {getT('hintBtn')}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Validation Feedback */}
            <AnimatePresence>
              {gameState === 'checking' && feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className={`p-5 rounded-2xl border flex flex-col gap-1.5 items-center justify-center text-center max-w-md mx-auto w-full ${
                    feedback.isCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {feedback.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="text-sm font-black uppercase tracking-wider">
                      {feedback.isCorrect ? getT('correct') : getT('incorrect')}
                    </span>
                  </div>

                  <p className="text-xs font-bold mt-1">
                    {getT('correctWas')}{' '}
                    <span className="font-black italic text-base sm:text-lg text-slate-900">
                      {currentTerm?.latin}
                    </span>
                  </p>

                  {!feedback.isCorrect && userInput.trim() && (
                    <p className="text-[11px] font-bold opacity-75">
                      {getT('yourAnswer')}{' '}
                      <span className="italic font-extrabold line-through">{userInput}</span>
                    </p>
                  )}

                  {feedback.isCorrect && feedback.matchedExactly && (
                    <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md mt-1 animate-pulse">
                      ✨ {getT('exactMatch')}
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next / Check action */}
            <div className="flex justify-center border-t border-slate-100 pt-5">
              {gameState === 'playing' ? (
                <button
                  onClick={handleCheck}
                  disabled={!userInput.trim()}
                  className="px-8 py-3.5 bg-brand-primary hover:bg-slate-900 text-brand-accent hover:text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all disabled:opacity-40 cursor-pointer shadow-md flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  {getT('checkBtn')}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-2 animate-pulse"
                >
                  {getT('nextBtn')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* 3. COMPLETED STATE */}
      {gameState === 'completed' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-6 sm:p-12 rounded-[36px] border border-slate-200 shadow-2xl text-center flex flex-col gap-6 relative overflow-hidden"
        >
          <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center text-amber-500 border border-amber-200 mx-auto shadow-sm">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 py-1 px-3 rounded-full border border-indigo-100">
              {selectedSemester}-Semestr • {selectedTopicOrder}-Mavzu
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 uppercase tracking-tight">
              {getT('completedTitle')}
            </h2>
            <p className="text-slate-500 font-bold text-xs">
              {topicTitle}
            </p>
          </div>

          {/* Analytics block */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto w-full pt-2">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block">
                {getT('scoreLabel')}
              </span>
              <span className="text-xl font-black text-slate-800 tracking-tight block mt-1">
                {score} / {activeTerms.length}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block">
                {getT('accuracy')}
              </span>
              <span className="text-xl font-black text-indigo-600 tracking-tight block mt-1">
                {activeTerms.length ? Math.round((score / activeTerms.length) * 100) : 0}%
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block">
                Eng yaxshi seriya
              </span>
              <span className="text-xl font-black text-orange-500 tracking-tight block mt-1">
                🔥 {bestStreak}
              </span>
            </div>
          </div>

          {/* Summary log */}
          {historyLog.length > 0 && (
            <div className="border-t border-slate-100 pt-5 text-left">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-slate-400" />
                Diktantda qatnashgan so'zlar ro'yxati:
              </h4>
              <div className="max-h-52 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {historyLog.map((log, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                      log.isCorrect 
                        ? 'bg-emerald-50/40 border-emerald-200' 
                        : 'bg-red-50/40 border-red-200'
                    }`}
                  >
                    <div>
                      <p className="font-black italic text-slate-800">
                        {log.term.latin}
                      </p>
                      <span className="text-[10px] font-medium text-slate-500">
                        {getLocalizedTermStr(log.term.uzbek)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        log.isCorrect 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {log.input || 'Bo\'sh'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={startNewGame}
              className="w-full sm:w-auto px-6 py-3.5 bg-brand-primary hover:bg-slate-900 text-brand-accent hover:text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              {getT('restartBtn')}
            </button>

            {selectedTopicOrder < 13 && (
              <button
                onClick={() => handleTopicSelection(selectedSemester, selectedTopicOrder + 1)}
                className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{getT('nextTopicBtn')} ({selectedTopicOrder + 1}-Mavzu)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setGameState('pending')}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
            >
              {getT('changeTopicBtn')}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
