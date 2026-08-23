import { CuratedTopicQuiz } from './topicQuizzesData';

export const SEMESTER_3_QUIZZES: CuratedTopicQuiz[] = [
  // ==========================================
  // TOPIC 1 (Order 101 / S3-1): Orqa miya, Bosh miya poyasi, IV qorincha, Miyacha
  // ==========================================
  {
    topicOrder: 101,
    topicKeywords: ["orqa miya", "medulla spinalis", "uzunchoq miya", "voroliy", "ko'prik", "miyacha", "cerebellum", "iv qorincha", "romb"],
    quizzes: [
      {
        question: "Orqa miya (Medulla spinalis) ning yuqori va pastki anatomik chegaralari qaysilar?",
        options: ["Yuqorida Foramen magnum (ensa teshigi / uzunchoq miya chegarasi) dan pastda L1-L2 bel umurtqalarigacha (Conus medullaris)", "Kalladan to dum suyagigacha to'liq", "C1 dan Th12 gacha", "Miyachadan quymichgacha"],
        correctAnswerIndex: 0,
        explanation: "Kattalarda orqa miya L1-L2 umurtqalar darajasida konus (Conus medullaris) bo'lib tugaydi va Filum terminale'ga o'tadi."
      },
      {
        question: "Orqa miya nechta segmentdan tashkil topgan?",
        options: ["31 ta segmentdan (8 bo'yin, 12 ko'krak, 5 bel, 5 dumg'aza, 1 dum)", "33 ta segmentdan", "24 ta segmentdan", "12 ta segmentdan"],
        correctAnswerIndex: 0,
        explanation: "Orqa miya 31 juft spinal nervlarga mos 31 ta segmentdan (8 C, 12 Th, 5 L, 5 S, 1 Co) iborat."
      },
      {
        question: "Orqa miya kulrang moddasining oldingi shoxlarida (Cornu anterius) qanday neyronlar joylashgan?",
        options: ["Harakatlantiruvchi (motor) neyronlar (alfa va gamma motoneyronlar)", "Sezuvchi neyronlar", "Simpatik neyronlar", "Parasimpatik neyronlar"],
        correctAnswerIndex: 0,
        explanation: "Oldingi shoxlarda skelet mushaklarini innervatsiya qiluvchi yirik harakatlantiruvchi neyronlar yotadi."
      },
      {
        question: "Orqa miya yon shoxlari (Cornu laterale) qaysi segmentlarda mavjud va qanday vazifani bajaradi?",
        options: ["C8-L2/L3 segmentlarida bo'lib, vegetativ (simpatik) nerv tizimi markazlarini saqlaydi", "Barcha 31 ta segmentda", "Faqat bo'yin segmentlarida", "Faqat dumg'aza segmentlarida"],
        correctAnswerIndex: 0,
        explanation: "Yon shoxlar C8/Th1-L2/L3 sohasida simpatik neyronlarni, S2-S4 sohasida esa sakral parasimpatik markazlarni saqlaydi."
      },
      {
        question: "Orqa miya orqa shoxlarida (Cornu posterius) qanday neyronlar joylashgan?",
        options: ["Sezuvchi oraliq (assotsiativ) neyronlar", "Harakatlantiruvchi neyronlar", "Simpatik neyronlar", "Purkine hujayralari"],
        correctAnswerIndex: 0,
        explanation: "Orqa shoxlarga orqa ildiz sezuvchi tolalari kirib, bu yerdagi sezuvchi o'zaklar bilan sinaps hosil qiladi."
      },
      {
        question: "Ot dumi (Cauda equina) qanday hosil bo'ladi?",
        options: ["L2 dan pastda orqa miya konusidan pastga yo'nalgan bel, dumg'aza va dum nerv ildizlarining to'plamidan", "Orqa miya pardalaridan", "Bo'yin nervlaridan", "Miya poyasidan"],
        correctAnswerIndex: 0,
        explanation: "Orqa miya L1-L2 da tugagani sababli pastki nerv ildizlari o'z teshiklariga yetguncha vertikal tushib 'ot dumi'ni hosil qiladi."
      },
      {
        question: "Orqa miya pardalari tashqaridan ichkariga qarab qanday tartibda joylashgan?",
        options: ["Dura mater spinalis (qattiq), Arachnoidea spinalis (to'rsimon), Pia mater spinalis (yumshoq)", "Pia mater -> Arachnoidea -> Dura mater", "Perikard -> Plevra -> Peritoneum", "Endoteliy -> Adventitiya"],
        correctAnswerIndex: 0,
        explanation: "Orqa miya 3 qavat parda bilan o'ralgan: tashqi qattiq, o'rta to'rsimon va tomirlarga boy ichki yumshoq parda."
      },
      {
        question: "Epidural bo'shliq (Spatium epidurale) qayerda joylashgan va ichida nima bor?",
        options: ["Umurtqa kanali suyakusti pardasi va Dura mater orasida; ichida yog' to'qimasi va venoz chigal joylashgan", "Dura mater va arachnoidea orasida", "To'rsimon parda ostida", "Orqa miya markazida"],
        correctAnswerIndex: 0,
        explanation: "Epidural bo'shliq umurtqa kanali va qattiq parda orasida bo'lib, epidural behushlik shu sohaga qilinadi."
      },
      {
        question: "Subaraxnoidal bo'shliqda (Spatium subarachnoideum) qanday suyuqlik aylanadi?",
        options: ["Orqa miya suyuqligi (Likvor / Liquor cerebrospinalis)", "Limfa", "Qon", "Seroz ekssudat"],
        correctAnswerIndex: 0,
        explanation: "Subaraxnoidal bo'shliq to'rsimon va yumshoq parda orasida bo'lib, unda bosh va orqa miyani himoyalovchi likvor aylanadi."
      },
      {
        question: "Lyumbal punksiya (orqa miya likvorini olish) kattalarda xavfsiz ravishda qaysi oraliqdan qilinadi?",
        options: ["L3-L4 yoki L4-L5 umurtqalar oralig'idan (orqa miya shikastlanish xavfi yo'q)", "Th12-L1 oralig'idan", "C1-C2 oralig'idan", "C7-Th1 oralig'idan"],
        correctAnswerIndex: 0,
        explanation: "Orqa miya L1-L2 da tugashi sababli L3-L4/L4-L5 sohasida faqat Cauda equina suzib yuradi va punksiya xavfsiz hisoblanadi."
      },
      {
        question: "Uzunchoq miya (Medulla oblongata) ning oldingi yuzasida qanday tuzilmalar bor?",
        options: ["Piramidalar (Pyramides) va ularning lateralida Olivalar (Olivae)", "Miyacha oyoqchalari", "To'rt tepalik", "Ko'prik"],
        correctAnswerIndex: 0,
        explanation: "Uzunchoq miya oldida kortikospinal o'tkazuv yo'llaridan iborat piramidalar va piramidalar kesishmasi (Decussatio pyramidum) joylashgan."
      },
      {
        question: "Uzunchoq miyada qaysi hayotiy muhim reflektor markazlar joylashgan?",
        options: ["Nafas olish, Yurak-qon tomir faoliyatini boshqarish hamda himoya reflekslari (yutish, yo'tal, aksa urish, qusish)", "Faqat ko'rish markazi", "Faqat eshitish markazi", "Ixtiyoriy harakat po'stlog'i"],
        correctAnswerIndex: 0,
        explanation: "Uzunchoq miyaning zararlanishi nafas va yurak faoliyatining to'xtashiga (bir lahzada o'limga) olib keladi."
      },
      {
        question: "Uzunchoq miyada qaysi bosh miya nervlarining o'zaklari joylashgan?",
        options: ["IX (til-halqum), X (adashgan), XI (qo'shimcha), XII (tilosti) juft nervlar", "I va II juft", "III va IV juft", "V, VI, VII juft"],
        correctAnswerIndex: 0,
        explanation: "Uzunchoq miya kaudal guruhdagi IX, X, XI va XII juft bosh miya nervlari o'zaklarini o'z ichiga oladi."
      },
      {
        question: "Voroliy ko'prigi (Pons) da qaysi bosh miya nervlari o'zaklari joylashgan?",
        options: ["V (uch shoxli), VI (uzoqlashtiruvchi), VII (yuz) va VIII (dahliz-chig'anoq) juft nervlar", "I va II juft", "III va IV juft", "XI va XII juft"],
        correctAnswerIndex: 0,
        explanation: "Ko'prik va rombsimon chuqurchaning yuqori yarmida V, VI, VII va VIII juft nervlar joylashadi."
      },
      {
        question: "Rombsimon chuqurcha (Fossa rhomboidea) nimaning tubini hosil qiladi?",
        options: ["IV qorincha (Ventriculus quartus) tubini", "III qorincha tubini", "Yon qorinchalarni", "Silviy suv yo'lini"],
        correctAnswerIndex: 0,
        explanation: "Fossa rhomboidea uzunchoq miya va ko'prikning orqa yuzasidan hosil bo'lib, IV qorincha tubi hisoblanadi."
      },
      {
        question: "IV qorinchadan (Ventriculus quartus) likvor subaraxnoidal bo'shliqqa qaysi teshiklar orqali chiqadi?",
        options: ["1 ta toq Magandi teshigi (Apertura mediana) va 2 ta juft Lyushka teshiklari (Aperturae laterales) orqali", "Monro teshiklari orqali", "Silviy yo'li orqali", "Pakanon teshiklari orqali"],
        correctAnswerIndex: 0,
        explanation: "IV qorincha likvori Magandi va Lyushka teshiklari orqali miya asosidagi subaraxnoidal sisternalarga quyiladi."
      },
      {
        question: "Miyacha (Cerebellum) ning asosiy vazifasi nimadan iborat?",
        options: ["Harakatlar koordinatsiyasi, muvozanatni saqlash, mushaklar tonusi va nozik motorikani boshqarish", "Ko'rish va hid bilish", "Nafas ritmini belgilash", "Gormonlar sintezi"],
        correctAnswerIndex: 0,
        explanation: "Miyacha barcha ixtiyoriy harakatlarni tekislaydi, sinxronlaydi va tananing muvozanatini boshqaradi."
      },
      {
        question: "Miyacha po'stlog'ining asosiy tormozlovchi efferent neyronlari qaysilar?",
        options: ["Purkine hujayralari (Nodulyar / Noksimon neyronlar)", "Donador hujayralar", "Piramidal hujayralar", "Astrositlar"],
        correctAnswerIndex: 0,
        explanation: "Miyacha po'stlog'idan chiquvchi yagona yo'l Purkine hujayralari aksonlari bo'lib, GAMK orqali chuqur o'zaklarni tormozlaydi."
      },
      {
        question: "Miyachaning chuqur o'zaklariga (Nuclei cerebelli) qaysilar kiradi?",
        options: ["Nucleus dentatus (tishsimon), Nucleus emboliformis (tiqinsimon), Nucleus globosus (sharsimon), Nucleus fastigii (chortoq)", "Nucleus caudatus va lentiformis", "Thalamus va hypothalamus", "Substantia nigra"],
        correctAnswerIndex: 0,
        explanation: "Miyacha oq moddasi ichida 4 juft o'zak yotadi, eng kattasi tishsimon o'zak (Nucleus dentatus) dir."
      },
      {
        question: "Miyacha chuvalchangi (Vermis cerebelli) shikastlanganda (zararlanganda) qanday klinik sindrom yuzaga keladi?",
        options: ["Statik ataksiya (tik turganda va yurganda muvozanatning yo'qolishi, mast odamdek chayqalish)", "Sezgi yo'qolishi", "Ko'rlik", "Nutq yo'qolishi"],
        correctAnswerIndex: 0,
        explanation: "Chuvalchang (Vermis) tana muvozanatini boshqaradi; uning zararlanishi magistral/statik ataksiyaga olib keladi."
      },
      {
        question: "Miyacha yarim sharlari zararlanganda qanday simptomlar kuzatiladi?",
        options: ["Dinamik ataksiya, dismetriya (mo'ljalga yetmaslik), intension tremor (harakat oxirida qo'l qaltirashi), disdiadoxokinez", "Tana falaji", "Xotira yo'qolishi", "Eshitish yo'qolishi"],
        correctAnswerIndex: 0,
        explanation: "Yarim sharlar a'zolar nozik harakatini boshqargani uchun barmoq-burun sinamasida intension titrash va dismetriya bo'ladi."
      },
      {
        question: "Miyacha oyoqchalari (Pedunculi cerebellares) necha juft va nimaga tutashadi?",
        options: ["3 juft: pastki (uzunchoq miyaga), o'rta (ko'prikka), yuqori (o'rta miyaga)", "2 juft: old va orqa", "4 juft: har bir bo'lakka", "1 juft: faqat ko'prikka"],
        correctAnswerIndex: 0,
        explanation: "Pastki oyoqchalar orqa va uzunchoq miyaga, o'rta oyoqchalar ko'prikka, yuqori oyoqchalar o'rta miyaga boradi."
      },
      {
        question: "Bosh miya asosi (Basis encephali) da qaysi bosh miya nervi kalla ichidan chiqmaydi (to'g'ridan-to'g'ri hidlov traktidan kiradi)?",
        options: ["I juft - Nervus olfactorius (Hidlov nervi)", "II juft - Nervus opticus", "III juft - Nervus oculomotorius", "V juft - Nervus trigeminus"],
        correctAnswerIndex: 0,
        explanation: "Nervus olfactorius burun bo'shlig'idan g'alvursimon suyak teshiklari orqali to'g'ridan-to'g'ri Bulbus olfactorius'ga kiradi."
      },
      {
        question: "Miya poyasining orqa yuzasidan (dorsal tomondan) chiquvchi YAGONA bosh miya nervi qaysi?",
        options: ["IV juft - Nervus trochlearis (G'altaksimon nerv)", "III juft - Nervus oculomotorius", "VI juft - Nervus abducens", "VII juft - Nervus facialis"],
        correctAnswerIndex: 0,
        explanation: "N. trochlearis miya poyasining orqa (dorsal) yuzasidan chiquvchi va kalla ichida to'liq kesishuvchi yagona nervdir."
      },
      {
        question: "Ko'prik-miyacha burchagidan (Angulus pontocerebellaris) qaysi nervlar chiqadi?",
        options: ["VII (yuz nervi) va VIII (dahliz-chig'anoq nervi)", "III va IV nervlar", "I va II nervlar", "XI va XII nervlar"],
        correctAnswerIndex: 0,
        explanation: "Ko'prik-miyacha burchagida VII va VIII nervlar chiqadi; bu sohadagi nevrinoma (shvannoma) eshitish va mimikani buzadi."
      },
      {
        question: "Goll va Bur审核 (Fasciculus gracilis et cuneatus) tutamlari qayerda tugaydi?",
        options: ["Uzunchoq miyaning nozik va ponasimon o'zaklarida (Nucleus gracilis et cuneatus)", "Miyacha po'stlog'ida", "Ko'rish do'mbog'ida", "Orqa miya oldingi shoxida"],
        correctAnswerIndex: 0,
        explanation: "Proprioseptiv sezgi tolalari uzunchoq miyada Nucleus gracilis va cuneatus neyronlariga o'tadi va ikkinchi neyronni hosil qiladi."
      },
      {
        question: "Piramida yo'llarining kesishmasi (Decussatio pyramidum) qayerda joylashgan?",
        options: ["Uzunchoq miya va orqa miya chegarasida", "O'rta miyada", "Voroliy ko'prigida", "Thalamusda"],
        correctAnswerIndex: 0,
        explanation: "Uzunchoq miyaning pastki qismida kortikospinal tolalarning 80-85% qarama-qarshi tomonga o'tib lateral piramida yo'lini hosil qiladi."
      },
      {
        question: "Miya qattiq pardasi sinuslaridan qon qaysi yirik venaga oqib ketadi?",
        options: ["Vena jugularis interna (Ichki bo'yininturuq venasiga)", "Vena subclavia", "Vena cava superior", "Vena vertebralis"],
        correctAnswerIndex: 0,
        explanation: "Kalla bo'shlig'idagi barcha venoz sinuslar Sinus sigmoideus orqali foramen jugulare'da Vena jugularis interna'ga quyiladi."
      },
      {
        question: "Orqa miyaning 'Kulrang modda' (Substantia grisea) va 'Oq modda' (Substantia alba) joylashuvi qanday?",
        options: ["Kulrang modda ichkarida kapalak shaklida, Oq modda esa tashqarida ustunlar (Funiculi) shaklida joylashgan", "Oq modda ichkarida, kulrang tashqarida", "Faqat bitta qavat", "Aralash joylashgan"],
        correctAnswerIndex: 0,
        explanation: "Orqa miyada neyron tanalari ichkarida (kulrang modda), ularning mielinli o'tkazuv tolalari tashqarida (oq modda) yotadi."
      },
      {
        question: "Bosh miya gidrosefaliyasi (suv yig'ilishi) ko'pincha qaysi yo'lning berkilib qolishidan kelib chiqadi?",
        options: ["Silviy suv yo'li (Aqueductus cerebri) yoki IV qorincha teshiklari (Magandi va Lyushka) to'silib qolishidan", "Aorta torayishidan", "Umurtqa kanali sinishidan", "Ko'rish kanalidan"],
        correctAnswerIndex: 0,
        explanation: "Likvor oqimi yo'llari (Silviy yo'li, Magandi/Lyushka) bloklansa qorinchalar kengayib bosh ichki bosimi oshadi (okklyuzion gidrosefaliya)."
      }
    ]
  },

  // ==========================================
  // TOPIC 2 (Order 102 / S3-2): O‘rta miya. Oraliq miya. III qorincha
  // ==========================================
  {
    topicOrder: 102,
    topicKeywords: ["o'rta miya", "mesencephalon", "oraliq miya", "diencephalon", "thalamus", "hypothalamus", "iii qorincha", "epithalamus", "substantia nigra"],
    quizzes: [
      {
        question: "O'rta miya (Mesencephalon) ning asosiy anatomik qismlari qaysilar?",
        options: ["Tectum mesencephali (o'rta miya tomi / to'rt tepalik), Tegmentum (qopqoq) va Crura cerebri (miya oyoqchalari)", "Piramidalar va olivalar", "Thalamus va gipotalamus", "Miyacha yarim sharlari"],
        correctAnswerIndex: 0,
        explanation: "O'rta miya to'rt tepalik plastinkasi, oraliq qopqoq va oldingi miya oyoqchalaridan iborat."
      },
      {
        question: "To'rt tepalikning yuqori do'mboqchalari (Colliculi superiores) qanday markaz hisoblanadi?",
        options: ["Po'stloqosti ko'rish reflektor markazi (ko'zni va boshni yorug'likka burish refleksi)", "Po'stloqosti eshitish markazi", "Xid bilish markazi", "Ta'm bilish markazi"],
        correctAnswerIndex: 0,
        explanation: "Colliculi superiores ko'rishning birlamchi reflektor markazi bo'lib, startle-refleksni ta'minlaydi."
      },
      {
        question: "To'rt tepalikning pastki do'mboqchalari (Colliculi inferiores) qanday markaz hisoblanadi?",
        options: ["Po'stloqosti eshitish reflektor markazi (boshni to'satdan chiqqan tovushga burish)", "Ko'rish markazi", "Muvozanat markazi", "Harakatlantiruvchi markaz"],
        correctAnswerIndex: 0,
        explanation: "Colliculi inferiores eshitish yo'lining po'stloqosti markazi hisoblanadi."
      },
      {
        question: "O'rta miya bo'shlig'i nima deb ataladi va u qaysi qorinchalarni tutashtiradi?",
        options: ["Silviy suv yo'li (Aqueductus cerebri / Aqueductus mesencephali); u III qorinchani IV qorincha bilan tutashtiradi", "Monro teshigi", "Magandi teshigi", "Markaziy kanal"],
        correctAnswerIndex: 0,
        explanation: "Silviy yo'li o'rta miyani teshib o'tuvchi tor kanal bo'lib, III va IV qorinchalar orasida likvor oqimini o'tkazadi."
      },
      {
        question: "O'rta miyada joylashgan Qora modda (Substantia nigra / Sommering moddasi) qanday neyromediator ishlab chiqaradi?",
        options: ["Dofamin (Dopamine - harakatlarni boshqaruvchi ekstrapiramidal tizim uchun)", "Serotonin", "Asetilxolin", "Gistamin"],
        correctAnswerIndex: 0,
        explanation: "Substantia nigra neyronlari dofamin sintezlaydi; ularning degeneratsiyasi Parkinson kasalligiga olib keladi."
      },
      {
        question: "Qizil o'zak (Nucleus ruber) ning asosiy funksiyasi nimadan iborat?",
        options: ["Ekstrapiramidal tizimning muhim markazi bo'lib, mushaklar tonusini va tana holatini (postural reflekslar) boshqaradi (Tractus rubrospinalis)", "Ko'rishni ta'minlaydi", "Eshitishni ta'minlaydi", "Gormon ajratadi"],
        correctAnswerIndex: 0,
        explanation: "Nucleus ruber orqa miya motoneyronlariga Monakov yo'li (Tractus rubrospinalis) orqali mushak tonusini boshqaruvchi impulslar yuboradi."
      },
      {
        question: "Parkinson kasalligi qaysi o'rta miya tuzilmasining zararlanishi natijasida rivojlanadi?",
        options: ["Substantia nigra (Qora modda) dofaminergik neyronlarining nobud bo'lishi", "Nucleus ruber", "Colliculi superiores", "Silviy yo'li"],
        correctAnswerIndex: 0,
        explanation: "Qora moddada dofamin yetishmovchiligi tremor, rigidlik (mushak qotishi) va gipokineziyaga sabab bo'ladi."
      },
      {
        question: "Oraliq miya (Diencephalon) qanday asosiy qismlarga bo'linadi?",
        options: ["Thalamus (ko'rish do'mbog'i), Epithalamus, Metathalamus, Hypothalamus va III qorincha", "Uzunchoq miya va ko'prik", "Miyacha va orqa miya", "Peshona va ensa bo'laklari"],
        correctAnswerIndex: 0,
        explanation: "Diencephalon talamik miya (Thalamus, Epithalamus, Metathalamus) va gipotalamusdan tashkil topgan."
      },
      {
        question: "Ko'rish do'mbog'i (Thalamus) qanday markaz hisoblanadi?",
        options: ["Barcha turdagi sezgilarning (hid bilishdan tashqari) po'stloqosti bosh kollektori va qayta ishlovchi markazi", "Harakatlantiruvchi asosiy markaz", "Faqat eshitish markazi", "Likvor ishlab chiqaruvchi bez"],
        correctAnswerIndex: 0,
        explanation: "Barcha afferent sezuvchi yo'llar (og'riq, harorat, taktil, propriosepsiya, ko'rish, ta'm) talamus o'zaklarida sinaps hosil qiladi."
      },
      {
        question: "Epitalamus (Epithalamus) tarkibiga qaysi muhim endokrin bez kiradi?",
        options: ["Gipofiz bezi", "Epifiz bezi (Glandula pinealis / Corpus pineale - Melatonin ishlab chiqaruvchi bez)", "Qalqonsimon bez", "Ayrisimon bez"],
        correctAnswerIndex: 1,
        explanation: "Epifiz sutkalik sirkad ritmlarni (uyqu-uyg'oqlik siklini) boshqaruvchi melatonin gormonini ajratadi."
      },
      {
        question: "Metatalamus (Metathalamus) tarkibidagi tana qismlari qaysilar?",
        options: ["Corpus geniculatum laterale (lateral tirsaksimon tana) va Corpus geniculatum mediale (medial tirsaksimon tana)", "Corpus callosum", "Corpus mamillare", "Corpus striatum"],
        correctAnswerIndex: 0,
        explanation: "Lateral tirsaksimon tana - ko'rishning, Medial tirsaksimon tana - eshitishning po'stloqosti markazidir."
      },
      {
        question: "Gipotalamus (Hypothalamus) ning asosiy biologik vazifasi nima?",
        options: ["Gomeostaz, termoregulyatsiya, chanqov, ochlik, neyroendokrin boshqaruv va vegetativ nerv tizimining oliy markazi", "Faqat skelet mushaklarini qisqartirish", "Miya pardalarini oziqlantirish", "Likvorni so'rish"],
        correctAnswerIndex: 0,
        explanation: "Gipotalamus vegetativ nerv tizimi va endokrin tizimni o'zaro bog'lovchi organizmning bosh gomeostatik regulyatoridir."
      },
      {
        question: "Gipotalamusning supraoptik (Nucleus supraopticus) va paraventrikulyar (Nucleus paraventricularis) o'zaklari qaysi gormonlarni sintezlaydi?",
        options: ["Vazopressin (Antidiuretik gormon - ADG) va Oksitotsin", "Insulin va glyukagon", "Tiroksin va triyodtironin", "Adrenalin va noradrenalin"],
        correctAnswerIndex: 0,
        explanation: "Ushbu gormonlar gipotalamusda sintezlanib aksonlar orqali neyrogipofizga (gipofiz orqa bo'lagiga) o'tadi va qonga ajraladi."
      },
      {
        question: "III qorincha (Ventriculus tertius) qayerda joylashgan?",
        options: ["Ikkita Thalamus orasidagi o'rta sagittal tor yoriqsimon bo'shliq", "Miyacha ichida", "Uzunchoq miyada", "Katta miya yarim sharlarida"],
        correctAnswerIndex: 0,
        explanation: "III qorincha o'ng va chap talamuslarning medial yuzalari orasida vertikal yoriq shaklida joylashgan."
      },
      {
        question: "III qorincha Yon qorinchalar (Ventriculi laterales) bilan qaysi teshik orqali tutashadi?",
        options: ["Foramen interventriculare (Monro teshigi)", "Aqueductus cerebri", "Foramen Magendie", "Foramen Luschka"],
        correctAnswerIndex: 0,
        explanation: "Har bir yon qorincha Monro qorinchalararo teshigi orqali III qorinchaga ochiladi."
      },
      {
        question: "Gipofiz bezi (Hypophysis) kalla suyagining qaysi anatomik tuzilmasida yotadi?",
        options: ["Ponasimon suyakning Turk egarchasi chuqurchasida (Fossa hypophysialis sellae turcicae)", "Ensa suyagida", "G'alvursimon suyakda", "Peshona suyagida"],
        correctAnswerIndex: 0,
        explanation: "Gipofiz turk egari chuqurchasida yotadi va gipotalamusga infundibulum (voronka) orqali tutashadi."
      },
      {
        question: "Gipotalamus zararlanganda qanday qandsiz diabet (Diabetes insipidus) belgisi paydo bo'ladi?",
        options: ["Vazopressin (ADG) yetishmovchiligi sababli haddan tashqari ko'p siydik ajralishi (poliuriya - 10-15 litrgacha) va kuchli chanqash (polidipsiya)", "Qonda qand miqdorining oshishi", "Semirib ketish", "Ko'rish yo'qolishi"],
        correctAnswerIndex: 0,
        explanation: "ADG yetishmaganda buyrak naychalarida suv qayta so'rilmaydi va organizm suvsizlanadi."
      },
      {
        question: "Ko'rish nervlari kesishmasi (Chiasma opticum) qaysi miya qismining pastki yuzasida joylashgan?",
        options: ["Gipotalamusning oldingi sohasida (Tuber cinereum oldida)", "Miyacha chuvalchangida", "To'rt tepalik ustida", "Uzunchoq miyada"],
        correctAnswerIndex: 0,
        explanation: "Chiasma opticum gipotalamus oldida yotadi; gipofiz o'smasi chiasmani ezganda bitemporal gemianopsiya (ikki chekka ko'rlik) bo'ladi."
      },
      {
        question: "So'rg'ichsimon tanalar (Corpora mamillaria) qaysi tizim tarkibiga kiradi va nimada qatnashadi?",
        options: ["Limbik tizim (Peypes halqasi) tarkibiga kiradi va xotira hamda his-tuyg'ularni shakllantirishda qatnashadi", "Faqat eshitishda", "Faqat ko'rishda", "Muskul harakatida"],
        correctAnswerIndex: 0,
        explanation: "Corpora mamillaria gipotalamusning orqa qismida juft do'mboqcha bo'lib, xotira saqlanishi uchun javobgar."
      },
      {
        question: "O'rta miyada III (ko'zni harakatlantiruvchi) va IV (g'altaksimon) juft nervlarning o'zaklari qayerda joylashgan?",
        options: ["Silviy suv yo'li tubidagi Tegmentum (qopqoq) kulrang moddasida", "To'rt tepalik ustida", "Miya oyoqchalari asosida", "Thalamus ichida"],
        correctAnswerIndex: 0,
        explanation: "III nerv o'zagi yuqori tepaliklar sathida, IV nerv o'zagi esa pastki tepaliklar sathida Silviy yo'li tubida yotadi."
      },
      {
        question: "Yakubovich-Edinger-Vestfal o'zagi (Nucleus accessorius n. oculomotorii) qanday vazifani bajaradi?",
        options: ["Ko'z qorachig'ini toraytiruvchi (m. sphincter pupillae) va akkomodatsiyani ta'minlovchi (m. ciliaris) parasimpatik vegetativ o'zak", "Ko'zni tashqariga buradi", "Ko'z yoshini chiqaradi", "Qovoqni yumadi"],
        correctAnswerIndex: 0,
        explanation: "III nervning qo'shimcha parasimpatik o'zagi qorachiqning yorug'likka javoban torayishini (fotorefleks) ta'minlaydi."
      },
      {
        question: "Miya oyoqchalarining asosi (Basis pedunculi cerebri) orqali qanday o'tkazuv yo'llari o'tadi?",
        options: ["Tractus corticospinalis, Tractus corticonuclearis va Tractus corticopontinus (pastga tushuvchi harakatlantiruvchi yo'llar)", "Faqat sezuvchi yo'llar", "Faqat eshituv yo'llari", "Likvor yo'llari"],
        correctAnswerIndex: 0,
        explanation: "Miya oyoqchalari asosi orqali bosh miya po'stlog'idan motor buyruqlarni eltuvchi yirik efferent yo'llar o'tadi."
      },
      {
        question: "Retikulyar formatsiya (Formatio reticularis) ning 'Faollashtiruvchi ko'tariluvchi tizimi' nima uchun javobgar?",
        options: ["Miya po'stlog'ining uyg'oq holatini (tonusini), e'tiborni va hushyorlikni saqlash uchun", "Faqat mushaklarni bo'shashtirish uchun", "Faqat uxlash uchun", "Faqat yurak urishi uchun"],
        correctAnswerIndex: 0,
        explanation: "Retikulyar formatsiyaning po'stloqqa yuboradigan tonik impulslari insonning hushyor va ongli turishini ta'minlaydi."
      },
      {
        question: "Dekortikatsion rigidlik va Deserebratsion rigidlik nima?",
        options: ["O'rta miya va miya poyasining shikastlanishida paydo bo'ladigan barcha yozuvchi (ekstenzor) yoki bukuvchi mushaklarning patologik kuchli taranglashuvi", "Mushaklarning to'liq falajlanishi", "Tana sezgisining yo'qolishi", "Ko'rish qobiliyatining buzilishi"],
        correctAnswerIndex: 0,
        explanation: "Qizil o'zak va vestibulyar o'zaklar orasidagi uzilishlar o'ta og'ir holatdagi mushaklar spazmini (rigidlik) keltirib chiqaradi."
      },
      {
        question: "Thalamusning VPL (Ventral posterolateral) o'zagida qaysi sezgilar sinaps hosil qiladi?",
        options: ["Tanadan keluvchi barcha og'riq, harorat, taktil va proprioseptiv sezgilar", "Ko'rish sezgisi", "Eshitish sezgisi", "Xid bilish"],
        correctAnswerIndex: 0,
        explanation: "Tanadan chiquvchi Spinotalamik va Medial halqa yo'llari talamusning VPL o'zagi orqali po'stloqqa o'tadi."
      },
      {
        question: "Thalamusning VPM (Ventral posteromedial) o'zagida qaysi soha sezgilari to'planadi?",
        options: ["Yuz va bosh sohasidan uch shoxli nerv (n. trigeminus) orqali keluvchi barcha sezgilar va ta'm bilish", "Oyoq sezgilari", "Qo'l sezgilari", "Ichki a'zo tovushlari"],
        correctAnswerIndex: 0,
        explanation: "VPM o'zagi yuz, og'iz bo'shlig'i sezgilarini va ta'm analizatorini qabul qiluvchi talamus o'zagidir."
      },
      {
        question: "Gipotalamusning orqa guruhi qo'zg'alganda organizmda qanday o'zgarish bo'ladi?",
        options: ["Simpatik nerv tizimi faollashadi: qon bosimi oshadi, yurak urishi tezlashadi, qorachiq kengayadi, issiqlik ishlab chiqarish kuchayadi", "Parasimpatik faollashadi", "Odam uxlab qoladi", "Qon bosimi tushadi"],
        correctAnswerIndex: 0,
        explanation: "Gipotalamusning orqa o'zaklari - ergotrop (simpatik), oldingi o'zaklari - trofotrop (parasimpatik) markazlardir."
      },
      {
        question: "Gipotalamusning oldingi guruhi zararlanganda yoki qo'zg'alganda nima sodir bo'ladi?",
        options: ["Parasimpatik ta'sir: bradikardiya, ter ajralishi va issiqlik yo'qotish mexanizmlari ishga tushadi", "Simpatik tonus oshadi", "Harorat ko'tariladi", "Qon quyiladi"],
        correctAnswerIndex: 0,
        explanation: "Oldingi gipotalamus issiqlikni tashqariga chiqarish (terlash, tomirlar kengayishi) orqali tanani sovutadi."
      },
      {
        question: "Adiatetemiya (termregulyatsiya buzilishi) qaysi miya sohasining kasalligida kuzatiladi?",
        options: ["Gipotalamus (Hypothalamus) zararlanganda", "Miyacha zararlanganda", "Ensa bo'lagi jarohatlanganda", "Orqa miya dumida"],
        correctAnswerIndex: 0,
        explanation: "Gipotalamus tananing 'termostati' bo'lib, uning shikastlanishi nazoratsiz gipertermiya yoki gipotermiyaga olib keladi."
      },
      {
        question: "Limbik tizim (Systema limbicum) ning asosiy funksiyasi nimadan iborat?",
        options: ["Hissiyotlar (emotsiyalar), motivatsiya, xatti-harakatlar, instinktlar va uzoq muddatli xotirani shakllantirish", "Faqat suyaklarni qotirish", "Faqat terlash", "Qon ishlab chiqarish"],
        correctAnswerIndex: 0,
        explanation: "Limbik tizim (Gippokamp, bodomsimon tana, kamar pushtasi, gipotalamus) insonning hissiy va xotira markazidir."
      }
    ]
  },

  // ==========================================
  // TOPIC 3 (Order 103 / S3-3): Bosh miya po‘stlog‘i, Bazal o‘zaklar, Yon qorinchalar, Pardalar
  // ==========================================
  {
    topicOrder: 103,
    topicKeywords: ["bosh miya po'stlog'i", "cortex cerebri", "bazal o'zaklar", "corpus striatum", "ventriculi laterales", "pardalar", "gumbaz", "qadoqsimon tana"],
    quizzes: [
      {
        question: "Bosh miya po'stlog'i (Cortex cerebri) nechta gistologik qavatdan iborat?",
        options: ["6 ta qavatdan (Molekulyar, Tashqi donador, Piramidal, Ichki donador, Ganglionar/Bets, Polimorf)", "3 ta qavatdan", "8 ta qavatdan", "4 ta qavatdan"],
        correctAnswerIndex: 0,
        explanation: "Neokorteks (yangi po'stloq) 6 qavat neyronlar qatlamidan tuzilgan bo'lib, 5-qavatda yirik Bets piramidal hujayralari yotadi."
      },
      {
        question: "Qadoqsimon tana (Corpus callosum) qanday komissural tolalardan iborat?",
        options: ["O'ng va chap bosh miya yarim sharlarini o'zaro tutashtiruvchi eng yirik oq modda komissurasi", "Miyani orqa miya bilan tutashtiruvchi yo'l", "Faqat bitta yarim shar ichidagi tolalar", "Miyacha yo'llari"],
        correctAnswerIndex: 0,
        explanation: "Corpus callosum 200-250 million nerv tolasidan iborat bo'lib, ikkala yarim sharning uyg'un ishlashini ta'minlaydi."
      },
      {
        question: "Bosh miya bazal o'zaklariga (Nuclei basales / Striopallidar tizim) qaysilar kiradi?",
        options: ["Nucleus caudatus (dumli o'zak), Nucleus lentiformis (yasмыqsmon o'zak: Putamen va Globus pallidus), Claustrum (to'siq), Corpus amygdaloideum", "Thalamus va gipofiz", "Miyacha o'zaklari", "Olivalar va piramidalar"],
        correctAnswerIndex: 0,
        explanation: "Bazal ganglionlar yarim sharlar oq moddasi ichidagi kulrang modda to'plamlari bo'lib, avtomatlashgan harakatlarni boshqaradi."
      },
      {
        question: "Ixtiyoriy harakatlarning birlamchi motor po'stlog'i (Gyrus precentralis - Brodman 4-maydoni) qaysi bo'lakda joylashgan?",
        options: ["Lobus frontalis (Peshona bo'lagida, markaziy egatdan oldinda)", "Lobus parietalis (Tepa bo'lagida)", "Lobus occipitalis (Ensa bo'lagida)", "Lobus temporalis (Chakka bo'lagida)"],
        correctAnswerIndex: 0,
        explanation: "Gyrus precentralis butun tananing ixtiyoriy harakatini boshqaruvchi 'Dvigatel Gomunkulyus' (Motor homunculus) dir."
      },
      {
        question: "Birlamchi somatosensor (umumiy sezgi) po'stloq markazi (Gyrus postcentralis - Brodman 1, 2, 3) qaysi bo'lakda joylashgan?",
        options: ["Lobus parietalis (Tepa bo'lagida, markaziy egatdan orqada)", "Lobus frontalis", "Lobus occipitalis", "Lobus temporalis"],
        correctAnswerIndex: 0,
        explanation: "Gyrus postcentralis butun tanadan keluvchi taktil, og'riq, harorat va proprioseptiv sezgilarni qabul qiladi."
      },
      {
        question: "Broka motor nutq markazi (Gyrus frontalis inferior orqa qismi - Brodman 44, 45) zararlanganda qanday buzilish bo'ladi?",
        options: ["Motor afaziya (bemor nutqni tushunadi, lekin o'zi gapira olmaydi va so'zlarni talaffuz qila olmaydi)", "Sensor afaziya", "Ko'rlik", "Eshitishning yo'qolishi"],
        correctAnswerIndex: 0,
        explanation: "Broka markazi so'zlashuv mushaklari harakat dasturini tuzadi; zararlanganda gapirish qobiliyati yo'qoladi."
      },
      {
        question: "Vernike sensor nutq markazi (Gyrus temporalis superior orqa qismi - Brodman 22) zararlanganda nima bo'ladi?",
        options: ["Sensor afaziya (bemor gapira oladi, lekin eshitgan nutqini va o'zining gaplarini tushunmaydi - 'so'z salatasi')", "Faqat tovush chiqmaydi", "Qo'l falaji", "Xotira yo'qolishi"],
        correctAnswerIndex: 0,
        explanation: "Vernike markazi eshitilgan nutq ma'nosini anglash markazidir; zararlanganda bemor nutq ma'nosini tushunmaydi."
      },
      {
        question: "Birlamchi ko'rish po'stloq markazi (Brodman 17-maydoni) qaysi sohada joylashgan?",
        options: ["Lobus occipitalis (Ensa bo'lagining Sulcus calcarinus egati atrofida)", "Peshona bo'lagida", "Tepa bo'lagida", "Chakka cho'qqisida"],
        correctAnswerIndex: 0,
        explanation: "Sulcus calcarinus qirg'oqlarida to'r pardadan keluvchi ko'rish impulslarini tahlil qiluvchi birlamchi ko'rish markazi yotadi."
      },
      {
        question: "Birlamchi eshitish po'stloq markazi (Geshil pushtalari - Brodman 41, 42) qaysi sohada joylashgan?",
        options: ["Lobus temporalis (Chakka bo'lagining yuqori chakka pushtasi chuqurligida)", "Ensa bo'lagida", "Peshona bo'lagida", "Tepa bo'lagida"],
        correctAnswerIndex: 0,
        explanation: "Gyrus temporalis superior sohasidagi Geshil pushtalarida eshitish analizatorining po'stloq markazi yotadi."
      },
      {
        question: "Gippokamp (Hippocampus / Ammon shoxi) qaysi miya bo'lagida yotadi va nimaga javobgar?",
        options: ["Chakka bo'lagining medial qismida (Limbik tizim tarkibida); u qisqa muddatli xotirani uzoq muddatli xotiraga aylantirish (konsolidatsiya) uchun javobgar", "Ensa bo'lagida ko'rish uchun", "Peshonada harakat uchun", "Miyachada muvozanat uchun"],
        correctAnswerIndex: 0,
        explanation: "Gippokamp zararlansa bemor yangi ma'lumotlarni eslab qololmaydi (anterograd amneziya)."
      },
      {
        question: "Ichki kapsula (Capsula interna) nima va u qanday qismlardan iborat?",
        options: ["Po'stloq va periferiya orasidagi barcha o'tkazuv yo'llar o'tuvchi qalin oq modda qavati; Crus anterius, Genu (tizza) va Crus posterius'dan iborat", "Miya pardasi", "Venoz sinus", "Qorincha devori"],
        correctAnswerIndex: 0,
        explanation: "Capsula interna talamus va bazal o'zaklar orasida joylashgan; uning insultda zararlanishi qarama-qarshi tomonlama to'liq gemiplegiyaga olib keladi."
      },
      {
        question: "Ichki kapsula tizzasidan (Genu capsulae internae) qaysi muhim o'tkazuv yo'l o'tadi?",
        options: ["Tractus corticonuclearis (bosh miya nervlari harakatlantiruvchi o'zaklariga boruvchi yo'l)", "Tractus spinothalamicus", "Tractus rubrospinalis", "Ko'rish radiatsiyasi"],
        correctAnswerIndex: 0,
        explanation: "Tizza qismidan yuz, til, yutqun mushaklarini boshqaruvchi Tractus corticonuclearis o'tadi."
      },
      {
        question: "Ichki kapsula orqa oyog'ining (Crus posterius) oldingi 2/3 qismidan qaysi yo'l o'tadi?",
        options: ["Tractus corticospinalis (qo'l va oyoq mushaklarini harakatlantiruvchi piramida yo'li)", "Eshitish yo'li", "Hidlov yo'li", "Trolik yo'li"],
        correctAnswerIndex: 0,
        explanation: "Crus posterius orqali tananing asosiy harakatlantiruvchi yo'li - kortikospinal trakt o'tadi."
      },
      {
        question: "Yon qorinchalar (Ventriculi laterales) qanday 4 ta qismdan iborat?",
        options: ["Cornu anterius (peshona shoxi), Pars centralis (markaziy qism), Cornu posterius (ensa shoxi), Cornu inferius (chakka shoxi)", "Faqat o'ng va chap qism", "Yuqori va pastki", "3 ta shox"],
        correctAnswerIndex: 0,
        explanation: "Har bir yarim sharda joylashgan yon qorincha 3 ta shox va markaziy qismga ega."
      },
      {
        question: "Orqa miya suyuqligi (Likvor) asosan qayerda ishlab chiqariladi?",
        options: ["Yon, III va IV qorinchalarning tomirli chigallarida (Plexus choroideus) ependimotsitlar tomonidan", "Miya po'stlog'i neyronlarida", "Qattiq pardada", "Kallaning suyak iligida"],
        correctAnswerIndex: 0,
        explanation: "Likvor sutkasiga taxminan 500 ml hajmda Plexus choroideus filtratsiyasi va sekretsiyasi hisobiga hosil bo'ladi."
      },
      {
        question: "Likvor subaraxnoidal bo'shliqdan venoz qonga qanday qayta so'riladi (rezorbsiya bo'ladi)?",
        options: ["Paxion granulyatsiyalari (Granulationes arachnoideae) orqali kalla suyagi venoz sinuslariga so'riladi", "To'g'ridan-to'g'ri kapillyarlarga", "Limfa orqali", "Burun bo'shlig'iga"],
        correctAnswerIndex: 0,
        explanation: "Paxion granulyatsiyalari to'rsimon pardaning bo'rtmalari bo'lib, likvorni yuqori sagittal sinus qoniga filtrlab o'tkazadi."
      },
      {
        question: "Bosh miyani o'rovchi qattiq pardaning (Dura mater encephali) o'roqsimon o'simtasi (Falx cerebri) qayerda yotadi?",
        options: ["O'ng va chap bosh miya yarim sharlari orasidagi bo'ylama yoriqda (Fissura longitudinalis cerebri)", "Miyacha va bosh miya orasida", "Turk egarchasida", "Ensa chuqurchasida"],
        correctAnswerIndex: 0,
        explanation: "Falx cerebri qattiq pardaning vertikal plastinkasi bo'lib, ikkala yarim sharni o'zaro ajratib turadi."
      },
      {
        question: "Miyacha chodiri (Tentorium cerebelli) nimani nimadan ajratib turadi?",
        options: ["Ensa bo'laklarini miyacha (Cerebellum) ustidan ajratib turadi", "Yarim sharlarni o'zaro", "Gipofizni miyadan", "Ko'prikni orqa miyadan"],
        correctAnswerIndex: 0,
        explanation: "Tentorium cerebelli gorizontal parda bo'lib, orqa kalla chuqurchasidagi miyachani tepasidagi ensa bo'lagidan to'sadi."
      },
      {
        question: "Epidural gematoma (Genuina / Akut) ko'pincha qaysi qon tomirining shikastlanishidan yuzaga keladi?",
        options: ["Arteria meningea media (O'rta parda arteriyasi - chakka suyagi sinishlarida)", "Vena jugularis interna", "Arteria basilaris", "Sinus sagittalis"],
        correctAnswerIndex: 0,
        explanation: "Chakka suyagi pterion sohasida singanda a. meningea media yirtilib, suyak va qattiq parda orasiga tezda arterial qon to'planadi."
      },
      {
        question: "Subdural gematoma qanday qon tomirlar yirtilishidan kelib chiqadi?",
        options: ["Ko'prik venalari (Venae cerebri superiores - po'stloqdan sagittal sinusga o'tuvchi ko'priklovchi venalar)", "Arteria meningea media", "Arteria carotis interna", "Arteria vertebralis"],
        correctAnswerIndex: 0,
        explanation: "Kalla chayqalishi yoki keksalar jarohatida ko'prik venalar uzilib, Dura mater va to'rsimon parda orasiga sekin venoz qon to'planadi."
      },
      {
        question: "Subaraxnoidal qon quyilishi (SAH) ning eng ko'p uchraydigan sababi nima?",
        options: ["Villiziy halqasi arterial anevrizmasining yorilishi (to'satdan paydo bo'ladigan xanjar urilgandek bosh og'rig'i)", "Venalar kengayishi", "Miyacha o'smasi", "Yurak to'xtashi"],
        correctAnswerIndex: 0,
        explanation: "Arterial anevrizma yorilganda qon to'g'ridan-to'g'ri likvor aylanuvchi subaraxnoidal bo'shliqqa quyiladi (meningeal belgilar beradi)."
      },
      {
        question: "Meningeal belgilar (Meningizm) triadasiga qaysilar kiradi?",
        options: ["Ensa mushaklari rigidligi (tortilishi), Kernig belgisi va Brudzinskiy belgilari", "Ko'rlik, soqovlik, falajlik", "Gipertoniya, bradikardiya, taxipnoe", "Titroq, hushdan ketish, qaltirash"],
        correctAnswerIndex: 0,
        explanation: "Miya pardalari yallig'langanda (meningit) yoki qon tushganda ensa mushaklari rigidligi va Kernig/Brudzinskiy belgilari musbat bo'ladi."
      },
      {
        question: "Guntinqton xoreyasi (Chorea Huntington) kasalligida qaysi bazal o'zak atrofiyaga uchraydi?",
        options: ["Striatum (Nucleus caudatus va Putamen) dagi GAMK-ergik neyronlar", "Thalamus", "Gippokamp", "Ensa po'stlog'i"],
        correctAnswerIndex: 0,
        explanation: "Dumli o'zak atrofiyasi sababli tormozlanish yo'qolib, bemorda nazoratsiz tartibsiz tezkor harakatlar (xoreya) paydo bo'ladi."
      },
      {
        question: "Insula (Orolcha bo'lagi / Reil orolchasi) qayerda yashiringan?",
        options: ["Lateral (Silviy) egat chuqurligida (Sulcus lateralis)", "Markaziy egat tubida", "Ensa qutbida", "Corpus callosum ustida"],
        correctAnswerIndex: 0,
        explanation: "Orolcha peshona, tepa va chakka bo'laklari (operculum) ostida chuqur ko'milib yotgan 5-bo'lak hisoblanadi."
      },
      {
        question: "Peshona bo'lagining prefrontal po'stlog'i (Prefrontal cortex) nima uchun javobgar?",
        options: ["Mantiqiy fikrlash, shaxsiyat, qaror qabul qilish, ijtimoiy xulq-atvor va rejalashtirish", "Faqat ko'rish", "Faqat eshitish", "Mushak tonusi"],
        correctAnswerIndex: 0,
        explanation: "Prefrontal po'stloq insonning eng oliy ruhiy faoliyatini, intellektini va irodasini boshqaradi."
      },
      {
        question: "Kamar pushtasi (Gyrus cinguli) qayerda joylashgan?",
        options: ["Qadoqsimon tananing (Corpus callosum) ustki yuzasida (yarim sharlarning medial yuzasida)", "Lateral egat tubida", "Miyacha ustida", "Tepa bo'lagi tashqarisida"],
        correctAnswerIndex: 0,
        explanation: "Gyrus cinguli limbik tizimning markaziy halqasi bo'lib, qadoqsimon tanani kamardek o'rab turadi."
      },
      {
        question: "Gematomiyeliya nima?",
        options: ["Orqa miya to'qimasi ichiga qon quyilishi", "Bosh miya pardasiga qon quyilishi", "Yurak ichiga qon quyilishi", "O'pka qonashi"],
        correctAnswerIndex: 0,
        explanation: "Orqa miya jarohatlarida kulrang modda ichiga qon quyilishi gematomiyeliya deb ataladi."
      },
      {
        question: "Gidrosefaliyaning 'Normotenziv' (Hakim-Adams triadasiga ega) turida qanday belgilar bo'ladi?",
        options: ["Demensiya (aql zaiflashuvi), Yurishning buzilishi (ataksiya) va Siydik tutolmaslik (inkontinensiya)", "Bosh og'rig'i va qayt qilish", "Ko'rlik va falajlik", "Quloq shang'illashi"],
        correctAnswerIndex: 0,
        explanation: "Keksalarda uchraydigan normotenziv gidrosefaliyada ushbu klassik triada kuzatiladi va shuntlash bilan davolanadi."
      },
      {
        question: "Gemisfera dominantligi (dominant yarim shar) nima?",
        options: ["Ko'pchilik o'naqaylarda chap yarim sharning nutq, yozuv, mantiq va hisoblash bo'yicha yetakchi (dominant) bo'lishi", "Ikkala yarim shar mutlaqo bir xil ishlashi", "Faqat o'ng yarim shar ishlashi", "Miyacha yetakchiligi"],
        correctAnswerIndex: 0,
        explanation: "O'naqaylarning 95% dan ortig'ida chap yarim shar nutqiy va tahliliy markazlar uchun dominant hisoblanadi."
      },
      {
        question: "Agnaziya nima?",
        options: ["Bosh miya po'stlog'i assotsiativ markazlari zararlanganda sezgi a'zolari butun bo'lsa ham buyumlarni taniyb ololmaslik (masalan, ko'rish agnaziyasi)", "Qo'l harakatining yo'qolishi", "So'zlay olmaslik", "Ko'z qorachig'ining kengayishi"],
        correctAnswerIndex: 0,
        explanation: "Agnaziya - hissiy idrokning buzilishi bo'lib, sezilgan ob'ektning ma'nosini anglash qobiliyatining yo'qolishidir."
      }
    ]
  },

  // ==========================================
  // TOPIC 4 (Order 104 / S3-4): O‘tkazuv yo‘llari. Oddiy refleks yoyi. Sezuvchi va harakatlantiruvchi yo‘llar
  // ==========================================
  {
    topicOrder: 104,
    topicKeywords: ["o'tkazuv yo'llari", "refleks yoyi", "tractus", "corticospinalis", "spinothalamicus", "goll", "burdax", "afferent", "efferent"],
    quizzes: [
      {
        question: "Oddiy somatik refleks yoyi (Arcus reflexus) qanday 3 ta asosiy neyron zanjiridan iborat?",
        options: ["1) Sezuvchi (afferent) neyron, 2) Oraliq (assotsiativ / qo'shimcha) neyron, 3) Harakatlantiruvchi (efferent) neyron", "Faqat 1 ta harakat neyroni", "Miya po'stlog'i va talamus", "Faqat simpatik tugunlar"],
        correctAnswerIndex: 0,
        explanation: "Klassik 3 neyronli refleks yoyida retseptor -> orqa ildiz gangliysi -> orqa shox oraliq neyroni -> oldingi shox motoneyroni -> ishchi mushak yo'li hosil bo'ladi."
      },
      {
        question: "Mono-sinaptik (eng sodda) pay refleksi (masalan, tizza refleksi) nechta neyron va sinapsdan iborat?",
        options: ["2 ta neyron (afferent va efferent) va 1 ta markaziy sinapsdan", "3 ta neyron va 2 ta sinapsdan", "4 ta neyron", "10 ta neyron"],
        correctAnswerIndex: 0,
        explanation: "Tizza refleksida sezuvchi neyron to'g'ridan-to'g'ri orqa miya oldingi shox motoneyroni bilan bitta sinaps hosil qiladi."
      },
      {
        question: "Lateral kortikospinal yo'l (Tractus corticospinalis lateralis / Lateral piramida yo'li) ning 1-neyroni qayerda joylashgan?",
        options: ["Gyrus precentralis (oldingi markaziy pushta) ning V qavatidagi Bets ulkan piramidal neyronlarida", "Thalamusda", "Orqa miya orqa shoxida", "Miyacha po'stlog'ida"],
        correctAnswerIndex: 0,
        explanation: "Piramida yo'lining boshlanish neyronlari motor po'stloqning 4-maydonidagi piramidal hujayralarda yotadi."
      },
      {
        question: "Lateral kortikospinal yo'lning 2-neyroni (periferik motoneyron) qayerda joylashgan?",
        options: ["Orqa miya kulrang moddasining oldingi shoxlarida (Cornu anterius motoneyronlarida)", "Thalamusda", "Bosh miya po'stlog'ida", "Orqa shoxlarda"],
        correctAnswerIndex: 0,
        explanation: "Piramida yo'li orqa miya oldingi shox motoneyronlariga (alfa-motoneyron) tugaydi, ularning aksonlari esa mushakka boradi."
      },
      {
        question: "Markaziy falajlik (Spastik parez) bilan Periferik falajlik (Pustoy / Vyaliy parez) ning asosiy farqi nimada?",
        options: ["Markaziy falajda: mushak tonusi oshgan (spastik), reflekslar baland (giperrefleksiya), patologik reflekslar (Babinskiy) bor; Periferik falajda: atoniya, arefleksiya, mushaklar atrofiyasi", "Hech qanday farqi yo'q", "Markaziyda mushaklar qurib qoladi", "Periferikda tonus oshadi"],
        correctAnswerIndex: 0,
        explanation: "Markaziy motoneyron uzilganda tormozlovchi ta'sir yo'qolib gipertonus va patologik reflekslar paydo bo'ladi; periferik motoneyron uzilganda esa atrofiyali so'lg'in falaj yuz beradi."
      },
      {
        question: "Babinskiy patologik refleksi (oyoq tagi tirnalganda bosh barmoqning orqaga yozilishi) nimaning shikastlanishini bildiradi?",
        options: ["Piramida (kortikospinal) o'tkazuv yo'lining shikastlanishini", "Sezuvchi yo'l buzilishini", "Miyacha yetishmovchiligini", "Ko'rish nervi kasalligini"],
        correctAnswerIndex: 0,
        explanation: "Babinskiy belgisi kattalarda faqat piramida yo'li (markaziy motoneyron) zararlanganda musbat bo'ladi (chaqaloqlarda esa fiziologik)."
      },
      {
        question: "Spinotalamik yo'l (Tractus spinothalamicus lateralis) qanday sezgilarni o'tkazadi?",
        options: ["Og'riq va harorat (issiqlik, sovuqlik) sezgilarini", "Ongli propriosepsiya (mushak-bo'g'im sezgisi)", "Ko'rish sezgisi", "Eshitish sezgisi"],
        correctAnswerIndex: 0,
        explanation: "Tractus spinothalamicus lateralis tananing qarama-qarshi tomonidan og'riq va haroratni po'stloqqa (Gyrus postcentralis) eltadi."
      },
      {
        question: "Spinotalamik yo'l tolalari orqa miyada qayerda kesishadi (qarama-qarshi tomonga o'tadi)?",
        options: ["Kirgan segmentining o'zida yoki 1-2 segment yuqorida (Commissura alba anterior orqali)", "Uzunchoq miyada", "O'rta miyada", "Kesishmaydi"],
        correctAnswerIndex: 0,
        explanation: "Spinotalamik yo'l 2-neyron aksonlari orqa miyaning o'zidayoq oq biriktiruvchi orqali qarama-qarshi yon ustunga o'tadi."
      },
      {
        question: "Goll va Burdax yo'llari (Fasciculus gracilis et cuneatus) qanday sezgilarni o'tkazadi?",
        options: ["Nozik taktil, epikritik sezgi, vibratsiya va ongli chuqur proprioseptiv (mushak-bo'g'im) sezgilarni", "Og'riq va issiqlik", "Ko'rish va hid", "Ta'm va eshitish"],
        correctAnswerIndex: 0,
        explanation: "Orqa ustunlar (Goll va Burdax) tananing bo'g'im holati, tebranish va nozik teginish sezgilarini orqa miya orqali uzunchoq miyaga olib chiqadi."
      },
      {
        question: "Goll va Burdax tutamlari tolalari qayerda kesishadi?",
        options: ["Uzunchoq miyada (Decussatio lemnisci medialis - Medial halqa kesishmasi)", "Orqa miyada", "Ichki kapsulada", "Thalamusda"],
        correctAnswerIndex: 0,
        explanation: "Goll va Burdax tolalari orqa miyada kesishmaydi; ular uzunchoq miyadagi o'zaklaridan chiqqach Medial halqa (Lemniscus medialis) bo'lib kesishadi."
      },
      {
        question: "Fleshsig va Govers yo'llari (Tractus spinocerebellaris posterior et anterior) qayerga boradi va nimani o'tkazadi?",
        options: ["Miyachaga boradi va ongsiz (reflektor) proprioseptiv muvozanat sezgilarini o'tkazadi", "Po'stloqqa boradi", "Ko'zga boradi", "Oshqozonga boradi"],
        correctAnswerIndex: 0,
        explanation: "Ushbu yo'llar mushak va paylardan keluvchi signallarni miyachaga yetkazib, avtomatik muvozanat va harakat nazoratini ta'minlaydi."
      },
      {
        question: "Medial halqa (Lemniscus medialis) tarkibiga qaysi yo'llar kiradi?",
        options: ["Goll va Burdax o'zaklarining aksonlari (Tractus bulbothalamicus - chuqur sezgi yo'llari)", "Piramida yo'llari", "Ko'rish yo'li", "Eshitish yo'li"],
        correctAnswerIndex: 0,
        explanation: "Lemniscus medialis chuqur va taktil sezgilarni uzunchoq miyadan talamusga eltuvchi asosiy sensor poyadir."
      },
      {
        question: "Lateral halqa (Lemniscus lateralis) qanday o'tkazuv yo'lining bir qismi hisoblanadi?",
        options: ["Eshitish o'tkazuv yo'lining (Tractus acusticus)", "Ko'rish yo'lining", "Og'riq yo'lining", "Harakat yo'lining"],
        correctAnswerIndex: 0,
        explanation: "Lemniscus lateralis eshitish o'zaklaridan chiqib to'rt tepalik pastki do'mboqchalariga va medial tirsaksimon tanaga boradi."
      },
      {
        question: "Broun-Sekar sindromi (Brown-Séquard syndrome) orqa miyaning yarmi (ko'ndalang yarmi) shikastlanganda qanday belgilar beradi?",
        options: ["Zararlangan tomonda: harakat falaji va chuqur sezgi (vibratsiya/propriosepsiya) yo'qolishi; Qarama-qarshi tomonda: og'riq va harorat sezgisining yo'qolishi", "Ikkala tomonda to'liq falaj", "Faqat ko'rlik", "Hech qanday o'zgarish bo'lmaydi"],
        correctAnswerIndex: 0,
        explanation: "Piramida va Goll/Burdax tolalari kesishmagan bo'lgani uchun o'z tomonida falaj va chuqur sezgi yo'qoladi, kesishgan Spinotalamik yo'l esa qarama-qarshi tomonda og'riqni yo'qotadi."
      },
      {
        question: "Tractus rubrospinalis (Monakov yo'li) qayerdan boshlanadi va qayerga boradi?",
        options: ["O'rta miyaning Qizil o'zagidan (Nucleus ruber) boshlanib, Forel kesishmasidan so'ng orqa miya oldingi shoxlariga boradi", "Bosh miya po'stlog'idan", "Thalamusdan", "Miyachadan"],
        correctAnswerIndex: 0,
        explanation: "Monakov yo'li bukuvchi mushaklar tonusini oshiruvchi muhim ekstrapiramidal motor yo'ldir."
      },
      {
        question: "Tractus vestibulospinalis qayerdan boshlanadi va nimani ta'minlaydi?",
        options: ["Ko'prikdagi Deyters (lateral vestibulyar) o'zagidan boshlanib, yozuvchi (antigravitatsion) mushaklar tonusini saqlaydi", "Qizil o'zakdan", "Miyachadan", "Ko'rish do'mbog'idan"],
        correctAnswerIndex: 0,
        explanation: "Vestibulospinal yo'l tana tik turganda og'irlik kuchiga qarshi yozuvchi mushaklar faolligini oshiradi."
      },
      {
        question: "Tractus tectospinalis (Qopqoq-orqa miya yo'li) qanday vazifani bajaradi?",
        options: ["Kutilmagan vizual yoki akustik ta'sirotlarga javoban bosh va tanani himoyaviy burish (startle-refleks)", "Faqat og'riqni o'tkazadi", "Ixtiyoriy yozuvni ta'minlaydi", "Mushaklarni bo'shashtiradi"],
        correctAnswerIndex: 0,
        explanation: "To'rt tepalikdan boshlanuvchi bu yo'l to'satdan chiqqan yorug'lik yoki tovushga javoban ko'z va bo'yinni burishni boshqaradi."
      },
      {
        question: "Siringomiyeliya kasalligida 'Dissotsiatsiyalangan sezgi buzilishi' (kurtka ko'rinishida) nimadan kelib chiqadi?",
        options: ["Orqa miya markaziy kanali kengayib (kista hosil bo'lib), oldingi oq birikmadagi kesishuvchi Spinotalamik tolalarni ezib qo'yishi natijasida og'riq/harorat yo'qolib, taktil sezgi saqlanib qoladi", "Piramida yo'li yorilishidan", "Bosh suyagi sinishidan", "Nerv uzilishidan"],
        correctAnswerIndex: 0,
        explanation: "Markaziy kanal kengayganda kesishuvchi harorat/og'riq tolalari uziladi, orqa ustundagi chuqur sezgilar esa butun qoladi."
      },
      {
        question: "Sensor ataksiya nima va Romberg sinamasida qanday ko'rinadi?",
        options: ["Goll va Burdax yo'llari shikastlanishi sababli bo'g'im-mushak sezgisi yo'qolib, ko'zni yumganda bemor chayqalib yiqilishi (musbat Romberg)", "Ko'zni ochganda ham yiqilish", "Qo'lning qotib qolishi", "Boshning og'rishi"],
        correctAnswerIndex: 0,
        explanation: "Sensor ataksiyada bemor ko'zlari bilan nazorat qila oladi, lekin ko'zini yumishi bilan chuqur sezgi yo'qligi sababli muvozanatni yo'qotadi."
      },
      {
        question: "Tractus corticonuclearis qaysi mushaklarni innervatsiya qiladi?",
        options: ["Bosh miya nervlari harakatlantiruvchi o'zaklari orqali yuz, ko'z, til, tanglay, halqum, hiqildoq va chaynov mushaklarini", "Oyoq mushaklarini", "Qorin to'g'ri mushagini", "Orqa mushaklarini"],
        correctAnswerIndex: 0,
        explanation: "Bu yo'l po'stloqdan bosh miya nervlarining III, IV, V, VI, VII, IX, X, XI, XII motor o'zaklariga boradi."
      },
      {
        question: "VII juft (yuz nervi) ning yuqori va pastki mimika mushaklari po'stloqdan qanday innervatsiya oladi?",
        options: ["Yuqori yuz (peshona, ko'z atrofi) - ikkala yarim shardan (ikki tomonlama); Pastki yuz (og'iz burchagi) - faqat qarama-qarshi yarim shardan", "Faqat bir tomondan", "Faqat o'z tomonidan", "Po'stloqdan innervatsiya olmaydi"],
        correctAnswerIndex: 0,
        explanation: "Markaziy insultda peshona mushaklari harakati saqlanib qoladi (chunki ikki tomonlama innervatsiya oladi), faqat og'iz burchagi pastga tushadi."
      },
      {
        question: "Orqa miyaning oldingi shoxlari poliomiyelit virusi bilan zararlanganda qanday klinik ko'rinish bo'ladi?",
        options: ["Periferik so'lg'in falaj, arefleksiya, atoniya va mushaklarning chuqur atrofiyasi (sezgilar butun saqlanadi)", "Spastik falaj", "Faqat sezgi yo'qoladi", "Ko'z xiralashadi"],
        correctAnswerIndex: 0,
        explanation: "Poliomiyelit faqat oldingi shoxdagi alfa-motoneyronlarni tanlab zararlaydi, shuning uchun sof motor periferik falaj yuzaga keladi."
      },
      {
        question: "Ko'tariluvchi (afferent) sezuvchi yo'llarning umumiy tuzilish qoidasiga ko'ra, neyronlar soni nechta bo'ladi?",
        options: ["Odatda 3 ta neyron (1-gangliyada, 2-orqa miya/uzunchoq miyada, 3-talamusda)", "Faqat 1 ta", "5 ta", "10 ta"],
        correctAnswerIndex: 0,
        explanation: "Sensor yo'llar 3 neyronli bo'lib, 1-neyron spinal gangliyada, 2-neyron CNS o'zagida, 3-neyron talamusda joylashadi."
      },
      {
        question: "Tushuvchi (efferent) ixtiyoriy piramidal harakat yo'li nechta neyronli zanjirdan iborat?",
        options: ["2 ta neyronli: 1-markaziy motoneyron (Bets hujayrasi) va 2-periferik motoneyron (orqa miya oldingi shoxi)", "4 ta neyron", "1 ta neyron", "6 ta neyron"],
        correctAnswerIndex: 0,
        explanation: "Kortikospinal trakt markaziy motoneyron (po'stloq) va periferik motoneyron (orqa miya) dan iborat."
      },
      {
        question: "Piramida yo'li tolalari qaysi sohadan o'tayotganda eng zich to'plangan bo'ladi?",
        options: ["Ichki kapsulaning orqa oyog'ida (Crus posterius capsulae internae)", "Orqa miya uchida", "Gipotalamusda", "Miyachada"],
        correctAnswerIndex: 0,
        explanation: "Ichki kapsulada barcha motor tolalar kichik bir maydonga jamlangani sababli hatto kichik insult ham butun tanani falaj qiladi."
      },
      {
        question: "Protopatik sezgi bilan Epikritik sezgining farqi nima?",
        options: ["Protopatik - qadimgi, qo'pol, noaniq lokalizatsiyali og'riq/harorat; Epikritik - aniq lokalizatsiyali nozik teginish, ikki nuqtani ajratish va vibratsiya", "Farqi yo'q", "Protopatik faqat ko'rishga xos", "Epikritik faqat hid bilishga xos"],
        correctAnswerIndex: 0,
        explanation: "Protopatik sezgi spinotalamik yo'l orqali, epikritik yuqori differensiyalangan sezgi esa Goll va Burdax orqali o'tadi."
      },
      {
        question: "Goll tutami (Fasciculus gracilis) tananing qaysi qismlaridan chuqur sezgi keltiradi?",
        options: ["Pastki oyoqlar va gavdaning pastki qismidan (Th5 dan pastki segmentlardan)", "Qo'llardan", "Boshdan", "Bo'yindan"],
        correctAnswerIndex: 0,
        explanation: "Goll tutami medialda yotib pastki tana va oyoqlarning proprioseptiv axborotini olib chiqadi."
      },
      {
        question: "Burdax tutami (Fasciculus cuneatus) tananing qaysi sohasidan sezgi keltiradi?",
        options: ["Qo'llar, yelka kamari va yuqori ko'krak qafasidan (Th4 dan yuqori segmentlardan)", "Oyoqlardan", "Chanoqdan", "Oyoq panjasidan"],
        correctAnswerIndex: 0,
        explanation: "Burdax tutami lateralda joylashib yuqori tana va qo'llardan chuqur sezgi tashiydi."
      },
      {
        question: "Tabes dorsalis (orqa miya qurig'i / kechki zaxm) da qaysi tuzilmalar nobud bo'ladi?",
        options: ["Orqa miya orqa ustunlari (Goll va Burdax tolalari) va orqa ildizlar (sensor ataksiya va o'qdek og'riqlar)", "Oldingi shoxlar", "Miya po'stlog'i", "Bazal o'zaklar"],
        correctAnswerIndex: 0,
        explanation: "Zaxm (neyrosifilis) orqa ustunlarni yemirib, bo'g'im sezgisini yo'qotadi va trofik yaralarga olib keladi."
      },
      {
        question: "Gemianesteziya nima?",
        options: ["Tananing bir tomonida (o'ng yoki chap yarmida) barcha turdagi sezgilarning to'liq yo'qolishi", "Barcha 4 oyoq-qo'l sezgisining yo'qolishi", "Faqat barmoq uvishishi", "Bosh aylanishi"],
        correctAnswerIndex: 0,
        explanation: "Thalamus yoki ichki kapsula orqa oyog'i zararlanganda qarama-qarshi butun tana yarmida sezgi yo'qoladi (gemianesteziya)."
      }
    ]
  },

  // ==========================================
  // TOPIC 5 (Order 105 / S3-5): Orqa miya nervlari. Tarmoqlari. Qovurg‘alararo nervlar. Bo‘yin chigali
  // ==========================================
  {
    topicOrder: 105,
    topicKeywords: ["orqa miya nervlari", "bo'yin chigali", "plexus cervicalis", "nervus phrenicus", "nervi intercostales", "ramus anterior", "ramus posterior"],
    quizzes: [
      {
        question: "Orqa miya nervi (Nervus spinalis) qanday hosil bo'ladi va qanday xarakterga ega?",
        options: ["Oldingi (harakat) va orqa (sezuvchi) ildizlarning umurtqalararo teshikda qo'shilishidan hosil bo'ladi va aralash (harakat+sezgi+vegetativ) xarakterga ega", "Faqat harakatlantiruvchi", "Faqat sezuvchi", "Faqat miyadan chiqadi"],
        correctAnswerIndex: 0,
        explanation: "31 juft spinal nervlarning barchasi old va orqa ildizlar qo'shilishidan hosil bo'lgan aralash nervlardir."
      },
      {
        question: "Orqa miya nervi umurtqalararo teshikdan chiqqach qanday 4 ta asosiy shoxga bo'linadi?",
        options: ["1) Ramus anterior (oldingi), 2) Ramus posterior (orqa), 3) Ramus meningeus (parda shoxi), 4) Rami communicantes (biriktiruvchi vegetativ shoxlar)", "Faqat o'ng va chap shox", "Katta va kichik shox", "Yuzaki va chuqur shox"],
        correctAnswerIndex: 0,
        explanation: "Spinal nerv 4 ta shox beradi: oldingi (gavda oldi va a'zolarga), orqa (orqa mushaklar va teriga), meningeal (umurtqa kanaliga) va oq/kulrang biriktiruvchi."
      },
      {
        question: "Bo'yin chigali (Plexus cervicalis) qaysi orqa miya nervlarining oldingi shoxlaridan hosil bo'ladi?",
        options: ["C1 - C4 (yuqori 4 ta bo'yin nervlarining oldingi shoxlaridan)", "C5 - Th1", "Th1 - Th12", "L1 - L4"],
        correctAnswerIndex: 0,
        explanation: "Plexus cervicalis C1-C4 nervlarining oldingi shoxlaridan hosil bo'lib, chuqur bo'yin mushaklari ustida yotadi."
      },
      {
        question: "Bo'yin chigalining teri (sezuvchi) shoxlari qaysi sohadan teri ostiga chiqadi?",
        options: ["To'sh-o'mrov-so'rg'ichsimon mushakning (m. sternocleidomastoideus) orqa chetining o'rtasidan (Erb nuqtasi)", "Jag' ostidan", "Ensa suyagi ustidan", "O'mrov ostidan"],
        correctAnswerIndex: 0,
        explanation: "Erb nuqtasidan bo'yin chigalining barcha 4 ta sezuvchi nervlari tarqaladi (anesteziya shu nuqtaga qilinadi)."
      },
      {
        question: "Bo'yin chigalining sezuvchi (teri) shoxlariga qaysilar kiradi?",
        options: ["Nervus occipitalis minor, Nervus auricularis magnus, Nervus transversus colli, Nervi supraclaviculares", "Nervus phrenicus", "Nervus vagus", "Nervus accessorius"],
        correctAnswerIndex: 0,
        explanation: "Ushbu 4 ta nerv ensa terisi, quloq suprasi, bo'yin old terisi va o'mrov usti sohalarini sezuvchi tola bilan ta'minlaydi."
      },
      {
        question: "Bo'yin chigalining eng yirik aralash nervi qaysi?",
        options: ["Nervus phrenicus (Diafragma nervi - C3, C4, C5 ildizlaridan)", "Nervus vagus", "Nervus accessorius", "Nervus hypoglossus"],
        correctAnswerIndex: 0,
        explanation: "Nervus phrenicus bo'yindan ko'krak qafasiga tushib diafragmani harakatlantiradi va plevra/perikardga sezuvchi shoxlar beradi."
      },
      {
        question: "Nervus phrenicus (Diafragma nervi) ikki tomonlama falajlanganda nima sodir bo'ladi?",
        options: ["Diafragma harakatsizlanib, paradoksal nafas va og'ir o'tkir nafas yetishmovchiligi yuzaga keladi", "Ovoz yo'qoladi", "Yutish buziladi", "Yelka qotib qoladi"],
        correctAnswerIndex: 0,
        explanation: "Diafragma asosiy nafas mushagi bo'lgani sababli n. phrenicus uzilishi o'pka ventilyatsiyasini keskin izdan chiqaradi."
      },
      {
        question: "Bo'yin qovuzlog'i (Ansa cervicalis) qanday mushaklarni innervatsiya qiladi?",
        options: ["Til osti suyagidan pastda joylashgan bo'yin mushaklarini (m. sternohyoideus, m. sternothyroideus, m. omohyoideus, m. thyrohyoideus)", "Chaynov mushaklarini", "Mimika mushaklarini", "Diafragmani"],
        correctAnswerIndex: 0,
        explanation: "Ansa cervicalis C1-C3 tolalari va n. hypoglossus ishtirokida hosil bo'lib, tilosti osti mushaklarini harakatlantiradi."
      },
      {
        question: "Qovurg'alararo nervlar (Nervi intercostales) qaysi nervlarning oldingi shoxlari hisoblanadi?",
        options: ["Ko'krak orqa miya nervlarining oldingi shoxlari (Th1 - Th11 qovurg'alararo va Th12 qovurg'a osti nervi)", "Bo'yin nervlari", "Bel nervlari", "Dumg'aza nervlari"],
        correctAnswerIndex: 0,
        explanation: "Ko'krak nervlarining oldingi shoxlari chigal hosil qilmaydi, ular to'g'ridan-to'g'ri qovurg'alararo egatlarda yo'naladi."
      },
      {
        question: "Qovurg'alararo nervlar va tomirlar qovurg'aning qaysi qismida joylashgan?",
        options: ["Qovurg'aning pastki chetidagi egatda (Sulcus costae) yuqoridan pastga: Vena, Arteriya, Nerv (VAN) tartibida", "Qovurg'a ustki chetida", "Qovurg'a o'rtasida", "To'sh suyagida"],
        correctAnswerIndex: 0,
        explanation: "Qovurg'a egatida tomir-nerv tutami 'VAN' (Vena - Arteria - Nervus) ketma-ketligida yotadi; plevral punksiya qovurg'aning ustki chetidan qilinadi."
      },
      {
        question: "Nima sababdan plevra bo'shlig'i punksiyasi (torakosentez) qovurg'aning yuqori cheti bo'ylab qilinadi?",
        options: ["Qovurg'aning pastki chetidagi tomir-nerv tutamini (VAN) jarohatlab qon ketishi yoki kuchli og'riq chaqirmaslik uchun", "Yuqori cheti yumshoq bo'lgani uchun", "Ignani chuqurroq tiqish uchun", "Shunchaki qulayligi uchun"],
        correctAnswerIndex: 0,
        explanation: "Pastki chetdagi a. intercostalis va n. intercostalis'ni shikastlamaslik uchun igna qovurg'aning ustki qirrasidan kiritiladi."
      },
      {
        question: "Qovurg'alararo nervlar qanday tuzilmalarni innervatsiya qiladi?",
        options: ["Qovurg'alararo tashqi va ichki mushaklarni, ko'krak va qorin devori mushaklarini, parietal plevra va parietal qorin pardasini hamda ko'krak terisini", "Faqat yurakni", "Faqat o'pkani", "Faqat orqa miyani"],
        correctAnswerIndex: 0,
        explanation: "N. intercostales ko'krak va qorin old-yon devorining barcha mushaklari va terisini innervatsiya qiladi."
      },
      {
        question: "Qorin old devorining kindik sohasi terisi qaysi orqa miya segmenti (dermatomi) ga to'g'ri keladi?",
        options: ["X ko'krak segmentiga (Th10 dermatomi)", "IV ko'krak segmentiga (Th4)", "I bel segmentiga (L1)", "VII bo'yin segmentiga (C7)"],
        correctAnswerIndex: 0,
        explanation: "Th10 ko'krak nervi kindik sohasini, Th4 esa so'rg'ich (areola) sohasini sezgi bilan ta'minlaydi."
      },
      {
        question: "O'rab oluvchi temiratki (Herpes Zoster / Qiziltemak) nima uchun qovurg'alararo oraliqlar bo'ylab toshmalar toshiradi?",
        options: ["Virus orqa miya spinal gangliylarida (Ganglion spinale) yashirin saqlanib, nerv tolalari (dermatomi) bo'ylab teriga chiqadi", "Qon tomirlar yorilishi sababli", "Mushak yallig'lanishi sababli", "Allergik reaksiya sababli"],
        correctAnswerIndex: 0,
        explanation: "Varicella zoster virusi spinal gangliyada saqlanib, bir tomonlama qovurg'alararo nerv yo'nalishi bo'ylab og'riqli pufakchalar toshiradi."
      },
      {
        question: "Katta ensa nervi (Nervus occipitalis major) qaysi nervning tarmog'i hisoblanadi?",
        options: ["II bo'yin nervining (C2) orqa shoxining (Ramus posterior) medial tarmog'i", "Bo'yin chigalining oldingi shoxi", "Yuz nervi", "Uch shoxli nerv"],
        correctAnswerIndex: 0,
        explanation: "Nervus occipitalis major C2 orqa shoxidan chiqib ensa sohasining orqa terisini sezgi bilan ta'minlaydi (Arnold nevralgiyasi)."
      },
      {
        question: "Kichik ensa nervi (Nervus occipitalis minor) qayerdan chiqadi?",
        options: ["Bo'yin chigalidan (Plexus cervicalis - C2, C3 oldingi shoxlaridan)", "Orqa shoxdan", "Miya poyasidan", "Kalla suyagidan"],
        correctAnswerIndex: 0,
        explanation: "N. occipitalis minor bo'yin chigalining sezuvchi shoxi bo'lib quloq orqasidagi ensa terisini innervatsiya qiladi."
      },
      {
        question: "Ko'ndalang bo'yin nervi (Nervus transversus colli) qaysi soha terisini innervatsiya qiladi?",
        options: ["Bo'yinning oldingi va lateral yuzasi terisini (Platysma ostidan o'tib)", "Yuz terisini", "Ensa terisini", "Ko'krak terisini"],
        correctAnswerIndex: 0,
        explanation: "N. transversus colli Erb nuqtasidan chiqib m. sternocleidomastoideus ustidan ko'ndalang o'tib bo'yin oldini ta'minlaydi."
      },
      {
        question: "O'mrov usti nervlari (Nervi supraclaviculares) qaysi sohalarga tarqaladi?",
        options: ["O'mrov suyagi usti, ko'krak qafasining yuqori qismi va yelka usti (deltoid) sohasi terisiga (C3-C4)", "Qorin sohasiga", "Boshga", "Bilakka"],
        correctAnswerIndex: 0,
        explanation: "Nn. supraclaviculares medial, oraliq va lateral tarmoqlarga bo'linib o'mrov va yelka usti terisini ta'minlaydi."
      },
      {
        question: "Frenikus-simptom (Myussi belgisi) nimani anglatadi?",
        options: ["M. sternocleidomastoideus oyoqchalari orasida n. phrenicus usti bosilganda og'riq paydo bo'lishi (o't pufagi, jigar yoki diafragma yallig'lanishida)", "Miyacha zararlanishini", "Ko'richak yallig'lanishini", "Buyrak toshini"],
        correctAnswerIndex: 0,
        explanation: "Diafragma nervining sezuvchi tolalari jigar va o't yo'llarini qoplagani sababli xoletsistitda bo'yinda og'riq beradi (Myussi belgisi)."
      },
      {
        question: "12-qovurg'a osti nervi nima deb ataladi?",
        options: ["Nervus subcostalis (Th12 orqa miya nervining oldingi shoxi)", "Nervus iliohypogastricus", "Nervus phrenicus", "Nervus vagus"],
        correctAnswerIndex: 0,
        explanation: "12-qovurg'a ostidan o'tuvchi Th12 nervi Nervus subcostalis deb atalib, qorin devoriga o'tadi."
      },
      {
        question: "Orqa miya nervlarining orqa shoxlari (Rami posteriores) nimani innervatsiya qiladi?",
        options: ["Orqaning chuqur (avtoxton) mushaklarini va umurtqa pog'onasi bo'ylab orqa teri sohasini", "Qo'l va oyoq mushaklarini", "Ichki a'zolarni", "Ko'krak qafasi old devorini"],
        correctAnswerIndex: 0,
        explanation: "Orqa shoxlar umurtqa orqasidagi chuqur yozuvchi mushaklarni (m. erector spinae) va orqa terisini segmentar ta'minlaydi."
      },
      {
        question: "Orqa miya nervlarining parda shoxi (Ramus meningeus / Lyushka nervi) nimani innervatsiya qiladi?",
        options: ["Umurtqa kanali suyakusti pardasini, umurtqalararo disklarning tashqi qismini va Dura mater spinalis'ni", "Orqa miya kulrang moddasini", "Yurak perikardini", "Miya po'stlog'ini"],
        correctAnswerIndex: 0,
        explanation: "Ramus meningeus umurtqalararo teshikdan kanal ichiga qaytib kirib orqa miya qattiq pardasi va suyakustini sezgi bilan ta'minlaydi."
      },
      {
        question: "Oq biriktiruvchi shoxlar (Rami communicantes albi) qaysi segmentlardan chiqadi va nima tashiydi?",
        options: ["Th1 dan L2 gacha bo'lgan segmentlardan chiqadi va simpatik preganglionar mielinli tolalarni tashiydi", "Barcha 31 segmentdan", "Faqat bo'yindan", "Faqat dumg'azadan"],
        correctAnswerIndex: 0,
        explanation: "Oq biriktiruvchi shoxlar faqat yon shoxlar mavjud bo'lgan Th1-L2 segmentlarida bo'lib, simpatik tugunga boradi."
      },
      {
        question: "Kulrang biriktiruvchi shoxlar (Rami communicantes grisei) nimadan iborat?",
        options: ["Simpatik poyadan barcha 31 juft spinal nervlarga qaytuvchi postganglionar bezmielin tolalardan (qon tomirlar, ter bezlari va tuk mushaklariga)", "Sezuvchi tolalardan", "Harakatlantiruvchi piramida tolalaridan", "Likvor yo'llaridan"],
        correctAnswerIndex: 0,
        explanation: "Kulrang shoxlar barcha orqa miya nervlariga qo'shilib, butun tana bo'ylab vazomotor va pilomotor innervatsiyani ta'minlaydi."
      },
      {
        question: "Dermatoma nima?",
        options: ["Bitta orqa miya segmenti (va uning orqa ildizi) tomonidan innervatsiya qilinadigan teri sohasi", "Bitta mushak guruhi", "Bitta suyak sohasi", "Qon tomir maydoni"],
        correctAnswerIndex: 0,
        explanation: "Har bir orqa miya jufti tanada ma'lum bir teri mintaqasini (dermatom) ta'minlaydi; bu klinikada shikastlanish sathini aniqlashda muhim."
      },
      {
        question: "Miotoma nima?",
        options: ["Bitta orqa miya segmenti (oldingi ildizi) tomonidan innervatsiya qilinadigan mushaklar guruhi", "Teri sohasi", "Parda sohasi", "Suyak qismi"],
        correctAnswerIndex: 0,
        explanation: "Miotom - bu bitta orqa miya segmentidan motor buyruq oluvchi barcha mushak tolalari yig'indisidir."
      },
      {
        question: "Bo'yin qovuzlog'ining yuqori ildizi (Radix superior ansae cervicalis) qaysi nerv bilan birga yo'naladi?",
        options: ["XII juft - Nervus hypoglossus (Tilosti nervi) bilan", "X juft - Nervus vagus", "XI juft nerv", "Nervus phrenicus"],
        correctAnswerIndex: 0,
        explanation: "C1 tolalari tilosti nerviga qo'shilib biroz yo'l bosadi, so'ng Radix superior bo'lib ajraladi va Radix inferior (C2-C3) bilan qo'shiladi."
      },
      {
        question: "Diafragma nervining (N. phrenicus) perikardial va plevral shoxlari qanday axborot tashiydi?",
        options: ["Perikard, mediastinal plevra va diafragmal plevradan sezuvchi (og'riq) signallarini", "Faqat harakat buyrug'ini", "Gormonlar chiqishini", "Qon oqishini"],
        correctAnswerIndex: 0,
        explanation: "Perikardit va plevritdagi og'riqlar diafragma nervining sezuvchi tolalari orqali bo'yin va yelka sohasiga tarqaladi."
      },
      {
        question: "Qovurg'alararo nervlar zararlanganda (Torakalgiyada) og'riq xarakteri qanday bo'ladi?",
        options: ["Qovurg'alar bo'ylab o'rab oluvchi, chuqur nafas olganda va yo'talganda kuchayuvchi o'tkir og'riq", "Bosh og'rig'i", "Oyoqda uvishish", "Xira ko'rish"],
        correctAnswerIndex: 0,
        explanation: "Qovurg'alararo nevralgiya qovurg'a egati bo'ylab ko'krak qafasini o'rab oluvchi o'tkir sanchiq og'riq beradi."
      },
      {
        question: "C1 (birinchi bo'yin orqa miya nervi) ning anatomik o'ziga xosligi nimada?",
        options: ["Nervus suboccipitalis deb ataladi, orqa sezuvchi ildizi bo'lmaydi (yoki juda kichik) va asosan motor xarakterga ega", "Eng uzun nerv hisoblanadi", "Faqat teriga boradi", "Oyoqqa boradi"],
        correctAnswerIndex: 0,
        explanation: "C1 nervining sezuvchi orqa ildizi ko'pincha bo'lmaydi; u ensa osti chuqurchasidagi mayda mushaklarni harakatlantiradi."
      }
    ]
  },

  // ==========================================
  // TOPIC 6 (Order 106 / S3-6): Yelka chigalining uzun va kalta tarmoqlari
  // ==========================================
  {
    topicOrder: 106,
    topicKeywords: ["yelka chigali", "plexus brachialis", "nervus radialis", "nervus medianus", "nervus ulnaris", "nervus axillaris", "nervus musculocutaneus"],
    quizzes: [
      {
        question: "Yelka chigali (Plexus brachialis) qaysi nervlarning oldingi shoxlaridan hosil bo'ladi?",
        options: ["C5 - C8 va Th1 (V, VI, VII, VIII bo'yin va I ko'krak) orqa miya nervlarining oldingi shoxlaridan", "C1 - C4", "Th2 - Th6", "L1 - L4"],
        correctAnswerIndex: 0,
        explanation: "Plexus brachialis C5-Th1 oldingi shoxlaridan hosil bo'lib, butun yuqori erkin qo'l va yelka kamarini innervatsiya qiladi."
      },
      {
        question: "Yelka chigali poyalari (Truncus superior, medius, inferior) qaysi topografik bo'shliqdan o'tadi?",
        options: ["Spatium interscalenum (oldingi va o'rta narvonsimon mushaklar oralig'idan, a. subclavia ustidan)", "Spatium antescalenum", "Fossa axillaris", "Canalis caroticus"],
        correctAnswerIndex: 0,
        explanation: "Narvonsimon mushaklar orasidagi teshikdan yelka chigalining 3 ta birlamchi poyasi o'mrov osti arteriyasi bilan o'tadi."
      },
      {
        question: "Qo'ltiq osti sohasida yelka chigali a. axillaris'ga nisbatan qanday 3 ta tutamga (Fasciculi) bo'linadi?",
        options: ["Fasciculus lateralis (lateral), Fasciculus medialis (medial), Fasciculus posterior (orqa)", "Fasciculus anterior, medius, posterior", "Fasciculus superior, inferior", "2 ta tutamga"],
        correctAnswerIndex: 0,
        explanation: "Qo'ltiq osti arteriyasi atrofida lateral, medial va orqa tutamlar joylashib, ulardan uzun shoxlar chiqadi."
      },
      {
        question: "Yelka chigalining kalta shoxlariga qaysilar kiradi?",
        options: ["N. dorsalis scapulae, N. thoracicus longus, N. suprascapularis, Nn. pectorales, N. subscapularis, N. thoracodorsalis, N. axillaris", "N. medianus va ulnaris", "N. radialis va ischiadicus", "N. femoralis va obturatorius"],
        correctAnswerIndex: 0,
        explanation: "Kalta shoxlar yelka kamari, kurak va ko'krak qafasi devori mushaklarini innervatsiya qiladi."
      },
      {
        question: "Uzun ko'krak nervi (Nervus thoracicus longus / Bell nervi) qaysi mushakni innervatsiya qiladi?",
        options: ["Musculus serratus anterior (oldingi tishsimon mushakni)", "Musculus latissimus dorsi", "Musculus pectoralis major", "Musculus deltoideus"],
        correctAnswerIndex: 0,
        explanation: "N. thoracicus longus oldingi tishsimon mushakni ta'minlaydi; uning shikastlanishida 'Qanotsimon kurak' (Scapula alata) yuzaga keladi."
      },
      {
        question: "Qo'ltiq osti nervi (Nervus axillaris) qaysi teshikdan o'tadi va qaysi mushakni innervatsiya qiladi?",
        options: ["Foramen quadrilaterum (to'rtburchak teshik) dan o'tib, Musculus deltoideus va Musculus teres minor'ni ta'minlaydi", "Foramen trilaterum", "Canalis caroticus", "Spatium interscalenum"],
        correctAnswerIndex: 0,
        explanation: "N. axillaris yelka suyagi jarrohlik bo'ynini aylanib o'tadi; yelka suyagi singanda deltasimon mushak atrofiyaga uchraydi va qo'lni yonga ko'tarib bo'lmaydi."
      },
      {
        question: "Mushak-teri nervi (Nervus musculocutaneus) qaysi tutamdan chiqadi va qaysi mushaklarni innervatsiya qiladi?",
        options: ["Fasciculus lateralis'dan chiqib, yelkaning oldingi guruhi bukuvchi mushaklarini (m. biceps brachii, m. brachialis, m. coracobrachialis) ta'minlaydi", "Orqa guruh mushaklarini", "Faqat terini", "Kaft mushaklarini"],
        correctAnswerIndex: 0,
        explanation: "N. musculocutaneus m. coracobrachialis'ni teshib o'tib yelka bukurchilarini harakatlantiradi va bilak lateral terisiga (n. cutaneus antebrachii lateralis) o'tadi."
      },
      {
        question: "O'rta nerv (Nervus medianus) qanday hosil bo'ladi?",
        options: ["Lateral tutam (Radix lateralis) va Medial tutam (Radix medialis) shoxlarining a. axillaris oldida ayri shaklida qo'shilishidan", "Faqat orqa tutamdan", "Bo'yindan to'g'ridan-to'g'ri", "Tirsak nervidan"],
        correctAnswerIndex: 0,
        explanation: "N. medianus ikkita tutamning qo'shilishidan 'V' harfi shaklida hosil bo'ladi."
      },
      {
        question: "O'rta nerv (Nervus medianus) bilakning qaysi mushaklarini innervatsiya qiladi?",
        options: ["Bilak oldingi yuzasidagi deyarli barcha bukuvchi va pronator mushaklarni (m. flexor carpi ulnaris va m. flexor digitorum profundus'ning medial yarmidan tashqari)", "Faqat yozuvchi mushaklarni", "Yelka mushaklarini", "Orqa guruh mushaklarini"],
        correctAnswerIndex: 0,
        explanation: "N. medianus bilakning asosiy bukuvchi nervi bo'lib, barmoqlar va qo'l panjasining bukilishini ta'minlaydi."
      },
      {
        question: "Karpal kanal sindromi (Canalis carpi sindromi) da qaysi nerv qisiladi va qanday belgilar paydo bo'ladi?",
        options: ["Nervus medianus qisilib, I, II, III va IV barmoq yarmida uvishish, og'riq va Tenar (bosh barmoq tepaligi) mushaklarining atrofiyasi kuzatiladi", "Nervus radialis qisiladi", "Nervus ulnaris qisiladi", "Nervus axillaris qisiladi"],
        correctAnswerIndex: 0,
        explanation: "Karpal kanalda retinaculum flexorum ostida o'rta nerv ezilganda kaftning radial tomonida paresteziya va tenar atrofiyasi bo'ladi."
      },
      {
        question: "O'rta nerv (Nervus medianus) to'liq uzilganda qo'l qanday patologik ko'rinishga kiradi?",
        options: ["'Maymun panjasi' (Ape hand - bosh barmoq qarama-qarshi qo'yila olmaydi, tenar yassilanib boshqa barmoqlar tekisligiga tushadi)", "'Osiq panja'", "'Qush panjasi'", "'Qanotsimon kurak'"],
        correctAnswerIndex: 0,
        explanation: "M. opponens pollicis va tenar mushaklari falajlanganda bosh barmoq oppozitsiyasi yo'qolib qo'l maymun panjasiga aylanadi."
      },
      {
        question: "Tirsak nervi (Nervus ulnaris) qaysi tutamdan chiqadi va tirsakda qayerdan o'tadi?",
        options: ["Fasciculus medialis'dan chiqib, tirsakda Epicondylus medialis orqasidagi egatdan (Sulcus n. ulnaris) o'tadi", "Lateral do'nglikdan", "Tirsak chuqurchasi o'rtasidan", "Yelka suyagi ichidan"],
        correctAnswerIndex: 0,
        explanation: "N. ulnaris tirsakning ichki suyagi orqasidan teri ostida o'tadi; tirsak urilganda to'satdan elektr toki urgandek og'riq shu nerv tufaylidir."
      },
      {
        question: "Tirsak nervi (Nervus ulnaris) kaftda qanday sohalarni innervatsiya qiladi?",
        options: ["Gipotenar mushaklarini, barcha suyaklararo mushaklarni (Mm. interossei), 3-4 chuvalchangsimon mushaklarni, m. adductor pollicis'ni hamda V va IV barmoq yarmi terisini", "Butun kaftni", "Faqat bosh barmoqni", "Faqat kaft orqasini"],
        correctAnswerIndex: 0,
        explanation: "N. ulnaris barmoqlarni yoyuvchi va yaqinlashtiruvchi nozik kaft mushaklarini hamda medial 1.5 ta barmoqni ta'minlaydi."
      },
      {
        question: "Tirsak nervi (Nervus ulnaris) zararlanganda qo'l panjasi qanday ko'rinishga kiradi?",
        options: ["'Qush panjasi' / 'Timsoh panjasi' (Claw hand - suyaklararo mushaklar falajlanib, asosiy falangalar yozilgan, oxirgi falangalar bukilgan holat)", "'Maymun panjasi'", "'Osiq panja'", "'Yozuvchi qo'li'"],
        correctAnswerIndex: 0,
        explanation: "Suyaklararo va chuvalchangsimon mushaklar falajlanganda IV-V barmoqlar tirnoqsimon/qush panjasiga o'xshab qoladi."
      },
      {
        question: "Giyon kanali sindromi (Canalis ulnaris / Loge de Guyon) nima?",
        options: ["Tirsak nervining (N. ulnaris) no'xatsimon suyak yonidagi Giyon kanalida qisilib qolishi (velosipedchilar va chilangarlarda)", "O'rta nervning qisilishi", "Bilak suyagi sinishi", "Kaft suyagi chiqishi"],
        correctAnswerIndex: 0,
        explanation: "Giyon kanalida ulnar nerv ezilganda jimjiloq va nomsiz barmoqda uvishish va kaft ichki mushaklari zaifligi bo'ladi."
      },
      {
        question: "Bilak nervi (Nervus radialis) qaysi tutamdan chiqadi va qaysi anatomik kanaldan o'tadi?",
        options: ["Fasciculus posterior (orqa tutam) dan chiqib, Canalis humeromuscularis (yelka-mushak / spiral kanal) dan a. profunda brachii bilan o'tadi", "Karpal kanaldan", "Giyon kanalidan", "Kubital kanaldan"],
        correctAnswerIndex: 0,
        explanation: "N. radialis yelka suyagi orqasidagi spiral egatda a. profunda brachii bilan birga yotadi."
      },
      {
        question: "Bilak nervi (Nervus radialis) qaysi mushaklarni innervatsiya qiladi?",
        options: ["Yelkaning barcha orqa yozuvchi mushaklarini (m. triceps brachii, m. anconeus) va bilakning barcha orqa yozuvchi va supinator mushaklarini", "Faqat bukuvchilarni", "Faqat kaft mushaklarini", "Ko'krak mushaklarini"],
        correctAnswerIndex: 0,
        explanation: "N. radialis yuqori erkin qo'lning yagona bosh yozuvchi (ekstenzor) nervi hisoblanadi."
      },
      {
        question: "Bilak nervi (Nervus radialis) yelka suyagi o'rta uchligi singanda zararlansa qo'l qanday ko'rinishga kiradi?",
        options: ["'Osiq panja' (Wrist drop - panja va barmoqlarni orqaga yozib bo'lmaydi, panja shalvirab osilib qoladi)", "'Qush panjasi'", "'Maymun panjasi'", "'Qanotsimon kurak'"],
        correctAnswerIndex: 0,
        explanation: "Yozuvchi mushaklar (m. extensor digitorum, extensor carpi) falajlangani sababli qo'l panjasi pastga osilib qoladi (Wrist drop)."
      },
      {
        question: "'Shanba oqshomi falaji' (Saturday night palsy / Bog'chada uxlab qolish falaji) qaysi nervning bosilishidan kelib chiqadi?",
        options: ["Nervus radialis'ning yelka sohasida uzoq vaqt qattiq jismga (stul suyanchig'iga) bosilib qolishidan", "Nervus medianus", "Nervus ulnaris", "Nervus axillaris"],
        correctAnswerIndex: 0,
        explanation: "Mast holatda qo'lni stul suyanchig'iga osiltirib uxlab qolganda radial nerv ezilib vaqtinchalik 'osiq panja' falaji yuzaga keladi."
      },
      {
        question: "Yelka chigalining yuqori shol bo'lishi (Erba-Dyushen falaji - Erb-Duchenne palsy) qaysi ildizlar zararlanishidan kelib chiqadi?",
        options: ["C5 - C6 ildizlari zararlanishidan (tug'ruq jarohati yoki yelkaga yiqilishda; 'Ofitsiantning choypuli so'rashi' holati - Waiter's tip)", "C8 - Th1 ildizlari", "Faqat Th1", "C1 - C2"],
        correctAnswerIndex: 0,
        explanation: "C5-C6 uzilganda deltasimon va biseps mushaklari falajlanib, qo'l tanaga yopishgan, ichkariga burilgan va yozilgan holatda osilib turadi."
      },
      {
        question: "Yelka chigalining pastki shol bo'lishi (Klyumpke falaji - Klumpke palsy) qaysi ildizlar zararlanishidan kelib chiqadi?",
        options: ["C8 - Th1 ildizlari zararlanishidan (yuqoriga osilib qolganda yoki tug'ruqda qo'ldan tortganda; butun kaft mayda mushaklari falajlanadi)", "C5 - C6", "C3 - C4", "Th5 - Th6"],
        correctAnswerIndex: 0,
        explanation: "C8-Th1 uzilishi qo'l panjasining barcha mayda mushaklarini falajlab umumiy 'tirnoqsimon panja' va Gorner sindromiga olib kelishi mumkin."
      },
      {
        question: "Qo'lning medial teri nervlari (N. cutaneus brachii medialis va N. cutaneus antebrachii medialis) qaysi tutamdan chiqadi?",
        options: ["Fasciculus medialis (Medial tutam) dan", "Fasciculus lateralis", "Fasciculus posterior", "Bo'yin chigalidan"],
        correctAnswerIndex: 0,
        explanation: "Medial tutamdan yelka va bilakning ichki (medial) yuzasi terisini ta'minlovchi sof sezuvchi nervlar chiqadi."
      },
      {
        question: "Kurak usti nervi (Nervus suprascapularis) qaysi mushaklarni innervatsiya qiladi?",
        options: ["Musculus supraspinatus (qiltiq usti) va Musculus infraspinatus (qiltiq osti) mushaklarini", "M. subscapularis", "M. deltoideus", "M. triceps brachii"],
        correctAnswerIndex: 0,
        explanation: "N. suprascapularis incisura scapulae orqali o'tib rotator manjetaning muhim mushaklarini (m. supraspinatus va infraspinatus) harakatlantiradi."
      },
      {
        question: "Ko'krak-orqa nervi (Nervus thoracodorsalis) qaysi mushakni innervatsiya qiladi?",
        options: ["Musculus latissimus dorsi (orqaning eng keng mushagini)", "M. trapezius", "M. rhomboideus", "M. serratus anterior"],
        correctAnswerIndex: 0,
        explanation: "N. thoracodorsalis a. thoracodorsalis bilan birga yotib latissimus dorsi mushagini ta'minlaydi."
      },
      {
        question: "Froment belgisi (Froment's sign - qog'oz varag'ini ikki barmoq orasida ushlab turganda bosh barmoqning bukilishi) qaysi nerv falajini ko'rsatadi?",
        options: ["Nervus ulnaris (M. adductor pollicis falajlangani sababli n. medianus innervatsiya qiluvchi m. flexor pollicis longus kompensator bukiladi)", "Nervus radialis", "Nervus axillaris", "Nervus musculocutaneus"],
        correctAnswerIndex: 0,
        explanation: "Froment testi tirsak nervi falajini aniqlash uchun eng ishonchli klinik testdir."
      },
      {
        question: "Kaft orqasining radial yarmi (I, II va III barmoqlar orqasining proksimal qismi) terisini qaysi nerv sezgi bilan ta'minlaydi?",
        options: ["Nervus radialis'ning yuzaki tarmog'i (Ramus superficialis n. radialis)", "Nervus medianus", "Nervus ulnaris", "Nervus musculocutaneus"],
        correctAnswerIndex: 0,
        explanation: "N. radialis'ning yuzaki tarmog'i anatomik tamakidondan o'tib kaft orqasining radial 2.5 barmog'ini sezgi bilan ta'minlaydi."
      },
      {
        question: "Barmoqlar uchining (distal falangalarning) kaft va tirnoq usti yuzasini qaysi nerv innervatsiya qiladi?",
        options: ["I, II, III va IV barmoq yarmini - Nervus medianus; V va IV barmoq yarmini - Nervus ulnaris", "Faqat radial nerv", "Faqat teri nervi", "Faqat orqa nervlar"],
        correctAnswerIndex: 0,
        explanation: "Barmoq uchlarining nozik taktil sezgisi kaft tomondan median va ulnar nervlarning xususiy barmoq shoxlari orqali ta'minlanadi."
      },
      {
        question: "Biseps refleksi (m. biceps brachii pay refleksi) qaysi orqa miya segmentlari orqali tutashadi?",
        options: ["C5 - C6 segmentlari (Nervus musculocutaneus orqali)", "C7 - C8", "C1 - C2", "Th1 - Th2"],
        correctAnswerIndex: 0,
        explanation: "Biseps refleksi C5-C6 segmentlari butunligini tekshiradi."
      },
      {
        question: "Triseps refleksi (m. triceps brachii pay refleksi) qaysi orqa miya segmentlari orqali tutashadi?",
        options: ["C7 - C8 segmentlari (Nervus radialis orqali)", "C5 - C6", "Th1 - Th2", "C3 - C4"],
        correctAnswerIndex: 0,
        explanation: "Triseps payiga urilganda hosil bo'ladigan refleks C7-C8 segmentlari va radial nerv faoliyatini baholaydi."
      },
      {
        question: "Karpopedal spazm (Trousseau belgisi) gipokalsiemiyada qaysi nervlar qo'zg'aluvchanligi oshishi hisobiga 'Akusher qo'li' shakliga kiradi?",
        options: ["Yelka chigali periferik nervlari (ayniqsa n. medianus va n. ulnaris) qo'zg'aluvchanligi oshib kaft mushaklari spazmga uchrashi sababli", "Faqat suyak sinishi sababli", "Miya insulti sababli", "Qon quyilishi sababli"],
        correctAnswerIndex: 0,
        explanation: "Gipokalsiemiyada periferik nervlar o'ta qo'zg'aluvchan bo'lib, yelkaga manjeta qo'yilganda qo'l akusher qo'li kabi bukiladi."
      }
    ]
  },

  // ==========================================
  // TOPIC 7 (Order 107 / S3-7): Bel chigali. Dumg‘aza chigali
  // ==========================================
  {
    topicOrder: 107,
    topicKeywords: ["bel chigali", "plexus lumbalis", "dumg'aza chigali", "plexus sacralis", "nervus femoralis", "nervus ischiadicus", "nervus obturatorius", "nervus peroneus", "nervus tibialis"],
    quizzes: [
      {
        question: "Bel chigali (Plexus lumbalis) qaysi orqa miya nervlarining oldingi shoxlaridan hosil bo'ladi?",
        options: ["Th12 (qisman), L1, L2, L3 va L4 (yuqori qismi) nervlarining oldingi shoxlaridan", "L4 - S4", "Th1 - Th12", "C5 - Th1"],
        correctAnswerIndex: 0,
        explanation: "Plexus lumbalis bel umurtqalari ko'ndalang o'simtalari oldida, m. psoas major qalinligida hosil bo'ladi."
      },
      {
        question: "Bel chigalining eng yirik asosiy nervi qaysi?",
        options: ["Nervus femoralis (Son nervi - L2, L3, L4 ildizlaridan)", "Nervus obturatorius", "Nervus ischiadicus", "Nervus pudendus"],
        correctAnswerIndex: 0,
        explanation: "Nervus femoralis bel chigalining eng yirik nervi bo'lib, Lacuna musculorum orqali son sohasiga o'tadi."
      },
      {
        question: "Son nervi (Nervus femoralis) qaysi mushaklarni innervatsiya qiladi?",
        options: ["Musculus quadriceps femoris (sonning to'rt boshli mushagi), Musculus sartorius (tikuvchi mushak) va Musculus pectineus", "Son orqa guruhi mushaklarini", "Dumba mushaklarini", "Boldir orqa mushaklarini"],
        correctAnswerIndex: 0,
        explanation: "N. femoralis sonning oldingi guruhi mushaklarini harakatlantiradi va tizza bo'g'imini yozadi."
      },
      {
        question: "Son nervining eng uzun sezuvchi shoxi qaysi va u qayergacha boradi?",
        options: ["Nervus saphenus (Teri osti nervi - Adduktor kanaldan o'tib boldir va oyoq panjasining medial chetigacha boradi)", "Nervus suralis", "Nervus peroneus", "Nervus cutaneus femoris lateralis"],
        correctAnswerIndex: 0,
        explanation: "N. saphenus v. saphena magna bilan birga boldirning medial yuzasi va tovon medial terisini sezgi bilan ta'minlaydi."
      },
      {
        question: "Yopqich nerv (Nervus obturatorius) qaysi teshikdan o'tadi va qaysi mushaklarni innervatsiya qiladi?",
        options: ["Canalis obturatorius (yopqich kanal) dan o'tib, sonning barcha medial yaqinlashtiruvchi (adduktor) mushaklarini ta'minlaydi", "Lacuna vasorum'dan", "Katta o'tirg'ich teshigidan", "Son kanalidan"],
        correctAnswerIndex: 0,
        explanation: "N. obturatorius m. adductor longus, brevis, magnus, gracilis va obturatorius externus'ni innervatsiya qiladi."
      },
      {
        question: "Sonning lateral teri nervi (Nervus cutaneus femoris lateralis) qisilganda qanday kasallik (Bernhardt-Rot kasalligi / Meralgia paresthetica) bo'ladi?",
        options: ["Chov boylami ostida nerv qisilib, sonning tashqi-yon yuzasi terisida achishuvchi og'riq, uvishish va sezgi yo'qolishi kuzatiladi", "Son falaji", "Tizza sinishi", "Oyoq shishi"],
        correctAnswerIndex: 0,
        explanation: "Meralgia paresthetica tor kiyim yoki semirishda n. cutaneus femoris lateralis qisilishidan son yonida og'riq beradi."
      },
      {
        question: "Tizza refleksi (Patellar refleks) qaysi orqa miya segmentlari va nerv orqali tutashadi?",
        options: ["L2 - L4 segmentlari va Nervus femoralis orqali", "L5 - S1", "S1 - S2", "Th12 - L1"],
        correctAnswerIndex: 0,
        explanation: "Tizza qopqog'i payiga urilganda sonning to'rt boshli mushagi qisqaradi; bu L2-L4 va son nervi butunligini ko'rsatadi."
      },
      {
        question: "Dumg'aza chigali (Plexus sacralis) qaysi nervlarning oldingi shoxlaridan hosil bo'ladi?",
        options: ["Truncus lumbosacralis (L4 pastki qismi + L5) va S1, S2, S3, S4 (yuqori qismi) oldingi shoxlaridan", "Th12 - L4", "Faqat bo'yin nervlaridan", "Faqat quyqum nervidan"],
        correctAnswerIndex: 0,
        explanation: "Plexus sacralis noksimon mushak oldida kichik chanoq bo'shlig'ida uchburchak plastinka shaklida yotadi."
      },
      {
        question: "Inson tanasidagi eng yirik, eng qalin va eng uzun nerv qaysi?",
        options: ["Nervus ischiadicus (O'tirg'ich / Quymich nervi - L4-S3 ildizlaridan)", "Nervus femoralis", "Nervus vagus", "Nervus phrenicus"],
        correctAnswerIndex: 0,
        explanation: "Nervus ischiadicus diametri 1.5-2 sm gacha yetadigan eng ulkan nerv bo'lib, butun oyoq orqasi va boldir/oyoq panjasini ta'minlaydi."
      },
      {
        question: "O'tirg'ich nervi (Nervus ischiadicus) chanoqdan qaysi teshik orqali chiqadi?",
        options: ["Foramen infrapiriforme (Noksimon mushak osti teshigi orqali)", "Foramen suprapiriforme", "Foramen obturatum", "Lacuna vasorum"],
        correctAnswerIndex: 0,
        explanation: "N. ischiadicus katta o'tirg'ich teshigining noksimon mushak osti qismidan dumba sohasiga chiqadi."
      },
      {
        question: "Noksimon mushak sindromi (Piriformis syndrome) nima?",
        options: ["M. piriformis spazmi yoki yallig'lanishi sababli o'tirg'ich nervining (N. ischiadicus) qisilib qolishi va dumba hamda oyoq bo'ylab kuchli og'riq (Ishias) berishi", "Dumba suyagi sinishi", "Tizza chiqishi", "Son churrasi"],
        correctAnswerIndex: 0,
        explanation: "Noksimon mushak ostida nerv ezilganda quymichdan tovonigacha tortishuvchi kuchli og'riq va uvishish (ishias) bo'ladi."
      },
      {
        question: "O'tirg'ich nervi (Nervus ischiadicus) sonning orqa guruhida qaysi mushaklarni innervatsiya qiladi?",
        options: ["Sonning barcha orqa bukuvchi mushaklarini (m. biceps femoris, m. semitendinosus, m. semimembranosus)", "To'rt boshli mushakni", "Yaqinlashtiruvchi mushaklarni", "Katta dumba mushagini"],
        correctAnswerIndex: 0,
        explanation: "N. ischiadicus son orqasidagi tizza bukurchi mushaklarini (hamstring mushaklari) harakatlantiradi."
      },
      {
        question: "O'tirg'ich nervi (Nervus ischiadicus) taqim chuqurchasi yuqori burchagida qaysi ikki yirik nervga bo'linadi?",
        options: ["Nervus tibialis (Katta boldir nervi) va Nervus peroneus communis / fibularis (Umumiy kichik boldir nervi)", "Nervus femoralis va saphenus", "Nervus obturatorius va pudendus", "Nervus gluteus superior va inferior"],
        correctAnswerIndex: 0,
        explanation: "N. ischiadicus taqim chuqurligida to'g'ri pastga davom etuvchi n. tibialis va lateralga buriluvchi n. fibularis communis'ga ajraladi."
      },
      {
        question: "Katta boldir nervi (Nervus tibialis) boldir va oyoq panjasida qaysi mushaklarni innervatsiya qiladi?",
        options: ["Boldir orqa guruhidagi barcha yozuvchi/bukuvchi mushaklarni (m. triceps surae, m. tibialis posterior, m. flexor digitorum longus) va oyoq tagi (kaft) mushaklarini", "Boldir oldingi guruhini", "Boldir lateral guruhini", "Son mushaklarini"],
        correctAnswerIndex: 0,
        explanation: "N. tibialis oyoq tagi va barmoqlarning bukilishini (plantarflexion) hamda boldir orqa yuzasi va oyoq tagi sezgisini ta'minlaydi."
      },
      {
        question: "Katta boldir nervi (Nervus tibialis) falajlanganda bemor qanday harakatni bajara olmaydi?",
        options: ["Oyoq panjasini pastga bura olmaydi va oyoq uchida (barmoqlarda) tik tura olmaydi ('Tovonda yurish' majburiyati)", "Tovonda tura olmaydi", "Tizzani yoza olmaydi", "Sonni buka olmaydi"],
        correctAnswerIndex: 0,
        explanation: "M. triceps surae (axill payi) ishlamagani sababli bemor oyoq uchida tura olmaydi, panja orqaga qayrilib qoladi (pes calcaneus)."
      },
      {
        question: "Axill refleksi (Tendo calcaneus pay refleksi) qaysi segmentlar orqali tutashadi?",
        options: ["S1 - S2 segmentlari va Nervus tibialis orqali", "L2 - L4", "L4 - L5", "Th12 - L1"],
        correctAnswerIndex: 0,
        explanation: "Axill payiga urilganda oyoq panjasi pastga bukiladi; bu S1-S2 segmentlari faoliyatini aks ettiradi."
      },
      {
        question: "Umumiy kichik boldir nervi (Nervus fibularis / peroneus communis) kichik boldir suyagi bo'ynida qaysi ikki shoxga bo'linadi?",
        options: ["Nervus fibularis superficialis (yuzaki) va Nervus fibularis profundus (chuqur)", "Nervus tibialis va suralis", "Nervus plantaris medialis va lateralis", "Nervus saphenus va femoralis"],
        correctAnswerIndex: 0,
        explanation: "Kichik boldir suyagi bo'ynida nerv yuzaki va chuqur shoxlarga ajraladi; bu sohadagi gips yoki jarohat nervni oson shikastlaydi."
      },
      {
        question: "Chuqur kichik boldir nervi (Nervus fibularis profundus) qaysi mushaklarni innervatsiya qiladi?",
        options: ["Boldir oldingi guruhi mushaklarini (m. tibialis anterior, m. extensor digitorum longus, m. extensor hallucis longus - oyoq panjasini yuqoriga bukuvchilar)", "Boldir orqa mushaklarini", "Son orqa mushaklarini", "Oyoq tagi mushaklarini"],
        correctAnswerIndex: 0,
        explanation: "N. fibularis profundus oyoq panjasini yuqoriga (dorsifleksiya) va barmoqlarni yozishni ta'minlaydi."
      },
      {
        question: "Umumiy kichik boldir nervi (Nervus peroneus communis) falajlanganda oyoq panjasi qanday ko'rinishga kiradi va bemor qanday yuradi?",
        options: ["'Osiq oyoq panjasi' (Foot drop / Pes equinovarus); bemor panjasini yerga sudrab olmaslik uchun tizzasini baland ko'tarib yuradi ('Xo'rozcha yurish' / Steppage gait)", "Oyoq uchida yuradi", "Tizzani buka olmaydi", "Qush panjasi"],
        correctAnswerIndex: 0,
        explanation: "Dorsifleksiya yo'qolgani sababli panja pastga osilib qoladi va qadam tashlaganda yerga tegib ketmaslik uchun tizza baland ko'tariladi (Steppaj)."
      },
      {
        question: "1-va 2-barmoqlar oralig'idagi tor teri zonasini (oyoq panjasi orqasida) qaysi nerv sezgi bilan ta'minlaydi?",
        options: ["Nervus fibularis profundus (Chuqur kichik boldir nervi)", "Nervus fibularis superficialis", "Nervus tibialis", "Nervus saphenus"],
        correctAnswerIndex: 0,
        explanation: "Chuqur fibulyar nerv oyoq orqasida faqat 1- va 2-barmoqlararo oraliq terisini sezgi bilan ta'minlaydi (nerv blokadasi nazorati)."
      },
      {
        question: "Yuzaki kichik boldir nervi (Nervus fibularis superficialis) qaysi mushaklarni innervatsiya qiladi?",
        options: ["Boldirning lateral guruhi mushaklarini (m. fibularis longus va m. fibularis brevis - panjani tashqariga buruvchi/pronatsiya)", "Boldir orqa guruhini", "Boldir oldingi guruhini", "Tizza bukuvchilarini"],
        correctAnswerIndex: 0,
        explanation: "N. fibularis superficialis lateral guruh mushaklarini harakatlantiradi va oyoq panjasi orqa terisining katta qismini ta'minlaydi."
      },
      {
        question: "Yuqori dumba nervi (Nervus gluteus superior) qaysi mushaklarni innervatsiya qiladi?",
        options: ["Musculus gluteus medius, Musculus gluteus minimus va Musculus tensor fasciae latae", "Musculus gluteus maximus", "Musculus quadratus femoris", "Musculus piriformis"],
        correctAnswerIndex: 0,
        explanation: "N. gluteus superior o'rta va kichik dumba mushaklarini ta'minlaydi; ular yurganda chanog'ni gorizontal ushlab turadi."
      },
      {
        question: "Trendelenburg belgisi (Trendelenburg sign - bir oyoqda turganda qarama-qarshi tomon chanoqning pastga osilib qolishi) qaysi nerv falajida bo'ladi?",
        options: ["Nervus gluteus superior falaji (M. gluteus medius zaifligi sababli)", "Nervus gluteus inferior", "Nervus femoralis", "Nervus ischiadicus"],
        correctAnswerIndex: 0,
        explanation: "O'rta dumba mushagi falajlanganda tayanch oyog'i chanoqni ushlay olmaydi va qarama-qarshi sog' tomon chanog'i pastga qulaydi (o'rdaksimon yurish)."
      },
      {
        question: "Pastki dumba nervi (Nervus gluteus inferior) qaysi yirik mushakni innervatsiya qiladi?",
        options: ["Musculus gluteus maximus (Katta dumba mushagini - sonni yozuvchi eng kuchli mushak)", "M. gluteus medius", "M. sartorius", "M. piriformis"],
        correctAnswerIndex: 0,
        explanation: "N. gluteus inferior foramen infrapiriforme'dan chiqib katta dumba mushagini ta'minlaydi; zararlanganda zinadan ko'tarilish qiyinlashadi."
      },
      {
        question: "Jinsiy nerv (Nervus pudendus) qaysi sohalarni innervatsiya qiladi?",
        options: ["Oraliq (Perineum) mushaklarini, tashqi anal sfinkterni, tashqi uretra sfinkterini hamda jinsiy olat/klitor sezgisini (N. dorsalis penis/clitoridis)", "Dumba mushaklarini", "Son mushaklarini", "Qorin to'g'ri mushagini"],
        correctAnswerIndex: 0,
        explanation: "N. pudendus oraliq a'zolari, sfinkterlar va jinsiy a'zolarning asosiy somatik va sezuvchi nervidir (tug'ruqda pudendal anesteziya qilinadi)."
      },
      {
        question: "Icraklash nervi (Nervus suralis) qanday hosil bo'ladi?",
        options: ["N. cutaneus surae medialis (n. tibialis'dan) va N. cutaneus surae lateralis (n. fibularis'dan) shoxlarining qo'shilishidan", "Son nervidan", "Jinsiy nervdan", "Bel chigalidan"],
        correctAnswerIndex: 0,
        explanation: "N. suralis boldirning orqa-pastki va lateral to'piq hamda tovon lateral cheti terisini sezgi bilan ta'minlaydi."
      },
      {
        question: "Tarsal kanal sindromi (Canalis tarsi sindromi) da qaysi nerv qisiladi?",
        options: ["Nervus tibialis (Medial to'piq orqasida fleksorlar ushlagichi ostida qisilib oyoq tagida achishuvchi og'riq beradi)", "Nervus peroneus", "Nervus femoralis", "Nervus suralis"],
        correctAnswerIndex: 0,
        explanation: "Medial to'piq orqasida n. tibialis ezilganda oyoq tagi va barmoqlarda kuchli yonuvchi paresteziya va og'riq paydo bo'ladi."
      },
      {
        question: "Laseg simptomi (Lasegue sign / To'g'ri ko'tarilgan oyoq sinamasi) nimani aniqlash uchun tekshiriladi?",
        options: ["O'tirg'ich nervi (N. ischiadicus) yoki L5-S1 spinal ildizlarining disk churrasi bilan ezilishini (nerv tortilganda orqa sohada o'tkir og'riq)", "Tizza meniskini", "Chanoq-son bo'g'imini", "Boldir suyagi sinishini"],
        correctAnswerIndex: 0,
        explanation: "Yotgan holatda to'g'ri oyoq 30-60 gradusga ko'tarilganda o'tirg'ich nervi tortilib og'riq bersa Laseg simptomi musbat hisoblanadi."
      },
      {
        question: "Dumba sohasiga intramuskulyar (mushak ichiga) in'ektsiya nima sababdan faqat Yuqori-Tashqi kvadrantga qilinadi?",
        options: ["O'tirg'ich nervi (N. ischiadicus) va yirik gluteal tomirlarni igna bilan shikastlab falajlik chaqirmaslik uchun", "U yerda teri yupqa bo'lgani uchun", "Dori tezroq so'rilishi uchun", "Suyak yaqin bo'lgani uchun"],
        correctAnswerIndex: 0,
        explanation: "O'tirg'ich nervi pastki va ichki kvadrantlardan o'tadi; faqat yuqori-tashqi kvadrant nervdan mutlaqo xavfsiz zonadir."
      },
      {
        question: "Dum chigali (Plexus coccygeus) qaysi nervlardan hosil bo'ladi va nimani innervatsiya qiladi?",
        options: ["S5 va Co1 (dum nervi) oldingi shoxlaridan hosil bo'lib, dum suyagi sohasi terisini va m. coccygeus'ni ta'minlaydi", "L1 - L4", "Th1 - Th5", "C1 - C2"],
        correctAnswerIndex: 0,
        explanation: "Plexus coccygeus eng pastki kichik chigal bo'lib, anal teshik va dum suyagi oralig'idagi teriga nn. anococcygei shoxlarini beradi."
      }
    ]
  },

  // ==========================================
  // TOPIC 8 (Order 108 / S3-8): I, II, VIII juft bosh miya nervlari
  // ==========================================
  {
    topicOrder: 108,
    topicKeywords: ["i juft", "ii juft", "viii juft", "nervus olfactorius", "nervus opticus", "nervus vestibulocochlearis", "ko'rish", "hidlov", "dahliz", "chig'anoq"],
    quizzes: [
      {
        question: "I juft - Hidlov nervi (Nervus olfactorius) ning 1-neyronlari (retseptorlari) qayerda joylashgan?",
        options: ["Burun bo'shlig'i yuqori qismidagi shilliq qavatda (Regio olfactoria / yuqori burun chig'anog'i va to'siq sohasida)", "Burun tubida", "Miya po'stlog'ida", "Thalamusda"],
        correctAnswerIndex: 0,
        explanation: "Hid bilish retseptor hujayralari burun bo'shlig'ining yuqori shilliq pardasida yotuvchi bipolyar neyronlardir."
      },
      {
        question: "Hidlov nervi tolalari (Fila olfactoria) kalla suyagining qaysi teshiklaridan kalla bo'shlig'iga o'tadi?",
        options: ["G'alvursimon suyakning teshikli plastinkasi (Lamina cribrosa ossis ethmoidalis) orqali", "Ko'rish kanali orqali", "Tuxumsimon teshik orqali", "Yirtiq teshik orqali"],
        correctAnswerIndex: 0,
        explanation: "15-20 ta nozik hidlov tolalari lamina cribrosa teshiklaridan o'tib Bulbus olfactorius'ga kiradi."
      },
      {
        question: "Hidlov analizatorining po'stloq markazi qaysi sohada joylashgan?",
        options: ["Gyrus parahippocampalis ning Uncus (ilgagi) sohasida va qadimgi po'stloqda (Paleocortex)", "Ensa bo'lagida", "Peshona markazida", "Tepa bo'lagida"],
        correctAnswerIndex: 0,
        explanation: "Hid bilish po'stloq markazi limbik tizim tarkibidagi Uncus va paragippokampal pushtada joylashgan."
      },
      {
        question: "Anosmiya nima?",
        options: ["Hid bilish sezgisining to'liq yo'qolishi", "Ko'rishning yo'qolishi", "Eshitishning yo'qolishi", "Ta'm bilmaslik"],
        correctAnswerIndex: 0,
        explanation: "Anosmiya - hid bilmaslik bo'lib, kalla asosi sinishida (lamina cribrosa jarohati) yoki COVID-19 infeksiyasida uchraydi."
      },
      {
        question: "Hidlov gallyutsinatsiyalari (yoqimsiz hidlar sezish) ko'pincha qaysi sohadagi o'sma yoki epilepsiyada kuzatiladi?",
        options: ["Chakka bo'lagining medial yuzasida (Uncus sohasida)", "Ensa bo'lagida", "Miyachada", "Orqa miyada"],
        correctAnswerIndex: 0,
        explanation: "Uncus sohasining ta'sirlanishi (epileptik o'choq) bemorda o'tkir yoqimsiz hidlar (kuyindi, chirindi) gallyutsinatsiyasini chaqiradi."
      },
      {
        question: "II juft - Ko'rish nervi (Nervus opticus) tolalari qaysi hujayralarning aksonlaridan hosil bo'ladi?",
        options: ["Ko'z to'r pardasining (Retina) Ganglionar qavati (III neyron) hujayralari aksonlaridan", "Kallachasimon va tayoqchasimon hujayralardan", "Bipolyar hujayralardan", "Pigment hujayralaridan"],
        correctAnswerIndex: 0,
        explanation: "To'r pardaning 1-neyroni: tayoqcha/kolbachalar, 2-neyroni: bipolyar hujayralar, 3-neyroni: ganglionar hujayralar bo'lib, ularning aksonlari ko'rish nervini hosil qiladi."
      },
      {
        question: "Ko'rish nervi (Nervus opticus) ko'z kosasidan kalla suyagiga qaysi yo'l orqali kiradi?",
        options: ["Canalis opticus (Ko'rish kanali orqali, a. ophthalmica bilan birga)", "Fissura orbitalis superior", "Fissura orbitalis inferior", "Foramen rotundum"],
        correctAnswerIndex: 0,
        explanation: "N. opticus ponasimon suyak kichik qanotining Canalis opticus kanalidan kalla bo'shlig'iga o'tadi."
      },
      {
        question: "Ko'rish xiazmasida (Chiasma opticum) to'r pardaning qaysi tolalari kesishadi?",
        options: ["To'r pardaning faqat medial (burun / nazal) yarmidan keluvchi tolalari qarama-qarshi tomonga o'tadi; lateral (chakka / temporal) tolalari esa kesishmaydi", "Barcha tolalar to'liq kesishadi", "Faqat lateral tolalar kesishadi", "Hech qanday tolalar kesishmaydi"],
        correctAnswerIndex: 0,
        explanation: "Xiazmada faqat nazal to'r parda tolalari (ko'rish maydonining temporal yarmini ko'rsatuvchi) kesishadi."
      },
      {
        question: "Gipofiz o'smasi (Adenoma hypophysis) Chiasma opticum o'rtasini ezganda ko'rish maydonida qanday defekt bo'ladi?",
        options: ["Bitemporal gemianopsiya (ikkala ko'zning tashqi / chekka ko'rish maydonlarining ko'r bo'lib qolishi - 'Tunnel ko'rish')", "Binasal gemianopsiya", "Bir ko'zning to'liq ko'rligi", "Ko'rishning o'zgarmasligi"],
        correctAnswerIndex: 0,
        explanation: "Xiazma o'rtasida nazal tolalar kesishgani sababli gipofiz o'smasi ularni ezganda ikkala ko'zning lateral maydonlari ko'rmay qoladi."
      },
      {
        question: "O'ng tomondagi Ko'rish traktining (Tractus opticus dexter) to'liq uzilishi qanday ko'rish buzilishiga olib keladi?",
        options: ["Gomonim chap tomonlama gemianopsiya (ikkala ko'zning chap tomonlama ko'rish maydonlarining yo'qolishi)", "O'ng tomonlama to'liq ko'rlik", "Bitemporal ko'rlik", "Faqat oq-qora ko'rish"],
        correctAnswerIndex: 0,
        explanation: "O'ng ko'rish trakti o'ng to'r parda temporali va chap to'r parda nazalini (ya'ni chap ko'rish maydonini) tashiydi; uzilsa chap tomonlama gomonim gemianopsiya bo'ladi."
      },
      {
        question: "Ko'rishning po'stloqosti markazlari qaysilar?",
        options: ["Corpus geniculatum laterale (lateral tirsaksimon tana), Colliculus superior (yuqori do'mboqcha) va Pulvinar thalami", "Corpus geniculatum mediale", "Nucleus ruber", "Substantia nigra"],
        correctAnswerIndex: 0,
        explanation: "Ko'rish traktining asosiy tolalari lateral tirsaksimon tanada (CGL) 4-neyron bilan sinaps hosil qiladi."
      },
      {
        question: "Ko'rish radiatsiyasi (Grasiole tutami / Radiatio optica) qayerdan boshlanib qayerda tugaydi?",
        options: ["Corpus geniculatum laterale'dan boshlanib, ichki kapsula orqasidan o'tib Ensa bo'lagining Sulcus calcarinus po'stlog'ida (Brodman 17) tugaydi", "Thalamusdan peshonaga", "Miyachaga", "Ko'prikka"],
        correctAnswerIndex: 0,
        explanation: "Grasiole tutami ko'rish impulslarini birlamchi ko'rish po'stlog'iga (17-maydon) yetkazuvchi yakuniy yo'ldir."
      },
      {
        question: "Ko'rish nervi diski shishi (Stasis papillae / Papilledema) nimaning eng ishonchli oftalmoskopik belgisi hisoblanadi?",
        options: ["Kalla ichki bosimining (Intrakranial gipertenziya) oshishi (masalan, miya o'smasi, gidrosefaliya yoki qon quyilishida)", "Ko'zga chang tushishining", "Arterial gipotoniyaning", "Qon kamligining"],
        correctAnswerIndex: 0,
        explanation: "Ko'rish nervi miya pardalari bilan o'ralgan bo'lib, kalla ichi bosimi oshganda likvor bosimi venalarni ezib disk shishini chaqiradi."
      },
      {
        question: "Amavroz va Ambliopiya nima?",
        options: ["Amavroz - ko'z soqqasida o'zgarish bo'lmasa ham nerv yoki po'stloq zararlanishidan to'liq ko'rlik; Ambliopiya - ko'rish o'tkirligining pasayishi ('Dangasa ko'z')", "Faqat ko'z yallig'lanishi", "Qorachiq kengayishi", "Rang ajrata olmaslik"],
        correctAnswerIndex: 0,
        explanation: "Amavroz - ko'rish nervi yoki analizatori buzilishi sababli to'liq ko'rlik holatidir."
      },
      {
        question: "Bitta ko'zning ko'rish nervi (Nervus opticus) to'liq kesilsa nima yuz beradi?",
        options: ["Shu ko'zning to'liq ko'rligi (shu tomonda monokulyar amavroz) va to'g'ridan-to'g'ri qorachiq yorug'lik refleksining yo'qolishi", "Ikkala ko'z ko'r bo'ladi", "Faqat yarim maydon ko'rmaydi", "Ko'rish o'zgarmaydi"],
        correctAnswerIndex: 0,
        explanation: "Xiazmagacha bo'lgan ko'rish nervi uzilsa faqat shu ko'zning barcha ko'rish maydoni to'liq yo'qoladi."
      },
      {
        question: "VIII juft - Dahliz-chig'anoq nervi (Nervus vestibulocochlearis) qanday ikki qismdan iborat?",
        options: ["Pars cochlearis (Eshitish / Chig'anoq qismi) va Pars vestibularis (Muvozanat / Dahliz qismi)", "Pars motoria va pars sensoria", "Pars optica va pars acustica", "Pars anterior va posterior"],
        correctAnswerIndex: 0,
        explanation: "VIII juft nerv ichki quloqdan eshitish va muvozanat impulslarini miya poyasiga tashiydi."
      },
      {
        question: "Eshitish qismining (Pars cochlearis) 1-neyronlari qayerda joylashgan?",
        options: ["Ichki quloq chig'anog'ining suyak o'zagidagi Spiral tugunda (Ganglion spirale cochleae)", "Korti a'zosida", "Voroliy ko'prigida", "Thalamusda"],
        correctAnswerIndex: 0,
        explanation: "Spiral tugunning bipolyar neyronlari periferik o'simtasi Korti a'zosi sochli hujayralariga boradi, markaziy o'simtasi esa nervni hosil qiladi."
      },
      {
        question: "Dahliz qismining (Pars vestibularis) 1-neyronlari qayerda joylashgan?",
        options: ["Ichki eshituv yo'li tubidagi Dahliz tugunida (Ganglion vestibulare / Skarpa tuguni)", "Spiral tugunda", "Rombsimon chuqurchada", "Miyachada"],
        correctAnswerIndex: 0,
        explanation: "Skarpa tuguni neyronlari yarim doira kanallari ampulalari va dahliz xaltachalaridan (makula va kristalar) muvozanat signallarini oladi."
      },
      {
        question: "VIII juft nerv kalla suyagiga qaysi teshik orqali kiradi?",
        options: ["Porus acusticus internus (Ichki eshituv teshigi orqali, VII nerv bilan birga)", "Foramen jugulare", "Foramen ovale", "Foramen magnum"],
        correctAnswerIndex: 0,
        explanation: "VIII va VII nervlar piramida suyagining orqa yuzasidagi Porus acusticus internus orqali kalla bo'shlig'iga o'tadi."
      },
      {
        question: "Eshitish yo'lining po'stloqosti markazi qaysi?",
        options: ["Corpus geniculatum mediale (Medial tirsaksimon tana) va To'rt tepalikning pastki do'mboqchalari (Colliculi inferiores)", "Corpus geniculatum laterale", "Thalamus VPL", "Qizil o'zak"],
        correctAnswerIndex: 0,
        explanation: "Eshitish impulslari lateral halqa (lemniscus lateralis) orqali medial tirsaksimon tanaga yetib boradi."
      },
      {
        question: "Birlamchi eshitish po'stloq markazi qayerda joylashgan?",
        options: ["Chakka bo'lagining yuqori pushtasidagi Geshil pushtalarida (Gyri temporales transversi / Brodman 41, 42)", "Ensa bo'lagida", "Peshonada", "Tepa bo'lagida"],
        correctAnswerIndex: 0,
        explanation: "Geshil pushtalari tovush to'lqinlarini tahlil qiluvchi bosh oliy eshitish po'stlog'idir."
      },
      {
        question: "Vestibulyar apparatning 4 ta o'zagi (Bexterev, Shvalbe, Deyters, Roller) qayerda joylashgan?",
        options: ["Rombsimon chuqurchaning (IV qorincha tubining) lateral burchaklarida (Area vestibularis)", "O'rta miyada", "Thalamusda", "Miyacha po'stlog'ida"],
        correctAnswerIndex: 0,
        explanation: "Rombsimon chuqurchada 4 juft dahliz o'zaklari yotib, miyacha, ko'z harakati o'zaklari va orqa miya bilan bog'lanadi."
      },
      {
        question: "Nistagm (Nystagmus - ko'z soqqalarining beixtiyor ritmik qaltirashi) qaysi tizim zararlanishida paydo bo'ladi?",
        options: ["Vestibulyar apparat (VIII nerv dahliz qismi) yoki miyacha yo'llari zararlanganda", "Ko'rish nervi uzilganda", "Hidlov yo'qolganda", "Yuz nervi falajida"],
        correctAnswerIndex: 0,
        explanation: "Vestibulo-okulyar refleks buzilganda ko'z soqqalarining beixtiyor titrashi (gorizontal yoki vertikal nistagm) paydo bo'ladi."
      },
      {
        question: "Tinnitus nima?",
        options: ["Tashqi tovush manbai bo'lmasa ham quloqda shang'illash, shovqin yoki g'uvillash eshitilishi", "Eshitishning yaxshilanishi", "Bosh aylanishi", "Quloqdan qon ketishi"],
        correctAnswerIndex: 0,
        explanation: "Tinnitus eshitish nervi yoki Korti a'zosining shikastlanishida uchraydigan sub'ektiv shovqindir."
      },
      {
        question: "Menyer kasalligi (Morbus Meniere) qanday klinik belgilar bilan kechadi?",
        options: ["Xurujli aylanma bosh aylanishi (vertigo), quloqda shovqin (tinnitus), eshitishning bosqichma-bosqich pasayishi va ko'ngil aynishi", "Ko'rlik va falajlik", "Mushaklar qotishi", "Xotira yo'qolishi"],
        correctAnswerIndex: 0,
        explanation: "Menyer kasalligida ichki quloqda endolimfa bosimi oshib (endolimfatik gidrops) eshitish va muvozanat buziladi."
      },
      {
        question: "Nevrinoma (Vestibulyar shvannoma) ko'pincha qaysi nervda va qayerda rivojlanadi?",
        options: ["VIII juft nervning dahliz qismida, Ko'prik-miyacha burchagida (Angulus pontocerebellaris)", "I juft nervda", "II juft nervda", "Orqa miyada"],
        correctAnswerIndex: 0,
        explanation: "Shvannoma VIII nervni ezib bir tomonlama karlik, shovqin va yuz nervi (VII) zaifligiga olib keladi."
      },
      {
        question: "Rinne va Veber sinamalari kamerton yordamida nimani farqlash uchun o'tkaziladi?",
        options: ["O'tkazuvchanlik karligi (o'rta quloq kasalligi) bilan Neyrosensor karlikni (VIII nerv va ichki quloq zararlanishini) farqlash uchun", "Ko'rish o'tkirligini aniqlash uchun", "Muvozanatni tekshirish uchun", "Xidni tekshirish uchun"],
        correctAnswerIndex: 0,
        explanation: "Kamerton suyak va havo o'tkazuvchanligini taqqoslash orqali karlikning sababini aniqlaydi."
      },
      {
        question: "Yarim doira kanallari (Ductus semicirculares) nimani sezadi?",
        options: ["Boshning burchakli tezlanishini va fazodagi aylanma harakatlarini (3 ta o'zaro perpendikulyar tekislikda)", "To'g'ri chiziqli harakatni", "Faqat tovush to'lqinlarini", "Yorug'likni"],
        correctAnswerIndex: 0,
        explanation: "3 ta yarimdoira kanallari ampulalaridagi kristalar bosh burilganda endolimfa oqimi orqali burchak tezlanishni sezadi."
      },
      {
        question: "Dahliz xaltachalari (Utriculus va Sacculus) dagi Otolit apparati nimani sezadi?",
        options: ["Gravitatsiya (tortishish kuchi) va to'g'ri chiziqli (chiziqli tezlanish) harakatlarni (masalan, liftda ko'tarilish yoki mashinada tezlashish)", "Aylanma harakatlarni", "Faqat tovushlarni", "Haroratni"],
        correctAnswerIndex: 0,
        explanation: "Makulalardagi otolit toshchalari og'irlik kuchi va chiziqli tezlanishda siljib sochli hujayralarni qo'zg'atadi."
      },
      {
        question: "Bir tomonlama bosh miya yarim shari po'stlog'i zararlanganda nima sababdan to'liq karlik yuz bermaydi?",
        options: ["Eshitish yo'li tolalari miya poyasida (Trapetsiyasimon tanada) ikki tomonlama qisman kesishgani sababli har bir yarim shar ikkala quloqdan axborot oladi", "Quloq o'zi mustaqil ishlagani uchun", "Eshitish miyaga bormagani uchun", "Suyak orqali o'tgani uchun"],
        correctAnswerIndex: 0,
        explanation: "Eshitish signallari miya poyasida ikkala tomonga tarqaladi, shuning uchun po'stloq zararlansa faqat eshitish biroz pasayadi, to'liq karlik bo'lmaydi."
      }
    ]
  },

  // ==========================================
  // TOPIC 9 (Order 109 / S3-9): III, IV, VI, XI, XII juft bosh miya nervlari
  // ==========================================
  {
    topicOrder: 109,
    topicKeywords: ["iii juft", "iv juft", "vi juft", "xi juft", "xii juft", "oculomotorius", "trochlearis", "abducens", "accessorius", "hypoglossus"],
    quizzes: [
      {
        question: "III juft - Ko'zni harakatlantiruvchi nerv (Nervus oculomotorius) qaysi ko'z mushaklarini innervatsiya qiladi?",
        options: ["Ko'zning to'rtta tashqi mushagini (m. rectus superior, inferior, medialis, m. obliquus inferior), yuqori qovoqni ko'taruvchi mushakni (m. levator palpebrae superioris) hamda qorachiq va siliar mushaklarni", "Faqat lateral to'g'ri mushakni", "Faqat yuqori qiyshiq mushakni", "Barcha yuz mushaklarini"],
        correctAnswerIndex: 0,
        explanation: "III nerv ko'z kosasidagi 6 ta mushakdan 4 tasini va yuqori qovoqni hamda ichki silliq mushaklarni harakatlantiradi."
      },
      {
        question: "Nervus oculomotorius (III juft) to'liq falajlanganda qanday klinik belgilar triadasini ko'rish mumkin?",
        options: ["Ptosis (yuqori qovoqning to'liq tushib qolishi), Tashqariga-pastga g'ilaylik (Strabismus divergens) va Mydriasis (qorachiqning kengayib yorug'likka javob bermasligi)", "Qorachiq torayishi va ko'z yosh oqishi", "Ko'zning ichkariga burilishi", "Ko'rlik"],
        correctAnswerIndex: 0,
        explanation: "M. levator palpebrae va m. sphincter pupillae falajlanib qovoq tushadi, qorachiq kengayadi va saqlanib qolgan VI nerv ko'zni tashqariga tortadi."
      },
      {
        question: "IV juft - G'altaksimon nerv (Nervus trochlearis) qaysi yagona ko'z mushagini innervatsiya qiladi?",
        options: ["Musculus obliquus superior (Yuqori qiyshiq mushakni - ko'zni pastga va tashqariga qaratadi)", "Musculus rectus lateralis", "Musculus rectus medialis", "Musculus ciliaris"],
        correctAnswerIndex: 0,
        explanation: "N. trochlearis faqat yuqori qiyshiq mushakni ta'minlaydi; uning falajida bemor pastga (masalan, zinadan tushayotganda) qaraganda ikkita ko'radi (diplopiya)."
      },
      {
        question: "VI juft - Uzoqlashtiruvchi nerv (Nervus abducens) qaysi mushakni innervatsiya qiladi?",
        options: ["Musculus rectus lateralis (Lateral / Tashqi to'g'ri mushakni - ko'zni tashqariga buruvchi)", "Musculus rectus medialis", "Musculus obliquus superior", "Musculus sphincter pupillae"],
        correctAnswerIndex: 0,
        explanation: "N. abducens ko'zni lateral tomonga (tashqariga) buradi; zararlanganda ko'z ichkariga burilib qoladi (Strabismus convergens - yaqinlashuvchi g'ilaylik)."
      },
      {
        question: "III, IV va VI juft nervlar kalla bo'shlig'idan ko'z kosasiga qaysi teshik orqali o'tadi?",
        options: ["Fissura orbitalis superior (Yuqori ko'z kosasi yorig'i orqali)", "Canalis opticus", "Fissura orbitalis inferior", "Foramen rotundum"],
        correctAnswerIndex: 0,
        explanation: "Ko'z harakatlantiruvchi barcha nervlar (III, IV, VI) va V1 (n. ophthalmicus) yuqori ko'z kosasi yorig'i orqali o'tadi."
      },
      {
        question: "Tolosa-Hunt sindromi (Yuqori ko'z kosasi yorig'i sindromi) nima?",
        options: ["Fissura orbitalis superior sohasidagi yallig'lanish yoki o'sma sababli III, IV, VI nervlar va V1 nervning zararlanishi (oftalmoplegiya va peshonada og'riq)", "Quloq yallig'lanishi", "Jag' chiqishi", "Til falaji"],
        correctAnswerIndex: 0,
        explanation: "Yuqori ko'z kosasi yorig'idagi patologiyada barcha ko'z harakati nervlari falajlanib to'liq oftalmoplegiya yuzaga keladi."
      },
      {
        question: "XI juft - Qo'shimcha nerv (Nervus accessorius) qaysi ikki yirik mushakni innervatsiya qiladi?",
        options: ["Musculus sternocleidomastoideus (to'sh-o'mrov-so'rg'ichsimon) va Musculus trapezius (trapetsiyasimon) mushaklarini", "M. deltoideus va m. pectoralis", "M. latissimus dorsi", "Yuz mimika mushaklarini"],
        correctAnswerIndex: 0,
        explanation: "N. accessorius bo'yinni buruvchi va yelkani yuqoriga ko'taruvchi (yelka qisish) trapesiya va to'sh-o'mrov mushaklarini harakatlantiradi."
      },
      {
        question: "XI juft nerv (N. accessorius) bir tomonlama falajlanganda qanday belgilar kuzatiladi?",
        options: ["Boshni qarama-qarshi tomonga burish qiyinlashadi, yelka pastga osilib qoladi va bemor yelkasini yuqoriga ko'tara olmaydi (yelka qisa olmaydi)", "Bemor ko'r bo'ladi", "Til qiyshayadi", "Yutish buziladi"],
        correctAnswerIndex: 0,
        explanation: "Trapetsiyasimon mushak falajlangani sababli yelka pastga tushadi va qo'lni gorizontaldan yuqoriga ko'tarish cheklanadi."
      },
      {
        question: "XII juft - Tilosti nervi (Nervus hypoglossus) qanday mushaklarni innervatsiya qiladi?",
        options: ["Tilning barcha xususiy va skelet mushaklarini (m. genioglossus, hyoglossus, styloglossus - m. palatoglossus'dan tashqari)", "Chaynov mushaklarini", "Mimika mushaklarini", "Hiqildoq mushaklarini"],
        correctAnswerIndex: 0,
        explanation: "N. hypoglossus sof motor nerv bo'lib, tilning barcha harakatlarini ta'minlaydi."
      },
      {
        question: "XII juft nerv (N. hypoglossus) bir tomonlama zararlanganda og'izdan chiqarilgan til qaysi tomonga og'adi?",
        options: ["Zararlangan (falajlangan) tomonga og'adi (chunki sog' tomonning m. genioglossus mushagi tilni oldinga va kasal tomonga itaradi)", "Sog' tomonga og'adi", "To'g'ri chiqadi", "Umuman chiqmaydi"],
        correctAnswerIndex: 0,
        explanation: "Periferik falajda til kasal tomonga og'adi va shu yarmi atrofiyaga uchrab fibrillyar titraydi."
      },
      {
        question: "XII juft nerv kalla suyagidan qaysi teshik orqali chiqadi?",
        options: ["Canalis nervi hypoglossi (Tilosti nervi kanali - Ensa bo'g'imi yonida)", "Foramen jugulare", "Foramen ovale", "Foramen magnum"],
        correctAnswerIndex: 0,
        explanation: "N. hypoglossus ensa suyagidagi o'zining xususiy kanalidan kalla tashqarisiga chiqadi."
      },
      {
        question: "XI juft nerv (N. accessorius) kalla suyagidan qaysi teshik orqali chiqadi?",
        options: ["Foramen jugulare (Bo'yininturuq teshigi orqali, IX va X nervlar bilan birga)", "Foramen rotundum", "Canalis caroticus", "Porus acusticus internus"],
        correctAnswerIndex: 0,
        explanation: "Foramen jugulare orqali IX, X, XI nervlar va Vena jugularis interna o'tadi."
      },
      {
        question: "Diplopiya nima?",
        options: ["Ko'rish o'qining buzilishi sababli bitta buyumning ikkita bo'lib ko'rinishi (ikkilanish)", "Ko'r bo'lib qolish", "Ko'z qorachig'i kengayishi", "Rang ko'rmaslik"],
        correctAnswerIndex: 0,
        explanation: "Diplopiya ko'z harakatlantiruvchi mushaklar (III, IV yoki VI nerv) falajlanganda paydo bo'ladi."
      },
      {
        question: "Ko'z olmasining konvergensiyasi nima?",
        options: ["Yaqindagi buyumga qaraganda ikkala ko'z soqqasining burun tomonga (ichkariga) bir vaqtda burilishi (m. rectus medialis yordamida)", "Ko'zni yuqoriga ko'tarish", "Ko'zni yumuq tutish", "Qorachiq kengayishi"],
        correctAnswerIndex: 0,
        explanation: "Konvergensiya III nerv nazoratidagi medial to'g'ri mushaklarning birgalikda qisqarishi bilan amalga oshadi."
      },
      {
        question: "Ko'z qorachig'ining akkomodatsiyasi nima?",
        options: ["Yaqindagi yoki uzoqdagi buyumga fokuslash uchun gavhar egriligining siliar mushak (m. ciliaris) qisqarishi orqali o'zgarishi", "Ko'zni tozalash", "Ko'z yoshi ajratish", "Qovoq ochilishi"],
        correctAnswerIndex: 0,
        explanation: "M. ciliaris (III nerv parasimpatik tolalari) qisqarganda Sinn boylamlari bo'shashadi va gavhar qavariqlashib yaqinni aniq ko'rsatadi."
      },
      {
        question: "Argyll Robertson sindromi (Argayl Robertson qorachig'i) nima?",
        options: ["Qorachiqning yorug'likka reaksiyasi yo'qolgan, lekin akkomodatsiya va konvergensiyaga reaksiyasi saqlangan holat (neyrosifilisda)", "To'liq ko'rlik", "Qovoq tushishi", "Ko'z qotishi"],
        correctAnswerIndex: 0,
        explanation: "Klassik Argayl Robertson sindromi o'rta miya pretektal sohasining zararlanishida (zaxmda) uchraydi."
      },
      {
        question: "Kavernoz sinus (Sinus cavernosus) ichidan qaysi nervlar va tomir o'tadi?",
        options: ["III, IV, VI, V1 (ko'z nervi), V2 (yuqori jag' nervi) va Arteria carotis interna", "Faqat orqa miya nervlari", "Faqat yuz nervi", "Faqat vena"],
        correctAnswerIndex: 0,
        explanation: "Sinus cavernosus trombozida ichki uyqu arteriyasi va III, IV, V1, V2, VI nervlar ezilib og'ir oftalmoplegiya yuzaga keladi."
      },
      {
        question: "Nima sababdan VI juft nerv (N. abducens) kalla ichki bosimi oshganda eng birinchi bo'lib zararlanadi?",
        options: ["U kalla asosi suyaklari bo'ylab eng uzun subaraxnoidal intrakranial yo'lni bosib o'tgani sababli bosimga juda sezgir", "U eng yupqa bo'lgani uchun", "U suyak ichida bo'lgani uchun", "U ko'prikda bo'lgani uchun"],
        correctAnswerIndex: 0,
        explanation: "N. abducens kalla suyagi asosida eng uzun masofani bosib o'tadi va dislokatsiyada piramida suyagi qirrasiga oson eziladi."
      },
      {
        question: "Ofitalmoplegiya nima?",
        options: ["Ko'z soqqasini harakatlantiruvchi mushaklarning falajlanishi natijasida ko'zning harakatsiz bo'lib qolishi", "Ko'z yosh oqishi", "Ko'z ichi kataraktasi", "To'r parda ko'chishi"],
        correctAnswerIndex: 0,
        explanation: "Oftalmoplegiya tashqi (skelet mushaklari falaji) yoki ichki (qorachiq/gavhar mushaklari falaji) bo'lishi mumkin."
      },
      {
        question: "Bosh miya nervlarining motor o'zaklaridan qaysilari sof harakatlantiruvchi (somatomotor) guruhga kiradi?",
        options: ["III, IV, VI, XI va XII juft nervlar", "I, II, VIII", "V, VII, IX, X", "Faqat X nerv"],
        correctAnswerIndex: 0,
        explanation: "III, IV, VI, XI, XII nervlar boshlang'ich embrional miotomalardan rivojlangan muskullarni harakatlantiruvchi motor nervlardir."
      },
      {
        question: "Ko'z kosasida qorachiq sfinkterini toraytiruvchi parasimpatik postganglionar tolalar qaysi tugundan chiqadi?",
        options: ["Ganglion ciliare (Kipriksimon tugun) dan nn. ciliares breves orqali", "Ganglion oticum", "Ganglion pterygopalatinum", "Ganglion trigeminale"],
        correctAnswerIndex: 0,
        explanation: "III nervning preganglionar tolalari Ganglion ciliare'da sinaps hosil qiladi va postganglionar tolalar ko'z soqqasiga kiradi."
      },
      {
        question: "Bulbar falaj (Bulbar palsy) bilan Psevdobulbar falaj (Pseudobulbar palsy) ning asosiy farqi nima?",
        options: ["Bulbar falaj - IX, X, XII nervlarning o'zaklari yoki periferik tolalari shikastlanishi (til atrofiyasi, fibrillyatsiyalar bor); Psevdobulbar falaj - ikki tomonlama kortikonuklear yo'llar zararlanishi (til atrofiyasi yo'q, majburiy kulgi/yig'i va oral avtomatizm reflekslari bor)", "Farqi yo'q", "Bulbarda faqat ko'z harakati buziladi", "Psevdobulbarda sezgi yo'qoladi"],
        correctAnswerIndex: 0,
        explanation: "Bulbar falaj uzunchoq miya o'zaklari (periferik) buzilishi bo'lsa, psevdobulbar falaj markaziy piramidal o'tkazuv yo'llarining ikki tomonlama uzilishidir."
      },
      {
        question: "Disfagiya, Disartriya va Disfoniya triadasining ma'nosi nima?",
        options: ["Disfagiya - yutish buzilishi; Disartriya - so'zlarni talaffuz qilish buzilishi; Disfoniya - ovozning bo'g'ilishi yoki yo'qolishi", "Ko'rish, eshitish va hid bilish buzilishi", "Oyoq, qo'l va bel falaji", "Yurak, o'pka va jigar kasalligi"],
        correctAnswerIndex: 0,
        explanation: "Bu triada uzunchoq miya (IX, X, XII nervlar) yoki ularning yo'llari shikastlanganda klassik simptomokompleks hisoblanadi."
      },
      {
        question: "Vena jugularis interna kalla suyagidan chiqishida qaysi nervlar bilan yonma-yon yotadi?",
        options: ["IX (til-halqum), X (adashgan) va XI (qo'shimcha) nervlar bilan Foramen jugulare'da", "I va II nervlar bilan", "III va IV nervlar bilan", "Faqat XII nerv bilan"],
        correctAnswerIndex: 0,
        explanation: "Foramen jugulare sohasidagi jarrohlikda yoki o'smada (glomus jugulare) bu 3 ta nerv va vena birgalikda zararlanadi (Vernet sindromi)."
      },
      {
        question: "Qo'shimcha nervning orqa miya ildizlari (Radices spinales n. accessorii) qayerdan boshlanadi?",
        options: ["C1 - C5/C6 orqa miya segmentlarining oldingi shoxlaridan boshlanib Foramen magnum orqali kalla bo'shlig'iga ko'tariladi", "Ko'prikdan", "Thalamusdan", "Miyachadan"],
        correctAnswerIndex: 0,
        explanation: "XI nerv spinal qismi bo'yin orqa miyasidan boshlanib yuqoriga kalla ichiga kiradi va so'ng foramen jugulare orqali qaytib chiqadi."
      },
      {
        question: "Tilning bir tomonlama atrofiyasi va chuqur burmalanishi qaysi nerv zararlanishining o'ziga xos belgisidir?",
        options: ["XII juft - Nervus hypoglossus (periferik shikastlanishi)", "VII juft nerv", "V juft nerv", "IX juft nerv"],
        correctAnswerIndex: 0,
        explanation: "Tilosti nervi uzilganda til mushaklari trofikasini yo'qotib shu tomonlama atrofiyaga uchraydi va qisqarib burishadi."
      },
      {
        question: "Ko'zning ichki to'g'ri mushagi (m. rectus medialis) bilan tashqi to'g'ri mushagi (m. rectus lateralis) ning o'zaro qarama-qarshi uyg'un harakatini qaysi yo'l ta'minlaydi?",
        options: ["Fasciculus longitudinalis medialis (Medial bo'ylama tutam - III va VI o'zaklarni bog'lovchi yo'l)", "Piramida yo'li", "Spinotalamik yo'l", "Ko'rish radiatsiyasi"],
        correctAnswerIndex: 0,
        explanation: "Medial bo'ylama tutam ko'zlarning birgalikda yonga qarashini sinxronlaydi; zararlansa internuklear oftalmoplegiya bo'ladi."
      },
      {
        question: "Internuklear oftalmoplegiya (INO) ko'pincha qaysi kasallikda uchraydi?",
        options: ["Tarqoq skleroz (Multiple Sclerosis) kasalligida (Fasciculus longitudinalis medialis demielinizatsiyasi tufayli)", "Grippda", "Gastritda", "Radikulitda"],
        correctAnswerIndex: 0,
        explanation: "Tarqoq sklerozda FLM zararlanib, bir ko'z ichkariga bura olmaydi, ikkinchi ko'zda esa nistagm kuzatiladi."
      },
      {
        question: "Ko'z qorachig'ining bevosita va hamdo'stlik (konsensual) yorug'lik refleksi nimani ko'rsatadi?",
        options: ["Bitta ko'zga yorug'lik tushirilganda ikkala ko'z qorachig'ining bir vaqtda torayishini (II va III nervlar butunligini)", "Ko'zning charchaganini", "Ko'rlikni", "Ko'z yoshini"],
        correctAnswerIndex: 0,
        explanation: "Yorug'lik tushirilgan ko'z (bevosita) va ikkinchi ko'z (konsensual) torayadi, chunki pretektal sohadan ikkala Edinger-Vestfal o'zagiga signal boradi."
      },
      {
        question: "G'altaksimon nerv (IV juft) ning boshqa barcha bosh miya nervlaridan farq qiluvchi ikkita asosiy xususiyati qaysi?",
        options: ["1) Miya poyasining dorsal (orqa) yuzasidan chiqadi, 2) Kalla ichida to'liq kesishadi", "Eng qalin nerv", "Faqat sezuvchi", "Suyakdan chiqmaydi"],
        correctAnswerIndex: 0,
        explanation: "N. trochlearis dorsal tomondan chiquvchi va kalla ichida to'liq kesishuvchi yagona nervdir."
      }
    ]
  },

  // ==========================================
  // TOPIC 10 (Order 110 / S3-10): V juft bosh miya nervi. Parasimpatik tugunlar
  // ==========================================
  {
    topicOrder: 110,
    topicKeywords: ["v juft", "nervus trigeminus", "uch shoxli", "ganglion trigeminale", "ophthalmicus", "maxillaris", "mandibularis", "ciliare", "pterygopalatinum", "oticum", "submandibulare"],
    quizzes: [
      {
        question: "V juft - Uch shoxli nerv (Nervus trigeminus) qanday anatomik xarakterga ega?",
        options: ["Aralash nerv (yuz va kalla terisi hamda shilliq qavatlarining bosh sezuvchi nervi va chaynov mushaklarining harakatlantiruvchi nervi)", "Faqat harakatlantiruvchi", "Faqat sezuvchi", "Faqat hid biluvchi"],
        correctAnswerIndex: 0,
        explanation: "Uch shoxli nerv bosh sohasining asosiy sezuvchi poyasi bo'lib, uning 3-shoxi tarkibida motor chaynov tolalari ham bor."
      },
      {
        question: "Uch shoxli nervning sezuvchi tuguni (Ganglion trigeminale / Gasser tuguni) qayerda joylashgan?",
        options: ["Chakka suyagi piramidasi cho'qqisining oldingi yuzasidagi Meckel bo'shlig'ida (Impressio trigemini)", "Ko'z kosasida", "Qanot-tanglay chuqurchasida", "Jag' ostida"],
        correctAnswerIndex: 0,
        explanation: "Gasser tuguni kalla suyagining o'rta chuqurchasida qattiq parda cho'ntagida yotadi va 1-neyronlarni saqlaydi."
      },
      {
        question: "Uch shoxli nerv Gasser tugunidan so'ng qanday 3 ta asosiy shoxga bo'linadi?",
        options: ["1) Nervus ophthalmicus (V1 - ko'z nervi), 2) Nervus maxillaris (V2 - yuqori jag' nervi), 3) Nervus mandibularis (V3 - pastki jag' nervi)", "Katta, o'rta, kichik shox", "Tashqi, ichki, orqa shox", "Yuz, til, tanglay nervi"],
        correctAnswerIndex: 0,
        explanation: "V1 - ko'z kosasiga, V2 - yuqori jag'ga, V3 - pastki jag' va chaynov mushaklariga boradi."
      },
      {
        question: "V1 - Ko'z nervi (Nervus ophthalmicus) kalla suyagidan qaysi teshik orqali chiqadi va uning xarakteri qanday?",
        options: ["Fissura orbitalis superior (Yuqori ko'z kosasi yorig'i) orqali; u sof sezuvchi nervdir", "Canalis opticus orqali", "Foramen rotundum orqali", "Foramen ovale orqali"],
        correctAnswerIndex: 0,
        explanation: "N. ophthalmicus peshona, yuqori qovoq, burun orqasi, ko'z soqqasi va shox pardani sezgi bilan ta'minlaydi."
      },
      {
        question: "V2 - Yuqori jag' nervi (Nervus maxillaris) kalla suyagidan qaysi teshik orqali chiqadi?",
        options: ["Foramen rotundum (Dumaloq teshik) orqali Fossa pterygopalatina'ga chiqadi", "Foramen ovale", "Foramen spinosum", "Fissura orbitalis superior"],
        correctAnswerIndex: 0,
        explanation: "N. maxillaris dumaloq teshikdan qanot-tanglay chuqurchasiga o'tib yuqori tishlar, lunj va tanglayni sezgi bilan ta'minlaydi."
      },
      {
        question: "V3 - Pastki jag' nervi (Nervus mandibularis) kalla suyagidan qaysi teshik orqali chiqadi va qanday xarakterga ega?",
        options: ["Foramen ovale (Tuxumsimon teshik) orqali chiqadi va u ARALASH (sezuvchi + motor) nervdir", "Foramen rotundum orqali", "Foramen jugulare orqali", "Canalis caroticus orqali"],
        correctAnswerIndex: 0,
        explanation: "N. mandibularis aralash nerv bo'lib, uning motor tolalari chaynov mushaklariga boradi."
      },
      {
        question: "V3 (Pastki jag' nervi) qaysi chaynov mushaklarini innervatsiya qiladi?",
        options: ["Musculus masseter, Musculus temporalis, Musculus pterygoideus medialis va Musculus pterygoideus lateralis", "Mimika mushaklarini", "Til mushaklarini", "Hiqildoq mushaklarini"],
        correctAnswerIndex: 0,
        explanation: "Pastki jag' nervining motor shoxlari barcha 4 juft chaynov mushaklarini hamda m. mylohyoideus va m. tensor tympani'ni ta'minlaydi."
      },
      {
        question: "Uch shoxli nerv nevralgiyasi (Neuralgia n. trigemini / Fothergill kasalligi) qanday namoyon bo'ladi?",
        options: ["Yuz yarmida (odatda V2 yoki V3 bo'ylab) to'satdan paydo bo'ladigan o'tkir, xanjar urilgandek yoki elektr toki urgandek chidab bo'lmas qisqa og'riq xurujlari (trigger zonalarga tegilganda)", "Doimiy simillovchi bosh og'rig'i", "Yuz falajlanib qolishi", "Ko'z ko'rmay qolishi"],
        correctAnswerIndex: 0,
        explanation: "Trigeminal nevralgiya insoniyatga ma'lum eng kuchli og'riqlardan biri bo'lib, tish tozalash, yuvinish yoki shamol esishida qo'zg'aladi."
      },
      {
        question: "Shox parda refleksi (Korneal refleks - ko'z shox pardasiga paxta tekkanda ikkala ko'zning yumilishi) qaysi nervlar orqali amalga oshadi?",
        options: ["Afferent (sezuvchi) yo'l - V1 (N. ophthalmicus / N. nasociliaris), Efferent (harakat) yo'l - VII (Nervus facialis - m. orbicularis oculi)", "Afferent - II nerv, Efferent - III nerv", "Afferent - VII nerv, Efferent - V nerv", "Afferent - VIII nerv, Efferent - XII nerv"],
        correctAnswerIndex: 0,
        explanation: "Korneal refleks reanimatsiyada miya o'limi va koma chuqurligini baholashda asosiy reflekslardan biridir."
      },
      {
        question: "Jag' refleksi (Mandibulyar refleks - iyakka bolg'acha urilganda pastki jag'ning ko'tarilishi) qaysi nerv orqali tutashadi?",
        options: ["V3 (Nervus mandibularis) orqali ham sezuvchi, ham harakatlantiruvchi yo'llar", "VII nerv orqali", "XII nerv orqali", "IX nerv orqali"],
        correctAnswerIndex: 0,
        explanation: "Jag' refleksi mono-sinaptik bo'lib, to'liq V juft nerv orqali ko'prikda tutashadi."
      },
      {
        question: "Til nervi (Nervus lingualis - V3 shoxi) tilning qaysi qismini sezgi bilan ta'minlaydi?",
        options: ["Til oldingi 2/3 qismining umumiy somatik sezgisini (og'riq, harorat, taktil)", "Til orqa 1/3 qismini", "Til ildizini", "Faqat ta'm bilishni"],
        correctAnswerIndex: 0,
        explanation: "N. lingualis til oldingi 2/3 qismiga umumiy taktil va og'riq sezgisini beradi (ta'm esa unga qo'shiluvchi Chorda tympani orqali o'tadi)."
      },
      {
        question: "Pastki alveolyar nerv (Nervus alveolaris inferior - V3 shoxi) qayerga kiradi va stomatologiyada qanday anesteziya qilinadi?",
        options: ["Foramen mandibulae orqali pastki jag' kanaliga (Canalis mandibulae) kiradi; stomatologiyada pastki tishlarni og'riqsizlantirish uchun Torusal / Mandibulyar anesteziya qilinadi", "Ko'z kosasiga kiradi", "Tanglayga kiradi", "Burunga kiradi"],
        correctAnswerIndex: 0,
        explanation: "N. alveolaris inferior pastki barcha tishlarni sezgi bilan ta'minlaydi va jag' suyagidan foramen mentale orqali n. mentalis bo'lib chiqadi."
      },
      {
        question: "Kipriksimon tugun (Ganglion ciliare) V nervning qaysi shoxi yo'nalishida joylashgan?",
        options: ["V1 (Nervus ophthalmicus / N. nasociliaris) yo'nalishida, ko'z kosasida ko'rish nervining lateralida", "V2 yo'nalishida", "V3 yo'nalishida", "Jag' ostida"],
        correctAnswerIndex: 0,
        explanation: "Ganglion ciliare ko'z kosasida yotadi; unga III nervdan parasimpatik tolalar keladi."
      },
      {
        question: "Qanot-tanglay tuguni (Ganglion pterygopalatinum) qayerda joylashgan va unga qaysi nervdan sekretor parasimpatik tolalar keladi?",
        options: ["Fossa pterygopalatina chuqurchasida V2 (n. maxillaris) yo'nalishida yotadi; unga VII nervdan (n. petrosus major orqali) ko'z yoshi bezi va burun bezlari uchun sekretor tolalar keladi", "Ko'z kosasida", "Quloq yonida", "Til ostida"],
        correctAnswerIndex: 0,
        explanation: "Ganglion pterygopalatinum ko'z yoshi bezi (glandula lacrimalis), burun va tanglay shilliq bezlarining sekretor boshqaruv markazidir."
      },
      {
        question: "Quloq tuguni (Ganglion oticum) qayerda yotadi va qaysi bezning sekretsiyasini ta'minlaydi?",
        options: ["Foramen ovale ostida V3 yo'nalishida yotadi; unga IX nervdan (n. petrosus minor orqali) Quloq oldi so'lak bezi (Glandula parotidea) uchun parasimpatik sekretor tolalar keladi", "Jag' osti bezi uchun", "Ko'z yoshi bezi uchun", "Qalqonsimon bez uchun"],
        correctAnswerIndex: 0,
        explanation: "Ganglion oticum quloq oldi bezi (Glandula parotidea) innervatsiyasini n. auriculotemporalis orqali ta'minlaydi."
      },
      {
        question: "Jag' osti tuguni (Ganglion submandibulare) qaysi bezlarni sekretor parasimpatik tola bilan ta'minlaydi?",
        options: ["Jag' osti (Glandula submandibularis) va Til osti (Glandula sublingualis) so'lak bezlarini (VII nerv Chorda tympani tolalari orqali)", "Quloq oldi bezini", "Ko'z yoshi bezini", "Ter bezlarini"],
        correctAnswerIndex: 0,
        explanation: "Ganglion submandibulare va sublinguale VII juft nerv tolalari orqali jag' osti va til osti so'lak bezlarini so'lak ajratishga undaydi."
      },
      {
        question: "Uch shoxli nervning bosh miya poyasidagi o'zaklari nechta?",
        options: ["4 ta o'zak: 3 ta sezuvchi (Nucleus mesencephalicus, Nucleus principalis/pontinus, Nucleus spinalis) va 1 ta harakatlantiruvchi (Nucleus motorius)", "Faqat 1 ta o'zak", "2 ta o'zak", "6 ta o'zak"],
        correctAnswerIndex: 0,
        explanation: "V nerv butun miya poyasi bo'ylab cho'zilgan 3 ta sensor o'zakka (o'rta miya, ko'prik va spinal o'zak) hamda ko'prikdagi motor o'zakka ega."
      },
      {
        question: "Uch shoxli nervning orqa miya o'zagi (Nucleus spinalis n. trigemini) qanday sezgilarni qabul qiladi?",
        options: ["Yuz va bosh sohasidan og'riq va harorat sezgilarini (C2-C3 orqa miya segmentlarigacha tushadi)", "Faqat chuqur sezgini", "Faqat ta'm sezgisini", "Faqat motor buyruqni"],
        correctAnswerIndex: 0,
        explanation: "Nucleus spinalis spinotalamik yo'l analogi bo'lib, yuzdagi o'tkir og'riq va haroratni tahlil qiladi."
      },
      {
        question: "Uch shoxli nervning o'rta miya o'zagi (Nucleus mesencephalicus n. trigemini) ning o'ziga xos xususiyati nima?",
        options: ["U chaynov mushaklari va periodontdan proprioseptiv sezgini qabul qiladi va uning 1-neyron tanalari to'g'ridan-to'g'ri markaziy nerv tizimida (o'rta miyada) yotadi (Gasser tugunida emas)", "Faqat ko'rishni ta'minlaydi", "Faqat so'lak ajratadi", "Orqa miyada yotadi"],
        correctAnswerIndex: 0,
        explanation: "Bu o'zak inson tanasidagi yagona holat bo'lib, 1-sensor neyron tanalari periferik gangliyada emas, to'g'ridan-to'g'ri CNS ichida yotadi."
      },
      {
        question: "Uch shoxli nervning asosiy ko'prik o'zagi (Nucleus principalis / pontinus) nimani qabul qiladi?",
        options: ["Yuzdan nozik epikritik taktil va teginish hamda bosim sezgilarini", "Faqat olovdek issiqlikni", "Faqat sovuqlikni", "Faqat motor impulslarni"],
        correctAnswerIndex: 0,
        explanation: "Nucleus principalis ko'prikda yotib Goll/Burdax analogi sifatida yuzning nozik taktil sezgisini talamusga uzatadi."
      },
      {
        question: "Zeldera zonalari (Segmentar yuz anesteziyasi) nima?",
        options: ["Nucleus spinalis n. trigemini qismlari zararlanganda yuzda konsentrik doiralar (og'iz-burun atrofidan quloqqa tomon) shaklida sezgi buzilishi", "Bo'yinda sezgi yo'qolishi", "Ko'krakda dog'lar paydo bo'lishi", "Qo'l falaji"],
        correctAnswerIndex: 0,
        explanation: "Spinal o'zakning kaudal qismi zararlansa yuzning tashqi doirasi, kranial qismi zararlansa og'iz-burun (markaziy) doirasi sezgisini yo'qotadi."
      },
      {
        question: "Quloq-chakka nervi (Nervus auriculotemporalis - V3 shoxi) qaysi sohalarni innervatsiya qiladi?",
        options: ["Chakka sohasi terisini, tashqi eshituv yo'lini, nog'ora pardaning tashqi yuzasini, chakka-pastki jag' bo'g'imini va quloq oldi beziga parasimpatik tolalarni yetkazadi", "Faqat tishlarni", "Faqat tilni", "Faqat peshonani"],
        correctAnswerIndex: 0,
        explanation: "N. auriculotemporalis chakka suyagi va bo'g'im sohasini sezgi bilan ta'minlaydi (Frey sindromi shu nerv bilan bog'liq)."
      },
      {
        question: "Frey sindromi (Quloq-chakka sindromi / Lyusit Frey sindromi) nima?",
        options: ["Ovqat yeganda yoki taom hidini bilganda quloq oldi va chakka terisida kuchli terlash va qizarish paydo bo'lishi (parotidektomiyadan so'ng so'lak tolalari ter bezlariga noto'g'ri o'sib kirishi)", "Til falaji", "Ko'rlik", "Tish to'kilishi"],
        correctAnswerIndex: 0,
        explanation: "Quloq oldi bezi operatsiyasidan so'ng parasimpatik sekretor tolalar teri ter bezlariga noto'g'ri regeneratsiya bo'lib chakka terlashini chaqiradi."
      },
      {
        question: "Ko'z usti nervi (Nervus supraorbitalis - V1 shoxi) qaysi teshikdan chiqadi?",
        options: ["Foramen / Incisura supraorbitalis (Ko'z kosasining yuqori chetidagi teshikdan)", "Foramen infraorbitale", "Foramen mentale", "Canalis incisivus"],
        correctAnswerIndex: 0,
        explanation: "N. supraorbitalis peshona suyagi ustki qirrasidan chiqib peshona va bosh tepa terisini sezgi bilan ta'minlaydi."
      },
      {
        question: "Ko'z osti nervi (Nervus infraorbitalis - V2 shoxi) qaysi teshikdan yuzga chiqadi?",
        options: ["Foramen infraorbitale (Yuqori jag' suyagining ko'z osti teshigidan)", "Foramen mentale", "Foramen supraorbitale", "Foramen ovale"],
        correctAnswerIndex: 0,
        explanation: "N. infraorbitalis pastki qovoq, burun qanoti va yuqori lab terisini innervatsiya qiluvchi 'Kichik g'oz panjasi' (Pes anserinus minor) ni hosil qiladi."
      },
      {
        question: "Iyak nervi (Nervus mentalis - V3 shoxi) qaysi teshikdan chiqadi?",
        options: ["Foramen mentale (Pastki jag'ning iyak teshigidan - 1-2 premolyar tishlar tubi sathida)", "Foramen mandibulae", "Foramen infraorbitale", "Foramen lacerum"],
        correctAnswerIndex: 0,
        explanation: "N. mentalis iyak va pastki lab terisi hamda shilliq qavatini sezgi bilan ta'minlaydi."
      },
      {
        question: "Uch shoxli nervning 'Trigger nuqtalari' (Vale nuqtalari) kalla suyagida qaysi 3 ta teshikka to'g'ri keladi?",
        options: ["1) Foramen supraorbitale (V1), 2) Foramen infraorbitale (V2), 3) Foramen mentale (V3)", "Ensa teshiklariga", "Bo'yininturuq teshigiga", "Quloq teshigiga"],
        correctAnswerIndex: 0,
        explanation: "Nevralgiyada ushbu 3 ta suyak teshigi usti bosilganda bemorda o'tkir og'riq xuruji paydo bo'ladi."
      },
      {
        question: "Nog'ora pardani tortuvchi mushak (Musculus tensor tympani) qaysi nervdan motor innervatsiya oladi?",
        options: ["V3 - Nervus mandibularis'dan (Nervus tensoris tympani orqali)", "VII nervdan", "VIII nervdan", "IX nervdan"],
        correctAnswerIndex: 0,
        explanation: "M. tensor tympani bolg'acha dastasini ichkariga tortib pardani taranglaydi va V3 tomonidan innervatsiya qilinadi."
      },
      {
        question: "Yumshoq tanglayni taranglovchi mushak (Musculus tensor veli palatini) qaysi nervdan innervatsiya oladi?",
        options: ["V3 - Nervus mandibularis'dan (Nervus tensoris veli palatini orqali)", "X juft nervdan", "VII nervdan", "XII nervdan"],
        correctAnswerIndex: 0,
        explanation: "Yumshoq tanglayning barcha mushaklari X nervdan innervatsiya oladi, FAQAT m. tensor veli palatini V3 nervidan innervatsiya oladi."
      },
      {
        question: "Uch shoxli nerv motor ildizi falajlanganda pastki jag' ochilganda qaysi tomonga og'adi?",
        options: ["Kasal (falajlangan) tomonga og'adi (chunki sog' tomonning m. pterygoideus lateralis mushagi jag'ni oldinga va kasal tomonga suradi)", "Sog' tomonga og'adi", "Umuman og'maydi", "Orqaga ketadi"],
        correctAnswerIndex: 0,
        explanation: "Lateral qanotsimon mushak zaifligi sababli og'iz ochilganda pastki jag' falajlangan tomon tomonga suriladi."
      }
    ]
  },

  // ==========================================
  // TOPIC 11 (Order 111 / S3-11): VII, IX va X juft bosh miya nervlari
  // ==========================================
  {
    topicOrder: 111,
    topicKeywords: ["vii juft", "ix juft", "x juft", "nervus facialis", "nervus glossopharyngeus", "nervus vagus", "yuz nervi", "til-halqum", "adashgan", "bell falaji"],
    quizzes: [
      {
        question: "VII juft - Yuz nervi (Nervus facialis / Nervus intermediofacialis) qanday asosiy tolalardan iborat va nimani innervatsiya qiladi?",
        options: ["Aralash nerv: asosiy motor tolalari barcha yuz mimika mushaklarini, oraliq nerv (n. intermedius) esa til 2/3 qismi ta'mini va ko'z yoshi/so'lak bezlarini innervatsiya qiladi", "Faqat ko'rishni ta'minlaydi", "Faqat chaynov mushaklarini", "Faqat terini"],
        correctAnswerIndex: 0,
        explanation: "Yuz nervi yuz ifodalarini yaratuvchi barcha mimika mushaklarini, platysma, m. stylohyoideus, m. stapedius va digastricus orqa qornini harakatlantiradi."
      },
      {
        question: "Yuz nervi (VII) kalla suyagiga kirish va chiqish yo'llari qaysilar?",
        options: ["Porus acusticus internus (ichki eshituv teshigi) dan kirib, Canalis facialis (Fallopiy kanali) dan o'tadi va Foramen stylomastoideum (bizg'ich-so'rg'ichsimon teshik) dan kalla tashqarisiga chiqadi", "Foramen ovale'dan kiradi", "Foramen rotundum'dan chiqadi", "Canalis opticus'dan o'tadi"],
        correctAnswerIndex: 0,
        explanation: "VII nerv chakka suyagi piramidasi ichidagi Fallopiy kanalini to'liq bosib o'tib foramen stylomastoideum'dan yuzga chiqadi."
      },
      {
        question: "Yuz nervining 'Katta g'oz panjasi' (Plexus parotideus / Pes anserinus major) qayerda hosil bo'ladi va qanday shoxlarga bo'linadi?",
        options: ["Quloq oldi bezi (Glandula parotidea) qalinligida hosil bo'lib: 1) Rami temporales, 2) Rami zygomatici, 3) Rami buccales, 4) Ramus marginalis mandibulae, 5) Ramus colli shoxlariga bo'linadi", "Ko'z kosasida", "Til tagida", "Ensa sohasida"],
        correctAnswerIndex: 0,
        explanation: "Parotid chigalidan 5 guruhga ajralgan motor shoxlar yelpig'ichsimon tarqalib butun yuz mimika mushaklariga boradi."
      },
      {
        question: "Bell falaji (Bell's palsy / Yuz nervining periferik nevropatiyasi) da qanday klinik belgilar kuzatiladi?",
        options: ["Zararlangan tomonda: peshona burmalari tekislanadi, ko'z to'liq yumilmaydi (Lagoftalm / 'Quyon ko'zi'), og'iz burchagi pastga tushadi va og'izdan suv oqadi", "Faqat oyoq falaji", "Ko'rlik", "Eshitishning kuchayishi"],
        correctAnswerIndex: 0,
        explanation: "VII nerv to'liq falajida yuzning butun yarmi mimikasi (ham yuqori, ham pastki qavati) yo'qolib yuz asimmetrik bo'lib qoladi."
      },
      {
        question: "Lagoftalm (Lagophthalmus / 'Quyon ko'zi') nima?",
        options: ["Musculus orbicularis oculi (ko'zning aylanma mushagi) falajlangani sababli ko'z qovoqlarining to'liq yopila olmasligi", "Ko'zning doimiy yumilib turishi", "Qorachiq torayishi", "Ko'zning qizarishi"],
        correctAnswerIndex: 0,
        explanation: "VII nerv falajida ko'z ochiq qoladi; ko'zni yumishga uringanda ko'z soqqasi yuqoriga buriladi (Bell fenomeni)."
      },
      {
        question: "Yuz nervi Fallopiy kanalida zararlanganda qanday qo'shimcha belgilar paydo bo'lishi mumkin?",
        options: ["Giperakuziya (m. stapedius falaji tufayli qattiq jarangdor eshitish), ko'z yosh oqmasligi (quruq ko'z) va til oldingi 2/3 qismida ta'm bilmaslik (Agevziya)", "Ko'rlik", "Yutish buzilishi", "Oyoq falaji"],
        correctAnswerIndex: 0,
        explanation: "Kanal ichida n. petrosus major, n. stapedius va chorda tympani ajralishidan yuqorida zararlansa ta'm, ko'z yoshi va eshitish o'zgaradi."
      },
      {
        question: "Nog'ora tora (Chorda tympani - VII nerv tarmog'i) qanday tolalarni tashiydi?",
        options: ["Til oldingi 2/3 qismidan ta'm sezgisini (Ganglion geniculi'ga) va jag' osti/til osti so'lak bezlariga parasimpatik sekretor tolalarni", "Faqat motor tolalarni", "Faqat umumiy og'riqni", "Faqat hid bilishni"],
        correctAnswerIndex: 0,
        explanation: "Chorda tympani o'rta quloq bo'shlig'i orqali o'tib n. lingualis'ga qo'shiladi va ta'm hamda so'lak ajralishini ta'minlaydi."
      },
      {
        question: "IX juft - Til-halqum nervi (Nervus glossopharyngeus) qanday vazifalarni bajaradi?",
        options: ["Aralash nerv: Til orqa 1/3 qismining ta'm va umumiy sezgisini, halqum shilliq qavati sezgisini, m. stylopharyngeus motorikasini va Quloq oldi bezi sekretsiyasini (n. petrosus minor orqali) ta'minlaydi", "Faqat til harakatini", "Faqat ko'rishni", "Faqat yurak urishini"],
        correctAnswerIndex: 0,
        explanation: "IX nerv halqum va til orqasini innervatsiya qiladi hamda quloq oldi bezi (parotis) sekretsiyasini boshqaradi."
      },
      {
        question: "IX juft nervning Sinokarotid tarmog'i (Ramus sinus carotici / Gering nervi) nimani innervatsiya qiladi va nimaga javobgar?",
        options: ["Sinus caroticus (baroretseptorlar - qon bosimi nazorati) va Glomus caroticum (xemoreseptorlar - qondagi O2, CO2 va pH nazorati)", "Yurak qopqoqlarini", "O'pka alveolalarini", "Miya po'stlog'ini"],
        correctAnswerIndex: 0,
        explanation: "Gering nervi umumiy uyqu arteriyasi ayrisidagi retseptorlardan qon bosimi va gazlar tarkibi to'g'risida markazga signal beradi."
      },
      {
        question: "Halqum refleksi (Yutqun refleksi / Gag reflex - tomoq orqa devoriga shpatel tekkanda qusish harakati paydo bo'lishi) qaysi nervlar orqali amalga oshadi?",
        options: ["Afferent (sezuvchi) yo'l - IX (Nervus glossopharyngeus), Efferent (harakat) yo'l - X (Nervus vagus)", "Afferent - V nerv, Efferent - VII nerv", "Afferent - XII nerv, Efferent - XI nerv", "Afferent - X nerv, Efferent - IX nerv"],
        correctAnswerIndex: 0,
        explanation: "Gag refleksi IX (sezgi) va X (halqum mushaklari qisqarishi) nervlarining uzunchoq miyadagi o'zaro aloqasi bilan ta'minlanadi."
      },
      {
        question: "X juft - Adashgan nerv (Nervus vagus) ning anatomik chegarasi qayergacha yetadi?",
        options: ["Bosh miyadan boshlanib bo'yin, ko'krak qafasi va qorin bo'shlig'i a'zolarini (to yo'g'on ichakning chap burchagi - Cannon-Bohm nuqtasigacha) innervatsiya qiladi", "Faqat bo'yingacha", "Faqat yurakkacha", "Butun oyoq barmoqlarigacha"],
        correctAnswerIndex: 0,
        explanation: "Adashgan nerv eng uzun bosh miya nervi bo'lib, parasimpatik tolalari orqali deyarli barcha ichki a'zolarni ta'minlaydi."
      },
      {
        question: "Adashgan nerv (X juft) ning parasimpatik o'zagi qaysi?",
        options: ["Nucleus dorsalis nervi vagi (Rombsimon chuqurchada joylashgan)", "Nucleus ambiguus", "Nucleus solitarius", "Nucleus salivatorius"],
        correctAnswerIndex: 0,
        explanation: "Nucleus dorsalis n. vagi yurak, bronxlar, qizilo'ngach, oshqozon va ichaklarga parasimpatik tola yuboruvchi asosiy o'zakdir."
      },
      {
        question: "Ikkilamchi o'zak (Nucleus ambiguus) qaysi nervlarning umumiy harakatlantiruvchi o'zagi hisoblanadi?",
        options: ["IX (til-halqum), X (adashgan) va XI (qo'shimcha) nervlarning halqum, hiqildoq va yumshoq tanglay mushaklarini innervatsiya qiluvchi o'zagi", "V va VII nervlarning", "III, IV, VI nervlarning", "Faqat XII nervning"],
        correctAnswerIndex: 0,
        explanation: "Nucleus ambiguus uzunchoq miyada yotib yutish va ovoz hosil qilish mushaklarini boshqaradi."
      },
      {
        question: "Yolg'iz yo'l o'zagi (Nucleus tractus solitarii) qanday sezuvchi o'zak hisoblanadi?",
        options: ["VII, IX va X juft nervlarning umumiy TA'M BILISH va visseral sezuvchi o'zagi", "Faqat eshitish o'zagi", "Faqat ko'rish o'zagi", "Faqat motor o'zak"],
        correctAnswerIndex: 0,
        explanation: "VII (til 2/3), IX (til 1/3) va X (epiglottis) ta'm tolalari Nucleus solitarius'da birlashadi."
      },
      {
        question: "Qaytuvchi hiqildoq nervi (Nervus laryngeus recurrens - X shoxi) qaysi tuzilmalarni aylanib o'tadi?",
        options: ["O'ng tomonda - Arteria subclavia dextra'ni; Chap tomonda - Aorta ravog'ini (Arcus aortae) aylanib qaytadi", "O'ngda yurakni, chapda o'pkani", "Ikkala tomonda uyqu arteriyasini", "Qovurg'alarni"],
        correctAnswerIndex: 0,
        explanation: "Chap qaytuvchi nerv aorta ravog'ini aylanib o'tgani sababli aorta anevrizmasi yoki ko'ks oralig'i o'smasida ezilib ovoz bo'g'ilishini (disfoniya) chaqiradi."
      },
      {
        question: "Qaytuvchi hiqildoq nervlari (Nn. laryngei recurrentes) hiqildoqning qaysi mushaklarini innervatsiya qiladi?",
        options: ["Hiqildoqning deyarli barcha xususiy mushaklarini (ovoz boylamlarini ochuvchi va yopuvchi - m. cricothyroideus'dan tashqari)", "Faqat til mushaklarini", "Bo'yin terisini", "Yurak mushagini"],
        correctAnswerIndex: 0,
        explanation: "Qalqonsimon bez operatsiyasida (strumektomiya) qaytuvchi nerv jarohatlansa ovoz bo'g'iladi; ikki tomonlama uzilsa asfiksiya (bo'g'ilish) yuz beradi."
      },
      {
        question: "Yuqori hiqildoq nervining tashqi shoxi (Ramus externus n. laryngei superioris) qaysi yagona hiqildoq mushagini innervatsiya qiladi?",
        options: ["Musculus cricothyroideus (Uzuksimon-qalqonsimon mushak - ovoz boylamlarini taranglovchi)", "Musculus cricoarytenoideus posterior", "Musculus vocalis", "Musculus thyroarytenoideus"],
        correctAnswerIndex: 0,
        explanation: "M. cricothyroideus ovoz boylamlarini taranglaydi va n. laryngeus superior tashqi shoxi tomonidan ta'minlanadi."
      },
      {
        question: "Adashgan nervning yurakka ta'siri qanday?",
        options: ["Yurak qisqarishlar sonini sekinlashtiradi (bradikardiya), AV o'tkazuvchanlikni pasaytiradi va qo'zg'aluvchanlikni tormozlaydi", "Yurakni tezlashtiradi (taxikardiya)", "Qon bosimini oshiradi", "Tomirlarni toraytiradi"],
        correctAnswerIndex: 0,
        explanation: "Nervus vagus yurak faoliyatini tormozlovchi asosiy parasimpatik nervdir (Asetilxolin orqali M2 xolinoretseptorlarga ta'sir qiladi)."
      },
      {
        question: "Vagotonik hushdan ketish (Vazovagal sinkope) nima sababdan yuz beradi?",
        options: ["Adashgan nervning to'satdan haddan tashqari faollashuvi natijasida o'tkir bradikardiya va qon bosimi tushishi (bosh miya gipoksiyasi)", "Qon ketishi", "Miya qon quyilishi", "Yurak infarkti"],
        correctAnswerIndex: 0,
        explanation: "Kuchli qo'rquv, og'riq yoki qon ko'rganda n. vagus qo'zg'alib tomirlar kengayadi, puls pasayadi va odam hushidan ketadi."
      },
      {
        question: "Adashgan nervning quloq shoxi (Ramus auricularis n. vagi / Arnold nervi) qayerda yotadi?",
        options: ["Tashqi eshituv yo'lining orqa devori va nog'ora parda tashqi yuzasida (paxta bilan tozalaganda yo'tal refleksi chaqirishi mumkin)", "Ichki quloqda", "Quloq suprasi oldida", "Burun ichida"],
        correctAnswerIndex: 0,
        explanation: "Quloq yo'liga shpatel yoki paxta tiqilganda yo'tal paydo bo'lishi Arnold nervi reflektor qo'zg'alishi sabablidir."
      },
      {
        question: "Yumshoq tanglayning barcha mushaklarini (m. tensor veli palatini'dan tashqari) qaysi nerv innervatsiya qiladi?",
        options: ["Nervus vagus (X juft nerv - Plexus pharyngeus orqali)", "Nervus facialis", "Nervus trigeminus", "Nervus hypoglossus"],
        correctAnswerIndex: 0,
        explanation: "N. vagus m. levator veli palatini, m. uvulae va tanglay-halqum mushaklarini harakatlantiradi."
      },
      {
        question: "X juft nerv bir tomonlama zararlanganda yumshoq tanglay tilchasi (Uvula) qaysi tomonga og'adi?",
        options: ["SOG' (sog'lom) tomonga og'adi (chunki sog' tomon mushagi tilchani o'ziga tortadi, falajlangan tomon osilib qoladi)", "Kasal tomonga og'adi", "To'g'ri turadi", "Orqaga qayriladi"],
        correctAnswerIndex: 0,
        explanation: "Tanglay osilib, bemor 'A' deganda tilcha sog'lom tomonga tortiladi; suyuq ovqat burundan chiqib ketishi mumkin."
      },
      {
        question: "Tilning ta'm bilish innervatsiyasi qanday taqsimlangan?",
        options: ["Til oldingi 2/3 qismi - VII juft (Chorda tympani); Til orqa 1/3 qismi - IX juft (N. glossopharyngeus); Til ildizi va hiqildoq usti - X juft (N. vagus)", "Butun til - V juft", "Butun til - XII juft", "Butun til - I juft"],
        correctAnswerIndex: 0,
        explanation: "Ta'm analizatori 3 ta kranial nerv (VII, IX, X) orqali nucleus tractus solitarii'ga axborot yetkazadi."
      },
      {
        question: "Tilning umumiy (og'riq, harorat, taktil) sezgi innervatsiyasi qanday taqsimlangan?",
        options: ["Til oldingi 2/3 qismi - V3 (N. lingualis); Til orqa 1/3 qismi - IX juft (N. glossopharyngeus); Til ildizi - X juft (N. vagus)", "Faqat XII nerv", "Faqat VII nerv", "Faqat VIII nerv"],
        correctAnswerIndex: 0,
        explanation: "Umumiy somatosensor sezgi oldinda V3 nerviga, orqa 1/3 qismda esa to'liq IX nervga tegishlidir."
      },
      {
        question: "IX juft nerv (N. glossopharyngeus) kalla suyagidan qaysi teshik orqali chiqadi?",
        options: ["Foramen jugulare (Bo'yininturuq teshigi orqali, X va XI nervlar bilan birga)", "Foramen lacerum", "Foramen ovale", "Canalis caroticus"],
        correctAnswerIndex: 0,
        explanation: "IX, X va XI nervlar foramen jugulare orqali kalla suyagidan bo'yinga chiqadi."
      },
      {
        question: "Til-halqum nevralgiyasi (Neuralgia n. glossopharyngei) qanday og'riq beradi?",
        options: ["Yutganda yoki chaynaganda bodomsimon bez, tomoq, til tubi va quloq chuqurligiga tarqaluvchi o'tkir xurujli og'riq", "Peshona og'rig'i", "Tish og'rig'i", "Ko'z og'rig'i"],
        correctAnswerIndex: 0,
        explanation: "IX nerv nevralgiyasi ovqat yutishda tomoq va quloq tubida chidab bo'lmas sanchuvchi xurujlar beradi."
      },
      {
        question: "Ramsay Hunt sindromi (Herpes Zoster Oticus) da nima sodir bo'ladi?",
        options: ["Yuz nervi tizza tugunining (Ganglion geniculi) virusli zararlanishi natijasida quloq suprasida toshmalar, quloqda kuchli og'riq va yuz mimika mushaklarining bir tomonlama falaji", "Ko'rlik", "Oyoq falaji", "Soqovlik"],
        correctAnswerIndex: 0,
        explanation: "Herpes zoster virusi ganglion geniculi'ni zararlaganda VII nerv falaji va quloq terisida og'riqli gerpetik pufakchalar paydo bo'ladi."
      },
      {
        question: "Adashgan nervning oshqozon-ichak trakti motorikasiga ta'siri qanday?",
        options: ["Oshqozon va ichaklar peristaltikasini kuchaytiradi, me'da shirasi va kislota sekretsiyasini oshiradi, sfinkterlarni bo'shashtiradi", "Peristaltikani to'xtatadi", "Kislota ajralishini kamaytiradi", "Sfinkterlarni qisadi"],
        correctAnswerIndex: 0,
        explanation: "Parasimpatik innervatsiya hazm a'zolarining ishini faollashtiradi (Vagotomiya amaliyoti me'da yaralarida kislotani kamaytirish uchun qilinardi)."
      },
      {
        question: "Hiqildoq usti qopqog'i (Epiglottis) va hiqildoq kirishi shilliq qavatini sezgi bilan qaysi nerv ta'minlaydi?",
        options: ["Nervus laryngeus superior'ning ichki shoxi (Ramus internus - X juft)", "Nervus hypoglossus", "Nervus trigeminus", "Nervus facialis"],
        correctAnswerIndex: 0,
        explanation: "Ramus internus hiqildoqning ovoz boylamlaridan yuqori qismini sezgi bilan ta'minlaydi; uning sezgirligi nafas yo'liga ovqat ketib qolishidan asraydi."
      },
      {
        question: "Ko'krak qafasida adashgan nervlar (Nn. vagi) qizilo'ngach atrofida qanday joylashadi?",
        options: ["Chap adashgan nerv - Qizilo'ngachning oldingi poyasiga (Truncus vagalis anterior); O'ng adashgan nerv - Qizilo'ngachning orqa poyasiga (Truncus vagalis posterior) aylanadi", "Ikkala nerv o'ng tomonga o'tadi", "Ikkala nerv orqada qoladi", "Qizilo'ngachga kirmaydi"],
        correctAnswerIndex: 0,
        explanation: "Embrional burilish sababli chap nerv oldinga (oshqozon old devoriga), o'ng nerv orqaga (oshqozon orqa devoriga) o'tadi."
      }
    ]
  },

  // ==========================================
  // TOPIC 12 (Order 112 / S3-12): Vegetativ nerv tizimi (Simpatik va Parasimpatik)
  // ==========================================
  {
    topicOrder: 112,
    topicKeywords: ["vegetativ nerv tizimi", "autonomic", "sympathetic", "parasympathetic", "truncus sympathicus", "ganglion", "asetilxolin", "noradrenalin"],
    quizzes: [
      {
        question: "Vegetativ (Avtonom) nerv tizimining somatik nerv tizimidan asosiy farqi nimada?",
        options: ["U ichki a'zolar, silliq mushaklar, yurak va bezlar faoliyatini inson ixtiyoriga bo'ysunmagan (avtomatik) holda boshqaradi va uning efferent yo'li doimo 2 neyronli (pre- va postganglionar)", "Faqat skelet mushaklarini qisqartiradi", "Ixtiyoriy boshqariladi", "Faqat 1 ta neyrondan iborat"],
        correctAnswerIndex: 0,
        explanation: "Vegetativ nerv tizimi gomeostazni ixtiyorsiz boshqaradi; efferent signali har doim periferik vegetativ gangliyada sinaps hosil qiladi."
      },
      {
        question: "Simpatik nerv tizimining markaziy neyronlari orqa miyaning qaysi sohasida joylashgan?",
        options: ["C8/Th1 dan L2/L3 gacha bo'lgan orqa miya segmentlarining yon shoxlarida (Cornu laterale / Nucleus intermediolateralis)", "Barcha 31 segmentda", "Faqat bosh miyada", "Faqat dumg'azada"],
        correctAnswerIndex: 0,
        explanation: "Simpatik nerv tizimi torakolyumbal (ko'krak-bel) lokalizatsiyaga ega (Th1-L3 segmentlari yon shoxlari)."
      },
      {
        question: "Parasimpatik nerv tizimining markazlari qayerlarda joylashgan?",
        options: ["Kraniosakral sohada: 1) Miya poyasida (III, VII, IX, X bosh miya nervlari vegetativ o'zaklarida) va 2) Dumg'aza orqa miyasining S2 - S4 segmentlari yon shoxlarida", "Th1 - L2 segmentlarida", "Faqat miyachada", "Faqat buyrak usti bezida"],
        correctAnswerIndex: 0,
        explanation: "Parasimpatik tizim kraniosakral (kranial va dumg'aza) tuzilishga ega bo'lib, tinchlik va qayta tiklanishni boshqaradi."
      },
      {
        question: "Simpatik poya (Truncus sympathicus) nima va u qayerda joylashgan?",
        options: ["Umurtqa pog'onasi ikki yonida bo'ylama zanjir hosil qiluvchi 20-25 juft paravertebral simpatik tugunlar va ularni tutashtiruvchi poyalar", "Umurtqa kanali ichida", "Miya po'stlog'ida", "Yurak ichida"],
        correctAnswerIndex: 0,
        explanation: "Simpatik poya kalla asosidan dum suyagigacha umurtqa ikki yonida yotib, pastda toq Ganglion impar tugunida birlashadi."
      },
      {
        question: "Bo'yin simpatik poyasining eng yirik yuqori tuguni qaysi?",
        options: ["Ganglion cervicale superius (Yuqori bo'yin tuguni - C2-C3 sathida yotib bosh va yuz a'zolarini simpatik tola bilan ta'minlaydi)", "Ganglion cervicale medium", "Ganglion stellatum", "Ganglion coeliacum"],
        correctAnswerIndex: 0,
        explanation: "Ganglion cervicale superius bosh miya, ko'z qorachig'ini kengaytiruvchi mushak, yuz tomirlari va so'lak bezlariga simpatik postganglionar tolalar beradi."
      },
      {
        question: "Yulduzsimon tugun (Ganglion stellatum / Ganglion cervicothoracicum) qanday hosil bo'ladi?",
        options: ["Pastki bo'yin simpatik tuguni (Ganglion cervicale inferius) ning I ko'krak tuguni (Th1) bilan qo'shilishidan", "Yuqori va o'rta tugunlar qo'shilishidan", "Bel tugunlaridan", "Miya poyasidan"],
        correctAnswerIndex: 0,
        explanation: "Ganglion stellatum 1-qovurg'a bo'yni sohasida yotadi; uning blokadasi (anesteziyasi) qo'l va ko'krak qafasi qon aylanishini yaxshilashda qo'llaniladi."
      },
      {
        question: "Gorner sindromi (Horner's syndrome) bo'yin simpatik yo'li uzilganda qanday belgilar triadasini beradi?",
        options: ["1) Ptosis (qovoqning qisman tushishi), 2) Miosis (qorachiqning torayishi), 3) Anhidrosis (yuz yarmida terlamaslik) hamda Enophthalmus", "Qorachiq kengayishi va terlash", "Ko'rlik va karlik", "Yuz falaji"],
        correctAnswerIndex: 0,
        explanation: "Simpatik tonus yo'qolganda m. dilatator pupillae ishlamay qorachiq torayadi (mioz), m. tarsalis superior bo'shashib ptoz va yuzda angidroz yuzaga keladi."
      },
      {
        question: "Pankost o'smasi (Pancoast tumor / O'pka cho'qqisi saratoni) nima sababdan Gorner sindromini chaqiradi?",
        options: ["O'pka cho'qqisidagi o'sma I qovurg'a sohasidagi Yulduzsimon tugunni (Ganglion stellatum) yoki bo'yin simpatik poyasini ezib qo'yishi natijasida", "O'pka yorilishi sababli", "Qon ketishi sababli", "Yurak to'xtashi sababli"],
        correctAnswerIndex: 0,
        explanation: "Pankost o'smasi yulduzsimon tugunni yemiradi va zararlangan tomonda ptoz, mioz va yuz terlamasligi (Gorner) paydo bo'ladi."
      },
      {
        question: "Simpatik nerv tizimining asosiy neyromediatorlari qaysilar?",
        options: ["Preganglionar sinapsda - Asetilxolin (N-xolinoretseptor); Postganglionar sinapsda esa - Noradrenalin (Adrenoretseptorlar: alfa va beta)", "Faqat dofamin", "Faqat serotonin", "Faqat gistamin"],
        correctAnswerIndex: 0,
        explanation: "Simpatik tizim periferiyada noradrenalin ajratadi (faqat ter bezlari va ba'zi tomirlarda postganglionar mediator asetilxolin bo'ladi)."
      },
      {
        question: "Parasimpatik nerv tizimining barcha (ham pre-, ham postganglionar) sinapslaridagi neyromediator qaysi?",
        options: ["Asetilxolin (Preganglionarda Nikotinik / N-xolinoretseptor, Postganglionarda esa Muskarinik / M-xolinoretseptorlar)", "Adrenalin", "Noradrenalin", "GAMK"],
        correctAnswerIndex: 0,
        explanation: "Parasimpatik tizim sof xolinergik tizim bo'lib, hamma bosqichlarida asetilxolin orqali ta'sir ko'rsatadi."
      },
      {
        question: "Simpatik nerv tizimi faollashganda ('Ur yoki Qoch' / Fight-or-Flight reaksiyasida) organizmda nima sodir bo'ladi?",
        options: ["Yurak urishi tezlashadi, qon bosimi oshadi, bronxlar kengayadi, qorachiqlar kengayadi (midriaz), qonda glyukoza ko'payadi, ovqat hazm qilish tormozlanadi", "Yurak sekinlashadi", "Odam uxlab qoladi", "Qon bosimi tushadi"],
        correctAnswerIndex: 0,
        explanation: "Simpatika organizmni ekstremal yuklamaga, xavfdan himoyalanishga yoki qochishga safarbar qiladi."
      },
      {
        question: "Parasimpatik nerv tizimi faollashganda ('Dam ol va Hazm qil' / Rest-and-Digest) organizmda nima sodir bo'ladi?",
        options: ["Yurak urishi sekinlashadi (bradikardiya), qon bosimi pasayadi, bronxlar torayadi, hazm shirasi va so'lak ajralishi kuchayadi, ichak peristaltikasi faollashadi, qorachiq torayadi (mioz)", "Yurak tezlashadi", "Glyukoza oshadi", "Qon quyiladi"],
        correctAnswerIndex: 0,
        explanation: "Parasimpatika organizm quvvatini tiklash, oziq moddalarni hazm qilish va zahira to'plash bilan shug'ullanadi."
      },
      {
        question: "Katta ichki a'zolar nervi (Nervus splanchnicus major) qaysi tugunlardan boshlanadi?",
        options: ["Ko'krak simpatik poyasining Th5 - Th9 tugunlaridan boshlanib, diafragmani teshib Qorin chigaliga (Plexus coeliacus) boradi", "Bo'yin tugunlaridan", "Bel tugunlaridan", "Dumg'aza tugunlaridan"],
        correctAnswerIndex: 0,
        explanation: "N. splanchnicus major preganglionar tolalardan iborat bo'lib, quyosh chigalidagi ganglion coeliacum'da sinaps hosil qiladi."
      },
      {
        question: "Quyosh chigali (Plexus coeliacus / Qorin chigali) qayerda joylashgan?",
        options: ["Qorin aortasining boshlang'ich qismida, Truncus coeliacus atrofida va oshqozon osti bezi orqasida", "Kichik chanoqda", "Ko'krak qafasida", "Buyrak ichida"],
        correctAnswerIndex: 0,
        explanation: "Quyosh chigali qorin bo'shlig'idagi eng yirik vegetativ pleksus bo'lib, barcha yuqori qorin a'zolarini innervatsiya qiladi."
      },
      {
        question: "Buyrak usti bezi mag'iz moddasi (Medulla glandulae suprarenalis) ning simpatik tizimdagi o'rni qanday?",
        options: ["U to'g'ridan-to'g'ri simpatik preganglionar tolalar bilan innervatsiya qilinadi va qonga Adrenalin (80%) hamda Noradrenalin (20%) ajratuvchi 'O'zgargan simpatik gangliy' hisoblanadi", "Parasimpatik bez hisoblanadi", "Faqat insulin ajratadi", "Orqa miyaga kirmaydi"],
        correctAnswerIndex: 0,
        explanation: "Buyrak usti bezi mag'iz qavati xromaffin hujayralari simpatik signaldan so'ng adrenalinni to'g'ridan-to'g'ri qonga quyib gormonal 'stress' javobini beradi."
      },
      {
        question: "Chanoq ichki a'zolar nervlari (Nervi splanchnici pelvici / Erigentes nervlari) qayerdan chiqadi va qanday tolalardan iborat?",
        options: ["Dumg'aza orqa miyasining S2 - S4 segmentlaridan chiqadi va kichik chanoq a'zolari (to'g'ri ichak, qovuq, jinsiy a'zolar) uchun PARASIMPATIK tolalarni tashiydi", "Ko'krak simpatik poyasidan", "Th12 dan", "C1 - C4 dan"],
        correctAnswerIndex: 0,
        explanation: "Nn. splanchnici pelvici sakral parasimpatika bo'lib, siyish, defekatsiya va ereksiyani boshqaradi."
      },
      {
        question: "Ereksiya va Eyakulyatsiya jarayonlari qaysi vegetativ bo'limlar tomonidan boshqariladi?",
        options: ["Ereksiya - Parasimpatik tizim (S2-S4 / 'Point'); Eyakulyatsiya - Simpatik tizim (Th12-L2 / 'Shoot')", "Ikkalasi ham faqat simpatik", "Ikkalasi ham faqat parasimpatik", "Ixtiyoriy mushaklar"],
        correctAnswerIndex: 0,
        explanation: "Mnemonic: 'Point and Shoot' -> Point (Erection) = Parasympathetic, Shoot (Ejaculation) = Sympathetic."
      },
      {
        question: "Siydik pufagining to'lishi va siyish akti qanday boshqariladi?",
        options: ["Simpatika (Th11-L2) - Siydikni ushlab turadi (sfinkterni qisadi, detruzorni bo'shashtiradi); Parasimpatika (S2-S4) - Siyishni ta'minlaydi (m. detrusor vesicae'ni qisqartiradi, sfinkterni ochadi)", "Faqat orqa miya orqali", "Faqat somatik", "Faqat buyrak orqali"],
        correctAnswerIndex: 0,
        explanation: "Parasimpatik qo'zg'alish qovuq mushagini (detruzor) siqib ichki sfinkterni bo'shashtiradi va siyish yuz beradi."
      },
      {
        question: "Vegetativ nerv tizimining oliy integrativ po'stloqosti markazi qaysi?",
        options: ["Gipotalamus (Hypothalamus - oldingi qismi parasimpatik, orqa qismi simpatik markaz)", "Miyacha", "To'rt tepalik", "Qadoqsimon tana"],
        correctAnswerIndex: 0,
        explanation: "Gipotalamus barcha vegetativ, gumoral va endokrin jarayonlarni birlashtiruvchi bosh boshqaruv pultidir."
      },
      {
        question: "Metasimpatik (Enterik) nerv tizimi (Intramural nerv tizimi) nima?",
        options: ["Oshqozon-ichak trakti devori qavatlarida joylashgan mustaqil neyronlar to'ri: Auerbax (mushaklararo) va Meysner (shilliqosti) chigallari", "Faqat terida joylashgan", "Faqat suyak ichida", "Miyacha ichida"],
        correctAnswerIndex: 0,
        explanation: "Enterik nerv tizimi 100-500 million neyronni saqlaydi va miyadan uzilgan holatda ham ichak harakati va sekretsiyasini o'zi boshqara oladi ('Ikkinchi miya')."
      },
      {
        question: "Auerbax chigali (Plexus myentericus) ichak devorida qayerda yotadi va nimaga javobgar?",
        options: ["Bo'ylama va halqasimon silliq mushak qavatlari orasida yotadi va ichak peristaltik harakatlarini boshqaradi", "Shilliq qavat ostida", "Seroz parda ustida", "Faqat qon tomirda"],
        correctAnswerIndex: 0,
        explanation: "Plexus myentericus butun oshqozon-ichak yo'li bo'ylab mushaklar harakatini (motilite) koordinatsiya qiladi."
      },
      {
        question: "Meysner chigali (Plexus submucosus) qayerda yotadi va nimani boshqaradi?",
        options: ["Shilliq osti qavatida (Tela submucosa) yotadi va shilliq pardaning sekretsiyasi, so'rilishi hamda mahalliy qon oqimini boshqaradi", "Mushaklar orasida", "Jigarda", "Taloqda"],
        correctAnswerIndex: 0,
        explanation: "Plexus submucosus ichak shilliq bezlarining sekretsiyasini va mahalliy qon tomirlar kengayishini ta'minlaydi."
      },
      {
        question: "Girshprung kasalligi (Megacolon congenitum) da qanday patologiya bo'ladi?",
        options: ["Yo'g'on ichak distal qismida enterik tugunlar (Auerbax va Meysner chigallari) ning tug'ma bo'lmasligi (aganglioz) natijasida ichakning torayishi va yuqorisining haddan tashqari kengayishi", "Ichak teshilishi", "Oshqozon yarasi", "Jigar sirrozi"],
        correctAnswerIndex: 0,
        explanation: "Aganglionar soha bo'shasha olmay doimiy spazmda turadi, natijada yuqori ichakda najas to'planib ulkan ichak (megakolon) hosil bo'ladi."
      },
      {
        question: "Parasimpato-mimetik dori vositalari (masalan, Pilokarpin) ko'zga tomizilganda nima sodir bo'ladi?",
        options: ["Miosis (qorachiqning torayishi) va ko'z ichi bosimining pasayishi (Glaukoma davosida qo'llaniladi)", "Qorachiq kengayishi", "Ko'z ko'rmay qolishi", "Ko'z qotishi"],
        correctAnswerIndex: 0,
        explanation: "Pilokarpin m. sphincter pupillae'ni qisqartirib qorachiqni toraytiradi va old kamera burchagini ochib suyuqlik ketishini osonlashtiradi."
      },
      {
        question: "Atropin qanday dori va u ko'zga qanday ta'sir qiladi?",
        options: ["M-xolinoblokator (parasimpatolitik) modda bo'lib, qorachiqni kuchli kengaytiradi (Midriaz) va akkomodatsiya falajini (Sikloplegiya) chaqiradi", "Qorachiqni toraytiradi", "Ko'z bosimini pasaytiradi", "Ko'z yoshini ko'paytiradi"],
        correctAnswerIndex: 0,
        explanation: "Atropin M-xolinoretseptorlarni to'sib parasimpatik ta'sirni yo'qotadi; natijada qorachiq kengayadi va gavhar uzoqqa fokuslanib qoladi."
      },
      {
        question: "Bronxial astma xurujida nima sababdan simpatomimetiklar (Salbutamol - beta2-adrenomimetik) beriladi?",
        options: ["Bronxlar silliq mushaklaridagi Beta-2 adrenoretseptorlarni qo'zg'atib, bronxospazmni yozish (bronxlarni kengaytirish) uchun", "Bronxlarni toraytirish uchun", "Yurakni to'xtatish uchun", "Shilliqni ko'paytirish uchun"],
        correctAnswerIndex: 0,
        explanation: "Beta-2 retseptorlar simpatik qo'zg'alganda bronx silliq mushaklarini bo'shashtiradi va nafas olishni zudlik bilan yengillashtiradi."
      },
      {
        question: "Dorsal vagal kompleks va yurak reflektor to'xtashi xavfi qachon yuzaga keladi?",
        options: ["Karotid sinus sohasi kuchli bosilganda yoki ko'z soqqalari qattiq ezilganda (Aschner-Dagnini refleksi) haddan tashqari vagal tonus tufayli o'tkir bradikardiya va asistoliya", "Qo'l qisilganda", "Yurganda", "Kitob o'qiganda"],
        correctAnswerIndex: 0,
        explanation: "Ko'z yoki uyqu arteriyasi ayrisi qattiq bosilsa adashgan nerv kuchli qo'zg'alib yurakni to'xtatib qo'yishi mumkin."
      },
      {
        question: "Rayno kasalligi (Morbus Raynaud) da qanday vegetativ buzilish kuzatiladi?",
        options: ["Qo'l va oyoq barmoqlari mayda arterial tomirlarining simpatik gipertonus sababli sovuqda xurujli spazmi (barmoqlarning oqarib, ko'karib ketishi va og'rishi)", "Tomirlar kengayib ketishi", "Suyaklar erishi", "Nervlar qurishi"],
        correctAnswerIndex: 0,
        explanation: "Rayno kasalligida sovuqqa javoban simpatik vazomotor tonus haddan tashqari oshib barmoqlar qonsizlanadi (uch fazali rang o'zgarishi: oq-ko'k-qizil)."
      },
      {
        question: "Bel simpatikotomiyasi (Lumbosakral simpatektomiya) nima maqsadda qilinadi?",
        options: ["Oyoqlarning og'ir obliteratsiyalovchi endarteriiti yoki kuchli oyoq terlashi (gipergidroz) da pastki oyoq qon tomirlarini kengaytirish uchun", "Tizzani davolash uchun", "Bosh og'rig'i uchun", "Qorin og'rig'i uchun"],
        correctAnswerIndex: 0,
        explanation: "Bel simpatik tugunlari kesilsa oyoq tomirlarining toraytiruvchi tonusi yo'qolib qon aylanishi keskin yaxshilanadi."
      },
      {
        question: "Fexromotsitoma (Pheochromocytoma) o'smasida qanday klinik krizlar kuzatiladi?",
        options: ["Buyrak usti bezi xromaffin o'smasi qonga haddan tashqari ko'p Adrenalin va Noradrenalin ajratishi sababli to'satdan qon bosimining 250-300 mm gacha ko'tarilishi, taxikardiya, kuchli qo'rquv va terlash", "Qon bosimining tushib ketishi", "Bemorning uxlab qolishi", "Semirib ketish"],
        correctAnswerIndex: 0,
        explanation: "Fexromotsitoma katexolaminlar bo'ronini chiqaradi; bu og'ir gipertonik krizlar va paroksizmal taxikardiya beradi."
      }
    ]
  },

  // ==========================================
  // TOPIC 13 (Order 113 / S3-13): Eshituv va muvozanat a’zosi
  // ==========================================
  {
    topicOrder: 113,
    topicKeywords: ["eshituv", "muvozanat", "organum vestibulocochleare", "auris", "membrana tympani", "cochlea", "organum spirale", "korti", "otolit"],
    quizzes: [
      {
        question: "Eshitish va muvozanat a'zosi (Organum vestibulocochleare) qanday 3 ta asosiy bo'limdan tashkil topgan?",
        options: ["Auris externa (Tashqi quloq), Auris media (O'rta quloq) va Auris interna (Ichki quloq)", "Oldingi, o'rta va orqa quloq", "Katta va kichik quloq", "Bosh suyagi va eshitish yo'li"],
        correctAnswerIndex: 0,
        explanation: "Quloq anatomik jihatdan tashqi, o'rta va ichki (labirint) bo'limlarga bo'linadi."
      },
      {
        question: "Tashqi quloq tarkibiga qaysi tuzilmalar kiradi?",
        options: ["Auricula (Quloq suprasi), Meatus acusticus externus (Tashqi eshituv yo'li) va Membrana tympani (Nog'ora parda)", "Faqat quloq suprasi", "Suyakchalar zanjiri", "Chig'anoq"],
        correctAnswerIndex: 0,
        explanation: "Tashqi quloq tovush to'lqinlarini yig'ib tashqi eshituv yo'li orqali nog'ora pardaga yo'naltiradi."
      },
      {
        question: "Nog'ora parda (Membrana tympani) nimani nimadan ajratib turadi?",
        options: ["Tashqi eshituv yo'lini o'rta quloqning nog'ora bo'shlig'idan (Cavitas tympanica)", "Ichki quloqni o'rta quloqdan", "Kalla suyagini miyadan", "Quloq suprasini kanaldan"],
        correctAnswerIndex: 0,
        explanation: "Nog'ora parda tashqi va o'rta quloq chegarasidagi yupqa, yarim shaffof, elastik membranadir."
      },
      {
        question: "Nog'ora pardaning yorug'lik konusi (Politser yorug'lik refleksi) otoskopiyada me'yorda qaysi kvadrantda ko'rinadi?",
        options: ["Oldingi-pastki kvadrantda (Quadrans anteroinferior)", "Orqa-yuqori kvadrantda", "Markazda", "Oldingi-yuqorida"],
        correctAnswerIndex: 0,
        explanation: "Normal nog'ora pardada yorug'lik nuri oldingi-pastki kvadrantda yaltiroq uchburchak konus shaklida aks etadi (otitda yo'qoladi)."
      },
      {
        question: "O'rta quloqdagi eshitish suyakchalari (Ossicula auditus) zanjiri nog'ora pardadan ichki quloqqacha qanday ketma-ketlikda joylashgan?",
        options: ["Malleus (Bolg'acha) -> Incus (Sandoncha) -> Stapes (Uzangicha)", "Stapes -> Incus -> Malleus", "Incus -> Malleus -> Stapes", "Malleus -> Stapes -> Incus"],
        correctAnswerIndex: 0,
        explanation: "Bolg'acha dastasi nog'ora pardaga, uzangicha asosi esa ichki quloqning dahliz darchasiga (Fenestra vestibuli) birikadi."
      },
      {
        question: "Eshitish suyakchalari zanjirining asosiy mexanik vazifasi nimadan iborat?",
        options: ["Nog'ora pardadagi katta yuzali havoning zaif tebranishlarini kichik yuzali dahliz darchasiga 20 barobargacha kuchaytirib (bosimni oshirib) suyuqlikka uzatish", "Tovushni pasaytirish", "Tovushni to'xtatish", "Quloqni shamollatish"],
        correctAnswerIndex: 0,
        explanation: "Suyakchalar richag tizimi orqali havo muhitidagi tovush energiyasini ichki quloq suyuqligiga minimal yo'qotish bilan uzatadi."
      },
      {
        question: "Eshituv nayi (Tuba auditiva / Yevstaxiy nayi) nimani nimaga tutashtiradi va qanday vazifani bajaradi?",
        options: ["O'rta quloq (nog'ora bo'shlig'i) ni burun-halqum (Nasopharynx) bilan tutashtiradi va nog'ora pardaning ikki tomonidagi havo bosimini tenglashtiradi", "Ichki quloqni miyaga tutashtiradi", "Quloqni ko'zga tutashtiradi", "Og'izni qizilo'ngachga tutashtiradi"],
        correctAnswerIndex: 0,
        explanation: "Yevstaxiy nayi yutinganda ochilib atmosfera bosimi bilan nog'ora bo'shlig'i bosimini tenglashtiradi (samolyotda uchganda yutinish shuning uchun yordam beradi)."
      },
      {
        question: "O'rta quloqda haddan tashqari qattiq tovushlardan ichki quloqni himoya qiluvchi 2 ta mushak qaysilar?",
        options: ["Musculus tensor tympani (V3 tomonidan innervatsiya qilinadi) va Musculus stapedius (VII yuz nervi tomonidan innervatsiya qilinadi)", "Musculus masseter va temporalis", "M. digastricus va stylohyoideus", "M. ciliaris va sphincter pupillae"],
        correctAnswerIndex: 0,
        explanation: "Qattiq tovushda bu mushaklar reflektor qisqarib (akustik refleks) suyakchalar harakatini cheklaydi va Korti a'zosini shikastlanishdan asraydi."
      },
      {
        question: "So'rg'ichsimon g'or (Antrum mastoideum) va katakchalar qaysi suyak ichida joylashgan va qayerga ochiladi?",
        options: ["Chakka suyagining Processus mastoideus sohasida joylashgan bo'lib, Aditus ad antrum orqali nog'ora bo'shlig'iga ochiladi", "Ensa suyagida", "Peshona suyagida", "Yuqori jag'da"],
        correctAnswerIndex: 0,
        explanation: "O'rta quloq yallig'lanishi (otit) osonlikcha antrum va so'rg'ichsimon katakchalarga o'tib Mastoiditni chaqiradi."
      },
      {
        question: "Ichki quloq (Auris interna / Labirint) kalla suyagining qaysi qismida joylashgan?",
        options: ["Chakka suyagi piramidasining (toshsimon qismining) qalinligida", "Peshona suyagida", "Ensa suyagida", "Turk egarchasida"],
        correctAnswerIndex: 0,
        explanation: "Ichki quloq toshdek qattiq piramida suyagi ichida suyak labirinti va uning ichidagi parda labirintidan iborat."
      },
      {
        question: "Suyak labirinti (Labyrinthus osseus) qanday 3 ta asosiy bo'limdan iborat?",
        options: ["1) Cochlea (Chig'anoq), 2) Vestibulum (Dahliz), 3) Canales semicirculares ossei (Suyak yarim doira kanallari)", "Nog'ora bo'shlig'i va nay", "Bolg'acha, sandoncha, uzangicha", "Tashqi, o'rta, ichki"],
        correctAnswerIndex: 0,
        explanation: "Suyak labirinti ichida uning shaklini takrorlovchi parda labirinti joylashgan."
      },
      {
        question: "Perilimfa va Endolimfa suyuqliklari qayerlarda joylashgan?",
        options: ["Perilimfa - Suyak va parda labirinti orasida (Na+ ga boy); Endolimfa - Parda labirintining o'z ichida (K+ ga boy)", "Ikkalasi ham qonda", "Nog'ora bo'shlig'ida", "Tashqi eshituv yo'lida"],
        correctAnswerIndex: 0,
        explanation: "Endolimfa hujayra ichi suyuqligiga o'xshash yuqori K+ konsentratsiyasiga ega bo'lib, retseptor sochli hujayralarning depolarizatsiyasini ta'minlaydi."
      },
      {
        question: "Ichki quloq chig'anog'i (Cochlea) necha marta o'z o'qi (Modiolus) atrofida buralgan?",
        options: ["2.5 - 2.75 marta (aylana) spiral shaklida buralgan", "5 marta", "1 marta", "10 marta"],
        correctAnswerIndex: 0,
        explanation: "Chig'anoq suyak o'qi (Modiolus) atrofida 2.5-2.75 marta buralib spiral kanalni hosil qiladi."
      },
      {
        question: "Chig'anoq kanali bo'ylama kesimida qanday 3 ta zinapoyaga (kanallarga) bo'linadi?",
        options: ["1) Scala vestibuli (Dahliz zinapoyasi - perilimfa), 2) Ductus cochlearis / Scala media (Chig'anoq yo'li - endolimfa), 3) Scala tympani (Nog'ora zinapoyasi - perilimfa)", "Yuqori, o'rta, pastki suyak", "Old, o'rta, orqa", "Faqat bitta kanal"],
        correctAnswerIndex: 0,
        explanation: "Dahliz va nog'ora zinapoyalari chig'anoq cho'qqisida Gelikotrema (Helicotrema) teshigi orqali bir-biriga tutashadi."
      },
      {
        question: "Korti a'zosi (Organum spirale Corti - spiral a'zo) qayerda joylashgan?",
        options: ["Chig'anoq yo'lining (Ductus cochlearis) asosiy membranasi (Membrana basilaris) ustida", "Suyak yarim doira kanalida", "Nog'ora pardada", "Dahliz xaltachasida"],
        correctAnswerIndex: 0,
        explanation: "Korti a'zosi tovush to'lqinlarini qabul qilib nerv impulsiga aylantiruvchi periferik eshitish retseptor a'zosidir."
      },
      {
        question: "Korti a'zosining retseptor hujayralari qaysilar?",
        options: ["Ichki va tashqi sezuvchi tukli (sochli) hujayralar (Cellulae sensoriales pilosae)", "Astrositlar", "Bets hujayralari", "Piramidal neyronlar"],
        correctAnswerIndex: 0,
        explanation: "Tukli hujayralar ustidagi stereosiliyalar qoplovchi membrana (Membrana tectoria) ga tekkanda mexanik tebranish elektr signaliga aylanadi."
      },
      {
        question: "Bekeshi (Békésy) ning 'Yuguruvchi to'lqin nazariyasi' (Tonotopik prinsip) ga ko'ra yuqori va past chastotali tovushlar qayerda qabul qilinadi?",
        options: ["Yuqori chastotali (ingichka/baland) tovushlar - Chig'anoq asosida (Base); Past chastotali (yo'g'on/bas) tovushlar - Chig'anoq cho'qqisida (Apex / Helicotrema)", "Yuqori tovushlar cho'qqida", "Hammasi bir joyda", "Faqat tashqi quloqda"],
        correctAnswerIndex: 0,
        explanation: "Chig'anoq asosi qattiq va tor bo'lib yuqori gersli tovushlarga, cho'qqisi esa keng va elastik bo'lib past gersli tovushlarga tebranadi."
      },
      {
        question: "Ichki quloqning Dahliz darchasi (Fenestra vestibuli / Oval darcha) va Nog'ora darchasi (Fenestra cochleae / Dumaloq darcha) vazifasi nima?",
        options: ["Oval darchaga uzangicha asosi kirib suyuqlikni tebratadi; Dumaloq darcha (ikkilamchi nog'ora parda) esa siqilmaydigan perilimfa to'lqini uchun kompensator elastik bo'rtib chiqadi", "Ikkala darcha havo kiritadi", "Ikkalasi ham suyak bilan qoplangan", "Faqat qon o'tkazadi"],
        correctAnswerIndex: 0,
        explanation: "Suyuqlik siqilmas bo'lgani sababli oval darcha ichkariga bosilganda dumaloq darcha tashqariga bo'rtib suyuqlik to'lqinlanishini ta'minlaydi."
      },
      {
        question: "Muvozanat a'zosining statik va dinamik retseptorlari qayerlarda joylashgan?",
        options: ["Burchakli aylanma harakatlar - 3 ta yarim doira yo'llari ampulalaridagi Crista ampullaris'da; Gravitatsiya va to'g'ri chiziqli tezlanish - Dahlizning Utriculus va Sacculus makulalaridagi (Macula) Otolit apparatida", "Korti a'zosida", "Nog'ora pardada", "Eshituv nayida"],
        correctAnswerIndex: 0,
        explanation: "Kristalar bosh aylanishini, makuladagi otolitlar (kaltsiy karbonat kristallari) esa gravitatsiya va chiziqli siljishni sezadi."
      },
      {
        question: "Otoskleroz kasalligi nima?",
        options: ["Uzangicha asosining (Stapes) dahliz darchasi atrofidagi suyak kapsulasi bilan suyaklanib bitib qolishi natijasida progressiv o'tkazuvchanlik karligi rivojlanishi", "Chig'anoqning qurishi", "Quloq pardasining teshilishi", "Eshitish nervining o'smasi"],
        correctAnswerIndex: 0,
        explanation: "Otosklerozda uzangicha harakatsizlanib qoladi va tovush ichki quloqqa o'tmaydi (stapedotomiya operatsiyasi bilan davolanadi)."
      },
      {
        question: "Labirintit (Ichki quloq yallig'lanishi) da qanday og'ir alomatlar yuzaga keladi?",
        options: ["Kuchli aylanma bosh aylanishi (Vertigo), spontan nistagm, ko'ngil aynishi, qusish, muvozanatning mutlaqo yo'qolishi va eshitishning pasayishi", "Faqat ko'z qizarishi", "Faqat qo'l qaltirashi", "Faqat tish og'rig'i"],
        correctAnswerIndex: 0,
        explanation: "Labirint shikastlanganda bemor hatto ko'zini ocha olmaydi, atrof aylanib ketadi va doimiy qusish bo'ladi."
      },
      {
        question: "BPPV (Xavfsiz paroksizmal pozitsion bosh aylanishi / Kupulolitiaz) nima sababdan kelib chiqadi?",
        options: ["Utriculus'dan ajralgan otolit toshchalari (kaltsiy kristallari) ning orqa yarim doira kanaliga tushib qolishi va bosh holati o'zgarganda ampulani ta'sirlashi", "Bosh miya insulti", "Miyacha o'smasi", "Qon bosimi oshishi"],
        correctAnswerIndex: 0,
        explanation: "BPPV da bosh yostiqqa qo'yilganda yoki burilganda 20-30 soniyalik o'tkir aylanma bosh aylanishi bo'ladi (Epli manevri bilan toshchalar joyiga qaytariladi)."
      },
      {
        question: "Presbiakuziya (Presbyacusis) nima?",
        options: ["Keksalikda Korti a'zosi sochli hujayralari va spiral gangliy neyronlarining tabiiy qarishi oqibatida ikki tomonlama yuqori chastotali tovushlarni eshitishning pasayishi", "Tug'ma soqovlik", "O'rta quloq yiringlashi", "Quloq suprasi sinishi"],
        correctAnswerIndex: 0,
        explanation: "Keksalarda chig'anoq asosi retseptorlari eskirib birinchi navbatda baland/chiyillagan tovushlar va shovqinda nutqni tushunish yomonlashadi."
      },
      {
        question: "Ototoksik dorilar (masalan, Gentamitsin, Amikatsin, Sisplatin, Furosemid) quloqning qaysi qismini qaytmas zararlaydi?",
        options: ["Korti a'zosining tashqi va ichki sochli retseptor hujayralarini (Neyrosensor karlik chaqiradi)", "Nog'ora pardani", "Bolg'acha suyagini", "Eshituv nayini"],
        correctAnswerIndex: 0,
        explanation: "Aminoglikozid antibiotiklar va sisplatin Korti a'zosi sochli hujayralarini zaharlab doimiy sensonevral karlik va quloq shang'illashiga olib keladi."
      },
      {
        question: "Koxlear implantatsiya (Cochlear implant) qanday ishlaydi?",
        options: ["Korti a'zosi butunlay nobud bo'lgan karlar uchun maxsus elektrod chig'anoq ichiga kiritilib, eshitish nervi (VIII juft) tolalarini to'g'ridan-to'g'ri elektr impulslari bilan qo'zg'atadi", "Nog'ora pardani yangilaydi", "Suyakchalarni almashtiradi", "Miyani davolaydi"],
        correctAnswerIndex: 0,
        explanation: "Koxlear implant tovushni elektr signallariga aylantirib, spiral kanal orqali to'g'ridan-to'g'ri VIII nerv aksonlarini stimulyatsiya qiladi."
      },
      {
        question: "Kinetoz (Dengiz kasalligi / Avtomobilda ko'ngil aynishi) nima sababdan yuzaga keladi?",
        options: ["Ko'rish analizatori berayotgan axborot bilan vestibulyar apparat (ichki quloq) dan kelayotgan signallarning bir-biriga mos kelmasligi (sensor mojaro / konflikt)", "Oshqozon buzilishi", "Kislorod yetishmasligi", "Qon quyilishi"],
        correctAnswerIndex: 0,
        explanation: "Masalan, mashinada kitob o'qiganda ko'z harakatsizlikni ko'radi, labirint esa tebranishni sezadi; bu qarama-qarshilik vegetativ markazlarni qo'zg'atib ko'ngil aynishi chaqiradi."
      },
      {
        question: "Nog'ora bo'shlig'ining yuqori devori (Paries tegmentalis) nimani o'rta quloqdan ajratib turadi?",
        options: ["O'rta kalla chuqurchasi (Fossa cranii media) va chakka bo'lagini", "Orqa kalla chuqurchasini", "Ichki uyqu arteriyasini", "Bo'yininturuq venasini"],
        correctAnswerIndex: 0,
        explanation: "Paries tegmentalis yupqa suyak plastinka bo'lib, o'rta quloq yallig'lanishida infeksiya osonlikcha kalla ichiga o'tib menigit yoki chakka bo'lagi abssessini chaqirishi mumkin."
      },
      {
        question: "Nog'ora bo'shlig'ining pastki devori (Paries jugularis) nimaga tutashgan?",
        options: ["Vena jugularis interna'ning yuqori piyozchasi (Bulbus venae jugularis superior) ga", "Ichki uyqu arteriyasiga", "Miyachaga", "Ko'z kosasiga"],
        correctAnswerIndex: 0,
        explanation: "Pastki devor bo'yininturuq venasidan yupqa suyak bilan ajralib turadi."
      },
      {
        question: "Nog'ora bo'shlig'ining oldingi devori (Paries caroticus) nimaga chegaradosh?",
        options: ["Canalis caroticus (Ichki uyqu arteriyasi kanali) ga", "Kalla suyagi asosiga", "Quloq suprasiga", "Ko'zga"],
        correctAnswerIndex: 0,
        explanation: "Oldingi devorda uyqu arteriyasi o'tadi va eshituv nayining ochilish teshigi joylashgan."
      },
      {
        question: "Paratsentez (Timpanotomiya / Nog'ora pardani teshib yiringni chiqarish) pardaning qaysi kvadrantidan xavfsiz qilinadi?",
        options: ["Orqa-pastki (Quadrans posteroinferior) yoki Oldingi-pastki kvadrantdan (eshitish suyakchalari va yuz nervini shikastlamaslik uchun)", "Orqa-yuqori kvadrantdan", "Bolg'acha ustidan", "Yorug'lik konusi markazidan"],
        correctAnswerIndex: 0,
        explanation: "Orqa-yuqorida suyakchalar (incus, stapes) va chorda tympani joylashgani sababli, igna bilan kesish faqat pastki kvadrantlarda qilinadi."
      }
    ]
  }
];


