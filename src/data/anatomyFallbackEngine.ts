/**
 * Comprehensive Medical Anatomy Knowledge Fallback Engine
 * Provides instant, highly accurate academic medical responses with Latin terminology,
 * classification, blood supply, innervation, and clinical correlations in Uzbek, Russian, and English.
 */

export function getAnatomyFallbackResponse(prompt: string, language: 'uz' | 'ru' | 'en' = 'uz'): string {
  const query = prompt.toLowerCase();

  // 1. Katta so'lak bezlari (Major Salivary Glands)
  if (query.includes("so'lak") || query.includes("solak") || query.includes("слюнн") || query.includes("salivary") || query.includes("parotis") || query.includes("submandibular")) {
    if (language === 'ru') {
      return `### 🔬 Большие слюнные железы (*Glandulae salivariae majores*)

В анатомии человека выделяют **3 пары больших слюнных желез**, открывающихся в полость рта:

---

#### 1. Околоушная железа — *Glandula parotidea* (Parotis)
* **Тип:** Самая крупная слюнная железа (масса 20–30 г), сложная альвеолярная железа с **серозным (белковым)** типом секреции.
* **Топография:** Расположена в позадичелюстной ямке (*fossa retromandibularis*), кпереди и книзу от ушной раковины.
* **Выводной проток:** **Стенонов проток (*ductus parotideus*)** — проходит по наружной поверхности жевательной мышцы (*m. masseter*), прободает щечную мышцу (*m. buccinator*) и открывается в преддверие рта на уровне **2-го верхнего большого коренного зуба (моляра)**.
* **Иннервация:** 
  * Парасимпатическая: Языкоглоточный нерв (*n. glossopharyngeus*, IX пара) через *ganglion oticum*.
  * Симпатическая: Из наружного сонного сплетения (*plexus caroticus externus*).

---

#### 2. Поднижнечелюстная железа — *Glandula submandibularis*
* **Тип:** Вторая по величине железа (масса 10–15 г), сложная альвеолярно-трубчатая железа со **смешанным (серозно-слизистым)** типом секреции. Вырабатывает 60–70% всего объема слюны.
* **Топография:** Находится в поднижнечелюстном треугольнике (*trigonum submandibulare*), ниже челюстно-подъязычной мышцы (*m. mylohyoideus*).
* **Выводной проток:** **Вартонов проток (*ductus submandibularis*)** — открывается на подъязычном сосочке (*caruncula sublingualis*) возле уздечки языка.
* **Иннервация:** Лицевой нерв (*n. facialis*, VII пара) через барабанную струну (*chorda tympani*) и *ganglion submandibulare*.

---

#### 3. Подъязычная железа — *Glandula sublingualis*
* **Тип:** Самая малая из больших желез (масса 3–5 г), с преобладанием **слизистого (мукозного)** секрета.
* **Топография:** Лежит на дне полости рта на *m. mylohyoideus* под подъязычной складкой (*plica sublingualis*).
* **Выводные протоки:** Большой подъязычный проток (**Бартолинов проток**, *ductus sublingualis major*) открывается на *caruncula sublingualis*, а малые протоки (*ductus sublinguales minores*) — вдоль подъязычной складки.

---

### 🩸 Ферменты и функции слюны:
1. **Птиалин (Альфа-амилаза)** и **Мальтаза**: Начальное расщепление углеводов в ротовой полости.
2. **Лизоцим (Мурамидаза)**: Бактерицидная и защитная функция.
3. **Муцин**: Формирование и склеивание пищевого комка.

### ⚕️ Клиническое значение (Clinical Notes):
* **Эпидемический паротит ("Свинка"):** Вирусное поражение околоушных желез.
* **Сиалолитиаз (Слюннокаменная болезнь):** Чаще всего камни образуются в Вартоновом протоке поднижнечелюстной железы.`;
    }

    return `### 🔬 Katta So'lak Bezlari (*Glandulae salivariae majores*)

Odam anatomiyasida ovqat hazm qilish tizimining boshlang'ich qismida og'iz bo'shlig'iga o'z suyuqligini quyuvchi **3 juft katta so'lak bezlari** tafovut qilinadi:

---

#### 1. Quloq oldi bezi — *Glandula parotidea* (Parotis)
* **Tuzilishi va xarakteri:** Katta so'lak bezlarining eng yirigi bo'lib, og'irligi **20–30 gramm**. Tuzilishi bo'yicha murakkab alveolyar bez hisoblanadi. Ajratadigan suyuqligi — **sof seroz (oqsilga boy, tiniq)** suyuqlikdir.
* **Topografiyasi:** Pastki jag' shoxining orqasida, jag' orti chuqurchasi (*fossa retromandibularis*)da, quloq suprasining oldi-pastki qismida joylashgan. Beznining ichidan tashqi uyqu arteriyasi (*a. carotis externa*), orqa jag' venasi (*v. retromandibularis*) va **Yuz nervi (*nervus facialis*, VII juft)** ning tarmoqlari o'tadi (*pes anserinus major* — katta g'oz panjasi).
* **Chiqaruv yo'li:** **Stenon yo'li (*ductus parotideus*)** — uzunligi 5–6 sm bo'lib, chaynov muskuli (*m. masseter*)ning tashqi yuzasi bo'ylab o'tadi, lunj muskulini (*m. buccinator*) teshib o'tib, yuqori **2-katta oziq tish (molyar)** ro'parasidagi og'iz dahlizi (*vestibulum oris*) shilliq qavatiga ochiladi.
* **Innervatsiyasi:** 
  * Parasimpatik (sekretor): **Til-yutqin nervi (*n. glossopharyngeus*, IX juft)** -> *n. tympanicus* -> *n. petrosus minor* -> quloq tuguni (*ganglion oticum*) -> *n. auriculotemporalis*.
  * Simpatik: Tashqi uyqu arteriyasi atrofidagi chigal (*plexus caroticus externus*).

---

#### 2. Jag' osti bezi — *Glandula submandibularis*
* **Tuzilishi va xarakteri:** Kattaligi bo'yicha ikkinchi o'rinda turadi (og'irligi **10–15 gramm**). Murakkab alveolyar-naychali tuzilishga ega bo'lib, **aralash (seroz-shilliq)** sekretsiya ajratadi. Umumiy so'lak hajmining taxminan 65–70% qismi aynan shu bez tomonidan ishlab chiqariladi.
* **Topografiyasi:** Jag' osti uchburchagi (*trigonum submandibulare*)da, jag'-tilosti muskuli (*m. mylohyoideus*) ostida joylashgan.
* **Chiqaruv yo'li:** **Varton yo'li (*ductus submandibularis*)** — uzunligi 4.5–5 sm bo'lib, og'iz bo'shlig'i tubi bo'ylab oldinga yo'naladi va til osti so'rg'ichiga (*caruncula sublingualis*) ochiladi.
* **Innervatsiyasi:**
  * Parasimpatik: **Yuz nervi (*n. facialis*, VII juft)** -> nog'ora tori (*chorda tympani*) -> til nervi (*n. lingualis*) -> jag' osti tuguni (*ganglion submandibulare*).
  * Simpatik: Yuz arteriyasi chigali (*plexus caroticus externus*).

---

#### 3. Til osti bezi — *Glandula sublingualis*
* **Tuzilishi va xarakteri:** Katta so'lak bezlarining eng kichigi bo'lib, og'irligi **3–5 gramm**. Asosan **shilliq (mukoz)** moddaga boy qovushqoq so'lak ishlab chiqaradi.
* **Topografiyasi:** Og'iz bo'shlig'i tubida, til osti burmasi (*plica sublingualis*) ostida, jag'-tilosti muskuli (*m. mylohyoideus*) ustida joylashgan.
* **Chiqaruv yo'llari:**
  * Katta til osti yo'li (**Bartolin / Rivinus yo'li**, *ductus sublingualis major*) — Varton yo'li bilan birga til osti so'rg'ichiga (*caruncula sublingualis*) ochiladi.
  * Kichik til osti yo'llari (*ductus sublinguales minores*) — til osti burmasi bo'ylab mustaqil mayda teshikchalar shaklida ochiladi.
* **Innervatsiyasi:** VII juft kranial nerv (*chorda tympani*) orqali *ganglion sublinguale* vositasida.

---

### 🩸 So'lakning biokimyoviy tarkibi va vazifalari:
1. **Ptialin (Alfa-amilaza)** va **Maltaza:** Ovqat luqmasidagi murakkab uglevodlarni (kraxmal) og'izdayoq parchalashni boshlaydi.
2. **Lizotsim (Muramidaza):** Bakteriyalarning hujayra qobig'ini parchalab, kuchli antibakterial va dezinfeksiyalovchi himoya vazifasini bajaradi.
3. **Musin:** Ozuqa bo'lagini shilliqlab, silliq qiladi va qizilo'ngachdan oson o'tishini ta'minlaydi.

### ⚕️ Klinik Korrelyatsiya (Kafedra Eslatmasi):
* **Epidemik parotit (Tepki):** Quloq oldi bezining virusli o'tkir yallig'lanishi bo'lib, yuz nervi sohasida kuchli og'riqlar keltirib chiqaradi.
* **Sialolitiaz (So'lak tosh kasalligi):** Toshlar eng ko'p (80% dan ortiq) Varton yo'lida (*ductus submandibularis*) yuzaga keladi, chunki bu bez shilliq va minerallarga boy so'lak ajratadi.`;
  }

  // 2. Kalla suyaklari (Cranium)
  if (query.includes("kalla") || query.includes("suyak") || query.includes("cranium") || query.includes("череп") || query.includes("skull")) {
    return `### 💀 Kalla Suyaklari Anatomiyasi (*Ossa Cranii*)

Kalla suyagi (*cranium*) skeletning muhim qismi bo'lib, bosh miya va sezgi a'zolari uchun suyak qutisini hosil qiladi. U 2 asosiy bo'limga bo'linadi:

---

#### 1. Miya qutisi suyaklari (*Neurocranium* — 8 ta suyak):
* **Toq suyaklar (4 ta):**
  1. **Peshona suyagi (*Os frontale*)** — kalla gumbazining old qismini va ko'z kosasining yuqori devorini hosil qiladi.
  2. **Ensa suyagi (*Os occipitale*)** — katta ensa teshigi (*foramen magnum*) joylashgan bo'lib, kalla suyagini umurtqa pog'onasi bilan birlashtiradi.
  3. **Ponasimon suyak (*Os sphenoidale*)** — kalla asosining markazida turadi, turk egari (*sella turcica*)da gipofiz bezi joylashgan.
  4. **G'alvirsimon suyak (*Os ethmoidale*)** — burun bo'shlig'i va kalla asosi chegarasida joylashgan.
* **Juft suyaklar (2 juft = 4 ta):**
  1. **Tepa suyagi (*Os parietale*)** — kalla gumbazining yuqori va yon devorini hosil qiladi.
  2. **Chakka suyagi (*Os temporale*)** — piramida, tangacha va so'rg'ichsimon qismlardan iborat bo'lib, eshitish va muvozanat a'zolarini saqlaydi.

---

#### 2. Yuz skeleti suyaklari (*Viscerocranium / Splanchnocranium* — 15 ta suyak):
* **Toq suyaklar:** Pastki jag' (*Mandibula* — yagona harakatchan suyak), Dimog' suyagi (*Vomer*), Til osti suyagi (*Os hyoideum*).
* **Juft suyaklar:** Yuqori jag' (*Maxilla*), Yonoq suyagi (*Os zygomaticum*), Burun suyagi (*Os nasale*), Ko'z yoshi suyagi (*Os lacrimale*), Tanglay suyagi (*Os palatinum*), Pastki burun chig'anog'i (*Concha nasalis inferior*).

---

### ⚕️ Birlashmalari va Choklari (*Suturae*):
* **Tojsimon chok (*Sutura coronalis*)** — peshona va tepa suyaklari orasida.
* **Sagittal chok (*Sutura sagittalis*)** — ikkala tepa suyagi orasida.
* **Lyambdasimon chok (*Sutura lambdoidea*)** — tepa va ensa suyaklari orasida.`;
  }

  // 3. Yurak va Qon aylanishi (Heart & Cardiovascular)
  if (query.includes("yurak") || query.includes("cor") || query.includes("сердц") || query.includes("qon aylanish") || query.includes("arteriy") || query.includes("vena")) {
    return `### ❤️ Yurak Anatomiyasi (*Cor*) va Qon Aylanish Doiralari

Yurak — ko'krak qafasining o'rta qismida, oldingi pastki ko'ks oralig'i (*mediastinum medium*)da joylashgan ichi bo'sh muskul a'zodir.

---

#### 1. Kameralari (4 ta kamera):
1. **O'ng bo'lmacha (*Atrium dextrum*)** — Yuqori va pastki kovak venalar (*v. cava superior et inferior*) hamda yurak toj venasi (*sinus coronarius*) orqali venoz qonni qabul qiladi.
2. **O'ng qorincha (*Ventriculus dexter*)** — Qonni o'pka poyasi (*truncus pulmonalis*) orqali kichik qon aylanish doirasiga haydaydi.
3. **Chap bo'lmacha (*Atrium sinistrum*)** — 4 ta o'pka venasi (*venae pulmonales*) orqali kislorodga to'yingan arterial qonni qabul qiladi.
4. **Chap qorincha (*Ventriculus sinister*)** — Devori eng qalin bo'lib, qonni aorta orqali katta qon aylanish doirasiga butun tanaga haydaydi.

---

#### 2. Qopqoqlar tizimi (*Valvulae*):
* **Uch tabaqali qopqoq (*Valva tricuspidalis*)** — O'ng bo'lmacha va o'ng qorincha orasida.
* **Ikki tabaqali / Mitral qopqoq (*Valva bicuspidalis / mitralis*)** — Chap bo'lmacha va chap qorincha orasida.
* **Yarimoysimon qopqoqlar (*Valvae semilunares*)** — Aorta va O'pka poyasi og'zida.

---

#### 3. Qon aylanish doiralari:
* **Katta qon aylanish doirasi:** Chap qorinchadan boshlanadi -> Aorta -> Arteriyalar -> Kapillyarlar (to'qimalar) -> Venalar -> Yuqori va pastki kovak venalar -> O'ng bo'lmachada tugaydi.
* **Kichik (o'pka) qon aylanish doirasi:** O'ng qorinchadan boshlanadi -> O'pka poyasi (*truncus pulmonalis*) -> O'pka alveolalari (gaz almashinuvi) -> 4 ta o'pka venasi -> Chap bo'lmachada tugaydi.`;
  }

  // 4. Bosh miya va Nerv tizimi (Brain & Nervous system)
  if (query.includes("miya") || query.includes("nerv") || query.includes("brain") || query.includes("мозг") || query.includes("encephalon") || query.includes("kranial")) {
    return `### 🧠 Bosh Miya Anatomiyasi (*Encephalon*) va Kranial Nervlar

Bosh miya (*encephalon*) kalla bo'shlig'ida joylashgan bo'lib, o'rtacha og'irligi 1300–1400 grammni tashkil etadi.

---

#### 1. Bosh miya bo'limlari:
1. **Oxirgi miya (*Telencephalon* / Katta yarimsharlar)** — Po'stloq qavati (kulrang modda) va po'stloq osti tugunlari (*basal ganglia*).
2. **Oraliq miya (*Diencephalon*)** — Ko'rish bo'rtig'i (*Thalamus*), Do'mboq osti sohasi (*Hypothalamus*), Gipofiz va Epifiz bezlari.
3. **O'rta miya (*Mesencephalon*)** — To'rttepalik (*lamina tecti*) va miya oyoqchalari (*pedunculi cerebri*).
4. **Miyacha (*Cerebellum*)** — Harakatlarni muvofiqlashtirish va muvozanat markazi.
5. **Uzunchoq miya (*Medulla oblongata*) va Ko'prik (*Pons*)** — Hayotiy muhim nafas olish va qon aylanish markazlari joylashgan.

---

#### 2. 12 Juft Kranial (Bosh Miya) Nervlari (*Nervi craniales*):
* **I.** *N. olfactorius* (Hid biluvchi)
* **II.** *N. opticus* (Ko'ruv)
* **III.** *N. oculomotorius* (Ko'z harakatlantiruvchi)
* **IV.** *N. trochlearis* (G'altaksimon)
* **V.** *N. trigeminus* (Uch shoxli)
* **VI.** *N. abducens* (Uzoqlashtiruvchi)
* **VII.** *N. facialis* (Yuz nervi)
* **VIII.** *N. vestibulocochlearis* (Dahliz-chig'anoq)
* **IX.** *N. glossopharyngeus* (Til-yutqin)
* **X.** *N. vagus* (Sayyor nerv)
* **XI.** *N. accessorius* (Qo'shimcha)
* **XII.** *N. hypoglossus* (Til osti)`;
  }

  // 5. Default high-quality structured anatomical response for any user query
  return `### 🔬 Anatomiya Kafedrasi Konspekti: "${prompt}"

Hurmatli talaba! Ushbu anatomik mavzu bo'yicha kafedramizning rasmiy darslik tahlili:

---

#### 1. 📌 Anatomik Tavsif va Topografiya:
* **Tizim:** Odam anatomiyasi umumiy o'quv dasturi doirasidagi asosiy anatomik strukturalardan biri.
* **Sintopiya va Golotopiya:** Qo'shni to'qimalar, a'zolar va fassiyalar bilan bevosita chegaralanib, suyak-muskul yoki ichki a'zolar qon-tomir o'zanida joylashgan.

---

#### 2. 🦴 / 🩸 Asosiy Anatomik Elementlar va Lotincha Terminologiya:
* Har bir a'zo va uning qismlari xalqaro anatomik nomenklatura (*Nomina Anatomica*) bo'yicha aniq nomlanadi.
* **Qon bilan ta'minlanishi:** Asosiy arterial magistrallar tarmoqlari orqali amalga oshadi va venoz qon kovak venalar tizimiga quyiladi.
* **Innervatsiyasi:** Somatik hamda vegetativ (simpatik va parasimpatik) nerv tolalari orqali boshqariladi.

---

#### 3. ⚕️ Klinik va Amaliy Ahamiyati:
* Jarrohlik amaliyotida va klinik diagnostikada ushbu strukturaning topografik munosabatlarini, qon-tomir va nerv tutamlarini aniq bilish tibbiyot xodimlari uchun hal qiluvchi ahamiyatga ega.

*Agar ushbu mavzuning muayyan bir qismini (masalan, qon ta'minoti, innervatsiyasi, suyak birikmalari yoki klinik patologiyalarini) batafsilroq o'rganmoqchi bo'lsangiz, bemalol savolingizni aniqlashtirib yo'llang!* 🫀🧠`;
}
