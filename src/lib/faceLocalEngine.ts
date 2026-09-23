/**
 * Browser-side face engine: loads face-api.js (TensorFlow.js, ~6.5 MB of model
 * weights, cached by the browser after the first visit) from a CDN and computes
 * 128-d face descriptors from the webcam / from the enrolled photo.
 *
 * Nothing leaves the device: no API key, no quota, no billing, no region. The
 * decision itself is in faceLocalPolicy.ts (pure, unit-tested).
 *
 * Speed: the models are warmed up right after loading (the first inference
 * compiles GPU shaders and is 5-10× slower than the rest), the verification
 * loop runs back-to-back without artificial pauses and stops as soon as three
 * consecutive frames match. Typical verification on a laptop: 0.7-1.5 s.
 */

import {
  decideLocalVerification,
  canEarlyAccept,
  normalizeTemplates,
  estimateYaw,
  isFrontal,
  hasMicroMotion,
  evaluateHeadTurn,
  guidanceFor,
  isDescriptor,
  serializeDescriptor,
  LOCAL_TARGET_SAMPLES,
  LOCAL_MIN_DETECTION_SCORE,
  LOCAL_MIN_FACE_RATIO,
  type LocalSample,
  type LocalDecision,
  type ChallengeState,
  type Point
} from './faceLocalPolicy';

declare global {
  interface Window {
    faceapi?: any;
  }
}

const SCRIPT_URLS = [
  'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1/dist/face-api.js',
  'https://unpkg.com/@vladmandic/face-api@1/dist/face-api.js'
];
const MODEL_URLS = [
  'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1/model',
  'https://unpkg.com/@vladmandic/face-api@1/model',
  'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights'
];

const envScript = (import.meta as any).env?.VITE_FACE_API_SCRIPT_URL as string | undefined;
const envModels = (import.meta as any).env?.VITE_FACE_API_MODEL_URL as string | undefined;

/** Detector input size: smaller = faster. 224 is plenty for a face that fills ≥12% of the frame. */
const VIDEO_INPUT_SIZE = 224;
/** Still photos (enrollment) get a larger input for a slightly better descriptor. */
const PHOTO_INPUT_SIZE = 320;

export type LocalEngineStage = 'idle' | 'script' | 'models' | 'warmup' | 'ready' | 'error';

let stage: LocalEngineStage = 'idle';
let lastError: string | null = null;
let loadPromise: Promise<any> | null = null;
const listeners = new Set<(s: LocalEngineStage) => void>();

function setStage(s: LocalEngineStage) {
  stage = s;
  listeners.forEach(l => { try { l(s); } catch { /* ignore */ } });
}

export function getLocalEngineStage(): LocalEngineStage { return stage; }
export function getLocalEngineError(): string | null { return lastError; }
export function onLocalEngineStage(listener: (s: LocalEngineStage) => void): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function loadScriptFrom(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    if (window.faceapi) return resolve(window.faceapi);
    const existing = document.querySelector(`script[data-bsmi-faceapi="${url}"]`) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => window.faceapi ? resolve(window.faceapi) : reject(new Error('faceapi global missing')));
      existing.addEventListener('error', () => reject(new Error(`Script load failed: ${url}`)));
      return;
    }
    const s = document.createElement('script');
    s.src = url;
    s.async = true;
    s.crossOrigin = 'anonymous';
    s.setAttribute('data-bsmi-faceapi', url);
    s.onload = () => window.faceapi ? resolve(window.faceapi) : reject(new Error('faceapi global missing after load'));
    s.onerror = () => reject(new Error(`Script load failed: ${url}`));
    document.head.appendChild(s);
  });
}

async function loadScript(): Promise<any> {
  if (window.faceapi) return window.faceapi;
  const urls = envScript ? [envScript, ...SCRIPT_URLS] : SCRIPT_URLS;
  let err: any = null;
  for (const url of urls) {
    try {
      return await loadScriptFrom(url);
    } catch (e) {
      err = e;
    }
  }
  throw err || new Error('face-api script could not be loaded');
}

async function loadModelsFrom(faceapi: any, base: string): Promise<void> {
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(base),
    faceapi.nets.faceLandmark68TinyNet.loadFromUri(base),
    faceapi.nets.faceRecognitionNet.loadFromUri(base)
  ]);
}

/** First inference compiles the GPU kernels; do it on a blank canvas so the student never waits for it. */
async function warmUp(faceapi: any): Promise<void> {
  try {
    const c = document.createElement('canvas');
    c.width = 160;
    c.height = 120;
    const ctx = c.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#777';
      ctx.fillRect(0, 0, c.width, c.height);
    }
    await faceapi.detectSingleFace(c, new faceapi.TinyFaceDetectorOptions({ inputSize: VIDEO_INPUT_SIZE, scoreThreshold: 0.1 }))
      .withFaceLandmarks(true)
      .withFaceDescriptor();
  } catch {
    // warm-up is best effort
  }
}

/**
 * Loads script + models once per page. Safe to call many times; concurrent
 * callers share the same promise. Resolves to the faceapi namespace.
 */
export function ensureLocalEngine(): Promise<any> {
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    try {
      setStage('script');
      const faceapi = await loadScript();
      const already = faceapi.nets?.tinyFaceDetector?.isLoaded && faceapi.nets?.faceLandmark68TinyNet?.isLoaded && faceapi.nets?.faceRecognitionNet?.isLoaded;
      if (!already) {
        setStage('models');
        const bases = envModels ? [envModels, ...MODEL_URLS] : MODEL_URLS;
        let err: any = null;
        let ok = false;
        for (const base of bases) {
          try {
            await loadModelsFrom(faceapi, base);
            ok = true;
            break;
          } catch (e) {
            err = e;
          }
        }
        if (!ok) throw err || new Error('face models could not be loaded');
      }
      setStage('warmup');
      await warmUp(faceapi);
      lastError = null;
      setStage('ready');
      return faceapi;
    } catch (e: any) {
      lastError = String(e?.message || e);
      setStage('error');
      loadPromise = null; // allow a retry later
      throw e;
    }
  })();
  return loadPromise;
}

export interface DetectedFace {
  descriptor: Float32Array | null;
  score: number;
  /** face box width / source width */
  faceRatio: number;
  /** horizontal head rotation, NaN when unknown */
  yaw: number;
  /** nose tip in source pixels, plus the face box width (for micro-motion) */
  nose: { x: number; y: number; faceWidth: number } | null;
  box: { x: number; y: number; width: number; height: number } | null;
}

type Source = HTMLVideoElement | HTMLImageElement | HTMLCanvasElement;

function sourceWidth(source: Source): number {
  return (source as HTMLVideoElement).videoWidth || (source as HTMLImageElement).naturalWidth || (source as HTMLCanvasElement).width || 0;
}

function toResult(result: any, width: number): DetectedFace | null {
  if (!result || !result.detection) return null;
  const box = result.detection.box;
  const landmarks: Point[] | undefined = result.landmarks?.positions;
  const yaw = landmarks ? estimateYaw(landmarks) : Number.NaN;
  const nose = landmarks && landmarks[30] && box ? { x: landmarks[30].x, y: landmarks[30].y, faceWidth: box.width } : null;
  return {
    descriptor: result.descriptor ? (result.descriptor as Float32Array) : null,
    score: typeof result.detection.score === 'number' ? result.detection.score : 0,
    faceRatio: box && width ? box.width / width : 0,
    yaw,
    nose,
    box: box ? { x: box.x, y: box.y, width: box.width, height: box.height } : null
  };
}

/** Detection + landmarks + descriptor. Slowest call (~100-300 ms on a laptop). */
export async function detectFace(source: Source, opts: { inputSize?: number } = {}): Promise<DetectedFace | null> {
  const faceapi = await ensureLocalEngine();
  const width = sourceWidth(source);
  if (!width) return null;
  const result = await faceapi
    .detectSingleFace(source, new faceapi.TinyFaceDetectorOptions({ inputSize: opts.inputSize ?? VIDEO_INPUT_SIZE, scoreThreshold: 0.4 }))
    .withFaceLandmarks(true)
    .withFaceDescriptor();
  return toResult(result, width);
}

/** Detection + landmarks only (no descriptor): 3-5× faster, used for guidance and the head-turn challenge. */
export async function trackFace(source: Source): Promise<DetectedFace | null> {
  const faceapi = await ensureLocalEngine();
  const width = sourceWidth(source);
  if (!width) return null;
  const result = await faceapi
    .detectSingleFace(source, new faceapi.TinyFaceDetectorOptions({ inputSize: VIDEO_INPUT_SIZE, scoreThreshold: 0.4 }))
    .withFaceLandmarks(true);
  return toResult(result, width);
}

/** Computes the descriptor of an enrolled photo (data URL). null → no face in it. */
export async function descriptorFromDataUrl(dataUrl: string): Promise<Float32Array | null> {
  await ensureLocalEngine();
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error('Enrolled photo could not be decoded'));
    el.src = dataUrl;
  });
  const face = await detectFace(img, { inputSize: PHOTO_INPUT_SIZE });
  return face?.descriptor ?? null;
}

export interface LocalVerifyOptions {
  targetSamples?: number;
  maxDurationMs?: number;
  threshold?: number;
  /** called after each frame so the UI can show progress and guidance */
  onFrame?: (info: { collected: number; target: number; guidance: string | null }) => void;
  shouldAbort?: () => boolean;
  /** mean luminance of the current frame, if the caller measures it (for guidance only) */
  getLuminance?: () => number | undefined;
}

export interface LocalVerifyResult {
  decision: LocalDecision;
  samples: LocalSample[];
  /** passive liveness signal: the head moved a little between frames */
  microMotion: boolean;
  durationMs: number;
  frames: number;
}

/**
 * Collects descriptors from the live video back-to-back (no artificial delay),
 * stops early once three consecutive frames match, and decides. Never throws
 * for "no face" cases — those come back as a decision with a code.
 */
export async function verifyAgainstVideo(
  video: HTMLVideoElement,
  enrolled: ArrayLike<number> | ArrayLike<number>[] | null,
  opts: LocalVerifyOptions = {}
): Promise<LocalVerifyResult> {
  const target = opts.targetSamples ?? LOCAL_TARGET_SAMPLES;
  const maxDuration = opts.maxDurationMs ?? 6000;
  const templates = normalizeTemplates(enrolled);
  const samples: LocalSample[] = [];
  const noseTrack: Array<{ x: number; y: number; faceWidth: number }> = [];
  const startedAt = Date.now();
  let frames = 0;

  while (samples.length < target && Date.now() - startedAt < maxDuration) {
    if (opts.shouldAbort?.()) break;
    frames++;
    let face: DetectedFace | null = null;
    try {
      face = await detectFace(video);
    } catch (e) {
      console.warn('[FACE LOCAL] detect failed:', e);
    }
    if (face && face.descriptor) {
      samples.push({ descriptor: face.descriptor, score: face.score, faceRatio: face.faceRatio, yaw: face.yaw });
      if (face.nose) noseTrack.push(face.nose);
    }
    opts.onFrame?.({
      collected: samples.length,
      target,
      guidance: guidanceFor(face ? { score: face.score, faceRatio: face.faceRatio, yaw: face.yaw } : null, opts.getLuminance?.())
    });
    if (canEarlyAccept(templates, samples, opts.threshold)) break;
    // yield to the event loop so the UI can paint; no artificial sleep
    await new Promise(r => setTimeout(r, 0));
  }

  const decision = decideLocalVerification(templates, samples, opts.threshold);
  return { decision, samples, microMotion: hasMicroMotion(noseTrack), durationMs: Date.now() - startedAt, frames };
}

export interface EnrollmentCapture {
  descriptors: number[][];
  bestScore: number;
}

/**
 * Enrollment: collects a few frontal, well-lit, close-enough descriptors so the
 * stored template set already covers small variations. Returns null when no
 * acceptable frame was seen inside the time budget.
 */
export async function collectEnrollmentSamples(
  video: HTMLVideoElement,
  opts: { target?: number; maxDurationMs?: number; onFrame?: (info: { collected: number; target: number; guidance: string | null }) => void; shouldAbort?: () => boolean } = {}
): Promise<EnrollmentCapture | null> {
  const target = opts.target ?? 3;
  const maxDuration = opts.maxDurationMs ?? 7000;
  const startedAt = Date.now();
  const descriptors: Float32Array[] = [];
  let bestScore = 0;

  while (descriptors.length < target && Date.now() - startedAt < maxDuration) {
    if (opts.shouldAbort?.()) break;
    let face: DetectedFace | null = null;
    try {
      face = await detectFace(video, { inputSize: PHOTO_INPUT_SIZE });
    } catch (e) {
      console.warn('[FACE LOCAL] enrollment detect failed:', e);
    }
    const good = !!face && !!face.descriptor && face.score >= Math.max(LOCAL_MIN_DETECTION_SCORE, 0.7) && face.faceRatio >= Math.max(LOCAL_MIN_FACE_RATIO, 0.16) && isFrontal(face.yaw);
    if (good && face && face.descriptor) {
      descriptors.push(face.descriptor);
      bestScore = Math.max(bestScore, face.score);
    }
    opts.onFrame?.({
      collected: descriptors.length,
      target,
      guidance: guidanceFor(face ? { score: face.score, faceRatio: face.faceRatio, yaw: face.yaw } : null)
    });
    await new Promise(r => setTimeout(r, descriptors.length < target ? 150 : 0));
  }

  if (descriptors.length === 0) return null;
  return { descriptors: descriptors.map(serializeDescriptor), bestScore };
}

export interface ChallengeOptions {
  timeoutMs?: number;
  onFrame?: (info: { state: ChallengeState; secondsLeft: number }) => void;
  shouldAbort?: () => boolean;
}

/**
 * Active liveness: the student turns the head to either side and back within
 * a few seconds. Uses the fast landmark-only tracker (~10-20 fps). Returns
 * 'passed', or the last state reached when the time ran out.
 */
export async function runHeadTurnChallenge(video: HTMLVideoElement, opts: ChallengeOptions = {}): Promise<ChallengeState> {
  const timeout = opts.timeoutMs ?? 7000;
  const startedAt = Date.now();
  const yaws: number[] = [];
  let baseline: number | null = null;
  let state: ChallengeState = 'waiting';

  while (Date.now() - startedAt < timeout) {
    if (opts.shouldAbort?.()) break;
    let face: DetectedFace | null = null;
    try {
      face = await trackFace(video);
    } catch (e) {
      console.warn('[FACE LOCAL] challenge track failed:', e);
    }
    const yaw = face ? face.yaw : Number.NaN;
    if (baseline === null && Number.isFinite(yaw)) baseline = yaw;
    yaws.push(yaw);
    if (baseline !== null) state = evaluateHeadTurn(yaws, baseline);
    opts.onFrame?.({ state, secondsLeft: Math.max(0, Math.ceil((timeout - (Date.now() - startedAt)) / 1000)) });
    if (state === 'passed') return state;
    await new Promise(r => setTimeout(r, 40));
  }
  return state;
}

/**
 * Templates stored in Firestore (faceIdDescriptors: number[][], or the older
 * single faceIdDescriptor), or computed from the enrolled photo. Empty list →
 * the enrolled photo has no recognisable face.
 */
export async function resolveEnrolledTemplates(profile: { faceIdDescriptors?: unknown; faceIdDescriptor?: unknown; faceIdPhoto?: string | null } | null | undefined): Promise<ArrayLike<number>[]> {
  const stored = [
    ...normalizeTemplates(profile?.faceIdDescriptors),
    ...normalizeTemplates(profile?.faceIdDescriptor)
  ];
  if (stored.length > 0) return stored;
  if (profile?.faceIdPhoto) {
    const d = await descriptorFromDataUrl(profile.faceIdPhoto);
    return d ? [d] : [];
  }
  return [];
}

export { serializeDescriptor, isDescriptor };
