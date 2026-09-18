import { uploadToSupabasePresentation, uploadWithFallbacks, validatePresentation, type PresentationBackend, type PresentationUploadResult } from './presentationStorage';
import { supabase, supabaseUrl, supabaseAnonKey } from './supabase';
import { storage } from './firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { ID } from 'appwrite';
import { appwriteStorage, isAppwriteEnabled } from './appwrite';

export interface UploadResult {
  url: string;
  fileName: string;
  fileType: 'pptx' | 'pdf';
  fileSize: number;
}

/**
 * Robust image uploader for Anatomical Diagrams and Illustrations
 * 1. Primary: Server /api/upload (fast, saves locally on server)
 * 2. Fallback: Firebase Storage
 * 3. Fallback: Base64 data URL if under 3MB
 */
export async function uploadImageFile(
  file: File,
  onProgress?: (percent: number) => void
): Promise<{ url: string; fileName: string }> {
  if (!file.type.startsWith('image/')) {
    throw new Error("Faqat rasm fayllari (JPG, PNG, WEBP, SVG) qo'llab-quvvatlanadi.");
  }

  // 1. Try Server /api/upload
  try {
    const serverResult = await uploadViaServerApi(file, onProgress);
    if (serverResult?.url) {
      return { url: serverResult.url, fileName: serverResult.fileName };
    }
  } catch (serverErr) {
    console.warn("[IMAGE UPLOAD] Server upload failed, trying Firebase storage fallback...", serverErr);
  }

  // 2. Fallback: Firebase Storage
  try {
    const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storageRef = ref(storage, `diagrams/${Date.now()}_${sanitized}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    const downloadUrl = await new Promise<string>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (snapshot.totalBytes > 0 && onProgress) {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(Math.round(progress));
          }
        },
        (error) => reject(error),
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          } catch (e) {
            reject(e);
          }
        }
      );
    });

    if (downloadUrl) {
      return { url: downloadUrl, fileName: file.name };
    }
  } catch (firebaseErr) {
    console.warn("[IMAGE UPLOAD] Firebase storage fallback failed:", firebaseErr);
  }

  // 3. Fallback: Client-side Base64 Data URL
  if (file.size <= 4 * 1024 * 1024) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ url: reader.result as string, fileName: file.name });
      reader.onerror = () => reject(new Error("Rasmni o'qishda xatolik"));
      reader.readAsDataURL(file);
    });
  }

  throw new Error("Rasmni yuklab bo'lmadi. Iltimos qaytadan urinib ko'ring yoki rasm havolasini kiriting.");
}

const PRESENTATION_MIME: Record<'pdf' | 'pptx', string> = {
  pdf: 'application/pdf',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
};

function safePresentationName(file: File): string {
  return `${crypto.randomUUID()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
}

/** 1. Supabase Storage (primary). Reports a clear reason when it is not configured at all. */
function supabaseBackend(): PresentationBackend {
  return {
    name: 'Supabase Storage',
    upload: async (file, onProgress) => {
      if (!supabase) throw new Error('sozlanmagan (VITE_SUPABASE_URL va VITE_SUPABASE_ANON_KEY yo‘q yoki noto‘g‘ri).');
      const { data, error } = await supabase.auth.getSession();
      if (error) throw new Error('Supabase sessiyasini tekshirib bo‘lmadi. Qayta kiring.');
      return uploadToSupabasePresentation(file, {
        url: supabaseUrl,
        key: supabaseAnonKey,
        token: data.session?.access_token || supabaseAnonKey,
      }, onProgress);
    },
  };
}

/** 2. Appwrite Storage, only when VITE_APPWRITE_PROJECT is configured. */
function appwriteBackend(): PresentationBackend | null {
  if (!isAppwriteEnabled() || !appwriteStorage) return null;
  const client = appwriteStorage;
  return {
    name: 'Appwrite Storage',
    upload: async (file, onProgress) => {
      const fileType = validatePresentation(file);
      onProgress?.(5);
      const created = await client.createFile('presentations', ID.unique(), file);
      const endpoint = (import.meta as any).env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
      const project = (import.meta as any).env.VITE_APPWRITE_PROJECT || '';
      onProgress?.(100);
      return {
        url: `${endpoint}/storage/buckets/presentations/files/${created.$id}/view?project=${project}`,
        fileName: file.name,
        fileType,
        fileSize: file.size,
      };
    },
  };
}

function firebaseStorageMessage(err: any): string {
  const code = String(err?.code || '');
  if (code === 'storage/unauthorized') return 'yozishga ruxsat yo‘q. storage.rules dagi presentations/ qoidasi va admin Google hisobi bilan kirilganini tekshiring.';
  if (code === 'storage/canceled') return 'yuklash bekor qilindi.';
  if (code === 'storage/retry-limit-exceeded') return 'tarmoq javob bermadi.';
  if (code === 'storage/unknown' || code === 'storage/project-not-found' || code === 'storage/bucket-not-found') {
    return 'Storage yoqilmagan yoki Firebase loyihasida billing (Blaze) sozlanmagan.';
  }
  return err?.message || 'noma’lum xatolik.';
}

/** 3. Firebase Storage `presentations/` folder (storage.rules allows admins up to 150 MB). */
function firebaseBackend(): PresentationBackend {
  return {
    name: 'Firebase Storage',
    upload: (file, onProgress) => new Promise<PresentationUploadResult>((resolve, reject) => {
      const fileType = validatePresentation(file);
      const storageRef = ref(storage, `presentations/${safePresentationName(file)}`);
      const task = uploadBytesResumable(storageRef, file, { contentType: PRESENTATION_MIME[fileType] });
      let lastLoaded = 0;
      let idle: ReturnType<typeof setTimeout>;
      const resetIdle = () => {
        clearTimeout(idle);
        idle = setTimeout(() => {
          task.cancel();
          reject(new Error('Firebase Storage javob bermayapti (20 soniya). Tarmoq va Storage holatini tekshiring.'));
        }, 20000);
      };
      resetIdle();
      onProgress?.(0);
      task.on(
        'state_changed',
        snapshot => {
          if (snapshot.bytesTransferred > lastLoaded) { lastLoaded = snapshot.bytesTransferred; resetIdle(); }
          if (snapshot.totalBytes > 0) onProgress?.(Math.min(99, Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100)));
        },
        err => { clearTimeout(idle); reject(new Error(firebaseStorageMessage(err))); },
        async () => {
          clearTimeout(idle);
          try {
            const url = await getDownloadURL(task.snapshot.ref);
            onProgress?.(100);
            resolve({ url, fileName: file.name, fileType, fileSize: file.size });
          } catch (e: any) {
            reject(new Error(firebaseStorageMessage(e)));
          }
        },
      );
    }),
  };
}

function isLocalDevHost(): boolean {
  if (typeof window === 'undefined') return false;
  return /^(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])$/.test(window.location.hostname);
}

/** 4. Local dev server disk (`/api/upload`). Vercel has no durable disk, so only on localhost. */
function localServerBackend(): PresentationBackend | null {
  if (!isLocalDevHost()) return null;
  return {
    name: 'Lokal server',
    upload: async (file, onProgress) => {
      const fileType = validatePresentation(file);
      const result = await uploadViaServerApi(file, onProgress);
      return { url: result.url, fileName: result.fileName || file.name, fileType, fileSize: file.size };
    },
  };
}

/**
 * Upload a presentation to durable storage and keep only the URL in Firestore.
 * Order: Supabase Storage → Appwrite Storage → Firebase Storage → local dev server.
 * A backend that is unreachable (wrong URL, paused project, DNS, RLS) no longer blocks
 * the upload: the next configured service is tried, and the final error names each failure.
 */
export async function uploadPresentationFile(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  const backends = [supabaseBackend(), appwriteBackend(), firebaseBackend(), localServerBackend()]
    .filter((b): b is PresentationBackend => b !== null);
  const { backend, ...result } = await uploadWithFallbacks(file, backends, onProgress);
  console.log(`[PRESENTATION UPLOAD] Saved via ${backend}: ${result.url}`);
  return result;
}

/**
 * Upload to /api/upload via XMLHttpRequest to provide accurate upload progress
 */
function uploadViaServerApi(
  file: File,
  onProgress?: (percent: number) => void
): Promise<{ url: string; fileName: string; size: number }> {
  return new Promise((resolve, reject) => {
    // Convert file to base64 using FileReader
    const reader = new FileReader();
    
    // Track file reading progress (first 0% -> 20%)
    reader.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 20));
      }
    };

    reader.onerror = () => {
      reject(new Error("Faylni o'qishda xatolik yuz berdi"));
    };

    reader.onload = () => {
      const base64Data = reader.result as string;

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.timeout = 180000; // 3 minutes timeout for large files

      // Real network upload progress (20% -> 100%)
      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = 20 + Math.round((event.loaded / event.total) * 80);
            onProgress(Math.min(99, percent));
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.url) {
              if (onProgress) onProgress(100);
              resolve(response);
            } else {
              reject(new Error(response.error || "Server javobida fayl manzili topilmadi"));
            }
          } catch (parseErr) {
            reject(new Error("Server javobini o'qib bo'lmadi"));
          }
        } else {
          try {
            const errRes = JSON.parse(xhr.responseText);
            reject(new Error(errRes.error || `Server xatoligi (${xhr.status})`));
          } catch {
            reject(new Error(`Server xatoligi (${xhr.status})`));
          }
        }
      };

      xhr.onerror = () => {
        reject(new Error("Server bilan tarmoq ulanishida xatolik yuz berdi"));
      };

      xhr.ontimeout = () => {
        reject(new Error("Fayl yuklash vaqti tugadi (Timeout). Iltimos, qayta urinib ko'ring yoki Google Drive linkidan foydalaning"));
      };

      const payload = JSON.stringify({
        fileName: file.name,
        fileData: base64Data,
        mimeType: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.presentationml.presentation')
      });

      xhr.send(payload);
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Formats any document URL to its best embeddable / viewable format
 */
export function formatPresentationUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // If it's a relative API route or static uploads, preserve as is
  if (trimmed.startsWith('/api/') || trimmed.startsWith('/uploads/')) {
    return trimmed;
  }

  // Google Drive
  const driveMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveMatch && driveMatch[1]) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  }
  const driveIdMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (trimmed.includes('drive.google.com') && driveIdMatch && driveIdMatch[1]) {
    return `https://drive.google.com/file/d/${driveIdMatch[1]}/preview`;
  }

  // Google Slides
  const slidesMatch = trimmed.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/);
  if (slidesMatch && slidesMatch[1]) {
    return `https://docs.google.com/presentation/d/${slidesMatch[1]}/embed?start=false&loop=false&delayms=3000`;
  }

  // Dropbox
  if (trimmed.includes('dropbox.com')) {
    return trimmed.replace('dl=0', 'raw=1');
  }

  return trimmed;
}

/**
 * Returns the best URL for embedding inside an iframe/object
 */
export function getPresentationEmbedUrl(url: string, fileType: 'pdf' | 'pptx'): string {
  if (!url) return '';
  const cleanUrl = formatPresentationUrl(url);

  // Direct PDF or Data URL
  if (fileType === 'pdf') {
    if (
      cleanUrl.startsWith('data:') ||
      cleanUrl.startsWith('/api/') ||
      cleanUrl.startsWith('/uploads/') ||
      cleanUrl.endsWith('.pdf')
    ) {
      return cleanUrl;
    }
    if (cleanUrl.includes('drive.google.com')) {
      return cleanUrl;
    }
    return `https://docs.google.com/viewer?url=${encodeURIComponent(cleanUrl)}&embedded=true`;
  }

  // PPTX
  if (cleanUrl.includes('drive.google.com') || cleanUrl.includes('docs.google.com')) {
    return cleanUrl;
  }

  // If it's a relative path on our server
  if (cleanUrl.startsWith('/')) {
    if (typeof window !== 'undefined') {
      const absoluteUrl = `${window.location.origin}${cleanUrl}`;
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(absoluteUrl)}`;
    }
    return cleanUrl;
  }

  return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(cleanUrl)}`;
}
