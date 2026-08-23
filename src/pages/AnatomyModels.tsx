import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, X, Box, Heart, Activity, Zap, GitBranch, Bone, Layers, Maximize2,
  ExternalLink, ShieldCheck, Plus, Upload, Download, Trash2, Pencil, Save,
  MapPin, Sparkles, Filter, AlertTriangle, RotateCcw,
} from 'lucide-react';
import '@google/model-viewer';
import { useLanguage } from '../hooks/useLanguage';
import {
  ANATOMY_MODELS, SEED_MODELS, SYSTEM_META, REGION_META, getSystemMeta,
  type AnatomyModel, type AnatomySystem, type AnatomyModelPin,
} from '../data/anatomyModels';
import Anatomy3DSuite from '../components/Anatomy3DSuite';
import { dbService } from '../lib/dbService';
import SEO from '../components/SEO';

// Premium 3D Generated System Backdrops
import skeletalBackdrop from '../assets/images/skeletal_system_backdrop_1783853676839.jpg';
import muscularBackdrop from '../assets/images/muscular_system_backdrop_1783853695747.jpg';
import organsBackdrop from '../assets/images/internal_organs_backdrop_1783853721565.jpg';
import nervousBackdrop from '../assets/images/nervous_system_backdrop_1783853738336.jpg';
import circulatoryBackdrop from '../assets/images/circulatory_system_backdrop_1783853755670.jpg';

const SYSTEM_BACKDROPS: Record<string, string> = {
  bone: skeletalBackdrop,
  muscle: muscularBackdrop,
  organ: organsBackdrop,
  nerve: nervousBackdrop,
  vessel: circulatoryBackdrop,
  other: organsBackdrop,
};

const CUSTOM_KEY = 'anatomy_models_custom_v1';

// lucide ikonka nomlarini komponentlarga bog'lash
const ICONS: Record<string, any> = { Bone, Activity, Heart, Zap, GitBranch, Box };

// ---------------------------------------------------------------------------
// localStorage yordamchilar (admin qo'shgan modellar shu yerda saqlanadi)
// ---------------------------------------------------------------------------
function loadCustomModels(): AnatomyModel[] {
  try {
    const raw = localStorage.getItem(CUSTOM_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
function saveCustomModels(models: AnatomyModel[]) {
  try {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(models));
  } catch (e) {
    console.error('Custom modellarni saqlashda xato:', e);
  }
}

// Barcha manbalarni birlashtirish (custom static'ni ustunlik bilan almashtiradi)
function mergeModels(custom: AnatomyModel[]): AnatomyModel[] {
  const map = new Map<string, AnatomyModel>();
  [...ANATOMY_MODELS, ...SEED_MODELS].forEach((m) => {
    if (m && m.id) map.set(m.id, m);
  });
  custom.forEach((m) => {
    if (m && m.id) {
      if ((m as any).deleted) {
        map.delete(m.id);
      } else {
        map.set(m.id, m);
      }
    }
  });
  return Array.from(map.values());
}

const emptyModel = (): AnatomyModel => ({
  id: '',
  title: { uz: '', ru: '', en: '' },
  description: { uz: '', ru: '', en: '' },
  system: 'organ',
  region: 'other',
  embedUrl: '',
  fileUrl: '',
  thumbnail: '',
  source: '',
  sourceUrl: '',
  license: '',
  author: '',
  tags: [],
  pins: [],
});

export default function AnatomyModels({ isAdmin: isAdminProp }: { isAdmin?: boolean; user?: any }) {
  const { language } = useLanguage();
  const isAdmin = isAdminProp ?? !!sessionStorage.getItem('adminToken');
  const lang = language as 'uz' | 'ru' | 'en';

  const [custom, setCustom] = useState<AnatomyModel[]>(() => loadCustomModels());
  const [search, setSearch] = useState('');
  const [activeSystem, setActiveSystem] = useState<AnatomySystem | 'all'>('all');
  const [activeRegion, setActiveRegion] = useState<string>('all');
  const [selected, setSelected] = useState<AnatomyModel | null>(null);
  const [launch3D, setLaunch3D] = useState<AnatomyModel | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [dbLoading, setDbLoading] = useState(true);

  useEffect(() => {
    async function fetchModels() {
      try {
        const models = await dbService.getAnatomyModels();
        if (models && models.length > 0) {
          setCustom(models);
          // cache in local storage
          try {
            localStorage.setItem(CUSTOM_KEY, JSON.stringify(models));
          } catch (e) {}
        }
      } catch (err) {
        console.error("Modellarni yuklashda xatolik:", err);
      } finally {
        setDbLoading(false);
      }
    }
    fetchModels();
  }, []);

  const allModels = useMemo(() => mergeModels(custom), [custom]);

  const tr = (obj: Record<string, string> | undefined, fallback = '') =>
    obj ? obj[lang] || obj.uz || obj.en || obj.ru || fallback : fallback;

  // Filtrlash
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allModels.filter((m) => {
      if (activeSystem !== 'all' && m.system !== activeSystem) return false;
      if (activeRegion !== 'all' && m.region !== activeRegion) return false;
      if (!q) return true;
      const hay = [
        tr(m.title), m.title?.uz, m.title?.ru, m.title?.en,
        tr(m.description), (m.tags || []).join(' '), m.author, m.source,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }, [allModels, search, activeSystem, activeRegion, lang]);

  // Har bir tizim uchun soni
  const counts = useMemo(() => {
    const c: Record<string, number> = { all: allModels.length };
    SYSTEM_META.forEach((s) => (c[s.id] = allModels.filter((m) => m.system === s.id).length));
    return c;
  }, [allModels]);

  const persistCustom = (next: AnatomyModel[]) => {
    setCustom(next);
    saveCustomModels(next);
  };

  const T = {
    title: { uz: '3D Anatomiya Modellari', ru: '3D Модели анатомии', en: '3D Anatomy Models' }[lang],
    desc: {
      uz: "Organlar, muskullar, suyaklar, nervlar va qon tomirlarning interaktiv 3D modellari to'plami. Modelni tanlab, aylantiring, kattalashtiring va o'rganing.",
      ru: 'Коллекция интерактивных 3D-моделей органов, мышц, костей, нервов и сосудов. Выберите модель, вращайте, увеличивайте и изучайте.',
      en: 'A collection of interactive 3D models of organs, muscles, bones, nerves and vessels. Pick a model, rotate, zoom and explore.',
    }[lang],
    searchPh: { uz: 'Model qidirish (yurak, suyak, nerv...)', ru: 'Поиск модели (сердце, кость, нерв...)', en: 'Search models (heart, bone, nerve...)' }[lang],
    all: { uz: 'Barchasi', ru: 'Все', en: 'All' }[lang],
    empty: { uz: 'Hech qanday model topilmadi.', ru: 'Модели не найдены.', en: 'No models found.' }[lang],
    view: { uz: "3D ko'rish", ru: 'Смотреть 3D', en: 'View 3D' }[lang],
    region: { uz: 'Soha', ru: 'Область', en: 'Region' }[lang],
    admin: { uz: 'Admin: modellarni boshqarish', ru: 'Админ: управление', en: 'Admin: manage models' }[lang],
  };

  // Anatomy3DSuite uchun entry shakliga o'tkazish
  const toSuiteEntry = (m: AnatomyModel) => ({
    id: m.id,
    latinName: m.title.en || m.title.uz,
    uzbekName: m.title.uz,
    russianName: m.title.ru,
    englishName: m.title.en,
    image: m.thumbnail || '',
    pins: m.pins || [],
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <SEO 
        title="3D Anatomiya Modellari va Interaktiv Atlas | BSMI Anatomy"
        description="Organlar, muskullar, suyaklar, nervlar va qon tomirlarning interaktiv 3D modellari to'plami. 3D formatda aylantiring, pinlarni o'rganing va test topshiring."
        keywords="3d anatomiya, anatomiya modellari, interaktiv atlas, 3d organlar, skelet 3d, muskullar 3d"
      />
      {/* Hero */}
      <div className="bg-gradient-to-b from-brand-primary to-slate-900 text-white">
        <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 bg-brand-accent/15 text-brand-accent border border-brand-accent/30 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <Box className="w-3 h-3" /> 3D ATLAS
            </span>
            {isAdmin && (
              <button
                onClick={() => setShowAdmin((v) => !v)}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Pencil className="w-3 h-3" /> {T.admin}
              </button>
            )}
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tighter leading-none">{T.title}</h1>
          <p className="text-white/60 text-sm sm:text-base font-semibold mt-4 max-w-2xl leading-relaxed">{T.desc}</p>

          {/* Search */}
          <div className="mt-8 relative max-w-xl">
            <Search className="w-5 h-5 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={T.searchPh}
              className="w-full bg-white/10 border border-white/15 focus:border-brand-accent/60 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-semibold text-white placeholder-white/40 outline-none transition-all backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-30 bg-slate-50/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">
          {/* System chips */}
          <div className="flex flex-wrap gap-2">
            <FilterChip
              active={activeSystem === 'all'}
              onClick={() => setActiveSystem('all')}
              label={T.all}
              count={counts.all}
              activeClass="bg-brand-primary text-white border-brand-primary"
            />
            {SYSTEM_META.map((s) => {
              const Icon = ICONS[s.icon] || Box;
              return (
                <FilterChip
                  key={s.id}
                  active={activeSystem === s.id}
                  onClick={() => setActiveSystem(s.id)}
                  label={s.label[lang]}
                  count={counts[s.id] || 0}
                  icon={<Icon className="w-3.5 h-3.5" />}
                  activeClass={s.ring}
                />
              );
            })}
          </div>

          {/* Region select */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{T.region}:</span>
            <select
              value={activeRegion}
              onChange={(e) => setActiveRegion(e.target.value)}
              className="text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-brand-accent cursor-pointer"
            >
              <option value="all">{T.all}</option>
              {REGION_META.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label[lang]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Admin panel */}
      {isAdmin && showAdmin && (
        <AdminPanel
          lang={lang}
          custom={custom}
          allModels={allModels}
          onPersist={persistCustom}
          onClose={() => setShowAdmin(false)}
        />
      )}

      {/* Grid */}
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <Box className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400 font-bold">{T.empty}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((m) => (
              <ModelCard key={m.id} model={m} lang={lang} onOpen={() => setSelected(m)} tr={tr} />
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <DetailModal
            model={selected}
            lang={lang}
            tr={tr}
            onClose={() => setSelected(null)}
            onLaunch3D={() => {
              setLaunch3D(selected);
              setSelected(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Full-screen GLB 3D suite */}
      {launch3D && launch3D.fileUrl && (
        <Anatomy3DSuite
          src={launch3D.fileUrl || ''}
          alt={tr(launch3D.title)}
          initialEntry={toSuiteEntry(launch3D)}
          onBack={() => setLaunch3D(null)}
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Filter chip
// ---------------------------------------------------------------------------
function FilterChip({
  active, onClick, label, count, icon, activeClass,
}: {
  active: boolean; onClick: () => void; label: string; count: number; icon?: React.ReactNode; activeClass: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wide border transition-all cursor-pointer ${
        active ? activeClass + ' shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
      }`}
    >
      {icon}
      {label}
      <span className={`ml-0.5 px-1.5 py-0.5 rounded-md text-[9px] ${active ? 'bg-white/25' : 'bg-slate-100 text-slate-400'}`}>
        {count}
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Model card
// ---------------------------------------------------------------------------
function ModelCard({
  model, lang, onOpen, tr,
}: {
  model: AnatomyModel; lang: 'uz' | 'ru' | 'en'; onOpen: () => void; tr: (o: any, f?: string) => string;
}) {
  const sm = getSystemMeta(model.system);
  const Icon = ICONS[sm.icon] || Box;
  const [imgOk, setImgOk] = useState(true);
  const systemBackdrop = SYSTEM_BACKDROPS[model.system] || SYSTEM_BACKDROPS.other;

  return (
    <motion.button
      layout
      onClick={onOpen}
      className="group text-left bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden hover:border-brand-accent/50 hover:shadow-2xl hover:shadow-slate-950 transition-all cursor-pointer flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden w-full">
        {/* Glowing 3D System Backdrop Base Layer */}
        <img
          src={systemBackdrop}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        {/* Tech subtle vignette & radial depth gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/20" />

        {model.thumbnail && imgOk ? (
          <img
            src={model.thumbnail}
            alt={tr(model.title)}
            onError={() => setImgOk(false)}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-contain p-3.5 z-10 group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl">
              <Icon className="w-7 h-7 text-white" />
            </div>
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-1.5 z-20">
          <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${sm.badge} flex items-center gap-1 backdrop-blur-sm bg-white/5`}>
            <Icon className="w-3 h-3" /> {sm.label[lang]}
          </span>
        </div>
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <span className="px-2.5 py-1.5 bg-brand-accent text-brand-primary rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg">
            <Maximize2 className="w-3 h-3" /> {model.fileUrl && !model.embedUrl ? 'GLB' : '3D'}
          </span>
        </div>
      </div>
      {/* Body */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-sm font-black text-brand-primary leading-tight line-clamp-2">{tr(model.title)}</h3>
        {tr(model.description) && (
          <p className="text-[11px] text-slate-400 font-semibold mt-1.5 line-clamp-2 leading-relaxed">{tr(model.description)}</p>
        )}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          {model.license ? (
            <span className="text-[9px] font-black uppercase tracking-wider text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> {model.license}
            </span>
          ) : (
            <span />
          )}
          {model.pins && model.pins.length > 0 && (
            <span className="text-[9px] font-black uppercase tracking-wider text-violet-500 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {model.pins.length}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// Detail modal (embed → iframe, glb → 3D suite tugmasi)
// ---------------------------------------------------------------------------
function DetailModal({
  model, lang, tr, onClose, onLaunch3D,
}: {
  model: AnatomyModel; lang: 'uz' | 'ru' | 'en'; tr: (o: any, f?: string) => string; onClose: () => void; onLaunch3D: () => void;
}) {
  const sm = getSystemMeta(model.system);
  const Icon = ICONS[sm.icon] || Box;
  const isGlb = !!model.fileUrl && !model.embedUrl;
  const systemBackdrop = SYSTEM_BACKDROPS[model.system] || SYSTEM_BACKDROPS.other;
  const L = {
    open3d: { uz: "To'liq ekranda 3D ochish", ru: 'Открыть 3D на весь экран', en: 'Open 3D fullscreen' }[lang],
    source: { uz: 'Manba', ru: 'Источник', en: 'Source' }[lang],
    license: { uz: 'Litsenziya', ru: 'Лицензия', en: 'License' }[lang],
    author: { uz: 'Muallif', ru: 'Автор', en: 'Author' }[lang],
    pins: { uz: 'Anatomik belgilar', ru: 'Анатомические метки', en: 'Anatomical labels' }[lang],
    embedNote: {
      uz: "Bu model tashqi platformada (iframe) ko'rsatilmoqda. Sichqoncha bilan aylantiring va kattalashtiring.",
      ru: 'Модель показана во внешней платформе (iframe). Вращайте и масштабируйте мышью.',
      en: 'This model is shown via an external platform (iframe). Rotate and zoom with your mouse.',
    }[lang],
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 12 }}
        className="bg-white rounded-[28px] w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-100">
          <div className="flex items-start gap-3 min-w-0">
            <span className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${sm.badge}`}>
              <Icon className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <h2 className="text-lg font-black text-brand-primary tracking-tight leading-tight truncate">{tr(model.title)}</h2>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${sm.badge}`}>
                {sm.label[lang]}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all cursor-pointer shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewer */}
        <div className="flex-grow overflow-y-auto">
          <div className="relative bg-slate-900 aspect-video w-full">
            {model.embedUrl ? (
              <iframe
                title={tr(model.title)}
                src={model.embedUrl}
                className="w-full h-full border-0"
                allow="autoplay; fullscreen; xr-spatial-tracking"
                allowFullScreen
              />
            ) : isGlb ? (
              <button
                onClick={onLaunch3D}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 group cursor-pointer overflow-hidden bg-slate-950"
              >
                {/* Immersive 3D Backdrop Base */}
                <img
                  src={systemBackdrop}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/40" />

                {model.thumbnail ? (
                  <div className="relative z-10 w-44 h-44 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-3 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                    <img src={model.thumbnail} alt="" referrerPolicy="no-referrer" className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="relative z-10 w-24 h-24 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-500">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                )}
                
                <div className="relative z-10 flex flex-col items-center gap-2 mt-2">
                  <div className="w-14 h-14 rounded-full bg-brand-accent text-brand-primary flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                    <Maximize2 className="w-6 h-6" />
                  </div>
                  <span className="text-white/90 font-black uppercase tracking-widest text-[10px] mt-1">{L.open3d}</span>
                </div>
              </button>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white/40">
                <AlertTriangle className="w-8 h-8" />
              </div>
            )}
          </div>

          <div className="p-5 space-y-5">
            {model.embedUrl && (
              <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-accent" /> {L.embedNote}
              </p>
            )}

            {tr(model.description) && (
              <p className="text-sm text-slate-600 font-medium leading-relaxed">{tr(model.description)}</p>
            )}

            {/* GLB launch button (also outside viewer for clarity) */}
            {isGlb && (
              <button
                onClick={onLaunch3D}
                className="w-full sm:w-auto px-6 py-3.5 bg-brand-primary hover:bg-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Maximize2 className="w-4 h-4" /> {L.open3d}
              </button>
            )}

            {/* Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {model.license && <MetaBox label={L.license} value={model.license} icon={<ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />} />}
              {model.author && <MetaBox label={L.author} value={model.author} />}
              {model.sourceUrl && (
                <a href={model.sourceUrl} target="_blank" rel="noopener noreferrer" className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl p-3 transition-all">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">{L.source}</span>
                  <span className="text-xs font-bold text-brand-accent flex items-center gap-1 mt-0.5 truncate">
                    {model.source || 'Link'} <ExternalLink className="w-3 h-3 shrink-0" />
                  </span>
                </a>
              )}
            </div>

            {/* Tags */}
            {model.tags && model.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {model.tags.map((t) => (
                  <span key={t} className="px-2 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-bold">#{t}</span>
                ))}
              </div>
            )}

            {/* Pins */}
            {model.pins && model.pins.length > 0 && (
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-violet-500" /> {L.pins} ({model.pins.length})
                </h4>
                <div className="space-y-2">
                  {model.pins.map((p) => (
                    <div key={p.id} className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-brand-primary">{lang === 'uz' ? p.uzbekName : lang === 'ru' ? p.russianName : p.englishName}</span>
                        <span className="text-[10px] italic text-slate-400">{p.latinName}</span>
                      </div>
                      {p.description?.[lang] && <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed">{p.description[lang]}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MetaBox({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
      <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">{label}</span>
      <span className="text-xs font-bold text-slate-700 flex items-center gap-1 mt-0.5 truncate">
        {icon} {value}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Admin panel: qo'shish / tahrirlash / bulk import / eksport / pin editor
// ---------------------------------------------------------------------------
function AdminPanel({
  lang, custom, allModels, onPersist, onClose,
}: {
  lang: 'uz' | 'ru' | 'en';
  custom: AnatomyModel[];
  allModels: AnatomyModel[];
  onPersist: (m: AnatomyModel[]) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<'add' | 'bulk' | 'manage'>('manage');
  const [editing, setEditing] = useState<AnatomyModel>(emptyModel());
  const [bulkText, setBulkText] = useState('');
  const [bulkMsg, setBulkMsg] = useState<string | null>(null);

  const L = {
    add: { uz: "Qo'shish / Tahrirlash", ru: 'Добавить / Изменить', en: 'Add / Edit' }[lang],
    bulk: { uz: 'Ommaviy import (JSON)', ru: 'Массовый импорт (JSON)', en: 'Bulk import (JSON)' }[lang],
    manage: { uz: 'Boshqarish', ru: 'Управление', en: 'Manage' }[lang],
    save: { uz: 'Saqlash', ru: 'Сохранить', en: 'Save' }[lang],
    exportBtn: { uz: 'JSON eksport', ru: 'Экспорт JSON', en: 'Export JSON' }[lang],
    importBtn: { uz: 'Import qilish', ru: 'Импортировать', en: 'Import' }[lang],
    custom: { uz: "Qo'shilgan modellar", ru: 'Добавленные модели', en: 'Added models' }[lang],
    bulkHelp: {
      uz: "AnatomyModel obyektlaridan iborat JSON massivini joylashtiring. Har biri kamida id, title.uz va embedUrl yoki fileUrl bo'lishi kerak. Mavjud id yangilanadi.",
      ru: 'Вставьте JSON-массив объектов AnatomyModel. Каждый должен содержать id, title.uz и embedUrl или fileUrl.',
      en: 'Paste a JSON array of AnatomyModel objects. Each needs at least id, title.uz and an embedUrl or fileUrl.',
    }[lang],
  };

  const upsert = async (model: AnatomyModel) => {
    if (!model.id.trim()) {
      alert('ID kiritilishi shart.');
      return;
    }
    if (!model.title.uz.trim()) {
      alert("O'zbekcha nom (title.uz) kiritilishi shart.");
      return;
    }
    if (!model.embedUrl?.trim() && !model.fileUrl?.trim()) {
      alert('embedUrl yoki fileUrl kiritilishi shart.');
      return;
    }
    try {
      await dbService.saveAnatomyModel(model);
      const next = custom.filter((m) => m.id !== model.id);
      next.push(model);
      onPersist(next);
      setEditing(emptyModel());
      setTab('manage');
    } catch (err: any) {
      console.error("Saqlashda xatolik:", err);
      alert("Ma'lumotlar bazasiga saqlashda xatolik: " + err.message);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm('Ushbu modelni o‘chirasizmi?')) return;
    try {
      await dbService.deleteAnatomyModel(id);
      onPersist(custom.filter((m) => m.id !== id));
    } catch (err: any) {
      console.error("O'chirishda xatolik:", err);
      alert("Ma'lumotlar bazasidan o'chirishda xatolik: " + err.message);
    }
  };

  const editModel = (m: AnatomyModel) => {
    setEditing(JSON.parse(JSON.stringify({ ...emptyModel(), ...m, title: { ...emptyModel().title, ...m.title }, description: { uz: '', ru: '', en: '', ...(m.description || {}) } })));
    setTab('add');
  };

  const doBulkImport = async () => {
    setBulkMsg(null);
    try {
      const parsed = JSON.parse(bulkText);
      if (!Array.isArray(parsed)) throw new Error('JSON massiv (array) bo‘lishi kerak.');
      const valid: AnatomyModel[] = [];
      for (const item of parsed) {
        if (!item.id || !item.title?.uz || (!item.embedUrl && !item.fileUrl)) continue;
        valid.push({ ...emptyModel(), ...item });
      }
      if (valid.length === 0) throw new Error('Yaroqli model topilmadi.');
      
      for (const m of valid) {
        await dbService.saveAnatomyModel(m);
      }
      
      const map = new Map(custom.map((m) => [m.id, m]));
      valid.forEach((m) => map.set(m.id, m));
      onPersist(Array.from(map.values()));
      setBulkMsg(`✅ ${valid.length} ta model import qilindi.`);
      setBulkText('');
    } catch (e: any) {
      setBulkMsg('❌ ' + (e.message || 'JSON xato.'));
    }
  };

  const downloadJson = (data: string) => {
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'anatomy-models.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const doExport = () => {
    const data = JSON.stringify(custom, null, 2);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(data).then(
        () => alert('JSON nusxa olindi (clipboard). anatomyModels.ts fayliga qo‘shishingiz mumkin.'),
        () => downloadJson(data)
      );
    } else {
      downloadJson(data);
    }
  };

  return (
    <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50">
          <div className="flex gap-1">
            {(['manage', 'add', 'bulk'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  tab === t ? 'bg-brand-primary text-white' : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {t === 'manage' ? L.manage : t === 'add' ? L.add : L.bulk}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5">
          {tab === 'manage' && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <button onClick={() => { setEditing(emptyModel()); setTab('add'); }} className="px-4 py-2.5 bg-brand-accent text-brand-primary rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] transition-all">
                  <Plus className="w-4 h-4" /> {L.add}
                </button>
                <button onClick={doExport} disabled={custom.length === 0} className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer disabled:opacity-40">
                  <Download className="w-4 h-4" /> {L.exportBtn}
                </button>
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">{L.custom} ({custom.length})</h4>
                {custom.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-4">—</p>
                ) : (
                  <div className="space-y-2">
                    {custom.map((m) => {
                      const sm = getSystemMeta(m.system);
                      return (
                        <div key={m.id} className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl p-3">
                          <div className="min-w-0">
                            <span className="text-xs font-black text-brand-primary block truncate">{m.title[lang] || m.title.uz}</span>
                            <span className="text-[10px] text-slate-400 font-bold">{m.id} • {sm.label[lang]} • {m.embedUrl ? 'embed' : 'glb'} • {(m.pins || []).length} pin</span>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button onClick={() => editModel(m)} className="p-2 text-slate-500 hover:text-brand-accent hover:bg-white rounded-lg cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
                            <button onClick={() => remove(m.id)} className="p-2 text-slate-500 hover:text-red-500 hover:bg-white rounded-lg cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'add' && <ModelForm editing={editing} setEditing={setEditing} onSave={upsert} lang={lang} saveLabel={L.save} />}

          {tab === 'bulk' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">{L.bulkHelp}</p>
              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                rows={12}
                placeholder='[ { "id": "heart-1", "title": { "uz": "Yurak", "ru": "Сердце", "en": "Heart" }, "system": "organ", "embedUrl": "https://sketchfab.com/models/UID/embed", "license": "CC-BY" } ]'
                className="w-full font-mono text-[11px] bg-slate-900 text-emerald-300 rounded-xl p-4 outline-none border border-slate-700 focus:border-brand-accent"
              />
              {bulkMsg && <p className="text-xs font-bold">{bulkMsg}</p>}
              <button onClick={doBulkImport} className="px-4 py-2.5 bg-brand-primary text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-4 h-4" /> {L.importBtn}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Model qo'shish/tahrirlash formasi (pin editor bilan)
// ---------------------------------------------------------------------------
function ModelForm({
  editing, setEditing, onSave, lang, saveLabel,
}: {
  editing: AnatomyModel; setEditing: (m: AnatomyModel) => void; onSave: (m: AnatomyModel) => void; lang: 'uz' | 'ru' | 'en'; saveLabel: string;
}) {
  const set = (patch: Partial<AnatomyModel>) => setEditing({ ...editing, ...patch });
  const setTitle = (l: 'uz' | 'ru' | 'en', v: string) => setEditing({ ...editing, title: { ...editing.title, [l]: v } });
  const setDesc = (l: 'uz' | 'ru' | 'en', v: string) => setEditing({ ...editing, description: { ...(editing.description || { uz: '', ru: '', en: '' }), [l]: v } });

  const addPin = () => {
    const pin: AnatomyModelPin = {
      id: 'p' + Date.now().toString(36),
      latinName: '', uzbekName: '', englishName: '', russianName: '',
      system: editing.system, position: '0 0 0', normal: '0 0 1',
      description: { uz: '', ru: '', en: '' },
    };
    set({ pins: [...(editing.pins || []), pin] });
  };
  const updPin = (id: string, patch: Partial<AnatomyModelPin>) =>
    set({ pins: (editing.pins || []).map((p) => (p.id === id ? { ...p, ...patch } : p)) });
  const delPin = (id: string) => set({ pins: (editing.pins || []).filter((p) => p.id !== id) });

  const input = 'w-full text-xs font-semibold bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-brand-accent';
  const label = 'text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <span className={label}>ID *</span>
          <input className={input} value={editing.id} onChange={(e) => set({ id: e.target.value.trim() })} placeholder="masalan: heart-anterior" />
        </div>
        <div>
          <span className={label}>Tizim (system) *</span>
          <select className={input} value={editing.system} onChange={(e) => set({ system: e.target.value as AnatomySystem })}>
            {SYSTEM_META.map((s) => <option key={s.id} value={s.id}>{s.label[lang]}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div><span className={label}>Nomi (UZ) *</span><input className={input} value={editing.title.uz} onChange={(e) => setTitle('uz', e.target.value)} /></div>
        <div><span className={label}>Nomi (RU)</span><input className={input} value={editing.title.ru} onChange={(e) => setTitle('ru', e.target.value)} /></div>
        <div><span className={label}>Nomi (EN)</span><input className={input} value={editing.title.en} onChange={(e) => setTitle('en', e.target.value)} /></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><span className={label}>Embed URL (Sketchfab .../embed)</span><input className={input} value={editing.embedUrl || ''} onChange={(e) => set({ embedUrl: e.target.value.trim() })} placeholder="https://sketchfab.com/models/UID/embed" /></div>
        <div><span className={label}>GLB/GLTF fayl URL</span><input className={input} value={editing.fileUrl || ''} onChange={(e) => set({ fileUrl: e.target.value.trim() })} placeholder="https://.../model.glb" /></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div><span className={label}>Rasm (thumbnail) URL</span><input className={input} value={editing.thumbnail || ''} onChange={(e) => set({ thumbnail: e.target.value.trim() })} /></div>
        <div>
          <span className={label}>Soha (region)</span>
          <select className={input} value={editing.region || 'other'} onChange={(e) => set({ region: e.target.value as any })}>
            {REGION_META.map((r) => <option key={r.id} value={r.id}>{r.label[lang]}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div><span className={label}>Litsenziya</span><input className={input} value={editing.license || ''} onChange={(e) => set({ license: e.target.value })} placeholder="CC-BY-4.0" /></div>
        <div><span className={label}>Muallif</span><input className={input} value={editing.author || ''} onChange={(e) => set({ author: e.target.value })} /></div>
        <div><span className={label}>Manba URL</span><input className={input} value={editing.sourceUrl || ''} onChange={(e) => set({ sourceUrl: e.target.value.trim() })} /></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div><span className={label}>Izoh (UZ)</span><textarea rows={2} className={input} value={editing.description?.uz || ''} onChange={(e) => setDesc('uz', e.target.value)} /></div>
        <div><span className={label}>Izoh (RU)</span><textarea rows={2} className={input} value={editing.description?.ru || ''} onChange={(e) => setDesc('ru', e.target.value)} /></div>
        <div><span className={label}>Izoh (EN)</span><textarea rows={2} className={input} value={editing.description?.en || ''} onChange={(e) => setDesc('en', e.target.value)} /></div>
      </div>

      <div>
        <span className={label}>Teglar (vergul bilan)</span>
        <input className={input} value={(editing.tags || []).join(', ')} onChange={(e) => set({ tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })} placeholder="yurak, heart, cor" />
      </div>

      {/* Pin editor */}
      <div className="border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-violet-500" /> Anatomik belgilar (pins)</h4>
          <button onClick={addPin} className="px-3 py-1.5 bg-violet-50 text-violet-600 border border-violet-200 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer hover:bg-violet-100"><Plus className="w-3 h-3" /> Belgi</button>
        </div>
        <p className="text-[10px] text-slate-400 font-semibold mb-3 leading-relaxed">
          Belgilar faqat GLB modellarda 3D nuqta sifatida ko'rsatiladi. position = "x y z" (model-viewer koordinatalari).
        </p>
        <div className="space-y-3">
          {(editing.pins || []).map((p) => (
            <div key={p.id} className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400">{p.id}</span>
                <button onClick={() => delPin(p.id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <input className={input} value={p.latinName} onChange={(e) => updPin(p.id, { latinName: e.target.value })} placeholder="Latin" />
                <input className={input} value={p.uzbekName} onChange={(e) => updPin(p.id, { uzbekName: e.target.value })} placeholder="UZ" />
                <input className={input} value={p.russianName} onChange={(e) => updPin(p.id, { russianName: e.target.value })} placeholder="RU" />
                <input className={input} value={p.englishName} onChange={(e) => updPin(p.id, { englishName: e.target.value })} placeholder="EN" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input className={input} value={p.position} onChange={(e) => updPin(p.id, { position: e.target.value })} placeholder="position: 0 0 0" />
                <select className={input} value={p.system} onChange={(e) => updPin(p.id, { system: e.target.value as AnatomySystem })}>
                  {SYSTEM_META.map((s) => <option key={s.id} value={s.id}>{s.label[lang]}</option>)}
                </select>
              </div>
              <input className={input} value={p.description?.[lang] || ''} onChange={(e) => updPin(p.id, { description: { ...p.description, [lang]: e.target.value } })} placeholder={`Izoh (${lang.toUpperCase()})`} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button onClick={() => onSave(editing)} className="px-6 py-3 bg-brand-primary text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer hover:bg-slate-800">
          <Save className="w-4 h-4" /> {saveLabel}
        </button>
        <button onClick={() => setEditing(emptyModel())} className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
