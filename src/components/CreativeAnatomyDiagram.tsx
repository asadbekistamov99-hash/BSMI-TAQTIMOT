import { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, 
  Code, 
  Info, 
  Check, 
  CornerRightDown, 
  Image as ImageIcon, 
  Upload, 
  Edit, 
  ZoomIn, 
  X, 
  Eye, 
  RefreshCw 
} from 'lucide-react';
import { DiagramReplacement, getDiagramKey, detectDiagramTitle } from '../lib/diagramHelper';
import ReplaceDiagramModal from './ReplaceDiagramModal';

interface CreativeAnatomyDiagramProps {
  value: string;
  topicId?: string;
  diagramIndex?: number;
  isAdmin?: boolean;
  replacement?: DiagramReplacement | null;
  onUpdateReplacement?: (replacement: DiagramReplacement | null) => void;
}

interface DiagramPart {
  id: string;
  nameUz: string;
  nameLat: string;
  description: string;
  clinical: string;
}

export default function CreativeAnatomyDiagram({ 
  value,
  topicId,
  diagramIndex,
  isAdmin = false,
  replacement,
  onUpdateReplacement
}: CreativeAnatomyDiagramProps) {
  const [showRaw, setShowRaw] = useState(false);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);

  // Replacement state
  const [activeReplacement, setActiveReplacement] = useState<DiagramReplacement | null>(replacement || null);
  const [viewMode, setViewMode] = useState<'image' | 'diagram'>(replacement?.imageUrl ? 'image' : 'diagram');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    if (replacement !== undefined) {
      setActiveReplacement(replacement);
      if (replacement?.imageUrl) {
        setViewMode('image');
      }
    }
  }, [replacement]);

  // Stable diagram key and title
  const diagramKey = useMemo(() => getDiagramKey(value, diagramIndex), [value, diagramIndex]);
  const diagramTitle = useMemo(() => detectDiagramTitle(value), [value]);

  // Normalize input
  const normalizedValue = value.trim();

  // Detect which anatomical structure this text diagram corresponds to
  const diagramType = useMemo(() => {
    const text = normalizedValue.toLowerCase();
    
    if (text.includes('spinal_cord') || text.includes('medulla spinalis') || text.includes('orqa miya') || text.includes('orqa_miya') || text.includes('funiculus') || text.includes('cornu anterius') || text.includes('substantia grisea')) {
      return 'spinal_cord';
    }
    if (text.includes('cranial_nerves') || text.includes('12 juft') || text.includes('12_juft') || text.includes('bosh miya nerv') || text.includes('nervi craniales') || text.includes('trigeminus') || text.includes('oculomotorius') || text.includes('facialis')) {
      return 'cranial_nerves';
    }
    if (text.includes('fossa rhomboidea') || text.includes('fossa_rhomboidea') || text.includes('rombsimon chuqurcha') || text.includes('iv qorincha') || text.includes('ventriculus quartus') || text.includes('uzunchoq miya') || text.includes('medulla oblongata') || text.includes('pons') || text.includes('voroliy')) {
      return 'brainstem';
    }
    if (text.includes('cerebellum') || text.includes('miyacha') || text.includes('vermis') || text.includes('nucleus dentatus') || text.includes('pedunculus cerebellaris')) {
      return 'cerebellum';
    }
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

  const spinalCordParts = useMemo<Record<string, DiagramPart>>(() => ({
    cornu_anterius: {
      id: 'cornu_anterius',
      nameUz: 'Oldingi shox (Harakatlantiruvchi)',
      nameLat: 'Cornu anterius (ventrale)',
      description: 'Kulrang moddaning oldingi massiv qismi. Tarkibida yirik multipolyar alfa va gamma motoneyronlar joylashgan bo‘lib, ularning aksonlari oldingi ildizcha (radix anterior) tarkibida skelet muskullariga boradi.',
      clinical: 'Poliomielit (infektsion falajlik) va amiotrofik lateral skleroz (ALS / Sharko kasalligi)da aynan oldingi shox motoneyronlari zararlanadi, bu periferik falajlik, atrofiyalar va arefleksiyaga sabab bo‘ladi.'
    },
    cornu_posterius: {
      id: 'cornu_posterius',
      nameUz: 'Orqa shox (Sezuvchi)',
      nameLat: 'Cornu posterius (dorsale)',
      description: 'Kulrang moddaning orqa tomonidagi tor qismi. Tarkibida orqa ildizchalardan kelgan sezuvchi impulslarni qabul qiluvchi oraliq neyronlar, xususiy o‘zak (nucleus proprius) va rolandiy moddasi (substantia gelatinosa) joylashgan.',
      clinical: 'Orqa shox zararlanganda tegishli segmentlar sohasida og‘riq va harorat sezgisining dissotsiyalangan yo‘qolishi (masalan, siringomiyeliya kasalligida) kuzatiladi.'
    },
    cornu_laterale: {
      id: 'cornu_laterale',
      nameUz: 'Yon shox (Vegetativ / Simpatik)',
      nameLat: 'Cornu laterale (C8 - L2/L3)',
      description: 'Orqa miyaning C8-L2/L3 segmentlarida joylashgan bo‘lib, simpatik vegetativ nerv tizimining intermediolateral o‘zagini (nucleus intermediolateralis) o‘z ichiga oladi. S2-S4 segmentlarida esa chanoq a’zolari parasimpatik o‘zaklari bor.',
      clinical: 'C8-Th1 segmentlari yon shoxi zararlanganda Gorner (Bernard-Horner) sindromi: ptoz (qovoq tushishi), mioz (qorachiq torayishi) va angidroz (ter ajralmasligi) yuzaga keladi.'
    },
    funiculus_posterior: {
      id: 'funiculus_posterior',
      nameUz: 'Orqa tizimcha (Goll va Burdax yo‘llari)',
      nameLat: 'Funiculus posterior (Fasciculus gracilis et cuneatus)',
      description: 'Oq moddaning orqa qismi. Fasciculus gracilis (Goll — tana pastki qismi va oyoqlardan) va Fasciculus cuneatus (Burdax — tana yuqori qismi va qo‘llardan) ongli proprioseptiv (mushak-bo‘g‘im), tebranish va taktil sezgilarini bosh miya yarim sharlari po‘stlog‘iga eltadi.',
      clinical: 'Tabes dorsalis (orqa miya qurishi / kechki zaxm) va B12 vitamini yetishmovchiligida orqa tizimcha zararlanadi: bemor ko‘zini yumganda muvozanatni yo‘qotadi (Romberg musbat) va sezuvchi ataksiya rivojlanadi.'
    },
    funiculus_lateralis: {
      id: 'funiculus_lateralis',
      nameUz: 'Yon tizimcha (Piramida va Spinotalamik yo‘llar)',
      nameLat: 'Funiculus lateralis',
      description: 'Tarkibida harakatlantiruvchi asosiy piramida yo‘li (tr. corticospinalis lateralis), og‘riq va harorat sezgisi yo‘li (tr. spinothalamicus lateralis) hamda miyachaning orqa va oldingi yo‘llari (tr. spinocerebellaris posterior - Flechsig, tr. spinocerebellaris anterior - Gowers) o‘tadi.',
      clinical: 'Orqa miya yarmining kesilishi (Braun-Sekar sindromi)da zararlangan tomonda markaziy falajlik va propriosepsiya yo‘qolishi, qarama-qarshi tomonda esa og‘riq-harorat sezgisining yo‘qolishi kuzatiladi.'
    },
    funiculus_anterior: {
      id: 'funiculus_anterior',
      nameUz: 'Oldingi tizimcha (Oldingi piramida va vestibular yo‘llar)',
      nameLat: 'Funiculus anterior',
      description: 'Tarkibida oldingi piramida yo‘li (tr. corticospinalis anterior), tr. spinothalamicus anterior (qo‘pol taktil sezgi), tr. vestibulospinalis va tr. tectospinalis (ko‘rish va eshitishga javoban himoya reflekslari) o‘tadi.',
      clinical: 'Oldingi orqa miya arteriyasi (a. spinalis anterior) trombozida orqa tizimchadan tashqari barcha tizimchalar ishemiyaga uchrab, falajlik va og‘riq sezgisining yo‘qolishi yuzaga keladi.'
    },
    canalis_centralis: {
      id: 'canalis_centralis',
      nameUz: 'Markaziy kanal',
      nameLat: 'Canalis centralis',
      description: 'Orqa miyaning o‘rtasidan o‘tuvchi tor kanal bo‘lib, ependimotsitlar bilan qoplangan va miya-orqa miya suyuqligi (likvor) bilan to‘la. Yuqorida IV qorincha bilan, pastda esa ventriculus terminalis bilan tutashadi.',
      clinical: 'Siringomiyeliya kasalligida markaziy kanal kengayib bo‘shliqlar (kistalar) hosil qiladi va orqa miyaning oldingi oq birikmasini (commissura alba) ezib, "kurtka" shaklida dissotsiyalangan og‘riq-harorat anesteziyasini chaqiradi.'
    },
    radix_posterior: {
      id: 'radix_posterior',
      nameUz: 'Orqa sezuvchi ildiz va Ganglion spinale',
      nameLat: 'Radix posterior (sensoria) & Ganglion spinale',
      description: 'Ganglion spinale tarkibidagi soxta bir qutbli (psevdounipolyar) sezuvchi neyronlarning markaziy o‘simtalari orqa miyaga kirishidan hosil bo‘ladi. Bell-Majandi qonuniga ko‘ra: orqa ildizlar — sof sezuvchi, oldingi ildizlar — sof harakatlantiruvchidir.',
      clinical: 'Radikulit (radikulopatiya) va bel umurtqalari disk churralarida orqa ildizchalar qisilib, o‘ta kuchli o‘tkir ildizcha og‘riqlari (lyumbago, ishias) paydo bo‘ladi.'
    }
  }), []);

  const cranialNervesParts = useMemo<Record<string, DiagramPart>>(() => ({
    cn1_olfactorius: {
      id: 'cn1_olfactorius',
      nameUz: 'I juft — Hid biluvchi nerv',
      nameLat: 'Nervi olfactorii (CN I)',
      description: 'Sof sezuvchi nerv. Burun bo‘shlig‘ining hid biluvchi sohasidan boshlanib, lamina cribrosa (g‘alvirsimon plastinka) teshiklari orqali kalla bo‘shlig‘iga kiradi va bulbus olfactoriusga tutashadi.',
      clinical: 'Kalla suyagi oldingi chuqurchasi sinishi yoki o‘smalarida anosmiya (hid bilishning butunlay yo‘qolishi) yuzaga keladi.'
    },
    cn2_opticus: {
      id: 'cn2_opticus',
      nameUz: 'II juft — Ko‘ruv nervi',
      nameLat: 'Nervus opticus (CN II)',
      description: 'Sof sezuvchi nerv. Ko‘z to‘r pardasi (retina) ganglioz hujayralarining aksonlaridan hosil bo‘lib, canalis opticus orqali kalla bo‘shlig‘iga o‘tadi va chiasma opticum (ko‘ruv kesishuvi)ni hosil qiladi.',
      clinical: 'Chiasma opticum o‘rtasi gipofiz o‘smasi bilan ezilganda bitemporal gemianopsiya (ikki chetdan ko‘rishning yo‘qolishi) rivojlanadi.'
    },
    cn3_oculomotorius: {
      id: 'cn3_oculomotorius',
      nameUz: 'III juft — Ko‘z harakatlantiruvchi nerv',
      nameLat: 'Nervus oculomotorius (CN III)',
      description: 'Aralash (harakatlantiruvchi va parasimpatik) nerv. O‘rta miya oyoqchalari orasidagi chuqurchadan (fossa interpeduncularis) chiqib, fissura orbitalis superior orqali ko‘z kosasiga kiradi.',
      clinical: 'Zararlanganda: ptoz (yuqori qovoq osilishi), midriaz (kengaygan qorachiq), tashqariga-pastga g‘ilaylik va fotorefleksning yo‘qolishi kuzatiladi.'
    },
    cn4_trochlearis: {
      id: 'cn4_trochlearis',
      nameUz: 'IV juft — G‘altaksimon nerv',
      nameLat: 'Nervus trochlearis (CN IV)',
      description: 'Sof harakatlantiruvchi nerv. Miya poyasining ORQA yuzasidan chiquvchi yagona kranial nerv! Yuqori qiyshiq mushakni (m. obliquus superior) innervatsiya qiladi.',
      clinical: 'Zararlanganda bemor zinadan pastga tushayotganda diplopiya (narsalarning ikkita ko‘rinishi)dan shikoyat qiladi va boshini shikastlangan tomonga qarama-qarshi egadi.'
    },
    cn5_trigeminus: {
      id: 'cn5_trigeminus',
      nameUz: 'V juft — Uch shoxli nerv',
      nameLat: 'Nervus trigeminus (CN V: V1, V2, V3)',
      description: 'Aralash nerv. Voroliy ko‘prigi bilan o‘rta miyacha oyoqchasi chegarasidan chiqadi. 3 ta yirik shoxi bor: V1 n. ophthalmicus (fissura orbitalis superior), V2 n. maxillaris (foramen rotundum), V3 n. mandibularis (foramen ovale).',
      clinical: 'Trigeminal nevralgiya (Foterjil kasalligi)da yuz sohasida qisqa muddatli "elektr toki urgandek" chidab bo‘lmas kuchli xurujli og‘riqlar paydo bo‘ladi.'
    },
    cn6_abducens: {
      id: 'cn6_abducens',
      nameUz: 'VI juft — Uzoqlashtiruvchi nerv',
      nameLat: 'Nervus abducens (CN VI)',
      description: 'Harakatlantiruvchi nerv. Ko‘prik bilan uzunchoq miya piramidasi orasidagi egatdan chiqib, fissura orbitalis superior orqali ko‘zning tashqi to‘g‘ri mushagiga (m. rectus lateralis) boradi.',
      clinical: 'Zararlanganda ko‘z olmasi tashqariga burilmaydi va ichkariga g‘ilaylik (strabismus convergens) yuzaga keladi.'
    },
    cn7_facialis: {
      id: 'cn7_facialis',
      nameUz: 'VII juft — Yuz nervi (va oraliq nerv)',
      nameLat: 'Nervus facialis et intermedius (CN VII)',
      description: 'Aralash nerv. Ko‘prik-miyacha burchagidan (angulus pontocerebellaris) chiqadi, porus acusticus internusga kirib, canalis facialis orqali foramen stylomastoideumdan bosh suyagidan chiqadi.',
      clinical: 'Bell falaji (yuz nervining periferik nevriti)da yuzning bir yarmi qimirlamay qoladi: ko‘z yumilmaydi (lagoftalm), peshona burishmaydi, og‘iz burchagi osilib qoladi va tilning oldingi 2/3 qismida ta’m bilish yo‘qoladi.'
    },
    cn8_vestibulocochlearis: {
      id: 'cn8_vestibulocochlearis',
      nameUz: 'VIII juft — Dahliz-chig‘anoq nervi',
      nameLat: 'Nervus vestibulocochlearis (CN VIII)',
      description: 'Sof sezuvchi nerv (muvozanat va eshitish). Ko‘prik-miyacha burchagidan chiqadi va porus acusticus internus orqali ichki quloq labirintiga boradi.',
      clinical: 'Akustik nevrinoma (vestibulyar shvannoma)da bir tomonlama quloq shang‘illashi, eshitish pasayishi va bosh aylanishi (vertigo) kuzatiladi.'
    },
    cn9_glossopharyngeus: {
      id: 'cn9_glossopharyngeus',
      nameUz: 'IX juft — Til-yutqin nervi',
      nameLat: 'Nervus glossopharyngeus (CN IX)',
      description: 'Aralash nerv. Uzunchoq miya zaytuni orqasidagi egatdan (sulcus retroolivaris) chiqib, foramen jugulare orqali bosh suyagidan chiqadi. Yutqin mushaklarini, parotid so‘lak bezini va tilning orqa 1/3 qismi ta’m sezgisini ta’minlaydi.',
      clinical: 'Zararlanganda yutish buziladi (disfagiya), yutqin refleksi yo‘qoladi va tilning orqa 1/3 qismida achchiq ta’m sezilmaydi.'
    },
    cn10_vagus: {
      id: 'cn10_vagus',
      nameUz: 'X juft — Sayyor nerv',
      nameLat: 'Nervus vagus (CN X)',
      description: 'Eng uzun kranial nerv. Sulcus retroolivarisdan chiqib, foramen jugulare orqali bo‘yin, ko‘krak va qorin bo‘shlig‘i a’zolariga (ko‘ndalang chambar ichakning chap burchagigacha) parasimpatik va sezuvchi tolalarni yetkazadi.',
      clinical: 'Ikki tomonlama zararlanishi o‘limga olib keladi (yurak to‘xtashi, nafas falaji). Bir tomonlama jarohatda ovoz bo‘g‘ilishi (n. laryngeus recurrens falaji), disfagiya va yumshoq tanglayning sog‘lom tomonga og‘ishi kuzatiladi.'
    },
    cn11_accessorius: {
      id: 'cn11_accessorius',
      nameUz: 'XI juft — Qo‘shimcha nerv',
      nameLat: 'Nervus accessorius (CN XI)',
      description: 'Sof harakatlantiruvchi nerv. Uzunchoq miya va C1-C5 orqa miya segmentlaridan boshlanib, foramen jugulare orqali chiqadi. To‘sh-o‘mrov-so‘rg‘ichsimon mushak (m. sternocleidomastoideus) va trapetsiyasimon mushakni (m. trapezius) innervatsiya qiladi.',
      clinical: 'Zararlanganda yelkani ko‘tarish (yelka qisish) qiyinlashadi va boshni qarama-qarshi tomonga burish falajlanadi.'
    },
    cn12_hypoglossus: {
      id: 'cn12_hypoglossus',
      nameUz: 'XII juft — Tilosti nervi',
      nameLat: 'Nervus hypoglossus (CN XII)',
      description: 'Sof harakatlantiruvchi nerv. Uzunchoq miyaning piramida va zaytuni orasidagi oldingi yon egatdan (sulcus anterolateralis) chiqadi va canalis nervi hypoglossi orqali kalla suyagidan chiqadi.',
      clinical: 'Bir tomonlama zararlanganda bemor tilini tashqariga chiqarganda til uchining shikastlangan tomonga og‘ishi (deviatsiya) va til yarmining atrofiyasi kuzatiladi.'
    }
  }), []);

  const brainstemParts = useMemo<Record<string, DiagramPart>>(() => ({
    pyramides: {
      id: 'pyramides',
      nameUz: 'Uzunchoq miya piramidalari va kesishuvi',
      nameLat: 'Pyramides medullae oblongatae & Decussatio pyramidum',
      description: 'Uzunchoq miyaning old yuzasidagi ikkita bo‘ylama bo‘rtma. Ularning ichidan bosh miya po‘stlog‘idan kelayotgan bosh harakat yo‘li (tr. corticospinalis) o‘tadi. Pastki qismida tolalarning 80-85% kesishib (decussatio pyramidum) orqa miyaning yon tizimchasiga o‘tadi.',
      clinical: 'Piramidalar sohasidagi insult yoki shikastlanish qarama-qarshi tana yarmida markaziy gemiparez (falajlik) va Babinskiy kabi patologik reflekslarning paydo bo‘lishiga olib keladi.'
    },
    olivae: {
      id: 'olivae',
      nameUz: 'Zaytunlar va pastki zaytun o‘zagi',
      nameLat: 'Olivae & Nucleus olivaris inferior',
      description: 'Piramidalarning ikki yonida joylashgan oval shakldagi bo‘rtiqlar. Ichida tishsimon buralgan nucleus olivaris inferior joylashgan bo‘lib, u miyacha bilan uzviy bog‘lanib (tr. olivocerebellaris), harakatlar koordinatsiyasida ishtirok etadi.',
      clinical: 'Zaytun orqasidagi egatdan (sulcus retroolivaris) IX, X, XI nervlar chiqadi. PICA (orqa pastki miyacha arteriyasi) trombozida Vallenberg-Zaxarchenko sindromi yuzaga keladi.'
    },
    fossa_rhomboidea: {
      id: 'fossa_rhomboidea',
      nameUz: 'Rombsimon chuqurcha (IV qorincha tubi)',
      nameLat: 'Fossa rhomboidea (Fundus ventriculi quarti)',
      description: 'Uzunchoq miya va ko‘prikning orqa yuzasi hosil qilgan romb shaklidagi maydon. Unda V, VI, VII, VIII, IX, X, XI, XII juft kranial nervlarning barcha o‘zaklari qat’iy topografik tartibda joylashgan.',
      clinical: 'Rombsimon chuqurcha markazida hayotiy muhim nafas va qon aylanish markazlari joylashgan. Uning siqilishi zudlik bilan asfiksiya va o‘limga olib keladi.'
    },
    sulcus_basilaris: {
      id: 'sulcus_basilaris',
      nameUz: 'Ko‘prikning asosiy egati (Sulcus basilaris)',
      nameLat: 'Sulcus basilaris pontis',
      description: 'Voroliy ko‘prigining oldingi qavariq yuzasining o‘rtasidagi bo‘ylama egat. Undan bosh miyani qon bilan ta’minlovchi eng yirik tomirlardan biri — a. basilaris (asosiy arteriya) o‘tadi.',
      clinical: 'Basilar arteriya trombozi (Locked-in sindromi / "qamalgan odam" sindromi)ga sabab bo‘ladi: bemor hamma narsani tushunadi va eshitadi, lekin ko‘zning vertikal harakatidan boshqa barcha tana muskullari to‘liq falajlanadi.'
    },
    ventriculus_quartus: {
      id: 'ventriculus_quartus',
      nameUz: 'IV Qorincha va teshiklari (Majandi va Lyushka)',
      nameLat: 'Ventriculus quartus & Apertura mediana / laterales',
      description: 'Miya poyasi va miyacha orasidagi chodirsimon bo‘shliq. Silviy suv yo‘li orqali III qorinchadan likvorni qabul qiladi va Apertura mediana (Majandi) hamda Aperturae laterales (Lyushka) teshiklari orqali subaraxnoid bo‘shliqqa o‘tkazadi.',
      clinical: 'Ushbu teshiklar yopilib qolsa (masalan, Dandi-Uolker anomaliyasi yoki o‘smalarda) okklyuzion (tutashmagan) gidrosefaliya — bosh miya ichki bosimining keskin oshishi rivojlanadi.'
    }
  }), []);

  const cerebellumParts = useMemo<Record<string, DiagramPart>>(() => ({
    hemispherium: {
      id: 'hemispherium',
      nameUz: 'Miyacha yarim sharlari (Neocerebellum)',
      nameLat: 'Hemispheria cerebelli',
      description: 'Miyachaning ikki chetidagi yirik qismlari. Po‘stlog‘i va tishsimon o‘zagi (nucleus dentatus) orqali bosh miya po‘stlog‘idan keluvchi buyruqlarni qayta ishlab, nozik, murakkab va maqsadli ixtiyoriy harakatlarni muvofiqlashtiradi.',
      clinical: 'Miyacha yarim sharlari zararlanganda zararlangan tomonda ataksiya, dismetriya (mo‘ljalga tegmaslik), intension qaltirash (harakat oxirida titrash) va adiadoxokinez kuzatiladi.'
    },
    vermis: {
      id: 'vermis',
      nameUz: 'Miyacha chuvalchangi (Paleocerebellum / Archicerebellum)',
      nameLat: 'Vermis cerebelli',
      description: 'Ikki yarim sharni o‘rtada tutashtiruvchi toq qism. Tana o‘qining (gavda) muvozanatini, qomatni tik tutishni va yurishdagi sinergik harakatlarni boshqaradi.',
      clinical: 'Chuvalchang o‘smalari (bolalarda medulloblastoma)da "mast odamdek chayqalib yurish" (gavda ataksiyasi) va orqaga qarab yiqilish xarakterlidir.'
    },
    deep_nuclei: {
      id: 'deep_nuclei',
      nameUz: 'Miyachaning 4 juft chuqur o‘zaklari',
      nameLat: 'Nuclei cerebelli (Dentatus, Emboliformis, Globosus, Fastigii)',
      description: 'Miyacha oq moddasi ichidagi o‘zaklar (Yodlash mnemonikasi: Don\'t Eat Greasy Food). 1. Nucleus dentatus (eng kattasi), 2. Nucleus emboliformis, 3. Nucleus globosus, 4. Nucleus fastigii (tom o‘zagi).',
      clinical: 'Ushbu o‘zaklar miyacha po‘stlog‘ining Purkinye hujayralaridan tormozlovchi signallarni qabul qilib, talamus va qizil o‘zakka efferent signallar yuboradi.'
    },
    pedunculi: {
      id: 'pedunculi',
      nameUz: 'Miyachaning 3 juft oyoqchalari',
      nameLat: 'Pedunculi cerebellaris (Superior, Medius, Inferior)',
      description: '1. Yuqori oyoqcha (o‘rta miyaga — asosan efferent tr. cerebellorubralis/thalamicus), 2. O‘rta oyoqcha (eng yo‘g‘oni, ko‘prikdan tr. pontocerebellaris), 3. Pastki oyoqcha (uzunchoq miyadan — tr. spinocerebellaris posterior va tr. olivocerebellaris).',
      clinical: 'Oyoqchalar insulti miyacha ataksiyasi va miya poyasi kranial nervlari zararlanishi bilan birga kechuvchi alternatsiyalovchi sindromlarni beradi.'
    }
  }), []);

  // Set default initial screen if needed
  const activePartObj = selectedPart ? (
    diagramType === 'spinal_cord' ? spinalCordParts[selectedPart] :
    diagramType === 'cranial_nerves' ? cranialNervesParts[selectedPart] :
    diagramType === 'brainstem' ? brainstemParts[selectedPart] :
    diagramType === 'cerebellum' ? cerebellumParts[selectedPart] :
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
          <div className={`p-2 rounded-xl ${
            activeReplacement && viewMode === 'image'
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-gradient-to-tr from-brand-accent/20 to-indigo-500/20 text-indigo-600'
          }`}>
            {activeReplacement && viewMode === 'image' ? (
              <ImageIcon className="h-5 w-5 animate-pulse" />
            ) : (
              <Sparkles className="h-5 w-5 animate-pulse" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-brand-primary uppercase tracking-wider block">
                {activeReplacement && viewMode === 'image' 
                  ? (activeReplacement.title || diagramTitle) 
                  : (diagramType === 'flowchart' ? 'Oqim Tarmoqlari Visualizatori' : '3D Interaktiv Anatomik Atlas')}
              </h4>
              {activeReplacement && (
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase rounded-md flex items-center gap-1 tracking-wider">
                  <Check className="w-3 h-3 text-emerald-600" /> Atlas Rasmi
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-500 font-medium block">
              {activeReplacement && viewMode === 'image'
                ? "Haqiqiy tibbiy atlas tasviri va anatomik preparat fotosurati"
                : (diagramType === 'flowchart' ? 'Tizimli sxemaning toza grafik modeli' : "A'zoning barcha qirra va yuzalarini tanlab organining borgan sari o'rganing")}
            </span>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {/* Toggle between Image and Diagram if replacement exists */}
          {activeReplacement?.imageUrl && (
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'image' ? 'diagram' : 'image')}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-all shadow-xs cursor-pointer"
            >
              {viewMode === 'image' ? (
                <>
                  <Code className="h-3.5 w-3.5" />
                  Asl sxemani ko'rish
                </>
              ) : (
                <>
                  <ImageIcon className="h-3.5 w-3.5" />
                  Atlas rasmini ko'rish
                </>
              )}
            </button>
          )}

          {/* Code/ASCII View button */}
          <button 
            type="button"
            onClick={() => setShowRaw(true)} 
            className="flex items-center gap-1.5 rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <Code className="h-3.5 w-3.5 text-slate-400" />
            ASCII
          </button>

          {/* Admin Image Replacement Button */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all shadow-sm cursor-pointer ${
                activeReplacement
                  ? 'bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
              }`}
              title="Admin huquqi: Ushbu sxemani haqiqiy rasmga almashtirish"
            >
              {activeReplacement ? (
                <>
                  <Edit className="h-3.5 w-3.5" />
                  Rasmni o'zgartirish
                </>
              ) : (
                <>
                  <Upload className="h-3.5 w-3.5" />
                  Rasmga almashtirish (Admin)
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="p-6 md:p-8">
        {/* Active Replacement Banner in Diagram mode */}
        {activeReplacement?.imageUrl && viewMode === 'diagram' && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-emerald-800 text-xs font-bold">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Ushbu mavzu uchun haqiqiy tibbiy atlas rasmi yuklangan.</span>
            </div>
            <button
              type="button"
              onClick={() => setViewMode('image')}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer shrink-0"
            >
              Rasmni ochish
            </button>
          </div>
        )}

        {/* 1. Real Medical Image View */}
        {activeReplacement?.imageUrl && viewMode === 'image' ? (
          <div className="space-y-4">
            <div className="relative group overflow-hidden rounded-3xl bg-slate-950 border border-slate-200/80 shadow-inner flex items-center justify-center min-h-[350px]">
              <img
                src={activeReplacement.imageUrl}
                alt={activeReplacement.caption || diagramTitle}
                referrerPolicy="no-referrer"
                className="w-full max-h-[600px] object-contain cursor-zoom-in transition-transform duration-300 group-hover:scale-[1.01]"
                onClick={() => setIsLightboxOpen(true)}
              />

              {/* Hover overlay hint */}
              <div 
                onClick={() => setIsLightboxOpen(true)}
                className="absolute top-4 right-4 bg-slate-900/80 hover:bg-slate-900 text-white px-3.5 py-2 rounded-2xl backdrop-blur-md cursor-pointer shadow-lg transition-all flex items-center gap-2 text-xs font-bold border border-white/10"
              >
                <ZoomIn className="w-4 h-4 text-emerald-400" /> Kattalashtirish
              </div>
            </div>

            {/* Caption & Metadata */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <p className="text-xs text-slate-700 font-semibold">
                  {activeReplacement.caption || diagramTitle}
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                Atlas Tasviri
              </span>
            </div>
          </div>
        ) : diagramType === 'flowchart' ? (
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

              {diagramType === 'spinal_cord' && (
                <svg viewBox="0 0 360 320" className="w-full max-w-[320px] h-auto drop-shadow-xl select-none">
                  <defs>
                    <linearGradient id="sc-white" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F8FAFC" />
                      <stop offset="100%" stopColor="#E2E8F0" />
                    </linearGradient>
                    <linearGradient id="sc-gray" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#CBD5E1" />
                      <stop offset="100%" stopColor="#94A3B8" />
                    </linearGradient>
                  </defs>

                  {/* Spinal Cord Contour (White Matter outer circle/oval) */}
                  <path
                    d="M 180 45 C 265 45, 320 100, 320 170 C 320 240, 260 285, 185 285 L 180 250 L 175 285 C 100 285, 40 240, 40 170 C 40 100, 95 45, 180 45 Z"
                    fill="url(#sc-white)"
                    stroke="#475569"
                    strokeWidth="3.5"
                  />

                  {/* Fissura mediana anterior (Anterior median fissure - bottom) */}
                  <path d="M 180 285 L 180 215" stroke="#334155" strokeWidth="3.5" strokeLinecap="round" />

                  {/* Sulcus medianus posterior (Posterior median sulcus - top) */}
                  <path d="M 180 45 L 180 120" stroke="#64748B" strokeWidth="2" strokeDasharray="3 3" />

                  {/* Funiculus Posterior (Top White Matter) */}
                  <path
                    d="M 180 46 C 225 46, 265 75, 275 115 L 220 125 L 180 120 L 140 125 L 85 115 C 95 75, 135 46, 180 46 Z"
                    fill={selectedPart === 'funiculus_posterior' ? '#BAE6FD' : 'transparent'}
                    stroke={selectedPart === 'funiculus_posterior' ? '#0284C7' : 'transparent'}
                    strokeWidth="2.5"
                    className="cursor-pointer transition-all hover:fill-sky-100/60"
                    onClick={() => setSelectedPart('funiculus_posterior')}
                  />

                  {/* Funiculus Lateralis (Left & Right Lateral White Matter) */}
                  <path
                    d="M 275 115 C 315 145, 315 205, 275 245 L 235 200 L 220 125 Z"
                    fill={selectedPart === 'funiculus_lateralis' ? '#BAE6FD' : 'transparent'}
                    stroke={selectedPart === 'funiculus_lateralis' ? '#0284C7' : 'transparent'}
                    strokeWidth="2.5"
                    className="cursor-pointer transition-all hover:fill-sky-100/60"
                    onClick={() => setSelectedPart('funiculus_lateralis')}
                  />
                  <path
                    d="M 85 115 C 45 145, 45 205, 85 245 L 125 200 L 140 125 Z"
                    fill={selectedPart === 'funiculus_lateralis' ? '#BAE6FD' : 'transparent'}
                    stroke={selectedPart === 'funiculus_lateralis' ? '#0284C7' : 'transparent'}
                    strokeWidth="2.5"
                    className="cursor-pointer transition-all hover:fill-sky-100/60"
                    onClick={() => setSelectedPart('funiculus_lateralis')}
                  />

                  {/* Funiculus Anterior (Bottom White Matter) */}
                  <path
                    d="M 185 284 C 235 284, 275 255, 275 245 L 215 205 L 185 215 Z"
                    fill={selectedPart === 'funiculus_anterior' ? '#BAE6FD' : 'transparent'}
                    stroke={selectedPart === 'funiculus_anterior' ? '#0284C7' : 'transparent'}
                    strokeWidth="2.5"
                    className="cursor-pointer transition-all hover:fill-sky-100/60"
                    onClick={() => setSelectedPart('funiculus_anterior')}
                  />
                  <path
                    d="M 175 284 C 125 284, 85 255, 85 245 L 145 205 L 175 215 Z"
                    fill={selectedPart === 'funiculus_anterior' ? '#BAE6FD' : 'transparent'}
                    stroke={selectedPart === 'funiculus_anterior' ? '#0284C7' : 'transparent'}
                    strokeWidth="2.5"
                    className="cursor-pointer transition-all hover:fill-sky-100/60"
                    onClick={() => setSelectedPart('funiculus_anterior')}
                  />

                  {/* Gray Matter - Butterfly Wings (Substantia Grisea) */}
                  {/* Left Posterior Horn */}
                  <path
                    d="M 170 155 C 160 145, 140 100, 130 90 C 120 95, 125 125, 140 145 Z"
                    fill={selectedPart === 'cornu_posterius' ? '#38BDF8' : '#64748B'}
                    stroke="#334155"
                    strokeWidth="2"
                    className="cursor-pointer transition-all hover:fill-sky-400"
                    onClick={() => setSelectedPart('cornu_posterius')}
                  />
                  {/* Right Posterior Horn */}
                  <path
                    d="M 190 155 C 200 145, 220 100, 230 90 C 240 95, 235 125, 220 145 Z"
                    fill={selectedPart === 'cornu_posterius' ? '#38BDF8' : '#64748B'}
                    stroke="#334155"
                    strokeWidth="2"
                    className="cursor-pointer transition-all hover:fill-sky-400"
                    onClick={() => setSelectedPart('cornu_posterius')}
                  />

                  {/* Left Lateral Horn */}
                  <path
                    d="M 155 160 C 140 155, 120 160, 115 170 C 120 180, 140 180, 155 175 Z"
                    fill={selectedPart === 'cornu_laterale' ? '#F43F5E' : '#94A3B8'}
                    stroke="#334155"
                    strokeWidth="2"
                    className="cursor-pointer transition-all hover:fill-rose-400"
                    onClick={() => setSelectedPart('cornu_laterale')}
                  />
                  {/* Right Lateral Horn */}
                  <path
                    d="M 205 160 C 220 155, 240 160, 245 170 C 240 180, 220 180, 205 175 Z"
                    fill={selectedPart === 'cornu_laterale' ? '#F43F5E' : '#94A3B8'}
                    stroke="#334155"
                    strokeWidth="2"
                    className="cursor-pointer transition-all hover:fill-rose-400"
                    onClick={() => setSelectedPart('cornu_laterale')}
                  />

                  {/* Left Anterior Horn (Big Motor) */}
                  <path
                    d="M 165 175 C 150 185, 130 195, 135 220 C 155 225, 170 205, 175 185 Z"
                    fill={selectedPart === 'cornu_anterius' ? '#10B981' : '#475569'}
                    stroke="#1E293B"
                    strokeWidth="2"
                    className="cursor-pointer transition-all hover:fill-emerald-400"
                    onClick={() => setSelectedPart('cornu_anterius')}
                  />
                  {/* Right Anterior Horn (Big Motor) */}
                  <path
                    d="M 195 175 C 210 185, 230 195, 225 220 C 205 225, 190 205, 185 185 Z"
                    fill={selectedPart === 'cornu_anterius' ? '#10B981' : '#475569'}
                    stroke="#1E293B"
                    strokeWidth="2"
                    className="cursor-pointer transition-all hover:fill-emerald-400"
                    onClick={() => setSelectedPart('cornu_anterius')}
                  />

                  {/* Central Commisura & Canalis centralis */}
                  <rect x="165" y="160" width="30" height="20" rx="6" fill="#64748B" />
                  <circle
                    cx="180" cy="170" r="5"
                    fill={selectedPart === 'canalis_centralis' ? '#38BDF8' : '#0284C7'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="cursor-pointer animate-pulse"
                    onClick={() => setSelectedPart('canalis_centralis')}
                  />

                  {/* Posterior Roots & Ganglion (Top-right) */}
                  <path d="M 230 90 Q 280 60, 310 75" fill="none" stroke="#F59E0B" strokeWidth="3" />
                  <ellipse
                    cx="315" cy="80" rx="14" ry="9"
                    fill={selectedPart === 'radix_posterior' ? '#F59E0B' : '#FCD34D'}
                    stroke="#D97706"
                    strokeWidth="2"
                    className="cursor-pointer"
                    onClick={() => setSelectedPart('radix_posterior')}
                  />

                  {/* Hotspot buttons */}
                  <circle cx="180" cy="75" r="5" fill="#0284c7" stroke="#fff" strokeWidth="1.5" className="cursor-pointer" onClick={() => setSelectedPart('funiculus_posterior')} />
                  <circle cx="280" cy="180" r="5" fill="#0284c7" stroke="#fff" strokeWidth="1.5" className="cursor-pointer" onClick={() => setSelectedPart('funiculus_lateralis')} />
                  <circle cx="215" cy="245" r="5" fill="#0284c7" stroke="#fff" strokeWidth="1.5" className="cursor-pointer" onClick={() => setSelectedPart('funiculus_anterior')} />
                  <circle cx="225" cy="110" r="5" fill="#38bdf8" stroke="#fff" strokeWidth="1.5" className="cursor-pointer" onClick={() => setSelectedPart('cornu_posterius')} />
                  <circle cx="215" cy="205" r="5" fill="#10b981" stroke="#fff" strokeWidth="1.5" className="cursor-pointer" onClick={() => setSelectedPart('cornu_anterius')} />
                  <circle cx="230" cy="170" r="5" fill="#f43f5e" stroke="#fff" strokeWidth="1.5" className="cursor-pointer" onClick={() => setSelectedPart('cornu_laterale')} />
                </svg>
              )}

              {diagramType === 'cranial_nerves' && (
                <div className="w-full flex flex-col items-center justify-center p-2">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">
                    Bosh miya asosi: 12 juft nervlar
                  </div>
                  <div className="grid grid-cols-3 gap-2 w-full max-w-[290px]">
                    {[
                      { id: 'cn1_olfactorius', label: 'I Olfactorius', color: 'bg-amber-100 border-amber-300 text-amber-900' },
                      { id: 'cn2_opticus', label: 'II Opticus', color: 'bg-amber-100 border-amber-300 text-amber-900' },
                      { id: 'cn3_oculomotorius', label: 'III Oculomotor', color: 'bg-emerald-100 border-emerald-300 text-emerald-900' },
                      { id: 'cn4_trochlearis', label: 'IV Trochlearis', color: 'bg-emerald-100 border-emerald-300 text-emerald-900' },
                      { id: 'cn5_trigeminus', label: 'V Trigeminus', color: 'bg-purple-100 border-purple-300 text-purple-900' },
                      { id: 'cn6_abducens', label: 'VI Abducens', color: 'bg-emerald-100 border-emerald-300 text-emerald-900' },
                      { id: 'cn7_facialis', label: 'VII Facialis', color: 'bg-purple-100 border-purple-300 text-purple-900' },
                      { id: 'cn8_vestibulocochlearis', label: 'VIII Vestibulo.', color: 'bg-amber-100 border-amber-300 text-amber-900' },
                      { id: 'cn9_glossopharyngeus', label: 'IX Glossophar.', color: 'bg-purple-100 border-purple-300 text-purple-900' },
                      { id: 'cn10_vagus', label: 'X Vagus', color: 'bg-purple-100 border-purple-300 text-purple-900' },
                      { id: 'cn11_accessorius', label: 'XI Accessorius', color: 'bg-emerald-100 border-emerald-300 text-emerald-900' },
                      { id: 'cn12_hypoglossus', label: 'XII Hypogloss.', color: 'bg-emerald-100 border-emerald-300 text-emerald-900' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedPart(item.id)}
                        className={`p-2 rounded-xl border text-[10px] font-black tracking-tight transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 ${
                          selectedPart === item.id
                            ? 'ring-2 ring-indigo-600 ring-offset-2 bg-indigo-600 text-white font-extrabold shadow-md'
                            : item.color
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {diagramType === 'brainstem' && (
                <svg viewBox="0 0 320 320" className="w-full max-w-[280px] h-auto drop-shadow-xl select-none">
                  {/* Pons (Top bulging block) */}
                  <rect
                    x="80" y="50" width="160" height="90" rx="20"
                    fill={selectedPart === 'sulcus_basilaris' ? '#E0F2FE' : '#CBD5E1'}
                    stroke={selectedPart === 'sulcus_basilaris' ? '#0284C7' : '#475569'}
                    strokeWidth="3.5"
                    className="cursor-pointer transition-all"
                    onClick={() => setSelectedPart('sulcus_basilaris')}
                  />
                  {/* Sulcus Basilaris (Center line in pons) */}
                  <line x1="160" y1="50" x2="160" y2="140" stroke="#334155" strokeWidth="4" />

                  {/* Medulla Oblongata (Bottom tapering cone) */}
                  <path
                    d="M 100 140 L 220 140 L 195 270 L 125 270 Z"
                    fill="#F1F5F9"
                    stroke="#475569"
                    strokeWidth="3.5"
                  />

                  {/* Left Pyramid */}
                  <path
                    d="M 125 140 L 155 140 L 155 240 L 135 240 Z"
                    fill={selectedPart === 'pyramides' ? '#BAE6FD' : '#94A3B8'}
                    stroke={selectedPart === 'pyramides' ? '#0284C7' : '#64748B'}
                    strokeWidth="2"
                    className="cursor-pointer"
                    onClick={() => setSelectedPart('pyramides')}
                  />
                  {/* Right Pyramid */}
                  <path
                    d="M 165 140 L 195 140 L 185 240 L 165 240 Z"
                    fill={selectedPart === 'pyramides' ? '#BAE6FD' : '#94A3B8'}
                    stroke={selectedPart === 'pyramides' ? '#0284C7' : '#64748B'}
                    strokeWidth="2"
                    className="cursor-pointer"
                    onClick={() => setSelectedPart('pyramides')}
                  />

                  {/* Decussatio pyramidum (X crossing at bottom of pyramids) */}
                  <line x1="150" y1="235" x2="170" y2="255" stroke="#0F172A" strokeWidth="3" />
                  <line x1="170" y1="235" x2="150" y2="255" stroke="#0F172A" strokeWidth="3" />

                  {/* Left Olive */}
                  <ellipse
                    cx="110" cy="180" rx="9" ry="18"
                    fill={selectedPart === 'olivae' ? '#F43F5E' : '#64748B'}
                    stroke="#334155"
                    strokeWidth="2"
                    className="cursor-pointer"
                    onClick={() => setSelectedPart('olivae')}
                  />
                  {/* Right Olive */}
                  <ellipse
                    cx="210" cy="180" rx="9" ry="18"
                    fill={selectedPart === 'olivae' ? '#F43F5E' : '#64748B'}
                    stroke="#334155"
                    strokeWidth="2"
                    className="cursor-pointer"
                    onClick={() => setSelectedPart('olivae')}
                  />

                  {/* IV Ventricle & Rhomboid Fossa overlay button */}
                  <polygon
                    points="160,75 200,120 160,165 120,120"
                    fill={selectedPart === 'fossa_rhomboidea' ? '#38BDF8' : 'rgba(56, 189, 248, 0.25)'}
                    stroke="#0284C7"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    className="cursor-pointer hover:fill-sky-300"
                    onClick={() => setSelectedPart('fossa_rhomboidea')}
                  />

                  {/* Hotspots */}
                  <circle cx="160" cy="90" r="5" fill="#0284c7" stroke="#fff" strokeWidth="1.5" className="cursor-pointer" onClick={() => setSelectedPart('sulcus_basilaris')} />
                  <circle cx="140" cy="180" r="5" fill="#0284c7" stroke="#fff" strokeWidth="1.5" className="cursor-pointer" onClick={() => setSelectedPart('pyramides')} />
                  <circle cx="110" cy="180" r="5" fill="#f43f5e" stroke="#fff" strokeWidth="1.5" className="cursor-pointer" onClick={() => setSelectedPart('olivae')} />
                  <circle cx="160" cy="120" r="5" fill="#38bdf8" stroke="#fff" strokeWidth="1.5" className="cursor-pointer" onClick={() => setSelectedPart('fossa_rhomboidea')} />
                </svg>
              )}

              {diagramType === 'cerebellum' && (
                <svg viewBox="0 0 320 320" className="w-full max-w-[280px] h-auto drop-shadow-xl select-none">
                  {/* Left Hemisphere */}
                  <ellipse
                    cx="100" cy="160" rx="65" ry="75"
                    fill={selectedPart === 'hemispherium' ? '#BAE6FD' : '#CBD5E1'}
                    stroke={selectedPart === 'hemispherium' ? '#0284C7' : '#475569'}
                    strokeWidth="3.5"
                    className="cursor-pointer transition-all hover:fill-sky-100"
                    onClick={() => setSelectedPart('hemispherium')}
                  />
                  {/* Right Hemisphere */}
                  <ellipse
                    cx="220" cy="160" rx="65" ry="75"
                    fill={selectedPart === 'hemispherium' ? '#BAE6FD' : '#CBD5E1'}
                    stroke={selectedPart === 'hemispherium' ? '#0284C7' : '#475569'}
                    strokeWidth="3.5"
                    className="cursor-pointer transition-all hover:fill-sky-100"
                    onClick={() => setSelectedPart('hemispherium')}
                  />

                  {/* Vermis (Center worm) */}
                  <rect
                    x="140" y="90" width="40" height="140" rx="20"
                    fill={selectedPart === 'vermis' ? '#F43F5E' : '#94A3B8'}
                    stroke={selectedPart === 'vermis' ? '#BE123C' : '#334155'}
                    strokeWidth="3"
                    className="cursor-pointer transition-all hover:fill-rose-200"
                    onClick={() => setSelectedPart('vermis')}
                  />
                  {/* Vermis Segments */}
                  <line x1="140" y1="120" x2="180" y2="120" stroke="#475569" strokeWidth="2" />
                  <line x1="140" y1="150" x2="180" y2="150" stroke="#475569" strokeWidth="2" />
                  <line x1="140" y1="180" x2="180" y2="180" stroke="#475569" strokeWidth="2" />
                  <line x1="140" y1="205" x2="180" y2="205" stroke="#475569" strokeWidth="2" />

                  {/* Deep Nuclei (Dentate, Emboliform, Globose, Fastigii) */}
                  <path
                    d="M 85 140 Q 95 130, 105 140 Q 115 150, 105 160 Q 95 170, 85 160 Z"
                    fill={selectedPart === 'deep_nuclei' ? '#10B981' : '#334155'}
                    className="cursor-pointer"
                    onClick={() => setSelectedPart('deep_nuclei')}
                  />
                  <path
                    d="M 235 140 Q 225 130, 215 140 Q 205 150, 215 160 Q 225 170, 235 160 Z"
                    fill={selectedPart === 'deep_nuclei' ? '#10B981' : '#334155'}
                    className="cursor-pointer"
                    onClick={() => setSelectedPart('deep_nuclei')}
                  />

                  {/* Hotspots */}
                  <circle cx="75" cy="160" r="5" fill="#0284c7" stroke="#fff" strokeWidth="1.5" className="cursor-pointer" onClick={() => setSelectedPart('hemispherium')} />
                  <circle cx="160" cy="150" r="5" fill="#f43f5e" stroke="#fff" strokeWidth="1.5" className="cursor-pointer" onClick={() => setSelectedPart('vermis')} />
                  <circle cx="100" cy="150" r="5" fill="#10b981" stroke="#fff" strokeWidth="1.5" className="cursor-pointer" onClick={() => setSelectedPart('deep_nuclei')} />
                </svg>
              )}

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
                    {diagramType === 'spinal_cord' && Object.keys(spinalCordParts).map(key => (
                      <button 
                        key={key} 
                        onClick={() => setSelectedPart(key)}
                        className="px-2.5 py-1.5 bg-white hover:bg-sky-50 border border-slate-200 text-[10px] font-bold rounded-lg text-slate-700 hover:text-sky-700 transition-all shadow-sm cursor-pointer"
                      >
                        {spinalCordParts[key].nameUz}
                      </button>
                    ))}
                    {diagramType === 'cranial_nerves' && Object.keys(cranialNervesParts).map(key => (
                      <button 
                        key={key} 
                        onClick={() => setSelectedPart(key)}
                        className="px-2.5 py-1.5 bg-white hover:bg-purple-50 border border-slate-200 text-[10px] font-bold rounded-lg text-slate-700 hover:text-purple-700 transition-all shadow-sm cursor-pointer"
                      >
                        {cranialNervesParts[key].nameUz}
                      </button>
                    ))}
                    {diagramType === 'brainstem' && Object.keys(brainstemParts).map(key => (
                      <button 
                        key={key} 
                        onClick={() => setSelectedPart(key)}
                        className="px-2.5 py-1.5 bg-white hover:bg-indigo-50 border border-slate-200 text-[10px] font-bold rounded-lg text-slate-700 hover:text-indigo-700 transition-all shadow-sm cursor-pointer"
                      >
                        {brainstemParts[key].nameUz}
                      </button>
                    ))}
                    {diagramType === 'cerebellum' && Object.keys(cerebellumParts).map(key => (
                      <button 
                        key={key} 
                        onClick={() => setSelectedPart(key)}
                        className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 border border-slate-200 text-[10px] font-bold rounded-lg text-slate-700 hover:text-emerald-700 transition-all shadow-sm cursor-pointer"
                      >
                        {cerebellumParts[key].nameUz}
                      </button>
                    ))}
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

      {/* Lightbox Modal for Image Fullscreen Viewing */}
      {isLightboxOpen && activeReplacement?.imageUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div 
            className="relative max-w-5xl w-full max-h-[95vh] flex flex-col items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute -top-12 right-0 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={activeReplacement.imageUrl}
              alt={activeReplacement.caption || diagramTitle}
              referrerPolicy="no-referrer"
              className="max-h-[85vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
            />
            {activeReplacement.caption && (
              <p className="text-white text-center text-sm font-semibold mt-4 px-4 py-2 bg-slate-900/80 rounded-xl backdrop-blur-xs max-w-xl">
                {activeReplacement.caption}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Admin Replace Diagram Modal */}
      {isAdmin && isModalOpen && (
        <ReplaceDiagramModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          topicId={topicId || ''}
          diagramKey={diagramKey}
          diagramTitle={diagramTitle}
          diagramCode={value}
          currentReplacement={activeReplacement}
          onSuccess={(newReplacement) => {
            setActiveReplacement(newReplacement);
            if (newReplacement?.imageUrl) {
              setViewMode('image');
            } else {
              setViewMode('diagram');
            }
            onUpdateReplacement?.(newReplacement);
          }}
        />
      )}
    </div>
  );
}
