import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Maximize2, ExternalLink, Box, Sparkles, Compass, RotateCcw, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import '@google/model-viewer';
import { AnatomyModel, AnatomySystem } from '../data/anatomyModels';

const ModelViewer = 'model-viewer' as any;

interface TopicModelViewerModalProps {
  model: AnatomyModel | null;
  isOpen: boolean;
  onClose: () => void;
  language?: string;
}

const SYSTEM_META: Record<AnatomySystem, { label: Record<string, string>; color: string; badge: string }> = {
  bone: {
    label: { uz: 'Suyaklar (Osteologiya)', ru: 'Кости (Остеология)', en: 'Bones (Osteology)' },
    color: 'text-amber-600',
    badge: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
  },
  muscle: {
    label: { uz: 'Muskullar (Miologiya)', ru: 'Мышцы (Миология)', en: 'Muscles (Myology)' },
    color: 'text-rose-600',
    badge: 'bg-rose-500/10 text-rose-600 border-rose-500/30',
  },
  organ: {
    label: { uz: "Ichki a'zolar (Splanjnologiya)", ru: 'Внутренние органы (Спланхнология)', en: 'Internal Organs (Splanchnology)' },
    color: 'text-emerald-600',
    badge: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
  },
  nerve: {
    label: { uz: 'Nerv tizimi (Nevrologiya)', ru: 'Нервная система (Неврология)', en: 'Nervous System (Neurology)' },
    color: 'text-sky-600',
    badge: 'bg-sky-500/10 text-sky-600 border-sky-500/30',
  },
  vessel: {
    label: { uz: 'Qon tomirlar (Angiologiya)', ru: 'Сосудистая система (Ангиология)', en: 'Vascular System (Angiology)' },
    color: 'text-red-600',
    badge: 'bg-red-500/10 text-red-600 border-red-500/30',
  },
  other: {
    label: { uz: 'Umumiy Anatomiya', ru: 'Общая Анатомия', en: 'General Anatomy' },
    color: 'text-indigo-600',
    badge: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/30',
  },
};

export default function TopicModelViewerModal({
  model,
  isOpen,
  onClose,
  language = 'uz',
}: TopicModelViewerModalProps) {
  const lang = (language === 'ru' || language === 'en' ? language : 'uz') as 'uz' | 'ru' | 'en';

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !model) return null;

  const getLocalized = (obj: any): string => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj.uz || obj.en || obj.ru || '';
  };

  const title = getLocalized(model.title);
  const description = getLocalized(model.description);
  const sysMeta = SYSTEM_META[model.system] || SYSTEM_META.other;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[120] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      >
        <motion.div
          initial={{ scale: 0.94, y: 16, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.94, y: 16, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-slate-900 border border-slate-800 rounded-[32px] w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        >
          {/* Top Bar / Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-950/60">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-10 h-10 rounded-2xl bg-brand-accent/20 border border-brand-accent/40 text-brand-accent flex items-center justify-center shrink-0 shadow-lg shadow-brand-accent/10">
                <Box className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug truncate">
                    {title}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider border ${sysMeta.badge}`}>
                    {sysMeta.label[lang]}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                  <Sparkles className="w-3 h-3 text-brand-accent shrink-0" />
                  {lang === 'uz'
                    ? "Interaktiv 3D model — sichqoncha yoki barmog'ingiz bilan 360° aylantiring va yaqinlashtiring"
                    : lang === 'ru'
                    ? 'Интерактивная 3D-модель — вращайте на 360° и приближайте пальцем или мышью'
                    : 'Interactive 3D model — rotate 360° and zoom with mouse or touch'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-3">
              <Link
                to={`/models?model=${encodeURIComponent(model.id)}`}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all"
                title={lang === 'uz' ? "Modellar katalogida to'liq ochish" : lang === 'ru' ? 'Открыть в каталоге 3D' : 'Open in 3D Catalog'}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{lang === 'uz' ? 'Katalogda ochish' : lang === 'ru' ? 'В каталог' : 'Catalog'}</span>
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title={lang === 'uz' ? 'Yopish' : lang === 'ru' ? 'Закрыть' : 'Close'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 3D Viewer Area */}
          <div className="relative flex-grow bg-slate-950 w-full min-h-[420px] sm:min-h-[520px] max-h-[66vh] overflow-hidden flex items-center justify-center">
            {model.fileUrl ? (
              <div className="w-full h-full relative flex items-center justify-center bg-slate-950">
                <ModelViewer
                  src={model.fileUrl}
                  alt={title}
                  auto-rotate
                  camera-controls
                  touch-action="pan-y"
                  shadow-intensity="1.2"
                  exposure="1.0"
                  style={{ width: '100%', height: '100%', minHeight: '440px', backgroundColor: '#020617' }}
                />
                <div className="absolute bottom-3 left-3 pointer-events-none bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] text-white/70 font-semibold flex items-center gap-1.5">
                  <RotateCcw className="w-3 h-3 text-brand-accent animate-spin" style={{ animationDuration: '8s' }} />
                  <span>360° Interaktiv 3D</span>
                </div>
              </div>
            ) : model.embedUrl ? (
              <iframe
                title={title}
                src={model.embedUrl}
                className="w-full h-full border-0 min-h-[440px]"
                allow="autoplay; fullscreen; xr-spatial-tracking"
                allowFullScreen
              />
            ) : (
              <div className="text-center p-8 text-slate-500">
                <Box className="w-12 h-12 mx-auto mb-3 opacity-40 text-brand-accent" />
                <p className="text-xs font-semibold">
                  {lang === 'uz' ? "3D model havolasi yuklanmoqda..." : "3D модель загружается..."}
                </p>
              </div>
            )}
          </div>

          {/* Footer Details */}
          <div className="px-6 py-4 bg-slate-900 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="min-w-0 flex-1">
              {description && (
                <p className="text-slate-300 text-xs font-normal line-clamp-2 leading-relaxed">
                  {description}
                </p>
              )}
              <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1 flex-wrap">
                {model.author && (
                  <span>
                    <strong className="text-slate-300">
                      {lang === 'uz' ? 'Muallif: ' : lang === 'ru' ? 'Автор: ' : 'Author: '}
                    </strong>
                    {model.author}
                  </span>
                )}
                {model.source && (
                  <span>
                    <strong className="text-slate-300">
                      {lang === 'uz' ? 'Manba: ' : lang === 'ru' ? 'Источник: ' : 'Source: '}
                    </strong>
                    {model.source}
                  </span>
                )}
                {model.license && (
                  <span className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded text-[9px] font-mono">
                    {model.license}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <Link
                to={`/models?model=${encodeURIComponent(model.id)}`}
                className="px-4 py-2.5 rounded-xl bg-brand-accent hover:bg-brand-accent/90 text-brand-primary text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg shadow-brand-accent/20"
              >
                <span>{lang === 'uz' ? "To'liq Atlasda ko'rish" : lang === 'ru' ? 'Смотреть в Атласе' : 'View in Atlas'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
              >
                {lang === 'uz' ? 'Yopish' : lang === 'ru' ? 'Закрыть' : 'Close'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
