import { createClient as _createClient, SupabaseClient } from '@supabase/supabase-js';

let _instance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (typeof window === 'undefined') return null;
  if (_instance) return _instance;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  _instance = _createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
  return _instance;
}

export { _createClient as createClient };
