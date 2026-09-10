import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Presentation as PresentationIcon, 
  Search, 
  CheckCircle2, 
  Clock, 
  Upload, 
  Link as LinkIcon, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  RefreshCw, 
  Eye, 
  Check, 
  X, 
  AlertCircle, 
  Maximize2, 
  Minimize2, 
  Layers, 
  Filter, 
  Play, 
  ShieldCheck, 
  FileCheck,
  LayoutGrid,
  List as ListIcon,
  HelpCircle,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { ALL_39_TOPICS, CurriculumTopic } from '../data/allSemesterTopics';
import { db, storage } from '../lib/firebase';
import { collection, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { dbService } from '../lib/dbService';
import { formatDocumentUrl } from './TopicLectureEditor';
import { uploadPresentationFile, formatPresentationUrl, getPresentationEmbedUrl } from '../lib/uploadHelper';
import { PresentationViewer } from './PresentationViewer';

const STORAGE_RULES_SNIPPET = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isSignedIn() {
      return request.auth != null;
    }

    function isAdmin() {
      return isSignedIn() && request.auth.token.email.matches('(?i)asadbekistamov99@gmail.com');
    }

    match /midterms/{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin() && request.resource.size < 10 * 1024 * 1024 * 1024;
    }

    match /atlas_models/{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin() && request.resource.size < 10 * 1024 * 1024 * 1024;
    }

    match /site_assets/{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin() && request.resource.size < 50 * 1024 * 1024;
    }

    match /presentations/{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin() && request.resource.size < 150 * 1024 * 1024;
    }

    match /diagrams/{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin() && request.resource.size < 10 * 1024 * 1024;
    }

    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}`;

interface AdminPresentationsManagerProps {
  searchQuery?: string;
  authUser?: any;
  requestConfirm?: (title: string, message: string, onConfirm: () => void | Promise<void>, confirmText?: string, cancelText?: string) => void;
}

interface MergedTopicPresentation extends CurriculumTopic {
  hasPresentation: boolean;
  effectiveLectureType: 'pptx' | 'pdf';
  effectiveFileUrl: string;
  customLectureFile?: {
    fileUrl: string;
    fileName: string;
    fileType: 'pptx' | 'pdf';
    fileSize?: number;
    uploadedAt?: string;
  } | null;
  theory?: any;
  updatedAt?: string;
}

export default function AdminPresentationsManager({
  searchQuery: externalSearch = '',
  authUser,
  requestConfirm
}: AdminPresentationsManagerProps) {
  const [topics, setTopics] = useState<MergedTopicPresentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filters
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pptx' | 'pdf' | 'uploaded' | 'pending'>('all');
  const [internalSearch, setInternalSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Edit / Upload Modal
  const [editingTopic, setEditingTopic] = useState<MergedTopicPresentation | null>(null);
  const [modalFileType, setModalFileType] = useState<'pptx' | 'pdf'>('pptx');
  const [modalFileUrl, setModalFileUrl] = useState('');
  const [modalFileName, setModalFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preview Modal
  const [previewTopic, setPreviewTopic] = useState<MergedTopicPresentation | null>(null);
  const [previewFullscreen, setPreviewFullscreen] = useState(false);

  // Load all topics and merge with Firestore
  const loadTopicsData = async () => {
    try {
      setRefreshing(true);
      const dbTopics = await dbService.getTopics();

      const merged: MergedTopicPresentation[] = ALL_39_TOPICS.map(base => {
        const found = dbTopics.find(
          t => Number(t.semester) === Number(base.semester) && Number(t.order) === Number(base.order)
        );

        const customFile = found?.customLectureFile;
        const rawPptx = found?.pptxUrl || (customFile?.fileType === 'pptx' ? customFile.fileUrl : '');
        const rawPdf = found?.pdfUrl || (customFile?.fileType === 'pdf' ? customFile.fileUrl : '');
        const rawType = found?.lectureType || customFile?.fileType || (rawPptx ? 'pptx' : 'pdf');

        const effectiveUrl = rawPptx || rawPdf || customFile?.fileUrl || '';
        const hasFile = Boolean(effectiveUrl && effectiveUrl.trim().length > 5);

        return {
          ...base,
          ...(found || {}),
          id: found?.id || base.id,
          hasPresentation: hasFile,
          effectiveLectureType: (rawType === 'pdf' ? 'pdf' : 'pptx') as 'pptx' | 'pdf',
          effectiveFileUrl: effectiveUrl,
          customLectureFile: customFile || null,
          updatedAt: found?.updatedAt || undefined
        };
      });

      setTopics(merged);
    } catch (err) {
      console.error("Failed to load topics in AdminPresentationsManager:", err);
      // Fallback
      setTopics(ALL_39_TOPICS.map(t => ({
        ...t,
        hasPresentation: false,
        effectiveLectureType: 'pptx',
        effectiveFileUrl: '',
        customLectureFile: null
      })));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTopicsData();
  }, []);

  // Filtered Topics
  const filteredTopics = useMemo(() => {
    const q = (internalSearch || externalSearch).trim().toLowerCase();

    return topics.filter(t => {
      // Semester filter
      if (selectedSemester !== 'all' && Number(t.semester) !== Number(selectedSemester)) {
        return false;
      }

      // Status filter
      if (statusFilter === 'uploaded' && !t.hasPresentation) return false;
      if (statusFilter === 'pending' && t.hasPresentation) return false;
      if (statusFilter === 'pptx' && (!t.hasPresentation || t.effectiveLectureType !== 'pptx')) return false;
      if (statusFilter === 'pdf' && (!t.hasPresentation || t.effectiveLectureType !== 'pdf')) return false;

      // Text Search
      if (q) {
        const titleUz = (t.title?.uz || (typeof t.title === 'string' ? t.title : '')).toLowerCase();
        const titleRu = (t.title?.ru || '').toLowerCase();
        const titleEn = (t.title?.en || '').toLowerCase();
        const section = (t.section || '').toLowerCase();
        const orderStr = String(t.order);

        return (
          titleUz.includes(q) ||
          titleRu.includes(q) ||
          titleEn.includes(q) ||
          section.includes(q) ||
          orderStr === q
        );
      }

      return true;
    });
  }, [topics, selectedSemester, statusFilter, internalSearch, externalSearch]);

  // Statistics
  const stats = useMemo(() => {
    const total = topics.length;
    const uploaded = topics.filter(t => t.hasPresentation).length;
    const pptxCount = topics.filter(t => t.hasPresentation && t.effectiveLectureType === 'pptx').length;
    const pdfCount = topics.filter(t => t.hasPresentation && t.effectiveLectureType === 'pdf').length;
    const pending = total - uploaded;
    const percentage = total > 0 ? Math.round((uploaded / total) * 100) : 0;

    return { total, uploaded, pptxCount, pdfCount, pending, percentage };
  }, [topics]);

  // Open Edit / Upload Modal
  const handleOpenEdit = (topic: MergedTopicPresentation) => {
    setEditingTopic(topic);
    setModalFileType(topic.effectiveLectureType || 'pptx');
    setModalFileUrl(topic.effectiveFileUrl || '');
    setModalFileName(
      topic.customLectureFile?.fileName || 
      `${topic.order}-mavzu_taqdimoti.${topic.effectiveLectureType || 'pptx'}`
    );
    setSaveSuccess(false);
    setSaveError(null);
    setUploadProgress(null);
  };

  // Local File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingTopic) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    const detectedType = extension === 'pdf' ? 'pdf' : 'pptx';
    setModalFileType(detectedType);
    setModalFileName(file.name);
    setIsUploading(true);
    setSaveError(null);
    setUploadProgress(5);

    try {
      const result = await uploadPresentationFile(file, (percent) => {
        setUploadProgress(percent);
      });

      setModalFileUrl(result.url);
      setModalFileName(result.fileName);
      setModalFileType(result.fileType);
      setIsUploading(false);
      setUploadProgress(null);
    } catch (err: any) {
      console.error("Presentation upload error:", err);
      setSaveError(err.message || "Faylni yuklashda xatolik yuz berdi. Iltimos, qayta urinib ko'ring yoki havola kiriting.");
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  // Save changes to Firestore
  const handleSaveTopicPresentation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTopic) return;

    if (!modalFileUrl.trim()) {
      setSaveError("Iltimos, fayl havolasini kiriting yoki kompyuterdan PPTX/PDF fayl tanlang.");
      return;
    }

    try {
      setSaveError(null);
      setIsSaving(true);
      const cleanUrl = formatPresentationUrl(modalFileUrl.trim());
      const targetId = editingTopic.id || `sem_${editingTopic.semester}_top_${editingTopic.order}`;

      const updatePayload = {
        semester: Number(editingTopic.semester),
        order: Number(editingTopic.order),
        lectureType: modalFileType,
        pptxUrl: modalFileType === 'pptx' ? cleanUrl : '',
        pdfUrl: modalFileType === 'pdf' ? cleanUrl : '',
        customLectureFile: {
          fileUrl: cleanUrl,
          fileName: modalFileName || `${editingTopic.order}-mavzu taqdimoti.${modalFileType}`,
          fileType: modalFileType,
          uploadedAt: new Date().toISOString()
        },
        updatedAt: new Date().toISOString()
      };

      // 1. Save directly to Firestore
      await setDoc(doc(db, 'topics', targetId), updatePayload, { merge: true });

      // 2. Also ensure dbService is updated
      try {
        await dbService.saveTopic(targetId, updatePayload);
      } catch (err) {
        console.warn("dbService sync warning (Firestore already saved):", err);
      }

      // 3. Update local state
      setTopics(prev => prev.map(t => {
        if (Number(t.semester) === Number(editingTopic.semester) && Number(t.order) === Number(editingTopic.order)) {
          return {
            ...t,
            ...updatePayload,
            hasPresentation: true,
            effectiveLectureType: modalFileType,
            effectiveFileUrl: cleanUrl
          };
        }
        return t;
      }));

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setEditingTopic(null);
      }, 1000);
    } catch (err: any) {
      console.error("Error saving presentation in admin:", err);
      setSaveError("Saqlashda xatolik yuz berdi: " + (err.message || 'Qayta urinib ko\'ring'));
    } finally {
      setIsSaving(false);
    }
  };

  // Delete / Remove Presentation attachment
  const handleDeletePresentation = (topic: MergedTopicPresentation) => {
    const doDelete = async () => {
      try {
        const targetId = topic.id || `sem_${topic.semester}_top_${topic.order}`;
        const removePayload = {
          pptxUrl: '',
          pdfUrl: '',
          lectureType: 'text',
          customLectureFile: null,
          updatedAt: new Date().toISOString()
        };

        await setDoc(doc(db, 'topics', targetId), removePayload, { merge: true });

        setTopics(prev => prev.map(t => {
          if (Number(t.semester) === Number(topic.semester) && Number(t.order) === Number(topic.order)) {
            return {
              ...t,
              ...removePayload,
              hasPresentation: false,
              effectiveLectureType: 'pptx',
              effectiveFileUrl: ''
            };
          }
          return t;
        }));

        if (editingTopic && editingTopic.id === topic.id) {
          setEditingTopic(null);
        }
      } catch (err: any) {
        alert("O'chirishda xatolik: " + err.message);
      }
    };

    if (requestConfirm) {
      requestConfirm(
        "Taqdimotni o'chirish",
        `Rostdan ham ${topic.semester}-semestr, ${topic.order}-mavzuning taqdimot faylini o'chirmoqchimisiz? Talabalar ushbu taqdimotni ko'ra olishmaydi.`,
        doDelete,
        "Ha, o'chirilsin",
        "Bekor qilish"
      );
    } else if (window.confirm(`${topic.order}-mavzu taqdimotini o'chirmoqchimisiz?`)) {
      doDelete();
    }
  };

  // Helper for embed preview URL
  const getEmbedUrl = (topic: MergedTopicPresentation) => {
    return getPresentationEmbedUrl(topic.effectiveFileUrl, topic.effectiveLectureType);
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* Top Header Card */}
      <div className="bg-white p-8 sm:p-10 rounded-[40px] border border-slate-200 shadow-sm relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full">
              Admin Boshqaruvi
            </span>
            <span className="px-3.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5">
              <PresentationIcon className="w-3.5 h-3.5 text-amber-600" />
              PowerPoint (.PPTX) & PDF Taqdimotlar
            </span>
            <span className="px-3.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Himoyalangan Slaydlar Bazasi
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
            Anatomik Taqdimotlar Boshqaruvi
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            Odam anatomiyasi fanining barcha 3 ta semestri (jami 39 ta rasmiy mavzu) bo'yicha taqdimot fayllarini biriktiring, yangilang, PPTX/PDF almashtiring yoki o'chiring. Kiritilgan barcha fayllar talabalar panelidagi «Taqdimotlar» bo'limida avtomatik namoyon bo'ladi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={loadTopicsData}
            disabled={refreshing}
            className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Yangilash</span>
          </button>

          <a
            href="/presentation"
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3.5 bg-brand-accent hover:bg-brand-accent/90 text-brand-primary rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-md hover:scale-105 active:scale-95"
          >
            <span>Talaba Ko'rinishini Ochish</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Progress & Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jami Mavzular</span>
          <div className="text-2xl font-black text-slate-900 mt-2">{stats.total} ta</div>
          <span className="text-[10px] font-bold text-slate-400 mt-1">3 ta semestr</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-emerald-200 bg-emerald-50/20 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Yuklangan
          </span>
          <div className="text-2xl font-black text-emerald-700 mt-2">{stats.uploaded} ta</div>
          <span className="text-[10px] font-bold text-emerald-600 mt-1">{stats.percentage}% to'liq</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-amber-200 bg-amber-50/20 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest flex items-center gap-1">
            <PresentationIcon className="w-3.5 h-3.5" /> PowerPoint
          </span>
          <div className="text-2xl font-black text-amber-800 mt-2">{stats.pptxCount} ta</div>
          <span className="text-[10px] font-bold text-amber-600 mt-1">.PPTX slaydlari</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-rose-200 bg-rose-50/20 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-black text-rose-700 uppercase tracking-widest flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" /> PDF Konspekt
          </span>
          <div className="text-2xl font-black text-rose-800 mt-2">{stats.pdfCount} ta</div>
          <span className="text-[10px] font-bold text-rose-600 mt-1">.PDF materiallar</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Kutilmoqda
          </span>
          <div className="text-2xl font-black text-slate-600 mt-2">{stats.pending} ta</div>
          <span className="text-[10px] font-bold text-slate-400 mt-1">Fayli yo'q mavzular</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-brand-accent/40 bg-brand-accent/5 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Tayyorgarlik</span>
          <div className="text-2xl font-black text-brand-accent mt-2">{stats.percentage}%</div>
          <div className="w-full bg-slate-200 rounded-full h-2 mt-2 overflow-hidden">
            <div 
              className="bg-brand-accent h-full transition-all duration-500 rounded-full" 
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Control & Filter Toolbar */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Semester Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedSemester('all')}
              className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                selectedSemester === 'all'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Barcha Semestrlar (39)
            </button>
            <button
              type="button"
              onClick={() => setSelectedSemester(1)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                selectedSemester === 1
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              1-Semestr (13)
            </button>
            <button
              type="button"
              onClick={() => setSelectedSemester(2)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                selectedSemester === 2
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              2-Semestr (13)
            </button>
            <button
              type="button"
              onClick={() => setSelectedSemester(3)}
              className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                selectedSemester === 3
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              3-Semestr (13)
            </button>
          </div>

          {/* Right Filters & View Mode */}
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-brand-accent cursor-pointer"
            >
              <option value="all">Barcha holatlar</option>
              <option value="uploaded">Faqat fayli borlar</option>
              <option value="pptx">Faqat PowerPoint (.pptx)</option>
              <option value="pdf">Faqat PDF (.pdf)</option>
              <option value="pending">Faqat kutilayotganlar</option>
            </select>

            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Karta ko'rinishi"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Jadval ko'rinishi"
              >
                <ListIcon size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={internalSearch}
            onChange={(e) => setInternalSearch(e.target.value)}
            placeholder="Mavzu nomi, raqami yoki bo'limi bo'yicha qidirish (masalan: 7, Orqa miya, Kranologiya, Mushaklar...)"
            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-accent focus:bg-white transition-all"
          />
          {internalSearch && (
            <button
              type="button"
              onClick={() => setInternalSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 hover:text-slate-600"
            >
              Tozalash
            </button>
          )}
        </div>
      </div>

      {/* Topics Content */}
      {loading ? (
        <div className="py-24 text-center bg-white rounded-[40px] border border-slate-200 p-8">
          <div className="w-12 h-12 border-4 border-brand-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-black text-slate-700 uppercase tracking-wider">Mavzular taqdimotlari yuklanmoqda...</p>
        </div>
      ) : filteredTopics.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-[40px] border border-slate-200 p-8">
          <PresentationIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Mos keluvchi mavzular topilmadi</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Qidiruv so'zini tozalab ko'ring yoki boshqa semestr bo'limiga o'ting.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic, index) => {
            const hasFile = topic.hasPresentation;
            const isPptx = topic.effectiveLectureType === 'pptx';

            return (
              <motion.div
                key={`${topic.semester}_${topic.order}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.015 }}
                className={`rounded-[32px] p-6 border transition-all flex flex-col justify-between bg-white ${
                  hasFile 
                    ? 'border-slate-200 hover:border-brand-accent shadow-sm hover:shadow-lg' 
                    : 'border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white">
                      {topic.semester}-Semestr • {topic.order}-Mavzu
                    </span>

                    {hasFile ? (
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                        isPptx ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        <CheckCircle2 className="w-3 h-3" />
                        {isPptx ? 'PowerPoint (.pptx)' : 'PDF Taqdimot'}
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider bg-slate-200 text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Kutilmoqda
                      </span>
                    )}
                  </div>

                  {/* Section name */}
                  <p className="text-[11px] font-bold text-brand-accent uppercase tracking-wider mb-1 line-clamp-1">
                    {topic.section}
                  </p>

                  {/* Topic Title */}
                  <h3 className="text-base font-black text-slate-900 tracking-tight leading-snug line-clamp-2 mb-3">
                    {topic.title?.uz || (typeof topic.title === 'string' ? topic.title : '')}
                  </h3>

                  {/* File information pill */}
                  {hasFile ? (
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 mb-4 text-xs">
                      <div className="flex items-center gap-2 text-slate-700 font-bold truncate mb-1">
                        {isPptx ? (
                          <PresentationIcon className="w-4 h-4 text-amber-600 shrink-0" />
                        ) : (
                          <FileText className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                        <span className="truncate">
                          {topic.customLectureFile?.fileName || `${topic.order}-mavzu.${topic.effectiveLectureType}`}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center justify-between">
                        <span>Havola: {topic.effectiveFileUrl.startsWith('data:') ? 'Lokal yuklangan fayl' : 'Tashqi URL / Drive'}</span>
                        {topic.updatedAt && (
                          <span>{new Date(topic.updatedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-100 mb-4 text-xs text-amber-800 font-medium">
                      💡 Taqdimot yuklanmagan. "Yuklash / Biriktirish" tugmasi orqali PPTX yoki PDF qo'shing.
                    </div>
                  )}
                </div>

                {/* Card Bottom Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(topic)}
                    className="flex-1 py-3 px-4 rounded-2xl bg-slate-900 hover:bg-brand-accent hover:text-brand-primary text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{hasFile ? "O'zgartirish" : "Fayl Yuklash"}</span>
                  </button>

                  {hasFile && (
                    <>
                      <button
                        type="button"
                        onClick={() => setPreviewTopic(topic)}
                        className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer shrink-0"
                        title="Taqdimotni sinab ko'rish"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeletePresentation(topic)}
                        className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all cursor-pointer shrink-0"
                        title="Faylni o'chirish"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500">
                <tr>
                  <th className="py-4 px-6">Semestr / Raqam</th>
                  <th className="py-4 px-6">Mavzu Nomi</th>
                  <th className="py-4 px-6">Bo'lim</th>
                  <th className="py-4 px-6">Turi / Holati</th>
                  <th className="py-4 px-6">Fayl Nomi</th>
                  <th className="py-4 px-6 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTopics.map((topic) => {
                  const hasFile = topic.hasPresentation;
                  const isPptx = topic.effectiveLectureType === 'pptx';

                  return (
                    <tr key={`${topic.semester}_${topic.order}`} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 whitespace-nowrap">
                        <span className="font-black text-slate-900">
                          {topic.semester}-semestr • {topic.order}-mavzu
                        </span>
                      </td>
                      <td className="py-4 px-6 max-w-xs truncate font-bold text-slate-800">
                        {topic.title?.uz || (typeof topic.title === 'string' ? topic.title : '')}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-slate-500 font-medium">
                        {topic.section}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        {hasFile ? (
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 ${
                            isPptx ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            <CheckCircle2 className="w-3 h-3" />
                            {isPptx ? 'PowerPoint' : 'PDF'}
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider bg-slate-200 text-slate-600 inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Kutilmoqda
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 max-w-xs truncate text-slate-500 font-mono text-[11px]">
                        {hasFile ? (
                          topic.customLectureFile?.fileName || `${topic.order}-mavzu.${topic.effectiveLectureType}`
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(topic)}
                            className="px-3.5 py-2 bg-slate-900 hover:bg-brand-accent hover:text-brand-primary text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
                          >
                            {hasFile ? "O'zgartirish" : "Yuklash"}
                          </button>

                          {hasFile && (
                            <>
                              <button
                                type="button"
                                onClick={() => setPreviewTopic(topic)}
                                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
                                title="Sinov"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePresentation(topic)}
                                className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all cursor-pointer"
                                title="O'chirish"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT & UPLOAD MODAL */}
      {/* ========================================================================= */}
      {editingTopic && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[36px] p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 text-slate-900 relative my-8"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-brand-primary text-white">
                  {editingTopic.semester}-Semestr • {editingTopic.order}-Mavzu
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest bg-slate-100 text-slate-600 uppercase">
                  {editingTopic.section}
                </span>
              </div>

              <button 
                onClick={() => setEditingTopic(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2">
              {editingTopic.title?.uz || (typeof editingTopic.title === 'string' ? editingTopic.title : '')}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Ushbu mavzuga rasmiy PowerPoint taqdimot (.PPTX) yoki PDF konspekt faylini biriktiring yoki mavjud faylni yangisiga almashtiring.
            </p>

            <form onSubmit={handleSaveTopicPresentation} className="space-y-6">
              
              {/* Type Selection */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                  Fayl Turi:
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setModalFileType('pptx')}
                    className={`py-3.5 px-4 rounded-2xl border text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      modalFileType === 'pptx'
                        ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <PresentationIcon className="w-4 h-4" />
                    <span>PowerPoint (.PPTX)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalFileType('pdf')}
                    className={`py-3.5 px-4 rounded-2xl border text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      modalFileType === 'pdf'
                        ? 'bg-rose-600 text-white border-rose-700 shadow-md'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>PDF Konspekt (.PDF)</span>
                  </button>
                </div>
              </div>

              {/* Upload from Computer */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                    1-Usul: Kompyuterdan fayl yuklash (.pptx yoki .pdf):
                  </label>
                  {modalFileUrl && (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Fayl tayyor
                    </span>
                  )}
                </div>

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-brand-accent rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-slate-100/50 transition-all text-center group"
                >
                  <Upload className="w-8 h-8 text-slate-400 group-hover:text-brand-accent mb-2 transition-colors" />
                  <span className="text-xs font-bold text-slate-700">
                    {isUploading ? "Fayl yuklanmoqda..." : "PPTX yoki PDF faylni tanlang yoki shu yerga tashlang"}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">
                    Maksimal tavsiya etilgan hajm: 25 MB gacha
                  </span>

                  {uploadProgress !== null && (
                    <div className="w-full max-w-xs bg-slate-200 rounded-full h-2 mt-3 overflow-hidden">
                      <div 
                        className="bg-brand-accent h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}

                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept=".pptx,.pdf,.ppt" 
                    onChange={handleFileUpload} 
                    className="hidden" 
                  />
                </div>
              </div>

              {/* Enter Web Link */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                  2-Usul: Fayl Havolasi (Google Drive, OneDrive yoki Direct URL):
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={modalFileUrl.startsWith('data:') ? '' : modalFileUrl}
                    onChange={(e) => setModalFileUrl(e.target.value)}
                    placeholder="https://drive.google.com/file/d/... yoki to'g'ridan-to'g'ri URL"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-accent focus:bg-white transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 leading-normal">
                  💡 Agar Google Drive havolasi kiritilsa, tizim uni avtomatik tarzda taqdimot ko'ruvchi formatiga o'zgartiradi.
                </p>
              </div>

              {/* Custom Display Name */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
                  Taqdimot Fayli Nomi (Ko'rsatiladigan nom):
                </label>
                <input
                  type="text"
                  value={modalFileName}
                  onChange={(e) => setModalFileName(e.target.value)}
                  placeholder={`Masalan: ${editingTopic.order}-Mavzu_Taqdimoti.${modalFileType}`}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-accent transition-all"
                />
              </div>

              {/* Alert Messages */}
              {saveError && saveError.includes('STORAGE_RULES_MISSING') ? (
                <div className="p-5 bg-indigo-50 border-2 border-indigo-200 rounded-2xl space-y-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-black text-indigo-900 uppercase tracking-tight">
                        Firebase Storage qoidalari sozlanmagan
                      </h4>
                      <p className="text-[11px] text-indigo-700/80 font-medium mt-1 leading-relaxed">
                        Fayl yuklanmadi, chunki Firebase loyihangizdagi Storage xavfsizlik qoidalarida <code>presentations/</code> papkasiga yozish ruxsati yo'q.
                        Buni bir marta tuzatish kifoya: quyidagi qoidalarni nusxalab, <b>Firebase Console → Storage → Rules</b> bo'limiga to'liq joylashtiring va <b>Publish</b> tugmasini bosing.
                      </p>
                    </div>
                  </div>
                  <div className="relative bg-slate-900 rounded-2xl overflow-hidden p-4 border border-slate-800">
                    <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-widest pb-2 border-b border-slate-800/80 mb-2">
                      <span>storage.rules</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(STORAGE_RULES_SNIPPET);
                          alert("Storage qoidalari nusxalandi! Firebase Console → Storage → Rules bo'limiga joylashtiring.");
                        }}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer text-[9px] font-black uppercase tracking-wider"
                      >
                        Nusxalash
                      </button>
                    </div>
                    <pre className="text-[10px] text-emerald-400 font-mono overflow-x-auto max-h-52 leading-relaxed select-all">
{STORAGE_RULES_SNIPPET}
                    </pre>
                  </div>
                </div>
              ) : saveError && saveError.includes('STORAGE_BILLING_BLOCKED') ? (
                <div className="p-5 bg-amber-50 border-2 border-amber-200 rounded-2xl space-y-3">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-black text-amber-900 uppercase tracking-tight">
                        Firebase Storage ishlamayapti (billing muammosi)
                      </h4>
                      <p className="text-[11px] text-amber-700/90 font-medium mt-1.5 leading-relaxed">
                        Google Firebase loyihangizda Storage'ni yoqish uchun endi to'lov (Blaze) rejasini talab qilmoqda, va hisobingizda billing sozlanmagan/xatolik bor.
                      </p>
                      <p className="text-[11px] text-amber-700/90 font-medium mt-2 leading-relaxed">
                        <b>Tezkor bepul yechim:</b> <a href="https://supabase.com" target="_blank" rel="noreferrer" className="underline font-black">supabase.com</a> saytida kartasiz bepul hisob oching → yangi loyiha yarating → Project Settings → API bo'limidan <code>Project URL</code> va <code>anon public</code> kalitini nusxalang → saytingiz hostingidagi (Vercel) muhit o'zgaruvchilariga <code>VITE_SUPABASE_URL</code> va <code>VITE_SUPABASE_ANON_KEY</code> nomlari bilan qo'shing va qayta deploy qiling. Tizim buni avtomatik aniqlab, fayllarni Firebase o'rniga Supabase orqali yuklay boshlaydi.
                      </p>
                    </div>
                  </div>
                </div>
              ) : saveError && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-bold flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{saveError}</span>
                </div>
              )}

              {saveSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-black flex items-center gap-2.5">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>Taqdimot muvaffaqiyatli saqlandi va platformaga joylandi!</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
                {editingTopic.hasPresentation && (
                  <button
                    type="button"
                    onClick={() => handleDeletePresentation(editingTopic)}
                    className="px-4 py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-2xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Faylni O'chirish</span>
                  </button>
                )}

                <div className="flex items-center gap-3 ml-auto">
                  <button
                    type="button"
                    onClick={() => setEditingTopic(null)}
                    className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold uppercase tracking-wider cursor-pointer transition-all"
                  >
                    Bekor Qilish
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading || isSaving}
                    className="px-7 py-3.5 bg-brand-accent hover:bg-brand-accent/90 text-brand-primary rounded-2xl text-xs font-black uppercase tracking-widest cursor-pointer shadow-md disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Saqlanmoqda...</span>
                      </>
                    ) : (
                      <span>Saqlash va Joylash</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TEST PREVIEW MODAL */}
      {/* ========================================================================= */}
      {previewTopic && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col p-4 sm:p-6">
          <div className="bg-slate-900 border-b border-slate-800 p-4 px-6 rounded-t-3xl flex items-center justify-between text-white shrink-0">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-brand-accent text-brand-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                {previewTopic.semester}-Semestr • {previewTopic.order}-Mavzu
              </span>
              <h3 className="text-sm sm:text-base font-black tracking-tight text-white line-clamp-1">
                {previewTopic.title?.uz || (typeof previewTopic.title === 'string' ? previewTopic.title : '')}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewFullscreen(!previewFullscreen)}
                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all cursor-pointer"
                title={previewFullscreen ? "Kichiklashtirish" : "To'liq ekran"}
              >
                {previewFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>

              <button
                type="button"
                onClick={() => setPreviewTopic(null)}
                className="p-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-all cursor-pointer"
                title="Yopish"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="flex-1 w-full bg-slate-900 rounded-b-3xl overflow-hidden relative">
            <PresentationViewer
              fileUrl={previewTopic.effectiveFileUrl}
              fileType={previewTopic.effectiveLectureType}
              title={previewTopic.title?.uz || (typeof previewTopic.title === 'string' ? previewTopic.title : 'Taqdimot')}
              isFullscreen={previewFullscreen}
              onToggleFullscreen={() => setPreviewFullscreen(!previewFullscreen)}
              onClose={() => setPreviewTopic(null)}
              canAnnotate={true}
            />
          </div>
        </div>
      )}

    </div>
  );
}
