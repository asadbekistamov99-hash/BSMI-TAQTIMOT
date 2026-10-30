import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Presentation as PresentationIcon, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Download, 
  ExternalLink, 
  BookOpen, 
  Layers, 
  Sparkles,
  Stethoscope,
  CheckCircle2
} from 'lucide-react';
import { Topic } from '../types';
import { PresentationViewer } from './PresentationViewer';

interface TopicPresentationSectionProps {
  topic: Topic;
  topicTitle?: string;
  theoryText?: string;
}

export default function TopicPresentationSection({
  topic,
  topicTitle: customTitle,
  theoryText: customTheory
}: TopicPresentationSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const topicTitle = customTitle || (typeof topic.title === 'string' ? topic.title : (topic.title as any)?.uz || 'Anatomiya Taqdimoti');
  const theoryText = customTheory || (typeof topic.theory === 'string' ? topic.theory : (topic.theory as any)?.uz || '');

  // Check if topic has an uploaded presentation file
  const customFile = topic.customLectureFile;
  const presentationFileUrl = customFile?.fileUrl || topic.pptxUrl || topic.pdfUrl;
  const fileType: 'pptx' | 'pdf' = customFile?.fileType || (topic.pptxUrl ? 'pptx' : 'pdf');

  // If there's an uploaded presentation file, render the full PresentationViewer
  if (presentationFileUrl) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-200/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center">
              <PresentationIcon className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h4 className="text-xs font-black text-amber-950 uppercase tracking-tight">
                Rasmiy Taqdimot Darsligi
              </h4>
              <p className="text-[11px] text-amber-800/80 font-medium">
                {customFile?.fileName || `${topicTitle}.pptx`}
              </p>
            </div>
          </div>

          <Link
            to={`/presentation?topicId=${topic.id}&semester=${topic.semester}&order=${topic.order}`}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <span>Katta ekranda ochish</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900 min-h-[500px]">
          <PresentationViewer
            fileUrl={presentationFileUrl}
            fileType={fileType}
            title={topicTitle}
            semester={topic.semester}
            order={topic.order}
            canAnnotate={true}
          />
        </div>
      </div>
    );
  }

  // Built-in intelligent slide deck generated from topic content
  const cleanTheory = theoryText.replace(/^#+\s+/gm, '').trim();
  const paragraphs = cleanTheory.split(/\n\n+/).filter(p => p.trim().length > 30);

  const slides = [
    {
      id: 1,
      badge: "KIRISH VA UMUMIY TUSHUNCHA",
      title: topicTitle,
      subtitle: `Buxoro Davlat Tibbiyot Instituti • ${topic.semester}-Semestr`,
      content: paragraphs[0] || `${topicTitle} anatomiyasining asosiy xususiyatlari, lokalizatsiyasi va odam tanasidagi tayanch-harakat hamda funksional ahamiyati.`,
      points: [
        "Mavzuning maqsadi: topografik va tizimli anatomiyani to'liq o'zlashtirish",
        "Xalqaro lotin terminologiyasini mustahkamlash",
        "Klinik amaliyotda uchraydigan holatlar bilan bog'lash"
      ],
      color: "from-amber-600 via-orange-600 to-amber-700"
    },
    {
      id: 2,
      badge: "ANATOMIK TUZILISH VA MORFOLOGIYA",
      title: "Asosiy Morfologik Qismlari",
      subtitle: "Yuzalari, qirralari va muhim relifi",
      content: paragraphs[1] || `${topicTitle}ning barcha yuzalari, teshiklari, o'simtalari va chegaralari aniq anatomik mezonlar bo'yicha tahlil qilinadi.`,
      points: [
        "Suyak va to'qimalarning hosil qiluvchi elementlari",
        "Bo'g'im yuzalari va birikish sohalari",
        "Relifdagi asosiy chuqurchalar va egatlar"
      ],
      color: "from-blue-600 via-indigo-600 to-blue-700"
    },
    {
      id: 3,
      badge: "TOPOGRAFIYA VA QON TA'MINOTI",
      title: "Topografik Anatomiya",
      subtitle: "Sintopiya, skeletotopiya va qon-tomir ta'minoti",
      content: paragraphs[2] || `Qo'shni a'zolar bilan munosabati, arteriyalar orqali oziqlanishi hamda venoz va limfatik oqim yo'nalishlari.`,
      points: [
        "Magistral oziqlantiruvchi arteriyalar",
        "Venoz qon oqimi va venoz chigallar",
        "Innervatsiyani ta'minlovchi nerv tolalari"
      ],
      color: "from-emerald-600 via-teal-600 to-emerald-700"
    },
    {
      id: 4,
      badge: "KLINIK KORRELYATSIYA",
      title: "Klinik Ahamiyati va Amaliyot",
      subtitle: "Patologiyalar, travmalar va diagnostika",
      content: paragraphs[3] || `${topicTitle} sohasida uchraydigan eng ko'p klinik kasalliklar, sinishlar, nerv siqilishi va jarrohlik yondashuvlari.`,
      points: [
        "Eng ko'p uchraydigan shikastlanish turlari",
        "Rentgen, MRT va KT tekshiruvlaridagi ko'rinishi",
        "Differensial diagnostika asoslari"
      ],
      color: "from-rose-600 via-red-600 to-rose-700"
    },
    {
      id: 5,
      badge: "XULOSA VA IMTIHON KALITLARI",
      title: "Muhim Xulosalar",
      subtitle: "Talaba yodda saqlashi shart bo'lgan 3 ta fakt",
      content: `Darsni yakunlashda talaba ${topicTitle}ning barcha lotincha nomlarini erkin ayta olishi va sxemada ko'rsata bilishi talab etiladi.`,
      points: [
        "Lotincha terminlar ro'yxatini to'liq takrorlash",
        "3D modelda a'zoni fazoviy aylantirib o'rganish",
        "Mavzudan so'ng interaktiv testlarni bajarish"
      ],
      color: "from-purple-600 via-indigo-600 to-purple-700"
    }
  ];

  const current = slides[currentSlide];

  return (
    <div className="space-y-6">
      {/* Top Banner with Actions */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 text-white text-xs font-black uppercase tracking-wider mb-2">
            <PresentationIcon className="w-3.5 h-3.5" />
            <span>Mavzu Taqdimot Slaydlari</span>
          </div>
          <h3 className="text-xl font-black">{topicTitle}</h3>
          <p className="text-xs text-white/80 mt-0.5">
            Dars ma'ruzasini ko'rgazmali slaydlar formatida o'rganing.
          </p>
        </div>

        <Link
          to={`/presentation?topicId=${topic.id}&semester=${topic.semester}&order=${topic.order}`}
          className="px-5 py-3 rounded-2xl bg-white text-slate-900 font-black text-xs uppercase tracking-wider hover:bg-slate-100 transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <span>Taqdimot Rejimi</span>
          <ExternalLink className="w-4 h-4 text-amber-600" />
        </Link>
      </div>

      {/* Slide Display Card */}
      <div className="bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative text-white min-h-[460px] flex flex-col justify-between">
        {/* Slide Header */}
        <div className={`p-6 md:p-8 bg-gradient-to-r ${current.color} flex items-start justify-between gap-4 transition-all duration-300`}>
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-white/80 bg-black/20 px-2.5 py-1 rounded-full">
              {current.badge}
            </span>
            <h2 className="text-xl md:text-2xl font-black text-white pt-2 leading-tight">
              {current.title}
            </h2>
            <p className="text-xs text-white/80 font-medium">
              {current.subtitle}
            </p>
          </div>

          <span className="px-3 py-1.5 rounded-xl bg-black/30 backdrop-blur-md text-xs font-black tracking-wider text-white">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>

        {/* Slide Content Body */}
        <div className="p-6 md:p-8 space-y-6 flex-1 flex flex-col justify-center">
          <p className="text-sm md:text-base text-slate-300 leading-relaxed font-normal">
            {current.content}
          </p>

          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
            <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Asosiy qoidalar
            </h4>
            <div className="space-y-2">
              {current.points.map((pt, pIdx) => (
                <div key={pIdx} className="flex items-start gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slide Navigation Footer */}
        <div className="p-4 md:p-6 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
            disabled={currentSlide === 0}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Oldingi slayd</span>
          </button>

          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  currentSlide === idx 
                    ? 'w-8 bg-amber-500' 
                    : 'w-2.5 bg-slate-700 hover:bg-slate-600'
                }`}
                title={`Slayd ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
            disabled={currentSlide === slides.length - 1}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-30 disabled:pointer-events-none text-slate-950 text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer"
          >
            <span className="hidden sm:inline">Keyingi slayd</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
