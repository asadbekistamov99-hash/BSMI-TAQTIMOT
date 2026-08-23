import { useEffect, useState, useRef } from 'react';
import { dbService } from '../lib/dbService';
import { AtlasEntry, Topic, Semester } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Info, Microscope, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, X, Maximize2, Box, Image as ImageIcon, ArrowLeft, Lock, Sparkles, Clock, AlertTriangle, Star, Volume2, Move, Compass, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useSettings, normalizeTelegram } from '../hooks/useSettings';
import PaymentModal from '../components/PaymentModal';
import '@google/model-viewer';
import Anatomy3DSuite from '../components/Anatomy3DSuite';
import { ANATOMY_MODELS, SEED_MODELS, type AnatomyModel } from '../data/anatomyModels';

const ModelViewer = 'model-viewer' as any;

// 3D modellar katalogini Atlas yozuvi ko'rinishiga o'tkazish (bir bo'limda birlashtirish uchun)
function catalogToAtlasEntries(): any[] {
  let custom: AnatomyModel[] = [];
  try {
    const raw = localStorage.getItem('anatomy_models_custom_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) custom = parsed;
    }
  } catch {}
  const map = new Map<string, AnatomyModel>();
  [...ANATOMY_MODELS, ...SEED_MODELS, ...custom].forEach((m) => {
    if (m && m.id) map.set(m.id, m);
  });
  return Array.from(map.values()).map((m) => ({
    id: 'cat-' + m.id,
    latinName: m.title?.en || m.title?.uz || '',
    uzbekName: m.title?.uz || '',
    russianName: m.title?.ru || '',
    englishName: m.title?.en || '',
    name: m.title?.uz || '',
    description: m.description || '',
    image: m.thumbnail || '',
    modelUrl: m.fileUrl || '',
    embedUrl: m.embedUrl || '',
    system: m.system,
    pins: m.pins || [],
    __catalog: true,
  }));
}

function AnimatedModelViewer({ src, alt, fallbackImage }: { src: string, alt: string, fallbackImage?: string }) {
  const [progress, setProgress] = useState(0);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const [isDirectLoad, setIsDirectLoad] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [details, setDetails] = useState({ loaded: 0, total: 0 });
  const [loadStartTime] = useState(Date.now());
  const { language, t } = useLanguage();
  const modelRef = useRef<any>(null);

  // Check WebGL compatibility on mount
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const supportsWebGL = !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      if (!supportsWebGL) {
        setError("Qurilmangiz yoki brauzeringiz WebGL (3D grafika) tizimini qo'llab-quvvatlamaydi. Iltimos, boshqa brauzer yoki yangiroq qurilmadan foydalaning.");
      }
    } catch (e) {
      setError("WebGL-ni aniqlashda muammo yuzaga keldi. Qurilmangiz 3D grafikani qo'llab-quvvatlamasligi mumkin.");
    }
  }, []);

  // Inspection controls state
  const [isWireframe, setIsWireframe] = useState(false);
  const [envImage, setEnvImage] = useState('neutral');
  const [exposure, setExposure] = useState(1.6);
  const [shadowIntensity, setShadowIntensity] = useState(1.0);

  // Camera control states & helper functions
  const [cameraOrbit, setCameraOrbit] = useState('0deg 75deg 105%');
  const [cameraTarget, setCameraTarget] = useState('0m 0m 0m');
  const [fov, setFov] = useState(45);
  const [isAutoRotateActive, setIsAutoRotateActive] = useState(false);
  const [modelScale, setModelScale] = useState<string>("1 1 1");

  const getTargetCoords = (el: any) => {
    const targetStr = el.cameraTarget || '0m 0m 0m';
    const parts = targetStr.trim().split(/\s+/);
    if (parts.length === 3) {
      const x = parseFloat(parts[0]) || 0;
      const y = parseFloat(parts[1]) || 0;
      const z = parseFloat(parts[2]) || 0;
      return { x, y, z };
    }
    return { x: 0, y: 0, z: 0 };
  };

  const reframeModel = (overrideScaleMultiplier?: number) => {
    const el = modelRef.current;
    if (!el) return;

    try {
      const center = el.getBoundingBoxCenter();
      const dimensions = el.getDimensions();
      if (center && dimensions) {
        let scaleMultiplier = 1;
        if (overrideScaleMultiplier !== undefined) {
          scaleMultiplier = overrideScaleMultiplier;
        } else {
          scaleMultiplier = modelScale === "1000 1000 1000" ? 1000 : 1;
        }

        const targetString = `${(center.x * scaleMultiplier).toFixed(5)}m ${(center.y * scaleMultiplier).toFixed(5)}m ${(center.z * scaleMultiplier).toFixed(5)}m`;
        setCameraTarget(targetString);
        el.cameraTarget = targetString;

        const maxDim = Math.max(dimensions.x, dimensions.y, dimensions.z) * scaleMultiplier;
        const optimalRadius = Math.max(maxDim * 1.5, 0.05);

        let thetaDeg = "0deg";
        let phiDeg = "75deg";

        if (typeof el.getCameraOrbit === 'function') {
          const currentOrbit = el.getCameraOrbit();
          if (currentOrbit) {
            thetaDeg = `${(currentOrbit.theta * 180 / Math.PI).toFixed(1)}deg`;
            phiDeg = `${(currentOrbit.phi * 180 / Math.PI).toFixed(1)}deg`;
          }
        }

        const orbitString = `${thetaDeg} ${phiDeg} ${optimalRadius.toFixed(4)}m`;
        setCameraOrbit(orbitString);
        el.cameraOrbit = orbitString;

        setFov(45);
        el.fieldOfView = "45deg";
        console.log("[ATLAS-REFRAME] Model centered with scale multiplier:", scaleMultiplier, { targetString, orbitString });
      } else {
        el.cameraTarget = "0m 0m 0m";
        el.cameraOrbit = "0deg 75deg 105%";
        setCameraTarget("0m 0m 0m");
        setCameraOrbit("0deg 75deg 105%");
        setFov(45);
        el.fieldOfView = "45deg";
      }
    } catch (err) {
      console.warn("[ATLAS-REFRAME] Direct framing failed, fallback to defaults:", err);
      el.cameraTarget = "0m 0m 0m";
      el.cameraOrbit = "0deg 75deg 105%";
      setCameraTarget("0m 0m 0m");
      setCameraOrbit("0deg 75deg 105%");
      setFov(45);
      el.fieldOfView = "45deg";
    }
  };

  const resetView = () => {
    const el = modelRef.current;
    if (!el) return;
    try {
      el.cameraTarget = "0m 0m 0m";
      el.cameraOrbit = "0deg 75deg 105%";
      setCameraTarget("0m 0m 0m");
      setCameraOrbit("0deg 75deg 105%");
      setFov(45);
      el.fieldOfView = "45deg";
      console.log("[RESET-VIEW-ATLAS] Camera successfully reset to initial defaults.");
    } catch (err) {
      console.warn("Reset view failed:", err);
    }
  };

  const handleOrbitRotate = (direction: 'left' | 'right' | 'up' | 'down') => {
    const el = modelRef.current;
    if (!el) return;
    try {
      const orbit = el.getCameraOrbit();
      if (orbit) {
        let { theta, phi, radius } = orbit;
        const stepTheta = 15 * (Math.PI / 180);
        const stepPhi = 10 * (Math.PI / 180);
        
        if (direction === 'left') theta -= stepTheta;
        if (direction === 'right') theta += stepTheta;
        if (direction === 'up') phi = Math.max(0.1, phi - stepPhi);
        if (direction === 'down') phi = Math.min(Math.PI - 0.1, phi + stepPhi);

        const orbitString = `${theta}rad ${phi}rad ${radius}m`;
        setCameraOrbit(orbitString);
        el.cameraOrbit = orbitString;
      }
    } catch (err) {
      console.warn("Rotate failed", err);
    }
  };

  const handleOrbitPan = (direction: 'left' | 'right' | 'up' | 'down') => {
    const el = modelRef.current;
    if (!el) return;
    try {
      const coords = getTargetCoords(el);
      const orbit = el.getCameraOrbit();
      const radius = orbit ? orbit.radius : 1.0;
      const panStep = Math.max(radius * 0.1, 0.02);
      
      if (direction === 'left') coords.x -= panStep;
      if (direction === 'right') coords.x += panStep;
      if (direction === 'up') coords.y += panStep;
      if (direction === 'down') coords.y -= panStep;

      const targetString = `${coords.x.toFixed(4)}m ${coords.y.toFixed(4)}m ${coords.z.toFixed(4)}m`;
      setCameraTarget(targetString);
      el.cameraTarget = targetString;
    } catch (err) {
      console.warn("Pan failed", err);
    }
  };

  const handleOrbitZoom = (zoomType: 'in' | 'out') => {
    const el = modelRef.current;
    if (!el) return;
    try {
      const orbit = el.getCameraOrbit();
      if (orbit) {
        let { theta, phi, radius } = orbit;
        const zoomStep = 0.85;
        if (zoomType === 'in') radius = Math.max(0.15, radius * zoomStep);
        if (zoomType === 'out') radius = Math.min(10.0, radius / zoomStep);

        const orbitString = `${theta}rad ${phi}rad ${radius}m`;
        setCameraOrbit(orbitString);
        el.cameraOrbit = orbitString;
      }
    } catch (err) {
      console.warn("Zoom failed", err);
    }
  };

  // Automatically reframe on target model load to perfect standard scale/crop ratio
  useEffect(() => {
    if (isModelReady) {
      const timer = setTimeout(() => {
        reframeModel();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isModelReady, blobUrl]);

  // Function to search and traverse Three.js materials to toggle wireframes
  const applyWireframe = (wireframeVal: boolean) => {
    const modelViewer = modelRef.current;
    if (!modelViewer) return;

    let scene: any = null;
    const symbols = Object.getOwnPropertySymbols(modelViewer);
    for (const s of symbols) {
      const obj = modelViewer[s];
      if (obj) {
        if (obj.type === 'Scene' || obj.isScene) {
          scene = obj;
          break;
        }
        if (obj.currentGLTF?.scene) {
          scene = obj.currentGLTF.scene;
          break;
        }
      }
    }

    if (!scene) {
      for (const s of symbols) {
        const obj = modelViewer[s];
        if (obj && typeof obj === 'object') {
          try {
            const keys = Object.keys(obj);
            for (const k of keys) {
              const val = obj[k];
              if (val && (val.type === 'Scene' || val.isScene)) {
                scene = val;
                break;
              }
            }
          } catch (_) {}
          if (scene) break;

          try {
            const subSymbols = Object.getOwnPropertySymbols(obj);
            for (const ss of subSymbols) {
              const val = obj[ss];
              if (val && (val.type === 'Scene' || val.isScene)) {
                scene = val;
                break;
              }
            }
          } catch (_) {}
          if (scene) break;
        }
      }
    }

    if (!scene) {
      try {
        for (const key of Object.keys(modelViewer)) {
          const val = modelViewer[key];
          if (val && (val.type === 'Scene' || val.isScene)) {
            scene = val;
            break;
          }
        }
      } catch (_) {}
    }

    if (scene) {
      console.log("[ATLAS-WIREFRAME] Found Three.js Scene, applying wireframe setting:", wireframeVal);
      scene.traverse((child: any) => {
        if (child.isMesh && child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((mat: any) => {
            if (mat) {
              mat.wireframe = wireframeVal;
              mat.needsUpdate = true;
            }
          });
        }
      });
    } else {
      console.warn("[ATLAS-WIREFRAME] Could not find Three.js scene to apply wireframe mode.");
    }
  };

  // Re-apply wireframe mode on load state changes or wireframe state shifts
  useEffect(() => {
    if (isModelReady && modelRef.current) {
      // Small timeout to give model-viewer a frame to assemble materials
      const timer = setTimeout(() => {
        applyWireframe(isWireframe);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isWireframe, isModelReady, blobUrl]);

  useEffect(() => {
    if (!src) return;
    
    // Reset all states on new source
    setBlobUrl(null);
    setProgress(0);
    setError(null);
    setFallbackNotice(null);
    setIsDirectLoad(false);
    setIsModelReady(false);
    setModelScale("1 1 1");
    setDetails({ loaded: 0, total: 0 });

    const loadModel = async () => {
      console.log(`[ATLAS] Loading model via fetch: ${src}`);
      let finalUrl = src;
      const isCorsFriendly = src.includes('modelviewer.dev') || src.includes('githubusercontent.com') || src.includes('threejs.org');
      if (src && src.startsWith('http') && !src.includes(window.location.host) && !isCorsFriendly) {
        finalUrl = `/api/proxy?url=${encodeURIComponent(src)}`;
      }
      
      setProgress(15);
      try {
        const res = await fetch(finalUrl);
        if (!res.ok) {
          const resText = await res.text();
          let errText = `3D modelni yuklab bo'lmadi (Status: ${res.status})`;
          try {
            const errJson = JSON.parse(resText);
            if (errJson.error) {
              errText = errJson.error;
            }
          } catch (e) {}
          throw new Error(errText);
        }
        
        setProgress(60);
        const isFallback = res.headers.get('X-Proxy-Fallback') === 'true';
        if (isFallback) {
          try {
            const origErr = decodeURIComponent(res.headers.get('X-Proxy-Original-Error') || '');
            setFallbackNotice(origErr || "Asl 3D model topilmadi.");
          } catch (e) {
            setFallbackNotice("Asl 3D model topilmadi.");
          }
        }
        
        const blob = await res.blob();
        setProgress(95);
        const localBlobUrl = URL.createObjectURL(blob);
        
        setBlobUrl(localBlobUrl);
        setIsDirectLoad(false); // So it gets revoked nicely on cleanup
        setProgress(100);
      } catch (err: any) {
        console.error("[ATLAS-LOAD-ERROR]", err);
        setError(err.message || "Modelni yuklashda xatolik yuz berdi.");
        setProgress(0);
      }
    };

    loadModel();
    return () => {};
  }, [src, retry]);

  // Alomat/Blob url tozash uchun alohida cleanup effekti
  useEffect(() => {
    return () => {
      if (blobUrl && !isDirectLoad) {
        try {
          const cleanBlobUrl = blobUrl.split('#')[0];
          URL.revokeObjectURL(cleanBlobUrl);
        } catch (e) {}
      }
    };
  }, [blobUrl, isDirectLoad]);

  // Wire up custom element event listeners
  useEffect(() => {
    const el = modelRef.current;
    if (!el) return;

    const handleLoad = () => {
      console.log("[ATLAS-VIEWER] Model loaded successfully to screen");
      let scaleMult = 1;
      const dimensions = el.getDimensions();
      if (dimensions) {
        const maxDim = Math.max(dimensions.x, dimensions.y, dimensions.z);
        if (maxDim > 0 && maxDim < 0.05) {
          scaleMult = 1000;
          setModelScale("1000 1000 1000");
          console.log("[SCALE-DETECTOR] Tiny model detected, scaling up 1000x in Atlas:", maxDim);
        } else {
          setModelScale("1 1 1");
        }
      }
      setIsModelReady(true);
      setProgress(100);
      reframeModel(scaleMult);
    };

    const handleError = (err: any) => {
      console.error("[ATLAS-VIEWER] Model rendering failed:", err);
      setError(
        "3D modelni yuklashda muammo yuzaga keldi. Qurilmangiz WebGL-ni qo'llab-quvvatlashini, tarmoq ulanishi barqarorligini va fayl formati (GLB) to'g'riligini tekshiring."
      );
    };

    const handleProgress = (event: any) => {
      if (isDirectLoad && event.detail) {
        const p = Math.round(event.detail.totalProgress * 100);
        setProgress(isNaN(p) ? 0 : p);
      }
    };

    el.addEventListener('load', handleLoad);
    el.addEventListener('error', handleError);
    el.addEventListener('progress', handleProgress);

    // Robust periodic state inspector to protect against lost event triggers
    const inspectorInterval = setInterval(() => {
      if (el.loaded || el.complete) {
        console.log("[ATLAS-VIEWER] Inspector detected model has loaded successfully.");
        let scaleMult = 1;
        const dimensions = el.getDimensions();
        if (dimensions) {
          const maxDim = Math.max(dimensions.x, dimensions.y, dimensions.z);
          if (maxDim > 0 && maxDim < 0.05) {
            scaleMult = 1000;
            setModelScale("1000 1000 1000");
            console.log("[SCALE-DETECTOR] Inspector found tiny model, scaling up 1000x in Atlas:", maxDim);
          } else {
            setModelScale("1 1 1");
          }
        }
        setIsModelReady(true);
        setProgress(100);
        reframeModel(scaleMult);
        clearInterval(inspectorInterval);
      }
    }, 450);

    return () => {
      el.removeEventListener('load', handleLoad);
      el.removeEventListener('error', handleError);
      el.removeEventListener('progress', handleProgress);
      clearInterval(inspectorInterval);
    };
  }, [blobUrl, isDirectLoad]);

  if (error) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0A0A] gap-6 p-8 text-center animate-in fade-in zoom-in duration-500 overflow-y-auto">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
          <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
        </div>
        <div className="space-y-4 max-w-md w-full">
          <h3 className="text-xl font-black text-white uppercase tracking-tighter">3D Vizualizatsiya Yuklanmadi</h3>
          <p className="text-white/50 text-xs font-semibold leading-relaxed">
            {error || "Model ma'lumotlarini yuklashda kutilmagan texnik nosozlik yuz berdi."}
          </p>
          {fallbackImage && (
            <div className="mt-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
              <span className="text-[9px] font-black uppercase text-brand-accent tracking-widest block mb-2">2D Atlasi Ko'rinishi (Mavjud Alternativa)</span>
              <img 
                src={fallbackImage} 
                alt="2D Fallback Diagram" 
                className="max-h-40 object-contain mx-auto filter brightness-95 contrast-105"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
             <button 
              onClick={() => setRetry(r => r + 1)}
              className="flex-1 px-6 py-3 bg-brand-accent text-brand-primary rounded-xl text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all w-full cursor-pointer"
            >
              Qayta urinish
            </button>
            <a 
              href={src} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 px-6 py-3 border border-white/10 hover:border-white/20 text-white/60 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/5 transition-all flex items-center justify-center"
            >
              Faylni yuklab olish
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative animate-in fade-in duration-1000">
      {/* Immersive Loading Overlay */}
      {!isModelReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] overflow-hidden z-20 pointer-events-none">
           {/* Scientific scanlines and data grid */}
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
           
           <div className="absolute inset-0 flex items-center justify-center opacity-10 blur-3xl">
              <div className="w-[500px] h-[500px] border-[50px] border-brand-accent rounded-full animate-pulse"></div>
           </div>

           <div className="relative z-10 flex flex-col items-center">
              {/* Morphing Neural Loader */}
              <div className="relative w-56 h-56 mb-12 flex items-center justify-center">
                 <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle
                      cx="112" cy="112" r="100"
                      stroke="currentColor" strokeWidth="1"
                      fill="transparent" className="text-white/5"
                    />
                    <motion.circle
                      cx="112" cy="112" r="100"
                      stroke="currentColor" strokeWidth="3"
                      fill="transparent" strokeDasharray="628.31"
                      initial={{ strokeDashoffset: 628.31 }}
                      animate={{ strokeDashoffset: 628.31 - (628.31 * progress) / 100 }}
                      transition={{ type: 'spring', damping: 15, stiffness: 40 }}
                      className="text-brand-accent shadow-[0_0_30px_rgba(255,215,0,0.4)]"
                    />
                 </svg>
                 
                 <div className="relative flex flex-col items-center justify-center animate-in fade-in transition-all duration-1000">
                    <span className="text-6xl font-black text-white tracking-tighter">{progress}%</span>
                    <div className="flex items-center gap-2 mt-2">
                       <div className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-ping"></div>
                       <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Syncing Mesh</span>
                    </div>
                 </div>
              </div>

              <div className="text-center space-y-6">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[11px] font-black text-white/80 uppercase tracking-[0.6em] block animate-pulse">
                    {blobUrl ? "Rendering Matrix" : "Downloading Core Assets"}
                  </span>
                  <div className="h-px w-32 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                </div>
                
                <div className="flex items-center gap-6 text-white/30 font-mono text-[9px] uppercase tracking-[0.2em] border border-white/5 px-4 py-2 rounded-lg bg-white/[0.02]">
                  <div className="flex flex-col items-start min-w-[80px]">
                    <span className="text-white/10 mb-1">Extracted</span>
                    <span className="text-white/50">{(details.loaded / 1024 / 1024).toFixed(1)} MB</span>
                  </div>
                  <div className="w-px h-8 bg-white/10"></div>
                  <div className="flex flex-col items-start min-w-[80px]">
                    <span className="text-white/10 mb-1">Capacity</span>
                    <span className="text-white/50">{details.total > 0 ? (details.total / 1024 / 1024).toFixed(1) : 'AUTO'} MB</span>
                  </div>
                </div>
              </div>

              <div className="mt-20 flex flex-col items-center gap-5">
                 <p className="text-white/20 text-[10px] uppercase tracking-[0.2em] font-medium font-mono max-w-xs text-center leading-relaxed">
                    3D modellar o'lchami 10MB dan 100MB gacha bo'lishi mumkin. Iltimos, ulanish barqarorligini ta'minlang.
                 </p>
                 
                 {/* Hidden fallback trigger */}
                 {!isDirectLoad && !blobUrl && (
                   <button 
                    onClick={() => { setBlobUrl(src); setIsDirectLoad(true); }}
                    className="px-6 py-3 rounded-xl border border-white/10 text-[9px] font-black text-white/30 uppercase tracking-widest hover:bg-white/5 hover:text-white/60 transition-all pointer-events-auto"
                   >
                     Bufferni o'tkazib yuborish
                    </button>
                 )}
              </div>
           </div>

           {/* Laser Scanning Line */}
           <motion.div 
             animate={{ top: ['-10%', '110%', '-10%'] }}
             transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
             className="absolute left-0 right-0 h-40 bg-gradient-to-b from-transparent via-brand-accent/5 to-transparent z-0 opacity-50"
           />
        </div>
      )}

      {isDirectLoad && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 px-5 py-2.5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center gap-4 shadow-2xl">
          <div className="relative">
            <Loader2 className="w-4 h-4 text-brand-accent animate-spin" />
            <div className="absolute inset-0 bg-brand-accent blur-md opacity-20 animate-pulse"></div>
          </div>
          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] leading-none">
            Streaming Mode <span className="text-brand-accent/50 ml-2">Active</span>
          </span>
        </div>
      )}

      {/* Control panel for inspection settings (Wireframe & Lighting) */}
      {isModelReady && (
        <div className="absolute bottom-6 right-6 z-30 bg-black/85 backdrop-blur-xl border border-white/10 rounded-3xl p-5 w-72 pointer-events-auto shadow-2xl animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
             <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest flex items-center gap-1.5">
               <Sparkles className="w-3.5 h-3.5" /> Anatomiya Inspeksiyasi
             </span>
             <span className="text-[9px] font-mono text-white/30">3D Setup</span>
          </div>

          <div className="space-y-4">
             {/* Wireframe Toggle */}
             <div className="flex items-center justify-between">
                <div>
                   <span className="text-xs font-bold text-white block">Karkas Rejimi (Wireframe)</span>
                   <span className="text-[9px] text-white/40 mt-0.5 block">Poligon to'rini ko'rsatish</span>
                </div>
                <button
                   onClick={() => setIsWireframe(!isWireframe)}
                   className={`w-11 h-6 rounded-full p-1 transition-colors duration-300 relative ${isWireframe ? 'bg-brand-accent' : 'bg-white/10'}`}
                >
                   <div className={`w-4 h-4 rounded-full bg-brand-primary transition-transform duration-300 ${isWireframe ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
             </div>

             {/* Environmental Lighting Source presets */}
             <div className="space-y-1.5 animate-in fade-in duration-300">
                <div>
                   <span className="text-xs font-bold text-white block">Atrof-muhit Yoritilishi</span>
                   <span className="text-[9px] text-white/40 mt-0.5 block">Nurlar va fon muhiti</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                   <button
                      onClick={() => setEnvImage('neutral')}
                      className={`px-2.5 py-2 text-[9px] font-black uppercase tracking-wider rounded-xl border text-center transition-all ${envImage === 'neutral' ? 'bg-brand-accent text-brand-primary border-brand-accent shadow-md shadow-brand-accent/10' : 'bg-white/5 text-white/60 border-white/5 hover:border-white/10'}`}
                   >
                      Neytral
                   </button>
                   <button
                      onClick={() => setEnvImage('legacy')}
                      className={`px-2.5 py-2 text-[9px] font-black uppercase tracking-wider rounded-xl border text-center transition-all ${envImage === 'legacy' ? 'bg-brand-accent text-brand-primary border-brand-accent shadow-md shadow-brand-accent/10' : 'bg-white/5 text-white/60 border-white/5 hover:border-white/10'}`}
                   >
                      Retro
                   </button>
                </div>
             </div>

             {/* Exposure Slider */}
             <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                   <span className="text-xs font-bold text-white">Yorug'lik kuchi (Exposure)</span>
                   <span className="text-[9px] font-mono text-brand-accent font-black">{exposure.toFixed(1)}x</span>
                </div>
                <input 
                   type="range"
                   min="0.3"
                   max="2.5"
                   step="0.1"
                   value={exposure}
                   onChange={(e) => setExposure(parseFloat(e.target.value))}
                   className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                />
             </div>

             {/* Shadow Intensity Slider */}
             <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                   <span className="text-xs font-bold text-white flex items-center justify-between">Soya darajasi (Shadows)</span>
                   <span className="text-[9px] font-mono text-brand-accent font-black">{shadowIntensity.toFixed(1)}x</span>
                </div>
                <input 
                   type="range"
                   min="0"
                   max="4"
                   step="0.2"
                   value={shadowIntensity}
                   onChange={(e) => setShadowIntensity(parseFloat(e.target.value))}
                   className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                />
             </div>
          </div>
        </div>
      )}
      
      {/* Camera Dictionary Setup */}
      {(() => {
        const labels = {
          orbitControls: {
            uz: 'Kamera Navigatsiyasi (OrbitControls)',
            ru: 'Навигация Камеры (OrbitControls)',
            en: 'Camera Navigation (OrbitControls)'
          },
          rotate: {
            uz: 'Aylantirish',
            ru: 'Вращение',
            en: 'Rotation'
          },
          pan: {
            uz: 'Surish',
            ru: 'Сдвиг',
            en: 'Panning'
          },
          zoom: {
            uz: 'Yaqinlashtirish',
            ru: 'Масштаб',
            en: 'Zoom'
          },
          autoRotate: {
            uz: 'Avto-aylantirish',
            ru: 'Авто-вращение',
            en: 'Auto-Rotate'
          },
          reframe: {
            uz: 'Sig\'dirish',
            ru: 'Вписать',
            en: 'Fit Model'
          },
          resetView: {
            uz: 'Kamerani Tiklash',
            ru: 'Сбросить Вид',
            en: 'Reset View'
          },
          helpText: {
            uz: 'Chap tugma: Aylantirish | O\'ng tugma/Shift: Ko\'chirish | G\'ildirak: Zoom',
            ru: 'ЛКМ: Вращение | ПКМ/Shift: Перемещение | Колесико: Зум',
            en: 'Left-click: Rotate | Right-click/Shift: Pan | Scroll: Zoom'
          }
        };

        const l = (key: keyof typeof labels) => {
          return labels[key][(language as 'uz' | 'ru' | 'en') || 'uz'] || labels[key]['uz'];
        };

        return (
          <>
            {fallbackNotice && (
              <div className="absolute top-4 left-4 right-4 z-40 bg-amber-500/10 border border-amber-500/30 backdrop-blur-md rounded-xl p-3 text-white flex items-start gap-2.5 max-w-md shadow-lg animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-auto">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5 animate-pulse" />
                <div className="flex-grow space-y-0.5">
                  <span className="text-[10px] font-black uppercase text-amber-500 tracking-wider block">Zaxira model yuklandi (Fallback)</span>
                  <p className="text-[10px] text-white/70 leading-relaxed font-semibold">
                    {fallbackNotice}
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => setFallbackNotice(null)} 
                  className="text-white/40 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <ModelViewer
              ref={modelRef}
              src={blobUrl || undefined}
              alt={alt}
              scale={modelScale}
              auto-rotate={isAutoRotateActive ? "true" : "false"}
              camera-controls=""
              enable-pan=""
              bounds="auto"
              shadow-intensity={shadowIntensity.toString()}
              environment-image={envImage}
              exposure={exposure.toString()}
              camera-orbit={cameraOrbit}
              camera-target={cameraTarget}
              field-of-view={`${fov}deg`}
              interaction-prompt="auto"
              loading="eager"
              reveal="auto"
              dynamic-scaling="false"
              minimum-render-scale="1"
              tone-mapping="commerce"
              style={{ width: '100%', height: '100%', outline: 'none' }}
              ar=""
              ar-modes="webxr scene-viewer quick-look"
            >
              <div slot="poster" className="absolute inset-0 bg-black flex items-center justify-center">
                  <div className="w-12 h-12 border-2 border-white/5 border-t-brand-accent rounded-full animate-spin"></div>
              </div>
            </ModelViewer>

            {/* Floating Interactive OrbitControls Widget */}
            {isModelReady && (
              <div className="absolute bottom-4 right-4 z-40 bg-black/85 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-[260px] pointer-events-auto flex flex-col gap-3 shadow-2xl text-white">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[10px] font-black uppercase text-brand-accent tracking-widest flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                    {l('orbitControls')}
                  </span>
                </div>

                {/* Controls Matrix */}
                <div className="grid grid-cols-2 gap-3 items-center">
                  {/* Circle rotate joypad */}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[8px] font-extrabold text-white/50 uppercase tracking-wider">{l('rotate')}</span>
                    <div className="relative w-16 h-16 bg-white/5 rounded-full border border-white/10 flex items-center justify-center p-1">
                      <button 
                        type="button" 
                        onClick={() => handleOrbitRotate('up')} 
                        className="absolute top-0.5 p-0.5 bg-white/5 hover:bg-white/15 active:bg-brand-accent/20 rounded text-white border border-white/5 cursor-pointer hover:border-brand-accent/40 active:border-brand-accent transition-all animate-none"
                      >
                        <ChevronUp size={10} />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleOrbitRotate('left')} 
                        className="absolute left-0.5 p-0.5 bg-white/5 hover:bg-white/15 active:bg-brand-accent/20 rounded text-white border border-white/5 cursor-pointer hover:border-brand-accent/40 active:border-brand-accent transition-all animate-none"
                      >
                        <ChevronLeft size={10} />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleOrbitRotate('right')} 
                        className="absolute right-0.5 p-0.5 bg-white/5 hover:bg-white/15 active:bg-brand-accent/20 rounded text-white border border-white/5 cursor-pointer hover:border-brand-accent/40 active:border-brand-accent transition-all animate-none"
                      >
                        <ChevronRight size={10} />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleOrbitRotate('down')} 
                        className="absolute bottom-0.5 p-0.5 bg-white/5 hover:bg-white/15 active:bg-brand-accent/20 rounded text-white border border-white/5 cursor-pointer hover:border-brand-accent/40 active:border-brand-accent transition-all animate-none"
                      >
                        <ChevronDown size={10} />
                      </button>
                      <div className="w-3 h-3 rounded-full border border-brand-accent/20 bg-brand-accent/5 animate-pulse" />
                    </div>
                  </div>

                  {/* Circle Panning joypad */}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[8px] font-extrabold text-white/50 uppercase tracking-wider">{l('pan')}</span>
                    <div className="relative w-16 h-16 bg-white/5 rounded-full border border-white/10 flex items-center justify-center p-1">
                      <button 
                        type="button" 
                        onClick={() => handleOrbitPan('up')} 
                        className="absolute top-0.5 p-0.5 bg-white/5 hover:bg-white/15 active:bg-brand-accent/20 rounded text-white border border-white/5 cursor-pointer hover:border-brand-accent/40 active:border-brand-accent transition-all animate-none"
                      >
                        <ChevronUp size={10} />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleOrbitPan('left')} 
                        className="absolute left-0.5 p-0.5 bg-white/5 hover:bg-white/15 active:bg-brand-accent/20 rounded text-white border border-white/5 cursor-pointer hover:border-brand-accent/40 active:border-brand-accent transition-all animate-none"
                      >
                        <ChevronLeft size={10} />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleOrbitPan('right')} 
                        className="absolute right-0.5 p-0.5 bg-white/5 hover:bg-white/15 active:bg-brand-accent/20 rounded text-white border border-white/5 cursor-pointer hover:border-brand-accent/40 active:border-brand-accent transition-all animate-none"
                      >
                        <ChevronRight size={10} />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleOrbitPan('down')} 
                        className="absolute bottom-0.5 p-0.5 bg-white/5 hover:bg-white/15 active:bg-brand-accent/20 rounded text-white border border-white/5 cursor-pointer hover:border-brand-accent/40 active:border-brand-accent transition-all animate-none"
                      >
                        <ChevronDown size={10} />
                      </button>
                      <div className="w-5 h-5 rounded-full border border-brand-accent/20 flex items-center justify-center bg-brand-accent/5">
                        <Move className="w-2.5 h-2.5 text-brand-accent animate-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Zoom & Quick Reset Bar */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {/* Zoom control */}
                  <div className="bg-white/5 border border-white/5 rounded-xl p-2 flex items-center justify-around gap-2">
                    <button 
                      type="button" 
                      onClick={() => handleOrbitZoom('out')} 
                      className="p-1 px-1.5 hover:bg-white/10 active:bg-brand-accent/20 rounded text-white cursor-pointer"
                      title="Zoom out"
                    >
                      <ZoomOut size={10} />
                    </button>
                    <span className="text-[8px] font-black tracking-widest text-white/50 uppercase">{l('zoom')}</span>
                    <button 
                      type="button" 
                      onClick={() => handleOrbitZoom('in')} 
                      className="p-1 px-1.5 hover:bg-white/10 active:bg-brand-accent/20 rounded text-white cursor-pointer"
                      title="Zoom in"
                    >
                      <ZoomIn size={10} />
                    </button>
                  </div>

                  {/* Auto fit bounding-box helper */}
                  <button 
                    type="button" 
                    onClick={() => reframeModel()} 
                    className="bg-brand-accent/15 hover:bg-brand-accent/25 active:scale-95 border border-brand-accent/30 rounded-xl p-2 flex items-center justify-center gap-1.5 text-brand-accent font-black uppercase text-[8px] tracking-widest cursor-pointer transition-all animate-none"
                  >
                    <Maximize2 size={10} />
                    {l('reframe')}
                  </button>
                </div>

                {/* Reset view & Auto-Rotate Row */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Reset button */}
                  <button 
                    type="button" 
                    onClick={resetView} 
                    className="bg-white/5 hover:bg-white/10 active:scale-95 border border-white/10 rounded-xl p-2 flex items-center justify-center gap-1.5 text-white/80 font-black uppercase text-[8px] tracking-widest cursor-pointer transition-all animate-none"
                    title={l('resetView')}
                  >
                    <RotateCcw size={10} className="text-white" />
                    {l('resetView')}
                  </button>

                  {/* Auto-Rotate Switch */}
                  <div className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl p-2">
                    <span className="text-[8px] font-black uppercase tracking-widest text-white/60">{l('autoRotate')}</span>
                    <button 
                      type="button" 
                      onClick={() => setIsAutoRotateActive(!isAutoRotateActive)} 
                      className={`w-8 h-4 rounded-full p-0.5 transition-colors duration-300 relative ${isAutoRotateActive ? 'bg-brand-accent' : 'bg-white/10'}`}
                    >
                      <div className={`w-3 h-3 rounded-full bg-[#07080A] transition-transform duration-300 ${isAutoRotateActive ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>

                {/* Gesture Guide text ticker */}
                <p className="text-[7.5px] text-white/40 leading-normal text-center select-none pt-1 border-t border-white/5 uppercase tracking-wide">
                  {l('helpText')}
                </p>
              </div>
            )}
          </>
        );
      })()}
    </div>
  );
}

function Loader2({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/>
    </svg>
  );
}

export default function Atlas({ isAdmin: isAdminProp, user }: { isAdmin?: boolean, user?: any }) {
  const { language, t, getLocalized } = useLanguage();
  const { settings } = useSettings();
  const telegramBot = normalizeTelegram(settings.telegramBotUsername || '@Medai_support_bot');
  const [entries, setEntries] = useState<AtlasEntry[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchMode, setSearchMode] = useState<'all' | 'latin' | 'uzbek'>('all');
  const [only3D, setOnly3D] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<number | 'all'>('all');
  const [selectedEntry, setSelectedEntry] = useState<AtlasEntry | null>(null);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const isAdmin = isAdminProp ?? !!localStorage.getItem('adminToken');
  const [isPaid, setIsPaid] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('atlas_favorites');
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load favorites", e);
    }
  }, []);

  // Toggle favorite function
  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    let newFavs: string[] = [];
    if (favorites.includes(id)) {
      newFavs = favorites.filter(fid => fid !== id);
    } else {
      newFavs = [...favorites, id];
    }
    setFavorites(newFavs);
    try {
      localStorage.setItem('atlas_favorites', JSON.stringify(newFavs));
    } catch (e) {
      console.error(e);
    }
  };

  // Speak Latin text function
  const speakLatin = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'la';
      const voices = window.speechSynthesis.getVoices();
      const bestVoice = voices.find(v => v.lang.startsWith('it') || v.lang.startsWith('la') || v.lang.startsWith('es')) || voices.find(v => v.lang.startsWith('en'));
      if (bestVoice) {
        utterance.voice = bestVoice;
      }
      utterance.rate = 0.8;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Talaffuz o'qish tizimi ushbu brauzerda ishlamaydi.");
    }
  };

  // Reset active recall state on selected entry changes
  useEffect(() => {
    setIsRevealed(false);
  }, [selectedEntry]);

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const { signInWithPopup } = await import('firebase/auth');
      const { auth, googleProvider } = await import('../lib/firebase');
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        window.location.reload();
      }
    } catch (error: any) {
      console.error("Google login failed", error);
      const { signInWithRedirect } = await import('firebase/auth');
      if (error.code === 'auth/popup-blocked') {
        try {
          const { auth, googleProvider } = await import('../lib/firebase');
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError) {
          console.error("Redirect login failed", redirectError);
          setAuthError(error.message || "Redirect login failed");
        }
      } else if (error.code !== 'auth/popup-closed-by-user') {
        setAuthError(error.message || "Kirishda xatolik yuz berdi");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGuestLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      const { robustSignInAnonymously, auth } = await import('../lib/firebase');
      const result = await robustSignInAnonymously(auth);
      if (result && result.user) {
        window.location.reload();
      }
    } catch (error: any) {
      console.error("Guest login failed", error);
      setAuthError(error.message || "Guest login failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  useEffect(() => {
    const checkPayment = async () => {
      setIsPaid(false);
      setIsPending(false);

      if (!user) {
        return;
      }
      
      try {
        // 1. Check Profile for access list
        const profile = await dbService.getProfile(user.uid);
        if (profile) {
          const purchased = (profile.purchasedSemesters || []).map(Number);
          if (purchased.includes(99)) {
            setIsPaid(true);
            setIsPending(false);
            return;
          }
        }

        // 2. Check individual payment record
        const payment = await dbService.getPayment(user.uid, 99);
        if (payment) {
          if (payment.status === 'completed' || payment.status === 'approved') {
            setIsPaid(true);
            setIsPending(false);
          } else if (payment.status === 'pending') {
            setIsPending(true);
            setIsPaid(false);
          }
        }
      } catch (e) {
        console.error("Error checking atlas access:", e);
      }
    };

    checkPayment();
  }, [user]);

  const isUnlocked = isPaid;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Atlas
        let atlasData = await dbService.getAtlasEntries();
        
        if (atlasData.length === 0 && isAdmin) {
          await seedAtlas();
          atlasData = await dbService.getAtlasEntries();
        }
        
        const augmentedAtlas = (atlasData || []).map(entry => {
          const normLatin = (entry.latinName || '').toLowerCase().trim();
          const normUz = (entry.uzbekName || '').toLowerCase().trim();
          
          let modelUrl = entry.modelUrl;
          let needsUpdate = false;
          
          const brokenUrls = [
            'gkjohnson/three-mesh-bvh/main/example/models/skull.glb',
            'gkjohnson/three-mesh-bvh/master/example/models/skull.glb'
          ];
          const isBroken = !modelUrl || brokenUrls.some(b => modelUrl.includes(b)) || modelUrl.includes('Duck.glb') || modelUrl.includes('Lantern') || modelUrl.includes('DamagedHelmet');
          
          if (isBroken) {
            if (normLatin.includes('frontale') || normUz.includes('peshona')) {
              modelUrl = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb';
              needsUpdate = true;
            } else if (normLatin.includes('maxilla') || normUz.includes('yuqori jag') || normUz.includes('yuqori jag\'') || normUz.includes('yuqori jag`')) {
              modelUrl = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb';
              needsUpdate = true;
            } else if (normLatin.includes('mandibula') || normUz.includes('pastki jag') || normUz.includes('pastki jag\'') || normUz.includes('pastki jag`')) {
              modelUrl = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb';
              needsUpdate = true;
            } else if (normLatin.includes('scapula') || normUz.includes('kurak')) {
              modelUrl = 'https://modelviewer.dev/shared-assets/models/Astronaut.glb';
              needsUpdate = true;
            } else if (normLatin.includes('humerus') || normUz.includes('yelka')) {
              modelUrl = 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb';
              needsUpdate = true;
            } else if (normLatin.includes('radius') || normUz.includes('bilak')) {
              modelUrl = 'https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb';
              needsUpdate = true;
            } else if (normLatin.includes('femur') || normUz.includes('son')) {
              modelUrl = 'https://modelviewer.dev/shared-assets/models/Astronaut.glb';
              needsUpdate = true;
            } else {
              modelUrl = 'https://modelviewer.dev/shared-assets/models/Astronaut.glb';
              needsUpdate = true;
            }
          }
          
          if (needsUpdate && entry.id) {
            console.log(`[ATLAS-AUTO-REPAIR] Repairing modelUrl for ${entry.latinName} persistently to:`, modelUrl);
            dbService.updateAtlasEntry(entry.id, { modelUrl }).catch(e => {
              console.warn(`Failed to repair entry ${entry.id}`, e);
            });
          }
          
          return {
            ...entry,
            modelUrl: modelUrl
          };
        });
        
        // 3D modellar katalogini (organ/muskul/suyak/nerv/tomir) shu bo'limga qo'shamiz
        const catalogEntries = catalogToAtlasEntries();
        setEntries([...augmentedAtlas, ...catalogEntries]);

        // Fetch Topics
        const topicsData = await dbService.getTopics();
        setTopics(topicsData);

        // Fetch Semesters
        const semestersData = await dbService.getSemesters();
        setSemesters(semestersData);

      } catch (error) {
        console.error("Error fetching atlas data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdmin]);

  const seedAtlas = async () => {
    const initialAtlas = [
      { 
        latinName: "Os frontale", 
        uzbekName: "Peshona suyagi", 
        description: "Kallaning oldingi qismini hosil qiluvchi juft bo'lmagan suyak. U kalla gumbazining oldingi qismini va kalla asosining oldingi qismini, ko'z kosasining yuqori devorini va burun bo'shlig'ini shakllantirishda ishtirok etadi.", 
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format",
        modelUrl: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb"
      },
      { 
        latinName: "Maxilla", 
        uzbekName: "Yuqori jag' suyagi", 
        description: "Kallaning yuz qismidagi yirik va juft suyak. U burunning yon devorini, og'iz bo'shlig'i shiftini va ko'z kosasining pastki devorini hosil qilishda qatnashadi.", 
        image: "https://images.unsplash.com/photo-1579154238328-1c4b7852c002?w=800&auto=format",
        modelUrl: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb"
      },
      { 
        latinName: "Mandibula", 
        uzbekName: "Pastki jag' suyagi", 
        description: "Kallaning yuz qismidagi yagona harakatchan va juft bo'lmagan suyak. U pastki tishlarni ushlab turadi va chaynashda asosiy rolni o'ynaydi.", 
        image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&auto=format",
        modelUrl: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb"
      },
      { 
        latinName: "Scapula", 
        uzbekName: "Kurak suyagi", 
        description: "Yelka kamarining bir qismi bo'lgan yassi va uchburchak shakldagi suyak. U ko'krak qafasining orqa devorida joylashgan bo'lib, yelka bo'g'imining shakllanishida ishtirok etadi.", 
        image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=800&auto=format",
        modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb"
      },
      {
        latinName: "Humerus",
        uzbekName: "Yelka suyagi",
        description: "Qo'lning erkin qismidagi eng uzun va yo'g'on naysimon suyak. U proksimal qismida yelka kamari bilan, distal qismida tirsak va bilak suyaklari bilan bo'g'im hosil qiladi.",
        image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&auto=format",
        modelUrl: "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/LeePerrySmith/LeePerrySmith.glb"
      },
      {
        radius: "Radius",
        latinName: "Radius",
        uzbekName: "Bilak suyagi",
        description: "Bilakning tashqi tomonida joyhazlangan naysimon suyak. U tirsak bo'g'imini va bilak-panja bo'g'imini hosil qilishda qatnashadi.",
        image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&auto=format",
        modelUrl: "https://modelviewer.dev/shared-assets/models/glTF-Sample-Assets/Models/DamagedHelmet/glTF-Binary/DamagedHelmet.glb"
      },
      {
        latinName: "Femur",
        uzbekName: "Son suyagi",
        description: "Odam tanasidagi eng katta va baquvvat naysimon suyak. U proksimal uchida tos suyagi bilan chanoq-son bo'g'imini, distal uchida tizzada tizza qopqog'i va katta boldir suyagi bilan birlashadi.",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format",
        modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb"
      }
    ];
    
    for (const item of initialAtlas) {
      try {
        await dbService.addAtlasEntry({
          latinName: item.latinName,
          uzbekName: item.uzbekName,
          englishName: item.latinName,
          russianName: item.uzbekName,
          imageUrl: item.image,
          image: item.image,
          details: item.description,
          description: item.description,
          modelUrl: item.modelUrl || '',
          semester: 1
        });
      } catch (e) {
        console.warn("Atlas seeding item failed:", item.latinName, e);
      }
    }
  };

  const tLabel = (key: string) => {
    const dicts: Record<string, Record<string, string>> = {
      description_title: {
        uz: 'Morfofunksional tavsif',
        ru: 'Морфофункциональное описание',
        en: 'Morphofunctional description'
      },
      curriculum_place: {
        uz: "O'quv rejasidagi o'rni",
        ru: 'Место в учебном плане',
        en: 'Place in the curriculum'
      },
      back_to_catalog: {
        uz: 'Katalogga qaytish',
        ru: 'Назад в каталог',
        en: 'Back to catalog'
      },
      search_placeholder: {
        uz: 'Termin qidirish (Lotin yoki O‘zbek)...',
        ru: 'Поиск терминов (Латынь или Русский)...',
        en: 'Search terms (Latin or English)...'
      },
      all: {
        uz: 'Barchasi',
        ru: 'Все',
        en: 'All'
      },
      not_found: {
        uz: 'Hech narsa topilmadi',
        ru: 'Ничего не найдено',
        en: 'Nothing found'
      },
      not_found_desc: {
        uz: "Qidiruv so'rovini o'zgartirib ko'ring.",
        ru: 'Попробуйте изменить поисковый запрос.',
        en: 'Try changing your search query.'
      },
      more_info: {
        uz: "Batafsil ma'lumot",
        ru: 'Подробная информация',
        en: 'More details'
      },
      anatomy_details: {
        uz: "Anatomik tafsilotlar",
        ru: 'Анатомические детали',
        en: 'Anatomical Details'
      },
      semester_program: {
        uz: 'Semestr dasturi',
        ru: 'Семестровая программа',
        en: 'Semester program'
      },
      view_3d: {
        uz: '3D Vizual',
        ru: '3D Визуализация',
        en: '3D Visual'
      },
      view_2d: {
        uz: 'Surat',
        ru: 'Изображение',
        en: 'Image'
      }
    };
    return dicts[key]?.[language] || dicts[key]?.['uz'] || '';
  };

  const getEntryName = (entry: any) => {
    if (!entry) return '';
    if (language === 'uz') {
      return entry.uzbekName || entry.name || '';
    } else if (language === 'ru') {
      return entry.russianName || entry.uzbekName || entry.name || '';
    } else {
      return entry.englishName || entry.latinName || entry.uzbekName || '';
    }
  };

  const getEntryDesc = (entry: any) => {
    if (!entry) return '';
    const val = entry.description;
    if (!val) return '';
    if (typeof val === 'object') {
      return getLocalized(val) || val.uz || val.en || '';
    }
    return val;
  };

  const filteredEntries = entries.filter(entry => {
    if (only3D && !entry.modelUrl && !entry.embedUrl) {
      return false;
    }
    if (onlyFavorites && !favorites.includes(entry.id)) {
      return false;
    }

    const entryName = getEntryName(entry);
    const entryDesc = getEntryDesc(entry);
    const latin = entry.latinName || '';
    const uzbek = entryName || '';
    const desc = entryDesc || '';
    
    let matchesSearch = false;
    if (searchMode === 'latin') {
      matchesSearch = latin.toLowerCase().includes(search.toLowerCase());
    } else if (searchMode === 'uzbek') {
      matchesSearch = 
        uzbek.toLowerCase().includes(search.toLowerCase()) ||
        (entry.uzbekName || '').toLowerCase().includes(search.toLowerCase()) ||
        (entry.russianName || '').toLowerCase().includes(search.toLowerCase()) ||
        (entry.englishName || '').toLowerCase().includes(search.toLowerCase());
    } else {
      matchesSearch = 
        latin.toLowerCase().includes(search.toLowerCase()) || 
        uzbek.toLowerCase().includes(search.toLowerCase()) ||
        (entry.uzbekName || '').toLowerCase().includes(search.toLowerCase()) ||
        (entry.russianName || '').toLowerCase().includes(search.toLowerCase()) ||
        (entry.englishName || '').toLowerCase().includes(search.toLowerCase()) ||
        desc.toLowerCase().includes(search.toLowerCase());
    }
    
    if (selectedSemester === 'all') return matchesSearch;
    
    const topic = topics.find(t => t.id === entry.topicId);
    const entrySem = entry.semester || (topic ? topic.semester : null);
    return matchesSearch && entrySem === selectedSemester;
  });

  return (
    <div id="atlas-root" className="bg-brand-bg min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-16 border-b border-brand-border pb-12">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-black text-brand-primary tracking-tighter flex items-center gap-4 uppercase">
              <Microscope className="w-12 h-12 text-brand-accent p-2 bg-brand-primary rounded-xl" /> {t('home.feat_atlas') || t('atlas.title')}
            </h1>
            <p className="text-brand-muted mt-5 text-xl font-medium leading-relaxed">
              {t('home.feat_atlas_desc') || t('atlas.desc')}
            </p>
          </div>
          
          <div className="flex flex-col gap-3 w-full md:w-[450px]">
            <div className="relative w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-muted w-6 h-6" />
              <input 
                type="text" 
                placeholder={tLabel('search_placeholder')} 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-white border border-brand-border rounded-xl shadow-xl shadow-slate-200/40 focus:ring-4 focus:ring-brand-accent/10 focus:border-brand-accent outline-none transition-all font-bold text-brand-primary placeholder:text-brand-muted/50"
              />
            </div>

            {/* Terminology Toggle Selector */}
            <div className="bg-slate-100 p-1 rounded-xl border border-slate-200/60 flex gap-1 shadow-inner w-full">
              <button
                onClick={() => setSearchMode('all')}
                className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1 ${
                  searchMode === 'all'
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'text-brand-muted hover:text-brand-primary'
                }`}
              >
                🔍 {language === 'uz' ? 'Barchasi' : language === 'ru' ? 'Все' : 'All'}
              </button>
              <button
                onClick={() => setSearchMode('latin')}
                className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1 ${
                  searchMode === 'latin'
                    ? 'bg-[#0B0F17] text-brand-accent shadow-sm border border-brand-accent/10'
                    : 'text-brand-muted hover:text-brand-primary'
                }`}
              >
                🧬 {language === 'uz' ? 'Lotincha' : language === 'ru' ? 'Латынь' : 'Latin'}
              </button>
              <button
                onClick={() => setSearchMode('uzbek')}
                className={`flex-1 py-2 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1 ${
                  searchMode === 'uzbek'
                    ? 'bg-[#0B0F17] text-brand-accent shadow-sm border border-brand-accent/10'
                    : 'text-brand-muted hover:text-brand-primary'
                }`}
              >
                🇺🇿 {language === 'uz' ? "O'zbekcha" : language === 'ru' ? 'Узбекский' : 'Uzbek'}
              </button>
            </div>
          </div>
        </div>

        {!user ? (
          <div className="max-w-xl mx-auto text-center py-16 px-8 bg-white rounded-[40px] border border-brand-border shadow-xl relative overflow-hidden animate-fade-in" id="atlas-unauthenticated">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full filter blur-3xl translate-x-10 -translate-y-10 pointer-events-none" />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-accent to-amber-400 text-brand-primary flex items-center justify-center mx-auto mb-6 shadow-lg border border-brand-accent/20">
              <Lock className="w-8 h-8" />
            </div>
              <h2 className="text-2xl font-black text-brand-primary tracking-tight uppercase leading-none">Tizimga kirish talab etiladi</h2>
            <p className="text-brand-muted text-sm mt-4 font-semibold leading-relaxed max-w-sm mx-auto">
              3D Atlas darsliklarini va interaktiv uch o'lchamli suyak/a'zo modellarini ko'rish uchun, iltimos, Google hisobingiz orqali kiring.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleGoogleLogin}
                disabled={isLoggingIn}
                className="w-full sm:w-auto px-8 py-4 bg-brand-accent text-brand-primary font-black text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-brand-accent/20 border border-brand-accent/20 disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12.24 10.285V13.4h6.86c-.277 1.56-1.602 4.585-6.86 4.585-4.54 0-8.24-3.765-8.24-8.4s3.7-8.4 8.24-8.4c2.58 0 4.307 1.095 5.298 2.045l2.465-2.37C18.435 1.21 15.62 0 12.24 0 5.58 0 0 5.37 0 12s5.58 12 12.24 12c6.96 0 11.57-4.89 11.57-11.79 0-.795-.085-1.4-.195-1.925H12.24z" />
                </svg>
                {isLoggingIn ? "Kirilmoqda..." : "Google orqali kirish"}
              </button>
            </div>

            {/* Explanatory banner on Google Auth block or inside iframe */}
            <div className="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left max-w-sm mx-auto">
              <div className="flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-800 tracking-wider">
                    Google tizimiga kirish ishlamayaptimi?
                  </h4>
                  <p className="text-[10px] text-slate-500 font-medium mt-1 leading-relaxed">
                    Agar Google tizimga kirish darchasi ochilmasa (iframe cheklovlari sababli), ilovani yangi tabda (oynada) ochib kiring.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12">
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setSelectedSemester('all')}
                  className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${selectedSemester === 'all' ? 'bg-brand-primary text-brand-accent shadow-xl shadow-brand-primary/20' : 'bg-white text-brand-muted border border-brand-border hover:border-brand-accent'}`}
                >
                  {tLabel('all')}
                </button>
                {semesters.map(sem => (
                  <button 
                    key={sem.id}
                    onClick={() => setSelectedSemester(sem.number)}
                    className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${selectedSemester === sem.number ? 'bg-brand-primary text-brand-accent shadow-xl shadow-brand-primary/20' : 'bg-white text-brand-muted border border-brand-border hover:border-brand-accent'}`}
                  >
                    {sem.number}-Semestr
                  </button>
                ))}
              </div>

              {/* Filter Switches */}
              <div className="flex flex-wrap gap-3 items-center">
                {/* 3D Filter Switch Button */}
                <button
                  onClick={() => setOnly3D(!only3D)}
                  className={`px-6 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                    only3D 
                      ? 'bg-brand-primary text-brand-accent border-brand-primary shadow-lg shadow-brand-primary/10' 
                      : 'bg-white text-brand-muted border-brand-border hover:border-brand-accent hover:text-brand-accent'
                  }`}
                >
                  <Box className={`w-4 h-4 ${only3D ? 'animate-bounce' : ''}`} />
                  {language === 'uz' ? 'Faqat 3D modellar' : language === 'ru' ? 'Только 3D модели' : 'Only 3D Models'}
                  {only3D && (
                    <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                  )}
                </button>

                {/* Favorites List Filter Button */}
                <button
                  onClick={() => setOnlyFavorites(!onlyFavorites)}
                  className={`px-6 py-3.5 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 border cursor-pointer ${
                    onlyFavorites 
                      ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/10' 
                      : 'bg-white text-brand-muted border-brand-border hover:border-red-500 hover:text-red-500'
                  }`}
                >
                  <Star className={`w-4 h-4 ${onlyFavorites ? 'fill-white animate-pulse' : ''}`} />
                  {language === 'uz' ? 'Saqlanganlar' : language === 'ru' ? 'Избранные' : 'Favorites'}
                  {favorites.length > 0 && (
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${onlyFavorites ? 'bg-white text-red-500' : 'bg-red-500 text-white'}`}>
                      {favorites.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {!isUnlocked && (
              <div className="max-w-xl mx-auto text-center py-14 px-8 bg-white rounded-[40px] border border-brand-border shadow-2xl relative overflow-hidden mb-12 animate-fade-in">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-accent/5 rounded-full filter blur-3xl translate-x-10 -translate-y-10 pointer-events-none" />
                <div className="w-16 h-16 rounded-2xl bg-brand-bg text-brand-accent flex items-center justify-center mx-auto mb-6 shadow-md border border-brand-border">
                  {isPending ? (
                    <Clock className="w-8 h-8 text-orange-500 animate-pulse" />
                  ) : (
                    <Lock className="w-8 h-8 text-brand-accent animate-pulse" />
                  )}
                </div>

                <span className="inline-flex items-center gap-1.5 bg-brand-accent/10 border border-brand-accent/20 text-brand-primary text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-brand-accent animate-pulse" />
                  Premium 3D Atlas Obuna
                </span>

                <h2 className="text-2xl font-black text-brand-primary tracking-tight uppercase leading-none">
                  {isPending ? "Ariza kutilmoqda" : "3D Atlasni Faollashtiring"}
                </h2>

                <p className="text-brand-muted text-sm mt-4 font-semibold leading-relaxed max-w-sm mx-auto">
                  {isPending 
                    ? "Sizning premium to'lovingiz adminlarimiz tomonidan tasdiqlanmoqda. Tasdiqlanishi bilan barcha 3D modellar darhol ochiladi! ⏳"
                    : "Atigi 30,000 UZS evaziga barcha yuqori sifatli 3D anatomik modellar va ularning darslik ma'lumotlarini 6 oyga to'liq ochish imkoniyatiga ega bo'lasiz."}
                </p>

                {!isPending ? (
                  <div className="mt-8 animate-bounce">
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="px-10 py-5 bg-brand-primary text-brand-accent font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-brand-primary/20 cursor-pointer text-center"
                    >
                      3D Atlasga Obuna Bo'lish (6 oy) — 30,000 UZS
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 flex flex-col items-center gap-2">
                    <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">TELEGRAM KO'MAK</span>
                    <a 
                      href={`https://t.me/${telegramBot.replace('@', '').trim()}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-xs text-brand-accent underline font-bold"
                    >
                      Admin bilan bog'lanish ({telegramBot})
                    </a>
                  </div>
                )}
              </div>
            )}

            <div className={!isUnlocked ? "filter blur-md pointer-events-none opacity-40 select-none transition-all duration-300" : "transition-all duration-300"}>
              {loading ? (
                <div className="flex items-center justify-center h-96">
                   <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-bg border-t-brand-accent"></div>
                </div>
              ) : filteredEntries.length === 0 ? (
                <div className="text-center py-32 bg-white rounded-[40px] border border-brand-border shadow-sm">
                  <div className="text-brand-muted/20 mb-8 inline-block p-10 bg-brand-bg rounded-3xl">
                    <Search className="w-20 h-20" />
                  </div>
                  <h3 className="text-2xl font-black text-brand-primary uppercase tracking-tight">{tLabel('not_found')}</h3>
                  <p className="text-brand-muted mt-3 text-lg">{tLabel('not_found_desc')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {filteredEntries.map((entry, idx) => (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      onClick={() => setSelectedEntry(entry)}
                      className="bg-white rounded-[32px] border border-brand-border shadow-sm overflow-hidden group hover:shadow-2xl hover:shadow-brand-accent/10 hover:border-brand-accent transition-all duration-500 cursor-pointer"
                    >
                      <div className="aspect-[1.2/1] bg-slate-100 overflow-hidden relative">
                        {entry.image ? (
                          <img
                            src={entry.image}
                            alt={entry.latinName}
                            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 group-hover:scale-105 transition-transform duration-700">
                            <Box className="w-14 h-14" />
                            <span className="text-[10px] font-black uppercase tracking-widest px-4 text-center text-slate-500">{entry.latinName}</span>
                          </div>
                        )}
                        <div className="absolute top-4 left-4 z-10">
                          <span className="px-3 py-1.5 bg-brand-primary/80 backdrop-blur-md text-brand-accent text-[9px] font-black uppercase tracking-widest rounded-lg border border-white/10">
                            IDENTIFIER {idx + 1}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4 z-10 flex gap-1.5 items-center">
                          <button
                            onClick={(e) => toggleFavorite(entry.id, e)}
                            className={`p-2 rounded-lg border backdrop-blur-md shadow-md scale-100 hover:scale-110 active:scale-90 transition-all cursor-pointer ${
                              favorites.includes(entry.id)
                                ? 'bg-red-500 text-white border-red-500'
                                : 'bg-white/95 text-slate-700 border-slate-200 hover:text-red-500 hover:border-red-200'
                            }`}
                          >
                            <Star className={`w-3.5 h-3.5 ${favorites.includes(entry.id) ? 'fill-white' : ''}`} />
                          </button>
                          {(entry.modelUrl || entry.embedUrl) && (
                            <div className="p-2 bg-brand-accent text-brand-primary rounded-lg shadow-md border border-white/25">
                              <Box size={14} />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-8">
                        <div className="mb-6">
                          <h3 className="text-brand-accent text-[10px] font-black uppercase tracking-[0.2em] mb-2">{entry.latinName}</h3>
                          <h2 className="text-2xl font-black text-brand-primary tracking-tighter leading-tight">{getEntryName(entry)}</h2>
                        </div>
                        
                        <p className="text-brand-muted text-sm leading-relaxed line-clamp-2 mb-8 font-medium">
                          {getEntryDesc(entry)}
                        </p>
                        
                        <div className="flex items-center justify-between pt-6 border-t border-brand-border">
                          <span className="text-[10px] font-black text-brand-muted uppercase tracking-widest flex items-center gap-2">
                             <Info className="w-3.5 h-3.5" /> {tLabel('more_info')}
                          </span>
                          <div className="w-10 h-10 rounded-full bg-brand-bg flex items-center justify-center text-brand-accent group-hover:bg-brand-accent group-hover:text-brand-primary transition-all">
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Entry Detail Modal (Immersive 3D Experience) */}
      <AnimatePresence>
        {selectedEntry && (
          <div className="fixed inset-0 z-[100] overflow-hidden flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEntry(null)}
              className="absolute inset-0 bg-black/98 backdrop-blur-3xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full h-full bg-transparent flex flex-col md:flex-row overflow-hidden"
            >
              {viewMode === '3d' && selectedEntry.modelUrl ? (
                <Anatomy3DSuite 
                  src={selectedEntry.modelUrl} 
                  alt={selectedEntry.latinName} 
                  initialEntry={selectedEntry}
                  onBack={() => setSelectedEntry(null)}
                  viewMode={viewMode}
                  onViewModeChange={(val) => setViewMode(val)}
                />
              ) : (
                <>
                  {/* Main Viewer Area */}
                  <div className="flex-grow relative bg-[#0a0a0a] group">
                {/* 3D/2D Viewer */}
                <div className="w-full h-full">
                  <AnimatePresence mode="wait">
                    {viewMode === '2d' || !selectedEntry.modelUrl ? (
                      <motion.div
                        key="2d"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`w-full h-full flex items-center justify-center ${selectedEntry.embedUrl ? '' : 'p-10 md:p-20'}`}
                      >
                        {selectedEntry.embedUrl ? (
                          <iframe
                            title={selectedEntry.latinName}
                            src={selectedEntry.embedUrl}
                            className="w-full h-full border-0"
                            allow="autoplay; fullscreen; xr-spatial-tracking"
                            allowFullScreen
                          />
                        ) : selectedEntry.image ? (
                          <img
                            src={selectedEntry.image}
                            alt={selectedEntry.latinName}
                            className="max-w-full max-h-full object-contain filter drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-4 text-white/30">
                            <Box className="w-20 h-20" />
                            <span className="text-xs font-black uppercase tracking-widest">{selectedEntry.latinName}</span>
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="3d"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full relative"
                      >
                        <AnimatedModelViewer 
                          src={selectedEntry.modelUrl} 
                          alt={`3D model of ${selectedEntry.latinName}`} 
                          fallbackImage={selectedEntry.image}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Top Controls Overlay */}
                <div className="absolute top-10 left-10 right-10 flex justify-between items-start pointer-events-none">
                  <div className="flex flex-col gap-6 pointer-events-auto">
                    <button 
                      onClick={() => setSelectedEntry(null)}
                      className="w-14 h-14 bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white transition-all border border-white/10 group/btn"
                    >
                      <ArrowLeft className="group-hover/btn:-translate-x-1 transition-transform" />
                    </button>
                    
                    {viewMode !== '3d' && (
                      <div className="flex flex-col gap-2">
                         <div className="px-4 py-2 bg-brand-accent/20 rounded-lg border border-brand-accent/30 inline-block self-start">
                           <span className="text-[9px] font-black text-brand-accent uppercase tracking-widest">3D Atlas Interactive</span>
                         </div>
                         <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none mt-2">
                           {getEntryName(selectedEntry)}
                         </h1>
                         <p className="text-white/40 text-xl italic font-serif mt-2">{selectedEntry.latinName}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pointer-events-auto">
                    {selectedEntry.modelUrl && (
                      <div className="bg-black/40 backdrop-blur-3xl p-2 rounded-3xl border border-white/10 flex gap-2">
                        <button 
                          onClick={() => setViewMode('2d')}
                          className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all ${viewMode === '2d' ? 'bg-white text-black shadow-2xl scale-105' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                        >
                          <ImageIcon size={20} />
                          <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">{tLabel('view_2d')}</span>
                        </button>
                        <button 
                          onClick={() => setViewMode('3d')}
                          className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all ${viewMode === '3d' ? 'bg-white text-black shadow-2xl scale-105' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                        >
                          <Box size={20} />
                          <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">{tLabel('view_3d')}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Instruction Overlay */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 px-8 py-4 bg-white/5 backdrop-blur-2xl rounded-full border border-white/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-700">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-[8px] font-bold text-white/50">L</div>
                    <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">Rotate</span>
                  </div>
                  <div className="w-[1px] h-4 bg-white/10"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-[8px] font-bold text-white/50">R</div>
                    <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">Pan</span>
                  </div>
                  <div className="w-[1px] h-4 bg-white/10"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-6 border border-white/20 rounded-full flex items-center justify-center text-[8px] font-bold text-white/50">MW</div>
                    <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">Zoom</span>
                  </div>
                </div>
              </div>

              {/* Sidebar Panel */}
              <div className="w-full md:w-[450px] bg-white h-full flex flex-col shadow-[-40px_0_100px_rgba(0,0,0,0.4)] relative z-10">
                <div className="p-12 md:p-16 flex flex-col h-full overflow-y-auto">
                   <div className="mb-14">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <span className="w-12 h-12 bg-brand-primary text-brand-accent flex items-center justify-center rounded-2xl font-black shadow-xl shadow-brand-primary/20">
                          <Info size={24} />
                        </span>
                        <h3 className="text-[11px] font-black text-brand-muted uppercase tracking-[0.3em]">{tLabel('anatomy_details')}</h3>
                      </div>

                      <button 
                        onClick={(e) => toggleFavorite(selectedEntry.id, e)}
                        className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                          favorites.includes(selectedEntry.id)
                            ? 'bg-red-500 text-white border-red-500 shadow-md shadow-red-500/10'
                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200'
                        }`}
                        title={language === 'uz' ? "Sevimlilarga qo'shish" : "В избранное"}
                      >
                        <Star className={`w-5 h-5 ${favorites.includes(selectedEntry.id) ? 'fill-white lg:scale-105' : ''}`} />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <h2 className="text-4xl font-black text-brand-primary tracking-tighter uppercase leading-tight">
                        {getEntryName(selectedEntry)}
                      </h2>
                      <div className="flex items-center gap-2.5">
                        <p className="text-brand-accent text-xl font-serif italic tracking-wide">{selectedEntry.latinName}</p>
                        <button
                          onClick={() => speakLatin(selectedEntry.latinName)}
                          className={`w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-brand-accent flex items-center justify-center transition-all cursor-pointer border border-slate-200 ${
                            isSpeaking ? 'animate-pulse bg-brand-accent text-brand-primary border-brand-accent' : ''
                          }`}
                          title={language === 'uz' ? "Lotincha talaffuzi (ovozli)" : "Латинское произношение (аудио)"}
                        >
                          <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'text-brand-primary' : 'text-brand-accent'}`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-10 flex-grow">
                    <div className="relative">
                      <div className="absolute -left-6 top-1 bottom-1 w-1 bg-brand-accent/20 rounded-full overflow-hidden">
                        <div className="w-full h-1/3 bg-brand-accent animate-pulse"></div>
                      </div>
                      <h4 className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-4">{tLabel('description_title')}</h4>
                      <p className="text-brand-primary/80 text-lg leading-relaxed font-semibold">
                        {getEntryDesc(selectedEntry)}
                      </p>
                    </div>

                    {/* Active Recall Interactive Card */}
                    <div className="p-7 bg-[#FAF9F5] rounded-[32px] border border-dashed border-brand-accent/40 relative overflow-hidden shadow-sm">
                      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-brand-accent/5 rounded-full blur-xl pointer-events-none"></div>
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-brand-accent animate-pulse" />
                        <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-widest">
                          {language === 'uz' ? "Aktiv Eslash (Flashcard)" : language === 'ru' ? "Активное Припоминание" : "Active Recall (Flashcard)"}
                        </h4>
                      </div>
                      
                      {!isRevealed ? (
                        <div className="py-4 text-center">
                          <p className="text-slate-500 text-[11px] font-semibold mb-4 leading-relaxed">
                            {language === 'uz' 
                              ? "Ushbu a'zoning o'zbekcha tarjimasi va batafsil darslik tavsifini xotirangizda tekshirib ko'ring!" 
                              : "Проверьте себя: помните ли вы перевод и значение этой анатомической структуры?"}
                          </p>
                          <button
                            onClick={() => setIsRevealed(true)}
                            className="px-5 py-2.5 bg-brand-primary text-brand-accent text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all cursor-pointer shadow-md shadow-brand-primary/10"
                          >
                            {language === 'uz' ? "Javobni ko'rish (Reveal)" : "Показать ответ"}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3 py-1 animate-in fade-in duration-300">
                          <div className="p-3 bg-white rounded-xl border border-slate-100 pb-4">
                            <span className="text-[8px] font-black text-brand-accent uppercase tracking-widest block mb-0.5">
                              {language === 'uz' ? "O'zbekcha nomi:" : "Перевод:"}
                            </span>
                            <p className="text-brand-primary font-black text-base">{getEntryName(selectedEntry)}</p>
                          </div>
                          
                          <div className="p-3 bg-white rounded-xl border border-slate-100 pb-4">
                            <span className="text-[8px] font-black text-brand-accent uppercase tracking-widest block mb-0.5">
                              {language === 'uz' ? "Darslik tavsifi:" : "Описание:"}
                            </span>
                            <p className="text-brand-primary/80 text-[11px] font-medium leading-relaxed">{getEntryDesc(selectedEntry)}</p>
                          </div>
                          
                          <button
                            onClick={() => setIsRevealed(false)}
                            className="w-full py-2 bg-slate-200 text-slate-700 hover:bg-slate-300 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all cursor-pointer"
                          >
                            {language === 'uz' ? "Qayta yashirish (Hide)" : "Скрыть обратно"}
                          </button>
                        </div>
                      )}
                    </div>

                    {selectedEntry.topicId && (
                      <div className="group/card cursor-pointer">
                        <h4 className="text-[10px] font-black text-brand-muted uppercase tracking-widest mb-6">{tLabel('curriculum_place')}</h4>
                        <div className="p-8 bg-brand-bg rounded-[40px] border border-brand-border group-hover/card:border-brand-accent transition-all duration-500 relative overflow-hidden">
                          <div className="absolute right-0 top-0 w-32 h-32 bg-brand-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-brand-accent shadow-xl shadow-brand-accent/10 border border-brand-border">
                              <Microscope size={28} />
                            </div>
                            <div>
                              <p className="text-brand-primary font-black text-lg tracking-tighter leading-none mb-2">
                                {getLocalized(topics.find(t => t.id === selectedEntry.topicId)?.title as any) || topics.find(t => t.id === selectedEntry.topicId)?.title?.uz || 'Noma\'lum mavzu'}
                              </p>
                              <p className="text-brand-muted text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-brand-accent"></span>
                                {topics.find(t => t.id === selectedEntry.topicId)?.semester}-{tLabel('semester_program')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-16 pt-12 border-t border-brand-border flex items-center justify-between">
                     <div className="text-[10px] font-black text-brand-primary/30 uppercase tracking-[0.2em] flex flex-col gap-1">
                       <span>Database Ver 4.2</span>
                       <span>Asset ID: {selectedEntry.id.substring(0, 12).toUpperCase()}</span>
                     </div>
                     <button 
                      onClick={() => setSelectedEntry(null)}
                      className="px-8 py-4 bg-brand-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-brand-primary/20"
                     >
                       {tLabel('back_to_catalog')}
                     </button>
                  </div>
                </div>
              </div>
              </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {showPaymentModal && user && (
        <PaymentModal
          semesterId={99}
          user={user}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={async () => {
            setShowPaymentModal(false);
            try {
              const profile = await dbService.getProfile(user.uid);
              const payment = await dbService.getPayment(user.uid, 99);
              if ((profile?.purchasedSemesters || []).map(Number).includes(99) || payment?.status === 'completed' || payment?.status === 'approved') {
                setIsPaid(true);
                setIsPending(false);
              } else if (payment?.status === 'pending') {
                setIsPending(true);
                setIsPaid(false);
              }
            } catch (e) {
              console.error("Atlas payment refresh error:", e);
            }
          }}
        />
      )}
    </div>
  );
}

