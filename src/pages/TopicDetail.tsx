import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Topic, AtlasEntry } from '../types';
import { dbService } from '../lib/dbService';
import { SEMESTER_1_TOPICS, SEMESTER_2_TOPICS } from '../constants';
import { SEMESTER_3_DETAILED_TOPICS } from '../data/semester3TopicsData';
import { motion } from 'motion/react';
import { Book, Play, Image as ImageIcon, Languages, ChevronRight, ClipboardCheck, Lock, Sparkles, Clock, Maximize2, Minimize2, ZoomIn, ZoomOut, X, Type, BookOpen, Search, CheckCircle, Edit3, Trash2, History, Download, Bold, Italic, List, Heading, Code, Check, Stethoscope, Printer } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import PaymentModal from '../components/PaymentModal';
import CreativeAnatomyDiagram from '../components/CreativeAnatomyDiagram';
import AnatomyClinicalCases from '../components/AnatomyClinicalCases';
import ExportTopicPdfModal from '../components/ExportTopicPdfModal';
import { useSettings } from '../hooks/useSettings';
import { useLanguage } from '../hooks/useLanguage';
import { parseDate } from '../lib/dateUtils';
import SEO from '../components/SEO';

function Countdown({ createdAt }: { createdAt: any }) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const { t } = useLanguage();

  useEffect(() => {
    const calculateTime = () => {
      const waitTime = 24 * 60 * 60 * 1000;
      const createdDate = parseDate(createdAt);
      const deadline = createdDate.getTime() + waitTime;
      const now = Date.now();
      const diff = deadline - now;

      if (diff <= 0) {
        setTimeLeft(t('study.pending'));
        return;
      }

      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      setTimeLeft(`${h}h ${m}m ${s}s`);
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [createdAt, t]);

  return <span>{timeLeft}</span>;
}

function HighlightedText({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }
  const regex = new RegExp(`(${highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className="bg-brand-accent/50 text-brand-primary font-bold px-1 rounded-md">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
}

export default function TopicDetail({ isAdmin: isAdminProp, user }: { isAdmin?: boolean, user?: any }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { t, getLocalized, language } = useLanguage();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [paymentCreatedAt, setPaymentCreatedAt] = useState<Date | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const isAdmin = isAdminProp ?? !!localStorage.getItem('adminToken');

  // Fullscreen & Reading Comfort States
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'extra'>('normal');
  const [readTheme, setReadTheme] = useState<'light' | 'warm' | 'dark'>('warm');
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif'>('sans');

  // Study Guide States & Loader
  const [activeTab, setActiveTab] = useState<'theory' | 'video_lessons' | 'study_guide' | 'clinical_cases'>('theory');
  const [studyGuide, setStudyGuide] = useState<string>('');
  const [studyLoading, setStudyLoading] = useState<boolean>(false);
  const [studyError, setStudyError] = useState<string | null>(null);

  // Video Lecture State
  const [selectedVidIndex, setSelectedVidIndex] = useState(0);

  // Get localized videos list based on topic.videos structure (Record<string, string[]> or legacy array)
  const localizedVideos = (() => {
    if (!topic) return [];
    const v = topic.videos;
    if (!v) return [];
    if (typeof v === 'object' && !Array.isArray(v)) {
      return (v as any)[language] || [];
    }
    if (Array.isArray(v)) {
      return language === 'uz' ? v : [];
    }
    return [];
  })();

  // Reset video index on topic change
  useEffect(() => {
    setSelectedVidIndex(0);
  }, [id]);

  // Search & Atlas Related States
  const [relatedAtlas, setRelatedAtlas] = useState<AtlasEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Completion Status Tracking state
  const [isCompleted, setIsCompleted] = useState(false);

  // Dynamic AI Translation States
  const [translatedTheory, setTranslatedTheory] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [transError, setTransError] = useState<string | null>(null);

  useEffect(() => {
    if (topic && language !== 'uz') {
      const cacheKey = `translated_theory_${topic.id}_${language}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setTranslatedTheory(cached);
      } else {
        setTranslatedTheory('');
      }
    } else {
      setTranslatedTheory('');
    }
    setTransError(null);
  }, [topic?.id, language]);

  const checkNeedsTranslation = (): boolean => {
    if (!topic || language === 'uz') return false;
    if (translatedTheory) return false;
    
    // Check if there is already a manual/pre-existing translation in the selected language.
    if (typeof topic.theory === 'object' && topic.theory !== null) {
      const specificLangText = (topic.theory as any)[language];
      if (specificLangText && specificLangText.trim().length > 50) {
        // If it doesn't contain common placeholders
        const isPlaceholder = specificLangText.includes('batafsil o\'rganish') || 
                              specificLangText.includes('batafsil o‘rganish') ||
                              specificLangText.includes('comprehensively updated') ||
                              specificLangText.includes('select Uzbek language') ||
                              specificLangText.includes('успешно обновлены на узбекском') ||
                              specificLangText.includes('переключите язык на узбекский') ||
                              specificLangText.includes('на узбекском языке');
        if (!isPlaceholder) {
          return false; // Already has a translation, no need for AI translation
        }
      }
    }
    return true;
  };

  const handleTranslateTheory = async () => {
    if (!topic) return;
    setIsTranslating(true);
    setTransError(null);
    try {
      const uzText = topic.theory?.uz || (typeof topic.theory === 'string' ? topic.theory : '');
      const response = await fetch('/api/translate-theory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: uzText,
          language
        }),
      });
      if (!response.ok) {
        throw new Error('Translation API failed');
      }
      const data = await response.json();
      if (data.translatedText) {
        setTranslatedTheory(data.translatedText);
        const cacheKey = `translated_theory_${topic.id}_${language}`;
        localStorage.setItem(cacheKey, data.translatedText);
      } else {
        throw new Error('No translated text returned');
      }
    } catch (err: any) {
      console.error("AI Translation error:", err);
      setTransError(language === 'ru' ? 'Ошибка перевода ИИ. Пожалуйста, попробуйте еще раз.' : 'AI translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  // Notes and Annotations states
  const [noteText, setNoteText] = useState('');
  const [savedNotesSnippets, setSavedNotesSnippets] = useState<{ id: string; text: string; createdAt: string }[]>([]);
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [lastSavedNotesTime, setLastSavedNotesTime] = useState<string | null>(null);

  const notesTranslations: Record<string, Record<string, string>> = {
    uz: {
      title: 'Mening Qaydlarim',
      placeholder: 'Ushbu mavzu bo\'yicha o\'zingizning shaxsiy qaydlaringizni yozing...',
      saveStatus: 'O\'zgarishlar saqlandi',
      saving: 'Saqlanmoqda...',
      saveBtn: 'Nusxa saqlash',
      clearBtn: 'Tozalash',
      historyTitle: 'Saqlangan nusxalar',
      noNotes: 'Hozircha saqlangan nusxalar mavjud emas.',
      exportBtn: 'Yuklab olish (.txt)',
      anonymousWarn: 'Tizimga kirmagansiz, qaydlar faqat shu brauzerda saqlanadi.',
      bold: 'Qalin',
      italic: 'Kursiv',
      bullet: 'Ro\'yxat',
      titleLabel: 'Sarlavha',
      codeLabel: 'Kod'
    },
    ru: {
      title: 'Мои Заметки',
      placeholder: 'Напишите свои личные заметки или конспект по этой теме...',
      saveStatus: 'Изменения сохранены',
      saving: 'Сохранение...',
      saveBtn: 'Сохранить копию',
      clearBtn: 'Очистить',
      historyTitle: 'Сохраненные копии',
      noNotes: 'Сохраненных копий пока нет.',
      exportBtn: 'Скачать (.txt)',
      anonymousWarn: 'Вы не вошли в систему, заметки сохраняются только в этом браузере.',
      bold: 'Жирный',
      italic: 'Курсив',
      bullet: 'Список',
      titleLabel: 'Заголовок',
      codeLabel: 'Код'
    },
    en: {
      title: 'My Notes',
      placeholder: 'Write your personal study notes or summaries for this topic here...',
      saveStatus: 'All changes saved locally',
      saving: 'Saving...',
      saveBtn: 'Save a Copy',
      clearBtn: 'Clear',
      historyTitle: 'Saved Snippets & History',
      noNotes: 'No notes logged yet.',
      exportBtn: 'Download notes (.txt)',
      anonymousWarn: 'You are not logged in; notes are saved only in this browser.',
      bold: 'Bold',
      italic: 'Italic',
      bullet: 'List',
      titleLabel: 'Title',
      codeLabel: 'Code'
    }
  };

  const getNotesT = (key: string): string => {
    const lang = language === 'uz' || language === 'ru' || language === 'en' ? language : 'uz';
    return notesTranslations[lang]?.[key] || notesTranslations['uz']?.[key] || '';
  };

  useEffect(() => {
    if (topic) {
      const userId = user?.uid || 'anonymous';
      const notesKey = `anatomy_notes_${userId}_${topic.id}`;
      const savedText = localStorage.getItem(notesKey) || '';
      setNoteText(savedText);

      const snippetsKey = `anatomy_snippets_${userId}_${topic.id}`;
      try {
        const savedSnippets = JSON.parse(localStorage.getItem(snippetsKey) || '[]');
        setSavedNotesSnippets(savedSnippets);
      } catch (e) {
        console.error("Error loading snippets:", e);
      }
    }
  }, [topic, user]);

  const saveNotes = (textValue: string) => {
    if (!topic) return;
    setIsSavingNotes(true);
    const userId = user?.uid || 'anonymous';
    const notesKey = `anatomy_notes_${userId}_${topic.id}`;
    localStorage.setItem(notesKey, textValue);
    
    setTimeout(() => {
      setIsSavingNotes(false);
      setLastSavedNotesTime(new Date().toLocaleTimeString(language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    }, 450);
  };

  const handleAddSnippet = () => {
    if (!noteText.trim() || !topic) return;
    const userId = user?.uid || 'anonymous';
    const snippetsKey = `anatomy_snippets_${userId}_${topic.id}`;
    
    const newSnippet = {
      id: Date.now().toString(),
      text: noteText,
      createdAt: new Date().toISOString()
    };
    
    const updated = [newSnippet, ...savedNotesSnippets];
    setSavedNotesSnippets(updated);
    localStorage.setItem(snippetsKey, JSON.stringify(updated));
  };

  const handleDeleteSnippet = (snippetId: string) => {
    if (!topic) return;
    const userId = user?.uid || 'anonymous';
    const snippetsKey = `anatomy_snippets_${userId}_${topic.id}`;
    const updated = savedNotesSnippets.filter(s => s.id !== snippetId);
    setSavedNotesSnippets(updated);
    localStorage.setItem(snippetsKey, JSON.stringify(updated));
  };

  const handleExportNotes = () => {
    if (!noteText.trim() || !topic) return;
    const topicHeading = topic.title['uz'] || topic.title['uz-UZ'] || 'Mavzu';
    const blob = new Blob([
      `=== ${topicHeading.toUpperCase()} ===\n`,
      `Talaba: ${user?.displayName || 'Demo Foydalanuvchi'}\n`,
      `Sana: ${new Date().toLocaleString()}\n\n`,
      `QAYDLAR:\n`,
      `${noteText}\n\n`,
      `=== BSMI Virtual Anatomy Notes ===`
    ], { type: 'text/plain;charset=utf-8' });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${topic.id}_notes.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const insertFormat = (format: 'bold' | 'italic' | 'code' | 'title' | 'bullet') => {
    const textarea = document.getElementById('notes-textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    
    let replacement = '';
    switch (format) {
      case 'bold':
        replacement = `**${selected || 'bold'}**`;
        break;
      case 'italic':
        replacement = `*${selected || 'italic'}*`;
        break;
      case 'code':
        replacement = `\`${selected || 'code'}\``;
        break;
      case 'title':
        replacement = `\n# ${selected || 'Subtitle'}\n`;
        break;
      case 'bullet':
        replacement = `\n• ${selected || 'item'}`;
        break;
    }
    
    const nextText = text.substring(0, start) + replacement + text.substring(end);
    setNoteText(nextText);
    saveNotes(nextText);
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 50);
  };

  useEffect(() => {
    if (topic && user) {
      const completionKey = `anatomy_completed_topics_${user.uid}`;
      const saved = localStorage.getItem(completionKey);
      if (saved) {
        try {
          const list = JSON.parse(saved);
          setIsCompleted(list.some((item: any) => item.topicId === topic.id));
        } catch (e) {
          console.error("Error reading topic completion:", e);
        }
      }
    }
  }, [topic, user]);

  const toggleCompletion = () => {
    if (!topic || !user) return;
    const completionKey = `anatomy_completed_topics_${user.uid}`;
    const saved = localStorage.getItem(completionKey);
    let list: any[] = [];
    if (saved) {
      try {
        list = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }

    const index = list.findIndex((item: any) => item.topicId === topic.id);
    if (index >= 0) {
      list.splice(index, 1);
      setIsCompleted(false);
    } else {
      list.push({
        topicId: topic.id,
        titleUz: topic.title['uz'] || topic.title['uz-UZ'] || '',
        titleRu: topic.title['ru'] || topic.title['ru-RU'] || '',
        titleEn: topic.title['en'] || topic.title['en-US'] || '',
        completedAt: new Date().toISOString(),
        semester: topic.semester || 1
      });
      setIsCompleted(true);
    }
    localStorage.setItem(completionKey, JSON.stringify(list));
  };

  useEffect(() => {
    if (!topic || activeTab !== 'study_guide') return;

    const fetchGuide = async () => {
      const cacheKey = `study_guide_${topic.id}_${language}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setStudyGuide(cached);
        return;
      }

      setStudyLoading(true);
      setStudyError(null);
      setStudyGuide('');

      try {
        const theoryText = getLocalized(topic.theory) || (typeof topic.theory === 'string' ? topic.theory : '');
        const response = await fetch('/api/generate-study-guide', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            topicTitle: getLocalized(topic.title),
            theoryText: theoryText.substring(0, 15000),
            language,
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.studyGuide) {
          setStudyGuide(data.studyGuide);
          localStorage.setItem(cacheKey, data.studyGuide);
        } else {
          throw new Error(data.error || 'Empty guide generated');
        }
      } catch (err: any) {
        console.error("Failed to generate study guide:", err);
        setStudyError(language === 'uz' ? "AI qo'llanmasini yaratish imkoni bo'lmadi. Iltimos qayta urinib ko'ring." : "Не удалось сгенерировать учебное пособие с помощью ИИ. Пожалуйста, попробуйте еще раз.");
      } finally {
        setStudyLoading(false);
      }
    };

    fetchGuide();
  }, [activeTab, language, topic?.id]);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  useEffect(() => {
    const fetchTopicAndCheckPayment = async () => {
      if (!id) return;
      setLoading(true);

      // Reset state
      setIsPaid(false);
      setIsPending(false);

      try {
        let topicData: Topic | null = null;
        try {
          const docRef = doc(db, 'topics', id);
          const snapshot = await getDoc(docRef);
          if (snapshot.exists()) {
            topicData = { id: snapshot.id, ...snapshot.data() } as Topic;
          }
        } catch (e) {
          console.warn("Direct firestore topic fetch failed, checking fallbacks:", e);
        }

        // Fallback local resolution for sem 1, 2, 3
        if (!topicData) {
          if (id.startsWith('sem_3_top_') || id.startsWith('sem3_topic_')) {
            const index = parseInt(id.replace('sem_3_top_', '').replace('sem3_topic_', ''), 10) - 1;
            if (index >= 0 && index < SEMESTER_3_DETAILED_TOPICS.length) {
              topicData = SEMESTER_3_DETAILED_TOPICS[index];
            }
          } else if (id.startsWith('sem_1_top_') || id.startsWith('sem1_topic_')) {
            const index = parseInt(id.replace('sem_1_top_', '').replace('sem1_topic_', ''), 10) - 1;
            if (index >= 0 && index < SEMESTER_1_TOPICS.length) {
              topicData = {
                id,
                semester: 1,
                order: index + 1,
                title: { uz: `${index + 1}-Mavzu: ${SEMESTER_1_TOPICS[index]}`, en: `Topic ${index + 1}: ${SEMESTER_1_TOPICS[index]}`, ru: `Тема ${index + 1}: ${SEMESTER_1_TOPICS[index]}` },
                theory: { uz: `${SEMESTER_1_TOPICS[index]} bo'yicha batafsil darslik.`, en: '', ru: '' },
                latinTerms: [],
                image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=2564&auto=format&fit=crop",
                videos: []
              };
            }
          } else if (id.startsWith('sem_2_top_') || id.startsWith('sem2_topic_')) {
            const index = parseInt(id.replace('sem_2_top_', '').replace('sem2_topic_', ''), 10) - 1;
            if (index >= 0 && index < SEMESTER_2_TOPICS.length) {
              topicData = {
                id,
                semester: 2,
                order: index + 1,
                title: { uz: `${index + 1}-Mavzu: ${SEMESTER_2_TOPICS[index]}`, en: `Topic ${index + 1}: ${SEMESTER_2_TOPICS[index]}`, ru: `Тема ${index + 1}: ${SEMESTER_2_TOPICS[index]}` },
                theory: { uz: `${SEMESTER_2_TOPICS[index]} bo'yicha batafsil darslik.`, en: '', ru: '' },
                latinTerms: [],
                image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=2670&auto=format&fit=crop",
                videos: []
              };
            }
          }
        }
        
        if (topicData) {
          setTopic(topicData);

          // Fetch related atlas entries too
          try {
            const atlasQuery = query(collection(db, 'atlas'), where('topicId', '==', topicData.id));
            const atlasSnap = await getDocs(atlasQuery);
            const related: AtlasEntry[] = [];
            atlasSnap.forEach(doc => {
              related.push({ id: doc.id, ...doc.data() } as AtlasEntry);
            });
            setRelatedAtlas(related);
          } catch (err) {
            console.error("Error fetching related atlas entries:", err);
          }

          if (isAdmin || user?.isAdmin) {
            setIsPaid(true);
            setIsPending(false);
          } else if (!user) {
            setIsPaid(false);
            setIsPending(false);
          } else {
            // Check direct user object first to prevent any lock-screen flickering
            const currentPurchased = (user.purchasedSemesters || []).map(Number);
            if (currentPurchased.includes(Number(topicData.semester))) {
              setIsPaid(true);
              setIsPending(false);
              return;
            }

            // 1. Check User profile via dbService (supports Appwrite/Supabase/Firebase/Local)
            try {
              const profile = await dbService.getProfile(user.uid);
              if (profile) {
                const purchased = (profile.purchasedSemesters || []).map(Number);
                if (purchased.includes(Number(topicData.semester))) {
                  setIsPaid(true);
                  setIsPending(false);
                  return;
                }
              }
            } catch (err) {
              console.error("Profile check error:", err);
            }

            // 2. Check direct Firestore user document
            try {
              const userRef = doc(db, 'users', user.uid);
              const userSnap = await getDoc(userRef);
              if (userSnap.exists()) {
                const userData = userSnap.data();
                const purchased = (userData.purchasedSemesters || []).map(Number);
                if (purchased.includes(Number(topicData.semester))) {
                  setIsPaid(true);
                  setIsPending(false);
                  return;
                }
              }
            } catch (err) {
              console.error("User check error:", err);
            }

            // 3. Fallback to Payment check for THIS topic's semester
            try {
              const pData = await dbService.getPayment(user.uid, topicData.semester);
              if (pData) {
                if (pData.status === 'completed' || pData.status === 'approved') {
                  setIsPaid(true);
                  setIsPending(false);
                  return;
                } else if (pData.status === 'pending') {
                  setIsPending(true);
                  setIsPaid(false);
                  setPaymentCreatedAt(parseDate(pData.createdAt));
                  return;
                }
              }
            } catch (err) {
              console.error("Payment check error:", err);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching topic/payment:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopicAndCheckPayment();
  }, [id, user, isAdmin]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-900">{t('topic.locked_alert')}</h1>
        <Link to="/" className="text-indigo-600 mt-4 inline-block">{t('quiz.home')}</Link>
      </div>
    );
  }

  const isUnlocked = isPaid;

  if (!isUnlocked) {
    return (
      <div className="bg-brand-bg min-h-screen">
        <header className="bg-brand-primary py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to={`/semester/${topic.semester}`} className="text-xs font-black text-brand-accent hover:text-white transition-all flex items-center gap-2 mb-8 uppercase tracking-[0.2em]">
              ← SEMESTR {topic.semester} {t('study.topics_list').toUpperCase()}
            </Link>
            <h1 className="text-4xl font-black text-white tracking-tight uppercase">
              {getLocalized(topic.title)}
            </h1>
          </div>
        </header>

        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <div className="w-24 h-24 bg-white rounded-[32px] shadow-2xl flex items-center justify-center mx-auto mb-8 border border-brand-border">
            {isPending ? (
              <Clock className="w-12 h-12 text-orange-500 animate-pulse" />
            ) : (
              <Lock className="w-12 h-12 text-brand-accent" />
            )}
          </div>
          <h2 className="text-3xl font-black text-brand-primary mb-6 uppercase tracking-tight">
            {isPending ? t('study.pending') : t('quiz.locked_title')}
          </h2>
          {isPending && paymentCreatedAt && (
            <div className="mb-6 inline-block px-6 py-2 bg-orange-100/50 border border-orange-200 rounded-2xl text-orange-600 font-black tracking-[0.2em] text-[10px]">
              {t('study.pending').toUpperCase()}: <Countdown createdAt={paymentCreatedAt} />
            </div>
          )}
          <p className="text-brand-muted text-lg mb-10 leading-relaxed">
            {isPending 
              ? t('study.status_pending_desc') 
              : t('topic.locked_alert')}
          </p>
          
          <div className="flex flex-col gap-4">
            {!isPending && (
              <button 
                onClick={() => setShowPaymentModal(true)}
                className="w-full py-5 bg-brand-accent text-brand-primary font-black rounded-2xl shadow-xl shadow-brand-accent/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-sm"
              >
                {t('study.subscribe').toUpperCase()} — {settings.priceUZS.toLocaleString()} UZS
              </button>
            )}
            <Link 
              to={`/semester/${topic.semester}`}
              className="w-full py-5 bg-white border border-brand-border text-brand-primary font-bold rounded-2xl hover:bg-slate-50 transition-all uppercase tracking-widest text-sm"
            >
              {t('study.topics_list').toUpperCase()}
            </Link>
          </div>
        </div>

        {showPaymentModal && (
          <PaymentModal 
            semesterId={topic.semester} 
            user={user}
            onClose={() => setShowPaymentModal(false)}
            onSuccess={async () => {
              setShowPaymentModal(false);
              if (user) {
                try {
                  const profile = await dbService.getProfile(user.uid);
                  const pData = await dbService.getPayment(user.uid, topic.semester);
                  const purchased = (profile?.purchasedSemesters || []).map(Number);
                  if (purchased.includes(Number(topic.semester)) || pData?.status === 'completed' || pData?.status === 'approved') {
                    setIsPaid(true);
                    setIsPending(false);
                  } else if (pData?.status === 'pending') {
                    setIsPending(true);
                    setIsPaid(false);
                    if (pData.createdAt) setPaymentCreatedAt(parseDate(pData.createdAt));
                  }
                } catch (e) {
                  console.error("Payment check error:", e);
                }
              }
            }}
          />
        )}
      </div>
    );
  }

  const theoryText = getLocalized(topic.theory) || (typeof topic.theory === 'string' ? topic.theory : '');

  // Extract paragraphs of theory and study guide
  const theoryParagraphs = theoryText
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 5 && !p.startsWith('#') && !p.includes('CreativeAnatomyDiagram') && !p.includes('```'));

  const studyGuideParagraphs = studyGuide
    ? studyGuide
        .split(/\n\n+/)
        .map(p => p.trim())
        .filter(p => p.length > 5 && !p.startsWith('#') && !p.includes('```'))
    : [];

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const isSearching = normalizedQuery.length >= 2;

  const matchedLatin = isSearching
    ? (topic.latinTerms || []).filter(term => 
        term.toLowerCase().includes(normalizedQuery)
      )
    : [];

  const matchedAtlas = isSearching
    ? relatedAtlas.filter(entry => 
        (entry.latinName || '').toLowerCase().includes(normalizedQuery) ||
        (entry.uzbekName || '').toLowerCase().includes(normalizedQuery) ||
        (entry.description || '').toLowerCase().includes(normalizedQuery) ||
        (entry.russianName || '').toLowerCase().includes(normalizedQuery) ||
        (entry.englishName || '').toLowerCase().includes(normalizedQuery)
      )
    : [];

  const matchedTheoryParas = isSearching
    ? theoryParagraphs.filter(p => p.toLowerCase().includes(normalizedQuery))
    : [];

  const matchedGuideParas = isSearching
    ? studyGuideParagraphs.filter(p => p.toLowerCase().includes(normalizedQuery))
    : [];

  const totalResultsCount = matchedLatin.length + matchedAtlas.length + matchedTheoryParas.length + matchedGuideParas.length;

  const topicTitle = getLocalized(topic.title) || 'Anatomiya Mavzusi';
  const topicShortDesc = theoryText 
    ? theoryText.replace(/[#*`_\[\]]/g, '').substring(0, 160).trim() + '...'
    : `BSMI ${topic.semester}-semestr ${topicTitle} mavzusi bo'yicha to'liq nazariy darslik, klinik keyslar va terminlar.`;

  return (
    <div className="bg-brand-bg min-h-screen pb-24">
      <SEO 
        title={`${topicTitle} | ${topic.semester}-Semestr`}
        description={topicShortDesc}
        keywords={`${topicTitle}, semestr ${topic.semester}, anatomiya darslik, tibbiyot, ${(topic.latinTerms || []).slice(0, 5).join(', ')}`}
        ogImage={topic.image || undefined}
        ogType="article"
      />
      {/* Header */}
      <header className="bg-brand-primary py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-accent/10 blur-[100px] -mr-20"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to={`/semester/${topic.semester}`} className="text-xs font-black text-brand-accent hover:text-white transition-all flex items-center gap-2 mb-8 uppercase tracking-[0.2em]">
            ← SEMESTR {topic.semester} {t('study.topics_list').toUpperCase()}
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="px-4 py-1.5 bg-brand-accent/20 border border-brand-accent/30 text-brand-accent rounded-lg font-black uppercase tracking-widest text-[10px]">
                {t('study.unlocked').toUpperCase()} {topic.order}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.1] mb-2 max-w-4xl">
              {getLocalized(topic.title)}
            </h1>
          </motion.div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-10">
            {/* Main Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-[32px] overflow-hidden shadow-2xl border-8 border-white aspect-video relative group bg-indigo-50"
            >
              <img 
                src={topic.image || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format"} 
                alt={getLocalized(topic.title)}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </motion.div>

            {/* Theory Card */}
            <div id="theory-card-top" className="bg-white p-10 md:p-14 rounded-[32px] border border-brand-border shadow-xl shadow-slate-200/50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-brand-border">
                <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-100/80 rounded-2xl select-none max-w-full">
                  <button
                    onClick={() => setActiveTab('theory')}
                    className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                      activeTab === 'theory'
                        ? 'bg-white text-brand-primary shadow-md'
                        : 'text-brand-muted hover:text-brand-primary'
                    }`}
                  >
                    <Book className="w-4 h-4" />
                    <span>{t('topic.theory')}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('video_lessons')}
                    className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                      activeTab === 'video_lessons'
                        ? 'bg-white text-indigo-600 shadow-md border-b-2 border-indigo-500'
                        : 'text-brand-muted hover:text-indigo-600'
                    }`}
                  >
                    <Play className="w-4 h-4 text-indigo-500" />
                    <span>
                      {language === 'uz' ? "Video darslik" : language === 'ru' ? 'Видеолекция' : 'Video Lesson'}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('clinical_cases')}
                    className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                      activeTab === 'clinical_cases'
                        ? 'bg-white text-[#dc2626] shadow-md border-b-2 border-red-500'
                        : 'text-brand-muted hover:text-[#dc2626]'
                    }`}
                  >
                    <Stethoscope className="w-4 h-4" />
                    <span>
                      {language === 'uz' ? "Klinik Cases" : language === 'ru' ? 'Клинические кейсы' : 'Clinical Cases'}
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('study_guide')}
                    className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                      activeTab === 'study_guide'
                        ? 'bg-white text-brand-primary shadow-md'
                        : 'text-brand-muted hover:text-brand-primary'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>
                      {language === 'uz' ? "O'quv qo'llanmasi" : language === 'ru' ? 'Учебный гид' : 'Study Guide'}
                    </span>
                  </button>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setShowExportModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:scale-[1.03] active:scale-95 shadow-md border border-slate-700 cursor-pointer"
                    title="Mavzu konspektini PDF qilib saqlash yoki chop etish"
                  >
                    <Printer className="w-4 h-4 text-blue-400" />
                    <span className="hidden sm:inline">PDF Konspekt</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFullscreen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-brand-accent hover:bg-brand-accent/90 border border-brand-accent/30 text-brand-primary rounded-xl text-xs font-black uppercase tracking-wider transition-all hover:scale-[1.03] active:scale-95 shadow-lg shadow-brand-accent/10 cursor-pointer"
                    title="To'liq ekranda o'qish"
                  >
                    <Maximize2 className="w-4 h-4" />
                    <span>Kengaytirish</span>
                  </button>
                </div>
              </div>

              {/* SEARCH BOX */}
              <div className="mb-8 relative z-10">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                    <Search className="w-5 h-5 text-brand-accent/70" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      language === 'uz' 
                        ? "Mavzudagi atama, tushunchalar yoki darslik matnidan qidirish (o'zbek, lotin)..." 
                        : language === 'ru' 
                          ? "Поиск анатомических понятий, терминов или учебного текста (русский, латынь)..." 
                          : "Search anatomical concepts, structures or textbook content (English, Latin)..."
                    }
                    className="w-full pl-12 pr-10 py-4 bg-brand-bg hover:bg-slate-50 focus:bg-white text-sm text-brand-primary placeholder-brand-muted/70 rounded-2xl border border-brand-border focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all font-semibold outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-5 h-5 focus:outline-none" />
                    </button>
                  )}
                </div>
              </div>

              {isSearching ? (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8 text-left"
                >
                  <div className="flex items-center justify-between border-b border-brand-border pb-4">
                    <h3 className="text-lg font-black text-brand-primary uppercase tracking-tight flex items-center gap-2">
                      <span className="w-2.5 h-6 bg-brand-accent rounded-sm inline-block"></span>
                      {language === 'uz' 
                        ? `Topilgan natijalar (${totalResultsCount})` 
                        : language === 'ru' 
                          ? `Найденные результаты (${totalResultsCount})` 
                          : `Search Results (${totalResultsCount})`
                      }
                    </h3>
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="text-xs font-black text-rose-600 hover:text-rose-800 uppercase tracking-wider cursor-pointer"
                    >
                      {language === 'uz' ? 'Filtrni tozalash' : language === 'ru' ? 'Сбросить фильтр' : 'Clear Filter'}
                    </button>
                  </div>

                  {totalResultsCount === 0 && (
                    <div className="py-16 text-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <Search className="w-8 h-8" />
                      </div>
                      <p className="text-brand-primary font-bold mb-1">
                        {language === 'uz' ? 'Siz qidirgan atama topilmadi' : language === 'ru' ? 'Заданный термин не найден' : 'No matching terms found'}
                      </p>
                      <p className="text-xs text-brand-muted max-w-xs mx-auto leading-relaxed">
                        {language === 'uz' 
                          ? "Qidirmoqchi bo'lgan so'zni to'g'ri va to'liq yozganingizga ishonch hosil qiling." 
                          : language === 'ru' 
                            ? "Убедитесь, что поисковый запрос введен правильно." 
                            : "Check your spelling or try different descriptors."
                        }
                      </p>
                    </div>
                  )}

                  {/* Matching Latin Terms */}
                  {matchedLatin.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-brand-muted uppercase tracking-widest flex items-center gap-2">
                        <Languages className="w-4 h-4 text-brand-accent" />
                        {language === 'uz' ? 'Lotincha Atamalar' : language === 'ru' ? 'Латинские термины' : 'Latin Vocabulary'}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {matchedLatin.map((term, i) => (
                          <div 
                            key={i} 
                            className="p-4 bg-brand-bg rounded-xl border border-brand-border text-brand-primary font-bold italic group hover:border-brand-accent transition-all flex items-center justify-between"
                          >
                            <div>
                              <span className="text-[9px] block text-brand-muted not-italic font-black mb-0.5">TERMIN {i+1}</span>
                              <HighlightedText text={term} highlight={searchQuery} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Atlas Entries */}
                  {matchedAtlas.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-brand-muted uppercase tracking-widest flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-brand-accent" />
                        {language === 'uz' ? '3D Atlas Organlari' : language === 'ru' ? 'Органы 3D Атласа' : '3D Atlas Anatomy'}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {matchedAtlas.map((entry) => (
                          <div 
                            key={entry.id} 
                            className="p-5 bg-white rounded-2xl border border-brand-border hover:border-brand-accent shadow-sm flex gap-4 transition-all"
                          >
                            {entry.image && (
                              <img 
                                src={entry.image} 
                                alt={entry.latinName} 
                                className="w-20 h-20 rounded-xl object-cover border border-slate-100 bg-slate-50 flex-shrink-0"
                                referrerPolicy="no-referrer"
                              />
                            )}
                            <div className="min-w-0 flex-1 flex flex-col justify-between">
                              <div>
                                <h5 className="font-extrabold text-sm text-brand-primary uppercase truncate leading-tight">
                                  <HighlightedText text={entry.latinName} highlight={searchQuery} />
                                </h5>
                                <p className="text-xs font-bold text-indigo-650 mt-1">
                                  <HighlightedText text={entry.uzbekName} highlight={searchQuery} />
                                </p>
                                <p className="text-[11px] text-brand-muted line-clamp-2 mt-2 leading-relaxed">
                                  <HighlightedText text={entry.description} highlight={searchQuery} />
                                </p>
                              </div>
                              <Link 
                                to={`/atlas?q=${encodeURIComponent(entry.latinName)}`}
                                className="inline-flex items-center gap-1.5 text-[10px] font-black text-indigo-650 hover:text-indigo-800 transition-colors uppercase tracking-widest mt-3 cursor-pointer"
                              >
                                <span>{language === 'uz' ? 'Atlasda koʻrish' : language === 'ru' ? 'Смотреть в Атласе' : 'View in Atlas'} →</span>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Theory Snippets */}
                  {matchedTheoryParas.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-brand-muted uppercase tracking-widest flex items-center gap-2">
                        <Book className="w-4 h-4 text-brand-accent" />
                        {language === 'uz' ? 'Oʻquv Darsligi Matnidan' : language === 'ru' ? 'Из текста учебника' : 'From Theory Content'}
                      </h4>
                      <div className="space-y-3">
                        {matchedTheoryParas.map((p, i) => (
                          <div 
                            key={i} 
                            className="p-6 bg-brand-bg border border-brand-border hover:border-brand-accent/50 rounded-2xl transition-all text-left"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-[9px] font-black bg-indigo-50 border border-indigo-100 text-indigo-650 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                {language === 'uz' ? 'Teoriya darsligi' : language === 'ru' ? 'Теория учебника' : 'Theory Text'}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-brand-primary leading-relaxed">
                              <HighlightedText text={p} highlight={searchQuery} />
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Study Guide Snippets */}
                  {matchedGuideParas.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-brand-muted uppercase tracking-widest flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-brand-accent" />
                        {language === 'uz' ? "O'quv Qo'llanmasi Matnidan" : language === 'ru' ? 'Из текста учебного гида' : 'From AI Study Guide'}
                      </h4>
                      <div className="space-y-3">
                        {matchedGuideParas.map((p, i) => (
                          <div 
                            key={i} 
                            className="p-6 bg-brand-accent/5 border border-brand-accent/20 rounded-2xl text-left"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-[9px] font-black bg-indigo-50 border border-indigo-100 text-indigo-650 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                {language === 'uz' ? "AI O'quv qo'llanmasi" : language === 'ru' ? 'Учебный гид ИИ' : 'AI Study Guide'}
                              </span>
                            </div>
                            <p className="text-sm font-medium text-brand-primary leading-relaxed">
                              <HighlightedText text={p} highlight={searchQuery} />
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <>
                  {activeTab === 'theory' ? (
                    <>
                      {/* AI Translation Banner */}
                      {checkNeedsTranslation() && (
                        <div className="mb-8 p-6 bg-brand-bg border border-brand-accent/30 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
                          <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center text-brand-accent shrink-0">
                              <Sparkles className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                              <h4 className="text-sm font-black text-brand-primary">
                                {language === 'ru' 
                                  ? 'Переводчик на базе искусственного интеллекта' 
                                  : 'AI-Powered Content Translation'}
                              </h4>
                              <p className="text-xs text-brand-muted mt-1 max-w-xl">
                                {language === 'ru' 
                                  ? 'Этот учебник в настоящее время доступен в основном на узбекском языке. Вы можете перевести его на русский язык с сохранением всех медицинских терминов в один клик с помощью ИИ.' 
                                  : 'This textbook material is currently formatted in Uzbek. You can instantly translate it to English with all medical terminology preserved using Gemini AI.'}
                              </p>
                              {transError && <p className="text-xs text-rose-500 font-bold mt-2">{transError}</p>}
                            </div>
                          </div>
                          <button
                            onClick={handleTranslateTheory}
                            disabled={isTranslating}
                            className="w-full md:w-auto px-5 py-3 rounded-2xl bg-brand-accent hover:bg-brand-accent/90 disabled:bg-brand-accent/50 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shrink-0 font-sans"
                          >
                            {isTranslating ? (
                              <>
                                <Sparkles className="w-4 h-4 animate-spin" />
                                {language === 'ru' ? 'Перевод...' : 'Translating...'}
                              </>
                            ) : (
                              <>
                                <Languages className="w-4 h-4" />
                                {language === 'ru' ? 'Перевести учебник' : 'Translate Textbook'}
                              </>
                            )}
                          </button>
                        </div>
                      )}

                      {translatedTheory && (
                        <div className="mb-6 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl inline-flex items-center gap-2 text-emerald-700 text-xs font-semibold mr-auto">
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                          <span>
                            {language === 'ru' 
                              ? 'Текст переведен искусственным интеллектом Gemini.' 
                              : 'Text translated by Gemini AI.'}
                          </span>
                        </div>
                      )}

                      {isTranslating ? (
                        <div className="py-24 flex flex-col items-center justify-center text-center animate-fadeIn border border-brand-accent/25 bg-brand-bg/50 rounded-3xl p-8 mb-8 relative overflow-hidden">
                          <div className="absolute -inset-4 bg-brand-accent/5 rounded-full blur-xl animate-pulse"></div>
                          <div className="relative mb-6 animate-bounce" style={{ animationDuration: '3s' }}>
                            <div className="absolute -inset-4 bg-brand-accent/25 rounded-full blur-xl animate-pulse"></div>
                            <div className="w-20 h-20 rounded-[24px] bg-white border border-brand-border flex items-center justify-center shadow-lg relative overflow-hidden">
                              <Languages className="w-10 h-10 text-brand-accent animate-spin" style={{ animationDuration: '4.5s' }} />
                            </div>
                          </div>
                          <h3 className="text-xl font-black text-brand-primary mb-2 tracking-tight">
                            { language === 'ru' ? "Перевод учебного материала..." : language === 'uz' ? "Mavzu matni tarjima qilinmoqda..." : "Translating textbook..." }
                          </h3>
                          <p className="text-xs text-brand-muted font-bold tracking-wider uppercase text-center max-w-sm leading-relaxed animate-pulse">
                            { language === 'ru' ? "Gemini AI готовит точные медицинские и анатомические термины на русском языке" : language === 'uz' ? "Gemini AI eng aniq tibbiy va anatomik terminlarni tayyorlamoqda" : "Gemini AI is preparing precise medical and anatomical terms in English" }
                          </p>
                          <div className="flex gap-2 mt-6">
                            <span className="w-3 h-3 bg-brand-accent rounded-full animate-bounce" style={{ animationDelay: '-0.3s' }}></span>
                            <span className="w-3 h-3 bg-brand-accent rounded-full animate-bounce" style={{ animationDelay: '-0.15s' }}></span>
                            <span className="w-3 h-3 bg-brand-accent rounded-full animate-bounce"></span>
                          </div>
                        </div>
                      ) : (
                        <div className="prose prose-slate max-w-none prose-headings:text-brand-primary prose-p:text-brand-muted prose-p:text-lg prose-p:leading-relaxed prose-li:text-brand-muted prose-strong:text-brand-primary prose-strong:font-bold">
                          <ReactMarkdown
                            components={{
                              code({ className, children, ...props }) {
                                const codeString = String(children).replace(/\n$/, '');
                                const isBlock = codeString.includes('\n');
                                
                                if (className?.includes('language-') || isBlock) {
                                    return <CreativeAnatomyDiagram value={codeString} />;
                                }
                                return <code className={className} {...props}>{children}</code>;
                              }
                            }}
                          >
                            {translatedTheory || getLocalized(topic.theory) || (typeof topic.theory === 'string' ? topic.theory : '')}
                          </ReactMarkdown>
                        </div>
                      )}

                  {/* Latin Terms within Theory Card */}
                  {topic.latinTerms && topic.latinTerms.length > 0 && (
                    <div className="mt-16 pt-12 border-t border-brand-border">
                      <div className="flex items-center gap-3 mb-8 text-brand-primary">
                        <Languages className="w-8 h-8 text-brand-accent" />
                        <h2 className="text-2xl font-black tracking-tight uppercase">{t('topic.latin_terms')}</h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {topic.latinTerms.map((term, i) => (
                          <div key={i} className="p-5 bg-brand-bg rounded-2xl border border-brand-border text-brand-primary font-bold italic group hover:border-brand-accent transition-all">
                            <span className="text-[10px] block text-brand-muted not-italic font-black mb-1">TERMIN {i+1}</span>
                            {term}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* After-Learning Video CTA Section */}
                  {localizedVideos && localizedVideos.length > 0 && (
                    <div className="mt-16 p-8 bg-indigo-50/30 border-2 border-dashed border-indigo-100 rounded-[28px] text-center relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700 pointer-events-none"></div>
                      <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-colors shadow-inner">
                        <Play className="w-6 h-6 fill-indigo-600 ml-0.5" />
                      </div>
                      <h3 className="text-lg font-black text-brand-primary tracking-tight uppercase mb-2">
                        {language === 'uz' ? "Nazariyani o'rganib bo'ldingizmi?" : language === 'ru' ? "Изучили теорию?" : "Finished Studying the Theory?"}
                      </h3>
                      <p className="text-sm font-semibold text-brand-muted max-w-lg mx-auto mb-6 leading-relaxed">
                        {language === 'uz'
                          ? "Ushbu darslikni o'rganib bo'lgach, professional videodarslikni ko'rib yanada chuqurroq o'rganing va bilimingizni vizual darslar bilan mustahkamlang!"
                          : language === 'ru'
                            ? "Теперь закрепите пройденный материал с помощью подробного видеоурока, подготовленного нашими специалистами!"
                            : "Now solidify your theoretical knowledge by watching a detailed video lecture prepared by our medical educators!"}
                      </p>
                      <button
                        onClick={() => {
                          setActiveTab('video_lessons');
                          setSelectedVidIndex(0);
                        }}
                        className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:scale-[1.03] active:scale-95 transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
                      >
                        {language === 'uz' ? "Video darslikni tomosha qilish" : language === 'ru' ? "Смотреть видеоурок" : "Watch Lecture Video"}
                      </button>
                    </div>
                  )}
                </>
              ) : activeTab === 'video_lessons' ? (
                <div className="space-y-8">
                  {(!localizedVideos || localizedVideos.length === 0) ? (
                    <div className="py-20 text-center">
                      <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Play className="w-8 h-8" />
                      </div>
                      <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2">
                        {language === 'uz' ? "Video darsliklar mavjud emas" : language === 'ru' ? "Видеоуроки отсутствуют" : "No videos available"}
                      </h4>
                      <p className="text-sm text-brand-muted max-w-sm mx-auto leading-relaxed">
                        {language === 'uz'
                          ? "Ushbu tilda video ma'ruzalar hali yuklanmagan. Tez orada admin tomonidan kiritiladi."
                          : language === 'ru'
                            ? "Видеолекции на этом языке еще не добавлены. Они появятся здесь в ближайшее время."
                            : "No video lectures have been uploaded in this language yet. They will be added soon."}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Main Video Lecture Workspace */}
                      <div className="border border-brand-border bg-slate-50/50 rounded-3xl p-6 md:p-8">
                        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-xl">
                              <Play className="w-5 h-5 fill-indigo-600 ml-0.5" />
                            </div>
                            <div>
                              <h3 className="text-base font-black text-brand-primary uppercase tracking-tight">
                                {language === 'uz' ? "Video Ma'ruza" : language === 'ru' ? "Видеолекция" : "Video Lecture"}
                              </h3>
                              <p className="text-xs font-semibold text-brand-muted">
                                {language === 'uz' ? "Mavzuning batafsil video tahlili yordamida chuqurroq o'rganing" : "Изучайте основы анатомии глубже с помощью подробных видеолекций"}
                              </p>
                            </div>
                          </div>
                          {localizedVideos.length > 1 && (
                            <span className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-wider rounded-lg">
                              {localizedVideos.length} TA VIDEO
                            </span>
                          )}
                        </div>

                        {/* Video selector tabs if multiple videos exist */}
                        {localizedVideos.length > 1 && (
                          <div className="flex flex-wrap gap-2.5 mb-6 bg-slate-100/50 p-2 rounded-2xl">
                            {localizedVideos.map((vidUrl, index) => (
                              <button
                                key={index}
                                onClick={() => setSelectedVidIndex(index)}
                                className={`px-4 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
                                  selectedVidIndex === index
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                    : 'bg-white border border-slate-200 text-brand-muted hover:bg-slate-50'
                                }`}
                              >
                                <Play className={`w-3 h-3 ${selectedVidIndex === index ? 'fill-white text-white' : 'text-indigo-600 fill-indigo-600'}`} />
                                <span>{language === 'uz' ? `Ma'ruza #${index + 1}` : `Лекция #${index + 1}`}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Video player Area */}
                        <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-black">
                          {(() => {
                            const getYoutubeId = (urlStr: string) => {
                              if (!urlStr) return null;
                              const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
                              const match = urlStr.match(regExp);
                              return (match && match[1] && match[1].length === 11) ? match[1] : null;
                            };
                            const id = getYoutubeId(localizedVideos[selectedVidIndex || 0]);
                            if (id) {
                              return (
                                <iframe
                                  src={`https://www.youtube.com/embed/${id}?autoplay=0&rel=0`}
                                  title="Anatomy Video Lecture"
                                  className="absolute inset-0 w-full h-full border-0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              );
                            } else {
                              return (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-950 text-white">
                                  <Play className="w-12 h-12 text-[#0ea5e9] mb-4 animate-bounce" />
                                  <h4 className="text-base font-black uppercase tracking-wider mb-2">Tashqi Video Manbasi</h4>
                                  <p className="text-xs text-slate-400 max-w-sm mb-6">
                                    {language === 'uz' 
                                      ? "Ushbu video formati faqat tashqi manzillarda qo'llab-quvvatlanadi. Quyidagi tugma orqali darslik sahifasiga o'ting:"
                                      : "Этот формат видео не поддерживает встроенное воспроизведение. Откройте его по ссылке ниже:"}
                                  </p>
                                  <a
                                    href={localizedVideos[selectedVidIndex || 0]}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3.5 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-lg"
                                  >
                                    {language === 'uz' ? "Videoni ochish" : "Открыть видео"}
                                  </a>
                                </div>
                              );
                            }
                          })()}
                        </div>

                        {/* Recommendation Banner */}
                        <div className="mt-8 p-6 bg-emerald-50/60 border border-emerald-100 rounded-2xl flex items-start gap-4">
                          <span className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl font-bold shrink-0 text-sm">🩺</span>
                          <div>
                            <h4 className="text-xs font-black text-emerald-800 uppercase tracking-widest mb-1">
                              {language === 'uz' ? "MUSTAHKAMLASH BO'YICHA MASLAHAT" : "СОВЕТ ПО ЗАКРЕПЛЕНИЮ"}
                            </h4>
                            <p className="text-xs font-semibold text-emerald-700/85 leading-relaxed">
                              {language === 'uz'
                                ? "Visual tarzda organ yoki tizimni ko'rib bo'lganingizdan so'ng, Atlas bo'limiga o'ting va 3D model bo'yicha mustaqil ravishda organ qismlarini tanlab ko'ring. Bu sizga nazariy va vizual bilimlarni amaliyotda birlashtirishga yordam beradi."
                                : "После визуального изучения органа перейдите в 3D Атлас и попробуйте самостоятельно находить его части. Это свяжет теорию и видео с пространственным мышлением."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : activeTab === 'clinical_cases' ? (
                <AnatomyClinicalCases topicTitle={getLocalized(topic.title)} topicId={topic.id} />
              ) : (
                <div className="space-y-8">
                  {studyLoading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center">
                      <div className="relative mb-6">
                        <div className="absolute inset-x-0 mx-auto rounded-full bg-indigo-100 animate-ping opacity-75 w-16 h-16"></div>
                        <div className="relative w-16 h-16 bg-brand-primary rounded-2xl flex items-center justify-center text-brand-accent shadow-xl border border-indigo-500/10 mx-auto">
                          <Sparkles className="w-8 h-8 animate-pulse text-brand-accent" />
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-black text-brand-primary uppercase tracking-tight mb-2">
                        {language === 'uz' ? 'AI O‘QUV QO‘LLANMASI YARATILMOQDA...' : language === 'ru' ? 'СОЗДАНИЕ УЧЕБНОГО ГИДА ИИ...' : 'GENERATING AI STUDY GUIDE...'}
                      </h3>
                      <p className="text-sm font-medium text-brand-muted max-w-sm mb-8 leading-relaxed mx-auto">
                        {language === 'uz' 
                          ? 'Darslik nazariy matni tahlil qilinmoqda, eslab qolish texnikalari, mnemonikalar va klinik bog‘liqliklar shakllantirilmoqda...' 
                          : language === 'ru'
                            ? 'Анализ теоретического текста, сбор мнемотехник, ассоциаций и клинических связей...'
                            : 'Analyzing textbook content, compiling mnemonic aids, associations, and clinical correlations...'}
                      </p>

                      <div className="w-full max-w-xl space-y-4 mx-auto">
                        <div className="h-6 bg-slate-100 rounded-lg animate-pulse w-3/4 mx-auto"></div>
                        <div className="h-4 bg-slate-100/80 rounded-lg animate-pulse w-5/6 mx-auto"></div>
                        <div className="h-4 bg-slate-100/60 rounded-lg animate-pulse w-2/3 mx-auto"></div>
                        <div className="h-4 bg-slate-100/40 rounded-lg animate-pulse w-3/4 mx-auto"></div>
                      </div>
                    </div>
                  ) : studyError ? (
                    <div className="py-16 text-center">
                      <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rose-500">
                        <Languages className="w-8 h-8" />
                      </div>
                      <h4 className="text-lg font-black text-rose-600 uppercase tracking-tight mb-2">Xatolik yuz berdi</h4>
                      <p className="text-sm text-brand-muted max-w-md mx-auto mb-8 leading-relaxed">{studyError}</p>
                      <button
                        onClick={() => {
                          const cacheKey = `study_guide_${topic.id}_${language}`;
                          localStorage.removeItem(cacheKey);
                          setStudyGuide('');
                          setActiveTab('theory');
                          setTimeout(() => {
                            setActiveTab('study_guide');
                          }, 50);
                        }}
                        className="px-8 py-3 bg-brand-primary text-brand-accent font-black rounded-xl text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        Qayta urinish
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <div className="p-6 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-start gap-4 text-left">
                        <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-brand-accent shrink-0">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-brand-primary uppercase tracking-wider mb-1">
                            {language === 'uz' ? 'AI Tahlili Shaxsiy Qo‘llanmasi' : language === 'ru' ? 'Персональный гид на базе ИИ' : 'AI-Synthesized Smart Companion'}
                          </h4>
                          <p className="text-xs font-semibold text-brand-muted leading-relaxed">
                            {language === 'uz'
                              ? 'Ushbu o‘quv qo‘llanmasi darslik nazariyasidan kelib chiqib, yodlashni osonlashtirish uchun maxsus ishlab chiqildi.'
                              : language === 'ru'
                                ? 'Этот гид разработан на основе учебной теории для облегчения запоминания сложных понятий.'
                                : 'This digital reference is dynamically synthesized to streamline memorization of clinical topics.'}
                          </p>
                        </div>
                      </div>

                      <div className="prose prose-slate max-w-none prose-headings:text-brand-primary prose-p:text-brand-muted prose-p:text-lg prose-p:leading-relaxed prose-li:text-brand-muted prose-strong:text-brand-primary prose-strong:font-bold">
                        <ReactMarkdown
                          components={{
                            code({ className, children, ...props }) {
                              const codeString = String(children).replace(/\n$/, '');
                              const isBlock = codeString.includes('\n');
                              
                              if (className?.includes('language-') || isBlock) {
                                return <CreativeAnatomyDiagram value={codeString} />;
                              }
                              return <code className={className} {...props}>{children}</code>;
                            }
                          }}
                        >
                          {studyGuide}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              )}
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Completion Progress Checkbox Card */}
            {user && (
              <div className="p-8 bg-white border border-slate-200/80 rounded-[32px] shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#0ea5e9]" />
                <h3 className="text-lg font-black text-slate-800 tracking-tight leading-none uppercase mb-2">
                  {language === 'uz' ? 'O\'QUV PROGRES' : language === 'ru' ? 'ОБУЧЕНИЕ' : 'STUDY ENGINE'}
                </h3>
                <p className="text-slate-400 text-xs font-semibold leading-relaxed mb-6">
                  {language === 'uz' 
                    ? "Ushbu mavzuni o'rganib tugatgandan so'ng mark qiling. Platformadagi umumiy statistika va PDF yuklama faylida aks etadi." 
                    : "Отметьте, когда закончите читать. Это обновит вашу статистику успеваемости для PDF."}
                </p>
                <button
                  onClick={toggleCompletion}
                  className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    isCompleted 
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 shadow-md shadow-emerald-500/5' 
                      : 'bg-brand-primary border border-brand-primary text-white hover:bg-slate-800 hover:scale-[1.02] shadow-lg shadow-brand-primary/10'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <CheckCircle className="w-4.5 h-4.5 text-emerald-500 animate-pulse" />
                      {language === 'uz' ? "Mavzu O'rganildi ✓" : "Раздел изучен ✓"}
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-4.5 h-4.5" />
                      {language === 'uz' ? "Mavzuni tugatdim" : "Изучил эту тему"}
                    </>
                  )}
                </button>
              </div>
            )}

            {/* My Notes Sidebar Section */}
            {topic && (
              <div className="p-8 bg-white border border-slate-200/80 rounded-[32px] shadow-sm relative overflow-hidden flex flex-col gap-5">
                <div className="absolute top-0 left-0 w-2 h-full bg-brand-accent" />
                
                {/* Header block */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-brand-accent/20 rounded-xl text-brand-primary">
                      <Edit3 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-800 tracking-tight uppercase leading-none">
                        {getNotesT('title')}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">
                        Workspace Notebook
                      </span>
                    </div>
                  </div>

                  {/* Saving indicator status */}
                  <div className="text-right">
                    {isSavingNotes ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg text-[10px] font-black uppercase tracking-wider animate-pulse">
                        <span className="w-1.5 h-1.5 bg-amber-50 rounded-full animate-ping" />
                        {getNotesT('saving')}
                      </span>
                    ) : lastSavedNotesTime ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[10px] font-black uppercase tracking-wider">
                        <Check className="w-3 h-3" />
                        {lastSavedNotesTime}
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Warning for Anonymous users */}
                {!user && (
                  <p className="text-[10px] bg-amber-50 border border-amber-100 text-amber-700 p-2.5 rounded-xl font-semibold leading-relaxed">
                    {getNotesT('anonymousWarn')}
                  </p>
                )}

                {/* Text Formatting toolbar */}
                <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-50 border border-slate-100 rounded-xl">
                  <button 
                    onClick={() => insertFormat('bold')} 
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-all text-xs font-bold cursor-pointer"
                    title={getNotesT('bold')}
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => insertFormat('italic')} 
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-all text-xs font-bold cursor-pointer"
                    title={getNotesT('italic')}
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => insertFormat('title')} 
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-all text-xs font-bold cursor-pointer"
                    title={getNotesT('titleLabel')}
                  >
                    <Heading className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => insertFormat('bullet')} 
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-all text-xs font-bold cursor-pointer"
                    title={getNotesT('bullet')}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => insertFormat('code')} 
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg transition-all text-xs font-bold cursor-pointer"
                    title={getNotesT('codeLabel')}
                  >
                    <Code className="w-4 h-4" />
                  </button>
                </div>

                {/* Text area */}
                <div className="relative">
                  <textarea 
                    id="notes-textarea" 
                    value={noteText}
                    onChange={(e) => {
                      setNoteText(e.target.value);
                      saveNotes(e.target.value);
                    }}
                    placeholder={getNotesT('placeholder')}
                    className="w-full h-44 p-4 bg-slate-50 border border-slate-200/60 focus:border-sky-300 focus:bg-white rounded-2xl text-xs font-medium outline-none transition-all placeholder:text-slate-400 focus:ring-4 focus:ring-sky-100 resize-none font-sans leading-relaxed"
                  />
                  <div className="absolute bottom-3 right-3 text-[9px] font-black text-slate-400 tracking-wider">
                    {noteText.length} CHARS
                  </div>
                </div>

                {/* Notebook actions controls */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleAddSnippet}
                    disabled={!noteText.trim()}
                    className="flex-grow py-3 px-4 bg-slate-850 hover:bg-slate-800 text-white font-black text-[10px] uppercase tracking-wider rounded-xl transition-all disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-slate-900/10"
                  >
                    <History className="w-3.5 h-3.5 text-brand-accent" />
                    {getNotesT('saveBtn')}
                  </button>

                  <button
                    onClick={handleExportNotes}
                    disabled={!noteText.trim()}
                    className="py-3 px-4 bg-slate-100 hover:bg-[#0ea5e9]/10 text-slate-600 hover:text-[#0ea5e9] border border-transparent hover:border-[#0ea5e9]/20 font-black text-[10px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {getNotesT('exportBtn')}
                  </button>

                  {noteText.trim() && (
                    <button
                      onClick={() => {
                        if (window.confirm(language === 'uz' ? 'Qaydni tozalashni tasdiqlaysizmi?' : 'Очистить заметку?')) {
                          setNoteText('');
                          saveNotes('');
                        }
                      }}
                      className="py-3 px-3 bg-red-50 hover:bg-red-100 text-red-500 font-black text-[10px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center cursor-pointer"
                      title={getNotesT('clearBtn')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Historical Snippets List */}
                {savedNotesSnippets.length > 0 && (
                  <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <History className="w-3.5 h-3.5 text-slate-400" />
                      {getNotesT('historyTitle')} ({savedNotesSnippets.length})
                    </h4>

                    <div className="max-h-48 overflow-y-auto space-y-2 pr-1.5 custom-scrollbar">
                      {savedNotesSnippets.map((snippet) => (
                        <div 
                          key={snippet.id}
                          className="p-3 bg-slate-50 border border-slate-100 hover:border-slate-200 rounded-xl flex items-start justify-between gap-3 group transition-all"
                        >
                          <div 
                            className="flex-grow cursor-pointer text-left" 
                            onClick={() => {
                              if (!noteText.trim() || window.confirm(language === 'uz' ? 'Mavjud qoralamaga almashtirilsinmi?' : 'Заменить текущий черновик?')) {
                                setNoteText(snippet.text);
                                saveNotes(snippet.text);
                              }
                            }}
                          >
                            <p className="text-[11px] font-medium text-slate-600 line-clamp-2 leading-relaxed">
                              {snippet.text}
                            </p>
                            <span className="text-[8px] font-black text-[#0ea5e9] tracking-wider block mt-1 uppercase">
                              {new Date(snippet.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          
                          <button
                            onClick={() => handleDeleteSnippet(snippet.id)}
                            className="text-slate-350 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-all self-center cursor-pointer md:opacity-0 group-hover:opacity-100"
                            title="X"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quiz Link */}
            <Link 
              to={`/quiz/${topic.id}`}
              className="block p-10 bg-brand-accent rounded-[32px] text-brand-primary shadow-2xl shadow-brand-accent/20 hover:scale-[1.02] transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-bl-full -mr-12 -mt-12"></div>
              <ClipboardCheck className="w-12 h-12 mb-6 group-hover:rotate-12 transition-transform" />
              <h3 className="text-2xl font-black mb-3 leading-tight uppercase tracking-tight">{t('home.feat_quizzes')}</h3>
              <p className="text-brand-primary/70 text-sm font-medium leading-relaxed mb-10">
                {t('home.feat_quizzes_desc')}
              </p>
              <div className="flex items-center justify-between font-black text-xs tracking-widest uppercase">
                {t('study.unlocked').toUpperCase()} <ChevronRight className="w-5 h-5" />
              </div>
            </Link>

            {/* Video Lessons */}
            {localizedVideos && localizedVideos.length > 0 && (
              <div className="p-8 bg-brand-primary rounded-[32px] border border-slate-700 shadow-xl">
                <div className="flex items-center gap-3 mb-8 text-white">
                  <Play className="w-6 h-6 text-brand-accent" />
                  <h3 className="text-xl font-black tracking-tight uppercase">{t('topic.video')}</h3>
                </div>
                <div className="space-y-6">
                  {localizedVideos.map((url, i) => {
                    const isDirectVideo = url.includes('.mp4') || url.includes('firebasestorage');
                    return (
                      <div key={i} className="space-y-3">
                        <div className="text-[10px] font-black text-brand-accent uppercase tracking-widest pl-2">#{i + 1}</div>
                        {isDirectVideo ? (
                          <div className="rounded-2xl overflow-hidden border border-slate-700 bg-black aspect-video">
                            <video 
                              src={url} 
                              controls 
                              className="w-full h-full"
                              preload="metadata"
                            />
                          </div>
                        ) : (
                          <a 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block group"
                          >
                            <div className="flex items-center gap-4 p-4 bg-slate-800 rounded-2xl border border-slate-700 group-hover:border-brand-accent transition-all text-left">
                              <div className="w-12 h-12 bg-brand-accent rounded-xl flex items-center justify-center flex-shrink-0 text-brand-primary">
                                <Play className="w-6 h-6 fill-current" />
                              </div>
                              <div>
                                <div className="text-[10px] font-black text-brand-accent uppercase tracking-widest mb-0.5">{t('topic.video').toUpperCase()}</div>
                                <div className="text-sm font-bold text-white group-hover:text-brand-accent transition-colors">{t('study.unlocked')}</div>
                              </div>
                            </div>
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Help/Support Section */}
            <div className="p-8 bg-white rounded-[32px] border border-brand-border text-center">
              <div className="w-16 h-16 bg-brand-bg rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand-accent border border-brand-border">
                <ImageIcon className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-black text-brand-primary mb-3 uppercase tracking-tight">{t('home.feat_atlas')}</h4>
              <p className="text-brand-muted text-sm leading-relaxed mb-6">{t('home.feat_atlas_desc')}</p>
              <Link to="/atlas" className="inline-block px-8 py-3 bg-brand-bg text-brand-primary border border-brand-border font-bold rounded-xl text-xs hover:bg-brand-accent hover:border-brand-accent transition-all">
                {t('home.view_atlas').toUpperCase()}
              </Link>
            </div>

            {/* Watch Video Lesson Shortcut Card */}
            <div className="p-8 bg-indigo-600 rounded-[32px] text-white text-center shadow-lg shadow-indigo-600/10">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/15">
                <Play className="w-8 h-8 fill-white ml-1 text-white" />
              </div>
              <h4 className="text-lg font-black mb-3 uppercase tracking-tight">
                {language === 'uz' ? 'Video darslik' : language === 'ru' ? 'Видео-урок' : 'Video Lesson'}
              </h4>
              <p className="text-white/80 text-xs font-semibold leading-relaxed mb-6">
                {language === 'uz' 
                  ? "Nazariyani o'rganib bo'lgach, videodarslikni ko'rib mavzuni yanada chuqurroq o'rganing va bilimingizni mustahkamlang!" 
                  : language === 'ru' 
                    ? 'Изучив теорию, посмотрите видео-урок, чтобы глубже понять тему и закрепить знания!' 
                    : 'After studying the theory, watch the video lesson to deepen your understanding and solidify your knowledge!'}
              </p>
              <button 
                onClick={() => {
                  setActiveTab('video_lessons');
                  setSelectedVidIndex(0);
                  const el = document.getElementById('theory-card-top');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full py-4.5 bg-brand-accent text-brand-primary font-black rounded-xl text-xs uppercase tracking-widest hover:scale-[1.03] active:scale-95 transition-all shadow-md cursor-pointer block"
              >
                {language === 'uz' ? "Videodan o'rganish" : language === 'ru' ? 'Изучать по видео' : 'Watch Video'}
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* Immersive Fullscreen Reader */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 backdrop-blur-xl p-0 sm:p-4 md:p-6 transition-all">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full h-full sm:h-[94vh] max-w-6xl rounded-none sm:rounded-[32px] shadow-2xl border flex flex-col overflow-hidden relative ${
              readTheme === 'light' 
                ? 'bg-white text-slate-800 border-slate-200' 
                : readTheme === 'warm'
                  ? 'bg-[#FCF8F2] text-[#2D241A] border-[#EBDCC5]'
                  : 'bg-[#0f1115] text-slate-200 border-slate-800'
            }`}
          >
            {/* Top Controls Toolbar */}
            <div className={`px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b shrink-0 ${
              readTheme === 'light' 
                ? 'border-slate-100 bg-slate-50' 
                : readTheme === 'warm' 
                  ? 'border-[#EBDCC5] bg-[#FAF5ED]' 
                  : 'border-slate-800 bg-[#161a22]'
            }`}>
              {/* Title */}
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-brand-accent shrink-0" />
                <div className="min-w-0">
                  <span className={`text-[9px] font-black uppercase tracking-widest block leading-none mb-1 ${
                    readTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Mutolaa Rejimi
                  </span>
                  <h3 className={`font-black text-sm uppercase truncate ${
                    readTheme === 'dark' ? 'text-white' : 'text-brand-primary'
                  }`}>
                    {getLocalized(topic.title)}
                  </h3>
                </div>
              </div>

              {/* Setting Buttons */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-sans">
                {/* Text Size Controls */}
                <div className="flex items-center gap-1">
                  <span className={`text-[10px] font-bold mr-1 uppercase ${
                    readTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}>Matn:</span>
                  <div className={`flex items-center p-0.5 rounded-xl border ${
                    readTheme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                  }`}>
                    <button 
                      onClick={() => setTextSize('normal')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all text-[11px] cursor-pointer ${
                        textSize === 'normal' 
                          ? 'bg-brand-accent text-brand-primary font-black shadow-sm' 
                          : readTheme === 'dark' ? 'text-slate-300 hover:bg-slate-850' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                      title="Kichik"
                    >
                      A
                    </button>
                    <button 
                      onClick={() => setTextSize('large')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all text-xs cursor-pointer ${
                        textSize === 'large' 
                          ? 'bg-brand-accent text-brand-primary font-black shadow-sm' 
                          : readTheme === 'dark' ? 'text-slate-300 hover:bg-slate-850' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                      title="O'rta"
                    >
                      A+
                    </button>
                    <button 
                      onClick={() => setTextSize('extra')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all text-sm cursor-pointer ${
                        textSize === 'extra' 
                          ? 'bg-brand-accent text-brand-primary font-black shadow-sm' 
                          : readTheme === 'dark' ? 'text-slate-300 hover:bg-slate-850' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                      title="Katta"
                    >
                      A++
                    </button>
                  </div>
                </div>

                {/* Font Choices */}
                <div className="flex items-center gap-1">
                  <span className={`text-[10px] font-bold mr-1 uppercase ${
                    readTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}>Shrift:</span>
                  <div className={`flex items-center p-0.5 rounded-xl border ${
                    readTheme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                  }`}>
                    <button 
                      onClick={() => setFontFamily('sans')}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all text-[11px] cursor-pointer ${
                        fontFamily === 'sans' 
                          ? 'bg-indigo-600 text-white shadow-sm' 
                          : readTheme === 'dark' ? 'text-slate-300 hover:bg-slate-850' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Sans
                    </button>
                    <button 
                      onClick={() => setFontFamily('serif')}
                      className={`px-2.5 py-1 rounded-lg font-serif font-bold transition-all text-[11px] cursor-pointer ${
                        fontFamily === 'serif' 
                          ? 'bg-indigo-600 text-white shadow-sm' 
                          : readTheme === 'dark' ? 'text-slate-300 hover:bg-slate-850' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      Serif
                    </button>
                  </div>
                </div>

                {/* Background theme */}
                <div className="flex items-center gap-1">
                  <span className={`text-[10px] font-bold mr-1 uppercase ${
                    readTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                  }`}>Mavzu:</span>
                  <div className={`flex items-center p-0.5 rounded-xl border gap-0.5 ${
                    readTheme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                  }`}>
                    <button 
                      onClick={() => setReadTheme('light')}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center border font-bold text-xs cursor-pointer ${
                        readTheme === 'light' ? 'border-indigo-600 ring-2 ring-indigo-600/10 bg-white' : 'border-slate-100 bg-white'
                      } text-slate-800`}
                      title="Kunduzgi"
                    >
                      ☀
                    </button>
                    <button 
                      onClick={() => setReadTheme('warm')}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center border font-bold text-xs cursor-pointer ${
                        readTheme === 'warm' ? 'border-amber-600 ring-2 ring-amber-600/10 bg-[#FAF6F0]' : 'border-[#EADFCF] bg-[#FAF6F0]'
                      } text-[#2C251E]`}
                      title="Sepia"
                    >
                      ☕
                    </button>
                    <button 
                      onClick={() => setReadTheme('dark')}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center border font-bold text-xs cursor-pointer ${
                        readTheme === 'dark' ? 'border-slate-500 ring-2 ring-slate-500/10 bg-slate-900' : 'border-slate-800 bg-slate-900'
                      } text-slate-300`}
                      title="Tungi"
                    >
                      ☾
                    </button>
                  </div>
                </div>

                {/* Close Button */}
                <button 
                  onClick={() => setIsFullscreen(false)}
                  className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-black px-4 py-2 rounded-xl active:scale-95 transition-all shadow-md cursor-pointer ml-1"
                >
                  <X className="w-4 h-4" />
                  <span>Chiqish</span>
                </button>
              </div>
            </div>

            {/* Main Reading Canvas */}
            <div className="flex-1 overflow-y-auto px-6 py-12 md:px-16 md:py-20">
              <div className={`mx-auto max-w-3xl leading-relaxed ${
                fontFamily === 'serif' ? 'font-serif' : 'font-sans'
              }`}>
                {/* Header info in reader */}
                <div className="text-center mb-14">
                  <span className={`inline-block px-3.5 py-1 bg-brand-accent/25 border border-brand-accent/35 text-brand-primary rounded-lg font-black uppercase tracking-widest text-[9px] mb-4`}>
                    {t('study.unlocked').toUpperCase()} {topic.order}
                  </span>
                  <h2 className={`text-3xl md:text-5xl font-black tracking-tight uppercase leading-tight mb-8 ${
                    readTheme === 'dark' ? 'text-white' : 'text-brand-primary'
                  }`}>
                    {getLocalized(topic.title)}
                  </h2>

                  {/* Inline Tab Navigation for Immersive Reader */}
                  <div className="flex justify-center mb-8">
                    <div className={`flex items-center gap-1.5 p-1 rounded-2xl select-none ${
                      readTheme === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-slate-100/80 border border-slate-200/50'
                    }`}>
                      <button
                        onClick={() => setActiveTab('theory')}
                        className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                          activeTab === 'theory'
                            ? readTheme === 'dark' ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-brand-primary shadow-md'
                            : 'text-brand-muted hover:text-brand-primary'
                        }`}
                      >
                        <Book className="w-4 h-4" />
                        <span>{t('topic.theory')}</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('study_guide')}
                        className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                          activeTab === 'study_guide'
                            ? readTheme === 'dark' ? 'bg-slate-800 text-white shadow-md' : 'bg-white text-brand-primary shadow-md'
                            : 'text-brand-muted hover:text-brand-primary'
                        }`}
                      >
                        <Sparkles className="w-4 h-4 text-indigo-550" />
                        <span>
                          {language === 'uz' ? "O'quv qo'llanmasi" : language === 'ru' ? 'Учебный гид' : 'Study Guide'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* IMMERSIVE READER SEARCH BOX */}
                  <div className="max-w-md mx-auto mb-8 relative z-10">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                        <Search className="w-4 h-4 text-brand-accent/80" />
                      </span>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={
                          language === 'uz' 
                            ? "Matndan yoki atamalardan qidirish..." 
                            : language === 'ru' 
                              ? "Поиск по тексту или терминам..." 
                              : "Search within text or terms..."
                        }
                        className={`w-full pl-10 pr-9 py-2.5 rounded-xl border text-xs font-semibold outline-none transition-all ${
                          readTheme === 'dark'
                            ? 'bg-slate-900 border-slate-800 focus:border-slate-700 text-white placeholder-slate-500'
                            : readTheme === 'warm'
                              ? 'bg-[#EADFCF]/50 border-[#EADFCF] focus:border-[#C4B39F] text-[#2D241A] placeholder-[#8F7C68]'
                              : 'bg-slate-100 border-slate-200 focus:border-slate-350 text-brand-primary placeholder-brand-muted/70'
                        }`}
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-650 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className={`w-24 h-1 mx-auto my-8 rounded bg-brand-accent`}></div>
                </div>

                {/* Prose Body */}
                <div className={`prose ${
                  readTheme === 'dark' ? 'prose-invert' : 'prose-slate'
                } ${
                  textSize === 'normal' 
                    ? 'prose-base sm:prose-lg leading-relaxed' 
                    : textSize === 'large'
                      ? 'prose-lg sm:prose-xl leading-relaxed'
                      : 'prose-xl sm:prose-2xl leading-relaxed'
                } max-w-none prose-headings:font-black prose-headings:tracking-tight prose-strong:font-bold ${
                  readTheme === 'warm' 
                    ? 'text-[#2D241A] prose-headings:text-[#1F170F] prose-p:text-[#2D241A]/95 prose-strong:text-[#1F170F] prose-li:text-[#2D241A]/95'
                    : readTheme === 'dark'
                      ? 'text-slate-200 prose-headings:text-white prose-p:text-slate-300 prose-strong:text-white'
                      : 'text-slate-800 prose-headings:text-brand-primary prose-p:text-brand-muted prose-strong:text-brand-primary'
                }`}>
                  {isSearching ? (
                    <div className="space-y-8 text-left not-prose">
                      <div className={`flex items-center justify-between border-b pb-3 ${
                        readTheme === 'dark' ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
                      }`}>
                        <span className="text-xs font-black uppercase tracking-wider">
                          {language === 'uz' ? `Qidiruv natijalari (${totalResultsCount})` : language === 'ru' ? `Результаты поиска (${totalResultsCount})` : `Matched segments (${totalResultsCount})`}
                        </span>
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="text-xs font-black opacity-80 hover:opacity-100 uppercase tracking-widest cursor-pointer"
                        >
                          {language === 'uz' ? 'Tozalash' : language === 'ru' ? 'Сбросить' : 'Clear'}
                        </button>
                      </div>

                      {totalResultsCount === 0 && (
                        <div className="py-12 text-center opacity-70">
                          <p className="font-bold text-sm">
                            {language === 'uz' ? 'Hech narsa topilmadi' : language === 'ru' ? 'Ничего не найдено' : 'No matches found'}
                          </p>
                        </div>
                      )}

                      {/* Matching Latin Terms */}
                      {matchedLatin.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[10px] font-black tracking-widest opacity-60 uppercase">{language === 'uz' ? 'Lotincha Atamalar' : 'Латинские термины'}</span>
                          <div className="flex flex-wrap gap-2">
                            {matchedLatin.map((term, i) => (
                              <span 
                                key={i} 
                                className={`px-3 py-1.5 rounded-lg border text-xs font-bold font-mono ${
                                  readTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-brand-accent' : 'bg-slate-100 border-slate-200 text-brand-primary'
                                }`}
                              >
                                <HighlightedText text={term} highlight={searchQuery} />
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Textbook Matches in Reader */}
                      {matchedTheoryParas.length > 0 && (
                        <div className="space-y-3">
                          <span className="text-[10px] font-black tracking-widest opacity-60 uppercase">{language === 'uz' ? 'Darslik matnidan' : 'Из учебника'}</span>
                          {matchedTheoryParas.map((p, i) => (
                            <div 
                              key={i} 
                              className={`p-5 rounded-xl border leading-relaxed ${
                                readTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-200' : readTheme === 'warm' ? 'bg-[#EADFCF]/35 border-[#EADFCF] text-[#2D241A]' : 'bg-slate-50 border-slate-250 text-slate-800'
                              } text-sm md:text-base`}
                            >
                              <p>
                                <HighlightedText text={p} highlight={searchQuery} />
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Study Guide Matches in Reader */}
                      {matchedGuideParas.length > 0 && (
                        <div className="space-y-3">
                          <span className="text-[10px] font-black tracking-widest opacity-60 uppercase">{language === 'uz' ? "O'quv qo'llanmasidan" : 'Из учебного гида'}</span>
                          {matchedGuideParas.map((p, i) => (
                            <div 
                              key={i} 
                              className={`p-5 rounded-xl border leading-relaxed ${
                                readTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-200' : readTheme === 'warm' ? 'bg-[#EADFCF]/35 border-[#EADFCF] text-[#2D241A]' : 'bg-slate-50 border-slate-250 text-slate-800'
                              } text-sm md:text-base`}
                            >
                              <p>
                                <HighlightedText text={p} highlight={searchQuery} />
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {activeTab === 'theory' ? (
                        <div className="text-left">
                          {isTranslating ? (
                            <div className="py-24 flex flex-col items-center justify-center text-center animate-fadeIn border border-brand-accent/25 bg-brand-bg/50 rounded-3xl p-8 mb-8 relative overflow-hidden">
                              <div className="absolute -inset-4 bg-brand-accent/5 rounded-full blur-xl animate-pulse"></div>
                              <div className="relative mb-6 animate-bounce" style={{ animationDuration: '3s' }}>
                                <div className="absolute -inset-4 bg-brand-accent/25 rounded-full blur-xl animate-pulse"></div>
                                <div className="w-20 h-20 rounded-[24px] bg-white border border-brand-border flex items-center justify-center shadow-lg relative overflow-hidden">
                                  <Languages className="w-10 h-10 text-brand-accent animate-spin" style={{ animationDuration: '4.5s' }} />
                                </div>
                              </div>
                              <h3 className="text-xl font-black text-brand-primary mb-2 tracking-tight">
                                { language === 'ru' ? "Перевод учебного материала..." : language === 'uz' ? "Mavzu matni tarjima qilinmoqda..." : "Translating textbook..." }
                              </h3>
                              <p className="text-xs text-brand-muted font-bold tracking-wider uppercase text-center max-w-sm leading-relaxed animate-pulse">
                                { language === 'ru' ? "Gemini AI готовит точные медицинские и анатомические термины на русском языке" : language === 'uz' ? "Gemini AI eng aniq tibbiy va anatomik terminlarni tayyorlamoqda" : "Gemini AI is preparing precise medical and anatomical terms in English" }
                              </p>
                              <div className="flex gap-2 mt-6">
                                <span className="w-3 h-3 bg-brand-accent rounded-full animate-bounce" style={{ animationDelay: '-0.3s' }}></span>
                                <span className="w-3 h-3 bg-brand-accent rounded-full animate-bounce" style={{ animationDelay: '-0.15s' }}></span>
                                <span className="w-3 h-3 bg-brand-accent rounded-full animate-bounce"></span>
                              </div>
                            </div>
                          ) : (
                            <>
                              {translatedTheory && (
                                <div className="mb-6 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl inline-flex items-center gap-2 text-emerald-700 text-xs font-semibold">
                                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                                  <span>
                                    {language === 'ru' 
                                      ? 'Текст переведен искусственным интеллектом Gemini.' 
                                      : 'Text translated by Gemini AI.'}
                                  </span>
                                </div>
                              )}
                              <ReactMarkdown
                                components={{
                                  code({ className, children, ...props }) {
                                    const codeString = String(children).replace(/\n$/, '');
                                    const isBlock = codeString.includes('\n');
                                    
                                    if (className?.includes('language-') || isBlock) {
                                      return <CreativeAnatomyDiagram value={codeString} />;
                                    }
                                    return <code className={className} {...props}>{children}</code>;
                                  }
                                }}
                              >
                                {translatedTheory || getLocalized(topic.theory) || (typeof topic.theory === 'string' ? topic.theory : '')}
                              </ReactMarkdown>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-8 text-left">
                          {studyLoading ? (
                            <div className="py-20 flex flex-col items-center justify-center text-center">
                              <Sparkles className="w-8 h-8 animate-spin text-brand-accent mb-4" />
                              <p className="text-sm font-semibold text-brand-muted">
                                {language === 'uz' ? "O'quv qo'llanmasi yuklanmoqda..." : language === 'ru' ? "Учебный гид загружается..." : "Loading study guide..."}
                              </p>
                            </div>
                          ) : studyError ? (
                            <div className="py-16 text-center text-rose-500 font-bold">{studyError}</div>
                          ) : (
                            <ReactMarkdown
                              components={{
                                code({ className, children, ...props }) {
                                  const codeString = String(children).replace(/\n$/, '');
                                  const isBlock = codeString.includes('\n');
                                  
                                  if (className?.includes('language-') || isBlock) {
                                    return <CreativeAnatomyDiagram value={codeString} />;
                                  }
                                  return <code className={className} {...props}>{children}</code>;
                                }
                              }}
                            >
                              {studyGuide}
                            </ReactMarkdown>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* PDF / Medical Notes Export Modal */}
      <ExportTopicPdfModal
        topic={topic}
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  );
}
