/**
 * Browser-side face engine: loads face-api.js (TensorFlow.js, ~6.5 MB of model
 * weights, cached by the browser after the first visit) from a CDN and computes
 * 128-d face descriptors from the webcam / from the enrolled photo.
 *
 * Nothing leaves the device: no API key, no quota, no billing, no region. The
 * decision itself is in faceLocalPolicy.ts (pure, unit-tested).
 */

import {
  decideLocalVerification,
  isDescriptor,
  serializeDescriptor,
  LOCAL_TARGET_SAMPLES,
  type LocalSample,
  type LocalDecision
} from './faceLocalPolicy';

declare global {
  interface Window {
    faceapi?: any;
    __bsmiFaceApiPromise?: Promise<any>;
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

export type LocalEngineStage = 'idle' | 'script' | 'models' | 'ready' | 'error';

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
  descriptor: Float32Array;
  score: number;
  /** face box width / source width */
  faceRatio: number;
}

function detectorOptions(faceapi: any) {
  return new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.4 });
}

/** Runs detection + landmarks + descriptor on a video/image/canvas element. */
export async function detectFace(source: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement): Promise<DetectedFace | null> {
  const faceapi = await ensureLocalEngine();
  const width = (source as HTMLVideoElement).videoWidth || (source as HTMLImageElement).naturalWidth || (source as HTMLCanvasElement).width || 0;
  if (!width) return null;
  const result = await faceapi
    .detectSingleFace(source, detectorOptions(faceapi))
    .withFaceLandmarks(true)
    .withFaceDescriptor();
  if (!result || !result.descriptor) return null;
  const box = result.detection?.box;
  const faceRatio = box && width ? box.width / width : 0;
  return {
    descriptor: result.descriptor as Float32Array,
    score: typeof result.detection?.score === 'number' ? result.detection.score : 0,
    faceRatio
  };
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
  const face = await detectFace(img);
  return face ? face.descriptor : null;
}

export interface LocalVerifyOptions {
  targetSamples?: number;
  intervalMs?: number;
  maxDurationMs?: number;
  threshold?: number;
  /** called after each attempt so the UI can show progress */
  onProgress?: (collected: number, target: number) => void;
  shouldAbort?: () => boolean;
}

/**
 * Collects several descriptors from the live video and decides. Never throws
 * for "no face" cases — those come back as a decision with a code.
 */
export async function verifyAgainstVideo(
  video: HTMLVideoElement,
  enrolled: ArrayLike<number> | null,
  opts: LocalVerifyOptions = {}
): Promise<LocalDecision> {
  const target = opts.targetSamples ?? LOCAL_TARGET_SAMPLES;
  const interval = opts.intervalMs ?? 350;
  const maxDuration = opts.maxDurationMs ?? 6000;
  const samples: LocalSample[] = [];
  const startedAt = Date.now();
  let attempts = 0;

  while (samples.length < target && Date.now() - startedAt < maxDuration && attempts < target * 4) {
    if (opts.shouldAbort?.()) break;
    attempts++;
    try {
      const face = await detectFace(video);
      if (face) samples.push({ descriptor: face.descriptor, score: face.score, faceRatio: face.faceRatio });
    } catch (e) {
      // a single failed inference is not fatal; keep trying until the time budget ends
      console.warn('[FACE LOCAL] detect failed:', e);
    }
    opts.onProgress?.(samples.length, target);
    if (samples.length < target) await new Promise(r => setTimeout(r, interval));
  }

  return decideLocalVerification(enrolled, samples, opts.threshold);
}

/** Descriptor stored in Firestore (number[]) or computed from the enrolled photo. */
export async function resolveEnrolledDescriptor(profile: { faceIdDescriptor?: unknown; faceIdPhoto?: string | null } | null | undefined): Promise<Float32Array | null> {
  if (profile && isDescriptor(profile.faceIdDescriptor)) {
    return Float32Array.from(profile.faceIdDescriptor as ArrayLike<number>);
  }
  if (profile?.faceIdPhoto) {
    return descriptorFromDataUrl(profile.faceIdPhoto);
  }
  return null;
}

export { serializeDescriptor };
