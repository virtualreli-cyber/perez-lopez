import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Inicializar el cliente únicamente si las credenciales están presentes
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://tu-proyecto-supabase.supabase.co')
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase) {
  console.warn('Supabase no está configurado o tiene valores por defecto. Se usará LocalStorage como fallback temporal.');
}
