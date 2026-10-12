/**
 * Per-tab memory of a successful Face ID check.
 *
 * Why: the gate used to demand a fresh AI verification on EVERY page reload.
 * Each verification is a network round-trip to the Gemini API — a chance to hit
 * a quota limit, a timeout, or a false rejection — and it burned the daily API
 * quota many times faster than needed. A student who has just passed Face ID in
 * this very browser tab is the same person a minute later.
 *
 * Scope is deliberately narrow: sessionStorage is per tab, is wiped when the tab
 * closes, is keyed by user id, and expires after FACE_ID_SESSION_TTL_MS. It does
 * not weaken the anti-sharing goal: another device or another browser still has
 * to pass Face ID. Set FACE_ID_SESSION_TTL_MS to 0 to restore verify-on-every-load.
 */

export const FACE_ID_SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours
const KEY_PREFIX = 'faceIdVerified:';

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  key?(index: number): string | null;
  readonly length?: number;
}

function defaultStorage(): StorageLike | null {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) return window.sessionStorage;
  } catch {
    // sessionStorage can throw in private mode / sandboxed iframes
  }
  return null;
}

export function readFaceIdSession(
  uid: string | undefined | null,
  now: number = Date.now(),
  storage: StorageLike | null = defaultStorage(),
  ttlMs: number = FACE_ID_SESSION_TTL_MS
): boolean {
  if (!uid || !storage || ttlMs <= 0) return false;
  try {
    const raw = storage.getItem(KEY_PREFIX + uid);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { at?: unknown; uid?: unknown };
    if (parsed?.uid !== uid || typeof parsed.at !== 'number') return false;
    if (now - parsed.at < 0 || now - parsed.at > ttlMs) {
      storage.removeItem(KEY_PREFIX + uid);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function writeFaceIdSession(
  uid: string | undefined | null,
  now: number = Date.now(),
  storage: StorageLike | null = defaultStorage()
): void {
  if (!uid || !storage) return;
  try {
    storage.setItem(KEY_PREFIX + uid, JSON.stringify({ uid, at: now }));
  } catch {
    // ignore quota / private-mode errors: worst case we re-verify next load
  }
}

export function clearFaceIdSession(
  uid?: string | null,
  storage: StorageLike | null = defaultStorage()
): void {
  if (!storage) return;
  try {
    if (uid) {
      storage.removeItem(KEY_PREFIX + uid);
      return;
    }
    const keys: string[] = [];
    const len = typeof storage.length === 'number' ? storage.length : 0;
    for (let i = 0; i < len; i++) {
      const k = storage.key ? storage.key(i) : null;
      if (k && k.startsWith(KEY_PREFIX)) keys.push(k);
    }
    keys.forEach(k => storage.removeItem(k));
  } catch {
    // ignore
  }
}
