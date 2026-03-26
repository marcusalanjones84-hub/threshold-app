// Real Supabase client for THRESHOLD
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Running in demo mode.');
}

// Create Supabase client with fetch options to prevent body stream issues
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    global: {
      fetch: (url, options = {}) => {
        return fetch(url, { ...options });
      }
    }
  }
);

// Helper to check if we're in real mode
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey);
};
