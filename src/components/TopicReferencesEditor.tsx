import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, BookOpen, ExternalLink, Sparkles, Bookmark } from 'lucide-react';
import { TopicReference } from '../types';

interface TopicReferencesEditorProps {
  references: TopicReference[];
  onChange: (updatedReferences: TopicReference[]) => void;
}

const DEFAULT_STANDARD_REFERENCES: TopicReference[] = [
  {
    id: 'ref-std-1',
    title: "Odam Anatomiyasi (I-II jildlar)",
    authors: "Ahmedov N.K.",
    year: "Toshkent: «Ibn Sino», 2021",
    type: "textbook",
    pages: "Mavzuga oid tegishli bob va bo'limlar",
    note: "Tibbiyot oliy o'quv yurtlari talabalari uchun asosiy rasmiy darslik."
  },
  {
    id: 'ref-std-2',
    title: "Атлас анатомии человека (в 4-х томах)",
    authors: "Синельников Р.Д., Синельников Я.Р.",
    year: "Москва: «Новая Волна», 2020",
    type: "atlas",
    pages: "Illyustratsiyalar va sxematik jadvallar",
    note: "Xalqaro anatomik nomenklatura (Terminologia Anatomica) asosidagi fundamental atlas."
  },
  {
    id: 'ref-std-3',
    title: "Gray's Anatomy for Students (4th Edition)",
    authors: "Richard L. Drake, A. Wayne Vogl, Adam W. M. Mitchell",
    year: "Elsevier, 2020",
    type: "textbook",
    pages: "Regional anatomy & clinical correlations",
    note: "Xalqaro standartdagi eng mashhur klinik va regional anatomiya darsligi."
  },
  {
    id: 'ref-std-4',
    title: "Sobotta Atlas of Human Anatomy",
    authors: "Friedrich Paulsen, Jens Waschke",
    year: "Urban & Fischer, 16th ed.",
    type: "atlas",
    pages: "Topografik va klinik illyustratsiyalar",
    note: "Klinik amaliyot va operatsion anatomiya bo'yicha etalon qo'llanma."
  }
];

export default function TopicReferencesEditor({
  references = [],
  onChange
}: TopicReferencesEditorProps) {
  const [refList, setRefList] = useState<TopicReference[]>(references || []);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formAuthors, setFormAuthors] = useState('');
  const [formYear, setFormYear] = useState('');
  const [formType, setFormType] = useState<'textbook' | 'atlas' | 'article' | 'manual' | 'online' | string>('textbook');
  const [formPages, setFormPages] = useState('');
  const [formLink, setFormLink] = useState('');
  const [formNote, setFormNote] = useState('');

  const syncChanges = (newList: TopicReference[]) => {
    setRefList(newList);
    onChange(newList);
  };

  const handleStartAdd = () => {
    setFormTitle('');
    setFormAuthors('');
    setFormYear('');
    setFormType('textbook');
    setFormPages('');
    setFormLink('');
    setFormNote('');
    setEditingId(null);
    setIsAdding(true);
  };

  const handleStartEdit = (item: TopicReference) => {
    setFormTitle(item.title);
    setFormAuthors(item.authors || '');
    setFormYear(item.year || '');
    setFormType(item.type || 'textbook');
    setFormPages(item.pages || '');
    setFormLink(item.link || '');
    setFormNote(item.note || '');
    setEditingId(item.id);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert("Adabiyot nomini kiritish majburiy!");
      return;
    }

    if (isAdding) {
      const newItem: TopicReference = {
        id: `ref-${Date.now()}`,
        title: formTitle.trim(),
        authors: formAuthors.trim() || undefined,
        year: formYear.trim() || undefined,
        type: formType,
        pages: formPages.trim() || undefined,
        link: formLink.trim() || undefined,
        note: formNote.trim() || undefined
      };
      const updated = [...refList, newItem];
      syncChanges(updated);
      setIsAdding(false);
    } else if (editingId) {
      const updated = refList.map(item => {
        if (item.id === editingId) {
          return {
            ...item,
            title: formTitle.trim(),
            authors: formAuthors.trim() || undefined,
            year: formYear.trim() || undefined,
            type: formType,
            pages: formPages.trim() || undefined,
            link: formLink.trim() || undefined,
            note: formNote.trim() || undefined
          };
        }
        return item;
      });
      syncChanges(updated);
      setEditingId(null);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Ushbu adabiyotni ro'yxatdan o'chirmoqchimisiz?")) {
      const updated = refList.filter(item => item.id !== id);
      syncChanges(updated);
    }
  };

  const handleLoadStandardDefaults = () => {
    if (refList.length > 0) {
      if (!window.confirm("Standart tibbiyot adabiyotlari to'plami (Ahmedov, Sinelnikov, Gray's Anatomy, Sobotta) ro'yxatga qo'shilsinmi?")) {
        return;
      }
    }
    const combined = [...refList, ...DEFAULT_STANDARD_REFERENCES.map((r, i) => ({ ...r, id: `ref-std-${Date.now()}-${i}` }))];
    syncChanges(combined);
  };

  return (
    <div className="space-y-4 border border-brand-border rounded-3xl p-6 bg-brand-bg/40">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h4 className="text-sm font-black text-brand-primary uppercase tracking-wider">
              Foydalanilgan Adabiyotlar ({refList.length} ta)
            </h4>
          </div>
          <p className="text-xs text-brand-muted mt-1">
            Ushbu mavzu uchun tavsiya etilgan darslik, atlas va adabiyotlarni boshqarish.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {refList.length === 0 && (
            <button
              type="button"
              onClick={handleLoadStandardDefaults}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border border-emerald-200"
              title="Kafedra standart adabiyotlari to'plamini biriktirish"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Standart To'plamni Yuklash</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleStartAdd}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi Adabiyot</span>
          </button>
        </div>
      </div>

      {/* Add / Edit Form */}
      {(isAdding || editingId) && (
        <form onSubmit={handleSaveForm} className="p-5 bg-white rounded-2xl border-2 border-indigo-500 space-y-4 shadow-md animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-black uppercase text-indigo-600 tracking-wider">
              {isAdding ? "Yangi Adabiyot Qo'shish" : "Adabiyotni Tahrirlash"}
            </span>
            <button
              type="button"
              onClick={handleCancel}
              className="text-slate-400 hover:text-slate-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">
              Adabiyot / Darslik Nomi *
            </label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={e => setFormTitle(e.target.value)}
              placeholder="Masalan: Odam Anatomiyasi (I-jild)"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">
                Muallif(lar)
              </label>
              <input
                type="text"
                value={formAuthors}
                onChange={e => setFormAuthors(e.target.value)}
                placeholder="Masalan: Ahmedov N.K."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">
                Nashriyot va Yil
              </label>
              <input
                type="text"
                value={formYear}
                onChange={e => setFormYear(e.target.value)}
                placeholder="Masalan: Toshkent: «Ibn Sino», 2021"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">
                Turi
              </label>
              <select
                value={formType}
                onChange={e => setFormType(e.target.value as any)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-indigo-500"
              >
                <option value="textbook">Asosiy Darslik</option>
                <option value="atlas">Anatomik Atlas</option>
                <option value="article">Ilmiy Maqola</option>
                <option value="manual">O'quv Qo'llanma</option>
                <option value="online">Elektron Resurs</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">
                Sahifalar (ixtiyoriy)
              </label>
              <input
                type="text"
                value={formPages}
                onChange={e => setFormPages(e.target.value)}
                placeholder="Masalan: 85-112 betlar"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">
                Havola / URL (ixtiyoriy)
              </label>
              <input
                type="url"
                value={formLink}
                onChange={e => setFormLink(e.target.value)}
                placeholder="https://..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">
              Qo'shimcha Izoh (ixtiyoriy)
            </label>
            <input
              type="text"
              value={formNote}
              onChange={e => setFormNote(e.target.value)}
              placeholder="Masalan: Talabalarga mavzuni o'rganish uchun tavsiya etiladi"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
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

      {/* References List */}
      {refList.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-2xl border border-dashed border-slate-200 p-6">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-bold text-slate-500">
            Hozircha ushbu mavzuga maxsus adabiyotlar kiritilmagan.
          </p>
          <div className="mt-3 flex justify-center gap-2">
            <button
              type="button"
              onClick={handleLoadStandardDefaults}
              className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-black uppercase tracking-wider border border-emerald-200"
            >
              + Standart to'plamni biriktirish
            </button>
            <button
              type="button"
              onClick={handleStartAdd}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-black uppercase tracking-wider"
            >
              + Yangi qo'shish
            </button>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto bg-white rounded-2xl border border-slate-200">
          {refList.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors group"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">
                    #{idx + 1}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {item.title}
                  </span>
                  {item.type && (
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {item.type}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 truncate">
                  {item.authors && <span>Muallif: {item.authors}</span>}
                  {item.year && <span>• {item.year}</span>}
                  {item.pages && <span>• {item.pages}</span>}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"
                    title="Havolani ochish"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
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
