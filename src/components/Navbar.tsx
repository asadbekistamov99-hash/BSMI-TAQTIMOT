import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, Microscope, LogOut, User as UserIcon, ChevronDown, Sparkles, Globe, Award, FileText, Trash2, Download, Wifi, WifiOff, RefreshCw, Box, Video, Trophy, Target, ShieldCheck, Layers } from 'lucide-react';
import { useState, useEffect } from 'react';
import { signInWithPopup, signInWithRedirect, signOut } from 'firebase/auth';
import { auth, googleProvider, robustSignInAnonymously, reconnectFirestore } from '../lib/firebase';
import { useSettings } from '../hooks/useSettings';
import { useLanguage } from '../hooks/useLanguage';
import GlobalSearch from './GlobalSearch';
import { dbService } from '../lib/dbService';
import { parseDate } from '../lib/dateUtils';
import WeeklyStudyGoals from './WeeklyStudyGoals';

interface NavbarProps {
  isAdmin: boolean;
  user: any;
  onLogout: () => void;
}

export default function Navbar({ isAdmin, user, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isSemestersOpen, setIsSemestersOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [completedTopics, setCompletedTopics] = useState<any[]>([]);
  const [quizHistory, setQuizHistory] = useState<any[]>([]);
  const [firestoreBadges, setFirestoreBadges] = useState<Record<string, any>>({});
  const [profTab, setProfTab] = useState<'topics' | 'quizzes' | 'badges' | 'goals'>('goals');
  const { settings } = useSettings();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Network connection status monitoring
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isReconnecting, setIsReconnecting] = useState(false);

  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      setIsReconnecting(true);
      await reconnectFirestore();
      setIsReconnecting(false);
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check: if navigator says online but we experienced a firestore disconnect,
    // let's do a quiet check or allow manual reconnect
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleManualReconnect = async () => {
    setIsReconnecting(true);
    const success = await reconnectFirestore();
    setIsOnline(success);
    setIsReconnecting(false);
  };

  const handleAdminLogout = () => {
    onLogout();
    navigate('/');
  };

  useEffect(() => {
    if (isProfileOpen && user) {
      const completedKey = `anatomy_completed_topics_${user.uid}`;
      const quizKey = `anatomy_quiz_history_${user.uid}`;
      
      try {
        const compData = JSON.parse(localStorage.getItem(completedKey) || '[]');
        const quizData = JSON.parse(localStorage.getItem(quizKey) || '[]');
        
        compData.sort((a: any, b: any) => parseDate(b.completedAt).getTime() - parseDate(a.completedAt).getTime());
        quizData.sort((a: any, b: any) => parseDate(b.date).getTime() - parseDate(a.date).getTime());
        
        setCompletedTopics(compData);
        setQuizHistory(quizData);

        // Fetch user badges from Firestore
        dbService.getUserBadges(user.uid).then((saved) => {
          const badgeMap: Record<string, any> = {};
          (saved || []).forEach((b) => {
            badgeMap[b.id] = b;
          });
          setFirestoreBadges(badgeMap);
        });
      } catch (e) {
        console.error("Error loading study metrics:", e);
      }
    }
  }, [isProfileOpen, user]);

  const currentHour = new Date().getHours();
  const isMorningStudy = currentHour >= 5 && currentHour < 10;
  const avgQuizScore = quizHistory.length > 0 
    ? Math.round(quizHistory.reduce((sum, item) => sum + (item.percentageVal || Math.round((item.score / item.total) * 100) || 0), 0) / quizHistory.length)
    : 0;

  const badgesList = [
    {
      id: 'first_step',
      icon: '🌱',
      nameUz: 'Anatomiyada Birinchi Qadam',
      nameRu: 'Первый шаг в анатомии',
      nameEn: 'First Step in Anatomy',
      descUz: "Kamida 1 ta mavzuni to'liq o'rganib tugatganingiz uchun",
      descRu: 'За завершение обучения хотя бы одной темы',
      descEn: 'Awarded for completing at least one study session',
      earned: completedTopics.length > 0 || !!firestoreBadges['first_step'],
      color: 'from-blue-400 to-indigo-500',
    },
    {
      id: 'early_bird',
      icon: '🌅',
      nameUz: 'Barvaqt Izlanuvchi (Early Bird)',
      nameRu: 'Ранняя пташка (Early Bird)',
      nameEn: 'Early Bird Scholar',
      descUz: "Ertalabki baquvvat soatlarda (05:00 - 10:00) anatomiya darsini o'qiganingiz uchun",
      descRu: 'За занятия анатомией в утренние часы (05:00 - 10:00)',
      descEn: 'Awarded for morning study sessions between 05:00 and 10:00 AM',
      earned: isMorningStudy || !!firestoreBadges['early_bird'],
      color: 'from-amber-400 to-rose-500',
    },
    {
      id: 'anatomy_master',
      icon: '👑',
      nameUz: 'Anatomiya Ustozi (Master)',
      nameRu: 'Мастер Анатомии',
      nameEn: 'Anatomy Master',
      descUz: "O'rtacha test ballingiz 90%+ va kamida 3 ta darsni a'lo o'zlashtirganingiz uchun",
      descRu: 'За средний балл тестов 90%+ и прохождение не менее 3 тем',
      descEn: 'Awarded for 90%+ avg quiz accuracy and at least 3 completed topics',
      earned: (avgQuizScore >= 90 && completedTopics.length >= 3) || !!firestoreBadges['anatomy_master'],
      color: 'from-cyan-400 to-blue-600',
    },
    {
      id: 'scholar',
      icon: '🎓',
      nameUz: 'Yosh Akademik',
      nameRu: 'Молодой Академик',
      nameEn: 'Anatomy Scholar',
      descUz: "Kamida 3 ta mavzuni muvaffaqiyatli o'rganib chiqqaningiz uchun",
      descRu: 'За изучение не менее 3 тем',
      descEn: 'Awarded for successfully studying at least 3 topics',
      earned: completedTopics.length >= 3 || !!firestoreBadges['scholar'],
      color: 'from-emerald-400 to-green-600',
    },
    {
      id: 'quiz_master',
      icon: '🎯',
      nameUz: 'Sinovlar Gʻolibi',
      nameRu: 'Победитель тестов',
      nameEn: 'Test Master',
      descUz: "Kamida 3 marta bilimni baholash testlarini topshirganingiz uchun",
      descRu: 'За прохождение не менее 3 тестов',
      descEn: 'Awarded for taking at least 3 quiz evaluations',
      earned: quizHistory.length >= 3 || !!firestoreBadges['quiz_master'],
      color: 'from-amber-400 to-orange-500',
    },
    {
      id: 'perfect',
      icon: '💎',
      nameUz: 'Mukammal Bilim (100%)',
      nameRu: 'Абсолютная точность (100%)',
      nameEn: 'Perfect 100% Score',
      descUz: "Testlarda kamida 1 marta 100% lik natija qayd etganingiz uchun",
      descRu: 'За получение 100% баллов в любом тесте',
      descEn: 'Awarded for achieving a flawless 100% in a quiz session',
      earned: quizHistory.some(item => (item.percentageVal || Math.round(item.score / item.total * 100)) === 100) || !!firestoreBadges['perfect'],
      color: 'from-purple-500 to-pink-500',
    }
  ];

  // Auto sync newly earned badges to Firestore
  useEffect(() => {
    if (user?.uid && isProfileOpen) {
      badgesList.forEach((badge) => {
        if (badge.earned && !firestoreBadges[badge.id]) {
          dbService.saveUserBadge(user.uid, {
            id: badge.id,
            nameUz: badge.nameUz,
            nameRu: badge.nameRu,
            nameEn: badge.nameEn,
            descUz: badge.descUz,
            descRu: badge.descRu,
            descEn: badge.descEn,
            icon: badge.icon
          });
        }
      });
    }
  }, [user, isProfileOpen, completedTopics, quizHistory]);

  const earnedBadgesCount = badgesList.filter(b => b.earned).length;

  const handleClearHistory = () => {
    if (!user) return;
    const confirmMsg = {
      uz: "Haqiqatan ham barcha o'qish tarixingizni butunlay tozalamoqchimisiz?",
      ru: "Вы действительно хотите полностью очистить вашу историю обучения?",
      en: "Are you sure you want to permanently reset all study progress?"
    }[language as 'uz' | 'ru' | 'en'] || "Are you sure?";
    
    if (window.confirm(confirmMsg)) {
      const completedKey = `anatomy_completed_topics_${user.uid}`;
      const quizKey = `anatomy_quiz_history_${user.uid}`;
      localStorage.removeItem(completedKey);
      localStorage.removeItem(quizKey);
      setCompletedTopics([]);
      setQuizHistory([]);
    }
  };

  const handleDownloadPDF = () => {
    if (!user) return;
    const completedKey = `anatomy_completed_topics_${user.uid}`;
    const quizKey = `anatomy_quiz_history_${user.uid}`;
    
    let completedList = [];
    let quizList = [];
    
    try {
      completedList = JSON.parse(localStorage.getItem(completedKey) || '[]');
      quizList = JSON.parse(localStorage.getItem(quizKey) || '[]');
    } catch (e) {
      console.error(e);
    }
    
    completedList.sort((a: any, b: any) => parseDate(b.completedAt).getTime() - parseDate(a.completedAt).getTime());
    quizList.sort((a: any, b: any) => parseDate(b.date).getTime() - parseDate(a.date).getTime());

    const totalChaptersCompleted = completedList.length;
    const averageQuizPercentage = quizList.length > 0 
      ? Math.round(quizList.reduce((sum: number, item: any) => sum + (item.percentageVal || item.score / item.total * 100 || 0), 0) / quizList.length)
      : 0;
      
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Iltimos, PDF yuklash uchun brauzerda pop-up darchalarni ochishga ruxsat bering!");
      return;
    }

    const currentYear = new Date().getFullYear();
    const formattedDate = new Date().toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Generate table row HTML outside of the main template string to avoid syntax issues on nested backticks
    let completedRowsHtml = '';
    if (completedList.length === 0) {
      completedRowsHtml = '<p style="font-size: 12px; color: #64748b; font-style: italic; text-align: center; padding: 20px; border: 1px dashed #cbd5e1; border-radius: 12px;">Hozircha o\'rganilgan darsliklar mavjud emas.</p>';
    } else {
      let rowsList = completedList.map((item: any) => {
        const title = item.titleUz || item.titleRu || item.titleEn || "Mavzu";
        const dateStr = new Date(item.completedAt).toLocaleDateString('uz-UZ');
        return `
          <tr>
            <td style="font-weight: 600; color: #1e293b;">${title}</td>
            <td><span class="badge badge-quiz">${item.semester}-Semestr</span></td>
            <td style="color: #64748b; font-size: 11px;">${dateStr}</td>
          </tr>
        `;
      });
      completedRowsHtml = `
        <table>
          <thead>
            <tr>
              <th style="width: 50%;">Mavzu Nomi</th>
              <th style="width: 20%;">Semestr</th>
              <th style="width: 30%;">Sana</th>
            </tr>
          </thead>
          <tbody>
            ${rowsList.join('')}
          </tbody>
        </table>
      `;
    }

    let quizRowsHtml = '';
    if (quizList.length === 0) {
      quizRowsHtml = '<p style="font-size: 12px; color: #64748b; font-style: italic; text-align: center; padding: 20px; border: 1px dashed #cbd5e1; border-radius: 12px;">Hozircha test topshirilmagan.</p>';
    } else {
      let rowsList = quizList.map((item: any) => {
        const title = item.topicNameUz || item.topicNameRu || item.topicNameEn || "Sarlavhasiz";
        const percentage = item.percentageVal || Math.round(item.score / item.total * 100);
        const dateStr = new Date(item.date).toLocaleDateString('uz-UZ');
        let badgeClass = 'badge-quiz';
        if (percentage >= 90) badgeClass = 'badge-perfect';
        return `
          <tr>
            <td style="font-weight: 600; color: #1e293b;">${title}</td>
            <td><span class="badge badge-quiz">${item.semester}-Semestr</span></td>
            <td style="font-weight: 600; text-align: center; font-family: monospace;">${item.score}/${item.total}</td>
            <td><span class="badge ${badgeClass}" style="font-family: monospace; font-weight: 800;">${percentage}%</span></td>
            <td style="color: #64748b; font-size: 11px;">${dateStr}</td>
          </tr>
        `;
      });
      quizRowsHtml = `
        <table>
          <thead>
            <tr>
              <th style="width: 45%;">Mavzu Testi</th>
              <th style="width: 15%;">Semestr</th>
              <th style="width: 15%;">To'g'ri</th>
              <th style="width: 15%;">Ulush</th>
              <th style="width: 10%;">Tarix</th>
            </tr>
          </thead>
          <tbody>
            ${rowsList.join('')}
          </tbody>
        </table>
      `;
    }

    const docLogoUrl = settings?.logoUrl || "https://api.iconify.design/healthicons:anatomy-outline.svg?color=38bdf8";
    const docSiteName = settings?.siteName || "BSMI Anatomy";
    const docTagline = settings?.tagline || "Virtual Study Workspace";
    const docUserName = user.displayName || 'Demo Talaba';
    const docUserEmail = user.email || 'demo@bsmi.uz';
    const docUserUid = user.uid;

    printWindow.document.write(`
      <html>
        <head>
          <title>${docUserName}_Study_History</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              color: #1e293b;
              margin: 40px;
              padding: 0;
              background: #fff;
            }
            .header {
              display: flex;
              align-items: center;
              justify-content: space-between;
              border-bottom: 3px double #0ea5e9;
              padding-bottom: 25px;
              margin-bottom: 35px;
            }
            .logo-sec {
              display: flex;
              align-items: center;
              gap: 15px;
            }
            .logo-img {
              width: 60px;
              height: 60px;
              background-color: #f0fdf4;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .institute-details {
              line-height: 1.25;
            }
            .institute-name {
              font-size: 16px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              color: #0f172a;
              margin: 0;
            }
            .tagline {
              font-size: 10px;
              font-weight: 700;
              color: #0ea5e9;
              text-transform: uppercase;
              letter-spacing: 0.2em;
              margin: 3px 0 0 0;
            }
            .report-title {
              font-size: 12px;
              font-weight: 800;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 0.15em;
              text-align: right;
            }
            .student-card {
              display: grid;
              grid-template-columns: 1fr 1fr;
              background-color: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 16px;
              padding: 24px;
              margin-bottom: 35px;
              gap: 20px;
            }
            .student-info h2 {
              font-size: 20px;
              font-weight: 800;
              color: #0f172a;
              margin: 0 0 8px 0;
            }
            .student-info p {
              font-size: 12px;
              color: #64748b;
              margin: 4px 0;
              font-weight: 500;
            }
            .student-info p span {
              color: #334155;
              font-weight: 600;
            }
            .stats-dashboard {
              display: flex;
              gap: 15px;
              justify-content: flex-end;
            }
            .stat-box {
              background: #fff;
              border: 1px dashed #cbd5e1;
              border-radius: 12px;
              padding: 12px 20px;
              text-align: center;
              min-width: 100px;
            }
            .stat-val {
              font-size: 26px;
              font-weight: 800;
              color: #0f172a;
              margin: 0;
            }
            .stat-lbl {
              font-size: 9px;
              font-weight: 700;
              text-transform: uppercase;
              color: #64748b;
              letter-spacing: 0.05em;
              margin: 3px 0 0 0;
            }
            .section-title {
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 14px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: #0f172a;
              border-bottom: 2px solid #e2e8f0;
              padding-bottom: 8px;
              margin: 40px 0 20px 0;
            }
            .section-badge {
              font-size: 9px;
              font-weight: 800;
              background-color: #f1f5f9;
              padding: 4px 10px;
              border-radius: 20px;
              color: #475569;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 25px;
            }
            th {
              background-color: #f8fafc;
              border-bottom: 2px solid #cbd5e1;
              color: #475569;
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              text-align: left;
              padding: 12px 16px;
            }
            td {
              padding: 12px 16px;
              font-size: 12px;
              border-bottom: 1px solid #e2e8f0;
            }
            tr:last-child td {
              border-bottom: none;
            }
            .badge {
              display: inline-block;
              font-size: 10px;
              font-weight: 700;
              padding: 3px 8px;
              border-radius: 12px;
            }
            .badge-completed {
              background-color: #d1fae5;
              color: #065f46;
            }
            .badge-quiz {
              background-color: #e0f2fe;
              color: #0369a1;
            }
            .badge-perfect {
              background-color: #fef3c7;
              color: #92400e;
            }
            .footer {
              margin-top: 60px;
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
              text-align: center;
              font-size: 10px;
              color: #94a3b8;
              font-weight: 600;
              letter-spacing: 0.05em;
              text-transform: uppercase;
            }
            .print-btn-helper {
              position: fixed;
              bottom: 20px;
              right: 20px;
              background-color: #0f172a;
              color: #fff;
              border: none;
              border-radius: 12px;
              padding: 12px 24px;
              font-size: 12px;
              font-weight: 700;
              cursor: pointer;
              box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
            }
            @media print {
              .print-btn-helper {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo-sec">
              <div class="logo-img">
                <img src="${docLogoUrl}" style="width: 44px; height: 44px; object-fit: contain;" />
              </div>
              <div class="institute-details">
                <h1 class="institute-name">${docSiteName}</h1>
                <p class="tagline">${docTagline}</p>
              </div>
            </div>
            <div class="report-title">
              O'quv Transkripti<br>
              <span style="font-size: 10px; font-weight: 600; color: #94a3b8; text-transform: none; letter-spacing: 0;">Sana: ${formattedDate}</span>
            </div>
          </div>

          <div class="student-card">
            <div class="student-info">
              <h2>${docUserName}</h2>
              <p>Email: <span>${docUserEmail}</span></p>
              <p>Platforma ID: <span style="font-family: monospace; font-size: 11px;">${docUserUid}</span></p>
              <p>Darajasi: <span>Talaba / Premium O'quvchi</span></p>
            </div>
            <div class="stats-dashboard">
              <div class="stat-box">
                <p class="stat-val">${totalChaptersCompleted}</p>
                <p class="stat-lbl">O'zlashtirilgan</p>
              </div>
              <div class="stat-box">
                <p class="stat-val">${averageQuizPercentage}%</p>
                <p class="stat-lbl">Test Balli</p>
              </div>
              <div class="stat-box">
                <p class="stat-val">${quizList.length}</p>
                <p class="stat-lbl">Urinishlar</p>
              </div>
            </div>
          </div>

          <div class="section-title">
            <span>O'zlashtirilgan Nazariy Mavzular</span>
            <span class="section-badge">${totalChaptersCompleted} ta o'rganildi</span>
          </div>
          
          ${completedRowsHtml}

          <div class="section-title" style="margin-top: 50px;">
            <span>Test Imtihonlar Natijalari</span>
            <span class="section-badge">${quizList.length} ta urinish</span>
          </div>

          ${quizRowsHtml}

          <div class="footer">
            Buxoro Davlat Tibbiyot Instituti • Anatomya Virtual Platformasi • ${currentYear}
          </div>

          <button class="print-btn-helper" onclick="window.print()">Chop Etish / PDF Yuklash</button>

          <script>
            window.addEventListener('DOMContentLoaded', () => {
              setTimeout(() => {
                window.print();
              }, 400);
            });
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  const handleGoogleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Save user to Firestore for admin to see
      const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
      const { db } = await import('../lib/firebase');
      
      await setDoc(doc(db, 'users', result.user.uid), {
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        lastLogin: serverTimestamp()
      }, { merge: true });
      
    } catch (error: any) {
      console.error("Google login failed", error);
      if (error.code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError) {
          console.error("Redirect login failed", redirectError);
          setAuthError(error.message || "Login failed");
        }
      } else if (error.code !== 'auth/popup-closed-by-user') {
        setAuthError(error.message || "Kirishda xatolik yuz berdi");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    try {
      await signOut(auth);
      onLogout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="bg-white border-b border-brand-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-4 lg:gap-6">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 flex items-center justify-center p-1 overflow-hidden rounded-full border-2 border-brand-accent bg-white shadow-lg">
                <img 
                  src={settings.logoUrl} 
                  alt={settings.siteName} 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://api.iconify.design/healthicons:anatomy-outline.svg?color=38bdf8";
                  }}
                />
              </div>
              <div>
                <span className="text-xl font-black text-brand-primary tracking-tighter block leading-none">{settings.siteName}</span>
                <span className="text-[8px] font-black text-brand-muted uppercase tracking-[0.2em] hidden sm:block">{settings.tagline}</span>
              </div>
            </Link>

            {/* Elegant Dropdown Language Selector */}
            <div className="hidden lg:block relative text-left lg:-ml-2.5" id="lang-menu">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="w-10 h-10 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all font-black text-sm shadow-sm hover:scale-105 active:scale-95"
                title="Select Language / Tilni tanlash"
              >
                <span>{language === 'uz' ? '🇺🇿' : language === 'ru' ? '🇷🇺' : '🇺🇸'}</span>
              </button>
              
              {isLangOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsLangOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 w-36 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/40 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                    <button
                      onClick={() => {
                        setLanguage('uz');
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-black uppercase tracking-wider transition-colors hover:bg-slate-50 ${language === 'uz' ? 'text-brand-accent bg-brand-bg/50' : 'text-slate-600'}`}
                    >
                      <span className="text-sm">🇺🇿</span> O'ZBEK
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('ru');
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-black uppercase tracking-wider transition-colors hover:bg-slate-50 ${language === 'ru' ? 'text-brand-accent bg-brand-bg/50' : 'text-slate-600'}`}
                    >
                      <span className="text-sm">🇷🇺</span> РУССКИЙ
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('en');
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-black uppercase tracking-wider transition-colors hover:bg-slate-50 ${language === 'en' ? 'text-brand-accent bg-brand-bg/50' : 'text-slate-600'}`}
                    >
                      <span className="text-sm">🇺🇸</span> ENGLISH
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2.5 xl:gap-4">
            {/* Combined Semesters Dropdown */}
            <div className="relative text-left" id="semesters-dropdown-menu">
              <button
                onClick={() => setIsSemestersOpen(!isSemestersOpen)}
                className={`text-xs xl:text-sm font-black transition-all tracking-tight flex items-center gap-1.5 px-3 py-2 rounded-xl border ${
                  location.pathname.startsWith('/semester/') 
                    ? 'text-brand-primary bg-brand-accent/15 border-brand-accent shadow-sm' 
                    : 'text-brand-primary hover:text-brand-accent bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
                title="Semestrlarni tanlash"
              >
                <Layers className="w-3.5 h-3.5 text-brand-accent" />
                <span>{t('nav.semesters')}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isSemestersOpen ? 'rotate-180 text-brand-accent' : ''}`} />
              </button>

              {isSemestersOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsSemestersOpen(false)} 
                  />
                  <div className="absolute left-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-300/50 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 divide-y divide-slate-100">
                    <Link
                      to="/semester/1"
                      onClick={() => setIsSemestersOpen(false)}
                      className={`flex items-start gap-3 p-3 rounded-xl transition-all group ${
                        location.pathname === '/semester/1' ? 'bg-indigo-50/80 border border-indigo-100' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-indigo-100/70 border border-indigo-200 flex items-center justify-center text-indigo-700 font-black text-sm shrink-0 group-hover:scale-105 transition-transform">
                        1
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-xs uppercase tracking-tight text-brand-primary group-hover:text-indigo-600 transition-colors">1-Semestr</span>
                          <span className="text-[9px] font-black text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded">13 Mavzu</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5 line-clamp-1">Tayanch-harakat tizimi (Suyak, Bo'g'im, Mushak)</p>
                      </div>
                    </Link>

                    <Link
                      to="/semester/2"
                      onClick={() => setIsSemestersOpen(false)}
                      className={`flex items-start gap-3 p-3 rounded-xl transition-all group ${
                        location.pathname === '/semester/2' ? 'bg-teal-50/80 border border-teal-100' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-teal-100/70 border border-teal-200 flex items-center justify-center text-teal-700 font-black text-sm shrink-0 group-hover:scale-105 transition-transform">
                        2
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-xs uppercase tracking-tight text-brand-primary group-hover:text-teal-600 transition-colors">2-Semestr</span>
                          <span className="text-[9px] font-black text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">13 Mavzu</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5 line-clamp-1">Ichki a’zolar, qon aylanish & endokrin tizimi</p>
                      </div>
                    </Link>

                    <Link
                      to="/semester/3"
                      onClick={() => setIsSemestersOpen(false)}
                      className={`flex items-start gap-3 p-3 rounded-xl transition-all group ${
                        location.pathname === '/semester/3' ? 'bg-pink-50/80 border border-pink-100' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-xl bg-pink-100/70 border border-pink-200 flex items-center justify-center text-pink-700 font-black text-sm shrink-0 group-hover:scale-105 transition-transform">
                        3
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-xs uppercase tracking-tight text-brand-primary group-hover:text-pink-600 transition-colors">3-Semestr</span>
                          <span className="text-[9px] font-black text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded">13 Mavzu</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5 line-clamp-1">Markaziy asab tizimi & sezgi a’zolari (CNS)</p>
                      </div>
                    </Link>
                  </div>
                </>
              )}
            </div>

            <Link to="/latin-glossary" className="text-xs xl:text-sm font-black text-brand-muted hover:text-brand-accent transition-colors tracking-tight whitespace-nowrap">{t('nav.glossary')}</Link>
            <Link to="/presentation" className="text-xs xl:text-sm font-black text-rose-600 hover:text-rose-700 transition-colors flex items-center gap-1.5 px-2.5 py-1.5 xl:px-3 xl:py-2 bg-rose-50 border border-rose-100 rounded-lg tracking-tight whitespace-nowrap">
              <Video className="w-3.5 h-3.5 text-rose-500" /> {language === 'uz' ? 'TAQDIMOT' : language === 'ru' ? 'ПРЕЗЕНТАЦИЯ' : 'PRESENTATION'}
            </Link>

            <GlobalSearch />
            
            <div className="flex items-center gap-3 xl:gap-4 border-l border-brand-border pl-4 xl:pl-6">
              {/* Connection Status Indicator */}
              {!isOnline ? (
                <button 
                  onClick={handleManualReconnect}
                  disabled={isReconnecting}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-black uppercase tracking-wider rounded-lg hover:bg-amber-100 transition-all shadow-sm cursor-pointer animate-pulse"
                  title="Internet yoki baza bilan aloqa uzilgan. Qayta ulanish uchun bosing."
                >
                  <WifiOff className="w-3 h-3 text-amber-500" />
                  <span>Oflayn</span>
                  <RefreshCw className={`w-2.5 h-2.5 text-amber-600 ${isReconnecting ? 'animate-spin' : ''}`} />
                </button>
              ) : isReconnecting ? (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 border border-sky-100 text-sky-700 text-[10px] font-black uppercase tracking-wider rounded-lg">
                  <RefreshCw className="w-2.5 h-2.5 text-sky-500 animate-spin" />
                  <span>Ulanmoqda</span>
                </div>
              ) : null}

              {user ? (
                <div className="flex items-center gap-2 xl:gap-3">
                  <div 
                    onClick={() => setIsProfileOpen(true)}
                    className="flex items-center gap-2 bg-brand-bg px-3 py-1.5 rounded-full border border-brand-border cursor-pointer hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all shadow-sm"
                    title="Mening Profilim / O'quv statistika"
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName} className="w-5 h-5 rounded-full" referrerPolicy="no-referrer" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-brand-muted" />
                    )}
                    <span className="text-[11px] xl:text-xs font-black text-brand-primary uppercase truncate max-w-[80px] xl:max-w-[100px]">{user.displayName || 'User'}</span>
                  </div>
                  <button onClick={handleGoogleLogout} className="text-brand-muted hover:text-red-500 hover:bg-red-50 border border-slate-200 p-2 rounded-full transition-colors" title="Chiqish / Log out">
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 xl:gap-2">
                  <button 
                    onClick={handleGoogleLogin}
                    disabled={isLoggingIn}
                    className="flex items-center gap-1.5 xl:gap-2 px-3 xl:px-4 py-2 bg-brand-primary text-white rounded-xl text-[11px] xl:text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-brand-primary/10 disabled:opacity-50 disabled:cursor-wait whitespace-nowrap"
                  >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-3.5 h-3.5" />
                    {isLoggingIn ? '...' : t('nav.login')}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:hidden flex items-center gap-4">
            {/* Small screen language switcher triggers inside simple mobile navbar */}
            <div className="relative text-left">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="w-9 h-9 flex items-center justify-center bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-all shadow-sm"
                title="Select Language"
              >
                <span className="text-sm">{language === 'uz' ? '🇺🇿' : language === 'ru' ? '🇷🇺' : '🇺🇸'}</span>
              </button>
              
              {isLangOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsLangOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-32 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/40 py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                    <button
                      onClick={() => {
                        setLanguage('uz');
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-left text-[10px] font-black uppercase tracking-wider transition-colors hover:bg-slate-50 ${language === 'uz' ? 'text-brand-accent bg-brand-bg/50' : 'text-slate-600'}`}
                    >
                      <span>🇺🇿</span> UZB
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('ru');
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-left text-[10px] font-black uppercase tracking-wider transition-colors hover:bg-slate-50 ${language === 'ru' ? 'text-brand-accent bg-brand-bg/50' : 'text-slate-600'}`}
                    >
                      <span>🇷🇺</span> RUS
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('en');
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-left text-[10px] font-black uppercase tracking-wider transition-colors hover:bg-slate-50 ${language === 'en' ? 'text-brand-accent bg-brand-bg/50' : 'text-slate-600'}`}
                    >
                      <span>🇺🇸</span> ENG
                    </button>
                  </div>
                </>
              )}
            </div>

            <GlobalSearch />
            
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 py-4 px-4 space-y-4">
          {!isOnline ? (
            <button 
              onClick={handleManualReconnect}
              disabled={isReconnecting}
              className="w-full flex items-center justify-between gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-black uppercase tracking-wider rounded-xl animate-pulse"
            >
              <span className="flex items-center gap-2">
                <WifiOff className="w-4 h-4 text-amber-500" />
                Oflayn rejim
              </span>
              <span className="flex items-center gap-1.5">
                Qayta ulanish <RefreshCw className={`w-3.5 h-3.5 text-amber-600 ${isReconnecting ? 'animate-spin' : ''}`} />
              </span>
            </button>
          ) : isReconnecting ? (
            <div className="w-full flex items-center gap-2 px-4 py-2.5 bg-sky-50 border border-sky-100 text-sky-700 text-xs font-black uppercase tracking-wider rounded-xl">
              <RefreshCw className="w-3.5 h-3.5 text-sky-500 animate-spin" />
              Baza bilan ulanmoqda...
            </div>
          ) : null}

          {/* Mobile Semesters Group */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-wider px-1">
              <span className="flex items-center gap-1.5 text-brand-primary">
                <Layers className="w-4 h-4 text-brand-accent" />
                {t('nav.semesters')}
              </span>
              <span className="text-[10px] text-slate-400 font-bold">3 ta semestr</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Link 
                to="/semester/1" 
                onClick={() => setIsOpen(false)} 
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-center transition-all ${
                  location.pathname === '/semester/1' 
                    ? 'bg-indigo-600 text-white font-black shadow-md' 
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-indigo-300 font-bold'
                }`}
              >
                <span className="text-xs font-black">1-Semestr</span>
                <span className="text-[9px] opacity-75 mt-0.5">Tayanch</span>
              </Link>
              <Link 
                to="/semester/2" 
                onClick={() => setIsOpen(false)} 
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-center transition-all ${
                  location.pathname === '/semester/2' 
                    ? 'bg-teal-600 text-white font-black shadow-md' 
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-teal-300 font-bold'
                }`}
              >
                <span className="text-xs font-black">2-Semestr</span>
                <span className="text-[9px] opacity-75 mt-0.5">A'zolar</span>
              </Link>
              <Link 
                to="/semester/3" 
                onClick={() => setIsOpen(false)} 
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl text-center transition-all ${
                  location.pathname === '/semester/3' 
                    ? 'bg-pink-600 text-white font-black shadow-md' 
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-pink-300 font-bold'
                }`}
              >
                <span className="text-xs font-black">3-Semestr</span>
                <span className="text-[9px] opacity-75 mt-0.5">Asab / CNS</span>
              </Link>
            </div>
          </div>
          <Link to="/latin-glossary" onClick={() => setIsOpen(false)} className="block text-base font-bold text-slate-600">{t('nav.glossary')}</Link>
          <Link to="/presentation" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-base font-bold text-rose-600 bg-rose-50 px-3 py-2 rounded-xl">
            <Video className="w-4 h-4 text-rose-500" /> {language === 'uz' ? 'Taqdimot Rejimi' : language === 'ru' ? 'Режим Презентации' : 'Presentation Mode'}
          </Link>
          
          <div className="pt-4 border-t border-slate-100">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserIcon className="w-5 h-5 text-brand-muted" />
                    <span className="font-bold text-brand-primary">{user.displayName}</span>
                  </div>
                  <button onClick={handleGoogleLogout} className="text-red-500 font-bold text-sm">{t('nav.logout')}</button>
                </div>
                <button
                  onClick={() => {
                    setIsProfileOpen(true);
                    setIsOpen(false);
                  }}
                  className="w-full py-2.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-brand-primary text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2"
                >
                  <Award className="w-4 h-4 text-[#0ea5e9]" />
                  Profil & Statistika (PDF)
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button 
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn}
                  className="w-full py-3 bg-brand-primary text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" className="w-4 h-4 bg-white rounded-full p-0.5" />
                  {isLoggingIn ? 'KIRISH...' : 'Google orqali kirish'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auth Error Guidance Modal */}
      {authError && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-lg w-full border border-slate-100 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 my-8">
            <button 
              onClick={() => setAuthError(null)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 rounded-full bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-500 flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">
              {language === 'uz' ? "Google orqali kirishda muammo" : "Проблема со входом через Google"}
            </h3>
            
            <div className="mt-4 p-4 bg-red-50/70 border border-red-100 rounded-2xl text-xs font-mono text-red-600 break-all max-h-[100px] overflow-y-auto">
              <strong>Error Info:</strong> {authError}
            </div>

            <div className="mt-6 space-y-4 text-xs text-slate-600 leading-relaxed">
              <p className="font-bold text-slate-800">
                {language === 'uz' 
                  ? "Localhost yoki yangi domenda Google login ishlamasligining asosiy sabablari va ularni hal qilish:" 
                  : "Основные причины и решения проблем со входом на localhost или новом домене:"}
              </p>

              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex gap-2.5">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-brand-primary text-white flex items-center justify-center text-[10px] font-black">1</span>
                  <div>
                    <h4 className="font-black text-slate-800 uppercase tracking-wider text-[10px]">
                      {language === 'uz' ? "Authorized Domains (Ruxsat etilgan domenlar)" : "Authorized Domains (Разрешенные домены)"}
                    </h4>
                    <p className="mt-0.5 text-slate-500">
                      {language === 'uz' 
                        ? "Firebase konsolingizga kiring, Authentication -> Settings -> Authorized domains sahifasida 'localhost' va '127.0.0.1' qo'shilganligiga ishonch hosil qiling." 
                        : "Войдите в Firebase Console, перейдите в Authentication -> Settings -> Authorized domains и убедитесь, что добавлены 'localhost' и '127.0.0.1'."}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2 border-t border-slate-200/60">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-brand-primary text-white flex items-center justify-center text-[10px] font-black">2</span>
                  <div>
                    <h4 className="font-black text-slate-800 uppercase tracking-wider text-[10px]">
                      {language === 'uz' ? "Google Provider Aktivligi" : "Активация Google провайдера"}
                    </h4>
                    <p className="mt-0.5 text-slate-500">
                      {language === 'uz' 
                        ? "Firebase konsolida Authentication -> Sign-in method bo'limidan 'Google' provayderi faollashtirilgan (Enabled) ekanligini tekshiring." 
                        : "В Firebase Console в разделе Authentication -> Sign-in method проверьте, что провайдер 'Google' включен (Enabled)."}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2 border-t border-slate-200/60">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-brand-primary text-white flex items-center justify-center text-[10px] font-black">3</span>
                  <div>
                    <h4 className="font-black text-slate-800 uppercase tracking-wider text-[10px]">
                      {language === 'uz' ? "Iframe va Brauzer Cheklovlari" : "Ограничения браузера и Iframe"}
                    </h4>
                    <p className="mt-0.5 text-slate-500">
                      {language === 'uz' 
                        ? "Google popup darchalari brauzer xavfsizligi yoki iframe muhiti (AI Studio ichida) tomonidan cheklanishi mumkin. Saytni yangi oynada ochib ko'ring." 
                        : "Всплывающие окна могут блокироваться браузером или средой iframe (внутри AI Studio). Попробуйте открыть сайт в новой вкладке."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2.5">
              <button
                onClick={() => {
                  window.open(window.location.origin, '_blank');
                  setAuthError(null);
                }}
                className="w-full py-3 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all cursor-pointer"
              >
                <Globe className="w-4 h-4" />
                {language === 'uz' ? "Yangi oynada ochish" : "Открыть в новой вкладке"}
              </button>

              <button
                onClick={() => setAuthError(null)}
                className="w-full py-2.5 bg-white text-slate-500 hover:text-slate-700 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer"
              >
                {language === 'uz' ? "Ortga qaytish" : "Назад"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Progress Modal */}
      {isProfileOpen && user && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[32px] p-6 sm:p-8 max-w-2xl w-full border border-slate-100 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 my-8">
            <button 
              onClick={() => setIsProfileOpen(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 rounded-full bg-slate-50 hover:bg-slate-100 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-slate-100 pb-6 mb-6">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-brand-bg border border-brand-border flex items-center justify-center">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <UserIcon className="w-8 h-8 text-brand-muted" />
                )}
              </div>
              <div className="text-center sm:text-left flex-grow">
                <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none uppercase">
                  {user.displayName || 'Demo Talaba'}
                </h3>
                <p className="text-slate-400 text-xs font-semibold mt-1.5 lowercase">
                  {user.email || 'demo@bsmi.uz'}
                </p>
                <span className="inline-block mt-2 px-2.5 py-0.5 bg-brand-bg text-[#0ea5e9] border border-brand-border rounded-full text-[10px] font-black uppercase tracking-wider">
                  {user.isAnonymous ? 'Demo Account' : 'Verified Student'}
                </span>
              </div>
              
              {/* PDF Download Button */}
              <button
                onClick={handleDownloadPDF}
                className="w-full sm:w-auto px-5 py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-black text-[11px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-sky-400/10 cursor-pointer transition-all hover:scale-[1.02] active:scale-95"
              >
                <Download className="w-4 h-4" />
                PDF Yuklash
              </button>
            </div>

            <h4 className="text-xs font-black uppercase tracking-widest text-[#0ea5e9] mb-4">
              Analytics Dashboard
            </h4>

            {/* Statistics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                <span className="text-2xl font-black text-brand-primary block">{completedTopics.length}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Completed Topics</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                <span className="text-2xl font-black text-brand-primary block">
                  {quizHistory.length > 0 
                    ? `${Math.round(quizHistory.reduce((sum, item) => sum + (item.percentageVal || item.score / item.total * 100 || 0), 0) / quizHistory.length)}%`
                    : '0%'
                  }
                </span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Avg. Quiz Accuracy</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
                <span className="text-2xl font-black text-brand-primary block">{quizHistory.length}</span>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Quiz Attempts</span>
              </div>
            </div>

            {/* TAB Navigation */}
            <div className="flex flex-wrap gap-2 border-b border-slate-100 mb-4 pb-2">
              <button
                onClick={() => setProfTab('goals')}
                className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg transition-colors ${profTab === 'goals' ? 'bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 font-bold border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-600'}`}
              >
                🎯 Haftalik Maqsad
              </button>
              <button
                onClick={() => setProfTab('topics')}
                className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg transition-colors ${profTab === 'topics' ? 'bg-[#0ea5e9]/10 text-[#0ea5e9]' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Topics ({completedTopics.length})
              </button>
              <button
                onClick={() => setProfTab('quizzes')}
                className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg transition-colors ${profTab === 'quizzes' ? 'bg-[#0ea5e9]/10 text-[#0ea5e9]' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Quizzes ({quizHistory.length})
              </button>
              <button
                onClick={() => setProfTab('badges')}
                className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg transition-colors ${profTab === 'badges' ? 'bg-amber-500/10 text-amber-600 font-bold border-b-2 border-amber-500' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Badges ({earnedBadgesCount}/{badgesList.length})
              </button>
              <div className="flex-grow" />
              {(completedTopics.length > 0 || quizHistory.length > 0) && (
                <button
                  onClick={handleClearHistory}
                  className="px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
            </div>

            {/* List Details */}
            <div className="max-h-[350px] overflow-y-auto space-y-2 pr-1">
              {profTab === 'goals' ? (
                <WeeklyStudyGoals user={user} compact />
              ) : profTab === 'topics' ? (
                <>
                  {completedTopics.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400 font-semibold italic">
                      No topics marked as completed yet. Start studying topics and toggle completion there!
                    </div>
                  ) : (
                    completedTopics.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-50 border border-slate-100 hover:border-slate-200 p-4 rounded-xl transition-all">
                        <div>
                          <span className="text-xs font-black text-brand-primary block uppercase tracking-tight">
                            {item.titleUz || item.titleRu || item.titleEn || 'Sarlavhasiz darslik'}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            Semestr {item.semester || 1} • {new Date(item.completedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full font-black text-[9px] uppercase tracking-wider">
                          Ready ✓
                        </span>
                      </div>
                    ))
                  )}
                </>
              ) : profTab === 'quizzes' ? (
                <>
                  {quizHistory.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400 font-semibold italic">
                      No quiz scores recorded yet. Complete quizzes to log attempts!
                    </div>
                  ) : (
                    quizHistory.map((item, idx) => {
                      const perc = item.percentageVal || Math.round(item.score / item.total * 100);
                      return (
                        <div key={idx} className="flex justify-between items-center bg-slate-50 border border-slate-100 hover:border-slate-200 p-4 rounded-xl transition-all">
                          <div>
                            <span className="text-xs font-black text-brand-primary block uppercase tracking-tight">
                              {item.topicNameUz || item.topicNameRu || item.topicNameEn || 'Sarlavhasiz test'}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">
                              Questions: {item.score}/{item.total} • {new Date(item.date).toLocaleDateString()}
                            </span>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full font-black text-[10px] uppercase tracking-wider border ${
                            perc >= 90 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            perc >= 70 ? 'bg-sky-50 text-sky-700 border-sky-200' :
                            'bg-slate-50 text-slate-600 border-slate-200'
                          }`}>
                            {perc}%
                          </span>
                        </div>
                      );
                    })
                  )}
                </>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {badgesList.map((badge) => (
                    <div 
                      key={badge.id}
                      className={`p-4 rounded-2xl border transition-all duration-300 flex items-center text-left gap-4 relative ${
                        badge.earned 
                          ? 'bg-gradient-to-br from-white to-amber-500/5 border-amber-200 shadow-sm' 
                          : 'bg-slate-50/50 border-slate-100 opacity-60'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full shrink-0 bg-gradient-to-br ${badge.earned ? badge.color : 'from-slate-200 to-slate-200'} flex items-center justify-center text-white text-lg font-black shadow-inner`}>
                        {badge.earned ? (badge.icon || '🏅') : '🔒'}
                      </div>
                      <div className="min-w-0 flex-grow">
                        <h5 className="text-xxs font-black uppercase tracking-tight text-slate-800 leading-tight truncate">
                          { { uz: badge.nameUz, ru: badge.nameRu, en: badge.nameEn }[language] || badge.nameUz }
                        </h5>
                        <p className="text-[9px] text-slate-400 mt-1 leading-normal font-semibold">
                          { { uz: badge.descUz, ru: badge.descRu, en: badge.descEn }[language] || badge.descUz }
                        </p>
                      </div>
                      {badge.earned && (
                        <span className="absolute top-2 right-2 text-[8px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-100 px-1 rounded">
                          Won
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer buttons */}
            <div className="mt-8 flex justify-end gap-3">
              <button 
                onClick={() => setIsProfileOpen(false)}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
