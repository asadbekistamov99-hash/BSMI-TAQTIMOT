import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Trash2, 
  Check, 
  RefreshCw, 
  Sparkles, 
  AlertCircle,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DiagramReplacement, saveDiagramReplacement, removeDiagramReplacement } from '../lib/diagramHelper';
import { uploadImageFile } from '../lib/uploadHelper';

interface ReplaceDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicId: string;
  diagramKey: string;
  diagramTitle: string;
  diagramCode: string;
  currentReplacement?: DiagramReplacement | null;
  onSuccess?: (replacement: DiagramReplacement | null) => void;
}

export default function ReplaceDiagramModal({
  isOpen,
  onClose,
  topicId,
  diagramKey,
  diagramTitle,
  diagramCode,
  currentReplacement,
  onSuccess
}: ReplaceDiagramModalProps) {
  const [imageUrl, setImageUrl] = useState(currentReplacement?.imageUrl || '');
  const [caption, setCaption] = useState(currentReplacement?.caption || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOriginalCode, setShowOriginalCode] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const res = await uploadImageFile(file, (percent) => {
        setUploadProgress(percent);
      });
      if (res.url) {
        setImageUrl(res.url);
      }
    } catch (err: any) {
      setError(err.message || "Rasmni yuklashda xatolik yuz berdi");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!imageUrl.trim()) {
      setError("Iltimos, rasm faylini yuklang yoki rasm URL havolasini kiriting.");
      return;
    }

    setError(null);
    setIsSaving(true);

    const replacement: DiagramReplacement = {
      imageUrl: imageUrl.trim(),
      caption: caption.trim() || diagramTitle,
      diagramKey,
      originalCode: diagramCode,
      title: diagramTitle,
      updatedAt: new Date().toISOString()
    };

    try {
      if (topicId) {
        await saveDiagramReplacement(topicId, diagramKey, replacement);
      }
      onSuccess?.(replacement);
      onClose();
    } catch (err: any) {
      setError(err.message || "Saqlashda xatolik yuz berdi");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!window.confirm("Rostdan ham ushbu rasmni olib tashlab, asl sxemaga qaytarmoqchimisiz?")) {
      return;
    }

    setIsSaving(true);
    try {
      if (topicId) {
        await removeDiagramReplacement(topicId, diagramKey);
      }
      onSuccess?.(null);
      onClose();
    } catch (err: any) {
      setError(err.message || "O'chirishda xatolik yuz berdi");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-3xl sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-accent/20 text-brand-primary rounded-2xl">
              <ImageIcon className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 block">
                Admin Vositalari
              </span>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">
                Diagrammani Rasmga Almashtirish
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Diagram Info Box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  Tanlangan Anatomik Tuzilma / Sxema
                </span>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  {diagramTitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowOriginalCode(!showOriginalCode)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" />
                {showOriginalCode ? "Kodni yashirish" : "Asl ASCII kodni ko'rish"}
                {showOriginalCode ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {showOriginalCode && (
              <div className="mt-3 p-3 bg-slate-900 rounded-xl text-slate-200 font-mono text-xs overflow-x-auto max-h-48 border border-slate-800">
                <pre>{diagramCode}</pre>
              </div>
            )}
          </div>

          {/* Upload Method 1: File Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
              1. Kompyuter yoki telefondan rasm yuklash
            </label>
            <label className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-indigo-50/20 transition-all group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={isUploading || isSaving}
                className="hidden"
              />
              <div className="p-3 bg-white group-hover:bg-indigo-600 text-slate-500 group-hover:text-white rounded-2xl shadow-xs transition-all mb-3">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800 text-center">
                {isUploading ? "Rasm serverga yuklanmoqda..." : "Rasm faylini tanlash uchun bosing"}
              </p>
              <p className="text-xs text-slate-500 mt-1 text-center">
                JPG, PNG, WEBP, SVG formatlari qo'llab-quvvatlanadi
              </p>

              {isUploading && (
                <div className="w-full max-w-xs mt-4">
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 text-center block mt-1 font-mono">
                    {uploadProgress}%
                  </span>
                </div>
              )}
            </label>
          </div>

          {/* Upload Method 2: Image URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
              2. Yoki rasm URL havolasini kiriting
            </label>
            <div className="relative">
              <input
                type="text"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... yoki https://..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
              />
              <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Caption / Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
              Rasm Tavsifi / Izohi (Talabalar ko'rishi uchun)
            </label>
            <input
              type="text"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="Masalan: Sagittal va frontal sathlar kesishmasi (Atlas tasviri)"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 outline-none focus:border-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {/* Image Preview */}
          {imageUrl && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" /> Tanlangan Rasm Ko'rinishi
                </span>
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Tozalash
                </button>
              </div>
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white max-h-64 flex items-center justify-center">
                <img
                  src={imageUrl}
                  alt={caption || diagramTitle}
                  referrerPolicy="no-referrer"
                  className="max-h-64 w-auto object-contain rounded-lg"
                  onError={() => setError("Rasm yuklanmadi. Havolani to'g'ri kiritganingizni tekshiring.")}
                />
              </div>
              {caption && (
                <p className="text-xs text-slate-600 font-medium text-center mt-2 italic">
                  "{caption}"
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-3xl flex items-center justify-between gap-4">
          <div>
            {currentReplacement?.imageUrl && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={isSaving}
                className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Asl sxemaga qaytarish
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200/70 rounded-xl transition-all cursor-pointer"
            >
              Bekor qilish
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isUploading || !imageUrl.trim()}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-200 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saqlanmoqda...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Rasmga almashtirish
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
