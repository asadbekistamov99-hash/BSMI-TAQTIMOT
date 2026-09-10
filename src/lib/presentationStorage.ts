export const MAX_PRESENTATION_BYTES = 25 * 1024 * 1024;

export function validatePresentation(file: { name: string; size: number }): 'pdf' | 'pptx' {
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension !== 'pdf' && extension !== 'pptx') throw new Error('Faqat PPTX yoki PDF fayl tanlang.');
  if (file.size === 0) throw new Error('Tanlangan fayl bo‘sh.');
  if (file.size > MAX_PRESENTATION_BYTES) throw new Error('Fayl hajmi 25 MB dan oshmasligi kerak.');
  return extension;
}

export function storageUploadError(status: number, body: string): Error {
  let message = '';
  try { const parsed = JSON.parse(body); message = String(parsed.message || parsed.error || ''); } catch {}
  if (/bucket.*not found/i.test(message)) return new Error('Supabase Storage’da presentations bucket’i topilmadi.');
  if (status === 401 || status === 403 || /row.level|unauthorized|permission/i.test(message)) {
    return new Error('Supabase Storage yozishga ruxsat bermadi. Bucket siyosati va Supabase sessiyasini tekshiring. Firebase login Supabase sessiyasi o‘rnini bosmaydi.');
  }
  if (status === 413 || /maximum.*size|too large|size.*exceed/i.test(message)) return new Error('Supabase bucket hajm chegarasi faylni qabul qilmadi. Limitni 25 MB ga moslang.');
  return new Error(`Supabase Storage yuklash xatosi (${status}). Bucket sozlamalarini tekshiring.`);
}

export function uploadToSupabasePresentation(
  file: File,
  config: { url: string; key: string; token: string },
  onProgress?: (percent: number) => void,
  makeRequest: () => XMLHttpRequest = () => new XMLHttpRequest(),
): Promise<{ url: string; fileName: string; fileType: 'pdf' | 'pptx'; fileSize: number }> {
  const fileType = validatePresentation(file);
  const baseUrl = config.url.replace(/\/$/, '');
  if (!baseUrl.startsWith('https://') || !config.key || !config.token) throw new Error('Supabase URL yoki kaliti noto‘g‘ri sozlangan.');
  const filename = `${crypto.randomUUID()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const objectPath = `presentations/${encodeURIComponent(filename)}`;
  return new Promise((resolve, reject) => {
    const xhr = makeRequest();
    let finished = false;
    let sent = 0;
    let idle: ReturnType<typeof setTimeout>;
    const cleanup = () => { finished = true; clearTimeout(idle); };
    const fail = (error: Error) => { if (finished) return; cleanup(); reject(error); };
    const resetIdle = () => {
      clearTimeout(idle);
      idle = setTimeout(() => {
        fail(new Error('Supabase javob bermayapti. Loyiha URL’i, internet aloqasi va Storage holatini tekshiring.'));
        xhr.abort();
      }, 20000);
    };
    xhr.open('POST', `${baseUrl}/storage/v1/object/${objectPath}`, true);
    xhr.setRequestHeader('apikey', config.key);
    xhr.setRequestHeader('Authorization', `Bearer ${config.token}`);
    xhr.setRequestHeader('Content-Type', fileType === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    xhr.setRequestHeader('x-upsert', 'false');
    xhr.timeout = 300000;
    xhr.upload.onprogress = event => {
      if (finished) return;
      if (event.loaded > sent) { sent = event.loaded; resetIdle(); }
      if (event.lengthComputable) onProgress?.(Math.min(99, Math.round(event.loaded / event.total * 100)));
    };
    xhr.onload = () => {
      if (finished) return;
      if (xhr.status < 200 || xhr.status >= 300) { fail(storageUploadError(xhr.status, xhr.responseText)); return; }
      cleanup();
      onProgress?.(100);
      resolve({ url: `${baseUrl}/storage/v1/object/public/${objectPath}`, fileName: file.name, fileType, fileSize: file.size });
    };
    xhr.onerror = () => fail(new Error('Supabase manziliga ulanib bo‘lmadi. VITE_SUPABASE_URL, DNS va internet aloqasini tekshiring.'));
    xhr.ontimeout = () => fail(new Error('Supabase yuklash vaqti tugadi. Qayta urinib ko‘ring.'));
    xhr.onabort = () => fail(new Error('Fayl yuklash bekor qilindi.'));
    resetIdle();
    onProgress?.(0);
    try { xhr.send(file); } catch { fail(new Error('Faylni Supabase’ga yuborib bo‘lmadi.')); }
  });
}
