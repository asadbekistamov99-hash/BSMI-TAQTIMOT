// Foydalanuvchi Gemini API kalitining formati (klient va server uchun umumiy).
// Gemini kalitlari odatda "AIza" bilan boshlanadi va 39 belgi atrofida bo'ladi.

export function isValidGeminiKeyShape(key: unknown): key is string {
  return typeof key === 'string' && /^AIza[0-9A-Za-z_-]{30,}$/.test(key.trim());
}

/** Kalitni ko'rsatish uchun yashiradi: AIza••••••••abcd */
export function maskGeminiKey(key: string): string {
  const k = (key || '').trim();
  if (k.length <= 8) return '••••••••';
  return `${k.slice(0, 4)}${'•'.repeat(8)}${k.slice(-4)}`;
}
