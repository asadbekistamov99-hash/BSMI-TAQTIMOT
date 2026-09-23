/**
 * Decision logic for the BROWSER-SIDE face engine (no Gemini, no API key, no
 * quota, no billing). Pure math only — the DOM/model loading lives in
 * faceLocalEngine.ts. Everything here is unit-tested in
 * tests/faceLocalPolicy.test.mjs.
 *
 * The engine produces 128-dimensional face descriptors (FaceNet-style, via
 * face-api.js). Two descriptors of the same person are usually < 0.5 apart
 * (euclidean); different people are usually > 0.65 apart.
 */

import type { FaceResultCode } from './faceVerificationPolicy';

export const FACE_DESCRIPTOR_LENGTH = 128;

/** Median distance at or below this = same person. */
export const LOCAL_MATCH_DISTANCE = 0.55;
/** Median distance above this = definitely someone else (no auto-retry). */
export const LOCAL_NO_MATCH_DISTANCE = 0.72;
/** Minimum number of live frames in which a face was found. */
export const LOCAL_MIN_SAMPLES = 3;
/** Frames to try to collect during one pass. */
export const LOCAL_TARGET_SAMPLES = 5;
/** Two descriptors closer than this are "identical" (frozen frame / screenshot replay). */
export const LOCAL_IDENTICAL_EPSILON = 1e-4;
/** Minimum detector score for a frame to count. */
export const LOCAL_MIN_DETECTION_SCORE = 0.5;
/** Minimum face width relative to frame width — too far from the camera otherwise. */
export const LOCAL_MIN_FACE_RATIO = 0.12;

export function resolveLocalThreshold(envValue: string | undefined | null, fallback = LOCAL_MATCH_DISTANCE): number {
  if (envValue === undefined || envValue === null) return fallback;
  const n = Number(String(envValue).trim());
  if (!Number.isFinite(n) || n < 0.3 || n > 0.8) return fallback;
  return n;
}

export function isDescriptor(v: unknown): v is ArrayLike<number> {
  if (!v || typeof v !== 'object') return false;
  const arr = v as ArrayLike<number>;
  if (typeof arr.length !== 'number' || arr.length !== FACE_DESCRIPTOR_LENGTH) return false;
  for (let i = 0; i < arr.length; i++) {
    if (typeof arr[i] !== 'number' || !Number.isFinite(arr[i])) return false;
  }
  return true;
}

export function euclideanDistance(a: ArrayLike<number>, b: ArrayLike<number>): number {
  if (a.length !== b.length) return Number.POSITIVE_INFINITY;
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    sum += d * d;
  }
  return Math.sqrt(sum);
}

export function median(values: number[]): number {
  if (values.length === 0) return Number.POSITIVE_INFINITY;
  const sorted = [...values].sort((x, y) => x - y);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

/** Maps a distance to a 0..1 "similarity" for display only (never used for the decision). */
export function distanceToSimilarity(distance: number): number {
  if (!Number.isFinite(distance)) return 0;
  const s = (1.0 - distance) / (1.0 - 0.2);
  return Math.max(0, Math.min(1, Math.round(s * 1000) / 1000));
}

export interface LocalSample {
  descriptor: ArrayLike<number>;
  score: number;
  /** face box width divided by frame width */
  faceRatio: number;
  /** horizontal head rotation (see estimateYaw); NaN/undefined when unknown */
  yaw?: number;
}

export interface LocalDecision {
  verified: boolean;
  code?: FaceResultCode;
  retryable: boolean;
  reason: string;
  /** median euclidean distance to the enrolled descriptor */
  distance: number;
  /** display-only similarity 0..1 */
  confidence: number;
  samples: number;
  /** the sample closest to a template (only on success) — used for adaptive learning */
  bestSample?: LocalSample;
  bestDistance?: number;
}

/** All descriptors pairwise (near-)identical → a static image replayed frame after frame. */
export function looksFrozen(samples: LocalSample[], epsilon = LOCAL_IDENTICAL_EPSILON): boolean {
  if (samples.length < 2) return false;
  for (let i = 1; i < samples.length; i++) {
    if (euclideanDistance(samples[0].descriptor, samples[i].descriptor) > epsilon) return false;
  }
  return true;
}

export function decideLocalVerification(
  enrolled: ArrayLike<number> | ArrayLike<number>[] | null | undefined,
  samples: LocalSample[],
  threshold: number = LOCAL_MATCH_DISTANCE
): LocalDecision {
  const t = resolveLocalThreshold(String(threshold));
  const base = { distance: Number.POSITIVE_INFINITY, confidence: 0, samples: 0 };
  const templates = normalizeTemplates(enrolled);

  if (templates.length === 0) {
    return {
      ...base,
      verified: false,
      code: 'BAD_GATEWAY',
      retryable: false,
      reason: "Ro'yxatdan o'tgan suratda yuz aniqlanmadi. Iltimos, \"Yuzni qayta suratga olish\" orqali yorug' joyda yangi surat oling."
    };
  }

  const usable = samples.filter(s =>
    isDescriptor(s.descriptor) && s.score >= LOCAL_MIN_DETECTION_SCORE && s.faceRatio >= LOCAL_MIN_FACE_RATIO &&
    (typeof s.yaw !== 'number' || !Number.isFinite(s.yaw) || isFrontal(s.yaw))
  );
  const tooFar = samples.length > 0 && usable.length < LOCAL_MIN_SAMPLES && samples.some(s => s.faceRatio > 0 && s.faceRatio < LOCAL_MIN_FACE_RATIO);

  if (usable.length < LOCAL_MIN_SAMPLES) {
    return {
      ...base,
      samples: usable.length,
      verified: false,
      code: 'NO_FACE',
      retryable: true,
      reason: tooFar
        ? "Yuz kameradan juda uzoq. Iltimos, kameraga yaqinroq keling va to'g'ri qarang."
        : "Kadrlarda aniq inson yuzi topilmadi. Kameraga to'g'ri qarab, yuzingiz to'liq va yorug' ko'rinishini ta'minlang."
    };
  }

  if (looksFrozen(usable)) {
    return {
      ...base,
      samples: usable.length,
      verified: false,
      code: 'SPOOF',
      retryable: false,
      reason: "Jonlilik tekshiruvidan o'tmadi: kadrlar harakatsiz (ekran yoki surat). Iltimos, jonli kameraga qarang."
    };
  }

  const distances = usable.map(s => bestTemplateDistance(templates, s.descriptor));
  const d = median(distances);
  const confidence = distanceToSimilarity(d);
  let bestIdx = 0;
  for (let i = 1; i < distances.length; i++) if (distances[i] < distances[bestIdx]) bestIdx = i;

  if (d <= t) {
    return { verified: true, retryable: false, reason: 'Yuz muvaffaqiyatli solishtirildi', distance: d, confidence, samples: usable.length, bestSample: usable[bestIdx], bestDistance: distances[bestIdx] };
  }
  if (d > LOCAL_NO_MATCH_DISTANCE) {
    return {
      verified: false,
      code: 'NO_MATCH',
      retryable: false,
      reason: "Yuz ro'yxatdan o'tgan surat bilan mos kelmadi.",
      distance: d,
      confidence,
      samples: usable.length
    };
  }
  return {
    verified: false,
    code: 'LOW_CONFIDENCE',
    retryable: true,
    reason: `Moslik darajasi yetarli emas (${Math.round(confidence * 100)}%). Xonani yoritib, ko'zoynak/bosh kiyimni olib, kameraga yaqinroq va to'g'ri qarang.`,
    distance: d,
    confidence,
    samples: usable.length
  };
}

// ---------------------------------------------------------------------------
// Multi-template matching, adaptive learning, pose and liveness helpers.
// ---------------------------------------------------------------------------

/** Maximum descriptors kept per user (each ~1 KB in Firestore). */
export const MAX_TEMPLATES = 6;
/** A verification this close to a template is a "strong" match that may teach a new template. */
export const TEMPLATE_LEARN_DISTANCE = 0.42;
/** A new template must be at least this far from every existing one to add information. */
export const TEMPLATE_MIN_DIVERSITY = 0.22;
/** Stop collecting as soon as this many consecutive samples all match. */
export const EARLY_ACCEPT_SAMPLES = 3;
/** |yaw| above this = head turned too far for a reliable descriptor. */
export const MAX_FRONTAL_YAW = 0.32;
/** Head-turn challenge: how far the yaw must move from the baseline. */
export const CHALLENGE_TURN_YAW = 0.2;
/** Head-turn challenge: yaw must come back within this of the baseline afterwards. */
export const CHALLENGE_RETURN_YAW = 0.12;

/** Accepts a single descriptor or a list and returns a clean list of valid templates. */
export function normalizeTemplates(input: unknown): ArrayLike<number>[] {
  if (isDescriptor(input)) return [input];
  if (Array.isArray(input)) return input.filter(isDescriptor) as ArrayLike<number>[];
  return [];
}

/** Smallest distance from a sample to any template (∞ when there are no templates). */
export function bestTemplateDistance(templates: ArrayLike<number>[], sample: ArrayLike<number>): number {
  let best = Number.POSITIVE_INFINITY;
  for (const t of templates) {
    const d = euclideanDistance(t, sample);
    if (d < best) best = d;
  }
  return best;
}

/** True when the last N usable samples all match — no need to wait for more frames. */
export function canEarlyAccept(
  templates: ArrayLike<number>[],
  samples: LocalSample[],
  threshold: number = LOCAL_MATCH_DISTANCE,
  n: number = EARLY_ACCEPT_SAMPLES
): boolean {
  if (templates.length === 0 || samples.length < n) return false;
  const tail = samples.slice(-n);
  if (looksFrozen(tail)) return false;
  return tail.every(s => s.score >= LOCAL_MIN_DETECTION_SCORE && s.faceRatio >= LOCAL_MIN_FACE_RATIO && bestTemplateDistance(templates, s.descriptor) <= threshold);
}

/**
 * Adaptive learning (what phones do): after a strong match, remember the new
 * descriptor when it is different enough from what we already store (new
 * lighting, glasses, beard...). Never learns from a weak match, and never from a
 * descriptor that is already represented.
 */
export function shouldLearnTemplate(templates: ArrayLike<number>[], candidate: ArrayLike<number>): boolean {
  if (!isDescriptor(candidate) || templates.length === 0 || templates.length >= MAX_TEMPLATES) return false;
  let nearest = Number.POSITIVE_INFINITY;
  for (const t of templates) nearest = Math.min(nearest, euclideanDistance(t, candidate));
  return nearest <= TEMPLATE_LEARN_DISTANCE && nearest >= TEMPLATE_MIN_DIVERSITY;
}

export interface Point { x: number; y: number }

const dist2d = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const mean2d = (pts: Point[]): Point => ({
  x: pts.reduce((s, p) => s + p.x, 0) / pts.length,
  y: pts.reduce((s, p) => s + p.y, 0) / pts.length
});

/**
 * Horizontal head rotation from 68-point landmarks: nose tip offset from the
 * midpoint between the eyes, normalised by the eye distance. 0 = frontal,
 * negative/positive = turned to one side. NaN when landmarks are unusable.
 */
export function estimateYaw(landmarks: Point[] | null | undefined): number {
  if (!landmarks || landmarks.length < 68) return Number.NaN;
  const leftEye = mean2d(landmarks.slice(36, 42));
  const rightEye = mean2d(landmarks.slice(42, 48));
  const eyeDist = dist2d(leftEye, rightEye);
  if (!(eyeDist > 0)) return Number.NaN;
  const mid = { x: (leftEye.x + rightEye.x) / 2, y: (leftEye.y + rightEye.y) / 2 };
  const nose = landmarks[30];
  return (nose.x - mid.x) / eyeDist;
}

export function isFrontal(yaw: number, limit: number = MAX_FRONTAL_YAW): boolean {
  return Number.isFinite(yaw) && Math.abs(yaw) <= limit;
}

/**
 * Passive micro-motion: a live person never holds the head perfectly still. The
 * nose tip position (normalised by face width) must vary across samples.
 */
export function hasMicroMotion(noseTrack: Array<{ x: number; y: number; faceWidth: number }>, minStd = 0.006): boolean {
  const pts = noseTrack.filter(p => p.faceWidth > 0);
  if (pts.length < 3) return false;
  const xs = pts.map(p => p.x / p.faceWidth);
  const ys = pts.map(p => p.y / p.faceWidth);
  const std = (v: number[]) => {
    const m = v.reduce((s, x) => s + x, 0) / v.length;
    return Math.sqrt(v.reduce((s, x) => s + (x - m) * (x - m), 0) / v.length);
  };
  return Math.max(std(xs), std(ys)) >= minStd;
}

export type ChallengeState = 'waiting' | 'turned' | 'passed';

/**
 * Head-turn challenge evaluator (pure): feed it the yaw series so far, get the
 * state. Passed = the head turned clearly to either side and came back to the
 * centre. A printed photo cannot do that; a replayed video would have to guess
 * when the challenge starts.
 */
export function evaluateHeadTurn(yaws: number[], baseline: number, turn = CHALLENGE_TURN_YAW, back = CHALLENGE_RETURN_YAW): ChallengeState {
  let turnedAt = -1;
  for (let i = 0; i < yaws.length; i++) {
    const y = yaws[i];
    if (!Number.isFinite(y)) continue;
    if (turnedAt < 0 && Math.abs(y - baseline) >= turn) turnedAt = i;
    else if (turnedAt >= 0 && Math.abs(y - baseline) <= back) return 'passed';
  }
  return turnedAt >= 0 ? 'turned' : 'waiting';
}

/** Live guidance text for the tracking phase (null = everything is fine). */
export function guidanceFor(face: { score: number; faceRatio: number; yaw: number } | null, lumMean?: number): string | null {
  if (typeof lumMean === 'number' && lumMean < 38) return "Yorug'lik kam — chiroqni yoqing";
  if (!face) return "Yuz ko'rinmayapti — kameraga qarang";
  if (face.faceRatio < LOCAL_MIN_FACE_RATIO) return "Yaqinroq keling";
  if (face.faceRatio > 0.75) return "Biroz uzoqlashing";
  if (!isFrontal(face.yaw)) return "To'g'ri qarang";
  if (face.score < LOCAL_MIN_DETECTION_SCORE) return "Yuzingiz to'liq ko'rinsin";
  return null;
}

/** Firestore stores plain arrays; Float32Array → number[] rounded to 5 decimals (~1 KB). */
export function serializeDescriptor(d: ArrayLike<number>): number[] {
  const out: number[] = [];
  for (let i = 0; i < d.length; i++) out.push(Math.round(d[i] * 1e5) / 1e5);
  return out;
}
