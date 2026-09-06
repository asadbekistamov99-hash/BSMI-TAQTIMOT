import React, { useState, useEffect, useMemo } from 'react';
import { 
  collection, 
  getDocs, 
  deleteDoc, 
  doc, 
  addDoc, 
  setDoc, 
  writeBatch, 
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { dbService } from '../lib/dbService';
import { 
  Globe, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw, 
  Database, 
  Volume2, 
  Check, 
  X, 
  Download, 
  Layers, 
  BookOpen, 
  AlertCircle,
  Filter,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ALL_TOPIC_GLOSSARY_TERMS, TOPIC_GLOSSARY_METADATA } from '../data/topicGlossaryData';
import { LatinTerm } from '../types';

interface LatinTermsManagerProps {
  searchQuery: string;
  authUser: any;
  requestConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export default function LatinTermsManager({ searchQuery: globalSearch, authUser, requestConfirm }: LatinTermsManagerProps) {
  const [cloudTerms, setCloudTerms] = useState<LatinTerm[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);
  const [seedProgress, setSeedProgress] = useState<string>('');
  
  // Filters
  const [localSearch, setLocalSearch] = useState<string>('');
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');
  const [selectedTopicOrder, setSelectedTopicOrder] = useState<number | 'all'>('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 25;

  // Editor Modal
  const [editingTerm, setEditingTerm] = useState<Partial<LatinTerm> | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Audio preview
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Load terms from Firestore on mount
  useEffect(() => {
    fetchTerms();
  }, []);

  // Clear notification after 4s
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const fetchTerms = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(query(collection(db, 'latin_terms'), orderBy('latin', 'asc')));
      const fetched = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      })) as LatinTerm[];
      setCloudTerms(fetched);
    } catch (error) {
      console.error("Lotincha terminlarni yuklashda xatolik:", error);
      handleFirestoreError(error, OperationType.LIST, 'latin_terms');
    } finally {
      setLoading(false);
    }
  };

  // Combine static curated topic terms with cloud terms (cloud overrides static)
  const allMergedTerms: LatinTerm[] = useMemo(() => {
    const termMap = new Map<string, LatinTerm>();

    // 1. First add all baseline topic glossary terms
    ALL_TOPIC_GLOSSARY_TERMS.forEach(item => {
      termMap.set(item.id, {
        id: item.id,
        latin: item.latin,
        uzbek: item.uzbek,
        russian: item.russian || '',
        english: item.english || '',
        semester: item.semester,
        topicOrder: item.topicOrder,
        description: item.description || ''
      });
    });

    // 2. Overlay cloud terms from Firestore (by id or normalized latin)
    cloudTerms.forEach(ct => {
      if (ct.isDeleted) {
        termMap.delete(ct.id);
        // Also remove if matching by latin
        const latKey = ct.latin.trim().toLowerCase();
        for (const [key, val] of termMap.entries()) {
          if (val.latin.trim().toLowerCase() === latKey) {
            termMap.delete(key);
          }
        }
        return;
      }

      // Check if matches existing curated term by ID
      if (termMap.has(ct.id)) {
        termMap.set(ct.id, { ...termMap.get(ct.id), ...ct });
        return;
      }

      // Check if matches existing by latin text
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
        // Completely new term added by admin
        termMap.set(ct.id, ct);
      }
    });

    return Array.from(termMap.values()).sort((a, b) => a.latin.localeCompare(b.latin));
  }, [cloudTerms]);

  // Topic options based on selected semester
  const availableTopicsForSemester = useMemo(() => {
    if (selectedSemester === 'all') return [];
    return Object.entries(TOPIC_GLOSSARY_METADATA)
      .filter(([_, meta]) => meta.semester === selectedSemester)
      .sort((a, b) => a[1].order - b[1].order);
  }, [selectedSemester]);

  // Filter terms by search, semester, topic
  const filteredTerms = useMemo(() => {
    const q = (globalSearch || localSearch).trim().toLowerCase();

    return allMergedTerms.filter(term => {
      // Semester filter
      if (selectedSemester !== 'all') {
        if (term.semester !== selectedSemester) return false;
      }

      // Topic filter
      if (selectedTopicOrder !== 'all') {
        if (term.topicOrder !== selectedTopicOrder) return false;
      }

      // Search query
      if (q) {
        const matchLatin = term.latin.toLowerCase().includes(q);
        const matchUzbek = term.uzbek.toLowerCase().includes(q);
        const matchRussian = term.russian?.toLowerCase().includes(q) || false;
        const matchEnglish = term.english?.toLowerCase().includes(q) || false;
        const matchDesc = term.description?.toLowerCase().includes(q) || false;
        return matchLatin || matchUzbek || matchRussian || matchEnglish || matchDesc;
      }

      return true;
    });
  }, [allMergedTerms, globalSearch, localSearch, selectedSemester, selectedTopicOrder]);

  // Stats calculation
  const stats = useMemo(() => {
    const sem1 = allMergedTerms.filter(t => t.semester === 1).length;
    const sem2 = allMergedTerms.filter(t => t.semester === 2).length;
    const sem3 = allMergedTerms.filter(t => t.semester === 3).length;
    return {
      total: allMergedTerms.length,
      sem1,
      sem2,
      sem3
    };
  }, [allMergedTerms]);

  // Paginated terms
  const totalPages = Math.ceil(filteredTerms.length / pageSize) || 1;
  const paginatedTerms = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTerms.slice(start, start + pageSize);
  }, [filteredTerms, currentPage]);

  // Reset page on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [localSearch, globalSearch, selectedSemester, selectedTopicOrder]);

  // Handle Save (Add new or Update existing)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTerm) return;

    const latin = editingTerm.latin?.trim();
    const uzbek = editingTerm.uzbek?.trim();

    if (!latin || !uzbek) {
      alert("Lotincha va O'zbekcha nomlarni kiritish majburiy!");
      return;
    }

    setIsSaving(true);
    try {
      const termData: any = {
        latin,
        uzbek,
        russian: editingTerm.russian?.trim() || '',
        english: editingTerm.english?.trim() || '',
        semester: editingTerm.semester ? Number(editingTerm.semester) : null,
        topicOrder: editingTerm.topicOrder ? Number(editingTerm.topicOrder) : null,
        description: editingTerm.description?.trim() || '',
        pronunciation: editingTerm.pronunciation?.trim() || '',
        isDeleted: false,
        updatedAt: new Date().toISOString()
      };

      if (editingTerm.id) {
        // Update existing document (or curate override)
        await setDoc(doc(db, 'latin_terms', editingTerm.id), termData, { merge: true });
        // Update in dbService if enabled
        try {
          await dbService.updateLatinTerm(editingTerm.id, termData);
        } catch (e) {
          console.warn("dbService update notice:", e);
        }
        setNotification({ type: 'success', message: `"${latin}" termini muvaffaqiyatli yangilandi!` });
      } else {
        // Create new document
        termData.createdAt = new Date().toISOString();
        const docRef = await addDoc(collection(db, 'latin_terms'), termData);
        try {
          await dbService.saveLatinTerm({ id: docRef.id, ...termData });
        } catch (e) {
          console.warn("dbService save notice:", e);
        }
        setNotification({ type: 'success', message: `"${latin}" yangi termin sifatida qo'shildi!` });
      }

      setEditingTerm(null);
      await fetchTerms();
    } catch (error) {
      console.error("Terminni saqlashda xatolik:", error);
      handleFirestoreError(error, OperationType.WRITE, 'latin_terms');
      setNotification({ type: 'error', message: "Saqlashda xatolik yuz berdi: " + (error instanceof Error ? error.message : String(error)) });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete (Yo'qotish / O'chirish)
  const handleDelete = (term: LatinTerm) => {
    requestConfirm(
      "Terminni o'chirish",
      `Haqiqatan ham "${term.latin}" (${term.uzbek}) terminini bazadan o'chirmoqchimisiz? Ushbu amal terminni talabalar lug'atidan ham olib tashlaydi.`,
      async () => {
        try {
          // If term already exists in Firestore as a doc:
          const termDocRef = doc(db, 'latin_terms', term.id);
          
          // Mark as deleted in Firestore so curated list ignores it, or delete doc
          await setDoc(termDocRef, {
            latin: term.latin,
            uzbek: term.uzbek,
            isDeleted: true,
            deletedAt: new Date().toISOString()
          }, { merge: true });

          try {
            await dbService.deleteLatinTerm(term.id);
          } catch (e) {
            console.warn("dbService delete notice:", e);
          }

          setNotification({ type: 'success', message: `"${term.latin}" termini muvaffaqiyatli o'chirildi!` });
          await fetchTerms();
        } catch (error) {
          console.error("Terminni o'chirishda xatolik:", error);
          handleFirestoreError(error, OperationType.DELETE, 'latin_terms');
          setNotification({ type: 'error', message: "O'chirishda xatolik yuz berdi: " + (error instanceof Error ? error.message : String(error)) });
        }
      }
    );
  };

  // Sync / Import all 39 topic terms into Firestore in batches
  const handleMassImportCurriculum = async () => {
    if (!auth.currentUser) {
      alert("Xatolik: Tizimga kiring!");
      return;
    }

    requestConfirm(
      "Barcha mavzular terminlarini bazaga o'tkazish",
      "Dasturdagi 3 ta semestr va 39 ta anatomik mavzuning barcha 500+ ta terminlari Firestore ma'lumotlar bazasiga to'liq import qilinadi. Shundan so'ng har bir terminni erkin tahrirlashingiz yoki o'chirishingiz mumkin. Davom etasizmi?",
      async () => {
        setIsSeeding(true);
        setSeedProgress("Tayyorlanmoqda...");
        try {
          const termsToImport = ALL_TOPIC_GLOSSARY_TERMS;
          const chunkSize = 350; // Firestore batch limit is 500
          let imported = 0;

          for (let i = 0; i < termsToImport.length; i += chunkSize) {
            const chunk = termsToImport.slice(i, i + chunkSize);
            const batch = writeBatch(db);

            chunk.forEach(t => {
              const docRef = doc(db, 'latin_terms', t.id);
              batch.set(docRef, {
                latin: t.latin,
                uzbek: t.uzbek,
                russian: t.russian || '',
                english: t.english || '',
                semester: t.semester,
                topicOrder: t.topicOrder,
                description: t.description || '',
                isDeleted: false,
                importedAt: new Date().toISOString()
              }, { merge: true });
            });

            await batch.commit();
            imported += chunk.length;
            setSeedProgress(`${imported} / ${termsToImport.length} ta termin saqlandi...`);
          }

          setNotification({ type: 'success', message: `Jami ${termsToImport.length} ta termin Firestore bazasiga muvaffaqiyatli import qilindi!` });
          await fetchTerms();
        } catch (e: any) {
          console.error("Import xatosi:", e);
          setNotification({ type: 'error', message: "Importda xatolik: " + (e.message || e) });
        } finally {
          setIsSeeding(false);
          setSeedProgress('');
        }
      }
    );
  };

  // Speak Latin pronunciation
  const speakLatin = (text: string, id: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'la';
    utterance.rate = 0.85;
    setPlayingId(id);
    utterance.onend = () => setPlayingId(null);
    utterance.onerror = () => setPlayingId(null);
    window.speechSynthesis.speak(utterance);
  };

  // Export JSON file
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allMergedTerms, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `anatomiya_lotincha_lugat_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-5 rounded-2xl flex items-center justify-between gap-4 font-bold text-sm shadow-xl ${
              notification.type === 'success' 
                ? 'bg-emerald-600 text-white shadow-emerald-600/20' 
                : 'bg-red-600 text-white shadow-red-600/20'
            }`}
          >
            <div className="flex items-center gap-3">
              {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
              <span>{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)} className="p-1 hover:bg-white/20 rounded-lg">
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Card */}
      <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-accent/15 text-brand-accent flex items-center justify-center">
              <Globe size={22} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                Lotincha Lug'at va Terminlar Boshqaruvi
              </h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                Terminlarni qo'shish, o'zgartirish, o'chirish va mavzular bo'yicha boshqarish
              </p>
            </div>
          </div>

          {/* Quick Statistics */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-black">
              Jami: {stats.total} ta
            </span>
            <span className="px-3.5 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl text-xs font-bold">
              1-Semestr: {stats.sem1} ta
            </span>
            <span className="px-3.5 py-1.5 bg-purple-50 text-purple-700 border border-purple-100 rounded-xl text-xs font-bold">
              2-Semestr: {stats.sem2} ta
            </span>
            <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-bold">
              3-Semestr: {stats.sem3} ta
            </span>
            {cloudTerms.length > 0 && (
              <span className="px-3.5 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-xs font-bold">
                Firestore bazasida: {cloudTerms.length} ta yozuv
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Mass import / Sync curriculum terms */}
          <button
            onClick={handleMassImportCurriculum}
            disabled={isSeeding}
            title="39 ta mavzuning barcha 500+ ta terminini Firestore bazasiga import qilish"
            className="px-5 py-3.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-emerald-100 transition-all disabled:opacity-60"
          >
            {isSeeding ? <RefreshCw className="animate-spin w-4 h-4" /> : <Database size={16} />}
            <span>{isSeeding ? (seedProgress || "Import qilinmoqda...") : "Mavzularni Bazaga O'tkazish"}</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExportJSON}
            title="Barcha terminlarni JSON fayl sifatida yuklab olish"
            className="p-3.5 bg-slate-100 text-slate-700 rounded-2xl hover:bg-slate-200 transition-all"
          >
            <Download size={18} />
          </button>

          {/* Add New Term */}
          <button
            onClick={() => setEditingTerm({
              latin: '',
              uzbek: '',
              russian: '',
              english: '',
              semester: typeof selectedSemester === 'number' ? selectedSemester : 1,
              topicOrder: typeof selectedTopicOrder === 'number' ? selectedTopicOrder : 1,
              description: ''
            })}
            className="px-6 py-3.5 bg-brand-accent text-[#0E1624] rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-brand-accent/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            <span>Yangi Termin Qo'shish</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm space-y-5">
        {/* Semester Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => { setSelectedSemester('all'); setSelectedTopicOrder('all'); }}
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
              selectedSemester === 'all'
                ? 'bg-slate-800 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Barcha Semestrlar
          </button>
          <button
            onClick={() => { setSelectedSemester(1); setSelectedTopicOrder('all'); }}
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
              selectedSemester === 1
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
            }`}
          >
            1-Semestr (Skelet & Mushaklar)
          </button>
          <button
            onClick={() => { setSelectedSemester(2); setSelectedTopicOrder('all'); }}
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
              selectedSemester === 2
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            2-Semestr (Ichki a'zolar & Qon)
          </button>
          <button
            onClick={() => { setSelectedSemester(3); setSelectedTopicOrder('all'); }}
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all ${
              selectedSemester === 3
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            3-Semestr (Asab tizimi)
          </button>
        </div>

        {/* Topic dropdown when a semester is selected */}
        {selectedSemester !== 'all' && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-1 border-t border-slate-100">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">
              Mavzu bo'yicha filter:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedTopicOrder('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedTopicOrder === 'all'
                    ? 'bg-slate-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Barcha 13 ta mavzu
              </button>
              {availableTopicsForSemester.map(([key, meta]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTopicOrder(meta.order)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all truncate max-w-[200px] sm:max-w-[260px] ${
                    selectedTopicOrder === meta.order
                      ? 'bg-brand-accent text-slate-900 ring-2 ring-brand-accent/50'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                  title={meta.title.uz}
                >
                  {meta.order}-mavzu: {meta.title.uz.split(':')[1]?.trim() || meta.title.uz}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Lotincha, o'zbekcha, ruscha yoki inglizcha so'z bo'yicha qidirish..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-brand-accent focus:bg-white outline-none transition-all"
          />
          {localSearch && (
            <button
              onClick={() => setLocalSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Main Terms Table Card */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-black text-slate-700 text-sm uppercase tracking-wider">
              Terminlar Ro'yxati
            </span>
            <span className="px-2.5 py-0.5 bg-slate-200 text-slate-700 rounded-full text-xs font-black">
              {filteredTerms.length} ta natija
            </span>
          </div>

          {/* Quick Pagination Counter */}
          <div className="text-xs font-bold text-slate-400">
            Sahifa {currentPage} / {totalPages}
          </div>
        </div>

        {loading ? (
          <div className="p-16 text-center space-y-4">
            <RefreshCw className="animate-spin w-8 h-8 text-brand-accent mx-auto" />
            <p className="text-slate-500 font-bold text-sm">Terminlar yuklanmoqda...</p>
          </div>
        ) : filteredTerms.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-slate-600 font-black text-base">Hech qanday termin topilmadi</p>
            <p className="text-slate-400 text-xs font-medium max-w-sm mx-auto">
              Qidiruv so'zini o'zgartirib ko'ring yoki yuqoridagi "Yangi Termin Qo'shish" tugmasi orqali yangi termin qo'shing.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 w-12 text-center">#</th>
                  <th className="px-6 py-4">Lotincha Termini</th>
                  <th className="px-6 py-4">O'zbekcha Tarjima</th>
                  <th className="px-6 py-4">Ruscha / Inglizcha</th>
                  <th className="px-6 py-4">Semestr & Mavzu</th>
                  <th className="px-6 py-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedTerms.map((term, index) => {
                  const globalIdx = (currentPage - 1) * pageSize + index + 1;
                  return (
                    <tr key={term.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="px-6 py-4 text-center font-mono text-xs text-slate-400">
                        {globalIdx}
                      </td>

                      {/* Latin */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2.5">
                          <span className="font-black text-slate-900 text-base italic tracking-tight font-serif">
                            {term.latin}
                          </span>
                          <button
                            onClick={() => speakLatin(term.latin, term.id)}
                            title="Lotincha talaffuzni eshitish"
                            className={`p-1.5 rounded-lg border transition-all ${
                              playingId === term.id
                                ? 'bg-brand-accent text-slate-900 border-brand-accent'
                                : 'bg-slate-50 text-slate-400 hover:text-brand-accent border-slate-200'
                            }`}
                          >
                            <Volume2 size={14} className={playingId === term.id ? 'animate-bounce' : ''} />
                          </button>
                        </div>
                        {term.description && (
                          <p className="text-xs text-slate-400 font-medium line-clamp-1 mt-0.5">
                            {term.description}
                          </p>
                        )}
                      </td>

                      {/* Uzbek */}
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-800 text-sm">
                          {term.uzbek}
                        </span>
                      </td>

                      {/* Russian / English */}
                      <td className="px-6 py-4 space-y-1 text-xs">
                        {term.russian && (
                          <div className="text-slate-500 font-medium">
                            <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">RU:</span>
                            {term.russian}
                          </div>
                        )}
                        {term.english && (
                          <div className="text-slate-500 font-medium">
                            <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">EN:</span>
                            {term.english}
                          </div>
                        )}
                        {!term.russian && !term.english && (
                          <span className="text-slate-300 italic text-xs">—</span>
                        )}
                      </td>

                      {/* Semester & Topic */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          {term.semester ? (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-black w-fit ${
                              term.semester === 1 ? 'bg-blue-50 text-blue-700' :
                              term.semester === 2 ? 'bg-purple-50 text-purple-700' :
                              'bg-emerald-50 text-emerald-700'
                            }`}>
                              {term.semester}-semestr
                            </span>
                          ) : (
                            <span className="text-slate-400 text-xs font-bold">Umumiy</span>
                          )}

                          {term.topicOrder ? (
                            <span className="text-[11px] font-bold text-slate-500">
                              {term.topicOrder}-mavzu
                            </span>
                          ) : null}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit button */}
                          <button
                            onClick={() => setEditingTerm(term)}
                            title="Terminni o'zgartirish (tahrirlash)"
                            className="p-2.5 bg-slate-50 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-slate-200"
                          >
                            <Edit size={16} />
                          </button>

                          {/* Delete button */}
                          <button
                            onClick={() => handleDelete(term)}
                            title="Terminni bazadan butunlay o'chirish"
                            className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all border border-slate-200"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs font-bold text-slate-500">
              Jami {filteredTerms.length} ta termindan {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredTerms.length)} ko'rsatilmoqda
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-all flex items-center gap-1"
              >
                <ChevronLeft size={16} />
                Oldingi
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5 && currentPage > 3) {
                    pageNum = currentPage - 2 + i;
                    if (pageNum > totalPages) pageNum = totalPages - 4 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-9 h-9 rounded-xl text-xs font-black transition-all ${
                        currentPage === pageNum
                          ? 'bg-brand-primary text-white shadow-md'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-all flex items-center gap-1"
              >
                Keyingi
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Modal Dialog */}
      <AnimatePresence>
        {editingTerm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0E1624]/80 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 my-8"
            >
              {/* Modal Header */}
              <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand-accent/20 text-brand-accent flex items-center justify-center">
                    {editingTerm.id ? <Edit size={20} /> : <Plus size={20} />}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                      {editingTerm.id ? "Terminni Tahrirlash (O'zgartirish)" : "Yangi Termin Qo'shish"}
                    </h2>
                    <p className="text-slate-400 text-xs font-bold">
                      {editingTerm.id ? `ID: ${editingTerm.id}` : "Barcha maydonlarni to'ldiring"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setEditingTerm(null)}
                  className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Latin Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">
                      Lotincha Nomi *
                    </label>
                    <input
                      type="text"
                      value={editingTerm.latin || ''}
                      onChange={(e) => setEditingTerm({ ...editingTerm, latin: e.target.value })}
                      placeholder="Masalan: Columna vertebralis"
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-brand-accent focus:bg-white outline-none font-bold italic text-slate-900 transition-all"
                      required
                    />
                  </div>

                  {/* Uzbek Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">
                      O'zbekcha Tarjimasi *
                    </label>
                    <input
                      type="text"
                      value={editingTerm.uzbek || ''}
                      onChange={(e) => setEditingTerm({ ...editingTerm, uzbek: e.target.value })}
                      placeholder="Masalan: Umurtqa pog'onasi"
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-brand-accent focus:bg-white outline-none font-bold text-slate-900 transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Russian Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">
                      Ruscha Tarjimasi
                    </label>
                    <input
                      type="text"
                      value={editingTerm.russian || ''}
                      onChange={(e) => setEditingTerm({ ...editingTerm, russian: e.target.value })}
                      placeholder="Masalan: Позвоночный столб"
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-brand-accent focus:bg-white outline-none font-medium text-slate-800 transition-all"
                    />
                  </div>

                  {/* English Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">
                      Inglizcha Tarjimasi
                    </label>
                    <input
                      type="text"
                      value={editingTerm.english || ''}
                      onChange={(e) => setEditingTerm({ ...editingTerm, english: e.target.value })}
                      placeholder="Masalan: Vertebral column"
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-brand-accent focus:bg-white outline-none font-medium text-slate-800 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Semester Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">
                      Semestr
                    </label>
                    <select
                      value={editingTerm.semester || 1}
                      onChange={(e) => setEditingTerm({ ...editingTerm, semester: Number(e.target.value) })}
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-brand-accent focus:bg-white outline-none font-bold text-slate-800 transition-all"
                    >
                      <option value={1}>1-Semestr (Skelet & Mushaklar)</option>
                      <option value={2}>2-Semestr (Ichki a'zolar & Qon tomirlar)</option>
                      <option value={3}>3-Semestr (Asab tizimi & Sezgi a'zolari)</option>
                    </select>
                  </div>

                  {/* Topic Order (1 to 13) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider">
                      Mavzu (1 dan 13 gacha)
                    </label>
                    <select
                      value={editingTerm.topicOrder || 1}
                      onChange={(e) => setEditingTerm({ ...editingTerm, topicOrder: Number(e.target.value) })}
                      className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-brand-accent focus:bg-white outline-none font-bold text-slate-800 transition-all"
                    >
                      {Array.from({ length: 13 }, (_, i) => {
                        const order = i + 1;
                        const sem = editingTerm.semester || 1;
                        const metaKey = `sem${sem}_top${order}`;
                        const meta = TOPIC_GLOSSARY_METADATA[metaKey];
                        const titleText = meta ? (meta.title.uz.split(':')[1]?.trim() || meta.title.uz) : `${order}-mavzu`;
                        return (
                          <option key={order} value={order}>
                            {order}-mavzu: {titleText}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                {/* Description / Clinical Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider">
                    Qo'shimcha Tavsif / Anatomik Izoh
                  </label>
                  <textarea
                    rows={3}
                    value={editingTerm.description || ''}
                    onChange={(e) => setEditingTerm({ ...editingTerm, description: e.target.value })}
                    placeholder="Masalan: 33-34 ta umurtqadan tashkil topgan tayanch tuzilma..."
                    className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-200 focus:border-brand-accent focus:bg-white outline-none font-medium text-slate-800 transition-all text-sm"
                  />
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditingTerm(null)}
                    className="px-6 py-3.5 text-xs font-black uppercase tracking-wider text-slate-500 hover:text-slate-700 transition-all"
                  >
                    Bekor Qilish
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-8 py-3.5 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-brand-primary/20 hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-60"
                  >
                    {isSaving ? <RefreshCw className="animate-spin w-4 h-4" /> : <Check size={16} />}
                    <span>{isSaving ? "Saqlanmoqda..." : "Saqlash"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
