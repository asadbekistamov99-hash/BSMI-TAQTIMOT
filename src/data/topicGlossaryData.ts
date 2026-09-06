import { SEMESTER_1_GLOSSARY_TERMS } from './semester1GlossaryTerms';
import { SEMESTER_2_GLOSSARY_TERMS } from './semester2GlossaryTerms';
import { SEMESTER_3_GLOSSARY_TERMS } from './semester3GlossaryTerms';

export interface TopicGlossaryTerm {
  id: string;
  latin: string;
  uzbek: string;
  russian: string;
  english: string;
  semester: number;
  topicOrder: number;
  description?: string;
}

export const ALL_TOPIC_GLOSSARY_TERMS: TopicGlossaryTerm[] = [
  ...SEMESTER_1_GLOSSARY_TERMS,
  ...SEMESTER_2_GLOSSARY_TERMS,
  ...SEMESTER_3_GLOSSARY_TERMS
];

export const getGlossaryTermsBySemester = (sem: number): TopicGlossaryTerm[] => {
  return ALL_TOPIC_GLOSSARY_TERMS.filter(t => t.semester === sem);
};

export const getGlossaryTermsByTopic = (sem: number, order: number): TopicGlossaryTerm[] => {
  return ALL_TOPIC_GLOSSARY_TERMS.filter(t => t.semester === sem && t.topicOrder === order);
};

export const getLocalizedTermTranslation = (term: TopicGlossaryTerm, lang: string): string => {
  if (lang === 'ru') return term.russian || term.uzbek;
  if (lang === 'en') return term.english || term.uzbek;
  return term.uzbek;
};


export interface TopicGlossaryMeta {
  semester: number;
  order: number;
  title: {
    uz: string;
    ru: string;
    en: string;
  };
}

export const TOPIC_GLOSSARY_METADATA: Record<string, TopicGlossaryMeta> = {
  // SEMESTER 1
  "sem1_top1": {
    semester: 1,
    order: 1,
    title: {
      uz: "1-Mavzu: Sath to‘g‘risida tushuncha. Anatomik terminologiya. Umurtqa pog‘onasi",
      ru: "Тема 1: Анатомическая терминология, плоскости и оси. Позвоночный столб",
      en: "Topic 1: Anatomical Terminology, Planes & Axes. Vertebral Column"
    }
  },
  "sem1_top2": {
    semester: 1,
    order: 2,
    title: {
      uz: "2-Mavzu: Qovurg‘alar. Kurak suyagi. To‘sh suyagi. O‘mrov suyagi",
      ru: "Тема 2: Ребра. Лопатка. Грудина. Ключица",
      en: "Topic 2: Ribs. Scapula. Sternum. Clavicle"
    }
  },
  "sem1_top3": {
    semester: 1,
    order: 3,
    title: {
      uz: "3-Mavzu: Yelka suyagi. Bilak va tirsak suyaklari. Qo‘l panja suyaklari",
      ru: "Тема 3: Плечевая кость. Лучевая и локтевая кости. Кости кисти",
      en: "Topic 3: Humerus. Radius and Ulna. Bones of the Hand"
    }
  },
  "sem1_top4": {
    semester: 1,
    order: 4,
    title: {
      uz: "4-Mavzu: Chanoq suyagi. Son, boldir va oyoq panja suyaklari",
      ru: "Тема 4: Тазовая кость. Бедренная кость, кости голени и стопы",
      en: "Topic 4: Hip Bone. Femur, Tibia, Fibula, Bones of the Foot"
    }
  },
  "sem1_top5": {
    semester: 1,
    order: 5,
    title: {
      uz: "5-Mavzu: Kalla suyaklari: ensa, tepa, peshona, chakka, ponasimon va yuz suyaklari",
      ru: "Тема 5: Кости черепа: затылочная, теменная, лобная, височная, клиновидная и лицевые кости",
      en: "Topic 5: Skull Bones: Occipital, Parietal, Frontal, Temporal, Sphenoid and Facial Bones"
    }
  },
  "sem1_top6": {
    semester: 1,
    order: 6,
    title: {
      uz: "6-Mavzu: Kallaning miya va yuz qismi. Ko‘z kosasi. Og‘iz va burun bo‘shliqlari",
      ru: "Тема 6: Мозговой и лицевой череп. Глазница. Полость носа и рта",
      en: "Topic 6: Cranium Cavities: Orbit, Nasal Cavity, Oral Cavity"
    }
  },
  "sem1_top7": {
    semester: 1,
    order: 7,
    title: {
      uz: "7-Mavzu: Chakka osti va qanot-tanglay chuqurchalari. Bolalarda kalla suyaklari",
      ru: "Тема 7: Подвисочная и крыловидно-нёбная ямки. Череп новорожденного",
      en: "Topic 7: Infratemporal & Pterygopalatine Fossae. Neonatal Skull"
    }
  },
  "sem1_top8": {
    semester: 1,
    order: 8,
    title: {
      uz: "8-Mavzu: Umurtqalar, ko‘krak qafasi, yelka kamari va qo‘l suyaklari birlashuvi",
      ru: "Тема 8: Соединения позвонков, грудной клетки, пояса верхних конечностей и руки",
      en: "Topic 8: Joints of Vertebrae, Thorax, Shoulder Girdle and Upper Limb"
    }
  },
  "sem1_top9": {
    semester: 1,
    order: 9,
    title: {
      uz: "9-Mavzu: Chanoq va oyoq suyaklari birlashuvi. Chanoq-son va jag‘ bo‘g‘imlari",
      ru: "Тема 9: Соединения костей таза и нижней конечности. Тазобедренный и челюстной суставы",
      en: "Topic 9: Joints of Pelvis and Lower Limb. Hip & Temporomandibular Joints"
    }
  },
  "sem1_top10": {
    semester: 1,
    order: 10,
    title: {
      uz: "10-Mavzu: Ko‘krak mushaklari va fastsiyalari. Diafragma. Qorin mushaklari",
      ru: "Тема 10: Мышцы и фасции груди. Диафрагма. Мышцы живота",
      en: "Topic 10: Muscles of the Thorax. Diaphragm. Abdominal Muscles"
    }
  },
  "sem1_top11": {
    semester: 1,
    order: 11,
    title: {
      uz: "11-Mavzu: Bo‘yin va bosh mushaklari. Chaynov va mimika mushaklari",
      ru: "Тема 11: Мышцы шеи и головы. Жевательные и мимические мышцы",
      en: "Topic 11: Muscles of Head & Neck. Muscles of Mastication and Facial Expression"
    }
  },
  "sem1_top12": {
    semester: 1,
    order: 12,
    title: {
      uz: "12-Mavzu: Orqa mushaklari. Yelka, bilak va qo‘l panja mushaklari",
      ru: "Тема 12: Мышцы спины. Мышцы плеча, предплечья и кисти",
      en: "Topic 12: Muscles of the Back, Shoulder, Forearm and Hand"
    }
  },
  "sem1_top13": {
    semester: 1,
    order: 13,
    title: {
      uz: "13-Mavzu: Chanoq, son, boldir va oyoq panja mushaklari",
      ru: "Тема 13: Мышцы таза, бедра, голени и стопы",
      en: "Topic 13: Muscles of the Pelvis, Thigh, Leg and Foot"
    }
  },

  // SEMESTER 2
  "sem2_top1": {
    semester: 2,
    order: 1,
    title: {
      uz: "1-Mavzu: Og‘iz bo‘shlig‘i. Tishlar. Til. Tanglay. Halqum. Qizilo‘ngach",
      ru: "Тема 1: Полость рта. Зубы. Язык. Нёбо. Глотка. Пищевод",
      en: "Topic 1: Oral Cavity. Teeth. Tongue. Palate. Pharynx. Esophagus"
    }
  },
  "sem2_top2": {
    semester: 2,
    order: 2,
    title: {
      uz: "2-Mavzu: Oshqozon, ingichka va yo‘g‘on ichak, jigar, o‘t pufagi, oshqozon osti bezi",
      ru: "Тема 2: Желудок, тонкая и толстая кишка, печень, желчный пузырь, поджелудочная железа",
      en: "Topic 2: Stomach, Small & Large Intestine, Liver, Gallbladder, Pancreas"
    }
  },
  "sem2_top3": {
    semester: 2,
    order: 3,
    title: {
      uz: "3-Mavzu: Qorin pardasi va qorin bo‘shlig‘i topografiyasi",
      ru: "Тема 3: Брюшина и топография брюшной полости",
      en: "Topic 3: Peritoneum and Peritoneal Cavity Topography"
    }
  },
  "sem2_top4": {
    semester: 2,
    order: 4,
    title: {
      uz: "4-Mavzu: Nafas tizimi: burun bo‘shlig‘i, hiqildoq, traxeya, bronxlar, o‘pka, plevra",
      ru: "Тема 4: Дыхательная система: нос, гортань, трахея, бронхи, легкие, плевра",
      en: "Topic 4: Respiratory System: Nose, Larynx, Trachea, Bronchi, Lungs, Pleura"
    }
  },
  "sem2_top5": {
    semester: 2,
    order: 5,
    title: {
      uz: "5-Mavzu: Endokrin tizim: qalqonsimon, qalqon orqasi, buyrak usti bezlari, gipofiz",
      ru: "Тема 5: Эндокринная система: щитовидная, паращитовидные железы, надпочечники, гипофиз",
      en: "Topic 5: Endocrine System: Thyroid, Parathyroid, Adrenal Glands, Pituitary"
    }
  },
  "sem2_top6": {
    semester: 2,
    order: 6,
    title: {
      uz: "6-Mavzu: Siydik tizimi: buyrak, siydik nayi, siydik pufagi, siydik chiqarish kanali",
      ru: "Тема 6: Мочевыделительная система: почки, мочеточники, мочевой пузырь, уретра",
      en: "Topic 6: Urinary System: Kidney, Ureter, Urinary Bladder, Urethra"
    }
  },
  "sem2_top7": {
    semester: 2,
    order: 7,
    title: {
      uz: "7-Mavzu: Ayollar jinsiy tizimi: tuxumdon, bachadon, bachadon nayi, qin, sut bezi",
      ru: "Тема 7: Женская половая система: яичник, матка, маточные трубы, влагалище, молочная железа",
      en: "Topic 7: Female Reproductive System: Ovary, Uterus, Uterine Tube, Vagina, Mammary Gland"
    }
  },
  "sem2_top8": {
    semester: 2,
    order: 8,
    title: {
      uz: "8-Mavzu: Erkaklar jinsiy tizimi: moyak, urug‘ yo‘li, prostata bezi, tashqi jinsiy a'zolar",
      ru: "Тема 8: Мужская половая система: яичко, семявыносящий проток, предстательная железа",
      en: "Topic 8: Male Reproductive System: Testis, Vas Deferens, Prostate Gland, External Genitalia"
    }
  },
  "sem2_top9": {
    semester: 2,
    order: 9,
    title: {
      uz: "9-Mavzu: Yurak anatomiyasi. Qon aylanish doiralari. Aorta va uyqu arteriyalari",
      ru: "Тема 9: Анатомия сердца. Круги кровообращения. Аорта и сонные артерии",
      en: "Topic 9: Heart Anatomy. Circulatory Loops. Aorta and Carotid Arteries"
    }
  },
  "sem2_top10": {
    semester: 2,
    order: 10,
    title: {
      uz: "10-Mavzu: Qo‘l arteriyalari. O‘mrov osti, qo‘ltiq va yelka arteriyalari",
      ru: "Тема 10: Артерии верхней конечности: подключичная, подмышечная и плечевая артерии",
      en: "Topic 10: Arteries of Upper Limb: Subclavian, Axillary, Brachial Arteries"
    }
  },
  "sem2_top11": {
    semester: 2,
    order: 11,
    title: {
      uz: "11-Mavzu: Ko‘krak va qorin aortasi hamda ularning tarmoqlari",
      ru: "Тема 11: Грудная и брюшная аорта и их ветви",
      en: "Topic 11: Thoracic and Abdominal Aorta and Their Branches"
    }
  },
  "sem2_top12": {
    semester: 2,
    order: 12,
    title: {
      uz: "12-Mavzu: Yuqori va pastki kovak venalar. Darvoza venasi. Portokaval anastomozlar",
      ru: "Тема 12: Верхняя и нижняя полые вены. Воротная вена. Порто-кавальные анастомозы",
      en: "Topic 12: Superior & Inferior Vena Cava. Portal Vein. Porto-caval Anastomoses"
    }
  },
  "sem2_top13": {
    semester: 2,
    order: 13,
    title: {
      uz: "13-Mavzu: Limfa tizimi: ko‘krak limfa yo‘li, limfa tugunlari, taloq",
      ru: "Тема 13: Лимфатическая система: грудной проток, лимфатические узлы, селезенка",
      en: "Topic 13: Lymphatic System: Thoracic Duct, Lymph Nodes, Spleen"
    }
  },

  // SEMESTER 3
  "sem3_top1": {
    semester: 3,
    order: 1,
    title: {
      uz: "1-Mavzu: Orqa miya, orqa miya pardalari, uzunchoq miya, ko‘prik, miyacha, IV qorincha",
      ru: "Тема 1: Спинной мозг, продолговатый мозг, мост, мозжечок, IV желудочек",
      en: "Topic 1: Spinal Cord, Medulla Oblongata, Pons, Cerebellum, 4th Ventricle"
    }
  },
  "sem3_top2": {
    semester: 3,
    order: 2,
    title: {
      uz: "2-Mavzu: O‘rta miya. Oraliq miya (talamus, gipotalamus). Bosh miyaning III qorinchasi",
      ru: "Тема 2: Средний мозг. Промежуточный мозг (таламус, гипоталамус). III желудочек",
      en: "Topic 2: Midbrain. Diencephalon (Thalamus, Hypothalamus). Third Ventricle"
    }
  },
  "sem3_top3": {
    semester: 3,
    order: 3,
    title: {
      uz: "3-Mavzu: Bosh miya yarim sharlari po‘stlog‘i. Bazal yadrolar. Yon qorinchalar",
      ru: "Тема 3: Кора больших полушарий. Базальные ядра. Боковые желудочки мозга",
      en: "Topic 3: Cerebral Cortex. Basal Ganglia. Lateral Ventricles"
    }
  },
  "sem3_top4": {
    semester: 3,
    order: 4,
    title: {
      uz: "4-Mavzu: Bosh va orqa miyaning o‘tkazuv yo‘llari (piramidal va ekstrapiramidal)",
      ru: "Тема 4: Проводящие пути головного и спинного мозга",
      en: "Topic 4: Neural Pathways of Brain and Spinal Cord"
    }
  },
  "sem3_top5": {
    semester: 3,
    order: 5,
    title: {
      uz: "5-Mavzu: Orqa miya nervlari. Bo‘yin chigali (Plexus cervicalis)",
      ru: "Тема 5: Спинномозговые нервы. Шейное сплетение",
      en: "Topic 5: Spinal Nerves. Cervical Plexus"
    }
  },
  "sem3_top6": {
    semester: 3,
    order: 6,
    title: {
      uz: "6-Mavzu: Yelka chigali (Plexus brachialis) va uning nervlari",
      ru: "Тема 6: Плечевое сплетение и его ветви",
      en: "Topic 6: Brachial Plexus and Peripheral Nerves"
    }
  },
  "sem3_top7": {
    semester: 3,
    order: 7,
    title: {
      uz: "7-Mavzu: Bel va dumg‘aza chigallari (Plexus lumbalis et sacralis)",
      ru: "Тема 7: Поясничное и крестцовое сплетения",
      en: "Topic 7: Lumbar and Sacral Plexuses"
    }
  },
  "sem3_top8": {
    semester: 3,
    order: 8,
    title: {
      uz: "8-Mavzu: I, II, VIII juft bosh miya nervlari (hidlov, ko‘ruv, daxliz-chig‘anoq)",
      ru: "Тема 8: I, II, VIII пары черепных нервов (обонятельный, зрительный, преддверно-улитковый)",
      en: "Topic 8: Cranial Nerves I, II, VIII (Olfactory, Optic, Vestibulocochlear)"
    }
  },
  "sem3_top9": {
    semester: 3,
    order: 9,
    title: {
      uz: "9-Mavzu: III, IV, VI, XI, XII juft bosh miya nervlari",
      ru: "Тема 9: III, IV, VI, XI, XII пары черепных нервов (глазодвигательные, добавочный, подъязычный)",
      en: "Topic 9: Cranial Nerves III, IV, VI, XI, XII"
    }
  },
  "sem3_top10": {
    semester: 3,
    order: 10,
    title: {
      uz: "10-Mavzu: V juft bosh miya nervi (uch shoxli nerv) va parasimpatik tugunlari",
      ru: "Тема 10: V пара черепных нервов (тройничный нерв) и парасимпатические узлы",
      en: "Topic 10: Cranial Nerve V (Trigeminal Nerve) & Autonomic Ganglia"
    }
  },
  "sem3_top11": {
    semester: 3,
    order: 11,
    title: {
      uz: "11-Mavzu: VII, IX, X juft bosh miya nervlari (yuz, til-yutqin, adashgan nerv)",
      ru: "Тема 11: VII, IX, X пары черепных нервов (лицевой, языкоглоточный, блуждающий)",
      en: "Topic 11: Cranial Nerves VII, IX, X (Facial, Glossopharyngeal, Vagus)"
    }
  },
  "sem3_top12": {
    semester: 3,
    order: 12,
    title: {
      uz: "12-Mavzu: Vegetativ nerv tizimi (simpatik va parasimpatik bo‘limlar)",
      ru: "Тема 12: Вегетативная нервная система (симпатический и парасимпатический отделы)",
      en: "Topic 12: Autonomic Nervous System (Sympathetic & Parasympathetic)"
    }
  },
  "sem3_top13": {
    semester: 3,
    order: 13,
    title: {
      uz: "13-Mavzu: Eshituv va muvozanat a’zosi (ichki, o‘rta va tashqi quloq)",
      ru: "Тема 13: Орган слуха и равновесия (наружное, среднее и внутреннее ухо)",
      en: "Topic 13: Organ of Hearing & Equilibrium (Outer, Middle, Inner Ear)"
    }
  }
};
