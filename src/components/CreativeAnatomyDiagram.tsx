import { useState, useMemo } from 'react';
import { Sparkles, Code, Info, Check, CornerRightDown } from 'lucide-react';

interface CreativeAnatomyDiagramProps {
  value: string;
}

interface DiagramPart {
  id: string;
  nameUz: string;
  nameLat: string;
  description: string;
  clinical: string;
}

export default function CreativeAnatomyDiagram({ value }: CreativeAnatomyDiagramProps) {
  const [showRaw, setShowRaw] = useState(false);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  // Normalize input
  const normalizedValue = value.trim();

  // Detect which anatomical structure this text diagram corresponds to
  const diagramType = useMemo(() => {
    const text = normalizedValue.toLowerCase();
    
    if (text.includes('vertebra') || text.includes('umurtqa') || text.includes('spinous') || text.includes('spinosus')) {
      return 'vertebra';
    }
    if (text.includes('sternum') || text.includes('to‘sh suyagi') || text.includes('manubrium')) {
      return 'sternum';
    }
    if (text.includes('clavicula') || text.includes('o‘mrov') || text.includes('sternalis') || text.includes('acromialis')) {
      return 'clavicula';
    }
    if (text.includes('scapula') || text.includes('kurak') || text.includes('glenoidalis') || text.includes('coracoideus')) {
      return 'scapula';
    }
    
    // Check if it represents a flow diagram / tree / list layout
    if (
      normalizedValue.includes('│') || 
      normalizedValue.includes('├') || 
      normalizedValue.includes('─') || 
      normalizedValue.includes('┌') || 
      normalizedValue.includes('-->') || 
      normalizedValue.includes('--->') || 
      normalizedValue.includes('──►') ||
      (normalizedValue.includes('[') && normalizedValue.includes(']') && normalizedValue.includes('|'))
    ) {
      return 'flowchart';
    }

    return 'default';
  }, [normalizedValue]);

  // Data for Interactive Anatomy Parts
  const vertebraParts = useMemo<Record<string, DiagramPart>>(() => ({
    spinosus: {
      id: 'spinosus',
      nameUz: 'Tikanli o‘simta (Orqaga yo‘nalgan)',
      nameLat: 'Processus spinosus',
      description: 'Umurtqa yoyining o‘rta chizig‘idan orqa tomonga yo‘nalgan toq o‘simta. Bu o‘simta mushaklar, paylar va boylamlarning birikishi uchun xizmat qiladi.',
      clinical: 'Ushbu o‘simtalar umurtqa pog‘onasini tekshirganda orqa tomondan oson paypaslanadi (palpatsiya qilinadi). Ularning kiyosligi yoki simmetriyasi buzilishi churralarni, skoliozni va boshqa deformatsiyalarni ko‘rsatadi.'
    },
    transversus: {
      id: 'transversus',
      nameUz: 'Ko‘ndalang o‘simta',
      nameLat: 'Processus transversus',
      description: 'Umurtqa yoyidan lateral (ikki yonga) qarab yo‘nalgan juft o‘simtalar. Ko‘krak umurtqalarida bu o‘simtalarda qovurg‘alar bilan bo‘g‘im hosil qiluvchi yuzalar mavjud.',
      clinical: 'Ko‘ndalang o‘simtalar sinishi kamdan-kam uchraydi, lekin kuchli travma (orqa urilishi) natijasida sodir bo‘lishi mumkin va o‘ta og‘riqli bo‘ladi.'
    },
    foramen: {
      id: 'foramen',
      nameUz: 'Umurtqa teshigi',
      nameLat: 'Foramen vertebrale',
      description: 'Umurtqa tanasi va yoyi orqali chegaralangan markaziy katta teshik. Barcha umurtqalarning bu teshiklari ustma-ust tushib, umurtqa kanalini (canalis vertebralis) hosil qiladi.',
      clinical: 'Ushbu kanal ichida orqa miya (medulla spinalis) joylashadi. Kanal torayishi (stenoz) yoki disk churralari asab tolalarini qisib qo‘yib, og‘riq va paralichga olib kelishi mumkin.'
    },
    arcus: {
      id: 'arcus',
      nameUz: 'Umurtqa yoyi',
      nameLat: 'Arcus vertebrae',
      description: 'Umurtqa tanasining orqa-lateral qismidan chiquvchi va orqa miyani himoya qiluvchi yoy shaklidagi suyak tuzilmasi. U tanaga oyoqchalar (pediculus) yordamida birikadi.',
      clinical: 'Ba’zi bolalarda bu yoy oxirigacha bitmay qoladi, bu nuqson "Spina bifida" deb ataladi va og‘ir nevrologik asoratlarga sabab bo‘lishi mumkin.'
    },
    corpus: {
      id: 'corpus',
      nameUz: 'Umurtqa tanasi',
      nameLat: 'Corpus vertebrae',
      description: 'Umurtqaning oldingi eng qalin, massiv va og‘irlikni ko‘taruvchi qismi. Uning yuqori va pastki yuzalari g‘adir-budur bo‘lib, umurtqalararo disklarga mustahkam birikadi.',
      clinical: 'Osteoporoz va kuchli siqilishda umurtqa tanasining "kompression sinishi" (compression fracture) kuzatiladi, bu ko‘pincha qariyalarda kuzatiladi.'
    }
  }), []);

  const sternumParts = useMemo<Record<string, DiagramPart>>(() => ({
    manubrium: {
      id: 'manubrium',
      nameUz: 'To‘sh suyagi dastasi',
      nameLat: 'Manubrium sterni',
      description: 'To‘sh suyagining keng va qalin yuqori qismi. Yuqori qirrasida bo‘yin o‘ymasi (incisura jugularis) va ikki chetida o‘mrov suyaklari bilan birikuvchi yuzalar mavjud.',
      clinical: 'To‘sh dastasida o‘ng va chap o‘mrov suyaklari va I juft qovurg‘alar birikadi. Bu soha a’zolari ko‘ks oralig‘idagi (mediastinum) yirik qon tomirlar va traxeyani old tomondan himoya qiladi.'
    },
    angulus: {
      id: 'angulus',
      nameUz: 'To‘sh burchagi',
      nameLat: 'Angulus sterni (Louis burchagi)',
      description: 'To‘sh dastasi bilan tanasi tutashgan, oldinga bir oz turtib chiqqan ko‘ndalang bo‘rtma burchak.',
      clinical: 'Klinik tana tekshiruvlarida juda muhim mo‘ljal. Ayniqsa, II-qovurg‘alarni va qovurg‘alararo masofalarni aniq hisoblash ushbu burchakdan boshlanadi.'
    },
    corpus: {
      id: 'corpus',
      nameUz: 'To‘sh suyagi tanasi',
      nameLat: 'Corpus sterni',
      description: 'To‘sh suyagining eng uzun va o‘rta qismi. Ikki yon qirrasida II-VII qovurg‘alarning tog‘ay qismi bilan birikuvchi o‘ymalar (incisurae costales) bor.',
      clinical: 'To‘sh suyagi qizil ilikka juda boy. Gematologiyada qon tizimi kasalliklarini tashxislash uchun internal sternal punksiya (to‘sh suyagini teshib ilik olish) aynan tana sohasidan amalga oshiriladi.'
    },
    xiphoideus: {
      id: 'xiphoideus',
      nameUz: 'Xanjarsimon o‘simta',
      nameLat: 'Processus xiphoideus',
      description: 'To‘sh suyagining eng pastki qismidagi kichik va shakli o‘zgaruvchan o‘simta. Yoshlikda tog‘ay bo‘ladi, yosh o‘tgan sari suyakka aylanadi.',
      clinical: 'Yurakni bilvosita massaj qilganda (CPR) ushbu o‘simtaga bosmaslik kerak, chunki u sinib, ostidagi jigarni shikastlashi mumkin.'
    }
  }), []);

  const claviculaParts = useMemo<Record<string, DiagramPart>>(() => ({
    sternalis: {
      id: 'sternalis',
      nameUz: 'To‘sh uchi',
      nameLat: 'Extremitas sternalis',
      description: 'O‘mrov suyagining ichkari tomonga qaragan, qalinlashgan va to‘sh suyagi dastasi bilan bo‘g‘im hosil qiluvchi uchi.',
      clinical: 'Bu sohada articulatio sternoclavicularis hosil bo‘lib, u yuqori ekstremitadning tana skeleti bilan bog‘langan yagona haqiqiy bo‘g‘imidir.'
    },
    corpus: {
      id: 'corpus',
      nameUz: 'O‘mrov tanasi',
      nameLat: 'Corpus claviculae',
      description: 'O‘mrov suyagining o‘rta qismi bo‘lib, u gorizontal S-simon shaklga ega. Ichki qismi oldinga, tashqi qismi esa orqaga qayrilgan bo‘ladi.',
      clinical: 'Inson tanasidagi eng ko‘p sinadigan suyak qismlaridan biri. O‘mrov tanasining o‘rta 1/3 qismida ko‘pincha yiqilish natijasida sinishlar kelib chiqadi.'
    },
    acromialis: {
      id: 'acromialis',
      nameUz: 'Akromial (Yelka) uchi',
      nameLat: 'Extremitas acromialis',
      description: 'O‘mrov suyagining tashqi tomonga qaragan, yassi bo‘lib kelgan va va kurak suyagining akromion o‘simtasi bilan birikuvchi uchi.',
      clinical: 'Yelkaga yiqilganda ushbu uchi va akromion orasidagi boylamlar uzilishi ("o‘mrov chiqishi" deb ataluvchi patologiya) ko‘p kuzatiladi.'
    }
  }), []);

  const scapulaParts = useMemo<Record<string, DiagramPart>>(() => ({
    superior: {
      id: 'superior',
      nameUz: 'Yuqori burchak',
      nameLat: 'Angulus superior',
      description: 'Kurakning medial va yuqori qirralari tutashgan qismidagi silliq burchak. Bu yerga kurakni ko‘taruvchi mushak birikadi.',
      clinical: 'Morfologik va funksional jihatdan bo‘yin mushaklari va kurak harakatlanishida muhim o‘rin tutadi.'
    },
    coracoideus: {
      id: 'coracoideus',
      nameUz: 'Tumshuqsimon o‘simta',
      nameLat: 'Processus coracoideus',
      description: 'Kurakning yuqori qirrasidan oldinga va tashqariga yo‘nalgan egilgan o‘simta. U yelka bo‘g‘imini mustahkamlovchi bir qator yirik mushaklar uchun boshlanish joyidir.',
      clinical: 'Traumatologiyada ushbu o‘simtadan paylar ko‘chishi yoki uning sinishi yelka sohasining og‘ir jarohatlariga bog‘liq bo‘ladi.'
    },
    glenoidalis: {
      id: 'glenoidalis',
      nameUz: 'Bo‘g‘im bo‘shlig‘i',
      nameLat: 'Cavitas glenoidalis',
      description: 'Kurakning lateral burchagidagi yassi va botiq chuqurcha. Ushbu chuqurchaga yelka suyagi boshi (caput humeri) kirib, yelka bo‘g‘imini (art. humeri) hosil qiladi.',
      clinical: 'Bu bo‘g‘im o‘ta harakatchan, ammo uning chuqurchasi sayoz bo‘lganligi sababli yelka bo‘g‘imi chiqishlari (luxatio humeri) eng ko‘p uchraydigan chiqishlar sirasiga kiradi.'
    },
    medialis: {
      id: 'medialis',
      nameUz: 'Medial (Ichki) qirra',
      nameLat: 'Margo medialis',
      description: 'Kurakning umurtqa pog‘onasiga qaratilgan eng uzun ichki qirrasi. Unga rombsimon va oldingi tishli mushaklar birikadi.',
      clinical: 'Ushbu mushaklar falajlanganda (masalan, n. thoracicus longus shikastlanganda) kurak medial qirrasi ko‘krak qafasidan orqaga ko‘tarilib "qanotsimon kurak" (scapula alata) patologiyasini beradi.'
    },
    inferior: {
      id: 'inferior',
      nameUz: 'Pastki burchak',
      nameLat: 'Angulus inferior',
      description: 'Kurakning medial va lateral qirralari birlashuvidan hosil bo‘lgan pastki o‘tkir burchak.',
      clinical: 'Nafas olish fazalarini va skolioz darajasini o‘lchashda, shuningdek stetofonendoskop yordamida o‘pka tovushlarini eshitishda o‘ta muhim anatomik mo‘ljaldir.'
    }
  }), []);

  // Set default initial screen if needed
  const activePartObj = selectedPart ? (
    diagramType === 'vertebra' ? vertebraParts[selectedPart] :
    diagramType === 'sternum' ? sternumParts[selectedPart] :
    diagramType === 'clavicula' ? claviculaParts[selectedPart] :
    diagramType === 'scapula' ? scapulaParts[selectedPart] : null
  ) : null;

  // Custom flowchart parser
  const renderFlowchart = () => {
    const lines = normalizedValue.split('\n');
    
    // Check if it's a simple vertical diagram or requires tree hierarchy
    // We will clean the line of raw drawing chars and present beautifully boxed lines
    const cleanedNodes = lines.map(line => {
      // Extract words or labels, ignoring pure ascii symbols
      const nodeText = line.replace(/[├┼└──┌┐│─+\-|▼▲+]/g, ' ').replace(/\s+/g, ' ').trim();
      const hasArrow = line.includes('-->') || line.includes('--->') || line.includes('├──') || line.includes('└──') || line.includes('├──>') || line.includes('├──►');
      
      // Match structures inside brackets [ text ] or parentheses ( text )
      const inlineMatches = [...line.matchAll(/[\[\(]([^\]\)]+)[\]\)]/g)].map(m => m[1]);
      
      return {
        original: line,
        cleaned: nodeText,
        nodes: inlineMatches.length > 0 ? inlineMatches : (nodeText.length > 3 ? [nodeText] : []),
        isSeparator: nodeText.length === 0,
        hasArrow
      };
    }).filter(item => !item.isSeparator || item.original.includes('|') || item.original.includes('▼') || item.original.includes('▲'));

    return (
      <div className="space-y-4 p-6 bg-slate-50 rounded-2xl border border-slate-200/60 max-w-full overflow-x-auto">
        <div className="flex items-center gap-2 mb-3 text-brand-primary/80">
          <CornerRightDown className="w-5 h-5 text-brand-accent animate-pulse" />
          <span className="font-bold text-sm uppercase tracking-wider">Interaktiv Strukturaviy Oqim</span>
        </div>
        
        <div className="flex flex-col items-center justify-center space-y-3 min-w-[300px]">
          {cleanedNodes.map((item, idx) => {
            if (item.nodes.length === 0) {
              // Draw an arrow or connector
              return (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-0.5 h-6 bg-blue-300"></div>
                </div>
              );
            }

            return (
              <div key={idx} className="flex flex-wrap items-center justify-center gap-3 w-full py-1">
                {item.nodes.map((node, nodeIdx) => {
                  const isHighlighted = node.toLowerCase().includes('arteriya') || node.toLowerCase().includes('nerv') || node.toLowerCase().includes('sinish');
                  const isSubNode = node.startsWith('  ') || node.startsWith('(');
                  
                  return (
                    <div 
                      key={nodeIdx} 
                      className={`px-4 py-2.5 rounded-xl border text-center transition-all shadow-sm max-w-xs ${
                        isHighlighted 
                          ? 'bg-rose-50 border-rose-200 text-rose-700 font-extrabold' 
                          : isSubNode
                            ? 'bg-amber-50 border-amber-200 text-amber-700 italic text-sm'
                            : 'bg-white border-blue-100 text-brand-primary hover:border-brand-accent hover:shadow-md hover:scale-[1.02]'
                      }`}
                    >
                      <span className="font-semibold block tracking-tight">{node}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (showRaw) {
    return (
      <div className="my-8 overflow-hidden rounded-2xl border border-slate-200/60 bg-slate-900 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-3.5">
          <div className="flex items-center gap-2.5 text-slate-300">
            <Code className="h-4.5 w-4.5 text-brand-accent" />
            <span className="font-mono text-xs font-bold tracking-tight">Sxematik Matn Ko'rinishi (ASCII)</span>
          </div>
          <button 
            onClick={() => setShowRaw(false)} 
            className="flex items-center gap-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 px-3 py-1 text-xs font-bold text-teal-400 hover:bg-teal-500 hover:text-white transition-all shadow-md cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Grafik interaktiv rejim
          </button>
        </div>
        <pre className="m-0 overflow-x-auto p-6 text-xs text-emerald-400 font-mono leading-relaxed bg-slate-950 max-h-[450px]">
          <code>{value}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className="my-8 overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-xl hover:shadow-slate-300/30 transition-all">
      {/* Header bar of the custom visualizer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 bg-slate-50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-brand-accent/20 to-indigo-500/20 rounded-xl">
            <Sparkles className="h-5 w-5 text-indigo-600 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-black text-brand-primary uppercase tracking-wider block">
              {diagramType === 'flowchart' ? 'Oqim Tarmoqlari Visualizatori' : '3D Interaktiv Anatomik Atlas'}
            </h4>
            <span className="text-[10px] text-slate-500 font-medium block">
              {diagramType === 'flowchart' ? 'Tizimli sxemaning toza grafik modeli' : "A'zoning barcha qirra va yuzalarini tanlab organining borgan sari o'rganing"}
            </span>
          </div>
        </div>
        <button 
          onClick={() => setShowRaw(true)} 
          className="self-start sm:self-auto flex items-center gap-1.5 rounded-xl border border-slate-300 px-3.5 py-1.5 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          <Code className="h-4 w-4 text-slate-400" />
          Kod/ASCII holda ko'rish
        </button>
      </div>

      <div className="p-6 md:p-8">
        {diagramType === 'flowchart' ? (
          renderFlowchart()
        ) : diagramType === 'default' ? (
          // Default styling fallback for other codeblocks
          <div className="overflow-x-auto bg-slate-50 p-6 rounded-2xl border border-slate-200/60 font-mono text-xs leading-relaxed max-h-[400px]">
            <code>{value}</code>
          </div>
        ) : (
          /* Interactive SVG Illustrations */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left side: Interactive Medical-Grade SVG */}
            <div className="md:col-span-6 bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col justify-center items-center relative min-h-[320px] shadow-inner">
              <span className="absolute top-4 left-4 inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-500 shadow-sm uppercase tracking-widest">
                <Info className="w-3 h-3 text-brand-accent" /> Interaktiv model
              </span>

              {diagramType === 'vertebra' && (
                <svg viewBox="0 0 320 320" className="w-full max-w-[280px] h-auto drop-shadow-xl">
                  <defs>
                    <radialGradient id="v-body" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#F8FAFC" />
                      <stop offset="100%" stopColor="#E2E8F0" />
                    </radialGradient>
                    <linearGradient id="v-bone" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#94A3B8" />
                      <stop offset="100%" stopColor="#64748B" />
                    </linearGradient>
                  </defs>

                  {/* Vertebra Arch Background */}
                  <path 
                    d="M 100 210 L 60 140 C 40 110, 80 100, 110 130 L 130 150 L 140 100 C 145 60, 175 60, 180 100 L 190 150 L 210 130 C 240 100, 280 110, 260 140 L 220 210 Z" 
                    fill="#F1F5F9" 
                    stroke="#475569" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />

                  {/* Spinous process highlighting and clicking */}
                  <path 
                    d="M 140 100 C 145 60, 175 60, 180 100 L 190 150 L 130 150 Z" 
                    fill={selectedPart === 'spinosus' ? '#E0F2FE' : '#64748B'} 
                    stroke={selectedPart === 'spinosus' ? '#38BDF8' : '#334155'} 
                    strokeWidth="2.5" 
                    className="cursor-pointer transition-all hover:opacity-95"
                    onClick={() => setSelectedPart('spinosus')}
                  />

                  {/* Left Transverse process */}
                  <path 
                    d="M 100 210 L 60 140 C 40 110, 80 100, 110 130 Z" 
                    fill={selectedPart === 'transversus' ? '#E0F2FE' : '#94A3B8'} 
                    stroke={selectedPart === 'transversus' ? '#38BDF8' : '#334155'} 
                    strokeWidth="2.5" 
                    className="cursor-pointer transition-all hover:opacity-95"
                    onClick={() => setSelectedPart('transversus')}
                  />

                  {/* Right Transverse process */}
                  <path 
                    d="M 220 210 L 260 140 C 280 110, 240 100, 210 130 Z" 
                    fill={selectedPart === 'transversus' ? '#E0F2FE' : '#94A3B8'} 
                    stroke={selectedPart === 'transversus' ? '#38BDF8' : '#334155'} 
                    strokeWidth="2.5" 
                    className="cursor-pointer transition-all hover:opacity-95"
                    onClick={() => setSelectedPart('transversus')}
                  />

                  {/* Vertebral arch (Arcus) */}
                  <path 
                    d="M 100 210 C 110 170, 210 170, 220 210" 
                    fill="none" 
                    stroke={selectedPart === 'arcus' ? '#38BDF8' : '#475569'} 
                    strokeWidth={selectedPart === 'arcus' ? '7' : '4'} 
                    className="cursor-pointer transition-all hover:opacity-95"
                    onClick={() => setSelectedPart('arcus')}
                  />

                  {/* Vertebral Body (Corpus) - bottom big circular representation */}
                  <ellipse 
                    cx="160" cy="235" rx="65" ry="45" 
                    fill={selectedPart === 'corpus' ? '#E0F2FE' : 'url(#v-body)'} 
                    stroke={selectedPart === 'corpus' ? '#38BDF8' : '#475569'} 
                    strokeWidth="3.5" 
                    className="cursor-pointer transition-all"
                    onClick={() => setSelectedPart('corpus')}
                  />

                  {/* Foramen (Vertebral canal) - center opening */}
                  <path 
                    d="M 120 205 C 115 160, 205 160, 200 205 C 190 215, 130 215, 120 205 Z" 
                    fill={selectedPart === 'foramen' ? '#bae6fd' : '#FFFFFF'} 
                    stroke={selectedPart === 'foramen' ? '#0284c7' : '#94a3b8'} 
                    strokeWidth="2.5" 
                    className="cursor-pointer transition-all hover:brightness-95"
                    onClick={() => setSelectedPart('foramen')}
                  />
                  
                  {/* Hotspot Dots */}
                  <circle cx="160" cy="80" r="6" fill="#0284c7" className="animate-ping" pointerEvents="none" />
                  <circle cx="160" cy="80" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" onClick={() => setSelectedPart('spinosus')} />
                  
                  <circle cx="75" cy="120" r="6" fill="#0284c7" className="animate-ping" pointerEvents="none" />
                  <circle cx="75" cy="120" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" onClick={() => setSelectedPart('transversus')} />
                  
                  <circle cx="160" cy="188" r="6" fill="#0284c7" className="animate-ping" pointerEvents="none" />
                  <circle cx="160" cy="188" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" onClick={() => setSelectedPart('foramen')} />
                  
                  <circle cx="160" cy="240" r="6" fill="#0284c7" className="animate-ping" pointerEvents="none" />
                  <circle cx="160" cy="240" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" onClick={() => setSelectedPart('corpus')} />
                </svg>
              )}

              {diagramType === 'sternum' && (
                <svg viewBox="0 0 320 320" className="w-full max-w-[280px] h-auto drop-shadow-xl">
                  <defs>
                    <linearGradient id="s-bone" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#F8FAFC" />
                      <stop offset="100%" stopColor="#CBD5E1" />
                    </linearGradient>
                  </defs>

                  {/* Sternum Symmetrical Grid Drawing */}
                  {/* Manubrium (Dasta) */}
                  <path 
                    d="M 125 40 L 195 40 C 200 40, 210 50, 205 60 L 190 100 L 130 100 L 115 60 C 110 50, 120 40, 125 40 Z" 
                    fill={selectedPart === 'manubrium' ? '#E0F2FE' : 'url(#s-bone)'} 
                    stroke={selectedPart === 'manubrium' ? '#38BDF8' : '#475569'} 
                    strokeWidth="3.5" 
                    className="cursor-pointer transition-all"
                    onClick={() => setSelectedPart('manubrium')}
                  />

                  {/* Angulus sterni line */}
                  <line 
                    x1="130" y1="100" x2="190" y2="100" 
                    stroke={selectedPart === 'angulus' ? '#0284c7' : '#475569'} 
                    strokeWidth={selectedPart === 'angulus' ? '6' : '3'} 
                    className="cursor-pointer transition-all"
                    onClick={() => setSelectedPart('angulus')}
                  />

                  {/* Corpus sterni (Tana) */}
                  <path 
                    d="M 130 100 L 190 100 L 180 250 L 140 250 Z" 
                    fill={selectedPart === 'corpus' ? '#E0F2FE' : 'url(#s-bone)'} 
                    stroke={selectedPart === 'corpus' ? '#38BDF8' : '#475569'} 
                    strokeWidth="3.5" 
                    className="cursor-pointer transition-all"
                    onClick={() => setSelectedPart('corpus')}
                  />

                  {/* Processus xiphoideus (Xanjarsimon o'simta) */}
                  <path 
                    d="M 140 250 L 180 250 L 160 295 Z" 
                    fill={selectedPart === 'xiphoideus' ? '#E0F2FE' : 'url(#s-bone)'} 
                    stroke={selectedPart === 'xiphoideus' ? '#38BDF8' : '#475569'} 
                    strokeWidth="3.5" 
                    className="cursor-pointer transition-all"
                    onClick={() => setSelectedPart('xiphoideus')}
                  />

                  {/* Hotspots */}
                  <circle cx="160" cy="55" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" onClick={() => setSelectedPart('manubrium')} />
                  <circle cx="160" cy="100" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" onClick={() => setSelectedPart('angulus')} />
                  <circle cx="160" cy="170" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" onClick={() => setSelectedPart('corpus')} />
                  <circle cx="160" cy="270" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" onClick={() => setSelectedPart('xiphoideus')} />
                </svg>
              )}

              {diagramType === 'clavicula' && (
                <svg viewBox="0 0 320 320" className="w-full max-w-[280px] h-auto drop-shadow-xl">
                  {/* Clavicula Curve Path */}
                  <path 
                    d="M 60 180 C 100 130, 160 130, 200 180 C 230 215, 270 190, 280 160" 
                    fill="none" 
                    stroke="#475569" 
                    strokeWidth="16" 
                    strokeLinecap="round" 
                  />
                  
                  {/* Acromial end */}
                  <path 
                    d="M 230 185 C 255 180, 265 170, 280 160" 
                    fill="none" 
                    stroke={selectedPart === 'acromialis' ? '#38BDF8' : '#64748B'} 
                    strokeWidth="20" 
                    strokeLinecap="round" 
                    className="cursor-pointer transition-all"
                    onClick={() => setSelectedPart('acromialis')}
                  />

                  {/* Sternal end */}
                  <path 
                    d="M 60 180 C 65 175, 80 160, 100 155" 
                    fill="none" 
                    stroke={selectedPart === 'sternalis' ? '#38BDF8' : '#475569'} 
                    strokeWidth="22" 
                    className="cursor-pointer transition-all"
                    onClick={() => setSelectedPart('sternalis')}
                  />

                  {/* Curve Body selection covering whole Clavicle with thinner click overlay */}
                  <path 
                    d="M 100 155 C 130 145, 175 145, 200 180 C 210 190, 220 190, 230 185" 
                    fill="none" 
                    stroke={selectedPart === 'corpus' ? '#38BDF8' : '#94A3B8'} 
                    strokeWidth="14" 
                    className="cursor-pointer transition-all"
                    onClick={() => setSelectedPart('corpus')}
                  />

                  {/* Highlight dots */}
                  <circle cx="70" cy="175" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" onClick={() => setSelectedPart('sternalis')} />
                  <circle cx="160" cy="155" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" onClick={() => setSelectedPart('corpus')} />
                  <circle cx="265" cy="170" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" onClick={() => setSelectedPart('acromialis')} />
                </svg>
              )}

              {diagramType === 'scapula' && (
                <svg viewBox="0 0 320 320" className="w-full max-w-[280px] h-auto drop-shadow-xl">
                  {/* Scapula Body Triangle */}
                  <path 
                    d="M 110 60 L 260 90 L 160 270 Z" 
                    fill={selectedPart === 'medialis' ? '#E0F2FE' : '#F1F5F9'} 
                    stroke={selectedPart === 'medialis' ? '#38BDF8' : '#475569'} 
                    strokeWidth="3.5" 
                    className="cursor-pointer transition-all"
                    onClick={() => setSelectedPart('medialis')}
                  />

                  {/* Angulus Superior (Top Left Point) */}
                  <circle 
                    cx="110" cy="60" r="14" 
                    fill={selectedPart === 'superior' ? '#38BDF8' : '#64748B'} 
                    className="cursor-pointer transition-all hover:scale-110"
                    onClick={() => setSelectedPart('superior')}
                  />

                  {/* Cavitas glenoidalis (Top Right Shoulder Socket) */}
                  <ellipse 
                    cx="260" cy="110" rx="10" ry="18" 
                    fill={selectedPart === 'glenoidalis' ? '#38BDF8' : '#475569'} 
                    stroke="#ffffff" 
                    strokeWidth="2"
                    className="cursor-pointer transition-all hover:scale-110"
                    onClick={() => setSelectedPart('glenoidalis')}
                  />

                  {/* Coracoid Process (Beak curving out) */}
                  <path 
                    d="M 240 70 Q 255 50, 270 75 Q 260 95, 245 80" 
                    fill={selectedPart === 'coracoideus' ? '#bae6fd' : '#94A3B8'} 
                    stroke={selectedPart === 'coracoideus' ? '#0284c7' : '#334155'} 
                    strokeWidth="2"
                    className="cursor-pointer transition-all hover:scale-105"
                    onClick={() => setSelectedPart('coracoideus')}
                  />

                  {/* Angulus Inferior (Bottom Point) */}
                  <circle 
                    cx="160" cy="270" r="14" 
                    fill={selectedPart === 'inferior' ? '#38BDF8' : '#64748B'} 
                    className="cursor-pointer transition-all hover:scale-110"
                    onClick={() => setSelectedPart('inferior')}
                  />

                  {/* Highlight indicators */}
                  <circle cx="110" cy="60" r="5" fill="#ffffff" className="pointer-events-none" />
                  <circle cx="160" cy="270" r="5" fill="#ffffff" className="pointer-events-none" />
                  <circle cx="255" cy="65" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" onClick={() => setSelectedPart('coracoideus')} />
                  <circle cx="170" cy="140" r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" className="cursor-pointer" onClick={() => setSelectedPart('medialis')} />
                </svg>
              )}
            </div>

            {/* Right side: Modern Educational Fact Card */}
            <div className="md:col-span-6 flex flex-col justify-between h-full space-y-4">
              {activePartObj ? (
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 shadow-sm min-h-[220px] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1 text-xs text-brand-accent uppercase font-black tracking-widest leading-none">
                      <Check className="w-4 h-4 text-emerald-500" /> Tanlangan anatomik qism
                    </div>
                    <h5 className="text-xl font-bold text-brand-primary leading-tight tracking-tight">
                      {activePartObj.nameUz}
                    </h5>
                    <p className="text-xs text-slate-500 font-mono italic mb-4 font-bold">
                      {activePartObj.nameLat}
                    </p>
                    <p className="text-sm leading-relaxed text-brand-muted mb-4 font-medium">
                      {activePartObj.description}
                    </p>
                    {activePartObj.clinical && (
                      <div className="mt-4 pt-4 border-t border-slate-200/50">
                        <span className="text-[10px] font-black uppercase text-rose-500 tracking-wider block mb-1">Klinik Ahamiyati</span>
                        <p className="text-xs leading-relaxed text-slate-600 bg-rose-50/40 p-3 rounded-xl border border-rose-100/40 font-medium">
                          {activePartObj.clinical}
                        </p>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => setSelectedPart(null)} 
                    className="mt-4 w-full text-center py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Boshqa qismni tanlash
                  </button>
                </div>
              ) : (
                <div className="bg-gradient-to-tr from-indigo-50/50 to-blue-50/50 border border-slate-100 rounded-3xl p-6 flex flex-col items-center justify-center text-center min-h-[220px]">
                  <Sparkles className="w-8 h-8 text-brand-accent mb-4 animate-bounce" />
                  <h5 className="text-base font-bold text-brand-primary mb-1">
                    Anatomiyani vizual o'rganing!
                  </h5>
                  <p className="text-xs text-brand-muted max-w-[280px] leading-relaxed font-semibold">
                    Anatomik model ustidagi ko'k hot-spot nuqtalarini yoki suyak bo'g'imlarini bosib, ularning to'liq lotincha nomlari, funktsiyalari va klinik patologiyalarini o'qing.
                  </p>
                  
                  {/* Quick-list helper buttons */}
                  <div className="flex flex-wrap gap-2 justify-center mt-5">
                    {diagramType === 'vertebra' && Object.keys(vertebraParts).map(key => (
                      <button 
                        key={key} 
                        onClick={() => setSelectedPart(key)}
                        className="px-2.5 py-1.5 bg-white hover:bg-brand-accent/10 border border-slate-200 text-[10px] font-bold rounded-lg text-slate-600 hover:text-brand-primary transition-all shadow-sm"
                      >
                        {vertebraParts[key].nameLat}
                      </button>
                    ))}
                    {diagramType === 'sternum' && Object.keys(sternumParts).map(key => (
                      <button 
                        key={key} 
                        onClick={() => setSelectedPart(key)}
                        className="px-2.5 py-1.5 bg-white hover:bg-brand-accent/10 border border-slate-200 text-[10px] font-bold rounded-lg text-slate-600 hover:text-brand-primary transition-all shadow-sm"
                      >
                        {sternumParts[key].nameLat}
                      </button>
                    ))}
                    {diagramType === 'clavicula' && Object.keys(claviculaParts).map(key => (
                      <button 
                        key={key} 
                        onClick={() => setSelectedPart(key)}
                        className="px-2.5 py-1.5 bg-white hover:bg-brand-accent/10 border border-slate-200 text-[10px] font-bold rounded-lg text-slate-600 hover:text-brand-primary transition-all shadow-sm"
                      >
                        {claviculaParts[key].nameLat}
                      </button>
                    ))}
                    {diagramType === 'scapula' && Object.keys(scapulaParts).map(key => (
                      <button 
                        key={key} 
                        onClick={() => setSelectedPart(key)}
                        className="px-2.5 py-1.5 bg-white hover:bg-brand-accent/10 border border-slate-200 text-[10px] font-bold rounded-lg text-slate-600 hover:text-brand-primary transition-all shadow-sm"
                      >
                        {scapulaParts[key].nameLat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
