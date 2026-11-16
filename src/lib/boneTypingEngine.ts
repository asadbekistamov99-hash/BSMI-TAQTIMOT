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
export function hintFor(bone: BoneEntry, round: Round): string | null {
  if (round === 1) return bone.latin;
  if (round === 2) return `${bone.latin[0]}${'_'.repeat(Math.max(0, bone.latin.length - 1))}  (${bone.uz})`;
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
