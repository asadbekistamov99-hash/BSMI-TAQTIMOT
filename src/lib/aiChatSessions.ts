import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from './firebase';

// AI chat suhbatlari: har bir suhbat alohida (lokal va bulutda)
export type ChatSession = { id: string; title: string; updatedAt: string; messages: any[] };

const MAX_LOCAL_SESSIONS = 20;
const MAX_MESSAGES = 100;
const localKey = (uid?: string | null) => `bsmi_ai_sessions_${uid || 'guest'}`;

export function newSessionId(): string {
  return `s_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function makeTitle(messages: any[]): string {
  const first = messages.find((m) => m.role === 'user');
  const text = (first?.parts?.[0]?.text || '').trim();
  if (!text) return 'Yangi suhbat';
  return text.length > 40 ? `${text.slice(0, 40)}…` : text;
}

export function makeSession(messages: any[]): ChatSession {
  return { id: newSessionId(), title: makeTitle(messages), updatedAt: new Date().toISOString(), messages };
}

export function loadLocalSessions(uid?: string | null): ChatSession[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(localKey(uid)) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalSessions(uid: string | null | undefined, list: ChatSession[]): void {
  try {
    localStorage.setItem(localKey(uid), JSON.stringify(list.slice(0, MAX_LOCAL_SESSIONS)));
  } catch (e) {
    console.warn('Lokal chat saqlashda xatolik:', e);
  }
}

// Eski versiyadagi yagona suhbatni o'qish (bir martalik ko'chirish uchun)
export function readLegacyChat(uid?: string | null): any[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(`bsmi_anatomy_chat_${uid || 'guest'}`) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function fetchRemoteSessions(uid: string): Promise<ChatSession[]> {
  const snap = await getDocs(collection(db, 'users', uid, 'ai_chats'));
  return snap.docs
    .filter((d) => d.id !== 'default_session')
    .map((d) => {
      const x: any = d.data();
      return {
        id: d.id,
        title: x.title || 'Suhbat',
        updatedAt: x.updatedAt || '',
        messages: Array.isArray(x.messages) ? x.messages : [],
      };
    });
}

export async function pushRemoteSession(uid: string, s: ChatSession): Promise<void> {
  await setDoc(
    doc(db, 'users', uid, 'ai_chats', s.id),
    { userId: uid, title: s.title, updatedAt: s.updatedAt, messages: s.messages.slice(-MAX_MESSAGES), messageCount: s.messages.length },
    { merge: true }
  );
}

export async function dropRemoteSession(uid: string, id: string): Promise<void> {
  await deleteDoc(doc(db, 'users', uid, 'ai_chats', id));
}
