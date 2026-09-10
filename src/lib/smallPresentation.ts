import { MAX_INLINE_PRESENTATION_BYTES } from './presentationPayload';

// Small files are persisted with the topic when the user clicks Save.
// No storage-provider requests are needed to prepare them for saving.
export async function prepareSmallPresentation(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string | null> {
  if (file.size === 0 || file.size > MAX_INLINE_PRESENTATION_BYTES) return null;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (event.lengthComputable) onProgress?.(Math.min(99, Math.round(event.loaded / event.total * 100)));
    };
    reader.onerror = () => reject(new Error('Faylni o‘qib bo‘lmadi. Qayta tanlang.'));
    reader.onabort = () => reject(new Error('Faylni o‘qish bekor qilindi.'));
    reader.onload = () => {
      if (typeof reader.result !== 'string' || !reader.result.startsWith('data:')) {
        reject(new Error('Faylni o‘qib bo‘lmadi. Qayta tanlang.'));
        return;
      }
      onProgress?.(100);
      resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
