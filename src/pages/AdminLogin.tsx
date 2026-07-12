import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Terminal, LogIn, Lock, User, KeyRound } from 'lucide-react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';

interface AdminLoginProps {
  onLogin: (token: string) => void;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'traditional' | 'google'>('traditional');

  const handleTraditionalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (username === "BSMI123ANATOMY" && password === "anatomy123bsmi") {
        onLogin("mock-admin-token-" + Date.now());
      } else {
        setError("Noto‘g‘ri login yoki parol!");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Tizimga kirishda kutilmagan xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user?.email?.toLowerCase();
      
      if (email === "asadbekistamov99@gmail.com") {
        onLogin("mock-admin-token-" + Date.now());
      } else {
        await signOut(auth);
        setError("Ushbu Google hisobi admin ruxsatiga ega emas!");
      }
    } catch (err: any) {
      console.error("Google Auth error:", err);
      setError("Tizimga ulanishda xatolik: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-primary flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-accent rounded-full blur-[180px] opacity-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-white rounded-full blur-[150px] opacity-5"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-brand-primary border-4 border-white/5 p-8 md:p-12 rounded-[48px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] relative">
          <div className="absolute -top-10 left-12">
            <span className="px-5 py-2 bg-brand-accent text-brand-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-2xl">
              SYSTEM ACCESS
            </span>
          </div>

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-brand-accent/10 border border-brand-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Terminal className="text-brand-accent w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">ADMIN <br/> PANEL</h1>
            <p className="text-brand-muted mt-3 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
              BSMI ANATOMY BOSHQARUV TIZIMI
            </p>
          </div>

          {/* Tab Selection */}
          <div className="flex bg-white/5 p-1 rounded-2xl mb-8 border border-white/10">
            <button
              onClick={() => { setLoginMethod('traditional'); setError(''); }}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                loginMethod === 'traditional'
                  ? 'bg-brand-accent text-brand-primary shadow-lg'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Login / Parol
            </button>
            <button
              onClick={() => { setLoginMethod('google'); setError(''); }}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                loginMethod === 'google'
                  ? 'bg-brand-accent text-brand-primary shadow-lg'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Google Auth
            </button>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-red-500/10 border-l-4 border-red-500 rounded-xl flex items-center gap-3 text-red-400 text-xs font-black uppercase tracking-widest mb-6"
            >
              <ShieldAlert className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {loginMethod === 'traditional' ? (
            <form onSubmit={handleTraditionalLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block">
                  Foydalanuvchi nomi
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Loginni kiriting"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border-2 border-white/5 focus:border-brand-accent rounded-2xl outline-none text-white text-sm transition-all placeholder:text-white/20 font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/50 block">
                  Maxfiy parol
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Parolni kiriting"
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border-2 border-white/5 focus:border-brand-accent rounded-2xl outline-none text-white text-sm transition-all placeholder:text-white/20 font-semibold"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-brand-accent hover:scale-[1.02] disabled:opacity-50 text-brand-primary font-black rounded-2xl transition-all shadow-2xl shadow-brand-accent/20 active:scale-[0.98] uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-3 cursor-pointer mt-8"
              >
                <KeyRound className="w-4 h-4" />
                {loading ? "TEKSHIRILMOQDA..." : "TIZIMGA KIRISH"}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-[11px] text-white/70 leading-relaxed text-center font-medium">
                  Xavfsiz Google kirish tizimi faqat tasdiqlangan admin pochtasini qo'llab-quvvatlaydi.
                </p>
                <p className="text-[11px] text-brand-accent leading-relaxed text-center font-bold mt-3 uppercase tracking-wider">
                  Ruxsat etilgan: asadbekistamov99@gmail.com
                </p>
              </div>

              <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-5 bg-brand-accent hover:scale-[1.02] disabled:opacity-50 text-brand-primary font-black rounded-2xl transition-all shadow-2xl shadow-brand-accent/20 active:scale-[0.98] uppercase tracking-[0.15em] text-xs flex items-center justify-center gap-3 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                {loading ? "KIRILMOQDA..." : "GOOGLE BILAN UTISH"}
              </button>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.4em]">
              BSMI ANATOMY • SECURED v1.2.0
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
