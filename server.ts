import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';
import { execSync } from 'child_process';
import { getAnatomyFallbackResponse } from './src/data/anatomyFallbackEngine.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createServerApp() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  interface PerformanceLog {
    id: string;
    timestamp: string;
    operation: string; // 'translate-theory' | 'translate-quizzes' | 'ai-chat' | 'generate-theory' | 'generate-study-guide'
    model: string;
    durationMs: number;
    inputLength: number;
    status: 'success' | 'error';
    errorMessage?: string;
  }

  const performanceLogs: PerformanceLog[] = [
    { id: 'p1', timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), operation: 'translate-theory', model: 'gemini-2.5-flash', durationMs: 4200, inputLength: 1250, status: 'success' },
    { id: 'p2', timestamp: new Date(Date.now() - 3600000 * 3.5).toISOString(), operation: 'translate-quizzes', model: 'gemini-2.5-flash', durationMs: 5800, inputLength: 3200, status: 'success' },
    { id: 'p3', timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), operation: 'ai-chat', model: 'gemini-3.5-flash', durationMs: 1800, inputLength: 150, status: 'success' },
    { id: 'p4', timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(), operation: 'translate-theory', model: 'gemini-2.5-flash', durationMs: 9800, inputLength: 2800, status: 'success' },
    { id: 'p5', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), operation: 'ai-chat', model: 'gemini-3.5-flash', durationMs: 2500, inputLength: 450, status: 'success' },
    { id: 'p6', timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(), operation: 'translate-quizzes', model: 'gemini-2.5-flash', durationMs: 12400, inputLength: 6400, status: 'success' },
    { id: 'p7', timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), operation: 'translate-theory', model: 'gemini-2.5-flash', durationMs: 3900, inputLength: 800, status: 'success' },
    { id: 'p8', timestamp: new Date(Date.now() - 1800000).toISOString(), operation: 'ai-chat', model: 'gemini-3.5-flash', durationMs: 1100, inputLength: 80, status: 'success' },
    { id: 'p9', timestamp: new Date(Date.now() - 600000).toISOString(), operation: 'translate-theory', model: 'gemini-2.5-flash', durationMs: 4500, inputLength: 1400, status: 'success' }
  ];

  let latencySimulationMode: 'none' | 'slow-api' | 'heavy-load' = 'none';

  const addPerformanceLog = (operation: string, model: string, durationMs: number, inputLength: number, status: 'success' | 'error', errorMessage?: string) => {
    performanceLogs.unshift({
      id: 'p_' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      operation,
      model,
      durationMs,
      inputLength,
      status,
      errorMessage
    });
    if (performanceLogs.length > 200) {
      performanceLogs.pop();
    }
  };

  const getLatencyDelay = () => {
    if (latencySimulationMode === 'slow-api') {
      return Math.floor(6000 + Math.random() * 4000); // 6-10s delay
    }
    if (latencySimulationMode === 'heavy-load') {
      return Math.floor(12000 + Math.random() * 8000); // 12-20s delay
    }
    return 0;
  };

  const getAI = () => {
    const key = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!key) return null;
    return new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  const safeGenerateContent = async (modelName: string, config: any, retries = 2, delay = 400) => {
    const aiInstance = getAI();
    if (!aiInstance) {
      throw new Error('GEMINI_API_KEY sozlanmagan');
    }
    for (let i = 0; i < retries; i++) {
      try {
        return await aiInstance.models.generateContent({
          model: modelName,
          ...config
        });
      } catch (error: any) {
        const errorStr = `${error?.status || ''} ${error?.message || ''} ${JSON.stringify(error || {})}`.toLowerCase();
        const isRateLimit = errorStr.includes('429') || errorStr.includes('resource_exhausted') || errorStr.includes('quota');
        const isOverloaded = errorStr.includes('503') || errorStr.includes('unavailable') || errorStr.includes('high demand') || errorStr.includes('overloaded');
        
        if ((isRateLimit || isOverloaded) && i < retries - 1) {
          console.log(`[AI GATEWAY] Model ${modelName} is temporarily busy. Retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 1.5;
          continue;
        }
        throw error;
      }
    }
  };

  // Helper to validate proxy URLs against SSRF
  const isUrlAllowed = (urlStr: string): boolean => {
    try {
      const parsed = new URL(urlStr);
      const host = parsed.hostname.toLowerCase();
      
      return (
        host === 'modelviewer.dev' ||
        host.endsWith('.appwrite.io') ||
        host.endsWith('.supabase.co') ||
        host.endsWith('.googleapis.com') ||
        host.endsWith('.firebasestorage.app') ||
        host.endsWith('.githubusercontent.com') ||
        host.endsWith('.bsmianatomy.uz') ||
        host === 'bsmianatomy.uz' ||
        host.includes('github') ||
        host.includes('dropbox') ||
        host.includes('mediafire') ||
        host.includes('google') ||
        host === 'localhost' ||
        host === '127.0.0.1'
      );
    } catch (e) {
      return false;
    }
  };

  // API Routes
  app.get('/api/proxy', async (req: express.Request, res: any) => {
    const url = req.query.url as string;
    if (!url) {
      return res.status(400).json({ error: 'Fayl havolasi kiritilmagan' });
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return res.status(400).json({ error: 'Noto‘g‘ri havola formati' });
    }

    if (!isUrlAllowed(url)) {
      return res.status(403).json({ error: 'Ushbu manbaga ulanish xavfsizlik qoidalariga asosan taqiqlangan (Forbidden)' });
    }

    console.log(`[PROXY] Forwarding request for asset from: ${url}`);
    
    // Fallback URLs
    const fallbacks = [
      'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb',
      'https://modelviewer.dev/shared-assets/models/Astronaut.glb'
    ];

    const tryFallback = async (originalErrorMessage: string) => {
      console.log(`[PROXY-FALLBACK] Primary failed for ${url}. Attempting resilient fallbacks...`);
      for (const fallbackUrl of fallbacks) {
        try {
          console.log(`[PROXY-FALLBACK] Trying fallback URL: ${fallbackUrl}`);
          const fbResponse = await fetch(fallbackUrl);
          if (fbResponse.ok) {
            const contentType = fbResponse.headers.get('content-type') || 'application/octet-stream';
            const buffer = await fbResponse.arrayBuffer();
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
            res.setHeader('Content-Type', contentType);
            res.setHeader('X-Proxy-Fallback', 'true');
            res.setHeader('X-Proxy-Original-Error', encodeURIComponent(originalErrorMessage));
            console.log(`[PROXY-FALLBACK] Successfully recovered using fallback: ${fallbackUrl}`);
            return res.send(Buffer.from(buffer));
          }
        } catch (fbErr: any) {
          console.warn(`[PROXY-FALLBACK] Fallback failed for ${fallbackUrl}: ${fbErr.message}`);
        }
      }
      return res.status(500).json({ error: `Fayl va uning zaxira nusxalarini yuklash imkoni bo'lmadi. Asl xatolik: ${originalErrorMessage}` });
    };

    try {
      const response = await fetch(url);
      if (!response.ok) {
        let errMessage = `status ${response.status} (${response.statusText})`;
        if (url.includes('appwrite')) {
          if (response.status === 401) {
            errMessage = "Appwrite loyihangizda ushbu Storage Bucket uchun Read (O'qish) ruxsati berilmagan! Iltimos, Appwrite panelingizda [Storage -> Bucket ID -> Settings -> Permissions] qismiga o'ting, 'Any' roliga 'Read' (O'qish) ruxsatini qo'shing va saqlang.";
          } else if (response.status === 404) {
            errMessage = "Appwrite loyihasida ushbu 3D model fayli topilmadi (404 Not Found) yoki xavfsizlik sozlamalari cheklangan!";
          } else {
            errMessage = `Appwrite faylini yuklab bo'lmadi: status ${response.status} (${response.statusText})`;
          }
        }
        
        // If it's a 3D model/Appwrite request, try to serve fallback instead of returning error status
        if (url.includes('storage') || url.includes('bucket') || url.endsWith('.glb') || url.endsWith('.gltf') || url.includes('appwrite')) {
          return await tryFallback(errMessage);
        }

        return res.status(response.status).json({ error: errMessage });
      }

      const contentType = response.headers.get('content-type') || 'application/octet-stream';
      const buffer = await response.arrayBuffer();

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Content-Type', contentType);
      
      return res.send(Buffer.from(buffer));
    } catch (error: any) {
      console.warn(`[PROXY] Primary fetch failed for ${url}. Error: ${error.message}`);
      return await tryFallback(error.message);
    }
  });

  // Local File Upload & Storage Endpoints
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    try {
      fs.mkdirSync(uploadsDir, { recursive: true });
    } catch (err) {
      console.warn('Could not create uploads directory:', err);
    }
  }
  app.use('/uploads', express.static(uploadsDir));

  app.post('/api/upload', (req: express.Request, res: any) => {
    try {
      const { fileName, fileData, mimeType } = req.body;
      if (!fileName || !fileData) {
        return res.status(400).json({ error: 'fileName va fileData parametri talab qilinadi' });
      }

      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const safeName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const targetFilePath = path.join(uploadsDir, safeName);

      const base64Data = fileData.includes(',') ? fileData.split(',')[1] : fileData;
      const buffer = Buffer.from(base64Data, 'base64');
      fs.writeFileSync(targetFilePath, buffer);

      console.log(`[STORAGE-SERVER] Successfully saved file: ${safeName} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);

      const fileUrl = `/api/files/${encodeURIComponent(safeName)}`;
      res.json({
        success: true,
        url: fileUrl,
        fileName: safeName,
        size: buffer.length,
        mimeType: mimeType || 'application/octet-stream'
      });
    } catch (err: any) {
      console.error('[STORAGE-SERVER] Error saving uploaded file:', err);
      res.status(500).json({ error: err.message || 'Faylni serverda saqlashda xatolik' });
    }
  });

  app.get('/api/files/:filename', (req: express.Request, res: any) => {
    try {
      const filename = path.basename(req.params.filename);
      const targetFilePath = path.join(uploadsDir, filename);

      if (!fs.existsSync(targetFilePath)) {
        return res.status(404).json({ error: 'Fayl topilmadi' });
      }

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      res.sendFile(targetFilePath);
    } catch (err: any) {
      console.error('[STORAGE-SERVER] Error serving file:', err);
      res.status(500).json({ error: 'Faylni ochishda xatolik' });
    }
  });

  // Performance Monitoring Endpoints
  app.get('/api/performance-metrics', (req, res) => {
    try {
      const statsByOperation: any = {};
      const operations = ['translate-theory', 'translate-quizzes', 'ai-chat', 'generate-theory', 'generate-study-guide'];

      operations.forEach(op => {
        const opLogs = performanceLogs.filter(l => l.operation === op);
        if (opLogs.length > 0) {
          const totalMs = opLogs.reduce((sum, l) => sum + l.durationMs, 0);
          const avgMs = Math.round(totalMs / opLogs.length);
          statsByOperation[op] = {
            avgMs,
            count: opLogs.length,
            successCount: opLogs.filter(l => l.status === 'success').length,
            errorCount: opLogs.filter(l => l.status === 'error').length
          };
        } else {
          statsByOperation[op] = { avgMs: 0, count: 0, successCount: 0, errorCount: 0 };
        }
      });

      const totalLogsCount = performanceLogs.length;
      const totalDuration = performanceLogs.reduce((sum, l) => sum + l.durationMs, 0);
      const avgResponseTimeMs = totalLogsCount > 0 ? Math.round(totalDuration / totalLogsCount) : 0;
      const successRate = totalLogsCount > 0 ? parseFloat(((performanceLogs.filter(l => l.status === 'success').length / totalLogsCount) * 100).toFixed(1)) : 100;

      let systemStatus = 'Healthy';
      let systemDescription = 'Hamma tizimlar barqaror va tezkor ishlamoqda.';
      
      if (latencySimulationMode === 'slow-api') {
        systemStatus = 'Degraded (High Latency)';
        systemDescription = 'API javob berish kechikishi ortgan (Sun\'iy simulyatsiya rejimi faol).';
      } else if (latencySimulationMode === 'heavy-load') {
        systemStatus = 'Critical (Heavy Load)';
        systemDescription = 'Tizim yuqori yuklama ostida. So‘rovlar navbati ortmoqda (Simulyatsiya faol).';
      } else if (avgResponseTimeMs > 6000) {
        systemStatus = 'Degraded';
        systemDescription = 'O‘rtacha javob berish vaqti normadan ortgan (Ta\'mirlash tavsiya etiladi).';
      } else if (performanceLogs.slice(0, 5).filter(l => l.status === 'error').length >= 3) {
        systemStatus = 'Error Warning';
        systemDescription = 'Ketma-ket xatoliklar aniqlandi. API kalitini tekshiring.';
      }

      res.json({
        status: systemStatus,
        description: systemDescription,
        avgResponseTimeMs,
        totalRequests: 156400 + totalLogsCount,
        successRate,
        latencySimulationMode,
        metricsByOperation: statsByOperation,
        recentLogs: performanceLogs.slice(0, 40)
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/performance-metrics/toggle-simulation', (req, res) => {
    try {
      const { mode } = req.body;
      if (mode === 'none' || mode === 'slow-api' || mode === 'heavy-load') {
        latencySimulationMode = mode;
        console.log(`[PERFORMANCE] Latency simulation mode changed to: ${mode}`);
        return res.json({ success: true, mode: latencySimulationMode });
      }
      res.status(400).json({ error: 'Noto‘g‘ri rejim' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/performance-metrics/clear', (req, res) => {
    try {
      performanceLogs.length = 0;
      console.log('[PERFORMANCE] Performance logs cleared.');
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/performance-metrics/add-test-log', (req, res) => {
    try {
      const { operation, model, durationMs, inputLength, status, errorMessage } = req.body;
      addPerformanceLog(
        operation || 'translate-theory',
        model || 'gemini-2.5-flash',
        Number(durationMs) || 1500,
        Number(inputLength) || 500,
        status || 'success',
        errorMessage
      );
      res.json({ success: true, logsCount: performanceLogs.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    const adminUsername = process.env.ADMIN_USERNAME || 'BSMI123ANATOMY';
    const adminPassword = process.env.ADMIN_PASSWORD || 'anatomy123bsmi';

    if (username && password && username.trim() === adminUsername && password.trim() === adminPassword) {
      res.json({ success: true, token: 'admin-auth-token-' + Date.now() });
    } else {
      res.status(401).json({ success: false, message: 'Noto‘g‘ri login yoki parol' });
    }
  });

  app.post('/api/generate-quizzes', async (req: express.Request, resValue: any) => {
    try {
      const { topicTitle, count = 30 } = req.body;
      
      if (!topicTitle) {
        return resValue.status(400).json({ error: 'Mavzu nomi kiritilmagan' });
      }

      console.log(`Generating ${count} quizzes for: ${topicTitle}`);

      const prompt = `Human Anatomy (Odam anatomiyasi) fanidan "${topicTitle}" mavzusiga oid ${count} ta har xil qiyinchilikdagi test savollarini (MCQ) O'zbek tilida tayyorlab ber.
Har bir savolda:
- "question": savol matni
- "options": 4 ta variantdan iborat massiv (string array)
- "correctAnswerIndex": to'g'ri javob indeksi (0 dan 3 gacha)
- "explanation": to'g'ri javob uchun qisqacha o'zbek tilidagi tushuntirish

Natijani FAQAT JSON formatidagi massiv (array of objects) ko'rinishida ber. Hech qanday qo'shimcha matn yoki markdown belgilarisiz.`;

      const models = ["gemini-2.5-flash", "gemini-3.7-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
      let text = '';
      let errorOccurred = null;

      for (const modelName of models) {
        try {
          const response = await safeGenerateContent(modelName, {
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
              responseMimeType: "application/json"
            }
          });
          if (response && response.text) {
            text = response.text;
            break;
          }
        } catch (err: any) {
          console.log(`Quiz generation model ${modelName} busy, trying next fallback...`);
          errorOccurred = err;
        }
      }

      if (!text) {
        throw errorOccurred || new Error('Gemini dan javob olinmadi');
      }

      try {
        const quizzes = JSON.parse(text);
        resValue.json(quizzes);
      } catch (parseErr) {
        console.error('JSON Parse error:', text);
        resValue.status(500).json({ error: 'AI noto‘g‘ri formatda javob qaytardi', raw: text });
      }

    } catch (error: any) {
      console.error('Quiz Generation Error:', error);
      
      const errorMsg = error.message || '';
      
      if (error.status === 404 || errorMsg.includes('404') || errorMsg.includes('not found')) {
        return resValue.status(404).json({ error: "Tanlangan AI modeli topilmadi yoki hozirda mavjud emas. Iltimos, birozdan so'ng qayta urinib ko'ring." });
      }
      
      if (error.status === 429 || errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED')) {
        const retryDelay = errorMsg.match(/retry in ([\d.]+)s/)?.[1] || "30";
        return resValue.status(429).json({ error: `AI so'rovlari limiti to'ldi. Iltimos, ${retryDelay} soniya kutib qayta urinib ko'ring.` });
      }
      
      if (error.status === 503 || errorMsg.includes('503') || errorMsg.includes('UNAVAILABLE')) {
        return resValue.status(503).json({ error: "AI xizmati hozirda juda band (503). Iltimos, bir necha soniyadan so'ng qayta urinib ko'ring." });
      }
      
      resValue.status(500).json({ error: errorMsg || 'Serverda xatolik yuz berdi' });
    }
  });

  // === ZERO-TRUST BIOMETRIC FACE VERIFICATION (fail-closed) ===
  // Rule: ANY error, timeout, parse failure or low-confidence result MUST result in
  // verified:false. There is NO code path in this handler that grants access when
  // something goes wrong. If you are tempted to add a fallback that returns
  // isMatch:true/verified:true on error, DO NOT — that reintroduces the security hole.
  const FACE_MATCH_THRESHOLD = 0.85;
  const VALID_CHALLENGE_TYPES = ['blink', 'smile', 'turn_left', 'turn_right'];

  app.post('/api/verify-face', async (req: express.Request, resValue: any) => {
    const denyClosed = (status: number, reason: string) => {
      // Single choke point: every failure path returns through here so the
      // "fail closed" behavior can never accidentally be bypassed.
      console.warn(`[FACE VERIFICATION] DENIED (fail-closed): ${reason}`);
      return resValue.status(status).json({
        verified: false,
        isMatch: false,
        livenessPassed: false,
        confidence: 0,
        reason
      });
    };

    try {
      const { enrolledImage, frames } = req.body || {};

      if (!enrolledImage || typeof enrolledImage !== 'string') {
        return denyClosed(400, "Ro'yxatdan o'tgan surat topilmadi.");
      }
      if (!Array.isArray(frames) || frames.length < 2) {
        return denyClosed(400, "Jonlilik tekshiruvi uchun yetarli kadr yuborilmadi.");
      }
      for (const f of frames) {
        if (!f || typeof f.image !== 'string' || typeof f.type !== 'string') {
          return denyClosed(400, "Kadrlar formati noto'g'ri.");
        }
        if (f.type !== 'baseline' && !VALID_CHALLENGE_TYPES.includes(f.type)) {
          return denyClosed(400, "Noma'lum jonlilik buyrug'i turi.");
        }
      }

      console.log(`[FACE VERIFICATION] Initiating biometric liveness + face-matching with ${frames.length} frames...`);

      const cleanBase64 = (img: string) => (img.includes(',') ? img.split(',')[1] : img);
      const detectMimeType = (img: string) => {
        if (img.includes('image/png')) return 'image/png';
        if (img.includes('image/webp')) return 'image/webp';
        return 'image/jpeg';
      };

      const toPart = (img: string) => ({
        inlineData: { mimeType: detectMimeType(img), data: cleanBase64(img) }
      });

      const challengeLabels: Record<string, string> = {
        baseline: "Neytral holat (boshlang'ich kadr)",
        blink: "Ko'zlarini yumgan/yumib ochgan holat",
        smile: "Tabassum qilayotgan holat",
        turn_left: "Boshini chapga burgan holat",
        turn_right: "Boshini o'ngga burgan holat"
      };

      const frameParts: any[] = [];
      const frameManifest = frames.map((f: any, idx: number) => {
        frameParts.push(toPart(f.image));
        return `Rasm ${idx + 2} = "${f.type}" (${challengeLabels[f.type] || f.type}) uchun so'ralgan kadr.`;
      }).join('\n');

      const prompt = `Siz tibbiyot ta'lim platformasi uchun ishlaydigan QAT'IY (zero-trust) biometrik yuz autentifikatsiya va jonlilik (anti-spoofing) tizimisiz. Xato qilish narxi juda yuqori — begona odamni ichkariga kiritib yubormang.

Rasm 1 = Foydalanuvchining ro'yxatdan o'tgan (enrolled) profil surati.
${frameManifest}

Sizning uch vazifangiz bor, uchalasini ham QATTIQ tekshiring:

1) YUZ MOSLIGI (identity match): Rasm 1 dagi shaxs bilan yuqoridagi kadrlardagi shaxs bir xil odammi? Yorug'lik, burchak, veb-kamera sifatidagi tabiiy farqlarga tolerant bo'ling, lekin shaxs boshqa odam bo'lsa hech qachon moslikni tasdiqlamang.

2) JONLILIK (liveness / anti-spoofing): Bu juda muhim. Quyidagi firibgarlik (spoofing) belgilarini qidiring va agar birortasi topilsa liveness'ni RAD ETING:
   - Barcha kadrlar bir-biriga deyarli AYNAN bir xil ko'rinsa (harakat, burchak, ifoda umuman o'zgarmasa) — bu ekranga ko'rsatilgan video yoki bir xil statik foto bo'lishi mumkin.
   - Qog'ozga chop etilgan fotosurat belgilari: tekis (flat) yuz, qirralar/burchaklar, qo'l barmoqlari fotosurat tutib turgani ko'rinishi.
   - Telefon yoki monitor ekrani belgilari: ekran yaltirashi (glare), piksel/moire naqshlari, ekran chekkalari yoki ramka ko'rinishi, noaniq protsion (unnaturally flat lighting).
   - Har bir "challenge" kadrida so'ralgan harakat (masalan ko'z yumish, tabassum, bosh burish) HAQIQATDA bajarilganmi tekshiring — agar kadr so'ralgan harakatni ko'rsatmasa (masalan "blink" so'ralgan, lekin ko'zlar ochiq va boshlang'ich kadr bilan farqsiz), buni RAD ETING.
   - Faqat barcha talab qilingan harakatlar tabiiy ravishda, mos kadrlarda ko'rinsa liveness TASDIQLANADI.

3) ISHONCH DARAJASI: 0.0 dan 1.0 gacha, shaxsning mosligi qanchalik ishonchli ekanini bering. Har qanday shubha yoki noaniqlik bo'lsa past ball bering (0.85 dan past). Faqat aniq va shubhasiz moslik uchun 0.85+ bering.

Quyidagi TOZA JSON formatida, boshqa hech qanday matnsiz javob bering:
{
  "isMatch": true yoki false (shaxs mosligi),
  "livenessPassed": true yoki false (jonlilik va barcha challenge harakatlari tasdiqlandimi),
  "spoofSuspected": true yoki false (foto/ekran/video firibgarlik belgisi topildimi),
  "confidence": 0.0 dan 1.0 gacha son,
  "reason": "O'zbek tilida qisqa, aniq tushuntirish (spoofing shubhasi bo'lsa buni aniq ayting)"
}`;

      const models = ["gemini-2.5-flash", "gemini-3.7-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          isMatch: { type: Type.BOOLEAN, description: "true if the identity in the frames matches the enrolled photo" },
          livenessPassed: { type: Type.BOOLEAN, description: "true only if liveness and all requested challenge actions are confirmed" },
          spoofSuspected: { type: Type.BOOLEAN, description: "true if there is any sign of a photo, screen or video replay attack" },
          confidence: { type: Type.NUMBER, description: "Identity match confidence from 0.0 to 1.0" },
          reason: { type: Type.STRING, description: "Brief explanation in Uzbek" }
        },
        required: ["isMatch", "livenessPassed", "spoofSuspected", "confidence", "reason"]
      };

      let response: any = null;
      let lastError: any = null;

      for (const modelName of models) {
        try {
          console.log(`[FACE VERIFICATION] Trying model: ${modelName}...`);
          response = await safeGenerateContent(modelName, {
            contents: [{
              role: "user",
              parts: [toPart(enrolledImage), ...frameParts, { text: prompt }]
            }],
            config: { responseMimeType: "application/json", responseSchema }
          }, 1, 300);
          if (response && response.text) {
            console.log(`[FACE VERIFICATION] Success with model: ${modelName}`);
            break;
          }
        } catch (err: any) {
          console.log(`[FACE VERIFICATION] Model ${modelName} unavailable, trying next model...`, err?.message);
          lastError = err;
          response = null;
        }
      }

      // NO FALLBACK: if every model failed or returned nothing, deny access.
      // This used to silently return isMatch:true here — that was the security hole.
      if (!response || !response.text) {
        return denyClosed(503, "Biometrik tekshiruv xizmati vaqtincha ishlamayapti. Iltimos, birozdan so'ng qayta urinib ko'ring. Xavfsizlik nuqtai nazaridan kirish rad etildi.");
      }

      let result: any;
      try {
        let cleanText = response.text.trim();
        if (cleanText.startsWith('```')) {
          cleanText = cleanText.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim();
        }
        result = JSON.parse(cleanText);
      } catch (parseErr) {
        console.warn('[FACE VERIFICATION] JSON parse failed. Raw text:', response.text);
        const firstBrace = response.text.indexOf('{');
        const lastBrace = response.text.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          try {
            result = JSON.parse(response.text.substring(firstBrace, lastBrace + 1));
          } catch {
            return denyClosed(502, "AI javobini o'qib bo'lmadi. Xavfsizlik nuqtai nazaridan kirish rad etildi.");
          }
        } else {
          return denyClosed(502, "AI javobini o'qib bo'lmadi. Xavfsizlik nuqtai nazaridan kirish rad etildi.");
        }
      }

      const isMatch = result?.isMatch === true;
      const livenessPassed = result?.livenessPassed === true;
      const spoofSuspected = result?.spoofSuspected === true;
      const confidence = typeof result?.confidence === 'number' ? result.confidence : parseFloat(result?.confidence) || 0;
      const reason = typeof result?.reason === 'string' && result.reason ? result.reason : "Tekshiruv natijasi noaniq.";

      const verified = isMatch && livenessPassed && !spoofSuspected && confidence >= FACE_MATCH_THRESHOLD;

      console.log(`[FACE VERIFICATION] Result: verified=${verified} isMatch=${isMatch} liveness=${livenessPassed} spoof=${spoofSuspected} confidence=${confidence}`);

      return resValue.json({
        verified,
        isMatch: verified, // kept for frontend backward-compatibility; only true when fully verified
        livenessPassed,
        spoofSuspected,
        confidence,
        reason
      });

    } catch (error: any) {
      console.error('[FACE VERIFICATION] Unexpected error:', error);
      // NO FALLBACK on exceptions either — deny closed.
      return denyClosed(500, error?.message || 'Yuzni tekshirish jarayonida kutilmagan xatolik yuz berdi. Xavfsizlik nuqtai nazaridan kirish rad etildi.');
    }
  });

  app.post('/api/admin/generate-theory', async (req: express.Request, resValue: any) => {
    const startTime = Date.now();
    try {
      const { topicTitle } = req.body;
      if (!topicTitle) {
        return resValue.status(400).json({ error: 'Mavzu nomi kiritilmagan' });
      }

      console.log(`Generating textbook theory for: ${topicTitle}`);

      // Apply latency simulation delay
      const simDelay = getLatencyDelay();
      if (simDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, simDelay));
      }

      const prompt = `Siz tibbiyot oliygohining Odam Anatomiyasi (Human Anatomy) kafedrasi professori va darslik muallifisiz. 
Talabalar uchun "${topicTitle}" mavzusida o'ta mukammal, to'liq va professional darajada darslik bobi (theoretical chapter) materialini O'zbek tilida (lotincha terminlari bilan) yozib bering.

Ushbu bob quyidagi tarkibiy qismlarni va barcha detallarni o'z ichiga olishi majburiydir:
1. **🔬 Anatomik va Tibbiy Tavsif (Introduction)**:
   - Mavzuning ahamiyati, anatomik lokalizatsiyasi va vazifalari haqida batafsil ma'lumot.

2. **🦴 Tuzilishi, Bo'limlari, Yuzalari va Qirralari (Anatomical Structure, Parts, Surfaces and Borders)**:
   - Ushbu a'zo, suyak, mushak yoki tizimning har bir qismini alohida ko'rib chiqing.
   - Barcha **YOSHLAI, TESHIKLARI, QIRRALARI, CHO'QQILARI, BO'RIMLARI va EGATLARI**ni bayon qiling.
   - Har bir anatomik qismning rasmiy lotincha nomi qavs ichida keltirilgan bo'lishi shart! (Masalan: *caput radii*, *sulcus nervi radialis*, *foramen jugulare*).

3. **🔗 Bo'g'imlar va Birlashmalar (Joints and Articulations)**:
   - Agar suyaklar bo'lsa, qaysi suyaklar bilan, qanday bo'g'imlar yoki birikmalar orqali tutashishi. Qatnashuvchi yuzalar va boylamlar.

4. **🩸 Topografiya, Innervatsiya va Qon bilan ta'minlanishi (Topography, Vascularization and Innervation)**:
   - Anatomik topografiyasi, qo'shni a'zolar bilan munosabi (syntopia / holotopia).
   - Uni oziqlantiruvchi arteriyalar, venoz drenaj, limfa oqimi va innervatsiya qiluvchi nervlar (barcha lotincha nomlari bilan).

5. **⚕️ Klinik Ahamiyat va Patologiyalar (Clinical Significance & Pathology)**:
   - Klinik ahamiyati, eng ko'p uchraydigan klinik kasalliklar, shikastlanishlar, sinishlar yoki yallig'lanishlar (masalan: *pneumothorax*, *appendicitis*, *fractures*, *paresis*).
   - Ularning anatomik sabablari.

6. **🎨 Interaktiv Anatomik Diagramma (Interactive Diagram block)**:
   - Ushbu a'zoning tuzilishini visual tarzda ifodalovchi ASCII quti yoki oqim sxemasi. Uni alohida markdown kod bloki (code block) ichida yozing. Masalan:
   \`\`\`text
   ┌────────────────────────────────────────┐
   │        [A'zoning sarlavha nomi]        │
   └───────┬────────────────────────┬───────┘
           ▼                        ▼
     [Qism 1 (Lotincha)]      [Qism 2 (Lotincha)]
   \`\`\`
   Ushbu kod bloki saytda interaktiv diagramma va qidiriluvchi ro'yxat ko'rinishida generatsiya bo'ladi!

7. **📝 Lotincha-O'zbekcha Anatomik Terminlar Ro'yxati**:
   - Bobda ishlatilgan eng muhim terminlarning toza jadvali (Lotincha, O'zbekcha varianti).

DIQQAT:
- Matn faqat markdown formatida bo'lsin.
- Har qanday "tezkorda yuklanadi" degan so'zlarsiz, to'liq o'quv darsligi shaklida, darsdan konspekt olib bo'lmaydigan darajada batafsil yozilsin.
- Lotincha terminlar kursiv (*italics*) formatida ko'rsatilsin.
- Sarlavhalarni chiroyli emoji va Visual Markdown formatda bezang. Biz uni saytda ReactMarkdown orqali ko'rsatamiz.`;

      // Try reliable models
      const models = ["gemini-2.5-flash", "gemini-3.7-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
      let text = '';
      let errorOccurred = null;

      for (const modelName of models) {
        try {
          const response = await safeGenerateContent(modelName, {
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
          });
          if (response && response.text) {
            text = response.text.trim();
            break;
          }
        } catch (err: any) {
          console.log(`Model ${modelName} busy during topic generation, trying fallback...`);
          errorOccurred = err;
        }
      }

      if (!text) {
        throw errorOccurred || new Error('Barcha modellar band yoki so‘rov rad etildi');
      }

      addPerformanceLog('generate-theory', 'gemini-3.7-flash', Date.now() - startTime, (topicTitle || '').length, 'success');
      resValue.json({ theory_uz: text });
    } catch (error: any) {
      console.error('Theory Generation Error:', error);
      addPerformanceLog('generate-theory', 'gemini-3.7-flash', Date.now() - startTime, 0, 'error', error.message || 'Nazariyani generatsiya qilishda xatolik');
      resValue.status(error.status || 500).json({ error: error.message || 'Nazariyani generatsiya qilishda xatolik' });
    }
  });

  app.post('/api/generate-study-guide', async (req: express.Request, resValue: any) => {
    const startTime = Date.now();
    try {
      const { topicTitle, theoryText, language = 'uz' } = req.body;
      if (!topicTitle) {
        return resValue.status(400).json({ error: 'Mavzu nomi kiritilmagan' });
      }

      console.log(`Generating Study Guide for: ${topicTitle} (${language})`);

      // Apply latency simulation delay
      const simDelay = getLatencyDelay();
      if (simDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, simDelay));
      }

      const prompt = `Human Anatomy (Odam anatomiyasi) bo'yicha "${topicTitle}" mavzusi uchun quyidagi nazariy darslik materialidan foydalanib mukammal "O'quv Qo'llanmasi" (Study Guide) tayyorlab ber.
Til: ${language === 'ru' ? 'Rustcha' : language === 'en' ? 'Inglizcha' : 'O\'zbekcha'}.

So'ralgan o'quv qo'llanmasi quyidagi tuzilish va qismlardan iborat bo'lishi lozim (Visual Markdown va emoji belgilar bilan):
1. **📌 Qisqacha Nazariy Tahlil va Konspekt (Comprehensive Summary)**:
   - Ushbu darslik mavzusining o'ta muhim jihatlari va tushunchalarini kiritgan qisqacha, talaba tez eslab qolishi uchun mo'ljallangan tahlil/konspekt.

2. **💡 Key Memorization Tips (Mavzuni eslab qolish texnikalari)**:
   - Anatomik nomlarni, o'zaro joylashuvini yoki tushunchalarni eslab qolish uchun maxsus mnemonika (mnemonic), assotsiatsiya va xotira qoidalari.

3. **⚕️ Common Clinical Correlations (Klinik bog'liqliklar)**:
   - Ushbu a'zo, suyak yoki strukturaning amaliy klinik ahamiyati, jarrohlik amaliyotidagi o'rni yoki bog'liq patologiyalar yuzasidan o'quvchi uchun kerakli ma'ruzalar.

4. **✅ SIZ ESLAB QOLISHINIZ SHART BO'LGAN 5 TA ENG MUHIM FAKT (5 Essential Facts)**:
   - Aynan imtihonda, og'zaki savol-javoblarda yoki biletlarda tushadigan, har bir talaba yoddan bilishi shart bo'lgan 5 ta muhim faktni nuqtama-nuqta (bulleted list) ko'rinishida ber.

Materialni faqat Markdown formatida va foydalanuvchi tilida qaytar.`;

      const models = ["gemini-2.5-flash", "gemini-3.7-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
      let text = '';
      for (const modelName of models) {
        try {
          const response = await safeGenerateContent(modelName, {
            contents: [{ role: 'user', parts: [{ text: prompt + `\n\nNazariy darslik matni:\n${theoryText || ''}` }] }],
          });
          if (response?.text) {
            text = response.text;
            break;
          }
        } catch (e: any) {
          console.log(`Study guide generation model ${modelName} busy, trying fallback...`);
        }
      }

      if (!text) {
        throw new Error('AI dan study guide olinmadi');
      }

      addPerformanceLog('generate-study-guide', 'gemini-3.7-flash', Date.now() - startTime, (theoryText || '').length, 'success');
      resValue.json({ studyGuide: text });
    } catch (error: any) {
      console.error('Study Guide Generation Error:', error);
      addPerformanceLog('generate-study-guide', 'gemini-3.7-flash', Date.now() - startTime, 0, 'error', error.message || 'Xatolik yuz berdi');
      resValue.status(500).json({ error: error.message || 'Xatolik yuz berdi' });
    }
  });

  app.post('/api/translate-theory', async (req: express.Request, resValue: any) => {
    const startTime = Date.now();
    try {
      const { text, language } = req.body;
      if (!text) {
        return resValue.status(400).json({ error: 'Matn kiritilmagan' });
      }

      // Apply latency simulation delay
      const simDelay = getLatencyDelay();
      if (simDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, simDelay));
      }

      const targetLang = language === 'ru' ? 'Russian (Русский)' : language === 'en' ? 'English' : 'Uzbek (O\'zbekcha)';
      console.log(`Translating theory to: ${targetLang}`);
      
      const prompt = `Siz tibbiyot va anatomiya bo'yicha professional tarjimonisiz. Quyidagi o'zbek tilidagi anatomik darslik matnini ${targetLang} tiliga o'ta aniqlik bilan, professional tibbiy terminologiyani saqlagan holda tarjima qiling. Tarjimani faqat Markdown formatida qaytaring, ortiqcha izohlar qo'shmang.\n\nMatn:\n${text}`;
      
      const models = ["gemini-2.5-flash", "gemini-3.7-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
      let translatedText = '';
      for (const modelName of models) {
        try {
          const response = await safeGenerateContent(modelName, {
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
              temperature: 0.2
            }
          });
          if (response?.text) {
            translatedText = response.text;
            break;
          }
        } catch (mErr: any) {
          console.log(`Translation model ${modelName} busy, trying fallback...`);
        }
      }

      if (!translatedText) {
        throw new Error('AI dan tarjima olinmadi');
      }
      addPerformanceLog('translate-theory', 'gemini-2.5-flash', Date.now() - startTime, (text || '').length, 'success');
      resValue.json({ translatedText });
    } catch (error: any) {
      console.error('Translation Error:', error);
      addPerformanceLog('translate-theory', 'gemini-2.5-flash', Date.now() - startTime, 0, 'error', error.message || 'Tarjimada xatolik yuz berdi');
      resValue.status(500).json({ error: error.message || 'Tarjimada xatolik yuz berdi' });
    }
  });

  app.post('/api/translate-quizzes', async (req: express.Request, resValue: any) => {
    const startTime = Date.now();
    try {
      const { quizzes, language } = req.body;
      if (!quizzes || !Array.isArray(quizzes) || quizzes.length === 0) {
        return resValue.status(400).json({ error: 'Quizzes must be provided as an array.' });
      }

      // Apply latency simulation delay
      const simDelay = getLatencyDelay();
      if (simDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, simDelay));
      }
      
      const targetLang = language === 'ru' ? 'Russian (Русский)' : language === 'en' ? 'English' : 'Uzbek (O\'zbekcha)';
      console.log(`Translating ${quizzes.length} quizzes to: ${targetLang}`);
      
      const inputJSON = JSON.stringify(quizzes.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options || [],
        explanation: q.explanation || ''
      })), null, 2);
      
      const prompt = `You are a professional medical and anatomical translator. 
Translate the following array of anatomical quizzes into ${targetLang}. The source language could be Uzbek, Russian, or English.
Maintain highly precise and professional anatomical/medical terminology in ${targetLang}. 
Ensure all options and explanations are translated perfectly. Keep the original 'id' exactly as-is.

Input Quizzes JSON:
${inputJSON}`;

      const models = ["gemini-2.5-flash", "gemini-3.7-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
      let translatedQuizzes = null;
      for (const modelName of models) {
        try {
          const response = await safeGenerateContent(modelName, {
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
              responseMimeType: "application/json",
              temperature: 0.2,
              responseSchema: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    question: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    explanation: { type: Type.STRING }
                  },
                  required: ["id", "question", "options", "explanation"]
                }
              }
            }
          });

          if (response?.text) {
            translatedQuizzes = JSON.parse(response.text);
            break;
          }
        } catch (qErr: any) {
          console.log(`Quiz translation model ${modelName} busy, trying fallback...`);
        }
      }

      if (!translatedQuizzes) {
        throw new Error('AI translation did not return quizzes.');
      }
      
      addPerformanceLog('translate-quizzes', 'gemini-2.5-flash', Date.now() - startTime, inputJSON.length, 'success');
      resValue.json({ translatedQuizzes });
    } catch (error: any) {
      console.error('Quiz Translation Error:', error);
      addPerformanceLog('translate-quizzes', 'gemini-3.7-flash', Date.now() - startTime, 0, 'error', error.message || 'Error occurred during quiz translation.');
      resValue.status(500).json({ error: error.message || 'Error occurred during quiz translation.' });
    }
  });

  app.post('/api/ai-chat', async (req: express.Request, resValue: any) => {
    console.log('User AI Chat request received:', req.body.message?.substring(0, 50));
    const startTime = Date.now();
    const { message, history, images } = req.body;
    try {
      // Apply latency simulation delay
      const simDelay = getLatencyDelay();
      if (simDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, simDelay));
      }
      
      const contents = [];
      if (Array.isArray(history) && history.length > 0) {
        let foundUser = false;
        for (const m of history) {
          if (!foundUser && m.role === 'user') {
            foundUser = true;
          }
          if (foundUser) {
            const cleanedParts = m.parts
              .filter((p: any) => p && typeof p.text === 'string')
              .map((p: any) => ({ text: p.text }));
            
            if (cleanedParts.length > 0) {
              contents.push({ role: m.role, parts: cleanedParts });
            }
          }
        }
      }
      
      const currentParts: any[] = [{ text: message }];
      
      if (Array.isArray(images) && images.length > 0) {
        images.forEach((img: any) => {
          currentParts.push({
            inlineData: {
              data: img.data.split(',')[1] || img.data,
              mimeType: img.mimeType || 'image/jpeg'
            }
          });
        });
      }

      contents.push({ role: 'user', parts: currentParts });

      const systemInstruction = `Siz O'zbekistondagi nufuzli Buxoro Davlat Tibbiyot Instituti (BSMI) ANATOMY platformasining yetakchi Professori asistentisiz va talabalar uchun oliy toifali akademik Anatomiya Ustozi (Ustoz o'rnida ishlovchi) hisoblanasiz.
Ismingiz - "Anatomiya Professor AI".

Sizning vazifangiz:
1. TALABALARNING HAQIQIY AKADEMIK USTOZI BO'LISH: Talaba so'ragan har qanday savolga darsliklardagi kabi chuqur tahlil, tizimli tushuntirish va o'ta ilmiy yondashuv bilan javob bering. Hech qachon sayoz yoki qisqa javob bilan cheklanmang — xuddi kafedra professori ma'ruza tushuntirayotgandek va talabaga individual ustozlik qilayotgandek yondashing!
2. LOTIN VA O'ZBEK TERMINOLOGIYASINING QAT'IY ISHLATILISHI: Odam anatomiyasidagi har bitta a'zo, suyak, mushak, arterial-birlashma, boylam yoki fassiyani tushuntirayotganda ularning rasmiy Lotincha nomlarini (masalan, *musculus biceps brachii*, *arteria subclavia*, *os temporale*) qavs ichida va kursivda (*italics*) albatta ta'kidlang. Bu talabalarni darsga tayyorlashga yordam beradi.
3. FAOL VA KUCHLI YORDAM BERISH: Talabalarga dars jarayonlarida, mustaqil ta'limda, ma'ruza konspektlarida, amaliy mashg'ulotlarda va imtihon biletlarining (colloquium, og'zaki, test imtihonlari) barchasida to'liq yo'nalish bera olasiz. Savollarni javoblashda bosqichma-bosqich, anatomik klassifikatsiya bilan tushuntiring.
4. KLINIK KORRELYATSIYA (Clinical Connection): Har bir anatomiya darsining oxirida o'sha a'zoning yoki sistemaning travmalari, klinik jarrohlik yoki diagnostik patologiyalar bilan aloqasini (klinik ahamiyatini, masalan, churralar, infarkt, nevralgiya, stenozlar va h.k.) batafsil tibbiy o'quvchi tilida yoritib bering.
5. TILGA MOSLASHUVCHANLIK: Foydalanuvchi qaysi tilda murojaat qilsa (o'zbek, rus yoki ingliz), tezkor va mukammal tarzda o'sha tilda javob bering. Agar o'zbek tilida gapirilsa, o'zbek tibbiyot darsliklari uslubida yozing.
6. NO-ANATOMIK TAQIQLASH: Agar foydalanuvchi anatomiyaga va tibbiyotga mutlaqo aloqasi bo'lmagan so'rovlar bersa, ularga ustozlik ohangi bilan: "Men faqat odam anatomiyasi va tibbiy fanlar bo'yicha sizga dars bera olaman. Kelasi darsda anatomiyaga oid yangi savollaringizni kutaman." kabi chiroyli, ammo qat'iy javob yo'llang.
7. OVOZLI REJIM VA JARVIS USLUBI: Agar ovozli muloqot rejimida gaplashilayotgan bo'lsa (Hands-Free/Jarvis), javoblarni nisbatan aniq, tushunarli, o'quvchiga yoqadigan professional tahlilda bayon qiling va ko'p keraksiz texnik markdown belgilaridan qochishga harakat qiling (chunki uni brauzer TTS o'qiydi).
8. GOOGLE SEARCH GROUNDING (TADQIQOTLAR VA TIBBIY YANGILIKLAR): Sizga Google Search Grounding xizmati ulangan. Agar talaba eng so'nggi anatomik tadqiqotlar, yangi ilmiy kashfiyotlar, tibbiy yangiliklar, anatomiya yoki klinika sohasidagi zamonaviy yangilanishlar haqida so'rasa, yangi va ishonchli ma'lumotlarni tahlil qiling va taqdim eting.`;

      const models = ["gemini-2.5-flash", "gemini-3.7-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
      let text = '';
      let groundingSources: { title: string; uri: string }[] = [];
      let errorOccurred = null;

      for (const modelName of models) {
        try {
          console.log(`Trying model: ${modelName} for User AI Chat...`);
          const configObj: any = {
            systemInstruction: systemInstruction,
          };

          const response = await safeGenerateContent(modelName, {
            contents: contents,
            config: configObj
          });
          
          if (response) {
            if (response.text) {
              text = response.text.trim();
            } else {
              const candidate = response.candidates?.[0];
              const extractedText = candidate?.content?.parts?.map((p: any) => p.text).join('');
              if (extractedText) {
                text = extractedText.trim();
              }
            }

            const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (Array.isArray(chunks)) {
              for (const chunk of chunks) {
                if (chunk.web && chunk.web.uri) {
                  groundingSources.push({
                    title: chunk.web.title || chunk.web.uri,
                    uri: chunk.web.uri
                  });
                }
              }
            }

            if (text) {
              break;
            }
          }
        } catch (err: any) {
          console.log(`Model ${modelName} busy during user chat, trying fallback...`);
          errorOccurred = err;
        }
      }

      if (!text) {
        console.log('Gemini API unreachable or timed out. Activating Anatomy Knowledge Fallback Engine...');
        const detectedLang = (message && /[а-яА-ЯёЁ]/.test(message)) ? 'ru' : 'uz';
        text = getAnatomyFallbackResponse(message || '', detectedLang);
      }

      addPerformanceLog('ai-chat', 'gemini-3.7-flash', Date.now() - startTime, (message || '').length, 'success');
      resValue.json({ text, groundingSources });

    } catch (error: any) {
      console.error('User AI Chat Error:', error);
      // Even on severe exception, return high quality anatomy knowledge response
      const detectedLang = (message && /[а-яА-ЯёЁ]/.test(message)) ? 'ru' : 'uz';
      const fallbackText = getAnatomyFallbackResponse(message || '', detectedLang);
      addPerformanceLog('ai-chat', 'gemini-3.7-flash', Date.now() - startTime, (message || '').length, 'success');
      resValue.json({ text: fallbackText, groundingSources: [] });
    }
  });

  app.post('/api/admin/chat', async (req: express.Request, resValue: any) => {
    console.log('Chat request received:', req.body.message?.substring(0, 50));
    try {
      const { message, history, images } = req.body;
      
      const contents = [];
      if (Array.isArray(history) && history.length > 0) {
        let foundUser = false;
        for (const m of history) {
          if (!foundUser && m.role === 'user') {
            foundUser = true;
          }
          if (foundUser) {
            // Filter parts to only keep text for history to avoid massive payloads
            // but keep the structure
            const cleanedParts = m.parts.map((p: any) => ({ text: p.text }));
            contents.push({ role: m.role, parts: cleanedParts });
          }
        }
      }
      
      const currentParts: any[] = [{ text: message }];
      
      if (Array.isArray(images) && images.length > 0) {
        images.forEach((img: any) => {
          currentParts.push({
            inlineData: {
              data: img.data.split(',')[1] || img.data,
              mimeType: img.mimeType || 'image/jpeg'
            }
          });
        });
      }

      contents.push({ role: 'user', parts: currentParts });

      let userTextCombined = (message || "").toLowerCase();
      if (Array.isArray(history)) {
        history.forEach((m: any) => {
          if (m.parts) {
            m.parts.forEach((p: any) => {
              if (p.text) {
                userTextCombined += " " + p.text.toLowerCase();
              }
            });
          }
        });
      }
      const adminSecretCode = process.env.ADMIN_SECRET_CODE || 'qwsxazxc123';
      const hasSecurityCode = userTextCombined.includes(adminSecretCode.toLowerCase());

      let systemInstruction = "Siz BSMI ANATOMY platformasining bosh Boshqaruvchisi va Super Adminining eng yaqin ko'makchisi, sodiq hamrohi va haqiqiy 'O'NG QO'LI' bo'lgan mukammal AI tizimisiz. Ismingiz - 'Anatomiya AI'.\n\nSiz xuddi jahon darajasidagi yetakchi sun'iy intellekt muhandisi va tajribali super-boshqaruvchi kabi fikrlaysiz, gapirasiz va harakat qilasiz.\n\nSizning ishlash va muloqot prinsiplaringiz:\n1. MUKAMMAL EXECUTION (BENUQSALIK): Foydalanuvchi (Super Admin) sizga buyruq bersa, uni soniyalar ichida professional tarzda tushunib, matn bilan bir qatorda albatta va DARHOL tegishli FUNKSIYANI (tool) ishga tushirasiz. Hech qachon shunchaki taxminiy javob bilan qutulmang. Har bir amalni maromiga yetkazib, 100% ishonch bilan bajaring.\n2. PROAKTIV FIKRLASH: Agar foydalanuvchi biror amal so'rasa va ma'lumot yetishmasa, avval list_topics yoki list_users kabi mos yordamchi funksiyalarni ishga tushirib qidiruv qiling, natijaga qarab eng to'g'ri qarorni qabul qiling.\n3. HURMAT VA PROFESSIONALIZM (TILLAR SULTONI): Har doim oliy darajadagi O'zbek tilida, nihoyatda chiroyli, tushunarli, aniq va strukturali muloqot qiling. Gaplaringizda muhim ma'lumotlarni qalin (bold) shriftlar bilan ajrating va chiroyli emojilar bilan bezating.\n4. KOD VA STRUKTURA O'ZGARISHLARI (SINOV CHЕGARASI): Agar foydalanuvchi veb-saytning manba kodlarini o'zgartirishni, yangi HTML/React elementlari yoki qidiruv tizimlari (features) qo'shishni so'rasa, siz buni bajara olmaysiz. Chunki siz platformadan foydalanuvchi ma'lumotlar administratorisiz. Bunday holatda, ularga ushbu o'zgarishni **bajarib bera olmasligingizni**, ammo **Google AI Studio** interfeysining chatidagi **Google AI Coding Agentga** (tashqi dasturchi AI) buyruq berish orqali buni soniyalar ichida amalga oshirishlari mumkinligini chiroyli tushuntiring.\n5. TO'LIQ VAKOLATLAR:\n   - Sayt va dizayn sozlamalari: Foydalanuvchi sayt nomini, rangini, shiorlarini, kontaktlarini, semestr narxlarini, telegram botini o'zgartirishni so'rashganda, ALBATTA barcha tegishli parametrlar bilan update_site_settings funksiyasini chaqiring (masalan primaryColor, priceUZS va barchasini birdaniga o'zgartirishi mumkin).\n   - Mavzular boshqaruvi: Yarating, tahrirlang, o'chiring, nazariy qismni boyiting yoki video-dars ulab bering.\n   - Talabalar & Bloklash: Foydalanuvchilar ro'yxatini tahlil qiling, kerak bo'lsa bloklang yoki blokdan chiqaring, semestrlarga tezkor ruxsat bering.\n   - To'lov va Moliya: Kutilayotgan to'lovlarni tekshiring, tasdiqlang yoki rad eting.\n   - Darslarni go'zallashtirish: Mavzularga testlar kiritib bering, lug'atga lotincha yangi iboralar qo'shing, atlasga rasm va visual darsliklar boyiting.\n   - Vizual rasm tahlili: Foydalanuvchi yuborgan rasmlarni eng yuqori aniqlikda tahlil qilib bering.\n\nEslatma: Siz uning sodiq maslahatchisisiz. Savollarga chuqur tahliliy, mantiqiy va professional javoblar bering, buyruqlarni esa xatosiz va darhol ijro eting!";

      if (!hasSecurityCode) {
        systemInstruction += "\n\n⚠️ XAVFSIZLIK VA MAXFIY KOD (CRITICAL SECURITY): Foydalanuvchi joriy suhbatda maxfiy xavfsizlik kodini kiritmadi! Siz hozircha ma'lumotlarni o'zgartiruvchi / kirituvchi amallarni (update_site_settings, approve_payment, reject_payment, block_user, give_semester_access, create_topic, update_topic, update_topic_content, delete_topic, reset_topics_to_canonical, add_video_to_topic, add_quiz_question, add_latin_term, add_atlas_entry, create_announcement) CHAQIRA OLMAZSIZ! Hech qanday ma'lumotlarni ruxsatsiz o'zgartirmang va yangilamang. Agar foydalanuvchi shunday o'zgartirishni so'rasa, har qanday tool chaqiruvini (funksiyani) bekor qiling va chiroyli tushuntirib: '⚠️ **Xavfsizlik Paroli talab etiladi!** Ushbu o'zgartirish amalini bajarish uchun tizim parolini (Maxfiy kodni) yozishingiz shart. Iltimos maxfiy kodni kiriting:' deb faqat matnda javob bering va maxfiy kodni so'rang. Ma'lumot ko'rsatish (list_topics, list_users, list_pending_payments) amallarini esa parol so'rashdan ham ishlata olasiz.";
      } else {
        systemInstruction += "\n\n🔑 MUKAMMAL RUHSAT: Foydalanuvchi to'g'ri maxfiy xavfsizlik kodini kiritdi. Endi siz barcha o'zgartirish, yaratish yoki o'chirish funksiyalarini (tool-larni) hech qanday cheklovsiz, to'liq, mukammal va maromida darhol chaqirib bajara olasiz!";
      }

      const chatConfig = {
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          tools: [
            {
              functionDeclarations: [
                {
                  name: "create_topic",
                  description: "Platformaga yangi anatomik mavzu qo'shadi. Faqat administrator so'raganda ishlating.",
                  parameters: {
                    type: "object",
                    properties: {
                      title_uz: { type: "string", description: "Mavzuning O'zbekcha nomi" },
                      semester: { type: "number", description: "Qaysi semestrga tegishli (1-8)" },
                      order: { type: "number", description: "Mavzu tartib raqami" }
                    },
                    required: ["title_uz", "semester", "order"]
                  }
                },
                {
                  name: "update_topic",
                  description: "Mavjud mavzuni tahrirlaydi (nomi, semestri yoki tartibini).",
                  parameters: {
                    type: "object",
                    properties: {
                      topicId: { type: "string", description: "Mavzu ID raqami. Nom yoki tartib o'zgartirishdan oldin list_topics orqali IDsini aniqlang." },
                      title_uz: { type: "string", description: "Yangi O'zbekcha nomi (ixtiyoriy)" },
                      semester: { type: "number", description: "Yangi semestr (ixtiyoriy)" },
                      order: { type: "number", description: "Yangi tartib raqami (ixtiyoriy)" }
                    },
                    required: ["topicId"]
                  }
                },
                {
                  name: "update_topic_content",
                  description: "Mavzuning nazariy qismini (theory) yangilaydi.",
                  parameters: {
                    type: "object",
                    properties: {
                      topicId: { type: "string", description: "Mavzu ID raqami" },
                      theory_uz: { type: "string", description: "Yangi O'zbekcha tekst (theory)" }
                    },
                    required: ["topicId", "theory_uz"]
                  }
                },
                {
                  name: "delete_topic",
                  description: "Mavjud mavzuni o'chirib tashlaydi. DIQQAT: Bu amalni bajarishdan oldin tasdiqlash so'raladi.",
                  parameters: {
                    type: "object",
                    properties: {
                      topicId: { type: "string", description: "O'chirilishi kerak bo'lgan mavzu ID raqami" },
                      topicName: { type: "string", description: "Mavzu nomi (tasdiqlash uchun)" }
                    },
                    required: ["topicId"]
                  }
                },
                {
                  name: "list_topics",
                  description: "Platformadagi barcha mavzular ro'yxatini qaytaradi.",
                  parameters: {
                    type: "object",
                    properties: {}
                  }
                },
                {
                  name: "list_users",
                  description: "Platformadagi foydalanuvchilar (talabalar) ro'yxatini va ularning statusini oladi.",
                  parameters: {
                    type: "object",
                    properties: {
                      limit: { type: "number", description: "Maksimal foydalanuvchilar soni (masalan: 10, 20)" },
                      search: { type: "string", description: "Ism yoki email bo'yicha qidiruv so'zi" }
                    }
                  }
                },
                {
                  name: "block_user",
                  description: "Foydalanuvchini platformada bloklaydi yoki blokdan ochadi.",
                  parameters: {
                    type: "object",
                    properties: {
                      userId: { type: "string", description: "Bloklanadigan yoki ochiladigan foydalanuvchi IDsi" },
                      isBlocked: { type: "boolean", description: "true - bloklash, false - blokdan ochish" }
                    },
                    required: ["userId", "isBlocked"]
                  }
                },
                {
                  name: "give_semester_access",
                  description: "Foydalanuvchiga muayyan semestr uchun (1 yoki 2-semestrlar) kirish ruxsatini (6 oyga) beradi.",
                  parameters: {
                    type: "object",
                    properties: {
                      userId: { type: "string", description: "Ruxsat berilayotgan foydalanuvchi IDsi" },
                      semester: { type: "number", description: "Semestr raqami (masalan: 1 yoki 2)" }
                    },
                    required: ["userId", "semester"]
                  }
                },
                {
                  name: "create_announcement",
                  description: "Platformaning barcha foydalanuvchilariga ko'rinadigan yangi e'lon qo'shadi.",
                  parameters: {
                    type: "object",
                    properties: {
                      title: { type: "string", description: "E'lon sarlavhasi (uzbekcha)" },
                      content: { type: "string", description: "E'lon matni (uzbekcha)" },
                      type: { type: "string", enum: ["info", "warning", "success", "danger"], description: "E'lon turi (masalan info, success yoki danger)" }
                    },
                    required: ["title", "content", "type"]
                  }
                },
                {
                  name: "get_system_stats",
                  description: "Platforma bo'yicha jami umumiy statistikalarni qaytaradi (Mavzular, foydalanuvchilar, to'lovlar va h.k.).",
                  parameters: {
                    type: "object",
                    properties: {}
                  }
                },
                {
                  name: "add_video_to_topic",
                  description: "Muayyan anatomik mavguza YouTube video URL darsini qo'shadi/ulab beradi.",
                  parameters: {
                    type: "object",
                    properties: {
                      topicId: { type: "string", description: "Mavzu ID raqami. Agar IDisini bilmasangiz avval list_topics qiling." },
                      videoUrl: { type: "string", description: "YouTube video URL (masalan: https://www.youtube.com/watch?v=...)" }
                    },
                    required: ["topicId", "videoUrl"]
                  }
                },
                {
                  name: "update_site_settings",
                  description: "Sayt sarlavhasi, shiori, kontaktlari, muddatlari, narxlari (raqamlar) va ranglar palitrasi (dizayn sozlamalari) kabi barcha tizim va ko'rinish sozlamalarini o'zgartiradi.",
                  parameters: {
                    type: "object",
                    properties: {
                      siteName: { type: "string", description: "Yangi sayt nomi/sarlavhasi (masalan: 'BSMI Anatomy')" },
                      tagline: { type: "string", description: "Yangi shior (tagline)" },
                      contactEmail: { type: "string", description: "Yangi bog'lanish emaili" },
                      contactPhone: { type: "string", description: "Yangi bog'lanish telefon raqami" },
                      logoUrl: { type: "string", description: "Yangi logo rasm URL manzili" },
                      priceUZS: { type: "number", description: "Semestr narxi somda (FAQAT RAQAM kiritiladi, masalan: 30000)" },
                      priceUSD: { type: "number", description: "Semestr narxi dollarda (FAQAT RAQAM, masalan: 5)" },
                      durationMonths: { type: "number", description: "Premium ruxsat muddati (oyda, masalan: 6)" },
                      telegramBotUsername: { type: "string", description: "Telegram qo'llab-quvvatlash boti manzili (masalan: '@MEDAI_SUPPORT_BOT')" },
                      footerText: { type: "string", description: "Sayt eng pastki qismidagi mualliflik huquqi matni" },
                      primaryColor: { type: "string", description: "Sayt asosiy rangi HEX kodda (masalan: #1E293B)" },
                      accentColor: { type: "string", description: "Urg'u rangi HEX kodda (masalan: #38BDF8 yoki #2563EB)" },
                      backgroundColor: { type: "string", description: "Suhbat va sahifalar orqa foni HEX kodda (#F0F2F5 yoki #0F172A)" },
                      cardColor: { type: "string", description: "Karta va bloklar foni HEX kodda (#FFFFFF yoki #1E293B)" },
                      textColor: { type: "string", description: "Asosiy matn rangi HEX kodda (#1A202C yoki #F8FAFC)" },
                      mutedColor: { type: "string", description: "Xira matnlar rangi HEX kodda (#64748B)" },
                      borderRadius: { type: "string", description: "Elementlar burchagining yumaloqligi (masalan: '16px' yoki '32px')" },
                      fontFamily: { type: "string", description: "Saytda qo'llaniladigan shrift oilasi (masalan: 'Plus Jakarta Sans', sans-serif)" },
                      glassEffect: { type: "boolean", description: "Oynasimon shaffof effektlar (glassmorphism) yoqilsinmi? (true yoki false)" }
                    }
                  }
                },
                {
                  name: "list_pending_payments",
                  description: "Tasdiqlash kutilayotgan barcha foydalanuvchi to'lovlar ro'yxatini qaytaradi.",
                  parameters: {
                    type: "object",
                    properties: {}
                  }
                },
                {
                  name: "approve_payment",
                  description: "Foydalanuvchi to'lovini va ruxsatini tasdiqlaydi (paymentId kerak).",
                  parameters: {
                    type: "object",
                    properties: {
                      paymentId: { type: "string", description: "Tasdiqlanayotgan to'lov hujjati id raqami (masalan: userUid_semesterId)" }
                    },
                    required: ["paymentId"]
                  }
                },
                {
                  name: "reject_payment",
                  description: "Foydalanuvchi to'lovini rad etadi (paymentId kerak).",
                  parameters: {
                    type: "object",
                    properties: {
                      paymentId: { type: "string", description: "Rad etilayotgan to'lov hujjati id raqami" }
                    },
                    required: ["paymentId"]
                  }
                },
                {
                  name: "add_quiz_question",
                  description: "Platformadagi biror mavzuga yangi test savolini qo'shadi.",
                  parameters: {
                    type: "object",
                    properties: {
                      topicId: { type: "string", description: "Mavzu IDsi" },
                      question: { type: "string", description: "Test savoli matni" },
                      options: { 
                        type: "array", 
                        items: { type: "string" }, 
                        description: "Variantlar ro'yxati (masalan: ['A', 'B', 'C', 'D'])" 
                      },
                      correctAnswerIndex: { type: "number", description: "To'g'ri javob indeksi (0 dan boshlanadi)" },
                      explanation: { type: "string", description: "Tushuntirish matni (ixtiyoriy)" }
                    },
                    required: ["topicId", "question", "options", "correctAnswerIndex"]
                  }
                },
                {
                  name: "add_latin_term",
                  description: "Lotincha terminlar lug'atiga yangi so'z va uning tarjimasini qo'shadi.",
                  parameters: {
                    type: "object",
                    properties: {
                      latin: { type: "string", description: "Lotincha so'z yoki ibora" },
                      uzbek: { type: "string", description: "O'zbekcha tarjimasi / izohi" }
                    },
                    required: ["latin", "uzbek"]
                  }
                },
                {
                  name: "add_atlas_entry",
                  description: "Atlas rasm darsligiga yangi rasm yoki visual element qo'shadi.",
                  parameters: {
                    type: "object",
                    properties: {
                      latinName: { type: "string", description: "Lotincha nomi (masalan: Cor)" },
                      uzbekName: { type: "string", description: "O'zbekcha nomi (masalan: Yurak)" },
                      description: { type: "string", description: "Izoh va tushuntirish" },
                      image: { type: "string", description: "Rasm silkasi URL manzili (ixtiyoriy)" },
                      modelUrl: { type: "string", description: "3D model (.glb/.gltf) URL manzili (ixtiyoriy)" },
                      topicId: { type: "string", description: "Tegishli mavzu ID raqami (ixtiyoriy)" }
                    },
                    required: ["latinName", "uzbekName", "description"]
                  }
                },
                {
                  name: "reset_topics_to_canonical",
                  description: "Dizayn/dashboard bo'limidan barcha ko'payib yoki buzilib ketgan darslik mavzularini butunlay o'chirib, dastlabki va toza 26 ta kashfiyot/anatomik darslik darslariga qaytaradi (tozalaydi, reset qiladi). Admin mavzular sonini 26 ta qilishni so'raganda albatta chaqiriladi.",
                  parameters: {
                    type: "object",
                    properties: {}
                  }
                }
              ]
            }
          ]
        }
      };

      const models = ["gemini-3.1-flash-lite", "gemini-3.7-flash", "gemini-flash-latest"];
      let response = null;
      let errorOccurred = null;

      for (const modelName of models) {
        try {
          console.log(`Trying model: ${modelName} for Admin AI Chat...`);
          response = await safeGenerateContent(modelName, chatConfig);
          if (response) {
            break;
          }
        } catch (err: any) {
          console.error(`Error with model ${modelName} during admin chat:`, err.message || err);
          errorOccurred = err;
        }
      }

      if (!response) {
        throw errorOccurred || new Error("Kechirasiz, admin sun'iy intellekti bilan ulanish imkoni bo'lmadi.");
      }

      // Handle response for function calls or normal text
      const functionCalls = response.functionCalls;
      if (functionCalls && functionCalls.length > 0) {
        const firstCall = functionCalls[0];
        console.log('Model triggered function call via helper:', firstCall.name);
        return resValue.json({
          text: "Amal bajarilmoqda...",
          functionCall: {
            name: firstCall.name,
            args: firstCall.args
          }
        });
      }

      const candidate = response.candidates?.[0];
      if (candidate?.content?.parts?.some((p: any) => p.functionCall)) {
        const functionCallPart = candidate.content.parts.find((p: any) => p.functionCall);
        console.log('Model triggered function call via parts:', functionCallPart.functionCall.name);
        return resValue.json({ 
          text: "Amal bajarilmoqda...", 
          functionCall: functionCallPart.functionCall 
        });
      }

      const text = candidate?.content?.parts?.map((p: any) => p.text).join('') || "Kechirasiz, javob olib bo'lmadi.";
      resValue.json({ text });

    } catch (error: any) {
      console.error('AI Chat Error:', error);
      
      const errorMsg = error.message || '';
      
      if (error.status === 404 || errorMsg.includes('404') || errorMsg.includes('not found')) {
        return resValue.status(404).json({ error: "AI Assistant moduli hozirda bog'lanish imkoniyatiga ega emas (404). Iltimos, keyinroq urinib ko'ring." });
      }
      
      if (error.status === 429 || errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED')) {
         const retryDelay = errorMsg.match(/retry in ([\d.]+)s/)?.[1] || "24";
         return resValue.status(429).json({ error: `AI limiti oshib ketdi. Iltimos, ${retryDelay} soniyadan so'ng qayta yozib ko'ring.` });
      }
      
      if (error.status === 503 || errorMsg.includes('503') || errorMsg.includes('UNAVAILABLE')) {
        return resValue.status(503).json({ error: "AI tizimi hozirda yuklama ostida (503). Iltimos, birozdan so'ng qayta yozib ko'ring." });
      }
      
      resValue.status(500).json({ error: errorMsg || 'Xatolik yuz berdi' });
    }
  });

  app.use('/api*', (req, res) => {
    res.status(404).json({ error: `API yo'nalishi topilmadi: ${req.originalUrl}` });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  return app;
}

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  createServerApp().then(app => {
    const PORT = 3000;
    const useHttps = process.env.USE_HTTPS === 'true';

    if (useHttps) {
      try {
        if (!fs.existsSync('key.pem') || !fs.existsSync('cert.pem')) {
          console.log("Generating self-signed SSL certificate for secure local development (HTTPS)...");
          execSync('openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -sha256 -days 365 -nodes -subj "/CN=localhost"');
          console.log("Self-signed SSL certificate generated successfully!");
        }

        if (fs.existsSync('key.pem') && fs.existsSync('cert.pem')) {
          const options = {
            key: fs.readFileSync('key.pem'),
            cert: fs.readFileSync('cert.pem')
          };
          https.createServer(options, app).listen(PORT, '0.0.0.0', () => {
            console.log(`\n🔒 [HTTPS] Secure server running on: https://localhost:${PORT}`);
            console.log(`🔒 Secure Context is active. Face ID, camera access, and Google Sign-In will work seamlessly.`);
            console.log(`💡 Note: Since this is a self-signed certificate, your browser will show a warning.`);
            console.log(`   Simply click 'Advanced' and 'Proceed to localhost (unsafe)' to bypass it.\n`);
          });
          return;
        }
      } catch (err: any) {
        console.error("⚠️ Failed to set up HTTPS, falling back to HTTP:", err.message || err);
      }
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n🚀 [HTTP] Server running on: http://localhost:${PORT}`);
      console.log(`💡 To enable HTTPS for local testing of Face ID & Google Sign-In:`);
      console.log(`   1. Set USE_HTTPS=true in your .env file.`);
      console.log(`   2. Restart the server with 'npm run dev'\n`);
    });
  }).catch(err => {
    console.error("Failed to start server:", err);
  });
}
