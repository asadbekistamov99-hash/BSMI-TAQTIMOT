import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import '@google/model-viewer';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Topic, AtlasEntry } from '../types';
import { dbService } from '../lib/dbService';
import { SEMESTER_1_TOPICS, SEMESTER_2_TOPICS } from '../constants';
import { SEMESTER_1_DETAILED_TOPICS } from '../data/semester1TopicsData';
import { SEMESTER_2_DETAILED_TOPICS } from '../data/semester2TopicsData';
import { SEMESTER_3_DETAILED_TOPICS } from '../data/semester3TopicsData';
import { getGlossaryTermsByTopic } from '../data/topicGlossaryData';
import { motion } from 'motion/react';
import { Book, Play, Image as ImageIcon, Languages, ChevronRight, ClipboardCheck, Lock, Sparkles, Clock, Maximize2, Minimize2, ZoomIn, ZoomOut, X, Type, BookOpen, Search, CheckCircle, Edit3, Trash2, History, Download, Bold, Italic, List, Heading, Code, Check, Stethoscope, Printer, BookA, Bookmark, Presentation, FileText, RefreshCw, Box, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import PaymentModal from '../components/PaymentModal';
import CreativeAnatomyDiagram from '../components/CreativeAnatomyDiagram';
import { getDiagramKey } from '../lib/diagramHelper';
import AnatomyClinicalCases from '../components/AnatomyClinicalCases';
import ExportTopicPdfModal from '../components/ExportTopicPdfModal';
import TopicGlossaryViewer from '../components/TopicGlossaryViewer';
import TopicReferencesViewer from '../components/TopicReferencesViewer';
import TopicTheoryReader from '../components/TopicTheoryReader';
import TopicModelViewerModal from '../components/TopicModelViewerModal';
import TopicTheoryQuestionsViewer from '../components/TopicTheoryQuestionsViewer';
import TopicInteractiveQuizzesViewer from '../components/TopicInteractiveQuizzesViewer';
import TopicPresentationSection from '../components/TopicPresentationSection';
import { getTheoryQuestionsForTopic } from '../data/topicTheoryQuestionsData';
import { getCuratedQuizzesForTopic } from '../data/topicQuizzesData';
import { ANATOMY_MODELS, SEED_MODELS, type AnatomyModel } from '../data/anatomyModels';
import { getActiveUserAiKey } from '../lib/userAiKey';
import { useSettings } from '../hooks/useSettings';
import { useLanguage } from '../hooks/useLanguage';
import { parseDate } from '../lib/dateUtils';
import { isDirectVideoUrl } from '../lib/uploadHelper';
import SEO from '../components/SEO';

// Rasm yuklanmasa (buzuq havola) brauzerning xunuk "broken image" belgisi o'rniga
// tekis Box ikonkasiga qaytadi.
function RelatedModelThumb({ src, alt }: { src?: string; alt: string }) {
  const [ok, setOk] = useState(true);
  if (!src || !ok) {
    return <Box className="w-10 h-10 text-slate-300" />;
  }
  return (
    <img
      src={src}
      alt={alt}
      onError={() => setOk(false)}
      referrerPolicy="no-referrer"
      loading="lazy"
      className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
    />
  );
}

export function parseTopicTitle(titleStr: string) {
  if (!titleStr) return { orderPrefix: '', mainTitle: '', subParts: [] };
  let str = titleStr.trim();
  let orderPrefix = '';

  const prefixMatch = str.match(/^(\d+[-–]mavzu|тема\s*\d+|topic\s*\d+)\s*[:–-]\s*/i);
  if (prefixMatch) {
    orderPrefix = prefixMatch[1];
    str = str.substring(prefixMatch[0].length).trim();
  }

  // Split by period followed by space or semicolon/colon
  let parts = str.split(/\.\s+/).map(p => p.trim().replace(/[.;]$/, '')).filter(Boolean);
  if (parts.length <= 1) {
    const colonParts = str.split(/[:;]\s+/).map(p => p.trim().replace(/[.;]$/, '')).filter(Boolean);
    if (colonParts.length > 1) {
      parts = colonParts;
    }
  }
  if (parts.length <= 1) {
    return { orderPrefix, mainTitle: str, subParts: [] };
  }
  return { orderPrefix, mainTitle: parts[0], subParts: parts.slice(1) };
}

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

// Navigation Tab State (8 distinct sections in exact sequence):
// 1. nazariy darslik, 2. Taqdimot, 3. video darslik, 4. 3d modellar,
// 5. nazariy savollar, 6. interaktiv testlar, 7. lug'atlar, 8. foydalanilgan adabiyotlar
export type TopicTabKey = 
  | 'theory' 
  | 'presentation' 
  | 'video_lessons' 
  | 'models_3d' 
  | 'theory_questions' 
  | 'interactive_quizzes' 
  | 'glossary' 
  | 'references';

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

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<TopicTabKey>('theory');
  const [selected3DModel, setSelected3DModel] = useState<AnatomyModel | null>(null);
  const [inlineModelIndex, setInlineModelIndex] = useState(0);

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

  const [searchParams] = useSearchParams();
  const requestedModelId = searchParams.get('model');
  const requestedTab = searchParams.get('tab');

  // Ushbu mavzuga maxsus biriktirilgan 3D Anatomiya Modellari
  const relatedModels: AnatomyModel[] = (() => {
    if (!topic || !topic.semester || !topic.order) return ANATOMY_MODELS.slice(0, 4);
    const curriculumTopicId = `sem_${topic.semester}_top_${topic.order}`;
    const matched = [...ANATOMY_MODELS, ...SEED_MODELS].filter((m) => 
      m.topicIds?.includes(curriculumTopicId) || (topic.defaultModelId && m.id === topic.defaultModelId)
    );
    if (matched.length > 0) return matched;
    // Fallback: Agar mavzuga bevosita bog'lanmagan bo'lsa ham talabaga to'liq 3D modellar mavjud bo'lsin
    return ANATOMY_MODELS.slice(0, 4);
  })();

  // Ushbu mavzuga tegishli eng muhim nazariy savollar va javoblar
  const theoryQuestions = React.useMemo(() => topic ? getTheoryQuestionsForTopic(topic) : [], [topic]);

  // Ushbu mavzuga tegishli interaktiv testlar
  const topicQuizzes = React.useMemo(() => topic ? getCuratedQuizzesForTopic(topic) : [], [topic]);

  // Deep-link: agar URL da ?tab=... yoki ?model=... bo'lsa
  useEffect(() => {
    if (requestedTab === 'models_3d' || requestedModelId) {
      setActiveTab('models_3d');
    } else if (
      requestedTab === 'theory' || 
      requestedTab === 'presentation' || 
      requestedTab === 'video_lessons' || 
      requestedTab === 'theory_questions' || 
      requestedTab === 'interactive_quizzes' || 
      requestedTab === 'glossary' || 
      requestedTab === 'references'
    ) {
      setActiveTab(requestedTab as TopicTabKey);
    }
    if (requestedModelId) {
      const allModels = [...ANATOMY_MODELS, ...SEED_MODELS];
      const found = allModels.find(m => m.id === requestedModelId);
      if (found) {
        setSelected3DModel(found);
      }
    }
  }, [requestedModelId, requestedTab]);

  // Completion Status Tracking state
  const [isCompleted, setIsCompleted] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Helper to reliably compute the topic's term count across all sources
  const getTopicTermCount = (t: Topic | null) => {
    if (!t) return 0;
    const termSet = new Set<string>();
    
    if (Array.isArray(t.terms)) {
      t.terms.forEach(item => {
        if (item?.latin) termSet.add(item.latin.trim().toLowerCase());
      });
    }
    
    if (Array.isArray(t.latinTerms)) {
      t.latinTerms.forEach(raw => {
        if (typeof raw === 'string') {
          const latin = raw.split(/[\(\-—:]/)[0].trim().toLowerCase();
          if (latin) termSet.add(latin);
        }
      });
    }

    const curriculum = getGlossaryTermsByTopic(t.semester, t.order || 1);
    if (Array.isArray(curriculum)) {
      curriculum.forEach(item => {
        if (item?.latin) termSet.add(item.latin.trim().toLowerCase());
      });
    }

    return Math.max(termSet.size, curriculum?.length || 0, t.terms?.length || 0, t.latinTerms?.length || 0);
  };

  // Dynamic AI Translation States
  const [translatedTheory, setTranslatedTheory] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [transError, setTransError] = useState<string | null>(null);
  const [translationCountdown, setTranslationCountdown] = useState(15);
  const [translationElapsedSeconds, setTranslationElapsedSeconds] = useState(0);
  const [translationDuration, setTranslationDuration] = useState<number | null>(null);

  // Countdown timer effect during translation
  useEffect(() => {
    let interval: any = null;
    if (isTranslating) {
      setTranslationCountdown(15);
      setTranslationElapsedSeconds(0);
      interval = setInterval(() => {
        setTranslationCountdown((prev) => (prev > 1 ? prev - 1 : 1));
        setTranslationElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTranslating]);

  const isValidTheoryTranslation = (translated: string, targetLang: string, originalUzText: string): boolean => {
    if (!translated || translated.trim().length === 0) return false;
    if (translated.trim() === originalUzText.trim()) return false;
    if (targetLang === 'ru') {
      const cyrillicMatch = translated.match(/[а-яА-ЯёЁ]/g);
      if (!cyrillicMatch || cyrillicMatch.length < 15) return false;
    }
    return true;
  };

  const getEffectiveTheoryText = () => {
    if (translatedTheory) return translatedTheory;
    const localized = getLocalized(topic?.theory);
    const isPlaceholder = typeof localized === 'string' && (
      localized.includes('успешно обновлены на узбекском') ||
      localized.includes('переключите язык на узбекский') ||
      localized.includes('batafsil o\'rganish') ||
      localized.includes('batafsil o‘rganish') ||
      localized.includes('на узбекском языке') ||
      (localized.length < 250 && (topic?.theory?.uz || '').length > 400)
    );
    if (isPlaceholder && topic?.theory?.uz) {
      return topic.theory.uz;
    }
    return localized || (typeof topic?.theory === 'string' ? topic.theory : '');
  };

  const checkNeedsTranslationForLang = (targetLang = language): boolean => {
    if (!topic || targetLang === 'uz') return false;
    
    const uzText = topic.theory?.uz || (typeof topic.theory === 'string' ? topic.theory : '');
    const uzLen = uzText.trim().length;

    // Check if there is already a manual/pre-existing translation in the selected language.
    if (typeof topic.theory === 'object' && topic.theory !== null) {
      const specificLangText = (topic.theory as any)[targetLang];
      if (specificLangText && specificLangText.trim().length > 0) {
        // If it doesn't contain common placeholders
        const isPlaceholder = specificLangText.includes('batafsil o\'rganish') || 
                              specificLangText.includes('batafsil o‘rganish') ||
                              specificLangText.includes('comprehensively updated') ||
                              specificLangText.includes('select Uzbek language') ||
                              specificLangText.includes('успешно обновлены на узбекском') ||
                              specificLangText.includes('переключите язык на узбекский') ||
                              specificLangText.includes('на узбекском языке');
        
        // If the Uzbek textbook is a full comprehensive text (>400 chars) but specificLangText is only a brief 1-line summary (<300 chars)
        const isBriefSummaryOnly = uzLen > 400 && specificLangText.trim().length < 350;

        if (!isPlaceholder && !isBriefSummaryOnly) {
          return false; // Already has a full translation, no need for AI translation
        }
      }
    }
    return true;
  };

  const handleTranslateTheory = async (targetLang = language) => {
    if (!topic) return;
    setIsTranslating(true);
    setTransError(null);
    const startT = Date.now();
    try {
      const uzText = topic.theory?.uz || (typeof topic.theory === 'string' ? topic.theory : '');
      const userKey = await getActiveUserAiKey(auth.currentUser?.uid);
      const response = await fetch('/api/translate-theory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: uzText,
          language: targetLang,
          userKey: userKey || undefined
        }),
      });
      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Translation API failed');
      }
      const data = await response.json();
      if (data.translatedText && isValidTheoryTranslation(data.translatedText, targetLang, uzText)) {
        setTranslatedTheory(data.translatedText);
        setTranslationDuration(Math.round((Date.now() - startT) / 100) / 10);
        const cacheKey = `translated_theory_${topic.id}_${targetLang}`;
        localStorage.setItem(cacheKey, data.translatedText);
      } else {
        throw new Error('Matn tarjima qilinmadi yoki original tilda qaytdi');
      }
    } catch (err: any) {
      console.error("AI Translation error:", err);
      setTransError(targetLang === 'ru' ? 'Ошибка перевода ИИ. Пожалуйста, попробуйте еще раз.' : 'AI translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  // Automatic translation within 10 seconds whenever language is switched
  useEffect(() => {
    if (topic && language !== 'uz') {
      const uzText = topic.theory?.uz || (typeof topic.theory === 'string' ? topic.theory : '');
      const cacheKey = `translated_theory_${topic.id}_${language}`;
      const cached = localStorage.getItem(cacheKey);
      
      if (cached && isValidTheoryTranslation(cached, language, uzText)) {
        setTranslatedTheory(cached);
        setIsTranslating(false);
      } else {
        if (cached) {
          localStorage.removeItem(cacheKey);
        }
        setTranslatedTheory('');
        if (checkNeedsTranslationForLang(language)) {
          handleTranslateTheory(language);
        }
      }
    } else {
      setTranslatedTheory('');
      setIsTranslating(false);
    }
    setTransError(null);
  }, [topic?.id, language]);

  const checkNeedsTranslation = (): boolean => {
    if (!topic || language === 'uz') return false;
    if (translatedTheory) return false;
    return checkNeedsTranslationForLang(language);
  };

  const isUserAdmin = Boolean(isAdmin || (user as any)?.isAdmin || user?.email === 'asadbekistamov99@gmail.com');

  const handleDiagramReplacementUpdate = (key: string, replacement: any) => {
    setTopic((prev: any) => {
      if (!prev) return prev;
      const nextReplacements = { ...(prev.diagramReplacements || {}) };
      if (replacement) {
        nextReplacements[key] = replacement;
      } else {
        delete nextReplacements[key];
      }
      return {
        ...prev,
        diagramReplacements: nextReplacements
      };
    });
  };

  // Lecture mode state: whether to display custom uploaded file (PDF/PPTX) or text theory
  const [lectureDisplayMode, setLectureDisplayMode] = useState<'custom_file' | 'text'>('custom_file');

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

      // Sync with cloud in background
      if (user.uid && !user.isAnonymous) {
        dbService.getCompletedTopics(user.uid).then((remoteList) => {
          if (remoteList && remoteList.length > 0) {
            setIsCompleted(remoteList.some((item: any) => item.topicId === topic.id));
            localStorage.setItem(completionKey, JSON.stringify(remoteList));
          }
        }).catch(err => console.warn("Failed to fetch remote completions:", err));
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

    // Save to cloud persistence (Firestore & Supabase)
    if (user.uid && !user.isAnonymous) {
      dbService.saveCompletedTopics(user.uid, list);
    }

    // Broadcast instant update to Home and other views
    window.dispatchEvent(new CustomEvent('anatomy_progress_updated', { detail: list }));
  };

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
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

      // Immediate fallback resolution for 0ms latency and to prevent old topic from flickering
      let initialFallback: Topic | null = null;
      if (id.startsWith('sem_3_top_') || id.startsWith('sem3_topic_')) {
        const index = parseInt(id.replace('sem_3_top_', '').replace('sem3_topic_', ''), 10) - 1;
        if (index >= 0 && index < SEMESTER_3_DETAILED_TOPICS.length) {
          initialFallback = SEMESTER_3_DETAILED_TOPICS[index];
        }
      } else if (id.startsWith('sem_1_top_') || id.startsWith('sem1_topic_')) {
        const index = parseInt(id.replace('sem_1_top_', '').replace('sem1_topic_', ''), 10) - 1;
        if (index >= 0 && index < SEMESTER_1_DETAILED_TOPICS.length) {
          initialFallback = SEMESTER_1_DETAILED_TOPICS[index];
        }
      } else if (id.startsWith('sem_2_top_') || id.startsWith('sem2_topic_')) {
        const index = parseInt(id.replace('sem_2_top_', '').replace('sem2_topic_', ''), 10) - 1;
        if (index >= 0 && index < SEMESTER_2_DETAILED_TOPICS.length) {
          initialFallback = SEMESTER_2_DETAILED_TOPICS[index];
        }
      }

      if (initialFallback) {
        setTopic(initialFallback);
        setLoading(false);
      } else {
        setTopic(null);
        setLoading(true);
      }

      // Immediate direct payment check to eliminate lock-screen flickering
      const semNum = initialFallback ? Number(initialFallback.semester) : (
        id.startsWith('sem_1') ? 1 : id.startsWith('sem_2') ? 2 : id.startsWith('sem_3') ? 3 : null
      );
      if (isAdmin || user?.isAdmin || (semNum && (user?.purchasedSemesters || []).map(Number).includes(semNum))) {
        setIsPaid(true);
        setIsPending(false);
      } else {
        setIsPaid(false);
        setIsPending(false);
      }

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
          topicData = initialFallback;
        }

        // Detailed medical theory enrichment if retrieved record was brief or placeholder
        if (topicData) {
          const sem = topicData.semester;
          const ord = topicData.order || 1;
          const detailedSource = sem === 1 ? SEMESTER_1_DETAILED_TOPICS : sem === 2 ? SEMESTER_2_DETAILED_TOPICS : sem === 3 ? SEMESTER_3_DETAILED_TOPICS : [];
          const detailedMatch = detailedSource.find(d => d.order === ord);
          if (detailedMatch && (!topicData.theory?.uz || topicData.theory.uz.length < 150)) {
            topicData = {
              ...topicData,
              theory: detailedMatch.theory,
              title: topicData.title?.uz ? topicData.title : detailedMatch.title
            };
          }
        }
        
        if (topicData) {
          // Robust enrichment: combine existing terms with complete curriculum glossary
          const curTerms = getGlossaryTermsByTopic(topicData.semester, topicData.order || 1);
          if (curTerms && curTerms.length > 0) {
            const existingTermKeys = new Set<string>();
            const enrichedTerms = Array.isArray(topicData.terms) ? [...topicData.terms] : [];
            enrichedTerms.forEach(t => {
              if (t?.latin) existingTermKeys.add(t.latin.trim().toLowerCase());
            });

            curTerms.forEach(ct => {
              const key = ct.latin.trim().toLowerCase();
              if (!existingTermKeys.has(key)) {
                enrichedTerms.push(ct as any);
                existingTermKeys.add(key);
              }
            });
            topicData.terms = enrichedTerms;

            const existingLatinKeys = new Set<string>();
            const enrichedLatin = Array.isArray(topicData.latinTerms) ? [...topicData.latinTerms] : [];
            enrichedLatin.forEach(raw => {
              if (typeof raw === 'string') {
                const k = raw.split(/[\(\-—:]/)[0].trim().toLowerCase();
                if (k) existingLatinKeys.add(k);
              }
            });

            curTerms.forEach(ct => {
              const key = ct.latin.trim().toLowerCase();
              if (!existingLatinKeys.has(key)) {
                enrichedLatin.push(`${ct.latin} (${ct.uzbek})`);
                existingLatinKeys.add(key);
              }
            });
            topicData.latinTerms = enrichedLatin;
          }

          setTopic(topicData);
          setLoadError(null);

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
      } catch (error: any) {
        console.error("Error fetching topic/payment:", error);
        setLoadError(error?.message || "Mavzuni yuklashda xatolik yuz berdi");
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
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
          <RefreshCw className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">
          {loadError || t('topic.locked_alert')}
        </h1>
        <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
          {language === 'uz' 
            ? "Mavzuni yuklashda nosozlik yuz berdi. Sahifadan chiqib ketmasdan, joyingizni saqlagan holda qayta yuklab ko'rishingiz mumkin." 
            : language === 'ru'
              ? "Произошла ошибка загрузки темы. Вы можете повторить попытку без потери текущей позиции."
              : "An error occurred while loading this topic. You can retry loading without losing your place."}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-indigo-600/25 flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{language === 'uz' ? 'Qayta urinish' : language === 'ru' ? 'Повторить' : 'Retry'}</span>
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
          >
            <span>{language === 'uz' ? 'Oldingi sahifa' : language === 'ru' ? 'Назад' : 'Go back'}</span>
          </button>
          <Link 
            to="/" 
            className="px-6 py-3 text-slate-500 hover:text-slate-800 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            {t('quiz.home')}
          </Link>
        </div>
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

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const isSearching = normalizedQuery.length >= 2;

  const matchedLatin = isSearching
    ? (topic.latinTerms || []).filter(term => 
        term.toLowerCase().includes(normalizedQuery)
      )
    : [];

  const matchedTerms = isSearching
    ? (topic.terms || []).filter(term => 
        (term.latin || '').toLowerCase().includes(normalizedQuery) ||
        (term.uzbek || term.uz || '').toLowerCase().includes(normalizedQuery) ||
        (term.russian || term.ru || '').toLowerCase().includes(normalizedQuery) ||
        (term.english || term.en || '').toLowerCase().includes(normalizedQuery) ||
        (term.description || '').toLowerCase().includes(normalizedQuery)
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

  const totalResultsCount = matchedLatin.length + matchedTerms.length + matchedAtlas.length + matchedTheoryParas.length;

  const topicTitle = getLocalized(topic.title) || 'Anatomiya Mavzusi';
  const parsedTopicTitle = parseTopicTitle(topicTitle);
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
      <header className="bg-brand-primary py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-accent/10 blur-[100px] -mr-20"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to={`/semester/${topic.semester}`} className="text-xs font-black text-brand-accent hover:text-white transition-all flex items-center gap-2 mb-6 sm:mb-8 uppercase tracking-[0.2em]">
            ← SEMESTR {topic.semester} {t('study.topics_list').toUpperCase()}
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="px-4 py-1.5 bg-brand-accent/20 border border-brand-accent/30 text-brand-accent rounded-lg font-black uppercase tracking-widest text-[10px]">
                {t('study.unlocked').toUpperCase()} {topic.order}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight leading-[1.15] mb-4 max-w-4xl">
              {parsedTopicTitle.mainTitle || topicTitle}
            </h1>
            {parsedTopicTitle.subParts.length > 0 && (
              <div className="my-5 max-w-4xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-5 h-0.5 bg-brand-accent"></span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-accent">
                    Mavzu Tarkibiy Qismlari va Rejasi
                  </span>
                </div>
                <div className={`grid grid-cols-1 sm:grid-cols-2 ${parsedTopicTitle.subParts.length > 2 ? 'lg:grid-cols-3' : ''} gap-2.5`}>
                  {parsedTopicTitle.subParts.map((sub, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-slate-100 text-xs font-semibold shadow-xs">
                      <span className="w-5 h-5 rounded-lg bg-brand-accent text-brand-primary flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 shadow-xs">
                        {idx + 1}
                      </span>
                      <span className="leading-snug">{sub}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8 sm:space-y-10">
            {/* Theory Card */}
            <div id="theory-card-top" className="bg-white p-5 sm:p-7 md:p-9 rounded-[32px] border border-brand-border shadow-xl shadow-slate-200/50">
              {/* TOP NAVIGATION BAR: 1, 2, 3, 4, 5 on the LEFT; 6, 7, 8 + PDF + Kengaytirish on the RIGHT */}
              <div className="flex flex-col 2xl:flex-row 2xl:items-center justify-between gap-3 mb-8 pb-5 border-b border-brand-border">
                {/* CHAP GURUH: 1, 2, 3, 4, 5 */}
                <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl select-none">
                  {/* 1. Nazariy darslik */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('theory')}
                    className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'theory'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-2 ring-blue-500/20'
                        : 'bg-white/80 text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/70'
                    }`}
                  >
                    <BookOpen className={`w-3.5 h-3.5 ${activeTab === 'theory' ? 'text-white' : 'text-blue-600'}`} />
                    <span>1. {language === 'uz' ? "Nazariy darslik" : language === 'ru' ? "Теория" : "Theory"}</span>
                  </button>

                  {/* 2. Taqdimot */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('presentation')}
                    className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'presentation'
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30 ring-2 ring-amber-500/20'
                        : 'bg-white/80 text-slate-700 hover:bg-amber-50 hover:text-amber-700 border border-slate-200/70'
                    }`}
                  >
                    <Presentation className={`w-3.5 h-3.5 ${activeTab === 'presentation' ? 'text-white' : 'text-amber-600'}`} />
                    <span>2. {language === 'uz' ? "Taqdimot" : language === 'ru' ? "Презентация" : "Presentation"}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-black ${
                      activeTab === 'presentation' ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-800'
                    }`}>
                      PPTX
                    </span>
                  </button>

                  {/* 3. Video darslik */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('video_lessons')}
                    className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'video_lessons'
                        ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30 ring-2 ring-violet-500/20'
                        : 'bg-white/80 text-slate-700 hover:bg-violet-50 hover:text-violet-700 border border-slate-200/70'
                    }`}
                  >
                    <Play className={`w-3.5 h-3.5 ${activeTab === 'video_lessons' ? 'text-white fill-white' : 'text-violet-600'}`} />
                    <span>3. {language === 'uz' ? "Video darslik" : language === 'ru' ? "Видеолекция" : "Video"}</span>
                    {localizedVideos.length > 0 && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                        activeTab === 'video_lessons' ? 'bg-violet-500 text-white' : 'bg-violet-100 text-violet-800'
                      }`}>
                        {localizedVideos.length}
                      </span>
                    )}
                  </button>

                  {/* 4. 3D Modellar */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('models_3d')}
                    className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'models_3d'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-500/20'
                        : 'bg-white/80 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200/70'
                    }`}
                  >
                    <Box className={`w-3.5 h-3.5 ${activeTab === 'models_3d' ? 'text-white' : 'text-emerald-600'}`} />
                    <span>4. {language === 'uz' ? "3D Modellar" : language === 'ru' ? "3D Модели" : "3D Models"}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                      activeTab === 'models_3d' ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {relatedModels.length}
                    </span>
                  </button>

                  {/* 5. Nazorat savollari */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('theory_questions')}
                    className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'theory_questions'
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-2 ring-rose-500/20'
                        : 'bg-white/80 text-slate-700 hover:bg-rose-50 hover:text-rose-700 border border-slate-200/70'
                    }`}
                  >
                    <HelpCircle className={`w-3.5 h-3.5 ${activeTab === 'theory_questions' ? 'text-white' : 'text-rose-600'}`} />
                    <span>5. {language === 'uz' ? "Nazorat savollari" : language === 'ru' ? "Контрольные вопросы" : "Control Questions"}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                      activeTab === 'theory_questions' ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {theoryQuestions.length}
                    </span>
                  </button>
                </div>

                {/* O'NG GURUH: 6, 7, 8 + PDF KONSPEKT + KENGAYTIRISH */}
                <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl select-none self-start 2xl:self-auto">
                  {/* 6. Interaktiv testlar */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('interactive_quizzes')}
                    className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'interactive_quizzes'
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/30 ring-2 ring-red-500/20'
                        : 'bg-white/80 text-slate-700 hover:bg-red-50 hover:text-red-700 border border-slate-200/70'
                    }`}
                  >
                    <ClipboardCheck className={`w-3.5 h-3.5 ${activeTab === 'interactive_quizzes' ? 'text-white' : 'text-red-600'}`} />
                    <span>6. {language === 'uz' ? "Interaktiv testlar" : language === 'ru' ? "Тесты" : "Quizzes"}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                      activeTab === 'interactive_quizzes' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-800'
                    }`}>
                      {topicQuizzes.length}
                    </span>
                  </button>

                  {/* 7. Lug'atlar */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('glossary')}
                    className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'glossary'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-500/20'
                        : 'bg-white/80 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200/70'
                    }`}
                  >
                    <BookA className={`w-3.5 h-3.5 ${activeTab === 'glossary' ? 'text-white' : 'text-indigo-600'}`} />
                    <span>7. {language === 'uz' ? "Lug'atlar" : language === 'ru' ? "Глоссарий" : "Glossary"}</span>
                    {getTopicTermCount(topic) > 0 && (
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${
                        activeTab === 'glossary' ? 'bg-indigo-500 text-white' : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {getTopicTermCount(topic)}
                      </span>
                    )}
                  </button>

                  {/* 8. Foydalanilgan adabiyotlar */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('references')}
                    className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === 'references'
                        ? 'bg-slate-800 text-white shadow-md shadow-slate-800/30 ring-2 ring-slate-700/20'
                        : 'bg-white/80 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/70'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${activeTab === 'references' ? 'text-white' : 'text-amber-600'}`} />
                    <span>8. {language === 'uz' ? "Adabiyotlar" : language === 'ru' ? "Литература" : "References"}</span>
                  </button>

                  <div className="h-5 w-[1px] bg-slate-300 mx-0.5 hidden sm:block" />

                  {/* PDF KONSPEKT */}
                  <button
                    type="button"
                    onClick={() => setShowExportModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all hover:scale-[1.03] active:scale-95 shadow-xs cursor-pointer"
                    title="Mavzuni PDF konspekt qilib yuklab olish"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>PDF Konspekt</span>
                  </button>

                  {/* KENGAYTIRISH */}
                  <button
                    type="button"
                    onClick={() => setIsFullscreen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-brand-accent hover:bg-brand-accent/90 border border-brand-accent/30 text-brand-primary rounded-xl text-[11px] font-black uppercase tracking-wider transition-all hover:scale-[1.03] active:scale-95 shadow-sm cursor-pointer"
                    title="To'liq ekranda o'qish"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
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

                  {/* Matching Glossary Terms */}
                  {matchedTerms.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-brand-muted uppercase tracking-widest flex items-center gap-2">
                        <BookA className="w-4 h-4 text-indigo-500" />
                        {language === 'uz' ? "Lug'atlar / Terminlardan" : language === 'ru' ? 'Из глоссария терминов' : 'From Glossary Terms'}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {matchedTerms.map((t, i) => (
                          <div 
                            key={t.id || i} 
                            className="p-5 bg-indigo-50/40 border border-indigo-100 rounded-2xl text-left space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider">
                                Lotincha termin
                              </span>
                            </div>
                            <h5 className="font-serif italic text-base font-bold text-slate-900">
                              <HighlightedText text={t.latin} highlight={searchQuery} />
                            </h5>
                            {(t.uzbek || t.uz) && (
                              <p className="text-xs font-bold text-brand-primary">
                                UZB: <HighlightedText text={t.uzbek || t.uz || ''} highlight={searchQuery} />
                              </p>
                            )}
                            {(t.russian || t.ru) && (
                              <p className="text-xs font-medium text-slate-600">
                                RUS: <HighlightedText text={t.russian || t.ru || ''} highlight={searchQuery} />
                              </p>
                            )}
                            {t.description && (
                              <p className="text-xs text-slate-500 pt-1 border-t border-indigo-100/60 leading-relaxed">
                                <HighlightedText text={t.description} highlight={searchQuery} />
                              </p>
                            )}
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
                      {/* Topic Presentation Quick Access Banner */}
                      {Boolean(
                        topic?.pptxUrl || 
                        topic?.pdfUrl || 
                        topic?.customLectureFile?.fileUrl || 
                        (topic?.lectureType && topic.lectureType !== 'text')
                      ) && (
                        <div className="mb-8 p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-indigo-500/30 shadow-xl">
                          <div className="flex items-center gap-3.5">
                            <span className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center text-xl shrink-0">
                              <Presentation className="w-6 h-6" />
                            </span>
                            <div>
                              <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                                <span>PowerPoint (.pptx) Taqdimot mavjud</span>
                              </h4>
                              <p className="text-xs text-slate-300 mt-0.5">
                                Ushbu mavzuning to'liq taqdimotini slaydma-slayd, kinoteatr va lazer ko'rsatkich rejimida tomosha qiling.
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (topic) {
                                navigate(`/presentation?topicId=${topic.id}&semester=${topic.semester}&order=${topic.order}`);
                              } else {
                                navigate('/presentation');
                              }
                            }}
                            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0 shadow-lg shadow-amber-500/20 flex items-center gap-2"
                          >
                            <span>Taqdimotga O'tish</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}

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
                            onClick={() => handleTranslateTheory(language)}
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
                        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-emerald-900 text-xs font-semibold shadow-xs">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                              <CheckCircle className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="font-black">
                                {language === 'ru' 
                                  ? 'Текст переведен искусственным интеллектом Gemini.' 
                                  : language === 'uz'
                                  ? 'Matn Gemini AI orqali tarjima qilindi.'
                                  : 'Text translated by Gemini AI.'}
                              </span>
                              {translationDuration && (
                                <span className="ml-2 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black">
                                  {translationDuration}s
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const cacheKey = `translated_theory_${topic?.id}_${language}`;
                                localStorage.removeItem(cacheKey);
                                setTranslatedTheory('');
                                handleTranslateTheory(language);
                              }}
                              className="px-3.5 py-1.5 bg-white hover:bg-emerald-100/60 border border-emerald-300 text-emerald-800 rounded-xl font-black text-[10px] uppercase tracking-wider transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
                            >
                              <RefreshCw className="w-3 h-3" />
                              {language === 'uz' ? "Qayta tarjima" : language === 'ru' ? "Обновить перевод" : "Re-translate"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setTranslatedTheory('')}
                              className="px-3.5 py-1.5 bg-white hover:bg-emerald-100/60 border border-emerald-300 text-emerald-800 rounded-xl font-black text-[10px] uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
                            >
                              {language === 'uz' ? "Asl matnga qaytish" : language === 'ru' ? "Оригинал (O'zbek)" : "Original (Uzbek)"}
                            </button>
                          </div>
                        </div>
                      )}

                      {isTranslating ? (
                        <div className="py-20 flex flex-col items-center justify-center text-center animate-fadeIn border border-brand-accent/25 bg-gradient-to-b from-brand-bg/60 to-white rounded-3xl p-8 mb-8 relative overflow-hidden shadow-lg shadow-amber-500/5">
                          <div className="absolute -inset-4 bg-brand-accent/5 rounded-full blur-xl animate-pulse"></div>

                          {/* Badge indicator */}
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-[11px] font-black uppercase tracking-wider mb-5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                            <span>AI Tarjimon: Uzog'i 10-15 soniyada</span>
                          </div>

                          <div className="relative mb-5">
                            <div className="w-20 h-20 rounded-[26px] bg-white border border-brand-border flex items-center justify-center shadow-xl relative overflow-hidden">
                              <Languages className="w-10 h-10 text-brand-accent animate-pulse" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 px-2.5 py-1 bg-amber-500 text-slate-950 font-black text-xs rounded-full shadow-md">
                              {translationCountdown}s
                            </div>
                          </div>

                          <h3 className="text-xl font-black text-brand-primary mb-2 tracking-tight">
                            { language === 'ru' ? "Перевод учебного материала (до 10-15 секунд)..." : language === 'uz' ? "Mavzu matni tarjima qilinmoqda (uzog'i 10-15s)..." : "Translating textbook material (up to 10-15s)..." }
                          </h3>
                          <p className="text-xs text-brand-muted font-bold tracking-wider uppercase text-center max-w-md leading-relaxed">
                            { language === 'ru' ? "Gemini AI сохраняет все анатомические термины и структуру" : language === 'uz' ? "Gemini AI barcha tibbiy-anatomik lotin terminlarini aniq saqlamoqda" : "Gemini AI is preserving all anatomical Latin terms and formatting" }
                          </p>

                          {/* Visual Progress Bar */}
                          <div className="w-full max-w-md mt-6 space-y-2">
                            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80 p-0.5">
                              <div 
                                className="h-full bg-gradient-to-r from-amber-400 via-brand-accent to-emerald-500 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${Math.min(95, Math.max(12, translationElapsedSeconds * 8 + 12))}%` }}
                              />
                            </div>
                            <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-wider px-1">
                              <span>Boshlandi</span>
                              <span className="text-amber-600 font-black">{translationCountdown} soniya qoldi</span>
                              <span>To'liq tarjima</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <TopicTheoryReader
                          rawTheoryText={getEffectiveTheoryText()}
                          topicId={topic?.id}
                          isUserAdmin={isUserAdmin}
                          diagramReplacements={topic?.diagramReplacements}
                          onUpdateDiagramReplacement={(diagKey, newRep) => handleDiagramReplacementUpdate(diagKey, newRep)}
                          getDiagramKey={getDiagramKey}
                          language={language}
                        />
                      )}

                  {/* Transition to Lug'atlar (Glossary) section */}
                  {(getTopicTermCount(topic) > 0) && (
                    <div className="mt-14 p-6 sm:p-7 bg-gradient-to-br from-indigo-50/70 via-slate-50 to-white border border-indigo-100 rounded-[28px] flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/25 shrink-0">
                          <BookA className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
                              {language === 'uz' ? "Anatomik Lug'at" : language === 'ru' ? "Анатомический глоссарий" : "Anatomy Glossary"}
                            </span>
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full text-[10px] font-black">
                              {getTopicTermCount(topic)} ta termin
                            </span>
                          </div>
                          <h4 className="text-base font-black text-brand-primary tracking-tight">
                            {language === 'uz' ? "Mavzuga oid lotincha terminlar lug'at bo'limiga ko'chirildi" : language === 'ru' ? "Латинские термины перенесены в раздел глоссария" : "Latin terms are organized in the Glossary tab"}
                          </h4>
                          <p className="text-xs text-brand-muted font-medium">
                            {language === 'uz' 
                              ? "Atamalarning to'g'ri audio talaffuzi, o'zbekcha, ruscha va inglizcha tarjimalarini lug'at bo'limida o'rganing." 
                              : "Explore accurate Latin pronunciation and multilingual translations in the dedicated Glossary section."}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('glossary');
                          const el = document.getElementById('theory-card-top');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer shrink-0"
                      >
                        <BookA className="w-4 h-4" />
                        <span>{language === 'uz' ? "Lug'atlarni ochish" : language === 'ru' ? "Открыть глоссарий" : "Open Glossary"}</span>
                      </button>
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
              ) : activeTab === 'presentation' ? (
                <TopicPresentationSection topic={topic} />
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
                            const rawUrl = localizedVideos[selectedVidIndex || 0] || '';
                            const cleanUrl = rawUrl.trim();

                            // 1. Check YouTube
                            const getYoutubeId = (urlStr: string) => {
                              if (!urlStr) return null;
                              const regExp = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
                              const match = urlStr.match(regExp);
                              return (match && match[1] && match[1].length === 11) ? match[1] : null;
                            };
                            const youtubeId = getYoutubeId(cleanUrl);
                            if (youtubeId) {
                              return (
                                <iframe
                                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0`}
                                  title="Anatomy Video Lecture"
                                  className="absolute inset-0 w-full h-full border-0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              );
                            }

                            // 2. Check Google Drive
                            const driveMatch = cleanUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
                            if (driveMatch && driveMatch[1]) {
                              return (
                                <iframe
                                  src={`https://drive.google.com/file/d/${driveMatch[1]}/preview`}
                                  title="Google Drive Video Lecture"
                                  className="absolute inset-0 w-full h-full border-0"
                                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              );
                            }

                            // 3. Direct HTML5 Video (Uploaded to Supabase Storage, Server, or Firebase)
                            if (isDirectVideoUrl(cleanUrl) || cleanUrl.includes('.mp4') || cleanUrl.includes('.webm') || cleanUrl.includes('.mov')) {
                              return (
                                <video
                                  controls
                                  controlsList="nodownload"
                                  playsInline
                                  preload="metadata"
                                  className="absolute inset-0 w-full h-full object-contain bg-black"
                                  src={cleanUrl}
                                >
                                  <source src={cleanUrl} type="video/mp4" />
                                  <p className="text-white p-4 text-center">
                                    Brauzeringiz ushbu videoni to'g'ridan-to'g'ri o'ynatishni qo'llab-quvvatlamaydi.
                                    <a href={cleanUrl} target="_blank" rel="noopener noreferrer" className="underline ml-2 text-cyan-400">
                                      Yuklab olish
                                    </a>
                                  </p>
                                </video>
                              );
                            }

                            // 4. Default / External Link Handler with HTML5 attempt
                            return (
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-slate-950 text-white">
                                <video
                                  controls
                                  playsInline
                                  preload="metadata"
                                  className="w-full h-full max-h-[70%] object-contain mb-3"
                                  src={cleanUrl}
                                  onError={(e) => {
                                    // If video tag cannot play it directly, show fallback
                                    (e.target as HTMLElement).style.display = 'none';
                                    const fallback = document.getElementById('video-external-fallback');
                                    if (fallback) fallback.style.display = 'flex';
                                  }}
                                />
                                <div id="video-external-fallback" className="flex flex-col items-center justify-center">
                                  <Play className="w-12 h-12 text-[#0ea5e9] mb-4 animate-bounce" />
                                  <h4 className="text-base font-black uppercase tracking-wider mb-2">Video Darslik Manbasi</h4>
                                  <p className="text-xs text-slate-400 max-w-sm mb-4">
                                    {language === 'uz' 
                                      ? "Ushbu videoni to'liq ekranda yoki tashqi manzil orqali tomosha qilishingiz mumkin:"
                                      : "Вы можете просмотреть это видео по внешней ссылке:"}
                                  </p>
                                  <a
                                    href={cleanUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-3.5 bg-cyan-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-cyan-700 transition-all shadow-lg"
                                  >
                                    {language === 'uz' ? "Videoni yangi oynada ochish" : "Открыть видео"}
                                  </a>
                                </div>
                              </div>
                            );
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
              ) : activeTab === 'models_3d' ? (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                        <Box className="w-5 h-5 text-emerald-600" />
                        {language === 'uz' ? "Interaktiv 3D Anatomiya Modellari" : language === 'ru' ? "Интерактивные 3D Модели" : "Interactive 3D Anatomy Models"}
                      </h3>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">
                        {language === 'uz' ? "Mavzuga doir anatomik tuzilmalarni to'liq 3D formatda o'rganing" : "Изучайте анатомические структуры темы в интерактивном 3D"}
                      </p>
                    </div>
                    {relatedModels.length > 1 && (
                      <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
                        {relatedModels.map((m, idx) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setInlineModelIndex(idx)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                              inlineModelIndex === idx
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {idx + 1}. {getLocalized(m.title)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {relatedModels[inlineModelIndex] && (
                    <div className="bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
                      <div className="flex items-center justify-between px-5 py-3 bg-slate-900 border-b border-slate-800 text-white text-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="font-black truncate text-sm">
                            {getLocalized(relatedModels[inlineModelIndex].title)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setSelected3DModel(relatedModels[inlineModelIndex])}
                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>{language === 'uz' ? "Katta ekranda" : "На весь экран"}</span>
                          </button>
                        </div>
                      </div>

                      <div className="relative w-full aspect-video min-h-[380px] sm:min-h-[480px] bg-slate-950 flex items-center justify-center">
                        {relatedModels[inlineModelIndex].fileUrl ? (
                          <div className="w-full h-full relative flex items-center justify-center">
                            {React.createElement('model-viewer', {
                              src: relatedModels[inlineModelIndex].fileUrl,
                              alt: getLocalized(relatedModels[inlineModelIndex].title),
                              'auto-rotate': true,
                              'camera-controls': true,
                              'touch-action': 'pan-y',
                              'shadow-intensity': '1',
                              style: { width: '100%', height: '100%', minHeight: '440px', backgroundColor: '#020617' }
                            })}
                          </div>
                        ) : relatedModels[inlineModelIndex].embedUrl ? (
                          <iframe
                            title={getLocalized(relatedModels[inlineModelIndex].title)}
                            src={relatedModels[inlineModelIndex].embedUrl}
                            className="w-full h-full border-0 min-h-[440px]"
                            allow="autoplay; fullscreen; xr-spatial-tracking"
                            allowFullScreen
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-white/70">
                            <Box className="w-12 h-12 mb-3 text-emerald-400" />
                            <p className="text-xs mb-4">
                              {getLocalized(relatedModels[inlineModelIndex].description)}
                            </p>
                            <button
                              type="button"
                              onClick={() => setSelected3DModel(relatedModels[inlineModelIndex])}
                              className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-black text-xs uppercase tracking-wider hover:bg-emerald-600 transition-all cursor-pointer"
                            >
                              {language === 'uz' ? "Modelni ochish" : "Открыть модель"}
                            </button>
                          </div>
                        )}
                      </div>

                      {getLocalized(relatedModels[inlineModelIndex].description) && (
                        <div className="p-4 bg-slate-900/90 border-t border-slate-800/80 text-xs text-slate-300 flex items-center justify-between gap-4">
                          <p className="line-clamp-2 leading-relaxed">
                            {getLocalized(relatedModels[inlineModelIndex].description)}
                          </p>
                          <button
                            type="button"
                            onClick={() => setSelected3DModel(relatedModels[inlineModelIndex])}
                            className="shrink-0 text-emerald-400 hover:text-emerald-300 text-xs font-black uppercase tracking-wider underline cursor-pointer"
                          >
                            {language === 'uz' ? "Batafsil / Katta ko'rinish" : "Подробнее"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* All Related Models Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {relatedModels.map((m, idx) => (
                      <div
                        key={m.id}
                        onClick={() => {
                          setInlineModelIndex(idx);
                          setSelected3DModel(m);
                        }}
                        className={`group p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 bg-white hover:border-emerald-500 hover:shadow-md ${
                          inlineModelIndex === idx ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200/80'
                        }`}
                      >
                        <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                          <RelatedModelThumb src={m.thumbnail} alt={getLocalized(m.title)} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-black text-slate-800 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                            {getLocalized(m.title)}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {getLocalized(m.description) || m.author || ''}
                          </p>
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-600 mt-1">
                            {language === 'uz' ? "3D da ko'rish" : "Смотреть в 3D"} <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : activeTab === 'theory_questions' ? (
                <TopicTheoryQuestionsViewer topic={topic} questions={theoryQuestions} />
              ) : activeTab === 'interactive_quizzes' ? (
                <TopicInteractiveQuizzesViewer topic={topic} quizzes={topicQuizzes} />
              ) : activeTab === 'glossary' ? (
                <TopicGlossaryViewer
                  topicTitle={getLocalized(topic.title)}
                  topicId={topic.id}
                  terms={topic.terms}
                  latinTerms={topic.latinTerms}
                  semester={topic.semester}
                  topicOrder={topic.order}
                  theory={getLocalized(topic.theory) || (typeof topic.theory === 'string' ? topic.theory : '')}
                />
              ) : (
                <TopicReferencesViewer
                  topicTitle={getLocalized(topic.title)}
                  topicId={topic.id}
                  references={topic.references}
                  semester={topic.semester}
                />
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

            {/* Related 3D Anatomy Models — sidebar, always visible without scrolling */}
            {relatedModels.length > 0 && (
              <div className="p-8 bg-white border border-slate-200/80 rounded-[32px] shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-brand-accent" />
                <div className="flex items-center gap-2.5 mb-1">
                  <span className="w-9 h-9 rounded-xl bg-brand-accent/15 text-brand-primary flex items-center justify-center shrink-0">
                    <Box className="w-4.5 h-4.5" />
                  </span>
                  <h3 className="text-sm font-black text-slate-800 tracking-tight uppercase leading-tight">
                    {language === 'uz' ? "Tegishli 3D Modellar" : language === 'ru' ? "3D модели по теме" : "Related 3D Models"}
                  </h3>
                </div>
                <p className="text-slate-400 text-[11px] font-semibold leading-relaxed mb-5">
                  {language === 'uz' ? `${relatedModels.length} ta interaktiv model topildi` : language === 'ru' ? `Найдено интерактивных моделей: ${relatedModels.length}` : `${relatedModels.length} interactive models found`}
                </p>
                <div className="space-y-3">
                  {relatedModels.slice(0, 4).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelected3DModel(m)}
                      className="w-full text-left group flex items-center gap-3 p-2.5 rounded-2xl border border-slate-100 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all cursor-pointer shadow-xs hover:shadow-md"
                    >
                      <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 shrink-0 overflow-hidden flex items-center justify-center">
                        <RelatedModelThumb src={m.thumbnail} alt={getLocalized(m.title)} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-[11px] font-black text-brand-primary line-clamp-2 uppercase tracking-tight leading-snug group-hover:text-emerald-700 transition-colors">
                          {getLocalized(m.title)}
                        </h4>
                        <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-emerald-600 mt-1">
                          {language === 'uz' ? "To'g'ridan-to'g'ri ochish" : language === 'ru' ? "Открыть 3D модель" : "Open 3D model"} <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                {relatedModels.length > 4 && (
                  <Link
                    to={`/models?topic=${encodeURIComponent(`sem_${topic?.semester}_top_${topic?.order}`)}`}
                    className="mt-4 w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-brand-primary text-[10px] font-black uppercase tracking-wider transition-all"
                  >
                    {language === 'uz' ? `Yana ${relatedModels.length - 4} tasini ko'rish` : language === 'ru' ? `Ещё ${relatedModels.length - 4}` : `See ${relatedModels.length - 4} more`}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                )}
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
            {/* Top Controls Toolbar - 100% Responsive, Zero Cut-off */}
            <div className={`px-3 sm:px-6 py-2.5 sm:py-3 border-b shrink-0 w-full transition-colors z-20 ${
              readTheme === 'light' 
                ? 'border-slate-200 bg-slate-50/95 backdrop-blur-md' 
                : readTheme === 'warm' 
                  ? 'border-[#EBDCC5] bg-[#FAF5ED]/95 backdrop-blur-md' 
                  : 'border-slate-800 bg-[#161a22]/95 backdrop-blur-md'
            }`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-4">
                {/* Topic Info & Order (Left) */}
                <div className="flex items-center justify-between md:justify-start gap-2.5 sm:gap-3 min-w-0 max-w-full md:max-w-sm lg:max-w-md xl:max-w-lg shrink">
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-brand-accent/25 flex items-center justify-center shrink-0 shadow-xs">
                      <BookOpen className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-brand-accent text-brand-primary text-[9px] sm:text-[10px] font-black uppercase tracking-wider shrink-0 shadow-xs">
                          {topic.order}-Mavzu
                        </span>
                        <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${
                          readTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          Mutolaa Rejimi
                        </span>
                      </div>
                      <h3 className={`font-black text-xs sm:text-sm uppercase leading-tight truncate mt-0.5 ${
                        readTheme === 'dark' ? 'text-white' : 'text-brand-primary'
                      }`} title={topicTitle}>
                        {parsedTopicTitle.mainTitle || topicTitle}
                      </h3>
                    </div>
                  </div>

                  {/* Chiqish (Mobile only - visible on small screens < md) */}
                  <button 
                    onClick={() => setIsFullscreen(false)}
                    className="md:hidden flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white font-black px-3 py-1.5 rounded-xl active:scale-95 transition-all shadow-md cursor-pointer shrink-0"
                    title="Chiqish"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span className="text-xs">Chiqish</span>
                  </button>
                </div>

                {/* Reader Controls Toolbar (Right) - ALWAYS 100% VISIBLE & FUNCTIONAL */}
                <div className="flex items-center justify-between md:justify-end gap-2 sm:gap-3 shrink-0 text-xs font-sans w-full md:w-auto">
                  {/* Matn o'lchami (A / A+ / A++) */}
                  <div className="flex items-center gap-1 shrink-0">
                    <span className={`text-[10px] font-bold mr-0.5 uppercase hidden sm:inline ${
                      readTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                    }`}>Matn:</span>
                    <div className={`flex items-center p-0.5 rounded-xl border shadow-xs ${
                      readTheme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                    }`}>
                      <button 
                        onClick={() => setTextSize('normal')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all text-xs cursor-pointer ${
                          textSize === 'normal' 
                            ? 'bg-brand-accent text-brand-primary font-black shadow-sm ring-1 ring-brand-accent/50' 
                            : readTheme === 'dark' ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                        title="Oddiy matn o'lchami (A)"
                      >
                        A
                      </button>
                      <button 
                        onClick={() => setTextSize('large')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all text-xs cursor-pointer ${
                          textSize === 'large' 
                            ? 'bg-brand-accent text-brand-primary font-black shadow-sm ring-1 ring-brand-accent/50' 
                            : readTheme === 'dark' ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                        title="Kattaroq matn o'lchami (A+)"
                      >
                        A+
                      </button>
                      <button 
                        onClick={() => setTextSize('extra')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all text-xs cursor-pointer ${
                          textSize === 'extra' 
                            ? 'bg-brand-accent text-brand-primary font-black shadow-sm ring-1 ring-brand-accent/50' 
                            : readTheme === 'dark' ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                        title="Eng katta matn o'lchami (A++)"
                      >
                        A++
                      </button>
                    </div>
                  </div>

                  {/* Shrift turi (Sans / Serif) */}
                  <div className="flex items-center gap-1 shrink-0">
                    <span className={`text-[10px] font-bold mr-0.5 uppercase hidden sm:inline ${
                      readTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                    }`}>Shrift:</span>
                    <div className={`flex items-center p-0.5 rounded-xl border shadow-xs ${
                      readTheme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                    }`}>
                      <button 
                        onClick={() => setFontFamily('sans')}
                        className={`px-2.5 py-1 rounded-lg font-bold transition-all text-xs cursor-pointer ${
                          fontFamily === 'sans' 
                            ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-500' 
                            : readTheme === 'dark' ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                        title="Zamonaviy sans-serif shrift"
                      >
                        Sans
                      </button>
                      <button 
                        onClick={() => setFontFamily('serif')}
                        className={`px-2.5 py-1 rounded-lg font-serif font-bold transition-all text-xs cursor-pointer ${
                          fontFamily === 'serif' 
                            ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-500' 
                            : readTheme === 'dark' ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                        title="Klassik kitobiy serif shrift"
                      >
                        Serif
                      </button>
                    </div>
                  </div>

                  {/* Fon Mavzusi (Oq / Sepia / Qorong'u) */}
                  <div className="flex items-center gap-1 shrink-0">
                    <span className={`text-[10px] font-bold mr-0.5 uppercase hidden sm:inline ${
                      readTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                    }`}>Mavzu:</span>
                    <div className={`flex items-center p-0.5 rounded-xl border gap-0.5 shadow-xs ${
                      readTheme === 'dark' ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
                    }`}>
                      <button 
                        onClick={() => setReadTheme('light')}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center border font-bold text-xs cursor-pointer transition-all ${
                          readTheme === 'light' ? 'border-indigo-600 ring-2 ring-indigo-600/30 bg-white scale-105' : 'border-slate-200 bg-white hover:bg-slate-50'
                        } text-slate-800`}
                        title="Kunduzgi yorug' rejim (Oq)"
                      >
                        ☀
                      </button>
                      <button 
                        onClick={() => setReadTheme('warm')}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center border font-bold text-xs cursor-pointer transition-all ${
                          readTheme === 'warm' ? 'border-amber-600 ring-2 ring-amber-600/30 bg-[#FAF6F0] scale-105' : 'border-[#EADFCF] bg-[#FAF6F0] hover:bg-[#F2E8D8]'
                        } text-[#2C251E]`}
                        title="Sepia issiq qog'oz rejimi (Ko'zga qulay)"
                      >
                        ☕
                      </button>
                      <button 
                        onClick={() => setReadTheme('dark')}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center border font-bold text-xs cursor-pointer transition-all ${
                          readTheme === 'dark' ? 'border-slate-400 ring-2 ring-slate-400/30 bg-slate-900 scale-105' : 'border-slate-800 bg-slate-900 hover:bg-slate-850'
                        } text-slate-200`}
                        title="Tungi qorong'u rejim"
                      >
                        ☾
                      </button>
                    </div>
                  </div>

                  {/* Chiqish (Desktop - >= md) */}
                  <button 
                    onClick={() => setIsFullscreen(false)}
                    className="hidden md:flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-black px-4 py-2 rounded-xl active:scale-95 transition-all shadow-md cursor-pointer shrink-0 ml-1"
                    title="Mutolaa rejimidan chiqish"
                  >
                    <X className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Chiqish</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Main Reading Canvas */}
            <div className="flex-1 overflow-y-auto px-6 py-10 md:px-16 md:py-16">
              <div className={`mx-auto max-w-4xl leading-relaxed ${
                fontFamily === 'serif' ? 'font-serif [font-family:Georgia,Cambria,"Times_New_Roman",Times,serif]' : 'font-sans'
              }`}>
                {/* Header info in reader */}
                <div className="text-center mb-10 max-w-4xl mx-auto">
                  <span className="inline-block px-3.5 py-1 bg-brand-accent/25 border border-brand-accent/35 text-brand-primary rounded-lg font-black uppercase tracking-widest text-[9px] mb-4">
                    {t('study.unlocked').toUpperCase()} {topic.order}
                  </span>
                  
                  {/* Primary Main Title */}
                  <h2 className={`text-2xl sm:text-3xl md:text-5xl font-black tracking-tight uppercase leading-tight mb-4 ${
                    readTheme === 'dark' ? 'text-white' : 'text-brand-primary'
                  }`}>
                    {parsedTopicTitle.mainTitle || topicTitle}
                  </h2>

                  {/* Subtopics formatted in clean column structure ("ustunli") */}
                  {parsedTopicTitle.subParts.length > 0 && (
                    <div className="my-6 max-w-3xl mx-auto">
                      <div className="flex items-center justify-center gap-2 mb-3 opacity-75">
                        <span className="w-6 h-0.5 bg-brand-accent"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {language === 'uz' ? "Mavzu rejasi va tarkibiy qismlari" : language === 'ru' ? "План темы и составные части" : "Topic plan & components"}
                        </span>
                        <span className="w-6 h-0.5 bg-brand-accent"></span>
                      </div>
                      <div className={`grid grid-cols-1 sm:grid-cols-2 ${parsedTopicTitle.subParts.length > 2 ? 'md:grid-cols-3' : ''} gap-2.5 text-left`}>
                        {parsedTopicTitle.subParts.map((sub, idx) => (
                          <div 
                            key={idx}
                            className={`p-3 rounded-2xl border transition-all flex items-start gap-2.5 shadow-xs ${
                              readTheme === 'dark'
                                ? 'bg-slate-900/90 text-slate-200 border-slate-800'
                                : readTheme === 'warm'
                                  ? 'bg-[#F2E8D8] text-[#3D3022] border-[#DFD0BC]'
                                  : 'bg-slate-50 text-slate-800 border-slate-200'
                            }`}
                          >
                            <span className="w-5 h-5 rounded-lg bg-brand-accent/35 text-brand-primary flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5 shadow-xs">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-bold leading-snug">{sub}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Inline Tab Navigation for Immersive Reader */}
                  <div className="flex justify-center mb-8">
                    <div className={`flex flex-wrap items-center gap-1.5 p-1 rounded-2xl select-none ${
                      readTheme === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-slate-100/80 border border-slate-200/50'
                    }`}>
                      <button
                        onClick={() => setActiveTab('theory')}
                        className={`px-3 sm:px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                          activeTab === 'theory'
                            ? readTheme === 'dark' ? 'bg-slate-800 text-white shadow-md' : 'bg-blue-600 text-white shadow-md'
                            : 'text-brand-muted hover:text-blue-600'
                        }`}
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>1. {t('topic.theory')}</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('presentation')}
                        className={`px-3 sm:px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                          activeTab === 'presentation'
                            ? readTheme === 'dark' ? 'bg-slate-800 text-white shadow-md' : 'bg-amber-600 text-white shadow-md'
                            : 'text-brand-muted hover:text-amber-600'
                        }`}
                      >
                        <Presentation className="w-3.5 h-3.5" />
                        <span>2. Taqdimot</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('video_lessons')}
                        className={`px-3 sm:px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                          activeTab === 'video_lessons'
                            ? readTheme === 'dark' ? 'bg-slate-800 text-white shadow-md' : 'bg-violet-600 text-white shadow-md'
                            : 'text-brand-muted hover:text-violet-600'
                        }`}
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>3. Video</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('models_3d')}
                        className={`px-3 sm:px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                          activeTab === 'models_3d'
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'text-brand-muted hover:text-emerald-600'
                        }`}
                      >
                        <Box className="w-3.5 h-3.5" />
                        <span>4. 3D ({relatedModels.length})</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('theory_questions')}
                        className={`px-3 sm:px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                          activeTab === 'theory_questions'
                            ? readTheme === 'dark' ? 'bg-slate-800 text-white shadow-md' : 'bg-rose-600 text-white shadow-md'
                            : 'text-brand-muted hover:text-rose-600'
                        }`}
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>5. Nazorat savollari ({theoryQuestions.length})</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('interactive_quizzes')}
                        className={`px-3 sm:px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                          activeTab === 'interactive_quizzes'
                            ? readTheme === 'dark' ? 'bg-slate-800 text-white shadow-md' : 'bg-red-600 text-white shadow-md'
                            : 'text-brand-muted hover:text-red-600'
                        }`}
                      >
                        <ClipboardCheck className="w-3.5 h-3.5" />
                        <span>6. Testlar ({topicQuizzes.length})</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('glossary')}
                        className={`px-3 sm:px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                          activeTab === 'glossary'
                            ? readTheme === 'dark' ? 'bg-slate-800 text-white shadow-md' : 'bg-indigo-600 text-white shadow-md'
                            : 'text-brand-muted hover:text-indigo-600'
                        }`}
                      >
                        <BookA className="w-3.5 h-3.5" />
                        <span>7. Lug'at ({getTopicTermCount(topic)})</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('references')}
                        className={`px-3 sm:px-4 py-2 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                          activeTab === 'references'
                            ? readTheme === 'dark' ? 'bg-slate-800 text-white shadow-md' : 'bg-slate-800 text-white shadow-md'
                            : 'text-brand-muted hover:text-slate-800'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>8. Adabiyotlar</span>
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

                      {/* Glossary Matches in Reader */}
                      {matchedTerms.length > 0 && (
                        <div className="space-y-3">
                          <span className="text-[10px] font-black tracking-widest opacity-60 uppercase">{language === 'uz' ? "Lug'atlardan" : "Из глоссария"}</span>
                          {matchedTerms.map((t, i) => (
                            <div 
                              key={t.id || i} 
                              className={`p-5 rounded-xl border leading-relaxed ${
                                readTheme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-200' : readTheme === 'warm' ? 'bg-[#EADFCF]/35 border-[#EADFCF] text-[#2D241A]' : 'bg-slate-50 border-slate-250 text-slate-800'
                              } text-sm md:text-base space-y-1`}
                            >
                              <div className="font-serif italic font-bold">
                                <HighlightedText text={t.latin} highlight={searchQuery} />
                              </div>
                              {(t.uzbek || t.uz) && (
                                <div className="text-xs font-semibold">
                                  UZ: <HighlightedText text={t.uzbek || t.uz || ''} highlight={searchQuery} />
                                </div>
                              )}
                              {t.description && (
                                <p className="text-xs opacity-80 pt-1">
                                  <HighlightedText text={t.description} highlight={searchQuery} />
                                </p>
                              )}
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
                                      const diagKey = getDiagramKey(codeString);
                                      const replacement = topic?.diagramReplacements?.[diagKey] || null;
                                      return (
                                        <CreativeAnatomyDiagram 
                                          value={codeString}
                                          topicId={topic?.id}
                                          isAdmin={isUserAdmin}
                                          replacement={replacement}
                                          onUpdateReplacement={(newRep) => handleDiagramReplacementUpdate(diagKey, newRep)}
                                        />
                                      );
                                    }
                                    return <code className={className} {...props}>{children}</code>;
                                  },
                                  p({ children }) {
                                    return (
                                      <p className={`mb-6 leading-relaxed sm:leading-loose ${
                                        textSize === 'normal' 
                                          ? 'text-base sm:text-lg' 
                                          : textSize === 'large' 
                                            ? 'text-lg sm:text-xl' 
                                            : 'text-xl sm:text-2xl'
                                      }`}>
                                        {children}
                                      </p>
                                    );
                                  },
                                  h1({ children }) {
                                    return (
                                      <h1 className={`font-black tracking-tight mt-10 mb-5 ${
                                        textSize === 'normal' ? 'text-2xl sm:text-3xl' : textSize === 'large' ? 'text-3xl sm:text-4xl' : 'text-4xl sm:text-5xl'
                                      } ${readTheme === 'dark' ? 'text-white' : 'text-brand-primary'}`}>
                                        {children}
                                      </h1>
                                    );
                                  },
                                  h2({ children }) {
                                    return (
                                      <h2 className={`font-black tracking-tight mt-8 mb-4 ${
                                        textSize === 'normal' ? 'text-xl sm:text-2xl' : textSize === 'large' ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'
                                      } ${readTheme === 'dark' ? 'text-white' : 'text-brand-primary'}`}>
                                        {children}
                                      </h2>
                                    );
                                  },
                                  h3({ children }) {
                                    return (
                                      <h3 className={`font-black tracking-tight mt-6 mb-3 ${
                                        textSize === 'normal' ? 'text-lg sm:text-xl' : textSize === 'large' ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'
                                      } ${readTheme === 'dark' ? 'text-slate-100' : 'text-brand-primary'}`}>
                                        {children}
                                      </h3>
                                    );
                                  },
                                  li({ children }) {
                                    return (
                                      <li className={`mb-2.5 leading-relaxed ${
                                        textSize === 'normal' 
                                          ? 'text-base sm:text-lg' 
                                          : textSize === 'large' 
                                            ? 'text-lg sm:text-xl' 
                                            : 'text-xl sm:text-2xl'
                                      }`}>
                                        {children}
                                      </li>
                                    );
                                  },
                                  ul({ children }) {
                                    return <ul className="list-disc pl-6 mb-6 space-y-1.5">{children}</ul>;
                                  },
                                  ol({ children }) {
                                    return <ol className="list-decimal pl-6 mb-6 space-y-1.5">{children}</ol>;
                                  },
                                  blockquote({ children }) {
                                    return (
                                      <blockquote className={`border-l-4 pl-4 py-2 my-6 italic rounded-r-xl ${
                                        readTheme === 'dark' 
                                          ? 'border-brand-accent bg-slate-900/60 text-slate-300' 
                                          : readTheme === 'warm'
                                            ? 'border-amber-600 bg-[#F4ECDE] text-[#2F2417]'
                                            : 'border-brand-accent bg-amber-50/50 text-slate-800'
                                      } ${
                                        textSize === 'normal' ? 'text-base sm:text-lg' : textSize === 'large' ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'
                                      }`}>
                                        {children}
                                      </blockquote>
                                    );
                                  }
                                }}
                              >
                                {getEffectiveTheoryText()}
                              </ReactMarkdown>
                            </>
                          )}
                        </div>
                      ) : activeTab === 'presentation' ? (
                        <div className="text-left">
                          <TopicPresentationSection topic={topic} />
                        </div>
                      ) : activeTab === 'video_lessons' ? (
                        <div className="text-left space-y-6">
                          {(!localizedVideos || localizedVideos.length === 0) ? (
                            <div className="py-16 text-center text-slate-400">
                              <Play className="w-12 h-12 mx-auto mb-3 opacity-40" />
                              <p className="text-sm font-bold">Video darsliklar kiritilmagan</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="relative aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-800">
                                <iframe
                                  src={localizedVideos[selectedVidIndex]}
                                  title="Video lecture"
                                  className="w-full h-full border-0"
                                  allowFullScreen
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ) : activeTab === 'models_3d' ? (
                        <div className="text-left space-y-6">
                          {relatedModels[inlineModelIndex] && (
                            <div className="bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
                              <div className="flex items-center justify-between px-5 py-3 bg-slate-900 border-b border-slate-800 text-white text-xs">
                                <span className="font-black text-sm">{getLocalized(relatedModels[inlineModelIndex].title)}</span>
                                <button
                                  type="button"
                                  onClick={() => setSelected3DModel(relatedModels[inlineModelIndex])}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                                >
                                  {language === 'uz' ? "Modalda ochish" : "Открыть в модале"}
                                </button>
                              </div>
                              <div className="relative w-full aspect-video min-h-[380px] sm:min-h-[500px] bg-slate-950 flex items-center justify-center">
                                {relatedModels[inlineModelIndex].fileUrl ? (
                                  <div className="w-full h-full relative flex items-center justify-center">
                                    {React.createElement('model-viewer', {
                                      src: relatedModels[inlineModelIndex].fileUrl,
                                      alt: getLocalized(relatedModels[inlineModelIndex].title),
                                      'auto-rotate': true,
                                      'camera-controls': true,
                                      'touch-action': 'pan-y',
                                      'shadow-intensity': '1',
                                      style: { width: '100%', height: '100%', minHeight: '480px', backgroundColor: '#020617' }
                                    })}
                                  </div>
                                ) : relatedModels[inlineModelIndex].embedUrl ? (
                                  <iframe
                                    title={getLocalized(relatedModels[inlineModelIndex].title)}
                                    src={relatedModels[inlineModelIndex].embedUrl}
                                    className="w-full h-full border-0 min-h-[480px]"
                                    allow="autoplay; fullscreen; xr-spatial-tracking"
                                    allowFullScreen
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center p-8 text-white/70">
                                    <button
                                      type="button"
                                      onClick={() => setSelected3DModel(relatedModels[inlineModelIndex])}
                                      className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-black text-xs cursor-pointer"
                                    >
                                      {language === 'uz' ? "Modelni ochish" : "Открыть модель"}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : activeTab === 'theory_questions' ? (
                        <div className="text-left">
                          <TopicTheoryQuestionsViewer topic={topic} questions={theoryQuestions} />
                        </div>
                      ) : activeTab === 'interactive_quizzes' ? (
                        <div className="text-left">
                          <TopicInteractiveQuizzesViewer topic={topic} quizzes={topicQuizzes} />
                        </div>
                      ) : activeTab === 'glossary' ? (
                        <div className="text-left">
                          <TopicGlossaryViewer
                            topicTitle={getLocalized(topic.title)}
                            topicId={topic.id}
                            terms={topic.terms}
                            latinTerms={topic.latinTerms}
                            semester={topic.semester}
                            topicOrder={topic.order}
                            theory={getLocalized(topic.theory) || (typeof topic.theory === 'string' ? topic.theory : '')}
                          />
                        </div>
                      ) : (
                        <div className="text-left">
                          <TopicReferencesViewer
                            topicTitle={getLocalized(topic.title)}
                            topicId={topic.id}
                            references={topic.references}
                            semester={topic.semester}
                          />
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

      {/* Interactive 3D Anatomy Model Modal */}
      <TopicModelViewerModal
        model={selected3DModel}
        isOpen={!!selected3DModel}
        onClose={() => setSelected3DModel(null)}
        language={language}
        isLocked={!isUnlocked}
        onSubscribe={() => setShowPaymentModal(true)}
      />
    </div>
  );
}
