export function faceVerificationError(error: unknown) {
  const err = error as { status?: number; name?: string; message?: string } | null;
  const message = String(err?.message || '').toLowerCase();
  const failure = (status: number, code: string, reason: string, retryable = false) =>
    ({ status, code, reason, retryable });
  if (message.includes('gemini_api_key sozlanmagan')) {
    return failure(503, 'FACE_API_KEY_MISSING', 'Yuzni tekshirish xizmati sozlanmagan. Administrator serverda GEMINI_API_KEY ni sozlashi kerak.');
  }
  if (err?.status === 401 || err?.status === 403 || /api.key.not.valid|api_key_invalid|permission_denied/.test(message)) {
    return failure(503, 'FACE_API_ACCESS_DENIED', 'Yuzni tekshirish xizmatiga ruxsat berilmadi. Administrator API kaliti va uning ruxsatlarini tekshirishi kerak.');
  }
  if (err?.status === 429 || /resource_exhausted|quota/.test(message)) {
    return failure(503, 'FACE_API_QUOTA', 'Yuzni tekshirish xizmati limiti tugagan. Administrator Gemini kvotasi va billing holatini tekshirishi kerak.');
  }
  if (err?.name === 'AbortError' || err?.name === 'TimeoutError' || /timeout|timed out|aborted/.test(message)) {
    return failure(504, 'FACE_API_TIMEOUT', 'Yuzni tekshirish xizmati vaqtida javob bermadi. Birozdan so‘ng qayta urinib ko‘ring.', true);
  }
  if (err?.status === 503 || /high demand|overloaded/.test(message)) {
    return failure(503, 'FACE_API_BUSY', 'Yuzni tekshirish xizmati hozir band. 30 soniyadan so‘ng qayta urinib ko‘ring.', true);
  }
  return failure(503, 'FACE_API_UNAVAILABLE', 'Yuzni tekshirish xizmati vaqtincha ishlamayapti. Birozdan so‘ng qayta urinib ko‘ring.', true);
}
