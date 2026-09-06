import React, { useState, useEffect } from 'react';
import { 
  FileCheck, 
  Presentation, 
  Download, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  FileText, 
  ShieldAlert,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { CustomLectureFile } from '../types';
import { formatDocumentUrl } from './TopicLectureEditor';

interface TopicLectureViewerProps {
  lectureType: 'pdf' | 'pptx';
  lectureFile?: CustomLectureFile | null;
  fileUrl: string;
  fileName?: string;
  topicTitle: string;
  hasTextTheory?: boolean;
  onShowTextTheory?: () => void;
  isAdmin?: boolean;
}

export default function TopicLectureViewer({
  lectureType,
  lectureFile,
  fileUrl,
  fileName,
  topicTitle,
  hasTextTheory,
  onShowTextTheory,
  isAdmin = false
}: TopicLectureViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);
  const [securityAlert, setSecurityAlert] = useState<string | null>(null);

  const cleanUrl = formatDocumentUrl(fileUrl);
  const displayName = fileName || lectureFile?.fileName || (lectureType === 'pdf' ? `${topicTitle}.pdf` : `${topicTitle}.pptx`);
  const isPdf = lectureType === 'pdf';

  // Security protections: anti-screenshot, block shortcuts, window blur shield
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block PrintScreen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        try {
          navigator.clipboard.writeText('BSMI ANATOMY - Himoyalangan mualliflik kontenti!');
        } catch (_) {}
        setSecurityAlert("Diqqat: Skrinshot olish cheklangan! Ushbu material mualliflik huquqi bilan himoyalangan.");
        setTimeout(() => setSecurityAlert(null), 4000);
      }

      // Block Ctrl+P (Print), Ctrl+S (Save), Ctrl+U (View source)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's' || e.key === 'u')) {
        e.preventDefault();
        setSecurityAlert("Taqdimotni saqlash yoki chop etish cheklangan.");
        setTimeout(() => setSecurityAlert(null), 3000);
      }
    };

    const handleWindowBlur = () => {
      // Screen capture tools or window switching causes blur
      setIsWindowBlurred(true);
    };

    const handleWindowFocus = () => {
      setIsWindowBlurred(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

  // Generate embed URL
  const getEmbedUrl = () => {
    if (!cleanUrl) return '';
    if (cleanUrl.startsWith('data:')) return cleanUrl;
    if (cleanUrl.includes('drive.google.com')) return cleanUrl;

    if (isPdf) {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(cleanUrl)}&embedded=true`;
    } else {
      // PPTX: Microsoft Office Web Viewer or Google Docs viewer
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(cleanUrl)}`;
    }
  };

  const embedSrc = getEmbedUrl();

  return (
    <div 
      className="space-y-6 select-none relative" 
      onContextMenu={(e) => {
        e.preventDefault();
        setSecurityAlert("Sichqonchaning o'ng tugmasi ushbu materialda xavfsizlik maqsadida cheklangan.");
        setTimeout(() => setSecurityAlert(null), 3000);
      }}
      onDragStart={(e) => e.preventDefault()}
    >
      {/* Security alert notification banner */}
      {securityAlert && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-rose-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-rose-400 animate-in fade-in slide-in-from-top-4 duration-200">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span className="text-xs font-black tracking-wide uppercase">{securityAlert}</span>
        </div>
      )}

      {/* Top Banner Card */}
      <div className={`p-6 sm:p-8 rounded-[32px] border-2 transition-all text-white shadow-xl relative overflow-hidden ${
        isPdf 
          ? 'bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 border-rose-500/30' 
          : 'bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 border-amber-500/30'
      }`}>
        {/* Ambient glow */}
        <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none ${
          isPdf ? 'bg-rose-500' : 'bg-amber-500'
        }`} />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
              isPdf ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
            }`}>
              {isPdf ? <FileCheck className="w-8 h-8" /> : <Presentation className="w-8 h-8" />}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  isPdf ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
                }`}>
                  {isPdf ? '📑 PDF Konspekt & Ma\'ruza' : '📊 PowerPoint Taqdimot (.PPTX)'}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Himoyalangan Taqdimot
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white line-clamp-1">
                {displayName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Ushbu taqdimot rasmiy anatomik o'quv materiali bo'lib, platforma ichida ko'rish uchun mo'ljallangan. Mualliflik huquqini himoya qilish maqsadida yuklab olish va nusxalash cheklangan.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {isAdmin ? (
              <a
                href={cleanUrl}
                download={displayName}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg"
              >
                <Download size={14} />
                <span>Admin: Yuklab olish</span>
              </a>
            ) : (
              <div className="px-4 py-2.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-slate-300 text-xs font-bold flex items-center gap-2">
                <Lock size={14} className="text-amber-400" />
                <span>Yuklab olish cheklangan</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
              title={isFullscreen ? "Kichiklashtirish" : "To'liq ekranda ko'rish"}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              <span className="hidden sm:inline">{isFullscreen ? "Kichik" : "Kengaytirish"}</span>
            </button>

            {hasTextTheory && onShowTextTheory && (
              <button
                type="button"
                onClick={onShowTextTheory}
                className="px-5 py-3.5 rounded-2xl bg-brand-accent hover:bg-brand-accent/90 text-brand-primary text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md font-sans"
              >
                <FileText size={16} />
                <span>Matnli darslik</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Viewer Container */}
      <div className={`transition-all duration-300 relative select-none ${
        isFullscreen 
          ? 'fixed inset-4 z-50 bg-white rounded-[32px] shadow-2xl border-4 border-slate-900/20 overflow-hidden flex flex-col' 
          : 'relative rounded-[32px] overflow-hidden border-2 border-slate-200 bg-slate-900 shadow-2xl min-h-[720px] flex flex-col'
      }`}>
        {/* Anti-Screen Capture Blur Shield */}
        {isWindowBlurred && (
          <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center text-white">
            <Lock className="w-12 h-12 text-amber-400 mb-3 animate-bounce" />
            <h3 className="text-lg font-black uppercase tracking-tight">Xavfsizlik Himoyasi Faol</h3>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Oyna faol bo'lmaganda yoki skrinshot vositasi aniqlanganda taqdimot kontenti avtomatik yashiriladi. Davom etish uchun ekranga bosing.
            </p>
          </div>
        )}

        {/* Dynamic Watermark Overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden flex flex-wrap items-center justify-center gap-24 opacity-[0.07] text-white font-black text-sm uppercase rotate-[-25deg] select-none">
          {Array.from({ length: 16 }).map((_, i) => (
            <span key={i} className="whitespace-nowrap tracking-widest">
              BSMI ANATOMY • HIMOYALANGAN TAQDIMOT • SKRINSHOT TAQIQLANADI
            </span>
          ))}
        </div>

        {isFullscreen && (
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 relative z-30">
            <span className="text-xs font-black uppercase tracking-widest text-slate-300">
              {displayName}
            </span>
            <button
              onClick={() => setIsFullscreen(false)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase text-white flex items-center gap-2"
            >
              <Minimize2 size={14} /> Chiqish
            </button>
          </div>
        )}

        <div className="flex-1 w-full h-full relative min-h-[720px] bg-slate-900">
          {cleanUrl.startsWith('data:application/pdf') ? (
            <object
              data={cleanUrl}
              type="application/pdf"
              className="w-full h-full min-h-[720px]"
            >
              <div className="flex flex-col items-center justify-center h-full p-12 text-center text-white">
                <FileCheck className="w-16 h-16 text-rose-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">PDF Konspekt ko'ruvchisi</h3>
                <p className="text-slate-400 text-sm max-w-md mb-6">
                  Ushbu PDF konspekt himoyalangan ko'rinishda taqdim etilmoqda.
                </p>
              </div>
            </object>
          ) : (
            <iframe
              src={embedSrc}
              className="w-full h-full min-h-[720px] border-0 bg-white"
              title={displayName}
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          )}

          {/* Security strip at bottom */}
          <div className="bg-slate-950 p-4 px-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 relative z-30">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {isPdf ? "PDF Konspekt o'quv rejimida yuklandi" : "PowerPoint slaydlar interaktiv rejimda yuklandi"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-semibold">
              <Lock size={12} className="text-amber-500" />
              <span>Mualliflik huquqi himoyasi: Nusxalash va skrinshot cheklangan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
