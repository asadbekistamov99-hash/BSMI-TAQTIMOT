import { createClient } from '@supabase/supabase-js';

// Read all potential variants (including truncated ones from UI typos)
let rawUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
let rawKey = 
  (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY || 
  (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 
  (import.meta as any).env.VITE_SUPABASE_ANO || 
  (import.meta as any).env.VITE_SUPABASE_ANON || 
  '';

// Clean inputs
rawUrl = typeof rawUrl === 'string' ? rawUrl.trim() : '';
rawKey = typeof rawKey === 'string' ? rawKey.trim() : '';

// Auto-correct: If user only provided the project subdomain/ID (e.g. "jxpccffbidnjlxrkdlz")
let formattedUrl = rawUrl;
if (rawUrl && !rawUrl.includes('.') && !rawUrl.startsWith('http')) {
  formattedUrl = `https://${rawUrl}.supabase.co`;
}

export const supabaseUrl = formattedUrl;
export const supabaseAnonKey = rawKey;

// Safely verify if Supabase credentials are valid/provided to prevent startup crashes.
export const isSupabaseConfigured = (): boolean => {
  const looksLikeRegion = rawKey.includes('-') && rawKey.length < 15;
  return (
    typeof supabaseUrl === 'string' &&
    (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://')) &&
    supabaseUrl !== 'YOUR_SUPABASE_URL' &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.length >= 25 && // JWTs are always very long (typically > 100 chars); regions are short
    supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY' &&
    !looksLikeRegion
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (isSupabaseConfigured()) {
  console.log('🔌 Supabase client successfully initialized with URL:', supabaseUrl);
} else {
  console.log('ℹ️ Supabase environment keys missing or invalid format. Using Firebase fallback mode.');
}

