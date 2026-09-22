# Face ID (biometrik kirish) — qanday ishlaydi va nima uchun endi "tiqilib qolmaydi"

## Oqim

1. Talaba tizimga kirgach `BiometricFaceGate` ochiladi (`src/components/BiometricFaceGate.tsx`).
2. Ro'yxatdan o'tmagan bo'lsa — kamera orqali bitta surat olinadi va `users/{uid}.faceIdPhoto` ga saqlanadi.
3. Ro'yxatdan o'tgan bo'lsa — kamera yoqilib, ~3 soniya davomida 5 ta kadr jimgina olinadi (foydalanuvchiga hech qanday "ko'z qisish / boshni burish" ko'rsatmasi berilmaydi) va `POST /api/verify-face` ga yuboriladi.
4. Server (`server.ts`) kadrlarni Gemini modeliga beradi, javobni `src/lib/faceVerificationPolicy.ts` dagi **sinovdan o'tgan** qoida bilan baholaydi va `verified: true/false` qaytaradi.
5. Faqat `verified === true` bo'lsagina talaba ichkariga kiritiladi. Boshqa har qanday holat (xato, timeout, noaniq javob) — **rad etish**.

## Ilgari nima buzilgan edi (va endi qanday oldini olingan)

| Muammo | Oqibati | Yechim |
|---|---|---|
| "Yuzni qayta suratga olish" tugmasi ishlamasdi: `faceIdEnrolled` bayrog'i jonli Firestore hujjatidan kelgani uchun mahalliy holat uni o'chira olmasdi | Eski/sifatsiz surat bilan ro'yxatdan o'tgan talaba abadiy tiqilib qolardi | `forceEnroll` holati bayroqni chetlab o'tadi; yangi surat eskisini almashtiradi, audit jurnaliga `re-enrollment` yoziladi |
| `faceIdEnrolled: true`, lekin `faceIdPhoto` yo'q | Tekshiruv hech qachon boshlanmasdi ("Tekshirishga tayyorlanmoqda..." abadiy) | Suratsiz "enrolled" holat ro'yxatdan o'tmagan deb qaraladi |
| Har bir sahifa yangilanishida yangi AI tekshiruvi | Kunlik Gemini limiti tez tugab, hamma uchun 429 → rad | Muvaffaqiyatli tekshiruv shu brauzer tabida 8 soat eslab qolinadi (`src/lib/faceIdSession.ts`, `FACE_ID_SESSION_TTL_MS`) |
| Bitta modelda 429/503 → darhol rad (retry yo'q edi) | Bir lahzalik band bo'lish = "xizmat ishlamayapti" | 4 ta model navbatma-navbat (har birining alohida limiti bor), vaqtinchalik xatolar backoff bilan qayta uriniladi |
| Serverda har bir chaqiriq uchun timeout yo'q | Vercel 60 s da funksiyani o'ldirar, brauzer HTML 504 olardi | Har bir model chaqirig'i ≤ 22 s, umumiy byudjet 50 s; har doim JSON javob qaytadi |
| Audit jurnali yozuvi `await` qilinardi | Offline/sekin internetda "Yuz tasdiqlandi!" ekrani abadiy osilib qolardi (Firestore yozuv va'dasi offline'da hal bo'lmaydi) | Audit yozuvlari fon rejimida, kirishga to'sqinlik qilmaydi |
| Qorong'i/qora kadrlar to'g'ridan-to'g'ri AI ga yuborilardi | Kafolatlangan rad + limit sarfi | Brauzerda yorug'lik tekshiruvi: qorong'i bo'lsa aniq ko'rsatma, AI chaqirilmaydi |
| Rad sababi noaniq edi | Talaba nima qilishni bilmasdi | Har bir javobda `code` (`NO_FACE`, `LOW_CONFIDENCE`, `NO_MATCH`, `SPOOF`, `AI_QUOTA`, `AI_NOT_CONFIGURED`, ...) va o'zbekcha ko'rsatma |
| Past ishonch / timeout da qo'lda qayta urinish kerak edi | Ko'p bosqichli tajriba | Yumshoq xatolarda bir marta avtomatik qayta suratga olish; `NO_MATCH`/`SPOOF`/limit da avtomatik qayta urinish yo'q |
| GEMINI_API_KEY yo'qligi hech qayerda ko'rinmasdi | Hamma "xizmat ishlamayapti" ko'rardi, sabab noma'lum | `GET /api/verify-face/health` + admin Diagnostika panelida "Face ID (AI yuz tekshiruvi)" qatori |
| Ro'yxatdan o'tgach `faceIdEnrolled` o'zgarishi `faceIdVerified` ni qayta `false` qilardi | Ro'yxatdan o'tish bilanoq gate qayta ochilish xavfi | `App.tsx` endi faqat `uid` o'zgarganda holatni tiklaydi |

## Sozlamalar (Vercel → Environment Variables)

| O'zgaruvchi | Majburiy | Tavsif |
|---|---|---|
| `GEMINI_API_KEY` | **Ha** | Usiz har bir tekshiruv `AI_NOT_CONFIGURED` bilan rad etiladi |
| `FACE_MATCH_THRESHOLD` | yo'q | Moslik chegarasi, `0.5–0.99` (yoki `50–99`). Standart `0.75` |
| `FACE_ID_MODELS` | yo'q | Vergul bilan ajratilgan model ro'yxati. Standart: `gemini-2.5-flash,gemini-3.7-flash,gemini-flash-latest,gemini-3.1-flash-lite` |

O'zgartirgandan keyin **Redeploy** qiling.

## Tekshirish

```bash
# Xizmat holati (200 = tayyor, 503 = kalit yo'q)
curl -s https://<domen>/api/verify-face/health

# Sof mantiq testlari (tarmoq va brauzer kerak emas)
node --test tests/faceVerificationPolicy.test.mjs tests/faceIdSession.test.mjs
```

Admin panel → **Diagnostika** bo'limida "Face ID (AI yuz tekshiruvi)" qatori yashil bo'lishi kerak.

## Xavfsizlik qoidalari (o'zgartirmang)

- `verified` faqat serverda, `decideVerification()` orqali hisoblanadi. Frontend uni qayta hisoblamaydi.
- Xato/timeout/noaniq javob = rad. Hech qayerda "xatoda kiritib yuborish" yo'li yo'q.
- Model javobidagi `verified: true` e'tiborga olinmaydi — faqat `faceDetected`, `isMatch`, `livenessPassed`, `spoofSuspected`, `confidence` maydonlari qoida orqali baholanadi.
- 8 soatlik eslab qolish faqat shu brauzer tabi va shu `uid` uchun; boshqa qurilma/brauzer yana Face ID dan o'tadi.
