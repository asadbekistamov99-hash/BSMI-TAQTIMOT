import { Quiz } from '../types';
import { SEMESTER_1_QUIZZES } from './quizDataSemester1';
import { SEMESTER_2_QUIZZES } from './quizDataSemester2';
import { SEMESTER_3_QUIZZES } from './quizDataSemester3';

export interface CuratedTopicQuiz {
  topicOrder: number; // 1 to 26, or 101 to 113
  topicKeywords: string[];
  quizzes: {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
  }[];
}

export const ALL_CURATED_QUIZZES: CuratedTopicQuiz[] = [
  ...SEMESTER_1_QUIZZES,
  ...SEMESTER_2_QUIZZES,
  ...SEMESTER_3_QUIZZES
];

export const TOPIC_CURATED_QUIZZES: CuratedTopicQuiz[] = [
  // TOPIC 1: Umurtqa pog‘onasi & Terminologiya
  {
    topicOrder: 1,
    topicKeywords: ["terminologiya", "umurtqa", "vertebra", "sath"],
    quizzes: [
      {
        question: "Inson tanasini o'ng va chap teng bo'laklarga bo'luvchi anatomik sath qanday ataladi?",
        options: ["Planum sagittale (medianum)", "Planum frontale", "Planum transversale", "Planum horizontale"],
        correctAnswerIndex: 0,
        explanation: "Planum medianum (o'rta sagittal sath) tanani vertikal ravishda simmetrik o'ng va chap yarimlarga bo'ladi."
      },
      {
        question: "Bo'yin umurtqalariga (vertebrae cervicales) xos bo'lgan asosiy anatomik belgi qaysi?",
        options: ["Ko'krak qovurg'a chuqurchasi", "Processus transversus'da foramen transversarium teshigi borligi", "Massiv va yirik tanaga egaligi", "Processus spinosus'ning juft emasligi"],
        correctAnswerIndex: 1,
        explanation: "Bo'yin umurtqalarining ko'ndalang o'simtasida (processus transversus) umurtqa arteriyasi o'tadigan foramen transversarium mavjud."
      },
      {
        question: "Birinchi bo'yin umurtqasi (Atlas - C1) tana qismiga (corpus) ega emas. U nimadan tashkil topgan?",
        options: ["Faqat processus spinosus'dan", "Arcus anterior va arcus posterior (oldingi va orqa yoylar) hamda massa lateralis", "Gubkasimon suyak blokidan", "Faqat bo'g'im o'simtalaridan"],
        correctAnswerIndex: 1,
        explanation: "Atlas umurtqa tanasiga ega emas, u oldingi (arcus anterior) va orqa yoy (arcus posterior) hamda yon massalardan (massa lateralis) iborat."
      },
      {
        question: "Dumg'aza suyagi (Os sacrum) nechta umurtqaning o'zaro birikib ketishidan hosil bo'ladi?",
        options: ["3-4 ta", "5 ta", "7 ta", "12 ta"],
        correctAnswerIndex: 1,
        explanation: "Dumg'aza suyagi (Os sacrum) 18-25 yoshga kelib 5 ta sacral umurtqalarning (S1-S5) o'zaro sinostoz birikishidan hosil bo'ladi."
      },
      {
        question: "Umurtqa pog'onasining bel qismidagi fiziologik curvature (egrilik) qanday ataladi?",
        options: ["Kifoz (Kyphosis)", "Lordoz (Lordosis)", "Skolioz (Scoliosis)", "Gipoplaziya"],
        correctAnswerIndex: 1,
        explanation: "Bel va bo'yin qismlaridagi oldinga qaragan fiziologik egrilik Lordoz (Lordosis) deyiladi."
      }
    ]
  },

  // TOPIC 2: Qovurg‘alar, Kurak, To‘sh, O‘mrov
  {
    topicOrder: 2,
    topicKeywords: ["qovurg'a", "kurak", "to'sh", "o'mrov", "costa", "scapula", "sternum", "clavicula"],
    quizzes: [
      {
        question: "To'sh suyagiga (Sternum) to'g'ridan-to'g'ri o'z tog'ayi bilan birikadigan haqiqiy qovurg'alar (Costae verae) qaysilar?",
        options: ["1-7 juft qovurg'alar", "8-10 juft qovurg'alar", "11-12 juft qovurg'alar", "Faqat 1-3 juft qovurg'alar"],
        correctAnswerIndex: 0,
        explanation: "1-7 juft qovurg'alar (Costae verae) o'z tog'aylari orqali to'g'ridan-to me'yorda to'sh suyagiga birikadi."
      },
      {
        question: "Kurak suyagining (Scapula) orqa yuzasidagi do'ng tizma (spina scapulae) qaysi o'simta bilan tugaydi?",
        options: ["Processus coracoideus", "Acromion", "Processus styloideus", "Tuberculum majus"],
        correctAnswerIndex: 1,
        explanation: "Spina scapulae lateral tomonga yo'nalib, akromion (Acromion) o'simtasiga o'tadi va o'mrov suyagi bilan bo'g'im hosil qiladi."
      },
      {
        question: "To'sh suyagi (Sternum) anatomik jihatdan qaysi qismlardan iborat?",
        options: ["Manubrium, corpus sterni, processus xiphoideus", "Spina, acromion, fossa", "Caput, collum, corpus", "Basis, apex, facies"],
        correctAnswerIndex: 0,
        explanation: "To'sh suyagi dasta (manubrium sterni), tana (corpus sterni) va xanjarsimon o'simta (processus xiphoideus) qismlaridan iborat."
      },
      {
        question: "Yetakchi (1-qovurg'a - Costa prima) ning yuqori yuzasida qaysi mushak g'adir-budirligi (tuberculum) joylashgan?",
        options: ["Tuberculum m. scaleni anterioris (Lisfrank g'adir-budirligi)", "Tuberculum m. latissimi dorsi", "Tuberculum m. pectoralis majoris", "Tuberculum m. subclavii"],
        correctAnswerIndex: 0,
        explanation: "1-qovurg'a ustki yuzasida oldingi narvonsimon mushak birikadigan Tuberculum musculi scaleni anterioris joylashgan."
      }
    ]
  },

  // TOPIC 3: Yelka, Bilak, Tirsak va Qo'l panja suyaklari
  {
    topicOrder: 3,
    topicKeywords: ["yelka", "bilak", "tirsak", "humerus", "radius", "ulna", "carpus"],
    quizzes: [
      {
        question: "Yelka suyagining (Humerus) anatomik bo'ynidan (collum anatomicum) tashqari eng ko'p sinadigan va xavfli qismi qaysi?",
        options: ["Collum chirurgicum (xirurgik bo'yin)", "Caput humeri", "Epicondylus medialis", "Trochlea humeri"],
        correctAnswerIndex: 0,
        explanation: "Yelka suyagi tanasi va distal uchi tutashgan Collum chirurgicum (xirurgik bo'yin) eng ko'p sinishga moyil zaif sohadir."
      },
      {
        question: "Tirsak suyagining (Ulna) proksimal uchida joylashgan yirik, orqadagi o'simta qanday ataladi?",
        options: ["Olecranon (tirsak o'simtasi)", "Processus coronoideus", "Processus styloideus", "Tuberositas radii"],
        correctAnswerIndex: 0,
        explanation: "Olecranon — tirsak suyagining orqada joylashgan yirik o'simtasi bo'lib, m. triceps brachii payi birikadi."
      },
      {
        question: "Bilak kaft usti suyaklarining (Ossa carpi) proksimal qatoriga qaysi suyak kirmaydi?",
        options: ["Os scaphoideum", "Os lunatum", "Os triquetrum", "Os hamatum"],
        correctAnswerIndex: 3,
        explanation: "Os hamatum (ilgaksimon suyak) bilak kaft usti suyaklarining distal qatoriga kiradi. Proksimal qatorda scaphoideum, lunatum, triquetrum va pisiforme bor."
      },
      {
        question: "Yelka suyagi tanasi (corpus humeri) bo'ylab qaysi nerv egati (sulcus) o'tadi?",
        options: ["Sulcus nervi radialis (bilak nervi egati)", "Sulcus nervi ulnaris", "Sulcus nervi mediani", "Sulcus nervi axillaris"],
        correctAnswerIndex: 0,
        explanation: "Corpus humeri'ning orqa va lateral yuzasida spiral shakldagi Sulcus nervi radialis (canalis humeromuscularis) joylashgan."
      }
    ]
  },

  // TOPIC 4: Chanoq, Son, Boldir va Oyoq panja suyaklari
  {
    topicOrder: 4,
    topicKeywords: ["chanoq", "son", "boldir", "femur", "tibia", "fibula", "os coxae"],
    quizzes: [
      {
        question: "Chanoq suyagi (Os coxae) qaysi uchta alohida suyakning o'zaro sinostoz birikishidan hosil bo'ladi?",
        options: ["Os ilium, os ischii, os pubis", "Sacrum, coccyx, femur", "Patella, tibia, fibula", "Talus, calcaneus, cuboideum"],
        correctAnswerIndex: 0,
        explanation: "Chanoq suyagi yonbosh (os ilium), o'tirg'ich (os ischii) va qov (os pubis) suyaklarining sirka kosachasi (acetabulum) sohasida birikishidan hosil bo'ladi."
      },
      {
        question: "Son suyagining (Femur) proksimal uchidagi yirik lateral bo'rtiq qanday ataladi?",
        options: ["Trochanter major", "Trochanter minor", "Condylus medialis", "Epicondylus lateralis"],
        correctAnswerIndex: 0,
        explanation: "Trochanter major (katta ko'rich) son suyagi boynagining lateral tomonida joylashgan va tos mushaklari birikadigan bo'rtiqdir."
      },
      {
        question: "Boldirning ichki (medial) va asosiy og'irlik ko'taruvchi suyagi qaysi?",
        options: ["Tibia (Katta boldir suyagi)", "Fibula (Kichik boldir suyagi)", "Femur", "Patella"],
        correctAnswerIndex: 0,
        explanation: "Tibia (katta boldir suyagi) boldirning medialida joylashgan yo'g'on suyak bo'lib, gavda og'irligini oyoq panjasiga o'tkazadi."
      },
      {
        question: "Oyoq kaft usti suyaklarining (Ossa tarsi) eng yirik suyagi qaysi?",
        options: ["Calcaneus (Oshiq-tovon suyagi / Tovon suyagi)", "Talus", "Os naviculare", "Os cuboideum"],
        correctAnswerIndex: 0,
        explanation: "Calcaneus (tovon suyagi) tarsus suyaklarining eng yirigi bo'lib, tovon do'ngligini (tuber calcanei) hosil qiladi."
      }
    ]
  },

  // TOPIC 5: Kalla suyaklari (Ensa, Tepa, Peshona, Chakka, Ponasimon)
  {
    topicOrder: 5,
    topicKeywords: ["kalla", "ensa", "tepa", "peshona", "chakka", "ponasimon", "occipitale", "frontale", "sphenoidale"],
    quizzes: [
      {
        question: "Ensa suyagidagi (Os occipitale) orqa miya va bosh miyani tutashtiruvchi eng yirik teshik qanday ataladi?",
        options: ["Foramen magnum", "Foramen jugulare", "Foramen ovale", "Foramen rotundum"],
        correctAnswerIndex: 0,
        explanation: "Foramen magnum (katta ensa teshigi) ensa suyagi tangasi, yon qismlari va tubi orasida joylashgan yirik teshikdir."
      },
      {
        question: "Ponasimon suyakning (Os sphenoidale) gipofiz bezi joylashadigan chuqurchasi nima deyiladi?",
        options: ["Sella turcica (Turk egari - Fossa hypophysialis)", "Fossa cranii media", "Sulcus chiasmatis", "Foramen spinosum"],
        correctAnswerIndex: 0,
        explanation: "Ponasimon suyak tanasi ustki yuzasida Turk egari (Sella turcica) joylashgan va uning markaziy chuqurchasida gipofiz bezi joy oladi."
      },
      {
        question: "Chakka suyagining (Os temporale) eshitish va muvozanat a'zolari joylashgan eng qattiq qismi qaysi?",
        options: ["Pyramis (Pars petrosa)", "Pars squamosa", "Pars tympanica", "Processus mastoideus"],
        correctAnswerIndex: 0,
        explanation: "Pyramis (Piramida yoki toshsimon qism) ichida ichki va o'rta quloq tuzilmalari joylashgan juda mustahkam suyak qismidir."
      }
    ]
  },

  // TOPIC 6: Kallaning miya va yuz qismi, Ko'z kosasi, Burun va Og'iz bo'shlig'i
  {
    topicOrder: 6,
    topicKeywords: ["ko'z kosasi", "burun", "og'iz", "neurocranium", "viscerocranium", "orbita"],
    quizzes: [
      {
        question: "Ko'z kosasining (Orbita) yuqori devorini hosil qilishda qaysi suyak qatnashadi?",
        options: ["Os frontale va os sphenoidale (ala minor)", "Maxilla va os palatinum", "Os zygomaticum", "Os lacrimale"],
        correctAnswerIndex: 0,
        explanation: "Ko'z kosasining yuqori devorini (paries superior) peshona suyagining pars orbitalis va ponasimon suyagining kichik qanoti hosil qiladi."
      },
      {
        question: "Burun bo'shlig'ining (Cavitas nasi) lateral devoridagi qaysi burun chig'anog'i (concha nasalis) alohida mustaqil suyak hisoblanadi?",
        options: ["Concha nasalis inferior", "Concha nasalis superior", "Concha nasalis media", "Concha nasalis suprema"],
        correctAnswerIndex: 0,
        explanation: "Concha nasalis inferior alohida yuz suyagi bo'lsa, superior va media chig'anoqlar g'alvirsimon suyakning (os ethmoidale) qismlaridir."
      }
    ]
  },

  // TOPIC 7: Chakka osti va qanot-tanglay chuqurchalari, Bolalarda kalla
  {
    topicOrder: 7,
    topicKeywords: ["chakka osti", "qanot-tanglay", "fossa infratemporalis", "pterygopalatine", "fontanella"],
    quizzes: [
      {
        question: "Chaqaloqlarda peshona va tepa suyaklari kesishgan joyida eng yirik, kech berkitiladigan emak (fontanella) qaysi?",
        options: ["Fonticulus anterior (oldingi emak)", "Fonticulus posterior", "Fonticulus sphenoidalis", "Fonticulus mastoideus"],
        correctAnswerIndex: 0,
        explanation: "Fonticulus anterior (oldingi yoki rombsimon emak) 1.5 - 2 yoshgacha ochiq bo'lib, suyaklanish jarayonini kuzatish imkonini beradi."
      },
      {
        question: "Qanot-tanglay chuqurchasi (Fossa pterygopalatine) kalla suyagi ichki o'rta chuqurchasi bilan qaysi teshik orqali tutashadi?",
        options: ["Foramen rotundum", "Foramen ovale", "Foramen spinosum", "Foramen lacerum"],
        correctAnswerIndex: 0,
        explanation: "Foramen rotundum orqali ponasimon suyakdan uch shoxli nervning 2-shoxi (n. maxillaris) qanot-tanglay chuqurchasiga o'tadi."
      }
    ]
  },

  // TOPIC 8: Umurtqalar, Ko'krak qafasi va Yelka kamari birlashuvlari
  {
    topicOrder: 8,
    topicKeywords: ["birlashuv", "discus", "articulatio", "humeri", "cubiti"],
    quizzes: [
      {
        question: "Umurtqalar tanalari orasida joylashgan va amortizatsiya vazifasini bajaruvchi tog'ay disk qanday qismlardan iborat?",
        options: ["Anulus fibrosus va nucleus pulposus", "Capsula articularis va synovia", "Ligamentum flavum va lig. nuchae", "Meniscus va labrum"],
        correctAnswerIndex: 0,
        explanation: "Umurtqalararo disk (Discus intervertebralis) tashqi fibroz halqa (anulus fibrosus) va markaziy pulpoz mag'izdan (nucleus pulposus) iborat."
      },
      {
        question: "Yelka bo'g'imi (Articulatio humeri) harakat doirasi va shakliga ko'ra qaysi turga kiradi?",
        options: ["Articulatio spheroidea (sharsimon bo'g'im, ko'p o'qli)", "Articulatio ginglymus (g'altaksimon)", "Articulatio sellaris (egarsimon)", "Articulatio elipsoidea (ellipssimon)"],
        correctAnswerIndex: 0,
        explanation: "Articulatio humeri sharsimon (spheroidea) bo'g'im bo'lib, inson tanasidagi eng harakatchan 3 o'qli bo'g'imdir."
      }
    ]
  },

  // TOPIC 9: Chanoq, Son, Jag' bo'g'imlari va Rentgen
  {
    topicOrder: 9,
    topicKeywords: ["chanoq-son", "bo'g'im", "articulatio coxae", "genus", "temporomandibularis"],
    quizzes: [
      {
        question: "Chanoq-son bo'g'imi (Articulatio coxae) ichida joylashgan va son suyagi boshchasiga qon tomir olib kiruvchi boylam qaysi?",
        options: ["Ligamentum capitis femoris", "Ligamentum iliofemorale", "Ligamentum pubofemorale", "Ligamentum ischiofemorale"],
        correctAnswerIndex: 0,
        explanation: "Ligamentum capitis femoris boylami ichida a. capitis femoris tomiri o'tib, son suyagi boshchasini qon bilan ta'minlaydi."
      },
      {
        question: "Tiz bo'g'imida (Articulatio genus) bo'g'im yuzalarining mosligini (kongruentlik) ta'minlovchi tog'ay hosilalar nima deyiladi?",
        options: ["Meniscus medialis va meniscus lateralis", "Labrum acetabulare", "Discus articularis", "Bursa praepatellaris"],
        correctAnswerIndex: 0,
        explanation: "Tiz bo me'yordagi medial va lateral menisklar bo'g me'yoriy yuzalar mosligini oshirib, zarbani yumshatadi."
      }
    ]
  },

  // TOPIC 10: Ko'krak, Diafragma va Qorin mushaklari
  {
    topicOrder: 10,
    topicKeywords: ["ko'krak", "diafragma", "qorin", "diaphragma", "rectus abdominis", "canalis inguinalis"],
    quizzes: [
      {
        question: "Diafragmadagi (Diaphragma) aorta qon tomiri hamda ko'krak limfa yo'li o'tadigan teshik qaysi?",
        options: ["Hiatus aorticus", "Hiatus esophageus", "Foramen venae cavae", "Foramen morgagni"],
        correctAnswerIndex: 0,
        explanation: "Hiatus aorticus T12 umurtqa darajasida joylashgan bo'lib, u orqali aorta va ductus thoracicus o'tadi."
      },
      {
        question: "Chov kanali (Canalis inguinalis) erkaklarda qaysi anatomik tuzilmani o'z ichiga oladi?",
        options: ["Funiculus spermaticus (Urug' tizimchasi)", "Ligamentum teres uteri", "Nervus femoralis", "Arteria iliaca externa"],
        correctAnswerIndex: 0,
        explanation: "Chov kanali ichidan erkaklarda urug' tizimchasi (funiculus spermaticus), ayollarda esa bachadonning yumaloq boylami o'tadi."
      }
    ]
  },

  // TOPIC 11: Bo'yin va Bosh (Chaynov/Mimika) mushaklari
  {
    topicOrder: 11,
    topicKeywords: ["bo'yin", "bosh", "chaynov", "mimika", "masseter", "sternocleidomastoideus"],
    quizzes: [
      {
        question: "To'sh-o'mrov-so'rg'icsimon mushak (m. sternocleidomastoideus) bir tomonlama qisqarganda qanday harakat bajariladi?",
        options: ["Boshni o'z tomoniga egadi, yuzni qarama-qarshi tomonga buradi", "Boshni orqaga bukaydi", "Jag'ni pastga tushiradi", "Yutish harakatini bajaradi"],
        correctAnswerIndex: 0,
        explanation: "M. sternocleidomastoideus bir tomonlama qisqarganda boshni o'z tomoniga yonboshlatib, yuzni qarama-qarshi tomonga buradi."
      },
      {
        question: "Chaynov mushaklariga (musculi masticatorii) qaysi nerv innervatsiya beradi?",
        options: ["Nervus trigeminus (n. mandibularis - V3)", "Nervus facialis (VII)", "Nervus glossopharyngeus (IX)", "Nervus vagus (X)"],
        correctAnswerIndex: 0,
        explanation: "Chaynov mushaklari (masseter, temporalis, pterygoideus medialis/lateralis) uch shoxli nervning 3-shoxi n. mandibularis orqali innervatsiya qilinadi."
      }
    ]
  },

  // TOPIC 12: Orqa, Yelka va Qo'l mushaklari
  {
    topicOrder: 12,
    topicKeywords: ["orqa", "yelka", "bilak", "trapezius", "biceps", "triceps"],
    quizzes: [
      {
        question: "Yelkaning oldingi guruhidagi ikki boshli mushak (m. biceps brachii) qanday asosiy harakatni bajaradi?",
        options: ["Tirsak bo'g'imida qo'lni bukish va bilakni supinatsiya qilish", "Tirsakda qo'lni yozish (extensio)", "Yelkani ichkariga burish", "Barmoqlarni bukish"],
        correctAnswerIndex: 0,
        explanation: "M. biceps brachii tirsak bo'g'imida bilakni bukuvchi (flexio) hamda kuchli supinator hisoblanadi."
      },
      {
        question: "Orqaning eng yuzaki yirik mushaklari qaysilar?",
        options: ["M. trapezius va m. latissimus dorsi", "M. rhomboideus va m. levator scapulae", "M. erector spinae", "M. splenius capitis"],
        correctAnswerIndex: 0,
        explanation: "M. trapezius va m. latissimus dorsi orqa yuzasini qoplagan eng keng yuzaki mushaklardir."
      }
    ]
  },

  // TOPIC 13: Chanoq, Son va Boldir mushaklari
  {
    topicOrder: 13,
    topicKeywords: ["chanoq", "son", "boldir", "gluteus", "quadriceps", "gastrocnemius"],
    quizzes: [
      {
        question: "Sonning oldingi guruhida joylashgan va tiz bo'g'imida oyoqni yozuvchi eng yirik mushak qaysi?",
        options: ["M. quadriceps femoris (Sonning to'rt boshli mushagi)", "M. biceps femoris", "M. sartorius", "M. gracilis"],
        correctAnswerIndex: 0,
        explanation: "M. quadriceps femoris (rectus femoris, vastus medialis, lateralis, intermedius) tiz bo'g'imida boldirni yozuvchi asosiy mushakdir."
      },
      {
        question: "Inson tanasidagi eng uzun tasmali mushak qaysi?",
        options: ["M. sartorius (Tikuvchi mushak)", "M. gracilis", "M. tensor fasciae latae", "M. semitendinosus"],
        correctAnswerIndex: 0,
        explanation: "M. sartorius (tikuvchi mushak) yonbosh suyagining spina iliaca anterior superior qismidan boshlanib boldirgacha boruvchi eng uzun mushakdir."
      }
    ]
  },

  // TOPIC 14: Og'iz bo'shlig'i, Tishlar, Til, Halqum, Qizilo'ngach
  {
    topicOrder: 14,
    topicKeywords: ["og'iz", "tish", "til", "halqum", "qizilo'ngach", "lingua", "pharynx", "esophagus"],
    quizzes: [
      {
        question: "Kattalarda doimiy tishlar formulasi qanday ketma-ketlikda ifodalanadi?",
        options: ["2 kesuvchi, 1 qoziq, 2 kichik oziq, 3 katta oziq (2.1.2.3)", "2 kesuvchi, 2 qoziq, 1 kichik oziq, 2 katta oziq", "3 kesuvchi, 1 qoziq, 2 kichik oziq, 2 katta oziq", "1 kesuvchi, 2 qoziq, 3 kichik oziq, 2 katta oziq"],
        correctAnswerIndex: 0,
        explanation: "Har bir jag' choragida 2 ta incisivi, 1 ta caninus, 2 ta premolares va 3 ta molares (jami 32 ta tish) bo'ladi."
      },
      {
        question: "Til ildizida 'V' harfi shaklida joylashgan va ta'm biluvchi eng yirik so'rg'ichlar qaysilar?",
        options: ["Papillae vallatae (Devor bilan o'ralgan so'rg'ichlar)", "Papillae fungiformes", "Papillae filiformes", "Papillae foliatae"],
        correctAnswerIndex: 0,
        explanation: "Papillae vallatae til tanasi va ildizi chegarasida V-simon joylashgan va achchiq ta'm sezuvchi yirik so'rg'ichlardir."
      }
    ]
  },

  // TOPIC 15: Qorin a'zolari: Oshqozon, Ichak, Jigar, O't pufagi, O.O. Bezi
  {
    topicOrder: 15,
    topicKeywords: ["oshqozon", "ichak", "jigar", "o't pufagi", "pancreas", "gaster", "hepar"],
    quizzes: [
      {
        question: "Oshqozonning (Gaster) qizilo'ngachga o'tish sohasi va o'n ikki barmoqli ichakka o me'yorda chiqish sohasi mos ravishda qanday ataladi?",
        options: ["Pars cardiaca va Pylorus (chiquvchi darvoza)", "Fundus va Corpus", "Curvatura major va Curvatura minor", "Anatrum va Bulbus"],
        correctAnswerIndex: 0,
        explanation: "Oshqozonga kirish qismi pars cardiaca, o'n ikki barmoqli ichakka o'tuvchi klapanli qismi esa pylorus deyiladi."
      },
      {
        question: "Jigar darvozasida (Porta hepatis) qaysi uchta muhim anatomik tuzilma joylashgan (Jigar triada / Glisson triadasi)?",
        options: ["Vena portae, arteria hepatica propria, ductus hepaticus communis", "Vena cava inferior, a. gastrica, ductus choledochus", "Vena renalis, a. celiaca, ductus pancreaticus", "Vena mesenterica, a. lienalis, ductus cysticus"],
        correctAnswerIndex: 0,
        explanation: "Jigar darvozasidan vena portae va a. hepatica propria kiradi, ductus hepaticus communis esa o't yo'li sifatida chiqadi."
      }
    ]
  },

  // TOPIC 16: Qorin pardasi va Topografiya
  {
    topicOrder: 16,
    topicKeywords: ["qorin pardasi", "peritoneum", "omentum", "retroperitoneal"],
    quizzes: [
      {
        question: "Qorin pardasining (Peritoneum) a'zoni har tomondan to'liq o'rab olish holati qanday deyiladi?",
        options: ["Intraperitoneal", "Mesoperitoneal", "Retroperitoneal (Ekstraperitoneal)", "Subperitoneal"],
        correctAnswerIndex: 0,
        explanation: "Intraperitoneal joylashuvda organ har tomondan peritoneum bilan qoplanadi (masalan, ingichka ichak, oshqozon)."
      },
      {
        question: "Katta sharf (Omentum majus) qorin pardasining qaysi buklamasidan hosil bo'ladi va nechta varaqdan iborat?",
        options: ["Oshqozonning katta egriligidan tushuvchi 4 varaq peritoneum", "Jigardan tushuvchi 2 varaq", "Qora taloqdan 3 varaq", "Ichak tutqichidan 2 varaq"],
        correctAnswerIndex: 0,
        explanation: "Omentum majus oshqozon katta egriligidan pastga osilib tushuvchi 4 varaqli peritoneum buklamasidir."
      }
    ]
  },

  // TOPIC 17: Nafas tizimi: Hiqildoq, Traxeya, O'pka, Plevra
  {
    topicOrder: 17,
    topicKeywords: ["nafas", "hiqildoq", "traxeya", "o'pka", "plevra", "larynx", "pulmo"],
    quizzes: [
      {
        question: "Hiqildoqning (Larynx) eng yirik, oldida qalqonsimon do'nglik (Adam olmasi) hosil qiluvchi tog'ayi qaysi?",
        options: ["Cartilago thyroidea (Qalqonsimon tog'ay)", "Cartilago cricoidea", "Cartilago arytenoidea", "Epiglottis"],
        correctAnswerIndex: 0,
        explanation: "Cartilago thyroidea hiqildoqning eng yirik juft emas tog'ayi bo'lib, tomoq oldida prominentia laryngea hosil qiladi."
      },
      {
        question: "O'ng va chap o'pka (Pulmo dexter va sinister) bo me'yoriy pallalar (lobus) soni nechta?",
        options: ["O'ng o'pka 3 palla, chap o'pka 2 palla", "O'ng o'pka 2 palla, chap o'pka 3 palla", "Ikkalasi ham 3 palladan", "Ikkalasi ham 2 palladan"],
        correctAnswerIndex: 0,
        explanation: "O'ng o'pkada 2 ta egat va 3 palla (superior, media, inferior), chap o'pkada esa yurak o'ymasi sabab 1 ta egat va 2 palla bor."
      }
    ]
  },

  // TOPIC 18: Endokrin Tizim
  {
    topicOrder: 18,
    topicKeywords: ["endokrin", "qalqonsimon", "buyrak usti", "thyroidea", "suprarenalis"],
    quizzes: [
      {
        question: "Qalqonsimon bez (Glandula thyroidea) traxeyaning nechinchi tog'ay halqalari qarshisida joylashgan bo'yinturuq (isthmus) orqali tutashadi?",
        options: ["2-4 traxeya tog'aylari qarshisida", "1-2 traxeya tog'ayida", "5-6 traxeya tog'ayida", "Hiqildoq tog'ayida"],
        correctAnswerIndex: 0,
        explanation: "Glandula thyroidea bo'yinturug'i (isthmus) traxeyaning 2-4 tog'ay halqalari ro'parasida ko'ndalang joylashadi."
      },
      {
        question: "Buyrak usti bezi po'stloq qismining (Cortex glandulae suprarenalis) tugunli (zona glomerulosa) qavati qaysi gormonni ajratadi?",
        options: ["Aldosteron (Mineralokortikoid)", "Kortizol (Glukokortikoid)", "Adrenalin", "Testosteron"],
        correctAnswerIndex: 0,
        explanation: "Zona glomerulosa mineralokortikoid gormon aldosteron sintez qilib, organizmda natriy va suv balansini idora etadi."
      }
    ]
  },

  // TOPIC 19: Siydik Tizimi: Buyrak, Siydik pufagi
  {
    topicOrder: 19,
    topicKeywords: ["siydik", "buyrak", "ren", "ureter", "nephron", "vesica urinaria"],
    quizzes: [
      {
        question: "Buyrakning (Ren) morpho-funktsional birligi qanday ataladi?",
        options: ["Nefron (Nephron)", "Neyron", "Lobulus", "Osteon"],
        correctAnswerIndex: 0,
        explanation: "Nefron — buyrakning qonni filtrlab siydik hosil qiluvchi mikroskopik tuzilma va funktsional birligidir (har bir buyrakda ~1 mln)."
      },
      {
        question: "Siydik pufagining (Vesica urinaria) tubida joylashgan, shilliq qavati buklamasiz silliq uchburchak майdon (Trigonum vesicae) nima deyiladi?",
        options: ["Lieto uchburchagi (Trigonum vesicae / Lieutaud)", "Scarpa uchburchagi", "Petit uchburchagi", "Calot uchburchagi"],
        correctAnswerIndex: 0,
        explanation: "Trigonum vesicae pufak tubida ikkala siydik yo'li teshigi va siydik chiqarish kanali ichki teshigi orasidagi silliq sohadir."
      }
    ]
  },

  // TOPIC 20: Ayollar Jinsiy Tizimi va Sut Bezi
  {
    topicOrder: 20,
    topicKeywords: ["ayol", "jinsiy", "ovarium", "uterus", "mamma", "sut bezi"],
    quizzes: [
      {
        question: "Bachadon nayining (Tuba uterina / Salpinx) urug'lanish jarayoni eng ko'p yuz beradigan kengaygan qismi qaysi?",
        options: ["Ampulla tubae uterinae", "Isthmus tubae", "Infundibulum", "Pars uterina"],
        correctAnswerIndex: 0,
        explanation: "Ampulla tubae uterinae bachadon nayining eng uzun va keng qismi bo'lib, follikuladan chiqqan tuxum-hujayra shu yerda urug'lanadi."
      },
      {
        question: "Bachadon devorining (Uterus) o'rta va eng qalin mushak qavati qanday ataladi?",
        options: ["Myometrium", "Endometrium", "Perimetrium", "Parametrium"],
        correctAnswerIndex: 0,
        explanation: "Myometrium bachadonning 3 qavatli silliq mushak tolalardan iborat eng baquvvat qavatidir."
      }
    ]
  },

  // TOPIC 21: Erkaklar Jinsiy Tizimi
  {
    topicOrder: 21,
    topicKeywords: ["erkak", "jinsiy", "testis", "prostata", "ductus deferens"],
    quizzes: [
      {
        question: "Urug'donning (Testis) me'yorida spermatozoidlar ishlab chiqariladigan buralgan naychalari nima deyiladi?",
        options: ["Tubuli seminiferi contorti", "Tubuli seminiferi recti", "Rete testis", "Ductuli efferentes"],
        correctAnswerIndex: 0,
        explanation: "Tubuli seminiferi contorti (buralgan urug' naychalari) ichida spermatogenez jarayoni kechadi."
      },
      {
        question: "Prostata bezi (Prostata) erkaklar siydik chiqarish kanalining qaysi qismini o'rab turadi?",
        options: ["Pars prostatica urethrae", "Pars membranacea", "Pars spongiosa", "Fossa navicularis"],
        correctAnswerIndex: 0,
        explanation: "Prostata bezi pufakdan chiquvchi urethraning pars prostatica qismini halqa kabi o'rab oladi."
      }
    ]
  },

  // TOPIC 22: Yurak, Qon Aylanish Doirasi, Aorta, Uyqu Arteriyalari
  {
    topicOrder: 22,
    topicKeywords: ["yurak", "qon aylanish", "aorta", "uyqu arteriyasi", "cor", "carotis"],
    quizzes: [
      {
        question: "Yurakning o'ng bo'lmachasi va o'ng qorinchasi (Atrium dextrum va Ventriculus dexter) orasida qaysi tabaqali klapan joylashgan?",
        options: ["Valva tricuspidalis (Uch tabaqali klapan)", "Valva bicuspidalis / mitralis (Ikki tabaqali)", "Valva aortae", "Valva trunci pulmonalis"],
        correctAnswerIndex: 0,
        explanation: "O'ng bo'lmacha-qorincha teshigida Valva tricuspidalis (uch tabaqali klapan) joy olgan."
      },
      {
        question: "Bosh miya va ko'z kosasini qon bilan ta'minlovchi asabiy tarmoq ajratmay bo'yinga ko me'yorda ko'tariluvchi arteriya qaysi?",
        options: ["Arteria carotis interna (Ichki uyqu arteriyasi)", "Arteria carotis externa", "Arteria subclavia", "Arteria vertebralis"],
        correctAnswerIndex: 0,
        explanation: "A. carotis interna bo'yinda hech qanday tarmoq bermasdan canalis caroticus orqali kalla bo'shlig'iga kiradi."
      }
    ]
  },

  // TOPIC 23: Qo'l Arteriyalari va O'mrov Osti Arteriyasi
  {
    topicOrder: 23,
    topicKeywords: ["qo'l", "arteriya", "o'mrov osti", "subclavia", "axillaris", "brachialis", "radialis"],
    quizzes: [
      {
        question: "Pulse (tomir urishi) bilakning kaft yuzasida eng ko me'yorda qulay ushlanadigan arteriya qaysi?",
        options: ["Arteria radialis (Bilak arteriyasi)", "Arteria ulnaris", "Arteria brachialis", "Arteria interossea anterior"],
        correctAnswerIndex: 0,
        explanation: "Arteria radialis bilakning distal lateral qismida (sulcus radialis) suyakka taqalib turgani uchun puls oson seziladi."
      },
      {
        question: "Qo'lning yuzaki kaft yoyini (Arcus palmaris superficialis) qaysi arteriya davomi hosil qiladi?",
        options: ["Arteria ulnaris (Tirsak arteriyasi davomi)", "Arteria radialis", "Arteria profunda brachii", "Arteria interossea"],
        correctAnswerIndex: 0,
        explanation: "Yuzaki kaft yoyini asosan a. ulnaris hosil qiladi va a. radialis'ning ramus palmaris superficialis tarmog'i bilan tutashadi."
      }
    ]
  },

  // TOPIC 24: Ko'krak va Qorin Aortasi va Tarmoqlari
  {
    topicOrder: 24,
    topicKeywords: ["ko'krak", "qorin aortasi", "truncus celiacus", "mesenterica"],
    quizzes: [
      {
        question: "Qorin aortasining (Aorta abdominalis) toq poyasi bo'lib, oshqozon, jigar va qora taloqni qon bilan ta'minlovchi do'ng poya qanday ataladi?",
        options: ["Truncus celiacus (Qorin poyasi)", "Arteria mesenterica superior", "Arteria mesenterica inferior", "Arteria renalis"],
        correctAnswerIndex: 0,
        explanation: "Truncus celiacus Th12 darajasida ajralib, a. gastrica sinistra, a. hepatica communis va a. lienalis (splenica) shoxlariga bo'linadi."
      },
      {
        question: "Ingichka ichak hamda yo'g'on ichakning ko'tariluvchi va ko'ndalang qismini qaysi toq arteriya ta'minlaydi?",
        options: ["Arteria mesenterica superior (Yuqori tutqich arteriyasi)", "Arteria mesenterica inferior", "Truncus celiacus", "Arteria iliaca communis"],
        correctAnswerIndex: 0,
        explanation: "A. mesenterica superior L1 umurtqa darajasidan chiqib, butun ingichka ichak va o'ng yo'g'on ichakni ta'minlaydi."
      }
    ]
  },

  // TOPIC 25: Yuqori va Pastki Kovak Venalar, Darvoza Venasi
  {
    topicOrder: 25,
    topicKeywords: ["kovak vena", "darvoza venasi", "vena cava", "vena portae"],
    quizzes: [
      {
        question: "Toq qorin a'zolaridan (oshqozon, ichaklar, qora taloq) toplangan qonni jigarga tozalash uchun olib boruvchi vena qaysi?",
        options: ["Vena portae hepatis (Jigar darvoza venasi)", "Vena cava inferior", "Vena cava superior", "Vena renalis"],
        correctAnswerIndex: 0,
        explanation: "Vena portae toq qorin a'zolarining qonini jigarga tashiydi va jigar sinusoidlarida toksinlardan tozalanadi."
      },
      {
        question: "Pastki kovak vena (Vena cava inferior) qorin bo'shlig me'yorida qaysi umurtqalar darajasida o'ng va chap v. iliaca communis qo'shilishidan hosil bo'ladi?",
        options: ["L4 - L5 umurtqa darajasida", "L1 - L2 darajasida", "Th12 darajasida", "S1 - S2 darajasida"],
        correctAnswerIndex: 0,
        explanation: "Vena cava inferior L4-L5 umurtqalar ro'parasida umumiy yonbosh venalarining birikishidan hosil bo'ladi."
      }
    ]
  },

  // TOPIC 26: Limfa Tizimi va Yo'llari
  {
    topicOrder: 26,
    topicKeywords: ["limfa", "limfa yo'li", "ductus thoracicus", "cistern chyli"],
    quizzes: [
      {
        question: "Inson tanasidagi eng yirik limfa tomiri bo'lib, tananing 3/4 qismidan limfani yig'uvchi poya qanday ataladi?",
        options: ["Ductus thoracicus (Ko'krak limfa yo'li)", "Ductus lymphaticus dexter", "Truncus jugularis", "Truncus subclavius"],
        correctAnswerIndex: 0,
        explanation: "Ductus thoracicus oyoqlar, chanoq, qorin, chap ko'krak, chap qo'l, chap bo'yin va boshdan limfani yig'adi."
      },
      {
        question: "Ko'krak limfa yo me'yordagi poyasi (Ductus thoracicus) boshlanishidagi kengaygan sig'im joyi nima deyiladi?",
        options: ["Cistern chyli (Pekke havzasi / sut havzasi)", "Nodus lymphaticus", "Spleen / Lien", "Thymus"],
        correctAnswerIndex: 0,
        explanation: "Cistern chyli Th12-L2 umurtqalar qarshisida bel va tutqich limfa poyalari qo'shilishida hosil bo'ladigan kengaymadir."
      }
    ]
  },

  // === 3-SEMESTER QUIZZES (Topics 1-13 / Semester 3) ===
  // S3-TOPIC 1: Orqa miya, Bosh miya poyasi, 12 juft nervlar chiqishi, IV qorincha
  {
    topicOrder: 101, // Semester 3 Topic 1
    topicKeywords: ["orqa miya", "medulla spinalis", "uzunchoq miya", "voroliy ko'prigi", "miyacha", "iv qorincha", "12 juft"],
    quizzes: [
      {
        question: "Kattalarda orqa miyaning (Medulla spinalis) pastki uchi (conus medullaris) qaysi umurtqalar darajasida tugaydi?",
        options: ["L1 - L2 umurtqalar darajasida", "Th12 umurtqa darajasida", "L4 - L5 umurtqalar darajasida", "S1 - S2 umurtqalar darajasida"],
        correctAnswerIndex: 0,
        explanation: "Orqa miya kattalarda L1-L2 bel umurtqalari darajasida miya konusi (conus medullaris) bilan tugaydi."
      },
      {
        question: "Bosh miya poyasining faqat orqa (dorsal) yuzasidan chiquvchi yagona kranial nerv qaysi?",
        options: ["IV juft - N. trochlearis (G'altak nervi)", "III juft - N. oculomotorius", "VI juft - N. abducens", "VII juft - N. facialis"],
        correctAnswerIndex: 0,
        explanation: "N. trochlearis (IV juft) bosh miya poyasining orqa yuzasidan, yuqori miya yelkani yonidan chiquvchi yagona kranial nervdir."
      },
      {
        question: "IV qorincha (Ventriculus quartus) tubini qaysi anatomik tuzilma hosil qiladi?",
        options: ["Fossa rhomboidea (Rombsimon chuqurcha)", "Tegmentum mesencephali", "Lamina tecti", "Corpus callosum"],
        correctAnswerIndex: 0,
        explanation: "IV qorincha tubini ko'prik va uzunchoq miyaning orqa yuzasi — rombsimon chuqurcha (fossa rhomboidea) hosil qiladi."
      },
      {
        question: "Ko'prik-miyacha burchagidan (Angulus pontocerebellaris) qaysi juft kranial nervlar chiqadi?",
        options: ["VII (N. facialis) va VIII (N. vestibulocochlearis)", "IX va X juft nervlar", "V juft nerv", "III va IV juft nervlar"],
        correctAnswerIndex: 0,
        explanation: "Ko'prik-miyacha burchagidan VII (yuz) va VIII (dahliz-chig'anoq) juft bosh miya nervlari chiqadi."
      }
    ]
  },

  // S3-TOPIC 2: O'rta miya, Oraliq miya, III qorincha
  {
    topicOrder: 102,
    topicKeywords: ["o'rta miya", "oraliq miya", "mesencephalon", "diencephalon", "thalamus", "iii qorincha"],
    quizzes: [
      {
        question: "O'rta miya to'rt tepaligining yuqori tepachalari (Colliculi superiores) qaysi analizatorning po'stloqosti reflektor markazi hisoblanadi?",
        options: ["Ko'rish analizatori", "Eshitish analizatori", "Hid bilish analizatori", "Muvozanat analizatori"],
        correctAnswerIndex: 0,
        explanation: "Yuqori tepaliklar (Colliculi superiores) — ko'rishning, pastki tepaliklar (Colliculi inferiores) esa eshitishning po'stloqosti markazidir."
      },
      {
        question: "Hid bilish sezgisidan tashqari barcha sensor sezgilarning po'stloqosti bosh kollektori qaysi a'zo hisoblanadi?",
        options: ["Talamus (Thalamus dorsalis)", "Gipotalamus", "Epifiz", "Gipofiz"],
        correctAnswerIndex: 0,
        explanation: "Talamus barcha afferent sezgi yo'llarining (hid bilishdan tashqari) po'stloqosti oliy integratsiya markazidir."
      },
      {
        question: "III qorincha (Ventriculus tertius) yon qorinchalar bilan qaysi teshiklar orqali tutashadi?",
        options: ["Foramina interventricularia (Monro teshiklari)", "Apertura mediana (Magendie)", "Aqueductus cerebri", "Foramen Luschka"],
        correctAnswerIndex: 0,
        explanation: "III qorincha Monro teshiklari (foramina interventricularia) orqali yon qorinchalar bilan bog'lanadi."
      }
    ]
  },

  // S3-TOPIC 3: Bosh miya po'stlog'i, Bazal o'zaklar, Yon qorinchalar
  {
    topicOrder: 103,
    topicKeywords: ["po'stloq", "cortex", "bazal", "lentiformis", "caudatus", "yon qorincha"],
    quizzes: [
      {
        question: "Ixtiyoriy harakatlarning birlamchi motor markazi bosh miya po'stlog'ining qaysi sohasida joylashgan?",
        options: ["Gyrus precentralis (Markaz oldi burmasi, 4-maydon)", "Gyrus postcentralis", "Sulcus calcarinus", "Gyrus temporalis superior"],
        correctAnswerIndex: 0,
        explanation: "Gyrus precentralis (Brodmann 4-maydoni) skelet mushaklarining ixtiyoriy harakatlarini boshqaruvchi asosiy markazdir."
      },
      {
        question: "Ko'rish analizatorining oliy po'stloq markazi ensa bo'lagining qaysi egati atrofida (17-maydon) joylashgan?",
        options: ["Sulcus calcarinus (Qirqma egat)", "Sulcus centralis", "Sulcus lateralis", "Sulcus parietooccipitalis"],
        correctAnswerIndex: 0,
        explanation: "Sulcus calcarinus atrofi (Brodmann 17-maydon) ko'rish po'stloq markazidir."
      },
      {
        question: "Targ'il tana (Corpus striatum) qaysi bazal o'zaklar birikmasidan tashkil topgan?",
        options: ["Nucleus caudatus (Dumli o'zak) va Nucleus lentiformis (Yasmiqsimon o'zak)", "Thalamus va Hypothalamus", "Claustrum va Amygdala", "Nucleus ruber va Substantia nigra"],
        correctAnswerIndex: 0,
        explanation: "Corpus striatum dumli o'zak (nucleus caudatus) va yasmiqsimon o'zak (nucleus lentiformis)dan iborat."
      }
    ]
  },

  // S3-TOPIC 4: O'tkazuv yo'llari, Refleks yoyi
  {
    topicOrder: 104,
    topicKeywords: ["o'tkazuv yo'llari", "tractus", "corticospinalis", "spinothalamicus", "goll", "burdax"],
    quizzes: [
      {
        question: "Og'riq va harorat sezgilarini orqa miyadan talamusga yetkazuvchi asosiy ko'tariluvchi yo'l qaysi?",
        options: ["Tractus spinothalamicus lateralis", "Fasciculus gracilis", "Tractus corticospinalis", "Tractus rubrospinalis"],
        correctAnswerIndex: 0,
        explanation: "Tractus spinothalamicus lateralis og'riq va harorat sezgisini o'tkazadi va tolalari orqa miyada qarama-qarshi tomonga kesishadi."
      },
      {
        question: "Tananing pastki qismi va oyoqlardan chuqur proprioseptiv sezgini o'tkazuvchi dasta qanday ataladi?",
        options: ["Fasciculus gracilis (Goll dastasi)", "Fasciculus cuneatus (Burdax dastasi)", "Tractus spinocerebellaris", "Tractus tectospinalis"],
        correctAnswerIndex: 0,
        explanation: "Fasciculus gracilis (Goll dastasi) tana pastki qismi va oyoqlardan mushak-bo'g'im sezgisini olib chiqadi."
      },
      {
        question: "Ixtiyoriy harakatlarni ta'minlovchi piramidal yo'lning (Tractus corticospinalis) 85% tolalari qayerda kesishadi?",
        options: ["Uzunchoq miya pastki qismida (Decussatio pyramidum)", "Ko'prikda", "Orqa miya segmentlarida", "Talamusda"],
        correctAnswerIndex: 0,
        explanation: "Piramidal yo'l tolalari uzunchoq miya pastida Decussatio pyramidum sohasida kesishadi."
      }
    ]
  },

  // S3-TOPIC 5: Orqa miya nervlari, Bo'yin chigali, Qovurg'alararo nervlar
  {
    topicOrder: 105,
    topicKeywords: ["bo'yin chigali", "plexus cervicalis", "phrenicus", "intercostales", "31 juft"],
    quizzes: [
      {
        question: "Diafragmani motor innervatsiya qiluvchi bo'yin chigalining aralash nervi qaysi?",
        options: ["Nervus phrenicus (Diafragma nervi, C3-C5)", "Nervus vagus", "Ansa cervicalis", "Nervus accessorius"],
        correctAnswerIndex: 0,
        explanation: "N. phrenicus (C3-C5) bo'yin chigalidan chiqib, diafragmani harakatlantiruvchi yagona nerv hisoblanadi."
      },
      {
        question: "Odam organizmida jami nechta juft orqa miya (spinal) nervlari hosil bo'ladi?",
        options: ["31 juft (8 bo'yin, 12 ko'krak, 5 bel, 5 dumg'aza, 1 dum)", "12 juft", "24 juft", "33 juft"],
        correctAnswerIndex: 0,
        explanation: "31 juft: 8 ta bo'yin, 12 ta ko'krak, 5 ta bel, 5 ta dumg'aza va 1 ta dum spinal nervlari mavjud."
      }
    ]
  },

  // S3-TOPIC 6: Yelka chigali
  {
    topicOrder: 106,
    topicKeywords: ["yelka chigali", "plexus brachialis", "medianus", "ulnaris", "radialis", "musculocutaneus"],
    quizzes: [
      {
        question: "Bilak va yelkaning barcha yozuvchi (extensor) mushaklarini innervatsiya qiluvchi yirik nerv qaysi?",
        options: ["Nervus radialis (Bilak / Nurlar nervi)", "Nervus medianus", "Nervus ulnaris", "Nervus axillaris"],
        correctAnswerIndex: 0,
        explanation: "N. radialis yelka va bilakning orqa yuzasidagi barcha yozuvchi mushaklarni innervatsiya qiladi (shikastlanganda 'osilib qolgan panja' kelib chiqadi)."
      },
      {
        question: "Tirsak nervi (N. ulnaris) shikastlanganda panjada qanday patologik deformatsiya kuzatiladi?",
        options: ["'Panjasimon / Qush panjasi' (Claw hand) ko'rinishi", "'Maymun qo'li' (Ape hand)", "'Osilib qolgan panja' (Wrist drop)", "Tirsak ankilozisi"],
        correctAnswerIndex: 0,
        explanation: "N. ulnaris falajlanganda suyaklararo va chuvalchangsimon mushaklar atrofiyasi tufayli 'qush panjasi' (claw hand) hosil bo'ladi."
      },
      {
        question: "Yelkaning ikki boshli mushagini (M. biceps brachii) qaysi nerv innervatsiya qiladi?",
        options: ["Nervus musculocutaneus (Muskul-teri nervi)", "Nervus axillaris", "Nervus medianus", "Nervus radialis"],
        correctAnswerIndex: 0,
        explanation: "N. musculocutaneus yelkaning oldingi bukurchi mushaklari (m. biceps brachii, m. brachialis)ni innervatsiya qiladi."
      }
    ]
  },

  // S3-TOPIC 7: Bel va Dumg'aza chigali
  {
    topicOrder: 107,
    topicKeywords: ["bel chigali", "dumg'aza chigali", "ischiadicus", "femoralis", "tibialis", "fibularis"],
    quizzes: [
      {
        question: "Sonning to'rt boshli mushagini (M. quadriceps femoris) innervatsiya qiluvchi bel chigalining eng yirik nervi qaysi?",
        options: ["Nervus femoralis (Son nervi)", "Nervus obturatorius", "Nervus ischiadicus", "Nervus pudendus"],
        correctAnswerIndex: 0,
        explanation: "N. femoralis (L2-L4) m. quadriceps femorisni innervatsiya qilib, tizzani yozishni ta'minlaydi."
      },
      {
        question: "Inson tanasidagi eng yo'g'on va eng uzun nerv qaysi?",
        options: ["Nervus ischiadicus (O'tirg'ich nervi)", "Nervus femoralis", "Nervus vagus", "Nervus tibialis"],
        correctAnswerIndex: 0,
        explanation: "N. ischiadicus (L4-S3) inson tanasidagi eng yirik nerv bo'lib, son orqasidan tizzagacha tushadi."
      },
      {
        question: "Boldirning oldingi yozuvchi mushaklarini innervatsiya qiluvchi va zararlanganda 'xo'rozcha / ot yurishi' keltirib chiqaruvchi nerv qaysi?",
        options: ["Nervus fibularis / peroneus communis (profundus)", "Nervus tibialis", "Nervus saphenus", "Nervus suralis"],
        correctAnswerIndex: 0,
        explanation: "N. fibularis communis zararlanganda oyoq panjasi osilib qoladi va bemor oyog'ini baland ko'tarib 'ot yurishi' (steppage gait) qiladi."
      }
    ]
  },

  // S3-TOPIC 8: I, II, VIII kranial nervlar
  {
    topicOrder: 108,
    topicKeywords: ["olfactorii", "opticus", "vestibulocochlearis", "ko'ruv nervi", "chiasma opticum", "kallaning i"],
    quizzes: [
      {
        question: "Ko'ruv nervlari kesishmasida (Chiasma opticum) to'r pardaning qaysi tolalari kesishadi?",
        options: ["Faqat to'r pardaning medial (burun) yarmi tolalari", "Faqat lateral (chakka) tolalari", "Barcha 100% tolalar", "Tolalar kesishmaydi"],
        correctAnswerIndex: 0,
        explanation: "Chiasma opticumda faqat to'r pardaning medial (nazal) yarmi tolalari qarama-qarshi tomonga kesishadi."
      },
      {
        question: "Ichki quloqning spiral (Korti) a'zosidan eshitish impulslarini qabul qiluvchi neyronlar tuguni qayerda joylashgan?",
        options: ["Ganglion spirale cochleae", "Ganglion vestibulare (Scarpa)", "Ganglion trigeminale", "Ganglion ciliare"],
        correctAnswerIndex: 0,
        explanation: "Eshitishning 1-neyronlari chig'anoqdagi spiral tugunda (Ganglion spirale cochleae) joylashgan."
      }
    ]
  },

  // S3-TOPIC 9: III, IV, VI, XI, XII kranial nervlar
  {
    topicOrder: 109,
    topicKeywords: ["oculomotorius", "trochlearis", "abducens", "accessorius", "hypoglossus"],
    quizzes: [
      {
        question: "Ko'z olmasini tashqariga (lateralga) buruvchi m. rectus lateralis mushagini qaysi nerv innervatsiya qiladi?",
        options: ["VI juft - Nervus abducens (Uzoqlashtiruvchi nerv)", "III juft - Nervus oculomotorius", "IV juft - Nervus trochlearis", "V juft - N. ophthalmicus"],
        correctAnswerIndex: 0,
        explanation: "VI juft (N. abducens) faqat bitta mushakni — m. rectus lateralisni innervatsiya qiladi."
      },
      {
        question: "M. sternocleidomastoideus va m. trapezius mushaklarini qaysi kranial nerv innervatsiya qiladi?",
        options: ["XI juft - Nervus accessorius (Qo'shimcha nerv)", "XII juft - Nervus hypoglossus", "VII juft - Nervus facialis", "X juft - Nervus vagus"],
        correctAnswerIndex: 0,
        explanation: "XI juft (N. accessorius) to'sh-o'mrov-so'rg'ichsimon va trapetsiyasimon mushaklarni innervatsiya qiladi."
      },
      {
        question: "Tilning barcha xususiy va skelet mushaklarini qaysi kranial nerv motor innervatsiya qiladi?",
        options: ["XII juft - Nervus hypoglossus (Tilosti nervi)", "IX juft - Nervus glossopharyngeus", "VII juft - Nervus facialis", "V juft - Nervus lingualis"],
        correctAnswerIndex: 0,
        explanation: "XII juft (N. hypoglossus) tilning barcha mushaklarini harakatlantiruvchi bosh nervdir."
      }
    ]
  },

  // S3-TOPIC 10: V juft - Uch shoxli nerv
  {
    topicOrder: 110,
    topicKeywords: ["trigeminus", "uch shoxli", "ophthalmicus", "maxillaris", "mandibularis", "chaynov"],
    quizzes: [
      {
        question: "Barcha chaynov mushaklarini (M. masseter, temporalis, pterygoidei) qaysi nerv innervatsiya qiladi?",
        options: ["Nervus mandibularis (V3 - Uch shoxli nervning 3-shoxi)", "Nervus facialis (VII)", "Nervus maxillaris (V2)", "Nervus glossopharyngeus (IX)"],
        correctAnswerIndex: 0,
        explanation: "Uch shoxli nervning motor tolalari faqat 3-shox (N. mandibularis) tarkibida o'tib, chaynov mushaklarini ta'minlaydi."
      },
      {
        question: "Uch shoxli nervning 2-shoxi (N. maxillaris) kalladan qaysi teshik orqali chiqadi?",
        options: ["Foramen rotundum (Dumaloq teshik)", "Foramen ovale (Oval teshik)", "Fissura orbitalis superior", "Foramen jugulare"],
        correctAnswerIndex: 0,
        explanation: "N. maxillaris (V2) dumaloq teshik (foramen rotundum) orqali qanot-tanglay chuqurchasiga o'tadi."
      }
    ]
  },

  // S3-TOPIC 11: VII, IX, X kranial nervlar
  {
    topicOrder: 111,
    topicKeywords: ["facialis", "glossopharyngeus", "vagus", "chorda tympani", "sayyor nerv"],
    quizzes: [
      {
        question: "Tilning oldingi 2/3 qismiga ta'm bilish sezgisini qaysi nerv shoxi (VII juft tarkibidagi) yetkazadi?",
        options: ["Chorda tympani (Nog'ora tori / N. facialis)", "Nervus lingualis (V3)", "Nervus glossopharyngeus (IX)", "Nervus vagus (X)"],
        correctAnswerIndex: 0,
        explanation: "Chorda tympani (VII juft) tilning oldingi 2/3 qismiga ta'm bilish tolalarini tashiydi."
      },
      {
        question: "Hiqildoqning deyarli barcha mushaklarini innervatsiya qiluvchi N. vagusning muhim shoxi qaysi?",
        options: ["Nervus laryngeus recurrens (Qaytuvchi hiqildoq nervi)", "Nervus laryngeus superior", "Nervus phrenicus", "Nervus accessorius"],
        correctAnswerIndex: 0,
        explanation: "N. laryngeus recurrens (Adashgan nerv shoxi) hiqildoqning barcha mushaklarini (m. cricothyroideusdan tashqari) ta'minlaydi."
      }
    ]
  },

  // S3-TOPIC 12: Vegetativ nerv tizimi
  {
    topicOrder: 112,
    topicKeywords: ["vegetativ", "simpatik", "parasimpatik", "truncus sympathicus", "autonom"],
    quizzes: [
      {
        question: "Simpatik nerv tizimining markaziy o'zaklari orqa miyaning qaysi sohasida joylashgan?",
        options: ["C8/Th1 - L2/L3 segmentlar yon shoxlarida (Torakolyumbal)", "Faqat bo'yin segmentlarida", "S2 - S4 dumg'aza segmentlarida", "Miya po'stlog'ida"],
        correctAnswerIndex: 0,
        explanation: "Simpatik markaz C8/Th1 dan L2/L3 gacha bo'lgan orqa miya yon shoxlarida joylashgan."
      },
      {
        question: "Simpatik tizim faollashganda organizmda qanday fiziologik o'zgarish sodir bo'ladi?",
        options: ["Qorachiq kengayadi (mydriasis), yurak urishi tezlashadi, bronxlar kengayadi", "Qorachiq torayadi, bradikardiya bo'ladi", "Oshqozon sekretsiyasi keskin oshadi", "Qon bosimi pasayadi"],
        correctAnswerIndex: 0,
        explanation: "Simpatik tizim ('kurash yoki qoch') qorachiqni kengaytiradi, yurak urishi va qon bosimini oshiradi, bronxlarni kengaytiradi."
      }
    ]
  },

  // S3-TOPIC 13: Eshituv va muvozanat a'zosi
  {
    topicOrder: 113,
    topicKeywords: ["eshituv", "muvozanat", "auris", "membrana tympani", "cochlea", "yarimdoira"],
    quizzes: [
      {
        question: "O'rta quloqdagi eshitish suyakchalari zanjiri ketma-ketligi to'g'ri ko'rsatilgan qatorni toping:",
        options: ["Malleus (Bolg'acha) -> Incus (Sandoncha) -> Stapes (Uzangicha)", "Stapes -> Incus -> Malleus", "Incus -> Malleus -> Stapes", "Malleus -> Stapes -> Incus"],
        correctAnswerIndex: 0,
        explanation: "Nog'ora pardadan dahliz darchasigacha: Bolg'acha (Malleus) -> Sandoncha (Incus) -> Uzangicha (Stapes)."
      },
      {
        question: "Ichki quloq chig'anoq kanalida tovush tebranishlarini retseptor darajasida qabul qiluvchi a'zo nima deyiladi?",
        options: ["Korti a'zosi (Organum spirale Corti)", "Otolit apparati", "Crista ampullaris", "Membrana tympani"],
        correctAnswerIndex: 0,
        explanation: "Korti spiral a'zosi (Organum spirale) chig'anoqda joylashgan bo'lib, tovush to'lqinlarini nerv impulsiga aylantiradi."
      }
    ]
  }
];

export function getCuratedQuizzesForTopic(topic: any): Quiz[] {
  if (!topic) return [];

  const sem = Number(topic.semester) || 1;
  const order = Number(topic.order) || 0;
  const title = (typeof topic.title === 'string' ? topic.title : (topic.title?.uz || topic.title?.en || topic.title?.ru || '')).toLowerCase();

  let found: CuratedTopicQuiz | undefined;

  // 1. Check in specific semester collection first (each has 30 questions per topic!)
  if (sem === 1) {
    found = SEMESTER_1_QUIZZES.find(item => item.topicOrder === order) ||
            SEMESTER_1_QUIZZES.find(item => item.topicKeywords.some(kw => title.includes(kw.toLowerCase())));
  } else if (sem === 2) {
    const s2Order = order >= 14 ? order : (order > 0 ? order + 13 : 14);
    found = SEMESTER_2_QUIZZES.find(item => item.topicOrder === s2Order || item.topicOrder === order) ||
            SEMESTER_2_QUIZZES.find(item => item.topicKeywords.some(kw => title.includes(kw.toLowerCase())));
  } else if (sem === 3) {
    const s3Order = order >= 100 ? order : (order > 0 ? 100 + order : 101);
    found = SEMESTER_3_QUIZZES.find(item => item.topicOrder === s3Order || item.topicOrder === order) ||
            SEMESTER_3_QUIZZES.find(item => item.topicKeywords.some(kw => title.includes(kw.toLowerCase())));
  }

  // 2. Fallback to full curated collection
  if (!found) {
    found = ALL_CURATED_QUIZZES.find(item =>
      item.topicKeywords.some(kw => title.includes(kw.toLowerCase()))
    );
  }

  // 3. Fallback to TOPIC_CURATED_QUIZZES
  if (!found) {
    if (sem === 3) {
      found = TOPIC_CURATED_QUIZZES.find(item => item.topicOrder === (100 + order));
    } else {
      found = TOPIC_CURATED_QUIZZES.find(item => item.topicOrder === order);
    }
  }

  // 4. Default fallback: first topic of semester
  if (!found) {
    if (sem === 2 && SEMESTER_2_QUIZZES.length > 0) {
      found = SEMESTER_2_QUIZZES[0];
    } else if (sem === 3 && SEMESTER_3_QUIZZES.length > 0) {
      found = SEMESTER_3_QUIZZES[0];
    } else {
      found = SEMESTER_1_QUIZZES[0] || TOPIC_CURATED_QUIZZES[0];
    }
  }

  return found.quizzes.map((q, idx) => ({
    id: `curated_${sem}_${order || 'gen'}_${idx}`,
    topicId: topic.id || `topic_${sem}_${order}`,
    question: q.question,
    options: q.options,
    correctAnswerIndex: q.correctAnswerIndex,
    explanation: q.explanation
  }));
}

