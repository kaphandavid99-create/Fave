import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

if (!hasSupabaseConfig) {
  console.error('Supabase environment variables not set. Database features will not work.');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

const fallbackSupabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    signOut: async () => ({ error: null }),
  },
  from: () => ({
    select: async () => ({ data: [], error: null }),
    insert: async () => ({ data: null, error: null }),
    update: async () => ({ data: null, error: null }),
    delete: async () => ({ data: null, error: null }),
  }),
  rpc: async () => ({ data: null, error: null }),
  channel: () => ({ subscribe: async () => ({ data: null, error: null }) }),
  removeChannel: () => undefined,
} as any;

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : fallbackSupabase;
