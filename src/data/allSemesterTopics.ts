import { SEMESTER_1_TOPICS, SEMESTER_2_TOPICS, SEMESTER_3_TOPICS } from '../constants';

export interface CurriculumTopic {
  id: string;
  semester: number;
  order: number;
  section: string;
  title: {
    uz: string;
    ru: string;
    en: string;
  };
  defaultPptxUrl?: string;
  defaultPdfUrl?: string;
}

const SEMESTER_1_SECTIONS = [
  'Osteologiya (Suyaklar ta\'limoti)',
  'Osteologiya (Ko\'krak qafasi va yelka kamari)',
  'Osteologiya (Qo\'l suyaklari)',
  'Osteologiya (Oyoq suyaklari)',
  'Kranologiya (Kalla suyaklari)',
  'Kranologiya (Miya va yuz qismlari)',
  'Kranologiya (Chakka osti chuqurchalari)',
  'Artrosindesmologiya (Suyaklar birlashmasi)',
  'Artrosindesmologiya (Bo\'g\'imlar anatomiyasi)',
  'Miologiya (Ko\'krak va qorin mushaklari)',
  'Miologiya (Bo\'yin va bosh mushaklari)',
  'Miologiya (Orqa va qo\'l mushaklari)',
  'Miologiya (Oyoq mushaklari)'
];

const SEMESTER_2_SECTIONS = [
  'Splanxnologiya (Ovqat hazm qilish a\'zolari)',
  'Splanxnologiya (Qorin bo\'shlig\'i va bezlar)',
  'Splanxnologiya (Qorin pardasi topografiyasi)',
  'Splanxnologiya (Nafas olish tizimi)',
  'Endokrinologiya (Ichki sekretsiya bezlari)',
  'Urologiya (Siydik ajratish tizimi)',
  'Reproduktiv anatomiya (Ayollar jinsiy tizimi)',
  'Reproduktiv anatomiya (Erkaklar jinsiy tizimi)',
  'Angiologiya & Kardiologiya (Yurak va tomirlar)',
  'Angiologiya (Qo\'l tomirlari)',
  'Angiologiya (Ko\'krak va qorin aortasi)',
  'Angiologiya (Venoz tizimi)',
  'Limfologiya (Limfa tizimi va anastomozlar)'
];

const SEMESTER_3_SECTIONS = [
  'Nevrologiya (Markaziy asab tizimi & Orqa miya)',
  'Nevrologiya (O\'rta va Oraliq miya)',
  'Nevrologiya (Bosh miya yarimsharlari & Bazal o\'zaklar)',
  'Nevrologiya (Miyaning o\'tkazuv yo\'llari)',
  'Periferik nervlar (Orqa miya nervlari & Bo\'yin chigali)',
  'Periferik nervlar (Yelka chigali)',
  'Periferik nervlar (Bel va Dumg\'aza chigallari)',
  'Kranial nervlar (I, II, VIII juft bosh miya nervlari)',
  'Kranial nervlar (III, IV, VI, XI, XII juft nervlar)',
  'Kranial nervlar (V juft Uch shoxli nerv)',
  'Kranial nervlar (VII, IX, X juft nervlar)',
  'Vegetativ nerv tizimi (Simpatik & Parasimpatik)',
  'Estesiologiya (Sezgi va muvozanat a\'zolari)'
];

export const ALL_39_TOPICS: CurriculumTopic[] = [
  // Semester 1
  ...SEMESTER_1_TOPICS.map((title, idx) => ({
    id: `sem_1_top_${idx + 1}`,
    semester: 1,
    order: idx + 1,
    section: SEMESTER_1_SECTIONS[idx] || 'Tayanch-harakat tizimi',
    title: {
      uz: title,
      ru: `Тема ${idx + 1}: ${title}`,
      en: `Topic ${idx + 1}: ${title}`
    }
  })),

  // Semester 2
  ...SEMESTER_2_TOPICS.map((title, idx) => ({
    id: `sem_2_top_${idx + 1}`,
    semester: 2,
    order: idx + 1,
    section: SEMESTER_2_SECTIONS[idx] || 'Ichki a\'zolar va tizimlar',
    title: {
      uz: title,
      ru: `Тема ${idx + 1}: ${title}`,
      en: `Topic ${idx + 1}: ${title}`
    }
  })),

  // Semester 3
  ...SEMESTER_3_TOPICS.map((title, idx) => ({
    id: `sem_3_top_${idx + 1}`,
    semester: 3,
    order: idx + 1,
    section: SEMESTER_3_SECTIONS[idx] || 'Asab tizimi va sezgi a\'zolari',
    title: {
      uz: title,
      ru: `Тема ${idx + 1}: ${title}`,
      en: `Topic ${idx + 1}: ${title}`
    }
  }))
];
