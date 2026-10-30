import React, { useState, useMemo, useEffect } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft,
  ChevronRight,
  CheckCircle2, 
  Copy, 
  Check, 
  Stethoscope, 
  Search, 
  BookOpen, 
  Sparkles, 
  Layers, 
  FileText,
  Award,
  Eye,
  EyeOff
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { TheoryQuestion } from '../data/topicTheoryQuestionsData';
import { useLanguage } from '../hooks/useLanguage';
import { Topic } from '../types';

interface TopicTheoryQuestionsViewerProps {
  topic?: Topic;
  topicTitle?: string;
  topicId?: string;
  semester?: number;
  questions: TheoryQuestion[];
}

export default function TopicTheoryQuestionsViewer({
  topic,
  topicTitle: customTitle,
  topicId: customId,
  semester: customSemester,
  questions
}: TopicTheoryQuestionsViewerProps) {
  const { language, getLocalized } = useLanguage();
  const topicTitle = customTitle || (topic ? getLocalized(topic.title) : 'Anatomiya Mavzusi');
  const topicId = customId || topic?.id || '';
  const semester = customSemester ?? topic?.semester ?? 1;
  const [search, setSearch] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Pagination & Reading Mode States (matching user screenshot)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isPaged, setIsPaged] = useState<boolean>(true);
  const pageSize = 5; // 30 questions / 5 = exactly 6 pages (1/6)

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const qText = (q.question + ' ' + q.answer + ' ' + (q.latinTerms?.join(' ') || '')).toLowerCase();
      const matchSearch = !search.trim() || qText.includes(search.toLowerCase().trim());
      const matchDiff = filterDifficulty === 'all' || q.difficulty === filterDifficulty;
      return matchSearch && matchDiff;
    });
  }, [questions, search, filterDifficulty]);

  const totalPages = isPaged ? Math.max(1, Math.ceil(filteredQuestions.length / pageSize)) : 1;

  // Reset page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterDifficulty, questions.length]);

  const displayedQuestions = useMemo(() => {
    if (!isPaged) return filteredQuestions;
    const start = (currentPage - 1) * pageSize;
    return filteredQuestions.slice(start, start + pageSize);
  }, [filteredQuestions, isPaged, currentPage, pageSize]);

  const handlePageChange = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
    const container = document.getElementById('topic-theory-questions-container');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleOpen = (id: string) => {
    setOpenIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAll = (open: boolean) => {
    const next: Record<string, boolean> = {};
    questions.forEach(q => {
      next[q.id] = open;
    });
    setOpenIds(next);
  };

  const handleCopy = (q: TheoryQuestion) => {
    const textToCopy = `SAVOL: ${q.question}\n\nJAVOB:\n${q.answer}\n\nASOSIY NUQTALAR:\n${(q.keyPoints || []).map(k => `• ${k}`).join('\n')}\n\nKLINIK AHAMIYATI:\n${q.clinicalSignificance || ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(q.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getDifficultyBadge = (d?: string) => {
    switch (d) {
      case 'exam':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <Award className="w-3 h-3 text-rose-600" /> Imtihon savoli
          </span>
        );
      case 'advanced':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            <Sparkles className="w-3 h-3 text-purple-600" /> Chuqur tahlil
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Muhim
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Asosiy baza
          </span>
        );
    }
  };

  return (
    <div id="topic-theory-questions-container" className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-950 text-white relative overflow-hidden shadow-xl border border-purple-500/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-black uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Nazorat Savollari (Kollokvium & Imtihon)</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
              {topicTitle}
            </h3>
            <p className="text-xs text-purple-200/80 leading-relaxed max-w-2xl font-medium">
              Ushbu bo'limda mavzuni o'zlashtirish darajasini aniqlovchi eng muhim nazorat savollari va ularning akademik to'liq javoblari jamlangan.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
            <div className="px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <span className="block text-xl font-black text-purple-300">{questions.length} ta</span>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Nazorat Savoli</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar: Search, Filters, Expand/Collapse, Copy All */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="30+ ta nazorat savollari ichidan qidirish..."
            className="w-full pl-9 pr-4 py-2 bg-white rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 border border-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Copy All 30 Questions button */}
          <button
            type="button"
            onClick={() => {
              const allText = questions.map((q, idx) => `${idx + 1}. ${q.question}`).join('\n\n');
              navigator.clipboard.writeText(allText);
              setCopiedId('ALL_COPIED');
              setTimeout(() => setCopiedId(null), 2500);
            }}
            className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm shadow-purple-600/20 cursor-pointer"
            title="Barcha savollarni matn sifatida nusxalash"
          >
            {copiedId === 'ALL_COPIED' ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>30 ta savol nusxalandi!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-purple-200" />
                <span>Barchasini nusxalash ({questions.length})</span>
              </>
            )}
          </button>

          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-3 py-2 bg-white rounded-xl text-xs font-bold text-slate-700 border border-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="all">Barcha savollar ({questions.length})</option>
            <option value="exam">Imtihon savollari</option>
            <option value="advanced">Chuqur tahlil</option>
            <option value="basic">Asosiy baza</option>
          </select>

          <button
            type="button"
            onClick={() => toggleAll(true)}
            className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            title="Barcha javoblarni ochish"
          >
            <Eye className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden sm:inline">Javoblar</span>
          </button>

          <button
            type="button"
            onClick={() => toggleAll(false)}
            className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            title="Barcha javoblarni yopish"
          >
            <EyeOff className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Yopish</span>
          </button>
        </div>
      </div>

      {/* TOP NEXT PART NAVIGATION (as shown in user design attachment) */}
      {isPaged && totalPages > 1 && (
        <div className="flex items-center justify-between gap-3">
          {currentPage > 1 ? (
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              className="flex items-center gap-2.5 p-3 sm:p-3.5 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-indigo-300 rounded-2xl shadow-xs transition-all group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-300 shrink-0">
                <ChevronLeft className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">
                  OLDINGI QISM
                </span>
                <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600">
                  Sahifa {currentPage - 1} ga qaytish
                </span>
              </div>
            </button>
          ) : <div />}

          {currentPage < totalPages && (
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              className="flex items-center gap-2.5 p-3 sm:p-3.5 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-indigo-300 rounded-2xl shadow-xs transition-all group cursor-pointer ml-auto"
            >
              <div className="text-right">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">
                  KEYINGI QISM
                </span>
                <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600">
                  Sahifa {currentPage + 1} ni o'qish
                </span>
              </div>
              <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:border-indigo-300 shrink-0">
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          )}
        </div>
      )}

      {/* READING MODE TOGGLE & PROGRESS BAR (exact match of user attachment) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-50/80 border border-slate-200/80 rounded-2xl">
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
          <button
            type="button"
            onClick={() => setIsPaged(true)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              isPaged
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Sahifalab o'qish</span>
          </button>
          <button
            type="button"
            onClick={() => setIsPaged(false)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              !isPaged
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-indigo-600'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Barchasi (To'liq)</span>
          </button>
        </div>

        {isPaged && (
          <div className="flex items-center gap-3">
            <div className="text-xs font-bold text-slate-600">
              <span className="text-slate-400 font-medium">Qism: </span>
              <strong className="text-indigo-600 font-black">{currentPage}</strong> / {totalPages}
            </div>
            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden hidden sm:block">
              <div
                className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                style={{ width: `${(currentPage / totalPages) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Questions List */}
      {displayedQuestions.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-3xl border border-slate-200/80 p-8">
          <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-black text-slate-700 uppercase tracking-tight">Savol topilmadi</h4>
          <p className="text-xs text-slate-400 mt-1">Qidiruv so'zini o'zgartiring yoki filtrlarni tozalang.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedQuestions.map((q, idx) => {
            const globalIdx = isPaged ? (currentPage - 1) * pageSize + idx + 1 : idx + 1;
            const isOpen = !!openIds[q.id];
            return (
              <div
                key={q.id}
                className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen 
                    ? 'border-purple-300 shadow-lg shadow-purple-500/5 ring-1 ring-purple-400/20' 
                    : 'border-slate-200/80 hover:border-purple-200 hover:shadow-md'
                }`}
              >
                {/* Question Header */}
                <div
                  onClick={() => toggleOpen(q.id)}
                  className="p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 font-black text-xs flex items-center justify-center shrink-0 border border-purple-200/80 mt-0.5">
                      {globalIdx}
                    </span>
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {getDifficultyBadge(q.difficulty)}
                        {q.latinTerms && q.latinTerms.slice(0, 2).map((term, tIdx) => (
                          <span key={tIdx} className="text-[10px] font-mono italic text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            {term}
                          </span>
                        ))}
                      </div>
                      <h4 className="text-sm md:text-base font-black text-slate-800 leading-snug tracking-tight">
                        {q.question}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-center">
                    <span className="text-[11px] font-bold text-purple-600 hidden sm:inline">
                      {isOpen ? "Yashirish" : "Javobni ko'rish"}
                    </span>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isOpen ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Collapsible Answer Body */}
                {isOpen && (
                  <div className="px-5 pb-6 pt-2 border-t border-slate-100 bg-gradient-to-b from-purple-50/20 to-white space-y-5 animate-in fade-in duration-200">
                    {/* Model Answer Markdown */}
                    <div className="text-sm text-slate-700 leading-relaxed font-normal prose prose-sm max-w-none prose-p:my-2 prose-headings:font-black prose-headings:text-slate-800">
                      <ReactMarkdown>{q.answer}</ReactMarkdown>
                    </div>

                    {/* Key Memorization Points */}
                    {q.keyPoints && q.keyPoints.length > 0 && (
                      <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-100 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-black text-purple-900 uppercase tracking-wider">
                          <CheckCircle2 className="w-4 h-4 text-purple-600" />
                          <span>Eslab qolish kerak bo'lgan asosiy jihatlar (Imtihon kalitlari)</span>
                        </div>
                        <ul className="space-y-1.5 pl-5 list-disc text-xs text-purple-950 font-medium leading-relaxed">
                          {q.keyPoints.map((kp, kpIdx) => (
                            <li key={kpIdx}>{kp}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Clinical Significance */}
                    {q.clinicalSignificance && (
                      <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-black text-amber-900 uppercase tracking-wider">
                          <Stethoscope className="w-4 h-4 text-amber-700" />
                          <span>Klinik ahamiyati va amaliyot</span>
                        </div>
                        <p className="text-xs text-amber-950 leading-relaxed font-medium">
                          {q.clinicalSignificance}
                        </p>
                      </div>
                    )}

                    {/* Latin Terms Badges & Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mr-1">
                          Lotin atamalari:
                        </span>
                        {(q.latinTerms || []).map((term, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-mono text-[11px] italic font-semibold"
                          >
                            {term}
                          </span>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopy(q)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
                      >
                        {copiedId === q.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Nusxalandi!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span>Konspektga nusxalash</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* BOTTOM PAGINATION BAR (exact match of user attachment) */}
      {isPaged && totalPages > 1 && (
        <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 select-none">
          <div className="text-xs font-bold text-slate-600">
            Sahifa <strong className="text-slate-900 font-black">{currentPage}</strong> / {totalPages}
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center">
            {currentPage > 1 && (
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-black text-indigo-600 hover:bg-indigo-50 transition-all flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Oldingisi</span>
              </button>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
              const isActive = p === currentPage;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePageChange(p)}
                  className={`w-8 h-8 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/80'
                  }`}
                >
                  {p}
                </button>
              );
            })}

            {currentPage < totalPages && (
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-black text-indigo-600 hover:bg-indigo-50 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Keyingisi</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
