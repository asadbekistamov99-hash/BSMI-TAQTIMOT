import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  X, 
  CheckCircle2, 
  Coffee, 
  Brain, 
  Flame, 
  Clock, 
  Award,
  ChevronUp,
  Maximize2,
  Minimize2,
  Zap,
  BookOpen
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { dbService } from '../lib/dbService';

interface PomodoroTimerProps {
  user?: any;
}

type Mode = 'work_25' | 'work_50' | 'short_break' | 'long_break';

const MODE_CONFIGS: Record<Mode, { name: { uz: string; ru: string; en: string }; durationMinutes: number; color: string; icon: any }> = {
  work_25: {
    name: { uz: '25 Min Chuqur Dars', ru: '25 Мин Глубокая Учеба', en: '25 Min Deep Work' },
    durationMinutes: 25,
    color: 'from-indigo-500 to-cyan-500',
    icon: Brain
  },
  work_50: {
    name: { uz: '50 Min Intensiv Dars', ru: '50 Мин Интенсив', en: '50 Min Intensive Work' },
    durationMinutes: 50,
    color: 'from-violet-600 to-purple-600',
    icon: Flame
  },
  short_break: {
    name: { uz: '5 Min Kichik Tanaffus', ru: '5 Мин Перерыв', en: '5 Min Short Break' },
    durationMinutes: 5,
    color: 'from-emerald-500 to-teal-500',
    icon: Coffee
  },
  long_break: {
    name: { uz: '15 Min Katta Tanaffus', ru: '15 Мин Перерыв', en: '15 Min Long Break' },
    durationMinutes: 15,
    color: 'from-amber-500 to-orange-500',
    icon: Coffee
  }
};

export default function PomodoroTimer({ user }: PomodoroTimerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('work_25');
  const [timeLeft, setTimeLeft] = useState(MODE_CONFIGS['work_25'].durationMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [completedSessions, setCompletedSessions] = useState<any[]>([]);
  const [activeTopicTitle, setActiveTopicTitle] = useState<string>('Anatomiya darsi');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { language } = useLanguage();
  const timerRef = useRef<any>(null);

  const totalDuration = MODE_CONFIGS[mode].durationMinutes * 60;
  const progressPercent = Math.min(100, Math.max(0, ((totalDuration - timeLeft) / totalDuration) * 100));

  // Retrieve current active topic from ActivityTracker's local storage
  useEffect(() => {
    try {
      const storageKey = user?.uid ? `last_viewed_${user.uid}` : 'last_viewed_guest';
      const lastSaved = localStorage.getItem(storageKey) || sessionStorage.getItem(storageKey);
      if (lastSaved) {
        const parsed = JSON.parse(lastSaved);
        if (parsed?.title) {
          setActiveTopicTitle(parsed.title);
        }
      }
    } catch (e) {
      console.warn("Could not read active topic for timer:", e);
    }
  }, [isOpen, user]);

  // Load completed sessions from local storage & Firestore
  useEffect(() => {
    const localKey = `pomodoro_sessions_${user?.uid || 'guest'}`;
    try {
      const stored = localStorage.getItem(localKey);
      if (stored) {
        setCompletedSessions(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Error loading local pomodoro sessions:", e);
    }

    if (user?.uid && !user.isAnonymous) {
      dbService.getPomodoroSessions(user.uid).then((remoteSessions) => {
        if (remoteSessions && remoteSessions.length > 0) {
          setCompletedSessions(remoteSessions);
          localStorage.setItem(localKey, JSON.stringify(remoteSessions));
        }
      });
    }
  }, [user]);

  // Timer countdown loop
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  // Play chime synth sound
  const playChime = () => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';

      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.15); // E5
      osc1.frequency.setValueAtTime(783.99, now + 0.3); // G5
      osc1.frequency.setValueAtTime(1046.50, now + 0.45); // C6

      osc2.frequency.setValueAtTime(261.63, now); // C4

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.2);
      osc2.stop(now + 1.2);
    } catch (e) {
      console.warn("Audio synthesis error:", e);
    }
  };

  const handleSessionComplete = () => {
    setIsRunning(false);
    playChime();

    const isWorkMode = mode === 'work_25' || mode === 'work_50';
    const duration = MODE_CONFIGS[mode].durationMinutes;

    if (isWorkMode) {
      const newSession = {
        id: `pomo_${Date.now()}`,
        topicTitle: activeTopicTitle,
        durationMinutes: duration,
        mode: mode,
        completedAt: new Date().toISOString()
      };

      const updated = [newSession, ...completedSessions];
      setCompletedSessions(updated);

      const localKey = `pomodoro_sessions_${user?.uid || 'guest'}`;
      localStorage.setItem(localKey, JSON.stringify(updated));

      if (user?.uid && !user.isAnonymous) {
        dbService.savePomodoroSession(user.uid, newSession);
      }

      setToastMessage(
        language === 'uz'
          ? `🍅 Barakalla! ${duration} daqiqalik chuqur o‘quv mashg‘uloti yakunlandi va jurnalga saqlandi!`
          : `🍅 Отлично! ${duration}-минутная сессия учебы завершена и сохранена!`
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }
  };

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(MODE_CONFIGS[newMode].durationMinutes * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(MODE_CONFIGS[mode].durationMinutes * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate today's stats
  const todaySessions = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return completedSessions.filter((s) => {
      if (!s.completedAt) return false;
      return s.completedAt.startsWith(todayStr);
    });
  }, [completedSessions]);

  const todayMinutes = useMemo(() => {
    return todaySessions.reduce((acc, curr) => acc + (curr.durationMinutes || 25), 0);
  }, [todaySessions]);

  const IconComp = MODE_CONFIGS[mode].icon;

  return (
    <>
      {/* Floating Widget Launcher (Bottom Left) */}
      <div className="fixed bottom-5 left-5 z-40 font-sans">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl backdrop-blur-xl border transition-all cursor-pointer ${
            isRunning
              ? 'bg-slate-900 text-cyan-400 border-cyan-500/50 shadow-cyan-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white border-slate-200 dark:border-slate-800 hover:border-indigo-400'
          }`}
          title="Pomodoro Dars Taymeri"
          id="pomodoro-launcher"
        >
          <div className="relative">
            <span className={`p-2 rounded-xl flex items-center justify-center ${
              isRunning ? 'bg-cyan-500/20 text-cyan-400 animate-pulse' : 'bg-indigo-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
            }`}>
              <Timer className="w-4 h-4" />
            </span>
            {isRunning && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            )}
          </div>

          <div className="flex flex-col items-start text-left">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none">
              {isRunning ? 'Diqqat Rejimida' : 'Dars Taymeri'}
            </span>
            <span className="text-sm font-black font-mono tracking-tight text-slate-900 dark:text-white leading-tight mt-0.5">
              {formatTime(timeLeft)}
            </span>
          </div>

          {todaySessions.length > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 rounded-lg text-[10px] font-black flex items-center gap-1 border border-rose-200 dark:border-rose-900">
              🍅 {todaySessions.length}
            </span>
          )}
        </motion.button>
      </div>

      {/* Completion Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[1100] max-w-md w-full px-4 font-sans"
          >
            <div className="p-4 bg-slate-900 text-white border border-cyan-500/50 rounded-2xl shadow-2xl flex items-center justify-between gap-3 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30">
                  <Award className="w-5 h-5 animate-bounce" />
                </div>
                <p className="text-xs font-bold leading-snug">{toastMessage}</p>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Control Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[1000] overflow-y-auto font-sans flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] shadow-2xl overflow-hidden z-10"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-md">
                    <Timer className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      Pomodoro Dars Taymeri
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Diqqatni jamlash va chuqur o‘rganish
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title={soundEnabled ? 'Ovozni o‘chirish' : 'Ovozni yoqish'}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-500" /> : <VolumeX className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Mode Selector Tabs */}
              <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-100 dark:bg-slate-950">
                {(Object.keys(MODE_CONFIGS) as Mode[]).map((mKey) => {
                  const isSel = mode === mKey;
                  const cfg = MODE_CONFIGS[mKey];
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={mKey}
                      onClick={() => handleModeChange(mKey)}
                      className={`py-2 px-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        isSel
                          ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isSel ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                      <span className="truncate">{cfg.durationMinutes}m</span>
                    </button>
                  );
                })}
              </div>

              {/* Main Circular Countdown Display */}
              <div className="p-8 flex flex-col items-center justify-center bg-gradient-to-b from-white dark:from-slate-900 to-slate-50 dark:to-slate-950">
                <div className="relative w-56 h-56 flex items-center justify-center">
                  {/* SVG Progress Ring */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      className="stroke-slate-100 dark:stroke-slate-800"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="42"
                      className="stroke-indigo-600 dark:stroke-cyan-400"
                      strokeWidth="6"
                      strokeDasharray="263.89"
                      strokeDashoffset={263.89 - (263.89 * progressPercent) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                      transition={{ duration: 0.5, ease: 'linear' }}
                    />
                  </svg>

                  {/* Center Time Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <span className="text-4xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                      {formatTime(timeLeft)}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-cyan-400 mt-1 flex items-center gap-1">
                      <IconComp className="w-3 h-3" />
                      {MODE_CONFIGS[mode].name[language] || MODE_CONFIGS[mode].name['uz']}
                    </span>
                  </div>
                </div>

                {/* Active Subject Context */}
                <div className="mt-4 text-center max-w-xs">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                    Tayyorgarlik ob’ekti:
                  </span>
                  <div className="flex items-center justify-center gap-1.5 text-xs font-black text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span className="truncate">{activeTopicTitle}</span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className={`px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider text-white shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95 ${
                      isRunning
                        ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
                        : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
                    }`}
                  >
                    {isRunning ? (
                      <>
                        <Pause className="w-4 h-4 fill-current" />
                        <span>Pauza</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>Boshlash</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleReset}
                    className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                    title="Qayta o‘rnatish"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Today's Focus Stats Summary */}
              <div className="p-5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 rounded-xl">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Bugun:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {todayMinutes} daqiqa ({todaySessions.length} pomodoro)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-xl border border-emerald-200 dark:border-emerald-800 text-[10px] font-black uppercase tracking-wider">
                  <Zap className="w-3 h-3 text-emerald-500" />
                  <span>Avto Saqlanadi</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
