import React from 'react';
import { BookOpen, ExternalLink, Bookmark, User, Calendar, FileText, Globe, GraduationCap } from 'lucide-react';
import { TopicReference } from '../types';

interface TopicReferencesViewerProps {
  topicTitle: string;
  topicId: string;
  references?: TopicReference[];
  semester?: number;
}

const DEFAULT_RECOMMENDED_REFERENCES: TopicReference[] = [
  {
    id: 'ref-default-1',
    title: "Odam Anatomiyasi (I-II jildlar)",
    authors: "Ahmedov N.K.",
    year: "Toshkent: «Ibn Sino», 2021",
    type: "textbook",
    pages: "Mavzuga oid tegishli bob va bo'limlar",
    note: "Tibbiyot oliy o'quv yurtlari talabalari uchun asosiy rasmiy darslik."
  },
  {
    id: 'ref-default-2',
    title: "Атлас анатомии человека (в 4-х томах)",
    authors: "Синельников Р.Д., Синельников Я.Р.",
    year: "Москва: «Новая Волна», 2020",
    type: "atlas",
    pages: "Illyustratsiyalar va sxematik jadvallar",
    note: "Xalqaro anatomik nomenklatura (Terminologia Anatomica) asosidagi fundamental atlas."
  },
  {
    id: 'ref-default-3',
    title: "Gray's Anatomy for Students (4th Edition)",
    authors: "Richard L. Drake, A. Wayne Vogl, Adam W. M. Mitchell",
    year: "Elsevier, 2020",
    type: "textbook",
    pages: "Regional anatomy & clinical correlations",
    note: "Xalqaro standartdagi eng mashhur klinik va regional anatomiya darsligi."
  },
  {
    id: 'ref-default-4',
    title: "Sobotta Atlas of Human Anatomy",
    authors: "Friedrich Paulsen, Jens Waschke",
    year: "Urban & Fischer, 16th ed.",
    type: "atlas",
    pages: "Topografik va klinik illyustratsiyalar",
    note: "Klinik amaliyot va operatsion anatomiya bo'yicha etalon qo'llanma."
  }
];

export default function TopicReferencesViewer({
  topicTitle,
  references,
  semester
}: TopicReferencesViewerProps) {
  // Use custom references if provided, otherwise default reputable references
  const effectiveReferences: TopicReference[] = (references && references.length > 0)
    ? references
    : DEFAULT_RECOMMENDED_REFERENCES;

  const getTypeBadge = (type?: string) => {
    switch (type) {
      case 'textbook':
        return { label: "Asosiy Darslik", color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'atlas':
        return { label: "Anatomik Atlas", color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'article':
        return { label: "Ilmiy Maqola", color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'manual':
        return { label: "O'quv-Uslubiy Qo'llanma", color: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'online':
        return { label: "Elektron Resurs", color: 'bg-sky-50 text-sky-700 border-sky-200' };
      default:
        return { label: "Adabiyot", color: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-[28px] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 bg-white/10 rounded-xl text-brand-accent backdrop-blur-md">
              <BookOpen className="w-5 h-5" />
            </span>
            <span className="text-xs font-black uppercase tracking-widest text-brand-accent">
              Bibliografiya & Manbalar
            </span>
          </div>
          <h3 className="text-2xl font-black tracking-tight text-white">
            {topicTitle} — Foydalanilgan Adabiyotlar
          </h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Mavzuni to'liq va mukammal o'zlashtirish uchun foydalanilgan asosiy darsliklar, nufuzli anatomik atlaslar, klinik qo'llanmalar va xalqaro manbalar ro'yxati.
          </p>
        </div>
      </div>

      {/* References Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {effectiveReferences.map((ref, idx) => {
          const typeInfo = getTypeBadge(ref.type);
          return (
            <div
              key={ref.id || idx}
              className="p-6 sm:p-7 bg-white rounded-3xl border border-brand-border hover:border-brand-accent/60 shadow-xs hover:shadow-md transition-all group relative"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  {/* Type Badge & Index */}
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-black rounded-md">
                      #{idx + 1}
                    </span>
                    <span className={`px-3 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md border ${typeInfo.color}`}>
                      {typeInfo.label}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {ref.title}
                  </h4>

                  {/* Authors & Year */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600 font-semibold pt-1">
                    {ref.authors && (
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{ref.authors}</span>
                      </span>
                    )}
                    {ref.year && (
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{ref.year}</span>
                      </span>
                    )}
                    {ref.pages && (
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Bookmark className="w-3.5 h-3.5 text-amber-500" />
                        <span>{ref.pages}</span>
                      </span>
                    )}
                  </div>

                  {/* Note / Description */}
                  {ref.note && (
                    <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-100 italic">
                      {ref.note}
                    </p>
                  )}
                </div>

                {/* External Link if present */}
                {ref.link && (
                  <a
                    href={ref.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-start px-4 py-2.5 bg-slate-50 hover:bg-indigo-50 text-indigo-600 border border-slate-200 hover:border-indigo-200 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <span>Manbani Ochish</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Advisory Card */}
      <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-3xl flex items-start gap-4">
        <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-sm shrink-0">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-black uppercase tracking-wider text-indigo-950">
            Kafedra va Dastur Tavsiyasi
          </h4>
          <p className="text-xs font-medium text-slate-600 leading-relaxed">
            Ushbu adabiyotlar O'zbekiston Respublikasi Sog'liqni saqlash vazirligi va Toshkent/Buxoro Davlat Tibbiyot Institutlari Odam Anatomiyasi kafedrasining amaldagi o'quv dasturiga muvofiq tuzilgan.
          </p>
        </div>
      </div>
    </div>
  );
}
