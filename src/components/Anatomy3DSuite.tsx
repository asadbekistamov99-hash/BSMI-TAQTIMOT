import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Info, Eye, EyeOff, Sliders, Box, Layers, X, Maximize2, 
  Sparkles, RotateCcw, Volume2, HelpCircle, ArrowLeft, Activity, 
  Settings, Compass, Filter, Check, ShieldAlert, Zap, Heart, Image as ImageIcon,
  ZoomIn, ZoomOut, AlertTriangle, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Move
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

const ModelViewer = 'model-viewer' as any;

// ----------------------------------------------------------------------
// DATASETS: Premium Anatomical Models & Systems Presets
// ----------------------------------------------------------------------

export interface AnatomyPreset {
  id: string;
  name: Record<string, string>;
  latin: string;
  url: string;
  desc: Record<string, string>;
}

export const ANATOMY_PRESETS: AnatomyPreset[] = [
  {
    id: 'heart',
    name: { 
      uz: 'Inson Yuragi (Kardiovaskulyar)', 
      ru: 'Сердце человека (Кардиоваскулярная)', 
      en: 'Human Heart (Cardiovascular)' 
    },
    latin: 'Cor Humanum',
    url: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/Lantern/glTF-Binary/Lantern.glb', // Fallback base GLB, or dynamic models
    desc: {
      uz: 'Yurakning ichki qorincha va bo\'lmachalari, klapanlari, o\'tkazuvchanlik tolalari va yirik qon-tomirlar sistemasi.',
      ru: 'Внутренние полости, клапаны, проводящая система и коронарные сосуды сердца человека.',
      en: 'Internal chambers, valves, conductive fibers, and coronary vascular networks of the human heart.'
    }
  },
  {
    id: 'skull',
    name: { 
      uz: 'Kalla suyagi (Kraniologiya)', 
      ru: 'Череп человека (Краниология)', 
      en: 'Human Cranium / Skull' 
    },
    latin: 'Cranium Sceletale',
    url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb',
    desc: {
      uz: 'Bosh suyaklarining o\'zaro birikishi, bo\'g\'imlari, miya qutisi teshiklari va yuz skeletoni qismlari.',
      ru: 'Анатомическое соединение костей мозгового и лицевого черепа, швы, отверстия и ямки.',
      en: 'Articulations of cranial and facial bones, sutures, nerve canals, and skull structure.'
    }
  },
  {
    id: 'skeleton',
    name: { 
      uz: 'Umumiy Skelet tizimi', 
      ru: 'Скелетная система человека', 
      en: 'Full Skeletal System' 
    },
    latin: 'Systema Sceletale',
    url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    desc: {
      uz: 'Gavda skeleti, umurtqa pog\'onasi sathi, ko\'krak qafasi, qo\'l va oyoq suyaklari birlashmalari.',
      ru: 'Костная система туловища, позвоночный столб, ребра, грудина и суставы конечностей.',
      en: 'Human bone structure, axial column, rib cage, and appendicular skeletal grid.'
    }
  },
  {
    id: 'brain',
    name: { 
      uz: 'Bosh miya va Nervlar (Nevrologiya)', 
      ru: 'Головной мозг и нервы', 
      en: 'Brain & Nervous Structures' 
    },
    latin: 'Systema Nervosum',
    url: 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/Lantern/glTF-Binary/Lantern.glb',
    desc: {
      uz: 'Markaziy asab tizimi, miya po\'stlog\'i bo\'limlari, miyacha, gipofiz va asosiy kalla-miya refleks asablari.',
      ru: 'Центральная нервная система, доли полушарий головного мозга, мозжечок и черепные нервы.',
      en: 'Central neural cortex, cerebellar balance hub, brainstem paths, and auxiliary cranial nerves.'
    }
  },
  {
    id: 'muscles',
    name: { 
      uz: 'Muskul va Bio-mexanika', 
      ru: 'Мышечная система человека', 
      en: 'Muscular / Myology System' 
    },
    latin: 'Systema Musculorum',
    url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    desc: {
      uz: 'Yelka, ko\'krak, press va oyoq sohalari muskullari, paylar birlashgan joylari hamda tola yo\'nalishlari.',
      ru: 'Мышцы верхнего плечевого пояса, груди, брюшного пресса и конечностей, сухожилия.',
      en: 'Muscles of the shoulder girdle, thorax, abdomen, and limbs with active kinetic pathways.'
    }
  },
  {
    id: 'femur',
    name: { 
      uz: 'Son suyagi (Osteologiya)', 
      ru: 'Бедренная кость (Остеология)', 
      en: 'Femur Bone Detail (Osteology)' 
    },
    latin: 'Os Femoris / Femur',
    url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
    desc: {
      uz: 'Son suyagining anatomik qismlari, bo\'g\'im sirtlari, boshchasi, bo\'yni, katta va kichik ko\'stlari hamda barcha g\'adir-budur chiziqlari sathi.',
      ru: 'Анатомическое строение бедренной кости человека, суставные поверхности, вертелы, головка, шейка и шероховатая линия.',
      en: 'Anatomical micro-girdle of the femur bone, including articular surfaces, head, neck, trochanters, and lines.'
    }
  },
  {
    id: 'humerus',
    name: { 
      uz: 'Yelka suyagi (Osteologiya)', 
      ru: 'Плечевая кость (Остеология)', 
      en: 'Humerus Bone Detail (Osteology)' 
    },
    latin: 'Os Humeri / Humerus',
    url: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb',
    desc: {
      uz: 'Yelka suyagining anatomik qismlari, bo\'g\'im sirtlari, boshchasi, jarrohlik bo\'yni, tanasi, g\'adir-budurliklari va distal g\'altaksimon blok chiziqlari.',
      ru: 'Анатомическое строение плечевой кости человека: суставные поверхности, головка, хирургическая шейка, тело кости, бугорки и дистальный мыщелок.',
      en: 'Anatomical micro-girdle of the humerus bone, including articular surfaces, head, anatomical/surgical necks, shafts, and distal condyles.'
    }
  }
];

export interface AnatomyPart {
  id: string;
  latinName: string;
  uzbekName: string;
  englishName: string;
  russianName: string;
  system: 'bone' | 'muscle' | 'nerve' | 'organ';
  position: string;
  normal?: string;
  description: Record<string, string>;
}

export const ANATOMY_PARTS: Record<string, AnatomyPart[]> = {
  heart: [
    {
      id: 'h1',
      latinName: 'Trabecula Septomarginalis',
      uzbekName: 'Septomarginal trabekula (Muskul dasta)',
      englishName: 'Septomarginal trabecula',
      russianName: 'Септомаргинальная трабекула',
      system: 'organ',
      position: '0.04 0.12 0.08',
      normal: '0 0 1',
      description: {
        uz: 'O\'ng qorincha bo\'shlig\'idagi impulslarni Purkinye tolalari orqali qorincha devorlariga uzatuvchi, sistola muvozanatini saqlovchi muskulli bo\'rtma.',
        ru: 'Мышечный тяж в полости правого желудочка сердца, проводящий импульсы к сосочковым мышцам передней стенки.',
        en: 'A muscular band found in the right ventricle coordinate, facilitating electrical conduction to the anterior papillary structures.'
      }
    },
    {
      id: 'h2',
      latinName: 'Arcus Aortae',
      uzbekName: 'Aorta yoyi (Bosh arteriya)',
      englishName: 'Aortic Arch',
      russianName: 'Дуга аорты',
      system: 'organ',
      position: '-0.02 0.32 -0.05',
      normal: '0 0 1',
      description: {
        uz: 'Yurak chap qorinchasidan qonni olib chiquvchi eng yirik arterial nay bo\'limi bo\'lib, kislorodga boy qonni butun tana a\'zolariga boshqaradi.',
        ru: 'Крупнейший эластический сосуд, выходящий из левого желудочка и идущий в форме дуги, распределяя кровь по всему организму.',
        en: 'The curved segment of the main systemic artery carrying oxygen-rich blood directly out of the left ventricular pump.'
      }
    },
    {
      id: 'h3',
      latinName: 'Ventriculus Sinister',
      uzbekName: 'Chap qorincha',
      englishName: 'Left Ventricle',
      russianName: 'Левый желудочек',
      system: 'organ',
      position: '0.08 -0.08 0.1',
      normal: '0 0 1',
      description: {
        uz: 'Yurakning eng kuchli, qalin devorli kamerasi. Kislorodli qonni katta qon aylanish bosimi ostida tana a\'zolariga haydash vazifasini bajaradi.',
        ru: 'Камера сердца с наиболее толстым мышечным слоем (миокардом), нагнетающая насыщенную кислородом кровь в большой круг кровообращения.',
        en: 'The thickest muscular chamber of the heart which pumps oxygenated systemic arterial blood at high parameters to organ pathways.'
      }
    },
    {
      id: 'h4',
      latinName: 'Ventriculus Dexter',
      uzbekName: 'O\'ng qorincha',
      englishName: 'Right Ventricle',
      russianName: 'Правый желудочек',
      system: 'organ',
      position: '-0.08 -0.06 0.12',
      normal: '0 0 1',
      description: {
        uz: 'Vena qonini o\'pka arteriyasi poyasi orqali o\'pkaga (kichik qon aylanish doirasiga) yuklovchi yurakning oldingi-o\'ng kamerasi.',
        ru: 'Правая нижняя камера сердца, принимающая венозную кровь и выталкивающая её в легочный ствол для насыщения кислородом.',
        en: 'The chamber responsible for receiving deoxygenated blood and pushing it through the pulmonary artery pathway for gas exchange.'
      }
    },
    {
      id: 'h5',
      latinName: 'Valva Mitralis',
      uzbekName: 'Mitral klapan (Ikki tabaqali)',
      englishName: 'Mitral Valve',
      russianName: 'Митральный клапан',
      system: 'organ',
      position: '0.05 0.02 -0.02',
      normal: '0 0 1',
      description: {
        uz: 'Chap bo\'lmacha va chap qorincha o\'rtasida joylashgan ikki tabaqali klapan; sistola vaqtida qonning chap bo\'lmachaga qaytib oqishini to\'sadi.',
        ru: 'Двустворчатый левый предсердно-желудочковый клапан, регулирующий ток крови и препятствующий регургитации при систоле.',
        en: 'A dual-cusp valve located between the left atrium and ventricle, ensuring unidirectionality of high-pressure fluid flow.'
      }
    },
    {
      id: 'h6',
      latinName: 'Musculus Papillaris Anterior',
      uzbekName: 'Oldingi so\'rg\'ichsimon muskul',
      englishName: 'Anterior Papillary Muscle',
      russianName: 'Передняя сосочковая мышца',
      system: 'muscle',
      position: '0.03 -0.15 0.08',
      normal: '0 0 1',
      description: {
        uz: 'Tendinous chord (pay dasta)larni tarang saqlab turuvchi va sistola vaqtida varaqlar ag\'darilib ketishini ta\'minlovchi miokard muskuli.',
        ru: 'Специальная сосочковая мышца желудочка, удерживающая сухожильные нити клапанов от прогибания в фазу сокращения сердца.',
        en: 'Specialized myocardial fibers that tense the chordae tendineae during systole to prevent eversion of the valvular system.'
      }
    },
    {
      id: 'h7',
      latinName: 'Nervus Cardiacus Parasympathicus',
      uzbekName: 'Yurak parasimpatik nerv tarmog\'i',
      englishName: 'Parasympathetic Cardiac Nerve branch',
      russianName: 'Парасимпатический сердечный нерв',
      system: 'nerve',
      position: '-0.06 0.22 -0.1',
      normal: '0 0 1',
      description: {
        uz: 'Yurak urish ritmini pasaytiruvchi, yurak muskullarining umumiy tonusi va qorinchalar sistola quvvatini normallashtiruvchi parasimpatik asab sathi.',
        ru: 'Вегетативные нервные волокна блуждающего нерва, замедляющие автоматизм синусового узла и снижающие пульс.',
        en: 'Autonomic neural path originating from the vagus plexus, responsible for decelerating conduction cycles and stabilizing core pace.'
      }
    },
    {
      id: 'h8',
      latinName: 'Musculus Atrioventricularis',
      uzbekName: 'Bo\'lmacha-qorincha muskullararo to\'sig\'i',
      englishName: 'Interventricular Septum Muscle',
      russianName: 'Межжелудочковая перегородка',
      system: 'muscle',
      position: '0.00 -0.05 0.06',
      normal: '0 0 1',
      description: {
        uz: 'Yurakning o\'ng va chap qorinchalarini ajratib turuvchi, qon aralashib ketishining mutlaqo oldini oluvchi mustahkam miokard to\'sig\'i.',
        ru: 'Мощная мышечно-фиброзная перегородка, герметично разделяющая полости правого и левого желудочков сердца.',
        en: 'The muscular barrier partitioning the ventricular chambers, crucial for preventing cross-flow of oxygenated and non-oxygenated blood.'
      }
    }
  ],
  skull: [
    {
      id: 's1',
      latinName: 'Os Frontale',
      uzbekName: 'Peshona suyagi',
      englishName: 'Frontal Bone',
      russianName: 'Лобная кость',
      system: 'bone',
      position: '0 0.18 0.15',
      normal: '0 0 1',
      description: {
        uz: 'Kallaning oldingi-yuqori darchasini quradigan toq suyak bo\'lib, ko\'z kosasining yuqori dastasini va peshona burun sinuslarini qamraydi.',
        ru: 'Непарная широкая плоская кость черепа, образующая лобный отдел, верхние края глазниц и часть основания черепной ямки.',
        en: 'A flat bone constituting the forehead region, orbital superstructures, and containing the protective frontal sinuses.'
      }
    },
    {
      id: 's2',
      latinName: 'Os Parietale',
      uzbekName: 'Tepalik suyagi (Juft)',
      englishName: 'Parietal Bone',
      russianName: 'Теменная кость',
      system: 'bone',
      position: '0.12 0.3 -0.05',
      normal: '0 0 1',
      description: {
        uz: 'Kalla gumbazi va ensa sohalarining tepalik, yon tomonlarini mahkam burchaklab, miyani har tomonlama himoyalaydigan juft yassi suyak parchalari.',
        ru: 'Парная теменная кость, ограничивающая верхний и латеральный сегменты свода черепа от механических воздействий.',
        en: 'Paired flat structural pieces that formulate the roof and side-girdles of the protective cranial cranial vault.'
      }
    },
    {
      id: 's3',
      latinName: 'Os Occipitale',
      uzbekName: 'Ensa suyagi (Asos)',
      englishName: 'Occipital Bone',
      russianName: 'Затылочная кость',
      system: 'bone',
      position: '0 0.12 -0.25',
      normal: '0 0 1',
      description: {
        uz: 'Kallaning orqa va pastki bo\'limlarini shakllantiruvchi, umurtqa pog\'onasi bilan birlashadigan bo\'g\'im tolalari va foramen magnum (katta teshik) egasi.',
        ru: 'Прочная кость затылка, содержащая большое затылочное отверстие для прохождения ствола мозга в спинномозговой канал.',
        en: 'The posterioinferior planar vault hosting the great occipital foramen that interfaces spinal cord flow into central cerebral tissue.'
      }
    },
    {
      id: 's4',
      latinName: 'Os Temporale',
      uzbekName: 'Chakka suyagi (Daxliz bilan)',
      englishName: 'Temporal Bone',
      russianName: 'Височная кость',
      system: 'bone',
      position: '0.2 0.12 -0.08',
      normal: '0 0 1',
      description: {
        uz: 'Ichki hamda o\'rta quloq daxlizlarini, nerv kanallarini va eshitish o\'tish yo\'llarini o\'z ichiga olgan kalla asosining murakkab juft suyagi.',
        ru: 'Сложная парная височная кость основания, вмещающая органы слуха и равновесия, а также каналы внутренней сонной артерии и лицевого нерва.',
        en: 'A complex cranial bone structuring lower lateral walls and floor, shielding temporal lobes, audiological organs, and sensory pathways.'
      }
    },
    {
      id: 's5',
      latinName: 'Mandibula',
      uzbekName: 'Pastki jag\' suyagi',
      englishName: 'Mandible',
      russianName: 'Нижняя челюсть',
      system: 'bone',
      position: '0 -0.18 0.18',
      normal: '0 0 1',
      description: {
        uz: 'Kalla suyagining yagona harakatchan bo\'g\'imga ega suyagi bo\'lib, tish soketlarini ushlab, chaynash va diksiya bio-mexanikasida faol dasta.',
        ru: 'Единственная подвижная суставная кость лицевого черепа, несущая нижний зубной ряд и сочленяющаяся с височной костью.',
        en: 'The sole mobile articulator of the facial matrix, housing distal teeth and key anchors for mastication musculature.'
      }
    },
    {
      id: 's6',
      latinName: 'Nervus Mandibularis (Branch V3)',
      uzbekName: 'Pastki jag\' nerv tarmog\'i',
      englishName: 'Mandibular Nerve (V3)',
      russianName: 'Нижнечелюстной нерв',
      system: 'nerve',
      position: '0.12 -0.05 0.1',
      normal: '0 0 1',
      description: {
        uz: 'Uch shoxli nervning eng yirik va aralash (sezgi hamda motor tolalari mavjud) tarmog\'i. Jag\' va chaynash asab faoliyatiga javobgar.',
        ru: 'Третья ветвь тройничного нерва (V пара ЧМН), несущая чувствительные волокна к нижней челюсти и зубам и двигательные к жевательным мышцам.',
        en: 'Major subdivision of cranial nerve V, supplying cutaneous innervations to teeth, gums, and motor signals for jaw actuation.'
      }
    },
    {
      id: 's7',
      latinName: 'Musculus Temporalis',
      uzbekName: 'Chakka chaynash muskuli',
      englishName: 'Temporalis Muscle',
      russianName: 'Височная мышца',
      system: 'muscle',
      position: '0.18 0.2 -0.02',
      normal: '0 0 1',
      description: {
        uz: 'Chakka suyagidan boshlanib pastki jag\' toj o\'simtasiga yopishuvchi muskul. Jag\'ni yuqoriga ko\'tarish bilan birga orqaga tortadi.',
        ru: 'Веерообразная жевательная мышца черепа, поднимающая нижнюю челюсть и обеспечивающая плотное смыкание зубов.',
        en: 'Wide fan-shaped elevator musculature pulling the coronoid process upward, enabling occlusion and masticatory kinetics.'
      }
    }
  ],
  skeleton: [
    {
      id: 'sk1',
      latinName: 'Vertebra Thoracica',
      uzbekName: 'Ko\'krak umurtqalari segmenti',
      englishName: 'Thoracic Vertebrae',
      russianName: 'Грудные позвонки',
      system: 'bone',
      position: '0 0.08 -0.12',
      normal: '0 0 1',
      description: {
        uz: 'Ko\'krak qafasi qovurg\'alar birikuvchi 12 ta tayanch o\'q umurtqa tuzilishi. Orqa miya kanalini o\'rab turadi.',
        ru: 'Сегмент из 12 позвонков грудного отдела скелета, сочленяющихся с головками ребер и защищающих спинной мозг.',
        en: 'Complex of 12 mid-axial skeletal elements serving as key connectors for corresponding ribs and vertebral canal shielding.'
      }
    },
    {
      id: 'sk2',
      latinName: 'Costa Vera (1-7)',
      uzbekName: 'Haqiqiy qovurg\'alar yo\'li',
      englishName: 'True Ribs (1-7)',
      russianName: 'Истинные ребра',
      system: 'bone',
      position: '0.18 -0.05 0.12',
      normal: '0 0 1',
      description: {
        uz: 'To\'g\'ridan-to\'g\'ri to\'sh suyagi bilan bo\'g\'imlashuvchi yuqori 7 juft tog\'ayli va suyakli qovurg\'a kamarlari.',
        ru: 'Верхние 7 пар ребер, хрящевые отделы которых непосредственно соединяются с телом грудины.',
        en: 'The top seven pairs of planar bone arches that articulate directly with the sternum shield on the thoracic front.'
      }
    },
    {
      id: 'sk3',
      latinName: 'Caput Femoris',
      uzbekName: 'Son suyagi boshi',
      englishName: 'Head of Femur',
      russianName: 'Головка бедренной кости',
      system: 'bone',
      position: '0.12 -0.65 0.05',
      normal: '0 0 1',
      description: {
        uz: 'Son suyagining tos chashkasi (acetabulum)ga joyb kalla o\'simtasi bo\'lib, chanoq-son sferik bo\'g\'imini hosil qiladi.',
        ru: 'Проксимальный полусферический суставной конец бедра, сочленяющийся с вертлужной впадиной тазовой кости.',
        en: 'The hemispherical proximal articulating end fitting securely into the hip pelvic acetabular cavity.'
      }
    },
    {
      id: 'sk4',
      latinName: 'Scapula Lateralis',
      uzbekName: 'Kurak yelka-sharnir darchasi',
      englishName: 'Lateral Scapular Rim',
      russianName: 'Латеральный край лопатки',
      system: 'bone',
      position: '0.15 0.15 -0.15',
      normal: '0 0 1',
      description: {
        uz: 'Yelka bo\'g\'im chuqurchasi (cavitas glenoidalis) sohasidagi uchburchak yassi suyak yon qirrasi darchasi.',
        ru: 'Наружный суставной край лопатки, переходящий в суставную впадину плеча и акромион.',
        en: 'The thick lateral margin transitioning directly into the glenoid cavity, creating critical anchors for humerus attachment.'
      }
    },
    {
      id: 'sk5',
      latinName: 'Nervus Ischiadicus',
      uzbekName: 'Quymich (O\'tirg\'ich) nerv ustuni',
      englishName: 'Sciatic Nerve Column',
      russianName: 'Седалищный нерв',
      system: 'nerve',
      position: '0.08 -0.45 -0.08',
      normal: '0 0 1',
      description: {
        uz: 'Odam tanasidagi eng yirik, yo\'g\'on tola nerv tizimi bo\'lib, bel-dumg\'aza chigalidan boshlanib, butun oyoqni harakatlantiradi.',
        ru: 'Самый длинный и крупный ствол периферической нервной системы, иннервирующий мышцы бедра, голени и стопы.',
        en: 'The largest neural pathway in the body, conducting signals down from the sacral plexus to lower extremity musculatures.'
      }
    }
  ],
  brain: [
    {
      id: 'b1',
      latinName: 'Cortex Cerebri (Lobus Frontalis)',
      uzbekName: 'Peshona peshtovi (Miya yarimshari)',
      englishName: 'Frontal Lobe Cortex',
      russianName: 'Лобная доля коры',
      system: 'organ',
      position: '0 0.12 0.05',
      normal: '0 0 1',
      description: {
        uz: 'Fikrlash, rejalashtirish, ixtiyoriy harakat, mantiq va nutq faoliyatiga bevosita javobgar miyaning eng oliy oldingi qobig\'i.',
        ru: 'Лобный ассоциативный неокортекс, координирующий мышление, принятие решений, целенаправленную волю и речь.',
        en: 'The anterior lobe structure managing high-level planning, cognitive processing, motor orchestration, and verbal expression.'
      }
    },
    {
      id: 'b2',
      latinName: 'Cerebellum (Hemispherium)',
      uzbekName: 'Miyacha yarimshari (Muvozanat)',
      englishName: 'Cerebellar hemisphere',
      russianName: 'Полушарие мозжечка',
      system: 'organ',
      position: '0 -0.12 -0.15',
      normal: '0 0 1',
      description: {
        uz: 'Miya poyasining orqa sohasida joylashgan yassi burmali koordinatsiya a\'zosi. Muvozanatli harakatlar koordinatsiyasini sozlashi bilan tana stansiyasidir.',
        ru: 'Интегративный центр головного мозга, регулирующий плавность движений, мышечный тонус и сохранение баланса равновесия.',
        en: 'The neural control center situated beneath occipital lobes, parsing kinetic coordination and sensorimotor feedback.'
      }
    },
    {
      id: 'b3',
      latinName: 'Truncus Encephali (Medulla Oblongata)',
      uzbekName: 'Uzunchoq miya (Poya tizimi)',
      englishName: 'Brainstem / Medulla',
      russianName: 'Ствол мозга / Продолговатый мозг',
      system: 'organ',
      position: '0 -0.05 -0.04',
      normal: '0 0 1',
      description: {
        uz: 'Nafas olish, yurak urishi va himoya reflekslarini (yo\'tal, qusish) idora etuvchi hayotiy asab tolalari poyasi.',
        ru: 'Отдел ствола мозга, содержащий центры регуляции кровообращения, дыхания и защитных врожденных механизмов тела.',
        en: 'The crucial autonomic conduit housing reflex loops for cardiac cycles, vasomotor tones, and pulmonary automation.'
      }
    },
    {
      id: 'b4',
      latinName: 'Nervus Opticus (Chiasma)',
      uzbekName: 'Ko\'ruv nervlari kesishuvi (Xiazma)',
      englishName: 'Optic Nerve / Chiasm',
      russianName: 'Зрительный перекрест / Нерв',
      system: 'nerve',
      position: '0.04 0.04 0.12',
      normal: '0 0 1',
      description: {
        uz: 'Ko\'z kosasidan olingan fokal signallarni ensa sohasidagi ko\'rish korteksiga uzatuvchi II juft kalla-miya ko\'ruv yo\'li.',
        ru: 'Проводящий зрительный путь, образующий перекрест (хиазму) и несущий данные с полей сетчатки обратно в корковый анализатор.',
        en: 'The specialized second cranial sensory channel conducting optical streams from the globes back to cortical areas.'
      }
    }
  ],
  muscles: [
    {
      id: 'm1',
      latinName: 'Musculus Deltoideus (Pars Clavicularis)',
      uzbekName: 'Deltasimon muskul (Oldingi-yon dasta)',
      englishName: 'Deltoid Muscle (Anterior clavicular)',
      russianName: 'Дельтовидная мышца',
      system: 'muscle',
      position: '0.2 0.15 0.05',
      normal: '0 0 1',
      description: {
        uz: 'Yelka bo\'g\'imini uchburchaksimon o\'rab olgan muskul; qo\'lni gorizontal tekislikka ko\'tarishda eng katta ulushga ega biomekanik dasta.',
        ru: 'Треугольная мясистая мышца плечевого пояса, отводящая плечо во внешнюю сторону до прямого угла.',
        en: 'The superficial multipennate muscle enclosing the glenohumeral junction, acting as the prime agent of shoulder abduction.'
      }
    },
    {
      id: 'm2',
      latinName: 'Musculus Pectoralis Major (Clavicularis)',
      uzbekName: 'Katta ko\'krak ko\'prikchali muskul',
      englishName: 'Pectoralis Major Muscle',
      russianName: 'Большая грудная мышца',
      system: 'muscle',
      position: '0.12 -0.04 0.18',
      normal: '0 0 1',
      description: {
        uz: 'Ko\'krak sohasidagi eng qalin va keng juft yassi muskul, asosan qo\'lni tortish, ichkariga rotatsiya qilish, proksimal yuklama yuklantirish dasta o\'qi.',
        ru: 'Веерообразная поверхностная мышца груди, приводящая руку к туловищу и вращающая ее внутрь.',
        en: 'A broad fan-shaped muscle spanning the superior sternal chest area, central to humeral adduction and medial rotation.'
      }
    },
    {
      id: 'm3',
      latinName: 'Musculus Biceps Brachii (Caput Longum)',
      uzbekName: 'Ikki boshli biceps muskuli (Uzun kalla)',
      englishName: 'Biceps Brachii (Long head)',
      russianName: 'Бицепс плеча ',
      system: 'muscle',
      position: '0.18 0.02 0.12',
      normal: '0 0 1',
      description: {
        uz: 'Bilak sohasini bukuvchi hamda supinator vazifalariga ko\'maklashuvchi, tirsak asabida ishtirok etuvchi yelkaning yuzaki muskuli.',
        ru: 'Двуглавая веретенообразная мышца плеча, сгибающая руку в локтевом суставе и супинирующая предплечье.',
        en: 'A prominent two-headed fusiform flexor facilitating elbow flexion and forearm supination under load parameters.'
      }
    },
    {
      id: 'm4',
      latinName: 'Musculus Rectus Abdominis',
      uzbekName: 'Qorin to\'g\'ri muskuli (Press segmentlari)',
      englishName: 'Rectus Abdominis Muscle',
      russianName: 'Прямая мышца живота',
      system: 'muscle',
      position: '0 -0.15 0.2',
      normal: '0 0 1',
      description: {
        uz: 'Tana korpusini oldinga bukuvchi, umurtqalar egiluvchanligini ta\'minlovchi va qorin sohasidagi bosim ostidagi pressing elementidir.',
        ru: 'Парная длинная лентовидная мышца передней брюшной стенки, сгибающая туловище и удерживающая брюшной пресс.',
        en: 'Elongated paired sheet stabilizing deep core structures and pulling the chest toward pelvis to execute spinal flexion.'
      }
    }
  ],
  frontale: [
    {
      id: 'fr1',
      latinName: 'Squama Frontalis',
      uzbekName: 'Peshona tangasi',
      englishName: 'Frontal Squama',
      russianName: 'Лобная чешуя',
      system: 'bone',
      position: '0.0 0.12 0.05',
      normal: '0 0 1',
      description: {
        uz: 'Peshona tangasi - peshona suyagining eng yirik, vertikal va qabariq yassi qismi.',
        ru: 'Лобная чешуя - широкая изогнутая выпуклая вертикальная пластина лобной кости.',
        en: 'The large, curved, vertical plate-like region forming the major part of the forehead.'
      }
    },
    {
      id: 'fr2',
      latinName: 'Glabella',
      uzbekName: 'Glabella (Qoshlararo soha)',
      englishName: 'Glabella',
      russianName: 'Глабелла (Гладкое надпереносье)',
      system: 'bone',
      position: '0.0 -0.01 0.1',
      normal: '0 0 1',
      description: {
        uz: "Glabella - qosh yoylari o'rtasidagi silliq tekislik; antropometrik hisob nuqtasi.",
        ru: 'Глабелла (надпереносье) - гладкая площадка над переносицей между надбровными дугами.',
        en: 'The smooth, slightly elevated area between the superciliary arches (eyebrow ridges).'
      }
    },
    {
      id: 'fr3',
      latinName: 'Margo Supraorbitalis',
      uzbekName: 'Ko\'z kosasi usti qirrasi',
      englishName: 'Supraorbital Margin',
      russianName: 'Надглазничный край',
      system: 'bone',
      position: '0.06 -0.04 0.08',
      normal: '0 0 1',
      description: {
        uz: 'Ko\'z kosasining yuqori qirrasi - peshona burchagi va ko\'z dastasini ajratuvchi o\'tkir chegara.',
        ru: 'Надглазничный край - острая верхняя граница глазницы, отделяющая чешую от глазничной части.',
        en: 'The sharp upper boundary of each orbital opening protecting the eyeball.'
      }
    },
    {
      id: 'fr4',
      latinName: 'Arcus Superciliaris',
      uzbekName: 'Qosh yoyi',
      englishName: 'Superciliary Arch',
      russianName: 'Надбровная дуга',
      system: 'bone',
      position: '0.04 0.02 0.09',
      normal: '0 0 1',
      description: {
        uz: 'Qosh yoyi - glabelladan ikki tomonga cho\'zilgan yo\'g\'onlashgan do\'mboq sath.',
        ru: 'Надбровная дуга - закругленный костный валик латеральнее глабеллы над орбитой.',
        en: 'The prominent bony ridge above the orbit, underlying the brow line.'
      }
    },
    {
      id: 'fr5',
      latinName: 'Processus Zygomaticus',
      uzbekName: 'Yonoq o\'simtasi',
      englishName: 'Zygomatic Process',
      russianName: 'Скуловой отросток',
      system: 'bone',
      position: '0.11 -0.07 0.04',
      normal: '0 0 1',
      description: {
        uz: 'Yonoq o\'simtasi - peshona suyagining chetki burchagidan pastga yo\'nalib, yonoq suyagi bilan birikadigan qismi.',
        ru: 'Скуловой отросток - прочный боковой край лобной кости, сочленяющийся со скуловой костью.',
        en: 'Strong lateral projection of the frontal bone articulating directly with the zygomatic bone.'
      }
    },
    {
      id: 'fr6',
      latinName: 'Facies Orbitalis',
      uzbekName: 'Ko\'z kosasi yuzasi',
      englishName: 'Orbital Surface',
      russianName: 'Глазничная поверхность',
      system: 'bone',
      position: '0.05 -0.09 0.02',
      normal: '0 0 1',
      description: {
        uz: 'Ko\'z kosasi yuzasi - ko\'z sohasining yuqori devorini (shiftini) hosil qiluvchi gorizontal silliq plastinka.',
        ru: 'Глазничная поверхность - тонкая горизонтальная пластинка, образующая верхнюю стенку глазницы.',
        en: 'Smooth horizontal plate formulating the major roof of the orbital cavity.'
      }
    }
  ],
  maxilla: [
    {
      id: 'mx1',
      latinName: 'Corpus Maxillae',
      uzbekName: 'Yuqori jag\' tanasi',
      englishName: 'Body of Maxilla',
      russianName: 'Тело верхней челюсти',
      system: 'bone',
      position: '0.04 -0.02 0.08',
      normal: '0 0 1',
      description: {
        uz: 'Yuqori jag\' tanasi - o\'z ichiga Gaymor (maxillaris) burun bo\'shlig\'ini oluvchi markaziy suyak qismini shakllantiradi.',
        ru: 'Тело верхней челюсти - центральная часть кости, вмещающая воздухоносную гайморову пазуху.',
        en: 'The central pyramid-shaped core housing the large maxillary sinus.'
      }
    },
    {
      id: 'mx2',
      latinName: 'Processus Frontalis',
      uzbekName: 'Peshona o\'simtasi',
      englishName: 'Frontal Process',
      russianName: 'Лобный отросток',
      system: 'bone',
      position: '0.02 0.08 0.06',
      normal: '0 0 1',
      description: {
        uz: 'Peshona o\'simtasi - yuqoriga yo\'nalgan va peshona hamda burun suyaklari bilan birikadigan kuchli o\'simta qismi.',
        ru: 'Лобный отросток - направленный вверх выступ для сочленения с лобной и носовыми костями.',
        en: 'Strong plate-like extension projecting upward to connect with the frontal bone.'
      }
    },
    {
      id: 'mx3',
      latinName: 'Processus Alveolaris',
      uzbekName: 'Alveolyar o\'simta',
      englishName: 'Alveolar Process',
      russianName: 'Альвеолярный отросток',
      system: 'bone',
      position: '0.0 -0.09 0.09',
      normal: '0 0 1',
      description: {
        uz: 'Alveolyar o\'simta - yuqori tishlarning ildizlari joylashadigan tish katakchalari (alveolalar) dasta sohasi.',
        ru: 'Альвеолярный отросток - дугообразный костный край с ячейками (альвеолами) для корней верхних зубов.',
        en: 'Curved bony ridge hosting the dental sockets for upper teeth roots.'
      }
    },
    {
      id: 'mx4',
      latinName: 'Processus Zygomaticus',
      uzbekName: 'Yonoq o\'simtasi',
      englishName: 'Zygomatic Process of Maxilla',
      russianName: 'Скуловой отросток',
      system: 'bone',
      position: '0.09 -0.01 0.05',
      normal: '0 0 1',
      description: {
        uz: 'Yonoq o\'simtasi - yuqori jag\'ning tashqi burchagida joylashib, yonoq suyagiga birikuvchi g\'adir-budur do\'mboqlik.',
        ru: 'Скуловой отросток - массивный боковой трехгранный выступ, уходящий к скуловой кости.',
        en: 'Robust lateral triangular projection mating with the zygomatic structure.'
      }
    },
    {
      id: 'mx5',
      latinName: 'Sinus Maxillaris',
      uzbekName: 'Gaymor bo\'shlig\'i',
      englishName: 'Maxillary Sinus',
      russianName: 'Гайморова пазуха',
      system: 'organ',
      position: '0.03 -0.03 0.02',
      normal: '0 0 1',
      description: {
        uz: 'Gaymor bo\'shlig\'i - yuqori jag\' tanasi ichidagi eng yirik havo saqlovchi anatomik sinus darchasi.',
        ru: 'Верхнечелюстная (Гайморова) пазуха - крупнейшая наполненная воздухом придаточная полость носа.',
        en: 'The largest paranasal air-containing bone cavity located inside maxilla.'
      }
    }
  ],
  mandibula: [
    {
      id: 'mn1',
      latinName: 'Corpus Mandibulae',
      uzbekName: 'Pastki jag\' tanasi',
      englishName: 'Body of Mandible',
      russianName: 'Тело нижней челюсти',
      system: 'bone',
      position: '0.0 -0.04 0.1',
      normal: '0 0 1',
      description: {
        uz: 'Pastki jag\' tanasi - tishlarni ushlagan va iyak sohasi shakllangan gorizontal taqasimon dasta.',
        ru: 'Тело нижней челюсти - горизонтальный подковообразный отдел кости, несущий нижний зубной ряд.',
        en: 'The heavy horizontal horseshoe-shaped segment supporting the lower dental arch.'
      }
    },
    {
      id: 'mn2',
      latinName: 'Ramus Mandibulae',
      uzbekName: 'Pastki jag\' shoxi',
      englishName: 'Ramus of Mandible',
      russianName: 'Ветвь нижней челюсти',
      system: 'bone',
      position: '0.09 0.03 0.02',
      normal: '0 0 1',
      description: {
        uz: 'Pastki jag\' shoxi - tanadan orqaga va yuqoriga yo\'nalgan, chaynash muskullari yopishadigan qismli juft plastinka.',
        ru: 'Ветвь нижней челюсти - парная вертикальная костная пластина, отходящая кверху от тела челюсти.',
        en: 'The vertical planar plate extending upward from the posterior junction of the jaw.'
      }
    },
    {
      id: 'mn3',
      latinName: 'Processus Condylaris',
      uzbekName: 'Bo\'g\'im o\'simtasi',
      englishName: 'Condylar Process',
      russianName: 'Мыщелковый отросток',
      system: 'bone',
      position: '0.09 0.08 -0.03',
      normal: '0 0 1',
      description: {
        uz: 'Bo\'g\'im o\'simtasi - chakka suyagi bilan harakatchan bo\'g\'im hosil qiluvchi silliq boshcha.',
        ru: 'Мыщелковый отросток - задний суставной выступ ветви, образующий височно-нижнечелюстной сустав.',
        en: 'The smooth posterior articular head facilitating jaw opening and joint rotation.'
      }
    },
    {
      id: 'mn4',
      latinName: 'Processus Coronoideus',
      uzbekName: 'Tojsimon o\'simta',
      englishName: 'Coronoid Process',
      russianName: 'Венечный отросток',
      system: 'bone',
      position: '0.07 0.07 0.04',
      normal: '0 0 1',
      description: {
        uz: 'Tojsimon o\'simta - oldingi o\'tkir burchakli o\'simta; unga kuchli chakka chaynash muskuli payi tutashadi.',
        ru: 'Венечный отросток - передний плоский заостренный выступ ветви челюсти для височной мышцы.',
        en: 'The sharp anterior projection serving as insertion for the temporalis muscle.'
      }
    },
    {
      id: 'mn5',
      latinName: 'Protuberantia Mentalis',
      uzbekName: 'Daxan do\'mbog\'i',
      englishName: 'Mental Protuberance',
      russianName: 'Подбородочный выступ',
      system: 'bone',
      position: '0.0 -0.08 0.12',
      normal: '0 0 1',
      description: {
        uz: 'Daxan do\'mbog\'i - pastki jag\' tanasi oldingi yuzasining o\'rta qismidagi iyak bo\'rtmasi do\'mboqchasi.',
        ru: 'Подбородочный выступ - срединное костное возвышение по нижнему краю тела нижней челюсти.',
        en: 'The bony prominence of the chin located midline at the anterior lower margin.'
      }
    },
    {
      id: 'mn6',
      latinName: 'Foramen Mentale',
      uzbekName: 'Daxan teshigi',
      englishName: 'Mental Foramen',
      russianName: 'Подбородочное отверстие',
      system: 'bone',
      position: '0.04 -0.06 0.11',
      normal: '0 0 1',
      description: {
        uz: 'Daxan teshigi - asab tolalari va qon tomirlarining tashqariga chiqishi uchun iyak yonidagi teshikchalar.',
        ru: 'Подбородочное отверстие - устье канала нижней челюсти для выхода подбородочного нерва к тканям.',
        en: 'Small lateral opening transmitting mental nerve and vessel bundles near the roots of premolars.'
      }
    }
  ],
  scapula: [
    {
      id: 'sc1',
      latinName: 'Spina Scapulae',
      uzbekName: 'Kurak tizmasi',
      englishName: 'Spine of Scapula',
      russianName: 'Ость лопатки',
      system: 'bone',
      position: '0.0 0.05 0.06',
      normal: '0 0 1',
      description: {
        uz: 'Kurak tizmasi - kurakning orqa yuzasini supraspinatus va infraspinatus sohalariga bo\'luvchi o\'tkir ko\'ndalang dasta.',
        ru: 'Ость лопатки - выступающий поперечный костный гребень на ее задней поверхности.',
        en: 'Prominent transverse plate running across the dorsal surface of the bone splitting it.'
      }
    },
    {
      id: 'sc2',
      latinName: 'Acromion',
      uzbekName: 'Yelka o\'simtasi (Akromion)',
      englishName: 'Acromion Process',
      russianName: 'Акромион лопатки',
      system: 'bone',
      position: '-0.12 0.11 0.04',
      normal: '0 0 1',
      description: {
        uz: 'Akromion - kurak tizmasining yuqori chetki kengaygan qismi; o\'mrov suyagi bilan bo\'g\'imlashadi.',
        ru: 'Акромион - уплощенный латеральный конец лопаточной ости, создающий плечевой свод.',
        en: 'The flat subcutaneous lateral summit of the scapular spine articulating with the clavicle.'
      }
    },
    {
      id: 'sc3',
      latinName: 'Processus Coracoideus',
      uzbekName: 'Qushtumshuqsimon o\'simta',
      englishName: 'Coracoid Process',
      russianName: 'Клювовидный отросток',
      system: 'bone',
      position: '-0.08 0.1 -0.04',
      normal: '0 0 1',
      description: {
        uz: 'Qushtumshuqsimon o\'simta - kurak yuqorigi chetidan oldinga chiqib turuvchi, bir qator muskullar paylari yopishadigan suyak.',
        ru: 'Клювовидный отросток - изогнутый вперед пальцевидный выступ лопатки над плечевым суставом.',
        en: 'Hook-like thick protrusion extending from superior border to anchor tendons and ligaments.'
      }
    },
    {
      id: 'sc4',
      latinName: 'Cavitas Glenoidalis',
      uzbekName: 'Bo\'g\'im chuqurchasi',
      englishName: 'Glenoid Cavity',
      russianName: 'Суставная впадина лопатки',
      system: 'bone',
      position: '-0.12 0.04 -0.01',
      normal: '0 0 1',
      description: {
        uz: 'Bo\'g\'im chuqurchasi - elka suyagining boshchasi bilan elka bo\'g\'imini hosil qilish uchun yon tomondagi sayoz botiqlik.',
        ru: 'Суставная впадина лопатки - овельное уплощенное углубление для сочленения с головкой плеча.',
        en: 'Shallow lateral articular surface mating with the humerus head to make the shoulder joint.'
      }
    },
    {
      id: 'sc5',
      latinName: 'Fossa Supraspinata',
      uzbekName: 'Tizma usti chuqurchasi',
      englishName: 'Supraspinous Fossa',
      russianName: 'Надостная ямка',
      system: 'bone',
      position: '0.0 0.1 0.03',
      normal: '0 0 1',
      description: {
        uz: 'Tizma usti chuqurchasi - kurak tizmasidan yuqorida joylashgan yassi botiqlik; ayni nomdagi muskulni o\'rab turadi.',
        ru: 'Надостная ямка - костное углубление над лопаточной остью, вмещающее надостную мышцу.',
        en: 'Smooth excavation lying superior to the scapular spine containing the supraspinatus muscle.'
      }
    },
    {
      id: 'sc6',
      latinName: 'Fossa Infraspinata',
      uzbekName: 'Tizma osti chuqurchasi',
      englishName: 'Infraspinous Fossa',
      russianName: 'Подостная ямка',
      system: 'bone',
      position: '0.02 -0.06 0.04',
      normal: '0 0 1',
      description: {
        uz: 'Tizma osti chuqurchasi - kurak tizmasidan pastdagi keng, tekis botiq soha bo\'lib, unga infraspinatus muskuli birikadi.',
        ru: 'Подостная ямка - обширная вогнутая площадка ниже лопаточной ости для подостной мышцы.',
        en: 'The large flat broad excavation below the spine hosting infraspinatus muscle fiber structures.'
      }
    }
  ],
  humerus: [
    {
      id: 'hu1',
      latinName: 'Caput Humeri',
      uzbekName: 'Yelka suyagi boshchasi',
      englishName: 'Head of Humerus',
      russianName: 'Головка плечевой кости',
      system: 'bone',
      position: '0.04 0.16 0.02',
      normal: '0 0 1',
      description: {
        uz: 'Yelka suyagi boshchasi - kurakning bo\'g\'im chuqurchasi bilan elka bo\'g\'imini hosil qiladigan yarimsharsimon silliq qism.',
        ru: 'Головка плечевой кости - гладкий шарообразный проксимальный конец кости для плечевого сустава.',
        en: 'Hemispherical smooth proximal articulating surface fitting into the scapular glenoid socket.'
      }
    },
    {
      id: 'hu2',
      latinName: 'Collum Chirurgicum',
      uzbekName: 'Xirurgik bo\'yin',
      englishName: 'Surgical Neck of Humerus',
      russianName: 'Хирургическая шейка плеча',
      system: 'bone',
      position: '0.01 0.1 -0.01',
      normal: '0 0 1',
      description: {
        uz: 'Xirurgik bo\'yin - diafiz va epifiz chegarasidagi ingichka qism; u yerda eng ko\'p sinish jarohatlari rux beradi.',
        ru: 'Хирургическая шейка - сужение кости ниже бугорков, типичное клиническое место переломов плеча.',
        en: 'Distinct section below the head and tuberosities highly prone to micro-fracturing and trauma.'
      }
    },
    {
      id: 'hu3',
      latinName: 'Tuberculum Majus',
      uzbekName: 'Katta bo\'rtma',
      englishName: 'Greater Tubercle',
      russianName: 'Большой бугорок',
      system: 'bone',
      position: '-0.04 0.14 0.03',
      normal: '0 0 1',
      description: {
        uz: 'Katta bo\'rtma - proksimal uchi lateral yon tomonidagi yirik g\'adir-budur do\'mboq bo\'lib, rotator muskullariga ulanadi.',
        ru: 'Большой бугорок - латеральный рельефный выступ конца кости для фиксации вращательной манжеты.',
        en: 'Large lateral protrusion near the anatomical neck anchoring spinatus muscle groups.'
      }
    },
    {
      id: 'hu4',
      latinName: 'Corpus Humeri',
      uzbekName: 'Yelka suyagi tanasi (Diafiz)',
      englishName: 'Shaft of Humerus',
      russianName: 'Тело / Диафиз плечевой кости',
      system: 'bone',
      position: '-0.01 -0.02 0.01',
      normal: '0 0 1',
      description: {
        uz: 'Yelka suyagi tanasi - naysimon o\'rta qism bo\'lib, unda deltasimon g\'adir-budurlik va nerv egati o\'tadi.',
        ru: 'Тело плечевой кости (диафиз) - средняя трубчатая цилиндрическая часть кости, переходящая к локтю.',
        en: 'The main long tubular cylindrical segment expressing torsional strength.'
      }
    },
    {
      id: 'hu5',
      latinName: 'Epicondylus Medialis',
      uzbekName: 'Medial epikondila (Ichki bo\'rtma)',
      englishName: 'Medial Epicondyle',
      russianName: 'Медиальный надмыщелок',
      system: 'bone',
      position: '0.07 -0.15 -0.01',
      normal: '0 0 1',
      description: {
        uz: 'Ichki tirsak bo\'rtmasi - distal uchi medialidagi yirik do\'mboq; u yerdan bilakni bukuvchi muskullar boshlanadi.',
        ru: 'Медиальный надмыщелок - крупный выступ с внутренней стороны локтя, ведущая точка начала сгибателей.',
        en: 'Large prominent inner bony projection at the elbow, anchoring forearm flexor tendons.'
      }
    },
    {
      id: 'hu6',
      latinName: 'Epicondylus Lateralis',
      uzbekName: 'Lateral epikondila (Tashqi bo\'rtma)',
      englishName: 'Lateral Epicondyle',
      russianName: 'Латеральный надмыщелок',
      system: 'bone',
      position: '-0.06 -0.14 0.01',
      normal: '0 0 1',
      description: {
        uz: 'Tashqi tirsak bo\'rtmasi - distal chetidagi nisbatan kichikroq o\'simta; unga bilak yozuvchi muskullari payi ulanadi.',
        ru: 'Латеральный надмыщелок - наружный шероховатый выступ дистального конца кости для разгибателей.',
        en: 'Smaller outer projection providing anchors for forearm extensor ligaments.'
      }
    }
  ],
  radius: [
    {
      id: 'ra1',
      latinName: 'Caput Radii',
      uzbekName: 'Bilak suyagi boshchasi',
      englishName: 'Head of Radius',
      russianName: 'Головка лучевой кости',
      system: 'bone',
      position: '0.03 0.15 0.01',
      normal: '0 0 1',
      description: {
        uz: 'Bilak suyagi boshchasi - yelka va tirsak suyaklari bilan bo\'g\'im hosil qiluvchi yuqorigi silliq disk shaklidagi boshcha.',
        ru: 'Головка лучевой кости - проксимальный дисковидный суставной конец со специальной ямкой сочленения.',
        en: 'Proximal flat disc-like structure articulating directly with the humerus capitulum.'
      }
    },
    {
      id: 'ra2',
      latinName: 'Collum Radii',
      uzbekName: 'Bilak suyagi bo\'yni',
      englishName: 'Neck of Radius',
      russianName: 'Шейка лучевой кости',
      system: 'bone',
      position: '0.02 0.11 0.0',
      normal: '0 0 1',
      description: {
        uz: 'Bilak suyagi bo\'yni - boshchani tanadan ajratib turuvchi va unga aylanma pronatsiya va supinatsiya harakatini ta\'minlovchi tor soha.',
        ru: 'Широкая шейка лучевой кости - суженная гладкая подголовковая часть.',
        en: 'Constricted cylindrical portion beneath the rotating radial head.'
      }
    },
    {
      id: 'ra3',
      latinName: 'Tuberositas Radii',
      uzbekName: 'Bilak suyagi g\'adir-budurligi',
      englishName: 'Radial Tuberosity',
      russianName: 'Бугристость лучевой кости',
      system: 'bone',
      position: '0.01 0.08 -0.02',
      normal: '0 0 1',
      description: {
        uz: 'Bilak suyagi g\'adir-budurligi - bo\'yin ostidagi medial o\'simta bo\'lib, unga biseks (ikki boshli elka muskuli) payi mustahkam yopishadi.',
        ru: 'Бугристость лучевой кости - выступ ниже шейки с внутренней стороны для сухожилия бицепса плеча.',
        en: 'Prominent medial oval projection providing the primary insertion for the biceps tendon.'
      }
    },
    {
      id: 'ra4',
      latinName: 'Corpus Radii',
      uzbekName: 'Bilak suyagi tanasi',
      englishName: 'Radial Shaft',
      russianName: 'Тело лучевой кости',
      system: 'bone',
      position: '-0.01 -0.01 0.01',
      normal: '0 0 1',
      description: {
        uz: 'Bilak suyagi tanasi - uchburchaksimon naysimon o\'rta qism bo\'lib, sirtidan bir qator muskullar o\'tadi va bilakning lateral kuchi hisoblanadi.',
        ru: 'Тело лучевой кости - трехгранный диафиз с острым межкостным краем, расширяющийся к лучезапястному суставу.',
        en: 'Three-sided tubular shaft segment expanding progressively toward the distal wrist base.'
      }
    },
    {
      id: 'ra5',
      latinName: 'Processus Styloideus Radii',
      uzbekName: 'Bizsimon o\'simta (Radius)',
      englishName: 'Styloid Process of Radius',
      russianName: 'Шовидочный отросток лучевой кости',
      system: 'bone',
      position: '-0.05 -0.15 0.02',
      normal: '0 0 1',
      description: {
        uz: 'Bizsimon o\'simta - bilak suyagi tashqi quyi chetidagi o\'tkir o\'simta; kaftustining lateral bog\'lamlariga tayanch beradi.',
        ru: 'Шиловидный отросток - заостренный выступ на латеральной стороне нижнего утолщенного конца кости.',
        en: 'Sharp spine-like projection on the distal lateral end near the thumb-side wrist joint.'
      }
    }
  ],
  femur: [
    {
      id: 'f1',
      latinName: 'Caput Femoris',
      uzbekName: 'Son suyagi boshchasi',
      englishName: 'Head of Femur',
      russianName: 'Головка бедренной кости',
      system: 'bone',
      position: '0.19 0.72 0.05',
      normal: '0.8 0.5 0.3',
      description: {
        uz: 'Chanoq-son bo\'g\'imini hosil qilish uchun chanoq suyagining sirka kosachasiga birikadigan silliq bo\'g\'im boshi.',
        ru: 'Проксимальный шаровидный суставной конец бедра, сочленяющийся с вертлужной впадиной тазовой кости.',
        en: 'The smooth spherical articulating proximal end of femur that securely fits into the pelvic acetabular cavity.'
      }
    },
    {
      id: 'f2',
      latinName: 'Collum Femoris',
      uzbekName: 'Son suyagi bo\'yni',
      englishName: 'Neck of Femur',
      russianName: 'Шейка бедренной кости',
      system: 'bone',
      position: '0.11 0.65 0.03',
      normal: '0.8 0.5 0.3',
      description: {
        uz: 'Son suyagi boshchasini uning tanasi bilan burchak ostida bog\'laydigan eng nozik va shikastlanishga moyil bo\'yin qismi.',
        ru: 'Зауженная часть кости под ее головкой, направленная под тупым углом к продольной оси тела бедра.',
        en: 'The constricted angulated column connecting the femur head with the main femoral shaft.'
      }
    },
    {
      id: 'f3',
      latinName: 'Trochanter Major',
      uzbekName: 'Katta ko\'st (Uchma)',
      englishName: 'Greater Trochanter',
      russianName: 'Большой вертел',
      system: 'bone',
      position: '-0.16 0.68 0.05',
      normal: '-0.8 0.2 0.5',
      description: {
        uz: 'Son suyagining tashqi-yuqori sohasidagi yirik g\'adir-budur do\'mboq bo\'lib, dumba va boshqa yirik muskullar uchun asosiy birikish joyidir.',
        ru: 'Крупный костный выступ на верхней границе тела бедра, к которому прикрепляются средняя и малая ягодичные мышцы.',
        en: 'A large, irregular quadrilateral projection on the lateral end of the proximal femur, anchoring gluteal muscles.'
      }
    },
    {
      id: 'f4',
      latinName: 'Trochanter Minor',
      uzbekName: 'Kichik ko\'st (Uchma)',
      englishName: 'Lesser Trochanter',
      russianName: 'Малый вертел',
      system: 'bone',
      position: '-0.10 0.50 -0.05',
      normal: '-0.5 -0.2 -0.8',
      description: {
        uz: 'Son suyagining medial-orqa quyi sohasidagi kichikroq o\'simta bo\'g\'izcha bo\'lib, asosan bel-yonbosh (iliopsoas) muskulining payini tutadi.',
        ru: 'Конический выступ на медиально-задней поверхности кости, сзади от шейки бедра, место прикрепления подвздошно-поясничной мышцы.',
        en: 'A cone-shaped anatomical projection located on the medial and posterior margins, serving as the insertion point for the iliopsoas muscle.'
      }
    },
    {
      id: 'f5',
      latinName: 'Corpus Femoris',
      uzbekName: 'Son suyagi tanasi (Diafiz)',
      englishName: 'Shaft of Femur',
      russianName: 'Тело / Диафиз бедренной кости',
      system: 'bone',
      position: '-0.04 0.1 0.05',
      normal: '0 0 1',
      description: {
        uz: 'Son suyagining naysimon o\'rta qismi (diafiz) bo\'lib, u bir oz oldinga egilgan va uning orqa yuzasida g\'adir-budur liniya (linea aspera) o\'tadi.',
        ru: 'Цилиндрический средний сегмент кости (диафиз), изогнутый вперед и содержащий на задней поверхности шероховатую линию.',
        en: 'The long tubular cylindrical central body of the femur displaying a slight forward anterior curvature.'
      }
    },
    {
      id: 'f6',
      latinName: 'Condylus Medialis',
      uzbekName: 'Ichki do\'mboq (Medial kondila)',
      englishName: 'Medial Condyle',
      russianName: 'Медиальный мыщелок',
      system: 'bone',
      position: '0.14 -0.68 0.0',
      normal: '0.5 -0.5 0.7',
      description: {
        uz: 'Son suyagining pastki qismidagi ichki yirik yarimsharsimon suyak bo\'rtmasi bo\'lib, tizza bo\'g\'imini hosil qilishda ishtirok etadi.',
        ru: 'Крупный медиальный выступ на дистальном конце бедренной кости, сочленяющийся с медиальным мыщелком большеберцовой кости.',
        en: 'The larger medial distal rounded knuckle articulating with the tibia to establish the main knee joint hinge.'
      }
    },
    {
      id: 'f7',
      latinName: 'Condylus Lateralis',
      uzbekName: 'Tashqi do\'mboq (Lateral kondila)',
      englishName: 'Lateral Condyle',
      russianName: 'Латеральный мыщелок',
      system: 'bone',
      position: '-0.12 -0.68 0.0',
      normal: '-0.5 -0.5 0.7',
      description: {
        uz: 'Son suyagining distal quyi tashqi bo\'limdagi g\'adir-budur bo\'g\'im sirti bo\'lib, tizza va katta boldir suyagi bilan bo\'g\'imlashadi.',
        ru: 'Широкий латеральный костный выступ суставной поверхности дистального эпифиза бедренной кости человека.',
        en: 'The flat lateral articulating surface of the distal femur that interfaces directly with the knee structures.'
      }
    },
    {
      id: 'f8',
      latinName: 'Facies Patellaris',
      uzbekName: 'Tizza qopqog\'i yuzasi',
      englishName: 'Patellar Surface',
      russianName: 'Надколенниковая поверхность',
      system: 'bone',
      position: '0.01 -0.62 0.14',
      normal: '0 0 1',
      description: {
        uz: 'Son suyagi distal oxirining oldingi yuzasidagi chuqurcha bo\'lib, u yerda tizza qopqog\'i (patella) silliq sirpanadi va harakat qiladi.',
        ru: 'Желобообразная передняя площадка между мыщелками бедра, по которой плавно движется надколенник при сгибании сустава.',
        en: 'The anterior groove separating the lateral and medial femoral condyles where the patella glides.'
      }
    }
  ]
};

interface Anatomy3DSuiteProps {
  src: string;
  alt: string;
  initialEntry?: any;
  onBack?: () => void;
  viewMode?: '2d' | '3d';
  onViewModeChange?: (val: '2d' | '3d') => void;
}

export default function Anatomy3DSuite({ src, alt, initialEntry, onBack, viewMode, onViewModeChange }: Anatomy3DSuiteProps) {
  const { language, t, getLocalized } = useLanguage();
  const getEntryName = (entry: any) => {
    if (!entry) return '';
    if (language === 'uz') return entry.uzbekName || entry.latinName || '';
    if (language === 'ru') return entry.russianName || entry.uzbekName || entry.latinName || '';
    return entry.englishName || entry.latinName || '';
  };
  const modelRef = useRef<any>(null);

  // 1. Core Loader States
  const [progress, setProgress] = useState(0);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDirectLoad, setIsDirectLoad] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [details, setDetails] = useState({ loaded: 0, total: 0 });
  const [modelScale, setModelScale] = useState<string>("1 1 1");

  // 2. Immersive Navigation Lab States
  const [activePreset, setActivePreset] = useState<AnatomyPreset>(() => {
    // Determine initial matching preset based on entry name keywords
    const nameStr = (initialEntry?.latinName || initialEntry?.uzbekName || '').toLowerCase();
    if (nameStr.includes('cor') || nameStr.includes('yurak') || nameStr.includes('heart') || nameStr.includes('mitral')) {
      return ANATOMY_PRESETS.find(p => p.id === 'heart') || ANATOMY_PRESETS[0];
    } else if (nameStr.includes('frontale') || nameStr.includes('jaw') || nameStr.includes('maxilla') || nameStr.includes('mandibula') || nameStr.includes('skull') || nameStr.includes('kalla') || nameStr.includes('temporale')) {
      return ANATOMY_PRESETS.find(p => p.id === 'skull') || ANATOMY_PRESETS[1];
    } else if (nameStr.includes('humerus') || nameStr.includes('yelka')) {
      return ANATOMY_PRESETS.find(p => p.id === 'humerus') || ANATOMY_PRESETS[1];
    } else if (nameStr.includes('femur') || nameStr.includes('son') || nameStr.includes('thigh')) {
      return ANATOMY_PRESETS.find(p => p.id === 'femur') || ANATOMY_PRESETS[5];
    } else if (nameStr.includes('brain') || nameStr.includes('miya') || nameStr.includes('cerebrum') || nameStr.includes('nerv') || nameStr.includes('optic')) {
      return ANATOMY_PRESETS.find(p => p.id === 'brain') || ANATOMY_PRESETS[3];
    } else if (nameStr.includes('musk') || nameStr.includes('deltoideus') || nameStr.includes('biceps') || nameStr.includes('pectoralis')) {
      return ANATOMY_PRESETS.find(p => p.id === 'muscles') || ANATOMY_PRESETS[4];
    }
    return ANATOMY_PRESETS.find(p => p.id === 'skeleton') || ANATOMY_PRESETS[2];
  });

  const [usingCustomSrc, setUsingCustomSrc] = useState(!!src);

  useEffect(() => {
    if (src) {
      setUsingCustomSrc(true);
    }
  }, [src]);

  // 3. System Layers Visibility Checkboxes
  const [layers, setLayers] = useState({
    bone: true,
    muscle: true,
    nerve: true,
    organ: true
  });

  // 4. Pin/Parts State
  const [pinsEnabled, setPinsEnabled] = useState(true);
  const [selectedPart, setSelectedPart] = useState<AnatomyPart | null>(null);
  const [contentsOpen, setContentsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 5. Professional Bottom Bar States
  const [isInterfaceHidden, setIsInterfaceHidden] = useState(false);
  const [activeViewMode, setActiveViewMode] = useState<'front' | 'back' | 'left' | 'right' | 'top'>('front');
  const [transparency, setTransparency] = useState(100); // 0 to 100
  const [isIsolateActive, setIsIsolateActive] = useState(false);
  const [isMultiSelectActive, setIsMultiSelectActive] = useState(false);
  const [multiSelectedParts, setMultiSelectedParts] = useState<AnatomyPart[]>([]);
  const [hiddenParts, setHiddenParts] = useState<string[]>([]);
  const [pastActions, setPastActions] = useState<any[]>([]);

  // 6. Camera Orbit values bindable to model-viewer
  const [cameraOrbit, setCameraOrbit] = useState('0deg 75deg 105%');
  const [cameraTarget, setCameraTarget] = useState('0m 0m 0m');
  const [fov, setFov] = useState(45);
  const [isAutoRotateActive, setIsAutoRotateActive] = useState(false);

  // Helper to parse target coordinates
  const getTargetCoords = (el: any) => {
    const targetStr = el.cameraTarget || '0m 0m 0m';
    const parts = targetStr.trim().split(/\s+/);
    if (parts.length === 3) {
      const x = parseFloat(parts[0]) || 0;
      const y = parseFloat(parts[1]) || 0;
      const z = parseFloat(parts[2]) || 0;
      return { x, y, z };
    }
    return { x: 0, y: 0, z: 0 };
  };

  // Automated Bounding Box Framing / Centering Calculation
  const reframeModel = (overrideScaleMultiplier?: number) => {
    const el = modelRef.current;
    if (!el) return;

    try {
      const center = el.getBoundingBoxCenter();
      const dimensions = el.getDimensions();
      if (center && dimensions) {
        let scaleMultiplier = 1;
        if (overrideScaleMultiplier !== undefined) {
          scaleMultiplier = overrideScaleMultiplier;
        } else {
          const scaleAttr = el.getAttribute('scale') || '';
          if (scaleAttr.includes('1000')) {
            scaleMultiplier = 1000;
          } else {
            scaleMultiplier = modelScale === "1000 1000 1000" ? 1000 : 1;
          }
        }

        const targetString = `${(center.x * scaleMultiplier).toFixed(5)}m ${(center.y * scaleMultiplier).toFixed(5)}m ${(center.z * scaleMultiplier).toFixed(5)}m`;
        setCameraTarget(targetString);
        el.cameraTarget = targetString;

        const maxDim = Math.max(dimensions.x, dimensions.y, dimensions.z) * scaleMultiplier;
        // Using 1.5 multiplier to ensure it fits perfectly with breathing room
        const optimalRadius = Math.max(maxDim * 1.5, 0.05);

        let thetaDeg = "0deg";
        let phiDeg = "75deg";

        if (typeof el.getCameraOrbit === 'function') {
          const currentOrbit = el.getCameraOrbit();
          if (currentOrbit) {
            thetaDeg = `${(currentOrbit.theta * 180 / Math.PI).toFixed(1)}deg`;
            phiDeg = `${(currentOrbit.phi * 180 / Math.PI).toFixed(1)}deg`;
          }
        }

        const orbitString = `${thetaDeg} ${phiDeg} ${optimalRadius.toFixed(4)}m`;
        setCameraOrbit(orbitString);
        el.cameraOrbit = orbitString;

        setFov(45);
        el.fieldOfView = "45deg";
        console.log("[ANATOMY-SUITE-REFRAME] Centered model beautifully using bounding box dimensions:", { targetString, orbitString, scaleMultiplier });
      } else {
        el.cameraTarget = "0m 0m 0m";
        el.cameraOrbit = "0deg 75deg 105%";
        setCameraTarget("0m 0m 0m");
        setCameraOrbit("0deg 75deg 105%");
        setFov(45);
        el.fieldOfView = "45deg";
      }
    } catch (err) {
      console.warn("[ANATOMY-SUITE-REFRAME] Dynamic framing failed, fallback to default setup:", err);
      el.cameraTarget = "0m 0m 0m";
      el.cameraOrbit = "0deg 75deg 105%";
      setCameraTarget("0m 0m 0m");
      setCameraOrbit("0deg 75deg 105%");
      setFov(45);
      el.fieldOfView = "45deg";
    }
  };

  const resetView = () => {
    const el = modelRef.current;
    if (!el) return;
    try {
      el.cameraTarget = "0m 0m 0m";
      el.cameraOrbit = "0deg 75deg 105%";
      setCameraTarget("0m 0m 0m");
      setCameraOrbit("0deg 75deg 105%");
      setFov(45);
      el.fieldOfView = "45deg";
      console.log("[RESET-VIEW] Camera successfully reset to initial defaults.");
    } catch (err) {
      console.warn("Reset view failed:", err);
    }
  };

  const handleOrbitRotate = (direction: 'left' | 'right' | 'up' | 'down') => {
    const el = modelRef.current;
    if (!el) return;
    try {
      const orbit = el.getCameraOrbit();
      if (orbit) {
        let { theta, phi, radius } = orbit;
        const stepTheta = 15 * (Math.PI / 180); // 15 degrees in rad
        const stepPhi = 10 * (Math.PI / 180);   // 10 degrees in rad
        
        if (direction === 'left') theta -= stepTheta;
        if (direction === 'right') theta += stepTheta;
        if (direction === 'up') phi = Math.max(0.1, phi - stepPhi);
        if (direction === 'down') phi = Math.min(Math.PI - 0.1, phi + stepPhi);

        const orbitString = `${theta}rad ${phi}rad ${radius}m`;
        setCameraOrbit(orbitString);
        el.cameraOrbit = orbitString;
      }
    } catch (err) {
      console.warn("Rotate failed:", err);
    }
  };

  const handleOrbitPan = (direction: 'left' | 'right' | 'up' | 'down') => {
    const el = modelRef.current;
    if (!el) return;
    try {
      const coords = getTargetCoords(el);
      const orbit = el.getCameraOrbit();
      const radius = orbit ? orbit.radius : 1.0;
      const panStep = Math.max(radius * 0.1, 0.02);
      
      if (direction === 'left') coords.x -= panStep;
      if (direction === 'right') coords.x += panStep;
      if (direction === 'up') coords.y += panStep;
      if (direction === 'down') coords.y -= panStep;

      const targetString = `${coords.x.toFixed(4)}m ${coords.y.toFixed(4)}m ${coords.z.toFixed(4)}m`;
      setCameraTarget(targetString);
      el.cameraTarget = targetString;
    } catch (err) {
      console.warn("Pan failed:", err);
    }
  };

  const handleOrbitZoom = (zoomType: 'in' | 'out') => {
    const el = modelRef.current;
    if (!el) return;
    try {
      const orbit = el.getCameraOrbit();
      if (orbit) {
        let { theta, phi, radius } = orbit;
        const scaleAttr = el.getAttribute('scale') || '';
        const scaleMultiplier = scaleAttr.includes('1000') || modelScale === "1000 1000 1000" ? 1000 : 1;
        const zoomStep = 0.85;
        const minRadius = 0.05 * scaleMultiplier;
        const maxRadius = 15.0 * scaleMultiplier;
        if (zoomType === 'in') radius = Math.max(minRadius, radius * zoomStep);
        if (zoomType === 'out') radius = Math.min(maxRadius, radius / zoomStep);

        const orbitString = `${theta}rad ${phi}rad ${radius}m`;
        setCameraOrbit(orbitString);
        el.cameraOrbit = orbitString;
      }
    } catch (err) {
      console.warn("Zoom failed:", err);
    }
  };

  // Automatically reframe on target model load to perfect standard scale/crop ratio
  useEffect(() => {
    if (isModelReady) {
      const timer = setTimeout(() => {
        reframeModel();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isModelReady, blobUrl, modelScale]);

  // 7. Custom Pin / Point edit mode states
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const modelId = (usingCustomSrc && initialEntry) ? initialEntry.id : activePreset.id;
  const [customPins, setCustomPins] = useState<AnatomyPart[]>(() => {
    try {
      const saved = localStorage.getItem(`custom_pins_${modelId}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Reload custom pins when model ID changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`custom_pins_${modelId}`);
      setCustomPins(saved ? JSON.parse(saved) : []);
    } catch (e) {
      setCustomPins([]);
    }
  }, [modelId, usingCustomSrc, activePreset.id]);

  const saveCustomPinsToStorage = (updatedPins: AnatomyPart[]) => {
    try {
      localStorage.setItem(`custom_pins_${modelId}`, JSON.stringify(updatedPins));
    } catch (e) {}
  };

  const handleModelClick = (e: any) => {
    // Left-click does not place points in the main user view
  };

  const handleModelContextMenu = (e: any) => {
    e.preventDefault(); // Prevent standard browser right-click menu and disable adding any custom pins
  };

  // Trigger sound when Latin word is spoken
  const speakLatinText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'la';
      const voices = window.speechSynthesis.getVoices();
      const bestVoice = voices.find(v => v.lang.startsWith('it') || v.lang.startsWith('la') || v.lang.startsWith('es')) || voices.find(v => v.lang.startsWith('en'));
      if (bestVoice) {
        utterance.voice = bestVoice;
      }
      utterance.rate = 0.85;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Buffer GLTF Download Engine (original robust download script)
  useEffect(() => {
    const fetchSrc = (usingCustomSrc && src) ? src : activePreset.url;
    if (!fetchSrc) return;

    setBlobUrl(null);
    setProgress(0);
    setError(null);
    setIsDirectLoad(false);
    setIsModelReady(false);
    setModelScale("1 1 1");
    setDetails({ loaded: 0, total: 0 });

    const loadModel = async () => {
      console.log("[ANATOMY-3D-SUITE] Direct loading model file:", fetchSrc);
      let finalUrl = fetchSrc;
      const isCorsFriendly = fetchSrc.includes('modelviewer.dev') || fetchSrc.includes('githubusercontent.com') || fetchSrc.includes('threejs.org');
      if (fetchSrc && fetchSrc.startsWith('http') && !fetchSrc.includes(window.location.host) && !isCorsFriendly) {
        finalUrl = `/api/proxy?url=${encodeURIComponent(fetchSrc)}`;
      }
      setBlobUrl(finalUrl);
      setIsDirectLoad(true);
      setProgress(0);
    };

    loadModel();
  }, [activePreset, src, usingCustomSrc]);

  // Clean-up blob objects to prevent memory leaks in preview container
  useEffect(() => {
    return () => {
      if (blobUrl && !isDirectLoad) {
        try {
          const cleanBlobUrl = blobUrl.split('#')[0];
          URL.revokeObjectURL(cleanBlobUrl);
        } catch (e) {}
      }
    };
  }, [blobUrl, isDirectLoad]);

  // Check WebGL compatibility on mount
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const supportsWebGL = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      if (!supportsWebGL) {
        setError("Qurilmangiz yoki brauzeringiz WebGL (3D grafika) tizimini qo'llab-quvvatlamaydi. Iltimos, boshqa brauzer yoki yangiroq brauzerdan foydalaning.");
      }
    } catch (e) {
      setError("WebGL-ni aniqlashda muammo yuzaga keldi. Qurilmangiz 3D grafikani qo'llab-quvvatlamasligi mumkin.");
    }
  }, []);

  // Keep values in refs to avoid re-registering listeners and causing race conditions
  const isDirectLoadRef = useRef(isDirectLoad);
  useEffect(() => {
    isDirectLoadRef.current = isDirectLoad;
  }, [isDirectLoad]);

  // Wire up custom element event listeners for load state (and fallback periodic inspector checker to avoid any race condition freeze)
  useEffect(() => {
    const el = modelRef.current;
    if (!el) return;

    const handleLoad = () => {
      console.log("[ANATOMY-3D-SUITE] Model loaded successfully to screen");
      let scaleMult = 1;
      const dimensions = el.getDimensions();
      if (dimensions) {
        const maxDim = Math.max(dimensions.x, dimensions.y, dimensions.z);
        if (maxDim > 0 && maxDim < 0.05) {
          scaleMult = 1000;
          setModelScale("1000 1000 1000");
          console.log("[SCALE-DETECTOR] Tiny model detected, scaling up 1000x in AnatomySuite:", maxDim);
        } else {
          setModelScale("1 1 1");
        }
      }
      setIsModelReady(true);
      setProgress(100);
      reframeModel(scaleMult);
    };

    const handleError = (err: any) => {
      console.error("[ANATOMY-3D-SUITE] Model rendering failed:", err);
      setError(
        "3D modelni yuklashda qiyinchilik yuzaga keldi."
      );
    };

    const handleProgress = (event: any) => {
      if (isDirectLoadRef.current && event.detail) {
        const p = Math.round(event.detail.totalProgress * 100);
        setProgress(isNaN(p) ? 0 : p);
      }
    };

    el.addEventListener('load', handleLoad);
    el.addEventListener('error', handleError);
    el.addEventListener('progress', handleProgress);

    // Robust periodic state inspector to protect against lost event triggers
    const inspectorInterval = setInterval(() => {
      if (el.loaded || el.complete) {
        console.log("[ANATOMY-3D-SUITE] Inspector detected model has loaded successfully.");
        let scaleMult = 1;
        const dimensions = el.getDimensions();
        if (dimensions) {
          const maxDim = Math.max(dimensions.x, dimensions.y, dimensions.z);
          if (maxDim > 0 && maxDim < 0.05) {
            scaleMult = 1000;
            setModelScale("1000 1000 1000");
            console.log("[SCALE-DETECTOR] Inspector found tiny model, scaling up 1000x in AnatomySuite:", maxDim);
          } else {
            setModelScale("1 1 1");
          }
        }
        setIsModelReady(true);
        setProgress(100);
        reframeModel(scaleMult);
        clearInterval(inspectorInterval);
      }
    }, 450);

    return () => {
      el.removeEventListener('load', handleLoad);
      el.removeEventListener('error', handleError);
      el.removeEventListener('progress', handleProgress);
      clearInterval(inspectorInterval);
    };
  }, [blobUrl]);

  // Handle mesh transparency via Three.js material traversal
  const applyTransparency = (opacityPercent: number) => {
    const el = modelRef.current;
    if (!el) return;

    let scene: any = null;
    const symbols = Object.getOwnPropertySymbols(el);
    for (const s of symbols) {
      const obj = el[s];
      if (obj?.currentGLTF?.scene) {
        scene = obj.currentGLTF.scene;
        break;
      }
      if (obj?.type === 'Scene' || obj?.isScene) {
        scene = obj;
        break;
      }
    }

    if (!scene) {
      for (const s of symbols) {
        const obj = el[s];
        if (obj && typeof obj === 'object') {
          try {
            for (const k of Object.keys(obj)) {
              const val = obj[k];
              if (val?.type === 'Scene' || val?.isScene) {
                scene = val;
                break;
              }
            }
          } catch (_) {}
          if (scene) break;
        }
      }
    }

    if (scene) {
      const scale = opacityPercent / 100;
      scene.traverse((child: any) => {
        if (child.isMesh && child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((mat: any) => {
            mat.transparent = true;
            mat.opacity = scale;
            mat.needsUpdate = true;
          });
        }
      });
    }
  };

  useEffect(() => {
    if (isModelReady && modelRef.current) {
      const timer = setTimeout(() => {
        applyTransparency(transparency);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [transparency, isModelReady, blobUrl]);

  // Hotspot Click Event: Focus and fly camera target
  const handlePartSelect = (part: AnatomyPart) => {
    // Record action for Undo queue
    setPastActions(prev => [...prev, { type: 'select', prev: selectedPart }]);

    if (isMultiSelectActive) {
      if (multiSelectedParts.some(x => x.id === part.id)) {
        setMultiSelectedParts(prev => prev.filter(x => x.id !== part.id));
      } else {
        setMultiSelectedParts(prev => [...prev, part]);
      }
      setSelectedPart(part);
    } else {
      setSelectedPart(part);
    }

    // Update target point coordinates dynamically to focus & zoom camera
    const scaleAttr = modelRef.current?.getAttribute('scale') || '';
    const scaleMultiplier = scaleAttr.includes('1000') || modelScale === "1000 1000 1000" ? 1000 : 1;

    const coords = part.position.split(' ').map(Number);
    const scaledCoords = coords.map(c => c * scaleMultiplier);
    const targetString = `${scaledCoords.map(x => x.toFixed(5) + 'm').join(' ')}`;
    
    const orbitRadius = 0.75 * scaleMultiplier;
    const orbitString = `45deg 75deg ${orbitRadius.toFixed(2)}m`;

    setCameraTarget(targetString);
    setCameraOrbit(orbitString);

    if (modelRef.current) {
      modelRef.current.cameraTarget = targetString;
      modelRef.current.cameraOrbit = orbitString;
    }

    // Speech Latin pronunciation
    speakLatinText(part.latinName);
  };

  // Change default structural viewpoint angles (VIEWS button)
  const setViewAnglePreset = (view: 'front' | 'back' | 'left' | 'right' | 'top') => {
    setActiveViewMode(view);
    setCameraTarget('0m 0m 0m');
    switch (view) {
      case 'front':
        setCameraOrbit('0deg 75deg 105%');
        break;
      case 'back':
        setCameraOrbit('180deg 75deg 105%');
        break;
      case 'left':
        setCameraOrbit('-90deg 75deg 105%');
        break;
      case 'right':
        setCameraOrbit('90deg 75deg 105%');
        break;
      case 'top':
        setCameraOrbit('0deg 0deg 105%');
        break;
    }
  };

  // Isolate current active part
  const toggleIsolate = () => {
    setIsIsolateActive(!isIsolateActive);
    if (!isIsolateActive && selectedPart) {
      // Turn transparency down of other assets to provide high-contrast visualization
      setTransparency(15);
    } else {
      setTransparency(100);
    }
  };

  // Hide selected part
  const hideSelectedPart = () => {
    if (selectedPart) {
      setHiddenParts(prev => [...prev, selectedPart.id]);
      setSelectedPart(null);
    }
  };

  // Undo last structural action
  const handleUndo = () => {
    if (pastActions.length === 0) return;
    const last = pastActions[pastActions.length - 1];
    setPastActions(prev => prev.slice(0, -1));

    if (last.type === 'select') {
      setSelectedPart(last.prev);
    }
  };

  // Complete laboratory reset
  const handleResetScene = () => {
    setTransparency(100);
    setIsIsolateActive(false);
    setIsMultiSelectActive(false);
    setMultiSelectedParts([]);
    setHiddenParts([]);
    setSelectedPart(null);
    setCameraTarget('0m 0m 0m');
    setCameraOrbit('0deg 75deg 105%');
    setLayers({ bone: true, muscle: true, nerve: true, organ: true });
    setSearchQuery('');
  };

  // Filter components with search and layers
  const partsList = (() => {
    let baseParts: any[] = [];
    if (usingCustomSrc && initialEntry) {
      if (Array.isArray(initialEntry.pins) && initialEntry.pins.length > 0) {
        baseParts = initialEntry.pins;
      } else {
        const nameL = (initialEntry.latinName || initialEntry.uzbekName || '').toLowerCase();
        if (nameL.includes('frontale') || nameL.includes('peshona')) baseParts = ANATOMY_PARTS['frontale'] || [];
        else if (nameL.includes('maxilla') || nameL.includes('yuqori jag')) baseParts = ANATOMY_PARTS['maxilla'] || [];
        else if (nameL.includes('mandibula') || nameL.includes('pastki jag')) baseParts = ANATOMY_PARTS['mandibula'] || [];
        else if (nameL.includes('scapula') || nameL.includes('kurak')) baseParts = ANATOMY_PARTS['scapula'] || [];
        else if (nameL.includes('humerus') || nameL.includes('yelka')) baseParts = ANATOMY_PARTS['humerus'] || [];
        else if (nameL.includes('radius') || nameL.includes('bilak')) baseParts = ANATOMY_PARTS['radius'] || [];
        else if (nameL.includes('femur') || nameL.includes('son')) baseParts = ANATOMY_PARTS['femur'] || [];
      }
    } else {
      baseParts = ANATOMY_PARTS[activePreset.id] || [];
    }
    // Return base anatomical list merged with our interactive custom points
    return [...baseParts, ...customPins];
  })();
  const filteredParts = partsList.filter(part => {
    // Filter by layers
    if (!layers[part.system]) return false;

    // Filter by hidden parts
    if (hiddenParts.includes(part.id)) return false;

    // Filter by search
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      part.latinName.toLowerCase().includes(query) ||
      part.uzbekName.toLowerCase().includes(query) ||
      part.englishName.toLowerCase().includes(query) ||
      part.russianName.toLowerCase().includes(query)
    );
  });

  const getLocalizedName = (part: AnatomyPart) => {
    if (language === 'uz') return part.uzbekName;
    if (language === 'ru') return part.russianName;
    return part.englishName;
  };

  const getLocalizedDesc = (part: AnatomyPart) => {
    return part.description[language] || part.description['uz'] || '';
  };

  return (
    <div className="absolute inset-0 bg-[#0A0B0E] flex flex-col md:flex-row overflow-hidden text-left font-sans select-none z-[110]">
      {/* 3D Main Scene Container */}
      <div className="flex-grow h-full relative cursor-grab active:cursor-grabbing">
        {/* Background Grids & Sci-fi details */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 2px, transparent 0)', backgroundSize: '30px 30px' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0D0F14]/40 to-[#07080A]" />

        {/* Dynamic Model Viewer Element */}
        <div className="w-full h-full relative z-10" id="anatomical-3d-stage">
          {error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#07080A] gap-6 p-8 text-center overflow-y-auto z-55">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
              </div>
              <div className="space-y-4 max-w-md w-full z-10">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">3D Vizualizatsiya Yuklanmadi</h3>
                <p className="text-white/50 text-xs font-semibold leading-relaxed">
                  {error || "Anatomik modelni render qilishda kutilmagan texnik muammo yuz berdi."}
                </p>

                {initialEntry?.image && (
                  <div className="mt-4 p-4 bg-white/[0.02] border border-[#ff3b30]/10 rounded-2xl">
                    <span className="text-[9px] font-black uppercase text-brand-accent tracking-widest block mb-2">
                      2D Shaxsiy Fallback Ko'rinish
                    </span>
                    <img 
                      src={initialEntry.image} 
                      alt="Anatomy Diagram fallback" 
                      className="max-h-48 object-contain mx-auto filter brightness-95 contrast-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => {
                      setError(null);
                      setProgress(0);
                      setIsModelReady(false);
                      const fetchSrc = (usingCustomSrc && src) ? src : activePreset.url;
                      if (fetchSrc) {
                        setBlobUrl(null);
                        setTimeout(() => {
                          let finalUrl = fetchSrc;
                          if (fetchSrc.startsWith('http') && !fetchSrc.includes(window.location.host)) {
                            finalUrl = `/api/proxy?url=${encodeURIComponent(fetchSrc)}`;
                          }
                          setBlobUrl(finalUrl);
                          setIsDirectLoad(true);
                        }, 50);
                      }
                    }}
                    className="flex-grow px-6 py-3 bg-brand-accent text-brand-primary rounded-xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all w-full cursor-pointer"
                  >
                    Qayta urinish
                  </button>
                  {onBack && (
                    <button 
                      onClick={onBack}
                      className="flex-grow px-6 py-3 border border-white/10 hover:border-white/20 text-white/60 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all"
                    >
                      Orqagaga qaytish
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              <ModelViewer
              ref={modelRef}
              src={blobUrl || undefined}
              alt={alt}
              scale={modelScale}
              auto-rotate={isAutoRotateActive || (isModelReady && !selectedPart && !isEditMode) ? "true" : "false"}
              auto-rotate-delay="3000"
              rotation-intensity="0.4"
              camera-controls=""
              enable-pan=""
              bounds="auto"
              shadow-intensity="1.0"
              exposure="1.6"
              environment-image="neutral"
              loading="eager"
              reveal="auto"
              dynamic-scaling="false"
              minimum-render-scale="1"
              tone-mapping="commerce"
              style={{ width: '100%', height: '100%', outline: 'none' }}
              onClick={handleModelClick}
              onContextMenu={handleModelContextMenu}
            >
              {/* Overlay poster before model lands */}
              <div slot="poster" className="absolute inset-0 bg-black flex flex-col items-center justify-center p-8">
                <div className="relative">
                  <div className="w-16 h-16 border-2 border-brand-accent/5 border-t-brand-accent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 bg-brand-accent/10 blur-xl rounded-full"></div>
                </div>
                <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-5 animate-pulse">Initializing Reactor</span>
              </div>

              {/* Interactive Anatomical Pins / Hotspots mapping */}
              {pinsEnabled && !isInterfaceHidden && filteredParts.map((part) => {
                const isSelected = selectedPart?.id === part.id;
                const isMultiSelected = multiSelectedParts.some(x => x.id === part.id);
                
                if (isIsolateActive && !isSelected) return null;

                return (
                  <button
                    key={part.id}
                    slot={`hotspot-${part.id}`}
                    data-position={part.position}
                    data-normal={part.normal || "0 0 1"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePartSelect(part);
                    }}
                    className={`group relative pointer-events-auto cursor-pointer focus:outline-none focus:ring-0 active:scale-90 transition-transform ${
                      isSelected ? 'z-50 scale-110' : 'z-30'
                    }`}
                  >
                    {/* Outer Pulsing Aura Ring */}
                    <div className={`absolute -inset-4 rounded-full border-2 transition-all duration-700 ${
                      isSelected 
                        ? 'border-brand-accent animate-ping opacity-90' 
                        : isMultiSelected 
                          ? 'border-blue-400 animate-pulse opacity-80'
                          : 'border-brand-accent/30 opacity-30 group-hover:opacity-100 group-hover:scale-125'
                    }`} />

                    {/* Core Pin Ring Graphic */}
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isSelected 
                        ? 'bg-amber-400/10 border-brand-accent shadow-[0_0_20px_rgba(255,215,0,0.5)] scale-110' 
                        : isMultiSelected 
                          ? 'bg-blue-500/10 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                          : 'bg-black/80 border-brand-accent hover:border-white'
                    }`}>
                      {/* Tiny Center Pupil */}
                      <div className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        isSelected 
                          ? 'bg-brand-accent' 
                          : isMultiSelected 
                            ? 'bg-blue-400'
                            : 'bg-brand-accent/60 group-hover:bg-white'
                      }`} />
                    </div>

                    {/* High Precision Floating Tag removed as requested to keep 3D models clean */}
                  </button>
                );
              })}
            </ModelViewer>

            {/* Interactive On-Screen OrbitControls Dashboard Overlay */}
            {isModelReady && !isInterfaceHidden && (() => {
              const labels = {
                orbitControls: {
                  uz: 'Kamera Navigatsiyasi (OrbitControls)',
                  ru: 'Навигация Камеры (OrbitControls)',
                  en: 'Camera Navigation (OrbitControls)'
                },
                rotate: {
                  uz: 'Aylantirish',
                  ru: 'Вращение',
                  en: 'Rotation'
                },
                pan: {
                  uz: 'Surish',
                  ru: 'Сдвиг',
                  en: 'Panning'
                },
                zoom: {
                  uz: 'Masofalashtirish',
                  ru: 'Масштаб',
                  en: 'Zoom'
                },
                autoRotate: {
                  uz: 'Avto-aylantirish',
                  ru: 'Авто-вращение',
                  en: 'Auto-Rotate'
                },
                reframe: {
                  uz: 'Sig\'dirish',
                  ru: 'Вписать',
                  en: 'Fit Model'
                },
                resetView: {
                  uz: 'Kamerani Tiklash',
                  ru: 'Сбросить Вид',
                  en: 'Reset View'
                },
                helpText: {
                  uz: 'O\'ng tugma: Nuqta qo\'yish | Chap tugma: Aylantirish | Shift+Sichqoncha: Surish',
                  ru: 'Правый клик: Поставить точку | ЛКМ: Вращение | Shift+Мышь: Сдвиг',
                  en: 'Right-click: Place pin | Left-click: Rotate | Shift+Mouse: Panning'
                }
              };

              const l = (key: keyof typeof labels) => {
                return labels[key][(language as 'uz' | 'ru' | 'en') || 'uz'] || labels[key]['uz'];
              };

              return (
                <div className="absolute bottom-6 left-6 z-40 bg-black/85 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-[280px] pointer-events-auto flex flex-col gap-3 shadow-2xl text-white animate-none">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-[10px] font-black uppercase text-brand-accent tracking-widest flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                      {l('orbitControls')}
                    </span>
                  </div>

                  {/* Controls Matrix */}
                  <div className="grid grid-cols-2 gap-3 items-center">
                    {/* Circle rotate joypad */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[8px] font-extrabold text-white/50 uppercase tracking-wider">{l('rotate')}</span>
                      <div className="relative w-18 h-18 bg-white/5 rounded-full border border-white/10 flex items-center justify-center p-1">
                        <button 
                          type="button" 
                          onClick={() => handleOrbitRotate('up')} 
                          className="absolute top-0.5 p-0.5 bg-white/5 hover:bg-white/15 active:bg-brand-accent/20 rounded text-white border border-white/5 cursor-pointer hover:border-brand-accent/40 active:border-brand-accent transition-all animate-none"
                        >
                          <ChevronUp size={10} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleOrbitRotate('left')} 
                          className="absolute left-0.5 p-0.5 bg-white/5 hover:bg-white/15 active:bg-brand-accent/20 rounded text-white border border-white/5 cursor-pointer hover:border-brand-accent/40 active:border-brand-accent transition-all animate-none"
                        >
                          <ChevronLeft size={10} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleOrbitRotate('right')} 
                          className="absolute right-0.5 p-0.5 bg-white/5 hover:bg-white/15 active:bg-brand-accent/20 rounded text-white border border-white/5 cursor-pointer hover:border-brand-accent/40 active:border-brand-accent transition-all animate-none animate-none"
                        >
                          <ChevronRight size={10} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleOrbitRotate('down')} 
                          className="absolute bottom-0.5 p-0.5 bg-white/5 hover:bg-white/15 active:bg-brand-accent/20 rounded text-white border border-white/5 cursor-pointer hover:border-brand-accent/40 active:border-brand-accent transition-all animate-none"
                        >
                          <ChevronDown size={10} />
                        </button>
                        <div className="w-3 h-3 rounded-full border border-brand-accent/20 bg-brand-accent/5 animate-pulse" />
                      </div>
                    </div>

                    {/* Circle Panning joypad */}
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[8px] font-extrabold text-white/50 uppercase tracking-wider">{l('pan')}</span>
                      <div className="relative w-18 h-18 bg-white/5 rounded-full border border-white/10 flex items-center justify-center p-1">
                        <button 
                          type="button" 
                          onClick={() => handleOrbitPan('up')} 
                          className="absolute top-0.5 p-0.5 bg-white/5 hover:bg-white/15 active:bg-brand-accent/20 rounded text-white border border-white/5 cursor-pointer hover:border-brand-accent/40 active:border-brand-accent transition-all animate-none"
                        >
                          <ChevronUp size={10} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleOrbitPan('left')} 
                          className="absolute left-0.5 p-0.5 bg-white/5 hover:bg-white/15 active:bg-brand-accent/20 rounded text-white border border-white/5 cursor-pointer hover:border-brand-accent/40 active:border-brand-accent transition-all animate-none"
                        >
                          <ChevronLeft size={10} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleOrbitPan('right')} 
                          className="absolute right-0.5 p-0.5 bg-white/5 hover:bg-white/15 active:bg-brand-accent/20 rounded text-white border border-white/5 cursor-pointer hover:border-brand-accent/40 active:border-brand-accent transition-all animate-none"
                        >
                          <ChevronRight size={10} />
                        </button>
                        <button 
                          type="button" 
                          onClick={() => handleOrbitPan('down')} 
                          className="absolute bottom-0.5 p-0.5 bg-white/5 hover:bg-white/15 active:bg-brand-accent/20 rounded text-white border border-white/5 cursor-pointer hover:border-brand-accent/40 active:border-brand-accent transition-all animate-none"
                        >
                          <ChevronDown size={10} />
                        </button>
                        <div className="w-5 h-5 rounded-full border border-brand-accent/20 flex items-center justify-center bg-brand-accent/5">
                          <Move className="w-2.5 h-2.5 text-brand-accent anim-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Zoom & Quick Reset Bar */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {/* Zoom control */}
                    <div className="bg-white/5 border border-white/5 rounded-xl p-2 flex items-center justify-around gap-2">
                      <button 
                        type="button" 
                        onClick={() => handleOrbitZoom('out')} 
                        className="p-1 px-1.5 hover:bg-white/10 active:bg-brand-accent/20 rounded text-white cursor-pointer"
                        title="Zoom out"
                      >
                        <ZoomOut size={10} />
                      </button>
                      <span className="text-[8px] font-black tracking-widest text-white/50 uppercase">{l('zoom')}</span>
                      <button 
                        type="button" 
                        onClick={() => handleOrbitZoom('in')} 
                        className="p-1 px-1.5 hover:bg-white/10 active:bg-brand-accent/20 rounded text-white cursor-pointer"
                        title="Zoom in"
                      >
                        <ZoomIn size={10} />
                      </button>
                    </div>

                    {/* Auto fit bounding-box helper */}
                    <button 
                      type="button" 
                      onClick={() => reframeModel()} 
                      className="bg-brand-accent/15 hover:bg-brand-accent/25 active:scale-95 border border-brand-accent/30 rounded-xl p-2 flex items-center justify-center gap-1.5 text-brand-accent font-black uppercase text-[8px] tracking-widest cursor-pointer transition-all animate-none"
                    >
                      <Maximize2 size={10} />
                      {l('reframe')}
                    </button>
                  </div>

                  {/* Reset view & Auto-Rotate Row */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Reset button */}
                    <button 
                      type="button" 
                      onClick={resetView} 
                      className="bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 rounded-xl p-2 flex items-center justify-center gap-1.5 text-white/80 font-black uppercase text-[8px] tracking-widest cursor-pointer transition-all animate-none"
                      title={l('resetView')}
                    >
                      <RotateCcw size={10} className="text-white" />
                      {l('resetView')}
                    </button>

                    {/* Auto-Rotate Switch */}
                    <div className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl p-2">
                      <span className="text-[8px] font-black uppercase tracking-widest text-white/60">{l('autoRotate')}</span>
                      <button 
                        type="button" 
                        onClick={() => setIsAutoRotateActive(!isAutoRotateActive)} 
                        className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-300 relative ${isAutoRotateActive ? 'bg-brand-accent' : 'bg-white/10'}`}
                      >
                        <div className={`w-3 h-3 rounded-full bg-[#07080A] transition-transform duration-300 ${isAutoRotateActive ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  </div>

                  {/* Gesture Guide text ticker */}
                  <p className="text-[7.5px] text-white/40 leading-normal text-center select-none pt-1 border-t border-white/5 uppercase tracking-wide">
                    {l('helpText')}
                  </p>
                </div>
              );
            })()}
          </>
        )}
      </div>

        {/* ----------------------------------------------------------------------
            OVERLAY: Immersive Progress Ring for Heavy 3D Files Loading
            ---------------------------------------------------------------------- */}
        {!isModelReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#07080A] z-[80] pointer-events-none">
            <div className="absolute inset-0 bg-[#090B10]/95 backdrop-blur-md" />
            <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
              {/* Radial Progress Loop */}
              <div className="relative w-44 h-44 mb-8 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="88" cy="88" r="75" stroke="rgba(255,255,255,0.03)" strokeWidth="1" fill="transparent" />
                  <circle 
                    cx="88" cy="88" r="75" stroke="#FFD700" strokeWidth="2.5" fill="transparent" 
                    strokeDasharray="471.2" strokeDashoffset={471.2 - (471.2 * progress) / 100}
                    className="transition-all duration-300"
                  />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-black text-white tracking-tighter">{progress}%</span>
                  <span className="text-[8px] font-black text-brand-accent uppercase tracking-widest mt-1">Loding Mesh</span>
                </div>
              </div>

              <h3 className="text-white text-sm font-black uppercase tracking-[0.2em]">
                {usingCustomSrc ? getEntryName(initialEntry) : (activePreset.name[language] || activePreset.name['uz'])}
              </h3>
              <p className="text-white/40 text-xs mt-3 leading-relaxed max-w-sm line-clamp-3">
                {usingCustomSrc ? (initialEntry?.description || '') : (language === 'uz' ? 'Anatomik to\'rlar, pin nuqtalar va unga taalluqli asab yo\'llari yuklanmoqda...' : 'Загрузка полигональной анатомической сетки, связей и текстур...')}
              </p>
              
              <div className="mt-8 flex gap-4 text-white/50 font-mono text-[9px] uppercase tracking-wider px-3 py-1.5 border border-white/5 rounded-lg bg-white/[0.01]">
                <span>{(details.loaded / 1024 / 1024).toFixed(1)} MB</span>
                <span>/</span>
                <span>{details.total > 0 ? (details.total / 1024 / 1024).toFixed(1) : 'AUTO'} MB</span>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------------------------------------------------------
            OVERLAY: Interactive Top Selected Structure Title Card (Removed as requested to keep the 3D model face completely clean)
            ---------------------------------------------------------------------- */}

        {/* ----------------------------------------------------------------------
            WIDGET: Controls Overlay Left Side (Contents, Pins toggle, etc)
            ---------------------------------------------------------------------- */}
        {!isInterfaceHidden && (
          <div className="absolute top-6 left-6 flex flex-col gap-3 z-30 pointer-events-none">
            {/* BACK TO DASHBOARD */}
            {onBack && (
              <button
                onClick={onBack}
                className="w-12 h-12 bg-black/80 hover:bg-white/10 text-white border border-white/10 rounded-2xl flex items-center justify-center transition-all cursor-pointer pointer-events-auto"
                title="Orqaga"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}

            {/* TOGGLE TO 2D */}
            {onViewModeChange && (
              <button
                onClick={() => onViewModeChange('2d')}
                className="w-12 h-12 bg-black/80 hover:bg-white/10 text-white border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer pointer-events-auto shadow-2xl"
                title="2D Ko'rinish"
              >
                <ImageIcon className="w-4 h-4 text-emerald-400" />
                <span className="text-[7.5px] font-black leading-none uppercase select-none">2D VIEW</span>
              </button>
            )}

            {/* CONTENTS Menu Button */}
            <button
              onClick={() => {
                setContentsOpen(true);
                // Switch focus to contents search
              }}
              className="px-5 py-3.5 bg-black/80 hover:bg-white/10 text-white border border-white/10 rounded-2xl flex items-center gap-2.5 transition-all cursor-pointer pointer-events-auto shadow-2xl"
              title="Mavzular Tarkibi"
            >
              <Layers className="w-4 h-4 text-brand-accent animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">CONTENTS</span>
            </button>

            {/* PINS TOGGLE */}
            <button
               onClick={() => setPinsEnabled(!pinsEnabled)}
               className={`w-12 h-12 border rounded-2xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer pointer-events-auto ${
                 pinsEnabled ? 'bg-amber-400 text-black border-amber-400 shadow-lg shadow-brand-accent/20' : 'bg-black/60 text-white/50 border-white/10'
               }`}
               title={pinsEnabled ? "Pinlarni o'chirish" : "Pinlarni yoqish"}
            >
              <Filter className="w-4 h-4" />
              <span className="text-[7px] font-black leading-none uppercase">PINS</span>
            </button>
          </div>
        )}

        {/* Show Floating UI trigger if UI is hidden */}
        {isInterfaceHidden && (
          <button
            onClick={() => setIsInterfaceHidden(false)}
            className="absolute top-6 left-6 z-50 px-6 py-3.5 bg-[#FFD700] text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl animate-bounce cursor-pointer"
          >
            Show Interface (UIni Ko'rsatish)
          </button>
        )}

        {/* Floating Guide Banner for Edit Mode */}
        {isEditMode && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 bg-rose-600/90 backdrop-blur-md px-6 py-3 border border-rose-500/50 rounded-2xl flex items-center gap-3 shadow-[0_0_30px_rgba(225,29,72,0.4)] pointer-events-none animate-in fade-in slide-in-from-top-4">
            <div className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">
              3D model sirtiga bosib yangi nuqta qo'ying
            </span>
          </div>
        )}

        {/* FLOATING ZOOM AND EXTAND-COLLAPSE PANEL CONTROLS - TOP RIGHT */}
        {!isInterfaceHidden && (
          <div className="absolute top-6 right-6 flex flex-col items-end gap-3 z-30 pointer-events-auto">
            {/* ZOOM PANE CONTROLS */}
            <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 shadow-2xl">
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest mr-1">ZOOM (Kattalashtirish):</span>
              <button 
                onClick={() => setFov(prev => Math.max(10, prev - 5))}
                className="w-8 h-8 text-[#FFD700] hover:text-black bg-white/5 hover:bg-[#FFD700] rounded-xl border border-white/5 flex items-center justify-center cursor-pointer transition-colors"
                title="Yaqinlashtirish (Zoom In)"
              >
                <ZoomIn size={14} />
              </button>
              <button 
                onClick={() => setFov(prev => Math.min(85, prev + 5))}
                className="w-8 h-8 text-[#FFD700] hover:text-black bg-white/5 hover:bg-[#FFD700] rounded-xl border border-white/5 flex items-center justify-center cursor-pointer transition-colors"
                title="Uzoqlashtirish (Zoom Out)"
              >
                <ZoomOut size={14} />
              </button>
              <button 
                onClick={() => {
                  setFov(45);
                  setCameraOrbit("0deg 75deg 105%");
                }}
                className="w-8 h-8 text-white/60 hover:text-black bg-white/5 hover:bg-white/80 rounded-xl border border-white/5 flex items-center justify-center cursor-pointer transition-colors"
                title="Dastlabki ko'rinish"
              >
                <RotateCcw size={12} />
              </button>
            </div>

            {/* COLLAPSE/EXPAND TACTICAL ACTION */}
            {isEditMode && (
              <button
                id="toggle-edit-sidebar-btn"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className={`px-5 py-3 border rounded-2xl flex items-center gap-2 transition-all cursor-pointer shadow-2xl ${
                  isSidebarCollapsed 
                    ? 'bg-amber-400 text-black border-amber-500 font-black' 
                    : 'bg-black/80 hover:bg-white/10 text-white border-white/10'
                }`}
                title={isSidebarCollapsed ? "Tahrirlash panelini ochish (Kichraytirish)" : "Tahrirlash panelini yashirish (3D zonani maksimal darajada kattalashtirish)"}
              >
                <Maximize2 className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {isSidebarCollapsed ? "Panelni Ko'rsatish (Show Panel)" : "3D Zonani Kattalashtirish (Full Space)"}
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* ----------------------------------------------------------------------
          SIDEBAR PANEL: Systems Contents Drawer (Bone, Nerve, Muscle, Organs)
          ---------------------------------------------------------------------- */}
      <AnimatePresence>
        {contentsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/40 backdrop-blur-sm flex justify-start text-left"
            onClick={() => setContentsOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0D0F14] border-r border-white/10 w-full max-w-sm h-full flex flex-col pointer-events-auto p-8 overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <div>
                  <h4 className="text-[10px] font-mono text-brand-accent tracking-widest uppercase">3D Anatomy Hub</h4>
                  <h3 className="text-lg font-black text-white uppercase tracking-tight mt-1">SAYT TARKIBI (CONTENTS)</h3>
                </div>
                <button
                  onClick={() => setContentsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Anatomy Presets Selection List */}
              <div className="space-y-3 mb-8">
                <span className="text-[8px] font-black text-white/40 tracking-widest uppercase block mb-2">ANATOMY SYSTEMS LAB:</span>
                <div className="grid grid-cols-1 gap-2">
                  {ANATOMY_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setActivePreset(preset);
                        setSelectedPart(null);
                        setMultiSelectedParts([]);
                        setUsingCustomSrc(false);
                        // Keep content open for explore
                      }}
                      className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        activePreset.id === preset.id
                          ? 'bg-[#FFD700]/10 border-brand-accent/50 shadow-md'
                          : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className={`p-2 rounded-xl border ${
                        activePreset.id === preset.id ? 'bg-brand-accent text-black border-brand-accent' : 'bg-black/60 text-white/60 border-white/10'
                      }`}>
                        {preset.id === 'heart' ? <Heart className="w-4 h-4" /> : <Box className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <h4 className={`text-xs font-black transition-colors ${activePreset.id === preset.id ? 'text-brand-accent' : 'text-white'}`}>
                          {preset.name[language] || preset.name['uz']}
                        </h4>
                        <p className="text-[9px] text-white/40 italic font-mono mt-0.5">{preset.latin}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkbox Layers */}
              <div className="bg-black/40 rounded-[24px] border border-white/5 p-5 mb-8">
                <span className="text-[8px] font-black text-white/40 tracking-widest uppercase block mb-3">TIZIM QATLAMLARI (LAYERS):</span>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Bone Layer */}
                  <button
                    onClick={() => setLayers(prev => ({ ...prev, bone: !prev.bone }))}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-[10px] font-bold transition-all cursor-pointer ${
                      layers.bone ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-transparent border-white/5 text-white/30'
                    }`}
                  >
                    <span>🦴 Skelet (Bone)</span>
                    {layers.bone ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  {/* Muscle Layer */}
                  <button
                    onClick={() => setLayers(prev => ({ ...prev, muscle: !prev.muscle }))}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-[10px] font-bold transition-all cursor-pointer ${
                      layers.muscle ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-transparent border-white/5 text-white/30'
                    }`}
                  >
                    <span>🥩 Muskul (Muscle)</span>
                    {layers.muscle ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  {/* Nerve Layer */}
                  <button
                    onClick={() => setLayers(prev => ({ ...prev, nerve: !prev.nerve }))}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-[10px] font-bold transition-all cursor-pointer ${
                      layers.nerve ? 'bg-sky-500/10 border-sky-500/30 text-sky-400' : 'bg-transparent border-white/5 text-white/30'
                    }`}
                  >
                    <span>⚡ Nerv (Nerve)</span>
                    {layers.nerve ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  {/* Organ Layer */}
                  <button
                    onClick={() => setLayers(prev => ({ ...prev, organ: !prev.organ }))}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-[10px] font-bold transition-all cursor-pointer ${
                      layers.organ ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-transparent border-white/5 text-white/30'
                    }`}
                  >
                    <span>🫁 Organ (Organ)</span>
                    {layers.organ ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Elements Explorer Search */}
              <div className="relative mb-4 shrink-0">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Qismlarni qidirish..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/5 rounded-xl pl-11 pr-4 py-2.5 font-bold text-white text-xs outline-none focus:border-brand-accent/40"
                />
              </div>

              {/* Parts list matching active view */}
              <div className="flex-grow overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-white/5">
                {filteredParts.length === 0 ? (
                  <div className="text-center py-12 text-white/20 text-xs">
                    Hech qanday element topilmadi.
                  </div>
                ) : (
                  filteredParts.map((part) => {
                    const isSelected = selectedPart?.id === part.id;
                    return (
                      <button
                        key={part.id}
                        onClick={() => {
                          handlePartSelect(part);
                          // Option to close on select
                          setContentsOpen(false);
                        }}
                        className={`w-full p-3 rounded-xl text-left flex items-start gap-3 transition-colors cursor-pointer ${
                          isSelected ? 'bg-brand-accent/10 border border-brand-accent/30 text-white' : 'hover:bg-white/[0.02] text-white/70'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          part.system === 'bone' ? 'bg-amber-500' :
                          part.system === 'muscle' ? 'bg-red-500' :
                          part.system === 'nerve' ? 'bg-sky-400' :
                          'bg-emerald-500'
                        }`} />
                        <div className="min-w-0">
                          <h4 className="text-[11px] font-black uppercase tracking-tight truncate">{getLocalizedName(part)}</h4>
                          <p className="text-[9px] text-white/30 italic truncate mt-0.5">{part.latinName}</p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------------------------
          FOOTER INTERFACE: Professional Anatomy Toolbars (Views, Translucency, Reset)
          ---------------------------------------------------------------------- */}
      {!isInterfaceHidden && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-4xl px-4 pointer-events-none animate-in slide-in-from-bottom-6 duration-200">
          <div className="bg-black/85 backdrop-blur-3xl border border-white/10 rounded-[28px] p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_40px_80px_rgba(0,0,0,0.9)] pointer-events-auto">
            {/* Action Toggles group */}
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {/* Interface Hide */}
              <button
                onClick={() => setIsInterfaceHidden(true)}
                className="px-3.5 py-3.5 bg-white/[0.03] hover:bg-white/[0.1] hover:text-white text-white/60 rounded-2xl flex flex-col items-center gap-1 transition-all cursor-pointer"
                title="Interfeysni yashirish"
              >
                <EyeOff className="w-4 h-4" />
                <span className="text-[7px] font-black uppercase tracking-widest leading-none">HIDE INTERFACE</span>
              </button>

              {/* Views Presets Dropdown/Drawer Button */}
              <div className="relative group/views">
                <button
                  className="px-3.5 py-3.5 bg-white/[0.03] hover:bg-white/[0.1] hover:text-white text-white/60 rounded-2xl flex flex-col items-center gap-1 transition-all cursor-pointer"
                  title="Ko'rish burchaklari"
                >
                  <Compass className="w-4 h-4 text-brand-accent animate-pulse" />
                  <span className="text-[7px] font-black uppercase tracking-widest leading-none">VIEWS</span>
                </button>
                {/* Views List Dropdown */}
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-black border border-white/10 p-2 rounded-xl flex flex-col gap-1.5 opacity-0 pointer-events-none group-hover/views:opacity-100 group-hover/views:pointer-events-auto transition-all shadow-2xl z-50">
                  <button 
                    onClick={() => setViewAnglePreset('front')}
                    className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest ${activeViewMode === 'front' ? 'bg-brand-accent text-black' : 'text-white hover:bg-white/5'}`}
                  >
                    Oldindan (Front)
                  </button>
                  <button 
                    onClick={() => setViewAnglePreset('back')}
                    className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest ${activeViewMode === 'back' ? 'bg-brand-accent text-black' : 'text-white hover:bg-white/5'}`}
                  >
                    Ortidan (Back)
                  </button>
                  <button 
                    onClick={() => setViewAnglePreset('left')}
                    className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest ${activeViewMode === 'left' ? 'bg-brand-accent text-black' : 'text-white hover:bg-white/5'}`}
                  >
                    Chapdan (Left)
                  </button>
                  <button 
                    onClick={() => setViewAnglePreset('right')}
                    className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest ${activeViewMode === 'right' ? 'bg-brand-accent text-black' : 'text-white hover:bg-white/5'}`}
                  >
                    O'ngdan (Right)
                  </button>
                  <button 
                    onClick={() => setViewAnglePreset('top')}
                    className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest ${activeViewMode === 'top' ? 'bg-brand-accent text-black' : 'text-white hover:bg-white/5'}`}
                  >
                    Tepadan (Top)
                  </button>
                </div>
              </div>

              {/* Isolate Toggle */}
              <button
                onClick={toggleIsolate}
                disabled={!selectedPart}
                className={`px-3.5 py-3.5 rounded-2xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  !selectedPart 
                    ? 'opacity-30 cursor-not-allowed text-white/20' 
                    : isIsolateActive 
                      ? 'bg-amber-400 text-black font-black' 
                      : 'bg-white/[0.03] hover:bg-white/[0.1] text-white/60 hover:text-white'
                }`}
                title="A'zoni alohidalash"
              >
                <Maximize2 className="w-4 h-4" />
                <span className="text-[7px] font-black uppercase tracking-widest leading-none">ISOLATE</span>
              </button>

              {/* Multiselect Toggle */}
              <button
                onClick={() => setIsMultiSelectActive(!isMultiSelectActive)}
                className={`px-3.5 py-3.5 rounded-2xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  isMultiSelectActive 
                    ? 'bg-blue-500 text-white shadow-md' 
                    : 'bg-white/[0.03] hover:bg-white/[0.1] text-white/60 hover:text-white'
                }`}
                title="Bir nechta element"
              >
                <Check className="w-4 h-4" />
                <span className="text-[7px] font-black uppercase tracking-widest leading-none">MULTISELECT</span>
              </button>

              {/* Hide Element action */}
              <button
                onClick={hideSelectedPart}
                disabled={!selectedPart}
                className={`px-3.5 py-3.5 rounded-2xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  !selectedPart 
                    ? 'opacity-30 cursor-not-allowed text-white/20' 
                    : 'bg-white/[0.03] hover:bg-white/[0.1] text-white/60 hover:text-white'
                }`}
                title="Faol elementni yashirish"
              >
                <EyeOff className="w-4 h-4" />
                <span className="text-[7px] font-black uppercase tracking-widest leading-none">HIDE PART</span>
              </button>

              {/* Undo action */}
              <button
                onClick={handleUndo}
                disabled={pastActions.length === 0}
                className={`px-3.5 py-3.5 rounded-2xl flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  pastActions.length === 0 
                    ? 'opacity-30 cursor-not-allowed text-white/20' 
                    : 'bg-white/[0.03] hover:bg-white/[0.1] text-white/60 hover:text-white'
                }`}
                title="Ortga qaytarish"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="text-[7px] font-black uppercase tracking-widest leading-none">UNDO</span>
              </button>

              {/* Reset view */}
              <button
                onClick={handleResetScene}
                className="px-3.5 py-3.5 bg-white/[0.03] hover:bg-rose-500 hover:text-white text-white/60 rounded-2xl flex flex-col items-center gap-1 transition-all cursor-pointer animate-pulse"
                title="Butunlay asliga qaytarish"
              >
                <X className="w-4 h-4" />
                <span className="text-[7px] font-black uppercase tracking-widest leading-none">RESET ALL</span>
              </button>
            </div>

            {/* Transparency Section slider */}
            <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 py-2.5 px-4 rounded-2xl w-full md:w-auto shrink-0">
              <Sliders className="w-4 h-4 text-white/40 shrink-0" />
              <div className="flex flex-col min-w-[120px] md:min-w-[140px]">
                <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest leading-none mb-1">Transparency ({transparency}%)</span>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={transparency}
                  onChange={(e) => setTransparency(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded appearance-none cursor-pointer accent-brand-accent focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------
          SIDEBAR EDIT PANEL: Custom Interactive Pins Editor (Pruposefully Crafted)
          ---------------------------------------------------------------------- */}
      {isEditMode && !isSidebarCollapsed && (
        <div id="pins-edit-sidebar" className="w-full md:w-96 shrink-0 border-l border-white/10 bg-[#0D0F14]/95 backdrop-blur-2xl h-full flex flex-col z-[100] animate-in slide-in-from-right duration-300">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-mono text-rose-400 tracking-widest uppercase">3D Anatomy Creator</p>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Nuqtalar Lab (Pins)</h3>
            </div>
            <button
              id="close-pins-editor-btn"
              onClick={() => {
                setIsEditMode(false);
                setSelectedPart(null);
              }}
              className="px-3.5 py-1.5 bg-white/5 hover:bg-rose-600 hover:text-white rounded-xl text-white/60 text-[9px] font-bold uppercase transition-all cursor-pointer"
            >
              Yopish
            </button>
          </div>

          {/* List of custom pins */}
          <div className="flex-grow overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-white/5">
            {/* Active custom pin details editor */}
            {selectedPart && selectedPart.id.startsWith('cpin_') ? (
              <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 space-y-4 animate-in fade-in duration-300">
                <span className="text-[9px] font-black text-rose-500 uppercase tracking-wider block mb-1">Nuqtani Tahrirlash ({selectedPart.id.substring(5, 9)})</span>
                
                {/* Lotincha nomi */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-white/50 uppercase tracking-widest font-bold">Lotincha nomi (Latin Name)</label>
                  <input
                    type="text"
                    value={selectedPart.latinName}
                    onChange={(e) => {
                      const updatedPart = { ...selectedPart, latinName: e.target.value };
                      setSelectedPart(updatedPart);
                      const updatedList = customPins.map(p => p.id === selectedPart.id ? updatedPart : p);
                      setCustomPins(updatedList);
                      saveCustomPinsToStorage(updatedList);
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-bold outline-none focus:border-rose-500/50"
                    placeholder="Masalan: Fossa supraspinata"
                  />
                </div>

                {/* Uzbekcha nomi */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-white/50 uppercase tracking-widest font-bold">O'zbekcha nomi (Uzbek Name)</label>
                  <input
                    type="text"
                    value={selectedPart.uzbekName}
                    onChange={(e) => {
                      const updatedPart = { ...selectedPart, uzbekName: e.target.value, englishName: e.target.value };
                      setSelectedPart(updatedPart);
                      const updatedList = customPins.map(p => p.id === selectedPart.id ? updatedPart : p);
                      setCustomPins(updatedList);
                      saveCustomPinsToStorage(updatedList);
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-bold outline-none focus:border-rose-500/50"
                    placeholder="Masalan: Kurak usti chuqurchasi"
                  />
                </div>

                {/* Klinik / Anatomik tavsif */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-white/50 uppercase tracking-widest block font-bold">Klinik / Anatomik tavsif (Clinical Desc)</label>
                  <textarea
                    rows={4}
                    value={selectedPart.description?.uz || ''}
                    onChange={(e) => {
                      const updatedPart = {
                        ...selectedPart,
                        description: {
                          uz: e.target.value,
                          ru: e.target.value,
                          en: e.target.value
                        }
                      };
                      setSelectedPart(updatedPart);
                      const updatedList = customPins.map(p => p.id === selectedPart.id ? updatedPart : p);
                      setCustomPins(updatedList);
                      saveCustomPinsToStorage(updatedList);
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white font-medium outline-none focus:border-rose-500/50 resize-none leading-relaxed"
                    placeholder="Ushbu anatomik nuqtaning klinik va morfologik ahamiyatini yozing..."
                  />
                </div>

                {/* System Category Selector */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-white/50 uppercase tracking-widest font-bold">Tizim Qatlami (System Layer)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'bone', label: '🦴 Suyak' },
                      { key: 'muscle', label: '🥩 Muskul' },
                      { key: 'nerve', label: '⚡ Nerv' },
                      { key: 'organ', label: '🫁 Organ' }
                    ].map(cat => (
                      <button
                        key={cat.key}
                        type="button"
                        onClick={() => {
                          const updatedPart = { ...selectedPart, system: cat.key as any };
                          setSelectedPart(updatedPart);
                          const updatedList = customPins.map(p => p.id === selectedPart.id ? updatedPart : p);
                          setCustomPins(updatedList);
                          saveCustomPinsToStorage(updatedList);
                        }}
                        className={`py-2 px-3 border rounded-xl text-[10px] font-bold text-center transition-all cursor-pointer ${
                          selectedPart.system === cat.key 
                            ? 'bg-rose-500/20 border-rose-500 text-white shadow-md' 
                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delete and Lock Action buttons */}
                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const updatedList = customPins.filter(p => p.id !== selectedPart.id);
                      setCustomPins(updatedList);
                      saveCustomPinsToStorage(updatedList);
                      setSelectedPart(null);
                    }}
                    className="flex-1 py-3 bg-red-600/90 hover:bg-red-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg transition-all cursor-pointer text-center"
                  >
                    O'chirish (Delete)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPart(null);
                    }}
                    className="flex-1 py-3 bg-emerald-600/90 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg transition-all cursor-pointer text-center"
                  >
                    Qotirish (Lock)
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 px-4 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col items-center justify-center opacity-70">
                <Sliders className="w-8 h-8 text-rose-400 mb-3 animate-pulse" />
                <p className="text-xs font-bold text-white uppercase tracking-wider">Nuqta tanlanmagan</p>
                <p className="text-[10px] text-white/40 mt-1.5 leading-relaxed">
                  Tahrirlash va turg'un qilish uchun model sirtidagi yangi nuqtani bosing, yoki ro'yxatdan tanlang.
                </p>
              </div>
            )}

            {/* List of custom pins on this model/system */}
            <div className="space-y-2 mt-4">
              <span className="text-[9px] font-black text-white/40 tracking-widest uppercase block mb-1">Loyihadagi yangi nuqtalar ({customPins.length}):</span>
              {customPins.length === 0 ? (
                <div className="text-center py-6 text-white/20 text-[10px] font-medium leading-relaxed italic border border-dashed border-white/10 rounded-xl">
                  Yangi nuqtalar yo'q. Joylashtirish uchun model sirtining biron bir joyiga bosing.
                </div>
              ) : (
                <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
                  {customPins.map((p) => {
                    const isSelected = selectedPart?.id === p.id;
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPart(p)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between gap-3 cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-rose-500/10 border-rose-500 text-white shadow-md' 
                            : 'bg-white/[0.01] border-white/5 hover:border-white/10 text-white/70'
                        }`}
                      >
                        <div className="min-w-0 flex-grow">
                          <h4 className="text-[11px] font-black uppercase tracking-tight truncate">{p.latinName || 'Yozilmagan'}</h4>
                          <p className="text-[9px] text-white/40 italic truncate mt-0.5">{p.uzbekName || 'O\'zbekcha nom yo\'q'}</p>
                        </div>
                        <span className={`w-2 h-2 rounded-full shrink-0 ${
                          p.system === 'bone' ? 'bg-amber-500' :
                          p.system === 'muscle' ? 'bg-red-500' :
                          p.system === 'nerve' ? 'bg-sky-400' :
                          'bg-emerald-500'
                        }`} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
