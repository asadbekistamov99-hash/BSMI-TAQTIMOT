import React, { useState, useMemo, useEffect } from 'react';
import { Search, Volume2, Copy, Check, BookA, ExternalLink } from 'lucide-react';
import { TopicTerm } from '../types';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';
import Pagination from './Pagination';
import { 
  ALL_TOPIC_GLOSSARY_TERMS, 
  getGlossaryTermsByTopic,
  TOPIC_GLOSSARY_METADATA 
} from '../data/topicGlossaryData';
import { SEMESTER_3_DETAILED_TOPICS } from '../data/semester3TopicsData';

interface TopicGlossaryViewerProps {
  topicTitle: string;
  topicId?: string;
  terms?: TopicTerm[];
  latinTerms?: string[];
  semester?: number;
  topicOrder?: number;
  theory?: any;
}

export default function TopicGlossaryViewer({
  topicTitle,
  topicId = '',
  terms = [],
  latinTerms = [],
  semester,
  topicOrder,
  theory
}: TopicGlossaryViewerProps) {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dbTerms, setDbTerms] = useState<TopicTerm[]>([]);
  const [loadingDb, setLoadingDb] = useState(false);

  // Fetch related terms from Firestore if needed
  useEffect(() => {
    let isMounted = true;
    async function fetchRelatedDbTerms() {
      try {
        setLoadingDb(true);
        const termsRef = collection(db, 'latin_terms');
        const q = query(termsRef);
        const snap = await getDocs(q);
        if (!isMounted) return;
        
        const fetched: TopicTerm[] = [];
        snap.forEach(docSnap => {
          const data = docSnap.data();
          fetched.push({
            id: docSnap.id,
            latin: data.latin || '',
            uzbek: data.uzbek || '',
            russian: data.russian || '',
            english: data.english || '',
            description: data.description || '',
            pronunciation: data.pronunciation || ''
          });
        });
        setDbTerms(fetched);
      } catch (err) {
        console.warn('Failed to fetch global terms for enrichment', err);
      } finally {
        if (isMounted) setLoadingDb(false);
      }
    }

    fetchRelatedDbTerms();
    return () => { isMounted = false; };
  }, [topicId]);

  // Combine terms: structured topic.terms + parsed topic.latinTerms + curriculum glossary fallback + matching dbTerms
  const combinedTerms = useMemo(() => {
    const termMap = new Map<string, TopicTerm>();

    // 1. Structured topic.terms
    if (Array.isArray(terms) && terms.length > 0) {
      terms.forEach((t, idx) => {
        if (t && t.latin) {
          const key = t.latin.trim().toLowerCase();
          termMap.set(key, {
            id: t.id || `term-${idx}`,
            latin: t.latin.trim(),
            uzbek: t.uzbek?.trim() || t.uz?.trim() || '',
            russian: t.russian?.trim() || t.ru?.trim() || '',
            english: t.english?.trim() || t.en?.trim() || '',
            description: t.description?.trim() || '',
            pronunciation: t.pronunciation || ''
          });
        }
      });
    }

    // 2. Legacy latinTerms strings (e.g. "Musculus biceps brachii (Yelkaning ikki boshli mushagi)", "Medulla spinalis - Orqa miya")
    if (Array.isArray(latinTerms) && latinTerms.length > 0) {
      latinTerms.forEach((rawStr, idx) => {
        if (!rawStr || typeof rawStr !== 'string') return;
        const str = rawStr.trim();
        if (!str) return;

        let latin = str;
        let uzbek = '';

        // Check if format is "Latin (Uzbek)"
        const parenMatch = str.match(/^(.+?)\s*\((.+?)\)$/);
        if (parenMatch) {
          latin = parenMatch[1].trim();
          uzbek = parenMatch[2].trim();
        } else {
          // Check "Latin — Uzbek", "Latin - Uzbek", or "Latin: Uzbek"
          const delimiterMatch = str.match(/^([A-Za-z\s/,\.\(\)‘'’\-]+?)\s*[\-—–:]\s*(.+)$/);
          if (delimiterMatch) {
            latin = delimiterMatch[1].trim();
            uzbek = delimiterMatch[2].trim();
          }
        }

        const key = latin.toLowerCase();
        if (!termMap.has(key)) {
          termMap.set(key, {
            id: `legacy-${idx}`,
            latin: latin,
            uzbek: uzbek,
            russian: '',
            english: '',
            description: '',
            pronunciation: ''
          });
        }
      });
    }

    // 3. Fallback: Curriculum Glossary (topicGlossaryData.ts & semester3TopicsData.ts)
    // Extract sem and order
    let sem = semester;
    let ord = topicOrder;

    if (!sem && topicId) {
      const match = topicId.match(/sem_?(\d+)/i);
      if (match) sem = parseInt(match[1], 10);
    }
    if (!ord && topicId) {
      const match = topicId.match(/(?:top_|topic_|top)(\d+)/i);
      if (match) ord = parseInt(match[1], 10);
    }
    if (!ord && topicTitle) {
      const match = topicTitle.match(/^(\d+)[\-\.]\s*mavzu/i);
      if (match) ord = parseInt(match[1], 10);
    }

    // Try title matching against metadata if sem or ord is still missing
    if ((!sem || !ord) && topicTitle) {
      const cleanTitle = topicTitle.toLowerCase();
      for (const [, meta] of Object.entries(TOPIC_GLOSSARY_METADATA)) {
        const uzTitle = meta.title.uz.toLowerCase();
        if (uzTitle.includes(cleanTitle) || cleanTitle.includes(uzTitle.replace(/^\d+-mavzu:\s*/i, ''))) {
          if (!sem) sem = meta.semester;
          if (!ord) ord = meta.order;
          break;
        }
      }
    }

    // Pull from curated curriculum terms
    if (sem && ord) {
      const curriculumTerms = getGlossaryTermsByTopic(sem, ord);
      if (curriculumTerms && curriculumTerms.length > 0) {
        curriculumTerms.forEach(gt => {
          const key = gt.latin.trim().toLowerCase();
          if (!termMap.has(key)) {
            termMap.set(key, {
              id: gt.id,
              latin: gt.latin,
              uzbek: gt.uzbek,
              russian: gt.russian || '',
              english: gt.english || '',
              description: gt.description || '',
              pronunciation: ''
            });
          } else {
            const existing = termMap.get(key)!;
            if (!existing.russian && gt.russian) existing.russian = gt.russian;
            if (!existing.english && gt.english) existing.english = gt.english;
            if (!existing.description && gt.description) existing.description = gt.description;
            if (!existing.uzbek && gt.uzbek) existing.uzbek = gt.uzbek;
          }
        });
      }

      // Check Semester 3 detailed topics
      if (sem === 3 && ord <= SEMESTER_3_DETAILED_TOPICS.length) {
        const s3Topic = SEMESTER_3_DETAILED_TOPICS[ord - 1];
        if (s3Topic?.latinTerms) {
          s3Topic.latinTerms.forEach((rawStr, idx) => {
            const match = rawStr.match(/^(.+?)\s*\((.+?)\)$/);
            const latin = match ? match[1].trim() : rawStr.trim();
            const uzbek = match ? match[2].trim() : '';
            const key = latin.toLowerCase();
            if (!termMap.has(key)) {
              termMap.set(key, {
                id: `s3-${ord}-${idx}`,
                latin,
                uzbek,
                russian: '',
                english: '',
                description: '',
                pronunciation: ''
              });
            }
          });
        }
      }
    }

    // 4. Fallback: If still empty, search ALL_TOPIC_GLOSSARY_TERMS by title keywords
    if (termMap.size === 0 && topicTitle) {
      const titleWords = topicTitle.toLowerCase().split(/[\s,.:;—–\(\)]+/).filter(w => w.length > 3);
      ALL_TOPIC_GLOSSARY_TERMS.forEach(gt => {
        const uzLow = gt.uzbek.toLowerCase();
        const latLow = gt.latin.toLowerCase();
        if (titleWords.some(w => uzLow.includes(w) || latLow.includes(w))) {
          const key = gt.latin.trim().toLowerCase();
          if (!termMap.has(key)) {
            termMap.set(key, {
              id: gt.id,
              latin: gt.latin,
              uzbek: gt.uzbek,
              russian: gt.russian || '',
              english: gt.english || '',
              description: gt.description || '',
              pronunciation: ''
            });
          }
        }
      });
    }

    // 5. Fallback: extract terms from theory text in italics (e.g. *Medulla spinalis*)
    if (termMap.size === 0 && theory) {
      const theoryStr = typeof theory === 'string' ? theory : (theory.uz || Object.values(theory)[0] || '');
      const italicRegex = /\*([A-Za-z\s‘'’\-]{3,45})\*/g;
      let match;
      let count = 0;
      while ((match = italicRegex.exec(theoryStr)) !== null) {
        const latin = match[1].trim();
        if (latin.length > 3 && !latin.includes('\n')) {
          const key = latin.toLowerCase();
          if (!termMap.has(key)) {
            termMap.set(key, {
              id: `extracted-${count++}`,
              latin,
              uzbek: '',
              russian: '',
              english: '',
              description: ''
            });
          }
        }
      }
    }

    // 6. Enrich all terms with translations from dbTerms or ALL_TOPIC_GLOSSARY_TERMS
    termMap.forEach((val, key) => {
      const matchDb = dbTerms.find(d => {
        const dLat = d.latin.trim().toLowerCase();
        return dLat === key || key.startsWith(dLat) || dLat.startsWith(key);
      });
      if (matchDb) {
        if (!val.uzbek && matchDb.uzbek) val.uzbek = matchDb.uzbek;
        if (!val.russian && matchDb.russian) val.russian = matchDb.russian;
        if (!val.english && matchDb.english) val.english = matchDb.english;
        if (!val.description && matchDb.description) val.description = matchDb.description;
        if (!val.pronunciation && matchDb.pronunciation) val.pronunciation = matchDb.pronunciation;
      }

      const matchGlobal = ALL_TOPIC_GLOSSARY_TERMS.find(g => {
        const gLat = g.latin.trim().toLowerCase();
        return gLat === key || key.startsWith(gLat) || dLatMatch(key, gLat);
      });
      if (matchGlobal) {
        if (!val.uzbek && matchGlobal.uzbek) val.uzbek = matchGlobal.uzbek;
        if (!val.russian && matchGlobal.russian) val.russian = matchGlobal.russian;
        if (!val.english && matchGlobal.english) val.english = matchGlobal.english;
        if (!val.description && matchGlobal.description) val.description = matchGlobal.description;
      }
    });

    return Array.from(termMap.values());
  }, [terms, latinTerms, semester, topicOrder, topicId, topicTitle, theory, dbTerms]);

  // Helper for matching
  function dLatMatch(a: string, b: string): boolean {
    return a.includes(b) || b.includes(a);
  }

  // Filtered terms
  const filteredTerms = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return combinedTerms;
    return combinedTerms.filter(t => 
      t.latin.toLowerCase().includes(q) ||
      (t.uzbek && t.uzbek.toLowerCase().includes(q)) ||
      (t.russian && t.russian.toLowerCase().includes(q)) ||
      (t.english && t.english.toLowerCase().includes(q)) ||
      (t.description && t.description.toLowerCase().includes(q))
    );
  }, [combinedTerms, search]);

  // Pagination state: default 10 terms per page
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Reset to page 1 on search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.ceil(filteredTerms.length / pageSize) || 1;

  const paginatedTerms = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTerms.slice(start, start + pageSize);
  }, [filteredTerms, currentPage, pageSize]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      // Try Italian or Latin-like voice for anatomical terms, or English fallback
      utterance.lang = 'it-IT';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Search Bar */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-[28px] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 bg-white/10 rounded-xl text-brand-accent backdrop-blur-md">
                <BookA className="w-5 h-5" />
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-brand-accent">
                Anatomik Lug'at & Terminologiya
              </span>
            </div>
            <h3 className="text-2xl font-black tracking-tight text-white">
              {topicTitle} — Lug'atlar
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Ushbu mavzuda uchraydigan barcha lotincha anatomik atamalar, ularning o'zbekcha va xalqaro tarjimalari hamda to'g'ri talaffuzi.
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="mt-6 relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
            <Search className="w-4 h-4 text-brand-accent" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Lotincha, o'zbekcha yoki ruscha atama bo'yicha qidirish..."
            className="w-full pl-11 pr-4 py-3.5 bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 rounded-2xl text-white placeholder-slate-300 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-brand-accent/50"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white text-xs font-black uppercase"
            >
              Tozalash
            </button>
          )}
        </div>

        {/* Stats bar */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
          <span>Jami atamalar: <strong className="text-brand-accent">{combinedTerms.length} ta</strong></span>
          {search && (
            <span>Qidiruv natijasi: <strong className="text-white">{filteredTerms.length} ta</strong></span>
          )}
        </div>
      </div>

      {/* LIST VIEW */}
      <div id="topic-glossary-list" className="space-y-4">
          {filteredTerms.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-[32px] border border-slate-200 p-8">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookA className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-1">
                {search ? "Atama topilmadi" : "Ushbu mavzuda terminlar hali kiritilmagan"}
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
                {search 
                  ? "Boshqa so'z bilan qidirib ko'ring yoki umumiy Anatomik lug'at bo'limiga o'ting."
                  : "Mavzuga doir yangi terminlarni Admin panel orqali o'zingiz kiritishingiz va boshqarishingiz mumkin."}
              </p>
              <Link
                to="/atlas"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition-all"
              >
                <span>Umumiy Atlas & Lug'atga O'tish</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedTerms.map((t, index) => {
                  const globalIdx = (currentPage - 1) * pageSize + index + 1;
                  const isCopied = copiedId === t.id;
                  return (
                    <div
                      key={t.id || index}
                      className="p-5 sm:p-6 bg-white rounded-2xl border border-brand-border hover:border-brand-accent/60 shadow-xs hover:shadow-md transition-all group relative flex flex-col justify-between"
                    >
                      <div>
                        {/* Top badges & action buttons */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="px-2.5 py-1 bg-amber-50 border border-amber-200/80 text-amber-800 rounded-md text-[9px] font-black uppercase tracking-wider">
                            TERMIN #{globalIdx}
                          </span>
                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => handleSpeak(t.latin)}
                              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                              title="Lotincha talaffuzni tinglash"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopy(t.latin, t.id)}
                              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                              title="Atamani nusxalash"
                            >
                              {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Latin Primary Title */}
                        <h4 className="text-base sm:text-lg font-black text-slate-900 italic tracking-tight font-serif mb-2 group-hover:text-indigo-600 transition-colors">
                          {t.latin}
                        </h4>

                        {/* Translations */}
                        <div className="space-y-1.5 text-xs">
                          {t.uzbek && (
                            <div className="flex items-start gap-2 text-slate-800">
                              <span className="font-black text-indigo-600 shrink-0 text-[10px] uppercase tracking-wider bg-indigo-50 px-1.5 py-0.5 rounded">
                                UZB
                              </span>
                              <span className="font-bold">{t.uzbek}</span>
                            </div>
                          )}

                          {t.russian && (
                            <div className="flex items-start gap-2 text-slate-600">
                              <span className="font-black text-slate-500 shrink-0 text-[10px] uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">
                                RUS
                              </span>
                              <span className="font-semibold">{t.russian}</span>
                            </div>
                          )}

                          {t.english && (
                            <div className="flex items-start gap-2 text-slate-500">
                              <span className="font-black text-slate-500 shrink-0 text-[10px] uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">
                                ENG
                              </span>
                              <span className="font-medium">{t.english}</span>
                            </div>
                          )}
                        </div>

                        {/* Description if present */}
                        {t.description && (
                          <p className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium leading-relaxed italic">
                            {t.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="bg-white p-4 rounded-2xl border border-brand-border/60 shadow-xs mt-4">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    totalItems={filteredTerms.length}
                    pageSize={pageSize}
                    pageSizeOptions={[10, 20, 50]}
                    onPageSizeChange={(sz) => { setPageSize(sz); setCurrentPage(1); }}
                    scrollTargetId="topic-glossary-list"
                    prevLabel="Oldingisi"
                    nextLabel="Keyingisi"
                  />
                </div>
              )}
            </>
          )}
        </div>
    </div>
  );
}
