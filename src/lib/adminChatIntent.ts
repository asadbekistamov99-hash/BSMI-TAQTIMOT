// Admin AI chat uchun deterministik buyruq tahlili.
// Model ba'zan amalni chaqirmasdan "bajarildi" deb javob beradi; bu yerdagi
// funksiyalar shunday holatlarni aniqlab, amalni majburan bajartirish uchun ishlatiladi.

/** Turli apostrof belgilarini bitta ko'rinishga keltiradi va kichik harfga o'tkazadi. */
export function normalizeUzText(text: string): string {
  return (text || '').toLowerCase().replace(/[ʻʼ’‘`´]/g, "'");
}

// Ma'lumotni o'zgartirishni so'raydigan buyruq fe'llari (o'zakdan boshlanadi: "qil", "qiling", "qilib" ...)
const ACTION_STEMS = [
  "qil", "qo'sh", "o'zgartir", "o'chir", "yangila", "blokla", "blokdan", "tasdiqla", "rad et",
  "yarat", "ulab", "ulang", "kirit", "e'lon", "ruxsat ber", "qo'y", "belgila", "almashtir", "tikla", "tahrirla",
];

/** Xabar ma'lumotni o'zgartiruvchi buyruqmi (savol emas)? */
export function isActionRequest(message: string): boolean {
  const t = normalizeUzText(message).trim();
  if (!t || t.endsWith('?')) return false;
  return ACTION_STEMS.some((stem) => new RegExp(`(^|[^a-z'])${stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(t));
}

export type PriceCommand = { priceUZS?: number; priceUSD?: number };

/**
 * "semestr narxini 50000 so'm qil", "narx 50 000 so'm", "narxini 50 ming qil", "dollar narxini 5 qil"
 * kabi buyruqlardan narxni ajratib oladi. Savol yoki raqamsiz matn uchun null qaytaradi.
 */
export function parsePriceCommand(message: string): PriceCommand | null {
  const t = normalizeUzText(message).trim();
  if (!t || t.endsWith('?') || !/narx/.test(t)) return null;
  if (!isActionRequest(t) && !/narx\S*\s*[:=]/.test(t)) return null;

  // Harf va raqam aralash so'zlar (masalan maxfiy kod) narx deb olinmasin
  const after = t.slice(t.search(/narx/)).replace(/\S*[a-z]\S*\d\S*|\S*\d\S*[a-z]\S*/g, (w) => (/^\d+(so'?m|sum|uzs|\$)$/.test(w) ? w : ' '));
  const m = after.match(/(\d{1,3}(?:[ .,]\d{3})+|\d+)\s*(ming)?\s*(so'?m|sum|uzs|\$|dollar|usd)?/);
  if (!m) return null;

  let value = Number(m[1].replace(/[ .,]/g, ''));
  if (m[2]) value *= 1000;
  if (!Number.isFinite(value) || value <= 0) return null;

  const isUsd = (m[3] && /\$|dollar|usd/.test(m[3])) || (!m[3] && /\$|dollar|usd/.test(t));
  if (isUsd) return { priceUSD: value };
  // So'mdagi semestr narxi 1000 dan kam bo'lishi mumkin emas — bunday holatni modelga qoldiramiz
  return value >= 1000 ? { priceUZS: value } : null;
}

/** Joriy xabar yoki suhbat tarixida maxfiy kod bormi? (faqat serverda chaqiriladi) */
export function containsSecretCode(texts: string[], secret: string): boolean {
  const s = normalizeUzText(secret).trim();
  if (!s) return false;
  return texts.some((x) => normalizeUzText(x).includes(s));
}
