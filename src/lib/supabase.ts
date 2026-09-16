import { createClient } from '@supabase/supabase-js';

// Read all potential variants (including truncated ones from UI typos)
let rawUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
let rawKey = 
  (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY || 
  (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 
  (import.meta as any).env.VITE_SUPABASE_ANO || 
  (import.meta as any).env.VITE_SUPABASE_ANON || 
  '';

// Clean inputs (strip whitespace and wrapping quotes)
rawUrl = typeof rawUrl === 'string' ? rawUrl.trim().replace(/^["']|["']$/g, '') : '';
rawKey = typeof rawKey === 'string' ? rawKey.trim().replace(/^["']|["']$/g, '') : '';

// Auto-correct: If user only provided the project subdomain/ID (e.g. "jxpccffbidnjlxrkdlz")
let formattedUrl = rawUrl;
if (rawUrl && !rawUrl.includes('.') && !rawUrl.startsWith('http')) {
  formattedUrl = `https://${rawUrl}.supabase.co`;
} else if (rawUrl && !rawUrl.startsWith('http')) {
  formattedUrl = `https://${rawUrl}`;
}
// Strip trailing slash for clean path concatenation
formattedUrl = formattedUrl.replace(/\/+$/, '');

export const supabaseUrl = formattedUrl;
export const supabaseAnonKey = rawKey;

// Safely verify if Supabase credentials are valid/provided to prevent startup crashes.
export const isSupabaseConfigured = (): boolean => {
  const looksLikeRegion = rawKey.includes('-') && rawKey.length < 15;
  return (
    typeof supabaseUrl === 'string' &&
    (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://')) &&
    supabaseUrl !== 'YOUR_SUPABASE_URL' &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.length >= 25 && // JWTs are always very long (typically > 100 chars); regions are short
    supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' &&
    !looksLikeRegion
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      global: {
        headers: {
          'x-client-info': 'anatomya-ai-portal/2.0',
        },
      },
      db: {
        schema: 'public',
      },
    })
  : null;

if (isSupabaseConfigured()) {
  console.log('🔌 Supabase client successfully initialized with URL:', supabaseUrl);
} else {
  console.log('ℹ️ Supabase environment keys missing or invalid format. Using Firebase fallback mode.');
}

/**
 * Ensure that a storage bucket exists and is public in Supabase
 */
export async function ensureSupabaseBucket(bucketName: string): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = buckets?.some(b => b.name === bucketName);
    if (!exists) {
      const { error } = await supabase.storage.createBucket(bucketName, { public: true });
      if (error && !error.message?.includes('already exists')) {
        console.warn(`[SUPABASE] Bucket creation notice for "${bucketName}":`, error.message);
      }
    }
    return true;
  } catch (err) {
    // Non-fatal if RLS restricts bucket listing
    return false;
  }
}

/**
 * Get direct public CDN URL for a file in Supabase Storage
 */
export function getSupabasePublicUrl(bucketName: string, filePath: string): string {
  if (!supabaseUrl) return '';
  const cleanPath = filePath.replace(/^\/+/, '');
  return `${supabaseUrl}/storage/v1/object/public/${bucketName}/${cleanPath}`;
}

/**
 * High-performance, resumable/progress-aware uploader directly to Supabase Storage.
 * Uses XMLHttpRequest to report exact 0-100% progress for large video lessons, PPTX and PDF files.
 */
export async function uploadToSupabaseWithProgress(
  bucketName: string,
  filePath: string,
  file: File | Blob,
  onProgress?: (percent: number) => void
): Promise<string> {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error("Supabase konfiguratsiya qilinmagan.");
  }

  // Ensure bucket is available (best-effort)
  await ensureSupabaseBucket(bucketName).catch(() => {});

  const cleanPath = filePath.replace(/^\/+/, '');
  const targetUrl = `${supabaseUrl}/storage/v1/object/${bucketName}/${cleanPath}`;

  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', targetUrl, true);

    xhr.setRequestHeader('apikey', supabaseAnonKey);
    xhr.setRequestHeader('Authorization', `Bearer ${supabaseAnonKey}`);
    xhr.setRequestHeader('x-upsert', 'true');
    if (file.type) {
      xhr.setRequestHeader('Content-Type', file.type);
    }

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && event.total > 0) {
          const pct = Math.round((event.loaded / event.total) * 100);
          onProgress(Math.min(99, Math.max(1, pct)));
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        if (onProgress) onProgress(100);
        const publicUrl = getSupabasePublicUrl(bucketName, cleanPath);
        resolve(publicUrl);
      } else {
        // Try fallback via supabase SDK client directly in case of endpoint variation
        supabase.storage
          .from(bucketName)
          .upload(cleanPath, file, { upsert: true, cacheControl: '3600' })
          .then(({ data, error }) => {
            if (error) {
              reject(new Error(error.message || `Supabase yuklashda xatolik (${xhr.status}): ${xhr.responseText}`));
            } else {
              if (onProgress) onProgress(100);
              const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(cleanPath);
              resolve(publicUrl);
            }
          })
          .catch((sdkErr) => {
            reject(new Error(`Supabase yuklash xatosi: ${sdkErr.message || xhr.statusText}`));
          });
      }
    };

    xhr.onerror = () => {
      // Try fallback to standard SDK upload
      supabase.storage
        .from(bucketName)
        .upload(cleanPath, file, { upsert: true, cacheControl: '3600' })
        .then(({ error }) => {
          if (error) {
            reject(new Error(`Supabase tarmoq xatosi: ${error.message}`));
          } else {
            if (onProgress) onProgress(100);
            const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(cleanPath);
            resolve(publicUrl);
          }
        })
        .catch((e) => reject(e));
    };

    xhr.send(file);
  });
}


