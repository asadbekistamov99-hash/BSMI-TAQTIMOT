/**
 * Face ID verification policy — pure, dependency-free logic shared by the
 * server endpoint (/api/verify-face) and the browser gate.
 *
 * Everything in here is deterministic and unit-tested (tests/faceVerificationPolicy.test.mjs),
 * so the security-critical "verified or not" decision can never silently drift
 * again when the surrounding request/UI code is edited.
 *
 * ZERO-TRUST RULE: every helper defaults to "not verified". A missing, malformed
 * or ambiguous value always resolves to a denial, never to a pass.
 */

export type FaceDenyCode =
  | 'BAD_REQUEST'        // client sent an invalid payload
  | 'AI_NOT_CONFIGURED'  // GEMINI_API_KEY missing on the server
  | 'AI_QUOTA'           // 429 / quota exhausted on every model
  | 'AI_UNAVAILABLE'     // 5xx / network failure on every model
  | 'AI_TIMEOUT'         // no model answered inside the time budget
  | 'AI_BAD_RESPONSE'    // model answered but not with usable JSON
  | 'NO_FACE'            // no clear human face in the frames
  | 'SPOOF'              // photo / screen replay suspected
  | 'NO_MATCH'           // a different person
  | 'LOW_CONFIDENCE';    // same person likely, but below threshold

export type FaceClientCode =
  | 'CAMERA'             // camera could not be started / was interrupted
  | 'TOO_DARK'           // frame quality: too dark
  | 'TOO_BRIGHT'         // frame quality: blown out
  | 'NO_SIGNAL'          // frame quality: black / covered camera
  | 'NETWORK'            // request never reached the server
  | 'CLIENT_TIMEOUT'     // browser-side abort
  | 'BAD_GATEWAY';       // server answered with something that is not our JSON

export type FaceResultCode = FaceDenyCode | FaceClientCode;

export const DEFAULT_FACE_MATCH_THRESHOLD = 0.75;
export const MIN_FACE_MATCH_THRESHOLD = 0.5;
export const MAX_FACE_MATCH_THRESHOLD = 0.99;

export const MIN_FRAMES_REQUIRED = 3;
export const MAX_FRAMES_ACCEPTED = 8;
/** ~900 KB of base64 per image; frames are ~50-90 KB in practice. */
export const MAX_IMAGE_CHARS = 1_200_000;

/**
 * Models tried in order. Each model has its own quota on the Gemini API, so a
 * 429 on the first one does not lock students out — the next one is tried.
 * Override with the FACE_ID_MODELS env var (comma separated).
 */
export const DEFAULT_FACE_ID_MODELS = [
  'gemini-2.5-flash',
  'gemini-3.7-flash',
  'gemini-flash-latest',
  'gemini-3.1-flash-lite'
];

/** Vercel gives the function 60 s; keep a safety margin for JSON + network. */
export const FACE_ID_TOTAL_BUDGET_MS = 50_000;
export const FACE_ID_PER_CALL_TIMEOUT_MS = 22_000;
/** Don't start another model call if less than this remains in the budget. */
export const FACE_ID_MIN_REMAINING_MS = 6_000;
/** Browser-side fetch timeout: server budget + margin. */
export const FACE_ID_CLIENT_TIMEOUT_MS = 58_000;

export function resolveThreshold(envValue: string | undefined | null, fallback = DEFAULT_FACE_MATCH_THRESHOLD): number {
  if (envValue === undefined || envValue === null) return fallback;
  const trimmed = String(envValue).trim();
  if (!trimmed) return fallback;
  let parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) return fallback;
  // Accept "75" as 75%.
  if (parsed > 1 && parsed <= 100) parsed = parsed / 100;
  if (parsed < MIN_FACE_MATCH_THRESHOLD || parsed > MAX_FACE_MATCH_THRESHOLD) return fallback;
  return parsed;
}

/**
 * Every Gemini API key the server may use, in priority order:
 * GEMINI_API_KEYS (comma separated, e.g. keys from two different Google Cloud
 * projects), then GEMINI_API_KEY, then API_KEY. A key whose billing account is
 * suspended or whose free-tier quota is exhausted no longer locks students out —
 * the next key is tried.
 */
export function resolveApiKeys(env: Record<string, string | undefined> | undefined | null): string[] {
  const keys: string[] = [];
  const push = (raw?: string) => {
    if (!raw) return;
    raw.split(',').map(s => s.trim()).filter(s => s.length >= 10 && !/\s/.test(s)).forEach(k => {
      if (!keys.includes(k)) keys.push(k);
    });
  };
  push(env?.GEMINI_API_KEYS);
  push(env?.GEMINI_API_KEY);
  push(env?.API_KEY);
  return keys;
}

/** Safe representation of a key for logs and the admin panel. */
export function maskApiKey(key: string): string {
  if (!key || key.length <= 8) return '****';
  return `${key.slice(0, 4)}…${key.slice(-4)}`;
}

export function resolveModelList(envValue: string | undefined | null, fallback = DEFAULT_FACE_ID_MODELS): string[] {
  if (!envValue) return [...fallback];
  const list = String(envValue)
    .split(',')
    .map(s => s.trim())
    .filter(s => /^[a-z0-9._-]+$/i.test(s));
  return list.length > 0 ? Array.from(new Set(list)) : [...fallback];
}

export interface VerifyFrame {
  type: string;
  image: string;
}

export interface VerifyRequest {
  enrolledImage: string;
  frames: VerifyFrame[];
}

export type ValidationResult =
  | { ok: true; value: VerifyRequest }
  | { ok: false; code: 'BAD_REQUEST'; reason: string };

const looksLikeImage = (img: unknown): img is string => {
  if (typeof img !== 'string') return false;
  const trimmed = img.trim();
  if (trimmed.length < 100 || trimmed.length > MAX_IMAGE_CHARS) return false;
  if (trimmed.startsWith('data:')) {
    return /^data:image\/(jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=\s]+$/i.test(trimmed);
  }
  return /^[A-Za-z0-9+/=\s]+$/.test(trimmed);
};

export function validateVerifyRequest(body: unknown): ValidationResult {
  const b = (body && typeof body === 'object') ? (body as Record<string, unknown>) : {};
  const enrolledImage = b.enrolledImage;
  const frames = b.frames;

  if (!looksLikeImage(enrolledImage)) {
    return { ok: false, code: 'BAD_REQUEST', reason: "Ro'yxatdan o'tgan surat topilmadi yoki buzilgan. Iltimos, yuzingizni qayta ro'yxatdan o'tkazing." };
  }
  if (!Array.isArray(frames) || frames.length < MIN_FRAMES_REQUIRED) {
    return { ok: false, code: 'BAD_REQUEST', reason: "Jonlilik tekshiruvi uchun yetarli kadr yuborilmadi." };
  }
  if (frames.length > MAX_FRAMES_ACCEPTED) {
    return { ok: false, code: 'BAD_REQUEST', reason: "Juda ko'p kadr yuborildi." };
  }
  const cleanFrames: VerifyFrame[] = [];
  for (let i = 0; i < frames.length; i++) {
    const f = frames[i] as Record<string, unknown> | null;
    if (!f || !looksLikeImage(f.image)) {
      return { ok: false, code: 'BAD_REQUEST', reason: "Kadrlar formati noto'g'ri." };
    }
    cleanFrames.push({ type: typeof f.type === 'string' ? f.type : `frame_${i + 1}`, image: (f.image as string).trim() });
  }
  return { ok: true, value: { enrolledImage: (enrolledImage as string).trim(), frames: cleanFrames } };
}

export function cleanBase64(img: string): string {
  const idx = img.indexOf(',');
  const raw = idx >= 0 && img.startsWith('data:') ? img.slice(idx + 1) : img;
  return raw.replace(/\s+/g, '');
}

export function detectMimeType(img: string): 'image/png' | 'image/webp' | 'image/jpeg' {
  const head = img.slice(0, 40).toLowerCase();
  if (head.startsWith('data:image/png')) return 'image/png';
  if (head.startsWith('data:image/webp')) return 'image/webp';
  return 'image/jpeg';
}

/** Extracts the JSON object from a model answer that may be wrapped in fences or prose. */
export function parseModelJson(text: unknown): Record<string, unknown> | null {
  if (typeof text !== 'string') return null;
  let clean = text.trim();
  if (!clean) return null;
  if (clean.startsWith('```')) {
    clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  }
  const tryParse = (s: string) => {
    try {
      const v = JSON.parse(s);
      return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  };
  const direct = tryParse(clean);
  if (direct) return direct;
  const first = clean.indexOf('{');
  const last = clean.lastIndexOf('}');
  if (first !== -1 && last > first) {
    return tryParse(clean.slice(first, last + 1));
  }
  return null;
}

export interface ModelVerdict {
  faceDetected: boolean;
  isMatch: boolean;
  livenessPassed: boolean;
  spoofSuspected: boolean;
  confidence: number;
  reason: string;
}

const toBool = (v: unknown): boolean => {
  if (v === true) return true;
  if (typeof v === 'string') return v.trim().toLowerCase() === 'true';
  return false;
};

export function normalizeConfidence(v: unknown): number {
  let n: number;
  if (typeof v === 'number') n = v;
  else if (typeof v === 'string') n = parseFloat(v.replace('%', '').trim());
  else n = 0;
  if (!Number.isFinite(n) || n < 0) return 0;
  // Models occasionally answer in percent ("87") even when asked for 0..1.
  if (n > 1 && n <= 100) n = n / 100;
  if (n > 1) return 0;
  return Math.round(n * 1000) / 1000;
}

/** Fail-closed normalisation of whatever the model returned. */
export function normalizeVerdict(raw: unknown): ModelVerdict {
  const r = (raw && typeof raw === 'object') ? (raw as Record<string, unknown>) : {};
  const faceDetected = toBool(r.faceDetected);
  const isMatch = toBool(r.isMatch);
  const livenessPassed = toBool(r.livenessPassed);
  // spoofSuspected defaults to false only when explicitly false/absent; any truthy → true.
  const spoofSuspected = toBool(r.spoofSuspected);
  const confidence = normalizeConfidence(r.confidence);
  const reason = typeof r.reason === 'string' ? r.reason.trim() : '';
  return { faceDetected, isMatch, livenessPassed, spoofSuspected, confidence, reason };
}

export interface VerificationDecision extends ModelVerdict {
  verified: boolean;
  code?: FaceDenyCode;
  /** true when a fresh capture is likely to fix it without the user changing anything. */
  retryable: boolean;
  reason: string;
}

export function decideVerification(verdict: ModelVerdict, threshold: number = DEFAULT_FACE_MATCH_THRESHOLD): VerificationDecision {
  const t = resolveThreshold(String(threshold), DEFAULT_FACE_MATCH_THRESHOLD);
  const base = { ...verdict };

  if (!verdict.faceDetected) {
    return {
      ...base,
      verified: false,
      code: 'NO_FACE',
      retryable: true,
      confidence: 0,
      reason: verdict.reason || "Kadrlarda aniq inson yuzi topilmadi. Kameraga to'g'ri qarab, yuzingiz to'liq ko'rinishini ta'minlang."
    };
  }
  if (verdict.spoofSuspected || !verdict.livenessPassed) {
    return {
      ...base,
      verified: false,
      code: 'SPOOF',
      retryable: false,
      reason: verdict.reason || "Jonlilik tekshiruvidan o'tmadi: kadrlarda fotosurat yoki ekran belgilari aniqlandi."
    };
  }
  if (!verdict.isMatch) {
    return {
      ...base,
      verified: false,
      code: 'NO_MATCH',
      retryable: false,
      reason: verdict.reason || "Yuz ro'yxatdan o'tgan surat bilan mos kelmadi."
    };
  }
  if (verdict.confidence < t) {
    return {
      ...base,
      verified: false,
      code: 'LOW_CONFIDENCE',
      retryable: true,
      reason: verdict.reason
        ? `${verdict.reason} (moslik ${(verdict.confidence * 100).toFixed(0)}%, kamida ${(t * 100).toFixed(0)}% kerak)`
        : `Moslik darajasi yetarli emas (${(verdict.confidence * 100).toFixed(0)}%, kamida ${(t * 100).toFixed(0)}% kerak). Xonani yoritib, kameraga yaqinroq qarang.`
    };
  }
  return {
    ...base,
    verified: true,
    retryable: false,
    reason: verdict.reason || 'Yuz muvaffaqiyatli solishtirildi'
  };
}

export interface ClassifiedAiError {
  code: FaceDenyCode;
  httpStatus: number;
  reason: string;
  /** true → worth retrying the same model after a short pause */
  transient: boolean;
  /** true → this model is unusable (404/400); go straight to the next one */
  skipModel: boolean;
  retryAfterSec?: number;
}

export function classifyAiError(err: unknown): ClassifiedAiError {
  const e = (err && typeof err === 'object') ? (err as Record<string, any>) : {};
  const message = String(e.message ?? (typeof err === 'string' ? err : '') ?? '');
  const status = Number(e.status ?? e.code ?? e.statusCode ?? NaN);
  const text = `${Number.isFinite(status) ? status : ''} ${message} ${safeJson(err)}`.toLowerCase();

  if (text.includes('billing')) {
    return {
      code: 'AI_NOT_CONFIGURED',
      httpStatus: 503,
      reason: "Gemini to'lov hisobi (billing) nofaol yoki kredit balansi 0 — bu kalit ishlamaydi. Google AI Studio → Billing bo'limini tekshiring yoki boshqa loyihaning kalitini qo'shing.",
      transient: false,
      skipModel: false
    };
  }
  if (message.includes('GEMINI_API_KEY') || text.includes('api key not valid') || text.includes('api_key_invalid') || text.includes('permission_denied') || status === 401 || status === 403) {
    return {
      code: 'AI_NOT_CONFIGURED',
      httpStatus: 503,
      reason: "Face ID xizmati serverda sozlanmagan (GEMINI_API_KEY yo'q yoki yaroqsiz). Iltimos, administratorga xabar bering.",
      transient: false,
      skipModel: false
    };
  }
  if (status === 429 || text.includes('429') || text.includes('resource_exhausted') || text.includes('quota') || text.includes('rate limit')) {
    const m = text.match(/retry in ([\d.]+)\s*s/) || text.match(/retrydelay['":\s]+([\d.]+)s/);
    const retryAfterSec = m ? Math.ceil(parseFloat(m[1])) : undefined;
    return {
      code: 'AI_QUOTA',
      httpStatus: 429,
      reason: retryAfterSec
        ? `AI tekshiruv limiti vaqtincha tugadi. Iltimos, ${retryAfterSec} soniyadan so'ng qayta urinib ko'ring.`
        : "AI tekshiruv limiti vaqtincha tugadi. Iltimos, bir necha soniyadan so'ng qayta urinib ko'ring.",
      transient: true,
      skipModel: false,
      retryAfterSec
    };
  }
  if (text.includes('timeout') || text.includes('timed out') || text.includes('deadline') || e.name === 'AbortError' || status === 504) {
    return {
      code: 'AI_TIMEOUT',
      httpStatus: 504,
      reason: "AI tekshiruv javobi kechikdi. Iltimos, qayta urinib ko'ring.",
      transient: true,
      skipModel: false
    };
  }
  if (status === 404 || text.includes('not found') || text.includes('is not supported') || status === 400 || text.includes('invalid_argument') || text.includes('invalid argument')) {
    return {
      code: 'AI_UNAVAILABLE',
      httpStatus: 503,
      reason: "Biometrik tekshiruv modeli hozircha mavjud emas. Iltimos, birozdan so'ng qayta urinib ko'ring.",
      transient: false,
      skipModel: true
    };
  }
  return {
    code: 'AI_UNAVAILABLE',
    httpStatus: 503,
    reason: "Biometrik tekshiruv xizmati vaqtincha ishlamayapti. Iltimos, birozdan so'ng qayta urinib ko'ring.",
    transient: status === 500 || status === 502 || status === 503 || text.includes('unavailable') || text.includes('overloaded') || text.includes('econn') || text.includes('fetch failed') || text.includes('network'),
    skipModel: false
  };
}

function safeJson(v: unknown): string {
  try {
    return JSON.stringify(v) ?? '';
  } catch {
    return '';
  }
}

// ---------------------------------------------------------------------------
// Browser-side frame quality (pure math so it can be unit-tested in node).
// ---------------------------------------------------------------------------

export interface LuminanceStats {
  mean: number;   // 0..255
  stdDev: number; // 0..~128
  samples: number;
}

/** Computes mean/std-dev luminance over RGBA pixel data, sampling every `step`-th pixel. */
export function analyzeLuminance(data: ArrayLike<number>, step = 4): LuminanceStats {
  const stride = Math.max(1, Math.floor(step)) * 4;
  let sum = 0;
  let sumSq = 0;
  let n = 0;
  for (let i = 0; i + 2 < data.length; i += stride) {
    const y = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    sum += y;
    sumSq += y * y;
    n++;
  }
  if (n === 0) return { mean: 0, stdDev: 0, samples: 0 };
  const mean = sum / n;
  const variance = Math.max(0, sumSq / n - mean * mean);
  return { mean, stdDev: Math.sqrt(variance), samples: n };
}

export interface FrameQuality {
  ok: boolean;
  code?: 'TOO_DARK' | 'TOO_BRIGHT' | 'NO_SIGNAL';
  message?: string;
}

export const FRAME_QUALITY_LIMITS = {
  noSignalMean: 8,      // essentially black: covered lens, camera not started yet
  noSignalStdDev: 3,
  darkMean: 38,
  brightMean: 235
};

export function assessFrameQuality(stats: LuminanceStats): FrameQuality {
  if (stats.samples === 0) {
    return { ok: false, code: 'NO_SIGNAL', message: "Kameradan tasvir kelmayapti. Kamera ochiq va band emasligini tekshiring." };
  }
  if (stats.mean <= FRAME_QUALITY_LIMITS.noSignalMean && stats.stdDev <= FRAME_QUALITY_LIMITS.noSignalStdDev) {
    return { ok: false, code: 'NO_SIGNAL', message: "Kamera qora tasvir bermoqda. Kamera yopilmaganini va boshqa dastur band qilmaganini tekshiring." };
  }
  if (stats.mean < FRAME_QUALITY_LIMITS.darkMean) {
    return { ok: false, code: 'TOO_DARK', message: "Xona juda qorong'i. Iltimos, chiroqni yoqing yoki yorug'roq joyga o'ting va qayta urinib ko'ring." };
  }
  if (stats.mean > FRAME_QUALITY_LIMITS.brightMean) {
    return { ok: false, code: 'TOO_BRIGHT', message: "Tasvir juda yorug' (kuygan). Iltimos, kamerani to'g'ridan-to'g'ri yorug'lik manbasidan uzoqlashtiring." };
  }
  return { ok: true };
}

/**
 * Codes for which an automatic, silent re-capture is worth one attempt before
 * bothering the user. Never used for definitive denials (NO_MATCH, SPOOF) or for
 * conditions the user must fix themselves.
 */
export const AUTO_RETRY_CODES: ReadonlySet<FaceResultCode> = new Set<FaceResultCode>([
  'LOW_CONFIDENCE',
  'NO_FACE',
  'AI_UNAVAILABLE',
  'AI_TIMEOUT',
  'AI_BAD_RESPONSE',
  'NETWORK',
  'CLIENT_TIMEOUT',
  'BAD_GATEWAY'
]);

export function shouldAutoRetry(code: FaceResultCode | undefined, attemptsSoFar: number, maxAutoRetries = 1): boolean {
  if (!code) return false;
  if (attemptsSoFar >= maxAutoRetries) return false;
  return AUTO_RETRY_CODES.has(code);
}
