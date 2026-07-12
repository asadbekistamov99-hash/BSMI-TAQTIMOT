import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  BookOpen, 
  FileText, 
  HelpCircle, 
  Command, 
  Globe, 
  Sparkles, 
  ArrowRight, 
  ChevronRight,
  Loader2,
  Bookmark
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { dbService } from '../lib/dbService';

// Module-level cache to keep search instant and protect Firestore quotas
let cachedTopics: any[] | null = null;
let cachedLatinTerms: any[] | null = null;
let cachedQuizzes: any[] | null = null;

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'topics' | 'latin' | 'quizzes'>('all');
  const [loading, setLoading] = useState(false);
  
  const [topics, setTopics] = useState<any[]>(cachedTopics || []);
  const [latinTerms, setLatinTerms] = useState<any[]>(cachedLatinTerms || []);
  const [quizzes, setQuizzes] = useState<any[]>(cachedQuizzes || []);

  const [searchResults, setSearchResults] = useState<{
    topics: any[];
    latinTerms: any[];
    quizzes: any[];
  }>({ topics: [], latinTerms: [], quizzes: [] });

  const { t, language, getLocalized } = useLanguage();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch search index on open
  useEffect(() => {
    if (isOpen) {
      // Focus input field immediately
      setTimeout(() => inputRef.current?.focus(), 100);
      loadSearchData();
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const loadSearchData = async () => {
    if (cachedTopics && cachedLatinTerms && cachedQuizzes) {
      setTopics(cachedTopics);
      setLatinTerms(cachedLatinTerms);
      setQuizzes(cachedQuizzes);
      return;
    }

    setLoading(true);
    try {
      const [allTopics, allTerms, allQuizzes] = await Promise.all([
        cachedTopics ? Promise.resolve(cachedTopics) : dbService.getTopics(),
        cachedLatinTerms ? Promise.resolve(cachedLatinTerms) : dbService.getLatinTerms(),
        cachedQuizzes ? Promise.resolve(cachedQuizzes) : dbService.getQuizzes()
      ]);

      cachedTopics = allTopics;
      cachedLatinTerms = allTerms;
      cachedQuizzes = allQuizzes;

      setTopics(allTopics);
      setLatinTerms(allTerms);
      setQuizzes(allQuizzes);
    } catch (err) {
      console.error("Error fetching global search data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Perform search matching
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults({ topics: [], latinTerms: [], quizzes: [] });
      return;
    }

    const q = query.toLowerCase().trim();

    // 1. Filter Topics
    const matchedTopics = topics.filter((topic) => {
      const titleUz = (topic.title?.uz || topic.titleUz || '').toLowerCase();
      const titleRu = (topic.title?.ru || topic.titleRu || '').toLowerCase();
      const titleEn = (topic.title?.en || topic.titleEn || '').toLowerCase();
      const theoryUz = (topic.theory?.uz || topic.theoryUz || '').toLowerCase();
      const theoryRu = (topic.theory?.ru || topic.theoryRu || '').toLowerCase();
      const theoryEn = (topic.theory?.en || topic.theoryEn || '').toLowerCase();

      return (
        titleUz.includes(q) ||
        titleRu.includes(q) ||
        titleEn.includes(q) ||
        theoryUz.includes(q) ||
        theoryRu.includes(q) ||
        theoryEn.includes(q)
      );
    });

    // 2. Filter Latin Terms
    const matchedTerms = latinTerms.filter((term) => {
      const latin = (term.latin || '').toLowerCase();
      const uzbek = (term.uzbek || '').toLowerCase();
      const english = (term.english || '').toLowerCase();
      const russian = (term.russian || '').toLowerCase();

      return (
        latin.includes(q) ||
        uzbek.includes(q) ||
        english.includes(q) ||
        russian.includes(q)
      );
    });

    // 3. Filter Quizzes
    const matchedQuizzes = quizzes.filter((quiz) => {
      const question = (quiz.question || '').toLowerCase();
      const explanation = (quiz.explanation || '').toLowerCase();
      const options = (quiz.options || []).some((opt: string) => opt.toLowerCase().includes(q));

      return question.includes(q) || explanation.includes(q) || options;
    });

    setSearchResults({
      topics: matchedTopics,
      latinTerms: matchedTerms,
      quizzes: matchedQuizzes
    });
  }, [query, topics, latinTerms, quizzes]);

  const handleNavigate = (path: string, state?: any) => {
    setIsOpen(false);
    navigate(path, { state });
  };

  // Helper to extract a short preview snippet matching query
  const getSnippet = (textObj: any, searchQ: string) => {
    if (!textObj) return '';
    const text = typeof textObj === 'string' ? textObj : (textObj[language] || textObj['uz'] || '');
    if (!text) return '';

    const index = text.toLowerCase().indexOf(searchQ.toLowerCase());
    if (index === -1) return text.substring(0, 80) + '...';

    const start = Math.max(0, index - 30);
    const end = Math.min(text.length, index + 50);
    return (start > 0 ? '...' : '') + text.substring(start, end) + (end < text.length ? '...' : '');
  };

  const getTopicTitle = (topic: any) => {
    if (!topic) return '';
    if (topic.title && typeof topic.title === 'object') {
      return topic.title[language] || topic.title['uz'] || '';
    }
    return topic.titleUz || topic.titleRu || topic.titleEn || '';
  };

  const totalResults = searchResults.topics.length + searchResults.latinTerms.length + searchResults.quizzes.length;

  return (
    <>
      {/* Navbar trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 transition-all cursor-pointer shadow-sm group font-sans text-xs font-bold"
        title="Qidirish (Ctrl+K)"
        id="global-search-trigger"
      >
        <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
        <span className="hidden lg:inline text-slate-400 pr-3">
          {language === 'uz' ? 'Qidirish...' : language === 'ru' ? 'Поиск...' : 'Search...'}
        </span>
        <span className="hidden md:flex items-center gap-0.5 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-mono text-slate-400">
          <Command className="w-2.5 h-2.5" />K
        </span>
      </button>

      {/* Backdrop & Search Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[1000] overflow-y-auto font-sans">
            {/* Dark Blur Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            {/* Modal Body */}
            <div className="flex min-h-full items-start justify-center p-4 sm:p-6 md:p-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                ref={modalRef}
                className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[28px] shadow-2xl overflow-hidden mt-8 md:mt-12"
              >
                {/* Search Bar Header */}
                <div className="relative p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <Search className="w-5 h-5 text-slate-400 absolute left-8 top-1/2 -translate-y-1/2" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Anatomiya mavzusi, lotincha termin yoki test savoli..."
                    className="w-full pl-12 pr-12 py-3.5 bg-transparent border-0 outline-none text-slate-900 dark:text-white placeholder:text-slate-400 text-base font-bold focus:ring-0"
                  />
                  {query ? (
                    <button
                      onClick={() => setQuery('')}
                      className="absolute right-14 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : null}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 px-2 py-1 border border-slate-200 dark:border-slate-800 rounded-lg text-[9px] font-mono text-slate-400 hover:bg-slate-50 transition-colors hidden sm:block"
                  >
                    ESC
                  </button>
                </div>

                {/* Filter Tabs */}
                {query.trim() && (
                  <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                        activeTab === 'all'
                          ? 'bg-brand-primary text-white shadow-md'
                          : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      Barchasi ({totalResults})
                    </button>
                    <button
                      onClick={() => setActiveTab('topics')}
                      className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                        activeTab === 'topics'
                          ? 'bg-brand-primary text-white shadow-md'
                          : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      Mavzular ({searchResults.topics.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('latin')}
                      className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                        activeTab === 'latin'
                          ? 'bg-brand-primary text-white shadow-md'
                          : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      Lotincha ({searchResults.latinTerms.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('quizzes')}
                      className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                        activeTab === 'quizzes'
                          ? 'bg-brand-primary text-white shadow-md'
                          : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      Testlar ({searchResults.quizzes.length})
                    </button>
                  </div>
                )}

                {/* Content Panel */}
                <div className="max-h-[420px] overflow-y-auto p-6">
                  {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
                      <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
                      <span className="text-xs font-black uppercase tracking-widest">Ma'lumotlar yuklanmoqda...</span>
                    </div>
                  ) : !query.trim() ? (
                    /* Default state before search query is typed */
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-3">Tezkor navigatsiya</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => handleNavigate('/semester/1')}
                            className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-150 rounded-2xl text-left transition-all group cursor-pointer"
                          >
                            <div>
                              <div className="text-xs font-black uppercase tracking-wider text-slate-800">1-Semestr</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">Fundamental anatomiya</div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                          </button>
                          <button
                            onClick={() => handleNavigate('/semester/2')}
                            className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-150 rounded-2xl text-left transition-all group cursor-pointer"
                          >
                            <div>
                              <div className="text-xs font-black uppercase tracking-wider text-slate-800">2-Semestr</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">Sintopiya va splanxnologiya</div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                          </button>
                          <button
                            onClick={() => handleNavigate('/latin-glossary')}
                            className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-150 rounded-2xl text-left transition-all group cursor-pointer"
                          >
                            <div>
                              <div className="text-xs font-black uppercase tracking-wider text-slate-800">Lotincha Lug'at</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">Muntazam terminlar lug'ati</div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                          </button>
                          <button
                            onClick={() => handleNavigate('/atlas')}
                            className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/80 border border-slate-150 rounded-2xl text-left transition-all group cursor-pointer"
                          >
                            <div>
                              <div className="text-xs font-black uppercase tracking-wider text-slate-800">3D Atlas</div>
                              <div className="text-[10px] text-slate-400 mt-0.5">Interaktiv organlar xaritasi</div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">AI Konsultatsiyasi</h4>
                        </div>
                        <button
                          onClick={() => handleNavigate('/ai-assistant')}
                          className="w-full flex items-center justify-between p-4 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 rounded-2xl text-left transition-all group cursor-pointer"
                        >
                          <div>
                            <div className="text-xs font-black uppercase tracking-wider text-amber-800">Anatomiya AI yordamchisi</div>
                            <div className="text-[10px] text-amber-700/80 mt-0.5">Savol bering va tushunarsiz joylarni AI bilan birga o'rganing</div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  ) : totalResults === 0 ? (
                    /* Search yields no results */
                    <div className="py-16 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-4 border border-slate-150">
                        <Search className="w-6 h-6 text-slate-300" />
                      </div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 mb-1">Natijalar topilmadi</h3>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto">
                        Izlangan so'z bo'yicha hech qanday dars, lotincha termin yoki test savoli topilmadi.
                      </p>
                    </div>
                  ) : (
                    /* Search results listings */
                    <div className="space-y-6">
                      {/* Topics Section */}
                      {(activeTab === 'all' || activeTab === 'topics') && searchResults.topics.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2 px-2">
                            <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.20em]">Mavzular</h4>
                          </div>
                          <div className="space-y-1.5">
                            {searchResults.topics.map((topic) => (
                              <div
                                key={topic.id}
                                onClick={() => handleNavigate(`/topic/${topic.id}`)}
                                className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-xl flex items-center justify-between cursor-pointer group transition-all"
                              >
                                <div className="flex-grow pr-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-slate-800 uppercase tracking-tight line-clamp-1">
                                      {getTopicTitle(topic)}
                                    </span>
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[8px] font-black uppercase">
                                      {topic.semester}-Semestr
                                    </span>
                                  </div>
                                  <p className="text-[10.5px] text-slate-400 mt-1 italic font-medium">
                                    {getSnippet(topic.theory, query)}
                                  </p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Latin Terms Section */}
                      {(activeTab === 'all' || activeTab === 'latin') && searchResults.latinTerms.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2 px-2">
                            <Globe className="w-3.5 h-3.5 text-emerald-500" />
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.20em]">Lotincha terminlar</h4>
                          </div>
                          <div className="space-y-1.5">
                            {searchResults.latinTerms.map((term) => (
                              <div
                                key={term.id}
                                onClick={() => handleNavigate('/latin-glossary', { search: term.latin })}
                                className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-xl flex items-center justify-between cursor-pointer group transition-all"
                              >
                                <div className="flex-grow pr-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-emerald-700 italic tracking-tight">
                                      {term.latin}
                                    </span>
                                    {term.pronunciation && (
                                      <span className="text-[9.5px] text-slate-400 font-medium">
                                        [{term.pronunciation}]
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10.5px] text-slate-500 font-bold mt-0.5">
                                    Tarjimasi: {term.uzbek} {term.russian ? `| ${term.russian}` : ''}
                                  </p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Quizzes Section */}
                      {(activeTab === 'all' || activeTab === 'quizzes') && searchResults.quizzes.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-2 px-2">
                            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.20em]">Test savollari</h4>
                          </div>
                          <div className="space-y-1.5">
                            {searchResults.quizzes.map((quiz) => (
                              <div
                                key={quiz.id}
                                onClick={() => handleNavigate(`/quiz/${quiz.topicId}`)}
                                className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-150 rounded-xl flex items-center justify-between cursor-pointer group transition-all"
                              >
                                <div className="flex-grow pr-4 text-left">
                                  <span className="text-xs font-bold text-slate-800 line-clamp-1 block">
                                    {quiz.question}
                                  </span>
                                  {quiz.explanation && (
                                    <p className="text-[10.5px] text-slate-400 mt-1 italic font-medium">
                                      Tushuntirish: {getSnippet(quiz.explanation, query)}
                                    </p>
                                  )}
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer status / tips info */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <span>Qidiruv tezkorligi:</span>
                    <span className="text-emerald-500">Milli-soniyali</span>
                  </div>
                  <div>
                    <span>Chiqish uchun</span> <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded">ESC</kbd> <span>bosing</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
