import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence, signInAnonymously, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, getFirestore, enableNetwork } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Initialize Firestore robustly; use experimentalForceLongPolling to bypass WebSocket connection blocks in sandboxed environments
let dbInstance;
try {
  dbInstance = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    }),
    experimentalForceLongPolling: true
  }, firebaseConfig.firestoreDatabaseId);
} catch (e) {
  console.warn("[FIREBASE] Standard multi-tab persistent cache initialization failed, trying single-tab cache...", e);
  try {
    dbInstance = initializeFirestore(app, {
      localCache: persistentLocalCache({}),
      experimentalForceLongPolling: true
    }, firebaseConfig.firestoreDatabaseId);
  } catch (err2) {
    console.warn("[FIREBASE] Single-tab persistent cache initialization failed, falling back to memory long-polling...", err2);
    try {
      dbInstance = initializeFirestore(app, {
        experimentalForceLongPolling: true
      }, firebaseConfig.firestoreDatabaseId);
    } catch (err3) {
      console.warn("[FIREBASE] Memory long-polling failed, falling back to standard getFirestore...", err3);
      dbInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
    }
  }
}

export const db = dbInstance;

export async function reconnectFirestore() {
  try {
    await enableNetwork(dbInstance);
    console.log("[FIREBASE] Network connection successfully enabled/re-established.");
    return true;
  } catch (e) {
    console.warn("[FIREBASE] Failed to re-enable Firestore network connection:", e);
    return false;
  }
}

export const auth = getAuth(app);

export async function robustSignInAnonymously(authObj: any) {
  try {
    return await signInAnonymously(authObj);
  } catch (error: any) {
    console.warn("Standard anonymous login failed, trying fallback guest user account...", error);
    const guestEmail = "guest@bsmi-anatomy.uz";
    const guestPassword = "guestPassword123!";
    try {
      const cred = await signInWithEmailAndPassword(authObj, guestEmail, guestPassword);
      return cred;
    } catch (signInError: any) {
      if (
        signInError.code === 'auth/user-not-found' || 
        signInError.code === 'auth/invalid-credential' || 
        signInError.code === 'auth/invalid-login-credentials' ||
        signInError.code === 'auth/wrong-password' ||
        signInError.code === 'auth/operation-not-allowed' ||
        signInError.code === 'auth/admin-restricted-operation'
      ) {
        try {
          const cred = await createUserWithEmailAndPassword(authObj, guestEmail, guestPassword);
          return cred;
        } catch (createError: any) {
          console.warn("Failed to create fallback guest account. Resorting to LOCAL Virtual Guest fallback...", createError);
          const mockUser = {
            uid: 'local_virtual_guest',
            isAnonymous: true,
            displayName: 'Mehmon Talaba',
            email: 'guest@bsmi-anatomy.uz'
          };
          sessionStorage.setItem('virtualGuestUser', JSON.stringify(mockUser));
          window.dispatchEvent(new Event('local_auth_changed'));
          return { user: mockUser };
        }
      } else {
        console.warn("Failed to sign in to fallback guest account. Resorting to LOCAL Virtual Guest fallback...", signInError);
        const mockUser = {
          uid: 'local_virtual_guest',
          isAnonymous: true,
          displayName: 'Mehmon Talaba',
          email: 'guest@bsmi-anatomy.uz'
        };
        sessionStorage.setItem('virtualGuestUser', JSON.stringify(mockUser));
        window.dispatchEvent(new Event('local_auth_changed'));
        return { user: mockUser };
      }
    }
  }
}

// Enforce browser-grade local storage persistence for users stays logged in
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Firebase auth persistence set error:", error);
});

export const storage = getStorage(app);
storage.maxUploadRetryTime = 3600000; // 60 minutes
storage.maxOperationRetryTime = 3600000; // 60 minutes
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: errorMessage,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };

  const isOfflineOrUnavailable = 
    errorMessage.includes('offline') || 
    errorMessage.includes('unavailable') || 
    errorMessage.includes('Could not reach') ||
    errorMessage.includes('Connection failed') ||
    errorMessage.includes('Failed to get document');

  if (isOfflineOrUnavailable) {
    console.warn('Firestore Info (Offline/Network):', JSON.stringify(errInfo));
  } else {
    console.error('Firestore Error:', JSON.stringify(errInfo));
  }
}
