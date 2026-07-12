import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  getDocs, 
  getDoc, 
  query, 
  orderBy, 
  deleteDoc, 
  doc, 
  addDoc, 
  setDoc, 
  updateDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { dbService } from '../lib/dbService';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Upload, 
  Download, 
  ExternalLink, 
  Check, 
  RefreshCw, 
  AlertTriangle, 
  Save, 
  MapPin, 
  Box, 
  Activity, 
  Bone, 
  Heart, 
  Zap, 
  GitBranch, 
  Sparkles, 
  Sliders, 
  Fullscreen, 
  Minimize, 
  ArrowLeft,
  ChevronRight,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ANATOMY_MODELS, 
  SEED_MODELS, 
  SYSTEM_META, 
  REGION_META, 
  getSystemMeta, 
  type AnatomyModel, 
  type AnatomySystem, 
  type AnatomyModelPin,
  type BodyRegion
} from '../data/anatomyModels';

interface ThreeDModelsManagerProps {
  searchQuery: string;
  requestConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

// Map Lucide icons
const ICONS: Record<string, any> = { Bone, Activity, Heart, Zap, GitBranch, Box };

const ModelViewer = 'model-viewer' as any;

const emptyModel = (): AnatomyModel => ({
  id: '',
  title: { uz: '', ru: '', en: '' },
  description: { uz: '', ru: '', en: '' },
  system: 'organ',
  region: 'other',
  embedUrl: '',
  fileUrl: '',
  thumbnail: '',
  source: 'Sketchfab',
  sourceUrl: '',
  license: 'CC-BY',
  author: '',
  tags: [],
  pins: [],
});

export default function ThreeDModelsManager({ searchQuery, requestConfirm }: ThreeDModelsManagerProps) {
  const [models, setModels] = useState<AnatomyModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<AnatomyModel | null>(null);
  const [activeZoneModel, setActiveZoneModel] = useState<AnatomyModel | null>(null);
  
  // Upload progress states
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(null);
  
  // Filter states
  const [systemFilter, setSystemFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Migration states
  const [migrationStatus, setMigrationStatus] = useState<string | null>(null);
  const [hasLegacyData, setHasLegacyData] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetchModels();
    checkLegacyData();
  }, []);

  const fetchModels = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      // Load custom models from Firestore
      const customModels = await dbService.getAnatomyModels();
      // Combine with static SEED_MODELS to show all
      const combined = mergeWithSeed(customModels);
      setModels(combined);
    } catch (err: any) {
      console.error("3D modellarni yuklashda xatolik:", err);
      setFetchError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const checkLegacyData = async () => {
    try {
      const snap = await getDocs(collection(db, 'atlas'));
      if (!snap.empty) {
        setHasLegacyData(true);
      }
    } catch (e) {
      console.warn("Legacy data check failed:", e);
    }
  };

  const mergeWithSeed = (custom: AnatomyModel[]): AnatomyModel[] => {
    const map = new Map<string, AnatomyModel>();
    // Static models first
    [...ANATOMY_MODELS, ...SEED_MODELS].forEach(m => {
      map.set(m.id, { ...m, isStatic: true } as any);
    });
    // Custom models override static ones if they share the same ID
    custom.forEach(m => {
      if ((m as any).deleted) {
        map.delete(m.id);
      } else {
        map.set(m.id, { ...m, isStatic: false } as any);
      }
    });
    return Array.from(map.values());
  };

  const handleMigration = async () => {
    setMigrationStatus("Migratsiya boshlandi...");
    try {
      const snap = await getDocs(collection(db, 'atlas'));
      if (snap.empty) {
        setMigrationStatus("Eski atlas kolleksiyasida ma'lumot topilmadi.");
        return;
      }

      let count = 0;
      for (const docObj of snap.docs) {
        const d = docObj.data();
        
        // Map AtlasEntry fields to AnatomyModel
        const mappedModel: AnatomyModel = {
          id: docObj.id,
          title: {
            uz: d.uzbekName || d.latinName || 'Nomsiz Model',
            ru: d.uzbekName || d.latinName || 'Nomsiz Model',
            en: d.latinName || d.uzbekName || 'Unnamed Model'
          },
          description: {
            uz: d.description || '',
            ru: d.description || '',
            en: d.description || ''
          },
          system: (d.system || 'other') as AnatomySystem,
          region: (d.region || 'other') as BodyRegion,
          fileUrl: d.modelUrl || '',
          embedUrl: d.embedUrl || '',
          thumbnail: d.image || '',
          source: d.source || 'Sketchfab',
          sourceUrl: d.sourceUrl || '',
          license: d.license || 'CC-BY',
          author: d.author || '',
          tags: d.tags || [d.latinName, d.uzbekName].filter(Boolean),
          pins: (d.pins || []).map((p: any) => ({
            id: p.id || 'p_' + Math.random().toString(36).substr(2, 9),
            latinName: p.latinName || '',
            uzbekName: p.uzbekName || '',
            englishName: p.englishName || '',
            russianName: p.russianName || '',
            system: (p.system || d.system || 'other') as AnatomySystem,
            position: p.position || '0 0 0',
            normal: p.normal || '0 0 1',
            description: p.description || { uz: '', ru: '', en: '' }
          }))
        };

        await dbService.saveAnatomyModel(mappedModel);
        count++;
      }

      setMigrationStatus(`Muvaffaqiyatli yakunlandi! ${count} ta model ko'chirildi.`);
      setHasLegacyData(false);
      fetchModels();
    } catch (err: any) {
      console.error(err);
      setMigrationStatus("Xatolik yuz berdi: " + err.message);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    if (!editing.id.trim()) {
      alert("ID kiritilishi shart!");
      return;
    }
    if (!editing.title.uz.trim()) {
      alert("O'zbekcha nom kiritilishi shart!");
      return;
    }

    try {
      await dbService.saveAnatomyModel(editing);
      alert("Model muvaffaqiyatli saqlandi!");
      setEditing(null);
      fetchModels();
    } catch (err: any) {
      console.error("Model save error:", err);
      alert("Saqlashda xatolik: " + err.message);
    }
  };

  const handleDelete = (id: string, isStatic?: boolean) => {
    requestConfirm(
      "3D Modelni O'chirish",
      "Ushbu 3D modelni ma'lumotlar bazasidan butunlay o'chirmoqchimisiz? Ushbu amal ortga qaytarilmaydi.",
      async () => {
        try {
          if (isStatic) {
            // Find the static model to get its system / title
            const staticModel = [...ANATOMY_MODELS, ...SEED_MODELS].find(m => m.id === id);
            const deletedObject = {
              id,
              title: staticModel?.title || { uz: 'O\'chirilgan', ru: 'Удалено', en: 'Deleted' },
              system: staticModel?.system || 'other',
              region: staticModel?.region || 'other',
              deleted: true
            };
            await dbService.saveAnatomyModel(deletedObject);
          } else {
            await dbService.deleteAnatomyModel(id);
          }
          alert("Model o'chirildi.");
          fetchModels();
        } catch (err: any) {
          alert("Xatolik: " + err.message);
        }
      }
    );
  };

  // Convert normal Sketchfab link to Embed Link format
  const convertSketchfabLink = (url: string) => {
    if (!url) return '';
    const trimmed = url.trim();
    // If it's already an embed link, return as is
    if (trimmed.includes('/embed')) return trimmed;

    // Pattern to extract Sketchfab ID
    // E.g., https://sketchfab.com/3d-models/human-heart-3342c8c438904ee2b3b6b68fedf30531
    const match = trimmed.match(/(?:3d-models\/|models\/)([^/?#\s]+)/i);
    if (match && match[1]) {
      const id = match[1].split('-').pop(); // gets the hash ID from the end of name-hash
      if (id) {
        return `https://sketchfab.com/models/${id}/embed`;
      }
    }
    return trimmed;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;

    if (!file.name.toLowerCase().endsWith('.glb') && !file.name.toLowerCase().endsWith('.gltf')) {
      alert("Faqat .glb yoki .gltf fayllarini yuklash mumkin");
      return;
    }

    const MAX_SIZE = 1.2 * 1024 * 1024; // 1.2 MB limit for Firestore Base64 encoding
    if (file.size > MAX_SIZE) {
      alert("⚠️ Fayl juda katta! Firestore ba'zasi cheklovi sababli 3D Model hajmi 1.2 MB dan kam bo'lishi kerak. Kichikroq model tanlang yoki Sketchfab Embed linkdan foydalaning.");
      return;
    }

    try {
      setUploadProgress(15);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        setUploadProgress(75);
        let result = event.target?.result as string;
        if (result.startsWith('data:application/octet-stream;')) {
          result = result.replace('data:application/octet-stream;', 'data:model/gltf-binary;');
        }
        setUploadProgress(100);
        setEditing({ ...editing, fileUrl: result });
        setTimeout(() => setUploadProgress(null), 500);
      };
    } catch (error: any) {
      alert("Yuklashda xatolik: " + error.message);
      setUploadProgress(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;

    try {
      setImageUploadProgress(20);
      const localBlobUrl = URL.createObjectURL(file);
      const img = new Image();
      img.src = localBlobUrl;
      img.onload = () => {
        setImageUploadProgress(60);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setImageUploadProgress(null);
          return;
        }

        let width = img.width;
        let height = img.height;
        const MAX_DIM = 800; // Optimal size for thumbnail
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const compressed = canvas.toDataURL('image/jpeg', 0.8);
        setImageUploadProgress(100);
        setEditing({ ...editing, thumbnail: compressed });
        URL.revokeObjectURL(localBlobUrl);
        setTimeout(() => setImageUploadProgress(null), 300);
      };
    } catch (error: any) {
      alert("Rasm yuklashda xatolik: " + error.message);
      setImageUploadProgress(null);
    }
  };

  // Filter & Search models logic
  const filteredModels = models.filter(m => {
    const term = (searchQuery || search).trim().toLowerCase();
    
    // System Filter
    if (systemFilter !== 'all' && m.system !== systemFilter) return false;
    
    // Region Filter
    if (regionFilter !== 'all' && m.region !== regionFilter) return false;

    // Search Query
    if (!term) return true;
    const uzTitle = m.title?.uz || '';
    const ruTitle = m.title?.ru || '';
    const enTitle = m.title?.en || '';
    const descUz = m.description?.uz || '';
    const tagsStr = (m.tags || []).join(' ');
    
    return [uzTitle, ruTitle, enTitle, descUz, tagsStr, m.id]
      .join(' ')
      .toLowerCase()
      .includes(term);
  });

  if (activeZoneModel) {
    return (
      <Model3DZoneEditor 
        model={activeZoneModel} 
        onClose={() => {
          setActiveZoneModel(null);
          fetchModels();
        }} 
      />
    );
  }

  return (
    <div className="space-y-8 p-1">
      {/* Migration panel if legacy data exists */}
      {hasLegacyData && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-[32px] p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
          <div>
            <h4 className="text-lg font-black text-amber-900 uppercase tracking-tight flex items-center gap-2">
              <AlertTriangle className="text-amber-600" /> Eski 3D Atlas Ma'lumotlari Topildi
            </h4>
            <p className="text-sm text-amber-700 font-medium mt-1 max-w-2xl">
              Tizimda eski 3D Atlas bo'limidagi ma'lumotlar mavjud. Ularni yangi 3D Modellar tizimiga integratsiya qilib, to'liq o'tkazishingiz mumkin. Hamma 3D zonalar va pinlar avtomatik saqlanib qoladi!
            </p>
            {migrationStatus && (
              <span className="inline-block mt-3 px-4 py-1.5 bg-amber-100 text-amber-800 font-mono text-xs rounded-lg border border-amber-200">
                {migrationStatus}
              </span>
            )}
          </div>
          <button 
            onClick={handleMigration}
            className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-amber-600/20 whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> INTEGRATSIYA (MIGRATSIYA) QILISH
          </button>
        </div>
      )}

      {/* Supabase "anatomy_models" Missing Table Troubleshooting Box */}
      {((fetchError && (fetchError.includes('relation') || fetchError.includes('does not exist'))) || 
        (migrationStatus && (migrationStatus.includes('relation') || migrationStatus.includes('does not exist') || migrationStatus.includes('permissions')))) && (
        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-[32px] p-8 space-y-6 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="p-3 bg-indigo-100 text-indigo-700 rounded-2xl shrink-0">
              <Database size={24} />
            </span>
            <div>
              <h4 className="text-base font-black text-indigo-900 uppercase tracking-tight">
                Supabase Sozlash Maslahati: "anatomy_models" jadvali topilmadi!
              </h4>
              <p className="text-xs text-indigo-700/80 font-medium mt-1 leading-relaxed max-w-3xl">
                Sizda Supabase faol rejimda, biroq ma'lumotlar bazasida 3D modellar uchun <code>anatomy_models</code> jadvali yaratilmagan.
                Buni tuzatish uchun quyidagi SQL kodini nusxalab, Supabase boshqaruv panelidagi <b>SQL Editor</b> qismiga qo'yib <b>Run</b> tugmasini bosing va sahifani yangilang!
              </p>
            </div>
          </div>

          <div className="relative bg-slate-900 rounded-2xl overflow-hidden p-5 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold uppercase tracking-widest pb-3 border-b border-slate-800/80 mb-3">
              <span>SQL Skript</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(`CREATE TABLE IF NOT EXISTS public.anatomy_models (
  "id" TEXT PRIMARY KEY,
  "title" JSONB NOT NULL,
  "description" JSONB,
  "system" TEXT NOT NULL,
  "region" TEXT NOT NULL,
  "fileUrl" TEXT,
  "embedUrl" TEXT,
  "thumbnail" TEXT,
  "source" TEXT,
  "sourceUrl" TEXT,
  "license" TEXT,
  "author" TEXT,
  "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "pins" JSONB DEFAULT '[]'::JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

ALTER TABLE public.anatomy_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Barcha 3D modellarni ko'ra oladi" ON public.anatomy_models FOR SELECT USING (true);
CREATE POLICY "Faqat Admin 3D modellarni tahrirlay oladi" ON public.anatomy_models FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND (profiles.is_admin = true OR profiles.role = 'admin'))
);`);
                  alert("SQL skript nusxalandi!");
                }}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer text-[9px] font-black uppercase tracking-wider"
              >
                Nusxalash
              </button>
            </div>
            <pre className="text-[10px] text-emerald-400 font-mono overflow-x-auto max-h-48 leading-relaxed select-all">
{`CREATE TABLE IF NOT EXISTS public.anatomy_models (
  "id" TEXT PRIMARY KEY,
  "title" JSONB NOT NULL,
  "description" JSONB,
  "system" TEXT NOT NULL,
  "region" TEXT NOT NULL,
  "fileUrl" TEXT,
  "embedUrl" TEXT,
  "thumbnail" TEXT,
  "source" TEXT,
  "sourceUrl" TEXT,
  "license" TEXT,
  "author" TEXT,
  "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "pins" JSONB DEFAULT '[]'::JSONB,
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

ALTER TABLE public.anatomy_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Barcha 3D modellarni ko'ra oladi" ON public.anatomy_models FOR SELECT USING (true);
CREATE POLICY "Faqat Admin 3D modellarni tahrirlay oladi" ON public.anatomy_models FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND (profiles.is_admin = true OR profiles.role = 'admin'))
);`}
            </pre>
          </div>
        </div>
      )}

      {/* Header section with add button and count */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-[32px] border border-brand-border shadow-sm gap-4">
        <div>
          <h3 className="text-xl font-black text-brand-primary uppercase tracking-tighter">3D Modellar va Atlas Boshqaruvi</h3>
          <p className="text-brand-muted text-xs font-bold uppercase tracking-widest mt-1">Jami ko'rinayotgan: {filteredModels.length} ta model</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* System filter select */}
          <select 
            value={systemFilter} 
            onChange={(e) => setSystemFilter(e.target.value)}
            className="p-4 bg-brand-bg rounded-2xl border-2 border-brand-border outline-none text-xs font-bold text-brand-primary focus:border-brand-accent transition-all cursor-pointer"
          >
            <option value="all">Barcha Tizimlar</option>
            {SYSTEM_META.map(s => <option key={s.id} value={s.id}>{s.label.uz}</option>)}
          </select>

          {/* Region filter select */}
          <select 
            value={regionFilter} 
            onChange={(e) => setRegionFilter(e.target.value)}
            className="p-4 bg-brand-bg rounded-2xl border-2 border-brand-border outline-none text-xs font-bold text-brand-primary focus:border-brand-accent transition-all cursor-pointer"
          >
            <option value="all">Barcha Sohalar</option>
            {REGION_META.map(r => <option key={r.id} value={r.id}>{r.label.uz}</option>)}
          </select>

          <button 
            onClick={() => setEditing(emptyModel())} 
            className="px-8 py-4 bg-brand-accent text-brand-primary rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-accent/20 ml-auto md:ml-0"
          >
            <Plus size={18} /> Yangi Model qo'shish
          </button>
        </div>
      </div>

      {/* Grid listing the models */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map(m => {
          const sm = getSystemMeta(m.system);
          const IconComp = ICONS[sm.icon] || Box;
          const isCustom = !(m as any).isStatic;

          return (
            <div key={m.id} className="bg-white rounded-[32px] border border-brand-border overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col group">
              {/* Thumbnail preview */}
              <div className="relative aspect-video bg-slate-100 flex items-center justify-center overflow-hidden border-b border-brand-border">
                {m.thumbnail ? (
                  <img src={m.thumbnail} alt={m.title.uz} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                ) : (
                  <IconComp className="w-16 h-16 text-slate-300" />
                )}
                
                {/* Labels and badges */}
                <div className="absolute top-4 left-4 flex gap-1.5">
                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${sm.badge} flex items-center gap-1`}>
                    <IconComp className="w-3 h-3" /> {sm.label.uz}
                  </span>
                  {!isCustom && (
                    <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200">
                      Tizimniki (Seed)
                    </span>
                  )}
                  {isCustom && (
                    <span className="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider bg-green-50 text-green-700 border border-green-200">
                      Custom (Admin)
                    </span>
                  )}
                </div>

                <div className="absolute bottom-4 right-4 flex gap-1">
                  {m.fileUrl && (
                    <span className="px-2 py-1 bg-blue-600 text-white text-[9px] font-black rounded-md uppercase tracking-wider">
                      GLB Model
                    </span>
                  )}
                  {m.embedUrl && (
                    <span className="px-2 py-1 bg-amber-500 text-white text-[9px] font-black rounded-md uppercase tracking-wider">
                      Sketchfab Embed
                    </span>
                  )}
                </div>
              </div>

              {/* Card content */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-black text-brand-primary leading-tight line-clamp-2 uppercase tracking-tight">
                    {m.title.uz}
                  </h4>
                  <p className="text-xs italic text-brand-muted font-bold mt-1">
                    {m.title.en || m.id}
                  </p>
                  <p className="text-xs text-slate-500 font-medium line-clamp-3 mt-3 leading-relaxed">
                    {m.description?.uz || "Izoh kiritilmagan."}
                  </p>
                </div>

                {/* Info block */}
                <div className="flex items-center justify-between border-t border-brand-border pt-4 mt-4 text-[10px] font-black text-brand-muted uppercase tracking-widest">
                  <span>Pin nuqtalar: <strong className="text-violet-600 font-bold">{(m.pins || []).length} ta</strong></span>
                  <span>Soha: <strong>{REGION_META.find(r => r.id === m.region)?.label.uz || 'Boshqa'}</strong></span>
                </div>

                {/* Actions row */}
                <div className="flex items-center gap-2 mt-5 border-t border-brand-border pt-4">
                  {/* Pin Zone Editor button (only if has direct GLB URL) */}
                  <button 
                    onClick={() => {
                      if (!m.fileUrl) {
                        alert("Ushbu modelga 3D pin nuqtalarni belgilash uchun avval unga .GLB formatdagi model faylini tahrirlab yuklang! Sketchfab iframe embed modellarida pin joylashtirib bo'lmaydi.");
                        return;
                      }
                      setActiveZoneModel(m);
                    }}
                    className="flex-grow px-4 py-2.5 text-[9px] font-black uppercase tracking-wider text-brand-primary bg-brand-accent hover:scale-[1.02] active:scale-[0.98] rounded-xl transition-all flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5" /> 3D Pins ({ (m.pins || []).length })
                  </button>

                  {/* Edit metadata button */}
                  <button 
                    onClick={() => setEditing(m)}
                    className="p-3 text-brand-primary hover:bg-slate-50 hover:text-brand-primary rounded-xl transition-all border border-brand-border cursor-pointer"
                    title="Model ma'lumotlarini o'zgartirish"
                  >
                    <Edit2 size={15} />
                  </button>

                  {/* Delete button */}
                  <button 
                    onClick={() => handleDelete(m.id, !isCustom)}
                    className="p-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all border border-brand-border cursor-pointer hover:scale-105 active:scale-95"
                    title="Modelni o'chirish"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Editing / Creation Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-brand-primary/95 backdrop-blur-md overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl border-4 border-white/10 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Modal header */}
            <div className="p-6 sm:p-8 border-b border-brand-border bg-brand-bg flex items-center justify-between shrink-0">
              <h2 className="text-xl sm:text-2xl font-black text-brand-primary uppercase tracking-tighter">
                {editing.id ? 'Model Ma\'lumotlarini Tahrirlash' : 'Yangi 3D Model Qo\'shish'}
              </h2>
              <button 
                onClick={() => setEditing(null)} 
                className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-brand-border text-brand-primary hover:text-red-500 transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal body form */}
            <div className="p-6 sm:p-10 space-y-6 overflow-y-auto">
              <form onSubmit={handleSave} className="space-y-6 text-left">
                
                {/* ID and system */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-brand-muted uppercase tracking-widest mb-2">Model ID *</label>
                    <input 
                      type="text" 
                      value={editing.id} 
                      onChange={e => setEditing({ ...editing, id: e.target.value.trim().toLowerCase() })} 
                      placeholder="masalan: human-skull" 
                      className="w-full p-4 bg-brand-bg rounded-2xl border-2 border-brand-border focus:border-brand-accent outline-none font-bold text-xs" 
                      required 
                      disabled={!!editing.thumbnail && models.some(m => m.id === editing.id && (m as any).isStatic)} // prevent renaming static key
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-brand-muted uppercase tracking-widest mb-2">Anatomiya Tizimi *</label>
                    <select 
                      value={editing.system} 
                      onChange={e => setEditing({ ...editing, system: e.target.value as AnatomySystem })}
                      className="w-full p-4 bg-brand-bg rounded-2xl border-2 border-brand-border outline-none text-xs font-bold text-brand-primary focus:border-brand-accent transition-all cursor-pointer"
                    >
                      {SYSTEM_META.map(s => <option key={s.id} value={s.id}>{s.label.uz}</option>)}
                    </select>
                  </div>
                </div>

                {/* Multilingual Titles */}
                <div className="space-y-4">
                  <span className="block text-[10px] font-black text-brand-muted uppercase tracking-widest">Model Nomi (Multilingual)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <input 
                        type="text" 
                        value={editing.title.uz} 
                        onChange={e => setEditing({ ...editing, title: { ...editing.title, uz: e.target.value } })} 
                        placeholder="O'zbekcha Nomi" 
                        className="w-full p-4 bg-brand-bg rounded-2xl border-2 border-brand-border focus:border-brand-accent outline-none font-bold text-xs"
                        required 
                      />
                    </div>
                    <div>
                      <input 
                        type="text" 
                        value={editing.title.ru || ''} 
                        onChange={e => setEditing({ ...editing, title: { ...editing.title, ru: e.target.value } })} 
                        placeholder="Ruscha Nomi (RU)" 
                        className="w-full p-4 bg-brand-bg rounded-2xl border-2 border-brand-border focus:border-brand-accent outline-none font-bold text-xs"
                      />
                    </div>
                    <div>
                      <input 
                        type="text" 
                        value={editing.title.en || ''} 
                        onChange={e => setEditing({ ...editing, title: { ...editing.title, en: e.target.value } })} 
                        placeholder="Inglizcha Nomi (EN / Lotin)" 
                        className="w-full p-4 bg-brand-bg rounded-2xl border-2 border-brand-border focus:border-brand-accent outline-none font-bold text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Descriptions */}
                <div className="space-y-4">
                  <span className="block text-[10px] font-black text-brand-muted uppercase tracking-widest">Tavsif va Izoh (UZ / RU / EN)</span>
                  <div className="space-y-3">
                    <textarea 
                      value={editing.description?.uz || ''} 
                      onChange={e => setEditing({ ...editing, description: { ...(editing.description || {uz:'', ru:'', en:''}), uz: e.target.value } })} 
                      placeholder="O'zbekcha batafsil ilmiy tavsif..." 
                      className="w-full p-4 bg-brand-bg rounded-2xl border-2 border-brand-border focus:border-brand-accent outline-none text-xs font-medium" 
                      rows={2}
                    />
                    <textarea 
                      value={editing.description?.ru || ''} 
                      onChange={e => setEditing({ ...editing, description: { ...(editing.description || {uz:'', ru:'', en:''}), ru: e.target.value } })} 
                      placeholder="Ruscha tavsif (RU)..." 
                      className="w-full p-4 bg-brand-bg rounded-2xl border-2 border-brand-border focus:border-brand-accent outline-none text-xs font-medium" 
                      rows={2}
                    />
                  </div>
                </div>

                {/* Region / Soha */}
                <div>
                  <label className="block text-[10px] font-black text-brand-muted uppercase tracking-widest mb-2">Tanadagi Soha (Region)</label>
                  <select 
                    value={editing.region || 'other'} 
                    onChange={e => setEditing({ ...editing, region: e.target.value as BodyRegion })}
                    className="w-full p-4 bg-brand-bg rounded-2xl border-2 border-brand-border outline-none text-xs font-bold text-brand-primary focus:border-brand-accent transition-all cursor-pointer"
                  >
                    {REGION_META.map(r => <option key={r.id} value={r.id}>{r.label.uz}</option>)}
                  </select>
                </div>

                {/* Sketchfab Link & auto conversion */}
                <div>
                  <label className="block text-[10px] font-black text-brand-muted uppercase tracking-widest mb-2">
                    Sketchfab Embed Link (Yoki oddiy link kiriting, avtomatik o'giriladi)
                  </label>
                  <input 
                    type="text" 
                    value={editing.embedUrl || ''} 
                    onChange={e => {
                      const link = e.target.value;
                      const converted = convertSketchfabLink(link);
                      setEditing({ ...editing, embedUrl: converted });
                    }} 
                    placeholder="https://sketchfab.com/3d-models/..." 
                    className="w-full p-4 bg-brand-bg rounded-2xl border-2 border-brand-border focus:border-brand-accent outline-none text-xs font-bold text-blue-600" 
                  />
                  {editing.embedUrl && editing.embedUrl.includes('/embed') && (
                    <p className="text-[10px] text-green-600 font-bold mt-1.5 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Sketchfab embed havolasiga muvaffaqiyatli o'girildi!
                    </p>
                  )}
                </div>

                {/* 3D GLB file uploading */}
                <div>
                  <label className="block text-[10px] font-black text-brand-muted uppercase tracking-widest mb-2">
                    Yoki Kompyuterdan to'g'ridan-to'g'ri .GLB 3D model fayli yuklash (3D Pins uchun tavsiya etiladi)
                  </label>
                  <div className="flex gap-4">
                    <input 
                      type="text" 
                      value={editing.fileUrl || ''} 
                      onChange={e => setEditing({ ...editing, fileUrl: e.target.value.trim() })} 
                      placeholder="GLB fayl havolasi..." 
                      className="flex-grow p-4 bg-brand-bg rounded-2xl border-2 border-brand-border focus:border-brand-accent outline-none text-xs font-mono" 
                    />
                    <label className="cursor-pointer bg-slate-800 hover:bg-slate-900 text-white px-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 border border-slate-700 shadow-sm active:scale-95 transition-all">
                      <Upload size={14} />
                      {uploadProgress !== null ? `${Math.round(uploadProgress)}%` : 'YUKLASH'}
                      <input type="file" accept=".glb,.gltf" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Image upload */}
                <div>
                  <label className="block text-[10px] font-black text-brand-muted uppercase tracking-widest mb-2">
                    Model Rasmi (Thumbnail)
                  </label>
                  <div className="flex gap-4">
                    <input 
                      type="text" 
                      value={editing.thumbnail || ''} 
                      onChange={e => setEditing({ ...editing, thumbnail: e.target.value.trim() })} 
                      placeholder="Rasm havolasi..." 
                      className="flex-grow p-4 bg-brand-bg rounded-2xl border-2 border-brand-border focus:border-brand-accent outline-none text-xs" 
                    />
                    <label className="cursor-pointer bg-brand-primary text-white px-5 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 border border-slate-700 shadow-sm active:scale-95 transition-all">
                      <Upload size={14} />
                      {imageUploadProgress !== null ? `${Math.round(imageUploadProgress)}%` : 'RASM YUKLASH'}
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    {editing.thumbnail && (
                      <button
                        type="button"
                        onClick={() => setEditing({ ...editing, thumbnail: '' })}
                        className="px-5 py-4 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-colors flex items-center gap-1.5 border border-rose-200 cursor-pointer"
                        title="Rasmni o'chirish"
                      >
                        <Trash2 size={14} />
                        O'CHIRISH
                      </button>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-[10px] font-black text-brand-muted uppercase tracking-widest mb-2">Teglar (Vergul orqali)</label>
                  <input 
                    type="text" 
                    value={(editing.tags || []).join(', ')} 
                    onChange={e => setEditing({ ...editing, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} 
                    placeholder="yurak, o'pka, organ, chest" 
                    className="w-full p-4 bg-brand-bg rounded-2xl border-2 border-brand-border focus:border-brand-accent outline-none text-xs font-bold" 
                  />
                </div>

                {/* Author and license */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-brand-muted uppercase tracking-widest mb-2">Muallif (Author)</label>
                    <input type="text" value={editing.author || ''} onChange={e => setEditing({ ...editing, author: e.target.value })} className="w-full p-4 bg-brand-bg rounded-2xl border-2 border-brand-border focus:border-brand-accent outline-none text-xs font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-brand-muted uppercase tracking-widest mb-2">Litsenziya</label>
                    <input type="text" value={editing.license || ''} onChange={e => setEditing({ ...editing, license: e.target.value })} className="w-full p-4 bg-brand-bg rounded-2xl border-2 border-brand-border focus:border-brand-accent outline-none text-xs font-bold" />
                  </div>
                </div>

                {/* Submit button row */}
                <div className="flex justify-end gap-4 pt-6 border-t border-brand-border">
                  <button type="button" onClick={() => setEditing(null)} className="font-black text-[10px] uppercase tracking-widest text-brand-muted hover:text-brand-primary transition-all cursor-pointer">BEKOR QILISH</button>
                  <button type="submit" className="px-8 py-4 bg-brand-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-brand-primary/20 hover:bg-slate-800 transition-all flex items-center gap-2 cursor-pointer">
                    <Save size={16} /> MODELNI SAQLASH
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3D MODEL ACTIVE PIN PLACEMENT EDITOR (For GLB Models)
// ---------------------------------------------------------------------------
function Model3DZoneEditor({ model, onClose }: { model: AnatomyModel; onClose: () => void }) {
  const [pins, setPins] = useState<AnatomyModelPin[]>(model.pins || []);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fov, setFov] = useState(45);
  const [cameraOrbit, setCameraOrbit] = useState("0deg 75deg 105%");
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [modelScale, setModelScale] = useState<string>("1 1 1");
  const modelViewerRef = useRef<any>(null);

  const reframeModel = (overrideScaleMultiplier?: number) => {
    const el = modelViewerRef.current;
    if (!el) return;

    try {
      const center = el.getBoundingBoxCenter();
      const dimensions = el.getDimensions();
      if (center && dimensions) {
        let scaleMultiplier = 1;
        if (overrideScaleMultiplier !== undefined) {
          scaleMultiplier = overrideScaleMultiplier;
        } else {
          const scaleAttr = el.getAttribute('scale') || '';
          if (scaleAttr.includes('1000')) {
            scaleMultiplier = 1000;
          } else {
            scaleMultiplier = modelScale === "1000 1000 1000" ? 1000 : 1;
          }
        }

        const targetString = `${(center.x * scaleMultiplier).toFixed(5)}m ${(center.y * scaleMultiplier).toFixed(5)}m ${(center.z * scaleMultiplier).toFixed(5)}m`;
        el.cameraTarget = targetString;

        const maxDim = Math.max(dimensions.x, dimensions.y, dimensions.z) * scaleMultiplier;
        const optimalRadius = Math.max(maxDim * 1.5, 0.05);

        let thetaDeg = "0deg";
        let phiDeg = "75deg";

        if (typeof el.getCameraOrbit === 'function') {
          const currentOrbit = el.getCameraOrbit();
          if (currentOrbit) {
            thetaDeg = `${(currentOrbit.theta * 180 / Math.PI).toFixed(1)}deg`;
            phiDeg = `${(currentOrbit.phi * 180 / Math.PI).toFixed(1)}deg`;
          }
        }

        const orbitString = `${thetaDeg} ${phiDeg} ${optimalRadius.toFixed(4)}m`;
        setCameraOrbit(orbitString);
        el.cameraOrbit = orbitString;

        setFov(45);
        el.fieldOfView = "45deg";
      } else {
        el.cameraTarget = "0m 0m 0m";
        el.cameraOrbit = "0deg 75deg 105%";
        setCameraOrbit("0deg 75deg 105%");
        setFov(45);
        el.fieldOfView = "45deg";
      }
    } catch (err) {
      el.cameraTarget = "0m 0m 0m";
      el.cameraOrbit = "0deg 75deg 105%";
      setCameraOrbit("0deg 75deg 105%");
      setFov(45);
      el.fieldOfView = "45deg";
    }
  };

  useEffect(() => {
    const el = modelViewerRef.current;
    if (!el) return;

    const handleLoad = () => {
      let scaleMult = 1;
      const dimensions = el.getDimensions();
      if (dimensions) {
        const maxDim = Math.max(dimensions.x, dimensions.y, dimensions.z);
        if (maxDim > 0 && maxDim < 0.05) {
          scaleMult = 1000;
          setModelScale("1000 1000 1000");
        } else {
          setModelScale("1 1 1");
        }
      }
      setModelReady(true);
      setTimeout(() => {
        reframeModel(scaleMult);
      }, 50);
    };

    const handleError = () => {
      setError("GLB modelni yuklashda xatolik! Fayl havolasi noto'g'ri yoki server CORS to'siq o'rnatgan.");
    };

    el.addEventListener('load', handleLoad);
    el.addEventListener('error', handleError);

    return () => {
      el.removeEventListener('load', handleLoad);
      el.removeEventListener('error', handleError);
    };
  }, [model.fileUrl]);

  const handleModelClick = (e: any) => {
    if (e.target && (e.target.closest('button') || e.target.closest('a') || e.target.closest('input') || e.target.closest('[slot]'))) {
      return;
    }

    const modelViewer = modelViewerRef.current;
    if (!modelViewer) return;

    const rect = modelViewer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const hit = modelViewer.positionAndNormalFromPoint(x, y);
    if (hit) {
      const position = `${hit.position.x.toFixed(4)} ${hit.position.y.toFixed(4)} ${hit.position.z.toFixed(4)}`;
      const normal = `${hit.normal.x.toFixed(4)} ${hit.normal.y.toFixed(4)} ${hit.normal.z.toFixed(4)}`;
      
      const newPin: AnatomyModelPin = {
        id: 'pin_' + Date.now().toString(36),
        latinName: 'Yangi Anatomik Belgi',
        uzbekName: '',
        englishName: '',
        russianName: '',
        system: model.system,
        position,
        normal,
        description: { uz: '', ru: '', en: '' }
      };

      setPins(prev => [...prev, newPin]);
      setSelectedPinId(newPin.id);
    }
  };

  const deletePin = (id: string) => {
    setPins(prev => prev.filter(p => p.id !== id));
    if (selectedPinId === id) setSelectedPinId(null);
  };

  const handleSavePins = async () => {
    setIsSaving(true);
    try {
      const updatedModel = { ...model, pins };
      await dbService.saveAnatomyModel(updatedModel);
      alert("Pins (belgilar) muvaffaqiyatli saqlandi!");
      onClose();
    } catch (err: any) {
      alert("Saqlashda xatolik yuz berdi: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const activePin = pins.find(p => p.id === selectedPinId);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col md:flex-row text-white overflow-hidden">
      {/* 3D Viewer Area */}
      <div className="flex-grow relative h-[60vh] md:h-full bg-slate-900 flex items-center justify-center">
        {error ? (
          <div className="text-center p-8 max-w-md bg-slate-900/80 rounded-3xl border border-red-500/20">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4 animate-pulse" />
            <h4 className="font-bold text-red-400">Xatolik yuz berdi</h4>
            <p className="text-xs text-slate-400 mt-2">{error}</p>
          </div>
        ) : (
          <ModelViewer
            ref={modelViewerRef}
            src={model.fileUrl}
            alt={model.title.uz}
            camera-controls
            interaction-prompt="none"
            scale={modelScale}
            field-of-view={`${fov}deg`}
            onClick={handleModelClick}
            className="w-full h-full cursor-crosshair bg-slate-950"
            style={{ '--min-hotspot-opacity': '0' } as any}
          >
            {pins.map(p => (
              <button
                key={p.id}
                slot={`hotspot-${p.id}`}
                data-position={p.position}
                data-normal={p.normal}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPinId(p.id);
                }}
                className={`w-5 h-5 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center font-black text-[9px] shadow-lg ${
                  selectedPinId === p.id 
                    ? 'bg-brand-accent text-brand-primary border-white scale-125' 
                    : 'bg-brand-primary text-brand-accent border-brand-accent hover:scale-110'
                }`}
              >
                ●
              </button>
            ))}
          </ModelViewer>
        )}

        {/* Back and title bar overlay */}
        <div className="absolute top-6 left-6 flex items-center gap-4 bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/5 max-w-xl">
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/10 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="text-left">
            <span className="text-[9px] font-black tracking-widest text-brand-accent uppercase block">3D Pins placement editor</span>
            <h4 className="text-sm font-black uppercase truncate max-w-xs">{model.title.uz}</h4>
          </div>
        </div>

        {/* Instructions overlay */}
        <div className="absolute bottom-6 left-6 bg-slate-900/80 backdrop-blur-md p-4 rounded-xl text-left border border-white/5 hidden sm:block text-xs max-w-sm">
          <p className="font-bold text-brand-accent mb-1 flex items-center gap-1">
            <Sparkles className="w-4 h-4" /> Yo'riqnoma:
          </p>
          <ul className="list-disc pl-4 space-y-1 text-slate-300 font-medium">
            <li>Modelni o'ng/chap tugma bilan aylantiring va kattalashtiring.</li>
            <li>Model ustiga bosib, <strong className="text-brand-accent">yangi pin (belgi)</strong> qo'shing.</li>
            <li>O'ng tarafdagi paneldan tanlangan pinning ma'lumotlarini tahrirlang.</li>
          </ul>
        </div>
      </div>

      {/* Sidebar Control Panel */}
      <div className="w-full md:w-[420px] shrink-0 bg-slate-900 border-t md:border-t-0 md:border-l border-white/10 flex flex-col h-[40vh] md:h-full">
        {/* Panel Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0 bg-slate-950">
          <div className="text-left">
            <h3 className="text-base font-black uppercase tracking-tight">Anatomik Belgilar</h3>
            <span className="text-[10px] text-brand-muted font-bold block uppercase mt-0.5">Jami pins: {pins.length} ta</span>
          </div>
          <button 
            onClick={handleSavePins}
            disabled={isSaving}
            className="px-5 py-2.5 bg-brand-accent hover:bg-brand-accent/90 text-brand-primary font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            SAQLASH
          </button>
        </div>

        {/* List & Edit panels */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 text-left">
          {activePin ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest">Pin Tahrirlash ({activePin.id})</span>
                <button 
                  onClick={() => deletePin(activePin.id)}
                  className="px-3 py-1 bg-red-900/40 text-red-400 hover:bg-red-900/60 rounded-lg text-[9px] font-black uppercase tracking-wider border border-red-500/20 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Pinni o'chirish
                </button>
              </div>

              {/* Pin fields */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Lotincha Nomi</label>
                  <input 
                    type="text" 
                    value={activePin.latinName} 
                    onChange={e => setPins(prev => prev.map(p => p.id === activePin.id ? { ...p, latinName: e.target.value } : p))} 
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-xs outline-none focus:border-brand-accent font-bold italic"
                    placeholder="masalan: Os nasale"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">O'zbekcha Nomi (UZ)</label>
                  <input 
                    type="text" 
                    value={activePin.uzbekName} 
                    onChange={e => setPins(prev => prev.map(p => p.id === activePin.id ? { ...p, uzbekName: e.target.value } : p))} 
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-xs outline-none focus:border-brand-accent font-bold"
                    placeholder="Burun suyagi"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ruscha Nomi (RU)</label>
                  <input 
                    type="text" 
                    value={activePin.russianName || ''} 
                    onChange={e => setPins(prev => prev.map(p => p.id === activePin.id ? { ...p, russianName: e.target.value } : p))} 
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-xs outline-none focus:border-brand-accent font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Inglizcha Nomi (EN)</label>
                  <input 
                    type="text" 
                    value={activePin.englishName || ''} 
                    onChange={e => setPins(prev => prev.map(p => p.id === activePin.id ? { ...p, englishName: e.target.value } : p))} 
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-xs outline-none focus:border-brand-accent font-bold"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Anatomik Izoh (O'zbekcha)</label>
                  <textarea 
                    value={activePin.description?.uz || ''} 
                    onChange={e => setPins(prev => prev.map(p => p.id === activePin.id ? { ...p, description: { ...(p.description || {uz:'', ru:'', en:''}), uz: e.target.value } } : p))} 
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-white text-xs outline-none focus:border-brand-accent font-medium"
                    rows={3}
                    placeholder="Ushbu anatomik nuqta yoki tuzilish haqida qisqacha ma'lumot..."
                  />
                </div>

                {/* Return button */}
                <button 
                  onClick={() => setSelectedPinId(null)} 
                  className="w-full mt-4 py-3 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer border border-white/10 text-center"
                >
                  Ro'yxatga qaytish
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <span className="block text-[10px] font-black text-brand-muted uppercase tracking-widest mb-2">Barcha Pinlar Ro'yxati</span>
              {pins.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-white/5 rounded-2xl text-slate-500 font-medium text-xs">
                  Hozircha belgilar yo'q. Chap tarafdagi 3D model ustiga bosib, birinchi pinni joylashtiring.
                </div>
              ) : (
                <div className="space-y-2">
                  {pins.map((p, index) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPinId(p.id)}
                      className="w-full bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl p-4 flex items-center justify-between group transition-all text-left cursor-pointer"
                    >
                      <div className="min-w-0">
                        <span className="text-[10px] font-black text-brand-accent uppercase block mb-0.5">PIN #{index + 1}</span>
                        <h4 className="text-xs font-black truncate max-w-xs">{p.latinName || 'Nomsiz Pin'}</h4>
                        <span className="text-[10px] text-slate-400 font-bold block mt-0.5 truncate">{p.uzbekName || '—'}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-brand-accent group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
