// Foydalanuvchi Gemini API kalitining formati (klient va server uchun umumiy).
// Gemini API kalitlari ikki formatda keladi: eski "AIza..." va yangi "AQ...." (Google AI Studio).

export function isValidGeminiKeyShape(key: unknown): key is string {
  return typeof key === 'string' && /^(AIza|AQ\.)[0-9A-Za-z_.\-]{30,}$/.test(key.trim());
}

/** Kalitni ko'rsatish uchun yashiradi: AQ.A••••••••DA */
export function maskGeminiKey(key: string): string {
  const k = (key || '').trim();
  if (k.length <= 8) return '••••••••';
  return `${k.slice(0, 4)}${'•'.repeat(8)}${k.slice(-4)}`;
}
