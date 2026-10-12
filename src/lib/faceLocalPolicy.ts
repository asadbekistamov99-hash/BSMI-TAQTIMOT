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
  enrolled: ArrayLike<number> | null | undefined,
  samples: LocalSample[],
  threshold: number = LOCAL_MATCH_DISTANCE
): LocalDecision {
  const t = resolveLocalThreshold(String(threshold));
  const base = { distance: Number.POSITIVE_INFINITY, confidence: 0, samples: 0 };

  if (!isDescriptor(enrolled)) {
    return {
      ...base,
      verified: false,
      code: 'BAD_GATEWAY',
      retryable: false,
      reason: "Ro'yxatdan o'tgan suratda yuz aniqlanmadi. Iltimos, \"Yuzni qayta suratga olish\" orqali yorug' joyda yangi surat oling."
    };
  }

  const usable = samples.filter(s =>
    isDescriptor(s.descriptor) && s.score >= LOCAL_MIN_DETECTION_SCORE && s.faceRatio >= LOCAL_MIN_FACE_RATIO
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

  const distances = usable.map(s => euclideanDistance(enrolled, s.descriptor));
  const d = median(distances);
  const confidence = distanceToSimilarity(d);

  if (d <= t) {
    return { verified: true, retryable: false, reason: 'Yuz muvaffaqiyatli solishtirildi', distance: d, confidence, samples: usable.length };
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

/** Firestore stores plain arrays; Float32Array → number[] rounded to 5 decimals (~1 KB). */
export function serializeDescriptor(d: ArrayLike<number>): number[] {
  const out: number[] = [];
  for (let i = 0; i < d.length; i++) out.push(Math.round(d[i] * 1e5) / 1e5);
  return out;
}
