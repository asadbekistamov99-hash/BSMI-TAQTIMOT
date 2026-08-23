import { CuratedTopicQuiz } from './topicQuizzesData';

export const SEMESTER_1_QUIZZES: CuratedTopicQuiz[] = [
  // ==========================================
  // TOPIC 1: Sath to‘g‘risida tushuncha. Anatomik terminologiya. Umurtqa pog‘onasi
  // ==========================================
  {
    topicOrder: 1,
    topicKeywords: ["terminologiya", "umurtqa", "vertebra", "sath", "columna vertebralis", "atlas", "axis"],
    quizzes: [
      {
        question: "Inson tanasini o'ng va chap teng simmetrik bo'laklarga bo'luvchi sath qanday ataladi?",
        options: ["Planum sagittale medianum", "Planum frontale", "Planum transversale", "Planum horizontale"],
        correctAnswerIndex: 0,
        explanation: "Planum sagittale medianum tanani simmetrik o'ng va chap qismlarga ajratadi."
      },
      {
        question: "Tanani oldingi (ventral) va orqa (dorsal) qismlarga ajratuvchi sath qaysi?",
        options: ["Planum frontale (coronale)", "Planum horizontale", "Planum medianum", "Planum transversale"],
        correctAnswerIndex: 0,
        explanation: "Planum frontale peshonaga parallel bo'lib, tanani oldingi va orqa qismlarga bo'ladi."
      },
      {
        question: "Tanani yuqori (cranial) va pastki (caudal) qismlarga bo'luvchi sath qaysi?",
        options: ["Planum transversale (horizontale)", "Planum frontale", "Planum sagittale", "Planum medianum"],
        correctAnswerIndex: 0,
        explanation: "Planum transversale (gorizontal sath) tanani yuqori va pastki qismlarga ajratadi."
      },
      {
        question: "Tanaga yoki a'zoning markaziga yaqinroq joylashgan strukturani ifodalovchi termin qaysi?",
        options: ["Medialis", "Lateralis", "Intermedius", "Profundus"],
        correctAnswerIndex: 0,
        explanation: "Medialis — o'rta chiziqqa yaqinroq, lateralis — o'rta chiziqdan uzoqroq degan ma'noni bildiradi."
      },
      {
        question: "Qo'l-oyoq a'zolarida tanaga yaqin joylashgan qism qanday ataladi?",
        options: ["Proximalis", "Distalis", "Ventralis", "Dorsalis"],
        correctAnswerIndex: 0,
        explanation: "Proximalis — gavdaga yaqin qism, distalis — gavdadan uzoqroq qism."
      },
      {
        question: "Bo'yin umurtqalarining (vertebrae cervicales) asosiy farqlovchi belgisi nima?",
        options: ["Processus transversus'da foramen transversarium borligi", "Fovea costalis borligi", "Yirik massiv tana", "Qovurg'a o'simtalari borligi"],
        correctAnswerIndex: 0,
        explanation: "Bo'yin umurtqalari ko'ndalang o'simtasida a. vertebralis o'tuvchi foramen transversarium bo'ladi."
      },
      {
        question: "1-bo'yin umurtqasi (Atlas - C1) qaysi tuzilishga ega emas?",
        options: ["Corpus vertebrae (umurtqa tanasi)", "Arcus anterior", "Arcus posterior", "Massa lateralis"],
        correctAnswerIndex: 0,
        explanation: "Atlas umurtqa tanasi va o'tkir o'simtasiga ega emas, u yoylar va yon massalardan iborat."
      },
      {
        question: "2-bo'yin umurtqasi (Axis - C2) ning asosiy xarakterli tuzilmasi qaysi?",
        options: ["Dens axis (tishsimon o'simta)", "Foramen magnum", "Processus styloideus", "Promontorium"],
        correctAnswerIndex: 0,
        explanation: "Axis umurtqasi yuqoriga yo'nalgan Dens axis (tish) o'simtasiga ega."
      },
      {
        question: "6-bo'yin umurtqasining (C6) ko'ndalang o'simtasidagi uyqu arteriyasini bosish mumkin bo'lgan bo'rtiq qaysi?",
        options: ["Tuberculum caroticum (Chassaignac bo'rtig'i)", "Tuberculum anterius", "Tuberculum posterius", "Tuberculum costae"],
        correctAnswerIndex: 0,
        explanation: "C6 ning ko'ndalang o'simtasidagi oldingi bo'rtiq Tuberculum caroticum deb ataladi."
      },
      {
        question: "Bo'rtib chiquvchi umurtqa (Vertebra prominens) deb qaysi umurtqaga aytiladi?",
        options: ["C7 (7-bo'yin umurtqasi)", "C1", "Th1", "L5"],
        correctAnswerIndex: 0,
        explanation: "C7 ning uzun va tarmoqlanmagan processus spinosus'i bo'rtib turadi, shuning uchun vertebra prominens deyiladi."
      },
      {
        question: "Ko'krak umurtqalariga (vertebrae thoracicae) xos bo'lgan belgi qaysi?",
        options: ["Qovurg'alar birikuvchi fovea costalis chuqurchalari mavjudligi", "Foramen transversarium borligi", "Bifid processus spinosus", "Teshiklari uchburchak shaklda bo'lishi"],
        correctAnswerIndex: 0,
        explanation: "Ko'krak umurtqalari tanasida va ko'ndalang o'simtasida qovurg'a bo'g'im chuqurchalari (fovea costalis) bo'ladi."
      },
      {
        question: "Bel umurtqalariga (vertebrae lumbales) xos xususiyat qaysi?",
        options: ["Yirik buyraksimon tana va baquvvat o'simtalar", "Fovea costalis borligi", "Foramen transversarium borligi", "Oldingi yoy mavjudligi"],
        correctAnswerIndex: 0,
        explanation: "Bel umurtqalari tanasi eng yirik va massiv bo'lib, ko'ndalang kesimda loviyasimon shaklda bo'ladi."
      },
      {
        question: "Dumg'aza suyagi (Os sacrum) nechta umurtqaning sinostoz birikuvidan hosil bo'ladi?",
        options: ["5 ta", "4 ta", "7 ta", "12 ta"],
        correctAnswerIndex: 0,
        explanation: "Dumg'aza suyagi 5 ta dumg'aza umurtqasining o'zaro qo'shilib ketishidan hosil bo'ladi."
      },
      {
        question: "Dumg'aza suyagi asosining 5-bel umurtqasi bilan hosil qilgan oldinga bo'rtgan do'ngligi nima deyiladi?",
        options: ["Promontorium (burnoq)", "Apex sacri", "Hiatus sacralis", "Crista sacralis mediana"],
        correctAnswerIndex: 0,
        explanation: "L5 va S1 tutashgan joyda oldinga bo'rtgan qism Promontorium (burnoq) deb ataladi."
      },
      {
        question: "Dumg'aza kanalining pastki chiqish teshigi qanday ataladi?",
        options: ["Hiatus sacralis", "Foramen sacrale anterius", "Canalis sacralis", "Cornu sacrale"],
        correctAnswerIndex: 0,
        explanation: "Dumg'aza kanalining pastki ochilib turuvchi yorig'i Hiatus sacralis hisoblanadi."
      },
      {
        question: "Dum suyagi (Os coccygis) nechta rudimentar umurtqadan iborat?",
        options: ["3-5 ta", "1-2 ta", "6-7 ta", "8 ta"],
        correctAnswerIndex: 0,
        explanation: "Dum suyagi 3-5 ta rudimentar umurtqalarning qo'shilishidan hosil bo'ladi."
      },
      {
        question: "Umurtqa pog'onasida nechta fiziologik egrilik (lordoz va kifoz) mavjud?",
        options: ["4 ta (2 ta lordoz, 2 ta kifoz)", "2 ta", "3 ta", "5 ta"],
        correctAnswerIndex: 0,
        explanation: "Inson umurtqa pog'onasida 4 ta fiziologik egrilik: bo'yin va bel lordozi, ko'krak va dumg'aza kifozi bor."
      },
      {
        question: "Umurtqa pog'onasining oldinga qaragan egriligi nima deb ataladi?",
        options: ["Lordosis", "Kyphosis", "Scoliosis", "Gibbus"],
        correctAnswerIndex: 0,
        explanation: "Lordoz — umurtqa pog'onasining oldinga (ventral) qaragan fiziologik egriligidir."
      },
      {
        question: "Umurtqa pog'onasining orqaga qaragan fiziologik egriligi qanday nomlanadi?",
        options: ["Kyphosis", "Lordosis", "Scoliosis", "Stenosis"],
        correctAnswerIndex: 0,
        explanation: "Kifoz — umurtqa pog'onasining orqaga (dorsal) qaragan egriligidir (ko'krak va dumg'azada)."
      },
      {
        question: "Umurtqalararo diskning markaziy elastik qismi qanday ataladi?",
        options: ["Nucleus pulposus (pulpoz yadro)", "Anulus fibrosus", "Ligamentum flavum", "Lamina cartilaginea"],
        correctAnswerIndex: 0,
        explanation: "Discus intervertebralis markazida suyuqlikka boy, elastik Nucleus pulposus joylashadi."
      },
      {
        question: "Umurtqalararo diskning tashqi tolali xalqasi nima deyiladi?",
        options: ["Anulus fibrosus", "Nucleus pulposus", "Ligamentum nuchae", "Capsula articularis"],
        correctAnswerIndex: 0,
        explanation: "Umurtqalararo disk chekkasini mustahkamlovchi tolali halqa Anulus fibrosus deb ataladi."
      },
      {
        question: "Umurtqa yoylarini bir-biri bilan birlashtiruvchi sariq rangli elastik boylam qaysi?",
        options: ["Ligamentum flavum", "Ligamentum longitudinale anterius", "Ligamentum supraspinale", "Ligamentum interspinale"],
        correctAnswerIndex: 0,
        explanation: "Ligamentum flavum (sariq boylam) qo'shni umurtqa yoylarini (arcus) o'zaro tutashtiradi."
      },
      {
        question: "Umurtqa tanalarining oldingi yuzasi bo'ylab o'tuvchi uzun boylam qaysi?",
        options: ["Ligamentum longitudinale anterius", "Ligamentum longitudinale posterius", "Ligamentum flavum", "Ligamentum nuchae"],
        correctAnswerIndex: 0,
        explanation: "Ligamentum longitudinale anterius barcha umurtqa tanalarining oldingi yuzasidan o'tadi."
      },
      {
        question: "Umurtqa pog'onasining yon tomonga patologik qiyshayishi nima deyiladi?",
        options: ["Scoliosis", "Lordosis", "Kyphosis", "Spondylolysis"],
        correctAnswerIndex: 0,
        explanation: "Umurtqa pog'onasining frontal sathda yon tomonga patologik egrilanishi Skolioz deyiladi."
      },
      {
        question: "Dumg'aza suyagining orqa yuzasidagi o'rta tizma (crista sacralis mediana) qaysi o'simtalar birlashuvidan hosil bo'ladi?",
        options: ["Processus spinosus (o'tkir o'simtalar)", "Processus articularis", "Processus transversus", "Arcus vertebrae"],
        correctAnswerIndex: 0,
        explanation: "Crista sacralis mediana 5 ta dumg'aza umurtqasining processus spinosus'lari qo'shilishidan hosil bo'ladi."
      },
      {
        question: "Umurtqalararo teshik (Foramen intervertebrale) nimaning hisobiga hosil bo'ladi?",
        options: ["Incisura vertebralis superior va inferior qo'shilishidan", "Foramen vertebrale birlashuvidan", "Arcus va corpus orasida", "Processus spinosus'lar orasida"],
        correctAnswerIndex: 0,
        explanation: "Qo'shni umurtqalarning yuqori va pastki o'yiqlari birlashib Foramen intervertebrale ni hosil qiladi."
      },
      {
        question: "Bo'yin sohasidagi ensa suyagidan C7 gacha tortilgan kuchli boylam qaysi?",
        options: ["Ligamentum nuchae (ensa boylami)", "Ligamentum flavum", "Ligamentum cruciatum", "Ligamentum alare"],
        correctAnswerIndex: 0,
        explanation: "Ligamentum nuchae bo'yin o'tkir o'simtalarini tashqi ensa do'ngligi bilan bog'laydi."
      },
      {
        question: "Inson umurtqa pog'onasida jami nechta umurtqa mavjud?",
        options: ["32-34 ta", "28-30 ta", "36-38 ta", "24-26 ta"],
        correctAnswerIndex: 0,
        explanation: "Umurtqa pog'onasi 7 ta bo'yin, 12 ta ko'krak, 5 ta bel, 5 ta dumg'aza, 3-5 ta dum umurtqasidan (jami 32-34) iborat."
      },
      {
        question: "Bo'yin umurtqalari o'tkir o'simtalarining (processus spinosus) C2-C6 dagi xarakterli xususiyati qaysi?",
        options: ["Uchining ikkiga ayrilishi (bifurkatsiya)", "Vertikal pastga yo'nalishi", "Bo'g'im yuzasiga egaligi", "Teshik hosil qilishi"],
        correctAnswerIndex: 0,
        explanation: "C2 dan C6 gacha bo'lgan bo'yin umurtqalari o'tkir o'simtasi uchi ikkiga ayrilgan bo'ladi."
      },
      {
        question: "Ensa suyagi kondilusi bilan 1-bo'yin umurtqasi orasidagi bo'g'im qanday ataladi?",
        options: ["Articulatio atlantooccipitalis", "Articulatio atlantoaxialis mediana", "Articulatio zygapophysialis", "Articulatio costovertebralis"],
        correctAnswerIndex: 0,
        explanation: "Articulatio atlantooccipitalis — ellipsimon bo'g'im bo'lib, boshning egilishi va yozilishini ta'minlaydi."
      }
    ]
  },

  // ==========================================
  // TOPIC 2: Qovurg‘alar. Kurak suyagi. To‘sh suyagi. O‘mrov suyagi
  // ==========================================
  {
    topicOrder: 2,
    topicKeywords: ["qovurg'a", "kurak", "to'sh", "o'mrov", "costa", "scapula", "sternum", "clavicula"],
    quizzes: [
      {
        question: "To'sh suyagiga (Sternum) o'z tog'ayi orqali bevosita birikuvchi haqiqiy qovurg'alar (Costae verae) qaysilar?",
        options: ["1-7 juft", "8-10 juft", "11-12 juft", "1-5 juft"],
        correctAnswerIndex: 0,
        explanation: "1-7 juft qovurg'alar bevosita to'sh suyagiga birikib haqiqiy qovurg'alar deyiladi."
      },
      {
        question: "Soxta qovurg'alar (Costae spuriae) qaysi juftlarni o'z ichiga oladi?",
        options: ["8-10 juft", "1-7 juft", "11-12 juft", "5-7 juft"],
        correctAnswerIndex: 0,
        explanation: "8, 9 va 10-qovurg'alar to'shga to'g'ridan-to'g'ri emas, 7-qovurg'a tog'ayiga qo'shilib qovurg'a yoyini hosil qiladi."
      },
      {
        question: "Yetim (tebranuvchi) qovurg'alar (Costae fluctuantes) deb qaysi qovurg'alarga aytiladi?",
        options: ["11-12 juft", "8-10 juft", "1-3 juft", "7-8 juft"],
        correctAnswerIndex: 0,
        explanation: "11 va 12-juft qovurg'alarning oldingi uchi suyak-tog'ayga birikmasdan qorin devori mushaklari orasida erkin yotadi."
      },
      {
        question: "Qovurg'aning pastki ichki chetidan o'tuvchi qon tomir va nervlar yotadigan egat nima deyiladi?",
        options: ["Sulcus costae", "Sulcus subclavius", "Crista costae", "Collum costae"],
        correctAnswerIndex: 0,
        explanation: "Sulcus costae bo'ylab qovurg'alararo vena, arteriya va nerv (VAN) o'tadi."
      },
      {
        question: "To'sh suyagining (Sternum) uchta asosiy qismi qaysilar?",
        options: ["Manubrium, corpus, processus xiphoideus", "Caput, collum, corpus", "Spina, acromion, fossa", "Basis, apex, incisura"],
        correctAnswerIndex: 0,
        explanation: "To'sh suyagi dasta (manubrium), tana (corpus) va xanjarsimon o'simta (processus xiphoideus) dan iborat."
      },
      {
        question: "To'sh dastasining yuqori chetidagi juft bo'lmagan bo'yinturuq o'yig'i nima deyiladi?",
        options: ["Incisura jugularis", "Incisura clavicularis", "Incisura costalis", "Incisura scapularis"],
        correctAnswerIndex: 0,
        explanation: "Incisura jugularis to'sh dastasining yuqorisidagi chuqur o'yiq hisoblanadi."
      },
      {
        question: "To'sh burchagi (Angulus sterni / Ludovik burchagi) qaysi qismlar orasida hosil bo'ladi va qaysi qovurg'aga to'g'ri keladi?",
        options: ["Manubrium va corpus sterni orasida, 2-qovurg'a birikadigan soha", "Corpus va processus xiphoideus orasida, 5-qovurg'a", "O'mrov va to'sh orasida, 1-qovurg'a", "Dasta va klavikula orasida, 3-qovurg'a"],
        correctAnswerIndex: 0,
        explanation: "To'sh dastasi va tanasi tutashgan Angulus sterni 2-qovurg'a tog'ayi to'shga birikadigan sohaga to'g'ri keladi."
      },
      {
        question: "O'mrov suyagi (Clavicula) qanday tuzilishga ega?",
        options: ["S-simon egilgan naysimon suyak", "Yassi plastinkasimon suyak", "Gubkasimon g'alvirsimon suyak", "G'alati shaklli suyak"],
        correctAnswerIndex: 0,
        explanation: "Clavicula S-simon egrilikka ega bo'lgan uzun naysimon suyak hisoblanadi."
      },
      {
        question: "O'mrov suyagining to'shga birikuvchi uchi qanday ataladi?",
        options: ["Extremitas sternalis", "Extremitas acromialis", "Corpus claviculae", "Tuberculum conoideum"],
        correctAnswerIndex: 0,
        explanation: "O'mrov suyagining to'sh dastasiga birikuvchi uchi Extremitas sternalis deyiladi."
      },
      {
        question: "Kurak suyagining (Scapula) orqa yuzasidagi qirra (Spina scapulae) qaysi o'simta bilan tugaydi?",
        options: ["Acromion", "Processus coracoideus", "Processus styloideus", "Tuberculum majus"],
        correctAnswerIndex: 0,
        explanation: "Spina scapulae lateral tomonga yo'nalib, akromion (Acromion) o'simtasiga aylanadi."
      },
      {
        question: "Kurak suyagining yelka suyagi boshi bilan bo'g'im hosil qiluvchi chuqurchasi qanday ataladi?",
        options: ["Cavitas glenoidalis", "Fossa supraspinata", "Fossa infraspinata", "Fossa subscapularis"],
        correctAnswerIndex: 0,
        explanation: "Cavitas glenoidalis kurak suyagining lateral burchagidagi bo'g'im chuqurchasidir."
      },
      {
        question: "Kurak suyagining oldingi (qovurg'a) yuzasida qaysi chuqurlik joylashadi?",
        options: ["Fossa subscapularis (kurak osti chuqurchasi)", "Fossa supraspinata", "Fossa infraspinata", "Fossa glenoidalis"],
        correctAnswerIndex: 0,
        explanation: "Kurakning oldingi yuzasidagi chuqurlik Fossa subscapularis bo'lib, u yerda m. subscapularis joylashadi."
      },
      {
        question: "Kurakning yuqori chetidagi tumshuqsimon o'simta nima deyiladi?",
        options: ["Processus coracoideus", "Acromion", "Processus styloideus", "Spina scapulae"],
        correctAnswerIndex: 0,
        explanation: "Processus coracoideus (tumshuqsimon o'simta) kurakning yuqori burchagidan oldinga yo'nalgan."
      },
      {
        question: "1-qovurg'aning (Costa prima) yuqori yuzasida qaysi anatomik tuzilma mavjud?",
        options: ["Tuberculum musculi scaleni anterioris", "Sulcus costae", "Facies articularis capitis", "Processus xiphoideus"],
        correctAnswerIndex: 0,
        explanation: "1-qovurg'aning ustki yuzasida oldingi narvonsimon mushak birikadigan Lisfrank bo'rtig'i joylashgan."
      },
      {
        question: "1-qovurg'a ustki yuzasidagi qaysi egat orqali o'mrov osti arteriyasi o'tadi?",
        options: ["Sulcus arteriae subclaviae", "Sulcus venae subclaviae", "Sulcus costae", "Sulcus radialis"],
        correctAnswerIndex: 0,
        explanation: "Tuberculum m. scaleni anterioris'dan orqada Sulcus arteriae subclaviae joylashgan."
      },
      {
        question: "Kurak suyagining orqa yuzasi spina scapulae orqali qaysi ikki chuqurchaga ajraladi?",
        options: ["Fossa supraspinata va fossa infraspinata", "Fossa subscapularis va fossa glenoidalis", "Fossa coracoidea va fossa acromialis", "Fossa iliaca va fossa sacralis"],
        correctAnswerIndex: 0,
        explanation: "Spina scapulae kurakning orqasini Fossa supraspinata (qirra usti) va Fossa infraspinata (qirra osti) chuqurchalariga ajratadi."
      },
      {
        question: "Qovurg'a boshidagi bo'g'im yuzasi (facies articularis capitis costae) qaysi tuzilma bilan bo'g'im hosil qiladi?",
        options: ["Ko'krak umurtqalari tanasidagi fovea costalis bilan", "Ko'ndalang o'simta bilan", "To'sh suyagi bilan", "O'mrov bilan"],
        correctAnswerIndex: 0,
        explanation: "Qovurg'a boshi ko'krak umurtqalari tanasidagi yarim chuqurchalar bilan articulatio capitis costae hosil qiladi."
      },
      {
        question: "Qovurg'a bo'rtig'i (Tuberculum costae) qaysi tuzilma bilan birikadi?",
        options: ["Ko'krak umurtqasining ko'ndalang o'simtasi (processus transversus) bilan", "Umurtqa tanasi bilan", "O'tkir o'simta bilan", "To'sh suyagi bilan"],
        correctAnswerIndex: 0,
        explanation: "Tuberculum costae tegishli ko'krak umurtqasining processus transversus'i bilan bo'g'im hosil qiladi."
      },
      {
        question: "Qovurg'a burchagi (Angulus costae) qovurg'aning qaysi sohasida joylashgan?",
        options: ["Qovurg'a tanasining orqa tomonida, tuberculum costae yonida", "Qovurg'a boshida", "Oldingi tog'ay uchida", "To'sh tutashmasida"],
        correctAnswerIndex: 0,
        explanation: "Angulus costae qovurg'a tanasining keskin burilgan orqa sohasidir."
      },
      {
        question: "Qaysi qovurg'alarda qovurg'a bo'rtig'i (tuberculum costae) bo'lmaydi?",
        options: ["11 va 12-qovurg'alarda", "1 va 2-qovurg'alarda", "6 va 7-qovurg'alarda", "9 va 10-qovurg'alarda"],
        correctAnswerIndex: 0,
        explanation: "11 va 12-qovurg'alarda ko'ndalang o'simtaga birikuvchi tuberculum costae bo'lmaydi."
      },
      {
        question: "Ko'krak qafasining yuqori teshigi (Apertura thoracis superior) nimalar bilan chegaralanadi?",
        options: ["1-ko'krak umurtqasi, 1-juft qovurg'alar va to'sh dastasi yuqori cheti", "12-ko'krak umurtqasi va qovurg'a yoylari", "Diafragma va o'mrov", "7-bo'yin umurtqasi va to'sh burchagi"],
        correctAnswerIndex: 0,
        explanation: "Apertura thoracis superior Th1 tanasi, 1-qovurg'alar va to'sh dastasining incisura jugularis'i bilan chegaralanadi."
      },
      {
        question: "Ko'krak qafasining pastki teshigi (Apertura thoracis inferior) nimadan iborat?",
        options: ["Th12, 12-qovurg'alar, qovurg'a yoyi va processus xiphoideus", "Th1 va 1-qovurg'alar", "Diafragma va o'pka", "To'sh dastasi va 7-qovurg'a"],
        correctAnswerIndex: 0,
        explanation: "Apertura thoracis inferior Th12, 11-12 qovurg'alar, arcus costalis va xanjarsimon o'simta bilan o'ralgan."
      },
      {
        question: "O'mrov suyagining akromion bilan birikuvchi uchi qanday shaklga ega?",
        options: ["Yassilashgan (Extremitas acromialis)", "Dumaloq va qalin", "Uchburchak shaklli", "Tishsimon"],
        correctAnswerIndex: 0,
        explanation: "Extremitas acromialis yassilashgan bo'lib, kurakning akromion o'simtasi bilan birikadi."
      },
      {
        question: "Kurak usti o'yig'i (Incisura scapulae) kurakning qaysi chetida joylashgan?",
        options: ["Margo superior (yuqori chetida)", "Margo medialis", "Margo lateralis", "Angulus inferior"],
        correctAnswerIndex: 0,
        explanation: "Incisura scapulae kurakning yuqori chetida processus coracoideus asosida joylashgan."
      },
      {
        question: "Qovurg'alararo oraliq (Spatium intercostale) nechta bo'ladi?",
        options: ["11 ta", "12 ta", "10 ta", "13 ta"],
        correctAnswerIndex: 0,
        explanation: "12 juft qovurg'a o'rtasida har bir tomonda 11 tadan spatium intercostale bo'ladi."
      },
      {
        question: "To'sh suyagida (Sternum) qizil suyak ko'migi qanday holatda saqlanadi?",
        options: ["Butun umr davomida faol gemopoez markazi sifatida saqlanadi", "Faqat bolalikda bo'ladi", "Faqat dastasida bo'ladi", "20 yoshda to'liq yog' to'qimasiga aylanadi"],
        correctAnswerIndex: 0,
        explanation: "To'sh suyagi gemopoez a'zosi bo'lib, uning dastasidan diagnostik sternal punksiya olinadi."
      },
      {
        question: "Qovurg'a yoyi (Arcus costalis) qaysi qovurg'alar tog'ayining qo'shilishidan hosil bo'ladi?",
        options: ["8, 9, 10-qovurg'alar tog'aylarining 7-qovurg'a tog'ayiga birikishidan", "11 va 12-qovurg'alardan", "1-5 qovurg'alardan", "Faqat 10-qovurg'adan"],
        correctAnswerIndex: 0,
        explanation: "Arcus costalis 8-10-qovurg'alarning 7-qovurg'a tog'ayiga tutashuvidan hosil bo'ladi."
      },
      {
        question: "To'sh osti burchagi (Angulus infrasternalis) qanday shakllanadi?",
        options: ["O'ng va chap qovurg'a yoylarining to'sh xanjarsimon o'simtasi yonida tutashuvidan", "To'sh dastasi va tanasidan", "O'mrov va to'sh suyagidan", "1-qovurg'a va to'shdan"],
        correctAnswerIndex: 0,
        explanation: "O'ng va chap arcus costalis'larning tutashuvidan Angulus infrasternalis hosil bo'ladi."
      },
      {
        question: "Kurak suyagining pastki burchagi (Angulus inferior) qaysi qovurg'a sathiga to'g'ri keladi?",
        options: ["7-qovurg'a (yoki 7-qovurg'alararo soha)", "3-qovurg'a", "11-qovurg'a", "5-qovurg'a"],
        correctAnswerIndex: 0,
        explanation: "Normal qomatda kurakning pastki burchagi 7-qovurg'a sathida joylashadi."
      },
      {
        question: "O'mrov osti mushagi egati (Sulcus musculi subclavii) o'mrov suyagining qaysi yuzasida bo'ladi?",
        options: ["Pastki (facies inferior) yuzasida", "Yuqori yuzasida", "Oldingi chetida", "To'sh uchida"],
        correctAnswerIndex: 0,
        explanation: "O'mrov suyagining pastki yuzasida Sulcus m. subclavii va boylamlar birikuvchi g'adir-budirliklar bor."
      }
    ]
  },

  // ==========================================
  // TOPIC 3: Yelka suyagi. Bilak va tirsak suyaklari. Qo‘l panja suyaklari
  // ==========================================
  {
    topicOrder: 3,
    topicKeywords: ["yelka", "bilak", "tirsak", "humerus", "radius", "ulna", "carpus", "metacarpus", "phalanges"],
    quizzes: [
      {
        question: "Yelka suyagining (Humerus) eng ko'p sinadigan va zaif qismi qaysi?",
        options: ["Collum chirurgicum (jarrohlik bo'yni)", "Collum anatomicum", "Caput humeri", "Corpus humeri"],
        correctAnswerIndex: 0,
        explanation: "Collum chirurgicum yelka suyagi proksimal uchi tanaga o'tadigan zaif joy bo'lib, eng ko'p sinadi."
      },
      {
        question: "Yelka suyagi boshining darhol pastidagi toraygan qism nima deyiladi?",
        options: ["Collum anatomicum", "Collum chirurgicum", "Sulcus intertubercularis", "Crista tuberculi majoris"],
        correctAnswerIndex: 0,
        explanation: "Caput humeri atrofidagi ensiz chiziq Collum anatomicum (anatomik bo'yin) hisoblanadi."
      },
      {
        question: "Yelka suyagining katta bo'rtig'i (Tuberculum majus) qaysi tomonda joylashgan?",
        options: ["Lateral tomonda", "Medial tomonda", "Oldingi tomonda", "Pastki tomonda"],
        correctAnswerIndex: 0,
        explanation: "Tuberculum majus yelka suyagi proksimal uchining lateral tomonida joylashgan."
      },
      {
        question: "Yelka suyagi tanasidagi deltasimon g'adir-budirlik (Tuberositas deltoidea) qaysi mushak birikishi uchun xizmat qiladi?",
        options: ["Musculus deltoideus", "Musculus biceps brachii", "Musculus triceps brachii", "Musculus pectoralis major"],
        correctAnswerIndex: 0,
        explanation: "Tuberositas deltoidea yelka suyagining tashqi yuzasida bo'lib, unga deltasimon mushak birikadi."
      },
      {
        question: "Yelka suyagi orqa yuzasidagi spiral egat (Sulcus nervi radialis) bo'ylab qaysi nerv o'tadi?",
        options: ["Nervus radialis (bilak nervi)", "Nervus ulnaris", "Nervus medianus", "Nervus axillaris"],
        correctAnswerIndex: 0,
        explanation: "Canalis humeromuscularis ichidagi Sulcus n. radialis bo'ylab bilak nervi va a. profunda brachii o'tadi."
      },
      {
        question: "Yelka suyagi kondilusining tirsak suyagi bilan birikuvchi bloksimon qismi nima deyiladi?",
        options: ["Trochlea humeri", "Capitulum humeri", "Epicondylus lateralis", "Fossa radialis"],
        correctAnswerIndex: 0,
        explanation: "Trochlea humeri tirsak suyagining incisura trochlearis'i bilan bo'g'im hosil qiladi."
      },
      {
        question: "Yelka suyagining bilak suyagi boshi bilan birikuvchi sharsimon qismi qaysi?",
        options: ["Capitulum humeri", "Trochlea humeri", "Olecranon", "Epicondylus medialis"],
        correctAnswerIndex: 0,
        explanation: "Capitulum humeri (yelka suyagi boshchasi) radius suyagi caput radii chuqurchasi bilan birikadi."
      },
      {
        question: "Tirsak nervi (Nervus ulnaris) yelka suyagining qaysi o'simtasi orqasidagi egatdan o'tadi?",
        options: ["Epicondylus medialis", "Epicondylus lateralis", "Tuberculum majus", "Tuberculum minus"],
        correctAnswerIndex: 0,
        explanation: "Epicondylus medialis orqasida Sulcus nervi ulnaris joylashgan bo'lib, u yerda nerv teri ostida yuzaki yotadi."
      },
      {
        question: "Tirsak suyagining (Ulna) proksimal uchidagi eng yirik orqa o'simta qaysi?",
        options: ["Olecranon (tirsak o'simtasi)", "Processus coronoideus", "Processus styloideus", "Tuberositas ulnae"],
        correctAnswerIndex: 0,
        explanation: "Olecranon tirsak suyagining orqa-yuqori o'simtasi bo'lib, tirsak bo'g'imi yozilganda fossa olecrani'ga kiradi."
      },
      {
        question: "Tirsak suyagining tojsimon o'simtasi qanday ataladi?",
        options: ["Processus coronoideus", "Olecranon", "Processus styloideus", "Caput ulnae"],
        correctAnswerIndex: 0,
        explanation: "Processus coronoideus tirsak suyagining oldingi o'simtasi hisoblanadi."
      },
      {
        question: "Bilak suyagi (Radius) tananing qaysi tomonida (anatomik holatda) joylashgan?",
        options: ["Lateral (bosh barmoq) tomonida", "Medial (jimjiloq) tomonida", "Orqa tomonda", "Ichki tomonda"],
        correctAnswerIndex: 0,
        explanation: "Radius bilakning lateral (tashqi) tomonida joylashgan bo'lib, bosh barmoqqa to'g'ri keladi."
      },
      {
        question: "Bilak suyagi g'adir-budirligiga (Tuberositas radii) qaysi mushak payi birikadi?",
        options: ["Musculus biceps brachii (yelkaning ikki boshli mushagi)", "Musculus triceps brachii", "Musculus brachialis", "Musculus pronator teres"],
        correctAnswerIndex: 0,
        explanation: "Tuberositas radii'ga m. biceps brachii payi birikadi va bilakni bukish hamda supinatsiya qilishni ta'minlaydi."
      },
      {
        question: "Bilak suyagining pastki uchidagi lateral bigizsimon o'simta nima deyiladi?",
        options: ["Processus styloideus radii", "Processus styloideus ulnae", "Olecranon", "Incisura ulnaris"],
        correctAnswerIndex: 0,
        explanation: "Processus styloideus radii bilak suyagining distal lateral o'simtasidir."
      },
      {
        question: "Qo'l kaft usti suyaklari (Ossa carpi) jami nechta suyakdan iborat?",
        options: ["8 ta (2 qatorda 4 tadan)", "7 ta", "5 ta", "10 ta"],
        correctAnswerIndex: 0,
        explanation: "Kaft usti 8 ta mayda gubkasimon suyaklardan iborat bo'lib, proksimal va distal qatorlarga bo'linadi."
      },
      {
        question: "Kaft usti suyaklarining proksimal qatoriga qaysi suyaklar kiradi (lateral tomondan medialga)?",
        options: ["Os scaphoideum, os lunatum, os triquetrum, os pisiforme", "Os trapezium, os trapezoideum, os capitatum, os hamatum", "Talus, calcaneus, naviculare, cuboideum", "Metacarpus I, II, III, IV"],
        correctAnswerIndex: 0,
        explanation: "Proksimal qatorda qayiqsimon, oysimon, uch qirrali va no'xatsimon suyaklar joylashadi."
      },
      {
        question: "Kaft usti suyaklarining distal qatoriga qaysi suyaklar kiradi (lateral tomondan medialga)?",
        options: ["Os trapezium, os trapezoideum, os capitatum, os hamatum", "Os scaphoideum, os lunatum, os triquetrum, os pisiforme", "Metacarpalia 1-4", "Ossa tarsi"],
        correctAnswerIndex: 0,
        explanation: "Distal qatorda trapetsiya, trapetsiyasimon, boshchali va ilgaksimon suyaklar joylashadi."
      },
      {
        question: "Kaft usti suyaklari orasidagi sesamosimon (muskul payi ichida yotuvchi) suyak qaysi?",
        options: ["Os pisiforme (no'xatsimon suyak)", "Os scaphoideum", "Os capitatum", "Os hamatum"],
        correctAnswerIndex: 0,
        explanation: "Os pisiforme m. flexor carpi ulnaris payi ichida joylashgan sesamosimon suyakdir."
      },
      {
        question: "Kaft usti suyaklarining eng yirigi qaysi?",
        options: ["Os capitatum (boshchali suyak)", "Os scaphoideum", "Os lunatum", "Os trapezium"],
        correctAnswerIndex: 0,
        explanation: "Os capitatum carpus suyaklari orasida markazda joylashgan eng yirik suyakdir."
      },
      {
        question: "Qo'l kaft suyaklari (Ossa metacarpalia) nechta?",
        options: ["5 ta", "4 ta", "7 ta", "8 ta"],
        correctAnswerIndex: 0,
        explanation: "Qo'lda 5 ta naysimon kaft suyaklari (I-V ossa metacarpalia) mavjud."
      },
      {
        question: "Kaft suyaklarining har biri qaysi qismlardan iborat?",
        options: ["Basis (asos), corpus (tana), caput (boshcha)", "Caput, collum, ramus", "Spina, fossa, acromion", "Condylus, epicondylus, apex"],
        correctAnswerIndex: 0,
        explanation: "Har bir naysimon suyak kabi asos (basis), tana (corpus) va boshcha (caput) ga ega."
      },
      {
        question: "Qo'l barmoq suyaklari (Phalanges digitorum manus) da bosh barmoq (Pollex) nechta falangadan iborat?",
        options: ["2 ta (phalanx proximalis va phalanx distalis)", "3 ta", "1 ta", "4 ta"],
        correctAnswerIndex: 0,
        explanation: "Bosh barmoqda o'rta falanga bo'lmaydi, faqat proksimal va distal falangalar bo'ladi."
      },
      {
        question: "2-5 barmoqlar har biri nechta falangadan iborat?",
        options: ["3 ta (proksimal, o'rta, distal)", "2 ta", "4 ta", "1 ta"],
        correctAnswerIndex: 0,
        explanation: "2, 3, 4 va 5-barmoqlarning har birida 3 tadan falanga (jami 14 ta barmoq falangalari) mavjud."
      },
      {
        question: "Yelka suyagi orqa yuzasida joylashgan chuqurlik qaysi?",
        options: ["Fossa olecrani", "Fossa radialis", "Fossa coronoidea", "Fossa glenoidalis"],
        correctAnswerIndex: 0,
        explanation: "Fossa olecrani yelka suyagi distal uchining orqasida joylashgan chuqurlikdir."
      },
      {
        question: "Bilak suyagi boshchasining ustki bo'g'im chuqurchasi (fovea articularis) nima bilan birikadi?",
        options: ["Capitulum humeri bilan", "Trochlea humeri bilan", "Olecranon bilan", "Os lunatum bilan"],
        correctAnswerIndex: 0,
        explanation: "Caput radii ustidagi fovea articularis yelka suyagining capitulum humeri bo'g'im yuzasiga mos keladi."
      },
      {
        question: "Tirsak suyagining pastki distal uchida nima joylashgan?",
        options: ["Caput ulnae va processus styloideus ulnae", "Olecranon", "Processus coronoideus", "Incisura trochlearis"],
        correctAnswerIndex: 0,
        explanation: "Ulna distal uchida Caput ulnae va bigizsimon o'simta (processus styloideus) joylashadi."
      },
      {
        question: "Kaft usti egati (Sulcus carpi) qaysi tomondan joylashgan va nimalardan hosil bo'ladi?",
        options: ["Kaftning kaft (palmar) yuzasida suyaklar do'ngliklari orasida", "Kaftning orqa yuzasida", "Bosh barmoq asosida", "Bilak suyagi bo'ynida"],
        correctAnswerIndex: 0,
        explanation: "Sulcus carpi kaft yuzasida bo'lib, uning ustidan retinaculum flexorum yopilganda canalis carpi hosil bo'ladi."
      },
      {
        question: "Kaft suyaklari orasidagi bo'shliqlar qanday nomlanadi?",
        options: ["Spatia interossea metacarpi", "Canalis carpi", "Sulcus carpi", "Fossa metacarpalis"],
        correctAnswerIndex: 0,
        explanation: "Kaft suyaklari tanalari orasidagi oraliq Spatia interossea metacarpi deyiladi."
      },
      {
        question: "Yelka suyagining xirurgik bo'yni singanda qaysi nerv zararlanish xavfi eng yuqori?",
        options: ["Nervus axillaris", "Nervus medianus", "Nervus ulnaris", "Nervus musculocutaneus"],
        correctAnswerIndex: 0,
        explanation: "N. axillaris collum chirurgicum sohasini orqadan o'rab o'tganligi sababli, bu joy singanda oson shikastlanadi."
      },
      {
        question: "Bilak suyagining tipik joydan sinishi (Colles sinishi) uning qaysi qismiga to'g'ri keladi?",
        options: ["Distal uchining metaepifiz sohasiga", "Proksimal boshchasiga", "Diafiz o'rtasiga", "Tirsak bo'g'imi ichiga"],
        correctAnswerIndex: 0,
        explanation: "Colles sinishi bilak suyagining distal uchi (bo'g'im yuzasidan 2-3 sm yuqorida) sodir bo'ladi."
      },
      {
        question: "Kaft usti suyaklaridan eng ko'p sinishga uchraydigan suyak qaysi?",
        options: ["Os scaphoideum (qayiqsimon suyak)", "Os pisiforme", "Os capitatum", "Os hamatum"],
        correctAnswerIndex: 0,
        explanation: "Yiqilganda qo'l kafti bilan tiralish natijasida eng ko'p Os scaphoideum sinadi."
      }
    ]
  },

  // ==========================================
  // TOPIC 4: Chanoq suyagi. Son, boldir va oyoq panja suyaklari
  // ==========================================
  {
    topicOrder: 4,
    topicKeywords: ["chanoq", "son", "boldir", "femur", "tibia", "fibula", "os coxae", "pelvis", "patella", "tarsus"],
    quizzes: [
      {
        question: "Chanoq suyagi (Os coxae) qaysi uchta alohida suyakning sinostoz birikuvidan hosil bo'ladi?",
        options: ["Os ilium, os ischii, os pubis", "Sacrum, coccyx, femur", "Patella, tibia, fibula", "Talus, calcaneus, naviculare"],
        correctAnswerIndex: 0,
        explanation: "Chanoq suyagi yonbosh (os ilium), o'tirg'ich (os ischii) va qov (os pubis) suyaklarining birikuvidan iborat."
      },
      {
        question: "Chanoq suyagida uchala suyak tanasi qaysi chuqurlik sohasida tutashadi?",
        options: ["Acetabulum (sirka kosachasi)", "Foramen obturatum", "Fossa iliaca", "Incisura ischiadica major"],
        correctAnswerIndex: 0,
        explanation: "Acetabulum chanoq suyagining tashqi yuzasidagi son suyagi boshi kiruvchi chuqurlik bo'lib, 3 suyak tutashmasidir."
      },
      {
        question: "Yonbosh suyagi qanotining yuqori erkin cheti nima deyiladi?",
        options: ["Crista iliaca (yonbosh qirrasi)", "Spina iliaca", "Linea arcuata", "Fossa iliaca"],
        correctAnswerIndex: 0,
        explanation: "Crista iliaca yonbosh suyagi qanotining ustki qalinlashgan S-simon qirrasidir."
      },
      {
        question: "Crista iliaca'ning oldingi-yuqori uchidagi paypaslanadigan o'simta qaysi?",
        options: ["Spina iliaca anterior superior (SIAS)", "Spina iliaca anterior inferior", "Spina iliaca posterior superior", "Tuber ischiadicum"],
        correctAnswerIndex: 0,
        explanation: "Spina iliaca anterior superior (oldingi yuqori yonbosh o'simtasi) muhim topografik mo'ljaldir."
      },
      {
        question: "O'tirg'ich suyagining inson o'tirganda tana og'irligini ko'taruvchi qalin bo'rtig'i nima deyiladi?",
        options: ["Tuber ischiadicum (o'tirg'ich do'ngligi)", "Spina ischiadica", "Ramus ossis ischii", "Corpus ossis ischii"],
        correctAnswerIndex: 0,
        explanation: "Tuber ischiadicum o'tirg'ich suyagi pastki egri qismidagi massiv bo'rtiqdir."
      },
      {
        question: "Chanoq suyagidagi yopuvchi teshik (Foramen obturatum) qaysi suyaklar shoxlari orasida hosil bo'ladi?",
        options: ["Os pubis va os ischii shoxlari orasida", "Os ilium va os pubis orasida", "Os ilium va sacrum orasida", "Acetabulum ichida"],
        correctAnswerIndex: 0,
        explanation: "Foramen obturatum qov va o'tirg'ich suyaklarining shoxlari bilan chegaralanadi."
      },
      {
        question: "Katta va kichik o'tirg'ich o'yiqlarini (incisura ischiadica major va minor) bir-biridan qaysi o'simta ajratib turadi?",
        options: ["Spina ischiadica", "Tuber ischiadicum", "Spina iliaca posterior inferior", "Pecten ossis pubis"],
        correctAnswerIndex: 0,
        explanation: "Spina ischiadica katta va kichik o'tirg'ich o'yiqlari orasidagi o'tkir o'simtadir."
      },
      {
        question: "Odam tanasidagi eng uzun va eng massiv naysimon suyak qaysi?",
        options: ["Femur (Son suyagi)", "Tibia", "Humerus", "Fibula"],
        correctAnswerIndex: 0,
        explanation: "Femur (son suyagi) inson skeletidagi eng uzun va eng baquvvat naysimon suyakdir."
      },
      {
        question: "Son suyagi boshchasining markazidagi chuqurcha (Fovea capitis femoris) ga nima birikadi?",
        options: ["Ligamentum capitis femoris (son suyagi boshchasi boylami)", "Ligamentum iliofemorale", "Ligamentum pubofemorale", "Meniscus lateralis"],
        correctAnswerIndex: 0,
        explanation: "Fovea capitis femoris ichiga a. capitis femoris qon tomirini tutuvchi boylam birikadi."
      },
      {
        question: "Son suyagi bo'ynining lateral tomonidagi yirik ko'rich qanday ataladi?",
        options: ["Trochanter major (katta ko'rich)", "Trochanter minor", "Epicondylus lateralis", "Condylus medialis"],
        correctAnswerIndex: 0,
        explanation: "Trochanter major son suyagining yuqori-lateral qismida joylashgan yirik bo'rtiqdir."
      },
      {
        question: "Son suyagi tanasining (corpus femoris) orqa yuzasida joylashgan chiziq nima deyiladi?",
        options: ["Linea aspera (g'adir-budir chiziq)", "Linea intertrochanterica", "Crista intertrochanterica", "Linea pectinea"],
        correctAnswerIndex: 0,
        explanation: "Linea aspera son suyagi orqasidagi labium mediale va laterale'dan iborat bo'lib, mushaklar birikadi."
      },
      {
        question: "Tizza qopqog'i (Patella) qanday suyak turiga kiradi?",
        options: ["Eng yirik sesamosimon suyak", "Yassi suyak", "Naysimon suyak", "G'alvirsimon suyak"],
        correctAnswerIndex: 0,
        explanation: "Patella m. quadriceps femoris payi ichida rivojlangan eng yirik sesamosimon suyakdir."
      },
      {
        question: "Katta boldir suyagi (Tibia) boldirning qaysi tomonida joylashgan?",
        options: ["Medial (ichki) tomonida", "Lateral (tashqi) tomonida", "Orqa tomonida", "Oldingi chuqurlikda"],
        correctAnswerIndex: 0,
        explanation: "Tibia boldirning medial tomonidagi og'irlik ko'taruvchi asosiy suyagidir."
      },
      {
        question: "Katta boldir suyagi proksimal uchidagi bo'g'im yuzalari orasidagi do'nglik nima deyiladi?",
        options: ["Eminentia intercondylaris", "Tuberositas tibiae", "Malleolus medialis", "Caput tibiae"],
        correctAnswerIndex: 0,
        explanation: "Eminentia intercondylaris kondiluslar orasidagi do'nglik bo'lib, unga xochsimon boylamlar birikadi."
      },
      {
        question: "Katta boldir suyagi tanasining oldingi yuqori g'adir-budirligiga (Tuberositas tibiae) nima birikadi?",
        options: ["Ligamentum patellae (tizza qopqog'i boylami)", "Musculus biceps femoris", "Tendo calcaneus", "Ligamentum collaterale tibiale"],
        correctAnswerIndex: 0,
        explanation: "Tuberositas tibiae'ga to'rt boshli mushakning davomi bo'lgan Ligamentum patellae birikadi."
      },
      {
        question: "Katta boldir suyagining distal medial o'simtasi nima deyiladi?",
        options: ["Malleolus medialis (ichki to'piq)", "Malleolus lateralis", "Caput fibulae", "Sustentaculum tali"],
        correctAnswerIndex: 0,
        explanation: "Malleolus medialis Tibia'ning pastki medial to'pig'i hisoblanadi."
      },
      {
        question: "Kichik boldir suyagi (Fibula) distal uchida qaysi tuzilmani hosil qiladi?",
        options: ["Malleolus lateralis (tashqi to'piq)", "Malleolus medialis", "Tuberositas fibulae", "Condylus lateralis"],
        correctAnswerIndex: 0,
        explanation: "Fibula suyagining pastki uchi tashqi to'piqni (Malleolus lateralis) hosil qiladi."
      },
      {
        question: "Oyoq kaft usti suyaklari (Ossa tarsi) jami nechta suyakdan iborat?",
        options: ["7 ta", "8 ta", "5 ta", "14 ta"],
        correctAnswerIndex: 0,
        explanation: "Ossa tarsi 7 ta gubkasimon suyakdan iborat (qo'ldagidan 1 ta kam)."
      },
      {
        question: "Oyoq kaft usti suyaklarining (Ossa tarsi) eng yirik suyagi qaysi?",
        options: ["Calcaneus (tovon suyagi)", "Talus (oshiq suyagi)", "Os naviculare", "Os cuboideum"],
        correctAnswerIndex: 0,
        explanation: "Calcaneus (tovon suyagi) eng yirik suyak bo'lib, orqa qismida tuber calcanei bo'rtig'i bor."
      },
      {
        question: "Boldir suyaklari bilan bevosita bo'g'im hosil qiluvchi oyoq kaft usti suyagi qaysi?",
        options: ["Talus (oshiq suyagi)", "Calcaneus", "Os naviculare", "Os cuneiforme mediale"],
        correctAnswerIndex: 0,
        explanation: "Talus suyagining bloki (trochlea tali) katta va kichik boldir suyaklari to'piqlari bilan bo'g'im hosil qiladi."
      },
      {
        question: "Oyoq kaft ustidagi 7 ta suyak ro'yxati to'g'ri berilgan qatorni toping:",
        options: ["Talus, calcaneus, os naviculare, os cuboideum, ossa cuneiformia (mediale, intermedium, laterale)", "Scaphoideum, lunatum, triquetrum, pisiforme, hamatum", "Talus, calcaneus, patella, femur, tibia", "Metatarsalia 1-5, phalanges"],
        correctAnswerIndex: 0,
        explanation: "Tarsus 7 ta suyakdan iborat: oshiq, tovon, qayiqsimon, kubsimon va 3 ta ponasimon suyaklar."
      },
      {
        question: "Tovon suyagidagi oshiq suyagini ko'tarib turuvchi o'simta qanday ataladi?",
        options: ["Sustentaculum tali", "Tuber calcanei", "Trochlea tali", "Sinus tarsi"],
        correctAnswerIndex: 0,
        explanation: "Sustentaculum tali tovon suyagining medial yuzasidan bo'rtib chiqqan tayanch o'simtadir."
      },
      {
        question: "Oyoq kaft suyaklari (Ossa metatarsalia) nechta?",
        options: ["5 ta (I-V)", "7 ta", "8 ta", "4 ta"],
        correctAnswerIndex: 0,
        explanation: "Oyoqda 5 ta qisqa naysimon kaft suyaklari (ossa metatarsalia) mavjud."
      },
      {
        question: "5-oyoq kaft suyagi asosidagi paypaslanadigan bo'rtiq nima deyiladi?",
        options: ["Tuberositas ossis metatarsalis quinti (V)", "Tuberositas ossis navicularis", "Tuber calcanei", "Trochanter major"],
        correctAnswerIndex: 0,
        explanation: "5-oyoq kaft suyagi asosidagi Tuberositas ossis metatarsi V m. fibularis brevis birikadigan sohadir."
      },
      {
        question: "Oyoq bosh barmog'i (Hallux) nechta falangadan iborat?",
        options: ["2 ta (proksimal va distal)", "3 ta", "1 ta", "4 ta"],
        correctAnswerIndex: 0,
        explanation: "Hallux (oyoq bosh barmog'i) qo'ldagi kabi faqat 2 ta falangaga ega."
      },
      {
        question: "Chanoq suyagining quloqsimon bo'g'im yuzasi (Facies auricularis) qaysi suyak bilan birikadi?",
        options: ["Os sacrum (dumg'aza suyagi) bilan", "Femur bilan", "L5 umurtqasi bilan", "Patella bilan"],
        correctAnswerIndex: 0,
        explanation: "Yonbosh suyagining Facies auricularis'i dumg'aza suyagining ayni shunday yuzasi bilan articulatio sacroiliaca hosil qiladi."
      },
      {
        question: "Katta va kichik chanoqni bir-biridan ajratib turuvchi chiziq qanday ataladi?",
        options: ["Linea terminalis (chegaralovchi chiziq)", "Linea aspera", "Linea arcuata", "Crista iliaca"],
        correctAnswerIndex: 0,
        explanation: "Linea terminalis promontorium, linea arcuata, pecten ossis pubis va symphysis pubis'dan o'tadi."
      },
      {
        question: "Son suyagi bo'yni va tanasi orasidagi burchak (inklinatsiya burchagi) normada kattalarda necha gradus?",
        options: ["120 - 130 gradus", "90 gradus", "160 gradus", "180 gradus"],
        correctAnswerIndex: 0,
        explanation: "Kattalarda son suyagining kollodiafizar burchagi odatda 120-130° atrofida bo'ladi."
      },
      {
        question: "Kichik boldir suyagi (Fibula) tizza bo'g'imini hosil qilishda qatnashadimi?",
        options: ["Qatnashmaydi (tizza bo'g'imi bo'shlig'iga kirmaydi)", "Qatnashadi", "Faqat menisk orqali qatnashadi", "Faqat kapsulasi orqali qatnashadi"],
        correctAnswerIndex: 0,
        explanation: "Fibula tizza bo'g'imida bevosita ishtirok etmaydi, u faqat tibianing lateral kondilusiga birikadi."
      },
      {
        question: "Oyoq gumbazining bo'ylama va ko'ndalang tuzilishi qanday asosiy vazifani bajaradi?",
        options: ["Yurganda va sakraganda amortizatsiya (zarbani yumshatish) vazifasini", "Faqat oyoqni og'irlashtirish", "Suyaklar sonini ko'paytirish", "Qon tomirlarni siqish"],
        correctAnswerIndex: 0,
        explanation: "Oyoq panjasi gumbazlari (arcus pedis) tana og'irligini taqsimlab, elastik amortizatsiyani ta'minlaydi."
      }
    ]
  },

  // ==========================================
  // TOPIC 5: Kalla suyaklari (Ensa, Tepa, Peshona, Chakka, Ponasimon, Yuz suyaklari)
  // ==========================================
  {
    topicOrder: 5,
    topicKeywords: ["kalla", "cranium", "occipitale", "parietale", "frontale", "temporale", "sphenoidale", "ethmoidale", "maxilla", "mandibula"],
    quizzes: [
      {
        question: "Kalla suyagining miya qutisi (Neurocranium) nechta suyakdan iborat?",
        options: ["8 ta (2 ta juft, 4 ta toq)", "14 ta", "6 ta", "10 ta"],
        correctAnswerIndex: 0,
        explanation: "Neurocranium 8 ta suyakdan iborat: toq (os frontale, occipitale, sphenoidale, ethmoidale) va juft (os parietale, temporale)."
      },
      {
        question: "Kallaning yuz qismi (Viscerocranium) nechta suyakdan iborat?",
        options: ["15 ta (6 ta juft, 3 ta toq)", "8 ta", "12 ta", "20 ta"],
        correctAnswerIndex: 0,
        explanation: "Viscerocranium 15 ta suyakdan iborat: juft (maxilla, os zygomaticum, palatinum, nasale, lacrimale, concha nasalis inferior) va toq (mandibula, vomer, os hyoideum)."
      },
      {
        question: "Ensa suyagidagi (Os occipitale) eng yirik teshik nima deyiladi?",
        options: ["Foramen magnum (katta ensa teshigi)", "Foramen jugulare", "Foramen lacerum", "Foramen ovale"],
        correctAnswerIndex: 0,
        explanation: "Foramen magnum orqali uzunchoq miya orqa miyaga o'tadi va a. vertebralis'lar kalla ichiga kiradi."
      },
      {
        question: "Ensa suyagi tana qismining (pars basilaris) ichki yuzasidagi qiya nishablik qanday nomlanadi?",
        options: ["Clivus (qiyalik)", "Protuberantia occipitalis interna", "Crista occipitalis", "Condylus occipitalis"],
        correctAnswerIndex: 0,
        explanation: "Clivus ensa suyagi va ponasimon suyak tanasining birlashuvidan hosil bo'lib, ustida ko'prik va uzunchoq miya yotadi."
      },
      {
        question: "Peshona suyagi (Os frontale) ichidagi pnevmatik bo'shliq qaysi?",
        options: ["Sinus frontalis", "Sinus sphenoidalis", "Sinus maxillaris", "Cellulae ethmoidales"],
        correctAnswerIndex: 0,
        explanation: "Sinus frontalis peshona suyagi tangachasi ichidagi juft havoli bo'shliqdir."
      },
      {
        question: "Ponasimon suyak (Os sphenoidale) tanasining ustki yuzasida gipofiz bezi yotuvchi tuzilma nima?",
        options: ["Sella turcica (Turk egari)", "Sulcus chiasmatis", "Canalis opticus", "Fissura orbitalis superior"],
        correctAnswerIndex: 0,
        explanation: "Sella turcica markazidagi Fossa hypophysialis'da gipofiz bezi joylashadi."
      },
      {
        question: "Ponasimon suyakning katta qanotida (Ala major) qaysi teshiklar joylashgan (oldingidan orqaga)?",
        options: ["Foramen rotundum, foramen ovale, foramen spinosum", "Foramen magnum, foramen jugulare", "Foramen stylomastoideum, meatus acusticus", "Canalis caroticus, canalis opticus"],
        correctAnswerIndex: 0,
        explanation: "Ala major'da Foramen rotundum (V2), foramen ovale (V3) va foramen spinosum (a. meningea media) ketma-ket joylashgan."
      },
      {
        question: "Chakka suyagi (Os temporale) qaysi asosiy qismlardan iborat?",
        options: ["Pars petrosa (piramida), pars tympanica, pars squamosa", "Pars basilaris, pars lateralis, squama", "Corpus, alae majores, alae minores", "Corpus, ramus, angulus"],
        correctAnswerIndex: 0,
        explanation: "Chakka suyagi toshsimon qism (piramida), nog'ora qismi va tangachasimon qismdan iborat."
      },
      {
        question: "Chakka suyagi piramidasining pastki yuzasidagi uzun o'tkir o'simta qaysi?",
        options: ["Processus styloideus (bigizsimon o'simta)", "Processus mastoideus", "Processus zygomaticus", "Processus coronoideus"],
        correctAnswerIndex: 0,
        explanation: "Processus styloideus piramida ostidagi bigizsimon o'simta bo'lib, unga 'anatomik guldasta' mushaklari birikadi."
      },
      {
        question: "Yuz nervi (Nervus facialis - VII) chakka suyagidan qaysi teshik orqali tashqariga chiqadi?",
        options: ["Foramen stylomastoideum", "Meatus acusticus internus", "Foramen ovale", "Foramen lacerum"],
        correctAnswerIndex: 0,
        explanation: "N. facialis canalis facialis bo'ylab o'tib, Foramen stylomastoideum orqali kalla asosidan tashqariga chiqadi."
      },
      {
        question: "Ichki uyqu arteriyasi (A. carotis interna) chakka suyagining qaysi kanali orqali kalla ichiga kiradi?",
        options: ["Canalis caroticus", "Canalis facialis", "Canalis musculotubarius", "Canalis condylaris"],
        correctAnswerIndex: 0,
        explanation: "Canalis caroticus chakka suyagi piramidasining pastki yuzasidan boshlanib piramida uchidan ochiladi."
      },
      {
        question: "G'alvirsimon suyakning (Os ethmoidale) kalla bo'shlig'iga qaragan vertikal o'simtasi nima deyiladi?",
        options: ["Crista galli (xo'roz toji)", "Lamina cribrosa", "Lamina perpendicularis", "Concha nasalis superior"],
        correctAnswerIndex: 0,
        explanation: "Crista galli kalla ichki asosida joylashgan bo'lib, unga falx cerebri (katta miya o'rog'i) birikadi."
      },
      {
        question: "Hid biluv nervi (Nervus olfactorius - I) tolalari kalla suyagining qaysi plastinkasidan o'tadi?",
        options: ["Lamina cribrosa (g'alvirsimon plastinka)", "Lamina perpendicularis", "Lamina orbitalis", "Tegmen tympani"],
        correctAnswerIndex: 0,
        explanation: "Lamina cribrosa'dagi mayda teshikchalar orqali hid biluvchi nerv iplari burun bo'shlig'idan kalla ichiga o'tadi."
      },
      {
        question: "Yuqori jag' suyagining (Maxilla) eng yirik havoli bo'shlig'i qaysi?",
        options: ["Sinus maxillaris (Gaymor bo'shlig'i)", "Sinus frontalis", "Sinus sphenoidalis", "Cellulae mastoideae"],
        correctAnswerIndex: 0,
        explanation: "Sinus maxillaris (Highmori) yuqori jag' suyagi tanasida joylashgan eng katta burun yondosh bo'shlig'idir."
      },
      {
        question: "Yuqori jag' suyagida tish katakchalari joylashgan o'simta nima deyiladi?",
        options: ["Processus alveolaris", "Processus palatinus", "Processus frontalis", "Processus zygomaticus"],
        correctAnswerIndex: 0,
        explanation: "Processus alveolaris yuqori tishlar joylashuvchi arcus alveolaris'ni hosil qiladi."
      },
      {
        question: "Pastki jag' suyagi (Mandibula) qaysi qismlardan iborat?",
        options: ["Corpus mandibulae (tana) va ikkita Ramus mandibulae (shox)", "Faqat corpus va processus alveolaris", "Squama va piramida", "Spina va acromion"],
        correctAnswerIndex: 0,
        explanation: "Mandibula toq bo'lib, tanasi va ikkita ko'tariluvchi shoxdan (ramus) iborat."
      },
      {
        question: "Pastki jag' shoxi yuqori uchida qaysi ikki o'simtaga bo'linadi?",
        options: ["Processus coronoideus (oldingi) va Processus condylaris (orqa)", "Processus styloideus va mastoideus", "Processus alveolaris va palatinus", "Processus zygomaticus va frontalis"],
        correctAnswerIndex: 0,
        explanation: "Ramus mandibulae tepasida tojsimon (oldingi) va bo'g'im (orqa) o'simtalariga ajraladi."
      },
      {
        question: "Pastki jag' suyagining ichki yuzasida pastki alveolyar nerv kiruvchi teshik qaysi?",
        options: ["Foramen mandibulae", "Foramen mentale", "Foramen ovale", "Foramen infraorbitale"],
        correctAnswerIndex: 0,
        explanation: "Foramen mandibulae jag' shoxining ichki yuzasida joylashgan bo'lib, canalis mandibulae'ga ochiladi."
      },
      {
        question: "Pastki jag' kanalining oldingi yuzadagi chiqish teshigi nima deyiladi?",
        options: ["Foramen mentale (iyak teshigi)", "Foramen mandibulae", "Foramen incisivum", "Foramen palatinum majus"],
        correctAnswerIndex: 0,
        explanation: "Foramen mentale 1-2 kichik oziq tishlar ostida bo'lib, a. va n. mentalis chiqadi."
      },
      {
        question: "Yonoq suyagi (Os zygomaticum) qaysi suyoklar bilan birikib yonoq yoyini (Arcus zygomaticus) hosil qiladi?",
        options: ["Chakka suyagining processus zygomaticus'i bilan", "Peshona suyagi bilan", "Ensa suyagi bilan", "Pastki jag' bilan"],
        correctAnswerIndex: 0,
        explanation: "Os zygomaticum va os temporale'ning processus zygomaticus'i qo'shilib Arcus zygomaticus'ni hosil qiladi."
      },
      {
        question: "Dimog' suyagi (Vomer) burun bo'shlig'ining qaysi qismini hosil qiladi?",
        options: ["Suyakli burun to'sig'ining (Septum nasi osseum) orqa-pastki qismini", "Burun bo'shlig'i pastki devorini", "Burun bo'shlig'i yuqori devorini", "Ko'z kosasi tubini"],
        correctAnswerIndex: 0,
        explanation: "Vomer toq yassi suyak bo'lib, suyakli burun to'sig'ining orqa va pastki qismini shakllantiradi."
      },
      {
        question: "Ko'z yoshi suyagi (Os lacrimale) qayerda joylashgan?",
        options: ["Ko'z kosasining medial devori oldingi qismida", "Ko'z kosasining lateral devorida", "Kallaning orqasida", "Yuz suyagining pastida"],
        correctAnswerIndex: 0,
        explanation: "Os lacrimale ko'z kosasining medial devorida joylashgan yupqa juft suyakdir."
      },
      {
        question: "Til osti suyagi (Os hyoideum) skeletning boshqa suyaklari bilan qanday bog'langan?",
        options: ["Boshqa suyaklar bilan bevosita bo'g'im hosil qilmaydi, boylamlar va mushaklar orqali tutilib turadi", "Pastki jag' bilan sinostoz birikadi", "Bo'yin umurtqalari bilan bo'g'im hosil qiladi", "To'sh suyagiga sinxondroz birikadi"],
        correctAnswerIndex: 0,
        explanation: "Os hyoideum hech qaysi suyak bilan bevosita bo'g'im hosil qilmay, boylam va mushaklar hisobiga muallaq turadi."
      },
      {
        question: "Kalla qopqog'i suyaklari (Calvaria) qanday suyaklanish turiga ega?",
        options: ["Birlamchi (desmal / pardali) suyaklanish", "Ikkilamchi (xondral) suyaklanish", "Perixondral suyaklanish", "Enxondral suyaklanish"],
        correctAnswerIndex: 0,
        explanation: "Kalla qopqog'i suyaklari to'g'ridan-to'g'ri biriktiruvchi to'qimadan (desmal) suyaklanadi."
      },
      {
        question: "Tepa suyagi (Os parietale) ning burchaklari qaysilar?",
        options: ["Angulus frontalis, occipitalis, sphenoidalis, mastoideus", "Angulus superior, inferior, medialis, lateralis", "Angulus anterior, posterior, acromialis", "Angulus costalis, sternalis"],
        correctAnswerIndex: 0,
        explanation: "Os parietale 4 ta burchakka ega: peshona, ensa, ponasimon va so'rg'ichsimon burchaklar."
      },
      {
        question: "Peshona va tepa suyaklari orasidagi chok qanday ataladi?",
        options: ["Sutura coronalis (tojsimon chok)", "Sutura sagittalis", "Sutura lambdoidea", "Sutura squamosa"],
        correctAnswerIndex: 0,
        explanation: "Sutura coronalis peshona suyagi va ikkala tepa suyaklari orasidagi tishsimon chokdir."
      },
      {
        question: "Ikkala tepa suyagi orasidagi bo'ylama chok qaysi?",
        options: ["Sutura sagittalis (o'qsimon chok)", "Sutura coronalis", "Sutura lambdoidea", "Sutura frontalis"],
        correctAnswerIndex: 0,
        explanation: "Sutura sagittalis o'ng va chap tepa suyaklari orasidagi o'rta bo'ylama chokdir."
      },
      {
        question: "Tepa suyaklari va ensa suyagi orasidagi chok nima deyiladi?",
        options: ["Sutura lambdoidea (lyambdasimon chok)", "Sutura sagittalis", "Sutura coronalis", "Sutura sphenoidalis"],
        correctAnswerIndex: 0,
        explanation: "Sutura lambdoidea yunoncha 'Lambda' harfiga o'xshash bo'lib, tepa va ensa suyaklarini tutashtiradi."
      },
      {
        question: "Ko'z kosasining yuqori devorini qaysi suyaklar hosil qiladi?",
        options: ["Peshona suyagining pars orbitalis'i va ponasimon suyakning ala minor'i", "Yuqori jag' va yonoq suyagi", "G'alvirsimon suyak va tanglay suyagi", "Chakka suyagi va tepa suyagi"],
        correctAnswerIndex: 0,
        explanation: "Paries superior orbitae peshona suyagi orbital qismi va ponasimon suyak kichik qanotidan tuzilgan."
      },
      {
        question: "Ko'rish nervi (N. opticus - II) ko'z kosasidan kalla bo'shlig'iga qaysi teshik orqali o'tadi?",
        options: ["Canalis opticus", "Fissura orbitalis superior", "Fissura orbitalis inferior", "Foramen ethmoidale anterius"],
        correctAnswerIndex: 0,
        explanation: "Canalis opticus ponasimon suyakning kichik qanoti asosida bo'lib, n. opticus va a. ophthalmica o'tadi."
      }
    ]
  },

  // ==========================================
  // TOPIC 6: Kallaning miya qismi va yuz qismi. Ko‘z kosasi. Og‘iz va Burun bo‘shlig‘i
  // ==========================================
  {
    topicOrder: 6,
    topicKeywords: ["orbita", "cavitas nasi", "cavitas oris", "palatum", "meatus nasi", "choanae", "fissura orbitalis"],
    quizzes: [
      {
        question: "Ko'z kosasining (Orbita) pastki devorini asosan qaysi suyaklar hosil qiladi?",
        options: ["Facies orbitalis maxillae va os zygomaticum", "Os frontale va ala minor", "Lamina orbitalis ossis ethmoidalis", "Os sphenoidale va os temporale"],
        correctAnswerIndex: 0,
        explanation: "Orbita pastki devori yuqori jag'ning orbital yuzasi, yonoq suyagi va qisman tanglay suyagi o'simtasidan hosil bo'ladi."
      },
      {
        question: "Ko'z kosasining medial devorida qaysi suyaklar ishtirok etadi?",
        options: ["Maxilla (processus frontalis), os lacrimale, lamina orbitalis ossis ethmoidalis, corpus ossis sphenoidalis", "Os zygomaticum va ala major", "Squama frontalis va os parietale", "Os temporale va vomer"],
        correctAnswerIndex: 0,
        explanation: "Medial devor g'oyat nozik bo'lib, yuqori jag' peshona o'simtasi, ko'z yoshi suyagi, g'alvirsimon va ponasimon suyaklardan iborat."
      },
      {
        question: "Ko'z kosasi va o'rta kalla chuqurchasini bog'lovchi yuqori ko'z kosasi yorig'i qaysi?",
        options: ["Fissura orbitalis superior", "Fissura orbitalis inferior", "Canalis opticus", "Foramen rotundum"],
        correctAnswerIndex: 0,
        explanation: "Fissura orbitalis superior ponasimon suyakning katta va kichik qanotlari orasida bo'lib, III, IV, V1, VI nervlar o'tadi."
      },
      {
        question: "Ko'z kosasining pastki yorig'i (Fissura orbitalis inferior) orbitani qaysi chuqurchalar bilan bog'laydi?",
        options: ["Fossa pterygopalatina va fossa infratemporalis bilan", "Kallaning oldingi chuqurchasi bilan", "Burun bo'shlig'i bilan", "Kallaning orqa chuqurchasi bilan"],
        correctAnswerIndex: 0,
        explanation: "Fissura orbitalis inferior orqali orbita qanot-tanglay va chakka osti chuqurchalari bilan tutashadi."
      },
      {
        question: "Burun bo'shlig'ining oldingi suyakli ochilish teshigi nima deyiladi?",
        options: ["Apertura piriformis (noksimon teshik)", "Choanae", "Nares", "Meatus nasi"],
        correctAnswerIndex: 0,
        explanation: "Apertura piriformis kalla oldingi yuzasidagi burun bo'shlig'iga kiruvchi noksimon teshikdir."
      },
      {
        question: "Burun bo'shlig'ining orqa tomondan halqumga ochiluvchi teshiklari nima deyiladi?",
        options: ["Choanae (xoanalar)", "Apertura piriformis", "Aditus laryngis", "Fauces"],
        correctAnswerIndex: 0,
        explanation: "Choanae juft teshik bo'lib, burun bo'shlig'ini burun-halqum (nasopharynx) bilan bog'laydi."
      },
      {
        question: "Burun bo'shlig'i yon devorida nechta burun chig'anog'i (conchae nasales) joylashadi?",
        options: ["3 ta (concha nasalis superior, media, inferior)", "2 ta", "4 ta", "1 ta"],
        correctAnswerIndex: 0,
        explanation: "Yon devorda yuqori, o'rta (g'alvirsimon suyak qismlari) va pastki (mustaqil suyak) burun chig'anoqlari bor."
      },
      {
        question: "Pastki burun yo'liga (Meatus nasi inferior) qaysi kanal ochiladi?",
        options: ["Canalis nasolacrimalis (burun-ko'z yoshi kanali)", "Sinus maxillaris", "Sinus frontalis", "Cellulae ethmoidales posteriores"],
        correctAnswerIndex: 0,
        explanation: "Canalis nasolacrimalis ko'z yoshini pastki burun yo'liga olib keladi."
      },
      {
        question: "O'rta burun yo'liga (Meatus nasi medius) qaysi sinuslar ochiladi?",
        options: ["Sinus frontalis, sinus maxillaris, oldingi va o'rta g'alvir katakchalari", "Faqat sinus sphenoidalis", "Canalis nasolacrimalis", "Faqat orqa g'alvir katakchalari"],
        correctAnswerIndex: 0,
        explanation: "O'rta burun yo'liga peshona bo'shlig'i, Gaymor bo'shlig'i va g'alvir suyagining oldingi katakchalari ochiladi."
      },
      {
        question: "Yuqori burun yo'liga (Meatus nasi superior) qaysi bo'shliqlar ochiladi?",
        options: ["Sinus sphenoidalis va orqa g'alvir katakchalari", "Sinus maxillaris", "Sinus frontalis", "Canalis nasolacrimalis"],
        correctAnswerIndex: 0,
        explanation: "Yuqori burun yo'liga ponasimon bo'shliq va g'alvir suyagining orqa katakchalari ochiladi."
      },
      {
        question: "Suyakli burun to'sig'ini (Septum nasi osseum) qaysi asosiy tuzilmalar hosil qiladi?",
        options: ["Lamina perpendicularis ossis ethmoidalis va Vomer", "Os nasale va os lacrimale", "Maxilla va os palatinum", "Concha nasalis inferior va sphenoidale"],
        correctAnswerIndex: 0,
        explanation: "Septum nasi osseum yuqoridan g'alvir suyagining perpendikulyar plastinkasi va pastdan vomer suyaklaridan tashkil topadi."
      },
      {
        question: "Qattiq tanglayni (Palatum osseum) qaysi suyaklar o'simtalari hosil qiladi?",
        options: ["Processus palatinus maxillae va Lamina horizontalis ossis palatini", "Processus alveolaris va os sphenoidale", "Vomer va os ethmoidale", "Mandibula va os hyoideum"],
        correctAnswerIndex: 0,
        explanation: "Qattiq tanglayning oldingi 2/3 qismini yuqori jag'ning tanglay o'simtasi, orqa 1/3 qismini tanglay suyagi gorizontal plastinkasi hosil qiladi."
      },
      {
        question: "Qattiq tanglayning oldingi o'rta chizig'ida joylashgan teshik nima deyiladi?",
        options: ["Foramen incisivum (keskich teshik)", "Foramen palatinum majus", "Foramen mentale", "Foramen ovale"],
        correctAnswerIndex: 0,
        explanation: "Foramen incisivum orqali burun-tanglay nervi va tomirlari og'iz bo'shlig'iga chiqadi."
      },
      {
        question: "Kallaning oldingi chuqurchasini (Fossa cranii anterior) o'rta chuqurchadan qaysi chegara ajratadi?",
        options: ["Ponasimon suyakning kichik qanotlari orqa cheti va tuberculum sellae", "Piramida cho'qqisi", "Sulcus sinus sigmoidei", "Crista galli"],
        correctAnswerIndex: 0,
        explanation: "Oldingi va o'rta kalla chuqurchasi chegarasi ala minor'larning orqa cheti bo'ylab o'tadi."
      },
      {
        question: "Kallaning o'rta chuqurchasini (Fossa cranii media) orqa chuqurchadan nima ajratadi?",
        options: ["Chakka suyagi piramidasining yuqori qirrasi (margo superior) va dorsum sellae", "Ponasimon suyak kichik qanoti", "Crista occipitalis", "Clivus"],
        correctAnswerIndex: 0,
        explanation: "Chakka suyagi piramidasi yuqori qirrasi va Turk egari orqa suyagi (dorsum sellae) orqa kalla chuqurchasini ajratadi."
      },
      {
        question: "Kallaning orqa chuqurchasida (Fossa cranii posterior) bosh miyaning qaysi qismlari joylashadi?",
        options: ["Miyacha (cerebellum), ko'prik (pons) va uzunchoq miya (medulla oblongata)", "Peshona bo'lagi", "Chakka bo'lagi", "Tepa bo'lagi"],
        correctAnswerIndex: 0,
        explanation: "Fossa cranii posterior rombsimon miya hosilalari: miyacha, ko'prik va uzunchoq miyani o'z ichiga oladi."
      },
      {
        question: "Bo'yinturuq teshigi (Foramen jugulare) orqali kalla bo'shlig'idan qaysi nervlar chiqadi?",
        options: ["IX, X va XI juft bosh miya nervlari", "III, IV va VI juft nervlar", "VII va VIII juft nervlar", "I va II juft nervlar"],
        correctAnswerIndex: 0,
        explanation: "Foramen jugulare orqali til-halqum (IX), adashgan (X) va qo'shimcha (XI) nervlar hamda v. jugularis interna o'tadi."
      },
      {
        question: "Ichki eshituv yo'li (Meatus acusticus internus) orqali qaysi nervlar o'tadi?",
        options: ["VII (n. facialis) va VIII (n. vestibulocochlearis)", "V va VI nervlar", "IX va X nervlar", "XI va XII nervlar"],
        correctAnswerIndex: 0,
        explanation: "Meatus acusticus internus chakka suyagi piramidasi orqa yuzasida bo'lib, VII va VIII nervlarni o'tkazadi."
      },
      {
        question: "Til osti nervi kanali (Canalis nervi hypoglossi) ensa suyagining qayerida joylashgan?",
        options: ["Condylus occipitalis asosida", "Clivus ustida", "Foramen magnum qirrasida", "Protuberantia occipitalis'da"],
        correctAnswerIndex: 0,
        explanation: "Canalis n. hypoglossi ensa kondilusi asosidan o'tadi va XII nervni (n. hypoglossus) o'tkazadi."
      },
      {
        question: "O'rta parda arteriyasi (A. meningea media) kalla ichiga qaysi teshik orqali kiradi?",
        options: ["Foramen spinosum", "Foramen ovale", "Foramen rotundum", "Foramen jugulare"],
        correctAnswerIndex: 0,
        explanation: "Foramen spinosum ponasimon suyak katta qanotining burchagida bo'lib, a. meningea media o'tadi."
      },
      {
        question: "Chakka chuqurchasi (Fossa temporalis) past tomondan qaysi tizma bilan chegaralanadi?",
        options: ["Crista infratemporalis", "Linea temporalis", "Arcus zygomaticus", "Processus mastoideus"],
        correctAnswerIndex: 0,
        explanation: "Ponasimon suyak katta qanotidagi Crista infratemporalis chakka chuqurchasini chakka osti chuqurchasidan ajratadi."
      },
      {
        question: "Kalla qutisi ichki yuzasidagi qattiq miya pardasi venoz sinuslari egatlari qaysilar?",
        options: ["Sulcus sinus sagittalis superioris, transversi, sigmoidei", "Sulcus costae", "Sulcus caroticus", "Sulcus radialis"],
        correctAnswerIndex: 0,
        explanation: "Kalla suyaklari ichki yuzasida yuqori sagittal, ko'ndalang va sigmasimon sinus egatlari joylashgan."
      },
      {
        question: "Ensa suyagi ichki yuzasidagi qon tomirlar va sinuslar qo'shiladigan joy (Confluens sinuum) qaysi bo'rtiq yonida bo'ladi?",
        options: ["Protuberantia occipitalis interna", "Protuberantia occipitalis externa", "Tuberculum pharyngeum", "Condylus occipitalis"],
        correctAnswerIndex: 0,
        explanation: "Eminentia cruciformis markazidagi Protuberantia occipitalis interna sohasida sinuslar qo'shilmasi (Confluens sinuum) joylashadi."
      },
      {
        question: "Nog'ora bo'shlig'i (Cavitas tympanica) qaysi suyak ichida joylashgan?",
        options: ["Os temporale (chakka suyagi)", "Os sphenoidale", "Os occipitale", "Os parietale"],
        correctAnswerIndex: 0,
        explanation: "Nog'ora bo'shlig'i chakka suyagining piramidasi va nog'ora qismi orasida joylashgan o'rta quloq bo'shlig'idir."
      },
      {
        question: "Ko'z yoshi bezining chuqurchasi (Fossa glandulae lacrimalis) orbitaning qaysi burchagida joylashadi?",
        options: ["Yuqori-lateral burchagida (peshona suyagida)", "Pastki-medial burchagida", "Pastki-lateral burchagida", "Ko'z kosasi tubida"],
        correctAnswerIndex: 0,
        explanation: "Fossa glandulae lacrimalis peshona suyagi orbital qismining yuqori-tashqi (lateral) burchagida joylashgan."
      },
      {
        question: "Burun-ko'z yoshi kanali (Canalis nasolacrimalis) qayerdan boshlanib qayerga ochiladi?",
        options: ["Ko'z kosasi medial burchagidan boshlanib pastki burun yo'liga ochiladi", "Yuqori burun yo'liga ochiladi", "Og'iz bo'shlig'iga ochiladi", "Gaymor bo'shlig'iga ochiladi"],
        correctAnswerIndex: 0,
        explanation: "Fossa sacci lacrimalis'dan boshlanib, ko'z yoshini meatus nasi inferior'ga o'tkazadi."
      },
      {
        question: "Burun bo'shlig'i yuqori devorini qaysi suyaklar hosil qiladi?",
        options: ["Ossa nasalia, pars nasalis ossis frontalis, lamina cribrosa ossis ethmoidalis, corpus ossis sphenoidalis", "Palatum durum", "Concha nasalis inferior", "Vomer va maxilla"],
        correctAnswerIndex: 0,
        explanation: "Burun bo'shlig'i tomi burun suyaklari, peshona suyagi, g'alvirsimon plastinka va ponasimon suyak tanasidan hosil bo'ladi."
      },
      {
        question: "Og'iz bo'shlig'i tubining suyakli asosini qaysi suyak tashkil etadi?",
        options: ["Mandibula (pastki jag' suyagi)", "Maxilla", "Os hyoideum", "Os palatinum"],
        correctAnswerIndex: 0,
        explanation: "Mandibula va unga birikuvchi jag'-til osti mushaklari (diaphragma oris) og'iz tubini hosil qiladi."
      },
      {
        question: "Kallaning yuzaki yuzida paypaslanadigan quloq orqasidagi bo'rtiq qaysi?",
        options: ["Processus mastoideus (so'rg'ichsimon o'simta)", "Processus styloideus", "Processus condylaris", "Processus coronoideus"],
        correctAnswerIndex: 0,
        explanation: "Processus mastoideus chakka suyagining orqa-pastki qismida joylashgan havoli so'rg'ichsimon o'simtadir."
      },
      {
        question: "Xoanalar (Choanae) qaysi suyak tuzilmalari bilan chegaralangan?",
        options: ["Medialdan vomer, lateraldan lamina medialis processus pterygoidei, yuqoridan corpus sphenoidale, pastdan lamina horizontalis ossis palatini", "Oldindan maxilla, orqadan mandibula", "Yuqoridan os frontale, pastdan os hyoideum", "Yonboshdan os zygomaticum"],
        correctAnswerIndex: 0,
        explanation: "Xoanalar vomer, qanotsimon o'simta medial plastinkasi, ponasimon suyak tanasi va tanglay suyagi gorizontal plastinkasi bilan o'ralgan."
      }
    ]
  },

  // ==========================================
  // TOPIC 7: Chakka osti va qanot-tanglay chuqurchalari. Bolalarda kalla suyaklari
  // ==========================================
  {
    topicOrder: 7,
    topicKeywords: ["fossa pterygopalatina", "fossa infratemporalis", "fonticuli", "liqqildoq", "chakka osti", "qanot-tanglay"],
    quizzes: [
      {
        question: "Qanot-tanglay chuqurchasi (Fossa pterygopalatina) ning oldingi devorini nima hosil qiladi?",
        options: ["Tuber maxillae (yuqori jag' do'ngligi)", "Processus pterygoideus", "Lamina perpendicularis ossis palatini", "Ala major ossis sphenoidalis"],
        correctAnswerIndex: 0,
        explanation: "Fossa pterygopalatina'ning oldingi devorini Tuber maxillae hosil qiladi."
      },
      {
        question: "Qanot-tanglay chuqurchasining orqa devorini qaysi tuzilma hosil qiladi?",
        options: ["Ponasimon suyakning qanotsimon o'simtasi (Processus pterygoideus)", "Tuber maxillae", "Lamina horizontalis", "Facies temporalis"],
        correctAnswerIndex: 0,
        explanation: "Orqa devorini Processus pterygoideus va katta qanotning oldingi yuzasi tashkil qiladi."
      },
      {
        question: "Qanot-tanglay chuqurchasining medial devorini nima hosil qiladi?",
        options: ["Lamina perpendicularis ossis palatini (tanglay suyagi perpendikulyar plastinkasi)", "Tuber maxillae", "Processus pterygoideus", "Vomer"],
        correctAnswerIndex: 0,
        explanation: "Medial devorni tanglay suyagining tik plastinkasi hosil qilib, burun bo'shlig'idan ajratadi."
      },
      {
        question: "Qanot-tanglay chuqurchasi qaysi teshik orqali o'rta kalla chuqurchasi bilan tutashadi?",
        options: ["Foramen rotundum", "Foramen ovale", "Foramen spinosum", "Foramen lacerum"],
        correctAnswerIndex: 0,
        explanation: "Foramen rotundum orqali yuqori jag' nervi (N. maxillaris - V2) o'rta kalla chuqurchasidan qanot-tanglay chuqurchasiga kiradi."
      },
      {
        question: "Qanot-tanglay chuqurchasi burun bo'shlig'i bilan qaysi teshik orqali bog'lanadi?",
        options: ["Foramen sphenopalatinum", "Canalis palatinus major", "Fissura orbitalis inferior", "Canalis pterygoideus"],
        correctAnswerIndex: 0,
        explanation: "Foramen sphenopalatinum orqali a. sphenopalatina va burun nervlari burun bo'shlig'iga o'tadi."
      },
      {
        question: "Qanot-tanglay chuqurchasini ko'z kosasi bilan tutashtiruvchi tuzilma qaysi?",
        options: ["Fissura orbitalis inferior (pastki ko'z kosasi yorig'i)", "Canalis opticus", "Fissura orbitalis superior", "Foramen rotundum"],
        correctAnswerIndex: 0,
        explanation: "Fissura orbitalis inferior qanot-tanglay va chakka osti chuqurchalarini orbita bilan bog'laydi."
      },
      {
        question: "Qanot-tanglay chuqurchasini og'iz bo'shlig'i bilan qaysi kanal tutashtiradi?",
        options: ["Canalis palatinus major", "Canalis incisivus", "Canalis mandibulae", "Canalis caroticus"],
        correctAnswerIndex: 0,
        explanation: "Canalis palatinus major orqali katta va kichik tanglay tomirlari va nervlari qattiq tanglayga tushadi."
      },
      {
        question: "Qanotsimon kanal (Canalis pterygoideus / Vidiy kanali) qayerdan qayerga ochiladi?",
        options: ["Kalla asosi tashqi yuzasidan (foramen lacerum sohasidan) qanot-tanglay chuqurchasiga", "Ko'z kosasiga", "Burun bo'shlig'iga", "Og'iz bo'shlig'iga"],
        correctAnswerIndex: 0,
        explanation: "Canalis pterygoideus processus pterygoideus asosidan o'tib, n. canalis pterygoidei'ni qanot-tanglay chuqurchasiga olib boradi."
      },
      {
        question: "Chakka osti chuqurchasi (Fossa infratemporalis) ning oldingi devori nima?",
        options: ["Facies infratemporalis maxillae va os zygomaticum", "Processus mastoideus", "Lamina lateralis processus pterygoidei", "Squama temporalis"],
        correctAnswerIndex: 0,
        explanation: "Oldingi devori yuqori jag'ning chakka osti yuzasi va yonoq suyagidan iborat."
      },
      {
        question: "Chakka osti chuqurchasining medial devorini qaysi tuzilma hosil qiladi?",
        options: ["Lamina lateralis processus pterygoidei", "Vomer", "Lamina cribrosa", "Septum nasi"],
        correctAnswerIndex: 0,
        explanation: "Medial devorni ponasimon suyak qanotsimon o'simtasining lateral plastinkasi hosil qiladi."
      },
      {
        question: "Chakka osti chuqurchasi ichida qaysi muhim chigal joylashadi?",
        options: ["Plexus venosus pterygoideus (qanotsimon venoz chigal)", "Plexus brachialis", "Plexus cervicalis", "Plexus celiacus"],
        correctAnswerIndex: 0,
        explanation: "Fossa infratemporalis ichida yuz venasi va kalla ichi venalari bilan anastomoz qiluvchi Plexus venosus pterygoideus yotadi."
      },
      {
        question: "Yangi tug'ilgan chaqaloq kallasining xarakterli xususiyati nima?",
        options: ["Liqqildoqlar (fonticuli) mavjudligi va miya qismining yuz qismiga nisbatan ancha kattaligi (8:1 nisbat)", "Choklarning qattiq sinostozi", "Tishlarning to'liq chiqishi", "Havoli bo'shliqlarning to'liq rivojlanganligi"],
        correctAnswerIndex: 0,
        explanation: "Chaqaloqlarda miya qismi yuz qismidan 8 baravar katta bo'lib, suyaklanmagan pardali liqqildoqlar bo'ladi."
      },
      {
        question: "Eng yirik oldingi liqqildoq (Fonticulus anterior) qanday shaklga ega va qaysi suyaklar tutashgan joyda yotadi?",
        options: ["Rombsimon shaklda, peshona va tepa suyaklari orasida", "Uchburchak shaklda, ensa va tepa suyaklari orasida", "Dumaloq shaklda", "Oval shaklda"],
        correctAnswerIndex: 0,
        explanation: "Fonticulus anterior rombsimon bo'lib, peshona va tepa suyaklari (tojsimon va sagittal choklar) kesishmasida joylashadi."
      },
      {
        question: "Oldingi liqqildoq (Fonticulus anterior) odatda bolaning necha yoshida to'liq suyaklanib bitadi?",
        options: ["1 - 1.5 yoshda (12-18 oyligida)", "2-3 oyligida", "5 yoshida", "Tug'ilishi bilan"],
        correctAnswerIndex: 0,
        explanation: "Oldingi katta liqqildoq odatda bola 1 yoshdan 1.5 yoshgacha bo'lgan davrda to'liq yopiladi."
      },
      {
        question: "Orqa liqqildoq (Fonticulus posterior) qanday shaklga ega va qachon bitadi?",
        options: ["Uchburchak shaklda, tepa va ensa suyaklari orasida, hayotning 2-3 oyligida bitadi", "Rombsimon shaklda, 2 yoshda bitadi", "Kvadrat shaklda, 6 yoshda bitadi", "Tug'ilishi bilan bitmaydi, 5 yoshda bitadi"],
        correctAnswerIndex: 0,
        explanation: "Fonticulus posterior lyambdasimon chok sohasida bo'lib, uchburchak shaklda va hayotning 2-3 oyligida yopiladi."
      },
      {
        question: "Yon tomondagi juft liqqildoqlar qaysilar?",
        options: ["Fonticulus sphenoidalis (ponasimon) va Fonticulus mastoideus (so'rg'ichsimon)", "Fonticulus anterior va posterior", "Fonticulus frontalis va occipitalis", "Fonticulus ethmoidalis va zygomaticus"],
        correctAnswerIndex: 0,
        explanation: "Juft yon liqqildoqlar: oldingi-yon (ponasimon) va orqa-yon (so'rg'ichsimon) liqqildoqlardir."
      },
      {
        question: "Yangi tug'ilgan chaqaloqlarda qaysi burun yondosh bo'shliqlari faqat rudiment holatida bo'ladi?",
        options: ["Sinus frontalis va Sinus sphenoidalis", "Sinus maxillaris", "Cavitas tympanica", "Canalis caroticus"],
        correctAnswerIndex: 0,
        explanation: "Peshona va ponasimon bo'shliqlar tug'ilishda deyarli bo'lmaydi, ular bolalik va o'smirlik davrida pnevmatizatsiyalanadi."
      },
      {
        question: "Peshona suyagining o'ng va chap yarimlarini birlashtiruvchi bolalikdagi chok nima deyiladi?",
        options: ["Sutura metopica (metopik chok)", "Sutura sagittalis", "Sutura coronalis", "Sutura squamosa"],
        correctAnswerIndex: 0,
        explanation: "Sutura metopica erta bolalikda peshona suyagi yarimlarini tutashtiradi va odatda 2-7 yoshda yo'qolib ketadi."
      },
      {
        question: "Qanot-tanglay tuguni (Ganglion pterygopalatinum) qaysi chuqurchada joylashadi?",
        options: ["Fossa pterygopalatina ichida", "Fossa infratemporalis ichida", "Fossa cranii media ichida", "Cavitas orbitalis ichida"],
        correctAnswerIndex: 0,
        explanation: "Fossa pterygopalatina ichida vegetativ parasimpatik Ganglion pterygopalatinum joylashadi."
      },
      {
        question: "Chakka osti chuqurchasidan pastki jag' kanaliga qaysi nerv kiradi?",
        options: ["Nervus alveolaris inferior (V3 tarmog'i)", "Nervus lingualis", "Nervus facialis", "Nervus buccalis"],
        correctAnswerIndex: 0,
        explanation: "N. alveolaris inferior foramen mandibulae orqali pastki jag' kanaliga kirib tishlarni innervatsiya qiladi."
      },
      {
        question: "Kalla suyaklarining qalinligi ichidagi gubkasimon suyak moddasi qanday nomlanadi?",
        options: ["Diploe", "Lamina vitrea", "Substantia compacta", "Periosteum"],
        correctAnswerIndex: 0,
        explanation: "Diploe kalla qopqog'i suyaklarining tashqi va ichki ixcham plastinkalari orasidagi gubkasimon moddadir."
      },
      {
        question: "Kalla suyaklarining ichki mo'rt plastinkasi nima deyiladi?",
        options: ["Lamina vitrea (shishasimon plastinka)", "Lamina externa", "Diploe", "Endosteum"],
        correctAnswerIndex: 0,
        explanation: "Lamina vitrea juda mo'rt bo'lib, kalla jarohatlarida tashqi plastinka butun qolsa ham sinishi mumkin."
      },
      {
        question: "Diploe ichidagi venalar qanday ataladi?",
        options: ["Venae diploicae", "Venae emissariae", "Sinus durae matris", "Venae cerebri"],
        correctAnswerIndex: 0,
        explanation: "Venae diploicae suyak gubkasimon moddasi ichidagi klapansiz venalardir."
      },
      {
        question: "Kalla ichidagi venoz sinuslarni tashqi bosh terisi venalari bilan bog'lovchi tomirlar qaysi?",
        options: ["Venae emissariae (emissar venalar)", "Venae diploicae", "Arteriae meningeae", "Venae jugulares"],
        correctAnswerIndex: 0,
        explanation: "Venae emissariae (parietalis, mastoidea, condylaris) sinuslarni tashqi venalar bilan tutashtiruvchi yo'llardir."
      },
      {
        question: "Kattalarda kalla suyaklarining choklari o'rnida suyak to'qimasi o'sib birikib ketishi nima deyiladi?",
        options: ["Sinostoz (Synostosis)", "Sinxondroz", "Sindesmoz", "Simfiz"],
        correctAnswerIndex: 0,
        explanation: "Choklarning suyaklanib bir butun suyakka aylanishi sinostoz deb ataladi."
      },
      {
        question: "Bolalarda kalla suyaklarining erta sinostozga uchrashi natijasida kalla shaklining deformatsiyasi nima?",
        options: ["Kraniostenoz (Craniosynostosis)", "Gidrosefaliya", "Mikrosefaliya", "Akromegaliya"],
        correctAnswerIndex: 0,
        explanation: "Kraniostenoz choklarning muddatidan erta bitishi oqibatida bosh miya siqilishi va deformatsiyasiga olib keladi."
      },
      {
        question: "Pterion anatomik nuqtasi qaysi suyaklar tutashgan xavfli soha hisoblanadi?",
        options: ["Frontale, parietale, squama temporalis va ala major ossis sphenoidalis", "Occipitale va parietale", "Maxilla va zygomaticum", "Mandibula va temporale"],
        correctAnswerIndex: 0,
        explanation: "Pterion sohasida 4 suyak H-shaklida tutashadi, uning ichki yuzasidan a. meningea media o'tadi."
      },
      {
        question: "Inion deb kalla suyagining qaysi nuqtasiga aytiladi?",
        options: ["Protuberantia occipitalis externa uchiga", "Peshona do'ngligiga", "Tepa do'ngligiga", "Iyak o'simtasiga"],
        correctAnswerIndex: 0,
        explanation: "Inion tashqi ensa bo'rtig'ining (Protuberantia occipitalis externa) eng baland nuqtasidir."
      },
      {
        question: "Nasion nuqtasi qayerda joylashgan?",
        options: ["Peshona-burun choki (Sutura frontonasalis) o'rtasida", "Peshona do'ngligida", "Keskich tishlar orasida", "Turk egari markazida"],
        correctAnswerIndex: 0,
        explanation: "Nasion peshona suyagi va burun suyaklari chokining o'rta nuqtasi hisoblanadi."
      },
      {
        question: "Gnathion deb qaysi antropometrik nuqtaga aytiladi?",
        options: ["Pastki jag' suyagi iyak do'ngligining (Protuberantia mentalis) eng pastki nuqtasiga", "Yuqori lab asosiga", "Burun uchiga", "Ensa do'ngligiga"],
        correctAnswerIndex: 0,
        explanation: "Gnathion pastki jag' iyak qismining eng pastki markaziy nuqtasidir."
      }
    ]
  },

  // ==========================================
  // TOPIC 8: Umurtqalar birlashuvi. Ko‘krak qafasi. Yelka kamari va qo‘l suyaklari birlashuvi
  // ==========================================
  {
    topicOrder: 8,
    topicKeywords: ["articulatio", "bo'g'im", "ko'krak qafasi", "yelka kamari", "articulatio humeri", "articulatio cubiti", "tirsak bo'g'imi"],
    quizzes: [
      {
        question: "Yelka bo'g'imi (Articulatio humeri) qanday shakldagi va necha o'qli bo'g'im hisoblanadi?",
        options: ["Sharsimon (Articulatio spheroidea), ko'p o'qli (3 o'qli)", "G'alvirsimon, 1 o'qli", "Ellipsimon, 2 o'qli", "Bloksimon, 1 o'qli"],
        correctAnswerIndex: 0,
        explanation: "Articulatio humeri tipik sharsimon, erkin harakatlanuvchi ko'p o'qli bo'g'imdir."
      },
      {
        question: "Yelka bo'g'imi chuqurchasini (Cavitas glenoidalis) chuqurlashtirib turuvchi tog'ayli lab nima deyiladi?",
        options: ["Labrum glenoidale", "Meniscus lateralis", "Discus articularis", "Ligamentum coracohumerale"],
        correctAnswerIndex: 0,
        explanation: "Labrum glenoidale kurak bo'g'im chuqurchasi atrofidagi tolali-tog'ay halqa bo'lib, chuqurchani kengaytiradi."
      },
      {
        question: "Yelka bo'g'imi bo'shlig'i ichidan qaysi mushakning payi o'tadi?",
        options: ["Musculus biceps brachii uzun boshchasining payi (Caput longum)", "Musculus triceps brachii", "Musculus deltoideus", "Musculus pectoralis major"],
        correctAnswerIndex: 0,
        explanation: "M. biceps brachii'ning uzun boshi payi bo'g'im bo'shlig'i ichidan o'tib tuberculum supraglenoidale'ga birikadi."
      },
      {
        question: "Yelka bo'g'imini tepadan yopib turuvchi 'bo'g'im gumbazi' (Fornix humeri) qaysi tuzilmalardan hosil bo'ladi?",
        options: ["Acromion, processus coracoideus va Ligamentum coracoacromiale", "Clavicula va sternum", "Spina scapulae va humerus", "To'sh suyagi va qovurg'alar"],
        correctAnswerIndex: 0,
        explanation: "Fornix humeri yelka suyagi boshining yuqoriga chiqib ketishiga to'sqinlik qiluvchi mustahkam himoya apparatidir."
      },
      {
        question: "Tirsak bo'g'imi (Articulatio cubiti) nechta oddiy bo'g'imning bitta umumiy kapsulada birlashuvidan iborat murakkab bo'g'im?",
        options: ["3 ta (art. humeroulnaris, art. humeroradialis, art. radioulnaris proximalis)", "2 ta", "4 ta", "1 ta"],
        correctAnswerIndex: 0,
        explanation: "Articulatio cubiti bitta kapsulada joylashgan uchta bo'g'imdan iborat murakkab (art. composita) bo'g'imdir."
      },
      {
        question: "Yelka-tirsak bo'g'imi (Articulatio humeroulnaris) qanday bo'g'im turiga kiradi?",
        options: ["Ginglymus (bloksimon / vintsimon), 1 o'qli", "Sharsimon, 3 o'qli", "Yassi, harakatsiz", "Ellipsimon, 2 o'qli"],
        correctAnswerIndex: 0,
        explanation: "Art. humeroulnaris bloksimon bo'lib, frontal o'q atrofida bukish va yozish (flexio/extensio) harakatini bajaradi."
      },
      {
        question: "Proksimal bilak-tirsak bo'g'imi (Articulatio radioulnaris proximalis) qanday bo'g'im?",
        options: ["Tsilindrsimon (aylanma / trochoid), vertikal o'qli", "Sharsimon", "Ersimon", "Bloksimon"],
        correctAnswerIndex: 0,
        explanation: "Art. radioulnaris proximalis tsilindrsimon bo'lib, pronatio va supinatio harakatlarini ta'minlaydi."
      },
      {
        question: "Bilak suyagi boshchasini tirsak suyagiga mahkamlab turuvchi halqasimon boylam qaysi?",
        options: ["Ligamentum anulare radii", "Ligamentum collaterale ulnare", "Ligamentum collaterale radiale", "Membrana interossea"],
        correctAnswerIndex: 0,
        explanation: "Ligamentum anulare radii bilak suyagi bo'ynini o'rab, uning aylanma harakatini ushlab turadi."
      },
      {
        question: "To'sh-o'mrov bo'g'imi (Articulatio sternoclavicularis) qanday xususiyatga ega?",
        options: ["Ersimon shaklli, ichida Discus articularis bo'lgan 3 o'qli bo'g'im", "Oddiy bloksimon bo'g'im", "Harakatsiz sinostoz", "Faqat 1 o'qli"],
        correctAnswerIndex: 0,
        explanation: "Art. sternoclavicularis ersimon bo'lsa-da, ichidagi disk hisobiga ko'p o'qli erkin harakatga ega."
      },
      {
        question: "Akromion-o'mrov bo'g'imi (Articulatio acromioclavicularis) qanday bo'g'im?",
        options: ["Yassi (Articulatio plana), kam harakatli", "Sharsimon", "G'alvirsimon", "Vintsimon"],
        correctAnswerIndex: 0,
        explanation: "Art. acromioclavicularis yassi yuzali kam harakatli bo'g'imdir."
      },
      {
        question: "Bilak-kaft usti bo'g'imi (Articulatio radiocarpalis) qanday shakldagi bo'g'im?",
        options: ["Ellipsimon (Articulatio ellipsoidea), 2 o'qli", "Sharsimon", "Tsilindrsimon", "Ersimon"],
        correctAnswerIndex: 0,
        explanation: "Art. radiocarpalis ellipsimon bo'lib, bukish-yozish va yaqinlashtirish-uzoqlashtirish harakatlarini bajaradi."
      },
      {
        question: "Bilak-kaft usti bo'g'imida qaysi suyak bevosita ishtirok etmaydi (disk bilan ajralgan)?",
        options: ["Ulna (tirsak suyagi)", "Radius", "Os scaphoideum", "Os lunatum"],
        correctAnswerIndex: 0,
        explanation: "Ulna distal uchi bo'g'im bo'shlig'idan uchburchak tog'ayli disk (discus articularis) orqali ajralgan bo'ladi."
      },
      {
        question: "Qo'l bosh barmog'ining kaft-kaft usti bo'g'imi (Articulatio carpometacarpalis pollicis) qanday shaklda?",
        options: ["Ersimon (Articulatio sellaris), 2 o'qli", "Sharsimon", "Bloksimon", "Yassi"],
        correctAnswerIndex: 0,
        explanation: "Os trapezium va I kaft suyagi asosi orasidagi bo'g'im ersimon bo'lib, bosh barmoqning oppozitsiyasini ta'minlaydi."
      },
      {
        question: "Barmoqlararo bo'g'imlar (Articulationes interphalangeae manus) qanday bo'g'imlar turiga kiradi?",
        options: ["Ginglymus (bloksimon), 1 o'qli (bukish va yozish)", "Sharsimon", "Ersimon", "Ellipsimon"],
        correctAnswerIndex: 0,
        explanation: "Falangalararo bo'g'imlar bitta frontal o'q atrofida bukish-yozishni bajaruvchi bloksimon bo'g'imlardir."
      },
      {
        question: "Umurtqalararo bo'g'imlar (Articulationes zygapophysiales) qaysi o'simtalar orasida hosil bo'ladi?",
        options: ["Processus articularis superior va inferior orasida", "Processus spinosus'lar orasida", "Processus transversus'lar orasida", "Umurtqa tanalari orasida"],
        correctAnswerIndex: 0,
        explanation: "Yuqori va pastki bo'g'im o'simtalari orasida yassi Articulationes zygapophysiales hosil bo'ladi."
      },
      {
        question: "Atlas va Axis orasidagi o'rta bo'g'im (Articulatio atlantoaxialis mediana) qanday bo'g'im?",
        options: ["Tsilindrsimon (trochoid), vertikal o'qli aylanma bo'g'im", "Sharsimon", "Bloksimon", "Yassi"],
        correctAnswerIndex: 0,
        explanation: "Dens axis va atlasning oldingi yoyi orasidagi bo'g'im tsilindrsimon bo'lib, boshni o'ngga-chapga buradi."
      },
      {
        question: "Dens axis'ni orqadan tutib turuvchi eng muhim boylam qaysi?",
        options: ["Ligamentum transversum atlantis (atlasning ko'ndalang boylami)", "Ligamentum flavum", "Ligamentum nuchae", "Ligamentum supraspinale"],
        correctAnswerIndex: 0,
        explanation: "Ligamentum transversum atlantis tishsimon o'simtaning orqa miyaga botib kirishidan himoya qiladi."
      },
      {
        question: "Qovurg'a boshi bo'g'imi (Articulatio capitis costae) qayerda hosil bo'ladi?",
        options: ["Qovurg'a boshi va ikkita qo'shni ko'krak umurtqalari fovea costalis'lari orasida", "To'sh suyagi va qovurg'a orasida", "Ko'ndalang o'simta bilan", "O'mrov suyagi bilan"],
        correctAnswerIndex: 0,
        explanation: "Qovurg'a boshi qo'shni umurtqa tanalari chuqurchalari bilan bo'g'im hosil qiladi."
      },
      {
        question: "Qovurg'a-ko'ndalang o'simta bo'g'imi (Articulatio costotransversaria) qaysi qovurg'alarda bo'lmaydi?",
        options: ["11 va 12-qovurg'alarda", "1 va 2-qovurg'alarda", "6 va 7-qovurg'alarda", "8 va 9-qovurg'alarda"],
        correctAnswerIndex: 0,
        explanation: "11 va 12-qovurg'alarda tuberculum costae bo'lmaganligi sababli bu bo'g'im hosil bo'lmaydi."
      },
      {
        question: "To'sh-qovurg'a birikmalaridan 1-qovurg'aning to'sh bilan birikishi qanday turga kiradi?",
        options: ["Sinxondroz (Synchondrosis - doimiy tog'ayli birikish)", "Diartroz (haqiqiy bo'g'im)", "Sinostoz", "Sindesmoz"],
        correctAnswerIndex: 0,
        explanation: "1-qovurg'a tog'ayi to'sh dastasi bilan harakatsiz sinxondroz hosil qiladi, 2-7 qovurg'alar esa sinovial bo'g'im hosil qiladi."
      },
      {
        question: "Ko'krak qafasining nafas olish (inspiratsiya) paytidagi harakati qanday kechadi?",
        options: ["Qovurg'alar ko'tariladi, ko'krak qafasining sagittal va frontal o'lchamlari kengayadi", "Qovurg'alar tushadi", "Ko'krak qafasi torayadi", "Diafragma yuqoriga ko'tariladi"],
        correctAnswerIndex: 0,
        explanation: "Nafas olganda qovurg'alar aylanish o'qi bo'ylab yuqoriga ko'tarilib ko'krak qafasi hajmini oshiradi."
      },
      {
        question: "Bilak suyaklari orasidagi parda (Membrana interossea antebrachii) birikishning qaysi turiga kiradi?",
        options: ["Sindesmoz (Syndesmosis - tolali birikish)", "Sinxondroz", "Sinostoz", "Simfiz"],
        correctAnswerIndex: 0,
        explanation: "Suyaklararo parda suyaklarni biriktiruvchi parda orqali tutashtiruvchi sindesmozdir."
      },
      {
        question: "Kaft suyaklariaro bo'g'imlar (Articulationes intermetacarpales) qanday bo'g'im turiga kiradi?",
        options: ["Yassi (Articulationes planae)", "Sharsimon", "Bloksimon", "Ersimon"],
        correctAnswerIndex: 0,
        explanation: "Kaft suyaklari asoslari orasidagi bo'g'imlar yassi va kam harakatlidir."
      },
      {
        question: "Kaft-falanga bo'g'imlari (Articulationes metacarpophalangeae II-V) qanday shaklda?",
        options: ["Ellipsimon / sharsimon, 2 o'qli", "Tsilindrsimon", "Bloksimon", "Ersimon"],
        correctAnswerIndex: 0,
        explanation: "2-5 kaft-falanga bo'g'imlari bukish-yozish va barmoqlarni yozish-birlashtirish harakatlarini bajaradi."
      },
      {
        question: "Yelka bo'g'imida erkin harakatlanish nima hisobiga eng yuqori bo'ladi?",
        options: ["Bo'g'im boshi yuzasi chuqurchadan 3 baravar kattaligi va kapsulasining keng, bo'shligi hisobiga", "Ko'plab kuchli boylamlar borligi hisobiga", "Tog'ayli disk borligi hisobiga", "Suyaklarning sinostozi hisobiga"],
        correctAnswerIndex: 0,
        explanation: "Caput humeri va cavitas glenoidalis o'lchamlari nomutanosibligi va kapsula bo'shligi tufayli eng erkin bo'g'imdir."
      },
      {
        question: "Tirsak bo'g'imining kollateral boylamlari qaysilar?",
        options: ["Ligamentum collaterale ulnare va Ligamentum collaterale radiale", "Ligamentum coracohumerale", "Ligamentum patellae", "Ligamentum iliofemorale"],
        correctAnswerIndex: 0,
        explanation: "Tirsak bo'g'imining yon tomonlarini tirsak va bilak kollateral boylamlari mustahkamlaydi."
      },
      {
        question: "Umurtqalararo simfiz (Symphysis intervertebralis) qanday hosil bo'ladi?",
        options: ["Umurtqa tanalari orasidagi tolali-tog'ayli disklar (Disci intervertebrales) orqali", "O'tkir o'simtalar orasida", "Bo'g'im o'simtalari orasida", "Sariq boylam orqali"],
        correctAnswerIndex: 0,
        explanation: "Umurtqa tanalari bir-biri bilan simfiz hosil qiluvchi diski intervertebrales orqali tutashadi."
      },
      {
        question: "Bo'yin umurtqalari sohasidagi tishsimon o'simtaning qanotsimon boylamlari qaysi?",
        options: ["Ligamenta alaria", "Ligamentum apicis dentis", "Ligamentum cruciatum", "Ligamentum flavum"],
        correctAnswerIndex: 0,
        explanation: "Ligamenta alaria dens axis'dan ensa suyagi kondiluslariga tortilib, boshning haddan ortiq burilishini cheklaydi."
      },
      {
        question: "Kaft kanali (Canalis carpi) qaysi tuzilmalar orasida hosil bo'ladi?",
        options: ["Sulcus carpi va Retinaculum flexorum orasida", "Kaft suyaklari orqa yuzasida", "Barmoqlar orasida", "Radius va ulna orasida"],
        correctAnswerIndex: 0,
        explanation: "Canalis carpi orqali barmoqlarni bukuvchi mushaklar paylari va Nervus medianus o'tadi."
      },
      {
        question: "Kaft kanali sindromida (Tunnel sindromi) qaysi nerv siqilib qoladi?",
        options: ["Nervus medianus (o'rta nerv)", "Nervus ulnaris", "Nervus radialis", "Nervus axillaris"],
        correctAnswerIndex: 0,
        explanation: "Canalis carpi torayganda Nervus medianus siqilib, qo'l kaftining 1-3 barmoqlarida og'riq va uvishish paydo bo'ladi."
      }
    ]
  },

  // ==========================================
  // TOPIC 9: Chanoq va oyoq suyaklari birlashuvi. Chanoq-son bo‘g‘imi. Jag‘ bo‘g‘imi. Rentgen anatomiyasi
  // ==========================================
  {
    topicOrder: 9,
    topicKeywords: ["articulatio coxae", "articulatio genus", "articulatio temporomandibularis", "chanoq-son", "tizza bo'g'imi", "jag' bo'g'imi", "rentgen"],
    quizzes: [
      {
        question: "Chanoq-son bo'g'imi (Articulatio coxae) qanday shakldagi bo'g'im turiga kiradi?",
        options: ["Yong'oqsimon / kosachasimon (Articulatio cotylica), ko'p o'qli", "Bloksimon, 1 o'qli", "Ellipsimon, 2 o'qli", "Tsilindrsimon, 1 o'qli"],
        correctAnswerIndex: 0,
        explanation: "Articulatio coxae sharsimon bo'g'imning bir turi bo'lib, chuqur bo'lgani uchun yong'oqsimon (cotylica) deyiladi."
      },
      {
        question: "Odam tanasidagi eng baquvvat boylam qaysi va u chanoq-son bo'g'imida qayerda joylashgan?",
        options: ["Ligamentum iliofemorale (Bertin boylami), bo'g'imning oldingi yuzasida", "Ligamentum pubofemorale", "Ligamentum ischiofemorale", "Ligamentum patellae"],
        correctAnswerIndex: 0,
        explanation: "Ligamentum iliofemorale 300 kg gacha yuklamaga chidaydi va gavdaning orqaga ketib qolishiga to'sqinlik qiladi."
      },
      {
        question: "Chanoq-son bo'g'imi bo'shlig'i ichida qaysi boylam joylashgan?",
        options: ["Ligamentum capitis femoris (son suyagi boshchasi boylami)", "Ligamentum iliofemorale", "Ligamentum transversum acetabuli", "Zona orbicularis"],
        correctAnswerIndex: 0,
        explanation: "Ligamentum capitis femoris bo'g'im ichida joylashgan bo'lib, uning ichidan a. capitis femoris tomiri o'tadi."
      },
      {
        question: "Qov simfizi (Symphysis pubica) qanday birikma hisoblanadi?",
        options: ["Yarim bo'g'im (Hemiarthrosis / Symphysis), ichida tor yoriqsimon bo'shliq bo'lgan tolali-tog'ayli birikma", "Haqiqiy erkin sinovial bo'g'im", "Sinostoz", "Sindesmoz"],
        correctAnswerIndex: 0,
        explanation: "Symphysis pubica o'rtasida tor yorig'i bo'lgan tolali tog'ayli disk (discus interpubicus) mavjud yarim bo'g'imdir."
      },
      {
        question: "Dumg'aza-yonbosh bo'g'imi (Articulatio sacroiliaca) qanday bo'g'im?",
        options: ["Amfiartroz (Articulatio plana), deyarli harakatsiz mustahkam bo'g'im", "Erkin sharsimon", "Vintsimon", "Tsilindrsimon"],
        correctAnswerIndex: 0,
        explanation: "Art. sacroiliaca quloqsimon yuzalar orasidagi juda qattiq boylamlar bilan mustahkamlangan yassi bo'g'imdir."
      },
      {
        question: "Tizza bo'g'imi (Articulatio genus) qanday tuzilishga ega?",
        options: ["Murakkab, kompleks, kondilyar (ikki do'ngli) bloksimon bo'g'im", "Oddiy sharsimon bo'g'im", "Yassi bo'g'im", "Ersimon bo'g'im"],
        correctAnswerIndex: 0,
        explanation: "Tizza bo'g'imi ichida menisklar va xochsimon boylamlar bo'lgan murakkab, kompleks bo'g'imdir."
      },
      {
        question: "Tizza bo'g'imi ichidagi yarimoysimon tolali tog'aylar nima deyiladi?",
        options: ["Meniscus medialis va Meniscus lateralis", "Discus articularis", "Labrum glenoidale", "Bursa suprapatellaris"],
        correctAnswerIndex: 0,
        explanation: "Medial va lateral menisklar bo'g'im yuzalarini moslashtiruvchi va amortizatsiya qiluvchi yarimoysimon tog'aylardir."
      },
      {
        question: "Tizza bo'g'imi ichidagi xochsimon boylamlar (Ligamenta cruciata genus) qaysilar?",
        options: ["Ligamentum cruciatum anterius va Ligamentum cruciatum posterius", "Ligamentum collaterale tibiale va fibulare", "Ligamentum patellae", "Ligamentum popliteum obliquum"],
        correctAnswerIndex: 0,
        explanation: "Oldingi (LCA) va orqa (LCP) xochsimon boylamlar boldir suyagining oldinga va orqaga siljib ketishini ushlab turadi."
      },
      {
        question: "Boldir-oshiq bo'g'imi (Articulatio talocruralis) qanday shakldagi bo'g'im?",
        options: ["Ginglymus (bloksimon), 1 o'qli (bukish va yozish)", "Sharsimon", "Ellipsimon", "Yassi"],
        correctAnswerIndex: 0,
        explanation: "Art. talocruralis boldir suyaklari ayrisi va talus bloki orasidagi bloksimon bo'g'imdir."
      },
      {
        question: "Pastki jag' bo'g'imi (Articulatio temporomandibularis - ATM) qanday bo'g'im turiga kiradi?",
        options: ["Kombinatsiyalangan, kompleks, ellipsimon bo'g'im", "Oddiy sharsimon bo'g'im", "Harakatsiz sinostoz", "Bloksimon 1 o'qli"],
        correctAnswerIndex: 0,
        explanation: "ATM ichida Discus articularis bo'lgan kompleks va o'ng-chap tomonlari bir vaqtda ishlaydigan kombinatsiyalangan bo'g'imdir."
      },
      {
        question: "Pastki jag' bo'g'imi ichidagi bo'g'im diski (Discus articularis) bo'g'im bo'shlig'ini nechaga bo'ladi?",
        options: ["Ikkita alohida qavatga: yuqori va pastki sinovial qavatlarga", "Uchta bo'limga", "Bo'lmaydi", "To'rtta qavatga"],
        correctAnswerIndex: 0,
        explanation: "Diskus bo'g'im bo'shlig'ini to'liq ikkita alohida: ustki va pastki qavatga ajratadi."
      },
      {
        question: "Oyoq panjasining Chopart bo'g'imi (Articulatio tarsi transversa) qaysi bo'g'imlardan iborat?",
        options: ["Articulatio talonavicularis va Articulatio calcaneocuboidea", "Articulatio subtalaris", "Articulationes tarsometatarsales", "Articulationes metatarsophalangeae"],
        correctAnswerIndex: 0,
        explanation: "Chopart ko'ndalang bo'g'imi oshiq-qayiqsimon va tovon-kubsimon bo'g'imlardan iborat."
      },
      {
        question: "Chopart bo'g'imining 'kaliti' hisoblangan boylam qaysi?",
        options: ["Ligamentum bifurcatum (ikkiga ayrilgan boylam)", "Ligamentum deltoideum", "Ligamentum plantare longum", "Ligamentum talofibulare"],
        correctAnswerIndex: 0,
        explanation: "Ligamentum bifurcatum kesilganda Chopart bo'g'imi bo'ylab oyoq panjasini amputatsiya qilish osonlashadi."
      },
      {
        question: "Lisfranc bo'g'imi (Articulationes tarsometatarsales) qaysi suyaklar orasida joylashgan?",
        options: ["Kaft usti suyaklari (ponasimon, kubsimon) va kaft suyaklari (I-V metatarsal) asoslari orasida", "Talus va calcaneus orasida", "Boldir va tovon orasida", "Falangalar orasida"],
        correctAnswerIndex: 0,
        explanation: "Lisfranc bo'g'imi tarsus va metatarsus suyaklari orasidagi bo'g'imlar majmuasidir."
      },
      {
        question: "Boldir-oshiq bo'g'imining medial tomonidagi baquvvat deltasimon boylam qaysi?",
        options: ["Ligamentum deltoideum (Ligamentum collaterale mediale)", "Ligamentum talofibulare anterius", "Ligamentum calcaneofibulare", "Ligamentum plantare longum"],
        correctAnswerIndex: 0,
        explanation: "Ligamentum deltoideum ichki to'piqdan talus, calcaneus va naviculare suyaklariga yelpig'ichsimon yoyiladi."
      },
      {
        question: "Oyoq tagining eng uzun va baquvvat boylami qaysi?",
        options: ["Ligamentum plantare longum", "Aponeurosis plantaris", "Ligamentum bifurcatum", "Ligamentum deltoideum"],
        correctAnswerIndex: 0,
        explanation: "Ligamentum plantare longum tovon suyagidan kaft suyaklari asoslarigacha tortilib, oyoq gumbazini mustahkamlaydi."
      },
      {
        question: "Chanoq suyagi rentgenogrammasida qaysi anatomik chiziq son suyagi bo'yni sinishlarini aniqlashda muhim?",
        options: ["Shenton chizig'i (Shenton's line)", "Ludovik chizig'i", "Spigell chizig'i", "Koxer chizig'i"],
        correctAnswerIndex: 0,
        explanation: "Shenton chizig'i foramen obturatum yuqori cheti va son suyagi bo'yni pastki yuzasi orasidagi silliq yoydir."
      },
      {
        question: "Rentgen tasvirida suyak to'qimasi qanday ko'rinishga ega bo'ladi?",
        options: ["Rentgen nurlarini kuchli yutgani sababli oq (intensiv soya / yorug'lik) ko'rinishda", "Qop-qora", "Shaffof ko'rinmas", "Kulrang fon"],
        correctAnswerIndex: 0,
        explanation: "Rentgen nurlari suyakdagi kalsiy tomonidan tutilib qoladi va plyonkada yorug' (oq) soha hosil qiladi."
      },
      {
        question: "Rentgenogrammada bo'g'im yorig'i (Röntgen bo'g'im yorig'i) nimaning hisobiga qorong'i (shaffof) oraliq bo'lib ko'rinadi?",
        options: ["Rentgen nurlarini o'tkazuvchi gialin tog'ay va sinovial suyuqlik hisobiga", "Suyak erib ketgani uchun", "Bo'shliq bo'sh bo'lgani uchun", "Havo to'plangani uchun"],
        correctAnswerIndex: 0,
        explanation: "Gialin tog'ay rentgen nurlarini ushlamaydi, shuning uchun suyak chetlari orasida bo'shliqdek ko'rinadi."
      },
      {
        question: "Rentgen anatomiyasida suyaklanish yadrolari (Yadro ossifikatsii) nimani baholashda asosiy mezon hisoblanadi?",
        options: ["Bolaning suyak (biologik) yoshini aniqlashda", "Mushak massasini aniqlashda", "Qon bosimini aniqlashda", "Yurak hajmini aniqlashda"],
        correctAnswerIndex: 0,
        explanation: "Suyaklanish yadrolarining paydo bo'lish vaqti va ketma-ketligi bolaning rivojlanish yoshini ko'rsatadi."
      },
      {
        question: "Tizza bo'g'imi rentgenogrammasida to'g'ridan-to'g'ri proyeksiyada qaysi tuzilmalar ko'rinadi?",
        options: ["Son suyagi va katta boldir suyagi kondiluslari, bo'g'im yorig'i, eminentia intercondylaris", "Faqat tovon suyagi", "Faqat qovurg'alar", "Faqat son bo'yni"],
        correctAnswerIndex: 0,
        explanation: "To'g'ridan-to'g'ri proyeksiyada femur va tibia kondiluslari hamda oraliqdagi bo'g'im yorig'i aniq ko'rinadi."
      },
      {
        question: "Oshiq osti bo'g'imi (Articulatio subtalaris) qaysi suyaklar orasida hosil bo'ladi?",
        options: ["Talus va Calcaneus orasida", "Talus va Naviculare orasida", "Calcaneus va Cuboideum orasida", "Tibia va Fibula orasida"],
        correctAnswerIndex: 0,
        explanation: "Art. subtalaris talus va calcaneus'ning orqa bo'g'im yuzalari orasidagi tsilindrsimon bo'g'imdir."
      },
      {
        question: "Oyoq panjasining pronatsiya va supinatsiya harakatlari asosan qaysi bo'g'imlarda amalga oshadi?",
        options: ["Articulatio subtalaris va Articulatio talocalcaneonavicularis'da", "Faqat boldir-oshiq bo'g'imida", "Falangalararo bo'g'imlarda", "Tizza bo'g'imida"],
        correctAnswerIndex: 0,
        explanation: "Oyoq panjasining ichkariga (supinatsiya) va tashqariga (pronatsiya) burilishi subtalar va talokalkaneonavikulyar bo'g'imlarda kechadi."
      },
      {
        question: "Tizza bo'g'imida bukkan holatda boldirning ichkariga va tashqariga aylanishi nima hisobiga mumkin bo'ladi?",
        options: ["Bukilganda kollateral boylamlarning bo'shashishi va menisklar harakatchanligi hisobiga", "Xochsimon boylamlar uzilgani uchun", "Patella tushib qolgani uchun", "Tibia singani uchun"],
        correctAnswerIndex: 0,
        explanation: "Tizza bukilganda yon boylamlar bo'shashadi va vertikal o'q atrofida kichik rotatsiya harakatiga yo'l ochiladi."
      },
      {
        question: "Pastki jag' bo'g'imida og'iz katta ochilganda pastki jag' boshchasi qayerga siljiydi?",
        options: ["Fossa mandibularis'dan oldinga — Tuberculum articulare ustiga chiqadi", "Orqaga siljiydi", "Teshik ichiga kiradi", "Harakatlanmaydi"],
        correctAnswerIndex: 0,
        explanation: "Og'iz keng ochilganda caput mandibulae disk bilan birga chakka suyagining tuberculum articulare do'ngligiga siljiydi."
      },
      {
        question: "Ayollar chanog'ining erkaklar chanog'idan asosiy anatomik va rentgenologik farqlari qaysilar?",
        options: ["Ayollar chanog'i kengroq, kalta, qov burchagi to'mtoq (90-100°), kichik chanoqqa kirish oval shaklda", "Ayollar chanog'i tor va baland", "Qov burchagi o'tkir (70°)", "Chanoq qanotlari tik joylashgan"],
        correctAnswerIndex: 0,
        explanation: "Tug'ruq funksiyasi tufayli ayollar chanog'i keng, yassi, arcus pubis to'mtoq burchakli bo'ladi."
      },
      {
        question: "Bolalarda naysimon suyaklarning o'sishi qaysi soha hisobiga amalga oshadi?",
        options: ["Metaepifizar tog'ay plastinkasi (Cartilago epiphysialis) hisobiga", "Faqat periost hisobiga", "Endost hisobiga", "Suyak ko'migi hisobiga"],
        correctAnswerIndex: 0,
        explanation: "Suyaklarning bo'yiga o'sishi diafiz va epifiz orasidagi epifizar tog'ay zonasi hisobiga bo'ladi."
      },
      {
        question: "Rentgenogrammada 'suyak yoshi'ni aniqlash uchun eng ko'p qaysi a'zoning rentgen surati olinadi?",
        options: ["Chap qo'l panjasi va bilak-kaft usti sohasining", "Kalla suyagining", "Ko'krak qafasining", "Tovon suyagining"],
        correctAnswerIndex: 0,
        explanation: "Qo'l kafti va kaft usti suyaklaridagi suyaklanish nuqtalari soni bo'yicha suyak yoshi aniqlanadi."
      },
      {
        question: "Sinovial bo'g'imning (Diarthrosis) majburiy anatomik elementlari qaysilar?",
        options: ["Bo'g'im yuzalari (Facies articulares), bo'g'im tog'ayi, bo'g'im kapsulasi, bo'g'im bo'shlig'i va sinovial suyuqlik", "Faqat suyaklar va boylamlar", "Menisk va disklar", "Sesamosimon suyaklar"],
        correctAnswerIndex: 0,
        explanation: "Har qanday haqiqiy sinovial bo'g'im 5 ta asosiy komponentga ega bo'lishi shart."
      },
      {
        question: "Bo'g'im kapsulasining ichki qavati nima deb ataladi va nima ishlab chiqaradi?",
        options: ["Membrana synovialis (sinovial parda), sinovial suyuqlik ishlab chiqaradi", "Membrana fibrosa, tola ishlab chiqaradi", "Periosteum, kalsiy ishlab chiqaradi", "Endosteum, qon ishlab chiqaradi"],
        correctAnswerIndex: 0,
        explanation: "Membrana synovialis bo'g'im ishqalanishini kamaytiruvchi va tog'ayni oziqlantiruvchi sinovial suyuqlik ajratadi."
      }
    ]
  },

  // ==========================================
  // TOPIC 10: Ko‘krak mushaklari va fastsiyalari. Diafragma. Qorin mushaklari va topografiyasi
  // ==========================================
  {
    topicOrder: 10,
    topicKeywords: ["ko'krak mushaklari", "pectoralis", "diafragma", "qorin mushaklari", "rectus abdominis", "canalis inguinalis", "chov kanali"],
    quizzes: [
      {
        question: "Katta ko'krak mushagi (M. pectoralis major) qayerga birikadi va qanday vazifani bajaradi?",
        options: ["Crista tuberculi majoris humeri'ga; yelkani yaqinlashtiradi (adduksion) va ichkariga buradi (pronatsiya)", "Akromionga; yelkani ko'taradi", "Kurak suyagiga; qo'lni orqaga tortadi", "Bo'yin umurtqalariga birikadi"],
        correctAnswerIndex: 0,
        explanation: "M. pectoralis major yelkani tanaga yaqinlashtiradi, ichkariga buradi va tushirilgan qo'lni oldinga ko'taradi."
      },
      {
        question: "Kichik ko'krak mushagi (M. pectoralis minor) qayerdan boshlanib qayerga birikadi?",
        options: ["3-5 qovurg'alardan boshlanib kurakning Processus coracoideus'iga birikadi", "1-qovurg'adan boshlanib o'mrovga birikadi", "To'sh suyagidan boshlanib yelkaga birikadi", "Umurtqalardan boshlanib qovurg'alarga birikadi"],
        correctAnswerIndex: 0,
        explanation: "M. pectoralis minor 3-5 qovurg'alardan boshlanadi va tumshuqsimon o'simtaga birikib kurakni oldinga va pastga tortadi."
      },
      {
        question: "Oldingi tishsimon mushak (M. serratus anterior) qayerda joylashgan va qanday vazifa bajaradi?",
        options: ["Ko'krak qafasining lateral yuzasida; kurakni oldinga va lateralga tortadi, qo'lni gorizontal chiziqdan yuqoriga ko'tarishda ishtirok etadi", "Ko'krak qafasi orqasida; nafas chiqaradi", "Bo'yinda; boshni buradi", "Qorinda; qorin pressini hosil qiladi"],
        correctAnswerIndex: 0,
        explanation: "M. serratus anterior yuqori 8-9 qovurg'alardan boshlanib kurakning medial chetiga birikadi va qo'lni vertikal ko'tarishda kurakni aylantiradi."
      },
      {
        question: "Tashqi qovurg'alararo mushaklar (Mm. intercostales externi) qanday yo'nalishda bo'ladi va qanday vazifa bajaradi?",
        options: ["Yuqoridan pastga va oldinga yo'nalgan; qovurg'alarni ko'tarib nafas olishda (inspiratsiya) qatnashadi", "Pastdan yuqoriga yo'nalgan; nafas chiqaradi", "Ko'ndalang yo'nalgan; qorinni siqadi", "Vertikal yo'nalgan; umurtqani bukadi"],
        correctAnswerIndex: 0,
        explanation: "Mm. intercostales externi qovurg'alarni ko'tarib asosiy nafas olish mushaklari hisoblanadi."
      },
      {
        question: "Ichki qovurg'alararo mushaklar (Mm. intercostales interni) qanday yo'naladi va vazifasi nima?",
        options: ["Pastdan yuqoriga va oldinga (tashqi mushaklarga perpendikulyar); qovurg'alarni tushirib nafas chiqarishda (ekspiratsiya) qatnashadi", "Nafas oladi", "Yelkani harakatlantiradi", "Diafragmani ko'taradi"],
        correctAnswerIndex: 0,
        explanation: "Mm. intercostales interni qovurg'alarni pastga tushirib faol nafas chiqarishni ta'minlaydi."
      },
      {
        question: "Diafragma (Diaphragma) qanday asosiy qismlardan iborat?",
        options: ["Pars lumbalis (bel), pars costalis (qovurg'a), pars sternalis (to'sh) va markaziy pay markazi (Centrum tendineum)", "Faqat paydan iborat", "Faqat muskulli 2 ta qismdan", "Lateral va medial qismlardan"],
        correctAnswerIndex: 0,
        explanation: "Diafragmaning muskulli qismlari periferiyada boshlanib markazdagi pay markaziga (Centrum tendineum) tutashadi."
      },
      {
        question: "Diafragmaning pay markazida (Centrum tendineum) qaysi teshik joylashgan?",
        options: ["Foramen venae cavae (pastki kovak vena teshigi)", "Hiatus aorticus", "Hiatus esophageus", "Trigonum sternocostale"],
        correctAnswerIndex: 0,
        explanation: "Centrum tendineum ichida Foramen venae cavae joylashgan bo'lib, nafas olganda vena kengayadi."
      },
      {
        question: "Diafragmaning qizilo'ngach yorig'i (Hiatus esophageus) orqali qizilo'ngach bilan birga nima o'tadi?",
        options: ["Nervi vagi (o'ng va chap adashgan nervlar / truncus vagalis anterior va posterior)", "Nervus phrenicus", "Aorta thoracica", "Ductus thoracicus"],
        correctAnswerIndex: 0,
        explanation: "Hiatus esophageus orqali qizilo'ngach va adashgan nervlarning oldingi hamda orqa poyalari o'tadi."
      },
      {
        question: "Diafragmaning aorta yorig'i (Hiatus aorticus) orqali nimalar o'tadi?",
        options: ["Aorta va Ductus thoracicus (ko'krak limfa yo'li)", "Aorta va pastki kovak vena", "Qizilo'ngach va adashgan nerv", "Nervus phrenicus"],
        correctAnswerIndex: 0,
        explanation: "Hiatus aorticus mustahkam tolali boylam (lig. arcuatum medianum) bilan o'ralgan bo'lib, aorta va limfa yo'li o'tadi."
      },
      {
        question: "Diafragma qisqarganda nima sodir bo'ladi?",
        options: ["Diafragma gumbazi pastga tushadi, ko'krak bo'shlig'i hajmi kattalashadi (nafas olinadi)", "Ko'krak bo'shlig'i kichrayadi", "Diafragma yuqoriga ko'tariladi", "Qorin bo'shlig'i bosimi pasayadi"],
        correctAnswerIndex: 0,
        explanation: "Diafragma qisqarishi nafas olishning (inspiratsiya) 70-80% hajmini ta'minlaydi."
      },
      {
        question: "Diafragmaning 'zaif joylari' (grija chiqishi mumkin bo'lgan sohalar) qaysilar?",
        options: ["Trigonum sternocostale (Larrey uchburchagi) va Trigonum lumbocostale (Bochdalek uchburchagi)", "Centrum tendineum", "Hiatus aorticus", "Crura diaphragmatis"],
        correctAnswerIndex: 0,
        explanation: "Bu uchburchaklarda mushak tolalari bo'lmay, faqat fastsiya bo'lgani uchun diafragma grijalari yuzaga kelishi mumkin."
      },
      {
        question: "Qorinning to'g'ri mushagi (M. rectus abdominis) qayerdan boshlanadi va qayerga birikadi?",
        options: ["5-7 qovurg'a tog'aylari va processus xiphoideus'dan boshlanib Os pubis'ga birikadi", "Yonbosh suyagidan to'shga", "Umurtqalardan songa", "Qovurg'alardan songa"],
        correctAnswerIndex: 0,
        explanation: "M. rectus abdominis yuqoridan pastga vertikal yo'nalib, to'sh suyagidan qov suyagigacha cho'ziladi."
      },
      {
        question: "Qorinning to'g'ri mushagida nechtagacha payli kesishmalar (Intersectiones tendineae) bo'ladi?",
        options: ["3 - 4 ta", "1 ta", "6 ta", "10 ta"],
        correctAnswerIndex: 0,
        explanation: "M. rectus abdominis bo'ylab 3-4 ta ko'ndalang Intersectiones tendineae joylashgan."
      },
      {
        question: "Qorinning tashqi qiyshiq mushagi (M. obliquus externus abdominis) tolalari qanday yo'naladi?",
        options: ["Yuqoridan pastga va oldinga-ichkariga (qo'lni cho'ntakka solish yo'nalishida)", "Pastdan yuqoriga va ichkariga", "Ko'ndalang", "Vertikal"],
        correctAnswerIndex: 0,
        explanation: "Tashqi qiyshiq mushak tolalari qovurg'alardan pastga va medial tomonga yo'naladi."
      },
      {
        question: "Chov boylami (Ligamentum inguinale / Poupart boylami) nimaning hosilasi hisoblanadi?",
        options: ["Qorin tashqi qiyshiq mushagi aponevrozining pastki qayrilgan qalinlashgan cheti", "Qorin to'g'ri mushagi payi", "Son fastsiyasi", "Ko'ndalang mushak aponevrozi"],
        correctAnswerIndex: 0,
        explanation: "Ligamentum inguinale spina iliaca anterior superior va tuberculum pubicum orasida tortilgan bo'lib, m. obliquus externus aponevrozidir."
      },
      {
        question: "Qorinning ichki qiyshiq mushagi (M. obliquus internus abdominis) tolalari qanday yo'naladi?",
        options: ["Pastdan (yonbosh qirrasidan) yuqoriga va oldinga-medial tomonga", "Yuqoridan pastga", "Vertikal", "Orqaga"],
        correctAnswerIndex: 0,
        explanation: "Ichki qiyshiq mushak tolalari tashqi qiyshiq mushakka perpendikulyar ravishda pastdan yuqoriga yo'naladi."
      },
      {
        question: "Qorinning ko'ndalang mushagi (M. transversus abdominis) qanday vazifa bajaradi?",
        options: ["Qorin bo'shlig'i a'zolarini siqib, qorin ichki bosimini oshiradi (qorin pressi)", "Umurtqani yozadi", "Yelkani tushiradi", "Oyoqni bukadi"],
        correctAnswerIndex: 0,
        explanation: "M. transversus abdominis qorin devorining eng chuqur qavati bo'lib, qorin bo'shlig'ini siqadi."
      },
      {
        question: "Qorinning oq chizig'i (Linea alba) qanday hosil bo'ladi?",
        options: ["Ikkala tomon qorinning keng mushaklari (qiyshiq va ko'ndalang) aponevrozlarining o'rta chiziqda o'zaro to'qnashib to'qilishidan", "Faqat to'g'ri mushak tolalaridan", "Teri qatlamidan", "Umurtqa pog'onasi suyagidan"],
        correctAnswerIndex: 0,
        explanation: "Linea alba xanjarsimon o'simtadan simfizgacha tortilgan mustahkam payli oq chiziqdir."
      },
      {
        question: "Chov kanali (Canalis inguinalis) ning uzunligi qancha va unda nechta devor bor?",
        options: ["Uzunligi 4-5 sm; 4 ta devori va 2 ta halqasi (teshigi) bor", "Uzunligi 15 sm; 2 ta devori bor", "Uzunligi 1 sm; devori yo'q", "Uzunligi 10 sm; 3 ta devori bor"],
        correctAnswerIndex: 0,
        explanation: "Chov kanali chov sohasidagi 4-5 sm li yoriq bo'lib, 4 devor (oldingi, orqa, yuqori, pastki) va 2 halqadan iborat."
      },
      {
        question: "Chov kanalining oldingi devorini nima hosil qiladi?",
        options: ["Qorin tashqi qiyshiq mushagining aponevrozi (Aponeurosis m. obliqui externi abdominis)", "Fascia transversalis", "Chov boylami", "M. rectus abdominis"],
        correctAnswerIndex: 0,
        explanation: "Oldingi devorni qorin tashqi qiyshiq mushagi aponevrozi tashkil etadi."
      },
      {
        question: "Chov kanalining orqa devorini nima hosil qiladi?",
        options: ["Ko'ndalang fastsiya (Fascia transversalis)", "Chov boylami", "Teri osti yog' qatlami", "M. obliquus externus"],
        correctAnswerIndex: 0,
        explanation: "Orqa devor Fascia transversalis va qorin pardadan iborat."
      },
      {
        question: "Chov kanalining yuqori devorini qaysi tuzilmalar hosil qiladi?",
        options: ["Qorin ichki qiyshiq va ko'ndalang mushaklarining pastki erkin chetlari", "Chov boylami", "Oq chiziq", "To'g'ri mushak"],
        correctAnswerIndex: 0,
        explanation: "Yuqori devorni mm. obliquus internus va transversus abdominis'ning erkin pastki tolalari hosil qiladi."
      },
      {
        question: "Chov kanalining pastki devorini nima tashkil etadi?",
        options: ["Chov boylami (Ligamentum inguinale)", "Fascia transversalis", "Son suyagi", "Linea alba"],
        correctAnswerIndex: 0,
        explanation: "Pastki devor novsimon buralgan Chov boylamidan iborat."
      },
      {
        question: "Erkaklarda chov kanali ichidan nima o'tadi?",
        options: ["Funiculus spermaticus (urug' tizimchasi) va n. ilioinguinalis", "Ligamentum teres uteri", "A. femoralis", "N. ischiadicus"],
        correctAnswerIndex: 0,
        explanation: "Erkaklarda chov kanali orqali moyakni tutib turuvchi Funiculus spermaticus o'tadi."
      },
      {
        question: "Ayollarda chov kanali ichidan nima o'tadi?",
        options: ["Ligamentum teres uteri (bachadonning yumaloq boylami)", "Funiculus spermaticus", "Ureter", "Tuba uterina"],
        correctAnswerIndex: 0,
        explanation: "Ayollarda chov kanali orqali bachadonning yumaloq boylami katta jinsiy lablarga boradi."
      },
      {
        question: "To'g'ri chov grijasi (Hernia inguinalis directa) qorin old devorining qaysi chuqurchasi orqali chiqadi?",
        options: ["Fossa inguinalis medialis (medial chov chuqurchasi) orqali", "Fossa inguinalis lateralis orqali", "Fossa supravesicalis orqali", "Kindik orqali"],
        correctAnswerIndex: 0,
        explanation: "To'g'ri chov grijasi Fossa inguinalis medialis orqali to'g'ridan-to'g'ri tashqi chov halqasiga yorib chiqadi."
      },
      {
        question: "Qiyshiq chov grijasi (Hernia inguinalis obliqua) qaysi chuqurcha orqali kanal ichiga kiradi?",
        options: ["Fossa inguinalis lateralis (chuqur chov halqasi) orqali butun kanal bo'ylab o'tadi", "Fossa inguinalis medialis", "Fossa femoralis", "Linea alba"],
        correctAnswerIndex: 0,
        explanation: "Qiyshiq grija chuqur chov halqasidan kirib, urug' tizimchasi bilan birga butun kanal bo'ylab o'tadi."
      },
      {
        question: "Qorin old devoridagi kindik osti yoy chizig'i (Linea arcuata / Duglas chizig'i) nimani bildiradi?",
        options: ["Qorin to'g'ri mushagi orqa qin devorining tugash chegarasini (undan pastda orqa devor bo'lmaydi, faqat fascia transversalis qoladi)", "Qorin terisi burmasini", "Chov boylamini", "Oq chiziq boshlanishini"],
        correctAnswerIndex: 0,
        explanation: "Linea arcuata'dan pastda barcha keng mushaklar aponevrozi to'g'ri mushak oldidan o'tadi, orqasida faqat fascia transversalis qoladi."
      },
      {
        question: "Kvadrat bel mushagi (M. quadratus lumborum) qayerda joylashgan va vazifasi nima?",
        options: ["Qorin orqa devorida; umurtqa pog'onasini o'z tomoniga bukadi va 12-qovurg'ani pastga tortadi", "Ko'krak oldida", "Son sohasida", "Bo'yinda"],
        correctAnswerIndex: 0,
        explanation: "M. quadratus lumborum yonbosh suyagi qirrasidan 12-qovurg'aga tortilgan qorin orqa devori mushagidir."
      },
      {
        question: "Ko'krak fastsiyasining qaysi varag'i o'mrov osti va kichik ko'krak mushaklarini o'rab turadi?",
        options: ["Fascia clavipectoralis", "Fascia transversalis", "Fascia endothoracica", "Fascia axillaris"],
        correctAnswerIndex: 0,
        explanation: "Fascia clavipectoralis o'mrovdan boshlanib m. subclavius va m. pectoralis minor'ni g'iloflab turadi."
      }
    ]
  },

  // ==========================================
  // TOPIC 11: Bo‘yin mushaklari. Bosh mushaklari. Chaynov va mimika mushaklari
  // ==========================================
  {
    topicOrder: 11,
    topicKeywords: ["bo'yin mushaklari", "chaynov", "mimika", "sternocleidomastoideus", "masseter", "temporalis", "bo'yin uchburchaklari"],
    quizzes: [
      {
        question: "To'sh-o'mrov-so'rg'ichsimon mushak (M. sternocleidomastoideus) bir tomonlama qisqarganda qanday harakat qiladi?",
        options: ["Boshni o'z tomoniga egingan holda yuzni qarama-qarshi tomonga va yuqoriga buradi", "Boshni orqaga tashlaydi", "Boshni oldinga bukadi", "Jag'ni pastga tushiradi"],
        correctAnswerIndex: 0,
        explanation: "Bir tomonlama qisqarganda boshni o'z tomoniga bukib, yuzni qarama-qarshi tomonga buradi (kriwosheya holati)."
      },
      {
        question: "M. sternocleidomastoideus ikki tomonlama bir vaqtda qisqarganda qanday vazifa bajaradi?",
        options: ["Boshni orqaga tashlaydi va yuzni yuqoriga qaratadi; fiksatsiyalangan boshda to'shni ko'tarib yordamchi nafas mushagi bo'ladi", "Boshni pastga tushiradi", "Yuzni buradi", "Faqat jag'ni ochadi"],
        correctAnswerIndex: 0,
        explanation: "Ikki tomonlama qisqarish boshni orqaga tortadi va nafas olishda to'shni ko'taradi."
      },
      {
        question: "Til osti suyagidan yuqorida yotuvchi (suprahyoid) mushaklar guruhiga qaysilar kiradi?",
        options: ["M. digastricus, m. stylohyoideus, m. mylohyoideus, m. geniohyoideus", "M. sternohyoideus, m. omohyoideus", "M. scalenus anterior, medius, posterior", "M. platysma"],
        correctAnswerIndex: 0,
        explanation: "Suprahyoid mushaklar 4 ta: qo'shqorinli, bigiz-tilosti, jag'-tilosti va iyak-tilosti mushaklaridir."
      },
      {
        question: "Og'iz bo'shlig'i tubi diafragmasini (Diaphragma oris) asosan qaysi juft mushak hosil qiladi?",
        options: ["Musculus mylohyoideus (jag'-til osti mushagi)", "Musculus digastricus", "Musculus geniohyoideus", "Musculus stylohyoideus"],
        correctAnswerIndex: 0,
        explanation: "M. mylohyoideus o'ng va chap tomondan birlashib og'iz tubi (diaphragma oris) ning asosiy mushak qavatini hosil qiladi."
      },
      {
        question: "Til osti suyagidan pastda yotuvchi (infrahyoid) mushaklarga qaysilar kiradi?",
        options: ["M. sternohyoideus, m. sternothyroideus, m. thyrohyoideus, m. omohyoideus", "M. digastricus, m. mylohyoideus", "M. masseter, m. temporalis", "Mm. scaleni"],
        correctAnswerIndex: 0,
        explanation: "Infrahyoid mushaklar to'sh-tilosti, to'sh-qalqonsimon, qalqonsimon-tilosti va kurak-tilosti mushaklaridir."
      },
      {
        question: "Bo'yinning narvonsimon mushaklari (Mm. scaleni anterior, medius, posterior) qayerga birikadi?",
        options: ["Oldingi va o'rta narvonsimon mushaklar 1-qovurg'aga, orqa narvonsimon mushak 2-qovurg'aga birikadi", "Barchasi to'sh suyagiga", "Kallaning ensa suyagiga", "O'mrov suyagiga"],
        correctAnswerIndex: 0,
        explanation: "M. scalenus anterior va medius 1-qovurg'aga, m. scalenus posterior esa 2-qovurg'aga birikadi."
      },
      {
        question: "Narvonsimon mushaklararo oraliq (Spatium interscalenum) qaysi mushaklar orasida hosil bo'ladi va undan nima o'tadi?",
        options: ["M. scalenus anterior va m. scalenus medius orasida; a. subclavia va Plexus brachialis (yelka chigali) o'tadi", "M. scalenus medius va posterior orasida; v. subclavia o'tadi", "Sternocleidomastoideus orqasida", "Trapezus oldida"],
        correctAnswerIndex: 0,
        explanation: "Spatium interscalenum orqali o'mrov osti arteriyasi va yelka nerv chigali qo'lga o'tadi."
      },
      {
        question: "Narvon oldi oralig'i (Spatium antescalenum) orqali nima o'tadi?",
        options: ["Vena subclavia (o'mrov osti venasi)", "Arteria subclavia", "Plexus brachialis", "Aorta"],
        correctAnswerIndex: 0,
        explanation: "Spatium antescalenum m. scalenus anterior oldida joylashgan bo'lib, v. subclavia o'tadi."
      },
      {
        question: "Uyqu uchburchagi (Trigonum caroticum) qaysi tuzilmalar bilan chegaralanadi?",
        options: ["Orqadan m. sternocleidomastoideus, oldingi-yuqoridan venter posterior m. digastrici, oldingi-pastdan venter superior m. omohyoidei", "Oldindan to'sh suyagi, orqadan kurak", "Yuqoridan jag', pastdan o'mrov", "Yon tomondan trapetsiyasimon mushak"],
        correctAnswerIndex: 0,
        explanation: "Trigonum caroticum ichida umumiy uyqu arteriyasi, ichki bo'yinturuq venasi va adashgan nerv yotadi."
      },
      {
        question: "Pirogov uchburchagi (Trigonum linguale) bo'yinda qaysi qon tomirni bog'lash uchun mo'ljallangan topografik soha?",
        options: ["Arteria lingualis (til arteriyasi)", "Arteria carotis externa", "Arteria facialis", "Arteria thyroidea superior"],
        correctAnswerIndex: 0,
        explanation: "Pirogov uchburchagi tubida til arteriyasi (a. lingualis) yotadi va qon ketganda shu yerdan bog'lanadi."
      },
      {
        question: "Bo'yinning teri osti mushagi (Platysma) qanday xususiyatga ega?",
        options: ["Bo'yin teri osti yog' qatlamida yotadi, bo'yin terisini taranglashtiradi va burchakni pastga tortadi", "Bo'yin umurtqalariga birikadi", "Nafas olishda qatnashadi", "Kallani orqaga egar"],
        correctAnswerIndex: 0,
        explanation: "Platysma yupqa bo'lib, bo'yin fastsiyasining 1-varag'i ostida teriga birikib yotadi."
      },
      {
        question: "V.N. Shevkunenko bo'yicha bo'yin fastsiyasi nechta varaqqa (fascia) bo'linadi?",
        options: ["5 ta varaqqa", "3 ta varaqqa", "2 ta varaqqa", "7 ta varaqqa"],
        correctAnswerIndex: 0,
        explanation: "Shevkunenko tasnifi bo'yicha bo'yinda 5 ta fastsiya farqlanadi (yuzaki, xususiyning yuzaki va chuqur varaqlari, ichki a'zolar fastsiyasi, umurtqa oldi fastsiyasi)."
      },
      {
        question: "Chaynov mushaklari (Musculi masticatorii) nechta va qaysilar?",
        options: ["4 ta juft: m. masseter, m. temporalis, m. pterygoideus medialis, m. pterygoideus lateralis", "2 ta", "6 ta", "8 ta"],
        correctAnswerIndex: 0,
        explanation: "Chaynov mushaklari 4 juft bo'lib, barchasi pastki jag'ni harakatlantiradi va V nervning 3-shoxi bilan innervatsiya bo'ladi."
      },
      {
        question: "Chakka mushagi (M. temporalis) qayerga birikadi va qanday vazifa bajaradi?",
        options: ["Processus coronoideus mandibulae'ga; jag'ni ko'taradi va orqaga tortadi", "Processus condylaris'ga; jag'ni tushiradi", "Tuberositas masseterica'ga", "Yonoq suyagiga"],
        correctAnswerIndex: 0,
        explanation: "M. temporalis pastki jag'ning tojsimon o'simtasiga birikadi va jag'ni yuqoriga hamda orqaga tortadi."
      },
      {
        question: "Xususiy chaynov mushagi (M. masseter) qayerga birikadi?",
        options: ["Tuberositas masseterica (pastki jag' burchagining tashqi yuzasiga)", "Tuberositas pterygoidea", "Processus styloideus", "Os hyoideum"],
        correctAnswerIndex: 0,
        explanation: "M. masseter yonoq yoyidan boshlanib jag' burchagi tashqi yuzasiga birikadi va jag'ni qattiq qisadi."
      },
      {
        question: "Lateral qanotsimon mushak (M. pterygoideus lateralis) ikki tomonlama qisqarganda qanday harakat qiladi?",
        options: ["Pastki jag'ni oldinga suradi (chiqaradi)", "Jag'ni orqaga tortadi", "Og'izni qattiq yopadi", "Boshni buradi"],
        correctAnswerIndex: 0,
        explanation: "M. pterygoideus lateralis qisqarganda pastki jag' boshchasi oldinga siljib, jag' oldinga chiqadi."
      },
      {
        question: "Medial qanotsimon mushak (M. pterygoideus medialis) qayerga birikadi?",
        options: ["Tuberositas pterygoidea (pastki jag' burchagining ichki yuzasiga)", "Tuberositas masseterica", "Processus coronoideus", "Fovea pterygoidea"],
        correctAnswerIndex: 0,
        explanation: "M. pterygoideus medialis jag' burchagi ichki yuzasiga birikib jag'ni ko'taradi."
      },
      {
        question: "Mimika mushaklarining asosiy anatomik xususiyati nima?",
        options: ["Fastsiyalari bo'lmaydi, kamida bitta uchi bilan kalla suyaklariga, ikkinchi uchi bilan bevosita yuz terisiga birikadi", "Barchasi ikkita suyakka birikadi", "Faqat bo'g'imlarni harakatlantiradi", "Qalin fastsiya bilan o'ralgan"],
        correctAnswerIndex: 0,
        explanation: "Mimika mushaklari yuz terisiga birikib qisqarganda terini burishtiradi va yuz ifodasini hosil qiladi."
      },
      {
        question: "Barcha mimika mushaklarini qaysi nerv innervatsiya qiladi?",
        options: ["Nervus facialis (VII juft bosh miya nervi - Yuz nervi)", "Nervus trigeminus (V)", "Nervus glossopharyngeus (IX)", "Nervus hypoglossus (XII)"],
        correctAnswerIndex: 0,
        explanation: "Yuz nervi (VII) barcha mimika mushaklarining motor (harakatlantiruvchi) nervidir."
      },
      {
        question: "Ko'zning aylanma mushagi (M. orbicularis oculi) qanday qismlardan iborat?",
        options: ["Pars orbitalis (ko'z kosasi), pars palpebralis (qovoq), pars lacrimalis (ko'z yoshi)", "Pars labialis va pars buccalis", "Pars nasalis va mentalis", "Faqat pars superficialis"],
        correctAnswerIndex: 0,
        explanation: "M. orbicularis oculi ko'z yorig'ini qisuvchi va ko'z yoshini oqizuvchi 3 qismdan iborat."
      },
      {
        question: "Og'izning aylanma mushagi (M. orbicularis oris) qanday vazifani bajaradi?",
        options: ["Og'iz teshigini yopadi, lablarni oldinga cho'zadi (hushtak chalish, emish)", "Og'izni ochadi", "Boshni buradi", "Chaynovni bajaradi"],
        correctAnswerIndex: 0,
        explanation: "M. orbicularis oris lablar asosini tashkil qilib, og'iz sfinkteri vazifasini bajaradi."
      },
      {
        question: "Lopillatuvchi / bo'rtuvchi mushak (M. buccinator / surnaychilar mushagi) qayerda joylashgan?",
        options: ["Yonoq qalinligida joylashgan bo'lib, uning qalinligini quloq oldi bezi yo'li (Ductus parotideus) teshib o'tadi", "Peshonada", "Iyakda", "Til tagida"],
        correctAnswerIndex: 0,
        explanation: "M. buccinator yonoq devorini hosil qiladi va ductor parotideus uni teshib og'iz dahliziga ochiladi."
      },
      {
        question: "G'amginlik, xafagarchilik mimikasini hosil qiluvchi og'iz burchagini tushiruvchi mushak qaysi?",
        options: ["Musculus depressor anguli oris", "Musculus levator labii superioris", "Musculus zygomaticus major", "Musculus risorius"],
        correctAnswerIndex: 0,
        explanation: "M. depressor anguli oris og'iz burchagini pastga tortib yuzga g'amgin ifoda beradi."
      },
      {
        question: "Kulgi mushagi (M. risorius) qanday vazifa bajaradi?",
        options: ["Og'iz burchagini lateral tomonga tortadi va yonoqda kulgich hosil qiladi", "Qoshni chimiradi", "Labni tushiradi", "Ko'zni yumadi"],
        correctAnswerIndex: 0,
        explanation: "M. risorius og'iz burchagini yonga tortib tabassum va kulgich paydo qiladi."
      },
      {
        question: "Kalla usti mushagining (M. epicranius) payli qismi nima deb ataladi?",
        options: ["Galea aponeurotica (Aponeurosis epicranialis / payli dubulg'a)", "Fascia temporalis", "Platysma", "Linea alba"],
        correctAnswerIndex: 0,
        explanation: "Galea aponeurotica kalla qopqog'i ustidagi pishiq payli plastinka bo'lib, bosh terisi bilan mustahkam bog'langan."
      },
      {
        question: "Qoshni chimiruvchi mushak (M. corrugator supercilii) qanday vazifa bajaradi?",
        options: ["Qoshlarni bir-biriga yaqinlashtiradi va burun ildizi ustida vertikal burmalar hosil qiladi", "Qoshni ko'taradi", "Ko'zni ochadi", "Peshonani silliqlaydi"],
        correctAnswerIndex: 0,
        explanation: "M. corrugator supercilii qoshlarni o'rta chiziqqa tortib g'azab va qosh chimirish ifodasini beradi."
      },
      {
        question: "Kichik va katta yonoq mushaklari (Mm. zygomaticus minor et major) qanday vazifani bajaradi?",
        options: ["Og'iz burchagini yuqoriga va lateralga tortadi (chinakam quvonch, kulgi mimikasi)", "Og'izni yopadi", "Labni pastga tortadi", "Iyakni ko'taradi"],
        correctAnswerIndex: 0,
        explanation: "Yonoq mushaklari og'iz burchagini ko'tarib xursandchilik va kulgi mimikasining bosh mushaklaridir."
      },
      {
        question: "Bo'yinning umurtqa oldi chuqur mushaklariga qaysilar kiradi?",
        options: ["M. longus colli, m. longus capitis, m. rectus capitis anterior va lateralis", "M. digastricus, m. stylohyoideus", "Mm. scaleni", "M. sternocleidomastoideus"],
        correctAnswerIndex: 0,
        explanation: "Umurtqa oldi guruhiga bo'yinning uzun mushagi, boshning uzun mushagi va boshning to'g'ri mushaklari kiradi."
      },
      {
        question: "To'sh usti oraliq bo'shlig'i (Spatium suprasternale) qaysi fastsiya varaqlari orasida hosil bo'ladi?",
        options: ["Bo'yin xususiy fastsiyasining yuzaki va chuqur varaqlari (2 va 3-fastsiyalar) orasida to'sh dastasidan yuqorida", "1 va 2-fastsiya orasida", "4 va 5-fastsiya orasida", "Platysma ostida"],
        correctAnswerIndex: 0,
        explanation: "Spatium suprasternale ichida Arcus venosus juguli (bo'yinturuq venoz yoyi) joylashadi."
      },
      {
        question: "Bo'yindagi a'zolar orti bo'shlig'i (Spatium retroviscerale) qayerga davom etadi?",
        options: ["Orqa ko'ks oralig'iga (Mediastinum posterius) bevosita tutashadi va infeksiya tarqalish xavfi yuqori", "Oldingi ko'ks oralig'iga", "Qorin bo'shlig'iga", "Kalla ichiga"],
        correctAnswerIndex: 0,
        explanation: "Spatium retroviscerale halqum va qizilo'ngach orqasidagi bo'shliq bo'lib, to'g'ridan-to'g'ri ko'krak qafasi orqa mediastinumiga o'tadi."
      }
    ]
  },

  // ==========================================
  // TOPIC 12: Orqa mushaklari. Yelka, bilak va qo‘l panja mushaklari
  // ==========================================
  {
    topicOrder: 12,
    topicKeywords: ["orqa mushaklari", "latissimus dorsi", "trapezius", "biceps", "triceps", "bilak mushaklari", "panja mushaklari"],
    quizzes: [
      {
        question: "Trapetsiyasimon mushak (M. trapezius) qayerda joylashgan va qanday vazifa bajaradi?",
        options: ["Orqaning yuqori qismida; kurakni umurtqaga yaqinlashtiradi, yuqori tolalari kurakni ko'taradi, pastki tolalari tushiradi", "Yelkani bukadi", "Nafas chiqaradi", "Qo'lni pronatsiya qiladi"],
        correctAnswerIndex: 0,
        explanation: "M. trapezius ensa suyagi va barcha ko'krak umurtqalaridan boshlanib kurak o'sig'i va o'mrovga birikadi."
      },
      {
        question: "Orqaning eng keng mushagi (M. latissimus dorsi) qayerga birikadi va vazifasi nima?",
        options: ["Crista tuberculi minoris humeri'ga; ko'tarilgan qo'lni tushiradi, orqaga tortadi va ichkariga buradi (adduksion, pronatsiya)", "Akromionga", "Kurak o'sig'iga", "1-qovurg'aga"],
        correctAnswerIndex: 0,
        explanation: "M. latissimus dorsi orqaning pastki qismini egallab, yelkani orqaga va ichkariga tortadi ('suzuvchilar mushagi')."
      },
      {
        question: "Rombasimon mushaklar (Mm. rhomboidei major et minor) qanday vazifa bajaradi?",
        options: ["Kurakni umurtqa pog'onasi tomonga va yuqoriga tortadi, uni ko'krak qafasiga fiksatsiyalaydi", "Yelkani yozadi", "Kallani bukadi", "Qovurg'ani ko'taradi"],
        correctAnswerIndex: 0,
        explanation: "Rombasimon mushaklar kurakning medial qirrasini umurtqa pog'onasiga tortib turadi."
      },
      {
        question: "Umurtqani tiklovchi mushak (M. erector spinae) qaysi uchta asosiy traktga bo'linadi?",
        options: ["M. iliocostalis (yonbosh-qovurg'a), M. longissimus (eng uzun), M. spinalis (o'tkir o'simtalararo)", "M. trapezius, latissimus, rhomboideus", "M. biceps, triceps, brachialis", "Mm. rotatores, multifidi, interspinales"],
        correctAnswerIndex: 0,
        explanation: "M. erector spinae orqaning eng kuchli chuqur mushagi bo'lib, yonbosh-qovurg'a, eng uzun va o'tkir traktlarga bo'linadi."
      },
      {
        question: "Ko'ndalang-o'tkir o'simtali mushaklar tizimi (M. transversospinalis) qanday qismlardan iborat?",
        options: ["M. semispinalis (yarimo'tkir), Mm. multifidi (ko'p bo'lakli), Mm. rotatores (aylantiruvchi)", "M. erector spinae va iliocostalis", "M. splenius capitis va cervicis", "Mm. levatores costarum"],
        correctAnswerIndex: 0,
        explanation: "M. transversospinalis ko'ndalang o'simtalardan boshlanib o'tkir o'simtalarga chiqadi va umurtqani aylantiradi hamda yozadi."
      },
      {
        question: "Deltasimon mushak (M. deltoideus) qanday vazifa bajaradi?",
        options: ["Qo'lni gorizontal holatgacha (90° gacha) chetga ko'taradi (abduksion)", "Qo'lni tanaga yaqinlashtiradi", "Tirsakni bukadi", "Kallani orqaga tashlaydi"],
        correctAnswerIndex: 0,
        explanation: "M. deltoideus yelka bo'g'imini qoplab, qo'lni yonga (abduksiyaga) ko'taruvchi asosiy mushakdir."
      },
      {
        question: "Kurak usti va kurak osti mushaklari (Mm. supraspinatus et infraspinatus) qayerda joylashgan?",
        options: ["Fossa supraspinata va Fossa infraspinata scapulae'da", "Ko'krak oldida", "Qorin orqa devorida", "Tirsakda"],
        correctAnswerIndex: 0,
        explanation: "M. supraspinatus yelkani chetga ko'tarishni boshlab beradi, infraspinatus esa yelkani tashqariga buradi (supinatsiya)."
      },
      {
        question: "Yelkaning rotator manjetini (Rotator cuff) qaysi to'rtta mushak paylari hosil qiladi?",
        options: ["M. supraspinatus, m. infraspinatus, m. teres minor, m. subscapularis (SITS)", "M. deltoideus, biceps, triceps, brachialis", "M. pectoralis major, latissimus dorsi, trapezius, teres major", "M. coracobrachialis, anconeus, pronator teres, brachioradialis"],
        correctAnswerIndex: 0,
        explanation: "SITS mushaklari yelka bo'g'imi kapsulasini har tomondan o'rab bo'g'im boshini mustahkam ushlab turadi."
      },
      {
        question: "Yelkaning ikki boshli mushagi (M. biceps brachii) qayerga birikadi va vazifasi nima?",
        options: ["Tuberositas radii'ga; tirsak bo'g'imida qo'lni bukadi va bilakni supinatsiya qiladi (tashqariga buradi)", "Tuberositas ulnae'ga; qo'lni yozadi", "Olekranonga; pronatsiya qiladi", "Kaft suyaklariga"],
        correctAnswerIndex: 0,
        explanation: "M. biceps brachii bilak suyagi do'ngligiga birikib kuchli fleksor va eng kuchli supinatordir."
      },
      {
        question: "Yelka mushagi (M. brachialis) qayerga birikadi va qanday vazifani bajaradi?",
        options: ["Tuberositas ulnae'ga; tirsak bo'g'imida bilakni sof bukadi (fleksor)", "Tuberositas radii'ga", "Acromion'ga", "Olecranon'ga"],
        correctAnswerIndex: 0,
        explanation: "M. brachialis tirsak suyagi do'ngligiga birikib tirsak bo'g'imining sof bukuvchisidir."
      },
      {
        question: "Yelkaning uch boshli mushagi (M. triceps brachii) qayerga birikadi va qanday vazifa bajaradi?",
        options: ["Olecranon ulnae'ga (tirsak o'simtasiga); tirsak bo'g'imida qo'lni yozadi (ekstenzor)", "Tuberositas radii'ga", "Processus coracoideus'ga", "Kaft usti suyaklariga"],
        correctAnswerIndex: 0,
        explanation: "M. triceps brachii tirsak suyagining olekranoniga birikib, tirsak bo'g'imining asosiy yozuvchi mushagidir."
      },
      {
        question: "Qo'ltiq osti bo'shlig'i (Cavitas axillaris) ning 4 ta devori nimalardan iborat?",
        options: ["Oldingi devor (ko'krak mushaklari), orqa devor (m. latissimus dorsi, subscapularis, teres major), medial devor (m. serratus anterior), lateral devor (humerus va m. coracobrachialis)", "Faqat teri va suyak", "O'mrov va kurak", "Qovurg'alar va to'sh"],
        correctAnswerIndex: 0,
        explanation: "Cavitas axillaris 4 ta devorga ega bo'lib, uning ichida yelka chigali poyalari va qo'ltiq osti qon tomirlari joylashadi."
      },
      {
        question: "Qo'ltiq orqa devoridagi to'rt tomonlama teshik (Foramen quadrilaterum) orqali nimalar o'tadi?",
        options: ["Nervus axillaris va Arteria circumflexa humeri posterior", "Arteria circumflexa scapulae", "Nervus radialis", "Arteria brachialis"],
        correctAnswerIndex: 0,
        explanation: "Foramen quadrilaterum orqali qo'ltiq nervi va yelkani aylanib o'tuvchi orqa arteriya o'tadi."
      },
      {
        question: "Uch tomonlama teshik (Foramen trilaterum) orqali qaysi qon tomir o'tadi?",
        options: ["Arteria circumflexa scapulae", "Arteria axillaris", "Arteria brachialis", "Nervus medianus"],
        correctAnswerIndex: 0,
        explanation: "Foramen trilaterum orqali kurakni aylanib o'tuvchi arteriya o'tadi."
      },
      {
        question: "Bilak oldingi guruhi yuzaki qavati mushaklariga (lateral tomondan medialga) qaysilar kiradi?",
        options: ["M. pronator teres, m. flexor carpi radialis, m. palmaris longus, m. flexor carpi ulnaris", "M. supinator, m. anconeus", "M. extensor digitorum", "M. brachioradialis"],
        correctAnswerIndex: 0,
        explanation: "Oldingi yuzaki qavat epicondylus medialis humeri'dan boshlanuvchi 4 ta mushakdan iborat."
      },
      {
        question: "Yelka-bilak mushagi (M. brachioradialis) qayerda joylashgan va qanday vazifani bajaradi?",
        options: ["Bilakning lateral tomonida; bilakni bukadi va uni oraliq holatga (pronatsiya va supinatsiya o'rtasiga) keltiradi", "Tirsakni yozadi", "Barmoqlarni yozadi", "Kaftni orqaga bukadi"],
        correctAnswerIndex: 0,
        explanation: "M. brachioradialis bilakning lateral sohasida bo'lib, yarim pronatsiya holatida tirsakni kuchli bukadi."
      },
      {
        question: "Barmoqlarni yuzaki bukuvchi mushak (M. flexor digitorum superficialis) paylari qayerga birikadi?",
        options: ["2-5 barmoqlarning o'rta falangalari (Phalanx media) asoslariga ikkiga ayrilib birikadi", "Tirnoq falangalariga", "Kaft suyaklariga", "Bosh barmoqqa"],
        correctAnswerIndex: 0,
        explanation: "M. flexor digitorum superficialis paylari ikkiga ayrilib, o'rta falangalarga birikadi va chuqur fleksor paylarini o'tkazadi."
      },
      {
        question: "Barmoqlarni chuqur bukuvchi mushak (M. flexor digitorum profundus) paylari qayerga birikadi?",
        options: ["2-5 barmoqlarning oxirgi (tirnoq / distal) falangalari asoslariga", "O'rta falangalarga", "Proksimal falangalarga", "Kaft suyaklariga"],
        correctAnswerIndex: 0,
        explanation: "Chuqur bukuvchi mushak paylari yuzaki mushak paylari orasidan o'tib, tirnoq falangalariga boradi."
      },
      {
        question: "Bilakning kvadrat pronatori (M. pronator quadratus) qayerda joylashgan?",
        options: ["Bilakning distal qismining eng chuqur qavatida, radius va ulna orasida", "Yelka sohasida", "Kaft ustida", "Tirsak chuqurchasida"],
        correctAnswerIndex: 0,
        explanation: "M. pronator quadratus bilak suyagi va tirsak suyagi distal uchlarini ko'ndalang tutashtirib bilakni pronatsiya qiladi."
      },
      {
        question: "Bilak orqa guruhi yuzaki mushaklariga qaysilar kiradi?",
        options: ["M. extensor carpi radialis longus va brevis, m. extensor digitorum, m. extensor digiti minimi, m. extensor carpi ulnaris", "M. pronator teres va flexor carpi radialis", "M. biceps va brachialis", "Mm. lumbricales"],
        correctAnswerIndex: 0,
        explanation: "Orqa guruh mushaklari epicondylus lateralis humeri'dan boshlanib kaft va barmoqlarni yozadi."
      },
      {
        question: "Supinator mushak (M. supinator) qanday vazifa bajaradi?",
        options: ["Bilak va qo'l panjasini tashqariga buradi (supinatsiya qiladi)", "Ichkariga buradi (pronatsiya)", "Tirsakni bukadi", "Barmoqlarni qisadi"],
        correctAnswerIndex: 0,
        explanation: "M. supinator bilakning orqa chuqur qavatida joylashib radiusni tashqariga buradi."
      },
      {
        question: "Qo'l bosh barmog'i tepaligi (Thenar) mushaklariga qaysilar kiradi?",
        options: ["M. abductor pollicis brevis, m. flexor pollicis brevis, m. opponens pollicis, m. adductor pollicis", "M. palmaris brevis, m. abductor digiti minimi", "Mm. lumbricales", "Mm. interossei"],
        correctAnswerIndex: 0,
        explanation: "Thenar guruhi bosh barmoqning 4 ta kalta mushagidan iborat bo'lib, uning harakatchanligini ta'minlaydi."
      },
      {
        question: "Bosh barmoqni qarama-qarshi qo'yuvchi mushak (M. opponens pollicis) qanday vazifani bajaradi?",
        options: ["Bosh barmoqni kichik barmoqqa (jimjiloqqa) qarshi qo'yadi (oppozitsiya - mehnat faoliyati asosi)", "Bosh barmoqni uzoqlashtiradi", "Bosh barmoqni yozadi", "Barmoqni bukadi"],
        correctAnswerIndex: 0,
        explanation: "Oppozitsiya odam qo'liga xos eng muhim evolyutsion harakat bo'lib, mehnat asboblarini ushlashni ta'minlaydi."
      },
      {
        question: "Kichik barmoq (jimjiloq) tepaligi (Hypothenar) mushaklariga qaysilar kiradi?",
        options: ["M. palmaris brevis, m. abductor digiti minimi, m. flexor digiti minimi brevis, m. opponens digiti minimi", "Thenar mushaklari", "Mm. interossei dorsales", "M. pronator teres"],
        correctAnswerIndex: 0,
        explanation: "Hypothenar 5-barmoq asosi mushaklaridan iborat bo'lib, jimjiloq harakatlarini boshqaradi."
      },
      {
        question: "Chuvalchangsimon mushaklar (Mm. lumbricales - 4 ta) qanday harakatni amalga oshiradi?",
        options: ["2-5 barmoqlarning asosiy (proksimal) falangalarini bukadi, o'rta va distal falangalarini yozadi", "Barcha falangalarni bukadi", "Barcha falangalarni yozadi", "Barmoqlarni yaqinlashtiradi"],
        correctAnswerIndex: 0,
        explanation: "Mm. lumbricales proksimal falangani bukib, o'rta va distal falangalarni yozuvchi nozik harakat mushaklaridir."
      },
      {
        question: "Kaft suyaklararo orqa mushaklari (Mm. interossei dorsales - 4 ta) qanday harakat qiladi?",
        options: ["Barmoqlarni bir-biridan uzoqlashtiradi (yoyadi)", "Barmoqlarni bir-biriga yaqinlashtiradi", "Barmoqlarni bukadi", "Kaftni yozadi"],
        correctAnswerIndex: 0,
        explanation: "Dorsal suyaklararo mushaklar (DAB - Dorsal ABduct) barmoqlarni o'rta o'qdan uzoqlashtiradi."
      },
      {
        question: "Kaft suyaklararo kaft mushaklari (Mm. interossei palmares - 3 ta) qanday harakat qiladi?",
        options: ["Barmoqlarni o'rta (3-barmoq) tomonga yaqinlashtiradi (birlashtiradi)", "Barmoqlarni yoyadi", "Barmoqlarni aylantiradi", "Kaftni siqadi"],
        correctAnswerIndex: 0,
        explanation: "Palmar suyaklararo mushaklar (PAD - Palmar ADduct) barmoqlarni o'rta chiziqqa yaqinlashtiradi."
      },
      {
        question: "Yelka-mushak kanali (Canalis humeromuscularis / spiral kanal) qayerda joylashgan va undan nima o'tadi?",
        options: ["Yelka suyagining orqa yuzasida sulcus nervi radialis va m. triceps brachii orasida; Nervus radialis va a. profunda brachii o'tadi", "Yelkaning oldida; n. medianus o'tadi", "Tirsak bo'g'imida; a. ulnaris o'tadi", "Qo'ltiqda; n. axillaris o'tadi"],
        correctAnswerIndex: 0,
        explanation: "Spiral kanal orqali yelka suyagi sinishlarida eng ko'p shikastlanuvchi Nervus radialis o'tadi."
      },
      {
        question: "Tirsak chuqurchasi (Fossa cubitalis) tubini qaysi mushaklar hosil qiladi?",
        options: ["Musculus brachialis va Musculus supinator", "M. biceps va triceps", "M. deltoideus va trapezius", "M. pronator quadratus"],
        correctAnswerIndex: 0,
        explanation: "Fossa cubitalis tubini yelka mushagi va supinator hosil qiladi, uning ichidan a. brachialis va n. medianus o'tadi."
      },
      {
        question: "'Anatomik tamakidon' (Fovea radialis / Tabatière anatomique) qaysi mushaklar paylari orasidagi chuqurchadir?",
        options: ["M. abductor pollicis longus, m. extensor pollicis brevis (lateral) va m. extensor pollicis longus (medial) orasida", "M. flexor carpi radialis va ulnaris orasida", "M. biceps va brachialis orasida", "M. triceps va anconeus orasida"],
        correctAnswerIndex: 0,
        explanation: "Anatomik tamakidon tubida a. radialis va os scaphoideum yotadi, pulsni paypash va sinishlarni tekshirishda muhim."
      }
    ]
  },

  // ==========================================
  // TOPIC 13: Chanoq, son, boldir va oyoq panja mushaklari
  // ==========================================
  {
    topicOrder: 13,
    topicKeywords: ["chanoq mushaklari", "gluteus", "son mushaklari", "quadriceps", "boldir mushaklari", "triceps surae", "oyoq panja mushaklari"],
    quizzes: [
      {
        question: "Katta dumba mushagi (M. gluteus maximus) qayerga birikadi va qanday vazifani bajaradi?",
        options: ["Tuberositas glutea femoris va tractus iliotibialis'ga; sonni chanoq-son bo'g'imida kuchli yozadi (ekstenziya) va gavdani tik tutadi", "Trochanter minor'ga; sonni bukadi", "Katta boldir suyagiga; tizzani bukadi", "Qovurg'alarga birikadi"],
        correctAnswerIndex: 0,
        explanation: "M. gluteus maximus odam tik turganda va zinadan ko'tarilganda sonni kuchli yozuvchi eng katta mushakdir."
      },
      {
        question: "O'rta va kichik dumba mushaklari (Mm. gluteus medius et minimus) qayerga birikadi va vazifasi nima?",
        options: ["Trochanter major femoris'ga (katta ko'stga); sonni chetga uzoqlashtiradi (abduksion) va yurishda chanoqni gorizontal ushlab turadi", "Trochanter minor'ga; sonni yaqinlashtiradi", "Tibia do'ngligiga", "Tovon suyagiga"],
        correctAnswerIndex: 0,
        explanation: "O'rta va kichik dumba mushaklari sonni chetga tortadi va bir oyoqda turganda chanoqning qarama-qarshi tomonga tushib ketishiga yo'l qo'ymaydi."
      },
      {
        question: "Noksimon mushak (M. piriformis) chanoqning katta o'tirg'ich teshigini qaysi teshiklarga ajratadi?",
        options: ["Foramen suprapiriforme (nok usti teshigi) va Foramen infrapiriforme (nok osti teshigi)", "Foramen obturatum va foramen ischiadicum", "Canalis femoralis va canalis adductorius", "Lacuna musculorum va vasorum"],
        correctAnswerIndex: 0,
        explanation: "M. piriformis foramen ischiadicum majus orqali o'tib, uni nok usti va nok osti teshiklariga bo'ladi."
      },
      {
        question: "Nok osti teshigi (Foramen infrapiriforme) orqali inson tanasidagi eng yirik qaysi nerv chiqadi?",
        options: ["Nervus ischiadicus (quymich nervi)", "Nervus femoralis", "Nervus obturatorius", "Nervus saphenus"],
        correctAnswerIndex: 0,
        explanation: "Nok osti teshigidan Nervus ischiadicus, n. pudendus, n. gluteus inferior va tomirlar chanoqdan chiqadi."
      },
      {
        question: "Yonbosh-bel mushagi (M. iliopsoas) qayerga birikadi va qanday vazifani bajaradi?",
        options: ["Trochanter minor femoris'ga (kichik ko'stga); sonni chanoq-son bo'g'imida kuchli bukadi (asosiy fleksor)", "Trochanter major'ga; sonni yozadi", "Patella'ga; tizzani yozadi", "Tuberositas tibiae'ga"],
        correctAnswerIndex: 0,
        explanation: "M. iliopsoas (m. psoas major va m. iliacus qo'shilmasi) sonni bukuvchi eng kuchli mushakdir."
      },
      {
        question: "Tikuvchilar mushagi (M. sartorius) qanday xususiyatga ega?",
        options: ["Inson tanasidagi eng uzun lentasimon mushak; sonni ham, tizzani ham bukadi va sonni tashqariga buradi", "Eng kalta mushak", "Sonni yozadi", "Faqat tizzani yozadi"],
        correctAnswerIndex: 0,
        explanation: "M. sartorius spina iliaca anterior superior'dan boshlanib katta boldir suyagiga spiral shaklda boruvchi eng uzun mushakdir."
      },
      {
        question: "Sonning to'rt boshli mushagi (M. quadriceps femoris) qaysi boshlardan iborat?",
        options: ["M. rectus femoris, m. vastus lateralis, m. vastus medialis, m. vastus intermedius", "M. biceps femoris, semitendinosus, semimembranosus", "M. gracilis, pectineus, adductor longus", "M. sartorius va iliopsoas"],
        correctAnswerIndex: 0,
        explanation: "M. quadriceps femoris son oldingi sohasining yirik mushagi bo'lib, to'rtta kuchli boshdan iborat."
      },
      {
        question: "Sonning to'rt boshli mushagi umumiy payi ichida qaysi yirik sesamosimon suyak joylashgan?",
        options: ["Patella (tizza qopqog'i)", "Fabella", "Talus", "Os pisiforme"],
        correctAnswerIndex: 0,
        explanation: "To'rt boshli mushak payi tizza qopqog'ini (patella) o'rab olib, Ligamentum patellae ko'rinishida Tuberositas tibiae'ga birikadi."
      },
      {
        question: "Sonning to'rt boshli mushagi qanday asosiy vazifani bajaradi?",
        options: ["Tizza bo'g'imida boldirni kuchli yozadi (ekstenziya); to'g'ri boshi (m. rectus femoris) esa sonni ham bukadi", "Tizzani bukadi", "Sonni yaqinlashtiradi", "Oyoqni pronatsiya qiladi"],
        correctAnswerIndex: 0,
        explanation: "M. quadriceps femoris tizza bo'g'imining eng kuchli yozuvchisi bo'lib, tik turish va yurishda asosiy rol o'ynaydi."
      },
      {
        question: "Sonning medial guruhi (yaqinlashtiruvchi / adductor) mushaklariga qaysilar kiradi?",
        options: ["M. pectineus, m. gracilis, m. adductor longus, m. adductor brevis, m. adductor magnus", "M. quadriceps femoris", "M. biceps femoris", "M. gluteus maximus"],
        correctAnswerIndex: 0,
        explanation: "Medial guruh mushaklari chanoqning qov va o'tirg'ich suyaklaridan boshlanib sonni tanaga yaqinlashtiradi (adduksion)."
      },
      {
        question: "Katta boldir suyagi g'oz panjasi (Pes anserinus superficialis) ni qaysi uchta mushak paylari hosil qiladi?",
        options: ["M. sartorius, m. gracilis, m. semitendinosus", "M. biceps femoris, semimembranosus, rectus femoris", "M. quadriceps, gastrocnemius, soleus", "M. tibialis anterior, extensor digitorum, peroneus"],
        correctAnswerIndex: 0,
        explanation: "Uch xil guruhdan kelgan Sartorius (old), Gracilis (medial) va Semitendinosus (orqa) paylari tibia medialida yuzaki g'oz panjasini hosil qiladi."
      },
      {
        question: "Sonning orqa guruhi (bukuvchi / ischiocrural) mushaklariga qaysilar kiradi?",
        options: ["M. biceps femoris, M. semitendinosus, M. semimembranosus", "M. quadriceps femoris va sartorius", "M. adductor magnus va gracilis", "M. gastrocnemius va soleus"],
        correctAnswerIndex: 0,
        explanation: "Orqa guruh o'tirg'ich do'ngligidan boshlanib, tizza bo'g'imini bukadi va chanoq-son bo'g'imida sonni yozadi."
      },
      {
        question: "Son uchburchagi (Trigonum femorale / Skarpa uchburchagi) qaysi tuzilmalar bilan chegaralangan?",
        options: ["Yuqoridan Ligamentum inguinale, lateraldan M. sartorius, medialdan M. adductor longus", "Yuqoridan chanoq, pastdan tizza", "Oldindan to'rt boshli mushak, orqadan dumba", "Medialdan gracilis, lateraldan biceps"],
        correctAnswerIndex: 0,
        explanation: "Trigonum femorale ichida Fossa iliopectinea va unda son tomir-nerv tutami (Vena, Arteria, Nervus femoralis - VAN) yotadi."
      },
      {
        question: "Tomir lakunasi (Lacuna vasorum) orqali nimalar o'tadi?",
        options: ["Arteria femoralis (lateralda), Vena femoralis (medialda) va limfa tomirlari", "Nervus femoralis va m. iliopsoas", "Nervus ischiadicus", "Funiculus spermaticus"],
        correctAnswerIndex: 0,
        explanation: "Lacuna vasorum chov boylami ostida bo'lib, son arteriyasi, son venasi va Rozenmyuller-Pirogov limfa tuguni o'tadi."
      },
      {
        question: "Mushak lakunasi (Lacuna musculorum) orqali nimalar o'tadi?",
        options: ["Musculus iliopsoas va Nervus femoralis", "Arteria va vena femoralis", "Nervus obturatorius", "Nervus ischiadicus"],
        correctAnswerIndex: 0,
        explanation: "Lacuna musculorum yonbosh-qov suyagi yoyi (arcus iliopectineus) lateralida bo'lib, m. iliopsoas va n. femoralis o'tadi."
      },
      {
        question: "Son kanali (Canalis femoralis) qachon hosil bo'ladi va uning ichki teshigi nima?",
        options: ["Normada mavjud bo'lmaydi, faqat son grijasi chiqqandagina hosil bo'ladi; ichki teshigi Anulus femoralis", "Har doim mavjud bo'lib, ichidan arteriya o'tadi", "Tizzada hosil bo'ladi", "Suyak ichidagi kanal"],
        correctAnswerIndex: 0,
        explanation: "Canalis femoralis patologik kanal bo'lib, son grijasi anulus femoralis orqali hiatal saphenus tomon yorib chiqqanda vujudga keladi."
      },
      {
        question: "Yaqinlashtiruvchi kanal (Canalis adductorius / Hunter kanali) orqali nimalar o'tadi?",
        options: ["Arteria femoralis, Vena femoralis va Nervus saphenus", "Nervus ischiadicus", "Nervus obturatorius", "Arteria profunda femoris"],
        correctAnswerIndex: 0,
        explanation: "Hunter kanali sonning pastki 1/3 qismidan taqim chuqurchasiga o'tuvchi kanal bo'lib, a. va v. femoralis hamda n. saphenus o'tadi."
      },
      {
        question: "Taqim chuqurchasi (Fossa poplitea) ning yuqori va pastki chegaralari qaysilar?",
        options: ["Yuqori-medialdan m. semimembranosus va semitendinosus, yuqori-lateraldan m. biceps femoris, pastdan m. gastrocnemius'ning medial va lateral boshlari", "Yuqoridan son suyagi, pastdan tovon", "Oldindan patella", "Yon tomondan sartorius"],
        correctAnswerIndex: 0,
        explanation: "Fossa poplitea rombsimon chuqurcha bo'lib, tubida tizza bo'g'imi kapsulasi va m. popliteus yotadi."
      },
      {
        question: "Taqim chuqurchasida tomir-nerv tutami sirtidan chuqurlikka qarab qanday tartibda (N-V-A) joylashadi?",
        options: ["Eng yuzaki: Nervus tibialis, o'rtada: Vena poplitea, eng chuqurda: Arteria poplitea", "Eng yuzaki arteriya, eng chuqur nerv", "Vena, arteriya, nerv", "Nerv, arteriya, vena"],
        correctAnswerIndex: 0,
        explanation: "N-V-A qoidasi bo'yicha: yuzakida n. tibialis, o'rtada v. poplitea va eng chuqur suyak ustida a. poplitea joylashadi."
      },
      {
        question: "Boldirning uch boshli mushagi (M. triceps surae) qaysi mushaklardan tashkil topgan?",
        options: ["M. gastrocnemius (ikki boshli boldir mushagi) va M. soleus (kambalasimon mushak)", "M. tibialis anterior va posterior", "M. peroneus longus va brevis", "M. popliteus va plantaris"],
        correctAnswerIndex: 0,
        explanation: "M. triceps surae orqa yuzadagi ikkita qorinli gastrocnemius va chuqurdagi keng soleus mushagidan iborat."
      },
      {
        question: "Axill payi (Tendo calcaneus / Axillovo suxojilie) inson tanasidagi eng baquvvat pay bo'lib, qayerga birikadi?",
        options: ["Tuber calcanei'ga (tovon suyagi do'ngligiga)", "Talus suyagiga", "Kaft suyaklariga", "Naviculare suyagiga"],
        correctAnswerIndex: 0,
        explanation: "Tendo calcaneus m. triceps surae umumiy payi bo'lib, tovon do'ngligiga birikadi va 400 kg gacha yuklamaga chidaydi."
      },
      {
        question: "Boldirning uch boshli mushagi qanday vazifa bajaradi?",
        options: ["Oyoq panjasini boldir-oshiq bo'g'imida kuchli bukadi (tagiga egar / oyoq uchida turish) va tizzani bukadi", "Oyoq panjasini yuqoriga ko'taradi (yozadi)", "Tizzani yozadi", "Barmoqlarni yozadi"],
        correctAnswerIndex: 0,
        explanation: "M. triceps surae oyoq panjasini pastga (plantar fleksiyaga) bukib, yurish, yugurish va sakrashda yerni itaradi."
      },
      {
        question: "Oldingi katta boldir mushagi (M. tibialis anterior) qanday vazifa bajaradi?",
        options: ["Oyoq panjasini orqaga (yuqoriga) yozadi (dorsal fleksiya) va panjani ichkariga buradi (supinatsiya)", "Oyoq panjasini pastga bukadi", "Pronatsiya qiladi", "Tizzani bukadi"],
        correctAnswerIndex: 0,
        explanation: "M. tibialis anterior boldir oldingi sohasida bo'lib, tovon bilan yurishni va panjani ko'tarishni ta'minlaydi."
      },
      {
        question: "Uzoq va qisqa qamish mushaklari (Mm. peroneus / fibularis longus et brevis) qayerda joylashgan va vazifasi nima?",
        options: ["Boldirning lateral guruhida; oyoq panjasini pastga bukadi, chetga buradi va lateral chetini ko'taradi (pronatsiya)", "Boldir orqasida; supinatsiya qiladi", "Boldir oldida; tizzani yozadi", "Son sohasida"],
        correctAnswerIndex: 0,
        explanation: "Peroneal mushaklar lateral to'piq orqasidan o'tib oyoq panjasini pronatsiya qiladi va ko'ndalang gumbazni mustahkamlaydi."
      },
      {
        question: "Boldir-taqim kanali (Canalis cruropopliteus / Gruberi kanali) qayerda joylashgan va undan nima o'tadi?",
        options: ["M. soleus va boldirning orqa chuqur mushaklari orasida; a. tibialis posterior, venae tibiales posteriores va n. tibialis o'tadi", "Boldir oldida; a. tibialis anterior o'tadi", "Lateral sohada; n. peroneus o'tadi", "Tizza oldida"],
        correctAnswerIndex: 0,
        explanation: "Gruber kanali taqim chuqurchasidan boshlanib orqa katta boldir qon tomir-nerv tutamini boldir tagiga o'tkazadi."
      },
      {
        question: "Taqim mushagi (M. popliteus) qanday vazifa bajaradi?",
        options: ["Tizza bo'g'imini bukishni boshlab beradi va tizza bukilganda boldirni ichkariga buradi (pronatsiya)", "Tizzani yozadi", "Oyoq panjasini yozadi", "Sonni yaqinlashtiradi"],
        correctAnswerIndex: 0,
        explanation: "M. popliteus tizza to'liq yozilgan holatdan bukilishga o'tishda 'qulfni ochuvchi' rotatsion vazifani bajaradi."
      },
      {
        question: "Oyoq kaftining orqa (ustki) yuzasida qaysi qisqa yozuvchi mushaklar joylashadi?",
        options: ["M. extensor digitorum brevis va M. extensor hallucis brevis", "M. flexor digitorum brevis", "M. abductor hallucis", "M. adductor hallucis"],
        correctAnswerIndex: 0,
        explanation: "Oyoq panjasining ustki yuzasida barmoqlarni va bosh barmoqni yozuvchi kalta mushaklar joylashadi."
      },
      {
        question: "Oyoq tagi aponevrozi (Aponeurosis plantaris) nimadan hosil bo'ladi va vazifasi nima?",
        options: ["Tovon suyagidan barmoqlargacha tortilgan o'ta pishiq payli plastinka; oyoq gumbazlarini mustahkam ushlab turadi", "Teri qatlami", "Suyak qobig'i", "Yog' qatlami"],
        correctAnswerIndex: 0,
        explanation: "Aponeurosis plantaris oyoq tagining bo'ylama gumbazini kamon ipidek tarang ushlab turuvchi asosiy elastik strukturadir."
      },
      {
        question: "Oyoq tagining o'rta guruhi mushaklariga qaysilar kiradi?",
        options: ["M. flexor digitorum brevis, M. quadratus plantae, Mm. lumbricales, Mm. interossei", "M. abductor hallucis va flexor hallucis", "M. abductor digiti minimi", "M. tibialis anterior"],
        correctAnswerIndex: 0,
        explanation: "O'rta guruh oyoq tagining chuqur va yuzaki qavatlarini egallab, barmoqlarni bukish va gumbazni saqlashga xizmat qiladi."
      },
      {
        question: "Kvadrat oyoq tagi mushagi (M. quadratus plantae / Caro quadrata Sylvii) qanday vazifa bajaradi?",
        options: ["Barmoqlarni uzun bukuvchi mushak (m. flexor digitorum longus) payiga birikib uning tortish yo'nalishini to'g'rilaydi", "Bosh barmoqni uzoqlashtiradi", "Tovonni ko'taradi", "Oyoq panjasini yozadi"],
        correctAnswerIndex: 0,
        explanation: "M. quadratus plantae fleksor payining qiya tortish kuchini to'g'rilab barmoqlarning to'g'ri bukilishini ta'minlaydi."
      }
    ]
  }
];


