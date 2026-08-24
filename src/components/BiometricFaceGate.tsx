import { useState, useEffect, useRef } from 'react';
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
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

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scanIntervalRef = useRef<any>(null);

  // Load user profile from Firestore
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

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280, min: 640 }, height: { ideal: 720, min: 480 }, frameRate: { ideal: 30, min: 15 } }
      });

      setCameraStream(stream);
      setCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().then(() => {
          setVideoPlayable(true);
        }).catch(err => console.warn("play in startCamera failed:", err));
      }
    } catch (err: any) {
      console.warn("Webcam access error:", err?.message || err);
      setCameraError("Kameraga ulanishda xatolik yuz berdi. Iltimos, kamera ruxsatini yoqing va qayta urinib ko'ring.");
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

  useEffect(() => {
    if (videoRef.current && cameraStream) {
      if (videoRef.current.srcObject !== cameraStream) {
        videoRef.current.srcObject = cameraStream;
      }
      videoRef.current.play().then(() => {
        setVideoPlayable(true);
      }).catch(err => console.warn("Failed to play video:", err));
    }
  }, [cameraStream, cameraActive]);

  const handleResetVerification = () => {
    setCapturedImage(null);
    setVerificationResult(null);
    setCameraError(null);
    setVideoPlayable(false);
    startCamera();
  };

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

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      clearInterval(scanIntervalRef.current);
    };
  }, [cameraStream]);

  useEffect(() => {
    if (!loadingProfile) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [loadingProfile]);

  // Scanline animation
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

  // Auto-verify when camera is ready
  useEffect(() => {
    let timer: any = null;
    if (isEnrolled && enrolledPhoto && cameraActive && videoPlayable && !capturedImage && !verifying && !verificationResult) {
      timer = setTimeout(() => {
        handleVerifyFace();
      }, 1200);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isEnrolled, enrolledPhoto, cameraActive, videoPlayable, capturedImage, verifying, verificationResult]);

  // Capture frame
  const captureFrameOnly = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const video = videoRef.current;
    if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) return null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const targetWidth = 640;
    const aspectRatio = video.videoWidth / video.videoHeight;
    const targetHeight = Math.round(targetWidth / aspectRatio);
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
    return canvas.toDataURL('image/jpeg', 0.85);
  };

  // Enroll Face
  const handleEnrollFace = async () => {
    const photo = capturedImage || captureFrameOnly();
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

      try {
        await addDoc(collection(db, 'biometric_audit'), {
          userId: user.uid,
          userEmail: user.email || 'noma\'lum',
          userName: profile?.displayName || user.displayName || 'Foydalanuvchi',
          action: 'enrollment',
          status: 'success',
          details: 'Yangi yuz biometrik ma\'lumotlari ro\'yxatdan o\'tkazildi',
          timestamp: serverTimestamp()
        });
      } catch (logErr) {
        console.error("Audit log error:", logErr);
      }

      setProfile((prev: any) => ({
        ...prev,
        faceIdPhoto: photo,
        faceIdEnrolled: true,
        faceIdEnabled: true
      }));

      onVerified();
    } catch (err: any) {
      console.error("Error saving Face ID:", err);
      setCameraError("Face ID saqlashda xatolik: " + err.message);
    } finally {
      setEnrolling(false);
    }
  };

  // Verify Face (OneID Mode)
  const handleVerifyFace = async () => {
    const photo = captureFrameOnly();
    if (!photo || !enrolledPhoto) {
      setVerificationResult({
        success: false,
        message: "Kameradan tasvir olinmadi. Iltimos, kameraga to'g'ri qarang."
      });
      return;
    }

    setCapturedImage(photo);
    stopCamera();
    setVerifying(true);
    setVerificationResult(null);

    try {
      const response = await fetch('/api/verify-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrolledImage: enrolledPhoto,
          currentImage: photo
        })
      });

      const result = await response.json().catch(() => null);

      if (!result) {
        throw new Error("Server javobini o'qib bo'lmadi.");
      }

      const isMatch = result.verified === true && (result.confidence ?? 0) >= 0.85;

      if (isMatch) {
        setVerificationResult({
          success: true,
          isMatch: true,
          confidence: result.confidence,
          reason: result.reason || 'Yuz muvaffaqiyatli tasdiqlandi'
        });

        try {
          await addDoc(collection(db, 'biometric_audit'), {
            userId: user.uid,
            userEmail: user.email || 'noma\'lum',
            userName: profile?.displayName || user.displayName || 'Foydalanuvchi',
            action: 'verification',
            status: 'success',
            confidence: result.confidence,
            details: result.reason || 'Yuz muvaffaqiyatli solishtirildi',
            timestamp: serverTimestamp()
          });
        } catch (logErr) {
          console.error("Audit error:", logErr);
        }

        setTimeout(() => {
          onVerified();
        }, 800);
      } else {
        setVerificationResult({
          success: false,
          isMatch: false,
          confidence: result.confidence || 0,
          reason: result.reason || "Yuz mos kelmadi yoki haqiqiy inson aniqlanmadi."
        });

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
          console.error("Audit error:", logErr);
        }
      }
    } catch (err: any) {
      console.error("Face verification failed:", err);
      setVerificationResult({
        success: false,
        message: "Tizim ulanishida muammo yuz berdi. Xavfsizlik nuqtai nazaridan kirish rad etildi. Qayta urinib ko'ring."
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleLogout = async () => {
    try {
      stopCamera();
      await signOut(auth);
      sessionStorage.removeItem('adminToken');
      sessionStorage.removeItem('virtualGuestUser');
      window.location.reload();
    } catch (err) {
      console.error("Logout error:", err);
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
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden text-center">
        <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-4 animate-pulse">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">
          {isEnrolled ? "Face ID orqali kirish" : "Face ID ro'yxatga olish"}
        </h2>
        <p className="text-slate-400 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
          {isEnrolled 
            ? "Hisobingiz xavfsizligini ta'minlash va boshqalar bilan ulashishni oldini olish uchun yuzingizni tasdiqlang."
            : "Hisobingiz xavfsizligini ta'minlash uchun yuzingizni ro'yxatdan o'tkazing."
          }
        </p>

        {/* Camera Area */}
        <div className="mt-6 mb-6 relative mx-auto w-64 h-64 rounded-full border-4 border-slate-800 overflow-hidden bg-slate-950 flex items-center justify-center group shadow-inner">
          {cameraActive && !capturedImage && (
            <div className="absolute inset-0 rounded-full border border-cyan-500/30 scale-105 animate-ping duration-1000" />
          )}

          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400 opacity-60 rounded-tl-md" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-400 opacity-60 rounded-tr-md" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-400 opacity-60 rounded-bl-md" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-400 opacity-60 rounded-br-md" />

          {cameraActive && !capturedImage ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
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
              <Camera className="w-12 h-12 mb-2 text-slate-600" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Kamera o'chirilgan</span>
            </div>
          )}

          {cameraActive && !capturedImage && (
            <div 
              className="absolute left-0 right-0 h-1 bg-cyan-500/75 shadow-[0_0_15px_#22d3ee] pointer-events-none transition-all ease-linear"
              style={{ top: `${scanProgress}%` }}
            />
          )}

          {cameraActive && videoPlayable && !capturedImage && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-cyan-500/95 text-slate-950 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full animate-pulse shadow-lg z-10 border border-cyan-300">
              {isEnrolled ? "Yuz skanerlanmoqda..." : "Skanerlashga tayyor"}
            </div>
          )}

          {/* Loader */}
          {verifying && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
              <div className="p-3 bg-cyan-950/80 rounded-2xl border border-cyan-500/30 shadow-inner mb-3">
                <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-cyan-400 animate-pulse">SOLISHTIRILMOQDA...</span>
            </div>
          )}

          {enrolling && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4">
              <div className="p-3 bg-indigo-950/80 rounded-2xl border border-indigo-500/30 shadow-inner mb-3">
                <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-indigo-400 animate-pulse">RO'YXATGA OLINMOQDA...</span>
            </div>
          )}

          {/* Result */}
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
                  <span className="text-[9px] text-center max-w-[220px] opacity-80 mt-1">
                    {verificationResult.message || verificationResult.reason || "Yuz mos kelmadi."}
                  </span>
                  
                  <div className="mt-3 flex flex-col gap-1.5 w-full max-w-[220px]">
                    <button
                      onClick={handleResetVerification}
                      className="w-full px-3 py-2 bg-rose-600 hover:bg-rose-500 active:scale-95 transition text-white font-bold text-[10px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-rose-600/30"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Qayta urinish
                    </button>
                    <button
                      onClick={handleReEnroll}
                      className="w-full px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:scale-95 transition text-slate-200 font-semibold text-[9px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-1 cursor-pointer border border-slate-700"
                    >
                      <Camera className="w-3 h-3 text-cyan-400" />
                      Qayta suratga olish
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {cameraError && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs flex items-center gap-2 text-left">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{cameraError}</span>
          </div>
        )}

        {/* Buttons */}
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

          {cameraActive && !capturedImage && (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  if (isEnrolled) {
                    handleVerifyFace();
                  } else {
                    const photo = captureFrameOnly();
                    if (photo) setCapturedImage(photo);
                  }
                }}
                className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-500 active:scale-98 transition text-white font-bold text-xs uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                {isEnrolled ? "Skanerlash" : "Suratga olish"}
              </button>

              {isEnrolled && (
                <button
                  onClick={handleReEnroll}
                  className="w-full py-2 text-slate-400 hover:text-slate-200 text-[11px] font-semibold flex items-center justify-center gap-1.5 border border-slate-800 rounded-xl hover:bg-slate-800/40 transition"
                >
                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                  Yangi surat bilan ro'yxatdan o'tish
                </button>
              )}
            </div>
          )}

          {capturedImage && !verifying && !enrolling && !isEnrolled && (
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
          )}

          <button
            onClick={handleLogout}
            className="w-full mt-4 py-2 text-slate-500 hover:text-slate-300 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-1.5 border border-slate-800/50 rounded-2xl hover:bg-slate-900/50 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            Tizimdan chiqish (Logout)
          </button>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
