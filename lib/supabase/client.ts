// lib/supabase/client.ts

import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase' // <-- LANGKAH 1: Impor tipe Database

export function createClient() {
  return createBrowserClient<Database>( // <-- LANGKAH 2: Gunakan tipe Database di sini
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}