// ---------------------------------------------------------------------------
// 3D ANATOMIYA MODELLARI KATALOGI (Anatomy Models Catalog)
// ---------------------------------------------------------------------------
// Bu fayl saytdagi barcha 3D anatomiya modellarining MARKAZIY ro'yxati.
// Yangi model qo'shish uchun ANATOMY_MODELS massiviga bitta obyekt qo'shing —
// boshqa hech qanday kodni o'zgartirish shart emas. Modellar avtomatik ravishda
// "3D Modellar" sahifasida kategoriya + qidiruv bilan chiqadi.
//
// This is the single source of truth for every 3D model on the site.
// To add a model, append one object to ANATOMY_MODELS below. It automatically
// appears on the "3D Models" page with search + category filtering.
//
// Admin panel orqali ham model qo'shish mumkin (localStorage'ga saqlanadi) —
// keyin "JSON eksport" tugmasi bilan olib, shu faylga doimiy qo'shib qo'ying.
// ---------------------------------------------------------------------------

export type AnatomySystem =
  | 'bone' // Suyaklar (osteologiya)
  | 'muscle' // Muskullar (miologiya)
  | 'organ' // Ichki a'zolar
  | 'nerve' // Nerv tizimi
  | 'vessel' // Qon tomirlar
  | 'other'; // Boshqa / aralash

export type BodyRegion =
  | 'head'
  | 'neck'
  | 'thorax'
  | 'abdomen'
  | 'pelvis'
  | 'back'
  | 'upperLimb'
  | 'lowerLimb'
  | 'wholeBody'
  | 'other';

export interface AnatomyModelPin {
  id: string;
  latinName: string;
  uzbekName: string;
  englishName: string;
  russianName: string;
  system: AnatomySystem;
  /** "x y z" model-viewer koordinatalari */
  position: string;
  normal?: string;
  description: Record<'uz' | 'ru' | 'en', string>;
}

export interface AnatomyModel {
  id: string;
  title: Record<'uz' | 'ru' | 'en', string>;
  description?: Record<'uz' | 'ru' | 'en', string>;
  system: AnatomySystem;
  region?: BodyRegion;
  /** Tashqi interaktiv viewer (Sketchfab va h.k.) — iframe orqali ko'rsatiladi */
  embedUrl?: string;
  /** To'g'ridan-to'g'ri .glb / .gltf fayl havolasi — model-viewer orqali ochiladi */
  fileUrl?: string;
  thumbnail?: string;
  source?: string;
  sourceUrl?: string;
  license?: string;
  author?: string;
  tags?: string[];
  pins?: AnatomyModelPin[];
  /** ALL_39_TOPICS dagi mos mavzu(lar) id'lari, masalan "sem_2_top_9" — mavzu sahifasida
   * ushbu model "Tegishli 3D Modellar" bo'limida avtomatik ko'rsatiladi. */
  topicIds?: string[];
}

// ---------------------------------------------------------------------------
// Kategoriya (tizim) meta-ma'lumotlari: nom, rang, ikonka
// ---------------------------------------------------------------------------

export interface SystemMeta {
  id: AnatomySystem;
  label: Record<'uz' | 'ru' | 'en', string>;
  /** lucide-react ikonka nomi (AnatomyModels sahifasida map qilinadi) */
  icon: string;
  /** Tailwind uchun statik class'lar (dinamik string ishlamaydi) */
  badge: string; // rang badge uchun
  dot: string; // kichik nuqta uchun
  ring: string; // faol chip uchun
}

export const SYSTEM_META: SystemMeta[] = [
  {
    id: 'bone',
    label: { uz: 'Suyaklar', ru: 'Кости', en: 'Bones' },
    icon: 'Bone',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-400',
    ring: 'bg-amber-500 text-white border-amber-500',
  },
  {
    id: 'muscle',
    label: { uz: 'Muskullar', ru: 'Мышцы', en: 'Muscles' },
    icon: 'Activity',
    badge: 'bg-red-50 text-red-700 border-red-200',
    dot: 'bg-red-400',
    ring: 'bg-red-500 text-white border-red-500',
  },
  {
    id: 'organ',
    label: { uz: "A'zolar", ru: 'Органы', en: 'Organs' },
    icon: 'Heart',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-400',
    ring: 'bg-rose-500 text-white border-rose-500',
  },
  {
    id: 'nerve',
    label: { uz: 'Nervlar', ru: 'Нервы', en: 'Nerves' },
    icon: 'Zap',
    badge: 'bg-violet-50 text-violet-700 border-violet-200',
    dot: 'bg-violet-400',
    ring: 'bg-violet-500 text-white border-violet-500',
  },
  {
    id: 'vessel',
    label: { uz: 'Qon tomirlar', ru: 'Сосуды', en: 'Vessels' },
    icon: 'GitBranch',
    badge: 'bg-sky-50 text-sky-700 border-sky-200',
    dot: 'bg-sky-400',
    ring: 'bg-sky-500 text-white border-sky-500',
  },
  {
    id: 'other',
    label: { uz: 'Boshqa', ru: 'Другое', en: 'Other' },
    icon: 'Box',
    badge: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
    ring: 'bg-slate-700 text-white border-slate-700',
  },
];

export const REGION_META: { id: BodyRegion; label: Record<'uz' | 'ru' | 'en', string> }[] = [
  { id: 'head', label: { uz: 'Bosh', ru: 'Голова', en: 'Head' } },
  { id: 'neck', label: { uz: "Bo'yin", ru: 'Шея', en: 'Neck' } },
  { id: 'thorax', label: { uz: "Ko'krak qafasi", ru: 'Грудная клетка', en: 'Thorax' } },
  { id: 'abdomen', label: { uz: 'Qorin', ru: 'Живот', en: 'Abdomen' } },
  { id: 'pelvis', label: { uz: 'Tos', ru: 'Таз', en: 'Pelvis' } },
  { id: 'back', label: { uz: 'Orqa / Umurtqa', ru: 'Спина / Позвоночник', en: 'Back / Spine' } },
  { id: 'upperLimb', label: { uz: "Yuqori oyoq-qo'l", ru: 'Верхняя конечность', en: 'Upper limb' } },
  { id: 'lowerLimb', label: { uz: "Quyi oyoq-qo'l", ru: 'Нижняя конечность', en: 'Lower limb' } },
  { id: 'wholeBody', label: { uz: "Butun tana", ru: 'Всё тело', en: 'Whole body' } },
  { id: 'other', label: { uz: 'Boshqa', ru: 'Другое', en: 'Other' } },
];

export const getSystemMeta = (id: AnatomySystem): SystemMeta =>
  SYSTEM_META.find((s) => s.id === id) || SYSTEM_META[SYSTEM_META.length - 1];

const sk = (uid: string) => `https://sketchfab.com/models/${uid}/embed`;

// ---------------------------------------------------------------------------
// MODELLAR RO'YXATI (bulk import shu yerga)
// ---------------------------------------------------------------------------
// Har bir model uchun:
//   - embedUrl  → Sketchfab kabi tashqi viewer (iframe). Format:
//                 https://sketchfab.com/models/<MODEL_UID>/embed
//   - fileUrl   → to'g'ridan-to'g'ri .glb/.gltf havola (model-viewer orqali ochiladi)
//   Ikkalasidan birini kiritish yetarli. Agar ikkalasi ham bo'lsa fileUrl (GLB) ustun.
// ---------------------------------------------------------------------------

export const ANATOMY_MODELS: AnatomyModel[] = [
  {
    id: 'demo-head-scan',
    title: {
      uz: 'Bosh / Yuz skani (Demo GLB)',
      ru: 'Голова / Скан лица (Демо GLB)',
      en: 'Head / Face Scan (Demo GLB)',
    },
    description: {
      uz: "To'g'ridan-to'g'ri GLB fayl orqali yuklanadigan namuna model. GLB fayllar model-viewer'da to'liq interaktiv (aylantirish, kattalashtirish, belgilar) ochiladi.",
      ru: 'Пример модели, загружаемой напрямую из GLB-файла. GLB открывается в полностью интерактивном model-viewer.',
      en: 'A sample model loaded directly from a GLB file. GLB files open in the fully interactive model-viewer (rotate, zoom, pins).',
    },
    system: 'other',
    region: 'head',
    fileUrl: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb',
    source: 'three.js examples',
    sourceUrl: 'https://github.com/mrdoob/three.js',
    license: 'MIT (demo)',
    author: 'three.js',
    tags: ['demo', 'glb', 'head', 'bosh'],
    topicIds: ['sem_1_top_6'],
  },
];

// ---------------------------------------------------------------------------
// Boshlang'ich (seed) modellar — Sketchfab'dagi ochiq/CC namunalar.
// Bular iframe (embed) orqali ko'rsatiladi va real brauzerda ishlaydi.
// Litsenziyani aniq tekshirish uchun har birida sourceUrl havolasi bor.
export const SEED_MODELS: AnatomyModel[] = [
  // ---------------------- A'ZOLAR (ORGAN) ----------------------
  {
    id: 'heart-freddan',
    title: { uz: 'Inson yuragi', ru: 'Сердце человека', en: 'Human Heart' },
    description: {
      uz: 'Yurakning tashqi tuzilishi: bo\'lmachalar, qorinchalar va yirik qon tomirlar.',
      ru: 'Внешнее строение сердца: предсердия, желудочки и крупные сосуды.',
      en: 'External structure of the heart: atria, ventricles and great vessels.',
    },
    system: 'organ', region: 'thorax',
    embedUrl: sk('3342c8c438904ee2b3b6b68fedf30531'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Heart_normal.svg/400px-Heart_normal.svg.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/human-heart-3342c8c438904ee2b3b6b68fedf30531',
    license: 'CC-BY', author: 'Freddan755',
    tags: ['yurak', 'heart', 'cor', 'сердце'],
    topicIds: ['sem_2_top_9'],
  },
  {
    id: 'lungs-neshallads',
    title: { uz: "O'pkalar", ru: 'Лёгкие', en: 'Human Lungs' },
    description: {
      uz: 'Realistik teksturali inson o\'pkalari modeli — nafas olish tizimi.',
      ru: 'Реалистичная модель лёгких человека — дыхательная система.',
      en: 'Realistic textured human lungs — respiratory system.',
    },
    system: 'organ', region: 'thorax',
    embedUrl: sk('ce09f4099a68467880f46e61eb9a3531'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Lungs_diagram_simple.svg/400px-Lungs_diagram_simple.svg.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/realistic-human-lungs-ce09f4099a68467880f46e61eb9a3531',
    license: 'CC-BY', author: 'neshallads',
    tags: ["o'pka", 'lungs', 'pulmo', 'лёгкие'],
    topicIds: ['sem_2_top_4'],
  },
  {
    id: 'internal-organs-unlim3d',
    title: { uz: 'Ichki a\'zolar', ru: 'Внутренние органы', en: 'Human Internal Organs' },
    description: {
      uz: 'Yurak, o\'pka, jigar, oshqozon, buyraklar va ichaklarni o\'z ichiga olgan majmua.',
      ru: 'Комплекс: сердце, лёгкие, печень, желудок, почки и кишечник.',
      en: 'A set including heart, lungs, liver, stomach, kidneys and intestines.',
    },
    system: 'organ', region: 'abdomen',
    embedUrl: sk('fe69d7b1ed6f46a3bd0b6933b796092e'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Human_body_silhouette_with_organs.svg/400px-Human_body_silhouette_with_organs.svg.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/human-internal-organs-fe69d7b1ed6f46a3bd0b6933b796092e',
    license: 'CC (Sketchfab)', author: 'unlim3d',
    tags: ['a\'zolar', 'organs', 'viscera', 'органы'],
    topicIds: ['sem_2_top_2', 'sem_2_top_4', 'sem_2_top_6', 'sem_2_top_9'],
  },
  {
    id: 'brain-labeled',
    title: { uz: 'Bosh miya (belgilangan)', ru: 'Головной мозг (с метками)', en: 'Brain — labeled parts' },
    description: {
      uz: 'Katta yarim sharlar, miyacha, miya poyasi va bo\'laklar belgilangan model.',
      ru: 'Модель с метками: полушария, мозжечок, ствол мозга и доли.',
      en: 'Labeled model: cerebrum, cerebellum, brainstem and lobes.',
    },
    system: 'organ', region: 'head',
    embedUrl: sk('28c8971e11334e8b97a2a0d6235992e8'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Brain_surface_gyri.svg/400px-Brain_surface_gyri.svg.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/brain-with-labeled-parts-28c8971e11334e8b97a2a0d6235992e8',
    license: 'CC (Sketchfab)', author: 'AbdulMuhaymin',
    tags: ['miya', 'brain', 'cerebrum', 'мозг'],
    topicIds: ['sem_3_top_1', 'sem_3_top_3'],
  },

  // ---------------------- NERVLAR (NERVE) ----------------------
  {
    id: 'nervous-system-dundee',
    title: { uz: 'Nerv tizimi', ru: 'Нервная система', en: 'The Nervous System' },
    description: {
      uz: 'Markaziy va periferik nerv tizimi: bosh miya, orqa miya va nervlar.',
      ru: 'ЦНС и ПНС: головной мозг, спинной мозг и нервы.',
      en: 'Central & peripheral nervous system: brain, spinal cord and nerves.',
    },
    system: 'nerve', region: 'wholeBody',
    embedUrl: sk('2e6be1399756494b9f185ce8c5900911'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Nervous_system_diagram.png/400px-Nervous_system_diagram.png',
    source: 'Sketchfab (Univ. of Dundee)', sourceUrl: 'https://sketchfab.com/3d-models/the-nervous-system-2e6be1399756494b9f185ce8c5900911',
    license: 'CC (Sketchfab)', author: 'University of Dundee, CAHID',
    tags: ['nerv', 'nervous', 'systema nervosum', 'нервы'],
    topicIds: ['sem_3_top_1'],
  },
  {
    id: 'brain-cerebrum-brainstem',
    title: { uz: 'Bosh miya — yarim sharlar va poya', ru: 'Мозг — полушария и ствол', en: 'Brain — Cerebrum & Brainstem' },
    description: {
      uz: 'Katta miya yarim sharlari va miya poyasi ajratilgan tibbiy anatomik model.',
      ru: 'Медицинская модель: полушария большого мозга и ствол мозга.',
      en: 'Medical model of the cerebral hemispheres and brainstem.',
    },
    system: 'nerve', region: 'head',
    embedUrl: sk('0aa0e33c5c854d1bab7bac9e1c7acaec'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Human_brain_NIH.jpg/400px-Human_brain_NIH.jpg',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/human-brain-cerebrum-brainstem-0aa0e33c5c854d1bab7bac9e1c7acaec',
    license: 'CC (Sketchfab)', author: 'FrankJohansson',
    tags: ['miya', 'brainstem', 'cerebrum', 'мозг'],
    topicIds: ['sem_3_top_1', 'sem_3_top_3'],
  },

  // ---------------------- MUSKULLAR (MUSCLE) ----------------------
  {
    id: 'muscular-system-simplified',
    title: { uz: 'Muskul tizimi (soddalashtirilgan)', ru: 'Мышечная система (упрощённая)', en: 'Male Muscular System (simplified)' },
    description: {
      uz: 'Tananing asosiy tashqi muskullari anatomik joylashuvi bilan.',
      ru: 'Основные наружные мышцы тела в анатомическом расположении.',
      en: 'The major superficial muscles of the body in anatomical layout.',
    },
    system: 'muscle', region: 'wholeBody',
    embedUrl: sk('4f258907dfb6477aa9bf4dfb5833a797'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Superficial_muscular_system_front_anterior_labeled.png/400px-Superficial_muscular_system_front_anterior_labeled.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/simplified-male-muscular-system-4f258907dfb6477aa9bf4dfb5833a797',
    license: 'CC (Sketchfab)', author: 'Alexander (@qwertzus)',
    tags: ['muskul', 'muscles', 'musculi', 'мышцы'],
    topicIds: ['sem_1_top_10', 'sem_1_top_12'],
  },
  {
    id: 'ecorche-anatomy-study',
    title: { uz: 'Ekorshe — muskul anatomiyasi', ru: 'Экорше — анатомия мышц', en: 'Écorché — Anatomy study' },
    description: {
      uz: 'Terisi olib tashlangan tana — muskullar shakli va yo\'nalishini o\'rganish uchun.',
      ru: 'Тело без кожи — для изучения формы и направления мышц.',
      en: 'A skinless body for studying muscle shapes and directions.',
    },
    system: 'muscle', region: 'wholeBody',
    embedUrl: sk('e402d3d541eb4b199c57d5410f5d3c57'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Body_muscles_back.svg/400px-Body_muscles_back.svg.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/ecorche-anatomy-study-e402d3d541eb4b199c57d5410f5d3c57',
    license: 'CC (Sketchfab)', author: 'Beatriz Gomez Santamaria',
    tags: ['ekorshe', 'ecorche', 'muscles', 'мышцы'],
    topicIds: ['sem_1_top_12', 'sem_1_top_13'],
  },
  {
    id: 'facial-muscles-ecorche',
    title: { uz: 'Yuz muskullari (ekorshe)', ru: 'Мышцы лица (экорше)', en: 'Facial Muscles Écorché' },
    description: {
      uz: 'Yuz mimika muskullari va kalla suyagi — batafsil ekorshe modeli.',
      ru: 'Мимические мышцы лица и череп — подробная модель экорше.',
      en: 'Facial expression muscles and skull — detailed écorché model.',
    },
    system: 'muscle', region: 'head',
    embedUrl: sk('23c2d4af8088418d8b3ea9057ec88ff4'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Facial_muscles.svg/400px-Facial_muscles.svg.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/male-facial-muscles-ecorche-23c2d4af8088418d8b3ea9057ec88ff4',
    license: 'CC (Sketchfab)', author: 'hangar79',
    tags: ['yuz', 'facial', 'muscles', 'лицо'],
    topicIds: ['sem_1_top_11'],
  },

  // ---------------------- SUYAKLAR (BONE) ----------------------
  {
    id: 'skull-anatomy-kumar',
    title: { uz: 'Kalla suyagi anatomiyasi', ru: 'Анатомия черепа', en: 'Human Skull Anatomy' },
    description: {
      uz: 'Kalla suyagining 22 ta suyagi va choklari ko\'rsatilgan model.',
      ru: 'Модель черепа с 22 костями и швами.',
      en: 'Skull model showing its 22 bones and sutures.',
    },
    system: 'bone', region: 'head',
    embedUrl: sk('daaaa5668efa43f280e23196adb792ca'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Human_skull_front_bones.svg/400px-Human_skull_front_bones.svg.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/human-skull-anatomy-daaaa5668efa43f280e23196adb792ca',
    license: 'CC-BY', author: 'Kumar Thyadi',
    tags: ['kalla', 'skull', 'cranium', 'череп'],
    topicIds: ['sem_1_top_5'],
  },
  {
    id: 'skull-anatomy-hannah',
    title: { uz: 'Kalla suyagi tuzilishi', ru: 'Строение черепа', en: 'Anatomy of the Human Skull' },
    description: {
      uz: 'Yuz va miya qutisi suyaklari ajratilgan o\'quv modeli.',
      ru: 'Учебная модель с костями лицевого и мозгового черепа.',
      en: 'Educational model with facial and cranial bones separated.',
    },
    system: 'bone', region: 'head',
    embedUrl: sk('baf6ac7b781a46218dca2b59dee58817'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Human_skull_front_simplified_bones.svg/400px-Human_skull_front_simplified_bones.svg.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/the-anatomy-of-the-human-skull-baf6ac7b781a46218dca2b59dee58817',
    license: 'CC (Sketchfab)', author: 'HannahNewey',
    tags: ['kalla', 'skull', 'cranium', 'череп'],
    topicIds: ['sem_1_top_5', 'sem_1_top_6'],
  },
  {
    id: 'skeleton-terrie',
    title: { uz: 'Inson skeleti', ru: 'Скелет человека', en: 'Human Skeleton' },
    description: {
      uz: 'KT (kompyuter tomografiya) asosida olingan to\'liq skelet modeli.',
      ru: 'Полный skelet, полученный на основе КТ-сканирования.',
      en: 'Full skeleton derived from a CT scan of a real body.',
    },
    system: 'bone', region: 'wholeBody',
    embedUrl: sk('911b9df7e7834175b69b4840ea15e054'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Human_skeleton_front_en.svg/400px-Human_skeleton_front_en.svg.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/human-skeleton-911b9df7e7834175b69b4840ea15e054',
    license: 'CC-BY', author: 'Terrie Simmons-Ehrhardt',
    tags: ['skelet', 'skeleton', 'sceleton', 'скелет'],
    topicIds: ['sem_1_top_1'],
  },
  {
    id: 'hand-wrist-bones',
    title: { uz: 'Kaft va bilaguzuk suyaklari', ru: 'Кости кисти и запястья', en: 'Hand & Wrist Bones (labeled)' },
    description: {
      uz: 'Kaft, kaft usti va bilaguzuk suyaklari nomlari bilan belgilangan.',
      ru: 'Кости кисти, пясти и запястья с подписями.',
      en: 'Carpal, metacarpal and phalangeal bones with labels.',
    },
    system: 'bone', region: 'upperLimb',
    embedUrl: sk('1704c8bec5db422fbe17c1e9650c293a'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Scheme_human_hand_bones-en.svg/400px-Scheme_human_hand_bones-en.svg.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/anatomy-of-hand-and-wrist-bones-labels-1704c8bec5db422fbe17c1e9650c293a',
    license: 'CC (Sketchfab)', author: 'Soma3D',
    tags: ['kaft', 'hand', 'wrist', 'кисть'],
    topicIds: ['sem_1_top_3'],
  },

  // ---------------------- QON TOMIRLAR (VESSEL) ----------------------
  {
    id: 'heart-external-vessels',
    title: { uz: 'Yurak — tashqi ko\'rinish (tomirlar)', ru: 'Сердце — внешний вид (сосуды)', en: 'Cardiac Anatomy — External view' },
    description: {
      uz: 'Yurakning tashqi yuzasi, koronar tomirlar va yirik arteriya-venalar.',
      ru: 'Наружная поверхность сердца, коронарные сосуды и крупные артерии/вены.',
      en: 'External surface of the heart with coronary vessels and great arteries/veins.',
    },
    system: 'vessel', region: 'thorax',
    embedUrl: sk('a3f0ea2030214a6bbaa97e7357eebd58'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Diagram_of_the_human_heart_%232.png/400px-Diagram_of_the_human_heart_%232.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/a3f0ea2030214a6bbaa97e7357eebd58',
    license: 'CC (Sketchfab)', author: 'HannahNewey',
    tags: ['tomir', 'vessels', 'coronaria', 'сосуды'],
    topicIds: ['sem_2_top_9'],
  },
  {
    id: 'heart-anatomically-correct',
    title: { uz: 'Anatomik aniq yurak', ru: 'Анатомически точное сердце', en: 'Anatomically Correct Heart' },
    description: {
      uz: 'Bo\'lmacha va qorinchalar, aorta, o\'pka poyasi va yirik venalar aniq ko\'rsatilgan.',
      ru: 'Чётко показаны предсердия, желудочки, аорта, лёгочный ствол и крупные вены.',
      en: 'Clearly defined atria, ventricles, aorta, pulmonary trunk and great veins.',
    },
    system: 'vessel', region: 'thorax',
    embedUrl: sk('54fa880728d14c11afff78be8721620a'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Heart_normal.svg/400px-Heart_normal.svg.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/anatomically-correct-human-heart-54fa880728d14c11afff78be8721620a',
    license: 'CC (Sketchfab)', author: 'Pigcraft (@s8819296)',
    tags: ['yurak', 'aorta', 'vessels', 'сердце'],
    topicIds: ['sem_2_top_9'],
  },

  // ================= KENGAYTIRILGAN TO'PLAM =================

  // ---------------------- SUYAKLAR (BONE) ----------------------
  {
    id: 'vertebral-column',
    title: { uz: "Umurtqa pog'onasi", ru: 'Позвоночный столб', en: 'Vertebral Column' },
    description: { uz: "Bo'yin, ko'krak, bel umurtqalari, dumg'aza va dum suyagi.", ru: 'Шейный, грудной, поясничный отделы, крестец и копчик.', en: 'Cervical, thoracic, lumbar vertebrae, sacrum and coccyx.' },
    system: 'bone', region: 'back',
    embedUrl: sk('9ef040d718cd4c269844cc5cabf6ceaa'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Vertebral_column_lateral_labeled.svg/400px-Vertebral_column_lateral_labeled.svg.png',
    source: 'Sketchfab (Oregon State Univ.)', sourceUrl: 'https://sketchfab.com/3d-models/vertebral-column-9ef040d718cd4c269844cc5cabf6ceaa',
    license: 'CC (Sketchfab)', author: 'Oregon State University | Ecampus',
    tags: ['umurtqa', 'spine', 'columna vertebralis', 'позвоночник'],
    topicIds: ['sem_1_top_1'],
  },
  {
    id: 'atlas-c1-vertebra',
    title: { uz: "Atlant (C1 umurtqa)", ru: 'Атлант (C1 позвонок)', en: 'Atlas (C1 Vertebra)' },
    description: { uz: "Kalla suyagi tayanadigan birinchi bo'yin umurtqasi.", ru: 'Первый шейный позвонок, на котором держится череп.', en: 'The first cervical vertebra upon which the skull rests.' },
    system: 'bone', region: 'neck',
    embedUrl: sk('03657338956d41158be94cf19b150402'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/C1_lateral.png/400px-C1_lateral.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/human-atlas-c1-vertebra-03657338956d41158be94cf19b150402',
    license: 'CC-BY', author: 'Eric Bauer (@ebauer4)',
    tags: ['atlant', 'atlas', 'C1', 'умуurt'],
    topicIds: ['sem_1_top_1'],
  },
  {
    id: 'thorax-ribcage',
    title: { uz: "Ko'krak qafasi", ru: 'Грудная клетка', en: 'Thorax / Rib Cage' },
    description: { uz: "Qovurg'alar, to'sh suyagi, umurtqalar va qovurg'a tog'aylari.", ru: 'Рёбра, грудина, позвонки и рёберные хрящи.', en: 'Ribs, sternum, vertebrae and costal cartilages.' },
    system: 'bone', region: 'thorax',
    embedUrl: sk('4aba9b2ced344bdf8f09656c6a298b50'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Ribcage.svg/400px-Ribcage.svg.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/human-thorax-4aba9b2ced344bdf8f09656c6a298b50',
    license: 'CC (Sketchfab)', author: 'Medulla (@thunderpig)',
    tags: ["qovurg'a", 'ribs', 'thorax', 'грудь'],
    topicIds: ['sem_1_top_2'],
  },
  {
    id: 'pelvic-bone',
    title: { uz: 'Tos suyagi', ru: 'Тазовая кость', en: 'Pelvic Bone' },
    description: { uz: "Chanoq (tos) suyagi — yonbosh, quymich va qov suyaklari.", ru: 'Тазовая кость — подвздошная, седалищная и лобковая.', en: 'Hip bone — ilium, ischium and pubis.' },
    system: 'bone', region: 'pelvis',
    embedUrl: sk('71a2dfe1a80444f89d90212a921ed0a2'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Pelvis_diagram.svg/400px-Pelvis_diagram.svg.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/human-pelvic-bone-71a2dfe1a80444f89d90212a921ed0a2',
    license: 'CC-BY', author: 'Eric Bauer (@ebauer4)',
    tags: ['tos', 'pelvis', 'os coxae', 'таз'],
    topicIds: ['sem_1_top_4'],
  },
  {
    id: 'sacrum',
    title: { uz: "Dumg'aza suyagi", ru: 'Крестец', en: 'Sacrum' },
    description: { uz: "Beshta birlashgan umurtqadan iborat dumg'aza va dum suyagi.", ru: 'Крестец из пяти сросшихся позвонков и копчик.', en: 'Sacrum of five fused vertebrae and the coccyx.' },
    system: 'bone', region: 'pelvis',
    embedUrl: sk('49aafdac520046ab97afc33a26d47d0c'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Sacrum_-_anterior_view02.png/400px-Sacrum_-_anterior_view02.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/human-sacrum-49aafdac520046ab97afc33a26d47d0c',
    license: 'CC-BY', author: 'Eric Bauer (@ebauer4)',
    tags: ["dumg'aza", 'sacrum', 'крестец'],
    topicIds: ['sem_1_top_1', 'sem_1_top_4'],
  },
  {
    id: 'femur-only',
    title: { uz: 'Son suyagi', ru: 'Бедренная кость', en: 'Femur' },
    description: { uz: "Tananing eng uzun va kuchli suyagi — son suyagi.", ru: 'Самая длинная и прочная кость тела — бедренная.', en: 'The longest and strongest bone of the body — the femur.' },
    system: 'bone', region: 'lowerLimb',
    embedUrl: sk('a9c1f1a88b104c3fbfe975fa10b31b31'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Human_femur_front_back_en.svg/400px-Human_femur_front_back_en.svg.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/human-femur-a9c1f1a88b104c3fbfe975fa10b31b31',
    license: 'CC-BY', author: 'Eric Bauer (@ebauer4)',
    tags: ['son', 'femur', 'бедро'],
    topicIds: ['sem_1_top_4'],
  },
  {
    id: 'leg-bones-set',
    title: { uz: "Oyoq suyaklari (son, boldir, panja)", ru: 'Кости ноги (бедро, голень, стопа)', en: 'Femur, Patella, Tibia, Fibula & Foot' },
    description: { uz: "Son, tizza qopqog'i, katta va kichik boldir hamda oyoq panjasi suyaklari.", ru: 'Бедро, надколенник, большая и малая берцовые кости и стопа.', en: 'Femur, patella, tibia, fibula and the bones of the foot.' },
    system: 'bone', region: 'lowerLimb',
    embedUrl: sk('e0401c95f53c46df97b1db1cf21f3a56'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Tibia_and_fibula.svg/400px-Tibia_and_fibula.svg.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/femur-patella-tibia-fibula-and-foot-e0401c95f53c46df97b1db1cf21f3a56',
    license: 'CC (Sketchfab)', author: 'Kayla Carter (@kaylacarter)',
    tags: ['boldir', 'tibia', 'fibula', 'нога'],
    topicIds: ['sem_1_top_4'],
  },
  {
    id: 'foot-bones',
    title: { uz: 'Oyoq panjasi suyaklari', ru: 'Кости стопы', en: 'Foot Bones' },
    description: { uz: "Oshiq, tovon va panja suyaklari (tarsal, metatarsal, falangalar).", ru: 'Кости предплюсны, плюсны и фаланги стопы.', en: 'Tarsal, metatarsal and phalangeal bones of the foot.' },
    system: 'bone', region: 'lowerLimb',
    embedUrl: sk('d69e5651252e44d0bb5d7742670d1d48'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Foot_bones_-_lateral_view01.png/400px-Foot_bones_-_lateral_view01.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/foot-bones-anatomical-to-table-d69e5651252e44d0bb5d7742670d1d48',
    license: 'CC-BY', author: 'Terrie Simmons-Ehrhardt',
    tags: ['panja', 'foot', 'tarsus', 'стопа'],
    topicIds: ['sem_1_top_4'],
  },
  {
    id: 'humerus-only',
    title: { uz: 'Yelka suyagi', ru: 'Плечевая кость', en: 'Humerus' },
    description: { uz: "Yelkaning uzun naysimon suyagi.", ru: 'Длинная трубчатая кость плеча.', en: 'The long tubular bone of the upper arm.' },
    system: 'bone', region: 'upperLimb',
    embedUrl: sk('548132dc5a0a423581e2cba2014ea521'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Humerus_front_back_en.svg/400px-Humerus_front_back_en.svg.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/human-humerus-548132dc5a0a423581e2cba2014ea521',
    license: 'CC-BY', author: 'Eric Bauer (@ebauer4)',
    tags: ['yelka', 'humerus', 'плечо'],
    topicIds: ['sem_1_top_3'],
  },
  {
    id: 'humerus-radius-ulna',
    title: { uz: "Qo'l suyaklari (yelka, bilak, tirsak)", ru: 'Кости руки (плечевая, лучевая, локтевая)', en: 'Humerus, Radius & Ulna' },
    description: { uz: "Yelka, bilak va tirsak suyaklari — qo'l skeletoni.", ru: 'Плечевая, лучевая и локтевая кости — скелет руки.', en: 'Humerus, radius and ulna — the bones of the arm.' },
    system: 'bone', region: 'upperLimb',
    embedUrl: sk('f39e683a0af342b9801adedebf2b2a9a'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Radius_and_ulna_front_en.svg/400px-Radius_and_ulna_front_en.svg.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/humerus-radius-ulna-f39e683a0af342b9801adedebf2b2a9a',
    license: 'CC (Sketchfab)', author: 'hreagers',
    tags: ['bilak', 'radius', 'ulna', 'рука'],
    topicIds: ['sem_1_top_3'],
  },
  {
    id: 'scapula',
    title: { uz: 'Kurak suyagi', ru: 'Лопатка', en: 'Scapula' },
    description: { uz: "Yelka kamarining uchburchak yassi suyagi — kurak.", ru: 'Треугольная плоская кость плечевого пояса — лопатка.', en: 'The triangular flat bone of the shoulder girdle.' },
    system: 'bone', region: 'upperLimb',
    embedUrl: sk('0745bbb368b4401db89e73babe440ee8'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Scapula_anterior_view.png/400px-Scapula_anterior_view.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/human-scapula-0745bbb368b4401db89e73babe440ee8',
    license: 'CC-BY', author: 'Eric Bauer (@ebauer4)',
    tags: ['kurak', 'scapula', 'лопатка'],
    topicIds: ['sem_1_top_2'],
  },
  {
    id: 'clavicle',
    title: { uz: "O'mrov suyagi", ru: 'Ключица', en: 'Clavicle' },
    description: { uz: "Kurak va to'sh suyagini bog'lovchi o'mrov suyagi.", ru: 'Ключица, соединяющая лопатку and грудину.', en: 'The collarbone connecting the scapula and sternum.' },
    system: 'bone', region: 'upperLimb',
    embedUrl: sk('fd3ae947be90403d9a79d8e9669af236'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Clavicle_anterior_view.png/400px-Clavicle_anterior_view.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/human-clavicle-fd3ae947be90403d9a79d8e9669af236',
    license: 'CC-BY', author: 'Eric Bauer (@ebauer4)',
    tags: ["o'mrov", 'clavicle', 'ключица'],
    topicIds: ['sem_1_top_2'],
  },

  // ---------------------- MUSKULLAR (MUSCLE) ----------------------
  {
    id: 'leg-muscles',
    title: { uz: 'Oyoq muskullari', ru: 'Мышцы ноги', en: 'Leg Muscles' },
    description: { uz: "Son va boldir muskullari anatomik joylashuvi bilan.", ru: 'Мышцы бедра и голени в анатомическом расположении.', en: 'Muscles of the thigh and lower leg in anatomical layout.' },
    system: 'muscle', region: 'lowerLimb',
    embedUrl: sk('d57c2b75ebc74e0bacc2624ec00ec226'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Anterior_leg_muscles.png/400px-Anterior_leg_muscles.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/leg-anatomy-d57c2b75ebc74e0bacc2624ec00ec226',
    license: 'CC-BY', author: 'alfance',
    tags: ['oyoq muskul', 'leg muscles', 'мышцы ноги'],
    topicIds: ['sem_1_top_13'],
  },
  {
    id: 'arm-muscles-sgu',
    title: { uz: "Yelka va bilak muskullari", ru: 'Мышцы плеча и предплечья', en: 'Muscles of Shoulder, Arm & Forearm' },
    description: { uz: "Yelka, elka va bilak sohasi muskullari.", ru: 'Мышцы плечевого пояса, плеча и предплечья.', en: 'Muscles of the shoulder, arm and forearm.' },
    system: 'muscle', region: 'upperLimb',
    embedUrl: sk('6dd851d018f34892800b83ca418ccb52'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Anterior_arm_muscles_deep.png/400px-Anterior_arm_muscles_deep.png',
    source: 'Sketchfab (SGU)', sourceUrl: 'https://sketchfab.com/3d-models/muscles-of-the-shoulder-arm-forearm-6dd851d018f34892800b83ca418ccb52',
    license: 'CC (Sketchfab)', author: 'Center for BioMedical Visualization, SGU',
    tags: ["qo'l muskul", 'arm muscles', 'мышцы руки'],
    topicIds: ['sem_1_top_12'],
  },
  {
    id: 'simple-arm-anatomy',
    title: { uz: "Qo'l anatomiyasi (sodda)", ru: 'Анатомия руки (простая)', en: 'Simple Arm Anatomy' },
    description: { uz: "Qo'lning suyak va muskullari — soddalashtirilgan o'quv modeli.", ru: 'Кости и мышцы руки — упрощённая учебная модель.', en: 'Bones and muscles of the arm — a simplified study model.' },
    system: 'muscle', region: 'upperLimb',
    embedUrl: sk('874c8868bdb942f1a0dab2f023e16ee3'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Arm_bones_and_muscles.svg/400px-Arm_bones_and_muscles.svg.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/simple-arm-anatomy-874c8868bdb942f1a0dab2f023e16ee3',
    license: 'CC (Sketchfab)', author: 'Krogor',
    tags: ["qo'l", 'arm', 'рука'],
    topicIds: ['sem_1_top_12'],
  },

  // ---------------------- A'ZOLAR (ORGAN) ----------------------
  {
    id: 'digestive-system',
    title: { uz: 'Ovqat hazm qilish tizimi', ru: 'Пищеварительная система', en: 'Digestive System' },
    description: { uz: "Qizilo'ngach, oshqozon, ichaklar, jigar va oshqozon osti bezi.", ru: 'Пищевод, желудок, кишечник, печень и поджелудочная железа.', en: 'Esophagus, stomach, intestines, liver and pancreas.' },
    system: 'organ', region: 'abdomen',
    embedUrl: sk('6e072566838d4797a10b849cce737f3a'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Digestive_system_diagram_edit.svg/400px-Digestive_system_diagram_edit.svg.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/digestive-system-2-6e072566838d4797a10b849cce737f3a',
    license: 'CC-BY', author: 'Naveera Zafar',
    tags: ['hazm', 'digestive', 'oshqozon', 'пищеварение'],
    topicIds: ['sem_2_top_2'],
  },
  {
    id: 'liver-spleen-pancreas',
    title: { uz: "Jigar, taloq va oshqozon osti bezi", ru: 'Печень, селезёнка и поджелудочная', en: 'Liver, Spleen & Pancreas' },
    description: { uz: "Qorin bo'shlig'ining yirik bezlari va a'zolari.", ru: 'Крупные железы и органы брюшной полости.', en: 'Major glands and organs of the abdominal cavity.' },
    system: 'organ', region: 'abdomen',
    embedUrl: sk('f9a34dba04624c28a3131970fcac4b81'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Liver_and_gallbladder_with_biliary_tract_en.svg/400px-Liver_and_gallbladder_with_biliary_tract_en.svg.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/adult-liver-spleen-and-pancreas-f9a34dba04624c28a3131970fcac4b81',
    license: 'CC (Sketchfab)', author: 'Education Resource Fund',
    tags: ['jigar', 'liver', 'taloq', 'печень'],
    topicIds: ['sem_2_top_2'],
  },
  {
    id: 'urinary-system',
    title: { uz: 'Siydik ajratish tizimi', ru: 'Мочевыделительная система', en: 'Urinary System' },
    description: { uz: "Buyraklar, siydik yo'llari, siydik pufagi va siydik chiqarish nayi.", ru: 'Почки, мочеточники, мочевой пузырь и уретра.', en: 'Kidneys, ureters, urinary bladder and urethra.' },
    system: 'organ', region: 'pelvis',
    embedUrl: sk('4258252eb7c04e748ab7501eb5f1abb1'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Urinary_system_diagram.svg/400px-Urinary_system_diagram.svg.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/urinary-system-final-4258252eb7c04e748ab7501eb5f1abb1',
    license: 'CC (Sketchfab)', author: 'Hannah Koffman',
    tags: ['buyrak', 'kidney', 'urinary', 'почка'],
    topicIds: ['sem_2_top_6'],
  },
  {
    id: 'eye-cross-section',
    title: { uz: "Ko'z (kesma) anatomiyasi", ru: 'Глаз (в разрезе)', en: 'Eye — Cross Section' },
    description: { uz: "Ko'z olmasi qatlamlari: shox parda, gavhar, to'r parda.", ru: 'Слои глазного яблока: роговица, хрусталик, сетчатка.', en: 'Layers of the eyeball: cornea, lens and retina.' },
    system: 'organ', region: 'head',
    embedUrl: sk('4bf3236c8fe2407ea3f494a93b8f5aa2'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Schematic_diagram_of_the_human_eye_en.svg/400px-Schematic_diagram_of_the_human_eye_en.svg.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/cross-section-of-eye-anatomy-4bf3236c8fe2407ea3f494a93b8f5aa2',
    license: 'CC (Sketchfab)', author: 'Erik Ao (@erikao)',
    tags: ["ko'z", 'eye', 'oculus', 'глаз'],
    topicIds: ['sem_1_top_6', 'sem_3_top_13'],
  },
  {
    id: 'inner-ear',
    title: { uz: 'Ichki quloq anatomiyasi', ru: 'Анатомия внутреннего уха', en: 'Inner Ear Anatomy' },
    description: { uz: "Nog'ora parda, eshitish suyakchalari va muvozanat a'zosi.", ru: 'Барабанная перепонка, слуховые косточки и орган равновесия.', en: 'Tympanic membrane, ossicles and the vestibular system.' },
    system: 'organ', region: 'head',
    embedUrl: sk('f80bda64666c4b8aaac8f63b7b82a0a0'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Anatomy_of_the_Human_Ear.svg/400px-Anatomy_of_the_Human_Ear.svg.png',
    source: 'Sketchfab (Univ. of Dundee)', sourceUrl: 'https://sketchfab.com/3d-models/anatomy-of-the-inner-ear-f80bda64666c4b8aaac8f63b7b82a0a0',
    license: 'CC-BY', author: 'University of Dundee',
    tags: ['quloq', 'ear', 'auris', 'ухо'],
    topicIds: ['sem_3_top_13'],
  },
  {
    id: 'larynx',
    title: { uz: 'Hiqildoq (larenks)', ru: 'Гортань', en: 'Larynx' },
    description: { uz: "Hiqildoq tog'aylari, muskullari va boylamlari.", ru: 'Хрящи, мышцы и связки гортани.', en: 'Cartilages, muscles and ligaments of the larynx.' },
    system: 'organ', region: 'neck',
    embedUrl: sk('a00bc73a303c46248db6a13a88b23404'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Larynx_external_en.svg/400px-Larynx_external_en.svg.png',
    source: 'Sketchfab (Univ. of Dundee)', sourceUrl: 'https://sketchfab.com/3d-models/anatomy-of-the-larynx-a00bc73a303c46248db6a13a88b23404',
    license: 'CC-BY-SA', author: 'University of Dundee',
    tags: ['hiqildoq', 'larynx', 'гортань'],
    topicIds: ['sem_2_top_4'],
  },

  // ---------------------- NERVLAR (NERVE) ----------------------
  {
    id: 'spinal-nerve-brachial-plexus',
    title: { uz: "Orqa miya nervi va yelka chigali", ru: 'Спинномозговой нерв и плечевое сплетение', en: 'Spinal Nerve & Brachial Plexus' },
    description: { uz: "Orqa miya nervlari va yelka (brachial) nerv chigalining tuzilishi.", ru: 'Спинномозговые нервы и строение плечевого сплетения.', en: 'Spinal nerves and the structure of the brachial plexus.' },
    system: 'nerve', region: 'upperLimb',
    embedUrl: sk('1177cbb86fb24b089513587ac0a9b403'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Spinal_cord_diagram.svg/400px-Spinal_cord_diagram.svg.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/spinal-nerve-and-brachial-plexus-1177cbb86fb24b089513587ac0a9b403',
    license: 'CC (Sketchfab)', author: 'VivekAnatomy',
    tags: ['nerv', 'brachial plexus', 'нерв'],
    topicIds: ['sem_3_top_5', 'sem_3_top_6'],
  },
  {
    id: 'brachial-plexus-ubc',
    title: { uz: 'Yelka nerv chigali (preparat)', ru: 'Плечевое сплетение (препарат)', en: 'Brachial Plexus (prosection)' },
    description: { uz: "Haqiqiy preparatdan olingan yelka nerv chigali modeli.", ru: 'Модель плечевого сплетения по реальному препарату.', en: 'Brachial plexus model from a real plastinated prosection.' },
    system: 'nerve', region: 'upperLimb',
    embedUrl: sk('932dbecba80541ce9168cef085fc15fa'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Brachial_plexus_color.svg/400px-Brachial_plexus_color.svg.png',
    source: 'Sketchfab (UBC Medicine)', sourceUrl: 'https://sketchfab.com/3d-models/brachial-plexus-932dbecba80541ce9168cef085fc15fa',
    license: 'CC (Sketchfab)', author: 'UBC Medicine',
    tags: ['nerv chigali', 'plexus', 'сплетение'],
    topicIds: ['sem_3_top_6'],
  },

  // ---------------------- QON TOMIRLAR (VESSEL) ----------------------
  {
    id: 'circulatory-system',
    title: { uz: 'Qon aylanish tizimi', ru: 'Кровеносная система', en: 'Circulatory System' },
    description: { uz: "Yurak, arteriyalar va venalar — butun tana qon aylanishi.", ru: 'Сердце, артерии и вены — кровообращение всего тела.', en: 'Heart, arteries and veins — whole-body circulation.' },
    system: 'vessel', region: 'wholeBody',
    embedUrl: sk('719baedb192c49c0bb9b602690698f01'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Circulatory_System_en.svg/400px-Circulatory_System_en.svg.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/human-circulatory-system-719baedb192c49c0bb9b602690698f01',
    license: 'CC (Sketchfab)', author: 'chi051205',
    tags: ['qon aylanish', 'circulatory', 'кровь'],
    topicIds: ['sem_2_top_9'],
  },
  {
    id: 'artery-vein-system',
    title: { uz: 'Arteriya va vena tizimi', ru: 'Система артерий и вен', en: 'Artery & Vein System' },
    description: { uz: "Tananing arterial va venoz qon tomirlari tarmog'i.", ru: 'Сеть артериальных и венозных сосудов тела.', en: 'The arterial and venous vessel network of the body.' },
    system: 'vessel', region: 'wholeBody',
    embedUrl: sk('974e23da8f4b49da9928ce369167cb02'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Arteries_and_veins_en.svg/400px-Arteries_and_veins_en.svg.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/3d-human-artery-and-vein-system-974e23da8f4b49da9928ce369167cb02',
    license: 'CC (Sketchfab)', author: 'artisan3dventures',
    tags: ['arteriya', 'vena', 'artery', 'vein'],
    topicIds: ['sem_2_top_9', 'sem_2_top_11', 'sem_2_top_12'],
  },
  {
    id: 'angiology-zanatomy',
    title: { uz: 'Angiologiya (tomirlar) — Z-Anatomy', ru: 'Ангиология (сосуды) — Z-Anatomy', en: 'Angiology (Vessels) — Z-Anatomy' },
    description: { uz: "Ochiq manbali Z-Anatomy atlasidagi qon tomir tizimi.", ru: 'Сосудистая система из открытого атласа Z-Anatomy.', en: 'The vascular system from the open-source Z-Anatomy atlas.' },
    system: 'vessel', region: 'wholeBody',
    embedUrl: sk('0caae8f894cc40b69f3f78adf14b9665'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Circulatory_System_en.svg/400px-Circulatory_System_en.svg.png',
    source: 'Sketchfab (Z-Anatomy)', sourceUrl: 'https://sketchfab.com/3d-models/angiology-0caae8f894cc40b69f3f78adf14b9665',
    license: 'CC-BY-SA', author: 'Z-Anatomy',
    tags: ['angiologiya', 'vessels', 'сосуды'],
    topicIds: ['sem_2_top_9'],
  },

  // ================= KENGAYTIRILGAN TO'PLAM 2 — bo'shliqlarni to'ldirish =================
  // Quyidagi modellar avvalgi kataloqda mavzu biriktirilmagan (0 ta model) dastur
  // mavzularini qoplash uchun qo'shildi. Har biri sketchfab.com'da "Download Free
  // 3D model" (bepul) sifatida tasdiqlangan haqiqiy modellarga ishora qiladi.

  // ---------------------- sem_1_top_7: bolalar kalla suyagi ----------------------
  {
    id: 'fetal-skull-childhood',
    title: { uz: 'Homila (chaqaloq) kalla suyagi', ru: 'Череп плода (новорождённого)', en: 'Human Fetal Skull' },
    description: {
      uz: "Bolalar kalla suyagining rivojlanish bosqichini ko'rsatuvchi homila kalla suyagi, fotogrammetriya usulida skanerlangan.",
      ru: 'Череп плода, отсканированный методом фотограмметрии — иллюстрирует раннюю стадию развития детского черепа.',
      en: 'A human fetal skull captured via photogrammetry — illustrates the early developmental stage of the child skull.',
    },
    system: 'bone', region: 'head',
    embedUrl: sk('bc94ea0ac45b46e2b7c13d04ae1e67c4'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Human_skull_front_simplified_bones.svg/400px-Human_skull_front_simplified_bones.svg.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/human-fetal-skull-bc94ea0ac45b46e2b7c13d04ae1e67c4',
    license: 'CC (Sketchfab)', author: 'Eric Bauer (@ebauer4)',
    tags: ["bolalar kalla suyagi", "fetal skull", "cranium infantile", "череп плода"],
    topicIds: ['sem_1_top_7'],
  },

  // ---------------------- sem_1_top_8: yelka kamari bo'g'imlari ----------------------
  {
    id: 'shoulder-joint-ligaments-arloopa',
    title: { uz: "Yelka bo'g'imi", ru: 'Плечевой сустав', en: 'Shoulder Joint' },
    description: {
      uz: "Yelka (glenohumeral) bo'g'imi — o'mrov suyagi, kurak va yelka suyagi bosh qismining birikishi.",
      ru: 'Плечевой (плечелопаточный) сустав — соединение головки плечевой кости с суставной впадиной лопатки.',
      en: 'The shoulder (glenohumeral) joint — the articulation between the head of the humerus and the glenoid cavity of the scapula.',
    },
    system: 'bone', region: 'upperLimb',
    embedUrl: sk('d3191cc41b9c4c94b393e1c26c4f0b02'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Scapula_anterior_view.png/400px-Scapula_anterior_view.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/shoulder-joint-d3191cc41b9c4c94b393e1c26c4f0b02',
    license: 'CC (Sketchfab)', author: 'arloopa',
    tags: ["yelka bo'g'imi", 'shoulder joint', 'articulatio glenohumeralis', 'плечевой сустав'],
    topicIds: ['sem_1_top_8'],
  },

  // ---------------------- sem_1_top_9: jag' bo'g'imi (TMJ) ----------------------
  {
    id: 'tmj-articular-disc-dundee',
    title: { uz: "Jag' bo'g'imi diski (TMJ)", ru: 'Диск височно-нижнечелюстного сустава', en: 'Articular Disc (TMJ)' },
    description: {
      uz: "Chakka-pastki jag' bo'g'imining tolali xarsangchasi (disk articularis) — bo'g'im boshini chakka suyagi chuqurchasidan ajratib turadi.",
      ru: 'Суставной диск височно-нижнечелюстного сустава, разделяющий головку нижней челюсти и суставную ямку височной кости.',
      en: 'The fibrocartilaginous articular disc of the temporomandibular joint, separating the mandibular condyle from the temporal fossa.',
    },
    system: 'bone', region: 'head',
    embedUrl: sk('a2c3d9bd82274fa187ee482bbe750d78'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Human_skull_front_bones.svg/400px-Human_skull_front_bones.svg.png',
    source: 'Sketchfab (Univ. of Dundee, School of Dentistry)', sourceUrl: 'https://sketchfab.com/3d-models/articular-disc-tmj-a2c3d9bd82274fa187ee482bbe750d78',
    license: 'CC (Sketchfab)', author: 'University of Dundee, School of Dentistry (@DundeeDental)',
    tags: ["jag' bo'g'imi", 'temporomandibular joint', 'articulatio temporomandibularis', 'височно-нижнечелюстной сустав'],
    topicIds: ['sem_1_top_9'],
  },

  // ---------------------- sem_2_top_1: og'iz, til, halqum ----------------------
  {
    id: 'pharynx-floor-of-mouth',
    title: { uz: "Halqum va og'iz tubi", ru: 'Глотка и дно полости рта', en: 'Pharynx and Floor of Mouth' },
    description: {
      uz: "Og'iz tubi va halqum sohasi tuzilmalarini o'rgatish uchun mo'ljallangan model.",
      ru: 'Учебная модель, демонстрирующая структуры дна полости рта и глотки.',
      en: 'A teaching model identifying the anatomical structures of the pharynx and the floor of the mouth.',
    },
    system: 'other', region: 'neck',
    embedUrl: sk('b262c70bf9bd49c2a5428581b754f24b'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Digestive_system_diagram_edit.svg/400px-Digestive_system_diagram_edit.svg.png',
    source: 'Sketchfab (Univ. of Dundee School of Medicine)', sourceUrl: 'https://sketchfab.com/3d-models/pharynx-and-floor-of-mouth-b262c70bf9bd49c2a5428581b754f24b',
    license: 'CC-BY-NC-SA', author: 'University of Dundee School of Medicine (@tilt)',
    tags: ['halqum', 'pharynx', 'pharynx og\'iz tubi', 'глотка'],
    topicIds: ['sem_2_top_1'],
  },
  {
    id: 'human-teeth-antipov',
    title: { uz: 'Odam tishlari', ru: 'Зубы человека', en: 'Human Teeth' },
    description: {
      uz: "Realistik tuzilishga ega odam tishlari modeli, tish tojlari va ildizlari bilan.",
      ru: 'Реалистичная модель зубов человека с коронками и корнями.',
      en: 'A realistic human teeth model with crowns and roots.',
    },
    system: 'other', region: 'head',
    embedUrl: sk('c4c569f0e08948e2a572007a7a5726f2'),
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/human-teeth-c4c569f0e08948e2a572007a7a5726f2',
    license: 'CC (Sketchfab)', author: 'Alexander Antipov (@Dessen)',
    tags: ['tishlar', 'teeth', 'dentes', 'зубы'],
    topicIds: ['sem_2_top_1'],
  },

  // ---------------------- sem_2_top_3: qorin pardasi topografiyasi ----------------------
  {
    id: 'abdomen-topography-umcg',
    title: { uz: 'Qorin bo\'shlig\'i topografiyasi', ru: 'Топография брюшной полости', en: 'Abdomen Anatomy (Topography)' },
    description: {
      uz: "Qorin bo'shlig'idagi a'zolar va tomirlarning joylashuvi — qorin pardasi (peritoneum) topografiyasini o'rganish uchun umumiy ko'rinish.",
      ru: 'Расположение органов и сосудов брюшной полости — общий обзор для изучения топографии брюшины.',
      en: 'Organs and vessels of the abdominal cavity — a general overview for studying peritoneal topography.',
    },
    system: 'organ', region: 'abdomen',
    embedUrl: sk('ed05d3b7b49b4014a09d7a9d62e4f421'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Human_body_silhouette_with_organs.svg/400px-Human_body_silhouette_with_organs.svg.png',
    source: 'Sketchfab (E-learning UMCG)', sourceUrl: 'https://sketchfab.com/3d-models/abdomen-anatomy-ed05d3b7b49b4014a09d7a9d62e4f421',
    license: 'CC (Sketchfab)', author: 'E-learning UMCG (@eLearningUMCG)',
    tags: ['qorin pardasi', 'peritoneum', 'peritoneum topography', 'брюшина'],
    topicIds: ['sem_2_top_3'],
  },

  // ---------------------- sem_2_top_5: qalqonsimon, buyrak usti bezlari ----------------------
  {
    id: 'thyroid-shapeshiftingblob',
    title: { uz: 'Qalqonsimon bez', ru: 'Щитовидная железа', en: 'Thyroid Gland' },
    description: {
      uz: "Bo'yinning old qismida joylashgan qalqonsimon bez shakli va tuzilishi.",
      ru: 'Форма и строение щитовидной железы, расположенной в передней части шеи.',
      en: 'The shape and structure of the thyroid gland, located in the anterior neck.',
    },
    system: 'organ', region: 'neck',
    embedUrl: sk('b7e522c4f5dc4cea97d04a3d6773e96f'),
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/thyroid-b7e522c4f5dc4cea97d04a3d6773e96f',
    license: 'CC (Sketchfab)', author: 'ShapeShiftingBlob',
    tags: ['qalqonsimon bez', 'thyroid', 'glandula thyroidea', 'щитовидная железа'],
    topicIds: ['sem_2_top_5'],
  },
  {
    id: 'adrenal-gland-aml-case',
    title: { uz: "Buyrak usti bezi (o'ng)", ru: 'Надпочечник (правый)', en: 'Right Adrenal Gland' },
    description: {
      uz: "O'ng buyrak usti bezining joylashuvi va tuzilishini ko'rsatuvchi radiologik model (o'smasi bilan birga tasvirlangan holat asosida).",
      ru: 'Радиологическая модель, показывающая расположение и строение правого надпочечника (на основе клинического случая с новообразованием).',
      en: 'A radiology teaching model showing the location and structure of the right adrenal gland (based on a clinical case with an incidental tumor).',
    },
    system: 'organ', region: 'abdomen',
    embedUrl: sk('e081236d45174136a86a89cd5c7bd80b'),
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/giant-aml-of-right-adrenal-gland-e081236d45174136a86a89cd5c7bd80b',
    license: 'CC (Sketchfab)', author: 'Ignacio Gorriti MD Radiologist (@igorriti)',
    tags: ['buyrak usti bezi', 'adrenal gland', 'glandula suprarenalis', 'надпочечник'],
    topicIds: ['sem_2_top_5'],
  },

  // ---------------------- sem_2_top_7: ayollar jinsiy tizimi ----------------------
  {
    id: 'uterus-vagina-adnexia',
    title: { uz: 'Bachadon, qin va qo\'shimchalari', ru: 'Матка, влагалище и придатки', en: 'Uterus, Vagina & Adnexa' },
    description: {
      uz: "Bachadon, qin va uning qo'shimchalari (tuxumdon, naycha)ning ilmiy-illyustrativ modeli.",
      ru: 'Научно-иллюстративная модель матки, влагалища и её придатков (яичники, трубы).',
      en: 'A scientific-illustrative visualization of the human uterus, vagina and adnexa (ovaries, tubes).',
    },
    system: 'organ', region: 'pelvis',
    embedUrl: sk('0c543295600d4feaa3bf723cc1bb1730'),
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/uterus-0c543295600d4feaa3bf723cc1bb1730',
    license: 'CC (Sketchfab)', author: 'Beste Zengin (@beste_zengin)',
    tags: ['bachadon', 'uterus', 'uterus vagina adnexa', 'матка'],
    topicIds: ['sem_2_top_7'],
  },

  // ---------------------- sem_2_top_8: erkaklar jinsiy tizimi ----------------------
  {
    id: 'male-genital-system-ahmed',
    title: { uz: 'Erkaklar jinsiy tizimi', ru: 'Мужская половая система', en: 'Male Genital System' },
    description: {
      uz: "Erkaklar jinsiy a'zolari: yashirin uzv, moyaklar, qo'shimcha moyak, urug' chiqaruvchi yo'l, urug' pufakchalari, prostata bezi va siydik-jinsiy yo'l.",
      ru: 'Мужские половые органы: половой член, яички, придаток яичка, семявыносящий проток, семенные пузырьки, предстательная железа и мочеиспускательный канал.',
      en: 'The male genital organs: penis, testes, epididymis, vas deferens, seminal vesicles, prostate gland and urethra.',
    },
    system: 'organ', region: 'pelvis',
    embedUrl: sk('0d54b936029a46e7b93637ac417c8283'),
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/male-genital-system-0d54b936029a46e7b93637ac417c8283',
    license: 'CC (Sketchfab)', author: 'Ahmed moamen (@ahmed17)',
    tags: ['erkaklar jinsiy tizimi', 'male reproductive system', 'systema genitale masculinum', 'мужская половая система'],
    topicIds: ['sem_2_top_8'],
  },

  // ---------------------- sem_2_top_10 (bonus, kam qoplangan mavzu): qo'l/bo'yin arteriyalari ----------------------
  {
    id: 'arteries-head-neck-chair',
    title: { uz: 'Bosh va bo\'yin arteriyalari', ru: 'Артерии головы и шеи', en: 'Arteries of Head & Neck' },
    description: {
      uz: "Bosh va bo'yin arteriyalari, jumladan o'mrov osti arteriyasining boshlang'ich qismi.",
      ru: 'Артерии головы и шеи, включая начальный отдел подключичной артерии.',
      en: 'The arteries of the head and neck, including the origin of the subclavian artery.',
    },
    system: 'vessel', region: 'neck',
    embedUrl: sk('de9a1820a79d4ad19966934ffd68ed41'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Arteries_and_veins_en.svg/400px-Arteries_and_veins_en.svg.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/arteries-of-head-neck-de9a1820a79d4ad19966934ffd68ed41',
    license: 'CC (Sketchfab)', author: 'Chair_Digital_Anatomy',
    tags: ["o'mrov osti arteriyasi", 'subclavian artery', 'arteria subclavia', 'подключичная артерия'],
    topicIds: ['sem_2_top_10'],
  },

  // ---------------------- sem_2_top_13: limfa tizimi ----------------------
  {
    id: 'lymphatic-system-overview-umcg',
    title: { uz: 'Limfa tizimi umumiy ko\'rinishi', ru: 'Обзор лимфатической системы', en: 'Lymphatic System: an Overview' },
    description: {
      uz: "Limfa tizimining asosiy qismlari — traxeya, aorta, venoz tizim va skelet fonida ko'rsatilgan.",
      ru: 'Основные части лимфатической системы, показанные на фоне трахеи, аорты, венозной системы и скелета.',
      en: 'The main parts of the lymphatic system, shown alongside the trachea, aorta, venous system and skeleton.',
    },
    system: 'other', region: 'wholeBody',
    embedUrl: sk('00d877fa9fbc44218237dbc0a4cc96e1'),
    source: 'Sketchfab (E-learning UMCG)', sourceUrl: 'https://sketchfab.com/3d-models/lymphatic-system-an-overview-00d877fa9fbc44218237dbc0a4cc96e1',
    license: 'CC (Sketchfab)', author: 'E-learning UMCG (@eLearningUMCG)',
    tags: ['limfa tizimi', 'lymphatic system', 'systema lymphaticum', 'лимфатическая система'],
    topicIds: ['sem_2_top_13'],
  },

  // ---------------------- sem_3_top_2: o'rta miya, oraliq miya ----------------------
  {
    id: 'thalamus-brainsections',
    title: { uz: 'Talamus (kesmalar bo\'yicha)', ru: 'Таламус (по срезам)', en: 'Thalamus (Brain Sections)' },
    description: {
      uz: "Miyaning 18 ta kesmasi asosida qurilgan talamus (oraliq miya qismi) modeli.",
      ru: 'Модель таламуса (часть промежуточного мозга), построенная по 18 срезам мозга.',
      en: 'A low-poly thalamus (diencephalon) model built from 18 brain sections.',
    },
    system: 'nerve', region: 'head',
    embedUrl: sk('0b55fba532f1476f89572c6d8014ec8f'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Brain_surface_gyri.svg/400px-Brain_surface_gyri.svg.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/thalamus-ugapons-18brainsections-0-0-10a-0b55fba532f1476f89572c6d8014ec8f',
    license: 'CC (Sketchfab)', author: 'NatDotGit',
    tags: ['talamus', 'thalamus', 'oraliq miya diencephalon', 'таламус'],
    topicIds: ['sem_3_top_2'],
  },

  // ---------------------- sem_3_top_4: o'tkazuv yo'llari, refleks yoyi ----------------------
  {
    id: 'spinothalamic-tract',
    title: { uz: 'Spinotalamik yo\'l', ru: 'Спиноталамический путь', en: 'Spinothalamic Tract' },
    description: {
      uz: "Og'riq, harorat va qo'pol teginish sezgisini orqa miyadan bosh miyaga o'tkazuvchi yo'l — birinchi neyron orqa ildiz orqali kirib, orqa shoxda ikkinchi neyron bilan sinaps hosil qiladi.",
      ru: 'Восходящий путь, передающий информацию о боли, температуре и грубом осязании — первый нейрон входит через задний корешок и образует синапс во втором нейроне заднего рога.',
      en: 'The ascending sensory pathway carrying pain, temperature and crude touch — first-order axons enter via the dorsal root and synapse with second-order neurons in the dorsal horn.',
    },
    system: 'nerve', region: 'back',
    embedUrl: sk('9754d81f54df426aafa25b3799b5ce65'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Spinal_cord_diagram.svg/400px-Spinal_cord_diagram.svg.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/spinothalamic-tract-101321-9754d81f54df426aafa25b3799b5ce65',
    license: 'CC (Sketchfab)', author: 'aandp',
    tags: ["o'tkazuv yo'li", 'spinothalamic tract', 'tractus spinothalamicus', 'спиноталамический путь'],
    topicIds: ['sem_3_top_4'],
  },

  // ---------------------- sem_3_top_8: I, II, VIII juft nervlar ----------------------
  {
    id: 'eye-anatomy-umcg',
    title: { uz: "Ko'z anatomiyasi (ko'ruv nervi)", ru: 'Анатомия глаза (зрительный нерв)', en: 'Anatomy of the Eye (Optic Nerve)' },
    description: {
      uz: "Ko'z olmasi va ko'ruv nervi (II juft bosh miya nervi)ning anatomik tuzilishi.",
      ru: 'Анатомическое строение глазного яблока и зрительного нерва (II пара черепных нервов).',
      en: 'The anatomical structure of the eyeball and the optic nerve (cranial nerve II).',
    },
    system: 'nerve', region: 'head',
    embedUrl: sk('f7745aaff145485fb02cf729c96c5f37'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Schematic_diagram_of_the_human_eye_en.svg/400px-Schematic_diagram_of_the_human_eye_en.svg.png',
    source: 'Sketchfab (E-learning UMCG)', sourceUrl: 'https://sketchfab.com/3d-models/anatomy-of-the-eye-f7745aaff145485fb02cf729c96c5f37',
    license: 'CC (Sketchfab)', author: 'E-learning UMCG (@eLearningUMCG)',
    tags: ["ko'ruv nervi", 'optic nerve', 'nervus opticus', 'зрительный нерв'],
    topicIds: ['sem_3_top_8'],
  },

  // ------------- sem_3_top_9, sem_3_top_10, sem_3_top_11: III-XII juft nervlar (umumiy) -------------
  {
    id: 'cranial-nerve-nuclei',
    title: { uz: "Bosh miya nervlari yadrolari", ru: 'Ядра черепных нервов', en: 'Cranial Nerve Nuclei' },
    description: {
      uz: "Uzunchoq miya, ko'prik va o'rta miyada joylashgan barcha bosh miya nervi yadrolarining joylashuvi — III, IV, V, VI, VII, IX, X, XI, XII juft nervlar uchun umumiy ma'lumot.",
      ru: 'Расположение ядер всех черепных нервов в продолговатом мозге, мосту и среднем мозге — общий материал для III, IV, V, VI, VII, IX, X, XI, XII пар нервов.',
      en: 'The locations of all cranial nerve nuclei within the medulla, pons and midbrain — general reference for cranial nerves III, IV, V, VI, VII, IX, X, XI and XII.',
    },
    system: 'nerve', region: 'head',
    embedUrl: sk('12cdb1b5e4a9424da9d24f523a3a7b98'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Nervous_system_diagram.png/400px-Nervous_system_diagram.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/cranial-nerve-nuclei-12cdb1b5e4a9424da9d24f523a3a7b98',
    license: 'CC (Sketchfab)', author: 'Medical.Gallery Graphics (@scootsmalone)',
    tags: ['bosh miya nervlari', 'cranial nerve nuclei', 'nuclei nervorum cranialium', 'ядра черепных нервов'],
    topicIds: ['sem_3_top_9', 'sem_3_top_10', 'sem_3_top_11'],
  },

  // ---------------------- sem_3_top_12: vegetativ nerv tizimi ----------------------
  {
    id: 'human-nervous-system-full-body',
    title: { uz: "Asab tizimi (butun tana)", ru: 'Нервная система (всё тело)', en: 'Human Nervous System — Full Body' },
    description: {
      uz: "Markaziy va periferik asab tizimi, bosh miya nervlari (12 juft) hamda vegetativ (avtonom) nerv tizimi yo'llarini o'z ichiga olgan to'liq tana modeli.",
      ru: 'Полная модель тела, включающая центральную и периферическую нервную систему, 12 пар черепных нервов и пути вегетативной (автономной) нервной системы.',
      en: 'A full-body model featuring the central and peripheral nervous systems, all 12 pairs of cranial nerves, and autonomic nervous system pathways.',
    },
    system: 'nerve', region: 'wholeBody',
    embedUrl: sk('5d10d80150d34fe7b160302d0003092c'),
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Spinal_cord_diagram.svg/400px-Spinal_cord_diagram.svg.png',
    source: 'Sketchfab', sourceUrl: 'https://sketchfab.com/3d-models/human-nervous-system-full-body-3d-model-5d10d80150d34fe7b160302d0003092c',
    license: 'CC (Sketchfab)', author: 'gemaglob1n',
    tags: ['vegetativ nerv tizimi', 'autonomic nervous system', 'systema nervosum autonomicum', 'вегетативная нервная система'],
    topicIds: ['sem_3_top_12'],
  },
];
