import { supabase } from './supabaseClient.js';

export async function loginWithEmail(email, password) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signupWithEmail(email, password) {
  if (!password || password.length < 8) {
    return { error: new Error('Le mot de passe doit contenir au moins 8 caractères.') };
  }
  return supabase.auth.signUp({ email, password });
}

export async function logoutUser() {
  return supabase.auth.signOut();
}
