import { useEffect, useState } from 'react';
import { supabase } from '../core/supabaseClient.js';
import { loginWithEmail, signupWithEmail, logoutUser } from '../core/authService.js';

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data?.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_ev, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { user, signIn: loginWithEmail, signUp: signupWithEmail, signOut: logoutUser };
}
