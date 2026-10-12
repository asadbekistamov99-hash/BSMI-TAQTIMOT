import { uploadToSupabasePresentation } from './presentationStorage';
import { supabase, supabaseUrl, supabaseAnonKey } from './supabase';
import { db, storage } from './firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export interface UploadResult {
  url: string;
  fileName: string;
  fileType: 'pptx' | 'pdf';
  fileSize: number;
}

export interface VideoUploadResult {
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
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

/** Upload presentations directly to durable storage; keep only the URL in Firestore. */
export async function uploadPresentationFile(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  const fileType: 'pptx' | 'pdf' = extension === 'pdf' ? 'pdf' : 'pptx';
  const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  let supabaseError: string | null = null;

  // 1. Primary: Try Supabase Storage
  if (supabase && supabaseUrl && !supabaseUrl.includes('YOUR_SUPABASE_URL')) {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token || supabaseAnonKey;
      const result = await uploadToSupabasePresentation(file, {
        url: supabaseUrl,
        key: supabaseAnonKey,
        token,
      }, onProgress);
      if (result?.url) {
        return result;
      }
    } catch (err: any) {
      console.warn("[UPLOAD] Supabase Storage failed, falling back to Firebase Storage:", err);
      supabaseError = err?.message || String(err);
    }
  }

  // 2. Secondary: Try Firebase Storage
  try {
    const storageRef = ref(storage, `presentations/${Date.now()}_${sanitized}`);
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
      return {
        url: downloadUrl,
        fileName: file.name,
        fileType,
        fileSize: file.size
      };
    }
  } catch (firebaseErr: any) {
    console.warn("[UPLOAD] Firebase Storage fallback also failed:", firebaseErr);
  }

  // If both failed, construct a helpful and actionable error
  if (supabaseError) {
    throw new Error(
      `Faylni yuklab bo'lmadi. Sabab: Supabase loyihangiz to'xtatilgan (paused) yoki Vercel'da VITE_SUPABASE_URL noto'g'ri sozlangan. Iltimos, Supabase hisobingizga kirib loyihani faollashtiring yoki pastdagi "2-usul: Fayl havolasi" orqali Google Drive havolasini kiriting.`
    );
  }

  throw new Error(
    "Faylni yuklab bo'lmadi. Iltimos, pastdagi '2-usul: Fayl havolasi' orqali Google Drive yoki boshqa to'g'ridan-to'g'ri havolani kiriting."
  );
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

/**
 * Dedicated file uploader for Anatomical Video Lessons (MP4, WebM, MOV, MKV, M4V)
 * 1. Primary: Supabase Storage (bucket: 'videos' - up to 500MB, high-speed CDN delivery)
 * 2. Secondary: Server /api/upload (up to 150MB)
 * 3. Fallback: Firebase Storage (bucket: 'videos')
 */
export async function uploadVideoFile(
  file: File,
  onProgress?: (percent: number) => void
): Promise<VideoUploadResult> {
  const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500 MB
  if (file.size > MAX_VIDEO_SIZE) {
    throw new Error("Video fayl hajmi 500 MB dan oshmasligi kerak. Katta hajmdagi videolarni YouTube yoki Google Drive orqali havola sifatida joylashtirish tavsiya etiladi.");
  }

  const validVideoTypes = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime',
    'video/x-matroska',
    'video/mp2t',
    'video/x-m4v'
  ];

  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const isVideoExt = ['mp4', 'webm', 'mov', 'ogg', 'mkv', 'm4v', 'avi'].includes(ext);

  if (!file.type.startsWith('video/') && !isVideoExt) {
    throw new Error("Faqat video formatidagi fayllarni yuklash mumkin (.mp4, .webm, .mov, .m4v, .mkv).");
  }

  const sanitized = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `videos/video_${Date.now()}_${sanitized}`;

  // 1. Primary: Supabase Storage
  if (supabase) {
    try {
      console.log(`[VIDEO UPLOAD] Uploading ${(file.size / 1024 / 1024).toFixed(1)} MB video to Supabase Storage 'videos'...`);
      const { data, error } = await supabase.storage.from('videos').upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage.from('videos').getPublicUrl(filePath);
        if (publicUrl) {
          if (onProgress) onProgress(100);
          return {
            url: publicUrl,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type || 'video/mp4'
          };
        }
      }
    } catch (supaErr) {
      console.warn("[VIDEO UPLOAD] Supabase Storage upload failed, trying next target...", supaErr);
    }
  }

  // 2. Secondary: Server /api/upload (if within server limit)
  if (file.size <= 150 * 1024 * 1024) {
    try {
      console.log(`[VIDEO UPLOAD] Trying server upload...`);
      const serverResult = await uploadViaServerApi(file, onProgress);
      if (serverResult?.url) {
        return {
          url: serverResult.url,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type || 'video/mp4'
        };
      }
    } catch (serverErr) {
      console.warn("[VIDEO UPLOAD] Server upload failed:", serverErr);
    }
  }

  // 3. Fallback: Firebase Storage
  try {
    const storageRef = ref(storage, `videos/${Date.now()}_${sanitized}`);
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
      return {
        url: downloadUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || 'video/mp4'
      };
    }
  } catch (firebaseErr: any) {
    console.warn("[VIDEO UPLOAD] Firebase Storage fallback failed:", firebaseErr);
  }

  throw new Error(
    "Video faylni yuklab bo'lmadi. Supabase Storage sozlamalarini tekshiring yoki videoni YouTube / Google Drive ga yuklab, havolasini kiriting."
  );
}

/**
 * Checks whether a given URL points directly to an HTML5 playable video stream/file
 */
export function isDirectVideoUrl(url: string): boolean {
  if (!url) return false;
  const clean = url.trim().toLowerCase();
  
  if (
    clean.endsWith('.mp4') || 
    clean.endsWith('.webm') || 
    clean.endsWith('.ogg') || 
    clean.endsWith('.mov') || 
    clean.endsWith('.m4v')
  ) {
    return true;
  }

  if (
    clean.includes('/storage/v1/object/public/videos/') ||
    clean.includes('/api/files/') ||
    (clean.includes('firebasestorage.googleapis.com') && clean.includes('videos%2F'))
  ) {
    return true;
  }

  return false;
}

