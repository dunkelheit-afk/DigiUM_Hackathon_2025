// lib/supabase/client.ts

import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase' // <-- Impor tipe Database

// Definisikan fungsi untuk membuat Supabase client di sisi browser
export function createClient() {
  return createBrowserClient<Database>( // <-- Gunakan tipe Database di sini
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
