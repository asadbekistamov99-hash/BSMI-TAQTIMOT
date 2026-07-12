import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import firebaseConfig from '../../firebase-applet-config.json' with { type: 'json' };

// Load env vars
dotenv.config();

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

/**
 * Retries generating theory content with exponential backoff on rate-limiting.
 */
async function generateTheoryWithAI(topicTitle: string, retries = 3): Promise<string> {
  const prompt = `Siz tibbiyot oliygohining Odam Anatomiyasi (Human Anatomy) kafedrasi professori va darslik muallifisiz. 
Talabalar uchun "${topicTitle}" mavzusida o'ta mukammal, to'liq va professional darajada darslik bobi (theoretical chapter) materialini O'zbek tilida (lotincha terminlari bilan) yozib bering.

Ushbu bob quyidagi tarkibiy qismlarni va barcha detallarni o'z ichiga olishi majburiydir:
1. **🔬 Anatomik va Tibbiy Tavsif (Introduction)**:
   - Mavzuning ahamiyati, anatomik lokalizatsiyasi va vazifalari haqida batafsil ma'lumot.

2. **🦴 Tuzilishi, Bo'limlari, Yuzalari va Qirralari (Anatomical Structure, Parts, Surfaces and Borders)**:
   - Ushbu a'zo, suyak, mushak yoki tizimning har bir qismini alohida ko'rib chiqing.
   - Barcha **YOSHLARI, TESHIKLARI, QIRRALARI, CHO'QQILARI, BO'RIMLARI va EGATLARI**ni bayon qiling.
   - Har bir anatomik qismning rasmiy lotincha nomi qavs ichida keltirilgan bo'lishi shart! (Masalan: *caput radii*, *sulcus nervi radialis*, *foramen jugulare*).

3. **🔗 Bo'g'imlar va Birlashmalar (Joints and Articulations)**:
   - Agar suyaklar bo'lsa, qaysi suyaklar bilan, qanday bo'g'imlar yoki birikmalar orqali tutashishi. Qatnashuvchi yuzalar va boylamlar.

4. **🩸 Topografiya, Innervatsiya va Qon bilan ta'minlanishi (Topography, Vascularization and Innervation)**:
   - Anatomik topografiyasi, qo'shni a'zolar bilan munosabati (% syntopia / holotopia %).
   - Uni oziqlantiruvchi arteriyalar, venoz drenaj, limfa oqimi va innervatsiya qiluvchi nervlar (barcha lotincha nomlari bilan).

5. **⚕️ Klinik Ahamiyat va Patologiyalar (Clinical Significance & Pathology)**:
   - Klinik ahamiyati, eng ko'p uchraydigan klinik kasalliklar, shikastlanishlar, sinishlar yoki yallig'lanishlar (masalan: *pneumothorax*, *appendicitis*, *fractures*, *paresis*).
   - Ularning anatomik sabablari.

6. **📝 Lotincha-O'zbekcha Anatomik Terminlar Ro'yxati**:
   - Bobda ishlatilgan eng muhim terminlarning toza jadvali (Lotincha, O'zbekcha varianti).

DIQQAT:
- Matn faqat markdown formatida bo'lsin.
- Har qanday "tezkorda yuklanadi" degan so'zlarsiz, to'liq o'quv darsligi shaklida, darsdan konspekt olib bo'lmaydigan darajada batafsil yozilsin.
- Lotincha terminlar kursiv (*italics*) formatida ko'rsatilsin.
- Sarlavhalarni chiroyli emoji va Visual Markdown formatda bezang. Biz uni saytda ReactMarkdown orqali ko'rsatamiz.`;

  // Try different free tier models in sequence to prevent per-model daily key quotas exhaustion
  const models = ["gemini-flash-latest", "gemini-3.1-flash-lite", "gemini-3.5-flash"];

  for (const model of models) {
    let delay = 6000;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`\n⏳ "${model}" orqali "${topicTitle}" mavzusi yaratilmoqda (Urinish ${attempt}/${retries})...`);
        const response = await ai.models.generateContent({
          model: model,
          contents: prompt
        });
        if (response && response.text) {
          return response.text.trim();
        }
        throw new Error("Bo'sh javob qaytdi.");
      } catch (error: any) {
        console.log(`⚠️ "${model}" dagi xatolik (Urinish ${attempt}): ${error.message || error}`);
        const isQuotaErr = error.status === 429 || error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED');
        
        if (isQuotaErr && attempt === retries) {
          console.log(`🛑 "${model}" dagi quota tugadi. Keyingi modelga o'tishni harakat qilamiz...`);
          break; // break the attempt loop to try next model
        }

        if (attempt < retries) {
          console.log(`Kutib qayta urinib ko'ramiz (soniya: ${delay/1000})...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 1.5;
        } else {
          throw error;
        }
      }
    }
  }
  throw new Error("Barcha mavjud bepul modellar orqali generatsiya qilish urinishlari muvaffaqiyatsiz bo'ldi.");
}

async function run() {
  console.log("=== ANATOMYA AI THEORY TEXTBOOK GENERATOR ===");
  try {
    const topicsSnap = await getDocs(collection(db, 'topics'));
    console.log(`Jami ${topicsSnap.docs.length} ta darslik mavzulari topildi.`);

    let generatedCount = 0;
    const MAX_TOPICS_PER_RUN = 3; // We will generate 3 topics per execution to prevent gateway/script timeouts

    const sortedDocs = [...topicsSnap.docs].sort((a, b) => {
      const aOrder = a.data().order || 0;
      const bOrder = b.data().order || 0;
      return aOrder - bOrder;
    });

    const pendingDocs = sortedDocs.filter(docObj => {
      const topicData = docObj.data();
      const topicTitle = topicData.title?.uz || topicData.title || "";
      const currentTheory = topicData.theory?.uz || "";
      const isPlaceholder = currentTheory.includes("tez orada yuklanadi") || currentTheory.includes("will be uploaded soon") || currentTheory.length < 300;
      if (!isPlaceholder) {
        console.log(`✅ To'ldirilgan darslik: "${topicTitle}" (Uzunligi: ${currentTheory.length} belgi). O'tkazib yuborildi.`);
      }
      return isPlaceholder;
    });

    console.log(`\n⏳ Jami ${pendingDocs.length} ta darslik bo'limi hali to'ldirilmagan. Parallel tarzda yuklashni boshlaymiz...\n`);

    const BATCH_SIZE = 1;
    for (let i = 0; i < pendingDocs.length; i += BATCH_SIZE) {
      const batch = pendingDocs.slice(i, i + BATCH_SIZE);
      console.log(`\n=== PAKET ${Math.floor(i / BATCH_SIZE) + 1} / ${Math.ceil(pendingDocs.length / BATCH_SIZE)} (Mavzu: ${batch.map(d => d.data().order).join(', ')}) ===`);

      const promises = batch.map(async (docObj) => {
        const topicId = docObj.id;
        const topicData = docObj.data();
        const topicTitle = topicData.title?.uz || topicData.title || "";
        
        try {
          const markdownTheory = await generateTheoryWithAI(topicTitle);
          const updatedTheory = {
            uz: markdownTheory,
            en: `Theoretical contents for ${topicTitle} has been comprehensively updated in Uzbek language. Please select Uzbek language to view the textbook.`,
            ru: `Теоретические материалы к разделу ${topicTitle} успешно обновлены на узбекском языке. Пожалуйста, переключите язык на узбекский для ознакомления.`
          };

          await updateDoc(doc(db, 'topics', topicId), {
            theory: updatedTheory
          });

          console.log(`🎯 [OK] Dars ${topicData.order}: "${topicTitle}" muvaffaqiyatli saqlandi! (${markdownTheory.length} ta simvol)`);
          return true;
        } catch (err: any) {
          console.error(`❌ [ERROR] Dars ${topicData.order} ("${topicTitle}") da xatolik:`, err.message || err);
          return false;
        }
      });

      const results = await Promise.all(promises);
      const successCountInBatch = results.filter(Boolean).length;
      generatedCount += successCountInBatch;

      if (i + BATCH_SIZE < pendingDocs.length) {
        console.log("\n🔄 Keyingi darsga o'tishdan oldin 3 soniya kutamiz...");
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    console.log(`\n=================== YUKLASH YAKUNLANDI ===================`);
    console.log(`Muvaffaqiyatli to'ldirilgan darslar: ${generatedCount} ta.`);
  } catch (error) {
    console.error("Umumiy xatolik:", error);
  }
}

run();
