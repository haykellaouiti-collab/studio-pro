import { supabase } from './supabaseClient.js';

export async function invokeExportGate() {
  const { data, error } = await supabase.functions.invoke('export-gate');
  if (error) throw error;
  return data;
}
