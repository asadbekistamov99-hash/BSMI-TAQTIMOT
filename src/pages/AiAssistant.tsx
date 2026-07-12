import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useSettings } from '../hooks/useSettings';
import { Sparkles, Send, Trash2, HelpCircle, BookOpen, Microscope, ArrowRight, Image as ImageIcon, X, Copy, Check, MessageSquare, AlertTriangle, Lock, Mic, MicOff, Globe } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { dbService } from '../lib/dbService';

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
  timestamp: string;
  image?: string;
  groundingSources?: { title: string; uri: string }[];
}

export default function AiAssistant({ user }: { user: any }) {
  const { language, t } = useLanguage();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<{ data: string; mimeType: string } | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isPaidUser, setIsPaidUser] = useState<boolean>(false);
  const [dailyCount, setDailyCount] = useState<number>(0);
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);
  const [handsFree, setHandsFree] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  
  const silenceTimerRef = useRef<any>(null);
  const inputRef = useRef('');
  const handsFreeRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const loadingRef = useRef(false);
  const isPaidUserRef = useRef(false);
  const dailyCountRef = useRef(0);
  const isSendingVoiceQueryRef = useRef(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check user subscription / paid status
  useEffect(() => {
    const checkPaidStatus = async () => {
      if (!user) {
        setIsPaidUser(false);
        return;
      }
      try {
        // Double check admin token
        const adminToken = sessionStorage.getItem('adminToken');
        if (adminToken) {
          setIsPaidUser(true);
          return;
        }

        const profile = await dbService.getProfile(user.uid);
        if (profile) {
          if (profile.role === 'admin' || profile.isAdmin) {
            setIsPaidUser(true);
            return;
          }
          // If the student has any active subscription whose duration has not expired, grant full access
          if (profile.expiryDate) {
            let expiryDate: Date | null = null;
            if (typeof profile.expiryDate.toDate === 'function') {
              expiryDate = profile.expiryDate.toDate();
            } else if (profile.expiryDate.seconds !== undefined) {
              expiryDate = new Date(profile.expiryDate.seconds * 1000);
            } else {
              expiryDate = new Date(profile.expiryDate);
            }
            if (expiryDate && expiryDate > new Date()) {
              setIsPaidUser(true);
              return;
            }
          }
          if (profile.purchasedSemesters && profile.purchasedSemesters.length > 0) {
            setIsPaidUser(true);
            return;
          }
        }

        // Check payments for sem 1 and 2
        for (const semId of [1, 2]) {
          const payment = await dbService.getPayment(user.uid, semId);
          if (payment && (payment.status === 'completed' || payment.status === 'approved')) {
            setIsPaidUser(true);
            return;
          }
        }
      } catch (e) {
        console.error("Error verifying AI subscription status:", e);
      }
      setIsPaidUser(false);
    };

    checkPaidStatus();
  }, [user]);

  // Load daily count limit (5 free questions per day) - Reset exactly at 00:00 local time
  useEffect(() => {
    const now = new Date();
    // Get local date "YYYY-MM-DD" instead of UTC which delays reset by several hours in Uzbekistan (UTC+5)
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const stored = localStorage.getItem('bsmi_anatomy_ai_daily_usage');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.date === todayStr) {
          setDailyCount(parsed.count || 0);
        } else {
          // Reset exactly at 00:00 local time
          localStorage.setItem('bsmi_anatomy_ai_daily_usage', JSON.stringify({ count: 0, date: todayStr }));
          setDailyCount(0);
        }
      } catch (e) {
        console.error("Error parsing daily usage storage:", e);
      }
    } else {
      localStorage.setItem('bsmi_anatomy_ai_daily_usage', JSON.stringify({ count: 0, date: todayStr }));
      setDailyCount(0);
    }
  }, []);

  // Synchronize mutable references to prevent stale closures in Web Speech listeners
  useEffect(() => {
    inputRef.current = input;
  }, [input]);

  useEffect(() => {
    handsFreeRef.current = handsFree;
  }, [handsFree]);

  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
  }, [isSpeaking]);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    isPaidUserRef.current = isPaidUser;
  }, [isPaidUser]);

  useEffect(() => {
    dailyCountRef.current = dailyCount;
  }, [dailyCount]);

  // Clean up synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const incrementDailyCount = () => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const newCount = dailyCount + 1;
    setDailyCount(newCount);
    localStorage.setItem('bsmi_anatomy_ai_daily_usage', JSON.stringify({ count: newCount, date: todayStr }));
  };

  // Speak text aloud using browser SpeechSynthesis
  const speakText = (text: string, onDone?: () => void) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      // Filter out markdown syntax to read clearly
      const cleanText = text
        .replace(/[\*\#\_`\-]/g, ' ')
        .replace(/\[.*?\]\(.*?\)/g, '')
        .replace(/`{1,3}[\s\S]*?`{1,3}/g, '')
        .replace(/https?:\/\/\S+/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US';
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        if (onDone) onDone();
      };

      utterance.onerror = () => {
        if (onDone) onDone();
      };

      window.speechSynthesis.speak(utterance);
    } else {
      if (onDone) onDone();
    }
  };

  // Setup Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      // When hands-free continuous mode is active, set continuous to true
      rec.continuous = handsFree;
      rec.interimResults = false;
      rec.lang = language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US';
      
      rec.onstart = () => {
        setIsListening(true);
      };
      
      rec.onend = () => {
        setIsListening(false);
        // Robust silent auto-restart for seamless hands-free conversational loop
        if (handsFreeRef.current && !loadingRef.current && !isSpeakingRef.current && !isSendingVoiceQueryRef.current) {
          setTimeout(() => {
            if (handsFreeRef.current && !loadingRef.current && !isSpeakingRef.current && !isSendingVoiceQueryRef.current) {
              try {
                rec.start();
                setIsListening(true);
              } catch (e) {
                console.log("Silent voice auto-restart failed", e);
              }
            }
          }, 200);
        }
      };
      
      rec.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'aborted' || event.error === 'no-speech') {
          // Normal informational status signals in conversational loop, not errors
          console.log("Speech recognition status update:", event.error);
          return;
        }
        console.warn("Speech recognition notice:", event.error);
        if (event.error === 'not-allowed') {
          setHandsFree(false);
          alert(
            language === 'uz'
              ? "Mikrofonga ruxsat berilmagan. Iltimos, brauzer sozlamalaridan ushbu saytga mikrofondan foydalanishga ruxsat bering."
              : "Доступ к микрофону заблокирован. Пожалуйста, разрешите использование микрофона в настройках вашего браузера."
          );
        }
      };
      
      rec.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          setInput(prev => {
            const separator = prev ? ' ' : '';
            return prev + separator + finalTranscript;
          });

          // Detect silence of 1.3 seconds or faster for instant Jarvis voice reply
          if (handsFreeRef.current) {
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = setTimeout(() => {
              triggerAutoSend();
            }, 1300);
          }
        }
      };
      
      recognitionRef.current = rec;
    } else {
      recognitionRef.current = null;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, [language, handsFree]);

  const safeStartRecognition = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (e) {}
    
    setTimeout(() => {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn("Failed to start speech recognition:", err);
      }
    }, 150);
  };

  const triggerAutoSend = () => {
    const text = inputRef.current;
    if (text.trim()) {
      isSendingVoiceQueryRef.current = true;
      // Temporarily halt listening to prevent double input or system feedback loop
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      handleSend(text);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(
        language === 'uz' 
          ? "Sizning brauzeringiz ovozli qidiruvni qo'llab-quvvatlamaydi (Iltimos, Google Chrome yoki Safari brauzeridan foydalaning)." 
          : "Ваш браузер не поддерживает распознавание речи (пожалуйста, используйте Google Chrome или Safari)."
      );
      return;
    }

    // Shut down handsFree continuous mode if click standard mic toggle
    if (handsFree) {
      setHandsFree(false);
      handsFreeRef.current = false;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
    } else {
      safeStartRecognition();
    }
  };

  const toggleHandsFree = () => {
    const nextVal = !handsFree;
    setHandsFree(nextVal);
    handsFreeRef.current = nextVal; // Sync Ref instantly

    if (!nextVal) {
      // Switch off
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      isSpeakingRef.current = false; // Sync Ref instantly
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    } else {
      // Switch on
      if (!recognitionRef.current) {
        alert(
          language === 'uz' 
            ? "Sizning brauzeringiz ovozli qidiruvni qo'llab-quvvatlamaydi (Iltimos, Google Chrome yoki Safari brauzeridan foydalaning)." 
            : "Ваш браузер не поддерживает распознавание речи (пожалуйста, используйте Google Chrome или Safari)."
        );
        setHandsFree(false);
        handsFreeRef.current = false;
        return;
      }

      // Stop any active recognition to start clean
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsListening(false);

      // Welcome guidance read-aloud
      const welcomeScript = language === 'uz'
        ? "Jarvis ovozli muloqot tizimi faollashtirildi, ser. Buyuring, sizni tinglayapman!"
        : "Голосовой режим Джарвис активирован, сэр. Задайте ваш вопрос, я готов отвечать!";

      setIsSpeaking(true);
      isSpeakingRef.current = true; // Sync Ref instantly
      
      speakText(welcomeScript, () => {
        setIsSpeaking(false);
        isSpeakingRef.current = false; // Sync Ref instantly
        if (handsFreeRef.current) {
          safeStartRecognition();
        }
      });
    }
  };

  // Load chat session on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('bsmi_anatomy_chat_history');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing chat history:", e);
      }
    } else {
      // Set localized initial greeting
      const greetText = language === 'uz'
        ? "Assalomu alaykum! Men BSMI Anatomiya sun'iy intellekt yordamchisiman. Odam anatomiyasi darsliklari, 3D atlas, tibbiy terminlar yoki testlar bo'yicha har qanday savolingiz bo'lsa yo'llang. Agar qo'lingizda biror anatomik rasm bo'lsa, uni ham biriktirib tahlil qildirishingiz mumkin! 🧠✨"
        : language === 'ru'
        ? "Здравствуйте! Я ИИ-помощник по анатомии БГМИ. Задавайте любые вопросы по учебникам анатомии человека, 3D-атласу, медицинским терминам или тестам. Если у вас есть анатомический рисунок или схема, вы также можете прикрепить её для анализа! 🧠✨"
        : "Hello! I am the BSMI Anatomy AI Assistant. Ask any questions about human anatomy textbooks, 3D atlas, medical terms, or active tests. If you have an anatomical diagram or bone/organ picture, you can also attach it for visual analysis! 🧠✨";

      setMessages([{
        role: 'model',
        parts: [{ text: greetText }],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  }, [language]);

  // Persist chat session to storage
  const saveAndSetMessages = (newMsgs: ChatMessage[]) => {
    setMessages(newMsgs);
    sessionStorage.setItem('bsmi_anatomy_chat_history', JSON.stringify(newMsgs));
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(language === 'uz' ? "Faqat rasm yuklashingiz mumkin!" : "Можно загружать только изображения!");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage({
        data: reader.result as string,
        mimeType: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSend = async (customText?: string) => {
    const textToSend = customText !== undefined ? customText : input;
    if (!textToSend.trim() && !image) {
      isSendingVoiceQueryRef.current = false;
      return;
    }

    if (!isPaidUser && dailyCount >= 5) {
      alert(
        language === 'uz'
          ? "Siz bugungi 5 ta bepul savol limitidan foydalandingiz. Cheksiz foydalanish uchun semestrlardan birini sotib oling! 🫀🧠"
          : "Вы израсходовали лимит из 5 бесплатных вопросов на сегодня. Приобретите любой семестр для неограниченного доступа! 🫀🧠"
      );
      isSendingVoiceQueryRef.current = false;
      return;
    }

    const currentTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage: ChatMessage = {
      role: 'user',
      parts: [{ text: textToSend }],
      timestamp: currentTimestamp,
      ...(image ? { image: image.data } : {})
    };

    const updatedMessages = [...messages, userMessage];
    saveAndSetMessages(updatedMessages);
    setInput('');
    const base64Image = image;
    clearImage();
    setLoading(true);

    try {
      const historyPayload = updatedMessages.slice(0, -1).map(msg => ({
        role: msg.role,
        parts: msg.parts
      }));

      const bodyPayload = {
        message: textToSend,
        history: historyPayload,
        images: base64Image ? [{ data: base64Image.data, mimeType: base64Image.mimeType }] : []
      };

      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyPayload)
      });

      if (!response.ok) {
        throw new Error(language === 'uz' ? "Server javob berishda xatolikka yo'l qo'ydi" : "Ошибка при получении ответа от сервера");
      }

      const data = await response.json();
      
      const responseMessage: ChatMessage = {
        role: 'model',
        parts: [{ text: data.text }],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundingSources: data.groundingSources
      };

      saveAndSetMessages([...updatedMessages, responseMessage]);
      
      // Increment only on successful message from Gemini
      incrementDailyCount();

      // If hands-free is enabled, read aloud the response
      if (handsFreeRef.current) {
        setIsSpeaking(true);
        isSpeakingRef.current = true; // Sync Ref instantly
        speakText(data.text, () => {
          setIsSpeaking(false);
          isSpeakingRef.current = false; // Sync Ref instantly
          // Restart recognition after speaking finishes!
          if (handsFreeRef.current && !loadingRef.current) {
            safeStartRecognition();
          }
        });
      }
    } catch (error) {
      console.error("AI Error:", error);
      const errorMessageValue = language === 'uz' 
        ? "Ulanishda xatolik yuz berdi. Iltimos tarmog'ingizni tekshirib, qayta urinib ko'ring." 
        : "Произошла ошибка соединения. Пожалуйста, проверьте сеть и попробуйте еще раз.";

      const responseError: ChatMessage = {
        role: 'model',
        parts: [{ text: `❌ ${errorMessageValue}` }],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      saveAndSetMessages([...updatedMessages, responseError]);

      // If hands-free is enabled, read aloud the error
      if (handsFreeRef.current) {
        setIsSpeaking(true);
        isSpeakingRef.current = true; // Sync Ref instantly
        speakText(errorMessageValue, () => {
          setIsSpeaking(false);
          isSpeakingRef.current = false; // Sync Ref instantly
          if (handsFreeRef.current && !loadingRef.current) {
            safeStartRecognition();
          }
        });
      }
    } finally {
      setLoading(false);
      loadingRef.current = false; // Sync Ref instantly
      isSendingVoiceQueryRef.current = false;
    }
  };

  const handleClearChat = () => {
    if (window.confirm(language === 'uz' ? "Haqiqatan ham barcha suhbatlar tarixini tozalashni xohlaysizmi?" : "Вы действительно хотите очистить всю историю чата?")) {
      sessionStorage.removeItem('bsmi_anatomy_chat_history');
      const greetText = language === 'uz'
        ? "Suhbat tozalandi! Savollaringizni bemalol yo'llashingiz mumkin."
        : language === 'ru'
        ? "Чат очищен! Вы можете свободно задавать свои новые вопросы."
        : "Conversation cleared! Feel free to ask your questions.";

      setMessages([{
        role: 'model',
        parts: [{ text: greetText }],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Predefined Quick Suggestions based on language
  const suggestions = language === 'uz' ? [
    { title: "🫀 Yurak va uning klapanlari", prompt: "Yurak va uning klapanlari (valvae cordis) anatomiyasi, vazifasi va lotincha nomlari haqida mukammal konspekt yozib ber." },
    { title: "🧠 Bosh miya qobiqlari", prompt: "🧠 Bosh miya qobiqlari (meninges): qattiq, to'rsimon va yumshoq pardalarining tuzilishi, bo'shliqlari va lotincha nomlarini tushuntirib ber." },
    { title: "🦴 Murtak suyakchalari qayerda?", prompt: "Quloq anatomiyasi: eshitish murtak suyakchalari (malleus, incus, stapes) qayerda joylashgan va ular qanday ishlaydi?" },
    { title: "📝 Testlar bo'yicha maslahatlar", prompt: "BSMI anatomy platformasidagi test savollarini mukammal o'rganish va yaxshi natija olish uchun qanday amaliy maslahatlar berasiz?" }
  ] : language === 'ru' ? [
    { title: "🫀 Анатомия сердца", prompt: "Опишите анатомию сердца (cor), его клапаны (valvae cordis) и проводящую систему с латинскими терминами." },
    { title: "🧠 Оболочки мозга", prompt: "Расскажите подробно про твердую, паутинную и мягкую оболочки головного мозга (meninges) и пространства между ними." },
    { title: "🦴 Слуховые косточки", prompt: "Где находятся и как функционируют слуховые косточки человека: молоточек, наковальня и стремечко?" },
    { title: "📝 Помощь по тестам", prompt: "Какие советы дадите для эффективного прохождения тестов по анатомии человека на платформе БГМИ?" }
  ] : [
    { title: "🫀 Cardiac Valves", prompt: "Explain the absolute anatomical structure, function, and Latin names of the heart and its cardiac valves (valvae cordis)." },
    { title: "🧠 Brain Meninges", prompt: "Detail the cranial meninges (dura mater, arachnoid mater, pia mater), their clinical spaces, and major functions." },
    { title: "🦴 Ear Ossicles", prompt: "Anatomy of the ear: where are the auditory ossicles (malleus, incus, stapes) located and how do they transmit vibrations?" },
    { title: "📝 Exam Prep Strategies", prompt: "What are the best strategies to master human anatomy questions and perform exceptionally in standard medical exams?" }
  ];

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const { signInWithPopup, signInWithRedirect } = await import('firebase/auth');
      const { auth, googleProvider } = await import('../lib/firebase');
      const result = await signInWithPopup(auth, googleProvider);
      
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
      const { signInWithRedirect } = await import('firebase/auth');
      if (error.code === 'auth/popup-blocked') {
        try {
          const { auth, googleProvider } = await import('../lib/firebase');
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError) {
          console.error("Redirect login failed", redirectError);
          setAuthError(error.message || "Redirect login failed");
        }
      } else if (error.code !== 'auth/popup-closed-by-user') {
        setAuthError(error.message || "Kirishda xatolik yuz berdi");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGuestLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const { robustSignInAnonymously, auth } = await import('../lib/firebase');
      await robustSignInAnonymously(auth);
    } catch (error: any) {
      console.error("Guest login failed", error);
      setAuthError(error.message || "Guest login failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center select-none" id="ai-assistant-unauthenticated">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-tr from-amber-400/10 to-brand-accent/10 rounded-full filter blur-[100px] opacity-70 pointer-events-none -z-10" />
        
        <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-[36px] p-8 sm:p-12 shadow-2xl relative overflow-hidden max-w-2xl mx-auto">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full filter blur-3xl translate-x-10 -translate-y-10 animate-pulse" />
          
          <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center mx-auto mb-6 shadow-xl border border-amber-300">
            <Lock className="w-8 h-8" />
          </div>

          <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            24/7 AI Anatomiya Ko'makchisi
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase leading-none">
            {language === 'uz' ? "Tizimga kirish talab etiladi" : "Требуется авторизация"}
          </h2>

          <p className="text-slate-400 text-xs sm:text-sm font-semibold mt-4 leading-relaxed max-w-md mx-auto">
            {language === 'uz'
              ? "BSMI Anatomiya AI yordamchisidan foydalanish va savollarga javob olish uchun, iltimos, Google hisobingiz orqali tizimga kiring."
              : "Для полноценного использования ИИ-помощника и получения полных ответов на вопросы, пожалуйста, войдите в систему с помощью аккаунта Google."}
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 w-full">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
              <button
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-3 transition-all duration-200 shadow-md shadow-amber-500/15 active:scale-95 cursor-pointer border border-amber-300 disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.24 10.285V13.4h6.86c-.277 1.56-1.602 4.585-6.86 4.585-4.54 0-8.24-3.765-8.24-8.4s3.7-8.4 8.24-8.4c2.58 0 4.307 1.095 5.298 2.045l2.465-2.37C18.435 1.21 15.62 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.89 11.57-11.79 0-.795-.085-1.4-.195-1.925H12.24z"
                  />
                </svg>
                {isLoggingIn ? "Kirilmoqda..." : language === 'uz' ? "Google orqali kirish" : "Войти через Google"}
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-wider rounded-2xl border border-white/10 transition-all duration-200 active:scale-95 cursor-pointer"
              >
                {language === 'uz' ? "Asosiy sahifaga qaytish" : "На главную"}
              </button>
            </div>

            {/* Explanatory banner on Google Auth block or inside iframe */}
            <div className="mt-4 p-5 bg-slate-100/5 border border-white/5 rounded-2xl text-left max-w-md w-full">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <h4 className="text-xs font-black uppercase text-amber-500 tracking-wider">
                    {language === 'uz' ? "Google kirishda muammomi?" : "Проблемы с Google входом?"}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium mt-1.5 leading-relaxed">
                    {language === 'uz' 
                      ? "Google popup darchalari test rejimida (iframe ichida) ochilmasligi mumkin. Siz saytni yangi oynada/tabda ochib tizimga kirishingiz mumkin."
                      : "Всплывающие окна Google могут блокироваться в тестовом iframe. Вы можете открыть сайт в новой вкладке/окне для входа."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="ai-assistant-root">
      {/* Decorative gradient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-gradient-to-tr from-amber-200/20 to-brand-accent/20 rounded-full filter blur-[100px] opacity-70 pointer-events-none -z-10" />

      {/* Page Header */}
      <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-slate-200/60 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200/60 text-amber-600 px-3 py-1.5 rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest mb-3 select-none">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            24/7 Anatomiya AI maslahatchisi
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-brand-primary tracking-tighter uppercase leading-none">
            {t('nav.ai_assistant')}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-3 max-w-2xl font-medium">
            {language === 'uz'
              ? "Darsliklar, atlas, test savollari yoki har qanday anatomik ob'ektlarni tahlil qilish uchun interaktiv chat. Rasm va diagramma yuklab savollar berishingiz mumkin."
              : language === 'ru'
              ? "Интерактивный чат для анализа учебников, атласа, вопросов тестов или любых анатомических объектов. Вы можете прикреплять фотографии и схемы."
              : "An interactive workspace to analyze textbooks, 3D atlas databases, custom quizzes, or organic drawings. Attach screenshots or textbook figures for robust AI feedback."}
          </p>
        </div>

        <button
          onClick={handleClearChat}
          className="self-center sm:self-auto flex items-center gap-2 px-4.5 py-3 border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-50 text-xs font-black uppercase tracking-wider rounded-2xl transition-all shadow-sm active:scale-95 duration-150"
        >
          <Trash2 className="w-4 h-4" />
          {language === 'uz' ? "Suhbatni tozalash" : "Очистить чат"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Useful Info & Suggestions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
            <h2 className="text-xs font-black text-brand-primary uppercase tracking-widest border-b border-slate-100 pb-4 mb-4 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-brand-accent" />
              {language === 'uz' ? "Imkoniyatlari" : "Возможности"}
            </h2>
            
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                    {language === 'uz' ? "Tibbiy Darsliklar" : "Медицинские учебники"}
                  </h3>
                  <p className="text-slate-500 text-[11px] font-medium leading-relaxed mt-1">
                    {language === 'uz'
                      ? "Har qanday mavzuda darslik talablariga mos, lotincha va o'zbekcha terminlar bilan to'liq konspekt oling."
                      : "Получайте структурированные конспекты по любой теме с латинскими и русскими медицинскими терминами."}
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Microscope className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                    {language === 'uz' ? "Rasm va Atlas Tahlili" : "Анализ схем и атласа"}
                  </h3>
                  <p className="text-slate-500 text-[11px] font-medium leading-relaxed mt-1">
                    {language === 'uz'
                      ? "Tushunish qiyin bo'lgan organ skrinshoti yoki rasm-diagrammalarini bering va AI orqali ularga anatomik tahlil oling."
                      : "Загружайте скриншоты анатомических срезов или рисунков органов для мгновенного детального анализа от ИИ."}
                  </p>
                </div>
              </li>

              <li className="flex gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                    {language === 'uz' ? "Testga Tayyorgarlik" : "Подготовка к тестам"}
                  </h3>
                  <p className="text-slate-500 text-[11px] font-medium leading-relaxed mt-1">
                    {language === 'uz'
                      ? "Chalkash test savollarini chatga yo'llab, to'g'ri javoblar va ularning ilmiy sababi bo'yicha tushuntirishlarni oling."
                      : "Отправляйте сложные тестовые вопросы в чат и получайте научное объяснение и правильный ход мысли."}
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-[#0E1624] text-white border border-slate-800 rounded-3xl p-6 shadow-xl select-none relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/10 rounded-full filter blur-2xl translate-x-10 -translate-y-10" />
            <h2 className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
              {language === 'uz' ? "Tezkor Savollar" : "Быстрые вопросы"}
            </h2>

            <div className="space-y-3">
              {suggestions.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(item.prompt);
                    handleSend(item.prompt);
                  }}
                  disabled={loading}
                  className="w-full text-left p-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-200 group flex items-center justify-between text-xs font-bold leading-normal text-slate-200 disabled:opacity-50"
                >
                  <span className="truncate pr-4">{item.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 text-amber-400 transition-all duration-200" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Chat Section */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-slate-200/60 rounded-3xl shadow-sm flex flex-col h-[650px] overflow-hidden">
            {/* Thread Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/50 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-inner">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xs p-0 font-black text-brand-primary tracking-tight uppercase leading-none">Anatomiya AI Ko'makchisi</h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                      <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none">Faol</span>
                    </span>
                    {isPaidUser ? (
                      <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-amber-400 shadow-sm">
                        <Sparkles className="w-2.5 h-2.5" /> Premium Cheksiz
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 font-extrabold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-slate-200">
                        Kunlik limit: {Math.max(0, 5 - dailyCount)} / 5
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                {/* Hands-Free Voice Chat Button */}
                <button
                  type="button"
                  onClick={toggleHandsFree}
                  className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border text-[10px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-95 ${
                    handsFree
                      ? 'bg-gradient-to-r from-amber-500 to-[#EE4B2B] text-white border-red-500/30 shadow-md shadow-red-500/25 animate-pulse'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
                  }`}
                  title={
                    handsFree 
                      ? (language === 'uz' ? "Jarvis ovozli muloqotini yopish" : "Выключить режим Джарвис")
                      : (language === 'uz' ? "Jarvis ovozli rejimi (Meni eshitib, ovoz chiqarib javob berishi - Huddi Jarvis kabi)" : "Голосовой режим Джарвис (Принимает голос и отвечает голосовым ответом)")
                  }
                >
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${handsFree ? 'bg-white' : 'bg-amber-500'}`} />
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${handsFree ? 'bg-white' : 'bg-amber-500'}`} />
                  </span>
                  {handsFree ? (
                    <>
                      <Mic className="w-3.5 h-3.5 shrink-0 animate-bounce" />
                      <span>{language === 'uz' ? "Jarvis: FAOL" : "Джарвис: АКТИВ"}</span>
                    </>
                  ) : (
                    <>
                      <MicOff className="w-3.5 h-3.5 shrink-0" />
                      <span>{language === 'uz' ? "Jarvis Rejimi" : "Режим Джарвис"}</span>
                    </>
                  )}
                </button>

                {messages.length > 1 && (
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-200/50 px-2.5 py-1.5 rounded-xl shrink-0">
                    {messages.length} {language === 'uz' ? "Suhbatlar" : "Параметры"}
                  </span>
                )}
              </div>
            </div>

            {/* Chat Feed */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6 bg-[#FAFBFD]/60" style={{ scrollBehavior: 'smooth' }}>
              <AnimatePresence initial={false}>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                  >
                    {/* Character avatar circle */}
                    <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center border font-black text-[10px] select-none uppercase ${
                      msg.role === 'user' 
                        ? 'bg-slate-800 text-white border-slate-700 shadow-md' 
                        : 'bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-900 border-amber-300 shadow-lg'
                    }`}>
                      {msg.role === 'user' ? (user?.displayName?.charAt(0) || 'U') : 'AI'}
                    </div>

                    <div className="space-y-1">
                      <div className={`rounded-3xl px-5 py-3.5 leading-relaxed text-sm relative border ${
                        msg.role === 'user'
                          ? 'bg-brand-primary text-slate-100 border-slate-800 rounded-tr-none shadow-md shadow-brand-primary/5'
                          : 'bg-white text-slate-800 border-slate-200/70 rounded-tl-none shadow-sm'
                      }`}>
                        
                        {/* Display attached image in chat bubble if any */}
                        {msg.image && (
                          <div className="mb-3 max-w-sm rounded-xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100 max-h-48 flex items-center justify-center">
                            <img src={msg.image} alt="attached visualization" className="max-h-48 max-w-full object-contain" />
                          </div>
                        )}

                        <div className="markdown-body text-xs sm:text-sm space-y-2 font-medium">
                          {msg.role === 'user' ? (
                            <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
                          ) : (
                            <>
                              <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                              {msg.groundingSources && msg.groundingSources.length > 0 && (
                                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
                                  <span className="text-[10px] sm:text-xs font-black text-amber-600 flex items-center gap-1 uppercase tracking-wider">
                                    <Globe className="w-3.5 h-3.5 animate-pulse" />
                                    {language === 'uz' ? "Internet Manbalari (Grounded Search):" : "Источники из интернета:"}
                                  </span>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {msg.groundingSources.map((src, sIdx) => (
                                      <a
                                        key={sIdx}
                                        href={src.uri}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-[11px] font-bold text-slate-700 hover:text-amber-600 transition-all duration-300 shadow-sm"
                                      >
                                        <span className="text-amber-500 font-extrabold">[{sIdx + 1}]</span>
                                        <span className="truncate max-w-[180px]">{src.title}</span>
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>

                        {/* Copy button for model responses */}
                        {msg.role === 'model' && (
                          <button
                            onClick={() => copyToClipboard(msg.parts[0].text, index)}
                            className="absolute top-2.5 right-2.5 p-1.5 opacity-0 hover:opacity-100 group-hover:opacity-100 focus:opacity-100 rounded-lg hover:bg-slate-100 transition-all text-slate-400 hover:text-slate-600 bg-white border border-slate-100 cursor-pointer"
                            title={language === 'uz' ? "Nusxalash" : "Копировать"}
                          >
                            {copiedIndex === index ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>

                      <p className={`text-[10px] text-slate-400 font-bold px-1.5 uppercase tracking-wide flex items-center gap-1.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <span>{msg.role === 'user' ? (user?.displayName || 'Talaba') : 'AI Koʻmakchi'}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span>{msg.timestamp}</span>
                      </p>
                    </div>
                  </motion.div>
                ))}

                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 max-w-[85%] mr-auto"
                  >
                    <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center bg-amber-500 text-slate-900 border border-amber-300 shadow-lg font-black text-[10px]">
                      AI
                    </div>
                    <div className="bg-white border border-slate-200/70 rounded-3xl rounded-tl-none px-6 py-4 mr-auto shadow-sm flex items-center gap-3">
                      <div className="flex space-x-1.5">
                        <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce" />
                      </div>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">AI Oʻylamoqda...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form with attachment drawer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200/50">
              {!isPaidUser && dailyCount >= 5 ? (
                <div className="p-6 bg-slate-900 text-slate-100 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full filter blur-2xl translate-x-8 -translate-y-8 animate-pulse" />
                  <div className="flex flex-col lg:flex-row items-center gap-5 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                      <Lock className="w-6 h-6 text-amber-500" />
                    </div>
                    <div className="flex-grow text-center lg:text-left">
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">
                        {language === 'uz' ? "Kunlik bepul savollar limiti tugadi! 🛑" : "Дневной лимит вопросов исчерпан! 🛑"}
                      </h3>
                      <p className="text-slate-400 text-xs font-semibold mt-1 leading-relaxed">
                        {language === 'uz' 
                          ? "Siz bugungi 5 ta bepul savol limitidan foydalandingiz. Anatomiya AI yordamchisidan doimiy va cheksiz foydalanish uchun semestrlardan birini sotib oling!" 
                          : "Вы использовали 5 бесплатных вопросов на сегодня. Для пожизненного неограниченного доступа к ИИ приобретите любой из семестров!"}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/')}
                      className="w-full lg:w-auto px-5 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 text-xs font-black uppercase tracking-wider rounded-2xl shadow-lg transition-all active:scale-95 duration-150 shrink-0 cursor-pointer"
                    >
                      {language === 'uz' ? "Semestrlarni ko'rish" : "Посмотреть семестры"}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <AnimatePresence>
                    {image && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3 bg-white border border-slate-200 rounded-2xl mb-3 flex items-center justify-between gap-4 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center">
                            <img src={image.data} alt="uploaded preview" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-700 uppercase tracking-wide">
                              {language === 'uz' ? "Rasm ilova qilindi" : "Изображение прикреплено"}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Gemini Vision model tahlili uchun</p>
                          </div>
                        </div>
                        
                        <button
                          onClick={clearImage}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-full transition-all cursor-pointer border border-slate-200/50"
                          title={language === 'uz' ? "O'chirish" : "Удалить"}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Hands-Free Waveform Visualizer */}
                  {handsFree && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-amber-500/5 rounded-2xl border border-amber-500/20 mb-4 animate-fade-in shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 select-none">
                          <span className={`w-1 bg-amber-500 rounded-full transition-all duration-300 ${isListening && !isSpeaking ? 'h-6 animate-bounce' : 'h-2'}`} />
                          <span className={`w-1 bg-[#EE4B2B] rounded-full transition-all duration-300 ${isListening && !isSpeaking ? 'h-4 animate-[bounce_0.8s_infinite_100ms]' : 'h-2'}`} />
                          <span className={`w-1 bg-amber-500 rounded-full transition-all duration-300 ${isListening && !isSpeaking ? 'h-5 animate-[bounce_0.8s_infinite_200ms]' : 'h-2'}`} />
                          <span className={`w-1 bg-[#EE4B2B] rounded-full transition-all duration-300 ${isListening && !isSpeaking ? 'h-3 animate-[bounce_0.8s_infinite_300ms]' : 'h-2'}`} />
                          <span className={`w-1 bg-amber-500 rounded-full transition-all duration-300 ${isListening && !isSpeaking ? 'h-4 animate-[bounce_0.8s_infinite_400ms]' : 'h-2'}`} />
                        </div>
                        <p className="text-xs font-black text-brand-primary uppercase tracking-wider">
                          🤖 <span className="text-amber-600 font-bold">JARVIS CORES SYSTEM:</span>{' '}
                          {isSpeaking 
                            ? (language === 'uz' ? "Profesor AI ma'ruza qilmoqda..." : "Профессор ИИ вещает...")
                            : loading 
                            ? (language === 'uz' ? "Tahlil qilinmoqda..." : "ИИ Думает...")
                            : isListening 
                            ? (language === 'uz' ? "Sizni eshityapman, ser (Gapiring)..." : "Слушаю вас, сэр (Говорите)...")
                            : (language === 'uz' ? "Kutmoqdaman..." : "Ожидание...")}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        {isSpeaking && (
                          <button
                            type="button"
                            onClick={() => {
                              if ('speechSynthesis' in window) {
                                window.speechSynthesis.cancel();
                              }
                              setIsSpeaking(false);
                              if (handsFreeRef.current && !loadingRef.current) {
                                try {
                                  recognitionRef.current?.start();
                                  setIsListening(true);
                                } catch (e) {}
                              }
                            }}
                            className="px-2.5 py-1 text-[9px] font-black uppercase text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm cursor-pointer active:scale-95 transition-all"
                          >
                            {language === 'uz' ? "Ovozni o'chirish" : "Заглушить"}
                          </button>
                        )}
                        
                        <button
                          type="button"
                          onClick={toggleHandsFree}
                          className="px-2.5 py-1 text-[9px] font-black uppercase text-white bg-[#EE4B2B] hover:bg-red-700 rounded-lg shadow-sm cursor-pointer active:scale-95 transition-all border border-red-500/20"
                        >
                          {language === 'uz' ? "Suhbatni yopish" : "Выйти из режима"}
                        </button>
                      </div>
                    </div>
                  )}

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    className="flex items-center gap-3.5 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-inner"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loading}
                      className="w-11 h-11 shrink-0 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 flex items-center justify-center transition-all duration-200 active:scale-95 disabled:opacity-50"
                      title={language === 'uz' ? "Rasm joylash" : "Прикрепить изображение"}
                    >
                      <ImageIcon className="w-5 h-5" />
                    </button>

                    <button
                      type="button"
                      onClick={toggleListening}
                      disabled={loading}
                      className={`w-11 h-11 shrink-0 rounded-xl border flex items-center justify-center transition-all duration-200 active:scale-95 ${
                        isListening
                          ? 'bg-[#EE4B2B]/10 border-red-500/30 text-red-500 animate-bounce'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border-slate-200'
                      }`}
                      title={
                        isListening
                          ? (language === 'uz' ? "Eshitishni to'xtatish" : "Остановить запись")
                          : (language === 'uz' ? "Ovoz orqali so'rash" : "Спросить голосом")
                      }
                    >
                      {isListening ? (
                        <MicOff className="w-5 h-5" />
                      ) : (
                        <Mic className="w-5 h-5" />
                      )}
                    </button>

                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      disabled={loading}
                      placeholder={
                        language === 'uz' 
                          ? "Savolingizni bu yerga yozing (Masalan: 'Osteon tuzilishi qanday', 'Murtak suyaklari')..." 
                          : "Напишите свой вопрос здесь (например: 'как устроена почка', 'названия костей черепа')..."
                      }
                      className="flex-grow bg-transparent text-sm font-medium focus:outline-none focus:ring-0 text-slate-800 outline-none resize-none overflow-y-auto max-h-20 h-10 py-2.5 px-0 leading-relaxed font-sans scrollbar-none"
                      rows={1}
                    />

                    <button
                      type="submit"
                      disabled={loading || (!input.trim() && !image)}
                      className="w-11 h-11 shrink-0 bg-brand-primary text-brand-accent hover:bg-slate-800 hover:text-white rounded-xl flex items-center justify-center transition-all duration-200 shadow-md active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
