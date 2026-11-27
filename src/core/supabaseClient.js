import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://bvzqkpoocgsbhusyzakg.supabase.co';

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  console.warn(
    '[Studio Pro] VITE_SUPABASE_ANON_KEY manquante : vérifiez vos variables d’environnement.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey ?? '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
