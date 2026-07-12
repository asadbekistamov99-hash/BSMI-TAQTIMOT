import { Client, Databases, Storage, Account } from 'appwrite';

const endpoint = (import.meta as any).env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const project = (import.meta as any).env.VITE_APPWRITE_PROJECT || '';
const databaseId = (import.meta as any).env.VITE_APPWRITE_DATABASE_ID || 'default';

const client = new Client();

export const isAppwriteConfigured = (): boolean => {
  return (
    typeof project === 'string' &&
    project.trim().length > 5 &&
    project !== 'YOUR_APPWRITE_PROJECT_ID'
  );
};

if (isAppwriteConfigured()) {
  client.setEndpoint(endpoint).setProject(project);
}

export const appwriteClient = client;
export const appwriteDb = isAppwriteConfigured() ? new Databases(client) : null;
export const appwriteStorage = isAppwriteConfigured() ? new Storage(client) : null;
export const appwriteAccount = isAppwriteConfigured() ? new Account(client) : null;
export const appwriteDatabaseId = databaseId;

export let appwriteFallbackActive = false;

export const isAppwriteEnabled = (): boolean => {
  return isAppwriteConfigured() && !appwriteFallbackActive;
};

export const activateAppwriteFallback = () => {
  appwriteFallbackActive = true;
};

export const deactivateAppwriteFallback = () => {
  appwriteFallbackActive = false;
};

if (isAppwriteConfigured()) {
  console.log('🔌 Appwrite client successfully initialized with project ID:', project);
} else {
  console.log('ℹ️ Appwrite environment project ID missing. Using Supabase or Firebase fallback mode.');
}
