import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Target, 
  Trophy, 
  TrendingUp, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Edit3, 
  Save, 
  Zap, 
  Flame, 
  ChevronRight,
  Sparkles,
  BarChart3,
  Award,
  RotateCcw
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { dbService } from '../lib/dbService';

interface WeeklyStudyGoalsProps {
  user?: any;
  compact?: boolean;
}

const WEEKDAYS = [
  { key: 'Mon', uz: 'Dush', ru: 'Пн', en: 'Mon' },
  { key: 'Tue', uz: 'Sesh', ru: 'Вт', en: 'Tue' },
  { key: 'Wed', uz: 'Chor', ru: 'Ср', en: 'Wed' },
  { key: 'Thu', uz: 'Pay', ru: 'Чт', en: 'Thu' },
  { key: 'Fri', uz: 'Jum', ru: 'Пт', en: 'Fri' },
  { key: 'Sat', uz: 'Shan', ru: 'Сб', en: 'Sat' },
  { key: 'Sun', uz: 'Yak', ru: 'Вс', en: 'Sun' },
];

export default function WeeklyStudyGoals({ user, compact = false }: WeeklyStudyGoalsProps) {
  const { language } = useLanguage();
  const [targetHours, setTargetHours] = useState<number>(10);
  const [isEditingGoal, setIsEditingGoal] = useState<boolean>(false);
  const [tempGoal, setTempGoal] = useState<number>(10);
  const [pomodoroSessions, setPomodoroSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load target goal & pomodoro sessions
  useEffect(() => {
    const localGoalKey = `weekly_goal_${user?.uid || 'guest'}`;
    const localPomoKey = `pomodoro_sessions_${user?.uid || 'guest'}`;

    // Load local storage first
    try {
      const savedGoal = localStorage.getItem(localGoalKey);
      if (savedGoal) {
        const val = parseFloat(savedGoal);
        if (!isNaN(val) && val > 0) {
          setTargetHours(val);
          setTempGoal(val);
        }
      }

      const savedSessions = localStorage.getItem(localPomoKey);
      if (savedSessions) {
        setPomodoroSessions(JSON.parse(savedSessions));
      }
    } catch (e) {
      console.warn("Error reading local storage for weekly goals:", e);
    }

    // Load remote Firestore if authenticated
    if (user?.uid && !user.isAnonymous) {
      setIsLoading(true);
      Promise.all([
        dbService.getWeeklyGoal(user.uid),
        dbService.getPomodoroSessions(user.uid)
      ]).then(([remoteGoal, remoteSessions]) => {
        if (remoteGoal && remoteGoal > 0) {
          setTargetHours(remoteGoal);
          setTempGoal(remoteGoal);
          localStorage.setItem(localGoalKey, remoteGoal.toString());
        }
        if (remoteSessions && remoteSessions.length > 0) {
          setPomodoroSessions(remoteSessions);
          localStorage.setItem(localPomoKey, JSON.stringify(remoteSessions));
        }
      }).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [user]);

  // Helper to get start and end of current week (Monday to Sunday)
  const currentWeekBounds = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday...
    const distanceToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() + distanceToMon);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return { startOfWeek, endOfWeek };
  }, []);

  // Filter current week's Pomodoro sessions
  const thisWeekSessions = useMemo(() => {
    const { startOfWeek, endOfWeek } = currentWeekBounds;
    return pomodoroSessions.filter((s) => {
      if (!s.completedAt) return false;
      const date = new Date(s.completedAt);
      return date >= startOfWeek && date <= endOfWeek;
    });
  }, [pomodoroSessions, currentWeekBounds]);

  // Total study minutes & hours for this week
  const totalWeeklyMinutes = useMemo(() => {
    return thisWeekSessions.reduce((sum, item) => sum + (item.durationMinutes || 25), 0);
  }, [thisWeekSessions]);

  const actualWeeklyHours = totalWeeklyMinutes / 60;
  const progressPercent = Math.min(100, Math.round((actualWeeklyHours / targetHours) * 100));

  // Daily breakdown array (Monday = 0 ... Sunday = 6)
  const dailyBreakdown = useMemo(() => {
    const { startOfWeek } = currentWeekBounds;
    const days = [0, 0, 0, 0, 0, 0, 0]; // minutes per day

    thisWeekSessions.forEach((s) => {
      if (!s.completedAt) return;
      const d = new Date(s.completedAt);
      // calculate day index (0 = Mon, 6 = Sun)
      let idx = d.getDay() - 1;
      if (idx === -1) idx = 6; // Sunday
      if (idx >= 0 && idx < 7) {
        days[idx] += (s.durationMinutes || 25);
      }
    });

    const maxDayMinutes = Math.max(...days, 60); // min scale to 60 mins

    return WEEKDAYS.map((wd, index) => {
      const minutes = days[index];
      const hours = (minutes / 60).toFixed(1);
      const heightPercent = Math.min(100, Math.round((minutes / maxDayMinutes) * 100));
      return {
        ...wd,
        minutes,
        hours,
        heightPercent,
        isToday: (() => {
          const todayIdx = new Date().getDay() - 1 === -1 ? 6 : new Date().getDay() - 1;
          return index === todayIdx;
        })()
      };
    });
  }, [thisWeekSessions, currentWeekBounds]);

  // Handle saving new goal
  const handleSaveGoal = (newVal: number) => {
    if (newVal <= 0 || isNaN(newVal)) return;
    setTargetHours(newVal);
    setIsEditingGoal(false);

    const localGoalKey = `weekly_goal_${user?.uid || 'guest'}`;
    localStorage.setItem(localGoalKey, newVal.toString());

    if (user?.uid && !user.isAnonymous) {
      dbService.saveWeeklyGoal(user.uid, newVal);
    }
  };

  // Translations
  const tTitle = {
    uz: 'Haftalik O‘quv Maqsadlari',
    ru: 'Недельные Цели Обучения',
    en: 'Weekly Study Goals'
  }[language] || 'Haftalik O‘quv Maqsadlari';

  const tSubtitle = {
    uz: 'Pomodoro dars vaqtlaringiz bo‘yicha avtomatik tahlil',
    ru: 'Автоматический анализ по времени сессий Pomodoro',
    en: 'Automatic tracking based on your Pomodoro sessions'
  }[language] || 'Pomodoro dars vaqtlaringiz bo‘yicha avtomatik tahlil';

  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden font-sans ${compact ? 'p-5' : 'p-6 sm:p-8'}`}>
      {/* Background Decorative Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 dark:bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-cyan-500 text-white rounded-2xl shadow-lg shadow-indigo-500/20">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span>{tTitle}</span>
              <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold rounded-lg border border-indigo-200 dark:border-indigo-800">
                {actualWeeklyHours.toFixed(1)}h / {targetHours}h
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {tSubtitle}
            </p>
          </div>
        </div>

        {/* Goal Edit Toggle Button */}
        {!isEditingGoal ? (
          <button
            onClick={() => {
              setTempGoal(targetHours);
              setIsEditingGoal(true);
            }}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-indigo-500" />
            <span>{language === 'ru' ? 'Цель' : language === 'en' ? 'Set Goal' : 'Maqsadni O‘zgartirish'}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-indigo-500/30">
            <input
              type="number"
              min="1"
              max="100"
              value={tempGoal}
              onChange={(e) => setTempGoal(Math.max(1, parseFloat(e.target.value) || 1))}
              className="w-16 px-2.5 py-1 text-center bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-xl text-xs font-black border border-slate-300 dark:border-slate-700 outline-none"
            />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">soat</span>
            <button
              onClick={() => handleSaveGoal(tempGoal)}
              className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
            >
              <Save className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Target Progress Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
        {/* Progress Bar & Status (2 cols) */}
        <div className="md:col-span-2 bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-indigo-500" />
                {language === 'ru' ? 'Прогресс Недели' : language === 'en' ? 'Weekly Completion' : 'Haftalik Bajarilish ko‘rsatkichi'}
              </span>
              <span className="text-sm font-black text-indigo-600 dark:text-cyan-400 font-mono">
                {progressPercent}%
              </span>
            </div>

            {/* Custom Bar */}
            <div className="w-full h-4 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-300/30 dark:border-slate-700/30 mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full bg-gradient-to-r ${
                  progressPercent >= 100
                    ? 'from-emerald-500 to-teal-400 shadow-lg shadow-emerald-500/30'
                    : 'from-indigo-500 to-cyan-400 shadow-lg shadow-indigo-500/30'
                }`}
              />
            </div>

            {/* Sub stats */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
              <span>
                {language === 'ru' ? 'Пройдено:' : language === 'en' ? 'Completed:' : 'O‘rganildi:'}{' '}
                <strong className="text-slate-900 dark:text-white font-mono">{Math.floor(totalWeeklyMinutes / 60)} soat {totalWeeklyMinutes % 60} min</strong>
              </span>
              <span>
                {language === 'ru' ? 'Осталось:' : language === 'en' ? 'Remaining:' : 'Qoldi:'}{' '}
                <strong className="text-slate-900 dark:text-white font-mono">
                  {Math.max(0, targetHours * 60 - totalWeeklyMinutes) >= 60
                    ? `${Math.floor(Math.max(0, targetHours * 60 - totalWeeklyMinutes) / 60)} soat`
                    : `${Math.max(0, targetHours * 60 - totalWeeklyMinutes)} min`}
                </strong>
              </span>
            </div>
          </div>

          {/* Dynamic Encouragement Badge */}
          <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center gap-2">
            {progressPercent >= 100 ? (
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-emerald-500 animate-bounce" />
                🎉 Reja muvaffaqiyatli bajarildi! Siz dars intensivligini a’lo darajada ushlab turibsiz.
              </span>
            ) : progressPercent >= 50 ? (
              <span className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                ⚡ Yaxshi sur’at! Haftalik maqsad yarim yo‘ldan o‘tdi.
              </span>
            ) : (
              <span className="text-xs font-black text-indigo-600 dark:text-cyan-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-indigo-500" />
                🎯 Maqsadga erishish uchun Pomodoro dars taymerini ishga tushiring!
              </span>
            )}
          </div>
        </div>

        {/* Total Pomodoro Sessions Count Box (1 col) */}
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-2xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden border border-indigo-500/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300">
              Sessiyalar Soni
            </span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="my-2">
            <span className="text-3xl font-black font-mono tracking-tight text-white block">
              {thisWeekSessions.length} <span className="text-sm font-bold text-indigo-300">pomodoro</span>
            </span>
            <span className="text-xs text-slate-300 font-medium">
              Ushbu haftada yakunlandi
            </span>
          </div>

          <div className="text-[10px] text-cyan-300/80 font-mono font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>O‘rtacha {thisWeekSessions.length > 0 ? Math.round(totalWeeklyMinutes / thisWeekSessions.length) : 0} min / dars</span>
          </div>
        </div>
      </div>

      {/* Daily Breakdown Bar Chart (Mon - Sun) */}
      <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-500" />
            <span>{language === 'ru' ? 'Активность по дням недели' : language === 'en' ? 'Daily Activity' : 'Kunlik Dars Vaqti Taqsimoti'}</span>
          </h4>
          <span className="text-[10px] font-bold text-slate-400">
            Dushanba — Yakshanba
          </span>
        </div>

        {/* Bars Container */}
        <div className="grid grid-cols-7 gap-2 h-36 items-end pt-4 px-2">
          {dailyBreakdown.map((day) => (
            <div key={day.key} className="flex flex-col items-center h-full justify-end group relative">
              {/* Tooltip on hover */}
              <div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-all bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap shadow-xl z-20">
                {day.minutes} daqiqa ({day.hours}h)
              </div>

              {/* Bar */}
              <div className="w-full max-w-[28px] bg-slate-200 dark:bg-slate-800/80 rounded-xl h-full flex items-end p-0.5 overflow-hidden">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(8, day.heightPercent)}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className={`w-full rounded-lg transition-all ${
                    day.minutes > 0
                      ? day.isToday
                        ? 'bg-gradient-to-t from-cyan-500 to-indigo-500 shadow-md shadow-cyan-500/30'
                        : 'bg-gradient-to-t from-indigo-600 to-indigo-400 dark:from-indigo-500 dark:to-cyan-400'
                      : 'bg-slate-300/50 dark:bg-slate-700/40'
                  }`}
                />
              </div>

              {/* Label */}
              <span className={`text-[10px] font-black uppercase tracking-wider mt-2.5 ${
                day.isToday ? 'text-indigo-600 dark:text-cyan-400 font-extrabold' : 'text-slate-400 dark:text-slate-500'
              }`}>
                {day[language as keyof typeof day] || day.uz}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Sessions List */}
      {thisWeekSessions.length > 0 && !compact && (
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 relative z-10">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>So‘nggi Pomodoro Mashg‘ulotlari</span>
          </h4>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {thisWeekSessions.slice(0, 5).map((s, idx) => (
              <div
                key={s.id || idx}
                className="p-3 bg-slate-50 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-slate-800 text-indigo-600 dark:text-cyan-400 flex items-center justify-center font-black">
                    🍅
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block truncate max-w-[200px] sm:max-w-xs">
                      {s.topicTitle || 'Anatomiya Tayyorgarligi'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(s.completedAt).toLocaleString('uz-UZ', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <span className="font-mono font-black text-indigo-600 dark:text-cyan-400 bg-indigo-50 dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-slate-800">
                  +{s.durationMinutes || 25} min
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
