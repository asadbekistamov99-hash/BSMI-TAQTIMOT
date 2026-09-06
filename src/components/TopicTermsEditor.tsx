import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, BookA, Sparkles, AlertCircle } from 'lucide-react';
import { TopicTerm } from '../types';

interface TopicTermsEditorProps {
  terms: TopicTerm[];
  latinTerms: string[];
  onChange: (updatedTerms: TopicTerm[], updatedLatinTerms: string[]) => void;
}

export default function TopicTermsEditor({
  terms = [],
  latinTerms = [],
  onChange
}: TopicTermsEditorProps) {
  // Normalize initial terms: if `terms` is empty but `latinTerms` has items, seed them
  const [termList, setTermList] = useState<TopicTerm[]>(() => {
    if (terms && terms.length > 0) return terms;
    if (latinTerms && latinTerms.length > 0) {
      return latinTerms.map((raw, idx) => {
        const match = raw.match(/^(.+?)\s*\((.+?)\)$/);
        return {
          id: `term-${Date.now()}-${idx}`,
          latin: match ? match[1].trim() : raw.trim(),
          uzbek: match ? match[2].trim() : '',
          russian: '',
          english: '',
          description: ''
        };
      });
    }
    return [];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [formLatin, setFormLatin] = useState('');
  const [formUzbek, setFormUzbek] = useState('');
  const [formRussian, setFormRussian] = useState('');
  const [formEnglish, setFormEnglish] = useState('');
  const [formDescription, setFormDescription] = useState('');

  // Bulk paste modal
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkText, setBulkText] = useState('');

  const syncChanges = (newList: TopicTerm[]) => {
    setTermList(newList);
    // Also build clean latinTerms strings for backward compatibility
    const newLatinTerms = newList.map(t => {
      if (t.uzbek) {
        return `${t.latin} (${t.uzbek})`;
      }
      return t.latin;
    });
    onChange(newList, newLatinTerms);
  };

  const handleStartAdd = () => {
    setFormLatin('');
    setFormUzbek('');
    setFormRussian('');
    setFormEnglish('');
    setFormDescription('');
    setEditingId(null);
    setIsAdding(true);
  };

  const handleStartEdit = (item: TopicTerm) => {
    setFormLatin(item.latin);
    setFormUzbek(item.uzbek || '');
    setFormRussian(item.russian || '');
    setFormEnglish(item.english || '');
    setFormDescription(item.description || '');
    setEditingId(item.id);
    setIsAdding(false);
  };

  const handleCancelForm = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formLatin.trim()) {
      alert("Lotincha atama nomini kiritish majburiy!");
      return;
    }

    if (isAdding) {
      const newItem: TopicTerm = {
        id: `term-${Date.now()}`,
        latin: formLatin.trim(),
        uzbek: formUzbek.trim(),
        russian: formRussian.trim(),
        english: formEnglish.trim(),
        description: formDescription.trim()
      };
      const updated = [...termList, newItem];
      syncChanges(updated);
      setIsAdding(false);
    } else if (editingId) {
      const updated = termList.map(item => {
        if (item.id === editingId) {
          return {
            ...item,
            latin: formLatin.trim(),
            uzbek: formUzbek.trim(),
            russian: formRussian.trim(),
            english: formEnglish.trim(),
            description: formDescription.trim()
          };
        }
        return item;
      });
      syncChanges(updated);
      setEditingId(null);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Haqiqatdan ham ushbu atamani o'chirmoqchimisiz?")) {
      const updated = termList.filter(item => item.id !== id);
      syncChanges(updated);
    }
  };

  const handleBulkImport = () => {
    if (!bulkText.trim()) return;
    const lines = bulkText.split('\n').map(l => l.trim()).filter(Boolean);
    const imported: TopicTerm[] = lines.map((line, i) => {
      const match = line.match(/^(.+?)\s*[-–—:]\s*(.+)$/) || line.match(/^(.+?)\s*\((.+?)\)$/);
      if (match) {
        return {
          id: `term-${Date.now()}-${i}`,
          latin: match[1].trim(),
          uzbek: match[2].trim(),
          russian: '',
          english: '',
          description: ''
        };
      }
      return {
        id: `term-${Date.now()}-${i}`,
        latin: line,
        uzbek: '',
        russian: '',
        english: '',
        description: ''
      };
    });

    const combined = [...termList, ...imported];
    syncChanges(combined);
    setShowBulkModal(false);
    setBulkText('');
  };

  return (
    <div className="space-y-4 border border-brand-border rounded-3xl p-6 bg-brand-bg/40">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border">
        <div>
          <div className="flex items-center gap-2">
            <BookA className="w-5 h-5 text-indigo-600" />
            <h4 className="text-sm font-black text-brand-primary uppercase tracking-wider">
              Mavzu Lug'ati & Lotin Terminlari ({termList.length} ta)
            </h4>
          </div>
          <p className="text-xs text-brand-muted mt-1">
            Ushbu mavzu uchun maxsus atamalarni qo'shish, tahrirlash va o'chirish.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowBulkModal(true)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
            title="Bir nechta atamalarni matn ko'rinishida birdaniga qo'shish"
          >
            Ro'yxatdan kiritish
          </button>
          <button
            type="button"
            onClick={handleStartAdd}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi Atama</span>
          </button>
        </div>
      </div>

      {/* Bulk Paste Modal */}
      {showBulkModal && (
        <div className="p-5 bg-white rounded-2xl border-2 border-indigo-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800">
              Atamalarni matn ko'rinishida qo'shish
            </span>
            <button
              type="button"
              onClick={() => setShowBulkModal(false)}
              className="text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Har bir qatorda bitta atama yozing. Masalan: <br />
            <code>Musculus deltoideus - Deltasimon mushak</code> yoki <code>Arteria brachialis (Yelka arteriyasi)</code>
          </p>
          <textarea
            rows={5}
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs outline-none focus:border-indigo-500"
            placeholder="Lotincha - O'zbekcha..."
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowBulkModal(false)}
              className="px-4 py-2 text-xs font-bold text-slate-500"
            >
              Bekor qilish
            </button>
            <button
              type="button"
              onClick={handleBulkImport}
              className="px-5 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
            >
              Qo'shish
            </button>
          </div>
        </div>
      )}

      {/* Add / Edit Form */}
      {(isAdding || editingId) && (
        <form onSubmit={handleSaveForm} className="p-5 bg-white rounded-2xl border-2 border-indigo-500 space-y-4 shadow-md animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-black uppercase text-indigo-600 tracking-wider">
              {isAdding ? "Yangi Atama Qo'shish" : "Atamani Tahrirlash"}
            </span>
            <button
              type="button"
              onClick={handleCancelForm}
              className="text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">
                Lotincha Atama (Terminus) *
              </label>
              <input
                type="text"
                required
                value={formLatin}
                onChange={e => setFormLatin(e.target.value)}
                placeholder="Masalan: Musculus biceps brachii"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">
                O'zbekcha Tarjimasi
              </label>
              <input
                type="text"
                value={formUzbek}
                onChange={e => setFormUzbek(e.target.value)}
                placeholder="Masalan: Yelkaning ikki boshli mushagi"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">
                Ruscha Tarjimasi (ixtiyoriy)
              </label>
              <input
                type="text"
                value={formRussian}
                onChange={e => setFormRussian(e.target.value)}
                placeholder="Masalan: Двуглавая мышца плеча"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">
                Inglizcha Tarjimasi (ixtiyoriy)
              </label>
              <input
                type="text"
                value={formEnglish}
                onChange={e => setFormEnglish(e.target.value)}
                placeholder="Masalan: Biceps brachii muscle"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">
              Qisqacha Ta'rif yoki Joylashuvi (ixtiyoriy)
            </label>
            <input
              type="text"
              value={formDescription}
              onChange={e => setFormDescription(e.target.value)}
              placeholder="Masalan: Yelkaning oldingi yuzasida joylashgan, tirsak bo'g'imini bukuvchi mushak"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancelForm}
              className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>{isAdding ? "Saqlash va Qo'shish" : "O'zgarishni Saqlash"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Terms List Table / Grid */}
      {termList.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-slate-200 p-6">
          <BookA className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-500">
            Hozircha ushbu mavzuga terminlar kiritilmagan.
          </p>
          <button
            type="button"
            onClick={handleStartAdd}
            className="mt-3 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-black uppercase"
          >
            + Birinchi atamani qo'shish
          </button>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto bg-white rounded-2xl border border-slate-200">
          {termList.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">
                    #{idx + 1}
                  </span>
                  <span className="font-serif italic font-black text-slate-900 text-sm">
                    {item.latin}
                  </span>
                  {item.uzbek && (
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {item.uzbek}
                    </span>
                  )}
                </div>
                {(item.russian || item.english || item.description) && (
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1 truncate">
                    {item.russian && <span>🇷🇺 {item.russian}</span>}
                    {item.english && <span>🇬🇧 {item.english}</span>}
                    {item.description && <span className="italic text-slate-400">"{item.description}"</span>}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleStartEdit(item)}
                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                  title="Tahrirlash"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  title="O'chirish"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
