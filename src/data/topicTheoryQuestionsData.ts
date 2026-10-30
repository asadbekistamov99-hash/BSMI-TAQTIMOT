export interface TheoryQuestion {
  id: string;
  topicOrder?: number;
  semester?: number;
  topicKeywords?: string[];
  question: string;
  questionRu?: string;
  questionEn?: string;
  answer: string;
  answerRu?: string;
  answerEn?: string;
  keyPoints?: string[];
  latinTerms?: string[];
  clinicalSignificance?: string;
  difficulty?: 'basic' | 'medium' | 'advanced' | 'exam';
}

export interface CuratedTopicQuestions {
  topicOrder: number;
  semester: number;
  topicKeywords: string[];
  questions: TheoryQuestion[];
}

export const TOPIC_THEORY_QUESTIONS: CuratedTopicQuestions[] = [
  // SEMESTR 1 - TOPIC 1: Umurtqa pog'onasi & Anatomik terminologiya
  {
    topicOrder: 1,
    semester: 1,
    topicKeywords: ["terminologiya", "umurtqa", "vertebra", "sath", "o'q", "lordoz", "kifoz"],
    questions: [
      {
        id: "tq_1_1",
        difficulty: "exam",
        question: "Anatomik sathlar (plana anatomica) va o'qlar (axes): ularning turlari va inson tanasini qanday yo'nalishlarda bo'lishini tushuntiring.",
        answer: "Inson tanasining fazoviy yo'nalishlarini belgilash uchun 3 ta asosiy sath (tekislik) va 3 ta asosiy o'q ishlatiladi:\n\n1. **Sagittal sath (planum sagittale)**: Tanani vertikal ravishda o'ng (dexter) va chap (sinister) qismlarga bo'ladi. Tananing qoq o'rtasidan o'tuvchi tekislik — *planum medianum* deyiladi.\n2. **Frontal sath (planum frontale)**: Peshonaga parallel o'tib, tanani oldingi (anterior / ventralis) va orqa (posterior / dorsalis) bo'laklarga ajratadi.\n3. **Gorizontal / Transversal sath (planum transversale / horizontale)**: Yer yuzasiga parallel bo'lib, tanani yuqori (superior / cranialis) va pastki (inferior / caudalis) qismlarga bo'ladi.\n\n**O'qlar**:\n- *Sagittal o'q* (oldinga-orqaga yo'nalgan)\n- *Frontal o'q* (o'ngdan-chapga yo'nalgan)\n- *Vertikal o'q* (yuqoridan-pastga yo'nalgan).",
        keyPoints: [
          "Planum medianum tanani simmetrik o'ng va chap qismlarga bo'ladi",
          "Harakatlar har doim o'qlarga nisbatan amalga oshadi (masalan: bukilish-yozilish frontal o'q atrofida)",
          "Anatomik terminlar xalqaro Lotin nomenklaturasi (Terminologia Anatomica) bo'yicha qabul qilingan"
        ],
        latinTerms: ["Planum sagittale", "Planum frontale", "Planum transversale", "Axis verticalis", "Axis sagittalis", "Axis transversalis"],
        clinicalSignificance: "MRT (MRI), KT (CT) va rentgenografiya tasvirlari aynan shu uchta sathda (sagittal, frontal/coronal, axial/transversal) tahlil qilinadi."
      },
      {
        id: "tq_1_2",
        difficulty: "exam",
        question: "Umurtqaning umumiy tuzilishi (vertebra) qanday qismlardan iborat va bo'yin umurtqalarining (vertebrae cervicales) farqli belgilari qaysilar?",
        answer: "Har bir tipik umurtqa quyidagi qismlardan tuzilgan:\n1. **Tana (corpus vertebrae)** — oldinda joylashgan asosiy tayanch qismi.\n2. **Yoy (arcus vertebrae)** — orqada joylashib, tana bilan birgalikda *foramen vertebrale* (umurtqa teshigi)ni hosil qiladi.\n3. **O'simtalar (processus)**: jami 7 ta:\n   - 1 ta toq o'tkir o'simta (*processus spinosus*)\n   - 2 ta ko'ndalang o'simta (*processus transversus*)\n   - 4 ta bo'g'im o'simtasi (*processus articulares superiores et inferiores*).\n\n**Bo'yin umurtqalarining (C1-C7) o'ziga xos xususiyatlari**:\n- Eng muhim belgisi: ko'ndalang o'simtasida *foramen transversarium* (umurtqa arteriyasi o'tadigan teshik) mavjudligi.\n- Processus spinosus uchi ayri (bifid) bo'ladi (C2-C6).\n- Umurtqa teshigi (foramen vertebrale) uchburchak va keng shaklda bo'ladi.\n- C7 umurtqasi — *vertebra prominens* (bo'rtib turuvchi umurtqa) deb ataladi va uning o'tkir o'simtasi uzun, ayri bo'lmagan holda teridan oson paypaslanadi.",
        keyPoints: [
          "Jami 7 ta o'simta: 1 spinosus, 2 transversus, 4 articularis",
          "Foramen transversarium — faqat bo'yin umurtqalariga xos belgi",
          "C1 (Atlas) tana va o'tkir o'simtaga ega emas",
          "C2 (Axis) tishsimon o'simta (dens axis)ga ega"
        ],
        latinTerms: ["Corpus vertebrae", "Arcus vertebrae", "Foramen vertebrale", "Processus spinosus", "Processus transversus", "Foramen transversarium", "Vertebra prominens"],
        clinicalSignificance: "Foramen transversarium ichidan arteria vertebralis o'tadi; bo'yin umurtqalari osteoxondrozi yoki siljishida bu arteriya qisilib, miya qon aylanishi buzilishi (vertebro-bazilyar yetishmovchilik) yuzaga keladi."
      },
      {
        id: "tq_1_3",
        difficulty: "advanced",
        question: "Atlas (C1) va Axis (C2) umurtqalarining tuzilishi hamda atlant-aksial bo'g'imlarining harakat mexanizmi.",
        answer: "**Atlas (C1)**:\n- Tanasi (corpus) va o'tkir o'simtasi (processus spinosus) yo'q.\n- Oldingi yoy (*arcus anterior*) va orqa yoy (*arcus posterior*) hamda ularni birlashtiruvchi yon massalar (*massa lateralis*)dan iborat.\n- Oldingi yoyning orqa yuzasida *fovea dentis* (tish chuqurchasi) mavjud bo'lib, u Axis tishi bilan birikadi.\n- Massa lateralis ustida ensa suyagi bilan birikuvchi yuqori bo'g'im yuzalari (*facies articulares superiores*) bor.\n\n**Axis (C2)**:\n- Tanasi ustidan yuqoriga qaragan tishsimon o'simta — *dens axis* ko'tariladi (u embrional davrda atlasning tanasidan rivojlangan).\n- Dens oldingi va orqa bo'g'im yuzalariga ega (*facies articularis anterior et posterior*).\n\n**Harakatlar**:\n- *Articulatio atlantooccipitalis* (atlant-ensa bo'g'imi) — ellipsimon, boshning oldinga-orqaga egilishi ('ha' harakati).\n- *Articulatio atlantoaxialis mediana et laterales* — silindrsimon, boshning o'ngga va chapga buralishi ('yo'q' harakati).",
        keyPoints: [
          "Atlasda corpus yo'q, uning o'rniga massa lateralis va ikkita yoy bor",
          "Dens axis atlant-aksial bo'g'imda vertikal o'q vazifasini bajaradi",
          "Ligamentum transversum atlantis tishning orqa miyaga botishidan saqlaydi"
        ],
        latinTerms: ["Atlas", "Axis", "Dens axis", "Massa lateralis", "Arcus anterior atlantis", "Ligamentum transversum atlantis"],
        clinicalSignificance: "Dens axis sinishi (Hangman's fracture) yoki ko'ndalang boylam uzilishi orqa miyaning bo'yin segmentini ezib, darhol nafas to'xtashi va o'limga olib kelishi mumkin."
      },
      {
        id: "tq_1_4",
        difficulty: "medium",
        question: "Umurtqa pog'onasi egriliklari: Lordoz va Kifoz tushunchalari, ularning shakllanish vaqti va vazifasi.",
        answer: "Katta odamda umurtqa pog'onasi sagittal tekislikda 4 ta fiziologik egrilikka ega:\n1. **Bo'yin lordozi (Lordosis cervicalis)** — qavariqligi oldinga qaragan egrilik. Bola 2-3 oyligida boshini ko'tara boshlaganda shakllanadi.\n2. **Ko'krak kifozi (Kyphosis thoracica)** — qavariqligi orqaga qaragan egrilik. Bola 6 oyligida o'tira boshlaganda yuzaga keladi.\n3. **Bel lordozi (Lordosis lumbalis)** — qavariqligi oldinga qaragan. Bola 10-12 oyligida tik tura va yura boshlaganda hosil bo'ladi.\n4. **Dumg'aza kifozi (Kyphosis sacralis)** — qavariqligi orqaga qaragan, tos a'zolariga bo'shliq yaratadi.\n\n**Vazifasi**: Yurish, yugurish va sakrashda tanaga tushadigan mexanik zarba (amortizatsiya)ni so'ndirish, bosh miyani silkinishdan himoya qilish.",
        keyPoints: [
          "Lordoz — oldinga qaragan, Kifoz — orqaga qaragan egrilik",
          "Fiziologik egriliklar bolalikda tana yuklamasiga mos shakllanadi",
          "Skolioz (yon tomonga egrilik) har doim patologik hisoblanadi"
        ],
        latinTerms: ["Lordosis cervicalis", "Kyphosis thoracica", "Lordosis lumbalis", "Kyphosis sacralis", "Scoliosis"],
        clinicalSignificance: "Skolioz va patologik kifoz (bukri) ko'krak qafasi a'zolari — o'pka va yurak faoliyatining jiddiy buzilishiga sabab bo'ladi."
      }
    ]
  },

  // SEMESTR 1 - TOPIC 2: Ko'krak qafasi suyaklari (Qovurg'alar va To'sh suyagi)
  {
    topicOrder: 2,
    semester: 1,
    topicKeywords: ["ko'krak", "to'sh", "sternum", "qovurg'a", "costa", "thorax"],
    questions: [
      {
        id: "tq_2_1",
        difficulty: "exam",
        question: "To'sh suyagi (Sternum)ning qismlari, to'sh burchagi (Angulus sterni) va uning amaliy ahamiyati.",
        answer: "To'sh suyagi (*Sternum*) yassi suyak bo'lib, 3 qismdan iborat:\n1. **Dasta (Manubrium sterni)** — yuqorida joylashgan bo'lib, *incisura jugularis* (bo'yin bo'yinturuq o'ymasi), *incisura clavicularis* (o'mrov o'ymasi) va 1-qovurg'a o'ymasiga ega.\n2. **Tana (Corpus sterni)** — eng uzun qism, yon qirralarida 2-7 qovurg'alar uchun *incisurae costales* joylashgan.\n3. **Xanjarsimon o'simta (Processus xiphoideus)** — pastki uchi, shakli har xil bo'lishi mumkin.\n\n**To'sh burchagi (Angulus sterni / Ludovici burchagi)**:\n- Manubrium va corpus sterni tutashgan joyda oldinga qarab hosil bo'lgan burchak.\n- **Amaliy ahamiyati**: Aynan shu burchak ro'parasiga **2-qovurg'a** tog'ayi birikadi. Klinistlar qovurg'alarni sanashni aynan shu burchakdan boshlaydilar, chunki 1-qovurg'a o'mrov suyagi ostida bo'lib paypaslanmaydi.",
        keyPoints: [
          "Sternum 3 qism: manubrium, corpus, processus xiphoideus",
          "Angulus sterni ro'parasiga 2-qovurg'a to'g'ri keladi va qovurg'alar sanoq nuqtasi hisoblanadi",
          "Ko'krak qafasini ochish (sternotomiya) yurak jarrohligida qo'llaniladi"
        ],
        latinTerms: ["Manubrium sterni", "Corpus sterni", "Processus xiphoideus", "Angulus sterni", "Incisura jugularis"],
        clinicalSignificance: "Sternum suyagi qizil ilik biopsiyasi (sternal punksiya) uchun qulay joy hisoblanadi, chunki uning kortikal qatlami yupqa va qon yaratuvchi to'qimaga boy."
      },
      {
        id: "tq_2_2",
        difficulty: "exam",
        question: "Qovurg'alarning tasnifi: chin, soxta va tebranuvchi qovurg'alar hamda qovurg'aning tuzilishi.",
        answer: "Inson tanasida 12 juft qovurg'a (*Costae*) bo'lib, ular 3 guruhga bo'linadi:\n1. **Chin qovurg'alar (Costae verae, 1-7 juft)**: o'z tog'aylari bilan bevosita to'sh suyagiga mustaqil birikadi.\n2. **Soxta qovurg'alar (Costae spuriae, 8, 9, 10-juftlar)**: to'sh suyagiga bevosita yetmaydi, ularning tog'aylari yuqoridagi qovurg'a tog'ayiga ulanib, *arcus costalis* (qovurg'a yoyini) hosil qiladi.\n3. **Tebranuvchi / erkin qovurg'alar (Costae fluctuantes, 11-12 juft)**: oldingi uchlari to'shga umuman birikmaydi, qorin muskullari qatlamida erkin tugaydi.\n\n**Qovurg'aning tuzilishi**:\n- Orqa uchi: *caput costae* (boshi), *collum costae* (bo'yni), *tuberculum costae* (bo'rtiqchasi).\n- O'rta qismi: *corpus costae* (tanasi). Tananing pastki ichki chetida **sulcus costae** (qovurg'a egati) o'tadi.",
        keyPoints: [
          "1-7 chin (verae), 8-10 soxta (spuriae), 11-12 tebranuvchi (fluctuantes)",
          "Sulcus costae pastki ichki chetda joylashgan bo'lib, uning ichida qon-tomir-nerv d宽rasi (VAN: vena, arteria, nervus) yotadi",
          "Plevral punksiya har doim qovurg'aning YUQORI cheti bo'ylab qilinadi"
        ],
        latinTerms: ["Costae verae", "Costae spuriae", "Costae fluctuantes", "Caput costae", "Sulcus costae", "Arcus costalis"],
        clinicalSignificance: "Sulcus costae bo'ylab qovurg'alararo arteriya, vena va nerv o'tadi. Shuning uchun plevra bo'shlig'ini teshib suyuqlik olishda (torakotsentez) tomirlarni shikastlamaslik uchun nina pastki qovurg'aning YUQORI qirrasi ustidan kiritiladi."
      }
    ]
  },

  // SEMESTR 1 - TOPIC 3: Kalla suyagi: miya qutisi (Cranium cerebrale)
  {
    topicOrder: 3,
    semester: 1,
    topicKeywords: ["kalla", "bosh", "suyak", "cranium", "os frontale", "os occipitale", "chakka", "temporal"],
    questions: [
      {
        id: "tq_3_1",
        difficulty: "exam",
        question: "Chakka suyagi (Os temporale)ning qismlari, kanallari va ularning ichidan o'tuvchi anatomik tuzilmalar.",
        answer: "Chakka suyagi (*Os temporale*) eshitish va muvozanat a'zolarini o'z ichiga olgan eng murakkab suyakdir. U 3 qismdan iborat:\n1. **Piramida yoki toshsimon qism (Pars petrosa)** — 3 ta yuzaga (oldingi, orqa, pastki) ega, piramida ichida ichki quloq va yuz nervi kanali joylashgan.\n2. **Nog'ora qism (Pars tympanica)** — tashqi eshituv teshigi (*porus acusticus externus*) atrofini o'raydi.\n3. **Tangasimon qism (Pars squamosa)** — yassi qism, pastki jag' bilan bo'g'im hosil qiluvchi *fossa mandibularis*ga ega.\n\n**Asosiy kanallari**:\n- **Canalis caroticus** (uyqu kanali): ichki uyqu arteriyasi (*a. carotis interna*) o'tadi.\n- **Canalis facialis** (yuz nervi kanali): VII juft kalla nervi (*n. facialis*) o'tadi.\n- **Canalis musculotubarius** (muskul-nay kanali): eshituv nayi va nog'ora pardani taranglovchi muskul o'tadi.",
        keyPoints: [
          "Pars petrosa ichida labirint (ichki quloq) joylashgan",
          "Canalis facialis porus acusticus internus'dan boshlanib foramen stylomastoideum'da tugaydi",
          "Canalis caroticus toshsimon qismning pastki yuzasidan boshlanadi"
        ],
        latinTerms: ["Pars petrosa", "Pars squamosa", "Pars tympanica", "Canalis caroticus", "Canalis facialis", "Foramen stylomastoideum"],
        clinicalSignificance: "O'rta quloq yallig'lanishi (otit) canalis facialis devorini yemirib, yuz nervi falajiga (Bell falaji) yoki kalla suyagi ichiga tarqalib meningitga olib kelishi mumkin."
      },
      {
        id: "tq_3_2",
        difficulty: "exam",
        question: "Kalla suyagining ichki asosi (Basis cranii interna) chuqurchalari va ulardagi asosiy teshiklar.",
        answer: "Kalla suyagi ichki asosi 3 ta chuqurchaga (fossa) bo'linadi:\n\n1. **Oldingi kalla chuqurchasi (Fossa cranii anterior)**:\n   - Peshona suyagi, g'alvirsimon suyak va ponasimon suyakning kichik qanotlaridan hosil bo'ladi.\n   - *Lamina cribrosa* (g'alvirsimon plastinka) teshiklari orqali I juft kalla nervi (*nn. olfactorii* — hid biluv nervlari) o'tadi.\n\n2. **O'rta kalla chuqurchasi (Fossa cranii media)**:\n   - Ponasimon suyak tanasi va katta qanotlari hamda chakka suyagi toshsimon qismining oldingi yuzasidan tuzilgan.\n   - *Canalis opticus*: II juft nerv (*n. opticus*) va *a. ophthalmica*.\n   - *Fissura orbitalis superior*: III, IV, VI juft nervlar va V juftning 1-shoxi (*n. ophthalmicus*).\n   - *Foramen rotundum*: V juftning 2-shoxi (*n. maxillaris*).\n   - *Foramen ovale*: V juftning 3-shoxi (*n. mandibularis*).\n   - *Foramen spinosum*: *a. meningea media* (o'rta miya pardasi arteriyasi).\n\n3. **Orqa kalla chuqurchasi (Fossa cranii posterior)**:\n   - Ensa suyagi va toshsimon qismning orqa yuzasi.\n   - *Foramen magnum*: uzunchoq miya, umurtqa arteriyalari.\n   - *Porus acusticus internus*: VII (yuz) va VIII (eshituv-muvozanat) nervlari.\n   - *Foramen jugulare*: IX, X, XI nervlar va *v. jugularis interna*.\n   - *Canalis hypoglossi*: XII juft nerv (*n. hypoglossus*).",
        keyPoints: [
          "Fossa cranii anterior: I juft nerv (nn. olfactorii)",
          "Fossa cranii media: II, III, IV, V, VI juft nervlar",
          "Fossa cranii posterior: VII, VIII, IX, X, XI, XII juft nervlar va katta ensa teshigi"
        ],
        latinTerms: ["Fossa cranii anterior", "Fossa cranii media", "Fossa cranii posterior", "Foramen magnum", "Foramen jugulare", "Fissura orbitalis superior"],
        clinicalSignificance: "Kalla suyagi asosi sinishlarida burundan yoki quloqdan likvor (miya-orqa miya suyuqligi) oqishi (likvoreya) va ko'z atrofiga qon quyilishi ('ko'zoynak simptomi') kuzatiladi."
      }
    ]
  },

  // SEMESTR 2 - Ichki a'zolar (Yurak, o'pka, hazm)
  {
    topicOrder: 1,
    semester: 2,
    topicKeywords: ["yurak", "cor", "klapan", "miokard", "perikard"],
    questions: [
      {
        id: "tq_s2_1",
        difficulty: "exam",
        question: "Yurak kameralari, qopqoqlari (valvulae) va qon oqimining yo'nalishi.",
        answer: "Yurak (*Cor*) 4 ta kameradan iborat:\n1. **O'ng bo'lmacha (Atrium dextrum)**: Yuqori va pastki kovak venalar (*v. cava superior et inferior*) hamda yurak toj sinusi (*sinus coronarius*) orqali venoz qon qabul qiladi.\n2. **O'ng qorincha (Ventriculus dexter)**: O'ng bo'lmachadan qonni uch tavaqali qopqoq (*valva tricuspidalis*) orqali oladi va o'pka poyasi (*truncus pulmonalis*) orqali kichik qon aylanish doirasiga haydaydi. Truncus pulmonalis og'zida yarimoysimon qopqoqlar (*valvulae semilunares*) joylashgan.\n3. **Chap bo'lmacha (Atrium sinistrum)**: 4 ta o'pka venasi (*venae pulmonales*) orqali kislorodga boy arterial qonni qabul qiladi.\n4. **Chap qorincha (Ventriculus sinister)**: Ikki tavaqali / mitral qopqoq (*valva bicuspidalis / mitralis*) orqali qonni qabul qilib, aorta qopqog'i (*valva aortae*) orqali butun tanaga (katta qon aylanish doirasi) yuqori bosim bilan haydaydi.\n\n**Miokard qalinligi**: Chap qorincha devori (10-15 mm) o'ng qorincha devoriga (3-5 mm) nisbatan 3 barobar qalinroqdir.",
        keyPoints: [
          "O'ng tomon — venoz qon, chap tomon — arterial qon",
          "O'ng atrioventrikulyar — tricuspidalis (3 tavaqali), chap — mitralis (2 tavaqali)",
          "Aorta va truncus pulmonalis og'zida yarimoysimon (semilunares) qopqoqlar bor"
        ],
        latinTerms: ["Atrium dextrum", "Ventriculus dexter", "Atrium sinistrum", "Ventriculus sinister", "Valva tricuspidalis", "Valva mitralis", "Valva aortae"],
        clinicalSignificance: "Mitral qopqoq stenozi yoki yetishmovchiligi chap bo'lmachada bosim oshishiga va o'pka shishiga (kichik qon aylanish doirasida dimlanish) sabab bo'ladi."
      },
      {
        id: "tq_s2_2",
        difficulty: "advanced",
        question: "Yurakning o'tkazuvchi tizimi (Systema conducens cordis): tugunlar, tutamlar va ularning ketma-ketligi.",
        answer: "Yurakning o'tkazuvchi tizimi miokardning avtomatizmini va sinxron qisqarishini ta'minlaydi. U quyidagi tuzilmalardan iborat:\n\n1. **Sinus-tugun (Nodus sinuatrialis / Kis-Flak tuguni)**:\n   - O'ng bo'lmacha devorida, yuqori kovak vena quyilish joyida joylashgan.\n   - **1-tartibli ritm haydovchisi (peysmeyker)**: daqiqasiga 60-80 ta impuls ishlab chiqaradi.\n\n2. **Atrioventrikulyar tugun (Nodus atrioventricularis / Ashoff-Tavara tuguni)**:\n   - Bo'lmachalararo to'siqning pastki o'ng qismida joylashgan.\n   - Impulsni fiziologik kechiktirish (0.04-0.09 soniya) vazifasini bajaradi, bu esa qorinchalar qisqarishidan oldin bo'lmachalar qonini to'liq o'tkazish imkonini beradi.\n\n3. **Gis tutami (Fasciculus atrioventricularis)**:\n   - Qorinchalararo to'siqdan o'tadi va ikkita oyoqchaga bo'linadi:\n     - *Crus dextrum* (o'ng oyoqcha)\n     - *Crus sinistrum* (chap oyoqcha).\n\n4. **Purkine tolalari (Rami subendocardiales)**:\n   - Qorinchalar miokardi ichiga tarqalib, qisqarish to'lqinini yetkazadi.",
        keyPoints: [
          "Nodus sinuatrialis — asosiy ritm generatori (peysmeyker)",
          "Nodus atrioventricularis impulsni fiziologik kechiktiradi",
          "Gis tutami bo'lmachalar va qorinchalar orasidagi yagona elektr ko'prikdir"
        ],
        latinTerms: ["Nodus sinuatrialis", "Nodus atrioventricularis", "Fasciculus atrioventricularis", "Crus dextrum et sinistrum", "Rami subendocardiales"],
        clinicalSignificance: "AV-blokada (Gis tutami o'tkazuvchanligi to'xtashi) qorinchalarning mustaqil va sekin (20-40 zarba/daq) qisqarishiga va hushdan ketishga (Morgagni-Adams-Stokes sindromi) olib keladi, bu holatda kardiostimulyator o'rnatiladi."
      }
    ]
  },

  // SEMESTR 3 - Markaziy Asab Tizimi (CNS)
  {
    topicOrder: 1,
    semester: 3,
    topicKeywords: ["orqa miya", "medulla spinalis", "segment", "refleks", "ildiz"],
    questions: [
      {
        id: "tq_s3_1",
        difficulty: "exam",
        question: "Orqa miya (Medulla spinalis)ning tashqi va ichki tuzilishi: segmentlar, shoxlar va o'tkazuvchi yo'llar.",
        answer: "Orqa miya (*Medulla spinalis*) umurtqa kanalida joylashgan bo'lib, kattalarda C1 dan L1-L2 umurtqalarigacha davom etadi. Uning pastki konussimon uchi *conus medullaris* bilan tugaydi va undan *filum terminale* boshlanadi.\n\n**Segmentlar**: jami 31 ta segment:\n- 8 ta bo'yin (C1-C8)\n- 12 ta ko'krak (Th1-Th12)\n- 5 ta bel (L1-L5)\n- 5 ta dumg'aza (S1-S5)\n- 1 ta dum (Co1).\n\n**Ichki tuzilishi**:\n- **Kulrang modda (Substantia grisea)**: Ichkarida 'kapalak' shaklida yotadi:\n  - *Cornu anterius* (oldingi shox): harakat (motor) neyronlari joylashgan.\n  - *Cornu posterius* (orqa shox): sezuvchi (sensor) oraliq neyronlar.\n  - *Cornu laterale* (yon shox, Th1-L2): vegetativ (simpatik) markazlar.\n- **Oq modda (Substantia alba)**: Kulrang moddani o'rab turadi va 3 juft tizimcha (*funiculus*) hosil qiladi:\n  - *Funiculus anterior*: ko'tariluvchi va tushuvchi harakat yo'llari (*tractus corticospinalis anterior*).\n  - *Funiculus lateralis*: *tractus corticospinalis lateralis* va spinotalamik yo'llar.\n  - *Funiculus posterior*: chuqur proprioseptiv sezgi yo'llari (*fasciculus gracilis* va *fasciculus cuneatus*).",
        keyPoints: [
          "Orqa miya L1-L2 darajasida tugaydi, pastda conus medullaris va ot dumi (cauda equina) yotadi",
          "Oldingi shox — harakat, orqa shox — sezgi, yon shox — vegetativ",
          "Oq modda funiculus anterior, lateralis, posterior'ga bo'linadi"
        ],
        latinTerms: ["Medulla spinalis", "Conus medullaris", "Cornu anterius", "Cornu posterius", "Cornu laterale", "Funiculus posterior", "Fasciculus gracilis", "Fasciculus cuneatus"],
        clinicalSignificance: "Lombal punksiya (orqa miya suyuqligini olish) orqa miyani jarohatlamaslik uchun L3-L4 yoki L4-L5 umurtqalararo sohasidan o'tkaziladi, chunki bu sohada orqa miya tugab, faqat cauda equina tolalari erkin suzib yuradi."
      },
      {
        id: "tq_s3_2",
        difficulty: "exam",
        question: "Bosh miya yarimsharlari po'stlog'i (Cortex cerebri)ning asosiy egatlari, bo'laklari va birlamchi funksional zonalari.",
        answer: "Bosh miya yarimsharlari 4 ta asosiy bo'lakka bo'linadi:\n\n1. **Peshona bo'lagi (Lobus frontalis)**:\n   - *Gyrus precentralis* (markaziy egatdan oldingi pushta) — **birlamchi harakat markazi** (motor homunculus).\n   - Pastki peshona pushtasining orqa qismi — **Broka markazi** (harakat-nutq markazi, motor aphasia).\n\n2. **Tepa bo'lagi (Lobus parietalis)**:\n   - *Gyrus postcentralis* (markaziy egatdan keyingi pushta) — **birlamchi umumiy sezgi markazi** (og'riq, harorat, teginish).\n\n3. **Chakka bo'lagi (Lobus temporalis)**:\n   - Yuqori chakka pushtasi (*gyrus temporalis superior*) — **birlamchi eshituv markazi** (Heschl pushtasi).\n   - Yuqori chakka pushtasining orqa qismi — **Vernike markazi** (og'zaki nutqni tushunish markazi, sensor aphasia).\n\n4. **Ensa bo'lagi (Lobus occipitalis)**:\n   - *Sulcus calcarinus* (qush panjasi egati) atrofida — **birlamchi ko'ruv markazi**.",
        keyPoints: [
          "Sulcus centralis (Rolando egati) peshona va tepa bo'laklarini ajratadi",
          "Gyrus precentralis — harakat, gyrus postcentralis — sezgi",
          "Broka markazi — nutq so'zlash, Vernike markazi — nutqni tushunish"
        ],
        latinTerms: ["Lobus frontalis", "Lobus parietalis", "Lobus temporalis", "Lobus occipitalis", "Gyrus precentralis", "Gyrus postcentralis", "Sulcus centralis", "Sulcus calcarinus"],
        clinicalSignificance: "Miya insultida gyrus precentralis zararlansa, qarama-qarshi tomon qo'l va oyoqlari falajlanadi (gemiparez / gemiplegiya); Broka markazi zararlansa bemor gapira olmaydi (motor afaziya)."
      }
    ]
  }
];

/**
 * Normalizes an array of raw strings or objects into valid TheoryQuestion objects.
 */
export function normalizeRawQuestions(rawList: any[], semester = 1, order = 1, topicTitle = ''): TheoryQuestion[] {
  if (!Array.isArray(rawList)) return [];
  return rawList.map((item, index) => {
    if (typeof item === 'string') {
      return {
        id: `q_custom_${semester}_${order}_${index + 1}`,
        question: item.trim(),
        answer: `${topicTitle} bo'yicha ushbu nazorat savoli talabaning mustaqil o'zlashtirish darajasini aniqlashga mo'ljallangan.`,
        difficulty: index < 10 ? 'basic' : index < 20 ? 'medium' : index < 25 ? 'advanced' : 'exam',
        keyPoints: [
          "Mavzuning asosiy nazariy qoidalariga tayanish",
          "Anatomik lotincha terminlarni to'g'ri qo'llash"
        ]
      };
    }
    return {
      id: item.id || `q_custom_${semester}_${order}_${index + 1}`,
      question: item.question || item.title || `Nazorat savoli #${index + 1}`,
      questionRu: item.questionRu,
      questionEn: item.questionEn,
      answer: item.answer || `${topicTitle} bo'yicha nazorat savoli tahlili.`,
      answerRu: item.answerRu,
      answerEn: item.answerEn,
      difficulty: item.difficulty || (index % 4 === 0 ? 'exam' : index % 3 === 0 ? 'advanced' : index % 2 === 0 ? 'medium' : 'basic'),
      keyPoints: item.keyPoints || [],
      latinTerms: item.latinTerms || [],
      clinicalSignificance: item.clinicalSignificance
    };
  });
}

/**
 * Har qanday mavzu uchun kami 30 ta nazorat savolini kafolatlangan holda qaytaradi.
 * 1. Agar admin tomonidan Firestore/tizimda saqlangan 'controlQuestions' mavjud bo'lsa, ularni oladi.
 * 2. Mavjud savollar soni 30 tadan kam bo'lsa, yetishmayotgan qismini mavzuga mos savollar bilan to'ldiradi (kami 30 ta).
 * 3. Agar hech qanday oldindan tayyorlangan savol bo'lmasa, mavzuning to'liq 30+ ta nazorat savollarini generatsiya qiladi.
 */
export function getTheoryQuestionsForTopic(topic: {
  id?: string;
  order?: number;
  semester?: number;
  title?: any;
  theory?: any;
  controlQuestions?: any[];
}): TheoryQuestion[] {
  const ord = topic.order || 1;
  const sem = topic.semester || 1;
  const topicTitleStr = typeof topic.title === 'object' ? (topic.title?.uz || '') : (topic.title || '');
  const titleLower = topicTitleStr.toLowerCase();

  let finalQuestions: TheoryQuestion[] = [];

  // 1. Check custom saved control questions (from Firestore / Admin Dashboard)
  if (Array.isArray(topic.controlQuestions) && topic.controlQuestions.length > 0) {
    finalQuestions = normalizeRawQuestions(topic.controlQuestions, sem, ord, topicTitleStr);
  }

  // 2. If not from custom, look for exact or keyword match in curated list
  if (finalQuestions.length === 0) {
    const exactMatch = TOPIC_THEORY_QUESTIONS.find(
      (item) => item.semester === sem && item.topicOrder === ord
    );
    if (exactMatch && exactMatch.questions.length > 0) {
      finalQuestions = [...exactMatch.questions];
    } else {
      const keywordMatch = TOPIC_THEORY_QUESTIONS.find((item) =>
        item.topicKeywords?.some((kw) => titleLower.includes(kw.toLowerCase()))
      );
      if (keywordMatch && keywordMatch.questions.length > 0) {
        finalQuestions = [...keywordMatch.questions];
      }
    }
  }

  // 3. User explicitly requested: "kami 30 ta savol qoy savolni o'zi bo'lsin yetadi"
  // If we have fewer than 30 questions, dynamically generate topic-specific questions to reach at least 30!
  if (finalQuestions.length < 30) {
    const theoryUz = typeof topic.theory === 'object' ? (topic.theory?.uz || '') : (topic.theory || '');
    const needed = 30 - finalQuestions.length;
    const generated = generate30ControlQuestionsForTopic(topicTitleStr, theoryUz, sem, ord);
    
    // Append unique generated questions that don't duplicate existing ones
    const existingTexts = new Set(finalQuestions.map(q => q.question.trim().toLowerCase()));
    for (const g of generated) {
      if (!existingTexts.has(g.question.trim().toLowerCase())) {
        finalQuestions.push(g);
        existingTexts.add(g.question.trim().toLowerCase());
        if (finalQuestions.length >= 30) break;
      }
    }
  }

  return finalQuestions;
}

/**
 * 30 ta eng muhim, chuqur va aniq tibbiy-anatomik nazorat savollarini shakllantiruvchi generator.
 */
export function generate30ControlQuestionsForTopic(
  title: string,
  theory: string,
  semester: number,
  order: number
): TheoryQuestion[] {
  const cleanTitle = title.replace(/^\d+[-–]\s*mavzu\s*[:–-]\s*/i, '').trim() || `Anatomiya Mavzusi #${order}`;

  // Extraction of headings or key terms if available in theory text
  const headings = (theory.match(/^##+\s+(.+)$/gm)?.map((h) => h.replace(/^##+\s+/, '').trim()) || [])
    .filter(h => h.length > 3 && !h.includes('CreativeAnatomyDiagram'));

  const baseQuestionsList: { q: string; a: string; diff: 'basic' | 'medium' | 'advanced' | 'exam' }[] = [
    // 1-5: Ta'rif, umumiy morfologiya va lotincha nomenklatura
    {
      q: `${cleanTitle}ning umumiy anatomik ta'rifi, inson tanasidagi o'rni va asosiy fiziologik vazifalari nimalardan iborat?`,
      a: `${cleanTitle} inson tanasining tayanch, himoya yoki a'zolar tizimidagi muhim anatomik tuzilma hisoblanadi. Uning xalqaro Terminologia Anatomica bo'yicha rasmiy nomi va joylashuvi imtihonning asosiy savolidir.`,
      diff: 'basic'
    },
    {
      q: `${cleanTitle}ning xalqaro Lotin nomenklaturasi (Terminologia Anatomica) bo'yicha rasmiy nomlanishi va sinonimlari.`,
      a: `Ushbu anatomik tuzilma lotin tilida to'g'ri nomlanishi, kelishik qo'shimchalari va tegishli lotincha iboralari bilan yod olinishi lozim.`,
      diff: 'basic'
    },
    {
      q: `${cleanTitle}ning golotopiyasi (tana sohalariga nisbatan joylashuvi) va skeletotopiyasi (umurtqa yoki suyaklarga nisbatan balandligi).`,
      a: `Golotopik jihatdan tegishli tana bo'shlig'i yoki sohasida lokalizatsiyalangan. Skeletotopiyasi aniq umurtqa pog'onasi yoki suyak orientirlari bo'yicha belgilanadi.`,
      diff: 'exam'
    },
    {
      q: `${cleanTitle}ning sintopiyasi: uning oldingi, orqa, yuqori, pastki va yon tomonlarida joylashgan qo'shni a'zolar.`,
      a: `Sintopiya jarrohlikda eng muhim ko'rsatkich hisoblanadi: atrofdagi yirik tomirlar, nervlar va qo'shni a'zolar bilan tutashuv chegaralari ko'rsatiladi.`,
      diff: 'exam'
    },
    {
      q: `${cleanTitle}ning embrional rivojlanishi (embriogenezi) qaysi murtak varaqasidan boshlanadi va ontogenez bosqichlari qanday?`,
      a: `Embrional davrda tegishli mezoderma, endoderma yoki ektoderma qatlamidan rivojlanib, shakllanish davrida murakkab burilish va o'sish fazalarini o'taydi.`,
      diff: 'advanced'
    },

    // 6-10: Yuzalari, qirralari, o'simtalari va relyefi
    {
      q: `${cleanTitle}ning asosiy yuzalari (facies) va ularning anatomik farqlanish belgilari.`,
      a: `Yuzalari shakli, yo'nalishi (oldingi, orqa, medial, lateral) va qo'shni a'zolarga tegib turish relyefi bilan tavsiflanadi.`,
      diff: 'basic'
    },
    {
      q: `${cleanTitle}ning chegaralari, chetlari (margines) va burchaklari (anguli) qanday yo'nalgan?`,
      a: `Chetlari o'tkir, silliq yoki notekis bo'lib, bo'g'im, boylam yoki fassiyalar birikadigan chiziqlarni hosil qiladi.`,
      diff: 'medium'
    },
    {
      q: `${cleanTitle} relyefidagi asosiy bo'rtiqlar (tuber, tuberculum), qirlar (crista) va o'simtalar (processus) qanday nomlanadi?`,
      a: `Ushbu suyak va to'qima relefi muskullar tortishi natijasida shakllanadi va paylar birikadigan maydonchalar hisoblanadi.`,
      diff: 'medium'
    },
    {
      q: `${cleanTitle} yuzasidagi chuqurchalar (fossa, fovea) va egatlar (sulcus) qanday hosil bo'ladi va ularning ichida nima yotadi?`,
      a: `Egatlarda odatda qon tomirlar, nerv tolalari yoki muskullarning boshlang'ich paylari joylashadi.`,
      diff: 'medium'
    },
    {
      q: `${cleanTitle}ning o'ng (dexter) va chap (sinister) tomonlarini bir-biridan qanday anatomik belgilar orqali farqlash mumkin?`,
      a: `Topografik mezonlar (oldingi yuzasi, pastki qirrasi, medial bo'rtig'i) orqali o'ng va chap a'zolarni laboratoriya preparatida aniqlash talab etiladi.`,
      diff: 'exam'
    },

    // 11-15: Teshiklar, kanallar va bo'shliqlar
    {
      q: `${cleanTitle} tarkibidagi teshiklar (foramina) va ulardan o'tuvchi tomir hamda nerv tutamlari ro'yxati.`,
      a: `Har bir foramen orqali o'tuvchi oziqlantiruvchi arteriya, vena va sezuvchi yoki harakatlantiruvchi nerv tarmoqlari imtihon kollokviumining kalit savolidir.`,
      diff: 'exam'
    },
    {
      q: `${cleanTitle} ichidagi kanallar (canales): ularning boshlanish, tugash teshiklari va yo'nalishi.`,
      a: `Kanallarning kranial va kaudal yo'nalishi hamda ularning ichki devorlarining klinik ahamiyati ko'rsatiladi.`,
      diff: 'advanced'
    },
    {
      q: `${cleanTitle} sohasidagi yoriqlar (fissurae) va ularning qo'shni bo'shliqlar bilan tutashuvi.`,
      a: `Kalla suyagi, ko'krak qafasi yoki tos sohasidagi yoriqlar infeksiyaning tarqalish yo'llari va tomir-nervlar o'tishi uchun xizmat qiladi.`,
      diff: 'advanced'
    },
    {
      q: `${cleanTitle} bo'shlig'i (cavitas): hajmi, devorlari va uning ichidagi suyuqlik yoki a'zolar.`,
      a: `Bo'shliq devorlarining qatlamlari, seroz parda (plevra, perikard, qorin pardasi) bilan qoplanishi va bo'shliq bosimi.`,
      diff: 'medium'
    },
    {
      q: `${cleanTitle}ning mikroanatomik va gistologik qatlamlari (ichki, o'rta va tashqi pardalari).`,
      a: `Shilliq qavat, shilliq osti qavati, muskul qavati va seroz (adventitsial) qavatlarning o'ziga xos xususiyatlari.`,
      diff: 'advanced'
    },

    // 16-20: Bo'g'imlar, boylamlar va harakat mexanikasi
    {
      q: `${cleanTitle} qatnashadigan bo'g'imlar (articulationes) va suyaklararo birikmalar (sindesmoz, sinxondroz).`,
      a: `Bo'g'im yuzalarining shakli (sharsimon, ellipsimon, g'altaksimon, egarsimon) va ularning bo'g'im sinflanishidagi o'rni.`,
      diff: 'medium'
    },
    {
      q: `${cleanTitle}ning bo'g'im kapsulasi, sinovial pardasi va bo'g'im ichki yordamchi tuzilmalari (menisk, disk, labrum).`,
      a: `Bo'g'im bo'shlig'ini germetiklovchi kapsula boylamlar bilan mustahkamlanadi, sinovial suyuqlik ishqalanishni kamaytiradi.`,
      diff: 'medium'
    },
    {
      q: `${cleanTitle}ni mustahkamlovchi asosiy boylamlar (ligamenta) va ularning birikish joylari.`,
      a: `Kollateral, kapsuladan tashqari va bo'g'im ichki boylamlar a'zoni haddan tashqari siljish va chiqishdan himoya qiladi.`,
      diff: 'exam'
    },
    {
      q: `${cleanTitle} sohasida qanday harakatlar (bukilish, yozilish, yaqinlashish, uzoqlashish, aylanish) amalga oshiriladi?`,
      a: `Frontal, sagittal va vertikal o'qlar atrofidagi harakat turlari hamda biomekanik erkinlik darajalari.`,
      diff: 'basic'
    },
    {
      q: `${cleanTitle}ga birikuvchi yoki uni harakatlantiruvchi asosiy mushaklar (musculi) guruhlari.`,
      a: `Fleksorlar, ekstenzorlar, rotatorlar, adduktorlar va abduktorlarning boshlanish va birikish nuqtalari.`,
      diff: 'exam'
    },

    // 21-25: Qon bilan ta'minlanishi (vaskulyarizatsiya) va innervatsiya
    {
      q: `${cleanTitle}ni arterial qon bilan ta'minlovchi asosiy manbalar (arteriae) va ularning shoxlanishi.`,
      a: `Magistral arteriya havzasidan ajraluvchi oziqlantiruvchi tarmoqlar a'zoning chuqur va yuzaki qatlamlariga qon yetkazadi.`,
      diff: 'exam'
    },
    {
      q: `${cleanTitle} sohasidagi arterial anastomozlar va kollateral qon aylanish yo'llari qanday tuzilgan?`,
      a: `Asosiy magistral tomir to'silib qolganda (tromboz, ezilish) qon oqimini ta'minlovchi aylanma anastomotik to'rlar.`,
      diff: 'advanced'
    },
    {
      q: `${cleanTitle}dan venoz qon oqimi qaysi venalar (venae) orqali va qaysi yirik venalarga quyiladi?`,
      a: `Chuqur (juft) venalar va teri osti venalari orqali yuqori yoki pastki kovak venalar tizimiga venoz qonning qaytishi.`,
      diff: 'medium'
    },
    {
      q: `${cleanTitle}dan limfa suyuqligining oqib ketish yo'llari va 1-bosqich mintaqaviy limfa tugunlari (nodi lymphoidei).`,
      a: `Onkologik jarayonlarda metastaz tarqalishining oldini olish uchun regional limfatik kollektorlar topografiyasini bilish shart.`,
      diff: 'advanced'
    },
    {
      q: `${cleanTitle}ning sezuvchi (afferent) va harakatlantiruvchi (efferent) somatik innervatsiyasi qaysi nervlar hisobiga amalga oshadi?`,
      a: `Orqa miya nervlarining oldingi shoxlari, periferik chigallar yoki tegishli kalla nervlari tolalari orqali innervatsiya qilinadi.`,
      diff: 'exam'
    },

    // 26-30: Vegetativ tizim, yoshga oid anatomiyasi va klinik ahamiyati
    {
      q: `${cleanTitle}ning vegetativ (simpatik va parasimpatik) innervatsiyasi qaysi tugunlar va chigallar (plexus) orqali boshqariladi?`,
      a: `Simpatik tolalari chegaraviy simpatik ustundan, parasimpatik tolalari esa tegishli kranial yoki sakral markazlardan keladi.`,
      diff: 'advanced'
    },
    {
      q: `${cleanTitle}ning bolalikdagi, o'smirlikdagi va keksa yoshdagi anatomik-morfologik o'zgarishlari.`,
      a: `Suyaklanish yadrolarining paydo bo'lish muddatlari, elastiklik darajasi, atrofiyasi va yoshga oid involution jarayonlari.`,
      diff: 'medium'
    },
    {
      q: `${cleanTitle}ning rentgenografiya, kompyuter tomografiyasi (KT) va MRT tasvirlarida normal anatomik ko'rinishi.`,
      a: `Rentgenogrammada suyak to'qimasi konturlari, kompakt va g'ovak modda qatlamlari hamda bo'g'im yorig'i tahlil qilinadi.`,
      diff: 'exam'
    },
    {
      q: `${cleanTitle} sohasida eng ko'p uchraydigan travmalar, sinishlar, chiqishlar va ularning anatomik mexanizmi.`,
      a: `Travmada suyak sinishi bo'laklarining siljishi yoki yumshoq to'qimalarning ezilishida anatomik tuzilmalar ta'siri baholanadi.`,
      diff: 'exam'
    },
    {
      q: `${cleanTitle}ga oid patologiyalar (yallig'lanish, qisilish, deformatsiya)da qaysi nerv yoki tomirlar zararlanish xavfi eng yuqori?`,
      a: `Topografik xavfli anatomik zonalar (sulcus, canalis, foramen) sohasida kechuvchi asoratlar va ularning klinik sindromlari.`,
      diff: 'exam'
    },
    {
      q: `${cleanTitle} bo'yicha imtihon va kollokvium biletlarida talabadan preparatda amaliy ko'rsatib berish talab etiladigan 5 ta asosiy anatomik orientir.`,
      a: `Laboratoriya mashg'ulotida preparatda a'zoning asosiy yuzasi, proyeksiyasi, o'simtasi, teshigi va tomir-nerv yo'nalishini ko'rsatish talab qilinadi.`,
      diff: 'exam'
    }
  ];

  // Map to TheoryQuestion objects
  return baseQuestionsList.map((item, idx) => ({
    id: `dyn30_${semester}_${order}_${idx + 1}`,
    question: item.q,
    answer: item.a,
    difficulty: item.diff,
    keyPoints: [
      `${cleanTitle}ning topografiyasi va morfologiyasini bilish`,
      "Lotincha terminlarni xatosiz aytish",
      "Klinik amaliyot bilan bog'lay olish"
    ],
    latinTerms: [cleanTitle, "Facies", "Processus", "Sulcus", "Foramen"],
    clinicalSignificance: `${cleanTitle} sohasidagi normal anatomiya mezonlarini buzilishi turli patologik sindromlarga sabab bo'ladi.`
  }));
}

