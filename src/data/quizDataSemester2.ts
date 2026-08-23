import { CuratedTopicQuiz } from './topicQuizzesData';

export const SEMESTER_2_QUIZZES: CuratedTopicQuiz[] = [
  // ==========================================
  // TOPIC 1 (Order 14): Og‘iz bo‘shlig‘i. Tishlar. Til. Tanglay. Halqum. Qizilo‘ngach
  // ==========================================
  {
    topicOrder: 14,
    topicKeywords: ["og'iz", "tish", "til", "tanglay", "halqum", "qizilo'ngach", "dentes", "lingua", "pharynx", "esophagus"],
    quizzes: [
      {
        question: "Og'iz bo'shlig'i (Cavitas oris) qaysi ikki qismga bo'linadi?",
        options: ["Vestibulum oris (og'iz dahlizi) va Cavitas oris propria (xususiy og'iz bo'shlig'i)", "Pars anterior va pars posterior", "Pars labialis va pars lingualis", "Pars nasalis va pars oralis"],
        correctAnswerIndex: 0,
        explanation: "Og'iz bo'shlig'i tishlar va milklar oldidagi og'iz dahlizi hamda ularning orqasidagi xususiy og'iz bo'shlig'iga bo'linadi."
      },
      {
        question: "Quloq oldi so'lak bezi (Glandula parotidea) ning chiqaruv nayi (Ductus parotideus) qayerga ochiladi?",
        options: ["Og'iz dahliziga, yuqori 2-katta oziq tish (molyar) qarshisiga", "Til osti so'rg'ichiga", "Pastki keskich tishlar oldiga", "Halqumga"],
        correctAnswerIndex: 0,
        explanation: "Ductus parotideus m. buccinator'ni teshib o'tib, yuqori 2-molyar tish ro'parasida og'iz dahliziga ochiladi."
      },
      {
        question: "Til osti va jag' osti so'lak bezlarining yo'llari qayerga birgalikda ochiladi?",
        options: ["Caruncula sublingualis (til osti go'shtchasi / so'rg'ichiga)", "Vestibulum oris'ga", "Qattiq tanglayga", "Fauces'ga"],
        correctAnswerIndex: 0,
        explanation: "Caruncula sublingualis til yuganchasi yonida joylashgan bo'lib, jag' osti va til osti bezlari yo'llari shu yerga ochiladi."
      },
      {
        question: "Kattalarning doimiy tishlar formulasi (bir yarim jag' uchun) qanday?",
        options: ["2 keskich, 1 qoziq, 2 kichik oziq, 3 katta oziq (2.1.2.3) - jami 32 ta tish", "2.1.0.2 - jami 20 ta tish", "3.1.3.3 - jami 40 ta tish", "1.2.2.3 - jami 30 ta tish"],
        correctAnswerIndex: 0,
        explanation: "Kattalarda 32 ta doimiy tish bo'lib, har bir chorakda 2 ta dens incisivus, 1 ta caninus, 2 ta premolaris, 3 ta molaris mavjud."
      },
      {
        question: "Sut tishlari (Dentes decidui) jami nechta bo'ladi va qaysi tishlar ularda bo'lmaydi?",
        options: ["20 ta bo'ladi; kichik oziq tishlar (premolarlar) va 3-molyarlar bo'lmaydi", "32 ta bo'ladi", "16 ta bo'ladi", "28 ta bo'ladi"],
        correctAnswerIndex: 0,
        explanation: "Bolalarda 20 ta sut tishlari bo'lib (har chorakda 2 keskich, 1 qoziq, 2 molyar), premolyar tishlar bo'lmaydi."
      },
      {
        question: "Tishning asosiy qattiq massasini tashkil etuvchi modda nima deyiladi?",
        options: ["Dentin (Dentinum)", "Emal (Enamelum)", "Sement (Cementum)", "Pulpa (Pulpa dentis)"],
        correctAnswerIndex: 0,
        explanation: "Dentin tish toj, bo'yin va ildizining asosini hosil qiluvchi suyakka o'xshash qattiq to'qimadir."
      },
      {
        question: "Inson tanasidagi eng qattiq to'qima qaysi?",
        options: ["Tish emali (Enamelum dentis)", "Kompakt suyak", "Dentin", "Sement"],
        correctAnswerIndex: 0,
        explanation: "Tish emali tarkibida 96-97% noorganik tuzlar (gidroksiapatit) bo'lib, inson organizmidagi eng qattiq strukturadir."
      },
      {
        question: "Tishning qon tomirlari va nervlari joylashgan yumshoq ichki to'qimasi nima?",
        options: ["Pulpa (Pulpa dentis)", "Periodont", "Dentin", "Sement"],
        correctAnswerIndex: 0,
        explanation: "Pulpa tish bo'shlig'i (cavitas dentis) ichida joylashgan bo'sh biriktiruvchi to'qima, tomir va nervlardan iborat."
      },
      {
        question: "Tilning shilliq qavatidagi eng yirik, V-shaklida joylashgan ta'm biluvchi so'rg'ichlar qaysi?",
        options: ["Papillae vallatae (novsimon / devor bilan o'ralgan so'rg'ichlar)", "Papillae filiformes", "Papillae fungiformes", "Papillae foliatae"],
        correctAnswerIndex: 0,
        explanation: "Papillae vallatae 7-12 ta bo'lib, sulcus terminalis bo'ylab V-shaklida yotadi va juda ko'p ta'm piyozchalariga ega."
      },
      {
        question: "Til so'rg'ichlaridan qaysi biri ta'm bilmaydi, faqat umumiy taktil va og'riq sezgilarini qabul qiladi?",
        options: ["Papillae filiformes (ipsimon so'rg'ichlar)", "Papillae fungiformes", "Papillae vallatae", "Papillae foliatae"],
        correctAnswerIndex: 0,
        explanation: "Papillae filiformes tilda eng ko'p bo'lib, mexanik va taktil sezgiga xizmat qiladi, ta'm piyozchalari bo'lmaydi."
      },
      {
        question: "Tilning xususiy (ichki) mushaklari qaysilar?",
        options: ["M. longitudinalis superior, m. longitudinalis inferior, m. transversus linguae, m. verticalis linguae", "M. genioglossus, m. hyoglossus, m. styloglossus", "M. mylohyoideus, m. digastricus", "M. palatoglossus"],
        correctAnswerIndex: 0,
        explanation: "Tilning xususiy mushaklari suyakka birikmaydi, til tanasi ichida yotib til shaklini o'zgartiradi."
      },
      {
        question: "Tilni og'izdan oldinga va pastga chiqaruvchi skelet mushagi qaysi?",
        options: ["Musculus genioglossus (iyak-til mushagi)", "Musculus hyoglossus", "Musculus styloglossus", "Musculus palatoglossus"],
        correctAnswerIndex: 0,
        explanation: "M. genioglossus pastki jag' iyak suyagidan boshlanib tilni to'liq oldinga chiqaradi."
      },
      {
        question: "Yumshoq tanglayning (Palatum molle) o'rta orqa qismidagi osilib turuvchi hosila nima?",
        options: ["Uvula palatina (tanglay tilchasi)", "Arcus palatoglossus", "Arcus palatopharyngeus", "Tonsilla palatina"],
        correctAnswerIndex: 0,
        explanation: "Uvula palatina yumshoq tanglayning orqa markaziy osilgan tilchasidir."
      },
      {
        question: "Tanglay murtaklari (Tonsillae palatinae) qaysi tanglay ravoqlari orasidagi chuqurchada (Fossa tonsillaris) joylashadi?",
        options: ["Arcus palatoglossus va Arcus palatopharyngeus orasida", "Uvula ustida", "Til ostida", "Halqum orqa devorida"],
        correctAnswerIndex: 0,
        explanation: "Tonsilla palatina tanglay-til va tanglay-halqum ravoqlari orasidagi chuqurchada yotadi."
      },
      {
        question: "Pirogov-Valdeyer halqum limfoid halqasini qaysi 6 ta murtak (mindalina) hosil qiladi?",
        options: ["2 ta tanglay (palatina), 2 ta nay (tubaria), 1 ta halqum (pharyngea) va 1 ta til (lingualis) murtagi", "Faqat 2 ta tanglay murtagi", "4 ta tanglay va 2 ta hiqildoq murtagi", "3 ta til va 3 ta burun murtagi"],
        correctAnswerIndex: 0,
        explanation: "Limfoepitelial halqa: 2 tonsilla palatina, 2 tonsilla tubaria, 1 tonsilla pharyngea (adenoid) va 1 tonsilla lingualis'dan iborat."
      },
      {
        question: "Halqum (Pharynx) ning anatomik bo'limlari qaysilar?",
        options: ["Pars nasalis (burun-halqum), pars oralis (og'iz-halqum), pars laryngea (hiqildoq-halqum)", "Pars cranialis va pars caudalis", "Pars anterior va posterior", "Pars superior va inferior"],
        correctAnswerIndex: 0,
        explanation: "Halqum kalla asosidan VI bo'yin umurtqasigacha cho'zilib, burun, og'iz va hiqildoq qismlariga bo'linadi."
      },
      {
        question: "Eshituv nayi (Tuba auditiva / Yevstaxiy nayi) halqumning qaysi qismiga ochiladi?",
        options: ["Pars nasalis pharyngis'ning yon devoriga (Ostium pharyngeum tubae auditivae)", "Pars oralis'ga", "Pars laryngea'ga", "Og'iz dahliziga"],
        correctAnswerIndex: 0,
        explanation: "Eshituv nayi burun-halqumning yon devoriga ochilib, o'rta quloqdagi havo bosimini tashqi muhit bilan tenglashtiradi."
      },
      {
        question: "Halqumning konstriktor (siquvchi) mushaklari nechta va qaysilar?",
        options: ["3 ta: M. constrictor pharyngis superior, medius va inferior", "2 ta", "4 ta", "6 ta"],
        correctAnswerIndex: 0,
        explanation: "Halqum devorida ketma-ket joylashgan yuqori, o'rta va pastki siquvchi mushaklar ovqat luqmasini qizilo'ngachga suradi."
      },
      {
        question: "Qizilo'ngach (Esophagus) umurtqa pog'onasining qaysi sathi oralig'ida joylashadi?",
        options: ["C6 (6-bo'yin umurtqasi) dan Th11 (11-ko'krak umurtqasi) gacha", "C1 dan Th5 gacha", "Th1 dan L1 gacha", "C3 dan Th8 gacha"],
        correctAnswerIndex: 0,
        explanation: "Qizilo'ngach C6 sohasida halqum davomi sifatida boshlanib, Th11 sohasida oshqozonga o'tadi (uzunligi 25 sm)."
      },
      {
        question: "Qizilo'ngachning anatomik qismlari qaysilar?",
        options: ["Pars cervicalis (bo'yin), pars thoracica (ko'krak), pars abdominalis (qorin)", "Faqat ko'krak qismi", "Pars anterior va posterior", "Pars muscularis va membranacea"],
        correctAnswerIndex: 0,
        explanation: "Qizilo'ngach 3 qismdan iborat: bo'yin (5 sm), ko'krak (15-18 sm) va diafragma ostidagi qorin qismi (2-3 sm)."
      },
      {
        question: "Qizilo'ngachning 3 ta anatomik toraymasi qayerlarda joylashgan?",
        options: ["1) Halqumdan boshlanishida (C6), 2) Chap bosh bronx va aorta yoyi bilan kesishgan joyida (Th4-Th5), 3) Diafragmadan o'tish joyida (Th10)", "Faqat boshlanishida", "Faqat oshqozonga quyilishida", "Har bir umurtqa sohasida"],
        correctAnswerIndex: 0,
        explanation: "Qizilo'ngachda farengeal (15 sm), bronxoaortal (25 sm) va diafragmal (40 sm) anatomik toraymalar mavjud."
      },
      {
        question: "Qizilo'ngach devorining mushak qavati (Tunica muscularis) qanday xususiyatga ega?",
        options: ["Yuqori 1/3 qismida ko'ndalang-targ'il, o'rta 1/3 qismida aralash, pastki 1/3 qismida silliq mushaklardan iborat", "Barcha qismida faqat silliq mushak", "Barcha qismida ko'ndalang-targ'il mushak", "Mushak qavati bo'lmaydi"],
        correctAnswerIndex: 0,
        explanation: "Qizilo'ngach mushak qavati yuqoridan pastga qarab ixtiyoriy (ko'ndalang-targ'il) to'qimadan silliq mushak to'qimasiga almashadi."
      },
      {
        question: "Qizilo'ngachning qorin qismi (Pars abdominalis) oshqozonning qaysi qismiga ochiladi?",
        options: ["Cardia (Kardial qismiga)", "Fundus", "Corpus", "Pylorus"],
        correctAnswerIndex: 0,
        explanation: "Qizilo'ngach diafragmaning hiatus esophageus teshigidan o'tib oshqozonning ostium cardiacum teshigiga tutashadi."
      },
      {
        question: "Qizilo'ngachning tashqi qavati (Tunica adventitia / serosa) qanday tuzilgan?",
        options: ["Bo'yin va ko'krak qismlarida adventitsiya (biriktiruvchi to'qima), qorin qismida esa seroza (qorin pardasi) bilan qoplangan", "To'liq seroza bilan qoplangan", "Faqat shilliq parda", "To'liq plevra bilan o'ralgan"],
        correctAnswerIndex: 0,
        explanation: "Ko'krak qafasida qizilo'ngach adventitsiya bilan qoplangan bo'lib erkin harakatlanadi, qorin qismi esa peritoneum bilan qoplanadi."
      },
      {
        question: "Tilning shilliq qavatining orqa 1/3 qismidan ta'm va umumiy sezgini qaysi nerv oladi?",
        options: ["Nervus glossopharyngeus (IX juft bosh miya nervi - Til-halqum nervi)", "Nervus lingualis (V3)", "Chorda tympani (VII)", "Nervus hypoglossus (XII)"],
        correctAnswerIndex: 0,
        explanation: "Til orqa 1/3 qismini (ildizini) IX juft nerv innervatsiya qiladi; oldingi 2/3 qism ta'mini chorda tympani (VII), umumiy sezgisini n. lingualis oladi."
      },
      {
        question: "Tilning barcha harakatlantiruvchi mushaklarini (m. palatoglossus'dan tashqari) qaysi nerv innervatsiya qiladi?",
        options: ["Nervus hypoglossus (XII juft bosh miya nervi - Til osti nervi)", "Nervus facialis (VII)", "Nervus vagus (X)", "Nervus trigeminus (V)"],
        correctAnswerIndex: 0,
        explanation: "Nervus hypoglossus (XII) tilning barcha ichki va skelet mushaklarini innervatsiya qiluvchi toza harakatlantiruvchi nervdir."
      },
      {
        question: "Yutish aktining ixtiyoriy (ongli) fazasi qayerda kechadi?",
        options: ["Og'iz bo'shlig'ida (luqmaning til orqali tomoq tomon surilishi)", "Halqumda", "Qizilo'ngachda", "Oshqozonda"],
        correctAnswerIndex: 0,
        explanation: "Yutishning og'iz fazasi ixtiyoriy bo'lib, luqma halqumga o'tgandan so'ng noiqtiyoriy reflektor fazalar boshlanadi."
      },
      {
        question: "Halqum orqa bo'shlig'i (Spatium retropharyngeum) orqali yallig'lanish jarayoni qayerga tarqalishi mumkin?",
        options: ["Orqa ko'ks oralig'iga (Mediastinum posterius - retrofarengeal mediastinit)", "Kalla qutisiga", "Ko'z kosasiga", "Plevra bo'shlig'iga"],
        correctAnswerIndex: 0,
        explanation: "Spatium retropharyngeum yumshoq biriktiruvchi to'qimaga boy bo'lib, to'g'ridan-to'g'ri ko'krak orqa mediastinumiga tushadi."
      },
      {
        question: "Halqum qaysi umurtqa darajasida qizilo'ngachga davom etadi?",
        options: ["VI bo'yin umurtqasi (C6) pastki qirrasi sohasida (uzuksimon tog'ay pastki chetida)", "III bo'yin umurtqasida", "I ko'krak umurtqasida", "IV bo'yin umurtqasida"],
        correctAnswerIndex: 0,
        explanation: "Halqum-qizilo'ngach chegarasi C6 umurtqa va Cartilago cricoidea pastki chetiga to'g'ri keladi."
      },
      {
        question: "Qattiq tanglayning shilliq qavati ostida qaysi mayda bezlar ko'p joylashgan?",
        options: ["Glandulae palatinae (tanglay so'lak bezlari)", "Glandulae labiales", "Glandulae buccales", "Glandulae linguales"],
        correctAnswerIndex: 0,
        explanation: "Qattiq va yumshoq tanglay shilliq osti qavatida juda ko'p shilliq ishlab chiqaruvchi Glandulae palatinae bezlari joylashadi."
      }
    ]
  },

  // ==========================================
  // TOPIC 2 (Order 15): Qorin bo‘shlig‘i a’zolari: oshqozon, ichaklar, jigar, o‘t pufagi, oshqozon osti bezi
  // ==========================================
  {
    topicOrder: 15,
    topicKeywords: ["oshqozon", "gaster", "ichak", "duodenum", "hepar", "jigar", "o't pufagi", "pancreas", "oshqozon osti bezi", "colon"],
    quizzes: [
      {
        question: "Oshqozon (Gaster / Ventriculus) ning asosiy anatomik qismlari qaysilar?",
        options: ["Pars cardiaca, Fundus (Fornix), Corpus, Pars pylorica (Antrum va Canalis pyloricus)", "Pars superior va inferior", "Caput, collum, cauda", "Lobus dexter va sinister"],
        correctAnswerIndex: 0,
        explanation: "Oshqozon kardial qism, gumbaz (tubi), tana va pilorik (antrum va kanal) qismlardan iborat."
      },
      {
        question: "Oshqozonning kichik egriligi (Curvatura minor) va katta egriligi (Curvatura major) qayerga qaragan?",
        options: ["Kichik egrilik yuqoriga va o'ngga, katta egrilik pastga va chapga qaragan", "Kichik egrilik pastga, katta yuqoriga", "Ikkalasi ham orqaga", "Kichik egrilik chapga"],
        correctAnswerIndex: 0,
        explanation: "Curvatura minor o'ngga va yuqoriga qarab jigar tomon burilgan, Curvatura major esa chapga va pastga qaragan."
      },
      {
        question: "Oshqozon shilliq qavatining париeтал (qoplovchi) hujayralari nima ishlab chiqaradi?",
        options: ["Xlorid kislota (HCl) va Kastl ichki omili (B12 vitamini so'rilishi uchun)", "Pepsinogen", "Shilliq (mutsin)", "Gistamin"],
        correctAnswerIndex: 0,
        explanation: "Parietal hujayralar HCl va eritropoez uchun zarur Castle ichki faktorini sintezlaydi."
      },
      {
        question: "O'n ikki barmoqli ichak (Duodenum) ning qismlari qaysilar?",
        options: ["Pars superior (bulbus), Pars descendens, Pars horizontalis, Pars ascendens", "Pars cardiaca va pylorica", "Jejunum va ileum", "Colon ascendens va descendens"],
        correctAnswerIndex: 0,
        explanation: "Duodenum taqa shaklida bo'lib, yuqori (lampochka), tushuvchi, gorizontal va ko'tariluvchi qismlardan iborat."
      },
      {
        question: "Katta duodenal so'rg'ich (Papilla duodeni major / Fater so'rg'ichi) o'n ikki barmoqli ichakning qaysi qismida joylashgan?",
        options: ["Pars descendens'ning medial devori orqa qismida", "Pars superior'da", "Pars horizontalis'da", "Pars ascendens'da"],
        correctAnswerIndex: 0,
        explanation: "Papilla duodeni major tushuvchi qismda bo'lib, unga umumiy o't yo'li va oshqozon osti bezi bosh yo'li ochiladi."
      },
      {
        question: "Ingichka ichak (Intestinum tenue) ning bo'limlari qanday ketma-ketlikda joylashadi?",
        options: ["Duodenum (o'n ikki barmoqli ichak) -> Jejunum (och ichak) -> Ileum (yonbosh ichak)", "Ileum -> Jejunum -> Duodenum", "Duodenum -> Caecum -> Colon", "Jejunum -> Duodenum -> Ileum"],
        correctAnswerIndex: 0,
        explanation: "Ingichka ichak 3 bo'limdan iborat: Duodenum (25-30 sm), Jejunum (2/5 qismi) va Ileum (3/5 qismi)."
      },
      {
        question: "Ingichka ichak shilliq qavatidagi so'rilish yuzasini yuzlab marta oshiruvchi mikroskopik tuzilmalar nima?",
        options: ["Villi intestinales (ichak vorsinkalari / tukchalari)", "Plicae circulares", "Haustra coli", "Cryptae"],
        correctAnswerIndex: 0,
        explanation: "Villi intestinales ichak shilliq qavatining mikroskopik o'simtalari bo'lib, ozuqa moddalarni kapillyar va limfaga so'radi."
      },
      {
        question: "Yo'g'on ichak (Intestinum crassum) ning ingichka ichakdan ajratib turuvchi 3 ta asosiy tashqi belgisi qaysilar?",
        options: ["1) Teniae coli (3 ta bo'ylama lenta), 2) Haustra coli (bo'rtiqlar), 3) Appendices epiploicae (yog'li o'simtalar)", "Vorsinkalarning ko'pligi", "Peyyer pilakchalari", "Halqasimon burmalar"],
        correctAnswerIndex: 0,
        explanation: "Yo'g'on ichakda teniyalar, gaustralar va seroza ostidagi charvi o'simtalari bo'ladi, vorsinkalar bo'lmaydi."
      },
      {
        question: "Ko'richak (Caecum) ning chuvalchangsimon o'simtasi (Appendix vermiformis) qaysi sohada joylashadi?",
        options: ["O'ng yonbosh chuqurchasida (Fossa iliaca dextra)", "Chap yonbosh chuqurchasida", "Epigastrium'da", "Kindik sohasida"],
        correctAnswerIndex: 0,
        explanation: "Caecum va appendix o'ng yonbosh sohasida yotadi va 3 ta lentaning birlashgan nuqtasidan boshlanadi."
      },
      {
        question: "Jigar (Hepar) ning qorin pardasiga nisbatan yotishi (skeletotopiyasi) qanday?",
        options: ["Asosan o'ng qovurg'a osti sohasida (Regio hypochondriaca dextra), qisman epigastrium va chap qovurg'a ostiga o'tadi", "Chap tomonda", "Kichik chanoqda", "Faqat kindik sohasida"],
        correctAnswerIndex: 0,
        explanation: "Jigar o'ng gipoxondriyani to'liq, qorin usti sohasini va chap gipoxondriyaning bir qismini egallaydi."
      },
      {
        question: "Jigarning visseral yuzasidagi (Facies visceralis) qaysi egatlar H-harfini hosil qiladi?",
        options: ["Ikkita bo'ylama egat (Sulcus longitudinalis dexter et sinister) va bitta ko'ndalang egat (Porta hepatis)", "Faqat bitta ko'ndalang egat", "Sulcus coronarius", "Fissura horizontalis"],
        correctAnswerIndex: 0,
        explanation: "H-harfi shaklidagi egatlar orqali jigar 4 bo'lakka (o'ng, chap, kvadrat va dumli) bo'linadi."
      },
      {
        question: "Jigar darvozasi (Porta hepatis) orqali nimalar kiradi va nima chiqadi?",
        options: ["Kiradi: Vena portae, Arteria hepatica propria, nervlar; Chiqadi: Ductus hepaticus communis va limfa tomirlari", "Faqat pastki kovak vena", "Faqat umumiy o't yo'li kiradi", "Aorta kiradi"],
        correctAnswerIndex: 0,
        explanation: "Jigar darvozasiga V. portae va A. hepatica propria kiradi, o'ng va chap o't yo'llari qo'shilib Ductus hepaticus communis bo'lib chiqadi."
      },
      {
        question: "Jigarning morfofunksional birligi nima?",
        options: ["Jigar bo'lakchasi (Lobulus hepatis)", "Nefron", "Asinus", "Alveola"],
        correctAnswerIndex: 0,
        explanation: "Lobulus hepatis geksagonal (oltiburchakli) ustunlardan iborat bo'lib, markazida Vena centralis o'tadi."
      },
      {
        question: "O't pufagi (Vesica biliaris / fellea) qaysi qismlardan iborat?",
        options: ["Fundus (tubi), Corpus (tanasi), Collum (bo'yni)", "Caput, cauda", "Pars cardiaca va pylorica", "Ampulla va isthmus"],
        correctAnswerIndex: 0,
        explanation: "O't pufagi noksimon bo'lib, tubi, tanasi va pufak yo'liga (ductus cysticus) o'tuvchi bo'yindan iborat."
      },
      {
        question: "Umumiy o't yo'li (Ductus choledochus) qaysi ikki yo'lning qo'shilishidan hosil bo'ladi?",
        options: ["Ductus hepaticus communis (umumiy jigar yo'li) va Ductus cysticus (pufak yo'li)", "Ductus pancreaticus va ductus hepaticus", "Ductus thoracicus va cysticus", "O'ng va chap jigar yo'llari"],
        correctAnswerIndex: 0,
        explanation: "Ductus hepaticus communis pufak yo'li (ductus cysticus) bilan qo'shilib Ductus choledochus'ni hosil qiladi."
      },
      {
        question: "Oshqozon osti bezi (Pancreas) ning anatomik qismlari qaysilar?",
        options: ["Caput pancreatis (boshi), Corpus pancreatis (tanasi), Cauda pancreatis (dumi)", "Lobus dexter va sinister", "Fundus va corpus", "Cortex va medulla"],
        correctAnswerIndex: 0,
        explanation: "Pancreas o'n ikki barmoqli ichak taqasiga kirib turgan bosh, tana va taloqqa yetib boruvchi dum qismlaridan iborat."
      },
      {
        question: "Oshqozon osti bezining endokrin qismi nima deb ataladi va nima ishlab chiqaradi?",
        options: ["Langergans orolchalari (Insulae pancreaticae); Insulin va Glyukagon gormonlarini ishlab chiqaradi", "Asinuslar; me'da shirasini", "Peyyer pilakchalari", "Kupffer hujayralari"],
        correctAnswerIndex: 0,
        explanation: "Langergans orolchalari beta-hujayralardan insulin, alfa-hujayralardan glyukagon ajratib qondagi qand miqdorini boshqaradi."
      },
      {
        question: "Oshqozon osti bezi ekzokrin qismining asosiy chiqaruv yo'li (Ductus pancreaticus / Virsung yo'li) qayerga ochiladi?",
        options: ["Ductus choledochus bilan birga Duodenumning Papilla duodeni major'iga", "Oshqozonga", "Jejunum'ga", "O't pufagiga"],
        correctAnswerIndex: 0,
        explanation: "Virsung yo'li umumiy o't yo'li bilan qo'shilib Oddi sfinkteri orqali katta duodenal so'rg'ichga ochiladi."
      },
      {
        question: "Oshqozon sfinkterlaridan ovqatning o'n ikki barmoqli ichakka o'tishini boshqaruvchi mushak halqasi qaysi?",
        options: ["Musculus sphincter pylori (Pilorik sfinkter)", "Sphincter cardiae", "Sphincter Oddi", "Sphincter ani"],
        correctAnswerIndex: 0,
        explanation: "M. sphincter pylori oshqozonning sirkulyar mushak qavati qalinlashuvidan hosil bo'lib, ximus o'tishini dozalaydi."
      },
      {
        question: "Oshqozonning mushak qavati (Tunica muscularis) nechta qavatdan iborat?",
        options: ["3 qavatdan: tashqi bo'ylama (stratum longitudinale), o'rta aylanma (stratum circulare), ichki qiya (fibrae obliquae)", "2 qavatdan", "1 qavatdan", "4 qavatdan"],
        correctAnswerIndex: 0,
        explanation: "Oshqozonda ovqatni yaxshilab ezish va aralashtirish uchun 3 qavat mushak tolalari mavjud."
      },
      {
        question: "Yo'g'on ichakning qismlari ketma-ketligi to'g'ri ko'rsatilgan qatorni toping:",
        options: ["Caecum -> Colon ascendens -> Colon transversum -> Colon descendens -> Colon sigmoideum -> Rectum", "Rectum -> Caecum -> Colon", "Colon ascendens -> Caecum -> Rectum", "Duodenum -> Jejunum -> Colon"],
        correctAnswerIndex: 0,
        explanation: "Ko'richak -> Ko'tariluvchi chambar -> Ko'ndalang chambar -> Tushuvchi chambar -> Sigmasimon chambar -> To'g'ri ichak."
      },
      {
        question: "Chambar ichakning jigar ostidagi burilishi nima deb ataladi?",
        options: ["Flexura coli dextra (Flexura hepatica)", "Flexura coli sinistra", "Flexura duodenojejunalis", "Flexura perinealis"],
        correctAnswerIndex: 0,
        explanation: "Flexura coli dextra ko'tariluvchi chambar ichakning ko'ndalang chambar ichakka o'tish burchagidir."
      },
      {
        question: "Chambar ichakning taloq ostidagi yuqoriroq joylashgan burilishi qaysi?",
        options: ["Flexura coli sinistra (Flexura lienalis)", "Flexura coli dextra", "Flexura hepatica", "Flexura sacralis"],
        correctAnswerIndex: 0,
        explanation: "Flexura coli sinistra ko'ndalang chambar ichakning tushuvchi chambar ichakka o'tish burchagi bo'lib, o'ng burilishdan balandroq yotadi."
      },
      {
        question: "To'g'ri ichak (Rectum) ning kengaygan o'rta qismi nima deyiladi?",
        options: ["Ampulla recti (to'g'ri ichak ampulasi)", "Canalis analis", "Flexura sacralis", "Zona hemorrhoidalis"],
        correctAnswerIndex: 0,
        explanation: "Ampulla recti to'g'ri ichakning najas to'planadigan eng keng qismidir."
      },
      {
        question: "To'g'ri ichakning tashqi sfinkteri (M. sphincter ani externus) qanday mushak to'qimasidan tuzilgan?",
        options: ["Ko'ndalang-targ'il (skelet) mushak to'qimasidan (ixtiyoriy boshqariladi)", "Silliq mushak to'qimasidan (noiqtiyoriy)", "Biriktiruvchi to'qimadan", "Elastik tog'aydan"],
        correctAnswerIndex: 0,
        explanation: "Tashqi anal sfinkter ixtiyoriy ko'ndalang-targ'il mushak bo'lib, oraliq mushaklariga kiradi; ichki sfinkter esa silliq mushakdir."
      },
      {
        question: "Ingichka ichakdagi guruhlangan limfoid follikulalar (Peyyer pilakchalari) asosan qaysi ichakda ko'p bo'ladi?",
        options: ["Ileum (Yonbosh ichakda)", "Duodenum'da", "Oshqozonda", "To'g'ri ichakda"],
        correctAnswerIndex: 0,
        explanation: "Noduli lymphoidei aggregati (Peyyer pilakchalari) ayniqsa yonbosh ichak shilliq qavatida immun himoya sifatida ko'p uchraydi."
      },
      {
        question: "Taloq (Splen / Lien) qorin bo'shlig'ining qaysi sohasida joylashgan?",
        options: ["Chap qovurg'a osti sohasida (Regio hypochondriaca sinistra), 9-11 qovurg'alar sohasida", "O'ng qovurg'a ostida", "Kichik chanoqda", "Kindik ostida"],
        correctAnswerIndex: 0,
        explanation: "Taloq chap gipoxondriyada 9-11 qovurg'alar ro'parasida yotuvchi qon hosil qiluvchi va immun a'zodir."
      },
      {
        question: "Jigarning yumaloq boylami (Ligamentum teres hepatis) nimaning obliteratsiyaga uchragan (bitib ketgan) qoldig'i?",
        options: ["Embrional kindik venasi (Vena umbilicalis) qoldig'i", "Kindik arteriyasi qoldig'i", "Ductus venosus qoldig'i", "Siydik yo'li qoldig'i"],
        correctAnswerIndex: 0,
        explanation: "Lig. teres hepatis homilaning platsentadan qon olib keluvchi Vena umbilicalis tomirining tug'ruqdan keyin bitib ketgan boylamidir."
      },
      {
        question: "Jigarning yuqori (diafragmaga qaragan) yuzasini o'ng va chap bo'lakka qaysi boylam ajratadi?",
        options: ["Ligamentum falciforme hepatis (o'roqsimon boylam)", "Ligamentum coronarium", "Ligamentum triangulare", "Ligamentum hepatoduodenale"],
        correctAnswerIndex: 0,
        explanation: "Ligamentum falciforme sagittal yo'nalgan bo'lib, jigar ustki yuzasini o'ng va chap bo'laklarga ajratadi."
      },
      {
        question: "Bavosil (gemorroy) tugunlari to'g'ri ichakning qaysi zonasida venalarning kengayishidan hosil bo'ladi?",
        options: ["Zona hemorrhoidalis (anal kanalining ustunlar sohasidagi venoz chigalda)", "Ampulla recti yuqorisida", "Flexura sacralis'da", "Seroza qavatida"],
        correctAnswerIndex: 0,
        explanation: "Zona hemorrhoidalis'dagi Plexus venosus rectalis tomirlarining kengayishi gemorroy kasalligiga sabab bo'ladi."
      }
    ]
  },

  // ==========================================
  // TOPIC 3 (Order 16): Qorin pardasi va qorin bo‘shlig‘i topografiyasi
  // ==========================================
  {
    topicOrder: 16,
    topicKeywords: ["peritoneum", "qorin pardasi", "omentum", "mesenterium", "bursa omentalis", "retroperitoneal", "charvi"],
    quizzes: [
      {
        question: "Qorin pardasi (Peritoneum) qanday ikki varaqdan iborat?",
        options: ["Peritoneum parietale (devoriy) va Peritoneum viscerale (a'zolarni qoplovchi)", "Peritoneum superficiale va profundum", "Lamina externa va interna", "Tunica mucosa va serosa"],
        correctAnswerIndex: 0,
        explanation: "Peritoneum qorin devorini ichkaridan qoplovchi pariyetal va ichki a'zolarni o'rab turuvchi visseral varaqlardan iborat."
      },
      {
        question: "A'zoning qorin pardasiga nisbatan har tomondan to'liq o'ralishi qanday ataladi?",
        options: ["Intraperitoneal (intraperitoneal holat)", "Mezoperitoneal holat", "Ekstraperitoneal / retroperitoneal holat", "Subperitoneal holat"],
        correctAnswerIndex: 0,
        explanation: "Intraperitoneal a'zolar (masalan, oshqozon, ingichka ichak) qorin pardasi bilan to'liq o'ralgan bo'lib, tutqichga (mesenterium) ega bo'ladi."
      },
      {
        question: "Mezoperitoneal holatda yotuvchi a'zolar qorin pardasi bilan qanday qoplanadi?",
        options: ["Uch tomonidan qoplanadi, bir tomoni ochiq qoladi (masalan, jigar, ko'tariluvchi va tushuvchi chambar ichak)", "To'rt tomondan to'liq qoplanadi", "Faqat bir tomondan qoplanadi", "Umuman qoplanmaydi"],
        correctAnswerIndex: 0,
        explanation: "Mezoperitoneal a'zolar 3 tomondan qoplanadi, erkin tutqichi bo'lmaydi."
      },
      {
        question: "Ekstraperitoneal (retroperitoneal) holatda yotuvchi a'zolarga qaysilar kiradi?",
        options: ["Buyraklar, buyrak usti bezlari, siydik naylari, qorin aortasi, pastki kovak vena", "Oshqozon va taloq", "Ingichka ichak va ko'richak", "Jigar va o't pufagi"],
        correctAnswerIndex: 0,
        explanation: "Retroperitoneal a'zolar qorin pardasining orqasida yotadi va faqat oldingi yuzasigina parda bilan qoplanadi."
      },
      {
        question: "Kichik charvi (Omentum minus) qaysi boylamlardan tashkil topgan?",
        options: ["Ligamentum hepatogastricum (jigar-oshqozon) va Ligamentum hepatoduodenale (jigar-o'n ikki barmoqli ichak)", "Ligamentum gastrocolicum va falciforme", "Ligamentum gastrolienale va phrenicocolicum", "Ligamentum coronarium"],
        correctAnswerIndex: 0,
        explanation: "Omentum minus jigar darvozasidan oshqozon kichik egriligi va duodenum yuqori qismiga tortilgan ikki qavatli boylamdir."
      },
      {
        question: "Jigar-duodenal boylam (Ligamentum hepatoduodenale) ichida o'ngdan chapga qarab qanday tuzilmalar (D-V-A qoidasi) o'tadi?",
        options: ["O'ngda: Ductus choledochus, o'rtada (orqada): Vena portae, chapda: Arteria hepatica propria", "O'ngda arteriya, chapda o't yo'li", "O'rtada arteriya, o'ngda vena", "Hammasi aralash"],
        correctAnswerIndex: 0,
        explanation: "D-V-A qoidasi: eng o'ngda umumiy o't yo'li (Ductus), o'rtada orqaroqda darvoza venasi (Vena) va chapda xususiy jigar arteriyasi (Arteria)."
      },
      {
        question: "Katta charvi (Omentum majus) qayerdan boshlanadi va nechta seroz varaqdan hosil bo'ladi?",
        options: ["Oshqozonning katta egriligidan boshlanib, 4 qavat qorin pardasi varag'idan hosil bo'ladi va ichaklarni old tomondan fartukdek yopadi", "Jigar darvozasidan boshlanadi, 2 qavat", "Kindikdan boshlanadi, 1 qavat", "Ko'ndalang chambar ichakdan boshlanadi, 3 qavat"],
        correctAnswerIndex: 0,
        explanation: "Omentum majus oshqozon katta egriligidan pastga osilib tushuvchi 4 qavatli qorin pardasi hosilasi bo'lib, politsiyachi vazifasini bajaradi."
      },
      {
        question: "Charvi xaltasi (Bursa omentalis) ning oldingi devorini nimalar hosil qiladi?",
        options: ["Kichik charvi (Omentum minus), oshqozonning orqa devori va Ligamentum gastrocolicum", "Qorin orqa devori", "Jigar ustki yuzasi", "Ko'ndalang chambar ichak tutqichi"],
        correctAnswerIndex: 0,
        explanation: "Bursa omentalis oshqozon orqasidagi eng katta yopiq xalta bo'lib, oldingi devori kichik charvi va oshqozon orqa devoridir."
      },
      {
        question: "Charvi teshigi (Foramen omentale / Foramen epiploicum / Vinslov teshigi) qayerda joylashgan?",
        options: ["Ligamentum hepatoduodenale orqasida bo'lib, charvi xaltasini katta qorin bo'shlig'i bilan bog'laydi", "Oshqozon ichida", "Taloq orqasida", "Kindik sohasida"],
        correctAnswerIndex: 0,
        explanation: "Vinslov teshigi Bursa omentalis'ga kirish yagona tabiiy teshik bo'lib, jigar-duodenal boylam orqasida joylashadi."
      },
      {
        question: "Jigar xaltasi (Bursa hepatica) qayerda joylashgan?",
        options: ["Jigarning o'ng bo'lagi ustida, diafragma ostida", "Oshqozon ostida", "Kichik chanoqda", "Taloq yonida"],
        correctAnswerIndex: 0,
        explanation: "Bursa hepatica o'ng gipoxondriyada diafragma va jigarning o'ng bo'lagi orasida joylashgan bo'shliqdir."
      },
      {
        question: "Me'da oldi xaltasi (Bursa pregastrica) qaysi a'zolarni o'z ichiga oladi?",
        options: ["Jigarning chap bo'lagi va oshqozonning oldingi yuzasi hamda taloqni", "Faqat buyraklarni", "Faqat to'g'ri ichakni", "Ko'richakni"],
        correctAnswerIndex: 0,
        explanation: "Bursa pregastrica jigarning chap bo'lagi oldida, oshqozon oldingi devori va taloq sohasini o'z ichiga oladi."
      },
      {
        question: "Och va yonbosh ichak tutqichi (Mesenterium) ildizi (Radix mesenterii) qayerdan qayerga yo'nalgan?",
        options: ["L2 umurtqa tanasi chapidan (Flexura duodenojejunalis) boshlanib, o'ng dumg'aza-yonbosh bo'g'imiga (Articulatio sacroiliaca dextra) qiya tushadi", "O'ngdan chapga gorizontal", "Vertikal o'rtada", "To'g'ri ichakdan oshqozonga"],
        correctAnswerIndex: 0,
        explanation: "Radix mesenterii uzunligi 15-18 sm bo'lib, L2 chap tomonidan o'ng yonbosh chuqurchasiga qarab qiya tushadi."
      },
      {
        question: "O'ng yon kanal (Sulcus paracolicus dexter) qayerdan qayerga davom etadi?",
        options: ["Ko'tariluvchi chambar ichak va qorinning o'ng yon devori orasida bo'lib, jigar xaltasidan o'ng yonbosh chuqurchasiga tutashadi", "Chap tomonda joylashgan", "Faqat kichik chanoqda", "Charvi xaltasida"],
        correctAnswerIndex: 0,
        explanation: "O'ng parakolik kanal orqali yallig'lanish suyuqligi jigar ostidan to'g'ridan-to'g'ri o'ng yonbosh va chanoqqa oqib tushishi mumkin."
      },
      {
        question: "Chap yon kanal (Sulcus paracolicus sinister) ning yuqori tomoni nima bilan berkilgan?",
        options: ["Ligamentum phrenicocolicum (diafragma-chambar boylam) bilan", "Jigar bilan", "Taloq bilan", "Oshqozon bilan"],
        correctAnswerIndex: 0,
        explanation: "Chap parakolik kanal yuqoridan lig. phrenicocolicum bilan to'silgan bo'lib, suyuqlik bevosita yuqoriga o'tmaydi."
      },
      {
        question: "O'ng tutqich sinusi (Sinus mesentericus dexter) nimalar bilan chegaralangan?",
        options: ["O'ngdan ko'tariluvchi chambar ichak, yuqoridan ko'ndalang chambar ichak tutqichi, chapdan ingichka ichak tutqichi ildizi bilan", "Faqat oshqozon bilan", "Qorin old devori bilan", "To'g'ri ichak bilan"],
        correctAnswerIndex: 0,
        explanation: "Sinus mesentericus dexter uchburchak shaklda bo'lib, berk sinus hisoblanadi."
      },
      {
        question: "Chap tutqich sinusi (Sinus mesentericus sinister) pastki tomondan qayerga bevosita tutashadi?",
        options: ["Kichik chanoq bo'shlig'iga (Cavitas pelvis minor)", "Charvi xaltasiga", "Jigar xaltasiga", "Ko'krak bo'shlig'iga"],
        correctAnswerIndex: 0,
        explanation: "Chap mezenterial sinus pastga qarab to'siqsiz kichik chanoq bo'shlig'iga davom etadi."
      },
      {
        question: "Ayollarda qorin bo'shlig'ining eng pastki, chuqur cho'ntagi qaysi?",
        options: ["Excavatio rectouterina (Duglas bo'shlig'i / to'g'ri ichak-bachadon chuqurchasi)", "Excavatio vesicouterina", "Fossa paravesicalis", "Bursa omentalis"],
        correctAnswerIndex: 0,
        explanation: "Duglas bo'shlig'i ayollarda qorin pardasining eng pastki nuqtasi bo'lib, qon va yiring to'planishida punktat olinadi."
      },
      {
        question: "Erkaklarda qorin pardasining eng pastki cho'ntagi qaysi?",
        options: ["Excavatio rectovesicalis (to'g'ri ichak-qovuq chuqurchasi)", "Excavatio rectouterina", "Fossa inguinalis lateralis", "Cavum Retzii"],
        correctAnswerIndex: 0,
        explanation: "Erkaklarda qorin pardasi qovuqdan to'g'ri ichakka o'tib yagona chuqur Excavatio rectovesicalis hosil qiladi."
      },
      {
        question: "Qorin pardasi bo'shlig'i (Cavitas peritonealis) erkak va ayollarda qanday farqlanadi?",
        options: ["Erkaklarda to'liq berk bo'shliq; ayollarda fallopiy naylari, bachadon va qin orqali tashqi muhit bilan tutashadi", "Erkaklarda ochiq, ayollarda berk", "Ikkalasida ham berk", "Ikkalasida ham ochiq"],
        correctAnswerIndex: 0,
        explanation: "Ayollarda Tuba uterina'ning qorin teshigi orqali qorin bo'shlig'i tashqi jinsiy yo'llar bilan tutashadi."
      },
      {
        question: "Qorin old devori ichki yuzasida kindik tomon yo'nalgan qaysi 5 ta burma (plicae) mavjud?",
        options: ["Plica umbilicalis mediana (toq), 2 ta Plica umbilicalis medialis va 2 ta Plica umbilicalis lateralis", "3 ta ko'ndalang burma", "Faqat bitta vertikal burma", "4 ta lateral burma"],
        correctAnswerIndex: 0,
        explanation: "Qorin pardasi ichki yuzasida 1 ta o'rta (urachus), 2 ta medial (obliteratsiyalangan a. umbilicalis) va 2 ta lateral (a. epigastrica inferior) burmalar yotadi."
      },
      {
        question: "Qorin old devoridagi Lateral chov chuqurchasi (Fossa inguinalis lateralis) nimaga to'g'ri keladi?",
        options: ["Chov kanalining chuqur teshigiga (Anulus inguinalis profundus) to'g'ri keladi", "Tashqi chov teshigiga", "Son kanaliga", "Kindik halqasiga"],
        correctAnswerIndex: 0,
        explanation: "Fossa inguinalis lateralis plica umbilicalis lateralis'dan tashqarida bo'lib, chuqur chov halqasiga to'g'ri keladi."
      },
      {
        question: "Qorin pardasining qorin bo'shlig'i a'zolarini o'zaro ishqalanishdan saqlash uchun ajratadigan suyuqligi miqdori qancha?",
        options: ["Normada 50-100 ml seroz suyuqlik", "2 litr", "10 ml dan kam", "Suyuqlik ajratmaydi"],
        correctAnswerIndex: 0,
        explanation: "Peritoneum varaqlari orasida ichki a'zolarning erkin siljishini ta'minlovchi oz miqdorda seroz suyuqlik bo'ladi."
      },
      {
        question: "Qorin bo'shlig'ida patologik suyuqlik (assit) to'planganda u qaysi xususiyatga ega bo'ladi?",
        options: ["Gravitatsiya qonuniga ko'ra eng pastki chuqurchalarga (Duglas chuqurchasi, yon kanallarga) oqib tushadi", "Faqat diafragma ostida turadi", "Ichak ichiga so'riladi", "Oshqozonga quyiladi"],
        correctAnswerIndex: 0,
        explanation: "Erkin suyuqlik qorin bo'shlig'ining pastki maydonlariga va yon kanallarga yig'iladi."
      },
      {
        question: "Qorin bo'shlig'i yuqori qavati (Etaj superior) qaysi chegaralar orasida joylashgan?",
        options: ["Diafragma gumbazidan Ko'ndalang chambar ichak va uning tutqichigacha (Mesocolon transversum)", "Kindikdan qovgacha", "Ko'ndalang ichakdan kichik chanoqqacha", "Faqat jigar sohasida"],
        correctAnswerIndex: 0,
        explanation: "Yuqori qavat diafragma va Mesocolon transversum orasida bo'lib, jigar, me'da oldi va charvi xaltalarini o'z ichiga oladi."
      },
      {
        question: "Qorin bo'shlig'i o'rta qavati (Etaj medium) qaysi sohani egallaydi?",
        options: ["Mesocolon transversum'dan Kichik chanoqqa kirish chizig'igacha (Linea terminalis)", "Diafragmadan to'shgacha", "Faqat charvi xaltasini", "Kichik chanoq tubigacha"],
        correctAnswerIndex: 0,
        explanation: "O'rta qavatda ingichka ichak qovuzloqlari, chambar ichak bo'limlari, tutqich sinuslari va yon kanallar joylashadi."
      },
      {
        question: "Qorin bo'shlig'i pastki qavati (Etaj inferior) qayerda joylashgan?",
        options: ["Linea terminalis'dan pastda, Kichik chanoq bo'shlig'ida", "Kindik sohasida", "Epigastriumda", "Ko'ndalang ichak ustida"],
        correctAnswerIndex: 0,
        explanation: "Pastki qavat kichik chanoq a'zolari (qovuq, to'g'ri ichak, bachadon) va qorin pardasi cho'ntaklarini o'z ichiga oladi."
      },
      {
        question: "Duodenojejunal cho'ntak (Recessus duodenojejunalis / Treyts cho'ntagi) qayerda joylashgan?",
        options: ["Flexura duodenojejunalis sohasida, ingichka ichak boshlanishida (ichki grijalar chiqishi mumkin)", "O't pufagi tagida", "To'g'ri ichak yonida", "Ko'richak ostida"],
        correctAnswerIndex: 0,
        explanation: "Recessus duodenojejunalis o'n ikki barmoqli ichakning och ichakka o'tish burchagidagi qorin pardasi cho'ntagidir."
      },
      {
        question: "Ko'richak atrofidagi qorin pardasi cho'ntaklariga qaysilar kiradi?",
        options: ["Recessus ileocecalis superior, Recessus ileocecalis inferior va Recessus retrocecalis", "Recessus duodenalis", "Recessus intersigmoideus", "Bursa omentalis"],
        correctAnswerIndex: 0,
        explanation: "Ko'richak va yonbosh ichak tutashgan sohada yuqori, pastki va ko'richak orti cho'ntaklari mavjud."
      },
      {
        question: "Sigmasimon ichaklararo cho'ntak (Recessus intersigmoideus) qayerda joylashgan?",
        options: ["Sigmasimon ichak tutqichining chap tomonidagi chuqurchada", "Jigar ostida", "Ko'richak orqasida", "Oshqozon ustida"],
        correctAnswerIndex: 0,
        explanation: "Recessus intersigmoideus chap yonbosh sohasida mesocolon sigmoideum varaqlarining orasida bo'ladi."
      },
      {
        question: "Qorin pardasining sezuvchi (og'riq) innervatsiyasi qanday amalga oshadi?",
        options: ["Pariyetal parda somatik nervlar (qovurg'alararo nervlar va n. phrenicus) bilan boy ta'minlangan (o'tkir lokal og'riq); visseral parda vegetativ nervlar bilan (nohaniq og'riq)", "Faqat simpatik nervlar orqali", "Pariyetal pardada nerv bo'lmaydi", "Faqat adashgan nerv orqali"],
        correctAnswerIndex: 0,
        explanation: "Pariyetal peritoneum o'tkir somatik og'riqni (peritonit belgilari) sezadi, visseral parda esa diffuz cho'zilish og'rig'ini beradi."
      }
    ]
  },

  // ==========================================
  // TOPIC 4 (Order 17): Nafas tizimi: burun, hiqildoq, traxeya, bronxlar, o‘pka, plevra
  // ==========================================
  {
    topicOrder: 17,
    topicKeywords: ["nafas", "burun", "hiqildoq", "traxeya", "bronx", "o'pka", "plevra", "nasus", "larynx", "pulmo"],
    quizzes: [
      {
        question: "Burun bo'shlig'ining (Cavitas nasi) yuqori, o'rta va pastki burun yo'llari qanday hosil bo'ladi?",
        options: ["Uchta burun chig'anoqlari (Concha nasalis superior, media, inferior) ostidagi bo'shliqlardan", "Burun suyaklari orasidan", "Yuz mushaklari orasidan", "Peshona suyagi ichidan"],
        correctAnswerIndex: 0,
        explanation: "Burun bo'shlig'ining yon devoridagi yuqori, o'rta va pastki chig'anoqlar ostida mos ravishda 3 ta burun yo'li hosil bo'ladi."
      },
      {
        question: "Ko'z yosh-burun nayi (Ductus nasolacrimalis) burun bo'shlig'ining qaysi yo'liga ochiladi?",
        options: ["Meatus nasi inferior (Pastki burun yo'liga)", "Meatus nasi medius", "Meatus nasi superior", "Meatus nasi communis"],
        correctAnswerIndex: 0,
        explanation: "Ko'z yosh suyuqligi ko'z yosh xaltasidan pastki burun yo'liga (Meatus nasi inferior) quyiladi."
      },
      {
        question: "Burun atrofidagi Gaymor bo'shlig'i (Sinus maxillaris) qaysi burun yo'liga ochiladi?",
        options: ["Meatus nasi medius (O'rta burun yo'liga)", "Meatus nasi inferior", "Meatus nasi superior", "Dahlizga"],
        correctAnswerIndex: 0,
        explanation: "O'rta burun yo'liga sinus maxillaris, sinus frontalis va g'alvir suyagining oldingi hamda o'rta katakchalari ochiladi."
      },
      {
        question: "Hiqildoq (Larynx) ning toq tog'aylari (Cartilagines laryngis) qaysilar?",
        options: ["Cartilago thyroidea (qalqonsimon), Cartilago cricoidea (uzuksimon), Cartilago epiglottica (hiqildoq usti tog'ayi)", "Cartilago arytenoidea va corniculata", "Cartilago cuneiformis va triticea", "Faqat uzuksimon tog'ay"],
        correctAnswerIndex: 0,
        explanation: "Hiqildoqda 3 ta toq (qalqonsimon, uzuksimon, hiqildoq usti) va 3 juft juft (cho'michoqsimon, shoxsimon, ponasimon) tog'aylar bo'ladi."
      },
      {
        question: "Hiqildoqning juft tog'aylaridan ovoz boylamlari birikadigan eng muhim tog'ay qaysi?",
        options: ["Cartilago arytenoidea (Cho'michoqsimon tog'ay)", "Cartilago corniculata", "Cartilago cuneiformis", "Cartilago thyroidea"],
        correctAnswerIndex: 0,
        explanation: "Cho'michoqsimon tog'ayning ovoz o'simtasiga (processus vocalis) haqiqiy ovoz boylami (Ligamentum vocale) birikadi."
      },
      {
        question: "Ovoz yorig'i (Rima glottidis) qaysi anatomik tuzilmalar orasida joylashgan?",
        options: ["O'ng va chap haqiqiy ovoz burmalari (Plicae vocales) orasida", "Hiqildoq dahliz burmalari orasida", "Hiqildoq usti tog'ayi va til orasida", "Traxeya halqalari orasida"],
        correctAnswerIndex: 0,
        explanation: "Rima glottidis hiqildoq bo'shlig'ining eng tor joyi bo'lib, haqiqiy ovoz boylamlari orasidagi yoriqdir."
      },
      {
        question: "Ovoz boylamlarini taranglovchi (tortuvchi) yagona mushak qaysi?",
        options: ["Musculus cricothyroideus (uzuk-qalqonsimon mushak)", "Musculus cricoarytenoideus posterior", "Musculus arytenoideus transversus", "Musculus thyroarytenoideus"],
        correctAnswerIndex: 0,
        explanation: "M. cricothyroideus qalqonsimon tog'ayni oldinga egib, ovoz boylamlarini taranglaydi va ovozni ingichkalashtiradi."
      },
      {
        question: "Ovoz yorig'ini kengaytiruvchi YAGONA mushak qaysi?",
        options: ["Musculus cricoarytenoideus posterior (orqa uzuk-cho'michoq mushagi)", "Musculus cricoarytenoideus lateralis", "Musculus vocalis", "Musculus thyroepiglotticus"],
        correctAnswerIndex: 0,
        explanation: "M. cricoarytenoideus posterior ovoz o'simtasini tashqariga burib ovoz yorig'ini kengaytiradi (falajlansa asfiksiya bo'ladi)."
      },
      {
        question: "Hiqildoqning deyarli barcha mushaklarini (m. cricothyroideus'dan tashqari) qaysi nerv innervatsiya qiladi?",
        options: ["Nervus laryngeus recurrens (qaytuvchi hiqildoq nervi - n. vagus tarmog'i)", "Nervus glossopharyngeus", "Nervus accessorius", "Nervus phrenicus"],
        correctAnswerIndex: 0,
        explanation: "N. laryngeus recurrens hiqildoqning deyarli barcha ichki mushaklarini harakatlantiruvchi nervi hisoblanadi."
      },
      {
        question: "Traxeya (Nafas yo'li) nechta gialin tog'ay yarimhalqalaridan (Cartilagines tracheales) iborat?",
        options: ["16-20 ta tog'ay yarimhalqalaridan", "8-10 ta", "25-30 ta", "Faqat 5 ta"],
        correctAnswerIndex: 0,
        explanation: "Traxeya 16-20 ta orqasi ochiq taqasimon gialin tog'ay yarimhalqalaridan iborat bo'lib, uzunligi 9-11 sm."
      },
      {
        question: "Traxeyaning orqa pardali devori (Paries membranaceus) nimaga taqalib turadi?",
        options: ["Qizilo'ngachning oldingi devoriga (ovqat luqmasi o'tishiga xalal bermaslik uchun)", "Umurtqa tanasiga", "Ko'krak aortasiga", "O'pkaga"],
        correctAnswerIndex: 0,
        explanation: "Traxeyaning orqa devorida tog'ay bo'lmaydi (membranali va silliq mushak) va to'g'ridan-to'g'ri qizilo'ngachga tegib turadi."
      },
      {
        question: "Traxeyaning ikkita bosh bronxga bo'linish sohasi nima deyiladi va qaysi umurtqa sohasida yotadi?",
        options: ["Bifurcatio tracheae (Th4-Th5 umurtqalar darajasida)", "Carina tracheae (C6 darajasida)", "Apex tracheae (Th1 darajasida)", "Hilum tracheae"],
        correctAnswerIndex: 0,
        explanation: "Traxeya Th4-Th5 ko'krak umurtqalari darajasida o'ng va chap bosh bronxlarga bo'linadi (Bifurcatio tracheae)."
      },
      {
        question: "O'ng bosh bronx (Bronchus principalis dexter) ning chap bosh bronxdan anatomik farqi nimada?",
        options: ["Kengroq, kaltaroq va vertikalroq yo'nalgan (yot jismlar ko'proq o'ng bronxga tushadi)", "Uzunroq va ingichkaroq", "Gorizontalroq", "Tog'ayi bo'lmaydi"],
        correctAnswerIndex: 0,
        explanation: "O'ng bosh bronx traxeyaning davomidek vertikal, qisqa va keng bo'lgani uchun yot jism ko'pincha o'ng o'pkaga tushadi."
      },
      {
        question: "O'ng o'pka (Pulmo dexter) va chap o'pka (Pulmo sinister) nechta bo'lakdan (lobi) iborat?",
        options: ["O'ng o'pka 3 bo'lak (yuqori, o'rta, pastki), chap o'pka 2 bo'lak (yuqori va pastki)", "O'ng o'pka 2 ta, chap o'pka 3 ta", "Ikkalasi ham 3 tadan", "Ikkalasi ham 2 tadan"],
        correctAnswerIndex: 0,
        explanation: "O'ng o'pka 3 bo'lakli (fissura obliqua va horizontalis), chap o'pka yurak joylashgani uchun 2 bo'lakli (fissura obliqua)."
      },
      {
        question: "O'ng o'pka darvozasida (Hilum pulmonis) anatomik tuzilmalar yuqoridan pastga qarab qanday joylashadi (B-A-V qoidasi)?",
        options: ["Bronx (yuqorida), O'pka arteriyasi (o'rtada), O'pka venalari (pastda)", "Arteriya, Bronx, Vena", "Vena, Arteriya, Bronx", "Bronx, Vena, Arteriya"],
        correctAnswerIndex: 0,
        explanation: "O'ng o'pka darvozasida eng yuqorida Bosh bronx (B), o'rtada o'pka arteriyasi (A), pastda o'pka venalari (V) yotadi (BAV)."
      },
      {
        question: "Chap o'pka darvozasida anatomik tuzilmalar yuqoridan pastga qarab qanday joylashadi (A-B-V qoidasi)?",
        options: ["O'pka arteriyasi (yuqorida), Bosh bronx (o'rtada), O'pka venalari (pastda)", "Bronx, Arteriya, Vena", "Vena, Arteriya, Bronx", "Arteriya, Vena, Bronx"],
        correctAnswerIndex: 0,
        explanation: "Chap o'pka darvozasida eng yuqorida O'pka arteriyasi (A), o'rtada bosh bronx (B), pastda o'pka venalari (V) yotadi (ABV)."
      },
      {
        question: "O'pkaning har birida nechta bronx-o'pka segmenti (Segmenta bronchopulmonalia) mavjud?",
        options: ["O'ng o'pkada 10 ta, chap o'pkada 9-10 ta segment", "Har birida 5 tadan", "Har birida 15 tadan", "Har birida 2 tadan"],
        correctAnswerIndex: 0,
        explanation: "O'pkalarda 10 tadan mustaqil segmental bronx va arteriyaga ega bo'lgan morfofunksional segmentlar mavjud."
      },
      {
        question: "O'pkaning gaz almashinuvini bajaruvchi asosiy morfofunksional birligi nima?",
        options: ["Asinus (Acini pulmonares)", "Segment", "Bo'lakcha (Lobulus)", "Alveola"],
        correctAnswerIndex: 0,
        explanation: "Asinus respirator bronxiola, alveolyar yo'llar, xaltachalar va kapillyarlar bilan o'ralgan alveolalarni o'z ichiga oluvchi gaz almashinuv birligidir."
      },
      {
        question: "Alveolalarning ichki yuzasini qoplab, ularning nafas chiqarganda yopishib (kollaps) qolishiga yo'l qo'ymaydigan modda nima?",
        options: ["Surfaktant (Surfactant)", "Mukopolisaxarid", "Gialuron kislota", "Gistamin"],
        correctAnswerIndex: 0,
        explanation: "Surfaktant II turdagi alveolyar epitelotsitlar ishlab chiqaradigan sirt-faol fosfolipid bo'lib, yuzaki taranglikni kamaytiradi."
      },
      {
        question: "Plevra bo'shlig'i (Cavitas pleuralis) qaysi varaqlar orasidagi tirqishsimon yopiq bo'shliq?",
        options: ["Pleura parietalis (devoriy plevra) va Pleura visceralis (o'pka plevrasi) orasida", "Ikki o'pka orasida", "Perikard va plevra orasida", "Ko'krak qafasi mushaklari orasida"],
        correctAnswerIndex: 0,
        explanation: "Plevra bo'shlig'i o'pkani o'rovchi visseral va ko'krak devorini qoplovchi pariyetal plevra orasidagi manfiy bosimli bo'shliqdir."
      },
      {
        question: "Plevra bo'shlig'ining eng pastki va eng katta cho'ntagi (sinusi) qaysi?",
        options: ["Recessus costodiaphragmaticus (qovurg'a-diafragma sinusi)", "Recessus costomediastinalis", "Recessus phrenicomediastinalis", "Recessus vertebralis"],
        correctAnswerIndex: 0,
        explanation: "Recessus costodiaphragmaticus plevraning eng pastki chuqurligi bo'lib, plevritda suyuqlik eng birinchi shu yerga yig'iladi."
      },
      {
        question: "Asosiy nafas olish (inhalation) mushagi qaysi?",
        options: ["Diafragma (Diaphragma) va tashqi qovurg'alararo mushaklar (Mm. intercostales externi)", "Qorin to'g'ri mushagi", "Ichki qovurg'alararo mushaklar", "Katta ko'krak mushagi"],
        correctAnswerIndex: 0,
        explanation: "Diafragma qisqarganda gumbazi pastga tushib ko'krak bo'shlig'i hajmini 70% ga kengaytiradi."
      },
      {
        question: "Tinch holatda nafas chiqarish (exhalation) qanday mexanizm orqali kechadi?",
        options: ["Passiv jarayon bo'lib, o'pkaning elastik tortishishi va nafas mushaklarining bo'shashishi hisobiga", "Faqat qorin mushaklarining kuchli qisqarishi bilan", "Diafragmaning kuchli tortilishi bilan", "Faol harakat orqali"],
        correctAnswerIndex: 0,
        explanation: "Tinch ekspiratsiya mushak kuchi talab qilmaydi, o'pka to'qimasining elastik qaytishi orqali passiv yuz beradi."
      },
      {
        question: "O'pkaning tepa qismi (Apex pulmonis) old tomondan qayergacha ko'tariladi?",
        options: ["O'mrov suyagidan 2-3 sm yuqoriga (1-qovurg'adan 3-4 sm yuqoriga)", "O'mrov suyagi ostigacha", "Bo'yin o'rtasigacha", "Jag' ostigacha"],
        correctAnswerIndex: 0,
        explanation: "Apex pulmonis o'mrov suyagi ustiga 2-3 sm chiqib, apertura thoracis superior sohasida yotadi."
      },
      {
        question: "Chap o'pkaning oldingi chetidagi yurak hosil qilgan o'yiq nima deyiladi?",
        options: ["Incisura cardiaca pulmonis sinistri (yurak o'yig'i)", "Lingula pulmonis", "Sulcus aorticus", "Impressio oesophagea"],
        correctAnswerIndex: 0,
        explanation: "Chap o'pkaning oldingi chetida yurak yotishi sababli chuqur Incisura cardiaca va pastida Lingula (tilcha) hosil bo'ladi."
      },
      {
        question: "O'pkaning oziqlantiruvchi xususiy arteriyalari qaysilar?",
        options: ["Rami bronchiales (ko'krak aortasidan chiquvchi bronxial tarmoqlar)", "Arteria pulmonalis", "Arteria coronaria", "Arteria subclavia"],
        correctAnswerIndex: 0,
        explanation: "A. pulmonalis faqat gaz almashinuviga xizmat qiladi; o'pka to'qimasini esa aorta tarmoqlari rami bronchiales oziqlantiradi."
      },
      {
        question: "Plevra bo'shlig'ida normal holatda bosim qanday bo'ladi?",
        options: ["Atmosfera bosimidan past (manfiy bosim: -4 dan -8 mm simob ustuni)", "Atmosfera bosimidan yuqori", "Nolga teng", "100 mm simob ustuni"],
        correctAnswerIndex: 0,
        explanation: "Plevra bo'shlig'idagi manfiy bosim o'pka alveolalarini doimiy ochiq va kengaygan holda ushlab turadi."
      },
      {
        question: "Pnevmotoraks nima?",
        options: ["Plevra bo'shlig'iga havo kirishi natijasida manfiy bosim yo'qolib, o'pkaning kollapsga uchrashi (burishishi)", "O'pkaning yallig'lanishi", "Bronxlarning spazmi", "O'pkada qon to'xtashi"],
        correctAnswerIndex: 0,
        explanation: "Plevra devori shikastlanib havo kirsa (pnevmotoraks), o'pka elastik kuchi hisobiga qisqarib faoliyatdan to'xtaydi."
      },
      {
        question: "Bronxlar daraxtining (Arbor bronchialis) oxirgi tog'aysiz va bezsiz ingichka shoxlari qaysi?",
        options: ["Bronchioli terminales (terminal bronxiolalar)", "Bronchi segmentales", "Bronchi lobares", "Bronchus principalis"],
        correctAnswerIndex: 0,
        explanation: "Terminal bronxiolalar diametri 0.5 mm bo'lib, ularda tog'ay va bezlar bo'lmaydi, silliq mushak qavatiga ega."
      },
      {
        question: "Ko'ks oralig'i (Mediastinum) nima?",
        options: ["O'ng va chap plevra xaltalari orasida joylashgan ko'krak a'zolari majmuasi", "Faqat o'pkalarning o'zi", "Qovurg'alararo soha", "Qorin parda bo'shlig'i"],
        correctAnswerIndex: 0,
        explanation: "Mediastinum ikki o'pka plevra varaqlari orasidagi soha bo'lib, yurak, yirik qon tomirlar, traxeya, qizilo'ngachni o'z ichiga oladi."
      }
    ]
  },

  // ==========================================
  // TOPIC 5 (Order 18): Endokrin tizim: qalqonsimon, qalqon orqasi, buyrak usti bezlari
  // ==========================================
  {
    topicOrder: 18,
    topicKeywords: ["endokrin", "qalqonsimon", "glandula thyroidea", "parathyroidea", "suprarenalis", "gipofiz", "buyrak usti bezi"],
    quizzes: [
      {
        question: "Endokrin (ichki sekretsiya) bezlarining ekzokrin bezlardan asosiy farqi nimada?",
        options: ["Chiqaruvchi nayi bo'lmaydi, o'z gormonlarini to'g'ridan-to'g'ri qonga yoki limfaga ajratadi", "Faqat tashqariga shira ajratadi", "Nerv sistemasiga bo'ysunmaydi", "Epiteliy to'qimasidan tuzilmagan"],
        correctAnswerIndex: 0,
        explanation: "Endokrin bezlar nayga ega emasligi sababli biologik faol gormonlarni bevosita qon tomirlar kapillyar to'riga ajratadi."
      },
      {
        question: "Qalqonsimon bez (Glandula thyroidea) ning anatomik qismlari qaysilar?",
        options: ["Lobus dexter (o'ng bo'lak), Lobus sinister (chap bo'lak) va Isthmus (bo'yincha / qisqich)", "Caput, corpus, cauda", "Cortex va medulla", "Zona glomerulosa va fasciculata"],
        correctAnswerIndex: 0,
        explanation: "Qalqonsimon bez ikkita yon bo'lak va ularni birlashtiruvchi bo'yinchadan (isthmus) iborat bo'lib, hiqildoq oldida taqasimon yotadi."
      },
      {
        question: "Qalqonsimon bezning gistologik va funksional birligi nima?",
        options: ["Follikula (Folliculus glandulae thyroideae)", "Asinus", "Orolcha", "Osteon"],
        correctAnswerIndex: 0,
        explanation: "Bezdagi follikulalar kolloid suyuqlik bilan to'lgan bo'lib, devoridagi tirotsitlar yodli gormonlarni sintezlaydi."
      },
      {
        question: "Qalqonsimon bez qanday asosiy gormonlarni ishlab chiqaradi?",
        options: ["Tiroksin (T4), Triyodtironin (T3) va Kalsitonin (Tirokalsitonin)", "Insulin va glyukagon", "Kortizol va aldosteron", "Adrenalin va noradrenalin"],
        correctAnswerIndex: 0,
        explanation: "T3 va T4 asosiy moddalar almashinuvini kuchaytiradi; C-hujayralar ishlab chiqaradigan kalsitonin esa qondagi Ca2+ ni suyakka kiritib pasaytiradi."
      },
      {
        question: "Qalqon oldi / orqasi bezlari (Glandulae parathyroideae) soni nechta va qayerda joylashgan?",
        options: ["4 ta (2 juft: yuqori va pastki); qalqonsimon bez bo'laklarining orqa yuzasida fassiya ostida", "2 ta; buyrak ustida", "1 ta; miyada", "8 ta; yurak ustida"],
        correctAnswerIndex: 0,
        explanation: "Paratgormon bezlari odatda 4 ta bo'lib, qalqonsimon bezning orqa yuzasida kapsula ostida joylashadi."
      },
      {
        question: "Qalqon orqasi bezi gormoni (Parathormon) organizmda qanday vazifani bajaradi?",
        options: ["Qonda kalsiy (Ca2+) miqdorini oshiradi (suyakdan kalsiyni qonga chiqaradi, buyrakda reabsorbsiyani kuchaytiradi)", "Qonda kalsiyni kamaytiradi", "Qon bosimini pasaytiradi", "Qand miqdorini tushiradi"],
        correctAnswerIndex: 0,
        explanation: "Paratgormon kalsitoninning antagonisti bo'lib, qondagi kalsiy darajasini oshirishga javob beradi."
      },
      {
        question: "Buyrak usti bezi (Glandula suprarenalis) qaysi ikki asosiy qavatdan tuzilgan?",
        options: ["Cortex (po'stloq qavati - 80-90%) va Medulla (mag'iz qavati - 10-20%)", "Shilliq va seroz qavat", "Muskul va epiteliy", "Bo'lak va bo'lakcha"],
        correctAnswerIndex: 0,
        explanation: "Glandula suprarenalis tashqi mezodermal po'stloq va ichki ektodermal (simpatik tugun hosilasi) mag'iz qavatdan iborat."
      },
      {
        question: "Buyrak usti bezi po'stloq qavati (Cortex) qanday 3 ta zonadan iborat?",
        options: ["Zona glomerulosa (koptokchasimon), Zona fasciculata (tutamsimon), Zona reticularis (to'rsimon)", "Zona anterior, media, posterior", "Zona externa, interna", "Zona corticalis, medullaris"],
        correctAnswerIndex: 0,
        explanation: "Po'stloq tashqaridan ichkariga: koptokchasimon (mineralokortikoid), tutamsimon (glyukokortikoid) va to'rsimon (androgen) zonalardan iborat."
      },
      {
        question: "Buyrak usti bezi koptokchasimon zonasi (Zona glomerulosa) qaysi gormonni sintezlaydi?",
        options: ["Aldosteron (mineralokortikoid - Na+ ni ushlab qolib, K+ ni chiqaradi)", "Kortizol", "Adrenalin", "Testosteron"],
        correctAnswerIndex: 0,
        explanation: "Aldosteron buyrak kanalchalarida natriy va suv reabsorbsiyasini kuchaytirib qon bosimini boshqaradi."
      },
      {
        question: "Buyrak usti bezi tutamsimon zonasi (Zona fasciculata) qaysi gormonni ajratadi?",
        options: ["Kortizol / Gidrokortizon (glyukokortikoid - yallig'lanishga qarshi va stress gormoni)", "Aldosteron", "Adrenalin", "Insulin"],
        correctAnswerIndex: 0,
        explanation: "Kortizol glyukoneogenezni rag'batlantiradi, oqsillar parchalanishini oshiradi va kuchli yallig'lanishga qarshi ta'sir ko'rsatadi."
      },
      {
        question: "Buyrak usti bezi mag'iz qavati (Medulla) ning xromaffin hujayralari nima ishlab chiqaradi?",
        options: ["Katexolaminlar: Adrenalin (Epinefrin) va Noradrenalin (Norepinefrin)", "Kortizol", "Parathormon", "Tiroksin"],
        correctAnswerIndex: 0,
        explanation: "Mag'iz qavati simpatik nerv sistemasi ta'sirida o'tkir stress paytida adrenalin va noradrenalin ajratadi."
      },
      {
        question: "Gipofiz (Hypophysis / Glandula pituitaria) kalla suyagining qaysi anatomik tuzilmasida joylashgan?",
        options: ["Ponasimon suyakning turk egarchasi chuqurchasida (Fossa hypophysialis sellae turcicae)", "Peshona suyagida", "Ensa suyagi teshigida", "Chakka suyagi piramidasida"],
        correctAnswerIndex: 0,
        explanation: "Gipofiz miya asosida, ponasimon suyakning turk egarchasi chuqurchasida yotadi va oraliq miya bilan gipofiz oyog'i orqali bog'lanadi."
      },
      {
        question: "Gipofizning oldingi bo'lagi (Adenohipofiz) qanday trop gormonlar ishlab chiqaradi?",
        options: ["STH (somatotrop), TSH (tireotrop), ACTH (adrenokortikotrop), FSH, LH, Prolaktin", "Faqat oksitotsin", "Faqat vazopressin", "Adrenalin va noradrenalin"],
        correctAnswerIndex: 0,
        explanation: "Adenohipofiz barcha periferik endokrin bezlar ishini boshqaruvchi trop gormonlar va o'sish gormonini sintezlaydi."
      },
      {
        question: "Gipofizning orqa bo'lagi (Neyrohipofiz) da qaysi gormonlar to'planadi va qonga ajraladi?",
        options: ["Vazopressin (Antidiuretik gormon - ADH) va Oksitotsin", "O'sish gormoni", "Tiroksin", "Aldosteron"],
        correctAnswerIndex: 0,
        explanation: "Gipotalamusning supraoptik va paraventrikulyar yadrolarida sintezlangan ADH va Oksitotsin neyrohipofizga kelib to'planadi."
      },
      {
        question: "Epifiz (Glandula pinealis / Corpus pineale / G'uddasimon tana) qaysi gormonni ishlab chiqaradi?",
        options: ["Melatonin (sirkad ritm - uyqu va uyg'oqlik siklini boshqaradi)", "Tiroksin", "Adrenalin", "Insulin"],
        correctAnswerIndex: 0,
        explanation: "Epifiz epitalamus sohasida bo'lib, qorong'ida melatonin ishlab chiqarib biologik ritmlarni boshqaradi."
      },
      {
        question: "Timus (Ayrisimon bez / Glandula thymus) qayerda joylashadi va qachon maksimal rivojlanadi?",
        options: ["Oldingi ko'ks oralig'ida (Mediastinum anterius); bolalik va o'smirlik davrida maksimal bo'lib, keyin yog' to'qimasi bilan almashadi", "Qorin bo'shlig'ida", "Bo'yinda", "Kalla ichida"],
        correctAnswerIndex: 0,
        explanation: "Timus ko'krak to'sh suyagi orqasida yotadi, T-limfotsitlar differensiatsiyasini ta'minlaydi va yosh ulg'aygan sari involyutsiyaga uchraydi."
      },
      {
        question: "Qalqonsimon bezning qon bilan ta'minlanishi qaysi arteriyalar orqali amalga oshadi?",
        options: ["Arteria thyroidea superior (a. carotis externa'dan) va Arteria thyroidea inferior (truncus thyrocervicalis'dan)", "Faqat aorta yoyidan", "Arteria facialis'dan", "Arteria vertebralis'dan"],
        correctAnswerIndex: 0,
        explanation: "Qalqonsimon bez juda kuchli qon bilan ta'minlanadi: 2 ta yuqori va 2 ta pastki qalqonsimon arteriyalar orqali."
      },
      {
        question: "Tireotoksikoz (Bazedov kasalligi) da qalqonsimon bez funksiyasi qanday o'zgaradi?",
        options: ["Gipofunksiyasi emas, balki giperfunktsiyasi (T3 va T4 ko'payib ketishi) kuzatiladi", "Gormonlar umuman sintezlanmaydi", "Faqat kalsiy kamayadi", "O'zgarish bo'lmaydi"],
        correctAnswerIndex: 0,
        explanation: "Gipertireozda yurak urishi tezlashadi, ko'z bo'rtib chiqadi (ekzoftalm), asabiylashish va ozish yuz beradi."
      },
      {
        question: "Kretinizm kasalligi nimaning yetishmovchiligidan kelib chiqadi?",
        options: ["Bolalikda qalqonsimon bez gormonlarining (T3, T4) va yodning tug'ma yetishmovchiligidan", "Insulin yetishmovchiligidan", "O'sish gormoni ko'pligidan", "Kalsiy ko'pligidan"],
        correctAnswerIndex: 0,
        explanation: "Bolalikdagi gipotireoz jismoniy va aqliy rivojlanishning og'ir orqada qolishiga (kretinizm) olib keladi."
      },
      {
        question: "Kattalarda o'sish gormoni (STH) ortiqcha ishlab chiqarilishi qanday kasallikka sabab bo'ladi?",
        options: ["Akromegaliya (Akromegaly - yuz, qo'l va oyoq suyaklarining nomutanosib o'sishi)", "Gigantizm", "Nanizm (mittilik)", "Kushing sindromi"],
        correctAnswerIndex: 0,
        explanation: "Epifizal o'sish zonalari yopilgandan so'ng STH ko'payishi burun, jag', qo'l-oyoq panjalarining yo'g'onlashuviga (akromegaliya) sabab bo'ladi."
      },
      {
        question: "Bolalarda STH gormonining yetishmovchiligi qanday holatga olib keladi?",
        options: ["Gipofizar nanizm (mittilik / pakanalik)", "Gigantizm", "Akromegaliya", "Kretinizm"],
        correctAnswerIndex: 0,
        explanation: "Gipofizning somatotrop funksiyasi pasayishi mutanosib pakana bo'y o'sishiga (nanizm) olib keladi."
      },
      {
        question: "Itsenko-Kushing kasalligi nimaning gipersekretsiyasiga bog'liq?",
        options: ["Buyrak usti bezi po'stlog'i glyukokortikoidlari (kortizol) va AKTH ning ko'payishiga", "Tiroksin kamayishiga", "Insulin ko'payishiga", "Adrenalin kamayishiga"],
        correctAnswerIndex: 0,
        explanation: "Giperkortitsizm oy yuzlilik, tananing yuqori qismiga yog' to'planishi, gipertoniya va giperglikemiya bilan namoyon bo'ladi."
      },
      {
        question: "Bronza kasalligi (Addison kasalligi) qaysi a'zoning birlamchi yetishmovchiligida yuzaga keladi?",
        options: ["Buyrak usti bezi po'stlog'ining ikki tomonlama destruksiyasi yoki gipofunksiyasida", "Qalqonsimon bezda", "Gipofizda", "Oshqozon osti bezida"],
        correctAnswerIndex: 0,
        explanation: "Addison kasalligida mineralokortikoid va glyukokortikoidlar keskin kamayadi, terida bronza tusdagi giperpigmentatsiya paydo bo'ladi."
      },
      {
        question: "Qandsiz diabet (Diabetes insipidus) qaysi gormon yetishmovchiligida kuzatiladi?",
        options: ["Vazopressin (Antidiuretik gormon - ADH) yetishmovchiligida (kuniga 10-20 litr siydik ajralishi)", "Insulin yetishmovchiligida", "Glyukagon ko'pligida", "Tiroksin yetishmovchiligida"],
        correctAnswerIndex: 0,
        explanation: "ADH kamaysa buyrak naychalarida suv qayta so'rilmaydi va juda ko'p miqdorda suyultirilgan qandsiz siydik ajraladi (poliuriya)."
      },
      {
        question: "Gipotalamo-gipofizar tizimning asosiy boshqaruvchi neyrogormonlari nima deyiladi?",
        options: ["Liberinlar (rilizing-faktorlar - rag'batlantiruvchi) va Statinlar (tormozlovchi)", "Katexolaminlar", "Fermentlar", "Mediatorlar"],
        correctAnswerIndex: 0,
        explanation: "Gipotalamus liberinlar va statinlar ajratib adenohipofizning trop gormonlar sintezini bevosita boshqaradi."
      },
      {
        question: "Buyrak usti bezining o'ng va chap bezlarining shakli qanday?",
        options: ["O'ng bez uchburchak (piramida) shaklda, chap bez yarimoy (semilunar) shaklda", "Ikkalasi ham doira", "Ikkalasi ham kubsimon", "O'ng bez yarimoy, chap bez piramida"],
        correctAnswerIndex: 0,
        explanation: "O'ng buyrak usti bezi piramidasimon, chap buyrak usti bezi esa yarimoysimon shaklga ega."
      },
      {
        question: "Endokrin tizimning 'Markaziy boshqaruv a'zosi' qaysi?",
        options: ["Gipotalamus (Hypothalamus)", "Epifiz", "Qalqonsimon bez", "Buyrak usti bezi"],
        correctAnswerIndex: 0,
        explanation: "Gipotalamus asab va endokrin sistemalarni birlashtiruvchi oliy vegetativ va neyroendokrin markazdir."
      },
      {
        question: "Qalqonsimon bez operatsiyasida Nervus laryngeus recurrens zararlansa qanday asorat kuzatiladi?",
        options: ["Ovozning bo'g'ilishi (disfoniya) yoki butunlay yo'qolishi (afoniya)", "Yutinish qiyinlashuvi", "Ko'rish pasayishi", "Eshitish yo'qolishi"],
        correctAnswerIndex: 0,
        explanation: "N. laryngeus recurrens qalqonsimon bez orqasidan o'tgani uchun shikastlansa ovoz boylamlari falajlanadi."
      },
      {
        question: "Buyrak usti bezining xromaffin hujayralaridan rivojlanadigan o'sma (Feoxromotsitoma) qanday belgi beradi?",
        options: ["Katexolaminlar (adrenalin) keskin ko'payishi hisobiga xurujli og'ir gipertoniya (gipertonik kriz)", "Gipoglikemiya", "Semirish", "Uyquchanlik"],
        correctAnswerIndex: 0,
        explanation: "Feoxromotsitoma davriy ravishda juda ko'p adrenalin qonga chiqarib, arterial qon bosimini 250-300 mm sim. ustunigacha ko'taradi."
      },
      {
        question: "Kalsitonin gormoni qaysi hujayralarda hosil bo'ladi?",
        options: ["Qalqonsimon bezning parafollikulyar C-hujayralarida", "Follikulyar tirotsitlarda", "Paratireotsitlarda", "Langergans orolchalarida"],
        correctAnswerIndex: 0,
        explanation: "Parafollikulyar C-hujayralar neyroektodermadan kelib chiqqan bo'lib, kalsiyni pasaytiruvchi kalsitonin ishlab chiqaradi."
      }
    ]
  },

  // ==========================================
  // TOPIC 6 (Order 19): Siydik tizimi: buyrak, siydik yo‘llari, siydik pufagi
  // ==========================================
  {
    topicOrder: 19,
    topicKeywords: ["siydik", "ren", "nephros", "ureter", "vesica urinaria", "buyrak", "uretra", "qovuq"],
    quizzes: [
      {
        question: "Buyrak (Ren / Nephros) ning skeletotopiyasi (umurtqalarga nisbatan joylashishi) qanday?",
        options: ["Th12 dan L3 gacha (o'ng buyrak jigar bosgani sababli chap buyrakdan 1.5-2 sm pastda yotadi)", "Th1 dan Th6 gacha", "L4 dan S2 gacha", "Faqat ko'krak qafasida"],
        correctAnswerIndex: 0,
        explanation: "Chap buyrak Th11 pastki chetidan L2 gacha, o'ng buyrak Th12 dan L3 gacha retroperitoneal sohada yotadi."
      },
      {
        question: "Buyrakning fiksatsiya (ushlab turuvchi) apparatiga nimalar kiradi?",
        options: ["Buyrak fassiyasi (Fascia renalis), Yog' kapsulasi (Capsula adiposa), Buyrak oyoqchasi tomirlari va Qorin ichki bosimi", "Faqat qorin pardasi", "Faqat qovurg'alar", "Faqat siydik nayi"],
        correctAnswerIndex: 0,
        explanation: "Buyrakni o'z o'rnida fassiya, yog' kapsulasi, tomirlar to'plami va qorin pressi hosil qilgan ijobiy bosim ushlab turadi."
      },
      {
        question: "Buyrak darvozasi (Hilum renale) orqali nimalar o'tadi (V-A-U qoidasi)?",
        options: ["Oldindan orqaga: Vena renalis (oldingi), Arteria renalis (o'rta), Ureter / Pelvis renalis (orqa)", "Ureter, Vena, Arteriya", "Arteriya, Ureter, Vena", "Hammasi bir xil"],
        correctAnswerIndex: 0,
        explanation: "VAU qoidasi: buyrak darvozasida oldinda buyrak venasi, o'rtada buyrak arteriyasi va orqada buyrak jomi (siydik nayi) yotadi."
      },
      {
        question: "Buyrakning funksional-morfologik birligi nima?",
        options: ["Nefron (Nephron)", "Buyrak piramidasi", "Buyrak jomi", "Buyrak ustuni"],
        correctAnswerIndex: 0,
        explanation: "Har bir buyrakda taxminan 1-1.2 million nefron bo'lib, ular birlamchi va ikkilamchi siydik hosil qiladi."
      },
      {
        question: "Nefronning tarkibiy qismlari qaysilar?",
        options: ["Buyrak tanachasi (Malpigi koptokchasi va Shumlyanskiy-Boumen kapsulasi) hamda proksimal, Genle qovuzlog'i va distal naychalar", "Faqat buyrak jomi", "Faqat piramidalar", "Faqat yig'uvchi naychalar"],
        correctAnswerIndex: 0,
        explanation: "Nefron Malpigi tanachasi (koptokcha + kapsula), proksimal buralma naycha, Genle ilmog'i va distal buralma naychadan iborat."
      },
      {
        question: "Buyrak parenximasi qanday ikki qavatdan tashkil topgan?",
        options: ["Cortex renalis (po'stloq qavati - tashqi) va Medulla renalis (mag'iz qavati - piramidalar)", "Shilliq va seroz qavat", "Adventitsiya va intima", "Fassiya va parda"],
        correctAnswerIndex: 0,
        explanation: "Po'stloq qavatda buyrak tanachalari va buralma naychalar, mag'iz qavatda esa 10-15 ta buyrak piramidalari joylashadi."
      },
      {
        question: "Buyrak mag'iz moddasidagi piramidalar uchi (Papillae renales) qayerga ochiladi?",
        options: ["Calices renales minores (Kichik buyrak kosachalari)ga", "Katta kovak venaga", "To'g'ridan-to'g'ri qovuqqa", "Qorin bo'shlig'iga"],
        correctAnswerIndex: 0,
        explanation: "Piramida uchidagi so'rg'ichlar (7-8 ta) kichik kosachalarga ochilib, hosil bo'lgan ikkilamchi siydikni qabul qiladi."
      },
      {
        question: "Siydik hosil bo'lishining 3 ta bosqichi qaysilar?",
        options: ["1) Filtratsiya (koptokchalarda birlamchi siydik hosil bo'lishi), 2) Reabsorbsiya (naychalarda qayta so'rilish), 3) Sekretsiya", "Faqat so'rilish", "Faqat bug'lanish", "Eritish va parchalash"],
        correctAnswerIndex: 0,
        explanation: "Koptokchalarda sutkasiga 150-180 litr birlamchi siydik filtrlanadi, naychalarda 99% suv va foydali moddalar qayta so'rilib, 1.5 litr ikkilamchi siydik ajraladi."
      },
      {
        question: "Buyrakning 'Ajoyib qon tomir to'ri' (Rete mirabile) nimadan iborat?",
        options: ["Arteriola glomerularis afferens (keltiruvchi) -> Koptokcha kapillyarlari -> Arteriola glomerularis efferens (chiquvchi arteriola)", "Vena -> Kapillyar -> Vena", "Arteriya -> Vena anastomoz", "Limfa to'ri"],
        correctAnswerIndex: 0,
        explanation: "Arteriyaning kapillyar to'rga bo'linib yana arteriolaga aylanishi faqat buyrak koptokchalarida bo'ladi (yuqori filtratsion bosim uchun)."
      },
      {
        question: "Yukstaglomerulyar apparat (YGA) qanday muhim modda ishlab chiqarib qon bosimini boshqaradi?",
        options: ["Renin fermenti (Renin-Angiotenzin-Aldosteron tizimini faollashtiradi)", "Insulin", "Adrenalin", "Gistamin"],
        correctAnswerIndex: 0,
        explanation: "YGA hujayralari bosim tushganda yoki Na+ kamayganda Renin ishlab chiqarib kuchli vazokonstriksiyani ta'minlaydi."
      },
      {
        question: "Siydik yo'li (Ureter) uzunligi qancha va qaysi qismlardan iborat?",
        options: ["25-30 sm uzunlikda; Pars abdominalis (qorin), Pars pelvina (chanoq) va Pars intramuralis (devor ichi)", "10 sm, faqat bitta qism", "50 sm, 4 qism", "5 sm"],
        correctAnswerIndex: 0,
        explanation: "Ureter buyrak jomidan boshlanib qovuqqacha 25-30 sm cho'zilib, qorin, chanoq va qovuq devoridan o'tuvchi intramural qismlarga bo'linadi."
      },
      {
        question: "Siydik nayining (Ureter) 3 ta fiziologik toraymasi qayerlarda joylashgan?",
        options: ["1) Jomdan siydik nayiga o'tish joyida, 2) Katta qon tomirlar (a. iliaca communis) bilan kesishgan joyida, 3) Qovuq devoriga kirish joyida", "Faqat o'rtasida", "Faqat boshlanishida", "Har bir santimetrida"],
        correctAnswerIndex: 0,
        explanation: "Ushbu 3 ta anatomik toraymada buyrak toshlari (konkrementlar) tiqilib buyrak sanchig'i (kolika) chaqiradi."
      },
      {
        question: "Siydik pufagi (Vesica urinaria) ning anatomik qismlari qaysilar?",
        options: ["Apex vesicae (cho'qqisi), Corpus vesicae (tanasi), Fundus vesicae (tubi), Cervix vesicae (bo'yni)", "Caput va cauda", "Cortex va medulla", "Lobus superior va inferior"],
        correctAnswerIndex: 0,
        explanation: "Siydik pufagi oldinga-yuqoriga qaragan cho'qqi, tana, orqa-pastdagi tubi va siydik chiqaruv kanaliga o'tuvchi bo'yindan iborat."
      },
      {
        question: "Siydik pufagi uchburchagi (Trigonum vesicae / Liyeto uchburchagi) ning shilliq qavati qanday o'ziga xoslikka ega?",
        options: ["Shilliq osti qavati yo'qligi sababli bu sohada burmalar umuman bo'lmaydi (silliq bo'ladi)", "Juda qalin burmali bo'ladi", "Vorsinkalarga boy", "Katakchali bo'ladi"],
        correctAnswerIndex: 0,
        explanation: "Liyeto uchburchagi 2 ta siydik nayi teshigi va uretra ichki teshigi orasida bo'lib, shilliq osti qavati yo'qligi sababli silliq turadi."
      },
      {
        question: "Siydik pufagining devorini siquvchi va siydik haydovchi mushak nima deyiladi?",
        options: ["Musculus detrusor vesicae (Detruzor mushagi)", "Musculus sphincter urethrae", "Musculus cremaster", "Musculus psoas major"],
        correctAnswerIndex: 0,
        explanation: "M. detrusor vesicae qovuq devoridagi 3 qavat silliq mushak to'plami bo'lib, qisqarganda siydikni tashqariga haydaydi."
      },
      {
        question: "Siydik pufagining ichki sfinkteri (M. sphincter vesicae internus) qanday boshqariladi?",
        options: ["Silliq mushakdan tuzilgan bo'lib, vegetativ nerv sistemasi tomonidan noiqtiyoriy boshqariladi", "Ixtiyoriy boshqariladi", "Faqat ongli ravishda", "Boshqarilmaydi"],
        correctAnswerIndex: 0,
        explanation: "Ichki sfinkter simpatik/parasimpatik tizim orqali noiqtiyoriy ochilib-yopiladi; tashqi uretra sfinkteri esa ixtiyoriydir."
      },
      {
        question: "Ayollar siydik chiqaruv kanali (Urethra feminina) ning erkaklar uretasidan farqi nimada?",
        options: ["Kalta (3-4 sm) va keng bo'lib, to'g'ri yo'nalgan (infeksiyalar tez tushishi oson)", "Uzun (18-20 sm) va tor", "S shaklida egilgan", "Urug' o'tkazadi"],
        correctAnswerIndex: 0,
        explanation: "Ayollar uretrasi 3-4 sm bo'lib, faqat siydik chiqarishga xizmat qiladi va qisqaligi sababli sistit kasalligi tez-tez uchraydi."
      },
      {
        question: "Erkaklar siydik chiqaruv kanali (Urethra masculina) ning anatomik qismlari qaysilar?",
        options: ["Pars prostatica (prostata qismi), Pars membranacea (pardali qism), Pars spongiosa (g'ovak qism)", "Pars abdominalis va pelvina", "Pars superior va inferior", "Pars vesicalis va scrotalis"],
        correctAnswerIndex: 0,
        explanation: "Erkaklar uretrasi uzunligi 18-20 sm bo'lib, prostata bezidan, oraliq diafragmasidan va jinsiy olat g'ovak tanasidan o'tadi."
      },
      {
        question: "Bo'sh holatdagi siydik pufagi qayerda joylashgan?",
        options: ["Kichik chanoqda, qov simfizining orqasida (qorin pardasi ostida - ekstraperitoneal)", "Kindik sohasida", "Qorin bo'shlig'i yuqori qavatida", "Son sohasida"],
        correctAnswerIndex: 0,
        explanation: "Bo'sh qovuq chanoqda simfiz orqasida yotadi; to'lgan sari yuqoriga ko'tarilib qorin old devoriga tegadi (mezoperitoneal holatga o'tadi)."
      },
      {
        question: "Buyrak jomi (Pelvis renalis) ning shakllanishi qanday kechadi?",
        options: ["7-8 ta kichik kosachalar birlashib 2-3 ta katta kosachalarni (Calices renales majores), ular esa jomni hosil qiladi", "To'g'ridan-to'g'ri kapillyarlardan", "Mag'iz qavatdan to'g'ridan-to'g'ri", "Siydik nayi kengayishidan"],
        correctAnswerIndex: 0,
        explanation: "Calices minores -> Calices majores -> Pelvis renalis -> Ureter ketma-ketligida siydik yig'iladi."
      },
      {
        question: "Buyrak kapsulalari ichkaridan tashqariga qanday ketma-ketlikda o'raladi?",
        options: ["Capsula fibrosa (tolali) -> Capsula adiposa (yog') -> Fascia renalis (fassiya)", "Fassiya -> Fibroz -> Yog'", "Yog' -> Fibroz -> Fassiya", "Seroza -> Mushak -> Shilliq"],
        correctAnswerIndex: 0,
        explanation: "Buyrak parenximasiga fibroz kapsula yopishgan, uni yog' kapsulasi o'raydi va tashqaridan oldingi-orqa fassiya varaqlari qoplaydi."
      },
      {
        question: "Buyrak ustuni (Columnae renales / Bertin ustunlari) nima?",
        options: ["Buyrak po'stloq moddasining piramidalar orasiga chuqur kirib borgan qismlari", "Yog' to'qimasi", "Bog'lovchi paylar", "Buyrak tomirlari"],
        correctAnswerIndex: 0,
        explanation: "Bertin ustunlari po'stloq moddaning buyrak piramidalarini bir-biridan ajratib turuvchi chuqur qismlaridir."
      },
      {
        question: "Nefroptoz nima?",
        options: ["Buyrakning o'z o'rnidan pastga siljishi yoki tushib ketishi (sayyor buyrak)", "Buyrak yallig'lanishi", "Buyrakda tosh paydo bo'lishi", "Buyrak saratoni"],
        correctAnswerIndex: 0,
        explanation: "Fiksatsiya apparati (ayniqsa yog' kapsulasi) zaiflashganda buyrak qorin bo'shlig'i yoki chanoqqa tushib ketadi (nefroptoz)."
      },
      {
        question: "Siydik ajralishining to'liq to'xtashi nima deyiladi?",
        options: ["Anuriya (Anuria)", "Oliguriya", "Poliuriya", "Disuriya"],
        correctAnswerIndex: 0,
        explanation: "Sutkalik siydik miqdori 50 ml dan kam bo'lishi yoki butunlay bo'lmasligi Anuriya deyiladi."
      },
      {
        question: "Gematuriya nima?",
        options: ["Siydikda qon (eritrotsitlar) paydo bo'lishi", "Siydikda oqsil bo'lishi", "Siydikda leykotsitlar ko'payishi", "Siydikda qand bo'lishi"],
        correctAnswerIndex: 0,
        explanation: "Siydikda qon chiqishi (eritrotsitlar) gematuriya deyiladi (buyrak, jom, qovuq shikastlanishida uchraydi)."
      },
      {
        question: "Erkaklar uretrasining 2 ta egri burilishi (Curvatura) qaysilar?",
        options: ["Curvatura infrapubica (qov osti - doimiy) va Curvatura prepubica (qov oldi - o'zgaruvchan)", "Curvatura superior va inferior", "Curvatura anterior va posterior", "Burilishlari bo'lmaydi"],
        correctAnswerIndex: 0,
        explanation: "Qov osti egriligi suyakka fiksatsiyalangan bo'lib o'zgarmaydi, qov oldi egriligi jinsiy olat ko'tarilganda to'g'rilanadi."
      },
      {
        question: "Qovuqning to'lishini sezuvchi retseptorlar qaysi nerv orqali orqa miyaga impuls beradi?",
        options: ["Nervi splanchnici pelvici (chanoq ichki nervlari - S2-S4 parasimpatik tolalari)", "Nervus femoralis", "Nervus ischiadicus", "Nervus vagus"],
        correctAnswerIndex: 0,
        explanation: "S2-S4 segmentlardagi parasimpatik markaz qovuq to'lishini sezib, detruzorni qisqartiradi va sfinkterni bo'shashtiradi (miksiya refleksi)."
      },
      {
        question: "Buyrakning eritropoezni (qon hosil bo'lishini) rag'batlantiruvchi gormoni qaysi?",
        options: ["Eritropoetin (Erythropoietin)", "Trombopoetin", "Geparin", "Tiroksin"],
        correctAnswerIndex: 0,
        explanation: "Gipoksiya paytida buyrak interstitsial hujayralari eritropoetin ajratib, ko'mikda eritrotsitlar sintezini keskin oshiradi."
      },
      {
        question: "Siydik pufagi shilliq qavati qanday epiteliy bilan qoplangan?",
        options: ["O'tuvchi epiteliy (Epithelium transitionale / Uroteliy)", "Bir qavatli yassi epiteliy", "Ko'p qavatli muguzlanuvchi epiteliy", "Xilpillovchi epiteliy"],
        correctAnswerIndex: 0,
        explanation: "Uroteliy siydik pufagi cho'zilganida o'z shaklini o'zgartirib, siydikning tajovuzkor kislotali muhitidan to'qimani himoya qiladi."
      },
      {
        question: "Qovuq yuqori cho'qqisidan kindikka tortilgan embrional boylam nima deyiladi?",
        options: ["Ligamentum umbilicale medianum (urachus - obliteratsiyalangan embrional siydik yo'li)", "Ligamentum teres", "Ligamentum falciforme", "Ligamentum inguinale"],
        correctAnswerIndex: 0,
        explanation: "Ligamentum umbilicale medianum homila uraxus yo'lining bitib ketgan o'rta kindik boylamidir."
      }
    ]
  },

  // ==========================================
  // TOPIC 7 (Order 20): Ayollar jinsiy tizimi. Sut bezi
  // ==========================================
  {
    topicOrder: 20,
    topicKeywords: ["ayollar", "ovarium", "uterus", "bachadon", "tuxumdon", "tuba uterina", "mamma", "vagina", "sut bezi"],
    quizzes: [
      {
        question: "Tuxumdon (Ovarium) qanday a'zo va qayerda joylashgan?",
        options: ["Juft ayol jinsiy bezi bo'lib, kichik chanoq bo'shlig'ida bachadonning ikki tomonida joylashgan", "Katta chanoqda", "Qorin usti sohasida", "Qov simfizi oldida"],
        correctAnswerIndex: 0,
        explanation: "Ovarium ham jinsiy hujayralar (ovotsit), ham jinsiy gormonlar (estrogen, progesteron) ishlab chiqaruvchi aralash bezdir."
      },
      {
        question: "Tuxumdonda yetilgan follikula yorilib, tuxum hujayraning qorin bo'shlig'iga chiqishi nima deyiladi?",
        options: ["Ovulyatsiya (Ovulatio)", "Menstruatsiya", "Fertilizatsiya", "Implantatsiya"],
        correctAnswerIndex: 0,
        explanation: "Hayz siklining o'rtasida (14-kuni) Graaf pufakchasi yorilib ovotsit chiqishi ovulyatsiya deyiladi."
      },
      {
        question: "Yorilgan follikula o'rnida qanday vaqtinchalik gormonal bez hosil bo'ladi?",
        options: ["Sariq tana (Corpus luteum) - progesteron gormonini ishlab chiqaradi", "Oq tana (Corpus albicans)", "Gipofiz", "Timus"],
        correctAnswerIndex: 0,
        explanation: "Corpus luteum progesteron ishlab chiqarib bachadon shilliq qavatini homiladorlikka tayyorlaydi."
      },
      {
        question: "Bachadon nayi (Tuba uterina / Fallopiy nayi) ning qismlari ketma-ketligi to'g'ri ko'rsatilgan qatorni toping:",
        options: ["Infundibulum (voronka va fimbriyalar) -> Ampulla -> Isthmus (bo'yincha) -> Pars uterina", "Pars uterina -> Ampulla -> Infundibulum", "Ampulla -> Isthmus -> Voronka", "Isthmus -> Pars uterina -> Ampulla"],
        correctAnswerIndex: 0,
        explanation: "Fallopiy nayi tuxumdon tomondan voronka bilan boshlanib, ampulla, bo'yincha va bachadon ichi qismlariga bo'linadi."
      },
      {
        question: "Urug'lanish (tuxum hujayra va spermatozoidning qo'shilishi) odatda bachadon nayining qaysi qismida yuz beradi?",
        options: ["Ampulla tubae uterinae (Nay ampulasida)", "Bachadon bo'shlig'ida", "Tuxumdonda", "Qinda"],
        correctAnswerIndex: 0,
        explanation: "Spermatozoid tuxum hujayra bilan odatda bachadon nayining eng keng qismi bo'lgan ampullada uchrashadi."
      },
      {
        question: "Bachadon (Uterus / Metra / Hystera) ning anatomik qismlari qaysilar?",
        options: ["Fundus uteri (tubi), Corpus uteri (tanasi), Isthmus (bo'yinchasi), Cervix uteri (bo'yni)", "Caput va cauda", "Cortex va medulla", "Lobus dexter va sinister"],
        correctAnswerIndex: 0,
        explanation: "Bachadon noksimon shaklda bo'lib, gumbazsimon tubi, tanasi, qisqich qismi va qinga ochiluvchi bo'ynidan iborat."
      },
      {
        question: "Bachadon devori qanday 3 ta qavatdan tashkil topgan?",
        options: ["Endometrium (shilliq qavat), Myometrium (mushak qavat), Perimetrium (seroz qavat)", "Intima, media, adventitia", "Mukoza, submukoza, adventitsiya", "Epikard, miokard, endokard"],
        correctAnswerIndex: 0,
        explanation: "Bachadon devori ichki endometriy (har oy yangilanadi), baquvvat silliq mushakli miometriy va tashqi perimetriydan iborat."
      },
      {
        question: "Bachadonning normal fiziologik holati qanday nomlanadi?",
        options: ["Anteversio-anteflexio (bachadon tanasi oldinga qarab egilgan va bo'yinga nisbatan oldinga burchak hosil qilgan)", "Retroflexio (orqaga egilgan)", "Lateroflexio", "Retroversio"],
        correctAnswerIndex: 0,
        explanation: "Bachadon qovuq ustiga oldinga egilgan bo'lib (anteflexio), bo'yni bilan o'tmas burchak hosil qiladi (anteversio)."
      },
      {
        question: "Bachadonni ushlab turuvchi asosiy keng boylam nima deyiladi?",
        options: ["Ligamentum latum uteri (bachadonning keng boylami - 2 qavat qorin pardasi dublikaturasi)", "Ligamentum teres uteri", "Ligamentum ovarii proprium", "Ligamentum cardinale"],
        correctAnswerIndex: 0,
        explanation: "Ligamentum latum uteri bachadon yon chetlaridan chanoq yon devorlariga tortilgan keng qorin pardasi qatlamidir."
      },
      {
        question: "Bachadonning yumaloq boylami (Ligamentum teres uteri) qayerdan o'tib qayerga birikadi?",
        options: ["Bachadon burchagidan boshlanib, chov kanali (canalis inguinalis) orqali o'tib katta jinsiy lablar to'qimasiga birikadi", "Chanoq suyagiga", "Tuxumdonga", "Qov simfiziga"],
        correctAnswerIndex: 0,
        explanation: "Lig. teres uteri chov kanali orqali o'tib katta lablar teri osti yog' qavatiga tarqaladi va bachadonni oldinga tortib turadi."
      },
      {
        question: "Bachadon bo'ynining qinga qaragan teshigi nima deyiladi?",
        options: ["Ostium uteri (bachadon tashqi teshigi)", "Ostium abdominale", "Orificium urethrae", "Fornix vaginae"],
        correctAnswerIndex: 0,
        explanation: "Ostium uteri tug'magan ayollarda yumaloq, tug'gan ayollarda ko'ndalang yoriq shaklida bo'ladi."
      },
      {
        question: "Qin (Vagina / Colpos) ning yuqori qismida bachadon bo'ynini o'rab turuvchi gumbazlar (Fornix vaginae) dan eng chuquri qaysi?",
        options: ["Fornix vaginae posterior (orqa gumbaz - Duglas bo'shlig'iga taqaladi)", "Fornix anterior", "Fornix lateralis dexter", "Fornix lateralis sinister"],
        correctAnswerIndex: 0,
        explanation: "Orqa qin gumbazi eng chuqur bo'lib, to'g'ri ichak-bachadon (Duglas) chuqurchasiga tutashgani sababli orqa gumbaz punksiyasi qilinadi."
      },
      {
        question: "Qizlik pardasi (Hymen) qayerda joylashgan?",
        options: ["Qin kirish qismi (Ostium vaginae) va qin dahlizi (Vestibulum vaginae) chegarasida", "Bachadon bo'ynida", "Bachadon nayida", "Katta jinsiy lablarda"],
        correctAnswerIndex: 0,
        explanation: "Hymen qin dahlizidan qin bo'shlig'iga o'tish chegarasidagi biriktiruvchi to'qimali shilliq burmadir."
      },
      {
        question: "Klitorda (Klitor / Clitoris) erkaklar jinsiy olatining qaysi anatomik tuzilmasiga gomologik hisoblanadi?",
        options: ["Corpora cavernosa (G'ovak tanalariga - erektil to'qima)", "G'ovakli spongioz tanaga", "Moyakka", "Prostata beziga"],
        correctAnswerIndex: 0,
        explanation: "Klitor erkak jinsiy olatining kavernoz tanalariga o'xshash juft g'ovak tana, boshcha va oyoqchalardan iborat erektil a'zodir."
      },
      {
        question: "Qin dahlizining katta bezlari (Glandulae vestibulares majores / Bartolin bezlari) qayerga ochiladi?",
        options: ["Kichik jinsiy lablar ichki yuzasiga, qin kirish joyiga (shilimshiq ajratadi)", "Bachadon ichiga", "Klitorga", "Qovuqqa"],
        correctAnswerIndex: 0,
        explanation: "Bartolin bezlari qin dahlizida kichik lablar asosida joylashib, jinsiy aloqa paytida namlovchi shilliq ajratadi."
      },
      {
        question: "Sut bezi (Mamma / Glandula mammaria) qanday modifikatsiyalangan bez hisoblanadi?",
        options: ["O'zgargan apokrin ter bezi (Glandula sudorifera modificata)", "Yog' bezi", "So'lak bezi", "Endokrin bez"],
        correctAnswerIndex: 0,
        explanation: "Sut bezi embrional jihatdan o'zgargan ter bezi hisoblanib, 15-20 ta bo'lakdan (lobi) tashkil topgan."
      },
      {
        question: "Sut bezi bo'laklarining chiqaruv yo'llari (Ductus lactiferi) sut so'rg'ichiga (Papilla mammae) ochilishidan oldin qanday kengayma hosil qiladi?",
        options: ["Sinus lactiferi (Sut sinuslari / zaxira rezervuarlari)", "Ampulla", "Cisterna", "Vesicula"],
        correctAnswerIndex: 0,
        explanation: "Sut yo'llari so'rg'ich ostida Sinus lactiferi bo'lib kengayib, laktatsiya paytida sut to'playdi."
      },
      {
        question: "Sut bezini ko'krak fassiyasiga mustahkam bog'lab, uning osilib ketishiga yo'l qo'ymaydigan boylamlar nima?",
        options: ["Ligamenta suspensoria mammaria (Kuper boylamlari)", "Ligamentum teres", "Ligamentum latum", "Fascia clavipectoralis"],
        correctAnswerIndex: 0,
        explanation: "Kuper boylamlari sut bezini teri va fassiyaga mahkamlovchi biriktiruvchi to'qima tolalari bo'lib, o'sma o'sganda 'limon po'stlog'i' simptomini beradi."
      },
      {
        question: "Sut bezidan limfa oqimining asosiy qismi (75% dan ortig'i) qaysi limfa tugunlariga oqadi?",
        options: ["Nodi lymphoidei axillares (Qo'ltiq osti limfa tugunlariga)", "Chov limfa tugunlariga", "Bo'yin limfa tugunlariga", "Qorin limfa tugunlariga"],
        correctAnswerIndex: 0,
        explanation: "Sut bezi saratoni metastazlari eng avvalo qo'ltiq osti (aksillyar) limfa tugunlariga tarqaladi."
      },
      {
        question: "Ayollarda jinsiy sikl (Menstrual sikl) o'rtacha necha kun davom etadi?",
        options: ["28 kun (21 kundan 35 kungacha norma)", "14 kun", "45 kun", "60 kun"],
        correctAnswerIndex: 0,
        explanation: "Oddiy hayz sikli o'rtacha 28 kun davom etib, follikulyar, ovulyatsiya va lyutein fazalaridan iborat."
      },
      {
        question: "Sut ishlab chiqarishni (laktatsiyani) rag'batlantiruvchi gipofiz gormoni qaysi?",
        options: ["Prolaktin (Adenohipofiz gormoni)", "Oksitotsin", "Estrogen", "Progesteron"],
        correctAnswerIndex: 0,
        explanation: "Prolaktin alveolalarda sut sintezlanishini ta'minlaydi; Oksitotsin esa sut yo'llari miyoepiteliyini qisqartirib sut ajralishini (oqishini) yuzaga keltiradi."
      },
      {
        question: "Emizish paytida bolaning so'rg'ichni so'rishi qaysi gormonni reflektor qonga chiqarib bachadon qisqarishini va sut haydalishini chaqiradi?",
        options: ["Oksitotsin (Neyrohipofiz gormoni)", "Prolaktin", "Insulin", "Tiroksin"],
        correctAnswerIndex: 0,
        explanation: "So'rish refleksi gipotalamus orqali oksitotsin ajratadi, bu esa sut chiqishini ta'minlab, tug'ruqdan keyin bachadon involyutsiyasini tezlashtiradi."
      },
      {
        question: "Tuxumdonning xususiy boylami (Ligamentum ovarii proprium) qayerga birikadi?",
        options: ["Tuxumdonning bachadon uchidan bachadon burchagiga (nay chiqish joyi ostiga)", "Chanoq devoriga", "Qov suyagiga", "To'g'ri ichakka"],
        correctAnswerIndex: 0,
        explanation: "Lig. ovarii proprium tuxumdonni bachadon burchagi bilan bog'lovchi mustahkam fibroz boylamdir."
      },
      {
        question: "Bachadon bo'yni kanali (Canalis cervicis uteri) shilliq qavati burmalari nima deyiladi?",
        options: ["Plicae palmatae (palmasimon burmalar)", "Plicae circulares", "Plicae semilunares", "Plicae longitudinales"],
        correctAnswerIndex: 0,
        explanation: "Bachadon bo'yni kanalidagi plicae palmatae shilliq tiqin (Kristeller tiqini) bilan infeksiya kirishidan himoyalaydi."
      },
      {
        question: "Ayol tashqi jinsiy a'zolari (Vulva / Pudendum femininum) ga nimalar kiradi?",
        options: ["Mons pubis (qov do'mbog'i), Labia majora et minora pudendi, Clitoris, Vestibulum vaginae, Bulbus vestibuli", "Faqat tuxumdonlar", "Faqat bachadon va naylar", "Faqat qin"],
        correctAnswerIndex: 0,
        explanation: "Tashqi a'zolarga katta va kichik jinsiy lablar, klitor, qov do'mbog'i, dahliz va bezlar kiradi."
      },
      {
        question: "Ayol kichik chanoq bo'shlig'ida a'zolar oldindan orqaga qanday ketma-ketlikda yotadi?",
        options: ["Qov simfizi -> Siydik pufagi -> Bachadon va qin -> To'g'ri ichak (Rectum)", "To'g'ri ichak -> Bachadon -> Qovuq", "Bachadon -> Qovuq -> To'g'ri ichak", "Qovuq -> To'g'ri ichak -> Bachadon"],
        correctAnswerIndex: 0,
        explanation: "Ayol chanog'ida eng oldinda qovuq, o'rtada bachadon va qin, orqada to'g'ri ichak joylashadi."
      },
      {
        question: "Bachadondan tashqari (ektopik) homiladorlik eng ko'p qayerda uchraydi?",
        options: ["Bachadon nayida (Tuba uterina ampulasida - 95% dan ko'p)", "Qorin bo'shlig'ida", "Tuxumdonda", "Bachadon bo'ynida"],
        correctAnswerIndex: 0,
        explanation: "Urug'langan tuxum hujayra nay orqali bachadonga o'tolmay qolsa, nay homiladorligi yuzaga keladi."
      },
      {
        question: "Endometrioz nima?",
        options: ["Bachadon ichki shilliq qavati (endometriy) to'qimasining bachadondan tashqarida (tuxumdon, qorin pardasi) o'sib ketishi", "Bachadon yallig'lanishi", "Sut bezi o'smasi", "Follikulaning yorilmasligi"],
        correctAnswerIndex: 0,
        explanation: "Endometriozda endometriy hujayralari boshqa a'zolarga o'tib, hayz paytida qonab og'riq va bitishmalar hosil qiladi."
      },
      {
        question: "Sut bezining areolasi (Areola mammae) da joylashgan mayda bo'rtiqchalar (Montgomeri bezlari) nima?",
        options: ["Glandulae areolares (areolani va so'rg'ichni himoyalovchi moy bezlari)", "Sut yo'llari teshigi", "Tugunlar", "Sut bezlari bo'lakchalari"],
        correctAnswerIndex: 0,
        explanation: "Montgomeri bezlari areolada yog'simon bakteritsid sekret ajratib, emizishda terini yorilishdan asraydi."
      },
      {
        question: "Parametriy (Parametrium) nima?",
        options: ["Bachadon bo'yni atrofidagi va keng boylam varaqlari orasidagi biriktiruvchi to'qima va yog' qavati", "Bachadon shilliq qavati", "Tuxumdon po'stlog'i", "Qin devori"],
        correctAnswerIndex: 0,
        explanation: "Parametriy bachadon bo'yni atrofidagi yog' kletchatkasi bo'lib, uning yallig'lanishi parametrit deyiladi."
      }
    ]
  },

  // ==========================================
  // TOPIC 8 (Order 21): Erkaklar jinsiy tizimi
  // ==========================================
  {
    topicOrder: 21,
    topicKeywords: ["erkaklar", "testis", "orchis", "epididymis", "prostata", "penis", "vesicula seminalis", "funiculus spermaticus"],
    quizzes: [
      {
        question: "Moyak (Testis / Orchis / Didymis) ning asosiy funksiyalari qaysilar?",
        options: ["Spermatozoidlar ishlab chiqarish (spermatogenez) va erkaklik gormoni - testosteron sintezlash", "Faqat siydik chiqarish", "Faqat shilliq ishlab chiqarish", "Eritrotsitlar hosil qilish"],
        correctAnswerIndex: 0,
        explanation: "Moyak aralash bez bo'lib, buralma urug' naychalarida sperma, Leydig hujayralarida esa testosteron ishlab chiqaradi."
      },
      {
        question: "Moyakning buralma urug' naychalari (Tubuli seminiferi contorti) devoridagi oziqlantiruvchi tayanch hujayralar qaysi?",
        options: ["Sertoli hujayralari (Sustentotsitlar)", "Leydig hujayralari", "Miofibroblastlar", "Plazmotsitlar"],
        correctAnswerIndex: 0,
        explanation: "Sertoli hujayralari spermatogenez jarayonida spermatozoidlarni oziqlantiradi va gemato-testikulyar to'siqni hosil qiladi."
      },
      {
        question: "Testosteron gormonini ishlab chiqaruvchi Moyakning interstitsial hujayralari qaysi?",
        options: ["Leydig hujayralari (Endokrinotsitlar)", "Sertoli hujayralari", "Spermatogoniyalar", "Kupffer hujayralari"],
        correctAnswerIndex: 0,
        explanation: "Leydig hujayralari buralma naychalar oralig'idagi biriktiruvchi to'qimada yotib, testosteron sintezlaydi."
      },
      {
        question: "Moyak ortig'i (Epididymis) ning anatomik qismlari qaysilar?",
        options: ["Caput epididymidis (boshi), Corpus (tanasi), Cauda epididymidis (dumi)", "Lobus superior va inferior", "Apex va basis", "Fundus va cervix"],
        correctAnswerIndex: 0,
        explanation: "Moyak ortig'i moyakning orqa chetida yotadi va boshcha, tana hamda urug' olib chiquvchi yo'lga o'tuvchi dumdan iborat."
      },
      {
        question: "Urug' olib chiquvchi nay (Ductus deferens) uzunligi qancha va qayerdan qayergacha boradi?",
        options: ["40-45 sm; moyak ortig'i dumidan boshlanib, urug' pufakchasi yo'li bilan qo'shilib Ductus ejaculatorius hosil qiladi", "10 sm, qovuqqacha", "5 sm, jinsiy olatgacha", "1 metr"],
        correctAnswerIndex: 0,
        explanation: "Ductus deferens urug' tizimchasi tarkibida chov kanalidan o'tib, prostata ichida eyakulyator nayga aylanadi."
      },
      {
        question: "Urug' tizimchasi (Funiculus spermaticus) tarkibida nimalar o'tadi?",
        options: ["Ductus deferens, Arteria va Vena testicularis (Plexus pampiniformis), Arteria ductus deferentis, limfa tomirlari va nervlar", "Faqat siydik nayi", "Faqat son arteriyasi", "Faqat qovuq boylami"],
        correctAnswerIndex: 0,
        explanation: "Funiculus spermaticus moyakni osib turuvchi 15-20 sm li tizimcha bo'lib, chov kanalidan o'tadi."
      },
      {
        question: "Urug' otuvchi nay (Ductus ejaculatorius) qayerga ochiladi?",
        options: ["Erkaklar uretasining prostata qismidagi urug' do'mboqchasiga (Colliculus seminalis)", "Qovuqqa", "Moyak ortig'iga", "Jinsiy olat boshchasiga"],
        correctAnswerIndex: 0,
        explanation: "Ductus ejaculatorius prostata bezini teshib o'tib, uretra orqa devoridagi urug' do'mboqchasiga ochiladi."
      },
      {
        question: "Prostata bezi (Prostata / Prostata glandula) qayerda joylashgan va qanday a'zo?",
        options: ["Siydik pufagi tagida, uretra boshlang'ich qismini xalqa kabi o'rab turuvchi toq muskul-bez a'zosi", "Katta chanoqda", "Moyak ichida", "Buyrak ustida"],
        correctAnswerIndex: 0,
        explanation: "Prostata bezi qashg'aldoq shaklida bo'lib, qovuq ostida joylashadi va uretra boshlanishini o'rab turadi."
      },
      {
        question: "Prostata bezi suyuqligi (sekreti) ning spermadagi ahamiyati nimada?",
        options: ["Ishqoriy muhit yaratib, spermatozoidlarning harakatchanligi va yashovchanligini ta'minlaydi (eyakulyatning 30% ini tashkil qiladi)", "Siydikni quyiltiradi", "Qonni to'xtatadi", "Kalsiyni parchalaydi"],
        correctAnswerIndex: 0,
        explanation: "Prostata sekreti spermani suyultiradi, fermentlar (PSA) va limon kislotaga boy bo'lib, qin nordon muhitini neytrallaydi."
      },
      {
        question: "Urug' pufakchalari (Vesiculae seminales) qanday a'zo?",
        options: ["Qovuq orqa tubida, ampulla ductus deferentis yonida joylashgan juft sekretor a'zo (fruktozaga boy suyuqlik ajratadi)", "Moyak ichidagi xaltacha", "Siydik to'plovchi pufak", "Mushak boylami"],
        correctAnswerIndex: 0,
        explanation: "Urug' pufakchalari eyakulyat hajmining 60-70% qismini (spermatozoidlar uchun ozuqa bo'lgan fruktoza) ishlab chiqaradi."
      },
      {
        question: "Bulbouretal bezlar (Kuper bezlari / Glandulae bulbourethrales) qayerda joylashgan va qayerga ochiladi?",
        options: ["Oraliq mushaklari (diaphragma urogenitale) qalinligida joylashib, uretra g'ovak qismiga ochiladi (ishqoriy shilliq ajratadi)", "Prostata ichida", "Moyakda", "Qorin bo'shlig'ida"],
        correctAnswerIndex: 0,
        explanation: "Kuper bezlari no'xatdek juft bez bo'lib, eyakulyatsiyadan oldin uretra kanalini siydik kislotasidan tozalovchi shilliq ajratadi."
      },
      {
        question: "Yorg'oq (Scrotum) nechta qavatdan iborat?",
        options: ["7 qavatdan (qorin old devori qavatlarining hosilalari)", "3 qavatdan", "2 qavatdan", "1 qavatdan"],
        correctAnswerIndex: 0,
        explanation: "Yorg'oq embrional rivojlanishda moyak pastga tushishi natijasida qorin devorining barcha 7 qavatidan hosil bo'ladi."
      },
      {
        question: "Yorg'oqdagi go'shtdor qavat (Tunica dartos) qanday vazifani bajaradi?",
        options: ["Harorat o'zgarganda qisqarib/bo'shashib, moyaklar uchun optimal termoregulyatsiyani (34-35°C) ta'minlaydi", "Sperma ishlab chiqaradi", "Qon quyadi", "Siydikni ushlab turadi"],
        correctAnswerIndex: 0,
        explanation: "Tunica dartos silliq mushak tolalari yordamida yorg'oq terisini burishtirib, spermatogenez uchun 34.5°C haroratni ushlaydi."
      },
      {
        question: "Moyakni ko'taruvchi mushak (Musculus cremaster) qaysi mushak tolasidan hosil bo'ladi?",
        options: ["Musculus obliquus internus abdominis va transversus abdominis tolalaridan", "Musculus rectus abdominis", "Musculus psoas major", "Musculus gluteus"],
        correctAnswerIndex: 0,
        explanation: "M. cremaster qorinning ichki qiya va ko'ndalang mushaklaridan ajralib chov kanali orqali yorg'oqqa tushadi."
      },
      {
        question: "Kriptorxizm nima?",
        options: ["Moyakning qorin bo'shlig'idan yorg'oqqa tushmay qolishi (chov kanalida yoki qorinda tutilib qolishi)", "Moyak yallig'lanishi (orxit)", "Moyak buralib qolishi", "Moyakda kista bo'lishi"],
        correctAnswerIndex: 0,
        explanation: "Kriptorxizmda moyak yuqori tana haroratida qolib ketsa, spermatogen epiteliy atrofiyaga uchrab bepushtlik kelib chiqadi."
      },
      {
        question: "Varikotsele nima?",
        options: ["Urug' tizimchasining uzumsimon venoz chigali (Plexus pampiniformis) tomirlarining varikoz kengayishi (ko'pincha chap tomonda)", "Moyak istisqosi", "Prostata adenomasi", "Chov churrasi"],
        correctAnswerIndex: 0,
        explanation: "Varikotsele chap moyak venasining buyrak venasiga to'g'ri burchak ostida quyilishi sababli ko'proq chapda uchraydi."
      },
      {
        question: "Gidrotsele (Moyak istisqosi) nima?",
        options: ["Moyakning xususiy pardasi (Tunica vaginalis testis) varaqlari orasida seroz suyuqlik to'planishi", "Moyakda yiring to'planishi", "Urug' yo'lining berkilishi", "Moyak o'smasi"],
        correctAnswerIndex: 0,
        explanation: "Gidrotselda moyak qin pardasining visseral va parietal varaqlari orasida suyuqlik yig'ilib yorg'oq kattalashadi."
      },
      {
        question: "Jinsiy olat (Penis) qanday erektil tanalardan tashkil topgan?",
        options: ["2 ta g'ovak tana (Corpora cavernosa penis) va 1 ta gubkasimon tana (Corpus spongiosum penis)", "3 ta g'ovak tana", "2 ta gubkasimon tana", "Faqat skelet mushaklaridan"],
        correctAnswerIndex: 0,
        explanation: "Jinsiy olat orqa-yon tomondagi 2 ta kavernoz tana va pastki uretra o'tuvchi 1 ta spongioz tanadan iborat."
      },
      {
        question: "Jinsiy olat boshchasi (Glans penis) nimaning davomi hisoblanadi?",
        options: ["Gubkasimon tananing (Corpus spongiosum penis) kengaygan oldingi qismi", "Kavernoz tanalarning", "Urug' tizimchasining", "Oraliq mushaklarining"],
        correctAnswerIndex: 0,
        explanation: "Glans penis gubkasimon tananing oldingi kengaymasi bo'lib, uning uchida ostium urethrae externum ochiladi."
      },
      {
        question: "Jinsiy olat boshchasini qoplovchi harakatchan teri burmasi nima deyiladi?",
        options: ["Preputium penis (chekki parda / sunnat terisi)", "Frenulum", "Corona glandis", "Collum glandis"],
        correctAnswerIndex: 0,
        explanation: "Preputium boshchani qoplab turuvchi erkin teri burmasi bo'lib, uning torayishi fitoz (fimoz) deyiladi."
      },
      {
        question: "Ereksiya jarayonining fiziologik mexanizmi qanday?",
        options: ["Parasimpatik nervlar ta'sirida kavernoz tanalarning chuqur arteriyalari kengayib, kavernalar qon bilan to'ladi va venalar qisiladi", "Simpatik nervlar ta'sirida qon ketishi", "Faqat mushaklarning tortilishi", "Siydik to'planishi hisobiga"],
        correctAnswerIndex: 0,
        explanation: "Parasimpatik impulslar (NO ajralishi) kavernalarni qon bilan to'ldirib oqimni kuchaytiradi, venoz oqim esa bosilib to'xtaydi."
      },
      {
        question: "Eyakulyatsiya (urug' otilishi) jarayonini qaysi nerv tizimi boshqaradi?",
        options: ["Simpatik nerv tizimi (Th12-L2 segmentlari)", "Parasimpatik tizim", "Somatik harakat nervi", "Bosh miya po'stlog'i"],
        correctAnswerIndex: 0,
        explanation: "Ereksiya - parasimpatik ('Point'), Eyakulyatsiya - simpatik ('Shoot') nerv tizimi nazorati ostida amalga oshadi."
      },
      {
        question: "Prostata bezi adenomasi (BPH) eng avvalo qanday klinik belgini beradi?",
        options: ["Uretra qisilib qolishi sababli siyishning qiyinlashuvi, kuchsiz oqim va kechasi tez-tez siyish (nikturiya)", "Moyakda og'riq", "Jinsiy maylning oshishi", "Buyrak yetishmovchiligi"],
        correctAnswerIndex: 0,
        explanation: "Prostatada uretra atrofidagi bez to'qimasi kattalashib uretrani ezadi va dizuriya chaqiradi."
      },
      {
        question: "Spermatozoidlarning to'liq yetilish (kapatsitatsiya va harakatchanlikka erishish) jarayoni qayerda kechadi?",
        options: ["Moyak ortig'i kanalida (Ductus epididymidis - 10-14 kun davomida)", "Moyak buralma naychalarida", "Urug' pufakchasida", "Prostatada"],
        correctAnswerIndex: 0,
        explanation: "Moyakda hosil bo'lgan spermiylar epididimisda uzoq vaqt saqlanib, harakatlanish va urug'lantirish qobiliyatiga ega bo'ladi."
      },
      {
        question: "Prostata bezi bo'laklari (Lobi prostatae) qaysilar?",
        options: ["Lobus dexter, Lobus sinister va Isthmus (o'rta bo'lak - Lobus medius)", "Faqat o'ng va chap", "Caput va cauda", "4 ta bo'lak"],
        correctAnswerIndex: 0,
        explanation: "Prostata o'ng, chap va uretra orqasida joylashgan o'rta bo'lakdan (isthmus) iborat."
      },
      {
        question: "Moyakning arterial qon bilan ta'minlanishi qaysi yirik tomirdan keladi?",
        options: ["Arteria testicularis (to'g'ridan-to'g'ri Qorin aortasining L2 sathi tarmoqlanmasidan)", "Arteria iliaca interna'dan", "Arteria renalis'dan", "Arteria femoralis'dan"],
        correctAnswerIndex: 0,
        explanation: "Moyaklar embrional davrda bel sohasida shakllangani sababli ularning arteriyasi (a. testicularis) to'g'ridan-to'g'ri qorin aortasidan chiqadi."
      },
      {
        question: "O'ng moyak venasi (V. testicularis dextra) qayerga quyiladi?",
        options: ["To'g'ridan-to'g'ri Pastki kovak venaga (Vena cava inferior)", "Chap buyrak venasiga", "Darvoza venasiga", "Ichki yonbosh venasiga"],
        correctAnswerIndex: 0,
        explanation: "O'ng moyak venasi o'tkir burchak ostida pastki kovak venaga, chap moyak venasi esa to'g'ri burchak ostida chap buyrak venasiga quyiladi."
      },
      {
        question: "Vazektomiya jarrohlik amaliyoti nima?",
        options: ["Kontratseptsiya maqsadida Ductus deferens (urug' yo'li) ni bog'lab kesish", "Moyakni olib tashlash", "Prostatani kesish", "Sunnat qilish"],
        correctAnswerIndex: 0,
        explanation: "Vazektomiya urug' olib chiquvchi nayni kesish orqali erkaklarda qaytmas kontratsepsiyani ta'minlaydi."
      },
      {
        question: "Spermada fruktoza konsentratsiyasini qaysi a'zo ta'minlaydi?",
        options: ["Vesicula seminalis (Urug' pufakchasi)", "Prostata bezi", "Moyak", "Kuper bezi"],
        correctAnswerIndex: 0,
        explanation: "Urug' pufakchalari spermatozoidlar ATF hosil qilishi uchun asosiy energiya manbai bo'lgan fruktozani beradi."
      },
      {
        question: "Moyakning o'z o'qi atrofida buralib qolishi (Torsio testis) zudlik bilan operatsiya qilinmasa qanday oqibatga olib keladi?",
        options: ["Arterial qon oqimi to'xtab moyak ishemiyasi va nekrozi (gangrena) yuz beradi", "Faqat shamollash bo'ladi", "Hech narsa bo'lmaydi", "Sperma ko'payadi"],
        correctAnswerIndex: 0,
        explanation: "Moyak buralganda a. testicularis qisilib 6 soat ichida to'qima nekrozga uchraydi, zudlik bilan detorsiya zarur."
      }
    ]
  },

  // ==========================================
  // TOPIC 9 (Order 22): Yurak. Qon aylanish doirasi. Aorta. Uyqu arteriyalari
  // ==========================================
  {
    topicOrder: 22,
    topicKeywords: ["yurak", "cor", "aorta", "carotis", "qon aylanish", "atrium", "ventriculus", "valva"],
    quizzes: [
      {
        question: "Yurak (Cor) nechta kameradan iborat va qaysilar?",
        options: ["4 ta kameradan: 2 ta bo'lmacha (Atrium dextrum et sinistrum) va 2 ta qorincha (Ventriculus dexter et sinister)", "2 ta kamera", "3 ta kamera", "6 ta kamera"],
        correctAnswerIndex: 0,
        explanation: "Inson yuragi 4 kamerali bo'lib, o'ng va chap qismlar qorinchalararo va bo'lmachalararo to'siq bilan to'liq ajralgan."
      },
      {
        question: "Yurakning o'ng bo'lmachasiga (Atrium dextrum) qanday qon tomirlari quyiladi?",
        options: ["Vena cava superior (yuqori kovak vena), Vena cava inferior (pastki kovak vena) va Sinus coronarius (yurakning toj sinusi)", "O'pka venalari", "Aorta", "O'pka poyasi"],
        correctAnswerIndex: 0,
        explanation: "O'ng bo'lmacha butun tanadan va yurak devoridan keluvchi barcha venoz qonni qabul qiladi."
      },
      {
        question: "Chap bo'lmachaga (Atrium sinistrum) qaysi tomirlar orqali kislorodga boy arterial qon keladi?",
        options: ["4 ta o'pka venasi (Venae pulmonales) orqali", "Yuqori kovak vena orqali", "Pastki kovak vena orqali", "Aorta orqali"],
        correctAnswerIndex: 0,
        explanation: "O'pkalarda kislorod bilan to'yingan arterial qon 4 ta o'pka venalari orqali to'g'ridan-to'g'ri chap bo'lmachaga quyiladi."
      },
      {
        question: "O'ng bo'lmacha va o'ng qorincha orasidagi klapan (Valva atrioventricularis dextra) nima deb ataladi?",
        options: ["Uch tavaqali klapan (Valva tricuspidalis)", "Ikki tavaqali (Mitral) klapan", "Aortal klapan", "Yarimoysimon klapan"],
        correctAnswerIndex: 0,
        explanation: "O'ng atrioventrikulyar teshikda 3 tavaqali (old, orqa, to'siq tavaqali) trikuspidal klapan joylashadi."
      },
      {
        question: "Chap bo'lmacha va chap qorincha orasidagi klapan nima deyiladi?",
        options: ["Ikki tavaqali (Mitral / Bikuspidal) klapan (Valva bicuspidalis / mitralis)", "Uch tavaqali klapan", "O'pka klapani", "Vinslov klapani"],
        correctAnswerIndex: 0,
        explanation: "Chap atrioventrikulyar klapan 2 ta (oldingi va orqa) tavaqadan iborat bo'lib, mitral klapan deyiladi."
      },
      {
        question: "Katta qon aylanish doirasi (Circulatio sanguinis major) qayerdan boshlanadi va qayerda tugaydi?",
        options: ["Chap qorinchadan (Aorta orqali) boshlanib, O'ng bo'lmachada (Kovak venalar orqali) tugaydi", "O'ng qorinchadan boshlanib chap bo'lmachada tugaydi", "O'ng bo'lmachadan chap qorinchagacha", "Jigardan buyrakkacha"],
        correctAnswerIndex: 0,
        explanation: "Katta doira kislorodli qonni butun tanaga tarqatish uchun chap qorinchadan boshlanadi va venoz qon bo'lib o'ng bo'lmachaga qaytadi."
      },
      {
        question: "Kichik qon aylanish doirasi (Circulatio sanguinis minor / O'pka doirasi) qayerdan boshlanadi va qayerda tugaydi?",
        options: ["O'ng qorinchadan (Truncus pulmonalis orqali) boshlanib, Chap bo'lmachada (4 ta venae pulmonales orqali) tugaydi", "Chap qorinchadan o'ng bo'lmachaga", "O'ng bo'lmachadan jigarga", "Chap bo'lmachadan aortaga"],
        correctAnswerIndex: 0,
        explanation: "Kichik doira venoz qonni o'pkaga olib borib gaz almashinuvini ta'minlash uchun o'ng qorinchadan boshlanadi va chap bo'lmachada tugaydi."
      },
      {
        question: "Yurak devori qanday 3 ta qavatdan tashkil topgan?",
        options: ["Endocardium (ichki), Myocardium (o'rta mushak), Epicardium (tashqi seroz)", "Intima, media, adventitia", "Mukosa, submukosa, seroza", "Plevra, perikard, fastsiya"],
        correctAnswerIndex: 0,
        explanation: "Yurak devori yupqa endoteliy (endokard), qalin ko'ndalang-targ'il yurak mushagi (miokard) va visseral perikard (epikard) dan iborat."
      },
      {
        question: "Yurakning o'tkazuvchi tizimining bosh ritm yetakchisi (peysmeyker) qaysi?",
        options: ["Sinus-tugun (Nodus sinuatrialis / Kiss-Flek tuguni)", "Atrioventrikulyar tugun (Ashoff-Tavara)", "Gis tutami", "Purkine tolalari"],
        correctAnswerIndex: 0,
        explanation: "Sinus tuguni o'ng bo'lmachaning yuqori kovak vena quyilish sohasida bo'lib, daqiqasiga 60-80 ta impuls hosil qiladi."
      },
      {
        question: "Atrioventrikulyar tugun (Nodus atrioventricularis / Ashoff-Tavara tuguni) qayerda joylashgan?",
        options: ["Bo'lmachalararo to'siqning pastki qismida, sinus coronarius teshigi yonida", "Chap qorincha cho'qqisida", "Aorta boshlanishida", "O'pka venasida"],
        correctAnswerIndex: 0,
        explanation: "AV tugun bo'lmachadan qorinchalarga impuls o'tishini fiziologik ravishda kechiktirib (AV kechikish) qorinchalarning to'lishini ta'minlaydi."
      },
      {
        question: "Yurak cho'qqisi turtkisi (Ictus cordis) normada qayerda paypaslanadi?",
        options: ["Chap 5-qovurg'alar oralig'ida, o'rta o'mrov chizig'idan 1-1.5 sm ichkarida (medialroqda)", "Chap 2-qovurg'alar oralig'ida", "To'sh suyagi o'rtasida", "O'ng 5-qovurg'a oralig'ida"],
        correctAnswerIndex: 0,
        explanation: "Yurak cho'qqisi chap 5-qovurg'alararo sohada linea medioclavicularis sinistra'dan 1-1.5 sm medialda urib turadi."
      },
      {
        question: "Yurakni oziqlantiruvchi toj arteriyalar (Arteriae coronariae dextra et sinistra) qayerdan boshlanadi?",
        options: ["Aorta piyozchasidan (Bulbus aortae) - Valsalva sinuslaridan", "Aorta yoyidan", "O'pka poyasidan", "Chap qorincha ichidan"],
        correctAnswerIndex: 0,
        explanation: "Toj arteriyalar yarimoysimon aortal klapan orqasidagi o'ng va chap aortal sinuslardan boshlanadi."
      },
      {
        question: "Aorta yoyidan (Arcus aortae) o'ngdan chapga qarab qanday 3 ta yirik shox chiqadi?",
        options: ["1) Truncus brachiocephalicus (yelka-bosh poyasi), 2) Arteria carotis communis sinistra, 3) Arteria subclavia sinistra", "3 ta bir xil arteriya", "Faqat uyqu arteriyalari", "Faqat o'mrov osti arteriyalari"],
        correctAnswerIndex: 0,
        explanation: "Aorta yoyidan avval Truncus brachiocephalicus (u a. carotis communis dextra va a. subclavia dextra'ga bo'linadi), so'ng chap umumiy uyqu va chap o'mrov osti arteriyalari chiqadi."
      },
      {
        question: "Umumiy uyqu arteriyasi (Arteria carotis communis) qaysi sohada tashqi va ichki uyqu arteriyalariga bo'linadi?",
        options: ["Qalqonsimon tog'ayning yuqori cheti (C4 umurtqa) darajasida", "O'mrov suyagi orqasida", "Pastki jag' burchagida", "Kalla asosi ichida"],
        correctAnswerIndex: 0,
        explanation: "Trigonum caroticum sohasida umumiy uyqu arteriyasi bifurkatsiyaga uchrab a. carotis externa va a. carotis interna'ga ajraladi."
      },
      {
        question: "Uyqu sinusi (Sinus caroticus) va Uyqu koptokchasi (Glomus caroticum) qanday retseptor vazifasini bajaradi?",
        options: ["Sinus caroticus - baroretseptor (qon bosimini o'lchaydi); Glomus caroticum - xemoretseptor (qondagi O2, CO2 va pH ni sezadi)", "Faqat haroratni sezadi", "Faqat og'riqni qabul qiladi", "Gormon ajratadi"],
        correctAnswerIndex: 0,
        explanation: "Uyqu bifurkatsiyasi zonasi qon bosimi va qon gaz tarkibini boshqaruvchi eng qudratli refleksogen zonadir."
      },
      {
        question: "Tashqi uyqu arteriyasining (A. carotis externa) oldingi guruh shoxlariga qaysilar kiradi?",
        options: ["Arteria thyroidea superior, Arteria lingualis, Arteria facialis", "Arteria occipitalis va auricularis posterior", "Arteria pharyngea ascendens", "Arteria maxillaris va temporalis superficialis"],
        correctAnswerIndex: 0,
        explanation: "Oldingi guruh shoxlari qalqonsimon bezga (a. thyroidea superior), tilga (a. lingualis) va yuzga (a. facialis) boradi."
      },
      {
        question: "Tashqi uyqu arteriyasining 2 ta oxirgi terminal shoxi qaysi?",
        options: ["Arteria temporalis superficialis (yuzaki chakka) va Arteria maxillaris (yuqori jag')", "Arteria facialis va lingualis", "Arteria ophtalmica va cerebri media", "Arteria occipitalis va meningea media"],
        correctAnswerIndex: 0,
        explanation: "Pastki jag' bo'yni orqasida a. carotis externa o'zining terminal shoxlari: a. temporalis superficialis va a. maxillaris'ga bo'linadi."
      },
      {
        question: "Miya qattiq pardasini oziqlantiruvchi eng yirik qon tomir (Arteria meningea media) qaysi arteriyaning shoxi?",
        options: ["Arteria maxillaris (Yuqori jag' arteriyasining)", "Arteria carotis interna", "Arteria ophtalmica", "Arteria vertebralis"],
        correctAnswerIndex: 0,
        explanation: "A. meningea media yuqori jag' arteriyasidan chiqib, foramen spinosum orqali kalla bo'shlig'iga kiradi."
      },
      {
        question: "Ichki uyqu arteriyasi (Arteria carotis interna) kalla suyagi bo'shlig'iga kirmaguncha (bo'yinda) nechta shox beradi?",
        options: ["Hech qanday shox bermaydi (0 ta)", "3 ta shox", "5 ta shox", "10 ta shox"],
        correctAnswerIndex: 0,
        explanation: "Ichki uyqu arteriyasi bo'yin sohasida umuman shox bermasdan to'g'ri canalis caroticus orqali miyaga kiradi."
      },
      {
        question: "Ichki uyqu arteriyasining ko'z kosasiga o'tuvchi asosiy shoxi qaysi?",
        options: ["Arteria ophthalmica (Ko'z arteriyasi - Canalis opticus orqali ko'z kosasiga kiradi)", "Arteria facialis", "Arteria infraorbitalis", "Arteria labialis"],
        correctAnswerIndex: 0,
        explanation: "A. ophthalmica ko'rish nervi bilan birga ko'ruv kanalidan ko'z kosasiga kirib ko'z soqqasini va to'r pardani (a. centralis retinae) qon bilan ta'minlaydi."
      },
      {
        question: "Miya arterial halqasi (Villiziy halqasi / Circulus arteriosus cerebri) qanday hosil bo'ladi?",
        options: ["Ichki uyqu arteriyalari va Umurtqa arteriyalari (Bazilyar arteriya) tizimlarining o'zaro tutashuvchi arteriyalar (a. communicans anterior et posteriores) orqali birlashishidan", "Faqat tashqi uyqu arteriyasidan", "Faqat aorta shoxlaridan", "Kovak venalardan"],
        correctAnswerIndex: 0,
        explanation: "Villiziy halqasi miya asosida a. cerebri anterior, media, posterior va tutashtiruvchi arteriyalardan hosil bo'lib kollateral qon aylanishni ta'minlaydi."
      },
      {
        question: "Yurak xaltasi (Perikard / Pericardium) qanday ikki varaqdan iborat?",
        options: ["Pericardium fibrosum (tashqi tolali) va Pericardium serosum (ichki seroz - parietal va visseral epikard)", "Pericardium musculosum va mucosum", "Faqat bitta varaq", "Peritoneum va plevra"],
        correctAnswerIndex: 0,
        explanation: "Perikard tashqi baquvvat fibroz xalta va ichki 2 qavatli seroz perikarddan iborat bo'lib, orasida perikard bo'shlig'i bo'ladi."
      },
      {
        question: "Yurak tamponadasi nima?",
        options: ["Perikard bo'shlig'iga tezda qon yoki suyuqlik to'planishi oqibatida yurakning diastolada kengaya olmay qolishi va qisilib qolishi", "Yurak klapanining yirtilishi", "Yurak infarkti", "Yurak mushagining yallig'lanishi"],
        correctAnswerIndex: 0,
        explanation: "Perikard bo'shlig'ida bosim oshganda qorinchalarga qon to'lmaydi va o'tkir yurak yetishmovchiligi yuzaga keladi."
      },
      {
        question: "Ochiq Botal yo'li (Ductus arteriosus / Botal yo'li) homila davrida qaysi tomirlarni birlashtirib turadi?",
        options: ["O'pka poyasini (Truncus pulmonalis) Aorta yoyi bilan (tug'ilgandan so'ng Ligamentum arteriosum'ga aylanadi)", "Kovak venani aorta bilan", "Ikki bo'lmachani", "Darvoza venasini jigar bilan"],
        correctAnswerIndex: 0,
        explanation: "Homilada o'pka ishlamagani uchun o'ng qorincha qoni Botal yo'li orqali to'g'ridan-to'g'ri aortaga o'tib ketadi."
      },
      {
        question: "Homilada o'ng va chap bo'lmachalar orasidagi oval darcha (Foramen ovale) tug'ilgandan so'ng nimaga aylanadi?",
        options: ["Fossa ovalis (Oval chuqurchaga)", "Ligamentum teres", "Sinus coronarius", "Crista terminalis"],
        correctAnswerIndex: 0,
        explanation: "Birinchi nafas olishdan so'ng chap bo'lmachada bosim oshib Foramen ovale klapani yopiladi va Fossa ovalis hosil bo'ladi."
      },
      {
        question: "Yurakning eng qalin devorga ega bo'lgan kamerasi qaysi?",
        options: ["Chap qorincha (Ventriculus sinister - devori 10-15 mm qalinlikda)", "O'ng qorincha (3-5 mm)", "O'ng bo'lmacha", "Chap bo'lmacha"],
        correctAnswerIndex: 0,
        explanation: "Chap qorincha qonni butun tana bo'ylab yuqori bosimda (120 mm sim. ust.) haydashi kerakligi sababli uning miokardi eng baquvvat bo'ladi."
      },
      {
        question: "Yurak toj sinusi (Sinus coronarius) qayerga ochiladi?",
        options: ["Atrium dextrum (O'ng bo'lmachaga)", "Atrium sinistrum", "Ventriculus sinister", "Pastki kovak venaga"],
        correctAnswerIndex: 0,
        explanation: "Yurak miokardidan venoz qon yig'uvchi Vena cordis magna, media va parva birlashib Sinus coronarius orqali o'ng bo'lmachaga quyiladi."
      },
      {
        question: "Gis tutami (Fasciculus atrioventricularis) qorinchalararo to'siqda qanday tarmoqlanadi?",
        options: ["Crus dextrum (o'ng oyoqcha) va Crus sinistrum (chap oyoqcha) ga ajralib, Purkine tolalari bilan miokardga tarqaladi", "Faqat bitta shox beradi", "Orqaga qaytadi", "Bo'lmachaga ketadi"],
        correctAnswerIndex: 0,
        explanation: "Gis tutami o'ng va chap oyoqchalarga bo'linib, qorincha miokardiga tezkor qisqarish impulsini yetkazadi."
      },
      {
        question: "Yurakning qisqarish fazasi (Sistola) va bo'shashish fazasi (Diastola) da klapanlar qanday ishlaydi?",
        options: ["Sistolada: atrioventrikulyar klapanlar yopiladi, yarimoysimon klapanlar (aorta, o'pka) ochiladi; Diastolada: aksincha", "Hammasi bir vaqtda ochiladi", "Hammasi doim ochiq bo'ladi", "Klapanlar harakatlanmaydi"],
        correctAnswerIndex: 0,
        explanation: "Sistolada qorinchalar qonni tomirlarga haydaydi (yarimoysimonlar ochiq, tavaqali klapanlar yopiq); diastolada esa qorinchalar to'ladi."
      },
      {
        question: "Yurakning innervatsiyasida simpatik va parasimpatik (adashgan nerv) tizimning ta'siri qanday?",
        options: ["Simpatik nervlar: yurak urishini tezlashtiradi va kuchaytiradi; Parasimpatik (n. vagus): sekinlashtiradi va kuchsizlantiradi", "Parasimpatik tezlashtiradi", "Simpatik sekinlashtiradi", "Ikkalasi ham to'xtatadi"],
        correctAnswerIndex: 0,
        explanation: "Simpatik tolalarning qo'zg'alishi taxikardiyaga, adashgan nerv (n. vagus) qo'zg'alishi bradikardiyaga sabab bo'ladi."
      }
    ]
  },

  // ==========================================
  // TOPIC 10 (Order 23): Qo‘l arteriyalari. O‘mrov osti arteriyasi
  // ==========================================
  {
    topicOrder: 23,
    topicKeywords: ["o'mrov osti", "subclavia", "axillaris", "brachialis", "radialis", "ulnaris", "qo'l arteriyalari"],
    quizzes: [
      {
        question: "O'mrov osti arteriyasi (Arteria subclavia) topografik jihatdan qaysi mushaklararo bo'shliqdan o'tadi?",
        options: ["Spatium interscalenum (oldingi va o'rta narvonsimon mushaklar orasidagi bo'shliqdan)", "Spatium antescalenum", "Fossa axillaris", "Canalis caroticus"],
        correctAnswerIndex: 0,
        explanation: "A. subclavia yelka chigali bilan birga m. scalenus anterior va m. scalenus medius orasidagi Spatium interscalenum'dan o'tadi."
      },
      {
        question: "O'mrov osti arteriyasining 1-bo'limidan (narvonsimon mushaklargacha) qaysi muhim shoxlar chiqadi?",
        options: ["Arteria vertebralis (umurtqa arteriyasi), Arteria thoracica interna (ichki ko'krak), Truncus thyrocervicalis (qalqon-bo'yin poyasi)", "Truncus costocervicalis", "Arteria transversa colli", "Arteria axillaris"],
        correctAnswerIndex: 0,
        explanation: "1-bo'limdan miyaga boruvchi a. vertebralis, oldingi ko'krak devoriga a. thoracica interna va bo'yinga truncus thyrocervicalis chiqadi."
      },
      {
        question: "Umurtqa arteriyasi (Arteria vertebralis) kalla suyagi ichiga qaysi yo'l orqali kiradi?",
        options: ["C6-C1 bo'yin umurtqalarining ko'ndalang teshiklaridan (foramina transversaria) o'tib, Foramen magnum orqali", "Canalis caroticus orqali", "Foramen jugulare orqali", "Foramen ovale orqali"],
        correctAnswerIndex: 0,
        explanation: "A. vertebralis bo'yin umurtqalari teshiklaridan ko'tarilib katta ensa teshigi orqali kalla suyagiga kiradi va Bazilyar arteriyani hosil qiladi."
      },
      {
        question: "Ikkita o'ng va chap umurtqa arteriyalari miya ko'prigi sohasida birlashib qaysi yirik arteriyani hosil qiladi?",
        options: ["Arteria basilaris (Asosiy / Bazilyar arteriya)", "Arteria carotis interna", "Arteria cerebri anterior", "Arteria cerebri media"],
        correctAnswerIndex: 0,
        explanation: "A. basilaris Voroliy ko'prigi ustida yotadi va miyachani, ko'prikni hamda a. cerebri posterior orqali ensa bo'lagini qon bilan ta'minlaydi."
      },
      {
        question: "Qo'ltiq osti arteriyasi (Arteria axillaris) qayerda boshlanib qayerda tugaydi?",
        options: ["1-qovurg'aning tashqi chetidan boshlanib, Katta ko'krak mushagi (m. pectoralis major) pastki pay chetigacha davom etadi", "O'mrov suyagidan tirsakkacha", "Bo'yindan bilakkacha", "Kurak suyagidan qo'l panjasigacha"],
        correctAnswerIndex: 0,
        explanation: "A. subclavia 1-qovurg'adan o'tgach a. axillaris nomini oladi, m. pectoralis major pastki chetidan esa a. brachialis'ga aylanadi."
      },
      {
        question: "Qo'ltiq osti arteriyasining Trigonum clavipectorale (o'mrov-ko'krak uchburchagi) dagi shoxlari qaysilar?",
        options: ["Arteria thoracica superior va Arteria thoracoacromialis", "Arteria thoracica lateralis", "Arteria subscapularis", "Arteria circumflexa humeri"],
        correctAnswerIndex: 0,
        explanation: "1-uchburchakda a. thoracica superior va yelka kamariga shox beruvchi a. thoracoacromialis chiqadi."
      },
      {
        question: "Qo'ltiq osti arteriyasining Trigonum subpectorale dagi eng yirik shoxi qaysi?",
        options: ["Arteria subscapularis (kurak osti arteriyasi - a. circumflexa scapulae va a. thoracodorsalis'ga bo'linadi)", "Arteria brachialis", "Arteria profunda brachii", "Arteria radialis"],
        correctAnswerIndex: 0,
        explanation: "A. subscapularis kurak atrofidagi mushaklarni oziqlantiradi va foramen trilaterum orqali kurak orqa chuqurchasiga o'tadi."
      },
      {
        question: "To'rtburchakli teshikdan (Foramen quadrilaterum) qaysi qon tomir va nerv o'tadi?",
        options: ["Arteria circumflexa humeri posterior (yelkani o'rovchi orqa arteriya) va Nervus axillaris", "Arteria circumflexa scapulae", "Arteria radialis va n. radialis", "Arteria brachialis"],
        correctAnswerIndex: 0,
        explanation: "Foramen quadrilaterum orqali n. axillaris va a. circumflexa humeri posterior yelka suyagi jarrohlik bo'ynini aylanib o'tadi."
      },
      {
        question: "Uchburchakli teshikdan (Foramen trilaterum) qaysi qon tomir o'tadi?",
        options: ["Arteria circumflexa scapulae (kurakni o'rovchi arteriya)", "Arteria axillaris", "Arteria subclavia", "Nervus medianus"],
        correctAnswerIndex: 0,
        explanation: "Foramen trilaterum orqali a. circumflexa scapulae kurakning orqa yuzasiga chiqadi va anastomoza hosil qiladi."
      },
      {
        question: "Yelka arteriyasi (Arteria brachialis) ning eng yirik asosiy shoxi qaysi?",
        options: ["Arteria profunda brachii (yelkaning chuqur arteriyasi - yelka-mushak kanaliga kiradi)", "Arteria collateralis ulnaris superior", "Arteria radialis", "Arteria interossea communis"],
        correctAnswerIndex: 0,
        explanation: "A. profunda brachii n. radialis bilan birga Canalis humeromuscularis ichiga kirib yelka orqa guruh mushaklarini oziqlantiradi."
      },
      {
        question: "Yelka arteriyasi (Arteria brachialis) tirsak chuqurchasida qaysi ikki terminal arteriyaga bo'linadi?",
        options: ["Arteria radialis (bilak arteriyasi) va Arteria ulnaris (tirsak arteriyasi)", "Arteria interossea anterior va posterior", "Arteria axillaris va subclavia", "Arteria digitalis communis"],
        correctAnswerIndex: 0,
        explanation: "Tirsak chuqurchasida a. brachialis o'zining ikkita bosh terminal shoxi: a. radialis va a. ulnaris'ga ajraladi."
      },
      {
        question: "Klinik amaliyotda puls (tomir urishi) eng ko'p qaysi arteriyada va qayerda tekshiriladi?",
        options: ["Arteria radialis'da, bilakning pastki uchligida (Sulcus radialis sohasida, bilak suyagi suyanchig'ida)", "Arteria ulnaris'da", "Arteria axillaris'da", "Arteria profunda brachii'da"],
        correctAnswerIndex: 0,
        explanation: "A. radialis bilak suyagining pastki uchida teri ostida suyakka taqalib yotgani sababli pulsni paypaslash juda qulay."
      },
      {
        question: "Klinik amaliyotda qon bosimi (tonometr yordamida) odatda qaysi arteriyada o'lchanadi?",
        options: ["Arteria brachialis (Yelka arteriyasida, tirsak bukilmasi sohasida)", "Arteria radialis", "Arteria axillaris", "Arteria carotis"],
        correctAnswerIndex: 0,
        explanation: "A. brachialis tirsak chuqurchasida (fossa cubitalis) biseps payining medial tomonida joylashgan bo'lib, auskultatsiya qilinadi."
      },
      {
        question: "Yuzaki kaft ravog'i (Arcus palmaris superficialis) qanday hosil bo'ladi?",
        options: ["Arteria ulnaris'ning to'g'ridan-to'g'ri davomi va Arteria radialis'ning Ramus palmaris superficialis tarmog'i anastomozidan", "Faqat bilak arteriyasidan", "Faqat orqa arteriyalardan", "Qo'ltiq osti arteriyasidan"],
        correctAnswerIndex: 0,
        explanation: "Yuzaki kaft ravog'ining asosiy qismini tirsak arteriyasi (a. ulnaris) tashkil qiladi va kaft aponevrozi ostida yotadi."
      },
      {
        question: "Chuqur kaft ravog'i (Arcus palmaris profundus) qanday hosil bo'ladi?",
        options: ["Arteria radialis'ning asosiy davomi va Arteria ulnaris'ning Ramus palmaris profundus tarmog'i anastomozidan", "Faqat tirsak arteriyasidan", "Kaft aponevrozidan", "Bosh barmoq venasidan"],
        correctAnswerIndex: 0,
        explanation: "Chuqur kaft ravog'ining asosini a. radialis tashkil etib, bukurchi mushaklar paylari ostida suyaklar ustida yotadi."
      },
      {
        question: "Bosh barmoqni qon bilan ta'minlovchi xususiy arteriya (Arteria princeps pollicis) qaysi arteriyadan to'g'ridan-to'g'ri chiqadi?",
        options: ["Arteria radialis (Bilak arteriyasidan, anatomik tamakidon sohasida)", "Arteria ulnaris", "Arcus palmaris superficialis", "Arteria interossea"],
        correctAnswerIndex: 0,
        explanation: "A. princeps pollicis a. radialis 1-barmoqlararo oraliqqa o'tish joyida chiqadi va bosh barmoq hamda ko'rsatkich barmog'iga shox beradi."
      },
      {
        question: "Umumiy suyaklararo arteriya (Arteria interossea communis) qaysi arteriyaning shoxi?",
        options: ["Arteria ulnaris (Tirsak arteriyasining)", "Arteria radialis", "Arteria brachialis", "Arteria axillaris"],
        correctAnswerIndex: 0,
        explanation: "A. ulnaris'dan umumiy suyaklararo arteriya chiqib, a. interossea anterior va a. interossea posterior'ga ajraladi."
      },
      {
        question: "Tirsak bo'g'imi atrofidagi arterial to'r (Rete articulare cubiti) nima uchun muhim?",
        options: ["Tirsak bo'g'imi maksimal bukilganda yoki yelka arteriyasi qisilganda qo'lning qon bilan ta'minlanishi uzilmasligini (kollateral qon aylanish) ta'minlaydi", "Faqat terini isitish uchun", "Mushaklarni kuchaytirish uchun", "Suyuqlik to'plash uchun"],
        correctAnswerIndex: 0,
        explanation: "Rete cubiti kollateral va rekurrent arteriyalar hisobiga hosil bo'lib, bukilish paytida qon aylanishni saqlaydi."
      },
      {
        question: "Qo'lning yuzaki teri osti venalaridan eng yiriklari qaysilar?",
        options: ["Vena cephalica (bosh vena - lateral tomonda) va Vena basilica (qirollik venasi - medial tomonda)", "Vena femoralis va saphena", "Vena jugularis", "Vena subclavia"],
        correctAnswerIndex: 0,
        explanation: "Vena cephalica bilak va yelkaning lateral chetidan, Vena basilica esa medial chetidan o'tadi."
      },
      {
        question: "Tirsak bukilmasidagi Vena mediana cubiti qon quyish va tahlil uchun nima sababdan eng ko'p ishlatiladi?",
        options: ["Teri ostida yaxshi ko'rinib turadi, fiksatsiyalangan va v. cephalica hamda v. basilica'ni o'zaro bog'laydi", "Arteriya bo'lgani uchun", "Suyak ichida yotgani uchun", "Og'riqsiz bo'lgani uchun"],
        correctAnswerIndex: 0,
        explanation: "Vena mediana cubiti yuzaki yotadi, harakatsizroq va igna kiritish uchun eng qulay tomir hisoblanadi."
      },
      {
        question: "Ichki ko'krak arteriyasi (Arteria thoracica interna) qaysi arteriyaning shoxi?",
        options: ["Arteria subclavia (O'mrov osti arteriyasining 1-bo'limidan)", "Aorta yoyidan", "Arteria axillaris'dan", "Arteria carotis externa'dan"],
        correctAnswerIndex: 0,
        explanation: "A. thoracica interna o'mrov osti arteriyasidan chiqib, to'sh suyagining orqa yuzasi bo'ylab pastga tushadi."
      },
      {
        question: "Ichki ko'krak arteriyasining to'g'ri qorin mushagi qiniga kiruvchi oxirgi shoxi nima?",
        options: ["Arteria epigastrica superior (yuqori qorin usti arteriyasi)", "Arteria musculophrenica", "Arteria epigastrica inferior", "Arteria intercostalis"],
        correctAnswerIndex: 0,
        explanation: "A. epigastrica superior qorin to'g'ri mushagini oziqlantiradi va kindik sohasida a. epigastrica inferior bilan tutashadi."
      },
      {
        question: "Qalqon-bo'yin poyasidan (Truncus thyrocervicalis) qaysi arteriyalar chiqadi?",
        options: ["Arteria thyroidea inferior, Arteria cervicalis ascendens, Arteria suprascapularis", "Arteria carotis interna", "Arteria thoracica interna", "Arteria vertebralis"],
        correctAnswerIndex: 0,
        explanation: "Truncus thyrocervicalis o'mrov osti arteriyasidan chiqib qalqonsimon bezga, bo'yinga va kurak ustiga shoxlar beradi."
      },
      {
        question: "Qovurg'a-bo'yin poyasi (Truncus costocervicalis) qaysi sohalarni qon bilan ta'minlaydi?",
        options: ["Yuqori 1-2 qovurg'alararo bo'shliqlarni (a. intercostalis suprema) va chuqur bo'yin mushaklarini (a. cervicalis profunda)", "Faqat yuzni", "Qorinni", "Qo'l panjasini"],
        correctAnswerIndex: 0,
        explanation: "Truncus costocervicalis a. subclavia'ning 2-bo'limidan chiqib dastlabki ikkita qovurg'alararo oraliqni oziqlantiradi."
      },
      {
        question: "Qo'ltiq osti venasi (Vena axillaris) qayerga quyiladi va qaysi venaga aylanadi?",
        options: ["1-qovurg'aning tashqi chetidan o'tib O'mrov osti venasiga (Vena subclavia) aylanadi", "Yelka venasiga", "Yuqori kovak venaga to'g'ridan-to'g'ri", "Yurakka"],
        correctAnswerIndex: 0,
        explanation: "V. axillaris qo'lning barcha chuqur va yuzaki venalarini qabul qilib 1-qovurg'a sohasida V. subclavia'ga davom etadi."
      },
      {
        question: "O'mrov osti venasi (V. subclavia) va Ichki bo'yininturuq venasi (V. jugularis interna) qo'shilish burchagi nima deyiladi?",
        options: ["Pirogov venoz burchagi (Angulus venosus)", "Kovak burchak", "Yurak burchagi", "Darvoza burchagi"],
        correctAnswerIndex: 0,
        explanation: "Pirogov burchagida bo'yininturuq va o'mrov osti venalari qo'shilib Vena brachiocephalica hosil bo'ladi va shu yerga limfa yo'llari quyiladi."
      },
      {
        question: "Anatomik tamakidon (Fovea radialis / Fossa tabatiere) tubidan qaysi arteriya o'tadi?",
        options: ["Arteria radialis (Bilak arteriyasi)", "Arteria ulnaris", "Arteria brachialis", "Arteria interossea"],
        correctAnswerIndex: 0,
        explanation: "Anatomik tamakidonda a. radialis to'g'ridan-to'g'ri qayiqsimon va trapetsiya suyaklari ustidan o'tib kaft orqasiga buriladi."
      },
      {
        question: "Qo'l panjasining orqa arterial to'ri (Rete carpi dorsale) dan qanday arteriyalar boshlanadi?",
        options: ["Arteriae metacarpales dorsales va ulardan chiquvchi Arteriae digitales dorsales (barmoqlar orqa arteriyalari)", "Faqat kaft arteriyalari", "Faqat chuqur ravoq", "Aorta shoxlari"],
        correctAnswerIndex: 0,
        explanation: "Rete carpi dorsale kaft orqa yuzasi va barmoqlar orqa qismini qon bilan ta'minlovchi tomirlarni beradi."
      },
      {
        question: "Qo'l barmoqlarining xususiy kaft arteriyalari (Arteriae digitales palmares propriae) qaysi ravoqdan chiqadi?",
        options: ["Arcus palmaris superficialis'dan chiquvchi umumiy kaft barmoq arteriyalari (Aa. digitales palmares communes) ning bo'linishidan", "Chuqur ravoqdan", "Bilak arteriyasidan to'g'ridan-to'g'ri", "Orqa to'rdan"],
        correctAnswerIndex: 0,
        explanation: "Yuzaki ravoqdan chiquvchi umumiy barmoq arteriyalari barmoqlar asosida o'ng va chap xususiy barmoq arteriyalariga ajraladi."
      },
      {
        question: "O'mrov osti arteriyasining kompressiyasi (bosilishi) suyak sinishlarida yoki shoshilinch qon to'xtatishda qayerga bosiladi?",
        options: ["1-qovurg'aning Lisfrank do'mboqchasiga (Tuberculum musculi scaleni anterioris)", "O'mrov suyagi o'rtasiga", "To'sh suyagiga", "Kurak suyagiga"],
        correctAnswerIndex: 0,
        explanation: "A. subclavia'ni 1-qovurg'aga bosish orqali butun qo'l bo'ylab kuchli arterial qon ketishini zudlik bilan to'xtatish mumkin."
      }
    ]
  },

  // ==========================================
  // TOPIC 11 (Order 24): Ko‘krak va qorin aortasi. Tarmoqlari
  // ==========================================
  {
    topicOrder: 24,
    topicKeywords: ["ko'krak aortasi", "qorin aortasi", "aorta thoracica", "aorta abdominalis", "truncus coeliacus", "mesenterica", "renalis"],
    quizzes: [
      {
        question: "Tushuvchi aorta (Aorta descendens) qaysi ikki qismga bo'linadi?",
        options: ["Aorta thoracica (ko'krak aortasi - Th4 dan Th12 gacha) va Aorta abdominalis (qorin aortasi - Th12 dan L4 gacha)", "Aorta ascendens va arcus aortae", "Pars cardiaca va pelvina", "Aorta superior va inferior"],
        correctAnswerIndex: 0,
        explanation: "Tushuvchi aorta diafragmaning Hiatus aorticus teshigidan (Th12) o'tish chegarasi bo'yicha ko'krak va qorin qismlariga bo'linadi."
      },
      {
        question: "Ko'krak aortasining (Aorta thoracica) parietal (devoriy) shoxlariga qaysilar kiradi?",
        options: ["Arteriae intercostales posteriores (3-11 juft orqa qovurg'alararo arteriyalar) va Arteriae phrenicae superiores", "Rami bronchiales", "Rami oesophageales", "Rami pericardiaci"],
        correctAnswerIndex: 0,
        explanation: "Devoriy shoxlar qovurg'alararo bo'shliqlarga, orqa ko'krak devori mushaklariga va diafragmaning yuqori yuzasiga boradi."
      },
      {
        question: "Ko'krak aortasining visseral (a'zolarga boruvchi) shoxlari qaysilar?",
        options: ["Rami bronchiales (bronxlarga), Rami oesophageales (qizilo'ngachga), Rami pericardiaci (perikardga), Rami mediastinales", "Arteriae intercostales", "Arteriae lumbales", "Truncus coeliacus"],
        correctAnswerIndex: 0,
        explanation: "Visseral shoxlar o'pka to'qimasi, qizilo'ngach, perikard va ko'ks oralig'i limfa tugunlarini oziqlantiradi."
      },
      {
        question: "Qorin aortasi (Aorta abdominalis) qaysi umurtqa darajasida ikkita umumiy yonbosh arteriyasiga bo'linadi (Bifurcatio aortae)?",
        options: ["IV bel umurtqasi (L4) darajasida", "I bel umurtqasida (L1)", "XII ko'krak umurtqasida (Th12)", "I dumg'aza umurtqasida (S1)"],
        correctAnswerIndex: 0,
        explanation: "L4 umurtqa tanasi oldida qorin aortasi Arteria iliaca communis dextra va sinistra'ga bo'linib tugaydi."
      },
      {
        question: "Qorin aortasining toq visseral shoxlari qaysilar?",
        options: ["1) Truncus coeliacus (qorin poyasi), 2) Arteria mesenterica superior (yuqori tutqich arteriyasi), 3) Arteria mesenterica inferior (pastki tutqich arteriyasi)", "Arteria renalis va testicularis", "Arteriae lumbales", "Arteriae phrenicae inferiores"],
        correctAnswerIndex: 0,
        explanation: "Ushbu 3 ta toq visseral arteriyalar qorin bo'shlig'idagi barcha hazm a'zolari va taloqni qon bilan ta'minlaydi."
      },
      {
        question: "Qorin poyasi (Truncus coeliacus / Galler uchburchagi) qaysi 3 ta yirik arteriyaga bo'linadi?",
        options: ["1) Arteria gastrica sinistra (chap oshqozon), 2) Arteria hepatica communis (umumiy jigar), 3) Arteria lienalis / splenica (taloq arteriyasi)", "A. mesenterica superior va inferior", "A. renalis dextra va sinistra", "A. iliaca interna va externa"],
        correctAnswerIndex: 0,
        explanation: "Truncus coeliacus Th12 darajasida chiqib jigar, oshqozon, taloq, o'n ikki barmoqli ichak va oshqozon osti bezini oziqlantiradi."
      },
      {
        question: "Yuqori tutqich arteriyasi (Arteria mesenterica superior) qaysi a'zolarni qon bilan ta'minlaydi?",
        options: ["O'n ikki barmoqli ichakning pastki qismidan to Ko'ndalang chambar ichakning o'ng 2/3 qismigacha (butun ingichka ichak, ko'richak, ko'tariluvchi va ko'ndalang chambar)", "Faqat oshqozonni", "Faqat to'g'ri ichakni", "Faqat jigar va taloqni"],
        correctAnswerIndex: 0,
        explanation: "A. mesenterica superior L1 darajasida chiqib, deyarli butun ingichka ichak va yo'g'on ichakning o'ng yarmini ta'minlaydi."
      },
      {
        question: "Pastki tutqich arteriyasi (Arteria mesenterica inferior) qaysi a'zolarni qon bilan ta'minlaydi?",
        options: ["Ko'ndalang chambar ichakning chap 1/3 qismi, Tushuvchi chambar, Sigmasimon chambar va To'g'ri ichakning yuqori qismini (A. rectalis superior)", "Ingichka ichakni", "Oshqozonni", "Jigarni"],
        correctAnswerIndex: 0,
        explanation: "A. mesenterica inferior L3 darajasida chiqib yo'g'on ichakning chap yarmi va to'g'ri ichak yuqorisiga qon beradi."
      },
      {
        question: "Qorin aortasining juft visseral shoxlariga qaysilar kiradi?",
        options: ["Arteria suprarenalis media (o'rta buyrak usti bezi), Arteria renalis (buyrak arteriyasi), Arteria testicularis / ovarica (moyak / tuxumdon arteriyasi)", "Truncus coeliacus", "Arteria gastrica sinistra", "Arteriae lumbales"],
        correctAnswerIndex: 0,
        explanation: "Juft visseral shoxlar buyrak usti bezlari, buyraklar va jinsiy bezlarga (moyak/tuxumdon) boradi."
      },
      {
        question: "Qorin aortasining parietal (devoriy) shoxlari qaysilar?",
        options: ["Arteriae phrenicae inferiores (pastki diafragma arteriyalari) va 4 juft Arteriae lumbales (bel arteriyalari)", "Truncus coeliacus", "Arteria mesenterica superior", "Arteria iliaca communis"],
        correctAnswerIndex: 0,
        explanation: "Devoriy shoxlar diafragma ostki yuzasini hamda qorin orqa devori mushaklari va umurtqalarni oziqlantiradi."
      },
      {
        question: "Riolan ravoqi (Arcus Riolani) nima?",
        options: ["Arteria mesenterica superior (a. colica media) va Arteria mesenterica inferior (a. colica sinistra) orasidagi chambar ichak bo'ylab hosil bo'lgan anastomoz", "Jigar ichidagi tomir to'ri", "Kaftdagi ravoq", "Yurakdagi anomaliya"],
        correctAnswerIndex: 0,
        explanation: "Riolan ravoqi yo'g'on ichak tutqichi bo'ylab o'tuvchi hayotiy muhim kollateral anastomozdir."
      },
      {
        question: "Buyrak arteriyasi (Arteria renalis) qaysi umurtqa darajasida qorin aortasidan chiqadi?",
        options: ["I-II bel umurtqalari (L1-L2) darajasida", "IV bel umurtqasida (L4)", "X ko'krak umurtqasida (Th10)", "III dumg'aza umurtqasida (S3)"],
        correctAnswerIndex: 0,
        explanation: "A. renalis L1-L2 darajasida to'g'ri burchak ostida chiqadi; o'ng buyrak arteriyasi pastki kovak vena orqasidan o'tib uzunroq bo'ladi."
      },
      {
        question: "Umumiy yonbosh arteriyasi (Arteria iliaca communis) qaysi ikki arteriyaga bo'linadi?",
        options: ["Arteria iliaca interna (ichki yonbosh - kichik chanoq a'zolariga) va Arteria iliaca externa (tashqi yonbosh - oyoqqa)", "Arteria femoralis va poplitea", "Arteria renalis va mesenterica", "Arteria pudenda va obturatoria"],
        correctAnswerIndex: 0,
        explanation: "Dumg'aza-yonbosh bo'g'imi sohasida umumiy yonbosh arteriyasi ichki (chanoq a'zolariga) va tashqi (oyoqqa) shoxlarga ajraladi."
      },
      {
        question: "Tashqi yonbosh arteriyasi (Arteria iliaca externa) qaysi anatomik chegaradan o'tgach Son arteriyasiga (Arteria femoralis) aylanadi?",
        options: ["Chov boylami ostidan (Ligamentum inguinale / Lacuna vasorum orqali) o'tgach", "Katta o'tirg'ich teshigidan o'tgach", "Son suyagi bo'ynidan o'tgach", "Tizza bo'g'imidan o'tgach"],
        correctAnswerIndex: 0,
        explanation: "A. iliaca externa chov boylami ostidagi tomir lakunasidan son sohasiga o'tgach A. femoralis deb ataladi."
      },
      {
        question: "Ichki yonbosh arteriyasining (Arteria iliaca interna) parietal shoxlariga qaysilar kiradi?",
        options: ["Arteria iliolumbalis, Arteria sacralis lateralis, Arteria obturatoria, Arteria glutea superior va Arteria glutea inferior", "Arteria uterina va vesicalis", "Arteria rectalis media", "Arteria pudenda interna"],
        correctAnswerIndex: 0,
        explanation: "Parietal shoxlar chanoq devori, dumg'aza suyagi, quymich (dumbasi) sohasi mushaklarini qon bilan ta'minlaydi."
      },
      {
        question: "Ichki yonbosh arteriyasining visseral shoxlariga qaysilar kiradi?",
        options: ["Arteria umbilicalis, Arteria vesicalis inferior, Arteria uterina (ayollarda) / Arteria ductus deferentis (erkaklarda), Arteria rectalis media, Arteria pudenda interna", "Arteria glutea superior", "Arteria obturatoria", "Arteriae lumbales"],
        correctAnswerIndex: 0,
        explanation: "Visseral shoxlar qovuq, bachadon, qin, to'g'ri ichak va tashqi jinsiy a'zolarni oziqlantiradi."
      },
      {
        question: "Bachadon arteriyasi (Arteria uterina) siydik nayi (Ureter) bilan qanday topografik munosabatda kesishadi?",
        options: ["Bachadon bo'yni yonida siydik nayining oldi ustidan ko'prik kabi kesib o'tadi ('Water under the bridge')", "Siydik nayi orqasidan", "Kesishmaydi", "Bachadon ichida"],
        correctAnswerIndex: 0,
        explanation: "Ginekologik operatsiyalarda a. uterina bog'langanda siydik nayini kesib yubormaslik uchun bu o'zaro munosabat juda muhim."
      },
      {
        question: "Taloq arteriyasi (Arteria lienalis / splenica) ning anatomik o'ziga xosligi nimada?",
        options: ["Oshqozon osti bezi yuqori cheti bo'ylab ilon izi (buralma / tortuous) bo'lib yo'naladi", "To'g'ri chiziq bo'lib o'tadi", "Jigar ichiga kiradi", "Bo'yin sohasida yotadi"],
        correctAnswerIndex: 0,
        explanation: "A. lienalis qorin poyasining eng yirik shoxi bo'lib, oshqozon harakatlariga moslashish uchun kuchli buralma yo'nalishga ega."
      },
      {
        question: "Oshqozon-o'n ikki barmoqli ichak arteriyasi (Arteria gastroduodenalis) qaysi arteriyadan boshlanadi?",
        options: ["Arteria hepatica communis (Umumiy jigar arteriyasidan)", "Arteria lienalis", "Truncus coeliacus", "Arteria mesenterica superior"],
        correctAnswerIndex: 0,
        explanation: "A. gastroduodenalis umumiy jigar arteriyasidan chiqib, oshqozon katta egriligiga va o'n ikki barmoqli ichakka shoxlar beradi."
      },
      {
        question: "To'g'ri ichakning qon bilan ta'minlanishida qaysi 3 ta arteriya ishtirok etadi?",
        options: ["1) A. rectalis superior (a. mesenterica inferior'dan), 2) A. rectalis media (a. iliaca interna'dan), 3) A. rectalis inferior (a. pudenda interna'dan)", "Faqat buyrak arteriyasi", "Faqat oshqozon arteriyasi", "Faqat jigar arteriyasi"],
        correctAnswerIndex: 0,
        explanation: "To'g'ri ichak yuqori, o'rta va pastki to'g'ri ichak arteriyalari orqali 3 xil manbadan qon oladi."
      },
      {
        question: "Qorin aortasi anevrizmasi (Aneurysma aortae abdominalis) ko'pincha qaysi sohada uchraydi?",
        options: ["Buyrak arteriyalaridan pastda (Infrarenal sohada - 90% holatlarda)", "Ko'krak qismida", "Aorta boshlanishida", "Iliakal arteriyalarda"],
        correctAnswerIndex: 0,
        explanation: "Infrarenal qorin aortasida elastik tolalarning kamligi sababli aterosklerozda anevrizma (kengayish va yorilish xavfi) ko'p bo'ladi."
      },
      {
        question: "Son arteriyasi (Arteria femoralis) ning eng yirik asosiy shoxi qaysi?",
        options: ["Arteria profunda femoris (Sonning chuqur arteriyasi)", "Arteria poplitea", "Arteria tibialis anterior", "Arteria dorsalis pedis"],
        correctAnswerIndex: 0,
        explanation: "A. profunda femoris sonning barcha orqa va medial guruh mushaklarini hamda son suyagini oziqlantiradi."
      },
      {
        question: "Taqim arteriyasi (Arteria poplitea) tizza chuqurchasidan chiqqach qaysi ikki arteriyaga bo'linadi?",
        options: ["Arteria tibialis anterior (oldingi katta boldir) va Arteria tibialis posterior (orqa katta boldir)", "Arteria femoralis va profunda femoris", "Arteria fibularis va plantaris", "Arteria radialis va ulnaris"],
        correctAnswerIndex: 0,
        explanation: "A. poplitea taqim chuqurchasi pastki burchagida a. tibialis anterior va a. tibialis posterior'ga ajraladi."
      },
      {
        question: "Oyoq panjasining orqa yuzasidagi tomir urishi (puls) qaysi arteriyada paypaslanadi?",
        options: ["Arteria dorsalis pedis (oldingi katta boldir arteriyasining davomi, 1-va 2-kaft suyaklari oralig'ida)", "Arteria plantaris medialis", "Arteria poplitea", "Arteria fibularis"],
        correctAnswerIndex: 0,
        explanation: "A. dorsalis pedis oyoq panjasi orqasida teri ostida yotadi va qon tomir kasalliklarini baholashda tekshiriladi."
      },
      {
        question: "Medial to'piq orqasida (Canalis malleolaris) qaysi arteriyaning pulsi paypaslanadi?",
        options: ["Arteria tibialis posterior (Orqa katta boldir arteriyasi)", "Arteria tibialis anterior", "Arteria dorsalis pedis", "Arteria peronea"],
        correctAnswerIndex: 0,
        explanation: "A. tibialis posterior medial to'piqning orqa-pastki egatidan o'tib tovon va taglikka (kaftga) tarmoqlanadi."
      },
      {
        question: "Oyoq tagi (kaft) chuqur arterial ravog'i (Arcus plantaris profundus) qaysi arteriyadan hosil bo'ladi?",
        options: ["Arteria plantaris lateralis va Arteria dorsalis pedis'ning chuqur tarmog'i anastomozidan", "Faqat son arteriyasidan", "Faqat orqa boldir arteriyasidan", "Kichik boldir arteriyasidan"],
        correctAnswerIndex: 0,
        explanation: "Arcus plantaris profundus oyoq tagi suyaklararo mushaklari ustida yotib barmoqlarga qon beradi."
      },
      {
        question: "Lerish sindromi (Sindrom Leriche) nima?",
        options: ["Qorin aortasi bifurkatsiyasining yoki yonbosh arteriyalarining aterosklerotik berkilib qolishi (oyoqlarda oqsoqlik, puls yo'qligi, ojizlik)", "O'pka arteriyasi emboliyasi", "Buyrak infarkti", "Miya insulti"],
        correctAnswerIndex: 0,
        explanation: "Aorta bifurkatsiyasining okklyuziyasi ikkala oyoq ishemiyasi va tos a'zolari qon aylanishining buzilishiga olib keladi."
      },
      {
        question: "Chov churrasi operatsiyasida 'O'lim toji' (Corona mortis) xavfli anomaliyasi nimadan iborat?",
        options: ["Arteria obturatoria va Arteria epigastrica inferior orasidagi qon tomir anastomozi (jarrohlikda kesilsa to'xtatib bo'lmas qon ketadi)", "Yurak tomiri anomaliyasi", "Miya anevrizmasi", "Aorta yorilishi"],
        correctAnswerIndex: 0,
        explanation: "Corona mortis qov suyagi orqasida yotuvchi noan'anaviy yirik arterial anastomoz bo'lib, churra kesilganda jarohatlanishi o'limga olib kelishi mumkin."
      },
      {
        question: "Qorin aortasining oxirgi toq yupqa davomi nima deb ataladi?",
        options: ["Arteria sacralis mediana (O'rta dumg'aza arteriyasi - L4 dan dum suyagigacha tushadi)", "Arteria lumbalis", "Arteria iliolumbalis", "Arteria pudenda"],
        correctAnswerIndex: 0,
        explanation: "Arteria sacralis mediana embrional tana aortasining qoldig'i bo'lib, dumg'aza suyagining oldingi yuzasi bo'ylab tushadi."
      },
      {
        question: "Son kanalining ichki teshigi (Anulus femoralis) ning lateral devorini nima hosil qiladi?",
        options: ["Vena femoralis (Son venasi)", "Arteria femoralis", "Nervus femoralis", "Ligamentum inguinale"],
        correctAnswerIndex: 0,
        explanation: "Tomir lakunasida arteriya tashqarida, son venasi ichkarida yotadi; son venasining mediali son halqasidir."
      }
    ]
  },

  // ==========================================
  // TOPIC 12 (Order 25): Yuqori kovak vena. Pastki kovak vena. Darvoza venasi
  // ==========================================
  {
    topicOrder: 25,
    topicKeywords: ["yuqori kovak", "pastki kovak", "darvoza venasi", "vena cava superior", "vena cava inferior", "vena portae", "kava-kaval", "porto-kaval"],
    quizzes: [
      {
        question: "Yuqori kovak vena (Vena cava superior) qanday hosil bo'ladi?",
        options: ["O'ng va chap yelka-bosh venalarining (Vena brachiocephalica dextra et sinistra) o'ng 1-qovurg'a orqasida qo'shilishidan", "Umurtqa venalaridan", "Bo'yin venalaridan", "O'mrov osti venalaridan"],
        correctAnswerIndex: 0,
        explanation: "Vena cava superior bosh, bo'yin, qo'llar va ko'krak qafasidan venoz qon yig'ib o'ng bo'lmachaga quyadi."
      },
      {
        question: "Toq vena (Vena azygos) qayerga quyiladi?",
        options: ["Yuqori kovak venaning (Vena cava superior) orqa devoriga (Th4-Th5 darajasida)", "Pastki kovak venaga", "Yelka-bosh venasiga", "Darvoza venasiga"],
        correctAnswerIndex: 0,
        explanation: "Vena azygos o'ng ko'krak orqa devoridan venoz qonni yig'ib, o'ng bosh bronx ustidan oshib o'tib yuqori kovak venaga quyiladi."
      },
      {
        question: "Yarim toq vena (Vena hemiazygos) qayerdan qon yig'adi va qayerga quyiladi?",
        options: ["Chap ko'krak orqa devoridan qon yig'adi va Th7-Th8 darajasida umurtqa ustidan o'ngga burilib Vena azygos'ga quyiladi", "Pastki kovak venaga quyiladi", "Yurakka to'g'ridan-to'g'ri quyiladi", "Bo'yin venasiga quyiladi"],
        correctAnswerIndex: 0,
        explanation: "Vena hemiazygos chap tomonlama qovurg'alararo venalarni yig'ib toq venaga (Vena azygos) quyiladi."
      },
      {
        question: "Pastki kovak vena (Vena cava inferior) qayerda va qanday hosil bo'ladi?",
        options: ["IV-V bel umurtqalari (L4-L5) darajasida o'ng va chap Umumiy yonbosh venalarining (Vena iliaca communis dextra et sinistra) qo'shilishidan", "Chanoq ichida", "Diafragma ustida", "Buyraklar orqasida"],
        correctAnswerIndex: 0,
        explanation: "Pastki kovak vena inson tanasidagi eng yirik vena bo'lib, oyoqlar, chanoq va qorin a'zolaridan qon yig'adi."
      },
      {
        question: "Pastki kovak vena diafragmaning qaysi teshigidan ko'krak bo'shlig'iga o'tadi?",
        options: ["Foramen venae cavae (diafragmaning pay markazidagi teshik - Th8 darajasida)", "Hiatus aorticus", "Hiatus oesophageus", "Trigonum sternocostale"],
        correctAnswerIndex: 0,
        explanation: "Foramen venae cavae pay to'qimasi ichida bo'lgani uchun nafas olganda vena devori qisilmaydi, aksincha kengayadi."
      },
      {
        question: "Pastki kovak venaning parietal (devoriy) quyiluvchilariga qaysilar kiradi?",
        options: ["Venae lumbales (bel venalari) va Venae phrenicae inferiores (pastki diafragma venalari)", "Venae hepaticae", "Venae renales", "Venae testiculares"],
        correctAnswerIndex: 0,
        explanation: "Parietal venalar qorin orqa devori va diafragma ostidan qonni pastki kovak venaga olib keladi."
      },
      {
        question: "Pastki kovak venaning visseral quyiluvchilariga qaysilar kiradi?",
        options: ["Venae hepaticae (jigar venalari), Venae renales (buyrak venalari), Vena suprarenalis dextra, Vena testicularis / ovarica dextra", "Oshqozon va ichak venalari", "Taloq venasi", "Yuqori tutqich venasi"],
        correctAnswerIndex: 0,
        explanation: "Me'da-ichak yo'li venalari pastki kovak venaga EMAS, avval Darvoza venasiga boradi; buyrak va jigar venalari esa to'g'ridan-to'g'ri kovak venaga quyiladi."
      },
      {
        question: "Darvoza venasi (Vena portae hepatis) qaysi a'zolardan venoz qon yig'adi?",
        options: ["Qorin bo'shlig'idagi barcha toq a'zolardan: oshqozon, ingichka va yo'g'on ichaklar, taloq, o't pufagi, oshqozon osti bezidan", "Faqat buyraklardan", "Faqat oyoqlardan", "Faqat ko'krak a'zolaridan"],
        correctAnswerIndex: 0,
        explanation: "Vena portae barcha hazm qilish a'zolaridan so'rilgan moddalarga boy qonni jigarga tozalash va zararsizlantirish uchun olib boradi."
      },
      {
        question: "Darvoza venasining (Vena portae) 3 ta asosiy ildizi (hosil qiluvchi tomirlari) qaysilar?",
        options: ["1) Vena mesenterica superior, 2) Vena mesenterica inferior, 3) Vena lienalis / splenica (taloq venasi)", "Vena renalis va hepatica", "Vena cava superior va inferior", "Vena iliaca interna va externa"],
        correctAnswerIndex: 0,
        explanation: "Oshqozon osti bezi boshi orqasida yuqori va pastki tutqich venalari hamda taloq venasi qo'shilib Vena portae'ni hosil qiladi."
      },
      {
        question: "Porto-kaval anastomoz nima?",
        options: ["Darvoza venasi (Vena portae) tizimi va Kovak venalar (V. cava superior et inferior) tizimlari orasidagi o'zaro tutashuvlar", "Ikki kovak vena orasidagi tutashuv", "Arteriya va vena tutashuvi", "Yurak ichidagi teshik"],
        correctAnswerIndex: 0,
        explanation: "Jigarda qon oqimi qiyinlashganda (jigar sirrozi, portal gipertenziya) qon aylanma porto-kaval anastomozlar orqali kovak venalarga oqadi."
      },
      {
        question: "Qizilo'ngachning pastki qismidagi Porto-Kaval anastomoz qaysi venalar orasida hosil bo'ladi?",
        options: ["Vena gastrica sinistra (V. portae tarmog'i) va Venae oesophageales (V. azygos orqali V. cava superior tarmog'i)", "Vena renalis va iliaca", "Vena umbilicalis va femoralis", "Vena rectalis inferior va media"],
        correctAnswerIndex: 0,
        explanation: "Portal gipertenziyada qizilo'ngach pastki venalari kengayadi (varikoz) va yorilib hayot uchun xavfli qon ketishga sabab bo'ladi."
      },
      {
        question: "To'g'ri ichak devoridagi Porto-Kaval anastomoz qaysi venalar orasida joylashgan?",
        options: ["Vena rectalis superior (V. portae tizimi) va Venae rectales media et inferior (V. cava inferior tizimi)", "Vena gastrica va lienalis", "Vena azygos va hemiazygos", "Vena saphena va femoralis"],
        correctAnswerIndex: 0,
        explanation: "To'g'ri ichak venalari chigalida darvoza va pastki kovak venalari tutashadi; sirrozda bu yerda gemorroidal venalar kengayadi."
      },
      {
        question: "Qorin old devoridagi Kindik atrofidagi Porto-Kaval anastomoz ('Medo'za boshi' / Caput Medusae) qanday hosil bo'ladi?",
        options: ["Venae paraumbilicales (jigar yumaloq boylamidagi darvoza venasi shoxlari) va Venae epigastricae superior et inferior (kovak venalar shoxlari) anastomozidan", "Faqat teri venalaridan", "Ko'krak venalaridan", "Son venalaridan"],
        correctAnswerIndex: 0,
        explanation: "Portal gipertenziyada kindik atrofidagi teri osti venalari ilon izi bo'lib kengayib bo'rtib chiqadi (Caput Medusae)."
      },
      {
        question: "Kava-kaval anastomoz nima?",
        options: ["Yuqori kovak vena (V. cava superior) va Pastki kovak vena (V. cava inferior) tizimlari orasidagi bevosita tutashuvlar", "Darvoza venasi bilan tutashuv", "Yurak qorinchalari tutashuvi", "Arteriyalar tutashuvi"],
        correctAnswerIndex: 0,
        explanation: "Kovak venalardan biri to'silib qolganda qon ikkinchi kovak venaga kava-kaval anastomozlar orqali oqib o'tadi."
      },
      {
        question: "Qorin orqa devoridagi eng yirik Kava-Kaval anastomoz qaysi?",
        options: ["Vena azygos va Vena hemiazygos (yuqori kovak tizimi) bilan Venae lumbales ascendens (pastki kovak tizimi) orasidagi tutashuv", "Kindik venalari", "Qizilo'ngach venalari", "To'g'ri ichak venalari"],
        correctAnswerIndex: 0,
        explanation: "Ko'tariluvchi bel venalari pastda pastki kovak venaga, yuqorida esa toq va yarim toq venalarga (yuqori kovak tizimiga) ulanadi."
      },
      {
        question: "Qorin old devoridagi Kava-Kaval anastomoz qaysi venalar orasida joylashgan?",
        options: ["Vena epigastrica superior (V. cava superior tizimi) va Vena epigastrica inferior (V. cava inferior tizimi)", "Vena portae va renalis", "Vena jugularis va subclavia", "Vena cava superior va coronaria"],
        correctAnswerIndex: 0,
        explanation: "Qorin to'g'ri mushagi orqa qinida yuqori va pastki epigastral venalar o'zaro tutashib to'g'ridan-to'g'ri kava-kaval yo'l hosil qiladi."
      },
      {
        question: "Jigar venalari (Venae hepaticae) nechta va qayerga ochiladi?",
        options: ["2-3 ta yirik vena bo'lib, jigarning orqa egatida to'g'ridan-to'g'ri Pastki kovak venaga ochiladi", "Darvoza venasiga ochiladi", "O'ng qorinchaga ochiladi", "O't pufagiga ochiladi"],
        correctAnswerIndex: 0,
        explanation: "Jigardan tozalangan barcha qon 2-3 ta Venae hepaticae orqali diafragmadan o'tish joyida pastki kovak venaga quyiladi."
      },
      {
        question: "Badd-Kiari sindromi (Sindrom Budd-Chiari) nima?",
        options: ["Jigar venalarining (Venae hepaticae) yoki pastki kovak venaning jigar sohasida trombozi yoki to'silishi (gepatomegaliya, assit, sariqlik)", "O'pka infarkti", "Buyrak yetishmovchiligi", "Miya anevrizmasi"],
        correctAnswerIndex: 0,
        explanation: "Jigar venalari berkilib qolsa jigardan qon chiqib ketolmaydi, jigar shishadi va o'tkir portal gipertenziya paydo bo'ladi."
      },
      {
        question: "Ichki bo'yininturuq venasi (Vena jugularis interna) kalla suyagidan qaysi teshik orqali chiqadi?",
        options: ["Foramen jugulare (Bo'yininturuq teshigi orqali)", "Foramen magnum", "Foramen ovale", "Canalis caroticus"],
        correctAnswerIndex: 0,
        explanation: "Vena jugularis interna foramen jugulare'da Sinus sigmoideus davomi sifatida boshlanib bo'yinga tushadi."
      },
      {
        question: "Bosh miya qattiq pardasi venoz sinuslarining (Sinus durae matris) oddiy venalardan asosiy farqi nimada?",
        options: ["Devorida mushak qavati bo'lmaydi, qattiq fibroz to'qimadan tuzilgan bo'lib doimo ochiq turadi va klapanlari bo'lmaydi", "Klapanlarga boy bo'ladi", "Faqat arterial qon tashiydi", "Devori juda qalin mushakdan iborat"],
        correctAnswerIndex: 0,
        explanation: "Venoz sinuslar devori suyakka yopishgan qattiq pardadan tuzilgani uchun hech qachon qulab (kollaps bo'lib) yopilmaydi."
      },
      {
        question: "Bosh miya qattiq pardasining eng katta venoz sinusi qaysi?",
        options: ["Sinus sagittalis superior (yuqori sagittal sinus)", "Sinus cavernosus", "Sinus petrosus", "Sinus rectus"],
        correctAnswerIndex: 0,
        explanation: "Sinus sagittalis superior falx cerebri yuqori cheti bo'ylab kalla gumbazida joylashgan eng yirik sinusdir."
      },
      {
        question: "Kavernoz sinus (Sinus cavernosus) qayerda joylashgan va ichidan qaysi tuzilmalar o'tadi?",
        options: ["Turk egarchasining ikki yonida; ichidan Arteria carotis interna va Nervus abducens (VI) o'tadi", "Ensa suyagida", "Peshona bo'lagida", "Ko'z kosasi tubida"],
        correctAnswerIndex: 0,
        explanation: "Sinus cavernosus miya asosida yotadi, uning devoridan III, IV, V1, V2 nervlar, ichidan esa a. carotis interna va VI nerv o'tadi."
      },
      {
        question: "Yuzning 'Xavfli uchburchagi' (burun-lab burchagi) dagi yiringli jarayonlar infeksiyasi miyaga qaysi yo'l orqali o'tishi mumkin?",
        options: ["Vena facialis -> Vena ophthalmica superior -> Sinus cavernosus (kavernoz sinus tromboziga sabab bo'ladi)", "To'g'ridan-to'g'ri quloqqa", "Pastki kovak venaga", "Yurakka"],
        correctAnswerIndex: 0,
        explanation: "Yuz venalarida klapan bo'lmagani uchun yiringli tromb ko'z venalari orqali to'g'ridan-to'g'ri kalla ichidagi kavernoz sinusga tushadi."
      },
      {
        question: "Emissar venalar (Venae emissariae) qanday vazifani bajaradi?",
        options: ["Kalla suyagi ichidagi venoz sinuslarni kalla suyagi tashqarisidagi bosh terisi venalari bilan tutashtiradi", "Faqat tishlarni qon bilan ta'minlaydi", "Ko'rishni yaxshilaydi", "Qonni quyiltiradi"],
        correctAnswerIndex: 0,
        explanation: "Emissar venalar kalla suyaklaridagi maxsus teshiklardan o'tib bosimni tenglashtiradi, lekin infeksiyani kalla ichiga o'tkazishi ham mumkin."
      },
      {
        question: "Diploik venalar (Venae diploicae) qayerda joylashgan?",
        options: ["Kalla yassi suyaklarining gubkasimon moddasi (diploe) kanallari ichida", "Miya qorinchalarida", "Bo'yin mushaklarida", "Yurak devorida"],
        correctAnswerIndex: 0,
        explanation: "Diploik venalar kalla suyaklarining ichki va tashqi kompakt plastinkalari orasidagi diploe qavatida joylashgan."
      },
      {
        question: "Oyoqning katta teri osti venasi (Vena saphena magna) qayerdan boshlanadi va qayerga quyiladi?",
        options: ["Oyoq panjasining medial chetidan boshlanib, butun oyoq bo'ylab ko'tariladi va chov sohasida (Hiatus saphenus) Vena femoralis'ga quyiladi", "Tizza chuqurchasiga quyiladi", "Pastki kovak venaga to'g'ridan-to'g'ri quyiladi", "Kichik boldir venasiga quyiladi"],
        correctAnswerIndex: 0,
        explanation: "Vena saphena magna inson tanasidagi eng uzun teri osti venasi bo'lib, ko'pincha varikoz kasalligiga uchraydi va shuntlashda ishlatiladi."
      },
      {
        question: "Oyoqning kichik teri osti venasi (Vena saphena parva) qayerga quyiladi?",
        options: ["Tizza orqasida Taqim venasiga (Vena poplitea)", "Son venasiga", "Ichki yonbosh venasiga", "Katta teri osti venasiga"],
        correctAnswerIndex: 0,
        explanation: "V. saphena parva lateral to'piq orqasidan ko'tarilib taqim chuqurchasida Vena poplitea'ga quyiladi."
      },
      {
        question: "Pastki kovak vena sindromi (homilador ayollarda yoki retroperitoneal o'smalarda) qanday belgilar bilan namoyon bo'ladi?",
        options: ["Orqa bilan yotganda pastki kovak vena ezilib, oyoqlarda shish, venoz bosim oshishi, arterial gipotoniyaga va bosh aylanishiga sabab bo'ladi", "Qo'llar ko'karadi", "Bosh og'riydi", "Ko'rish xiralashadi"],
        correctAnswerIndex: 0,
        explanation: "Katta bachadon pastki kovak venani umurtqaga qisib qo'yganda yurakka venoz qaytish keskin kamayadi (kollaps holati)."
      },
      {
        question: "Taloq venasi (Vena lienalis) qaysi a'zoning orqa yuzasi bo'ylab o'tadi?",
        options: ["Oshqozon osti bezi (Pancreas) tanasi va dumining orqa yuzasidagi egatda", "Jigar ostida", "Buyrak ichida", "Oshqozon oldida"],
        correctAnswerIndex: 0,
        explanation: "Vena lienalis oshqozon osti bezi orqasida gorizontal yotadi va a. lienalis'dan pastroqda bo'ladi."
      },
      {
        question: "Portal gipertenziya nima?",
        options: ["Darvoza venasi (Vena portae) tizimida qon bosimining normadan (5-10 mm sim. ust.) yuqori (20-30 mm sim. ust.) ko'tarilib ketishi", "Aorta bosimining ko'tarilishi", "O'pka bosimining tushishi", "Kovak vena yallig'lanishi"],
        correctAnswerIndex: 0,
        explanation: "Portal gipertenziya jigar sirrozida rivojlanib, assit (qorinda suv yig'ilishi), splenomegaliya va venalar varikoziga olib keladi."
      }
    ]
  },

  // ==========================================
  // TOPIC 13 (Order 26): Limfa tizimi. Limfa yo‘llari. Anastomozlar
  // ==========================================
  {
    topicOrder: 26,
    topicKeywords: ["limfa", "ductus thoracicus", "nodi lymphoidei", "limfa tuguni", "immun", "anastomoz", "chilus"],
    quizzes: [
      {
        question: "Ko'krak limfa yo'li (Ductus thoracicus) inson tanasining qancha qismidan limfa yig'adi?",
        options: ["Tananing 3/4 qismidan (ikkala oyoq, chanoq, qorin bo'shlig'i, chap ko'krak, chap qo'l, chap bosh va bo'yindan)", "Faqat ko'krak qafasidan", "Tananing yarimidan", "Faqat qorindan"],
        correctAnswerIndex: 0,
        explanation: "Ductus thoracicus eng yirik limfa tomiri bo'lib, o'ng qo'l, o'ng ko'krak va o'ng bosh-bo'yindan tashqari butun tanadan limfa oladi."
      },
      {
        question: "O'ng limfa yo'li (Ductus lymphaticus dexter) tananing qaysi qismlaridan limfa yig'adi?",
        options: ["Tananing 1/4 qismidan (o'ng qo'l, ko'krak qafasining o'ng yarmi, o'ng bosh va bo'yindan)", "Butun tanadan", "Faqat oyoqlardan", "Faqat ichaklardan"],
        correctAnswerIndex: 0,
        explanation: "Ductus lymphaticus dexter o'ng yelka-bosh venoz burchagiga quyiladi va tananing faqat o'ng yuqori choragidan limfa yig'adi."
      },
      {
        question: "Ko'krak limfa yo'li (Ductus thoracicus) qayerda boshlanadi va qanday kengaymaga ega?",
        options: ["Qorin bo'shlig'ida Th12-L2 umurtqalar oldida Cisterna chyli (Pekke xaltasi) kengaymasi bilan boshlanadi", "Bo'yinda boshlanadi", "Yurak ichida boshlanadi", "Taloqdan boshlanadi"],
        correctAnswerIndex: 0,
        explanation: "Ductus thoracicus bel va ichak poyalarining qo'shilishidan Cisterna chyli sifatida boshlanib diafragma aortal teshigidan o'tadi."
      },
      {
        question: "Ko'krak limfa yo'li qayerga quyiladi?",
        options: ["Chap Pirogov venoz burchagiga (Angulus venosus sinister - chap v. jugularis interna va v. subclavia qo'shilish joyiga)", "O'ng venoz burchakka", "Pastki kovak venaga", "Yurakning o'ng qorinchasiga"],
        correctAnswerIndex: 0,
        explanation: "Ductus thoracicus bo'yinga ko'tarilib chap venoz burchakka quyiladi va tozalangan limfa suyuqligini qonga qaytaradi."
      },
      {
        question: "Limfa suyuqligi (Lympha) qanday hosil bo'ladi?",
        options: ["To'qima oraliq (interstitsial) suyuqligining limfa kapillyarlariga filtrlanib so'rilishidan", "Qon ivishidan", "O't suyuqligidan", "Siydikdan"],
        correctAnswerIndex: 0,
        explanation: "Kapillyarlardan to'qimaga chiqqan suyuqlik, oqsillar va immunitet hujayralari limfa kapillyarlari orqali so'rilib limfaga aylanadi."
      },
      {
        question: "Limfa tugunlarining (Nodi lymphoidei) asosiy funksiyalari qaysilar?",
        options: ["Biologik filtratsiya (bakteriya, virus, yot zarracha va o'sma hujayralarini tutib qolish) hamda limfotsitlar ishlab chiqarish (immun javob)", "Qon bosimini oshirish", "Gormon sintezlash", "Hazm fermenti ajratish"],
        correctAnswerIndex: 0,
        explanation: "Limfa tugunlari limfa oqimi yo'lidagi to'siq bo'lib, infeksiya va metastazlarni to'xtatuvchi filtr vazifasini bajaradi."
      },
      {
        question: "Limfa tugunining tuzilishida nimalar farqlanadi?",
        options: ["Capsula, Cortex (follikulalar - B-zonasi), Paracortex (T-zonasi) va Medulla (mag'iz tolalari)", "Intima, media, adventitia", "Faqat epiteliy qavat", "Fassiya va parda"],
        correctAnswerIndex: 0,
        explanation: "Po'stloq qavatdagi follikulalarda B-limfotsitlar, parakortikal zonada T-limfotsitlar, mag'izda esa plazmotsitlar va makrofaglar joylashadi."
      },
      {
        question: "Keltiruvchi limfa tomirlari (Vasa lymphatica afferentia) va Chiquvchi limfa tomirlari (Vasa lymphatica efferentia) qayerdan kiradi va chiqadi?",
        options: ["Afferent tomirlar tugunning qavariq yuzasidan kiradi; Efferent tomirlar esa tugun darvozasidan (Hilum) chiqadi", "Afferent darvozadan kiradi", "Ikkalasi ham darvozadan chiqadi", "Farqi yo'q"],
        correctAnswerIndex: 0,
        explanation: "Bir nechta afferent tomirlar limfani tugunga olib keladi, filtratsiyadan so'ng 1-2 ta efferent tomir darvozadan olib chiqadi."
      },
      {
        question: "Virxov murtagi (Metastaz Virxova / Virchow's node) nima?",
        options: ["Oshqozon yoki qorin bo'shlig'i saratoni metastazining chap o'mrov usti limfa tuguniga (Fossa supraclavicularis sinistra) tarqalishi", "Bo'yin murtagi yallig'lanishi", "Sut bezi kistasi", "Qo'ltiq osti shishi"],
        correctAnswerIndex: 0,
        explanation: "Oshqozon karsinomasi ko'krak limfa yo'li orqali chap o'mrov usti limfa tuguniga erta metastaz beradi (Virxov belgisi)."
      },
      {
        question: "Qo'ltiq osti limfa tugunlari (Nodi lymphoidei axillares) qaysi sohalardan limfa qabul qiladi?",
        options: ["Yuqori erkin qo'ldan, Yelka kamaridan, Ko'krak qafasi devoridan va Sut bezidan (Mamma)", "Faqat boshdan", "Faqat oyoqdan", "Faqat qorindan"],
        correctAnswerIndex: 0,
        explanation: "Aksillyar tugunlar sut bezi saratonida limfogen metastazning birinchi darajali nishoni hisoblanadi."
      },
      {
        question: "Chov limfa tugunlari (Nodi lymphoidei inguinales) qaysi a'zolardan limfa yig'adi?",
        options: ["Pastki erkin oyoqdan, Chanoq va qorin old devorining pastki qismidan, Tashqi jinsiy a'zolardan va anal sohadan", "Faqat me'dadan", "Faqat boshdan", "Faqat jigar va o'pkadan"],
        correctAnswerIndex: 0,
        explanation: "Chov limfa tugunlari yuzaki va chuqur guruhga bo'linib, oyoq va tashqi genitaliyaning limfasini filtrlaydi."
      },
      {
        question: "Qaysi a'zolarda limfa kapillyarlari umuman bo'lmaydi?",
        options: ["Bosh miya va orqa miyada, Ko'z soqqasida, Ichki quloqda, Tish emalida, Tog'aylarda va Plasentada", "Jigarda", "O'pkada", "Mushaklarda"],
        correctAnswerIndex: 0,
        explanation: "MNS da limfa tomirlari o'rniga likvor aylanishi va glimfatik tizim faoliyat ko'rsatadi; tog'ay va emalda qon tomir kabi limfa ham bo'lmaydi."
      },
      {
        question: "Limfedema (Filoyoqlik / Slonovost) kasalligi nimadan kelib chiqadi?",
        options: ["Limfa tomirlari yoki tugunlarining to'silishi/zararlanishi oqibatida to'qimalarda limfa oqimi to'xtab ulkan shish hosil bo'lishi", "Arteriya spazmidan", "Venoz qon kamligidan", "Suyak sinishidan"],
        correctAnswerIndex: 0,
        explanation: "Limfa drenaji buzilganda oqsilga boy suyuqlik interstitsiyda to'planib, to'qima fibroziga va filoyoqlikka sabab bo'ladi."
      },
      {
        question: "Hilotoraks (Chylothorax) nima?",
        options: ["Ductus thoracicus'ning jarohatlanishi oqibatida plevra bo'shlig'iga yog'ga boy sutsimon limfa (xilus) to'planishi", "O'pkaga qon to'lishi", "Plevrada havo bo'lishi", "Plevra yallig'lanishi"],
        correctAnswerIndex: 0,
        explanation: "Ko'krak limfa yo'li yorilganda ichakdan so'rilgan yog' zarrachalariga (xilomikronlar) boy sutsimon suyuqlik plevraga quyiladi."
      },
      {
        question: "Ichak vorsinkalarining markazidagi ko'r uchi berk limfa kapillyari (Lacteal) qanday vazifani bajaradi?",
        options: ["Hazm bo'lgan ozuqa yog'larini (lipidlarni) to'g'ridan-to'g'ri limfaga so'rib oladi", "Uglevodlarni so'radi", "Suvni chiqaradi", "Qon quyadi"],
        correctAnswerIndex: 0,
        explanation: "Yog'lar suvda erimaganligi sababli qonga emas, balki ichak vorsinkasining markaziy limfa kapillyariga so'riladi."
      },
      {
        question: "Taloq (Splen / Lien) qanday immun va qon hosil qiluvchi a'zo?",
        options: ["Eng yirik periferik immun a'zo bo'lib, qonni filtrlaydi, qari eritrotsitlarni yo'qotadi va limfotsitlar ishlab chiqaradi", "Hazm bezi", "Endokrin bez", "Nafas a'zosi"],
        correctAnswerIndex: 0,
        explanation: "Taloqda qizil pulpa (eritrotsitlar qabristoni) va oq pulpa (T-va B-limfotsitlar immun zonasi) mavjud."
      },
      {
        question: "Limfa tugunining qaysi zonasi T-limfotsitlarga bog'liq zona (Timusga bog'liq zona) hisoblanadi?",
        options: ["Paracortex (Parakortikal zona)", "Follikulaning germinativ markazi", "Mag'iz shnurlari", "Tugun kapsulasi"],
        correctAnswerIndex: 0,
        explanation: "Parakorteksda timusdan kelgan T-limfotsitlar antigen bilan uchrashib ko'payadi va effektor hujayralarga aylanadi."
      },
      {
        question: "Limfa tugunining B-limfotsitlarga boy germinativ markazlari (Centrum germinativum) qayerda joylashgan?",
        options: ["Po'stloq moddasining birlamchi va ikkilamchi follikulalarida (Noduli lymphoidei)", "Mag'iz qavatda", "Tugun darvozasida", "Kapsula osti sinusida"],
        correctAnswerIndex: 0,
        explanation: "Germinativ markazlarda B-limfotsitlar faol ko'payib plazmotsitlarga (antitelolar sintezlovchi hujayralarga) differensiatsiyalanadi."
      },
      {
        question: "Limfa tomirlarining ichki devorida qanday tuzilmalar bo'lib, limfaning faqat bir tomonga oqishini ta'minlaydi?",
        options: ["Ko'p sonli yarimoysimon klapanlar (Valvulae lymphaticae)", "Silliq vorsinkalar", "Tog'ay halqalar", "Elastik teshiklar"],
        correctAnswerIndex: 0,
        explanation: "Limfa tomirlarida venalarga qaraganda ancha ko'p klapanlar bo'lib, limfaning orqaga qaytishiga yo'l qo'ymaydi."
      },
      {
        question: "Limfaning harakatlanishiga qanday omillar yordam beradi?",
        options: ["1) Skelet mushaklarining qisqarishi (mushak nasosi), 2) Ko'krak qafasining manfiy bosimi, 3) Arteriyalar pulsatsiyasi, 4) Limfangionlar qisqarishi", "Faqat yurak qisqarishi", "Faqat tortishish kuchi", "Faqat ovqatlanish"],
        correctAnswerIndex: 0,
        explanation: "Limfa tomirlari bo'g'inlari (limfangionlar) xususiy silliq mushak qavatiga ega bo'lib, atrofdagi mushaklar qisqarishi bilan birga limfani haydaydi."
      },
      {
        question: "Jigar limfa tomirlari qaysi limfa tugunlariga quyiladi?",
        options: ["Nodi lymphoidei hepatici (jigar darvozasi tugunlariga) va Nodi coeliaci (qorin tugunlariga)", "Chov tugunlariga", "Bo'yin tugunlariga", "Taqim tugunlariga"],
        correctAnswerIndex: 0,
        explanation: "Jigar juda ko'p limfa hosil qiladi (organizm limfasining 50% gacha) va darvoza tugunlari orqali ko'krak yo'liga quyiladi."
      },
      {
        question: "Limfangiit nima?",
        options: ["Limfa tomirlarining o'tkir yallig'lanishi (terida qizil chiziqlar paydo bo'lishi)", "Limfa tuguni kattalashishi", "Taloq shishi", "Tomir berkilishi"],
        correctAnswerIndex: 0,
        explanation: "Yiringli infeksiya limfa tomirlari bo'ylab tarqalganda terida og'riqli qizil yo'llar (limfangiit) ko'rinadi."
      },
      {
        question: "Limfadenit nima?",
        options: ["Limfa tugunining yallig'lanishi va shishishi (og'riqli kattalashishi)", "Limfa tomirining teshilishi", "O'sma paydo bo'lishi", "Tugunning qurib qolishi"],
        correctAnswerIndex: 0,
        explanation: "Infeksiya limfa tuguniga tushganda uning himoya reaksiyasi sifatida limfadenit (kattalashish va og'riq) rivojlanadi."
      },
      {
        question: "Qizilo'ngach saratoni metastaz berganda qaysi limfa tugunlari birinchi zararlanadi?",
        options: ["Nodi mediastinales posteriores va Nodi gastrici sinistri", "Chov tugunlari", "Taqim tugunlari", "Qo'ltiq osti tugunlari"],
        correctAnswerIndex: 0,
        explanation: "Qizilo'ngach limfasi bevosita orqa ko'ks oralig'i va oshqozon limfa tugunlariga oqib tushadi."
      },
      {
        question: "Tuxumdon va Moyaklardan limfa oqimi qaysi limfa tugunlariga boradi?",
        options: ["Nodi lymphoidei lumbales (Bel / Paraaortal limfa tugunlariga - embrional rivojlanish sababli)", "Chov limfa tugunlariga", "Kichik chanoq devoriga", "Kindik atrofiga"],
        correctAnswerIndex: 0,
        explanation: "Moyak va tuxumdonlar belda shakllangani uchun ularning limfasi chovga emas, to'g'ridan-to'g'ri L1-L2 aortal tugunlarga oqadi."
      },
      {
        question: "Tashqi jinsiy a'zolardan (yorg'oq, vulva, jinsiy olat terisi) limfa qayerga oqadi?",
        options: ["Nodi lymphoidei inguinales superficiales (Yuzaki chov limfa tugunlariga)", "Paraaortal tugunlarga", "Jigar tugunlariga", "Bo'yin tugunlariga"],
        correctAnswerIndex: 0,
        explanation: "Tashqi jinsiy a'zolar terisi va yorg'oq limfasi yuzaki chov limfa tugunlariga quyiladi."
      },
      {
        question: "Limfatik kapillyarlarning qon kapillyarlaridan farqi nimada?",
        options: ["Bir uchi berk (ko'r) bo'lib boshlanadi, diametri kengroq, bazal membranasi uzuq-yuluq va yuqori o'tkazuvchanlikka ega", "Ikkala uchi ochiq bo'ladi", "Qon tashiydi", "Klapanlari bo'lmaydi"],
        correctAnswerIndex: 0,
        explanation: "Limfa kapillyarlari to'qima orasida ko'r qopcha bo'lib boshlanadi va yirik oqsil molekulalari hamda hujayralarni o'tkaza oladi."
      },
      {
        question: "O'pkalardan limfa oqimi qaysi asosiy limfa tugunlari orqali o'tadi?",
        options: ["Nodi bronchopulmonales (ildiz tugunlari) va Nodi tracheobronchiales (traxeya-bronx tugunlari)", "Chov tugunlari", "Jigar tugunlari", "Qorin tugunlari"],
        correctAnswerIndex: 0,
        explanation: "O'pka to'qimasi limfasi o'pka darvozasi va traxeya bifurkatsiyasi tugunlari orqali ko'krak limfa yo'llariga chiqadi."
      },
      {
        question: "Ko'krak limfa yo'lining bo'yindagi yoyi (Arcus ductus thoracici) qaysi arteriya orqasidan o'tadi?",
        options: ["Arteria carotis communis va Vena jugularis interna orqasidan o'tib o'mrov osti venasiga quyiladi", "Aorta ustidan", "Yelka arteriyasidan", "Qizilo'ngach ichidan"],
        correctAnswerIndex: 0,
        explanation: "Arcus ductus thoracici C7 darajasida chap umumiy uyqu arteriyasi orqasidan egilib o'tib chap Pirogov burchagiga ulanadi."
      },
      {
        question: "Sentinel (Qorovul) limfa tuguni nima?",
        options: ["Xavfli o'smadan (masalan, melanoma yoki sut bezi saratoni) limfa eng birinchi borib quyiladigan birinchi bosqich limfa tuguni", "Eng katta tugun", "Yurakdagi tugun", "Faqat bolalarda bo'ladigan tugun"],
        correctAnswerIndex: 0,
        explanation: "Sentinel tugun biopsiyasi o'smaning limfogen tarqalgan yoki tarqalmaganligini aniqlash uchun eng muhim usuldir."
      }
    ]
  }
];


