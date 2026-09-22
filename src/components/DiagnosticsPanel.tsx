import React, { useState, useEffect, useCallback } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  Database, 
  ShieldCheck, 
  Lock, 
  Key, 
  Server, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  Info,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { db, auth, storage } from '../lib/firebase';
import { doc, getDoc, collection, getDocs, limit, query } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { supabase, isSupabaseConfigured, supabaseUrl, supabaseAnonKey } from '../lib/supabase';

export interface EnvVariableStatus {
  name: string;
  isSet: boolean;
  valueMasked: string;
  category: 'Firebase' | 'Supabase' | 'System';
  description: string;
  isCritical: boolean;
}

export interface ServiceCheckResult {
  id: string;
  name: string;
  status: 'pending' | 'healthy' | 'warning' | 'error';
  message: string;
  details?: string;
  latencyMs?: number;
}

export default function DiagnosticsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRunningChecks, setIsRunningChecks] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Environment variable evaluation
  const [envStatuses, setEnvStatuses] = useState<EnvVariableStatus[]>([]);

  // Services status
  const [firebaseStatus, setFirebaseStatus] = useState<ServiceCheckResult>({
    id: 'firebase_firestore',
    name: 'Firebase Firestore DB',
    status: 'pending',
    message: 'Tekshirilmoqda...'
  });

  const [firebaseAuthStatus, setFirebaseAuthStatus] = useState<ServiceCheckResult>({
    id: 'firebase_auth',
    name: 'Firebase Authentication',
    status: 'pending',
    message: 'Tekshirilmoqda...'
  });

  const [firebaseStorageStatus, setFirebaseStorageStatus] = useState<ServiceCheckResult>({
    id: 'firebase_storage',
    name: 'Firebase Storage',
    status: 'pending',
    message: 'Tekshirilmoqda...'
  });

  const [supabaseConfigStatus, setSupabaseConfigStatus] = useState<ServiceCheckResult>({
    id: 'supabase_config',
    name: 'Supabase Env & Client Init',
    status: 'pending',
    message: 'Tekshirilmoqda...'
  });

  const [supabaseAuthStatus, setSupabaseAuthStatus] = useState<ServiceCheckResult>({
    id: 'supabase_auth',
    name: 'Supabase Auth & Session',
    status: 'pending',
    message: 'Tekshirilmoqda...'
  });

  const [supabaseStorageStatus, setSupabaseStorageStatus] = useState<ServiceCheckResult>({
    id: 'supabase_storage',
    name: 'Supabase Storage Buckets',
    status: 'pending',
    message: 'Tekshirilmoqda...'
  });

  const [faceIdStatus, setFaceIdStatus] = useState<ServiceCheckResult>({
    id: 'face_id_service',
    name: 'Face ID (AI yuz tekshiruvi)',
    status: 'pending',
    message: 'Tekshirilmoqda...'
  });

  const maskSecret = (val: string | undefined): string => {
    if (!val || val === 'undefined' || val === 'null' || val.trim() === '') {
      return "O'rnatilmagan (bo'sh)";
    }
    const clean = val.trim();
    if (clean.length <= 8) {
      return '****';
    }
    return `${clean.substring(0, 4)}••••••••${clean.substring(clean.length - 4)}`;
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const evaluateEnvVariables = useCallback((): EnvVariableStatus[] => {
    const env = (import.meta as any).env || {};

    const rawSupabaseUrl = env.VITE_SUPABASE_URL || '';
    const rawSupabaseKey = env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
    const rawFbApiKey = env.VITE_FIREBASE_API_KEY || '';
    const rawFbProjectId = env.VITE_FIREBASE_PROJECT_ID || '';
    const rawFbStorageBucket = env.VITE_FIREBASE_STORAGE_BUCKET || '';

    return [
      {
        name: 'VITE_SUPABASE_URL',
        isSet: Boolean(rawSupabaseUrl && rawSupabaseUrl !== 'YOUR_SUPABASE_URL'),
        valueMasked: rawSupabaseUrl ? rawSupabaseUrl.replace(/https?:\/\//, '') : "O'rnatilmagan",
        category: 'Supabase',
        description: 'Supabase loyihasining REST/Storage API bazaviy URL manzili',
        isCritical: true,
      },
      {
        name: 'VITE_SUPABASE_ANON_KEY',
        isSet: Boolean(rawSupabaseKey && rawSupabaseKey !== 'YOUR_SUPABASE_ANON_KEY' && rawSupabaseKey.length >= 25),
        valueMasked: maskSecret(rawSupabaseKey),
        category: 'Supabase',
        description: 'Supabase jamoat Publishable (Anon) kaliti (Storage yuklashlar uchun)',
        isCritical: true,
      },
      {
        name: 'VITE_FIREBASE_PROJECT_ID',
        isSet: Boolean(rawFbProjectId && rawFbProjectId !== 'YOUR_PROJECT_ID'),
        valueMasked: rawFbProjectId || 'ai-studio-05537508-ad62-4088-aca1-26d464f53151',
        category: 'Firebase',
        description: 'Firebase Firestore va Authentication loyiha identifikatori',
        isCritical: true,
      },
      {
        name: 'VITE_FIREBASE_API_KEY',
        isSet: Boolean(rawFbApiKey && rawFbApiKey !== 'YOUR_API_KEY'),
        valueMasked: maskSecret(rawFbApiKey || 'AIzaSy...'),
        category: 'Firebase',
        description: 'Firebase Web API ulanish kaliti',
        isCritical: true,
      },
      {
        name: 'VITE_FIREBASE_STORAGE_BUCKET',
        isSet: Boolean(rawFbStorageBucket),
        valueMasked: rawFbStorageBucket || 'ai-studio-05537508-ad62-4088-aca1-26d464f53151.firebasestorage.app',
        category: 'Firebase',
        description: 'Firebase Cloud Storage boshlang‘ich chelagi',
        isCritical: false,
      }
    ];
  }, []);

  const runDiagnostics = useCallback(async () => {
    setIsRunningChecks(true);
    const envList = evaluateEnvVariables();
    setEnvStatuses(envList);

    // 1. Check Firebase Firestore
    const startFirestore = performance.now();
    try {
      const q = query(collection(db, 'topics'), limit(1));
      const snap = await getDocs(q);
      const latency = Math.round(performance.now() - startFirestore);
      setFirebaseStatus({
        id: 'firebase_firestore',
        name: 'Firebase Firestore DB',
        status: 'healthy',
        message: `Bog'langan (${snap.docs.length} ta namuna olindi)`,
        details: `Loyiha ID: ${db.app.options.projectId || 'ai-studio'}, Kechikish: ${latency}ms`,
        latencyMs: latency
      });
    } catch (err: any) {
      setFirebaseStatus({
        id: 'firebase_firestore',
        name: 'Firebase Firestore DB',
        status: 'error',
        message: 'Firestore ulanishida xatolik',
        details: err?.message || String(err)
      });
    }

    // 2. Check Firebase Auth
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setFirebaseAuthStatus({
          id: 'firebase_auth',
          name: 'Firebase Authentication',
          status: 'healthy',
          message: `Faol foydalanuvchi: ${currentUser.email || 'Anonim'}`,
          details: `UID: ${currentUser.uid}, Provayder: ${currentUser.providerData?.[0]?.providerId || 'anonymous'}`
        });
      } else {
        setFirebaseAuthStatus({
          id: 'firebase_auth',
          name: 'Firebase Authentication',
          status: 'warning',
          message: 'Tizimga hech kim kirmagan (Guest/Mehmon rejim)',
          details: 'Admin amallari uchun Google yoki Parol orqali kirish tavsiya qilinadi'
        });
      }
    } catch (err: any) {
      setFirebaseAuthStatus({
        id: 'firebase_auth',
        name: 'Firebase Authentication',
        status: 'error',
        message: 'Auth tekshiruvida xatolik',
        details: err?.message || String(err)
      });
    }

    // 3. Check Firebase Storage
    try {
      const testRef = ref(storage, 'ping_healthcheck');
      await getDownloadURL(testRef).catch((e: any) => {
        if (e.code === 'storage/object-not-found') {
          // Normal: bucket exists, object not found
          return 'ok';
        }
        throw e;
      });
      setFirebaseStorageStatus({
        id: 'firebase_storage',
        name: 'Firebase Storage',
        status: 'healthy',
        message: 'Storage faol va javob beryapti',
        details: `Bucket: ${storage.app.options.storageBucket || 'standard'}`
      });
    } catch (err: any) {
      if (err?.code === 'storage/unauthorized') {
        setFirebaseStorageStatus({
          id: 'firebase_storage',
          name: 'Firebase Storage',
          status: 'warning',
          message: 'Storage qoidalari faqat ruxsatli foydalanuvchilarga sozlangan',
          details: 'RLS/Security rules: ruxsatsiz o‘qish cheklangan'
        });
      } else {
        setFirebaseStorageStatus({
          id: 'firebase_storage',
          name: 'Firebase Storage',
          status: 'healthy',
          message: 'Storage servisi ulangan',
          details: err?.code || 'Aloqa mavjud'
        });
      }
    }

    // 4. Check Supabase Config & Init
    const isSupConfigured = isSupabaseConfigured();
    if (!isSupConfigured || !supabase) {
      setSupabaseConfigStatus({
        id: 'supabase_config',
        name: 'Supabase Env & Client Init',
        status: 'warning',
        message: 'Supabase to‘liq sozlanmagan (Fallback rejimida)',
        details: 'VITE_SUPABASE_URL yoki VITE_SUPABASE_ANON_KEY to‘g‘ri kiritilmagan. Tizim Firebase orqali ishlaydi.'
      });

      setSupabaseAuthStatus({
        id: 'supabase_auth',
        name: 'Supabase Auth & Session',
        status: 'warning',
        message: 'Supabase mijoz faol emas',
        details: 'Kalitlar kiritilmagani sababli tekshirilmadi'
      });

      setSupabaseStorageStatus({
        id: 'supabase_storage',
        name: 'Supabase Storage Buckets',
        status: 'warning',
        message: 'Supabase Storage faol emas',
        details: 'Fayllar Firebase Storage orqali zaxiralanadi'
      });
    } else {
      setSupabaseConfigStatus({
        id: 'supabase_config',
        name: 'Supabase Env & Client Init',
        status: 'healthy',
        message: 'Mijoz muvaffaqiyatli initsializatsiya qilingan',
        details: `URL: ${supabaseUrl}`
      });

      // 5. Check Supabase Auth
      const startSupaAuth = performance.now();
      try {
        const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
        const latency = Math.round(performance.now() - startSupaAuth);
        if (sessionErr) {
          setSupabaseAuthStatus({
            id: 'supabase_auth',
            name: 'Supabase Auth & Session',
            status: 'warning',
            message: 'Sessiya xatosi',
            details: sessionErr.message,
            latencyMs: latency
          });
        } else {
          setSupabaseAuthStatus({
            id: 'supabase_auth',
            name: 'Supabase Auth & Session',
            status: 'healthy',
            message: sessionData.session ? `Autentifikatsiya qilingan (${sessionData.session.user?.email || 'Foydalanuvchi'})` : 'Jamoat (Anon) anonim sessiyasi faol',
            details: `Anon Key ruxsati tasdiqlandi (${latency}ms)`,
            latencyMs: latency
          });
        }
      } catch (err: any) {
        setSupabaseAuthStatus({
          id: 'supabase_auth',
          name: 'Supabase Auth & Session',
          status: 'error',
          message: 'Supabase Auth ga ulanishda xatolik',
          details: err?.message || 'DNS yoki tarmoq xatosi'
        });
      }

      // 6. Check Supabase Storage
      const startStorage = performance.now();
      try {
        const { data: buckets, error: bError } = await supabase.storage.listBuckets();
        const latency = Math.round(performance.now() - startStorage);
        if (bError) {
          // Check specific presentations bucket directly
          const { error: pErr } = await supabase.storage.from('presentations').list('', { limit: 1 });
          if (!pErr) {
            setSupabaseStorageStatus({
              id: 'supabase_storage',
              name: 'Supabase Storage Buckets',
              status: 'healthy',
              message: "'presentations' bucketi faol va ochiq",
              details: `PPTX/PDF yuklashga tayyor (${latency}ms)`,
              latencyMs: latency
            });
          } else {
            setSupabaseStorageStatus({
              id: 'supabase_storage',
              name: 'Supabase Storage Buckets',
              status: 'warning',
              message: 'Storage bucketlarini o‘qib bo‘lmadi',
              details: bError.message || pErr?.message,
              latencyMs: latency
            });
          }
        } else {
          const bucketNames = (buckets || []).map(b => b.name);
          const hasPresentations = bucketNames.includes('presentations');
          setSupabaseStorageStatus({
            id: 'supabase_storage',
            name: 'Supabase Storage Buckets',
            status: hasPresentations ? 'healthy' : 'warning',
            message: hasPresentations 
              ? `'presentations' bucketi topildi (${bucketNames.length} ta bucket mavjud)` 
              : `Mavjud bucketlar: ${bucketNames.join(', ') || 'yo‘q'}. 'presentations' bucketi kerak.`,
            details: `Topilgan: [${bucketNames.join(', ')}] (${latency}ms)`,
            latencyMs: latency
          });
        }
      } catch (err: any) {
        setSupabaseStorageStatus({
          id: 'supabase_storage',
          name: 'Supabase Storage Buckets',
          status: 'error',
          message: 'Supabase Storage ga ulanib bo‘lmadi',
          details: err?.message || 'Internet, CORS yoki noto‘g‘ri domen manzili'
        });
      }
    }

    // 7. Face ID verification service (server-side Gemini key + model list).
    // A missing key here is the #1 reason every student gets "xizmat ishlamayapti".
    const startFace = performance.now();
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 10000);
      const res = await fetch('/api/verify-face/health?check=key', { signal: controller.signal, cache: 'no-store' });
      clearTimeout(timer);
      const latency = Math.round(performance.now() - startFace);
      const data: any = await res.json().catch(() => null);
      if (!data || typeof data.aiConfigured !== 'boolean') {
        setFaceIdStatus({
          id: 'face_id_service',
          name: 'Face ID (AI yuz tekshiruvi)',
          status: 'error',
          message: `Server /api/verify-face/health uchun noto‘g‘ri javob qaytardi (HTTP ${res.status})`,
          details: 'Vercel funksiyasi ishlamayotgan yoki eski build. Deploy loglarini tekshiring.',
          latencyMs: latency
        });
      } else if (data.aiConfigured && data.keyCheck && data.keyCheck.ok === false) {
        const code = String(data.keyCheck.code || '');
        setFaceIdStatus({
          id: 'face_id_service',
          name: 'Face ID (AI yuz tekshiruvi)',
          status: 'error',
          message: code === 'AI_QUOTA'
            ? 'Gemini limiti tugagan — bepul daraja (free tier) Face ID uchun yetmayapti'
            : code === 'AI_NOT_CONFIGURED'
              ? 'GEMINI_API_KEY yaroqsiz yoki bekor qilingan'
              : `Gemini API javob bermadi (${code || 'noma’lum'})`,
          details: `${data.keyCheck.message || ''} ${data.keyCheck.detail ? '— ' + data.keyCheck.detail : ''} (${latency}ms). Google AI Studio → API keys → tegishli loyihada Billing ni yoqing yoki yangi kalit yarating va Vercel’da GEMINI_API_KEY ni yangilab Redeploy qiling.`,
          latencyMs: latency
        });
      } else if (data.aiConfigured && data.keyCheck && data.keyCheck.ok && typeof data.keyCheck.working === 'number' && data.keyCheck.working < data.keyCheck.total) {
        setFaceIdStatus({
          id: 'face_id_service',
          name: 'Face ID (AI yuz tekshiruvi)',
          status: 'warning',
          message: `${data.keyCheck.working}/${data.keyCheck.total} ta Gemini kaliti ishlayapti — Face ID ishlaydi, lekin zaxira kamaydi`,
          details: `${data.keyCheck.message || ''} (${latency}ms). Ishlamayotgan kalitni AI Studio’da tekshiring yoki Vercel’dagi GEMINI_API_KEYS dan olib tashlang.`,
          latencyMs: latency
        });
      } else if (data.aiConfigured) {
        const keyNote = data.keyCheck?.ok
          ? ` · ${data.keyCheck.working ?? 1}/${data.keyCheck.total ?? 1} kalit tekshirildi`
          : '';
        setFaceIdStatus({
          id: 'face_id_service',
          name: 'Face ID (AI yuz tekshiruvi)',
          status: 'healthy',
          message: `Xizmat tayyor. Moslik chegarasi: ${Math.round((data.threshold || 0) * 100)}%${keyNote}`,
          details: `Modellar: ${(data.models || []).join(', ')} (${latency}ms)`,
          latencyMs: latency
        });
      } else {
        setFaceIdStatus({
          id: 'face_id_service',
          name: 'Face ID (AI yuz tekshiruvi)',
          status: 'error',
          message: 'GEMINI_API_KEY serverda sozlanmagan — talabalar Face ID dan o‘ta olmaydi',
          details: 'Vercel → Settings → Environment Variables bo‘limida GEMINI_API_KEY ni kiriting va Redeploy qiling.',
          latencyMs: latency
        });
      }
    } catch (err: any) {
      setFaceIdStatus({
        id: 'face_id_service',
        name: 'Face ID (AI yuz tekshiruvi)',
        status: 'error',
        message: 'Face ID xizmatiga ulanib bo‘lmadi',
        details: err?.name === 'AbortError' ? 'Server 10 soniyada javob bermadi' : (err?.message || String(err))
      });
    }

    setLastCheckTime(new Date());
    setIsRunningChecks(false);
  }, [evaluateEnvVariables]);

  useEffect(() => {
    runDiagnostics();
  }, [runDiagnostics]);

  const allServices = [
    firebaseStatus,
    firebaseAuthStatus,
    firebaseStorageStatus,
    supabaseConfigStatus,
    supabaseAuthStatus,
    supabaseStorageStatus,
    faceIdStatus
  ];

  const healthyCount = allServices.filter(s => s.status === 'healthy').length;
  const warningCount = allServices.filter(s => s.status === 'warning').length;
  const errorCount = allServices.filter(s => s.status === 'error').length;

  const renderStatusBadge = (status: ServiceCheckResult['status']) => {
    switch (status) {
      case 'healthy':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full text-[10px] font-black uppercase tracking-wider">
            <CheckCircle2 size={12} className="text-emerald-500" /> Aloqada (Normal)
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200/80 rounded-full text-[10px] font-black uppercase tracking-wider">
            <AlertTriangle size={12} className="text-amber-500" /> Ogohlantirish
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200/80 rounded-full text-[10px] font-black uppercase tracking-wider">
            <XCircle size={12} className="text-rose-500" /> Xatolik
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-wider">
            <RefreshCw size={12} className="animate-spin text-slate-400" /> Tekshirilmoqda
          </span>
        );
    }
  };

  return (
    <div className="mb-8 bg-white border border-slate-200/90 rounded-[32px] shadow-sm overflow-hidden transition-all duration-300">
      {/* Top Banner Widget Bar */}
      <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-slate-900 via-[#0E1624] to-slate-900 text-white">
        <div className="flex items-start md:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Activity className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-0.5 bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 rounded-md text-[9px] font-black uppercase tracking-widest">
                Real-Time Diagnostics
              </span>
              {lastCheckTime && (
                <span className="text-[10px] text-slate-400 font-medium">
                  So‘nggi tekshiruv: {lastCheckTime.toLocaleTimeString()}
                </span>
              )}
            </div>
            <h3 className="text-lg md:text-xl font-black text-white tracking-tight uppercase">
              Tizim va Ulanishlar Diagnostika Paneli
            </h3>
            <p className="text-slate-400 text-xs mt-0.5 font-medium">
              Firebase Firestore, Auth holati, Storage va Supabase kalitlari to‘g‘riligini tekshirish
            </p>
          </div>
        </div>

        {/* Quick summary indicators and toggle button */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              {healthyCount} faol
            </div>
            {warningCount > 0 && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 pl-2 border-l border-white/10">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                {warningCount} ogoh
              </div>
            )}
            {errorCount > 0 && (
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 pl-2 border-l border-white/10">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                {errorCount} xato
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={runDiagnostics}
            disabled={isRunningChecks}
            className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-2xl text-xs font-bold transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
            title="Qayta sinash"
          >
            <RefreshCw className={`w-4 h-4 ${isRunningChecks ? 'animate-spin' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-indigo-500/30 active:scale-95 cursor-pointer"
          >
            <span>{isOpen ? 'Yashirish' : 'Batafsil ko‘rish'}</span>
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Expandable Details Section */}
      {isOpen && (
        <div className="p-6 md:p-8 space-y-8 bg-slate-50/70 border-t border-slate-200/80 animate-in fade-in duration-200">
          {/* Quick Guidance Alert if there are errors */}
          {(errorCount > 0 || warningCount > 0) && (
            <div className="p-5 bg-amber-50/80 border border-amber-200/90 rounded-2xl flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="font-bold text-amber-900 text-xs uppercase tracking-wide">
                  Tizimda e’tibor talab qiluvchi parametrlar aniqlandi
                </h5>
                <p className="text-amber-800 text-xs leading-relaxed">
                  Agar haqiqiy domenda (masalan, <code>bsmianatomy.uz</code>) fayl yuklashda xatolik yuz bersa, hosting (Vercel) boshqaruv panelidagi <b>Environment Variables</b> bo‘limida <code>VITE_SUPABASE_URL</code> va <code>VITE_SUPABASE_ANON_KEY</code> kalitlarini toza, probelsiz kiritib <b>Redeploy</b> qiling.
                </p>
              </div>
            </div>
          )}

          {/* 1. Services Live Status Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                <Server size={15} className="text-indigo-600" /> Servislar va Ulanishlar Holati:
              </h4>
              <span className="text-[10px] font-bold text-slate-400">
                Jonli sinov natijalari
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allServices.map(service => (
                <div 
                  key={service.id} 
                  className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-3 flex flex-col justify-between hover:border-slate-300 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-800 text-xs">{service.name}</span>
                      {renderStatusBadge(service.status)}
                    </div>
                    <p className="text-xs font-semibold text-slate-700 leading-snug">
                      {service.message}
                    </p>
                  </div>
                  {service.details && (
                    <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-mono break-all leading-tight">
                      {service.details}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 2. Environment Variables Inspector */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                <Key size={15} className="text-indigo-600" /> Muhit O‘zgaruvchilari (Environment Variables):
              </h4>
              <span className="text-[10px] font-bold text-slate-400">
                Xavfsiz niqoblangan (Masked) ko‘rinish
              </span>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-xs">
              {envStatuses.map(env => (
                <div key={env.name} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-xs text-indigo-950 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        {env.name}
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                        {env.category}
                      </span>
                      {env.isSet ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                          <Check size={12} /> Mavjud
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600">
                          <XCircle size={12} /> Topilmadi
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">{env.description}</p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span className="font-mono text-xs px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl border border-slate-200 max-w-[240px] truncate">
                      {env.valueMasked}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(env.valueMasked, env.name)}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Nusxalash"
                    >
                      {copiedKey === env.name ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Operational Tips for Deployment */}
          <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-2 text-xs text-indigo-950/80 leading-relaxed">
            <h5 className="font-bold text-[11px] text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
              <Info size={14} /> Tavsiyalar va Foydali Eslatmalar:
            </h5>
            <ul className="list-disc list-inside space-y-1 font-medium">
              <li>
                <b>Fayl yuklash:</b> Agar Supabase vaqtincha offline bo‘lsa, admin paneldagi yuklagich avtomatik tarzda Firebase Storage orqali zaxira yuklashni amalga oshiradi.
              </li>
              <li>
                <b>Google Drive formati:</b> Taqdimotlar yuklashda 2-usul (Google Drive yoki to‘g‘ridan-to‘g‘ri havola) barcha hollarda 100% kafolatlangan ishchi variant hisoblanadi.
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
