import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  // CORS sarlavhalari
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ verified: false, reason: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY topilmadi");
    return res.status(500).json({ 
      verified: false, 
      confidence: 0, 
      reason: "Serverda GEMINI_API_KEY kaliti mavjud emas" 
    });
  }

  try {
    const { enrolledImage, currentImage } = req.body;

    // Zero-Trust tekshiruvi: ikkala rasm ham mavjud bo'lishi shart
    if (!enrolledImage || !currentImage) {
      return res.status(400).json({
        verified: false,
        confidence: 0,
        reason: "Taqqoslash uchun rasmlar to'liq yuborilmadi"
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Base64 formatini tozalash funksiyasi
    const cleanBase64 = (dataUrl: string) => {
      const match = dataUrl.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
      return match 
        ? { mimeType: `image/${match[1]}`, data: match[2] } 
        : { mimeType: 'image/jpeg', data: dataUrl };
    };

    const enrolledPart = cleanBase64(enrolledImage);
    const livePart = cleanBase64(currentImage);

    const promptText = `
Siz bank va davlat xizmatlari (OneID) darajasidagi qat'iy Biometrik Yuz Solishtirish Tizimisiz.

Vazifangiz:
1. SURAT 1 dagi (asl ro'yxatdan o'tgan foydalanuvchi) yuz tuzilishi bilan SURAT 2 dagi (kameradan olingan jonli kadr) yuzni sinchiklab solishtiring.
2. SURAT 2 da real, tirik inson yuzi borligini tekshiring (agar telefon/kompyuter ekrani ko'rsatilgan bo'lsa, qog'oz rasm tutilgan bo'lsa yoki kadrda inson bo'lmasa: isLive=false).
3. Ikkala suratdagi shaxs aynan bir odam bo'lsagina isMatch=true qiling.
4. O'xshashlik foizini (confidence) 0.0 dan 1.0 gacha aniqlang.
5. Faqat isMatch=true, isLive=true va confidence >= 0.85 bo'lgandagina verified=true bo'lishi shart.

Javobni FAQAT quyidagi JSON formatida qaytaring:
{
  "isMatch": boolean,
  "isLive": boolean,
  "confidence": number,
  "verified": boolean,
  "reason": "O'zbek tilida qisqa tushuntirish"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { text: promptText },
        { text: "SURAT 1 (Profil surati):" },
        { inlineData: { mimeType: enrolledPart.mimeType, data: enrolledPart.data } },
        { text: "SURAT 2 (Kameradagi jonli kadr):" },
        { inlineData: { mimeType: livePart.mimeType, data: livePart.data } }
      ],
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsedResult = JSON.parse(response.text || "{}");

    return res.status(200).json({
      verified: parsedResult.verified === true && (parsedResult.confidence ?? 0) >= 0.85,
      confidence: parsedResult.confidence ?? 0,
      isMatch: parsedResult.isMatch ?? false,
      isLive: parsedResult.isLive ?? false,
      reason: parsedResult.reason || (parsedResult.verified ? "Yuz muvaffaqiyatli tasdiqlandi" : "Yuz mos kelmadi")
    });

  } catch (error: any) {
    console.error("verify-face xatosi:", error);
    return res.status(500).json({
      verified: false,
      confidence: 0,
      reason: "Biometrik tahlil jarayonida xatolik yuz berdi. Qayta urinib ko'ring."
    });
  }
}
