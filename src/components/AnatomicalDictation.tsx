import React, { useState, useEffect } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface LatinTerm {
  id: string;
  latin: string;
  uzbek: string;
}

interface AnatomicalDictationProps {
  user: any;
  terms: LatinTerm[];
  getLocalizedTermStr: (uzb: string) => string;
}

export default function AnatomicalDictation({ user, terms, getLocalizedTermStr }: AnatomicalDictationProps) {
  const { language } = useLanguage();
  const [activeTerms, setActiveTerms] = useState<LatinTerm[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [gameState, setGameState] = useState<'pending' | 'playing' | 'checking' | 'completed'>('pending');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; matchedExactly: boolean } | null>(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [historyLog, setHistoryLog] = useState<{ term: LatinTerm; input: string; isCorrect: boolean }[]>([]);

  const dictationText: Record<string, Record<string, string>> = {
    uz: {
      title: "Anatomik Diktant Shouloti",
      subtitle: "Lotincha terminlarning yozilish imlosini va talaffuzini mustahkamlang.",
      startBtn: "Diktantni Boshlash",
      nextBtn: "Keyingi termin",
      checkBtn: "Tekshirish",
      inputPlaceholder: "Lotincha nomini yozing...",
      hintBtn: "Maslahat olish",
      correct: "To'g'ri!",
      incorrect: "Noto'g'ri!",
      exactMatch: "Imlo qoidasiga to'liq rioya qilindi!",
      correctWas: "To'g'ri javob:",
      yourAnswer: "Sizning javobingiz:",
      completedTitle: "Diktant Yakunlandi!",
      scoreLabel: "To'plangan Ball:",
      accuracy: "Anliqlik Darajasi:",
      streakLabel: "Faollik Davomiyligi:",
      restartBtn: "Yana bir bor urinish",
      emptyTerms: "Imlo mashqi uchun kamida bitta termin mavjud bo'lishi kerak.",
      tip: "Loyiha bo'yicha lotin alifbosi harflari va to'g'ri urg'ularga ahamiyat bering."
    },
    ru: {
      title: "Анатомический Диктант",
      subtitle: "Закрепите правильное написание и произношение латинских терминов.",
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
      completedTitle: "Диктант Завершен!",
      scoreLabel: "Набранные Баллы:",
      accuracy: "Точность ответов:",
      streakLabel: "Серия ответов:",
      restartBtn: "Попробовать снова",
      emptyTerms: "Для диктанта необходимо наличие терминов.",
      tip: "Обращайте внимание на правильное латинское правописание и окончания."
    },
    en: {
      title: "Anatomy Spelling Dictation",
      subtitle: "Verify and perfect your spelling and pronunciation of Latin clinical terms.",
      startBtn: "Start Dictation",
      nextBtn: "Next Term",
      checkBtn: "Check Spelling",
      inputPlaceholder: "Type the Latin term here...",
      hintBtn: "Reveal Hint",
      correct: "Correct Spell!",
      incorrect: "Incorrect Spell!",
      exactMatch: "Pristine spelling match!",
      correctWas: "Correct term:",
      yourAnswer: "Your spelling:",
      completedTitle: "Dictation Complete!",
      scoreLabel: "Final Score:",
      accuracy: "Spelling Accuracy:",
      streakLabel: "Current Streak:",
      restartBtn: "Try Another Drill",
      emptyTerms: "At least one glossary term is required to start spelling.",
      tip: "Watch out for Latin suffixes, declensions, and anatomical consonants."
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
      utterance.lang = 'la'; // Latin voice code
      utterance.rate = 0.85; // slightly slower for clarity
      window.speechSynthesis.speak(utterance);
    }
  };

  const startNewGame = () => {
    if (terms.length === 0) return;
    // Shuffle and pick 10 terms for the dictation
    const shuffled = [...terms].sort(() => 0.5 - Math.random()).slice(0, 10);
    setActiveTerms(shuffled);
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
      if (shuffled[0]) {
        speakLatin(shuffled[0].latin);
      }
    }, 400);
  };

  const currentTerm = activeTerms[currentIndex];

  const handleCheck = () => {
    if (gameState !== 'playing' || !currentTerm) return;

    const cleanedInput = userInput.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    const cleanedTarget = currentTerm.latin.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");

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
    speakLatin(currentTerm.latin); // Speak again on validation
  };

  const handleNext = () => {
    if (currentIndex + 1 < activeTerms.length) {
      setCurrentIndex(prev => prev + 1);
      setUserInput('');
      setFeedback(null);
      setShowHint(false);
      setGameState('playing');
      
      // Auto-pronounce
      setTimeout(() => {
        if (activeTerms[currentIndex + 1]) {
          speakLatin(activeTerms[currentIndex + 1].latin);
        }
      }, 300);
    } else {
      setGameState('completed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-1">
      {gameState === 'pending' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-[48px] shadow-2xl shadow-slate-200/50 border border-slate-100 text-center flex flex-col gap-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-accent to-sky-400" />
          <div className="w-20 h-20 bg-brand-bg rounded-[28px] flex items-center justify-center text-brand-primary border border-brand-border mx-auto shadow-md">
            <Volume2 className="w-10 h-10 text-brand-accent" />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
              {getT('title')}
            </h2>
            <p className="text-slate-500 font-bold max-w-lg mx-auto text-sm leading-relaxed">
              {getT('subtitle')}
            </p>
          </div>

          <div className="p-4.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3 text-left max-w-md mx-auto">
            <AlertCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              <strong>💡 {getT('tip')}</strong>
            </p>
          </div>

          <button
            onClick={startNewGame}
            disabled={terms.length === 0}
            className="px-10 py-5 bg-brand-primary hover:bg-slate-850 text-brand-accent hover:text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-brand-primary/10 self-center flex items-center gap-2 cursor-pointer border border-brand-accent/20"
          >
            <Play className="w-4 h-4 fill-brand-accent" />
            {getT('startBtn')}
          </button>
        </motion.div>
      )}

      {gameState === 'playing' || gameState === 'checking' ? (
        <div className="grid grid-cols-1 gap-6">
          
          {/* Progress Tracker Widget */}
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-1.5 bg-white py-1.5 px-3.5 border border-slate-100 rounded-full text-[10px] font-black text-slate-400 tracking-wider uppercase shadow-sm">
              <Activity className="w-3.5 h-3.5 text-brand-accent" />
              Progress: <span className="text-slate-700 font-black">{currentIndex + 1} / {activeTerms.length}</span>
            </div>
            
            <div className="flex gap-4">
              <div className="flex items-center gap-1 bg-amber-50 text-amber-600 py-1.5 px-3 border border-amber-100 rounded-full text-[10px] font-black tracking-wider uppercase shadow-sm">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                Score: <span className="font-extrabold">{score}</span>
              </div>

              {streak > 0 && (
                <div className="flex items-center gap-1 bg-orange-50 text-orange-600 py-1.5 px-3 border border-orange-150 rounded-full text-[10px] font-black tracking-wider uppercase animate-bounce shadow-sm">
                  🔥 Streak: <span className="font-extrabold">{streak}</span>
                </div>
              )}
            </div>
          </div>

          {/* Spelling Card */}
          <motion.div 
            layout
            className="bg-white p-8 md:p-12 rounded-[48px] border border-slate-200/80 shadow-2xl shadow-slate-200/40 relative overflow-hidden flex flex-col gap-8 text-center"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-brand-accent" />
            
            <div className="space-y-4">
              <span className="text-[10px] font-black text-slate-400 tracking-wider uppercase block bg-slate-50 py-1.5 px-4 rounded-xl max-w-max mx-auto border border-slate-100">
                {language === 'uz' ? 'TARJIMASI TAQDIM ETILDI' : language === 'ru' ? 'СЛУХОВОЙ ОРИЕНТИР' : 'TRANSLATED CUE'}
              </span>
              <h3 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight leading-none">
                {getLocalizedTermStr(currentTerm?.uzbek)}
              </h3>
            </div>

            {/* Audio recitation button */}
            <div className="flex justify-center gap-3">
              <button
                onClick={() => speakLatin(currentTerm?.latin)}
                className="w-16 h-16 bg-[#0ea5e9]/10 hover:bg-[#0ea5e9]/20 text-[#0ea5e9] rounded-[20px] flex items-center justify-center transition-all cursor-pointer group shadow-sm"
                title="Qayta talaffuz qilish"
              >
                <Volume2 className="w-7 h-7 group-hover:scale-110 active:scale-95 transition-transform" />
              </button>
            </div>

            {/* Text input drill */}
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
                  className={`w-full p-5 bg-slate-50 border-2 font-black italic text-xl tracking-tight text-center rounded-2xl outline-none transition-all placeholder:text-slate-400 placeholder:not-italic ${
                    gameState === 'checking'
                      ? feedback?.isCorrect
                        ? 'border-emerald-500 bg-emerald-50/20 text-emerald-600'
                        : 'border-red-500 bg-red-50/20 text-red-600'
                      : 'border-slate-200 focus:border-[#0ea5e9] focus:bg-white focus:ring-4 focus:ring-sky-100'
                  }`}
                />
              </div>

              {/* Reveal hint box */}
              {gameState === 'playing' && (
                <div className="text-right">
                  {showHint ? (
                    <span className="text-xs font-mono text-amber-600 font-bold tracking-widest uppercase animate-pulse">
                      HINT: {currentTerm?.latin.substring(0, 2) + '*'.repeat(currentTerm?.latin.length - 2)}
                    </span>
                  ) : (
                    <button
                      onClick={() => setShowHint(true)}
                      className="text-[10px] font-black text-slate-400 hover:text-[#0ea5e9] uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      💡 {getT('hintBtn')}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Correct/Incorrect feedback panel */}
            <AnimatePresence>
              {gameState === 'checking' && feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className={`p-6 rounded-2xl border flex flex-col gap-1.5 items-center justify-center text-center max-w-md mx-auto w-full ${
                    feedback.isCorrect
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                      : 'bg-red-50 border-red-100 text-red-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {feedback.isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-550" />
                    )}
                    <span className="text-sm font-black uppercase tracking-wider">
                      {feedback.isCorrect ? getT('correct') : getT('incorrect')}
                    </span>
                  </div>

                  <p className="text-xs font-bold mt-1">
                    {getT('correctWas')}{' '}
                    <span className="font-black italic text-lg decoration-wavy decoration-emerald-200">
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

            {/* Actions block */}
            <div className="flex justify-center border-t border-slate-100 pt-6">
              {gameState === 'playing' ? (
                <button
                  onClick={handleCheck}
                  disabled={!userInput.trim()}
                  className="px-8 py-4 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all disabled:opacity-40 cursor-pointer shadow-md shadow-sky-500/10 flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  {getT('checkBtn')}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-8 py-4 bg-slate-850 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1.5 animate-pulse"
                >
                  {getT('nextBtn')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      ) : null}

      {gameState === 'completed' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 md:p-14 rounded-[48px] border border-slate-200 shadow-2xl text-center flex flex-col gap-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-44 h-44 bg-amber-400/5 rounded-bl-[100px]" />
          <div className="w-24 h-24 bg-amber-50 rounded-[32px] flex items-center justify-center text-amber-500 border border-amber-100 mx-auto shadow-md">
            <Trophy className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
              {getT('completedTitle')}
            </h2>
            <p className="text-slate-400 font-black text-[10px] tracking-widest uppercase">
              BSMI virtual spelling record card
            </p>
          </div>

          {/* Analytics block */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto w-full pt-4">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block">
                {getT('scoreLabel')}
              </span>
              <span className="text-2xl font-black text-slate-800 tracking-tight block mt-1">
                {score} / {activeTerms.length}
              </span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block">
                {getT('accuracy')}
              </span>
              <span className="text-2xl font-black text-[#0ea5e9] tracking-tight block mt-1">
                {activeTerms.length ? Math.round((score / activeTerms.length) * 100) : 0}%
              </span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase block">
                Best Streak
              </span>
              <span className="text-2xl font-black text-orange-500 tracking-tight block mt-1">
                🔥 {bestStreak}
              </span>
            </div>
          </div>

          {/* Drill History Log list */}
          {historyLog.length > 0 && (
            <div className="border-t border-slate-100 pt-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left mb-3 flex items-center gap-1">
                <History className="w-4 h-4 text-slate-350" />
                Spelling history summary
              </h4>
              <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                {historyLog.map((log, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 rounded-xl border flex items-center justify-between text-left gap-3 ${
                      log.isCorrect 
                        ? 'bg-emerald-50/20 border-emerald-100' 
                        : 'bg-red-50/20 border-red-100'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-black italic text-slate-700">
                        {log.term.latin}
                      </p>
                      <span className="text-[10px] font-bold text-slate-400">
                        {getLocalizedTermStr(log.term.uzbek)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className={`text-[10px] font-mono leading-none tracking-tight block max-w-max ml-auto px-2 py-0.5 rounded ${
                        log.isCorrect 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {log.input || 'None'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={startNewGame}
            className="px-10 py-5 bg-brand-primary hover:bg-slate-850 text-[#FFD700] hover:text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-brand-primary/10 self-center flex items-center gap-2 cursor-pointer border border-brand-accent/20"
          >
            <RotateCcw className="w-4 h-4" />
            {getT('restartBtn')}
          </button>
        </motion.div>
      )}
    </div>
  );
}
