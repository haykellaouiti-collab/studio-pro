import { createClient } from '@supabase/supabase-js';
import { APP_CONFIG } from './config.js';

export const supabase = createClient(APP_CONFIG.supabaseUrl, APP_CONFIG.supabaseAnonKey);

export async function getCurrentSession() {
  const { data } = await supabase.auth.getSession();
  return data?.session ?? null;
}

export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
}

export async function signUpWithEmail(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export async function signOutUser() {
  await supabase.auth.signOut();
}

export async function checkCreatorSubscription(userId) {
  if (!userId) return false;
  const { data, error } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', userId)
    .in('status', ['active', 'trialing'])
    .limit(1);

  if (error) return false;
  return Boolean(data && data.length > 0);
}

export function buildDodoCheckoutUrl(user, returnUrl = window.location.origin) {
  const url = new URL(APP_CONFIG.dodoCheckoutBaseUrl);
  url.searchParams.set('quantity', '1');
  url.searchParams.set('redirect_url', returnUrl);
  if (user?.email) url.searchParams.set('prefilled_email', user.email);
  if (user?.id) url.searchParams.set('metadata[user_id]', user.id);
  return url.toString();
}
