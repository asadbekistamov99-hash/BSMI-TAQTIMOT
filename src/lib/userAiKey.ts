import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase';
import { sanitizeGeminiKey, isValidGeminiKeyShape } from './aiKeyFormat';

// Foydalanuvchining shaxsiy AI kaliti: users/{uid}/private/aiSettings (faqat egasi o'qiy oladi)
const keyRef = (uid: string) => doc(db, 'users', uid, 'private', 'aiSettings');

let cached: { uid: string; key: string | null } | null = null;

export async function getUserAiKey(uid?: string | null): Promise<string | null> {
  if (!uid) {
    return getActiveAiKeySync();
  }

  if (cached && cached.uid === uid && cached.key) return cached.key;
  
  // 1. LocalStorage fast check
  let localKey: string | null = null;
  try {
    localKey = localStorage.getItem(`bsmi_ai_key_${uid}`) || localStorage.getItem('bsmi_ai_key_active');
  } catch {}

  // 2. Remote Firestore sync
  try {
    const snap = await getDoc(keyRef(uid));
    if (snap.exists() && snap.data()?.geminiKey) {
      const remoteKey = sanitizeGeminiKey(snap.data().geminiKey);
      if (remoteKey) {
        cached = { uid, key: remoteKey };
        try {
          localStorage.setItem(`bsmi_ai_key_${uid}`, remoteKey);
          localStorage.setItem('bsmi_ai_key_active', remoteKey);
        } catch {}
        return remoteKey;
      }
    }
  } catch (err) {
    console.warn("Firestore getUserAiKey error, using local fallback:", err);
  }

  if (localKey) {
    const clean = sanitizeGeminiKey(localKey);
    cached = { uid, key: clean };
    return clean;
  }

  cached = { uid, key: null };
  return null;
}

export async function saveUserAiKey(uid: string | null | undefined, key: string): Promise<void> {
  const cleanKey = sanitizeGeminiKey(key);
  if (!cleanKey) return;

  try {
    if (uid) localStorage.setItem(`bsmi_ai_key_${uid}`, cleanKey);
    localStorage.setItem('bsmi_ai_key_active', cleanKey);
  } catch {}
  
  cached = { uid: uid || 'active_guest', key: cleanKey };
  
  if (uid) {
    try {
      await setDoc(keyRef(uid), { geminiKey: cleanKey, updatedAt: serverTimestamp() });
    } catch (err) {
      console.warn("Firestore saveUserAiKey sync error:", err);
    }
  }

  try {
    window.dispatchEvent(new CustomEvent('bsmi_ai_key_changed', { detail: { key: cleanKey } }));
  } catch {}
}

export async function removeUserAiKey(uid?: string | null): Promise<void> {
  try {
    if (uid) localStorage.removeItem(`bsmi_ai_key_${uid}`);
    localStorage.removeItem('bsmi_ai_key_active');
  } catch {}
  
  cached = { uid: uid || 'active_guest', key: null };

  if (uid) {
    try {
      await deleteDoc(keyRef(uid));
    } catch (err) {
      console.warn("Firestore removeUserAiKey sync error:", err);
    }
  }

  try {
    window.dispatchEvent(new CustomEvent('bsmi_ai_key_changed', { detail: { key: null } }));
  } catch {}
}

export async function getIdTokenOrNull(): Promise<string | null> {
  try {
    if (!auth.currentUser) {
      await new Promise<void>((resolve) => {
        const unsubscribe = auth.onAuthStateChanged(() => {
          unsubscribe();
          resolve();
        });
        setTimeout(resolve, 2000);
      });
    }
    return (await auth.currentUser?.getIdToken(true)) ?? null;
  } catch {
    return null;
  }
}

export function getActiveAiKeySync(): string | null {
  try {
    const val = localStorage.getItem('bsmi_ai_key_active');
    return val ? sanitizeGeminiKey(val) : null;
  } catch {
    return null;
  }
}

export async function getActiveUserAiKey(uid?: string | null): Promise<string | null> {
  if (uid) {
    try {
      const k = await getUserAiKey(uid);
      if (k) return k;
    } catch {}
  }
  return getActiveAiKeySync();
}
