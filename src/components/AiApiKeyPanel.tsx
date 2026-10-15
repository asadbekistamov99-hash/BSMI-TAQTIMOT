import React, { useEffect, useState } from 'react';
import { Key, Trash2, Check, AlertTriangle, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { getUserAiKey, saveUserAiKey, removeUserAiKey, getIdTokenOrNull } from '../lib/userAiKey';
import { isValidGeminiKeyShape, maskGeminiKey } from '../lib/aiKeyFormat';

const GEMINI_KEY_PAGE = 'https://aistudio.google.com/app/apikey';

const GUIDE_STEPS = [
  <>Brauzerda <a href={GEMINI_KEY_PAGE} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline font-bold">aistudio.google.com/app/apikey</a> sahifasini oching.</>,
  <>Google akkauntingiz bilan kiring (Gmail). Agar so'ralsa, shartlarga rozilik bildiring.</>,
  <>Sahifada <b>"Create API key"</b> (yoki <b>"Get API key"</b>) tugmasini bosing.</>,
  <>Loyiha tanlang: mavjud loyihani yoki <b>"Create API key in new project"</b> variantini.</>,
  <>Paydo bo'lgan kalitning yonidagi <b>Copy</b> (nusxalash) tugmasini bosing. Kalit <b>AQ.</b> yoki <b>AIza</b> bilan boshlanadi.</>,
  <>Quyidagi maydonga kalitni qo'ying va <b>"Tekshirib saqlash"</b> tugmasini bosing. Sayt kalitni Gemini orqali haqiqatan sinaydi, ishlasa saqlanadi.</>,
];

export default function AiApiKeyPanel({ user }: { user: any }) {
  const uid: string | null = user?.uid ?? null;
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [input, setInput] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    let alive = true;
    if (!uid) {
      setLoaded(true);
      return;
    }
    getUserAiKey(uid)
      .then((k) => alive && setSavedKey(k))
      .catch(() => alive && setMsg({ type: 'err', text: "Saqlangan kalitni o'qib bo'lmadi. Sahifani yangilab ko'ring." }))
      .finally(() => alive && setLoaded(true));
    return () => { alive = false; };
  }, [uid]);

  // Serverda kalitni haqiqiy so'rov bilan tekshirish
  const verifyOnServer = async (key: string): Promise<string | null> => {
    const token = await getIdTokenOrNull();
    if (!token) return "Avval tizimga kiring.";
    const res = await fetch('/api/ai-key/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ key }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok) return null;
    const base = data.error || 'Kalitni tekshirib bo‘lmadi.';
    return data.detail ? `${base} Google javobi: ${data.detail}` : base;
  };

  const handleSave = async () => {
    if (!uid) return;
    const key = input.trim();
    if (!isValidGeminiKeyShape(key)) {
      setMsg({ type: 'err', text: "Kalit noto'g'ri. U 'AQ.' yoki 'AIza' bilan boshlanishi va to'liq nusxalangan bo'lishi kerak." });
      return;
    }
    setBusy(true);
    setMsg({ type: 'ok', text: 'Kalit tekshirilmoqda...' });
    try {
      const err = await verifyOnServer(key);
      if (err) {
        setMsg({ type: 'err', text: err });
        return;
      }
      await saveUserAiKey(uid, key);
      setSavedKey(key);
      setInput('');
      setShowInput(false);
      setMsg({ type: 'ok', text: "Kalit ishlaydi va saqlandi. Uni o'chirmaguncha AI shu kalit bilan javob beradi." });
    } catch (e: any) {
      setMsg({ type: 'err', text: `Saqlashda xatolik: ${e?.message || e}` });
    } finally {
      setBusy(false);
    }
  };

  const handleTest = async () => {
    if (!savedKey) return;
    setBusy(true);
    setMsg({ type: 'ok', text: 'Kalit tekshirilmoqda...' });
    try {
      const err = await verifyOnServer(savedKey);
      setMsg(err ? { type: 'err', text: err } : { type: 'ok', text: 'Kalit ishlayapti.' });
    } catch (e: any) {
      setMsg({ type: 'err', text: `Tekshirishda xatolik: ${e?.message || e}` });
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async () => {
    if (!uid) return;
    if (!window.confirm("Saqlangan API kalitni o'chirasizmi? O'chirilgach AI umumiy kalit bilan ishlaydi.")) return;
    setBusy(true);
    try {
      await removeUserAiKey(uid);
      setSavedKey(null);
      setMsg({ type: 'ok', text: "Kalit o'chirildi." });
    } catch (e: any) {
      setMsg({ type: 'err', text: `O'chirishda xatolik: ${e?.message || e}` });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-6 bg-[#0D1117] border-2 border-cyan-500/20 rounded-[32px] p-6 sm:p-8 text-white shadow-xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-cyan-500/15 rounded-xl flex items-center justify-center text-cyan-400">
          <Key size={20} />
        </div>
        <div>
          <h3 className="text-lg font-black uppercase tracking-tight">Shaxsiy AI API kalit (Gemini)</h3>
          <p className="text-xs text-slate-400">Kalitingiz faqat sizning akkauntingizga bog'lanadi va faqat siz uchun ishlaydi.</p>
        </div>
      </div>

      {!uid && loaded && (
        <div className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm">
          Kalit kiritish uchun avval tizimga kiring (Google bilan). Shundan keyin bu bo'lim faollashadi.
        </div>
      )}

      {uid && !loaded && <p className="mt-5 text-sm text-slate-400">Yuklanmoqda...</p>}

      {uid && loaded && savedKey && (
        <div className="mt-5 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
          <p className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Kalit saqlangan</p>
          <p className="font-mono text-sm mt-1 text-white break-all">{maskGeminiKey(savedKey)}</p>
          <p className="text-xs text-slate-400 mt-1">O'chirmaguncha ishlaydi. Qurilmani almashtirsangiz ham shu akkaunt bilan avtomatik ochiladi.</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <button onClick={handleTest} disabled={busy} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold uppercase tracking-wider disabled:opacity-50">
              Qayta tekshirish
            </button>
            <button onClick={() => setShowInput((v) => !v)} className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold uppercase tracking-wider">
              Boshqa kalit kiritish
            </button>
            <button onClick={handleRemove} disabled={busy} className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 disabled:opacity-50">
              <Trash2 size={14} /> O'chirish
            </button>
          </div>
        </div>
      )}

      {uid && loaded && (!savedKey || showInput) && (
        <div className="mt-5">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">Gemini API kalitingiz</label>
          <div className="flex gap-2 mt-2">
            <input
              type={showInput || input ? 'text' : 'password'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="AQ...."
              autoComplete="off"
              spellCheck={false}
              className="flex-1 min-w-0 bg-[#161B22] border-2 border-white/10 focus:border-cyan-500 rounded-2xl py-3 px-4 font-mono text-sm outline-none"
            />
            <button type="button" onClick={() => setShowInput((v) => !v)} className="px-3 rounded-2xl bg-white/5 hover:bg-white/10" aria-label="Ko'rsatish">
              {showInput ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button
            onClick={handleSave}
            disabled={busy || !input.trim()}
            className="mt-3 w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-black text-xs uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Check size={16} /> Tekshirib saqlash
          </button>
        </div>
      )}

      {msg && (
        <div className={`mt-4 p-3 rounded-xl text-sm flex items-start gap-2 ${msg.type === 'ok' ? 'bg-emerald-500/10 text-emerald-200' : 'bg-red-500/10 text-red-200'}`}>
          {msg.type === 'ok' ? <Check size={16} className="mt-0.5 shrink-0" /> : <AlertTriangle size={16} className="mt-0.5 shrink-0" />}
          <span>{msg.text}</span>
        </div>
      )}

      <div className="mt-8 border-t border-white/10 pt-6">
        <h4 className="font-black text-sm uppercase tracking-wider mb-3">Gemini API kalitini qanday olish</h4>
        <ol className="space-y-2 text-sm text-slate-300 list-decimal list-inside">
          {GUIDE_STEPS.map((step, i) => (
            <li key={i} className="leading-relaxed">{step}</li>
          ))}
        </ol>
        <a href={GEMINI_KEY_PAGE} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-cyan-400 text-sm font-bold hover:underline">
          Google AI Studio'ni ochish <ExternalLink size={14} />
        </a>
        <ul className="mt-5 space-y-1.5 text-xs text-slate-400 list-disc list-inside">
          <li>Kalitni hech kimga bermang va ekran rasmida ochiq joylashtirmang.</li>
          <li>Bepul limit va mavjudlik hudud hamda Google tarifiga qarab o'zgarishi mumkin.</li>
          <li>Kalit faqat sizning hisobingiz so'rovlari uchun ishlatiladi. Boshqa foydalanuvchilar va admin panel uni ko'ra olmaydi.</li>
        </ul>
      </div>
    </section>
  );
}
