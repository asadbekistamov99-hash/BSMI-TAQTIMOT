import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  FileText, 
  Presentation as PresentationIcon, 
  AlertCircle, 
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  X,
  Pen,
  Highlighter,
  Eraser,
  MousePointer,
  Sparkles,
  Trash2,
  Undo2,
  Check
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { pptxToHtml } from '@jvmr/pptx-to-html';

// Setup pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

interface Point {
  x: number;
  y: number;
}

interface AnnotationStroke {
  id: string;
  type: 'pen' | 'highlighter';
  color: string;
  width: number;
  points: Point[];
}

type ToolMode = 'pointer' | 'pen' | 'highlighter' | 'laser' | 'eraser';

const ANNOTATION_COLORS = [
  { label: 'Qizil', value: '#ef4444' },
  { label: 'Sariq', value: '#facc15' },
  { label: 'Yashil', value: '#22c55e' },
  { label: 'Moviy', value: '#38bdf8' },
  { label: 'Binafsha', value: '#c084fc' },
  { label: 'Oq', value: '#ffffff' },
  { label: "To'q", value: '#0f172a' }
];

interface PresentationViewerProps {
  fileUrl: string;
  fileType: 'pptx' | 'pdf';
  title?: string;
  semester?: number;
  order?: number;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onClose?: () => void;
  onPrevTopic?: () => void;
  hasPrevTopic?: boolean;
  onNextTopic?: () => void;
  hasNextTopic?: boolean;
  canAnnotate?: boolean;
}

export const PresentationViewer: React.FC<PresentationViewerProps> = ({
  fileUrl,
  fileType,
  title = 'Taqdimot',
  semester,
  order,
  isFullscreen = false,
  onToggleFullscreen,
  onClose,
  onPrevTopic,
  hasPrevTopic = false,
  onNextTopic,
  hasNextTopic = false,
  canAnnotate = false
}) => {
  // Common states
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showThumbnails, setShowThumbnails] = useState(false);

  // PPTX specific states
  const [pptxSlides, setPptxSlides] = useState<string[]>([]);

  // Stage measurement for auto-fitting to screen
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [stageDimensions, setStageDimensions] = useState({ width: 960, height: 540 });

  // PDF specific refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pdfDocRef = useRef<any>(null);
  const renderTaskRef = useRef<any>(null);

  // Drawing and Annotation states
  const [activeTool, setActiveTool] = useState<ToolMode>('pointer');
  const [strokeColor, setStrokeColor] = useState<string>('#ef4444');
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [annotations, setAnnotations] = useState<Record<number, AnnotationStroke[]>>({});
  const [laserPos, setLaserPos] = useState<Point | null>(null);

  const annotationCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const activeStrokeRef = useRef<AnnotationStroke | null>(null);

  // Check if it's an external embed like Google Drive / Docs
  const isGoogleDrive = fileUrl.includes('drive.google.com') || fileUrl.includes('docs.google.com');

  // Monitor stage size changes (fullscreen, window resize, etc.)
  useEffect(() => {
    if (!stageRef.current) return;

    const updateDimensions = () => {
      if (stageRef.current) {
        const rect = stageRef.current.getBoundingClientRect();
        if (rect.width > 50 && rect.height > 50) {
          setStageDimensions({ width: rect.width, height: rect.height });
        }
      }
    };

    updateDimensions();
    const ro = new ResizeObserver(() => updateDimensions());
    ro.observe(stageRef.current);
    window.addEventListener('resize', updateDimensions);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, [isFullscreen]);

  // Load document whenever fileUrl or fileType changes
  useEffect(() => {
    let isMounted = true;

    if (!fileUrl) {
      setLoading(false);
      setError("Taqdimot fayl manzili topilmadi.");
      return;
    }

    // Google Drive embeds load in iframe
    if (isGoogleDrive) {
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setLoadingProgress(10);
    setCurrentPage(1);

    const loadContent = async () => {
      try {
        // Fetch file buffer with progress simulation
        setLoadingProgress(30);
        const response = await fetch(fileUrl);
        if (!response.ok) {
          throw new Error(`Faylni yuklab bo'lmadi (${response.status} ${response.statusText})`);
        }
        setLoadingProgress(60);

        const arrayBuffer = await response.arrayBuffer();
        if (!isMounted) return;

        if (fileType === 'pptx') {
          // Parse PPTX into HTML slides
          setLoadingProgress(80);
          try {
            const slides = await pptxToHtml(arrayBuffer, {
              width: 960,
              height: 540,
              scaleToFit: true,
              letterbox: true
            });

            if (!isMounted) return;

            if (slides && slides.length > 0) {
              setPptxSlides(slides);
              setTotalPages(slides.length);
              setLoading(false);
              setLoadingProgress(100);
            } else {
              throw new Error("Taqdimot slaydlari topilmadi.");
            }
          } catch (pptxErr: any) {
            console.error("PPTX parse error:", pptxErr);
            throw new Error("PowerPoint faylini o'qishda xatolik yuz berdi. Fayl shikastlanmaganligiga ishonch hosil qiling.");
          }
        } else {
          // PDF rendering with pdfjs-dist
          setLoadingProgress(80);
          const loadingTask = pdfjsLib.getDocument({
            data: arrayBuffer,
            cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
            cMapPacked: true,
          });

          const pdf = await loadingTask.promise;
          if (!isMounted) return;

          pdfDocRef.current = pdf;
          setTotalPages(pdf.numPages);
          setLoading(false);
          setLoadingProgress(100);
        }
      } catch (err: any) {
        if (!isMounted) return;
        console.error("Presentation loading error:", err);
        setError(err.message || "Taqdimotni ochishda kutilmagan xatolik yuz berdi.");
        setLoading(false);
      }
    };

    loadContent();

    return () => {
      isMounted = false;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {}
      }
    };
  }, [fileUrl, fileType, isGoogleDrive]);

  // Render PDF page onto canvas with auto-fit scale
  useEffect(() => {
    if (fileType !== 'pdf' || isGoogleDrive || !pdfDocRef.current || !canvasRef.current) {
      return;
    }

    let isCancelled = false;

    const renderPdfPage = async () => {
      try {
        if (renderTaskRef.current) {
          try {
            renderTaskRef.current.cancel();
          } catch {}
        }

        const page = await pdfDocRef.current.getPage(currentPage);
        if (isCancelled || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Auto-fit calculation
        const baseViewport = page.getViewport({ scale: 1 });
        const availW = Math.max(300, stageDimensions.width - (isFullscreen ? 16 : 32));
        const availH = Math.max(200, stageDimensions.height - (isFullscreen ? 16 : 32));
        const fitScale = Math.min(availW / baseViewport.width, availH / baseViewport.height);
        const effectivePdfScale = Math.max(0.3, fitScale * scale);

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const viewport = page.getViewport({ scale: effectivePdfScale * dpr });

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = `${Math.floor(viewport.width / dpr)}px`;
        canvas.style.height = `${Math.floor(viewport.height / dpr)}px`;

        ctx.setTransform(1, 0, 0, 1, 0, 0);

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport
        };

        const renderTask = page.render(renderContext);
        renderTaskRef.current = renderTask;
        await renderTask.promise;
      } catch (renderErr: any) {
        if (renderErr?.name !== 'RenderingCancelledException') {
          console.error("PDF page render error:", renderErr);
        }
      }
    };

    renderPdfPage();

    return () => {
      isCancelled = true;
    };
  }, [currentPage, scale, fileType, isGoogleDrive, loading, stageDimensions.width, stageDimensions.height, isFullscreen]);

  // Redraw all annotations on the current page
  const redrawAnnotations = useCallback((currentActiveStroke?: AnnotationStroke | null) => {
    const canvas = annotationCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const strokes = annotations[currentPage] || [];
    const allStrokes = currentActiveStroke ? [...strokes, currentActiveStroke] : strokes;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const scaleRatio = canvas.width / (960 * dpr);

    allStrokes.forEach(stroke => {
      if (!stroke.points || stroke.points.length === 0) return;

      ctx.save();
      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (stroke.type === 'highlighter') {
        ctx.globalAlpha = 0.42;
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = Math.max(8, stroke.width * scaleRatio * 4.5);
      } else {
        ctx.globalAlpha = 1.0;
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = Math.max(1.5, stroke.width * scaleRatio);
      }

      const p0 = stroke.points[0];
      ctx.moveTo(p0.x * canvas.width, p0.y * canvas.height);

      for (let i = 1; i < stroke.points.length; i++) {
        const pt = stroke.points[i];
        ctx.lineTo(pt.x * canvas.width, pt.y * canvas.height);
      }

      ctx.stroke();
      ctx.restore();
    });
  }, [annotations, currentPage]);

  // Keep annotation canvas pixel size matched with parent container
  const updateAnnotationCanvasSize = useCallback(() => {
    const canvas = annotationCanvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    canvas.style.width = `${Math.floor(rect.width)}px`;
    canvas.style.height = `${Math.floor(rect.height)}px`;

    redrawAnnotations();
  }, [redrawAnnotations]);

  // Sync canvas size on layout or page changes
  useEffect(() => {
    const timer = setTimeout(() => {
      updateAnnotationCanvasSize();
    }, 60);
    return () => clearTimeout(timer);
  }, [currentPage, stageDimensions, scale, isFullscreen, updateAnnotationCanvasSize, pptxSlides.length]);

  // Redraw whenever annotations or current page changes
  useEffect(() => {
    redrawAnnotations();
  }, [annotations, currentPage, redrawAnnotations]);

  // Get normalized coordinate (0 to 1) from mouse or touch event
  const getNormalizedPoint = (e: React.MouseEvent | React.TouchEvent): Point | null => {
    const canvas = annotationCanvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return null;

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

    return { x, y };
  };

  const eraseNearbyStrokes = (normX: number, normY: number) => {
    const threshold = 0.035;
    setAnnotations(prev => {
      const current = prev[currentPage] || [];
      const remaining = current.filter(stroke => {
        return !stroke.points.some(p => {
          const dx = p.x - normX;
          const dy = p.y - normY;
          return Math.sqrt(dx * dx + dy * dy) < threshold;
        });
      });
      if (remaining.length !== current.length) {
        return { ...prev, [currentPage]: remaining };
      }
      return prev;
    });
  };

  const handleStartDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (activeTool === 'pointer') return;

    const pt = getNormalizedPoint(e);
    if (!pt) return;

    if (activeTool === 'laser') {
      setLaserPos(pt);
      return;
    }

    if (activeTool === 'eraser') {
      isDrawingRef.current = true;
      eraseNearbyStrokes(pt.x, pt.y);
      return;
    }

    isDrawingRef.current = true;
    const newStroke: AnnotationStroke = {
      id: `stroke_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type: activeTool === 'highlighter' ? 'highlighter' : 'pen',
      color: strokeColor,
      width: strokeWidth,
      points: [pt]
    };

    activeStrokeRef.current = newStroke;
    redrawAnnotations(newStroke);
  };

  const handleMoveDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const pt = getNormalizedPoint(e);
    if (!pt) return;

    if (activeTool === 'laser') {
      setLaserPos(pt);
      return;
    }

    if (!isDrawingRef.current) return;

    if (activeTool === 'eraser') {
      eraseNearbyStrokes(pt.x, pt.y);
      return;
    }

    if (activeStrokeRef.current) {
      activeStrokeRef.current.points.push(pt);
      redrawAnnotations(activeStrokeRef.current);
    }
  };

  const handleEndDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    if (activeStrokeRef.current && activeStrokeRef.current.points.length > 0) {
      const finishedStroke = activeStrokeRef.current;
      activeStrokeRef.current = null;
      setAnnotations(prev => ({
        ...prev,
        [currentPage]: [...(prev[currentPage] || []), finishedStroke]
      }));
    }
  };

  const handleLeaveDrawing = () => {
    if (activeTool === 'laser') {
      setLaserPos(null);
    }
    handleEndDrawing();
  };

  const handleUndo = () => {
    setAnnotations(prev => {
      const current = prev[currentPage] || [];
      if (current.length === 0) return prev;
      return {
        ...prev,
        [currentPage]: current.slice(0, current.length - 1)
      };
    });
  };

  const handleClearSlide = () => {
    setAnnotations(prev => ({
      ...prev,
      [currentPage]: []
    }));
  };

  // Keyboard navigation and annotation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Undo shortcut
      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Annotation tool shortcuts
      if (canAnnotate && !e.ctrlKey && !e.metaKey) {
        if (e.key === 'p' || e.key === 'P') {
          e.preventDefault();
          setActiveTool(prev => prev === 'pen' ? 'pointer' : 'pen');
          return;
        }
        if (e.key === 'h' || e.key === 'H') {
          e.preventDefault();
          setActiveTool(prev => prev === 'highlighter' ? 'pointer' : 'highlighter');
          return;
        }
        if (e.key === 'l' || e.key === 'L') {
          e.preventDefault();
          setActiveTool(prev => prev === 'laser' ? 'pointer' : 'laser');
          return;
        }
        if (e.key === 'e' || e.key === 'E') {
          e.preventDefault();
          setActiveTool(prev => prev === 'eraser' ? 'pointer' : 'eraser');
          return;
        }
        if (e.key === 'Escape' || e.key === 'v' || e.key === 'V') {
          if (activeTool !== 'pointer') {
            e.preventDefault();
            setActiveTool('pointer');
            return;
          }
        }
      }

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        nextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevPage();
      } else if (e.key === 'Home') {
        e.preventDefault();
        setCurrentPage(1);
      } else if (e.key === 'End') {
        e.preventDefault();
        setCurrentPage(totalPages);
      } else if (e.key === 'f' || e.key === 'F') {
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          handleToggleFullscreen();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalPages, isFullscreen, activeTool, handleUndo]);

  const nextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const prevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const zoomIn = () => {
    setScale(prev => Math.min(2.5, +(prev + 0.15).toFixed(2)));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(0.6, +(prev - 0.15).toFixed(2)));
  };

  const resetZoom = () => {
    setScale(1);
  };

  const handleToggleFullscreen = () => {
    if (onToggleFullscreen) {
      onToggleFullscreen();
    } else {
      // Local fallback
      if (!document.fullscreenElement) {
        const el = rootRef.current || document.documentElement;
        if (el.requestFullscreen) {
          el.requestFullscreen().catch(console.warn);
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(console.warn);
        }
      }
    }
  };

  // Auto-fit PPTX slides (base: 960 x 540) to screen size
  const availW = Math.max(320, stageDimensions.width - (isFullscreen ? 16 : 32));
  const availH = Math.max(200, stageDimensions.height - (isFullscreen ? 16 : 32));
  const autoFitPptxScale = Math.min(availW / 960, availH / 540);
  const effectivePptxScale = +(Math.max(0.3, autoFitPptxScale * scale)).toFixed(3);

  // If it's a Google Drive/Slides embed
  if (isGoogleDrive) {
    return (
      <div ref={rootRef} className="w-full h-full relative bg-slate-950 flex flex-col select-none">
        {/* Security Watermark bar */}
        <div className="bg-slate-900/90 backdrop-blur px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldAlert size={14} className="text-amber-500" />
            <span className="font-semibold text-slate-300">{title}</span>
            <span className="hidden sm:inline text-slate-500">• Himoyalangan ko'rinish</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFullscreen}
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors cursor-pointer"
              title={isFullscreen ? "Kichraytirish" : "To'liq ekran (Kengaytirish)"}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors cursor-pointer"
                title="Yopish"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        <div className="flex-1 w-full h-full relative">
          <iframe
            src={fileUrl}
            className="w-full h-full border-0"
            title={title}
            sandbox="allow-scripts allow-same-origin allow-presentation"
          />
          {/* Subtle Watermark overlay to protect content */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5 select-none font-black text-4xl sm:text-6xl text-white rotate-[-25deg]">
            BSMI ANATOMY
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div ref={rootRef} className="w-full h-full min-h-[420px] bg-slate-950 flex flex-col items-center justify-center text-white p-6 select-none">
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-accent/30 flex items-center justify-center border border-white/10 shadow-2xl">
            {fileType === 'pdf' ? (
              <FileText className="w-8 h-8 text-rose-400 animate-pulse" />
            ) : (
              <PresentationIcon className="w-8 h-8 text-amber-400 animate-pulse" />
            )}
          </div>
          <RefreshCw className="w-6 h-6 text-brand-accent animate-spin absolute -bottom-2 -right-2" />
        </div>
        <h4 className="text-base font-bold text-white mb-2">Taqdimot yuklanmoqda...</h4>
        <p className="text-xs text-slate-400 mb-5 max-w-xs text-center">
          {fileType === 'pdf' ? 'PDF konspekt sahifalari tayyorlanmoqda' : 'PowerPoint slaydlari tuzilmoqda'}
        </p>
        <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div 
            className="h-full bg-gradient-to-r from-brand-accent to-emerald-400 transition-all duration-300 rounded-full"
            style={{ width: `${loadingProgress}%` }}
          />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div ref={rootRef} className="w-full h-full min-h-[420px] bg-slate-950 flex flex-col items-center justify-center text-white p-6 select-none">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-rose-500" />
        </div>
        <h4 className="text-base font-bold text-white mb-2">Taqdimotni ochib bo'lmadi</h4>
        <p className="text-xs text-slate-400 mb-6 max-w-md text-center leading-relaxed">
          {error}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              setCurrentPage(1);
            }}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Qayta urinib ko'rish</span>
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Yopish
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="w-full h-full flex flex-col bg-slate-950 select-none overflow-hidden relative">
      {/* Unified Top Controls Header */}
      <div className="bg-slate-900/95 backdrop-blur-md px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-white z-20 shrink-0 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {semester && order && (
            <span className="hidden xs:inline-flex px-2.5 py-1 bg-brand-accent text-brand-primary text-[10px] font-black uppercase tracking-wider rounded-lg shrink-0">
              {semester}-Sem • {order}-Mavzu
            </span>
          )}

          <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 shrink-0 hidden sm:flex">
            {fileType === 'pdf' ? (
              <FileText size={15} className="text-rose-400" />
            ) : (
              <PresentationIcon size={15} className="text-amber-400" />
            )}
          </div>

          <div className="min-w-0">
            <h4 className="text-xs sm:text-sm font-bold truncate text-slate-200 max-w-[200px] sm:max-w-md md:max-w-lg lg:max-w-xl">
              {title}
            </h4>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="uppercase font-semibold tracking-wider text-slate-400">
                {fileType.toUpperCase()}
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck size={11} />
                <span>Himoyalangan Slayd</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Drawing & Annotation Toggle button */}
          {canAnnotate && (
            <button
              onClick={() => setActiveTool(prev => prev === 'pointer' ? 'pen' : 'pointer')}
              className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
                activeTool !== 'pointer'
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-400/20'
                  : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
              }`}
              title="Chizish va belgilash paneli (P)"
            >
              <Pen size={15} />
              <span className="hidden sm:inline">Chizish & Belgilash</span>
            </button>
          )}

          {/* Zoom controls */}
          <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-xl p-0.5">
            <button
              onClick={zoomOut}
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Kichraytirish"
            >
              <ZoomOut size={14} />
            </button>
            <span className="px-2 text-[11px] font-mono text-slate-300">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={zoomIn}
              className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Kattalashtirish"
            >
              <ZoomIn size={14} />
            </button>
            {scale !== 1 && (
              <button
                onClick={resetZoom}
                className="p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors border-l border-white/10 cursor-pointer"
                title="Asliga qaytarish"
              >
                <RotateCcw size={12} />
              </button>
            )}
          </div>

          {/* Thumbnails toggle */}
          {totalPages > 1 && (
            <button
              onClick={() => setShowThumbnails(!showThumbnails)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                showThumbnails 
                  ? 'bg-brand-accent text-brand-primary border-brand-accent font-bold' 
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
              title="Slaydlar ro'yxati"
            >
              <Layers size={15} />
            </button>
          )}

          {/* Fullscreen toggle (Kengaytirish) */}
          <button
            onClick={handleToggleFullscreen}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isFullscreen 
                ? 'bg-brand-accent text-brand-primary border-brand-accent font-bold shadow-lg shadow-brand-accent/20' 
                : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
            }`}
            title={isFullscreen ? "Kichiklashtirish" : "To'liq ekran (Kengaytirish)"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-all cursor-pointer ml-1"
              title="Taqdimotni yopish"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Main Presentation Stage with Auto-Scaling */}
      <div 
        ref={stageRef}
        className="flex-1 w-full relative overflow-auto flex items-center justify-center p-2 sm:p-4 bg-slate-950"
      >
        {/* Subtle Diagonal Watermark Layer (Anti-copy) */}
        <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-around overflow-hidden opacity-[0.04] select-none rotate-[-15deg]">
          <div className="text-3xl sm:text-5xl font-black text-white whitespace-nowrap text-center">
            BSMI ANATOMY • RASMIY TAQDIMOT
          </div>
          <div className="text-3xl sm:text-5xl font-black text-white whitespace-nowrap text-center">
            TALABALAR UCHUN O'QUV QO'LLANMA
          </div>
          <div className="text-3xl sm:text-5xl font-black text-white whitespace-nowrap text-center">
            BSMI ANATOMY • RASMIY TAQDIMOT
          </div>
        </div>

        {/* Dynamic Auto-Fit Slide Container */}
        {fileType === 'pptx' ? (
          <div
            className="relative flex items-center justify-center shrink-0 shadow-2xl rounded-xl overflow-hidden bg-white"
            style={{
              width: `${Math.round(960 * effectivePptxScale)}px`,
              height: `${Math.round(540 * effectivePptxScale)}px`,
            }}
          >
            <div
              style={{
                width: '960px',
                height: '540px',
                transform: `scale(${effectivePptxScale})`,
                transformOrigin: 'top left',
                position: 'absolute',
                top: 0,
                left: 0
              }}
              className="overflow-hidden bg-white select-none [&_svg]:max-w-full [&_svg]:max-h-full"
              dangerouslySetInnerHTML={{
                __html: pptxSlides[currentPage - 1] || '<div class="p-8 text-center text-slate-400">Slayd yuklanmoqda...</div>'
              }}
            />

            {/* Annotation Canvas Layer */}
            {canAnnotate && (
              <canvas
                ref={annotationCanvasRef}
                className={`absolute inset-0 z-30 touch-none ${
                  activeTool === 'pointer' 
                    ? 'pointer-events-none' 
                    : activeTool === 'laser'
                    ? 'cursor-none pointer-events-auto'
                    : 'cursor-crosshair pointer-events-auto'
                }`}
                onMouseDown={handleStartDrawing}
                onMouseMove={handleMoveDrawing}
                onMouseUp={handleEndDrawing}
                onMouseLeave={handleLeaveDrawing}
                onTouchStart={handleStartDrawing}
                onTouchMove={handleMoveDrawing}
                onTouchEnd={handleEndDrawing}
              />
            )}

            {/* Laser Pointer Glowing Indicator */}
            {canAnnotate && activeTool === 'laser' && laserPos && (
              <div 
                className="pointer-events-none absolute z-40 w-4 h-4 rounded-full bg-red-500 shadow-[0_0_18px_6px_rgba(239,68,68,0.95)] ring-2 ring-white/80 -translate-x-1/2 -translate-y-1/2 animate-pulse"
                style={{
                  left: `${laserPos.x * 100}%`,
                  top: `${laserPos.y * 100}%`
                }}
              />
            )}
          </div>
        ) : (
          <div className="relative flex items-center justify-center shrink-0 shadow-2xl rounded-xl overflow-hidden bg-white">
            <canvas ref={canvasRef} className="block max-w-full h-auto shadow-md" />

            {/* Annotation Canvas Layer */}
            {canAnnotate && (
              <canvas
                ref={annotationCanvasRef}
                className={`absolute inset-0 z-30 touch-none ${
                  activeTool === 'pointer' 
                    ? 'pointer-events-none' 
                    : activeTool === 'laser'
                    ? 'cursor-none pointer-events-auto'
                    : 'cursor-crosshair pointer-events-auto'
                }`}
                onMouseDown={handleStartDrawing}
                onMouseMove={handleMoveDrawing}
                onMouseUp={handleEndDrawing}
                onMouseLeave={handleLeaveDrawing}
                onTouchStart={handleStartDrawing}
                onTouchMove={handleMoveDrawing}
                onTouchEnd={handleEndDrawing}
              />
            )}

            {/* Laser Pointer Glowing Indicator */}
            {canAnnotate && activeTool === 'laser' && laserPos && (
              <div 
                className="pointer-events-none absolute z-40 w-4 h-4 rounded-full bg-red-500 shadow-[0_0_18px_6px_rgba(239,68,68,0.95)] ring-2 ring-white/80 -translate-x-1/2 -translate-y-1/2 animate-pulse"
                style={{
                  left: `${laserPos.x * 100}%`,
                  top: `${laserPos.y * 100}%`
                }}
              />
            )}
          </div>
        )}

        {/* Floating Annotation & Drawing Dock */}
        {canAnnotate && activeTool !== 'pointer' && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-2 flex items-center gap-2 max-w-[95vw] flex-wrap justify-center animate-in fade-in slide-in-from-bottom-3 duration-200">
            {/* Tool Mode selector */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setActiveTool('pointer')}
                className="p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer text-slate-400 hover:text-white hover:bg-white/10"
                title="Sichqoncha ko'rsatkichi (V yoki Esc)"
              >
                <MousePointer size={15} />
                <span className="hidden sm:inline">Ko'rsatkich</span>
              </button>

              <button
                onClick={() => setActiveTool('pen')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTool === 'pen' ? 'bg-amber-400 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Qalam bilan chizish (P)"
              >
                <Pen size={15} />
                <span className="hidden sm:inline">Chizish</span>
              </button>

              <button
                onClick={() => setActiveTool('highlighter')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTool === 'highlighter' ? 'bg-yellow-400 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Marker bilan belgilash (H)"
              >
                <Highlighter size={15} />
                <span className="hidden sm:inline">Belgilash</span>
              </button>

              <button
                onClick={() => setActiveTool('laser')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTool === 'laser' ? 'bg-rose-500 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Lazer ko'rsatkich (L)"
              >
                <Sparkles size={15} />
                <span className="hidden sm:inline">Lazer</span>
              </button>

              <button
                onClick={() => setActiveTool('eraser')}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTool === 'eraser' ? 'bg-white/25 text-rose-400 font-bold shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="O'chirg'ich (E)"
              >
                <Eraser size={15} />
                <span className="hidden sm:inline">O'chirish</span>
              </button>
            </div>

            {/* Colors picker for pen & highlighter */}
            {(activeTool === 'pen' || activeTool === 'highlighter') && (
              <div className="flex items-center gap-1.5 px-2 border-l border-white/10">
                {ANNOTATION_COLORS.map(c => (
                  <button
                    key={c.value}
                    onClick={() => setStrokeColor(c.value)}
                    className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-115 flex items-center justify-center cursor-pointer shadow-sm"
                    style={{
                      backgroundColor: c.value,
                      borderColor: strokeColor === c.value ? '#38bdf8' : 'rgba(255,255,255,0.25)'
                    }}
                    title={c.label}
                  >
                    {strokeColor === c.value && (
                      <Check size={12} className={c.value === '#ffffff' || c.value === '#facc15' ? 'text-black font-black' : 'text-white font-black'} />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Thickness presets for pen & highlighter */}
            {(activeTool === 'pen' || activeTool === 'highlighter') && (
              <div className="flex items-center gap-1 px-2 border-l border-white/10">
                {[
                  { label: 'Yupqa', size: 2, dot: 4 },
                  { label: "O'rtacha", size: 4, dot: 7 },
                  { label: 'Qalin', size: 8, dot: 11 }
                ].map(s => (
                  <button
                    key={s.size}
                    onClick={() => setStrokeWidth(s.size)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                      strokeWidth === s.size ? 'bg-white/20 text-brand-accent ring-1 ring-white/30' : 'hover:bg-white/10 text-slate-400'
                    }`}
                    title={s.label}
                  >
                    <span
                      className="rounded-full bg-current"
                      style={{ width: `${s.dot}px`, height: `${s.dot}px` }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Actions: Undo, Clear, Close */}
            <div className="flex items-center gap-1 pl-2 border-l border-white/10">
              <button
                onClick={handleUndo}
                disabled={!annotations[currentPage] || annotations[currentPage].length === 0}
                className="p-2 rounded-lg text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all cursor-pointer"
                title="Oxirgisini bekor qilish (Ctrl+Z)"
              >
                <Undo2 size={15} />
              </button>

              <button
                onClick={handleClearSlide}
                disabled={!annotations[currentPage] || annotations[currentPage].length === 0}
                className="p-2 rounded-lg text-rose-400 hover:text-rose-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-rose-500/20 transition-all cursor-pointer"
                title="Ushbu slayddagi barcha chizmalarni tozalash"
              >
                <Trash2 size={15} />
              </button>

              <button
                onClick={() => setActiveTool('pointer')}
                className="p-2 ml-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                title="Chizish panelini yopish (Esc)"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        )}

        {/* Desktop Quick Nav Arrows on Stage hover */}
        {currentPage > 1 && (
          <button
            onClick={prevPage}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-black/50 hover:bg-black/80 text-white backdrop-blur border border-white/10 transition-all opacity-40 hover:opacity-100 z-20 cursor-pointer shadow-xl hidden sm:flex items-center justify-center"
            title="Oldingi slayd"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        {currentPage < totalPages && (
          <button
            onClick={nextPage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-black/50 hover:bg-black/80 text-white backdrop-blur border border-white/10 transition-all opacity-40 hover:opacity-100 z-20 cursor-pointer shadow-xl hidden sm:flex items-center justify-center"
            title="Keyingi slayd"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>

      {/* Thumbnails Sidebar / Drawer */}
      {showThumbnails && totalPages > 1 && (
        <div className="absolute top-12 right-0 bottom-16 w-64 bg-slate-900/95 backdrop-blur-md border-l border-slate-800 p-3 overflow-y-auto z-30 shadow-2xl flex flex-col gap-2 animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-bold text-slate-300">
            <span>Barcha slaydlar ({totalPages})</span>
            <button
              onClick={() => setShowThumbnails(false)}
              className="text-slate-500 hover:text-white text-xs cursor-pointer"
            >
              Yopish
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentPage(idx + 1);
                  setShowThumbnails(false);
                }}
                className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                  currentPage === idx + 1
                    ? 'bg-brand-accent text-brand-primary border-brand-accent font-bold'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                }`}
              >
                <div className="text-[10px] uppercase font-mono text-slate-400 mb-1">
                  Slayd
                </div>
                <div className="text-base font-black">
                  {idx + 1}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Unified Bottom Floating Navigation Bar */}
      <div className="bg-slate-900/95 backdrop-blur-md px-4 py-2 border-t border-slate-800 flex items-center justify-between text-white z-20 shrink-0 gap-2">
        {/* Left: Previous Topic / Keyboard info */}
        <div className="flex items-center gap-3">
          {onPrevTopic && (
            <button
              onClick={onPrevTopic}
              disabled={!hasPrevTopic}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl text-xs font-bold text-white transition-all flex items-center gap-1 cursor-pointer"
              title="Oldingi mavzuga o'tish"
            >
              <ChevronLeft size={14} />
              <span className="hidden sm:inline">Oldingi mavzu</span>
            </button>
          )}

          <div className="hidden md:flex text-[11px] text-slate-400 items-center gap-1.5">
            <span>Klaviatura:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono">←</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono">→</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] font-mono">F</kbd>
            <span className="hidden xl:inline text-slate-600">•</span>
            <span className="hidden xl:flex items-center gap-1 text-[10px] text-slate-400">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono">P</kbd> Chizish
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono ml-1">H</kbd> Belgilash
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono ml-1">L</kbd> Lazer
            </span>
          </div>
        </div>

        {/* Center: Slide Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={prevPage}
            disabled={currentPage <= 1}
            className="p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-slate-200 hover:text-white disabled:opacity-30 disabled:hover:bg-white/10 transition-all cursor-pointer"
            title="Oldingi slayd"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 font-mono text-xs">
            <span className="font-bold text-white">{currentPage}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{totalPages}</span>
          </div>

          <button
            onClick={nextPage}
            disabled={currentPage >= totalPages}
            className="p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-slate-200 hover:text-white disabled:opacity-30 disabled:hover:bg-white/10 transition-all cursor-pointer"
            title="Keyingi slayd"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Right: Progress % and Next Topic */}
        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-400 font-mono hidden xs:block">
            {Math.round((currentPage / totalPages) * 100)}%
          </div>

          {onNextTopic && (
            <button
              onClick={onNextTopic}
              disabled={!hasNextTopic}
              className="px-3 py-1.5 bg-brand-accent hover:bg-brand-accent/90 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl text-xs font-bold text-brand-primary transition-all flex items-center gap-1 cursor-pointer"
              title="Keyingi mavzuga o'tish"
            >
              <span className="hidden sm:inline">Keyingi mavzu</span>
              <ChevronRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
