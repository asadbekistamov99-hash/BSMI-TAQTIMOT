import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ClipboardCheck, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  Clock, 
  ExternalLink, 
  HelpCircle,
  Sparkles,
  Check
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { Topic } from '../types';

interface QuizItem {
  id?: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

interface TopicInteractiveQuizzesViewerProps {
  topic?: Topic;
  topicId?: string;
  topicTitle?: string;
  quizzes: QuizItem[];
}

export default function TopicInteractiveQuizzesViewer({
  topic,
  topicId: customId,
  topicTitle: customTitle,
  quizzes
}: TopicInteractiveQuizzesViewerProps) {
  const { language, getLocalized } = useLanguage();
  const topicId = customId || topic?.id || '';
  const topicTitle = customTitle || (topic ? getLocalized(topic.title) : 'Anatomiya Mavzusi');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showFinished, setShowFinished] = useState(false);

  const total = quizzes.length;
  const currentQuiz = quizzes[currentIndex];
  const selectedOption = selectedAnswers[currentIndex];
  const isAnswered = selectedOption !== undefined;

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: idx }));
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowFinished(false);
  };

  const correctCount = useMemo(() => {
    return Object.entries(selectedAnswers).reduce((acc, [idxStr, selected]) => {
      const idx = parseInt(idxStr, 10);
      if (quizzes[idx] && quizzes[idx].correctAnswerIndex === selected) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [selectedAnswers, quizzes]);

  const percentage = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="py-12 text-center bg-white rounded-3xl border border-slate-200/80 p-8 space-y-4">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
          <ClipboardCheck className="w-8 h-8" />
        </div>
        <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">
          Hozircha testlar mavjud emas
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Ushbu mavzu uchun testlar tayyorlanmoqda. To'liq testlar bazasini ko'rish uchun test markaziga o'ting.
        </p>
        <Link
          to={`/quiz/${topicId}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all"
        >
          <span>Test markaziga o'tish</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-rose-900 via-rose-950 to-slate-950 text-white relative overflow-hidden shadow-xl border border-rose-500/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/30 text-rose-300 text-xs font-black uppercase tracking-wider">
              <ClipboardCheck className="w-3.5 h-3.5" />
              <span>Interaktiv Mavzuviy Testlar</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
              {topicTitle}
            </h3>
            <p className="text-xs text-rose-200/80 leading-relaxed max-w-xl font-medium">
              Ushbu mavzu bo'yicha bilimlaringizni to'g'ridan-to'g'ri sinab ko'ring. Har bir savolga javob berganingizdan so'ng to'g'ri yechim va batafsil tushuntirish taqdim etiladi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto shrink-0">
            <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <span className="block text-xl font-black text-rose-300">{total} ta</span>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Test Savoli</span>
            </div>

            <Link
              to={`/quiz/${topicId}`}
              className="px-5 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-rose-600/30 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>To'liq Imtihon Rejimi</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Completion Screen */}
      {showFinished ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 md:p-12 text-center shadow-lg space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
              Mavzuviy Test Yakunlandi!
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Siz ushbu darslik bo'yicha barcha savollarni muvaffaqiyatli ishlab chiqdingiz.
            </p>
          </div>

          <div className="max-w-md mx-auto grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="p-3 bg-white rounded-xl text-center">
              <span className="block text-xs text-slate-400 font-bold uppercase tracking-wider">Jami</span>
              <span className="text-lg font-black text-slate-800">{total}</span>
            </div>
            <div className="p-3 bg-white rounded-xl text-center">
              <span className="block text-xs text-emerald-600 font-bold uppercase tracking-wider">To'g'ri</span>
              <span className="text-lg font-black text-emerald-600">{correctCount}</span>
            </div>
            <div className="p-3 bg-white rounded-xl text-center">
              <span className="block text-xs text-purple-600 font-bold uppercase tracking-wider">Natija</span>
              <span className="text-lg font-black text-purple-600">{percentage}%</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Qayta topshirish</span>
            </button>
            <Link
              to={`/quiz/${topicId}`}
              className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-rose-600/25 flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Imtihon rejimida sertifikat olish</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Active Quiz Question Card */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 md:p-8 space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 font-black text-sm flex items-center justify-center border border-rose-200">
                {currentIndex + 1}
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Savol {currentIndex + 1} / {total}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <span className="text-emerald-600 font-black">{correctCount} to'g'ri</span>
              <span>•</span>
              <span>{Math.round(((Object.keys(selectedAnswers).length) / total) * 100)}% bajarildi</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-rose-500 to-red-600 h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="pt-2">
            <h4 className="text-base md:text-lg font-black text-slate-800 leading-snug">
              {currentQuiz.question}
            </h4>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuiz.options.map((opt, optIdx) => {
              const isSelected = selectedOption === optIdx;
              const isCorrectAnswer = currentQuiz.correctAnswerIndex === optIdx;

              let btnStyle = "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800";
              let badgeStyle = "bg-slate-100 text-slate-600 border-slate-200";

              if (isAnswered) {
                if (isCorrectAnswer) {
                  btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500/20";
                  badgeStyle = "bg-emerald-600 text-white border-emerald-600";
                } else if (isSelected) {
                  btnStyle = "border-rose-400 bg-rose-50 text-rose-950 font-bold ring-2 ring-rose-400/20";
                  badgeStyle = "bg-rose-600 text-white border-rose-600";
                } else {
                  btnStyle = "border-slate-100 opacity-50 text-slate-400";
                }
              }

              const letters = ['A', 'B', 'C', 'D', 'E'];

              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all cursor-pointer ${btnStyle}`}
                >
                  <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 border ${badgeStyle}`}>
                    {letters[optIdx] || optIdx + 1}
                  </span>
                  <span className="text-sm font-medium leading-relaxed pt-0.5 flex-1">
                    {opt}
                  </span>
                  {isAnswered && isCorrectAnswer && (
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 self-center" />
                  )}
                  {isAnswered && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0 self-center" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {isAnswered && (
            <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1.5 animate-in fade-in duration-200 ${
              selectedOption === currentQuiz.correctAnswerIndex
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : 'bg-amber-50/80 border-amber-200 text-amber-950'
            }`}>
              <div className="flex items-center gap-1.5 font-black uppercase tracking-wider text-[11px]">
                {selectedOption === currentQuiz.correctAnswerIndex ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">To'g'ri javob!</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span className="text-amber-800">Tushuntirish:</span>
                  </>
                )}
              </div>
              <p className="font-medium text-slate-700">
                {currentQuiz.explanation || "To'g'ri javob anatomik darslikka muvofiq tanlandi."}
              </p>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              Oldingi
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!isAnswered}
              className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-rose-600/20 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2 cursor-pointer"
            >
              <span>{currentIndex === total - 1 ? "Yakunlash" : "Keyingi savol"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
