import React, { useState, useEffect, useMemo } from 'react';
import { 
  HelpCircle, 
  Search, 
  Plus, 
  Trash2, 
  Save, 
  Copy, 
  Check, 
  RotateCcw, 
  Upload, 
  ArrowUp, 
  ArrowDown, 
  BookOpen, 
  Layers, 
  Award, 
  Sparkles, 
  AlertCircle, 
  FileText,
  X
} from 'lucide-react';
import { ALL_39_TOPICS, CurriculumTopic } from '../data/allSemesterTopics';
import { 
  TheoryQuestion, 
  getTheoryQuestionsForTopic, 
  generate30ControlQuestionsForTopic 
} from '../data/topicTheoryQuestionsData';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { dbService } from '../lib/dbService';

interface AdminControlQuestionsManagerProps {
  searchQuery?: string;
  authUser?: any;
  requestConfirm?: (title: string, message: string, onConfirm: () => void | Promise<void>, confirmText?: string, cancelText?: string) => void;
}

export default function AdminControlQuestionsManager({
  searchQuery: externalSearch = '',
  authUser,
  requestConfirm
}: AdminControlQuestionsManagerProps) {
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [selectedTopicOrder, setSelectedTopicOrder] = useState<number>(1);
  const [questions, setQuestions] = useState<TheoryQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [copiedAll, setCopiedAll] = useState(false);

  // Available topics for the selected semester
  const semesterTopics = useMemo(() => {
    return ALL_39_TOPICS.filter(t => t.semester === selectedSemester);
  }, [selectedSemester]);

  // Current active topic
  const currentTopic = useMemo(() => {
    return semesterTopics.find(t => t.order === selectedTopicOrder) || semesterTopics[0] || ALL_39_TOPICS[0];
  }, [semesterTopics, selectedTopicOrder]);

  // Load questions for the selected topic
  useEffect(() => {
    let isMounted = true;
    const loadTopicQuestions = async () => {
      if (!currentTopic) return;
      setLoading(true);
      setSaveSuccess(false);
      setSaveError(null);

      const targetId = currentTopic.id || `sem_${currentTopic.semester}_top_${currentTopic.order}`;

      try {
        // 1. Try reading from Firestore
        let remoteQuestions: any[] | null = null;
        try {
          const snap = await getDoc(doc(db, 'topics', targetId));
          if (snap.exists() && snap.data().controlQuestions) {
            remoteQuestions = snap.data().controlQuestions;
          }
        } catch (e) {
          console.warn("Firestore fetch error, falling back to local:", e);
        }

        // 2. Try reading from dbService/localStorage if Firestore had none
        if (!remoteQuestions) {
          try {
            const localTopic = await dbService.getTopicDetail(targetId);
            if (localTopic && (localTopic as any).controlQuestions) {
              remoteQuestions = (localTopic as any).controlQuestions;
            }
          } catch (e) {
            console.warn("Local storage lookup warning:", e);
          }
        }

        if (!isMounted) return;

        if (Array.isArray(remoteQuestions) && remoteQuestions.length > 0) {
          // Normalize loaded questions
          const norm = getTheoryQuestionsForTopic({
            id: targetId,
            semester: currentTopic.semester,
            order: currentTopic.order,
            title: currentTopic.title,
            controlQuestions: remoteQuestions
          });
          setQuestions(norm);
        } else {
          // Fall back to guaranteed 30+ questions
          const defaultQ = getTheoryQuestionsForTopic({
            id: targetId,
            semester: currentTopic.semester,
            order: currentTopic.order,
            title: currentTopic.title
          });
          setQuestions(defaultQ);
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.error("Error loading questions:", err);
        // Fallback generator
        const gen = generate30ControlQuestionsForTopic(
          currentTopic.title?.uz || '',
          '',
          currentTopic.semester,
          currentTopic.order
        );
        setQuestions(gen);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadTopicQuestions();

    return () => {
      isMounted = false;
    };
  }, [currentTopic?.id, currentTopic?.semester, currentTopic?.order]);

  // Filter questions based on local search
  const filteredQuestions = useMemo(() => {
    const q = searchFilter.trim().toLowerCase();
    if (!q) return questions;
    return questions.filter((item, idx) => {
      return (
        item.question.toLowerCase().includes(q) ||
        (item.answer && item.answer.toLowerCase().includes(q)) ||
        String(idx + 1) === q
      );
    });
  }, [questions, searchFilter]);

  // Update a specific question field
  const handleUpdateQuestion = (index: number, newQuestionText: string) => {
    setQuestions(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], question: newQuestionText };
      return copy;
    });
  };

  // Update question difficulty
  const handleUpdateDifficulty = (index: number, diff: 'basic' | 'medium' | 'advanced' | 'exam') => {
    setQuestions(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], difficulty: diff };
      return copy;
    });
  };

  // Add a new question to the list
  const handleAddQuestion = () => {
    const newIdx = questions.length + 1;
    const newQ: TheoryQuestion = {
      id: `custom_${currentTopic.semester}_${currentTopic.order}_${Date.now()}_${newIdx}`,
      question: `Yangi nazorat savoli #${newIdx}: ${currentTopic.title?.uz || ''} bo'yicha...`,
      answer: `${currentTopic.title?.uz || ''} bo'yicha nazorat savolining to'liq tahlili.`,
      difficulty: 'exam',
      keyPoints: [
        "Mavzuning muhim tayanch tushunchalari",
        "Lotincha Terminologia Anatomica qoidalari"
      ]
    };
    setQuestions(prev => [...prev, newQ]);
  };

  // Delete a question
  const handleDeleteQuestion = (index: number) => {
    const doDelete = () => {
      setQuestions(prev => prev.filter((_, i) => i !== index));
    };

    if (requestConfirm) {
      requestConfirm(
        "Savolni o'chirish",
        `Rostdan ham #${index + 1}-raqamli savolni o'chirmoqchimisiz?`,
        doDelete
      );
    } else {
      if (window.confirm(`#${index + 1}-raqamli savolni o'chirmoqchimisiz?`)) {
        doDelete();
      }
    }
  };

  // Move a question up or down
  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    setQuestions(prev => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  // Reset to default 30 questions
  const handleResetToDefault = () => {
    const doReset = () => {
      const fresh = generate30ControlQuestionsForTopic(
        currentTopic.title?.uz || '',
        '',
        currentTopic.semester,
        currentTopic.order
      );
      setQuestions(fresh);
      setSaveSuccess(false);
    };

    if (requestConfirm) {
      requestConfirm(
        "Standart 30 ta savolga qaytarish",
        "Ushbu mavzuning barcha kiritilgan savollari standart 30 ta tizimli anatomik savol bilan almashtiriladi. Davom etasizmi?",
        doReset,
        "Ha, standartga qaytarish"
      );
    } else {
      if (window.confirm("Barcha savollarni standart 30 ta anatomik savol bilan almashtirasizmi?")) {
        doReset();
      }
    }
  };

  // Bulk import questions from plain text (1 question per line)
  const handleApplyBulkImport = () => {
    const lines = bulkText
      .split('\n')
      .map(l => l.replace(/^\d+[\.\)\-–]\s*/, '').trim())
      .filter(l => l.length > 5);

    if (lines.length === 0) {
      alert("Iltimos, kamida bir nechta savol matnini kiriting.");
      return;
    }

    const imported: TheoryQuestion[] = lines.map((line, idx) => ({
      id: `imported_${currentTopic.semester}_${currentTopic.order}_${idx + 1}_${Date.now()}`,
      question: line,
      answer: `${currentTopic.title?.uz || ''} bo'yicha nazorat savoli.`,
      difficulty: idx % 4 === 0 ? 'exam' : idx % 3 === 0 ? 'advanced' : idx % 2 === 0 ? 'medium' : 'basic',
      keyPoints: [
        "Mavzuning asosiy anatomik orientirlari",
        "Xalqaro lotin terminologiyasi"
      ]
    }));

    setQuestions(imported);
    setShowBulkImportModal(false);
    setBulkText('');
  };

  // Copy all questions to clipboard
  const handleCopyAll = () => {
    const formatted = questions.map((q, idx) => `${idx + 1}. ${q.question}`).join('\n\n');
    navigator.clipboard.writeText(formatted);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Save changes to Firestore & local storage
  const handleSaveQuestions = async () => {
    if (!currentTopic) return;
    if (questions.length === 0) {
      setSaveError("Mavzuda kamida bitta nazorat savoli bo'lishi kerak.");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const targetId = currentTopic.id || `sem_${currentTopic.semester}_top_${currentTopic.order}`;

    try {
      // Clean payload
      const cleaned = questions.map((q, idx) => ({
        id: q.id || `q_${currentTopic.semester}_${currentTopic.order}_${idx + 1}`,
        question: q.question.trim(),
        answer: q.answer || `${currentTopic.title?.uz || ''} bo'yicha tahlil.`,
        difficulty: q.difficulty || 'exam',
        keyPoints: q.keyPoints || [],
        latinTerms: q.latinTerms || []
      }));

      // 1. Save directly to Firestore under field 'controlQuestions'
      await setDoc(doc(db, 'topics', targetId), {
        controlQuestions: cleaned,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // 2. Sync to local dbService / storage
      try {
        await dbService.saveTopic(targetId, {
          controlQuestions: cleaned
        });
      } catch (locErr) {
        console.warn("dbService save warning:", locErr);
      }

      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      console.error("Error saving control questions:", err);
      setIsSaving(false);
      setSaveError(err.message || "Savollarni saqlashda xatolik yuz berdi.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white p-8 sm:p-10 rounded-[40px] border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-3xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20 shrink-0">
            <HelpCircle className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-0.5 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full">
                Nazorat Savollari Boshqaruvi
              </span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                39 ta Mavzu • Kamida 30 ta Savol
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Mavzular Nazorat Savollari (30+ ta) Tahrirlash
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium max-w-xl">
              Har bir mavzu uchun talabalarni sinovdan o'tkazish, kollokvium va oraliq nazoratga tayyorlovchi aniq savollar ro'yxatini tahrirlang yoki yangilang.
            </p>
          </div>
        </div>

        {/* Action button to save */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveQuestions}
            disabled={isSaving}
            className="px-6 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-600/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saqlanmoqda...</span>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Muvaffaqiyatli saqlandi!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>O'zgarishlarni Saqlash</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Save Success / Error Messages */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Ushbu mavzuning barcha {questions.length} ta nazorat savoli muvaffaqiyatli saqlandi va talabalarga ko'rinadi!</span>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>Xatolik: {saveError}</span>
        </div>
      )}

      {/* Main Grid: Left Topic Navigation, Right Question Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Semester & Topic List */}
        <div className="lg:col-span-4 space-y-4">
          {/* Semester Selector */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 flex gap-2">
            {[1, 2, 3].map(sem => (
              <button
                key={sem}
                type="button"
                onClick={() => {
                  setSelectedSemester(sem);
                  setSelectedTopicOrder(1);
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  selectedSemester === sem
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {sem}-Semestr
              </button>
            ))}
          </div>

          {/* Topics List Card */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                {selectedSemester}-Semestr Mavzulari ({semesterTopics.length} ta)
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-[620px] overflow-y-auto">
              {semesterTopics.map(t => {
                const isSelected = t.order === selectedTopicOrder;
                return (
                  <button
                    key={t.order}
                    type="button"
                    onClick={() => setSelectedTopicOrder(t.order)}
                    className={`w-full p-4 text-left transition-all flex items-start gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50/60 border-l-4 border-rose-500'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                      isSelected ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {t.order}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-xs font-bold leading-snug line-clamp-2 ${
                        isSelected ? 'text-rose-950 font-black' : 'text-slate-800'
                      }`}>
                        {t.title?.uz || `Mavzu #${t.order}`}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                        {t.section}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Questions List Editor */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header of Active Topic */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black uppercase tracking-wider">
                  Semestr {currentTopic.semester} • #{currentTopic.order}-Mavzu
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black">
                  {questions.length} ta Savol
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900">
                {currentTopic.title?.uz || `Mavzu #${currentTopic.order}`}
              </h3>
            </div>

            {/* Quick Action Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                title="Yangi savol qo'shish"
              >
                <Plus size={14} />
                <span>Savol qo'shish</span>
              </button>

              <button
                type="button"
                onClick={() => setShowBulkImportModal(true)}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Matndan ommaviy import qilish"
              >
                <Upload size={14} />
                <span>Import</span>
              </button>

              <button
                type="button"
                onClick={handleCopyAll}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Barcha savollarni nusxalash"
              >
                {copiedAll ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                <span>{copiedAll ? "Nusxalandi" : "Nusxalash"}</span>
              </button>

              <button
                type="button"
                onClick={handleResetToDefault}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Standart 30 ta savolga qaytarish"
              >
                <RotateCcw size={14} />
                <span>Standart (30)</span>
              </button>
            </div>
          </div>

          {/* Search bar inside questions */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Ushbu mavzuning nazorat savollaridan qidirish..."
              className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 border border-slate-200 focus:outline-none focus:border-rose-500 transition-colors shadow-xs"
            />
          </div>

          {/* Questions List */}
          {loading ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <div className="w-8 h-8 border-3 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-bold text-slate-400">Nazorat savollari yuklanmoqda...</p>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-xs font-bold text-slate-500">Hech qanday savol topilmadi.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredQuestions.map((q, idx) => {
                const originalIndex = questions.findIndex(item => item.id === q.id);
                const displayIndex = originalIndex >= 0 ? originalIndex : idx;

                return (
                  <div
                    key={q.id || idx}
                    className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex items-start gap-3.5 group"
                  >
                    {/* Number Badge */}
                    <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center shrink-0 mt-1">
                      {displayIndex + 1}
                    </span>

                    {/* Question Content & Input */}
                    <div className="flex-1 space-y-2 min-w-0">
                      <textarea
                        value={q.question}
                        rows={2}
                        onChange={(e) => handleUpdateQuestion(displayIndex, e.target.value)}
                        className="w-full p-2.5 bg-slate-50 hover:bg-white focus:bg-white text-xs font-bold text-slate-800 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500 transition-all resize-y"
                        placeholder="Nazorat savolini kiriting..."
                      />

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        {/* Difficulty Selector */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Daraja:</span>
                          <select
                            value={q.difficulty || 'exam'}
                            onChange={(e) => handleUpdateDifficulty(displayIndex, e.target.value as any)}
                            className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-black uppercase text-slate-700 cursor-pointer focus:outline-none"
                          >
                            <option value="exam">Imtihon</option>
                            <option value="advanced">Chuqur</option>
                            <option value="medium">O'rtacha</option>
                            <option value="basic">Asosiy</option>
                          </select>
                        </div>

                        {/* Order & Action Buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveQuestion(displayIndex, 'up')}
                            disabled={displayIndex === 0}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20 cursor-pointer"
                            title="Yuqoriga surish"
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveQuestion(displayIndex, 'down')}
                            disabled={displayIndex === questions.length - 1}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20 cursor-pointer"
                            title="Pastga surish"
                          >
                            <ArrowDown size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteQuestion(displayIndex)}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer ml-1"
                            title="O'chirish"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bulk Import Modal */}
      {showBulkImportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Upload size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Matndan Ommaviy Import</h4>
                  <p className="text-[11px] text-slate-400">Har bir qatorda bittadan nazorat savoli yozing</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowBulkImportModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              rows={12}
              placeholder={`1. ${currentTopic.title?.uz || ''}ning anatomik ta'rifi va topografiyasi.\n2. Yuzalari, qirralari va relyefi.\n3. Qon bilan ta'minlanishi va innervatsiyasi.\n...`}
              className="w-full p-4 bg-slate-50 text-xs font-semibold text-slate-800 rounded-2xl border border-slate-200 focus:outline-none focus:border-rose-500 font-mono resize-none leading-relaxed"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBulkImportModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleApplyBulkImport}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider cursor-pointer shadow-md shadow-rose-600/20"
              >
                Savollarni Yuklash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
