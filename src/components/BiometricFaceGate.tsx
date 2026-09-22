import { useState, useEffect, useRef, useCallback } from 'react';
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { Camera, ShieldCheck, ShieldAlert, UserCheck, RefreshCw, LogOut, CheckCircle2, AlertTriangle, Eye, ShieldOff } from 'lucide-react';
import {
  analyzeLuminance,
  assessFrameQuality,
  shouldAutoRetry,
  FACE_ID_CLIENT_TIMEOUT_MS,
  type FaceResultCode
} from '../lib/faceVerificationPolicy';
import { writeFaceIdSession, clearFaceIdSession } from '../lib/faceIdSession';
import { useSettings } from '../hooks/useSettings';
import {
  ensureLocalEngine,
  getLocalEngineStage,
  getLocalEngineError,
  onLocalEngineStage,
  verifyAgainstVideo,
  resolveEnrolledDescriptor,
  descriptorFromDataUrl,
  serializeDescriptor,
  type LocalEngineStage
} from '../lib/faceLocalEngine';
import { LOCAL_MATCH_DISTANCE, resolveLocalThreshold, isDescriptor } from '../lib/faceLocalPolicy';

const LOCAL_THRESHOLD = resolveLocalThreshold((import.meta as any).env?.VITE_FACE_LOCAL_THRESHOLD, LOCAL_MATCH_DISTANCE);

interface BiometricFaceGateProps {
  user: any;
  onVerified: () => void;
}

interface VerificationOutcome {
  success: boolean;
  isMatch?: boolean;
  confidence?: number;
  code?: FaceResultCode;
  retryable?: boolean;
  reason?: string;
  message?: string;
  /** provider error text from the server (already sanitised) */
  detail?: string | null;
}

// === Capture settings ===
// 480px wide JPEG frames (~50-90 KB each) give the model enough facial detail
// without blowing the request past Vercel's 4.5 MB body limit (5 frames + the
// enrolled photo ≈ 0.5 MB).
const CAPTURE_WIDTH = 480;
const CAPTURE_QUALITY = 0.85;
const PASSIVE_FRAME_COUNT = 5;
const PASSIVE_FRAME_INTERVAL_MS = 700;
const CAMERA_START_TIMEOUT_MS = 12000;
const ENROLL_SAVE_TIMEOUT_MS = 20000;
const MAX_AUTO_RETRIES = 1;
const AUTO_RETRY_DELAY_MS = 1500;

const sleep = (ms: number) => new Promise<void>(res => setTimeout(res, ms));

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    promise.then(
      v => { clearTimeout(timer); resolve(v); },
      e => { clearTimeout(timer); reject(e); }
    );
  });
}

function describeCameraError(err: any): string {
  const name = String(err?.name || '');
  const msg = String(err?.message || '');
  if (name === 'NotAllowedError' || name === 'PermissionDeniedError' || /permission/i.test(msg)) {
    return "Kameraga ruxsat berilmadi. Brauzer manzil satridagi qulf belgisini bosib, kameraga ruxsat bering va sahifani yangilang.";
  }
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
    return "Qurilmada kamera topilmadi. Iltimos, kamerasi bor qurilmadan foydalaning.";
  }
  if (name === 'NotReadableError' || name === 'TrackStartError' || name === 'AbortError') {
    return "Kamera boshqa dastur (Zoom, Telegram, boshqa brauzer oynasi) tomonidan band. Uni yopib, qayta urinib ko'ring.";
  }
  if (name === 'SecurityError' || /secure/i.test(msg)) {
    return "Kamera faqat xavfsiz (HTTPS) ulanishda ishlaydi. Sayt manzili https:// bilan boshlanishini tekshiring.";
  }
  if (/timed out|Timeout/i.test(msg) || name === 'TimeoutError') {
    return "Kameradan javob kelishi cho'zilib ketdi. Qurilma kamerasini va brauzer ruxsatlarini tekshirib, qayta urinib ko'ring.";
  }
  return "Kameraga ulanishda xatolik yuz berdi. Iltimos, kamera ruxsatini yoqing va qayta urinib ko'ring.";
}

export default function BiometricFaceGate({ user, onVerified }: BiometricFaceGateProps) {
  const [profile, setProfile] = useState<any>(user);
  const [loadingProfile] = useState(false);
  // When the student explicitly asks to re-enroll, this overrides whatever the
  // Firestore document says until the new photo is saved. (Previously the
  // "re-take photo" button silently did nothing for enrolled users, because the
  // enrolled flag from the live user document could never be cleared locally —
  // students with a bad enrollment photo were locked out permanently.)
  const [forceEnroll, setForceEnroll] = useState(false);

  const enrolledPhoto: string | null = profile?.faceIdPhoto || user?.faceIdPhoto || null;
  const enrolledFlag = !!(user?.faceIdEnrolled || profile?.faceIdEnrolled);
  // An "enrolled" flag without a stored photo is unusable → treat as not enrolled
  // so the student can (re)enroll instead of waiting forever for a check that can't start.
  const isEnrolled = !forceEnroll && enrolledFlag && !!enrolledPhoto;

  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [videoPlayable, setVideoPlayable] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationOutcome | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const [serviceHealth, setServiceHealth] = useState<{ state: 'unknown' | 'ok' | 'down'; message?: string }>({ state: 'unknown' });

  // === Engine selection ===
  // 'local' (default): face-api.js runs in the student's browser — no API key,
  // no quota, no billing, no server region. 'gemini': the server-side AI check.
  // Admin → Tizim Sozlamalari → Modulni Boshqarish → "Face ID dvigateli".
  const { settings } = useSettings();
  const engine: 'local' | 'gemini' = settings?.features?.faceIdEngine === 'gemini' ? 'gemini' : 'local';
  const isLocal = engine === 'local';
  const [localStage, setLocalStage] = useState<LocalEngineStage>(getLocalEngineStage());
  const [localProgress, setLocalProgress] = useState<{ collected: number; target: number } | null>(null);
  const enrolledDescriptorRef = useRef<Float32Array | null>(null);

  // === Passive liveness state ===
  // No visible instructions are ever shown to the user (no "blink", "turn head", etc).
  // We silently capture a short burst of frames while the user just looks at the
  // camera normally; the backend AI compares them for natural micro-movement and
  // for spoofing signs (identical frames, screen glare, paper edges, flat lighting).
  const [livenessStage, setLivenessStage] = useState<'idle' | 'capturing' | 'done'>('idle');
  const livenessStageRef = useRef<'idle' | 'capturing' | 'done'>('idle');
  const autoRetryCountRef = useRef(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sampleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const scanIntervalRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(true);
  const startingCameraRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const setStage = (stage: 'idle' | 'capturing' | 'done') => {
    livenessStageRef.current = stage;
    setLivenessStage(stage);
  };

  // Fire-and-forget audit log. Firestore write promises do not resolve while the
  // device is offline, so these must NEVER be awaited on the path that lets the
  // student in — a flaky connection used to freeze the gate on "Yuz tasdiqlandi".
  const writeAudit = useCallback((entry: Record<string, unknown>) => {
    try {
      addDoc(collection(db, 'biometric_audit'), {
        userId: user?.uid || 'noma\'lum',
        userEmail: user?.email || 'noma\'lum',
        userName: profile?.displayName || user?.displayName || 'Foydalanuvchi',
        timestamp: serverTimestamp(),
        ...entry
      }).catch(err => console.error("Error writing biometric audit log:", err));
    } catch (err) {
      console.error("Error queuing biometric audit log:", err);
    }
  }, [user, profile]);

  // Load user profile from Firestore to see Face ID state in background
  useEffect(() => {
    async function loadUserProfile() {
      if (!user?.uid) return;
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && mountedRef.current) {
          setProfile(userSnap.data());
        }
      } catch (err) {
        console.error("Error loading user profile for Face ID:", err);
      }
    }
    loadUserProfile();
  }, [user?.uid]);

  // Pre-flight: ask the server whether Face ID is configured at all. If the API
  // key is missing we say so immediately instead of making the student go through
  // the camera flow only to be told "service unavailable" every single time.
  useEffect(() => {
    if (engine !== 'gemini') return;
    let cancelled = false;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    fetch('/api/verify-face/health', { signal: controller.signal, cache: 'no-store' })
      .then(async res => {
        const data = await res.json().catch(() => null);
        if (cancelled) return;
        if (!data || typeof data.aiConfigured !== 'boolean') {
          // The server answered, but not with our JSON: the API function itself is
          // not running (wrong vercel.json rewrite, failed build, crashed function).
          // This is exactly what students used to see as a vague "tizim ulanishida muammo".
          if (res.status === 404 || res.status === 405 || res.status >= 500) {
            setServiceHealth({
              state: 'down',
              message: `Server API funksiyasi ishlamayapti (HTTP ${res.status}). Bu Face ID emas, deploy muammosi: administrator Vercel deploy loglarini va vercel.json dagi "/api" rewrite sozlamasini tekshirishi kerak.`
            });
          }
          return;
        }
        setServiceHealth(data.aiConfigured
          ? { state: 'ok' }
          : { state: 'down', message: data.message || "Face ID xizmati serverda sozlanmagan. Administratorga xabar bering." });
      })
      .catch(() => { /* unknown → proceed normally; the verify call reports precisely */ })
      .finally(() => clearTimeout(timer));
    return () => { cancelled = true; controller.abort(); clearTimeout(timer); };
  }, [engine]);

  // Local engine: start downloading the models as soon as the gate opens so they
  // are ready by the time the camera is (cached by the browser after the first visit).
  useEffect(() => {
    if (!isLocal) return;
    const off = onLocalEngineStage(s => { if (mountedRef.current) setLocalStage(s); });
    ensureLocalEngine().catch(err => console.warn('[FACE LOCAL] engine load failed:', err));
    return off;
  }, [isLocal]);

  // The enrolled descriptor must be recomputed if the enrolled photo changes.
  useEffect(() => {
    enrolledDescriptorRef.current = null;
  }, [enrolledPhoto, profile?.faceIdDescriptor]);

  const stopStream = () => {
    const s = streamRef.current;
    if (s) {
      s.getTracks().forEach(track => { try { track.stop(); } catch { /* ignore */ } });
      streamRef.current = null;
    }
  };

  // Stop webcam
  const stopCamera = () => {
    stopStream();
    setCameraStream(null);
    setCameraActive(false);
    setVideoPlayable(false);
    clearInterval(scanIntervalRef.current);
    setScanProgress(0);
  };

  // Start webcam (with constraint fallbacks: some phones/laptops reject the
  // ideal-resolution request but happily give a default stream).
  const startCamera = async () => {
    if (startingCameraRef.current) return;
    startingCameraRef.current = true;
    try {
      setCameraError(null);
      setCapturedImage(null);
      setVerificationResult(null);
      setVideoPlayable(false);
      setStage('idle');
      stopStream();

      if (typeof window !== 'undefined' && window.isSecureContext === false) {
        throw Object.assign(new Error('insecure context'), { name: 'SecurityError' });
      }
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError("Sizning brauzeringiz yoki qurilmangiz video kamerani qo'llab-quvvatlamaydi. Chrome, Safari yoki Firefox'ning yangi versiyasidan foydalaning.");
        return;
      }

      const constraintsList: MediaStreamConstraints[] = [
        { video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }, audio: false },
        { video: { facingMode: 'user' }, audio: false },
        { video: true, audio: false }
      ];

      let stream: MediaStream | null = null;
      let lastErr: any = null;
      for (const constraints of constraintsList) {
        try {
          stream = await withTimeout(
            navigator.mediaDevices.getUserMedia(constraints),
            CAMERA_START_TIMEOUT_MS,
            "Kamera manbasini ishga tushirishda vaqt tugadi (Timeout starting video source)"
          );
          break;
        } catch (err: any) {
          lastErr = err;
          const name = String(err?.name || '');
          // Permission / no-device errors won't change with looser constraints.
          if (name === 'NotAllowedError' || name === 'PermissionDeniedError' || name === 'NotFoundError' || name === 'DevicesNotFoundError' || name === 'SecurityError') {
            break;
          }
        }
      }

      if (!stream) {
        console.warn("Webcam access prevented or error:", lastErr?.message || lastErr);
        setCameraError(describeCameraError(lastErr));
        return;
      }
      if (!mountedRef.current) {
        stream.getTracks().forEach(t => t.stop());
        return;
      }

      const track = stream.getVideoTracks()[0];
      if (track) {
        track.onended = () => {
          if (!mountedRef.current) return;
          if (streamRef.current === stream) {
            stopCamera();
            if (livenessStageRef.current === 'capturing') {
              setStage('idle');
            }
            setCameraError("Kamera uzildi (boshqa dastur uni band qildi yoki qurilma uzildi). Qayta urinib ko'ring.");
          }
        };
      }

      streamRef.current = stream;
      setCameraStream(stream);
      setCameraActive(true);
    } catch (err: any) {
      console.warn("Webcam access prevented or error:", err?.message || err);
      setCameraError(describeCameraError(err));
    } finally {
      startingCameraRef.current = false;
    }
  };

  // Bind camera stream to video element when video element is rendered or stream changes
  useEffect(() => {
    const video = videoRef.current;
    if (video && cameraStream) {
      if (video.srcObject !== cameraStream) {
        video.srcObject = cameraStream;
      }
      video.play().then(() => {
        if (mountedRef.current) setVideoPlayable(true);
      }).catch(err => {
        console.warn("Failed to play video in useEffect:", err);
      });
    }
  }, [cameraStream, cameraActive]);

  // Reset verification and restart camera (manual retry resets the auto-retry budget)
  const handleResetVerification = () => {
    autoRetryCountRef.current = 0;
    setStatusNote(null);
    setCapturedImage(null);
    setVerificationResult(null);
    setCameraError(null);
    setVideoPlayable(false);
    startCamera();
  };

  // Re-enroll: lets the student overwrite an old/bad photo with a fresh clear one.
  const handleReEnroll = () => {
    autoRetryCountRef.current = 0;
    setStatusNote(null);
    setCapturedImage(null);
    setVerificationResult(null);
    setCameraError(null);
    setVideoPlayable(false);
    setStage('idle');
    setForceEnroll(true);
    startCamera();
  };

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopStream();
      clearInterval(scanIntervalRef.current);
    };
  }, []);

  // Auto-start camera once
  useEffect(() => {
    if (!loadingProfile) {
      startCamera();
    }
    return () => {
      stopStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingProfile]);

  // Animate a simulated scanline when camera is active
  useEffect(() => {
    if (cameraActive && !capturedImage) {
      scanIntervalRef.current = setInterval(() => {
        setScanProgress(p => (p >= 100 ? 0 : p + 2));
      }, 50);
    } else {
      clearInterval(scanIntervalRef.current);
      setScanProgress(0);
    }
    return () => clearInterval(scanIntervalRef.current);
  }, [cameraActive, capturedImage]);

  const readyForAutoCheck =
    isEnrolled && !!enrolledPhoto && cameraActive && videoPlayable &&
    !capturedImage && !verifying && !verificationResult && livenessStage === 'idle' &&
    (isLocal ? localStage === 'ready' : serviceHealth.state !== 'down');

  // Auto-start the passive liveness sequence once camera is ready and user is enrolled.
  useEffect(() => {
    let active = true;
    let retryTimer: any = null;

    const attemptStart = () => {
      if (!active) return;
      if (!readyForAutoCheck) return;
      if (videoRef.current && videoRef.current.videoWidth > 0) {
        runLivenessSequence();
      } else {
        retryTimer = setTimeout(attemptStart, 500);
      }
    };

    if (readyForAutoCheck) {
      retryTimer = setTimeout(attemptStart, 1500); // let exposure settle first
    }

    return () => {
      active = false;
      if (retryTimer) clearTimeout(retryTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyForAutoCheck]);

  // Capture one raw frame from the live video WITHOUT stopping the camera
  // (needed because the liveness sequence captures several frames in a row).
  const captureFrameOnly = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
      return null;
    }
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const aspectRatio = video.videoWidth / video.videoHeight;
    const targetWidth = Math.min(CAPTURE_WIDTH, video.videoWidth);
    const targetHeight = Math.round(targetWidth / aspectRatio);
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
    return canvas.toDataURL('image/jpeg', CAPTURE_QUALITY);
  };

  // Cheap lighting check on a 64px thumbnail: stops us from sending a black or
  // pitch-dark burst to the AI (guaranteed rejection) and tells the student what to fix.
  const checkFrameQuality = (): { ok: boolean; code?: FaceResultCode; message?: string } => {
    try {
      const video = videoRef.current;
      if (!video || video.videoWidth === 0) return { ok: true };
      if (!sampleCanvasRef.current) sampleCanvasRef.current = document.createElement('canvas');
      const c = sampleCanvasRef.current;
      c.width = 64;
      c.height = 48;
      const ctx = c.getContext('2d', { willReadFrequently: true } as any);
      if (!ctx) return { ok: true };
      ctx.drawImage(video, 0, 0, 64, 48);
      const data = ctx.getImageData(0, 0, 64, 48).data;
      const quality = assessFrameQuality(analyzeLuminance(data, 1));
      return quality.ok ? { ok: true } : { ok: false, code: quality.code, message: quality.message };
    } catch (err) {
      console.warn("Frame quality check skipped:", err);
      return { ok: true };
    }
  };

  // Legacy single-shot capture used only for the enrollment photo (no liveness needed there).
  const capturePhoto = () => {
    const quality = checkFrameQuality();
    if (!quality.ok) {
      setCameraError(quality.message || "Tasvir sifati yetarli emas.");
      return null;
    }
    const base64 = captureFrameOnly();
    if (base64) {
      setCameraError(null);
      setCapturedImage(base64);
      stopCamera();
      return base64;
    }
    console.warn("capturePhoto called but video element is not ready or has zero dimensions.");
    return null;
  };

  // Runs a silent passive-liveness capture: several frames are taken a short time
  // apart while the user simply looks at the camera — no instructions are ever
  // shown. The backend AI compares the frames for natural micro-movement (a real
  // face never looks pixel-identical between frames) and for spoofing signs (a
  // held-up photo or a phone/monitor screen). Nothing here grants access — only
  // the backend's verdict does.
  // Browser-side verification: several descriptors are taken from the live video
  // and compared with the enrolled descriptor (see faceLocalPolicy.ts). No network
  // call is involved; the only thing written is the audit log.
  const runLocalVerification = async () => {
    const video = videoRef.current;
    if (!video || !streamRef.current) {
      setStage('idle');
      setVerificationResult({ success: false, code: 'CAMERA', retryable: true, message: "Kamera uzildi. Iltimos, qayta urinib ko'ring." });
      return;
    }
    setLocalProgress({ collected: 0, target: 5 });
    let decision: Awaited<ReturnType<typeof verifyAgainstVideo>>;
    try {
      await ensureLocalEngine();
      if (!enrolledDescriptorRef.current) {
        const storedDescriptor = profile?.faceIdDescriptor ?? user?.faceIdDescriptor;
        enrolledDescriptorRef.current = await resolveEnrolledDescriptor({ faceIdDescriptor: storedDescriptor, faceIdPhoto: enrolledPhoto });
        // Cache the descriptor computed from an old photo so the next login skips this step.
        if (enrolledDescriptorRef.current && !isDescriptor(storedDescriptor) && user?.uid) {
          setDoc(doc(db, 'users', user.uid), {
            faceIdDescriptor: serializeDescriptor(enrolledDescriptorRef.current),
            faceIdEngine: 'local'
          }, { merge: true }).catch(err => console.warn('[FACE LOCAL] descriptor cache write failed:', err));
        }
      }
      decision = await verifyAgainstVideo(video, enrolledDescriptorRef.current, {
        threshold: LOCAL_THRESHOLD,
        onProgress: (collected, target) => { if (mountedRef.current) setLocalProgress({ collected, target }); },
        shouldAbort: () => !mountedRef.current || !streamRef.current
      });
    } catch (err: any) {
      console.error('[FACE LOCAL] verification failed:', err);
      setLocalProgress(null);
      setStage('idle');
      const failure: VerificationOutcome = {
        success: false,
        code: 'BAD_GATEWAY',
        retryable: true,
        message: "Yuz tanish modeli yuklanmadi yoki ishlamadi. Internet aloqasini tekshirib, sahifani yangilang va qayta urinib ko'ring.",
        detail: String(err?.message || err).slice(0, 200)
      };
      writeAudit({ action: 'verification', status: 'error', engine: 'local', code: failure.code, details: failure.detail });
      if (await maybeAutoRetry(failure.code)) return;
      setStatusNote(null);
      setVerificationResult(failure);
      return;
    }

    setLocalProgress(null);
    if (!mountedRef.current) return;
    const lastFrame = captureFrameOnly();
    if (lastFrame) setCapturedImage(lastFrame);
    stopCamera();
    setStage('idle');

    const detail = Number.isFinite(decision.distance)
      ? `masofa ${decision.distance.toFixed(2)} (chegara ${LOCAL_THRESHOLD}), kadrlar ${decision.samples}`
      : `kadrlar ${decision.samples}`;

    if (decision.verified) {
      setStatusNote(null);
      setVerificationResult({ success: true, isMatch: true, confidence: decision.confidence, reason: decision.reason });
      writeAudit({ action: 'verification', status: 'success', engine: 'local', confidence: decision.confidence, details: `${decision.reason} — ${detail}` });
      writeFaceIdSession(user?.uid);
      setTimeout(() => { if (mountedRef.current) onVerified(); }, 800);
      return;
    }

    const outcome: VerificationOutcome = {
      success: false,
      isMatch: false,
      confidence: decision.confidence,
      code: decision.code,
      retryable: decision.retryable,
      reason: decision.reason,
      detail
    };
    writeAudit({ action: 'verification', status: 'failure', engine: 'local', code: decision.code || null, confidence: decision.confidence, details: `${decision.reason} — ${detail}` });
    if (await maybeAutoRetry(decision.code)) return;
    setStatusNote(null);
    setVerificationResult(outcome);
  };

  const runLivenessSequence = async () => {
    if (livenessStageRef.current !== 'idle') return;
    if (!enrolledPhoto) {
      setVerificationResult({ success: false, code: 'BAD_GATEWAY', message: "Ro'yxatdan o'tgan surat topilmadi. Iltimos, yuzingizni qayta ro'yxatdan o'tkazing." });
      return;
    }
    setVerificationResult(null);
    setStage('capturing');

    const quality = checkFrameQuality();
    if (!quality.ok) {
      setStage('idle');
      setVerificationResult({ success: false, code: quality.code, retryable: false, message: quality.message });
      return;
    }

    if (isLocal) {
      await runLocalVerification();
      return;
    }

    const frames: { type: string; image: string }[] = [];
    for (let i = 0; i < PASSIVE_FRAME_COUNT; i++) {
      if (!mountedRef.current) return;
      if (!videoRef.current || !streamRef.current) {
        // Camera got interrupted mid-capture — abort safely, do not verify.
        setStage('idle');
        setVerificationResult({ success: false, code: 'CAMERA', retryable: true, message: "Kamera uzildi. Iltimos, qayta urinib ko'ring." });
        return;
      }
      const frame = captureFrameOnly();
      if (!frame) {
        setStage('idle');
        setVerificationResult({ success: false, code: 'CAMERA', retryable: true, message: "Kadr olinmadi. Iltimos, kameraga yaxshi qarab, qayta urinib ko'ring." });
        return;
      }
      frames.push({ type: `frame_${i + 1}`, image: frame });
      if (i < PASSIVE_FRAME_COUNT - 1) {
        await sleep(PASSIVE_FRAME_INTERVAL_MS);
      }
    }

    setStage('done');
    const lastFrame = frames[frames.length - 1];
    if (lastFrame) setCapturedImage(lastFrame.image);
    stopCamera();
    await handleVerifyFace(frames);
  };

  // Register / Enroll Face ID
  const handleEnrollFace = async () => {
    const photo = capturedImage || capturePhoto();
    if (!photo || !user?.uid) return;

    const previousPhotoExisted = !!enrolledPhoto && enrolledFlag;
    try {
      setEnrolling(true);
      setCameraError(null);

      // Local engine: make sure the photo actually contains a recognisable face
      // and store its descriptor next to the photo. (If the model is not available
      // right now, the photo alone is stored and the descriptor is computed on the
      // first verification instead.)
      let descriptor: number[] | null = null;
      if (isLocal) {
        try {
          const d = await withTimeout(descriptorFromDataUrl(photo), 25000, 'Yuz tanish modeli yuklanmadi');
          if (!d) {
            setCameraError("Suratda aniq yuz topilmadi. Yorug' joyda, kameraga to'g'ri va yaqinroq qarab qayta suratga oling.");
            setCapturedImage(null);
            startCamera();
            return;
          }
          descriptor = serializeDescriptor(d);
          enrolledDescriptorRef.current = d;
        } catch (modelErr) {
          console.warn('[FACE LOCAL] descriptor at enrollment skipped:', modelErr);
        }
      }

      const userRef = doc(db, 'users', user.uid);
      await withTimeout(
        setDoc(userRef, {
          faceIdPhoto: photo,
          faceIdEnrolled: true,
          faceIdEnabled: true,
          faceIdEnrolledAt: new Date(),
          ...(descriptor ? { faceIdDescriptor: descriptor, faceIdEngine: 'local' } : {}),
          updatedAt: new Date()
        }, { merge: true }),
        ENROLL_SAVE_TIMEOUT_MS,
        "Internet aloqasi sekin: Face ID ma'lumotlarini saqlab bo'lmadi. Aloqani tekshirib, qayta urinib ko'ring."
      );

      writeAudit({
        action: previousPhotoExisted ? 're-enrollment' : 'enrollment',
        status: 'success',
        details: previousPhotoExisted
          ? "Talaba yuz biometrik suratini yangi surat bilan almashtirdi"
          : "Yangi yuz biometrik ma'lumotlari muvaffaqiyatli ro'yxatdan o'tkazildi"
      });

      setProfile((prev: any) => ({
        ...prev,
        faceIdPhoto: photo,
        faceIdEnrolled: true,
        faceIdEnabled: true,
        ...(descriptor ? { faceIdDescriptor: descriptor } : {})
      }));
      setForceEnroll(false);
      writeFaceIdSession(user.uid);

      // Successfully enrolled, let user in
      onVerified();
    } catch (err: any) {
      console.error("Error saving Face ID:", err);
      setCameraError("Face ID ma'lumotlarini saqlashda xatolik yuz berdi: " + (err?.message || err));
    } finally {
      setEnrolling(false);
    }
  };

  // Schedules one silent re-capture for soft failures (low confidence, timeouts,
  // transient service errors). Definitive denials (different person, spoof,
  // quota exhausted) never auto-retry.
  const maybeAutoRetry = async (code: FaceResultCode | undefined): Promise<boolean> => {
    if (!shouldAutoRetry(code, autoRetryCountRef.current, MAX_AUTO_RETRIES)) return false;
    autoRetryCountRef.current += 1;
    setStatusNote("Aniqroq natija uchun avtomatik qayta tekshirilmoqda...");
    await sleep(AUTO_RETRY_DELAY_MS);
    if (!mountedRef.current) return true;
    setCapturedImage(null);
    setVerificationResult(null);
    setVideoPlayable(false);
    await startCamera(); // the auto-start effect kicks off the next liveness sequence
    return true;
  };

  // Verify captured liveness frames against the enrolled face.
  // ZERO-TRUST RULE: any network error, timeout, non-200 response or ambiguous
  // result is treated as NOT VERIFIED. There must never be a code path here that
  // grants access on failure — the backend is the single source of truth.
  const handleVerifyFace = async (frames: { type: string; image: string }[]) => {
    if (!frames || frames.length < 2 || !enrolledPhoto) {
      setVerificationResult({ success: false, message: "Tekshiruv uchun yetarli ma'lumot yo'q." });
      setStage('idle');
      return;
    }

    let result: any = null;
    let failure: VerificationOutcome | null = null;
    try {
      setVerifying(true);
      setVerificationResult(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FACE_ID_CLIENT_TIMEOUT_MS);

      let response: Response;
      try {
        response = await fetch('/api/verify-face', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enrolledImage: enrolledPhoto, frames }),
          signal: controller.signal
        });
      } finally {
        clearTimeout(timeoutId);
      }

      // Always read the body — even on non-200 the backend returns a structured
      // fail-closed JSON payload ({verified:false, code, reason}) that we want to show.
      result = await response.json().catch(() => null);

      if (!result || typeof result !== 'object' || typeof result.verified !== 'boolean') {
        failure = {
          success: false,
          code: 'BAD_GATEWAY',
          retryable: response.status >= 500 && response.status !== 501,
          message: response.status === 404 || response.status === 405
            ? `Server API yo'nalishi topilmadi (HTTP ${response.status}). Bu deploy muammosi — administratorga xabar bering.`
            : response.status === 413
              ? "Yuborilgan kadrlar hajmi juda katta (HTTP 413). Yuzni qayta ro'yxatdan o'tkazib, kichikroq surat saqlang."
              : response.status >= 500
                ? `Server vaqtincha javob bermayapti (HTTP ${response.status}). Bir necha soniyadan so'ng qayta urinib ko'ring.`
                : `Server javobini o'qib bo'lmadi (HTTP ${response.status}). Qayta urinib ko'ring.`
        };
      }
    } catch (err: any) {
      console.error("Face verification request failed:", err?.message || err);
      const timedOut = err?.name === 'AbortError';
      failure = {
        success: false,
        code: timedOut ? 'CLIENT_TIMEOUT' : 'NETWORK',
        retryable: true,
        message: timedOut
          ? "Ulanish vaqti tugadi. Iltimos, internet aloqangizni tekshirib qayta urinib ko'ring."
          : "Tizim ulanishida muammo yuz berdi. Xavfsizlik nuqtai nazaridan kirish rad etildi. Qayta urinib ko'ring."
      };
    }

    if (failure) {
      setVerifying(false);
      setStage('idle');
      writeAudit({ action: 'verification', status: 'error', code: failure.code || null, details: failure.message || 'Tarmoq xatoligi' });
      if (await maybeAutoRetry(failure.code)) return;
      setStatusNote(null);
      setVerificationResult(failure);
      return;
    }

    // The backend already enforces match + liveness + confidence threshold and
    // returns `verified`. We trust ONLY that field — never re-derive a looser pass.
    const isMatch = result.verified === true;
    const confidence = typeof result.confidence === 'number' ? result.confidence : 0;
    const code: FaceResultCode | undefined = typeof result.code === 'string' ? result.code : undefined;

    try {
      if (isMatch) {
        setStatusNote(null);
        setVerificationResult({
          success: true,
          isMatch: true,
          confidence,
          reason: result.reason || 'Yuz muvaffaqiyatli solishtirildi'
        });
        writeAudit({
          action: 'verification',
          status: 'success',
          confidence,
          model: result.model || null,
          details: result.reason || 'Yuz muvaffaqiyatli solishtirildi'
        });
        writeFaceIdSession(user?.uid);
        // Let user enter after 0.8 seconds delay to enjoy the premium biometric verification screen
        setTimeout(() => {
          if (mountedRef.current) onVerified();
        }, 800);
      } else {
        const outcome: VerificationOutcome = {
          success: false,
          isMatch: false,
          confidence,
          code,
          retryable: result.retryable === true,
          reason: result.reason || "Yuz mos kelmadi. Iltimos, xonani yaxshilab yoriting yoki kameraga to'g'ri qarang.",
          detail: typeof result.detail === 'string' && result.detail ? result.detail : null
        };
        writeAudit({
          action: 'verification',
          status: code && code.startsWith('AI_') ? 'error' : 'failure',
          code: code || null,
          confidence,
          model: result.model || null,
          details: outcome.reason
        });
        setVerifying(false);
        setStage('idle');
        if (await maybeAutoRetry(code)) return;
        setStatusNote(null);
        setVerificationResult(outcome);
      }
    } catch (auditErr: any) {
      // Logging failures must never affect the verified/not-verified decision above —
      // this catch exists only to stop a Firestore hiccup from crashing the UI.
      console.error("Post-verification bookkeeping error:", auditErr);
    } finally {
      setVerifying(false);
      setStage('idle');
    }
  };

  // Sign out / Logout if user is stuck or on shared machine
  const handleLogout = async () => {
    try {
      stopCamera();
      clearFaceIdSession(user?.uid);
      await signOut(auth);
      sessionStorage.removeItem('adminToken');
      sessionStorage.removeItem('virtualGuestUser');
      window.location.reload();
    } catch (err) {
      console.error("Error logging out from Face ID Gate:", err);
    }
  };

  if (loadingProfile) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center p-6 text-white font-sans select-none">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <Eye className="w-6 h-6 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-indigo-300">Biometrik xavfsizlik tekshirilmoqda...</p>
      </div>
    );
  }

  const isHardDenial = verificationResult && !verificationResult.success && (verificationResult.code === 'NO_MATCH' || verificationResult.code === 'SPOOF');
  const serviceDown = serviceHealth.state === 'down';

  return (
    <div className="fixed inset-0 bg-slate-950/98 backdrop-blur-xl z-50 flex items-center justify-center p-4 font-sans select-none overflow-y-auto">
      {/* Background glowing decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden text-center">
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* Header decoration */}
        <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-4 animate-pulse">
          <ShieldCheck className="w-8 h-8" />
        </div>

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">
          {isEnrolled ? "Face ID orqali kirish" : (forceEnroll ? "Face ID ni yangilash" : "Face ID ro'yxatga olish")}
        </h2>
        <p className="text-slate-400 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
          {isEnrolled
            ? "Hisobingiz xavfsizligini ta'minlash va boshqalar bilan ulashishni oldini olish uchun yuzingizni tasdiqlang."
            : forceEnroll
              ? "Yorug' joyda, kameraga to'g'ri qarab yangi surat oling. Eski surat yangisi bilan almashtiriladi."
              : "Hisobingiz xavfsizligini ta'minlash, uni boshqalarga berishni oldini olish va tizimdan to'g'ri foydalanish uchun yuzingizni ro'yxatdan o'tkazing."
          }
        </p>

        {/* Service unavailable banner (server has no AI key) */}
        {isLocal && localStage === 'error' && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2 text-left">
            <ShieldOff className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="flex-1">
              Yuz tanish modeli yuklanmadi (internet yoki CDN bloklangan). Sahifani yangilang yoki qayta urinib ko'ring.
              {getLocalEngineError() && <span className="block mt-1 font-mono text-[10px] opacity-70 break-all">{getLocalEngineError()}</span>}
            </span>
            <button
              onClick={() => ensureLocalEngine().catch(() => { /* stage listener reports */ })}
              className="shrink-0 px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-[10px] font-bold uppercase"
            >
              Qayta
            </button>
          </div>
        )}
        {isLocal && isEnrolled && (localStage === 'script' || localStage === 'models') && (
          <div className="mt-4 p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] flex items-center gap-2 justify-center">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Yuz tanish modeli yuklanmoqda (bir martalik, ~6 MB)...</span>
          </div>
        )}
        {!isLocal && serviceDown && isEnrolled && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2 text-left">
            <ShieldOff className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{serviceHealth.message}</span>
          </div>
        )}

        {/* Camera / Visual Feedback Area */}
        <div className="mt-6 mb-6 relative mx-auto w-64 h-64 rounded-full border-4 border-slate-800 overflow-hidden bg-slate-950 flex items-center justify-center group shadow-inner">

          {/* Circular Cyan Radar Ring */}
          {cameraActive && !capturedImage && (
            <div className="absolute inset-0 rounded-full border border-cyan-500/30 scale-105 animate-ping duration-1000" />
          )}

          {/* Biometric corner lines */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400 opacity-60 rounded-tl-md" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-400 opacity-60 rounded-tr-md" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-400 opacity-60 rounded-bl-md" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-400 opacity-60 rounded-br-md" />

          {/* HTML5 Video elements */}
          {cameraActive && !capturedImage ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              onLoadedMetadata={(e) => {
                e.currentTarget.play().catch(err => console.warn("onLoadedMetadata play failed:", err));
              }}
              onPlaying={() => setVideoPlayable(true)}
              onLoadedData={() => setVideoPlayable(true)}
              className="w-full h-full object-cover scale-x-[-1] rounded-full"
            />
          ) : capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured biometric"
              className="w-full h-full object-cover scale-x-[-1] rounded-full"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-500 p-4">
              <Camera className="w-12 h-12 mb-2 text-slate-600 group-hover:text-indigo-400 transition-colors" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Kamera o'chirilgan</span>
            </div>
          )}

          {/* Futuristic animated scanline */}
          {cameraActive && !capturedImage && (
            <div
              className="absolute left-0 right-0 h-1 bg-cyan-500/75 shadow-[0_0_15px_#22d3ee] pointer-events-none transition-all ease-linear"
              style={{ top: `${scanProgress}%` }}
            />
          )}

          {/* Automatic scanning overlay */}
          {cameraActive && videoPlayable && !capturedImage && livenessStage === 'idle' && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-cyan-500/95 text-slate-950 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full animate-pulse shadow-lg z-10 border border-cyan-300 whitespace-nowrap">
              {statusNote
                ? "Qayta tekshirilmoqda..."
                : isEnrolled
                  ? (isLocal && localStage !== 'ready' ? (localStage === 'error' ? "Model yuklanmadi" : "Model yuklanmoqda...") : "Tekshirishga tayyorlanmoqda...")
                  : "Skanerlashga tayyor"}
            </div>
          )}

          {/* Passive liveness overlay: no instructions are shown — the person just looks
              at the camera as normal while a short burst of frames is captured silently
              in the background for the backend to analyze. */}
          {livenessStage === 'capturing' && (
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 z-20">
              <div className="w-10 h-10 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mb-3" />
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-300 bg-slate-950/80 px-3 py-1 rounded-full border border-cyan-500/40">
                {localProgress ? `Tekshirilmoqda... ${localProgress.collected}/${localProgress.target}` : 'Tekshirilmoqda...'}
              </span>
            </div>
          )}

          {/* Camera loading/initializing overlay */}
          {cameraActive && !videoPlayable && !capturedImage && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-amber-500/95 text-slate-950 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full animate-pulse shadow-lg z-10 border border-amber-300">
              Kamera tayyorlanmoqda...
            </div>
          )}

          {/* Verifying / Matching AI Loader Overlay */}
          {verifying && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 overflow-hidden">
              <div className="absolute w-48 h-48 rounded-full border border-dashed border-cyan-500/30 animate-[spin_12s_linear_infinite]" />
              <div className="absolute w-40 h-40 rounded-full border-2 border-dotted border-cyan-400/40 animate-[spin_6s_linear_infinite_reverse]" />
              <div className="absolute inset-4 rounded-full border border-cyan-500/20 animate-ping opacity-75" />
              <div className="absolute left-0 right-0 h-[4px] bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-[bounce_2s_infinite] pointer-events-none" />
              <div className="absolute top-10 left-10 w-5 h-5 border-t-2 border-l-2 border-cyan-400 animate-pulse" />
              <div className="absolute top-10 right-10 w-5 h-5 border-t-2 border-r-2 border-cyan-400 animate-pulse" />
              <div className="absolute bottom-10 left-10 w-5 h-5 border-b-2 border-l-2 border-cyan-400 animate-pulse" />
              <div className="absolute bottom-10 right-10 w-5 h-5 border-b-2 border-r-2 border-cyan-400 animate-pulse" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="p-3 bg-cyan-950/80 rounded-2xl border border-cyan-500/30 shadow-inner mb-3">
                  <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-cyan-400 animate-pulse">SOLISHTIRILMOQDA...</span>
                <span className="text-[8px] font-mono text-cyan-500/80 mt-1 uppercase tracking-widest animate-pulse">PROCESSING FACIAL FEATURES</span>
              </div>
            </div>
          )}

          {/* Enrolling state overlay */}
          {enrolling && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 overflow-hidden">
              <div className="absolute w-48 h-48 rounded-full border border-dashed border-indigo-500/30 animate-[spin_12s_linear_infinite]" />
              <div className="absolute w-40 h-40 rounded-full border-2 border-dotted border-indigo-400/40 animate-[spin_6s_linear_infinite_reverse]" />
              <div className="absolute inset-4 rounded-full border border-indigo-500/20 animate-ping opacity-75" />
              <div className="absolute left-0 right-0 h-[4px] bg-indigo-400 shadow-[0_0_15px_#818cf8] animate-[bounce_2s_infinite] pointer-events-none" />
              <div className="absolute top-10 left-10 w-5 h-5 border-t-2 border-l-2 border-indigo-400 animate-pulse" />
              <div className="absolute top-10 right-10 w-5 h-5 border-t-2 border-r-2 border-indigo-400 animate-pulse" />
              <div className="absolute bottom-10 left-10 w-5 h-5 border-b-2 border-l-2 border-indigo-400 animate-pulse" />
              <div className="absolute bottom-10 right-10 w-5 h-5 border-b-2 border-r-2 border-indigo-400 animate-pulse" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="p-3 bg-indigo-950/80 rounded-2xl border border-indigo-500/30 shadow-inner mb-3">
                  <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-indigo-400 animate-pulse">RO'YXATGA OLINMOQDA...</span>
                <span className="text-[8px] font-mono text-indigo-500/80 mt-1 uppercase tracking-widest animate-pulse">CREATING BIOMETRIC TEMPLATE</span>
              </div>
            </div>
          )}

          {/* Verification Result Overlay */}
          {verificationResult && (
            <div className={`absolute inset-0 backdrop-blur-md flex flex-col items-center justify-center p-4 transition-all duration-300 ${
              verificationResult.success ? 'bg-emerald-950/85 text-emerald-400' : 'bg-rose-950/85 text-rose-400'
            }`}>
              {verificationResult.success ? (
                <>
                  <CheckCircle2 className="w-12 h-12 animate-bounce" />
                  <span className="text-[11px] font-bold uppercase tracking-widest mt-2">Yuz Tasdiqlandi!</span>
                  <span className="text-[9px] opacity-75 mt-1">Moslik: {((verificationResult.confidence || 0) * 100).toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-12 h-12 text-rose-400 animate-bounce" />
                  <span className="text-[11px] font-bold uppercase tracking-widest mt-2">Tasdiqlanmadi</span>
                  <span className="text-[9px] text-center max-w-[220px] opacity-80 mt-1 font-sans line-clamp-3">
                    {verificationResult.message || verificationResult.reason || "Yuz mos kelmadi."}
                  </span>

                  {/* Retry & Re-enroll Buttons directly inside the overlay */}
                  <div className="mt-3 flex flex-col gap-1.5 w-full max-w-[220px]">
                    <button
                      onClick={handleResetVerification}
                      className="w-full px-3 py-2 bg-rose-600 hover:bg-rose-500 active:scale-95 transition text-white font-bold text-[10px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-rose-600/30 font-sans"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Qayta urinish (Retry)
                    </button>
                    <button
                      onClick={handleReEnroll}
                      className="w-full px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 transition text-slate-200 font-semibold text-[9px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-1 cursor-pointer border border-slate-700 font-sans"
                    >
                      <Camera className="w-3 h-3 text-cyan-400" />
                      Yuzni qayta suratga olish
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Transient status note (auto-retry) */}
        {statusNote && !verificationResult && (
          <div className="p-2.5 mb-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] flex items-center gap-2 justify-center">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>{statusNote}</span>
          </div>
        )}

        {/* Error message */}
        {cameraError && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs flex items-center gap-2 text-left">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{cameraError}</span>
          </div>
        )}

        {/* Reason feedback from the verification service if available */}
        {verificationResult && !verificationResult.success && (
          <div className="p-3 mb-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 text-left">
            <p className="font-bold text-slate-300 mb-1 flex items-center gap-1.5 text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              Tafsilotlar:
            </p>
            <p className="text-[11px] leading-relaxed">{verificationResult.reason || verificationResult.message}</p>
            {(verificationResult.detail || verificationResult.code) && (
              <p className="text-[10px] leading-relaxed mt-2 font-mono text-slate-500 break-words">
                {verificationResult.code ? `[${verificationResult.code}] ` : ''}{verificationResult.detail || ''}
              </p>
            )}
            {isHardDenial && (
              <p className="text-[10px] leading-relaxed mt-2 text-slate-500">
                Agar bu sizning hisobingiz bo'lsa va eski surat sifatsiz bo'lsa, "Yuzni qayta suratga olish" tugmasi orqali yorug' joyda yangi surat oling.
              </p>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col gap-2">
          {!cameraActive && !capturedImage && (
            <button
              onClick={startCamera}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:scale-98 transition text-white font-bold text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <Camera className="w-4 h-4" />
              Kamerani yoqish
            </button>
          )}

          {cameraActive && !capturedImage && livenessStage === 'idle' && (
            <div className="flex flex-col gap-2">
              <button
                onClick={async () => {
                  if (isEnrolled) {
                    if (!isLocal && serviceDown) return;
                    if (isLocal && localStage !== 'ready') return;
                    await runLivenessSequence();
                  } else {
                    const photo = capturePhoto();
                    if (!photo && !cameraError) {
                      setCameraError("Kameradan tasvir olinmadi. Iltimos, kameraga qarang va biroz kuting.");
                    }
                  }
                }}
                disabled={isEnrolled && ((!isLocal && serviceDown) || (isLocal && localStage !== 'ready'))}
                className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed active:scale-98 transition text-white font-bold text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                {isEnrolled ? "Yuzni tekshirish" : "Suratga olish"}
              </button>

              {isEnrolled && (
                <button
                  onClick={handleReEnroll}
                  className="w-full py-2 text-slate-400 hover:text-slate-200 text-[11px] font-semibold flex items-center justify-center gap-1.5 border border-slate-800 rounded-xl hover:bg-slate-800/40 transition"
                >
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  Yuzni qayta ro'yxatdan o'tkazish (Yangi surat)
                </button>
              )}

              {forceEnroll && enrolledFlag && !!enrolledPhoto && (
                <button
                  onClick={() => {
                    setForceEnroll(false);
                    setCameraError(null);
                    setVerificationResult(null);
                  }}
                  className="w-full py-2 text-slate-500 hover:text-slate-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 border border-slate-800/60 rounded-xl hover:bg-slate-800/40 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Bekor qilish — eski surat bilan tekshirish
                </button>
              )}
            </div>
          )}

          {capturedImage && !verifying && !enrolling && (
            <div className="w-full">
              {verificationResult && !verificationResult.success ? (
                // NOTE: there is intentionally NO "enter anyway" button here.
                // A failed or errored verification must never have a way to bypass
                // it from the UI — the only options are retry or re-enroll.
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleResetVerification}
                    className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-500 active:scale-98 transition text-white font-bold text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-rose-600/35 cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Qayta urinish (Retry Verification)
                  </button>
                  <button
                    onClick={handleReEnroll}
                    className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 active:scale-98 transition text-slate-200 font-bold text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-cyan-400" />
                    Yangi surat bilan ro'yxatdan o'tish
                  </button>
                </div>
              ) : !isEnrolled ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={startCamera}
                    className="py-3 px-3 border border-slate-700 hover:border-slate-500 hover:bg-slate-800/50 transition text-slate-300 font-bold text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Qayta olish
                  </button>
                  <button
                    onClick={handleEnrollFace}
                    className="py-3 px-3 bg-emerald-600 hover:bg-emerald-500 active:scale-98 transition text-white font-bold text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {forceEnroll ? "Saqlash" : "Ro'yxatdan o'tish"}
                  </button>
                </div>
              ) : null}
            </div>
          )}

          {/* Cancel/Logout */}
          <button
            onClick={handleLogout}
            className="w-full mt-4 py-2 text-slate-500 hover:text-slate-300 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5 border border-slate-800/50 rounded-2xl hover:bg-slate-900/50 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            Tizimdan chiqish (Logout)
          </button>
        </div>

        {/* Hidden Canvas */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
