import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  Activity, 
  Stethoscope, 
  Award, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle, 
  HelpCircle, 
  ShieldAlert,
  Flame,
  User,
  HeartPulse,
  TrendingUp,
  RotateCcw,
  BookOpen,
  Check
} from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';

interface ClinicalCase {
  id: string;
  keyword: string;
  title: Record<string, string>;
  complaint: Record<string, string>;
  history: Record<string, string>;
  vitals: {
    temp: string;
    bp: string;
    pulse: string;
    rr: string; // respiratory rate
  };
  questions: {
    text: Record<string, string>;
    options: Record<string, string[]>;
    correctIndex: number;
    explanation: Record<string, string>;
  }[];
}

interface AnatomyClinicalCasesProps {
  topicTitle: string;
  topicId: string;
}

const CLINICAL_CASES: ClinicalCase[] = [
  {
    id: "basilar_skull_fracture",
    keyword: "kalla",
    title: {
      uz: "Kalla suyagi asosi sinishi (Basilar Skull Fracture)",
      ru: "Перелом основания черепа",
      en: "Basilar Skull Fracture Case Study"
    },
    complaint: {
      uz: "Bemor 24 yoshda, yo'l-transport hodisasidan so'ng hushsiz holatda olib kelindi. Ko'z atrofida simmetrik ko'karishlar ('yenot ko'zlari'), quloq va burundan tiniq suyuqlik (orqa miya suyuqligi) oqishi kuzatilmoqda.",
      ru: "Пациент 24 лет доставлен без сознания после ДТП. Симметричные синяки вокруг глаз ('эффект енота'), выделение прозрачной жидкости (ликворея) из носа и ушей.",
      en: "A 24-year-old male is brought unresponsive after a motor vehicle accident. Physical exam reveals symmetric periorbital ecchymosis ('raccoon eyes') and clear fluid leaking from his nose and ears."
    },
    history: {
      uz: "Voqea guvohlarining aytishicha, bemor mototsikldan yiqilib, boshi bilan asfaltha urilgan. Dubulg'asi bo'lmagan.",
      ru: "По словам свидетелей, пациент упал с мотоцикла и ударился головой о тротуар. Был без защитного шлема.",
      en: "Witnesses state the patient fell off his motorcycle and struck his head on the concrete. He was not wearing a helmet."
    },
    vitals: {
      temp: "36.8 °C",
      bp: "140/90 mmHg",
      pulse: "92 bpm",
      rr: "18 bpm"
    },
    questions: [
      {
        text: {
          uz: "Tiniq suyuqlik oqishi (burun-quloq likvoreyasi) qaysi suyagi shikastlanganini ko'rsatadi?",
          ru: "Ликворея из носа указывает на повреждение какой кости?",
          en: "The leaking CSF fluid from the nose indicates damage to which of the following bones?"
        },
        options: {
          uz: [
            "Tepacha suyagi (Parietal bone)",
            "G'alvirsimon suyakning elaksimon plastinkasi (Cribriform plate of ethmoid bone)",
            "Peshona suyagi (Frontal bone)",
            "Ensa suyagi (Occipital bone)"
          ],
          ru: [
            "Теменная кость (Parietal bone)",
            "Решетчатая пластинка решетчатой кости (Cribriform plate of ethmoid bone)",
            "Лобная кость (Frontal bone)",
            "Затылочная кость (Occipital bone)"
          ],
          en: [
            "Parietal bone",
            "Cribriform plate of the ethmoid bone",
            "Frontal bone scale",
            "Ensa / Occipital bone base"
          ]
        },
        correctIndex: 1,
        explanation: {
          uz: "To'g'ri! G'alvirsimon suyak elaksimon plastinkasining sinishi burun bo'shlig'i va kalla ichki bo'shlig'i o'rtasidagi aloqaga va miya-orqa miya suyuqligi (likvor) burundan oqishiga olib keladi.",
          ru: "Правильно! Перелом решетчатой пластинки нарушает герметичность твердой мозговой оболочки, соединяя полость носа и полость черепа, вызывая ликворею.",
          en: "Correct! The cribriform plate of the ethmoid bone underlies the anterior cranial fossa. A fracture here tears the meninges, leading to CSF rhinorrhea."
        }
      },
      {
        text: {
          uz: "Ko'z atrofidagi simmetrik ko'karishlar ('yenot ko'zlari') qaysi chanoq chuqurchasi singaniga xos ishora?",
          ru: "Симметричные синяки вокруг глаз ('глаза енота') указывают на перелом какой черепной ямки?",
          en: "The symmetric bilateral orbital ecchymosis ('raccoon eyes') is highly specific for a fracture of which fossa?"
        },
        options: {
          uz: [
            "Oldingi kalla chuqurchasi (Anterior cranial fossa)",
            "O'rta kalla chuqurchasi (Middle cranial fossa)",
            "Orqa kalla chuqurchasi (Posterior cranial fossa)",
            "Chakka chuqurchasi (Temporal fossa)"
          ],
          ru: [
            "Передняя черепная ямка (Anterior cranial fossa)",
            "Средняя черепная ямка (Middle cranial fossa)",
            "Задняя черепная ямка (Posterior cranial fossa)",
            "Височная ямка (Temporal fossa)"
          ],
          en: [
            "Anterior cranial fossa",
            "Middle cranial fossa",
            "Posterior cranial fossa",
            "Temporal fossa"
          ]
        },
        correctIndex: 0,
        explanation: {
          uz: "To'g'ri! Oldingi kalla chuqurchasining sinishi ko'z kosasining yuqori devorini shikastlaydi va qonning ko'z atrofi to'qimalariga oqib o'tishiga zamin yaratadi.",
          ru: "Правильно! Перелом костей передней черепной ямки вызывает кровоизлияние, которое стекает в окружающие ткани орбиты глаза.",
          en: "Correct! Fractures of the anterior cranial fossa compromise the orbital roof, allowing blood to extravasate bilaterally into periorbital tissue."
        }
      }
    ]
  },
  {
    id: "humerus_radial_nerve",
    keyword: "yelka",
    title: {
      uz: "Yelka suyagi sinishi va Radial nerv shikastlanishi",
      ru: "Перелом плечевой кости и повреждение лучевого нерва",
      en: "Humerus Fracture & Radial Nerve Injury Study"
    },
    complaint: {
      uz: "19 yoshli talaba qiz muzlab qolgan zinadan yiqilganidan keyin qo'lidagi kuchli og'riq va shish bilan murojaat qildi. O'ng bilak-kaft bo'g'imini yozolmayapti, panjasi osilib qolgan ('osilgan panja').",
      ru: "Пациентка 19 лет жалуется на острую боль и отек правого плеча после падения на льду. Не может разогнуть кисть ('висячая кисть').",
      en: "A 19-year-old female presents with severe pain and swelling in her right arm after slipping on icy stairs. On examination, she is unable to extend her wrist, presenting with 'wrist-drop'."
    },
    history: {
      uz: "Bemor o'ng qo'liga tayanib yiqilgan. shifoxonagacha og'riq sabab o'ng qo'lini harakatlantira olmagan.",
      ru: "Пациентка упала с упором на вытянутую правую руку. До этого травм не имела.",
      en: "The patient fell on an outstretched hand. She reports immediate intense pain in the mid-shaft region of her right humerus."
    },
    vitals: {
      temp: "36.6 °C",
      bp: "120/80 mmHg",
      pulse: "84 bpm",
      rr: "16 bpm"
    },
    questions: [
      {
        text: {
          uz: "Yelka suyagining qaysi qismidagi sinishlar radial nervni bevosita jarohatlaydi?",
          ru: "При переломе какого отдела плечевой кости чаще всего страдает лучевой нерв?",
          en: "A fracture in which part of the humerus is most likely to compromise the radial nerve?"
        },
        options: {
          uz: [
            "Yelka suyagining jarrohlik bo'yni (Surgical neck of humerus)",
            "Yelka suyagining o'rta qismi / tanasi (Mid-shaft body of humerus)",
            "Uchburchaksimon g'adir-budirlik (Deltoid tuberosity)",
            "Yelka suyagining anatomik bo'yni (Anatomical neck)"
          ],
          ru: [
            "Хирургическая шейка плеча (Surgical neck of humerus)",
            "Средняя треть диафиза / тело плечевой кости (Mid-shaft body of humerus)",
            "Дельтовидная бугристость (Deltoid tuberosity)",
            "Анатомическая шейка (Anatomical neck)"
          ],
          en: [
            "Surgical neck of the humerus",
            "Mid-shaft body / spiral groove region",
            "Deltoid tuberosity protrusion",
            "Anatomical neck"
          ]
        },
        correctIndex: 1,
        explanation: {
          uz: "Radial nerv yelka suyagi o'rta qismidagi 'radial nerv egati' (sulcus nervi radialis) bo'ylab suyakka yopishib o'tadi. Shuning uchun o'rta qism singanda nerv osongina eziladi yoki yirtiladi.",
          ru: "Лучевой нерв проходит непосредственно в спиральной борозде (sulcus nervi radialis) средней трети плечевой кости. Переломы диафиза часто повреждают его.",
          en: "Correct! The radial nerve runs in the radial groove (spiral groove) along the posterior aspect of the mid-shaft humerus, predisposing it to injury on fracture."
        }
      },
      {
        text: {
          uz: "Ushbu bemorda o'ng qo'lining qaysi sohasida sezuvchanlik yo'qolishi mumkin?",
          ru: "В какой области будет снижена чувствительность кожи при этом поражении?",
          en: "Where would you expect to find cutaneous sensory deficits in this patient's hand?"
        },
        options: {
          uz: [
            "Kaftning ichki yuzasida (Palmar aspect of small finger)",
            "Kaft orqa yuzasi, bosh va ko'rsatgich barmoq oralig'ida (Dorsal web space between thumb and index finger)",
            "Ko'rsatkich barmog'ining kaft yuzasida (Palmar side of index finger)",
            "Butun bilak yuzasida (Anterior forearm)"
          ],
          ru: [
            "Ладонная поверхность мизинца (Palmar aspect of small finger)",
            "Тыльная сторона кисти между большим и указательным пальцами (Dorsal web space between thumb and index)",
            "Ладонная сторона указательного пальца (Palmar side of index)",
            "Вся ладонная часть предплечья (Anterior forearm)"
          ],
          en: [
            "Palmar surface of the small finger",
            "Dorsal web-space between thumb and index finger",
            "Palmar aspect of index finger tip",
            "Anterior aspect of forearm"
          ]
        },
        correctIndex: 1,
        explanation: {
          uz: "To'g'ri! Radial nerv birinchi va ikkinchi barmoqlar oralig'idagi kaft orqa qismini sezgi tolalari bilan ta'minlaydi (dorsal web space). Bu soha radial nerv sezgisini tekshiruvchi asosiy sohadir.",
          ru: "Чувствительная ветвь лучевого нерва иннервирует кожу тыла кисти в области первого межпальцевого промежутка между большим и указательным пальцами.",
          en: "Correct! The superficial branch of the radial nerve supplies cutaneous sensation to the lateral dorsum of the hand, specifically the first dorsal web-space."
        }
      }
    ]
  },
  {
    id: "lumbar_disc_herniation",
    keyword: "orqa",
    title: {
      uz: "L5-S1 darajasidagi umurtqalararo disk churrasi (Lumbar Disc Herniation)",
      ru: "Грыжа межпозвонкового диска L5-S1",
      en: "Herniated Nucleus Pulposus L5-S1 Case"
    },
    complaint: {
      uz: "45 yoshli quruvchi og'ir yuk ko'targanidan so'ng belida birdan paydo bo'lgan o'tkir og'riq va uning chap oyoq orqa yuzasi bo'ylab to tovongacha tarqalayotganidan (ishiaz) shikoyat qilmoqda. Tovonida biroz uvishish mavjud.",
      ru: "Строитель 45 лет жалуется на внезапную резкую боль в пояснице, иррадиирующую по задней стороне левой ноги до пятки (ишиас). Чувство онемения в стопе.",
      en: "A 45-year-old male construction worker presents with sudden, sharp lower back pain that shoots down the posterior aspect of his left leg to his heel (sciatica). He reports numbness in his little toe."
    },
    history: {
      uz: "Ko'p yillardan beri og'ir yuklarni noto'g'ri egilib ko'taradi. Belida vaqt-vaqti bilan simillagan og'riqlar va charchoq sezar edi.",
      ru: "Многие годы занимается тяжелым физическим трудом, поднимает грузы из наклонного положения.",
      en: "He has spent years lifting heavy concrete blocks from compromising biomechanical angles, and reports chronic mild lower back aches."
    },
    vitals: {
      temp: "36.5 °C",
      bp: "135/85 mmHg",
      pulse: "78 bpm",
      rr: "14 bpm"
    },
    questions: [
      {
        text: {
          uz: "Umurtqalararo diskning qaysi qismi yorilib, orqa miya nervini ezib qo'yadi?",
          ru: "Какая часть межпозвонкового диска пролабирует, сдавливая спинномозговой нерв?",
          en: "Which anatomical structure of the intervertebral disc herniates to compress the nerve root?"
        },
        options: {
          uz: [
            "Fibroz xalqa (Anulus fibrosus)",
            "Pulsatsiyalanuvchi yadro (Nucleus pulposus)",
            "Gialin tog'ay plastinka (Hyaline cartilage)",
            "Sariq boylam (Ligamentum flavum)"
          ],
          ru: [
            "Фиброзное кольцо (Anulus fibrosus)",
            "Пульпозное ядро (Nucleus pulposus)",
            "Гиалиновая пластина (Hyaline cartilage)",
            "Желтая связка (Ligamentum flavum)"
          ],
          en: [
            "Anulus fibrosus outermost layers",
            "Nucleus pulposus gelatinous center",
            "Hyaline cartilage endplate",
            "Ligamentum flavum fibers"
          ]
        },
        correctIndex: 1,
        explanation: {
          uz: "Disk churrasida gelga o'xshash pulpomal yadro (Nucleus pulposus) fibroz halqa (Anulus fibrosus) tolalarining yorilishi oqibatida lateral yoki orqaga chiqadi va nerv tolasini qisadi.",
          ru: "При грыже диска именно желатинообразное пульпозное ядро (Nucleus pulposus) прорывается через разорванные волокна фиброзного кольца и зажимает корешок.",
          en: "Correct! Herniation corresponds to the protrusion of the inner gelatinous nucleus pulposus through a defect or tear in the outer concentric anulus fibrosus."
        }
      },
      {
        text: {
          uz: "Nevrologik tekshiruv vaqtida 'Laseg testi' (Straight Leg Raise) qanday anatomik hodisani baholaydi?",
          ru: "Что анатомически оценивает тест Ласега (натяжения нижних конечностей)?",
          en: "Anatomically, what phenomenon does the constructive 'Straight Leg Raise' (Lasegue's Test) evaluate?"
        },
        options: {
          uz: [
            "Son mushaklarining qisqarish kuchini",
            "Skelet nervlari (Dumg'aza chigali) tolalari tarangligini va unga bo'lgan bosimni",
            "Tizza bo'g'imining harakatchanlik darajasini",
            "Son venalarining varikoz kengayishini"
          ],
          ru: [
            "Силу сокращения четырехглавой мышцы бедра",
            "Натяжение корешков седалищного нерва и степень их сдавливания",
            "Диапазон движений коленного сустава",
            "Варикозное расширение вен бедра"
          ],
          en: [
            "Contractile force of the quadriceps",
            "Sciatic nerve root tension and degree of sub-meningeal friction/compression",
            "Range of knee capsular mobilization",
            "Deep vein patency of femoral vessels"
          ]
        },
        correctIndex: 1,
        explanation: {
          uz: "Oyoqni to'g'ri holatda yuqoriga ko'tarish sciatic (o'tirg'ich) nervini taranglashtiradi va agar uning asosi umurtqa darchasida disk churrasi bilan ezilgan bo'lsa, o'tkir og'riq qo'zg'atadi (ijobiy Laseg alomati).",
          ru: "Прямой подъем ноги натягивает седалищный нерв. Если его корешки (L4-S3) зажаты грыжей, возникает иррадиирующая боль по ходу нерва.",
          en: "Correct! Raising the leg statically stretches the sciatic nerve. Friction or tethering due to a herniated disc causes neuropathic radicular pain."
        }
      }
    ]
  },
  {
    id: "appendicitis",
    keyword: "gib", // also serves as default fallback case
    title: {
      uz: "O'tkir appenditsit (Acute Appendicitis)",
      ru: "Острый аппендицит",
      en: "Acute Appendicitis Clinical Correlation"
    },
    complaint: {
      uz: "Bemor 19 yosh, o'ng chov/qorin sohasidagi o'tkir kuchli og'riq, ko'ngil aynishi, qusish hamda tana haroratining 38.2 °C gacha ko'tarilishi bilan shoshilinch yordamga olib kelindi. Qorin devorini bosganda o'ngda kuchli taranglik va qo'yib yuborgan birdan og'riq (Shetkin-Blyumberg belgisi) aniqlanmoqda.",
      ru: "Пациент 19 лет доставлен по скорой с острой болью в правой подвздошной области, тошнотой, рвотой и повышенной температурой 38.2 °C. Положительный симптом Щеткина-Блюмберга.",
      en: "A 19-year-old student is admitted with acute severe lower right quadrant abdominal pain, nausea, vomiting, and a low-grade fever of 38.2 °C. On palpation, guard rigidness and rebound tenderness (Blumberg sign) is highly positive."
    },
    history: {
      uz: "Og'riq dastlab kindik atrofida boshlangan (visseral og'riq), bir necha soatdan keyin qorinning pastki o'ng qismiga ko'chgan (somatik og'riq).",
      ru: "Боль началась около пупка несколько часов назад, затем сместилась в правую подвздошную ямку.",
      en: "Pain originated around the umbilicus (visceral pain pattern) and subsequently shifted to the right lower quadrant over several hours."
    },
    vitals: {
      temp: "38.2 °C",
      bp: "115/75 mmHg",
      pulse: "98 bpm",
      rr: "20 bpm"
    },
    questions: [
      {
        text: {
          uz: "Ko'richak o'simtasi (appendiks) ko'richakning qaysi anatomik tuzilmalari birlashgan joyidan boshlanadi?",
          ru: "Где именно анатомически начинается аппендикс от слепой кишки?",
          en: "Anatomically, the appendix arises from the cecum at the convergence of which structures?"
        },
        options: {
          uz: [
            "Ko'richak tasmalarining (Teniae coli) uchta uchrashish nuqtasida",
            "Yonbosh-ko'richak qopqog'i ostida (Ileocecal valve)",
            "Chambar ichki burmalarida",
            "Toshsimon o'simtalarda"
          ],
          ru: [
            "Место схождения трех лент ободочной кишки (Teniae coli)",
            "Ниже илеоцекального клапана",
            "Гаустры слепой кишки",
            "Сальниковые отростки"
          ],
          en: [
            "Convergence of the three longitudinal bands (Teniae coli)",
            "Just superior to the ileocecal valve lip",
            "Deepest recess of the mucosal haustra",
            "Epiploic appendages base"
          ]
        },
        correctIndex: 0,
        explanation: {
          uz: "To'g'ri! Appendix vermiformis ko'richakning uchta tasmalarining uchrashgan nuqtasidan boshlanadi. Bu anatomik belgi jarrohlarga operatsiya vaqtida appendiksni tez topishda yordam beradi.",
          ru: "Червеобразный отросток (appendix) отходит от медиально-задней стенки слепой кишки в точке схождения трех свободных мышечных лент (Teniae coli).",
          en: "Correct! The appendix is identified intraoperatively by tracing the three longitudinal muscular bands called teniae coli, which converge at its base."
        }
      },
      {
        text: {
          uz: "Og'riqning kindik atrofidan o'ng chov sohasiga (McBurney nuqtasi) ko'chishining anatomik asosi nimada?",
          ru: "Каковы анатомические причины перемещения боли из околопупочной области в правую подвздошную?",
          en: "What is the neuroanatomical basis for the transition of pain from the periumbilical region to the right lower quadrant?"
        },
        options: {
          uz: [
            "O'simta o'z joyidan siljib qorin pastiga tushishi",
            "Simpatik afferentlardan (visseral og'riq, T10 darajasi) parietal qorin parda sezgisiga (somatik og'riq) o'tishi",
            "Qon bosimining qorin bo'shlig'ida o'zgarishi",
            "Mushaklarning qisqarishi"
          ],
          ru: [
            "Смещение самого аппендикса внутри живота вниз",
            "Переход со стимуляции висцеральных афферентов (T10 дерматом) на париетальную брюшину (соматическая боль)",
            "Изменение перфузии брюшины",
            "Мышечный спазм брюшного пресса"
          ],
          en: [
            "Physical displacement of the inflamed appendix caudalward",
            "Transition from visceral afferent pathway (sympathetic T10 fibers) to parietal peritoneal irritation (somatic afferents)",
            "Intraperitoneal pressure differences",
            "Localized somatic muscle cramps"
          ]
        },
        correctIndex: 1,
        explanation: {
          uz: "To'g'ri! Appendiks shishgan dastlabki bosqichda og'riq visseral bo'lib, sympathetic tolalari orqali T10 orqa miya segmentiga keladi va kindikka tarqaladi. Yallig'lanish parietal qorin pardani (somatik sezgi) qamrab olgandan so'ng og'riq aniq o'ng tomonda seziladi.",
          ru: "Сначала воспаление раздражает висцеральные нервы аппендикса (проекция боли вокруг пупка, дерматом T10). Позже вовлекается пристеночная брюшина, имеющая соматическую иннервацию.",
          en: "Correct! Early distention of the appendix stimulates visceral pain fibers (T10 sympathetic dermatome). Somatic pain shifts locally when the inflamed organ rubs parent parietal peritoneum."
        }
      }
    ]
  }
];

export default function AnatomyClinicalCases({ topicTitle, topicId }: AnatomyClinicalCasesProps) {
  const { language } = useLanguage();
  const [selectedCase, setSelectedCase] = useState<ClinicalCase | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [revealedQuestions, setRevealedQuestions] = useState<Record<number, boolean>>({});
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // Pick suitable case based on keywords in title
  useEffect(() => {
    const titleLower = topicTitle.toLowerCase();
    let matched = CLINICAL_CASES[3]; // fallback to appendicitis default

    for (const c of CLINICAL_CASES) {
      if (titleLower.includes(c.keyword)) {
        matched = c;
        break;
      }
    }
    
    setSelectedCase(matched);
    // Reset states
    setUserAnswers({});
    setRevealedQuestions({});
    setCompleted(false);
    setScore(0);
  }, [topicTitle, topicId]);

  if (!selectedCase) return null;

  const currentT = (obj: Record<string, any>) => {
    return obj[language] || obj['uz'] || '';
  };

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (revealedQuestions[qIdx]) return; // already answered
    
    setUserAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
    setRevealedQuestions(prev => ({ ...prev, [qIdx]: true }));

    const isCorrect = optIdx === selectedCase.questions[qIdx].correctIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Check if everything is answered
    const nextAnswers = { ...userAnswers, [qIdx]: optIdx };
    if (Object.keys(nextAnswers).length === selectedCase.questions.length) {
      setCompleted(true);
    }
  };

  const getAccuracy = () => {
    if (selectedCase.questions.length === 0) return 0;
    return Math.round((score / selectedCase.questions.length) * 100);
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Clinial Cases Banner */}
      <div className="bg-gradient-to-r from-red-500/10 to-indigo-500/10 p-8 rounded-2xl border border-red-500/15 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-full bg-red-400/5 blur-2xl -mr-16" />
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 shrink-0 border border-red-500/20">
          <Stethoscope className="w-8 h-8 animate-pulse text-red-500" />
        </div>
        <div className="space-y-1 text-center md:text-left">
          <span className="text-[10px] font-black tracking-widest text-red-500 uppercase">
            🩺 {{ uz: "KLINIK-PATOLOGIK TAHLILLAR", ru: "КЛИНИЧЕСКИЙ РАЗБОР", en: "CLINICAL CASE ANALYSIS" }[language] || "CLINICAL CASE"}
          </span>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
            {currentT(selectedCase.title)}
          </h2>
          <p className="text-xs text-slate-400 font-semibold max-w-xl">
            { { uz: "Nisbiy klinik vaziyatlarni o'rganish orqali anatomik bilimlarni amaliy tibbiyotda qo'llashni shakllantiring.", ru: "Укрепляйте клиническое мышление, решая реальные медицинские кейсы на стыке анатомии и патологии.", en: "Reinforce clinical reasoning by applying anatomical principles to diagnose authentic patient simulations." }[language] }
          </p>
        </div>
      </div>

      {/* Case Sheet Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Middle Clinical Case File Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-50 to-white border border-slate-200/60 rounded-2xl p-8 shadow-sm flex flex-col gap-6 relative">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-100/80 flex items-center justify-center text-slate-500 text-xs">
                <User size={16} />
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 block uppercase tracking-wider">PATIENT ENCOUNTER</span>
                <span className="text-xs font-bold text-slate-700">Anamnesis Morbi</span>
              </div>
            </div>
            
            <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-3 py-1 border border-indigo-100 rounded-lg">
              CASESHEET: #{selectedCase.id.toUpperCase().substring(0, 8)}
            </span>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <h4 className="text-xs font-black text-[#dc2626] uppercase tracking-wider">1. Complaint on Admission (Shikoyati):</h4>
              <p className="text-sm font-bold text-slate-800 leading-relaxed bg-white border border-slate-100/80 p-4 rounded-xl shadow-inner italic">
                "{currentT(selectedCase.complaint)}"
              </p>
            </div>

            <div className="space-y-1.5 pt-2">
              <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">2. History of Present Illness (Anamnez):</h4>
              <p className="text-xs font-bold text-slate-500 leading-relaxed pl-3.5 border-l-2 border-indigo-200">
                {currentT(selectedCase.history)}
              </p>
            </div>
          </div>
        </div>

        {/* Right side: Patient Vitals Table Monitor */}
        <div className="bg-slate-950 p-6 md:p-8 rounded-2xl text-slate-400 font-mono flex flex-col gap-5 border border-slate-800 shadow-xl shadow-slate-950/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl -mr-10" />
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-emerald-500">
              <HeartPulse className="w-4 h-4 animate-pulse" />
              <span className="text-xxs font-black tracking-widest uppercase">PATIENT MONITOR</span>
            </div>
            <span className="text-[9px] text-[#4f46e5] font-black animate-pulse">● LIVE STATUS</span>
          </div>

          <div className="flex-grow flex flex-col justify-between gap-4">
            <div className="flex justify-between items-center border-b border-slate-900/50 pb-2">
              <span className="text-[10px] font-bold">TEMP (Harorat)</span>
              <span className="text-lg font-black text-emerald-400">{selectedCase.vitals.temp}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-900/50 pb-2">
              <span className="text-[10px] font-bold">SYS/DIA BP (Qon b.)</span>
              <span className="text-lg font-black text-[#5ce1e6]">{selectedCase.vitals.bp}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-900/50 pb-2">
              <span className="text-[10px] font-bold">PULSE RATE (Pul's)</span>
              <span className="text-lg font-black text-amber-500">{selectedCase.vitals.pulse}</span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="text-[10px] font-bold">RS RATE (Nafas)</span>
              <span className="text-lg font-black text-[#ff8fb2]">{selectedCase.vitals.rr}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-900/50 border border-slate-800/80 rounded-xl text-[9px] text-slate-500 text-center font-sans tracking-wide leading-relaxed">
            Monitor conforms to standard ICU virtual simulation profiles.
          </div>
        </div>
      </div>

      {/* Interactive Diagnostics Drill Board */}
      <div className="space-y-6 pt-4 border-t border-slate-100">
        <h3 className="text-base font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle size={18} className="text-[#4f46e5]" />
          {{ uz: "Vaziyatli Anatomik Savollar", ru: "Ситуационные вопросы", en: "Anatomical Case Questions" }[language] || "Anatomical Questions"}
        </h3>

        <div className="space-y-8">
          {selectedCase.questions.map((q, qIdx) => {
            const hasAnswered = revealedQuestions[qIdx];
            const answer = userAnswers[qIdx] ?? -1;
            const isCorrectAnswer = answer === q.correctIndex;

            return (
              <div 
                key={qIdx}
                className={`bg-white p-6 md:p-8 rounded-2xl border transition-all duration-300 ${
                  hasAnswered 
                    ? isCorrectAnswer 
                      ? 'border-emerald-200 bg-emerald-50/5' 
                      : 'border-red-200 bg-red-50/5'
                    : 'border-slate-150 hover:border-slate-350 shadow-sm'
                }`}
              >
                {/* Question Text */}
                <div className="flex items-start gap-3 mb-6">
                  <span className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center font-black text-indigo-600 text-xs shrink-0 mt-0.5">
                    Q{qIdx + 1}
                  </span>
                  <p className="text-sm md:text-base font-extrabold text-slate-800">
                    {currentT(q.text)}
                  </p>
                </div>

                {/* Multiple Options list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentT(q.options).map((opt: string, optIdx: number) => {
                    const isSelected = answer === optIdx;
                    const isThisCorrectOption = optIdx === q.correctIndex;

                    let btnClass = 'border-slate-150 hover:border-indigo-400 hover:bg-slate-50';
                    if (hasAnswered) {
                      if (isThisCorrectOption) {
                        btnClass = 'border-emerald-500 bg-emerald-500/10 text-emerald-800 font-extrabold';
                      } else if (isSelected) {
                        btnClass = 'border-red-500 bg-red-500/10 text-red-800 font-extrabold line-through';
                      } else {
                        btnClass = 'border-slate-100 opacity-50';
                      }
                    }

                    return (
                      <button 
                        key={optIdx}
                        disabled={hasAnswered}
                        onClick={() => handleSelectOption(qIdx, optIdx)}
                        className={`text-left p-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-between gap-3 ${btnClass} ${!hasAnswered && 'cursor-pointer'}`}
                      >
                        <span>{opt}</span>
                        {hasAnswered && isThisCorrectOption && (
                          <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                        )}
                        {hasAnswered && isSelected && !isThisCorrectOption && (
                          <AlertCircle className="w-4.5 h-4.5 text-red-550 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Question Explanation */}
                <AnimatePresence>
                  {hasAnswered && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6 p-4 bg-slate-50 border border-slate-150 rounded-xl text-xs text-slate-600 leading-relaxed"
                    >
                      <div className="flex items-start gap-2.5">
                        <ShieldAlert className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-black text-slate-700 uppercase tracking-wide">
                            {{ uz: "Klinik Tahlil: ", ru: "Клинический разбор: ", en: "Anatomical Correlation: " }[language] || "Anatomical correlation: "}
                          </strong>
                          <span>{currentT(q.explanation)}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Case Completed Summary */}
      <AnimatePresence>
        {completed && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 bg-brand-primary text-white rounded-[32px] text-center flex flex-col gap-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-44 h-44 bg-brand-accent/5 rounded-bl-[100px] mb-[-40px]" />
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-[#FFD700] border border-white/10 mx-auto shadow-md">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white leading-none">
                {{ uz: "Ushbu keys muvaffaqiyatli tahlil etildi!", ru: "Кейс успешно разобран!", en: "Case Study Complete!" }[language] || "Case Complete!"}
              </h3>
              <p className="text-slate-400 font-bold text-xs">
                {{ uz: "Klinik kognitiv fikrlash va qiyosiy tashxislash bo'yicha mustahkam ko'nikmaga ega bo'ldingiz.", ru: "Вы продемонстрировали отличные навыки клинической оценки и анализа симптоматики.", en: "You have verified essential anatomical pathology correlations and medical biomarkers." }[language]}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto w-full border-t border-white/5 pt-4">
              <div className="p-3.5 bg-slate-900/50 border border-white/5 rounded-xl text-center">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Accuracy (To'g'rilik)</span>
                <span className="text-lg font-black text-brand-accent block mt-1">{getAccuracy()}%</span>
              </div>
              <div className="p-3.5 bg-slate-900/50 border border-white/5 rounded-xl text-center">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block">Award Points (Klinik Ball)</span>
                <span className="text-lg font-black text-emerald-400 block mt-1">+10 pts</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
