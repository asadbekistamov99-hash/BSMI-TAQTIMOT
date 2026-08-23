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
  HelpCircle
} from 'lucide-react';
import SEO from '../components/SEO';
import { useSettings, normalizeTelegram } from '../hooks/useSettings';

// Interfaces
interface Scene {
  id: number;
  title: string;
  subtitle: string;
  narrativeUz: string;
  narrativeEn: string;
  duration: number; // in seconds
}

export default function Presentation() {
  const { settings } = useSettings();
  const telegramBot = normalizeTelegram(settings.telegramBotUsername || '@Medai_support_bot');
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState<'interactive' | 'storyboard'>('interactive');
  const [copiedText, setCopiedText] = useState(false);
  
  // Custom interactive state for scenes
  const [demoAngle, setDemoAngle] = useState(0);
  const [demoLayer, setDemoLayer] = useState<'skeletal' | 'muscular' | 'vascular' | 'nervous'>('skeletal');
  const [aiInput, setAiInput] = useState('');
  const [aiChat, setAiChat] = useState<Array<{ sender: 'user' | 'ai', text: string }>>([
    { sender: 'ai', text: 'Salom! Men BSMI Anatomiya AI yordamchisiman. Sizga qaysi a’zo tuzilishini batafsil tushuntirib beray?' }
  ]);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSuccess, setQuizSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [adminPulseActive, setAdminPulseActive] = useState(true);

  // Audio refs for Web Audio API synth
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscRef1 = useRef<OscillatorNode | null>(null);
  const oscRef2 = useRef<OscillatorNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const scenes: Scene[] = [
    {
      id: 1,
      title: "KIRISH & INTRO",
      subtitle: "BSMI ANATOMY - Yangi Avlod Tibbiy Ta'lim Tizimi",
      narrativeUz: "Assalomu alaykum va rahmatulloh! Bugun sizlarga tibbiy ta'lim sohasida inqilob yaratayotgan va odam anatomiyasini chuqur o'rganish uchun maxsus ishlab chiqilgan premium 'BSMI ANATOMY' platformasini taqdim etamiz. Ushbu platforma talabalar va shifokorlar uchun 3D modellar, interaktiv darslar, sun'iy intellekt konsultanti va mukammal nazorat tizimini o'z ichiga oladi.",
      narrativeEn: "Welcome everyone! Today, we introduce 'BSMI ANATOMY' - a premium medical education platform revolutionizing anatomy learning. Built with dynamic 3D models, an interactive atlas, smart AI assistants, and robust progress tracking, it serves as the ultimate resource for students and educators.",
      duration: 10
    },
    {
      id: 2,
      title: "INTERAKTIV 3D MODELLAR",
      subtitle: "Fazoviy fikrlashni rivojlantiruvchi 3D tajriba",
      narrativeUz: "Platformaning yuragi - bu interaktiv 3D Modellar bo'limidir. Bu yerda siz har bir suyak, organ va tizimlarni 360 darajada aylantirib, kattalashtirib va qatlamma-qatlam tahlil qila olasiz. Modelni bevosita kompyuterdan yuklash (GLB formatida) va har bir nuqtaga lotincha terminlar bog'lash imkoniyati o'quv jarayonini mutlaqo yangi bosqichga olib chiqadi.",
      narrativeEn: "The core feature of the platform is the interactive 3D anatomy suite. Users can rotate anatomical models 360 degrees, zoom in, and toggle between muscular, skeletal, and nervous layers. Administrators can directly upload GLB files and bind detailed Latin anatomical terms to custom coordinate pins.",
      duration: 12
    },
    {
      id: 3,
      title: "INTERAKTIV ATLAS & CLINICAL CASES",
      subtitle: "Nazariya va amaliyotning ideal uyg'unligi",
      narrativeUz: "Interaktiv Atlas bo'limi nafaqat chiroyli tasvirlar, balki chuqur tibbiy nazariya va klinik korrelyatsiyalar (Clinical Cases) bilan ta'minlangan. Har bir a'zoning anatomik tuzilishi uning patologiyasi va jarrohlik amaliyotidagi o'rni bilan bog'lab tushuntiriladi. Bu esa o'quvchida klinik fikrlashni birinchi darslardanoq shakllantiradi.",
      narrativeEn: "The interactive Atlas blends theory with high-definition diagrams and clinical cases. Understanding the biological structure alongside actual medical pathologies and surgical relevance builds crucial diagnostic skills from day one.",
      duration: 12
    },
    {
      id: 4,
      title: "ANATOMIYA AI ASSISTANT",
      subtitle: "Shaxsiy sun'iy intellekt ustozingiz 24/7 xizmatingizda",
      narrativeUz: "Platformaga integratsiya qilingan Anatomiya AI yordamchisi talabalarning har qanday savollariga millisekundlar ichida tibbiy o'quv dasturi asosida to'g'ri va ilmiy asoslangan javoblar qaytaradi. U darslarni tushuntiradi, qiyin lotincha iboralarni o'rgatadi va talabaga individual yo'llanma beradi.",
      narrativeEn: "The built-in Medical AI Assistant acts as a personal tutor 24/7. Powered by advanced AI models, it explains complex anatomical interactions, translates Latin terms, and clarifies study material dynamically.",
      duration: 10
    },
    {
      id: 5,
      title: "TESTLAR & DAVOMIY PROGRES",
      subtitle: "O'zlashtirishni nazorat qilish va rag'batlantirish",
      narrativeUz: "Har bir dars yakunida talabalar interaktiv testlarni topshiradilar. Tizim har bir to'g'ri javobni tahlil qilib, talabaning unvonini (masalan, 'Ibn Sino Izdoshi') va o'zlashtirish foizini dinamik ravishda hisoblab boradi. Bu esa o'rganish motivatsiyasini yuqori darajada ushlab turadi.",
      narrativeEn: "At the end of each topic, students pass interactive quizzes. The system automatically computes comprehensive scores, updates completion rates, and awards honors like the prestigious 'Disciple of Ibn Sina' rank to maintain engagement.",
      duration: 10
    },
    {
      id: 6,
      title: "ADMIN BOSHQRUV MARKAZI & XAVFSIZLIK",
      subtitle: "Biometrik Face ID va to'liq nazorat",
      narrativeUz: "Sayt xavfsizligi va to'lovlar nazorati eng yuqori darajada. Super Admin barcha talabalar, to'lovlar va mavzularni to'liq nazorat qila oladi. Eng muhimi, tizimga kirishda va darslarni ochishda Biometrik Face ID tekshiruvi o'rnatilgan bo'lib, u akkauntlarni begona shaxslardan mukammal himoya qiladi.",
      narrativeEn: "Security and site administration are world-class. The Super Admin enjoys full control over curriculums, financial transactions, and users. Biometric Face Verification guards the learning materials, ensuring absolute data integrity and unauthorized-sharing prevention.",
      duration: 12
    },
    {
      id: 7,
      title: "XULOSA & ALOQA",
      subtitle: "Biz bilan hamkorlik qiling va tibbiyotni birga o'zgartiring!",
      narrativeUz: "BSMI ANATOMY - bu faqat dastur emas, bu tibbiyot kelajagining poydevoridir. Loyihamizni yuqori baholaganingiz uchun tashakkur! Saytning eng quyi qismida biz bilan bog'lanish uchun bevosita Telegram profilimiz (@MEDAI_SUPPORT_BOT) va botlarimiz integratsiya qilingan. Hozirgi interaktiv namoyishni ko'rganingizdan mamnunmiz!",
      narrativeEn: "BSMI ANATOMY is more than an application; it is the cornerstone of modern medical education. Thank you for viewing this presentation. Direct support links, including our Telegram contact (@MEDAI_SUPPORT_BOT), are embedded in the footer. Join us on this journey!",
      duration: 10
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
          setCurrentSceneIdx(0); // loop back
        }
      }, currentScene.duration * 1000);
    }
    return () => clearTimeout(timer);
  }, [currentSceneIdx, isPlaying, currentScene.duration]);

  // Demo 3D rotating angle simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setDemoAngle(prev => (prev + 1.5) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Background particle flow animation inside a custom canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: Array<{ x: number; y: number; r: number; speedX: number; speedY: number; opacity: number }> = [];
    const particleCount = 60;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 1,
        speedX: Math.random() * 0.4 - 0.2,
        speedY: Math.random() * 0.4 - 0.2,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    const resizeObserver = new ResizeObserver(() => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    });
    resizeObserver.observe(canvas);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p, idx) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${p.opacity})`; // Neon blue glow color
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#06b6d4';
        ctx.fill();

        // Connect near particles with faint lines
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${(1 - dist / 100) * 0.1})`; // Indigo connections
            ctx.lineWidth = 0.5;
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

  // Web Audio API Ambient Sound Generator
  const startSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Create filter and gain nodes
      filterRef.current = ctx.createBiquadFilter();
      filterRef.current.type = 'lowpass';
      filterRef.current.frequency.value = 600;

      gainRef.current = ctx.createGain();
      gainRef.current.gain.setValueAtTime(0, ctx.currentTime);
      gainRef.current.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1.5); // very soft level

      // Oscillator 1 (deep pad root)
      oscRef1.current = ctx.createOscillator();
      oscRef1.current.type = 'triangle';
      oscRef1.current.frequency.value = 110; // A2 note

      // Oscillator 2 (fifth interval)
      oscRef2.current = ctx.createOscillator();
      oscRef2.current.type = 'sine';
      oscRef2.current.frequency.value = 165; // E3 note (perfect fifth)

      // Connect nodes
      oscRef1.current.connect(filterRef.current);
      oscRef2.current.connect(filterRef.current);
      filterRef.current.connect(gainRef.current);
      gainRef.current.connect(ctx.destination);

      // Start oscillators
      oscRef1.current.start();
      oscRef2.current.start();
      setSoundEnabled(true);
    } catch (e) {
      console.warn("AudioContext failed to load:", e);
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

  useEffect(() => {
    return () => {
      // Cleanup audio on unmount
      try {
        oscRef1.current?.stop();
        oscRef2.current?.stop();
        audioContextRef.current?.close();
      } catch (e) {}
    };
  }, []);

  // Storyboard copy utility
  const copyStoryboard = () => {
    const fullText = `
BSMI ANATOMY - ULTRA-PREMIUM TAQDIMOT VIDEOSI STORYBOARD va SCRIPT
=============================================================
DAVOMIYLIGI: 1 daqiqa 15 soniya
MUSIQA: Kosmik, chuqur va ruhiy motivatsion ambient synth musiqasi
OHANG: Ishonchli, ilmiy va jozibador ovozli professional suxandon

[0:00 - 0:10] SCENE 1: KIRISH & INTRO
-------------------------------------------------------------
- Vizual: Qorong'u kosmik fonda aylanuvchi oltin DNK spiral, keyin neon-yashil va sariq ranglarda "BSMI ANATOMY" logotipi markazda mayin paydo bo'ladi.
- Ovoz (Narrator): "Assalomu alaykum va rahmatulloh! Bugun sizlarga tibbiy ta'lim sohasida inqilob yaratayotgan va odam anatomiyasini mukammal o'rganish uchun maxsus tayyorlangan premium 'BSMI ANATOMY' platformasini taqdim etamiz."

[0:10 - 0:22] SCENE 2: INTERAKTIV 3D MODELLAR
-------------------------------------------------------------
- Vizual: Kamera silliq ravishda aylanayotgan 3D odam kalla suyagi yoki skelet modelini ko'rsatadi. Har xil anatomik nuqtalar ustiga sichqoncha borib, lotincha nomlarni o'qiydi (Masalan: 'Os frontale').
- Ovoz (Narrator): "Platformaning eng muhim ustunligi - bu interaktiv 3D Modellar bo'limidir. Bu yerda siz har bir suyak va organni 360 darajada aylantirib, lotincha terminlarni bir zumda tahlil qila olasiz. GLB formatidagi fayllarni bevosita kompyuterdan yuklash o'quv jarayonini yanada osonlashtiradi."

[0:22 - 0:34] SCENE 3: INTERAKTIV ATLAS & KLINIK HOLATLAR
-------------------------------------------------------------
- Vizual: Atlas sahifasi ochiladi. O'quvchi turli qatlamlarni (skelet, mushaklar) almashtirib ko'radi. Ekran burchagida "Clinical Cases" tugmasi bosiladi va suyak sinishi bilan bog'liq jarrohlik izohi chiqadi.
- Ovoz (Narrator): "Interaktiv Atlas bo'limi esa nazariyani hayotiy amaliyot bilan bog'laydi. Klinik darslar orqali har bir a'zoning haqiqiy patologiyalardagi o'rni va jarrohlik ahamiyati mukammal yoritiladi."

[0:34 - 0:44] SCENE 4: ANATOMIYA AI ASSISTANT
-------------------------------------------------------------
- Vizual: AI sahifasiga o'tiladi. Talaba "Burun bo'shlig'i suyaklari qaysilar?" deb yozadi, AI yordamchi chiroyli tarzda to'liq ilmiy va lotincha javobni yozib beradi.
- Ovoz (Narrator): "Sizning shaxsiy ustozingiz endi yoningizda! Integratsiyalashgan Anatomiya AI yordamchisi murakkab savollarga soniyalar ichida professional javob berib, darslaringizni ancha osonlashtiradi."

[0:44 - 0:54] SCENE 5: TESTLAR VA DAVOMIY PROGRES
-------------------------------------------------------------
- Vizual: Talaba test topshirmoqda, to'g'ri javobni tanlaganidan keyin bayramona effektlar va oltin unvonlar namoyon bo'ladi (Masalan: 'Ibn Sino Izdoshi').
- Ovoz (Narrator): "Har bir dars so'ngidagi interaktiv testlar esa bilimingizni mustahkamlaydi va sizni tibbiyot cho'qqilariga - haqiqiy Ibn Sino izdoshiga aylantiradi."

[0:54 - 1:06] SCENE 6: ADMIN BOSHQRUV MARKAZI & FACE ID
-------------------------------------------------------------
- Vizual: Admin dashboard ko'rsatiladi: talabalar ro'yxati, to'lovlar, va xavfsiz Face ID verifikatsiya jarayoni kadrda aylanadi.
- Ovoz (Narrator): "Xavfsizlik va boshqaruv eng yuqori standartlarga javob beradi. Zamonaviy Face ID tekshiruvi orqali shaxsiy ma'lumotlaringiz va o'quv akkauntingiz begonalardan ideal ravishda himoyalanadi."

[1:06 - 1:15] SCENE 7: XULOSA VA ALOQA (CONTACTS)
-------------------------------------------------------------
- Vizual: Saytdagi footer bo'limi ko'rsatiladi. Unda telegram belgisi va bevosita "@MEDAI_SUPPORT_BOT" yozuviga click qilinayotgani ko'rsatiladi. Foydalanuvchi bitta bosishda telegram lichkasiga o'tib ketadi.
- Ovoz (Narrator): "BSMI ANATOMY - bu faqat dastur emas, bu tibbiyot kelajagidir. Platforma eng quyi qismida Telegram orqali @MEDAI_SUPPORT_BOT bilan to'liq integratsiya qilingan. Hoziroq ro'yxatdan o'ting!"
`;

    navigator.clipboard.writeText(fullText.trim());
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // Simulated AI message sending
  const handleSendAiMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userMsg = aiInput;
    setAiChat(prev => [...prev, { sender: 'user', text: userMsg }]);
    setAiInput('');

    setTimeout(() => {
      let aiText = "Tushunarli! Ushbu anatomik tuzilish bo'yicha ma'lumotlar super-baza bilan sinxronlandi.";
      if (userMsg.toLowerCase().includes('yurak') || userMsg.toLowerCase().includes('cor')) {
        aiText = "Yurak (lot. Cor) - ko'krak bo'shlig'ida, o'pka o'rtasida joylashgan murakkab muskulli a'zo. U asosan 4 ta kameradan iborat: o'ng/chap bo'lmacha va o'ng/chap qorinchalar.";
      } else if (userMsg.toLowerCase().includes('suyak') || userMsg.toLowerCase().includes('os')) {
        aiText = "Odam skeleti 200 dan ortiq suyaklardan iborat. Ular asosan kompakt va gubkasimon suyak moddasidan qurilgan bo'lib, tayanch va himoya vazifasini bajaradi.";
      }
      setAiChat(prev => [...prev, { sender: 'ai', text: aiText }]);
    }, 1000);
  };

  // Simulated Quiz validation
  const handleSelectQuizAnswer = (idx: number) => {
    setQuizAnswer(idx);
    if (idx === 1) { // Correct answer index
      setQuizSuccess(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      setQuizSuccess(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden selection:bg-brand-accent/30 selection:text-white">
      <SEO 
        title="Interaktiv Taqdimot va Platforma Imkoniyatlari | BSMI Anatomy"
        description="BSMI Anatomy zamonaviy tibbiy ta'lim platformasining interaktiv taqdimoti, video ssenariysi, 3D atlas va sun'iy intellekt integratsiyalari."
        keywords="bsmi taqdimot, anatomiya taqdimoti, tibbiyot innovatsiya, tibbiy talim platformasi"
      />
      {/* Dynamic Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />
      
      {/* Glowing atmospheric effects */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="p-2 bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-brand-accent animate-pulse" />
              <h1 className="text-sm font-black uppercase tracking-widest text-white">BSMI ANATOMY PRESENTATION LAB</h1>
            </div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Ultra-Super Darajadagi Taqdimot Platformasi</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Navigation Tabs */}
          <div className="bg-slate-900/90 p-1 rounded-xl border border-slate-800 flex gap-1">
            <button
              onClick={() => setActiveTab('interactive')}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'interactive' ? 'bg-brand-accent text-brand-primary shadow-lg shadow-brand-accent/20' : 'text-slate-400 hover:text-white'}`}
            >
              <Video className="w-3.5 h-3.5" /> Interaktiv Rejim
            </button>
            <button
              onClick={() => setActiveTab('storyboard')}
              className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${activeTab === 'storyboard' ? 'bg-brand-accent text-brand-primary shadow-lg shadow-brand-accent/20' : 'text-slate-400 hover:text-white'}`}
            >
              <FileText className="w-3.5 h-3.5" /> Storyboard & Ssenariy
            </button>
          </div>

          {/* Sound Synthesizer Controller */}
          <button
            onClick={toggleSound}
            className={`p-3 rounded-xl border transition-all flex items-center gap-2 text-xs font-black uppercase tracking-wider ${soundEnabled ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'}`}
            title="Sintezator fon musiqasini yoqish/o'chirish"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
            {soundEnabled ? "Fon Chaqnashi Yoqiq" : "Fon Musiqasini Yoqish"}
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-grow relative z-10 max-w-7xl mx-auto w-full px-6 py-8 flex flex-col justify-between gap-8">
        <AnimatePresence mode="wait">
          {activeTab === 'interactive' ? (
            <motion.div 
              key="interactive-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-grow"
            >
              {/* Scene Display Window - Left 7 Cols */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="flex-grow bg-slate-950/60 border border-slate-900 rounded-[32px] p-8 relative flex flex-col justify-between overflow-hidden group shadow-2xl">
                  {/* Outer Glowing frame */}
                  <div className="absolute inset-0 border border-brand-accent/10 rounded-[32px] group-hover:border-brand-accent/20 transition-all pointer-events-none" />
                  
                  {/* Decorative camera focus bounds */}
                  <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-slate-800" />
                  <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-slate-800" />
                  <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-slate-800" />
                  <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-slate-800" />

                  {/* Scene Header */}
                  <div className="flex items-center justify-between border-b border-slate-900/60 pb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-[9px] font-black tracking-widest text-slate-400 uppercase">
                        SCENE {currentScene.id} / {scenes.length}
                      </span>
                      {isPlaying && (
                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-rose-950/30 border border-rose-800/40 text-rose-500 rounded-md text-[9px] font-black tracking-widest uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                          RECORDING/LIVE
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-500">Duration: {currentScene.duration}s</span>
                  </div>

                  {/* Interactive Scene Centerpieces depending on the scene */}
                  <div className="flex-grow flex items-center justify-center py-8 relative z-10">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentScene.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5 }}
                        className="w-full flex flex-col items-center text-center"
                      >
                        {/* Scene 1: Introduction */}
                        {currentScene.id === 1 && (
                          <div className="space-y-6">
                            <motion.div 
                              animate={{ y: [0, -10, 0] }}
                              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                              className="w-24 h-24 rounded-full bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-brand-accent/40 flex items-center justify-center shadow-2xl shadow-brand-accent/10"
                            >
                              <Heart className="w-12 h-12 text-[#FFD700] animate-pulse" />
                            </motion.div>
                            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white bg-gradient-to-r from-white via-slate-200 to-brand-accent bg-clip-text text-transparent">
                              BSMI ANATOMY
                            </h2>
                            <p className="text-sm font-black uppercase tracking-[0.4em] text-brand-accent">
                              KILAJAK SHIFOKORLARI UCHUN PROFESSIONAL PLATFORMA
                            </p>
                          </div>
                        )}

                        {/* Scene 2: 3D Models */}
                        {currentScene.id === 2 && (
                          <div className="w-full max-w-md flex flex-col items-center gap-6">
                            {/* Rotating Simulated 3D Skull Mesh */}
                            <div className="w-56 h-56 rounded-full border border-slate-800 bg-slate-950/80 flex items-center justify-center relative shadow-inner overflow-hidden">
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />
                              <motion.div 
                                style={{ rotateY: demoAngle }}
                                className="w-32 h-32 border border-brand-accent/30 rounded-xl relative flex items-center justify-center"
                              >
                                {/* Simulated wireframe lines of anatomical skull */}
                                <div className="absolute inset-0 border border-indigo-500/20 rounded-full animate-pulse" />
                                <div className="absolute inset-2 border border-slate-700/45 rounded-md" />
                                <Compass className="w-12 h-12 text-brand-accent/80" />
                                <div className="absolute top-1 left-1 bg-brand-accent/10 px-1 rounded text-[8px] font-mono text-brand-accent">Os parietale</div>
                                <div className="absolute bottom-2 right-1 bg-indigo-500/10 px-1 rounded text-[8px] font-mono text-indigo-400">Os frontale</div>
                              </motion.div>
                            </div>
                            <div className="flex gap-2 justify-center">
                              <span className="text-xs bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400">
                                🔄 Sichqoncha orqali 360° aylantiring
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Scene 3: Atlas */}
                        {currentScene.id === 3 && (
                          <div className="w-full max-w-lg space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 flex flex-col items-center gap-3">
                                <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest">Skelet Qatlami</span>
                                <div className="w-full bg-slate-950 h-28 rounded-xl border border-slate-900 flex items-center justify-center">
                                  <Layers className="w-10 h-10 text-slate-500" />
                                </div>
                                <span className="text-[10px] font-mono text-slate-400">206 ta suyak va lotincha tushunish</span>
                              </div>
                              <div className="bg-slate-900/80 p-5 rounded-2xl border border-indigo-900/40 flex flex-col items-center gap-3">
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Klinik Holat (Clinical Connection)</span>
                                <div className="w-full bg-slate-950 h-28 rounded-xl border border-slate-900 flex flex-col p-3 text-left justify-between overflow-hidden">
                                  <span className="text-[8px] font-black bg-rose-500/10 border border-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded uppercase w-fit">Patologiya</span>
                                  <p className="text-[10px] text-slate-300 font-bold leading-tight">Elaksimon plastinka sinishi va burunlik likvoreyasi.</p>
                                  <span className="text-[8px] text-slate-500 font-mono">Batafsil izohlangan lotincha terminlar</span>
                                </div>
                                <span className="text-[10px] font-mono text-indigo-300">Amaliy klinik darslar</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Scene 4: AI Assistant */}
                        {currentScene.id === 4 && (
                          <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4 text-left">
                            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                              <div className="w-6 h-6 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent">
                                <Cpu className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Anatomiya AI Ko'makchisi</span>
                            </div>
                            <div className="h-32 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                              {aiChat.map((msg, i) => (
                                <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                  <span className="text-[8px] font-bold text-slate-500 mb-0.5 uppercase tracking-wider">
                                    {msg.sender === 'user' ? 'Siz (Talaba)' : 'Anatomiya AI'}
                                  </span>
                                  <div className={`p-2.5 rounded-xl text-[11px] leading-relaxed max-w-[85%] font-medium ${msg.sender === 'user' ? 'bg-brand-accent text-brand-primary rounded-tr-none font-bold' : 'bg-slate-950 border border-slate-800 text-slate-300 rounded-tl-none'}`}>
                                    {msg.text}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <form onSubmit={handleSendAiMessage} className="flex gap-2">
                              <input 
                                type="text"
                                value={aiInput}
                                onChange={e => setAiInput(e.target.value)}
                                placeholder="Masalan: Yurak klapanlari..."
                                className="flex-grow p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-white focus:border-brand-accent outline-none"
                              />
                              <button type="submit" className="p-2.5 bg-brand-accent text-brand-primary rounded-xl hover:bg-brand-accent/90 transition-all font-black">
                                <Send className="w-4 h-4" />
                              </button>
                            </form>
                          </div>
                        )}

                        {/* Scene 5: Quiz */}
                        {currentScene.id === 5 && (
                          <div className="w-full max-w-md bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-left relative overflow-hidden">
                            {showConfetti && (
                              <div className="absolute inset-0 bg-brand-accent/5 flex items-center justify-center z-10 animate-pulse pointer-events-none">
                                <div className="text-center">
                                  <Award className="w-12 h-12 text-[#FFD700] mx-auto mb-1 animate-bounce" />
                                  <p className="text-[10px] font-black uppercase tracking-widest text-brand-accent">TO'G'RI JAVOB! CONFETTI CHIQDI!</p>
                                </div>
                              </div>
                            )}
                            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
                              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Lot. Os frontale qayerda joylashgan?</span>
                              <span className="text-[9px] font-mono text-brand-accent font-black">Ball: +10</span>
                            </div>
                            <div className="space-y-2 relative z-0">
                              <button 
                                onClick={() => handleSelectQuizAnswer(0)}
                                className={`w-full p-3.5 rounded-xl border text-xs font-bold text-left transition-all ${quizAnswer === 0 ? 'bg-rose-950/40 border-rose-800 text-rose-400' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}
                              >
                                A) Ensa sohasida
                              </button>
                              <button 
                                onClick={() => handleSelectQuizAnswer(1)}
                                className={`w-full p-3.5 rounded-xl border text-xs font-bold text-left transition-all ${quizAnswer === 1 ? 'bg-emerald-950/40 border-emerald-800 text-emerald-400' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}
                              >
                                B) Peshona sohasida (To'g'ri javob)
                              </button>
                              <button 
                                onClick={() => handleSelectQuizAnswer(2)}
                                className={`w-full p-3.5 rounded-xl border text-xs font-bold text-left transition-all ${quizAnswer === 2 ? 'bg-slate-950 border-slate-800 hover:border-slate-700' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}
                              >
                                C) Tepalik sohasida
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Scene 6: Admin Page */}
                        {currentScene.id === 6 && (
                          <div className="w-full max-w-lg space-y-4">
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-left flex gap-6 items-center">
                              <div className="w-16 h-16 rounded-full bg-brand-accent/10 border border-brand-accent/30 flex items-center justify-center shrink-0">
                                <Settings className="w-8 h-8 text-brand-accent animate-spin" />
                              </div>
                              <div className="flex-grow space-y-1">
                                <h4 className="text-sm font-black uppercase text-white tracking-tight">Super Admin Dashboard</h4>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">Barcha talabalar, darslar, to'lovlar, biometrik Face ID va tizim sozlamalarini boshqarish markazi.</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-900 text-center">
                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Face Verification</span>
                                <span className="text-xs font-black text-brand-accent uppercase">AKTIv/HIMOYALANGAN</span>
                              </div>
                              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-900 text-center">
                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Mavzular</span>
                                <span className="text-xs font-black text-white">26 TA MAVJU</span>
                              </div>
                              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-900 text-center">
                                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Bot Integratsiyasi</span>
                                <span className="text-xs font-black text-emerald-500 uppercase">ONLINE</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Scene 7: Outro & Contact */}
                        {currentScene.id === 7 && (
                          <div className="space-y-6 max-w-md">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
                              <Zap className="w-8 h-8 animate-bounce" />
                            </div>
                            <h3 className="text-2xl font-black text-white">YORDAM & ALOQA</h3>
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">Bizning professional qo'llab-quvvatlash jamoamiz va telegram adminlarimiz sizning savollaringizga javob berishga tayyor:</p>
                            
                            <div className="bg-slate-900/80 border border-indigo-950/50 p-4 rounded-2xl flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-sky-500/10 rounded-xl text-sky-400">
                                  <Compass className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                  <span className="text-[8px] font-bold text-slate-500 uppercase block tracking-widest">Telegram Support</span>
                                  <span className="text-xs font-black text-white">{telegramBot}</span>
                                </div>
                              </div>
                              <a 
                                href={`https://t.me/${telegramBot.replace('@', '').trim()}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="px-5 py-2.5 bg-brand-accent text-brand-primary text-xs font-black uppercase tracking-widest rounded-xl hover:bg-brand-accent/90 transition-all flex items-center gap-1.5"
                              >
                                O'tish
                              </a>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Narrative Overlay / Captions */}
                  <div className="bg-slate-900/80 rounded-2xl p-5 border border-indigo-950/40 relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Volume2 className="w-3.5 h-3.5 text-brand-accent" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Audio Narration (Suxandon matni):</span>
                    </div>
                    <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-semibold transition-all">
                      {currentScene.narrativeUz}
                    </p>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-bold mt-2 border-t border-slate-800/60 pt-2 italic">
                      English: {currentScene.narrativeEn}
                    </p>
                  </div>

                  {/* Scene Timeline Progress Bar */}
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-6 relative z-10 border border-slate-800">
                    <motion.div 
                      key={currentScene.id}
                      initial={{ width: "0%" }}
                      animate={isPlaying ? { width: "100%" } : { width: "0%" }}
                      transition={isPlaying ? { duration: currentScene.duration, ease: "linear" } : { duration: 0 }}
                      className="bg-brand-accent h-full shadow-[0_0_10px_rgba(56,189,248,0.7)]" 
                    />
                  </div>
                </div>

                {/* Narrative Controls & Timeline Track */}
                <div className="bg-slate-950/60 border border-slate-900 p-4 rounded-[24px] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        if (currentSceneIdx > 0) {
                          setCurrentSceneIdx(prev => prev - 1);
                        } else {
                          setCurrentSceneIdx(scenes.length - 1);
                        }
                      }}
                      className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white"
                      title="Oldingi sahna"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="px-6 py-3 bg-brand-accent hover:bg-brand-accent/90 text-brand-primary rounded-xl transition-all font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-brand-accent/10"
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      {isPlaying ? "Pause" : "Play / Auto"}
                    </button>

                    <button 
                      onClick={() => {
                        if (currentSceneIdx < scenes.length - 1) {
                          setCurrentSceneIdx(prev => prev + 1);
                        } else {
                          setCurrentSceneIdx(0);
                        }
                      }}
                      className="p-3 bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white"
                      title="Keyingi sahna"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Small Dots Navigator */}
                  <div className="flex gap-2">
                    {scenes.map((scene, idx) => (
                      <button
                        key={scene.id}
                        onClick={() => setCurrentSceneIdx(idx)}
                        className={`w-3.5 h-3.5 rounded-full transition-all ${currentSceneIdx === idx ? 'bg-brand-accent w-8 shadow-[0_0_8px_rgba(56,189,248,0.5)]' : 'bg-slate-800 hover:bg-slate-700'}`}
                        title={`Scene ${scene.id}: ${scene.title}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Side Walkthrough/Guidance Details - Right 4 Cols */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-slate-950/60 border border-slate-900 rounded-[32px] p-6 flex flex-col justify-between h-full relative overflow-hidden">
                  <div className="space-y-6">
                    <div className="border-b border-slate-900 pb-4">
                      <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest">Sahna Haqida Ma'lumot</span>
                      <h3 className="text-lg font-black text-white uppercase tracking-tight mt-1">{currentScene.title}</h3>
                      <p className="text-xs text-slate-400 font-bold mt-1">{currentScene.subtitle}</p>
                    </div>

                    <div className="space-y-4">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Interaktiv Harakatlar (Demo):</span>
                      
                      {currentScene.id === 1 && (
                        <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
                          <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">⭐ Ushbu sahna saytning eng mukammal birinchi taassurotini shakllantiradi. Siz bu yerda loading (yuklanish) va dynamic splash effektlarini taqdim etasiz.</p>
                          <button 
                            onClick={() => {
                              setCurrentSceneIdx(1); // Jump to 3D Models
                            }}
                            className="w-full py-2 bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
                          >
                            Keyingi darslikka sakrash
                          </button>
                        </div>
                      )}

                      {currentScene.id === 2 && (
                        <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
                          <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">⭐ 3D modellarda mushak va suyak qatlamlarini (Layers) ko'rsating:</p>
                          <div className="grid grid-cols-2 gap-2">
                            {['skeletal', 'muscular', 'vascular', 'nervous'].map((layer) => (
                              <button
                                key={layer}
                                onClick={() => setDemoLayer(layer as any)}
                                className={`py-2 text-[9px] font-black uppercase tracking-wider rounded-lg border transition-all ${demoLayer === layer ? 'bg-brand-accent border-brand-accent text-brand-primary' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'}`}
                              >
                                {layer}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {currentScene.id === 3 && (
                        <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
                          <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">⭐ Interaktiv atlasda har doim real vaqtda yangilanadigan darsliklar va jarrohlik korrelyatsiyalari joylashadi.</p>
                          <div className="p-2 bg-slate-950 rounded-xl border border-slate-900 text-center">
                            <span className="text-[9px] font-black text-emerald-400">Atlas Real-Time Sync: ON</span>
                          </div>
                        </div>
                      )}

                      {currentScene.id === 4 && (
                        <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
                          <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">⭐ Anatomiya AI bilan suhbat demo rejimida ishlamoqda. Chapdagi chat oynasiga yozib, sun'iy intellektning tezkor muloqotini tekshirishingiz mumkin.</p>
                        </div>
                      )}

                      {currentScene.id === 5 && (
                        <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
                          <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">⭐ Chapda keltirilgan savol ustiga bosing va tizimning to'g'ri/notog'ri javob tekshiruvini real vaqtda ko'ring.</p>
                          {quizAnswer !== null && (
                            <div className="p-2.5 rounded-xl text-center text-[10px] font-black uppercase tracking-widest bg-slate-950 border border-slate-800">
                              {quizSuccess ? (
                                <span className="text-emerald-400">To'g'ri javob, mukammal!</span>
                              ) : (
                                <span className="text-rose-500">Noto'g'ri, yana urinib ko'ring!</span>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {currentScene.id === 6 && (
                        <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
                          <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">⭐ Boshqaruv xonasi Super Admin huquqlariga ega bo'lib, biometrik ma'lumotlarni hisoblaydi.</p>
                        </div>
                      )}

                      {currentScene.id === 7 && (
                        <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
                          <p className="text-[11px] text-slate-300 font-semibold leading-relaxed">⭐ Bizning asosiy aloqa manzilimiz telegramdagi <b>{telegramBot}</b> profiliga bog'langan. Siz bitta bosish orqali unga o'ta olasiz.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-900">
                    <div className="flex justify-between items-center bg-slate-900/40 p-3.5 rounded-2xl border border-slate-800">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Taqdimotchi uchun:</span>
                      <span className="text-[9px] font-mono font-bold text-slate-400">F11 / To'liq Ekran</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 text-center font-bold">Ushbu sahna interfeysini screen recorder dasturlari (OBS, Camtasia) orqali yozib olib, ultra professional video tayyorlashingiz mumkin.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="storyboard-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-slate-950/60 border border-slate-900 rounded-[32px] p-8 max-w-4xl mx-auto w-full relative"
            >
              <div className="flex items-center justify-between border-b border-slate-900 pb-6 mb-6">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-wider text-white">PROFESSIONAL VIDEO SENARIY VA STORYBOARD</h2>
                  <p className="text-xs text-slate-400 font-bold mt-1">Ushbu ssenariydan foydalanib o'z ovozingizni yozib oling yoki sun'iy intellekt suxandoni orqali audio yaratib, ultra-super video tayyorlang.</p>
                </div>
                <button
                  onClick={copyStoryboard}
                  className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
                >
                  {copiedText ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copiedText ? "Nusxalandi!" : "Ssenariyni nusxalash"}
                </button>
              </div>

              <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-4 scrollbar-thin text-sm leading-relaxed text-slate-300 font-medium">
                {/* Storyboard segment blocks */}
                <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-black text-brand-accent uppercase tracking-wider">1-Sahna: Kirish & Splash (0:00 - 0:10)</span>
                    <span className="text-xs font-mono font-bold text-slate-500">Davomiyligi: 10 soniya</span>
                  </div>
                  <p><b>Visual:</b> Qorong'u kosmik fonda, aylanuvchi oltin DNK spiral yoki odam miyasining tarmoqli grafikasi namoyon bo'ladi. Keyin "BSMI ANATOMY" logotipi markazda paydo bo'ladi.</p>
                  <p className="text-indigo-300 italic font-semibold bg-slate-950/50 p-3 rounded-lg border border-slate-900">
                    🎙️ Suxandon ovozi: "Assalomu alaykum va rahmatulloh! Bugun sizlarga tibbiy ta'lim sohasida inqilob yaratayotgan va odam anatomiyasini mukammal o'rganish uchun maxsus tayyorlangan premium 'BSMI ANATOMY' platformasini taqdim etamiz."
                  </p>
                </div>

                <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-black text-brand-accent uppercase tracking-wider">2-Sahna: 3D Modellar Bo'limi (0:10 - 0:22)</span>
                    <span className="text-xs font-mono font-bold text-slate-500">Davomiyligi: 12 soniya</span>
                  </div>
                  <p><b>Visual:</b> Kamera silliq ravishda aylanayotgan 3D odam kalla suyagi yoki skelet modelini ko'rsatadi. Sichqoncha orqali suyaklar bosiladi va lotincha nomlari bilan izohlari dynamic zoom bo'lib ko'rinadi.</p>
                  <p className="text-indigo-300 italic font-semibold bg-slate-950/50 p-3 rounded-lg border border-slate-900">
                    🎙️ Suxandon ovozi: "Platformaning eng muhim ustunligi - bu interaktiv 3D Modellar bo'limidir. Bu yerda siz har bir suyak va organni 360 darajada aylantirib, lotincha terminlarni bir zumda tahlil qila olasiz. GLB formatidagi fayllarni bevosita kompyuterdan yuklash o'quv jarayonini yanada osonlashtiradi."
                  </p>
                </div>

                <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-black text-brand-accent uppercase tracking-wider">3-Sahna: Interaktiv Atlas & Klinik Holatlar (0:22 - 0:34)</span>
                    <span className="text-xs font-mono font-bold text-slate-500">Davomiyligi: 12 soniya</span>
                  </div>
                  <p><b>Visual:</b> Atlas sahifasi ochilib skelet, mushaklar kabi turli qatlamlar bitta tugma orqali almashtiriladi. Keyin "Clinical Cases" tugmasi bosilib, klinik tahlil va kasalliklar tasvirlari ko'rsatiladi.</p>
                  <p className="text-indigo-300 italic font-semibold bg-slate-950/50 p-3 rounded-lg border border-slate-900">
                    🎙️ Suxandon ovozi: "Interaktiv Atlas bo'limi esa nazariyani hayotiy amaliyot bilan bog'laydi. Klinik darslar orqali har bir a'zoning haqiqiy patologiyalardagi o'rni va jarrohlik ahamiyati mukammal yoritiladi."
                  </p>
                </div>

                <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-black text-brand-accent uppercase tracking-wider">4-Sahna: Anatomiya AI Ko'makchisi (0:34 - 0:44)</span>
                    <span className="text-xs font-mono font-bold text-slate-500">Davomiyligi: 10 soniya</span>
                  </div>
                  <p><b>Visual:</b> AI sahifasiga sichqoncha borib savol kiritiladi. Chatbot millisekundlar ichida chiroyli darslik formatidagi javobni va unga bog'liq rasmni shakllantiradi.</p>
                  <p className="text-indigo-300 italic font-semibold bg-slate-950/50 p-3 rounded-lg border border-slate-900">
                    🎙️ Suxandon ovozi: "Sizning shaxsiy ustozingiz endi yoningizda! Integratsiyalashgan Anatomiya AI yordamchisi murakkab savollarga soniyalar ichida professional javob berib, darslaringizni ancha osonlashtiradi."
                  </p>
                </div>

                <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-black text-brand-accent uppercase tracking-wider">5-Sahna: Interaktiv Testlar & Davomiy Progres (0:44 - 0:54)</span>
                    <span className="text-xs font-mono font-bold text-slate-500">Davomiyligi: 10 soniya</span>
                  </div>
                  <p><b>Visual:</b> O'quvchi test savollariga javob berayotgani, to'g'ri javobni tanlaganidan so'ng oltin kubok, unvon ("Ibn Sino Izdoshi") va o'zlashtirish progress bari ko'tarilishi namoyish etiladi.</p>
                  <p className="text-indigo-300 italic font-semibold bg-slate-950/50 p-3 rounded-lg border border-slate-900">
                    🎙️ Suxandon ovozi: "Har bir dars so'ngidagi interaktiv testlar esa bilimingizni mustahkamlaydi va sizni tibbiyot cho'qqilariga - haqiqiy Ibn Sino izdoshiga aylantiradi."
                  </p>
                </div>

                <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-black text-brand-accent uppercase tracking-wider">6-Sahna: Super Admin Nazorati & Face ID (0:54 - 1:06)</span>
                    <span className="text-xs font-mono font-bold text-slate-500">Davomiyligi: 12 soniya</span>
                  </div>
                  <p><b>Visual:</b> Admin dashboard sahifasidagi talabalar ro'yxati, to'lovlarni bitta bosishda faollashtirish va tizimga kirishda Biometrik Face ID gate kameradan yuzni muvaffaqiyatli tekshirishi ko'rsatiladi.</p>
                  <p className="text-indigo-300 italic font-semibold bg-slate-950/50 p-3 rounded-lg border border-slate-900">
                    🎙️ Suxandon ovozi: "Xavfsizlik va boshqaruv eng yuqori standartlarga javob beradi. Zamonaviy Face ID tekshiruvi orqali shaxsiy ma'lumotlaringiz va o'quv akkauntingiz begonalardan ideal ravishda himoyalanadi."
                  </p>
                </div>

                <div className="p-5 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-black text-brand-accent uppercase tracking-wider">7-Sahna: Xulosa & Aloqa (1:06 - 1:15)</span>
                    <span className="text-xs font-mono font-bold text-slate-500">Davomiyligi: 9 soniya</span>
                  </div>
                  <p><b>Visual:</b> Saytning quyi qismidagi footer ko'rsatiladi. Sichqoncha borib "@MEDAI_SUPPORT_BOT" yozuviga click qiladi va telegram profili yuklanayotgani ko'rsatiladi.</p>
                  <p className="text-indigo-300 italic font-semibold bg-slate-950/50 p-3 rounded-lg border border-slate-900">
                    🎙️ Suxandon ovozi: "BSMI ANATOMY - bu faqat dastur emas, bu tibbiyot kelajagidir. Platforma eng quyi qismida Telegram orqali @MEDAI_SUPPORT_BOT bilan to'liq integratsiya qilingan. Hoziroq ro'yxatdan o'ting!"
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
