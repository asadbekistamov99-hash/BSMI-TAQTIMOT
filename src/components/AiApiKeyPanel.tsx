import React, { useEffect, useState } from 'react';
import { Key, Trash2, Check, AlertTriangle, ExternalLink, Eye, EyeOff, Sparkles, RefreshCw, ShieldCheck } from 'lucide-react';
import { getActiveUserAiKey, saveUserAiKey, removeUserAiKey, getIdTokenOrNull } from '../lib/userAiKey';
import { isValidGeminiKeyShape, maskGeminiKey, sanitizeGeminiKey } from '../lib/aiKeyFormat';

const GEMINI_KEY_PAGE = 'https://aistudio.google.com/app/apikey';

const GUIDE_STEPS = [
  <>Brauzerda <a href={GEMINI_KEY_PAGE} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline font-bold">aistudio.google.com/app/apikey</a> sahifasini oching.</>,
  <>Google akkauntingiz bilan kiring (Gmail). Agar so'ralsa, shartlarga rozilik bildiring.</>,
  <>Sahifada <b>"Create API key"</b> (yoki <b>"Get API key"</b>) tugmasini bosing.</>,
  <>Loyiha tanlang: mavjud loyihani yoki <b>"Create API key in new project"</b> variantini.</>,
  <>Paydo bo'lgan kalitning yonidagi <b>Copy</b> (nusxalash) tugmasini bosing (odatda <b>AIza...</b> yoki <b>AQ...</b> bilan boshlanadi).</>,
  <>Quyidagi maydonga kalitni qo'ying va <b>"Tekshirib saqlash"</b> tugmasini bosing. Tizim kalitni Google Gemini orqali haqiqatda 100% sinab, keyin faollashtiradi.</>,
];

export default function AiApiKeyPanel({ user }: { user: any }) {
  const uid: string | null = user?.uid ?? null;
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [input, setInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [busy, setBusy] = useState(false);
  const [testedModel, setTestedModel] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    let alive = true;
    getActiveUserAiKey(uid)
      .then((k) => {
        if (alive) {
          setSavedKey(k);
          if (k) setTestedModel('Gemini');
        }
      })
      .catch(() => {
        if (alive) setMsg({ type: 'err', text: "Saqlangan kalitni o'qib bo'lmadi. Sahifani yangilab ko'ring." });
      })
      .finally(() => {
        if (alive) setLoaded(true);
      });

    const handleKeyChange = (e: any) => {
      if (alive) {
        setSavedKey(e.detail?.key || null);
      }
    };
    window.addEventListener('bsmi_ai_key_changed', handleKeyChange);
    return () => { 
      alive = false; 
      window.removeEventListener('bsmi_ai_key_changed', handleKeyChange);
    };
  }, [uid]);

  // Serverda kalitni haqiqiy jonli so'rov bilan tekshirish
  const verifyOnServer = async (key: string): Promise<{ ok: boolean; error?: string; model?: string }> => {
    try {
      const token = await getIdTokenOrNull().catch(() => null);
      const res = await fetch('/api/ai-key/check', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ key }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        return { ok: true, model: data.model || 'Gemini 3 Flash' };
      }
      const base = data.error || "Kalitni tekshirib bo'lmadi.";
      return { ok: false, error: data.detail ? `${base} (Google: ${data.detail})` : base };
    } catch (e: any) {
      return { ok: false, error: `Tarmoq xatosi: ${e?.message || 'Serverga ulanib bo‘lmadi'}` };
    }
  };

  const handleSave = async () => {
    const cleanKey = sanitizeGeminiKey(input);
    if (!cleanKey || !isValidGeminiKeyShape(cleanKey)) {
      setMsg({ type: 'err', text: "Kalit formati noto'g'ri. Google AI Studio kalitini to'liq nusxalab kiriting (odatda AIza... yoki AQ... bilan boshlanadi)." });
      return;
    }
    setBusy(true);
    setMsg({ type: 'ok', text: 'Kalit Google Gemini orqali jonli tekshirilmoqda...' });
    try {
      const result = await verifyOnServer(cleanKey);
      if (!result.ok) {
        setMsg({ type: 'err', text: result.error || 'Kalit tekshiruvdan o‘tmadi.' });
        return;
      }
      await saveUserAiKey(uid, cleanKey);
      setSavedKey(cleanKey);
      setTestedModel(result.model || 'Gemini');
      setInput('');
      setShowInput(false);
      setMsg({ 
        type: 'ok', 
        text: `✅ Kalit 100% muvaffaqiyatli tekshirildi (${result.model || 'Gemini'}) va saqlandi! Endi barcha AI suhbatlari, nazariya va test tarjimalari aynan sizning kalitingiz orqali cheksiz ishlaydi.` 
      });
    } catch (e: any) {
      setMsg({ type: 'err', text: `Saqlashda xatolik: ${e?.message || e}` });
    } finally {
      setBusy(false);
    }
  };

  const handleTest = async () => {
    if (!savedKey) return;
    setBusy(true);
    setMsg({ type: 'ok', text: 'Kalit qayta tekshirilmoqda...' });
    try {
      const result = await verifyOnServer(savedKey);
      if (result.ok) {
        setTestedModel(result.model || 'Gemini');
        setMsg({ type: 'ok', text: `✅ Kalit 100% ishlayapti! Model: ${result.model || 'Gemini'}` });
      } else {
        setMsg({ type: 'err', text: result.error || 'Kalit ishlamadi.' });
      }
    } catch (e: any) {
      setMsg({ type: 'err', text: `Tekshirishda xatolik: ${e?.message || e}` });
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async () => {
    if (!window.confirm("Saqlangan API kalitni o'chirasizmi? O'chirilgach AI tizimi umumiy rejimda ishlaydi.")) return;
    setBusy(true);
    try {
      await removeUserAiKey(uid);
      setSavedKey(null);
      setTestedModel(null);
      setMsg({ type: 'ok', text: "Kalit o'chirildi." });
    } catch (e: any) {
      setMsg({ type: 'err', text: `O'chirishda xatolik: ${e?.message || e}` });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-6 bg-[#0D1117] border-2 border-cyan-500/30 rounded-[32px] p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="flex items-center gap-3 mb-2 relative z-10">
        <div className="w-11 h-11 bg-cyan-500/15 border border-cyan-500/30 rounded-2xl flex items-center justify-center text-cyan-400 shadow-inner">
          <Key size={22} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black uppercase tracking-tight">Shaxsiy AI API Kalit (Gemini)</h3>
            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              100% Cheksiz
            </span>
          </div>
          <p className="text-xs text-slate-400">Google AI Studio kalitingiz bilan AI Assistant, konspekt va tarjimalar cheklovlarsiz ishlaydi.</p>
        </div>
      </div>

      {!uid && loaded && (
        <div className="mt-4 p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-xs flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 shrink-0 text-cyan-400" />
          <span><b>Talaba / Mehmon rejimi:</b> Kiritilgan kalit ushbu qurilmangizda saqlanadi va 100% ishlaydi. Google bilan kirsangiz barcha qurilmalaringizga avtomatik uzatiladi.</span>
        </div>
      )}

      {!loaded && <p className="mt-5 text-sm text-slate-400">Yuklanmoqda...</p>}

      {loaded && savedKey && (
        <div className="mt-5 p-5 rounded-2xl bg-emerald-950/40 border-2 border-emerald-500/40 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Kalit faol va 100% kafolatlangan
              </span>
            </div>
            {testedModel && (
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-700/50">
                {testedModel}
              </span>
            )}
          </div>
          <p className="font-mono text-sm mt-2 text-white tracking-widest bg-black/40 px-3 py-1.5 rounded-xl border border-white/5 break-all">
            {maskGeminiKey(savedKey)}
          </p>
          <p className="text-xs text-slate-300 mt-2">
            ✅ Kunlik limitlar sizga taalluqli emas. AI Yordamchi, konspektlar va test tarjimalari aynan sizning kalitingiz bilan cheksiz ishlamoqda.
          </p>
          <div className="flex flex-wrap gap-2.5 mt-4">
            <button 
              onClick={handleTest} 
              disabled={busy} 
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw size={13} className={busy ? 'animate-spin' : ''} /> Qayta tekshirish
            </button>
            <button 
              onClick={() => setShowInput((v) => !v)} 
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
            >
              Boshqa kalit kiritish
            </button>
            <button 
              onClick={handleRemove} 
              disabled={busy} 
              className="px-4 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Trash2 size={13} /> O'chirish
            </button>
          </div>
        </div>
      )}

      {loaded && (!savedKey || showInput) && (
        <div className="mt-5 bg-white/5 p-4 sm:p-5 rounded-2xl border border-white/10">
          <label className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <span>Google Gemini API kalitingiz</span>
            <span className="text-[10px] text-cyan-400 font-normal lowercase">(AIza... yoki AQ...)</span>
          </label>
          <div className="flex gap-2 mt-2.5">
            <input
              type={showInput || input ? 'text' : 'password'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="AIzaSy... yoki AQ...."
              autoComplete="off"
              spellCheck={false}
              className="flex-1 min-w-0 bg-[#161B22] border-2 border-white/15 focus:border-cyan-400 rounded-2xl py-3 px-4 font-mono text-sm outline-none text-white transition-colors"
            />
            <button 
              type="button" 
              onClick={() => setShowInput((v) => !v)} 
              className="px-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer" 
              title="Ko'rsatish / Yashirish"
            >
              {showInput ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button
            onClick={handleSave}
            disabled={busy || !input.trim()}
            className="mt-3.5 w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
          >
            {busy ? (
              <>
                <RefreshCw size={15} className="animate-spin" /> Tekshirilmoqda...
              </>
            ) : (
              <>
                <Check size={16} /> 100% Tekshirib faollashtirish
              </>
            )}
          </button>
        </div>
      )}

      {msg && (
        <div className={`mt-4 p-3.5 rounded-2xl text-xs sm:text-sm font-medium flex items-start gap-2.5 transition-all ${
          msg.type === 'ok' 
            ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-200' 
            : 'bg-red-500/15 border border-red-500/30 text-red-200'
        }`}>
          {msg.type === 'ok' ? (
            <Check size={18} className="mt-0.5 shrink-0 text-emerald-400" />
          ) : (
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-red-400" />
          )}
          <span className="leading-relaxed">{msg.text}</span>
        </div>
      )}

      <div className="mt-8 border-t border-white/10 pt-6">
        <h4 className="font-black text-xs uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
          <span>Qo'llanma: Gemini API kalitini 1 daqiqada olish</span>
        </h4>
        <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside">
          {GUIDE_STEPS.map((step, i) => (
            <li key={i} className="leading-relaxed">{step}</li>
          ))}
        </ol>
        <a 
          href={GEMINI_KEY_PAGE} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="mt-4 inline-flex items-center gap-2 text-cyan-400 text-xs font-bold hover:underline"
        >
          Google AI Studio sahifasini ochish (bepul) <ExternalLink size={13} />
        </a>
      </div>
    </section>
  );
}
