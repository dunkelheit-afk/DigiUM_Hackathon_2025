// lib/supabase/server.ts

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { Database } from '@/types/supabase' // Pastikan file ini ada dan benar
import { cookies } from 'next/headers'

// PERBAIKAN: Gunakan tipe eksplisit untuk argumen, bukan ReturnType
export function createClient(cookieStore: ReturnType<typeof cookies>) { 
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            (await cookieStore).set({ name, value, ...options })
          } catch (error) {
            // Ini bisa diabaikan jika 'set' dipanggil dari Server Component.
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            (await cookieStore).set({ name, value: '', ...options })
          } catch (error) {
            // Ini bisa diabaikan jika 'remove' dipanggil dari Server Component.
          }
        },
      },
    }
  )
}
