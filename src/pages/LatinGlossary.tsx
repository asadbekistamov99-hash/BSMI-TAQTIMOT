import { useEffect, useState, useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Search, 
  Globe, 
  ChevronRight, 
  Book, 
  Sparkles, 
  Languages, 
  Heart, 
  Volume2, 
  Check, 
  BookOpen, 
  ListOrdered,
  X
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { dbService } from '../lib/dbService';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import AnatomicalDictation from '../components/AnatomicalDictation';
import SEO from '../components/SEO';
import Pagination from '../components/Pagination';
import { 
  ALL_TOPIC_GLOSSARY_TERMS, 
  TOPIC_GLOSSARY_METADATA, 
  TopicGlossaryTerm 
} from '../data/topicGlossaryData';
import { LatinTerm } from '../types';

export default function LatinGlossary({ isAdmin: isAdminProp, user }: { isAdmin?: boolean, user?: any }) {
  const { language, t } = useLanguage();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Selected semester (0 = All, 1 = 1-semestr, 2 = 2-semestr, 3 = 3-semestr)
  const initialSem = Number(searchParams.get('semester')) || 1;
  const initialTopic = Number(searchParams.get('topic')) || 0; // 0 = all topics in semester

  const [selectedSemester, setSelectedSemester] = useState<number>(initialSem);
  const [selectedTopicOrder, setSelectedTopicOrder] = useState<number>(initialTopic);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlpha, setSelectedAlpha] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<'glossary' | 'dictation'>('glossary');
  const [favorites, setFavorites] = useState<Record<string, any>>({});
  const [cloudTerms, setCloudTerms] = useState<LatinTerm[]>([]);

  useEffect(() => {
    if (location.state?.search) {
      setSearchQuery(location.state.search);
    } else {
      const searchParam = searchParams.get('search');
      if (searchParam) {
        setSearchQuery(searchParam);
      }
    }
  }, [location, searchParams]);

  // Load custom terms from database if any exist
  useEffect(() => {
    const fetchCloud = async () => {
      try {
        const data = await dbService.getLatinTerms();
        if (data && data.length > 0) {
          setCloudTerms(data);
        }
      } catch (e) {
        console.warn("Could not fetch additional cloud terms", e);
      }
    };
    fetchCloud();
  }, []);

  const handleSemesterChange = (sem: number) => {
    setSelectedSemester(sem);
    setSelectedTopicOrder(0); // Reset topic when semester changes
    setSelectedAlpha(null);
  };

  const handleTopicChange = (order: number) => {
    setSelectedTopicOrder(order);
    setSelectedAlpha(null);
  };

  // Combine static curated topic terms and cloud terms with cloud overriding static
  const allAvailableTerms: LatinTerm[] = useMemo(() => {
    const termMap = new Map<string, LatinTerm>();

    // 1. Initial curated terms
    ALL_TOPIC_GLOSSARY_TERMS.forEach(t => {
      termMap.set(t.id, {
        id: t.id,
        latin: t.latin,
        uzbek: t.uzbek,
        russian: t.russian || '',
        english: t.english || '',
        semester: t.semester,
        topicOrder: t.topicOrder,
        description: t.description || ''
      });
    });

    // 2. Overlay cloud terms from Firestore (edits, new additions, deletions)
    cloudTerms.forEach(ct => {
      if (ct.isDeleted) {
        termMap.delete(ct.id);
        const latKey = ct.latin.trim().toLowerCase();
        for (const [key, val] of termMap.entries()) {
          if (val.latin.trim().toLowerCase() === latKey) {
            termMap.delete(key);
          }
        }
        return;
      }

      if (termMap.has(ct.id)) {
        termMap.set(ct.id, { ...termMap.get(ct.id), ...ct });
        return;
      }

      const latKey = ct.latin.trim().toLowerCase();
      let matchedKey: string | null = null;
      for (const [key, val] of termMap.entries()) {
        if (val.latin.trim().toLowerCase() === latKey) {
          matchedKey = key;
          break;
        }
      }

      if (matchedKey) {
        termMap.set(matchedKey, { ...termMap.get(matchedKey), ...ct, id: ct.id || matchedKey });
      } else {
        termMap.set(ct.id, ct);
      }
    });

    return Array.from(termMap.values());
  }, [cloudTerms]);

  // Filter topics for the currently selected semester
  const topicsForCurrentSemester = useMemo(() => {
    if (selectedSemester === 0) return [];
    return Object.entries(TOPIC_GLOSSARY_METADATA)
      .filter(([_, meta]) => meta.semester === selectedSemester)
      .sort((a, b) => a[1].order - b[1].order);
  }, [selectedSemester]);

  // Filter terms according to selected semester, topic, alphabet, and search query
  const filteredTerms = useMemo(() => {
    return allAvailableTerms.filter(term => {
      // Semester filter
      if (selectedSemester !== 0) {
        if (term.semester && term.semester !== selectedSemester) {
          return false;
        }
      }

      // Topic filter
      if (selectedTopicOrder !== 0) {
        if (term.topicOrder !== selectedTopicOrder) {
          return false;
        }
      }

      // Alphabet filter
      if (selectedAlpha) {
        if (!term.latin.toUpperCase().startsWith(selectedAlpha)) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesLatin = term.latin.toLowerCase().includes(query);
        const matchesUzbek = term.uzbek.toLowerCase().includes(query);
        const matchesRussian = term.russian?.toLowerCase().includes(query) || false;
        const matchesEnglish = term.english?.toLowerCase().includes(query) || false;
        return matchesLatin || matchesUzbek || matchesRussian || matchesEnglish;
      }

      return true;
    });
  }, [allAvailableTerms, selectedSemester, selectedTopicOrder, selectedAlpha, searchQuery]);

  // Pagination state: default 12 terms per page for compact, neat grid
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Reset to page 1 whenever any filter or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSemester, selectedTopicOrder, selectedAlpha, searchQuery]);

  const totalPages = Math.ceil(filteredTerms.length / pageSize) || 1;

  const paginatedTerms = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTerms.slice(start, start + pageSize);
  }, [filteredTerms, currentPage, pageSize]);

  // Helper for localized term translation
  const getLocalizedTermStr = (val: string, term?: LatinTerm) => {
    if (!term) return val;
    if (language === 'ru' && term.russian) return term.russian;
    if (language === 'en' && term.english) return term.english;
    return term.uzbek || val;
  };

  // Favorites handling
  useEffect(() => {
    loadFavorites();
  }, [user]);

  useEffect(() => {
    const handleUpdate = () => {
      loadFavorites();
    };
    window.addEventListener('favorites_updated', handleUpdate);
    return () => window.removeEventListener('favorites_updated', handleUpdate);
  }, [user]);

  const loadFavorites = async () => {
    try {
      if (user) {
        const qRef = collection(db, 'users', user.uid, 'flashcards');
        const snap = await getDocs(qRef);
        const fetched: Record<string, any> = {};
        snap.forEach(docSnap => {
          fetched[docSnap.id] = docSnap.data();
        });
        setFavorites(fetched);
      } else {
        const localData = localStorage.getItem('flashcards_data_guest');
        if (localData) {
          setFavorites(JSON.parse(localData));
        } else {
          setFavorites({});
        }
      }
    } catch (e) {
      console.error("Error loading glossary favorites:", e);
    }
  };

  const toggleFavoriteFromGlossary = async (termId: string) => {
    const existing = favorites[termId];
    let updated: any;
    if (existing && existing.isFavorite) {
      updated = {
        ...existing,
        isFavorite: false
      };
    } else {
      updated = {
        termId,
        isFavorite: true,
        interval: 0,
        repetitions: 0,
        easeFactor: 2.5,
        nextReview: new Date().toISOString()
      };
    }

    const newFavorites = { ...favorites, [termId]: updated };
    setFavorites(newFavorites);

    try {
      if (user) {
        const docRef = doc(db, 'users', user.uid, 'flashcards', termId);
        await setDoc(docRef, updated, { merge: true });
      } else {
        localStorage.setItem('flashcards_data_guest', JSON.stringify(newFavorites));
      }
    } catch (e) {
      console.error("Error saving favorite in glossary list: ", e);
    }
  };

  const speakLatinWord = (text: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'la';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const alphabet = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');

  // Semester labels
  const semesterLabels: Record<number, { uz: string; ru: string; en: string }> = {
    0: { uz: "Barcha Mavzular", ru: "Все Темы", en: "All Topics" },
    1: { uz: "1-Semestr (Suyak, Bo'g'im, Mushak)", ru: "1-Семестр (Кости, Суставы, Мышцы)", en: "1st Semester (Bones, Joints, Muscles)" },
    2: { uz: "2-Semestr (Ichki a'zolar, Tomirlar)", ru: "2-Семестр (Внутренности, Сосуды)", en: "2nd Semester (Internal Organs, Vessels)" },
    3: { uz: "3-Semestr (Asab va Sezgi tizimlari)", ru: "3-Семестр (Нервная система и органы чувств)", en: "3rd Semester (Nervous & Sensory Systems)" },
  };

  // Find currently active topic meta
  const currentTopicKey = selectedSemester > 0 && selectedTopicOrder > 0 ? `sem${selectedSemester}_top${selectedTopicOrder}` : null;
  const currentTopicMeta = currentTopicKey ? TOPIC_GLOSSARY_METADATA[currentTopicKey] : null;

  return (
    <div className="bg-brand-bg min-h-screen">
      <SEO 
        title="Lotincha Anatomik Lug'at va Flashcardlar | BSMI Anatomy"
        description="Odam anatomiyasi fani bo'yicha har bir mavzuga mos alohida lotincha terminologik lug'at, interaktiv flashcardlar va lotincha diktant mashqlari."
        keywords="lotincha lugat, anatomiya terminlari, mavzular boyicha lugat, osteologiya, miologiya, nevrologiya, lotincha diktant"
      />

      {/* Header */}
      <header className="bg-brand-primary py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-accent/10 blur-[100px] -mr-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Globe className="text-brand-accent w-6 h-6" />
                <span className="text-xs font-black text-brand-accent uppercase tracking-[0.3em]">
                  {{ uz: "Mavzular Bo'yicha Anatomik Lug'at", ru: "Анатомический Словарь по Темам", en: "Topic-Based Anatomical Glossary" }[language]}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase mb-3">
                {{ uz: "Lotincha Lug'at & Terminologiya", ru: "Латинский Словарь и Терминология", en: "Latin Glossary & Terminology" }[language]}
              </h1>
              <p className="text-slate-400 font-bold text-base max-w-2xl leading-relaxed">
                {{ 
                  uz: "Har bir semestr va mavzuga mos ravishda saralangan aniq anatomik terminlar. Suyaklar mavzusida faqat suyaklar, mushaklar mavzusida esa faqat mushaklar o'rganiladi.", 
                  ru: "Анатомические термины, строго разделенные по семестрам и темам. Изучайте кости отдельно, а мышцы отдельно без путаницы.", 
                  en: "Precise anatomical terms strictly grouped by semesters and topics. Bones contain only bones, while muscles contain only muscles without overlap." 
                }[language]}
              </p>
            </motion.div>

            {/* Global Search Input */}
            <div className="w-full md:w-96">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder={t('gloss_placeholder') || "Termin qidirish (lotincha, o'zbekcha)..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-14 pr-10 py-4 bg-slate-800/80 border border-slate-700 rounded-2xl text-white focus:border-brand-accent outline-none transition-all placeholder:text-slate-500 font-bold text-sm"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Navigation Modes (Lug'at / Diktant) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-brand-border">
          {/* Mode Switcher */}
          <div className="inline-flex p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveMode('glossary')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 ${
                activeMode === 'glossary'
                  ? 'bg-brand-primary text-white shadow-md'
                  : 'text-brand-muted hover:text-brand-primary'
              }`}
            >
              <Book className="w-4 h-4" />
              {{ uz: "Lug'at Ko'rinishi", ru: "Вид Словаря", en: "Dictionary View" }[language]}
            </button>
            <button
              onClick={() => setActiveMode('dictation')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 ${
                activeMode === 'dictation'
                  ? 'bg-gradient-to-r from-sky-600 to-[#0e45e9] text-white shadow-md'
                  : 'text-brand-muted hover:text-[#0e45e9]'
              }`}
            >
              ✍️ {{ uz: "Lotincha Diktant", ru: "Диктант", en: "Latin Dictation" }[language]}
            </button>
          </div>

          {/* Active stats counter */}
          <div className="flex items-center gap-3 text-xs font-bold text-brand-muted">
            <span className="px-3 py-1.5 bg-white border border-brand-border rounded-xl text-brand-primary font-black shadow-sm">
              {filteredTerms.length} {{ uz: "ta termin", ru: "терминов", en: "terms" }[language]}
            </span>
            {currentTopicMeta && (
              <span className="hidden md:inline-flex px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl font-black text-[11px]">
                {selectedSemester}-Semestr, {selectedTopicOrder}-Mavzu
              </span>
            )}
          </div>
        </div>

        {/* Semester Selection Tabs */}
        <div className="mb-6">
          <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-brand-muted mb-3">
            {{ uz: "1. Semestrni tanlang:", ru: "1. Выберите семестр:", en: "1. Select Semester:" }[language]}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 0].map((sem) => {
              const isSelected = selectedSemester === sem;
              return (
                <button
                  key={sem}
                  onClick={() => handleSemesterChange(sem)}
                  className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex items-center justify-between group ${
                    isSelected
                      ? 'bg-brand-primary text-white border-brand-primary shadow-lg shadow-brand-primary/10 ring-2 ring-brand-accent/40'
                      : 'bg-white text-brand-primary border-brand-border hover:border-brand-accent/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="pr-2">
                    <div className="text-[10px] font-black uppercase tracking-wider opacity-60 mb-0.5">
                      {sem === 0 ? "UMUMIY" : `${sem}-SEMESTR`}
                    </div>
                    <div className={`font-black text-sm tracking-tight leading-snug ${isSelected ? 'text-brand-accent' : 'text-brand-primary'}`}>
                      {semesterLabels[sem][language]}
                    </div>
                  </div>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-brand-accent text-brand-primary' : 'bg-slate-100 text-slate-400 group-hover:bg-brand-accent/20 group-hover:text-brand-primary'
                  }`}>
                    {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Topic Selection Row (Shown when a specific semester is chosen) */}
        {selectedSemester > 0 && (
          <div className="mb-8 bg-white p-6 rounded-3xl border border-brand-border shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <ListOrdered className="w-5 h-5 text-brand-accent" />
                <h3 className="font-black text-sm uppercase tracking-wider text-brand-primary">
                  {{ 
                    uz: `${selectedSemester}-Semestr Mavzulari bo'yicha lug'atlar:`, 
                    ru: `Словари по темам ${selectedSemester}-го семестра:`, 
                    en: `Glossary by topics of ${selectedSemester}th Semester:` 
                  }[language]}
                </h3>
              </div>
              <button
                onClick={() => handleTopicChange(0)}
                className={`text-xs font-black px-4 py-1.5 rounded-xl uppercase tracking-wider transition-all ${
                  selectedTopicOrder === 0
                    ? 'bg-brand-primary text-white'
                    : 'text-brand-muted hover:text-brand-primary bg-slate-100'
                }`}
              >
                {{ uz: "Semestrdagi barcha mavzular", ru: "Все темы семестра", en: "All semester topics" }[language]}
              </button>
            </div>

            {/* Topics Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {topicsForCurrentSemester.map(([key, meta]) => {
                const isTopicSelected = selectedTopicOrder === meta.order;
                const topicTitle = meta.title[language] || meta.title.uz;
                return (
                  <button
                    key={key}
                    onClick={() => handleTopicChange(meta.order)}
                    className={`p-3 text-left rounded-xl border text-xs font-bold transition-all flex items-start gap-2.5 ${
                      isTopicSelected
                        ? 'bg-brand-accent/15 border-brand-accent text-brand-primary font-black shadow-sm ring-1 ring-brand-accent'
                        : 'bg-slate-50/70 border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${
                      isTopicSelected ? 'bg-brand-primary text-white' : 'bg-white border border-slate-200 text-slate-600'
                    }`}>
                      {meta.order}
                    </span>
                    <span className="line-clamp-2 leading-tight">
                      {topicTitle}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Currently Active Topic Notification Banner */}
            {currentTopicMeta && (
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-2 text-emerald-900 font-bold">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>{selectedTopicOrder}-Mavzu tanlandi:</strong> {currentTopicMeta.title[language] || currentTopicMeta.title.uz}
                  </span>
                </div>
                <button 
                  onClick={() => handleTopicChange(0)}
                  className="text-[11px] font-black uppercase text-emerald-700 hover:underline tracking-wider shrink-0"
                >
                  {{ uz: "Filtrni bekor qilish", ru: "Сбросить фильтр", en: "Clear filter" }[language]}
                </button>
              </div>
            )}
          </div>
        )}

        {/* View Mode Switching: Dictation or Topic Glossary */}
        {activeMode === 'dictation' ? (
          <AnatomicalDictation user={user} terms={filteredTerms} getLocalizedTermStr={getLocalizedTermStr} />
        ) : (
          <>
            {/* Alphabet Filter */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-brand-border mb-8 overflow-x-auto">
              <div className="flex items-center gap-1.5 min-w-max">
                <button 
                  onClick={() => setSelectedAlpha(null)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${
                    !selectedAlpha ? 'bg-brand-primary text-white' : 'text-brand-muted hover:bg-slate-50'
                  }`}
                >
                  {t('gloss_all') || 'BARCHASI'}
                </button>
                {alphabet.map(char => (
                  <button 
                    key={char}
                    onClick={() => setSelectedAlpha(char === selectedAlpha ? null : char)}
                    className={`w-9 h-9 rounded-xl text-xs font-black transition-all flex items-center justify-center border ${
                      selectedAlpha === char 
                        ? 'bg-brand-accent border-brand-accent text-brand-primary font-black shadow-sm' 
                        : 'border-slate-100 text-slate-400 hover:border-brand-accent hover:text-brand-accent'
                    }`}
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>

            {/* Terms Grid */}
            <div id="latin-terms-grid">
              {filteredTerms.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedTerms.map((term, index) => {
                      const localizedTitle = getLocalizedTermStr(term.uzbek, term);
                      return (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: Math.min((index % 30) * 0.02, 0.5) }}
                          key={term.id}
                          className="group bg-white p-7 rounded-[32px] border border-brand-border hover:border-brand-accent hover:shadow-xl hover:shadow-brand-accent/5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                        >
                          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-accent/5 rounded-bl-[60px] -mr-12 -mt-12 transition-all group-hover:bg-brand-accent/15"></div>
                          
                          {/* Action buttons (Audio & Favorite) */}
                          <div className="absolute top-5 right-5 z-20 flex gap-2">
                            <button
                              onClick={(e) => speakLatinWord(term.latin, e)}
                              className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 hover:bg-sky-50 hover:scale-110 active:scale-95 flex items-center justify-center transition-all cursor-pointer shadow-sm text-slate-400 hover:text-sky-600 hover:border-sky-200"
                              title="Lotincha talaffuz (Audio)"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => toggleFavoriteFromGlossary(term.id)}
                              className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 hover:bg-red-50 hover:scale-110 active:scale-95 flex items-center justify-center transition-all cursor-pointer shadow-sm text-slate-300 hover:text-red-500"
                              title="Yodlash kartalariga qo'shish"
                            >
                              <Heart 
                                className={`w-4 h-4 transition-all ${favorites[term.id]?.isFavorite ? 'text-red-500 fill-red-500' : 'text-slate-300 hover:text-red-500'}`} 
                              />
                            </button>
                          </div>

                          <div className="relative z-10 pr-12">
                            {/* Topic badge */}
                            {term.semester && term.topicOrder ? (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-bg rounded-lg text-[10px] font-black text-brand-muted uppercase tracking-wider mb-3 border border-brand-border">
                                <span>{term.semester}-Semestr</span>
                                <span>•</span>
                                <span className="text-brand-accent">{term.topicOrder}-Mavzu</span>
                              </div>
                            ) : (
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-bg rounded-lg text-[10px] font-black text-brand-muted uppercase tracking-wider mb-3 border border-brand-border">
                                <span>Anatomiya</span>
                              </div>
                            )}
                            
                            {/* Main Latin Term */}
                            <h3 className="text-xl font-black text-brand-primary mb-2 italic tracking-tight group-hover:text-brand-accent transition-colors leading-snug">
                              {term.latin}
                            </h3>
                            
                            {/* Localized Primary Translation */}
                            <div className="flex items-start gap-2.5 mt-4 pt-4 border-t border-slate-100">
                              <ChevronRight size={16} className="text-brand-accent shrink-0 mt-0.5" />
                              <span className="text-base font-black text-slate-800 leading-snug">
                                {localizedTitle}
                              </span>
                            </div>

                            {/* Multi-language Alternative Badges */}
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {language !== 'uz' && term.uzbek && (
                                <span className="px-2 py-0.5 bg-slate-50 border border-slate-200/80 rounded-md text-[11px] font-medium text-slate-600">
                                  <strong className="text-[9px] text-slate-400 uppercase mr-1">UZ:</strong>
                                  {term.uzbek}
                                </span>
                              )}
                              {language !== 'ru' && term.russian && (
                                <span className="px-2 py-0.5 bg-slate-50 border border-slate-200/80 rounded-md text-[11px] font-medium text-slate-600">
                                  <strong className="text-[9px] text-slate-400 uppercase mr-1">RU:</strong>
                                  {term.russian}
                                </span>
                              )}
                              {language !== 'en' && term.english && (
                                <span className="px-2 py-0.5 bg-slate-50 border border-slate-200/80 rounded-md text-[11px] font-medium text-slate-600">
                                  <strong className="text-[9px] text-slate-400 uppercase mr-1">EN:</strong>
                                  {term.english}
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {totalPages > 1 && (
                    <div className="bg-white px-6 py-4 rounded-2xl border border-brand-border/60 shadow-xs mt-8">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        totalItems={filteredTerms.length}
                        pageSize={pageSize}
                        pageSizeOptions={[12, 24, 48]}
                        onPageSizeChange={(sz) => { setPageSize(sz); setCurrentPage(1); }}
                        scrollTargetId="latin-terms-grid"
                        prevLabel={{ uz: 'Oldingisi', ru: 'Предыдущая', en: 'Previous' }[language] || 'Oldingisi'}
                        nextLabel={{ uz: 'Keyingisi', ru: 'Следующая', en: 'Next' }[language] || 'Keyingisi'}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-24 bg-white rounded-[36px] border border-brand-border border-dashed p-8">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <Search size={32} />
                  </div>
                  <h3 className="text-xl font-black text-brand-primary uppercase tracking-tight">
                    {{ uz: "Termin topilmadi", ru: "Термин не найден", en: "No terms found" }[language]}
                  </h3>
                  <p className="text-brand-muted text-xs mt-2 max-w-sm mx-auto font-medium">
                    {{ 
                      uz: "Siz qidirgan so'rov yoki tanlangan filtrlar bo'yicha lug'atdan ma'lumot topilmadi. Boshqa mavzuni yoki filtrni tanlab ko'ring.", 
                      ru: "По вашему запросу или выбранному фильтру ничего не найдено. Попробуйте выбрать другую тему.", 
                      en: "No terms matched your query or filters. Try selecting another topic or clearing your search." 
                    }[language]}
                  </p>
                  <div className="mt-6 flex justify-center gap-3">
                    <button
                      onClick={() => { setSelectedTopicOrder(0); setSearchQuery(''); setSelectedAlpha(null); }}
                      className="px-5 py-2.5 bg-brand-primary text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-brand-accent hover:text-brand-primary transition-all"
                    >
                      {{ uz: "Filtrlarni tozalash", ru: "Сбросить все фильтры", en: "Reset all filters" }[language]}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Educational Footer Banner */}
      <section className="bg-brand-primary py-20 mt-16 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase mb-6 leading-tight">
                {{ uz: "Har bir mavzuni mustaqil va chuqur o'rganing", ru: "Изучайте каждую тему изолированно и глубоко", en: "Master each topic independently and deeply" }[language]}
              </h2>
              <p className="text-slate-400 text-base mb-8 leading-relaxed font-medium">
                {{ 
                  uz: "Suyaklar, bo'g'imlar, mushaklar, ichki a'zolar va asab tizimi bir-biriga aralashmasdan, aniq darslik rejasiga binoan o'rgatiladi. Flashcardlar orqali har bir mavzu bo'yicha alohida bilimingizni sinab ko'rishingiz mumkin.", 
                  ru: "Кости, суставы, мышцы, внутренние органы и нервная система изучаются строго последовательно без смешивания. Проверяйте свои знания через карточки.", 
                  en: "Bones, joints, muscles, splanchnology and neuroanatomy are strictly separated according to the curriculum. Test your knowledge with flashcards." 
                }[language]}
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-brand-accent shrink-0">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-black text-xs uppercase tracking-tight mb-1">
                      {{ uz: "Mavzuviy Saralash", ru: "Тематическая сортировка", en: "Topic Categorization" }[language]}
                    </h4>
                    <p className="text-slate-500 text-[11px] font-medium">
                      {{ uz: "Har mavzuga faqat o'ziga tegishli lug'atlar.", ru: "Каждой теме — только её термины.", en: "Each topic strictly features its own terms." }[language]}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-brand-accent shrink-0">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-black text-xs uppercase tracking-tight mb-1">
                      {{ uz: "3 Tilda Tarjima", ru: "Перевод на 3 языка", en: "3-Language Support" }[language]}
                    </h4>
                    <p className="text-slate-500 text-[11px] font-medium">
                      {{ uz: "Lotincha, O'zbekcha, Ruscha va Inglizcha.", ru: "Латынь, узбекский, русский и английский.", en: "Latin, Uzbek, Russian, English." }[language]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-brand-accent/20 rounded-[60px] rotate-6 absolute inset-0"></div>
              <div className="relative aspect-square bg-[#0B0F17] rounded-[60px] p-8 border border-white/5 flex flex-col justify-center">
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 bg-brand-accent rounded-full animate-pulse"></div>
                    <div className="text-xl font-black italic text-brand-accent">Columna vertebralis</div>
                    <div className="h-px bg-white/20 flex-grow"></div>
                    <div className="text-sm font-bold text-white/70">1-Mavzu (Suyak)</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full"></div>
                    <div className="text-xl font-black italic text-white/90">Articulatio coxae</div>
                    <div className="h-px bg-white/20 flex-grow"></div>
                    <div className="text-sm font-bold text-white/50">9-Mavzu (Bo'g'im)</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 bg-sky-400 rounded-full"></div>
                    <div className="text-xl font-black italic text-white/80">Musculus biceps brachii</div>
                    <div className="h-px bg-white/20 flex-grow"></div>
                    <div className="text-sm font-bold text-white/40">12-Mavzu (Mushak)</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 bg-purple-400 rounded-full"></div>
                    <div className="text-xl font-black italic text-white/60">Medulla spinalis</div>
                    <div className="h-px bg-white/20 flex-grow"></div>
                    <div className="text-sm font-bold text-white/30">3-Semestr (Nerv)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
