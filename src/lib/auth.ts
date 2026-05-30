import { getSupabase } from './supabase';
import type { Session, User } from '@supabase/supabase-js';

export async function signInAnonymously(): Promise<User | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.auth.signInAnonymously();
  if (error) {
    if (process.env.NODE_ENV === 'development') console.error('signInAnonymously:', error);
    return null;
  }
  return data.user;
}

export async function getSession(): Promise<Session | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  return data.session;
}

export async function getUser(): Promise<User | null> {
  const session = await getSession();
  return session?.user ?? null;
}

export async function upgradeToEmail(email: string, password: string): Promise<User | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.auth.updateUser({ email, password });
  if (error) {
    if (process.env.NODE_ENV === 'development') console.error('upgradeToEmail:', error);
    return null;
  }
  return data.user;
}

export async function signInWithGoogle(): Promise<{ error: string | null }> {
  const sb = getSupabase();
  if (!sb) return { error: 'خدمة المصادقة غير متاحة' };
  const redirectTo = `${window.location.origin}/auth/callback`;
  const { error } = await sb.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, queryParams: { access_type: 'offline', prompt: 'consent' } },
  });
  if (error) {
    console.error('[Supabase Google OAuth error]', error);
    return { error: error.message };
  }
  return { error: null };
  // Browser will redirect to Google — no code after this runs
}

export async function signInWithApple(): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  const redirectTo = `${window.location.origin}/auth/callback`;
  await sb.auth.signInWithOAuth({ provider: 'apple', options: { redirectTo } });
}


export async function sendEmailOtp(email: string): Promise<{ error: string | null }> {
  const sb = getSupabase();
  if (!sb) return { error: 'خدمة المصادقة غير متاحة' };
  const { error } = await sb.auth.signInWithOtp({ email });
  if (error) return { error: error.message };
  return { error: null };
}

export async function verifyEmailOtp(email: string, token: string): Promise<{ error: string | null }> {
  const sb = getSupabase();
  if (!sb) return { error: 'خدمة المصادقة غير متاحة' };
  const { error } = await sb.auth.verifyOtp({ email, token, type: 'email' });
  if (error) return { error: error.message };
  return { error: null };
}

export async function signOut(): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb.auth.signOut();
}
