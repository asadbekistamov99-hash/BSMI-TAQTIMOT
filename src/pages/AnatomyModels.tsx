import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, X, Box, Heart, Activity, Zap, GitBranch, Bone, Layers, Maximize2,
  ExternalLink, ShieldCheck, Plus, Upload, Download, Trash2, Pencil, Save,
  MapPin, Sparkles, Filter, AlertTriangle, RotateCcw, Lock, Clock, ShieldAlert,
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
import PaymentModal from '../components/PaymentModal';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';

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

export default function AnatomyModels({ isAdmin: isAdminProp, user }: { isAdmin?: boolean; user?: any }) {
  const { language } = useLanguage();
  const isAdmin = isAdminProp ?? !!sessionStorage.getItem('adminToken') ?? !!localStorage.getItem('adminToken');
  const lang = language as 'uz' | 'ru' | 'en';

  const [searchParams] = useSearchParams();
  const [custom, setCustom] = useState<AnatomyModel[]>(() => loadCustomModels());
  const [search, setSearch] = useState(() => searchParams.get('q') || '');
  const [topicFilter, setTopicFilter] = useState<string | null>(() => searchParams.get('topic'));
  const [activeSystem, setActiveSystem] = useState<AnatomySystem | 'all'>('all');
  const [activeRegion, setActiveRegion] = useState<string>('all');
  const [selected, setSelected] = useState<AnatomyModel | null>(null);
  const [launch3D, setLaunch3D] = useState<AnatomyModel | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [dbLoading, setDbLoading] = useState(true);

  // Obunani tekshirish holatlari
  const [isSubscribed, setIsSubscribed] = useState<boolean>(() => {
    if (isAdmin || user?.isAdmin) return true;
    if (user?.purchasedSemesters && Array.isArray(user.purchasedSemesters) && user.purchasedSemesters.length > 0) return true;
    return false;
  });
  const [isPending, setIsPending] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Foydalanuvchi obunasini sinchkovlik bilan tekshirish
  const verifySubscription = async () => {
    if (isAdmin || user?.isAdmin) {
      setIsSubscribed(true);
      setIsPending(false);
      return;
    }
    if (!user) {
      setIsSubscribed(false);
      setIsPending(false);
      return;
    }

    try {
      // 1. Foydalanuvchi profilini tekshirish
      const profile = await dbService.getProfile(user.uid);
      if (profile) {
        if (profile.role === 'admin' || profile.isAdmin) {
          setIsSubscribed(true);
          setIsPending(false);
          return;
        }
        if (profile.purchasedSemesters && profile.purchasedSemesters.length > 0) {
          setIsSubscribed(true);
          setIsPending(false);
          return;
        }
        if (profile.expiryDate) {
          let exp: Date | null = null;
          if (typeof profile.expiryDate.toDate === 'function') {
            exp = profile.expiryDate.toDate();
          } else if (profile.expiryDate.seconds !== undefined) {
            exp = new Date(profile.expiryDate.seconds * 1000);
          } else {
            exp = new Date(profile.expiryDate);
          }
          if (exp && exp > new Date()) {
            setIsSubscribed(true);
            setIsPending(false);
            return;
          }
        }
      }

      // 2. To'lov yozuvlarini tekshirish (99: 3D Atlas, 1, 2, 3: Semestrlar)
      let pendingFound = false;
      for (const semId of [99, 1, 2, 3]) {
        const payment = await dbService.getPayment(user.uid, semId);
        if (payment) {
          if (payment.status === 'completed' || payment.status === 'approved') {
            setIsSubscribed(true);
            setIsPending(false);
            return;
          } else if (payment.status === 'pending') {
            pendingFound = true;
          }
        }
      }

      setIsSubscribed(false);
      setIsPending(pendingFound);
    } catch (e) {
      console.error("3D model obunasini tekshirishda xatolik:", e);
    }
  };

  useEffect(() => {
    verifySubscription();
  }, [user, isAdmin]);

  const handleRequireSubscription = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      setShowPaymentModal(true);
    }
  };

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

  // Mavzu sahifasidan "?model=<id>" orqali kelingan bo'lsa, mos modelni avtomatik ochish
  useEffect(() => {
    const rawId = searchParams.get('model');
    if (rawId && allModels.length > 0) {
      const targetId = decodeURIComponent(rawId).trim();
      const found = allModels.find(
        (m) => m.id === targetId || m.id.toLowerCase() === targetId.toLowerCase()
      );
      if (found) {
        setSelected(found);
        // Agar model GLB formatda bo'lsa, launch3D holatini ham tayyorlash
      }
    }
  }, [allModels, searchParams]);

  // Filtrlash
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allModels.filter((m) => {
      if (activeSystem !== 'all' && m.system !== activeSystem) return false;
      if (activeRegion !== 'all' && m.region !== activeRegion) return false;
      if (topicFilter && !m.topicIds?.includes(topicFilter)) return false;
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
  }, [allModels, search, activeSystem, activeRegion, topicFilter, lang]);

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

          {/* Obuna holati bildirishnomasi */}
          {!isSubscribed && (
            <div className="mt-8 p-5 rounded-2xl bg-amber-500/15 border border-amber-500/30 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/25 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/10">
                  {isPending ? <Clock className="w-6 h-6 animate-pulse text-amber-400" /> : <Lock className="w-6 h-6 text-amber-400" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-sm sm:text-base font-black text-white">
                      {isPending
                        ? (lang === 'uz' ? "Obuna to'lovingiz tekshirilmoqda" : lang === 'ru' ? "Ваш платеж на проверке" : "Subscription Verification Pending")
                        : (lang === 'uz' ? "3D Modellar to'liq katalogi faqat obunachilar uchun ochiq" : lang === 'ru' ? "Полный каталог 3D-моделей доступен по подписке" : "3D Models Catalog is restricted to subscribers")}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-widest border border-amber-500/30">
                      {isPending ? "Kutilmoqda ⏳" : "Cheklangan 🔒"}
                    </span>
                  </div>
                  <p className="text-xs text-white/80 mt-1 max-w-2xl leading-relaxed">
                    {isPending
                      ? (lang === 'uz' ? "Siz yuborgan to'lov cheki adminlarimiz tomonidan tekshirilmoqda. Tasdiqlanishi bilan barcha 3D modellar avtomatik ochiladi! ⏳" : lang === 'ru' ? "Ваш чек проверяется администратором. Доступ откроется сразу после подтверждения!" : "Your transaction receipt is being reviewed. Access will open shortly!")
                      : (lang === 'uz' ? "Barcha inson a'zolari, skelet, muskullar, nervlar va qon tomirlarining interaktiv 3D modellarini 360° aylantirish, qismlarini kattalashtirish va to'liq o'rganish uchun platforma obunasini xarid qiling." : lang === 'ru' ? "Оформите подписку, чтобы получить полный доступ ко всем интерактивным 3D-моделям органов, костей, мышц и сосудов." : "Subscribe to access all interactive 3D models of organs, bones, muscles, and vessels.")}
                  </p>
                </div>
              </div>
              {!isPending && (
                <button
                  onClick={handleRequireSubscription}
                  className="w-full md:w-auto px-6 py-3.5 bg-brand-accent hover:bg-yellow-400 text-brand-primary font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-brand-accent/20 cursor-pointer shrink-0 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-brand-primary" />
                  {user 
                    ? (lang === 'uz' ? "Obunani Faollashtirish (30,000 UZS)" : lang === 'ru' ? "Оформить подписку (30,000 UZS)" : "Subscribe (30,000 UZS)")
                    : (lang === 'uz' ? "Kirish va Obuna Bo'lish" : lang === 'ru' ? "Войти и оформить подписку" : "Log In & Subscribe")}
                </button>
              )}
            </div>
          )}
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

          {/* Active topic-deep-link filter indicator */}
          {topicFilter && (
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-brand-accent/15 text-brand-primary border border-brand-accent/30 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                {{ uz: 'Mavzu bo\'yicha filtrlangan', ru: 'Отфильтровано по теме', en: 'Filtered by topic' }[lang]}
                <button
                  onClick={() => setTopicFilter(null)}
                  className="ml-1 hover:text-red-600 transition-colors cursor-pointer"
                  title={{ uz: "Filtrni tozalash", ru: 'Сбросить фильтр', en: 'Clear filter' }[lang]}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            </div>
          )}
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
              <ModelCard
                key={m.id}
                model={m}
                lang={lang}
                onOpen={() => setSelected(m)}
                tr={tr}
                isSubscribed={isSubscribed}
              />
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
              if (!isSubscribed) {
                handleRequireSubscription();
                return;
              }
              setLaunch3D(selected);
              setSelected(null);
            }}
            isSubscribed={isSubscribed}
            isPending={isPending}
            onRequireSubscription={handleRequireSubscription}
          />
        )}
      </AnimatePresence>

      {/* Full-screen GLB 3D suite - Faqat obuna bo'lgan foydalanuvchilar uchun */}
      {launch3D && isSubscribed && launch3D.fileUrl && (
        <Anatomy3DSuite
          src={launch3D.fileUrl || ''}
          alt={tr(launch3D.title)}
          initialEntry={toSuiteEntry(launch3D)}
          onBack={() => setLaunch3D(null)}
        />
      )}

      {/* Obuna to'lov modali */}
      {showPaymentModal && user && (
        <PaymentModal
          semesterId={99}
          user={user}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={() => {
            setShowPaymentModal(false);
            setIsSubscribed(true);
            verifySubscription();
          }}
        />
      )}

      {/* Profilga kirish modali (mehmonlar uchun) */}
      <AnimatePresence>
        {showAuthModal && (
          <AuthPromptModal
            lang={lang}
            onClose={() => setShowAuthModal(false)}
            onSuccessLogin={() => {
              setShowAuthModal(false);
              verifySubscription();
              setShowPaymentModal(true);
            }}
          />
        )}
      </AnimatePresence>
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
  model, lang, onOpen, tr, isSubscribed,
}: {
  model: AnatomyModel;
  lang: 'uz' | 'ru' | 'en';
  onOpen: () => void;
  tr: (o: any, f?: string) => string;
  isSubscribed: boolean;
}) {
  const sm = getSystemMeta(model.system);
  const Icon = ICONS[sm.icon] || Box;
  const [imgOk, setImgOk] = useState(true);
  const systemBackdrop = SYSTEM_BACKDROPS[model.system] || SYSTEM_BACKDROPS.other;

  return (
    <motion.button
      layout
      onClick={onOpen}
      className="group text-left bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden hover:border-brand-accent/50 hover:shadow-2xl hover:shadow-slate-950 transition-all cursor-pointer flex flex-col relative"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden w-full">
        {model.thumbnail && imgOk ? (
          /* Real per-model picture: shown on a solid white card so it's always clearly visible */
          <>
            <div className="absolute inset-0 bg-white" />
            <img
              src={model.thumbnail}
              alt={tr(model.title)}
              onError={() => setImgOk(false)}
              referrerPolicy="no-referrer"
              loading="lazy"
              className={`absolute inset-0 w-full h-full object-contain p-4 z-10 group-hover:scale-110 transition-transform duration-500 ${!isSubscribed ? 'filter contrast-95 opacity-90' : ''}`}
            />
          </>
        ) : (
          <>
            {/* Glowing 3D System Backdrop Base Layer (used only when no real picture is available) */}
            <img
              src={systemBackdrop}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            {/* Tech subtle vignette & radial depth gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/20" />
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-xl">
                <Icon className="w-7 h-7 text-white" />
              </div>
            </div>
          </>
        )}
        <div className="absolute top-3 left-3 flex gap-1.5 z-20">
          <span className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${sm.badge} flex items-center gap-1 backdrop-blur-sm bg-white/5`}>
            <Icon className="w-3 h-3" /> {sm.label[lang]}
          </span>
        </div>

        {/* Lock indicator top right if not subscribed */}
        {!isSubscribed && (
          <div className="absolute top-3 right-3 z-20">
            <span className="px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 backdrop-blur-md shadow-md">
              <Lock className="w-3 h-3" /> Obuna
            </span>
          </div>
        )}

        <div className="absolute bottom-3 right-3 opacity-90 group-hover:opacity-100 transition-opacity z-20">
          <span className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg ${
            isSubscribed 
              ? 'bg-brand-accent text-brand-primary' 
              : 'bg-slate-900/90 text-amber-400 border border-amber-500/30'
          }`}>
            {isSubscribed ? (
              <>
                <Maximize2 className="w-3 h-3" /> {model.fileUrl && !model.embedUrl ? 'GLB' : '3D'}
              </>
            ) : (
              <>
                <Lock className="w-3 h-3" /> 3D (🔒)
              </>
            )}
          </span>
        </div>
      </div>
      {/* Body */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-black text-white group-hover:text-brand-accent transition-colors leading-tight line-clamp-2">
            {tr(model.title)}
          </h3>
          {!isSubscribed && (
            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          )}
        </div>
        {tr(model.description) && (
          <p className="text-[11px] text-slate-400 font-semibold mt-1.5 line-clamp-2 leading-relaxed">{tr(model.description)}</p>
        )}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800">
          {model.license ? (
            <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> {model.license}
            </span>
          ) : (
            <span />
          )}
          {model.pins && model.pins.length > 0 && (
            <span className="text-[9px] font-black uppercase tracking-wider text-violet-400 flex items-center gap-1">
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
  model,
  lang,
  tr,
  onClose,
  onLaunch3D,
  isSubscribed,
  isPending,
  onRequireSubscription,
}: {
  model: AnatomyModel;
  lang: 'uz' | 'ru' | 'en';
  tr: (o: any, f?: string) => string;
  onClose: () => void;
  onLaunch3D: () => void;
  isSubscribed: boolean;
  isPending: boolean;
  onRequireSubscription: () => void;
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
      className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, y: 12 }}
        className="bg-white rounded-[28px] w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-start gap-3 min-w-0">
            <span className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${sm.badge}`}>
              <Icon className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-black text-brand-primary tracking-tight leading-tight truncate">{tr(model.title)}</h2>
                {!isSubscribed && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-700 text-[10px] font-black uppercase tracking-wider">
                    <Lock className="w-3 h-3 text-amber-600" />
                    {isPending ? "To'lov kutilmoqda" : "Obuna talab qilinadi"}
                  </span>
                )}
              </div>
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
            {!isSubscribed ? (
              /* Obuna bo'lmagan foydalanuvchilar uchun 3D ko'rish bloklangan ekran */
              <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-slate-950 overflow-hidden">
                {model.thumbnail ? (
                  <img
                    src={model.thumbnail}
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain filter blur-2xl opacity-20 pointer-events-none scale-110"
                  />
                ) : (
                  <img
                    src={systemBackdrop}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover filter blur-2xl opacity-25 pointer-events-none"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/50" />

                <div className="relative z-10 max-w-md mx-auto flex flex-col items-center px-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/35 text-amber-400 flex items-center justify-center mb-4 shadow-xl">
                    {isPending ? (
                      <Clock className="w-8 h-8 animate-pulse text-amber-400" />
                    ) : (
                      <Lock className="w-8 h-8 text-amber-400" />
                    )}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-widest mb-2">
                    {lang === 'uz' ? "Premium 3D Anatomiya" : lang === 'ru' ? "Премиум 3D Анатомия" : "Premium 3D Anatomy"}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {isPending 
                      ? (lang === 'uz' ? "To'lov Ko'rib Chiqilmoqda" : lang === 'ru' ? "Платеж проверяется" : "Payment Pending")
                      : (lang === 'uz' ? "3D Model Ko'rish Cheklangan" : lang === 'ru' ? "3D Модель заблокирована" : "3D Model Locked")}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium mt-2 leading-relaxed">
                    {isPending 
                      ? (lang === 'uz' ? "Siz yuborgan obuna to'lovi adminlarimiz tomonidan tekshirilmoqda. Tasdiqlanishi bilan ushbu 3D model darhol to'liq ochiladi! ⏳" : lang === 'ru' ? "Ваш платеж проверяется администратором. Доступ откроется сразу после подтверждения! ⏳" : "Your subscription is currently being verified. Full 3D access will unlock shortly! ⏳")
                      : (lang === 'uz' ? `"${tr(model.title)}" va barcha boshqa 3D anatomik modellarni 360° interaktiv aylantirish, qismlarini kattalashtirish va pin belgilarini o'rganish uchun platforma obunasini sotib olish lozim.` : lang === 'ru' ? `Для интерактивного просмотра 3D-модели "${tr(model.title)}" и всех анатомических структур оформите подписку.` : `A subscription is required to interact with "${tr(model.title)}" and all 3D anatomical models.`)}
                  </p>
                  {!isPending ? (
                    <button
                      onClick={onRequireSubscription}
                      className="mt-6 px-8 py-3.5 bg-brand-accent hover:bg-yellow-400 text-brand-primary rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-brand-accent/20 transition-all cursor-pointer flex items-center gap-2 active:scale-95"
                    >
                      <Sparkles className="w-4 h-4 text-brand-primary" />
                      {lang === 'uz' ? "Obunani Faollashtirish (30,000 UZS)" : lang === 'ru' ? "Оформить подписку (30,000 UZS)" : "Subscribe Now (30,000 UZS)"}
                    </button>
                  ) : (
                    <span className="mt-4 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-xl">
                      Admin tasdiqlashi kutilmoqda...
                    </span>
                  )}
                </div>
              </div>
            ) : model.embedUrl ? (
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
                  <div className="relative z-10 w-44 h-44 bg-white border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-3 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
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
            {model.embedUrl && isSubscribed && (
              <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-accent" /> {L.embedNote}
              </p>
            )}

            {tr(model.description) && (
              <p className="text-sm text-slate-600 font-medium leading-relaxed">{tr(model.description)}</p>
            )}

            {/* Launch / Subscribe Action button */}
            {isSubscribed ? (
              isGlb && (
                <button
                  onClick={onLaunch3D}
                  className="w-full sm:w-auto px-6 py-3.5 bg-brand-primary hover:bg-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4" /> {L.open3d}
                </button>
              )
            ) : (
              <button
                onClick={onRequireSubscription}
                className="w-full sm:w-auto px-6 py-3.5 bg-brand-accent hover:bg-yellow-400 text-brand-primary rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-brand-accent/20"
              >
                <Lock className="w-4 h-4" />
                {isPending 
                  ? (lang === 'uz' ? "To'lov tekshirilmoqda ⏳" : lang === 'ru' ? "Платеж проверяется ⏳" : "Payment Pending ⏳")
                  : (lang === 'uz' ? "3D Ko'rish Uchun Obuna Bo'lish" : lang === 'ru' ? "Оформить подписку для 3D" : "Subscribe to View 3D")}
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

// ---------------------------------------------------------------------------
// Mehmonlar uchun tizimga kirish modali
// ---------------------------------------------------------------------------
function AuthPromptModal({
  lang,
  onClose,
  onSuccessLogin,
}: {
  lang: 'uz' | 'ru' | 'en';
  onClose: () => void;
  onSuccessLogin: () => void;
}) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      await setDoc(doc(db, 'users', result.user.uid), {
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        lastLogin: serverTimestamp(),
      }, { merge: true });
      onSuccessLogin();
    } catch (e: any) {
      console.error("Login failed:", e);
      setAuthError(e?.message || "Kirishda xatolik yuz berdi");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[130] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.94, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 16 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-5 shadow-lg">
          <Lock className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-black text-white tracking-tight">
          {lang === 'uz' ? "Avval profilingizga kiring" : lang === 'ru' ? "Войдите в аккаунт" : "Please sign in first"}
        </h3>
        <p className="text-xs text-slate-300 font-medium mt-2 leading-relaxed">
          {lang === 'uz'
            ? "3D modellar obunasini sotib olish va profilingizga biriktirish uchun Google akkauntingiz orqali tizimga kiring."
            : lang === 'ru'
            ? "Для покупки подписки на 3D-модели и привязки к аккаунту войдите через Google."
            : "Sign in with Google to purchase and link the 3D models subscription to your account."}
        </p>

        {authError && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs text-left">
            {authError}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-black rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            {isLoggingIn ? "KIRILMOQDA..." : (lang === 'uz' ? "Google orqali kirish" : lang === 'ru' ? "Войти через Google" : "Sign in with Google")}
          </button>
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
