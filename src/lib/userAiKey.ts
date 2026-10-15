import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase';

// Foydalanuvchining shaxsiy AI kaliti: users/{uid}/private/aiSettings (faqat egasi o'qiy oladi)
const keyRef = (uid: string) => doc(db, 'users', uid, 'private', 'aiSettings');

let cached: { uid: string; key: string | null } | null = null;

export async function getUserAiKey(uid: string): Promise<string | null> {
  if (cached && cached.uid === uid) return cached.key;
  const snap = await getDoc(keyRef(uid));
  const key = snap.exists() ? ((snap.data().geminiKey as string) || null) : null;
  cached = { uid, key };
  return key;
}

export async function saveUserAiKey(uid: string, key: string): Promise<void> {
  await setDoc(keyRef(uid), { geminiKey: key.trim(), updatedAt: serverTimestamp() });
  cached = { uid, key: key.trim() };
}

export async function removeUserAiKey(uid: string): Promise<void> {
  await deleteDoc(keyRef(uid));
  cached = { uid, key: null };
}

export async function getIdTokenOrNull(): Promise<string | null> {
  try {
    return (await auth.currentUser?.getIdToken()) ?? null;
  } catch {
    return null;
  }
}
