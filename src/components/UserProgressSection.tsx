import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Brain, 
  Activity, 
  PieChart as PieIcon, 
  BarChart3, 
  Target, 
  Sparkles,
  Zap
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface UserProgressSectionProps {
  user?: any;
  completedTopics: any[];
  sem1Total: number;
  sem2Total: number;
  sem3Total?: number;
  totalPercentage: number;
  rank: {
    name: string;
    bg: string;
    desc: string;
  };
}

export default function UserProgressSection({
  user,
  completedTopics,
  sem1Total,
  sem2Total,
  sem3Total = 13,
  totalPercentage,
  rank
}: UserProgressSectionProps) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'categories' | 'analytics'>('overview');

  const sem1Completed = completedTopics.filter((item: any) => Number(item.semester) === 1).length;
  const sem2Completed = completedTopics.filter((item: any) => Number(item.semester) === 2).length;
  const sem3Completed = completedTopics.filter((item: any) => Number(item.semester) === 3).length;

  const totalTopics = sem1Total + sem2Total + sem3Total;
  const totalCompleted = sem1Completed + sem2Completed + sem3Completed;

  // Compute category estimations based on completed topics
  // Semester 1 topics cover Osteology & Myology
  // Semester 2 topics cover Splanchnology & Angiology
  // Semester 3 topics cover Central Nervous System (13 topics) & Sensory Organs
  const categoriesData = [
    {
      name: language === 'uz' ? 'Tayanch-Harakat' : language === 'ru' ? 'Опорно-двигательная' : 'Locomotor',
      latin: 'Osteologia & Myologia',
      completed: Math.min(sem1Completed, sem1Total),
      total: sem1Total,
      color: '#3b82f6',
      bgColor: 'bg-blue-500'
    },
    {
      name: language === 'uz' ? 'Ichki A’zolar' : language === 'ru' ? 'Внутренние органы' : 'Visceral Organs',
      latin: 'Splanchnologia',
      completed: Math.min(sem2Completed, Math.ceil(sem2Total * 0.6)),
      total: Math.ceil(sem2Total * 0.6),
      color: '#10b981',
      bgColor: 'bg-emerald-500'
    },
    {
      name: language === 'uz' ? 'Qon-Tomir Tizimi' : language === 'ru' ? 'Сосудистая система' : 'Cardiovascular',
      latin: 'Angiologia',
      completed: Math.max(0, Math.min(sem2Completed - Math.ceil(sem2Total * 0.6), Math.ceil(sem2Total * 0.4))),
      total: Math.ceil(sem2Total * 0.4),
      color: '#f59e0b',
      bgColor: 'bg-amber-500'
    },
    {
      name: language === 'uz' ? 'Markaziy Asab Tizimi' : language === 'ru' ? 'Нервная система' : 'Central Nervous System',
      latin: 'Systema Nervosum & Esthesiologia',
      completed: Math.min(sem3Completed, sem3Total),
      total: sem3Total,
      color: '#8b5cf6',
      bgColor: 'bg-purple-500'
    }
  ].map(cat => {
    const percentage = cat.total > 0 ? Math.round((cat.completed / cat.total) * 100) : 0;
    return {
      ...cat,
      percentage
    };
  });

  // Data for Semester comparison bar chart
  const semesterChartData = [
    {
      semester: language === 'uz' ? '1-Semestr' : language === 'ru' ? '1-Семестр' : 'Sem 1',
      fullName: language === 'uz' ? '1-Semestr: Tayanch-harakat (13 ta)' : language === 'ru' ? '1-Семестр: Опорно-двиг. (13 тем)' : 'Sem 1: Locomotor (13 topics)',
      "Tugatilgan": sem1Completed,
      "Qolgan": Math.max(0, sem1Total - sem1Completed),
      total: sem1Total,
      completionRate: sem1Total > 0 ? Math.round((sem1Completed / sem1Total) * 100) : 0
    },
    {
      semester: language === 'uz' ? '2-Semestr' : language === 'ru' ? '2-Семестр' : 'Sem 2',
      fullName: language === 'uz' ? '2-Semestr: Ichki a’zolar (13 ta)' : language === 'ru' ? '2-Семестр: Внутр. органы (13 тем)' : 'Sem 2: Visceral (13 topics)',
      "Tugatilgan": sem2Completed,
      "Qolgan": Math.max(0, sem2Total - sem2Completed),
      total: sem2Total,
      completionRate: sem2Total > 0 ? Math.round((sem2Completed / sem2Total) * 100) : 0
    },
    {
      semester: language === 'uz' ? '3-Semestr' : language === 'ru' ? '3-Семестр' : 'Sem 3',
      fullName: language === 'uz' ? '3-Semestr: Markaziy asab tizimi (13 ta)' : language === 'ru' ? '3-Семестр: ЦНС (13 тем)' : 'Sem 3: CNS (13 topics)',
      "Tugatilgan": sem3Completed,
      "Qolgan": Math.max(0, sem3Total - sem3Completed),
      total: sem3Total,
      completionRate: sem3Total > 0 ? Math.round((sem3Completed / sem3Total) * 100) : 0
    }
  ];

  // Pie chart distribution data
  const pieData = [
    {
      name: language === 'uz' ? 'O‘zlashtirilgan' : language === 'ru' ? 'Освоено' : 'Mastered',
      value: totalCompleted,
      color: '#06b6d4'
    },
    {
      name: language === 'uz' ? 'O‘rganilayotgan' : language === 'ru' ? 'В процессе' : 'In Progress',
      value: Math.max(0, totalTopics - totalCompleted),
      color: '#e2e8f0'
    }
  ];

  // Monthly activity trend simulation for AreaChart
  const activityTrendData = [
    { name: '1-Hafta', value: Math.round(totalCompleted * 0.15) },
    { name: '2-Hafta', value: Math.round(totalCompleted * 0.35) },
    { name: '3-Hafta', value: Math.round(totalCompleted * 0.65) },
    { name: 'Joriy', value: totalCompleted }
  ];

  return (
    <div className="mb-16 bg-white dark:bg-slate-900 p-6 md:p-10 rounded-[32px] border border-brand-border shadow-xl shadow-brand-primary/5 transition-colors">
      {/* Header section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-400 text-[11px] font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            {language === 'uz' ? 'Vizual Analitika va O‘zlashtirish' : language === 'ru' ? 'Визуальная Аналитика' : 'Visual Progress Analytics'}
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            {language === 'uz' ? 'Anatomiya fanidan bilim darajasi' : language === 'ru' ? 'Уровень знаний по анатомии' : 'Anatomy Mastery Levels'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            {language === 'uz' 
              ? 'Mavzular va tizimlar bo‘yicha o‘zlashtirish ko‘rsatkichlaringizning grafik tahlili' 
              : language === 'ru' 
              ? 'Графический анализ вашего прогресса по темам и системам органов' 
              : 'Graphical analytics of your progress across anatomy systems and topics'}
          </p>
        </div>

        {/* Rank & Stats Pill */}
        <div className="flex flex-wrap items-center gap-3">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border ${rank.bg} shadow-sm`}>
            <Award className="w-6 h-6 animate-pulse text-amber-500 shrink-0" />
            <div>
              <div className="text-[9px] font-black uppercase tracking-wider opacity-75">
                {language === 'uz' ? 'UNVONINGIZ' : language === 'ru' ? 'ВАШ СТАТУС' : 'YOUR RANK'}
              </div>
              <div className="text-sm font-black tracking-tight">{rank.name}</div>
            </div>
          </div>

          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <Zap className="w-5 h-5 text-cyan-500 shrink-0" />
            <div>
              <div className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                {language === 'uz' ? 'UMUMIY DARAJA' : language === 'ru' ? 'ОБЩИЙ УРОВЕНЬ' : 'TOTAL MASTERY'}
              </div>
              <div className="text-sm font-black text-slate-800 dark:text-white tracking-tight">{totalPercentage}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all shrink-0 ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          {language === 'uz' ? 'Semestrlar bo‘yicha' : language === 'ru' ? 'По семестрам' : 'By Semesters'}
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all shrink-0 ${
            activeTab === 'categories'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <PieIcon className="w-4 h-4" />
          {language === 'uz' ? 'Tizimlar bo‘yicha' : language === 'ru' ? 'По системам органов' : 'By Organ Systems'}
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all shrink-0 ${
            activeTab === 'analytics'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          {language === 'uz' ? 'O‘sish sur’ati' : language === 'ru' ? 'Динамика роста' : 'Growth Trend'}
        </button>
      </div>

      {/* Main Charts Content Area */}
      <div className="mt-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Bar Chart */}
            <div className="lg:col-span-8 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-500" />
                    {language === 'uz' ? 'Semestrlar mavzu tugatilish nisbati' : language === 'ru' ? 'Прогресс завершения тем по семестрам' : 'Semester Topic Completion'}
                  </h4>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                    {language === 'uz' ? 'Tugatilgan va qolgan darslar balansi' : language === 'ru' ? 'Баланс пройденных и оставшихся уроков' : 'Completed vs remaining topic distribution'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{totalCompleted} / {totalTopics}</span>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">{language === 'uz' ? 'Mavzular' : 'Topics'}</span>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={semesterChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.4} />
                    <XAxis dataKey="semester" tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0f172a', 
                        borderColor: '#334155', 
                        borderRadius: '12px', 
                        color: '#ffffff',
                        fontWeight: 'bold',
                        fontSize: '12px'
                      }} 
                    />
                    <Bar dataKey="Tugatilgan" fill="#6366f1" radius={[8, 8, 0, 0]} name={language === 'uz' ? 'Tugatilgan mavzular' : 'Completed topics'} />
                    <Bar dataKey="Qolgan" fill="#e2e8f0" radius={[8, 8, 0, 0]} name={language === 'uz' ? 'Qolgan mavzular' : 'Remaining topics'} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Circular Donut & Quick Breakdown */}
            <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col items-center justify-center">
              <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight mb-2 self-start flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-cyan-500" />
                {language === 'uz' ? 'Umumiy ulush' : language === 'ru' ? 'Общая доля' : 'Mastery Share'}
              </h4>

              <div className="relative w-48 h-48 my-2 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black text-slate-800 dark:text-white">{totalPercentage}%</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{language === 'uz' ? 'Qamrov' : 'Coverage'}</span>
                </div>
              </div>

              <div className="w-full space-y-2 mt-2">
                <div className="flex items-center justify-between text-xs font-extrabold p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
                    {language === 'uz' ? 'O‘zlashtirilgan' : 'Mastered'}
                  </span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-black">{totalCompleted} ta</span>
                </div>
                <div className="flex items-center justify-between text-xs font-extrabold p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <span className="w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                    {language === 'uz' ? 'Qolgan darslar' : 'Remaining'}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 font-black">{Math.max(0, totalTopics - totalCompleted)} ta</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categoriesData.map((cat, idx) => (
              <div 
                key={idx}
                className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2.5 rounded-xl text-white font-bold ${cat.bgColor} shadow-sm`}>
                        <Brain className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-black text-slate-800 dark:text-white leading-snug">
                          {cat.name}
                        </h4>
                        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 italic">
                          {cat.latin}
                        </span>
                      </div>
                    </div>
                    <span className="text-2xl font-black text-slate-800 dark:text-white">
                      {cat.percentage}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden my-3">
                    <div 
                      className="h-full rounded-full transition-all duration-700 ease-out" 
                      style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }} 
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mt-2">
                  <span>
                    {language === 'uz' ? 'O‘rganilgan' : language === 'ru' ? 'Изучено' : 'Learned'}: <strong className="text-slate-800 dark:text-white font-black">{cat.completed} / {cat.total}</strong>
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    cat.percentage >= 80 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' 
                      : cat.percentage >= 40 
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                  }`}>
                    {cat.percentage >= 80 
                      ? (language === 'uz' ? 'A’lo' : 'Excellent') 
                      : cat.percentage >= 40 
                      ? (language === 'uz' ? 'O‘rta' : 'Medium')
                      : (language === 'uz' ? 'Boshlang‘ich' : 'Basic')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-base font-black text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-500" />
                  {language === 'uz' ? 'O‘quv dinamikasi va faollik darajasi' : language === 'ru' ? 'Динамика обучения и активность' : 'Learning Activity Trend'}
                </h4>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  {language === 'uz' ? 'Haftalar davomida o‘zlashtirilgan mavzular hajmi' : language === 'ru' ? 'Объем освоенных тем по неделям' : 'Cumulative completed topics over time'}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 px-3 py-1.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'uz' ? 'Barqaror o‘sish' : 'Steady growth'}</span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.4} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderColor: '#334155', 
                      borderRadius: '12px', 
                      color: '#ffffff',
                      fontWeight: 'bold',
                      fontSize: '12px'
                    }} 
                  />
                  <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorTrend)" name={language === 'uz' ? 'Mavzular soni' : 'Topics count'} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
