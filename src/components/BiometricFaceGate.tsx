import { useState, useEffect, useRef, useCallback } from 'react';
import { doc, getDoc, updateDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { Camera, ShieldCheck, ShieldAlert, UserCheck, RefreshCw, LogOut, CheckCircle2, AlertTriangle, Eye } from 'lucide-react';

interface BiometricFaceGateProps {
  user: any;
  onVerified: () => void;
}

export default function BiometricFaceGate({ user, onVerified }: BiometricFaceGateProps) {
  const [profile, setProfile] = useState<any>(user);
  const [loadingProfile, setLoadingProfile] = useState(false);

  const isEnrolled = !!(user?.faceIdEnrolled || profile?.faceIdEnrolled);
  const enrolledPhoto = profile?.faceIdPhoto || user?.faceIdPhoto;

  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [videoPlayable, setVideoPlayable] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    isMatch?: boolean;
    confidence?: number;
    reason?: string;
    message?: string;
  } | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // === Passive liveness state ===
  // No visible instructions are ever shown to the user (no "blink", "turn head", etc).
  // We silently capture a short burst of frames while the user just looks at the
  // camera normally; the backend AI compares them for natural micro-movement and
  // for spoofing signs (identical frames, screen glare, paper edges, flat lighting).
  const [livenessStage, setLivenessStage] = useState<'idle' | 'capturing' | 'done'>('idle');
  const capturedFramesRef = useRef<{ type: string; image: string }[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scanIntervalRef = useRef<any>(null);

  // Load user profile from Firestore to see Face ID state in background
  useEffect(() => {
    async function loadUserProfile() {
      if (!user) return;
      try {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setProfile(userSnap.data());
        }
      } catch (err) {
        console.error("Error loading user profile for Face ID:", err);
      }
    }
    loadUserProfile();
  }, [user]);

  // Start webcam
  const startCamera = async () => {
    try {
      setCameraError(null);
      setCapturedImage(null);
      setVerificationResult(null);
      setVideoPlayable(false);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Sizning brauzeringiz yoki qurilmangiz video kamerani qo'llab-quvvatlamaydi.");
      }

      // Add a 10-second timeout race to prevent hanging if video source fails to initialize
      const getUserMediaWithTimeout = () => {
        return new Promise<MediaStream>((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error("Kamera manbasini ishga tushirishda vaqt tugadi (Timeout starting video source)"));
          }, 10000);

          navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
          }).then(stream => {
            clearTimeout(timeoutId);
            resolve(stream);
          }).catch(err => {
            clearTimeout(timeoutId);
            reject(err);
          });
        });
      };

      const stream = await getUserMediaWithTimeout();
      setCameraStream(stream);
      setCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().then(() => {
          setVideoPlayable(true);
        }).catch(err => console.warn("play in startCamera failed:", err));
      }
    } catch (err: any) {
      console.warn("Webcam access prevented or error:", err?.message || err);
      const isTimeout = err?.message?.includes("Timeout") || err?.name === "TimeoutError";
      const isPermissionDenied = err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError" || err?.message?.includes("Permission denied") || err?.message?.includes("permission");
      
      if (isPermissionDenied) {
        setCameraError(
          "Kameraga ulanish uchun ruxsat berilmadi. Iltimos, brauzer sozlamalarida kameraga ruxsat bering va qayta urinib ko'ring."
        );
      } else if (isTimeout) {
        setCameraError(
          "Kameradan javob kelishi cho'zilib ketdi. Iltimos, qurilmangiz kamerasini va brauzer ruxsatlarini tekshiring."
        );
      } else {
        setCameraError(
          "Kameraga ulanishda xatolik yuz berdi. Iltimos, kamera ruxsatini yoqing va qayta urinib ko'ring."
        );
      }
    }
  };

  // Stop webcam
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setCameraActive(false);
    setVideoPlayable(false);
    clearInterval(scanIntervalRef.current);
    setScanProgress(0);
  };

  // Bind camera stream to video element when video element is rendered or stream changes
  useEffect(() => {
    if (videoRef.current && cameraStream) {
      if (videoRef.current.srcObject !== cameraStream) {
        videoRef.current.srcObject = cameraStream;
      }
      videoRef.current.play().then(() => {
        setVideoPlayable(true);
      }).catch(err => {
        console.warn("Failed to play video in useEffect:", err);
      });
    }
  }, [cameraStream, cameraActive]);

  // Reset verification and restart camera
  const handleResetVerification = () => {
    setCapturedImage(null);
    setVerificationResult(null);
    setCameraError(null);
    setVideoPlayable(false);
    startCamera();
  };

  // Re-enroll: Allows student to overwrite old/bad photo with a fresh clear photo
  const handleReEnroll = () => {
    setCapturedImage(null);
    setVerificationResult(null);
    setCameraError(null);
    setVideoPlayable(false);
    setProfile((prev: any) => ({
      ...prev,
      faceIdEnrolled: false,
      faceIdPhoto: null
    }));
    startCamera();
  };

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      clearInterval(scanIntervalRef.current);
    };
  }, [cameraStream]);

  // Auto-start camera when profile is loaded
  useEffect(() => {
    if (!loadingProfile) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
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

  // Auto-start the liveness challenge sequence once camera is ready and user is enrolled.
  useEffect(() => {
    let active = true;
    let retryTimer: any = null;

    const attemptStart = () => {
      if (!active) return;
      if (isEnrolled && enrolledPhoto && cameraActive && videoPlayable && !capturedImage && !verifying && !verificationResult && livenessStage === 'idle') {
        if (videoRef.current && videoRef.current.videoWidth > 0) {
          runLivenessSequence();
        } else {
          retryTimer = setTimeout(attemptStart, 500);
        }
      }
    };

    if (isEnrolled && enrolledPhoto && cameraActive && videoPlayable && !capturedImage && !verifying && !verificationResult && livenessStage === 'idle') {
      retryTimer = setTimeout(attemptStart, 1500); // let exposure settle first
    }

    return () => {
      active = false;
      if (retryTimer) clearTimeout(retryTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnrolled, enrolledPhoto, cameraActive, videoPlayable, capturedImage, verifying, verificationResult, livenessStage]);

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

    const targetWidth = 400;
    const aspectRatio = video.videoWidth / video.videoHeight;
    const targetHeight = Math.round(targetWidth / aspectRatio);
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
    return canvas.toDataURL('image/jpeg', 0.80);
  };

  // Legacy single-shot capture used only for the enrollment photo (no liveness needed there).
  const capturePhoto = () => {
    const base64 = captureFrameOnly();
    if (base64) {
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
  const PASSIVE_FRAME_COUNT = 5;
  const PASSIVE_FRAME_INTERVAL_MS = 700;

  const runLivenessSequence = async () => {
    if (livenessStage !== 'idle') return;
    setVerificationResult(null);
    capturedFramesRef.current = [];
    setLivenessStage('capturing');

    const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

    for (let i = 0; i < PASSIVE_FRAME_COUNT; i++) {
      if (!videoRef.current || !cameraStream) {
        // Camera got interrupted mid-capture — abort safely, do not verify.
        setLivenessStage('idle');
        setVerificationResult({
          success: false,
          message: "Kamera uzildi. Iltimos, qayta urinib ko'ring."
        });
        return;
      }
      const frame = captureFrameOnly();
      if (!frame) {
        setLivenessStage('idle');
        setVerificationResult({
          success: false,
          message: "Kadr olinmadi. Iltimos, kameraga yaxshi qarab, qayta urinib ko'ring."
        });
        return;
      }
      capturedFramesRef.current.push({ type: `frame_${i + 1}`, image: frame });
      if (i < PASSIVE_FRAME_COUNT - 1) {
        await sleep(PASSIVE_FRAME_INTERVAL_MS);
      }
    }

    setLivenessStage('done');
    const lastFrame = capturedFramesRef.current[capturedFramesRef.current.length - 1];
    if (lastFrame) setCapturedImage(lastFrame.image);
    stopCamera();
    await handleVerifyFace(capturedFramesRef.current);
  };


  // Register / Enroll Face ID
  const handleEnrollFace = async () => {
    const photo = capturedImage || capturePhoto();
    if (!photo || !user) return;

    try {
      setEnrolling(true);
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        faceIdPhoto: photo,
        faceIdEnrolled: true,
        faceIdEnabled: true,
        updatedAt: new Date()
      }, { merge: true });

      // Write enrollment audit log
      try {
        await addDoc(collection(db, 'biometric_audit'), {
          userId: user.uid,
          userEmail: user.email || 'noma\'lum',
          userName: profile?.displayName || user.displayName || 'Foydalanuvchi',
          action: 'enrollment',
          status: 'success',
          details: 'Yangi yuz biometrik ma\'lumotlari muvaffaqiyatli ro\'yxatdan o\'tkazildi',
          timestamp: serverTimestamp()
        });
      } catch (logErr) {
        console.error("Error writing biometric audit log:", logErr);
      }

      setProfile((prev: any) => ({
        ...prev,
        faceIdPhoto: photo,
        faceIdEnrolled: true,
        faceIdEnabled: true
      }));

      // Successfully enrolled, let user in
      onVerified();
    } catch (err: any) {
      console.error("Error saving Face ID:", err);
      setCameraError("Face ID ma'lumotlarini saqlashda xatolik yuz berdi: " + err.message);
    } finally {
      setEnrolling(false);
    }
  };

  // Verify captured liveness frames against the enrolled face.
  // ZERO-TRUST RULE: any network error, timeout, non-200 response or ambiguous
  // result is treated as NOT VERIFIED. There must never be a code path here that
  // grants access on failure — the backend is the single source of truth.
  const handleVerifyFace = async (frames: { type: string; image: string }[]) => {
    if (!frames || frames.length < 2 || !enrolledPhoto) {
      setVerificationResult({ success: false, message: "Tekshiruv uchun yetarli ma'lumot yo'q." });
      setLivenessStage('idle');
      return;
    }

    let result: any = null;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    try {
      setVerifying(true);
      setVerificationResult(null);

      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 45000); // give the server's 60s function budget room to actually respond

      const response = await fetch('/api/verify-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrolledImage: enrolledPhoto,
          frames
        }),
        signal: controller.signal
      });
      // Always read the body — even on non-200 the backend returns a structured
      // fail-closed JSON payload ({verified:false, reason}) that we want to show.
      result = await response.json().catch(() => null);
      if (!response.ok && result) {
        result.verified = false;
        result.isMatch = false;
      }

      clearTimeout(timeoutId);
      if (!result) {
        throw new Error("Server javobini o'qib bo'lmadi.");
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error("Face verification request failed:", err?.message || err);
      const timedOut = err?.name === 'AbortError';
      setVerificationResult({
        success: false,
        message: timedOut
          ? "Ulanish vaqti tugadi. Iltimos, internet aloqangizni tekshirib qayta urinib ko'ring."
          : "Tizim ulanishida muammo yuz berdi. Xavfsizlik nuqtai nazaridan kirish rad etildi. Qayta urinib ko'ring."
      });
      setVerifying(false);
      setLivenessStage('idle');

      try {
        await addDoc(collection(db, 'biometric_audit'), {
          userId: user.uid,
          userEmail: user.email || 'noma\'lum',
          userName: profile?.displayName || user.displayName || 'Foydalanuvchi',
          action: 'verification',
          status: 'error',
          details: err?.message || 'Tarmoq xatoligi',
          timestamp: serverTimestamp()
        });
      } catch (logErr) {
        console.error("Error writing error audit log:", logErr);
      }
      return;
    }

    // The backend already enforces match + liveness + confidence threshold and
    // returns `verified`. We trust ONLY that field — never re-derive a looser pass.
    const isMatch = result.verified === true;
    const confidence = typeof result.confidence === 'number' ? result.confidence : 0;

    try {
      if (isMatch) {
        setVerificationResult({
          success: true,
          isMatch: true,
          confidence: confidence,
          reason: result.reason || 'Yuz muvaffaqiyatli solishtirildi'
        });

        // Audit Log Success
        try {
          await addDoc(collection(db, 'biometric_audit'), {
            userId: user.uid,
            userEmail: user.email || 'noma\'lum',
            userName: profile?.displayName || user.displayName || 'Foydalanuvchi',
            action: 'verification',
            status: 'success',
            confidence: confidence,
            details: result.reason || 'Yuz muvaffaqiyatli solishtirildi',
            timestamp: serverTimestamp()
          });
        } catch (logErr) {
          console.error("Error writing success audit log:", logErr);
        }
        
        // Let user enter after 0.8 seconds delay to enjoy the premium biometric verification screen
        setTimeout(() => {
          onVerified();
        }, 800);
      } else {
        setVerificationResult({
          success: false,
          isMatch: false,
          confidence: confidence,
          reason: result.reason || "Yuz mos kelmadi. Iltimos, xonani yaxshilab yoriting yoki kameraga to'g'ri qarang."
        });

        // Audit Log Failure
        try {
          await addDoc(collection(db, 'biometric_audit'), {
            userId: user.uid,
            userEmail: user.email || 'noma\'lum',
            userName: profile?.displayName || user.displayName || 'Foydalanuvchi',
            action: 'verification',
            status: 'failure',
            confidence: result.confidence || 0,
            details: result.reason || 'Solishtirish mos kelmadi',
            timestamp: serverTimestamp()
          });
        } catch (logErr) {
          console.error("Error writing failure audit log:", logErr);
        }
      }
    } catch (auditErr: any) {
      // Logging failures must never affect the verified/not-verified decision above —
      // this catch exists only to stop a Firestore hiccup from crashing the UI.
      console.error("Post-verification bookkeeping error:", auditErr);
    } finally {
      setVerifying(false);
      setLivenessStage('idle');
    }
  };



  // Sign out / Logout if user is stuck or on shared machine
  const handleLogout = async () => {
    try {
      stopCamera();
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
          {isEnrolled ? "Face ID orqali kirish" : "Face ID ro'yxatga olish"}
        </h2>
        <p className="text-slate-400 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
          {isEnrolled 
            ? "Hisobingiz xavfsizligini ta'minlash va boshqalar bilan ulashishni oldini olish uchun yuzingizni tasdiqlang."
            : "Hisobingiz xavfsizligini ta'minlash, uni boshqalarga berishni oldini olish va tizimdan to'g'ri foydalanish uchun yuzingizni ro'yxatdan o'tkazing."
          }
        </p>

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
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-cyan-500/95 text-slate-950 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full animate-pulse shadow-lg z-10 border border-cyan-300">
              {isEnrolled ? "Tekshirishga tayyorlanmoqda..." : "Skanerlashga tayyor"}
            </div>
          )}

          {/* Passive liveness overlay: no instructions are shown — the person just looks
              at the camera as normal while a short burst of frames is captured silently
              in the background for the backend to analyze. */}
          {livenessStage === 'capturing' && (
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 z-20">
              <div className="w-10 h-10 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mb-3" />
              <span className="text-[10px] font-black uppercase tracking-widest text-cyan-300 bg-slate-950/80 px-3 py-1 rounded-full border border-cyan-500/40">
                Tekshirilmoqda...
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
              {/* Spinning futuristic outer ring */}
              <div className="absolute w-48 h-48 rounded-full border border-dashed border-cyan-500/30 animate-[spin_12s_linear_infinite]" />
              {/* Counter-spinning dotted inner ring */}
              <div className="absolute w-40 h-40 rounded-full border-2 border-dotted border-cyan-400/40 animate-[spin_6s_linear_infinite_reverse]" />
              {/* Radial sonar pulse wave */}
              <div className="absolute inset-4 rounded-full border border-cyan-500/20 animate-ping opacity-75" />
              
              {/* Horizontal laser beam sweeping top to bottom */}
              <div className="absolute left-0 right-0 h-[4px] bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-[bounce_2s_infinite] pointer-events-none" />
              
              {/* Tracking crosshairs / corners */}
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
              {/* Spinning futuristic outer ring */}
              <div className="absolute w-48 h-48 rounded-full border border-dashed border-indigo-500/30 animate-[spin_12s_linear_infinite]" />
              {/* Counter-spinning dotted inner ring */}
              <div className="absolute w-40 h-40 rounded-full border-2 border-dotted border-indigo-400/40 animate-[spin_6s_linear_infinite_reverse]" />
              {/* Radial sonar pulse wave */}
              <div className="absolute inset-4 rounded-full border border-indigo-500/20 animate-ping opacity-75" />
              
              {/* Horizontal laser beam sweeping top to bottom */}
              <div className="absolute left-0 right-0 h-[4px] bg-indigo-400 shadow-[0_0_15px_#818cf8] animate-[bounce_2s_infinite] pointer-events-none" />
              
              {/* Tracking crosshairs / corners */}
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
                  <span className="text-[9px] opacity-75 mt-1">Moslik: {(verificationResult.confidence! * 100).toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-12 h-12 text-rose-400 animate-bounce" />
                  <span className="text-[11px] font-bold uppercase tracking-widest mt-2">Tasdiqlanmadi</span>
                  <span className="text-[9px] text-center max-w-[220px] opacity-80 mt-1 font-sans">
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

        {/* Error message */}
        {cameraError && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs flex items-center gap-2 text-left">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{cameraError}</span>
          </div>
        )}

        {/* Reason feedback from Gemini if available */}
        {verificationResult && !verificationResult.success && (
          <div className="p-3 mb-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 text-left">
            <p className="font-bold text-slate-300 mb-1 flex items-center gap-1.5 text-rose-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              Tafsilotlar:
            </p>
            <p className="text-[11px] leading-relaxed">{verificationResult.reason || verificationResult.message}</p>
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
                    await runLivenessSequence();
                  } else {
                    const photo = capturePhoto();
                    if (!photo) {
                      setCameraError("Kameradan tasvir olinmadi. Iltimos, kameraga qarang va biroz kuting.");
                    }
                  }
                }}
                className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-500 active:scale-98 transition text-white font-bold text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 cursor-pointer"
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
                    Ro'yxatdan o'tish
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
