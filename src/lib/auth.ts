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

export async function signInWithGoogle(): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  const redirectTo = `${window.location.origin}/auth/callback`;
  await sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
}


export async function signInWithEmail(email: string, password: string): Promise<{ error: string | null }> {
  const sb = getSupabase();
  if (!sb) return { error: 'خدمة المصادقة غير متاحة' };
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  return { error: null };
}

export async function signUpWithEmail(email: string, password: string): Promise<{ error: string | null }> {
  const sb = getSupabase();
  if (!sb) return { error: 'خدمة المصادقة غير متاحة' };
  const { error } = await sb.auth.signUp({ email, password });
  if (error) return { error: error.message };
  return { error: null };
}

export async function resetPassword(email: string): Promise<{ error: string | null }> {
  const sb = getSupabase();
  if (!sb) return { error: 'خدمة المصادقة غير متاحة' };
  const redirectTo = `${window.location.origin}/auth/callback`;
  const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) return { error: error.message };
  return { error: null };
}

export async function signOut(): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  await sb.auth.signOut();
}
