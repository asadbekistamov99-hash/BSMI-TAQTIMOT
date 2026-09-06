import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  BookOpen, 
  HelpCircle, 
  Command, 
  Globe, 
  Sparkles, 
  ArrowRight, 
  ChevronRight,
  Loader2,
  Box,
  Compass,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
  Video,
  Brain,
  Layers
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { dbService } from '../lib/dbService';
import { ANATOMY_MODELS, AnatomyModel } from '../data/anatomyModels';
import { SEMESTER_1_TOPICS, SEMESTER_2_TOPICS } from '../constants';

// Module-level caches to keep search instant and protect Firestore quotas
let cachedTopics: any[] | null = null;
let cachedLatinTerms: any[] | null = null;
let cachedQuizzes: any[] | null = null;

export interface CommandItem {
  id: string;
  type: 'topic' | 'model' | 'latin' | 'quiz' | 'page';
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  path: string;
  state?: any;
  icon?: React.ReactNode;
  tags?: string[];
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'topics' | 'models' | 'latin' | 'quizzes' | 'pages'>('all');
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const [topics, setTopics] = useState<any[]>(cachedTopics || []);
  const [latinTerms, setLatinTerms] = useState<any[]>(cachedLatinTerms || []);
  const [quizzes, setQuizzes] = useState<any[]>(cachedQuizzes || []);

  const { language } = useLanguage();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Default Quick Pages
  const quickPages: CommandItem[] = useMemo(() => [
    {
      id: 'page-sem1',
      type: 'page',
      title: language === 'uz' ? '1-Semestr: Tayanch-Harakat Tizimi' : language === 'ru' ? '1-Семестр: Опорно-двигательная' : 'Semester 1: Locomotor System',
      subtitle: language === 'uz' ? 'Suyaklar, bo‘g‘imlar va muskullar darsligi' : 'Osteology, Arthrology & Myology',
      badge: '1-Semestr',
      badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
      path: '/semester/1',
      icon: <BookOpen className="w-4 h-4 text-blue-500" />
    },
    {
      id: 'page-sem2',
      type: 'page',
      title: language === 'uz' ? '2-Semestr: Ichki A’zolar va Tizimlar' : language === 'ru' ? '2-Семестр: Внутренние органы' : 'Semester 2: Visceral & Systems',
      subtitle: language === 'uz' ? 'Splanxnologiya, angiologiya va nevrologiya' : 'Splanchnology & Angiology',
      badge: '2-Semestr',
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
      path: '/semester/2',
      icon: <BookOpen className="w-4 h-4 text-emerald-500" />
    },
    {
      id: 'page-models',
      type: 'page',
      title: language === 'uz' ? '3D Modellar Katalogi va Atlas' : language === 'ru' ? 'Каталог 3D Моделей и Атлас' : '3D Models Catalog & Atlas',
      subtitle: language === 'uz' ? 'Interaktiv 3D anatomiya modellar va pinlar' : 'Interactive 3D organ maps',
      badge: '3D Atlas',
      badgeColor: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
      path: '/models',
      icon: <Box className="w-4 h-4 text-violet-500" />
    },
    {
      id: 'page-glossary',
      type: 'page',
      title: language === 'uz' ? 'Lotincha Terminlar Lug‘ati' : language === 'ru' ? 'Словарь латинских терминов' : 'Latin Terms Glossary',
      subtitle: language === 'uz' ? 'Ovozli va ko‘p tilli anatomiya lug‘ati' : 'Multilingual latin terminology dictionary',
      badge: 'Lug‘at',
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
      path: '/latin-glossary',
      icon: <Globe className="w-4 h-4 text-amber-500" />
    },
    {
      id: 'page-presentation',
      type: 'page',
      title: language === 'uz' ? 'Anatomik Taqdimotlar (PPTX / PDF)' : language === 'ru' ? 'Анатомические Презентации' : 'Anatomy Presentations',
      subtitle: language === 'uz' ? 'Barcha semestrlar bo‘yicha ma’ruza slaydlar va taqdimotlar' : 'Lecture presentations & slides',
      badge: 'Taqdimot',
      badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
      path: '/presentation',
      icon: <Video className="w-4 h-4 text-rose-500" />
    }
  ], [language]);

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
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
      setTimeout(() => inputRef.current?.focus(), 80);
      loadSearchData();
    } else {
      setQuery('');
      setSelectedIndex(0);
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

      // If db topics are empty or incomplete, complement with built-in topics
      let blendedTopics = [...(allTopics || [])];
      if (blendedTopics.length === 0) {
        SEMESTER_1_TOPICS.forEach((t, i) => {
          blendedTopics.push({
            id: `sem1-default-${i}`,
            semester: 1,
            title: { uz: t, ru: t, en: t },
            theory: { uz: `${t} - 1-Semestr anatomiya ma’ruzasi`, ru: t, en: t }
          });
        });
        SEMESTER_2_TOPICS.forEach((t, i) => {
          blendedTopics.push({
            id: `sem2-default-${i}`,
            semester: 2,
            title: { uz: t, ru: t, en: t },
            theory: { uz: `${t} - 2-Semestr anatomiya ma’ruzasi`, ru: t, en: t }
          });
        });
      }

      cachedTopics = blendedTopics;
      cachedLatinTerms = allTerms;
      cachedQuizzes = allQuizzes;

      setTopics(blendedTopics);
      setLatinTerms(allTerms);
      setQuizzes(allQuizzes);
    } catch (err) {
      console.error("Error fetching command palette data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Build filtered search items
  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return {
        topics: [],
        models: [],
        latinTerms: [],
        quizzes: [],
        pages: quickPages
      };
    }

    const q = query.toLowerCase().trim();

    // 1. Filter Topics
    const matchedTopics: CommandItem[] = topics
      .filter((topic) => {
        const titleUz = (topic.title?.uz || topic.titleUz || '').toLowerCase();
        const titleRu = (topic.title?.ru || topic.titleRu || '').toLowerCase();
        const titleEn = (topic.title?.en || topic.titleEn || '').toLowerCase();
        const theoryUz = (topic.theory?.uz || topic.theoryUz || '').toLowerCase();
        return (
          titleUz.includes(q) ||
          titleRu.includes(q) ||
          titleEn.includes(q) ||
          theoryUz.includes(q)
        );
      })
      .slice(0, 8)
      .map((topic) => {
        const titleStr = topic.title?.[language] || topic.title?.uz || topic.titleUz || 'Anatomiya mavzusi';
        return {
          id: `topic-${topic.id}`,
          type: 'topic',
          title: titleStr,
          subtitle: `${topic.semester || 1}-Semestr • Anatomiya darsi`,
          badge: `${topic.semester || 1}-Semestr`,
          badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
          path: `/topic/${topic.id}`,
          icon: <BookOpen className="w-4 h-4 text-blue-500" />
        };
      });

    // 2. Filter 3D Models
    const matchedModels: CommandItem[] = ANATOMY_MODELS
      .filter((model: AnatomyModel) => {
        const titleUz = (model.title.uz || '').toLowerCase();
        const titleRu = (model.title.ru || '').toLowerCase();
        const titleEn = (model.title.en || '').toLowerCase();
        const descUz = (model.description?.uz || '').toLowerCase();
        const tags = (model.tags || []).join(' ').toLowerCase();
        const pins = (model.pins || []).map(p => `${p.latinName} ${p.uzbekName}`).join(' ').toLowerCase();

        return (
          titleUz.includes(q) ||
          titleRu.includes(q) ||
          titleEn.includes(q) ||
          descUz.includes(q) ||
          tags.includes(q) ||
          pins.includes(q)
        );
      })
      .slice(0, 8)
      .map((model) => {
        const titleStr = model.title[language] || model.title.uz;
        return {
          id: `model-${model.id}`,
          type: 'model',
          title: titleStr,
          subtitle: `3D Model • ${model.system.toUpperCase()} tizimi`,
          badge: '3D Model',
          badgeColor: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
          path: '/models',
          state: { modelId: model.id },
          icon: <Box className="w-4 h-4 text-violet-500" />
        };
      });

    // 3. Filter Latin Terms
    const matchedLatin: CommandItem[] = latinTerms
      .filter((term) => {
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
      })
      .slice(0, 10)
      .map((term) => ({
        id: `latin-${term.id || term.latin}`,
        type: 'latin',
        title: term.latin,
        subtitle: `Tarjimasi: ${term.uzbek}${term.russian ? ` | ${term.russian}` : ''}`,
        badge: 'Lotincha',
        badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
        path: '/latin-glossary',
        state: { search: term.latin },
        icon: <Globe className="w-4 h-4 text-emerald-500" />
      }));

    // 4. Filter Quizzes
    const matchedQuizzes: CommandItem[] = quizzes
      .filter((quiz) => {
        const question = (quiz.question || '').toLowerCase();
        const explanation = (quiz.explanation || '').toLowerCase();
        return question.includes(q) || explanation.includes(q);
      })
      .slice(0, 6)
      .map((quiz) => ({
        id: `quiz-${quiz.id}`,
        type: 'quiz',
        title: quiz.question,
        subtitle: quiz.explanation ? `Izoh: ${quiz.explanation.substring(0, 60)}...` : 'Mavzu bo‘yicha test sinovi',
        badge: 'Test',
        badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
        path: `/quiz/${quiz.topicId || 'default'}`,
        icon: <HelpCircle className="w-4 h-4 text-amber-500" />
      }));

    // 5. Filter Quick Pages
    const matchedPages = quickPages.filter(p => 
      p.title.toLowerCase().includes(q) || 
      (p.subtitle || '').toLowerCase().includes(q)
    );

    return {
      topics: matchedTopics,
      models: matchedModels,
      latinTerms: matchedLatin,
      quizzes: matchedQuizzes,
      pages: matchedPages
    };
  }, [query, topics, latinTerms, quizzes, quickPages, language]);

  // Combined flat list depending on activeTab
  const flatResults = useMemo(() => {
    if (activeTab === 'topics') return searchResults.topics;
    if (activeTab === 'models') return searchResults.models;
    if (activeTab === 'latin') return searchResults.latinTerms;
    if (activeTab === 'quizzes') return searchResults.quizzes;
    if (activeTab === 'pages') return searchResults.pages;

    return [
      ...searchResults.pages,
      ...searchResults.topics,
      ...searchResults.models,
      ...searchResults.latinTerms,
      ...searchResults.quizzes
    ];
  }, [activeTab, searchResults]);

  // Reset selectedIndex on search query change or tab change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeTab]);

  // Scroll selected item into view smoothly
  useEffect(() => {
    if (flatResults.length > 0 && selectedIndex >= 0) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [selectedIndex, flatResults]);

  // Keyboard navigation handler (ArrowUp, ArrowDown, Enter)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      return;
    }

    if (flatResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % flatResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flatResults.length) % flatResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selectedItem = flatResults[selectedIndex];
      if (selectedItem) {
        handleNavigate(selectedItem.path, selectedItem.state);
      }
    }
  };

  const handleNavigate = (path: string, state?: any) => {
    setIsOpen(false);
    navigate(path, { state });
  };

  const totalResultsCount = 
    searchResults.topics.length + 
    searchResults.models.length + 
    searchResults.latinTerms.length + 
    searchResults.quizzes.length + 
    searchResults.pages.length;

  return (
    <>
      {/* Trigger Button in Navigation */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 transition-all cursor-pointer shadow-sm group font-sans text-xs font-bold"
        title="Command Palette (Ctrl+K)"
        id="global-search-trigger"
      >
        <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
        <span className="hidden lg:inline text-slate-400 pr-3">
          {language === 'uz' ? 'Qidirish (Ctrl+K)...' : language === 'ru' ? 'Поиск (Ctrl+K)...' : 'Search (Ctrl+K)...'}
        </span>
        <span className="hidden md:flex items-center gap-0.5 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-mono text-slate-500 shadow-2xs">
          <Command className="w-2.5 h-2.5" />K
        </span>
      </button>

      {/* Modal Dialog Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[1000] overflow-y-auto font-sans">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            />

            {/* Dialog Card */}
            <div className="flex min-h-full items-start justify-center p-3 sm:p-6 md:p-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -16 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                onKeyDown={handleKeyDown}
                className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[28px] shadow-2xl overflow-hidden mt-6 md:mt-10"
              >
                {/* Search Bar Input */}
                <div className="relative p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <Search className="w-5 h-5 text-indigo-500 absolute left-6 sm:left-7 top-1/2 -translate-y-1/2" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={
                      language === 'uz'
                        ? 'Mavzu, 3D model, lotincha termin yoki test toping...'
                        : language === 'ru'
                        ? 'Найдите тему, 3D модель, термин или тест...'
                        : 'Search topics, 3D models, terms, quizzes...'
                    }
                    className="w-full pl-10 sm:pl-12 pr-12 py-2 bg-transparent border-0 outline-none text-slate-900 dark:text-white placeholder:text-slate-400 text-base font-bold focus:ring-0"
                  />
                  {query ? (
                    <button
                      onClick={() => setQuery('')}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                      title="Tozalash"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className="hidden sm:inline-block px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[9px] font-mono text-slate-400">
                        ESC
                      </span>
                    </div>
                  )}
                </div>

                {/* Filter Tabs */}
                {query.trim() && (
                  <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                        activeTab === 'all'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      Barchasi ({totalResultsCount})
                    </button>
                    <button
                      onClick={() => setActiveTab('topics')}
                      className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                        activeTab === 'topics'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      Mavzular ({searchResults.topics.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('models')}
                      className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                        activeTab === 'models'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      3D Modellar ({searchResults.models.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('latin')}
                      className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                        activeTab === 'latin'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      Lotincha ({searchResults.latinTerms.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('quizzes')}
                      className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                        activeTab === 'quizzes'
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      Testlar ({searchResults.quizzes.length})
                    </button>
                  </div>
                )}

                {/* Content Items List */}
                <div className="max-h-[420px] overflow-y-auto p-4 sm:p-5 space-y-2">
                  {loading ? (
                    <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
                      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                      <span className="text-xs font-black uppercase tracking-widest">Ma’lumotlar indexlanmoqda...</span>
                    </div>
                  ) : flatResults.length === 0 ? (
                    <div className="py-16 text-center">
                      <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 mx-auto mb-3 border border-slate-200 dark:border-slate-700">
                        <Search className="w-6 h-6 text-slate-400" />
                      </div>
                      <h4 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-white mb-1">
                        Natijalar topilmadi
                      </h4>
                      <p className="text-xs text-slate-400 max-w-xs mx-auto font-medium">
                        Izlangan kalit so‘z bo‘yicha hech qanday darslik, 3D model yoki lotincha termin topilmadi.
                      </p>
                    </div>
                  ) : (
                    flatResults.map((item, index) => {
                      const isSelected = index === selectedIndex;
                      return (
                        <div
                          key={item.id}
                          ref={(el) => { itemRefs.current[index] = el; }}
                          onMouseEnter={() => setSelectedIndex(index)}
                          onClick={() => handleNavigate(item.path, item.state)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                            isSelected
                              ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-300 dark:border-indigo-700 shadow-md shadow-indigo-500/5'
                              : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 hover:bg-slate-100/80 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className={`p-2.5 rounded-xl border shrink-0 ${
                              isSelected 
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            }`}>
                              {item.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h5 className={`text-xs sm:text-sm font-black tracking-tight truncate ${
                                  isSelected ? 'text-indigo-950 dark:text-indigo-200' : 'text-slate-800 dark:text-slate-100'
                                }`}>
                                  {item.title}
                                </h5>
                                {item.badge && (
                                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider shrink-0 ${item.badgeColor || 'bg-slate-200 text-slate-700'}`}>
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              {item.subtitle && (
                                <p className={`text-[11px] font-medium truncate mt-0.5 ${
                                  isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400'
                                }`}>
                                  {item.subtitle}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {isSelected && (
                              <span className="hidden sm:flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-100/80 dark:bg-indigo-900/60 px-2 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800">
                                <span>Tanlash</span>
                                <CornerDownLeft className="w-3 h-3" />
                              </span>
                            )}
                            <ChevronRight className={`w-4 h-4 transition-transform ${
                              isSelected ? 'text-indigo-600 dark:text-indigo-400 translate-x-1' : 'text-slate-400'
                            }`} />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Keyboard Shortcut Guidance Footer */}
                <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-2xs flex items-center">
                        <ArrowUp className="w-2.5 h-2.5" />
                        <ArrowDown className="w-2.5 h-2.5" />
                      </kbd>
                      <span>Navigatsiya</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-2xs">
                        ↵
                      </kbd>
                      <span>Ochish</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-slate-400">
                    <span>Yopish uchun:</span>
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded shadow-2xs">
                      ESC
                    </kbd>
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
