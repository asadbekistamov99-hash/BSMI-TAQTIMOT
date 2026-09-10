import { db, storage } from './firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { dbService } from './dbService';

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

/**
 * Robust file uploader for Anatomical Presentations (PPTX & PDF).
 * Delegates to dbService.uploadFileWithProgress, which already tries (in order):
 *   1. Local /api/upload (fast, only reliable on a persistent server, e.g. localhost)
 *   2. Appwrite Storage (if VITE_APPWRITE_* env vars are configured)
 *   3. Supabase Storage (if VITE_SUPABASE_* env vars are configured — free tier,
 *      no credit card / billing account required, a good escape hatch when
 *      Firebase Storage is blocked by a Google Cloud billing issue)
 *   4. Firebase Storage (requires the Blaze billing plan to be active on the
 *      Firebase project — Google now requires this even for small free-tier usage)
 *   5. Base64 Data URI (last resort, presentations up to 600 KiB)
 * This means presentations automatically benefit from whichever backend is
 * actually configured and working, instead of being hard-locked to Firebase.
 */
export async function uploadPresentationFile(
  file: File,
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  const fileName = file.name;
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  if (!['pptx', 'pdf'].includes(extension)) {
    throw new Error('Faqat PPTX yoki PDF fayl tanlang.');
  }
  if (file.size === 0) throw new Error('Tanlangan fayl bo‘sh. Boshqa fayl tanlang.');
  const fileType: 'pptx' | 'pdf' = extension === 'pdf' ? 'pdf' : 'pptx';
  const MAX_SIZE = 150 * 1024 * 1024; // 150 MB

  if (file.size > MAX_SIZE) {
    throw new Error("Fayl hajmi 150 MB dan oshmasligi kerak. Iltimos, kichikroq fayl tanlang yoki Google Drive havolasidan foydalaning.");
  }

  const sanitized = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${Date.now()}_${sanitized}`;

  try {
    const url = await dbService.uploadFileWithProgress('presentations', filePath, file, (p) => onProgress?.(p));
    return { url, fileName, fileType, fileSize: file.size };
  } catch (err: any) {
    const message = String(err?.message || err || '');
    if (message.includes('storage/unauthorized')) {
      throw new Error(
        "STORAGE_RULES_MISSING: Firebase Storage xavfsizlik qoidalari 'presentations/' papkasiga yozishga ruxsat bermayapti. " +
        "Admin: Firebase Console → Storage → Rules bo'limiga o'ting va storage.rules faylidagi yangilangan qoidalarni joylashtiring."
      );
    }
    if (message.includes('billing') || message.includes('403') || message.includes('storage/unknown')) {
      throw new Error(
        "STORAGE_BILLING_BLOCKED: Firebase Storage ishlamayapti (loyihada Blaze to'lov rejasi faollashtirilmagan yoki billing xatoligi bor). " +
        "Muqobil yechim: bepul Supabase (kartasiz) hisob oching va VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY o'zgaruvchilarini sozlang — " +
        "shunda fayllar avtomatik Supabase Storage orqali yuklanadi."
      );
    }
    throw new Error(message || "Faylni yuklashda xatolik yuz berdi. Iltimos, fayl hajmini tekshiring yoki Google Drive / tashqi havola orqali biriktiring.");
  }
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
