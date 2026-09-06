import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Presentation, 
  UploadCloud, 
  Link as LinkIcon, 
  Trash2, 
  CheckCircle, 
  ExternalLink, 
  FileCheck, 
  AlertCircle,
  Eye,
  RefreshCw,
  Sparkles,
  Download,
  X
} from 'lucide-react';
import { dbService } from '../lib/dbService';
import { auth } from '../lib/firebase';
import { CustomLectureFile } from '../types';
import { uploadPresentationFile } from '../lib/uploadHelper';

interface TopicLectureEditorProps {
  topicId: string;
  semester: number;
  order: number;
  topicTitle: string;
  lectureType?: 'text' | 'pdf' | 'pptx';
  customLectureFile?: CustomLectureFile | null;
  pdfUrl?: string;
  pptxUrl?: string;
  onChange: (data: {
    lectureType: 'text' | 'pdf' | 'pptx';
    customLectureFile: CustomLectureFile | null;
    pdfUrl?: string;
    pptxUrl?: string;
  }) => void;
}

// Convert Google Drive view URL to direct embeddable link
export function formatDocumentUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  
  // Google Drive
  const driveMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  }
  
  const driveIdMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (trimmed.includes('drive.google.com') && driveIdMatch && driveIdMatch[1]) {
    return `https://drive.google.com/file/d/${driveIdMatch[1]}/preview`;
  }

  return trimmed;
}

export default function TopicLectureEditor({
  topicId,
  semester,
  order,
  topicTitle,
  lectureType = 'text',
  customLectureFile = null,
  pdfUrl = '',
  pptxUrl = '',
  onChange
}: TopicLectureEditorProps) {
  const [activeType, setActiveType] = useState<'text' | 'pdf' | 'pptx'>(lectureType || 'text');
  const [currentFile, setCurrentFile] = useState<CustomLectureFile | null>(customLectureFile || null);
  const [manualUrl, setManualUrl] = useState<string>(
    customLectureFile?.fileUrl || (activeType === 'pdf' ? pdfUrl : pptxUrl) || ''
  );
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTypeChange = (newType: 'text' | 'pdf' | 'pptx') => {
    setActiveType(newType);
    setErrorMessage(null);

    // If switching to text, custom file can still be retained or cleared based on choice
    if (newType === 'text') {
      onChange({
        lectureType: 'text',
        customLectureFile: currentFile,
        pdfUrl: currentFile?.fileType === 'pdf' ? currentFile.fileUrl : pdfUrl,
        pptxUrl: currentFile?.fileType === 'pptx' ? currentFile.fileUrl : pptxUrl
      });
    } else {
      // If we already have a file matching newType
      const matchingFile = currentFile?.fileType === newType ? currentFile : null;
      onChange({
        lectureType: newType,
        customLectureFile: matchingFile,
        pdfUrl: newType === 'pdf' ? (matchingFile?.fileUrl || pdfUrl) : '',
        pptxUrl: newType === 'pptx' ? (matchingFile?.fileUrl || pptxUrl) : ''
      });
    }
  };

  const processSelectedFile = async (file: File) => {
    setErrorMessage(null);
    const fileName = file.name;
    const lower = fileName.toLowerCase();
    const isPdf = lower.endsWith('.pdf');
    const isPptx = lower.endsWith('.pptx') || lower.endsWith('.ppt');

    if (!isPdf && !isPptx) {
      setErrorMessage("Faqat .pdf yoki .pptx (.ppt) formatidagi fayllarni yuklash mumkin.");
      return;
    }

    const detectedType: 'pdf' | 'pptx' = isPdf ? 'pdf' : 'pptx';

    // 150MB limit check
    const MAX_SIZE = 150 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setErrorMessage("Fayl hajmi 150 MB dan oshmasligi kerak.");
      return;
    }

    setUploading(true);
    setUploadProgress(10);

    try {
      const uploadRes = await uploadPresentationFile(file, (percent) => {
        setUploadProgress(Math.max(10, percent));
      });

      const finalUrl = uploadRes.url;
      if (!finalUrl) {
        throw new Error("Fayl manzili (URL) olinmadi.");
      }

      const newLectureFile: CustomLectureFile = {
        fileUrl: finalUrl,
        fileName: file.name,
        fileType: detectedType,
        fileSize: file.size,
        uploadedAt: new Date().toISOString()
      };

      setCurrentFile(newLectureFile);
      setActiveType(detectedType);
      setManualUrl(finalUrl);

      onChange({
        lectureType: detectedType,
        customLectureFile: newLectureFile,
        pdfUrl: detectedType === 'pdf' ? finalUrl : '',
        pptxUrl: detectedType === 'pptx' ? finalUrl : ''
      });

      setUploadProgress(100);
      setTimeout(() => setUploadProgress(null), 800);
    } catch (err: any) {
      console.error("Lecture upload error:", err);
      setErrorMessage(err.message || "Faylni yuklashda xatolik yuz berdi");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleManualLinkApply = () => {
    if (!manualUrl.trim()) {
      setErrorMessage("Iltimos, havolani kiriting.");
      return;
    }
    const cleanUrl = formatDocumentUrl(manualUrl.trim());
    const lower = cleanUrl.toLowerCase();
    let detectedType = activeType;
    if (detectedType === 'text') {
      detectedType = lower.includes('.pptx') || lower.includes('.ppt') ? 'pptx' : 'pdf';
    }

    const defaultName = cleanUrl.split('/').pop()?.split('?')[0] || (detectedType === 'pdf' ? 'konspekt_ma\'ruza.pdf' : 'taqdimot_slayd.pptx');

    const updatedFile: CustomLectureFile = {
      fileUrl: cleanUrl,
      fileName: defaultName.includes('.') ? defaultName : `${defaultName}.${detectedType}`,
      fileType: detectedType as 'pdf' | 'pptx',
      uploadedAt: new Date().toISOString()
    };

    setCurrentFile(updatedFile);
    setActiveType(detectedType as 'pdf' | 'pptx');

    onChange({
      lectureType: detectedType as 'pdf' | 'pptx',
      customLectureFile: updatedFile,
      pdfUrl: detectedType === 'pdf' ? cleanUrl : '',
      pptxUrl: detectedType === 'pptx' ? cleanUrl : ''
    });

    setErrorMessage(null);
  };

  const handleRemoveCustomFile = () => {
    setCurrentFile(null);
    setActiveType('text');
    setManualUrl('');
    setErrorMessage(null);

    onChange({
      lectureType: 'text',
      customLectureFile: null,
      pdfUrl: '',
      pptxUrl: ''
    });
  };

  const formatBytes = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-[28px] p-6 space-y-6">
      {/* Header and Type Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest bg-brand-accent/10 px-2.5 py-1 rounded-md">
              Konspekt Formatini Tanlash
            </span>
            {activeType !== 'text' && (
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1">
                <CheckCircle size={12} /> {activeType.toUpperCase()} Faol
              </span>
            )}
          </div>
          <h4 className="text-base font-black text-slate-800 uppercase tracking-tight mt-1.5 flex items-center gap-2">
            Darslik va Ma'ruza Rejimi
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Mavzuning standart matnli konspektini o'zingizning <strong>PDF</strong> yoki <strong>PPTX</strong> faylingizga almashtirishingiz mumkin.
          </p>
        </div>

        {/* 3 Type Pills */}
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs gap-1 self-stretch sm:self-auto">
          <button
            type="button"
            onClick={() => handleTypeChange('text')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeType === 'text'
                ? 'bg-brand-primary text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText size={15} />
            <span>Matnli Darslik</span>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange('pdf')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeType === 'pdf'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50'
            }`}
          >
            <FileCheck size={15} />
            <span>PDF Konspekt</span>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange('pptx')}
            className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeType === 'pptx'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-600 hover:text-amber-600 hover:bg-amber-50'
            }`}
          >
            <Presentation size={15} />
            <span>PPTX Taqdimot</span>
          </button>
        </div>
      </div>

      {/* TEXT MODE NOTICE */}
      {activeType === 'text' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <FileText size={20} />
          </div>
          <div className="flex-1 text-sm">
            <h5 className="font-bold text-slate-800">Standart Matnli Konspekt Tanlangan</h5>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Talabalarga platformadagi to'liq matnli darslik (Markdown, lotin terminlari, anatomik diagrammalar va klinik eslatmalar) ko'rsatiladi. Quyida uni tahrirlashingiz mumkin.
            </p>
            {currentFile && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Saqlangan fayl: <strong className="text-slate-700">{currentFile.fileName}</strong> ({currentFile.fileType.toUpperCase()})
                </span>
                <button
                  type="button"
                  onClick={() => handleTypeChange(currentFile.fileType)}
                  className="text-xs text-brand-primary font-bold hover:underline cursor-pointer"
                >
                  Ushbu faylga o'tish →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PDF OR PPTX REPLACEMENT PANEL */}
      {activeType !== 'text' && (
        <div className="space-y-5">
          {/* Active File Card if file is attached */}
          {currentFile && currentFile.fileUrl ? (
            <div className={`p-5 rounded-2xl border-2 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
              activeType === 'pdf' 
                ? 'bg-rose-50/50 border-rose-200' 
                : 'bg-amber-50/50 border-amber-200'
            }`}>
              <div className="flex items-center gap-4 min-w-0">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  activeType === 'pdf' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
                }`}>
                  {activeType === 'pdf' ? <FileCheck size={28} /> : <Presentation size={28} />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider text-white ${
                      activeType === 'pdf' ? 'bg-rose-600' : 'bg-amber-600'
                    }`}>
                      {activeType === 'pdf' ? 'PDF Konspekt' : 'PowerPoint Taqdimot'}
                    </span>
                    {currentFile.fileSize && (
                      <span className="text-[11px] font-bold text-slate-500">
                        {formatBytes(currentFile.fileSize)}
                      </span>
                    )}
                  </div>
                  <h5 className="font-black text-slate-900 text-sm sm:text-base mt-1 truncate">
                    {currentFile.fileName}
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-md">
                    Manzil: {currentFile.fileUrl}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(true)}
                  className="px-4 py-2.5 bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                  title="Faylni ko'rish"
                >
                  <Eye size={15} /> Ko'rish
                </button>

                <a
                  href={currentFile.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                  title="Yangi oynada ochish"
                >
                  <ExternalLink size={15} /> Ochish
                </a>

                <button
                  type="button"
                  onClick={handleRemoveCustomFile}
                  className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-all cursor-pointer border border-red-200"
                  title="Faylni olib tashlash va matnli konspektga qaytish"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ) : (
            /* Upload Box */
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                const files = e.dataTransfer.files;
                if (files && files.length > 0) {
                  processSelectedFile(files[0]);
                }
              }}
              className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all bg-white cursor-pointer ${
                isDragOver 
                  ? 'border-brand-accent bg-brand-accent/5' 
                  : 'border-slate-300 hover:border-brand-primary'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={activeType === 'pdf' ? '.pdf' : '.pptx,.ppt'}
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    processSelectedFile(files[0]);
                  }
                }}
                className="hidden"
              />

              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                activeType === 'pdf' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
              }`}>
                <UploadCloud size={32} />
              </div>

              <h5 className="text-base font-black text-slate-800 uppercase tracking-tight">
                {activeType === 'pdf' 
                  ? "Mavzu uchun PDF Konspekt yuklash" 
                  : "Mavzu uchun PowerPoint (.pptx) Taqdimot yuklash"}
              </h5>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Faylni shu yerga tashlang yoki tanlash uchun bosing. Maksimal hajm: 150 MB.
                {activeType === 'pdf' ? ' (.pdf format)' : ' (.pptx, .ppt format)'}
              </p>

              <div className="mt-4">
                <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white shadow-md ${
                  activeType === 'pdf' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-amber-600 hover:bg-amber-700'
                }`}>
                  <UploadCloud size={16} />
                  Kompyuterdan tanlash
                </span>
              </div>
            </div>
          )}

          {/* Upload Progress Bar */}
          {uploading && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-2">
                  <RefreshCw size={14} className="animate-spin text-brand-primary" />
                  Fayl bulutga yuklanmoqda...
                </span>
                <span>{uploadProgress || 10}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    activeType === 'pdf' ? 'bg-rose-600' : 'bg-amber-600'
                  }`}
                  style={{ width: `${uploadProgress || 10}%` }}
                />
              </div>
            </div>
          )}

          {/* External / Google Drive Link Option */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <LinkIcon size={14} className="text-brand-accent" />
                Yoki tashqi havola orqali ulash (Google Drive / OneDrive / CDN)
              </label>
              <span className="text-[10px] text-slate-400">Google Drive linkini avtomatik moslashtiradi</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                placeholder={activeType === 'pdf' 
                  ? "Masalan: https://drive.google.com/file/d/.../view yoki https://.../konspekt.pdf" 
                  : "Masalan: https://drive.google.com/file/d/.../view yoki https://.../lecture.pptx"
                }
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:border-brand-accent focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={handleManualLinkApply}
                className="px-5 py-3 bg-brand-primary text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-800 transition-all shrink-0 cursor-pointer"
              >
                Havolani saqlash
              </button>
            </div>
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700 flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      )}

      {/* PREVIEW MODAL */}
      {showPreviewModal && currentFile && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8">
          <div className="bg-white rounded-[32px] w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl border-4 border-white/20">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <span className={`p-2 rounded-xl text-white ${
                  currentFile.fileType === 'pdf' ? 'bg-rose-600' : 'bg-amber-600'
                }`}>
                  {currentFile.fileType === 'pdf' ? <FileCheck size={20} /> : <Presentation size={20} />}
                </span>
                <div>
                  <h4 className="font-black text-slate-900 text-sm sm:text-base line-clamp-1">
                    {currentFile.fileName}
                  </h4>
                  <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                    {currentFile.fileType.toUpperCase()} Ko'rish Rejimi
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={currentFile.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all"
                >
                  <ExternalLink size={14} /> Yangi oynada
                </a>
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(false)}
                  className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-500 flex items-center justify-center transition-all cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Iframe Content */}
            <div className="flex-1 bg-slate-100 relative">
              {currentFile.fileType === 'pdf' ? (
                currentFile.fileUrl.startsWith('data:') ? (
                  <object
                    data={currentFile.fileUrl}
                    type="application/pdf"
                    className="w-full h-full"
                  >
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                      <p className="text-slate-600 mb-4">PDF brauzer ichida ko'rsatilmadi.</p>
                      <a href={currentFile.fileUrl} download={currentFile.fileName} className="px-6 py-3 bg-rose-600 text-white rounded-xl text-xs font-black uppercase">
                        Yuklab olish
                      </a>
                    </div>
                  </object>
                ) : (
                  <iframe
                    src={
                      currentFile.fileUrl.includes('drive.google.com')
                        ? currentFile.fileUrl
                        : `https://docs.google.com/viewer?url=${encodeURIComponent(currentFile.fileUrl)}&embedded=true`
                    }
                    className="w-full h-full border-0"
                    title="PDF Viewer"
                  />
                )
              ) : (
                /* PPTX Viewer */
                <iframe
                  src={
                    currentFile.fileUrl.includes('drive.google.com')
                      ? currentFile.fileUrl
                      : `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(currentFile.fileUrl)}`
                  }
                  className="w-full h-full border-0"
                  title="PPTX Presentation Viewer"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
