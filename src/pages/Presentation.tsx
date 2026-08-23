import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  Cpu, 
  Award, 
  Settings, 
  FileText, 
  Volume2, 
  VolumeX, 
  ArrowLeft, 
  Check, 
  RefreshCw, 
  Compass, 
  BookOpen, 
  Heart,
  Video,
  Copy,
  User,
  ShieldAlert,
  Send,
  Zap,
  CheckCircle,
  HelpCircle,
  Maximize2,
  Minimize2,
  Mic,
  Activity,
  Brain,
  Shield,
  BarChart3,
  Download,
  Share2,
  ExternalLink,
  Flame,
  Globe,
  Radio,
  Clock,
  Laptop
} from 'lucide-react';
import SEO from '../components/SEO';
import { useSettings, normalizeTelegram } from '../hooks/useSettings';

// Interfaces
interface Scene {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  narrativeUz: string;
  narrativeRu: string;
  narrativeEn: string;
  duration: number; // in seconds
  icon: any;
  stats?: { label: string; value: string }[];
}

export default function Presentation() {
  const { settings } = useSettings();
  const telegramBot = normalizeTelegram(settings.telegramBotUsername || '@Medai_support_bot');
  
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [ttsActive, setTtsActive] = useState(false);
  const [ttsLanguage, setTtsLanguage] = useState<'uz' | 'ru' | 'en'>('uz');
  const [activeTab, setActiveTab] = useState<'interactive' | 'storyboard' | 'deck' | 'stats'>('interactive');
  const [copiedText, setCopiedText] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Custom interactive demo states
  const [demoAngle, setDemoAngle] = useState(0);
  const [demoLayer, setDemoLayer] = useState<'skeletal' | 'muscular' | 'vascular' | 'nervous'>('skeletal');
  const [activePin, setActivePin] = useState<string | null>('Os frontale');
  const [aiInput, setAiInput] = useState('');
  const [aiChat, setAiChat] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    { 
      sender: 'ai', 
      text: "Assalomu alaykum! Men BSMI Medical AI konsultantiman. Sizga qaysi anatomik tuzilma, qon tomir anastomozlari yoki klinik holat bo'yicha ma'lumot kerak?", 
      time: 'Hozir' 
    }
  ]);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSuccess, setQuizSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [ecgBpm, setEcgBpm] = useState(72);
  const [activeTabLang, setActiveTabLang] = useState<'uz' | 'ru' | 'en'>('uz');

  // Audio synthesizer refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscRef1 = useRef<OscillatorNode | null>(null);
  const oscRef2 = useRef<OscillatorNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Background visualizer canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const scenes: Scene[] = [
    {
      id: 1,
      badge: "MISSİYA VA VISION",
      title: "KIRISH & INTRO",
      subtitle: "Tibbiy Ta'limda Yangi Davr — BSMI ANATOMY",
      narrativeUz: "Assalomu alaykum va rahmatulloh! Bugun sizlarga zamonaviy tibbiy ta'lim sohasida haqiqiy inqilob yaratayotgan va odam anatomiyasini chuqur o'zlashtirish uchun maxsus ishlab chiqilgan premium 'BSMI ANATOMY' ekotizimini taqdim etamiz. Ushbu platforma Buxoro Davlat Tibbiyot Instituti ilg'or tajribalari, 3D fazoviy modellashtirish, sun'iy intellekt konsultanti va mukammal nazorat tizimini birlashtiradi.",
      narrativeRu: "Здравствуйте! Сегодня мы представляем передовую платформу медицинского образования «BSMI ANATOMY», созданную для глубокого освоения анатомии человека. Платформа объединяет 3D-моделирование, интерактивный атлас, ИИ-ассистента и систему биометрического контроля знаний.",
      narrativeEn: "Welcome everyone! Today, we proudly introduce 'BSMI ANATOMY' — a cutting-edge medical education ecosystem designed for in-depth mastery of human anatomy. It fuses spatial 3D visualization, interactive atlases, clinical correlations, artificial intelligence, and rigorous progress telemetry.",
      duration: 12,
      icon: Heart,
      stats: [
        { label: "O'quv Modullari", value: "3 Semestr / 26+ Mavzu" },
        { label: "Lotincha Terminlar", value: "3,500+ Terminologia" },
        { label: "Anatomik Aniqlik", value: "99.8% Ilmiy Asos" }
      ]
    },
    {
      id: 2,
      badge: "FAZOVIY TAHLIL",
      title: "INTERAKTIV 3D ATLAS & MODELLAR",
      subtitle: "360° Fazoviy Vizualizatsiya va Qatlamli Disseksiya",
      narrativeUz: "Platformaning yuragi — bu interaktiv 3D Modellar bo'limidir. Bu yerda har bir suyak, bo'g'im, mushak va a'zolar tizimini 360 darajada aylantirib, kattalashtirib va qatlamlar kesimida (skelet, mushak, tomir, asab) tahlil qila olasiz. Shuningdek, ma'murlar yangi 3D GLB modellarini bir zumda yuklab, Terminologia Anatomica asosidagi koordinata nuqtalarini bog'lay oladi.",
      narrativeRu: "Сердце платформы — интерактивный 3D модуль. Студенты могут вращать анатомические структуры на 360 градусов, масштабировать и переключаться между скелетным, мышечным, сосудистым и нервным слоями с привязкой латинских терминов.",
      narrativeEn: "The core of the platform is the interactive 3D anatomy engine. Users can rotate anatomical structures 360 degrees, zoom in, and dissect layers across skeletal, muscular, vascular, and nervous systems while exploring coordinate pins mapped to Latin nomenclature.",
      duration: 14,
      icon: Compass,
      stats: [
        { label: "3D Interaktivlik", value: "360° Erkin Aylanish" },
        { label: "Disseksiya Qatlamlari", value: "4 Asosiy Tizim" },
        { label: "Pin Markerlar", value: "Terminologia Anatomica" }
      ]
    },
    {
      id: 3,
      badge: "AMALIYOTGA YO'NALTIRILGAN",
      title: "KLINIK KORRELYATSIYALAR & ATLAS",
      subtitle: "Nazariyadan Haqiqiy Jarrohlik va Patologiyaga",
      narrativeUz: "Bizning Interaktiv Atlasimiz quruq nazariyadan tubdan farq qiladi. Har bir a'zo va tizim haqiqiy klinik holatlar (Clinical Cases), jarrohlik aralashuvlari, rentgen/KT tahlillari va patologik jarayonlar bilan bog'lab tushuntiriladi. Bu esa talabalarda birinchi bosqichdanoq klinik fikrlash va differensial tashxis qo'yish ko'nikmasini shakllantiradi.",
      narrativeRu: "Интерактивный атлас соединяет фундаментальную теорию с клинической практикой. Каждый раздел включает клинические разборы, хирургическую топографию и патологические корреляции, формируя врачебное мышление с первых занятий.",
      narrativeEn: "The interactive Atlas bridges fundamental anatomy with real clinical medicine. Every structure is linked with surgical topography, pathological case studies, and radiologic correlation to build robust diagnostic intuition from day one.",
      duration: 14,
      icon: BookOpen,
      stats: [
        { label: "Klinik Keyslar", value: "50+ Jarrohlik Holatlari" },
        { label: "Ko'rgazmali Rasmlar", value: "Ultra HD Atlas" },
        { label: "Lotincha Lug'at", value: "Ovozli Talaffuz" }
      ]
    },
    {
      id: 4,
      badge: "SUN'IY INTELLEKT",
      title: "MEDAI — ANATOMIYA AI ASSISTENTI",
      subtitle: "24/7 Shaxsiy Tibbiy Ustoz va Ekspert Konsultant",
      narrativeUz: "Platformaga o'rnatilgan ilg'or MedAI sun'iy intellekti talabalarning har qanday savoliga soniyalar ichida xalqaro tibbiy standartlar asosida ilmiy javob beradi. U murakkab lotincha iboralarni tarjima qiladi, qon aylanish doiralari va innervatsiyani sxematik tushuntiradi hamda talabaga individual o'qitish dasturini tuzib beradi.",
      narrativeRu: "Встроенный ИИ-помощник MedAI отвечает на сложные анатомические вопросы за миллисекунды. Он объясняет иннервацию, анастомозы, переводит термины и генерирует персонализированные учебные планы 24/7.",
      narrativeEn: "The integrated MedAI Assistant serves as a 24/7 personalized medical mentor. Powered by state-of-the-art AI, it synthesizes complex nerve pathways, vascular anastomoses, and clinical explanations with surgical clarity in real time.",
      duration: 13,
      icon: Cpu,
      stats: [
        { label: "Javob Tezligi", value: "< 1.2 soniya" },
        { label: "Tillar", value: "O'zbek, Rus, Ingliz, Lotin" },
        { label: "Tibbiy Qamrov", value: "Klinik & Normal Anatomiya" }
      ]
    },
    {
      id: 5,
      badge: "GAMIFIKATSIYA & BAHOLASH",
      title: "ADAPTIV TESTLAR VA IBN SINO REYTINGI",
      subtitle: "Bilimlarni Mustahkamlash, Motivatsiya va Unvonlar",
      narrativeUz: "Har bir mavzu yakunida talabalar ko'p darajali testlarni topshiradilar. Tizim avtomatik tarzda tahlil olib borib, talabaning unvonini (masalan, 'Ibn Sino Izdoshi'), umumiy reytingdagi o'rnini va akademik guruh ko'rsatkichlarini real vaqtda yangilaydi. Bu o'rganish jarayonini hayajonli va raqobatbardosh qiladi.",
      narrativeRu: "По окончании тем студенты проходят адаптивные тесты. Система автоматически начисляет баллы, присваивает почетные ранги («Последователь Авиценны») и ведет общеинститутский академический рейтинг.",
      narrativeEn: "After each lecture, students engage in adaptive assessments. The system tracks mastery metrics in real time, granting prestigious academic tiers like 'Disciple of Ibn Sina' and powering institutional leaderboards.",
      duration: 13,
      icon: Award,
      stats: [
        { label: "Savollar Bazasi", value: "3,000+ Test Savollari" },
        { label: "Reyting Tizimi", value: "Guruh & Shaxsiy Top-100" },
        { label: "Rag'batlantirish", value: "Unvonlar & Sertifikatlar" }
      ]
    },
    {
      id: 6,
      badge: "XAVFSIZLIK & NAZORAT",
      title: "SUPER ADMIN VA BIOMETRIK FACE ID",
      subtitle: "Mutlaq Xavfsizlik, Audit Telemetriyasi va Avtomatika",
      narrativeUz: "Sayt xavfsizligi va ma'murlar boshqaruvi eng yuqori jahon standartlariga mos keladi. Tizimga kirishda va imtihonlarni topshirishda Biometrik Face ID verifikatsiyasi amalga oshiriladi. Super Admin esa talabalar davomati, to'lovlar holati, testlar statistikasi va kontentni markazlashgan boshqaruv xonasi orqali to'liq nazorat qiladi.",
      narrativeRu: "Безопасность платформы построена на биометрической верификации Face ID. Центр управления Super Admin предоставляет исчерпывающую аналитику успеваемости, платежей и посещаемости в реальном времени.",
      narrativeEn: "Enterprise security and governance are central to BSMI ANATOMY. Biometric Face ID protects testing integrity and prevents unauthorized sharing, while the Super Admin suite provides deep telemetry across users, finances, and curricula.",
      duration: 14,
      icon: Shield,
      stats: [
        { label: "Biometrik Himoya", value: "Face ID Neural Scan" },
        { label: "Audit Telemetriya", value: "100% Real-vaqt Logs" },
        { label: "Boshqaruv", value: "To'liq Super Admin Suite" }
      ]
    },
    {
      id: 7,
      badge: "HAMKORLIK VA BOG'LANISH",
      title: "XULOSA & RASMIY INTEGRATSIYA",
      subtitle: "Kelajak Tibbiyotini Birgalikda Rivojlantiramiz",
      narrativeUz: "BSMI ANATOMY — bu faqat dasturiy ta'minot emas, bu O'zbekiston tibbiy ta'limining yangi bosqichidir. Barcha savollar, hamkorlik takliflari va qo'llab-quvvatlash uchun bizning rasmiy Telegram portalimiz va botimiz (@Medai_support_bot) doim xizmatingizda. Hoziroq tizimga qo'shiling!",
      narrativeRu: "BSMI ANATOMY — это фундамент будущего медицинского образования. Для вопросов и сотрудничества используйте наш официальный Telegram-канал поддержки (@Medai_support_bot). Добро пожаловать!",
      narrativeEn: "BSMI ANATOMY is more than software — it is the cornerstone of 21st-century medical pedagogy. For institutional partnerships and instant support, connect directly via our integrated Telegram bot (@Medai_support_bot). Join us today!",
      duration: 12,
      icon: Zap,
      stats: [
        { label: "Rasmiy Bot", value: telegramBot },
        { label: "Qo'llab-quvvatlash", value: "24/7 Telegram Ko'mak" },
        { label: "Mavjudlik", value: "Web, Mobil & Planshet" }
      ]
    }
  ];

  const currentScene = scenes[currentSceneIdx];

  // Auto progression of scenes
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setTimeout(() => {
        if (currentSceneIdx < scenes.length - 1) {
          setCurrentSceneIdx(prev => prev + 1);
        } else {
          setCurrentSceneIdx(0);
        }
      }, currentScene.duration * 1000);
    }
    return () => clearTimeout(timer);
  }, [currentSceneIdx, isPlaying, currentScene.duration]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        setCurrentSceneIdx(prev => (prev < scenes.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentSceneIdx(prev => (prev > 0 ? prev - 1 : scenes.length - 1));
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreen();
      } else if (e.key.toLowerCase() === 'p') {
        setIsPlaying(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scenes.length]);

  // Demo 3D rotating angle simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setDemoAngle(prev => (prev + 1.2) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Pulse simulation for heart rate
  useEffect(() => {
    const interval = setInterval(() => {
      setEcgBpm(prev => Math.floor(70 + Math.random() * 6));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Background particle & neural mesh animation inside canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: Array<{ x: number; y: number; r: number; speedX: number; speedY: number; opacity: number; color: string }> = [];
    const particleCount = 70;
    const colors = ['#38bdf8', '#818cf8', '#34d399', '#f59e0b'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 1,
        speedX: Math.random() * 0.4 - 0.2,
        speedY: Math.random() * 0.4 - 0.2,
        opacity: Math.random() * 0.45 + 0.15,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const resizeObserver = new ResizeObserver(() => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    });
    resizeObserver.observe(canvas);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint anatomical grid lines
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.25)';
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      particles.forEach((p, idx) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Connect near particles with neural fibers
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${(1 - dist / 110) * 0.15})`;
            ctx.lineWidth = 0.7;
            ctx.shadowBlur = 0;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, []);

  // Web Audio API Ambient Sound Synthesizer
  const startSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      filterRef.current = ctx.createBiquadFilter();
      filterRef.current.type = 'lowpass';
      filterRef.current.frequency.value = 650;

      gainRef.current = ctx.createGain();
      gainRef.current.gain.setValueAtTime(0, ctx.currentTime);
      gainRef.current.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 1.5);

      oscRef1.current = ctx.createOscillator();
      oscRef1.current.type = 'triangle';
      oscRef1.current.frequency.value = 110; // A2 note

      oscRef2.current = ctx.createOscillator();
      oscRef2.current.type = 'sine';
      oscRef2.current.frequency.value = 164.81; // E3 note

      oscRef1.current.connect(filterRef.current);
      oscRef2.current.connect(filterRef.current);
      filterRef.current.connect(gainRef.current);
      gainRef.current.connect(ctx.destination);

      oscRef1.current.start();
      oscRef2.current.start();
      setSoundEnabled(true);
    } catch (e) {
      console.warn("AudioContext init warning:", e);
    }
  };

  const stopSound = () => {
    if (gainRef.current && audioContextRef.current) {
      gainRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.5);
      setTimeout(() => {
        try {
          oscRef1.current?.stop();
          oscRef2.current?.stop();
          oscRef1.current?.disconnect();
          oscRef2.current?.disconnect();
        } catch (e) {}
        setSoundEnabled(false);
      }, 600);
    }
  };

  const toggleSound = () => {
    if (soundEnabled) {
      stopSound();
    } else {
      startSound();
    }
  };

  // Real SpeechSynthesis Text-to-Speech Engine
  const speakCurrentScene = () => {
    if (!('speechSynthesis' in window)) {
      alert("Kechirasiz, brauzeringiz ovozli suxandon (SpeechSynthesis) funksiyasini qo'llab-quvvatlamaydi.");
      return;
    }

    if (ttsActive) {
      window.speechSynthesis.cancel();
      setTtsActive(false);
      return;
    }

    window.speechSynthesis.cancel();

    let textToSpeak = currentScene.narrativeUz;
    let langCode = 'uz-UZ';

    if (ttsLanguage === 'ru') {
      textToSpeak = currentScene.narrativeRu;
      langCode = 'ru-RU';
    } else if (ttsLanguage === 'en') {
      textToSpeak = currentScene.narrativeEn;
      langCode = 'en-US';
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = langCode;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setTtsActive(true);
    utterance.onend = () => setTtsActive(false);
    utterance.onerror = () => setTtsActive(false);

    window.speechSynthesis.speak(utterance);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      try {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
        oscRef1.current?.stop();
        oscRef2.current?.stop();
        audioContextRef.current?.close();
      } catch (e) {}
    };
  }, []);

  // Storyboard copy utility
  const copyStoryboard = () => {
    const fullText = `
====================================================================
BSMI ANATOMY — ULTRA-PROFESSIONAL TAQDIMOT & VIDEO SSENARIY
====================================================================
MAQSAD: Buxoro Davlat Tibbiyot Instituti va Xalqaro Tibbiy Standartlar Asosida
DAVOMIYLIGI: 1 daqiqa 30 soniya
OHANG: Ilmiy, nufuzli, ishonchli va jozibador professional suxandon
MUALLIF & PORTAL: BSMI ANATOMY (${telegramBot})

${scenes.map((s, idx) => `
[${idx + 1}-SAHNA: ${s.title} — ${s.subtitle}]
Davomiyligi: ${s.duration} soniya | Bo'lim: ${s.badge}
--------------------------------------------------------------------
🎙️ Suxandon (O'zbekcha): "${s.narrativeUz}"
🎙️ Диктор (Русский): "${s.narrativeRu}"
🎙️ Narrator (English): "${s.narrativeEn}"
⭐ Vizual Reja: 3D modellar, qatlamli anatomik kesmalar va ekrandagi ko'rsatkichlar.
`).join('\n')}
====================================================================
`.trim();

    navigator.clipboard.writeText(fullText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Simulated AI message sending
  const handleSendAiMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userMsg = aiInput;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAiChat(prev => [...prev, { sender: 'user', text: userMsg, time: nowTime }]);
    setAiInput('');

    setTimeout(() => {
      let aiText = "Tushunarli! Ushbu anatomik tuzilma Terminologia Anatomica va klinik qo'llanmalar bilan sinxronlashtirildi.";
      const low = userMsg.toLowerCase();
      if (low.includes('yurak') || low.includes('cor') || low.includes('serdse')) {
        aiText = "Yurak (lot. Cor) — ko'krak qafasining o'rta ko'ks oralig'ida (mediastinum medium) joylashgan 4 kamerali muskul a'zosi. O'ng/chap bo'lmachalar (atrium) va o'ng/chap qorinchalardan (ventriculus) iborat bo'lib, klapan apparati (mitral, trikuspidal, aortal, o'pka) bilan ta'minlangan.";
      } else if (low.includes('suyak') || low.includes('os') || low.includes('skelet')) {
        aiText = "Odam skeleti (Skeleton humanum) 206 dan ortiq suyaklardan tashkil topgan. Ular tayanch-harakat, kalla va ko'krak a'zolarini himoya qilish, mineral almashinuvi hamda gemopoez (qon yaratish) vazifalarini bajaradi.";
      } else if (low.includes('miya') || low.includes('nerv') || low.includes('asab')) {
        aiText = "Markaziy asab tizimi (Systema nervosum centrale) bosh miya (encephalon) va orqa miyadan (medulla spinalis) iborat. 12 juft kalla nervlari (nervi craniales) va 31 juft orqa miya nervlari butun tana innervatsiyasini amalga oshiradi.";
      }
      setAiChat(prev => [...prev, { sender: 'ai', text: aiText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 800);
  };

  // Simulated Quiz validation
  const handleSelectQuizAnswer = (idx: number) => {
    setQuizAnswer(idx);
    if (idx === 1) {
      setQuizSuccess(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      setQuizSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden selection:bg-brand-accent/30 selection:text-white font-sans">
      <SEO 
        title="Professional Interaktiv Taqdimot & Vision | BSMI Anatomy"
        description="BSMI Anatomy — Yangi avlod tibbiy ta'lim platformasining professional taqdimot laboratoriyasi, 3D atlas namoyishi, video ssenariysi va AI ekspertizasi."
        keywords="bsmi taqdimot, anatomiya 3d taqdimot, tibbiyot innovatsiya, medical keynote, uzbekistan anatomy"
      />

      {/* Dynamic Background Visualizer Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />
      
      {/* High-tech atmospheric glow spots */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-cyan-600/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[550px] h-[550px] rounded-full bg-indigo-600/10 blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-emerald-600/5 blur-[160px] pointer-events-none" />

      {/* Professional Top Navigation Header */}
      <header className="relative z-20 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link 
            to="/" 
            className="p-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all text-slate-400 hover:text-white shadow-sm flex items-center gap-2 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Bosh Sahifaga</span>
          </Link>
          
          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <h1 className="text-xs sm:text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                BSMI ANATOMY <span className="text-brand-accent">KEYNOTE LAB</span>
              </h1>
            </div>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider flex items-center gap-1.5">
              <span>Buxoro Davlat Tibbiyot Instituti</span> • 
              <span className="text-emerald-400 font-mono flex items-center gap-1">
                <Activity className="w-3 h-3 animate-pulse" /> {ecgBpm} BPM Live
              </span>
            </p>
          </div>
        </div>

        {/* Center Mode Switchers */}
        <div className="bg-slate-900/90 p-1 rounded-2xl border border-slate-800 flex items-center gap-1 shadow-inner">
          <button
            onClick={() => setActiveTab('interactive')}
            className={`px-3.5 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${activeTab === 'interactive' ? 'bg-brand-accent text-brand-primary shadow-md shadow-brand-accent/25' : 'text-slate-400 hover:text-white'}`}
          >
            <Video className="w-3.5 h-3.5" /> Interaktiv Namoyish
          </button>
          <button
            onClick={() => setActiveTab('storyboard')}
            className={`px-3.5 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${activeTab === 'storyboard' ? 'bg-brand-accent text-brand-primary shadow-md shadow-brand-accent/25' : 'text-slate-400 hover:text-white'}`}
          >
            <FileText className="w-3.5 h-3.5" /> Ssenariy & Storyboard
          </button>
          <button
            onClick={() => setActiveTab('deck')}
            className={`px-3.5 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${activeTab === 'deck' ? 'bg-brand-accent text-brand-primary shadow-md shadow-brand-accent/25' : 'text-slate-400 hover:text-white'}`}
          >
            <Layers className="w-3.5 h-3.5" /> Slaydlar Jamlanmasi
          </button>
        </div>

        {/* Right Action Utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* TTS Suxandon Voice Trigger */}
          <button
            onClick={speakCurrentScene}
            className={`px-3 py-2 rounded-xl border transition-all flex items-center gap-2 text-xs font-black uppercase tracking-wider ${ttsActive ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 animate-pulse' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'}`}
            title="Suxandon ovozida tinglash (Text-to-Speech)"
          >
            <Mic className={`w-3.5 h-3.5 ${ttsActive ? 'text-emerald-400 animate-bounce' : 'text-slate-400'}`} />
            <span className="hidden md:inline">{ttsActive ? "Suxandon Gapirmoqda" : "Suxandonni Tinglash"}</span>
          </button>

          {/* Synthesizer Ambient Sound */}
          <button
            onClick={toggleSound}
            className={`p-2.5 rounded-xl border transition-all text-xs font-bold ${soundEnabled ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'}`}
            title="Sintezator fon musiqasini yoqish/o'chirish"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Fullscreen Trigger */}
          <button
            onClick={toggleFullscreen}
            className="p-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all"
            title="To'liq ekranga o'tish (F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Presentation View Area */}
      <main className="flex-grow relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col justify-between gap-6">
        <AnimatePresence mode="wait">
          {activeTab === 'interactive' && (
            <motion.div 
              key="interactive-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-grow"
            >
              {/* Left Column: Interactive Theater Display (8 cols) */}
              <div className="lg:col-span-8 flex flex-col gap-4">
                <div className="flex-grow bg-slate-950/70 border border-slate-800/80 rounded-[32px] p-6 sm:p-8 relative flex flex-col justify-between overflow-hidden shadow-2xl backdrop-blur-xl group min-h-[460px]">
                  {/* Subtle inner grid & glow */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/15 via-transparent to-transparent pointer-events-none" />

                  {/* Corner aesthetic brackets */}
                  <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-brand-accent/40 rounded-tl pointer-events-none" />
                  <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-brand-accent/40 rounded-tr pointer-events-none" />
                  <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-brand-accent/40 rounded-bl pointer-events-none" />
                  <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-brand-accent/40 rounded-br pointer-events-none" />

                  {/* Scene Status Bar */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 relative z-10">
                    <div className="flex items-center gap-2.5">
                      <span className="px-3 py-1 bg-brand-accent/10 border border-brand-accent/30 rounded-xl text-[10px] font-black tracking-widest text-brand-accent uppercase">
                        {currentScene.badge}
                      </span>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                        SAHNA {currentScene.id} / {scenes.length}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {isPlaying && (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-lg text-[9px] font-black tracking-widest uppercase animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          AUTOPLAY ON
                        </span>
                      )}
                      <span className="text-xs font-mono font-bold text-slate-500 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800">
                        {currentScene.duration}s
                      </span>
                    </div>
                  </div>

                  {/* Center Stage Interactive Dynamic Showcase */}
                  <div className="flex-grow flex items-center justify-center py-6 sm:py-8 relative z-10">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentScene.id}
                        initial={{ opacity: 0, y: 15, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -15, scale: 0.96 }}
                        transition={{ duration: 0.4 }}
                        className="w-full flex flex-col items-center text-center"
                      >
                        {/* Scene 1: Introduction */}
                        {currentScene.id === 1 && (
                          <div className="space-y-6 max-w-lg">
                            <motion.div 
                              animate={{ y: [0, -8, 0], rotate: [0, 2, -2, 0] }}
                              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 border-2 border-brand-accent/50 flex items-center justify-center shadow-2xl shadow-brand-accent/20 mx-auto relative group"
                            >
                              <div className="absolute inset-0 bg-brand-accent/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
                              <Heart className="w-12 h-12 text-[#FFD700] relative z-10 animate-pulse" />
                            </motion.div>
                            
                            <div>
                              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white uppercase bg-gradient-to-r from-white via-slate-100 to-brand-accent bg-clip-text text-transparent">
                                BSMI ANATOMY
                              </h2>
                              <p className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] text-brand-accent mt-2">
                                KELAJAK SHIFOKORLARI UCHUN YUQORI DARAJALI PLATFORMA
                              </p>
                            </div>

                            {/* Key Stats Bar */}
                            <div className="grid grid-cols-3 gap-2 pt-2">
                              {currentScene.stats?.map((stat, i) => (
                                <div key={i} className="bg-slate-900/80 border border-slate-800/80 p-2.5 rounded-2xl">
                                  <div className="text-xs sm:text-sm font-black text-white">{stat.value}</div>
                                  <div className="text-[9px] font-bold text-slate-400 uppercase">{stat.label}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Scene 2: 3D Models & Layers */}
                        {currentScene.id === 2 && (
                          <div className="w-full max-w-lg flex flex-col items-center gap-5">
                            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl border border-slate-800 bg-slate-950/90 flex items-center justify-center relative shadow-2xl overflow-hidden group">
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/15 via-transparent to-transparent" />
                              
                              {/* 3D Rotating Anatomical Simulation */}
                              <motion.div 
                                style={{ rotateY: demoAngle }}
                                className="w-32 h-32 border-2 border-brand-accent/40 rounded-2xl relative flex items-center justify-center shadow-lg"
                              >
                                <div className="absolute inset-0 border border-indigo-500/30 rounded-full animate-ping opacity-30" />
                                <Brain className="w-14 h-14 text-brand-accent" />
                                
                                {/* Anatomical Pin Coordinates */}
                                <button 
                                  onClick={() => setActivePin('Os frontale')}
                                  className="absolute -top-2 left-2 bg-brand-accent text-brand-primary px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider shadow"
                                >
                                  Os frontale
                                </button>
                                <button 
                                  onClick={() => setActivePin('Os parietale')}
                                  className="absolute bottom-2 -right-2 bg-indigo-500 text-white px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider shadow"
                                >
                                  Os parietale
                                </button>
                              </motion.div>

                              <div className="absolute bottom-2 inset-x-2 bg-slate-900/90 py-1 px-2 rounded-xl text-[9px] font-bold text-slate-300 border border-slate-800/80">
                                Tanlangan nuqta: <span className="text-brand-accent">{activePin}</span>
                              </div>
                            </div>

                            {/* Layer Selectors */}
                            <div className="flex flex-wrap justify-center gap-2">
                              {[
                                { id: 'skeletal', label: 'Suyaklar', color: 'text-amber-400' },
                                { id: 'muscular', label: 'Mushaklar', color: 'text-rose-400' },
                                { id: 'vascular', label: 'Qon tomirlar', color: 'text-red-400' },
                                { id: 'nervous', label: 'Asab tizimi', color: 'text-cyan-400' }
                              ].map((l) => (
                                <button
                                  key={l.id}
                                  onClick={() => setDemoLayer(l.id as any)}
                                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${demoLayer === l.id ? 'bg-brand-accent text-brand-primary border-brand-accent shadow-md' : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'}`}
                                >
                                  {l.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Scene 3: Clinical Cases & Atlas */}
                        {currentScene.id === 3 && (
                          <div className="w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex flex-col justify-between">
                              <div>
                                <span className="text-[9px] font-black text-brand-accent uppercase tracking-widest block mb-2">
                                  Topografik Anatomiya
                                </span>
                                <h4 className="text-xs font-black text-white">Trigonum caroticum (Uyqu uchburchagi)</h4>
                                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                                  A. carotis communis, V. jugularis interna va N. vagus joylashuvi va jarrohlik kesmalari.
                                </p>
                              </div>
                              <div className="mt-3 py-1.5 px-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                                <CheckCircle className="w-3 h-3" /> Terminologia tasdiqlangan
                              </div>
                            </div>

                            <div className="bg-slate-900/80 p-4 rounded-2xl border border-indigo-900/50 flex flex-col justify-between">
                              <div>
                                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block mb-2">
                                  Klinik Patologiya
                                </span>
                                <h4 className="text-xs font-black text-white">Yurak Ishemiyasi & Koronarogragrafiya</h4>
                                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                                  Ramus interventricularis anterior trombozi oqibatida chap qorincha old devori infarkti.
                                </p>
                              </div>
                              <div className="mt-3 py-1.5 px-2.5 bg-indigo-950/50 rounded-xl border border-indigo-800/40 text-[10px] font-mono text-indigo-300 flex items-center gap-1.5">
                                <Sparkles className="w-3 h-3 text-brand-accent" /> Jarrohlikka tayyorgarlik
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Scene 4: MedAI Assistant */}
                        {currentScene.id === 4 && (
                          <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-col gap-3 text-left shadow-2xl">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-xl bg-brand-accent/20 border border-brand-accent/30 flex items-center justify-center text-brand-accent">
                                  <Cpu className="w-4 h-4" />
                                </div>
                                <div>
                                  <span className="text-[11px] font-black uppercase tracking-wider text-white block">MedAI Anatomiya Konsultanti</span>
                                  <span className="text-[9px] text-emerald-400 font-bold">24/7 Aktiv • 100% Tibbiy Aniq</span>
                                </div>
                              </div>
                              <span className="text-[9px] font-mono bg-slate-950 px-2 py-0.5 rounded text-slate-400">Gemini 2.5 Flash</span>
                            </div>

                            <div className="h-32 sm:h-36 overflow-y-auto space-y-2.5 pr-2 scrollbar-thin">
                              {aiChat.map((msg, i) => (
                                <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                  <span className="text-[8px] font-bold text-slate-500 mb-0.5">
                                    {msg.sender === 'user' ? 'Talaba' : 'MedAI'} • {msg.time}
                                  </span>
                                  <div className={`p-2.5 rounded-2xl text-[11px] leading-relaxed max-w-[88%] ${msg.sender === 'user' ? 'bg-brand-accent text-brand-primary rounded-tr-none font-bold' : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none font-medium'}`}>
                                    {msg.text}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <form onSubmit={handleSendAiMessage} className="flex gap-2 pt-1 border-t border-slate-800">
                              <input 
                                type="text"
                                value={aiInput}
                                onChange={e => setAiInput(e.target.value)}
                                placeholder="Savol bering: masalan, Yurak anatomiyasi, Os frontale..."
                                className="flex-grow p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-white focus:border-brand-accent outline-none"
                              />
                              <button 
                                type="submit" 
                                className="px-4 py-2.5 bg-brand-accent hover:bg-brand-accent/90 text-brand-primary rounded-xl font-black text-xs transition-all shadow-md"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                            </form>
                          </div>
                        )}

                        {/* Scene 5: Quiz & Leaderboard */}
                        {currentScene.id === 5 && (
                          <div className="w-full max-w-lg bg-slate-900/80 border border-slate-800 rounded-3xl p-5 text-left relative overflow-hidden shadow-2xl">
                            {showConfetti && (
                              <div className="absolute inset-0 bg-brand-accent/10 backdrop-blur-xs flex items-center justify-center z-20 animate-fade-in pointer-events-none">
                                <div className="text-center bg-slate-900 border border-brand-accent/50 p-4 rounded-2xl shadow-2xl">
                                  <Award className="w-10 h-10 text-[#FFD700] mx-auto mb-1 animate-bounce" />
                                  <p className="text-xs font-black uppercase tracking-widest text-brand-accent">+25 XP • "Ibn Sino Izdoshi" Unvoni Oshdi!</p>
                                </div>
                              </div>
                            )}

                            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                                Savol: Yurak klapanlaridan qaysi biri chap bo'lmacha va qorincha o'rtasida?
                              </span>
                              <span className="text-[10px] font-mono text-brand-accent font-black">Ball: +25</span>
                            </div>

                            <div className="space-y-2">
                              {[
                                { id: 0, text: "A) Valva tricuspidalis (Uch tabaqali klapan)" },
                                { id: 1, text: "B) Valva bicuspidalis / mitralis (Ikki tabaqali klapan) — TO'G'RI" },
                                { id: 2, text: "C) Valva aortae (Aorta klapani)" }
                              ].map((opt) => (
                                <button
                                  key={opt.id}
                                  onClick={() => handleSelectQuizAnswer(opt.id)}
                                  className={`w-full p-3 rounded-xl border text-xs font-bold text-left transition-all ${quizAnswer === opt.id ? (opt.id === 1 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300' : 'bg-rose-950/60 border-rose-500 text-rose-300') : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'}`}
                                >
                                  {opt.text}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Scene 6: Super Admin & Security */}
                        {currentScene.id === 6 && (
                          <div className="w-full max-w-xl space-y-4">
                            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 text-left flex items-center gap-5 shadow-2xl">
                              <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center shrink-0">
                                <Shield className="w-7 h-7 text-brand-accent animate-pulse" />
                              </div>
                              <div>
                                <h4 className="text-sm font-black uppercase text-white tracking-wide">Biometrik Face ID & Super Admin Suite</h4>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                  Har bir darslik va test sessiyasi neyron tarmoq yordamida yuz orqali verifikatsiya qilinadi. Qalloblik va akkaunt almashish ehtimoli nolga teng.
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                              <div className="bg-slate-900/70 p-3 rounded-2xl border border-slate-800 text-center">
                                <span className="text-[9px] font-black text-slate-500 uppercase block mb-1">Face Scanner</span>
                                <span className="text-xs font-black text-emerald-400">99.9% Aniq</span>
                              </div>
                              <div className="bg-slate-900/70 p-3 rounded-2xl border border-slate-800 text-center">
                                <span className="text-[9px] font-black text-slate-500 uppercase block mb-1">Audit Telemetriya</span>
                                <span className="text-xs font-black text-brand-accent">24/7 Faol</span>
                              </div>
                              <div className="bg-slate-900/70 p-3 rounded-2xl border border-slate-800 text-center">
                                <span className="text-[9px] font-black text-slate-500 uppercase block mb-1">Bulutli Baza</span>
                                <span className="text-xs font-black text-white">Firestore Realtime</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Scene 7: Outro & Collaboration */}
                        {currentScene.id === 7 && (
                          <div className="w-full max-w-lg space-y-6">
                            <div className="w-16 h-16 rounded-3xl bg-brand-accent/20 border-2 border-brand-accent/40 flex items-center justify-center mx-auto text-brand-accent shadow-2xl">
                              <Zap className="w-8 h-8 animate-bounce" />
                            </div>
                            
                            <div>
                              <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                                TIBBIY TA'LIM KELAJAGIGA XUSH KELIBSIZ!
                              </h3>
                              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                                BSMI ANATOMY platformasi bilan talabalaringiz o'zlashtirishini yangi cho'qqiga olib chiqing.
                              </p>
                            </div>

                            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3 text-left">
                                <div className="p-2.5 bg-sky-500/10 rounded-2xl text-sky-400 border border-sky-500/20">
                                  <Radio className="w-5 h-5" />
                                </div>
                                <div>
                                  <span className="text-[9px] font-bold text-slate-500 uppercase block tracking-widest">Rasmiy Telegram Portali</span>
                                  <span className="text-xs font-black text-white">{telegramBot}</span>
                                </div>
                              </div>

                              <a 
                                href={`https://t.me/${telegramBot.replace('@', '').trim()}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-5 py-2.5 bg-brand-accent hover:bg-brand-accent/90 text-brand-primary text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-brand-accent/20"
                              >
                                Bog'lanish
                              </a>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Narration Display Subtitles Box */}
                  <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800/80 relative z-10 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-3.5 h-3.5 text-brand-accent" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                          Suxandon Ovozli Matni (Audio Narration):
                        </span>
                      </div>

                      {/* Language toggles for subtitles */}
                      <div className="flex items-center gap-1 bg-slate-950 px-1.5 py-0.5 rounded-lg border border-slate-800">
                        {(['uz', 'ru', 'en'] as const).map((lang) => (
                          <button
                            key={lang}
                            onClick={() => {
                              setActiveTabLang(lang);
                              setTtsLanguage(lang);
                            }}
                            className={`px-2 py-0.5 rounded text-[9px] font-black uppercase transition-all ${activeTabLang === lang ? 'bg-brand-accent text-brand-primary' : 'text-slate-500 hover:text-white'}`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-100 font-semibold leading-relaxed">
                      {activeTabLang === 'uz' && currentScene.narrativeUz}
                      {activeTabLang === 'ru' && currentScene.narrativeRu}
                      {activeTabLang === 'en' && currentScene.narrativeEn}
                    </p>
                  </div>

                  {/* Scene Timeline Progress Bar */}
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-4 relative z-10 border border-slate-800">
                    <motion.div 
                      key={currentScene.id}
                      initial={{ width: "0%" }}
                      animate={isPlaying ? { width: "100%" } : { width: "0%" }}
                      transition={isPlaying ? { duration: currentScene.duration, ease: "linear" } : { duration: 0 }}
                      className="bg-gradient-to-r from-brand-accent to-emerald-400 h-full shadow-[0_0_12px_rgba(56,189,248,0.8)]" 
                    />
                  </div>
                </div>

                {/* Theater Control Deck */}
                <div className="bg-slate-950/70 border border-slate-800/80 p-3.5 sm:p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 backdrop-blur-xl">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setCurrentSceneIdx(prev => (prev > 0 ? prev - 1 : scenes.length - 1))}
                      className="p-2.5 sm:p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all text-slate-300 hover:text-white"
                      title="Oldingi sahna (←)"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="px-5 sm:px-6 py-2.5 sm:py-3 bg-brand-accent hover:bg-brand-accent/90 text-brand-primary rounded-xl transition-all font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-brand-accent/20"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isPlaying ? "Pauza" : "Avto-Namoyish"}</span>
                    </button>

                    <button 
                      onClick={() => setCurrentSceneIdx(prev => (prev < scenes.length - 1 ? prev + 1 : 0))}
                      className="p-2.5 sm:p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-all text-slate-300 hover:text-white"
                      title="Keyingi sahna (→)"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Scene Thumb Dots */}
                  <div className="flex items-center gap-1.5">
                    {scenes.map((scene, idx) => (
                      <button
                        key={scene.id}
                        onClick={() => setCurrentSceneIdx(idx)}
                        className={`h-2.5 rounded-full transition-all ${currentSceneIdx === idx ? 'bg-brand-accent w-7 shadow-[0_0_8px_rgba(56,189,248,0.7)]' : 'bg-slate-800 hover:bg-slate-700 w-2.5'}`}
                        title={`${scene.id}-Sahna: ${scene.title}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Keynote Telemetry & Interactive Guide (4 cols) */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-[32px] p-6 flex flex-col justify-between h-full relative overflow-hidden backdrop-blur-xl shadow-2xl">
                  <div className="space-y-5">
                    <div className="border-b border-slate-800 pb-4">
                      <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest">Sahna Tavsifi</span>
                      <h3 className="text-base font-black text-white uppercase tracking-tight mt-1">{currentScene.title}</h3>
                      <p className="text-xs text-slate-400 font-bold mt-1">{currentScene.subtitle}</p>
                    </div>

                    {/* Dynamic Stats for current scene */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Asosiy Ko'rsatkichlar:</span>
                      {currentScene.stats?.map((st, i) => (
                        <div key={i} className="flex items-center justify-between bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                          <span className="text-xs text-slate-400 font-medium">{st.label}</span>
                          <span className="text-xs font-black text-white font-mono">{st.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Presenter's Pro Tips */}
                    <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 space-y-2">
                      <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" /> Taqdimotchi Maslahati:
                      </span>
                      <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                        Ushbu sahna interfeysini to'liq ekranda (F) ochib, bevosita auditoriyaga jonli demonstratsiya qiling yoki OBS orqali yuqori sifatli video yozib oling.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800 space-y-2">
                    <button
                      onClick={copyStoryboard}
                      className="w-full py-3 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copiedText ? "Nusxalandi!" : "Ssenariyni Ko'chirish"}</span>
                    </button>
                    <p className="text-[10px] text-slate-500 text-center font-semibold">Tugmalar: ← Chap / → O'ng / F To'liq Ekran / P Play</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Storyboard View Tab */}
          {activeTab === 'storyboard' && (
            <motion.div
              key="storyboard-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-slate-950/70 border border-slate-800/80 rounded-[32px] p-6 sm:p-8 max-w-5xl mx-auto w-full relative shadow-2xl backdrop-blur-xl"
            >
              <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-6 mb-6 gap-4">
                <div>
                  <span className="px-3 py-1 bg-brand-accent/10 border border-brand-accent/30 rounded-xl text-[10px] font-black tracking-widest text-brand-accent uppercase">
                    PRODUCER READY
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white mt-1">
                    PROFESSIONAL VIDEO SSENARIY VA STORYBOARD
                  </h2>
                  <p className="text-xs text-slate-400 font-bold mt-1">
                    Suxandon ovozi, vizual montaj yo'llanmalari va 3 tilda (UZ / RU / EN) to'liq diktorlik matnlari.
                  </p>
                </div>

                <button
                  onClick={copyStoryboard}
                  className="px-6 py-3 bg-brand-accent hover:bg-brand-accent/90 text-brand-primary font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-brand-accent/20"
                >
                  {copiedText ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedText ? "Nusxalandi!" : "To'liq Ssenariyni Ko'chirish"}
                </button>
              </div>

              <div className="space-y-6 overflow-y-auto max-h-[65vh] pr-3 scrollbar-thin">
                {scenes.map((sc, idx) => (
                  <div key={sc.id} className="p-5 bg-slate-900/70 rounded-2xl border border-slate-800/80 space-y-3 hover:border-slate-700 transition-all">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-brand-accent/10 text-brand-accent border border-brand-accent/30 rounded-md text-[10px] font-black uppercase">
                          {idx + 1}-SAHNA
                        </span>
                        <span className="text-xs sm:text-sm font-black text-white">{sc.title} — {sc.subtitle}</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                        {sc.duration} soniya
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs text-slate-300 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 leading-relaxed font-semibold">
                        <span className="text-brand-accent font-black block mb-1">🎙️ O'zbekcha Suxandon:</span>
                        "{sc.narrativeUz}"
                      </div>
                      <div className="text-xs text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-900 leading-relaxed">
                        <span className="text-indigo-400 font-bold block mb-1">🎙️ Диктор (Русский):</span>
                        "{sc.narrativeRu}"
                      </div>
                      <div className="text-xs text-slate-500 bg-slate-950/30 p-3 rounded-xl border border-slate-900 leading-relaxed">
                        <span className="text-emerald-400 font-bold block mb-1">🎙️ Narrator (English):</span>
                        "{sc.narrativeEn}"
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Slide Deck Overview Tab */}
          {activeTab === 'deck' && (
            <motion.div
              key="deck-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto w-full"
            >
              {scenes.map((sc, idx) => {
                const IconComp = sc.icon;
                return (
                  <div 
                    key={sc.id}
                    onClick={() => {
                      setCurrentSceneIdx(idx);
                      setActiveTab('interactive');
                    }}
                    className="bg-slate-950/70 border border-slate-800/80 hover:border-brand-accent/50 p-6 rounded-[28px] flex flex-col justify-between gap-4 cursor-pointer group transition-all hover:scale-[1.02] shadow-xl"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest">
                          SLIDE 0{sc.id}
                        </span>
                        <div className="p-2 bg-slate-900 rounded-xl text-slate-400 group-hover:text-brand-accent transition-colors">
                          <IconComp className="w-4 h-4" />
                        </div>
                      </div>
                      <h3 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-brand-accent transition-colors">
                        {sc.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 font-medium">{sc.subtitle}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500 font-bold">
                      <span>{sc.duration} soniya</span>
                      <span className="text-brand-accent group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        Ochish <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
