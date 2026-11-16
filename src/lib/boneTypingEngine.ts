// Suyak-yozish mashqi (Bone typing drill) — sof mantiq, UI'dan mustaqil.
// Barcha ma'lumotlar loyiha muallifi tomonidan yozilgan (standart anatomik atamalar).

export type BoneRegion = 'head' | 'spine' | 'thorax' | 'upperLimb' | 'lowerLimb';

export interface BoneEntry {
  id: string;
  latin: string;
  uz: string;
  region: BoneRegion;
}

export const BONE_REGION_LABELS: Record<BoneRegion, string> = {
  head: 'Bosh suyagi',
  spine: 'Umurtqa pog‘onasi',
  thorax: 'Ko‘krak qafasi',
  upperLimb: 'Yuqori oyoq-qo‘l',
  lowerLimb: 'Pastki oyoq-qo‘l',
};

export const BONES: BoneEntry[] = [
  { id: 'frontal', latin: 'frontal', uz: 'peshona suyagi', region: 'head' },
  { id: 'parietal', latin: 'parietal', uz: 'tepa suyagi', region: 'head' },
  { id: 'temporal', latin: 'temporal', uz: 'chakka suyagi', region: 'head' },
  { id: 'occipital', latin: 'occipital', uz: 'ensa suyagi', region: 'head' },
  { id: 'sphenoid', latin: 'sphenoid', uz: 'ponasimon suyak', region: 'head' },
  { id: 'ethmoid', latin: 'ethmoid', uz: 'g‘alvirsimon suyak', region: 'head' },
  { id: 'mandible', latin: 'mandible', uz: 'pastki jag‘ suyagi', region: 'head' },
  { id: 'maxilla', latin: 'maxilla', uz: 'yuqori jag‘ suyagi', region: 'head' },
  { id: 'cervical', latin: 'cervical vertebra', uz: 'bo‘yin umurtqasi', region: 'spine' },
  { id: 'thoracic', latin: 'thoracic vertebra', uz: 'ko‘krak umurtqasi', region: 'spine' },
  { id: 'lumbar', latin: 'lumbar vertebra', uz: 'bel umurtqasi', region: 'spine' },
  { id: 'sacrum', latin: 'sacrum', uz: 'dumg‘aza suyagi', region: 'spine' },
  { id: 'coccyx', latin: 'coccyx', uz: 'dumbsimon suyak', region: 'spine' },
  { id: 'sternum', latin: 'sternum', uz: 'to‘sh suyagi', region: 'thorax' },
  { id: 'rib', latin: 'rib', uz: 'qovurg‘a', region: 'thorax' },
  { id: 'clavicle', latin: 'clavicle', uz: 'o‘mrov suyagi', region: 'upperLimb' },
  { id: 'scapula', latin: 'scapula', uz: 'kurak suyagi', region: 'upperLimb' },
  { id: 'humerus', latin: 'humerus', uz: 'yelka suyagi', region: 'upperLimb' },
  { id: 'radius', latin: 'radius', uz: 'bilak suyagi', region: 'upperLimb' },
  { id: 'ulna', latin: 'ulna', uz: 'tirsak suyagi', region: 'upperLimb' },
  { id: 'scaphoid', latin: 'scaphoid', uz: 'qayiqsimon suyak', region: 'upperLimb' },
  { id: 'lunate', latin: 'lunate', uz: 'yarimoysimon suyak', region: 'upperLimb' },
  { id: 'metacarpal', latin: 'metacarpal', uz: 'kaft suyagi', region: 'upperLimb' },
  { id: 'hip-bone', latin: 'hip bone', uz: 'tos suyagi', region: 'lowerLimb' },
  { id: 'femur', latin: 'femur', uz: 'son suyagi', region: 'lowerLimb' },
  { id: 'patella', latin: 'patella', uz: 'tizza qopqog‘i', region: 'lowerLimb' },
  { id: 'tibia', latin: 'tibia', uz: 'katta boldir suyagi', region: 'lowerLimb' },
  { id: 'fibula', latin: 'fibula', uz: 'kichik boldir suyagi', region: 'lowerLimb' },
  { id: 'talus', latin: 'talus', uz: 'boldir-tovon suyagi', region: 'lowerLimb' },
  { id: 'calcaneus', latin: 'calcaneus', uz: 'tovon suyagi', region: 'lowerLimb' },
  { id: 'metatarsal', latin: 'metatarsal', uz: 'oyoq kafti suyagi', region: 'lowerLimb' },
];

/** Javobni solishtirish uchun normallashtirish: kichik harf, diakritik belgilarsiz, bo‘shliq va tiremsiz. */
export function normalizeAnswer(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[‘’`ʻʼ']/g, '')
    .toLowerCase()
    .replace(/[\s-]+/g, ' ')
    .trim();
}

export function isCorrect(expected: string, typed: string): boolean {
  return normalizeAnswer(expected) === normalizeAnswer(typed);
}

export type Round = 1 | 2 | 3;

export const ROUND_INFO: Record<Round, { title: string; description: string; points: number }> = {
  1: { title: '1-bosqich · Yozing', description: 'Nomi ekranda ko‘rinadi. Ustidan yozib, imlosini eslab qoling.', points: 1 },
  2: { title: '2-bosqich · Birinchi harf', description: 'Faqat birinchi harf va ko‘rsatma. Qolganini eslang.', points: 2 },
  3: { title: '3-bosqich · Xotiradan', description: 'Hech qanday yordamsiz yozing.', points: 3 },
};

/** Bosqichga qarab ekranda ko‘rsatiladigan yordam matni. */
export function hintFor(bone: BoneEntry, round: Round, lang: Lang = 'uz'): string | null {
  if (round === 1) return bone.latin;
  if (round === 2) return `${bone.latin[0]}${'_'.repeat(Math.max(0, bone.latin.length - 1))}  (${boneName(bone, lang)})`;
  return null;
}

/** Tasodifiy, takrorsiz tanlov. rng 0..1 qaytaradigan funksiya (test uchun). */
export function pickBones(pool: BoneEntry[], count: number, rng: () => number = Math.random): BoneEntry[] {
  const arr = [...pool];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, Math.min(count, arr.length));
}

export function bonesForRegion(region: BoneRegion | 'all'): BoneEntry[] {
  return region === 'all' ? BONES : BONES.filter((b) => b.region === region);
}

export interface Attempt {
  boneId: string;
  round: Round;
  correct: boolean;
}

export function scoreAttempts(attempts: Attempt[]) {
  const correct = attempts.filter((a) => a.correct);
  const points = correct.reduce((sum, a) => sum + ROUND_INFO[a.round].points, 0);
  const maxPoints = attempts.reduce((sum, a) => sum + ROUND_INFO[a.round].points, 0);
  const accuracy = attempts.length === 0 ? 0 : Math.round((correct.length / attempts.length) * 100);
  return { points, maxPoints, accuracy, correctCount: correct.length, total: attempts.length };
}

export function bonesForRegions(regions: BoneRegion[] | 'all'): BoneEntry[] {
  return regions === 'all' ? BONES : BONES.filter((b) => regions.includes(b.region));
}

/**
 * Har bir o'quv mavzusi (sem_<semestr>_top_<tartib>) uchun suyak mintaqalari.
 * Mavzu suyak haqida bo'lmasa — 'all' (butun skelet bo'yicha mashq).
 */
export const TOPIC_BONE_REGIONS: Record<string, BoneRegion[] | 'all'> = {
  sem_1_top_1: ['spine'],
  sem_1_top_2: ['thorax', 'upperLimb'],
  sem_1_top_3: ['upperLimb'],
  sem_1_top_4: ['lowerLimb'],
  sem_1_top_5: ['head'],
  sem_1_top_6: ['head'],
  sem_1_top_7: ['head'],
  sem_1_top_8: ['spine', 'thorax', 'upperLimb'],
  sem_1_top_9: ['spine', 'lowerLimb'],
  sem_1_top_10: 'all',
  sem_1_top_11: 'all',
  sem_1_top_12: 'all',
  sem_1_top_13: 'all',
  sem_2_top_1: ['head'],
  sem_2_top_4: ['thorax'],
  sem_2_top_9: ['thorax'],
  sem_3_top_1: ['spine'],
  sem_3_top_6: ['upperLimb'],
  sem_3_top_7: ['spine', 'lowerLimb'],
  sem_3_top_8: ['head'],
  sem_3_top_9: ['head'],
  sem_3_top_10: ['head'],
  sem_3_top_11: ['head'],
  sem_3_top_13: ['head'],
};

export function regionsForTopic(topicKey: string | null | undefined): BoneRegion[] | 'all' {
  if (!topicKey) return 'all';
  return TOPIC_BONE_REGIONS[topicKey] ?? 'all';
}

export type Lang = 'uz' | 'ru' | 'en';

/** Suyak nomlari: ruscha va inglizcha (lotincha nom har doim yoziladi). */
const BONE_NAMES_I18N: Record<string, { ru: string; en: string }> = {
  frontal: { ru: 'лобная кость', en: 'frontal bone' },
  parietal: { ru: 'теменная кость', en: 'parietal bone' },
  temporal: { ru: 'височная кость', en: 'temporal bone' },
  occipital: { ru: 'затылочная кость', en: 'occipital bone' },
  sphenoid: { ru: 'клиновидная кость', en: 'sphenoid bone' },
  ethmoid: { ru: 'решетчатая кость', en: 'ethmoid bone' },
  mandible: { ru: 'нижняя челюсть', en: 'mandible' },
  maxilla: { ru: 'верхняя челюсть', en: 'maxilla' },
  cervical: { ru: 'шейный позвонок', en: 'cervical vertebra' },
  thoracic: { ru: 'грудной позвонок', en: 'thoracic vertebra' },
  lumbar: { ru: 'поясничный позвонок', en: 'lumbar vertebra' },
  sacrum: { ru: 'крестец', en: 'sacrum' },
  coccyx: { ru: 'копчик', en: 'coccyx' },
  sternum: { ru: 'грудина', en: 'sternum' },
  rib: { ru: 'ребро', en: 'rib' },
  clavicle: { ru: 'ключица', en: 'clavicle' },
  scapula: { ru: 'лопатка', en: 'scapula' },
  humerus: { ru: 'плечевая кость', en: 'humerus' },
  radius: { ru: 'лучевая кость', en: 'radius' },
  ulna: { ru: 'локтевая кость', en: 'ulna' },
  scaphoid: { ru: 'ладьевидная кость', en: 'scaphoid bone' },
  lunate: { ru: 'полулунная кость', en: 'lunate bone' },
  metacarpal: { ru: 'пястная кость', en: 'metacarpal bone' },
  'hip-bone': { ru: 'тазовая кость', en: 'hip bone' },
  femur: { ru: 'бедренная кость', en: 'femur' },
  patella: { ru: 'надколенник', en: 'patella' },
  tibia: { ru: 'большеберцовая кость', en: 'tibia' },
  fibula: { ru: 'малоберцовая кость', en: 'fibula' },
  talus: { ru: 'таранная кость', en: 'talus' },
  calcaneus: { ru: 'пяточная кость', en: 'calcaneus' },
  metatarsal: { ru: 'плюсневая кость', en: 'metatarsal bone' },
};

export function boneName(bone: BoneEntry, lang: Lang = 'uz'): string {
  if (lang === 'uz') return bone.uz;
  return BONE_NAMES_I18N[bone.id]?.[lang] ?? bone.latin;
}

const REGION_I18N: Record<Lang, Record<BoneRegion, string>> = {
  uz: { head: 'Bosh suyagi', spine: 'Umurtqa pog‘onasi', thorax: 'Ko‘krak qafasi', upperLimb: 'Yuqori oyoq-qo‘l', lowerLimb: 'Pastki oyoq-qo‘l' },
  ru: { head: 'Череп', spine: 'Позвоночник', thorax: 'Грудная клетка', upperLimb: 'Верхняя конечность', lowerLimb: 'Нижняя конечность' },
  en: { head: 'Skull', spine: 'Spine', thorax: 'Thorax', upperLimb: 'Upper limb', lowerLimb: 'Lower limb' },
};

export function regionLabel(region: BoneRegion, lang: Lang = 'uz'): string {
  return REGION_I18N[lang][region];
}

const ROUND_I18N: Record<Lang, Record<Round, { title: string; description: string }>> = {
  uz: {
    1: { title: '1-bosqich · Yozing', description: 'Nomi ekranda ko‘rinadi. Ustidan yozib, imlosini eslab qoling.' },
    2: { title: '2-bosqich · Birinchi harf', description: 'Faqat birinchi harf va ko‘rsatma. Qolganini eslang.' },
    3: { title: '3-bosqich · Xotiradan', description: 'Hech qanday yordamsiz yozing.' },
  },
  ru: {
    1: { title: '1-й этап · Напишите', description: 'Название показано на экране. Напишите его поверх и запомните написание.' },
    2: { title: '2-й этап · Первая буква', description: 'Только первая буква и подсказка. Вспомните остальное.' },
    3: { title: '3-й этап · По памяти', description: 'Без подсказок.' },
  },
  en: {
    1: { title: 'Round 1 · Type it', description: 'The name is on screen. Type over it to learn the spelling.' },
    2: { title: 'Round 2 · First letter', description: 'Only the first letter and a clue. Recall the rest.' },
    3: { title: 'Round 3 · From memory', description: 'No hints at all.' },
  },
};

export function roundInfo(round: Round, lang: Lang = 'uz') {
  return { ...ROUND_I18N[lang][round], points: ROUND_INFO[round].points };
}
