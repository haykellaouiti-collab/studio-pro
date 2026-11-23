import { supabase } from './supabaseClient.js';

export async function fetchIsCreator(userId) {
  if (!userId) return false;
  const { data } = await supabase
    .from('subscriptions')
    .select('status, current_period_end')
    .eq('user_id', userId)
    .maybeSingle();

  if (!data || !['active', 'trialing'].includes(data.status)) return false;
  if (data.current_period_end && new Date(data.current_period_end) <= new Date()) return false;
  return true;
}
