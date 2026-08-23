import { motion } from 'motion/react';
import { X, CreditCard, ShieldCheck, Copy, Send, Clock, Timer } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc } from 'firebase/firestore';
import { useSettings, normalizeTelegram } from '../hooks/useSettings';
import { useLanguage } from '../hooks/useLanguage';
import { parseDate } from '../lib/dateUtils';

interface PaymentModalProps {
  semesterId: number;
  user: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ semesterId, user, onClose, onSuccess }: PaymentModalProps) {
  const { settings } = useSettings();
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState<'local' | 'visa'>('local');
  const [copied, setCopied] = useState(false);
  const [pendingPayment, setPendingPayment] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');

  const telegramBot = normalizeTelegram(settings.telegramBotUsername || '@Medai_support_bot');

  const isAtlas = semesterId === 99;
  const currentPriceUZS = isAtlas ? 30000 : (settings?.priceUZS || 0);
  const currentPriceUSD = isAtlas ? 3 : (settings?.priceUSD || 0);
  const getSemesterTitle = (sem: number) => {
    if (sem === 1) return language === 'uz' ? "1-Semestr: Tayanch-harakat tizimi" : language === 'ru' ? "1-Семестр: Опорно-двигательная система" : "1st Semester: Musculoskeletal system";
    if (sem === 2) return language === 'uz' ? "2-Semestr: Ichki a'zolar va tizimlar" : language === 'ru' ? "2-Семестр: Внутренние органы" : "2nd Semester: Internal organs";
    if (sem === 3) return language === 'uz' ? "3-Semestr: Markaziy asab tizimi va sezgi a'zolari" : language === 'ru' ? "3-Семестр: ЦНС и органы чувств" : "3rd Semester: Central Nervous System";
    return `${sem}-Semestr`;
  };

  const titleText = isAtlas 
    ? (language === 'uz' ? "3D Atlas Obunasi" : language === 'ru' ? "Подписка на 3D Атлас" : "3D Atlas Subscription")
    : getSemesterTitle(semesterId);

  useEffect(() => {
    checkPendingPayment();
  }, [semesterId, user]);

  const checkPendingPayment = async () => {
    if (!user) return;
    try {
      const paymentId = `${user.uid}_${semesterId}`;
      const docRef = doc(db, 'payments', paymentId);
      const snap = await getDoc(docRef);
      if (snap.exists() && snap.data().status === 'pending') {
        setPendingPayment(snap.data());
      }
    } catch (e) {
      console.error("Error checking pending payment:", e);
    }
  };

  useEffect(() => {
    if (!pendingPayment?.createdAt) return;

    const interval = setInterval(() => {
      const created = parseDate(pendingPayment.createdAt);
      const expires = new Date(created.getTime() + 24 * 60 * 60 * 1000);
      const now = new Date();
      
      const diff = expires.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft('Vaqt tugadi, admin bilan bog\'laning');
        clearInterval(interval);
      } else {
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${h}s ${m}m ${s}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [pendingPayment]);

  const cardDetails = method === 'local' 
    ? { number: "5614686106224101", type: "Uzcard / Humo", owner: "Istamov Asadbek" }
    : { number: "4916990332688958", type: "Visa", owner: "Istamov Asadbek" };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayment = async () => {
    if (!user) {
      alert("Iltimos, avval Google orqali tizimga kiring.");
      return;
    }

    if (!semesterId || isNaN(semesterId)) {
      alert("Semester ma'lumotlari topilmadi.");
      return;
    }

    setLoading(true);
    try {
      const paymentId = `${user.uid}_${semesterId}`;
      
      const paymentData = {
        userId: user.uid,
        userEmail: user.email || '',
        userName: user.displayName || 'Foydalanuvchi',
        semesterId: semesterId,
        amount: method === 'local' ? currentPriceUZS : currentPriceUSD,
        currency: method === 'local' ? 'UZS' : 'USD',
        status: 'pending',
        paymentMethod: method === 'local' ? 'uzcard_humo' : 'visa',
        createdAt: serverTimestamp(),
        cardUsed: cardDetails.number,
        updatedAt: serverTimestamp()
      };

      await setDoc(doc(db, 'payments', paymentId), paymentData);

      alert("Arizangiz muvaffaqiyatli qabul qilindi. Admin tomonidan tasdiqlanishini kutishingiz mumkin.");
      
      onSuccess(); 
    } catch (error: any) {
      console.error("Payment error detail:", error);
      let msg = "Xatolik yuz berdi";
      if (error.code === 'permission-denied') {
        msg = "Ruxsat etilmadi. Iltimos, asadbekistamov99@gmail.com orqali kiring.";
      } else if (error.message) {
        msg += ": " + error.message;
      }
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-brand-primary/95 backdrop-blur-xl overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[40px] w-full max-w-md overflow-hidden shadow-2xl border-4 border-white relative z-[120] my-8"
      >
        <div className="p-8 bg-brand-bg border-b border-brand-border flex items-center justify-between">
          <div>
            <h4 className="text-[10px] font-black text-brand-accent uppercase tracking-[0.4em] mb-2">Manual To'lov</h4>
            <h2 className="text-2xl font-black text-brand-primary tracking-tighter uppercase">{titleText}</h2>
          </div>
          <button onClick={onClose} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-brand-border text-brand-primary hover:text-red-500 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {pendingPayment ? (
            <div className="space-y-8 py-4">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 bg-orange-100 rounded-[30px] flex items-center justify-center text-orange-500 mb-2">
                  <Timer size={40} className="animate-pulse" />
                </div>
                <h3 className="text-xl font-black text-brand-primary uppercase tracking-tighter">Ariza ko'rib chiqilmoqda</h3>
                <p className="text-sm text-brand-muted font-medium">To'lovingiz admin tomonidan tasdiqlanishini kutmoqdamiz. Bu odatda 24 soat ichida amalga oshiriladi.</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-[32px] border-2 border-dashed border-slate-200">
                <p className="text-[10px] font-black text-brand-muted uppercase tracking-widest text-center mb-4">Qolgan vaqt</p>
                <div className="text-4xl font-black text-brand-primary text-center tracking-tighter tabular-nums">
                  {timeLeft || 'Hisoblanmoqda...'}
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <Send className="text-blue-500 shrink-0" size={20} />
                <p className="text-[11px] text-blue-700 font-bold leading-relaxed">
                  Agar chekni hali yubormagan bo'lsangiz, uni <a href={`https://t.me/${telegramBot.replace('@', '')}`} target="_blank" className="underline">{telegramBot}</a> ga yuboring.
                </p>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-5 bg-brand-bg text-brand-primary border-2 border-brand-border rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all"
              >
                Tushunarli
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setMethod('local')}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${method === 'local' ? 'border-brand-accent bg-brand-accent/5' : 'border-brand-border bg-slate-50'}`}
                >
                  <span className={`text-[10px] font-black uppercase tracking-widest ${method === 'local' ? 'text-brand-accent' : 'text-brand-muted'}`}>Uzcard/Humo</span>
                  <p className="text-lg font-black text-brand-primary">{currentPriceUZS.toLocaleString()} UZS</p>
                </button>

                <button 
                  onClick={() => setMethod('visa')}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${method === 'visa' ? 'border-brand-accent bg-brand-accent/5' : 'border-brand-border bg-slate-50'}`}
                >
                  <span className={`text-[10px] font-black uppercase tracking-widest ${method === 'visa' ? 'text-brand-accent' : 'text-brand-muted'}`}>Visa Card</span>
                  <p className="text-lg font-black text-brand-primary">${currentPriceUSD} USD</p>
                </button>
              </div>

              <div className="bg-brand-primary p-6 rounded-3xl text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <CreditCard size={80} />
                </div>
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 mb-4">{cardDetails.type}</p>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-mono tracking-widest font-bold">
                      {cardDetails.number.replace(/(\d{4})/g, '$1 ')}
                    </h3>
                    <button 
                      onClick={() => copyToClipboard(cardDetails.number)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      {copied ? <ShieldCheck className="text-green-400" /> : <Copy size={18} />}
                    </button>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-white/40 mb-1">Karta Egasi</p>
                      <p className="text-sm font-bold uppercase">{cardDetails.owner}</p>
                    </div>
                    <div className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-black">ACTIVE</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-brand-border">
                  <div className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center shrink-0">
                    <Send className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-brand-primary uppercase tracking-widest mb-1">1-QADAM: CHEKNI YUBORING</p>
                    <p className="text-[11px] text-brand-muted font-medium leading-relaxed">
                      To'lovdan so'ng chekni <a href={`https://t.me/${telegramBot.replace('@', '')}`} target="_blank" className="text-brand-primary font-black underline">{telegramBot}</a> tgram adminiga yuboring.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-brand-border">
                  <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center shrink-0 text-brand-primary">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-brand-primary uppercase tracking-widest mb-1">2-QADAM: TASDIQLASH</p>
                    <p className="text-[11px] text-brand-muted font-medium leading-relaxed">
                      To'lov admin tomonidan 24 soat ichida tekshiriladi va semestr ochiladi.
                    </p>
                  </div>
                </div>
              </div>

              <button 
                onClick={handlePayment}
                disabled={loading}
                className="w-full py-6 bg-brand-primary text-white rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-slate-800 active:scale-[0.98] transition-all shadow-xl shadow-brand-primary/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer relative z-10"
              >
                {loading ? "ARIZA YUBORILMOQDA..." : "TO'LOV QILDIM, ARIZA YUBORISH"}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

