// Foydalanuvchi Gemini API kalitining formati (klient va server uchun umumiy).
// Gemini API kalitlari: Google AI Studio (AQ... yoki AIzaSy...) va Google Cloud kalitlari.

/** Kalitdagi ortiqcha belgilarni (quotes, 'Bearer ', 'export GEMINI_API_KEY=') tozalaydi */
export function sanitizeGeminiKey(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  let clean = raw.trim();
  clean = clean.replace(/^(export\s+)?(GEMINI_API_KEY|API_KEY)\s*=\s*/i, '');
  clean = clean.replace(/^Bearer\s+/i, '');
  clean = clean.replace(/^["'`]|["'`]$/g, '').trim();
  return clean;
}

/** Kalit formati haqiqiy Gemini kalitiga mos kelishini tekshiradi */
export function isValidGeminiKeyShape(key: unknown): key is string {
  const clean = sanitizeGeminiKey(key);
  if (!clean || clean.length < 20 || clean.length > 130) return false;
  // Faqat ruxsat etilgan belgilar: harflar, raqamlar, chiziqcha, pastki chiziqcha, nuqta
  if (!/^[0-9A-Za-z_.\-]+$/.test(clean)) return false;
  // AIza... (Google API key, 39 belgi) yoki AQ... (Google AI Studio yangi formati) yoki boshqa rasmiy formatlar
  return clean.startsWith('AIza') || clean.startsWith('AQ') || clean.length >= 30;
}

/** Kalitni xavfsiz ko'rsatish uchun yashiradi: AQ.A••••••••DA yoki AIza••••••••k1 */
export function maskGeminiKey(key: string): string {
  const k = sanitizeGeminiKey(key);
  if (k.length <= 8) return '••••••••';
  return `${k.slice(0, 4)}${'•'.repeat(8)}${k.slice(-4)}`;
}
