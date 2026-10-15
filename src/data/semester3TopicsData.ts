import { Topic } from '../types';
import { SEMESTER_3_GLOSSARY_TERMS } from './semester3GlossaryTerms';

export const SEMESTER_3_DETAILED_TOPICS: Topic[] = [
  {
    id: "sem_3_top_1",
    semester: 3,
    order: 1,
    defaultModelId: "brain-labeled",
    terms: SEMESTER_3_GLOSSARY_TERMS.filter(t => t.topicOrder === 1),
    title: {
      uz: "1-Mavzu: Orqa miya. Orqa miya pardalari. Bosh miyaning umumiy tuzilishi. Bosh miya asosi. 12 juft bosh miya nervlarining chiqishi. Uzunchoq miya. Voroliy ko‘prigi. Miyacha. Bosh miyaning IV qorinchasi",
      ru: "Тема 1: Спинной мозг и его оболочки. Общее строение головного мозга. Основание мозга. Выход 12 пар черепных нервов. Продоговатый мозг. Мост. Мозжечок. IV желудочек",
      en: "Topic 1: Spinal Cord and Meninges. General Brain Structure. Base of Brain. Exit of 12 Pairs of Cranial Nerves. Medulla Oblongata. Pons. Cerebellum. 4th Ventricle"
    },
    theory: {
      uz: `## 🧠 Orqa Miya, Bosh Miya Asosi, Miya Poyasi va Miyacha Anatomiyasi

---

### 📌 MAVZU REJASI VA ASOSIY QISMLAR
1. **Orqa miya (*Medulla spinalis*):** Skeletotopiyasi, sintopiyasi, segmentar tuzilishi, bo'yin va bel qalinlashuvlari.
2. **Orqa miya pardalari (*Meninges spinales*) va bo'shliqlari:** Epidural, subdural va subaraxnoid bo'shliqlar, likvor oqimi, lyumbal punksiya anatomiyasi.
3. **Orqa miyaning ichki tuzilishi:** Kulrang modda (*substantia grisea*) yadrolari, oq modda (*substantia alba*)ning o'tkazuvchi yo'llari (ko'tariluvchi va tushuvchi traktlar).
4. **Bosh miyaning umumiy tuzilishi va Bosh miya asosi (*Basis encephali*):** Relyefi, egatlari, 12 juft kranial nervlarning chiqish joylari.
5. **12 juft Bosh miya nervlarining to'liq super-jadvali:** Funksional tolalari, o'zaklari, kalla suyagi teshiklari va klinik zararlanish belgilari.
6. **Uzunchoq miya (*Medulla oblongata / Bulbus*):** Tashqi yuzalari, o'zaklari, hayotiy markazlar (nafas, qon aylanish).
7. **Voroliy ko'prigi (*Pons*):** Old yuzasi, tegmentum, o'tkazuvchi yo'llari va o'zaklari.
8. **IV Qorincha (*Ventriculus quartus*) va Rombsimon chuqurcha (*Fossa rhomboidea*):** Devorlari, Lyushka va Majandi teshiklari, kranial nervlar o'zaklarining rombsimon chuqurchaga proyeksiyasi.
9. **Miyacha (*Cerebellum*):** Yarim sharlar, chuvalchang (*vermis*), 4 juft chuqur o'zaklar, 3 juft oyoqchalar, po'stloq gistologiyasi va harakat koordinatsiyasi.
10. **Klinik Neyroanatomiya & USMLE Keyslar:** Braun-Sekar, siringomiyeliya, Vallenberg-Zaxarchenko, Bell falaji, miyacha ataksiyasi, okklyuzion gidrosefaliya.

---

### 1. ORQA MIYA (*MEDULLA SPINALIS*) VA UNING PARDALARI

#### A. Skeletotopiyasi va O'lchamlari
* **Joylashuvi:** Umurtqa pog'onasi kanali (*canalis vertebralis*) ichida joylashgan bo'lib, silindrsimon, old-orqa yo'nalishda bir oz yassilangan shaklga ega.
* **Uzunligi va massasi:** Kattalarda uzunligi o'rtacha **40–45 sm**, og'irligi **30–35 gramm**.
* **Yuqori chegarasi:** Ensa suyagining katta teshigi (*foramen magnum*) pastki qirrasi yoki I bo'yin umurtqasi (*atlas*) yuqori qirrasi sathida uzunchoq miyaga (*medulla oblongata*) o'tadi.
* **Pastki chegarasi:** Kattalarda **L1–L2** (I–II bel) umurtqalariaro disk sohasida konus shaklida torayib miya konusi (*conus medullaris*) bilan tugaydi. Yangi tug'ilgan chaqaloqlarda orqa miya **L3** umurtqa darajasigacha cho'zilgan bo'ladi.
* **Filum terminale (Oxirgi ip):** *Conus medullaris* uchidan pastga qarab yo'nalgan biriktiruvchi to'qimali ipcha bo'lib, II dumg'aza umurtqasiga birikadi va orqa miyani fiksatsiyalab turadi.
* **Cauda equina ("Ot dumi"):** L2 umurtqasidan pastda orqa miya bo'lmaydi, lekin pastki bel, dumg'aza va dum nervlarining oldingi va orqa ildizchalari vertikal pastga yo'nalib, "ot dumi" dastasini hosil qiladi.

#### B. Orqa miya qalinlashuvlari (*Intumescentiae*)
1. **Bo'yin qalinlashuvi (*Intumescentia cervicalis*):** C5–Th1 segmentlariga to'g'ri keladi. Bu sohadan qo'l mushaklari va terisini innervatsiya qiluvchi yelka chigali (*plexus brachialis*) chiqadi.
2. **Bel-dumg'aza qalinlashuvi (*Intumescentia lumbosacralis*):** L1–S3 segmentlariga to'g'ri keladi. Bu sohadan oyoqlarni innervatsiya qiluvchi bel-dumg'aza chigali (*plexus lumbosacralis*) chiqadi.

#### C. Orqa miya segmentlari (31 ta segment)
Orqa miya **31 juft spinal nervlar** chiqadigan **31 ta segment**dan tashkil topgan:
* **8 ta bo'yin segmenti (C1 – C8)** *(Eslatma: 7 ta bo'yin umurtqasi bor, ammo 8 ta bo'yin segmenti va 8 juft bo'yin nervi mavjud; C1 nerv atlas bilan kalla suyagi orasidan chiqadi)*.
* **12 ta ko'krak segmenti (Th1 – Th12)**.
* **5 ta bel segmenti (L1 – L5)**.
* **5 ta dumg'aza segmenti (S1 – S5)**.
* **1 ta dum segmenti (Co1)**.

\`\`\`spinal_cord
[Orqa Miya Ko'ndalang Kesimi - Medulla Spinalis Anatomy]
       │             Funiculus Posterior (Goll & Burdach)            │
       ├───────────────────────────────┬─────────────────────────────┤
       │ Cornu Posterius (Sezuvchi)    │ Substantia Gelatinosa       │
       │ Cornu Laterale (C8-L2 Simp.)  │ Canalis Centralis (Likvor)  │
       │ Cornu Anterius (Motoneyron)   │ Radix Anterior (Motor)      │
       ├───────────────────────────────┴─────────────────────────────┤
       │ Funiculus Lateralis (Piramida + Spinothalamicus)            │
       │ Funiculus Anterior (Tr. Corticospinalis ant.)               │
\`\`\`

#### D. Orqa miya pardalari (*Meninges spinales*) va Bo'shliqlar
Orqa miya 3 qavat biriktiruvchi to'qimali parda bilan o'ralgan:
1. **Qattiq parda (*Dura mater spinalis*):** Tashqi qalin, mustahkam fibroz qobiq.
   * **Spatium epidurale (Epidural bo'shliq):** Umurtqa kanali suyagi periosti bilan dura mater orasidagi haqiqiy bo'shliq. Tarkibida yog' kletchatkasi va ichki umurtqa venoz chigallari (*plexus venosus vertebralis internus*) joylashgan. Bu soha klinikada **epidural anesteziya** o'tkazish joyidir.
2. **To'rsimon parda (*Arachnoidea mater spinalis*):** Tomirsiz, yupqa parda.
   * **Spatium subdurale (Subdural bo'shliq):** Qattiq va to'rsimon parda orasidagi tirqishsimon potensial bo'shliq.
3. **Yumshoq (Tomirli) parda (*Pia mater spinalis*):** Orqa miya to'qimasiga bevosita yopishib turuvchi, qon tomirlarga boy parda.
   * **Spatium subarachnoideum (Subaraxnoid bo'shliq):** To'rsimon va yumshoq pardalar orasidagi keng bo'shliq. U **likvor (*liquor cerebrospinalis*)** bilan to'la bo'lib, yuqorida bosh miya subaraxnoid bo'shlig'i va IV qorincha bilan erkin tutashadi.
   * **Ligamentum denticulatum (Tishsimon boylam):** Pia materdan ikki tomonga dura materga qarab tortilgan 20-21 juft tishsimon plastinka bo'lib, orqa miyani kanalda osilib turishini ta'minlaydi.

> 💉 **KLINIK ANATOMIYA: Lyumbal Punksiya (Lumbar Puncture)**
> * Orqa miya L1–L2 sohasida tugashi sababli, subaraxnoid bo'shliqdan likvor olish yoki spinal anesteziya qilish uchun nina **L3–L4 yoki L4–L5** umurtqalar oralig'idan kiritiladi.
> * Nina bosib o'tadigan qavatlar: *Teri ➔ Teriosti kletchatkasi ➔ Lig. supraspinale ➔ Lig. interspinale ➔ Lig. flavum (sariq boylam) ➔ Spatium epidurale ➔ Dura mater ➔ Arachnoidea mater ➔ Spatium subarachnoideum (likvor oqib chiqadi)*.

---

### 2. ORQA MIYANING ICHKI TUZILISHI: KULRANG VA OQ MODDA

Orqa miya ko'ndalang kesimida ichkarida kapalak yoki "H" harfi shaklidagi **kulrang modda (*substantia grisea*)** va uni tashqi tomondan o'rab turgan **oq modda (*substantia alba*)** farqlanadi.

#### A. Kulrang modda (*Substantia grisea*)
Kulrang modda asosan neyronlar tanasi, dendritlar va miyelinsiz tolalardan iborat.
* **Cornu anterius (Oldingi shox):** Keng va massiv. Unda skelet mushaklarini innervatsiya qiluvchi yirik multipolyar **alfa va gamma motoneyronlar** joylashgan (Rexed IX plastinkasi). Ularning aksonlari oldingi harakatlantiruvchi ildizcha (*radix anterior*)ni hosil qiladi.
* **Cornu posterius (Orqa shox):** Uzunchoq va tor. Unda tana yuzasidan va ichki a'zolardan keluvchi sezuvchi impulslarni qabul qiluvchi oraliq (interkalyar) neyronlar, *substantia gelatinosa Rolandi* (og'riq va harorat eshigi) hamda *nucleus proprius* joylashgan (Rexed I-VI plastinkalari).
* **Cornu laterale (Yon shox):** Faqat **C8–L2/L3 segmentlarida** mavjud! Bu yerda vegetativ nerv tizimining simpatik bo'limiga tegishli **intermediolateral yadro (*nucleus intermediolateralis*)** joylashgan. *(Eslatma: S2-S4 segmentlarida yon shox bo'rtib chiqmagan bo'lsa-da, kulrang moddaning oraliq zonasida chanoq a'zolarini innervatsiya qiluvchi parasimpatik o'zaklar joylashadi)*.
* **Canalis centralis (Markaziy kanal):** O'rtadagi ependimotsitlar bilan qoplangan tor kanal bo'lib, likvor bilan to'la.

#### B. Oq modda (*Substantia alba*) va O'tkazuvchi Yo'llar (Traktlar)
Oq modda miyelinli nerv tolalaridan iborat bo'lib, 3 juft tizimchaga (*funiculi*) bo'linadi:

| Tizimcha nomi | Asosiy Nerv Yo'llari (Traktlar) | Funksiyasi va Yo'nalishi |
| :--- | :--- | :--- |
| **Funiculus Posterior (Orqa tizimcha)** | 1. **Fasciculus gracilis (Goll dastasi)**<br>2. **Fasciculus cuneatus (Burdax dastasi)** | **Ko'tariluvchi (Afferent):** Ongli propriosepsiya (mushak-bo'g'im sezgisi), tebranish (vibratsiya) va ikki nuqtani farqlash (taktil diskriminatsiya). Goll — tana pastki qismi va oyoqlardan (Th5 dan past); Burdax — tana yuqori qismi va qo'llardan (Th4 dan yuqori). |
| **Funiculus Lateralis (Yon tizimcha)** | 1. **Tr. corticospinalis lateralis**<br>2. **Tr. spinothalamicus lateralis**<br>3. **Tr. spinocerebellaris posterior (Flechsig)**<br>4. **Tr. spinocerebellaris anterior (Gowers)**<br>5. **Tr. rubrospinalis (Monakow)** | **Tushuvchi (Efferent):** Corticospinalis lateralis — ixtiyoriy nozik harakatlarning bosh piramida yo'li (85% tola); Rubrospinalis — mushak tonusi.<br>**Ko'tariluvchi (Afferent):** Spinothalamicus lateralis — og'riq va harorat sezgisi; Spinocerebellaris — miyachaga boruvchi ongsiz proprioseptiv muvozanat yo'llari. |
| **Funiculus Anterior (Oldingi tizimcha)** | 1. **Tr. corticospinalis anterior**<br>2. **Tr. spinothalamicus anterior**<br>3. **Tr. vestibulospinalis**<br>4. **Tr. tectospinalis** | **Tushuvchi (Efferent):** Corticospinalis anterior — tana o'qi va bo'yin mushaklari (15% tola); Vestibulospinalis — muvozanat va ekstenzor mushaklar tonusi; Tectospinalis — to'satdan ko'rish/eshitishga javob reflekslari.<br>**Ko'tariluvchi:** Spinothalamicus anterior — qo'pol teginish va bosim sezgisi. |

---

### 3. BOSH MIYA ASOSI VA 12 JUFT KRANIAL NERVLARNING SUPER-JADVALI

Bosh miya pastki (asosiy) yuzasi relyefida peshona bo'laklarining pastki yuzasi, hid biluvchi piyozcha va yo'l, ko'ruv xiazmasi, kulrang do'mboq, voronka, gipofiz bezi, so'rg'ichsimon tanalar, miya oyoqchalari, Voroliy ko'prigi, uzunchoq miya piramidalari va zaytunlari hamda miyacha yarim sharlari yaqqol ko'rinadi.

\`\`\`cranial_nerves
[12 Juft Kranial Nervlar - Cranial Nerves Brainstem Base]
  I. Olfactorius (Lamina cribrosa)    │  VII. Facialis (Porus acusticus int.)
 II. Opticus (Canalis opticus)        │ VIII. Vestibulocochlearis (CPA burchak)
III. Oculomotorius (Fossa interped.)  │   IX. Glossopharyngeus (Sulcus retroolivaris)
 IV. Trochlearis (Dorsal chiqish!)    │    X. Vagus (Sulcus retroolivaris)
  V. Trigeminus (Pons yon yuzasi)     │   XI. Accessorius (Sulcus retroolivaris)
 VI. Abducens (Sulcus bulbopontinus)  │  XII. Hypoglossus (Sulcus anterolateralis)
\`\`\`

#### 👑 12 Juft Bosh Miya Nervlarining To'liq Anatomik-Klinik Super Jadvali:

| Juft / Lotincha nomi | Turi (Tolalar) | Miya poyasidan chiqish joyi | Kalla suyagidan chiqish teshigi | Innervatsiya sohasi / Funksiyasi | Klinik zararlanish belgilari |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **I — Nn. olfactorii** *(Hid biluvchi)* | Sof Sezuvchi (SVA) | *Bulbus olfactorius* (Oxirgi miya) | *Lamina cribrosa* (G'alvirsimon plastinka) | Burun bo'shlig'i yuqori shilliq qavati hid retseptorlari | **Anosmiya** (hid bilmaslik), giposmiya, hid gallyutsinatsiyalari. |
| **II — N. opticus** *(Ko'ruv)* | Sof Sezuvchi (SSA) | *Chiasma opticum* (Oraliq miya) | *Canalis opticus* (Ko'ruv kanali) | Ko'z to'r pardasi (retina) tayoqcha va kolbachalari | **Amavroz** (ko'rlik), **Bitemporal gemianopsiya** (xiazma ezilganda). |
| **III — N. oculomotorius** *(Ko'z harakatlantiruvchi)* | Harakatlantiruvchi + Parasimpatik (GSE, GVE) | *Fossa interpeduncularis* (O'rta miya) | *Fissura orbitalis superior* | Ko'zning 4 ta mushagi (*m. rectus sup., inf., med., m. obliquus inf.*), *m. levator palpebrae*, qorachiq qisuvchi (*m. sphincter pupillae*) va siliar mushak | **Ptoz** (qovoq osilishi), **Midriaz** (qorachiq kengayishi), divergent g'ilaylik, akkomodatsiya falaji. |
| **IV — N. trochlearis** *(G'altaksimon)* | Sof Harakatlantiruvchi (GSE) | **Miya poyasining ORQA yuzasi!** (*Velum medullare sup.*) | *Fissura orbitalis superior* | Ko'zning yuqori qiyshiq mushagi (*m. obliquus superior*) | Bemor pastga va ichkariga qaraganda **Diplopiya** (narsalar ikkita ko'rinishi, zinadan tushishda qiyinchilik). |
| **V — N. trigeminus** *(Uch shoxli)* | Aralash (GSA, SVE) | Voroliy ko'prigi bilan o'rta miyacha oyoqchasi chegarasi | **V1:** *Fissura orbitalis sup.*<br>**V2:** *Foramen rotundum*<br>**V3:** *Foramen ovale* | Yuz terisi sezgisi, shox parda, og'iz va burun shilliq qavati, tishlar; Chaynash mushaklari (*m. masseter, m. temporalis, mm. pterygoidei*) | **Trigeminal nevralgiya** (yuzda o'ta qattiq sanchuvchi og'riq), chaynash falaji, shox parda refleksining yo'qolishi. |
| **VI — N. abducens** *(Uzoqlashtiruvchi)* | Sof Harakatlantiruvchi (GSE) | Ko'prik bilan uzunchoq miya piramidasi orasidagi egat | *Fissura orbitalis superior* | Ko'zning lateral to'g'ri mushagi (*m. rectus lateralis*) | Konvergent g'ilaylik (ko'z ichkariga qarab qoladi), tashqariga qaray olmaslik. |
| **VII — N. facialis et intermedius** *(Yuz va oraliq)* | Aralash (SVE, GVE, SVA, GSA) | Ko'prik-miyacha burchagi (*Angulus pontocerebellaris*) | *Porus acusticus internus* ➔ *Canalis facialis* ➔ *Foramen stylomastoideum* | Yuz mimika mushaklari, platyzma; Ko'z yoshi bezi, jag'osti va tilosti so'lak bezlari; Tilning oldingi 2/3 qismi ta'm sezgisi | **Bell falaji** (yuz asimmetriyasi, lagoftalm — ko'z yumilmasligi, peshona burishmasligi, og'iz burchagi tushishi, agevziya). |
| **VIII — N. vestibulocochlearis** *(Dahliz-chig'anoq)* | Sof Sezuvchi (SSA) | Ko'prik-miyacha burchagi (*Angulus pontocerebellaris*) | *Porus acusticus internus* (Kalla suyagidan tashqariga chiqmaydi) | Ichki quloq: Chig'anoq (eshitish organi) va Dahliz / Yarimhalqa naylar (muvozanat organi) | **Sensorinevral karlik**, quloqda shovqin (tinnitus), tizimli bosh aylanishi (**Vertigo**), nistagm. |
| **IX — N. glossopharyngeus** *(Til-yutqin)* | Aralash (SVE, GVE, GVA, SVA, GSA) | Uzunchoq miya zaytuni orqasidagi egat (*Sulcus retroolivaris*) | *Foramen jugulare* (Bo'yinturuq teshigi) | Yutqin mushaklari (*m. stylopharyngeus*); Quloqoldi so'lak bezi (*gl. parotidea*); Tilning orqa 1/3 qismi ta'm va umumiy sezgisi; Glomus caroticum | **Disfagiya** (yutish qiyinlashuvi), yutqin refleksi yo'qolishi, tilning orqa 1/3 qismida achchiq ta'mni sezmaslik. |
| **X — N. vagus** *(Sayyor nerv)* | Aralash (GVE, SVE, GVA, GSA, SVA) | Uzunchoq miya zaytuni orqasidagi egat (*Sulcus retroolivaris*) | *Foramen jugulare* | Hiqildoq, tomoq, qizilo'ngach, yurak, o'pka, oshqozon, ingichka ichak va yo'g'on ichak (chap burchagigacha) parasimpatik va sezuvchi innervatsiyasi | Ovoz bo'g'ilishi (**Disfoniya / Afoniya** — n. laryngeus recurrens falaji), disfagiya, taxikardiya, yumshoq tanglay asimmetriyasi. |
| **XI — N. accessorius** *(Qo'shimcha nerv)* | Sof Harakatlantiruvchi (GSE/SVE) | *Sulcus retroolivaris* + C1-C5 orqa miya ildizchalari | *Foramen magnum* (kiradi) ➔ *Foramen jugulare* (chiqadi) | To'sh-o'mrov-so'rg'ichsimon mushak (*m. sternocleidomastoideus*) va Trapetsiyasimon mushak (*m. trapezius*) | Yelkani ko'tara olmaslik ("yelka qisish falaji"), boshni qarama-qarshi tomonga burish qiyinlashuvi. |
| **XII — N. hypoglossus** *(Tilosti nervi)* | Sof Harakatlantiruvchi (GSE) | Piramida va Zaytun orasidagi oldingi yon egat (*Sulcus anterolateralis*) | *Canalis nervi hypoglossi* | Tilning barcha xususiy va skelet mushaklari (*m. genioglossus, hyoglossus, styloglossus*) | Tilni chiqarganda **shikastlangan tomonga og'ishi (deviatsiya)**, til yarmining atrofiyasi va fassikulyatsiyalari. |

---

### 4. UZUNCHOQ MIYA (*MEDULLA OBLONGATA / MYELENCEPHALON*)

Uzunchoq miya miya poyasining eng pastki qismi bo'lib, orqa miyaning bevosita davomi hisoblanadi.

\`\`\`brainstem
[Miya Poyasi va Rombsimon Chuqurcha - Brainstem & Fossa Rhomboidea]
       ┌────────────────────────────────────────────────┐
       │                PONS (Ko'prik)                  │
       │       Sulcus Basilaris (A. Basilaris)          │
       ├────────────────────────────────────────────────┤
       │  Fossa Rhomboidea (IV Qorincha tubi - V-XII)   │
       ├───────────────────────┬────────────────────────┤
       │ Olivae (Pastki Zaytun)│ Pyramides (Piramidalar)│
       └───────────────────────┴────────────────────────┘
                 \ Decussatio Pyramidum /
\`\`\`

#### A. Tashqi tuzilishi:
* **Oldingi yuzasi (*Facies anterior*):**
  * **Fissura mediana anterior:** O'rtadagi chuqur yoriq.
  * **Pyramides medullae oblongatae:** Yoriqning ikki yonidagi bo'ylama bo'rtmalar. Ularning ichidan bosh miya po'stlog'idan kelayotgan bosh harakat yo'li (*tr. corticospinalis*) o'tadi.
  * **Decussatio pyramidum (Piramidalar kesishuvi):** Uzunchoq miyaning pastki qismida tolalarning **80–85%** qarama-qarshi tomonga kesishib, orqa miyaning yon tizimchasiga (*tr. corticospinalis lateralis*) o'tadi. Qolgan 15% tola kesishmasdan oldingi tizimchaga (*tr. corticospinalis anterior*) o'tadi.
  * **Olivae (Zaytunlar):** Piramidalardan lateralda joylashgan oval shakldagi bo'rtiqlar.
  * **Sulcus anterolateralis (preolivaris):** Piramida va zaytun orasidagi egat — undan **XII juft (N. hypoglossus)** chiqadi.
  * **Sulcus retroolivaris (postolivaris):** Zaytun orqasidagi egat — undan ketma-ket **IX (N. glossopharyngeus), X (N. vagus) va XI (N. accessorius)** nervlar chiqadi.
* **Orqa yuzasi (*Facies posterior*):**
  * Pastki qismida orqa tizimchaning davomi bo'lgan **Tuberculum gracile** (Goll yadrosi do'mbog'i) va **Tuberculum cuneatum** (Burdax yadrosi do'mbog'i) joylashgan.
  * Yuqori qismi ochilib, IV qorincha tubi — **rombsimon chuqurcha (*fossa rhomboidea*)**ning pastki yarmini hosil qiladi.

#### B. Uzunchoq miya o'zaklari va Hayotiy markazlar:
1. **Nucleus olivaris inferior:** Zaytun ichidagi tishsimon o'zak bo'lib, miyacha bilan bog'lanib harakatlarni avtomatik korreksiyalaydi.
2. **Nucleus gracilis et cuneatus:** Goll va Burdax yo'llarining 2-neyronlari tanasi. Ularning aksonlari *decussatio lemnisci medialis* (sezuvchi kesishma)ni hosil qilib, *lemniscus medialis* (medial halqa) tarkibida talamusga ko'tariladi.
3. **Kranial nervlar o'zaklari:** IX, X, XI, XII juft nervlarning harakat, sezuvchi va parasimpatik o'zaklari (shu jumladan umumiy *Nucleus ambiguus* va *Nucleus tractus solitarii*).
4. **Hayotiy muhim markazlar (Formatio reticularis):**
   * **Nafas olish markazi (*Centrum respiratorium*)** — nafas olish (inspiratsiya) va chiqarish (ekspiratsiya) ritmini generatsiyalaydi.
   * **Qon tomir-harakatlantiruvchi markaz (*Centrum vasomotorium*)** — arterial qon bosimi va tomirlar tonusini boshqaradi.
   * **Himoya va hazm reflekslari markazlari:** Yutish, qusish, yo'talish, aksirish va so'lak ajratish markazlari.

---

### 5. VOROLIY KO'PRIGI (*PONS*)

Voroliy ko'prigi o'rta miya bilan uzunchoq miya oralig'ida ko'ndalangiga yotgan oq bo'rtma shaklidagi tuzilma.

* **Oldingi yuzasi:** Qavariq bo'lib, o'rtasidan **Sulcus basilaris** o'tadi (unda kalla suyagi ichidagi asosiy arteriya — *a. basilaris* yotadi). Ikki chetga qarab qalinlashib, **o'rta miyacha oyoqchalari (*pedunculi cerebellares medii / brachia pontis*)**ga aylanadi.
* **Ko'prikning ichki tuzilishi:**
  * **Pars basilaris (Ko'prik asosi):** Oldingi qism. Unda po'stloq-ko'prik yo'llari (*tr. corticopontinus*), ko'prikning xususiy o'zaklari (*nuclei pontis*) va ulardan miyachaga boruvchi ko'ndalang tolalar (*fibrae pontis transversae*) o'tadi.
  * **Tegmentum pontis (Ko'prik qopqog'i):** Orqa qism. Unda *Formatio reticularis*, barcha ko'tariluvchi sezuvchi halqalar (*Lemniscus medialis, spinalis, lateralis*), hamda **V, VI, VII, VIII juft** nervlarning o'zaklari joylashgan.

---

### 6. IV QORINCHA (*VENTRICULUS QUARTUS*) VA ROMBSIMON CHUQURCHA (*FOSSA RHOMBOIDEA*)

IV qorincha — rombsimon miya (*rhombencephalon*) bo'shlig'i bo'lib, chodirsimon shaklga ega.

#### A. IV qorinchaning devorlari:
* **Tubi (*Fundus*):** Rombsimon chuqurcha (*fossa rhomboidea*) — uzunchoq miya va ko'prikning orqa yuzasi hosil qiladi.
* **Tomi (*Tegmen*):** Yuqoridan yuqori miya yelkasi (*velum medullare superius*), pastdan pastki miya yelkasi (*velum medullare inferius*) va qon tomirli parda (*tela choroidea ventriculi quarti*) hosil qiladi.
* **Tutashuvlari va Likvor oqimi teshiklari:**
  * Yuqorida: O'rta miyaning **Silviy suv yo'li (*aqueductus cerebri*)** orqali III qorincha bilan tutashadi.
  * Pastda: Orqa miyaning **markaziy kanali (*canalis centralis*)** bilan tutashadi.
  * **Subaraxnoid bo'shliqqa ochiluvchi teshiklar (3 ta teshik):**
    1. **Apertura mediana ventriculi quarti (Majandi teshigi):** Tomning pastki burchagidagi toq o'rta teshik.
    2. **Aperturae laterales ventriculi quarti (Lyushka teshiklari):** IV qorinchaning lateral cho'ntaklaridagi 2 ta juft teshik.
    *Bu teshiklar orqali IV qorinchada ishlab chiqarilgan likvor miya va orqa miya subaraxnoid bo'shlig'iga o'tadi!*

#### B. Rombsimon chuqurchada Kranial Nervlar O'zaklarining Joylashishi:
Rombsimon chuqurchada V dan XII gacha bo'lgan kranial nervlarning o'zaklari joylashgan. Qoida tariqasida: **Harakatlantiruvchi o'zaklar — medialda**, **Vegetativ (parasimpatik) o'zaklar — oraliqda**, **Sezuvchi o'zaklar — lateralda** yotadi!

1. **V juft (N. trigeminus):** *Nucleus motorius* (harakat), *Nucleus pontinus* (sezgi), *Nucleus tractus spinalis* (og'riq-harorat), *Nucleus tractus mesencephalici* (propriosepsiya).
2. **VI juft (N. abducens):** *Nucleus n. abducentis* — **Colliculus facialis** (yuz do'mbog'i) ostida yotadi.
3. **VII juft (N. facialis):** *Nucleus n. facialis* (harakat) — tolalari VI yadro atrofida tizza (*genu internum n. facialis*) hosil qilib *Colliculus facialis* bo'rtmasini chiqaradi; *Nucleus salivatorius superior* (so'lak-ko'z yoshi), *Nucleus tractus solitarii* (ta'm).
4. **VIII juft (N. vestibulocochlearis):** *Area vestibularis* sohasida 4 ta dahliz yadrosi (Shvalbe, Deyters, Bexterev, Roller) va 2 ta eshitish yadrosi (*nucleus cochlearis ventralis et dorsalis*).
5. **IX juft (N. glossopharyngeus):** *Nucleus ambiguus* (harakat), *Nucleus salivatorius inferior* (parotid bez), *Nucleus tractus solitarii* (ta'm).
6. **X juft (N. vagus):** *Nucleus ambiguus* (harakat), *Nucleus dorsalis n. vagi* (parasimpatik — **Trigonum nervi vagi** sohasida), *Nucleus tractus solitarii* (sezgi).
7. **XI juft (N. accessorius):** *Nucleus n. accessorii* (harakat — uzunchoq miya va C1-C5 orqa miyada).
8. **XII juft (N. hypoglossus):** *Nucleus n. hypoglossi* (harakat — **Trigonum nervi hypoglossi** sohasida).

---

### 7. MIYACHA (*CEREBELLUM*)

Miyacha orqa kalla chuqurchasida, ko'prik va uzunchoq miyaning orqasida, ensa bo'laklari ostida joylashgan bo'lib, **harakatlar muvozanati, koordinatsiyasi, mushaklar tonusi va nozik sinergiyasini** boshqaruvchi oliy markazdir.

\`\`\`cerebellum
[Miyacha va Chuqur O'zaklar - Cerebellum Deep Nuclei]
               ┌───────────────────────────────┐
               │    Vermis (Tana Muvozanati)   │
       ┌───────┴───────────────────────────────┴───────┐
       │   Hemispheria Cerebelli (Nozik Harakatlar)   │
       ├───────────────────────────────────────────────┤
       │ 4 Juft Chuqur O'zaklar (Don't Eat Greasy Food):│
       │ 1. Nucleus Dentatus (Eng yirik, lateral)      │
       │ 2. Nucleus Emboliformis (Po'kaksimon)         │
       │ 3. Nucleus Globosus (Sharsimon)               │
       │ 4. Nucleus Fastigii (Tom o'zagi, medial)      │
       └───────────────────────────────────────────────┘
\`\`\`

#### A. Tashqi Anatomik Tuzilishi:
* **Qismlari:** Ikkita katta **yarim shar (*hemispheria cerebelli*)** va ularni o'rtada birlashtiruvchi toq **chuvalchang (*vermis cerebelli*)**.
* **Yuzasi:** Ko'plab ko'ndalang egatchalar va **miyacha yaproqlari (*folia cerebelli*)** bilan qoplangan.
* **Arbor vitae cerebelli ("Hayot daraxti"):** Miyacha sagittal kesilganda oq moddaning shoxlangan daraxt shaklidagi manzarasi.

#### B. Miyachaning 4 juft chuqur o'zaklari (*Nuclei cerebelli*):
Oq moddaning qalinligida lateralldan medialga qarab 4 juft kulrang modda o'zagi yotadi *(Yodlash mnemonikasi: **D**on't **E**at **G**reasy **F**ood)*:
1. **Nucleus dentatus (Tishsimon o'zak):** Eng yirik, qatlamli o'zak (yarim sharlarda yotadi). Po'stloqdan kelgan ixtiyoriy nozik harakatlarni dasturlashda qatnashadi.
2. **Nucleus emboliformis (Po'kaksimon o'zak):** Tishsimon o'zakning medial tomonida.
3. **Nucleus globosus (Sharsimon o'zak):** Po'kaksimon o'zakdan medialroqda. *(Emboliformis + Globosus = Nucleus interpositus deb ham ataladi)*.
4. **Nucleus fastigii (Tom o'zagi):** IV qorincha tomi ustida, eng medialda joylashgan. Muvozanat va vestibular tizim bilan bog'langan.

#### C. Miyachaning 3 juft oyoqchalari (*Pedunculi cerebellares*):
1. **Pedunculi cerebellares superiores (Yuqori oyoqchalar):** O'rta miyaga boradi. Asosan **efferent (chiquvchi)** yo'llar: *Tr. cerebellorubralis* (qizil o'zakka) va *Tr. cerebellothalamicus* (talamus orqali bosh miya po'stlog'iga). Bitta afferent yo'li: *Tr. spinocerebellaris anterior (Gowers)*.
2. **Pedunculi cerebellares medii (O'rta oyoqchalar):** Ko'prikka boradi (eng yo'g'on oyoqcha). Bosh miya po'stlog'idan impulslarni eltuvchi **Tr. pontocerebellaris** (po'stloq-ko'prik-miyacha yo'li) tolalari o'tadi.
3. **Pedunculi cerebellares inferiores (Pastki oyoqchalar / Corpus restiforme):** Uzunchoq miyaga boradi. Asosan **afferent (kiruvchi)** yo'llar: *Tr. spinocerebellaris posterior (Flechsig)*, *Tr. olivocerebellaris* (zaytundan), *Tr. vestibulocerebellaris* (vestibulyar apparatdan). Bitta efferent yo'li: *Tr. cerebellovestibularis*.

---

### 8. 🩺 KLINIK NEYROANATOMIYA VA USMLE YUQORI BALLI KEYSLAR

1. **Braun-Sekar sindromi (Brown-Séquard Syndrome — Orqa miya yarmi kesilishi):**
   * *Zararlangan tomonda:* Kesilish darajasidan pastda markaziy falajlik (*tr. corticospinalis lateralis*) va ongli propriosepsiya, vibratsiya sezgisining yo'qolishi (*fasciculus gracilis/cuneatus*).
   * *Qarama-qarshi tomonda:* Kesilishdan 1-2 segment pastdan boshlab og'riq va harorat sezgisining yo'qolishi (*tr. spinothalamicus lateralis* orqa miyaga kiriboq kesishgani sababli!).
2. **Siringomiyeliya (Syringomyelia):**
   * Markaziy kanal kengayib bo'shliq hosil qiladi va oldingi oq birikmani (*commissura alba*) ezadi. Natijada yelka va ko'krak sohasida **"kurtka" ko'rinishidagi dissotsiyalangan sezgi yo'qolishi** (og'riq va harorat yo'qoladi, ammo taktil va proprioseptiv sezgi saqlanib qoladi).
3. **Tabes dorsalis (Orqa miya qurishi / Neyrozaxm):**
   * Orqa tizimcha (*funiculus posterior*) yemiriladi. Bemor oyoqlari ostidagi yerni sezmaydi, ko'zini yumganda muvozanatni yo'qotadi (**Romberg sinamasi musbat**), "tovonlab bosish" yurishi paydo bo'ladi.
4. **Vallenberg-Zaxarchenko sindromi (Lateral Medullary Syndrome):**
   * Orqa pastki miyacha arteriyasi (**PICA**) trombozida uzunchoq miya dorsolateral qismi nobud bo'ladi. Belgilari: shikastlangan tomonda Horner sindromi, ataksiya, yuzda og'riq yo'qolishi, disfagiya va ovoz bo'g'ilishi; qarama-qarshi tana yarmida og'riq-harorat sezgisining yo'qolishi.
5. **Miyacha Zararlanishi Sindromi (Cerebellar Ataxia Triad):**
   * **Intension tremor:** Harakat oxirida, maqsadga yaqinlashganda titrashning kuchayishi (barmoq-burun sinamasida).
   * **Dismetriya:** Mo'ljalga aniq yetmaslik yoki oshirib yuborish.
   * **Adiadoxokinez:** Qarama-qarshi harakatlarni (masalan, qo'lni tez pronatsiya-supinatsiya qilishni) tez bajara olmaslik.
   * **Skanirlangan nutq:** Bo'g'inlab, ritmsiz gapirish.
   * **Nistagm:** Ko'z olmalarining eriksiz qaltirashi.
6. **Okklyuzion Gidrosefaliya (Non-communicating Hydrocephalus):**
   * Silviy suv yo'li yoki IV qorincha teshiklari (Majandi va Lyushka) o'sma yoki yallig'lanish bilan to'silib qolganda likvor oqimi buzilib, bosh ichki bosimi (ICP) keskin ko'tariladi: kuchli bosh og'rig'i, qusish, ko'rish nervi diski dimlanishi.`,
      ru: `## 🧠 Анатомия спинного мозга, основания мозга, ствола и мозжечка

### Полная клиническая и топографическая анатомия:
1. **Спинной мозг (*Medulla spinalis*):** Скелетотопия от *foramen magnum* до L1-L2 (*conus medullaris*). Шейное и пояснично-крестцовое утолщения. Оболочки: твердая, паутинная, мягкая. Эпидуральное и субарахноидальное пространства. Анатомия люмбальной пункции (L3-L4).
2. **Внутреннее строение спинного мозга:** Серое вещество (передние двигательные рога с альфа/гамма мотонейронами, задние чувствительные рога, боковые симпатические рога C8-L2). Проводящие пути белого вещества: пути Голля и Бурдаха, латеральный и передний кортикоспинальные тракты, спиноталамические тракты.
3. **Основание мозга и 12 пар Черепных Нервов:** Полная супер-таблица всех 12 пар с локализацией ядер, местами выхода из ствола и черепа, зоной иннервации и клиническими синдромами (поражение лицевого нерва, тройничная невралгия, синдром Горнера).
4. **Продолговатый мозг (*Medulla oblongata*):** Пирамиды, перекрест пирамид, оливы, нижние ядра олив, ядра Голля и Бурдаха, жизненно важные дыхательный и сосудодвигательный центры.
5. **Мост (*Pons*):** Базилярная борозда, ядра моста, проводящие пути и ядра V-VIII черепных нервов в покрышке.
6. **IV желудочек и Ромбовидная ямка (*Fossa rhomboidea*):** Топография проекции ядер черепных нервов, отверстия Мажанди и Люшка.
7. **Мозжечок (*Cerebellum*):** Полушария, червь, 4 пары глубоких ядер (*dentatus, emboliformis, globosus, fastigii*), 3 пары ножек мозжечка, мозжечковая атаксия.
8. **Клинические синдромы:** Синдром Броун-Секара, сирингомиелия, синдром Валленберга-Захарченко, окклюзионная гидроцефалия.`,
      en: `## 🧠 Anatomy of the Spinal Cord, Base of Brain, Brainstem, and Cerebellum

### Comprehensive Medical & Clinical Curriculum:
1. **Spinal Cord (*Medulla spinalis*):** Topography from foramen magnum to L1-L2 (*conus medullaris*). Cervical and lumbosacral enlargements. Meninges (dura, arachnoid, pia) and spaces (epidural, subarachnoid). Lumbar puncture anatomy (L3-L4/L4-L5).
2. **Internal Structure of Spinal Cord:** Gray matter horns (anterior motor with alpha/gamma motor neurons, posterior sensory, lateral sympathetic C8-L2). White matter tracts: Fasciculus gracilis & cuneatus (dorsal columns), lateral corticospinal tract, spinothalamic tracts.
3. **Base of Brain & 12 Cranial Nerves Super-Table:** Detailed mapping of all 12 pairs of cranial nerves including functional modalities, brainstem exit, cranial exit foramina, target organs, and classic lesion pathologies (Bell's palsy, trigeminal neuralgia, diplopia).
4. **Medulla Oblongata:** Pyramids, decussation of pyramids, olives, nucleus ambiguus, solitary tract, respiratory and vasomotor vital reflex centers.
5. **Pons:** Basilar sulcus, pontine nuclei, transverse fibers, and tegmental nuclei of CN V-VIII.
6. **4th Ventricle & Rhomboid Fossa:** Roof, floor, apertures of Magendie and Luschka, somatotopic cranial nerve nuclei layout.
7. **Cerebellum:** Hemispheres, vermis, 4 deep nuclei (Dentate, Emboliform, Globose, Fastigial), 3 peduncles, cerebellar ataxia triad.
8. **Clinical Syndromes & USMLE Pearls:** Brown-Séquard syndrome, syringomyelia, Wallenberg lateral medullary syndrome, non-communicating hydrocephalus.`
    },
    latinTerms: [
      "Medulla spinalis (Orqa miya)",
      "Conus medullaris (Miya konusi)",
      "Cauda equina (Ot dumi)",
      "Filum terminale (Oxirgi ip)",
      "Intumescentia cervicalis et lumbosacralis (Bo'yin va bel qalinlashuvlari)",
      "Funiculus anterior, lateralis et posterior (Oldingi, yon va orqa tizimchalar)",
      "Fasciculus gracilis et cuneatus (Goll va Burdax dastalari)",
      "Tractus corticospinalis lateralis (Yon piramida yo'li)",
      "Decussatio pyramidum (Piramidalar kesishuvi)",
      "Truncus encephali (Miya poyasi)",
      "Medulla oblongata / Bulbus (Uzunchoq miya)",
      "Pyramides medullae oblongatae (Uzunchoq miya piramidalari)",
      "Oliva medullae oblongatae (Uzunchoq miya zaytuni)",
      "Pons / Pons Varolii (Voroliy ko'prigi)",
      "Sulcus basilaris (Asosiy egat)",
      "Ventriculus quartus (IV Qorincha)",
      "Fossa rhomboidea (Rombsimon chuqurcha)",
      "Colliculus facialis (Yuz do'mbog'i)",
      "Apertura mediana ventriculi quarti / Magendie (Majandi teshigi)",
      "Aperturae laterales ventriculi quarti / Luschka (Lyushka teshiklari)",
      "Cerebellum (Miyacha)",
      "Hemispherium cerebelli (Miyacha yarim shari)",
      "Vermis cerebelli (Miyacha chuvalchangi)",
      "Nucleus dentatus (Tishsimon o'zak)",
      "Nucleus emboliformis (Po'kaksimon o'zak)",
      "Nucleus globosus (Sharsimon o'zak)",
      "Nucleus fastigii (Tom o'zagi)",
      "Pedunculi cerebellares superior, medius et inferior (Miyacha yuqori, o'rta va pastki oyoqchalari)",
      "Arbor vitae cerebelli (Miyacha hayot daraxti)",
      "Spatium subarachnoideum (Subaraxnoid bo'shliq)",
      "Liquor cerebrospinalis (Miya-orqa miya suyuqligi)"
    ],
    videos: [
      "https://www.youtube.com/watch?v=kYJvMOHp3L4",
      "https://www.youtube.com/watch?v=F_f8rQGz_kI",
      "https://www.youtube.com/watch?v=q84t_iR97qg",
      "https://www.youtube.com/watch?v=jH_vM-DqL4M"
    ]
  },
  {
    id: "sem_3_top_2",
    semester: 3,
    order: 2,
    defaultModelId: "thalamus-brainsections",
    terms: SEMESTER_3_GLOSSARY_TERMS.filter(t => t.topicOrder === 2),
    title: {
      uz: "2-Mavzu: O‘rta miya. Oraliq miya. Bosh miyaning III qorinchasi",
      ru: "Тема 2: Средний мозг. Промежуточный мозг. III желудочек головного мозга",
      en: "Topic 2: Midbrain. Diencephalon. 3rd Ventricle"
    },
    theory: {
      uz: `## 🧠 O‘rta Miya (*Mesencephalon*), Oraliq Miya (*Diencephalon*) va III Qorincha Anatomiyasi

---

### 📌 MAVZU REJASI
1. **O‘rta miya (*Mesencephalon*):** Miya tomi (*tectum*), miya oyoqchalari (*pedunculi cerebri*), qora modda (*substantia nigra*), qizil o'zak (*nucleus ruber*), Silviy suv yo'li (*aqueductus cerebri*).
2. **O'rta miyaning kranial nervlari o'zaklari:** III juft (N. oculomotorius) motor va Yakubovich-Edinger-Vestfal parasimpatik o'zagi, IV juft (N. trochlearis) o'zagi, V juft mezensefalik o'zagi.
3. **Oraliq miya (*Diencephalon*):**
   * **Talamus (*Thalamus dorsalis*):** 120 dan ortiq o'zaklar tasnifi (VPL, VPM, LGN, MGN, VL, VA, MD, Pulvinar) va ularning vazifalari.
   * **Epitalamus (*Epithalamus*):** Epifiz bezi (*corpus pineale* / melatonin), jilovchalar (*habenulae*).
   * **Metatalamus (*Metathalamus*):** Medial va lateral tizzasimon tanalar.
   * **Gipotalamus (*Hypothalamus*):** Topografik zonalari va o'zaklari (supraoptik, paraventrikulyar, supraxiazmatik, mamillyar tanalar), gipofiz bilan aloqasi.
   * **Subtalamus (*Subthalamus*):** Luys subtalamik tanasi (*nucleus subthalamicus*).
4. **Bosh miyaning III qorinchasi (*Ventriculus tertius*):** 6 ta devori, cho'ntaklari (*recessus*), Monro teshiklari va likvor dinamikasi.
5. **Klinik Neyroanatomiya va USMLE Sindromlar:** Veber, Benedikt, Parino (Parinaud), Dejerin-Russi talamik og'riq sindromi, gemiballizm.

---

### 1. O‘RTA MIYA (*MESENCEPHALON*) ANATOMIYASI

O'rta miya miya poyasining eng yuqori bo'limi bo'lib, ko'prikni oraliq miya bilan bog'laydi. Ko'ndalang kesimda 3 ta asosiy bo'limdan iborat: **Miya tomi (*tectum*)**, **Qopqoq (*tegmentum*)** va **Miya oyoqchasi asosi (*crus cerebri*)**.

\`\`\`midbrain
[O'rta Miya Ko'ndalang Kesimi - Mesencephalon Cross-Section]
                     ┌────────────────────────────────┐
                     │ TECTUM: Colliculi Superiores   │
                     ├────────────────────────────────┤
                     │ Aqueductus Cerebri (PAG atrofi)│
                     ├────────────────────────────────┤
                     │ TEGMENTUM: Nucleus Ruber       │
                     │ III & IV Juft O'zaklari        │
                     ├────────────────────────────────┤
                     │ Substantia Nigra (Dofamin)     │
                     ├────────────────────────────────┤
                     │ CRUS CEREBRI (Piramidal trakt) │
                     └────────────────────────────────┘
\`\`\`

#### A. O'rta miya tomi (*Tectum mesencephali / Lamina quadrigemina*)
* **To'rt tepalik plastinkasi:**
  1. **Colliculi superiores (Yuqori tepaliklar):** Ko'rishning po'stloqosti reflektor markazlari. To'r pardadan to'g'ridan-to'g'ri tolalarni qabul qilib, ko'z va boshni to'satdan yorug'lik paydo bo'lgan tomonga burish (startle-refleks) hamda qorachiq yorug'lik refleksini ta'minlaydi. Brachium colliculi superioris orqali lateral tizzasimon tana (*CGL*) bilan tutashadi.
  2. **Colliculi inferiores (Pastki tepaliklar):** Eshitishning po'stloqosti reflektor markazlari. Lateral halqa (*lemniscus lateralis*) tolalari shu yerda tugaydi. Tovush kelgan tomonga bosh va tanani burish refleksini bajaradi. Brachium colliculi inferioris orqali medial tizzasimon tana (*CGM*) bilan tutashadi.

#### B. Miya oyoqchalari (*Pedunculi cerebri*)
Miya oyoqchasi ventral qismi — **Crus cerebri (asos)** va dorsal qismi — **Tegmentum (qopqoq)**dan iborat. Ularni o'rtada **Qora modda (*Substantia nigra Soemmerringi*)** ajratib turadi.
* **Crus cerebri (Asos):** Faqat tushuvchi harakat yo'llaridan iborat:
  * O'rta 3/5 qismini: **Tractus corticospinalis** (oyoq-qo'l muskullariga) va **Tractus corticonuclearis** (kranial nervlar o'zaklariga);
  * Medial 1/5 qismini: **Tractus frontopontinus** (peshona-ko'prik yo'li);
  * Lateral 1/5 qismini: **Tractus temporoparietooccipitopontinus** (chakka-tepa-ensa-ko'prik yo'li).
* **Substantia nigra (Qora modda):**
  * Neyronlarida dofamin va melanin pigmenti ko'p bo'lganligi sababli to'q-qora rangda ko'rinadi.
  * Ikki qismdan iborat: *Pars compacta* (dofamin ishlab chiqaruvchi neyronlar, striatumga dofamin yetkazadi) va *Pars reticulata* (GABA-ergik tormozlovchi neyronlar).
  * Ekstrapiramidal tizimning asosiy bo'g'ini bo'lib, harakatlarning ravonligi, start-stop koordinatsiyasi va mushak tonusini boshqaradi.
* **Tegmentum (Qopqoq) va uning o'zaklari:**
  1. **Nucleus ruber (Qizil o'zak):** Temir saqlovchi pigmentga boy, yirik dumaloq o'zak. Ekstrapiramidal tizimga kiradi, mushaklar tonusini (ayniqsa fleksorlarni) oshiruvchi **Tractus rubrospinalis (Monakov yo'li)**ni hosil qiladi. Uning tolalari o'rta miyada to'liq kesishadi (*Decussatio tegmentalis ventralis / Forel kesishmasi*).
  2. **Substantia grisea centralis (PAG — Periaqueductal Gray):** Silviy suv yo'li atrofidagi kulrang modda. Unda endorfin va enkefalinlar sintezlanadi, organizmning ichki og'riqsizlantirish (antinositseptiv) tizimining markazi hisoblanadi.

#### C. O'rta miyada joylashgan Kranial Nervlar O'zaklari:
1. **III juft — N. oculomotorius o'zaklari (Yuqori tepaliklar sathida):**
   * *Nucleus motorius n. oculomotorii* (GSE) — ko'zning 5 ta mushagini harakatlantiradi.
   * *Nucleus accessorius / Yakubovich-Edinger-Vestfal o'zagi* (GVE, parasimpatik) — m. sphincter pupillae (mioz) va m. ciliaris (akkomodatsiya)ni ta'minlaydi.
   * *Nucleus medianus impar (Perlya o'zagi)* — konvergensiya markazi.
2. **IV juft — N. trochlearis o'zagi (Pastki tepaliklar sathida):**
   * *Nucleus n. trochlearis* (GSE) — tolalari miya orqa yuzasida yuqori miya yelkasida (*velum medullare superius*) **to'liq kesishadi** va miya poyasining orqa tomonidan chiquvchi yagona nerv hisoblanadi.
3. **V juft — N. trigeminusning mezensefalik o'zagi:**
   * *Nucleus mesencephalicus n. trigemini* — chaynash muskullari va tish bog'lamlaridan proprioseptiv sezgini qabul qiladi.

#### D. Silviy suv yo'li (*Aqueductus cerebri / Sylvius*):
* Uzunligi taxminan **1.5–2.0 sm**, diametri **1–2 mm** bo'lgan tor kanal. III qorinchani IV qorincha bilan tutashtiradi. Bolalarda Silviy suv yo'li torayishi (atreziya/stenoz) **ichki tug'ma gidrosefaliya**ga olib keladi.

---

### 2. ORALIQ MIYA (*DIENCEPHALON*) ANATOMIYASI

Oraliq miya miya poyasi bilan bosh miya katta yarim sharlari oralig'ida joylashgan bo'lib, quyidagi 4 ta asosiy qismga bo'linadi:

#### A. Talamus (*Thalamus dorsalis* — Ko'rish do'mbog'i)
Talamus — tuxumsimon shakldagi ulkan juft kulrang modda massasi bo'lib, **hid bilishdan tashqari barcha turdagi sezgilarning po'stloqosti oliy integratsiya markazi va kollektori**dir. 120 dan ortiq mayda o'zaklarni o'z ichiga oladi:

| O'zak nomi (Guruh) | Kiruvchi (Afferent) yo'llar | Chiquvchi (Efferent) yo'llar | Vazifasi / Funksiyasi |
| :--- | :--- | :--- | :--- |
| **VPL (Nucleus ventralis posterolateralis)** | *Lemniscus medialis* (Goll-Burdax) va *Tr. spinothalamicus* | Birlamchi somatosensor po'stloq (*Gyrus postcentralis*, 3, 1, 2-maydonlar) | Tana va oyoq-qo'llardan og'riq, harorat, teginish va ongli propriosepsiya. |
| **VPM (Nucleus ventralis posteromedialis)** | *Lemniscus trigeminalis* (V juft) va *Tr. solitariothalamicus* (ta'm) | *Gyrus postcentralis* (yuz proyeksiyasi) va insula | Yuz, bosh, tishlar va og'iz bo'shlig'i sezgisi hamda til ta'm sezgisi. |
| **LGN (Corpus geniculatum laterale)** | *Tractus opticus* (II juft) | *Radiatio optica* (Grazyole tutami) ➔ Ensa bo'lagi (*Sulcus calcarinus*, 17-maydon) | **Ko'rishning po'stloqosti oliy markazi.** |
| **MGN (Corpus geniculatum mediale)** | *Brachium colliculi inferioris* (VIII juft) | *Radiatio acustica* ➔ Yuqori chakka burmasi (*Geshl burmasi*, 41, 42-maydonlar) | **Eshitishning po'stloqosti oliy markazi.** |
| **VL / VA (Ventralis lateralis / anterior)** | Miyacha (*Nucleus dentatus*) va Bazal gangliyalar (*Globus pallidus*) | Birlamchi motor po'stloq (*Gyrus precentralis*, 4-maydon) va premotor soha (6-maydon) | Harakatlarni rejalashtirish, koordinatsiya va motor nazorat. |
| **Anterior o'zaklar guruhi** | Mamillyar tanalar (*Tractus mamillothalamicus / Vik-d'Azir*) | Kamar burmasi (*Gyrus cinguli*) | **Papez xalqasi**, xotira, hissiyotlar va limbik tizim integratsiyasi. |
| **MD (Nucleus mediodorsalis)** | Amygdala, gipotalamus, hid biluvchi po'stloq | Prefrontal po'stloq (xulq-atvor, qaror qabul qilish) | Hissiy kechinmalar, shaxsiyat, motivatsiya va affektiv xulq-atvor. |
| **Pulvinar (Yostiq)** | Yuqori tepaliklar, ko'ruv assotsiativ zonalari | Tepa-chakka-ensa assotsiativ po'stlog'i | Ko'rish, eshitish va somatosensor ma'lumotlarni murakkab integratsiyalash. |

#### B. Epitalamus (*Epithalamus*)
* **Corpus pineale (Glandula pinealis / Epifiz bezi):** Uchinchi qorinchaning orqa-yuqori qismida, to'rt tepalik ustida joylashgan konus shaklidagi endokrin bez. Qorong'uda neyrogormon **Melatonin** ishlab chiqarib, insonning sutkalik sirkad ritmlarini (uyqu-uyg'oqlik sikli) va erta jinsiy yetilishni tormozlashni boshqaradi.
* **Habenulae (Jilovchalar) va Trigonum habenulae:** Hid bilish markazlarini o'rta miyaning vegetativ va motor o'zaklari bilan bog'laydi.

#### C. Gipotalamus (*Hypothalamus*)
Gipotalamus talamus ostida joylashgan bo'lib, og'irligi bor-yo'g'i **4 gramm**, ammo butun organizmning **vegetativ gomeostazi, harorati, suv-tuz balansi, ochlik-to'qlik va endokrin tizimining bosh dirijyori** hisoblanadi.

* **Topografik zonalari va o'zaklari:**
  1. **Oldingi (Xiazmatik) zona:**
     * **Nucleus supraopticus:** **Vazopressin (Antidiuretik gormon / ADH)** sintezlaydi. Buyraklarda suv reabsorbsiyasini kuchaytiradi va qon bosimini oshiradi.
     * **Nucleus paraventricularis:** **Oksitotsin** gormonini sintezlaydi (bachadon qisqarishi va sut ajralishi).
     * *(Ikkala gormon gipotalamo-gipofizar trakt orqali neyrogipofizga oqib tushadi va u yerda qonga ajraladi)*.
     * **Nucleus suprachiasmaticus:** Organizmning biologik soati ("master circadian pacemaker").
  2. **O'rta (Tuberal) zona:**
     * **Nucleus arcuatus (Infundibularis):** Gipofizotrop statinlar va liberinlarni ishlab chiqaradi (adenogipofiz gormonlarini nazorat qiladi).
     * **Nucleus ventromedialis:** **"To'qlik markazi"** (zararlanganda to'xtovsiz ovqatlanish — giperfagiya va semirish kelib chiqadi).
     * **Area hypothalamica lateralis:** **"Ochlik va chanqoq markazi"** (zararlanganda ovqatdan voz kechish — anoreksiya va suvsizlanish yuzaga keladi).
  3. **Orqa (Mamillyar) zona:**
     * **Corpora mamillaria (So'rg'ichsimon tanalar):** Qisqa muddatli xotirani uzoq muddatli xotiraga aylantirish (Papez xalqasi). Surunkali alkogolizmda tiamin (B1 vitamini) yetishmovchiligi natijasida mamillyar tanalar yemirilishi **Vernike-Korsakov sindromi** (konfabulyatsiyalar, amneziya)ga sabab bo'ladi.
     * **Tana haroratini boshqarish:** Oldingi gipotalamus sovutishni (terlash, tomirlar kengayishi), orqa gipotalamus esa isitishni (mushak titrashi, tomirlar torayishi) boshqaradi.

#### D. Subtalamus (*Ventral talamus*)
* Talamus ostida joylashgan. Eng muhim tuzilmasi — **Nucleus subthalamicus (Luys tanasi)**.
* Bazal gangliyalarning bilvosita (indirect) yo'liga kiradi. Agar infarkt yoki insult oqibatida bitta Luys tanasi nobud bo'lsa, bemorda qarama-qarshi qo'l va oyoqning ixtiyorsiz, shiddatli, uloqtiruvchi harakatlari — **Gemiballizm (*Hemiballismus*)** sindromi yuzaga keladi.

---

### 3. III QORINCHA (*VENTRICULUS TERTIUS*) ANATOMIYASI

III qorincha — oraliq miya markazidagi tor sagittal tirqish bo'lib, likvor bilan to'la. 6 ta devorga ega:
1. **Lateral devorlari (2 ta):** Talamuslarning medial yuzalari hosil qiladi. Ular o'rtada **Adhaesio interthalamica** (talamuslararo bitishma) orqali tutashgan. Talamusni gipotalamusdan ajratib turuvchi *sulcus hypothalamicus* ham lateral devorda yotadi.
2. **Oldingi devori:** Gumbaz ustunlari (*columnae fornicis*), oldingi bitishma (*commissura anterior*) va oxirgi plastinka (*lamina terminalis*).
3. **Pastki devori (tubi):** Gipotalamus tuzilmalari — *chiasma opticum, tuber cinereum, infundibulum, corpora mamillaria*.
4. **Ustki devori (tomi):** III qorinchaning tomirli pardasi (*tela choroidea ventriculi tertii*) va uning qon tomir chigali (*plexus choroideus* — likvor ishlab chiqaradi).
5. **Orqa devori:** Epitalamik bitishma (*commissura epithalamica*), jilovchalar bitishmasi va Silviy suv yo'lining kirish teshigi.

* **III Qorincha cho'ntaklari (*Recessus*):**
  * *Recessus opticus* (ko'ruv xiazmasi ustida);
  * *Recessus infundibuli* (gipofiz voronkasi ichida);
  * *Recessus pinealis* (epifiz poyasi ichida);
  * *Recessus suprapinealis* (epifiz ustida).
* **Tutashuvlari:** Oldinda 2 ta **Monro teshiklari (*Foramina interventricularia*)** orqali yon qorinchalar bilan, orqada **Silviy suv yo'li (*Aqueductus cerebri*)** orqali IV qorincha bilan erkin tutashadi.

---

### 4. 🩺 KLINIK NEYROANATOMIYA VA USMLE KEYSLAR

1. **Veber sindromi (Weber syndrome — O'rta miya asosi insulti):**
   * *Patologiyasi:* A. cerebri posterior tarmoqlari berkilishi oqibatida *crus cerebri* va undan o'tuvchi III nerv tolalari nobud bo'ladi.
   * *Klinikasi:* Shikastlangan tomonda **III juft kranial nerv falaji** (ptoz, midriaz, tashqariga qaragan g'ilaylik), qarama-qarshi tomonda **kontralateral spastik gemiparez / gemiplegiya** (*tr. corticospinalis* shikastlanishi tufayli).
2. **Benedikt sindromi (Benedikt syndrome — O'rta miya tegmentum insulti):**
   * *Patologiyasi:* Qizil o'zak (*nucleus ruber*) va III nerv tolalari zararlanadi.
   * *Klinikasi:* Shikastlangan tomonda III nerv falaji, qarama-qarshi tomonda esa **intension tremor, ataksiya va xoreoatetoid harakatlar** kuzatiladi.
3. **Parino sindromi (Parinaud syndrome / Dorsal midbrain syndrome):**
   * *Patologiyasi:* Epifiz bezi o'smasi (pinealoma) to'rt tepalikning yuqori tepachalarini (*colliculi superiores*) bosib qo'yadi.
   * *Klinikasi:* **Vertikal nigohni yuqoriga qarata olmaslik (yuqoriga qarash falaji)**, qorachiqlarning yorug'likka reaksiyasi yo'qolishi, lekin akkomodatsiyaga saqlanishi (Argyll Robertson fenomeni varianti).
4. **Dejerin-Russi sindromi (Thalamic Pain Syndrome):**
   * *Patologiyasi:* Talamusning VPL va VPM o'zaklarining insulti (talamogenikulyar arteriya trombozi).
   * *Klinikasi:* Qarama-qarshi tana yarmida dastlab barcha sezgilarning yo'qolishi (gemianesteziya), keyin esa eng yengil teginishga ham chidab bo'lmas, kuydiruvchi o'tkir og'riq bilan javob berish (**Allodiniya** va giperalgeziya).`,
      ru: `## 🧠 Анатомия среднего мозга, промежуточного мозга и III желудочка

* **Средний мозг (*Mesencephalon*):**
  * Крыша (*Tectum*): Верхние холмики (подкорковые центры зрения, стартл-рефлекс) и нижние холмики (подкорковые центры слуха).
  * Ножки мозга (*Pedunculi cerebri*): Основание (*crus cerebri* — кортикоспинальный, кортиконуклеарный пути) и покрышка (*tegmentum* — красное ядро, РФ, ядра III и IV ЧН, PAG).
  * Черное вещество (*Substantia nigra*): Дофаминергический контроль экстрапирамидной системы (болезнь Паркинсона).
  * Водопровод мозга соединяет III и IV желудочки.
* **Промежуточный мозг (*Diencephalon*):**
  * Таламус: Главный сенсорный коллектор всех видов чувствительности (кроме обоняния). Ядра: VPL (тело), VPM (лицо и вкус), CGL (зрение), CGM (слух), VA/VL (моторика), Anterior (лимбика), MD (префронтальная кора), Pulvinar.
  * Гипоталамус: Высший центр вегетативной и эндокринной регуляции (супраоптическое — АДГ, паравентрикулярное — окситоцин, супрахиазматическое — циркадные ритмы, вентромедиальное — сытость, латеральное — голод, сосцевидные тела — память/синдром Корсакова).
  * Субталамус: Субталамическое ядро Льюиса (поражение вызывает гемибаллизм).
  * Эпиталамус: Шишковидное тело (эпифиз, мелатонин).
* **III Желудочек:** 6 стенок, 4 кармана, отверстия Монро.
* **Клинические синдромы:** Синдром Вебера (III нерв + гемипарез), Бенедикта (III нерв + атаксия/тремор), Парино (паралич взора вверх при пинеаломе), таламический синдром Дежерина-Русси.`,
      en: `## 🧠 Midbrain, Diencephalon, and 3rd Ventricle

* **Midbrain (*Mesencephalon*):**
  * Tectum: Superior colliculi (visual reflexes, pupil light reflex) & inferior colliculi (auditory reflexes).
  * Cerebral Peduncles: Crus cerebri (corticospinal, corticonuclear tracts), substantia nigra (dopaminergic motor modulation), tegmentum with red nucleus (rubrospinal tract) and PAG (pain modulation).
  * Cranial Nuclei: CN III (motor + Edinger-Westphal parasympathetic), CN IV (only dorsal exit, 100% decussated), CN V mesencephalic nucleus.
  * Cerebral Aqueduct of Sylvius connecting 3rd and 4th ventricles.
* **Diencephalon:**
  * Thalamus: Major sensory relay station (all sensations except olfaction). Nuclei: VPL (body pain/temp/proprioception), VPM (face/taste), LGN (vision), MGN (hearing), VL/VA (motor planning), Anterior (Papez circuit), MD (limbic/prefrontal), Pulvinar.
  * Hypothalamus: Master autonomic/endocrine coordinator. Supraoptic (ADH), Paraventricular (Oxytocin), Suprachiasmatic (circadian clock), Ventromedial (satiety), Lateral (hunger), Mamillary bodies (memory/Wernicke-Korsakoff).
  * Subthalamus: Subthalamic nucleus of Luys (lesion causes hemiballismus).
  * Epithalamus: Pineal gland (melatonin, circadian rhythm).
* **3rd Ventricle:** 6 walls, recesses, interventricular foramina of Monro.
* **Clinical Syndromes & USMLE Pearls:** Weber syndrome, Benedikt syndrome, Parinaud syndrome (pinealoma compression causing vertical upward gaze palsy), Dejerine-Roussy thalamic pain syndrome.`
    },
    latinTerms: [
      "Mesencephalon (O'rta miya)",
      "Tectum mesencephali (O'rta miya tomi)",
      "Lamina quadrigemina (To'rt tepalik plastinkasi)",
      "Colliculi superiores et inferiores (Yuqori va pastki tepaliklar)",
      "Pedunculi cerebri (Miya oyoqchalari)",
      "Crus cerebri (Miya oyoqchasi asosi)",
      "Tegmentum mesencephali (O'rta miya qopqog'i)",
      "Substantia nigra Soemmerringi (Qora modda)",
      "Nucleus ruber Stillingi (Qizil o'zak)",
      "Substantia grisea centralis / PAG (Markaziy kulrang modda)",
      "Aqueductus cerebri Sylvii (Silviy suv yo'li)",
      "Diencephalon (Oraliq miya)",
      "Thalamus dorsalis (Ko'rish do'mbog'i)",
      "Nucleus ventralis posterolateralis / VPL (Ventroposterolateral o'zak)",
      "Nucleus ventralis posteromedialis / VPM (Ventroposteromedial o'zak)",
      "Corpus geniculatum laterale / LGN (Lateral tizzasimon tana)",
      "Corpus geniculatum mediale / MGN (Medial tizzasimon tana)",
      "Hypothalamus (Gipotalamus)",
      "Corpora mamillaria (So'rg'ichsimon tanalar)",
      "Chiasma opticum (Ko'rish kesishmasi)",
      "Tuber cinereum (Kulrang do'mboq)",
      "Infundibulum et Hypophysis (Voronka va Gipofiz bezi)",
      "Nucleus subthalamicus Luysi (Luys subtalamik o'zagi)",
      "Corpus pineale / Epiphysis cerebri (Epifiz bezi)",
      "Ventriculus tertius (III Qorincha)",
      "Foramen interventriculare Monro (Monro teshigi)",
      "Adhaesio interthalamica (Talamuslararo bitishma)"
    ],
    videos: [
      "https://www.youtube.com/watch?v=kYJvMOHp3L4",
      "https://www.youtube.com/watch?v=q84t_iR97qg"
    ]
  },
  {
    id: "sem_3_top_3",
    semester: 3,
    order: 3,
    defaultModelId: "brain-cerebrum-brainstem",
    terms: SEMESTER_3_GLOSSARY_TERMS.filter(t => t.topicOrder === 3),
    title: {
      uz: "3-Mavzu: Bosh miya po‘stlog‘i. Gumbaz, qadoqsimon tana. Bosh miyaning bazal o‘zaklari. Bosh miyaning yon qorinchalari. Bosh miyani o‘raydigan pardalar",
      ru: "Тема 3: Кора большого мозга. Свод, мозолистое тело. Базальные ядра. Боковые желудочки. Оболочки головного мозга",
      en: "Topic 3: Cerebral Cortex. Fornix, Corpus Callosum. Basal Ganglia. Lateral Ventricles. Meninges of the Brain"
    },
    theory: {
      uz: `## 🧠 Bosh Miya Katta Yarim Sharlari (*Telencephalon*), Bazal O‘zaklar va Pardalar

---

### 📌 MAVZU REJASI
1. **Bosh miya po‘stlog‘i (*Cortex cerebri*):** 6 qavatli neokorteks gistologiyasi, egatlar va burmalar, Brodmann maydonlarining to'liq xaritasi (motor, sensor, nutq, ko'rish, eshitish), Penfild gomunkulusi.
2. **Katta yarim sharlarning oq moddasi (*Substantia alba*):**
   * Assotsiativ tolalar (uzun va qisqa dastalari);
   * Komissural tolalar: Qadoqsimon tana (*Corpus callosum*), gumbaz (*Fornix*), oldingi bitishma;
   * Proyeksion tolalar: **Ichki kapsula (*Capsula interna*)**ning batafsil topografiyasi va undan o'tuvchi yo'llar.
3. **Bazal o‘zaklar (*Nuclei basales*):** Targ'il tana (*corpus striatum*), dumli o'zak (*nucleus caudatus*), yasmiqsimon o'zak (*putamen* va *globus pallidus*), to'siq (*claustrum*), bodomsimon tana (*amygdala*).
4. **Bosh miya yon qorinchalari (*Ventriculi laterales*):** 4 ta bo'limi (oldingi shox, markaziy qism, orqa shox, pastki shox), Gippokamp (*Hippocampus*) va likvor aylanishi.
5. **Bosh miya pardalari va Venoz sinuslar (*Sinus durae matris*):** Qattiq parda o'simtalari (*falx cerebri, tentorium cerebelli*), 8 ta asosiy venoz sinuslar, *confluens sinuum* va likvor so'rilishi.
6. **Klinik Neyrologiya:** Broka va Vernike afaziyalari, ichki kapsula insulti (uchlik sindrom), Parkinson va Xantington kasalliklari, subdural va epidural gematomalar.

---

### 1. BOSH MIYA PO‘STLOG‘I (*CORTEX CEREBRI*) VA BRODMANN MAYDONLARI

Bosh miya po'stlog'i 10–14 milliard neyronlardan iborat bo'lib, qalinligi **1.5 mm dan 4.5 mm gacha** yetadi. Po'stloqning 95% qismi 6 qavatli **Neokorteks (Izokorteks)**dan iborat:

\`\`\`cortex
[Neokorteksning 6 Qavatli Tuzilishi]
  I.   Lamina molecularis      ── Kam neyronli, neyropil to'ri
  II.  Lamina granularis ext.  ── Kichik donador qabul qiluvchi neyronlar
  III. Lamina pyramidalis ext. ── Assotsiativ va komissural tolalar manbai
  IV.  Lamina granularis int.  ── Talamusdan keluvchi asosiy SENSOR kirish
  V.   Lamina pyramidalis int. ── Betz gigant hujayralari (Piramida trakti!)
  VI.  Lamina multiformis      ── Talamusga qaytuvchi kortikotalamik tolalar
\`\`\`

#### A. Katta Yarim Sharlar Bo'laklari va Asosiy Relyefi:
* **Lobus frontalis (Peshona bo'lagi):** Markaz oldi egati (*sulcus precentralis*), yuqori va pastki peshona egatlari. *Gyrus precentralis* (birlamchi motor soha), *gyrus frontalis superior, medius, inferior* (pars opercularis, triangularis, orbitalis).
* **Lobus parietalis (Tepa bo'lagi):** Markaz orqa egati (*sulcus postcentralis*), tana ichi egati (*sulcus intraparietalis*). *Gyrus postcentralis* (birlamchi somatosensor soha), *lobulus parietalis superior*, *gyrus supramarginalis* va *gyrus angularis*.
* **Lobus temporalis (Chakka bo'lagi):** *Sulcus temporalis superior et inferior*. *Gyrus temporalis superior, medius, inferior*. Yuqori chakka burmasining orolchaga qaragan yuzasida **Geshl ko'ndalang burmalari (*Gyri temporales transversi*)** joylashgan.
* **Lobus occipitalis (Ensa bo'lagi):** *Sulcus calcarinus* (qirqma egat), *sulcus parietooccipitalis*. Qirqma egat ustida **Pona (*Cuneus*)**, ostida **Tilcha burmasi (*Gyrus lingualis*)** yotadi.
* **Insula (Orolcha / Reil orolchasi):** Yon egat (*sulcus lateralis / Sylvius*) tubida chuqur ko'milib yotgan beshinchi bo'lak.

#### B. Brodmann Po'stloq Maydonlarining To'liq Xaritasi:
1. **4-maydon — Birlamchi Harakatlantiruvchi Markaz (*Gyrus precentralis*):** V qavatidagi Betz gigant piramidal hujayralaridan asosiy tushuvchi piramidal yo'llar boshlanadi. Unda butun inson tanasi teskari tartibda (bosh-yuz pastda, oyoqlar yuqorida) proyeksiyalangan — **Motor Gomunkulus**. Qo'l panjasi, til va lablar eng ulkan maydonni egallaydi.
2. **6-maydon — Premotor va Qo'shimcha Motor Po'stloq:** Murakkab, avtomatlashgan ketma-ket harakatlarni dasturlash markazi.
3. **8-maydon — Peshona Ko'z Maydoni (Frontal Eye Field):** Ko'z olmalarining ixtiyoriy qarama-qarshi tomonga burilishini boshqaradi.
4. **3, 1, 2-maydonlar — Birlamchi Somatosensor Markaz (*Gyrus postcentralis*):** Tana, yuz va a'zolardan barcha taktil, harorat, og'riq va proprioseptiv sezgilarni qabul qiladi (**Sensor Gomunkulus**).
5. **44, 45-maydonlar — Broka Motor Nutq Markazi (*Gyrus frontalis inferior* orqa qismi):** So'zlarni talaffuz qilish, artikulyatsiya va og'zaki nutq motorikasi. Zararlanganda **Broka motor afaziyasi** (bemor tushunadi, ammo gapira olmaydi).
6. **22-maydon — Vernike Sensor Nutq Markazi (*Gyrus temporalis superior* orqasi):** Eshitilgan nutq ma'nosini tushunish markazi. Zararlanganda **Vernike sensor afaziyasi** (bemor boshqalarning gapini tushunmaydi, o'zi ravon gapirsa ham ma'nosiz "so'z salatasi" aytadi).
7. **39-maydon — Gyrus Angularis:** Yozma nutqni tushunish (o'qish) va yozish markazi. Zararlanganda aleksiya va agrafiya kelib chiqadi.
8. **17-maydon — Birlamchi Ko'rish Po'stlog'i (*Sulcus calcarinus* qirralari):** To'r pardadan keluvchi vizual impulslarni qabul qiladi.
9. **18, 19-maydonlar — Ikkilamchi Ko'rish Po'stlog'i:** Ko'rilgan narsalarni tanish, xotira bilan taqqoslash (zararlanganda vizual agnoziya — ko'radi, ammo narsalarni tanimaydi).
10. **41, 42-maydonlar — Birlamchi Eshitish Po'stlog'i (*Geshl burmalari*):** Chig'anoqdan keluvchi tovush chastotalarini qabul qilish.
11. **43-maydon — Birlamchi Ta'm Bilish Markazi:** Posttsentral burmaning pastki qismi va insula sohasida.

---

### 2. KATTA YARIM SHARLARNING OQ MODDASI VA ICHKI KAPSULA

Oq modda miyelinli nerv tolalaridan iborat bo'lib, 3 guruh tolalarga bo'linadi:
* **Assotsiativ tolalar:** Bir yarim shar doirasidagi turli sohalarni bog'laydi. Qisqa tolalari (*fibrae arcuatae cerebri*) qo'shni burmalarni, uzun tolalari (*fasciculus longitudinalis superior, inferior, uncinatus, cingulum*) turli bo'laklarni bog'laydi.
* **Komissural tolalar:** O'ng va chap yarim sharlarning mos sohalarini o'zaro tutashtiradi:
  1. **Corpus callosum (Qadoqsimon tana):** 200–250 million toladan iborat eng ulkan birikma. Qismlari: Tumshiqcha (*rostrum*), tizza (*genu*), tana (*truncus*) va rolik (*splenium*).
  2. **Commissura anterior:** Hid bilish sohalari va chakka bo'laklarini bog'laydi.
  3. **Fornix (Gumbaz) va Commissura fornicis:** Gippokamplarni gipotalamus bilan bog'laydi (Papez xalqasi).

\`\`\`capsula_interna
[Ichki Kapsula - Capsula Interna Gorizontal Kesim]
           Caput Nuclei Caudati ──┐           ┌── Caput Nuclei Caudati
                                  │           │
           Crus Anterius ─────────┴─┐       ┌─┴───────── Crus Anterius
                                    │ GENU  │
                                    │ (VII, │
                                    │  XII) │
           Crus Posterius ──────────┴─┬───┬─┴────────── Crus Posterius
                                      │   │
                  Thalamus ───────────┘   └─────────── Thalamus
           Pars Retrolentiformis (Radiatio Optica)
           Pars Sublentiformis (Radiatio Acustica)
\`\`\`

#### Proyeksion Tolalar va Ichki Kapsula (*Capsula interna*):
Ichki kapsula — qalin oq modda plastinkasi bo'lib, medial tomondan **Thalamus** va **Nucleus caudatus**, lateral tomondan esa **Nucleus lentiformis** bilan chegaralangan. Ko'ndalang kesimda burchak shakliga ega:
1. **Crus anterius (Oldingi oyoqcha):** *Nucleus caudatus* bilan *putamen* orasida. Undan **Tractus frontopontinus** va talamusning oldingi pedunkuli o'tadi.
2. **Genu capsulae internae (Ichki kapsula tizzasi):** Undan bosh miya kranial nervlari motor o'zaklariga boruvchi **Tractus corticonuclearis** o'tadi.
3. **Crus posterius (Orqa oyoqcha):** Talamus bilan *putamen* orasida. Oldingi 2/3 qismidan tananing barcha ixtiyoriy harakatlarini ta'minlovchi **Tractus corticospinalis** (qo'l tolalari oldinda, oyoq tolalari orqaroqda) o'tadi. Orqa 1/3 qismidan esa talamusdan po'stloqqa chiquvchi barcha sezuvchi tolalar (**Radiatio thalami centralis**) o'tadi.
4. **Pars retrolentiformis:** Yasmiqsimon o'zak orqasida. Undan ko'rish yo'li — **Radiatio optica (Grazyole tutami)** ensa bo'lagiga o'tadi.
5. **Pars sublentiformis:** Yasmiqsimon o'zak ostida. Undan eshitish yo'li — **Radiatio acustica** chakka bo'lagiga o'tadi.

---

### 3. BAZAL O‘ZAKLAR (*NUCLEI BASALES*) VA EKSTRAPIRAMIDAL TIZIM

Bazal o'zaklar katta yarim sharlar oq moddasi chuqurligida yotgan kulrang modda to'plamlaridir:
1. **Corpus striatum (Targ'il tana):**
   * **Nucleus caudatus (Dumli o'zak):** Boshcha (*caput*), tana (*corpus*) va dum (*cauda*)dan iborat. Yon qorinchaning barcha qismlari bo'ylab cho'zilgan.
   * **Nucleus lentiformis (Yasmiqsimon o'zak):** Tashqi qoramtir qismi — **Qobiq (*Putamen*)** va ichki oqishroq qismi — **Oqish shar (*Globus pallidus*)**.
   * *Neostriatum (yangi qism):* Nucleus caudatus + Putamen (Striatum deb ataladi). Dofaminerjik va xolinerjik neyronlar.
   * *Paleostriatum (eski qism):* Globus pallidus (GABA-ergik asosiy efferent stansiya).
2. **Claustrum (To'siq):** *Putamen*dan tashqarida, orolcha po'stlog'i ostida joylashgan yupqa kulrang plastinka.
3. **Corpus amygdaloideum (Bodomsimon tana / Amygdala):** Chakka bo'lagi uchida, gipokamp oldida joylashgan limbik tizim markazi (qo'rquv, tajovuzkorlik, emotsional xotira).

* **Direct (To'g'ri) va Indirect (Egri) Motor Yo'llar:**
  * **To'g'ri yo'l (D1 retseptorlar):** Talamusni tormozdan xalos qilib, harakatlarni faollashtiradi va boshlaydi.
  * **Egri yo'l (D2 retseptorlar):** Subtalamik yadro orqali harakatlarni tormozlaydi va keraksiz ortiqcha harakatlarni bostiradi.

---

### 4. BOSH MIYA YON QORINCHALARI (*VENTRICULI LATERALES*)

Har bir katta yarim shar ichida bittadan "C" harfi shaklidagi yon qorincha mavjud:
1. **Cornu anterius (Oldingi shox):** Peshona bo'lagida. Medial devori — *septum pellucidum* (shaffof to'siq), lateral devori — *caput nuclei caudati*.
2. **Pars centralis (Markaziy qism):** Tepa bo'lagida. Tubini talamus ustki yuzasi va *corpus nuclei caudati* hosil qiladi.
3. **Cornu posterius (Orqa shox):** Ensa bo'lagida. Ichki devorida qush poyasi do'mbog'i (*calcar avis*) bo'rtib turadi.
4. **Cornu inferius (Pastki shox):** Chakka bo'lagida. Tubida eng muhim tuzilma — **Gippokamp (*Hippocampus / Ammon shoxi*)** yotadi. Gippokamp qisqa muddatli operativ xotirani uzoq muddatli xotiraga aylantirish (konsolidatsiya) markazidir.
* **Plexus choroideus (Tomirli chigal):** Markaziy qism va pastki shoxda joylashgan bo'lib, kuniga **500 ml** gacha likvor ishlab chiqaradi.

---

### 5. BOSH MIYA PARDALARI VA VENOZ SINUSLAR

1. **Dura mater encephali (Miya qattiq pardasi):**
   * Bosh suyagi ichki periosti bilan tutashgan qalin parda.
   * **O'simtalari:**
     * *Falx cerebri (Katta miya o'rog'i):* Ikkala katta yarim sharlar orasidagi sagittal egatga kiradi.
     * *Tentorium cerebelli (Miyacha chodiri):* Ensa bo'laklari ostida, miyacha ustida ko'ndalang yotadi.
     * *Falx cerebelli (Miyacha o'rog'i):* Miyacha yarim sharlari orasida.
     * *Diaphragma sellae:* Turk egari ustini yopib, gipofizni ajratib turadi.
2. **Venoz sinuslar (*Sinus durae matris*):**
   * Devorlari tarang fibroz to'qimadan iborat, klapanlari bo'lmaydi va bosilganda ham berkilmaydi:
     * *Sinus sagittalis superior:* Falx cerebri yuqori qirrasida. Unda likvorni venoz qonga so'rib oluvchi **Paxion donachalari (*granulationes arachnoideales*)** joylashgan.
     * *Sinus sagittalis inferior:* Falx cerebri pastki erkin qirrasida.
     * *Sinus rectus (To'g'ri sinus):* Sagittalis inferior va Galen buyuk miya venasi (*v. cerebri magna*) qo'shilishidan hosil bo'ladi.
     * *Confluens sinuum (Gerofil tori):* Ensa ichki do'mbog'ida *sinus sagittalis superior, sinus rectus, sinus occipitalis* va *sinus transversus* qo'shilish joyi.
     * *Sinus transversus ➔ Sinus sigmoideus:* Qonni bo'yinturuq teshigi (*foramen jugulare*) orqali **ichki bo'yinturuq venasi (*v. jugularis interna*)**ga quyadi.
     * *Sinus cavernosus (G'orsimon sinus):* Turk egari ikki yonida joylashgan bo'lib, ichidan **a. carotis interna** va **VI nerv (N. abducens)**, lateral devoridan esa **III, IV, V1 va V2 nervlar** o'tadi.

---

### 6. 🩺 KLINIK NEYROANATOMIYA VA USMLE KEYSLAR

1. **Ichki kapsula insulti ("Klassik kapsulyar uchlik sindromi"):**
   * *Patologiyasi:* A. cerebri media ning lentikulostriar shoxlari yorilishi yoki trombozida *crus posterius* zararlanadi.
   * *Klinikasi:*
     1. **Kontralateral spastik gemiplegiya** (*tr. corticospinalis* shikastlanishi);
     2. **Kontralateral gemianesteziya** (*radiatio thalami centralis* shikastlanishi);
     3. **Kontralateral gomonim gemianopsiya** (*radiatio optica* shikastlanishi).
2. **Epidural Gematoma (Epidural Hematoma):**
   * *Patologiyasi:* Chakka suyagi pterion sohasidan sinishi oqibatida **o'rta parda arteriyasi (*a. meningea media*)** yoriladi.
   * *Klinikasi:* Qon suyak bilan dura mater orasiga to'planadi. **Bikonveks (ikki tomonlama qavariq linza / yasmiqsimon)** shakldagi gematoma. Xarakterli **"lucid interval"** (hushidan ketish ➔ vaqtinchalik o'ziga kelish ➔ keyin komaga tushish va midriaz).
3. **Subdural Gematoma (Subdural Hematoma):**
   * *Patologiyasi:* Qattiq va to'rsimon pardalar orasidagi **ko'prik venalari (*bridging veins*)** yorilishi (keksalarda miya atrofiyasi fonida yengil yiqilishda ham uchraydi).
   * *Klinikasi:* **Yarimoy (kresent / crescent)** shaklidagi sekin rivojlanuvchi gematoma.
4. **Parkinson Kasalligi (Morbus Parkinson):**
   * *Substantia nigra pars compacta* dopaminerjik neyronlarining degeneratsiyasi. Triada: **Tinchlikdagi tremor ("tangalar sanash"), Rigor ("tishli g'ildirak" fenomeni) va Bradikineziya** (harakatlarning sekinlashuvi).
5. **Xantington Xoreyasi (Huntington Disease):**
   * *Nucleus caudatus* va *Putamen*dagi GABA-ergik tormozlovchi neyronlarning genetik nobud bo'lishi. Bemorlarda to'xtovsiz, raqssimon, tartibsiz ixtiyorsiz harakatlar (**Xoreya**) va demensiya kuzatiladi.`,
      ru: `## 🧠 Кора полушарий, базальные ядра, внутренняя капсула и оболочки мозга

* **Кора полушарий (*Cortex cerebri*):** 6 слоев неокортекса (молекулярный, наружный зернистый, наружный пирамидный, внутренний зернистый — сенсорный приток, внутренний пирамидный с клетками Беца — пирамидный тракт, мультиформный).
* **Поля Бродмана:**
  * 4: Первичная моторная кора (*gyrus precentralis*, моторный гомункулус Пенфилда).
  * 3, 1, 2: Первичная соматосенсорная кора (*gyrus postcentralis*).
  * 44, 45: Моторный центр речи Брока (моторная афазия).
  * 22: Сенсорный центр речи Вернике (сенсорная афазия).
  * 17: Первичная зрительная кора (*sulcus calcarinus*).
  * 41, 42: Слуховая кора Гешля.
* **Внутренняя капсула (*Capsula interna*):**
  * *Crus anterius:* лобно-мостовой путь.
  * *Genu:* кортиконуклеарный путь (к ядрам ЧН).
  * *Crus posterius:* кортикоспинальный путь (рука/нога) и таламическая лучистость.
  * *Pars retrolentiformis:* зрительная лучистость Грасьоле.
  * *Pars sublentiformis:* слуховой тракт.
* **Базальные ядра:** Хвостатое ядро, скорлупа (*putamen*), бледный шар (*globus pallidus*), ограда, миндалевидное тело. Прямой и непрямой пути двигательного контроля (болезнь Паркинсона и хорея Гентингтона).
* **Боковые желудочки:** Передний рог, центральная часть, задний рог, нижний рог с гиппокампом (консолидация памяти).
* **Оболочки и синусы:** Твердая оболочка (*falx cerebri, tentorium cerebelli*), синусы (сагиттальные, прямой, поперечный, сигмовидный, пещеристый), грануляции паутинной оболочки. Эпидуральная (*a. meningea media*) и субдуральная (*bridging veins*) гематомы.`,
      en: `## 🧠 Cerebral Cortex, Internal Capsule, Basal Ganglia, and Meninges

* **Cerebral Cortex Architecture:** 6-layered neocortex, motor and sensory Homunculi.
* **Brodmann Functional Mapping:** Area 4 (primary motor), 3, 1, 2 (primary somatosensory), 44/45 (Broca's motor speech area), 22 (Wernicke's sensory speech area), 17 (calcarine primary visual), 41/42 (Heschl's auditory).
* **Internal Capsule Topography:** Anterior limb, Genu (corticonuclear tract), Posterior limb (corticospinal tract + thalamocortical radiation), Retrolenticular (optic radiation of Meyer/Baum), Sublenticular (auditory radiation). Classic capsular stroke triad: contralateral hemiplegia, hemianesthesia, homonymous hemianopia.
* **Basal Ganglia Circuitry:** Caudate, Putamen, Globus Pallidus (internal/external), Claustrum, Amygdala. Direct (D1/pro-movement) vs Indirect (D2/inhibitory) motor loop pathologies (Parkinson's vs Huntington's chorea).
* **Lateral Ventricles & Hippocampus:** 4 subdivisions, choroid plexus CSF synthesis, hippocampus memory processing.
* **Dural Sinuses & Hematomas:** Superior sagittal, straight, transverse, sigmoid, cavernous sinuses. Epidural (middle meningeal artery, lens-shaped, lucid interval) vs Subdural (bridging veins, crescent-shaped) hematomas.`
    },
    latinTerms: [
      "Cortex cerebri (Bosh miya po'stlog'i)",
      "Gyrus precentralis (Markaz oldi burmasi - 4-maydon)",
      "Gyrus postcentralis (Markaz orqa burmasi - 3, 1, 2-maydonlar)",
      "Sulcus centralis Rolandi (Markaziy egat)",
      "Sulcus lateralis Sylvii (Yon egat)",
      "Sulcus calcarinus (Qirqma egat - 17-maydon)",
      "Gyri temporales transversi Heschli (Geshl burmalari)",
      "Corpus callosum (Qadoqsimon tana)",
      "Fornix cerebri (Miya gumbazi)",
      "Capsula interna (Ichki kapsula)",
      "Genu capsulae internae (Ichki kapsula tizzasi)",
      "Tractus corticonuclearis (Po'stloq-o'zak yo'li)",
      "Tractus corticospinalis (Po'stloq-orqa miya yo'li)",
      "Corpus striatum (Targ'il tana)",
      "Nucleus caudatus (Dumli o'zak)",
      "Nucleus lentiformis (Yasmiqsimon o'zak)",
      "Putamen (Qobiq)",
      "Globus pallidus (Oqish shar)",
      "Corpus amygdaloideum (Bodomsimon tana)",
      "Claustrum (To'siq)",
      "Ventriculus lateralis (Yon qorincha)",
      "Hippocampus / Cornu Ammonis (Gippokamp / Ammon shoxi)",
      "Falx cerebri (Katta miya o'rog'i)",
      "Tentorium cerebelli (Miyacha chodiri)",
      "Sinus sagittalis superior et inferior (Yuqori va pastki sagittal sinuslar)",
      "Sinus cavernosus (G'orsimon sinus)",
      "Confluens sinuum Herophili (Gerofil tori)",
      "Granulationes arachnoideales Pacchioni (Paxion donachalari)"
    ],
    videos: [
      "https://www.youtube.com/watch?v=kYJvMOHp3L4",
      "https://www.youtube.com/watch?v=F_f8rQGz_kI"
    ]
  },
  {
    id: "sem_3_top_4",
    semester: 3,
    order: 4,
    defaultModelId: "spinothalamic-tract",
    terms: SEMESTER_3_GLOSSARY_TERMS.filter(t => t.topicOrder === 4),
    title: {
      uz: "4-Mavzu: Bosh miya va orqa miyaning o‘tkazuv yo‘llari. Oddiy refleks yoyi. Sezuvchi va harakatlantiruvchi o‘tkazuv yo‘llari",
      ru: "Тема 4: Проводящие пути головного и спинного мозга. Рефлекторная дуга. Чувствительные и двигательные пути",
      en: "Topic 4: Pathways of the Brain and Spinal Cord. Reflex Arc. Sensory and Motor Pathways"
    },
    theory: {
      uz: `## ⚡ Bosh Miya va Orqa Miya O‘tkazuvchi Yo‘llari (*Tractus Systematis Nervosi*)

---

### 📌 MAVZU REJASI
1. **Reflektor faoliyat va Refleks yoyi (*Arcus reflexivus*):** 3 neyronli zanjir, retseptorlar tasnifi, monosinaptik va polisinaptik reflekslar.
2. **Sezuvchi (ko‘tariluvchi / afferent) yo‘llar:**
   * **Eksteroseptiv og'riq va harorat yo'li (*Tr. spinothalamicus lateralis*):** 3 neyronli tuzilishi, orqa miyada 100% kesishuvi, lemniscus spinalis.
   * **Ongli propriosepsiya va nozik taktil sezgi yo'li (Goll va Burdax yo'li / *Fasciculus gracilis et cuneatus*):** Orqa tizimcha, uzunchoq miyada *decussatio lemnisci medialis*, VPL talamus.
   * **Ongsiz proprioseptiv miyacha yo'llari:** Flechsig (*tr. spinocerebellaris posterior*) va Gowers (*tr. spinocerebellaris anterior* — 2 marta kesishuv!).
3. **Harakatlantiruvchi (tushuvchi / efferent) yo‘llar:**
   * **Bosh piramidal tizim (*Tractus pyramidalis*):** Betz hujayralari, ichki kapsula, piramidalar kesishuvi (*decussatio pyramidum*), *tr. corticospinalis lateralis et anterior*.
   * **Kortikonuklear yo'l (*Tr. corticonuclearis*):** Kranial nervlar o'zaklariga boruvchi yo'l va uning ikki tomonlama innervatsiya xususiyatlari.
   * **Ekstrapiramidal tizim traktlari:** *Tr. rubrospinalis* (Monakov), *tr. vestibulospinalis*, *tr. tectospinalis*, *tr. reticulospinalis*.
4. **Markaziy (Spastik) va Periferik (Slaviy) Falajliklar taqqosiy jadvali.**
5. **Klinik sindromlar:** Tabes dorsalis, siringomiyeliya, ALS (yon amiotrofik skleroz), Brown-Sequard gemiseksiyasi.

---

### 1. REFLEKTOR YOYI (*ARCUS REFLEXIVUS*) VA RETSEPTORLAR

Nerv tizimining barcha faoliyati reflekslar asosida amalga oshiriladi. Oddiy somatik refleks yoyi **3 ta neyrondan** tashkil topgan:

\`\`\`reflex_arc
[Somatik Refleks Yoyi - Somatic Reflex Arc Architecture]
 Teri/Pay Retseptori ──► Ganglion Spinale (1-Neyron, Psevdounipolyar)
                                   │
                                   ▼ (Radix Posterior orqali)
 Orqa Miya Orqa Shoxi: Interneyron (2-Neyron, Assotsiativ)
                                   │
                                   ▼
 Orqa Miya Oldingi Shoxi: Alfa/Gamma Motoneyron (3-Neyron, Efferent)
                                   │
                                   ▼ (Radix Anterior orqali)
 Skelet Muskuli (Effektor A'zo - Qisqarish!)
\`\`\`

1. **Retseptor:** Ta'sirlanishni qabul qilib, nerv impulsiga aylantiruvchi tuzilma (eksteroretseptorlar — teri; proprioretseptorlar — mushak urchug'i va Golji pay a'zosi; interoretseptorlar — ichki a'zolar).
2. **Afferent (sezuvchi) neyron:** Tanasi spinal tugunda (*ganglion spinale*) joylashgan soxta bir qutbli (psevdounipolyar) neyron.
3. **Assotsiativ (oraliq) neyron:** Orqa miya orqa shoxida yotadi, impulslarni motoneyronlarga yoki bosh miyaga uzatadi.
4. **Efferent (harakatlantiruvchi) neyron:** Orqa miya oldingi shoxidagi yirik multipolyar alfa va gamma motoneyronlar.
5. **Effektor:** Skelet mushagi yoki bez.
*(Eslatma: Tizza refleksi kabi cho'zilish reflekslari 2 neyronli monosinaptik refleks yoyiga ega)*.

---

### 2. SEZUVCHI (KO‘TARILUVCHI / AFFERENT) YO‘LLAR

Sezuvchi yo'llar tana retseptorlaridan impulslarni bosh miya po'stlog'i yoki miyachaga eltuvchi 3 neyronli zanjirlardir:

#### A. Og'riq va Harorat Sezgisi Yo'li (*Tractus spinothalamicus lateralis*)
* **1-neyron:** *Ganglion spinale* (spinal tugun).
* **2-neyron:** Orqa miya orqa shoxidagi xususiy o'zak (*nucleus proprius*, Rexed III-IV plastinkalari).
  * *Kesishuvi:* 2-neyron aksonlari markaziy kanal oldidagi **oldingi oq birikma (*commissura alba anterior*)** orqali 1–2 segment yuqorida **100% qarama-qarshi tomonga kesishadi** va qarama-qarshi tomonning yon tizimchasiga (*funiculus lateralis*) o'tib ko'tariladi (**Lemniscus spinalis**).
* **3-neyron:** Talamusning **Ventroposterolateral o'zagi (VPL)**.
  * Uning aksonlari *capsula interna*ning orqa oyoqchasidan o'tib, *radiatio thalami centralis* tarkibida **Gyrus postcentralis (3, 1, 2-maydonlar)** po'stlog'iga yetib boradi.

#### B. Ongli Propriosepsiya, Vibratsiya va Nozik Taktil Sezgi Yo'li (*Goll va Burdax yo'llari / Fasciculus gracilis et cuneatus*)
Mushak-bo'g'im sezgisi (oyoq-qo'llarning fazodagi holatini ko'z yumilganda ham bilish), tebranish, ikki nuqtani farqlash (diskriminatsiya) va stereognoz (narsalarni ushlab shaklini aniqlash).
* **1-neyron:** *Ganglion spinale*.
  * *O'ziga xosligi:* Aksonlari orqa miyaga kirib, kulrang moddada to'xtamasdan **orqa tizimcha (*funiculus posterior*)**da o'z tomonida to'g'ridan-to'g'ri yuqoriga ko'tariladi!
    * **Fasciculus gracilis (Goll dastasi):** Medialda yotadi, tana pastki qismi va oyoqlardan (Th5 dan pastki segmentlardan) keladi.
    * **Fasciculus cuneatus (Burdax dastasi):** Lateralda yotadi, tana yuqori qismi va qo'llardan (Th4 dan yuqori segmentlardan) keladi.
* **2-neyron:** Uzunchoq miya pastki orqa yuzasidagi **Nucleus gracilis** va **Nucleus cuneatus** o'zaklari.
  * *Kesishuvi:* Ularning aksonlari *fibrae arcuatae internae*ni hosil qilib, uzunchoq miyada qarama-qarshi tomonga kesishadi — **Decussatio lemnisci medialis (Medial halqa kesishuvi)**. So'ngra **Lemniscus medialis** bo'lib ko'prik va o'rta miya orqali ko'tariladi.
* **3-neyron:** Talamusning **VPL** o'zagi ➔ *Capsula interna* orqa oyoqchasi ➔ *Gyrus postcentralis*.

#### C. Miyachaga Boruvchi Ongsiz Proprioseptiv Yo'llar (Avtomatik muvozanat va harakat koordinatsiyasi)
1. **Tractus spinocerebellaris posterior (Flechsig orqa yo'li):**
   * 1-neyron: *Ganglion spinale*;
   * 2-neyron: Orqa miya ko'krak ustunidagi Klark o'zagi (*nucleus dorsalis Clark-Stilling*, C8–L2).
   * Tolalari **kesishmaydi**, o'z tomonining yon tizimchasida ko'tarilib, **pastki miyacha oyoqchasi (*pedunculus cerebellaris inferior*)** orqali miyacha chuvalchangiga kiradi.
2. **Tractus spinocerebellaris anterior (Gowers oldingi yo'li):**
   * 1-neyron: *Ganglion spinale*;
   * 2-neyron: Orqa shox oraliq-medial o'zagi.
   * *O'ziga xosligi:* Orqa miyada bir marta qarama-qarshi tomonga kesishadi, so'ngra o'rta miyaga chiqib, yuqori miya yelkasida (*velum medullare superius*) **ikkinchi marta qayta kesishadi** (jami 2 marta kesishuv!). **Yuqori miyacha oyoqchasi (*pedunculus cerebellaris superior*)** orqali o'z tomon miyachasiga yetib boradi.

---

### 3. HARAKATLANTIRUVCHI (TUSHUVCHI / EFFERENT) YO‘LLAR

#### A. Piramidal Tizim (*Tractus pyramidalis*)
Insonning barcha ixtiyoriy, ongli, nozik harakatlarini boshqaruvchi bosh motor yo'l:
* **1-neyron (Markaziy motoneyron):** *Gyrus precentralis* (4-maydon)ning V qavatidagi Betz gigant piramidal hujayralari.
* Aksonlari *corona radiata* bo'lib yig'ilib, **Ichki kapsula (*Capsula interna*)**ning **orqa oyoqchasi (*crus posterius*)** oldingi 2/3 qismidan o'tadi.
* Miya oyoqchasi asosi (*crus cerebri*) o'rta 3/5 qismidan, so'ngra ko'prik asosi orqali uzunchoq miya piramidalariga tushadi.
* **Piramidalar kesishuvi (*Decussatio pyramidum*):** Uzunchoq miyaning pastki chegarasida tolalarning **80–85% qarama-qarshi tomonga kesishadi** va orqa miya yon tizimchasiga o'tib, **Tractus corticospinalis lateralis** deb ataladi. Qolgan 15% tola kesishmasdan oldingi tizimchadan **Tractus corticospinalis anterior** sifatida tushadi (tana o'qi muskullariga).
* **2-neyron (Periferik motoneyron):** Orqa miya oldingi shoxining alfa-motoneyronlari (*Rexed IX plastinkasi*). Ularning aksonlari oldingi ildizcha (*radix anterior*) va spinal nervlar tarkibida skelet muskullariga boradi.

#### B. Kortikonuklear Yo'l (*Tractus corticonuclearis*)
* 1-neyron: Pretsentral burmaning pastki 1/3 qismi (yuz proyeksiyasi).
* *Capsula interna* **tizzasi (*genu*)** orqali o'tib, miya poyasidagi kranial nervlarning harakatlantiruvchi o'zaklariga (III, IV, V, VI, VII, IX, X, XI, XII) boradi.
* ⚠️ **MUHIM KLINIK QOIDA:** Deyarli barcha kranial motor o'zaklar har ikkala yarim shardan (ikki tomonlama kortikal innervatsiya) tola qabul qiladi. **FAKAT IKKITA IKKI ISTISNO MAVJUD:**
  1. **VII juft (N. facialis)ning pastki mimika muskullarini ta'minlovchi qismi:** Faqat qarama-qarshi yarim shardan innervatsiya oladi!
  2. **XII juft (N. hypoglossus)ning m. genioglossusni ta'minlovchi qismi:** Faqat qarama-qarshi yarim shardan innervatsiya oladi!
  *(Shu sababli bitta yarim shar insultida faqat pastki yuz qismi va til og'ishi kuzatiladi, peshona va qovoqlar esa saqlanib qoladi!)*.

#### C. Ekstrapiramidal Yo'llar (Avtomatlashgan motorika va tonus)
1. **Tractus rubrospinalis (Monakov yo'li):** O'rta miya qizil o'zagidan boshlanadi. Forel kesishmasida kesishib, orqa miyaga tushadi. Qo'l-oyoq fleksor (bukuvchi) muskullari tonusini kuchaytiradi.
2. **Tractus vestibulospinalis:** Uzunchoq miyadagi Deyters lateral dahliz o'zagidan boshlanadi. Ekstenzor (yozuvchi / antigravitatsion) muskullar tonusini oshiradi va gavdani tik saqlashni ta'minlaydi.
3. **Tractus tectospinalis:** To'rt tepalikdan boshlanib Maynert kesishmasida kesishadi. Kutilmagan tovush yoki yorug'likka javoban bosh-tanani burish startle refleksini boshqaradi.

---

### 4. 🩺 MARKAZIY VA PERIFERIK FALAJLIKLARNING KLINIK FARQLARI

| Klinik Ko'rsatkich | Markaziy Falaj (1-neyron / Po'stloq-Piramida zararlanishi) | Periferik Falaj (2-neyron / Oldingi shox-Periferik nerv zararlanishi) |
| :--- | :--- | :--- |
| **Mushaklar tonusi** | **Spastik gipertonus** ("qalamtarosh / buklama pichoq" fenomeni) | **Atoniya yoki Gipotoniya** (mushaklar bo'shashgan) |
| **Pay reflekslari** | **Giperrefleksiya** (pay reflekslari keskin oshgan), klonuslar | **Arefleksiya yoki Giporefleksiya** (reflekslar so'ngan) |
| **Mushaklar atrofiyasi** | Bo'lmaydi (yoki uzoq muddat harakatsizlikdan yengil gipotrofiya) | **Yaqqol erta atrofiyalar** (mushaklar so'lib qurib qoladi) |
| **Patologik reflekslar** | **Mavjud!** (Babinskiy, Rossolimo, Oppengeym, Gordon) | **Mutlaqo bo'lmaydi** |
| **Fassikulyatsiyalar** | Bo'lmaydi | **Mavjud bo'lishi mumkin** (mushak tolalarining ko'zga ko'rinib qaltirashi) |

---

### 5. 🩺 YUQORI BALLI USMLE KEYSLAR VA KLINIK SINDROMLAR

1. **Tabes Dorsalis (Orqa miya qurishi):**
   * Neyrozaxmda *funiculus posterior* (Goll va Burdax yo'llari) nobud bo'ladi. Bemor oyoqlari ostidagi zaminni sezmaydi, oyoqlarini baland ko'tarib tovon bilan yerga urib yuradi ("shtamplovchi yurish"). Ko'zini yumganda chayqalib yiqiladi (**Romberg sinamasi musbat**).
2. **Yon Amiotrofik Skleroz (ALS / Lou Gehrig kasalligi):**
   * Ham markaziy (Betz hujayralari va piramidal trakt), ham periferik (oldingi shox motoneyronlari) motoneyronlarning bir vaqtda progressiv degeneratsiyasi. Bemorlarda bir vaqtning o'zida spastiklik, giperrefleksiya va mushaklar atrofiyasi, fassikulyatsiyalar kuzatiladi.
3. **Siringomiyeliya (Syringomyelia):**
   * Orqa miya markaziy kanali kengayib, oldingi oq birikmani (*commissura alba anterior*) ezadi. Natijada *tr. spinothalamicus*ning kesishuvchi tolalari uziladi. Yelka va ko'krakda **og'riq va harorat sezgisining dissotsiyalangan yo'qolishi** kuzatiladi (bemor qo'lini issiq choynakka kuydirsa ham og'riq sezmaydi, lekin taktil sezgi saqlanadi).`,
      ru: `## ⚡ Проводящие пути спинного и головного мозга

* **Рефлекторная дуга:** Рецептор -> чувствительный нейрон спинномозгового узла -> вставочный нейрон заднего рога -> двигательный нейрон переднего рога -> эффектор (мышца).
* **Чувствительные (восходящие) пути:**
  * *Tractus spinothalamicus lateralis:* Путь боли и температуры. 1-й нейрон — спинной ганглий, 2-й — *nucleus proprius* заднего рога (100% перекрест в передней белой спайке), 3-й — VPL таламуса -> *gyrus postcentralis*.
  * Пути Голля и Бурдаха (*Fasciculus gracilis et cuneatus*): Сознательная проприоцепция, вибрация, стереогноз. Волокна идут в задних канатиках БЕЗ перекреста до продолговатого мозга. 2-й нейрон — ядра Голля и Бурдаха (перекрест медиальной петли), 3-й — VPL таламуса.
  * Спиномозжечковые пути: Флексига (задний — прямой) и Говерса (передний — двойной перекрест).
* **Двигательные (нисходящие) пути:**
  * Пирамидный тракт (*Tr. corticospinalis*): Клетки Беца -> колено/задняя ножка внутренней капсулы -> перекрест пирамид (85% латеральный, 15% передний) -> мотонейроны передних рогов.
  * Кортиконуклеарный тракт (*Tr. corticonuclearis*): Иннервация ядер ЧН (двусторонняя, кроме нижней половины лицевого нерва и подъязычного нерва!).
  * Экстрапирамидные пути: *rubrospinalis* (Монакова), *vestibulospinalis*, *tectospinalis*.
* **Сравнение центрального и периферического параличей:** Спастичность, гиперрефлексия, симптом Бабинского против атонии, атрофии и арефлексии.`,
      en: `## ⚡ Pathways of the Brain and Spinal Cord

* **Reflex Arc:** Receptor, primary pseudounipolar sensory neuron in DRG, interneuron in dorsal horn, alpha/gamma motor neuron in ventral horn, effector muscle.
* **Ascending (Sensory) Pathways:**
  * Lateral Spinothalamic Tract: Pain & temperature. 1st order in DRG, 2nd order in nucleus proprius (decussates at anterior white commissure 1-2 levels above entry), 3rd order in thalamic VPL -> postcentral gyrus.
  * Dorsal Column-Medial Lemniscal (DCML) System: Conscious proprioception, vibration, fine discriminatory touch. Gracilis (lower body/T5 down) & Cuneatus (upper body/T4 up). Ascends uncrossed in dorsal columns; 2nd order in medulla (internal arcuate fibers decussate as medial lemniscus); 3rd order in VPL -> cortex.
  * Spinocerebellar Tracts: Posterior (Flechsig, uncrossed, inferior peduncle) and Anterior (Gowers, double crossed, superior peduncle).
* **Descending (Motor) Pathways:**
  * Corticospinal (Pyramidal) Tract: Giant pyramidal Betz cells (Area 4) -> posterior limb of internal capsule -> crus cerebri -> pyramidal decussation (85% lateral tract, 15% anterior tract) -> anterior horn alpha motor neurons.
  * Corticonuclear (Corticobulbar) Tract: Genu of internal capsule -> cranial motor nuclei (bilateral innervation except contralateral lower CN VII and CN XII genioglossus).
  * Extrapyramidal Tracts: Rubrospinal (flexor tone), Vestibulospinal (extensor antigravity tone), Tectospinal (visual/auditory startle).
* **Upper vs Lower Motor Neuron Lesions:** Spasticity, hyperreflexia, Babinski sign (UMN) vs Flaccid paralysis, muscle wasting/atrophy, fasciculations (LMN).`
    },
    latinTerms: [
      "Arcus reflexivus (Refleks yoyi)",
      "Ganglion sensorium nervi spinalis (Spinal sezuvchi tugun)",
      "Tractus spinothalamicus lateralis (Yon orqa miya-talamus yo'li)",
      "Commissura alba anterior (Oldingi oq birikma)",
      "Lemniscus spinalis et medialis (Spinal va medial halqalar)",
      "Fasciculus gracilis Golli (Goll nozik dastasi)",
      "Fasciculus cuneatus Burdachi (Burdax pona dastasi)",
      "Nucleus gracilis et cuneatus (Goll va Burdax o'zaklari)",
      "Decussatio lemnisci medialis (Medial halqa kesishuvi)",
      "Tractus spinocerebellaris posterior Flechsigi (Orqa miya-miyacha orqa yo'li)",
      "Tractus spinocerebellaris anterior Gowersi (Orqa miya-miyacha oldingi yo'li)",
      "Tractus corticospinalis lateralis (Yon po'stloq-orqa miya yo'li)",
      "Tractus corticospinalis anterior (Oldingi po'stloq-orqa miya yo'li)",
      "Decussatio pyramidum (Piramidalar kesishuvi)",
      "Tractus corticonuclearis (Po'stloq-o'zak yo'li)",
      "Tractus rubrospinalis Monakowi (Qizil o'zak-orqa miya yo'li)",
      "Tractus vestibulospinalis (Dahliz-orqa miya yo'li)",
      "Tractus tectospinalis (Tom-orqa miya yo'li)"
    ],
    videos: [
      "https://www.youtube.com/watch?v=kYJvMOHp3L4",
      "https://www.youtube.com/watch?v=q84t_iR97qg"
    ]
  },
  {
    id: "sem_3_top_5",
    semester: 3,
    order: 5,
    defaultModelId: "spinal-nerve-brachial-plexus",
    terms: SEMESTER_3_GLOSSARY_TERMS.filter(t => t.topicOrder === 5),
    title: {
      uz: "5-Mavzu: Orqa miya nervlarining hosil bo‘lishi. Orqa tarmoqlari. Oldingi tarmoqlari. Qovurg‘alararo nervlar. Bo‘yin chigali",
      ru: "Тема 5: Формирование спинномозговых нервов. Задние и передние ветви. Межреберные нервы. Шейное сплетение",
      en: "Topic 5: Spinal Nerves Formation. Dorsal and Ventral Rami. Intercostal Nerves. Cervical Plexus"
    },
    theory: {
      uz: `## 🌿 Orqa Miya Nervlari (*Nervi Spinales*), Tarmoqlari va Bo‘yin Chigali (*Plexus Cervicalis*)

---

### 📌 MAVZU REJASI
1. **Orqa miya nervlarining hosil bo‘lishi (*Nervi spinales*):** 31 juft nerv segmentlari, oldingi (harakat) va orqa (sezuvchi) ildizchalar, spinal tugun (*ganglion spinale*).
2. **Spinal nervning 4 ta asosiy tarmog‘i:**
   * Orqa tarmoqlar (*rami posteriores*) — ensa va orqa avtoxton mushaklari;
   * Oldingi tarmoqlar (*rami anteriores*) — chigallar hosil bo'lishi;
   * Qo'shuvchi tarmoqlar (*rami communicantes albi et grisei*);
   * Parda tarmog'i (*ramus meningeus / sinuvertebralis*).
3. **Bo‘yin chigali (*Plexus cervicalis*, C1–C4):**
   * Topografiyasi va sintopiyasi;
   * Sezuvchi tarmoqlar (Erb nuqtasi — *punctum nervosum*);
   * Harakatlantiruvchi tarmoqlar va Bo'yin qovog'i (*Ansa cervicalis*);
   * Aralash nerv: **Diafragma nervi (*N. phrenicus*)** — topografiyasi va klinik frenikus-simptomi.
4. **Qovurg‘alararo nervlar (*Nn. intercostales*):** Qovurg'a egati topografiyasi (*V-A-N*), mushak va teri innervatsiyasi, dermatomlar (Th4 va Th10).
5. **Klinik korrelyatsiya:** Diafragma falaji, plevrit va perikarditda aks etuvchi og'riqlar, qovurg'alararo nevralgiya, Gerpes zoster (o'rab oluvchi temiratki).

---

### 1. ORQA MIYA NERVLARINING HOSIL BO‘LISHI VA TARMOQLANISHI

Inson tanasida orqa miya segmentlariga mos ravishda **31 juft aralash spinal nerv** shakllanadi:
* **8 juft bo'yin nervi (C1–C8)** *(Diqqat: 7 ta bo'yin umurtqasi bor, ammo 8 juft bo'yin nervi mavjud. C1 nerv ensa suyagi bilan I bo'yin umurtqasi atlas orasidan, C8 esa VII bo'yin umurtqasi bilan I ko'krak umurtqasi orasidan chiqadi)*;
* **12 juft ko'krak nervi (Th1–Th12)**;
* **5 juft bel nervi (L1–L5)**;
* **5 juft dumg'aza nervi (S1–S5)**;
* **1 juft dum nervi (Co1)**.

\`\`\`spinal_nerve
[Orqa Miya Nervining Hosil Bo'lishi - Spinal Nerve Formation]
  Orqa Shox (Sensory) ──► Radix Posterior (Sezuvchi Ildiz) ──┐
                                  ▲                           ├──► NERVUS SPINALIS (Aralash)
  Spinal Tugun (Ganglion) ────────┘                           │    (Foramen intervertebraledan chiqadi)
                                                              │
  Oldingi Shox (Motor) ──► Radix Anterior (Harakat Ildiz) ────┘
                                                              │
     ┌────────────────────────┬───────────────────────────────┴────────────────────────┐
     ▼                        ▼                                                        ▼
  Ramus Posterior          Ramus Anterior                                       Ramus Meningeus
  (Orqa mushak/teri)       (Chigallar va qovurg'alararo)                        (Qattiq pardaga)
                              │
                              └──► Rami communicantes (albi et grisei) ──► Truncus sympathicus
\`\`\`

#### Spinal Nerv Tarmoqlari:
1. **Orqa tarmoqlar (*Rami posteriores / dorsales*):** Umurtqa pog'onasining chuqur avtoxton mushaklarini (m. erector spinae, m. transversospinalis) va ensa hamda orqa soha terisini innervatsiya qiladi. C2 ning orqa tarmog'i — **Katta ensa nervi (*N. occipitalis major*)** ensa terisini sezuvchanligini ta'minlaydi (zararlansa ensa nevralgiyasi kelib chiqadi).
2. **Oldingi tarmoqlar (*Rami anteriores / ventrales*):** Tananing oldingi va yon yuzalari, ko'krak qafasi hamda oyoq-qo'llarni innervatsiya qiladi. Ko'krak sohasida segmentar bo'lib qolib **qovurg'alararo nervlar**ni hosil qiladi; boshqa sohalarda esa chigallarni (*plexus*) hosil qiladi:
   * Bo'yin chigali (*Plexus cervicalis* — C1–C4);
   * Yelka chigali (*Plexus brachialis* — C5–Th1);
   * Bel chigali (*Plexus lumbalis* — Th12–L4);
   * Dumg'aza chigali (*Plexus sacralis* — L4–S4);
   * Dum chigali (*Plexus coccygeus* — S5–Co1).
3. **Parda tarmog'i (*Ramus meningeus / nervus sinuvertebralis*):** Umurtqa kanali ichiga qaytib kirib, orqa miyaning qattiq pardasini, umurtqalararo disklarni va boylamlarni sezuvchi tola bilan ta'minlaydi.
4. **Qo'shuvchi tarmoqlar (*Rami communicantes*):**
   * *Ramus communicans albus (oq tarmoq):* Faqat Th1–L2 segmentlarida bo'lib, yon shoxdan chiquvchi preganglionar simpatik tolalarni simpatik ustunga olib boradi;
   * *Ramus communicans griseus (kulrang tarmoq):* Barcha 31 juft nervda mavjud bo'lib, postganglionar vegetativ tolalarni spinal nervga qaytaradi (tomirlar, ter bezlari va tuk ko'taruvchi mushaklar uchun).

---

### 2. BO‘YIN CHIGALI (*PLEXUS CERVICALIS*, C1–C4)

Bo'yin chigali yuqori 4 ta bo'yin nervining oldingi shoxlaridan (**C1–C4**) hosil bo'ladi. U bo'yinning chuqur mushaklarida (m. scalenus medius va m. levator scapulae ustida, to'sh-o'mrov-so'rg'ichsimon mushak orqasida) joylashgan.

#### A. Sezuvchi Tarmoqlari (Erb nuqtasi — *Punctum nervosum*):
Bu tarmoqlar m. sternocleidomastoideusning orqa qirrasining o'rta qismidan bitta nuqtadan teri ostiga chiqadi:
* **Kichik ensa nervi (*N. occipitalis minor*, C2–C3):** Quloq orqasi va ensa yon sohasi terisi;
* **Katta quloq suprasi nervi (*N. auricularis magnus*, C3):** Quloq suprasi va quloqoldi so'lak bezi ustidagi teri;
* **Bo‘yinning ko‘ndalang nervi (*N. transversus colli*, C2–C3):** Bo'yinning oldingi sohasi terisi (bo'yin osti sohasini ta'minlaydi);
* **O‘mrov usti nervlari (*Nn. supraclaviculares*, C3–C4):** Medial, o'rta va lateral tarmoqlar bo'lib o'mrov suyagi ustidan o'tib, yelka va ko'krak yuqori qismi terisini ta'minlaydi.

#### B. Harakatlantiruvchi (Muskulli) Tarmoqlari:
* Bo'yinning chuqur mushaklarini (oldingi va lateral to'g'ri mushaklar, uzun mushaklar, narvonsimon mushaklar) innervatsiya qiladi.
* **Bo'yin qovog'i (*Ansa cervicalis*):** C1 tolasidan hosil bo'lgan yuqori ildiz (*radix superior* — dastlab n. hypoglossus tarkibida yuradi) va C2–C3 tolalaridan hosil bo'lgan pastki ildiz (*radix inferior*) birlashuvidan hosil bo'ladi. U tilosti suyagidan pastdagi barcha 4 ta mushakni innervatsiya qiladi:
  1. *M. sternohyoideus*;
  2. *M. sternothyroideus*;
  3. *M. thyrohyoideus*;
  4. *M. omohyoideus*.

#### C. Aralash Tarmoq — Diafragma Nervi (*Nervus Phrenicus*, C3–C5):
* Eng muhim hayotiy tarmoq! C3, **C4** va C5 segmentlaridan boshlanadi (*"C3, 4, 5 keeps the diaphragm alive"*).
* **Yo'li:** Oldingi narvonsimon mushak (*m. scalenus anterior*) ustidan pastga tushadi, a. subclavia va v. subclavia orasidan ko'krak qafasiga kiradi. Mediastinum orqali perikard va o'pka plevrasi orasidan o'tib diafragmaga yetib boradi.
* **Innervatsiyasi:**
  * Harakatlantiruvchi: Diafragma mushagi (nafas olishning asosiy mushagi!);
  * Sezuvchi: Perikard, mediastinal va diafragmal plevra, jigar kapsulasi (Glisson kapsulasi) va o't pufagi pardalari.

---

### 3. QOVURG‘ALARARO NERVLAR (*NERVI INTERCOSTALES*)

Ko'krak spinal nervlarining oldingi shoxlari (**Th1–Th11**) qovurg'alararo nervlar, Th12 esa qovurg'aosti nervi (*n. subcostalis*) deb ataladi. Ular chigal hosil qilmay, segmentar yo'naladi.

* **Topografiyasi:** Qovurg'aning pastki qirrasidagi egatda (*sulcus costae*) yuqoridan pastga qarab **V-A-N** tartibida yotadi:
  * **V**ena intercostalis (eng yuqorida);
  * **A**rteria intercostalis (o'rtada);
  * **N**ervus intercostalis (eng pastda, shuning uchun plevral punksiya paytida nina har doim qovurg'aning YUQORI qirrasi bo'ylab kiritiladi!).
* **Innervatsiyasi:**
  * Muskulli: Qovurg'alararo tashqi va ichki muskullar, ko'krakning ko'ndalang mushagi, qorin devorining keng mushaklari va to'g'ri mushagi (*m. rectus abdominis*);
  * Sezuvchi: Ko'krak va qorin terisi, parietal plevra va parietal qorin parda (*peritoneum parietale*).
* **Klinik dermatomlar:**
  * **Th4 dermatom:** So'rg'ichlar chizig'i sathidagi teri;
  * **Th10 dermatom:** Kindik sohasi sathi;
  * **Th12–L1 dermatom:** Chov sohasi sathi.

---

### 4. KLINIK KORRELYATSIYA VA TIBBIY AMALIYOT

| Patologik Holat | Anatomik Sabab va Mexanizm | Klinik Ko'rinish |
| :--- | :--- | :--- |
| **Diafragma nervi falaji (*Phrenic nerve palsy*)** | Bo'yin jarrohligi, o'pka uchi raki (Pancoast) yoki travma oqibatida C3–C5 shikastlanishi | Rentgenografiyada diafragma gumbazining yuqoriga ko'tarilib qolishi, paradoksal nafas harakatlari, hansirash (*dyspnea*) |
| **Frenikus-simptom (Myussi belgisi)** | N. phrenicus o't pufagi va perikardni sezuvchi tola bilan ta'minlashi | O't pufagi (xoletsistit) yoki perikarditda m. sternocleidomastoideus oyoqchalari orasini bosganda kuchli og'riq |
| **Qovurg'alararo nevralgiya** | Umurtqa osteoxondrozi, sovqotish yoki nerv qisilishi | Qovurg'a bo'ylab o'q otgandek, nafas olganda va yo'talganda kuchayuvchi o'tkir sanchiqli og'riq |
| **Herpes Zoster (O'rab oluvchi temiratki)** | Suvchechak virusining spinal tugunda (*ganglion spinale*) yashirinib yotib faollashishi | Bir tomonlama qovurg'alararo dermatom bo'ylab pufakchali toshmalar va chidab bo'lmas nevropatik og'riq |
| **Plevral punksiya qoidasi** | V-A-N dastasining qovurg'a pastki chetida joylashuvi | Qon tomir va nervni jarohatlamaslik uchun nina faqat qovurg'aning yuqori qirrasi bo'ylab kiritiladi |`,
      ru: `## 🌿 Спинномозговые нервы (*Nervi spinales*), ветви и Шейное сплетение (*Plexus cervicalis*)

---

### 📌 ПЛАН ТЕМЫ
1. **Формирование спинномозговых нервов:** 31 пара сегментов, передний (двигательный) и задний (чувствительный) корешки, спинальный ганглий.
2. **4 главные ветви спинномозгового нерва:**
   * Задние ветви (*rami posteriores*);
   * Передние ветви (*rami anteriores*) — формирование сплетений;
   * Соединительные ветви (*rami communicantes*);
   * Менингеальная ветвь (*ramus meningeus*).
3. **Шейное сплетение (*Plexus cervicalis*, C1–C4):**
   * Чувствительные ветви (Точка Эрба): *n. occipitalis minor, n. auricularis magnus, n. transversus colli, nn. supraclaviculares*;
   * Двигательные ветви и Шейная петля (*Ansa cervicalis*);
   * Смешанный нерв: **Диафрагмальный нерв (*N. phrenicus*)** и френикус-симптом.
4. **Межреберные нервы (*Nn. intercostales*):** Топография борозды ребра (сосудисто-нервный пучок V-A-N), дерматомы Th4 (соски) и Th10 (пупок).
5. **Клинические корреляции:** Повреждение диафрагмального нерва, плевральная пункция, опоясывающий лишай (*Herpes Zoster*).`,
      en: `## 🌿 Spinal Nerves Formation, Branches, and Cervical Plexus (*Plexus Cervicalis*)

---

### 📌 TOPIC OUTLINE
1. **Spinal Nerve Formation:** 31 pairs from dorsal (sensory) and ventral (motor) roots meeting at the intervertebral foramen.
2. **Four Primary Branches:**
   * Dorsal rami (intrinsic back muscles & skin);
   * Ventral rami (plexuses and intercostal nerves);
   * Meningeal branch;
   * Communicating rami (white and gray rami communicantes).
3. **Cervical Plexus (C1–C4):**
   * Cutaneous branches (Erb's point: Lesser occipital, Great auricular, Transverse cervical, Supraclavicular nerves);
   * Motor branches & Ansa Cervicalis (infrahyoid muscles);
   * Mixed nerve: **Phrenic Nerve (*N. phrenicus*, C3–C5)** innervating the diaphragm, pericardium, and mediastinal pleura.
4. **Intercostal Nerves:** Subcostal groove anatomy (V-A-N order: Vein, Artery, Nerve), dermatomes T4 (nipple) and T10 (umbilicus).
5. **Clinical Correlations:** Phrenic nerve injury, pleural tap safety guidelines, herpes zoster dermatomal neuralgia.`
    },
    latinTerms: [
      "Nervi spinales (Orqa miya nervlari)",
      "Radix posterior et anterior (Orqa va oldingi ildizchalar)",
      "Ganglion spinale (Orqa miya tuguni)",
      "Plexus cervicalis (Bo'yin chigali)",
      "Nervus phrenicus (Diafragma nervi)",
      "Ansa cervicalis (Bo'yin qovog'i)",
      "Nervus occipitalis major et minor (Katta va kichik ensa nervlari)",
      "Nervi intercostales (Qovurg'alararo nervlar)",
      "Punctum nervosum (Erb nerv nuqtasi)"
    ],
    videos: [
      "https://www.youtube.com/watch?v=q84t_iR97qg"
    ]
  },
  {
    id: "sem_3_top_6",
    semester: 3,
    order: 6,
    defaultModelId: "brachial-plexus-ubc",
    terms: SEMESTER_3_GLOSSARY_TERMS.filter(t => t.topicOrder === 6),
    title: {
      uz: "6-Mavzu: Yelka chigalining uzun va kalta tarmoqlari",
      ru: "Тема 6: Длинные и короткие ветви плечевого сплетения",
      en: "Topic 6: Short and Long Branches of the Brachial Plexus"
    },
    theory: {
      uz: `## 💪 Yelka Chigali (*Plexus Brachialis*): Kalta va Uzun Tarmoqlari

---

### 📌 MAVZU REJASI
1. **Yelka chigalining hosil bo‘lishi va bosqichlari:** 5 ta bosqich (Ildizlar C5–Th1, Ustunlar, Bo'linmalar, Dastalar, Periferik nervlar), narvonlararo bo'shliq (*spatium interscalenum*).
2. **Kalta tarmoqlari (*Pars supraclavicularis et infraclavicularis*):**
   * *N. dorsalis scapulae, N. thoracicus longus* (Bell nervi — qanotsimon kurak);
   * *N. suprascapularis, N. subclavius, Nn. subscapulares, N. thoracodorsalis*;
   * *Nn. pectorales medialis et lateralis*;
   * **Nervus axillaris:** *Foramen quadrilaterum* topografiyasi, deltasimon mushak va yelka suyagi jarrohlik bo'yni sinishlari.
3. **Uzun tarmoqlari (*Pars infraclavicularis*):**
   * **N. musculocutaneus:** Yelka oldingi bukurchi muskullari, *n. cutaneus antebrachii lateralis*;
   * **N. medianus:** Karpal kanal topografiyasi, thenar muskullari, CTS sindromi, "Maymun qo'li" va "Benedikt panjasi";
   * **N. ulnaris:** Guyon kanali, suyaklararo muskullar, Froment belgisi, "Qarg'a / Panjasimon qo'l" (*claw hand*);
   * **N. radialis:** *Canalis humeromuscularis* (spiral kanal), barcha yozuvchilar, "Osilib qolgan panja" (*wrist drop*);
   * *Nn. cutanei brachii et antebrachii mediales*.
4. **Klinik sindromlar va USMLE Keyslar:** Erb-Dyushen falaji ("ofitsiant choypuli holati"), Klyumpke falaji (total claw hand + Horner sindromi), qanotsimon kurak (*scapula alata*).

---

### 1. YELKA CHIGALINING SHAKLLANISHI VA TOPOGRAFIK BOSQICHLARI

Yelka chigali pastki 4 ta bo'yin nervi va I ko'krak nervining oldingi shoxlari (**C5–C8, Th1**) birlashuvidan hosil bo'ladi. Anatomiyada yodlash mnemonikasi: **R**andy **T**ravis **D**rinks **C**old **B**eer (**R**oots ➔ **T**runks ➔ **D**ivisions ➔ **C**ords ➔ **B**ranches):

\`\`\`brachial_plexus
[Yelka Chigali Strukturasi - Brachial Plexus Layout]
  C5 ──┐
       ├── Truncus Superior (C5-C6) ──┬── Fasciculus Lateralis ──► N. Musculocutaneus
  C6 ──┘                              │                           └──► Radix lat. n. mediani
  C7 ───── Truncus Medius (C7) ───────┼── Fasciculus Posterior ──► N. Axillaris
  C8 ──┐                              │                           └──► N. Radialis
       ├── Truncus Inferior (C8-Th1) ─┴── Fasciculus Medialis  ──► N. Ulnaris
  Th1 ─┘                                                          └──► Radix med. n. mediani
\`\`\`

1. **Roots (Ildizlar):** C5, C6, C7, C8, Th1 oldingi shoxlari. Bo'yinning narvonlararo oralig'idan (*spatium interscalenum* — oldingi va o'rta narvonsimon mushaklar orasidan a. subclavia bilan birga) o'tadi.
2. **Trunks (3 ta poya / ustun):**
   * *Truncus superior:* C5 va C6 qo'shilishidan;
   * *Truncus medius:* C7 ning bevosita davomi;
   * *Truncus inferior:* C8 va Th1 qo'shilishidan.
3. **Divisions (Bo'linmalar):** Har bir poya o'mrov suyagi orqasida oldingi (*anterior*) va orqa (*posterior*) bo'limlarga ajraladi (jami 6 ta bo'linma).
4. **Cords (3 ta tutam / dasta):** Qo'ltiq osti arteriyasiga (*a. axillaris*) nisbatan joylashuviga ko'ra nomlanadi:
   * *Fasciculus lateralis:* Superior va medius poyalarning oldingi bo'linmalaridan;
   * *Fasciculus medialis:* Inferior poyaning oldingi bo'linmasidan;
   * *Fasciculus posterior:* Barcha 3 ta poyaning (superior, medius, inferior) ORQA bo'linmalari qo'shilishidan hosil bo'ladi.

---

### 2. YELKA CHIGALINING KALTA TARMOQLARI

* **N. dorsalis scapulae (C5):** Rombsimon mushaklar (*mm. rhomboidei*) va kurakni ko'taruvchi mushakni (*m. levator scapulae*) innervatsiya qiladi.
* **N. thoracicus longus (C5–C7, Bell nervi):** Oldingi tishisimon mushakni (*m. serratus anterior*) innervatsiya qiladi. Zararlanganda kurak qovurg'alarga yopishmay orqaga bo'rtib chiqadi — **Qanotsimon kurak (*Scapula alata*)**.
* **N. suprascapularis (C5–C6):** Kurak usti va osti chuqurchasidagi mushaklarni (*m. supraspinatus, m. infraspinatus*) innervatsiya qiladi.
* **Nn. subscapulares (C5–C6):** Kurakosti mushagi (*m. subscapularis*) va katta yumaloq mushakni (*m. teres major*) ta'minlaydi.
* **N. thoracodorsalis (C6–C8):** Yopqich mushak — orqaning eng keng mushagini (*m. latissimus dorsi*) innervatsiya qiladi.
* **Nn. pectorales medialis et lateralis:** Katta va kichik ko'krak mushaklarini (*m. pectoralis major et minor*) ta'minlaydi.
* **Nervus axillaris (C5–C6, orqa tutamdan):**
  * *Topografiyasi:* To'rtburchak teshikdan (*foramen quadrilaterum* — a. circumflexa humeri posterior bilan birga) o'tib deltasimon mushak tagiga boradi.
  * *Innervatsiyasi:* Deltasimon mushak (*m. deltoideus*), kichik yumaloq mushak (*m. teres minor*) va deltasimon soha terisi (*n. cutaneus brachii lateralis superior*).
  * *Klinikasi:* Yelka suyagi jarrohlik bo'yni singanda (*fractura colli chirurgici humeri*) yoki yelka bo'g'imi chiqishida jarohatlanadi -> qo'lni gorizontal holatgacha ko'tarish (abduksiya) butunlay yo'qoladi!

---

### 3. YELKA CHIGALINING UZUN TARMOQLARI

#### A. Muskul-teri nervi (*Nervus Musculocutaneus*, C5–C7):
* Lateral tutamdan boshlanadi. Tumshuqsimon-yelka mushagini (*m. coracobrachialis*) teshib o'tadi.
* **Motor:** Yelkaning oldingi guruhi — barcha bukurchi mushaklari (*m. biceps brachii, m. brachialis, m. coracobrachialis*).
* **Sezuvchi:** Bilak lateral yuzasi terisi (**N. cutaneus antebrachii lateralis**).
* **Klinikasi:** Tirsak bo'g'imida bukish va bilakni supinatsiya qilish keskin kuchsizlanadi, biseps refleksi so'nadi.

#### B. O‘rta nerv (*Nervus Medianus*, C5–Th1):
* Lateral va medial tutamlarning ikkita ildizchasi qo'shilishidan a. axillaris oldida "vilka" shaklida hosil bo'ladi.
* **Topografiyasi:** Bilakda *sulcus medianus*da yotadi. Kaftga **karpal kanal (*canalis carpi*)** orqali egiluvchilarning paylari bilan birga o'tadi.
* **Motor:** Bilakning oldingi guruh deyarli barcha bukurchilari (m. flexor carpi ulnaris va m. flexor digitorum profundusning medial yarmidan tashqari!); kaftda thenar muskullari (bosh barmoqni qarama-qarshi qo'yuvchi *m. opponens pollicis*, kaltak bukurchi, uzoqlashtiruvchi) hamda I–II chuvalchangsimon mushaklar.
* **Sezuvchi:** Kaftning radial yarmi va I, II, III hamda IV barmoqning radial yarmidagi kaft terisi.
* **Klinikasi:**
  * **Karpal tunnel sindromi (CTS):** Bilak bo'g'imida nerv qisilib, tungi paresteziyalar va og'riqlar, thenar gipotrofiyasi.
  * **"Maymun qo'li" (*Ape hand*):** Bosh barmoq boshqa barmoqlar bilan bitta tekislikka tushib qoladi (opponens harakati yo'qoladi).
  * **"Benedikt qo'li" (*Hand of benediction*):** Musht tugishga uringanda I, II va III barmoqlar bukilmay qoladi.

#### C. Tirsak nervi (*Nervus Ulnaris*, C8–Th1):
* Medial tutamdan boshlanadi. Yelka sohasida shox bermaydi.
* **Topografiyasi:** Tirsak suyagining medial o'simtasi orqasidagi egatda (*sulcus nervi ulnaris*) yotadi (teri ostida yotgani uchun oson jarohatlanadi). Bilakda *sulcus ulnaris*da, kaftga esa **Guyon kanali (*canalis carpi ulnaris*)** orqali kiradi.
* **Motor:** *M. flexor carpi ulnaris*, *m. flexor digitorum profundus* (IV-V barmoqlarga boruvchi qismi), gipothenar barcha mushaklari, barmoqlarni yaqinlashtiruvchi va uzoqlashtiruvchi barcha suyaklararo mushaklar (**mm. interossei palmares et dorsales**), bosh barmoqni yaqinlashtiruvchi mushak (*m. adductor pollicis*).
* **Sezuvchi:** Kaft va qo'l orqa yuzasining ulnar qismi: V barmoq butunlay va IV barmoqning ulnar yarmi terisi.
* **Klinikasi:**
  * **"Qarg'a / Panjasimon panja" (*Claw hand / Main en griffe*):** Suyaklararo mushaklar falajlanib, asosiy falangalar giperekstenziyada, distal falangalar esa fleksiya holatida qotib qoladi.
  * **Froment belgisi:** Qog'oz varag'ini bosh va ko'rsatkich barmoq orasida ushlab qolishga uringanda m. adductor pollicis ishlamagani uchun bemor majburan bosh barmoqning distal falangasini bukadi (n. medianus innervatsiya qiluvchi m. flexor pollicis longus evaziga).

#### D. Bilak nervi (*Nervus Radialis*, C5–Th1):
* Orqa tutamning eng yirik davomi.
* **Topografiyasi:** Yelka suyagini spiral shaklda aylanib o'tuvchi yelka-mushak kanalida (**Canalis humeromuscularis / canalis spiralis**) a. profunda brachii bilan birga yotadi.
* **Motor:** Qo'lning barcha orqa yozuvchi mushaklari: yelkaning uch boshli mushagi (*m. triceps brachii*), tirsak mushagi, bilakning barcha yozuvchilari (*m. extensor carpi radialis longus/brevis, m. extensor digitorum, m. extensor carpi ulnaris*) va supinator.
* **Sezuvchi:** Yelka va bilakning orqa yuzasi terisi, qo'l panjasining orqa yuzasidagi radial soha (I, II va III barmoqning proksimal qismi terisi).
* **Klinikasi:**
  * Yelka suyagi diafizining o'rta 1/3 qismi singanda kanalda uziladi yoki bosiladi.
  * **"Osilib qolgan panja" (*Wrist drop*):** Qo'l panjasini va barmoqlarni yozish mutlaqo mumkin bo'lmaydi, qo'l pastga osilib qoladi, triseps refleksi so'nadi ("shanba oqshomi falaji" / qo'ltiqtayoq falaji).

---

### 4. YELKA CHIGALINING INTEGRAL KLINIK SINDROMLARI

| Sindrom | Shikastlangan Segment | Patogenez va Mexanizm | Tashqi Ko'rinish va Belgilar |
| :--- | :--- | :--- | :--- |
| **Erb-Dyushen falaji (*Erb-Duchenne palsy*)** | **Yuqori poya (C5–C6)** | Tug'ruq travmasi (bosh va yelkaning haddan tashqari tortilishi) yoki mototsikl halokati | **"Ofitsiant choypuli oluvchi qo'li" (*Waiter's tip hand*):** Qo'l adduksiyada, medial rotatsiyada, tirsakda yozilgan va pronatsiyada turadi |
| **Klyumpke falaji (*Klumpke palsy*)** | **Pastki poya (C8–Th1)** | Balandlikdan qulaganda bir qo'l bilan shoxga osilib qolish, chaqaloqni qo'lidan kuchli tortish | **Total panjasimon qo'l (*Total claw hand*):** Kaftning barcha ichki mushaklari falaji + Th1 simpatik tolalari zararlanishi tufayli **Horner sindromi** (ptoz, mioz, endoftalm) |
| **Karpal tunnel sindromi** | **N. medianus (karpal kanalda)** | Kompyuterda ko'p ishlash, homiladorlik, gipotireoz, bilak fleksorlari sinoviti | Tungi vaqtda I–III barmoqlarning uvishishi, Tinel va Phalen testlari musbat, thenar atrofiyasi |
| **Kubital kanal sindromi** | **N. ulnaris (tirsak sohasida)** | Tirsakni uzoq vaqt stolga tirab o'tirish, tirsak sinishlari | V va IV barmoqlarda paresteziya, mushtni to'liq qisa olmaslik, Froment testi musbat |`,
      ru: `## 💪 Плечевое сплетение (*Plexus brachialis*): Короткие и длинные ветви

---

### 📌 ПЛАН ТЕМЫ
1. **Строение плечевого сплетения:** Корешки C5–Th1, 3 ствола (верхний, средний, нижний), разделы и 3 пучка (латеральный, медиальный, задний).
2. **Короткие ветви:**
   * *N. thoracicus longus* (иннервация *m. serratus anterior* — симптом крыловидной лопатки);
   * *N. axillaris* (проходит через *foramen quadrilaterum*, иннервирует *m. deltoideus*, повреждается при переломе хирургической шейки плеча).
3. **Длинные ветви:**
   * **N. musculocutaneus:** Передние сгибатели плеча (*m. biceps brachii*);
   * **N. medianus:** Карпальный канал, сгибатели кисти, "обезьянья кисть", "рука благословения";
   * **N. ulnaris:** Борозда локтевого нерва, канал Гийона, межкостные мышцы, "когтеточкообразная кисть" (*claw hand*);
   * **N. radialis:** Спиральный канал плеча, разгибатели руки, симптом "висячей кисти" (*wrist drop*).
4. **Клинические синдромы:** Паралич Эрба-Дюшенна ("рука просящего чаевые"), паралич Клюмпке (симптом Горнера + тотальная когтистая кисть).`,
      en: `## 💪 Brachial Plexus (*Plexus Brachialis*): Short and Long Branches

---

### 📌 TOPIC OUTLINE
1. **Structure of the Brachial Plexus:** C5–T1 roots, 3 trunks, 6 divisions, and 3 cords (lateral, medial, posterior).
2. **Short Branches:**
   * *Long thoracic nerve* (innervates serratus anterior; injury causes winged scapula);
   * *Axillary nerve* (passes through quadrangular space, innervates deltoid and teres minor, fractured surgical neck of humerus).
3. **Long Terminal Branches:**
   * **Musculocutaneous nerve:** Anterior arm flexors and lateral antebrachial cutaneous nerve;
   * **Median nerve:** Carpal tunnel, thenar muscles, ape hand deformity, carpal tunnel syndrome;
   * **Ulnar nerve:** Cubital tunnel, Guyon's canal, intrinsic hand muscles, claw hand deformity, Froment's sign;
   * **Radial nerve:** Radial groove, triceps and all forearm extensors, wrist drop.
4. **Clinical Syndromes:** Erb-Duchenne palsy (waiter's tip deformity), Klumpke's palsy (claw hand with Horner's syndrome).`
    },
    latinTerms: [
      "Plexus brachialis (Yelka chigali)",
      "Nervus axillaris (Qo'ltiq nervi)",
      "Nervus musculocutaneus (Muskul-teri nervi)",
      "Nervus medianus (O'rta nerv)",
      "Nervus ulnaris (Tirsak nervi)",
      "Nervus radialis (Bilak nervi)",
      "Nervus thoracicus longus (Uzun ko'krak nervi)",
      "Canalis humeromuscularis (Yelka-mushak / spiral kanali)",
      "Canalis carpi (Karpal kanal)"
    ],
    videos: [
      "https://www.youtube.com/watch?v=F3xZ8TzGTrw"
    ]
  },
  {
    id: "sem_3_top_7",
    semester: 3,
    order: 7,
    defaultModelId: "human-nervous-system-full-body",
    terms: SEMESTER_3_GLOSSARY_TERMS.filter(t => t.topicOrder === 7),
    title: {
      uz: "7-Mavzu: Bel chigali. Dumg‘aza chigali",
      ru: "Тема 7: Поясничное сплетение. Крестцовое сплетение",
      en: "Topic 7: Lumbar Plexus. Sacral Plexus"
    },
    theory: {
      uz: `## 🦵 Bel Chigali (*Plexus Lumbalis*) va Dumg‘aza Chigali (*Plexus Sacralis*)

---

### 📌 MAVZU REJASI
1. **Bel chigali (*Plexus lumbalis*, Th12–L4):**
   * Skeletotopiyasi va sintopiyasi (*m. psoas major* qalinligida);
   * Kalta tarmoqlari (*n. iliohypogastricus, n. ilioinguinalis, n. genitofemoralis, n. cutaneus femoris lateralis*);
   * **Yopqich nerv (*N. obturatorius*):** *Canalis obturatorius*, adduktor muskullar;
   * **Son nervi (*N. femoralis*):** *Lacuna musculorum*, to'rt boshli mushak, tizza refleksi va **Yashirin nerv (*N. saphenus*)**.
2. **Dumg‘aza chigali (*Plexus sacralis*, L4–S4):**
   * *Truncus lumbosacralis*, nok usti va osti teshiklari (*foramen suprapiriforme et infrapiriforme*);
   * Kalta tarmoqlari: *N. gluteus superior* (Trendelenburg belgisi), *N. gluteus inferior, N. pudendus* (Alkok kanali, sfinkterlar);
   * **O‘tirg‘ich nervi (*N. ischiadicus*):** Topografiyasi, son orqa bukurchi muskullari.
3. **O'tirg'ich nervining terminal shoxlari:**
   * **Katta boldir nervi (*N. tibialis*):** Boldir orqa muskullari, oyoq tagi nervlari (*nn. plantares*), Axill refleksi;
   * **Umumiy kichik boldir nervi (*N. fibularis communis*):** Fibula bo'yni topografiyasi, yuza va chuqur shoxlari, "Ot yurishi" / panja osilib qolishi (*foot drop*).
4. **Klinik korrelyatsiya va USMLE Pearls:** Meralgia paraesthetica, disk churrasi va ishias (Lasegue sinamasi), Trendelenburg testi, fibula bo'yni travmasi.

---

### 1. BEL CHIGALI (*PLEXUS LUMBALIS*, Th12–L4)

Bel chigali XII ko'krak nervi oldingi shoxining bir qismi hamda I, II, III va IV bel spinal nervlari oldingi shoxlaridan (**Th12–L4**) hosil bo'ladi.

#### A. Topografiyasi:
Katta bel mushagi (*m. psoas major*) qalinligida, bel umurtqalari ko'ndalang o'simtalari oldida joylashgan. Tarmoqlar bu mushakning lateral, medial qirralaridan va oldingi yuzasini teshib chiqadi.

\`\`\`lumbar_plexus
[Bel Chigali Asosiy Tarmoqlari - Lumbar Plexus Layout]
  Th12-L1 ──► N. Iliohypogastricus (Qovusti sohasi)
  L1      ──► N. Ilioinguinalis (Chov kanali)
  L1-L2   ──► N. Genitofemoralis (Kremaster refleksi)
  L2-L3   ──► N. Cutaneus femoris lateralis (Son lateral terisi)
  L2-L4   ──► N. Obturatorius (Adduktorlar)
  L2-L4   ──► NERVUS FEMORALIS (To'rt boshli mushak va N. saphenus)
\`\`\`

#### B. Tarmoqlari:
1. **Yonbosh-ostki qorin nervi (*N. iliohypogastricus*, Th12–L1):** Qorin keng mushaklari va qov usti sohasining terisini innervatsiya qiladi.
2. **Yonbosh-chov nervi (*N. ilioinguinalis*, L1):** Chov kanalidan o'tib, chov sohasi, yorg'oq / katta jinsiy lablar terisini ta'minlaydi.
3. **Jinsiy-son nervi (*N. genitofemoralis*, L1–L2):** *M. psoas major*ni old tomondan teshib chiqadi:
   * *Ramus genitalis:* Urug' tizimchasi orqali o'tib, moyakni ko'taruvchi mushakni (*m. cremaster*) innervatsiya qiladi (**kremaster refleksi**);
   * *Ramus femoralis:* Son yuqori qismi terisini ta'minlaydi.
4. **Sonning lateral teri nervi (*N. cutaneus femoris lateralis*, L2–L3):** Spina iliaca anterior superior yonidan o'tib sonning lateral yuzasi terisini innervatsiya qiladi. Qisilishi **Bernhardt-Rot kasalligi (*Meralgia paraesthetica*)** deb ataladi (tor kiyim yoki semizlikda son yonida yonish va uvishish).
5. **Yopqich nerv (*N. obturatorius*, L2–L4):**
   * Kichik chanoqdan yopqich kanal (*canalis obturatorius*) orqali songa chiqadi.
   * **Innervatsiyasi:** Sonning barcha yaqinlashtiruvchi (adduktor) mushaklari (*m. adductor longus, brevis, magnus, m. gracilis, m. pectineus*).
6. **Son nervi (*Nervus Femoralis*, L2–L4):**
   * Bel chigalining eng yirik nervi!
   * Chanoqdan songa mushak bo'shlig'i (**Lacuna musculorum**) orqali *m. iliopsoas* bilan birga o'tadi (tomirlar bo'shlig'idan arcus iliopectineus bilan ajralgan).
   * **Motor:** Sonning to'rt boshli mushagi (*m. quadriceps femoris* — tizzani yozuvchi asosiy mushak!) va tikuvchilar mushagi (*m. sartorius*).
   * **Sezuvchi:** Son oldingi yuzasi terisi va uning eng uzun terminal shoxi — **Yashirin nerv (*Nervus Saphenus*)**. N. saphenus *canalis adductorius* (Gunter kanali) orqali boldirga tushib, boldir va oyoq panjasining medial yuzasi terisini bosh barmoqqacha ta'minlaydi.
   * **Klinikasi:** Tizza bo'g'imini yozish mumkin bo'lmay qoladi, zina bo'ylab ko'tarilish qiyinlashadi, patellyar (tizza) refleksi so'nadi.

---

### 2. DUMG‘AZA CHIGALI (*PLEXUS SACRALIS*, L4–S4)

Dumg‘aza chigali bel-dumg'aza poyasi (**Truncus lumbosacralis — L4, L5**) hamda dumg'aza spinal nervlarining (**S1–S4**) oldingi shoxlaridan hosil bo'ladi. U kichik chanoqda, noksimon mushak (*m. piriformis*) oldingi yuzasida uchburchak shaklda yotadi.

#### A. Kalta Tarmoqlari:
* **N. gluteus superior (L4–S1):** Nok usti teshigidan (*foramen suprapiriforme*) chiqadi. O'rta va kichik quymich mushaklarini (*m. gluteus medius et minimus*) va sonning keng fassiyasini taranglovchi mushakni ta'minlaydi.
  * **Trendelenburg belgisi:** Ushbu nerv shikastlanganda bemor zararlangan oyoqda turganda chanog'i sog'lom tomonga pastga qulab tushadi (chunki o'rta quymich mushagi chanoqni gorizontal ushlab tura olmaydi — "o'rdak yurish").
* **N. gluteus inferior (L5–S2):** Nok osti teshigidan (*foramen infrapiriforme*) chiqadi. Katta quymich mushagini (*m. gluteus maximus*) innervatsiya qiladi (zinadan chiqishda va o'tirgan joydan turishda sonni kuchli yozadi).
* **N. pudendus (Uyali nerv, S2–S4):** Foramen infrapiriforme orqali chanoqdan chiqib, oraliq sohasiga Alkok kanali (*canalis pudendalis*) orqali qaytib kiradi. Oraliq mushaklari, tashqi sfinkterlar (siydik chiqaruvchi kanal va orqa chiqaruv yo'li tashqi sfinkteri) hamda tashqi jinsiy a'zolarni sezuvchi va harakatlantiruvchi tola bilan ta'minlaydi.

#### B. Uzun Tarmoqlari — O‘tirg‘ich Nervi (*Nervus Ischiadicus*, L4–S3):
* Inson tanasidagi **eng yo'g'on va eng uzun nerv** (diametri 1.5–2 sm gacha).
* **Topografiyasi:** Kichik chanoqdan nok osti teshigi (*foramen infrapiriforme*) orqali a. glutea inferior bilan birga chiqadi. Katta quymich mushagi ostidan sonning orqa yuzasiga o'tadi.
* **Innervatsiyasi:** Sonning orqa guruhi — tizzani bukurchi barcha mushaklar (*m. biceps femoris, m. semitendinosus, m. semimembranosus*).
* Tizzaosti chuqurchasining yuqori burchagida 2 ta yirik terminal shoxga ajraladi:
  1. **Nervus Tibialis (Katta boldir nervi);**
  2. **Nervus Fibularis / Peroneus communis (Umumiy kichik boldir nervi).**

---

### 3. O‘TIRG‘ICH NERVINING TERMINAL SHOXLARI

#### A. Katta boldir nervi (*Nervus Tibialis*, L4–S3):
* Tizzaosti chuqurchasida eng yuzada (N-V-A tartibida: nerv, vena poplitea, arteria poplitea) yotadi.
* Boldirda boldir-taqim kanali (**Canalis cruropopliteus / Gruberi kanali**) orqali o'tib, medial to'piq orqasidan oyoq tagiga o'tadi.
* **Motor:** Boldirning orqa guruhi — barcha biquvchi mushaklari: boldirning uch boshli mushagi (*m. triceps surae* — kalla va oyoq uchida turishni ta'minlaydi), chuqur bukurchilar (*m. flexor digitorum longus, m. flexor hallucis longus, m. tibialis posterior*); oyoq tagida medial va lateral oyoq tagi nervlari (*nn. plantares medialis et lateralis*) bo'lib barcha oyoq tagi mushaklarini ta'minlaydi.
* **Sezuvchi:** Boldir orqa terisi (*n. cutaneus surae medialis*), tovon va oyoq tagi terisi butunlay.
* **Klinikasi:** Oyoq panjasini pastga bukish (plantar fleksiya) va oyoq uchida turish imkonsiz bo'lib qoladi. Axill refleksi so'nadi. Barmoqlar "tirnoqsimon panja" holatiga keladi.

#### B. Umumiy kichik boldir nervi (*Nervus Fibularis / Peroneus Communis*, L4–S2):
* Tizzaosti chuqurchasining lateral cheti bo'ylab yo'nalib, **kichik boldir suyagi bo‘yni (*collum fibulae*)** atrofini aylanib o'tadi. Bu sohada nerv faqat teri ostida yotadi va suyanchiqqa zich taqalgani uchun jarohatlarga o'ta moyil!
* Ikki shoxga bo'linadi:
  1. **Yuza kichik boldir nervi (*N. fibularis superficialis*):** Boldirning lateral mushaklarini (*m. fibularis longus et brevis*) innervatsiya qiladi (panjani pronatsiya qiladi) va oyoq panjasi orqa yuzasi terisini sezuvchanligini ta'minlaydi.
  2. **Chuqur kichik boldir nervi (*N. fibularis profundus*):** Boldirning oldingi mushaklarini innervatsiya qiladi (*m. tibialis anterior, m. extensor digitorum longus, m. extensor hallucis longus* — panjani va barmoqlarni yuqoriga yozuvchi muskullar). Sezuvchi tarmog'i I va II barmoqlar orasidagi oraliq terisini ta'minlaydi.
* **Klinikasi:**
  * Kichik boldir suyagi bo'yni singanda yoki gips siqib qo'yganda nerv uziladi.
  * **"Osilib qolgan panja" (*Foot drop*):** Oyoq panjasini yuqoriga dorsal yozish (dorsifleksiya) va eversiya yo'qoladi. Panja pastga osilib, ichkariga buralib qoladi.
  * **"Ot yurishi" (*Steppage gait / equine gait*):** Bemor yurganda oyog'ining panjasi yerga tegib sudrilmasligi uchun tizzasini baland ko'tarib qadam tashlashga majbur bo'ladi.

---

### 4. USMLE VA AMALIY TIBBIYOT JADVALI

| Nerv va Shikastlanish Joyi | Mexanizm va Sababi | Mushak Falaji | Sensor Yo'qotish va Tipik Deformatsiya |
| :--- | :--- | :--- | :--- |
| **N. Femoralis** (Chanoq ichi yoki chov churrasi) | Gematoma, chov operatsiyalari, chanoq sinishi | *M. quadriceps femoris* | Tizzani yoza olmaslik, patellyar refleks yo'qolishi, son oldi va boldir medial yuzi anesteziyasi |
| **N. Obturatorius** (Yopqich kanal) | Tug'ruq asoratlari, chanoq o'smalari | Son adduktorlari | Sonni yaqinlashtira olmaslik, oyoqni chalishtirish imkonsizligi |
| **N. Ischiadicus** (Nok osti teshigi) | Noto'g'ri dumbaga inyeksiya qilish, dumba chiqishi | Son orqa bukurchilari va tizzadan pastki barcha soha | Sonni bukish kuchsizlanadi, tizzadan pastdagi barcha harakatlar falajlanadi |
| **N. Tibialis** (Taqim chuqurchasi yoki to'piq orqasi) | Tizza chiqishi, Tarsal tunnel sindromi | *M. triceps surae*, barmoq bukurchilari | Panja va barmoqlarni bukish yo'qoladi, tovon va oyoq tagi uvishadi, "panjada tovon bilan yurish" |
| **N. Fibularis communis** (Fibula bo'yni) | Kichik boldir suyagi sinishi, qattiq gips | Panja yozuvchilari (*m. tibialis anterior*) | **"Foot drop" (osilib qolgan panja)**, ot yurishi (*steppage gait*), I-II barmoqlar oralig'i uvishishi |`,
      ru: `## 🦵 Поясничное (*Plexus lumbalis*) и Крестцовое (*Plexus sacralis*) сплетения

---

### 📌 ПЛАН ТЕМЫ
1. **Поясничное сплетение (Th12–L4):**
   * В толще *m. psoas major*;
   * *N. femoralis* (мышечная лакуна, четырехглавая мышца бедра, коленный рефлекс, *n. saphenus*);
   * *N. obturatorius* (запирательный канал, приводящие мышцы бедра).
2. **Крестцовое сплетение (L4–S4):**
   * *N. gluteus superior* (симптом Тренделенбурга);
   * *N. gluteus inferior* (большая ягодичная мышца);
   * *N. pudendus* (канал Алькока, сфинктеры промежности);
   * *N. ischiadicus* (седалищный нерв — самый крупный нерв человека).
3. **Ветви седалищного нерва:**
   * **N. tibialis:** Задняя группа мышц голени, подошвенные нервы, ахиллов рефлекс;
   * **N. fibularis communis:** Огибает шейку малоберцовой кости, свисающая стопа (*foot drop*), петушиная походка (*steppage gait*).`,
      en: `## 🦵 Lumbar Plexus (*Plexus Lumbalis*) and Sacral Plexus (*Plexus Sacralis*)

---

### 📌 TOPIC OUTLINE
1. **Lumbar Plexus (T12–L4):**
   * Formed within psoas major;
   * Femoral nerve (lacuna musculorum, quadriceps femoris, patellar reflex, saphenous nerve);
   * Obturator nerve (obturator canal, thigh adductors).
2. **Sacral Plexus (L4–S4):**
   * Superior gluteal nerve (Trendelenburg sign);
   * Inferior gluteal nerve (gluteus maximus);
   * Pudendal nerve (Alcock's canal, perineum & sphincters);
   * Sciatic nerve (largest nerve in the body).
3. **Terminal Branches of Sciatic Nerve:**
   * Tibial nerve (posterior compartment of leg, plantarflexion, Achilles reflex);
   * Common fibular nerve (winds around neck of fibula, foot drop, steppage gait).`
    },
    latinTerms: [
      "Plexus lumbalis (Bel chigali)",
      "Plexus sacralis (Dumg'aza chigali)",
      "Nervus femoralis (Son nervi)",
      "Nervus obturatorius (Yopqich nerv)",
      "Nervus saphenus (Yashirin nerv)",
      "Nervus ischiadicus (O'tirg'ich nervi)",
      "Nervus tibialis (Katta boldir nervi)",
      "Nervus fibularis / peroneus communis (Umumiy kichik boldir nervi)",
      "Nervus gluteus superior et inferior (Yuqori va pastki quymich nervlari)",
      "Nervus pudendus (Uyali nerv)"
    ],
    videos: [
      "https://www.youtube.com/watch?v=F3xZ8TzGTrw"
    ]
  },
  {
    id: "sem_3_top_8",
    semester: 3,
    order: 8,
    defaultModelId: "eye-anatomy-umcg",
    terms: SEMESTER_3_GLOSSARY_TERMS.filter(t => t.topicOrder === 8),
    title: {
      uz: "8-Mavzu: I, II, VIII juft bosh miya nervlari",
      ru: "Тема 8: I, II, VIII пары черепных нервов (Обонятельный, Зрительный, Преддверно-улитковый)",
      en: "Topic 8: Cranial Nerves I, II, and VIII (Olfactory, Optic, Vestibulocochlear)"
    },
    theory: {
      uz: `## 👃👀👂 I, II va VIII juft Bosh Miya Nervlari: Maxsus Sezgi A’zolari Nervlari

---

### 📌 MAVZU REJASI
1. **Kranial nervlarning umumiy xarakteristikasi va tola turlari:** SSA (Maxsus somatik afferent), SVA (Maxsus visseral afferent).
2. **I juft — Hid bilish nervlari (*Nervi olfactorii*):**
   * Retseptor neyronlar (regio olfactoria);
   * Fila olfactoria va *Lamina cribrosa* orqali o'tishi;
   * Hid bilish piyozchasi (*bulbus olfactorius*), trakti (*tractus olfactorius*) va po'stloq markazlari (*uncus*);
   * Klinikasi: Anosmiya, giposmiya, unsinat tutqanoqlar (*uncinate fits*).
3. **II juft — Ko‘ruv nervi (*Nervus opticus*):**
   * To'r parda (retina) 3 neyronli tuzilishi;
   * Ko'ruv nervi, ko'rish kanali (*canalis opticus*);
   * **Ko‘rish kesishmasi (*Chiasma opticum*)** va tolalarning qisman kesishuvi qonuniyati;
   * Ko'rish trakti (*tractus opticus*) va 3 ta po'stloqosti markazlari;
   * Grazyole tutami (*radiatio optica*) va po'stloq markazi (*sulcus calcarinus*, Brodmann 17);
   * Klinik korrelyatsiya: Amavroz, bitemporal gemianopsiya, gomonim gemianopsiya.
4. **VIII juft — Dahliz-chig‘anoq nervi (*Nervus vestibulocochlearis*):**
   * **Chig'anoq qismi (*Pars cochlearis*):** Korti a'zosi, spiral tugun, rombsimon chuqurcha o'zaklari, lateral ilmoq (*lemniscus lateralis*), Geshl burmasi (*gyrus temporalis superior*);
   * **Dahliz qismi (*Pars vestibularis*):** Labirint otolitlari va ampulyar tizmachalari, Skarpa tuguni, 4 ta dahliz o'zagi (Bexterev, Deyters, Shvalbe, Roller);
   * Klinikasi: Sensorinevral eshitish pasayishi, nistagm, bosh aylanishi (*vertigo*), Meniere kasalligi.

---

### 1. I JUFT — HID BILISH NERVLARI (*NERVI OLFACTORII*)

Hid bilish nervlari embriologik jihatdan bosh miya oldingi pufagining o'simtasi bo'lib, o'zaklarga ega emas. U sof sezuvchi (**SVA — Special Visceral Afferent**) nervdir.

\`\`\`olfactory_pathway
[Hid Bilish Yo'li - Olfactory Pathway Architecture]
  Burun Shilliq Qavati (Regio Olfactoria) ──► 15-20 ta Fila Olfactoria
                                                      │ (Lamina cribrosa orqali)
                                                      ▼
  Kalla Suyagi Ichida: Bulbus Olfactorius (2-Neyron: Mitral hujayralar)
                                                      │
                                                      ▼
  Tractus Olfactorius ──► Trigonum Olfactorium ──► Striae Olfactoriae
                                                      │
                         ┌────────────────────────────┴───────────────────────────┐
                         ▼                                                        ▼
  Birlamchi Po'stloq Markazi: Uncus & Gyrus Parahippocampalis             Limbik Tizim (Emotsiya va xotira)
  (Brodmann 28, 34-maydonlar)                                             Corpus Amygdaloideum
\`\`\`

* **1-neyron:** Burun bo'shlig'i yuqori chig'anog'i shilliq qavatidagi (*regio olfactoria*) bipolyar sezuvchi hid hujayralari. Ularning markaziy o'simtalari 15–20 ta yupqa tutam — **hidlov iplari (*fila olfactoria*)**ni hosil qiladi.
* **Suyakdan o'tishi:** G'alvirsimon suyakning g'alvir plastinkasi (**Lamina cribrosa ossis ethmoidalis**) teshiklari orqali kalla suyagining oldingi chuqurchasiga kiradi.
* **2-neyron:** **Hid bilish piyozchasi (*Bulbus olfactorius*)**dagi mitral hujayralar.
* **3-neyron va yo'llari:** Mitral hujayralar aksonlari **hid bilish trakti (*tractus olfactorius*)**ni hosil qilib, hidlov uchburchagi (*trigonum olfactorium*) va oldingi teshilgan moddaga (*substantia perforata anterior*) boradi.
* **Po'stloq markazi:** Talamusni aylanib o'tib, to'g'ridan-to'g'ri chakka bo'lagining medial yuzasidagi **ilmoq (*uncus*)** va paragippokampal burmaga (*gyrus parahippocampalis*) yetib boradi. Shuningdek amigdala bilan bog'lanib, hidlarning his-tuyg'ular va xotira bilan chambarchas bog'liqligini ta'minlaydi.
* **Klinikasi:**
  * *Anosmiya:* Kalla suyagi asosi singanda (lamina cribrosa yorilishi) hid bilishning butunlay yo'qolishi;
  * *Uncinate fits (Gallyutsinatsiyalar):* Chakka bo'lagi uncus sohasida shish yoki epilepsiya o'chog'i bo'lganda yoqimsiz hidlar (kuyindi, chirindi) sezish.

---

### 2. II JUFT — KO‘RUV NERVI (*NERVUS OPTICUS*)

Ko'ruv nervi ham miyaning bevosita o'simtasi (oq moddasi) bo'lib, tashqi tomondan miya qattiq, to'rsimon va yumshoq pardalari bilan o'ralgan. Tola turi: **SSA (Special Somatic Afferent)**.

#### A. Ko'ruv Analizatorining 4 Neyronli Zanjiri:
1. **1-neyron:** To'r pardadagi fotoretseptorlar — **tayoqchalar** (oq-qora, 120 mln) va **kolbachalar** (rangli ko'rish, 6-7 mln);
2. **2-neyron:** Bipolyar neyronlar (*neurocytus bipolaris*);
3. **3-neyron:** Ganglionar neyronlar (*neurocytus ganglionaris*). Ularning aksonlari ko'z tubida to'planib ko'ruv nervi diskini (*discus nervi optici*) hosil qiladi.

\`\`\`optic_pathway
[Ko'rish Yo'li va Kesishmasi - Optic Pathway Decussation]
  Retina (To'r Parda)
  ├── Lateral (Chakka) Yarmi ─────────► [Kesishmaydi] ───┐
  └── Medial (Burun) Yarmi  ──► CHIASMA OPTICUM (100% kesishadi) ──► TRACTUS OPTICUS
                                                         │
                                ┌────────────────────────┴────────────────────────┐
                                ▼                                                 ▼
                  Corpus Geniculatum Laterale                             Colliculus Superior
                  (Po'stloqosti ko'rish markazi - 4-Neyron)               (Ko'rish oriyentatsiya refleksi)
                                │
                                ▼ (Radiatio Optica / Grazyole tutami)
                  Sulcus Calcarinus (Brodmann 17, Ensa bo'lagi)
\`\`\`

#### B. Topografik Yo'li va Kesishma Qonuniyati:
* Ko'z kosasidan **ko'rish kanali (*canalis opticus*)** orqali kalla suyagining o'rta chuqurchasiga kiradi.
* Turk egari oldida **ko‘rish kesishmasi (*Chiasma opticum*)** hosil bo'ladi.
* **MUHIM QONUN:** Chiasmada to'r pardaning faqat **medial (burun / nazal) yarmi tolalari 100% kesishadi**. To'r pardaning **lateral (chakka / temporal) yarmi tolalari kesishmasdan** o'z tomonida davom etadi!
* Chiasmadan keyin yo'l **ko‘rish trakti (*Tractus opticus*)** deb ataladi. Har bir trakt o'z tomonidagi to'r pardaning temporal yarmi va qarama-qarshi tomon to'r pardasining nazal yarmi tolalaridan iborat (ya'ni qarama-qarshi tomon ko'rish maydonini olib yuradi).

#### C. Po'stloqosti va Po'stloq Markazlari:
1. **Po'stloqosti markazlari:**
   * **Corpus geniculatum laterale (CGL / Lateral tizzasimon tana):** 4-neyron tanalari shu yerda joylashgan;
   * **Colliculi superiores (Yuqori tepaliklar):** Ko'z qorachig'ining yorug'likka bo'lgan refleksi va to'satdan yorug'likka boshni burish harakatlantiruvchi markazi;
   * **Pulvinar thalami (Talamus yostig'i):** Vizual integratsiya.
2. **Grazyole nurlanishi (*Radiatio optica*):** CGL dan chiqqan aksonlar ichki kapsulaning orqa soni orqali ensa bo'lagiga yo'naladi. Uning pastki tolalari chakka bo'lagini aylanib o'tadi (**Meyer halqasi**).
3. **Po'stloq markazi:** Ensa bo'lagining ichki yuzasidagi **qirqma egat qirralari (*Sulcus calcarinus*, Brodmann 17-maydoni)**.

---

### 3. VIII JUFT — DAHLIZ-CHIG‘ANOQ NERVI (*NERVUS VESTIBULOCOCHLEARIS*)

Sof sezuvchi nerv bo'lib, ikkita funktsional jihatdan butunlay mustaqil qismdan iborat: **Eshituv** va **Muvozanat**. Tola turi: **SSA**.

* **Kalladan chiqishi:** Ikkala qism ichki eshituv yo'lida (*porus acusticus internus*) birlashib, miya ko'prigi bilan uzunchoq miya tutashgan burchakdan (**Angulus pontocerebellaris**) miyaga kiradi.

#### A. Chig'anoq qismi (*Pars Cochlearis* — Eshitish Analizatori):
1. **1-neyron:** Chig'anoq o'zagidagi **spiral tugun (*Ganglion spirale cochleae*)** bipolyar neyronlari. Periferik o'simtasi Korti a'zosidagi fonoretseptorlarga boradi.
2. **2-neyron:** Ko'prikdagi rombsimon chuqurcha eshituv maydonidagi **oldingi va orqa chig'anoq o'zaklari (*Nucleus cochlearis ventralis et dorsalis*)**.
3. **Trapetsiyasimon tana va Lateral ilmoq:** O'zaklardan chiqqan tolalar qisman kesishib trapetsiyasimon tanani (*corpus trapezoideum*) va **lateral ilmoqni (*lemniscus lateralis*)** hosil qiladi.
4. **Po'stloqosti markazlari:**
   * **Corpus geniculatum mediale (CGM / Medial tizzasimon tana);**
   * **Colliculi inferiores (Pastki tepaliklar):** Eshitish oriyentatsiya reflekslari.
5. **Po'stloq markazi:** Chakka bo'lagining yuqori chakka burmasida joylashgan **Geshl burmasi (*Gyrus temporalis superior / gyri temporales transversi*, Brodmann 41, 42-maydonlari)**.

#### B. Dahliz qismi (*Pars Vestibularis* — Muvozanat Analizatori):
1. **1-neyron:** Ichki eshituv yo'li tubidagi **dahliz tuguni (*Ganglion vestibulare / Skarpa tuguni*)**. Periferik shoxlari 3 ta yarimdoira kanal ampulalari (*cristae ampullares*) va dahliz qopchalari (*maculae utriculi et sacculi*)ga boradi.
2. **2-neyron (Rombsimon chuqurchadagi 4 ta dahliz o'zagi):**
   * *Nucleus vestibularis superior (Bexterev o'zagi);*
   * *Nucleus vestibularis lateralis (Deyters o'zagi);*
   * *Nucleus vestibularis medialis (Shvalbe o'zagi);*
   * *Nucleus vestibularis inferior (Roller o'zagi).*
3. **Bog'lanish tizimlari:**
   * **Tr. vestibulospinalis:** Deyters o'zagidan orqa miyaga tushib, gavdani tik tutuvchi mushaklar tonusini boshqaradi;
   * **Fasciculus longitudinalis medialis:** III, IV va VI juft ko'zni harakatlantiruvchi nervlar o'zaklari bilan bog'lanib, bosh burilganda ko'z soqqasini teskari tomonga moslashuvini ta'minlaydi (**Vestibulo-okulyar refleks — VOR**);
   * **Tr. vestibulocerebellaris:** Miyacha chuvalchangiga muvozanatni koordinatsiya qilish uchun boradi.

---

### 4. KLINIK DEFEKTLAR VA SINDROMLAR JADVALI

| Zararlanish Sohasini Ko'rsatuvchi Struktura | Patologik Sindrom | Klinik Ko'rinish va Tashxis Sinamalari |
| :--- | :--- | :--- |
| **N. opticus (Bir tomonlama to'liq uzilishi)** | **Monokulyar amavroz (Ko'rlik)** | O'sha ko'zning butunlay ko'rmay qolishi, to'g'ri qorachiq refleksining yo'qolishi |
| **Chiasma opticum (O'rta qismi — Gipofiz adenomasi bosishi)** | **Bitemporal gemianopsiya** | Ikkala ko'zning tashqi (temporal) ko'rish maydonlari ko'rmay qolishi ("tunel ko'rish") |
| **Tractus opticus yoki Radiatio optica** | **Gomonim gemianopsiya** | Shikastlangan tomonga qarama-qarshi tomon ko'rish maydonlarining yo'qolishi (masalan, o'ng trakt zararlansa — chap tomonlama gomonim gemianopsiya) |
| **Pars cochlearis / Ganglion spirale** | **Sensorinevral karlik** | Quloqda shovqin (*tinnitus*), yuqori chastotali tovushlarni eshitmaslik; Rinne sinamasida suyakdan ko'ra havo o'tkazuvchanligi yaxshiroq, Weber sinamasida tovush sog'lom tomonga lateralizatsiya bo'ladi |
| **Pars vestibularis / O'zaklar** | **Vestibulyar ataksiya va Vertigo** | Tizimli bosh aylanishi, gorizontal-rotator nistagm, yurishda zararlangan tomonga og'ib ketish, ko'ngil aynishi va qusish |`,
      ru: `## 👃👀👂 I, II, VIII пары черепных нервов (Обонятельный, Зрительный, Преддверно-улитковый)

---

### 📌 ПЛАН ТЕМЫ
1. **I пара (*Nn. olfactorii*):** Специфический чувствительный (SVA). Обонятельные нити проходят через *lamina cribrosa* к *bulbus olfactorius*. Корковый центр: крючок (*uncus*).
2. **II пара (*N. opticus*):** Специфический соматический (SSA). Аксоны ганглионарных клеток сетчатки.
   * *Canalis opticus*;
   * *Chiasma opticum* (100% перекрест только медиальных носовых волокон);
   * *Tractus opticus* идет к подкорковым центрам (*corpus geniculatum laterale*, верхние холмики);
   * Корковый центр: шпорная борозда (*sulcus calcarinus*, 17 поле Бродмана).
3. **VIII пара (*N. vestibulocochlearis*):**
   * *Pars cochlearis:* Кортиев орган -> *ganglion spirale* -> улитковые ядра -> латеральная петля -> *corpus geniculatum mediale* -> извилины Гешля;
   * *Pars vestibularis:* Рецепторы полукружных каналов и мешочков -> *ganglion vestibulare* (Скарпы) -> 4 ядра ромбовидной ямки (Бехтерева, Дейтерса, Швальбе, Роллера).
4. **Клинические поражения:** Битемпоральная гемианопсия (аденома гипофиза), гомонимная гемианопсия, сенсоневральная тугоухость, нистагм.`,
      en: `## 👃👀👂 Cranial Nerves I, II, and VIII (Special Sensory Nerves)

---

### 📌 TOPIC OUTLINE
1. **CN I (Olfactory Nerve - SVA):** 15-20 olfactory fila through cribriform plate to olfactory bulb, tract, and primary olfactory cortex in uncus/parahippocampal gyrus.
2. **CN II (Optic Nerve - SSA):** Retinal ganglion cell axons through optic canal.
   * Optic Chiasm: ONLY nasal hemiretina fibers decussate (temporal fibers remain ipsilateral);
   * Optic Tract to Lateral Geniculate Nucleus (LGN) and superior colliculus;
   * Optic Radiations (Meyer's loop) to primary visual cortex (*sulcus calcarinus*, Brodmann area 17).
3. **CN VIII (Vestibulocochlear Nerve - SSA):**
   * Cochlear division: Organ of Corti -> spiral ganglion -> cochlear nuclei -> lateral lemniscus -> Medial Geniculate Nucleus -> transverse temporal gyri of Heschl;
   * Vestibular division: Maculae and cristae -> Scarpa's ganglion -> 4 vestibular nuclei (Superior, Lateral, Medial, Inferior).
4. **Clinical Syndromes:** Bitemporal hemianopsia (pituitary mass compressing chiasm), homonymous hemianopsia, sensorineural hearing loss, vertigo, nystagmus.`
    },
    latinTerms: [
      "Nervi olfactorii (Hid bilish nervlari)",
      "Bulbus olfactorius (Hid bilish piyozchasi)",
      "Nervus opticus (Ko'ruv nervi)",
      "Chiasma opticum (Ko'rish kesishmasi)",
      "Tractus opticus (Ko'rish trakti)",
      "Corpus geniculatum laterale et mediale (Lateral va medial tizzasimon tanalar)",
      "Sulcus calcarinus (Qirqma egat)",
      "Nervus vestibulocochlearis (Dahliz-chig'anoq nervi)",
      "Ganglion spirale cochleae (Chig'anoq spiral tuguni)",
      "Ganglion vestibulare Scarpae (Skarpa dahliz tuguni)"
    ],
    videos: [
      "https://www.youtube.com/watch?v=kYJvMOHp3L4"
    ]
  },
  {
    id: "sem_3_top_9",
    semester: 3,
    order: 9,
    defaultModelId: "cranial-nerve-nuclei",
    terms: SEMESTER_3_GLOSSARY_TERMS.filter(t => t.topicOrder === 9),
    title: {
      uz: "9-Mavzu: III, IV, VI, XI, XII juft bosh miya nervlari",
      ru: "Тема 9: III, IV, VI, XI, XII пары черепных нервов (Двигательные нервы)",
      en: "Topic 9: Cranial Nerves III, IV, VI, XI, XII (Motor Cranial Nerves)"
    },
    theory: {
      uz: `## 👁️👅 III, IV, VI, XI va XII juft Bosh Miya Nervlari: Harakatlantiruvchi Nervlar

---

### 📌 MAVZU REJASI
1. **Ko'zni harakatlantiruvchi nervlar triadasining anatomiyasi va topografiyasi:**
   * **III juft — Ko‘zni harakatlantiruvchi nerv (*Nervus oculomotorius*):** Motor o'zagi, Yakubovich-Edinger-Westphal parasimpatik o'zagi, Perlia o'zagi, ko'z kosasining yuqori yorig'i (*fissura orbitalis superior*);
   * **IV juft — G‘altaksimon nerv (*Nervus trochlearis*):** Miya orqa yuzasidan chiquvchi yagona nerv, to'liq kesishuvi, yuqori qiyshiq mushak (*m. obliquus superior*);
   * **VI juft — Uzoqlashtiruvchi nerv (*Nervus abducens*):** Dorello kanali, g'orli sinus ichidan o'tishi, lateral to'g'ri mushak (*m. rectus lateralis*).
2. **XI juft — Qo‘shimcha nerv (*Nervus accessorius*):**
   * Kranial va spinal ildizlari, *foramen magnum* va *foramen jugulare*;
   * *M. sternocleidomastoideus* va *m. trapezius* innervatsiyasi;
   * Klinikasi: Bo'yin qiyshiqligi (*torticollis*) va yelka osilishi.
3. **XII juft — Tilosti nervi (*Nervus hypoglossus*):**
   * Uzunchoq miyadagi o'zagi, *canalis hypoglossalis*;
   * Tilning barcha xususiy va skelet muskullari innervatsiyasi;
   * Bo'yin qovog'i (*ansa cervicalis*) bilan munosabati;
   * Klinikasi: Tilning zararlangan tomonga og'ishi (deviasiya), atrofiyalar.

---

### 1. III JUFT — KO‘ZNI HARAKATLANTIRUVCHI NERV (*NERVUS OCULOMOTORIUS*)

Aralash nerv (somatik harakatlantiruvchi — **GSE** va vegetativ parasimpatik — **GVE** tolalaridan iborat).

\`\`\`cn3_pathway
[Nervus Oculomotorius O'zaklari va Chiqishi]
  O'rta Miya Qopqog'i (Colliculus Superior sathida):
  ├── Nucleus motorius n. oculomotorii (GSE) ─────────┐
  ├── Nucleus accessorius (Yakubovich-Westphal, GVE) ─┼──► Fossa Interpeduncularis
  └── Nucleus impar (Perlia o'zagi - konvergensiya) ──┘        (Oyoqchalararo chuqurchadan chiqadi)
                                                                    │
                                                                    ▼
                                   Sinus Cavernosus Lateral Devori ──► Fissura Orbitalis Superior
                                                                    │
                         ┌──────────────────────────────────────────┴────────────────────────┐
                         ▼                                                                   ▼
                   Ramus Superior                                                      Ramus Inferior
      ├── M. rectus superior (ko'zni yuqoriga)                           ├── M. rectus medialis (ichkariga)
      └── M. levator palpebrae superioris (qovoqni ko'taradi)            ├── M. rectus inferior (pastga)
                                                                         ├── M. obliquus inferior (yuqoriga-tashqariga)
                                                                         └── Radix parasympathica ad Ganglion Ciliare
                                                                               ├── M. sphincter pupillae (qorachiq torayishi)
                                                                               └── M. ciliaris (akkomodatsiya)
\`\`\`

* **O'zaklari:** O'rta miyada, suv yo'li (*aqueductus cerebri*) tubida, yuqori tepaliklar sathida:
  1. *Nucleus motorius n. oculomotorii (harakatlantiruvchi);*
  2. *Nucleus accessorius n. oculomotorii (Yakubovich-Edinger-Westphal o'zagi — vegetativ parasimpatik);*
  3. *Nucleus medianus impar (Perlia o'zagi — akkomodatsiya va konvergensiyaning markazi).*
* **Miyadan chiqishi:** O'rta miya asosidagi miya oyoqchalari orasidan — oyoqchalararo chuqurchadan (**Fossa interpeduncularis**).
* **Suyakdan o'tishi:** G'orli venoz sinusning (*sinus cavernosus*) lateral devoridan o'tib, ko'z kosasining yuqori yorig'i (**Fissura orbitalis superior**) orqali orbitaga kiradi.
* **Innervatsiyasi:** Ko'zning 6 ta tashqi mushagidan 4 tasini va yuqori qovoq mushagini innervatsiya qiladi (*m. rectus superior, inferior, medialis, m. obliquus inferior, m. levator palpebrae superioris*). Parasimpatik tolalari kipriksimon tugun (**Ganglion ciliare**) orqali ko'z qorachig'ini toraytiruvchi (*m. sphincter pupillae*) va akkomodatsiya qiluvchi kipriksimon mushakka (*m. ciliaris*) boradi.
* **Klinikasi (To'liq falajida):**
  * **Ptoz:** Yuqori qovoqning osilib qolishi;
  * **Strabismus divergens:** Tashqi g'ilaylik (chunki saqlanib qolgan VI juft ko'zni tashqariga tortadi);
  * **Midriaz:** Qorachiqning maksimal kengayishi va yorug'likka reaksiyaning yo'qolishi;
  * Akkomodatsiya va konvergensiyaning yo'qolishi, diplopiya (ikkita ko'rish).

---

### 2. IV JUFT — G‘ALTAKSIMON NERV (*NERVUS TROCHLEARIS*)

Sof harakatlantiruvchi nerv (**GSE**). Inson anatomiyasida **3 ta unikal rekordga ega:**
1. Miya poyasining **ORQA (dorsal) yuzasidan** chiquvchi YAGONA kranial nerv!
2. Chiqish joyida (yuqori miya yelkanida — *velum medullare superius*) tolalari **100% to'liq kesishadi (*decussatio trochlearis*)**. Shuning uchun o'ng o'zak chap ko'z mushagini, chap o'zak o'ng ko'z mushagini ta'minlaydi!
3. Kalla ichida eng uzun va eng nozik subaraxnoidal yo'l bosib o'tuvchi nerv.

* **O'zagi:** O'rta miyada, pastki tepaliklar (*colliculi inferiores*) sathida joylashgan *Nucleus n. trochlearis*.
* **Yo'li:** Miya oyoqchasini lateral tomondan aylanib o'tib, *sinus cavernosus* devori orqali ko'z kosasining yuqori yorig'idan (**Fissura orbitalis superior**) orbitaga kiradi.
* **Innervatsiyasi:** **Yuqori qiyshiq mushak (*M. obliquus superior*)** — ko'z soqqasini pastga va lateral (tashqariga) buradi.
* **Klinikasi:** Bemor pastga qaraganda (ayniqsa zinadan pastga tushayotganda yoki kitob o'qiyotganda) vertikal diplopiya yuzaga keladi. Bemor diplopiyani kompensatsiya qilish uchun boshini zararlangan tomonga qarama-qarshi tomonga va pastga egib yuradi.

---

### 3. VI JUFT — UZOQLASHTIRUVCHI NERV (*NERVUS ABDUCENS*)

Sof harakatlantiruvchi nerv (**GSE**).

* **O'zagi:** Ko'prikda, rombsimon chuqurchadagi yuz tepaligi tubida joylashgan **Nucleus n. abducens**. Bu o'zak atrofini VII juft tolasi aylanib o'tib, yuz nervining ichki tizzasini (*geniculum internum n. facialis*) hosil qiladi.
* **Miyadan chiqishi:** Ko'prikning pastki orqa cheti bilan uzunchoq miya piramidasi orasidagi ko'ndalang egatdan chiqadi.
* **Suyakdan o'tishi:** Dorello kanalidan o'tib, **Sinus cavernosusning ICHIDAN**, bevosita ichki uyqu arteriyasi (*a. carotis interna*) yonidan o'tadi! Shuning uchun kavernoz sinus trombozida yoki karotid anevrizmada birinchi bo'lib aynan VI juft falajlanadi.
* So'ngra **Fissura orbitalis superior** orqali orbitaga kiradi.
* **Innervatsiyasi:** **Lateral to'g'ri mushak (*M. rectus lateralis*)** — ko'zni tashqariga (lateralga) buradi.
* **Klinikasi:** **Strabismus convergens (Ichki g'ilaylik)** — ko'z soqqasi burun tomonga qarab qoladi, tashqariga qaray olmaslik va gorizontal diplopiya paydo bo'ladi.

---

### 4. XI JUFT — QO‘SHIMCHA NERV (*NERVUS ACCESSORIUS*)

Sof harakatlantiruvchi nerv (**SVE / GSE**). Ikkita manbadan boshlanadi:

\`\`\`cn11_pathway
[Nervus Accessorius - Kranial va Spinal Qismlar]
  Uzunchoq Miya: Nucleus Ambiguus pastki qismi ──► Radices Craniales
                                                            │
  Orqa Miya (C1-C5): Orqa miya oldingi shoxi   ──► Radices Spinales ──► Foramen Magnum orqali kiradi
                                                            │
                                                            ▼ (Kalla ichida birlashadi)
                                                  NERVUS ACCESSORIUS
                                                            │
                                                            ▼ (Foramen Jugulare orqali chiqadi)
                         ┌──────────────────────────────────┴────────────────────────────────┐
                         ▼                                                                   ▼
           M. Sternocleidomastoideus                                                   M. Trapezius
     (Boshni qarama-qarshi tomonga burish)                                        (Yelkani ko'tarish, kurakni yaqinlashtirish)
\`\`\`

* **Kalladan chiqishi:** Bo'yinturuq teshigi (**Foramen jugulare**) orqali IX va X juft nervlar bilan birga chiqadi.
* **Innervatsiyasi:**
  1. **To'sh-o'mrov-so'rg'ichsimon mushak (*M. sternocleidomastoideus*):** Bir tomonlama qisqarganda boshni o'z tomoniga egib, yuzni qarama-qarshi tomonga buradi;
  2. **Trapetsiyasimon mushak (*M. trapezius*):** Yelkani yuqoriga ko'taradi ("yelka qisish") va kuraklarni umurtqaga yaqinlashtiradi.
* **Klinikasi:**
  * Boshni sog'lom tomonga burish imkonsiz bo'lib qoladi;
  * Zararlangan tomonda yelka pastga osilib tushadi, qo'lni gorizontal chiziqdan yuqoriga ko'tarish qiyinlashadi;
  * Chaqaloqlarda to'qima shikastlansa — **qiyshiqbo'yinlik (*torticollis*)**.

---

### 5. XII JUFT — TILOSTI NERVI (*NERVUS HYPOGLOSSUS*)

Sof harakatlantiruvchi nerv (**GSE**).

* **O'zagi:** Uzunchoq miyada, rombsimon chuqurchaning pastki burchagidagi tilosti nervi uchburchagi (*trigonum n. hypoglossi*) tubida yotuvchi yirik **Nucleus n. hypoglossi**.
* **Miyadan chiqishi:** Uzunchoq miyaning oldingi yon egatidan (**sulcus ventrolateralis**) — piramida va oliva orasidan 10–15 ta ildizcha bo'lib chiqadi.
* **Suyakdan o'tishi:** Ensa suyagidagi maxsus tilosti kanali (**Canalis hypoglossalis**) orqali kalladan chiqadi.
* **Topografiyasi:** Bo'yinda uyqu uchburchagidan o'tib, Pirogov uchburchagi (*trigonum linguale*) tubini hosil qiladi. Bo'yin qovog'i (*ansa cervicalis*) hosil bo'lishida o'zining motor tolasini beradi.
* **Innervatsiyasi:** Tilning barcha xususiy va skelet mushaklari:
  * *M. genioglossus* (tilni oldinga va tashqariga itaruvchi asosiy mushak);
  * *M. hyoglossus* (tilni pastga tortadi);
  * *M. styloglossus* (tilni orqaga va yuqoriga tortadi);
  * Tilning barcha bo'ylama, ko'ndalang va vertikal ichki mushaklari *(Faqat m. palatoglossus bundan mustasno — u X juft vagus tomonidan innervatsiya qilinadi)*.
* **Klinikasi:**
  * **Periferik falaj (nerv yoki o'zak zararlanganda):** Til og'izdan chiqarilganda **ZARARLANGAN TOMONGA QIYSHAYADI** (chunki qarama-qarshi tomondagi sog'lom *m. genioglossus* tilni zaiflashgan tomon tomonga surib qo'yadi). Zararlangan tomonda til so'lig'i, mushak atrofiyasi va fassikulyatsiyalar (mushak titrashi) kuzatiladi;
  * **Kortikonuklear yo'l zararlanganda (markaziy falaj):** Til qarama-qarshi tomonga og'adi, lekin atrofiyalar kuzatilmaydi.

---

### 6. KO‘ZNING MOTOR INNERVATSIYASI FORMULASI

Tibbiyot talabalari va USMLE imtihonlari uchun oltin formula:
$$\mathbf{LR_6 \; SO_4 \; AO_3}$$
* $\mathbf{LR_6}$: *Lateral Rectus* — **VI juft (N. abducens)**;
* $\mathbf{SO_4}$: *Superior Oblique* — **IV juft (N. trochlearis)**;
* $\mathbf{AO_3}$: *All Others* (qolgan barcha 4 ta mushak) — **III juft (N. oculomotorius)**.`,
      ru: `## 👁️👅 III, IV, VI, XI, XII пары черепных нервов

---

### 📌 ПЛАН ТЕМЫ
1. **Глазодвигательные нервы (Формула: $LR_6SO_4AO_3$):**
   * **III пара (*N. oculomotorius*):** Ядро двигательное + ядро Якубовича-Эдингера-Вестфаля (парасимпатическое для *m. sphincter pupillae* и *m. ciliaris*). Выход через *fissura orbitalis superior*. Поражение: птоз, мидриаз, расходящееся косоглазие;
   * **IV пара (*N. trochlearis*):** Единственный нерв, выходящий с дорсальной поверхности ствола и имеющий полный перекрест. Иннервирует *m. obliquus superior*;
   * **VI пара (*N. abducens*):** Выходит из моста, проходит ВНУТРИ кавернозного синуса, иннервирует *m. rectus lateralis*. Поражение: сходящееся косоглазие.
2. **XI пара (*N. accessorius*):** Двигательный для *m. sternocleidomastoideus* и *m. trapezius*. Выход через *foramen jugulare*.
3. **XII пара (*N. hypoglossus*):** Двигательный для мышц языка. Выход через *canalis hypoglossalis*. При поражении язык отклоняется В СТОРОНУ поражения.`,
      en: `## 👁️👅 Cranial Nerves III, IV, VI, XI, and XII (Motor Cranial Nerves)

---

### 📌 TOPIC OUTLINE
1. **Extraocular Motor Nerves ($LR_6SO_4AO_3$):**
   * **CN III (Oculomotor):** Somatic motor to superior, inferior, medial recti, inferior oblique, and levator palpebrae; Edinger-Westphal parasympathetic nucleus to ciliary ganglion (pupillary sphincter and ciliary muscle). Injury causes ptosis, mydriasis, down-and-out eye;
   * **CN IV (Trochlear):** Only dorsal exit, complete decussation, innervates superior oblique (diplopia looking down);
   * **CN VI (Abducens):** Runs inside cavernous sinus, innervates lateral rectus (convergent strabismus).
2. **CN XI (Accessory):** Cranial and spinal roots through jugular foramen. Innervates sternocleidomastoid and trapezius.
3. **CN XII (Hypoglossal):** Through hypoglossal canal. Motor to intrinsic and extrinsic tongue muscles. LMN lesion causes deviation TOWARD the affected side.`
    },
    latinTerms: [
      "Nervus oculomotorius (Ko'zni harakatlantiruvchi nerv)",
      "Nucleus accessorius Edinger-Westphal (Yakubovich-Edinger-Vestfal o'zagi)",
      "Nervus trochlearis (G'altaksimon nerv)",
      "Nervus abducens (Uzoqlashtiruvchi nerv)",
      "Nervus accessorius (Qo'shimcha nerv)",
      "Nervus hypoglossus (Tilosti nervi)",
      "Fissura orbitalis superior (Ko'z kosasining yuqori yorig'i)",
      "Canalis hypoglossalis (Tilosti kanali)",
      "Ganglion ciliare (Kipriksimon tugun)"
    ],
    videos: [
      "https://www.youtube.com/watch?v=kYJvMOHp3L4"
    ]
  },
  {
    id: "sem_3_top_10",
    semester: 3,
    order: 10,
    defaultModelId: "cranial-nerve-nuclei",
    terms: SEMESTER_3_GLOSSARY_TERMS.filter(t => t.topicOrder === 10),
    title: {
      uz: "10-Mavzu: V juft bosh miya nervi. Uch shoxli nerv yo‘nalishi bo‘yicha parasimpatik tugunlar",
      ru: "Тема 10: V пара черепных нервов (Тройничный нерв). Парасимпатические узлы по ходу тройничного нерва",
      en: "Topic 10: Cranial Nerve V (Trigeminal Nerve) and Associated Parasympathetic Ganglia"
    },
    theory: {
      uz: `## ⚡ V Juft Bosh Miya Nervi — Uch Shoxli Nerv (*Nervus Trigeminus*) va Vegetativ Tugunlar

---

### 📌 MAVZU REJASI
1. **Uch shoxli nervning umumiy arxitekturasi:** 4 ta o'zagi (3 ta sezuvchi, 1 ta harakatlantiruvchi), ko'prikdan chiqishi, Gasser tuguni (*ganglion trigeminale*).
2. **I shox — Ko‘z kosasi nervi (*Nervus ophthalmicus*, V1):** *Fissura orbitalis superior*, peshona, ko'z yoshi, burun-kiprik shoxlari, kornea refleksi, **Kipriksimon tugun (*Ganglion ciliare*)**.
3. **II shox — Yuqori jag‘ nervi (*Nervus maxillaris*, V2):** *Foramen rotundum, fossa pterygopalatina*, ko'zosti va lunj shoxlari, yuqori tish chigali, **Qanot-tanglay tuguni (*Ganglion pterygopalatinum*)**.
4. **III shox — Pastki jag‘ nervi (*Nervus mandibularis*, V3):** *Foramen ovale*, chaynov mushaklari motorikasi, *n. lingualis, n. alveolaris inferior, n. auriculotemporalis*, **Quloq tuguni (*Ganglion oticum*)** va **Jag'osti tuguni (*Ganglion submandibulare*)**.
5. **Klinik sindromlar:** Uch shoxli nerv nevralgiyasi (*Tic douloureux*), kornea refleksi yo'qolishi, jag' deviasiyasi.

---

### 1. UCH SHOXLI NERVINING O‘ZAKLARI VA TUZILISHI

V juft aralash nerv bo'lib, yuz va bosh sohasining asosiy sezuvchi nervi hamda chaynov mushaklarining harakatlantiruvchi nervidir (**GSA** va **SVE** tolalari).

\`\`\`trigeminal_nuclei
[Nervus Trigeminus 4 ta O'zagi]
  1. Nucleus Mesencephalicus n. trigemini (O'rta miyada) ──► Chaynov mushaklari va tish propriosepsiyasi
  2. Nucleus Pontinus / Principalis (Ko'prikda)       ──► Epikritik, nozik taktil sezgi
  3. Nucleus Spinalis n. trigemini (C4 gacha tushadi)  ──► Og'riq va harorat (protopatik) sezgisi
  4. Nucleus Motorius n. trigemini (Ko'prikda)        ──► Chaynov mushaklari motorikasi (SVE)
\`\`\`

* **Unikal gistologik xususiyati:** *Nucleus mesencephalicus*dagi neyronlar aslida birlamchi psevdounipolyar sezuvchi hujayralar bo'lib, embriogenezda tashqaridagi gangliondan miya poyasi ichiga ko'chib kirgan yagona sezuvchi markaziy o'zakdir!
* **Miyadan chiqishi:** Ko'prikning lateral yuzasidan (o'rta miyacha oyoqchasi chegarasidan) ikkita ildiz bo'lib chiqadi:
  * **Radix sensoria:** Yirik sezuvchi ildiz;
  * **Radix motoria:** Kichikroq harakatlantiruvchi ildiz.
* **Gasser (Uch shoxli) tuguni (*Ganglion trigeminale / Gasseri*):** Chakka suyagi piramidasi cho'qqisidagi botiqlikda — Meckel bo'shlig'ida (*cavum trigeminale*) yotadi. Bu yerdan 3 ta asosiy shox ajraladi:
  1. **N. ophthalmicus (V1)** — Sof sezuvchi;
  2. **N. maxillaris (V2)** — Sof sezuvchi;
  3. **N. mandibularis (V3)** — Aralash (harakatlantiruvchi ildiz to'liq faqat V3 ga qo'shiladi!).

---

### 2. I SHOX — KO‘Z KOSASI NERVI (*NERVUS OPHTHALMICUS*, V1)

* **Kalladan chiqishi:** Ko'z kosasining yuqori yorig'i (**Fissura orbitalis superior**) orqali orbitaga kiradi.
* **Asosiy tarmoqlari:**
  1. **Nervus frontalis:** Peshona va ko'z usti terisini ta'minlaydi (*n. supraorbitalis, n. supratrochlearis*);
  2. **Nervus lacrimalis:** Ko'zning lateral burchagi terisi va ko'z yoshi bezining sezuvchi innervatsiyasi;
  3. **Nervus nasociliaris:** Ko'z soqqasi, ko'z shox pardasi (*cornea*), burun bo'shlig'i oldingi qismi terisi va shilliq qavati.
* **Korneal (shox parda) refleksi:** Ko'z shox pardasiga paxta tekkizilganda ko'zning yumilishi. **Afferent (sezuvchi) yo'li — V1 (n. nasociliaris)**, efferent (harakatlantiruvchi) yo'li — VII juft (n. facialis, *m. orbicularis oculi*).
* **Vegetativ tuguni:** **Kipriksimon tugun (*Ganglion ciliare*)**. III juftdan preganglionar parasimpatik tola oladi, lekin V1 shoxlari (nn. ciliares breves) bu tugun orqali ko'z soqqasiga o'tib boradi.

---

### 3. II SHOX — YUQORI JAG‘ NERVI (*NERVUS MAXILLARIS*, V2)

* **Kalladan chiqishi:** Dumaloq teshik (**Foramen rotundum**) orqali qanot-tanglay chuqurchasiga (**Fossa pterygopalatina**) chiqadi.
* **Asosiy tarmoqlari:**
  1. **Nervus infraorbitalis (Ko'zosti nervi):** Pastki ko'z kosasi yorig'idan (*fissura orbitalis inferior*) o'tib, ko'zosti kanali orqali yuzga chiqadi va "kichik g'oz panjasi" hosil qiladi: pastki qovoq, burun yon qanotlari va yuqori lab terisini ta'minlaydi;
  2. **Nervus zygomaticus (Yonoq nervi):** Yonoq va chakka sohasi terisini ta'minlaydi;
  3. **Rami alveolares superiores:** Yuqori jag' tishlari va milklari uchun yuqori tish chigalini (*plexus dentalis superior*) hosil qiladi;
  4. **Nn. pterygopalatini:** Qanot-tanglay tuguniga boruvchi bog'lovchi shoxlar.
* **Vegetativ tuguni:** **Qanot-tanglay tuguni (*Ganglion pterygopalatinum*)**.
  * Bu tugunga VII juftdan (n. facialis) keluvchi **katta toshsimon nerv (*n. petrosus major*)** preganglionar parasimpatik tola olib keladi;
  * Tugundan chiquvchi sekretor tolalar V2 ning n. zygomaticus tarmog'i va so'ngra V1 ning n. lacrimalis tarmog'i orqali **ko‘z yoshi beziga (*glandula lacrimalis*)** yetib boradi va yosh ajralishini boshqaradi!

---

### 4. III SHOX — PASTKI JAG‘ NERVI (*NERVUS MANDIBULARIS*, V3)

V juftning **yagona aralash shoxi**.

* **Kalladan chiqishi:** Oval teshik (**Foramen ovale**) orqali qanotsimon-tanglay / chakkaosti chuqurchasiga (*fossa infratemporalis*) chiqadi.
* **Harakatlantiruvchi (Motor) tarmoqlari:**
  1. Barcha 4 ta chaynov mushaklari: *M. masseter, m. temporalis, m. pterygoideus medialis, m. pterygoideus lateralis*;
  2. *M. mylohyoideus* (og'iz tubi mushagi);
  3. *Venter anterior m. digastrici* (ikki qorinli mushakning oldingi qorinchasi);
  4. *M. tensor tympani* (nog'ora pardani taranglovchi mushak);
  5. *M. tensor veli palatini* (tanglay pardasini taranglovchi mushak).
* **Sezuvchi tarmoqlari:**
  1. **Nervus buccalis (Lunj nervi):** Lunj shilliq qavati va terisi;
  2. **Nervus auriculotemporalis (Quloq-chakka nervi):** Quloq suprasi oldi, tashqi eshituv yo'li va chakka sohasi terisini ta'minlaydi. U a. meningea media atrofini halqa qilib o'rab oladi;
  3. **Nervus lingualis (Til nervi):** Tilning oldingi 2/3 qismining **umumiy sezgisini** (og'riq, harorat, teginish) ta'minlaydi. *(Diqqat: Ushbu nerv tarkibiga VII juftning chorda tympani tarmog'i qo'shilib, ta'm sezuvchi va so'lak ajratuvchi tolalarni olib yuradi)*;
  4. **Nervus alveolaris inferior (Pastki katakcha nervi):** Pastki jag' kanalidan (*canalis mandibulae*) o'tib, pastki tishlar chigalini hosil qiladi. Terminal shoxi — **Enak nervi (*N. mentalis*)** foramen mentale orqali chiqib, enak va pastki lab terisini sezuvchanlik bilan ta'minlaydi.
* **Vegetativ tugunlari:**
  1. **Quloq tuguni (*Ganglion oticum*):** Foramen ovale ostida joylashgan. Unga IX juftdan (n. glossopharyngeus) **kichik toshsimon nerv (*n. petrosus minor*)** parasimpatik tola olib keladi. Postganglionar tolalari *n. auriculotemporalis* orqali **quloqoldi so‘lak beziga (*glandula parotidea*)** boradi;
  2. **Jag'osti tuguni (*Ganglion submandibulare*):** VII juftdan (chorda tympani orqali) tola qabul qilib, jag'osti va tilosti so'lak bezlariga sekretor tola beradi.

---

### 5. V JUFT BILAN BOG‘LIQ 4 TA PARASIMPATIK TUGUN JADVALI

| Parasimpatik Tugun | Anatomik Joylashuvi | Preganglionar Tolani Beruvchi Kranial Nerv | Innervatsiya Qiluvchi Organ |
| :--- | :--- | :--- | :--- |
| **Ganglion Ciliare** (Kipriksimon) | Ko'z kosasida, ko'ruv nervining lateral tomonida | **III juft (*N. oculomotorius*)** — Edinger-Westphal o'zagidan | *M. sphincter pupillae* (qorachiq torayishi) va *m. ciliaris* (akkomodatsiya) |
| **Ganglion Pterygopalatinum** (Qanot-tanglay) | Qanot-tanglay chuqurchasida, foramen rotundum yonida | **VII juft (*N. intermedius*)** — *N. petrosus major* orqali | **Ko‘z yoshi bezi (*Glandula lacrimalis*)**, burun va tanglay bezlari |
| **Ganglion Oticum** (Quloq) | Foramen ovale ostida, n. mandibularis medial yuzasida | **IX juft (*N. glossopharyngeus*)** — *N. petrosus minor* orqali | **Quloqoldi so‘lak bezi (*Glandula parotidea*)** |
| **Ganglion Submandibulare** (Jag'osti) | Jag'osti so'lak bezi ustida, n. lingualis bo'ylab | **VII juft (*N. intermedius*)** — *Chorda tympani* orqali | **Jag‘osti va Tilosti so‘lak bezlari (*Glandulae submandibularis et sublingualis*)** |

---

### 6. KLINIK PATOLOGIYALAR
* **Uch shoxli nerv nevralgiyasi (*Trigeminal neuralgia / Tic douloureux*):** Odatda V2 yoki V3 shoxlari bo'ylab elektr toki urgandek chidab bo'lmas sanchuvchi, qisqa muddatli kuchli og'riq xurujlari. Trigger nuqtalari (ovqat chaynash, yuz yuvish, soqol olish yoki shamol tegishi) xurujni qo'zg'atadi.
* **Chaynov mushaklari falaji:** V3 zararlanganda pastki jag' ochilganda **KASAL TOMONGA OG'ADI** (chunki qarama-qarshi tomondagi sog'lom *m. pterygoideus lateralis* jag'ni zaiflashgan tomon tomonga itaradi).`,
      ru: `## ⚡ V пара черепных нервов (Тройничный нерв) и парасимпатические узлы

---

### 📌 ПЛАН ТЕМЫ
1. **Ядра тройничного нерва:**
   * *Nucleus mesencephalicus* (проприоцепция);
   * *Nucleus pontinus/principalis* (тактильная чувствительность);
   * *Nucleus spinalis* (боль и температура);
   * *Nucleus motorius* (жевательные мышцы).
2. **Ветви тройничного нерва:**
   * **V1 (*N. ophthalmicus*):** Чувствительный. Выход через *fissura orbitalis superior*. Роговичный рефлекс;
   * **V2 (*N. maxillaris*):** Чувствительный. Выход через *foramen rotundum* в крылонебную ямку;
   * **V3 (*N. mandibularis*):** Смешанный. Выход через *foramen ovale*. Иннервирует все 4 жевательные мышцы, *m. mylohyoideus*, переднее брюшко *m. digastricus*.
3. **4 вегетативных ганглия по ходу тройничного нерва:**
   * *Ganglion ciliare* (III пара -> сфинктер зрачка);
   * *Ganglion pterygopalatinum* (VII пара -> слезная железа);
   * *Ganglion oticum* (IX пара -> околоушная слюнная железа);
   * *Ganglion submandibulare* (VII пара -> поднижнечелюстная и подъязычная слюнные железы).`,
      en: `## ⚡ Cranial Nerve V (Trigeminal Nerve) and Parasympathetic Ganglia

---

### 📌 TOPIC OUTLINE
1. **Four Trigeminal Nuclei:** Mesencephalic (proprioception), Principal sensory (touch/vibration), Spinal (pain/temperature), and Motor nucleus (muscles of mastication).
2. **Three Divisions:**
   * **V1 (Ophthalmic - sensory):** Enters via superior orbital fissure; corneal reflex afferent;
   * **V2 (Maxillary - sensory):** Enters via foramen rotundum into pterygopalatine fossa;
   * **V3 (Mandibular - mixed):** Enters via foramen ovale; motor to 4 muscles of mastication, mylohyoid, anterior digastric, tensor tympani, tensor veli palatini.
3. **Four Parasympathetic Ganglia Associated with CN V:**
   * Ciliary ganglion (CN III to pupillary sphincter);
   * Pterygopalatine ganglion (CN VII to lacrimal gland);
   * Otic ganglion (CN IX to parotid gland);
   * Submandibular ganglion (CN VII via chorda tympani to submandibular/sublingual glands).`
    },
    latinTerms: [
      "Nervus trigeminus (Uch shoxli nerv)",
      "Ganglion trigeminale Gasseri (Gasser uch shoxli tuguni)",
      "Nervus ophthalmicus (Ko'z kosasi nervi - V1)",
      "Nervus maxillaris (Yuqori jag' nervi - V2)",
      "Nervus mandibularis (Pastki jag' nervi - V3)",
      "Ganglion ciliare (Kipriksimon tugun)",
      "Ganglion pterygopalatinum (Qanot-tanglay tuguni)",
      "Ganglion oticum (Quloq tuguni)",
      "Ganglion submandibulare (Jag'osti tuguni)",
      "Nervus lingualis (Til nervi)",
      "Nervus alveolaris inferior (Pastki katakcha nervi)"
    ],
    videos: [
      "https://www.youtube.com/watch?v=kYJvMOHp3L4"
    ]
  },
  {
    id: "sem_3_top_11",
    semester: 3,
    order: 11,
    defaultModelId: "cranial-nerve-nuclei",
    terms: SEMESTER_3_GLOSSARY_TERMS.filter(t => t.topicOrder === 11),
    title: {
      uz: "11-Mavzu: VII va IX juft bosh miya nervlari. X juft bosh miya nervi",
      ru: "Тема 11: VII, IX и X пары черепных нервов (Лицевой, Языкоглоточный, Блуждающий)",
      en: "Topic 11: Cranial Nerves VII, IX, and X (Facial, Glossopharyngeal, and Vagus Nerves)"
    },
    theory: {
      uz: `## 🎭 VII, IX va X Juft Bosh Miya Nervlari: Yuz, Til-Halqum va Sayyor Nervlar

---

### 📌 MAVZU REJASI
1. **VII juft — Yuz nervi (*Nervus facialis / N. intermediofacialis*):**
   * O'zaklari (motor, ta'm, parasimpatik so'lak), ko'prik-miyacha burchagi;
   * Fallopiy kanali (*canalis facialis*) topografiyasi, ichki va tashqi tizzasi (*geniculum*);
   * Kanal ichi tarmoqlari: *N. petrosus major, N. stapedius, Chorda tympani*;
   * Kanal tashqarisidagi "Katta g'oz panjasi" (*Pes anserinus major*);
   * Klinikasi: Markaziy va Periferik (Bell) yuz falajlari diagnostikasi.
2. **IX juft — Til-halqum nervi (*Nervus glossopharyngeus*):**
   * O'zaklari (*nucleus ambiguus, salivatorius inferior, tractus solitarii*);
   * Bo'yinturuq teshigi (*foramen jugulare*);
   * Tarmoqlari: Timpanik nerv (Yakobson nervi), karotid sinus nervi (Gering nervi), til orqa 1/3 qismi ta'm va sezgisi;
   * Halqum refleksi (*gag reflex*).
3. **X juft — Sayyor nerv (*Nervus vagus*):**
   * Bosh miya nervlari ichida eng uzun va eng keng tarqalgan vegetativ nerv;
   * O'zaklari: *Nucleus dorsalis n. vagi, Nucleus ambiguus, Nucleus tractus solitarii*;
   * 4 ta topografik bo'limi: Bosh, Bo'yin, Ko'krak va Qorin bo'limlari;
   * **Qaytuvchi hiqildoq nervi (*Nervus laryngeus recurrens*)** topografiyasi (aorta ravog'i va a. subclavia);
   * Parasimpatik va visseral boshqaruv (Cannon-Böhm nuqtasigacha).

---

### 1. VII JUFT — YUZ NERVI (*NERVUS FACIALIS / INTERMEDIOFACIALIS*)

Aralash nerv: mimika mushaklari uchun motor (**SVE**), so'lak va ko'z yoshi bezlari uchun sekretor parasimpatik (**GVE**) hamda til oldingi 2/3 qismidan ta'm sezuvchi (**SVA**) tolalardan iborat.

\`\`\`facial_nerve_pathway
[Nervus Facialis O'zaklari va Fallopiy Kanali]
  Ko'prikda:
  ├── Nucleus motorius n. facialis (SVE) ─────────────┐
  ├── Nucleus salivatorius superior (GVE parasimpatik) ┼──► Angulus Pontocerebellaris
  └── Nucleus tractus solitarii (SVA ta'm) ───────────┘          │
                                                                 ▼
                                                  Porus Acusticus Internus ──► Canalis Facialis
                                                                 │
      ┌──────────────────────────────────────────────────────────┴──────────────────────────────────────┐
      ▼ (Kanal Ichida)                                                                                  ▼ (Foramen Stylomastoideumdan Chiqib)
  1. N. petrosus major ──► Ggl. pterygopalatinum ──► Ko'z yoshi bezi                              PES ANSERINUS MAJOR (G'oz Panjasi):
  2. N. stapedius      ──► M. stapedius (uzangicha mushagi)                                       ├── Rr. temporales (peshona ajinlari)
  3. Chorda tympani    ──► Til oldingi 2/3 ta'mi + Ggl. submandibulare                            ├── Rr. zygomatici (ko'z yumilishi)
                           (Jag'osti/tilosti so'lak bezlari)                                      ├── Rr. buccales (lunj, kulgu)
                                                                                                  ├── R. marginalis mandibulae (og'iz burchagi)
                                                                                                  └── R. colli (platisma)
\`\`\`

#### A. O'zaklari:
1. **Nucleus motorius n. facialis:** Ko'prik retikulyar formatsiyasida joylashgan yirik harakatlantiruvchi o'zak;
2. **Nucleus salivatorius superior:** Yuqori so'lak ajratuvchi parasimpatik o'zak;
3. **Nucleus tractus solitarii:** Yolg'iz yo'l o'zagi — ta'm sezgisini qabul qiluvchi o'zak.

#### B. Fallopiy Kanali (*Canalis Facialis*) Ichidagi Yo'li:
* Chakka suyagi ichidagi ichki eshituv teshigidan (*porus acusticus internus*) kiradi.
* Kanal bo'ylab toshsimon qism ichida oldinga va lateralga yurib, birinchi burilish — **yuz nervi tizzasini (*geniculum n. facialis*)** hosil qiladi. Bu yerda sezuvchi **Tizza tuguni (*Ganglion geniculi*)** yotadi.
* Kanal ichida 3 ta muhim tarmoq ajraladi:
  1. **Katta toshsimon nerv (*N. petrosus major*):** Tizza sohasidan chiqib, foramen lacerum orqali kalla asosiga chiqadi va n. petrosus profundus bilan qo'shilib qanotsimon kanal nervini (*n. canalis pterygoidei / Vidiyev nervi*) hosil qiladi. Qanot-tanglay tuguniga borib, **ko‘z yoshi beziga** sekretor tola beradi;
  2. **Uzangicha nervi (*N. stapedius*):** O'rta quloqdagi uzangicha mushagini innervatsiya qiladi. Bu mushak kuchli tovushda uzangichani dahliz darchasidan tortib ichki quloqni shikastlanishdan asraydi (falajlansa — **giperakuziya** / tovushlarning chidab bo'lmas darajada baland eshitilishi yuzaga keladi);
  3. **Nog'ora tiri (*Chorda tympani*):** O'rta quloq nog'ora bo'shlig'idan bolg'acha va sandoncha orasidan o'tadi, toshsimon-nog'ora yorig'i (*fissura petrotympanica / Glazer yorig'i*) orqali kalladan chiqib, **til nerviga (*n. lingualis*)** qo'shiladi. U **tilning oldingi 2/3 qismiga ta’m sezgisi** beradi va jag'osti/tilosti so'lak bezlariga sekretor tola eltadi.

#### C. Kalladan Chiqishi va "Katta G‘oz Panjasi" (*Pes Anserinus Major*):
* Bizg'ildoq-so'rg'ichsimon teshik (**Foramen stylomastoideum**) orqali kalladan chiqadi.
* Quloqoldi so'lak bezi ichida tarmoqlanib, barcha mimika mushaklarini innervatsiya qiluvchi **Pes anserinus major**ni hosil qiladi:
  * *Rami temporales:* Peshona qorni va ko'z aylanma mushagi yuqori qismi;
  * *Rami zygomatici:* Ko'z aylanma mushagi va yonoq mushaklari;
  * *Rami buccales:* Lunj mushagi (*m. buccinator*), og'iz aylanma mushagi;
  * *Ramus marginalis mandibulae:* Pastki labni tushiruvchi va iyak mushaklari;
  * *Ramus colli:* Bo'yinning teri osti mushagi (*platysma*).

---

### 2. IX JUFT — TIL-HALQUM NERVI (*NERVUS GLOSSOPHARYNGEUS*)

Aralash nerv bo'lib, o'zida harakatlantiruvchi (**SVE**), parasimpatik sekretor (**GVE**), ta'm (**SVA**), visseral afferent (**GVA**) va somatik sezuvchi (**GSA**) tolalarni jamlagan.

* **O'zaklari (Uzunchoq miyada):**
  1. *Nucleus ambiguus (Ikkilangan o'zak — motor);*
  2. *Nucleus salivatorius inferior (Pastki so'lak ajratuvchi — parasimpatik);*
  3. *Nucleus tractus solitarii (Yolg'iz yo'l o'zagi — ta'm va visseral sezuvchi);*
  4. *Nucleus spinalis n. trigemini (Somatik sezuvchi).*
* **Miyadan va kalladan chiqishi:** Uzunchoq miyaning oliva orqasidagi egatidan (*sulcus retroolivaris*) chiqib, bo'yinturuq teshigi (**Foramen jugulare**) orqali kalladan chiqadi. Teshik sohasida 2 ta tugun hosil qiladi: *Ganglion superius* va *Ganglion inferius*.
* **Asosiy Tarmoqlari:**
  1. **Nervus tympanicus (Yakobson nervi):** Nog'ora bo'shlig'iga kirib nog'ora chigalini (*plexus tympanicus*) hosil qiladi. U yerdan **Kichik toshsimon nerv (*N. petrosus minor*)** bo'lib chiqadi va *Ganglion oticum* orqali **quloqoldi so‘lak beziga (*glandula parotidea*)** sekretor tola beradi;
  2. **Ramus sinus carotici (Gering nervi):** Karotid sinus (*sinus caroticus*) baroretseptorlari va karotid koptokcha (*glomus caroticum*) xemoreseptorlariga boradi (qon bosimi va qondagi $O_2 / CO_2$ miqdorini doimiy monitoring qiladi);
  3. **Rami linguales:** **Tilning orqa 1/3 qismining ham umumiy sezgisi, ham TA’M SEZGISINI** ta'minlaydi;
  4. **Ramus musculi stylopharyngei:** Bigiz-halqum mushagini innervatsiya qiladi (halqumni yuqoriga ko'taradi);
  5. **Rami pharyngei:** Halqum shilliq qavati sezgisini ta'minlaydi va **halqum refleksining (*Gag reflex*) afferent (sezuvchi) zanjirini** tashkil qiladi.

---

### 3. X JUFT — SAYYOR NERV (*NERVUS VAGUS*)

Inson organizmidagi **eng uzun kranial nerv** bo'lib, parasimpatik nerv tizimining bosh magistralidir. Tola turlari: **GVE (parasimpatik), SVE (motor), GVA (visseral afferent), GSA (somatik sezgi), SVA (ta'm).**

* **O'zaklari (Uzunchoq miyada):**
  1. *Nucleus dorsalis nervi vagi (Vegetativ parasimpatik asosiy o'zak);*
  2. *Nucleus ambiguus (Halqum va hiqildoq ko'ndalang-targ'il mushaklari motor o'zagi);*
  3. *Nucleus tractus solitarii (Ichki a'zolardan keluvchi sensor axborotlar).*
* **Kalladan chiqishi:** Uzunchoq miyadan oliva orqasidagi egatdan chiqib, **Foramen jugulare** orqali bo'yinga o'tadi.

#### A. Vagusning 4 Ta Topografik Bo'limi va Tarmoqlari:
1. **Bosh bo'limi:**
   * *Ramus meningeus:* Orqa kalla chuqurchasi qattiq pardasiga;
   * *Ramus auricularis (Arnold nervi):* Quloq suprasi va tashqi eshituv yo'li terisiga (quloqni tozalaganda yo'tal refleksi paydo bo'lishining sababchisi!).
2. **Bo'yin bo'limi:** Bo'yinda uyqu qinida (*vagina carotica*) umumiy uyqu arteriyasi va ichki bo'yinturuq venasi orasida chuqurda yotadi:
   * *Rami pharyngei:* Halqum va yumshoq tanglay mushaklariga;
   * *Nervus laryngeus superior:* Ichki shoxi — tovush boylamlaridan yuqoridagi hiqildoq shilliq qavatining sezgisini ta'minlaydi; tashqi shoxi — *m. cricothyroideus* mushagini ta'minlaydi;
   * *Rami cardiaci cervicales:* Yurak chigaliga tushuvchi parasimpatik tarmoqlar (yurak urishini sekinlashtiradi).
3. **Ko'krak bo'limi:**
   * **Nervus laryngeus recurrens (Qaytuvchi hiqildoq nervi):** O'ng tomonda o'ng o'mrov osti arteriyasini (*a. subclavia*), **chap tomonda esa aorta ravog‘ini (*arcus aortae*) ostidan aylanib chiqadi!** So'ngra qizilo'ngach va traxeya orasidagi egat bo'ylab bo'yinga qaytib chiqib **Nervus laryngeus inferior** deb ataladi. U hiqildoqning deyarli barcha ichki mushaklarini va tovush boylamlaridan pastki shilliq qavatni ta'minlaydi;
   * *Plexus pulmonalis et oesophageus:* Bronxlarni toraytiruvchi, shilliq ajratuvchi va qizilo'ngach motorikasini oshiruvchi chigallar.
4. **Qorin bo'limi:** Qizilo'ngach bilan birga diafragmaning *hiatus oesophageus* teshigidan qorin bo'shlig'iga o'tadi:
   * **Truncus vagalis anterior:** Me'daning oldingi yuzasiga, Latarjet nervi va jigar shoxlari;
   * **Truncus vagalis posterior:** Me'daning orqa yuzasi va quyosh chigali orqali ingichka ichak, yo'g'on ichakning ko'ndalang chambar ichak chap 1/3 qismigacha (**Cannon-Böhm nuqtasigacha**) bo'lgan barcha qorin a'zolarini parasimpatik tola bilan ta'minlaydi.

---

### 4. INTEGRAL KLINIK TAQQOSLASH JADVALI

| Kranial Nerv | Shikastlanish Sababi | Asosiy Patologik Belgilar | Differensial Diagnostika |
| :--- | :--- | :--- | :--- |
| **VII juft (Periferik — Bell Falaji)** | Shamollash, sovuq qotish, Foramen stylomastoideumda siqilish | **Yuzning butun yarmi falajlanadi:** Peshona ajinlari yo'qoladi, ko'z yumilmaydi (**Lagoftalm / Quyon ko'zi**), og'iz burchagi pastga tushadi, chorda tympani zararlansa — til oldingi 2/3 ta'mi yo'qoladi, giperakuziya | **Markaziy yuz falajida (Insultda):** Peshona muskullari harakati SAQLANIB QOLADI (chunki peshona po'stloqdan ikki tomonlama innervatsiya oladi), faqat og'iz burchagi tushadi! |
| **IX juft** | Bo'yinturuq teshigi o'smalari, kalla asosi sinishi | Halqum refleksi yo'qolishi (*absent gag reflex*), til orqa 1/3 qismida ta'm yo'qolishi, yutinish biroz qiyinlashishi | Karotid sinus disfunksiyasi oqibatida sinkope (hushdan ketish) |
| **X juft (N. laryngeus recurrens)** | Qalqonsimon bez operatsiyalari, chap o'pka saratoni, aorta anevrizmasi | Bir tomonlama zararlanganda — **Ovoz bo‘g‘ilishi (*hoarseness*)**; Ikki tomonlama zararlanganda — Afoniya va to'satdan bo'g'ilib qolish (*stridor*) | Halqum devori uvulaning sog'lom tomonga og'ishi (chunki falajlangan tomon uvulani o'ziga torta olmaydi) |`,
      ru: `## 🎭 VII, IX, X пары черепных нервов (Лицевой, Языкоглоточный, Блуждающий)

---

### 📌 ПЛАН ТЕМЫ
1. **VII пара (*N. facialis*):**
   * Ход в *canalis facialis*: *n. petrosus major* (слезная железа), *n. stapedius* (стремянная мышца), *chorda tympani* (вкус 2/3 языка + подчелюстная/подъязычная железы);
   * Выход через *foramen stylomastoideum* -> *pes anserinus major* (мимические мышцы);
   * Паралич Белла vs Центральный паралич лицевого нерва.
2. **IX пара (*N. glossopharyngeus*):**
   * *N. tympanicus* (Якобсона) -> *n. petrosus minor* -> околоушная слюнная железа;
   * Вкус и чувствительность задней 1/3 языка;
   * *R. sinus carotici* (барорецепторы каротидного синуса).
3. **X пара (*N. vagus*):**
   * Главный парасимпатический нерв;
   * *N. laryngeus recurrens* (огибает подключичную артерию справа и дугу аорты слева);
   * Иннервация внутренних органов до точки Кэннона-Бёма (селезеночный изгиб ободочной кишки).`,
      en: `## 🎭 Cranial Nerves VII, IX, and X (Facial, Glossopharyngeal, and Vagus Nerves)

---

### 📌 TOPIC OUTLINE
1. **CN VII (Facial Nerve):**
   * Intracanalicular branches: Greater petrosal nerve (lacrimal gland), nerve to stapedius, chorda tympani (taste anterior 2/3 tongue + submandibular/lingual glands);
   * Extracranial branches via stylomastoid foramen: Temporal, Zygomatic, Buccal, Marginal mandibular, Cervical branches to muscles of facial expression;
   * Bell's palsy vs Central UMN facial weakness (forehead spared in UMN lesion).
2. **CN IX (Glossopharyngeal Nerve):**
   * Jacobson's tympanic nerve to lesser petrosal and otic ganglion (parotid gland);
   * Taste and general sensation from posterior 1/3 of tongue;
   * Carotid sinus nerve (Hering's nerve) monitoring baroreceptors/chemoreceptors.
3. **CN X (Vagus Nerve):**
   * Recurrent laryngeal nerve (loops under right subclavian artery and left aortic arch; innervates intrinsic larynx muscles);
   * Parasympathetic innervation of thoracic and abdominal viscera up to splenic flexure.`
    },
    latinTerms: [
      "Nervus facialis (Yuz nervi)",
      "Canalis facialis Fallopii (Fallopiy yuz kanali)",
      "Chorda tympani (Nog'ora tiri)",
      "Nervus petrosus major et minor (Katta va kichik toshsimon nervlar)",
      "Pes anserinus major (Katta g'oz panjasi)",
      "Nervus glossopharyngeus (Til-halqum nervi)",
      "Nervus vagus (Sayyor nerv)",
      "Nervus laryngeus recurrens (Qaytuvchi hiqildoq nervi)",
      "Foramen stylomastoideum (Bizg'ildoq-so'rg'ichsimon teshik)",
      "Foramen jugulare (Bo'yinturuq teshigi)"
    ],
    videos: [
      "https://www.youtube.com/watch?v=kYJvMOHp3L4"
    ]
  },
  {
    id: "sem_3_top_12",
    semester: 3,
    order: 12,
    defaultModelId: "cranial-nerve-nuclei",
    terms: SEMESTER_3_GLOSSARY_TERMS.filter(t => t.topicOrder === 12),
    title: {
      uz: "12-Mavzu: Vegetativ nerv tizimining simpatik va parasimpatik bo‘limlari",
      ru: "Тема 12: Автономная (вегетативная) нервная система: симпатический и парасимпатический отделы",
      en: "Topic 12: Autonomic Nervous System: Sympathetic and Parasympathetic Divisions"
    },
    theory: {
      uz: `## ⚡ Vegetativ (Avtonom) Nerv Tizimi: Simpatik va Parasimpatik Bo‘limlar

---

### 📌 MAVZU REJASI
1. **Vegetativ nerv tizimi (VNT) umumiy prinsiplari:** Somatik va vegetativ refleks yoyining farqlari, ikki neyronli efferent zanjir (preganglionar va postganglionar neyronlar).
2. **Simpatik bo‘lim (*Divisio sympathica* — Torakolyumbal tizim, C8/Th1–L2/L3):**
   * Orqa miya yon shoxlari (*cornu laterale / nucleus intermediolateralis*);
   * Oq va kulrang qo'shuvchi tarmoqlar (*rami communicantes albi et grisei*);
   * Simpatik poya (*truncus sympathicus* — paravertebral tugunlar);
   * Bo'yin tugunlari (Yuqori, O'rta, Yulduzsimon tugun — *ganglion stellatum*) va Gorner sindromi;
   * Prevertebral tugunlar va vegetativ chigallar: Quyosh chigali (*plexus coeliacus*), qorin va chanoq chigallari.
3. **Parasimpatik bo‘lim (*Divisio parasympathica* — Kraniosakral tizim):**
   * Kranial qism: III juft (Yakubovich), VII juft (yuqori so'lak), IX juft (pastki so'lak), X juft (orqa vagus o'zagi);
   * Sakral qism: Orqa miya S2–S4 segmentlari, chanoq ichki a'zolar nervlari (*nn. splanchnici pelvici*);
   * Intramural tugunlar (Auerbax va Meysner chigallari).
4. **Neyromediatorlar va Retseptorlar:** Atsetilxolin (nikotinik N va muskarinik M retseptorlar) va Noradrenalin (alfa va beta adrenoretseptorlar).
5. **Fiziologik antagonistlik va Klinik sindromlar:** "Fight or Flight" (Jang yoki Qoch) vs "Rest and Digest" (Dam ol va Hazm qil), Gorner sindromi, Reyno kasalligi.

---

### 1. VEGETATIV NERV TIZIMINING STRUKTURAVIY TUZILISHI

Vegetativ (avtonom) nerv tizimi organizmning ichki muhiti barqarorligini (**gomeostaz**), silliq mushaklar, yurak mushagi hamda barcha bezlar faoliyatini inson ongi va ixtiyoriga bog'liq bo'lmagan holda boshqaradi.

\`\`\`autonomic_reflex_arc
[Somatik vs Vegetativ Refleks Yoyi Taqqoslanishi]
  1. Somatik Refleks:
     KMS (Orqa miya oldingi shoxi) ───────────────────────────────► Skelet Mushagi (1 ta uzun akson, mediator: Ach)

  2. Vegetativ Refleks (2 neyronli efferent yo'l):
     KMS Yon Shoxi (1-Neyron) ──► Preganglionar Tola (B-tola) ──► Vegetativ Tugun (2-Neyron) ──► Postganglionar Tola ──► Ichki Organ
\`\`\`

---

### 2. SIMPATIK BO‘LIM (*DIVISIO SYMPATHICA* — TORAKOLYUMBAL TIZIM)

* **Markaziy qismi:** Orqa miyaning VIII bo'yin, barcha 12 ta ko'krak va yuqori 2-3 ta bel segmentlarining yon shoxlarida (**C8/Th1–L2/L3**) joylashgan **Nucleus intermediolateralis**.
* **Preganglionar tola yo'li:** Yon shoxdan chiqib, oldingi ildizcha tarkibida o'tadi va **oq qo‘shuvchi tarmoq (*ramus communicans albus*)** orqali simpatik poyaga kiradi.

#### A. Simpatik Poya (*Truncus Sympathicus* — Paravertebral Tugunlar):
Umurtqa pog'onasi ikki yonida zanjirsimon bo'lib joylashgan 20–25 juft paravertebral tugunlardan iborat:
1. **Bo'yin bo'limi (3 juft tugun):**
   * **Ganglion cervicale superius (Yuqori bo'yin tuguni):** Eng yirik tugun. Undan chiqqan postganglionar tolalar ichki uyqu arteriyasi atrofida chigal hosil qilib kalla bo'shlig'iga kiradi (*plexus caroticus internus*). Ko'z qorachig'ini kengaytiruvchi mushakni (*m. dilatator pupillae*) va yuz terisi qon tomirlari hamda ter bezlarini innervatsiya qiladi;
   * **Ganglion cervicale medium (O'rta bo'yin tuguni);**
   * **Ganglion cervicothoracicum / Stellatum (Yulduzsimon tugun):** Pastki bo'yin tuguni bilan I ko'krak tuguni qo'shilishidan hosil bo'ladi. Yurakning simpatik nervlarini (*n. cardiacus cervicalis inferior*) va qo'l tomirlarini ta'minlaydi.
2. **Ko'krak bo'limi (10–12 juft tugun):**
   * Yuqori 5 ta tugundan chiqqan tolalar o'pka va aorta chigallariga boradi;
   * Pastki ko'krak tugunlaridan preganglionar tolalardan tuzilgan yirik nervlar boshlanadi:
     * **Katta ichki a'zolar nervi (*N. splanchnicus major*, Th5–Th9);**
     * **Kichik ichki a'zolar nervi (*N. splanchnicus minor*, Th10–Th11).**
   * Ular diafragma orqali qorin bo'shlig'iga tushib, prevertebral tugunlarda tutashadi.
3. **Bel va Dumg'aza bo'limi (4 juft bel, 4 juft dumg'aza va 1 toq *ganglion impar*):** Qorin va kichik chanoq a'zolariga boradi.

#### B. Prevertebral Tugunlar va Ikkilamchi Vegetativ Chigallar:
Aorta va uning shoxlari oldida joylashgan yirik simpatik tugunlar:
* **Quyosh chigali (*Plexus coeliacus*):** Qorin bo'shlig'idagi eng yirik vegetativ markaz ("qorin miyasi"). Ikkita yarimoy tugun (*ganglia coeliaca*) va aorto-renal tugunlardan iborat. Jigardagi, oshqozondagi, taloqdagi, oshqozon osti bezidagi tomirlar va silliq mushaklarni boshqaradi;
* **Plexus mesentericus superior et inferior:** Ichaklarga boruvchi chigallar;
* **Plexus hypogastricus superior et inferior:** Chanoq a'zolariga boruvchi chigallar.

---

### 3. PARASIMPATIK BO‘LIM (*DIVISIO PARASYMPATHICA* — KRANIOSAKRAL TIZIM)

Parasimpatik tizim preganglionar tolalari nihoyatda uzun bo'lib, vegetativ tugunlari bevosita ishchi a'zoning yonida yoki uning devori ichida (**intramural tugunlar — intramural ganglia**) joylashgan.

#### A. Kranial Bo'lim:
1. **O'rta miya:** *Nucleus accessorius n. oculomotorii* (Yakubovich-Edinger-Westphal) ➔ **III juft** ➔ *Ganglion ciliare* ➔ *M. sphincter pupillae* (qorachiq torayishi) va *m. ciliaris*;
2. **Ko'prik:** *Nucleus salivatorius superior* ➔ **VII juft (n. intermedius)** ➔ *Ganglion pterygopalatinum* (ko'z yoshi bezi) va *Ganglion submandibulare* (jag'osti va tilosti so'lak bezlari);
3. **Uzunchoq miya:** *Nucleus salivatorius inferior* ➔ **IX juft** ➔ *Ganglion oticum* ➔ *Glandula parotidea* (quloqoldi so'lak bezi);
4. **Uzunchoq miya:** *Nucleus dorsalis nervi vagi* ➔ **X juft (Vagus)** ➔ Bo'yin, ko'krak va Cannon-Böhm nuqtasigacha bo'lgan qorin bo'shlig'i a'zolarining intramural tugunlari.

#### B. Sakral Bo'lim (S2–S4):
* Orqa miyaning II, III va IV dumg'aza segmentlarining yon shoxlaridagi **Nuclei parasympathici sacrales**.
* Ularning aksonlari chanoq ichki a'zolar nervlarini (**Nervi splanchnici pelvici**) hosil qiladi.
* **Innervatsiyasi:** Ko'ndalang chambar ichakning chap 1/3 qismi, tushuvchi va sigmasimon ichak, to'g'ri ichak, siydik pufagi (*m. detrusor vesicae*ni qisqartirib siydik chiqarishni ta'minlaydi), jinsiy a'zolar kavernoz tanalari tomirlarini kengaytirib **erektsiyani** ta'minlaydi (*"Point and Shoot": Parasympathetic -> Erection, Sympathetic -> Ejaculation*).

---

### 4. NEYROMEDIATORLAR VA RETSEPTORLAR

\`\`\`neurotransmitters
[VNT Neyromediatorlari Arxitekturasi]
  Simpatik Tizim:
    KMS ──► [Preganglionar: Ach] ──► Nikotinik (N2) Retseptor ──► [Postganglionar: NORADRENALIN] ──► Alfa/Beta Adrenoretseptorlar
    *(Istisno: Ter bezlarining postganglionar simpatik tolalari Atsetilxolin ajratadi!)*

  Parasimpatik Tizim:
    KMS ──► [Preganglionar: Ach] ──► Nikotinik (N2) Retseptor ──► [Postganglionar: ATSETILXOLIN] ──► M1, M2, M3 Muskarinik Retseptorlar
\`\`\`

---

### 5. SIMPATIK VA PARASIMPATIK TIZIMLARNING TAQQOSIY INTEGRAL JADVALI

| A'zo va Sistema | Simpatik Ta'sir ("Fight or Flight" — Stress, Faollik) | Parasimpatik Ta'sir ("Rest and Digest" — Tinchlik, Hazm) |
| :--- | :--- | :--- |
| **Ko'z qorachig'i** | **Midriaz** (qorachiq kengayadi — *m. dilatator pupillae*, $\alpha_1$) | **Mioz** (qorachiq torayadi — *m. sphincter pupillae*, $M_3$) |
| **Yurak faoliyati** | Taxikardiya (puls tezlashadi), qisqarish kuchi va o'tkazuvchanlik oshadi ($\beta_1$) | Bradikardiya (puls sekinlashadi), qisqarish kuchi kamayadi ($M_2$) |
| **Bronxlar** | Bronxodilatatsiya (bronxlar kengayadi, nafas yengillashadi, $\beta_2$) | Bronxokonstriksiya (bronxlar torayadi, balg'am ajralishi oshadi, $M_3$) |
| **Me'da-ichak yo'li** | Peristaltika va shira ajralishi to'xtaydi, sfinkterlar qisiladi | Peristaltika va sekretor bezlar faollashadi, sfinkterlar bo'shashadi ($M_3$) |
| **Siydik pufagi** | Siydik tutiladi (*m. detrusor* bo'shashadi, ichki sfinkter qisiladi, $\alpha_1, \beta_2$) | Siydik chiqariladi (*m. detrusor* qisqaradi, ichki sfinkter bo'shashadi, $M_3$) |
| **Jinsiy a'zolar** | Eyakulyatsiya va vazokonstriksiya ($\alpha_1$) | Erektsiya va bezlar sekretsiyasi ($M_3$, NO mexanizmi) |
| **Jigar metabolizmi** | Glikogenoliz va glyukoneogenez (qonda glyukoza oshadi) | Glikogen sintezi va energiya zaxirasi to'plash |

---

### 6. KLINIK SINDROMLAR
* **Gorner sindromi (*Horner syndrome*):** Bo'yin simpatik poyasi yoki yuqori bo'yin tuguni shikastlanganda (Pancoast o'pka o'smasi bosishi):
  1. **Ptoz:** Yuqori qovoqning biroz osilishi (*m. tarsalis superior* falaji);
  2. **Mioz:** Qorachiqning torayishi (*m. dilatator pupillae* falaji);
  3. **Angidroz:** Yuzning o'sha tomonida ter ajralmasligi va qon tomirlar kengayishi tufayli qizarishi.
* **Reyno kasalligi (*Raynaud disease*):** Qo'l va oyoq distal qon tomirlarining simpatik gipertonusi tufayli sovuqda barmoqlarning keskin oqarib, ko'karib ketishi va og'rishi.`,
      ru: `## ⚡ Вегетативная (автономная) нервная система: Симпатический и парасимпатический отделы

---

### 📌 ПЛАН ТЕМЫ
1. **Строение ВНС:** Двухнейронная рефлекторная дуга (преганглионарные и постганглионарные волокна).
2. **Симпатический отдел (Тораколюмбальный, C8/Th1–L2/L3):**
   * Боковые рога спинного мозга (*nucleus intermediolateralis*);
   * Симпатический ствол (*truncus sympathicus*);
   * Верхний шейный узел, звездчатый узел (*ganglion stellatum*);
   * Чревное (солнечное) сплетение (*plexus coeliacus*), брыжеечные сплетения.
3. **Парасимпатический отдел (Краниосакральный):**
   * Краниальный отдел: III, VII, IX, X пары черепных нервов;
   * Сакральный отдел: S2–S4 segmenti, тазовые внутренностные нервы (*nn. splanchnici pelvici*);
   * Интрамуральные узлы органов.
4. **Медиаторы:** Норадреналин (симпатика) и Ацетилхолин (парасимпатика).
5. **Клинические синдромы:** Синдром Горнера (птоз, миоз, ангидроз), болезнь Рейно.`,
      en: `## ⚡ Autonomic Nervous System: Sympathetic and Parasympathetic Divisions

---

### 📌 TOPIC OUTLINE
1. **Structure of ANS:** Two-neuron efferent chain (preganglionic myelinated vs postganglionic unmyelinated).
2. **Sympathetic Division (Thoracolumbar, T1–L2/L3):**
   * Lateral horn intermediolateral nucleus;
   * Sympathetic chain (paravertebral ganglia), superior cervical & stellate ganglion;
   * Splanchnic nerves to prevertebral ganglia (celiac, superior/inferior mesenteric plexuses).
3. **Parasympathetic Division (Craniosacral):**
   * Cranial outflow: CN III, VII, IX, and X;
   * Sacral outflow: S2–S4 segments via pelvic splanchnic nerves to pelvic ganglia;
   * Terminal/intramural ganglia in target organ walls.
4. **Neurotransmitters:** Norepinephrine (sympathetic postganglionic, except sweat glands) vs Acetylcholine (parasympathetic).
5. **Clinical Syndromes:** Horner's syndrome (ptosis, miosis, anhidrosis), Raynaud's phenomenon.`
    },
    latinTerms: [
      "Systema nervosum autonomicum (Avtonom nerv tizimi)",
      "Divisio sympathica et parasympathica (Simpatik va parasimpatik bo'limlar)",
      "Truncus sympathicus (Simpatik poya)",
      "Ganglion cervicale superius et stellatum (Yuqori bo'yin va yulduzsimon tugunlar)",
      "Plexus coeliacus (Quyosh / qorin chigali)",
      "Nervi splanchnici major et minor (Katta va kichik ichki a'zolar nervlari)",
      "Nervi splanchnici pelvici (Chanoq ichki a'zolari nervlari)",
      "Ganglia intramuralia (Devor ichi tugunlari)"
    ],
    videos: [
      "https://www.youtube.com/watch?v=kYJvMOHp3L4"
    ]
  },
  {
    id: "sem_3_top_13",
    semester: 3,
    order: 13,
    defaultModelId: "inner-ear",
    terms: SEMESTER_3_GLOSSARY_TERMS.filter(t => t.topicOrder === 13),
    title: {
      uz: "13-Mavzu: Eshituv va muvozanat a’zosi",
      ru: "Тема 13: Орган слуха и равновесия (Преддверно-улитковый орган)",
      en: "Topic 13: Organ of Hearing and Balance (Vestibulocochlear Organ)"
    },
    theory: {
      uz: `## 👂 Eshituv va Muvozanat A’zosi (*Organum Vestibulocochleare*)

---

### 📌 MAVZU REJASI
1. **Quloqning umumiy anatomik tuzilishi:** Tashqi, o'rta va ichki quloq chegaralari.
2. **Tashqi quloq (*Auris externa*):**
   * Quloq suprasi (*auricula*), tashqi eshituv yo'li (*meatus acusticus externus*);
   * **Nog'ora parda (*Membrana tympani*):** Tuzilishi, tarang va bo'shashgan qismlari, otoskopik nurlanish konusi (*politcer yorug'lik refleksi*).
3. **O‘rta quloq (*Auris media*):**
   * Nog'ora bo'shlig'i (*cavitas tympanica*) va uning **6 ta devori** sintopiyasi;
   * Eshitish suyakchalari zanjiri: Bolg'acha (*malleus*), sandoncha (*incus*), uzangicha (*stapes*);
   * O'rta quloq mushaklari: *M. tensor tympani* va *M. stapedius* (akustik refleks);
   * Eshituv (Yevstaxiy) nayi (*tuba auditiva*): Funksiyasi va o'rta otit patogenezi.
4. **Ichki quloq (*Auris interna / Labyrinthus*):**
   * Suyak labirint (*labyrinthus osseus*) va Parda labirint (*labyrinthus membranaceus*);
   * Perilimfa va Endolimfa aylanishi;
   * **Chig'anoq (*Cochlea*) va Korti a'zosi (*Organum spirale Corti*):** Bazilyar membrana, sochsimon hujayralar tonotopiyasi (chastotalar xaritasi);
   * **Dahliz va Yarimdoira kanallari:** Statik muvozanat (otolit apparati) va dinamik burchakli tezlanish (ampulyar kristalar).
5. **Klinik korrelyatsiya va Diagnostik Sinamalar:** Konduktiv va Sensorinevral eshitish yo'qotilishi, Rinne va Veber testlari, BPPV va Epli manevri, Menyer kasalligi.

---

### 1. TASHQI QULOQ (*AURIS EXTERNA*)

* **Quloq suprasi (*Auricula*):** Elastik tog'aydan tuzilgan bo'lib, teri bilan qoplangan. Pastki qismida tog'ay bo'lmay, teri osti yog' qatlamidan iborat sirg'alik (*lobulus auriculae*) joylashgan.
* **Tashqi eshituv yo'li (*Meatus acusticus externus*):** Uzunligi taxminan 2.5–3 sm bo'lib, gorizontal tekislikda S-simon egrilikka ega (shuning uchun kattalarda otoskopiya qilishda quloq suprasi **yuqoriga va orqaga** tortiladi).
  * Tashqi 1/3 qismi — tog'ayli (tarkibida soch follikulalari va quloq kiri bezlari — *glandulae ceruminosae* bor);
  * Ichki 2/3 qismi — chakka suyagining suyak qismi.
* **Nog'ora parda (*Membrana tympani*):** Tashqi quloqni o'rta quloqdan ajratib turuvchi yarim shaffof, oval shakldagi yupqa parda (qalinligi 0.1 mm):
  * *Pars tensa:* Pastki tarang qismi (tarkibida kollagen va elastik tolalar bor);
  * *Pars flaccida (Shrapnell pardasi):* Yuqori bo'shashgan qismi;
  * Tashqi yuzasining markazida ichkariga tortilgan **kindikcha (*umbo membranae tympani*)** bo'lib, unga ichki tomondan bolg'acha dastasi yopishgan;
  * **Yorug'lik konusi (Politser refleksi):** Otoskopiyada oldingi-pastki kvadrantda uchburchak yorug'lik aksi ko'rinadi (otitda birinchi bo'lib yo'qoladi).

---

### 2. O‘RTA QULOQ (*AURIS MEDIA*)

O'rta quloq chakka suyagi piramidasi ichida joylashgan havoli bo'shliqlar tizimidir.

#### A. Nog'ora Bo'shlig'ining 6 Ta Devori:
1. **Yuqori devor — Qopqoq devor (*Paries tegmentalis*):** Nog'ora bo'shlig'i qopqog'i (*tegmen tympani*) bo'lib, o'rta quloqni o'rta kalla chuqurchasidan va chakka bo'lagidan ajratadi (otitda miya pardalari yallig'lanishi — meningit xavfi!);
2. **Pastki devor — Bo'yinturuq devori (*Paries jugularis*):** Ichki bo'yinturuq venasi boshlang'ich chuqurchasiga (*fossa jugularis*) taqaladi;
3. **Oldingi devor — Uyqu devori (*Paries caroticus*):** Ichki uyqu arteriyasi kanaliga (*canalis caroticus*) taqaladi. Bu devorda **Eshituv nayi (*tuba auditiva*)** ochiladi;
4. **Orqa devor — So'rg'ichsimon devor (*Paries mastoideus*):** So'rg'ichsimon g'orga (*antrum mastoideum*) kirish teshigi (*aditus ad antrum*) bor;
5. **Lateral devor — Pardali devor (*Paries membranaceus*):** Nog'ora parda tashkil qiladi;
6. **Medial devor — Labirintli devor (*Paries labyrinthicus*):** Ichki quloqqa chegaradosh devor. Unda ikkita darcha bor:
   * **Dahliz darchasi (*Fenestra vestibuli / Oval darcha*):** Unga uzangicha asosi yopiladi;
   * **Chig'anoq darchasi (*Fenestra cochleae / Yumaloq darcha*):** Ikkilamchi nog'ora parda (*membrana tympani secundaria*) bilan yopilgan.

#### B. Eshitish Suyakchalari Zanjiri:
Inson tanasidagi eng mitti suyakchalar bo'lib, tovush tebranishlarini nog'ora pardadan dahliz darchasiga kuchaytirib (taxminan 20 barobarga oshirib) o'tkazadi:
1. **Bolg'acha (*Malleus*):** Dastasi nog'ora pardaga mustahkam yopishgan;
2. **Sandoncha (*Incus*):** Bolg'acha va uzangicha orasida bo'g'im hosil qilib yotadi;
3. **Uzangicha (*Stapes*):** Asosi (*basis stapedis*) oval darchaga tutashgan.

#### C. O'rta Quloq Mushaklari:
* **M. tensor tympani:** Bolg'acha dastasiga yopishadi. **V juft (n. mandibularis)** tomonidan innervatsiya qilinadi. Pardani taranglab tovush tebranishini kuchaytiradi;
* **M. stapedius:** Uzangicha bo'yniga yopishadi. **VII juft (n. facialis)** tomonidan innervatsiya qilinadi. Kuchli zarbli tovush paytida reflektor qisqarib uzangichani oval darchadan tortadi va ichki quloqni shikastlanishdan asraydi (**Akustik stapedial refleks**).

#### D. Eshituv (Yevstaxiy) Nayi (*Tuba Auditiva*):
* Nog'ora bo'shlig'ini burun-halqum (*nasopharynx*) bilan bog'laydi.
* **Vazifasi:** Nog'ora pardaning ikki tomonidagi atmosfera bosimini tenglashtirish. Yutinganda va esnaganda ochiladi. Bolalarda nay kaltaroq, kengroq va gorizontal joylashganligi sababli rinit va shamollashda infeksiya osongina o'rta quloqqa o'tib o'tkir o'rta otit chaqiradi.

---

### 3. ICHKI QULOQ (*AURIS INTERNA / LABYRINTHUS*)

Chakka suyagi toshsimon qismining eng chuqur sohasida joylashgan. Suyak labirint ichida uning shaklini takrorlovchi parda labirint yotadi. Ular orasida **perilimfa** ($Na^+$ ga boy, likvorga o'xshash), parda labirint ichida esa **endolimfa** ($K^+$ ga boy) suyuqligi aylanadi.

\`\`\`inner_ear
[Ichki Quloq - Cochlea va Vestibulum Arxitekturasi]
  AURIS INTERNA (Labirint):
  ├── 1. Eshitish A'zosi: Chig'anoq (Cochlea, 2.5 marta buralgan spiral kanal)
  │      ├── Dahliz Zinasi (Scala Vestibuli) ── Perilimfa (Oval darchadan boshlanadi)
  │      │                                        │
  │      │                                        ▼ Helicotrema (Cho'qqidagi teshik)
  │      ├── Nog'ora Zinasi (Scala Tympani) ── Perilimfa (Yumaloq darchada tugaydi)
  │      └── Chig'anoq Yo'li (Ductus Cochlearis) ── Endolimfa
  │             └── KORTI A'ZOSI (Organum Spirale)
  │                    ├── Membrana Basilaris (Asosiy plastinka)
  │                    ├── Sezuvchi Tukli Hujayralar (Ichki va Tashqi Hair Cells)
  │                    └── Membrana Tectoria (Qoplovchi parda)
  │
  └── 2. Muvozanat A'zosi: Dahliz va 3 ta Yarimdoira Kanallari
         ├── Dahliz (Vestibulum): Utriculus va Sacculus ── Otolit Apparati (Statika, chiziqli tezlanish)
         └── Yarimdoira Kanallari (Canales Semicirculares): Ampullae ── Crista Ampullaris (Dinamika, burchakli tezlanish)
\`\`\`

#### A. Chig'anoq (*Cochlea*) va Tovushni Qabul Qilish Mexanizmi:
* Suyak chig'anoq o'qi (*modiolus*) atrofida 2.5–2.75 marta aylanadi. U spiral plastinka va membranalar orqali 3 ta yo'lga bo'linadi:
  1. *Scala vestibuli:* Yuqori dahliz zinasi (perilimfa);
  2. *Scala tympani:* Pastki nog'ora zinasi (perilimfa); ular chig'anoq cho'qqisidagi teshik — **gelikotrema (*helicotrema*)** orqali o'zaro tutashadi;
  3. *Ductus cochlearis:* O'rta parda yo'li (endolimfa).
* **Korti a'zosi (*Organum spirale Corti*):** Asosiy membrana (*membrana basilaris*) ustida joylashgan:
  * **Retseptor hujayralar:** Ichki (1 qator) va tashqi (3–5 qator) sezuvchi tukli hujayralar (*hair cells*);
  * Tovush to'lqini perilimfani tebratganda bazilyar membrana tebranadi, sochsimon tukchalar qoplovchi pardaga (*membrana tectoria*) tegib egiladi va kaliy ionlari ($K^+$) hujayraga kirib retseptor potensialini (depolyarizatsiyani) hosil qiladi.
* **Tonotopik joylashuv qonuni:**
  * Chig'anoq **asosidagi (Base)** bazilyar membrana tor va qattiq bo'lib, **yuqori chastotali tovushlarni (10,000 – 20,000 Hz)** qabul qiladi;
  * Chig'anoq **cho‘qqisidagi (Apex / Helicotrema)** bazilyar membrana keng va egiluvchan bo'lib, **past chastotali tovushlarni (20 – 500 Hz)** qabul qiladi.

#### B. Muvozanat (Vestibulyar) Apparati:
1. **Dahliz qopchalari (*Utriculus et Sacculus*):**
   * Ichida sezuvchi dog'lar (**Maculae**) joylashgan;
   * Tukli hujayralar ustida kalsiy karbonat kristallaridan iborat **otolit membranasi** yotadi;
   * **Gravitatsiya (tortishish kuchi) va to‘g‘ri chiziqli (chiziqli gorizontal va vertikal) tezlanishni** sezadi (masalan, liftda ko'tarilish yoki mashinada tezlanish).
2. **Yarimdoira kanallari (*Ductus semicirculares*):**
   * 3 ta fazoviy tekislikda (frontal, sagittal, gorizontal) joylashgan;
   * Har bir kanalning kengaygan qismida — ampulasida **ampulyar tizmacha (*Crista ampullaris*)** va jelatinsimon gumbazcha (*cupula*) bor;
   * Boshning aylanishi va **burchakli (aylanma) tezlanishni** sezadi (endolimfa harakati kupulani egadi).

---

### 4. KLINIK AUDIOLOGIYA VA DIAGNOSTIKA JADVALI

| Diagnostik Test yoki Sindrom | Bajarilish Usuli | Konduktiv Karlik (O'rta/Tashqi quloq zarari) | Sensorinevral Karlik (Ichki quloq/VIII juft zarari) |
| :--- | :--- | :--- | :--- |
| **Rinne sinamasi** | Kamerton (512 Hz) avval so'rg'ichsimon o'simtaga (suyak o'tkazuvchanligi), so'ng quloq teshigiga (havo o'tkazuvchanligi) qo'yiladi | **Manfiy Rinne (BC > AC):** Suyak o'tkazuvchanligi havodan yaxshiroq (chunki tovush to'sig'i bor) | **Musbat Rinne (AC > BC):** Ikkala o'tkazuvchanlik ham pasaygan, lekin havo suyakdan yaxshiroq |
| **Veber sinamasi** | Kamerton bosh cho'qqisi yoki peshona o'rtasiga qo'yiladi | **Zararlangan tomonga lateralizatsiya bo'ladi** (kasal quloq tovushni balandroq eshitadi) | **Sog'lom tomonga lateralizatsiya bo'ladi** (chunki kasal tomonda nerv ishlamaydi) |
| **BPPV (Xatarli pozitsion vertigo)** | Otolitlarning qopchalardan yarimdoira kanallariga (ko'pincha orqa kanalga) ko'chib o'tib qolishi | Bosh holatini o'zgartirganda bir necha soniyalik kuchli bosh aylanishi va nistagm. **Dix-Hallpike testi** bilan aniqlanadi, **Epley manevri** bilan otolitlar joyiga qaytariladi |
| **Meniere kasalligi** | Ichki quloqda endolimfa bosimining ortishi (*Endolymphatic hydrops*) | Quloqda shang'illash (*tinnitus*), davriy kuchli bosh aylanishi va progressiv eshitish yo'qolishi triadasi |`,
      ru: `## 👂 Орган слуха и равновесия (*Organum vestibulocochleare*)

---

### 📌 ПЛАН ТЕМЫ
1. **Наружное ухо:** Ушная раковина, наружный слуховой проход, барабанная перепонка (*membrana tympani*, натянутая и ненатянутая части, световой конус).
2. **Среднее ухо:**
   * Барабанная полость и ее 6 стенок (*paries tegmentalis, jugularis, caroticus, mastoideus, membranaceus, labyrinthicus*);
   * Слуховые косточки: Молоточек (*malleus*), наковальня (*incus*), стремя (*stapes*);
   * Мышцы: *M. tensor tympani* (V пара) и *M. stapedius* (VII пара);
   * Слуховая (Евстахиева) труба (*tuba auditiva*).
3. **Внутреннее ухо:**
   * Улитка (*cochlea*): *scala vestibuli, scala tympani*, спиральный (Кортиев) орган на базилярной мембране;
   * Тонотопическая карта: Высокие частоты у основания (*base*), низкие у верхушки (*apex*);
   * Вестибулярный аппарат: Мешочки (*utriculus, sacculus*) — отолитовый аппарат (линейное ускорение); Полукружные каналы — ампулярные гребешки (угловое ускорение).
4. **Клинические тесты:** Опыты Ринне и Вебера, болезнь Меньера, ДППГ.`,
      en: `## 👂 Organ of Hearing and Balance (*Organum Vestibulocochleare*)

---

### 📌 TOPIC OUTLINE
1. **External Ear:** Auricle, external auditory meatus, tympanic membrane (pars tensa, pars flaccida, cone of light).
2. **Middle Ear:**
   * Tympanic cavity with 6 walls;
   * Auditory ossicles (Malleus, Incus, Stapes);
   * Muscles: Tensor tympani (CN V3) and Stapedius (CN VII);
   * Eustachian tube balancing atmospheric pressure.
3. **Internal Ear (Labyrinth):**
   * Bony and membranous labyrinths, perilymph and endolymph;
   * Cochlea: Scala vestibuli, scala tympani, and cochlear duct housing the Organ of Corti;
   * Tonotopic organization: High frequencies at the base, low frequencies at the apex;
   * Vestibular system: Utricle and saccule maculae (linear acceleration and gravity); Semicircular canals (angular rotation).
4. **Clinical Audiology:** Rinne and Weber tuning fork tests, conductive vs sensorineural hearing loss, BPPV (Epley maneuver), Meniere's disease.`
    },
    latinTerms: [
      "Organum vestibulocochleare (Eshituv va muvozanat a'zosi)",
      "Membrana tympani (Nog'ora parda)",
      "Cavitas tympanica (Nog'ora bo'shlig'i)",
      "Malleus, Incus, Stapes (Bolg'acha, sandoncha, uzangicha)",
      "Tuba auditiva Eustachii (Eshituv nayi)",
      "Cochlea (Chig'anoq)",
      "Organum spirale Corti (Korti spiral a'zosi)",
      "Membrana basilaris (Asosiy plastinka)",
      "Canales semicirculares (Yarimdoira kanallari)",
      "Utriculus et Sacculus (Dahliz xaltachalari)"
    ],
    videos: [
      "https://www.youtube.com/watch?v=kYJvMOHp3L4"
    ]
  }
];
